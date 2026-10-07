#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "salary-calculator-with-bonus" / "index.html").read_text()

assert len(re.findall(r"<h1\b", source, re.I)) == 1
assert "<h1>Salary Calculator With Bonus</h1>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/salary-calculator-with-bonus/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert '"dateModified":"2026-10-07"' in source
assert '<a class="skip-link" href="#main">Skip to content</a>' in source

for token in (
    'data-salary-bonus',
    'value="percent"',
    'value="fixed"',
    'value="target"',
    'id="sb-salary"',
    'id="sb-percent"',
    'id="sb-fixed"',
    'id="sb-target"',
    'id="sb-hours"',
    'id="sb-weeks"',
    'id="sb-currency"',
    'id="sb-total"',
    'id="sb-bonus"',
    'id="sb-bonus-pct"',
    'id="sb-monthly"',
    'id="sb-biweekly"',
    'id="sb-weekly"',
    'id="sb-base-hourly"',
    'id="sb-total-hourly"',
    'id="sb-formula"',
    'id="sb-status"',
    'role="status"',
    'id="sb-copy"',
    'id="sb-example"',
    'salary-bonus.js?v=20261007-remediation1',
):
    assert token in source, token

for error_id in (
    "sb-salary-error","sb-percent-error","sb-fixed-error",
    "sb-target-error","sb-hours-error","sb-weeks-error",
):
    assert f'id="{error_id}" hidden' in source, error_id

json_ld = [
    json.loads(block)
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', source, re.S)
]
graph = next(item["@graph"] for item in json_ld if isinstance(item, dict) and "@graph" in item)
page = next(item for item in graph if item.get("@type") == "WebPage")
faq = next(item for item in graph if item.get("@type") == "FAQPage")
assert page["url"] == "https://hostedtimesheets.com/salary-calculator-with-bonus/"
assert page["dateModified"] == "2026-10-07"

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
assert "Target total compensation" in source
assert "Currency changes number formatting only" in source
assert "no exchange-rate conversion" in source
assert "/salary-increase-calculator/" in source
assert "/salary-to-hourly-calculator/" in source
assert "/hourly-wage-calculator/" in source
assert "/biweekly-pay-calculator/" in source
assert 'id="sb-tax"' not in source
assert 'id="sb-withholding"' not in source
assert 'id="sb-equity"' not in source
assert 'id="sb-commission"' not in source
assert 'id="sb-state"' not in source
assert "/assets/css/design-v2.css?v=ee22a3c" in source
assert "/assets/js/site-search.js?v=ee22a3c" in source

print("Salary Bonus HTML/schema/accessibility contract: PASS")
