---
type: capability
title: Interactive Formula Exploration
description: Let users change formula or process parameters and observe deterministic, explainable analysis changes.
tags: [counterfactuals, sliders, comparison, exploration]
timestamp: 2026-09-10T01:29:30Z
state: implemented
state_changed: 2026-09-10T01:29:30Z
project: /project.md
parent: /project.md
shared_with:
  - /capabilities/shared/bilingual-content.md
  - /capabilities/shared/trust-and-provenance.md
artifact_root: docs/architecture/interactive-exploration
orchestration_status: docs/architecture/interactive-exploration/orchestration-status.md
gap_analysis: docs/architecture/interactive-exploration/requirements-gap-analysis.md
glossary: docs/architecture/interactive-exploration/domain-glossary.md
prd: docs/architecture/interactive-exploration/prd.md
domain_model: docs/architecture/interactive-exploration/canonical-domain-model.md
use_cases: docs/architecture/interactive-exploration/canonical-use-cases.md
contract: docs/architecture/interactive-exploration/canonical-api-cli-contract.md
scenarios: docs/architecture/interactive-exploration/acceptance-scenarios.md
readiness_review: docs/architecture/interactive-exploration/readiness-review.md
issues:
  - docs/agents/issues/done/20260910-028-counterfactual-baseline-and-patch-contract.md
  - docs/agents/issues/done/20260910-029-formula-counterfactual-recomputation.md
  - docs/agents/issues/done/20260910-030-process-and-paired-counterfactuals.md
  - docs/agents/issues/done/20260910-031-counterfactual-comparison-and-recovery.md
  - docs/agents/issues/done/20260910-032-bilingual-exploration-workspace-and-reset.md
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
between composition and process effects. The browser-side counterfactual slice
is complete; issues 028–032 were archived after the grouped English/Greek
visual review was approved on 2026-09-10.
