#!/usr/bin/env node

const {
  getSchemaForModel,
  SUPPORTED_MODELS,
  DEFAULT_NEGATIVE_PROMPTS,
} = require('./prompt-schema');

const QUALITY_RULES = {
  minDescriptionWords: {
    'subject.description': 5,
    'environment.location': 3,
    'pose_action.position': 4,
  },
  photorealisticAnchors: [
    'pores',
    'texture',
    'imperfections',
    'natural',
    'realistic',
    'detailed',
    'skin',
    'fabric',
    'lighting',
    'shadow',
  ],
  minNegativePrompts: 5,
  conflicts: [
    ['photorealistic', 'cartoon'],
    ['photorealistic', 'anime'],
    ['photorealistic', '3d render'],
    ['soft lighting', 'hard lighting'],
    ['natural lighting', 'studio lighting'],
  ],
};

class SuperpromptValidator {
  constructor(model, strict = false) {
    this.model = model;
    this.strict = strict;
  }

  validate(prompt) {
    const errors = [];
    const warnings = [];
    const suggestions = [];

    const schema = getSchemaForModel(this.model);
    const schemaResult = schema.safeParse(prompt);

    if (!schemaResult.success) {
      for (const issue of schemaResult.error.issues) {
        errors.push({
          path: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        });
      }
    }

    if (errors.length > 0 && this.strict) {
      return {
        valid: false,
        errors,
        warnings,
        score: { overall: 0, specificity: 0, realism: 0, technical: 0, negative_coverage: 0 },
        suggestions: ['Fix schema validation errors first'],
      };
    }

    const promptObj = typeof prompt === 'object' && prompt ? prompt : {};

    this.checkDescriptionSpecificity(promptObj, warnings, suggestions);
    this.checkRealismAnchors(promptObj, warnings, suggestions);
    this.checkNegativePrompts(promptObj, warnings, suggestions);
    this.checkConflicts(promptObj, errors);
    this.checkModelRequirements(promptObj, warnings, suggestions);

    const score = this.calculateScore(promptObj, errors, warnings);

    return {
      valid:
        errors.length === 0 &&
        (this.strict ? warnings.filter((w) => w.severity === 'high').length === 0 : true),
      errors,
      warnings,
      score,
      suggestions,
    };
  }

  checkDescriptionSpecificity(prompt, warnings, suggestions) {
    const subject = prompt.subject;

    if (subject?.description) {
      const desc = subject.description;
      const wordCount = desc.split(/\s+/).length;

      if (wordCount < 5) {
        warnings.push({
          path: 'subject.description',
          message: `Description too brief (${wordCount} words). Aim for 10+ words.`,
          severity: 'medium',
        });
        suggestions.push(
          'Add more specific details to subject description (e.g., for human subject: age, features, expression)'
        );
      }

      const vagueWords = ['nice', 'good', 'pretty', 'beautiful', 'cool', 'awesome'];
      const usedVague = vagueWords.filter((w) => desc.toLowerCase().includes(w));

      if (usedVague.length > 0) {
        warnings.push({
          path: 'subject.description',
          message: `Vague words detected: ${usedVague.join(', ')}. Be more specific.`,
          severity: 'low',
        });
      }
    }
  }

  checkRealismAnchors(prompt, warnings, suggestions) {
    const meta = prompt.meta;
    const realismAnchors = prompt.realism_anchors;

    if (meta?.style === 'photorealistic') {
      if (!realismAnchors || realismAnchors.length < 3) {
        warnings.push({
          path: 'realism_anchors',
          message: 'Photorealistic style requires strong realism anchors',
          severity: 'high',
        });
        suggestions.push(
          'Add realism anchors like: "visible skin pores", "natural imperfections", "fabric texture"'
        );
      } else {
        const anchorText = realismAnchors.join(' ').toLowerCase();
        const hasRealism = QUALITY_RULES.photorealisticAnchors.some((kw) =>
          anchorText.includes(kw)
        );

        if (!hasRealism) {
          warnings.push({
            path: 'realism_anchors',
            message: 'Realism anchors lack specific realism markers',
            severity: 'medium',
          });
        }
      }
    }
  }

  checkNegativePrompts(prompt, warnings, suggestions) {
    const negativePrompt = prompt.negative_prompt;

    if (!negativePrompt || negativePrompt.length < QUALITY_RULES.minNegativePrompts) {
      warnings.push({
        path: 'negative_prompt',
        message: `Insufficient negative prompts (${negativePrompt?.length || 0}). Minimum ${
          QUALITY_RULES.minNegativePrompts
        }.`,
        severity: 'high',
      });
      suggestions.push(
        'Add negative prompts for: quality issues, anatomy errors, style leaks, artifacts'
      );
    }

    if (negativePrompt) {
      const npText = negativePrompt.join(' ').toLowerCase();

      const hasQuality = DEFAULT_NEGATIVE_PROMPTS.quality.some((kw) => npText.includes(kw));
      const hasAnatomy = DEFAULT_NEGATIVE_PROMPTS.anatomy.some((kw) => npText.includes(kw));

      if (!hasQuality) {
        suggestions.push('Add quality negative prompts: "low quality", "blurry", "pixelated"');
      }
      if (!hasAnatomy) {
        suggestions.push('Add anatomy negative prompts: "deformed", "bad anatomy", "extra limbs"');
      }
    }
  }

  checkConflicts(prompt, errors) {
    // Exclude negative_prompt and negative_constraints from conflict detection
    // since they intentionally list terms to avoid (e.g., "cartoon" in negative_prompt
    // alongside "photorealistic" in style would be a false positive)
    const filtered = { ...prompt };
    delete filtered.negative_prompt;
    if (filtered.camera) {
      filtered.camera = { ...filtered.camera };
      delete filtered.camera.negative_constraints;
    }
    const promptText = JSON.stringify(filtered).toLowerCase();

    for (const [term1, term2] of QUALITY_RULES.conflicts) {
      if (promptText.includes(term1) && promptText.includes(term2)) {
        errors.push({
          path: 'general',
          message: `Conflicting terms detected: "${term1}" and "${term2}"`,
          code: 'CONFLICT',
        });
      }
    }
  }

  checkModelRequirements(prompt, warnings, suggestions) {
    switch (this.model) {
      case 'midjourney':
        if (!prompt.parameters) {
          warnings.push({
            path: 'parameters',
            message: 'Midjourney prompts should include parameters (--ar, --v, etc.)',
            severity: 'medium',
          });
          suggestions.push('Add Midjourney parameters: --ar 4:5 --v 6.1 --style raw');
        }
        break;
      case 'ideogram': {
        const meta = prompt.meta;
        if (meta?.style !== 'illustration' && !prompt.text_element) {
          suggestions.push(
            'Ideogram excels at text rendering. Consider adding a text_element if appropriate.'
          );
        }
        break;
      }
      case 'luma':
        if (!prompt.camera?.movement) {
          warnings.push({
            path: 'camera.movement',
            message: 'Luma video prompts should specify camera movement',
            severity: 'high',
          });
          suggestions.push('Add camera movement: "slow dolly in", "tracking shot", "static"');
        }
        break;
      case 'flux':
        if (!prompt.quality_prefix) {
          suggestions.push('Flux works best with quality prefix tags at the start');
        }
        break;
    }
  }

  calculateScore(prompt, errors, warnings) {
    let specificity = 100;
    let realism = 100;
    let technical = 100;
    let negativeCoverage = 100;

    specificity -= errors.length * 20;

    for (const warning of warnings) {
      const deduction = warning.severity === 'high' ? 15 : warning.severity === 'medium' ? 10 : 5;

      if (warning.path.includes('description') || warning.path.includes('subject')) {
        specificity -= deduction;
      } else if (warning.path.includes('realism')) {
        realism -= deduction;
      } else if (warning.path.includes('camera') || warning.path.includes('lighting')) {
        technical -= deduction;
      } else if (warning.path.includes('negative')) {
        negativeCoverage -= deduction;
      }
    }

    const realismAnchors = prompt.realism_anchors;
    if (realismAnchors && realismAnchors.length >= 5) {
      realism = Math.min(100, realism + 10);
    }

    const negativePrompt = prompt.negative_prompt;
    if (negativePrompt && negativePrompt.length >= 10) {
      negativeCoverage = Math.min(100, negativeCoverage + 10);
    }

    specificity = Math.max(0, Math.min(100, specificity));
    realism = Math.max(0, Math.min(100, realism));
    technical = Math.max(0, Math.min(100, technical));
    negativeCoverage = Math.max(0, Math.min(100, negativeCoverage));

    const overall = Math.round((specificity + realism + technical + negativeCoverage) / 4);

    return {
      overall,
      specificity,
      realism,
      technical,
      negative_coverage: negativeCoverage,
    };
  }
}

const scoreBar = (score) => {
  const filled = Math.round(score / 5);
  const empty = 20 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `${bar} ${score}%`;
};

const printHelp = () => {
  console.log(`
Superprompt Validator

Usage:
  node validate-prompt.js [options]

Options:
  --input, -i <file>   Input JSON file (or use stdin)
  --model, -m <model>  Target model (default: nano-banana)
  --strict, -s         Strict mode (warnings treated as errors)
  --help, -h           Show this help

Supported Models:
  ${SUPPORTED_MODELS.join(', ')}

Examples:
  node validate-prompt.js --input prompt.json --model nano-banana
  node validate-prompt.js --input prompt.json --model midjourney --strict
  cat prompt.json | node validate-prompt.js --model nano-banana
`);
};

const main = async () => {
  const args = process.argv.slice(2);

  let inputFile = null;
  let model = 'nano-banana';
  let modelProvided = false;
  let strict = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--input':
      case '-i':
        inputFile = args[++i];
        break;
      case '--model':
      case '-m': {
        const modelArg = args[++i];
        if (SUPPORTED_MODELS.includes(modelArg)) {
          model = modelArg;
          modelProvided = true;
        } else {
          console.error(`Unknown model: ${modelArg}`);
          console.error(`Supported: ${SUPPORTED_MODELS.join(', ')}`);
          process.exit(1);
        }
        break;
      }
      case '--strict':
      case '-s':
        strict = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
    }
  }

  let promptData;

  if (inputFile) {
    const fs = require('fs');
    const content = fs.readFileSync(inputFile, 'utf-8');
    promptData = JSON.parse(content);
  } else {
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    const content = Buffer.concat(chunks).toString('utf-8');
    promptData = JSON.parse(content);
  }

  const rawPromptData = promptData;
  const hasSuperprompt =
    rawPromptData && typeof rawPromptData === 'object' && rawPromptData.superprompt;
  const promptObj =
    hasSuperprompt && typeof rawPromptData.superprompt === 'object'
      ? rawPromptData.superprompt
      : rawPromptData;

  if (!modelProvided) {
    const inferredModel =
      rawPromptData?.target_model ||
      rawPromptData?.superprompt?.meta?.target_model ||
      promptObj?.meta?.target_model;
    if (inferredModel && SUPPORTED_MODELS.includes(inferredModel)) {
      model = inferredModel;
    }
  }

  const validator = new SuperpromptValidator(model, strict);
  const result = validator.validate(promptObj);

  console.log(`\n${'='.repeat(60)}`);
  console.log('SUPERPROMPT VALIDATION REPORT');
  console.log('='.repeat(60));
  console.log(`Model: ${model}`);
  console.log(`Mode: ${strict ? 'STRICT' : 'NORMAL'}`);
  console.log(`Status: ${result.valid ? '✓ VALID' : '✗ INVALID'}`);
  console.log('');

  console.log('QUALITY SCORE');
  console.log('-'.repeat(30));
  console.log(`Overall:           ${scoreBar(result.score.overall)}`);
  console.log(`Specificity:       ${scoreBar(result.score.specificity)}`);
  console.log(`Realism:           ${scoreBar(result.score.realism)}`);
  console.log(`Technical:         ${scoreBar(result.score.technical)}`);
  console.log(`Negative Coverage: ${scoreBar(result.score.negative_coverage)}`);
  console.log('');

  if (result.errors.length > 0) {
    console.log('ERRORS');
    console.log('-'.repeat(30));
    for (const error of result.errors) {
      console.log(`✗ [${error.path}] ${error.message}`);
    }
    console.log('');
  }

  if (result.warnings.length > 0) {
    console.log('WARNINGS');
    console.log('-'.repeat(30));
    for (const warning of result.warnings) {
      const icon = warning.severity === 'high' ? '⚠️' : warning.severity === 'medium' ? '⚡' : 'ℹ️';
      console.log(`${icon} [${warning.severity.toUpperCase()}] ${warning.path}: ${warning.message}`);
    }
    console.log('');
  }

  if (result.suggestions.length > 0) {
    console.log('SUGGESTIONS');
    console.log('-'.repeat(30));
    for (const suggestion of result.suggestions) {
      console.log(`→ ${suggestion}`);
    }
    console.log('');
  }

  console.log('='.repeat(60));
  process.exit(result.valid ? 0 : 1);
};

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
