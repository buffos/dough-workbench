---
type: capability
title: Trust, Provenance, and Uncertainty
description: Make data quality, metric semantics, missing values, confidence, and model provenance visible and reliable.
tags: [trust, provenance, uncertainty, confidence, data-quality]
timestamp: 2026-09-08T12:00:00Z
state: specified
state_changed: 2026-09-08T12:00:00Z
project: /project.md
parent: /project.md
shared_with:
  - /capabilities/formula-analysis-workspace.md
  - /capabilities/interactive-exploration.md
  - /capabilities/ingredient-prototype-knowledge.md
  - /capabilities/validation-calibration.md
artifact_root: docs/architecture/trust-and-provenance
orchestration_status: docs/architecture/trust-and-provenance/orchestration-status.md
gap_analysis: docs/architecture/trust-and-provenance/requirements-gap-analysis.md
glossary: docs/architecture/trust-and-provenance/domain-glossary.md
prd: docs/architecture/trust-and-provenance/prd.md
domain_model: docs/architecture/trust-and-provenance/canonical-domain-model.md
use_cases: docs/architecture/trust-and-provenance/canonical-use-cases.md
contract: docs/architecture/trust-and-provenance/canonical-api-cli-contract.md
scenarios: docs/architecture/trust-and-provenance/acceptance-scenarios.md
readiness_review: docs/architecture/trust-and-provenance/readiness-review.md
adrs:
  - docs/agents/adr/0001-calculated-estimated-heuristic.md
  - docs/agents/adr/0003-composition-process-similarity.md
  - docs/agents/adr/0004-unknown-is-not-zero.md
  - docs/agents/adr/0007-staged-calibration-dataset.md
---

# Intent

Prevent the interface from turning assumptions, missing data, or heuristic
scores into false scientific certainty.

# Scope

Includes calculated/estimated/heuristic labels, unknown/null policy,
provenance, confidence, coverage, model maturity, precision policy,
explanation fidelity, and no-match/hybrid behavior.

# Relationships

- Parent: [Dough Formula Intelligence](/project.md)
- Shared with: [Formula Analysis Workspace](/capabilities/formula-analysis-workspace.md), [Interactive Formula Exploration](/capabilities/interactive-exploration.md), [Ingredient and Prototype Knowledge](/capabilities/ingredient-prototype-knowledge.md), [Validation and Calibration](/capabilities/validation-calibration.md)
- Artifact plan: `docs/architecture/trust-and-provenance/`

# Notes

The central invariant is `Unknown != 0`. Similarity is not probability, and
confidence is not similarity.
