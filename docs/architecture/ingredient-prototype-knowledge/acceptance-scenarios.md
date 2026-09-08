# Ingredient and Prototype Knowledge — Acceptance Scenarios

Status: Canonical scenario catalog
Date: 2026-09-08

## SC-IK-001 — Catalog selection

Given a supported catalog version, when the user selects a named ingredient,
then the Formula line receives the stable ID, version, and functional
composition snapshot.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-IK-002 — Stable language-neutral identity

Given the English and Greek routes, when the same ingredient is selected, then
the canonical ID and version are identical while the label changes locale.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-IK-003 — Custom functional ingredient

Given an ingredient absent from the catalog, when a user creates a custom
functional definition, then the line is analyzable with custom provenance and
the shared catalog is unchanged.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-IK-004 — Local override isolation

Given a catalog ingredient used on two lines, when one line receives a
composition override, then the other line and catalog snapshot remain
unchanged.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-IK-005 — Unknown composition

Given a definition with an unknown protein field, when composition is resolved,
then the field remains unknown and downstream coverage can decrease.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-IK-006 — Prototype inheritance

Given a prototype with a family parent, when the prototype snapshot is loaded,
then inherited structural features are available and parent cycles are rejected.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-IK-007 — Version reproducibility

Given an analysis created with catalog version v1, when a newer catalog is
loaded, then the existing result still reports v1 and does not change.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-IK-008 — Missing version recovery

Given a requested catalog version that is unavailable, when analysis starts,
then the user receives a clear model-availability diagnostic and no silent
fallback to another version.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.
