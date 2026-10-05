# HostedTimesheets Project State

Last verified: 2026-10-05T23:05:00+05:00

## Objective

Execute remediation one public page at a time. A page must complete research/evidence review, implementation, tests, alternate release validation, merge, rollback preservation, controlled deployment, live verification and state update before another page enters implementation.

User workflow rule:
- Work on exactly one public page at a time.
- Finish that page completely.
- Report results.
- Do not start the next page until the user explicitly approves it.

GitHub Actions remains BLOCKED because the Actions quota is exhausted. The ZT MCP server is the temporary alternate validation runner. Never record Actions as PASS while the quota blocker remains.

## Source / deployment

- Repository: GrithX-Solutions/hostedtimesheets.com
- Default branch: main
- Production: static Nginx site.
- Verified production mount: `/opt/hostedtimesheets/site` -> `/usr/share/nginx/html`.
- ZT server id: `c59425e31c304e608dac60224a064dbd`.
- ZT workspace: `hostedtimesheets`.
- ZT workspace is a partial bootstrap, not an authoritative Git mirror. Exact changed files must be synchronized from GitHub and parity-checked before using it as a release gate.
- GitHub Actions: BLOCKED (quota).
- Public/repository sitemap: 34 canonical URLs.
- Strict page-by-page remediation completed: 3 / 34 pages.

## Last completed task

### Homepage `/` — VERIFIED release

PR #82 merged at code commit `6d285ee8d17379588e519e01fc427f96adbf5f17`.

The production homepage now:
- keeps the existing title and self-canonical;
- uses H1 `Free Timesheet, Work Hours & Payroll Calculators`;
- features `Time Card & Timesheet Calculator` instead of the lunch-specific calculator;
- gives first-tier category prominence to Time Card, Work Hours, Time Duration, Overtime, Salary Increase and PTO Accrual;
- gives Popular Tools prominence to Clock Out, Work Hours, Salary Increase, Overtime, Time Duration and Military Time;
- directly links Clock Out and Military Time in the all-tools inventory;
- keeps weekly, biweekly, lunch-specific, pay and template specialist pages discoverable;
- explains broad Time Card vs split-shift Weekly vs Biweekly vs lunch-specific vs Clock Out use cases;
- introduces no new framework, third-party library or shared calculator runtime change.

## Tests / evidence

### Homepage
- GitHub main <-> ZT homepage/test-file parity: VERIFIED before merge/deployment.
- Content Quality: PASS.
  - Main-content words: 1,028.
  - Average sentence length: 15.8 words.
  - Maximum paragraph: 68 words.
  - Passive heuristic: 4.9 / 1,000 words.
- Python syntax: PASS.
- Homepage HTML/canonical/schema/internal-link contract: PASS.
- Exact-source Chromium regression: PASS.
  - 390x844 mobile: six category cards, six Popular Tools cards, one-column Popular Tools, Time Card hero, no document-level horizontal overflow.
  - Mobile Tools menu: PASS.
  - Mobile site search returns Military Time Converter: PASS.
  - All-tools disclosure includes Clock Out and Military Time: PASS.
  - 1280px desktop: six-column Popular Tools, six category columns, no document-level overflow, featured calculator visible in initial viewport.
- Every promoted destination was live HTTP 200 without an unnecessary redirect before merge:
  - Time Card Calculator.
  - Clock Out Time Calculator.
  - Work Hours Calculator.
  - Time Duration Calculator.
  - Military Time Converter.
  - Salary Increase Calculator.
  - Overtime Calculator.
  - PTO Accrual Calculator.
- Previous production homepage SHA-256: `66f4abf7af384e9429c5dff5ea21c11cf3d43c65b356c305d4ed7c79f1e734b2`.
- Tested/deployed homepage SHA-256: `dd8c7a0426593025221ec8f891620da3e4b3f3dae0566b64d61aaddb06919b47`.
- Rollback: `/opt/hostedtimesheets/rollback/homepage/index.html`, exact previous SHA preserved.
- Public homepage: HTTP 200; Cloudflare cache status DYNAMIC; last-modified 2026-10-05 18:02:26 GMT.
- Public response verification: correct H1, self-canonical, six category cards, six Popular Tools cards, Time Card hero, Clock Out link and Military Time link.
- True public mobile Chromium render through an ephemeral host-network container: PASS.
- Live mobile Lighthouse performance run:
  - Performance score: 88.
  - FCP: 1.83 s.
  - LCP: 2.19 s.
  - CLS: 0.
  - TBT: 404 ms.
  - Speed Index: 1.83 s.
- No sitemap-file change was required because the homepage URL already exists and no new URL was introduced.

### Timesheet Template `/timesheet-template/` — VERIFIED release
- PR #81 code commit: `df6c9673cc366eb12aaac0a2ede2d9eded81195e`.
- Content, calculation/date/CSV, HTML/schema/accessibility and rendered Chromium gates: PASS.
- Production and public versioned JS verification: PASS.
- Rollback preserved.

### Time Card `/time-card-calculator/` — VERIFIED release
- Remediation PR #79: `29e5ea18482c05ad9ad1a826f4a903ae33ff8f31`.
- Cache-bust PR #80: `bebc8535d804540256d09c374315759e59f2c77d`.
- Content, JS syntax, calculation, HTML/schema/accessibility and rendered-mobile gates: PASS.
- Public page/versioned JS verification: PASS.
- Rollback preserved.

## Traffic / research status

Existing same-day research remains available for future explicitly approved single-page work:
- Decimal Hours remediation spec is implementation-ready.
- Salary Increase remediation spec is implementation-ready.
- Other pages must still be treated as separate release units and must not be started without user approval.

## Deployment / indexing status

- Homepage, Time Card and Timesheet Template strict remediation releases are deployed.
- All three were existing canonical URLs; no new URL was introduced.
- Sitemap remains 34 canonical URLs.
- No indexing request should be represented as completed unless a write-capable Search Console action is actually executed and verified.

## Blockers / unknowns

- GitHub Actions: BLOCKED by exhausted quota.
- The ZT workspace is partial; full-site results from it must not be treated as a complete repository mirror.
- Standard Lighthouse-container outbound DNS/networking is restricted, but true public Chromium/Lighthouse can be run with an ephemeral host-network container; this method was VERIFIED for the homepage.
- Search Console's previously observed submitted sitemap count lagged the 34-URL live sitemap; the live sitemap itself had no errors/warnings in the last verified data.

## Technical debt

- Restore normal GitHub Actions as the required CI path when quota/capacity returns.
- Correct private-repo authentication/bootstrap if the ZT workspace is expected to become a full authoritative checkout.
- Continue page-specific remediation only; do not batch unrelated calculator/content changes.

## In progress

No page is currently in implementation.

## NEXT ACTION

Wait for explicit user approval before starting or continuing any next public page. Do not begin another page automatically after this homepage report.
