# Reference Dataset Acquisition and Curation — Canonical API/CLI Contract

Status: canonical offline acquisition contract
Date: 2026-09-10

## Purpose

Define stable shapes for the maintainer-side inventory, source registry,
acquisition manifest, and candidate handoff. V1 may implement them as local
TypeScript data and scripts; no runtime HTTP API or browser scraper is required.

## Contract goals

- keep preparation/category/family/source identities distinct;
- make source and transformation provenance reproducible;
- allow only approved offline/manual acquisition methods;
- normalize Formula/optional Process without inventing missing values;
- hand candidates to the parent release verifier without reinterpreting them;
- keep restricted source content out of public static data.

## Transport-neutral conventions

- IDs and keys are stable ASCII identifiers; labels are localized.
- Formula masses use grams; Process values use the existing canonical units.
- Every acquired fact has a source and trace reference.
- Unknown, unavailable, and not-applicable are distinct outcomes.
- Acquisition runs are immutable records of what was read and how.
- Candidate readiness is not publication or public selectability.

## Core shapes

### CoverageEntry

```json
{
  "preparationKey": "brioche",
  "label": { "en": "Brioche", "el": "Μπριός" },
  "primaryCategory": "enriched-sweet-yeast",
  "aliases": ["brioche dough"],
  "candidateStructuralFamilies": ["family.fermented-gluten.rich-enriched"],
  "priority": "P0",
  "status": "planned",
  "notes": { "en": "", "el": "" }
}
```

The versioned `CoverageInventory` additionally carries a deterministic
`manifestIdentity` calculated from the inventory ID, revision, category
hierarchy, and ordered entries. It is a planning manifest only; it is not
source evidence.

### SourceDefinition

```json
{
  "sourceId": "source-example-001",
  "citation": { "en": "...", "el": "..." },
  "urlOrBibliography": "https://example.invalid/source",
  "authorOrPublisher": "...",
  "accessedAt": "2026-09-10",
  "quality": "high",
  "acquisitionStatus": "manual-review",
  "reuseStatus": "review-required",
  "limitations": { "en": "...", "el": "..." }
}
```

The example values are illustrative. Actual source records require human
approval and accurate attribution.

The initial repository registry is intentionally `manual-review` until a
maintainer approves the source, terms, attribution, and permitted offline
method. A quality tier never implies permission or formula correctness.

### AcquisitionRun

```json
{
  "runId": "acq-2026-09-10-001",
  "sourceId": "source-example-001",
  "preparationKey": "brioche",
  "method": "manual-capture",
  "toolVersion": "capture-v1",
  "inputIdentity": "source-content-identity",
  "capturedAt": "2026-09-10T00:00:00Z",
  "outcome": "captured",
  "factIds": ["fact-001", "fact-002"]
}
```

### CandidateRecord

```json
{
  "candidateId": "candidate-brioche-source-001",
  "preparationKey": "brioche",
  "sourceId": "source-example-001",
  "acquisitionRunId": "acq-2026-09-10-001",
  "formula": "<canonical Formula snapshot>",
  "process": null,
  "normalization": ["<NormalizationTrace>"] ,
  "status": "needs-review",
  "review": null
}
```

`process: null` means no Process facts were captured. It must not be replaced
with a guessed Process snapshot.

### PilotCoverageReport

```json
{
  "inventoryRevision": "coverage-v2",
  "candidateSet": "pilot-v1",
  "targetPerCategory": { "minimum": 2, "maximum": 3 },
  "categoryCounts": {},
  "structuralFamilyCounts": {},
  "unrepresentedFamilies": [],
  "blockedEntries": [],
  "outcome": "reported"
}
```

## Intent mappings

### Browse coverage

Inputs: inventory revision, locale, and optional category/family/status filters.
Output: hierarchy, entries, aliases, and coverage status.

### Register source

Inputs: SourceDefinition fields and approval decision.
Output: versioned source definition or `source_review_required`.

### Run offline acquisition

Inputs: source ID, preparation key, permitted method, scope, input identity,
and method version.
Output: AcquisitionRun and minimally captured SourceFacts, or a diagnostic.

### Normalize candidate

Inputs: AcquisitionRun, SourceFacts, catalog versions, and policy.
Output: CandidateRecord with Formula/optional Process and traces.

### Review candidate

Inputs: candidate and reviewer checks/decision.
Output: accepted-for-release, returned-for-correction, or rejected.

### Prepare pilot report

Inputs: inventory and accepted candidates.
Output: PilotCoverageReport with category/family gaps and handoff IDs.

## Canonical diagnostics

| Code | Meaning | Recovery |
|---|---|---|
| `coverage_entry_invalid` | Inventory identity, locale, category, or family mapping is invalid. | Revise the inventory entry. |
| `duplicate_preparation_key` | Two entries claim one key in the same inventory revision. | Merge or rename through an explicit revision. |
| `source_review_required` | Source quality, attribution, terms, or acquisition status is unresolved. | Review and approve or block the source. |
| `source_acquisition_not_allowed` | The requested method is not allowed for the source. | Use a permitted manual/import method or choose another source. |
| `source_unavailable` | The registered source cannot be read or verified. | Record the gap and retry only when available. |
| `traceability_missing` | A captured or normalized field has no source trace. | Add a trace or leave the field Unknown. |
| `normalization_invalid` | A mass, unit conversion, role, or ingredient mapping is invalid. | Correct the candidate or return it for review. |
| `candidate_not_ready` | Required review or evidence is incomplete. | Complete review or reject the candidate. |
| `pilot_coverage_gap` | The pilot misses a target category or structural family. | Add candidates or record the gap explicitly. |
| `restricted_content_not_publishable` | Captured material exceeds the permitted public data boundary. | Keep it offline and retain only allowed normalized facts/citation. |

## Static and future adapters

V1 may keep the inventory, source registry, acquisition manifests, and accepted
static release data in versioned project files. An offline script may generate
candidate artifacts, but the browser consumes only published static release
data. A future CLI or service may expose equivalent intents without changing
these identifiers, outcomes, or no-bypass rules.
