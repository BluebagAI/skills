---
name: theme-factory
description: "Apply professional color-and-font themes to slides, docs, reports, HTML pages, and other artifacts. Choose from 10 pre-set themes or generate a custom theme on-the-fly. Use when the user asks to style, theme, brand, or change the look and feel of any artifact."
---

# Theme Factory

Apply consistent, professional styling to any artifact using curated color palettes and font pairings. Ten pre-set themes are available in `theme-showcase.pdf` and the `themes/` directory; custom themes can be generated on demand.

## Workflow

1. **Present options** — display `theme-showcase.pdf` (read-only) so the user can browse all ten themes visually.
2. **Confirm selection** — ask the user which theme to apply; wait for explicit confirmation before proceeding.
3. **Load theme spec** — read the chosen theme file from `themes/` (e.g. `themes/ocean-depths.md`). Each file contains hex color codes and font pairings.
4. **Apply styling** — set heading fonts, body fonts, background colors, and accent colors consistently across the entire artifact.
5. **Validate output** — verify contrast between text and background meets readability standards, ensure fonts render correctly with appropriate fallbacks, and confirm the visual identity is consistent across all pages/sections.

## Available Themes

| # | Theme | Character |
|---|-------|-----------|
| 1 | Ocean Depths | Professional, calming maritime |
| 2 | Sunset Boulevard | Warm, vibrant sunset |
| 3 | Forest Canopy | Natural, grounded earth tones |
| 4 | Modern Minimalist | Clean, contemporary grayscale |
| 5 | Golden Hour | Rich, warm autumnal |
| 6 | Arctic Frost | Cool, crisp winter |
| 7 | Desert Rose | Soft, sophisticated dusty |
| 8 | Tech Innovation | Bold, modern tech |
| 9 | Botanical Garden | Fresh, organic garden |
| 10 | Midnight Galaxy | Dramatic, cosmic deep tones |

## Custom Theme Generation

When no pre-set theme fits:

1. Gather the user's preferences (mood, colors, industry context).
2. Generate a new palette (primary, secondary, accent, background, text) with complementary font pairings.
3. Name the theme to reflect its character (e.g. "Brutalist Joy", "Warm Terracotta").
4. Show the generated theme for review before applying.
5. Apply using the same workflow as pre-set themes (steps 4–5 above).
