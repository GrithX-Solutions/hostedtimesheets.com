#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "clock-out-time-calculator" / "index.html").read_text()

assert len(re.findall(r"<h1\b", source, re.I)) == 1
assert "<title>Clock Out Time Calculator — Find Your Clock-Out Time</title>" in source
assert "<h1>Clock Out Time Calculator</h1>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/clock-out-time-calculator/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert '"dateModified":"2026-10-06"' in source
assert '<a class="skip-link" href="#main">Skip to content</a>' in source
assert '<main id="main">' in source
assert '<body class="clock-out-page">' in source

for token in (
    'id="co-start"',
    'id="co-hours"',
    'id="co-minutes"',
    'id="co-break"',
    'id="co-extra-break"',
    'id="co-status"',
    'role="status"',
    'aria-live="polite"',
    'id="co-time-12"',
    'id="co-time-24"',
    'id="co-day"',
    'id="co-paid"',
    'id="co-unpaid"',
    'id="co-span"',
    'id="co-formula"',
    'id="co-copy"',
    'id="co-now"',
    'id="co-example-standard"',
    'id="co-example-partial"',
    'id="co-example-overnight"',
    'id="co-reset"',
    'clock-out-time.js?v=20261006-remediation1',
):
    assert token in source, token

for error_id in (
    "co-start-error",
    "co-hours-error",
    "co-minutes-error",
    "co-break-error",
    "co-extra-break-error",
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
assert page["url"] == "https://hostedtimesheets.com/clock-out-time-calculator/"
assert page["name"] == "Clock Out Time Calculator — Find Your Clock-Out Time"
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
    "/work-hours-calculator/",
    "/time-card-calculator/",
    "/weekly-timesheet-calculator/",
    "/time-duration-calculator/",
    "/hours-and-minutes-calculator/",
    "/military-time-converter/",
):
    assert link in source

assert "does not decide break entitlement" in source
assert "daylight-saving" in source
assert "Additional unpaid break" in source
assert 'id="co-end"' not in source
assert 'id="co-rate"' not in source
assert 'id="co-overtime"' not in source
assert "/assets/css/design-v2.css?v=ee22a3c" in source
assert "/assets/js/site-search.js?v=ee22a3c" in source

print("Clock Out HTML/schema/accessibility contract: PASS")
