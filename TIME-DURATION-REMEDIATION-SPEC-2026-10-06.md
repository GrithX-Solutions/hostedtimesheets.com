# Time Duration Calculator Remediation Spec — 2026-10-06

## Objective

Remediate `/time-duration-calculator/` as the canonical owner for time-duration / elapsed-time / hours-between-two-times intent. Preserve the existing two-mode product (Time only and Date & time), second precision, overnight handling and optional break deduction. Close silent-input coercion and validation gaps, strengthen result usefulness, and preserve the retired `/elapsed-time-calculator/` redirect.

## Verified source baseline

- GitHub `main`: `fe0dbf451616b769140ff55b5f3425922c4142fc`.
- Canonical URL: `https://hostedtimesheets.com/time-duration-calculator/`.
- Retired `/elapsed-time-calculator/` is already consolidated here and must remain a permanent redirect.
- Current runtime supports Time only and Date & time modes, seconds, overnight spans, optional break deduction, Start/End = now, Swap, one overnight example, reset, gross duration, decimal hours, total minutes/seconds and net duration.
- Current runtime silently coerces blank/negative break values to zero through numeric fallback/clamping.
- Current Date & time mode silently repopulates a cleared date with today because mode synchronization runs on every calculation. Cleared required dates therefore cannot surface as invalid.
- Current UI has status text but no field-level error contract or `aria-invalid` state.

## Fresh demand evidence

Ubersuggest U.S. checked 2026-10-06:

| Query | Volume | CPC | SD |
| --- | ---: | ---: | ---: |
| time duration calculator | 135,000 | $0 | 34 |
| elapsed time calculator | 12,100 | $0 | 16 |
| time difference calculator | 18,100 | $0 | 71 |
| date time duration calculator | 135,000 reported | $0 | 34 |
| hours between two times | 2,400 | $0 | 30 |
| time calculator with break | 1,300 | $3.46 | 35 |

The date-time query has unusually volatile monthly data and is not used as a traffic forecast.

Ubersuggest primary SERP evidence:
- CalcShelf position 1, DA 10, PA 14, 0 backlinks / 0 referring domains.
- NGE Tools position 3, DA 3, PA 8, 0 backlinks / 0 referring domains.
- ToolQix position 4, DA 1 / PA 8.
- Additional first-page specialist domains have DA 1–6.

This is opportunity evidence, not a ranking guarantee.

## Current public competitor evidence

Fresh public review on 2026-10-06 shows common capabilities:
- time-only and date+time spans;
- seconds precision;
- overnight handling;
- break deduction;
- start/end now controls and swap;
- total unit outputs;
- copy/share controls;
- some tools expand into timezone/DST, add/subtract, countdown, payroll rounding or multi-interval timesheets.

## Canonical / cannibalization decision

This URL owns:
- time duration calculator;
- elapsed time calculator;
- duration between two times;
- hours between two times;
- date/time duration between endpoints.

Keep separate:
- `/hours-and-minutes-calculator/` — add/subtract already-known durations.
- `/work-hours-calculator/` — repeated work-shift pattern and optional pay.
- `/clock-out-time-calculator/` — projected finish time.
- `/time-card-calculator/` and weekly timesheets — punch/timesheet workflows.
- timezone / UTC / DST-aware elapsed time — not added here.
- multi-interval timesheet summing — not added here.

## Arithmetic contract

### Time only

- Parse start/end as local wall-clock seconds from 00:00:00 through 23:59:59.
- `gross = endSeconds - startSeconds`.
- If gross < 0, add exactly 86,400 seconds and label the end as next day.
- If start == end, gross = 0. Do not infer 24 hours.

### Date & time

- Parse each date strictly as a real `YYYY-MM-DD` calendar date.
- Combine day-number difference with clock-second difference.
- If end date/time is earlier than start date/time, reject it. Do not silently reverse endpoints.
- Equal endpoints produce zero duration.

### Break

- Optional break minutes must be blank or a finite, safe, whole number >= 0.
- Blank means zero.
- Negative or fractional break minutes are invalid; never clamp them silently.
- `breakSeconds = breakMinutes * 60`.
- `net = max(0, gross - breakSeconds)`.
- Break longer than gross keeps gross visible and floors net at zero.

## Output contract

Show:
- formatted gross duration;
- gross decimal hours;
- total days as decimal;
- total minutes;
- total seconds;
- net duration after break;
- net decimal hours;
- formula/status;
- copyable summary.

## Validation / accessibility contract

- Start time and end time are required and valid.
- In Date & time mode, both dates are required and must be real calendar dates.
- A date cleared after mode initialization remains blank and invalid; it must not silently reset to today.
- Break blank is valid zero; malformed, negative or fractional break is invalid.
- Invalid active fields set `aria-invalid=true`, display field-level errors, clear result metrics and disable meaningful copy output.
- Valid fields clear their errors.
- Status uses `role=status` / `aria-live`.

## UX / information gain

Preserve:
- two modes;
- second precision;
- overnight auto-next-day behavior in Time only;
- date-aware multi-day mode;
- gross and net separation;
- Start = now / End = now / Swap / Reset.

Add / strengthen:
- explicit validation;
- separate overnight and multi-day reproducible examples;
- total-days result;
- Copy result action;
- clear same-start/end = zero explanation;
- explicit local-clock / no timezone-DST boundary;
- current freshness date 2026-10-06.

## SEO/content architecture

Primary:
- time duration calculator

Secondary:
- elapsed time calculator
- time between two times
- hours between two times
- time difference calculator
- date time duration calculator
- time calculator with break

Entities / concepts:
- start time
- end time
- start date
- end date
- elapsed time
- duration
- overnight
- next day
- seconds
- decimal hours
- total minutes
- total seconds
- total days
- break deduction
- gross duration
- net duration
- local clock arithmetic
- DST/timezone limitation

## Acceptance criteria

- One H1 and self-canonical retained.
- Existing retired `/elapsed-time-calculator/` remains one-hop permanent redirect to this canonical over HTTPS.
- Standard: 09:00:00 -> 17:30:00 = 8h30m / 8.50h / 510m / 30,600s / 0.3542 days.
- Seconds: 13:20:15 -> 17:05:45 = 3h45m30s / 3.7583h / 225.50m / 13,530s.
- Overnight: 22:00:00 -> 06:00:00 = 8h, next-day status.
- Same start/end = 0.
- Break: 09:00 -> 17:30, 30m break => 8h gross / 8h net? Correct expected gross is 8h30m and net 8h.
- Break > gross floors net to zero.
- Date mode: 2026-10-04 09:15 -> 2026-10-06 12:45 = 2d3h30m / 51.50h.
- Leap-day span is calculated from actual calendar dates.
- Earlier date/time is rejected.
- Cleared date in Date & time mode remains invalid, not auto-filled.
- Blank break valid; negative/fractional break invalid.
- Copy action returns a reproducible summary for valid results and is suppressed on invalid input.
- FAQ visible text exactly matches FAQPage schema.
- At least seven useful FAQs.
- No timezone/UTC/DST calculator, payroll rounding, add/subtract duration mode, countdown or multi-interval timesheet mode is introduced.
- No horizontal overflow at 390px or 1280px.
- JS syntax PASS.
- Content-quality PASS.
- Dedicated HTML/schema/accessibility test PASS.
- Dedicated Chromium calculation/UI matrix PASS.
- GitHub -> ZT exact parity verified for changed runtime/test files.
- Rollback preserved before production writes.
- Public HTTP/canonical/schema/versioned JS/mobile/desktop/redirect verification PASS.
- GitHub Actions recorded BLOCKED unless it actually executes.
- PROJECT_STATE updated before another page starts.

## Rollback

Preserve pre-release production copies of:
- `time-duration-calculator/index.html`
- `assets/js/time-duration.js`

Do not alter the persistent elapsed-time redirect unless verification proves it broken.
Do not modify unrelated public pages or shared site-shell assets.
