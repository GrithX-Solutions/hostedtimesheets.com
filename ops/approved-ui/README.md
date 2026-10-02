# Approved UI implementation — 2026-10-03

Approved desktop/mobile mockup implementation for hostedtimesheets.com.

- Production backup: `/opt/hostedtimesheets/site-pre-approved-mockup-20261003.tar.gz`
- Current site HTML, calculator runtimes, shared CSS, semantic search/mobile navigation, robots, sitemap, llms.txt and ads.txt were reconciled from production into GitHub.
- `assets/css/design-v2.css` is the approved visual layer and loads after `assets/css/site.css`.
- Existing calculator DOM IDs/data attributes, SEO/AEO content, structured data, canonicals, semantic sections and internal links were preserved.
- All 32 sitemap pages were publicly verified HTTP 200 after rollout.
- All 20 production JavaScript runtimes were verified against GitHub by Git blob SHA.
- IndexNow accepted the full-site submission with HTTP 200.
- Main reconciliation commit: `c2fb0f719c7922fc41aae1657cf1c07008c1dab8`.
- Bing verification and other server-only verification artifacts remain production-managed rather than duplicated as rollout artifacts.

## Backup/stale file protection

The production web root contains historical rollback copies from prior SEO/UI work. They remain on disk for recovery, but public access is blocked at the persistent outer reverse proxy.

- Active vhost: `/var/lib/zetopanel/nginx/conf.d/hostedtimesheets.com.conf`
- Pre-change vhost backup: `/var/lib/zetopanel/nginx/conf.d/hostedtimesheets.com.conf.pre-backup-deny-20261003`
- Denied filename patterns: `backup`, `.bak`, `.old`, `.orig`, `.tmp`, `.save`
- Verified behavior: normal calculator URL HTTP 200; historical backup URL HTTP 404.
