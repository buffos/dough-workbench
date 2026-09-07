## Issue Metadata

- Issue number: `002`
- Owning capability node: `/.okf/capabilities/formula-analysis-workspace/formula-input-normalization.md`
- Artifact root: `docs/architecture/formula-input-normalization/`
- Issue file: `docs/agents/issues/done/20260907-002-validation-recovery.md`
- Category: `feature`
- Execution type: `AFK`
- Review gate: `visual-review`
- Suggested state: `done`

## Parent Artifacts

- `docs/architecture/formula-input-normalization/prd.md`
- `docs/architecture/formula-input-normalization/canonical-domain-model.md`
- `docs/architecture/formula-input-normalization/canonical-use-cases.md`
- `docs/architecture/formula-input-normalization/canonical-api-cli-contract.md`
- `docs/architecture/formula-input-normalization/acceptance-scenarios.md`
- `docs/architecture/formula-input-normalization/readiness-review.md`

## What to build

Extend the Formula workspace with explainable hard validation and correction
recovery. Detect missing positive-mass structural flour and missing, non-finite,
zero, or negative masses before normalization. Surface canonical diagnostics
and correction guidance in the selected locale while preserving the rest of the
in-memory draft.

The validation/application boundary must return business outcomes such as
`MISSING_STRUCTURAL_FLOUR` and `INVALID_MASS`; the UI must not duplicate the
domain rules or turn a rejected draft into a silent partial result.

## Acceptance criteria

- [x] A Formula without a positive-mass flour-bearing structural component is
  blocked from normalization with `MISSING_STRUCTURAL_FLOUR`.
- [x] Missing, non-finite, zero, and negative active masses produce
  `INVALID_MASS` on the affected line/component.
- [x] Validation identifies the affected object/path and provides correction
  guidance in the active locale.
- [x] Valid sibling lines and flour components remain visible and unchanged
  after a rejected validation/normalization attempt.
- [x] Correcting the invalid input allows the same draft to normalize without
  reconstructing it.
- [x] The rejection is observable in the Formula workspace and not only in a
  unit-test result.
- [x] Domain/application tests cover both blocking rules and sibling failure
  isolation.

## Artifact sync required

- Application PRD: `none` — hard validation and recovery are already defined.
- Application architecture summary: `none` — no boundary or sequencing change.
- Owning capability node/artifacts: `none` — implementation follows the
  synchronized node artifacts; update them before closure only if semantics
  change.
- Issue registry: `required`; node `issues:` reference: `required when .okf
  exists` and is maintained by the batch.
- Reason/no-impact decision: specified validation behavior only; no product or
  cross-capability architecture impact.

## Human review gate

After automated checks pass, the user must inspect invalid Formula and invalid
mass states in both locales, including correction copy and preservation of
valid sibling input.

## Human review outcome

The user approved the grouped visual review of Issues 001–003 on 2026-09-07
after the final bilingual workspace, terminology, typography, and contrast
adjustments were inspected.

## Blocked by

- Blocked by `docs/agents/issues/pending/001-basic-formula-workspace.md`

## Artifact anchors

- PRD: business rules 1–2, 7; FR-07; AS-02, AS-03
- Domain model: Formula and FlourSystem invariants; `FormulaValidator`; failure
  behavior for missing flour and invalid mass
- Use cases: `ValidateFormulaForNormalization`, `NormalizeFormula`
- Contract: `MISSING_STRUCTURAL_FLOUR`, `INVALID_MASS`, rejected command envelope

## Acceptance scenarios addressed

- SC-002 — Block Formula without structural flour
- SC-003 — Reject invalid mass and preserve valid siblings

## Verification obligations

- Policy source: `/.okf/project.md`

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
|---|---|---|---|
| `SC-002` | `not-applicable` | `deferred` | `deferred: no frontend integration harness; catalog-only E2E policy` |
| `SC-003` | `not-applicable` | `deferred` | `deferred: no frontend integration harness; catalog-only E2E policy` |

## Implementation record

- Validation and correction behavior is implemented in
  `src/lib/domain/normalization.ts`; the Svelte workspace renders canonical
  codes, paths, and localized resolution guidance without duplicating rules.
- Automated evidence: `npm test` (16 passing tests covering invalid mass,
  missing flour, sibling preservation, and correction), `npm run lint`,
  `npm run typecheck`, and `npm run build`.
- Scenario trace: `SC-002` → missing-flour rejection test and visible
  diagnostic; `SC-003` → invalid mass/object path, unchanged sibling, and
  in-place correction test.
- Frontend integration obligations remain `deferred` under the root
  `when-supported` policy because no integration harness exists yet.
