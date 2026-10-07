#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "billable-hours-calculator" / "index.html").read_text()

assert len(re.findall(r"<h1\b", source, re.I)) == 1
assert "<h1>Billable Hours Calculator</h1>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/billable-hours-calculator/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert '"dateModified":"2026-10-07"' in source
assert '<a class="skip-link" href="#main">Skip to content</a>' in source
assert "<title>Billable Hours Calculator — Utilization, Revenue & Targets</title>" in source

for token in (
    'data-billable-hours',
    'id="bh-total"',
    'id="bh-billable"',
    'id="bh-rate"',
    'id="bh-currency"',
    'id="bh-target"',
    'id="bh-utilization"',
    'id="bh-nonbillable"',
    'id="bh-revenue"',
    'id="bh-effective-rate"',
    'id="bh-target-hours"',
    'id="bh-target-delta"',
    'id="bh-target-value"',
    'id="bh-value-delta"',
    'id="bh-formula"',
    'id="bh-status"',
    'role="status"',
    'id="bh-copy"',
    'id="bh-example"',
    'id="bh-reset"',
    'billable-hours.js?v=20261007-remediation1',
):
    assert token in source, token

for error_id in ("bh-total-error","bh-billable-error","bh-rate-error","bh-target-error"):
    assert f'id="{error_id}" hidden' in source, error_id

json_ld = [
    json.loads(block)
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', source, re.S)
]
webpage = next(item for item in json_ld if isinstance(item, dict) and item.get("@type") == "WebPage")
app = next(item for item in json_ld if isinstance(item, dict) and item.get("@type") == "WebApplication")
faq = next(item for item in json_ld if isinstance(item, dict) and item.get("@type") == "FAQPage")
assert webpage["url"] == "https://hostedtimesheets.com/billable-hours-calculator/"
assert webpage["dateModified"] == "2026-10-07"
assert app["url"] == "https://hostedtimesheets.com/billable-hours-calculator/"
assert "effective rate" in webpage["description"].lower()
assert "effective rate" in app["description"].lower()

def clean(fragment):
    return re.sub(r"<[^>]+>", "", html.unescape(fragment)).strip()

visible = [
    (clean(question), clean(answer))
    for question, answer in re.findall(r"<details><summary>(.*?)</summary><p>(.*?)</p></details>", source, re.S)
]
schema = [(item["name"], item["acceptedAnswer"]["text"]) for item in faq["mainEntity"]]
assert len(visible) == 8
assert visible == schema, (visible, schema)

assert 'style="min-width:0"' in source
assert "total worked hours as its denominator" in source.lower()
assert "does not perform FX conversion" in source
assert "does not convert the entered rate or apply exchange rates" in source
assert "/hours-and-minutes-calculator/" in source
assert "/decimal-hours-calculator/" in source
assert "/work-hours-calculator/" in source
assert "/timesheet-pay-calculator/" in source
assert 'id="bh-increment"' not in source
assert 'id="bh-rounding"' not in source
assert 'id="bh-invoice"' not in source
assert 'id="bh-tax"' not in source
assert 'id="bh-overtime"' not in source
assert "/assets/css/design-v2.css?v=ee22a3c" in source
assert "/assets/js/site-search.js?v=ee22a3c" in source

print("Billable Hours HTML/schema/accessibility contract: PASS")
