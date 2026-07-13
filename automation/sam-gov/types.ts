// Shared types for the SAM.gov daily report automation.

export interface RawOpportunity {
  noticeId: string;
  title: string;
  solicitationNumber?: string;
  department?: string;
  subTier?: string;
  office?: string;
  noticeType?: string;
  postedDate?: string;
  responseDeadline?: string;
  setAside?: string;
  naicsCode?: string;
  uiLink: string;
  description: string;
}

export interface ParsedRequirements {
  /** Best-guess ABOA/usable square footage figures found in the text. */
  aboaSfMin: number | null;
  aboaSfMax: number | null;
  /** Best-guess rentable/BOMA square footage figures found in the text. */
  rentableSfMin: number | null;
  rentableSfMax: number | null;
  /** Firm lease term, in years, if it could be determined. */
  leaseTermFirmYears: number | null;
  /** Total lease term (firm + options), in years, if stated. */
  leaseTermTotalYears: number | null;
  /** True if we could not confidently extract SF or term and a human should check the notice/attachments. */
  needsManualReview: boolean;
}

export interface EvaluatedOpportunity extends RawOpportunity {
  requirements: ParsedRequirements;
  /** Passed the >10,000 SF and >10yr firm term thresholds. */
  matchesThresholds: boolean;
}

/** A project the company is actively chasing, keyed by SAM.gov notice ID. */
export interface PipelineItem {
  noticeId: string;
  label: string;
  notes?: string;
}

/** Snapshot of a tracked pipeline item's key fields, used to detect changes day over day. */
export interface PipelineSnapshot {
  noticeId: string;
  label: string;
  title: string;
  aboaSfMin: number | null;
  aboaSfMax: number | null;
  rentableSfMin: number | null;
  rentableSfMax: number | null;
  leaseTermFirmYears: number | null;
  leaseTermTotalYears: number | null;
  responseDeadline?: string;
  capturedAt: string;
}

export interface PipelineChange {
  noticeId: string;
  label: string;
  field: string;
  previousValue: string | number | null;
  newValue: string | number | null;
}

export interface RunState {
  /** noticeIds already reported in a previous run, so we only report genuinely new ones. */
  seenNoticeIds: string[];
  /** Last captured snapshot per tracked pipeline item. */
  pipelineSnapshots: Record<string, PipelineSnapshot>;
}
