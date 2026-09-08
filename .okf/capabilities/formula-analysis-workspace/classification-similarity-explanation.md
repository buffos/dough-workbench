---
type: capability
title: Classification, Similarity, and Explanation
description: Map effective metrics and process features to structural families and explainable prototype similarities.
tags: [classification, similarity, prototypes, explanation]
timestamp: 2026-09-08T12:00:00Z
state: specified
state_changed: 2026-09-08T12:00:00Z
project: /project.md
parent: /capabilities/formula-analysis-workspace.md
shared_with:
  - /capabilities/shared/bilingual-content.md
  - /capabilities/shared/trust-and-provenance.md
artifact_root: docs/architecture/classification-similarity-explanation
orchestration_status: docs/architecture/classification-similarity-explanation/orchestration-status.md
gap_analysis: docs/architecture/classification-similarity-explanation/requirements-gap-analysis.md
glossary: docs/architecture/classification-similarity-explanation/domain-glossary.md
prd: docs/architecture/classification-similarity-explanation/prd.md
domain_model: docs/architecture/classification-similarity-explanation/canonical-domain-model.md
use_cases: docs/architecture/classification-similarity-explanation/canonical-use-cases.md
contract: docs/architecture/classification-similarity-explanation/canonical-api-cli-contract.md
scenarios: docs/architecture/classification-similarity-explanation/acceptance-scenarios.md
readiness_review: docs/architecture/classification-similarity-explanation/readiness-review.md
adrs:
  - docs/agents/adr/0001-calculated-estimated-heuristic.md
  - docs/agents/adr/0003-composition-process-similarity.md
  - docs/agents/adr/0004-unknown-is-not-zero.md
  - docs/agents/adr/0005-functional-composition-boundary.md
---

# Intent

Give users a structural description and nearby prototype matches without
forcing every formula into a named product.

# Scope

Includes multi-dimensional structural families, fuzzy prototype matching,
composition similarity, process similarity, overall identity similarity,
hybrid and no-strong-match results, confidence, missing-data reporting,
constraint conflicts, and faithful feature contributions.

# Relationships

- Parent: [Formula Analysis Workspace](/capabilities/formula-analysis-workspace.md)
- Domain knowledge: [Ingredient and Prototype Knowledge](/capabilities/ingredient-prototype-knowledge.md)
- Shared concern: [Trust, Provenance, and Uncertainty](/capabilities/shared/trust-and-provenance.md)
- Artifact plan: `docs/architecture/classification-similarity-explanation/`

# Notes

The classifier consumes effective metrics and process features, never raw
ingredient names. Similarity is not probability and named similarities are not
mutually exclusive.
