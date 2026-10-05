#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
css = (ROOT / "assets" / "css" / "design-v2.css").read_text()
js = (ROOT / "assets" / "js" / "site-search.js").read_text()

required_css = (
    "/* Global header simplification — 2026-10-05 */",
    'grid-template-areas:"brand tools search"',
    ".main-nav>a{display:none!important}",
    ".header-all-tools{display:none!important}",
    ".mobile-search-toggle::after{content:\"Search\"}",
    ".site-header.search-open .site-search{display:block!important}",
    ".brand-logo{",
)
for token in required_css:
    assert token in css, token

assert 'document.addEventListener("pointerdown",e=>' in js
assert 'if(header.classList.contains("search-open")&&!header.contains(e.target))setSearch(false);' in js

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
