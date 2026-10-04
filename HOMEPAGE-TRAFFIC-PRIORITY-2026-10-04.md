# Homepage Traffic Priority Research — 2026-10-04

Status: VERIFIED research / NO PRODUCTION CHANGE

## Objective

Reprioritize homepage prominence and internal links around verified U.S. search demand, monetizable relevance, ranking difficulty and current canonical ownership without creating new duplicate URLs.

## Current homepage finding

Current homepage title:
`Free Timesheet & Work Hours Tools | Hosted Timesheets`

Current H1:
`Free Timesheet, PTO & Payroll Calculators`

Current featured calculator:
`/timesheet-calculator-with-lunch/`

Current featured/popular emphasis is not aligned with the strongest verified opportunities now available on the site.

The homepage currently:
- prominently features Timesheet Calculator With Lunch;
- links Time Card, Work Hours, Overtime, Salary to Hourly and PTO in popular/category sections;
- includes Time Duration only deeper in the all-tools list;
- does not currently surface Clock Out Time Calculator in homepage tool links;
- does not currently surface Military Time Converter in homepage tool links;
- does not include “Work Hours” in the H1 even though the title already does.

## Verified U.S. keyword priorities

Ubersuggest, United States, English:

| Intent / page | Monthly volume | CPC | SD |
| --- | ---: | ---: | ---: |
| Time Card Calculator | 201,000 | $5.57 | 49 |
| Clock Out Time Calculator | 135,000 | $4.56 | 29 |
| Work Hours Calculator | 135,000 | $2.89 | 49 |
| Time Duration Calculator | 135,000 | $0.00 | 34 |
| Military Time Converter | 74,000 | $0.11 | 22 |
| Salary to Hourly Calculator | 49,500 | $0.88 | 59 |
| Salary Increase Calculator | 33,100 | $13.90 | 16 |
| Overtime Calculator | 22,200 | $5.83 | 20 |
| Hourly Wage Calculator | 18,100 | $1.935 | 19 |
| Hours & Minutes Calculator | 14,800 | $1.13 | 35 |
| PTO Accrual Calculator | 4,400 | $9.62 | 12 |
| Biweekly Pay Calculator | 4,400 | $3.74 | 59 |
| Timesheet Calculator With Lunch | 2,900 | $8.58 | 50 |

## Traffic-first homepage decision

Do not keep the 2,900-volume lunch-specific calculator as the primary featured tool.

After the GitHub Actions blocker is resolved and the Time Card broad-owner retarget is tested, homepage prominence should be based on canonical breadth + demand + monetizable relevance.

### Recommended top featured / popular order

1. **Time Card & Timesheet Calculator**
   - canonical: `/time-card-calculator/`
   - broadest verified intent cluster;
   - 201K “time card calculator” plus 90.5K “time sheet calculator” and 49.5K “timesheet calculator” synonym demand;
   - high CPC and core brand relevance.

2. **Clock Out Time Calculator**
   - canonical: `/clock-out-time-calculator/`
   - 135K volume, $4.56 CPC, SD 29;
   - strong low/mid-authority SERP opportunity;
   - distinctive reverse-scheduling use case.

3. **Work Hours Calculator**
   - canonical: `/work-hours-calculator/`
   - 135K volume, $2.89 CPC;
   - broad hours-worked intent and strong topical fit.

4. **Salary Increase Calculator**
   - canonical: `/salary-increase-calculator/`
   - 33.1K volume, $13.90 CPC, SD 16;
   - strongest verified commercial value / difficulty combination among salary tools.

5. **Overtime Calculator**
   - canonical: `/overtime-calculator/`
   - 22.2K volume, $5.83 CPC, SD 20;
   - strong monetizable payroll relevance.

6. **Time Duration Calculator**
   - canonical: `/time-duration-calculator/`
   - 135K volume, SD 34;
   - large informational traffic opportunity and broad time-tool relevance.

7. **Military Time Converter**
   - canonical: `/military-time-converter/`
   - 74K volume, SD 22;
   - excellent traffic potential but low CPC;
   - best placed in Time Converters and as a popular utility, not above higher-commercial-intent payroll/time-card tools.

## Category architecture

Recommended homepage groups:

### Timesheets
Primary:
- Time Card & Timesheet Calculator

Specialists:
- Weekly Timesheet Calculator
- Biweekly Timesheet Calculator
- Timesheet Calculator With Lunch Break
- Timesheet Pay Calculator
- Timesheet Template

### Work Hours
Primary:
- Clock Out Time Calculator
- Work Hours Calculator

Supporting:
- Billable Hours Calculator
- How to Calculate Hours Worked

### Time Converters
Primary:
- Time Duration Calculator
- Military Time Converter

Supporting:
- Hours & Minutes Calculator
- Decimal Hours Calculator
- Minutes to Decimal Hours

### Overtime & Payroll
Primary:
- Overtime Calculator

Supporting:
- Payroll Hours Calculator
- Timesheet Pay Calculator
- Biweekly Pay Calculator

### Salary & Pay
Primary:
- Salary Increase Calculator

Supporting:
- Hourly Wage Calculator
- Salary to Hourly Calculator
- Salary + Bonus Calculator

### PTO & Time Off
Primary:
- PTO Accrual Calculator

Supporting:
- PTO by Hours Worked
- Time Off Tracker
- How to Calculate PTO Accrual

### Guides & Resources
- How to Calculate a Time Card
- How to Calculate Hours Worked
- Lunch Break guide
- Timesheet Template
- methodology/about

## H1/title recommendation

Keep the existing title concept but align the H1 with the actual topical scope.

Recommended H1:
`Free Timesheet, Work Hours & Payroll Calculators`

Reason:
- “Work Hours” is a major traffic cluster and already appears in the title;
- the current H1 omits it;
- PTO remains represented in the category/navigation and does not need to displace the broader Work Hours entity in the H1.

Do not stuff every calculator entity into the H1.

## Featured-card recommendation

The current homepage hero/featured card should stop linking to /timesheet-calculator-with-lunch/.

Recommended replacement after the Time Card retarget is ready:
- title: `Time Card & Timesheet Calculator`
- short value: weekly clock-in/out, unpaid breaks, overtime and gross-pay estimate;
- CTA: `Open Time Card Calculator`

Alternative short-term featured card, if Time Card retarget is not yet released:
- `Clock Out Time Calculator`
- this page is already live and has 135K / SD 29 demand.

Do not deploy the alternative while the required Actions gate is red.

## Internal-link changes after release gate recovery

Homepage should add direct crawlable links to:
- /clock-out-time-calculator/
- /military-time-converter/

Homepage should promote:
- /time-duration-calculator/ higher than the all-tools tail;
- /salary-increase-calculator/ ahead of /salary-to-hourly-calculator/ in popular/high-value sections;
- /time-card-calculator/ as the broad Timesheet category owner instead of /timesheet-calculator-with-lunch/.

Lunch-specific and other specialist pages should remain available in category/all-tools sections.

## What should not change

- Do not remove specialist pages.
- Do not make every category card point to the highest-volume page if intent is wrong.
- Do not add new doorway pages solely to create more homepage cards.
- Do not hide lower-volume but high-CPC tools such as PTO Accrual; keep them in the relevant category.
- Do not deploy homepage HTML while GitHub Actions cannot execute the required Content Quality gate.

## Dependency order

1. GitHub Actions required gate recovers.
2. PR #62 passes, merges and shared site-search cache-bust is deployed/verified.
3. Time Card verified blockers are remediated and broad-owner retarget passes CI/live checks.
4. Homepage H1/category/featured/popular ordering is updated.
5. Live desktop/mobile navigation, calculator access, canonical/internal-link regression and mobile usability are verified.
6. Measure GSC landing/query changes instead of assuming homepage-link changes caused traffic gains.

## Acceptance criteria for future homepage release

- no links to nonexistent URLs;
- one H1;
- calculator/category link text is intent-specific;
- Time Card, Clock Out, Work Hours, Time Duration, Military, Salary Increase and Overtime are crawlable from homepage HTML;
- category specialists remain accessible;
- mobile cards/navigation remain usable;
- no ad is positioned to encourage accidental clicks near primary calculator CTAs;
- Content Quality CI passes;
- production HTML exactly matches tested GitHub source;
- public homepage returns HTTP 200 and new internal links resolve correctly.
