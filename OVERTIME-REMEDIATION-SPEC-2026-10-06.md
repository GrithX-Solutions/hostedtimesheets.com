# Overtime Calculator Remediation Spec — 2026-10-06

## Objective

Remediate `/overtime-calculator/` as the canonical overtime-pay arithmetic tool for total-hours threshold calculations and user-classified regular/overtime/double-time hours, without making legal eligibility, jurisdiction, tax or payroll-policy decisions.

## Verified current state

- Canonical URL: `https://hostedtimesheets.com/overtime-calculator/`.
- Source baseline: GitHub `main` at `373f31abf8f8973ed6caf2a3c1c548ef5b7dbf36`.
- Current runtime accepts total hours, hourly rate, one overtime threshold, one overtime multiplier and currency.
- Current JavaScript silently coerces blank, invalid and negative numeric inputs to zero.
- Current page has correct broad intent alignment, but input validation and result-state behavior are not release-grade.
- Existing content mixes ordinary overtime-pay intent with the separate qualified-overtime tax-deduction topic. The tax topic remains explanatory only and will not become a calculator mode on this URL.

## Demand / keyword evidence

Fresh Ubersuggest U.S. data checked 2026-10-06:

| Query | Volume | CPC | SD | Intent |
| --- | ---: | ---: | ---: | --- |
| overtime calculator | 22,200 | $5.83 | 20 | Informational |
| time and a half calculator | 14,800 | $4.11 | 20 | Informational |
| overtime pay calculator | 4,400 | $4.73 | 24 | Informational |
| payroll and overtime calculator | 1,000 | $1.66 | 7 | Informational/transactional-adjacent |
| payroll overtime calculator | 320 | $2.39 | 23 | Informational |

Related search data also shows a large separate tax-intent cluster around “no tax on overtime calculator.” That intent is not merged into this page because it requires tax eligibility/reporting logic and would change the product boundary.

## SERP / competitor evidence

Ubersuggest’s current stored U.S. SERP for `overtime calculator` includes:
- Omni Calculator.
- The Calculator Site.
- LogMyHours.
- U.S. Department of Labor FLSA Overtime Calculator Advisor.
- Indeed Flex.
- GoodCalculators.
- multiple low-authority specialist calculator domains.

Low-authority participation is real:
- LogMyHours overtime page: PA 20, 0 backlinks, 0 referring domains; ranks for a broad overtime-pay keyword set.
- WorkCalcs overtime page: PA 9, 0 backlinks, 0 referring domains.
- Ubersuggest SERP also reports SmartOvertime and OvertimeCalc at domain authority 3.

Fresh public-web review on 2026-10-06 shows competitors commonly offer:
- regular/overtime pay splits;
- time-and-a-half and custom multipliers;
- double-time support on some tools;
- direct regular/overtime-hour entry on some tools;
- threshold-based weekly calculation on others;
- export/copy/reset controls;
- legal-rule explanations and current qualified-overtime-tax content.

## Canonical / cannibalization decision

Keep one canonical URL for ordinary overtime-pay arithmetic:
- `/overtime-calculator/` owns overtime calculator, overtime pay calculator, overtime rate calculator and time-and-a-half calculator intent.

Keep related intents separate:
- `/payroll-hours-calculator/` converts source time to payroll-ready hours.
- `/time-card-calculator/` reconstructs variable daily punches.
- `/work-hours-calculator/` calculates one repeated shift pattern.
- tax eligibility and qualified-overtime deduction logic are not added here.
- state-specific overtime eligibility/rules are not added here.

## Product gap

Implement two explicit arithmetic modes:

### 1. Total hours + threshold
User supplies:
- total hours;
- regular hourly rate;
- overtime threshold;
- overtime multiplier;
- currency.

Arithmetic:
- `regularHours = min(totalHours, threshold)`
- `overtimeHours = max(0, totalHours - threshold)`
- `overtimeRate = regularRate * overtimeMultiplier`
- `regularPay = regularHours * regularRate`
- `overtimePay = overtimeHours * overtimeRate`
- `grossPay = regularPay + overtimePay`

### 2. Already-classified hours
User supplies:
- regular hours;
- overtime hours;
- optional double-time hours;
- regular hourly rate;
- overtime multiplier;
- double-time multiplier;
- currency.

Arithmetic:
- `totalHours = regularHours + overtimeHours + doubleTimeHours`
- `overtimeRate = regularRate * overtimeMultiplier`
- `doubleTimeRate = regularRate * doubleTimeMultiplier`
- `regularPay = regularHours * regularRate`
- `overtimePay = overtimeHours * overtimeRate`
- `doubleTimePay = doubleTimeHours * doubleTimeRate`
- `grossPay = regularPay + overtimePay + doubleTimePay`

The calculator never determines whether any hour legally belongs in an overtime or double-time bucket.

## Validation contract

- Required numeric fields must be present and finite.
- Hours, threshold and hourly rate must be zero or greater.
- Overtime and double-time multipliers must be greater than zero.
- Invalid values remain invalid; they are not clamped or silently converted to zero.
- Any invalid active-mode input clears calculated result values and surfaces field-level errors.
- Hidden-mode fields do not block the active mode.
- Explicit zero hours and zero hourly rate are valid arithmetic inputs.
- Currency remains limited to the existing supported set.

## UX / information gain

- Calculator stays above explanatory content.
- Input method switch: threshold-based totals or already-classified hours.
- Time-and-a-half and double-time examples.
- Field-level validation with `aria-invalid`.
- Live calculation status.
- Copy-result action.
- Reset action.
- Formula/result line that names the exact rates used.
- Browser-local, no-signup calculation.

## Legal / tax boundary

Current authoritative references verified 2026-10-06:
- U.S. DOL Fact Sheet #23: federal overtime generally requires at least 1.5× the regular rate after 40 hours in a workweek for covered nonexempt employees, subject to the Act’s coverage/exemptions and other rules.
- U.S. DOL Fact Sheet #56A: the FLSA regular rate can include remuneration beyond a stated base wage.
- IRS FS-2026-13 (August 2026): the qualified-overtime deduction is a separate federal income-tax deduction; qualifying compensation is generally the FLSA-required premium above the regular rate, subject to eligibility/reporting/limits.

The page may explain those boundaries but must not determine coverage, exemption, applicable state rules, regular-rate inclusions, tax eligibility, withholding or deductions.

## Acceptance criteria

- One H1; existing canonical retained.
- Primary title/H1 aligned to overtime calculator intent.
- Two arithmetic modes work without stale cross-mode state.
- Standard 45-hour time-and-a-half example reproduces $1,187.50 gross at $25/hour.
- Classified example with 40 regular + 5 OT + 2 double-time hours at $25/hour reproduces $1,287.50 gross.
- Blank/negative/invalid active inputs are rejected explicitly.
- Explicit zero values behave intentionally.
- FAQ visible text exactly matches FAQPage schema.
- At least seven useful FAQs.
- Current DOL and IRS sources are linked with the legal/tax boundary clearly stated.
- No state-specific overtime determination or tax-deduction calculator is introduced.
- No horizontal overflow at 390px or 1280px.
- JavaScript syntax passes.
- Content-quality audit passes.
- Dedicated HTML/schema/accessibility test passes.
- Dedicated Chromium calculation/UI matrix passes.
- Shared header/search assets remain unchanged.
- ZT receives exact GitHub branch bytes for changed runtime/test files and parity is verified before release.
- GitHub Actions remains recorded BLOCKED unless quota status changes.
- Release requires rollback preservation, controlled production deployment, public HTTP/canonical/schema/assets/mobile/desktop checks and PROJECT_STATE update.

## Rollback

Preserve pre-release production copies of:
- `overtime-calculator/index.html`
- `assets/js/overtime-calculator.js`

Do not modify unrelated public pages or shared site-shell assets in this release.
