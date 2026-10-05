# HostedTimesheets Project State

Last verified: 2026-10-06T00:28:00+05:00

## Objective

Execute remediation one public page at a time. A page must complete research/evidence review, implementation, tests, alternate release validation, merge, rollback preservation, controlled deployment, live verification and state update before another page enters implementation.

User workflow rule:
- Work on exactly one public page at a time.
- Finish that page completely.
- Report results.
- Do not start the next page until the user explicitly approves it.
- An explicitly requested shared site-shell component such as the global header/navigation may be treated as one shared release unit across existing pages, but it must not bundle unrelated page content or calculator changes.

GitHub Actions remains BLOCKED because the Actions quota is exhausted. The ZT MCP server is the temporary alternate validation runner. Never record Actions as PASS while the quota blocker remains.

## Source / deployment

- Repository: GrithX-Solutions/hostedtimesheets.com
- Default branch: main
- Current repository main after the shared-header delivery fix: `5cd534808580524ec144bb8ffabbd525c1b442e5`.
- Production: static Nginx site.
- Verified production mount: `/opt/hostedtimesheets/site` -> `/usr/share/nginx/html`.
- ZT server id: `c59425e31c304e608dac60224a064dbd`.
- ZT workspace: `hostedtimesheets`.
- ZT workspace is a partial bootstrap, not an authoritative Git mirror. Exact changed files must be synchronized from GitHub and parity-checked before using it as a release gate.
- GitHub Actions: BLOCKED (quota).
- Public/repository sitemap: 34 canonical URLs.
- Strict page-by-page remediation completed: 3 / 34 pages.
- Shared site-shell releases are tracked separately from the 3 / 34 page-remediation count.

## Last completed task

### Global header / navigation — VERIFIED shared release

PR #83 merged the header implementation at `edd665471cdd1b68b504ca131da0b105b21c2ada`. PR #84 merged the cache-delivery follow-up at `5cd534808580524ec144bb8ffabbd525c1b442e5`.

The production shared header now:
- presents only the prominent Hosted Timesheets logo, Tools and Search controls;
- removes the redundant Home / Calculators / Guides / About header links from the visible navigation while preserving their page URLs and body/footer discoverability;
- removes the duplicate All Tools header CTA while retaining the categorized Tools menu;
- uses equal-height, aligned Tools and Search controls on desktop and mobile;
- opens Search directly below the sticky header;
- keeps Tools and Search mutually exclusive and closes Search on outside click;
- enlarges only the header logo; the footer logo remains unchanged;
- changes no calculator math, page copy, metadata, schema, canonical URL, sitemap URL or framework.

## Tests / evidence

### Global header / shared navigation
- GitHub branch <-> ZT exact parity for changed CSS, JS and header tests: VERIFIED before merge.
- Global header static contract: PASS.
- `site-search.js` Node syntax: PASS.
- Exact-source Chromium regression: PASS on homepage and Time Card at 390x844 mobile and 1280x900 desktop.
  - No document-level horizontal overflow.
  - Header logo meets the tested prominence threshold.
  - Footer logo remains <= 36 px high and was not unintentionally resized.
  - Redundant direct header links are hidden.
  - Duplicate All Tools CTA is hidden.
  - Tools and Search controls align vertically and use equal heights.
  - Search results remain functional.
  - Opening Tools closes Search and vice versa.
  - Outside click closes Search.
- Live shared-header structure audit before release: 34 / 34 sitemap URLs already contained the required shared header/search markup.
- Rollback for pre-header shared assets:
  - CSS SHA-256 `6b2c3e7a37b412da71ae413d3696844f12f1817e5bb73ff7fe7f63c2fc9a3ea9`.
  - JS SHA-256 `c9ba209dd32d7dc9f790835b439b7492ac02038f15d71494de9bf25c46da099a`.
  - Preserved at `/opt/hostedtimesheets/rollback/assets/css/design-v2.css` and `/opt/hostedtimesheets/rollback/assets/js/site-search.js`.
- New production shared assets:
  - CSS SHA-256 `849872b454f9a51fb65c1946b1884648b20a6fb754d217e18f2c4f2d68c83ece`.
  - JS SHA-256 `1ee68d37ad49af470cddfa70b7c8c4a908bfabe0e86c26a569af6cb21d8fb6b8`.
- Cloudflare initially served the old unversioned asset hashes from HIT cache with `max-age=14400`; origin files were already correct.
- PR #84 therefore versioned only the two shared asset references on all 34 canonical HTML pages:
  - `/assets/css/design-v2.css?v=edd6654`
  - `/assets/js/site-search.js?v=edd6654`
- Public versioned CSS and JS both returned Cloudflare MISS on first verification and their SHA-256 hashes exactly matched the new production/GitHub assets.
- Production HTML reference audit after deployment: 34 URLs, 0 missing versioned CSS/JS references.
- HTML rollback for the cache-reference change: `/opt/hostedtimesheets/rollback/header-html-cache-20261005`.
- True-public Chromium regression on the live homepage and Time Card page at mobile and desktop widths: PASS.
- Public post-release Lighthouse samples were noisy (scores 80 and 66 with materially different network/TBT patterns), so they were not used to attribute a regression to the header.
- Deterministic local old-vs-new A/B Lighthouse comparison, same homepage/server with AdSense removed from both fixtures:
  - old header: performance 100, FCP 1.201 s, LCP 1.328 s, CLS 0, TBT 11 ms, Speed Index 1.201 s;
  - new header: performance 100, FCP 1.201 s, LCP 1.501 s, CLS 0, TBT 0 ms, Speed Index 1.201 s.
  - Result: no material isolated performance regression from the shared header assets.
- Temporary A/B containers, reports and fixture directories were removed after verification.

### Homepage
- GitHub main <-> ZT homepage/test-file parity: VERIFIED before merge/deployment.
- Content Quality: PASS.
  - Main-content words: 1,028.
  - Average sentence length: 15.8 words.
  - Maximum paragraph: 68 words.
  - Passive heuristic: 4.9 / 1,000 words.
- Python syntax: PASS.
- Homepage HTML/canonical/schema/internal-link contract: PASS.
- Exact-source Chromium regression: PASS.
  - 390x844 mobile: six category cards, six Popular Tools cards, one-column Popular Tools, Time Card hero, no document-level horizontal overflow.
  - Mobile Tools menu: PASS.
  - Mobile site search returns Military Time Converter: PASS.
  - All-tools disclosure includes Clock Out and Military Time: PASS.
  - 1280px desktop: six-column Popular Tools, six category columns, no document-level overflow, featured calculator visible in initial viewport.
- Every promoted destination was live HTTP 200 without an unnecessary redirect before merge:
  - Time Card Calculator.
  - Clock Out Time Calculator.
  - Work Hours Calculator.
  - Time Duration Calculator.
  - Military Time Converter.
  - Salary Increase Calculator.
  - Overtime Calculator.
  - PTO Accrual Calculator.
- Previous production homepage SHA-256: `66f4abf7af384e9429c5dff5ea21c11cf3d43c65b356c305d4ed7c79f1e734b2`.
- Tested/deployed homepage SHA-256: `dd8c7a0426593025221ec8f891620da3e4b3f3dae0566b64d61aaddb06919b47`.
- Rollback: `/opt/hostedtimesheets/rollback/homepage/index.html`, exact previous SHA preserved.
- Public homepage: HTTP 200; Cloudflare cache status DYNAMIC; last-modified 2026-10-05 18:02:26 GMT.
- Public response verification: correct H1, self-canonical, six category cards, six Popular Tools cards, Time Card hero, Clock Out link and Military Time link.
- True public mobile Chromium render through an ephemeral host-network container: PASS.
- Live mobile Lighthouse performance run:
  - Performance score: 88.
  - FCP: 1.83 s.
  - LCP: 2.19 s.
  - CLS: 0.
  - TBT: 404 ms.
  - Speed Index: 1.83 s.
- No sitemap-file change was required because the homepage URL already exists and no new URL was introduced.

### Timesheet Template `/timesheet-template/` — VERIFIED release
- PR #81 code commit: `df6c9673cc366eb12aaac0a2ede2d9eded81195e`.
- Content, calculation/date/CSV, HTML/schema/accessibility and rendered Chromium gates: PASS.
- Production and public versioned JS verification: PASS.
- Rollback preserved.

### Time Card `/time-card-calculator/` — VERIFIED release
- Remediation PR #79: `29e5ea18482c05ad9ad1a826f4a903ae33ff8f31`.
- Cache-bust PR #80: `bebc8535d804540256d09c374315759e59f2c77d`.
- Content, JS syntax, calculation, HTML/schema/accessibility and rendered-mobile gates: PASS.
- Public page/versioned JS verification: PASS.
- Rollback preserved.

## Traffic / research status

Existing same-day research remains available for future explicitly approved single-page work:
- Decimal Hours remediation spec is implementation-ready.
- Salary Increase remediation spec is implementation-ready.
- Other pages must still be treated as separate release units and must not be started without user approval.

## Deployment / indexing status

- The global header/navigation shared release is deployed across all 34 canonical pages.
- All 34 production canonical HTML files reference the verified versioned header CSS and search JS.
- Homepage, Time Card and Timesheet Template strict remediation releases are deployed.
- All three were existing canonical URLs; no new URL was introduced.
- Sitemap remains 34 canonical URLs.
- No indexing request should be represented as completed unless a write-capable Search Console action is actually executed and verified.

## Blockers / unknowns

- GitHub Actions: BLOCKED by exhausted quota.
- The ZT workspace is partial; full-site results from it must not be treated as a complete repository mirror.
- Standard Lighthouse-container outbound DNS/networking is restricted, but true public Chromium/Lighthouse can be run with an ephemeral host-network container; this method was VERIFIED for the homepage and the shared-header release.
- Immediate public Lighthouse scores after the header release were high-variance, so short-run public lab scores are not treated as causal evidence; deterministic isolated A/B performance passed. Fresh field CWV impact remains UNKNOWN until real field data is available.
- Search Console's previously observed submitted sitemap count lagged the 34-URL live sitemap; the live sitemap itself had no errors/warnings in the last verified data.

## Technical debt

- Restore normal GitHub Actions as the required CI path when quota/capacity returns.
- Correct private-repo authentication/bootstrap if the ZT workspace is expected to become a full authoritative checkout.
- Continue page-specific remediation only; do not batch unrelated calculator/content changes.

## In progress

No page is currently in implementation.

## NEXT ACTION

Wait for explicit user approval before starting or continuing any next public page. The shared-header task is complete; do not begin another page automatically after this report.
