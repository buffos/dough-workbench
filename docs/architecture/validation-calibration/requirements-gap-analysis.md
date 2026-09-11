# Validation and Calibration — Requirements Gap Analysis

Status: ready for exact specification
Date: 2026-09-10

## Scope and sources

This pass clears the fog around the first calibration/data release, its
user-facing starting-point flow, and the approved source-acquisition
expansion. It uses:

- the formal domain specification and Calibration Strategy v0.1 in
  `exploration/`;
- ADR-0007, Staged Calibration and Defer Dataset Collection Decisions;
- the existing Validation and Calibration node;
- the Formula Analysis Workspace, Ingredient and Prototype Knowledge,
  Interactive Formula Exploration, and Trust/Provenance artifacts;
- the existing browser implementation; and
- the user's confirmed product decisions in this planning conversation.

## Confirmed decisions

The following decisions are now user-confirmed and are not remaining fog:

1. The first reference set is one immutable, versioned Gold Dataset. The same
   canonical records can support calibration evidence and user-facing
   reference starting points; there is no duplicated “public recipes” dataset.
2. A dataset record has a role set and an explicit public-reference flag. A
   record may be both `reference` and `calibration`, while validation/test
   records are not selectable unless explicitly approved for that purpose.
3. A record must contain a Formula snapshot. A Process snapshot is optional and
   remains an independent sibling structure when present.
4. A preparation may have multiple accepted reference formulas. At most one is
   the `primary` quick-start formula for a preparation within a release.
5. Selecting a reference creates a local editable copy. It never mutates the
   dataset record and never silently merges two formulas.
6. Selecting a reference while the current draft is dirty requires explicit
   replacement confirmation. Selecting Blank follows the same protection rule.
7. The public selector is searchable and filterable, grouped by structural
   family with preparation/formula names underneath. It is not an unbounded
   dropdown. Blank remains the default starting option.
8. The initial dataset is assembled from attributable, reliable source
   candidates through a maintainer-controlled offline acquisition path.
   Browser/runtime scraping, unattended crawling, and an external data provider
   remain outside V1.
9. Every release is an immutable snapshot such as `gold-formulas-v2`. A
   correction or addition creates a new release; old releases remain
   reproducible.
10. All Formula masses use the existing grams-only input contract. Missing
    composition or Process information remains Unknown and is not converted to
    zero.
11. The dataset is static project data for the frontend. Users do not upload,
    edit, or publish dataset records from the GitHub Pages application in V1.
12. Formula/Process loading belongs at the Formula Analysis Workspace boundary;
    counterfactual changes remain owned by Interactive Formula Exploration;
    source, maturity, confidence, and evidence wording reuse Trust and
    Provenance; localized labels reuse Bilingual Content and Localization.
13. A broad preparation inventory is created before source collection. Its
    navigation categories, structural-family mappings, preparation keys, and
    aliases are separate from source records and published release records.
14. A pilot samples roughly 2–3 accepted records per broad navigation category
    and reports structural-family gaps instead of claiming full calibration
    coverage.

## Boundary clarification

Validation and Calibration owns the evidence and release semantics:

- curation eligibility and source quality;
- record roles and evaluation partitions;
- release identity and immutability;
- calibration/validation/test evidence;
- model-parameter maturity and regression outcomes.

Its structural child [Reference Dataset Acquisition and Curation](../reference-dataset-acquisition/prd.md)
owns the inventory, taxonomy-to-preparation mapping, source registry, offline
acquisition, normalization traces, and pilot coverage report.

It does not own the formula editor, the interactive comparison UI, or
translation catalogs. Those capabilities consume its versioned release and
preserve its semantics.

## Gaps resolved by bounded assumptions

The user did not select a concrete source list, licensing workflow, exact
record count, or exact numerical calibration method. Those details are not
blocking for an implementation-ready V1 contract if the following assumptions
are made explicit:

- A repository maintainer/domain curator uses the offline acquisition path and
  manually reviews the first release candidates.
- A record is accepted only when its source, normalized masses, ingredient
  resolution, preparation label, expected structural family/prototype (when
  known), and unknown fields are recorded.
- An ingredient line resolves to a versioned catalog definition or carries an
  explicit functional-composition snapshot with provenance; an unresolved name
  cannot silently become a zero or an arbitrary catalog item.
- A release may contain any number of records. The selector does not need a
  fixed maximum; it uses search, family filtering, and pagination/virtualized
  rendering if the release grows.
- Gold records carry stronger calibration weight than broad/noisy records.
  Validation and test partitions remain isolated from parameter fitting.
- “Calibrated” describes a model parameter/evidence release, not a recipe that
  is guaranteed to be scientifically or gastronomically correct.

## Deferrable questions

These remain child-level work rather than fog at the capability boundary:

- the exact source URLs, acquisition/reuse notes, and pilot records;
- the number and final selection of recipes in `gold-formulas-v2`;
- the concrete JSON/TypeScript file layout for static release data;
- exact quality-weight values and calibration statistics;
- broad dataset ingestion and controlled experiments;
- the presence of a real frontend/E2E harness beyond the current unit and
  deterministic checks.

These details no longer change the ownership boundary: the child owns
acquisition/candidate preparation and the parent owns release/evaluation.

## Fog exit assessment

The capability now has a one-sentence purpose: govern versioned evidence and
model maturity while supplying trustworthy reference Formula/optional Process
snapshots to the analysis workspace.

Its boundaries against siblings are explicit, its main territories are visible
(acquisition/candidate preparation, curation/release, reference loading,
calibration evaluation, and regression evidence), and its actors and outputs
are known. The acquisition territory now has its own specified child and exact
artifact set; the parent capability remains specified for release/evidence
work.
