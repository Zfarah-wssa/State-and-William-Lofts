import { CONFIG } from "./config";
import type { EvaluatedOpportunity, PipelineChange } from "./types";

function sfRangeText(o: EvaluatedOpportunity): string {
  const { aboaSfMin, aboaSfMax, rentableSfMin, rentableSfMax } = o.requirements;
  const parts: string[] = [];
  if (aboaSfMin || aboaSfMax) {
    parts.push(`ABOA ${fmtRange(aboaSfMin, aboaSfMax)} SF`);
  }
  if (rentableSfMin || rentableSfMax) {
    parts.push(`Rentable ${fmtRange(rentableSfMin, rentableSfMax)} SF`);
  }
  return parts.length ? parts.join(", ") : "SF not found";
}

function fmtRange(min: number | null, max: number | null): string {
  if (min !== null && max !== null && min !== max) return `${min.toLocaleString()}–${max.toLocaleString()}`;
  const v = max ?? min;
  return v !== null ? v.toLocaleString() : "?";
}

function termText(o: EvaluatedOpportunity): string {
  const { leaseTermFirmYears, leaseTermTotalYears } = o.requirements;
  if (leaseTermFirmYears && leaseTermTotalYears) return `Firm ${leaseTermFirmYears}yr / Total ${leaseTermTotalYears}yr`;
  if (leaseTermFirmYears) return `Firm ${leaseTermFirmYears}yr`;
  if (leaseTermTotalYears) return `Total ${leaseTermTotalYears}yr`;
  return "term not found";
}

function opportunityLine(o: EvaluatedOpportunity): string {
  return [
    `- **${o.title}**${o.solicitationNumber ? ` (${o.solicitationNumber})` : ""}`,
    `  - Agency: ${o.department ?? "unknown"}${o.office ? ` — ${o.office}` : ""}`,
    `  - ${sfRangeText(o)} | ${termText(o)}`,
    `  - Posted: ${o.postedDate ?? "?"} | Response due: ${o.responseDeadline ?? "?"}`,
    `  - Notice ID: \`${o.noticeId}\` | [View on SAM.gov](${o.uiLink})`,
  ].join("\n");
}

function changeLine(c: PipelineChange): string {
  return `- **${c.label}** (\`${c.noticeId}\`): ${c.field} changed ${fmtValue(c.previousValue)} → **${fmtValue(c.newValue)}**`;
}

function fmtValue(v: string | number | null): string {
  if (v === null) return "unset";
  return typeof v === "number" ? v.toLocaleString() : v;
}

export function generateReport(params: {
  date: string;
  newMatches: EvaluatedOpportunity[];
  needsReview: EvaluatedOpportunity[];
  pipelineChanges: PipelineChange[];
  missingPipelineNoticeIds: string[];
}): string {
  const { date, newMatches, needsReview, pipelineChanges, missingPipelineNoticeIds } = params;

  const lines: string[] = [];
  lines.push(`# SAM.gov Daily Report — ${date}`);
  lines.push("");
  lines.push(
    `Screening criteria: ≥ ${CONFIG.minSquareFeet.toLocaleString()} SF, ≥ ${CONFIG.minFirmLeaseTermYears}yr firm lease term.`
  );
  lines.push("");

  lines.push(`## New matching opportunities (${newMatches.length})`);
  lines.push("");
  if (newMatches.length === 0) {
    lines.push("_None today._");
  } else {
    lines.push(...newMatches.map(opportunityLine).map((l) => l + "\n"));
  }
  lines.push("");

  lines.push(`## Needs manual review (${needsReview.length})`);
  lines.push("");
  lines.push(
    "_Matched on agency/NAICS/keywords but SF and/or lease term couldn't be confidently read from the notice " +
      "text — likely detailed in an attached RLP/advertisement PDF this automation doesn't parse yet._"
  );
  lines.push("");
  if (needsReview.length === 0) {
    lines.push("_None today._");
  } else {
    lines.push(...needsReview.map(opportunityLine).map((l) => l + "\n"));
  }
  lines.push("");

  lines.push(`## Pipeline updates (${pipelineChanges.length})`);
  lines.push("");
  if (pipelineChanges.length === 0) {
    lines.push("_No changes detected on tracked pipeline items._");
  } else {
    lines.push(...pipelineChanges.map(changeLine));
  }
  if (missingPipelineNoticeIds.length > 0) {
    lines.push("");
    lines.push(`⚠️ Could not find these tracked notice IDs on SAM.gov (removed/expired?): ${missingPipelineNoticeIds.join(", ")}`);
  }
  lines.push("");

  lines.push("---");
  lines.push(
    "_Site-fit analysis, broker shortlists, and email delivery are not part of this report yet — pipeline " +
      "tracking and new-opportunity screening are the current scope. See `automation/sam-gov/README.md`._"
  );

  return lines.join("\n") + "\n";
}
