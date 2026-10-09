# Salary to Hourly Calculator Remediation Spec — 2026-10-09

## Objective

Remediate `/salary-to-hourly-calculator/` as the canonical page for converting annual gross salary into an hourly gross-pay equivalent using the paid work schedule represented by that salary, while preserving clear separation from hourly-to-salary, bonus, tax, overtime and paycheck-frequency tools.

## Verified demand

Ubersuggest, United States, 2026-10-09:

- `salary to hourly calculator`: 49,500 volume, $0.88 CPC, SD 59.
- `salary to hourly`: 18,100 volume, $1.435 CPC, SD 21.
- `annual salary to hourly`: 4,400 volume, $0.95 CPC, SD 34.
- `how to convert annual salary to hourly`: 8,100 volume, $3.42 CPC, SD 8.
- `how to convert annual salary to hourly rate`: 6,600 volume, $0.65 CPC, SD 8.
- `figure salary to hourly`: 49,500 volume, $1.05 CPC, SD 20.
- `convert my salary to hourly`: 4,400 volume, $0.935 CPC, SD 9.
- `60 000 salary to hourly`: 4,400 volume, $11.585 CPC, SD 20.
- `50 000 salary to hourly`: 3,600 volume, $9.86 CPC, SD 24.
- `65 000 salary to hourly`: 3,600 volume, $10.52 CPC, SD 21.

No traffic or revenue forecast is claimed.

## SERP / competitor evidence

Current Ubersuggest US SERPs show a calculator-first informational intent.

For `salary to hourly calculator`, leading results include Omni Calculator, The Calculator Site, ADP, Indeed, SoFi, CalcXML and Calculator.net. Lower-authority results also rank, including salarytohourlycalculator.us (DA 8) and ShiftFlow (DA 19).

For `salary to hourly`, People Also Ask and an AI Overview are present. The Calculator Site ranks #1, ADP #2 and Omni #4.

For `how to convert annual salary to hourly`, an AI Overview and People Also Ask are present, while low-authority specialist pages also rank.

Observed competitor capabilities include:
- annual salary + weekly hours + weeks/year inputs;
- hourly/daily/weekly/biweekly/monthly breakdowns;
- reverse hourly-to-salary conversion on some pages;
- tax/take-home modes on some pages;
- common conversion charts;
- non-40-hour schedule examples;
- salary/pay-period explanations.

The gap for HostedTimesheets is not another broad bidirectional/tax calculator. The stronger angle is validated schedule-aware gross conversion with explicit paid-week semantics, exact invalid-input handling, clear monthly-versus-two-week arithmetic, copy/print output, and clean canonical separation from the site's other pay tools.

## Canonical boundary

This URL owns:
- annual gross salary -> hourly gross-pay equivalent;
- annual paid-hours calculation;
- daily, weekly, two-paid-week and average-monthly gross equivalents;
- custom decimal hours/week and paid weeks/year;
- common salary/schedule examples;
- copy and print of the current valid result.

This URL does not own:
- hourly wage -> annual salary conversion (owned by `/hourly-wage-calculator/`);
- annual compensation including bonus (owned by `/salary-calculator-with-bonus/`);
- detailed paycheck/pay-period calculation (owned by `/biweekly-pay-calculator/`);
- overtime eligibility or overtime pay;
- tax, deductions, benefits or take-home pay;
- exempt/nonexempt or employment classification;
- foreign-exchange conversion.

## Calculation contract

`annual paid hours = hours per paid workweek × paid weeks per year`

`hourly equivalent = annual gross salary ÷ annual paid hours`

`weekly equivalent = annual gross salary ÷ paid weeks per year`

`daily equivalent = weekly equivalent ÷ workdays per week`

`biweekly equivalent = weekly equivalent × 2`

`average monthly equivalent = annual gross salary ÷ 12`

The monthly result intentionally does not equal weekly × 4.

## Validation

- Annual gross salary is required, finite and >= 0.
- Hours per paid workweek are required, finite, > 0 and <= 168.
- Paid weeks per year are required, finite, > 0 and <= 53. Decimal weeks are allowed.
- Workdays per week are required whole numbers from 1 through 7.
- Browser `validity.badInput` is invalid even when the DOM `.value` is empty.
- Invalid input suppresses stale result/copy state.
- Currency changes formatting only; no FX conversion is performed.

## Information gain

1. Clarifies paid weeks versus calendar weeks and paid leave.
2. Explains why average monthly pay is annual ÷ 12 rather than weekly × 4.
3. Defines biweekly on this page as two paid workweeks instead of silently assuming a 26-paycheck payroll schedule.
4. Allows fractional paid weeks and decimal weekly hours while validating physical/range boundaries.
5. Rejects malformed browser number input rather than silently coercing/clamping.
6. Provides reproducible copy and print output with schedule assumptions.
7. Preserves distinct ownership versus Hourly Wage, Salary + Bonus and Biweekly Pay.

## Acceptance criteria

- One H1, self-canonical, index/follow.
- WebPage dateModified 2026-10-09.
- 8 visible FAQs exactly match FAQ schema.
- Fresh runtime key `salary-to-hourly.js?v=20261009-remediation1`.
- Default 52,000 / 40 / 52 / 5 -> 2,080 annual hours and $25.00 hourly.
- Example 60,000 / 37.5 / 52 / 5 -> 1,950 annual hours and about $30.77 hourly.
- $60,000 default-style 40 × 52 -> $28.85/hour.
- Monthly output is annual ÷ 12.
- Two-paid-week output is weekly × 2.
- Zero salary is valid.
- Blank/negative/zero-invalid hours, zero-invalid weeks, weeks >53, invalid days, fractional days and malformed number input suppress results.
- Fractional paid weeks remain valid.
- Currency formatting only.
- Copy and print work only from valid state.
- No document-level horizontal overflow at 390px or 1280px.
- Zero runtime exceptions / console errors.
- HTML/schema/accessibility test PASS.
- Chromium calculation/UI matrix PASS.
- Page-only content-quality audit PASS.
- Preserve active-root rollback before production-bound changes.
- Deploy tested JS first, then HTML with the fresh runtime key.
- Verify active-origin and public runtime after release.
