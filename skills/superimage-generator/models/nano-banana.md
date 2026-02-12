# Nano Banana Pro

## Model Characteristics

- **Strength**: Hyper-detailed photorealism, anatomical accuracy, complex compositions
- **Versions**: Nano Banana Pro, Nano Banana
- **Best for**: Realistic portraits, lifestyle photography, detailed character renders

## Prompt Format

Nano Banana excels with **deeply structured JSON prompts** that specify every detail hierarchically.

### Template Structure

Nano Banana responds best to prompts organized in this exact hierarchy:

```json
{
  "subject": { /* identity, body, details */ },
  "wardrobe": { /* clothing items with specifics */ },
  "pose_action": { /* position and dynamics */ },
  "scene": { /* environment, reflection integrity */ },
  "lighting": { /* type, effects */ },
  "camera": { /* technical specs, constraints */ }
}
```

### Nano Banana-Specific Optimizations

1. **Anatomical precision**: Specify muscle groups, body mechanics, proportions
2. **Fabric physics**: Describe how clothes interact with body (stretched, draped, etc.)
3. **Reflection integrity**: For mirrors/windows, explicitly state reflection rules
4. **Negative constraints in camera block**: Include what NOT to generate
5. **Hierarchical nesting**: More nesting = more control

### Example Superprompt (Nano Banana Pro)

```json
{
  "model": "nano-banana-pro",
  "prompt": {
    "subject": {
      "description": "A young woman with long, dark burgundy-red hair tied in a messy ponytail, wearing thin-frame glasses, with a fair and natural skin tone.",
      "body": {
        "physique": "Hyper-pronounced hourglass silhouette with an extreme waist-to-hip ratio.",
        "anatomy": "Extremely large, voluminous gluteal muscles (gluteus maximus) with realistic weight and soft skin texture; narrow, cinched waist; toned thighs; well-defined lumbar curve (lower back arch). High-level anatomical accuracy in the legs and feet, showing realistic sole texture and toe alignment.",
        "details": "Visible skin pores, natural skin folds at the waist, no airbrushing, realistic muscle definition in the lower body."
      }
    },
    "wardrobe": {
      "top": "Oversized, thick-knit grey cotton hoodie, slightly cropped or pulled up to reveal the waist.",
      "bottom": "Ultra-short, tight-fitting micro-shorts featuring a vibrant Brazilian flag color palette (canary yellow base with forest green trim and royal blue accents).",
      "text_details": "Bold white text reads 'BRASIL' printed clearly across the fabric of the shorts.",
      "accessories": "Thin silver wireframe spectacles; small stud earrings."
    },
    "pose_action": {
      "description": "The subject is seated on the floor in a dynamic twist; lower body is angled away from the camera to emphasize the volume of the hips, while the torso is turned back toward a mirror. She is holding a modern smartphone in a black case, capturing a high-angle mirror selfie.",
      "posture": "Seated on shins with feet tucked, creating a 'W-sit' variation that highlights the curvature of the glutes and hips."
    },
    "scene": {
      "environment": "A cozy, sunlit domestic bedroom or studio. The floor is covered in a beige, high-pile textured carpet. In the background, a tall black cat tree with a plush 'Chopper' hat toy and a white desk chair with a patterned beige throw are visible but softly out of focus.",
      "reflection_integrity": "Mirror selfie perspective; ensure the phone and hands are reflected accurately with consistent spatial logic. Reflection shows the back of the hoodie and the side profile of the face."
    },
    "lighting": {
      "type": "Soft, diffused natural daylight coming from a side window.",
      "effects": "Subtle rim lighting along the curves of the hips and shoulders to enhance three-dimensional volume; soft shadows on the carpet to ground the subject; natural highlights on the skin and hair."
    },
    "camera": {
      "technical": "Shot on 35mm lens, f/2.8 aperture for a shallow depth of field, sharp focus on the subject's body and shorts, 8k resolution, raw photo style.",
      "aspect_ratio": "9:16",
      "negative_constraints": "no logos (except specified), no beautify smoothing, no extra limbs, no AI artifacts, no random text, no distorted fingers, no blurred skin textures, reflection integrity rules applied."
    }
  }
}
```

### Key Differentiators from Other Models

| Feature | Nano Banana | Other Models |
|---------|-------------|--------------|
| Body detail | Muscle groups, anatomical terms | General descriptions |
| Clothing | Fabric interaction with body | Basic garment description |
| Reflections | Explicit integrity rules | Often inconsistent |
| Negatives | In-prompt constraints | Separate negative prompt |
| Structure | Deep JSON nesting | Flat or shallow |

### Anatomical Vocabulary (Nano Banana Specialty)

**Body Structure:**
- `gluteus maximus` - buttocks muscles
- `lumbar curve` - lower back arch
- `waist-to-hip ratio` - body proportions
- `hourglass silhouette` - body shape

**Skin Realism:**
- `visible skin pores`
- `natural skin folds`
- `realistic muscle definition`
- `soft skin texture with weight`
- `no airbrushing`

**Posture Terms:**
- `W-sit variation` - seated pose
- `dynamic twist` - torso rotation
- `lower body angled away` - camera relation

### Wardrobe Specificity

Always include for clothing:
1. **Material**: `thick-knit cotton`, `denim`, `silk`
2. **Fit**: `tight-fitting`, `oversized`, `cropped`
3. **Interaction**: `pulled up to reveal`, `stretched over`, `draped`
4. **Colors**: Specific palette names, not just "colorful"
5. **Text/Logos**: Exact wording and placement

### Reflection Integrity Rules

For mirror/window selfies, always specify:
```json
"reflection_integrity": {
  "perspective": "mirror selfie from [angle]",
  "visible_in_reflection": ["back of garment", "side profile", "phone"],
  "spatial_logic": "consistent with camera position",
  "phone_reflection": "accurate hand and device placement"
}
```

### Lighting for Nano Banana

**Optimal Setup:**
```json
"lighting": {
  "type": "Soft, diffused natural daylight",
  "source": "side window",
  "effects": [
    "rim lighting along curves",
    "soft shadows for grounding",
    "natural highlights on skin and hair",
    "three-dimensional volume enhancement"
  ]
}
```

### Camera Block (Critical)

Always include these elements:
```json
"camera": {
  "technical": "Shot on [lens]mm lens, f/[aperture] aperture",
  "depth_of_field": "shallow/deep with focus on [element]",
  "resolution": "8k resolution",
  "style": "raw photo style",
  "aspect_ratio": "9:16 | 16:9 | 1:1",
  "negative_constraints": [
    "no logos (except specified)",
    "no beautify smoothing",
    "no extra limbs",
    "no AI artifacts",
    "no random text",
    "no distorted fingers",
    "no blurred skin textures"
  ]
}
```

### Recommended Settings

| Parameter | Value | Notes |
|-----------|-------|-------|
| structure | JSON | Always use structured JSON |
| detail_level | maximum | More detail = better results |
| aspect_ratio | 9:16 | Optimal for portraits |
| negative_style | inline | Put negatives in camera block |

### Template: Lifestyle Mirror Selfie

```json
{
  "subject": {
    "description": "[age] [gender] with [hair description], [skin tone]",
    "body": {
      "physique": "[body type] with [proportions]",
      "anatomy": "[specific muscle/body details with anatomical terms]",
      "details": "[skin realism markers]"
    }
  },
  "wardrobe": {
    "top": "[garment] [material] [fit] [color] [interaction with body]",
    "bottom": "[garment] [material] [fit] [color] [details]",
    "text_details": "[any text on clothing with exact wording]",
    "accessories": "[list specific items with materials]"
  },
  "pose_action": {
    "description": "[full pose description with body positioning]",
    "posture": "[specific posture name and what it emphasizes]"
  },
  "scene": {
    "environment": "[location with specific props and textures]",
    "reflection_integrity": "[mirror/reflection rules if applicable]"
  },
  "lighting": {
    "type": "[light source and quality]",
    "effects": "[specific lighting effects on subject]"
  },
  "camera": {
    "technical": "[lens, aperture, resolution, style]",
    "aspect_ratio": "[ratio]",
    "negative_constraints": "[inline negatives]"
  }
}
```

### Common Mistakes to Avoid

1. **Vague anatomy**: Say "gluteus maximus" not "butt"
2. **Missing fabric interaction**: How does clothing sit/stretch/drape?
3. **No reflection rules**: Mirror shots need explicit integrity
4. **Flat structure**: Nest deeply for better control
5. **Generic negatives**: Be specific about what artifacts to avoid
