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

The hierarchy of broad physical families and their prototype descendants.

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
| Structural feature vs identity modifier | Structural features constrain the physical system; modifiers refine identity. |
| Catalog vs custom | Catalog data is shared/versioned; custom data is local/provenance-bearing. |
| Confidence vs composition value | Confidence describes evidence support; it is not a composition percentage. |

## Stable identifiers

IDs such as ingredient.water, flour.wheat.white, family.laminated, and
prototype.croissant are language-neutral. Greek and English labels are content
data resolved outside the domain objects.
