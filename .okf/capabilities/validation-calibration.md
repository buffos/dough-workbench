---
type: capability
title: Validation and Calibration
description: Govern model maturity, validation datasets, calibration phases, and regression evidence for formula intelligence.
tags: [validation, calibration, dataset, regression]
timestamp: 2026-09-07T08:06:37Z
state: foggy
project: /project.md
parent: /project.md
shared_with:
  - /capabilities/shared/trust-and-provenance.md
artifact_root: docs/architecture/validation-calibration
orchestration_status: docs/architecture/validation-calibration/orchestration-status.md
adrs:
  - docs/agents/adr/0001-calculated-estimated-heuristic.md
  - docs/agents/adr/0007-staged-calibration-dataset.md
---

# Intent

Make model claims measurable, versioned, and appropriately limited as the
project moves from expert seeds toward validated calibration.

# Scope

Includes expert-seed prototypes, gold datasets, broad datasets, controlled
experiments, calibration/validation/test splits, source quality, deduplication,
confidence calibration, counterfactual regression, and cross-family failure
checks.

It deliberately does not decide yet where all future data will be collected or
whether automated scraping will ever be used.

# Relationships

- Parent: [Dough Formula Intelligence](/project.md)
- Uses: [Ingredient and Prototype Knowledge](/capabilities/ingredient-prototype-knowledge.md)
- Shared concern: [Trust, Provenance, and Uncertainty](/capabilities/shared/trust-and-provenance.md)
- Artifact plan: `docs/architecture/validation-calibration/`

# Notes

The calibration strategy is intentionally staged: physics/chemistry, expert
model, canonical data, broad data, and controlled experiments.
