# Salary Calculator With Bonus Remediation Spec — 2026-10-07

## Objective

Remediate `/salary-calculator-with-bonus/` as the canonical gross salary-plus-bonus calculator. Preserve percentage and fixed annual bonus modes; add a target-total-compensation solve mode, strict validation, copyable output and explicit no-FX/no-tax boundaries. Do not expand this URL into bonus-tax, take-home-pay, equity/benefits, commission, vesting or jurisdiction-specific payroll logic.

## Verified baseline

- GitHub `main` before implementation: `7c6ff3ad8e06f7e892c6887b868210d58eda1186`.
- Existing calculator supported percentage-of-salary and fixed annual bonus modes.
- Existing outputs showed total annual compensation, annual bonus, bonus percentage of base, monthly/biweekly/weekly equivalents and base/total hourly equivalents.
- Existing runtime silently converted blank/malformed/negative inputs to zero and silently clamped Hours/week and Workweeks/year.
- Existing page already explained reverse target-compensation math in content but did not expose it as calculator functionality.
- Currency selection changed formatting only, but the calculator did not make the no-FX behavior prominent in the UI.

## Fresh demand evidence

Ubersuggest U.S. checked 2026-10-07:

| Query | Volume | CPC | SD |
| --- | ---: | ---: | ---: |
| salary calculator with bonus | 2,400 | $8.23 | 6 |
| salary bonus calculator | 2,400 | $7.81 | 47 |
| bonus calculator | 5,400 | $0 | 46 |
| total compensation calculator | 880 | $6.65 | 62 |
| bonus percentage calculator | 110 | $0 | 47 |
| annual bonus calculator | 50 | $0 | 46 |
| salary plus bonus calculator | 30 | $0 | 54 |

The exact-match query remains the preferred primary intent because it combines meaningful U.S. demand, high commercial CPC and very low reported SEO difficulty. No traffic forecast is claimed.

## SERP / competitor evidence

- Ubersuggest's primary SERP snapshot for `salary calculator with bonus`, updated 2026-10-02, is heavily mixed with bonus-tax/paycheck tools and includes AI Overview and People Also Ask features.
- Current web review on 2026-10-07 shows pure gross-pay bonus tools commonly provide percentage bonus, fixed bonus, total compensation, monthly equivalents, copy output, and in some cases reverse-solving.
- Current total-compensation tools commonly add equity, benefits, retirement match and other compensation, which is a broader intent than this URL should own.
- Ubersuggest reports Calculator Academy's bonus-percentage page at PA 50 with 874 backlinks / 340 referring domains; several newer specialist competitor pages return no Ubersuggest page-level data, so their authority/backlink position is UNKNOWN rather than assumed low.
- The defensible gap for HostedTimesheets is not tax logic. It is a cleaner gross-pay workflow with percentage, fixed and target-compensation modes; transparent pay-equivalent math; strict invalid-state handling; copyable results; browser-local/no-signup UX; and explicit scope boundaries.

## Canonical / cannibalization decision

This URL owns:
- salary calculator with bonus;
- gross salary + annual bonus arithmetic;
- percentage-of-base bonus;
- fixed annual bonus;
- required bonus amount/percentage to reach a target gross annual compensation;
- monthly, biweekly, weekly and hourly arithmetic equivalents of salary + bonus.

Keep separate:
- `/salary-increase-calculator/` — permanent base-salary raises and before/after salary change;
- `/salary-to-hourly-calculator/` — salary-to-hourly conversion without bonus-specific modeling;
- `/hourly-wage-calculator/` — hourly wage to recurring gross-pay equivalents;
- `/biweekly-pay-calculator/` — paycheck-frequency-specific gross-pay conversion;
- tax/withholding/take-home, commissions, equity/RSUs, benefits, retirement match, vesting, bonus eligibility and payout schedules — not implemented here.

## Arithmetic contract

Percentage mode:
- annual bonus = base annual salary × bonus percentage ÷ 100;
- total annual compensation = base annual salary + annual bonus.

Fixed mode:
- annual bonus = fixed annual bonus entered;
- total annual compensation = base annual salary + annual bonus;
- effective bonus percentage = annual bonus ÷ base annual salary × 100 when base salary > 0, otherwise N/A.

Target mode:
- required annual bonus = target total compensation − base annual salary;
- target must be >= base annual salary;
- effective bonus percentage = required annual bonus ÷ base annual salary × 100 when base salary > 0, otherwise N/A;
- total annual compensation = target total compensation.

Pay equivalents:
- monthly = total annual compensation ÷ 12;
- biweekly = total annual compensation ÷ 26;
- weekly = total annual compensation ÷ 52;
- annual hours assumption = hours/week × workweeks/year;
- base hourly equivalent = base annual salary ÷ annual hours;
- hourly including bonus = total annual compensation ÷ annual hours.

Currency selection is formatting only; it does not perform foreign-exchange conversion.

## Validation contract

- Base annual salary is required, finite and >= 0.
- Percentage mode: bonus percentage is required, finite and >= 0. Values above 100% remain valid because the calculator must not impose an arbitrary compensation-policy ceiling.
- Fixed mode: fixed annual bonus is required, finite and >= 0.
- Target mode: target total compensation is required, finite, >= 0 and >= base annual salary.
- Hours/week is required, finite and from 0.25 through 168.
- Workweeks/year is required, a whole number and from 1 through 53.
- Explicit zero is valid for base salary, bonus percentage and fixed bonus wherever mathematically defined.
- Invalid fields set `aria-invalid=true`, expose a visible field error, suppress all output metrics and suppress copy output.
- No invalid input is silently clamped, normalized or converted to another valid value.

## Legal / payroll boundary

The calculator performs gross arithmetic only from user-supplied values. It does not decide or calculate:
- bonus tax, supplemental withholding or take-home pay;
- bonus eligibility, target achievement, vesting or payout timing;
- employment classification;
- commissions, equity/RSUs, retirement match or benefits;
- jurisdiction-specific payroll or tax obligations.

## UX / information gain

Preserve:
- calculator-first layout;
- percentage and fixed bonus modes;
- annual/monthly/biweekly/weekly/hourly equivalents;
- currency display options;
- local browser calculation;
- zero-base fixed-bonus arithmetic with N/A effective bonus percentage.

Add / strengthen:
- target total compensation mode;
- strict field-level validation;
- copy result;
- live calculation status;
- explicit no-FX language;
- page-local content containment for mobile;
- eighth schema-matched FAQ about currency formatting;
- freshness date 2026-10-07.

## Acceptance criteria

- One H1 and self-canonical retained.
- Default percent mode: $60,000 × 10% = $6,000 bonus; $66,000 total; $5,500 monthly; $2,538.46 biweekly; $1,269.23 weekly; $28.85 base hourly and $31.73 total hourly at 40 × 52.
- Fixed mode: $60,000 + $6,000 => $66,000 total and 10.00% effective bonus.
- Target mode: $80,000 base + target $90,000 => $10,000 required bonus and 12.50%.
- Target below base salary is invalid and suppresses results.
- Base salary 0 + fixed $6,000 remains valid with N/A bonus percentage.
- Bonus percentage 0 and fixed bonus 0 are valid.
- Bonus percentage >100 remains valid.
- Blank/negative salary, active bonus inputs, or schedule inputs are invalid.
- Hours/week <0.25 or >168 is invalid.
- Workweeks/year outside 1–53 or fractional is invalid.
- Currency change preserves numeric inputs/calculation and changes formatting only.
- Copy emits a reproducible valid summary and never copies stale results after an invalid input.
- FAQ visible text exactly matches FAQPage schema.
- No tax, state selector, withholding, equity/RSU, commission, benefits or vesting engine is introduced.
- No horizontal document overflow at 390px or 1280px.
- Runtime exceptions and console errors remain zero.
- Dedicated HTML/schema/accessibility contract PASS.
- Dedicated Chromium calculation/UI matrix PASS.
- Content-quality audit PASS for this page with zero hard failures.
- Exact tested source snapshot parity established before deployment.
- Rollback copies preserved before production write.
- Public HTTP/canonical/schema/versioned JS/render verification PASS.
- PROJECT_STATE and DECISIONS updated before another page starts.
