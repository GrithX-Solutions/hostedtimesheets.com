#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "pto-accrual-calculator" / "index.html").read_text()

assert len(re.findall(r"<h1\b", source, re.I)) == 1
assert "<h1>PTO Accrual Calculator</h1>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/pto-accrual-calculator/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert '"dateModified":"2026-10-07"' in source
assert '<a class="skip-link" href="#main">Skip to content</a>' in source

for token in (
    'data-pto-accrual',
    'value="hours"',
    'value="period"',
    'value="annual"',
    'value="fixed"',
    'id="pto-current"',
    'id="pto-used"',
    'id="pto-carry"',
    'id="pto-cap"',
    'id="pto-day-hours"',
    'id="pto-rate"',
    'id="pto-worked"',
    'id="pto-periods"',
    'id="pto-per-period"',
    'id="pto-annual"',
    'id="pto-periods-year"',
    'id="pto-periods-elapsed"',
    'id="pto-fixed"',
    'id="pto-projected"',
    'id="pto-days"',
    'id="pto-earned"',
    'id="pto-cap-reduction"',
    'id="pto-used-out"',
    'id="pto-carry-out"',
    'id="pto-formula"',
    'id="pto-status"',
    'role="status"',
    'id="pto-copy"',
    'id="pto-example"',
    'pto-accrual.js?v=20261007-remediation1',
):
    assert token in source, token

for error_id in (
    "pto-current-error","pto-used-error","pto-carry-error","pto-cap-error","pto-day-hours-error",
    "pto-rate-error","pto-worked-error","pto-periods-error","pto-per-period-error",
    "pto-annual-error","pto-periods-year-error","pto-periods-elapsed-error","pto-fixed-error",
):
    assert f'id="{error_id}" hidden' in source, error_id

json_ld = [
    json.loads(block)
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', source, re.S)
]
faq = next(item for item in json_ld if isinstance(item, dict) and item.get("@type") == "FAQPage")
graph = next(item["@graph"] for item in json_ld if isinstance(item, dict) and "@graph" in item)
page = next(item for item in graph if item.get("@type") == "WebPage")
assert page["url"] == "https://hostedtimesheets.com/pto-accrual-calculator/"
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
assert "annual PTO allowance" in source
assert "Projected workdays" in source
assert "Cap reduction" in source
assert "final-balance cap" in source.lower()
assert "U.S. Department of Labor vacation-leave guidance" in source
assert "https://www.dol.gov/general/topic/benefits-leave/vacation_leave" in source
assert "/pto-accrual-based-on-hours-worked/" in source
assert "/how-to-calculate-pto-accrual/" in source
assert "/time-off-tracker/" in source
assert 'id="pto-state"' not in source
assert 'id="pto-payout"' not in source
assert 'id="pto-hourly-wage"' not in source
assert 'id="pto-waiting-period"' not in source
assert "/assets/css/design-v2.css?v=ee22a3c" in source
assert "/assets/js/site-search.js?v=ee22a3c" in source

print("PTO Accrual HTML/schema/accessibility contract: PASS")
