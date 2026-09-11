# Reference Dataset Acquisition and Curation — Canonical Domain Model

Status: canonical model for coverage and source acquisition
Date: 2026-09-10

## Purpose

Define the stable concepts and invariants between a planned preparation and a
candidate record handed to the Validation and Calibration release boundary.

## Modeling principles

1. Coverage planning is not dataset publication.
2. A navigation category is not a structural family.
3. A preparation identity is not a source recipe identity.
4. Raw source facts and normalized candidate values remain traceable.
5. Acquisition happens offline and under an explicit source policy.
6. Missing values remain Unknown and never become numeric zero or defaults.
7. Formula and optional Process remain independent snapshots.
8. A candidate is not public or calibration evidence until the parent release
   acceptance boundary accepts and publishes it.

## Bounded contexts

### Coverage Planning

Owns the inventory, categories, aliases, priorities, and candidate links to the
canonical structural-family tree. Navigation categories and structural
families remain separate.

### Source Acquisition

Owns source registration, acquisition status, offline runs, raw facts, and
transformation traceability.

### Candidate Curation

Owns normalized candidate readiness, ingredient resolution, Unknown handling,
review decisions, and handoff to the parent release verifier.

## Aggregates and entities

### CoverageInventory (aggregate root)

The versioned planned universe of preparation entries. It owns the inventory
identity, revision, deterministic manifest identity, category hierarchy, and
preparation entries.

### CoverageEntry (entity within CoverageInventory)

Contains a stable `preparationKey`, bilingual labels, one primary navigation
category, aliases, one primary canonical structural-family link, priority,
status, and coverage notes. It does not contain a source formula by itself.

### NavigationCategory (entity/value object)

A user-facing hierarchy node such as breads, cakes, pizza, or pasta. It has a
stable key, bilingual labels, parent/category ordering, and active status.

### PreparationIdentity (value object)

The canonical preparation key and localized labels to which source variants
attach. It may link to an existing prototype/family catalog identity without
replacing it.

### SourceDefinition (entity within SourceRegistry)

Records source identity, author/publisher, bibliographic or URL reference,
access date, attribution, quality assessment, acquisition method, reuse status,
stability, and limitations.

### SourceRegistry (aggregate root)

The versioned approved list of sources and their acquisition policy. It does
not contain the published dataset release.

An entry may remain proposed with `manual-review` status. The registry is not
an approval shortcut: terms, attribution, method, and reuse must be resolved
before acquisition.

### AcquisitionRun (entity)

An offline operation against one or more registered sources. It records tool or
manual method, parser/version, timestamp, input identity, scope, and outcome.

### SourceFact (value object)

A minimally captured source fact such as an ingredient quantity, ingredient
name, temperature, duration, or source note, with a location/trace reference.
It is not public prose and is not necessarily canonical.

### CandidateRecord (aggregate root)

A source-backed candidate attached to one PreparationIdentity. It contains
source/acquisition identity, raw facts, normalized Formula Snapshot, optional
Process Snapshot, transformations, ingredient-resolution evidence, curation
status, and reviewer decisions.

### NormalizationTrace (value object)

Maps a normalized field to its source fact, conversion method, catalog mapping,
confidence/uncertainty note, and reviewer note. A missing trace blocks
ready-for-release for required fields.

### CurationReview (entity within CandidateRecord)

Records reviewer role, decision, timestamp, checks performed, unresolved gaps,
and rejection/return reason.

### PilotCoverageReport (read model)

Reports inventory/category/family coverage, candidate counts, accepted counts,
source diversity, and missing or blocked areas for a selected pilot slice.

## Status vocabularies

### Coverage status

`planned` → `source-identified` → `acquired` → `normalized` → `needs-review` →
`ready-for-release` or `rejected`.

### Source acquisition status

`allowed-offline`, `manual-only`, `manual-review`, `blocked`, `unknown`.

### Curation decision

`pending`, `returned-for-correction`, `accepted-for-release`, `rejected`.

## Policies and rule objects

### CoverageTaxonomyPolicy

Requires one primary navigation category per preparation, stable keys, locale
parity, explicit aliases, and a separate canonical structural-family
reference. A preparation reassignment is a reviewed data edit; legacy family
labels are not retained as runtime taxonomy data.

### SourceAcquisitionPolicy

Allows only approved offline/manual methods, prohibits bypassing access or
terms, requires attribution and access metadata, and forbids copying source
prose into public data.

### NormalizationPolicy

Requires grams or a recorded justified conversion, versioned ingredient or
functional-composition resolution, explicit roles, and traceable transformations.

### CandidateAcceptancePolicy

Requires preparation identity, source evidence, required Formula structure,
normalization traces, Unknown handling, reviewer decision, and parent-verifier
compatibility before `ready-for-release`.

### PilotCoveragePolicy

Samples roughly 2–3 accepted records per broad navigation category and reports
structural-family gaps instead of treating the sample as complete coverage.

## Invariants

1. Every CoverageEntry has a unique key within an inventory revision.
2. Every PreparationIdentity has exactly one primary navigation category.
3. Category labels and structural-family links are language-neutral in identity
   and localized only in presentation.
4. Every acquired candidate points to a registered SourceDefinition and an
   AcquisitionRun or manual capture record.
5. Every normalized required field has a SourceFact or explicit derived/Unknown
   explanation.
6. Unjustified unit conversion, missing required ingredient resolution, or
   missing provenance prevents release readiness.
7. Source quality does not imply model confidence or recipe correctness.
8. Process silence remains Unknown/not recorded; it never creates a Process
   default.
9. Candidate data cannot appear in the public selector before parent release
   acceptance and publication.
10. A revised inventory or candidate correction does not mutate a published
    release record.
11. Every candidate structural-family link resolves to a node in the shared
    canonical taxonomy.

## Lifecycle

```text
planned coverage
  -> source identified
  -> facts acquired offline
  -> Formula/optional Process normalized
  -> curation review
  -> ready-for-release or rejected
  -> parent release verifier
  -> immutable published release
```

## Cross-capability references

- Ingredient and Prototype Knowledge supplies catalog definitions and
  structural-family/prototype identities.
- Trust, Provenance, and Uncertainty supplies source, Unknown, confidence, and
  evidence semantics.
- Bilingual Content and Localization supplies presentation keys.
- Validation and Calibration owns release verification, publication, role and
  partition semantics, and model evaluation.
