# PTO Accrual Calculator Remediation Spec — 2026-10-07

## Objective

Remediate `/pto-accrual-calculator/` as the canonical general PTO/vacation accrual and balance calculator. Preserve policy-supplied hourly, per-pay-period and fixed methods; add annual-allowance-to-date arithmetic, PTO-hours-to-workdays output, copyable results and strict validation. Do not infer legal entitlement, eligibility, payout, forfeiture, carryover, waiting periods, jurisdiction rules or whether specific hours/pay periods count.

## Verified baseline

- GitHub `main` before this work: `96e0697332ae5d70e3557b919f9e871629047f56`.
- Existing page had three arithmetic modes: per hour worked, per pay period and fixed amount.
- Existing runtime silently converted blank, malformed and negative numeric inputs to zero.
- Existing final balance cap was applied only after current balance + carryover + earned PTO − used PTO.
- Existing page already contained transparent formulas, current/carry/used/cap inputs, seven visible/schema-matched FAQs, browser-local calculation and a narrow U.S. DOL vacation-leave reference.

## Fresh demand evidence

Ubersuggest U.S. checked 2026-10-07:

| Query | Volume | CPC | SD |
| --- | ---: | ---: | ---: |
| pto accrual calculator | 4,400 | $9.62 | 12 |
| pto calculator | 5,400 | $7.25 | 21 |
| accrued pto calculator | 4,400 | $9.62 | 15 |
| vacation accrual calculator | 480 | $3.05 | 14 |
| pto calculator hours to days | 320 | $0 | 13 |
| pto accrual rate calculator | 110 | $0 | 17 |
| pto calculator biweekly | 50 | $0 | 13 |

The primary keyword remains low difficulty and commercially relevant. No traffic forecast is claimed.

## Current SERP / competitor evidence

- Ubersuggest's primary SERP snapshot (updated 2026-08-04) includes VacationTracker, Paycor, PurelyHR, OnTheClock, BuddiesHR, ClockIt, PTOAccrualCalculator.com and ShiftFlow, plus AI Overview and People Also Ask features.
- Fresh web review on 2026-10-07 confirms current specialist calculators commonly expose annual allowance, pay frequency/period counts, starting balance, usage, caps, date ranges, days conversion, copy/share output or projection details.
- Low-authority competition exists: Ubersuggest reports PTOAccrualCalculator.com at PA 15 with 7 backlinks / 7 referring domains and ShiftFlow at PA 18 with 0 backlinks / 0 referring domains.
- HostedTimesheets' defensible gap is transparent multi-method arithmetic, explicit annual-allowance-to-date math, balance reconciliation, hours-to-days conversion, strict invalid-state handling, browser-local/no-signup UX and a stronger policy/legal boundary.

## Canonical / cannibalization decision

This URL owns:
- PTO accrual calculator;
- general PTO calculator for arithmetic balance projection;
- accrued PTO calculator;
- vacation/time-off accrual calculator when the same arithmetic is used;
- hourly, per-pay-period, annual-allowance and fixed/front-loaded input modes;
- current balance + carryover + earned − used reconciliation;
- final arithmetic balance cap modeling;
- PTO hours to workdays conversion using a user-entered workday length.

Keep separate:
- `/pto-accrual-based-on-hours-worked/` — specialist explanation/calculator for PTO earned strictly from eligible hours worked;
- `/how-to-calculate-pto-accrual/` — explanatory formulas, methodology and examples;
- `/time-off-tracker/` — organizing balances and leave categories;
- payout/cash-value, jurisdiction-specific entitlement, waiting-period, carryover/forfeiture and legal-compliance logic — not implemented here.

## Arithmetic contract

Common balance arithmetic:
- uncapped projected balance = current balance + carryover + PTO earned − PTO used;
- cap reduction = max(0, uncapped projected balance − positive final balance cap);
- projected balance = positive cap if cap reduction > 0, otherwise uncapped projected balance;
- projected workdays = projected balance ÷ hours per workday.

Method formulas:
- hourly: PTO earned = eligible hours worked × PTO earned per eligible hour;
- per pay period: PTO earned = completed eligible pay periods × PTO hours per pay period;
- annual allowance: PTO earned = annual PTO allowance ÷ eligible pay periods per plan year × completed eligible periods;
- fixed/front-loaded: PTO earned = fixed PTO hours added.

A final-balance cap is modeled only as an arithmetic ceiling on the displayed final projection. The calculator does not decide whether accrual stops at a cap or excess hours are forfeited.

## Validation contract

- Current balance, PTO used and carryover are required finite values >= 0.
- Final balance cap may be blank or 0 to mean no cap; otherwise it must be finite and >= 0.
- Hours per workday is required, finite, > 0 and <= 24.
- Hourly mode: accrual rate and eligible hours are required finite values >= 0.
- Pay-period mode: completed eligible periods must be a whole number >= 0; PTO hours per period must be finite and >= 0.
- Annual-allowance mode: annual allowance must be finite and >= 0; eligible periods/year must be a whole number 1–366; completed eligible periods must be a whole number 0–366 and cannot exceed eligible periods/year.
- Fixed mode: fixed PTO hours added must be finite and >= 0.
- Explicit zero is valid wherever the contract allows it.
- Invalid fields set `aria-invalid=true`, expose a visible field error, suppress all result metrics and suppress copy output.
- No invalid value is silently clamped or converted to a different valid value.

## Legal / policy boundary

The calculator performs arithmetic from user-supplied policy values only. It must not decide:
- whether PTO is legally required;
- whether a worker is eligible;
- which worked/paid/overtime/leave hours qualify;
- whether a pay period is accrual-eligible;
- payout/cash value;
- carryover, forfeiture, waiting-period or use-it-or-lose-it rules;
- state/country-specific requirements.

The narrow federal reference remains the current U.S. Department of Labor vacation-leave page, which states that the FLSA does not generally require payment for time not worked such as vacation. The page must still tell users that other laws, contracts or policies can differ.

## UX / information gain

Preserve:
- calculator-first layout;
- hours-worked, per-pay-period and fixed methods;
- current balance, usage, carryover and cap inputs;
- transparent formulas and examples;
- negative arithmetic projected balance when usage exceeds available arithmetic balance;
- local browser computation.

Add / strengthen:
- annual allowance spread across eligible periods;
- projected workdays using user-entered workday hours;
- visible cap reduction;
- copy result;
- live status;
- explicit field validation;
- page-local mobile table containment;
- eighth schema-matched FAQ for annual-allowance arithmetic;
- freshness date 2026-10-07.

## Acceptance criteria

- One H1 and self-canonical retained.
- Default hourly mode: 160 × 0.05 => 8.00 earned, 8.00 projected, 1.00 workday at 8 h/day.
- Annual example: 120 annual ÷ 26 × 13 = 60 earned; 12 current + 4 carry + 60 − 8 used = 68 before cap; cap 64 => 64 projected, 4 cap reduction, 8 workdays.
- Pay-period mode: 2 × 4.50 => 9.00 earned.
- Fixed mode: 8 => 8.00 earned with matching formula text.
- Decimal hourly rate: 160 × 0.03846 => 6.1536 internally / 6.15 displayed.
- Negative projected balance remains arithmetic-valid.
- Blank/negative global required inputs invalid except blank cap = no cap.
- Workday hours 0 or >24 invalid.
- Fractional completed pay periods invalid.
- Annual completed periods > periods/year invalid.
- Explicit zero accrual inputs remain valid.
- Copy emits a reproducible valid summary and never copies stale results after an invalid input.
- FAQ visible text exactly matches FAQPage schema.
- No state selector, payout/cash-value input, waiting-period engine or legal-entitlement logic is introduced.
- No horizontal document overflow at 390px or 1280px.
- Runtime exceptions and console errors remain zero.
- Dedicated HTML/schema/accessibility contract PASS.
- Dedicated Chromium calculation/UI matrix PASS.
- Content quality PASS with zero hard failures.
- Exact tested source snapshot parity established before deployment.
- Rollback copies preserved before production write.
- Public HTTP/canonical/schema/versioned JS/live output verification PASS.
- PROJECT_STATE and DECISIONS updated before another page starts.
