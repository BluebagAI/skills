# Camera Perspectives Reference

> Use this reference when a user's request implies mood, tension, scale, or narrative depth.
> Do NOT force unusual perspectives on every prompt — standard eye-level is the correct default.
>
> **Agents: Scan the quick reference table first. Only read the full description if a perspective fits the user's intent.**

## Quick Reference

| Perspective                 | Best For                          | Mood/Effect                        |
| --------------------------- | --------------------------------- | ---------------------------------- |
| Overhead / Top-Down         | food, layouts, urban grids        | pattern, symmetry, abstraction     |
| Reverse POV                 | psychological distortion, panic   | surreal, unsettling                |
| Voyeur                      | suspense, intimacy, surveillance  | tension, secrecy, complicity       |
| Mirror POV                  | identity, duality, introspection  | layered, fragmented, psychological |
| Extreme Macro               | texture, micro-emotion, detail    | obsessive, slow, intimate          |
| Ultra-Wide Environmental    | scale, isolation, landscapes      | epic, dwarfing, environmental      |
| Tracking Side Profile       | chase, journey, movement          | momentum, immersion                |
| 1st Person POV              | immersive, action, confrontation  | participatory, visceral            |
| Tight Profile Close-Up      | interrogation, internal conflict  | invasive, confrontational          |
| Periscope / Probe Lens      | tight spaces, product reveals     | curious, sneaking, discovery       |
| Upside-Down                 | confusion, altered consciousness  | disorienting, surreal              |
| Stranger POV                | surveillance, alienation, mystery | distant, uneasy, detached          |
| Forced-Foreground Low-Angle | dominance, threat, power          | imposing, aggressive               |
| Extreme Low Angle + Wide    | heroism, triumph, intimidation    | towering, larger-than-life         |

## How to Apply

When a perspective fits the user's intent, inject it into these existing schema fields — do NOT create new blocks:

**For person/human subjects (e.g., nano-banana schema):**

- `pose` — adjust body orientation to match the perspective (e.g., "seen from directly above, lying on back")
- `camera.technical` — add lens/angle (e.g., "extreme low angle, 16mm wide")
- `scene.environment` — add framing elements (e.g., "shot through rain-streaked window", "reflected in bathroom mirror")
- `lighting` — adjust to support the perspective's mood

**For non-person subjects (e.g., flux/base schema):**

- `camera_technical` — lens, angle, distance
- `environment` — framing objects, spatial context
- `lighting` — mood-appropriate adjustments

**Example — Voyeur perspective applied to a café scene:**

```json
"pose": "seated at corner table, unaware of camera, mid-laugh turning to friend",
"scene": { "environment": "Parisian café interior, shot through rain-streaked front window, condensation on glass partially obscuring view" },
"camera": { "technical": "85mm telephoto, f/2.0, shallow DOF, shot from across the street" }
```

---

## Full Descriptions

### 1. Overhead / Top-Down

Use to reveal patterns, symmetry, or spatial relationships invisible from eye level — ideal for food styling, architectural layouts, or urban grids. Flattens scenes into design-focused compositions, transforming familiar subjects into abstract geometry.

### 2. Reverse POV

Use to create an unsettling, surreal effect during moments of psychological distortion, panic, or self-awareness. Choose sparingly for maximum impact — deliberately violates cinematic grammar to place viewers impossibly inside a character's perspective.

### 3. Voyeur

Use to create tension, secrecy, or the feeling that the viewer is watching something they shouldn't — shoot through doorways, gaps, foliage, or obstructing objects. Makes the audience complicit as intruders. Perfect for suspense, intimate moments, surveillance, or establishing a lurking threat.

### 4. Mirror POV

Use to explore themes of identity, duality, or self-reflection — shoot subjects through mirrors, windows, or reflective surfaces to create visual layers. Works for psychological storytelling, introspection, or when you want reality to feel fragmented and unreliable.

### 5. Extreme Macro

Use to transform tiny details into monumental moments — reveals texture, surface imperfections, or micro-emotions that carry narrative weight. Slows time and forces obsessive attention on small elements like a tear forming, ink spreading, or skin reacting.

### 6. Ultra-Wide Environmental

Use when the setting is as important as the subject — emphasizes scale, isolation, or the relationship between character and surroundings. Places dramatic foreground elements against expansive backgrounds. Perfect for surreal landscapes, survival stories, or environment-driven narrative.

### 7. Tracking Side Profile

Use when you want the audience to feel like they're moving alongside the subject — creates momentum and immersion rather than passive observation. Works for chase sequences, character journeys, reveals of new environments, or any moment where forward motion drives energy.

### 8. 1st Person POV

Use when you want the viewer to become the character rather than watch them — ideal for immersive experiences, action sequences, or moments of direct confrontation. Transforms observation into participation.

### 9. Tight Profile Close-Up

Use to capture psychological tension, internal conflict, or interrogation where every micro-expression matters. Feels invasive and confrontational — reveals bone structure and subtle emotional shifts that expose a character's true state beneath their words.

### 10. Periscope / Probe Lens

Use to navigate tight, impossible, or hidden spaces that normal lenses can't reach — ideal for exploring crevices, threading through objects, or creating a curious, creature-like point of view. Works for product reveals, surgical precision shots, or moments of sneaking discovery.

### 11. Upside-Down

Use to create instant disorientation and instability — ideal for confusion, altered consciousness, psychological breaks, or surreal storytelling. A simple camera flip makes familiar environments feel unsettling, signaling that reality has shifted or perception is unreliable.

### 12. Stranger POV

Use to create distance and tension — makes the viewer feel like an anonymous observer watching from afar. Suggests someone is watching who hasn't been invited in. Perfect for introducing mysterious characters or creating unease through detached observation.

### 13. Forced-Foreground Low-Angle

Use to create dramatic scale distortion and power dynamics — places an object extremely close to the lens while shooting from below. Makes foreground elements feel monumental and imposing. Perfect for gestures of control or transforming ordinary objects into visually aggressive focal points.

### 14. Extreme Low Angle + Wide Lens

Use to make subjects feel towering, heroic, or overwhelming — shoots sharply upward with a wide lens that stretches limbs and distorts scale. Works for triumph, intimidation, superhuman power, or kinetic energy where the character should dominate the frame.
