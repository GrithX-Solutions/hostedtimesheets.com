#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "military-time-converter" / "index.html").read_text()

assert len(re.findall(r"<h1\b", source, re.I)) == 1
assert "<h1>Military Time Converter</h1>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/military-time-converter/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert '"dateModified":"2026-10-06"' in source
assert '<body class="military-time-page">' in source
assert '<a class="skip-link" href="#main">Skip to content</a>' in source

for token in (
    'data-military-time',
    'id="mt-input"',
    'aria-describedby="mt-input-error"',
    'id="mt-input-error"',
    'id="mt-status"',
    'role="status"',
    'aria-live="polite"',
    'id="mt-military"',
    'id="mt-standard"',
    'id="mt-clock24"',
    'id="mt-label"',
    'id="mt-spoken"',
    'id="mt-formula"',
    'id="mt-now"',
    'id="mt-reset"',
    'id="mt-copy-military"',
    'id="mt-copy-standard"',
    'id="mt-print"',
    'military-time.js?v=20261006-remediation1',
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
assert page["url"] == "https://hostedtimesheets.com/military-time-converter/"
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

rows = re.findall(r"<tr><td><strong>\d{4}</strong></td><td>\d{2}:\d{2}</td><td>.*?</td><td>.*?</td></tr>", source)
assert len(rows) == 24, len(rows)

for link in (
    "/clock-out-time-calculator/",
    "/time-duration-calculator/",
    "/hours-and-minutes-calculator/",
    "/work-hours-calculator/",
    "/time-card-calculator/",
):
    assert link in source

assert "Military time is a clock format, not a time zone" in source
assert "Zulu time" in source
assert "Some references use 2400" in source
assert "No signup is required" in source
assert 'id="mt-timezone"' not in source
assert 'id="mt-utc"' not in source
assert 'id="mt-duration"' not in source
assert "body.military-time-page .calculator-section{display:none!important}" in source
assert "body.military-time-page .content-grid{display:grid!important" in source
assert "/assets/css/design-v2.css?v=ee22a3c" in source
assert "/assets/js/site-search.js?v=ee22a3c" in source

print("Military Time HTML/schema/accessibility contract: PASS")
