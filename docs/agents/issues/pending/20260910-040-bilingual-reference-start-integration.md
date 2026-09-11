# Issue 040 — Bilingual end-to-end reference-start integration

## Issue Metadata

- ID: 040
- Title: Bilingual end-to-end reference-start integration
- Category: feature
- State: awaiting-human-review
- Owning capability: Validation and Calibration
- Owning capability node: .okf/capabilities/validation-calibration.md
- Artifact root: docs/architecture/validation-calibration
- Delivery order: 12 of 12
- Execution type: AFK
- Review gate: visual-review
- Review mode: final grouped human review after Issues 033–039 and 041–044 are implemented

## Parent Artifacts

- docs/architecture/validation-calibration/prd.md
- docs/architecture/validation-calibration/domain-glossary.md
- docs/architecture/validation-calibration/canonical-domain-model.md
- docs/architecture/validation-calibration/canonical-use-cases.md
- docs/architecture/validation-calibration/canonical-api-cli-contract.md
- docs/architecture/validation-calibration/acceptance-scenarios.md
- docs/architecture/validation-calibration/readiness-review.md
- .okf/capabilities/validation-calibration.md
- .okf/capabilities/shared/bilingual-content.md
- .okf/capabilities/shared/trust-and-provenance.md
- .okf/project.md

## What to build

Join the release verifier, curated `gold-formulas-v1` data, scalable catalog,
snapshot copy, safe replacement, and model-evidence context into one coherent
Formula Workspace journey. A user must be able to open Blank or Reference
Formula, find a public record, understand its provenance and maturity, load an
editable Formula/optional Process copy, change it, replace it safely, and
recover from unavailable/invalid data without silent fallback.

The journey must be equivalent in English and Greek, use product language
instead of raw developer terminology, and retain all existing accessibility,
responsive, Formula/Process, trust, and Unknown-is-not-zero policies. This is
the final integration issue and the single grouped visual review gate for the
new capability.

## Acceptance criteria

- [x] The complete reference-start and Blank-start journey is reachable from
  both `/en/` and `/el/`: browse, filter/search, inspect, select, load, edit,
  analyze, replace, reset, and recover.
- [x] The workspace shows release/record/source provenance, primary/variant
  context, Process-included status, maturity, evidence/confidence limitations,
  and local-edit state without exposing unexplained debug strings as ordinary
  product copy.
- [x] Formula values, Process values, canonical IDs, release/model versions,
  revisions, and calculation semantics remain identical across locales.
- [x] Optional Process remains independent from Formula composition and
  intrinsic metrics; absent Process stays Unknown/not recorded; edited local
  drafts never mutate the source release.
- [x] Unavailable release, non-selectable record, invalid snapshot, dirty-draft
  confirmation, no-match, and recovery states are localized, actionable, and
  never silently fall back or convert Unknown to zero.
- [x] The final UI remains usable at supported desktop/mobile widths and with
  keyboard-only navigation, visible focus, accessible labels/descriptions,
  sensible reading order, and passing contrast checks.
- [x] Locale/parity, typecheck, lint, unit/application, and static data
  verification pass. Astro build/static-route verification remains deferred
  under the user-managed local preview policy.
- [ ] The grouped human visual review of the complete Validation and
  Calibration reference-start journey is completed and explicitly approved
  before this issue is closed. The review covers Issues 035–037 together with
  the final integration, not three separate review sessions.

## Artifact sync required

- Application PRD: none; the complete journey is already represented in the
  current application synthesis.
- Application architecture summary: none; this remains the static Astro/Svelte
  frontend and in-memory draft boundary.
- Owning capability node/artifacts: required: .okf/capabilities/validation-calibration.md
  and docs/architecture/validation-calibration/orchestration-status.md
- Shared Bilingual Content and Localization: required verification of all
  reference, release, evidence, diagnostic, recovery, and accessibility keys;
  no policy change is expected.
- Shared Trust, Provenance, and Uncertainty: required verification of source,
  maturity, coverage, confidence limits, and Unknown wording; no policy change
  is expected.
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: final user-facing integration of already-synced
  product and architecture truth; update delivery status and correct any
  implementation drift before closure, without adding backend or persistence.

## Human review gate

This issue requires the final grouped `visual-review`. After automated checks
pass, the user should inspect one complete English journey and one complete
Greek journey, including Blank and Reference starts, catalog search/filtering,
primary/variant and provenance wording, Formula-only versus Formula+Process
loading, edits and analysis, dirty replacement confirmation, Blank reset,
unavailable/invalid recovery, responsive layout, keyboard focus, accessible
labels, reading order, and contrast. The review must be recorded as one
approval for Issues 035–037 and 040; no earlier visual approval is implied.

## Blocked by

- Blocked by —

## Artifact anchors

- PRD: FR-VC-005 through FR-VC-010 and FR-VC-016; all reference-start,
  replacement, and exploration workflows
- Domain model: ReferenceSelection, LocalDraft, ReferenceLoadPolicy,
  MaturityConfidencePolicy, LocaleParityPolicy, and invariants 8–13
- Use cases: BrowseReferenceFormulas, ResolveReferenceFormula,
  CreateLocalDraftFromReference, CreateLocalDraftFromBlank, and the reference
  end-to-end chain
- Contract: ReferenceSelectionResult, local-draft outcomes, canonical
  diagnostics, and bilingual parity rules

## Acceptance scenarios addressed

- SC-VC-005 — Select a reference Formula
- SC-VC-006 — Optional Process loads independently
- SC-VC-007 — Reference selection creates an editable copy
- SC-VC-008 — Dirty draft replacement is explicit
- SC-VC-009 — Reference provenance survives into the draft
- SC-VC-010 — Unavailable release has no silent fallback
- SC-VC-017 — Bilingual reference and evidence parity

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-VC-005 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-006 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-007 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-008 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-009 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-010 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-017 | not-applicable | implemented | deferred: no E2E harness |

## Implementation record

Completed the final static-browser integration across `/en/` and `/el/`.
`FormulaWorkspace` mounts the Blank/Reference start boundary alongside the
existing Formula, Process, analysis, and exploration panels; selections are
resolved from the verified `gold-formulas-v1` registry, copied locally, and
rechecked when a persisted reference draft is restored. The journey includes
localized search/filter/grouping, primary/variant and provenance context,
optional Process handling, analysis, edit invalidation, explicit replacement
confirmation, Blank reset, and stale/invalid recovery.

The Reference Start panel uses product labels for release, source, and
structural family, keeps IDs in technical details, provides separate family
and preparation filters, bounded pagination, and keyboard-visible focus.
Application tests verify both locale routes retain identical semantic record
order and Formula/Process identities while presenting localized labels. No
runtime source access, backend, account, or new persistence boundary was added;
session storage remains the existing local draft convenience.

## Verification

- `npm test` — passed (23 test files, 128 tests).
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `git diff --check` — passed; only Git's LF/CRLF normalization warnings.
- Strict OKF validation — passed with no issues.
- Astro build/static-route verification remains deferred under the user-managed
  local preview policy.
- The single grouped visual review for Issues 035–037 and 040 remains open and
  is the only remaining acceptance item for this issue.
