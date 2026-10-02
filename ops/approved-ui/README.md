# Approved UI implementation — 2026-10-03

Approved desktop/mobile mockup implementation artifacts for hostedtimesheets.com.

- Production source of truth during this rollout: `/opt/hostedtimesheets/site`
- Production backup: `/opt/hostedtimesheets/site-pre-approved-mockup-20261003.tar.gz`
- UI payloads in this directory reconstruct the approved design layer, global header, homepage composition and footer.
- `design-v2.css` is deployed after the existing `site.css`.
- Existing calculator DOM IDs/data attributes, SEO content, structured data, canonical metadata, semantic sections and `site-search.js` were preserved.
- GitHub `main` predates newer production SEO/AEO work. Do not merge or redeploy stale HTML from `main` over production until the repository is reconciled from the current production snapshot.
- Public verification after rollout: homepage/CSS/search JS/calculator HTTP 200; all 32 sitemap URLs HTTP 200; IndexNow HTTP 200.
