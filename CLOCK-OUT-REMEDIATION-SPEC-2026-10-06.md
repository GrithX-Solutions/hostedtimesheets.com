# Clock Out Time Calculator Remediation Spec — 2026-10-06

## Objective

Remediate `/clock-out-time-calculator/` as the canonical shift-end planning tool for “clock out time calculator” intent. The calculator must answer one question well: given a local clock-in time, a paid-work target and user-identified unpaid breaks, when should the user clock out?

It must not become a general hours-worked, time-card, overtime, payroll, break-entitlement or labor-law calculator.

## Verified source baseline

- GitHub `main`: `55def470ae025a22f96e765bf9faa8e1e81d74bb`.
- Canonical URL: `https://hostedtimesheets.com/clock-out-time-calculator/`.
- Existing calculator accepts clock-in time, paid hours, paid minutes and one total unpaid-break field.
- Existing runtime silently converts blank/invalid numeric inputs to zero and clamps out-of-range values. This makes malformed user input look like a valid calculation.
- Existing page already handles overnight arithmetic, 12-hour/24-hour display, day offsets, presets, current-time input, reset and copy.

## Demand / keyword evidence

Fresh Ubersuggest U.S. data checked 2026-10-06:

| Query | Volume | CPC | SD | Intent |
| --- | ---: | ---: | ---: | --- |
| clock out time calculator | 135,000 | $4.56 | 29 | Informational |
| clock out calculator | 4,400 | $5.67 | 29 | Commercial |
| what time should i clock out | 110 | $0 | 41 | Informational |
| clock out time | 170 | $7.18 | 29 | Informational |
| when should i clock out | 20 | $0 | 18 | Informational |

Ubersuggest reports the current #1 page for the primary keyword as MTS Calculators, DA 8 / PA 15, with 0 backlinks and 0 referring domains on the ranking URL. This confirms a real low-authority specialist opportunity; it does not guarantee ranking.

## Current SERP / competitor evidence

Current search review on 2026-10-06 remains calculator-first. Common competitor capabilities:
- clock-in + paid shift + unpaid break -> clock-out;
- overnight/day-offset handling;
- 12-hour and 24-hour output;
- target-hour presets;
- reverse “hours worked” or “find start time” modes on some tools;
- paid-break toggles or multiple unpaid-break fields;
- copy/print/share controls;
- local-browser calculation and explicit time-zone/DST limitations.

## Canonical / cannibalization decision

Keep this URL narrowly focused on projected clock-out time.

Do not add reverse hours-worked mode:
- `/work-hours-calculator/` owns one-shift duration from known start/end times.
- `/time-card-calculator/` owns variable punch reconstruction and broad time-card/timesheet arithmetic.
- `/weekly-timesheet-calculator/` owns full-week rows/totals.
- `/time-duration-calculator/` owns generic elapsed-time calculation.

A second optional unpaid-break input is allowed because it remains within the exact clock-out planning intent and removes mental addition for users with lunch plus another unpaid break.

## Arithmetic contract

Inputs:
- local clock-in time;
- paid hours, whole number 0–72;
- paid minutes, whole number 0–59;
- primary unpaid break, whole minutes 0–1,440;
- optional additional unpaid break, whole minutes 0–1,440.

Formulas:
- `paidMinutes = paidHours * 60 + paidMinutesRemainder`
- `unpaidBreakMinutes = primaryBreak + additionalBreak`
- `totalSpan = paidMinutes + unpaidBreakMinutes`
- `absoluteFinishMinutes = startMinutes + totalSpan`
- `dayOffset = floor(absoluteFinishMinutes / 1440)`
- `clockOutMinutes = absoluteFinishMinutes mod 1440`

No timezone, DST, payroll rounding, overtime or legal classification is applied.

## Validation contract

- Clock-in time is required and must parse as a valid local HH:MM.
- Paid hours are required, finite, whole and 0–72.
- Paid minutes are required, finite, whole and 0–59.
- Primary unpaid break is required, finite, whole and 0–1,440.
- Additional unpaid break is optional; blank means 0. If supplied it must be finite, whole and 0–1,440.
- Invalid active values remain invalid. They are never silently clamped or converted to zero.
- Any invalid field clears all calculated result values and exposes a field-level error with `aria-invalid=true`.
- Explicit zero values are valid.
- Presets and reset must always populate valid values.

## UX / information gain

- Calculator stays above explanatory content.
- Add a separate optional “Additional unpaid break” field.
- Show total unpaid break as a result metric.
- Keep 12-hour and 24-hour clock-out outputs.
- Keep paid-work duration/decimal display and total time-at-work span.
- Keep “Use current time,” paid-hour presets, break presets, reset and copy.
- Add reproducible Standard, 7h30m and Overnight examples.
- Add field-level validation and live status.
- Preserve browser-local/no-signup behavior.

## Content / semantic architecture

Primary:
- clock out time calculator

Secondary:
- clock out calculator
- what time should I clock out
- what time do I clock out
- clock out time
- clock out calculator with lunch
- 8 hour shift clock out time
- overnight clock out time

Entities / concepts:
- clock-in time
- clock-out time
- paid work target
- unpaid lunch
- additional unpaid break
- paid break
- shift length
- total time at work
- 12-hour time
- 24-hour time
- overnight shift
- next-day clock-out
- local clock arithmetic
- daylight-saving time limitation

## Legal / payroll boundary

The page must not determine whether a break is legally required, paid, unpaid, compensable or correctly recorded. It must not determine overtime eligibility, payroll rounding or wage compliance. Users provide the time target and unpaid-break durations.

## Acceptance criteria

- Existing canonical retained and one H1.
- Primary title/H1 align to clock-out calculator intent.
- Standard example: 08:30 + 8h paid + 30m unpaid = 17:00 / 5:00 PM same day.
- Partial-hour example: 09:00 + 7h30m paid + 0 break = 16:30 / 4:30 PM.
- Overnight example: 22:00 + 8h paid + 0 break = 06:00 next day.
- Multiple-break example: 08:00 + 8h paid + 30m lunch + 15m additional unpaid break = 16:45 / 4:45 PM.
- Blank, negative, decimal-in-whole-number fields and out-of-range values are rejected explicitly.
- Optional additional break blank is valid zero.
- Zero paid hours/minutes/breaks are valid.
- FAQ visible text exactly matches FAQPage schema.
- At least seven useful FAQs.
- No reverse hours-worked, overtime, tax, pay or state-law mode is introduced.
- Shared header/search assets remain unchanged.
- No horizontal overflow at 390px or 1280px.
- JavaScript syntax passes.
- Content-quality audit passes.
- Dedicated HTML/schema/accessibility test passes.
- Dedicated Chromium calculation/UI matrix passes.
- GitHub -> ZT exact parity is verified for changed runtime/test files.
- GitHub Actions remains recorded BLOCKED unless its quota condition materially changes.
- Release requires rollback preservation, merged source, controlled production deployment, public HTTP/canonical/schema/JS/mobile/desktop verification and PROJECT_STATE update.

## Rollback

Preserve the current production copies of:
- `clock-out-time-calculator/index.html`
- `assets/js/clock-out-time.js`

Do not modify unrelated public pages or shared site-shell assets in this release.
