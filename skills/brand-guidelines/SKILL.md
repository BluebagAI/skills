---
name: brand-guidelines
description: "Apply Anthropic's official brand colors, typography, and visual identity to artifacts such as presentations, documents, HTML pages, and charts. Use when brand colors, style guidelines, visual formatting, company design standards, or Anthropic's look-and-feel need to be applied."
---

# Anthropic Brand Guidelines

Apply Anthropic's official brand identity to any artifact — presentations, documents, web pages, charts, or other visual content.

## Brand Palette

**Main colors:**
- Dark `#141413` — primary text and dark backgrounds
- Light `#faf9f5` — light backgrounds and text on dark
- Mid Gray `#b0aea5` — secondary elements
- Light Gray `#e8e6dc` — subtle backgrounds

**Accent colors:**
- Orange `#d97757` — primary accent
- Blue `#6a9bcc` — secondary accent
- Green `#788c5d` — tertiary accent

## Typography

| Role | Font | Fallback |
|------|------|----------|
| Headings (24pt+) | Poppins | Arial |
| Body text | Lora | Georgia |

## Workflow

1. **Identify artifact type** — determine what is being styled (presentation, HTML page, document, chart).
2. **Apply typography** — set headings to Poppins (or Arial fallback) and body text to Lora (or Georgia fallback). Preserve text hierarchy.
3. **Apply color palette** — set backgrounds, text, and borders using the main colors above. Use accent colors for shapes, highlights, and data visualization (cycling orange → blue → green).
4. **Validate output:**
   - Verify text contrast meets readability standards (dark text on light backgrounds, light text on dark backgrounds)
   - Confirm fonts render correctly; apply fallbacks if custom fonts are unavailable
   - Check accent colors are used consistently for non-text elements

## Example: HTML Styling

```css
:root {
  --brand-dark: #141413;
  --brand-light: #faf9f5;
  --brand-gray: #b0aea5;
  --brand-light-gray: #e8e6dc;
  --accent-orange: #d97757;
  --accent-blue: #6a9bcc;
  --accent-green: #788c5d;
}
h1, h2, h3 { font-family: 'Poppins', Arial, sans-serif; color: var(--brand-dark); }
body { font-family: 'Lora', Georgia, serif; color: var(--brand-dark); background: var(--brand-light); }
```
