# Timesheet Template Remediation Specification — 2026-10-05

Status: IMPLEMENTATION-READY PLANNING ONLY. Do not ship production HTML/JavaScript while the required GitHub Actions Content Quality job still fails before checkout.

## Objective

Strengthen `/timesheet-template/` as the single canonical owner for free, printable, weekly and biweekly timesheet-template intent. Fix the current product/content mismatch, improve browser-native usefulness, and preserve the distinct calculator intent already owned by the weekly and biweekly calculator pages.

This specification does not authorize a production release. The current Actions gate remains authoritative.

## First-party Search Console evidence

Cached Google Search Console data available through the connected Search Console source shows:

- Site impressions increased from 3 on 2026-09-29 to 9 on 2026-09-30, 9 on 2026-10-01 and 41 on 2026-10-02.
- Total for those four dates: 62 impressions, 0 clicks.
- `/timesheet-template/` received 31 impressions, exactly half of the observed site impressions in that period.
- Template-specific queries resolve to `/timesheet-template/`, including:
  - `biweekly timesheet template`: 7 impressions, average position 66.43.
  - `bi-weekly timesheet template`: 6 impressions, average position 64.17.
  - `printable bi weekly time sheets`: 1 impression, average position 52.
  - `free printable weekly timesheet template`: 1 impression, average position 65.
  - `timesheet template bi weekly`: 1 impression, average position 56.
- Calculator-specific queries remain separate:
  - `time calculator biweekly` and `time sheet calculator 2 weeks` resolved to `/biweekly-timesheet-calculator/`, both around position 53.

Conclusion: the available first-party data supports one template owner and separate calculator owners. There is no current GSC evidence that justifies new `/weekly-timesheet-template/` or `/biweekly-timesheet-template/` URLs.

## Sitemap evidence

The repository sitemap and the current public production sitemap each contain 34 URLs.

Search Console's sitemap row currently reports:

- path: `https://hostedtimesheets.com/sitemap.xml`
- submitted URLs: 33
- errors: 0
- warnings: 0
- last submitted: 2026-09-28
- last downloaded: 2026-10-04

The public sitemap itself is healthy and already contains all 34 current canonical URLs. Do not modify a healthy sitemap merely to force Search Console's reported count to change. If a write-capable Search Console path becomes available and the count remains stale, resubmit the existing sitemap rather than changing its contents.

## Ubersuggest U.S. demand

Fresh or currently stored U.S. keyword data:

| Keyword | Monthly volume | CPC | SEO difficulty | Intent |
| --- | ---: | ---: | ---: | --- |
| timesheet template | 4,400 | $5.41 | 50 | mixed/unspecified |
| timesheet template excel | 2,400 | $6.77 | 22 | related template intent |
| timesheet template free | 720 | $5.56 | 29 | related template intent |
| free timesheet template | 590 | $7.82 | 28 | informational |
| weekly timesheet template | 590 | $1.50 | 32 | informational |
| timesheet template biweekly | 480 | $4.28 | 28 | mixed template intent |
| timesheet template bi weekly | 390 | $7.80 | 14 | related template intent |
| biweekly timesheet template | 320 | $10.73 | 26 | informational |
| printable timesheet template | 260 | $4.48 | 26 | transactional |

Low difficulty alone is not a ranking forecast. The generic SERP contains very strong domains, but the long-tail template SERPs also contain lower-authority pages, so the opportunity is not exclusively authority/backlink-driven.

## Current SERP and competitor pattern

Ubersuggest's U.S. SERPs and current competitor review show:

- Generic `timesheet template` is dominated by downloadable/customizable template collections from Microsoft, QuickBooks, Canva, My Hours and similar high-authority sites.
- `free timesheet template` includes image results, an AI Overview and People Also Ask in the current U.S. SERP.
- `biweekly timesheet template` includes Microsoft plus specialist pages such as ClockInEasy (DA 21) and Enerpize (DA 24), showing that lower-authority specialist pages can surface for the long-tail intent.
- Common competitor capabilities include Excel/PDF/Google Sheets or Word downloads, daily dates, time-in/time-out fields, breaks, automatic totals, week-one/week-two subtotals, printable layouts and approval/signature space.
- Strong spreadsheet templates often roll daily entries into weekly or biweekly totals automatically.

HostedTimesheets should not copy competitor files or structures. Its defensible information gain should be an immediate no-signup browser workflow with accurate in-browser calculations, date population, exact totals, print/PDF support and spreadsheet-friendly CSV export.

## Verified current production behavior

Public `/timesheet-template/` returns HTTP 200.

The currently served `/assets/js/timesheet-template.js` matches the repository behavior inspected for this audit:

- Weekly mode renders 7 rows.
- Biweekly mode renders 14 rows.
- Rows contain Day, Clock In, Clock Out, Break Minutes and Hours columns.
- The Hours cell is created as an empty `<td></td>`; no hour calculation is implemented.
- The CSV export therefore writes an empty Hours value for every row.
- `Period Start` is collected as metadata but is not used to populate a date for each daily row.
- The visible table has no Date column even though page copy tells users to record dates.
- Every row defaults to a 30-minute break, including days with no time entry.
- Changing weekly/biweekly mode re-renders the table and discards entered row values.
- No weekly subtotal, week-one/week-two subtotal or biweekly total is shown.

This is a real product/content mismatch, not merely a copy preference. Current page copy describes dates and total hours as part of the template, but the runtime cannot currently produce those row-level values.

## Canonical intent

Keep:

- `/timesheet-template/` — free/printable/weekly/biweekly template owner.
- `/weekly-timesheet-calculator/` — weekly calculation owner.
- `/biweekly-timesheet-calculator/` — two-week calculation owner.
- `/time-card-calculator/` — broad time-card/timesheet calculator synonym owner per the existing architecture decision.

Do not create additional weekly-template or biweekly-template URLs without first-party evidence that the single template owner cannot satisfy those intents.

## Product contract

### 1. Template modes

Retain one control with:

- Weekly: 7 consecutive days.
- Biweekly: 14 consecutive days, grouped visibly as Week 1 and Week 2.

Changing modes must preserve already-entered Week 1 data. If Week 2 data exists and the user temporarily switches to Weekly, retain it in the client-side model so switching back to Biweekly restores it during the same page session.

### 2. Dates

When Period Start contains a valid date:

- Populate an explicit Date value for every row.
- Increment dates by exactly one calendar day.
- Handle month and year boundaries correctly.
- Keep the weekday label synchronized with the actual date rather than assuming the selected start date is Monday.

When Period Start is blank, do not invent dates. The template may show generic Day 1–7 / Day 1–14 labels or the existing weekday structure, but the UI must make clear that row dates are not yet assigned.

### 3. Break input

Do not assume a legally required or universal break.

Future behavior:

- Default break minutes to numeric 0, not 30.
- Allow explicit 0.
- Reject negative values.
- Use whole minutes for this template version.
- State clearly that the user should enter only break time they want excluded from worked time.
- Do not decide whether a break is paid, unpaid or legally required.

### 4. Daily duration calculation

Use integer minutes as the authoritative unit.

For a complete row:

1. Parse clock-in and clock-out.
2. If clock-out is earlier than clock-in, treat the shift as crossing midnight once.
3. If clock-in equals clock-out, mark the row invalid instead of silently assuming zero or 24 hours.
4. Calculate gross shift minutes.
5. Validate break minutes.
6. If break minutes exceed gross shift minutes, mark the row invalid.
7. Net minutes = gross shift minutes - break minutes.

Incomplete rows with only one punch must show a visible validation state and must not contribute to totals.

A fully blank row contributes nothing and should not show an error.

### 5. Visible hours

The visible Hours cell must no longer be blank.

Display a minute-precise duration that is easy to audit, for example `7h 30m`. If a decimal-hours value is also displayed, derive it from exact net minutes and label it explicitly.

Do not sum independently rounded daily decimals to produce period totals. Period totals must sum exact integer net minutes first and only then derive any displayed decimal value.

### 6. Weekly and biweekly totals

Weekly mode:

- Show one weekly total based on exact valid-row net minutes.

Biweekly mode:

- Show Week 1 total.
- Show Week 2 total.
- Show combined biweekly total.

Invalid/incomplete rows must be excluded from totals and must remain visibly flagged so the user cannot mistake the total for a complete record.

### 7. CSV export

CSV must remain browser-generated with no account or upload.

Include:

- Employee
- Company
- Period Start
- Week number in biweekly mode
- Date
- Day
- Clock In
- Clock Out
- Break Minutes
- Net Minutes
- Decimal Hours

Decimal Hours should be derived from exact net minutes with enough precision for spreadsheet use. Net Minutes provides an exact reproducible source value.

Escape commas, quotes and user-entered company/employee text correctly.

Do not label CSV as an XLSX file. Copy may state that CSV opens in Excel, Google Sheets and similar spreadsheet tools.

### 8. Print / PDF

Print output must include:

- Employee and company fields.
- Period start.
- Actual row dates when available.
- Clock entries and breaks.
- Daily hours.
- Weekly/biweekly totals.
- No interactive-only buttons or search/navigation noise.

Browser print-to-PDF is acceptable. Do not claim a dedicated PDF download unless one is actually produced.

### 9. Privacy

All calculation and export behavior must remain client-side. No entered employee, company or time data should be transmitted by the template runtime.

Only make this claim if the implementation remains technically true after release.

## Content / semantic plan

Primary intent: free timesheet template.

Secondary semantic coverage:

- timesheet template
- weekly timesheet template
- biweekly timesheet template
- printable timesheet template
- employee timesheet template
- work timesheet template
- time in / time out
- break minutes
- daily hours
- weekly total
- two-week / biweekly total
- CSV
- Excel / Google Sheets compatibility through CSV
- print / save as PDF
- employee / company / pay period

Avoid exact-match stuffing.

The page should answer the task early: users can fill a weekly or biweekly timesheet in the browser, calculate daily/period hours, print/save PDF, or export CSV without signing up.

Do not claim a native Excel, Google Sheets or Word template download unless that format actually exists.

## Recommended metadata direction

The existing title concept is already aligned:

`Free Timesheet Template — Weekly & Biweekly Printable`

The H1 can be strengthened to:

`Free Timesheet Template (Weekly & Biweekly)`

Final wording remains subject to the content-quality audit and rendered layout check. Do not change metadata before the product behavior and page copy agree.

## Information-gain target

Compared with the majority of static downloadable-template competitors, HostedTimesheets should provide at least these distinct value elements:

1. Immediate browser editing with no signup.
2. Automatic daily and period totals from exact minute arithmetic.
3. Weekly/biweekly switching in one canonical tool.
4. Automatic date population from the chosen period start.
5. Print/PDF plus spreadsheet-friendly CSV from the same entered data.
6. Explicit no-upload browser-side privacy behavior.

## Accessibility and mobile requirements

- Preserve keyboard access for every control.
- Daily validation messages must be associated with the affected row/control.
- Use an accessible status region for total/export feedback where appropriate.
- Never communicate invalid state by color alone.
- Keep the table usable on narrow screens with a deliberate responsive/scroll strategy.
- Touch targets must remain practical.
- Switching modes must not unexpectedly discard existing entered values.
- Print layout must remain legible without horizontal clipping.

## Calculation release tests

Minimum test matrix:

1. Weekly mode renders 7 rows.
2. Biweekly mode renders 14 rows and two visible week groups.
3. Valid period start populates 7/14 consecutive dates.
4. Date sequence crosses month boundary correctly.
5. Date sequence crosses year boundary correctly.
6. Blank period start does not invent dates.
7. 09:00–17:00, break 0 = 8h 00m.
8. 09:00–17:00, break 30 = 7h 30m.
9. 22:00–06:00, break 30 = 7h 30m overnight.
10. Equal clock-in/clock-out is invalid.
11. Only clock-in entered is incomplete/invalid and excluded.
12. Only clock-out entered is incomplete/invalid and excluded.
13. Break greater than gross shift is invalid.
14. Negative break is invalid.
15. Explicit zero break is valid.
16. Weekly total sums exact net minutes.
17. Biweekly Week 1 and Week 2 subtotals sum to the combined total.
18. Invalid rows do not silently contribute zero as if complete.
19. Weekly → Biweekly preserves Week 1 entries.
20. Biweekly → Weekly → Biweekly restores previously entered Week 2 values in-session.
21. CSV contains dates, net minutes and decimal hours for valid rows.
22. CSV correctly escapes quotes/commas in employee/company fields.
23. Printed output contains entered values and totals.
24. Printed output hides interactive-only controls.
25. JavaScript syntax passes.
26. One H1 and self-canonical pass.
27. FAQ schema exactly matches visible FAQ text.
28. Internal links remain valid.
29. Mobile layout passes at representative narrow widths.
30. Content Quality gate executes real steps and passes before merge.

## Release sequencing

Current release order remains constrained by the existing project plan:

1. Recover GitHub Actions runner execution.
2. Run a fresh control that executes real steps.
3. Complete the already-approved Time Card remediation release unless fresher first-party evidence justifies a documented reprioritization.
4. Recheck Search Console query/page data.
5. Implement this Timesheet Template remediation on a fresh branch.
6. Run calculation, content, schema, accessibility, mobile and regression checks.
7. Require Content Quality PASS.
8. Merge/deploy through the verified production method.
9. Verify live HTTP, canonical, runtime behavior, print/CSV, sitemap presence and public asset freshness.
10. Update PROJECT_STATE.md with deployed SHA and live evidence.

No production implementation should be started from the current partial ZT MCP bootstrap workspace until its private-GitHub authentication/bootstrap is corrected.
