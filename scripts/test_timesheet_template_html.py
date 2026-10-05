#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "timesheet-template" / "index.html").read_text()

assert len(re.findall(r"<h1\b", source, re.I)) == 1
assert '<link rel="canonical" href="https://hostedtimesheets.com/timesheet-template/">' in source
assert "<h1>Free Timesheet Template (Weekly &amp; Biweekly)</h1>" in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source

for token in (
    "<th>Date</th>",
    'id="tt-total"',
    'id="tt-week1-card"',
    'id="tt-week2-card"',
    'id="tt-valid-rows"',
    'id="tt-status"',
    'aria-live="polite"',
    'id="tt-print-employee"',
    'class="print-only tt-print-meta"',
    "timesheet-template.js?v=20261005-remediation1",
):
    assert token in source, token

assert 'value="30"' not in source

json_ld = [
    json.loads(block)
    for block in re.findall(
        r'<script type="application/ld\+json">(.*?)</script>', source, re.S
    )
]
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
assert len(visible) == 4
assert visible == schema, (visible, schema)

for href in (
    "/weekly-timesheet-calculator/",
    "/biweekly-timesheet-calculator/",
    "/timesheet-calculator-with-lunch/",
):
    assert f'href="{href}"' in source, href

print("Timesheet Template HTML/schema/accessibility contract: PASS")
