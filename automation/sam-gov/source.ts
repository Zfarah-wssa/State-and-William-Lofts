import type { RawOpportunity } from "./types";

/** Anything that can produce today's batch of raw SAM.gov opportunities implements this. */
export interface OpportunitySource {
  /** Notices posted/modified within the configured lookback window. */
  fetchOpportunities(): Promise<RawOpportunity[]>;

  /**
   * Direct lookup for a single notice by ID, used to re-check pipeline items we're already
   * tracking regardless of whether they fall inside the lookback window used for new-notice
   * discovery. Returns null if the notice can't be found (e.g. it was pulled from SAM.gov).
   */
  fetchByNoticeId(noticeId: string): Promise<RawOpportunity | null>;

  /** Releases any underlying resources (e.g. a browser process). Safe to omit if there's nothing to clean up. */
  close?(): Promise<void>;
}
