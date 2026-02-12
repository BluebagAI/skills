# Ideogram

## Model Characteristics

- **Strength**: Typography, text rendering, logos, graphic design
- **Versions**: Ideogram 2.0, Ideogram 1.0
- **Best for**: Marketing materials, posters, branded content, text-heavy images

## Prompt Format

Ideogram excels with **clear structure** and **explicit text instructions**.

### Template Structure

```
[STYLE], [MAIN SUBJECT], [TEXT ELEMENT with exact spelling],
[COMPOSITION], [COLOR PALETTE], [BACKGROUND]
```

### Ideogram-Specific Optimizations

1. **Quote exact text**: Put text in quotes exactly as it should appear
2. **Specify text style**: font weight, color, position
3. **Use magic prompt**: Enable for automatic enhancement
4. **Design language**: Think like a graphic designer

### Example Superprompt (Ideogram)

```json
{
  "model": "ideogram",
  "version": "2.0",
  "prompt": {
    "style": "professional photography with graphic overlay, modern design aesthetic",
    "subject": "young confident woman in athleisure wear, dynamic pose, looking at camera",
    "text_element": {
      "content": "JUST DO IT",
      "style": "bold sans-serif white text",
      "position": "bottom third of frame",
      "effect": "slight drop shadow for readability"
    },
    "composition": "centered subject, text as design element, clean negative space",
    "color_palette": "high contrast, black white and accent orange",
    "background": "minimal gradient, studio setting with dramatic lighting"
  },
  "settings": {
    "magic_prompt": true,
    "style_type": "photo",
    "aspect_ratio": "1:1"
  },
  "negative_prompt": "blurry text, misspelled words, distorted letters, cluttered composition, amateur design"
}
```

### Flattened Prompt (Ready to Use)

```
Professional photography with modern graphic design overlay,
young confident woman in black athleisure wear, dynamic athletic pose,
looking directly at camera, bold white sans-serif text reading "JUST DO IT"
positioned in bottom third of frame with subtle drop shadow,
centered composition with clean negative space,
high contrast black white and orange color palette,
minimal gradient studio background with dramatic side lighting,
modern advertising aesthetic, 4k quality
```

### Recommended Settings

| Parameter | Value | Notes |
|-----------|-------|-------|
| magic_prompt | true | Enhances prompt automatically |
| style_type | design / photo / 3d | Match your intent |
| aspect_ratio | 1:1 or 16:9 | Common for marketing |
| rendering_quality | high | Better text clarity |

### Text-Specific Tips

1. **Single quotes inside double**: `"text says 'HELLO'"`
2. **Spell out exactly**: Don't rely on AI to know spellings
3. **Limit text amount**: 1-3 words render best
4. **Specify font style**: "bold", "italic", "handwritten", "sans-serif"

### Ideogram-Specific Keywords

**Design Styles:**
- `graphic design`, `typography art`, `poster design`
- `minimalist`, `maximalist`, `brutalist`
- `modern`, `vintage`, `retro`

**Text Quality:**
- `legible text`, `clear typography`, `sharp letters`
- `professional font`, `custom lettering`

**Composition:**
- `balanced layout`, `rule of thirds`, `centered composition`
- `negative space`, `visual hierarchy`
