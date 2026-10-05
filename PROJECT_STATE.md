# HostedTimesheets Project State

Last verified: 2026-10-05T18:18:00+05:00

## Objective

Execute remediation one public page at a time. A page must complete research/evidence review, implementation, tests, alternate release validation, merge, rollback preservation, controlled deployment, live verification and state update before another page enters implementation.

GitHub Actions remains BLOCKED because the Actions quota is exhausted. The user authorized the ZT MCP server as the temporary alternate validation runner. Never record Actions as PASS while the quota blocker remains.

## Source / deployment

- Repository: GrithX-Solutions/hostedtimesheets.com
- Default branch: main
- Production: static Nginx site.
- Verified production mount: `/opt/hostedtimesheets/site` -> `/usr/share/nginx/html`.
- ZT server id: `c59425e31c304e608dac60224a064dbd`.
- ZT workspace: `hostedtimesheets`.
- ZT workspace is a partial bootstrap, not an authoritative Git mirror. Exact changed files must be synchronized from GitHub and parity-checked before using it as a release gate.
- GitHub Actions: BLOCKED (quota).
- Public/repository sitemap: 34 canonical URLs; no sitemap change required for the two completed existing URLs below.

## Last completed task

### /timesheet-template/ — VERIFIED release

PR #81 merged the Timesheet Template remediation at code commit `df6c9673cc366eb12aaac0a2ede2d9eded81195e`.

The production page now supports:
- Weekly 7-day and biweekly 14-day modes.
- Consecutive dates from Period Start with synchronized weekdays.
- Break minutes defaulting to 0 instead of assuming 30 minutes.
- Exact integer-minute daily calculations and overnight shifts.
- Visible validation for incomplete/equal punches and invalid breaks.
- Week 1, Week 2 and combined biweekly totals.
- In-session data preservation when switching weekly/biweekly modes.
- Print / browser Save as PDF workflow.
- CSV export with week, date, day, punches, break minutes, exact net minutes and 4-place decimal hours.
- Browser-local calculation/export boundary and no-signup workflow.
- Correct contextual links to weekly, biweekly and lunch-specific calculators.

## Tests / evidence

### Timesheet Template
- GitHub main <-> ZT changed-file parity: VERIFIED before deployment.
- Content Quality: PASS.
  - Main-content words: 1,045.
  - Average sentence length: 15.6 words.
  - Maximum paragraph: 49 words.
  - Passive heuristic: 4.8/1,000 words.
  - Visible FAQs: 4.
- Python syntax: PASS.
- HTML/canonical/FAQ-schema/accessibility contract: PASS.
- JavaScript syntax: PASS with Node v22.23.3.
- Calculation/date/CSV suite: PASS.
- Rendered Chromium interaction test at 390x844: PASS.
  - 7/14 row modes and two biweekly week groups.
  - Zero-default breaks.
  - Blank-date behavior.
  - Month-boundary date population.
  - Daily/weekly/biweekly totals.
  - Invalid-row exclusion and aria-invalid.
  - Week 2 restoration after switching Biweekly -> Weekly -> Biweekly.
  - Print metadata and print-only CSS.
  - No document-level mobile horizontal overflow.
- Production origin HTML SHA-256: `633d40a7f8cce3d8485674f1580d6037f127caeb1ab2fb47eefe0fa997c516ec`.
- Production origin JS SHA-256: `dc64570be58ae40c101478e4e297970a5f171aaf4431c6868bdddb259c3e21a3`.
- Rollback HTML SHA-256: `9ee062551cda70db4ca36bb03713da14c4d61d17e696837605dbf4e8550e4570`.
- Rollback JS SHA-256: `9757022b19d5e955abbc000b0cb867a0330be50a3609cec435b1705569eae49b`.
- Rollback paths:
  - `/opt/hostedtimesheets/rollback/timesheet-template/index.html`
  - `/opt/hostedtimesheets/rollback/assets/js/timesheet-template.js`
- Public page: HTTP 200; Cloudflare cache status DYNAMIC.
- Public versioned JS: HTTP 200; first verification MISS; public SHA exactly matches production/GitHub JS.
- Public HTML contains the expected title, self-canonical, H1, total UI and versioned JS URL.
- Cloudflare Rocket Loader rewrites public script tags, so public HTML byte parity is not expected.
- Public rendered-browser verification from the Lighthouse container is BLOCKED by that container's outbound networking. Exact-source rendered Chromium tests plus public HTTP/asset verification are the current evidence.

### /time-card-calculator/ — VERIFIED release

- Full remediation PR #79 merged at `29e5ea18482c05ad9ad1a826f4a903ae33ff8f31`.
- Cache-bust PR #80 merged at code commit `bebc8535d804540256d09c374315759e59f2c77d`.
- Content, JS syntax, calculation, HTML/schema/accessibility and local rendered-mobile gates: PASS.
- Public page and versioned JS: HTTP 200.
- Public JS SHA matches production/GitHub source.
- Rollback preserved under `/opt/hostedtimesheets/rollback/time-card-calculator/` and `/opt/hostedtimesheets/rollback/assets/js/timesheet-calculator.js`.

## Traffic / research status

Existing same-day evidence remains current for the next planned pages:
- Timesheet Template first-party GSC evidence: 31 of 62 observed impressions in the 2026-09-29 to 2026-10-02 cached window.
- Homepage reprioritization spec is implementation-ready now that the Time Card broad-intent retarget is live.
- Homepage demand evidence already captured:
  - Clock Out Time Calculator: 135,000 US monthly searches.
  - Work Hours Calculator: 135,000.
  - Military Time Converter: 74,000.
  - Salary Increase Calculator: 33,100; CPC $13.90; SD 16.
- Current homepage still gives disproportionate prominence to lower-demand lunch-specific intent and does not surface all high-demand tools equivalently.
- Decimal Hours and Salary Increase remediation specs also remain ready for later single-page releases.

## Deployment / indexing status

- Time Card and Timesheet Template changes are deployed.
- Both existing canonical URLs remain in the 34-URL sitemap; no sitemap-file edits were required.
- No new URL was introduced.
- No indexing request should be represented as completed unless a write-capable Search Console action is actually executed and verified.

## Blockers / unknowns

- GitHub Actions: BLOCKED by exhausted quota.
- Public Chromium access from the current Lighthouse container: BLOCKED by outbound DNS/network routing.
- The ZT workspace is partial; full-site results from it must not be treated as a complete repository mirror.
- Search Console's previously observed submitted sitemap count lagged the 34-URL live sitemap; the sitemap itself had no errors/warnings in the last verified data.

## Technical debt

- Restore normal GitHub Actions as the required CI path when quota/capacity returns.
- Correct private-repo authentication/bootstrap if the ZT workspace is ever expected to become a full authoritative checkout.
- Continue replacing legacy calculator edge-case behavior only through page-specific tested releases; do not batch unrelated calculator changes.

## In progress

Homepage work is PAUSED awaiting explicit user approval before any further implementation.

A branch exists: `feature/homepage-reprioritization-20261005`.
Draft homepage HTML changes and a page-specific HTML contract test were committed there, but the branch is NOT merged and NOTHING from it is deployed to production.

User workflow rule from 2026-10-05:
- Work on exactly one public page at a time.
- Finish that page completely.
- Report status/results.
- Do not start or continue the next page until the user explicitly approves it.

## NEXT ACTION

Wait for explicit user approval before continuing homepage (`/`) work. When approved, continue only the existing homepage branch and do not begin another page in the same run.

Before editing:
1. Re-read current GitHub main homepage, live production homepage and the spec.
2. Preserve the homepage-only rollback boundary; do not couple calculator runtime changes.
3. Reconfirm title/H1/internal-link ownership and the Time Card hero dependency now that Time Card is live.
4. Validate desktop/mobile navigation, internal links, accessibility, content quality and rendered behavior on the ZT runner.
5. Merge/deploy only the homepage if all applicable alternate-gate checks pass.
6. Live-verify and update this state before selecting the next page.
