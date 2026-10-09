# HostedTimesheets Durable Decisions

## 2026-10-03 — Content quality is a release gate

CONTENT-STANDARDS.md is mandatory for every public page and material content update. The automated audit is necessary but cannot prove semantic superiority, native-English quality, factual accuracy, competitor information gain or rendered UX.

## 2026-10-03 — Manual page score rubric

Search-targeted pages use a transparent 100-point repository review rubric:

- Search intent + semantic coverage: 20
- Competitor information gain: 20
- Skimmability + readability: 15
- Native-English grammar, punctuation + active voice: 15
- Methodology, math + authoritative sourcing: 15
- SEO, schema, internal links + trust/privacy: 15

The numeric score never overrides verification status. A page remains PARTIALLY VERIFIED until applicable CI and live production checks pass.

## 2026-10-03 — FAQ schema parity

When FAQPage schema is present, visible FAQ questions and answers must match the schema text exactly. Schema-only wording or materially different visible answers are not acceptable.

## 2026-10-03 — Content audits do not casually change calculator math

During content remediation, existing calculator logic remains unchanged unless a reproducible calculation defect is proven. Examples and methodology must match the implemented calculation order.

## 2026-10-03 — SEO evidence source

Ubersuggest is the primary quantitative source for keyword volume, difficulty, CPC, ranking pages and competitor evidence. Current web SERP review supplements it for freshness and intent/feature validation. Semantic coverage and information gain take precedence over keyword repetition.


## 2026-10-03 — Traffic-first dependency order

A fresh performance audit currently meets the mobile LCP target (2.4 s), so no speculative performance rewrite is allowed while the exact LCP element is blocked/unknown. The remaining unused-JS finding is dominated by third-party AdSense code, and canonical HTTPS itself has no redirect.

Implementation order is:
1. /clock-out-time-calculator/
2. migrate /elapsed-time-calculator/ to /time-duration-calculator/ with a tested 301
3. /military-time-converter/
4. authoritative /timesheet-calculator/ architecture while keeping specialist timesheet pages unless GSC later proves consolidation is needed
5. homepage/internal-link reprioritization after the flagship URLs exist
6. decimal-hours semantic retarget and remaining page reconciliation

Production-only brand assets and broader regression CI are recorded as engineering debt, not reasons to delay the first traffic flagship.


## 2026-10-04 — Persistent redirect layer

Production URL migrations for hostedtimesheets.com must use the persistent outer ZetoPanel Nginx vhost at `/var/lib/zetopanel/nginx/conf.d/hostedtimesheets.com.conf`. The inner `hostedtimesheets-preview` container uses stock Nginx and mounts only the static site directory, so container-local config edits and `/opt/hostedtimesheets/nginx.conf` are not durable production redirect mechanisms. Before any redirect release: preserve the current vhost, apply the tracked config, run Nginx config validation, reload, verify the old URL is a one-hop 301 to the canonical destination, and keep rollback.


## 2026-10-04 — Time Duration canonical migration

The former /elapsed-time-calculator/ intent is consolidated into /time-duration-calculator/ rather than maintained as a second near-identical calculator. The HTTPS old URL must remain a permanent one-hop 301 to the new canonical. Internal links, sitemap, site search and llms point only to the new canonical; "elapsed time calculator" remains a secondary semantic target on the new page. The persistent redirect source of truth is tracked at ops/nginx/hostedtimesheets.com.conf and deployed through the outer ZetoPanel Nginx vhost.


## 2026-10-04 — Do not bypass GitHub Actions runner failures

The required Content Quality gate must remain authoritative even when GitHub Actions fails before job execution.

Evidence:
- PR #60 run #58 failed twice with zero steps and no downloadable log blob.
- Clean current-main replacement PR #62 run #59 failed the same way.
- A control re-run of previously successful Clock Out Content Quality run #48 also failed before step 1.

Decision:
- Classify the current condition as an external GitHub Actions execution blocker, not a content-quality failure.
- Do not merge/deploy PR #62 while the required check is red.
- Keep productive work limited to non-production research/planning until Actions can execute the gate normally.


## 2026-10-04 — Time Card owns the broad Timesheet Calculator synonym cluster

Fresh U.S. keyword/SERP research shows that “time card calculator,” “timesheet calculator,” “time sheet calculator,” and “free timesheet calculator” substantially resolve to the same product class and often the same ranking pages.

Decision:
- Do not create /timesheet-calculator/ now.
- Keep /time-card-calculator/ as the canonical broad owner for the synonym cluster and retarget its title/H1/content after the required Actions gate is healthy.
- Keep /weekly-timesheet-calculator/, /biweekly-timesheet-calculator/, /timesheet-calculator-with-lunch/ and /timesheet-pay-calculator/ as specialist intent owners.
- Do not redirect specialists without first-party GSC evidence of actual cannibalization.
- Preserve one-shift-per-day on the broad Time Card page; split shifts remain a distinguishing feature of the Weekly specialist.


## 2026-10-04 — Homepage traffic priority order

Fresh U.S. demand and monetization research shows the homepage's current Lunch Timesheet emphasis is no longer traffic-optimal.

Decision after release-gate recovery:
- Time Card & Timesheet becomes the broad Timesheets owner and primary homepage timesheet link.
- Clock Out and Work Hours receive first-tier prominence.
- Time Duration and Military Time form an explicit Time Converters group.
- Salary Increase is promoted ahead of Salary to Hourly because its verified demand/CPC/SD profile is materially stronger.
- Overtime remains a first-tier payroll tool.
- Timesheet With Lunch remains a specialist, not the homepage flagship.
- Do not deploy these homepage changes until PR #62 and the broad Time Card owner are safely released.


## 2026-10-04 — Decimal Hours calculator owns interactive time-to-decimal conversion

Fresh U.S. keyword/SERP research shows `hours to decimal calculator` and `time to decimal calculator` each at 14,800 monthly searches with CPC $8.62 and SD 16–19, while current SERPs repeatedly rank the same converter class across those phrases and `decimal hours calculator`.

Decision:
- Keep /decimal-hours-calculator/ as the single interactive owner for hours/time ↔ decimal conversion.
- Keep /minutes-to-decimal-hours/ as the static 1–60 minute chart, formula and spreadsheet guide.
- Do not create another decimal-time calculator URL.
- Future calculator remediation should add reverse conversion, seconds, selectable precision and explicit invalid-input handling while keeping exact source duration authoritative for pay.
- Do not duplicate the full minute chart on the calculator; cross-link to the guide instead.


## 2026-10-04 — Salary Increase owns the Pay Raise synonym cluster

Fresh U.S. keyword/SERP research shows salary increase calculator, pay raise calculator, salary raise calculator, pay increase calculator and wage increase calculator substantially share the same product intent.

Decision:
- Keep /salary-increase-calculator/ as the single canonical owner.
- Do not create separate pay-raise/pay-increase URLs.
- Preserve the current title concept bridging Salary Increase and Pay Raise.
- Future product work should focus on validation, flat-amount raises and before/after pay-period outputs.
- Do not add tax, take-home-pay, jurisdictional deduction or automatic inflation conclusions to this calculator.


## 2026-10-04 — Retire site-search cache-bust after edge recovery

The shared site-search cache-bust PR #62 is no longer needed.

Evidence:
- The unversioned public `/assets/js/site-search.js` now returns HTTP 200 with SHA-256 `c9ba209dd32d7dc9f790835b439b7492ac02038f15d71494de9bf25c46da099a`, exactly matching the production-origin file.
- The proposed `?v=e1350fd` URL returns the same bytes.
- The origin file's Git blob is `e1350fd156987c154b807e68479ae3dac06f3850` and contains Military Time, Clock Out and Time Duration search entries.
- The Military Time Converter remains HTTP 200 and references the unversioned asset.
- GitHub Actions run #59 still fails before step 1, so the prior “do not bypass Actions” decision remains valid.

Decision:
- Close PR #62 without merge or deployment.
- Do not add cache-busting query strings when the currently referenced unversioned asset is already fresh.
- Treat future stale-edge incidents as deployment/cache-delivery issues to verify against origin and public hashes before changing every HTML page.
- Continue to require a real GitHub Actions Content Quality pass before any future production-bound HTML release.


## 2026-10-05 — Timesheet Template owns weekly/biweekly printable template intent

Fresh first-party Search Console data shows template-specific queries such as `biweekly timesheet template`, `bi-weekly timesheet template`, printable biweekly variants and weekly printable variants resolving to `/timesheet-template/`, while calculator-specific two-week queries resolve separately to `/biweekly-timesheet-calculator/`.

U.S. Ubersuggest research also shows meaningful template demand, including `timesheet template` (4,400), `free timesheet template` (590 / SD 28 / CPC $7.82), `weekly timesheet template` (590 / SD 32), and `biweekly timesheet template` (320 / SD 26 / CPC $10.73).

Decision:
- Keep `/timesheet-template/` as the single canonical owner for free, printable, weekly and biweekly template intent.
- Do not create separate weekly-template or biweekly-template URLs without first-party evidence of a distinct intent that the canonical page cannot satisfy.
- Keep weekly/biweekly calculator pages as distinct calculation-intent owners.
- Future template remediation must fix the verified blank Hours/date behavior and add accurate browser-side daily/period totals before metadata or copy claims are strengthened.
- Do not claim native Excel/PDF/Google Sheets downloads unless those formats actually exist; CSV compatibility and browser print-to-PDF must be described accurately.


## 2026-10-05 — ZT MCP server is the temporary release-validation runner while GitHub Actions quota is exhausted

The repository's GitHub Actions allowance is currently exhausted. The pre-checkout failures are therefore treated as quota/capacity unavailability, not as evidence that HostedTimesheets content or code failed its validation logic.

Temporary decision until GitHub Actions capacity is restored:
- GitHub remains the authoritative source repository and release history.
- Do not claim GitHub Actions PASS while the quota is unavailable; record it as BLOCKED (quota).
- Production-bound changes may proceed only when the exact GitHub branch snapshot is validated on the ZT MCP server with an equivalent documented gate.
- For a changed calculator, the server gate must include the repository content-quality audit for the changed page, language/runtime syntax validation, the calculator's calculation/edge-case test matrix, schema/canonical/internal-link checks applicable to the change, and pre/post-deployment source parity/live HTTP verification.
- A partial or stale server workspace must not be treated as authoritative. Sync the exact changed files and gate scripts from GitHub before testing.
- Preserve rollback material and do not deploy if any alternate-gate test fails.
- When GitHub Actions capacity returns, restore the normal required CI path for subsequent releases.

This supersedes the temporary 2026-10-04 decision that prohibited all production releases while the hosted runner could not execute; the quality gate itself remains mandatory, but the approved runner is temporarily the ZT MCP server.


## 2026-10-05 — One page at a time is the release unit

HostedTimesheets remediation work will proceed one public page at a time. A page must complete its research/evidence check, implementation, calculator tests where applicable, content/SEO/schema/accessibility gate, exact GitHub-to-ZT synchronization, merge, rollback preservation, controlled production deployment, live verification and PROJECT_STATE update before unrelated page implementation starts.

This avoids cross-page ambiguity while GitHub Actions is quota-blocked and makes failures, rollback scope and verification evidence attributable to one URL.

The next page after the completed Time Card release is `/timesheet-template/`, selected from existing first-party evidence and its already verified product defect. Homepage reprioritization and other calculator remediations remain separate future page releases.


## 2026-10-06 — Explicit shared site-shell changes are global release units

The one-page-at-a-time rule applies to public-page remediation. When the user explicitly requests a shared site-shell component such as the global header, navigation or footer, that component may be released across all existing pages as one tightly scoped shared release unit.

Requirements:
- The change must stay limited to the shared component and must not bundle unrelated page copy, calculator logic, schema, canonical, sitemap or SEO changes.
- Representative mobile/desktop rendered tests must cover at least the homepage and a calculator page.
- Shared asset/source parity, cross-page markup compatibility, rollback preservation and live public verification remain mandatory.
- The page-remediation completion count does not increase for a shared shell-only release.

For the 2026-10-06 header release:
- PR #83 introduced the shared header implementation at `edd665471cdd1b68b504ca131da0b105b21c2ada`.
- PR #84 changed only the shared CSS/JS references on the 34 canonical HTML pages and merged at `5cd534808580524ec144bb8ffabbd525c1b442e5`.
- The cache-reference follow-up was justified because public unversioned Cloudflare assets were VERIFIED stale: their public hashes matched the pre-release rollback assets while production-origin hashes already matched the new GitHub assets.
- Versioned public assets then returned MISS and matched the new origin/GitHub hashes exactly.

Durable cache rule:
- Do not add or rotate asset-version query strings merely because a deployment occurred.
- First compare public and origin hashes.
- Use a new asset version only when stale edge delivery is actually VERIFIED or when the repository already uses an explicit versioning policy that requires the change.
- Keep the version update mechanical and limited to the affected shared asset references.


## 2026-10-06 — ZT MCP is the permanent contingency execution path for GitHub-side failures

The user has explicitly directed that HostedTimesheets work must not stop merely because GitHub Actions, GitHub-hosted runners, or GitHub service access is temporarily unavailable. The ZT MCP server is the permanent contingency execution path for those infrastructure failures.

This supersedes the “temporary until quota returns” limitation in the 2026-10-05 ZT runner decision. It does **not** weaken the quality gate.

Decision:
- GitHub remains the durable repository/source-of-truth and normal CI location when available.
- If GitHub Actions cannot execute because of quota, outage, hosted-runner capacity, billing/account allocation, or another verified GitHub infrastructure condition, use ZT/MCP immediately rather than pausing production work.
- When GitHub is reachable, synchronize the exact proposed GitHub snapshot and relevant test scripts to ZT and verify exact parity before the alternate gate.
- When GitHub writes themselves are unavailable, continue only from a verified source snapshot: isolate the ZT working diff, record file hashes and test evidence, preserve rollback, and do not mix unrelated work. As soon as GitHub recovers, push/merge the exact tested change and verify repository parity.
- The alternate gate must run every applicable repository/content test plus change-specific syntax, calculation/edge-case, schema/canonical/internal-link, rendered mobile/desktop or browser-engine checks, source parity and post-deployment live verification.
- A genuine failing test remains a release blocker. ZT may replace an unavailable runner; it may not override a failed quality result.
- Never claim GitHub Actions PASS when only ZT passed. GitHub CI must be recorded as BLOCKED/UNAVAILABLE until it actually runs.
- Preserve a tested rollback before production writes.
- GitHub-side infrastructure trouble alone is not a reason to stop; inability to establish an exact tested source snapshot or a failing required test is.

This rule applies to future project work without requiring a new decision each time GitHub or Actions has an infrastructure-only failure.

## 2026-10-06 — Work Hours owns repeated-shift hours-with-break intent

Fresh U.S. demand and SERP research confirms that `work hours calculator` / `hours worked calculator` are high-demand calculator-first intents, while the site's variable-day, split-shift, generic-duration and decimal-conversion workflows already have distinct canonical owners.

Evidence:
- Ubersuggest U.S. `work hours calculator`: 135,000 monthly searches, $2.89 CPC, SD 49.
- Ubersuggest U.S. `hours worked calculator`: 135,000 monthly searches, $2.89 CPC, SD 49.
- Ubersuggest U.S. `work time calculator`: 33,100 monthly searches, $3.82 CPC, SD 47.
- Current SERP competitors commonly expose start/end arithmetic, unpaid breaks, overnight handling, decimal totals and optional pay; richer variable-day or split-shift grids belong to a different workflow.
- The existing `/work-hours-calculator/` canonical already owns this intent and the homepage links to it directly.

Decision:
- Keep `/work-hours-calculator/` as the single canonical owner for one repeated shift pattern: start time + end time + unpaid break + repeated workdays + optional one-rate gross-pay arithmetic.
- Do not create separate synonym URLs for work hours / hours worked / work time.
- Keep variable daily punches on `/time-card-calculator/`, split-shift weekly entry on `/weekly-timesheet-calculator/`, generic elapsed duration on `/time-duration-calculator/`, and time/decimal conversion on `/decimal-hours-calculator/`.
- Same start and end mean zero elapsed time; an earlier end means next day; a break longer than the shift floors net worked time at zero.
- Hourly rate remains optional. Blank means no pay estimate, explicit zero is valid, and an invalid rate must not suppress otherwise-valid time results.
- This calculator performs arithmetic only and must not infer paid-break status, overtime eligibility, taxes, deductions, employment policy or jurisdictional requirements.

## 2026-10-06 — Clock Out owns projected shift-end intent

Fresh U.S. keyword and SERP research confirms that `clock out time calculator` is a distinct high-demand shift-planning intent rather than a generic hours-worked calculator.

Evidence:
- Ubersuggest U.S. `clock out time calculator`: 135,000 monthly searches, $4.56 CPC, SD 29.
- Ubersuggest U.S. `clock out calculator`: 4,400 monthly searches, $5.67 CPC, SD 29.
- The current primary SERP is calculator-first and includes MTS Calculators at position 1 with DA 8 / PA 15 and 0 backlinks / 0 referring domains reported for the ranking URL.
- Competitor review shows clock-in + target-hours + breaks + overnight handling as the core workflow; some competitors also expose reverse hours-worked modes.

Decision:
- Keep `/clock-out-time-calculator/` as the canonical owner for projected clock-out time from clock-in time + paid-work target + user-identified unpaid breaks.
- Do not add reverse hours-worked/start-time modes here. Those workflows remain owned by `/work-hours-calculator/` and `/time-card-calculator/`.
- Supporting multiple unpaid breaks is in-scope because it preserves the exact shift-end planning intent and removes mental addition.
- Blank, malformed, decimal-in-whole-number, negative or out-of-range values must remain invalid rather than being silently clamped.
- The calculator performs local wall-clock arithmetic only. It must not determine break entitlement, paid/unpaid status, overtime eligibility, payroll rounding, wage compliance, time-zone offsets or daylight-saving rules.



## 2026-10-06 — Military Time Converter owns clock-notation conversion and chart intent

Fresh U.S. demand and SERP research confirms that military-time conversion and the military-time reference chart belong on one canonical utility page.

Evidence:
- Ubersuggest U.S. `military time converter`: 74,000 monthly searches, $0.11 CPC, SD 22.
- Ubersuggest U.S. `military time chart`: 135,000 monthly searches, $0.31 CPC, SD 28.
- Ubersuggest U.S. `standard time to military time`: 1,600 monthly searches, SD 25.
- Ubersuggest U.S. `military time to standard time`: 1,600 monthly searches, SD 38.
- Current SERP remains converter/chart-first and includes both strong domains and lower-authority specialist pages.

Decision:
- Keep `/military-time-converter/` as the canonical owner for military-time conversion, standard AM/PM ↔ military time, 24-hour ↔ 12-hour notation, and the military-time chart.
- Preserve the smart single-input workflow for compact military values, colon-form 24-hour values, AM/PM values, `noon`, and `midnight`.
- Use `0000` for midnight and accept military inputs only through `2359`. Reject `2400` so every accepted input maps to one time within a single 24-hour day; explain that some references use 2400 contextually for end-of-day.
- Spoken output is a plain-English rendering for readability, not a formal radio/phonetic communications standard.
- Do not add city/timezone, UTC offset, military time-zone-letter, or Zulu conversion here. Those are distinct timezone intents.
- Keep duration arithmetic on `/time-duration-calculator/`, known-duration arithmetic on `/hours-and-minutes-calculator/`, and projected shift-end arithmetic on `/clock-out-time-calculator/`.
- Invalid or malformed values must surface an explicit invalid state and suppress converted outputs rather than being silently normalized.
- The chart remains printable; print styling must keep the article/chart visible while suppressing the interactive calculator and sidebar.


## 2026-10-06 — Time Duration owns endpoint-to-endpoint duration and elapsed-time intent

Fresh U.S. demand and SERP research confirms that time-duration and elapsed-time calculation belong on one canonical endpoint-to-endpoint calculator rather than separate near-duplicate URLs.

Evidence:
- Ubersuggest U.S. `time duration calculator`: 135,000 monthly searches, SD 34.
- Ubersuggest U.S. `elapsed time calculator`: 12,100 monthly searches, SD 16.
- Ubersuggest U.S. `time difference calculator`: 18,100 monthly searches, SD 71.
- Ubersuggest U.S. `hours between two times`: 2,400 monthly searches, SD 30.
- Ubersuggest U.S. `time calculator with break`: 1,300 monthly searches, $3.46 CPC, SD 35.
- The primary SERP includes CalcShelf at position 1 with DA 10 / PA 14 and 0 backlinks / 0 referring domains, plus several DA 1–6 specialist tools.

Decision:
- Keep `/time-duration-calculator/` as the single canonical owner for duration between two times, elapsed time, hours between two times and date/time duration between endpoints.
- Keep the retired `/elapsed-time-calculator/` as a permanent redirect to the canonical Time Duration URL; do not recreate a second indexable elapsed-time page.
- Time only mode treats an earlier end as the next day. Matching start and end times mean zero duration; they do not imply 24 hours.
- Date & time mode requires real calendar dates and rejects an endpoint earlier than the start instead of silently reversing values.
- Optional break minutes may be blank or a whole nonnegative number. Negative or fractional break values remain invalid rather than being clamped or coerced.
- Break deduction affects only the net result. Gross duration remains visible, and net duration floors at zero if break exceeds gross duration.
- Keep seconds precision, decimal hours, total units, Start/End = now, Swap and copy output in scope.
- Keep add/subtract-known-duration arithmetic on `/hours-and-minutes-calculator/`, repeated work-shift/pay arithmetic on `/work-hours-calculator/`, projected finish time on `/clock-out-time-calculator/`, and punch/timesheet workflows on their specialist URLs.
- Do not add timezone/UTC/DST-aware elapsed-time conversion, payroll rounding, countdown or multi-interval timesheet modes to this URL without separate intent evidence.


## 2026-10-07 — Hourly Wage owns gross hourly-rate to recurring-pay intent

Fresh U.S. keyword and SERP research confirms that the Hourly Wage page should remain a gross-pay conversion utility rather than expanding into tax, withholding or reverse-salary workflows.

Evidence:
- Ubersuggest U.S. `hourly wage calculator`: 18,100 monthly searches, ~$1.94 CPC, SD 19.
- Ubersuggest U.S. `hourly pay calculator`: 8,100 monthly searches, ~$2.23 CPC, SD 16.
- Ubersuggest U.S. `hourly to salary calculator`: 49,500 monthly searches, ~$1.13 CPC, SD 56; higher demand but materially harder and broader intent.
- The current SERP mixes gross conversion tools with paycheck/tax calculators, so matching every SERP feature would blur the site's legal/payroll boundary rather than improve intent fit.

Decision:
- Keep `/hourly-wage-calculator/` as the canonical owner for hourly wage/hourly pay to daily, weekly, biweekly, average monthly and annual gross-pay equivalents.
- Preserve user-entered regular hours, paid workweeks, workdays, currency formatting and optional overtime assumptions.
- Currency selection changes output formatting only; it does not perform foreign-exchange conversion.
- Annual overtime assumes the entered overtime hours repeat across each paid workweek. The calculator does not decide overtime eligibility or the legally required multiplier.
- Blank/malformed required values and out-of-range values must surface explicit validation; do not silently clamp or coerce them into different valid values. Explicit zero hourly wage remains valid.
- Keep reverse annual-salary conversion on `/salary-to-hourly-calculator/`, pay-period-specific conversion on `/biweekly-pay-calculator/`, timesheet-derived pay on `/timesheet-pay-calculator/`, and focused overtime scenarios on `/overtime-calculator/`.
- Do not add tax, withholding, filing-status, take-home-pay, employment-classification or jurisdiction-specific payroll logic to this URL without separate intent and policy justification.


## 2026-10-07 — PTO Accrual owns general multi-method accrual and balance arithmetic

Fresh U.S. demand, SERP review and competitor analysis confirm that the general PTO Accrual page should own multi-method PTO/vacation accrual and balance projection while specialist hours-worked and explanatory intents remain separate.

Evidence:
- Ubersuggest U.S. `pto accrual calculator`: 4,400 monthly searches, $9.62 CPC, SD 12.
- Ubersuggest U.S. `pto calculator`: 5,400 monthly searches, $7.25 CPC, SD 21.
- Ubersuggest U.S. `accrued pto calculator`: 4,400 monthly searches, $9.62 CPC, SD 15.
- Ubersuggest U.S. `vacation accrual calculator`: 480 monthly searches, $3.05 CPC, SD 14.
- Current SERPs mix established HR/payroll brands with low-authority specialist calculators and commonly expose annual allowance, pay-period counts, starting balance, usage, caps, hours-to-days conversion and projection details.

Decision:
- Keep `/pto-accrual-calculator/` as the canonical owner for general PTO/vacation accrual and balance arithmetic.
- Support four user-supplied arithmetic modes: per eligible hour worked, per eligible pay period, annual allowance spread across eligible periods, and fixed/front-loaded PTO hours.
- Balance arithmetic is `current balance + carryover + earned PTO − used PTO`. A positive final-balance cap is modeled only as an arithmetic ceiling on the displayed projection; the calculator does not decide whether accrual stops at the cap or whether excess hours are forfeited.
- PTO-hours-to-workdays conversion uses the user-entered normal hours per workday. It does not determine scheduled workday length.
- Keep `/pto-accrual-based-on-hours-worked/` as the specialist owner for hours-worked accrual intent, `/how-to-calculate-pto-accrual/` as the explanatory methodology guide, and `/time-off-tracker/` as the balance-organization workflow.
- Do not add state/country entitlement logic, payout/cash-value logic, waiting-period decisions, carryover/forfeiture decisions, eligibility classification, or rules deciding which hours/pay periods qualify.
- Blank/malformed required inputs and invalid ranges must surface explicit validation and suppress stale results rather than being silently clamped or coerced.
- Negative projected PTO remains an arithmetic output when usage exceeds the entered available balance; whether a policy permits negative PTO remains outside the calculator.


## 2026-10-07 — Salary Bonus owns gross base-salary + bonus and target-compensation intent

Fresh U.S. demand and SERP review confirm that `/salary-calculator-with-bonus/` should remain a gross compensation arithmetic tool rather than expanding into bonus-tax, take-home-pay or full total-compensation modeling.

Evidence:
- Ubersuggest U.S. `salary calculator with bonus`: 2,400 monthly searches, $8.23 CPC, SD 6.
- Ubersuggest U.S. `salary bonus calculator`: 2,400 monthly searches, $7.81 CPC, SD 47.
- Ubersuggest U.S. `bonus calculator`: 5,400 monthly searches, SD 46.
- Ubersuggest U.S. `total compensation calculator`: 880 monthly searches, $6.65 CPC, SD 62.
- The exact-query SERP mixes gross salary/bonus arithmetic with bonus-tax/paycheck tools, while broader total-compensation tools commonly add equity, benefits and retirement components.
- Calculator Academy's bonus-percentage page was reported by Ubersuggest at PA 50 with 874 backlinks / 340 referring domains; several newer specialist competitor pages had no page-level Ubersuggest data, so their authority remains UNKNOWN.

Decision:
- Keep `/salary-calculator-with-bonus/` as the canonical owner for gross base salary plus annual bonus arithmetic.
- Support three arithmetic modes: percentage of base salary, fixed annual bonus and target total compensation.
- Target mode solves `required bonus = target total compensation − base annual salary`; target cannot be below base salary.
- When base salary is greater than zero, effective bonus percentage is `annual bonus ÷ base salary × 100`. When base salary is zero, fixed/target dollar bonus arithmetic can remain valid but the percentage relative to base salary is N/A.
- Percentage values above 100% remain mathematically valid; the calculator must not invent a compensation-policy ceiling.
- Monthly, biweekly, weekly and hourly figures are gross arithmetic equivalents, not predictions of bonus payout timing.
- Currency selection changes formatting and displayed currency symbol only; it does not perform FX conversion.
- Keep permanent base-salary raises on `/salary-increase-calculator/`, salary-only hourly conversion on `/salary-to-hourly-calculator/`, hourly-wage conversion on `/hourly-wage-calculator/`, and paycheck-frequency conversion on `/biweekly-pay-calculator/`.
- Do not add bonus tax, supplemental withholding, take-home pay, commissions, equity/RSUs, benefits, retirement match, vesting, bonus eligibility, payout-schedule or jurisdiction-specific payroll logic to this URL without separate intent and policy evidence.
- Invalid required inputs must surface explicit validation and suppress stale results; do not silently clamp or coerce values into different valid inputs.


## 2026-10-07 — Hours & Minutes owns arithmetic on already-known durations

Fresh U.S. keyword/SERP research and live competitor review confirm that `/hours-and-minutes-calculator/` should own arithmetic on durations already expressed as hours plus minutes, not clock-in/clock-out difference or payroll-policy logic.

Evidence:
- Ubersuggest U.S. `hours and minutes calculator`: 14,800 monthly searches, $1.13 CPC, SD 35.
- Ubersuggest U.S. `hours minutes calculator`: 14,800 monthly searches, $4.82 CPC, SD 34.
- Ubersuggest U.S. `time addition calculator`: 18,100 monthly searches, $2.11 CPC, SD 41.
- Ubersuggest U.S. `add hours and minutes`: 1,900 monthly searches, SD 31.
- Current exact-query SERPs include established duration calculators plus an AI Overview. Live competitor review shows multiple-duration +/- workflows on leading/specialist tools, while other competitors remain limited to two-duration arithmetic or expand into broader clock/date modes.

Decision:
- Keep `/hours-and-minutes-calculator/` as the canonical owner for arithmetic on known durations expressed as whole hours plus minute portions.
- Support convert-one-duration, add-two, subtract-two and multi-duration +/- modes. Multi mode supports up to 10 total durations.
- Required hours must be whole numbers >= 0. Required minute portions must be whole numbers from 0 through 59. Invalid values must surface explicit field errors and suppress stale duration results rather than being silently clamped or coerced.
- Signed subtraction remains valid; a larger subtracted duration may produce a negative duration.
- Optional hourly rate is arithmetic only. Blank rate is valid and suppresses the money estimate; if entered, the rate must be finite and nonnegative.
- Currency selection changes formatting only and does not perform FX conversion.
- Keep start/end clock-time, AM/PM and cross-midnight endpoint logic on `/time-duration-calculator/` and work-shift/break logic on `/work-hours-calculator/`.
- Keep reverse decimal-hours conversion on `/decimal-hours-calculator/` and the chart/formula guide on `/minutes-to-decimal-hours/`.
- Do not add overtime eligibility, payroll rounding, tax/withholding, billing-policy, compensability, break-entitlement or jurisdiction-specific logic to this URL without separate intent and policy evidence.


## 2026-10-07 — Billable Hours owns utilization and billable-value planning from worked-hour totals

Fresh U.S. demand, SERP and competitor evidence confirms that `/billable-hours-calculator/` should own transparent billable-utilization and simple billable-value/capacity arithmetic from a defined worked-hours period.

Evidence:
- Ubersuggest U.S. `billable hours calculator`: 480 monthly searches, $9.75 CPC, SD 18.
- Ubersuggest U.S. `calculate billable hours`: 590 monthly searches, $10.66 CPC, SD 23.
- Ubersuggest U.S. `billable hours`: 2,400 monthly searches, $0.22 CPC, SD 37.
- Ubersuggest U.S. `billable vs non billable hours`: 110 monthly searches, SD 23.
- Ubersuggest exact-query SERP snapshot updated 2026-08-06 ranked LegalSoft #1, Toggl #2, LogMyHours #3, Omni Calculator #4, FirmTimer #7, Harvest #10 and Corcava #12.
- Current 2026-10-07 competitor review shows that the SERP mixes utilization/value tools with legal billing-increment tools. Current examples expose combinations of utilization, non-billable time, effective value/rate and target gaps; several legal-oriented tools also expose 6-minute or other billing increments.

Decision:
- Keep `/billable-hours-calculator/` as the canonical owner for billable hours as a subset of total worked hours for the same period.
- Use total worked hours as this calculator's utilization denominator and state that denominator explicitly.
- Core formulas: non-billable hours = total worked hours − billable hours; utilization = billable hours ÷ total worked hours × 100 when total worked hours > 0.
- When total worked hours = 0 and billable hours = 0, utilization is N/A because 0 ÷ 0 is undefined.
- Billable hours greater than total worked hours are invalid and must never be silently capped.
- Billing rate is optional. Blank rate is valid; if entered it must be finite and nonnegative.
- Optional money arithmetic: billable value = billable hours × rate; effective value per worked hour = billable value ÷ total worked hours when the denominator is positive.
- Target utilization is optional and, if entered, must be from 0% through 100%. Target hours = total worked hours × target%; signed hours/value deltas compare current arithmetic with that entered scenario.
- Currency selection changes formatting only and performs no FX conversion.
- Keep billing increments, 6-minute/tenth-hour rounding policy, time-entry tracking, invoice generation, realization/write-off policy, tax, collections, profitability, payroll and overtime outside this URL unless separate evidence justifies a distinct canonical intent.

## 2026-10-07 — Production sync is non-deterministic; versioned asset URLs must not be prefetched before origin writes

Release behavior across PRs #104–#106 proves that merging to `main` may synchronize production early, but it is not guaranteed to do so on every merge.

Decision:
- Preserve the exact live rollback snapshot before every production-bound merge.
- After merge, always verify production-origin blobs against merged `main`; never assume either automatic sync or manual-only deployment.
- If origin differs, deploy only the exact tested files and re-verify origin hashes.
- Do not request/prefetch a newly introduced immutable/versioned asset URL through the public CDN before the corresponding origin asset has been written. During the Billable Hours release, `remediation1` was requested while origin still held the old JS and Cloudflare served that stale object after the HTML changed.
- If a versioned asset URL is contaminated by an early fetch, use a fresh cache key only after verifying the new origin bytes. Billable Hours moved to `/assets/js/billable-hours.js?v=20261007-remediation2`.
- Cloudflare Rocket Loader can rewrite public HTML script tags. For public verification, distinguish origin-byte parity from CDN-transformed HTML and verify the rendered live DOM/runtime rather than expecting HTML byte equality.


## 2026-10-07 — Time Off Tracker owns personal PTO/leave balance reconciliation

Fresh U.S. demand, SERP review and competitor analysis confirm that `/time-off-tracker/` should remain a no-signup personal/reconciliation tool rather than expanding into an HRIS, approval workflow or automatic accrual-policy engine.

Evidence:
- Ubersuggest U.S. `time off tracker`: 590 monthly searches, $76.96 CPC, SD 29.
- Ubersuggest U.S. `pto tracker`: 720 monthly searches, $69.08 CPC, SD 25.
- Ubersuggest U.S. `vacation tracker`: 2,400 monthly searches, $13.36 CPC, SD 31.
- Ubersuggest U.S. `leave tracker`: 590 monthly searches, $38.01 CPC, SD 26.
- Current SERPs are dominated by SaaS/team-management tools, with some current browser-local/no-signup competitors. The unusually high CPC values are advertiser metrics, not revenue forecasts.

Decision:
- Keep `/time-off-tracker/` as the canonical owner for manual balance reconciliation across PTO/vacation, sick, personal and other leave categories.
- Core per-category arithmetic is `current = opening + earned - used` and `available after scheduled = current - scheduled`.
- Calculated negative balances remain signed and visible; do not silently clamp them to zero.
- Track category-aware shortfalls separately so positive balances in other leave banks cannot hide a deficit.
- Support one user-selected unit for the whole tracker: Hours or Days. Changing the unit label never converts existing values and the tool never assumes hours per workday.
- Numeric planning inputs may be blank (treated as zero) or finite nonnegative decimals. Entered negative values are invalid; calculated negative balances are valid arithmetic.
- Persistence is opt-in only. `Save in this browser` stores the selected unit and fixed category values in local browser storage on the current device; `Clear saved data` removes that local copy. Resetting the visible tracker does not silently delete a previously saved copy.
- Keep automatic accrual arithmetic on `/pto-accrual-calculator/` and supporting PTO pages.
- Do not add entitlement, eligibility, carryover, cap, forfeiture, approval, statutory-leave, payroll-treatment or jurisdiction-specific HR logic to this URL.
- Copy/print/CSV outputs are planning exports, not authoritative company records.

## 2026-10-07 — Active production root is /home/hostedtimesheets.com/public_html

Time Off release verification identified and independently re-verified the real public topology.

Verified topology:
- Container: `hostedtimesheets-preview`.
- Host bind mount: `/home/hostedtimesheets.com/public_html`.
- Container destination: `/usr/share/nginx/html`.
- Mount mode: read-only in the container.
- `/opt/hostedtimesheets/site` is not the active public document root and may be stale; it must not be used to claim deployment state.

This supersedes earlier deployment inferences that treated `/opt/hostedtimesheets/site` as the verified production mount.

Permanent release rule:
- Preserve rollback from the true active root before any production-bound change.
- After merge, compare the exact tested Git blobs with `/home/hostedtimesheets.com/public_html`; deploy only exact tested files when they differ.
- Verify public CDN bytes only after the active origin is correct.
- Do not prefetch a new versioned asset URL before the active origin contains its intended bytes. If a cache key is contaminated, move to a fresh key only after origin verification.
- Cloudflare Rocket Loader may transform raw public HTML script tags; verify both fetched asset identity and the rendered live DOM/runtime.


## 2026-10-08 — Payroll Hours owns verified-duration to decimal-payroll-hour conversion

Fresh U.S. demand and SERP review confirm that `/payroll-hours-calculator/` should remain distinct from Work Hours, Timesheet Pay and Overtime.

Evidence:
- Ubersuggest U.S. `payroll hours calculator`: 9,900 monthly searches, $6.90 CPC, SD 50.
- Ubersuggest U.S. `calculate payroll hours`: 14,800 monthly searches, $4.115 CPC, SD 23.
- Ubersuggest U.S. `payroll calculator hours`: 8,100 monthly searches, $4.445 CPC, SD 19.
- Ubersuggest U.S. `free payroll hours calculator`: 880 monthly searches, $4.50 CPC, SD 9.
- Current exact-query SERPs include AI Overview/PAA and a mix of work-hours/time-card calculators, decimal conversion, overtime/pay estimators and lower-authority specialist tools.

Decision:
- Keep `/payroll-hours-calculator/` as the canonical owner for already-verified daily durations entered as hours plus minutes, exact minute aggregation, decimal payroll-hour conversion, and optional arithmetic-only gross-pay/overtime scenario comparison.
- Keep clock-in/out, breaks and cross-midnight shift arithmetic on `/work-hours-calculator/`.
- Keep dedicated overtime scenarios on `/overtime-calculator/` and timesheet-derived pay on `/timesheet-pay-calculator/`.
- Daily blank hour/minute cells may represent zero; nonblank hours must be whole numbers >=0 and minutes whole 0-59. Invalid values must surface explicit errors rather than being silently clamped or coerced.
- Hourly rate is optional. Overtime threshold and multiplier are optional as a pair. The calculator must not imply that any default threshold or multiplier legally applies.
- Currency changes formatting only and performs no FX conversion.
- Payroll rounding is not automatic. This page must not choose a timekeeping/rounding policy, determine compensable time, overtime eligibility, tax treatment, deductions, benefits, net pay or jurisdiction-specific payroll compliance.
- Aggregate exact minutes before converting/displaying two-decimal payroll hours so per-day display rounding does not silently change the weekly total.
- Copy/CSV/print outputs may reproduce current arithmetic but are not authoritative payroll records.


## 2026-10-09 — Payroll Hours malformed browser number input is invalid

- Browser number inputs can expose a partial malformed entry such as `1e` as an empty `.value` while `input.validity.badInput === true`.
- HostedTimesheets calculators must not treat `badInput` as a legitimate blank optional field or as zero.
- Payroll Hours explicitly rejects `badInput` for both daily whole-number duration fields and optional numeric rate/threshold/multiplier fields, suppressing stale totals/exports until corrected.
- When runtime JS bytes change, the HTML must move to a fresh immutable cache key only after the intended origin bytes are ready. Payroll Hours final key is `payroll-hours.js?v=20261009-badinput1`.
- The active production root remains `/home/hostedtimesheets.com/public_html`; preserve rollback there before production-bound changes.
