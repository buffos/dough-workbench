## Issue Metadata

- Issue number: `001`
- Owning capability node: `/.okf/capabilities/formula-analysis-workspace/formula-input-normalization.md`
- Artifact root: `docs/architecture/formula-input-normalization/`
- Issue file: `docs/agents/issues/done/20260907-001-basic-formula-workspace.md`
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
- `docs/architecture/application-architecture-summary.md`
- `docs/agents/adr/0006-static-frontend-platform.md`

## What to build

Build the first user-visible Formula workspace slice on the Astro + TypeScript
+ Svelte + GitHub Pages baseline. The slice must expose bilingual `/en/` and
`/el/` routes, keep the active Formula draft in browser memory, accept grams,
and let a Formula Explorer enter a minimal flour system and ingredient lines.

Normalize the valid draft through the canonical domain/application boundary so
the workspace visibly shows the positive structural flour denominator,
baker's percentages, and the versioned `formula-normalization-v1` flour-blend
policy. Keep all canonical IDs, roles, values, and derived data language-neutral
while presenting equivalent English and Greek labels.

Use a minimal versioned catalog adapter/fixture for this slice; catalog breadth
remains owned by the Ingredient and Prototype Knowledge capability.

## Acceptance criteria

- [x] The static application builds with the selected Astro/Svelte baseline and
  direct `/en/` and `/el/` entries are reachable under a GitHub Pages base path.
- [x] The Formula workspace can create an in-memory draft, add at least one
  positive structural flour component, add ingredient lines, and accept mass in
  grams only.
- [x] Normalization derives the denominator only from positive flour-bearing
  structural components and derives every baker's percentage from that value.
- [x] A complete flour blend uses the inclusive
  `formula-normalization-v1` range `[99.99%, 100.01%]` and carries the policy
  identifier in the normalized result.
- [x] The normalized result is visible in the workspace, not only available
  through a hidden domain function or test fixture.
- [x] Switching between `/en/` and `/el/` preserves the canonical draft state
  and displays equivalent baseline labels.
- [x] Unit/domain tests cover the deterministic valid path; a static build
  check covers the route/base-path requirement.

## Artifact sync required

- Application PRD: `none` — this implements already-specified product behavior.
- Application architecture summary: `none` — it follows the recorded Astro +
  Svelte + GitHub Pages baseline without changing boundaries or sequencing.
- Owning capability node/artifacts: `none` — the current node references and
  exact artifacts already cover the slice; any semantic drift must be resolved
  in the reference set before closure.
- Issue registry: `required`; node `issues:` reference: `required when .okf
  exists` and is updated by this issue batch.
- Reason/no-impact decision: implementation-only delivery of specified
  Formula Input behavior; no product or cross-capability architecture truth
  changes.

## Human review gate

After automated checks pass, the user must inspect the rendered Formula
workspace in both `/en/` and `/el/`, including route entry, language switch,
mass entry, denominator, baker's percentages, and visible normalized output.

## Human review outcome

The user approved the grouped visual review of Issues 001–003 on 2026-09-07
after the final bilingual workspace, terminology, typography, and contrast
adjustments were inspected.

## Blocked by

`None - can start immediately`

## Artifact anchors

- PRD: FR-01, FR-02, FR-05, FR-10; AS-01, AS-07, AS-10
- Domain model: Formula and FlourSystem invariants; V1 normalization tolerance
- Use cases: `StartFormulaDraft`, `AddFlourComponentToFormula`,
  `AddIngredientLineToFormula`, `NormalizeFormula`
- Contract: mass shape, Formula snapshot, structural denominator,
  `formula-normalization-v1`

## Acceptance scenarios addressed

- SC-001 — Normalize a valid multi-flour Formula
- SC-008 — Enforce grams-only input
- SC-015 — Preserve bilingual parity and reachability (baseline route/state
  exposure)
- SC-016 — Enforce the versioned flour-blend tolerance

## Verification obligations

- Policy source: `/.okf/project.md`

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
|---|---|---|---|
| `SC-001` | `not-applicable` | `deferred` | `deferred: no frontend integration harness; catalog-only E2E policy` |
| `SC-008` | `not-applicable` | `deferred` | `deferred: no frontend integration harness; catalog-only E2E policy` |
| `SC-015` | `not-applicable` | `deferred` | `deferred: no frontend integration harness; catalog-only E2E policy` |
| `SC-016` | `not-applicable` | `deferred` | `deferred: no frontend integration harness; catalog-only E2E policy` |

## Implementation record

- Domain/application implementation: `src/lib/domain/types.ts`,
  `src/lib/domain/normalization.ts`, and `src/lib/state/workspace.ts`.
- Bilingual Astro/Svelte surface: `src/pages/en/index.astro`,
  `src/pages/el/index.astro`, and `src/components/FormulaWorkspace.svelte`.
- Automated evidence: `npm test` (16 passing tests), `npm run lint`,
  `npm run typecheck`, `npm run build`, `npm run check:static`, and a successful
  `BASE_PATH=/website-doughs npm run build`.
- Scenario trace: `SC-001` → denominator/blend/result tests and visible cards;
  `SC-008` → grams-only domain validation and gram inputs; `SC-015` → explicit
  locale routes plus session draft handoff; `SC-016` → inclusive tolerance test.
- Frontend integration obligations remain `deferred` under the root
  `when-supported` policy because no integration harness exists yet.
