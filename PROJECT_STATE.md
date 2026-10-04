# HostedTimesheets Project State

Last verified: 2026-10-04T21:49:00+05:00

## Objective

Complete a sitewide content re-audit against CONTENT-STANDARDS.md, then remediate and verify each public page without changing validated calculator behavior unless a real calculation defect is proven.

## Source / deployment

- Repository: GrithX-Solutions/hostedtimesheets.com
- Default branch: main
- Working branch: content/re-audit-timesheet-lunch-20261003
- Base main SHA at PR creation: ab4e984629456883b99b69ed0d4e22f738b3f6d7
- Last content-remediation commit before state sync: 42731919c5c4b8eb3d7143b384aac3e7a4a5081e
- Production content source for flagship page: main commit 989c0bca676f6ba5132503b624531a6c3ad8f1c2
- Production content source for weekly page: main commit c3622544baecd8409e82bdb8825a84d6ec38ea92
- Production content source for biweekly page: main commit e0f20fd4dcabfd97cb5daac1aa33031756a4e6ae
- Production content source for work-hours page: main commit edd62236e79d4e075a44d8087700546051921d58
- Production content source for salary-increase page + JS: main commit 4764f055de1fd86a63800af69a0c47d91482d2a3
- Production content source for overtime page: main commit 822b535a61500e6f2730147cac5463b9a376ed01
- Production content source for PTO accrual JS hotfix: main commit 2de2e22b738be027e4b47f20abcebec25fa1d7c9
- Production content source for PTO accrual page/cache-bust: main commit 4d1cc063e9d31de8ce1f10cbfff668c26e01970a
- Production content source for hourly wage page + JS: main commit de976055a430e4b9aa01fb2d1883d7f328ba009a
- Production content source for salary-bonus page + JS: main commit 4b17394d84cba000c256f2b1da6abb61c0793eb7
- Production content source for hours-and-minutes page + JS: main commit 4cbada58d14c5e3a6417c4647b9b6b43961f178a
- Production content source for clock-out page + JS/discovery links: main commit 718b1693d7c8f3fb55d6fe651c2d1342a90d8490
- Production content source for time-duration migration + redirect config: main commit b4a7512680ff46ef09de1f4f8d15ec25b8598c98
- Public sitemap: 33 URLs after adding /clock-out-time-calculator/; the current repository sitemap uses lastmod 2026-10-03 for the new flagship.

## Last completed task

Military Time Converter source and live page/runtime verification completed. Public site-search discovery exposed a stale unversioned edge-cached shared search asset; a deterministic sitewide cache-bust is prepared on fix/site-search-cache-bust-v2-20261004.

## Tests / evidence

- Existing repository measurable content audit: 32/32 pages pass the calibrated hard gate.
- Ubersuggest authenticated Tier 3 account verified.
- U.S. keyword evidence for `timesheet calculator with lunch`: 2,900 monthly volume, $8.58 CPC, SD 50, informational intent.
- Current competitor/SERP review completed for the flagship lunch-break timesheet intent.
- Documented 30-minute, 60-minute and overnight examples checked against assets/js/timesheet-calculator.js.
- U.S. Department of Labor Fact Sheet #22 checked for the limited meal/rest-period statement.
- FAQPage schema mismatch found and remediated in the working branch.
- Rounding sequence and edge-case behavior documented without changing calculator JavaScript.
- Manual repository content score after remediation: 97/100.
- Content Quality CI: PASS — run #21 on the final PR head; run #19 also passed after the active-voice correction.
- Production filesystem content exactly matches GitHub main for the flagship page (24,520 characters).
- Public HTTPS check: HTTP 200 with correct title, canonical, dateModified, FAQ schema/visible-answer parity and rounding/edge-case methodology text.
- Cloudflare/Rocket Loader rewrites script tags in the public response, so public-body SHA differs from the origin file while the verified content fields match.
- Rendered desktop/mobile QA: BLOCKED in the available browser runtime by ERR_BLOCKED_BY_ADMINISTRATOR; no visual-pass claim made.
- Weekly Timesheet Content Quality CI: PASS — run #23.
- Weekly production origin exactly matches GitHub main; public HTTPS returned 200 with correct title, canonical, dateModified, rounding/formula content and FAQ schema/visible parity.
- Biweekly Timesheet Content Quality CI: PASS — run #25.
- Biweekly production origin exactly matches GitHub main; public HTTPS returned 200 with correct title, canonical, dateModified, rounding methodology, gross-pay formula and DOL references.
- Work Hours Content Quality CI: PASS — run #27.
- Work-hours production origin exactly matches GitHub main; public HTTPS returned 200 with correct title, canonical, dateModified, no-rounding methodology, zero-floor behavior, gross-pay formula and Total-minutes explanation.
- Salary Increase Content Quality CI: initial run #29 FAILED on a 93-word paragraph; rerun #30 PASS after a skimmability-only split.
- Salary Increase production HTML + JS exactly match GitHub main; public page and JS asset both returned HTTP 200; served JS contains the zero-baseline N/A fix and matches the deployed asset byte-for-byte.
- Overtime Content Quality CI: PASS — run #32.
- Overtime production origin exactly matches GitHub main; public HTTPS returned 200 with correct title, canonical, dateModified, DOL regular-rate source, effective-rate formula, IRS qualified-overtime tax boundary and FAQ schema/visible parity.
- PTO Accrual Content Quality CI: PASS — run #34.
- PTO production HTML + JS exactly match GitHub main; public page and JS asset both returned HTTP 200; served JS contains the fixed-mode formula-display correction and matches the deployed asset byte-for-byte.
- PTO follow-up hotfix validation: JS syntax PASS; 1.5 pay periods × 4.50 displays 1.50 periods and 6.75 earned; FAQ schema/visible parity 7/7 exact PASS.
- PTO follow-up Content Quality CI: PASS — run #36; PR #41 merged at 2de2e22b738be027e4b47f20abcebec25fa1d7c9.
- PTO cache-delivery Content Quality CI: PASS — run #38; PR #43 merged at 4d1cc063e9d31de8ce1f10cbfff668c26e01970a.
- PTO final origin HTML exactly matches 4d1cc063; public page returned HTTP 200 and references /assets/js/pto-accrual.js?v=2de2e22.
- Versioned PTO JavaScript returned HTTP 200 with SHA d2c06af8f13acfa51450df4ee21f4686eb8faeea622f7cd7c8217c15858662df and contains the decimal pay-period display fix.
- Hourly Wage Content Quality CI: PASS — run #40; PR #45 merged at de976055a430e4b9aa01fb2d1883d7f328ba009a.
- Hourly Wage production HTML + JS exactly match GitHub main; public page and JS asset both returned HTTP 200.
- Public hourly-wage JS SHA d08a5bfe68b587b0266ee2ab6d6b421853875086515a88638554d3890a19de4d matches the corrected origin asset; canonical/date/schema/regular-hours labels and overtime double-count guidance all passed live checks.
- Salary Bonus Content Quality CI: PASS — run #42; PR #47 merged at 4b17394d84cba000c256f2b1da6abb61c0793eb7.
- Salary Bonus production HTML + JS exactly match GitHub main; public page and JS asset both returned HTTP 200.
- Public salary-bonus JS SHA f36a63674dc93c3a36c98322d7cab97aeaeb192db7ed3c947639dfca119553cc matches the corrected origin asset; canonical/date/zero-base FAQ/schema/schedule labels/gross-only boundary all passed live checks.
- Hours & Minutes Content Quality CI: PASS — run #44; PR #49 merged at 4cbada58d14c5e3a6417c4647b9b6b43961f178a.
- Hours & Minutes production HTML + JS exactly match GitHub main; public page and JS asset both returned HTTP 200.
- Public hours-minutes JS SHA c2902b21a9aa468095dc6770ad2f7d6ffdbe3b0fabb773ad6d82343399cb84e1 matches the corrected origin asset; add/subtract modes and signed-result content passed live checks.
- Fresh PageSpeed mobile: LCP 2.4 s, FCP 2.1 s, Speed Index 2.1 s, TBT 39 ms, CLS 0; desktop LCP 673 ms.
- Canonical HTTPS production fetch: 0 redirects; HTTP/www variants correctly redirect once to https://hostedtimesheets.com/.
- AdSense loader measured ~206 KB versus ~8.4 KB shared site-search JS; it is the dominant evidence-backed candidate behind the ~149 KB unused-JS audit finding.
- Google PageSpeed API exact-LCP-element lookup: BLOCKED by quota 429; rendered browser path remains blocked, so exact LCP DOM element is UNKNOWN.
- Fresh U.S. Ubersuggest: clock out time calculator 135,000 / SD 29 / CPC $4.56; time duration calculator 135,000 / SD 34; military time converter 74,000 / SD 22.
- TRAFFIC-GAP-ANALYSIS-2026-10-03.md records the repository/site gap matrix and dependency order.
- Clock Out keyword: 135,000 US monthly searches, SD 29, CPC $4.56; #1 MTS page PA 15 with 0 backlinks/referring domains.
- Clock Out pre-release formula tests: standard shift, partial-hour shift, overnight, midnight boundary, zero/negative clamp and max-boundary cases PASS.
- Clock Out DOM structure: PASS; one H1/self-canonical: PASS; FAQ schema/visible parity 5/5 PASS; Node JS syntax: PASS.
- Clock Out Content Quality run #46: FAILED only because the two worked scenarios did not use the literal word “example”; headings corrected without changing the underlying content or formula.
- New URL added to sitemap and site-search; Work Hours and Time Card pages link contextually to it.
- Time Duration Content Quality CI: PASS — run #52; authoritative source is main commit b4a7512680ff46ef09de1f4f8d15ec25b8598c98.
- Time Duration origin HTML/JS, site-search, sitemap and llms Git blobs match current main.
- Public /time-duration-calculator/ returned HTTP 200 with zero redirects; public JS returned HTTP 200.
- Public HTTPS /elapsed-time-calculator/ returned HTTP 301 directly to /time-duration-calculator/ in one hop; the no-slash HTTPS form also resolves in one redirect.
- Plain HTTP old URL takes two public hops because Cloudflare first enforces HTTPS; active internal links no longer use the old URL.
- Active live-site scan found no old-path references except historical backup files.
- ZetoPanel live vhost matches tracked ops/nginx/hostedtimesheets.com.conf; dockerized Nginx configuration test PASS.
- Public Time Duration JS/site-search/sitemap edge hashes match origin exactly.
- Pre-migration rollback tar and vhost backup verified; rollback tar contains the old Elapsed Time page and runtime.
- Clock Out Content Quality rerun #48: PASS; PR #52 merged at 718b1693d7c8f3fb55d6fe651c2d1342a90d8490.
- Clock Out production HTML Git blob ca423760b217ffebdcb1283439eda5e1cd3921fb and JS Git blob 3dfe35b3331a80d3b19a1ebccc3f8caf37aefc4a match merged GitHub.
- Production sitemap Git blob 00cbe31499b240be822164e3183c57c981f2f28e and site-search Git blob fd0dcff56df684f70414897132231755ae41fe4b match merged GitHub.
- Public Clock Out page/JS, site-search, sitemap, Time Card and Work Hours all returned HTTP 200.
- Public Clock Out JS SHA-256 52e17a2ca90e2d4738558a35975386bdc7eeb9ef43c251b9e99daa242513051c exactly matches origin.
- Public site-search SHA-256 f2101d5e81ac05dce75afb835125737e21ae6d6770f83578160c3b0ef1588527 exactly matches origin.
- Public sitemap SHA-256 b69a3054ad4d161a620aa95b27b31773492fede824bbb0d185eba325652395c1 exactly matches origin.
- Time Card and Work Hours public responses both contain the Clock Out contextual link; Time Card was reconciled to current main with exact pre-release rollback preserved.
- Time Duration keyword: 135,000 US monthly searches, SD 34; related date/time variants show substantial additional demand.
- Ubersuggest stored SERP includes PA 14/8/8/1/8 ranking pages with 0 backlinks/referring domains; stronger live-SERP utilities also exist, so no unsupported easy-ranking claim is made.
- Time Duration pre-release math: standard, seconds precision, overnight, break, multi-day, negative-date rejection and break-floor cases PASS.
- Time Duration DOM: PASS; one H1/self-canonical: PASS; FAQ schema/visible parity 7/7 PASS; JS syntax: PASS.
- All 32 active tracked link files checked: no internal /elapsed-time-calculator/ links remain on the feature branch.
- Sitemap remains 33 URLs with /time-duration-calculator/ replacing the old elapsed-time canonical.
- Production redirect source-of-truth verified as the outer ZetoPanel Nginx vhost, not .htaccess or /opt/hostedtimesheets/nginx.conf.
- Military Time keyword: 74,000 US monthly searches, SD 22, CPC $0.11; Military Time Chart: 135,000 monthly, SD 28, CPC $0.31.
- Low-authority competitor evidence: TimeRewards PA 20 / 0 backlinks; ASA PA 17 / 0 backlinks; Shifton PA 23 / 1 backlink.
- Military Time parser tests: 0000, 1200, 1730, 0730/730, 17:30, AM/PM, noon/midnight, flexible compact inputs and invalid 2400/2360 cases PASS.
- Military Time DOM: PASS; one H1/self-canonical: PASS; FAQ schema/visible parity 7/7 PASS; Node JavaScript syntax: PASS.
- Military Time content metrics: 865 words, 12.36 average sentence words, 50-word maximum paragraph, passive heuristic 0/1,000, 6 examples.
- Military Time PR #57 review finding: print actions hid the chart because global print CSS hides `.content-grid`; page-scoped print override prepared on fix/military-time-print-20261004 and revalidated.
- Sitemap/search/llms discovery present; Clock Out and Time Duration contain contextual links.

## Affected pages / calculators

- /timesheet-calculator-with-lunch/ — repository + production content verified; rendered browser proofread blocked by environment policy.
- /weekly-timesheet-calculator/ — repository + production content verified; rendered browser proofread blocked by environment policy.
- /biweekly-timesheet-calculator/ — repository + production content verified; rendered browser proofread blocked by environment policy.
- /work-hours-calculator/ — repository + production content verified; rendered browser proofread blocked by environment policy.
- /salary-increase-calculator/ — repository + production HTML/JS verified; rendered browser proofread blocked by environment policy.
- /overtime-calculator/ — repository + production content verified; rendered browser proofread blocked by environment policy.
- /pto-accrual-calculator/ — repository + production HTML/JS verified; rendered browser proofread blocked by environment policy.
- /hourly-wage-calculator/ — repository + production HTML/JS verified; rendered browser proofread blocked by environment policy.
- /salary-calculator-with-bonus/ — repository + production HTML/JS verified; rendered browser proofread blocked by environment policy.
- /hours-and-minutes-calculator/ — repository + production HTML/JS verified; rendered browser proofread blocked by environment policy.
- /clock-out-time-calculator/ — repository + production HTML/JS/discovery verified; rendered browser proofread blocked by environment policy.
- /time-duration-calculator/ — repository + production HTML/JS/redirect/discovery verified; rendered browser proofread blocked by environment policy.
- /military-time-converter/ — pre-release repository/content/conversion checks PASS; CI/merge/deploy remain.
- /elapsed-time-calculator/ — retired canonical; live HTTPS path 301s directly to /time-duration-calculator/.
- /time-card-calculator/ — reconciled to current main during Clock Out release; contextual link live and rollback preserved.
- assets/js/hours-minutes.js — add/subtract modes, signed results and 4-place decimal display released.
- assets/js/salary-bonus.js — zero-base N/A handling and 1–53 workweek validation released.
- assets/js/hourly-wage.js — weeks/year and workdays/week validation aligned with visible HTML limits and released.
- assets/js/pto-accrual.js — fixed-accrual and decimal pay-period formula-display defects released; PTO page uses a versioned asset URL to bypass stale edge cache.
- CONTENT-AUDIT-2026-10-03.md updated.

## Deployment / indexing / content status

- Flagship repository remediation: MERGED via PR #27 at 989c0bca676f6ba5132503b624531a6c3ad8f1c2.
- CI: PASS — Content Quality run #21.
- Flagship production deployment: VERIFIED on origin filesystem and public HTTP 200 response.
- Live canonical/schema/content checks: VERIFIED.
- Rendered desktop/mobile visual proofread: BLOCKED by browser network policy in this session.
- Indexing request: not needed until a material production content change is shipped and verified.

## Blockers / unknowns

- AGENTS.md was not present on the default branch when checked.
- Rendered browser QA for the live page is BLOCKED in this environment by ERR_BLOCKED_BY_ADMINISTRATOR.

## Technical debt

- README.md page inventory/roadmap is stale relative to the current 32-URL sitemap.
- Main is ahead of the last full production reconciliation commit c2fb0f719c7922fc41aae1657cf1c07008c1dab8; 20 public HTML pages changed in that range. Twelve pre-existing page intents — including the Elapsed Time → Time Duration migration — have now been individually brought forward and live-content-verified in this resumed audit; 8 changed public HTML pages still need controlled reconciliation. The new /clock-out-time-calculator/ flagship is also live-verified.
- Manual editorial/SERP verification remains incomplete for the rest of the public pages.

## In progress

Military Time Converter final release verification: shared site-search edge-cache remediation.

## NEXT ACTION

Pass Content Quality CI for fix/site-search-cache-bust-v2-20261004, merge the mechanical versioned search-reference change, deploy the 34 HTML reference updates with rollback preservation, verify the public versioned site-search asset and Military discovery from the homepage/new flagship pages, then close Military Time and advance to the general /timesheet-calculator/ architecture.
