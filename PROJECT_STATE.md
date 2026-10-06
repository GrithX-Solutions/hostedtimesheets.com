# HostedTimesheets Project State

Last verified: 2026-10-06T15:44:45+05:00

## Objective

Execute remediation one public page at a time. A page must complete research/evidence review, implementation, tests, alternate release validation, merge, rollback preservation, controlled deployment, live verification and state update before another page enters implementation.

User workflow rule:
- Work on exactly one public page at a time.
- Finish that page completely.
- Report results.
- Do not start the next page until the user explicitly approves it.
- An explicitly requested shared site-shell component such as the global header/navigation may be treated as one shared release unit across existing pages, but it must not bundle unrelated page content or calculator changes.

GitHub Actions remains BLOCKED because the Actions quota is exhausted. ZT MCP is the permanent contingency validation/execution path for GitHub-side infrastructure failures. GitHub-side quota/outage/service trouble alone must not stop approved project work. Never record Actions as PASS while the quota blocker remains; record the ZT evidence separately.

## Source / deployment

- Repository: GrithX-Solutions/hostedtimesheets.com
- Default branch: main
- Current deployed production-code commit after Work Hours remediation: `a4fa8201ce43df00ef82b4a3dd9ed0d5df147bcc`. Subsequent docs/state-only continuity commits do not change production bytes.
- Production: static Nginx site.
- Verified production mount: `/opt/hostedtimesheets/site` -> `/usr/share/nginx/html`.
- ZT server id: `c59425e31c304e608dac60224a064dbd`.
- ZT workspace: `hostedtimesheets`.
- ZT workspace is a partial bootstrap, not an authoritative Git mirror. Exact changed files must be synchronized from GitHub and parity-checked before using it as a release gate.
- GitHub Actions: BLOCKED (quota).
- Public/repository sitemap: 34 canonical URLs.
- Strict page-by-page remediation completed: 6 / 34 pages.
- Shared site-shell releases are tracked separately from the page-remediation count.

## Last completed task

### Work Hours Calculator `/work-hours-calculator/` — VERIFIED release

PR #94 squash-merged the remediation at `a4fa8201ce43df00ef82b4a3dd9ed0d5df147bcc`.

Research / ownership:
- Ubersuggest U.S. `work hours calculator`: 135,000 monthly searches, $2.89 CPC, SD 49.
- Ubersuggest U.S. `hours worked calculator`: 135,000 monthly searches, $2.89 CPC, SD 49.
- Ubersuggest U.S. `work time calculator`: 33,100 monthly searches, $3.82 CPC, SD 47.
- Current SERP review remained calculator-first and commonly exposed start/end, break, overnight, decimal-total and optional-pay features.
- Canonical decision: this URL owns one repeated shift pattern. Variable-day punches remain Time Card, split shifts remain Weekly Timesheet, generic elapsed duration remains Time Duration, and time/decimal conversion remains Decimal Hours.
- No current first-party GSC connector was available during this release; page-specific current GSC query/landing evidence remains UNKNOWN and was not invented.

Pre-release / source gate:
- GitHub branch -> ZT exact content parity: VERIFIED 4 / 4 for Work Hours HTML, runtime JS and both dedicated tests.
- Content Quality: PASS, 0 hard failures.
  - 1,448 main-content words.
  - Average sentence length: 14.8 words.
  - Maximum paragraph: 69 words.
  - Passive heuristic: 2.8 / 1,000 words.
  - 7 visible FAQs.
- HTML/schema/accessibility contract: PASS.
- `work-hours.js` Node syntax: PASS.
- Rendered Chromium calculation/UI matrix: PASS, 42 cases at 390px mobile and 1280px desktop.
- Matrix covered blank/invalid required inputs, break/day boundaries, same-start/end zero, overnight shifts, break-longer-than-shift zero floor, optional blank/zero/negative rate semantics, exact-minute pay, examples/reset/copy, canonical/scope checks and horizontal overflow.
- GitHub Actions Content Quality run #77 failed before executable steps and provided no downloadable job log; Actions remains BLOCKED under the known quota condition. This was not recorded as a test PASS or as a content failure; the permanent ZT contingency gate supplied the release evidence.

Production / public:
- Production-origin HTML SHA-256: `b8bd206664d25b02ff3bf6599a925444eaa43c7caeda29dc4597fe6950ee0f8c`.
- Production-origin JS SHA-256: `bc28e51c84e0b5ce495379ac30675e68f4e0d0c8ffb63815bb70d2dd3eef33a3`.
- Production-origin 42-case Chromium matrix rerun after deploy: PASS.
- Public page: HTTP 200, Cloudflare `DYNAMIC`, title `Free Work Hours Calculator — Hours, Breaks & Pay`, self-canonical, schema `dateModified` 2026-10-06 and runtime `/assets/js/work-hours.js?v=20261006-remediation1`.
- Public versioned JS SHA-256 exactly matches production origin: `bc28e51c84e0b5ce495379ac30675e68f4e0d0c8ffb63815bb70d2dd3eef33a3`.
- Public HTML is transformed by Cloudflare Rocket Loader/Insights, so raw public HTML SHA-256 is not an origin-byte parity metric. Critical HTML/schema/runtime markers were verified instead.
- True-public Chromium mobile + desktop smoke: PASS.
  - 390x844: 40.00 total hours / 40h 0m / optional pay em dash, 7 result metrics, no horizontal overflow.
  - Mobile Tools panel: open, 26 links, 390px width, no document overflow.
  - Workdays 32: visible 1–31 validation and duration output suppressed.
  - Overnight example: 7h 30m / 7.50 hours / no pay estimate.
  - 1280x900: 40.00 total hours, 7 metrics, no horizontal overflow.
  - Browser runtime exceptions: 0.
- Live sitemap remains 34 canonical URLs and includes `/work-hours-calculator/`.
- Live homepage contains direct Work Hours links.
- No new URL was introduced and no sitemap-file change was required.

Rollback / cleanup:
- Rollback path: `/opt/hostedtimesheets/rollback/work-hours-20261006/`.
- Previous HTML SHA-256: `1bb6aad5d5af37a82d667a37b53ca78794515b34ac6c3c6414e8b343cc6d2611`.
- Previous JS SHA-256: `b9c4f46cde32cbe620fdc3e5b7310ed17763c986abf46e753369233318f2c7af`.
- Temporary live-browser verification scripts and temporary preview directory were removed after verification.

### Salary Increase Calculator `/salary-increase-calculator/` — VERIFIED release

PR #92 merged the remediation at `6d4372d5a70239f1652d2a7cd0d06635e5122aa9`.

The live page now:
- owns the existing salary increase / pay raise / pay increase arithmetic intent on one canonical URL;
- supports Raise percentage, Flat annual raise and Compare salaries modes;
- distinguishes blank / invalid values from explicit zero instead of coercing blanks to zero;
- enforces weeks/year as a whole number from 1 through 53 and hours/week at 0.25 or greater;
- keeps annual/monthly/biweekly/weekly salary results available when schedule inputs are invalid while showing hourly equivalents as unavailable;
- shows consistent current / new / change values for annual, monthly, biweekly, weekly and hourly-equivalent views;
- handles zero-baseline percentage cases explicitly with N/A where no finite denominator exists;
- permits negative changes only in Compare salaries mode and uses change labels there;
- preserves mode-specific user values while switching modes;
- keeps taxes, deductions, bonuses, commissions, benefits, inflation and take-home pay outside this calculator.

## Tests / evidence

### Salary Increase Calculator — 2026-10-06

Research:
- Ubersuggest US:
  - `salary increase calculator`: 33,100 volume, $13.90 CPC, SD 16.
  - `pay raise calculator`: 33,100 volume, $13.90 CPC, SD 26.
  - `pay increase calculator`: 33,100 volume, $13.90 CPC, SD 19.
- Current SERP included AI Overview/PAA and many low-authority ranking tools.
  - SlickCalc: rank #4, PA 12, 0 backlinks / 0 referring domains.
  - HourlyToAnnual: rank #7, PA 14, 0 backlinks / 0 referring domains.
  - NorthStarNumbers: rank #11, PA 11, 0 backlinks / 0 referring domains.
- Cached first-party GSC through 2026-10-05 showed no Salary Increase query/page rows; no first-party cannibalization signal was present.
- Canonical decision remains one URL for salary increase / pay raise / pay increase synonyms; no synonym URL was introduced.

Pre-release ZT contingency gate:
- GitHub -> ZT exact parity for Salary HTML/JS and both dedicated tests: VERIFIED 4 / 4.
- Content Quality: PASS.
  - 1,074 main-content words.
  - Average sentence length: 15.3 words.
  - Maximum paragraph: 51 words.
  - Passive heuristic: 3.7 / 1,000 words.
  - 7 visible FAQs.
- Python syntax: PASS.
- Salary HTML/schema/accessibility contract: PASS.
- `salary-increase.js` Node syntax: PASS.
- 40-case rendered Chromium calculation/UI matrix: PASS.
  - 60,000 + 5% -> 63,000, +3,000 annual, +250 monthly, +115.38 biweekly, +57.69 weekly.
  - percentage mode blank/negative invalid; explicit zero valid.
  - flat 60,000 + 3,000 -> 63,000 / 5.00%.
  - flat zero baseline + positive raise -> percentage N/A; 0 + 0 -> 0.00%.
  - compare 60,000 -> 63,000 -> +3,000 / +5.00%.
  - compare 63,000 -> 60,000 -> -3,000 / -4.7619%.
  - compare zero baseline behavior verified.
  - 40 hours/week × 52 weeks/year -> 2,080 annual hours.
  - 60,000 / 2,080 -> $28.85 hourly equivalent.
  - 63,000 / 2,080 -> $30.29 hourly equivalent.
  - blank schedule fields disable hourly equivalents only.
  - weeks 53 accepted; 54 and 52.5 rejected without clamping.
  - hours/week below 0.25 rejected.
  - period current/new/change consistency PASS.
  - mode-value preservation PASS.
  - compare-mode change labels PASS.
  - canonical / no synonym URL / FAQ / visible example checks PASS.
  - mobile and desktop horizontal-overflow checks PASS.
- Exact-source iPhone 13 WebKit preview: PASS.
  - 390 px viewport with no overflow.
  - shared Tools panel remained 390x600 with 26 links.
  - flat 60k + 3k -> 63k / 5%.
  - weeks 54 showed visible 1–53 validation while salary result remained 63k and hourly output became em dash.
  - compare 63k -> 60k -> -$3,000.00 / -4.7619%.

Production / public:
- Live page HTTP 200 / Cloudflare DYNAMIC.
- Live title: `Salary Increase Calculator — Pay Raise & New Salary`.
- H1: `Salary Increase Calculator`.
- Self-canonical: `https://hostedtimesheets.com/salary-increase-calculator/`.
- Live runtime URL: `/assets/js/salary-increase.js?v=20261006-remediation1`.
- Current production SHA-256:
  - HTML: `e5b7796dd07b78910097b54be65b108fce7e0bda354e208b7f4a4e8c52dc5c56`.
  - JS: `5305b1b88fc221dda14ffcdf89744f5345dc3412f5066240b8b0203473faec90`.
- Public versioned JS SHA-256 exactly matched production origin.
- True-public desktop Chromium + iPhone 13 WebKit: PASS.
  - initial result 63,000 / 3,000 / 5.00%.
  - flat mode 60k + 3k -> 63k / 5.00%.
  - weeks 54 -> visible validation, salary arithmetic remains available, hourly output unavailable.
  - compare 63k -> 60k -> -$3,000.00 / -4.7619%.
  - compare labels use Annual change / Percentage change.
  - no horizontal overflow.
  - mobile shared Tools panel -> 390x600, 26 links.
- Public sitemap remains 34 URLs and includes the Salary Increase canonical.
- Live homepage contains a direct link to `/salary-increase-calculator/`.
- Live page contains the flat annual raise mode and schema `dateModified` 2026-10-06.
- No new URL was introduced; sitemap contents did not need modification.

Rollback:
- Verified rollback path: `/opt/hostedtimesheets/rollback/salary-increase-20261006/`.
- Previous HTML SHA-256: `4e3f1793773b8320d3b0a390725cfd1ed292a0ce0d2851ad6b0779e7360ccfd7`.
- Previous JS SHA-256: `9dedbfd92d41e67a1687901a961c37dfd58f5d74b5e1dda091a25a690be86118`.
- Temporary preview/test/browser artifacts were removed after verification.

### Decimal Hours Calculator — 2026-10-06

Research:
- Ubersuggest US:
  - `hours to decimal calculator`: 14,800 volume, $8.62 CPC, SD 16.
  - `time to decimal calculator`: 14,800 volume, $8.62 CPC, SD 19.
  - `decimal hours calculator`: 12,100 volume, $5.48 CPC, SD 46.
- Current SERP included AI Overview/PAA plus interactive specialist tools; lower-authority examples included TimeRewards PA 23 with 1 referring domain and TimeClick PA 24 with 0 backlinks.
- Cached first-party GSC through 2026-10-05 showed no Decimal calculator query/page rows; no first-party cannibalization signal was present.
- Canonical separation remains:
  - `/decimal-hours-calculator/` = interactive two-way converter.
  - `/minutes-to-decimal-hours/` = static chart/formula guide.

Pre-release ZT contingency gate:
- Content Quality: PASS.
  - 877 main-content words.
  - Average sentence length: 13.1 words.
  - Maximum paragraph: 55 words.
  - Passive heuristic: 2.3 / 1,000 words.
  - 6 visible FAQs.
- Python syntax: PASS.
- HTML/schema/accessibility contract: PASS.
- `decimal-hours.js` Node syntax: PASS.
- Rendered Chromium calculation/UI matrix: PASS.
  - zero, typical, boundary, invalid, decimal and >24h cases.
  - 60 / negative / fractional minute and second values rejected explicitly, not clamped.
  - 2 / 3 / 4 decimal-place display modes.
  - 8h 1m at $25/hour -> 8.0167 display and $200.42 exact-source pay.
  - 7.75 decimal hours -> 7h 45m 0s.
  - blank rate -> em dash; explicit 0 -> $0.00; negative rate invalid.
  - mode preservation and copy behavior PASS.
  - mobile and desktop horizontal-overflow checks PASS.
- Exact-source iPhone 13 WebKit preview: PASS before merge.

Production / public:
- Live page HTTP 200 with self-canonical and title `Hours to Decimal Calculator — Time to Decimal Hours`.
- Live runtime URL: `/assets/js/decimal-hours.js?v=20261006-remediation1`.
- Current production SHA-256:
  - HTML: `979af942f5779a0c0473f1cb3474e1a75ed0b2e6dd364f7a1e66eb62262dec99`.
  - JS: `dd5e5c8c4470ffa9de2d9fca681a61ee3f5e5a22ba1902b9885725eabc633ebf`.
- Public versioned JS SHA-256 exactly matched production origin.
- True-public desktop Chromium + iPhone 13 WebKit: PASS.
  - desktop initial: 8.5000 / 8h 30m 0s / blank pay em dash.
  - desktop 8h 1m at $25 -> 8.0167 / 28,860 seconds / $200.42.
  - desktop header: logo 260x52; Tools 96x46; Search 104x46.
  - mobile invalid 60 minutes -> visible `0 to 59` error and output suppressed.
  - mobile 7.75 at $25 -> 7h 45m 0s / 27,900 seconds / $193.75.
  - mobile header Tools -> 390x600 panel, 26 links, no horizontal overflow.
- Public sitemap remains 34 URLs and includes the Decimal canonical.
- Live `/minutes-to-decimal-hours/` links to `/decimal-hours-calculator/`.
- No new URL was introduced; sitemap contents did not need modification.

Rollback:
- Verified rollback path: `/opt/hostedtimesheets/rollback/decimal-hours-20261006/`.
- Previous HTML SHA-256: `54352398cfd4e371c5d7043d11fc1a9420eedf3432901b67442c72a030c0a4e2`.
- Previous JS SHA-256: `f069c3294825059bec04a36c4575a0ea4b2d14cf4cdb1c82b013aa71b4476302`.
- Temporary preview/test/recovery artifacts were removed after verification.

### Fresh production re-verification — 2026-10-06 11:45 +05

- Completed release set rechecked: homepage `/`, `/time-card-calculator/`, `/timesheet-template/`, and the shared header/search assets.
- Exact GitHub main -> temporary verification snapshot -> production byte parity: **7 / 7 PASS**.
  - `index.html`: SHA-256 `1bfa626ca585f70d77d11a50320a91560461ed7be45cb44327a9d15c5b9f1dc9`.
  - `time-card-calculator/index.html`: SHA-256 `7a19108861b27056d02453f396928ea3dd4210116bca22991999c5f2e3376e3d`.
  - `assets/js/timesheet-calculator.js`: SHA-256 `573634199e6b81e82d97a0c5716a5fc10cbea3fd320f7b787833114a38490a0d`.
  - `timesheet-template/index.html`: SHA-256 `f3ed71ff078db9d9a300ff1576cfb0105373fae496e70402ded66e01e3afdcb4`.
  - `assets/js/timesheet-template.js`: SHA-256 `dc64570be58ae40c101478e4e297970a5f171aaf4431c6868bdddb259c3e21a3`.
  - `assets/css/design-v2.css`: SHA-256 `f17f9a1ff53ddc9c6e96ec407c39b1315c97a52b16e38d0e4b64e8bb265dbd97`.
  - `assets/js/site-search.js`: SHA-256 `d1f4f9fe5143401766aa3f8c24cd8e9d064d7e2e9df1feecafc2eb2f83518b9f`.
- Public HTTPS: homepage, Time Card and Timesheet Template all HTTP 200, self-canonical present, and final `ee22a3c` shared CSS/JS references present.
- Public shared CSS and search JS: HTTP 200 via Cloudflare and current bytes remain the verified production assets.
- Live iPhone 13 WebKit header re-verification: **PASS on all three completed pages**.
  - viewport / document width: 390 / 390 px; no horizontal overflow.
  - header logo: 150 x 30 px.
  - Tools: 72 x 40 px.
  - Search: 80 x 40 px.
  - Tools opens as an absolute 390 x 600 px sheet with 26 visible links.
  - Search opens correctly, returns Military Time Converter, and closes Tools.
  - browser console errors: 0; page errors: 0.
- Live desktop Chromium homepage/header: **PASS** at 1366 x 900.
  - logo: 260 x 52 px.
  - Tools: 96 x 46 px.
  - Search: 104 x 46 px.
  - no document-level horizontal overflow.
  - homepage hero still targets `/time-card-calculator/`.
- Live calculator functionality smoke:
  - Time Card Load Example -> 40.00 total hours, 2h 30m unpaid breaks, $1,000.00 gross pay, 0 invalid fields: PASS.
  - Timesheet Template 2026-10-05, 09:00-17:00, 30-minute break -> Monday, Oct 5 2026, 7h 30m row/period total, 1 completed row: PASS.
- Deployment decision: **no production rewrite was performed during this re-verification because exact deployed parity was already proven**. Avoiding an unnecessary redeploy preserved the known-good production state and rollback chain.
- Temporary verification files were removed after testing.

### Global header / shared navigation
- User-reported iPhone/Safari defect: VERIFIED and reproduced in Playwright WebKit with an iPhone 13 profile.
  - OLD production behavior: `details.open=true`, 26 links present, panel `display:grid`, but rendered fixed-panel height only **41 px**.
  - NEW behavior: explicit `.is-open` + `aria-expanded=true`, panel `position:absolute`, left 0 / right 390 / width 390, rendered height **600 px**.
- GitHub branch <-> ZT exact parity for changed CSS, JS and header tests: VERIFIED before merge.
- Global header static contract: PASS.
- `site-search.js` Node syntax: PASS.
- Exact-source Chromium regression: PASS on homepage and Time Card at 390x844 mobile and 1280x900 desktop.
  - No document-level horizontal overflow.
  - Header logo meets the tested prominence threshold.
  - Footer logo remains <= 36 px high and was not unintentionally resized.
  - Redundant direct header links are hidden.
  - Duplicate All Tools CTA is hidden.
  - Tools and Search controls align vertically and use equal heights.
  - Search results remain functional.
  - Opening Tools closes Search and vice versa.
  - Outside click closes Search.
- Live shared-header structure audit before release: 34 / 34 sitemap URLs already contained the required shared header/search markup.
- Rollback for pre-header shared assets:
  - CSS SHA-256 `6b2c3e7a37b412da71ae413d3696844f12f1817e5bb73ff7fe7f63c2fc9a3ea9`.
  - JS SHA-256 `c9ba209dd32d7dc9f790835b439b7492ac02038f15d71494de9bf25c46da099a`.
  - Preserved at `/opt/hostedtimesheets/rollback/assets/css/design-v2.css` and `/opt/hostedtimesheets/rollback/assets/js/site-search.js`.
- Current production shared assets after PR #86:
  - CSS SHA-256 `f17f9a1ff53ddc9c6e96ec407c39b1315c97a52b16e38d0e4b64e8bb265dbd97`.
  - JS SHA-256 `d1f4f9fe5143401766aa3f8c24cd8e9d064d7e2e9df1feecafc2eb2f83518b9f`.
- Safari-regression rollback preserves the immediately prior shared assets:
  - CSS SHA-256 `849872b454f9a51fb65c1946b1884648b20a6fb754d217e18f2c4f2d68c83ece`.
  - JS SHA-256 `1ee68d37ad49af470cddfa70b7c8c4a908bfabe0e86c26a569af6cb21d8fb6b8`.
  - Path: `/opt/hostedtimesheets/rollback/mobile-tools-safari-20261006/`.
- Cloudflare initially served the old unversioned asset hashes from HIT cache with `max-age=14400`; origin files were already correct.
- PR #87 mechanically refreshed the two shared asset references on all 34 canonical HTML pages:
  - `/assets/css/design-v2.css?v=ee22a3c`
  - `/assets/js/site-search.js?v=ee22a3c`
- Public CDN CSS and JS returned HTTP 200 and their SHA-256 hashes exactly matched the current production-origin files.
- Live sitemap/reference audit: 34 URLs, **34 PASS**, 0 missing new refs, 0 old `edd6654` refs.
- Live WebKit iPhone 13 verification on `/` and `/time-card-calculator/`: PASS.
  - Tools: 390 px viewport width, 600 px usable panel height, 26 visible links, no horizontal overflow.
  - Search/Tools mutual exclusion: PASS.
  - Console errors: 0; page errors: 0.
- HTML rollback for the PR #87 cache-reference refresh: `/opt/hostedtimesheets/rollback/mobile-tools-safari-20261006/html-before-cache-refresh`.
- True-public Chromium regression on the live homepage and Time Card page at mobile and desktop widths: PASS.
- Public post-release Lighthouse samples were noisy (scores 80 and 66 with materially different network/TBT patterns), so they were not used to attribute a regression to the header.
- Deterministic local old-vs-new A/B Lighthouse comparison, same homepage/server with AdSense removed from both fixtures:
  - old header: performance 100, FCP 1.201 s, LCP 1.328 s, CLS 0, TBT 11 ms, Speed Index 1.201 s;
  - new header: performance 100, FCP 1.201 s, LCP 1.501 s, CLS 0, TBT 0 ms, Speed Index 1.201 s.
  - Result: no material isolated performance regression from the shared header assets.
- Temporary A/B containers, reports and fixture directories were removed after verification.

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
- Decimal Hours remediation is complete and deployed.
- Salary Increase remediation is complete and deployed.
- Work Hours remediation is complete and deployed.
- Overtime is the next planned traffic-priority calculator remediation, but it must not start without explicit user approval.
- Other pages must still be treated as separate release units.

## Deployment / indexing status

- The global header/navigation shared release, including the iPhone/Safari Tools correction, is deployed across all 34 canonical pages.
- All 34 live canonical URLs reference the verified `ee22a3c` header CSS and search JS; public asset bytes match origin exactly.
- Homepage, Time Card, Timesheet Template, Decimal Hours, Salary Increase and Work Hours strict remediation releases are deployed and VERIFIED live.
- All six completed pages use existing canonical URLs; no new URL was introduced.
- Sitemap remains 34 canonical URLs.
- No indexing request should be represented as completed unless a write-capable Search Console action is actually executed and verified.

## Blockers / unknowns

- GitHub Actions: BLOCKED by exhausted quota. Under the permanent contingency rule this is a CI-status blocker, not by itself a work/deployment blocker; ZT evidence is required for production-bound changes.
- The ZT workspace is partial; full-site results from it must not be treated as a complete repository mirror.
- Standard Lighthouse-container outbound DNS/networking is restricted, but true public Chromium/Lighthouse can be run with an ephemeral host-network container; this method was VERIFIED for the homepage and the shared-header release.
- Immediate public Lighthouse scores after the header release were high-variance, so short-run public lab scores are not treated as causal evidence; deterministic isolated A/B performance passed. Fresh field CWV impact remains UNKNOWN until real field data is available.
- Search Console's previously observed submitted sitemap count lagged the 34-URL live sitemap; the live sitemap itself had no errors/warnings in the last verified data.

## Technical debt

- Restore GitHub Actions as the normal primary CI runner when quota/capacity returns; keep ZT MCP as the permanent contingency path for future GitHub-side infrastructure failures.
- Correct private-repo authentication/bootstrap if the ZT workspace is expected to become a full authoritative checkout.
- Continue page-specific remediation only; do not batch unrelated calculator/content changes.

## In progress

No page is currently in implementation. Work Hours is complete. 28 of the 34 sitemap pages remain for strict page-by-page remediation.

## NEXT ACTION

Wait for explicit user approval before starting the next public page. The next planned page in the traffic-priority remediation queue is `/overtime-calculator/`. Continue one page at a time and use the permanent ZT contingency gate whenever GitHub-side infrastructure cannot execute.
