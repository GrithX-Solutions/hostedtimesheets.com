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
