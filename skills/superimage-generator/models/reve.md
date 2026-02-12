# Reve

## Model Characteristics

- **Strength**: Artistic styles, creative interpretations, aesthetic diversity
- **Best for**: Artistic portraits, stylized imagery, creative concepts

## Prompt Format

Reve responds well to **artistic direction** and **aesthetic vocabulary**.

### Template Structure

```
[ARTISTIC STYLE], [SUBJECT], [MOOD/EMOTION],
[COLOR STORY], [COMPOSITION], [ARTISTIC REFERENCES]
```

### Reve-Specific Optimizations

1. **Art movement references**: Impressionism, Surrealism, etc.
2. **Artist style hints**: "in the style of", "reminiscent of"
3. **Emotional language**: Mood drives the aesthetic
4. **Texture descriptions**: Brushstrokes, medium, finish

### Example Superprompt (Reve)

```json
{
  "model": "reve",
  "prompt": {
    "artistic_style": "contemporary digital art with classical painting influences",
    "art_references": "reminiscent of John Singer Sargent's portraiture meets modern fashion photography",
    "subject": {
      "description": "elegant young woman, three-quarter view",
      "features": "soft features, contemplative gaze, subtle smile",
      "styling": "contemporary elegance, minimal jewelry, natural hair"
    },
    "mood": "serene introspection, quiet confidence, timeless beauty",
    "color_story": {
      "palette": "muted earth tones with touches of warm gold",
      "contrast": "soft, low contrast, cohesive",
      "highlights": "warm golden accents on skin and hair"
    },
    "composition": {
      "framing": "portrait crop, generous headroom",
      "focus": "sharp on eyes and face, soft falloff",
      "background": "abstract warm gradient, painterly texture"
    },
    "texture": "visible brushwork suggestion, digital painting finish, slight grain"
  },
  "settings": {
    "aspect_ratio": "4:5",
    "style_intensity": "high"
  },
  "negative_prompt": "photorealistic, harsh lighting, oversaturated, cartoonish, flat colors"
}
```

### Flattened Prompt (Ready to Use)

```
Contemporary digital art with classical painting influences,
reminiscent of John Singer Sargent's portraiture,
elegant young woman in three-quarter view portrait,
soft features with contemplative gaze and subtle knowing smile,
contemporary styling with minimal jewelry and natural flowing hair,
serene introspective mood, quiet confidence, timeless beauty,
muted earth tone palette with warm golden accents on skin and hair,
soft low contrast, cohesive color harmony,
portrait composition with generous headroom,
sharp focus on eyes with soft painterly falloff,
abstract warm gradient background with subtle brushwork texture,
digital painting finish with slight artistic grain,
museum quality, fine art aesthetic
```

### Recommended Settings

| Parameter | Value | Notes |
|-----------|-------|-------|
| style_intensity | high | More artistic interpretation |
| aspect_ratio | 4:5 | Classic portrait ratio |
| creativity | higher values | More artistic freedom |

### Art Movement Keywords

**Classical:**
- `Renaissance`, `Baroque`, `Romantic`
- `chiaroscuro`, `sfumato`, `impasto`
- `oil painting`, `classical portraiture`

**Modern:**
- `Impressionist`, `Post-Impressionist`
- `Art Nouveau`, `Art Deco`
- `Expressionist`, `Surrealist`

**Contemporary:**
- `digital painting`, `concept art`
- `fashion illustration`, `editorial art`
- `mixed media`, `contemporary portrait`

### Artist Reference Guide

Use sparingly and respectfully:
- "reminiscent of [artist]'s use of light"
- "inspired by [movement]'s color palette"
- "with [artist]'s attention to fabric detail"

**Portrait Masters:**
- John Singer Sargent (elegant realism)
- Gustav Klimt (decorative, gold)
- Alphonse Mucha (Art Nouveau)
- Jeremy Mann (contemporary urban)

### Mood Vocabulary

**Emotional Tones:**
- `melancholic`, `wistful`, `nostalgic`
- `serene`, `peaceful`, `contemplative`
- `dramatic`, `intense`, `passionate`
- `playful`, `whimsical`, `lighthearted`
- `mysterious`, `enigmatic`, `alluring`

### Texture Language

- `visible brushstrokes`, `painterly`
- `smooth blending`, `soft edges`
- `textured canvas`, `layered paint`
- `digital crisp`, `rendered smooth`
- `artistic grain`, `paper texture`
