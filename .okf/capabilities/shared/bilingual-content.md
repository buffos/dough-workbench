---
type: capability
title: Bilingual Content and Localization
description: Keep the public product, educational content, explanations, and navigation usable in Greek and English.
tags: [bilingual, greek, english, i18n, content]
timestamp: 2026-09-07T08:06:37Z
state: bounded
project: /project.md
parent: /project.md
shared_with:
  - /capabilities/formula-analysis-workspace.md
  - /capabilities/interactive-exploration.md
  - /capabilities/ingredient-prototype-knowledge.md
  - /capabilities/validation-calibration.md
artifact_root: docs/architecture/bilingual-content
orchestration_status: docs/architecture/bilingual-content/orchestration-status.md
adrs:
  - docs/agents/adr/0006-static-frontend-platform.md
---

# Intent

Make Greek and English first-class product experiences rather than translated
afterthoughts.

# Scope

Includes locale-aware routes, language switching, translated navigation and
content, localized explanatory labels, terminology consistency, fallback
policy, metadata, and parity checks between supported languages.

# Relationships

- Parent: [Dough Formula Intelligence](/project.md)
- Shared with: [Formula Analysis Workspace](/capabilities/formula-analysis-workspace.md), [Interactive Formula Exploration](/capabilities/interactive-exploration.md), [Ingredient and Prototype Knowledge](/capabilities/ingredient-prototype-knowledge.md), [Validation and Calibration](/capabilities/validation-calibration.md)
- Artifact plan: `docs/architecture/bilingual-content/`

# Notes

The baseline route policy is explicit `/en/` and `/el/` paths. Canonical model
identifiers remain in English; translated display labels are separate data.
