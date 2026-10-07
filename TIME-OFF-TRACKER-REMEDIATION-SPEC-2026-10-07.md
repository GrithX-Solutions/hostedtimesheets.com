# Time Off Tracker Remediation Spec — 2026-10-07

## Objective

Remediate `/time-off-tracker/` as a free no-signup PTO/time-off balance reconciliation tool. Keep the task narrow: users manually enter authoritative opening, earned, used and scheduled values by leave category, then the browser calculates current and after-scheduled balances.

The page must not become an HRIS, approval workflow, payroll system, legal leave engine, automatic accrual-policy engine or employee surveillance tool.

## Verified baseline

- GitHub `main` at start: `06ce565d65974067e9dc4528b678c065ab0e4f5a`.
- Production JS exactly matched GitHub/main blob `65fd69ee59aaa4fef4a68adaf2ab832e29e347e0`.
- Production HTML blob: `5a71652c65673ff92ee34ec2484214d35a18ca85`.
- GitHub/main HTML blob: `284fecf2429e4c194c0f7794429655cbd723d8fd`.
- The only production-vs-repo HTML difference was the audit-required heading prefix: live `How to track time off`; GitHub `Methodology: how to track time off`. Replacing that one string made the files identical.
- Exact live rollback was captured before implementation under `/opt/hostedtimesheets/rollback-time-off-tracker-20261007/`.
- Existing runtime silently converted blank, malformed and negative entries to zero with `Math.max(0, Number(...) || 0)`.
- Existing runtime also clamped calculated current/available negative balances to zero, hiding category deficits.
- Existing tool tracked only hours, had print/CSV export, and did not persist values.

## Fresh U.S. demand evidence

Ubersuggest checked 2026-10-07:

| Query | Volume | CPC | SD | Intent |
| --- | ---: | ---: | ---: | --- |
| time off tracker | 590 | $76.96 | 29 | Informational |
| pto tracker | 720 | $69.08 | 25 | Informational |
| vacation tracker | 2,400 | $13.36 | 31 | Informational |
| leave tracker | 590 | $38.01 | 26 | Informational |
| employee time off tracker | 260 | $28.855 | 13 | — |
| paid time off tracker | 720 | $35.11 | 24 | — |
| free pto tracker | 170 | $21.23 | 20 | Informational |
| personal pto tracker | 30 | $11.045 | 26 | mixed |
| time off calendar | 260 | $14.06 | 19 | Informational |

The $76.96 exact-query CPC remains present in current Ubersuggest data. It is an unusually high advertiser metric and must not be treated as a revenue forecast. No traffic or revenue forecast is claimed.

## Current SERP / competitor evidence

Current web review on 2026-10-07:
- VacationTracker SaaS products emphasize team requests/approvals, calendars, policies, accrual automation, integrations, reporting and multi-location administration.
- OnTheClock combines PTO balances, approvals, calendars and automatic accruals with its broader time-clock product.
- DeskTools currently offers a free no-signup browser-local time-off tracker that saves employee/leave data in the browser.
- Notion's PTO Tracker template supports multiple PTO types and years.
- A current Android PTO Tracker app markets local/offline storage, accrual/carryover configuration and no account.

Ubersuggest page-level evidence:
- vacationtracker.com homepage: PA 26, 38 backlinks, 22 referring domains.
- vacationtracker.io homepage: PA 47, 5,725 backlinks, 614 referring domains; ranks #3 for `pto tracking software` and #7 for `employee time off tracker` in the current report.
- OnTheClock employee PTO page: PA 28, 28 backlinks, 15 referring domains.
- Notion PTO Tracker template: PA 37, 1 backlink / 1 referring domain.

## Intent / canonical boundary

This URL owns:
- personal/reconciliation tracking of opening, earned, used and scheduled PTO/time-off balances;
- separate leave categories;
- hours-or-days arithmetic using one consistent unit;
- current balance and available-after-scheduled balance;
- explicit category shortfall visibility;
- opt-in browser-local persistence;
- print, copy and CSV export.

This URL does not own:
- automatic PTO accrual policy arithmetic — `/pto-accrual-calculator/` and supporting PTO pages own that;
- employee request/approval workflows;
- team calendars or staffing decisions;
- entitlement, eligibility, statutory leave, forfeiture, carryover or cap decisions;
- payroll compensation or wage treatment;
- authoritative company records.

## Semantic map

Primary:
- time off tracker

Secondary:
- PTO tracker
- paid time off tracker
- vacation tracker
- leave tracker
- time off balance
- PTO balance
- vacation balance
- leave balance tracker
- free PTO tracker
- personal PTO tracker

Entities / attributes:
- opening balance
- earned time
- used time
- scheduled leave
- available balance
- shortfall
- PTO / vacation
- sick leave
- personal leave
- hours
- days
- local browser storage
- CSV
- print
- reconciliation

Questions:
- how do I track PTO balance
- can I track PTO in hours or days
- how do I see scheduled leave separately
- what does a negative PTO balance mean
- does the tracker save my data
- does it calculate accrual automatically
- can I export the tracker
- can I use it as an official payroll record

## Arithmetic contract

For each category:
- `current balance = opening balance + earned − used`
- `available after scheduled = current balance − scheduled`

Negative calculated balances are valid arithmetic and remain visible. They must not be silently changed to zero.

Across categories:
- opening, earned, used, scheduled, current and available totals are signed sums of valid row values;
- categories short after scheduled = count of category rows with available-after-scheduled < 0;
- scheduled shortfall = sum of the absolute negative available-after-scheduled amounts by category.

The shortfall metric is category-aware so a positive balance in one leave bank cannot hide a deficit in another.

## Units

- User chooses Hours or Days for the entire tracker.
- Unit selection changes labels only.
- Changing units does not convert existing values.
- The calculator never assumes hours per workday.
- All rows and exports use the same selected unit.

## Input validation

All 16 numeric inputs are optional planning fields:
- blank = zero;
- explicit zero is valid;
- finite decimal values >= 0 are valid;
- entered negative values are invalid;
- invalid cells receive `aria-invalid=true` plus a visible field error;
- any invalid entered cell suppresses overall totals and blocks save, copy and CSV export;
- calculated negative current/available balances are not input errors.

## Browser-local storage / privacy boundary

Default:
- values are not persisted by the tracker after a fresh page load unless a prior explicit saved copy exists.

Opt-in save:
- `Save in this browser` writes only selected unit plus the four fixed category rows to `localStorage` on the current browser/device.
- Saved data is restored on a later page load.
- `Clear saved data` removes that local copy without altering the current on-screen values.
- Reset changes the visible tracker but does not silently delete a saved copy.
- A failed/corrupt saved payload is cleared safely and the visible tracker resets to zero.
- The tracker does not create an account or submit balance inputs to Hosted Timesheets.

Do not claim that unrelated third-party page scripts cannot observe browser DOM. Privacy copy must describe only what this tracker logic does.

## Information gain

Compared with the majority of SaaS/team competitors and basic templates:
1. Privacy-first persistence: no account; no persistence by default; explicit opt-in browser-only save/clear.
2. Signed deficit handling: calculated negative balances stay visible instead of being zero-clamped.
3. Category-aware shortfall: count and sum deficits per leave bank so positive categories cannot mask shortages.
4. Hours-or-days mode without inventing an hours-per-day conversion.
5. Reproducible print/copy/CSV exports from the same validated state.
6. Explicit separation between manual reconciliation and accrual/entitlement policy.

## Legal / HR / payroll boundary

The tracker performs arithmetic from user-entered values only. It does not decide:
- whether leave is earned or legally required;
- whether a negative balance or advance leave is permitted;
- which hours/days are eligible;
- carryover, cap, forfeiture or expiry rules;
- whether scheduled leave is approved;
- payroll treatment or compensation;
- statutory sick, family, medical, vacation or other leave obligations.

Official balances and approvals must be checked against the authoritative employer/payroll/leave system.

## Acceptance criteria

- One H1; self-canonical retained; index/follow retained.
- Title/description naturally cover Time Off Tracker + PTO/vacation/leave intent.
- WebPage `dateModified` = 2026-10-07.
- 8 visible FAQs exactly match FAQPage schema after HTML stripping.
- Default unit = Hours; all default totals = 0.00 h.
- Blank numeric cells are valid zero.
- Decimal nonnegative values are valid.
- Negative entered values show field errors, suppress totals and block save/copy/CSV.
- Used time may exceed opening+earned and produce a negative current balance; this is displayed, not clamped.
- Scheduled time may produce a negative available balance; this is displayed, counted and added to shortfall.
- Hours example produces a known category shortfall.
- Days example uses day-scale inputs and labels without conversion.
- Changing unit does not modify numeric input values.
- Local save/restore/clear behavior is deterministic and tested.
- Reset does not silently clear the persisted snapshot.
- Copy summary is reproducible.
- CSV includes category, unit, inputs, current and available values.
- Print action remains wired.
- No accrual-rate, carryover-rule, approval, employee-name, team-calendar, payroll or statutory-leave engine is introduced.
- No horizontal document overflow at 390px or 1280px.
- Runtime exceptions and console errors = 0.
- Dedicated HTML/schema/accessibility test PASS.
- Dedicated Chromium calculation/storage/UI matrix PASS.
- Content-quality audit PASS for this page with zero hard failures.
- Exact GitHub-to-ZT tested-source parity before merge.
- Pre-merge rollback preserved and hash-verified.
- Merged-main runtime blobs equal tested blobs.
- Do not prefetch the new versioned JS URL before origin deployment.
- Public HTTP/canonical/schema/runtime and rendered live behavior verified.
- PROJECT_STATE and DECISIONS updated before another page starts.
