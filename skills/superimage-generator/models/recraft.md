# Recraft

## Model Characteristics

- **Strength**: Vector graphics, illustrations, icons, consistent style
- **Versions**: Recraft V3, Recraft V2
- **Best for**: UI/UX assets, icons, brand illustrations, stylized art

## Prompt Format

Recraft works best with **style-first descriptions** and **clean, graphic language**.

### Template Structure

```
[STYLE PRESET], [SUBJECT], [VISUAL TREATMENT],
[COLOR SPECIFICATION], [COMPOSITION], [OUTPUT TYPE]
```

### Recraft Style Presets

- `realistic_image` - Photorealistic
- `digital_illustration` - Clean digital art
- `vector_illustration` - Scalable graphics
- `icon` - Simple iconography
- `realistic_image/b_and_w` - Black and white
- `realistic_image/hard_flash` - Flash photography look
- `realistic_image/hdr` - High dynamic range
- `realistic_image/natural_light` - Soft natural lighting
- `realistic_image/studio_portrait` - Professional portrait
- `realistic_image/enterprise` - Corporate/business
- `realistic_image/motion_blur` - Dynamic movement
- `digital_illustration/pixel_art` - Retro pixel style
- `digital_illustration/hand_drawn` - Sketch aesthetic
- `digital_illustration/grain` - Textured illustration
- `digital_illustration/infantile_sketch` - Childlike drawing
- `digital_illustration/2d_art_poster` - Flat poster art
- `digital_illustration/engraving_color` - Engraved look
- `digital_illustration/grain/2d_art_poster_2` - Grainy poster

### Example Superprompt (Recraft)

```json
{
  "model": "recraft",
  "version": "v3",
  "style": "digital_illustration",
  "prompt": {
    "subject": "young woman with flowing hair, profile view, serene expression",
    "visual_treatment": "clean lines, flat colors with subtle gradients, minimalist aesthetic",
    "color_palette": {
      "primary": "soft coral pink",
      "secondary": "cream white",
      "accent": "gold",
      "background": "warm beige"
    },
    "composition": "centered portrait, circular frame suggestion, balanced negative space",
    "details": "geometric hair strands, stylized features, elegant simplicity"
  },
  "settings": {
    "style_id": "digital_illustration",
    "substyle_id": "2d_art_poster",
    "aspect_ratio": "1:1"
  },
  "negative_prompt": "photorealistic, complex textures, noise, grain, messy lines, cluttered"
}
```

### Flattened Prompt (Ready to Use)

```
Digital illustration, 2D art poster style,
young woman with flowing geometric hair strands in profile view,
serene peaceful expression, stylized elegant features,
clean vector lines, flat colors with subtle gradients,
soft coral pink and cream white color palette with gold accents,
warm beige background, centered portrait composition,
minimalist aesthetic, balanced negative space,
modern illustration, clean graphic design
```

### Recommended Settings

| Parameter | Value | Notes |
|-----------|-------|-------|
| style | digital_illustration | Or vector_illustration for icons |
| substyle | Match aesthetic | 2d_art_poster, hand_drawn, etc. |
| aspect_ratio | 1:1 | Common for icons/illustrations |
| controls | color palette | Specify exact colors |

### Recraft-Specific Keywords

**Illustration Styles:**
- `flat design`, `vector art`, `line art`
- `geometric`, `organic shapes`, `abstract`
- `minimalist`, `detailed`, `intricate`

**Color Language:**
- `limited palette`, `monochromatic`, `complementary colors`
- `pastel`, `vibrant`, `muted tones`
- `gradient`, `solid fill`, `color blocking`

**Output Quality:**
- `clean edges`, `crisp lines`, `scalable`
- `print-ready`, `web-optimized`
- `consistent style`, `brand-aligned`

### Icon-Specific Tips

For icons, use:
```
Simple icon of [subject], single color, minimal detail,
centered composition, clear silhouette,
scalable vector style, consistent line weight,
[color] on transparent background
```
