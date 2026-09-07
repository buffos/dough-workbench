# ADR-0005: Named Ingredients Resolve to Functional Composition

- Status: Accepted
- Date: 2026-09-07
- Scope: Ingredient catalog and classification boundary

## Context

Ingredient names are not reliable product labels. The same functional
composition may be expressed with different ingredients, while a named
ingredient can behave differently depending on role and process.

## Decision

The ingredient layer owns canonical identity, composition, physical properties,
functional tags, provenance, and confidence. Product classification happens
only after composition and process have produced structural/effective metrics.
Ingredient logic must not contain rules such as “butter implies brioche.”

## Consequences

Equivalent functional compositions can compare similarly, new ingredients can
be added without rewriting product rules, and classifier behavior remains
explainable and calibratable.
