# Validation and Calibration — Canonical Use-Case Model

Status: canonical application/use-case surface
Date: 2026-09-10

## Purpose

Define the stable intents through which the frontend and future tooling consume
curated dataset releases and produce calibration evidence. The model is
transport-neutral and keeps user-facing reference loading separate from
maintainer calibration work.

## Application boundaries

### Reference Dataset Acquisition and Curation service

Maintains the preparation inventory, category/family mapping, source registry,
approved offline acquisition, normalization traces, candidate review, and
pilot coverage report. It hands `ready-for-release` candidates to Dataset
Governance and never publishes or exposes them directly.

### Reference Formula Catalog service

Provides searchable public reference summaries, resolves a selected release
and record, and hands an immutable snapshot to the Formula Analysis Workspace.

### Dataset Governance service

Curates candidates, validates acceptance evidence, assigns roles/partitions,
and publishes immutable dataset releases. In V1 this is a maintainer/build
workflow over static project data, not a public browser mutation flow.

### Calibration Evaluation service

Runs declared calibration/regression evaluations over a dataset release and
model version, records evidence, and publishes a versioned model-parameter
release. It can be implemented as a local deterministic tool or build step;
the public frontend only consumes its published outputs in V1.

## Canonical queries

### BrowseReferenceFormulas

Input: locale, release selector, optional search text, family/preparation
filter, page/cursor.

Output: localized public-reference summaries, primary marker, Process-included
marker, maturity/source summaries, and pagination metadata.

Rules:

- only accepted, reference-role, public-selectable records are returned;
- primary records sort first within a preparation;
- localized labels do not change IDs or matching semantics;
- an unavailable release returns a diagnostic rather than a fallback.

### ResolveDatasetRelease

Input: explicit release ID or current-supported-release request.

Output: immutable release descriptor or `release_unavailable` /
`release_invalid` diagnostic.

### ResolveReferenceFormula

Input: release ID and record ID.

Output: full Reference Formula record with Formula Snapshot, optional Process
Snapshot, provenance, maturity, roles, and version identity.

Failures: `record_not_found`, `record_not_selectable`, `record_invalid`,
`release_unavailable`.

### VerifyDatasetRelease

Input: candidate release.

Output: acceptance/diagnostic report covering IDs, snapshots, ingredient
resolution, source evidence, role/partition rules, primary uniqueness, locale
parity, and content identity.

This query/report is deterministic and does not mutate a release.

### InspectCalibrationEvidence

Input: model version, dataset release, evaluation protocol, partition and
quality-weight declarations.

Output: regression outcomes, coverage, confusion/failure evidence, confidence
ceilings, and a pass/fail report.

## Canonical commands

### CreateLocalDraftFromBlank

Input: workspace identity and locale.

Output: a new empty Formula/Process local draft with existing default states.

Rules: Blank remains a supported default and contains no dataset provenance.

### CreateLocalDraftFromReference

Input: resolved Reference Formula snapshot, current draft state, and explicit
replacement confirmation when required.

Output: a new editable local draft containing the selected Formula and optional
Process snapshots plus `derived-from-reference` provenance.

Rules:

- the source release/record remains immutable;
- Formula and Process are copied independently;
- no merge is performed;
- an absent Process becomes Unknown/not recorded in the new draft;
- a dirty current draft requires confirmation before replacement.

Failures: `dirty_draft_confirmation_required`, `reference_copy_invalid`,
`release_unavailable`, `record_not_selectable`.

### CurateDatasetRecord

Input: a normalized candidate from the acquisition service plus source
evidence, candidate Formula, optional Process, preparation identity, roles,
partition, and reviewer decision.

Output: candidate record in `curated`, `accepted`, or `rejected` state.

Responsibilities: normalize grams, resolve ingredient composition, preserve
Unknown, validate required evidence, and record why the candidate was accepted
or rejected.

### PublishDatasetRelease

Input: accepted records, release ID/version, source policy, content identity,
and supported model/evidence references.

Output: immutable published DatasetRelease.

Failures: `duplicate_record_id`, `multiple_primary_references`,
`invalid_record`, `missing_provenance`, `partition_violation`,
`locale_parity_failure`, `release_id_conflict`.

### EvaluateModelRelease

Input: model parameters, dataset release, evaluation partitions, quality
weights, and regression protocol.

Output: CalibrationEvaluation and a candidate ModelParameterRelease maturity.

Responsibilities: keep fitting/evaluation data separated, apply declared
weights, report failures and coverage, and bound confidence by maturity.

Failures: `missing_partition`, `test_leakage`, `invalid_protocol`,
`insufficient_evidence`, `regression_failure`.

### PublishModelParameterRelease

Input: a passing CalibrationEvaluation and parameter metadata.

Output: immutable versioned model-parameter release with maturity and evidence
references.

Rule: publication cannot claim a higher maturity than the evidence supports.

## Transaction and consistency expectations

- `BrowseReferenceFormulas`, `ResolveDatasetRelease`, and
  `ResolveReferenceFormula` are read-only queries.
- `CreateLocalDraftFromReference` is a local atomic replacement of the
  workspace draft; it has no write transaction against DatasetRelease.
- `CurateDatasetRecord` may be a local working operation before release
  publication.
- `PublishDatasetRelease` is an atomic release operation: either all acceptance
  checks pass and the snapshot is published, or no published release is
  created.
- `EvaluateModelRelease` is deterministic for identical model/data/protocol
  versions and must record its inputs.
- `PublishModelParameterRelease` is append-only; superseding a release does not
  rewrite the old one.

## Idempotency and replay

- Resolving or browsing the same release/record is idempotent.
- Publishing a release with an existing ID is rejected unless its content
  identity is exactly the same; no silent overwrite is allowed.
- Re-running an evaluation with the same versions/protocol produces the same
  canonical outcome or an explicit diagnostic.
- Replaying reference selection creates a fresh local copy but never mutates
  the source.

## Failure model

### Input/data failures

Malformed snapshots, unresolved required ingredients, invalid masses, missing
provenance, duplicate IDs, invalid roles, and locale parity failures prevent
acceptance or publication.

### Availability failures

Unavailable release or record produces a visible diagnostic and recovery
guidance. The application does not silently choose the latest or another
locale.

### Draft safety failures

Dirty replacement is blocked until the user confirms. Invalid copy leaves the
current draft available and unchanged.

### Evidence failures

Missing or contaminated partitions, test leakage, insufficient evidence, and
regression failures prevent a model release from claiming the requested
maturity.

## Canonical end-to-end chains

### Blank analysis

```text
CreateLocalDraftFromBlank
  -> edit Formula/Process
  -> existing normalization and analysis
  -> optional Interactive Formula Exploration
```

### Reference-started analysis

```text
BrowseReferenceFormulas
  -> ResolveReferenceFormula
  -> CreateLocalDraftFromReference
  -> inspect provenance/version/maturity
  -> edit Formula/optional Process
  -> existing analysis and counterfactual exploration
```

### Dirty replacement

```text
current local draft is dirty
  -> select another reference or Blank
  -> return dirty_draft_confirmation_required
  -> user confirms
  -> replace Formula/Process atomically
```

### Dataset release

```text
Define coverage / register source
  -> Acquire candidate facts offline
  -> Normalize and review candidate
  -> CurateDatasetRecord
  -> VerifyDatasetRelease
  -> PublishDatasetRelease
  -> expose accepted public-reference read model
```

### Calibration release

```text
select model + dataset + protocol
  -> EvaluateModelRelease
  -> inspect calibration/validation/test outcomes
  -> PublishModelParameterRelease when evidence passes
```

## Application events

The application boundary may publish `ReferenceFormulaSelected`,
`LocalDraftCreatedFromReference`, `LocalDraftReplacedAfterConfirmation`,
`DatasetReleasePublished`, `CalibrationEvaluationCompleted`, and
`ModelParameterReleasePublished`. Their payloads carry stable IDs and versions,
not localized prose or mutable object graphs.

## Mapping guidance

The static V1 frontend can implement the query and local-draft commands as
in-memory adapters over imported release data. A future CLI/build adapter can
implement curation, release verification, and calibration evaluation without
changing the intent names, statuses, failure semantics, or snapshot boundaries.
