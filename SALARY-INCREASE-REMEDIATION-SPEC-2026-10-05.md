# Salary Increase Calculator Remediation Spec — 2026-10-05

Status: VERIFIED planning / NO PRODUCTION CHANGE

## Objective

Strengthen `/salary-increase-calculator/` as the single canonical owner for salary increase / pay raise / pay increase arithmetic, fix proven validation gaps, add a flat annual raise mode, and make before/after period equivalents internally consistent without adding tax or legal assumptions.

Canonical URL remains:

`https://hostedtimesheets.com/salary-increase-calculator/`

## Search / architecture basis

Verified U.S. keyword evidence is recorded in `SALARY-INCREASE-ARCHITECTURE-2026-10-04.md`:

- `salary increase calculator`: 33,100 monthly searches; CPC $13.90; SD 16.
- `pay raise calculator`: 33,100; CPC $13.90; SD 26.
- `salary raise calculator`: 33,100; CPC $13.90; SD 25.
- `pay increase calculator`: 33,100; CPC $13.90; SD 19.
- `wage increase calculator`: 33,100; CPC $9.79; SD 22.

SERP overlap supports one canonical URL.

Decision:

- KEEP `/salary-increase-calculator/`.
- Do not create pay-raise/pay-increase duplicate URLs.
- Keep taxes, deductions and inflation/current-CPI logic out of this calculator.

## Current source

Current page:

- `salary-increase-calculator/index.html`
- title: `Salary Increase Calculator — Pay Raise & New Salary`
- H1: `Salary Increase Calculator`

Current runtime:

- `assets/js/salary-increase.js`

Current modes:

1. Raise percentage.
2. Compare current and new annual salaries.

Current outputs:

- new annual salary;
- annual increase/change;
- percentage change;
- monthly/biweekly/weekly change;
- current/new hourly equivalent.

## Proven runtime defects

### Blank numeric coercion

Current helper:

`Number(value) || 0`

This makes blank inputs indistinguishable from explicit zero.

Consequences include:

- blank current salary → 0;
- blank raise percentage → 0%;
- blank hours/week → 0, then silently replaced with 0.25;
- blank weeks/year → 0, then silently replaced with 1.

Future behavior must preserve a distinction between:

- blank / unavailable;
- invalid;
- explicit numeric zero.

### Weeks/year visible max not enforced

HTML says:

`min="1" max="53"`

Current JS only enforces minimum 1.

Value 54+ currently participates in hourly-equivalent math.

Future behavior:

- 1–53 inclusive only;
- blank invalid;
- 54 invalid;
- no silent clamp/substitution.

## Mode contract

Add three modes:

1. `Raise percentage`
2. `Flat annual raise`
3. `Compare salaries`

Mode switching:

- shows only relevant primary input;
- preserves values typed in each mode;
- recalculates immediately;
- does not rewrite user-entered values.

## Common input contract

### Currency

Keep existing supported currencies.

Currency changes formatting only.

### Current annual salary

- finite number >= 0;
- blank = invalid;
- negative = invalid;
- explicit 0 = valid because zero-baseline comparison behavior is defined.

### Hours per week

Used only for hourly-equivalent outputs.

- finite number > 0;
- minimum 0.25;
- blank = invalid for hourly-equivalent calculation;
- do not substitute 0.25 silently.

### Weeks per year

Used only for hourly-equivalent outputs.

- integer 1–53;
- blank = invalid;
- 53 accepted;
- 54 rejected;
- fractional values rejected.

If schedule inputs are invalid:

- annual/monthly/biweekly/weekly salary arithmetic still calculates;
- hourly-equivalent outputs show `—`;
- show a schedule validation message.

Do not block salary arithmetic solely because schedule inputs are missing.

## Percentage mode

Inputs:

- current annual salary;
- raise percentage >= 0.

Formula:

`annual change = current salary × raise% ÷ 100`

`new salary = current salary + annual change`

`percentage change = raise%`

Validation:

- blank percentage = invalid;
- negative percentage = invalid;
- explicit 0% = valid.

Do not add pay-cut semantics to this mode.

## Flat annual raise mode

Inputs:

- current annual salary;
- flat annual raise amount >= 0.

Formula:

`annual change = flat raise amount`

`new salary = current salary + flat raise amount`

If current salary > 0:

`percentage change = flat raise ÷ current salary × 100`

If current salary = 0 and flat raise > 0:

`percentage change = N/A`

If current salary = 0 and flat raise = 0:

`percentage change = 0.00%`

Validation:

- blank flat raise = invalid;
- negative flat raise = invalid;
- explicit 0 = valid.

## Compare salaries mode

Inputs:

- current annual salary;
- new annual salary.

Formula:

`annual change = new salary − current salary`

If current salary > 0:

`percentage change = annual change ÷ current salary × 100`

If current salary = 0 and new salary = 0:

`percentage change = 0.00%`

If current salary = 0 and new salary > 0:

`percentage change = N/A`

Comparison mode permits negative annual/percentage changes.

Labels must use `change`, not `increase`, wherever a negative result is possible.

## Annual / period output contract

Annual salary is authoritative.

For current salary `S_current` and new salary `S_new`:

### Monthly

`current monthly = S_current ÷ 12`

`new monthly = S_new ÷ 12`

`monthly change = (S_new − S_current) ÷ 12`

### Biweekly

`current biweekly = S_current ÷ 26`

`new biweekly = S_new ÷ 26`

`biweekly change = (S_new − S_current) ÷ 26`

### Weekly

`current weekly = S_current ÷ 52`

`new weekly = S_new ÷ 52`

`weekly change = (S_new − S_current) ÷ 52`

These are arithmetic planning equivalents, not predictions of a specific payroll schedule.

## Hourly-equivalent contract

When hours/week and weeks/year are valid:

`annual work hours = hours per week × weeks per year`

`current hourly equivalent = current salary ÷ annual work hours`

`new hourly equivalent = new salary ÷ annual work hours`

`hourly change = new hourly equivalent − current hourly equivalent`

Hourly equivalents are planning conversions only. They do not determine overtime eligibility or hourly employee status.

If schedule inputs are invalid:

- hourly outputs = `—`;
- salary/period outputs remain available.

## Result layout

Future result set should show before / after / change consistently.

Recommended result groups:

### Annual
- Current annual salary
- New annual salary
- Annual change
- Percentage change

### Monthly
- Current monthly
- New monthly
- Monthly change

### Biweekly
- Current biweekly
- New biweekly
- Biweekly change

### Weekly
- Current weekly
- New weekly
- Weekly change

### Hourly equivalent
- Current hourly equivalent
- New hourly equivalent
- Hourly change

Do not overload the first screen with every metric on small mobile widths. Group secondary period equivalents in a compact responsive section if needed.

## Sign / formatting contract

Comparison mode can produce negative change.

Formatting examples:

- positive money: `+$3,000.00` where UI review supports signed display;
- negative money: `−$3,000.00`;
- positive percent: `+5.00%`;
- negative percent: `−4.7619%`;
- unavailable percent: `N/A`.

If the existing currency formatter cannot safely produce signed output across currencies, retain normal currency formatting and use a semantic change label/indicator rather than constructing currency symbols manually.

## Percentage precision

Primary percentage display:

- minimum 2 places;
- up to 4 places when needed.

Examples:

- +5% → `5.00%`
- 63,000 → 60,000 → `−4.7619%`

Do not round the percentage before using it in any other calculation.

## Validation / accessibility

Add a calculator-level `aria-live="polite"` status.

Use adjacent field errors and `aria-invalid="true"`.

Examples:

- `Enter a current annual salary.`
- `Raise percentage must be zero or greater.`
- `Hours per week must be at least 0.25.`
- `Weeks per year must be a whole number from 1 to 53.`

Do not rely on color alone.

Do not rewrite invalid values to fallback numbers.

## Optional schedule behavior

Schedule inputs affect only hourly-equivalent metrics.

They do not affect:

- annual salary;
- annual change;
- percentage change;
- monthly equivalents;
- biweekly equivalents;
- weekly equivalents.

This must be explicit in both UI help and methodology text.

## Example presets

Keep the existing 5% example.

Add at most one additional lightweight example if mobile review supports it:

- `$60k + $3k flat`

Do not add large preset grids.

## Semantic retarget

Keep title concept:

`Salary Increase Calculator — Pay Raise & New Salary`

H1 can remain:

`Salary Increase Calculator`

Natural secondary coverage:

- pay raise calculator;
- pay increase calculator;
- salary raise;
- wage increase;
- raise percentage;
- flat raise amount;
- new salary;
- salary change.

Suggested early answer:

`Calculate a pay raise from a percentage or flat annual amount, or compare an old salary with a new salary. See annual, monthly, biweekly, weekly and hourly-equivalent changes from the same annual base.`

Do not create separate synonym pages.

## Content corrections

Update current copy so it no longer instructs users with a flat raise to manually switch to compare mode. Flat amount becomes a first-class calculator mode.

Clarify:

- comparison mode may produce a decrease;
- period values are annual arithmetic equivalents;
- schedule inputs affect hourly equivalents only;
- weeks/year is restricted to 1–53;
- taxes/deductions/bonuses are excluded;
- use Salary + Bonus calculator for bonus-inclusive compensation.

## FAQ scope

Useful visible/schema-matched questions:

- How do I calculate a 5% salary increase?
- How do I calculate a flat-dollar raise?
- How do I calculate percentage change from old salary to new salary?
- What if the current salary is zero?
- How are monthly/biweekly/weekly equivalents calculated?
- How is hourly equivalent calculated?
- Does this estimate taxes or take-home pay?

FAQPage schema must exactly match visible answers.

## Required test matrix

### Percentage mode

1. 60,000 + 5% → 63,000.
2. Annual change → 3,000.
3. Monthly change → 250.
4. Biweekly change → 115.38.
5. Weekly change → 57.69.
6. 0 + 0% → 0, 0.00%.
7. Blank percentage → invalid.
8. Negative percentage → invalid.

### Flat mode

9. 60,000 + 3,000 → 63,000.
10. Percentage change → 5.00%.
11. 0 + 3,000 → 3,000, percentage N/A.
12. 0 + 0 → 0, 0.00%.
13. Blank flat amount → invalid.
14. Negative flat amount → invalid.

### Compare mode

15. 60,000 → 63,000 → +3,000 / +5.00%.
16. 63,000 → 60,000 → −3,000 / −4.7619%.
17. 0 → 0 → 0 / 0.00%.
18. 0 → 1,000 → +1,000 / N/A.
19. Blank new salary → invalid.
20. Negative new salary → invalid.

### Schedule validation

21. 40 hours/week, 52 weeks/year → 2,080 annual hours.
22. 60,000 / 2,080 → $28.85 hourly equivalent.
23. 63,000 / 2,080 → $30.29 hourly equivalent.
24. hours/week blank → hourly outputs unavailable, salary outputs remain.
25. weeks/year blank → hourly outputs unavailable, salary outputs remain.
26. weeks/year 53 → accepted.
27. weeks/year 54 → invalid.
28. weeks/year 52.5 → invalid.
29. hours/week below 0.25 → invalid.

### Cross-output consistency

30. Current/new monthly values equal annual ÷ 12.
31. Current/new biweekly values equal annual ÷ 26.
32. Current/new weekly values equal annual ÷ 52.
33. Period change equals new period − current period.
34. All percentage/flat/compare examples reproduce from annual base.

### UX / SEO

35. Mode switching preserves entered values.
36. Comparison negative results use change labels.
37. Canonical remains `/salary-increase-calculator/`.
38. No pay-raise synonym URL is introduced.
39. FAQ visible/schema text matches exactly.
40. Visible examples reproduce runtime output.

## Release sequence

Implementation remains BLOCKED until GitHub Actions executes required jobs normally.

After recovery:

1. Create fresh feature branch from then-current main.
2. Revalidate current SERP/GSC evidence if available.
3. Implement explicit parsing/validation first.
4. Add flat amount mode.
5. Add before/after/change period outputs.
6. Run JS syntax check and full test matrix.
7. Update content/FAQ after runtime math is stable.
8. Require Content Quality CI PASS.
9. Merge exact tested branch.
10. Deploy HTML + JS with current-origin SHA guards.
11. Preserve one tested rollback copy.
12. Verify origin/GitHub parity.
13. Verify public page + JS HTTP 200 and edge freshness.
14. Verify title/H1/canonical/schema/internal links.
15. Run rendered desktop/mobile QA when an allowed browser path exists.
16. Update `PROJECT_STATE.md` after live verification.

## Rollback unit

- `salary-increase-calculator/index.html`
- `assets/js/salary-increase.js`

Homepage promotion should remain a separate rollback/release unit.
