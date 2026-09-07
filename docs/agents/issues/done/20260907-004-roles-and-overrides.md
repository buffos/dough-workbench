## Issue Metadata

- Issue number: `004`
- Owning capability node: `/.okf/capabilities/formula-analysis-workspace/formula-input-normalization.md`
- Artifact root: `docs/architecture/formula-input-normalization/`
- Issue file: `docs/agents/issues/done/20260907-004-roles-and-overrides.md`
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

Add role-aware ingredient lines and the named-ingredient-to-functional-
composition boundary. Provide the canonical roles, a minimal versioned catalog
adapter, custom functional ingredients, and Formula-line-local composition and
availability overrides. Resolve catalog definitions into functional composition
without allowing Formula edits to mutate the shared catalog or sibling lines.

Expose role participation in the normalized workspace: `ContinuousPhase` may
participate in effective continuous-phase metrics, while `Inclusion`,
`SurfaceTreatment`, `Filling`, `Topping`, and `Other` remain separate. Role
labels must never be rendered as product classification.

## Acceptance criteria

- [x] Ingredient lines expose all canonical roles and retain the selected role
  through normalization.
- [x] A named catalog Ingredient resolves through a versioned functional
  composition reference before downstream analysis.
- [x] A custom functional Ingredient can be supplied locally with provenance
  and numeric confidence without being inserted into the shared catalog.
- [x] Composition and availability overrides apply only to their Formula line
  and do not mutate the catalog or another line using the same Ingredient.
- [x] `ContinuousPhase` and `Inclusion` produce visibly distinct
  participation explanations; the remaining non-phase roles stay separate.
- [x] Catalog definitions are read-only from this workflow.
- [x] The normalized explanation shows role, source, override, and confidence
  information in the Formula workspace.
- [x] Tests cover functional resolution, role participation, custom data, and
  override isolation.

## Artifact sync required

- Application PRD: `none` — roles, catalog immutability, custom ingredients,
  and overrides are already specified.
- Application architecture summary: `none` — the issue consumes the existing
  versioned static catalog boundary and does not change capability sequencing.
- Owning capability node/artifacts: `none` — catalog breadth remains owned by
  Ingredient and Prototype Knowledge; no node semantics change is expected.
- Issue registry: `required`; node `issues:` reference: `required when .okf
  exists` and is maintained by the batch.
- Reason/no-impact decision: minimal adapter/fixture behavior is part of this
  vertical slice; full catalog ownership remains outside it.

## Human review gate

After automated checks pass, the user must inspect role selection, catalog and
custom ingredient flows, override indicators, and participation explanations
in both locales.

## Blocked by

- —

## Artifact anchors

- PRD: business rules 6–10; FR-03, FR-04, FR-09; AS-05, AS-06
- Domain model: IngredientLine, FunctionalComposition, CompositionOverride,
  AvailabilityOverride, RoleParticipationPolicy, Override Isolation Policy
- Use cases: `AddIngredientLineToFormula`, `ApplyLocalCompositionOverride`,
  `ApplyLocalAvailabilityOverride`
- Contract: Ingredient reference, IngredientLine snapshot, override shapes,
  role enum, catalog immutability

## Acceptance scenarios addressed

- SC-006 — Apply role participation without product classification
- SC-007 — Isolate custom functional data and local overrides
- SC-014 — Explain normalization and limitations

## Verification obligations

- Policy source: `/.okf/project.md`

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
|---|---|---|---|
| `SC-006` | `not-applicable` | `deferred: no frontend integration harness; runtime smoke check completed` | `deferred: no E2E harness; catalog-only policy` |
| `SC-007` | `not-applicable` | `deferred: no frontend integration harness; runtime smoke check completed` | `deferred: no E2E harness; catalog-only policy` |
| `SC-014` | `not-applicable` | `deferred: no frontend integration harness; runtime smoke check completed` | `deferred: no E2E harness; catalog-only policy` |

## Implementation record

- Role-aware line metadata, versioned catalog references, custom functional
  definitions, local composition/availability overrides, provenance, numeric
  confidence, and participation metadata are implemented in
  `src/lib/domain/types.ts` and `src/lib/domain/normalization.ts`.
- The Formula workspace renders source/version, confidence, override markers,
  role participation, and bilingual explanation details in
  `src/components/FormulaWorkspace.svelte`.
- Automated evidence: `npm test` (23 passing tests, including catalog
  resolution, role participation, custom data, and override isolation),
  `npm run lint`, `npm run typecheck`, `npm run build`, `npm run check:static`,
  and `npm run verify` all pass.
- Scenario trace: `SC-006` → normalized participation metadata and bilingual
  role explanation; `SC-007` → line-local override/custom-source tests and
  immutable catalog fixture behavior; `SC-014` → explanation source, override,
  confidence, and limitation surface.
- Frontend integration remains deferred under the root `when-supported` policy
  because no integration harness exists; the local Greek runtime was smoke
  checked. The user approved the grouped bilingual visual review on
  2026-09-07.
