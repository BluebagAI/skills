# Midjourney

## Model Characteristics

- **Strength**: Aesthetic quality, artistic interpretation, beautiful compositions
- **Versions**: v6.1 (latest), v6, v5.2, niji (anime)
- **Best for**: Artistic portraits, fantasy, concept art, stylized imagery

## Prompt Format

Midjourney uses **parameters** (`--`) and responds to **evocative, artistic language**.

### Template Structure

```
[SUBJECT], [STYLE DESCRIPTION], [MOOD/ATMOSPHERE], [LIGHTING],
[COMPOSITION], [TECHNICAL DETAILS] --ar [ratio] --v [version] --style [raw/default]
```

### Midjourney Parameters

| Parameter | Values | Purpose |
|-----------|--------|---------|
| `--ar` | 16:9, 9:16, 1:1, 4:3 | Aspect ratio |
| `--v` | 6.1, 6, 5.2 | Model version |
| `--style` | raw, default | Raw = more literal |
| `--stylize` | 0-1000 | Artistic interpretation (default 100) |
| `--chaos` | 0-100 | Variation between outputs |
| `--no` | [element] | Negative prompt |
| `--q` | .25, .5, 1 | Quality (affects speed) |
| `--seed` | number | Reproducibility |

### Example Superprompt (Midjourney)

```json
{
  "model": "midjourney",
  "version": "6.1",
  "prompt": {
    "subject": "portrait of a young woman with freckles and auburn hair",
    "style": "fine art photography, editorial beauty",
    "mood": "ethereal, mysterious, slightly melancholic",
    "lighting": "soft diffused window light, subtle rim lighting creating a halo effect",
    "details": "visible skin texture, individual hair strands catching light, dewy skin",
    "composition": "close-up portrait, eyes as focal point, shallow depth of field",
    "color_palette": "muted earth tones, touches of emerald green in eyes",
    "artistic_reference": "reminiscent of Renaissance portraiture with modern sensibility"
  },
  "parameters": {
    "--ar": "4:5",
    "--v": "6.1",
    "--style": "raw",
    "--stylize": "150",
    "--no": "harsh shadows, overexposed, artificial"
  }
}
```

### Flattened Prompt (Ready to Use)

```
Portrait of a young woman with freckles and flowing auburn hair,
fine art photography, editorial beauty aesthetic,
ethereal mysterious slightly melancholic mood,
soft diffused window light with subtle rim lighting creating a halo effect,
visible skin texture, individual hair strands catching light, dewy luminous skin,
close-up portrait composition with eyes as focal point,
shallow depth of field, muted earth tones with emerald green eyes,
reminiscent of Renaissance portraiture with modern sensibility,
masterful lighting, museum quality --ar 4:5 --v 6.1 --style raw --stylize 150 --no harsh shadows, overexposed, artificial
```

### Recommended Settings by Use Case

**Photorealistic Portrait:**
```
--ar 4:5 --v 6.1 --style raw --stylize 50-100
```

**Artistic/Stylized:**
```
--ar 4:5 --v 6.1 --stylize 250-500
```

**Fantasy/Concept:**
```
--ar 16:9 --v 6.1 --stylize 500-750 --chaos 15
```

**Anime (Niji):**
```
--ar 4:5 --niji 6 --style expressive
```

### Midjourney-Specific Keywords

**Quality Boosters:**
- `masterpiece`, `award-winning`
- `highly detailed`, `intricate`
- `professional photography`
- `8k`, `ultra detailed`

**Lighting:**
- `Rembrandt lighting`, `butterfly lighting`
- `golden hour`, `blue hour`
- `volumetric lighting`, `god rays`
- `soft box`, `natural window light`

**Artistic Styles:**
- `fine art`, `editorial`, `fashion`
- `cinematic`, `filmic`, `movie still`
- `oil painting`, `watercolor`, `digital art`
- `concept art`, `matte painting`

**Mood/Atmosphere:**
- `ethereal`, `dreamlike`, `surreal`
- `moody`, `dramatic`, `intense`
- `serene`, `peaceful`, `contemplative`
- `dark fantasy`, `light academia`

### V6.1 Specific Tips

1. **Natural language works**: v6+ understands conversational prompts
2. **Be specific about unwanted elements**: Use `--no` for negatives
3. **Style raw for realism**: `--style raw` reduces artistic interpretation
4. **Lower stylize for accuracy**: `--stylize 50` for prompt adherence

### Negative Prompts (--no)

Common exclusions:
```
--no ugly, deformed, bad anatomy, blurry, low quality,
watermark, signature, text, cropped, worst quality,
jpeg artifacts, duplicate, morbid, mutilated
```

### Aspect Ratio Guide

| Ratio | Best For |
|-------|----------|
| 1:1 | Portraits, avatars |
| 4:5 | Instagram portraits |
| 3:4 | Classic portrait |
| 16:9 | Landscapes, cinematic |
| 9:16 | Mobile, stories |
| 21:9 | Ultra-wide, banners |
