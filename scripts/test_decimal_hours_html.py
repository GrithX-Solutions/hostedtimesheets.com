#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "decimal-hours-calculator" / "index.html").read_text()

assert len(re.findall(r"<h1\b", source, re.I)) == 1
assert "<title>Hours to Decimal Calculator — Time to Decimal Hours</title>" in source
assert "<h1>Hours to Decimal Calculator</h1>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/decimal-hours-calculator/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert '"dateModified":"2026-10-06"' in source

for token in (
    'name="dh-mode"',
    'value="time-to-decimal" checked',
    'value="decimal-to-time"',
    'id="dh-hours"',
    'id="dh-minutes"',
    'id="dh-seconds"',
    'id="dh-decimal-input"',
    'id="dh-precision"',
    'id="dh-rate"',
    'id="dh-primary"',
    'id="dh-total-minutes"',
    'id="dh-total-seconds"',
    'id="dh-pay"',
    'id="dh-status"',
    'aria-live="polite"',
    'decimal-hours.js?v=20261006-remediation1',
):
    assert token in source, token

assert 'id="dh-rate" type="number" min="0" step=".01" placeholder=' in source
assert 'id="dh-rate" type="number" min="0" step=".01" value=' not in source
assert '/minutes-to-decimal-hours/' in source
assert '/time-duration-calculator/' in source
assert 'data-dh-precision-wrap' in source
assert "nearest whole second" in source

json_ld = [
    json.loads(block)
    for block in re.findall(
        r'<script type="application/ld\+json">(.*?)</script>', source, re.S
    )
]
types = [item.get("@type") for item in json_ld]
assert "WebApplication" in types
assert "BreadcrumbList" in types
assert "FAQPage" in types
assert "WebPage" in types

faq = next(item for item in json_ld if item.get("@type") == "FAQPage")

def clean(fragment):
    return re.sub(r"<[^>]+>", "", html.unescape(fragment)).strip()

visible = [
    (clean(question), clean(answer))
    for question, answer in re.findall(
        r"<details><summary>(.*?)</summary><p>(.*?)</p></details>", source, re.S
    )
]
schema = [
    (item["name"], item["acceptedAnswer"]["text"])
    for item in faq["mainEntity"]
]
assert len(visible) == 6
assert visible == schema, (visible, schema)

page = next(item for item in json_ld if item.get("@type") == "WebPage")
assert page["url"] == "https://hostedtimesheets.com/decimal-hours-calculator/"
assert page["name"] == "Hours to Decimal Calculator — Time to Decimal Hours"

print("Decimal Hours HTML/schema/accessibility contract: PASS")
