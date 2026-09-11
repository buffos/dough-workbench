# Validation and Calibration — Acceptance Scenarios

Status: canonical scenario catalog
Date: 2026-09-10

The scenarios cover the first Gold Dataset release, public reference selection,
safe local drafting, and evidence/calibration governance. They are behavior
contracts, not framework-specific test scripts.

## SC-VC-001 — Blank remains the default start

Given a user opens the Formula workspace, when no starting point has been
chosen, then Blank Formula remains available and the current empty
Formula/Process draft can be used without loading dataset data.

Surfaces: backend `not-applicable`; frontend integration `when-supported`; end-to-end `catalog-only`.

## SC-VC-002 — Browse public reference formulas

Given a published dataset release contains accepted public references, when the
user opens Reference Formula, then the workspace shows searchable/filterable
reference summaries grouped by structural family and preparation. It does not
render the entire release as one unbounded dropdown.

Surfaces: backend `not-applicable`; frontend integration `when-supported`; end-to-end `catalog-only`.

## SC-VC-003 — Only eligible records are selectable

Given the same release contains calibration-only, validation, test, rejected,
and public-reference records, when the user browses references, then only
accepted records with the `reference` role and `publicSelectable: true` are
shown. Validation/test records remain unavailable.

Surfaces: backend `not-applicable`; frontend integration `when-supported`; end-to-end `catalog-only`.

## SC-VC-004 — Primary reference appears first

Given a preparation has multiple accepted public references, when the user
opens that preparation, then the single `primary` reference appears first and
the other accepted variants remain distinguishable.

Surfaces: backend `not-applicable`; frontend integration `when-supported`; end-to-end `catalog-only`.

## SC-VC-005 — Select a reference Formula

Given an eligible reference record contains a valid Formula Snapshot, when the
user selects it, then the Formula fields are populated from that snapshot and
the workspace shows the preparation, source, release, and maturity context.

Surfaces: backend `not-applicable`; frontend integration `when-supported`; end-to-end `catalog-only`.

## SC-VC-006 — Optional Process loads independently

Given one reference contains a Process Snapshot and another contains only a
Formula Snapshot, when each is selected, then the first populates Formula and
Process independently while the second leaves Process as Unknown/not recorded.
Formula values and composition semantics do not change merely because Process
data is present.

Surfaces: backend `not-applicable`; frontend integration `when-supported`; end-to-end `catalog-only`.

## SC-VC-007 — Reference selection creates an editable copy

Given a user selected a reference, when the user changes water, eggs, flour,
fat, or another supported field, then the analysis recomputes from the local
draft and the original release record remains unchanged.

Surfaces: backend `not-applicable`; frontend integration `when-supported`; end-to-end `catalog-only`.

## SC-VC-008 — Dirty draft replacement is explicit

Given the current Formula or Process draft contains user edits, when the user
selects another reference or Blank, then the workspace asks for replacement
confirmation. Before confirmation the current draft remains unchanged; after
confirmation the new Formula/optional Process snapshot replaces it without
merging old lines or retaining unrelated Process data.

Surfaces: backend `not-applicable`; frontend integration `when-supported`; end-to-end `catalog-only`.

## SC-VC-009 — Reference provenance survives into the draft

Given a reference is selected, when the local draft is shown, then it retains
the source release/record provenance as “derived from reference” while later
user edits are distinguishable from the source values.

Surfaces: backend `not-applicable`; frontend integration `when-supported`; end-to-end `catalog-only`.

## SC-VC-010 — Unavailable release has no silent fallback

Given the user requests a release ID that is unavailable or invalid, when the
reference catalog resolves it, then the workspace shows a localized diagnostic
and recovery guidance. It does not silently choose the current release, a
different record, or a different locale.

Surfaces: backend `not-applicable`; frontend integration `when-supported`; end-to-end `catalog-only`.

## SC-VC-011 — Release reproducibility

Given a historical published release and record ID, when the same release is
resolved again with the same ingredient/catalog versions, then the Formula,
optional Process, record identity, and content identity are equivalent.

Surfaces: backend `not-applicable`; frontend integration `planned`; end-to-end `catalog-only`.

## SC-VC-012 — Invalid records cannot be published

Given a candidate has an invalid mass, unresolved required ingredient,
duplicate ID, missing provenance, multiple primary references, or missing
required locale value, when the release is verified, then publication fails with
specific diagnostics and no invalid published release is created.

Surfaces: backend `not-applicable`; frontend integration `not-applicable`; end-to-end `catalog-only`.

## SC-VC-013 — Roles and evaluation partitions remain separate

Given a release contains records with `reference`/`calibration` roles and
calibration/validation/test partitions, when a model evaluation is prepared,
then role permissions and evaluation partitions are reported separately and
the declared partition assignments are preserved.

Surfaces: backend `not-applicable`; frontend integration `not-applicable`; end-to-end `catalog-only`.

## SC-VC-014 — No test leakage

Given a candidate model release uses calibration and validation evidence, when
the evaluator detects test records in the fitting input, then evaluation fails
with `test_leakage` and no parameter release can claim the requested maturity.

Surfaces: backend `not-applicable`; frontend integration `not-applicable`; end-to-end `catalog-only`.

## SC-VC-015 — Maturity bounds confidence

Given an Expert Seed, Gold Calibrated, Broad Calibrated, or Experiment Validated
model release, when a result is rendered, then its maximum confidence respects
the maturity ceiling and evidence coverage. Similarity is not rendered as
probability.

Surfaces: backend `not-applicable`; frontend integration `when-supported`; end-to-end `catalog-only`.

## SC-VC-016 — Calibration regression suite

Given a candidate model parameter release, when the evaluator runs the declared
regression suite, then it reports canonical parent-family recognition,
named-prototype behavior, absurd cross-family matches, smooth counterfactuals,
Formula/Process independence, functional ingredient equivalence, Unknown
handling, no-match/hybrid behavior, confidence sanity, and explanation
fidelity.

Surfaces: backend `not-applicable`; frontend integration `not-applicable`; end-to-end `catalog-only`.

## SC-VC-017 — Bilingual reference and evidence parity

Given the same release and record are opened in English and Greek, when the
user browses, selects, replaces, or reads its evidence, then labels, warnings,
source/maturity explanations, and accessibility copy have equivalent meaning.
Canonical IDs, Formula/Process values, release versions, and model semantics
remain identical.

Surfaces: backend `not-applicable`; frontend integration `when-supported`; end-to-end `catalog-only`.

## Coverage decision

The root verification policy is `when-supported` for frontend integration and
`catalog-only` for end-to-end coverage. No backend surface exists in V1. The
current repository has deterministic/unit coverage but no dedicated browser
E2E harness; issue closure must record that deferral rather than inventing a
harness. The user-visible reference flow is nevertheless required to be
reachable from the Formula workspace before its UI issue can be accepted.
