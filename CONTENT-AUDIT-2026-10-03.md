# HostedTimesheets Content Re-Audit — 2026-10-03

Scope: all 32 public HTML pages.

This audit applies the new CONTENT-STANDARDS.md rules. It separates measurable static checks from editorial/search-quality checks that require human/research judgment.

## Sitewide baseline

- Pages audited: 32
- Pages with no measurable structural/readability issue in the first pass: 19
- Pages requiring remediation under the new standard: 13
- Paragraphs over the 90-word hard maximum: 0
- All pages remain structurally indexable and were already verified for H1/canonical/schema integrity in the production regression audit.

A page that passes the automated baseline is not automatically considered fully approved. Every search-targeted page still requires a current SERP/competitor review, semantic-intent review, native-English editorial pass, and factual verification.

## Remediation queue

### Content architecture / answer extraction

- /pto-accrual-based-on-hours-worked/
  - Add Quick Answer.
  - Expand FAQ from 2 to at least 3 useful questions.
  - Tighten sentence length.

- /how-to-calculate-pto-accrual/
  - Add Quick Answer.
  - Expand FAQ from 2 to at least 3 useful questions.

- /minutes-to-decimal-hours/
  - Add Quick Answer.

- /timesheet-template/
  - Add Quick Answer.
  - Add explicit methodology/how-to-use framing.
  - Add at least 3 useful FAQs.
  - Add at least 2 worked usage examples.

### Methodology / how-it-works framing

- /timesheet-pay-calculator/
- /biweekly-timesheet-calculator/
- /time-off-tracker/
- /how-to-calculate-time-card/
- /timesheet-template/

These pages contain useful content, but the method is not labeled/extracted clearly enough for the new standard.

### FAQ depth

- /pto-accrual-based-on-hours-worked/ — 2 FAQs
- /time-card-hours-with-lunch-break/ — 2 FAQs
- /how-to-calculate-pto-accrual/ — 2 FAQs
- /decimal-hours-calculator/ — 2 FAQs
- /timesheet-template/ — 0 FAQs

### Active voice

The passive-voice heuristic is above the new preferred threshold on:

- /payroll-hours-calculator/
- /time-card-calculator/

The privacy page also shows high passive-voice density, but legal/privacy wording must be edited for clarity without changing legal meaning.

### Readability tightening

Pages closest to the upper readability target and worth line-editing:

- /timesheet-pay-calculator/
- /time-off-tracker/
- /pto-accrual-based-on-hours-worked/
- /about/

## Competitive benchmark findings

Current competitor review shows that the strongest calculator pages commonly combine:

- an immediate answer or formula;
- detailed settings/use instructions;
- reproducible examples;
- edge cases and assumptions;
- clear methodology;
- FAQ coverage;
- authoritative sources for policy-sensitive topics;
- visible freshness/review information when warranted;
- strong tool UX rather than SEO copy before the calculator.

Examples observed in the current search landscape include CalculatorSoup for work-hours/time calculations, Omni Calculator for overtime, Capstan and PTOAccrual.com for PTO, and several specialist pay-raise calculators for salary-increase intent.

HostedTimesheets should not copy their content or add unsupported features simply to match feature counts. The standard is to provide better clarity, a more direct path to the answer, and defensible information gain for the exact intent the page serves.

## Hard editorial rule

Every public page must use natural, professional native English.

For search-targeted calculators and guides, publication approval requires:

- semantic-intent coverage;
- current competitor review;
- information gain;
- clear answer-first structure;
- skimmable headings/paragraphs;
- native-English grammar and punctuation;
- predominantly active voice;
- reproducible methodology/examples;
- factual and source verification;
- mobile/rendered proofread.

Technical SEO score alone cannot mark a page complete.

## Automation

Repository enforcement added:

- CONTENT-STANDARDS.md
- scripts/content_quality_audit.py
- .github/workflows/content-quality.yml

The script checks measurable structural/readability rules. Semantic superiority, competitor information gain, grammar nuance, and native-English quality remain mandatory editorial review items because automated scoring cannot reliably prove them.
