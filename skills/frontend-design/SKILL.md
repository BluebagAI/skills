---
name: frontend-design
description: "Create distinctive, production-grade frontend interfaces with high design quality. Build web components, pages, dashboards, landing pages, and applications using HTML, CSS, React, or Vue. Use when the user asks to build a UI, website, HTML page, landing page, dashboard, or web application with polished visual design."
---

# Frontend Design

Create distinctive, production-grade frontend interfaces that avoid generic AI aesthetics. Every output should have a clear aesthetic point-of-view and feel genuinely designed for its context.

## Workflow

1. **Understand context** — identify the purpose, audience, and technical constraints (framework, performance, accessibility).
2. **Choose an aesthetic direction** — commit to a bold, specific direction: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, or any other intentional style.
3. **Implement** — write working code (HTML/CSS/JS, React, Vue, etc.) that is functional, visually striking, and cohesive.
4. **Validate** — check against the anti-pattern list below; refine until the output passes.

## Design Guidelines

**Typography** — choose distinctive, characterful fonts. Pair a display font with a refined body font. Avoid generic choices (Inter, Roboto, Arial, system fonts). Never converge on the same font (e.g. Space Grotesk) across generations.

**Color** — commit to a cohesive palette using CSS variables. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

**Motion** — prioritize high-impact moments: one well-orchestrated page load with staggered `animation-delay` reveals creates more delight than scattered micro-interactions. Use CSS-only for HTML; use Motion library for React when available.

**Layout** — explore unexpected compositions: asymmetry, overlap, diagonal flow, grid-breaking elements, generous negative space, or controlled density.

**Atmosphere** — add depth with gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, or grain overlays. Avoid flat, solid-color backgrounds.

## Example: Bold Typography Pairing

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Serif+4&display=swap');

:root {
  --font-display: 'Playfair Display', serif;
  --font-body: 'Source Serif 4', serif;
  --color-ink: #1a1a2e;
  --color-cream: #fef9ef;
  --color-accent: #e63946;
}
h1 { font: 700 clamp(2.5rem, 5vw, 4.5rem) var(--font-display); color: var(--color-ink); }
p  { font: 400 1.125rem/1.7 var(--font-body); color: var(--color-ink); }
```

## Example: Staggered Entrance Animation

```css
.card { opacity: 0; transform: translateY(20px); animation: reveal 0.6s ease forwards; }
.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.2s; }
.card:nth-child(3) { animation-delay: 0.3s; }
@keyframes reveal { to { opacity: 1; transform: translateY(0); } }
```

## Anti-Pattern Checklist

Before delivering, verify the output does **not** use:
- [ ] Generic font stacks (Inter, Roboto, Arial, system-ui)
- [ ] Purple-gradient-on-white color schemes
- [ ] Predictable card-grid layouts with rounded corners and drop shadows
- [ ] Cookie-cutter component patterns with no contextual character

Match implementation complexity to the vision: maximalist designs need elaborate code; minimalist designs need restraint and precision.
