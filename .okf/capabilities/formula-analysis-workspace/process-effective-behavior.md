---
type: capability
title: Process and Effective Behavior
description: Apply mixing, aeration, fermentation, lamination, thermal, and geometry inputs to intrinsic metrics.
tags: [process, effective-metrics, fermentation, lamination]
timestamp: 2026-09-08T12:00:00Z
state: specified
state_changed: 2026-09-08T12:00:00Z
project: /project.md
parent: /capabilities/formula-analysis-workspace.md
shared_with:
  - /capabilities/shared/trust-and-provenance.md
artifact_root: docs/architecture/process-effective-behavior
orchestration_status: docs/architecture/process-effective-behavior/orchestration-status.md
gap_analysis: docs/architecture/process-effective-behavior/requirements-gap-analysis.md
glossary: docs/architecture/process-effective-behavior/domain-glossary.md
prd: docs/architecture/process-effective-behavior/prd.md
domain_model: docs/architecture/process-effective-behavior/canonical-domain-model.md
use_cases: docs/architecture/process-effective-behavior/canonical-use-cases.md
contract: docs/architecture/process-effective-behavior/canonical-api-cli-contract.md
scenarios: docs/architecture/process-effective-behavior/acceptance-scenarios.md
readiness_review: docs/architecture/process-effective-behavior/readiness-review.md
adrs:
  - docs/agents/adr/0002-formula-process-separation.md
  - docs/agents/adr/0004-unknown-is-not-zero.md
---

# Intent

Describe how the same composition can behave differently under different
process, thermal, and geometry conditions.

# Scope

Includes ingredient-addition order, mixing and rest, aeration, fermentation,
lamination, thermal process, geometry, effective gluten, gas retention,
setting, fluidity, process risks, and process coverage. It excludes raw
ingredient classification rules.

# Relationships

- Parent: [Formula Analysis Workspace](/capabilities/formula-analysis-workspace.md)
- Shared concern: [Trust, Provenance, and Uncertainty](/capabilities/shared/trust-and-provenance.md)
- Artifact plan: `docs/architecture/process-effective-behavior/`

# Notes

Process-sensitive behavior must remain separate from composition similarity so
counterfactual process changes are explainable.
