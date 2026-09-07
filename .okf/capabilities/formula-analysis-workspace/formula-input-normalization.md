---
type: capability
title: Formula Input and Normalization
description: Capture formula ingredients, flour structure, roles, units, and process inputs in a canonical form.
tags: [formula, input, normalization, baker-percentage]
timestamp: 2026-09-07T13:48:29Z
state: specified
project: /project.md
parent: /capabilities/formula-analysis-workspace.md
shared_with:
  - /capabilities/shared/bilingual-content.md
  - /capabilities/shared/trust-and-provenance.md
artifact_root: docs/architecture/formula-input-normalization
gap_analysis: docs/architecture/formula-input-normalization/requirements-gap-analysis.md
glossary: docs/architecture/formula-input-normalization/domain-glossary.md
prd: docs/architecture/formula-input-normalization/prd.md
domain_model: docs/architecture/formula-input-normalization/canonical-domain-model.md
use_cases: docs/architecture/formula-input-normalization/canonical-use-cases.md
contract: docs/architecture/formula-input-normalization/canonical-api-cli-contract.md
scenarios: docs/architecture/formula-input-normalization/acceptance-scenarios.md
readiness_review: docs/architecture/formula-input-normalization/readiness-review.md
orchestration_status: docs/architecture/formula-input-normalization/orchestration-status.md
issues:
  - docs/agents/issues/done/20260907-001-basic-formula-workspace.md
  - docs/agents/issues/done/20260907-002-validation-recovery.md
  - docs/agents/issues/done/20260907-003-uncertainty-explanation.md
  - docs/agents/issues/pending/004-roles-and-overrides.md
  - docs/agents/issues/pending/005-process-capture.md
  - docs/agents/issues/pending/006-formula-process-handoff.md
  - docs/agents/issues/pending/007-bilingual-parity-verification.md
adrs:
  - docs/agents/adr/0002-formula-process-separation.md
  - docs/agents/adr/0004-unknown-is-not-zero.md
  - docs/agents/adr/0005-functional-composition-boundary.md
---

# Intent

Turn user-entered ingredient and process data into a canonical Formula with an
unambiguous flour denominator and preserved unknowns.

# Scope

Includes grams, baker's percentages, flour blends, ingredient roles,
composition overrides, availability fields, process input capture, validation,
and distinction between missing, inferred, and exact values. It excludes
classification and final interpretation.

# Relationships

- Parent: [Formula Analysis Workspace](/capabilities/formula-analysis-workspace.md)
- Shared concern: [Trust, Provenance, and Uncertainty](/capabilities/shared/trust-and-provenance.md)
- Artifact plan: `docs/architecture/formula-input-normalization/`

# Notes

The first vertical slice should support the ingredient and process subset named
in the formal domain specification.
