# Ingredient and Prototype Knowledge — Domain Glossary

Status: Canonical vocabulary
Date: 2026-09-08

## Core terms

### IngredientDefinition

A versioned, language-neutral functional definition with display labels,
composition fields, physical properties, tags, provenance, and confidence.

### Catalog

The immutable set of IngredientDefinitions and PrototypeDefinitions available
to a model version.

### Custom functional Ingredient

A Formula-local definition supplied by the user when the catalog lacks the
needed identity. It is not persisted as a shared catalog record in V1.

### PrototypeDefinition

A versioned family or named-product model with inherited features, constraints,
weights, identity modifiers, and confidence tier.

### Structural taxonomy

The canonical primary hierarchy of dough and batter systems. Its nodes are
chosen by the mechanism that mainly creates and stabilizes structure, not by
the product name. It has 13 roots and 41 child families.

### Structural family

One node in the primary structural taxonomy. In the current reference model a
preparation has one primary family ID, for example
`family.fermented-gluten.lean-bread` or
`family.unleavened-gluten.pasta-noodle`.

### Structural modifier

An orthogonal property such as leavening, enrichment, consistency, fat
handling, or a special process. It adds useful detail without creating a
second competing family hierarchy.

### Provenance

The source and method supporting a catalog or custom value.

### Catalog snapshot

The exact catalog version used by one analysis. Later catalog edits cannot
change that historical interpretation.

## Critical distinctions

| Distinction | Meaning |
|---|---|
| Name vs function | A display name identifies a selection; functional composition drives metrics. |
| Ingredient vs IngredientLine | A catalog definition is reusable; a line applies it to one Formula with role and mass. |
| Family vs prototype | A family is broad structural knowledge; a prototype is a more specific candidate. |
| Family vs modifier | A family is the primary structural placement; a modifier describes an orthogonal property of that placement. |
| Structural feature vs identity modifier | Structural features constrain the physical system; modifiers refine identity. |
| Catalog vs custom | Catalog data is shared/versioned; custom data is local/provenance-bearing. |
| Confidence vs composition value | Confidence describes evidence support; it is not a composition percentage. |

## Stable identifiers

IDs such as ingredient.water, flour.wheat.white,
family.laminated-gluten.fermented, and prototype.croissant are language-neutral.
Greek and English labels are content data resolved outside the domain objects.
