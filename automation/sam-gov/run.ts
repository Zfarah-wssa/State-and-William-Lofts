import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateOpportunity, isCandidate } from "./evaluate";
import { checkPipeline, loadPipeline } from "./pipeline";
import { generateReport, generateReportHtml, generateReportSubject } from "./report";
import { sendReportEmail } from "./email";
import { loadState, saveState } from "./state";
import { PlaywrightOpportunitySource } from "./playwrightSource";
import { FixtureOpportunitySource } from "./fixtureSource";
import { parseLocation } from "./parseLocation";
import { findTopBrokers } from "./brokers";
import type { OpportunitySource } from "./source";
import type { EnrichedMatch, EvaluatedOpportunity } from "./types";

async function enrichMatch(opportunity: EvaluatedOpportunity): Promise<EnrichedMatch> {
  const location = parseLocation(opportunity.title, opportunity.description);
  if (!location) return { opportunity, location: null, brokers: null };

  try {
    const brokers = await findTopBrokers(location);
    return { opportunity, location, brokers };
  } catch (err) {
    console.warn(`[sam-gov] Broker lookup failed for ${opportunity.noticeId} (${location}):`, err);
    return { opportunity, location, brokers: null };
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const PIPELINE_PATH = path.join(DATA_DIR, "pipeline.json");
const STATE_PATH = path.join(DATA_DIR, "state.json");
const REPORTS_DIR = path.join(__dirname, "..", "..", "reports", "sam-gov");

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const source: OpportunitySource = dryRun ? new FixtureOpportunitySource() : new PlaywrightOpportunitySource();

  try {
    const state = loadState(STATE_PATH);
    const pipeline = loadPipeline(PIPELINE_PATH);
    const pipelineNoticeIds = new Set(pipeline.map((p) => p.noticeId));

    const raw = await source.fetchOpportunities();
    const evaluated = raw.filter(isCandidate).map(evaluateOpportunity);

    const unseenAndNotInPipeline = evaluated.filter(
      (o) => !state.seenNoticeIds.includes(o.noticeId) && !pipelineNoticeIds.has(o.noticeId)
    );

    const newMatchOpportunities = unseenAndNotInPipeline.filter((o) => o.matchesThresholds);
    const needsReview = unseenAndNotInPipeline.filter((o) => !o.matchesThresholds && o.requirements.needsManualReview);
    const newMatches = await Promise.all(newMatchOpportunities.map(enrichMatch));

    const { changes: pipelineChanges, updatedSnapshots, missingNoticeIds } = await checkPipeline(pipeline, source, state);

    const date = new Date().toISOString().slice(0, 10);
    const reportMarkdown = generateReport({
      date,
      newMatches,
      needsReview,
      pipelineChanges,
      missingPipelineNoticeIds: missingNoticeIds,
    });

    mkdirSync(REPORTS_DIR, { recursive: true });
    const reportPath = path.join(REPORTS_DIR, `${date}.md`);
    writeFileSync(reportPath, reportMarkdown, "utf-8");
    console.log(`[sam-gov] Report written to ${reportPath}`);
    console.log(reportMarkdown);

    await sendReportEmail({
      subject: generateReportSubject({
        date,
        newMatchCount: newMatches.length,
        pipelineChangeCount: pipelineChanges.length,
      }),
      html: generateReportHtml({ date, newMatches, needsReview, pipelineChanges, missingPipelineNoticeIds: missingNoticeIds }),
      text: reportMarkdown,
    });

    const newlySeenIds = [...newMatches.map((m) => m.opportunity), ...needsReview].map((o) => o.noticeId);
    saveState(STATE_PATH, {
      seenNoticeIds: [...new Set([...state.seenNoticeIds, ...newlySeenIds])],
      pipelineSnapshots: updatedSnapshots,
    });
  } finally {
    await source.close?.();
  }
}

main().catch((err) => {
  console.error("[sam-gov] Run failed:", err);
  process.exitCode = 1;
});
