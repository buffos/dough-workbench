# Classification, Similarity, and Explanation — Acceptance Scenarios

Status: Canonical scenario catalog
Date: 2026-09-08

## SC-CL-001 — Functional inputs only

Given two differently named Ingredients with equivalent functional composition,
when classification runs, then the classifier receives equivalent feature
values and does not branch on their display names.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CL-002 — Multi-label family result

Given a formula with strong evidence for two structural families, when it is
classified, then both memberships remain visible instead of forcing one label.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CL-003 — Separate similarity dimensions

Given identical composition and different Process snapshots, when similarity is
calculated, then composition similarity remains unchanged while Process
similarity may change.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CL-004 — Similarity is not probability

Given a prototype similarity score, when the result is rendered, then its label
and explanation identify it as similarity and never as a probability or
likelihood.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CL-005 — No strong match

Given a valid feature snapshot that does not satisfy any strong prototype
constraints, when classification runs, then NoStrongCanonicalMatch is a valid
result with nearby candidates and reasons.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CL-006 — Hybrid result

Given materially supported memberships in two structural families, when the
classifier cannot resolve one identity without hiding evidence, then Hybrid is
returned with both contributing families.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CL-007 — Unknown evidence

Given missing Process or composition features, when a prototype is evaluated,
then coverage and confidence decrease and the missing features are listed; the
unknowns are not treated as zero.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CL-008 — Structural conflict

Given a prototype with a near-hard lamination constraint and a Process without
lamination evidence, when it is evaluated, then the result reports
unavailable/uncertain evidence rather than silently claiming a laminated match.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-CL-009 — Explanation fidelity

Given a returned candidate, when the user opens the explanation, then positive
features, conflicts, inherited rules, missing evidence, and model version
match the score calculation.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.
