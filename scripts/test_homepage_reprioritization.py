#!/usr/bin/env python3
from pathlib import Path
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "index.html").read_text()

def clean(fragment):
    return re.sub(r"<[^>]+>", "", html.unescape(fragment)).strip()

assert "<title>Free Timesheet &amp; Work Hours Tools | Hosted Timesheets</title>" in source or "<title>Free Timesheet & Work Hours Tools | Hosted Timesheets</title>" in source
assert '<link rel="canonical" href="https://hostedtimesheets.com/">' in source
assert len(re.findall(r"<h1\b", source, re.I)) == 1

h1_match = re.search(r"<h1\b[^>]*>(.*?)</h1>", source, re.I | re.S)
assert h1_match
assert clean(h1_match.group(1)) == "Free Timesheet, Work Hours & Payroll Calculators"

hero = re.search(r'<section class="home-hero-v2">(.*?)</section>', source, re.S)
assert hero
hero_html = hero.group(1)
assert "<h2>Time Card &amp; Timesheet Calculator</h2>" in hero_html
assert 'href="/time-card-calculator/"' in hero_html
assert "Open Time Card Calculator" in hero_html
assert 'href="/timesheet-calculator-with-lunch/"' not in hero_html

categories = re.search(r'<section class="home-categories".*?</section>', source, re.S)
assert categories
category_links = re.findall(r'<a class="category-card" href="([^"]+)"', categories.group(0))
assert category_links == [
    "/time-card-calculator/",
    "/work-hours-calculator/",
    "/time-duration-calculator/",
    "/overtime-calculator/",
    "/salary-increase-calculator/",
    "/pto-accrual-calculator/",
], category_links

popular = re.search(r'<section class="home-section" id="tools">(.*?)</section>', source, re.S)
assert popular
popular_links = re.findall(r'<a class="popular-card" href="([^"]+)"', popular.group(0))
assert popular_links == [
    "/clock-out-time-calculator/",
    "/work-hours-calculator/",
    "/salary-increase-calculator/",
    "/overtime-calculator/",
    "/time-duration-calculator/",
    "/military-time-converter/",
], popular_links

for href in (
    "/time-card-calculator/",
    "/clock-out-time-calculator/",
    "/work-hours-calculator/",
    "/time-duration-calculator/",
    "/military-time-converter/",
    "/salary-increase-calculator/",
    "/overtime-calculator/",
    "/pto-accrual-calculator/",
):
    assert f'href="{href}"' in source, href

for specialist in (
    "/weekly-timesheet-calculator/",
    "/biweekly-timesheet-calculator/",
    "/timesheet-calculator-with-lunch/",
    "/timesheet-pay-calculator/",
    "/timesheet-template/",
):
    assert f'href="{specialist}"' in source, specialist

all_tools = re.search(r'<details class="all-tools-panel" id="all-tools">(.*?)</details>', source, re.S)
assert all_tools
assert 'href="/clock-out-time-calculator/"' in all_tools.group(1)
assert 'href="/military-time-converter/"' in all_tools.group(1)
assert all_tools.group(1).index("/salary-increase-calculator/") < all_tools.group(1).index("/salary-to-hourly-calculator/")

assert "@media(min-width:1081px){.home-v2 .popular-grid{grid-template-columns:repeat(6,1fr)}}" in source

json_ld = [
    json.loads(block)
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', source, re.S)
]
types = {item.get("@type") for item in json_ld}
assert "WebSite" in types
assert "WebPage" in types
page = next(item for item in json_ld if item.get("@type") == "WebPage")
assert page["url"] == "https://hostedtimesheets.com/"
assert page["dateModified"] == "2026-10-05"

print("Homepage reprioritization HTML contract: PASS")
