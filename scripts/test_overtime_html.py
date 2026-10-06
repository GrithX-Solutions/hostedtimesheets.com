#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "overtime-calculator" / "index.html").read_text()

assert len(re.findall(r"<h1\b", source, re.I)) == 1
assert "<title>Overtime Calculator — Pay, Time-and-a-Half &amp; Double Time</title>" not in source
assert "<title>Overtime Calculator — Pay, Time-and-a-Half &amp; Double Time</title>" in source
assert "<h1>Overtime Calculator</h1>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/overtime-calculator/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert '"dateModified":"2026-10-06"' in source
assert '<a class="skip-link" href="#main">Skip to content</a>' in source
assert '<main id="main">' in source

for token in (
    'id="ot-mode"',
    '<option value="total">Total hours + threshold</option>',
    '<option value="classified">Already-classified hours</option>',
    'id="ot-rate"',
    'id="ot-multiplier"',
    'id="ot-total"',
    'id="ot-threshold"',
    'id="ot-regular-input"',
    'id="ot-overtime-input"',
    'id="ot-double-input"',
    'id="ot-double-multiplier"',
    'id="ot-status"',
    'role="status"',
    'aria-live="polite"',
    'id="ot-total-out"',
    'id="ot-regular-hours"',
    'id="ot-hours"',
    'id="ot-double-hours"',
    'id="ot-regular-pay"',
    'id="ot-pay"',
    'id="ot-double-pay"',
    'id="ot-gross"',
    'id="ot-formula"',
    'id="ot-copy"',
    'id="ot-example"',
    'id="ot-double-example"',
    'id="ot-reset"',
    'overtime-calculator.js?v=20261006-remediation1',
):
    assert token in source, token

for error_id in (
    "ot-total-error",
    "ot-rate-error",
    "ot-threshold-error",
    "ot-multiplier-error",
    "ot-regular-input-error",
    "ot-overtime-input-error",
    "ot-double-input-error",
    "ot-double-multiplier-error",
):
    assert f'id="{error_id}"' in source

json_ld = [
    json.loads(block)
    for block in re.findall(
        r'<script type="application/ld\+json">(.*?)</script>', source, re.S
    )
]
types = []
for item in json_ld:
    if isinstance(item, dict) and "@graph" in item:
        types.extend(node.get("@type") for node in item["@graph"])
    elif isinstance(item, dict):
        types.append(item.get("@type"))

for required in ("Organization","WebSite","WebPage","BreadcrumbList","WebApplication","FAQPage"):
    assert required in types, required

graph = next(item["@graph"] for item in json_ld if isinstance(item, dict) and "@graph" in item)
page = next(item for item in graph if item.get("@type") == "WebPage")
faq = next(item for item in json_ld if item.get("@type") == "FAQPage")
assert page["url"] == "https://hostedtimesheets.com/overtime-calculator/"
assert page["name"] == "Overtime Calculator — Pay, Time-and-a-Half & Double Time"
assert page["dateModified"] == "2026-10-06"

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
assert len(visible) == 7
assert visible == schema, (visible, schema)

for link in (
    "/payroll-hours-calculator/",
    "/time-card-calculator/",
    "/work-hours-calculator/",
    "/weekly-timesheet-calculator/",
    "/salary-to-hourly-calculator/",
):
    assert link in source

assert "does not decide whether overtime or double time legally applies" in source
assert "does not calculate federal income tax" in source
assert "state law can differ" in source
assert 'id="ot-state"' not in source
assert 'id="ot-tax"' not in source
assert 'data-day' not in source
assert "/assets/css/design-v2.css?v=ee22a3c" in source
assert "/assets/js/site-search.js?v=ee22a3c" in source

print("Overtime HTML/schema/accessibility contract: PASS")
