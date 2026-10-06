# Work Hours Calculator Remediation Spec — 2026-10-06

## Objective

Remediate `/work-hours-calculator/` as the canonical repeated-shift work-hours calculator without duplicating the variable-day Time Card or Weekly Timesheet products.

## Verified current state

- Canonical URL: `https://hostedtimesheets.com/work-hours-calculator/`
- Source: GitHub `main` at `20e48d058368e028b883f4ea6f8dd65a2eed27bb`
- Production code base remains `6d4372d5a70239f1652d2a7cd0d06635e5122aa9`; later commit is documentation/state only.
- Existing calculator accepts one start time, one end time, one unpaid-break duration, repeated workdays, optional currency and hourly rate.
- Existing arithmetic rolls an earlier end time into the next day, subtracts break minutes, floors negative net duration at zero, repeats the net daily duration across workdays, and multiplies total hours by one hourly rate.
- Existing runtime silently coerces blank/invalid break to zero, blank/invalid/zero workdays to one, and blank/invalid/negative pay rate to zero. Blank start/end can leave stale outputs.
- Existing repository content review score: 96/100, PARTIALLY VERIFIED.

## Demand / keyword evidence

Ubersuggest US evidence checked 2026-10-06:

| Query | Volume | CPC | SD | Intent |
| --- | ---: | ---: | ---: | --- |
| work hours calculator | 135,000 | $2.89 | 49 | Informational |
| hours worked calculator | 135,000 | $2.89 | 49 | Informational |
| work time calculator | 33,100 | $3.82 | 47 | Informational |
| free work hours calculator | 4,400* | $3.14* | 7* | Informational |
| work hours calculator with lunch break | 70 | $2.59 | 35 | Informational |
| work hours calculator with break | 70 | $1.48 | 36 | Informational |
| hours worked calculator pay | 50 | $5.33 | 40 | Transactional |

*Previously captured 2026-10-03 and retained because it remains part of the current project evidence set.

The tracked Ubersuggest project reports no top-100 US desktop position as of the latest completed 2026-10-01 collection for `work hours calculator`, `free work hours calculator`, `work out hours worked`, `figure hours worked`, `count my hours worked`, or `calculate my hours worked`. `work time calculator with lunch` is pending and must not be interpreted as a ranking failure.

No live Google Search Console connector is available in the current tool surface. Page-specific first-party GSC query/landing evidence is therefore UNKNOWN for this release and must not be invented.

## Current SERP / competitor review

Fresh web review on 2026-10-06 shows the intent remains calculator-first. Current competitors commonly provide combinations of:
- start/end shift arithmetic;
- unpaid break handling;
- exact hours:minutes and decimal-hours outputs;
- overnight handling;
- repeated days or weekly totals;
- optional pay;
- reset/copy/export controls;
- richer daily grids, split shifts, overtime, or rounding.

Ubersuggest page data also shows low-authority specialist pages can participate. For example, the current WorkCalcs work-hours page reports PA 9 with 0 backlinks and 0 referring domains while ranking for dozens of related US queries.

## Canonical / cannibalization decision

Keep `/work-hours-calculator/` as the owner for one repeated shift pattern: start time + end time + unpaid break + repeated workdays + optional one-rate gross-pay arithmetic.

Do not add:
- a seven-day variable schedule grid;
- split shifts;
- overtime-rule logic;
- time-clock rounding policy;
- a new work-hours synonym URL.

Those functions remain separated:
- `/time-card-calculator/` — variable daily time-card/timesheet intent.
- `/weekly-timesheet-calculator/` — weekly/split-shift specialist.
- `/overtime-calculator/` — overtime arithmetic.
- `/time-duration-calculator/` — generic elapsed duration.
- `/decimal-hours-calculator/` — time/decimal conversion.

## Product gap to close

The primary defect is not missing SEO copy. It is ambiguous runtime behavior around invalid or blank inputs and limited result transparency.

Implement:
1. Explicit validation for required start/end times.
2. Explicit non-negative whole-minute validation for unpaid break.
3. Explicit whole-number workday validation from 1 through 31.
4. Truly optional hourly rate: blank means no pay estimate; explicit zero is valid; negative/invalid values suppress only pay.
5. No stale results when required inputs become invalid.
6. Preserve same-start/end = zero and break-longer-than-shift = zero behavior.
7. Show gross shift, net daily time, total repeated time, decimal totals and total minutes from one minute-based calculation.
8. Show an explicit formula/status line.
9. Add standard example, overnight example, reset and copy-result controls.
10. Keep all calculation browser-local and no-signup.

## Calculation contract

Given valid start minute `S`, end minute `E`, unpaid break `B >= 0`, and integer workdays `D in [1,31]`:

- `gross = E - S`
- if `gross < 0`, `gross += 1440`
- if `S == E`, `gross = 0`
- `netDaily = max(0, gross - B)`
- `total = netDaily * D`
- `decimalDaily = netDaily / 60`
- `decimalTotal = total / 60`
- if optional hourly rate `R` is valid and present: `estimatedPay = decimalTotal * R`

No time-clock rounding, overtime premium, tax, deduction, shift differential, employment-law determination or payroll-policy decision is applied.

## Validation contract

- Start/end: required valid `HH:MM` browser time values.
- Break: required whole number, zero or greater.
- Workdays: required whole number 1–31.
- Hourly rate: optional; when supplied it must be numeric and zero or greater.
- Currency: limited to the existing supported set.
- Invalid primary inputs clear duration/pay outputs and surface field errors.
- Invalid rate leaves time outputs available but pay displays unavailable.

## Content / semantic architecture

Primary intent:
- work hours calculator / hours worked calculator

Natural secondary coverage:
- calculate work hours
- work time calculator
- work hours with lunch/break
- overnight shift hours
- decimal work hours
- total work minutes
- work hours with optional pay estimate

Do not target overtime, variable weekly timesheets, or general duration as co-primary intents.

## Acceptance criteria

- One H1 and existing canonical retained.
- Title remains strongly aligned with primary intent.
- Calculator appears before explanatory content.
- Runtime validation follows the contract above.
- Standard and overnight examples reproduce actual runtime outputs.
- H:M, decimal and minute totals agree exactly.
- Optional pay uses exact total minutes / 60, not a rounded display value.
- FAQ visible text exactly matches FAQPage schema.
- At least six useful FAQs.
- No horizontal overflow at 390px or 1280px.
- Keyboard-accessible controls, visible labels, field-level errors and live calculation status.
- Content quality audit passes.
- JavaScript syntax passes.
- Dedicated HTML/schema/accessibility test passes.
- Dedicated Chromium calculation/UI matrix passes.
- Existing global header/search assets remain unchanged.
- ZT receives exact GitHub branch versions of every changed runtime/test file and hashes are parity-checked.
- GitHub Actions remains recorded BLOCKED by quota unless that external status changes.
- After merge: tested rollback preserved, controlled production release completed, HTTP/canonical/schema/assets/mobile/desktop live checks pass, then PROJECT_STATE is updated.

## Rollback

Preserve the pre-release production versions of:
- `work-hours-calculator/index.html`
- `assets/js/work-hours.js`

Do not modify unrelated public pages or shared site-shell assets in this release.
