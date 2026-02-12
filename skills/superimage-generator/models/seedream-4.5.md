# Seedream 4.5 (ByteDance)

## Model Characteristics

- **Strength**: Natural language understanding, text rendering, 2K-4K generation, multi-image composition
- **Best for**: Portraits, products, conceptual art, images with readable text
- **Unique**: Supports up to 14 reference images, strong prompt comprehension with minimal description

## Prompt Format

Seedream 4.5 uses **coherent natural language** with a structured formula. It understands context better than older models, so concise and precise prompts outperform verbose stacking.

### Template Structure

```
[SUBJECT] + [ACTION/POSE] + [ENVIRONMENT/SETTING] + [STYLE] + [TECHNICAL DETAILS] + [TEXT CONTENT]
```

### Key Differences from Other Models

1. **Natural language preferred**: "A girl walking under a parasol" beats "girl, umbrella, walking"
2. **Concise over verbose**: Strong prompt comprehension means less is more
3. **Photography terms supported**: Lens, lighting, composition terms work well
4. **Excellent text rendering**: Use quotes for text in images
5. **No negative prompt field**: Use explicit style negations inline ("not cartoon-like")

### Prompt Architecture

```json
{
  "model": "seedream-4.5",
  "prompt": {
    "subject": "A young athletic woman with blonde hair in a high tight braid",
    "action": "taking a three-quarter rear-view mirror selfie, looking over her shoulder with a bright smile",
    "wardrobe": "wearing an olive green compression top with quarter-zip and vibrant SpongeBob character shorts",
    "environment": "in a bright contemporary bathroom with white walls and weathered grey wood flooring",
    "style": "fitness lifestyle photography, candid smartphone aesthetic",
    "technical": "shot on 35mm lens, f/2.8, bright diffused overhead lighting, soft shadows",
    "text_content": null
  }
}
```

### Flattened Prompt (Ready to Use)

```
A young athletic woman with blonde hair styled in a high tight braid takes a three-quarter rear-view mirror selfie in a bright contemporary bathroom. She looks over her right shoulder with a bright natural smile, wearing an olive green long-sleeved compression top with mock-neck and quarter-zip detail, paired with tight-fitting shorts featuring a vibrant SpongeBob SquarePants character collage in yellow, pink, and blue. The bathroom has white walls and weathered grey wood-plank flooring. Bright diffused overhead lighting creates soft shadows accentuating her athletic build. Shot on 35mm lens at f/2.8, fitness lifestyle photography style with candid smartphone aesthetic.
```

### Prompt Length Guidelines

| Length | Use Case |
|--------|----------|
| 30-50 words | Simple subjects, clear concepts |
| 50-100 words | Detailed scenes, specific aesthetics |
| 100+ words | Complex multi-element compositions |

**Important**: Place most important elements FIRST. Order matters.

### Photography & Technical Terms

Seedream 4.5 responds strongly to photography vocabulary:

**Composition:**
- "symmetrical composition", "rule of thirds", "overhead perspective"
- "centered subject", "negative space on left"

**Lenses & Depth:**
- "85mm lens", "shallow depth of field", "wide-angle view"
- "35mm", "telephoto compression"

**Lighting Cues:**
- "golden hour lighting", "dramatic side lighting", "soft diffused light"
- "moody low-key lighting", "bright high-key lighting"
- "rim lighting", "backlit silhouette"

**Photography Styles:**
- "portrait photography", "macro photography", "aerial view"
- "street photography", "editorial fashion", "product photography"

### Text Rendering

Seedream 4.5 excels at readable, correctly spelled text:

**Recommended:**
```
Generate a poster with the title "Seedream 4.5"
A cap with "XBOX" printed on the front panel in white
```

**Avoid:**
```
Generate a poster titled Seedream 4.5
A cap with XBOX written on it
```

Use **quotes around text content** for best results.

### Style Modifiers

**Artistic Styles:**
- "oil painting", "watercolor", "pencil sketch", "digital art"
- "anime style", "comic book", "vintage photograph"

**Aesthetic Qualifiers:**
- "cinematic", "photorealistic", "stylized", "minimalist"
- "dramatic", "ethereal", "gritty", "polished"

### Negative/Exclusion Handling

Unlike Flux or Midjourney, Seedream doesn't have a separate negative prompt field. Use inline negations:

```
A photorealistic portrait, not cartoon-like, avoiding anime aesthetics
Professional photograph with realistic skin texture, no artificial smoothing
```

### Example Adaptation

**Input (from superprompt JSON):**
```json
{
  "subject": "athletic woman, blonde braid, bright smile",
  "wardrobe": "olive compression top, SpongeBob shorts",
  "pose": "three-quarter rear-view mirror selfie",
  "environment": "contemporary bathroom, white walls, grey wood floor",
  "lighting": "bright diffused overhead"
}
```

**Seedream 4.5 Output:**
```
A young athletic woman with a mesomorphic build and blonde hair in a high tight braid takes a three-quarter rear-view mirror selfie in a contemporary bathroom. She looks over her right shoulder with a bright natural smile, her athletic physique showing defined shoulders and narrow waist. She wears an olive green long-sleeved compression top with mock-neck collar and quarter-zip, paired with tight-fitting shorts featuring a vibrant SpongeBob SquarePants character collage pattern in yellow, pink, and blue. The bathroom has white walls and weathered grey wood-plank flooring with visible grain. Bright diffused overhead ambient lighting creates soft shadows accentuating lumbar dimples and muscle definition. Fitness lifestyle photography, candid smartphone mirror selfie aesthetic, 35mm lens f/2.8, photorealistic skin texture.
```

### Recommended Settings

| Parameter | Value | Notes |
|-----------|-------|-------|
| resolution | 2K-4K | Native high-res support |
| aspect_ratio | Match content | 9:16, 16:9, 1:1, 4:5 |
| reference_images | 0-14 | For character/style consistency |

### Seedream 4.5 Specific Strengths

- **Dense text rendering**: Small text more reliable than competitors
- **Multi-image editing**: Accurately identifies main subjects across references
- **Reference preservation**: Strictly preserves details from reference images
- **Typography**: Excellent for posters, logos, signage
- **Concise understanding**: Generates expected images with less description needed
