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
