#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "time-card-calculator" / "index.html").read_text()

assert len(re.findall(r"<h1\\b", source, re.I)) == 1
assert '<link rel="canonical" href="https://hostedtimesheets.com/time-card-calculator/">' in source
assert "<h1>Time Card &amp; Timesheet Calculator</h1>" in source

for token in (
    'id="copy-monday"',
    'id="calculator-status"',
    'aria-live="polite"',
    'id="total-break"',
    "data-row-error",
    "Daily worked-time rounding",
):
    assert token in source, token

json_ld = [
    json.loads(block)
    for block in re.findall(
        r'<script type="application/ld\\+json">(.*?)</script>', source, re.S
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
assert visible == schema, (visible, schema)

for href in (
    "/weekly-timesheet-calculator/",
    "/biweekly-timesheet-calculator/",
    "/clock-out-time-calculator/",
    "/overtime-calculator/",
):
    assert f'href="{href}"' in source, href

print("Time Card HTML/schema/accessibility contract: PASS")
