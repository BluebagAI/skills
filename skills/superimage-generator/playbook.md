# Superprompt Playbook

Core principles for generating high-quality superprompts.

## The 7 Principles

### 1. Hierarchical Specificity

Be specific, not vague. Add material, fit, color, and interaction details.

- **BAD:** `"wearing a dress"`
- **GOOD:** `"fitted burgundy velvet midi dress, sweetheart neckline, slight sheen"`

### 2. Realism Anchors

Ground the image in physical reality with specific texture and imperfection details.

- **Skin:** `visible pores, natural imperfections`
- **Fabric:** `true weave, natural draping`
- **Light:** `accurate shadows, subsurface scattering`

### 3. Technical Camera Language

Speak like a photographer. Use specific lens and aperture values.

- **Lens:** `24mm wide`, `85mm portrait`, `135mm telephoto`
- **Aperture:** `f/1.8` (blurry background), `f/8` (sharp throughout)

### 4. Negative Prompt Hygiene

Always exclude common issues to prevent unwanted artifacts.

- **Quality:** `low quality, blurry, pixelated`
- **Anatomy:** `deformed, extra limbs, bad hands`
- **Style leaks:** `cartoon, anime, 3d render`

### 5. Spatial Consistency

Define camera and subject relationships clearly.

- **Camera:** `low angle looking up` vs `eye level`
- **Subject:** `centered` vs `rule of thirds right`

### 6. Lighting as Storytelling

Use lighting to convey mood and emotion.

| Lighting Type | Mood |
|---------------|------|
| Golden hour | Warm, romantic |
| Hard midday | Bold, energetic |
| Rim lighting | Dramatic separation |
| Soft diffused | Gentle, flattering |

### 7. Identity Lock

For character consistency across multiple images, lock key identity features.

```json
"character_lock": {
  "age": "mid-20s",
  "hair": { "color": "honey blonde", "style": "beach waves" },
  "body_type": "curvy hourglass"
}
```

## Application

Apply these principles when generating superprompts:

1. **Start specific** — never use vague adjectives like "nice" or "pretty"
2. **Add anchors** — include at least 3 realism anchors for photorealistic styles
3. **Use camera terms** — specify lens, aperture, and device
4. **Cover negatives** — include quality, anatomy, and style leak exclusions
5. **Define space** — clarify camera angle and subject positioning
6. **Set mood with light** — choose lighting that matches the desired emotion
7. **Lock identity** — for recurring characters, specify consistent features
