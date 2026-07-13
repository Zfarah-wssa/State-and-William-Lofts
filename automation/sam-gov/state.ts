import { readFileSync, writeFileSync, existsSync } from "node:fs";
import type { RunState } from "./types";

const EMPTY_STATE: RunState = { seenNoticeIds: [], pipelineSnapshots: {} };

export function loadState(statePath: string): RunState {
  if (!existsSync(statePath)) return { ...EMPTY_STATE };
  try {
    const parsed = JSON.parse(readFileSync(statePath, "utf-8"));
    return {
      seenNoticeIds: Array.isArray(parsed.seenNoticeIds) ? parsed.seenNoticeIds : [],
      pipelineSnapshots: parsed.pipelineSnapshots ?? {},
    };
  } catch {
    console.warn(`[sam-gov] Couldn't parse state file at ${statePath}, starting fresh.`);
    return { ...EMPTY_STATE };
  }
}

export function saveState(statePath: string, state: RunState): void {
  writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n", "utf-8");
}
