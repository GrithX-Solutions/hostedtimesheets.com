#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "time-duration-calculator" / "index.html").read_text()

assert len(re.findall(r"<h1\b", source, re.I)) == 1
assert "<h1>Time Duration Calculator</h1>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/time-duration-calculator/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert '"dateModified":"2026-10-06"' in source
assert '<body class="time-duration-page">' in source
assert '<a class="skip-link" href="#main">Skip to content</a>' in source

for token in (
    'data-time-duration',
    'id="td-mode"',
    'id="td-start-date"',
    'id="td-start-time"',
    'id="td-end-date"',
    'id="td-end-time"',
    'id="td-break"',
    'id="td-start-date-error"',
    'id="td-start-time-error"',
    'id="td-end-date-error"',
    'id="td-end-time-error"',
    'id="td-break-error"',
    'id="td-duration"',
    'id="td-decimal"',
    'id="td-days"',
    'id="td-minutes"',
    'id="td-seconds"',
    'id="td-net"',
    'id="td-net-decimal"',
    'id="td-status"',
    'role="status"',
    'id="td-copy"',
    'id="td-example-overnight"',
    'id="td-example-multiday"',
    'time-duration.js?v=20261006-remediation1',
):
    assert token in source, token

json_ld = [
    json.loads(block)
    for block in re.findall(
        r'<script type="application/ld\+json">(.*?)</script>', source, re.S
    )
]
graph = next(item["@graph"] for item in json_ld if isinstance(item, dict) and "@graph" in item)
types = [item.get("@type") for item in graph]
for required in ("Organization","WebSite","WebPage","BreadcrumbList","WebApplication","FAQPage"):
    assert required in types, required

page = next(item for item in graph if item.get("@type") == "WebPage")
faq = next(item for item in graph if item.get("@type") == "FAQPage")
assert page["url"] == "https://hostedtimesheets.com/time-duration-calculator/"
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
assert len(visible) == 8
assert visible == schema, (visible, schema)

for link in (
    "/military-time-converter/",
    "/hours-and-minutes-calculator/",
    "/work-hours-calculator/",
    "/time-card-calculator/",
    "/decimal-hours-calculator/",
    "/clock-out-time-calculator/",
):
    assert link in source

assert "matching start and end times produce a zero duration" in source
assert "Negative and fractional break minutes are rejected" in source
assert "No signup is required" in source
assert "timezone-aware system" in source
assert 'id="td-timezone"' not in source
assert 'id="td-countdown"' not in source
assert 'id="td-add-duration"' not in source
assert 'id="td-pay-rate"' not in source
assert "/assets/css/design-v2.css?v=ee22a3c" in source
assert "/assets/js/site-search.js?v=ee22a3c" in source

print("Time Duration HTML/schema/accessibility contract: PASS")
