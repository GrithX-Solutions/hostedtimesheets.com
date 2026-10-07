# Hours & Minutes Calculator Remediation Spec — 2026-10-07

## Objective

Remediate `/hours-and-minutes-calculator/` as the canonical calculator for arithmetic on already-known hour-and-minute durations. Preserve one-duration conversion plus two-duration add/subtract; add a multi-duration add/subtract workflow, strict validation, clearer optional rate × time behavior, copyable results and explicit no-FX/no-payroll-policy boundaries.

Do not turn this URL into a clock-in/clock-out duration calculator, reverse decimal-hours converter, timesheet calculator, payroll compliance tool or rounding-policy engine.

## Verified baseline

- GitHub `main` before implementation: `216f7d0c6dbb2bff95053c65b6f20f6df48950ad`.
- Existing runtime supported:
  - convert one H:M duration to total minutes and decimal hours;
  - add two H:M durations;
  - subtract the second H:M duration from the first;
  - optional hourly-rate multiplication;
  - signed negative subtraction results.
- Existing runtime silently converted blank/malformed/negative values to zero and silently clamped minutes to 0–59 and hours to 0–100,000.
- Existing optional hourly-rate field displayed $0.00 when left blank because blank was coerced to zero.
- Existing currency selector changed formatting only but did not explain that it performed no foreign-exchange conversion.
- Live production JS exactly matched GitHub `main`.
- Live production HTML differed from GitHub `main` only in three link labels: live used “Elapsed Time Calculator” while `main` used the current canonical name “Time Duration Calculator.” No production-only calculator behavior was found.

## Fresh U.S. demand evidence

Ubersuggest checked 2026-10-07:

| Query | Volume | CPC | SD | Intent |
| --- | ---: | ---: | ---: | --- |
| hours and minutes calculator | 14,800 | $1.13 | 35 | Informational |
| hours minutes calculator | 14,800 | $4.82 | 34 | Informational |
| time calculator hours minutes | 14,800 | $1.13 | 45 | Informational |
| time addition calculator | 18,100 | $2.11 | 41 | Informational |
| add hours and minutes | 1,900 | $0 | 31 | Informational |
| subtract hours and minutes | 140 | $0 | 40 | Informational |
| hours and minutes to decimal calculator | 110 | $0 | 28 | Informational |
| hours to minutes calculator | 14,800 | $4.82 | 31 | Informational |

No traffic forecast is claimed.

## SERP / competitor evidence

Ubersuggest exact-query SERP snapshot updated 2026-10-03:
- CalculateHours ranks #1.
- CalculatorSoup ranks #2.
- An AI Overview appears in the top results.
- Calculator.net, Timeanddate, ZMI and additional specialist calculators also appear.

Ubersuggest page-level evidence:
- CalculateHours `/Time_Calculator.html`: PA 44, 923 backlinks, 204 referring domains; ranks #1 for the exact query.
- CalculatorSoup Hours and Minutes Calculator: PA 37, 2 backlinks, 2 referring domains in the current Ubersuggest page report; ranks #2 for the exact query.
- HostedTimesheets returned no Ubersuggest page-level ranking data, so current organic traffic/ranking for this URL is UNKNOWN rather than assumed zero.

Current competitor review on 2026-10-07:
- CalculatorSoup exposes several duration rows with add/subtract operations.
- HourTotal supports up to 20 duration rows and mixed +/- arithmetic.
- CalcGallery emphasizes duration-vs-clock-time boundaries plus copy/share utilities.
- yCalculator adds reverse decimal-hours conversion.
- Other specialist tools add seconds, days, or clock-time/date arithmetic.

The defensible gap for HostedTimesheets is a cleaner duration-only workflow with one/two/multi-duration modes, strict invalid-state handling, signed subtraction, exact-minute decimal/pay math, browser-local/no-signup UX, reproducible copy output and explicit ownership boundaries. Reverse decimal conversion is intentionally not copied because `/decimal-hours-calculator/` already owns that conversion intent.

## Semantic map

Primary intent / keyword:
- hours and minutes calculator

Secondary terms:
- hours minutes calculator
- calculate hours and minutes
- add hours and minutes
- subtract hours and minutes
- time addition calculator
- hours to minutes calculator
- total hours and minutes

Long-tail / questions:
- add hours and minutes calculator
- calculator to add hours and minutes
- how to add hours and minutes
- how to subtract hours and minutes
- total multiple durations
- convert hours and minutes to total minutes
- convert hours and minutes to decimal hours
- can a time subtraction result be negative
- rate times hours estimate

Entities / attributes:
- duration
- hour
- minute
- total minutes
- decimal hours
- base-60 arithmetic
- carry / borrow
- addition
- subtraction
- signed result
- hourly rate
- currency formatting

Internal-link ownership:
- `/time-duration-calculator/` — start/end clock-time difference and cross-midnight elapsed duration.
- `/work-hours-calculator/` — work shifts, breaks and worked-time arithmetic.
- `/decimal-hours-calculator/` — bidirectional hours/minutes ↔ decimal-hours conversion.
- `/minutes-to-decimal-hours/` — chart/formula/spreadsheet conversion guide.
- `/payroll-hours-calculator/` — payroll-oriented daily/hour entry workflow.
- `/billable-hours-calculator/` — rate/billing-specific workflow.

## Canonical / cannibalization decision

This URL owns:
- arithmetic on known durations expressed as whole hours + minute portions;
- converting one H:M duration to total minutes and decimal hours;
- adding two durations;
- subtracting one duration from another;
- combining up to 10 known durations with +/− operations;
- optional arithmetic rate × resulting duration;
- signed negative duration results.

Keep separate:
- start time/end time difference, AM/PM and cross-midnight clock logic;
- work-shift break deduction and worked-hours logic;
- reverse decimal-hours-to-H:M input;
- payroll rounding policy, overtime, taxes, billing policy or compensability decisions.

## Arithmetic contract

For one duration:
- total minutes = hours × 60 + minutes;
- decimal hours = total minutes ÷ 60.

Two-duration addition:
- result minutes = first total minutes + second total minutes.

Two-duration subtraction:
- result minutes = first total minutes − second total minutes;
- negative results remain signed.

Multi-duration mode:
- start with first duration minutes;
- apply the selected + or − operation to the second and each additional duration in order;
- support at most 10 total durations.

Normalized display:
- absolute hours = floor(abs(result minutes) ÷ 60);
- remaining minutes = abs(result minutes) mod 60;
- prepend a minus sign when result minutes < 0.

Optional rate × time:
- estimate = (result minutes ÷ 60) × hourly rate;
- use the unrounded minute-derived decimal value;
- blank rate is valid and produces no money estimate;
- a negative result produces a signed arithmetic estimate.

Currency selection changes formatting only and performs no FX conversion.

## Validation contract

Required duration inputs:
- hours are required whole numbers >= 0;
- minutes are required whole numbers from 0 through 59;
- blank, negative, fractional or non-finite required values are invalid;
- values that cannot be represented safely in JavaScript integer-minute arithmetic are invalid;
- explicit zero is valid.

Optional hourly rate:
- blank is valid and produces an em dash for the estimate;
- explicit zero is valid;
- if entered, rate must be finite and >= 0;
- an invalid rate does not invalidate the independent duration result, but the rate × time estimate is suppressed and the rate field is marked invalid.

Invalid required duration fields:
- set `aria-invalid=true`;
- show a visible field error;
- suppress all core duration metrics;
- clear copyable cached result values;
- never silently clamp/coerce to a different valid number.

## UX / information gain

Preserve:
- calculator-first layout;
- convert/add/subtract modes;
- total minutes, decimal hours and H:M outputs;
- signed subtraction;
- optional hourly-rate multiplication;
- currency options;
- copy-minutes and copy-decimal actions.

Add / strengthen:
- multi-duration +/− mode with up to 10 durations;
- add/remove duration controls;
- strict field-level validation;
- optional-rate blank state;
- explicit no-FX language;
- copy full result;
- live status messages for valid, invalid and copy states;
- multi-duration worked example;
- eighth visible/schema-matched FAQ;
- page-local `min-width:0` mobile containment;
- `dateModified` 2026-10-07;
- versioned runtime `/assets/js/hours-minutes.js?v=20261007-remediation1`.

## Payroll / legal boundary

The page performs arithmetic from user inputs only. It does not determine:
- whether time is compensable;
- overtime eligibility or overtime rates;
- payroll rounding rules;
- billing rules;
- tax, withholding or deductions;
- jurisdiction-specific employment obligations.

## Acceptance criteria

- One H1 and self-canonical retained.
- Default convert: 8h 30m => 510 minutes, 8.50 decimal hours, 8h 30m, $212.50 at $25/hour.
- Add default: 8h 30m + 1h 20m => 590 minutes, 9h 50m, 9.8333 decimal hours.
- Subtract default: 8h 30m − 1h 20m => 430 minutes, 7h 10m, 7.1667 decimal hours.
- Negative subtraction: 1h 15m − 2h 00m => −45 minutes, −0.75 decimal hours, −0h 45m.
- Multi example: 7h 45m + 8h 20m + 6h 10m − 0h 30m => 1,305 minutes, 21h 45m, 21.75 decimal hours and $543.75 at $25/hour.
- Multi mode cannot exceed 10 total durations.
- Removing an extra row recalculates correctly and re-enables the add-row control when below the limit.
- Blank hourly rate leaves duration valid and displays no estimate.
- Zero hourly rate is valid and displays zero money.
- Negative/malformed rate marks only the rate invalid while preserving valid duration metrics.
- Currency change preserves all numeric duration/rate inputs and changes money formatting only.
- Blank/negative/fractional hours are invalid.
- Blank/negative/>59/fractional minutes are invalid.
- Second-duration validation applies only when that duration is active.
- Extra-row validation applies only in multi mode.
- Core invalid state suppresses copy of stale minutes/decimal/full-result values.
- Copy minutes, copy decimal and copy full result work for valid duration results.
- FAQ visible text exactly matches FAQPage schema.
- No reverse decimal input, start/end clock input, break deduction, overtime, tax or jurisdiction engine is introduced.
- No horizontal document overflow at 390px or 1280px.
- Runtime exceptions and console errors remain zero.
- Dedicated HTML/schema/accessibility contract PASS.
- Dedicated Chromium calculation/UI matrix PASS.
- Content-quality audit PASS for this page with zero hard failures.
- Exact tested source snapshot parity established before deployment.
- Rollback copies preserved before production write.
- Public HTTP/canonical/schema/versioned JS/render verification PASS.
- PROJECT_STATE and DECISIONS updated before another page starts.
