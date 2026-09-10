# Issue 028 — Counterfactual baseline and patch contract

## Issue Metadata

- ID: 028
- Title: Counterfactual baseline and patch contract
- Category: feature
- State: done
- Owning capability: Interactive Formula Exploration
- Owning capability node: .okf/capabilities/interactive-exploration.md
- Artifact root: docs/architecture/interactive-exploration
- Delivery order: 1 of 5
- Execution type: AFK
- Review gate: none
- Review mode: no individual human review; grouped review belongs to issue 032

## Parent Artifacts

- docs/architecture/interactive-exploration/prd.md
- docs/architecture/interactive-exploration/domain-glossary.md
- docs/architecture/interactive-exploration/canonical-domain-model.md
- docs/architecture/interactive-exploration/canonical-use-cases.md
- docs/architecture/interactive-exploration/canonical-api-cli-contract.md
- docs/architecture/interactive-exploration/acceptance-scenarios.md
- docs/architecture/interactive-exploration/readiness-review.md
- .okf/capabilities/interactive-exploration.md
- .okf/capabilities/shared/trust-and-provenance.md
- .okf/project.md

## What to build

Introduce the browser/application boundary for a what-if exploration. Starting
from the current Formula and Process analysis, capture an immutable baseline
with its revisions, analysis snapshot, catalog/model versions, and identity.
Create an empty counterfactual scenario and a typed patch contract with one
owner boundary: Formula or Process.

Validate canonical paths, value types, ranges, expected revisions, and patch
ownership before a patch enters the scenario. Expose the initial exploration
state through the workspace so the later Formula and Process slices have a
stable starting point. This issue does not yet evaluate a changed Formula or
Process.

## Acceptance criteria

- [x] Starting from an available completed or partial analysis creates an
  ExplorationBaseline containing the Formula and Process revisions, analysis
  snapshot, catalog/model versions, and stable baseline identity.
- [x] A new scenario is anchored to that baseline with a stable scenario ID,
  revision, editing status, and an empty ordered patch list.
- [x] CounterfactualPatch records a stable patch ID, exactly one owner
  (Formula or Process), canonical path, before state, and proposed after state.
- [x] Patch validation rejects unknown paths, wrong value types, invalid ranges,
  ownership mismatches, or stale expected revisions without changing the
  baseline or scenario.
- [x] The baseline is protected by copy/immutability tests: creating a
  scenario or attempting a rejected patch cannot mutate either source
  Formula/Process input or the captured baseline.
- [x] The application boundary and a minimal workspace state expose whether
  exploration is available, editing, or blocked, without introducing a
  backend, persistence, or recipe-generation path.
- [x] Unit and application tests cover baseline capture, empty scenario state,
  valid patch construction, and rejected patch recovery.

## Artifact sync required

- Application PRD: none; this implements the already-specified counterfactual
  scope and introduces no new actor, workflow, or MVP boundary.
- Application architecture summary: none; the browser-only Svelte/application/
  domain boundary and in-memory state policy remain unchanged.
- Owning capability node/artifacts: required; record the issue reference on
  .okf/capabilities/interactive-exploration.md and update its orchestration
  status during closeout.
- Shared Trust, Provenance, and Uncertainty: no policy change; reuse the
  existing revision, model-version, provenance, and Unknown-is-not-zero rules.
- Issue registry: required; node issues reference: required when .okf exists.
- Reason/no-impact decision: capability-local contract and initial workspace
  state; no topology, product scope, shared policy, backend, or persistence
  change.

The application-synthesis gate is current and remains unchanged.

## Blocked by

None — can start immediately.

## Functional requirements addressed

The parent PRD has no numbered user stories. This issue addresses functional
requirements 1 and 2 and canonical scenario SC-EX-001, plus the validation
portion of SC-EX-006.

## Artifact anchors

- Use cases: StartExploration and GetExplorationState
- Contract: CounterfactualPatch and ExplorationState
- Policies: PatchValidationPolicy and IsolationPolicy

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-EX-001 | not-applicable | verified by `src/lib/domain/exploration.test.ts` | deferred: no E2E harness |
| SC-EX-006 | not-applicable | verified by `src/lib/domain/exploration.test.ts` | deferred: no E2E harness |

## Delivery evidence

- Implemented the immutable baseline, ordered scenario shell, typed Formula/
  Process ownership contract, canonical path validation, and copy-on-write
  isolation in `src/lib/domain/exploration.ts`.
- Added application-boundary adapters in
  `src/lib/application/formula-workspace.ts`.
- Verification: `npm test`, `npm run lint`, `npm run typecheck`, and
  `git diff --check` passed. Astro build/static-route verification remains
  deferred under the user-managed local preview policy.
