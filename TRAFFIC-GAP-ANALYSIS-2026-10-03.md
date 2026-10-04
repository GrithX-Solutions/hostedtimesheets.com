# HostedTimesheets Traffic-First Gap Analysis — reconciled 2026-10-04

Status: VERIFIED repository/site research with explicit BLOCKED items.

## Executive summary

HostedTimesheets should continue a traffic-first strategy built on verified demand, strong user utility, calculation accuracy, semantic ownership and low-duplication architecture.

The earlier 2026-10-03 gap plan has materially progressed:

- Clock Out Time Calculator is built, merged, deployed and live-verified.
- Elapsed Time was migrated to the canonical Time Duration Calculator with a one-hop production 301.
- Military Time Converter is built and live-verified.
- The proposed new `/timesheet-calculator/` page was rejected after fresh keyword/SERP research showed that broad timesheet and time-card queries substantially resolve to the same product class.
- `/time-card-calculator/` is now the planned broad canonical owner for Time Card + Timesheet intent.
- Homepage prioritization and Decimal Hours retarget research are complete.
- The current hard release blocker is GitHub Actions execution before step 1, not calculator content.

## Current verified public inventory

Repository sitemap: **34 URLs**.

Current flagship additions now present:
- `/clock-out-time-calculator/`
- `/time-duration-calculator/`
- `/military-time-converter/`

Retired canonical:
- `/elapsed-time-calculator/` → one-hop 301 to `/time-duration-calculator/` in production.

## Current high-value U.S. opportunities

Ubersuggest evidence collected during this sprint:

| Intent | Monthly volume | CPC | SD |
| --- | ---: | ---: | ---: |
| time card calculator | 201,000 | $5.57 | 49 |
| clock out time calculator | 135,000 | $4.56 | 29 |
| work hours calculator | 135,000 | $2.89 | 49 |
| time duration calculator | 135,000 | $0.00 | 34 |
| military time converter | 74,000 | $0.11 | 22 |
| salary to hourly calculator | 49,500 | $0.88 | 59 |
| salary increase calculator | 33,100 | $13.90 | 16 |
| overtime calculator | 22,200 | $5.83 | 20 |
| hourly wage calculator | 18,100 | $1.935 | 19 |
| hours to decimal calculator | 14,800 | $8.62 | 16 |
| time to decimal calculator | 14,800 | $8.62 | 19 |
| decimal hours calculator | 12,100 | $5.48 | 46 |
| PTO accrual calculator | 4,400 | $9.62 | 12 |
| timesheet calculator with lunch | 2,900 | $8.58 | 50 |

These values are research inputs, not traffic forecasts.

## Canonical traffic architecture

### Broad Timesheet / Time Card

Fresh SERP research shows strong synonym overlap across:
- time card calculator;
- timecard calculator;
- timesheet calculator;
- time sheet calculator;
- free timesheet calculator.

Decision:
- **Do not create `/timesheet-calculator/` now.**
- Retarget `/time-card-calculator/` as the broad Time Card + Timesheet owner after its verified calculation/validation blockers are fixed.
- Keep specialist pages:
  - `/weekly-timesheet-calculator/` — split shifts;
  - `/biweekly-timesheet-calculator/` — 14-day/two-week workflow;
  - `/timesheet-calculator-with-lunch/` — lunch/break-specific;
  - `/timesheet-pay-calculator/` — pay-first.

See `TIMESHEET-ARCHITECTURE-2026-10-04.md`.

### Time Duration

Completed:
- `/elapsed-time-calculator/` intent was migrated to `/time-duration-calculator/`.
- Canonical/schema/sitemap/site-search/internal links were updated.
- Production old URL redirects one hop to the new URL.
- New page/runtime are live-verified.

### Decimal Hours

Decision:
- `/decimal-hours-calculator/` owns interactive time ↔ decimal conversion.
- `/minutes-to-decimal-hours/` remains the chart/formula/spreadsheet guide.
- Do not create a second decimal-time calculator URL.

Best verified target variants:
- hours to decimal calculator — 14,800 / CPC $8.62 / SD 16;
- time to decimal calculator — 14,800 / CPC $8.62 / SD 19.

See `DECIMAL-HOURS-ARCHITECTURE-2026-10-04.md`.

## Verified product gaps before the next releases

### Time Card broad owner

Read-only audit found six issues that must be resolved before broad retargeting:

1. Current rounding is applied to final daily net minutes, while page wording can be read as punch-time rounding.
2. Incomplete start/end rows silently become 0.00.
3. Equal non-empty start/end values silently become zero and are ambiguous.
4. Break longer than the gross shift silently floors the result to zero.
5. Two-decimal displayed hours can fail to reproduce gross pay, which uses exact minutes.
6. Blank overtime threshold/multiplier values silently coerce to zero.

See `TIMESHEET-ARCHITECTURE-2026-10-04.md`.

### Decimal Hours

Current runtime gaps:

1. Minutes above 59 are silently clamped to 59; negative values silently clamp to 0.
2. Two-decimal display can fail to reproduce pay based on exact duration.
3. Converter is one-way only.
4. Seconds are unsupported.
5. Precision is fixed at two decimals.
6. Optional hourly rate is prefilled, creating an arbitrary default pay example.

Recommended future scope:
- two-way Time ↔ Decimal;
- optional seconds;
- 2/3/4-place display precision;
- exact underlying math;
- explicit validation;
- total minutes/seconds;
- optional pay from exact duration;
- cross-link to the dedicated 1–60 minute guide rather than duplicating its full chart.

## Homepage traffic architecture

Current homepage is under-prioritized for the strongest live opportunities.

Verified issues:
- Featured calculator is still the lunch-specific timesheet page (2,900 monthly searches).
- Clock Out and Military Time are not directly surfaced in current homepage tool links.
- Time Duration is deep in the all-tools section rather than a first-tier utility.
- Current H1 omits “Work Hours” despite 135,000 monthly U.S. demand for Work Hours Calculator.

Planned order after release-gate recovery and Time Card remediation:

1. Time Card & Timesheet Calculator
2. Clock Out Time Calculator
3. Work Hours Calculator
4. Salary Increase Calculator
5. Overtime Calculator
6. Time Duration Calculator
7. Military Time Converter

See `HOMEPAGE-TRAFFIC-PRIORITY-2026-10-04.md`.

## Performance / technical SEO

Previously verified:
- canonical HTTPS direct request has no redirect;
- fresh audited mobile LCP was 2.4 s;
- CLS was 0;
- desktop performance was strong;
- unused-JS evidence was dominated by third-party AdSense rather than local calculator JavaScript.

Do not perform speculative layout/performance rewrites without current evidence.

## Current release blocker — VERIFIED

GitHub Actions Content Quality execution is failing before step 1.

Evidence:
- PR #60 run #58 failed twice with zero job steps and no log blob.
- Clean current-main replacement PR #62 run #59 failed repeatedly with the same zero-step pattern.
- A control rerun of previously successful Clock Out Content Quality run #48 also failed before step 1.

Conclusion:
- this is an external Actions execution/infrastructure blocker, not evidence of a content-quality failure;
- the required gate remains authoritative;
- **do not merge/deploy PR #62 while red**.

## Active release candidate

PR #62:
- 34 HTML files;
- mechanical shared site-search reference versioning only;
- intended reference: `/assets/js/site-search.js?v=e1350fd`;
- no calculator math/content/schema/canonical changes;
- based on current main at creation;
- remains BLOCKED until required CI executes and passes.

## Next release dependency order

1. GitHub Actions recovers.
2. Re-run PR #62 required Content Quality check.
3. If PASS:
   - merge PR #62;
   - deploy the 34 bounded HTML reference changes with rollback preservation;
   - verify versioned site-search delivery from homepage, Military, Clock Out and Time Duration.
4. Remediate the Time Card calculation/validation issues.
5. Retarget `/time-card-calculator/` as the broad Time Card + Timesheet owner.
6. Apply the homepage priority plan.
7. Implement Decimal Hours improvements if current SERP/GSC evidence still supports the opportunity.
8. Continue remaining page-by-page calculation/content reconciliation.
9. Add automated calculator/link/canonical/sitemap/redirect regression coverage once release infrastructure is healthy.

## Technical debt

- AGENTS.md remains absent.
- Rendered live browser QA remains blocked by the current environment.
- Production/repository reconciliation is not yet complete for every changed historical public page.
- Manual editorial/SERP verification remains incomplete for some existing pages.
- CI still lacks broad JS calculation/link/canonical/sitemap/redirect regression coverage beyond the content-quality workflow.
- Production-only asset/source drift should continue to be reconciled when found.

## Policy / quality guardrails

Do not:
- mass-create low-value pages;
- create a duplicate general Timesheet calculator;
- change calculator math to produce expected-looking results;
- infer overtime/legal/payroll/PTO eligibility;
- bypass the required Content Quality gate;
- deploy homepage priority changes before their destination pages are verified;
- treat keyword volume as a traffic guarantee.

Traffic growth work must remain based on current demand, real product gaps, explicit canonical ownership, tested arithmetic, useful content, strong internal links and measured GSC outcomes.
