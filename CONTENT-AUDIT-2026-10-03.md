# HostedTimesheets Content Re-Audit — 2026-10-03

Scope: all 32 public HTML pages.

This audit applies the mandatory rules in CONTENT-STANDARDS.md and separates measurable repository checks from editorial/search-quality checks that require current research and human judgment.

## Sitewide measurable baseline

- Pages audited: 32
- Pages passing the calibrated measurable hard gate: 32
- Pages failing the calibrated measurable hard gate: 0
- Paragraphs over the 90-word hard maximum: 0
- Pull request validation: Content Quality run #3 — PASS
- Remediation PR: #20

Passing this baseline does not by itself complete the editorial/search-quality review. Search-targeted pages still require current SERP/competitor review, semantic-intent review, native-English editorial review, factual verification, and rendered-page proofreading.

## Remediation completed

The 12 pages that previously failed the measurable gate were corrected without changing calculator logic or the site's low-difficulty semantic SEO strategy.

- /biweekly-timesheet-calculator/ — explicit methodology framing
- /decimal-hours-calculator/ — expanded visible FAQ depth
- /how-to-calculate-pto-accrual/ — Quick Answer + expanded FAQ depth
- /how-to-calculate-time-card/ — explicit methodology framing
- /minutes-to-decimal-hours/ — Quick Answer
- /payroll-hours-calculator/ — active-voice rewrite + explicit methodology framing
- /pto-accrual-based-on-hours-worked/ — Quick Answer + expanded FAQ depth
- /time-card-calculator/ — active-voice rewrite
- /time-card-hours-with-lunch-break/ — expanded visible FAQ depth
- /time-off-tracker/ — explicit methodology framing
- /timesheet-pay-calculator/ — explicit methodology framing
- /timesheet-template/ — Quick Answer + methodology + visible FAQ structure + two worked examples

## Competitive benchmark findings

Current competitor review shows that strong calculator pages commonly combine:

- an immediate answer or formula;
- detailed settings/use instructions;
- reproducible examples;
- edge cases and assumptions;
- clear methodology;
- FAQ coverage;
- authoritative sources for policy-sensitive topics;
- visible freshness/review information when warranted;
- strong tool UX rather than SEO copy before the calculator.

Examples observed in the current search landscape include CalculatorSoup for work-hours/time calculations, Omni Calculator for overtime, Capstan and PTOAccrual.com for PTO, and specialist pay-raise calculators for salary-increase intent.

HostedTimesheets should not copy competitor wording, structure, claims, or examples. The standard is to provide better clarity, a more direct path to the answer, and defensible information gain for the exact intent each page serves.

## Hard editorial rule

Every public page must use natural, professional native English.

For search-targeted calculators and guides, publication approval requires:

- semantic-intent coverage;
- current competitor review;
- information gain;
- clear answer-first structure;
- skimmable headings and paragraphs;
- native-English grammar and punctuation;
- predominantly active voice;
- reproducible methodology and examples;
- factual and source verification;
- mobile/rendered proofreading.

Technical SEO or an automated content score alone cannot mark a page complete.

## Repository enforcement

The repository now enforces measurable rules through:

- CONTENT-STANDARDS.md
- scripts/content_quality_audit.py
- .github/workflows/content-quality.yml

The automated gate checks structural and readability rules. Semantic superiority, competitor information gain, grammar nuance, native-English quality, factual accuracy, and rendered UX remain mandatory editorial review items because a static score cannot reliably prove them.


## Manual page review progress

### Scoring rubric

Search-targeted pages are scored out of 100 using evidence from the current page, current Ubersuggest data, the current SERP/competitor set, calculator/source verification, and schema/internal-link review.

- Search intent + semantic coverage: 20
- Competitor information gain: 20
- Skimmability + readability: 15
- Native-English grammar, punctuation + active voice: 15
- Methodology, math + authoritative sourcing: 15
- SEO, schema, internal links + trust/privacy: 15

A numeric score is not a substitute for the status label. A page remains PARTIALLY VERIFIED until applicable CI, production HTTP/rendering and live consistency checks pass.

### /timesheet-calculator-with-lunch/ — repository review

Status: PARTIALLY VERIFIED  
Repository content score after remediation: **97/100**

U.S. keyword evidence captured 2026-10-03 from Ubersuggest:

- `timesheet calculator with lunch`: volume 2,900/month; CPC $8.58; SD 50; informational intent.
- `timesheet calculator with lunch break`: volume 2,900/month; CPC $3.51; SD 48.
- Current Ubersuggest SERP data includes both high-authority brands and lower-authority ranking domains, including DA 19 and DA 13 results, so the query is competitive but not authority-exclusive.

Competitive review included CalculateHours, Redcort, Harvest, Time Clock Wizard, CalculatorSoup, TimeCardCalculatorGeek, Turnozo and newer specialist calculators surfaced in current web search.

Score:

- Search intent + semantic coverage: 20/20
- Competitor information gain: 18/20
- Skimmability + readability: 14/15
- Native-English grammar, punctuation + active voice: 15/15
- Methodology, math + authoritative sourcing: 15/15
- SEO, schema, internal links + trust/privacy: 15/15

Verified strengths:

- Calculator appears before explanatory SEO content.
- One clear weekly lunch-break timesheet intent with natural time-card/work-hours variants.
- Per-day lunch deductions, overnight shifts, configurable overtime inputs, per-day rounding, multiple currencies, print/CSV and browser-local calculation disclosure.
- Reproducible 30-minute, 60-minute and overnight examples agree with calculator logic.
- U.S. Department of Labor Fact Sheet #22 is an appropriate primary reference for the limited U.S. meal/rest-period statement.
- Contextual links separate split-shift use cases into the Weekly Timesheet Calculator rather than overloading this page.

Remediation in branch `content/re-audit-timesheet-lunch-20261003`:

- Aligned all visible FAQ answers exactly with FAQPage schema text.
- Documented rounding order.
- Documented same-start/end behavior and the zero floor when break minutes exceed elapsed shift.
- Calculator JavaScript was not changed.

Remaining before VERIFIED:

- Content Quality CI: PASS — run #19 after an initial passive-voice regression was caught and corrected.
- Merge/deployment: PASS — PR #27 merged at 989c0bca676f6ba5132503b624531a6c3ad8f1c2 and the flagship page was deployed with a stale-source guard plus a rollback copy.
- Live HTTP/canonical/schema check: PASS — public HTTPS returned 200 and the served title, canonical, dateModified, FAQ schema/visible answers and rounding text matched the intended page. Cloudflare/Rocket Loader rewrites script tags at the edge, so response bytes differ from the origin file without changing the verified content fields.
- Desktop/mobile rendered-page proofread: BLOCKED — the available Chromium/Playwright runtime returned ERR_BLOCKED_BY_ADMINISTRATOR for the live domain. Do not treat this as a visual pass.


### /weekly-timesheet-calculator/ — repository review

Status: PARTIALLY VERIFIED  
Repository content score after remediation: **96/100**

U.S. keyword evidence captured 2026-10-03 from Ubersuggest:

- `weekly timesheet calculator`: volume 260/month; CPC $2.42; SD 48; informational intent.
- `free weekly timesheet calculator`: volume 10/month; SD 12.
- `weekly timesheet calculator with lunch`: volume 10/month; SD 5.
- The current Ubersuggest SERP is dominated by broader time-card/work-hours calculators, with domain authority ranging from 19 to 74 among visible organic results. This supports keeping the page focused on the distinct weekly/split-shift intent instead of cannibalizing the generic Time Card Calculator or Work Hours Calculator intents.

Competitor evidence reviewed:

- Redcort ranks prominently and Ubersuggest reports page authority 47, 5,383 backlinks and 524 referring domains for its free timecard calculator.
- TimeCardCalculator.net has page authority 45, 8,330 backlinks and 695 referring domains.
- Hivedesk's timesheet calculator has page authority 25 with no backlinks/referring domains reported by the current Ubersuggest page overview, showing that lower-link pages can still enter the result set when intent/utility are relevant.
- Current web competitors commonly offer breaks, weekly overtime/pay, decimal totals, CSV/print, device saving, copy/share, biweekly toggles or daily-overtime modes. HostedTimesheets differentiates this URL with two shift intervals per day, explicit double-deduction guidance, overnight handling, browser-local calculation, weekly overtime inputs and traceable export guidance.

Score:

- Search intent + semantic coverage: 19/20
- Competitor information gain: 18/20
- Skimmability + readability: 15/15
- Native-English grammar, punctuation + active voice: 15/15
- Methodology, math + authoritative-boundary handling: 15/15
- SEO, schema, internal links + trust/privacy: 14/15

Verified strengths:

- Calculator appears before explanatory content and the H1 cleanly owns the weekly timesheet intent.
- Split shifts are modeled as two independent in/out pairs, which is a useful distinction from the simpler lunch-break calculator.
- FAQPage questions/answers match the visible FAQ text exactly.
- Reproducible examples agree with `assets/js/weekly-timesheet.js`: two 4-hour split shifts produce 8 hours; a 10:30 PM–6:30 AM shift produces 8 hours; 41.5 weekly hours with a 40-hour threshold produces 40 regular and 1.5 overtime hours.
- The calculator floors negative net daily minutes at zero and rounds each day's net minutes to the nearest selected increment before summing the week.
- Overtime/pay wording keeps the tool inside its arithmetic boundary and does not decide legal eligibility or required payroll rules.

Remediation in branch `content/re-audit-weekly-timesheet-20261003`:

- Documented the actual rounding order and same-start/end edge case.
- Added the explicit gross-pay formula.
- Reworded split-shift guidance so the calculator describes arithmetic behavior instead of deciding whether gap time legally counts as work.
- Clarified that the editable 40-hour default does not determine a legal threshold.
- Calculator JavaScript was not changed.

Release evidence:

- Content Quality CI: PASS — run #23.
- Merge: PASS — PR #29 merged at c3622544baecd8409e82bdb8825a84d6ec38ea92.
- Controlled production deployment: PASS — origin page updated with stale-source guard and rollback copy `/opt/hostedtimesheets/archive/weekly-timesheet-pre-c362254-20261003.html`.
- Origin/GitHub parity: PASS — production page exactly matches the merged GitHub page (22,248 characters).
- Public HTTPS: PASS — HTTP 200; served title, canonical, dateModified, rounding text, gross-pay formula and fourth FAQ schema/visible content all match.
- Cloudflare/Rocket Loader rewrites script tags at the edge, so public-response SHA differs from the origin file without changing the verified content fields.
- Rendered desktop/mobile proofread: BLOCKED — available browser runtime blocks the live domain with ERR_BLOCKED_BY_ADMINISTRATOR.

Status remains PARTIALLY VERIFIED because rendered visual QA is blocked; do not treat the page as fully VERIFIED yet.


### /biweekly-timesheet-calculator/ — repository review

Status: PARTIALLY VERIFIED  
Repository content score after remediation: **96/100**

U.S. keyword evidence captured 2026-10-03 from Ubersuggest:

- `biweekly timesheet calculator`: volume 1,300/month; CPC $6.31; SD 33; informational intent.
- `free bi weekly timesheet calculator`: volume 140/month; SD 8.
- `biweekly timesheet calculator with lunch`: volume 50/month; SD 29.
- `biweekly timesheet calculator with breaks`: volume 10/month; SD 5.
- The current SERP contains very low-authority ranking domains: Ubersuggest reports DA 5 at position 1, DA 2 at position 4 and DA 1 at position 6 for the primary query.

Current competitor evidence:

- SlickCalc ranks at position 1 in the current Ubersuggest SERP; its page overview reports page authority 12 with 0 backlinks/referring domains in the current dataset.
- BestTimeCard's biweekly page appears at position 4; Ubersuggest reports page authority 6 and 0 backlinks/referring domains.
- Current web review shows competitors commonly add week-start controls, multiple export formats, autosave/share links, double-time/state presets or spreadsheet downloads.
- HostedTimesheets does not currently match every export/preset feature. Its defensible information gain is the simpler two-week workflow, per-day lunch fields, explicit per-week threshold math, overnight handling, exact rounding-order disclosure, privacy/no-signup positioning and scoped primary-source federal reference.

Score:

- Search intent + semantic coverage: 20/20
- Competitor information gain: 17/20
- Skimmability + readability: 15/15
- Native-English grammar, punctuation + active voice: 15/15
- Methodology, math + authoritative sourcing: 15/15
- SEO, schema, internal links + trust/privacy: 14/15

Verified strengths:

- One canonical URL clearly owns the two-week/biweekly timesheet intent without replacing the weekly calculator intent.
- The page handles 14 daily rows, per-day unpaid breaks, overnight shifts, per-day rounding, per-week overtime threshold arithmetic and a combined pay-period total.
- FAQPage questions and answers match the visible FAQ text.
- The implementation applies the chosen threshold separately to Week 1 and Week 2; 42 + 38 hours at a 40-hour threshold produces 80 total hours and 2 overtime hours.
- `assets/js/biweekly-timesheet.js` floors negative daily net minutes at zero, rounds each day's net minutes to the nearest selected increment, and treats identical start/end times as zero.
- U.S. federal wording is now scoped to covered, nonexempt employees and cites U.S. Department of Labor Fact Sheet #23 plus the DOL overtime page. The calculator still does not decide coverage, exemptions, state rules or the applicable threshold.

Remediation in branch `content/re-audit-biweekly-timesheet-20261003`:

- Added `Free` to the title/social/WebPage name while preserving the primary biweekly intent.
- Replaced vague overtime wording with calculator-specific arithmetic behavior.
- Documented actual rounding order, overnight handling, zero-floor behavior and identical-time behavior.
- Added the gross-pay formula.
- Added current authoritative DOL sourcing for the limited U.S. federal workweek/averaging statement.
- Rewrote the rounding section to match the implemented daily rounding order.
- Calculator JavaScript was not changed.

Release evidence:

- Content Quality CI: PASS — run #25.
- Merge: PASS — PR #31 merged at e0f20fd4dcabfd97cb5daac1aa33031756a4e6ae.
- Controlled production deployment: PASS — stale-source guard used and rollback copy preserved at `/opt/hostedtimesheets/archive/biweekly-timesheet-pre-e0f20fd-20261003.html`.
- Origin/GitHub parity: PASS — production HTML exactly matches the merged GitHub page (23,358 characters).
- Public HTTPS: PASS — HTTP 200; served title, canonical, dateModified, rounding methodology, gross-pay formula and DOL references are present.
- Cloudflare/Rocket Loader changes public-response bytes, so public SHA differs from origin while verified content fields remain correct.
- Rendered desktop/mobile proofread: BLOCKED — available browser runtime blocks the live domain with ERR_BLOCKED_BY_ADMINISTRATOR.

Status remains PARTIALLY VERIFIED because rendered visual QA is blocked; do not treat the page as fully VERIFIED yet.


### /work-hours-calculator/ — repository review

Status: PARTIALLY VERIFIED  
Repository content score after remediation: **96/100**

U.S. keyword evidence captured 2026-10-03 from Ubersuggest:

- `work hours calculator`: volume 135,000/month; CPC $2.89; SD 49.
- `free work hours calculator`: volume 4,400/month; CPC $3.14; SD 7.
- `work hours calculator with lunch`: volume 1,600/month; CPC $2.13; SD 38.
- `work hours calculator excel`: volume 140/month; CPC $9.42; SD 28.
- The exact low-SD phrase is promising, but the current SERP is not uniformly low-authority: Redcort, CalculatorSoup and other established domains are present, alongside DA-19 competitors. Treat this as a strong long-tail entry point, not a guaranteed easy ranking.

Current competitor review:

- CalculatorSoup exposes 12/24-hour input, multiple break-entry modes and rounding controls.
- Jibble exposes quick presets, 12/24-hour modes, overtime, clear/reset, sharing/export and repeated working days.
- Current smaller competitors emphasize exact hours:minutes, decimal hours, overnight shifts, privacy/no-signup and copy/print/reset controls.
- HostedTimesheets intentionally keeps this URL simpler: one repeated shift pattern, one unpaid-break duration, total minutes, decimal hours and an optional one-rate gross-pay estimate. Variable daily schedules remain owned by the Time Card / Weekly Timesheet URLs.

Score:

- Search intent + semantic coverage: 20/20
- Competitor information gain: 17/20
- Skimmability + readability: 15/15
- Native-English grammar, punctuation + active voice: 15/15
- Methodology + calculation accuracy: 15/15
- SEO, schema, internal links + trust/privacy: 14/15

Verified strengths:

- Title, H1, lead and FAQ naturally cover the exact `free work hours calculator` intent without changing canonical ownership.
- The calculator clearly differentiates itself from the weekly/time-card pages by repeating one identical shift across a chosen number of workdays.
- `assets/js/work-hours.js` uses exact entered minutes with no rounding, handles overnight shifts by rolling the end into the next day, subtracts unpaid breaks, floors negative net duration at zero, multiplies by repeated workdays and calculates one-rate gross pay.
- The page already includes reproducible examples, decimal-hours education, overnight handling, pay limitations and internal links to the appropriate variable-schedule/overtime tools.
- FAQPage schema matches the visible FAQ text.

Remediation in branch `content/re-audit-work-hours-20261003`:

- Documented that the calculator applies no time-clock rounding.
- Documented same-start/end = zero and break-longer-than-shift = zero behavior.
- Added the explicit gross-pay formula.
- Clarified that the pay estimate uses one hourly rate across the repeated schedule.
- Explained how Total minutes relates to the decimal-hours output.
- Updated the legitimate page modification date to 2026-10-03.
- Calculator JavaScript was not changed.

Release evidence:

- Content Quality CI: PASS — run #27.
- Merge: PASS — PR #33 merged at edd62236e79d4e075a44d8087700546051921d58.
- Controlled production deployment: PASS — stale-source guard used and rollback copy preserved at `/opt/hostedtimesheets/archive/work-hours-pre-edd6223-20261003.html`.
- Origin/GitHub parity: PASS — production HTML exactly matches the merged GitHub page (19,294 characters).
- Public HTTPS: PASS — HTTP 200; served title, canonical, dateModified, no-rounding methodology, zero-floor behavior, gross-pay formula and Total-minutes explanation are present.
- Cloudflare/Rocket Loader changes public-response bytes, so public SHA differs from origin while verified content fields remain correct.
- Rendered desktop/mobile proofread: BLOCKED — available browser runtime blocks the live domain with ERR_BLOCKED_BY_ADMINISTRATOR.

Status remains PARTIALLY VERIFIED because rendered visual QA is blocked; do not treat the page as fully VERIFIED yet.


### /salary-increase-calculator/ — repository review

Status: PARTIALLY VERIFIED  
Repository content score after remediation: **97/100**

U.S. keyword evidence captured 2026-10-03 from Ubersuggest:

- `salary increase calculator`: volume 33,100/month; CPC $13.90; SD 16; informational intent.
- `salary increase calculator percentage`: volume 4,400/month; SD 48.
- `percent salary increase calculator`: volume 3,600/month; CPC $5.70; SD 19.
- `percentage salary increase calculator`: volume 2,900/month; CPC $5.63; SD 6.
- `annual salary increase calculator`: volume 590/month; SD 17.
- Current SERP includes multiple low-authority domains: Ubersuggest reports DA 5, DA 6, DA 10, DA 6, DA 2 and DA 1 pages among visible organic results for the primary query.

Current competitor evidence:

- SlickCalc's raise page: page authority 12, 0 backlinks/referring domains in the current Ubersuggest overview.
- HourlyToAnnual raise-impact page: page authority 14, 0 backlinks/referring domains.
- CoinCalc annual salary increase page: page authority 16, 0 backlinks/referring domains.
- NorthStarNumbers pay-raise page: page authority 11, 0 backlinks/referring domains.
- Current web competitors commonly support percentage raises, fixed-dollar raises, old→new comparisons, per-paycheck/monthly/hourly conversions, and in some cases after-tax or inflation modes.
- HostedTimesheets stays deliberately gross-pay only and avoids jurisdiction-specific tax assumptions. It supports percentage mode, direct old-vs-new comparison, adjustable hours/week and weeks/year, monthly/biweekly/weekly impacts, hourly equivalents, common raise examples and a clear fixed-dollar workaround through compare mode.

Score:

- Search intent + semantic coverage: 20/20
- Competitor information gain: 18/20
- Skimmability + readability: 15/15
- Native-English grammar, punctuation + active voice: 15/15
- Methodology + calculation accuracy: 15/15
- SEO, schema, internal links + trust/privacy: 14/15

Accuracy finding and remediation:

- FOUND: compare mode previously returned `0.00%` when current salary was 0 and new salary was greater than 0.
- VERIFIED DEFECT: percentage change from a zero baseline has no finite denominator; returning 0% was mathematically wrong.
- FIXED in `assets/js/salary-increase.js`: zero→positive now displays `N/A` for percentage change while preserving the dollar change. Zero→zero remains 0%.
- Compare mode still correctly returns negative dollar/percentage changes when the new salary is lower than the current salary.
- Percentage mode remains non-negative by design because this page models a raise; compare mode covers decreases.

Boundary/example tests run against the corrected formula logic:

- $60,000 + 5% → $63,000; +$3,000; $250/month; $115.38 biweekly; $57.69/week: PASS.
- $50,000 + 10% → $55,000: PASS.
- $60,000 → $66,000 → +10%: PASS.
- $60,000 → $54,000 → -10%: PASS.
- $0 → $1,000 → percentage N/A with +$1,000 dollar change: PASS.
- $0 → $0 → 0%: PASS.
- JavaScript binary floating-point artifacts are formatted to currency precision in the UI; tolerance-based numeric assertions pass.

Content/methodology remediation in branch `content/re-audit-salary-increase-20261003`:

- Added the hourly-equivalent formula.
- Clarified that compare mode can represent salary decreases.
- Documented the zero-baseline percentage behavior.
- Clarified that monthly/biweekly/weekly changes use fixed 12/26/52 annual equivalents, while hourly equivalents use the editable hours/week and weeks/year inputs.
- Added a transparent fixed-dollar raise workflow using compare mode instead of pretending a dedicated fixed-raise UI exists.
- Calculator and content remain gross-pay arithmetic only; taxes, deductions, benefits, bonuses, inflation and cost-of-living adjustments are outside this URL's calculation scope.

Release evidence:

- Content Quality CI: first run #29 FAILED because one methodology paragraph reached 93 words; copy was split without weakening the hard gate.
- Content Quality CI: PASS — rerun #30 on the revised PR head.
- Merge: PASS — PR #35 merged at 4764f055de1fd86a63800af69a0c47d91482d2a3.
- Controlled production deployment: PASS — both HTML and JavaScript used stale-source guards and separate rollback copies:
  - `/opt/hostedtimesheets/archive/salary-increase-pre-4764f05-20261003.html`
  - `/opt/hostedtimesheets/archive/salary-increase-js-pre-4764f05-20261003.js`
- Origin/GitHub parity: PASS — production HTML exactly matches merged GitHub (22,118 characters); production JavaScript exactly matches merged GitHub (2,331 characters).
- Public HTTPS: PASS — calculator page HTTP 200; JavaScript asset HTTP 200.
- Served HTML contains the expected title, canonical, zero-baseline methodology, flat-dollar workflow, hourly-equivalent formula and added FAQ coverage.
- Served JavaScript contains the zero-baseline `N/A` fix and is byte-identical to the deployed/GitHub JavaScript.
- Live server `node --check`: BLOCKED because the production host does not expose a Node executable. The served JavaScript is byte-identical to the syntax-checked merged artifact, so no separate syntax divergence exists.
- Rendered desktop/mobile proofread: BLOCKED — available browser runtime blocks the live domain with ERR_BLOCKED_BY_ADMINISTRATOR.

Status remains PARTIALLY VERIFIED because rendered visual QA is blocked; do not treat the page as fully VERIFIED yet.


### /overtime-calculator/ — repository review

Status: PARTIALLY VERIFIED  
Repository content score after remediation: **97/100**

U.S. keyword evidence captured 2026-10-03 from Ubersuggest:

- `overtime calculator`: volume 22,200/month; CPC $5.83; SD 20; informational intent.
- `time and a half calculator`: volume 14,800/month; CPC $4.11; SD 20.
- `overtime pay calculator`: volume 4,400/month; CPC $4.73; SD 24.
- Current SERP includes both authoritative/high-DA domains and lower-authority specialist pages. Ubersuggest reports DA 21 at position 3, DA 4 at position 7, DA 3 at position 10 and DA 3 at position 16 for the primary query.

Current competitor evidence:

- Omni Calculator ranks first and provides overtime formulas, explanatory content and flexible regular/overtime inputs.
- Log My Hours ranks in the top three; Ubersuggest reports page authority 20 with 0 backlinks/referring domains in the current page overview.
- SmartOvertime ranks on the first page; Ubersuggest reports page authority 10 with 0 backlinks/referring domains and adds state/daily-overtime modes.
- OvertimeCalc also appears in the current SERP; Ubersuggest reports page authority 19, 16 backlinks and 15 referring domains.
- Search results in 2026 mix ordinary overtime-pay calculators with “no tax on overtime” / qualified-overtime tax-deduction calculators, creating a material intent-clarity gap.

Score:

- Search intent + semantic coverage: 20/20
- Competitor information gain: 18/20
- Skimmability + readability: 15/15
- Native-English grammar, punctuation + active voice: 15/15
- Methodology, calculation accuracy + authoritative sourcing: 15/15
- SEO, schema, internal links + trust/privacy: 14/15

Calculation verification against `assets/js/overtime-calculator.js`:

- 45 hours, $25 rate, 40-hour threshold, 1.5× → 40 regular hours, 5 overtime hours, $37.50 overtime rate, $1,000 regular pay, $187.50 overtime pay, $1,187.50 gross: PASS.
- 42.5 hours, $20 rate, 40-hour threshold, 1.5× → 40 regular, 2.5 overtime, $30 overtime rate, $875 gross: PASS.
- 40 hours at threshold → 0 overtime hours: PASS.
- 0 total hours → $0 gross and $0 effective hourly rate with no divide-by-zero display: PASS.
- Threshold 0 → all entered hours are classified as overtime by arithmetic: PASS.
- Multiplier 0 → overtime hours remain classified but overtime rate/pay become zero by arithmetic: PASS.
- Inputs are clamped at zero by JavaScript before calculation.

Verified strengths:

- The URL cleanly owns generic overtime-pay / time-and-a-half arithmetic rather than raw time-card entry.
- The calculator separates regular hours, overtime hours, overtime rate, regular pay, overtime pay, gross pay and effective hourly rate.
- The default 40-hour threshold and 1.5× multiplier are editable and are described as a common U.S. federal example rather than a universal rule.
- Visible FAQ answers match FAQPage schema.
- The page already distinguishes full overtime rate from the overtime premium, reducing a common double-counting error.
- DOL Fact Sheet #23 supports the limited federal workweek/time-and-a-half statements; DOL Fact Sheet #56A supports the regular-rate boundary.
- Current IRS Fact Sheet FS-2026-13 is used only to clarify that the qualified-overtime tax deduction is a separate tax calculation; the calculator does not determine tax eligibility or deduction amounts.

Remediation in branch `content/re-audit-overtime-20261003`:

- Added the complete regular-hours, regular-pay, overtime-pay, gross-pay and effective-hourly-rate formula chain.
- Documented the zero-hours effective-rate behavior.
- Clarified that the regular-rate input may require more than a stated base wage in FLSA cases and linked current DOL regular-rate guidance.
- Added a clear separation between gross overtime pay and the current federal qualified-overtime tax deduction.
- Added a visible + schema-matched FAQ clarifying that this page is not a “no tax on overtime” deduction calculator.
- Preserved the one-rate/configurable-threshold scope instead of pretending to model state daily overtime, multiple rates, bonuses or tax deductions.
- Calculator JavaScript was not changed.

Release evidence:

- Content Quality CI: PASS — run #32.
- Merge: PASS — PR #37 merged at 822b535a61500e6f2730147cac5463b9a376ed01.
- Controlled production deployment: PASS — current-origin SHA guard used, 22 positional edits applied, and rollback copy preserved at `/opt/hostedtimesheets/archive/overtime-pre-822b535-20261003.html`.
- Origin/GitHub parity: PASS — production HTML exactly matches the merged GitHub page (25,606 characters).
- Public HTTPS: PASS — HTTP 200; served title, canonical, dateModified, DOL regular-rate source, effective-rate formula, IRS tax-boundary content and schema/visible tax FAQ all match.
- Cloudflare/Rocket Loader changes public-response bytes, so public SHA differs from origin while verified content fields remain correct.
- Rendered desktop/mobile proofread: BLOCKED — available browser runtime blocks the live domain with ERR_BLOCKED_BY_ADMINISTRATOR.

Status remains PARTIALLY VERIFIED because rendered visual QA is blocked; do not treat the page as fully VERIFIED yet.


### /pto-accrual-calculator/ — repository review

Status: PARTIALLY VERIFIED  
Repository content score after remediation: **97/100**

U.S. keyword evidence captured 2026-10-03 from Ubersuggest:

- `pto accrual calculator`: volume 4,400/month; CPC $9.62; SD 12; informational intent.
- `free pto accrual calculator`: volume 110/month; CPC $5.65; SD 16.
- `pto accrual calculator based on hours worked`: volume 90/month; CPC $4.36; SD 12.
- `pto accrual calculator excel`: volume 40/month; SD 16.
- Current SERP includes both established HR/payroll brands and lower-authority specialist pages. Ubersuggest reports DA 3 at position 9 and DA 19 at position 13 for the primary query.

Current competitor evidence:

- VacationTracker, Paycor, PurelyHR and OnTheClock rank prominently and commonly support annual allowances, pay-period frequency, carryover/used-time inputs or HR-oriented explanations.
- PTOAccrualCalculator.com appears in the current SERP; Ubersuggest reports page authority 14 with 6 backlinks from 6 referring domains.
- BuddiesHR's PTO accrual page has page authority 21 with 1 backlink/referring domain in the current Ubersuggest overview.
- ShiftFlow ranks with a free PTO accrual calculator; Ubersuggest reports page authority 18 and 0 backlinks/referring domains.
- Several competitors add target-date ledgers, annual-frequency selectors, CSV/share links or payout/value tools. HostedTimesheets does not claim those features. Its distinct value is three explicit arithmetic modes (hours worked, pay period, fixed), current balance + carryover + usage + cap modeling, transparent formulas, no signup/browser-local calculation and strict policy/legal boundaries.

Score:

- Search intent + semantic coverage: 20/20
- Competitor information gain: 18/20
- Skimmability + readability: 15/15
- Native-English grammar, punctuation + active voice: 15/15
- Methodology + calculation accuracy: 15/15
- SEO, schema, internal links + trust/privacy: 14/15

Accuracy finding and remediation:

- FOUND: fixed-accrual mode calculated earned PTO from the correct `#pto-fixed` input but displayed the unrelated hourly accrual-rate value in the formula line.
- VERIFIED DEFECT: with fixed PTO set to 8 hours and the default hourly rate still at 0.05, the earned result was 8.00 while the formula line could say `0.05 PTO hours added`.
- FIXED in `assets/js/pto-accrual.js`: fixed mode now stores the fixed input explicitly and displays that same fixed amount in the formula line.
- No entitlement, eligibility, carryover or cap policy logic was added.

Calculation/edge tests against the corrected logic:

- Hours method: 160 × 0.05 → 8.00 earned; projected 8.00: PASS.
- Pay-period method: 2 periods × 4.50 → 9.00 earned; projected 9.00: PASS.
- Fixed method: 8 fixed PTO hours → 8.00 earned and formula `8.00 PTO hours added`: PASS.
- Example: 24 current + 16 carryover + 8 earned − 8 used → 40 projected under a 120 cap: PASS.
- Cap: 100 current + 10 carryover + 20 earned → 130 before cap; 120 displayed with a 120 cap: PASS.
- Negative balance: 0 current + 0 carryover + 8 earned − 10 used → -2 projected: PASS. The calculator does not decide whether negative PTO is permitted.
- Decimal accrual: 160 × 0.03846 → 6.1536 internally and 6.15 displayed: PASS.
- Inputs are clamped at zero before arithmetic; the projected balance itself is not floored at zero.

Verified strengths:

- One canonical URL owns the general PTO/vacation/time-off accrual intent, while the hours-worked-specific calculator remains a distinct supporting URL.
- The tool supports hourly, per-pay-period and fixed accrual methods without pretending they are interchangeable policy rules.
- Projected balance order matches implementation: current balance + carryover + earned − used, then a positive cap limits the final projection.
- FAQPage schema matches visible FAQ text, including the newly documented negative-balance behavior.
- The page derives hourly and biweekly rates as conditional arithmetic examples rather than prescribing a policy.
- Current U.S. DOL vacation guidance is used only to support the narrow federal statement that the FLSA does not generally require vacation/PTO payment; the page explicitly notes that policy and jurisdiction can differ.

Remediation in branch `content/re-audit-pto-accrual-20261003`:

- Fixed the fixed-accrual formula-display defect in JavaScript.
- Added the fixed-accrual formula to the methodology.
- Documented that the calculator uses entered numeric values without an internal policy-rounding rule and formats displayed PTO balances to two decimals.
- Documented cap application order and clarified that the tool limits the final displayed projection rather than modeling “stop accrual at cap” policy logic.
- Documented negative projected balances and added a schema-matched FAQ explaining that policy permission is a separate question.
- Calculator remains arithmetic-only and does not determine eligibility, accrual rates, carryover, forfeiture, payout or jurisdiction-specific entitlement.

Release evidence:

- Content Quality CI: PASS — run #34.
- Merge: PASS — PR #39 merged at 5ab40c66c91954700921fcefb768d3dc59e851a9.
- Controlled production deployment: PASS — HTML and JavaScript were guarded by their current-origin SHA values and deployed in one transaction with rollback copies:
  - `/opt/hostedtimesheets/archive/pto-accrual-pre-5ab40c6-20261003.html`
  - `/opt/hostedtimesheets/archive/pto-accrual-js-pre-5ab40c6-20261003.js`
- Origin/GitHub parity: PASS — production HTML exactly matches merged GitHub (24,165 characters); production JavaScript exactly matches merged GitHub (2,074 characters).
- Public HTTPS: PASS — calculator page HTTP 200; JavaScript asset HTTP 200.
- Served HTML contains the expected title, canonical, dateModified, fixed-accrual methodology, rounding explanation and schema/visible negative-balance FAQ.
- Served JavaScript contains the fixed-mode formula-display correction and is byte-identical to the deployed/GitHub JavaScript.
- Rendered desktop/mobile proofread: BLOCKED — available browser runtime blocks the live domain with ERR_BLOCKED_BY_ADMINISTRATOR.

Status remains PARTIALLY VERIFIED because rendered visual QA is blocked; do not treat the page as fully VERIFIED yet.

Follow-up verification after the initial release:

- FOUND: the pay-period arithmetic accepted a decimal numeric input such as 1.5 periods, but the formula line used `toFixed(0)` and could display `2 pay periods` while calculating 1.5 × the per-period amount.
- FIXED: the formula display now preserves whole-number periods as integers and shows decimal period inputs to two decimal places. Example: 1.5 periods × 4.50 now displays `1.50 pay periods × 4.50 = 6.75 PTO hours earned`.
- FOUND: three FAQ schema answers were not byte-for-byte equal to their visible FAQ answers (possessive punctuation and “divided by” versus `÷` wording).
- FIXED: all 7 FAQ question/answer pairs now match exactly between visible HTML and FAQPage schema.
- Validation: JavaScript syntax check PASS; decimal pay-period display test PASS; schema/visible FAQ parity 7/7 PASS.
- These follow-up fixes do not change PTO entitlement, accrual policy, cap logic, or earned/balance arithmetic.

Follow-up release evidence:

- Content Quality CI: PASS — hotfix run #36.
- Merge: PASS — PR #41 merged at `2de2e22b738be027e4b47f20abcebec25fa1d7c9`.
- Controlled production deployment: PASS — HTML + JavaScript used stale-source guards and separate rollback copies.
- Origin/GitHub parity after the hotfix: PASS — HTML and JavaScript exactly matched commit `2de2e22…`.
- Public verification exposed a stale edge-cached unversioned JavaScript response, so the corrected origin JS was not yet guaranteed to reach users.
- Cache-delivery fix: PR #43 changed the PTO page script source to `/assets/js/pto-accrual.js?v=2de2e22`; Content Quality run #38 PASS; merged at `4d1cc063e9d31de8ce1f10cbfff668c26e01970a`.
- Guarded HTML deployment for the cache-bust: PASS with rollback copy `/opt/hostedtimesheets/archive/pto-accrual-pre-4d1cc06-cache-20261003.html`.
- Final origin/GitHub parity: PASS — production HTML exactly matches `4d1cc063…` (24,168 characters).
- Final public verification: PASS — calculator page HTTP 200 and served HTML references `/assets/js/pto-accrual.js?v=2de2e22`; the versioned asset returned HTTP 200, SHA `d2c06af8…`, and contains the decimal pay-period formula fix.
- The unversioned edge URL may remain stale until cache expiry, but the production page no longer references it.




### /hourly-wage-calculator/ — repository review

Status: PARTIALLY VERIFIED  
Repository content score after remediation: **95/100**

U.S. keyword evidence captured 2026-10-03 from Ubersuggest:

- `hourly wage calculator`: volume 18,100/month; CPC about $1.94; SD 19.
- `hourly pay calculator`: volume 8,100/month; CPC about $2.23; SD 16.
- `hourly to salary calculator`: volume 49,500/month; CPC $1.13; SD 56.
- `hourly to annual salary calculator`: volume 3,600/month; CPC $0.88; SD 54.
- The low-difficulty headline metrics do not mean the SERP is easy: the current `hourly wage calculator` result set is dominated by high-authority paycheck/tax and salary-conversion domains, with ADP, Calculator.net, Omni, SmartAsset, Indeed and Gusto near the top. A DA 14 tax-calculator domain also appears, but its page itself has substantial link equity.

Intent/cannibalization finding:

- The current `hourly wage calculator` SERP mixes gross hourly-to-salary conversion with paycheck/take-home-tax intent.
- This URL remains scoped to gross hourly-wage conversion and optional overtime. It does not add tax withholding logic merely to chase the mixed SERP.
- `/salary-to-hourly-calculator/` owns the reverse annual-salary-to-hourly intent.
- `/overtime-calculator/` owns focused overtime classification/pay math.
- `/biweekly-pay-calculator/` owns pay-period conversion rather than the full hourly-to-annual schedule model.

Current competitor evidence:

- MoreBusiness's wage-conversion page has page authority 45, 1,019 backlinks and 134 referring domains in the current Ubersuggest overview.
- CalcXML's hourly-to-salary page has page authority 49, 1,589 backlinks and 262 referring domains.
- Current web competitors such as AbraCalc, OfficeCalculator, WorkweekMath and other conversion tools commonly expose regular hours, overtime hours, weeks worked, pay-period equivalents and gross-pay formulas.
- Tax/paycheck competitors add withholding, filing status and take-home calculations. HostedTimesheets intentionally does not imitate that different intent; its information gain is transparent gross math, adjustable paid weeks/days, separated regular/overtime outputs, multiple currencies and browser-local/no-signup use.

Score:

- Search intent + semantic coverage: 19/20
- Competitor information gain: 17/20
- Skimmability + readability: 15/15
- Native-English grammar, punctuation + active voice: 15/15
- Methodology + calculation accuracy: 15/15
- SEO, schema, internal links + trust/privacy: 14/15

Calculation verification against corrected `assets/js/hourly-wage.js`:

- $25/hour × 40 regular hours × 52 weeks → $1,000 weekly, $2,000 biweekly, $4,333.33 average monthly regular pay and $52,000 annual regular pay: PASS.
- Example: $22.50/hour, 40 regular hours, 52 weeks, 5 overtime hours/week at 1.5× → $900 regular weekly pay, $168.75 weekly overtime pay, $1,068.75 weekly including OT and $55,575 annual including OT: PASS.
- Part-time example: $25 × 32 hours × 50 weeks → $40,000 annual regular pay: PASS.
- $0 hourly rate → all pay outputs $0: PASS.
- Invalid 100 weeks/year is clamped to the visible maximum 53; invalid 10 workdays/week is clamped to 7: PASS after remediation.
- Overtime multiplier values below 1 are clamped to 1; other negative numeric inputs are clamped at zero.

Accuracy/UX findings and remediation:

- FOUND: HTML declared maximums of 53 weeks/year and 7 days/week, but JavaScript previously enforced only the minimum values. A manually entered out-of-range value could still drive arithmetic beyond the visible input limits.
- FIXED: JavaScript now clamps weeks to 1–53 and workdays to 1–7, matching the UI.
- CLARIFIED: the hours-per-week input represents regular hours; overtime hours are additional and must not also be included in regular hours.
- CLARIFIED: the monthly metric is monthly regular pay, not monthly pay including overtime.
- Added explicit weekly-overtime and annual-including-overtime formulas.
- Added a schema-matched FAQ explaining how to avoid double-counting overtime.
- Explicitly distinguishes this gross-pay conversion page from paycheck/take-home-tax calculators that appear in the current mixed SERP.

Release evidence:

- Content Quality CI: PASS — run #40.
- Merge: PASS — PR #45 merged at `de976055a430e4b9aa01fb2d1883d7f328ba009a`.
- Controlled production deployment: PASS — current-origin SHA guards used for both HTML and JavaScript; rollback copies preserved at `/opt/hostedtimesheets/archive/hourly-wage-pre-de97605-20261003.html` and `/opt/hostedtimesheets/archive/hourly-wage-js-pre-de97605-20261003.js`.
- Origin/GitHub parity: PASS — production HTML exactly matches merged GitHub (20,473 characters); production JavaScript exactly matches merged GitHub (1,811 characters).
- Public HTTPS: PASS — calculator page HTTP 200; JavaScript asset HTTP 200.
- Public JavaScript freshness: PASS — served JS SHA `d08a5bfe68b587b0266ee2ab6d6b421853875086515a88638554d3890a19de4d` matches the corrected origin asset.
- Served HTML checks: PASS — canonical, dateModified, Regular hours/week label, Monthly regular pay label, overtime double-count warning, schema/visible overtime FAQ and annual-including-overtime formula are present.
- Rendered desktop/mobile proofread: BLOCKED — available browser runtime blocks the live domain with ERR_BLOCKED_BY_ADMINISTRATOR.

Status remains PARTIALLY VERIFIED because rendered visual QA is blocked; do not treat the page as fully VERIFIED yet.


### /salary-calculator-with-bonus/ — repository review

Status: PARTIALLY VERIFIED  
Repository content score after remediation: **96/100**

U.S. keyword evidence captured 2026-10-03 from Ubersuggest:

- `salary calculator with bonus`: volume 2,400/month; CPC $8.23; SD 6.
- The current primary-query SERP is heavily mixed with bonus-tax, take-home-pay and payroll-calculator intent. It includes high-authority payroll/tax domains and a DA 2 take-home-pay page, so low headline SD does not mean every ranking route matches this URL's gross-compensation intent.
- This URL remains scoped to gross base salary + bonus arithmetic. It does not add tax or withholding logic merely to imitate a different SERP intent.

Current competitor evidence:

- Current gross-bonus tools commonly support percentage bonuses, flat bonuses and total-compensation output.
- Several competitors extend beyond this page's scope with combined percent + fixed awards, performance/proration factors, reverse-solving fields, payout-period breakdowns, copy/share controls or benefit-inclusive total compensation.
- Calculator Academy's bonus-percentage page has page authority 30 and 0 backlinks/referring domains in the current Ubersuggest page overview.
- HostedTimesheets' useful gap is transparent fixed-or-percent annual bonus math, target-compensation reverse math, schedule-adjusted hourly equivalents, monthly/biweekly/weekly planning equivalents, multiple currencies, browser-local calculation and a clear gross-only boundary.

Score:

- Search intent + semantic coverage: 20/20
- Competitor information gain: 17/20
- Skimmability + readability: 15/15
- Native-English grammar, punctuation + active voice: 15/15
- Methodology + calculation accuracy: 15/15
- SEO, schema, internal links + trust/privacy: 14/15

Calculation verification against corrected `assets/js/salary-bonus.js`:

- $60,000 base salary with a 10% bonus → $6,000 annual bonus and $66,000 total annual compensation: PASS.
- $50,000 base salary with a fixed $5,000 bonus → $55,000 total and 10.00% bonus relative to base salary: PASS.
- $60,000 + 10% at 40 hours/week and 52 workweeks → $5,500 monthly equivalent, $2,538.46 biweekly equivalent, $1,269.23 weekly equivalent, $28.85 base hourly equivalent and $31.73 hourly including bonus: PASS.
- $0 base salary with a fixed $6,000 bonus → $6,000 total compensation and `N/A` for bonus percentage of base salary: PASS after remediation.
- 100 workweeks/year is clamped to the visible maximum 53; zero hours/week is clamped to the visible arithmetic minimum 0.25: PASS.
- Negative salary, bonus and percentage inputs are clamped at zero.

Accuracy/UX findings and remediation:

- FOUND: HTML limited Workweeks/year to 53, but JavaScript previously enforced only the minimum. A manually entered value above 53 could change hourly-equivalent math beyond the visible input range.
- FIXED: JavaScript now clamps Workweeks/year to 1–53.
- FOUND: a zero base salary produced `0.00%` for “Bonus as % of salary,” even though a percentage relative to zero is undefined.
- FIXED: the result now shows `N/A` whenever base salary is zero.
- CLARIFIED: Hours/week and Workweeks/year affect only the hourly-equivalent metrics; monthly, biweekly and weekly equivalents continue to use annual total ÷ 12, ÷ 26 and ÷ 52.
- CLARIFIED: the reverse target-compensation percentage formula requires a positive base salary.
- Added a gross-compensation vs. bonus-tax intent boundary so the page does not imply take-home or withholding calculations.
- Added a schema-matched zero-base FAQ; visible FAQ and FAQPage schema now match 7/7 exactly.
- Calculator JavaScript math for ordinary positive-base fixed/percentage cases remains unchanged.

Remaining before VERIFIED:

- Content Quality CI.
- Merge and controlled HTML + JavaScript production deployment.
- Live HTTP/canonical/schema/content/asset verification.
- Rendered desktop/mobile proofread when an allowed browser path is available.
