## Issue Metadata

- Issue number: `005`
- Owning capability node: `/.okf/capabilities/formula-analysis-workspace/formula-input-normalization.md`
- Artifact root: `docs/architecture/formula-input-normalization/`
- Issue file: `docs/agents/issues/pending/005-process-capture.md`
- Category: `feature`
- Execution type: `AFK`
- Review gate: `visual-review`
- Suggested state: `ready-for-agent`

## Parent Artifacts

- `docs/architecture/formula-input-normalization/prd.md`
- `docs/architecture/formula-input-normalization/domain-glossary.md`
- `docs/architecture/formula-input-normalization/canonical-domain-model.md`
- `docs/architecture/formula-input-normalization/canonical-use-cases.md`
- `docs/architecture/formula-input-normalization/canonical-api-cli-contract.md`
- `docs/architecture/formula-input-normalization/acceptance-scenarios.md`
- `docs/architecture/formula-input-normalization/readiness-review.md`

## What to build

Add the separate Process capture workflow using the versioned V1 vocabulary:
`mixing`, `ingredientAddition`, `aeration`, `fermentation`, `lamination`,
`thermalProcess`, and `geometry`. Preserve ordered AdditionSteps, Formula line
references, canonical seconds/degrees Celsius units, normalized `[0,1]` fields,
and `Known`/`None`/`Unknown` values.

The Process must be independently editable and serializable from Formula
composition. Incomplete Process data is retained as honest input and does not
force defaults or block composition-only work.

## Acceptance criteria

- [ ] The workspace exposes the V1 Process sections and field paths from the
  canonical domain model, with the specified units and ranges.
- [ ] AdditionSteps preserve unique sequence order and Formula line references.
- [ ] Process fields visibly distinguish `Known`, explicit `None`, and
  `Unknown`.
- [ ] An incomplete Process can be retained without fabricating zero/default
  values.
- [ ] Process edits update Process state independently from Formula masses,
  roles, overrides, denominator, and baker's percentages.
- [ ] The Process timeline is visible in the product surface, not only in an
  application snapshot.
- [ ] Tests cover ordered additions, tri-state values, field ranges, units, and
  independent Process revision behavior.

## Artifact sync required

- Application PRD: `none` — the V1 Process vocabulary and policy are already
  synchronized in the node artifacts.
- Application architecture summary: `none` — this implements the existing
  Formula/Process boundary and sequence.
- Owning capability node/artifacts: `none` — no semantic drift expected; any
  new Process field requires a versioned reference-artifact update.
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
| `SC-009` | `not-applicable` | `planned` | `deferred: no E2E harness; catalog-only policy` |
