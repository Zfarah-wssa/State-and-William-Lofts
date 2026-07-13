import type { ParsedRequirements } from "./types";

const WORD_NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, twentyfive: 25, thirty: 30,
};

function toNumber(raw: string): number {
  const cleaned = raw.replace(/,/g, "").trim();
  if (/^\d+$/.test(cleaned)) return parseInt(cleaned, 10);
  const word = cleaned.toLowerCase().replace(/[\s-]/g, "");
  return WORD_NUMBERS[word] ?? NaN;
}

/**
 * Square footage figures in SAM.gov lease notices almost always appear as either a single
 * number ("approximately 33,000 ABOA SF") or a range ("30,000 to 33,000 ABOA square feet").
 * We scan for each labeled measure independently and keep the widest range found for it.
 */
function extractSfRange(text: string, labelPattern: string): { min: number | null; max: number | null } {
  const numPart = String.raw`([\d]{1,3}(?:,\d{3})+|[\d]{4,7})`;
  const rangeRe = new RegExp(
    `${numPart}\\s*(?:to|-|–|and)\\s*${numPart}\\s*(?:square\\s*feet|sq\\.?\\s*ft\\.?|sf)?\\s*(?:${labelPattern})`,
    "gi"
  );
  const singleRe = new RegExp(
    `(?:${labelPattern})[^.\\n]{0,10}?${numPart}\\s*(?:to|-|–)?\\s*(${numPart})?\\s*(?:square\\s*feet|sq\\.?\\s*ft\\.?|sf)?`,
    "gi"
  );
  const reversedSingleRe = new RegExp(
    `${numPart}\\s*(?:square\\s*feet|sq\\.?\\s*ft\\.?|sf)?\\s*(?:of\\s+)?(?:${labelPattern})`,
    "gi"
  );

  let min: number | null = null;
  let max: number | null = null;

  const consider = (...values: (number | undefined)[]) => {
    for (const v of values) {
      if (v === undefined || Number.isNaN(v)) continue;
      if (min === null || v < min) min = v;
      if (max === null || v > max) max = v;
    }
  };

  for (const m of text.matchAll(rangeRe)) {
    consider(toNumber(m[1]), toNumber(m[2]));
  }
  for (const m of text.matchAll(singleRe)) {
    consider(toNumber(m[1]), m[2] ? toNumber(m[2]) : undefined);
  }
  for (const m of text.matchAll(reversedSingleRe)) {
    consider(toNumber(m[1]));
  }

  return { min, max };
}

function extractLeaseTermYears(text: string, kind: "firm" | "total"): number | null {
  const kindPattern = kind === "firm"
    ? String.raw`firm\s+(?:term|period)`
    : String.raw`(?:total|not\s+to\s+exceed|full)\s+(?:term|period)`;

  const numOrWord = String.raw`(\d{1,2}|${Object.keys(WORD_NUMBERS).join("|")})`;

  // "firm term of ten (10) years" / "firm term of 10 years"
  const re = new RegExp(
    `${kindPattern}[^.\\n]{0,40}?${numOrWord}\\s*(?:\\(\\s*\\d{1,2}\\s*\\)\\s*)?years?`,
    "i"
  );
  const match = text.match(re);
  if (!match) return null;
  const n = toNumber(match[1]);
  return Number.isNaN(n) ? null : n;
}

/**
 * Best-effort extraction of the square footage and lease term figures the company
 * screens on. SAM.gov synopsis text is unstructured and phrasing varies notice to
 * notice, so this is heuristic — when nothing conclusive is found we flag the
 * notice for manual review instead of silently dropping it, since the real figures
 * are sometimes only in an attached RLP/advertisement PDF this pass doesn't read.
 */
export function parseRequirements(description: string): ParsedRequirements {
  const text = description || "";

  const aboa = extractSfRange(text, "aboa|ansi\\/boma|usable|net\\s+usable");
  const rentable = extractSfRange(text, "rentable|rsf|boma\\s+office\\s+area");

  const leaseTermFirmYears = extractLeaseTermYears(text, "firm");
  const leaseTermTotalYears = extractLeaseTermYears(text, "total");

  const foundAnySf = aboa.min !== null || aboa.max !== null || rentable.min !== null || rentable.max !== null;
  const foundAnyTerm = leaseTermFirmYears !== null || leaseTermTotalYears !== null;

  return {
    aboaSfMin: aboa.min,
    aboaSfMax: aboa.max,
    rentableSfMin: rentable.min,
    rentableSfMax: rentable.max,
    leaseTermFirmYears,
    leaseTermTotalYears,
    needsManualReview: !(foundAnySf && foundAnyTerm),
  };
}

/** The single largest SF figure we found, used against the minSquareFeet threshold. */
export function bestSquareFeet(r: ParsedRequirements): number | null {
  const candidates = [r.aboaSfMax, r.aboaSfMin, r.rentableSfMax, r.rentableSfMin].filter(
    (v): v is number => v !== null
  );
  return candidates.length ? Math.max(...candidates) : null;
}

/** The firm term if stated; falls back to the total term if firm wasn't found. */
export function bestFirmTermYears(r: ParsedRequirements): number | null {
  return r.leaseTermFirmYears ?? r.leaseTermTotalYears;
}
