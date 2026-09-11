# Issue 037 — Safe reference replacement and Blank reset

## Issue Metadata

- ID: 037
- Title: Safe reference replacement and Blank reset
- Category: feature
- State: awaiting-human-review
- Owning capability: Validation and Calibration
- Owning capability node: .okf/capabilities/validation-calibration.md
- Artifact root: docs/architecture/validation-calibration
- Delivery order: 9 of 12
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

Complete the draft-safety behavior for switching between Blank and Reference
Formula start points. Detect edits in the current Formula/Process pair,
require explicit confirmation before replacement, and apply the confirmed
replacement atomically. Cancellation must leave the current draft untouched;
confirmation must discard the old local draft without merging lines or leaking
unrelated Process values from the previous source.

Blank reset is a first-class replacement path: it clears the reference
provenance and restores the existing empty Formula/Process defaults. All
confirmation, cancellation, reset, and recovery messages must be bilingual,
accessible, and understandable as product language rather than developer
diagnostics.

## Acceptance criteria

- [x] The workspace detects a dirty Formula or Process draft before a new
  Reference or Blank selection and presents a clear localized replacement
  confirmation explaining that current edits will be discarded.
- [x] Canceling or dismissing the confirmation leaves Formula values, Process
  values, provenance, revisions, and analysis results unchanged.
- [x] Confirming replacement performs one atomic local replacement with the
  selected complete Formula/optional Process snapshot; it never merges lines
  or carries unrelated Process fields from the old draft.
- [x] Replacing with Blank restores the existing default-compatible empty draft,
  removes `derived-from-reference` context, and preserves the ability to start
  manual entry without any release dependency.
- [x] A selected Formula-only record clears Process to Unknown/not recorded;
  stale Process values from the previous draft cannot survive replacement.
- [x] Invalid replacement or unavailable-release diagnostics keep the prior
  draft available and provide a recoverable path; no silent fallback occurs.
- [x] Keyboard focus, accessible names, focus visibility, contrast, and
  English/Greek parity are covered for the confirmation, cancel, replace, and
  reset states.
- [x] Unit/application tests cover clean replacement, dirty confirmation,
  cancel, confirmed replacement, Blank reset, Formula-only Process clearing,
  and failure recovery.

## Artifact sync required

- Application PRD: none; dirty replacement and Blank remain are already
  specified in the current application synthesis.
- Application architecture summary: none; this is local in-memory state inside
  the existing browser boundary.
- Owning capability node/artifacts: required: .okf/capabilities/validation-calibration.md
  and docs/architecture/validation-calibration/orchestration-status.md
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: delivery of the existing draft-safety policy;
  verify shared locale, provenance, Formula/Process, and Unknown semantics but
  do not alter the product boundary.

## Human review gate

This issue changes rendered UI/UX and requires `visual-review`, but the review
is intentionally deferred to the grouped final review after Issues 033–039 and 041–044 are
implemented. Inspect dirty-draft confirmation, cancel/confirm behavior, Blank
reset, Formula-only Process clearing, localized recovery, keyboard focus,
accessible labels, responsive layout, and contrast in both locales.

## Blocked by

- Blocked by —

## Artifact anchors

- PRD: FR-VC-008 and FR-VC-009; Replace a current draft and Start from Blank
  workflows
- Domain model: ReferenceLoadPolicy, LocalDraft lifecycle, invariants 8–9,
  and `derived-from-reference` provenance
- Use cases: CreateLocalDraftFromReference and CreateLocalDraftFromBlank
- Contract: dirty-draft confirmation outcomes, local-draft commands, and
  `dirty_draft_confirmation_required`

## Acceptance scenarios addressed

- SC-VC-001 — Blank remains the default start
- SC-VC-008 — Dirty draft replacement is explicit
- SC-VC-010 — Unavailable release has no silent fallback

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-VC-001 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-008 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-010 | not-applicable | implemented | deferred: no E2E harness |

## Implementation record

The workspace now treats a Formula/Process pair as one replacement boundary.
Any edit increments the relevant revision and makes a new Blank or Reference
selection require explicit confirmation. Cancel keeps the current in-memory
draft and analysis state; Escape provides an equivalent keyboard dismissal.
Confirmation clears both persisted draft slots and the local command ledger,
then installs the selected complete snapshot without merging old lines or
Process values.

Blank reset restores the existing empty defaults and removes reference
provenance. Formula-only references receive a fresh Unknown/not-recorded
Process draft. Invalid copies and unavailable records are rejected before the
replacement is applied, so the prior draft remains available. The dialog has
localized product wording, an accessible name/description, an initial cancel
focus, and visible focus styling; final responsive and contrast inspection is
part of the grouped review.

## Verification

- `npm test` — passed (23 test files, 124 tests before the final batch).
- `npm run lint` — final batch verification pending.
- `npm run typecheck` — final batch verification pending.
- `git diff --check` — final batch verification pending.
- Grouped visual review remains intentionally open for the final review after
  Issues 033–039 and 041–044 are implemented.
