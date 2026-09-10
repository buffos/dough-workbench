# Issue 029 — Formula counterfactual recomputation

## Issue Metadata

- ID: 029
- Title: Formula counterfactual recomputation
- Category: feature
- State: done
- Owning capability: Interactive Formula Exploration
- Owning capability node: .okf/capabilities/interactive-exploration.md
- Artifact root: docs/architecture/interactive-exploration
- Delivery order: 2 of 5
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
- .okf/capabilities/formula-analysis-workspace.md
- .okf/capabilities/shared/trust-and-provenance.md
- .okf/project.md

## What to build

Implement Formula-owned counterfactual patches on top of issue 028. Support
the canonical Formula input paths needed by the existing workspace, including
mass, role, functional composition state/value, and availability overrides.
Apply patches to a copy, run the existing normalization and analysis pipeline,
and return a baseline/counterfactual pair with the Formula paths that changed.

Formula-only exploration must preserve the baseline Process snapshot and must
retain Unknown values unless a patch explicitly supplies a supported value.
Hard-invalid Formula changes are rejected with the original baseline still
usable.

## Acceptance criteria

- [x] A valid Formula-owned patch can change a supported Formula mass, role,
  functional composition value/state, or availability input using the typed
  canonical path contract.
- [x] Patches are applied in order to a copy and reuse the existing Formula
  normalization, composition, intrinsic, effective, and classification
  application path; the original Formula and Process remain unchanged.
- [x] A Formula-only counterfactual preserves the baseline Process revision and
  Process snapshot exactly, while the returned result carries the new Formula
  revision/state.
- [x] The result contains both the immutable baseline reference and the
  counterfactual analysis, including the ordered changed Formula paths.
- [x] An explicit patch can turn a supported Unknown value into a known value,
  but an unrelated Formula patch never converts Unknown into zero or another
  implicit default.
- [x] Negative/invalid mass, removal of the required structural flour, invalid
  state/value combinations, and unsupported paths are rejected without
  replacing the baseline result.
- [x] Unit and application tests cover a water-mass or equivalent ingredient
  change, a composition/availability change, Process preservation, Unknown
  preservation, and hard-invalid recovery.

## Artifact sync required

- Application PRD: none; Formula counterfactuals are already in the approved
  Interactive Formula Exploration scope.
- Application architecture summary: none; the existing local deterministic
  analysis pipeline and Formula/Process separation remain unchanged.
- Owning capability node/artifacts: required; retain the issue reference on
  .okf/capabilities/interactive-exploration.md and record implementation
  evidence in the orchestration status during closeout.
- Shared Trust, Provenance, and Uncertainty: no policy change; comparison must
  reuse Unknown-is-not-zero, confidence, coverage, and provenance semantics.
- Issue registry: required; node issues reference: required when .okf exists.
- Reason/no-impact decision: capability-local Formula patch execution over
  existing analysis services; no new product boundary, backend, persistence,
  or topology change.

The application-synthesis gate is current and remains unchanged.

## Blocked by

- None — issue 028 is implemented and archived.

## Functional requirements addressed

The parent PRD has no numbered user stories. This issue addresses functional
requirements 1–5 and 7 and canonical scenarios SC-EX-002, SC-EX-005, and the
Formula portion of SC-EX-006.

## Artifact anchors

- Use cases: ApplyCounterfactualPatch and EvaluateCounterfactual
- Contract: CounterfactualPatch, ExplorationState, and ComparisonResult
- Policies: PatchValidationPolicy, IsolationPolicy, and ComparisonPolicy

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-EX-002 | not-applicable | verified by `src/lib/domain/exploration.test.ts` | deferred: no E2E harness |
| SC-EX-005 | not-applicable | verified by `src/lib/domain/exploration.test.ts` | deferred: no E2E harness |
| SC-EX-006 | not-applicable | verified by `src/lib/domain/exploration.test.ts` | deferred: no E2E harness |

## Delivery evidence

- Implemented Formula-owned mass, role, composition, and availability patches
  with ordered copy-on-write recomputation through the existing normalization,
  intrinsic, effective, and classification pipeline.
- Formula-only scenarios preserve the baseline Process snapshot and retain
  Unknown evidence unless the patch explicitly supplies a value.
- Verification: `npm test`, `npm run lint`, `npm run typecheck`, and
  `git diff --check` passed. Astro build/static-route verification remains
  deferred under the user-managed local preview policy.
