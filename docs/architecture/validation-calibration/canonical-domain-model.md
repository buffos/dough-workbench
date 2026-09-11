# Validation and Calibration — Canonical Domain Model

Status: canonical model for the first Gold Dataset and reference-release
boundary
Date: 2026-09-10

## Purpose

Define the business concepts and invariants that keep curated reference
formulas, calibration evidence, and model maturity trustworthy across any
implementation. This is a semantic model, not a database schema.

## Modeling principles

1. A dataset release is immutable evidence; a workspace draft is editable.
2. A Reference Formula is a starting point, not a recommendation or guarantee.
3. Formula and Process are separate snapshots even when published together.
4. Dataset use roles and evaluation partitions are different concepts.
5. Provenance, Unknown, confidence, maturity, and model version remain
   explicit.
6. Calibration changes model interpretation and evidence; it does not change
   deterministic arithmetic for an unchanged composition profile.
7. Canonical IDs and values are language-neutral; localized labels are
   presentation data.

## Bounded context candidates

### Evidence Governance

Owns candidate curation, source quality, acceptance evidence, release identity,
roles, partitions, and immutable publication.

Preparation coverage and source-to-candidate acquisition are owned by the
structural child [Reference Dataset Acquisition and Curation](../reference-dataset-acquisition/canonical-domain-model.md).
That child hands normalized candidates and traces to Evidence Governance; it
does not publish them.

### Reference Starter

Consumes the public subset of an accepted release and creates a local Formula
and optional Process draft. It belongs at the boundary between this capability
and Formula Analysis Workspace; it does not own the dataset record.

### Model Evaluation

Owns calibration runs, held-out validation/test evidence, parameter-release
maturity, and regression outcomes. It consumes normalized analysis snapshots
and does not change the source records.

## Aggregates and entities

### DatasetRelease (aggregate root)

An immutable named snapshot such as `gold-formulas-v2`. It owns a set of
accepted Dataset Records, release metadata, supported model/evidence references,
and the rules used to resolve public references.

The aggregate boundary protects release identity, record uniqueness, primary
reference uniqueness, and the fact that a published record cannot be edited in
place. A new correction or addition belongs to a new release.

### DatasetRecord (entity within DatasetRelease)

An accepted Formula Snapshot with:

- stable record ID;
- preparation identity and localized display labels;
- canonical structural family identity and optional named-prototype identity;
- optional Process Snapshot;
- source provenance and quality evidence;
- curation/acceptance status;
- one or more dataset use roles;
- optional evaluation partition;
- explicit `publicSelectable` and `primary` flags; and
- record-level maturity/status.

The record is immutable after release publication. Its Formula Snapshot is
required; its Process Snapshot is optional.

### FormulaSnapshot (value object)

The normalized Formula accepted by the existing Formula Input and Normalization
contract. Masses are in grams. Ingredient lines use stable catalog references
or an explicit functional-composition snapshot with provenance. Unknown values
remain Unknown.

### ProcessSnapshot (value object)

An optional normalized Process accepted by the existing Process contract. It
contains no implied Formula composition and may itself contain Unknown fields.

### SourceEvidence (value object)

Attribution, source identifier, source quality, transcription/normalization
notes, reviewer identity or role, and acceptance rationale. A source is not a
numeric confidence score by itself.

### PreparationIdentity (value object)

A stable preparation key, localized names, a canonical primary structural-family
ID, and an optional named-prototype ID. Preparation names are user-facing
identity; the structural family is the analytical grouping selected from the
shared primary taxonomy. Orthogonal properties such as enrichment or fat
handling remain modifiers rather than alternate family IDs.

### ModelParameterRelease (aggregate root)

A versioned set of interpretation parameters and maturity metadata. It records
the dataset/evidence releases, partitions, quality weights, model version,
confidence ceiling, and calibration outcomes used to produce it.

The aggregate boundary prevents a parameter release from claiming evidence it
did not use and keeps model versions reproducible.

### CalibrationEvaluation (entity within ModelParameterRelease)

The result of evaluating a model against a declared dataset release and
partition. It includes the metric/regression outcome, coverage, confusion or
failure evidence, and pass/fail decision.

### ReferenceSelection (application-facing value object)

The selected release ID, record ID, Formula Snapshot, optional Process Snapshot,
and provenance context handed to the workspace. It is a copy boundary, not a
mutable link to DatasetRecord.

### LocalDraft (owned by Formula Analysis Workspace)

An editable Formula/Process pair created from Blank or Reference Selection.
The draft may retain `derived-from-reference` provenance, but its subsequent
edits do not mutate DatasetRelease or ModelParameterRelease.

## Enumerations and status vocabularies

### Curation state

`candidate` → `curated` → `accepted` or `rejected`.

Only `accepted` records can enter a published release.

### Release state

`draft` → `published` → `superseded`.

Published content is immutable. Superseded means a newer release is available,
not that the old release has been rewritten or invalidated silently.

### Dataset roles

`reference`, `calibration`.

Roles describe permitted use and may coexist. `publicSelectable` is an
additional explicit permission; it is not inferred from the `reference` role.

### Evaluation partitions

`calibration`, `validation`, `test`.

These describe evidence separation. A role and a partition are not synonyms.

### Model maturity

`expert-seed`, `gold-calibrated`, `broad-calibrated`, `experiment-validated`,
`stable`.

The maturity belongs to a model/release claim. It does not turn a recipe into
a guarantee.

## Policies and rule objects

### RecordAcceptancePolicy

Accept a candidate only when source evidence, normalized masses, ingredient
resolution, preparation identity, required Formula structure, explicit Unknown
values, and reviewer decision are present and valid.

### PublicReferencePolicy

Expose only accepted records with the `reference` role and
`publicSelectable: true`. Show a primary record first per preparation; allow
additional accepted variants.

### ReleaseImmutabilityPolicy

Published release IDs, records, snapshots, source evidence, roles, and primary
designation cannot be changed. Corrections create a new release.

### EvaluationIsolationPolicy

Parameters may be fitted from calibration evidence and evaluated against
validation/test evidence according to the declared protocol. Test evidence
cannot silently flow into fitting. Gold quality weights must be stronger than
broad/noisy weights when both are used for the same calibration purpose.

### ReferenceLoadPolicy

Loading a reference copies the complete Formula/optional Process snapshot. It
does not merge with the current draft. If the current draft is dirty, explicit
confirmation is required before replacement. If Process is absent in the
selected record, the new Process draft is Unknown/not recorded rather than
retaining the previous draft's Process.

### MaturityConfidencePolicy

Maximum reported confidence is bounded by model maturity, metric coverage,
process coverage, and source/evidence quality. Similarity remains distinct from
confidence and probability.

### LocaleParityPolicy

Every public record label, release label, status, source/maturity explanation,
diagnostic, and accessibility phrase has an English and Greek presentation.
Canonical IDs and data values do not change with locale.

## Invariants

1. A published release has a unique stable ID and content identity.
2. Record IDs are unique within a release.
3. Every accepted record has a valid Formula Snapshot.
4. Process Snapshot is optional and independent of Formula Snapshot.
5. Every ingredient line resolves to known functional composition or carries an
   explicit unresolved/Unknown state with provenance; no missing value becomes
   zero.
6. A preparation has no more than one primary public reference in a release.
7. A non-accepted, non-reference, or non-public record cannot appear in the
   user selector.
8. A published record cannot be mutated by workspace edits.
9. Dirty draft replacement is explicit and never a silent merge.
10. Evaluation partition assignment is explicit when a record supports model
    evaluation.
11. Test evidence is not used to fit the same parameter release.
12. A model release identifies the data/model versions and maturity ceiling
    supporting its claims.
13. Locale switching cannot change Formula/Process values, IDs, revisions, or
    model versions.
14. A published record cannot contain a legacy or navigation-category value as
    its structural family ID; it must reference the canonical family tree.

## Lifecycles

### Candidate to published release

```text
candidate
  -> curated
  -> accepted or rejected
  -> included in draft release
  -> published immutable release
  -> superseded by a later release
```

### Reference to editable analysis

```text
choose Blank or public Reference
  -> resolve release and record
  -> copy Formula/optional Process snapshot
  -> create local draft
  -> edit and analyze
  -> optionally replace after dirty-draft confirmation
```

### Model evidence maturity

```text
expert-seed
  -> gold-calibrated
  -> broad-calibrated
  -> experiment-validated
  -> stable
```

Transitions require declared evidence and do not silently alter historical
release outputs.

## Domain events

- `RecordCurated`
- `RecordAccepted`
- `RecordRejected`
- `DatasetReleasePublished`
- `DatasetReleaseSuperseded`
- `ReferenceFormulaSelected`
- `LocalDraftCreatedFromReference`
- `LocalDraftReplacedAfterConfirmation`
- `CalibrationEvaluationCompleted`
- `ModelParameterReleasePublished`
- `RegressionFailureDetected`

These are business-significant events; implementations may map them to logs,
build artifacts, or in-memory notifications.

## Cross-aggregate references and consistency

- DatasetRelease references existing IngredientCatalog and PrototypeCatalog
  versions by stable IDs; it does not own their definitions.
- Candidate acquisition references the versioned CoverageInventory,
  SourceRegistry, IngredientCatalog, and PrototypeCatalog by stable IDs; it
  does not copy their definitions into the release boundary.
- ModelParameterRelease references DatasetRelease and model versions by stable
  IDs and records the evaluation protocol.
- ReferenceSelection carries a snapshot into the Formula Analysis Workspace;
  later draft edits are not a distributed transaction against the dataset.
- Bilingual labels reference locale data; domain rules never depend on a
  translated label.
- Trust and Provenance supplies shared semantics for source, confidence,
  coverage, and Unknown.

## Read-model expectations

The public selector needs a compact read model containing:

- release/version label;
- preparation and family labels;
- reference ID and title;
- primary/variant marker;
- Process-included marker;
- maturity and source summary; and
- searchable localized terms.

The full snapshot is loaded only after selection. The read model can be
paginated or virtualized as record count grows without changing domain
semantics.

The calibration report needs a separate read model containing partition,
weights, evaluated metrics, maturity, model version, and pass/fail outcomes.

## Extension points

- Additional source-quality policies can be added without changing the record
  identity contract.
- Broad datasets and controlled experiments can add new evidence roles or
  protocols only through an explicit release/version change.
- A future server or CLI adapter may publish/resolve releases, but the static
  V1 frontend preserves the same snapshot and failure semantics.
- A future reference Process catalog can be added without collapsing Formula
  and Process into one object.

## Minimum canonical scenarios

The model must support the reference selection, dirty replacement, optional
Process, immutable copy, unavailable release, role/partition isolation,
reproducibility, calibration evidence, and model maturity scenarios in
`acceptance-scenarios.md`.
