const { z } = require('zod');

const SUPPORTED_MODELS = [
  'flux',
  'flux-ip-adapter',
  'flux-kontext-max',
  'nano-banana',
  'ideogram',
  'recraft',
  'luma',
  'reve',
  'grok-imagine',
  'midjourney',
  'gpt-image-1.5',
  'seedream-4.5',
];
const ASPECT_RATIOS = [
  '1:1',
  '4:5',
  '5:4',
  '3:4',
  '4:3',
  '16:9',
  '9:16',
  '21:9',
  '3:2',
  '2:3',
];
const QUALITY_TIERS = ['masterpiece', 'professional', 'standard', 'draft'];
const STYLE_TYPES = [
  'photorealistic',
  'cinematic',
  'editorial',
  'artistic',
  'illustration',
  'vector',
  'anime',
  '3d-render',
  'sketch',
  'painterly',
];
const LIGHTING_TYPES = [
  'natural',
  'studio',
  'dramatic',
  'soft',
  'hard',
  'golden-hour',
  'blue-hour',
  'overcast',
  'backlit',
  'rim-light',
  'volumetric',
];

const PromptTypeSchema = z.union([
  z.literal('portrait'),
  z.literal('product'),
  z.literal('collage'),
]);

const StringArraySchema = z.array(z.string());

const MetaSchema = z.object({
  quality_tier: z.string().describe(`See QUALITY_TIERS: ${QUALITY_TIERS.join(', ')}`),
  aspect_ratio: z.string().describe(`See ASPECT_RATIOS: ${ASPECT_RATIOS.join(', ')}`),
  style: z.string().describe(`See STYLE_TYPES: ${STYLE_TYPES.join(', ')}`),
  target_model: z.string(),
  quality: z.string().optional(),
  aesthetic: z.string().optional(),
  device: z.string().optional(),
  color_mode: z.string().optional(),
  composition_type: z.string().optional(),
  film_stock: z.string().optional(),
  era: z.string().optional(),
  realism_level: z.string().optional(),
  template_purpose: z.string().optional(),
  resolution: z.string().optional(),
  lens: z.string().optional(),
  camera: z.string().optional(),
  pov: z.string().optional(),
  rendering: z.string().optional(),
  fidelity: z.string().optional(),
  flash: z.string().optional(),
  has_reference_image: z.boolean().optional(),
});

const ReferenceImageSchema = z.object({
  face_identity: z.string().describe('e.g., "use uploaded reference image"'),
  identity_lock: z.boolean().default(true).describe('Prevents face drift when true'),
  face_accuracy: z
    .string()
    .describe(
      'e.g., "100% identical to reference — same facial structure, proportions, skin texture"'
    ),
  preserve_features: z
    .array(z.string())
    .optional()
    .describe('Specific features to preserve: ["facial structure", "skin texture", "expression"]'),
});

const PortraitIdentitySchema = z.object({
  age_range: z.string().describe('e.g., "mid-20s", "early 30s"'),
  type: z.string().describe('e.g., "young woman", "elderly man", "child"'),
  ethnicity: z.string().optional().describe('For consistency, e.g., "Mediterranean", "East Asian"'),
  distinguishing_features: z.array(z.string()),
});

const PortraitPhysicalDetailsSchema = z.object({
  body_type: z.string().optional().describe('e.g., "athletic", "curvy", "slim"'),
  body: z
    .object({
      frame: z.string().optional(),
      physique: z.string().optional(),
      details: z.string().optional(),
    })
    .optional(),
  skin: z.object({
    tone: z.string(),
    texture: z.string().describe('e.g., "visible pores", "smooth", "freckled"'),
    realism_markers: z.array(z.string()).optional(),
    details: z.string().optional(),
  }),
  hair: z.object({
    color: z.string(),
    style: z.string(),
    details: z.string().optional(),
  }),
  face: z.object({
    features: z.string().optional(),
    expression: z.string(),
    gaze: z.string().optional(),
    makeup: z.string().optional(),
    details: z.string().optional(),
  }),
});

const PortraitSubjectSchema = z.object({
  description: z.string().min(10).describe('One-liner summary of the subject'),
  identity: PortraitIdentitySchema,
  physical_details: PortraitPhysicalDetailsSchema,
  expression_mood: z.string(),
});

const CollageSubjectSchema = z.object({
  description: z.string().min(5),
  identity: z
    .object({
      age_range: z.string().optional(),
      type: z.string().optional(),
      body_type: z.string().optional(),
      appearance: z.string().optional(),
      hair: z
        .object({
          color: z.string().optional(),
          style: z.string().optional(),
          details: z.string().optional(),
        })
        .optional(),
      distinguishing_features: z.array(z.string()).optional(),
      consistency: z.string().optional(),
    })
    .optional(),
  physical_details: z
    .object({
      hair: z
        .object({
          color: z.string().optional(),
          style: z.string().optional(),
          details: z.string().optional(),
        })
        .optional(),
      skin: z
        .object({
          tone: z.string().optional(),
          texture: z.string().optional(),
          details: z.string().optional(),
        })
        .optional(),
      face: z
        .object({
          features: z.string().optional(),
          expression: z.string().optional(),
          expressions: z.array(z.string()).optional(),
        })
        .optional(),
      pose_energy_ratio: z.string().optional(),
      pose_types_allowed: z.array(z.string()).optional(),
      pose_types_forbidden: z.array(z.string()).optional(),
      wardrobe_direction: z.string().optional(),
    })
    .optional(),
  expression_range: z.array(z.string()).optional(),
  consistency_note: z.string().optional(),
  count: z.number().optional(),
});

const ProductPhysicalDetailsSchema = z.object({
  materials: z.array(z.string()).optional(),
  micro_detail_requirements: z.array(z.string()).optional(),
  finish: z.string().optional(),
  skin: z
    .object({
      texture: z.string().optional(),
      realism_markers: z.array(z.string()).optional(),
    })
    .optional(),
});

const ProductSubjectSchema = z.object({
  description: z.string().min(5),
  identity: z
    .object({
      type: z.string().optional(),
      distinguishing_features: z.array(z.string()).optional(),
    })
    .optional(),
  physical_details: ProductPhysicalDetailsSchema,
  expression_mood: z.string().optional(),
});

const ClothingItemSchema = z.object({
  type: z.string().min(1).describe('e.g., "tank top", "jeans", "dress"'),
  material: z.string().optional().describe('e.g., "cotton", "denim", "silk"'),
  fit: z.string().optional().describe('e.g., "tight", "loose", "oversized"'),
  color: z.string().optional(),
  style: z.string().optional(),
  pattern: z.string().optional(),
  texture: z.string().optional(),
  details: z.string().optional().describe('Additional specifics'),
});

const WardrobeStylingSchema = z.object({
  clothing: z.array(ClothingItemSchema),
  accessories: z.array(z.string()).optional(),
  text_elements: z.string().optional().nullable().describe('Any text that should appear on clothing'),
  styling: z.string().optional(),
});

const PoseActionSchema = z.object({
  position: z.string().optional().describe('Body positioning description'),
  camera_relation: z.string().optional().describe('Angle relative to camera'),
  description: z.string().optional().describe('Overall pose/action summary'),
  posture: z.string().optional().describe('Specific posture name or emphasis'),
  action: z.string().optional().describe('Movement, gesture, interaction'),
  dynamic_elements: z.string().optional().describe('Movement, gesture, interaction details'),
  body_language: z.string().optional(),
  gaze: z.string().optional(),
  expression: z.string().optional(),
  hands: z.string().optional(),
});

const EnvironmentPropSchema = z.object({
  item: z.string(),
  details: z.string().optional(),
  physics: z.string().optional().describe('e.g., "condensation on surface"'),
  held_by: z.string().optional(),
});

const EnvironmentSchema = z.object({
  location: z.string().describe('Setting description'),
  background: z.array(z.string()).describe('Visible background elements'),
  props: z.array(EnvironmentPropSchema).optional(),
  atmosphere: z.string().describe('Mood of the environment'),
  time_of_day: z.string().optional(),
  time: z.string().optional(),
  weather: z
    .object({
      condition: z.string().optional(),
      details: z.string().optional(),
    })
    .optional(),
  altitude_context: z.string().optional(),
  background_sharpness: z.string().optional(),
  color_palette: z.string().optional(),
  country_feel: z.string().optional(),
  flooring: z.string().optional(),
  ground: z.string().optional(),
  interior: z.array(z.string()).optional(),
  mirror: z
    .object({
      type: z.string().optional(),
    })
    .optional(),
  nested_environment: z
    .object({
      location: z.string().optional(),
      background: z.array(z.string()).optional(),
      atmosphere: z.string().optional(),
    })
    .optional(),
  outer_environment: z
    .object({
      description: z.string().optional(),
      lighting: z.string().optional(),
    })
    .optional(),
  objects: z
    .array(
      z.object({
        type: z.string().optional(),
        color: z.string().optional(),
        material: z.string().optional(),
      })
    )
    .optional(),
  rules: z.string().optional(),
  setting: z.string().optional(),
  structure: z
    .object({
      walls: z.string().optional(),
      flooring: z.string().optional(),
      overhead: z.string().optional(),
    })
    .optional(),
  surface: z.string().optional(),
  visible_equipment: z.string().optional(),
  wall_color: z.string().optional(),
  foreground_prop: z
    .object({
      item: z.string().optional(),
      materials: z.array(z.string()).optional(),
    })
    .optional(),
  furniture: z
    .object({
      main: z.string().optional(),
    })
    .optional(),
});

const LightingSchema = z.object({
  type: z.string().describe(`See LIGHTING_TYPES: ${LIGHTING_TYPES.join(', ')}`),
  direction: z.string().optional().describe('Where light comes from'),
  quality: z.string().describe('e.g., "hard", "soft", "diffused"'),
  effects: z.array(z.string()).describe('e.g., "rim light", "lens flare"'),
  shadows: z.string().optional(),
  contrast: z.string().optional(),
  color_temperature: z.string().optional(),
  setup: z.string().optional(),
  style: z.string().optional(),
  sources: z.array(z.string()).optional(),
  white_balance: z.string().optional(),
  ambient: z.string().optional(),
  intensity: z.string().optional(),
  primary: z.string().optional(),
  secondary: z.string().optional(),
  equipment: z.string().optional(),
  artifacts: z.string().optional(),
  rules: z.string().optional(),
});

const CameraTechnicalSchema = z.object({
  device: z.string().optional().describe('Camera type or smartphone model'),
  lens: z.string().optional().describe('Focal length, e.g., "85mm", "24mm wide"'),
  aperture: z.string().optional().describe('f-stop, e.g., "f/1.8", "f/2.8"'),
  resolution: z.string().optional().describe('e.g., "4k", "8k", "hd", "ultra-high"'),
  style_tags: z.array(z.string()).optional().describe('e.g., "raw", "film grain", "bokeh"'),
  angle: z.string().optional(),
  shot_type: z.string().optional(),
  framing: z.string().optional(),
  focus: z.string().optional(),
  depth_of_field: z.string().optional(),
  composition: z.string().optional(),
  texture: z.string().optional(),
  perspective: z.string().optional(),
  distance: z.string().optional(),
  height: z.string().optional(),
  tilt: z.string().optional(),
  orientation: z.string().optional(),
  style: z.string().optional(),
  camera: z.string().optional(),
  color_grading: z.string().optional(),
  compression: z.string().optional(),
  detail: z.string().optional(),
  era: z.string().optional(),
  film_grain: z.string().optional(),
  flash: z.string().optional(),
  iso_simulation: z.string().optional(),
  look: z.string().optional(),
  motion: z.string().optional(),
  noise: z.string().optional(),
  pov: z.string().optional(),
  skin_texture: z.string().optional(),
  white_balance: z.string().optional(),
  constraints: z.array(z.string()).optional(),
  imperfections: z.array(z.string()).optional(),
  optics: z.array(z.string()).optional(),
  quality_tags: z.array(z.string()).optional(),
  sensor_artifacts: z.array(z.string()).optional(),
  settings: z
    .object({
      aperture: z.string().optional(),
      iso: z.union([z.string(), z.number()]).optional(),
      shutter: z.string().optional(),
      shutter_speed: z.string().optional(),
      white_balance: z.string().optional(),
    })
    .optional(),
  exposure: z
    .object({
      highlight_rule: z.string().optional(),
      iso_hint: z.string().optional(),
      metering: z.string().optional(),
      white_balance: z.string().optional(),
    })
    .optional(),
  post_processing: z
    .object({
      aesthetic: z.string().optional(),
      overlay: z.string().optional(),
    })
    .optional(),
});

const TheVibeSchema = z.object({
  energy: z.string().optional(),
  mood: z.string().optional(),
  aesthetic: z.string().optional(),
  authenticity: z.string().optional(),
  intimacy: z.string().optional(),
  story: z.string().optional(),
  final_look: z.string().optional(),
});

const ColorPaletteSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
  background: z.string().optional(),
  dominant: z.string().optional(),
  overall_tone: z.string().optional(),
  contrast: z.string().optional(),
  skin: z.string().optional(),
  neutral_base: z.string().optional(),
  contrast_strategy: z.string().optional(),
});

const TextureLayerSchema = z.object({
  skin_physics: z.string().optional(),
  fabric_physics: z.string().optional(),
  environment_physics: z.string().optional(),
});

const MaterialsTexturesSchema = z.object({
  fabric: z.string().optional(),
  tiles: z.string().optional(),
  water: z.string().optional(),
});

const ColorGradingSchema = z.object({
  palette: z.string().optional(),
  contrast: z.string().optional(),
  saturation: z.string().optional(),
});

const TypographySchema = z.object({
  visible_text: z.array(z.string()).optional(),
  location: z.string().optional(),
});

const MirrorRulesSchema = z.object({
  reflection_integrity: z.string().optional(),
  text_handling: z.string().optional(),
  signage: z.string().optional(),
});

const ControlNetSchema = z.object({
  depth_control: z
    .object({
      model_type: z.string().optional(),
      purpose: z.string().optional(),
      recommended_weight: z.number().optional(),
      constraints: z.array(z.string()).optional(),
    })
    .optional(),
  pose_control: z
    .object({
      model_type: z.string().optional(),
      purpose: z.string().optional(),
      recommended_weight: z.number().optional(),
      constraints: z.array(z.string()).optional(),
    })
    .optional(),
});

const VisualHierarchySchema = z.object({
  layer_1_physical: z
    .object({
      description: z.string().optional(),
      surface_details: z.array(z.string()).optional(),
      foreground_anchor: z.string().optional(),
    })
    .optional(),
  layer_2_interface: z
    .object({
      description: z.string().optional(),
      theme: z.string().optional(),
    })
    .optional(),
  layer_3_nested_content: z
    .object({
      description: z.string().optional(),
    })
    .optional(),
});

const CompositionSchema = z.object({
  shot_type: z.string().optional(),
  camera_angle: z.string().optional(),
  framing: z.string().optional(),
  style: z.string().optional(),
  camera_height: z.string().optional(),
  perspective: z.string().optional(),
  crop: z.string().optional(),
  symmetry: z.string().optional(),
});

const AdditionalSubjectSchema = z.object({
  role: z.string().optional(),
  position: z.string().optional(),
  description: z.string().min(3),
  physical_details: z
    .object({
      skin: z
        .object({
          texture: z.string().optional(),
          realism_markers: z.array(z.string()).optional(),
        })
        .optional(),
      hair: z
        .object({
          color: z.string().optional(),
          style: z.string().optional(),
        })
        .optional(),
      facial_hair: z.string().optional(),
      face: z
        .object({
          expression: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  wardrobe: z
    .object({
      outfit: z.string().optional(),
      accessories: z.array(z.string()).optional(),
    })
    .optional(),
  action: z.string().optional(),
  phone: z
    .object({
      type: z.string().optional(),
      color: z.string().optional(),
      reflection_accuracy: z.string().optional(),
    })
    .optional(),
});

const RealismAnchorsSchema = z
  .array(z.string())
  .min(1)
  .describe('Specific details that enhance realism, e.g., "visible skin pores", "fabric texture"');
const NegativePromptSchema = z
  .array(z.string())
  .min(3)
  .describe('Elements to exclude from generation');

const PortraitSuperpromptSchema = z.object({
  prompt_type: z.literal('portrait'),
  meta: MetaSchema,
  subject: PortraitSubjectSchema,
  subjects: z.array(AdditionalSubjectSchema).optional(),
  wardrobe: WardrobeStylingSchema,
  pose_action: PoseActionSchema,
  environment: EnvironmentSchema,
  lighting: LightingSchema,
  camera_technical: CameraTechnicalSchema,
  realism_anchors: RealismAnchorsSchema,
  negative_prompt: NegativePromptSchema,
  the_vibe: TheVibeSchema.optional(),
  texture_layer: TextureLayerSchema.optional(),
  rendering_style: z.string().optional(),
  technical_modifiers: z.array(z.string()).optional(),
  materials_textures: MaterialsTexturesSchema.optional(),
  color_grading: ColorGradingSchema.optional(),
  typography: TypographySchema.optional(),
  mirror_rules: MirrorRulesSchema.optional(),
  controlnet: ControlNetSchema.optional(),
  visual_hierarchy: VisualHierarchySchema.optional(),
  color_palette: ColorPaletteSchema.optional(),
  composition: CompositionSchema.optional(),
});

const ProductSuperpromptSchema = z.object({
  prompt_type: z.literal('product'),
  meta: MetaSchema,
  concept: z
    .object({
      brand_name: z.string().optional(),
      object_rule: z.string().optional(),
      object_categories_allowed: z.array(z.string()).optional(),
      design_brief: z.string().optional(),
    })
    .optional(),
  subject: ProductSubjectSchema,
  environment: EnvironmentSchema,
  lighting: LightingSchema,
  camera_technical: CameraTechnicalSchema,
  layout_overlays: z
    .object({
      bottom_right_logo: z
        .object({
          content: z.string().optional(),
          style: z.string().optional(),
          color: z.string().optional(),
          size_rule: z.string().optional(),
          placement: z.string().optional(),
        })
        .optional(),
      bottom_left_caption: z
        .object({
          content_template: z.string().optional(),
          font_style: z.string().optional(),
          color: z.string().optional(),
          tracking: z.string().optional(),
          line_spacing: z.string().optional(),
          placement: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  realism_anchors: RealismAnchorsSchema,
  negative_prompt: NegativePromptSchema,
});

const CollagePanelItemSchema = z.object({
  item: z.string(),
  price: z.string().optional(),
  details: z.string().optional(),
});

const CollagePanelSchema = z.object({
  id: z.string(),
  description: z.string(),
  shot_type: z.string().optional(),
  pose: z.string().optional(),
  setting: z.string().optional(),
  lighting: z.string().optional(),
  props: z.string().optional(),
  overlays: z.array(z.string()).optional(),
  items: z.array(CollagePanelItemSchema).optional(),
});

const CollageCompositionSchema = z.object({
  type: z.string(),
  layout: z.string().optional(),
  panels: z.array(CollagePanelSchema),
  consistency: z.string().optional(),
  grid_structure: z.string().optional(),
  visual_flow: z.string().optional(),
  subject_placement: z.string().optional(),
});

const CollageLightingSchema = z.object({
  type: z.string().optional(),
  quality: z.string().optional(),
  direction: z.string().optional(),
  effects: z.array(z.string()).optional(),
  overall: z.string().optional(),
  right_side: z.string().optional(),
  left_side: z.string().optional(),
  per_panel: z
    .object({
      window_shot: z.string().optional(),
      street_shot: z.string().optional(),
      overhead_selfie: z.string().optional(),
    })
    .optional(),
});

const CollageSuperpromptSchema = z.object({
  prompt_type: z.literal('collage'),
  meta: MetaSchema,
  composition: CollageCompositionSchema,
  subject: CollageSubjectSchema,
  wardrobe: WardrobeStylingSchema.optional(),
  environment: EnvironmentSchema,
  lighting: CollageLightingSchema,
  camera_technical: CameraTechnicalSchema.optional(),
  creative_direction: z
    .object({
      role: z.string().optional(),
      core_aesthetic: z.string().optional(),
      style_keywords: z.array(z.string()).optional(),
    })
    .optional(),
  photography_source: z
    .object({
      capture_style: z.string().optional(),
      camera_angle: z.string().optional(),
      crop: z.string().optional(),
      camera_technical: z.string().optional(),
    })
    .optional(),
  collage_layers: z
    .object({
      layer_order: z.array(z.string()).optional(),
      primary_color_blob: z
        .object({
          coverage: z.string().optional(),
          shape_style: z.string().optional(),
          texture: z.string().optional(),
          placement_rule: z.string().optional(),
        })
        .optional(),
      graphic_elements: z
        .object({
          count: z.string().optional(),
          placement: z.string().optional(),
          scale_mix: z.string().optional(),
          style: z.string().optional(),
          color_rule: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  typography: z
    .object({
      logo: z
        .object({
          content: z.string().optional(),
          placement: z.string().optional(),
          size_rule: z.string().optional(),
        })
        .optional(),
      slogan: z
        .object({
          content: z.string().optional(),
          style: z.string().optional(),
          rotation_range_degrees: z.string().optional(),
        })
        .optional(),
      supporting_copy: z
        .object({
          content: z.string().optional(),
          style: z.string().optional(),
          optional: z.boolean().optional(),
        })
        .optional(),
      hierarchy: z.string().optional(),
    })
    .optional(),
  composition_rules: z
    .object({
      layout: z.string().optional(),
      negative_space: z.string().optional(),
      focal_weight: z.string().optional(),
      movement_flow: z.string().optional(),
    })
    .optional(),
  brand_intelligence: z
    .object({
      autonomous_adaptation: z.boolean().optional(),
      persona_modes: z
        .object({
          streetwear_sportswear: z.string().optional(),
          luxury_streetwear: z.string().optional(),
          beauty_lifestyle: z.string().optional(),
          tech_modern: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  social_footer: z
    .object({
      enabled: z.boolean().optional(),
      height: z.string().optional(),
      background: z.string().optional(),
      content: z.string().optional(),
      aesthetic: z.string().optional(),
    })
    .optional(),
  aesthetic_theme: z
    .object({
      style: z.string().optional(),
      mood: z.string().optional(),
      color_palette: z.array(z.string()).optional(),
      textures: z.array(z.string()).optional(),
    })
    .optional(),
  ui_elements: z
    .object({
      music_player: z
        .object({
          style: z.string().optional(),
          content: z.string().optional(),
          features: z.array(z.string()).optional(),
        })
        .optional(),
      graphics: z.array(z.string()).optional(),
    })
    .optional(),
  overall_style: z
    .object({
      mood: z.string().optional(),
      color_palette: z.string().optional(),
    })
    .optional(),
  the_vibe: TheVibeSchema.optional(),
  color_palette: ColorPaletteSchema.optional(),
  realism_anchors: RealismAnchorsSchema,
  negative_prompt: NegativePromptSchema,
});

const SuperpromptSchema = z.discriminatedUnion('prompt_type', [
  PortraitSuperpromptSchema,
  ProductSuperpromptSchema,
  CollageSuperpromptSchema,
]);

const withTargetModel = (schema, model, extraShape = {}) =>
  schema.extend({
    ...extraShape,
    meta: schema.shape.meta.extend({
      target_model: z.literal(model),
    }),
  });

const buildModelSchema = (model, extraShape = {}) =>
  z.discriminatedUnion('prompt_type', [
    withTargetModel(PortraitSuperpromptSchema, model, extraShape),
    withTargetModel(ProductSuperpromptSchema, model, extraShape),
    withTargetModel(CollageSuperpromptSchema, model, extraShape),
  ]);

const FluxPromptSchema = buildModelSchema('flux', {
  quality_prefix: z
    .string()
    .optional()
    .default('masterpiece, ultra-realistic, professional photography, 8k uhd, raw photo'),
});

const MidjourneyPromptSchema = buildModelSchema('midjourney', {
  parameters: z.object({
    ar: z.string().describe('Aspect ratio, e.g., "4:5", "16:9"'),
    v: z.string().default('6.1').describe('Midjourney version, e.g., "6.1", "6", "niji 6"'),
    style: z.string().optional().describe('e.g., "raw", "default"'),
    stylize: z.number().min(0).max(1000).optional(),
    chaos: z.number().min(0).max(100).optional(),
    no: z.array(z.string()).optional(),
  }),
});

const IdeogramPromptSchema = buildModelSchema('ideogram', {
  text_element: z
    .object({
      content: z.string().min(1).describe('Exact text to render'),
      style: z.string().describe('Font style description'),
      position: z.string().describe('Where text appears'),
      effect: z.string().optional(),
    })
    .optional(),
  magic_prompt: z.boolean().default(true),
});

const LumaPromptSchema = z.object({
  meta: MetaSchema.extend({
    target_model: z.literal('luma'),
  }),
  scene_setup: z.string().min(10),
  subject: z.object({
    description: z.string(),
    action: z.object({
      start: z.string(),
      middle: z.string().optional(),
      end: z.string().optional(),
    }),
  }),
  camera: z.object({
    movement: z.string().describe('e.g., "slow dolly in", "static", "tracking"'),
    angle: z.string().optional(),
    focus: z.string().optional(),
  }),
  lighting: z.string(),
  mood: z.string(),
  duration_hint: z.string().optional(),
  negative_prompt: NegativePromptSchema,
});

const RecraftPromptSchema = buildModelSchema('recraft', {
  style_preset: z.string().describe('e.g., "realistic_image", "digital_illustration", "vector_illustration", "icon"'),
  substyle: z.string().optional().describe('e.g., "2d_art_poster", "hand_drawn"'),
  color_palette: z
    .object({
      primary: z.string(),
      secondary: z.string().optional(),
      accent: z.string().optional(),
      background: z.string().optional(),
    })
    .optional(),
});

const ReferenceImagePromptSchema = z.object({
  reference: ReferenceImageSchema,
  subject: z.object({
    type: z.string(),
    appearance: z.object({
      hair: z
        .object({
          color: z.string(),
          style: z.string(),
        })
        .optional(),
      skin: z.object({
        tone: z.string().describe('Use "same as reference image" for consistency'),
        texture: z.string().optional(),
      }),
      expression: z.string(),
      gaze: z.string(),
    }),
    pose: z
      .object({
        stance: z.string(),
        hands: z.record(z.string(), z.string()).optional(),
      })
      .optional(),
  }),
  wardrobe: z
    .object({
      top: z.object({
        primary: z.string(),
        layer: z.string().optional(),
      }),
      bottom: z
        .object({
          type: z.string(),
          color: z.string(),
        })
        .optional(),
      footwear: z
        .object({
          shoes: z.string(),
          socks: z.string().optional(),
        })
        .optional(),
      accessories: z.array(z.string()).optional(),
    })
    .optional(),
  environment: z.object({
    location: z.string(),
    features: z.array(z.string()).optional(),
    reflection: z.string().optional(),
    atmosphere: z.string().optional(),
  }),
  lighting: z.object({
    type: z.string(),
    quality: z.string().optional(),
  }),
  composition: z.object({
    shot_type: z.string(),
    camera_angle: z.string(),
    framing: z.string(),
    style: z.string(),
  }),
  image_style: z.object({
    realism: z.string(),
    detail: z.string().optional(),
    mood: z.string(),
    resolution: z.string().optional(),
  }),
});

const NanoBananaBodySchema = z.object({
  physique: z.string().describe('Overall body type and proportions'),
  anatomy: z.string().describe('Specific anatomical details with muscle group names'),
  details: z.string().describe('Skin realism markers'),
});

const NanoBananaWardrobeSchema = z.object({
  top: z.string().describe('Upper body garment with material, fit, color, body interaction'),
  bottom: z.string().describe('Lower body garment with material, fit, color'),
  accessories: z.array(z.string()).describe('List of accessories with materials'),
  text_details: z.string().optional().describe('Any text on clothing with exact wording'),
});

const NanoBananaPoseSchema = z.object({
  description: z.string().optional().describe('Full pose description with body positioning'),
  posture: z.string().optional().describe('Specific posture name and what it emphasizes'),
});

const NanoBananaSceneSchema = z.object({
  environment: z.string().describe('Location with specific props and textures'),
  background: z.string().optional(),
  location: z.string().optional(),
  atmosphere: z.string().optional(),
  reflection_integrity: z.string().optional(),
  props: z.array(z.string()).optional(),
});

const NanoBananaLightingSchema = z.object({
  type: z.string(),
  quality: z.string().optional(),
  effects: z.array(z.string()).optional(),
  shadows: z.string().optional(),
});

const NanoBananaCameraSchema = z.object({
  technical: z.string().describe('Lens, aperture, resolution, style'),
  aspect_ratio: z.string().describe('e.g., "9:16", "1:1", "4:5", "2:3"'),
  negative_constraints: z.string().describe('Inline negative prompt'),
  type: z.string().optional(),
  lens: z.string().optional(),
  focus: z.string().optional(),
  composition: z.string().optional(),
  style: z.string().optional(),
  resolution: z.string().optional(),
});

const NanoBananaPromptSchema = z.object({
  meta: MetaSchema.optional(),
  subject: z.object({
    description: z.string().min(10),
    body: NanoBananaBodySchema,
    face: z.string().optional(),
    hair: z.string().optional(),
    skin: z.string().optional(),
    expression_mood: z.string().optional(),
  }),
  wardrobe: NanoBananaWardrobeSchema,
  pose_action: NanoBananaPoseSchema.optional(),
  pose: z.string().optional(),
  scene: NanoBananaSceneSchema,
  lighting: NanoBananaLightingSchema,
  camera: NanoBananaCameraSchema,
  realism_anchors: RealismAnchorsSchema.optional(),
  negative_prompt: NegativePromptSchema.optional(),
  mood_keywords: z.array(z.string()).optional(),
  mirror_geometry: z
    .object({
      alignment: z.string().optional(),
      distance_m: z.number().optional(),
      dimensions: z.string().optional(),
    })
    .optional(),
  composition_anchors: z
    .object({
      head_xy: z.array(z.number()).optional(),
      hip_xy: z.array(z.number()).optional(),
      feet_xy: z.array(z.array(z.number())).optional(),
      negative_space: z
        .object({
          left: z.number().optional(),
          right: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
  reflection_integrity: z
    .object({
      mirror_count: z.string().optional(),
      reflection_layers: z.string().optional(),
      spatial_logic: z.string().optional(),
      details_in_reflection: z.array(z.string()).optional(),
      phone_in_reflection: z.string().optional(),
    })
    .optional(),
  controlnet: ControlNetSchema.optional(),
});

const getSchemaForModel = (model) => {
  switch (model) {
    case 'flux':
      return FluxPromptSchema;
    case 'flux-ip-adapter':
    case 'flux-kontext-max':
      return ReferenceImagePromptSchema;
    case 'nano-banana':
      return NanoBananaPromptSchema;
    case 'midjourney':
      return MidjourneyPromptSchema;
    case 'ideogram':
      return IdeogramPromptSchema;
    case 'luma':
      return LumaPromptSchema;
    case 'recraft':
      return RecraftPromptSchema;
    case 'gpt-image-1.5':
      return buildModelSchema('gpt-image-1.5');
    case 'seedream-4.5':
      return buildModelSchema('seedream-4.5');
    default:
      return SuperpromptSchema;
  }
};

const hasReferenceImage = (prompt) => {
  if (typeof prompt !== 'object' || prompt === null) return false;
  return 'reference' in prompt && prompt.reference?.identity_lock === true;
};

const DEFAULT_NEGATIVE_PROMPTS = {
  quality: ['low quality', 'blurry', 'pixelated', 'jpeg artifacts', 'worst quality'],
  anatomy: [
    'deformed',
    'bad anatomy',
    'wrong proportions',
    'extra limbs',
    'missing limbs',
    'floating limbs',
    'mutated hands',
    'fused fingers',
    'too many fingers',
  ],
  style_leaks: ['cartoon', 'anime', '3d render', 'illustration', 'painting', 'drawing'],
  artifacts: ['watermark', 'signature', 'text overlay', 'logo', 'username'],
  skin: ['plastic skin', 'airbrushed', 'overly smooth', 'wax figure'],
};

const buildNegativePrompt = (categories, additional = []) => {
  const negatives = categories.flatMap((cat) => DEFAULT_NEGATIVE_PROMPTS[cat]);
  return Array.from(new Set([...negatives, ...additional]));
};

module.exports = {
  SUPPORTED_MODELS,
  ASPECT_RATIOS,
  QUALITY_TIERS,
  STYLE_TYPES,
  LIGHTING_TYPES,
  PromptTypeSchema,
  ReferenceImageSchema,
  MetaSchema,
  PortraitIdentitySchema,
  PortraitPhysicalDetailsSchema,
  PortraitSubjectSchema,
  ProductPhysicalDetailsSchema,
  ProductSubjectSchema,
  CollageSubjectSchema,
  ClothingItemSchema,
  WardrobeStylingSchema,
  PoseActionSchema,
  EnvironmentPropSchema,
  EnvironmentSchema,
  LightingSchema,
  CameraTechnicalSchema,
  TheVibeSchema,
  ColorPaletteSchema,
  TextureLayerSchema,
  MaterialsTexturesSchema,
  ColorGradingSchema,
  TypographySchema,
  MirrorRulesSchema,
  ControlNetSchema,
  VisualHierarchySchema,
  CompositionSchema,
  AdditionalSubjectSchema,
  RealismAnchorsSchema,
  NegativePromptSchema,
  PortraitSuperpromptSchema,
  ProductSuperpromptSchema,
  CollagePanelItemSchema,
  CollagePanelSchema,
  CollageCompositionSchema,
  CollageLightingSchema,
  CollageSuperpromptSchema,
  SuperpromptSchema,
  FluxPromptSchema,
  MidjourneyPromptSchema,
  IdeogramPromptSchema,
  LumaPromptSchema,
  RecraftPromptSchema,
  ReferenceImagePromptSchema,
  NanoBananaBodySchema,
  NanoBananaWardrobeSchema,
  NanoBananaPoseSchema,
  NanoBananaSceneSchema,
  NanoBananaLightingSchema,
  NanoBananaCameraSchema,
  NanoBananaPromptSchema,
  getSchemaForModel,
  hasReferenceImage,
  DEFAULT_NEGATIVE_PROMPTS,
  buildNegativePrompt,
};
