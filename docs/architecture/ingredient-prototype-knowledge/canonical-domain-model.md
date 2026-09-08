# Ingredient and Prototype Knowledge — Canonical Domain Model

Status: Canonical
Date: 2026-09-08

## Aggregates and value objects

### IngredientCatalogSnapshot

Immutable catalog identity, version, IngredientDefinitions, provenance summary,
and supported locale keys used by one analysis.

### IngredientDefinition

Stable ID, version, labels, functional composition value states, optional
physical/chemical fields, tags, provenance, and confidence.

### PrototypeCatalogSnapshot

Catalog version containing family and prototype definitions, inheritance
relationships, matcher policies, and confidence tiers.

### PrototypeDefinition

Prototype ID, parent IDs, family memberships, structural feature requirements,
identity modifiers, constraint policy, matcher policy, and maturity metadata.

### LocalIngredientOverride

Formula-line-local replacement or completion of a catalog definition. It keeps
source and confidence and has no catalog lifecycle.

## Policies and services

- CatalogResolutionPolicy chooses a version and resolves stable IDs.
- FunctionalCompositionMappingPolicy maps selected definitions to model fields.
- OverrideIsolationPolicy prevents local edits from mutating shared data.
- PrototypeInheritancePolicy resolves parent features deterministically.
- CatalogIntegrityPolicy checks IDs, versions, references, and supported states.

## Invariants

1. IDs and versions are stable within a catalog snapshot.
2. Display labels never become classifier keys.
3. A custom definition must identify its source as local/custom.
4. Unknown composition is not synthesized as zero.
5. Parent prototype references cannot create cycles.
6. An analysis records the exact catalog snapshots it used.

## Lifecycle and events

Catalog snapshots are loaded -> integrity checked -> selected for analysis.
Definitions are immutable within a snapshot.

Events:

- CatalogSnapshotSelected
- IngredientDefinitionResolved
- LocalOverrideApplied
- PrototypeInheritanceResolved
- CatalogVersionUnavailable

## Extension points

Future dataset ingestion may create a new catalog snapshot, but it must pass
the same integrity, provenance, licensing, and version checks. It cannot
silently rewrite an existing snapshot.
