## Issue Metadata

- Issue number: `006`
- Owning capability node: `/.okf/capabilities/formula-analysis-workspace/formula-input-normalization.md`
- Artifact root: `docs/architecture/formula-input-normalization/`
- Issue file: `docs/agents/issues/pending/006-formula-process-handoff.md`
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

- [x] A structurally valid Formula with incomplete Process produces a visible
  partial analysis-input outcome with supported composition outputs intact.
- [x] Process-dependent limitations identify reduced coverage/confidence and
  preserve unknown Process fields.
- [x] Formula edits do not rewrite Process state; Process edits do not rewrite
  Formula composition, denominator, percentages, or overrides.
- [x] A missing Formula-line reference or incompatible Formula/Process revision
  rejects the paired handoff with `REFERENCE_MISMATCH` or `STALE_REVISION`.
- [x] The last valid Formula and Process drafts remain recoverable after a
  rejected handoff.
- [x] Replaying a command identity does not duplicate a line, component, or
  AdditionStep; stale revisions do not silently overwrite newer state.
- [x] The workspace visibly shows complete, partial, rejected, and conflict
  handoff outcomes.
- [x] Tests cover coordinated snapshot assembly, partial policy, isolation,
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

Completed on 2026-09-08: the user accepted the bilingual visual review of the
complete/partial/conflict analysis states, Formula/Process isolation after
edits, recovery guidance, and the removal of technical debug metadata from the
primary view.

## Blocked by

- —

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
| `SC-010` | `not-applicable` | `deferred: no frontend integration harness; visual review accepted 2026-09-08` | `deferred: no E2E harness; catalog-only policy` |
| `SC-011` | `not-applicable` | `deferred: no frontend integration harness; visual review accepted 2026-09-08` | `deferred: no E2E harness; catalog-only policy` |
| `SC-012` | `not-applicable` | `deferred: no frontend integration harness; visual review accepted 2026-09-08` | `deferred: no E2E harness; catalog-only policy` |
| `SC-013` | `not-applicable` | `deferred: no frontend integration harness; visual review accepted 2026-09-08` | `deferred: no E2E harness; catalog-only policy` |

## Implementation record

- The versioned `FormulaProcessReference`, `PartialAnalysisPolicy`, and
  `AnalysisInputAssembler` behavior are implemented in
  `src/lib/domain/handoff.ts`. The service normalizes Formula and Process
  separately, preserves their revisions and ownership, carries coverage and
  confidence independently, and returns complete, partial, rejected, or
  conflict outcomes.
- The application adapter exposes `PrepareAnalysisInput` through
  `src/lib/application/formula-workspace.ts`. A local command ledger in
  `src/lib/application/command-ledger.ts` makes replayed Formula-line,
  Flour-component, AdditionStep, and handoff commands idempotent within the
  active browser session; stale or payload-changing command identities return
  conflict without applying a mutation.
- `src/components/FormulaWorkspace.svelte` now shows a bilingual analysis
  readiness panel. Formula and Process remain separate internally while the
  user sees plain-language availability, confidence, limitation explanations,
  conflict guidance, and recovery guidance for the last valid pair. Technical
  revisions, model versions, diagnostic codes, and internal paths are not part
  of the primary user-facing view. Formula and Process drafts remain
  independently editable and rejected handoffs do not overwrite either draft.
- Automated evidence: `npm run verify` passes with 36 tests, lint,
  typecheck, static build, and route checks. `git diff --check` and OKF
  validation also pass.
- Human review: the user accepted the bilingual visual review on 2026-09-08,
  including complete/partial/conflict states, Formula/Process isolation,
  recovery guidance, and the plain-language readiness copy.
- Scenario trace: `SC-010` → partial policy and preserved Process unknowns in
  `src/lib/domain/handoff.test.ts`; `SC-011` → independent revision/data
  assertions in the same suite; `SC-012` → reference and stale-revision
  conflict tests; `SC-013` → replay, stale, and command-payload conflict tests
  in `src/lib/application/command-ledger.test.ts`.
- End-to-end remains deferred under the root `catalog-only` policy. Frontend
  integration remains deferred because no integration harness exists; the
  bilingual visual-review gate is complete.
