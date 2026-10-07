#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "hours-and-minutes-calculator" / "index.html").read_text()

assert len(re.findall(r"<h1\\b", source, re.I)) == 1
assert "<h1>Hours & Minutes Calculator</h1>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/hours-and-minutes-calculator/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert '"dateModified":"2026-10-07"' in source
assert '<a class="skip-link" href="#main">Skip to content</a>' in source
assert "<title>Hours & Minutes Calculator — Add, Subtract & Total Time</title>" in source

for token in (
    'data-hours-minutes',
    'value="convert"',
    'value="add"',
    'value="subtract"',
    'value="multi"',
    'id="hm-hours"',
    'id="hm-minutes"',
    'id="hm-hours-2"',
    'id="hm-minutes-2"',
    'id="hm-op-2"',
    'id="hm-rate"',
    'id="hm-currency"',
    'id="hm-extra-wrap"',
    'id="hm-extra-rows"',
    'id="hm-add-row"',
    'id="hm-total-minutes"',
    'id="hm-decimal"',
    'id="hm-hours-display"',
    'id="hm-pay"',
    'id="hm-formula"',
    'id="hm-status"',
    'role="status"',
    'id="hm-copy-minutes"',
    'id="hm-copy-decimal"',
    'id="hm-copy-result"',
    'id="hm-example"',
    'id="hm-reset"',
    'hours-minutes.js?v=20261007-remediation1',
):
    assert token in source, token

for error_id in (
    "hm-hours-error","hm-minutes-error","hm-hours-2-error",
    "hm-minutes-2-error","hm-rate-error",
):
    assert f'id="{error_id}" hidden' in source, error_id

json_ld = [
    json.loads(block)
    for block in re.findall(r'<script type="application/ld\\+json">(.*?)</script>', source, re.S)
]
webpage = next(item for item in json_ld if isinstance(item, dict) and item.get("@type") == "WebPage")
app = next(item for item in json_ld if isinstance(item, dict) and item.get("@type") == "WebApplication")
faq = next(item for item in json_ld if isinstance(item, dict) and item.get("@type") == "FAQPage")
assert webpage["url"] == "https://hostedtimesheets.com/hours-and-minutes-calculator/"
assert webpage["dateModified"] == "2026-10-07"
assert app["url"] == "https://hostedtimesheets.com/hours-and-minutes-calculator/"
assert "Add, subtract or total time durations" in webpage["description"]
assert "Add, subtract or total time durations" in app["description"]

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
assert "Add/subtract multiple durations" in source
assert "up to 10 durations" in source
assert "currency changes number formatting only" in source.lower()
assert "does not convert the entered rate or apply exchange rates" in source
assert "/time-duration-calculator/" in source
assert "/work-hours-calculator/" in source
assert "/decimal-hours-calculator/" in source
assert "/minutes-to-decimal-hours/" in source
assert 'id="hm-decimal-input"' not in source
assert 'id="hm-start-time"' not in source
assert 'id="hm-end-time"' not in source
assert 'id="hm-break"' not in source
assert 'id="hm-overtime"' not in source
assert 'id="hm-tax"' not in source
assert "/assets/css/design-v2.css?v=ee22a3c" in source
assert "/assets/js/site-search.js?v=ee22a3c" in source

print("Hours & Minutes HTML/schema/accessibility contract: PASS")
