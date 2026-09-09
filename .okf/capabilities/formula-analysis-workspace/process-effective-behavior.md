---
type: capability
title: Process and Effective Behavior
description: Apply mixing, aeration, fermentation, lamination, thermal, and geometry inputs to intrinsic metrics.
tags: [process, effective-metrics, fermentation, lamination]
timestamp: 2026-09-09T04:33:10Z
state: implemented
state_changed: 2026-09-09T04:33:10Z
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
issues:
  - docs/agents/issues/done/20260909-013-process-effective-analysis-boundary.md
  - docs/agents/issues/done/20260909-014-mixing-and-aeration-effects.md
  - docs/agents/issues/done/20260909-015-fermentation-and-proof-behavior.md
  - docs/agents/issues/done/20260909-016-addition-order-and-lamination-effects.md
  - docs/agents/issues/done/20260909-017-thermal-and-geometry-behavior.md
  - docs/agents/issues/done/20260909-018-effective-behavior-workspace-integration.md
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

# Delivery note

The versioned effective-behavior engine and bilingual workspace integration are
implemented and delivered through issues 013–018. The completed delivery
records are linked above; future calibration remains owned by Validation and
Calibration.
