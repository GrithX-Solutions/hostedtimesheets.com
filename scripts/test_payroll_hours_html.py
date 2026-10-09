#!/usr/bin/env python3
from pathlib import Path
import html, json, re
ROOT=Path(__file__).resolve().parents[1]
source=(ROOT/"payroll-hours-calculator"/"index.html").read_text()
assert len(re.findall(r"<h1\b",source,re.I))==1
assert "<h1>Payroll Hours Calculator</h1>" in source
assert "<title>Payroll Hours Calculator — Calculate Payroll Hours & Pay</title>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/payroll-hours-calculator/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert '"dateModified":"2026-10-08"' in source
for token in ('data-payroll-hours','id="ph-rate"','id="ph-threshold"','id="ph-multiplier"','id="ph-total-decimal"','id="ph-status"','id="ph-copy"','id="ph-csv"','id="ph-print"','payroll-hours.js?v=20261009-badinput1'):
    assert token in source, token
assert len(re.findall(r'data-payroll-row',source))==7
blocks=[json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>',source,re.S)]
faq=next(x for x in blocks if isinstance(x,dict) and x.get("@type")=="FAQPage")
webpage=next(x for x in blocks if isinstance(x,dict) and x.get("@type")=="WebPage")
assert webpage["dateModified"]=="2026-10-08"
def clean(x): return re.sub(r"<[^>]+>","",html.unescape(x)).strip()
visible=[(clean(q),clean(a)) for q,a in re.findall(r"<details><summary>(.*?)</summary><p>(.*?)</p></details>",source,re.S)]
schema=[(x["name"],x["acceptedAnswer"]["text"]) for x in faq["mainEntity"]]
assert len(visible)==8
assert visible==schema,(visible,schema)
assert "does not invent a rounding rule" in source
assert "/work-hours-calculator/" in source
assert "/overtime-calculator/" in source
assert "/timesheet-pay-calculator/" in source
assert "clock-in, clock-out" in source
print("Payroll Hours HTML/schema/accessibility contract: PASS")
