# GPT Image 1.5 (OpenAI)

## Model Characteristics

- **Strength**: Reasoning-based generation, text rendering, UI mockups, world knowledge
- **Best for**: Production-quality visuals, iterative editing, logos, infographics, photorealism
- **Unique**: Built-in reasoning engine understands context without explicit prompting

## Prompt Format

GPT Image 1.5 excels with **natural language prompts** organized in a clear hierarchy. Unlike tag-based models, it responds to conversational descriptions.

### Template Structure

```
[SCENE/BACKGROUND] → [SUBJECT DESCRIPTION] → [KEY DETAILS] → [CONSTRAINTS/EXCLUSIONS]
```

For complex requests, use **labeled segments or line breaks** instead of one long paragraph.

### Key Differences from Other Models

1. **No quality tags needed**: Don't use "masterpiece", "8k", "best quality" - the model handles this internally
2. **Natural language over keywords**: Full sentences work better than comma-separated tags
3. **Photography language works**: Lens, aperture, framing terms are well understood
4. **Explicit constraints**: State what to exclude ("no watermark", "no extra text")
5. **Quality parameter**: Use `quality="high"` for detail, `quality="low"` for speed

### Prompt Architecture

```json
{
  "model": "gpt-image-1.5",
  "quality": "high",
  "prompt": {
    "scene_context": "A contemporary bathroom with white walls and grey wood floor",
    "subject": "A young athletic woman with blonde hair in a high braid, taking a mirror selfie",
    "details": "She wears an olive green compression top and colorful SpongeBob character shorts. Looking over her shoulder with a bright smile.",
    "technical": "Shot as if captured on a smartphone, natural indoor lighting, sharp focus on the mirror reflection",
    "constraints": "No logos on background items. No beauty filter smoothing. Realistic skin texture with visible pores."
  }
}
```

### Flattened Prompt (Ready to Use)

```
A contemporary bathroom with white walls and grey wood-plank flooring.

A young athletic woman with blonde hair styled in a high, tight braid takes a three-quarter rear-view mirror selfie. She wears an olive green long-sleeved compression top with a quarter-zip collar and tight-fitting shorts featuring a vibrant SpongeBob SquarePants character pattern in yellow, pink, and blue.

She looks over her right shoulder with a bright natural smile, holding a black smartphone at chest level. Her athletic build shows defined musculature with visible lumbar dimples.

Bright diffused overhead lighting creates soft shadows that accentuate body contours. The image has the quality of a high-end smartphone photo with sharp focus on the mirror reflection.

No logos on background items. No artificial skin smoothing. Realistic texture throughout.
```

### Photorealism Best Practices

For believable photorealism with GPT Image 1.5:

| Technique | Example |
|-----------|---------|
| Photography language | "shot as if photographed with an 85mm lens at f/2.8" |
| Real texture requests | "visible skin pores, fabric weave, natural imperfections" |
| Framing terms | "close-up portrait", "wide establishing shot", "eye-level angle" |
| Lighting description | "golden hour side lighting", "soft diffused window light" |
| Avoid studio polish | Don't imply heavy retouching or artificial staging |

### Text Rendering

GPT Image 1.5 has excellent text rendering. For best results:

- Place literal text in **quotes** or **ALL CAPS**: `wearing a cap with "XBOX" logo`
- Specify typography: font style, size, color, placement
- For difficult words, spell letter-by-letter to improve accuracy

### Constraint Language

Always specify what to preserve and exclude:

```
PRESERVE: facial identity, body position, background layout
EXCLUDE: no watermark, no extra text, no logos/trademarks, no artificial glow
```

For iterative edits: "change only X" + "keep everything else the same"

### Quality Settings

| Setting | Use Case |
|---------|----------|
| `quality="high"` | Final deliverables, dense layouts, heavy text |
| `quality="medium"` | Rapid iteration during creative process |
| `quality="low"` | Speed priority, rough concepts |

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

**GPT Image 1.5 Output:**
```
A contemporary bathroom with white walls and weathered grey wood-plank flooring.

A young athletic woman with a mesomorphic build takes a three-quarter rear-view mirror selfie. She has blonde hair styled in a high, tight single braid hanging down her back. Her expression is a bright natural smile as she looks over her right shoulder into the mirror.

She wears an olive green long-sleeved athletic compression shirt with a mock-neck collar and quarter-zip detail, showing realistic tension lines in the fabric. Her tight-fitting booty shorts feature a vibrant multicolored SpongeBob SquarePants character collage pattern in yellow, pink, and blue.

She holds a black smartphone at chest level to capture the reflection. Her athletic physique shows defined shoulders, narrow waist, and developed glutes.

Bright diffused ambient lighting from overhead creates soft shadows that accentuate anatomical definition without harsh flash artifacts. Natural skin texture with realistic highlights.

No background logos. No artificial smoothing. No distorted mirror reflections.
```

### Recommended API Parameters

| Parameter | Value | Notes |
|-----------|-------|-------|
| quality | "high" | For production work |
| size | "1024x1792" | 9:16 portrait |
| size | "1792x1024" | 16:9 landscape |
| size | "1024x1024" | 1:1 square |

### GPT Image 1.5 Specific Strengths

- **World knowledge**: Can infer context (e.g., "Woodstock 1969" without explicit details)
- **UI mockups**: Describe product as if it exists, focus on layout and hierarchy
- **Logo generation**: Clean marks with strong shape and balanced negative space
- **Iterative editing**: Excellent at preserving identity through multiple rounds
- **Multi-panel compositions**: Handles infographics, diagrams, structured visuals
