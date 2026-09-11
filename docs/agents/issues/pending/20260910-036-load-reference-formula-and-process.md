# Issue 036 — Load reference Formula and optional Process

## Issue Metadata

- ID: 036
- Title: Load reference Formula and optional Process
- Category: feature
- State: awaiting-human-review
- Owning capability: Validation and Calibration
- Owning capability node: .okf/capabilities/validation-calibration.md
- Artifact root: docs/architecture/validation-calibration
- Delivery order: 8 of 12
- Execution type: AFK
- Review gate: visual-review
- Review mode: grouped visual review after Issues 033–039 and 041–044 are implemented; do
  not request a separate review for this issue

## Parent Artifacts

- docs/architecture/validation-calibration/prd.md
- docs/architecture/validation-calibration/domain-glossary.md
- docs/architecture/validation-calibration/canonical-domain-model.md
- docs/architecture/validation-calibration/canonical-use-cases.md
- docs/architecture/validation-calibration/canonical-api-cli-contract.md
- docs/architecture/validation-calibration/acceptance-scenarios.md
- docs/architecture/validation-calibration/readiness-review.md
- .okf/capabilities/validation-calibration.md
- .okf/capabilities/shared/trust-and-provenance.md
- .okf/project.md

## What to build

Implement the clean-draft selection boundary that resolves an eligible public
reference and copies its complete Formula Snapshot plus its optional Process
Snapshot into the existing local Formula/Process workspace. The copy must be
independent of the immutable release record. The workspace should clearly show
that it was derived from a named reference, including release, record, source,
and maturity context, while retaining the existing Formula/Process separation.

If the selected record has no Process Snapshot, create a fresh Unknown/not
recorded Process state rather than retaining or synthesizing process data. If
the snapshot cannot produce a valid local draft, preserve the current draft and
show the canonical recovery diagnostic.

## Acceptance criteria

- [x] Selecting an eligible reference on a clean workspace resolves the full
  Formula Snapshot and independently copies the optional Process Snapshot into
  the local draft.
- [x] The local Formula and Process values are deep/structurally independent
  from the release record and from subsequent selections; editing the draft
  cannot mutate static source data.
- [x] A Formula-only reference clears the new Process draft to Unknown/not
  recorded. Process presence never changes Formula composition semantics or
  intrinsic metrics merely because it was loaded.
- [x] The loaded workspace shows preparation identity, source/provenance,
  release version, record identity, maturity/status, and whether Process was
  included, with equivalent English and Greek wording.
- [x] Invalid, non-selectable, missing, or unavailable snapshots produce a
  localized diagnostic and actionable recovery while leaving the current draft
  unchanged.
- [x] Provenance distinguishes source-derived values from later local edits;
  the source release and record remain immutable and no merge with old draft
  lines occurs.
- [x] Unit/application tests cover Formula copy, optional independent Process,
  no mutation, provenance retention, Unknown Process reset, and invalid-copy
  recovery.

## Artifact sync required

- Application PRD: none; this is the specified `CreateLocalDraftFromReference`
  behavior already present in the current synthesis.
- Application architecture summary: none; the local copy remains in-memory in
  the existing browser boundary.
- Owning capability node/artifacts: required: .okf/capabilities/validation-calibration.md
  and docs/architecture/validation-calibration/orchestration-status.md
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: cross-capability integration at the existing
  workspace boundary; update delivery references and verify shared provenance,
  bilingual, Formula/Process, and Unknown policies without changing them.

## Human review gate

This issue changes rendered UI/UX and requires `visual-review`, but the review
is intentionally deferred to the grouped final review after Issues 033–039 and 041–044 are
implemented. Inspect clean reference loading in both locales, provenance and
maturity context, Formula-only versus Formula+Process behavior, localized
errors, and the responsive/accessibility presentation.

## Blocked by

- Blocked by —

## Artifact anchors

- PRD: FR-VC-007, FR-VC-010; Start from a Reference Formula and Explore the
  selected draft workflows
- Domain model: ReferenceSelection, LocalDraft, ReferenceLoadPolicy,
  Formula/Process independence, and invariants 3–5 and 8
- Use cases: ResolveReferenceFormula and CreateLocalDraftFromReference
- Contract: DatasetRecordSnapshot, ReferenceSelectionResult, local-draft
  outcomes, and `reference_copy_invalid`

## Acceptance scenarios addressed

- SC-VC-005 — Select a reference Formula
- SC-VC-006 — Optional Process loads independently
- SC-VC-007 — Reference selection creates an editable copy
- SC-VC-009 — Reference provenance survives into the draft

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-VC-005 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-006 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-007 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-009 | not-applicable | implemented | deferred: no E2E harness |

## Implementation record

The existing application boundary now resolves an eligible published record
through `resolveReferenceFormulaDraft` and creates a fresh Formula/Process pair
through `startFormulaWorkspaceFromReference`. `formulaSnapshotToDraft` and
`processSnapshotToDraft` copy nested values, arrays, provenance, and optional
Process sections into independent local structures. Formula-only records create
the normal Unknown/not-recorded Process draft, while records with Process get a
new local Process identity tied to the new Formula identity.

The workspace displays preparation, source, maturity, release, primary/variant,
Process availability, and local-edit context. Friendly product labels are
shown in the main surface; stable release/source/record keys remain technical
details. A failed resolution or invalid copy leaves the current draft intact
and exposes localized recovery. Restoring a persisted reference draft rechecks
the release/record instead of silently falling back to another source.

## Verification

- `npm test` — passed (23 test files, 124 tests before the persistence-context
  change; the final suite is rerun with the complete batch).
- `npm run lint` — passed before the final persistence-context change.
- `npm run typecheck` — final batch verification pending.
- `git diff --check` — final batch verification pending.
- Grouped visual review remains intentionally open for the final review after
  Issues 033–039 and 041–044 are implemented.
