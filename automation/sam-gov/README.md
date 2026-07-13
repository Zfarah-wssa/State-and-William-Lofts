# SAM.gov daily report

Pulls newly posted federal real estate lease/RLP notices off SAM.gov, screens them
against the company's size/term thresholds, and flags any changes to notices already
in the pipeline. This is the first version — see "Not built yet" below for what's
intentionally out of scope for now.

## What it does today

1. **New opportunities** — searches SAM.gov for notices matching the configured
   NAICS code (531120, Lessors of Nonresidential Buildings), keywords, and agencies
   (`config.ts`), then filters to ones that read as ≥ 10,000 SF and ≥ 10yr firm lease
   term (`CONFIG.minSquareFeet` / `CONFIG.minFirmLeaseTermYears`).
2. **Needs manual review** — notices that matched on agency/NAICS/keywords but where
   the SF or lease term couldn't be confidently parsed out of the notice text. SAM.gov
   synopses often just say "see attached RLP/Advertisement" and put the real numbers in
   a PDF this doesn't read yet — those show up here instead of being silently dropped,
   since missing a real deal is worse than an extra line in the report.
3. **Pipeline updates** — every notice ID listed in `data/pipeline.json` is re-checked
   directly (regardless of the new-notice lookback window) and diffed against the last
   captured snapshot in `data/state.json`. Any change to ABOA/rentable SF, firm/total
   lease term, or response deadline is called out, e.g. *"ABOA SF min changed 17,000 →
   19,100."*

Output is a markdown file at `reports/sam-gov/YYYY-MM-DD.md`.

## Not built yet (by design, for now)

- **Site-fit analysis and broker shortlists.** This depends on CoStar, which has no
  API and requires a paid login. We explicitly deferred this until CoStar access is
  sorted out — the report only covers new opportunities + pipeline updates right now.
- **Email delivery.** The report is a file for now. This repo already has Resend
  wired up (`src/app/api/contact/route.ts`) for the leasing site's own emails, so
  adding a "send this report to a list" step later is a small addition, not a new
  integration — deliberately saved for last per direction from the team.
- **SAM.gov login.** The search this uses is public read-only data — no SAM.gov
  account is needed for it. If a future feature needs an authenticated action
  (e.g. reading a restricted attachment), that would be added separately, and
  credentials should go in as GitHub Actions secrets, never committed to the repo.

## Important limitation: unverified against the live site

This sandbox's network policy blocks `sam.gov`, so `playwrightSource.ts` was written
and reviewed but **never actually run against the real site**. Everything else
(parsing, filtering, pipeline diffing, report generation) was validated against
realistic fixture data in `__fixtures__/sample-opportunities.json` via
`npm run sam:report:dry` — that logic works.

The scraper drives SAM.gov's public search UI with Playwright and listens for the
JSON responses the page itself fetches (rather than hardcoding one exact endpoint),
specifically so it's resilient to SAM.gov changing internal field names — but the
**first real run should be treated as a calibration pass**. If it comes back with
zero results, check the console warnings — they print exactly what didn't match so
you can fix `FIELD_ALIASES` / `SEARCH_RESPONSE_URL_HINT` in `playwrightSource.ts`.
The GitHub Actions workflow (below) is the place this will actually get exercised
against sam.gov for the first time, since Actions runners aren't behind this
sandbox's network block.

## Running it

```bash
# Against real SAM.gov (needs network access to sam.gov — won't work in this sandbox)
npm run sam:report

# Against local fixture data (no network needed — safe to run anywhere)
npm run sam:report:dry
```

## Tracking the pipeline

Add entries to `data/pipeline.json` (see `data/pipeline.example.json`):

```json
[
  {
    "noticeId": "36C24924R0001",
    "label": "VA Outpatient Clinic - Charleston, SC",
    "notes": "Submitted SOI 2026-06-01"
  }
]
```

`noticeId` is the SAM.gov notice ID (visible in the notice's URL, `sam.gov/opp/<id>/view`).
The next run will start tracking it and report on any changes from then on.

## Daily automation

`.github/workflows/sam-gov-daily-report.yml` runs this every morning, commits the
report and updated `data/state.json` back to the branch, and will only fire on a
schedule once merged into the repo's default branch (scheduled workflows don't run
on other branches). Until then it can be run manually via the "Run workflow" button
in the Actions tab.
