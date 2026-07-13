import { CONFIG } from "./config";
import type { EnrichedMatch, EvaluatedOpportunity, PipelineChange } from "./types";

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

function brokersLine(match: EnrichedMatch): string {
  if (!match.location) {
    return "  - Top brokers: location not identified from notice text — skipped";
  }
  if (match.brokers === null) {
    return `  - Top brokers in ${match.location}: unavailable (set ANTHROPIC_API_KEY to enable, or lookup failed — see logs)`;
  }
  if (match.brokers.length === 0) {
    return `  - Top brokers in ${match.location}: none found`;
  }
  const list = match.brokers
    .map((b, i) => `    ${i + 1}. **${b.name}** (${b.firm}) — ${b.rationale}`)
    .join("\n");
  return `  - Top brokers in ${match.location}:\n${list}`;
}

function matchLine(match: EnrichedMatch): string {
  return `${opportunityLine(match.opportunity)}\n${brokersLine(match)}`;
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
  newMatches: EnrichedMatch[];
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
    lines.push(...newMatches.map(matchLine).map((l) => l + "\n"));
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
    "_Site-fit analysis (CoStar-dependent) is not part of this report yet — new-opportunity screening, broker " +
      "research, pipeline tracking, and email delivery are the current scope. See `automation/sam-gov/README.md`._"
  );

  return lines.join("\n") + "\n";
}

export function generateReportSubject(params: { date: string; newMatchCount: number; pipelineChangeCount: number }): string {
  const { date, newMatchCount, pipelineChangeCount } = params;
  const bits: string[] = [];
  if (newMatchCount > 0) bits.push(`${newMatchCount} new`);
  if (pipelineChangeCount > 0) bits.push(`${pipelineChangeCount} pipeline update${pipelineChangeCount === 1 ? "" : "s"}`);
  const suffix = bits.length ? ` — ${bits.join(", ")}` : "";
  return `SAM.gov Daily Report — ${date}${suffix}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function opportunityHtml(o: EvaluatedOpportunity): string {
  return `
    <p style="margin:0 0 4px;font-weight:600;color:#1a1a1a">${escapeHtml(o.title)}${o.solicitationNumber ? ` (${escapeHtml(o.solicitationNumber)})` : ""}</p>
    <p style="margin:0 0 2px;color:#444;font-size:14px">Agency: ${escapeHtml(o.department ?? "unknown")}${o.office ? ` — ${escapeHtml(o.office)}` : ""}</p>
    <p style="margin:0 0 2px;color:#444;font-size:14px">${escapeHtml(sfRangeText(o))} | ${escapeHtml(termText(o))}</p>
    <p style="margin:0 0 2px;color:#444;font-size:14px">Posted: ${escapeHtml(o.postedDate ?? "?")} | Response due: ${escapeHtml(o.responseDeadline ?? "?")}</p>
    <p style="margin:0;font-size:13px"><code style="color:#666">${escapeHtml(o.noticeId)}</code> — <a href="${escapeHtml(o.uiLink)}" style="color:#1a6fb5">View on SAM.gov</a></p>
  `;
}

function brokersHtml(match: EnrichedMatch): string {
  if (!match.location) {
    return `<p style="margin:6px 0 0;font-size:14px;color:#888">Top brokers: location not identified from notice text — skipped</p>`;
  }
  if (match.brokers === null) {
    return `<p style="margin:6px 0 0;font-size:14px;color:#888">Top brokers in ${escapeHtml(match.location)}: unavailable (set ANTHROPIC_API_KEY, or lookup failed)</p>`;
  }
  if (match.brokers.length === 0) {
    return `<p style="margin:6px 0 0;font-size:14px;color:#888">Top brokers in ${escapeHtml(match.location)}: none found</p>`;
  }
  const items = match.brokers
    .map((b) => `<li style="margin-bottom:2px"><strong>${escapeHtml(b.name)}</strong> (${escapeHtml(b.firm)}) — ${escapeHtml(b.rationale)}</li>`)
    .join("");
  return `
    <p style="margin:6px 0 2px;font-size:14px;color:#444">Top brokers in ${escapeHtml(match.location)}:</p>
    <ol style="margin:0;padding-left:20px;font-size:14px;color:#444">${items}</ol>
  `;
}

function cardHtml(inner: string): string {
  return `<div style="border:1px solid #e5e5e5;border-radius:8px;padding:14px 16px;margin-bottom:12px">${inner}</div>`;
}

function changeHtml(c: PipelineChange): string {
  return `<li style="margin-bottom:4px"><strong>${escapeHtml(c.label)}</strong> (<code style="color:#666">${escapeHtml(c.noticeId)}</code>): ${escapeHtml(c.field)} changed ${escapeHtml(fmtValue(c.previousValue))} → <strong>${escapeHtml(fmtValue(c.newValue))}</strong></li>`;
}

export function generateReportHtml(params: {
  date: string;
  newMatches: EnrichedMatch[];
  needsReview: EvaluatedOpportunity[];
  pipelineChanges: PipelineChange[];
  missingPipelineNoticeIds: string[];
}): string {
  const { date, newMatches, needsReview, pipelineChanges, missingPipelineNoticeIds } = params;

  const newMatchesHtml = newMatches.length
    ? newMatches.map((m) => cardHtml(opportunityHtml(m.opportunity) + brokersHtml(m))).join("")
    : `<p style="color:#888">None today.</p>`;

  const needsReviewHtml = needsReview.length
    ? needsReview.map((o) => cardHtml(opportunityHtml(o))).join("")
    : `<p style="color:#888">None today.</p>`;

  const pipelineHtml = pipelineChanges.length
    ? `<ul style="margin:0;padding-left:20px">${pipelineChanges.map(changeHtml).join("")}</ul>`
    : `<p style="color:#888">No changes detected on tracked pipeline items.</p>`;

  const missingHtml = missingPipelineNoticeIds.length
    ? `<p style="color:#b45309;font-size:14px">⚠️ Could not find these tracked notice IDs on SAM.gov (removed/expired?): ${missingPipelineNoticeIds.map(escapeHtml).join(", ")}</p>`
    : "";

  return `
    <div style="font-family:sans-serif;max-width:640px;margin:0 auto;padding:24px">
      <h2 style="color:#1a1a1a;margin-bottom:4px">SAM.gov Daily Report — ${escapeHtml(date)}</h2>
      <p style="color:#666;margin-top:0;margin-bottom:20px;font-size:14px">
        Screening criteria: ≥ ${CONFIG.minSquareFeet.toLocaleString()} SF, ≥ ${CONFIG.minFirmLeaseTermYears}yr firm lease term.
      </p>

      <h3 style="color:#1a1a1a;margin-bottom:8px">New matching opportunities (${newMatches.length})</h3>
      ${newMatchesHtml}

      <h3 style="color:#1a1a1a;margin-bottom:4px">Needs manual review (${needsReview.length})</h3>
      <p style="color:#666;font-size:13px;margin-top:0;margin-bottom:8px">
        Matched on agency/NAICS/keywords but SF and/or lease term couldn't be confidently read from the notice text.
      </p>
      ${needsReviewHtml}

      <h3 style="color:#1a1a1a;margin-bottom:8px">Pipeline updates (${pipelineChanges.length})</h3>
      ${pipelineHtml}
      ${missingHtml}

      <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0 12px">
      <p style="color:#999;font-size:12px;margin:0">
        Site-fit analysis (CoStar-dependent) is not part of this report yet.
      </p>
    </div>
  `;
}
