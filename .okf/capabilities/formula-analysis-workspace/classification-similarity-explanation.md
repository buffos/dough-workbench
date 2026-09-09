---
type: capability
title: Classification, Similarity, and Explanation
description: Map effective metrics and process features to structural families and explainable prototype similarities.
tags: [classification, similarity, prototypes, explanation]
timestamp: 2026-09-09T21:24:12Z
state: implemented
state_changed: 2026-09-09T21:24:12Z
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
issues:
  - docs/agents/issues/done/20260909-023-classification-feature-snapshot-and-family-gates.md
  - docs/agents/issues/done/20260909-024-prototype-similarity-vectors.md
  - docs/agents/issues/done/20260909-025-classification-outcomes-and-recovery.md
  - docs/agents/issues/done/20260909-026-classification-explanation-fidelity.md
  - docs/agents/issues/done/20260910-027-bilingual-classification-workspace.md
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
mutually exclusive. The workspace presents at most the eight most relevant
family memberships and prototype candidates while retaining the full
language-neutral result for calculation and explanation purposes.
