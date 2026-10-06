# HostedTimesheets Project State

Last verified: 2026-10-06T11:45:36+05:00

## Objective

Execute remediation one public page at a time. A page must complete research/evidence review, implementation, tests, alternate release validation, merge, rollback preservation, controlled deployment, live verification and state update before another page enters implementation.

User workflow rule:
- Work on exactly one public page at a time.
- Finish that page completely.
- Report results.
- Do not start the next page until the user explicitly approves it.
- An explicitly requested shared site-shell component such as the global header/navigation may be treated as one shared release unit across existing pages, but it must not bundle unrelated page content or calculator changes.

GitHub Actions remains BLOCKED because the Actions quota is exhausted. ZT MCP is the permanent contingency validation/execution path for GitHub-side infrastructure failures. GitHub-side quota/outage/service trouble alone must not stop approved project work. Never record Actions as PASS while the quota blocker remains; record the ZT evidence separately.

## Source / deployment

- Repository: GrithX-Solutions/hostedtimesheets.com
- Default branch: main
- Current deployed production-code commit after the iPhone/Safari Tools fix and cache-delivery follow-up: `2723ac026acf846394003585c8686aa54f119f11`. Subsequent docs/state-only continuity commits do not change production bytes.
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

The original shared-header release was PR #83 / PR #84. A user-reported real iPhone regression then proved the Tools panel was not usable in Safari/WebKit. PR #86 merged the iPhone/Safari Tools fix at `ee22a3ca3b06715fd35e761476ce34e21f3743fc`. PR #87 merged the 34-page shared-asset cache-key refresh at `2723ac026acf846394003585c8686aa54f119f11`.

The production shared header now:
- presents only the prominent Hosted Timesheets logo, Tools and Search controls;
- removes the redundant Home / Calculators / Guides / About header links from the visible navigation while preserving their page URLs and body/footer discoverability;
- removes the duplicate All Tools header CTA while retaining the categorized Tools menu;
- uses equal-height, aligned Tools and Search controls on desktop and mobile;
- opens Search directly below the sticky header;
- keeps Tools and Search mutually exclusive, keeps explicit `aria-expanded` state, and closes the open control on outside interaction;
- uses an iOS-safe absolute mobile Tools sheet instead of the WebKit-problematic fixed descendant;
- enlarges only the header logo; the footer logo remains unchanged;
- changes no calculator math, page copy, metadata, schema, canonical URL, sitemap URL or framework.

## Tests / evidence

### Fresh production re-verification — 2026-10-06 11:45 +05

- Completed release set rechecked: homepage `/`, `/time-card-calculator/`, `/timesheet-template/`, and the shared header/search assets.
- Exact GitHub main -> temporary verification snapshot -> production byte parity: **7 / 7 PASS**.
  - `index.html`: SHA-256 `1bfa626ca585f70d77d11a50320a91560461ed7be45cb44327a9d15c5b9f1dc9`.
  - `time-card-calculator/index.html`: SHA-256 `7a19108861b27056d02453f396928ea3dd4210116bca22991999c5f2e3376e3d`.
  - `assets/js/timesheet-calculator.js`: SHA-256 `573634199e6b81e82d97a0c5716a5fc10cbea3fd320f7b787833114a38490a0d`.
  - `timesheet-template/index.html`: SHA-256 `f3ed71ff078db9d9a300ff1576cfb0105373fae496e70402ded66e01e3afdcb4`.
  - `assets/js/timesheet-template.js`: SHA-256 `dc64570be58ae40c101478e4e297970a5f171aaf4431c6868bdddb259c3e21a3`.
  - `assets/css/design-v2.css`: SHA-256 `f17f9a1ff53ddc9c6e96ec407c39b1315c97a52b16e38d0e4b64e8bb265dbd97`.
  - `assets/js/site-search.js`: SHA-256 `d1f4f9fe5143401766aa3f8c24cd8e9d064d7e2e9df1feecafc2eb2f83518b9f`.
- Public HTTPS: homepage, Time Card and Timesheet Template all HTTP 200, self-canonical present, and final `ee22a3c` shared CSS/JS references present.
- Public shared CSS and search JS: HTTP 200 via Cloudflare and current bytes remain the verified production assets.
- Live iPhone 13 WebKit header re-verification: **PASS on all three completed pages**.
  - viewport / document width: 390 / 390 px; no horizontal overflow.
  - header logo: 150 x 30 px.
  - Tools: 72 x 40 px.
  - Search: 80 x 40 px.
  - Tools opens as an absolute 390 x 600 px sheet with 26 visible links.
  - Search opens correctly, returns Military Time Converter, and closes Tools.
  - browser console errors: 0; page errors: 0.
- Live desktop Chromium homepage/header: **PASS** at 1366 x 900.
  - logo: 260 x 52 px.
  - Tools: 96 x 46 px.
  - Search: 104 x 46 px.
  - no document-level horizontal overflow.
  - homepage hero still targets `/time-card-calculator/`.
- Live calculator functionality smoke:
  - Time Card Load Example -> 40.00 total hours, 2h 30m unpaid breaks, $1,000.00 gross pay, 0 invalid fields: PASS.
  - Timesheet Template 2026-10-05, 09:00-17:00, 30-minute break -> Monday, Oct 5 2026, 7h 30m row/period total, 1 completed row: PASS.
- Deployment decision: **no production rewrite was performed during this re-verification because exact deployed parity was already proven**. Avoiding an unnecessary redeploy preserved the known-good production state and rollback chain.
- Temporary verification files were removed after testing.

### Global header / shared navigation
- User-reported iPhone/Safari defect: VERIFIED and reproduced in Playwright WebKit with an iPhone 13 profile.
  - OLD production behavior: `details.open=true`, 26 links present, panel `display:grid`, but rendered fixed-panel height only **41 px**.
  - NEW behavior: explicit `.is-open` + `aria-expanded=true`, panel `position:absolute`, left 0 / right 390 / width 390, rendered height **600 px**.
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
- Current production shared assets after PR #86:
  - CSS SHA-256 `f17f9a1ff53ddc9c6e96ec407c39b1315c97a52b16e38d0e4b64e8bb265dbd97`.
  - JS SHA-256 `d1f4f9fe5143401766aa3f8c24cd8e9d064d7e2e9df1feecafc2eb2f83518b9f`.
- Safari-regression rollback preserves the immediately prior shared assets:
  - CSS SHA-256 `849872b454f9a51fb65c1946b1884648b20a6fb754d217e18f2c4f2d68c83ece`.
  - JS SHA-256 `1ee68d37ad49af470cddfa70b7c8c4a908bfabe0e86c26a569af6cb21d8fb6b8`.
  - Path: `/opt/hostedtimesheets/rollback/mobile-tools-safari-20261006/`.
- Cloudflare initially served the old unversioned asset hashes from HIT cache with `max-age=14400`; origin files were already correct.
- PR #87 mechanically refreshed the two shared asset references on all 34 canonical HTML pages:
  - `/assets/css/design-v2.css?v=ee22a3c`
  - `/assets/js/site-search.js?v=ee22a3c`
- Public CDN CSS and JS returned HTTP 200 and their SHA-256 hashes exactly matched the current production-origin files.
- Live sitemap/reference audit: 34 URLs, **34 PASS**, 0 missing new refs, 0 old `edd6654` refs.
- Live WebKit iPhone 13 verification on `/` and `/time-card-calculator/`: PASS.
  - Tools: 390 px viewport width, 600 px usable panel height, 26 visible links, no horizontal overflow.
  - Search/Tools mutual exclusion: PASS.
  - Console errors: 0; page errors: 0.
- HTML rollback for the PR #87 cache-reference refresh: `/opt/hostedtimesheets/rollback/mobile-tools-safari-20261006/html-before-cache-refresh`.
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

- The global header/navigation shared release, including the iPhone/Safari Tools correction, is deployed across all 34 canonical pages.
- All 34 live canonical URLs reference the verified `ee22a3c` header CSS and search JS; public asset bytes match origin exactly.
- Homepage, Time Card and Timesheet Template strict remediation releases are deployed and were freshly re-verified on 2026-10-06 with exact source parity and live functionality checks.
- All three were existing canonical URLs; no new URL was introduced.
- Sitemap remains 34 canonical URLs.
- No indexing request should be represented as completed unless a write-capable Search Console action is actually executed and verified.

## Blockers / unknowns

- GitHub Actions: BLOCKED by exhausted quota. Under the permanent contingency rule this is a CI-status blocker, not by itself a work/deployment blocker; ZT evidence is required for production-bound changes.
- The ZT workspace is partial; full-site results from it must not be treated as a complete repository mirror.
- Standard Lighthouse-container outbound DNS/networking is restricted, but true public Chromium/Lighthouse can be run with an ephemeral host-network container; this method was VERIFIED for the homepage and the shared-header release.
- Immediate public Lighthouse scores after the header release were high-variance, so short-run public lab scores are not treated as causal evidence; deterministic isolated A/B performance passed. Fresh field CWV impact remains UNKNOWN until real field data is available.
- Search Console's previously observed submitted sitemap count lagged the 34-URL live sitemap; the live sitemap itself had no errors/warnings in the last verified data.

## Technical debt

- Restore GitHub Actions as the normal primary CI runner when quota/capacity returns; keep ZT MCP as the permanent contingency path for future GitHub-side infrastructure failures.
- Correct private-repo authentication/bootstrap if the ZT workspace is expected to become a full authoritative checkout.
- Continue page-specific remediation only; do not batch unrelated calculator/content changes.

## In progress

No page is currently in implementation.

## NEXT ACTION

The shared-header/iPhone Tools task is complete and VERIFIED live. For the next explicitly approved public-page task, proceed one page at a time without stopping for GitHub-side infrastructure problems: use GitHub normally when available, otherwise use the permanent ZT contingency gate and synchronize the exact tested change back to GitHub as soon as service permits.
