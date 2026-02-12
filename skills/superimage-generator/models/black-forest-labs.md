# Black Forest Labs (Flux)

## Model Characteristics

- **Company**: Black Forest Labs (creators of Flux)
- **Models**: Flux.1 [pro], Flux.1 [dev], Flux.1 [schnell], Flux Kontext
- **Strength**: State-of-the-art photorealism, coherent compositions, text rendering
- **Best for**: Professional photography, product shots, realistic portraits

## Model Variants

| Model | Speed | Quality | Use Case |
|-------|-------|---------|----------|
| Flux.1 [pro] | Slower | Highest | Production, final assets |
| Flux.1 [dev] | Medium | High | Development, iteration |
| Flux.1 [schnell] | Fast | Good | Rapid prototyping |
| Flux Kontext | Medium | High | Context-aware editing |

## Prompt Format

Black Forest Labs models respond to **natural language with technical photography terms**.

### Template Structure

```
[QUALITY ANCHORS], [SUBJECT], [TECHNICAL DETAILS],
[ENVIRONMENT], [LIGHTING], [CAMERA SPECS], [STYLE MODIFIERS]
```

### Quality Anchors (Front-load these)

```
masterpiece, best quality, ultra-realistic, photorealistic,
8k uhd, raw photo, professional photography, highly detailed
```

### Example Superprompt (Flux.1 Pro)

```json
{
  "model": "flux.1-pro",
  "provider": "black-forest-labs",
  "prompt": {
    "quality_anchors": [
      "masterpiece",
      "ultra-realistic",
      "professional photography",
      "8k uhd",
      "raw photo"
    ],
    "subject": {
      "description": "young South Asian woman in her late 20s",
      "physical": "dark hair tied back naturally with loose flyaways, calm neutral expression",
      "skin_detail": "visible pores, natural acne marks, uneven pigmentation, subtle redness, natural oil sheen on high points",
      "gaze": "looking slightly downward at smartphone"
    },
    "wardrobe": {
      "main": "light grey cotton hoodie with true fabric texture",
      "accessories": "small silver geometric earrings, natural nude nails with subtle red detail"
    },
    "pose": "smartphone mirror selfie, phone partially covering one side of face, close-up from collarbone to top of head",
    "environment": {
      "setting": "indoors near window",
      "atmosphere": "modern, clean, minimal, intimate",
      "background": "soft out-of-focus domestic interior"
    },
    "lighting": {
      "type": "real daylight with slight warmth",
      "quality": "natural contrast, accurate white balance",
      "avoid": ["flat lighting", "cinematic lighting", "faded colors"]
    },
    "camera": {
      "type": "smartphone camera characteristics",
      "details": "slight edge softness, natural focus falloff, subtle sensor grain"
    }
  },
  "negative_prompt": [
    "faded colors", "pastel tones", "beige aesthetic", "flat lighting",
    "overexposed whites", "AI glow", "plastic skin", "skincare-ad look",
    "studio lighting", "cartoon style", "3D style", "text", "logos",
    "deformed", "bad anatomy", "extra limbs", "blurry"
  ],
  "settings": {
    "aspect_ratio": "9:16",
    "guidance_scale": 3.5,
    "num_inference_steps": 28
  }
}
```

### Flattened Prompt (Ready to Use)

```
masterpiece, ultra-realistic, professional photography, 8k uhd, raw photo,
young South Asian woman late 20s, dark hair tied back with loose flyaways,
calm neutral expression, visible skin pores, natural acne marks, uneven pigmentation,
subtle redness, natural oil sheen on high points only,
wearing light grey cotton hoodie with true fabric texture,
small silver geometric earrings, natural nude nails,
smartphone mirror selfie close-up from collarbone to top of head,
phone partially covering one side of face, looking slightly downward,
indoors near window, modern clean minimal intimate setting,
real daylight with slight warmth, natural contrast, accurate white balance,
smartphone camera quality, slight edge softness, natural focus falloff,
rich dimensional skin tones, non-commercial real person real moment aesthetic
```

### Recommended Settings

| Parameter | Flux Pro | Flux Dev | Flux Schnell |
|-----------|----------|----------|--------------|
| guidance_scale | 3.0-4.0 | 3.5-5.0 | 4.0-7.0 |
| num_inference_steps | 28-50 | 28-40 | 4 |
| aspect_ratio | Any | Any | Any |

### BFL-Specific Optimization Tips

1. **Front-load quality**: First 10-15 words carry most weight
2. **Be specific about skin**: BFL excels at realistic skin when prompted
3. **Photography language**: Use real camera terms (f-stop, focal length)
4. **Negative prompts matter**: Explicitly exclude common AI artifacts
5. **Natural language works**: Full sentences can be effective

### Skin Realism Vocabulary

For photorealistic portraits, include:
- `visible pores`
- `natural skin texture`
- `subtle imperfections`
- `natural oil sheen` / `matte finish`
- `uneven pigmentation`
- `realistic subsurface scattering`

### Lighting Keywords

**Natural Light:**
- `soft window light`, `diffused daylight`
- `golden hour warmth`, `overcast softness`
- `dappled light`, `natural bounce`

**Studio Light:**
- `softbox lighting`, `beauty dish`
- `rim light`, `fill light`
- `high key`, `low key`

### Avoid These (Common Flux Issues)

- Over-smoothed skin (add texture descriptors)
- Generic "AI" look (add imperfection markers)
- Inconsistent lighting (specify direction)
- Floating elements (describe spatial relationships)

### Integration Notes

**API Endpoint**: `https://api.bfl.ml/v1/flux-pro-1.1`

**Request Structure**:
```json
{
  "prompt": "your flattened prompt here",
  "width": 1024,
  "height": 1024,
  "steps": 28,
  "guidance": 3.5,
  "safety_tolerance": 2
}
```
