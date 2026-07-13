import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { RawOpportunity } from "./types";
import type { OpportunitySource } from "./source";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Reads local fixture data instead of hitting SAM.gov. Used for `npm run sam:report:dry`
 * so the parsing/filtering/pipeline-diff/report logic can be exercised and verified without
 * network access — this is how the automation was validated while sam.gov was unreachable.
 */
export class FixtureOpportunitySource implements OpportunitySource {
  constructor(private fixturePath: string = path.join(__dirname, "__fixtures__", "sample-opportunities.json")) {}

  async fetchOpportunities(): Promise<RawOpportunity[]> {
    const raw = readFileSync(this.fixturePath, "utf-8");
    return JSON.parse(raw) as RawOpportunity[];
  }

  async fetchByNoticeId(noticeId: string): Promise<RawOpportunity | null> {
    const all = await this.fetchOpportunities();
    return all.find((o) => o.noticeId === noticeId) ?? null;
  }
}
