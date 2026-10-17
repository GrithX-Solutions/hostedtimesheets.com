# Hours Worked SEO Follow-Up — 2026-10-17

Status: PARTIALLY VERIFIED / RELEASE BLOCKED. Production is unchanged.

## Research
- OpenSEO project: bfcaa654-e852-4ad5-84ae-66a8e54fe078
- Crawl: 306f4cd8-4d4a-482e-ba05-45b7a4e345dc — 34/34 URLs HTTP 200, 0 critical, 0 warnings, 8 informational metadata findings. Guide description was 167 characters.
- 18/18 OpenSEO Lighthouse attempts failed to produce measurements (not performance scores).
- Full OpenSEO report: https://app.openseo.so/p/bfcaa654-e852-4ad5-84ae-66a8e54fe078/reports/494f32cd-1525-45c8-a659-42b9df324294
- GSC not connected to this new OpenSEO project. Google index/click/CTR/rank status UNKNOWN.
- Ubersuggest US: how to calculate hours worked volume 2,400, CPC $4.18, SD35. Broader calculate hours worked volume 135,000 SD29, mainly interactive intent. Domain DA9, 112 backlinks, 85 referring domains, estimated US traffic 0. Related guide query around position 90 in provider data (not GSC).
- Ubersuggest domain-level lab: mobile LCP 5.5s; desktop LCP 0.75s (not guide field CWV). Shared mobile site speed requires independent release.

## Isolated source
- Branch seo-hours-worked-20261017
- Exact tested code commit a3467433fbf82667e9b18a6787cbd96b0d1b77cb pushed to GitHub.
- Changed guide HTML meta/OG/Twitter/Article/WebPage descriptions, October 17 substantive modification date, DOL and Microsoft authoritative sources, Excel MOD single-shift limit; single sitemap lastmod updated October 17; HTML/browser tests aligned.
- Canonical/title/H1/FAQ count/calc boundaries/shared JS/CSS unchanged.
- HTML SHA256 379b8d10a8d72cdae2583908f17e0ee5c4910511b28ea109d9609931ec3e25ed.
- Sitemap SHA256 c9375d44f5cc40188da06399e470732ab8ab1455897ffb853ef94c879d9453f9.
- HTML/schema/formula contract PASS.
- Page-only content audit PASS, 0 failures/0 warnings (1,737 words, 25 headings, average sentence 14.97, longest paragraph 54, 8 FAQs).
- Mobile 390x844 and desktop 1280x900 Chromium regression 15/15 PASS.
- GitHub API create_branch 403 Resource not accessible by integration; create_pull_request 422 must be a collaborator. Alternate ZT git push succeeded, but PR/merge authorization BLOCKED.
- No merge, rollback-dependent production write, or Search Console indexing request occurred.

## NEXT ACTION
Restore PR/merge permission to GitHub integration on GrithX-Solutions/hostedtimesheets.com. Create PR from seo-hours-worked-20261017 into main, check exact head and diff, preserve HTML/sitemap rollback from active production /home/hostedtimesheets.com/public_html, merge after gates, deploy exact tested HTML and sitemap if necessary, verify live HTTP/canonical/schema/date/sitemap/mobile and update PROJECT_STATE.md and DECISIONS.md on main. Connect GSC in OpenSEO to measure true indexing/queries/positions. Do not start the next queued page until this release finishes.
