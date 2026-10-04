# Salary Increase Architecture Research — 2026-10-04

Status: VERIFIED research / NO PRODUCTION CHANGE

## Objective

Strengthen the existing /salary-increase-calculator/ as the single canonical owner for salary/pay-raise arithmetic without creating duplicate URLs or adding unnecessary tax/legal complexity.

## U.S. keyword evidence

Ubersuggest, United States, English:

- salary increase calculator: 33,100 monthly searches; CPC $13.90; SD 16.
- pay raise calculator: 33,100; CPC $13.90; SD 26.
- salary raise calculator: 33,100; CPC $13.90; SD 25.
- pay increase calculator: 33,100; CPC $13.90; SD 19.
- wage increase calculator: 33,100; CPC $9.79; SD 22.
- raise calculator: 6,600; CPC $3.25; SD 32.
- salary percentage increase calculator: 3,600; CPC $3.70; SD 30.
- percentage raise calculator: 2,400; CPC $8.70; SD 31.

Exact hourly/flat-raise variants have very little verified search demand, so they should be treated as product conveniences rather than new SEO targets.

## SERP / canonical decision

Current SERPs substantially overlap across salary increase and pay raise phrases.

Decision:
- KEEP /salary-increase-calculator/ as the single canonical calculator.
- Do not create separate /pay-raise-calculator/, /salary-raise-calculator/ or /pay-increase-calculator/ URLs.
- Keep the current title concept because it already bridges the two largest phrases:
  `Salary Increase Calculator — Pay Raise & New Salary`
- H1 can remain `Salary Increase Calculator`.
- Use pay raise / pay increase / wage increase naturally as secondary semantic terms.

## Current product strengths

The current page already supports:

1. Percentage raise mode:
   `new salary = current salary × (1 + raise% / 100)`

2. Old-vs-new comparison mode:
   `raise % = (new salary − current salary) / current salary × 100`

3. Outputs:
   - new annual salary;
   - annual change;
   - percentage change;
   - monthly change;
   - biweekly change;
   - weekly change;
   - current/new hourly equivalent.

4. User-entered:
   - currency;
   - hours/week;
   - weeks/year.

5. Zero-current comparison behavior:
   - 0 → 0 = 0%;
   - 0 → positive = percentage unavailable/N/A.

## Verified implementation gap

### Weeks/year max is not enforced in JavaScript

Visible HTML:

`min="1" max="53" step="1"`

Current runtime:

`weeks = Math.max(1, Number(value) || 0)`

A typed value above 53 still participates in the calculation even though the visible control says 53 is the maximum.

Required fix:
- clamp or validate to the same 1–53 range;
- preferred behavior: visible invalid state rather than silently changing user input.

## Other validation concerns

Current numeric helper converts blank/invalid values to zero:

`Number(value) || 0`

Consequences:
- blank current salary becomes 0;
- blank percent becomes 0%;
- blank hours/week becomes 0, then runtime substitutes 0.25;
- blank weeks/year becomes 0, then runtime substitutes 1.

Required future behavior:
- distinguish empty/invalid input from a legitimate numeric zero;
- do not silently generate a meaningful-looking hourly equivalent from fallback 0.25 hours/week or 1 week/year;
- preserve legitimate zero salary where mathematically relevant.

## Product gap from competitors

Common useful competitor features include:
- raise by percentage;
- raise by flat amount;
- old pay → new pay comparison;
- before/after annual, monthly, biweekly, weekly and hourly values;
- arbitrary pay-period input;
- inflation/tax estimates.

Recommended scope for HostedTimesheets:

### Add
1. Flat annual raise amount mode.
2. Before/after values for:
   - monthly pay;
   - biweekly pay;
   - weekly pay;
   - hourly equivalent.
3. Explicit input validation aligned with visible min/max attributes.
4. Dynamic labels using “change” where a comparison can be negative.

### Do not add initially
- tax calculations;
- take-home pay;
- jurisdiction-specific deductions;
- automatic inflation/current-CPI conclusions;
- “good raise” scoring.

Reason:
These features introduce tax/current-data/personal-finance assumptions that are unnecessary for the core arithmetic intent and complicate the site's legal/payroll boundary.

## Flat amount mode

Input:
- current annual salary;
- flat annual raise amount >= 0.

Formula:

`new salary = current salary + raise amount`

If current salary > 0:

`raise % = raise amount / current salary × 100`

If current salary = 0 and raise amount > 0:
- percentage change = N/A.

This is a product feature, not a separate keyword/page.

## Pay-period outputs

Given annual salary S:

- monthly = S / 12
- biweekly = S / 26
- weekly = S / 52
- hourly equivalent = S / (hoursPerWeek × weeksPerYear)

For each period, show before, after and difference.

Use annual salary as the authoritative base so all displayed periods are internally consistent.

## Negative changes

Comparison mode can currently produce a negative difference when new salary < current salary.

That arithmetic is valid, but labels such as “Annual increase” become misleading.

Recommended:
- use “Annual change,” “Monthly change,” etc. in comparison-capable output;
- percentage mode may remain restricted to nonnegative raises unless a future “pay cut” mode is explicitly added.

## Competitor authority evidence

Ubersuggest page overview found ranking pages with low authority and no backlinks:
- SlickCalc raise page: PA 12; 0 backlinks/referring domains.
- HourlyToAnnual raise-impact page: PA 14; 0 backlinks/referring domains.
- NorthStarNumbers pay-raise page: PA 11; 0 backlinks/referring domains.
- Payday.fyi pay-raise page: PA 12; 0 backlinks/referring domains.

The opportunity is therefore not exclusively backlink-driven.

## Release tests for future implementation

Percentage mode:
- 60,000 + 5% = 63,000.
- Annual change = 3,000.
- Monthly change = 250.
- Biweekly change = 115.38.
- Weekly change = 57.69.

Comparison mode:
- 60,000 → 63,000 = +5%.
- 63,000 → 60,000 = -4.7619%.
- 0 → 0 = 0%.
- 0 → 1,000 = percentage N/A.

Flat amount mode:
- 60,000 + 3,000 = 63,000 = +5%.
- 0 + 3,000 = 3,000; percentage N/A.

Schedule validation:
- hours/week blank = invalid, not 0.25 fallback.
- weeks/year blank = invalid, not 1 fallback.
- weeks/year 53 accepted.
- weeks/year 54 rejected.
- negative salary/raise rejected.

Cross-output:
- before/after annual, monthly, biweekly, weekly and hourly values reproduce from the same annual base.

## SEO acceptance criteria

- canonical remains /salary-increase-calculator/;
- no duplicate pay-raise URL;
- current title remains semantically broad;
- H1 stays natural and not keyword-stuffed;
- visible examples reproduce runtime;
- FAQ schema matches visible FAQ;
- internal links use salary/pay-raise wording naturally;
- homepage promotion follows the verified high-CPC/low-SD priority plan.

## Current blocker

Implementation remains blocked until the required GitHub Actions Content Quality job executes normally and passes.

This document is research/planning only.
