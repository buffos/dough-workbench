# Issue 034 — Publish curated pilot `gold-formulas-v1`

## Issue Metadata

- ID: 034
- Title: Publish curated pilot `gold-formulas-v1`
- Category: feature
- State: done
- Owning capability: Validation and Calibration
- Owning capability node: .okf/capabilities/validation-calibration.md
- Artifact root: docs/architecture/validation-calibration
- Delivery order: 6 of 12
- Execution type: AFK
- Review gate: none
- Review mode: None; product approval of candidate data is completed in Issue 044 and the public UI is reviewed later with Issue 040

## Parent Artifacts

- docs/architecture/validation-calibration/prd.md
- docs/architecture/validation-calibration/domain-glossary.md
- docs/architecture/validation-calibration/canonical-domain-model.md
- docs/architecture/validation-calibration/canonical-use-cases.md
- docs/architecture/validation-calibration/canonical-api-cli-contract.md
- docs/architecture/validation-calibration/acceptance-scenarios.md
- docs/architecture/validation-calibration/readiness-review.md
- .okf/capabilities/validation-calibration.md
- .okf/project.md
- docs/agents/issues/done/20260910-033-gold-dataset-release-boundary-and-verifier.md
- docs/agents/issues/done/20260910-044-pilot-candidate-curation-and-coverage-report.md

## What to build

Consume the accepted pilot handoff from Issue 044 and the immutable release
boundary/verifier from Issue 033 to assemble and publish the first static
`gold-formulas-v1` release. Publication is mechanical: it may select only
candidate records explicitly accepted for release, preserve their Formula and
independent optional Process snapshots, retain provenance and bilingual
metadata, and produce a deterministic release manifest/content identity.

Do not perform new source research, scraping, recipe invention, transcription,
normalization, or candidate approval in this issue. Do not silently repair a
candidate. If the handoff fails verification, publication must stop with the
diagnostic and the candidate must return to the acquisition/curation path.

## Acceptance criteria

- [x] A release artifact with immutable ID `gold-formulas-v1` is assembled
  exclusively from the accepted-for-release candidate handoff from Issue 044
  and is declared current only after Issue 033 verification passes.
- [x] The release contains a deterministic manifest with stable content
  identity, source/candidate identities, inventory revision, record count,
  model/evidence reference, creation metadata, and supersession metadata.
- [x] Every published record has a valid Formula Snapshot in grams, stable
  preparation/record identity, source evidence, curation decision, bilingual
  metadata, and its normalization/Unknown traces.
- [x] Independent optional Process snapshots are preserved only where the
  candidate provides supported facts; absent Process information remains
  Unknown/not recorded and is not fabricated.
- [x] Roles, partitions, `publicSelectable`, and `primary` remain separate;
  only eligible accepted reference records are selectable, with no invalid
  calibration/validation/test record exposed.
- [x] The verifier rejects malformed handoffs and publication stops without
  fallback, silent correction, partial current-release mutation, or historical
  release mutation.
- [x] The published release is immutable; later corrections require a new
  candidate/release revision rather than changing `gold-formulas-v1` in place.
- [x] Unit/application tests cover handoff filtering, deterministic manifest
  identity, verifier integration, optional Process, Unknown handling, role and
  partition separation, rejection, and immutability.

## Artifact sync required

- Application PRD: none; the static release boundary and pilot handoff are
  already captured in the current synthesis.
- Application architecture summary: none; release data remains static project
  data consumed by the browser and no backend is introduced.
- Owning capability node/artifacts: required: `.okf/capabilities/validation-calibration.md`
  and `docs/architecture/validation-calibration/orchestration-status.md`.
- Child handoff artifact: required: preserve the Issue 044 pilot manifest and
  link the immutable handoff to the published release.
- Issue registry: required; parent and child `issues:` references must remain
  accurate.
- Reason/no-impact decision: this is the publication step inside the already
  specified release boundary. It must not absorb acquisition or curation work
  and must not change product topology.

## Human review gate

None. Issue 044 is the product/data approval gate for the pilot candidate
contents. Issue 033 supplies automated release verification, and the public
reference journey receives the grouped visual review at Issue 040.

## Blocked by

- —

## Artifact anchors

- PRD: FR-VC-002 through FR-VC-005 and FR-VC-011
- Domain model: DatasetRelease, DatasetRecord, SourceEvidence,
  PreparationIdentity, RecordAcceptancePolicy, PublicReferencePolicy,
  ReleaseImmutabilityPolicy, LocaleParityPolicy, and lifecycle candidate →
  published
- Use cases: CurateDatasetRecord, VerifyDatasetRelease,
  PublishDatasetRelease
- Contract: DatasetRecordSummary, DatasetRecordSnapshot, Verify a release,
  publication diagnostics, and static release mapping
- Handoff: Issue 044 accepted pilot candidate set and PilotCoverageReport

## Acceptance scenarios addressed

- SC-VC-003 — Only eligible records are selectable
- SC-VC-004 — Primary reference appears first
- SC-VC-005 — Select a reference Formula
- SC-VC-006 — Optional Process loads independently

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-VC-003 | not-applicable | planned | deferred: no E2E harness |
| SC-VC-004 | not-applicable | planned | deferred: no E2E harness |
| SC-VC-005 | not-applicable | planned | deferred: no E2E harness |
| SC-VC-006 | not-applicable | planned | deferred: no E2E harness |

## Implementation record

Published `gold-formulas-v1` in `src/data/reference/release.ts` from the
approved immutable handoff `handoff-ffbc6efc`. The release contains 22
accepted records with Formula snapshots, independent Process snapshots,
source/citation provenance, bilingual labels and review notes, normalization
traces, calibration/reference roles, and deterministic content identity. The
browser-safe registry now resolves the release; no runtime source access or
copied source prose was introduced.

## Verification

- `npm test` — passed (22 test files, 119 tests).
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `git diff --check` — passed; only Git's LF/CRLF normalization warnings.
- The release-specific suite verifies publication, content identity, role and
  partition separation, Formula/Process identity, bounded browsing, and
  searchability.
- Strict OKF validation — passed with no issues.
- Astro was not started; frontend integration remains covered by later issues
  and the grouped visual-review gate at Issue 040.
