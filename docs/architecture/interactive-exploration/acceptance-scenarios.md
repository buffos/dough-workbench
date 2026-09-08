# Interactive Formula Exploration — Acceptance Scenarios

Status: Canonical scenario catalog
Date: 2026-09-08

## SC-EX-001 — Start from an immutable baseline

Given a completed analysis, when exploration starts, then the baseline revision
and model versions are captured and the patch list is empty.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-EX-002 — Formula counterfactual

Given a baseline Formula, when the user changes a Formula mass, then the
counterfactual recomputes without changing the baseline Formula or Process.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-EX-003 — Process counterfactual

Given a baseline Process, when the user changes bulk temperature, then
composition/intrinsic metrics remain baseline-equivalent and process-sensitive
results are compared separately.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-EX-004 — Patch ownership

Given a scenario with Formula and Process patches, when comparison is shown,
then each changed path is labelled with its owner boundary.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-EX-005 — Unknown remains unknown

Given an unknown baseline composition field, when an unrelated Process patch is
applied, then the composition field remains unknown in both results.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-EX-006 — Invalid patch recovery

Given a valid baseline, when the user applies a negative mass or invalid
reference, then the patch is rejected and the baseline remains available.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-EX-007 — Partial counterfactual

Given a patch that removes an input required by an estimate, when evaluated,
then deterministic outputs remain visible and the affected estimate becomes
partial/unavailable with a limitation.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-EX-008 — Reset

Given several applied patches, when reset is selected, then the exact baseline
revision and model versions return and no patch remains.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.
