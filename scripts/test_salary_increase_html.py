#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "salary-increase-calculator" / "index.html").read_text()

assert len(re.findall(r"<h1\b", source, re.I)) == 1
assert "<title>Salary Increase Calculator — Pay Raise & New Salary</title>" in source
assert "<h1>Salary Increase Calculator</h1>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/salary-increase-calculator/">' in source
assert '"dateModified":"2026-10-06"' in source

for token in (
    'id="si-mode"',
    '<option value="percent">Raise percentage</option>',
    '<option value="flat">Flat annual raise</option>',
    '<option value="compare">Compare salaries</option>',
    'id="si-current"',
    'id="si-percent"',
    'id="si-flat"',
    'id="si-new-input"',
    'id="si-hours"',
    'id="si-weeks"',
    'max="53"',
    'id="si-status"',
    'aria-live="polite"',
    'id="si-current-annual"',
    'id="si-new"',
    'id="si-annual-change"',
    'id="si-change"',
    'id="si-current-monthly"',
    'id="si-new-monthly"',
    'id="si-monthly-change"',
    'id="si-current-biweekly"',
    'id="si-new-biweekly"',
    'id="si-biweekly-change"',
    'id="si-current-weekly"',
    'id="si-new-weekly"',
    'id="si-weekly-change"',
    'id="si-old-hourly"',
    'id="si-new-hourly"',
    'id="si-hourly-change"',
    'id="si-annual-hours"',
    'salary-increase.js?v=20261006-remediation1',
):
    assert token in source, token

for error_id in (
    "si-current-error",
    "si-percent-error",
    "si-flat-error",
    "si-new-error",
    "si-hours-error",
    "si-weeks-error",
):
    assert f'id="{error_id}"' in source

json_ld = json.loads(
    re.search(r'<script type="application/ld\+json">(.*?)</script>', source, re.S).group(1)
)
graph = json_ld["@graph"]
types = [item.get("@type") for item in graph]
for required in ("Organization","WebSite","WebPage","BreadcrumbList","WebApplication","FAQPage"):
    assert required in types, required

page = next(item for item in graph if item.get("@type") == "WebPage")
assert page["url"] == "https://hostedtimesheets.com/salary-increase-calculator/"
assert page["name"] == "Salary Increase Calculator — Pay Raise & New Salary"
assert page["dateModified"] == "2026-10-06"

faq = next(item for item in graph if item.get("@type") == "FAQPage")

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

assert "/salary-calculator-with-bonus/" in source
assert "/salary-to-hourly-calculator/" in source
assert "weeks per year must be a whole number from 1 through 53" in source.lower()
assert "only hourly-equivalent outputs become unavailable" in source
assert "compare mode can produce positive, zero or negative change" in source.lower()

print("Salary Increase HTML/schema/accessibility contract: PASS")
