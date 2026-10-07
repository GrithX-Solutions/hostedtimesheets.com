#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "time-off-tracker" / "index.html").read_text()

assert len(re.findall(r"<h1\b", source, re.I)) == 1
assert "<h1>Time Off Tracker</h1>" in source
assert "<title>Free PTO & Time Off Tracker — Vacation & Leave</title>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/time-off-tracker/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert '"dateModified":"2026-10-07"' in source
assert '<a class="skip-link" href="#main">Skip to content</a>' in source

for token in (
    'data-timeoff',
    'id="to-unit"',
    'id="to-save"',
    'id="to-clear-saved"',
    'id="to-storage-status"',
    'id="to-opening"',
    'id="to-earned"',
    'id="to-used"',
    'id="to-scheduled"',
    'id="to-current"',
    'id="to-available"',
    'id="to-short-categories"',
    'id="to-shortfall"',
    'id="to-status"',
    'id="to-print"',
    'id="to-csv"',
    'id="to-copy"',
    'id="to-example"',
    'id="to-reset"',
    'time-off-tracker.js?v=20261007-remediation1',
):
    assert token in source, token

assert len(re.findall(r'data-error hidden', source)) == 16
assert len(re.findall(r'aria-invalid="false"', source)) >= 16
assert len(re.findall(r'data-timeoff-row', source)) == 4

json_ld = [
    json.loads(block)
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', source, re.S)
]
webpage = next(item for item in json_ld if isinstance(item, dict) and item.get("@type") == "WebPage")
app = next(item for item in json_ld if isinstance(item, dict) and item.get("@type") == "WebApplication")
faq = next(item for item in json_ld if isinstance(item, dict) and item.get("@type") == "FAQPage")
assert webpage["url"] == "https://hostedtimesheets.com/time-off-tracker/"
assert webpage["dateModified"] == "2026-10-07"
assert app["url"] == "https://hostedtimesheets.com/time-off-tracker/"
assert "hours or days" in app["description"].lower()

def clean(fragment):
    return re.sub(r"<[^>]+>", "", html.unescape(fragment)).strip()

visible = [
    (clean(question), clean(answer))
    for question, answer in re.findall(r"<details><summary>(.*?)</summary><p>(.*?)</p></details>", source, re.S)
]
schema = [(item["name"], item["acceptedAnswer"]["text"]) for item in faq["mainEntity"]]
assert len(visible) == 8
assert visible == schema, (visible, schema)

assert "Negative balances stay visible" in source
assert "does not convert existing values" in source
assert "local browser storage" in source
assert "does not submit those values to Hosted Timesheets" in source
assert "does not calculate PTO accrual automatically" in source
assert "/pto-accrual-calculator/" in source
assert "/hours-and-minutes-calculator/" in source
assert "Negative balances are shown as zero" not in source
assert 'id="to-employee"' not in source
assert 'id="to-approval"' not in source
assert 'id="to-accrual-rate"' not in source
assert 'id="to-carryover-rule"' not in source
assert "/assets/css/design-v2.css?v=ee22a3c" in source
assert "/assets/js/site-search.js?v=ee22a3c" in source

print("Time Off Tracker HTML/schema/accessibility contract: PASS")
