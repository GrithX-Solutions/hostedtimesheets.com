# HostedTimesheets Project State

Last verified: 2026-10-03T17:01:47+05:00

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
- Public sitemap: 32 URLs, all with lastmod 2026-10-03 in the current repository sitemap.

## Last completed task

PTO accrual follow-up accuracy hotfix and cache-delivery remediation completed: decimal pay-period formula display fixed, FAQ schema/visible parity corrected, and the page now loads a versioned corrected JavaScript asset.

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

## Affected pages / calculators

- /timesheet-calculator-with-lunch/ — repository + production content verified; rendered browser proofread blocked by environment policy.
- /weekly-timesheet-calculator/ — repository + production content verified; rendered browser proofread blocked by environment policy.
- /biweekly-timesheet-calculator/ — repository + production content verified; rendered browser proofread blocked by environment policy.
- /work-hours-calculator/ — repository + production content verified; rendered browser proofread blocked by environment policy.
- /salary-increase-calculator/ — repository + production HTML/JS verified; rendered browser proofread blocked by environment policy.
- /overtime-calculator/ — repository + production content verified; rendered browser proofread blocked by environment policy.
- /pto-accrual-calculator/ — repository + production HTML/JS verified; rendered browser proofread blocked by environment policy.
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
- Main is ahead of the last full production reconciliation commit c2fb0f719c7922fc41aae1657cf1c07008c1dab8; 20 public HTML pages changed in that range. Seven pages — /timesheet-calculator-with-lunch/, /weekly-timesheet-calculator/, /biweekly-timesheet-calculator/, /work-hours-calculator/, /salary-increase-calculator/, /overtime-calculator/ and /pto-accrual-calculator/ — have now been individually brought forward and live-content-verified in this resumed audit; 13 changed public HTML pages still need controlled reconciliation.
- Manual editorial/SERP verification remains incomplete for the rest of the public pages.

## In progress

Sitewide manual content re-audit and controlled production reconciliation continue page by page.

## NEXT ACTION

Manually audit /hourly-wage-calculator/ for the U.S. `hourly wage calculator` opportunity (18,100 monthly searches, SD 19, CPC about $1.94), including conversion math, semantic coverage, competitor gaps and cannibalization against salary-to-hourly and pay calculators.
