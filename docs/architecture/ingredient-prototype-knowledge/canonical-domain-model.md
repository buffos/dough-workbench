# Ingredient and Prototype Knowledge — Canonical Domain Model

Status: Canonical
Date: 2026-09-11

## Ubiquitous language

- A **structural family** is a node in the primary taxonomy, selected by the
  mechanism that mainly creates and stabilizes structure.
- A **named prototype** is a more specific, recognizable preparation model
  such as brioche or croissant.
- A **structural modifier** describes an orthogonal property such as
  enrichment, consistency, fat handling, or a special process.
- A **preparation assignment** places a preparation under one primary
  canonical family. It is not a second taxonomy and it is not inferred from a
  translated display label.

## Subdomains and context candidates

### Functional composition

Ingredient definitions and local overrides translate ingredient identity into
the functional composition used by deterministic analysis.

### Structural taxonomy and prototype knowledge

The canonical family tree, modifier vocabulary, named prototypes, inheritance,
and qualitative matcher policies live here. This is the core knowledge seam.

### Dataset mapping boundary

Reference-dataset acquisition consumes the family IDs and records one reviewed
preparation assignment. It does not redefine the taxonomy or create legacy
family aliases.

## Aggregates and value objects

### IngredientCatalogSnapshot

Immutable catalog identity, version, IngredientDefinitions, provenance summary,
and supported locale keys used by one analysis.

### IngredientDefinition

Stable ID, version, labels, functional composition value states, optional
physical/chemical fields, tags, provenance, and confidence.

### PrototypeCatalogSnapshot

Catalog version containing the canonical structural-family tree, orthogonal
modifier vocabulary, named prototype definitions, inheritance relationships,
matcher policies, and confidence tiers.

### StructuralFamilyNode

A stable, language-neutral node in the primary taxonomy. The taxonomy has 13
root families and 41 children (54 nodes in total). A node answers which
mechanism primarily creates and stabilizes the dough or batter structure:

- Fermented Gluten Doughs
- Unleavened Gluten Doughs
- Laminated Gluten Doughs
- Short / Fat-Shortened Doughs
- Cookie & Biscuit Doughs
- Chemically Leavened Cake Batters
- Foam Cake Batters
- Quick-Bread Systems
- Chemically Leavened Pourable Batters
- Unleavened Pourable Batters
- Fermented Batters
- Steam-Leavened Pastes
- Starch-Dominant Doughs

The child families are:

```text
Fermented Gluten Doughs
  Stiff Fermented Doughs · Lean Bread Doughs · High-Hydration Bread Doughs
  Fermented Flatbread Doughs · Soft Enriched Doughs · Rich Enriched Doughs
Unleavened Gluten Doughs
  Pasta & Noodle Doughs · Wrapper / Dumpling Doughs
  Unleavened Flatbread Doughs
Laminated Gluten Doughs
  Fermented Laminated Doughs · Unfermented Laminated Doughs
Short / Fat-Shortened Doughs
  Basic Shortcrust · Sweet Shortcrust · Sandy / Sablé Dough
  Shortbread-Type Dough
Cookie & Biscuit Doughs
  Short Cookies · Drop Cookies · Chewy Cookies · Crisp Cookies
  Cakey Cookies · Rolled Cookies
Chemically Leavened Cake Batters
  Butter Cakes · Oil Cakes · High-Ratio Cakes
Foam Cake Batters
  Whole-Egg Foam Cakes · Egg-White Foam Cakes
  Separated-Egg Foam Cakes · Hybrid Foam Cakes
Quick-Bread Systems
  Muffin Batters · Quick Loaf Batters · Scone / Biscuit Doughs
Chemically Leavened Pourable Batters
  Pancake Batters · Waffle Batters · Fritter / Coating Batters
Unleavened Pourable Batters
  Crêpe-Type Batters
Fermented Batters
  Yeast-Fermented Batters · Lactic / Mixed-Fermented Batters
Steam-Leavened Pastes
  Choux-Type Pastes
Starch-Dominant Doughs
  Potato Doughs · Rice / Starch Doughs · Non-Gluten Dumpling Doughs
```

Each preparation receives one primary canonical family placement. A product
name such as brioche or croissant does not create a competing root family.

### StructuralModifierAxis

An orthogonal description of a family member: leavening, structural system,
enrichment, consistency, fat handling, or special process. Modifiers refine a
primary family placement; they do not become alternate family IDs.

### PrototypeDefinition

Prototype ID, parent IDs, family memberships, structural feature requirements,
identity modifiers, constraint policy, matcher policy, and maturity metadata.

### LocalIngredientOverride

Formula-line-local replacement or completion of a catalog definition. It keeps
source and confidence and has no catalog lifecycle.

## Domain services

### StructuralFamilyAssignmentService

Validates a reviewed preparation assignment against the canonical family tree
and exposes the family ancestry needed by selectors and matchers. It does not
guess a new family from a product name and it does not retain obsolete family
labels as runtime aliases.

### PrototypeResolutionService

Resolves family inheritance and named-prototype ancestry for one immutable
catalog version, reporting cycles or dangling references explicitly.

## Policies

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
7. Structural family identity is selected by the primary structure mechanism;
   orthogonal modifiers do not create duplicate top-level taxonomies.
8. Every published/reference preparation uses a canonical `family.*` ID from
   the shared structural tree; legacy family labels are not runtime data.

## Lifecycle and events

Catalog snapshots are loaded -> integrity checked -> selected for analysis.
Definitions are immutable within a snapshot.

Events:

- CatalogSnapshotSelected
- IngredientDefinitionResolved
- LocalOverrideApplied
- PrototypeInheritanceResolved
- CatalogVersionUnavailable

## Minimum canonical scenarios

1. Brioche is assigned to `family.fermented-gluten.rich-enriched`; its
   enrichment and fat-handling details remain modifiers.
2. Croissant is assigned to `family.laminated-gluten.fermented`; lamination is
   structural identity, not a translated product label.
3. Fresh pasta is assigned to
   `family.unleavened-gluten.pasta-noodle`, while its named preparation remains
   “fresh egg pasta”.
4. A reference selector can filter by a root family or child family using the
   same IDs shown by the catalog tree.
5. An obsolete family label cannot enter a release; it must be migrated into
   an explicit canonical assignment before publication.

## Extension points

Future dataset ingestion may create a new catalog snapshot, but it must pass
the same integrity, provenance, licensing, and version checks. It cannot
silently rewrite an existing snapshot. A preparation reassignment is an
explicit reviewed data change, not a new legacy mapping layer.

## Mapping guidance for architecture variants

Whether implemented as static TypeScript data, JSON, a future service, or a
database-backed adapter, the implementation must preserve the same stable
family IDs, parent relationships, bilingual labels, modifier axes, and
one-primary-assignment rule. Read models may add counts and localized
indentation, but they must not rename or flatten the canonical hierarchy.
