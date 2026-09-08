# Ingredient and Prototype Knowledge — Canonical Use Cases

Status: Canonical application model
Date: 2026-09-08

## Commands

### SelectCatalogSnapshot

Input: requested catalog/model version. Output: selected immutable catalog or
an unavailable-version failure.

### ResolveIngredientDefinition

Input: stable Ingredient ID or custom local definition. Output: functional
composition snapshot with provenance and confidence.

### ResolvePrototypeCatalog

Input: prototype model version. Output: integrity-checked family/prototype
snapshot with inherited features.

### ApplyLocalOverride

Input: Formula line ID and override fields. Output: a local snapshot that
leaves the shared catalog unchanged.

## Queries

- GetIngredientOptions(locale, catalogVersion)
- GetIngredientDefinition(ingredientId, version)
- GetPrototype(prototypeId, version)
- GetFamilyTree(version)
- GetCatalogMetadata(version)

## Failure model

- catalog_version_unavailable
- ingredient_not_found
- invalid_custom_definition
- prototype_reference_cycle
- unsupported_locale_label
- provenance_missing

An unknown composition field is a valid partial definition, not a not-found
failure.

## Canonical chains

1. Select catalog -> resolve line IDs -> compose Formula snapshot.
2. Select custom ingredient -> validate local composition -> analyze with
   local provenance.
3. Load prototype catalog -> resolve inheritance -> classify using the snapshot.
4. Request later catalog version -> do not change the existing analysis.
