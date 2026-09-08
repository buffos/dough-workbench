---
type: capability
title: Composition and Intrinsic Metrics
description: Derive functional composition and pre-process structural metrics from normalized ingredient data.
tags: [composition, metrics, deterministic, estimated]
timestamp: 2026-09-08T12:00:00Z
state: specified
state_changed: 2026-09-08T12:00:00Z
project: /project.md
parent: /capabilities/formula-analysis-workspace.md
shared_with:
  - /capabilities/shared/trust-and-provenance.md
artifact_root: docs/architecture/composition-intrinsic-metrics
orchestration_status: docs/architecture/composition-intrinsic-metrics/orchestration-status.md
gap_analysis: docs/architecture/composition-intrinsic-metrics/requirements-gap-analysis.md
glossary: docs/architecture/composition-intrinsic-metrics/domain-glossary.md
prd: docs/architecture/composition-intrinsic-metrics/prd.md
domain_model: docs/architecture/composition-intrinsic-metrics/canonical-domain-model.md
use_cases: docs/architecture/composition-intrinsic-metrics/canonical-use-cases.md
contract: docs/architecture/composition-intrinsic-metrics/canonical-api-cli-contract.md
scenarios: docs/architecture/composition-intrinsic-metrics/acceptance-scenarios.md
readiness_review: docs/architecture/composition-intrinsic-metrics/readiness-review.md
adrs:
  - docs/agents/adr/0001-calculated-estimated-heuristic.md
  - docs/agents/adr/0004-unknown-is-not-zero.md
  - docs/agents/adr/0005-functional-composition-boundary.md
---

# Intent

Explain what is materially present in a formula before process effects are
applied.

# Scope

Includes functional ingredient composition, water, fat, sugar, protein,
starch, fiber, salt, flour blend properties, deterministic metrics, estimated
hydration/absorption, and intrinsic heuristic metrics such as GPI and
enrichment. It excludes process modifiers and named-product classification.

# Relationships

- Parent: [Formula Analysis Workspace](/capabilities/formula-analysis-workspace.md)
- Shared concern: [Trust, Provenance, and Uncertainty](/capabilities/shared/trust-and-provenance.md)
- Artifact plan: `docs/architecture/composition-intrinsic-metrics/`

# Notes

Calculated, estimated, and heuristic outputs must remain distinguishable in
the domain model and in the user-facing explanation.
