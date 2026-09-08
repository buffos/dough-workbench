# Trust, Provenance, and Uncertainty — Acceptance Scenarios

Status: Canonical scenario catalog
Date: 2026-09-08

## SC-TR-001 — Semantic class visibility

Given calculated, estimated, and heuristic outputs, when the result is
rendered, then each class is visible with distinct explanatory wording.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-TR-002 — Unknown preservation

Given an unknown composition or Process value, when analysis runs, then it
remains unknown or unavailable and never becomes numeric zero.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-TR-003 — Explicit None

Given a process field explicitly marked absent, when trust metadata is built,
then it is distinguishable from an unknown field and from a known numeric zero.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-TR-004 — Coverage and confidence

Given a partial result, when the summary is rendered, then numeric coverage and
confidence are in [0,1] and presentation bands do not replace the values.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-TR-005 — Similarity is not probability

Given a prototype similarity result, when its explanation is shown, then the
wording calls it similarity and separately reports confidence.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-TR-006 — Provenance

Given a catalog value and a Formula-local override, when results are compared,
then each identifies its source/version and the override remains local.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-TR-007 — Precision policy

Given a validation-limited heuristic output, when it is displayed, then
precision and wording are reduced according to the model maturity policy.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-TR-008 — Explanation fidelity

Given a result with missing and contributing inputs, when the user opens its
explanation, then every positive claim maps to evidence and every material
limitation is listed.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-TR-009 — Hybrid/no-match trust

Given a hybrid or no-strong-match classification, when it is rendered, then it
is presented as a valid outcome with evidence and is not shown as a failure or
forced label.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.
