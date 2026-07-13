import { chromium, type Browser, type Page } from "playwright";
import { CONFIG } from "./config";
import type { RawOpportunity } from "./types";
import type { OpportunitySource } from "./source";

/**
 * CALIBRATION NOTE (read before debugging this file):
 *
 * This scraper was written without live access to sam.gov — this sandbox's network
 * policy blocks the domain, so none of the request/response shapes below have been
 * verified against the real site. It drives the public opportunity search UI with
 * Playwright (no login required for read-only search) and listens for the JSON the
 * page's own frontend fetches, rather than hardcoding one exact endpoint path, since
 * SAM.gov has changed its internal API shape before and will again.
 *
 * The FIRST real run (from GitHub Actions, or manually with `npm run sam:report`)
 * should be treated as a calibration pass: if `fetchOpportunities` finds zero results,
 * check the console warnings this file logs — they print the URL/shape of any JSON
 * responses seen that did NOT look like a search results payload, which is the
 * fastest way to spot a field-name or endpoint mismatch and fix FIELD_ALIASES below.
 *
 * Confirmed against real data: the notice detail URL format
 * (`sam.gov/workspace/contract/opp/<32-char-hex-id>/view`, from the company's own pipeline
 * spreadsheet links); the detail page's record endpoint
 * (`sam.gov/api/prod/opps/v2/opportunities/<id>?api_key=null`, `application/hal+json`); and
 * that record's actual shape — the real fields are nested under a `data2` wrapper this file
 * didn't originally know about (`{ data2: { title, solicitationNumber, naics: [{code}],
 * solicitation: { setAside, deadlines: { response } }, placeOfPerformance: { city, state },
 * organizationId, pointOfContact: [{fullName, email}] }, additionalInfo: {...} }`).
 * `parseDetailRecord` below builds a RawOpportunity straight from that confirmed shape.
 *
 * Still unconfirmed: where the full description/synopsis text and posted date live in that
 * same object (needed for the SF/lease-term parsing in parseRequirements.ts — until this is
 * found, pipeline items will keep showing no requirements text, which is a safe default, not
 * a crash), and the search page's results endpoint — the search page has never fired an
 * opportunities-search request in any run so far, even once the URL matched the SPA's own
 * canonical query-param format (confirmed via the final page URL after a run), only
 * unrelated dropdown/alert calls. FIELD_ALIASES / extractResultArray below remain a guess
 * for that path only.
 */

const SEARCH_RESPONSE_URL_HINT = /sam\.gov\/.*(search|opportunit|\/opp\/)/i;

// SAM.gov's internal API has used different field names across versions. We check
// each of these, in order, for every canonical field we need.
const FIELD_ALIASES = {
  noticeId: ["noticeId", "_id", "opportunityId", "id"],
  title: ["title", "opportunityTitle", "solicitationTitle"],
  solicitationNumber: ["solicitationNumber", "solNum"],
  department: ["department", "fullParentPathName", "agencyName"],
  subTier: ["subTier", "subtier"],
  office: ["office", "officeName"],
  noticeType: ["type", "noticeType", "baseType"],
  postedDate: ["postedDate", "publishDate"],
  responseDeadline: ["responseDeadLine", "responseDate", "closeDate"],
  setAside: ["typeOfSetAside", "setAside", "setAsideDescription"],
  naicsCode: ["naicsCode", "naics"],
  description: ["description", "descriptionText", "synopsis"],
} as const;

function pick(obj: Record<string, unknown>, keys: readonly string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v;
    if (typeof v === "number") return String(v);
  }
  return undefined;
}

/** Some SAM.gov responses nest the actual hit list under a wrapper key. Unwrap defensively. */
function extractResultArray(body: unknown): Record<string, unknown>[] | null {
  if (Array.isArray(body)) return body as Record<string, unknown>[];
  if (body && typeof body === "object") {
    for (const key of ["opportunitiesData", "results", "data", "_embedded", "hits"]) {
      const val = (body as Record<string, unknown>)[key];
      if (Array.isArray(val)) return val as Record<string, unknown>[];
    }
  }
  return null;
}

function looksLikeOpportunity(item: Record<string, unknown>): boolean {
  return Boolean(pick(item, FIELD_ALIASES.noticeId) && pick(item, FIELD_ALIASES.title));
}

interface DetailRecordData2 {
  title?: string;
  solicitationNumber?: string;
  organizationId?: string;
  naics?: { code?: string[]; type?: string }[];
  solicitation?: { setAside?: string; deadlines?: { response?: string } };
  placeOfPerformance?: { city?: { name?: string }; state?: { code?: string; name?: string } };
  pointOfContact?: { fullName?: string; email?: string }[];
  description?: string;
  descriptionText?: string;
  synopsis?: string;
  postedDate?: string;
  publishDate?: string;
}

/** Confirmed shape of `sam.gov/api/prod/opps/v2/opportunities/<id>` — see CALIBRATION NOTE. */
function parseDetailRecord(noticeId: string, body: unknown): RawOpportunity | null {
  const data2 = (body as { data2?: DetailRecordData2 } | undefined)?.data2;
  if (!data2 || typeof data2.title !== "string") return null;

  const primaryNaics = data2.naics?.find((n) => n.type === "primary") ?? data2.naics?.[0];
  const city = data2.placeOfPerformance?.city?.name;
  const state = data2.placeOfPerformance?.state?.code ?? data2.placeOfPerformance?.state?.name;
  const location = city && state ? `${city}, ${state}` : city || state;
  const poc = data2.pointOfContact?.[0]?.fullName;

  return {
    noticeId,
    title: data2.title,
    solicitationNumber: data2.solicitationNumber,
    department: undefined,
    subTier: undefined,
    office: [poc, location].filter(Boolean).join(" — ") || undefined,
    noticeType: undefined,
    postedDate: data2.postedDate ?? data2.publishDate,
    responseDeadline: data2.solicitation?.deadlines?.response,
    setAside: data2.solicitation?.setAside,
    naicsCode: primaryNaics?.code?.[0],
    uiLink: `https://sam.gov/workspace/contract/opp/${noticeId}/view`,
    description: data2.description ?? data2.descriptionText ?? data2.synopsis ?? "",
  };
}

function toRawOpportunity(item: Record<string, unknown>): RawOpportunity {
  const noticeId = pick(item, FIELD_ALIASES.noticeId) ?? "";
  return {
    noticeId,
    title: pick(item, FIELD_ALIASES.title) ?? "(untitled notice)",
    solicitationNumber: pick(item, FIELD_ALIASES.solicitationNumber),
    department: pick(item, FIELD_ALIASES.department),
    subTier: pick(item, FIELD_ALIASES.subTier),
    office: pick(item, FIELD_ALIASES.office),
    noticeType: pick(item, FIELD_ALIASES.noticeType),
    postedDate: pick(item, FIELD_ALIASES.postedDate),
    responseDeadline: pick(item, FIELD_ALIASES.responseDeadline),
    setAside: pick(item, FIELD_ALIASES.setAside),
    naicsCode: pick(item, FIELD_ALIASES.naicsCode),
    uiLink: noticeId ? `https://sam.gov/workspace/contract/opp/${noticeId}/view` : "https://sam.gov",
    description: pick(item, FIELD_ALIASES.description) ?? "",
  };
}

function searchUrl(): string {
  const postedFrom = new Date(Date.now() - CONFIG.lookbackDays * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const params = new URLSearchParams({
    index: "opp",
    sort: "-modifiedDate",
    page: "0",
    size: "100",
    postedFrom: fmt(postedFrom),
    postedTo: fmt(new Date()),
    naics: CONFIG.naicsCodes.join(","),
  });
  return `https://sam.gov/search/?${params.toString()}`;
}

interface ResponseDebugEntry {
  url: string;
  status: number;
  contentType: string;
}

/** Logs a truncated snippet of a JSON body that matched the URL hint but didn't parse as an opportunity. */
function logUnmatchedJson(url: string, body: unknown): void {
  // Bumped from 1000: the detail record confirmed so far is a few KB, and the still-missing
  // description/postedDate fields are further in than the first 1000 chars reached.
  const snippet = JSON.stringify(body).slice(0, 6000);
  console.warn(`[sam-gov] JSON response from ${url} didn't look like opportunity data — body starts: ${snippet}`);
}

/** Logs a compact diagnostic dump when scraping comes up empty, so calibration doesn't have to guess blind. */
async function logDiagnostics(page: Page, label: string, seenResponses: ResponseDebugEntry[]): Promise<void> {
  console.warn(`[sam-gov] --- diagnostics for ${label} ---`);
  console.warn(`[sam-gov] final page URL: ${page.url()}`);
  try {
    console.warn(`[sam-gov] page title: ${await page.title()}`);
  } catch {
    // ignore — page may already be closed
  }
  const interesting = seenResponses
    .filter((r) => r.status >= 300 || r.contentType.includes("json") || r.contentType.includes("html"))
    .slice(0, 20);
  for (const r of interesting) {
    console.warn(`[sam-gov]   ${r.status} ${r.contentType || "(no content-type)"} ${r.url}`);
  }
  if (seenResponses.length === 0) {
    console.warn("[sam-gov]   No network responses observed at all — page may have failed to load.");
  }
}

/**
 * Passive listeners registered via `page.on("response", async (r) => { ... await r.json() ... })`
 * turned out to be the actual bug behind several rounds of "zero results, zero errors, zero
 * anything" runs: the listener's promise keeps running in the background after the function
 * that registered it has already returned and the page has been closed, so a body read that's
 * still in flight at that point is simply abandoned — it never resolves *or* rejects, which is
 * why not even the try/catch added for calibration ever printed anything. `page.waitForResponse`
 * ties the wait directly to the navigation instead, so the read always happens before the page
 * closes. Collector functions below only use the passive listener for cheap, synchronous
 * bookkeeping (recording URL/status/content-type for diagnostics) — never for reading a body.
 */

async function collectSearchResults(page: Page): Promise<Record<string, unknown>[]> {
  const collected: Record<string, unknown>[] = [];
  const seenIds = new Set<string>();
  const seenResponses: ResponseDebugEntry[] = [];
  // No confirmed search-results endpoint yet (see CALIBRATION NOTE), so we still discover it
  // passively — but every body read is tracked and awaited below before the page can close,
  // rather than left to resolve in the background where it could be silently orphaned.
  const pendingReads: Promise<void>[] = [];

  page.on("response", (response) => {
    const url = response.url();
    const contentType = response.headers()["content-type"] ?? "";
    seenResponses.push({ url, status: response.status(), contentType });

    if (!SEARCH_RESPONSE_URL_HINT.test(url) || !contentType.includes("json")) return;

    pendingReads.push(
      response
        .json()
        .then((body: unknown) => {
          const arr = extractResultArray(body);
          if (!arr) {
            logUnmatchedJson(url, body);
            return;
          }
          const opportunities = arr.filter(looksLikeOpportunity);
          if (opportunities.length === 0) {
            logUnmatchedJson(url, body);
            return;
          }
          for (const item of opportunities) {
            const id = pick(item, FIELD_ALIASES.noticeId);
            if (!id || seenIds.has(id)) continue;
            seenIds.add(id);
            collected.push(item);
          }
        })
        .catch((err: unknown) => {
          console.warn(`[sam-gov] error reading response body from ${url}:`, err);
        })
    );
  });

  await page.goto(searchUrl(), { waitUntil: "networkidle", timeout: 60_000 });
  // Give any lazily-triggered XHRs a moment to land after networkidle fires.
  await page.waitForTimeout(2_000);
  await Promise.allSettled(pendingReads);

  if (collected.length === 0) {
    await logDiagnostics(page, "search", seenResponses);
  }

  return collected;
}

async function collectDetailResult(page: Page, noticeId: string): Promise<RawOpportunity | null> {
  const seenResponses: ResponseDebugEntry[] = [];
  page.on("response", (response) => {
    seenResponses.push({ url: response.url(), status: response.status(), contentType: response.headers()["content-type"] ?? "" });
  });

  const recordUrlPattern = new RegExp(`/opportunities/${noticeId}(\\?|$)`);
  const recordResponsePromise = page
    .waitForResponse((r) => recordUrlPattern.test(r.url()), { timeout: 60_000 })
    .catch(() => null);

  await page.goto(`https://sam.gov/workspace/contract/opp/${noticeId}/view`, { waitUntil: "networkidle", timeout: 60_000 });

  const response = await recordResponsePromise;
  if (!response) {
    await logDiagnostics(page, `detail ${noticeId}`, seenResponses);
    return null;
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (err) {
    console.warn(`[sam-gov] response.json() failed for ${response.url()}:`, err);
    await logDiagnostics(page, `detail ${noticeId}`, seenResponses);
    return null;
  }

  const parsed = parseDetailRecord(noticeId, body);
  if (parsed) return parsed;

  logUnmatchedJson(response.url(), body);
  await logDiagnostics(page, `detail ${noticeId}`, seenResponses);
  return null;
}

/**
 * One browser process is launched lazily and reused for every page in a run — launching
 * a fresh Chromium instance per notice (the original approach) took ~1-2 minutes just in
 * launch overhead across the ~25+ pipeline lookups a typical run does, on top of actual
 * page-load time. A single shared browser with one page per lookup is far cheaper.
 */
export class PlaywrightOpportunitySource implements OpportunitySource {
  private browserPromise: Promise<Browser> | null = null;

  private getBrowser(): Promise<Browser> {
    if (!this.browserPromise) {
      this.browserPromise = chromium.launch({ headless: true });
    }
    return this.browserPromise;
  }

  async close(): Promise<void> {
    if (!this.browserPromise) return;
    const browser = await this.browserPromise;
    await browser.close();
    this.browserPromise = null;
  }

  async fetchOpportunities(): Promise<RawOpportunity[]> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    try {
      const raw = await collectSearchResults(page);

      if (raw.length === 0) {
        console.warn(
          "[sam-gov] No opportunity results captured. Either there were genuinely none in the " +
            "lookback window, or SEARCH_RESPONSE_URL_HINT / FIELD_ALIASES need calibrating against " +
            "the live site (see the CALIBRATION NOTE at the top of playwrightSource.ts)."
        );
      }

      return raw.map(toRawOpportunity).filter((o) => o.noticeId);
    } finally {
      await page.close();
    }
  }

  async fetchByNoticeId(noticeId: string): Promise<RawOpportunity | null> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    try {
      const item = await collectDetailResult(page, noticeId);
      if (!item) {
        console.warn(`[sam-gov] Could not find notice ${noticeId} on its detail page — it may have been removed, or the detail page's response shape needs calibrating.`);
        return null;
      }
      return item;
    } finally {
      await page.close();
    }
  }
}
