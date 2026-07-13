// Tunable search + filter criteria for the daily SAM.gov report.
// Adjust these as the company's targeting sharpens — nothing else in the
// pipeline should need to change when these values do.

export const CONFIG = {
  /** Minimum SF (ABOA or rentable, whichever is found) to be worth reporting. */
  minSquareFeet: 10_000,

  /** Minimum firm lease term, in years, to be worth reporting. */
  minFirmLeaseTermYears: 10,

  /**
   * How far back to look for newly posted/modified notices on each run.
   * Kept short since this runs daily, with a small overlap for safety.
   */
  lookbackDays: 2,

  /**
   * NAICS codes relevant to government build-to-suit / long-term real estate leases.
   * 531120 = Lessors of Nonresidential Buildings (the standard code GSA/VA use for RLPs).
   */
  naicsCodes: ["531120"],

  /**
   * Keywords used to find lease/RLP-style notices amid SAM.gov's broader opportunity feed.
   * A notice counts as a candidate if the title or description contains any of these.
   */
  keywords: [
    "request for lease proposals",
    "rlp",
    "advertisement for lease",
    "lease of real property",
    "build-to-suit",
    "build to suit",
    "aboa",
    "ansi/boma",
    "rentable square feet",
  ],

  /**
   * Departments/agencies the company cares about. Leave empty to include all departments
   * (still subject to the keyword/NAICS filters above).
   */
  agencies: [
    "Veterans Affairs, Department Of",
    "General Services Administration",
    "Social Security Administration",
    "Homeland Security, Department Of",
    "Federal Bureau Of Investigation",
    "Justice, Department Of",
  ],

  /** Who gets the daily report email. */
  reportRecipients: ["zanefarah@wssastatewilliamlofts.com", "adonisfarah@wssastatewilliamlofts.com"],

  /** Sender address — must be on a domain verified in the Resend account sending this. */
  reportFromAddress: "SAM.gov Daily Report <sam-gov-report@wssastatewilliamlofts.com>",
} as const;
