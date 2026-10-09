#!/usr/bin/env python3
from pathlib import Path
import html, json, re

ROOT=Path(__file__).resolve().parents[1]
source=(ROOT/"salary-to-hourly-calculator"/"index.html").read_text()

assert len(re.findall(r"<h1\b",source,re.I))==1
assert "<h1>Salary to Hourly Calculator</h1>" in source
assert "<title>Salary to Hourly Calculator — Convert Annual Salary</title>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/salary-to-hourly-calculator/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert "salary-to-hourly.js?v=20261009-remediation1" in source

for token in (
    'data-salary-hourly',
    'id="sh-salary"',
    'id="sh-hours"',
    'id="sh-weeks"',
    'id="sh-days"',
    'id="sh-currency"',
    'id="sh-hourly"',
    'id="sh-daily"',
    'id="sh-weekly"',
    'id="sh-biweekly"',
    'id="sh-monthly"',
    'id="sh-annual-hours"',
    'id="sh-status"',
    'id="sh-copy"',
    'id="sh-print"',
    'id="sh-salary-error"',
    'id="sh-hours-error"',
    'id="sh-weeks-error"',
    'id="sh-days-error"',
):
    assert token in source, token

blocks=[json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>',source,re.S)]
graph=next(x for x in blocks if isinstance(x,dict) and "@graph" in x)
nodes=graph["@graph"]
webpage=next(x for x in nodes if x.get("@type")=="WebPage")
faq=next(x for x in nodes if x.get("@type")=="FAQPage")
assert webpage["dateModified"]=="2026-10-09"

def clean(x):
    return re.sub(r"<[^>]+>","",html.unescape(x)).strip()

visible=[(clean(q),clean(a)) for q,a in re.findall(r"<details><summary>(.*?)</summary><p>(.*?)</p></details>",source,re.S)]
schema=[(x["name"],x["acceptedAnswer"]["text"]) for x in faq["mainEntity"]]
assert len(visible)==8
assert visible==schema,(visible,schema)

for phrase in (
    "Paid weeks are not the same as calendar weeks worked",
    "average monthly equivalent is always annual salary divided by 12",
    "two of the paid workweeks you entered",
    "37.5-hour and nonstandard workweeks",
    "Convert monthly salary to hourly pay",
    "Currency changes formatting only",
):
    assert phrase in source, phrase

for link in (
    "/hourly-wage-calculator/",
    "/salary-calculator-with-bonus/",
    "/biweekly-pay-calculator/",
):
    assert link in source, link

assert 'id="sh-tax"' not in source
assert 'id="sh-state"' not in source
assert 'id="sh-overtime"' not in source

print("Salary to Hourly HTML/schema/accessibility contract: PASS")
