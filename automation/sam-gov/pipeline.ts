import { readFileSync } from "node:fs";
import { evaluateOpportunity } from "./evaluate";
import type { OpportunitySource } from "./source";
import type { PipelineChange, PipelineItem, PipelineSnapshot, RunState } from "./types";

export function loadPipeline(pipelinePath: string): PipelineItem[] {
  const parsed = JSON.parse(readFileSync(pipelinePath, "utf-8"));
  return Array.isArray(parsed) ? parsed : [];
}

function toSnapshot(item: PipelineItem, evaluated: ReturnType<typeof evaluateOpportunity>): PipelineSnapshot {
  return {
    noticeId: item.noticeId,
    label: item.label,
    title: evaluated.title,
    aboaSfMin: evaluated.requirements.aboaSfMin,
    aboaSfMax: evaluated.requirements.aboaSfMax,
    rentableSfMin: evaluated.requirements.rentableSfMin,
    rentableSfMax: evaluated.requirements.rentableSfMax,
    leaseTermFirmYears: evaluated.requirements.leaseTermFirmYears,
    leaseTermTotalYears: evaluated.requirements.leaseTermTotalYears,
    responseDeadline: evaluated.responseDeadline,
    capturedAt: new Date().toISOString(),
  };
}

const TRACKED_FIELDS: { key: keyof PipelineSnapshot; label: string }[] = [
  { key: "aboaSfMin", label: "ABOA SF min" },
  { key: "aboaSfMax", label: "ABOA SF max" },
  { key: "rentableSfMin", label: "Rentable SF min" },
  { key: "rentableSfMax", label: "Rentable SF max" },
  { key: "leaseTermFirmYears", label: "Firm lease term (years)" },
  { key: "leaseTermTotalYears", label: "Total lease term (years)" },
  { key: "responseDeadline", label: "Response deadline" },
];

function diffSnapshot(previous: PipelineSnapshot | undefined, current: PipelineSnapshot): PipelineChange[] {
  if (!previous) return [];
  const changes: PipelineChange[] = [];
  for (const { key, label } of TRACKED_FIELDS) {
    const prevValue = previous[key] as string | number | null;
    const newValue = current[key] as string | number | null;
    if (prevValue !== newValue) {
      changes.push({ noticeId: current.noticeId, label: current.label, field: label, previousValue: prevValue, newValue });
    }
  }
  return changes;
}

export interface PipelineCheckResult {
  changes: PipelineChange[];
  updatedSnapshots: Record<string, PipelineSnapshot>;
  missingNoticeIds: string[];
}

/** Re-checks every tracked pipeline item against SAM.gov and diffs it against the last known snapshot. */
export async function checkPipeline(
  pipeline: PipelineItem[],
  source: OpportunitySource,
  state: RunState
): Promise<PipelineCheckResult> {
  const changes: PipelineChange[] = [];
  const updatedSnapshots: Record<string, PipelineSnapshot> = { ...state.pipelineSnapshots };
  const missingNoticeIds: string[] = [];

  for (const item of pipeline) {
    const raw = await source.fetchByNoticeId(item.noticeId);
    if (!raw) {
      missingNoticeIds.push(item.noticeId);
      continue;
    }
    const evaluated = evaluateOpportunity(raw);
    const snapshot = toSnapshot(item, evaluated);
    const previous = state.pipelineSnapshots[item.noticeId];
    changes.push(...diffSnapshot(previous, snapshot));
    updatedSnapshots[item.noticeId] = snapshot;
  }

  return { changes, updatedSnapshots, missingNoticeIds };
}
