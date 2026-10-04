# Decimal Hours Architecture Research — 2026-10-04

Status: VERIFIED research / NO PRODUCTION CHANGE

## Objective

Clarify canonical ownership and product scope for the decimal-time cluster without creating a duplicate calculator or cannibalizing the existing conversion-chart guide.

## U.S. keyword evidence

Ubersuggest, United States, English:

- `hours to decimal calculator`: 14,800 monthly searches; CPC $8.62; SD 16.
- `time to decimal calculator`: 14,800 monthly searches; CPC $8.62; SD 19.
- `decimal hours calculator`: 12,100 monthly searches; CPC $5.48; SD 46.
- `decimal time calculator`: 3,600 monthly searches; CPC $0.00; SD 21.
- `minutes to decimal calculator`: 1,300 monthly searches; CPC $3.85; SD 41.
- `time clock decimal calculator`: 720 monthly searches; CPC $7.64; SD 26.
- `hours and minutes to decimal`: 720 monthly searches; CPC $7.42; SD 37.
- `minutes to decimal hours`: 170 monthly searches; CPC $0.00; SD 43.

The strongest opportunity is not the exact current phrase “decimal hours calculator.” The lower-difficulty, higher-CPC aliases “hours to decimal calculator” and “time to decimal calculator” have more verified demand.

## SERP intent

Current/fresh SERPs show one interactive calculator class across these phrases:

- CalculatorSoup ranks a Time to Decimal Calculator.
- OnTheClock ranks a minutes/hours-to-decimal converter.
- TimeRewards, TimeClick, Redcort and TimeCalculator.net rank interactive decimal-hour converters.
- The same competitor pages recur across “hours to decimal,” “time to decimal,” and “decimal hours calculator.”

This indicates one canonical calculator should own the interactive conversion cluster.

## Competitor authority / backlink evidence

Ubersuggest page overview:

- TimeRewards decimal converter: PA 23; 1 backlink; 1 referring domain.
- TimeClick hours/minutes-to-decimal calculator: PA 24; 0 backlinks; 0 referring domains.
- Redcort decimal-hours calculator: PA 31; 12 backlinks; 2 referring domains.
- TimeCalculator.net time-to-decimal page: PA 24; 0 backlinks; 0 referring domains.

The opportunity is competitive but not exclusively backlink-driven.

## Current HostedTimesheets ownership

### /decimal-hours-calculator/

Current role:
- interactive hours + minutes → decimal hours;
- total minutes;
- optional hourly-rate pay estimate;
- copy decimal result.

Current title:
`Decimal Hours Calculator — Hours & Minutes to Decimal`

Current H1:
`Decimal Hours Calculator`

Current runtime:
`assets/js/decimal-hours.js`

### /minutes-to-decimal-hours/

Current role:
- editorial conversion chart;
- 1–60 minute reference;
- formula explanation;
- Excel and Google Sheets formulas;
- rounding guidance;
- reverse-conversion explanation;
- no standalone conversion runtime.

Current title:
`Minutes to Decimal Hours Conversion Chart (1–60 Minutes)`

This page is a guide/reference intent, not the primary interactive calculator.

## Architecture decision

### KEEP both URLs.

Do not merge or redirect the guide into the calculator.

Canonical ownership:

### /decimal-hours-calculator/
Own:
- hours to decimal calculator;
- time to decimal calculator;
- decimal hours calculator;
- decimal time calculator;
- hours and minutes to decimal;
- interactive time ↔ decimal conversion.

### /minutes-to-decimal-hours/
Own:
- minutes to decimal hours chart;
- minute-by-minute reference;
- spreadsheet formulas;
- explanation of minute/decimal equivalence;
- informational conversion-guide intent.

Do not make the guide title/H1 target the broad interactive calculator phrases.

## Verified current runtime issues

### 1. Invalid minutes are silently clamped

Current JavaScript:

`Math.min(59, Math.max(0, Number(minutes) || 0))`

The visible input has min=0 and max=59, but a value over 59 is silently converted to 59 in calculation rather than producing an invalid state.

A negative value is likewise silently coerced to 0.

Required future behavior:
- validate minutes explicitly as an integer from 0 through 59;
- show a visible error for invalid values;
- do not silently rewrite the user’s intended value.

### 2. Displayed decimal hours can fail to reproduce displayed pay

Current runtime computes pay from the exact decimal value but displays only two decimal places.

Verified example:

- 8 hours 1 minute = 481 minutes.
- Exact decimal = 8.016666...
- Displayed decimal = 8.02.
- At $25/hour, exact-minute pay = $200.42.
- 8.02 × $25 = $200.50.

The visible decimal result therefore cannot always reproduce the visible pay.

Required future behavior:
- retain exact source time for pay;
- expose sufficient precision (prefer selectable 2/3/4 decimals and a 4-place formula/result);
- explain that pay uses unrounded source duration;
- preferably show the pay formula from exact minutes, e.g. `481 ÷ 60 × $25 = $200.42`.

### 3. The calculator is one-way while the SERP product class is increasingly two-way

Current calculator only supports:
- hours + minutes → decimal.

Current competitors commonly support:
- time → decimal;
- decimal → hours/minutes;
- often seconds;
- selectable precision;
- copy/export.

Required future product gap:
- add Decimal → Hours/Minutes conversion to the same canonical calculator;
- keep the guide as the static chart/reference resource.

### 4. Seconds are absent

Several current competitors support seconds and the mathematically complete formula:

`decimal hours = hours + minutes/60 + seconds/3600`

Adding seconds provides real information gain and avoids forcing users to discard sub-minute precision.

Required future behavior:
- optional seconds field;
- integer 0–59 validation;
- exact calculation using seconds/3600.

### 5. Precision is fixed at two decimals

Current result always uses `toFixed(2)`.

This is convenient for common display, but some minute values repeat in decimal form and the site's own guide advises keeping more precision during intermediate calculations.

Required future behavior:
- precision selector: 2, 3 or 4 decimal places;
- underlying calculation remains unrounded;
- changing precision changes display only.

### 6. “Optional” hourly rate is prefilled

The input label says “Hourly rate (optional)” but defaults to 25, causing a default pay result to appear before the user supplies a rate.

This is not a calculation defect, but it is avoidable assumption/UX noise.

Preferred future behavior:
- leave optional rate blank, or clearly label the prefilled value as an example;
- when blank, show pay as “—” rather than treating the empty value as $0.

## Competitor feature gap

Current strong/new competitors commonly include combinations of:

- two-way conversion;
- seconds;
- precision selector;
- total minutes / total seconds;
- copy result;
- quick presets;
- batch conversion;
- CSV/PDF export;
- minute conversion chart.

HostedTimesheets should not copy every feature.

Recommended differentiated scope:

1. Two-way Time ↔ Decimal conversion.
2. Hours, minutes and optional seconds.
3. Selectable 2/3/4-place display precision.
4. Exact total minutes and total seconds.
5. Copy result.
6. Optional pay estimate using exact source duration.
7. Clear formula and exact-value disclosure.
8. Link to the dedicated 1–60 minute chart guide instead of duplicating the full chart on the calculator.

Avoid batch conversion in the first release unless real keyword/user evidence supports it.

## Future semantic retarget

Keep the URL:
`/decimal-hours-calculator/`

Suggested title:
`Hours to Decimal Calculator — Time to Decimal Hours`

Alternative if editorial testing prefers the existing noun:
`Decimal Hours Calculator — Convert Time to Decimal Hours`

Suggested H1:
`Hours to Decimal Calculator`

Support naturally:
- time to decimal;
- decimal hours;
- decimal time;
- hours and minutes to decimal;
- payroll decimal hours;
- timesheet decimal conversion.

Do not repeat exact-match phrases mechanically.

## Internal-link ownership

Use:
- “Hours to Decimal Calculator” / “Decimal Hours Calculator” → /decimal-hours-calculator/
- “Minutes to Decimal Hours Chart” → /minutes-to-decimal-hours/

The guide should link prominently to the calculator for instant conversion.
The calculator should link to the guide for the complete 1–60 minute chart and spreadsheet formulas.

## Calculation specification for future implementation

### Time → Decimal

Inputs:
- hours: integer >= 0; totals above 24 hours allowed;
- minutes: integer 0–59;
- seconds: integer 0–59;
- display precision: 2, 3 or 4 places;
- optional hourly rate >= 0.

Formula:

`totalSeconds = hours × 3600 + minutes × 60 + seconds`

`decimalHoursExact = totalSeconds ÷ 3600`

Display rounding occurs only after the exact value is calculated.

Optional pay:

`estimatedPay = decimalHoursExact × hourlyRate`

### Decimal → Time

Input:
- decimal hours >= 0.

Preferred output:
- whole hours;
- remaining minutes;
- remaining seconds;
- total minutes;
- total seconds.

Conversion should define the seconds-rounding rule explicitly, preferably nearest whole second.

## Release tests

Before production release:

- 0h 0m 0s → 0.00.
- 8h 30m → 8.50.
- 8h 1m → 8.0167 at 4 places.
- 7h 45m 30s → 7.7583 at 4 places.
- 59 minutes accepted.
- 60 minutes rejected, not clamped.
- negative minutes rejected, not clamped.
- 59 seconds accepted.
- 60 seconds rejected.
- totals above 24 hours supported.
- 7.75 decimal → 7h 45m.
- 8.016666... decimal round-trip defined to nearest second.
- pay from 8h 1m at $25 = $200.42 from exact time.
- blank optional rate does not produce a misleading pay value.
- selected precision changes display only, not pay or reverse conversion math.

## SEO / cannibalization acceptance criteria

- canonical remains /decimal-hours-calculator/;
- no new decimal-time calculator URL;
- /minutes-to-decimal-hours/ remains a guide/chart;
- title/H1 changes do not cause both URLs to target the same primary phrase;
- calculator links to chart guide;
- guide links to calculator;
- examples reproduce actual runtime output;
- FAQ schema exactly matches visible FAQ if FAQ schema is present.

## Current blocker

No calculator/HTML implementation is authorized while GitHub Actions cannot execute the required Content Quality job.

Evidence remains:
- PR #60 run #58 failed twice before step 1;
- clean PR #62 run #59 failed repeatedly before step 1;
- control re-run of previously successful run #48 also failed before step 1.

This document is research and release planning only.
