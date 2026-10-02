# Approved UI implementation — 2026-10-03

Approved desktop/mobile mockup implementation for hostedtimesheets.com.

- Production backup: `/opt/hostedtimesheets/site-pre-approved-mockup-20261003.tar.gz`
- Current site HTML, calculator runtimes, shared CSS, semantic search/mobile navigation, robots, sitemap, llms.txt and ads.txt were reconciled from production into this branch.
- `assets/css/design-v2.css` is the approved visual layer and loads after `assets/css/site.css`.
- Existing calculator DOM IDs/data attributes, SEO/AEO content, structured data, canonicals, semantic sections and internal links were preserved.
- All 32 sitemap pages were publicly verified HTTP 200 after rollout.
- All 20 production JavaScript runtimes were verified against this branch by Git blob SHA.
- IndexNow accepted the full-site submission with HTTP 200.
- Temporary base64 rollout payloads were removed after reconciliation.
- Bing verification and other server-only verification artifacts remain production-managed rather than duplicated as rollout artifacts.
