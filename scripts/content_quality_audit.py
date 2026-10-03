#!/usr/bin/env python3
"""HostedTimesheets measurable content-quality gate.

This script intentionally checks only rules that can be measured reliably from static HTML.
Semantic superiority, competitor information gain, factual review, and native-English editorial
quality remain mandatory manual gates defined in CONTENT-STANDARDS.md.
"""
from pathlib import Path
import html
import re
import sys

ROOT = Path(__file__).resolve().parents[1]

LEGAL_OR_COMPANY = {
    "/", "/about/", "/contact/", "/privacy/", "/terms/", "/disclaimer/"
}

def page_url(path: Path) -> str:
    if path == ROOT / "index.html":
        return "/"
    return "/" + path.parent.name + "/"

def main_html(source: str) -> str:
    match = re.search(r"<main\b.*?</main>", source, re.I | re.S)
    return match.group(0) if match else source

def plain(fragment: str) -> str:
    fragment = re.sub(r"<script\b.*?</script>|<style\b.*?</style>", " ", fragment, flags=re.I | re.S)
    fragment = html.unescape(re.sub(r"<[^>]+>", " ", fragment))
    return re.sub(r"\s+", " ", fragment).strip()

def words(text: str):
    return re.findall(r"\b[A-Za-z][A-Za-z'’-]*\b", text)

def sentences(text: str):
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if len(s.strip()) > 2]

def passive_hits(text: str) -> int:
    pattern = r"\b(?:is|are|was|were|be|been|being|gets?|got)\s+(?:\w+ly\s+)?\w+(?:ed|en)\b"
    return len(re.findall(pattern, text, re.I))

def is_search_content(url: str) -> bool:
    return url not in LEGAL_OR_COMPANY

def audit(path: Path):
    source = path.read_text(errors="ignore")
    body = main_html(source)
    text = plain(body)
    ws = words(text)
    ss = sentences(text)
    slens = [len(words(s)) for s in ss]
    paragraphs = [
        plain(p) for p in re.findall(r"<p\b[^>]*>(.*?)</p>", body, re.I | re.S)
    ]
    plens = [len(words(p)) for p in paragraphs]
    url = page_url(path)
    search_page = is_search_content(url)

    h1 = len(re.findall(r"<h1\b", body, re.I))
    h2 = len(re.findall(r"<h2\b", body, re.I))
    h3 = len(re.findall(r"<h3\b", body, re.I))
    avg_sentence = (sum(slens) / len(slens)) if slens else 0
    passive_rate = passive_hits(text) / max(len(ws), 1) * 1000
    quick = bool(re.search(r"Quick answer", body, re.I))
    method = bool(re.search(r"Methodology|How (?:it|the .*?) works|formula", body, re.I))
    faq_count = len(re.findall(r"<details\b", body, re.I))
    examples = len(re.findall(r"\bexample\b", text, re.I))
    obvious_punct = (
        len(re.findall(r"[!?]{2,}", text))
        + len(re.findall(r"\s+[,.!?;:]", text))
    )

    failures = []
    warnings = []

    if h1 != 1:
        failures.append(f"expected exactly 1 H1, found {h1}")
    if max(plens or [0]) > 90:
        failures.append(f"paragraph exceeds 90 words (max {max(plens)})")
    if avg_sentence > 20:
        failures.append(f"average sentence length {avg_sentence:.1f} > 20 words")
    if sum(n > 32 for n in slens) > max(2, round(len(slens) * 0.10)):
        warnings.append(f"{sum(n > 32 for n in slens)} sentences exceed 32 words")
    if obvious_punct:
        failures.append(f"{obvious_punct} obvious punctuation-spacing/repetition issue(s)")

    if search_page:
        if len(ws) < 450:
            failures.append(f"search-targeted page has only {len(ws)} words of main content")
        if h2 + h3 < 3:
            failures.append("insufficient descriptive heading structure")
        if not quick:
            failures.append("missing Quick Answer")
        if not method:
            failures.append("missing explicit methodology/how-it-works/formula framing")
        if faq_count < 3:
            failures.append(f"needs at least 3 useful visible FAQs; found {faq_count}")
        if examples < 2:
            failures.append(f"needs at least 2 worked/example references; found {examples}")
        if passive_rate > 10:
            failures.append(f"passive-voice heuristic {passive_rate:.1f}/1000 words > 10")
    else:
        if passive_rate > 20:
            warnings.append(f"passive-voice heuristic {passive_rate:.1f}/1000 words")

    return {
        "url": url,
        "words": len(ws),
        "h2_h3": h2 + h3,
        "avg_sentence": avg_sentence,
        "max_paragraph": max(plens or [0]),
        "passive_rate": passive_rate,
        "faq": faq_count,
        "quick": quick,
        "method": method,
        "examples": examples,
        "failures": failures,
        "warnings": warnings,
    }

def main():
    pages = sorted(ROOT.glob("*/index.html")) + [ROOT / "index.html"]
    results = [audit(p) for p in pages]
    failed = [r for r in results if r["failures"]]

    print("HostedTimesheets content-quality audit")
    print(f"Pages checked: {len(results)}")
    print(f"Hard-rule failures: {len(failed)}")
    print()

    for r in results:
        status = "FAIL" if r["failures"] else "PASS"
        print(
            f"{status:4} {r['url']:<42} "
            f"words={r['words']:<4} avg-sentence={r['avg_sentence']:.1f} "
            f"max-paragraph={r['max_paragraph']:<3} passive/1k={r['passive_rate']:.1f} "
            f"faq={r['faq']}"
        )
        for issue in r["failures"]:
            print(f"     ERROR: {issue}")
        for warning in r["warnings"]:
            print(f"     WARN:  {warning}")

    print()
    print("Manual gates still required: semantic intent, current competitor review, information gain,")
    print("native-English editorial quality, factual accuracy, and rendered-page proofreading.")
    return 1 if failed else 0

if __name__ == "__main__":
    sys.exit(main())
