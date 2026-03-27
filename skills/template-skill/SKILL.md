---
name: template-skill
description: "Starting point for creating new agent skills. Provides the required SKILL.md structure, frontmatter fields, and content patterns. Use when building a new skill from scratch, scaffolding a skill folder, or learning the skill authoring format."
---

# Template Skill

A starter template for authoring new agent skills. Copy this folder, rename it, and fill in the sections below.

## Quick Start

1. **Copy this folder** — duplicate `template-skill/` and rename it to match the new skill (kebab-case, e.g. `my-new-skill/`).
2. **Update frontmatter** — set `name` to the folder name and write a description that answers *what* the skill does and *when* to use it.
3. **Write the body** — replace the placeholder sections below with the skill's actual instructions.

## Frontmatter Reference

```yaml
---
name: my-skill-name          # required — kebab-case, matches folder name
description: "What the skill does and when to use it."  # required
license: Apache-2.0          # optional
allowed-tools:               # optional — pre-approved tool list
  - Bash
  - Read
metadata:                    # optional — key/value pairs for clients
  category: utilities
---
```

## Body Structure

Organise the markdown body to suit the skill's complexity:

- **Purpose** — one-paragraph overview.
- **Workflow / Steps** — numbered steps with validation checkpoints for risky operations.
- **Examples** — concrete, copy-pasteable input/output pairs.
- **Guidelines / Constraints** — rules the agent must follow.

## Validation Checklist

Before publishing, verify:

- [ ] `name` is kebab-case and matches the containing folder
- [ ] `description` includes concrete actions and a "Use when…" clause
- [ ] Body contains at least one actionable instruction
- [ ] Referenced files (if any) exist in the skill folder
