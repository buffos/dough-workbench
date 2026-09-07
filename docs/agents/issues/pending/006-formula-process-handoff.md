## Issue Metadata

- Issue number: `006`
- Owning capability node: `/.okf/capabilities/formula-analysis-workspace/formula-input-normalization.md`
- Artifact root: `docs/architecture/formula-input-normalization/`
- Issue file: `docs/agents/issues/pending/006-formula-process-handoff.md`
- Category: `feature`
- Execution type: `AFK`
- Review gate: `visual-review`
- Suggested state: `ready-for-agent`

## Parent Artifacts

- `docs/architecture/formula-input-normalization/prd.md`
- `docs/architecture/formula-input-normalization/canonical-domain-model.md`
- `docs/architecture/formula-input-normalization/canonical-use-cases.md`
- `docs/architecture/formula-input-normalization/canonical-api-cli-contract.md`
- `docs/architecture/formula-input-normalization/acceptance-scenarios.md`
- `docs/architecture/formula-input-normalization/readiness-review.md`

## What to build

Implement the coordinated Formula/Process analysis-input handoff. Assemble a
versioned `FormulaProcessReference` from coherent Formula and Process snapshots
without merging their ownership. Apply the PartialAnalysisPolicy so incomplete
Process data limits only affected process-dependent outputs while composition
and intrinsic paths remain available.

Expose visible handoff/readiness diagnostics for stale revisions and unresolved
Formula-line references. Preserve command identity/revision semantics so replay
does not duplicate lines, components, or AdditionSteps and stale input cannot
silently overwrite newer state.

## Acceptance criteria

- [ ] A structurally valid Formula with incomplete Process produces a visible
  partial analysis-input outcome with supported composition outputs intact.
- [ ] Process-dependent limitations identify reduced coverage/confidence and
  preserve unknown Process fields.
- [ ] Formula edits do not rewrite Process state; Process edits do not rewrite
  Formula composition, denominator, percentages, or overrides.
- [ ] A missing Formula-line reference or incompatible Formula/Process revision
  rejects the paired handoff with `REFERENCE_MISMATCH` or `STALE_REVISION`.
- [ ] The last valid Formula and Process drafts remain recoverable after a
  rejected handoff.
- [ ] Replaying a command identity does not duplicate a line, component, or
  AdditionStep; stale revisions do not silently overwrite newer state.
- [ ] The workspace visibly shows complete, partial, rejected, and conflict
  handoff outcomes.
- [ ] Tests cover coordinated snapshot assembly, partial policy, isolation,
  reference conflicts, and idempotent replay.

## Artifact sync required

- Application PRD: `none` — the handoff and partial-analysis behavior are
  already part of product truth.
- Application architecture summary: `none` — this realizes the existing
  Input -> Process/Effective Behavior boundary without changing sequencing.
- Owning capability node/artifacts: `none` — use-case and contract semantics
  are stable; update them before closure only if implementation reveals drift.
- Issue registry: `required`; node `issues:` reference: `required when .okf
  exists` and is maintained by the batch.
- Reason/no-impact decision: coordinated application behavior is fully
  specified and capability-local; no cross-capability architecture change.

## Human review gate

After automated checks pass, the user must inspect complete/partial/conflict
handoff states, Formula/Process isolation after edits, and visible recovery
guidance in both locales.

## Blocked by

- Blocked by `docs/agents/issues/pending/004-roles-and-overrides.md`
- Blocked by `docs/agents/issues/pending/005-process-capture.md`

## Artifact anchors

- PRD: business rules 10–14; FR-06–FR-09; AS-06, AS-08, AS-09
- Domain model: `FormulaProcessReference`, `AnalysisInputAssembler`,
  `PartialAnalysisPolicy`, handoff invariants, failure behavior
- Use cases: `PrepareAnalysisInput`, `GetAnalysisHandoffSummary`, command
  idempotency/revision expectations
- Contract: analysis input snapshot, `partial`/`conflict` outcomes,
  `REFERENCE_MISMATCH`, `STALE_REVISION`

## Acceptance scenarios addressed

- SC-010 — Continue composition analysis with incomplete Process
- SC-011 — Keep Formula and Process changes independent
- SC-012 — Reject an incoherent paired handoff
- SC-013 — Replay a retry-sensitive command safely

## Verification obligations

- Policy source: `/.okf/project.md`

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
|---|---|---|---|
| `SC-010` | `not-applicable` | `planned` | `deferred: no E2E harness; catalog-only policy` |
| `SC-011` | `not-applicable` | `planned` | `deferred: no E2E harness; catalog-only policy` |
| `SC-012` | `not-applicable` | `planned` | `deferred: no E2E harness; catalog-only policy` |
| `SC-013` | `not-applicable` | `planned` | `deferred: no E2E harness; catalog-only policy` |
