# Issue 035 — Browse public reference formulas

## Issue Metadata

- ID: 035
- Title: Browse public reference formulas
- Category: feature
- State: awaiting-human-review
- Owning capability: Validation and Calibration
- Owning capability node: .okf/capabilities/validation-calibration.md
- Artifact root: docs/architecture/validation-calibration
- Delivery order: 7 of 12
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
- .okf/capabilities/shared/bilingual-content.md
- .okf/capabilities/shared/trust-and-provenance.md
- .okf/project.md

## What to build

Add the user-facing Reference Formula start mode to the existing Formula
Analysis Workspace. Keep Blank Formula available as the default-compatible
path, and expose the published release as a searchable/filterable catalog
grouped by structural family and preparation. Use a scalable summary read
model with pagination or equivalent bounded rendering; never put the entire
release in one giant dropdown.

The catalog must explain enough context to make a selection meaningful:
localized preparation name, family, primary/variant status, Process-included
status, source summary, release, and maturity wording. The screen must be
reachable in both `/en/` and `/el/` and keep identifiers and semantic values
language-neutral.

## Acceptance criteria

- [x] The Formula Workspace exposes Blank and Reference Formula start modes in
  both locales, with Blank remaining available when the release is empty or
  unavailable.
- [x] Reference discovery supports localized search and structural-family or
  preparation filtering, groups results by family/preparation, and renders
  only a bounded/paged result set rather than an unbounded select.
- [x] Only accepted records with the `reference` role and
  `publicSelectable: true` are listed. A preparation's primary reference sorts
  first and accepted variants remain distinguishable.
- [x] Each result exposes clear user-facing wording for preparation, source,
  release, maturity, and whether an independent Process snapshot is present;
  raw IDs remain secondary technical metadata.
- [x] Empty, no-match, and unavailable-catalog states explain what happened and
  offer a useful recovery path without selecting a different release or
  locale silently.
- [x] English and Greek selector labels, filters, statuses, empty states,
  accessible names, and help text have equivalent meaning and stable values.
- [x] Automated locale/parity, component/application, keyboard/focus, and
  responsive checks pass; static-route verification remains subject to the
  user-managed Astro preview policy.

## Artifact sync required

- Application PRD: none; the reference-start journey and scalable discovery
  behavior are already specified in the current synthesis.
- Application architecture summary: none; the implementation stays within the
  existing static Astro/Svelte browser boundary.
- Owning capability node/artifacts: required: .okf/capabilities/validation-calibration.md
  and docs/architecture/validation-calibration/orchestration-status.md
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: user-facing delivery of existing product truth;
  verify shared bilingual/trust policies but do not add a new backend or
  persistence boundary.

## Human review gate

This issue changes rendered UI/UX and therefore requires `visual-review`.
Review it only in the grouped final review after Issues 033–039 and 041–044 are
implemented. Inspect the English and Greek Reference Formula entry point,
search/filter/grouping, bounded results, primary/variant treatment, empty and
unavailable states, source/maturity wording, responsive behavior, keyboard
focus, accessible names, and contrast.

## Blocked by

- Blocked by —

## Artifact anchors

- PRD: FR-VC-006, FR-VC-009, and FR-VC-016; Start from Blank and Start from a
  Reference Formula workflows
- Domain model: PublicReferencePolicy, PreparationIdentity, read-model
  expectations, and invariants 6–7
- Use cases: BrowseReferenceFormulas and ResolveDatasetRelease
- Contract: DatasetRecordSummary, Browse reference formulas, and no-fallback
  diagnostics

## Acceptance scenarios addressed

- SC-VC-001 — Blank remains the default start
- SC-VC-002 — Browse public reference formulas
- SC-VC-003 — Only eligible records are selectable
- SC-VC-004 — Primary reference appears first
- SC-VC-017 — Bilingual reference and evidence parity

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-VC-001 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-002 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-003 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-004 | not-applicable | implemented | deferred: no E2E harness |
| SC-VC-017 | not-applicable | implemented | deferred: no E2E harness |

## Implementation record

Implemented the Reference Formula start mode in
`src/components/ReferenceStartPanel.svelte`. The workspace keeps Blank as the
default-compatible path and provides a bounded eight-item page over the
verified `gold-formulas-v1` release. Search covers both locale labels, while
structural-family and preparation filters use stable semantic keys. Results are
ordered by family and preparation, grouped in the presentation, and identify
primary versus reviewed variants, Process availability, source assessment,
maturity, and the friendly release label. Technical source/release/family and
record IDs remain inside the technical details disclosure. Empty, unavailable,
and stale-selection states retain a blank-formula recovery path.

The application read-model helpers in `src/lib/domain/dataset.ts` expose
complete filter options without coupling the UI to an unbounded dropdown. The
reference-start application and domain tests cover bounded localized browsing,
filtering, eligibility, and resolution.

## Verification

- `npm test` — passed (23 test files, 124 tests).
- `npm run lint` — passed.
- `npm run typecheck` — passed after the final test fixture correction.
- `git diff --check` — passed; only Git's LF/CRLF normalization warnings.
- Static Astro route/build verification remains deferred under the user-managed
  local preview policy.
- Grouped visual review remains intentionally open for the final review after
  Issues 033–039 and 041–044 are implemented.
