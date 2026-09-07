---
type: capability
title: Interactive Formula Exploration
description: Let users change formula or process parameters and observe deterministic, explainable analysis changes.
tags: [counterfactuals, sliders, comparison, exploration]
timestamp: 2026-09-07T08:06:37Z
state: bounded
project: /project.md
parent: /project.md
shared_with:
  - /capabilities/shared/bilingual-content.md
  - /capabilities/shared/trust-and-provenance.md
artifact_root: docs/architecture/interactive-exploration
orchestration_status: docs/architecture/interactive-exploration/orchestration-status.md
adrs:
  - docs/agents/adr/0001-calculated-estimated-heuristic.md
  - docs/agents/adr/0002-formula-process-separation.md
  - docs/agents/adr/0003-composition-process-similarity.md
---

# Intent

Help users reason about formula space by changing one or more inputs and
seeing which metrics, risks, and similarities move.

# Scope

V1 scope is a deterministic counterfactual engine and UI for formula/process
changes, with smoothness and process-independence checks. Target optimization,
recipe generation, and ingredient substitution guidance remain future scope.

# Relationships

- Parent: [Dough Formula Intelligence](/project.md)
- Uses: [Formula Analysis Workspace](/capabilities/formula-analysis-workspace.md)
- Shared concern: [Trust, Provenance, and Uncertainty](/capabilities/shared/trust-and-provenance.md)
- Artifact plan: `docs/architecture/interactive-exploration/`

# Notes

Counterfactual changes must preserve model versioning and the distinction
between composition and process effects.
