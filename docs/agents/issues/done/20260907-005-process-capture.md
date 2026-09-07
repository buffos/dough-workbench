## Issue Metadata

- Issue number: `005`
- Owning capability node: `/.okf/capabilities/formula-analysis-workspace/formula-input-normalization.md`
- Artifact root: `docs/architecture/formula-input-normalization/`
- Issue file: `docs/agents/issues/done/20260907-005-process-capture.md`
- Category: `feature`
- Execution type: `AFK`
- Review gate: `visual-review`
- Suggested state: `done`

## Parent Artifacts

- `docs/architecture/formula-input-normalization/prd.md`
- `docs/architecture/formula-input-normalization/domain-glossary.md`
- `docs/architecture/formula-input-normalization/canonical-domain-model.md`
- `docs/architecture/formula-input-normalization/canonical-use-cases.md`
- `docs/architecture/formula-input-normalization/canonical-api-cli-contract.md`
- `docs/architecture/formula-input-normalization/acceptance-scenarios.md`
- `docs/architecture/formula-input-normalization/readiness-review.md`

## What to build

Add the separate Process capture workflow using the versioned V1 vocabulary
(`process-input-v0.2`):
`mixing`, `ingredientAddition`, `aeration`, `fermentation`, `lamination`,
`thermalProcess`, and `geometry`. Preserve ordered AdditionSteps, Formula line
references, canonical seconds/degrees Celsius units, normalized `[0,1]` fields,
and `Known`/`None`/`Unknown` values. Algorithm-facing categorical fields use
controlled options, measured fields use typed numeric controls, lamination fat
uses a Formula-line reference, and AdditionStep actions use the controlled
action vocabulary. No arbitrary Process text is accepted as a model input.

The Process must be independently editable and serializable from Formula
composition. Incomplete Process data is retained as honest input and does not
force defaults or block composition-only work.

## Acceptance criteria

- [x] The workspace exposes the V1 Process sections and field paths from the
  canonical domain model, with the specified units and ranges.
- [x] AdditionSteps preserve unique sequence order and Formula line references.
- [x] Process fields visibly distinguish `Known`, explicit `None`, and
  `Unknown`.
- [x] An incomplete Process can be retained without fabricating zero/default
  values.
- [x] Process edits update Process state independently from Formula masses,
  roles, overrides, denominator, and baker's percentages.
- [x] The Process timeline is visible in the product surface, not only in an
  application snapshot.
- [x] Categorical Process fields use the versioned controlled vocabulary;
  measured fields use numeric inputs with declared units/ranges.
- [x] `laminationFat` selects a Formula ingredient line and AdditionStep action
  uses a controlled option instead of free text.
- [x] Tests cover ordered additions, tri-state values, field ranges, units, and
  independent Process revision behavior.

## Artifact sync required

- Application PRD: `none` — the Process control refinement remains within the
  existing product scope and Formula/Process boundary.
- Application architecture summary: `none` — this implements the existing
  Formula/Process boundary and sequence.
- Owning capability node/artifacts: `required` — the Process vocabulary was
  versioned to `process-input-v0.2` and synchronized in the canonical domain
  model, glossary, node PRD, contract, requirements-gap analysis, and
  readiness review.
- Issue registry: `required`; node `issues:` reference: `required when .okf
  exists` and is maintained by the batch.
- Reason/no-impact decision: Process capture is a specified capability-local
  slice; no product or cross-capability architecture change.

## Human review gate

After automated checks pass, the user must inspect the Process editor/timeline,
ordered additions, units, and Known/None/Unknown states in both locales.

## Blocked by

- —

## Artifact anchors

- PRD: FR-06, business rule 14; AS-08, AS-09
- Domain model: Process aggregate, V1 Process field vocabulary, Process
  invariants, Process lifecycle
- Use cases: `RecordProcessForFormula`, `NormalizeProcess`,
  `GetProcessTimeline`
- Contract: Process snapshot, tri-state fields, Process readiness, seconds and
  degrees Celsius units

## Acceptance scenarios addressed

- SC-009 — Record Process with ordered tri-state fields

## Verification obligations

- Policy source: `/.okf/project.md`

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
|---|---|---|---|
| `SC-009` | `not-applicable` | `deferred: no frontend integration harness; runtime smoke check completed` | `deferred: no E2E harness; catalog-only policy` |

## Implementation record

- The independent V1 Process draft, canonical field descriptors, tri-state
  normalization, range/sequence/reference validation, readiness, coverage, and
  revision semantics are implemented in `src/lib/domain/process.ts`.
- The Process editor no longer exposes algorithm-facing free text: categorical
  values are dropdowns, numeric values remain unit-bound inputs, lamination fat
  selects a Formula line, and AdditionStep actions use a controlled vocabulary.
  The current domain version is `process-input-v0.2`.
- Process persistence is independent from Formula persistence in
  `src/lib/state/workspace.ts`, with application adapters in
  `src/lib/application/formula-workspace.ts`.
- The workspace renders all seven Process sections, units, tri-state controls,
  ordered AdditionSteps with Formula line checkboxes, and a visible timeline in
  both locales in `src/components/FormulaWorkspace.svelte`.
- The Process UI explains the Ingredient addition timeline inline and on the
  bilingual terminology page. The fermentation labels distinguish bulk
  fermentation (the first fermentation while the dough remains one mass) from
  final proof; bulk temperature is the maintained phase temperature and bulk
  expansion is a relative volume target.
- Automated evidence: `npm test` (23 passing tests, including tri-state
  preservation, ordered additions, ranges, units, stale references, and
  independent Process serialization/revision), `npm run lint`,
  `npm run typecheck`, `npm run build`, `npm run check:static`, and
  `npm run verify` all pass.
- Scenario trace: `SC-009` → Process normalizer and tests preserve Known/None/
  Unknown values, sort AdditionSteps deterministically, retain Formula line
  references, and keep Process revision independent; runtime smoke check
  confirmed the Greek Process surface renders.
- Frontend integration remains deferred under the root `when-supported` policy
  because no integration harness exists. The user approved the grouped
  bilingual visual review on 2026-09-07.
