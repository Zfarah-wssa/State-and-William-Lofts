import { CONFIG } from "./config";
import { parseRequirements, bestSquareFeet, bestFirmTermYears } from "./parseRequirements";
import type { EvaluatedOpportunity, RawOpportunity } from "./types";

/** Cheap pre-filter so we don't bother deep-parsing notices that are obviously irrelevant. */
export function isCandidate(raw: RawOpportunity): boolean {
  const naicsMatch = raw.naicsCode ? (CONFIG.naicsCodes as readonly string[]).includes(raw.naicsCode) : false;

  const haystack = `${raw.title} ${raw.description}`.toLowerCase();
  const keywordMatch = CONFIG.keywords.some((kw) => haystack.includes(kw));

  const agencies: readonly string[] = CONFIG.agencies;
  const agencyOk =
    agencies.length === 0 || agencies.some((a) => raw.department?.toLowerCase().includes(a.toLowerCase()));

  return (naicsMatch || keywordMatch) && agencyOk;
}

export function evaluateOpportunity(raw: RawOpportunity): EvaluatedOpportunity {
  const requirements = parseRequirements(raw.description);
  const sf = bestSquareFeet(requirements);
  const term = bestFirmTermYears(requirements);

  const matchesThresholds =
    !requirements.needsManualReview &&
    sf !== null &&
    term !== null &&
    sf >= CONFIG.minSquareFeet &&
    term >= CONFIG.minFirmLeaseTermYears;

  return { ...raw, requirements, matchesThresholds };
}
