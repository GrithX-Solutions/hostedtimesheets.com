# Timesheet Architecture Research — 2026-10-04

Status: VERIFIED research / NO PRODUCTION CHANGE

## Objective

Resolve canonical ownership for the broad U.S. `timesheet calculator` / `time sheet calculator` / `time card calculator` cluster without creating a low-value near-duplicate page or cannibalizing existing specialist calculators.

## U.S. keyword evidence

Ubersuggest, United States, English:

- `time card calculator`: 201,000 monthly searches; CPC $5.57; SD 49.
- `timecard calculator`: 201,000 monthly searches; CPC $4.96; SD 48.
- `time sheet calculator`: 90,500 monthly searches; CPC $4.70; SD 50.
- `timesheet calculator`: 49,500 monthly searches; CPC $3.255; SD 52.
- `timesheet calculator free`: 22,200 monthly searches; CPC $3.32; SD 20.
- `timesheet calculator with lunch break`: 2,900 monthly searches.
- `timesheet calculator with breaks`: 1,900 monthly searches; SD 35.
- `timesheet calculator biweekly`: 1,600 monthly searches; SD 14.
- `biweekly timesheet calculator`: 1,300 monthly searches; CPC $6.31; SD 33.
- `weekly timesheet calculator`: 260 monthly searches.

## SERP intent finding

Fresh/near-current Ubersuggest SERPs show substantial synonym overlap:

- `timesheet calculator` ranks Redcort's Free Timecard Calculator #1 and multiple other Time Card / Work Hours calculators.
- `time card calculator` ranks Redcort #1, TimeCardCalculator.net, Calculator.net, Teambridge, Harvest and other weekly time-card tools.
- `free timesheet calculator` also ranks primarily Time Card calculators.
- `time sheet calculator` has low-authority results, but the product class is still a time-card/timesheet grid rather than a distinct calculator type.

This is not evidence for two separate canonical URLs. It is evidence that Google treats “time card calculator” and “timesheet calculator” as strongly overlapping intents.

## Competitor evidence

Current strong products commonly include:

- daily clock-in / clock-out rows;
- unpaid break deduction;
- weekly and sometimes biweekly modes;
- overtime threshold and optional pay;
- split shifts on some tools;
- 12/24-hour entry on some tools;
- print / CSV / PDF export;
- copy previous day / fill weekdays shortcuts;
- local persistence on some newer tools;
- overnight shift handling.

Authority is mixed:

- Redcort timecard page: PA 47; 5,380 backlinks; 523 referring domains.
- TimeCardCalculator.net: PA 43; 464 backlinks; 266 referring domains.
- TimeCardCalculatorGeek: PA 40; 1,178 backlinks; 385 referring domains.
- Harvest time-sheet calculator: PA 32; 0 backlinks/referring domains in the current Ubersuggest page overview.
- WorkingHoursCalc biweekly page: PA 5; 0 backlinks/referring domains.

The cluster is competitive, but ranking is not exclusively backlink-dependent.

## Current HostedTimesheets cluster

### /time-card-calculator/

Current role:
- weekly punch reconciliation;
- one start/end pair per day;
- unpaid break minutes;
- overnight handling;
- configurable rounding;
- user-supplied overtime threshold + multiplier;
- optional hourly rate/currency;
- print + CSV.

Current title:
`Free Time Card Calculator — Clock In, Out & Breaks`

Current H1:
`Time Card Calculator`

This engine already matches the broad product class Google ranks for both “time card calculator” and “timesheet calculator.”

### /weekly-timesheet-calculator/

Distinct value:
- weekly intent;
- split Shift 1 / Shift 2 per day;
- unpaid break input;
- overtime/pay;
- print + CSV.

### /biweekly-timesheet-calculator/

Distinct value:
- 14 rows / two workweeks;
- weekly overtime is evaluated separately for each week;
- two-week total;
- biweekly-specific explanatory content.

### /timesheet-calculator-with-lunch/

Distinct value:
- lunch-break-specific intent and examples;
- weekly punch grid;
- lunch/unpaid-break semantics.

### /timesheet-pay-calculator/

Distinct value:
- pay-first intent;
- regular/overtime pay decomposition;
- gross-pay methodology.

## Architecture decision

### DO NOT CREATE /timesheet-calculator/ now.

Reason:

A new general page would duplicate /time-card-calculator/ at the exact product and SERP-intent level. That would create avoidable internal competition between two URLs targeting the same broad weekly punch/break/overtime calculator intent.

Instead:

### /time-card-calculator/ becomes the broad canonical owner for:
- time card calculator
- timecard calculator
- timesheet calculator
- time sheet calculator
- timesheet calculator free
- free timesheet calculator
- weekly punch/timecard reconciliation

The URL should remain /time-card-calculator/ because it already exists, is live, is internally linked, and “time card calculator” has the largest verified demand in this synonym cluster.

## Specialist URL ownership

KEEP:

- /weekly-timesheet-calculator/ — split-shift weekly timesheet intent.
- /biweekly-timesheet-calculator/ — two-week / 14-day timesheet intent.
- /timesheet-calculator-with-lunch/ — lunch/break-specific timesheet intent.
- /timesheet-pay-calculator/ — pay-first timesheet intent.
- /time-card-hours-with-lunch-break/ — guide/instruction intent.
- /timesheet-template/ — template intent.

Do not redirect these specialist pages without first-party GSC evidence that Google is treating them as duplicates.

## Recommended Time Card retarget after Actions recovers

Repository/prod changes remain BLOCKED until the required Content Quality workflow can execute normally.

Planned semantic changes to /time-card-calculator/:

- Suggested title:
  `Free Time Card & Timesheet Calculator — Hours, Breaks & Overtime`
- Suggested H1:
  `Time Card & Timesheet Calculator`
- Answer intent early with “weekly time card / timesheet” wording.
- Add natural secondary semantic coverage:
  - timesheet calculator
  - time sheet calculator
  - weekly timesheet
  - work hours
  - clock in / clock out
  - unpaid breaks
  - decimal hours
  - overtime
  - gross pay
- Preserve the canonical URL.
- Do not stuff exact-match variants.

## Recommended product improvements to the broad owner

Keep the general page simpler than the split-shift Weekly specialist, but close real UX gaps:

1. Add incomplete-punch validation.
   - A row with only clock-in or only clock-out should visibly flag an incomplete row instead of silently becoming 0 hours.

2. Add total unpaid-break summary.
   - Useful for checking source records without changing the underlying math.

3. Add a “copy Monday to weekdays” shortcut.
   - Reduces repetitive entry and is common in strong competitors.

4. Keep one shift per day.
   - This preserves a real differentiation from /weekly-timesheet-calculator/, which owns split-shift functionality.

5. Keep configurable rounding.
   - Do not apply rounding unless the user selects it.
   - Continue treating rounding as arithmetic, not legal/compliance advice.

6. Keep overtime threshold/multiplier user-supplied.
   - The tool must not determine overtime eligibility or jurisdictional law.

7. Preserve browser-only/no-signup/privacy positioning.

## Cannibalization rules

Internal links should use intent-specific anchors:

- broad links: “Time Card & Timesheet Calculator” → /time-card-calculator/
- split shifts: “Weekly Timesheet Calculator” → /weekly-timesheet-calculator/
- two weeks: “Biweekly Timesheet Calculator” → /biweekly-timesheet-calculator/
- lunch: “Timesheet Calculator With Lunch Break” → /timesheet-calculator-with-lunch/
- pay: “Timesheet Pay Calculator” → /timesheet-pay-calculator/

Do not make every page target “timesheet calculator” in title/H1.

## Acceptance criteria before retarget release

- GitHub Actions required Content Quality gate executes and passes.
- Existing time-card math is re-tested for zero, normal, overnight, break, rounding, incomplete-input and overtime-threshold cases.
- Any new validation does not silently alter existing correct totals.
- FAQPage schema remains exact with visible FAQ text.
- Canonical remains /time-card-calculator/.
- Specialist titles/H1s keep distinct intent ownership.
- Live page and JS assets return HTTP 200 and exact tested source.
- Mobile rendered QA remains required when an allowed browser path exists.

## Current blocker

GitHub Actions execution is externally BLOCKED before step 1.

Evidence:
- PR #60 run #58 failed twice with zero job steps and no log blob.
- Clean current-main PR #62 run #59 failed identically.
- Control re-run of previously successful Clock Out Content Quality run #48 also failed with zero steps.

Therefore this memo is research-only. No production retarget is authorized until the gate executes normally.


## Read-only pre-retarget Time Card audit

Status: VERIFIED source/math review / NO PRODUCTION CHANGE

Current runtime:
- `assets/js/timesheet-calculator.js`
- one start/end pair per day;
- break minutes deducted from the daily span;
- overnight shifts add 24 hours when end < start;
- daily result is rounded after break deduction;
- weekly overtime/pay are calculated from the rounded daily totals.

### Finding 1 — rounding label/content does not match the implemented operation

The page describes the selector as “Rounding” and the quality guide says the selector controls how the calculator interprets entered times.

The JavaScript does not round clock-in and clock-out punches individually. It first calculates:

`net daily minutes = clock out − clock in − break`

and then rounds that final daily net duration.

These methods can produce materially different results.

Verified example with nearest 15-minute rounding:

- Clock in: 08:07
- Clock out: 17:08
- Unpaid break: 30 minutes
- Current implementation: raw net 511 minutes → rounded daily net = 510 minutes = 8.50 hours.
- Punch-rounding interpretation: 08:07 → 08:00 and 17:08 → 17:15, then subtract 30 minutes = 525 minutes = 8.75 hours.

Difference: 15 minutes.

Remediation decision for the future retarget:
- either explicitly rename/document the current behavior as “Daily worked-time rounding,”
- or implement actual punch rounding before duration calculation.
- Do not claim punch rounding while using daily-total rounding.

### Finding 2 — incomplete punch rows silently become zero

Current behavior:
- start entered, end blank → 0 minutes;
- end entered, start blank → 0 minutes;
- no visible row error is produced.

The editorial content tells users to correct missing punches, but the calculator does not surface the problem.

Required future behavior:
- visibly flag an incomplete row;
- exclude it from totals until complete;
- do not silently present 0.00 as if the row were valid.

### Finding 3 — equal start/end is silently treated as zero

Current `shift()` returns 0 when start equals end.

That may be a valid zero-duration row, but in a time-card context it is also ambiguous with a 24-hour/next-day interpretation and can hide an entry error.

Required future behavior:
- make the interpretation explicit;
- preferred broad-owner behavior: flag equal non-empty punches as ambiguous/invalid rather than silently counting 0, unless an explicit next-day control exists.

### Finding 4 — break longer than the shift silently floors the day to zero

Current behavior:

`Math.max(0, gross minutes − break minutes)`

If the break exceeds the gross shift, the result becomes 0.00 without a visible warning.

Required future behavior:
- flag break > gross shift as invalid;
- do not silently convert an impossible row to zero worked time.

### Finding 5 — two-decimal hours can fail to reproduce gross pay

The calculator displays daily/weekly decimal hours with `toFixed(2)`, but pay uses the exact minute total.

Verified example:

- 08:00 to 16:01, no break = 481 minutes.
- Exact decimal hours = 8.016666...
- Visible hours = 8.02.
- At $25/hour, calculator pay from exact minutes = $200.42.
- Multiplying the visible 8.02 by $25 gives $200.50.

The visible hours therefore do not always reproduce the visible pay.

Required future behavior:
- show at least 4 decimal places where needed, or
- clearly state that pay uses exact minute-derived hours before display rounding;
- CSV should preserve enough precision to reproduce pay.

### Finding 6 — blank overtime settings silently coerce to zero

Current JavaScript uses `Number(value) || 0`.

Verified effects:

- 40 worked hours, hourly rate $25, overtime threshold cleared:
  - threshold becomes 0;
  - all 40 hours become overtime;
  - at 1.5× the gross estimate becomes $1,500 instead of the normal $1,000 result at a 40-hour threshold.

- 45 worked hours, threshold 40, multiplier cleared:
  - multiplier becomes 0;
  - 5 overtime hours remain classified as overtime but contribute $0 overtime pay.

Required future behavior:
- blank threshold/multiplier must not silently become meaningful zero values;
- use explicit validation or a documented disabled/default state;
- retain the boundary that the user supplies the applicable threshold/multiplier.

### Existing behavior that remains valid

- Overnight arithmetic works for shifts shorter than 24 hours when end < start.
- Break values are clamped at zero or above in JavaScript.
- User-supplied overtime threshold and multiplier are separated from legal eligibility.
- Print and CSV use the entered rows/results.
- Exact-minute mode does not round daily totals before weekly aggregation.

## Future retarget release blockers

Before changing /time-card-calculator/ to the broad Time Card + Timesheet owner:

1. Resolve/document rounding semantics.
2. Add incomplete-punch validation.
3. Add break-overrun validation.
4. Resolve equal-punch ambiguity.
5. Make displayed/exported decimal precision reproduce pay, or disclose exact-minute pay math explicitly.
6. Validate blank overtime threshold/multiplier inputs.
7. Re-run normal, overnight, boundary, rounding, incomplete-row, break-overrun and pay-reproducibility tests.
8. Required GitHub Actions Content Quality gate must execute and pass.
