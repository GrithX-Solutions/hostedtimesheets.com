# How to Calculate Hours Worked Remediation Spec — 2026-10-09

## Objective

Strengthen `/how-to-calculate-hours-worked/` as the canonical explanatory guide for calculating worked time manually and in spreadsheets, without duplicating the interactive `/work-hours-calculator/` intent.

## Fresh demand evidence

Ubersuggest, United States, 2026-10-09:
- `calculate hours worked`: 135,000 monthly searches, $3.14 CPC, SD 29.
- `how to calculate hours worked`: 2,400 monthly searches, $4.18 CPC, SD 35.
- `calculate hours worked with lunch`: 1,600 monthly searches, $7.27 CPC, SD 30.
- `how do i calculate hours worked in excel`: 480 monthly searches, SD 6.
- `how to calculate hours worked on excel`: 390 monthly searches, $0.51 CPC, SD 28.
- `excel formula to calculate hours worked`: 320 monthly searches, SD 27.
- `how to calculate hours worked in google sheets`: 50 monthly searches, SD 28.
- `calculate hours worked between two times`: 20 monthly searches, SD 7.

No traffic or revenue forecast is claimed.

## SERP / competitor evidence

Current Ubersuggest US SERP for `how to calculate hours worked` contains an AI Overview, People Also Ask, video results, Rize at #2, QuickBooks at #7, Factorial at #13, and calculator/time-card pages. The broader `calculate hours worked` SERP is calculator-led, with CalculatorSoup, Redcort, Calculator.net, CalculateHours and ShiftFlow prominent.

Current web review also shows recent pages increasingly include:
- break subtraction;
- overnight shifts;
- weekly totals;
- decimal-hour conversion;
- Excel / Google Sheets formulas;
- calculator CTAs.

Competitor authority is mixed. Ubersuggest reports Rize's ranking page with page authority 29 and 2 backlinks / 2 referring domains, QuickBooks' guide with page authority 50 and 45 backlinks / 19 referring domains, and CalculateHours' time-card page with page authority 43 and 1,109 backlinks / 195 referring domains.

## Canonical / cannibalization boundary

This guide owns:
- manual formula and worked examples;
- minutes-first arithmetic;
- lunch/break subtraction as a user-supplied record rule;
- overnight and split-shift explanation;
- weekly aggregation;
- decimal-hour explanation;
- Excel / Google Sheets formulas;
- common calculation mistakes and audit checks.

It does not become an interactive calculator.
- `/work-hours-calculator/` owns start/end/break interactive shift calculation.
- `/weekly-timesheet-calculator/` owns multi-day time entry.
- `/timesheet-calculator-with-lunch/` owns lunch-specific weekly timesheet calculation.
- `/decimal-hours-calculator/` owns interactive decimal conversion.
- `/payroll-hours-calculator/` owns already-verified duration -> payroll-hour aggregation.
- `/overtime-calculator/` owns user-entered overtime scenarios.
- `/how-to-calculate-time-card/` remains the time-card process guide.

## Formula contract

For one shift:
`net worked time = clock-out - clock-in - excluded break time`

Minutes-first method:
`minutes after midnight = hour × 60 + minutes`
`net worked minutes = adjusted end minutes - start minutes - break minutes`
If an overnight end is earlier than the start, add 1,440 minutes to the end before subtraction.
`decimal hours = net worked minutes / 60`

Spreadsheet contract where A2=start, B2=end, C2=break minutes:
- Decimal hours: `=MOD(B2-A2,1)*24-(C2/60)`
- Duration: `=MOD(B2-A2,1)-(C2/1440)`, formatted as `[h]:mm`
- Weekly decimal total in D2:D8: `=SUM(D2:D8)`

## Reproducible examples

- 8:30 AM to 5:15 PM = 8h45m; minus 30m = 8h15m = 8.25.
- 9:00 AM to 5:30 PM = 8h30m; minus 30m = 8h00m.
- 10:00 PM to 6:00 AM = 8h; minus 30m = 7h30m = 7.50.
- Minutes-first overnight: 22:00 = 1,320; next-day 06:00 = 1,800; 1,800 - 1,320 - 30 = 450m = 7.50h.
- 07:45 to 16:20 = 8h35m; minus 35m = 8h00m.
- Weekly example: 8.25 + 8.00 + 7.75 + 8.50 + 8.00 = 40.50.

## Policy boundary

The guide performs and explains arithmetic from user-supplied records. It does not decide:
- whether a break should be paid or unpaid;
- whether time before/after a shift is compensable;
- how punches should be rounded;
- overtime eligibility or the applicable threshold;
- payroll, tax or employment-law compliance.

Missing or ambiguous punches must not be silently converted into invented times.

## Information gain

1. Adds a transparent minutes-first method that can be audited independently of clock formatting.
2. Adds overnight-safe Excel / Google Sheets formulas with both decimal and duration outputs.
3. Explains the 1,440-minute conversion for break minutes in spreadsheet duration arithmetic.
4. Adds explicit missing/ambiguous punch handling.
5. Adds a 24-hour clock example without conflating clock notation and decimal hours.
6. Aligns 8 visible FAQs exactly with FAQ schema.
7. Preserves calculator/guide canonical ownership to avoid cannibalization.

## Acceptance criteria

- Existing canonical URL and H1 remain unchanged.
- Title remains `How to Calculate Hours Worked (With Breaks & Examples)`.
- Article and WebPage `dateModified` are 2026-10-09.
- Visible update line is October 9, 2026.
- 8 visible FAQs exactly match FAQ schema.
- Excel/Sheets formulas and minutes-first formulas appear exactly.
- All worked examples reproduce the documented arithmetic.
- No interactive calculator form is added.
- Internal links preserve canonical tool ownership.
- Page-only content audit PASS.
- HTML/schema/calculation contract PASS.
- Mobile 390px and desktop 1280px rendered regression PASS with no document-level overflow or browser errors.
- Preserve rollback before merge.
- Verify merged-main blob, active-origin blob and public HTTP/content after release.
