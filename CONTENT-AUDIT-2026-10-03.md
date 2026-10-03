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

Remaining before VERIFIED:

- Content Quality CI.
- Merge and controlled production deployment.
- Live HTTP/canonical/schema/content verification.
- Rendered desktop/mobile proofread when an allowed browser path is available.
