# Hourly Wage Calculator Remediation Spec — 2026-10-07

## Objective

Remediate `/hourly-wage-calculator/` as the canonical owner for gross hourly-wage to recurring-pay conversion. Preserve adjustable regular hours, paid weeks, workdays, currency formatting and optional overtime. Replace silent coercion with explicit validation, clarify recurring-overtime and currency assumptions, add copyable output, and keep tax/take-home, reverse salary conversion and overtime-eligibility decisions outside this URL.

## Verified baseline

- GitHub `main` before this work: `cb934a1297a25a0f994432778af90c6d69acc190`.
- Existing page was previously remediated on 2026-10-03 but remained outside the newer strict page-by-page browser gate.
- Existing runtime silently converted blank/malformed required numeric values to zero and clamped several out-of-range values.
- Existing HTML already had one H1, self-canonical, WebApplication + FAQ schema, gross-pay formulas, paid-week controls, optional overtime and salary/pay internal links.

## Fresh demand evidence

Ubersuggest U.S. checked 2026-10-07:

| Query | Volume | CPC | SD |
| --- | ---: | ---: | ---: |
| hourly wage calculator | 18,100 | $1.935 | 19 |
| hourly pay calculator | 8,100 | $2.225 | 16 |
| hourly to salary calculator | 49,500 | $1.13 | 56 |

The low-SD primary terms are the practical opportunity. The larger hourly-to-salary phrase is materially harder and is treated as secondary semantic coverage, not a guaranteed traffic forecast.

Ubersuggest Google-SERP snapshot for the primary query was last updated 2026-08-08 and remains mixed: ADP, Calculator.net, Omni, SmartAsset, PaycheckCity, Indeed, Gusto and conversion tools. This means the query spans gross conversion and tax/paycheck intents; the page must not add withholding logic merely to imitate tax-focused results.

Fresh public competitor review on 2026-10-07 also found newer specialist gross-pay calculators that emphasize direct formulas, overtime breakdowns, browser-local calculation and copy/share actions. Ubersuggest reports WageHourTools' hourly-wage page at PA 3 with 0 backlinks and 0 referring domains, showing that some specialist pages can surface without established page-level link equity.

## Canonical / cannibalization decision

This URL owns:
- hourly wage calculator;
- hourly pay calculator for gross recurring-pay equivalents;
- hourly wage to weekly, biweekly, average monthly and annual gross pay;
- optional user-supplied overtime assumptions.

Keep separate:
- `/salary-to-hourly-calculator/` — reverse annual salary to hourly rate;
- `/biweekly-pay-calculator/` — pay-period-specific conversion;
- `/timesheet-pay-calculator/` — pay from time-card/timesheet hours;
- `/overtime-calculator/` — focused overtime classification/pay scenarios;
- tax, withholding, take-home and jurisdiction-specific payroll calculators — not implemented here.

## Arithmetic contract

For valid inputs:
- weekly regular pay = hourly rate × regular hours/week;
- annual regular pay = weekly regular pay × paid weeks/year;
- daily regular pay = weekly regular pay ÷ workdays/week;
- biweekly regular pay = weekly regular pay × 2;
- average monthly regular pay = annual regular pay ÷ 12;
- weekly overtime pay = hourly rate × overtime multiplier × overtime hours/week;
- weekly pay including overtime = weekly regular pay + weekly overtime pay;
- annual pay including overtime = annual regular pay + weekly overtime pay × paid weeks/year.

The annual overtime estimate assumes the entered overtime hours repeat across every paid workweek.

## Validation contract

- Hourly wage is required, finite and >= 0. Explicit zero is valid.
- Regular hours/week is required, finite and 0–168.
- Paid weeks/year is required as a whole number from 1–53.
- Workdays/week is required as a whole number from 1–7.
- Overtime hours/week may be blank (zero) or a finite value from 0–168.
- Regular plus overtime hours cannot exceed 168 hours/week.
- Overtime multiplier must be finite and >= 1 when used. A blank multiplier is harmless only when overtime hours are zero.
- Invalid inputs set `aria-invalid=true`, show field-level errors, suppress result metrics and disable meaningful copy output.
- No invalid value is silently clamped into a different valid value.

## UX / information gain

Preserve:
- immediate calculator-first layout;
- paid weeks/year;
- workdays/week;
- multi-currency formatting;
- optional overtime;
- daily, weekly, biweekly, monthly and annual regular-pay outputs;
- weekly/annual overtime-inclusive outputs;
- reproducible overtime example and reset.

Add / strengthen:
- explicit field validation instead of silent coercion;
- copy result;
- live status text;
- currency-is-formatting-only explanation;
- recurring-overtime annualization assumption;
- seven schema-matched visible FAQs;
- freshness date 2026-10-07.

## SEO / semantic map

Primary:
- hourly wage calculator

Secondary:
- hourly pay calculator
- hourly to annual salary calculator
- hourly wage to yearly salary
- weekly pay from hourly wage
- biweekly pay from hourly wage
- monthly pay from hourly wage
- gross hourly pay
- overtime pay estimate

Entities / attributes:
- hourly rate
- regular hours
- overtime hours
- overtime multiplier
- paid workweeks
- workdays
- weekly pay
- biweekly pay
- monthly average
- annual gross pay
- gross vs take-home pay
- currency formatting
- taxes and deductions boundary

## Acceptance criteria

- One H1 and self-canonical retained.
- Default $25 × 40 × 52 => $1,000 weekly, $2,000 biweekly, $4,333.33 monthly average and $52,000 annual regular pay.
- Overtime example $22.50 × 40 regular + 5 OT at 1.5× => $168.75 weekly OT, $1,068.75 weekly total and $55,575 annual total.
- Part-time $25 × 32 × 50 => $40,000 annual regular pay.
- Explicit zero hourly rate remains valid.
- Blank required rate/hours/weeks/days invalid.
- Weeks 0, 54 and fractional values invalid.
- Days 0, 8 and fractional values invalid.
- Negative overtime invalid; blank overtime valid zero.
- Combined regular + overtime above 168 invalid.
- Overtime multiplier below 1 invalid when overtime is used.
- Copy returns a reproducible valid summary and does not copy stale output when invalid.
- Currency selection changes formatting only and does not perform FX conversion.
- FAQ visible text equals FAQPage schema.
- No tax/withholding, reverse-salary mode or overtime-eligibility inference is introduced.
- No horizontal overflow at 390px or 1280px.
- Runtime console/exception count remains zero.
- Content-quality audit PASS.
- Dedicated HTML/schema/accessibility test PASS.
- Dedicated Chromium calculation/UI matrix PASS.
- Exact GitHub branch files are validated on the ZT host contingency runner because GitHub Actions quota remains blocked.
- Rollback copies preserved before production write.
- Public HTTP/canonical/schema/versioned JS/mobile/desktop verification PASS.
- PROJECT_STATE and DECISIONS updated before any next page begins.
