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
