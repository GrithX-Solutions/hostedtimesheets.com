#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "work-hours-calculator" / "index.html").read_text()

assert len(re.findall(r"<h1\b", source, re.I)) == 1
assert "<title>Free Work Hours Calculator — Hours, Breaks & Pay</title>" in source
assert "<h1>Work Hours Calculator</h1>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/work-hours-calculator/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert '"dateModified":"2026-10-06"' in source
assert '<a class="skip-link" href="#main">Skip to content</a>' in source
assert '<main id="main">' in source

for token in (
    'id="wh-start"',
    'id="wh-end"',
    'id="wh-break"',
    'step="1" value="30"',
    'id="wh-days"',
    'min="1" max="31" step="1"',
    'id="wh-rate"',
    'placeholder="Leave blank for no pay estimate"',
    'id="wh-status"',
    'role="status"',
    'aria-live="polite"',
    'id="wh-gross"',
    'id="wh-daily-time"',
    'id="wh-daily"',
    'id="wh-total-time"',
    'id="wh-weekly"',
    'id="wh-minutes"',
    'id="wh-pay"',
    'id="wh-formula"',
    'id="wh-copy"',
    'id="wh-example"',
    'id="wh-overnight"',
    'id="wh-reset"',
    'work-hours.js?v=20261006-remediation1',
):
    assert token in source, token

assert 'id="wh-rate" type="number" min="0" step=".01" value=' not in source

for error_id in (
    "wh-start-error",
    "wh-end-error",
    "wh-break-error",
    "wh-days-error",
    "wh-rate-error",
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
faq = next(item for item in graph if item.get("@type") == "FAQPage")
assert page["url"] == "https://hostedtimesheets.com/work-hours-calculator/"
assert page["name"] == "Free Work Hours Calculator — Hours, Breaks & Pay"
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
    "/time-card-calculator/",
    "/weekly-timesheet-calculator/",
    "/decimal-hours-calculator/",
    "/overtime-calculator/",
):
    assert link in source

assert "one repeated shift pattern" in source
assert "Identical start and end times return zero" in source
assert "floors net daily time at zero" in source
assert "does not determine whether a break should be paid" in source

print("Work Hours HTML/schema/accessibility contract: PASS")
