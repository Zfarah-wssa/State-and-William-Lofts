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
 * Confirmed against real data so far: the notice detail URL format
 * (`sam.gov/workspace/contract/opp/<32-char-hex-id>/view`, from the company's own
 * pipeline spreadsheet links) and the detail page's primary record endpoint
 * (`sam.gov/api/prod/opps/v2/opportunities/<id>?api_key=null`, `application/hal+json`).
 * Still unconfirmed: that endpoint's actual field names (FIELD_ALIASES below is a guess
 * that hasn't matched yet), and the search page's results endpoint — on the one real run
 * so far, the search page never fired any opportunities-search request at all, only
 * unrelated dropdown/alert calls, which may mean `searchUrl()`'s query params don't match
 * what the SPA expects and it never triggers a real search.
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
  const snippet = JSON.stringify(body).slice(0, 1000);
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

async function collectSearchResults(page: Page): Promise<Record<string, unknown>[]> {
  const collected: Record<string, unknown>[] = [];
  const seenIds = new Set<string>();
  const seenResponses: ResponseDebugEntry[] = [];

  page.on("response", async (response) => {
    const url = response.url();
    const contentType = response.headers()["content-type"] ?? "";
    seenResponses.push({ url, status: response.status(), contentType });

    if (!SEARCH_RESPONSE_URL_HINT.test(url)) return;
    if (!contentType.includes("json")) return;

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      return;
    }

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
  });

  await page.goto(searchUrl(), { waitUntil: "networkidle", timeout: 60_000 });
  // Give any lazily-triggered XHRs a moment to land after networkidle fires.
  await page.waitForTimeout(2_000);

  if (collected.length === 0) {
    await logDiagnostics(page, "search", seenResponses);
  }

  return collected;
}

async function collectDetailResult(page: Page, noticeId: string): Promise<Record<string, unknown> | null> {
  let found: Record<string, unknown> | null = null;
  const seenResponses: ResponseDebugEntry[] = [];

  page.on("response", async (response) => {
    if (found) return;
    const url = response.url();
    const contentType = response.headers()["content-type"] ?? "";
    seenResponses.push({ url, status: response.status(), contentType });

    if (!SEARCH_RESPONSE_URL_HINT.test(url)) return;
    if (!contentType.includes("json")) return;

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      return;
    }

    if (body && typeof body === "object" && looksLikeOpportunity(body as Record<string, unknown>)) {
      found = body as Record<string, unknown>;
      return;
    }
    const arr = extractResultArray(body);
    const match = arr?.find((item) => pick(item, FIELD_ALIASES.noticeId) === noticeId);
    if (match) {
      found = match;
      return;
    }
    // Only the primary detail record endpoint is worth dumping here — the page also fires
    // several other json calls scoped to this notice (history, resources, related orgs, etc.)
    // that aren't the record itself and would just add noise.
    if (new RegExp(`/opportunities/${noticeId}(\\?|$)`).test(url)) {
      logUnmatchedJson(url, body);
    }
  });

  await page.goto(`https://sam.gov/workspace/contract/opp/${noticeId}/view`, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(2_000);

  if (!found) {
    await logDiagnostics(page, `detail ${noticeId}`, seenResponses);
  }

  return found;
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
      return toRawOpportunity(item);
    } finally {
      await page.close();
    }
  }
}
