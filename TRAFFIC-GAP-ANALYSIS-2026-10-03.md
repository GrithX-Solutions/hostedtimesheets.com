# HostedTimesheets Traffic-First Gap Analysis — 2026-10-03

Status: VERIFIED repository/site inspection with explicit UNKNOWN/BLOCKED items.

## Executive summary

HostedTimesheets does not need a technical-SEO rebuild. The site is a static HTML/CSS/browser-JavaScript property with a 32-URL sitemap, robots.txt, self-canonical page architecture, shared navigation, calculator-specific client-side logic, AdSense code and a content-quality CI gate. The highest-value next work is traffic architecture and flagship functionality, not mass page creation.

A fresh Ubersuggest PageSpeed audit now reports mobile LCP 2.4 s, FCP 2.1 s, Speed Index 2.1 s, CLS 0 and TBT 39 ms. Desktop LCP is 673 ms. The current mobile LCP target (<2.5 s) is therefore met. The old ~5.3 s LCP is not reproducible in the current audit.

Two performance opportunities remain: ~149 KB unused JavaScript and a 630 ms redirect opportunity. Production timing tests show the canonical URL https://hostedtimesheets.com/ has zero redirects; only HTTP and www inputs redirect once. The redirect warning therefore does not justify a site rewrite. The AdSense loader downloads about 206 KB while the shared local site-search script is only ~8.4 KB, making AdSense the dominant evidence-backed candidate for the unused-JS finding. Do not remove or defer it blindly while AdSense verification/review status is unresolved.

The exact Lighthouse LCP DOM element remains UNKNOWN/BLOCKED: the direct Google PageSpeed API returned quota error 429 and the available rendered-browser path is blocked by environment policy. Because the measured LCP already passes 2.5 s, no speculative CSS/hero change is justified.

## ALREADY IMPLEMENTED CORRECTLY

- Static indexable HTML architecture; no backend/framework is required for arithmetic tools.
- Shared CSS and small calculator-specific browser JS.
- Canonical HTTPS non-www redirect rule in .htaccess.
- robots.txt and a 32-URL sitemap are present.
- Current Ubersuggest crawl evidence supplied for this phase reports 32 successful URLs, no broken/blocked URLs and 100/100 technical SEO.
- Desktop performance is excellent; current mobile LCP is 2.4 s with CLS 0 and low blocking time.
- Core legal/trust pages exist: About, Contact, Privacy, Terms and Disclaimer.
- Calculator-first page structure is already common across the site.
- Existing specialist intents have meaningful distinctions:
  - Time Card Calculator: weekly punch/time-card reconciliation.
  - Weekly Timesheet: split shifts + weekly timesheet intent.
  - Biweekly Timesheet: 14-day / two-week workflow.
  - Timesheet With Lunch: lunch-break-specific intent.
  - Timesheet Pay: pay-first weekly intent.
  - Time Card Hours With Lunch Break: guide content, not a duplicate calculator.
- Hours & Minutes now owns duration arithmetic/conversion; Work Hours owns work-shift math; Elapsed Time owns start/end clock/date difference.
- Salary Increase, Overtime, PTO Accrual, Hourly Wage and Salary + Bonus have already received calculation/content remediation in the current sprint.

## NEEDS IMPROVEMENT

### Traffic architecture

- Homepage H1 is currently "Free Timesheet, PTO & Payroll Calculators"; target positioning should explicitly include Work Hours.
- Homepage categories are reasonably structured, but flagship traffic pages are not yet prioritized because Clock Out, Time Duration, Military Time and a general Timesheet Calculator are missing or not yet canonicalized.
- Homepage currently promotes Timesheet With Lunch as the featured calculator; this should be reconsidered after the new flagship URLs ship.
- Decimal Hours should be semantically retargeted around "hours to decimal calculator" and "time to decimal calculator" rather than relying mainly on "decimal hours calculator."
- Elapsed Time should be expanded/repositioned to own the materially larger "time duration calculator" intent while retaining elapsed-time semantics.

### Engineering/release quality

- README.md is stale and lists only an early subset of the current site.
- CI currently runs only the content-quality gate. There is no automated JS syntax/calculator regression, link/canonical/sitemap consistency or redirect regression workflow.
- Production has /assets/brand files (logo/favicon SVG/PNG) that are not present in the GitHub assets tree. This is source-of-truth/deployment reproducibility debt.
- AGENTS.md is absent.
- Analytics/GA4/GTM code is not present in the repository. Google Search Console may be configured externally, but repository inspection cannot verify it; measurement integration status is UNKNOWN from source alone.

### Performance

- The AdSense loader is the dominant candidate for the ~149 KB unused-JS PageSpeed finding.
- Current canonical HTTPS has no redirect. Ubersuggest's redirect opportunity is reproducible only when starting from HTTP/www variants, which correctly 301 to the canonical host.
- Exact mobile LCP DOM element is BLOCKED/UNKNOWN from available tooling. Since current LCP is already 2.4 s, do not change layout/CSS speculatively.

## MISSING

- /clock-out-time-calculator/
  - Fresh U.S. Ubersuggest: 135,000 monthly searches, SD 29, CPC $4.56.
  - Current #1 result is mtscalculators.com, DA 9.
  - This should be the next flagship implementation.
- /military-time-converter/
  - Fresh U.S. Ubersuggest: 74,000 monthly searches, SD 22, CPC $0.11.
  - Topical fit is valid because 24-hour time is directly relevant to shifts/timekeeping.
- /timesheet-calculator/
  - Needed as the authoritative general timesheet intent owner, but must be designed around existing specialist pages rather than cloned from them.
- A dedicated "Time Converters" homepage/category grouping is not yet explicit.
- Automated cross-page SEO/regression checks are missing from CI.

## DUPLICATE / CANNIBALIZATION RISK

### Timesheet cluster

There is overlap, but the existing pages should not be bulk-deleted.

- KEEP /time-card-calculator/ for time-card/punch reconciliation intent.
- KEEP /weekly-timesheet-calculator/ because split-shift weekly functionality is distinct.
- KEEP /biweekly-timesheet-calculator/ because 14-day functionality and query intent are distinct.
- KEEP /timesheet-calculator-with-lunch/ for the lunch-break-specific calculator intent.
- KEEP /timesheet-pay-calculator/ for pay-first intent.
- KEEP /time-card-hours-with-lunch-break/ as a guide.
- ADD /timesheet-calculator/ only as the broad general intent owner with clear mode/function differences and contextual links to specialists. Do not redirect specialist pages initially. Use GSC query/landing-page data after launch to detect real cannibalization before consolidating further.

### Time/duration cluster

- /hours-and-minutes-calculator/ now owns add/subtract/convert known durations.
- /work-hours-calculator/ owns work-shift duration with break/work context.
- /elapsed-time-calculator/ owns start/end time/date duration. It overlaps strongly with the much larger "time duration calculator" query and should become that canonical intent rather than creating a second near-identical page.
- /decimal-hours-calculator/ and /minutes-to-decimal-hours/ can remain calculator + guide if their titles/H1s and internal links keep the tool/guide distinction clear.

## SHOULD BE MERGED / REDIRECTED

### Elapsed Time → Time Duration

Recommendation: migrate /elapsed-time-calculator/ to /time-duration-calculator/ after the reworked page is tested.

Reason:
- Fresh U.S. "time duration calculator": 135,000 monthly searches, SD 34.
- Current SERP includes DA 10, DA 3 and multiple DA 1 pages.
- Existing elapsed-time implementation already supports start/end times, optional dates, overnight handling, multi-day spans and break subtraction.
- Creating both URLs as near-identical calculators would create unnecessary cannibalization.

Migration requirements:
1. Build/test the improved Time Duration page from the existing implementation.
2. Add a 301 from /elapsed-time-calculator/ to /time-duration-calculator/.
3. Change canonical/schema URLs.
4. Update sitemap.
5. Update every internal link/menu/search index.
6. Verify old URL returns one-hop 301 and new URL returns 200.
7. Preserve "elapsed time calculator" as a secondary semantic target on the new page.

No other existing calculator should be redirected yet without first-party GSC evidence.

## TECHNICAL SEO / PERFORMANCE ISSUES

- VERIFIED PASS: canonical HTTPS direct request has zero redirects.
- VERIFIED PASS: fresh mobile LCP 2.4 s meets the <2.5 s target.
- PARTIALLY VERIFIED: unused JS ~149 KB; evidence points primarily to the ~206 KB AdSense loader, not local calculator code.
- UNKNOWN/BLOCKED: exact LCP DOM element due PageSpeed API quota exhaustion and blocked rendered-browser path.
- TECHNICAL DEBT: production brand assets are not tracked in GitHub.
- TECHNICAL DEBT: README inventory is stale.
- TECHNICAL DEBT: CI does not test calculator JS, links, redirects, sitemap/canonical consistency or mobile rendering.
- UNKNOWN: GA4/Search Console runtime setup is not represented in repo source.

## Homepage correction after flagship URLs exist

Target positioning:
Hosted Timesheets — Free Timesheet, Work Hours & Payroll Calculators

Recommended semantic groups:
- Time & Attendance
- Timesheets
- Pay & Overtime
- PTO & Leave
- Time Converters

Recommended flagship prominence after shipping:
1. Clock Out Time Calculator
2. Time Duration Calculator
3. Time Card Calculator
4. Timesheet Calculator
5. Overtime Calculator
6. Salary Increase Calculator

Do not rewrite homepage links to nonexistent destinations before those pages are deployed.

## Dependency order

1. PERFORMANCE GATE — current state PASS
   - Keep current layout/CSS because LCP is 2.4 s.
   - Do not remove/defer AdSense until verification/review requirements are explicitly checked.
   - Record exact LCP element as UNKNOWN/BLOCKED rather than inventing it.
2. BUILD /clock-out-time-calculator/
   - Reverse time calculation: start/clock-in + required paid duration + unpaid break = clock-out.
   - Support "what time should I clock out" and overnight cases.
   - Research competitor edge cases and semantic variants before implementation.
3. REWORK + MIGRATE /elapsed-time-calculator/ → /time-duration-calculator/
4. BUILD /military-time-converter/
5. DESIGN /timesheet-calculator/ general owner, keeping specialist pages unless GSC proves consolidation is needed.
6. Update homepage groups/featured tools/internal links after flagship URLs exist.
7. Retarget Decimal Hours around hours-to-decimal/time-to-decimal cluster.
8. Continue remaining page-by-page content/calculation reconciliation.
9. Add automated JS/link/canonical/sitemap/redirect regression coverage and reconcile production-only brand assets into GitHub.

## Immediate acceptance criteria for the next implementation

The Clock Out Time Calculator should not ship until:
- current Ubersuggest/SERP competitor gap is documented;
- formula/units/assumptions are explicit;
- zero, normal, overnight, break, invalid and boundary cases are tested;
- examples reproduce actual JS output;
- title/H1/canonical/schema own a distinct clock-out intent;
- calculator appears before explanatory content;
- mobile layout works without ad/button ambiguity;
- Content Quality CI passes;
- exact tested HTML/JS are deployed with rollback;
- live HTTP/canonical/schema/asset checks pass.
