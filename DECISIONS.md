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


## 2026-10-04 — Time Duration canonical migration

The former /elapsed-time-calculator/ intent is consolidated into /time-duration-calculator/ rather than maintained as a second near-identical calculator. The HTTPS old URL must remain a permanent one-hop 301 to the new canonical. Internal links, sitemap, site search and llms point only to the new canonical; "elapsed time calculator" remains a secondary semantic target on the new page. The persistent redirect source of truth is tracked at ops/nginx/hostedtimesheets.com.conf and deployed through the outer ZetoPanel Nginx vhost.


## 2026-10-04 — Do not bypass GitHub Actions runner failures

The required Content Quality gate must remain authoritative even when GitHub Actions fails before job execution.

Evidence:
- PR #60 run #58 failed twice with zero steps and no downloadable log blob.
- Clean current-main replacement PR #62 run #59 failed the same way.
- A control re-run of previously successful Clock Out Content Quality run #48 also failed before step 1.

Decision:
- Classify the current condition as an external GitHub Actions execution blocker, not a content-quality failure.
- Do not merge/deploy PR #62 while the required check is red.
- Keep productive work limited to non-production research/planning until Actions can execute the gate normally.


## 2026-10-04 — Time Card owns the broad Timesheet Calculator synonym cluster

Fresh U.S. keyword/SERP research shows that “time card calculator,” “timesheet calculator,” “time sheet calculator,” and “free timesheet calculator” substantially resolve to the same product class and often the same ranking pages.

Decision:
- Do not create /timesheet-calculator/ now.
- Keep /time-card-calculator/ as the canonical broad owner for the synonym cluster and retarget its title/H1/content after the required Actions gate is healthy.
- Keep /weekly-timesheet-calculator/, /biweekly-timesheet-calculator/, /timesheet-calculator-with-lunch/ and /timesheet-pay-calculator/ as specialist intent owners.
- Do not redirect specialists without first-party GSC evidence of actual cannibalization.
- Preserve one-shift-per-day on the broad Time Card page; split shifts remain a distinguishing feature of the Weekly specialist.


## 2026-10-04 — Homepage traffic priority order

Fresh U.S. demand and monetization research shows the homepage's current Lunch Timesheet emphasis is no longer traffic-optimal.

Decision after release-gate recovery:
- Time Card & Timesheet becomes the broad Timesheets owner and primary homepage timesheet link.
- Clock Out and Work Hours receive first-tier prominence.
- Time Duration and Military Time form an explicit Time Converters group.
- Salary Increase is promoted ahead of Salary to Hourly because its verified demand/CPC/SD profile is materially stronger.
- Overtime remains a first-tier payroll tool.
- Timesheet With Lunch remains a specialist, not the homepage flagship.
- Do not deploy these homepage changes until PR #62 and the broad Time Card owner are safely released.
