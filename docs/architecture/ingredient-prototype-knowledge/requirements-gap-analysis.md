# Ingredient and Prototype Knowledge — Requirements Gap Analysis

Status: ready for exact specification
Date: 2026-09-08

## Scope and sources

This pass covers versioned functional Ingredient definitions and structural or
named Prototype definitions used by analysis. It uses the formal domain
specification, calibration strategy, initial prototype catalog, the current
starter catalog, ADR-0001, ADR-0005, and ADR-0007.

## Resolved decisions

1. Catalog identity is language-neutral and versioned.
2. Named Ingredient resolves to functional composition before any classifier
   consumes it.
3. Catalog definitions are immutable from the Formula editor.
4. A custom functional Ingredient and line-local overrides are allowed; they
   carry provenance and confidence and never mutate the catalog.
5. Functional composition is separate from display labels and product names.
6. Prototype definitions support family inheritance, structural features,
   identity modifiers, matcher metadata, and confidence tiers.
7. The initial seed catalog is static project data. Dataset collection and
   external source ownership remain a separate foggy capability.
8. Missing catalog data remains Unknown; a missing definition is a diagnostic,
   not an empty composition.

## Deferred but non-blocking decisions

- External dataset source, curation workflow, licensing, and storage migration
  belong to Validation and Calibration.
- Catalog breadth beyond the initial high-confidence seed is future scope.
- Admin editing and remote catalog updates are outside the static V1.

## Readiness assessment

Identity, versioning, composition mapping, prototype inheritance, provenance,
custom-line policy, and static seed ownership are stable for exact artifacts.
No clarification is required.
