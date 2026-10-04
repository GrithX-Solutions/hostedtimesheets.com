# Decimal Hours Calculator Remediation Spec — 2026-10-05

Status: VERIFIED planning / NO PRODUCTION CHANGE

## Objective

Retarget `/decimal-hours-calculator/` around the higher-demand `hours to decimal calculator` / `time to decimal calculator` intent and upgrade the existing one-way converter into a precise two-way Time ↔ Decimal calculator without cannibalizing the separate `/minutes-to-decimal-hours/` chart/guide.

Canonical URL remains:

`https://hostedtimesheets.com/decimal-hours-calculator/`

## Search / architecture basis

Verified U.S. keyword evidence is recorded in `DECIMAL-HOURS-ARCHITECTURE-2026-10-04.md`:

- `hours to decimal calculator`: 14,800 monthly searches; CPC $8.62; SD 16.
- `time to decimal calculator`: 14,800; CPC $8.62; SD 19.
- `decimal hours calculator`: 12,100; CPC $5.48; SD 46.
- `decimal time calculator`: 3,600; SD 21.
- `minutes to decimal calculator`: 1,300; CPC $3.85; SD 41.

SERP review shows one interactive conversion product class across these terms.

Architecture decision:

- KEEP `/decimal-hours-calculator/` as the interactive canonical owner.
- KEEP `/minutes-to-decimal-hours/` as the static chart/formula/reference guide.
- Do not create another decimal-time calculator URL.

## Current source

Current page:

- `decimal-hours-calculator/index.html`
- title: `Decimal Hours Calculator — Hours & Minutes to Decimal`
- H1: `Decimal Hours Calculator`

Current runtime:

- `assets/js/decimal-hours.js`

Verified current runtime behavior:

- hours + minutes → decimal only;
- minutes are silently clamped to 0–59;
- no seconds;
- decimal result always displays 2 places;
- pay uses the exact unrounded decimal value;
- optional hourly rate is prefilled with 25;
- blank/invalid rate silently becomes zero.

## Product boundary

This calculator owns interactive conversion between:

- whole hours + minutes + optional seconds;
- decimal hours.

It may estimate pay from an optional hourly rate.

It does not:

- calculate clock-in/clock-out durations;
- decide payroll rounding policy;
- determine overtime;
- perform time-zone conversion;
- replace the minute chart/reference guide.

Use `/time-duration-calculator/` for start/end elapsed time.
Use `/minutes-to-decimal-hours/` for the 1–60 minute chart and spreadsheet formulas.

## Mode contract

Add a mode selector:

1. `Time → Decimal`
2. `Decimal → Time`

Mode switching:

- hides the inactive input group;
- preserves values already entered in both modes;
- recalculates immediately;
- does not overwrite the other mode's inputs.

## Time → Decimal input contract

### Whole hours

- integer;
- minimum 0;
- totals above 24 hours are allowed;
- blank = 0;
- negative = invalid;
- fractional whole-hours input = invalid.

Label:

`Whole hours`

### Minutes

- integer 0–59;
- blank = 0;
- 59 accepted;
- 60 rejected;
- negative rejected;
- fractional minutes rejected.

Do not clamp invalid values.

### Seconds

- optional integer 0–59;
- blank = 0;
- 59 accepted;
- 60 rejected;
- negative rejected;
- fractional seconds rejected.

### Precision

Selector values:

- 2 decimal places;
- 3 decimal places;
- 4 decimal places.

Default:

`4 decimal places`

Precision changes display/copy formatting only. It never changes the underlying exact value, pay, total seconds or reverse-conversion math.

### Optional hourly rate

- blank = no pay estimate;
- explicit 0 = valid;
- finite number >= 0;
- negative = invalid.

When blank:

`Estimated pay = —`

Do not prefill an example rate in the default calculator state.

## Time → Decimal formula contract

`totalSeconds = hours × 3600 + minutes × 60 + seconds`

`decimalHoursExact = totalSeconds ÷ 3600`

`totalMinutesExact = totalSeconds ÷ 60`

Display:

- primary decimal result at selected precision;
- total minutes with enough precision to preserve seconds;
- total seconds as an integer;
- normalized `Hh Mm Ss` duration.

Example:

8h 1m 0s:

- total seconds = 28,860;
- exact decimal = 8.016666…;
- 4-place display = 8.0167.

Formula line should expose the unrounded source relationship, for example:

`28,860 ÷ 3,600 = 8.016666… hours → 8.0167 at 4 places`

## Decimal → Time input contract

### Decimal hours

- finite number >= 0;
- blank = invalid / no result;
- negative = invalid;
- totals above 24 are allowed.

Conversion:

`exactSeconds = decimalHours × 3600`

Normalize to the nearest whole second:

`roundedSeconds = round(exactSeconds)`

`hours = floor(roundedSeconds ÷ 3600)`

`remainingSeconds = roundedSeconds mod 3600`

`minutes = floor(remainingSeconds ÷ 60)`

`seconds = remainingSeconds mod 60`

Outputs:

- normalized hours/minutes/seconds;
- total seconds;
- total minutes;
- original decimal input.

The nearest-second rule must be visible in methodology text.

## Pay contract

Hourly rate remains optional.

### Time → Decimal mode

`estimatedPay = decimalHoursExact × hourlyRate`

Use the exact unrounded time value.

### Decimal → Time mode

`estimatedPay = decimalInput × hourlyRate`

Use the exact decimal input, not the nearest-second display conversion.

This preserves the user's source value.

If rate is blank:

- do not show $0.00;
- show `—`.

Currency rounding occurs only at the final money display.

## Validation / accessibility

Add one calculator-level status region:

- `aria-live="polite"`.

Invalid fields:

- use `aria-invalid="true"`;
- show adjacent text;
- do not rely on color alone;
- suppress derived outputs that depend on the invalid field.

Examples:

- `Minutes must be a whole number from 0 to 59.`
- `Seconds must be a whole number from 0 to 59.`
- `Decimal hours must be zero or greater.`
- `Hourly rate must be zero or greater.`

Do not rewrite/clamp the user's invalid value.

## Display precision contract

Primary decimal result:

- exactly 2 / 3 / 4 places according to selector.

Supporting exact value:

- formula text may show up to 6 decimal places or a repeating ellipsis;
- internal calculation remains unrounded.

Examples:

- 480 minutes → 8.0000 at 4-place mode;
- 481 minutes → 8.0167;
- 510 minutes → 8.5000.

If editorial/UI review prefers trimmed trailing zeroes in supporting text, the main precision-selected result must still honor the selected fixed place count.

## Copy behavior

Primary copy button is mode-aware.

### Time → Decimal

Copy the decimal result at selected precision.

### Decimal → Time

Copy normalized time:

`7h 45m 0s`

Optional second copy action:

`Copy full result`

May include decimal, normalized time, total minutes and total seconds.

Do not add CSV/batch conversion in the first release without new demand evidence.

## Quick examples

Add lightweight example buttons only if they fit existing mobile layout without crowding:

Time → Decimal:

- 8h 30m
- 7h 45m
- 8h 1m

Decimal → Time:

- 7.75
- 8.5

These are conveniences, not new calculator modes.

## Semantic retarget

Preferred title:

`Hours to Decimal Calculator — Time to Decimal Hours`

Preferred H1:

`Hours to Decimal Calculator`

Natural secondary semantic coverage:

- time to decimal;
- decimal hours;
- decimal time;
- hours and minutes to decimal;
- hours minutes seconds to decimal;
- payroll decimal hours;
- timesheet decimal conversion.

Do not mechanically repeat keyword variants.

Suggested early answer:

`Convert hours, minutes and seconds to decimal hours, or convert decimal hours back to hours, minutes and seconds. Choose 2, 3 or 4 decimal places and optionally estimate pay from the exact unrounded time.`

## Content / methodology corrections

Explain:

- 60 minutes = 1 hour;
- minutes are divided by 60;
- seconds are divided by 3,600;
- display precision does not alter the exact source value;
- pay uses exact unrounded source time;
- reverse conversion rounds to the nearest whole second;
- payroll systems may apply separate rounding policies not chosen by this calculator.

Add direct links:

- calculator → `/minutes-to-decimal-hours/` for the full chart and spreadsheet formulas;
- guide → calculator with an interactive-conversion anchor.

The guide's primary title/H1 must remain chart/reference-focused.

## FAQ scope

FAQ should answer real conversion questions such as:

- How do I convert hours and minutes to decimal hours?
- Is 30 minutes 0.30 hours?
- Can I include seconds?
- How do I convert decimal hours back to time?
- Why does pay use more precision than the displayed decimal?
- Does this calculator apply payroll rounding?

FAQPage schema must exactly match visible FAQ text.

## Required test matrix

### Time → Decimal basics

1. 0h 0m 0s → 0.0000.
2. 8h 30m 0s → 8.5000.
3. 8h 1m 0s → 8.0167 at 4 places.
4. 7h 45m 30s → 7.7583 at 4 places.
5. 30h 0m 0s → 30.0000.

### Input validation

6. 59 minutes → accepted.
7. 60 minutes → invalid, not clamped.
8. -1 minute → invalid, not clamped.
9. 1.5 minutes → invalid.
10. 59 seconds → accepted.
11. 60 seconds → invalid.
12. -1 second → invalid.
13. fractional whole-hours input → invalid.
14. negative hours → invalid.

### Precision

15. 8h 1m at 2 places → 8.02.
16. Same source at 3 places → 8.017.
17. Same source at 4 places → 8.0167.
18. Changing precision does not change total seconds or pay.

### Decimal → Time

19. 7.75 → 7h 45m 0s.
20. 8.5 → 8h 30m 0s.
21. 8.0166666667 → 8h 1m 0s after nearest-second normalization.
22. 0 → 0h 0m 0s.
23. 30.25 → 30h 15m 0s.
24. negative decimal → invalid.

### Pay

25. 8h 1m at $25/hour → $200.42 from exact time.
26. Visible 4-place result 8.0167 is consistent with $200.42 after cent rounding.
27. Blank rate → pay `—`.
28. Explicit rate 0 → valid $0.00.
29. Decimal → Time mode uses exact decimal input for pay.

### Mode / copy

30. Switching modes preserves entered values.
31. Time → Decimal copy honors selected precision.
32. Decimal → Time copy returns normalized H/M/S.

### Cannibalization / SEO

33. Canonical remains `/decimal-hours-calculator/`.
34. `/minutes-to-decimal-hours/` remains indexable and chart-focused.
35. Calculator and guide cross-link with distinct anchors.
36. Examples in visible content reproduce runtime output exactly.

## Release sequence

Implementation remains BLOCKED until GitHub Actions executes required jobs normally.

After recovery:

1. Create fresh feature branch from then-current main.
2. Revalidate current SERP and GSC query/landing-page evidence if available.
3. Implement runtime validation and two-way math first.
4. Run JS syntax check.
5. Run the full test matrix.
6. Retarget title/H1/content only after runtime behavior is stable.
7. Verify FAQ visible/schema parity.
8. Require Content Quality CI PASS.
9. Merge exact tested branch.
10. Deploy HTML + JS with current-origin SHA guards.
11. Preserve one tested rollback copy.
12. Verify origin/GitHub parity.
13. Verify public page + JS HTTP 200 and edge freshness.
14. Verify calculator ↔ guide internal links.
15. Run rendered mobile/desktop QA when an allowed browser path exists.
16. Update `PROJECT_STATE.md` after live verification.

## Rollback unit

- `decimal-hours-calculator/index.html`
- `assets/js/decimal-hours.js`

If the guide cross-link changes in the same release, preserve its prior HTML separately.

Do not alter or redirect `/minutes-to-decimal-hours/` as part of calculator rollback.
