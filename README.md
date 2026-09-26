# HostedTimesheets.com

Static HTML/CSS/JavaScript website for free timesheet and work-hours tools.

## Architecture

- Plain HTML pages for every indexable SEO URL
- Shared CSS in `/assets/css/site.css`
- Browser-only calculator logic in `/assets/js/`
- No framework, database, API, account system, or build step required
- Designed for Apache/cPanel or any static hosting

## Current pages

- `/`
- `/timesheet-calculator-with-lunch/`
- `/about/`
- `/privacy/`
- `/terms/`

## Deployment

Upload the repository contents to the web root (for example `public_html`).
Make sure HTTPS is enabled and the canonical host is `https://hostedtimesheets.com`.

After deployment:

1. Verify `https://hostedtimesheets.com/robots.txt`
2. Verify `https://hostedtimesheets.com/sitemap.xml`
3. Add the domain property to Google Search Console
4. Submit the sitemap
5. Request indexing for the homepage and flagship calculator

## Roadmap

Next calculator pages:
- Biweekly Timesheet Calculator
- Timesheet Template
- Decimal Hours Calculator
- Work Hours Calculator
- Weekly Timesheet Calculator
