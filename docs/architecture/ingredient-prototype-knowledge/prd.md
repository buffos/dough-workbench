# Ingredient and Prototype Knowledge — PRD

Status: Exact capability specification
Date: 2026-09-08

## Goal

Provide inspectable, reusable, versioned knowledge that lets the analyzer
resolve functional composition and compare structural prototypes without
embedding domain data in UI components.

## In scope

- versioned IngredientDefinition catalog;
- functional composition, physical properties, tags, provenance, and
  confidence;
- custom Formula-local definitions and line-local overrides;
- family hierarchy and prototype inheritance;
- canonical primary structural taxonomy of 13 root families and 41 child
  families, selected by the dominant structure mechanism;
- orthogonal modifier axes for leavening, structural system, enrichment,
  consistency, fat handling, and special process;
- feature matcher metadata, structural constraints, identity modifiers, and
  confidence tiers;
- static seed catalog loading and catalog-version reporting.

## Out of scope

Remote editing, accounts, automatic scraping, final external dataset
ownership, nutrition-label completeness, and a complete product taxonomy.

## Functional requirements

1. Every catalog item has a stable ID and version.
2. Catalog payloads are immutable to the user-facing analysis flow.
3. Custom definitions are explicit, local, and provenance-bearing.
4. Prototype inheritance resolves deterministically for one catalog version.
5. Catalog language labels are separate from model identifiers.
6. A missing or unknown field is preserved as Unknown.
7. The starter catalog can be replaced by a future version without changing
   the Formula or classifier contracts.
8. Reference preparation mappings use the same canonical family IDs as the
   prototype catalog; legacy family labels are not runtime inputs.

## Success criteria

An analysis can be reproduced from Formula revision, catalog version, prototype
version, and model version, and a user can understand whether a value came
from the catalog or a local override.
