# Military Time Converter Remediation Spec — 2026-10-06

## Objective

Remediate `/military-time-converter/` as the canonical military-time / 24-hour / standard-time conversion and military-time-chart page. Preserve the existing smart single-input workflow, strengthen validation and rendered behavior, and add useful spoken-time output without expanding into timezone, UTC/Zulu conversion, duration math or shift/payroll logic.

## Verified source baseline

- GitHub `main`: `9f57bfd6599bef79111e445736599044ae66de04`.
- Canonical URL: `https://hostedtimesheets.com/military-time-converter/`.
- Existing runtime parses compact military time, colon-form 24-hour time, AM/PM time, `noon` and `midnight`.
- Existing runtime rejects malformed/out-of-range values but only replaces output text; it does not expose a field-level invalid state, accessible error message or status update.
- Existing page contains a 24-row whole-hour chart and page-scoped print behavior.

## Fresh demand evidence

Ubersuggest U.S. checked 2026-10-06:

| Query | Volume | CPC | SD |
| --- | ---: | ---: | ---: |
| military time converter | 74,000 | $0.11 | 22 |
| military time chart | 135,000 | $0.31 | 28 |
| military time calculator | 2,400 | $0 | 49 |
| standard time to military time | 1,600 | $0 | 25 |
| military time to standard time | 1,600 | $0 | 38 |
| 24 hour to 12 hour converter | 1,900 | $0 | 24 |

Current Ubersuggest SERP includes CalculatorSoup, ClockIt, TheTimeNow, MilitaryTimeChart, TimeRewards and ASA. TimeRewards remains a low-authority specialist example at PA 20 with 0 backlinks/referring domains reported for the ranking URL.

## Current public competitor evidence

Fresh public review on 2026-10-06 shows common features:
- two-way 12-hour / 24-hour conversion;
- full or dense conversion charts;
- current-time controls;
- copy controls;
- pronunciation/spoken output on several current tools;
- explicit midnight/noon handling;
- some tools expand into military zone letters / Zulu conversion.

## Canonical / cannibalization decision

This URL owns:
- military time converter;
- military time chart;
- standard time to military time;
- military time to standard time;
- 24-hour to 12-hour notation conversion.

Keep separate:
- `/time-duration-calculator/` — elapsed duration.
- `/hours-and-minutes-calculator/` — duration arithmetic.
- `/clock-out-time-calculator/` — projected shift end.
- timezone / city / UTC / Zulu conversion — not added here.

## Conversion contract

Accepted inputs:
- `0000` through `2359`;
- shorthand compact values that map unambiguously under the existing parser, e.g. `730` -> 07:30;
- colon-form `00:00` through `23:59`;
- 12-hour inputs such as `7 PM`, `7:30 PM`, `930PM`, `09:30 am`;
- `noon` -> 12:00 / 1200;
- `midnight` -> 00:00 / 0000.

Rejected:
- blank input;
- minute values > 59;
- 24-hour hours > 23;
- 12-hour hours outside 1–12;
- mixed invalid forms such as `13:00 PM`;
- `2400`.

The page intentionally uses `0000` for midnight. Some references use `2400` to denote the end of a day, but this converter rejects it so every accepted value maps to one time within a single 24-hour day.

## Output contract

For every valid input show:
- four-digit military time;
- standard AM/PM time;
- colon-form 24-hour time;
- time-of-day label;
- spoken military-time form.

Examples:
- `0000` -> 0000 / 12:00 AM / 00:00 / Midnight / “zero hundred hours”.
- `0830` -> 0830 / 8:30 AM / 08:30 / Morning / “zero eight thirty hours”.
- `1200` -> 1200 / 12:00 PM / 12:00 / Noon / “twelve hundred hours”.
- `1730` -> 1730 / 5:30 PM / 17:30 / Evening / “seventeen thirty hours”.
- `2359` -> 2359 / 11:59 PM / 23:59 / Night / “twenty-three fifty-nine hours”.

## Validation / accessibility contract

- Invalid input sets `aria-invalid=true` on the input.
- A field-level message explains accepted formats.
- Invalid input clears all result metrics and suppresses copy actions.
- Valid input clears the error and sets `aria-invalid=false`.
- A live status message reports valid/invalid conversion state.
- Clipboard failure reports status instead of failing silently.
- Current-time, presets and reset always leave a valid state.

## Content / information gain

Preserve:
- smart one-field input;
- three notation outputs;
- full whole-hour chart;
- conversion rules;
- midnight/noon/2400 explanation;
- print support;
- work-time internal links.

Add / strengthen:
- spoken form;
- explicit distinction between clock notation and timezone/Zulu conversion;
- clear “2400 may be used contextually elsewhere, but is rejected here” boundary;
- reproducible edge examples;
- current freshness date 2026-10-06.

## Acceptance criteria

- One H1 and existing canonical retained.
- FAQ visible text exactly matches FAQPage schema.
- At least seven useful FAQs.
- WebApplication/WebPage/Breadcrumb/FAQ structured data remain valid.
- `0000`, `1200`, `1730`, `0730`, `730`, `17:30`, `5:30 PM`, `12:00 AM`, `12:00 PM`, `noon`, `midnight`, `7 PM`, `930PM`, `09:30 am`, `2359` convert correctly.
- Blank, `2400`, `2360`, `13:00 PM`, `25:00`, alphabetic junk and malformed punctuation are rejected explicitly.
- Spoken output matches tested examples.
- Presets, current time, reset, copy and print controls remain functional.
- Print rendering keeps the chart/article and suppresses the calculator/sidebar.
- No timezone/UTC/Zulu calculator mode is introduced.
- No horizontal overflow at 390px or 1280px.
- JavaScript syntax passes.
- Content-quality audit passes.
- Dedicated HTML/schema/accessibility test passes.
- Dedicated Chromium conversion/UI/print matrix passes.
- GitHub -> ZT exact parity verified for changed runtime/test files.
- Rollback preserved before any production overwrite.
- Public HTTP/canonical/schema/JS/mobile/desktop verification passes.
- GitHub Actions remains recorded BLOCKED while quota prevents execution.
- PROJECT_STATE updated before the next page begins.

## Rollback

Preserve pre-release production copies of:
- `military-time-converter/index.html`
- `assets/js/military-time.js`

Do not modify unrelated public pages or shared site-shell assets.
