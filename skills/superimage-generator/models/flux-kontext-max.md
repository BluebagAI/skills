# Flux Kontext Max (Black Forest Labs)

## Model Characteristics

- **Strength**: Context-aware image editing, character consistency, text editing, style transfer
- **Best for**: Image-to-image editing, iterative modifications, maintaining identity across edits
- **Unique**: Maximum quality tier with exceptional prompt adherence and typography handling

## Prompt Format

Flux Kontext Max uses **natural language editing instructions** with explicit preservation clauses. It excels at controlled modifications while maintaining specified elements.

### Template Structure

```
[PRIMARY CHANGE] + [PRESERVATION CLAUSE] + [STYLE/TECHNICAL DETAILS]
```

Maximum: **512 tokens**

### Key Differences from Other Models

1. **Edit-focused**: Designed for modifying existing images, not just generation
2. **Preservation statements required**: Explicitly state what should NOT change
3. **Direct subject naming**: "the woman with blonde hair" beats "she" or "her"
4. **Iterative approach**: Break complex changes into sequential steps
5. **Quotation marks for text**: `Replace '[old]' with '[new]'`

### Prompt Architecture (Generation Mode)

```json
{
  "model": "flux-kontext-max",
  "prompt": {
    "subject_description": "A young athletic woman with blonde hair in a high tight braid, bright natural smile",
    "wardrobe": "olive green compression top with quarter-zip, SpongeBob character shorts",
    "pose": "three-quarter rear-view mirror selfie, looking over right shoulder",
    "environment": "contemporary bathroom with white walls and grey wood floor",
    "technical": "fitness lifestyle photography, 35mm lens, f/2.8, bright diffused lighting",
    "preservation": "maintain realistic skin texture, natural lighting, authentic smartphone aesthetic"
  }
}
```

### Prompt Architecture (Editing Mode)

```json
{
  "model": "flux-kontext-max",
  "input_image": "[reference image]",
  "prompt": {
    "change": "Change the shorts to red athletic shorts",
    "preserve": "while keeping the same facial features, pose, camera angle, and background",
    "style_maintain": "maintain the same lighting quality and smartphone photo aesthetic"
  }
}
```

### Flattened Prompt - Generation

```
A young athletic woman with blonde hair in a high tight braid takes a three-quarter rear-view mirror selfie in a contemporary bathroom. She has a bright natural smile and looks over her right shoulder. She wears an olive green long-sleeved compression top with mock-neck and quarter-zip detail, paired with tight-fitting shorts featuring a vibrant SpongeBob SquarePants character collage in yellow, pink, and blue. The bathroom has white walls and weathered grey wood-plank flooring. Bright diffused overhead lighting, soft shadows, fitness lifestyle photography, 35mm f/2.8. Realistic skin texture, no artificial smoothing.
```

### Flattened Prompt - Editing

```
Change the woman's shorts to solid red athletic shorts while keeping the exact same facial features, body pose, camera angle, position, and framing. Maintain the same lighting, background, and smartphone photo aesthetic.
```

### Editing Techniques

**Object Modification:**
```
Change the compression top to navy blue while keeping everything else the same
```

**Background Changes:**
```
Change the background to a gym locker room while keeping the woman in the exact same position, scale, and pose
```

**Text Editing:**
```
Replace 'XBOX' with 'NIKE' while matching the same font style and color
```

**Style Transfer:**
```
Apply a vintage film photography style while preserving the subject's identity and pose
```

### Character Consistency Framework

1. **Establish clear reference**: Use specific descriptions, not pronouns
   - GOOD: "the woman with the blonde braid and bright smile"
   - BAD: "she" or "her"

2. **Specify transformations clearly**: Environment, activity, or style changes
   - "Place the woman in a gym setting instead of the bathroom"

3. **Preserve identity markers explicitly**:
   - "keeping the same facial structure, hair style, and body proportions"

### Preservation Language

Always include explicit preservation statements:

| What to Preserve | Example Language |
|------------------|------------------|
| Identity | "keeping the same facial features, facial structure" |
| Pose | "in the exact same position, pose, and body angle" |
| Framing | "maintaining the same camera angle and framing" |
| Lighting | "with the same lighting quality and direction" |
| Style | "preserving the smartphone photo aesthetic" |

### Iterative Editing Approach

For dramatic changes, break into steps:

**Step 1:** Change the environment
```
Move the scene to a gym while keeping the woman in the same pose and maintaining her appearance
```

**Step 2:** Modify wardrobe
```
Change her top to a sports bra while keeping the same SpongeBob shorts, pose, and gym background
```

**Step 3:** Adjust lighting
```
Add dramatic side lighting while preserving all other elements
```

### Troubleshooting Patterns

| Issue | Solution |
|-------|----------|
| Identity loss | Use detailed identity preservation language, avoid broad transformation verbs |
| Composition shifts | Specify unchanged framing and positioning explicitly |
| Style inconsistency | Describe detailed visual characteristics alongside style names |
| Text errors | Use quotation marks, match font style and color |

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

**Flux Kontext Max Output (Generation):**
```
A young athletic woman with a mesomorphic build and blonde hair styled in a high tight braid takes a three-quarter rear-view mirror selfie. She looks over her right shoulder with a bright natural smile, showing defined musculature and narrow waist. She wears an olive green long-sleeved compression top with mock-neck collar and quarter-zip detail, with tight-fitting shorts featuring a vibrant SpongeBob SquarePants character collage pattern in yellow, pink, and blue. Contemporary bathroom setting with white walls and weathered grey wood-plank flooring. Bright diffused ambient lighting from overhead creates soft shadows accentuating anatomical definition. Fitness lifestyle photography aesthetic, 35mm lens at f/2.8. Realistic skin texture and natural highlights.
```

**Flux Kontext Max Output (Editing from reference):**
```
Change the bathroom background to a modern gym with weight equipment while keeping the woman in the exact same three-quarter rear-view pose, maintaining her blonde braid, bright smile, olive compression top, and SpongeBob shorts. Preserve the same camera angle, body position, and soft lighting quality.
```

### Recommended Settings

| Parameter | Value | Notes |
|-----------|-------|-------|
| max_tokens | 512 | Hard limit |
| model_tier | "max" | Highest quality, best prompt adherence |
| guidance | balanced | Not too strict, allows natural interpretation |

### Flux Kontext Max Specific Strengths

- **Premium rendering quality**: No compromise on detail
- **Advanced typography**: Reliable text editing and rendering
- **Exceptional prompt adherence**: Follows complex instructions accurately
- **Identity preservation**: Maintains character consistency across edits
- **Context awareness**: Understands relationships between elements
- **Iterative refinement**: Excellent for step-by-step image modification
