# HostedTimesheets Project State

Last verified: 2026-10-07T19:55:29+05:00

## Objective

Execute remediation one public page at a time. A page must complete research/evidence review, implementation, tests, alternate release validation, merge, rollback preservation, controlled deployment, live verification and state update before another page enters implementation.

User workflow rule:
- Work on exactly one public page at a time.
- Finish that page completely.
- Report results.
- Do not start the next page until the user explicitly approves it.
- An explicitly requested shared site-shell component such as the global header/navigation may be treated as one shared release unit across existing pages, but it must not bundle unrelated page content or calculator changes.

GitHub Actions remains BLOCKED by GitHub-side infrastructure/capacity behavior. Time Off PR #108 run #106 and PR #107 run #104 failed with zero executable job steps, so no GitHub CI PASS is claimed. ZT MCP is the permanent contingency validation/execution path for GitHub-side infrastructure failures. GitHub-side quota/outage/service trouble alone must not stop approved project work; record ZT/direct evidence separately.

## Source / deployment

- Repository: GrithX-Solutions/hostedtimesheets.com
- Default branch: main
- Current deployed production-code commit after Time Off Tracker remediation/cache fix: `c22f748a616074491e04f3489e9dea142e1531df`. Subsequent docs/state-only continuity commits do not change production bytes.
- Production: static Nginx site served by container `hostedtimesheets-preview`.
- VERIFIED active production mount: host `/home/hostedtimesheets.com/public_html` -> container `/usr/share/nginx/html` (`ro`). `/opt/hostedtimesheets/site` is not the active public document root and must not be used to claim deployment state.
- Preserve rollback from the true active root before production-bound changes. After merge, compare the exact tested Git blobs with `/home/hostedtimesheets.com/public_html`; deploy only exact tested files when they differ, then verify public/CDN behavior.
- ZT server id: `c59425e31c304e608dac60224a064dbd`.
- ZT workspace: `hostedtimesheets`.
- ZT workspace is a partial bootstrap, not an authoritative Git mirror. Exact changed files must be synchronized from GitHub and parity-checked before using it as a release gate.
- GitHub Actions: BLOCKED / infrastructure failure. Time Off PR #108 run #106 and PR #107 run #104 exposed zero executable steps; no GitHub CI PASS is claimed.
- Public/repository sitemap: 34 canonical URLs.
- Strict page-by-page remediation completed: 16 / 34 pages.
- Shared site-shell releases are tracked separately from the page-remediation count.

## Last completed task

### Time Off Tracker `/time-off-tracker/` — VERIFIED release

PR #107 squash-merged the functional remediation at `a8676814d14fdcf4aaf159a3ad160d2637d91b26`. PR #108 squash-merged the runtime-cache/topology hotfix at `c22f748a616074491e04f3489e9dea142e1531df`. Duplicate PR #109 was closed unmerged after confirming #107/#108 already contained the authoritative release.

Research / ownership:
- Ubersuggest U.S. `time off tracker`: 590 monthly searches, $76.96 CPC, SD 29.
- Ubersuggest U.S. `pto tracker`: 720 monthly searches, $69.08 CPC, SD 25.
- Ubersuggest U.S. `vacation tracker`: 2,400 monthly searches, $13.36 CPC, SD 31.
- Ubersuggest U.S. `leave tracker`: 590 monthly searches, $38.01 CPC, SD 26.
- Additional current Ubersuggest terms included `employee time off tracker` 260 volume / $28.855 CPC / SD 13, `paid time off tracker` 720 / $35.11 / SD 24, and `free pto tracker` 170 / $21.23 / SD 20.
- The $76.96 exact-query CPC remains present in current Ubersuggest data but is treated as an unusually high advertiser metric, not a traffic/revenue forecast.
- Current SERP/competitor review showed SaaS/team-management dominance plus browser-local/no-signup tools. Canonical decision: this URL owns personal/reconciliation balance tracking; automatic accrual policy remains on PTO Accrual pages and approvals/team calendars remain out of scope.

Baseline / topology / rollback:
- Pre-remediation active-public HTML blob: `5a71652c65673ff92ee34ec2484214d35a18ca85`; JS blob: `65fd69ee59aaa4fef4a68adaf2ab832e29e347e0`.
- Pre-remediation live-vs-repo HTML difference was fully reconciled as one editorial heading prefix only; there was no live-only runtime behavior.
- Release verification discovered the documented `/opt/hostedtimesheets/site` tree was not the true active public root.
- VERIFIED public container: `hostedtimesheets-preview`.
- VERIFIED bind mount: host `/home/hostedtimesheets.com/public_html` -> container `/usr/share/nginx/html` read-only.
- True active-public rollback is preserved under `/opt/hostedtimesheets/rollback-time-off-tracker-20261007/active-public/`.
- Rollback HTML SHA-256: `bd525397b630d04b96032f2376a373a0f1c5ad7df4eaa76be86ef561232c64fa`; exact blob `5a71652c65673ff92ee34ec2484214d35a18ca85`.
- Rollback JS SHA-256: `eed2081204b0ee4328c7dbbf05d2646cb0cded64e992146ccb7943512783543e`; exact blob `65fd69ee59aaa4fef4a68adaf2ab832e29e347e0`.

Product / calculation / privacy:
- Replaced silent input coercion and zero-clamped calculated balances with explicit validation plus signed arithmetic.
- Per-category formulas: `current balance = opening + earned − used`; `available after scheduled = current − scheduled`.
- Calculated negative current/available balances remain visible and are not treated as input errors.
- Added category-aware shortage count and scheduled-shortfall total so a positive leave bank cannot hide a deficit in another category.
- Added Hours / Days unit mode. Unit selection changes labels only and never converts numbers or assumes hours per workday.
- All 16 planning inputs accept blank as zero and finite nonnegative decimals; entered negative values surface field errors and suppress totals/save/copy/CSV until fixed.
- Added explicit opt-in `Save in this browser`, restore and `Clear saved data` using localStorage on the current browser/device.
- Default tracker use is non-persistent; Reset changes visible values but does not silently delete a saved snapshot.
- Added copyable summary while preserving print and CSV export.
- Kept automatic PTO accrual, entitlement, approval, carryover/forfeiture/cap rules, statutory leave and payroll treatment outside this page.

Exact-source gate:
- Functional tested branch head: `1370a50d231f8d8f9c0b96238b5400d3448a9efe`.
- Final cache-key hotfix head: `da302799828f7463cd2651e159b7f8b766164d79`.
- Final GitHub/main gate parity: VERIFIED 5 / 5.
- Final main blobs: HTML `3d733b02d2570db22c59c882b674e1f793a21af1`; JS `bf5bb58ccaa6c6db575437f9d5a5eec75217fbba`; HTML test `d215685113953274e314012b150b2b4a326c4ddf`; browser test `95ec12a2f8db02da8972f32d3c8120be9640c1d1`; content audit `70f5930c5f374a6f1e7f874288ab3cd8f7bc1556`.
- HTML/schema/accessibility contract: PASS.
- `time-off-tracker.js` Node syntax: PASS.
- Exact-main Chromium calculation/storage/UI matrix: PASS, 36 cases across 390px mobile and 1280px desktop; zero runtime exceptions/console errors.
- Matrix covers blank/decimal/negative inputs, signed deficits, category shortfalls, hours/days no-conversion behavior, save/restore/reset/clear localStorage semantics, copy, CSV, print, canonical/scope checks and overflow.
- Page-only content audit: PASS, 0 hard failures / 0 warnings — 1,310 main-content words, 19 H2/H3 headings, 15.8-word average sentence, 48-word maximum paragraph, passive heuristic 7.6 / 1,000 and 8 visible FAQs.
- Repository-wide content audit now reports 7 hard-rule failures on other queued pages; Time Off itself is PASS.
- GitHub Actions PR #107 run #104 and PR #108 run #106 failed with zero executable job steps. No GitHub CI PASS is claimed; exact-source ZT evidence supplied the release gate.

Production / CDN verification:
- Active production HTML SHA-256: `61289cdd5b7e97445ac4c21d302f9db71941869f93e49088b7daa0f814ab5c5b`; blob `3d733b02d2570db22c59c882b674e1f793a21af1`.
- Active production JS SHA-256: `4d8a7b8ecc513e253011bf3f205b052d562d3db019391d7ad7fe23e3bccbf2c8`; blob `bf5bb58ccaa6c6db575437f9d5a5eec75217fbba`.
- Active root exactly matches final GitHub/main runtime blobs.
- Public page: HTTP 200, Cloudflare `DYNAMIC`, Last-Modified 2026-10-07 13:32:48 UTC, self-canonical, schema `dateModified` 2026-10-07, Hours/Days selector, browser-save controls, shortfall metrics, Copy Summary and 8 FAQs.
- Final public runtime URL: `/assets/js/time-off-tracker.js?v=20261007-remediation2`.
- Public `remediation2` JS blob `bf5bb58ccaa6c6db575437f9d5a5eec75217fbba` exactly matches active origin and GitHub/main.
- True-public 390x844 Chromium returned code 0; rendered DOM contained `remediation2`, default 0.00 h balances, unit/save/copy controls and 8 FAQs, with Rocket Loader's temporary wrapper no longer present.
- The actual fetched production HTML + exact fetched public JS, after normalizing only the verified Cloudflare Rocket Loader wrapper, passed the same 36-case Chromium matrix.
- PR #108 moved the runtime from contaminated `remediation1` to fresh `remediation2` only after the true active origin was corrected.
- No new canonical URL was introduced and no sitemap change was required.
- Temporary Time Off gate/public/baseline artifacts were removed after verification; the active-public rollback remains preserved.

### Billable Hours Calculator `/billable-hours-calculator/` — VERIFIED release

PR #105 squash-merged the functional remediation at `894b90538c53edd497f6e032fb8f05131630f054`. PR #106 squash-merged the public runtime cache-key/social-metadata fix at `a5ca9edfae11474580ca348c786f5ce42629ec00`.

Research / ownership:
- Ubersuggest U.S. `billable hours calculator`: 480 monthly searches, $9.75 CPC, SD 18.
- Ubersuggest U.S. `calculate billable hours`: 590 monthly searches, $10.66 CPC, SD 23.
- Ubersuggest U.S. `billable hours`: 2,400 monthly searches, $0.22 CPC, SD 37.
- Ubersuggest U.S. `billable vs non billable hours`: 110 monthly searches, SD 23.
- Ubersuggest U.S. `utilization rate calculator`: 170 monthly searches, SD 13.
- Exact-query Ubersuggest SERP snapshot updated 2026-08-06 ranked LegalSoft #1, Toggl #2, LogMyHours #3, Omni Calculator #4, FirmTimer #7, Harvest #10 and Corcava #12.
- Current 2026-10-07 web review confirmed a mixed SERP: some tools combine utilization, effective rate/value and target gaps; legal-oriented tools also expose 6-minute or other billing increments. Corcava explicitly separates invoice rounding from utilization planning.
- Canonical decision: this URL owns billable-utilization and simple billable-value/capacity arithmetic from total worked hours plus billable hours. Legal billing increments/rounding, time tracking, invoicing, realization/write-off policy, tax, collections, profitability, payroll and overtime stay outside this URL.
- `/hours-and-minutes-calculator/` and `/decimal-hours-calculator/` remain time-conversion owners; `/work-hours-calculator/`, `/payroll-hours-calculator/` and `/timesheet-pay-calculator/` remain worked-time/payroll owners.

Baseline / rollback:
- Pre-remediation production HTML exactly matched GitHub/main blob `9fa1809fa8b154b9e76f60110fb9c5fcae3544f9`.
- Pre-remediation production JS exactly matched GitHub/main blob `8d2b9e52695498b784f4a33cc894b3dbc5016b31`.
- Rollback was captured before merge at `/opt/hostedtimesheets/rollback-billable-hours-20261007/`.
- Rollback HTML SHA-256: `592316e51875063e7848f2729b5d8fdca6825253436b0181e02aa741eb7ff45a`; exact blob `9fa1809fa8b154b9e76f60110fb9c5fcae3544f9`.
- Rollback JS SHA-256: `9190f752a556b33ebbf76043c3695f432fcafbb44620e37a76d2db7a1dfd726c`; exact blob `8d2b9e52695498b784f4a33cc894b3dbc5016b31`.

Product / calculation:
- Replaced silent blank/malformed/negative coercion and silent billable/target clamping with explicit field-level validation.
- Total worked hours and billable hours are required finite values >= 0; decimal hours remain valid.
- Billable hours must be <= total worked hours for the same period. Over-limit billable hours are invalid rather than silently capped.
- Utilization = billable hours ÷ total worked hours × 100 when total worked hours > 0.
- 0 worked + 0 billable is valid but utilization is N/A because 0 ÷ 0 is undefined.
- Billing rate is genuinely optional. Blank rate suppresses money metrics; explicit zero is valid; entered rate must be finite and nonnegative.
- Added billable value and effective billable value per worked hour.
- Target utilization is genuinely optional. Blank target suppresses target outputs; 0% and 100% are valid; entered target must be finite and within 0–100%.
- Added target billable hours, signed hours-vs-target, value at target and signed value-vs-target.
- Invalid optional rate/target leaves independent valid arithmetic visible but suppresses affected outputs and full-result copy.
- Currency changes formatting only and performs no FX conversion.
- Added copyable reproducible results, live status, 8 schema-matched FAQs, clearer denominator/money boundaries and page-local mobile containment.
- Example: 45 worked / 28 billable / $65 rate / 70% target => 62.2% utilization, 17.00 non-billable hours, $1,820 billable value, $40.44 effective value/worked hour, 31.50 target hours, −3.50 hours, $2,047.50 target value and −$227.50 value gap.

Pre-release gate:
- Final tested hotfix branch head: `d39a575b667d603f8bfce206dca4decc7e962d7c`.
- Final exact-source parity: VERIFIED 5 / 5 for Billable Hours HTML, JS, HTML test, Chromium test and shared content-audit script.
- Final merged runtime blobs: HTML `83ecef5253929403b78e0127c0d3088fcc7fbad1`; JS `cc01ad368dbb4e96cff059b081feba9be5b66eaa`.
- HTML/schema/accessibility contract: PASS.
- `billable-hours.js` Node syntax: PASS.
- Exact-source Chromium calculation/UI matrix: PASS, 44 cases across 390px mobile and 1280px desktop; zero runtime exceptions/console errors.
- Matrix covers defaults, decimal hours, billable=total, billable>total invalid, blank/negative required inputs, zero-hours N/A, blank/zero/invalid rate, blank/0/100/invalid target, currency/no-FX, worked example, copy/reset, canonical/scope and overflow.
- Final page content audit: PASS, 0 hard failures — 1,164 main-content words, 17 H2/H3 headings, 15.1-word average sentence, 56-word maximum paragraph, passive heuristic 5.2 / 1,000 and 8 visible FAQs.
- Repository-wide audit still reports the same 8 hard-rule failures on other queued/unremediated pages; Billable Hours itself is PASS.
- GitHub Actions PR #105 run #99 and PR #106 run #102 failed with zero executable steps. No GitHub CI PASS is claimed; exact-source ZT evidence supplied the release gate.

Production / CDN verification:
- Production origin HTML SHA-256: `5ae636eb2871685bbcf87dc84f64909131ebde06d568a6e94c7d5865366308ec`; blob `83ecef5253929403b78e0127c0d3088fcc7fbad1`.
- Production origin JS SHA-256: `c1140bfd8bc242403c87a23e576b4d99697597650950a08debdba0b7e30c2041`; blob `cc01ad368dbb4e96cff059b081feba9be5b66eaa`.
- Origin runtime blobs exactly match merged GitHub/main.
- Public page: HTTP 200, Cloudflare `DYNAMIC`, Last-Modified 2026-10-07 11:08:54 UTC, self-canonical, schema `dateModified` 2026-10-07, effective-value and target-value metrics, Copy Result, 8 FAQs and explicit no-FX language.
- Public runtime URL is `/assets/js/billable-hours.js?v=20261007-remediation2`; its fetched Git blob `cc01ad368dbb4e96cff059b081feba9be5b66eaa` exactly matches merged GitHub/main and origin.
- Release verification caught a stale-CDN asset before DONE: `remediation1` had been publicly fetched before the new origin JS write and continued serving the old JS blob. PR #106 moved the page to the verified fresh `remediation2` cache key. This was fixed before completion.
- Cloudflare Rocket Loader rewrites script tags in raw public HTML. A true-public 390x844 Chromium render returned code 0 and showed `remediation2` in the rendered DOM with Rocket Loader's inert script types/loader wrapper removed, proving the CDN loader executed.
- The actual fetched production HTML + exact fetched public JS, after normalizing only the verified Rocket Loader wrapper, passed the same 44-case mobile/desktop Chromium matrix.
- No new canonical URL was introduced and no sitemap change was required.

Deployment behavior:
- PR #104 had auto-synchronized production early, but PRs #105/#106 did not update the origin before post-merge checks. Merge-triggered production sync is therefore possible but not guaranteed.
- Permanent release rule: preserve rollback before merge; verify post-merge origin against merged `main`; manually deploy only exact tested files when origin differs.
- Permanent CDN rule: do not prefetch a new versioned asset URL before its origin bytes are written; if this occurs, use a fresh cache key after origin verification.
- Temporary Billable Hours gate/public/cache-probe files were removed after verification; the tested rollback directory remains preserved.

### Hours & Minutes Calculator `/hours-and-minutes-calculator/` — VERIFIED release

PR #104 squash-merged the strict remediation at `600c403465005771269134a9fdec9a4dd10f356d`.

Research / ownership:
- Ubersuggest U.S. `hours and minutes calculator`: 14,800 monthly searches, $1.13 CPC, SD 35.
- Ubersuggest U.S. `hours minutes calculator`: 14,800 monthly searches, $4.82 CPC, SD 34.
- Ubersuggest U.S. `time addition calculator`: 18,100 monthly searches, $2.11 CPC, SD 41.
- Ubersuggest U.S. `add hours and minutes`: 1,900 monthly searches, SD 31.
- Ubersuggest exact-query SERP snapshot (updated 2026-10-03) showed CalculateHours #1, CalculatorSoup #2 and an AI Overview.
- Ubersuggest reported CalculateHours PA 44 with 923 backlinks / 204 referring domains and CalculatorSoup PA 37 with 2 backlinks / 2 referring domains for its Hours & Minutes page.
- Live 2026-10-07 competitor review confirmed several-row +/- duration workflows on CalculatorSoup and up to 20 rows on HourTotal; other competitors remain two-duration tools or expand into broader clock/date/decimal modes.
- Canonical decision: this URL owns arithmetic on already-known H:M durations, including one-duration conversion, two-duration add/subtract and multi-duration +/- arithmetic.
- `/time-duration-calculator/` remains the endpoint/clock-time owner, `/work-hours-calculator/` remains the shift/break owner, and `/decimal-hours-calculator/` remains the reverse decimal-conversion owner.

Baseline / reconciliation:
- Pre-remediation live JS matched GitHub/main exactly at blob `6c4c4dfbc523dc07c6e05e94aa565f07834e02bd`.
- Pre-remediation live HTML blob was `3feb388cc6e351d959aab98f4660dfed1c4417e8`.
- The live HTML differed from the then-current GitHub HTML only in three visible link labels: live used “Elapsed Time Calculator” where GitHub used the current canonical name “Time Duration Calculator.” Replacing those three labels made the files otherwise identical, so no hidden production-only calculation behavior was found.

Product / calculation:
- Preserved Convert one duration, Add two durations and Subtract second duration modes.
- Added Add/subtract multiple durations mode supporting up to 10 total durations with per-row +/- operation and removable extra rows.
- Multi example: 7h45m + 8h20m + 6h10m − 0h30m = 1,305 minutes = 21h45m = 21.75 decimal hours.
- Replaced silent blank/malformed/negative/fractional coercion and minute clamping with explicit field-level validation and stale-output suppression.
- Required hours are whole numbers >= 0; required minute portions are whole numbers 0–59. Unsafe integer-minute magnitudes are rejected.
- Signed subtraction remains valid; larger subtracted durations can produce negative H:M and decimal outputs.
- Hourly rate is optional. Blank rate leaves the duration valid and suppresses the money estimate; entered rate must be finite and nonnegative.
- Rate × time uses exact result minutes ÷ 60 before display rounding.
- Currency selection changes formatting only and does not perform FX conversion.
- Added full-result copy, live status messaging, a multi-duration worked example, two additional schema-matched FAQs (8 total) and page-local mobile containment.
- Kept clock-in/out, cross-midnight, reverse decimal input, break deduction, overtime, tax, billing-policy and jurisdiction logic outside this URL.

Pre-release / merged-source gate:
- Tested branch head after final drift reconciliation: `70b5cb310cd3587c8813d966086c6a399df7453a`.
- GitHub/main runtime blobs after merge: HTML `beb0dc796215a9808d43e501417a872536b588a0`; JS `339303444eea1f59347b2619af5896d61f738dc8`.
- ZT exact-content parity: VERIFIED 5 / 5 for Hours & Minutes HTML, runtime JS, HTML test, Chromium test and repository content-audit script.
- An intermediate branch-head change modified the runtime status copy and HTML-test regex; the staged snapshot was explicitly invalidated, the two files were re-synchronized, 5/5 parity re-established, and the complete release gate rerun. No earlier stale-snapshot PASS was used for release.
- `hours-minutes.js` Node syntax: PASS.
- HTML/schema/accessibility contract: PASS.
- Exact repository Chromium calculation/UI matrix: PASS, 47 cases at 390px mobile and 1280px desktop; zero runtime exceptions and console errors.
- Matrix covered convert/add/subtract/negative results, multi-duration arithmetic, 10-duration limit, row removal, required-field validation, hidden-field scope, blank/zero/invalid optional rate behavior, currency/no-FX behavior, copy/reset, canonical/scope checks and horizontal overflow.
- Exact repository content-quality logic on this page: PASS, 0 hard failures — 1,151 main-content words, 16 H2/H3 headings, 13.2-word average sentence, 51-word maximum paragraph, passive heuristic 7.0 / 1,000, 8 visible FAQs and 7 example references.
- Repository-wide audit still reports 8 hard-rule failures on other queued/unremediated pages. Hours & Minutes itself is PASS; unrelated pages were not bundled into this one-page release.
- GitHub Actions PR #104 run #98 and branch run #96 failed with zero executable steps. This is recorded as BLOCKED/infrastructure failure, not as a content FAIL or CI PASS. ZT exact-source evidence supplied the release gate.

Production / public:
- Production origin HTML SHA-256: `306d53859f4520a10dac5d8bbd6b781c0dc0795d87763087b81dcc41e4995c49`.
- Production origin JS SHA-256: `24ed0a9e99f42fdc0b9c8744cac9476dbf15bcc5356a35be9db829267f542986`.
- Production origin Git blobs exactly match merged GitHub/main: HTML `beb0dc796215a9808d43e501417a872536b588a0`; JS `339303444eea1f59347b2619af5896d61f738dc8`.
- Public page: HTTP 200, Cloudflare `DYNAMIC`, self-canonical, schema `dateModified` 2026-10-07, multi-duration option, Copy Result, 8 visible/schema FAQs, no-FX language and runtime `/assets/js/hours-minutes.js?v=20261007-remediation1`.
- Cloudflare injects public HTML response markup, so public HTML bytes are not expected to equal origin byte-for-byte. Required public markers were verified after fetch.
- Public versioned JS Git blob `339303444eea1f59347b2619af5896d61f738dc8` exactly matches GitHub/main and production origin.
- True-public headless Chromium at a 390x844 window completed with return code 0 and executed the new runtime: default rendered 510 total minutes, 8.50 decimal hours, $212.50 rate × time estimate, multi-duration mode, Copy Result, versioned runtime and 8 FAQs.
- No new canonical URL was introduced and no sitemap change was required.

Rollback / deployment behavior:
- PR #104 merge auto-synchronized production before the manual rollback-copy step could capture old bytes.
- The exact pre-release origin was nevertheless recoverable because its Git blobs had already been verified before implementation and the HTML delta from old GitHub/main was proven to be exactly three link-label replacements.
- Rollback path: `/opt/hostedtimesheets/rollback-hours-minutes-20261007/`.
- Reconstructed rollback HTML exactly matches the pre-release live origin blob `3feb388cc6e351d959aab98f4660dfed1c4417e8`; SHA-256 `82afbd4696a3cbd17e64d58ad09b46414561b66b34c239d950023e95e9803986`.
- Rollback JS exactly matches the pre-release live origin blob `6c4c4dfbc523dc07c6e05e94aa565f07834e02bd`; SHA-256 `c2902b21a9aa468095dc6770ad2f7d6ffdbe3b0fabb773ad6d82343399cb84e1`.
- Future releases must capture rollback before merge because merge-triggered auto-sync is now VERIFIED behavior.

### Salary Calculator With Bonus `/salary-calculator-with-bonus/` — VERIFIED release

PR #102 squash-merged the strict remediation at `aff07dfa1eae45a2cbeabbe7a78f2458f1105b0f`.

Research / ownership:
- Ubersuggest U.S. `salary calculator with bonus`: 2,400 monthly searches, $8.23 CPC, SD 6.
- Ubersuggest U.S. `salary bonus calculator`: 2,400 monthly searches, $7.81 CPC, SD 47.
- Ubersuggest U.S. `bonus calculator`: 5,400 monthly searches, SD 46.
- Ubersuggest U.S. `total compensation calculator`: 880 monthly searches, $6.65 CPC, SD 62.
- Exact-query SERPs mix gross salary/bonus arithmetic with bonus-tax/paycheck tools; broader total-compensation tools commonly add equity and benefits, so those are not merged into this URL.
- Canonical decision: this URL owns gross base salary + annual bonus arithmetic, including percentage, fixed and target-total-compensation solve modes.
- Permanent raises remain on `/salary-increase-calculator/`; salary-only hourly conversion remains on `/salary-to-hourly-calculator/`; hourly-wage conversion remains on `/hourly-wage-calculator/`; pay-frequency conversion remains on `/biweekly-pay-calculator/`.
- Tax/withholding/take-home, commissions, equity/RSUs, benefits, retirement match, vesting, bonus eligibility, payout schedules and jurisdiction-specific payroll logic remain outside this page.

Product / calculation:
- Replaced silent blank/malformed/negative coercion and schedule clamping with explicit field-level validation and stale-output suppression.
- Preserved percentage and fixed annual bonus modes.
- Added target total compensation mode: required bonus = target total compensation − base annual salary; target below base salary is invalid.
- Effective bonus percentage is bonus ÷ base salary × 100 when base salary > 0; zero-base fixed/target dollar arithmetic remains valid while percentage displays N/A.
- Percentage bonuses above 100% remain mathematically valid; no arbitrary compensation-policy ceiling is imposed.
- Preserved monthly, biweekly, weekly and hourly gross-equivalent outputs.
- Hours/week must be 0.25–168; Workweeks/year must be a whole number 1–53.
- Added copyable result output and live status messaging.
- Clarified prominently that currency selection changes formatting only and performs no FX conversion.
- Clarified that pay-equivalent outputs are arithmetic planning equivalents, not bonus-payment schedules.
- Added an eighth visible/schema-matched FAQ and page-local `min-width:0` mobile containment.

Pre-release / merged-source gate:
- GitHub/main runtime blobs: HTML `d7bd08bc6e1e1447b7d6ef53ae9bd9b8026a143e`; JS `1d844b5233ab4c7695fae30b6ff62ca19beb3a2d`.
- ZT exact-content parity: VERIFIED 5 / 5 for Salary Bonus HTML, runtime JS, HTML test, Chromium test and repository content-audit script.
- `salary-bonus.js` Node syntax: PASS.
- HTML/schema/accessibility contract: PASS.
- Exact repository Chromium calculation/UI matrix: PASS, 41 cases at 390px mobile and 1280px desktop; zero runtime exceptions and console errors.
- Matrix covered percentage, fixed and target formulas; target-below-base invalid state; zero-base fixed bonus/N/A percentage; zero and >100% bonus cases; active-input blank/negative validation; hours/week and workweeks boundaries; currency formatting/no-FX behavior; copy/reset; method visibility; canonical/scope checks; and horizontal overflow.
- Exact repository content-quality logic on this page: PASS, 0 hard failures — 1,034 main-content words, 13 H2/H3 headings, 14.4-word average sentence, 50-word maximum paragraph, passive heuristic 7.7 / 1,000, 8 visible FAQs and 6 example references.
- Repository-wide audit still reports 8 hard-rule failures on other queued/unremediated pages. Salary Bonus itself is PASS; unrelated pages were not bundled into this one-page release.
- GitHub Actions PR #102 run #94 failed before any executable job step and exposed zero steps. This is recorded as BLOCKED/infrastructure failure, not as a content FAIL or CI PASS. ZT exact-source evidence supplied the release gate.

Production / public:
- Production origin HTML SHA-256: `d7d123038a714d05dd75280cd42d8870edcb1b44d08ec57d0e8b0afc6943566b`.
- Production origin JS SHA-256: `8ff39bbee110972bbb7ca0c3684760c7b6902cda16b3a7ba7e61f7244bd8f195`.
- Production origin Git blobs exactly match merged GitHub/main: HTML `d7bd08bc6e1e1447b7d6ef53ae9bd9b8026a143e`; JS `1d844b5233ab4c7695fae30b6ff62ca19beb3a2d`.
- Public page: HTTP 200, Cloudflare `DYNAMIC`, self-canonical, schema `dateModified` 2026-10-07, target mode, copy control, 8 visible/schema FAQs, explicit no-FX copy and runtime `/assets/js/salary-bonus.js?v=20261007-remediation1`.
- Public versioned JS Git blob `1d844b5233ab4c7695fae30b6ff62ca19beb3a2d` exactly matches GitHub/main.
- True-public headless Chromium at a 390x844 window completed with return code 0 and executed the new runtime: default rendered total `66,000.00`, bonus percentage `10.00%`, target option, copy control, versioned runtime and 8 FAQs were present. Browser-container DBus diagnostics were environmental noise, not page runtime failures.
- No new canonical URL was introduced and no sitemap change was required.

Rollback / cleanup:
- Rollback path: `/opt/hostedtimesheets/rollback-salary-bonus-20261007/`.
- Rollback HTML Git blob: `3a77f41c673d7d20540327c73db50f9bc3ecf67f`; SHA-256 `f3a2464285ed21da14a7290875415a45c69d168ec757f826017c7220c1af4fa8`.
- Rollback JS Git blob: `9beb07ea7dda1d979fa24bfad2dd834e8391c10d`; SHA-256 `f36a63674dc93c3a36c98322d7cab97aeaeb192db7ed3c947639dfca119553cc`.

### PTO Accrual Calculator `/pto-accrual-calculator/` — VERIFIED release

PR #101 squash-merged the strict remediation at `9acb7f4a22d9b75da6e97da77f8ea3ebe63ff7b5`.

Research / ownership:
- Ubersuggest U.S. `pto accrual calculator`: 4,400 monthly searches, $9.62 CPC, SD 12.
- Ubersuggest U.S. `pto calculator`: 5,400 monthly searches, $7.25 CPC, SD 21.
- Ubersuggest U.S. `accrued pto calculator`: 4,400 monthly searches, $9.62 CPC, SD 15.
- Ubersuggest U.S. `vacation accrual calculator`: 480 monthly searches, $3.05 CPC, SD 14.
- Low-authority specialist competition remains present; Ubersuggest reported PTOAccrualCalculator.com at PA 15 with 7 backlinks / 7 referring domains and ShiftFlow at PA 18 with 0 backlinks / 0 referring domains.
- Canonical decision: this URL owns general PTO/vacation accrual and balance arithmetic across hourly, per-pay-period, annual-allowance and fixed/front-loaded modes.
- `/pto-accrual-based-on-hours-worked/` remains the specialist hours-worked owner; `/how-to-calculate-pto-accrual/` remains the methodology guide; `/time-off-tracker/` remains the organization/tracking workflow.
- State/country entitlement, payout/cash value, waiting periods, carryover/forfeiture decisions, eligibility and which hours/pay periods qualify remain outside the calculator.

Product / calculation:
- Replaced silent negative/blank/malformed numeric coercion with explicit field-level validation and stale-output suppression.
- Added annual-allowance mode: annual PTO allowance ÷ eligible periods/year × completed eligible periods.
- Preserved hourly, direct per-pay-period and fixed/front-loaded modes.
- Added projected workdays using user-entered hours per workday.
- Added visible cap reduction and clarified that the cap is only an arithmetic ceiling on the final displayed balance; it does not decide whether accrual stops or excess PTO is forfeited.
- Preserved negative projected PTO as an arithmetic-valid output when usage exceeds entered available balance.
- Added copyable result output, live status and an eighth schema-matched FAQ.
- Added page-local `min-width:0` containment so wide content/table material cannot expand the mobile document.
- Kept the narrow U.S. Department of Labor vacation-leave reference while explicitly preserving the employer/policy/jurisdiction boundary.

Pre-release / merged-source gate:
- GitHub/main runtime blobs: HTML `b299aef53e759736068f4b5902a27552c0bfd2d0`; JS `9d7f91d2cde62f06a04f0ad7d93b84e7cc5ccb01`.
- ZT exact-content parity: VERIFIED 5 / 5 for PTO HTML, runtime JS, HTML test, Chromium test and the repository content-audit script.
- `pto-accrual.js` Node syntax: PASS.
- HTML/schema/accessibility contract: PASS.
- Exact repository Chromium calculation/UI matrix: PASS, 46 cases at 390px mobile and 1280px desktop; zero runtime exceptions and console errors.
- Matrix covered hourly, pay-period, annual-allowance and fixed formulas; decimal rate precision; negative balance; cap arithmetic; workday conversion; global and method-specific blank/negative/fractional/boundary validation; explicit-zero validity; copy/reset; method visibility; canonical/scope checks; and horizontal overflow.
- Exact repository content-quality logic on this page: PASS, 0 hard failures — 1,552 main-content words, 22 H2/H3 headings, 18.3-word average sentence, 62-word maximum paragraph, passive heuristic 6.4 / 1,000, 8 visible FAQs and 10 example references.
- The repository-wide audit currently reports 8 hard-rule failures on other not-yet-remediated queued pages. PTO Accrual itself is PASS; those unrelated failures were not bundled into this one-page release.
- GitHub Actions PR #101 run #92 failed before any executable job step and exposed no step output. This is recorded as BLOCKED/infrastructure failure, not as a content FAIL or CI PASS. ZT exact-source evidence supplied the release gate.

Production / public:
- Production origin HTML SHA-256: `5b8ee4f44ddda639a70807cf89c13a284d4f2b59ab507072a81bb25f5c2ff9dc`.
- Production origin JS SHA-256: `a938ff1466efb10ab4136cd853fe2dfbb1b19fa6add2f70b0cbd53ca627b93d6`.
- Production origin Git blobs exactly match merged GitHub/main: HTML `b299aef53e759736068f4b5902a27552c0bfd2d0`; JS `9d7f91d2cde62f06a04f0ad7d93b84e7cc5ccb01`.
- Public page: HTTP 200, Cloudflare `DYNAMIC`, self-canonical, schema `dateModified` 2026-10-07, 8 visible/schema FAQs, annual mode, copy control, workday output, cap-reduction output and runtime `/assets/js/pto-accrual.js?v=20261007-remediation1`.
- Public versioned JS Git blob `9d7f91d2cde62f06a04f0ad7d93b84e7cc5ccb01` exactly matches GitHub/main.
- True-public headless Chromium at a 390x844 window returned HTTP/rendered DOM successfully and executed the calculator runtime: default public output rendered as 8.00 PTO hours, 1.00 workday and 0.00 cap reduction. Container DBus diagnostics were environmental browser noise; the page render itself completed with return code 0.
- No new canonical URL was introduced and no sitemap change was required.

Rollback / cleanup:
- Rollback path: `/opt/hostedtimesheets/rollback-pto-accrual-20261007/`.
- Rollback HTML Git blob: `98cfbbb27ec49fe0cae080921e4b053e55fea75e`; SHA-256 `caec90465101ca6bbaf75b1eff22573bf218a7e80fb0b7e6f7fd1dc5c63a6a3e`.
- Rollback JS Git blob: `e023fb6e2904b149b697f4c79fd696b0e6b99de1`; SHA-256 `d2c06af8f13acfa51450df4ee21f4686eb8faeea622f7cd7c8217c15858662df`.

### Hourly Wage Calculator `/hourly-wage-calculator/` — VERIFIED release

PR #100 squash-merged the strict remediation at `ba4c6b39b9ed9c7b858441e6aa8655189ba475b5`.

Research / ownership:
- Ubersuggest U.S. `hourly wage calculator`: 18,100 monthly searches, ~$1.94 CPC, SD 19.
- Ubersuggest U.S. `hourly pay calculator`: 8,100 monthly searches, ~$2.23 CPC, SD 16.
- Ubersuggest U.S. `hourly to salary calculator`: 49,500 monthly searches, ~$1.13 CPC, SD 56; treated as broader/harder secondary intent rather than a traffic forecast.
- Canonical decision: this URL owns gross hourly-rate to daily, weekly, biweekly, average monthly and annual pay equivalents with user-supplied schedule/overtime assumptions.
- Tax/withholding/take-home, reverse salary conversion, timesheet-derived pay and overtime-eligibility decisions remain outside this URL.

Product / calculation:
- Replaced silent clamping/coercion of invalid required inputs with explicit field-level validation and output suppression.
- Explicit zero hourly wage remains valid.
- Weeks/year must be a whole number 1–53; workdays/week a whole number 1–7; regular and overtime hours are bounded 0–168 and cannot total more than 168/week.
- Blank overtime hours remain valid zero; a blank overtime multiplier is harmless only when overtime hours are zero.
- Preserved gross-pay formulas and optional overtime; annual overtime explicitly assumes the entered overtime hours repeat across all paid workweeks.
- Added copyable result output and live status messaging.
- Clarified that currency selection changes formatting only and does not perform FX conversion.
- Added a seventh visible/schema FAQ for currency behavior.
- Fixed a real 390px document overflow caused by the article/table grid min-content width using a page-local `min-width:0` containment fix; the table keeps its internal horizontal scroller.

Pre-release / merged-source gate:
- GitHub/main runtime blobs: HTML `5d1a52089d8eccb28013b6f85e1b12cfbfd29efa`; JS `67fa35152945ea434c161a40214159364a2d391b`.
- ZT exact-content parity: VERIFIED for HTML, JS and both dedicated tests.
- `hourly-wage.js` Node syntax: PASS.
- Exact repository Chromium calculation/UI matrix: PASS, 33 cases at 390px mobile and 1280px desktop; zero runtime exceptions and console errors.
- HTML/schema/accessibility contract: PASS.
- Equivalent measurable content-quality gate: PASS, 0 hard failures — 1,009 main-content words, 10 H2/H3 headings, 15.1-word average sentence, 81-word maximum paragraph, passive heuristic 3.0/1,000, 7 visible FAQs, 3 example references.
- GitHub Actions workflow runs #89/#90 were created but failed within seconds with zero executable steps and no retrievable job log. This is recorded as BLOCKED/infrastructure failure, not as a content-quality FAIL or CI PASS. ZT/direct measurable evidence supplied the release gate.

Production / public:
- Production origin HTML SHA-256: `29ff2ae674767694b701aacab3ca06639e9de62bbc3e77e4d1a8702441cfcc13`.
- Production origin JS SHA-256: `35f0b9cd313e68867b21e59053ac0592b42be3758147035b18791478b17cf908`.
- Production origin Git blobs exactly match GitHub/main: HTML `5d1a5208...`; JS `67fa3515...`.
- Public page: HTTP 200, Cloudflare `DYNAMIC`, self-canonical, schema `dateModified` 2026-10-07, 7 FAQ entities and versioned runtime `/assets/js/hourly-wage.js?v=20261007-remediation1`.
- Public versioned JS Git blob `67fa35152945ea434c161a40214159364a2d391b` exactly matches GitHub/main.
- Public HTML visibly contains the new validation fields, copy control, overtime/currency assumption copy, mobile containment fix and updated schema.
- No new canonical URL was introduced and no sitemap change was required.

Rollback / cleanup:
- Rollback path: `/opt/hostedtimesheets/rollback-hourly-wage-20261007/`.
- Rollback HTML SHA-256: `55f197c0057cad10322b7612e4e749661cf1a4cbc6d4839adb91e130dff9edf2`.
- Rollback JS SHA-256: `d08a5bfe68b587b0266ee2ab6d6b421853875086515a88638554d3890a19de4d`.

### Time Duration Calculator `/time-duration-calculator/` — VERIFIED release

PR #99 squash-merged the strict remediation at `4e72c521cabab119e14d9797139ecad9cfaed452`.

Research / ownership:
- Ubersuggest U.S. `time duration calculator`: 135,000 monthly searches, $0 CPC, SD 34.
- Ubersuggest U.S. `elapsed time calculator`: 12,100 monthly searches, $0 CPC, SD 16.
- Ubersuggest U.S. `time difference calculator`: 18,100 monthly searches, SD 71.
- Ubersuggest U.S. `hours between two times`: 2,400 monthly searches, SD 30.
- Ubersuggest U.S. `time calculator with break`: 1,300 monthly searches, $3.46 CPC, SD 35.
- Ubersuggest primary SERP reported CalcShelf at position 1 with DA 10 / PA 14 and 0 backlinks / 0 referring domains, with additional DA 1–6 specialist tools on page one.
- Canonical decision: this URL owns endpoint-to-endpoint time duration / elapsed time / hours-between-times intent. Add/subtract-known-duration, repeated-shift, projected-finish and timesheet workflows remain separate URLs.
- The reported `date time duration calculator` volume is highly volatile month to month and is not treated as a traffic forecast.
- Retired `/elapsed-time-calculator/` remains the permanent migration path to this canonical.

Product / calculation:
- Replaced silent break clamping/coercion with explicit validation.
- Blank break remains valid zero; negative or fractional break minutes are rejected.
- Date & time mode no longer silently repopulates a cleared required date with today; a cleared date remains blank and invalid.
- Added strict real-calendar date parsing.
- Preserved Time only next-day behavior when end < start.
- Matching start/end times explicitly produce zero duration, not 24 hours.
- Date & time mode rejects an endpoint earlier than the start rather than silently reversing it.
- Break deduction affects only net duration; gross remains visible and net floors at zero when break exceeds gross.
- Added Total days, Copy result and separate Overnight / Multi-day examples.
- Preserved seconds precision, decimal hours, total minutes/seconds, Start = now, End = now, Swap and Reset.
- Kept timezone/UTC/DST conversion, payroll rounding, countdown and multi-interval timesheet modes out of scope.

Pre-release / merged-source gate:
- GitHub branch -> ZT exact content parity: VERIFIED 4 / 4 for Time Duration HTML, runtime JS and both dedicated tests.
- Content Quality: PASS, 0 hard failures.
  - 1,154 main-content words.
  - Average sentence length: 15.2 words.
  - Maximum paragraph: 67 words.
  - Passive heuristic: 5.2 / 1,000 words.
  - 8 visible FAQs.
- HTML/schema/accessibility contract: PASS.
- `time-duration.js` Node syntax: PASS.
- Exact repository Chromium calculation/UI matrix: PASS, 41 cases at 390px mobile and 1280px desktop.
- Matrix covered default arithmetic, seconds precision, overnight next-day logic, same-start/end zero, break deduction, break>gross zero floor, blank/negative/fractional break semantics, blank time validation, Date & time initialization, cleared-date persistence, multi-day arithmetic, leap-day arithmetic, earlier-end rejection, examples, swap, reset, copy, current-time controls, canonical/scope and horizontal overflow.
- GitHub Actions remained BLOCKED by the known quota condition. PR #99 had no executable workflow run/status; this was not recorded as a CI PASS. ZT contingency evidence supplied the release gate.

Production / public:
- Previous production HTML SHA-256: `f9bbbb613d03215af4919937d3e2ebb31629e6afac62ef56006007a1ad58e493`.
- Previous production JS SHA-256: `c813f3a564232f7d7e1b3ba982ce443300582a6168f476c5abdf0fd0d73f507d`.
- Current production HTML SHA-256: `905d49045195dfcec3e5efe8f1de7ba94082a7079283639c3984f810716fff55`.
- Current production JS SHA-256: `9e227a0afc35b763ce149192703ab769db87c0fd4f817e60088f77a9eaf2ba03`.
- Production origin bytes exactly match the tested ZT/GitHub snapshot.
- Public page: HTTP 200, Cloudflare `DYNAMIC`, title `Time Duration Calculator — Between Times & Dates`, self-canonical, 8-FAQ schema, schema `dateModified` 2026-10-06 and runtime `/assets/js/time-duration.js?v=20261006-remediation1`.
- Public versioned JS bytes exactly match GitHub `main`.
- Retired HTTPS `/elapsed-time-calculator/` remained a one-hop HTTP 301 to `/time-duration-calculator/` before and after deployment.
- True-public Chromium mobile + desktop smoke: PASS.
  - 390x844 default -> 8h 30m / 8.50h / 0.3542 days / 510 minutes / 30,600 seconds.
  - Seconds case -> 3h 45m 30s / 3.7583h / 225.50 minutes / 13,530 seconds.
  - Overnight -> 8h and explicit next-day status.
  - Same start/end -> 0h with zero-duration status.
  - Negative break -> explicit invalid state and output suppression.
  - Cleared Date & time start date -> remains blank and invalid.
  - Multi-day example -> 2d 3h 30m / 51.50h / 2.1458 days.
  - Mobile Tools panel -> 26 links, 390px width, no document overflow.
  - 1280x900 -> default result, 7 result metrics, no horizontal overflow.
  - Browser runtime exceptions: 0; console errors: 0.
- No new canonical URL was introduced and no sitemap-file change was required.

Rollback / cleanup:
- Rollback path: `/opt/hostedtimesheets/rollback/time-duration-strict-20261006/`.
- Rollback HTML SHA-256: `f9bbbb613d03215af4919937d3e2ebb31629e6afac62ef56006007a1ad58e493`.
- Rollback JS SHA-256: `c813f3a564232f7d7e1b3ba982ce443300582a6168f476c5abdf0fd0d73f507d`.
- Temporary live-browser verification script was removed after verification.

### Military Time Converter `/military-time-converter/` — VERIFIED release

PR #98 squash-merged the strict remediation at `9cef5762738ac85ed703cb23ee115cf751e4b414`.

Research / ownership:
- Ubersuggest U.S. `military time converter`: 74,000 monthly searches, $0.11 CPC, SD 22.
- Ubersuggest U.S. `military time chart`: 135,000 monthly searches, $0.31 CPC, SD 28.
- Ubersuggest U.S. `standard time to military time`: 1,600 monthly searches, SD 25.
- Ubersuggest U.S. `military time to standard time`: 1,600 monthly searches, SD 38.
- Current SERP remains converter/chart-first and includes both high-authority domains and lower-authority specialist tools.
- Canonical decision: this URL owns military/24-hour/standard notation conversion plus the military-time chart. Timezone/UTC/Zulu conversion, elapsed duration and shift-end planning remain separate intents.

Product / conversion:
- Preserved the existing smart parser for compact military values, colon-form 24-hour values, AM/PM values, `noon` and `midnight`.
- Added explicit `aria-invalid` field state, visible error messaging and live conversion status instead of output-only failure behavior.
- Added a tested plain-English spoken form, e.g. 1730 -> “Seventeen thirty hours” and 1700 -> “Seventeen hundred hours”.
- Preserved the deliberate 0000–2359 input contract; `2400` is rejected with a specific explanation.
- Added explicit clock-notation versus timezone/Zulu boundary copy.
- Fixed a real 390px mobile overflow caused by the chart's intrinsic table width without changing shared CSS.
- Preserved current-time, presets, copy and page-scoped printable chart behavior.

Pre-release / merged-source gate:
- GitHub branch -> ZT exact content parity: VERIFIED 4 / 4 for Military Time HTML, runtime JS and both dedicated tests.
- Content Quality: PASS, 0 hard failures.
  - 993 main-content words.
  - Average sentence length: 12.9 words.
  - Maximum paragraph: 57 words.
  - Passive heuristic: 2.0 / 1,000 words.
  - 8 visible FAQs.
- HTML/schema/accessibility contract: PASS.
- `military-time.js` Node syntax: PASS.
- Exact repository Chromium conversion/UI/print matrix: PASS, 40 cases at 390px mobile and 1280px desktop.
- Matrix covered 0000, 1200, 1730, 0730/730, colon-form 24-hour, AM/PM, noon/midnight words, 2359, spoken forms, blank/2400/invalid minute/invalid hour/malformed input rejection, presets, current time, reset, copy suppression, canonical/scope checks, print visibility and horizontal overflow.
- The first browser run correctly caught a real mobile content overflow; the page-scoped fix was applied and the full matrix was rerun from zero to PASS.
- A later intermediate browser interruption was a test-selector quoting defect; only the test harness was corrected and the full matrix then passed.
- GitHub Actions remained BLOCKED by the known quota condition. PR #98 had no executable workflow run/status; this was not recorded as a CI PASS. ZT contingency evidence supplied the release gate.

Production / public:
- Previous production HTML SHA-256: `a727d235dab452ea05fb8c9d1c9a3d6ae2e9715d8529b06d38fce9a0b0744b11`.
- Previous production JS SHA-256: `e2b37b74ba3a7cc55e64ff05840be4ae60028e2911787c23fdb018a2ed19a0d5`.
- Current production HTML SHA-256: `a59d6ed31d43f6715254755df909f44b222342bb3197e59be18e3719f0f0ae4d`.
- Current production JS SHA-256: `64bbb23ec4e984550a0dc7db2a5103114c2fb2ab52b341e21291d55b675d214a`.
- Production origin bytes exactly match the tested ZT/GitHub snapshot.
- Public page: HTTP 200, Cloudflare `DYNAMIC`, title `Military Time Converter & Chart — 12-Hour ↔ 24-Hour`, self-canonical, 8-FAQ schema, schema `dateModified` 2026-10-06 and runtime `/assets/js/military-time.js?v=20261006-remediation1`.
- Public versioned JS bytes exactly match GitHub `main`.
- True-public Chromium mobile + desktop smoke: PASS.
  - 390x844 default -> 1730 / 5:30 PM / 17:30 / “Seventeen thirty hours”.
  - 0730 -> 7:30 AM with the expected spoken form.
  - 2400 -> explicit invalid state and converted-output suppression.
  - `noon` -> 1200 / 12:00 PM.
  - Mobile Tools panel -> 26 links, 390px width, no document overflow.
  - Print media -> calculator hidden, article/chart visible, sidebar hidden, table overflow visible.
  - 1280x900 -> 1730 default, 5 result metrics, no horizontal overflow.
  - Browser runtime exceptions: 0; console errors: 0.
- No new URL was introduced and no sitemap-file change was required.

Rollback / cleanup:
- Rollback path: `/opt/hostedtimesheets/rollback/military-time-strict-20261006/`.
- Rollback HTML SHA-256: `a727d235dab452ea05fb8c9d1c9a3d6ae2e9715d8529b06d38fce9a0b0744b11`.
- Rollback JS SHA-256: `e2b37b74ba3a7cc55e64ff05840be4ae60028e2911787c23fdb018a2ed19a0d5`.
- Temporary live-browser and overflow-diagnostic scripts were removed after verification.

### Clock Out Time Calculator `/clock-out-time-calculator/` — VERIFIED release

PR #97 squash-merged the remediation at `bab8af2db62497b2b2e3199fc0adc0ee6a586816`.

Research / ownership:
- Ubersuggest U.S. `clock out time calculator`: 135,000 monthly searches, $4.56 CPC, SD 29.
- Ubersuggest U.S. `clock out calculator`: 4,400 monthly searches, $5.67 CPC, SD 29.
- Current primary SERP remains calculator-first.
- Ubersuggest reported MTS Calculators at position 1 with DA 8 / PA 15 and 0 backlinks / 0 referring domains on the ranking URL.
- Fresh competitor review confirmed clock-in + paid target + breaks + overnight handling as the core workflow.
- Canonical decision: this URL owns projected shift-end time only. Reverse hours-worked/start-time workflows remain Work Hours / Time Card intent and were deliberately not added.

Product / calculation:
- Replaced silent numeric clamping with explicit field-level validation.
- Added optional additional unpaid-break input while preserving the core clock-out workflow.
- Standard example: 08:30 + 8h paid + 30m unpaid -> 17:00 / 5:00 PM same day.
- Partial example: 09:00 + 7h30m paid + 0m unpaid -> 16:30 / 4:30 PM.
- Overnight example: 22:00 + 8h paid + 0m unpaid -> 06:00 next day.
- Multiple-break example: 08:00 + 8h paid + 30m + 15m unpaid -> 16:45 / 4:45 PM.
- Added total unpaid-break result, reproducible example controls, live validation status and improved copy output.
- Local wall-clock arithmetic only; no break entitlement, compensability, overtime, payroll rounding, wage compliance, timezone or DST determination.

Pre-release / merged-source gate:
- GitHub branch -> ZT exact content parity: VERIFIED 4 / 4 for Clock Out HTML, runtime JS and both dedicated tests.
- Content Quality: PASS, 0 hard failures.
  - 1,085 main-content words.
  - Average sentence length: 14.9 words.
  - Maximum paragraph: 61 words.
  - Passive heuristic: 5.5 / 1,000 words.
  - 7 visible FAQs.
- HTML/schema/accessibility contract: PASS.
- `clock-out-time.js` Node syntax: PASS.
- Exact repository Chromium calculation/UI matrix: PASS, 42 cases at 390px mobile and 1280px desktop.
- Matrix covered default/partial/overnight/multiple-break arithmetic, blank/decimal/negative/out-of-range validation, optional blank extra break, zero durations, multi-day offsets, presets, reset, copy, current-time input, canonical/scope checks and horizontal overflow.
- A failed intermediate multi-day expectation was corrected in the test, not in calculator math: 23:30 + 72h59m paid + 1,440m + 1,440m breaks correctly lands 6 days later at 00:29.
- GitHub Actions Content Quality run #82 failed before executable steps: 0 steps, `runner_id=0`. Actions remains BLOCKED under the known quota/infrastructure condition; this was not recorded as a content failure or a test PASS. ZT contingency evidence supplied the release gate.

Production / public:
- Previous production HTML SHA-256: `98d143557c9dc99e3a892b5fa0564b8a436a63fd3454ff13725b76b3b6f0588c`.
- Previous production JS SHA-256: `52e17a2ca90e2d4738558a35975386bdc7eeb9ef43c251b9e99daa242513051c`.
- Current production HTML SHA-256: `b0d1ce0098d4ac0c6a60b2059b2b241816b0a4917eec304080e1c7eccffcae7b`.
- Current production JS SHA-256: `6940c2e620eb019c2b95d34e0f7ed14423c376c471d394f1b945fb821bb1caed`.
- Public page: HTTP 200, Cloudflare `DYNAMIC`, title `Clock Out Time Calculator — Find Your Clock-Out Time`, self-canonical, 7 visible FAQs, schema `dateModified` 2026-10-06 and runtime `/assets/js/clock-out-time.js?v=20261006-remediation1`.
- Public versioned JS bytes exactly match GitHub `main`.
- True-public Chromium mobile + desktop smoke: PASS.
  - 390x844 default -> 5:00 PM / 17:00, same day.
  - Multiple unpaid breaks -> 4:45 PM / 16:45, 45m unpaid, 8h45m total span.
  - Overnight example -> 6:00 AM / 06:00 next day.
  - Blank paid-hours input -> visible invalid state and output suppression.
  - Mobile Tools panel -> 26 links, 390px width, no document overflow.
  - 1280x900 -> 5:00 PM / 17:00, 5 metrics, no horizontal overflow.
  - Browser runtime exceptions: 0.
- Live sitemap remains 34 canonical URLs and includes the Clock Out canonical.
- Live homepage contains a direct Clock Out link.
- No new URL was introduced and no sitemap-file change was required.

Rollback / cleanup:
- Rollback path: `/opt/hostedtimesheets/rollback/clock-out-20261006/`.
- Rollback HTML SHA-256: `98d143557c9dc99e3a892b5fa0564b8a436a63fd3454ff13725b76b3b6f0588c`.
- Rollback JS SHA-256: `52e17a2ca90e2d4738558a35975386bdc7eeb9ef43c251b9e99daa242513051c`.
- Temporary live-browser verification script was removed after verification.

### Overtime Calculator `/overtime-calculator/` — VERIFIED release

PR #96 squash-merged the remediation at `3fee8a9b514cf4a7450eafcea634b7fedb294af6`.

Research / ownership:
- Ubersuggest U.S. `overtime calculator`: 22,200 monthly searches, $5.83 CPC, SD 20.
- Ubersuggest U.S. `time and a half calculator`: 14,800 monthly searches, $4.11 CPC, SD 20.
- Ubersuggest U.S. `overtime pay calculator`: 4,400 monthly searches, $4.73 CPC, SD 24.
- Current U.S. SERP remains calculator-first and includes both high-authority publishers and low-authority specialist calculators; Ubersuggest reported specialist domains at DA 3-4 and LogMyHours PA 20 with 0 backlinks/referring domains.
- Canonical decision: this URL owns ordinary overtime-pay / overtime-rate / time-and-a-half arithmetic. Payroll-hours conversion, punch reconstruction, state-specific eligibility and the federal qualified-overtime tax deduction remain separate intents.
- Tax-intent demand around “no tax on overtime calculator” was deliberately not merged into this calculator because it requires separate eligibility, reporting and limit logic.

Product / calculation:
- Added two explicit arithmetic modes:
  - Total hours + user-selected threshold.
  - Already-classified regular / overtime / double-time hours.
- Added editable overtime and double-time multipliers without deciding which legal rule applies.
- Blank, invalid and negative active inputs are rejected explicitly rather than silently coerced to zero.
- Explicit zero hours and zero hourly rate remain valid arithmetic values.
- Standard example: 45 hours at $25/hour, 40-hour threshold, 1.5× -> $1,187.50 gross.
- Classified example: 40 regular + 5 overtime + 2 double-time hours at $25/hour, 1.5× / 2× -> $1,287.50 gross.
- Current DOL Fact Sheets #23 and #56A plus IRS FS-2026-13 boundaries are explained without turning the tool into legal, payroll or tax advice.

Pre-release / merged-source gate:
- GitHub `main` -> ZT exact content parity: VERIFIED 4 / 4 for Overtime HTML, runtime JS and both dedicated tests.
- Content Quality: PASS, 0 hard failures.
  - 1,098 main-content words.
  - Average sentence length: 14.8 words.
  - Maximum paragraph: 61 words.
  - Passive heuristic: 3.6 / 1,000 words.
  - 7 visible FAQs.
- HTML/schema/accessibility contract: PASS.
- Exact repository Chromium calculation/UI matrix: PASS, 37 cases at 390px mobile and 1280px desktop.
- Matrix covered default/decimal/zero/boundary inputs, blank and negative validation, hidden-mode isolation, classified-hours switching, double-time math, currencies, examples/reset/copy, canonical/scope checks and horizontal overflow.
- GitHub Actions Content Quality run #81 failed before executable steps: 0 steps, `runner_id=0`. Actions remains BLOCKED under the known quota/infrastructure condition; this was not recorded as a content failure or a test PASS. ZT contingency evidence supplied the release gate.

Production / public:
- Production origin already contained the final merged candidate bytes when final verification resumed, so no unnecessary rewrite was performed.
- Production-origin HTML SHA-256: `2cd5c82d37ef23a74e6efffab8c3addcf6fd3768b9955ba973a28474016ac3ad`.
- Production-origin JS SHA-256: `2c8aeb914bbe0d3f98bdfed81c9b43806750c4f39dc0a3a49394511f79598c41`.
- Public page: HTTP 200, Cloudflare `DYNAMIC`, correct title, self-canonical, 7-FAQ schema, schema `dateModified` 2026-10-06 and runtime `/assets/js/overtime-calculator.js?v=20261006-remediation1`.
- Public versioned JS bytes exactly match GitHub `main`.
- True-public Chromium mobile + desktop smoke: PASS.
  - 390x844 standard example -> $1,187.50 gross / 5.00 overtime hours.
  - 390x844 classified double-time example -> $1,287.50 gross / 2.00 double-time hours.
  - Blank hourly rate -> visible invalid state and result suppression.
  - Mobile Tools panel -> 26 links, 390px width, no document overflow.
  - 1280x900 -> $1,000.00 default gross, 8 result metrics, no horizontal overflow.
  - Browser runtime errors: 0; console errors: 0.
- No new URL was introduced and no sitemap-file change was required.

Rollback / cleanup:
- Rollback path: `/opt/hostedtimesheets/rollback/overtime-20261006/`.
- Previous HTML SHA-256: `8cfd4a2e71a89172148b0808663473e82a19198a7fe75d1a8d46628636b1266d`.
- Previous JS SHA-256: `36fd2691906f3e38d24756b2668487ed88e6f33aafa7d1f73410c3e27404a135`.
- Temporary live-browser verification script was removed after verification.

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
- Overtime remediation is complete and deployed.
- Clock Out remediation is complete and deployed.
- Military Time remediation is complete and deployed.
- Time Duration remediation is complete and deployed.
- The next public page must still be treated as a separate release unit and researched before implementation; do not infer a new intent owner from keyword difficulty alone.

## Remaining strict remediation queue — 2026-10-07

Queue is traffic-first, not permanent. Revalidate Ubersuggest + current SERP + cannibalization immediately before each page starts; move a page only when fresh evidence materially changes the opportunity or a production/policy defect makes it urgent.

1. `/payroll-hours-calculator/` — 9,900 volume, $6.90 CPC, SD 50. Strong value but materially harder SERP.
2. `/salary-to-hourly-calculator/` — 49,500 volume, $0.88 CPC, SD 59. Large demand but high difficulty.
3. `/how-to-calculate-hours-worked/` — 2,400 volume, $4.18 CPC, SD 35. Supporting guide for the hours cluster.
4. `/timesheet-calculator-with-lunch/` — 2,900 volume, $8.58 CPC, SD 50.
5. `/biweekly-timesheet-calculator/` — 1,300 volume, $6.31 CPC, SD 33.
6. `/biweekly-pay-calculator/` — 4,400 volume, $3.74 CPC, SD 59.
7. `/how-to-calculate-pto-accrual/` — 320 volume, $0.23 CPC, SD 24. Supports PTO topical authority.
8. `/weekly-timesheet-calculator/` — 260 volume, $2.42 CPC, SD 48.
9. `/how-to-calculate-time-card/` — 210 volume, $3.17 CPC, SD 52.
10. `/minutes-to-decimal-hours/` — 170 volume, $0 CPC, SD 43.
11. `/timesheet-pay-calculator/` — 30 volume, $3.28 CPC, SD 52. Low direct demand; must justify distinct intent before expansion.
12. `/pto-accrual-based-on-hours-worked/` — 10 volume, $0 CPC, SD 12. Low direct demand; cannibalization with PTO Accrual must be reviewed before remediation.
13. `/time-card-hours-with-lunch-break/` — exact-match query currently reports 0 volume. Revalidate broader semantic cluster before investing.
14. `/about/` — trust/methodology page; traffic is secondary.
15. `/contact/` — trust/support page.
16. `/privacy/` — compliance/trust page; promote earlier only if policy audit finds an issue.
17. `/terms/` — compliance/trust page; promote earlier only if policy audit finds an issue.
18. `/disclaimer/` — compliance/trust page; promote earlier only if policy audit finds an issue.

## Deployment / indexing status

- The global header/navigation shared release, including the iPhone/Safari Tools correction, is deployed across all 34 canonical pages.
- All 34 live canonical URLs reference the verified `ee22a3c` header CSS and search JS; public asset bytes match origin exactly.
- Homepage, Time Card, Timesheet Template, Decimal Hours, Salary Increase, Work Hours, Overtime, Clock Out, Military Time, Time Duration, Hourly Wage, PTO Accrual, Salary Bonus, Hours & Minutes, Billable Hours and Time Off Tracker strict remediation releases are deployed and VERIFIED live.
- All sixteen completed pages use existing canonical URLs; no new canonical URL was introduced.
- Sitemap remains 34 canonical URLs.
- No indexing request should be represented as completed unless a write-capable Search Console action is actually executed and verified.

## Blockers / unknowns

- GitHub Actions: BLOCKED / infrastructure failure. Time Off PR #108 run #106 and PR #107 run #104 failed with zero executable steps. Under the permanent contingency rule this is a CI-status blocker, not by itself a work/deployment blocker; ZT/direct evidence is required for production-bound changes.
- The ZT workspace is partial; full-site results from it must not be treated as a complete repository mirror.
- Standard Lighthouse-container outbound DNS/networking is restricted, but true public Chromium/Lighthouse can be run with an ephemeral host-network container; this method was VERIFIED for the homepage and the shared-header release.
- Immediate public Lighthouse scores after the header release were high-variance, so short-run public lab scores are not treated as causal evidence; deterministic isolated A/B performance passed. Fresh field CWV impact remains UNKNOWN until real field data is available.
- Search Console's previously observed submitted sitemap count lagged the 34-URL live sitemap; the live sitemap itself had no errors/warnings in the last verified data.

## Technical debt

- Previous deployment-sync conclusions derived from `/opt/hostedtimesheets/site` are superseded. Verify and deploy against the true active root `/home/hostedtimesheets.com/public_html` only.
- Preserve rollback from the active root before merge and verify exact active-origin blobs after merge; do not infer deployment state from the stale `/opt/hostedtimesheets/site` tree.
- Do not prefetch a new immutable/versioned public asset URL before the active origin bytes are deployed; an early fetch can seed a stale CDN object. If contaminated, move to a fresh cache key only after origin verification.
- Repository-wide content-quality audit currently has 7 hard-rule failures on other queued/unremediated pages; Time Off, Billable Hours, Hours & Minutes, Salary Bonus and PTO Accrual pass their exact page audits. Resolve the remaining failures one page at a time under the existing queue rule.
- Restore GitHub Actions as the normal primary CI runner when quota/capacity returns; keep ZT MCP as the permanent contingency path for future GitHub-side infrastructure failures.
- Correct private-repo authentication/bootstrap if the ZT workspace is expected to become a full authoritative checkout.
- Continue page-specific remediation only; do not batch unrelated calculator/content changes.

## In progress

### Payroll Hours Calculator `/payroll-hours-calculator/` — PARTIALLY VERIFIED / RELEASE BLOCKED

Queue item #1 is now in implementation on PR #110, branch `remediate-payroll-hours-20261008`.

Research / ownership verified 2026-10-08:
- Ubersuggest U.S. `payroll hours calculator`: 9,900 monthly searches, $6.90 CPC, SD 50.
- Ubersuggest U.S. `calculate payroll hours`: 14,800 monthly searches, $4.115 CPC, SD 23.
- Ubersuggest U.S. `payroll calculator hours`: 8,100 monthly searches, $4.445 CPC, SD 19.
- Ubersuggest U.S. `free payroll hours calculator`: 880 monthly searches, $4.50 CPC, SD 9.
- Current SERP includes AI Overview/PAA and mixes work-hours/time-card calculators with payroll-hour conversion/pay estimators.
- Canonical boundary retained: Payroll Hours owns already-verified daily durations -> decimal payroll hours and optional arithmetic-only pay/overtime scenarios. Clock-in/out, breaks and cross-midnight shift logic remain on Work Hours; dedicated overtime logic remains on Overtime; timesheet-derived pay remains on Timesheet Pay.

Implementation currently on PR #110:
- Replaced silent negative/malformed coercion and >59-minute clamping with explicit validation.
- Blank daily hour/minute cells are valid zero; nonblank hours must be whole >=0 and minutes whole 0-59.
- Hourly rate is genuinely optional.
- Overtime threshold/multiplier are optional as a pair; no default overtime rule is implied.
- Currency changes formatting only; no FX conversion.
- Added copy summary and CSV export while retaining print.
- Added exact-minute aggregation explanation, worked example, payroll-rounding boundary, 8 visible/schema-matched FAQs and current semantic coverage.
- Versioned runtime key prepared as `/assets/js/payroll-hours.js?v=20261008-remediation1`; do not prefetch it before origin deployment.

Exact branch static evidence:
- HTML blob: `e3d1315243da42968d0e7d5cddffa8cdb35dfc58`.
- JS blob: `bb2d4927227efbf1c26c0f9d1795c7deeda8e958`.
- Production JS syntax: PASS.
- Static HTML/schema checks: PASS; one H1, self-canonical, dateModified 2026-10-08, 8 visible FAQs exactly matching FAQ schema.
- Page-content metrics from the repository audit logic: 819 main-content words, 15 H2/H3 headings, 12.8-word average sentence, 48-word max paragraph, passive heuristic 1.2/1,000, 8 FAQs, Quick Answer present, methodology present, 5 example references. These page-level metrics satisfy the measurable hard rules.
- Manual research/editorial/information-gain review: PASS at implementation stage.

Release blockers:
- GitHub Actions PR #110 Content Quality run #108 / run id `37733603152`: FAILED with job `content-quality` but **0 executable steps**. This is recorded as GitHub Actions infrastructure BLOCKED, not a quality PASS or a test failure.
- The previously documented ZT live server `c59425e31c304e608dac60224a064dbd` is connected but currently advertises no developer capabilities.
- Developer-capable server `5176cd0cb3ef4d4fa2bcebad5831ea1c` has only workspace `zetopanel`; no HostedTimesheets workspace is registered.
- Therefore the exact-source Chromium calculation/UI matrix has not executed and the alternate release gate cannot currently be established.
- No merge, production write, CDN prefetch, indexing request or completion claim has been made.

## NEXT ACTION

Keep queue item #1 active. Restore an executable exact-source validation path for PR #110 (GitHub Actions with real steps, or an isolated HostedTimesheets ZT workspace/runner). Run the dedicated Payroll Hours HTML/browser tests plus page-content audit against the exact PR head. Only if every applicable gate passes: preserve rollback from the true active root `/home/hostedtimesheets.com/public_html`, merge PR #110, verify merged-main blobs, deploy exact tested files if origin differs, verify public/CDN runtime and mobile/desktop behavior, update PROJECT_STATE/DECISIONS to VERIFIED, then report completion. Do not start queue item #2 before that.
