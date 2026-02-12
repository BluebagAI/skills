# Luma

## Model Characteristics

- **Strength**: Video generation, 3D scenes, motion, cinematic quality
- **Products**: Dream Machine (video), Genie (3D)
- **Best for**: Short video clips, animated scenes, 3D model generation

## Prompt Format

Luma requires **motion-aware descriptions** and **temporal thinking**.

### Template Structure

```
[SCENE SETUP], [SUBJECT + ACTION], [CAMERA MOVEMENT],
[LIGHTING/MOOD], [TEMPORAL DETAILS], [STYLE]
```

### Luma-Specific Optimizations

1. **Describe motion**: What moves, how it moves, timing
2. **Camera language**: Pan, dolly, tracking, static
3. **Temporal markers**: "begins with", "transitions to", "ends on"
4. **Cinematic vocabulary**: Think like a cinematographer

### Example Superprompt (Luma Video)

```json
{
  "model": "luma",
  "product": "dream-machine",
  "prompt": {
    "scene_setup": "golden hour beach scene, warm sunlight, gentle waves",
    "subject": "young woman in flowing white sundress",
    "action": {
      "start": "standing still, looking at horizon",
      "middle": "turns slowly towards camera, dress flowing in breeze",
      "end": "gentle smile, hair catching the light"
    },
    "camera": {
      "movement": "slow dolly in",
      "angle": "eye level, slightly low",
      "focus": "subject sharp, background soft bokeh"
    },
    "lighting": "backlit golden hour, rim light on hair and dress edges, lens flare",
    "mood": "peaceful, nostalgic, romantic",
    "duration_hint": "5 seconds"
  },
  "settings": {
    "aspect_ratio": "16:9",
    "loop": false
  },
  "negative_prompt": "static, frozen, jerky motion, jump cuts, morphing face, distorted limbs"
}
```

### Flattened Prompt (Ready to Use)

```
Cinematic video, golden hour beach scene,
young woman in flowing white sundress standing at shoreline,
slowly turns towards camera as dress flows gently in the ocean breeze,
warm backlit sunlight creating rim light on hair and fabric edges,
subtle lens flare, soft bokeh background of gentle waves,
slow dolly camera movement pushing in,
peaceful nostalgic romantic mood,
professional cinematography, 4k quality, smooth motion
```

### Recommended Settings

| Parameter | Value | Notes |
|-----------|-------|-------|
| aspect_ratio | 16:9 | Cinematic standard |
| duration | 5s | Dream Machine default |
| loop | true/false | For seamless loops |
| enhance_prompt | true | Better motion coherence |

### Motion Description Guide

**Camera Movements:**
- `static` - No camera movement
- `pan left/right` - Horizontal rotation
- `tilt up/down` - Vertical rotation
- `dolly in/out` - Moving toward/away
- `tracking shot` - Following subject
- `crane up/down` - Vertical movement
- `handheld` - Slight natural shake

**Subject Motion:**
- `walking`, `running`, `turning`
- `hair flowing`, `fabric rippling`
- `slow motion`, `normal speed`
- `subtle movement`, `dynamic action`

**Temporal Language:**
- "begins with...", "starts as..."
- "gradually transitions to..."
- "slowly reveals..."
- "ends with...", "settles into..."

### Luma 3D (Genie) Tips

For 3D model generation:
```json
{
  "model": "luma-genie",
  "prompt": {
    "object": "detailed character bust",
    "description": "young woman, stylized features, flowing hair",
    "material": "smooth clay-like surface, subtle texture",
    "style": "modern sculpture, clean topology",
    "view": "front-facing, suitable for 360 rotation"
  }
}
```

### Cinematic Keywords

**Mood/Atmosphere:**
- `cinematic`, `filmic`, `movie-like`
- `dreamlike`, `ethereal`, `grounded`
- `intimate`, `epic`, `contemplative`

**Quality:**
- `smooth motion`, `fluid movement`
- `professional cinematography`
- `high production value`
- `coherent motion`, `stable video`
