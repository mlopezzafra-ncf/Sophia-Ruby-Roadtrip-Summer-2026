# Sophia & Ruby Road Trip 2026 — project notes

## Source of truth for trip data

The live spreadsheet is here — pull from this before making changes to the site so the data matches what the family is actually planning:

**https://docs.google.com/spreadsheets/d/1CQc1tZBKmu5vxMcTdc5BwIlwGiw3pou4gAnm8RJFwI4/edit?usp=sharing**

Tabs and where each one maps to on the site:

| Spreadsheet tab | Site location |
|-----------------|---------------|
| `DayByDay` | `js/data.js` → `DAYS` array → renders on `days.html` |
| `Lodging`      | `js/data.js` → `LODGING` array → merged into each day card on `days.html` |
| `Flights`      | `js/data.js` → `FLIGHTS` array → "Flights today" block on relevant day cards |
| `Food`         | `js/data.js` → `DAILY_FOOD` array → per-meal cost chips on day cards |
| `Budget`       | `js/data.js` → `PLANNED`, `BUDGET_TOTALS`, `BUDGET_AUNT_RANGES`, `BUDGET_KNOWN_MISC`, `BUDGET_GAS_BY_DAY`, `BUDGET_RUBY_PAID` → all rendered on `budget.html` |
| `Packing List` | `js/data.js` → `PACKING` object → renders on `packing.html` |

When you fetch the spreadsheet, use a Sheets export URL (`/export?format=xlsx`) or the `gspread` Python lib — direct browser scrape needs auth.

## Repo layout

```
/                    # Each top-level *.html is one page in the multi-page site
  index.html         # Landing
  map.html           # The Grand Route (Leaflet)
  states.html
  parks.html         # Click any poster → modal with history/routes/things
  days.html          # Day cards (loads Leaflet for mini-maps)
  reading.html
  budget.html
  packing.html
css/styles.css       # All shared styles
js/data.js           # All trip data — single source of truth at code level
js/app.js            # Page-aware renderer — every init function no-ops if its target isn't on the current page
National Parks/      # PNG posters for the 5 parks with artwork (Badlands, Zion, Yellowstone, Grand Canyon, Lassen Volcanic)
State Vintage Posters/
compressed/          # Smaller JPGs (not currently referenced)
```

Parks without artwork (Arches, Bryce, Sequoia, Yosemite) use a CSS text-only poster fallback — set `img: null` in `NATIONAL_PARKS` and the renderer handles it.

## GitHub

Repo: https://github.com/mlopezzafra-ncf/Sophia-Ruby-Roadtrip-Summer-2026
Live site (GitHub Pages, `main` branch): https://mlopezzafra-ncf.github.io/Sophia-Ruby-Roadtrip-Summer-2026/

## Local preview

```bash
npx -y serve . -p 8765 -L
```

Or use the `site` config in `.claude/launch.json` with the `preview_start` MCP tool.

## When pulling spreadsheet updates, watch for

- **STOPS** in `js/data.js` is separate from `DAYS` — both have day numbers; keep them aligned.
- **Hero stats** in `index.html` (Days / Miles / States / Parks / Time Zones) and the map title in `map.html` (`MILES · DAYS · STOPS`) are hard-coded — update if those totals change.
- **`PLANNED` budget** in `js/data.js` powers the progress bars on `budget.html`; the planned-total chip text is computed from it.
- **Park modal data** lives in `NATIONAL_PARKS[i].info` — history, routes, things — not in the spreadsheet, so don't blow it away when re-syncing.
