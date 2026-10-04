# HostedTimesheets.com

Static HTML/CSS/JavaScript website for free timesheet, work-hours, payroll, salary, PTO and time-conversion tools.

## Architecture

- Plain HTML for every indexable public URL
- Shared CSS in `/assets/css/`
- Calculator-specific browser JavaScript in `/assets/js/`
- No framework, database, account system or backend is required for the calculator arithmetic
- Canonical production host: `https://hostedtimesheets.com`

## Current sitemap

Verified repository sitemap: **34 public URLs**.

### Core / trust

- `/`
- `/about/`
- `/contact/`
- `/privacy/`
- `/terms/`
- `/disclaimer/`

### Timesheets / time cards

- `/time-card-calculator/`
- `/weekly-timesheet-calculator/`
- `/biweekly-timesheet-calculator/`
- `/timesheet-calculator-with-lunch/`
- `/timesheet-pay-calculator/`
- `/timesheet-template/`
- `/time-card-hours-with-lunch-break/`
- `/how-to-calculate-time-card/`

### Work hours / time

- `/work-hours-calculator/`
- `/clock-out-time-calculator/`
- `/hours-and-minutes-calculator/`
- `/time-duration-calculator/`
- `/military-time-converter/`
- `/decimal-hours-calculator/`
- `/minutes-to-decimal-hours/`
- `/how-to-calculate-hours-worked/`
- `/billable-hours-calculator/`

### Payroll / pay

- `/overtime-calculator/`
- `/payroll-hours-calculator/`
- `/hourly-wage-calculator/`
- `/salary-to-hourly-calculator/`
- `/salary-increase-calculator/`
- `/salary-calculator-with-bonus/`
- `/biweekly-pay-calculator/`

### PTO / leave

- `/pto-accrual-calculator/`
- `/pto-accrual-based-on-hours-worked/`
- `/how-to-calculate-pto-accrual/`
- `/time-off-tracker/`

## Canonical intent decisions

- `/time-card-calculator/` is the broad owner for the overlapping **time card calculator / timesheet calculator / time sheet calculator** intent cluster. Do not create a duplicate `/timesheet-calculator/` page without first-party GSC evidence of a distinct intent.
- `/time-duration-calculator/` is the canonical start/end duration owner. The retired `/elapsed-time-calculator/` production path redirects to it.
- `/decimal-hours-calculator/` owns interactive **hours/time to decimal** conversion. `/minutes-to-decimal-hours/` remains the chart/formula/spreadsheet guide.
- Weekly, biweekly, lunch-specific and pay-specific timesheet URLs remain distinct specialist pages.

See:
- `DECISIONS.md`
- `PROJECT_STATE.md`
- `TIMESHEET-ARCHITECTURE-2026-10-04.md`
- `DECIMAL-HOURS-ARCHITECTURE-2026-10-04.md`
- `HOMEPAGE-TRAFFIC-PRIORITY-2026-10-04.md`

## Deployment

Production is a static Nginx-served site. Verify the actual production source/deployment mechanism before any write; do not assume Apache/`.htaccess` controls the live site.

After a controlled release:

1. Verify the exact tested source snapshot was deployed.
2. Verify public HTTP status, canonical, schema and calculator assets.
3. Verify relevant internal links, sitemap and site-search discovery.
4. Verify redirects when a canonical migration is involved.
5. Preserve a tested rollback.
6. Update `PROJECT_STATE.md` with evidence and remaining blockers.
7. Request indexing only for material shipped changes when appropriate.

## Release gates

- Calculation accuracy is a release blocker.
- Public content must meet `CONTENT-STANDARDS.md`.
- Required GitHub Actions checks must execute and pass before production release.
- Do not bypass a red required check merely because the failure appears infrastructural; record the blocker and keep production unchanged.

## Current release blocker

GitHub Actions Content Quality execution is currently blocked before step 1 on the active shared site-search cache-bust release candidate. The blocker is documented in `PROJECT_STATE.md` and `DECISIONS.md`.

Production changes dependent on that gate must remain unmerged/unreleased until Actions executes normally.
