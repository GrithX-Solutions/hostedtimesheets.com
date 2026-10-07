#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "hourly-wage-calculator" / "index.html").read_text()

assert len(re.findall(r"<h1\b", source, re.I)) == 1
assert "<h1>Hourly Wage Calculator</h1>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/hourly-wage-calculator/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert '"dateModified":"2026-10-07"' in source
assert '<a class="skip-link" href="#main">Skip to content</a>' in source

for token in (
    'data-hourly-wage',
    'id="hw-rate"',
    'id="hw-hours"',
    'id="hw-weeks"',
    'id="hw-days"',
    'id="hw-currency"',
    'id="hw-ot-hours"',
    'id="hw-ot-multiplier"',
    'id="hw-rate-error"',
    'id="hw-hours-error"',
    'id="hw-weeks-error"',
    'id="hw-days-error"',
    'id="hw-ot-hours-error"',
    'id="hw-ot-multiplier-error"',
    'id="hw-daily"',
    'id="hw-weekly"',
    'id="hw-biweekly"',
    'id="hw-monthly"',
    'id="hw-annual"',
    'id="hw-ot-pay"',
    'id="hw-weekly-total"',
    'id="hw-annual-total"',
    'id="hw-formula"',
    'id="hw-status"',
    'role="status"',
    'id="hw-copy"',
    'id="hw-example"',
    'hourly-wage.js?v=20261007-remediation1',
):
    assert token in source, token

json_ld = [
    json.loads(block)
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', source, re.S)
]
graph = next(item["@graph"] for item in json_ld if isinstance(item, dict) and "@graph" in item)
types = [item.get("@type") for item in graph]
for required in ("Organization","WebSite","WebPage","BreadcrumbList","WebApplication","FAQPage"):
    assert required in types, required

page = next(item for item in graph if item.get("@type") == "WebPage")
faq = next(item for item in graph if item.get("@type") == "FAQPage")
assert page["url"] == "https://hostedtimesheets.com/hourly-wage-calculator/"
assert page["dateModified"] == "2026-10-07"

def clean(fragment):
    return re.sub(r"<[^>]+>", "", html.unescape(fragment)).strip()

visible = [
    (clean(question), clean(answer))
    for question, answer in re.findall(r"<details><summary>(.*?)</summary><p>(.*?)</p></details>", source, re.S)
]
schema = [(item["name"], item["acceptedAnswer"]["text"]) for item in faq["mainEntity"]]
assert len(visible) == 7
assert visible == schema, (visible, schema)

for link in (
    "/work-hours-calculator/",
    "/payroll-hours-calculator/",
    "/salary-increase-calculator/",
    "/salary-to-hourly-calculator/",
    "/biweekly-pay-calculator/",
    "/timesheet-pay-calculator/",
    "/overtime-calculator/",
):
    assert link in source

assert "Currency changes output formatting only" in source
assert "Regular plus overtime hours cannot exceed 168 hours" in source
assert "annual overtime estimate assumes" in source
assert "taxes, deductions, benefits" in source
assert 'id="hw-tax-rate"' not in source
assert 'id="hw-filing-status"' not in source
assert "/assets/css/design-v2.css?v=ee22a3c" in source
assert "/assets/js/site-search.js?v=ee22a3c" in source

print("Hourly Wage HTML/schema/accessibility contract: PASS")
