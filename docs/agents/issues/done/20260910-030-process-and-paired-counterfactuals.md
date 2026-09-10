# Issue 030 — Process and paired counterfactuals

## Issue Metadata

- ID: 030
- Title: Process and paired counterfactuals
- Category: feature
- State: done
- Owning capability: Interactive Formula Exploration
- Owning capability node: .okf/capabilities/interactive-exploration.md
- Artifact root: docs/architecture/interactive-exploration
- Delivery order: 3 of 5
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
- .okf/capabilities/formula-analysis-workspace/process-effective-behavior.md
- .okf/capabilities/shared/trust-and-provenance.md
- .okf/project.md

## What to build

Add Process-owned patches and paired Formula + Process scenarios on top of the
shared counterfactual contract. Support the typed Process paths already
declared by the Process model, including mixing/aeration, ingredient addition,
fermentation, lamination, thermal, and geometry inputs.

Recompute through the existing Process/effective/classification path while
keeping intrinsic composition results independent. When Formula and Process
patches are combined, preserve their owner boundary and ordered patch list so
the comparison can explain which effects came from which side.

## Acceptance criteria

- [x] A valid Process-owned patch can change a supported typed Process value,
  including a bulk-temperature or equivalent process field, without changing
  the baseline Formula snapshot.
- [x] Process-only evaluation preserves composition and intrinsic metric values
  and their evidence; only process-sensitive outputs are allowed to change.
- [x] Process patches use the existing Process field descriptors and preserve
  explicit Known, None, and Unknown semantics.
- [x] Formula and Process patches can be composed in order into one scenario;
  every patch retains its owner boundary and canonical path.
- [x] Process line references, typed values, and hard-invalid Process changes
  are validated through the existing Process normalization boundary, with no
  silent fallback to a different line or default.
- [x] The returned comparison carries Formula and Process revisions separately
  and is deterministic for the same baseline, patches, and model versions.
- [x] Unit and application tests cover Process-only temperature behavior,
  intrinsic invariance, paired Formula + Process patches, Unknown handling,
  and invalid Process recovery.

## Artifact sync required

- Application PRD: none; Process-only and paired counterfactuals are already
  included in the approved capability scope.
- Application architecture summary: none; the existing Formula/Process
  separation and local domain pipeline remain the same.
- Owning capability node/artifacts: required; retain the issue reference on
  .okf/capabilities/interactive-exploration.md and record implementation
  evidence in the orchestration status during closeout.
- Shared Trust, Provenance, and Uncertainty: no policy change; preserve
  semantic states, evidence, confidence, coverage, and unavailable values.
- Issue registry: required; node issues reference: required when .okf exists.
- Reason/no-impact decision: capability-local Process and paired patch
  execution; no new product boundary, backend, persistence, or topology
  change.

The application-synthesis gate is current and remains unchanged.

## Blocked by

- None — issue 029 is implemented and archived.

## Functional requirements addressed

The parent PRD has no numbered user stories. This issue addresses functional
requirements 1, 3, 4, and 5 and canonical scenarios SC-EX-003 and SC-EX-004.

## Artifact anchors

- Use cases: ApplyCounterfactualPatch and EvaluateCounterfactual
- Contract: Formula/Process ownership and ordered patch application
- Policies: IsolationPolicy and ComparisonPolicy

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-EX-003 | not-applicable | verified by `src/lib/domain/exploration.test.ts` | deferred: no E2E harness |
| SC-EX-004 | not-applicable | verified by `src/lib/domain/exploration.test.ts` | deferred: no E2E harness |

## Delivery evidence

- Implemented typed Process patches for all descriptor-backed sections and
  addition-step fields, including mixing, aeration, fermentation, lamination,
  thermal, geometry, and Formula-line references.
- Paired Formula and Process scenarios preserve separate revisions and keep
  intrinsic composition results invariant for Process-only changes.
- Verification: `npm test`, `npm run lint`, `npm run typecheck`, and
  `git diff --check` passed. Astro build/static-route verification remains
  deferred under the user-managed local preview policy.
