# Flux (Black Forest Labs)

## Model Characteristics

- **Strength**: Photorealism, accurate text rendering, coherent compositions
- **Versions**: Flux.1 [pro], Flux.1 [dev], Flux.1 [schnell]
- **Best for**: Realistic portraits, product photography, scenes with text

## Prompt Format

Flux works best with **dense, comma-separated descriptors** front-loaded with quality tags.

### Template Structure

```
[QUALITY TAGS], [SUBJECT DESCRIPTION], [PHYSICAL DETAILS], [WARDROBE],
[POSE/ACTION], [ENVIRONMENT], [LIGHTING], [CAMERA TECHNICAL], [REALISM ANCHORS]
```

### Quality Tag Hierarchy (use 2-3)

```
masterpiece, best quality, ultra-realistic, photorealistic,
professional photography, editorial quality, 8k uhd, raw photo
```

### Flux-Specific Optimizations

1. **Front-load quality**: Put quality descriptors first
2. **Use photography language**: "shot on", "f/1.8", "85mm lens"
3. **Explicit realism**: "visible pores", "skin texture", "fabric weave"
4. **Negative prompt required**: Flux responds well to explicit exclusions

### Example Superprompt (Flux)

```json
{
  "model": "flux",
  "version": "flux.1-pro",
  "prompt": {
    "quality_prefix": "masterpiece, ultra-realistic, professional photography, 8k uhd, raw photo",
    "subject": "young woman mid-20s, honey blonde beach waves, piercing blue eyes, Mediterranean features, confident teasing smile",
    "skin_realism": "visible pores, natural skin texture, subtle imperfections, no airbrushing",
    "wardrobe": "ultra-thin white cotton tank top (tight fit, braless, subtle outline), low-rise denim blue mini skirt (tight on curves)",
    "pose": "mirror selfie using shop window reflection, strong back arch, hips pushed back, holding smartphone",
    "environment": "street fashion district at noon, designer store window, urban bokeh background, sun flare",
    "lighting": "hard direct sunlight, high contrast, sharp defined shadows, rim lighting on curves",
    "camera": "shot on iPhone 15 Pro, 24mm wide lens, f/2.0, natural smartphone characteristics",
    "aspect_ratio": "9:16"
  },
  "negative_prompt": "cartoon, 3d render, anime, illustration, painting, drawing, deformed, bad anatomy, wrong proportions, extra limbs, missing limbs, floating limbs, mutated hands, fused fingers, too many fingers, blurry, pixelated, low quality, watermark, signature, text overlay, plastic skin, airbrushed, overexposed, underexposed"
}
```

### Flattened Prompt (Ready to Use)

```
masterpiece, ultra-realistic, professional photography, 8k uhd, raw photo,
young woman mid-20s, honey blonde beach waves, piercing blue eyes, Mediterranean features,
confident teasing smile, visible pores, natural skin texture, subtle imperfections,
ultra-thin white cotton tank top tight fit, low-rise denim blue mini skirt tight on curves,
mirror selfie using shop window reflection, strong back arch, hips pushed back,
street fashion district at noon, designer store window, urban bokeh background, sun flare,
hard direct sunlight, high contrast, sharp defined shadows, rim lighting on curves,
shot on iPhone 15 Pro, 24mm wide lens, f/2.0
```

### Recommended Settings

| Parameter | Value | Notes |
|-----------|-------|-------|
| guidance_scale | 3.5 - 7.5 | Lower for more creative, higher for prompt adherence |
| num_inference_steps | 28-50 | More steps = better quality |
| aspect_ratio | Match prompt | 9:16, 16:9, 1:1 |

### Flux-Specific Keywords

**Boost Quality:**
- `masterpiece`, `best quality`, `highly detailed`
- `professional photograph`, `award-winning photo`
- `8k uhd`, `ultra high resolution`

**Realism:**
- `raw photo`, `unedited`, `natural lighting`
- `subsurface scattering`, `film grain`
- `shot on [camera model]`

**Avoid (Auto-negative):**
- Flux handles most quality issues, but explicit negatives help
- Always include anatomical negatives for people
