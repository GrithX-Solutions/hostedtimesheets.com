# Payroll Hours Calculator Remediation Spec — 2026-10-08

## Objective
Remediate `/payroll-hours-calculator/` as the canonical page for converting already-verified daily worked durations into decimal payroll hours, with optional arithmetic-only regular/overtime comparison and gross-pay estimation.

## Verified demand
Ubersuggest, United States, 2026-10-08:
- `payroll hours calculator`: 9,900 volume, $6.90 CPC, SD 50.
- `calculate payroll hours`: 14,800 volume, $4.115 CPC, SD 23.
- `payroll calculator hours`: 8,100 volume, $4.445 CPC, SD 19.
- `free payroll hours calculator`: 880 volume, $4.50 CPC, SD 9.
- `how do you calculate payroll hours`: 260 volume, $5.04 CPC, SD 17.
- `calculate payroll hours and minutes`: 40 volume, $4.25 CPC, SD 3.

No traffic or revenue forecast is claimed.

## SERP / competitor evidence
Current SERPs include AI Overview and People Also Ask features. Results mix work-hours/time-card calculators with payroll-hour conversion and overtime/pay estimators. Current competitors include CalculatorSoup, Redcort, Harvest, ADP, Calculator.net, HiveDesk and low-authority specialist tools.

Observed competitor capabilities include clock-in/out entry, breaks, decimal conversion, overtime/pay estimates, CSV export, multiple pay periods and, on some sites, rounding options. This URL will not duplicate clock-punch logic already owned by `/work-hours-calculator/`.

## Canonical boundary
This URL owns:
- daily durations already expressed as hours + minutes;
- exact minute aggregation and decimal-hour conversion;
- weekly total payroll hours;
- optional user-entered threshold/multiplier comparison;
- optional gross-pay estimate;
- copy, CSV and print outputs.

This URL does not decide:
- compensable time;
- overtime eligibility;
- break entitlement or treatment;
- payroll rounding policy;
- taxes, deductions, benefits or net pay;
- jurisdiction-specific payroll compliance.

Clock-in/out, breaks and cross-midnight shift arithmetic remain on `/work-hours-calculator/`. Dedicated overtime scenarios remain on `/overtime-calculator/`. Timesheet-derived pay remains on `/timesheet-pay-calculator/`.

## Calculation contract
For each day:
`daily minutes = hours × 60 + minutes`
`daily decimal hours = daily minutes ÷ 60`

Across the week:
`total minutes = sum(daily minutes)`
`total payroll hours = total minutes ÷ 60`

If both optional threshold and multiplier are entered:
`regular = min(total, threshold)`
`overtime = max(0, total - threshold)`

If rate is entered:
`regular pay = regular × rate`
`overtime pay = overtime × rate × multiplier` when an overtime scenario is active.

## Validation
- Daily hours may be blank (treated as zero) or a whole number >= 0.
- Daily minutes may be blank (treated as zero) or a whole number from 0 through 59.
- Hourly rate is optional; if entered it must be finite and >= 0.
- Threshold and multiplier are optional as a pair.
- Multiplier must be > 0 when entered.
- Invalid inputs show field errors and suppress stale totals/exports.
- No negative or malformed value is silently coerced to zero.
- Minutes >59 are invalid, not silently clamped.

## Information gain
1. Adds explicit validation rather than silent coercion/clamping.
2. Keeps exact minute aggregation separate from two-decimal display rounding.
3. Makes rate and overtime scenario genuinely optional instead of implying a legal default.
4. Exposes reproducible copy/CSV/print outputs.
5. States canonical separation from clock-punch, overtime-law and payroll-policy logic.
6. Expands semantic coverage around the lower-difficulty “calculate payroll hours” cluster without adding a duplicate URL.

## Acceptance criteria
- One H1, self-canonical, index/follow.
- WebPage dateModified 2026-10-08.
- 8 visible FAQs exactly match FAQ schema.
- Default zero time is valid; blank daily cells are valid zero; optional pay/overtime fields are blank.
- Example = 2,490 minutes = 41.50 hours.
- Invalid negative hours, fractional hours, minutes >59, negative rate, incomplete threshold/multiplier pair and zero multiplier suppress stale results.
- Optional rate blank suppresses money estimate.
- Optional threshold/multiplier blank leaves total time valid and unsplit.
- Currency formatting only; no FX conversion.
- Copy, CSV and print remain reproducible.
- No document-level horizontal overflow at 390px or 1280px.
- Zero runtime exceptions/console errors.
- Page HTML/schema/accessibility test PASS.
- Browser calculation/UI matrix PASS.
- Content-quality audit PASS before release.
- Preserve active-origin rollback before production write.
- Verify merged Git blobs against active origin and public CDN/runtime.
