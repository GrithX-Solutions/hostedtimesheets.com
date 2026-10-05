#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
css = (ROOT / "assets" / "css" / "design-v2.css").read_text()
js = (ROOT / "assets" / "js" / "site-search.js").read_text()

required_css = (
    "/* Global header simplification — 2026-10-05 */",
    'grid-template-areas:"brand tools search"',
    ".site-header .main-nav>a{display:none!important}",
    ".header-all-tools{display:none!important}",
    ".mobile-search-toggle::after{content:\"Search\"}",
    ".site-header.search-open .site-search{display:block!important}",
    ".site-header .brand-logo{",
    "position:absolute!important;",
    "max-height:calc(100dvh - 70px)!important;",
    ".nav-menu.is-open .nav-panel{display:grid!important}",
)
for token in required_css:
    assert token in css, token

assert 'const setMenu=open=>' in js
assert 'menuSummary.addEventListener("click",event=>' in js
assert 'event.preventDefault();' in js
assert 'menu.classList.toggle("is-open",next);' in js
assert 'menuSummary.setAttribute("aria-expanded",String(next));' in js
assert 'if(menu&&menu.open&&!menu.contains(event.target))setMenu(false);' in js
assert 'if(header.classList.contains("search-open")&&!header.contains(event.target))setSearch(false);' in js

for relative in ("index.html", "time-card-calculator/index.html", "timesheet-template/index.html"):
    source = (ROOT / relative).read_text()
    for token in (
        'class="site-header"',
        'class="brand-logo"',
        'class="mobile-search-toggle"',
        'class="nav-menu"',
        'class="site-search"',
        'id="site-tool-search"',
        '/assets/css/design-v2.css',
        '/assets/js/site-search.js',
    ):
        assert token in source, f"{relative}: {token}"

print("Global header static contract: PASS")
