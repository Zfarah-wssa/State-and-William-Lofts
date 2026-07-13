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

/** Runs `fn` over `items` with at most `limit` in flight at once, preserving result order. */
async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function worker(): Promise<void> {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

type PipelineLookupResult = { noticeId: string; missing: true } | { noticeId: string; missing: false; snapshot: PipelineSnapshot };

/**
 * Re-checks every tracked pipeline item against SAM.gov and diffs it against the last known
 * snapshot. Runs lookups with bounded concurrency rather than one at a time — with dozens of
 * pipeline items, a strictly sequential pass makes each run several minutes slower for no benefit.
 */
export async function checkPipeline(
  pipeline: PipelineItem[],
  source: OpportunitySource,
  state: RunState
): Promise<PipelineCheckResult> {
  const changes: PipelineChange[] = [];
  const updatedSnapshots: Record<string, PipelineSnapshot> = { ...state.pipelineSnapshots };
  const missingNoticeIds: string[] = [];

  const results = await mapWithConcurrency(pipeline, 5, async (item): Promise<PipelineLookupResult> => {
    const raw = await source.fetchByNoticeId(item.noticeId);
    if (!raw) return { noticeId: item.noticeId, missing: true };
    const evaluated = evaluateOpportunity(raw);
    return { noticeId: item.noticeId, missing: false, snapshot: toSnapshot(item, evaluated) };
  });

  for (const r of results) {
    if (r.missing) {
      missingNoticeIds.push(r.noticeId);
      continue;
    }
    const previous = state.pipelineSnapshots[r.noticeId];
    changes.push(...diffSnapshot(previous, r.snapshot));
    updatedSnapshots[r.noticeId] = r.snapshot;
  }

  return { changes, updatedSnapshots, missingNoticeIds };
}
