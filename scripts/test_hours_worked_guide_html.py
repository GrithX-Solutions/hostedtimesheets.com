#!/usr/bin/env python3
from pathlib import Path
import html, json, re

ROOT=Path(__file__).resolve().parents[1]
source=(ROOT/"how-to-calculate-hours-worked"/"index.html").read_text()

assert len(re.findall(r"<h1\b",source,re.I))==1
assert "<h1>How to Calculate Hours Worked</h1>" in source
assert "<title>How to Calculate Hours Worked (With Breaks & Examples)</title>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/how-to-calculate-hours-worked/">' in source
assert '<meta name="robots" content="index,follow,max-image-preview:large">' in source
assert "Work hours guide · Updated October 9, 2026" in source

blocks=[json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>',source,re.S)]
article=next(x for x in blocks if isinstance(x,dict) and x.get("@type")=="Article")
webpage=next(x for x in blocks if isinstance(x,dict) and x.get("@type")=="WebPage")
faq=next(x for x in blocks if isinstance(x,dict) and x.get("@type")=="FAQPage")
assert article["dateModified"]=="2026-10-09"
assert webpage["dateModified"]=="2026-10-09"

def clean(x):
    return re.sub(r"<[^>]+>","",html.unescape(x)).strip()

visible=[(clean(q),clean(a)) for q,a in re.findall(r"<details><summary>(.*?)</summary><p>(.*?)</p></details>",source,re.S)]
schema=[(x["name"],x["acceptedAnswer"]["text"]) for x in faq["mainEntity"]]
assert len(visible)==8
assert visible==schema,(visible,schema)

for token in (
    "A minutes-first method that is easy to audit",
    "How to calculate hours worked in Excel or Google Sheets",
    "=MOD(B2-A2,1)*24-(C2/60)",
    "=MOD(B2-A2,1)-(C2/1440)",
    "=SUM(D2:D8)",
    "How to calculate hours worked using a 24-hour clock",
    "What to do with missing or ambiguous punches",
    "1,440 minutes",
):
    assert token in source,token

for link in (
    "/work-hours-calculator/",
    "/weekly-timesheet-calculator/",
    "/timesheet-calculator-with-lunch/",
    "/decimal-hours-calculator/",
    "/hours-and-minutes-calculator/",
    "/minutes-to-decimal-hours/",
    "/payroll-hours-calculator/",
    "/overtime-calculator/",
):
    assert link in source,link

# Guide-only ownership: no page-specific interactive work-hours form was added.
main=re.search(r"<main\b.*?</main>",source,re.I|re.S).group(0)
assert 'id="start-time"' not in main
assert 'id="end-time"' not in main
assert 'data-work-hours' not in main

# Reproduce every core arithmetic example independently.
def minutes(h,m):
    return h*60+m

# 08:30 -> 17:15, 30m break = 495m = 8h15m = 8.25
net=minutes(17,15)-minutes(8,30)-30
assert net==495 and net/60==8.25

# 09:00 -> 17:30, 30m break = 480m = 8.00
net=minutes(17,30)-minutes(9,0)-30
assert net==480 and net/60==8.0

# 22:00 -> next-day 06:00, 30m break = 450m = 7.50
net=(minutes(6,0)+1440)-minutes(22,0)-30
assert net==450 and net/60==7.5

# 07:45 -> 16:20, 35m break = 480m = 8.00
net=minutes(16,20)-minutes(7,45)-35
assert net==480 and net/60==8.0

# Weekly table
weekly=sum([8.25,8.00,7.75,8.50,8.00])
assert weekly==40.50

print("Hours Worked guide HTML/schema/calculation contract: PASS")
