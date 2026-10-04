# Time Card & Timesheet Calculator Remediation Spec — 2026-10-04

Status: VERIFIED planning / NO PRODUCTION CHANGE

## Objective

Retarget `/time-card-calculator/` as the broad canonical owner for the overlapping U.S. time-card/timesheet calculator intent while fixing proven validation, rounding-description and display-precision defects without changing valid arithmetic unnecessarily.

Canonical URL remains:

`https://hostedtimesheets.com/time-card-calculator/`

## Search / architecture basis

Verified U.S. keyword evidence already recorded in `TIMESHEET-ARCHITECTURE-2026-10-04.md`:

- `time card calculator`: 201,000 monthly searches; CPC $5.57; SD 49.
- `timecard calculator`: 201,000; CPC $4.96; SD 48.
- `time sheet calculator`: 90,500; CPC $4.70; SD 50.
- `timesheet calculator`: 49,500; CPC $3.255; SD 52.
- `timesheet calculator free`: 22,200; CPC $3.32; SD 20.

SERP evidence shows these terms substantially resolve to the same weekly punch/time-card product class.

Decision already recorded:

- DO NOT create `/timesheet-calculator/`.
- `/time-card-calculator/` owns the broad Time Card + Timesheet synonym cluster.
- Keep specialist URLs for split-shift weekly, biweekly, lunch-specific and pay-first intents.

## Current source

Current page:

- `time-card-calculator/index.html`
- title: `Free Time Card Calculator — Clock In, Out & Breaks`
- H1: `Time Card Calculator`

Current runtime:

- `assets/js/timesheet-calculator.js`
- one start/end pair per day;
- unpaid break minutes;
- overnight shift handling;
- daily net-duration rounding;
- weekly overtime threshold + multiplier;
- optional pay/currency;
- print + CSV.

## Non-negotiable product boundary

Keep one shift per day on the broad Time Card page.

Do not add split-shift rows here. Split shifts remain a distinguishing feature of `/weekly-timesheet-calculator/`.

The tool performs arithmetic from user inputs. It must not determine:

- overtime eligibility;
- legally required rounding;
- paid/unpaid break status;
- compensable time;
- payroll/tax compliance.

## Formula contract

### 1. Parse daily punches

For each row:

`gross minutes = clock out − clock in`

If clock out is earlier than clock in:

`gross minutes = clock out − clock in + 1,440`

This preserves current overnight behavior for shifts shorter than 24 hours.

### 2. Validate break

`raw net minutes = gross minutes − unpaid break minutes`

A break greater than gross shift duration is invalid. Do not floor an impossible row silently to zero.

### 3. Apply selected rounding

Keep the current implemented rounding sequence:

`rounded daily worked minutes = round(raw net minutes, increment, method)`

Rounding happens after break deduction on the final daily worked duration.

Do not describe this as punch rounding.

UI label should become:

`Daily worked-time rounding`

Supporting text should state that clock-in and clock-out punches are not rounded separately.

### 4. Weekly total

`weekly minutes = sum(valid rounded daily worked minutes)`

Invalid/incomplete rows contribute zero to arithmetic but must remain visibly flagged. The summary must say totals exclude invalid rows.

### 5. Overtime classification

If overtime threshold is valid:

`threshold minutes = threshold hours × 60`

`regular minutes = min(weekly minutes, threshold minutes)`

`overtime minutes = max(0, weekly minutes − threshold minutes)`

The user supplies the threshold. The calculator does not decide whether the threshold applies.

### 6. Gross pay

If hourly rate and overtime multiplier are valid:

`regular pay = regular minutes ÷ 60 × hourly rate`

`overtime pay = overtime minutes ÷ 60 × hourly rate × multiplier`

`gross pay = regular pay + overtime pay`

Use minute-derived values through the calculation. Round only the currency display to cents.

## Row-state contract

Each day must resolve to one of four states.

### EMPTY

Conditions:

- clock in blank;
- clock out blank.

Behavior:

- row is ignored;
- default/entered break value does not create an error by itself;
- worked output shows `0.00`;
- no row error.

### INCOMPLETE

Condition:

- exactly one of clock in / clock out is present.

Behavior:

- set `aria-invalid="true"` on the missing/paired punch controls as appropriate;
- show a visible row message such as `Enter both clock in and clock out.`;
- exclude row from totals;
- weekly summary says invalid rows are excluded.

### AMBIGUOUS EQUAL PUNCHES

Condition:

- both values present;
- clock in equals clock out.

Behavior:

- flag as invalid/ambiguous;
- do not silently treat as zero;
- message: `Clock in and clock out are the same. Enter the intended shift times.`;
- 24-hour shifts are not represented by equal punches on this calculator.

### VALID

Conditions:

- both punches present;
- punches not equal;
- break is valid and does not exceed gross duration.

Behavior:

- compute overnight when end < start;
- subtract break;
- apply selected daily worked-time rounding;
- include result in totals.

## Break-input contract

- Blank break = 0 unpaid minutes.
- Explicit 0 = valid.
- Negative break = invalid; do not silently clamp.
- Non-numeric/invalid browser value = invalid.
- Break > gross shift = invalid.
- Break summary includes valid rows only.

Add a summary metric:

`Total unpaid break`

Display as human time, e.g. `2h 30m`, optionally with total minutes in supporting text.

## Settings validation

### Hourly rate

Treat as optional.

- blank → no pay estimate; display `—` for gross pay;
- explicit 0 → valid $0 rate;
- negative → invalid.

Hours totals must still calculate without a rate.

### Overtime threshold

Required for regular/overtime classification.

- blank → classification unavailable; do not coerce to 0;
- explicit 0 → valid if intentionally entered;
- negative → invalid.

When threshold is blank/invalid:

- Total hours still calculate.
- Regular hours = `—`.
- Overtime hours = `—`.
- Gross pay = `—`.
- Show a settings message.

### Overtime multiplier

Required for gross pay when overtime classification is enabled.

- blank → do not coerce to 0;
- explicit 0 → valid if intentionally entered;
- negative → invalid.

If multiplier is blank but threshold is valid:

- regular/overtime hours may still display;
- gross pay = `—`.

### Rounding controls

- Exact minutes remains the default.
- Increment must be one of the supported selector values.
- Method remains nearest / up / down.
- If increment is Exact minutes, method does not change arithmetic.

## Decimal precision contract

Current two-decimal display is not sufficient to reproduce pay from minute-derived hours.

Future display formatter:

- minimum 2 decimal places;
- maximum 4 decimal places;
- examples:
  - 480 minutes → `8.00`
  - 481 minutes → `8.0167`
  - 510 minutes → `8.50`

Use the same precision rule for:

- daily hours;
- total hours;
- regular hours;
- overtime hours;
- CSV decimal-hour values.

Pay continues to use exact minute-derived values.

### Reproducibility example

08:00–16:01, no break:

- exact = 481 minutes;
- visible = 8.0167 hours;
- at $25/hour → $200.42.

The visible precision now reproduces the cent-rounded pay.

## Copy Monday shortcut

Add:

`Copy Monday to Tue–Fri`

Behavior:

- copy Monday clock-in;
- copy Monday clock-out;
- copy Monday unpaid-break minutes;
- apply only to Tuesday–Friday;
- do not change Saturday/Sunday.

If Monday is empty or invalid:

- do not copy;
- show a short status message.

This shortcut must not introduce split-shift behavior.

## Weekly status / accessibility

Add one calculator-level live status region.

Examples:

- `2 rows need attention. Totals exclude invalid rows.`
- `Overtime threshold is required for regular/overtime totals.`
- `Hourly rate is blank; hours are calculated but pay is not estimated.`

Requirements:

- `aria-live="polite"`;
- row errors remain adjacent to the affected row/input;
- use `aria-invalid` for invalid fields;
- do not rely on color alone.

## CSV contract

Preserve the current download feature, but make the export reproducible.

Recommended columns:

- Day
- Clock In
- Clock Out
- Unpaid Break Minutes
- Worked Minutes
- Decimal Hours
- Status

Add total rows for:

- total worked minutes;
- total decimal hours;
- total unpaid break minutes;
- regular hours if available;
- overtime hours if available;
- estimated gross pay if available.

Invalid rows remain visible in CSV with their status and no fabricated worked-time value.

## Print contract

Print the same validated values visible in the calculator.

Do not hide:

- row validation messages that materially affect totals;
- rounding settings;
- overtime threshold/multiplier;
- total unpaid break;
- precision needed to reproduce totals.

## Semantic retarget

Suggested title:

`Free Time Card & Timesheet Calculator — Hours, Breaks & Overtime`

Suggested H1:

`Time Card & Timesheet Calculator`

Use natural secondary language:

- time card calculator;
- timesheet calculator;
- time sheet calculator;
- weekly time card;
- clock in / clock out;
- unpaid breaks;
- work hours;
- decimal hours;
- overtime;
- estimated gross pay.

Do not exact-match stuff variants.

Answer intent immediately:

`Enter clock-in and clock-out times for each day, subtract unpaid breaks, and total the weekly time card. Optional settings can separate overtime and estimate gross pay.`

## Content corrections

Replace the current misleading statement:

`The rounding selector controls how the calculator interprets entered times.`

with wording that matches the runtime:

`Daily worked-time rounding is applied after the calculator subtracts the unpaid break from each day's elapsed shift. Clock-in and clock-out punches are not rounded separately.`

Add direct explanations for:

- incomplete rows;
- equal punches;
- break-overrun validation;
- blank overtime settings;
- exact-minute pay versus display precision;
- invalid rows being excluded from weekly totals.

FAQ schema must exactly match visible FAQ answers.

## Internal-link ownership

Use broad anchors such as:

`Time Card & Timesheet Calculator` → `/time-card-calculator/`

Keep specialist anchors distinct:

- `Weekly Timesheet Calculator` → split-shift weekly page;
- `Biweekly Timesheet Calculator` → 14-day page;
- `Timesheet Calculator With Lunch Break` → lunch-specific page;
- `Timesheet Pay Calculator` → pay-first page.

Homepage reprioritization should be a separate controlled change after the Time Card retarget is live-verified.

## Required test matrix

### Basic

1. Empty week → 0.00 total, no row errors.
2. Monday 09:00–17:30, 30m break → 480 minutes / 8.00.
3. Five × 8h days → 40.00 hours.

### Overnight

4. 22:00–06:00, 0 break → 480 minutes / 8.00.
5. 22:00–06:00, 30m break → 450 minutes / 7.50.

### Validation

6. Start only → INCOMPLETE; excluded.
7. End only → INCOMPLETE; excluded.
8. 09:00–09:00 → ambiguous invalid; excluded.
9. 09:00–10:00 with 90m break → invalid break overrun; excluded.
10. Negative break via manual DOM/input manipulation → invalid, not silently clamped.

### Rounding

11. 08:07–17:08, 30m break = raw 511m.
    - nearest 15 → 510m / 8.50.
    - up 15 → 525m / 8.75.
    - down 15 → 510m / 8.50.
12. Exact minutes on the same row → 511m / 8.5167.

### Precision / pay

13. 08:00–16:01, no break → 481m / 8.0167.
14. 481m × $25/hour → $200.42.
15. Visible 8.0167 × $25 must reproduce $200.42 after currency rounding.

### Overtime

16. 40h, threshold 40, rate $25, multiplier 1.5 → 40 regular / 0 OT / $1,000.00.
17. 45h, threshold 40, rate $25, multiplier 1.5 → 40 regular / 5 OT / $1,187.50.
18. Blank threshold → total hours available; regular/OT/pay unavailable; no zero coercion.
19. Explicit threshold 0 → all worked minutes classified as OT by user choice.
20. Blank multiplier with overtime present → hours classification available; pay unavailable.
21. Explicit multiplier 0 → valid user-entered value.

### Optional rate

22. Blank hourly rate → hours available; gross pay `—`.
23. Explicit rate 0 → valid $0.00 pay.

### Copy Monday

24. Valid Monday copied to Tue–Fri only.
25. Invalid/empty Monday → no copy + visible status.
26. Saturday/Sunday remain unchanged.

### Export

27. CSV includes enough minute/decimal precision to reproduce pay.
28. Invalid rows retain status and do not export fake 0.00 worked hours as valid.

## Release acceptance criteria

Release remains BLOCKED until GitHub Actions can execute required jobs normally.

When Actions recovers:

1. Create a fresh feature branch from then-current main.
2. Revalidate Ubersuggest/SERP and first-party GSC landing/query data if available.
3. Implement runtime validation before semantic/content changes are merged.
4. Run JS syntax check.
5. Run the full test matrix above.
6. Verify FAQ visible/schema exact parity.
7. Run Content Quality CI and require PASS.
8. Merge tested source.
9. Deploy exact HTML + JS with current-origin SHA guards.
10. Preserve one tested rollback copy.
11. Verify origin/GitHub parity.
12. Verify public page + JS HTTP 200 and edge freshness.
13. Verify canonical/title/H1/schema/internal links.
14. Run desktop/mobile rendered QA when an allowed browser path exists.
15. Update `PROJECT_STATE.md` only after live verification.

## Rollback

Rollback unit:

- `time-card-calculator/index.html`
- `assets/js/timesheet-calculator.js`

If a homepage/internal-link reprioritization ships later, keep that as a separate rollback unit.

Do not roll back specialist calculators when only the broad Time Card owner changes.


## 2026-10-05 pre-implementation revalidation

Status: VERIFIED evidence refresh / IMPLEMENTATION STILL BLOCKED

### GitHub Actions release gate

- Existing Content Quality run #59 was re-run again.
- Re-run request was accepted and job `111511287834` entered the queue.
- The job then completed with conclusion `failure` before checkout; GitHub returned `steps=null`.
- GitHub public status reported Actions operational at the time, so this remains a repository/hosted-runner execution blocker rather than a content-quality failure.
- Production-bound Time Card HTML/JavaScript changes remain unauthorized until a control run executes real steps normally.

### First-party Google Search Console

Verified via the connected Windsor.ai Search Console account:

- Property: `sc-domain:hostedtimesheets.com`.
- Last 28 days, filtered to `/time-card-calculator/`: 0 rows.
- Last 90 days, entire property: 2 query/page rows, 2 impressions total, 0 clicks.
- The two visible rows were:
  - `/how-to-calculate-hours-worked/` for `work out hours worked`: 1 impression, position 83.
  - `/timesheet-template/` for `biweekly timesheet template`: 1 impression, position 66.
- Conclusion: there is not yet enough first-party query/landing-page evidence to overturn the planned canonical ownership. Do not claim current Time Card ranking or traffic from GSC.

### Refreshed Ubersuggest evidence

U.S. metrics remain materially unchanged:

- `time card calculator`: 201,000 monthly searches; CPC $5.57; SD 49.
- `timecard calculator`: 201,000; CPC $4.96; SD 48.
- `time sheet calculator`: 90,500; CPC $4.70; SD 50.
- `timesheet calculator`: 49,500; CPC $3.255; SD 52.
- `timesheet calculator free`: 22,200; CPC $3.32; SD 20.

Current SERP review still resolves the broad Time Card/Timesheet synonyms to the same weekly punch/break/overtime/pay product class. A ranking ShiftFlow page remains a useful low-authority comparator; current Ubersuggest page overview reports PA 18 with 0 backlinks and 0 referring domains.

### Live source-of-truth recheck

Production remains aligned with current main:

- `time-card-calculator/index.html` Git blob: `a165256198cfb22969457c97b47c5a7fc4b4ab0e`.
- `assets/js/timesheet-calculator.js` Git blob: `b2f24b756bf7a7f211d393a7a2f403dbefd132e1`.
- Public Time Card page: HTTP 200.
- Public calculator JavaScript: HTTP 200.

The remediation defects in this specification remain present in the live-matching runtime:

- incomplete punches are silently converted to 0 worked minutes;
- equal punches are silently converted to 0;
- break-overrun is floored to 0 instead of flagged invalid;
- negative break values are silently clamped;
- blank hourly rate, overtime threshold and overtime multiplier are coerced to 0;
- visible decimal hours are fixed to two decimal places;
- current content still says the rounding selector controls how the calculator interprets entered times, while runtime rounding actually applies after break deduction to daily worked duration.

No formula or scope change in this specification is invalidated by the 2026-10-05 revalidation.
