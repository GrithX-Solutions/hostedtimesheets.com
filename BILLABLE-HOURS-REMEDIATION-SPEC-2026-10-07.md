# Billable Hours Calculator Remediation Spec — 2026-10-07

## Objective

Remediate `/billable-hours-calculator/` as the canonical calculator for billable utilization and simple billable-value/capacity arithmetic from a defined worked-hours period. Preserve the current worked-hours + billable-hours model, but replace silent input clamping with explicit validation, make rate and target inputs genuinely optional, add effective-value and target-value outputs, improve copy/status UX and clarify no-FX/no-invoice/no-payroll boundaries.

Do not turn this URL into a legal billing-increment/rounding calculator, time tracker, invoice generator, profitability calculator, payroll calculator or jurisdiction-specific professional-services policy tool.

## Verified baseline

- GitHub `main` before implementation: `ac4f2be4124886f3ecb2ef92528c485d305583aa`.
- Pre-change production HTML exactly matched GitHub `main` blob `9fa1809fa8b154b9e76f60110fb9c5fcae3544f9`.
- Pre-change production JS exactly matched GitHub `main` blob `8d2b9e52695498b784f4a33cc894b3dbc5016b31`.
- Rollback was captured and hash-verified before merge because merge-triggered production synchronization is known behavior.
- Existing calculator accepted total worked hours, billable hours, billable hourly rate, currency and target utilization.
- Existing runtime silently coerced blank/malformed/negative numeric fields to zero.
- Existing runtime silently capped billable hours at total worked hours and silently capped target utilization at 100%.
- Existing zero-worked-hours state displayed 0% utilization even though 0 ÷ 0 is undefined.
- Existing rate and target inputs behaved as required values in practice rather than optional planning inputs.
- Existing outputs showed utilization, non-billable hours, billable revenue, target billable hours and hours-vs-target.

## Fresh U.S. demand evidence

Ubersuggest checked 2026-10-07:

| Query | Volume | CPC | SD | Intent |
| --- | ---: | ---: | ---: | --- |
| billable hours calculator | 480 | $9.75 | 18 | Informational |
| billable hours | 2,400 | $0.22 | 37 | Informational |
| calculate billable hours | 590 | $10.66 | 23 | Informational |
| billable vs non billable hours | 110 | $0 | 23 | Informational |
| utilization rate calculator | 170 | $0 | 13 | — |
| billable utilization rate | 20 | $0 | 14 | — |
| billable hours calculator 6 minute increments | 40 | $4.08 | 28 | Informational |

No traffic forecast is claimed.

## SERP / competitor evidence

Ubersuggest exact-query SERP snapshot updated 2026-08-06:
- LegalSoft ranks #1.
- Toggl ranks #2.
- LogMyHours ranks #3.
- Omni Calculator ranks #4.
- FirmTimer ranks #7.
- Harvest ranks #10.
- Corcava ranks #12.

Ubersuggest page-level evidence:
- LegalSoft's billing-increment page: PA 24, 1 backlink / 1 referring domain; it ranks across legal billing chart/increment terms and `how to calculate billable hours`.
- FirmTimer's billable-hours page: PA 15, 0 backlinks / 0 referring domains in the current report.
- Harvest's lawyer calculator: PA 32, 0 backlinks / 0 referring domains in the current report.
- Corcava's billable-hours page: PA 21, 1 backlink / 1 referring domain.
- Authority alone does not settle intent; the exact-query SERP mixes legal billing-increment conversion with general utilization/revenue planning.

Current web review on 2026-10-07:
- Multiple modern calculators expose utilization, non-billable hours and billable value.
- Several expose effective value/rate across all worked hours.
- Several expose target billable hours and target-value/revenue gaps.
- Some broaden into annualization, revenue targets, query-string sharing, project/task rows or billing-increment rounding.
- Legal-oriented tools commonly expose 6-minute or other billing increments.

## Intent / gap decision

The strongest differentiated fit for HostedTimesheets is not to copy legal billing-rounding policy. It is to provide transparent billable-utilization and value/capacity arithmetic with strict inputs and explicit boundaries.

This URL owns:
- billable hours as a subset of total worked hours for the same period;
- non-billable hours = total worked hours − billable hours;
- billable utilization using total worked hours as the denominator;
- optional billable value = billable hours × entered billing rate;
- effective billable value per worked hour;
- target billable hours from an entered utilization target;
- signed hours-vs-target and value-vs-target arithmetic.

Keep separate:
- exact H:M and decimal-time conversion: `/hours-and-minutes-calculator/`, `/decimal-hours-calculator/`;
- worked-time and payroll arithmetic: `/work-hours-calculator/`, `/payroll-hours-calculator/`, `/timesheet-pay-calculator/`;
- overtime: `/overtime-calculator/`;
- legal billing increments, 6-minute/tenth-hour rounding policy, invoice generation, realization policy, write-off policy, tax, collections and profitability.

## Semantic map

Primary:
- billable hours calculator

Secondary:
- calculate billable hours
- billable hours
- billable vs non billable hours
- billable utilization
- utilization rate calculator
- billable utilization rate
- billable hours target
- billable revenue / billable value
- effective hourly value

Questions / long tails:
- how to calculate billable hours
- what are billable vs non billable hours
- how to calculate billable utilization
- how many billable hours do I need for a target utilization
- how to calculate non billable hours
- what is effective rate per worked hour
- can billable utilization exceed 100 percent
- does billable value equal collected revenue

Entities / attributes:
- worked hours
- billable hours
- non-billable hours
- utilization
- billing rate
- billable value
- target utilization
- target hours
- effective value
- invoice
- realization
- write-off
- collections

## Arithmetic contract

Core:
- non-billable hours = total worked hours − billable hours;
- utilization = billable hours ÷ total worked hours × 100 when total worked hours > 0;
- when total worked hours = 0 and billable hours = 0, utilization = N/A because 0 ÷ 0 is undefined.

Optional billing-rate outputs:
- billable value = billable hours × billing rate;
- effective value per worked hour = billable value ÷ total worked hours when total worked hours > 0;
- when total worked hours = 0, effective value per worked hour = N/A.

Optional target outputs:
- target billable hours = total worked hours × target utilization ÷ 100;
- hours vs target = current billable hours − target billable hours.

When both rate and target are valid:
- value at target = target billable hours × billing rate;
- value vs target = current billable value − value at target.

Currency selection changes display formatting only and performs no FX conversion.

## Validation contract

Required:
- total worked hours is required, finite and >= 0;
- billable hours is required, finite and >= 0;
- billable hours must be <= total worked hours for the same period;
- decimal hours are valid; no whole-number restriction is imposed;
- explicit zero is valid.

Optional billing rate:
- blank is valid and suppresses monetary metrics;
- explicit zero is valid;
- if entered, must be finite and >= 0;
- invalid rate must not erase otherwise-valid utilization/non-billable/target-hours arithmetic;
- invalid rate suppresses monetary metrics and full-result copy.

Optional target utilization:
- blank is valid and suppresses target metrics;
- explicit 0% and 100% are valid;
- if entered, must be finite and from 0 through 100;
- invalid target must not erase otherwise-valid utilization/non-billable/billable-value arithmetic;
- invalid target suppresses target metrics and full-result copy.

Required-field invalid states:
- mark the field `aria-invalid=true`;
- show a visible field error;
- suppress all result metrics and stale copy state;
- never silently clamp or coerce to another value.

## UX / information gain

Preserve:
- calculator-first layout;
- total worked hours, billable hours, rate, currency and target inputs;
- utilization and non-billable outputs;
- target-hour comparison;
- no-signup, browser-local arithmetic.

Add / strengthen:
- strict field-level validation;
- optional rate and optional target behavior;
- zero-hours N/A state;
- effective billable value per worked hour;
- value at target and signed value-vs-target;
- copyable reproducible result;
- explicit no-FX language;
- explicit denominator definition;
- explicit billable-value vs invoice/revenue/collections boundary;
- eight visible/schema-matched FAQs;
- page-local `min-width:0` mobile containment;
- `dateModified` 2026-10-07;
- versioned runtime `/assets/js/billable-hours.js?v=20261007-remediation2`.

## Billing / payroll / legal boundary

The calculator performs arithmetic from user inputs only. It does not determine:
- whether a task is legally or contractually billable;
- billing increment or rounding policy;
- invoice amount under fixed-fee, retainer, capped or blended arrangements;
- realization/write-off policy;
- recognized revenue, profit, cash collection or taxes;
- payroll compensation, overtime, wage compliance or employee classification;
- profession-specific or jurisdiction-specific billing obligations.

## Acceptance criteria

- One H1 and self-canonical retained.
- Default 40 worked / 30 billable / $100 rate / 75% target => 75.0% utilization; 10 non-billable hours; $3,000 billable value; $75 effective value/worked hour; 30 target hours; +0.00 hours; $3,000 target value; +$0 target delta.
- Decimal hours remain valid.
- Billable = total => 100% utilization and zero non-billable.
- Billable > total is invalid, not clamped.
- Total 0 + billable 0 is valid with utilization N/A.
- Blank/negative total or billable is invalid.
- Blank rate is valid and suppresses money metrics.
- Zero rate is valid.
- Negative/malformed rate marks only rate invalid and preserves core/target-hour results.
- Blank target is valid and suppresses target metrics.
- 0% and 100% targets are valid.
- Target <0 or >100 marks only target invalid and preserves core/rate outputs.
- Currency change preserves numeric inputs/calculation and changes formatting only.
- Example 45 worked / 28 billable / $65 / 70% => 62.2% utilization; 17 non-billable; $1,820 billable value; $40.44 effective value/worked hour; 31.50 target hours; −3.50 hours; $2,047.50 value at target; −$227.50 value vs target.
- Copy emits a reproducible summary only when every entered field is valid; blank optional fields are valid.
- FAQ visible text exactly matches FAQPage schema.
- No 6-minute/increment/rounding-policy engine, task timer, invoice, tax, overtime or payroll engine is introduced.
- No horizontal document overflow at 390px or 1280px.
- Runtime exceptions and console errors remain zero.
- Dedicated HTML/schema/accessibility contract PASS.
- Dedicated Chromium calculation/UI matrix PASS.
- Content-quality audit PASS for this page with zero hard failures.
- Exact tested source snapshot parity established before merge/deployment.
- Pre-merge rollback remains exact and preserved.
- Merged-main runtime blobs equal the tested runtime blobs.
- Public HTTP/canonical/schema/versioned JS/render verification PASS.
- PROJECT_STATE and DECISIONS updated before another page starts.
