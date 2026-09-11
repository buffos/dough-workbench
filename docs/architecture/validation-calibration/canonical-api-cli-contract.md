# Validation and Calibration — Canonical API/CLI Contract

Status: canonical external and static-data contract
Date: 2026-09-10

## Purpose

Define the stable contract for consuming versioned Gold Dataset releases and
reference Formula snapshots. V1 is a static frontend, so no runtime HTTP API or
CLI is required. The shapes below define the semantics that a static import,
future build tool, HTTP adapter, or CLI must preserve.

## Contract goals

- Keep release and record identity reproducible.
- Make public reference eligibility explicit.
- Preserve independent Formula and optional Process snapshots.
- Never silently fall back to another release or locale.
- Keep source, maturity, role, partition, confidence, and Unknown semantics
  visible.
- Let a selected reference create a local draft without mutating source data.
- Let maintainer tooling acquire and normalize approved source facts offline
  without making the browser a source client.

## Transport-neutral conventions

- IDs and keys are stable ASCII identifiers; display labels are localized.
- Versions are immutable strings such as `gold-formulas-v2` and
  `classification-seed-v2`.
- Masses use grams; Process quantities use the existing canonical units.
- Optional data is absent or explicitly Unknown according to the existing
  Formula/Process contract; it is never coerced to zero.
- Results use explicit `outcome`/`diagnostic` values rather than exceptions
  that hide business meaning.
- The current supported release is a declared value, not an implicit “latest”
  fallback.

## Core shapes

### DatasetReleaseDescriptor

```json
{
  "releaseId": "gold-formulas-v2",
  "kind": "gold-formulas",
  "status": "published",
  "contentIdentity": "sha256:...",
  "createdAt": "2026-09-10T00:00:00Z",
  "supersedes": null,
  "recordCount": 24,
  "defaultModelVersion": "classification-seed-v2"
}
```

The example count and hash are illustrative. The contract requires the fields,
not a fixed count or algorithm-specific hash representation.

### DatasetRecordSummary

```json
{
  "releaseId": "gold-formulas-v2",
  "recordId": "brioche-primary-01",
  "preparationKey": "brioche",
  "structuralFamilyId": "family.fermented-gluten.rich-enriched",
  "prototypeId": "brioche",
  "label": { "en": "Brioche — primary", "el": "Brioche — βασική" },
  "roles": ["reference", "calibration"],
  "evaluationPartition": "calibration",
  "publicSelectable": true,
  "primary": true,
  "processIncluded": false,
  "maturity": "expert-seed",
  "sourceSummary": { "quality": "high", "sourceId": "source-001" }
}
```

`DatasetRecordSummary` is the scalable selector read model. It may be paged or
filtered. `publicSelectable` is explicit and must be checked by the resolver.

### DatasetRecordSnapshot

```json
{
  "releaseId": "gold-formulas-v2",
  "recordId": "brioche-primary-01",
  "identity": {
    "preparationKey": "brioche",
    "label": { "en": "Brioche — primary", "el": "Brioche — βασική" },
    "familyId": "family.fermented-gluten.rich-enriched",
    "prototypeId": "brioche"
  },
  "formula": "<canonical Formula snapshot>",
  "process": null,
  "provenance": {
    "sourceId": "source-001",
    "quality": "high",
    "curationState": "accepted",
    "reviewNote": { "en": "...", "el": "..." }
  },
  "roles": ["reference", "calibration"],
  "evaluationPartition": "calibration",
  "publicSelectable": true,
  "primary": true,
  "maturity": "expert-seed"
}
```

The Formula and Process properties use the canonical structures from the
Formula Analysis Workspace. `process: null` means no Process snapshot was
published; the created local Process draft must therefore remain Unknown/not
recorded.

### ReferenceSelectionResult

```json
{
  "outcome": "selected",
  "source": {
    "releaseId": "gold-formulas-v2",
    "recordId": "brioche-primary-01"
  },
  "draft": "<independent Formula + Process local draft>",
  "provenance": {
    "kind": "derived-from-reference",
    "sourceReleaseId": "gold-formulas-v2",
    "sourceRecordId": "brioche-primary-01"
  }
}
```

## Query mappings

### Browse reference formulas

Transport-neutral intent: `BrowseReferenceFormulas`.

Inputs:

```json
{
  "locale": "el",
  "releaseId": "gold-formulas-v2",
  "query": "brioche",
  "familyId": "family.fermented-gluten.rich-enriched",
  "page": 1,
  "pageSize": 20
}
```

Output: `DatasetReleaseDescriptor` plus only accepted, public-selectable
`DatasetRecordSummary` items and pagination metadata.

### Resolve a reference

Transport-neutral intent: `ResolveReferenceFormula`.

Inputs: `releaseId`, `recordId`, and locale for localized presentation.

Output: `DatasetRecordSnapshot` or a canonical diagnostic.

### Verify a release

Transport-neutral intent: `VerifyDatasetRelease`.

Output:

```json
{
  "outcome": "pass",
  "releaseId": "gold-formulas-v2",
  "recordErrors": [],
  "roleErrors": [],
  "partitionErrors": [],
  "localeErrors": [],
  "contentIdentity": "sha256:..."
}
```

## Command mappings

### Create local draft from reference

Transport-neutral intent: `CreateLocalDraftFromReference`.

Inputs include the resolved snapshot, current draft dirty state, and explicit
confirmation when dirty:

```json
{
  "source": { "releaseId": "gold-formulas-v2", "recordId": "brioche-primary-01" },
  "currentDraftState": "dirty",
  "confirmReplacement": true
}
```

Outcomes:

- `selected` — independent Formula/Process draft created;
- `dirty_draft_confirmation_required` — current draft remains unchanged;
- `reference_copy_invalid` — current draft remains unchanged;
- `record_not_selectable`, `record_not_found`, or `release_unavailable`.

### Create local draft from Blank

Transport-neutral intent: `CreateLocalDraftFromBlank`.

The same dirty-draft confirmation rule applies. The resulting draft contains no
dataset reference provenance.

## Canonical diagnostics

| Code | Meaning | Recovery |
|---|---|---|
| `release_unavailable` | Requested release is not available. | Choose a supported release; do not auto-fallback. |
| `release_invalid` | Release metadata/content identity fails validation. | Use a valid release artifact. |
| `record_not_found` | ID is not present in the selected release. | Choose another record. |
| `record_not_selectable` | Record is not accepted/public/reference eligible. | Choose an approved public reference. |
| `record_invalid` | Snapshot or required evidence is malformed. | Curate/correct in a new release. |
| `dirty_draft_confirmation_required` | Selecting a new start would discard edits. | Confirm replacement or cancel. |
| `reference_copy_invalid` | Snapshot cannot create a valid local draft. | Keep current draft; repair release. |
| `duplicate_record_id` | Release has duplicate stable IDs. | Reject release and curate a new one. |
| `multiple_primary_references` | A preparation has more than one primary. | Resolve primary designation in a new release. |
| `missing_provenance` | Accepted record lacks source evidence. | Reject or complete curation. |
| `partition_violation` | Calibration/validation/test policy is violated. | Correct partition or evaluation protocol. |
| `test_leakage` | Test evidence was used for fitting. | Reject parameter release. |
| `locale_parity_failure` | Required English/Greek presentation is missing. | Add both locale values before publication. |
| `insufficient_evidence` | Evidence does not justify requested maturity. | Keep the lower maturity or gather evidence. |
| `regression_failure` | Required model behavior failed. | Do not publish the candidate model release. |

## Static frontend mapping

The V1 implementation may import a current release and a generated summary
directly from static project data. Maintainer-side inventory, source registry,
acquisition manifests, and candidate artifacts may be generated offline before
the accepted release is committed. The browser performs the same public-filter,
version-resolution, snapshot-copy, and diagnostic rules locally. No account,
backend, network mutation, source scraping, or runtime dataset upload is
required.

## Future HTTP mapping

If a future adapter exposes the same semantics over HTTP, it may map queries to
GET-like reads and publication/evaluation to maintainer-only commands. Exact
URLs and authentication are intentionally outside V1. The adapter must preserve
the identifiers, statuses, diagnostics, no-fallback behavior, and snapshot
immutability above.

## Future CLI mapping

A future local tool may expose equivalent intents such as:

```text
dfi dataset verify gold-formulas-v2
dfi dataset publish gold-formulas-v2
dfi calibration evaluate --data gold-formulas-v2 --model classification-v2
```

These are illustrative mappings, not a V1 CLI requirement. They must not
change the business meaning or make public browsing dependent on a CLI.

## Parity rules

All adapters must preserve:

- one release/record identity across English and Greek;
- Formula/Process separation;
- explicit role and partition semantics;
- no silent version fallback;
- no Unknown-to-zero conversion;
- immutable source snapshots and explicit dirty replacement;
- maturity/confidence limits and evidence references; and
- equivalent localized explanations and diagnostics.
