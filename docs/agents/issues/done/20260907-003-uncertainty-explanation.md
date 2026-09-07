## Issue Metadata

- Issue number: `003`
- Owning capability node: `/.okf/capabilities/formula-analysis-workspace/formula-input-normalization.md`
- Artifact root: `docs/architecture/formula-input-normalization/`
- Issue file: `docs/agents/issues/done/20260907-003-uncertainty-explanation.md`
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

Add the uncertainty-aware normalization and explanation surface. Functional
composition fields must use the canonical `Known`/`None`/`Unknown` value-state
shape, retain provenance and numeric confidence/coverage in `[0,1]`, and never
silently substitute zero for unknown data.

When the Formula is structurally valid but incomplete, return a visible partial
outcome: supported calculations remain available, unavailable metrics are
identified, and derived facts are labeled `Calculated` versus `Estimated` or
`Heuristic` according to their semantic class. Add the normalization
explanation view for denominator basis, missing data, provenance, and
limitations.

## Acceptance criteria

- [x] Unknown composition fields remain `unknown` in normalized state and are
  never coerced to numeric zero.
- [x] Explicit `None`, numeric zero, and `Unknown` remain distinguishable in
  state and presentation where the field applies.
- [x] Structurally valid incomplete input returns a `partial` outcome instead
  of being rejected solely for missing composition knowledge.
- [x] Supported outputs remain visible while unavailable outputs and reduced
  coverage/confidence are identified.
- [x] Coverage and confidence use canonical numeric `[0,1]` values; any visual
  bands are presentation-only.
- [x] Denominator and baker's percentages are labeled `Calculated`; estimates
  and heuristic scores are not presented as calculated facts or probabilities.
- [x] The normalization explanation is reachable from the Formula workspace
  and shows included/excluded denominator components, unknown fields,
  provenance, and limitations.
- [x] Domain/application tests cover unknown preservation, partial outcomes,
  semantic class, and deterministic explanation data.

## Artifact sync required

- Application PRD: `none` — partial analysis, uncertainty, and semantic classes
  are already product requirements.
- Application architecture summary: `none` — this implements the existing
  trust/uncertainty boundary.
- Owning capability node/artifacts: `none` — no contract or domain drift is
  expected; any change to value-state semantics must update the reference set
  before closure.
- Issue registry: `required`; node `issues:` reference: `required when .okf
  exists` and is maintained by the batch.
- Reason/no-impact decision: behavior is fully specified and capability-local;
  no application-synthesis refresh is required.

## Human review gate

After automated checks pass, the user must inspect partial-result cards,
unknown/none/zero labels, semantic-class labels, provenance/coverage details,
and normalization explanations in both locales.

## Human review outcome

The user approved the grouped visual review of Issues 001–003 on 2026-09-07
after the final bilingual workspace, terminology, typography, and contrast
adjustments were inspected.

## Blocked by

- Blocked by `docs/agents/issues/pending/002-validation-recovery.md`

## Artifact anchors

- PRD: business rules 10–12; FR-08; AS-04, AS-08, AS-09
- Domain model: `ValueState<T>`, `FunctionalComposition`, `Confidence`,
  `Coverage`, `PartialAnalysisPolicy`, and normalization handoff
- Use cases: `NormalizeFormula`, `GetNormalizationExplanation`,
  `GetFormulaReadiness`
- Contract: value-state shape, numeric coverage/confidence, partial command
  outcome, diagnostic envelope

## Acceptance scenarios addressed

- SC-004 — Preserve Unknown and return partial analysis
- SC-005 — Preserve calculated semantics and provenance
- SC-014 — Explain normalization and limitations

## Verification obligations

- Policy source: `/.okf/project.md`

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
|---|---|---|---|
| `SC-004` | `not-applicable` | `deferred` | `deferred: no frontend integration harness; catalog-only E2E policy` |
| `SC-005` | `not-applicable` | `deferred` | `deferred: no frontend integration harness; catalog-only E2E policy` |
| `SC-014` | `not-applicable` | `deferred` | `deferred: no frontend integration harness; catalog-only E2E policy` |

## Implementation record

- Value-state normalization, partial outcome policy, numeric coverage/confidence,
  semantic classes, provenance, and explanation data are implemented in
  `src/lib/domain/normalization.ts` and rendered by
  `src/components/FormulaWorkspace.svelte`.
- Automated evidence: `npm test` (16 passing tests covering Unknown/None/
  known-zero distinction, partial result, semantic class, provenance,
  explanation, and confidence tests), `npm run lint`, `npm run typecheck`,
  and `npm run build`.
- Scenario trace: `SC-004` → preserved value states, unavailable metric, and
  reduced coverage/confidence; `SC-005` → calculated/provenance assertions;
  `SC-014` → explanation card with denominator basis, exclusions, unknowns,
  limitations, and source.
- Frontend integration obligations remain `deferred` under the root
  `when-supported` policy because no integration harness exists yet.
