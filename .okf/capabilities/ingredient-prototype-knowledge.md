---
type: capability
title: Ingredient and Prototype Knowledge
description: Maintain the versioned functional ingredient catalog and the structural and named prototype catalog used by the analyzer.
tags: [ingredients, prototypes, taxonomy, knowledge]
timestamp: 2026-09-07T08:06:37Z
state: bounded
project: /project.md
parent: /project.md
shared_with:
  - /capabilities/shared/bilingual-content.md
  - /capabilities/shared/trust-and-provenance.md
artifact_root: docs/architecture/ingredient-prototype-knowledge
orchestration_status: docs/architecture/ingredient-prototype-knowledge/orchestration-status.md
adrs:
  - docs/agents/adr/0001-calculated-estimated-heuristic.md
  - docs/agents/adr/0005-functional-composition-boundary.md
  - docs/agents/adr/0007-staged-calibration-dataset.md
---

# Intent

Give the application reusable, inspectable knowledge about functional
ingredients, structural families, and named prototypes.

# Scope

Includes ingredient identity and composition, physical properties, provenance,
functional tags, structural taxonomy, prototype inheritance, feature matchers,
identity-critical process features, cultural identity modifiers, and model
version metadata. It excludes product-specific rules inside ingredient logic.

# Relationships

- Parent: [Dough Formula Intelligence](/project.md)
- Uses: [Classification, Similarity, and Explanation](/capabilities/formula-analysis-workspace/classification-similarity-explanation.md)
- Shared concern: [Bilingual Content and Localization](/capabilities/shared/bilingual-content.md)
- Artifact plan: `docs/architecture/ingredient-prototype-knowledge/`

# Notes

Canonical identifiers remain language-neutral; Greek and English display names
belong to the presentation/content layer.
