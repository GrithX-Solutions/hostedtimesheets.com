# Homepage Traffic Reprioritization Spec — 2026-10-05

Status: VERIFIED planning / NO PRODUCTION CHANGE

## Objective

Reprioritize the HostedTimesheets homepage around verified U.S. demand, monetizable relevance and canonical ownership after the broad Time Card retarget is live-verified.

This is an internal-link / information-architecture change, not a new-page program.

## Dependency gate

Do not implement this homepage change before:

1. GitHub Actions required Content Quality jobs execute normally.
2. `/time-card-calculator/` has been remediated and retargeted as the broad Time Card & Timesheet owner.
3. The retargeted Time Card page is live-verified.

Reason:

The homepage must not promote future copy/intent that the destination page has not shipped yet.

## Verified priority basis

Recorded in `HOMEPAGE-TRAFFIC-PRIORITY-2026-10-04.md`:

- Time Card Calculator: 201,000 monthly U.S. searches; CPC $5.57.
- Clock Out Time Calculator: 135,000; CPC $4.56; SD 29.
- Work Hours Calculator: 135,000; CPC $2.89.
- Time Duration Calculator: 135,000; SD 34.
- Military Time Converter: 74,000; SD 22.
- Salary Increase Calculator: 33,100; CPC $13.90; SD 16.
- Overtime Calculator: 22,200; CPC $5.83; SD 20.
- PTO Accrual Calculator: 4,400; CPC $9.62; SD 12.
- Timesheet Calculator With Lunch: 2,900; CPC $8.58; SD 50.

The current homepage gives disproportionate prominence to the lunch-specific 2,900-volume page and omits direct homepage links to Clock Out and Military Time.

## Current homepage

Current title:

`Free Timesheet & Work Hours Tools | Hosted Timesheets`

Keep this title unless a fresh SERP test justifies a change.

Current H1:

`Free Timesheet, PTO & Payroll Calculators`

Current featured tool:

`/timesheet-calculator-with-lunch/`

Current Popular Tools includes:

- Timesheet Calculator With Lunch
- Overtime
- Salary to Hourly
- PTO Accrual
- Time Card

Current homepage does not directly link:

- Clock Out Time Calculator
- Military Time Converter

Time Duration appears only deeper in the all-tools panel.

## H1 contract

Change H1 to:

`Free Timesheet, Work Hours & Payroll Calculators`

Reason:

- Work Hours is one of the largest verified clusters.
- The title already includes Work Hours.
- PTO remains represented in navigation/category links and does not need to displace the broader Work Hours entity in the H1.

One H1 only.

Do not add every tool/entity to the H1.

## Featured hero contract

After Time Card retarget release:

Featured title:

`Time Card & Timesheet Calculator`

Destination:

`/time-card-calculator/`

Suggested value line:

`Add weekly clock-in and clock-out times, subtract unpaid breaks, review overtime and estimate gross pay.`

CTA:

`Open Time Card Calculator`

Do not keep the lunch-specific calculator as the primary hero.

Do not feature a destination whose retarget is not yet live.

## Popular Tools contract

Because Time Card is already the featured hero, use Popular Tools to diversify high-priority internal links.

Recommended order:

1. Clock Out Time Calculator
2. Work Hours Calculator
3. Salary Increase Calculator
4. Overtime Calculator
5. Time Duration Calculator
6. Military Time Converter
7. PTO Accrual Calculator if the existing grid remains usable with seven cards

If mobile/card design is materially better with six cards, keep PTO Accrual in its category/all-tools group rather than forcing a seventh first-tier card.

Suggested descriptions:

### Clock Out Time Calculator
`Find when to clock out from your start time, paid-work target and unpaid break.`

### Work Hours Calculator
`Calculate hours between times with break deductions and repeated-day totals.`

### Salary Increase Calculator
`Calculate a pay raise, salary change and new pay equivalents.`

### Overtime Calculator
`Estimate regular hours, overtime hours and gross overtime pay.`

### Time Duration Calculator
`Find the exact duration between two times or date-and-time values.`

### Military Time Converter
`Convert military, 24-hour and AM/PM time with a full reference chart.`

### PTO Accrual Calculator
`Estimate PTO earned, used, carryover and projected balance.`

## Category-card architecture

Use seven clear homepage groups if current responsive grid supports them without crowding.

### Timesheets

Primary link:

`Time Card & Timesheet Calculator` → `/time-card-calculator/`

Specialists remain in all-tools:

- Weekly Timesheet
- Biweekly Timesheet
- Timesheet With Lunch
- Timesheet Pay
- Timesheet Template

### Work Hours

Primary category link:

`Work Hours Calculator` → `/work-hours-calculator/`

Supporting first-tier link:

`Clock Out Time Calculator`

### Time Converters

Primary category link:

`Time Duration Calculator` → `/time-duration-calculator/`

Supporting:

- Military Time Converter
- Hours & Minutes Calculator
- Hours to Decimal / Decimal Hours Calculator
- Minutes to Decimal Hours guide

### Overtime & Payroll

Primary:

`Overtime Calculator`

Supporting:

- Payroll Hours
- Timesheet Pay
- Biweekly Pay

### Salary & Pay

Primary:

`Salary Increase Calculator`

Supporting:

- Hourly Wage
- Salary to Hourly
- Salary + Bonus

### PTO & Time Off

Primary:

`PTO Accrual Calculator`

Supporting:

- PTO by Hours Worked
- Time Off Tracker
- PTO guide

### Guides & Resources

Primary:

`How to Calculate Hours Worked`

Supporting:

- How to Calculate a Time Card
- Lunch Break guide
- Minutes to Decimal Hours
- Timesheet Template
- About / methodology

## All-tools panel contract

Keep every currently valid specialist calculator accessible.

Add missing direct cards for:

- `/clock-out-time-calculator/`
- `/military-time-converter/`

Ensure Time Duration remains present.

Reorder the flat grid into intent clusters where feasible.

Do not remove:

- lunch-specific timesheet;
- weekly split-shift page;
- biweekly page;
- timesheet pay;
- salary-to-hourly;
- PTO specialists.

The homepage change is prioritization, not consolidation.

## Homepage quality-guide corrections

Current “Clock-in and clock-out records” guidance overemphasizes specialist pages.

After Time Card retarget, rewrite hierarchy:

- Broad one-shift-per-day weekly punches → Time Card & Timesheet Calculator.
- Split shifts → Weekly Timesheet Calculator.
- 14-day/two-week → Biweekly Timesheet Calculator.
- Lunch-specific examples → Timesheet Calculator With Lunch Break.
- Planned leave time from clock-in + work target → Clock Out Time Calculator.

Update “Payroll and decimal conversion” anchor to the retargeted Hours to Decimal name after that page ships. Until then, keep the current live label.

## Navigation relationship

Do not bundle a full global-navigation redesign into the homepage PR unless evidence requires it.

Homepage changes should target:

- homepage hero;
- category cards;
- Popular Tools;
- all-tools panel;
- homepage explanatory links.

Global header/footer can be handled separately if needed.

Reason:

Smaller release and rollback surface.

## Internal-link anchor rules

Use intent-specific anchors:

- `Time Card & Timesheet Calculator` → broad owner.
- `Clock Out Time Calculator` → reverse scheduling.
- `Work Hours Calculator` → elapsed work-hour calculation.
- `Time Duration Calculator` → general duration.
- `Military Time Converter` → time notation conversion.
- `Salary Increase Calculator` → raise/pay-increase arithmetic.

Do not use “Timesheet Calculator” indiscriminately for every specialist.

## SEO / crawl acceptance criteria

Homepage HTML must directly contain crawlable links to:

- Time Card
- Clock Out
- Work Hours
- Time Duration
- Military Time
- Salary Increase
- Overtime
- PTO Accrual

One H1 only.

No links to nonexistent URLs.

No JavaScript-only discovery for priority pages.

Canonical remains homepage self-canonical.

## UX / SXO contract

Priority cards must remain usable on mobile.

Requirements:

- no horizontal overflow;
- no tiny multi-column cards;
- CTA targets remain clearly separated from ads;
- card copy stays short enough to scan;
- featured calculator remains above long explanatory content;
- lower-priority tools remain discoverable without excessive scrolling through duplicate cards.

Do not increase ad density around primary CTAs.

## Performance contract

Do not add:

- new frameworks;
- new third-party JS;
- hero background images;
- carousel libraries.

The homepage reprioritization should be HTML/content/order changes using existing CSS where possible.

If adding a seventh category/popular card requires CSS, keep the CSS change minimal and verify mobile LCP/CLS again.

## Structured data

Do not invent special “AI” schema.

Preserve valid Organization/WebSite/WebPage schema.

If the homepage contains an ItemList of tools only after implementation review, use standard Schema.org accurately; otherwise no new schema is required.

## Measurement plan

Do not claim traffic gains from homepage reprioritization alone.

After release, monitor:

- GSC impressions/clicks/CTR/position for priority landing pages;
- homepage → tool navigation if first-party analytics is available;
- Tier-1 landing-page mix;
- AdSense performance without changing ad placement.

Compare before/after periods while accounting for indexation lag and unrelated ranking changes.

## Required pre-release checks

1. Time Card retarget is live and verified.
2. All featured/popular/category destination URLs return HTTP 200.
3. No priority URL is redirected unnecessarily.
4. H1 is exactly one.
5. Clock Out and Military direct homepage links are present.
6. Time Duration has first-tier visibility.
7. Salary Increase appears before Salary to Hourly in priority sections.
8. Lunch-specific Time Sheet page remains discoverable but is not the hero.
9. All-tools inventory still includes every current public calculator.
10. No duplicate/empty card URLs.
11. Content Quality CI PASS.
12. Mobile layout/regression review.
13. Current mobile LCP/CLS recheck after release.
14. Production homepage exactly matches tested GitHub source.
15. Public homepage HTTP 200; priority links resolve.

## Release sequence

Implementation remains BLOCKED while GitHub Actions cannot execute the required gate.

After Actions recovery:

1. Remediate and release Time Card first.
2. Re-read then-current homepage/main to avoid stale patching.
3. Create a separate homepage branch.
4. Change H1.
5. Replace hero destination/copy.
6. Reorder Popular Tools.
7. Add Time Converters category/direct links.
8. Add Clock Out/Military to all-tools.
9. Update homepage guidance links.
10. Run content/link/mobile checks.
11. Require Content Quality CI PASS.
12. Merge exact tested homepage.
13. Deploy with current-origin SHA guard and one rollback copy.
14. Verify public HTTP and every priority link.
15. Re-run performance/mobile checks.
16. Update PROJECT_STATE.

## Rollback unit

Homepage release should primarily be:

- `index.html`
- optional minimal shared CSS only if strictly required

Do not couple calculator runtime changes to homepage rollback.

Time Card, Decimal Hours and Salary Increase calculator changes must remain independent release units.
