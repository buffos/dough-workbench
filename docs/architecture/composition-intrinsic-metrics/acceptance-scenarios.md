# Composition and Intrinsic Metrics — Acceptance Scenarios

Status: Canonical scenario catalog
Date: 2026-09-08

Verification labels use the root policy: backend boundary is
not-applicable for the static V1, frontend integration is when-supported, and
end-to-end is catalog-only.

## SC-CO-001 — Deterministic composition totals

Given a valid Formula with known flour and water composition, when intrinsic
analysis runs, then total water and flour-relative percentages are calculated
from grams and the displayed class is Calculated.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CO-002 — Unknown is not zero

Given an ingredient whose fat field is Unknown, when total fat is requested,
then the result is unavailable or partial with a limitation and does not add
zero fat as if it were known.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CO-003 — Role participation

Given a known inclusion containing internal water, when composition totals are
calculated, then the role policy keeps inclusion behavior distinct from the
continuous phase and explains the treatment.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CO-004 — Availability scales known evidence

Given a known component and a line-local availability factor of 0.5, when an
eligible effective metric runs, then only that metric's contribution is
scaled, provenance identifies the override, and the catalog remains unchanged.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CO-005 — Calculated, estimated, heuristic labels

Given one result of each semantic class, when the summary is rendered, then
the three classes are visibly distinct and no heuristic is labelled as a
measurement.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CO-006 — Partial estimate

Given a valid Formula with missing flour absorption evidence, when estimated
hydration is requested, then deterministic totals remain available while the
estimate is marked unavailable or partial with lower coverage/confidence.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CO-007 — Acid unit fidelity

Given acid-neutralization data expressed in the canonical unit, when the
leavening-related composition input is read, then the unit is preserved and
no pH-linear shortcut is introduced.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CO-008 — Formula/Process independence

Given identical Formula snapshots paired with two different Process snapshots,
when intrinsic metrics run, then the intrinsic result is identical and Process
effects are not attributed to composition.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CO-009 — Evidence explanation

Given a metric with known, unknown, and excluded lines, when the user opens its
explanation, then contributors, exclusions, missing evidence, semantic class,
and model version are visible.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.
