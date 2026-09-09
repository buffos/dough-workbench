---
type: capability
title: Formula Analysis Workspace
description: The main user journey for entering a formula and receiving a structured, process-aware analysis.
tags: [formula, analysis, workspace, rollup]
timestamp: 2026-09-09T21:24:12Z
state: implemented
state_changed: 2026-09-09T21:24:12Z
state_policy:
  mode: rollup
  source: structural_children
  reducer: min
project: /project.md
parent: /project.md
children:
  - /capabilities/formula-analysis-workspace/formula-input-normalization.md
  - /capabilities/formula-analysis-workspace/composition-intrinsic-metrics.md
  - /capabilities/formula-analysis-workspace/process-effective-behavior.md
  - /capabilities/formula-analysis-workspace/classification-similarity-explanation.md
shared_with:
  - /capabilities/shared/bilingual-content.md
  - /capabilities/shared/trust-and-provenance.md
orchestration_status: docs/architecture/formula-analysis-workspace/orchestration-status.md
adrs:
  - docs/agents/adr/0001-calculated-estimated-heuristic.md
  - docs/agents/adr/0002-formula-process-separation.md
  - docs/agents/adr/0003-composition-process-similarity.md
  - docs/agents/adr/0004-unknown-is-not-zero.md
  - docs/agents/adr/0005-functional-composition-boundary.md
---

# Intent

Provide the central formula-to-analysis journey without forcing users to think
in terms of the internal calculation modules.

# Scope

This is a pure structural roll-up. Its scope is the union of its four child
capabilities. It has no independent PRD or delivery track while it remains a
roll-up; planning work routes to its least-mature child.

# Relationships

- Parent: [Dough Formula Intelligence](/project.md)
- Children: [Formula Input and Normalization](/capabilities/formula-analysis-workspace/formula-input-normalization.md), [Composition and Intrinsic Metrics](/capabilities/formula-analysis-workspace/composition-intrinsic-metrics.md), [Process and Effective Behavior](/capabilities/formula-analysis-workspace/process-effective-behavior.md), [Classification, Similarity, and Explanation](/capabilities/formula-analysis-workspace/classification-similarity-explanation.md)
- Shared concerns: [Bilingual Content and Localization](/capabilities/shared/bilingual-content.md), [Trust, Provenance, and Uncertainty](/capabilities/shared/trust-and-provenance.md)

# Notes

Its materialized `state` is derived from the structural children using the
explicit minimum-state policy.
