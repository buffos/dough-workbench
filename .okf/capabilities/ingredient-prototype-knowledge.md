---
type: capability
title: Ingredient and Prototype Knowledge
description: Maintain the versioned functional ingredient catalog and the structural and named prototype catalog used by the analyzer.
tags: [ingredients, prototypes, taxonomy, knowledge]
timestamp: 2026-09-09T13:47:34Z
state: implemented
state_changed: 2026-09-09T13:47:34Z
project: /project.md
parent: /project.md
shared_with:
  - /capabilities/shared/bilingual-content.md
  - /capabilities/shared/trust-and-provenance.md
artifact_root: docs/architecture/ingredient-prototype-knowledge
orchestration_status: docs/architecture/ingredient-prototype-knowledge/orchestration-status.md
gap_analysis: docs/architecture/ingredient-prototype-knowledge/requirements-gap-analysis.md
glossary: docs/architecture/ingredient-prototype-knowledge/domain-glossary.md
prd: docs/architecture/ingredient-prototype-knowledge/prd.md
domain_model: docs/architecture/ingredient-prototype-knowledge/canonical-domain-model.md
use_cases: docs/architecture/ingredient-prototype-knowledge/canonical-use-cases.md
contract: docs/architecture/ingredient-prototype-knowledge/canonical-api-cli-contract.md
scenarios: docs/architecture/ingredient-prototype-knowledge/acceptance-scenarios.md
readiness_review: docs/architecture/ingredient-prototype-knowledge/readiness-review.md
adrs:
  - docs/agents/adr/0001-calculated-estimated-heuristic.md
  - docs/agents/adr/0005-functional-composition-boundary.md
  - docs/agents/adr/0007-staged-calibration-dataset.md
issues:
  - docs/agents/issues/done/20260909-022-bilingual-prototype-catalog-inspection.md
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
