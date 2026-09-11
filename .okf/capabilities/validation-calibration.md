---
type: capability
title: Validation and Calibration
description: Govern model maturity, validation datasets, calibration phases, and regression evidence for formula intelligence.
tags: [validation, calibration, dataset, regression]
timestamp: 2026-09-10T20:49:27Z
state: specified
state_changed: 2026-09-10T10:18:08Z
project: /project.md
parent: /project.md
children:
  - /capabilities/validation-calibration/reference-dataset-acquisition.md
shared_with:
  - /capabilities/shared/trust-and-provenance.md
  - /capabilities/formula-analysis-workspace.md
  - /capabilities/interactive-exploration.md
artifact_root: docs/architecture/validation-calibration
orchestration_status: docs/architecture/validation-calibration/orchestration-status.md
gap_analysis: docs/architecture/validation-calibration/requirements-gap-analysis.md
glossary: docs/architecture/validation-calibration/domain-glossary.md
prd: docs/architecture/validation-calibration/prd.md
domain_model: docs/architecture/validation-calibration/canonical-domain-model.md
use_cases: docs/architecture/validation-calibration/canonical-use-cases.md
contract: docs/architecture/validation-calibration/canonical-api-cli-contract.md
scenarios: docs/architecture/validation-calibration/acceptance-scenarios.md
readiness_review: docs/architecture/validation-calibration/readiness-review.md
issues:
  - docs/agents/issues/done/20260910-033-gold-dataset-release-boundary-and-verifier.md
  - docs/agents/issues/done/20260910-038-calibration-partitions-and-evidence-evaluator.md
  - docs/agents/issues/done/20260910-039-model-maturity-and-regression-release.md
  - docs/agents/issues/pending/20260910-035-browse-public-reference-formulas.md
  - docs/agents/issues/pending/20260910-036-load-reference-formula-and-process.md
  - docs/agents/issues/pending/20260910-037-safe-reference-replacement-and-blank-reset.md
  - docs/agents/issues/pending/20260910-040-bilingual-reference-start-integration.md
adrs:
  - docs/agents/adr/0001-calculated-estimated-heuristic.md
  - docs/agents/adr/0007-staged-calibration-dataset.md
---

# Intent

Make model claims measurable, versioned, and appropriately limited as the
project moves from expert seeds toward validated calibration.

# Scope

Includes the release/evidence lifecycle for expert-seed prototypes, Gold
Datasets, broad datasets, controlled experiments, calibration/validation/test
splits, source quality, deduplication, confidence calibration, counterfactual
regression, and cross-family failure checks. Preparation coverage planning and
the offline source-to-candidate path are delegated to the structural child
Reference Dataset Acquisition and Curation.

It does not perform runtime scraping in the frontend, bypass source controls,
or publish source prose. Any source acquisition belongs to the child and must
be maintainer-controlled, offline, attributable, and policy-approved.

# Relationships

- Parent: [Dough Formula Intelligence](/project.md)
- Child: [Reference Dataset Acquisition and Curation](/capabilities/validation-calibration/reference-dataset-acquisition.md)
- Uses: [Ingredient and Prototype Knowledge](/capabilities/ingredient-prototype-knowledge.md)
- Shared concern: [Trust, Provenance, and Uncertainty](/capabilities/shared/trust-and-provenance.md)
- Artifact plan: `docs/architecture/validation-calibration/`

# Notes

The calibration strategy is intentionally staged: physics/chemistry, expert
model, canonical data, broad data, and controlled experiments. The first
release is an immutable Gold Dataset assembled from approved, attributable
source candidates. Candidates may be captured or imported through the child's
offline acquisition path, then manually normalized and reviewed. Accepted
reference records may also be exposed as user-selectable starting points. A
reference selection creates a local editable Formula and, when present, an
independent Process snapshot; it never mutates the dataset record. Reference
records use the canonical structural-family IDs owned by Ingredient and
Prototype Knowledge; navigation categories and orthogonal modifiers remain
separate from that primary family assignment.
