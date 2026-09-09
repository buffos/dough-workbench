# Issue 013 — Process-effective analysis boundary

## Issue Metadata

- ID: 013
- Title: Process-effective analysis boundary
- Category: feature
- State: done
- Owning capability: Process and Effective Behavior
- Owning capability node: .okf/capabilities/formula-analysis-workspace/process-effective-behavior.md
- Artifact root: docs/architecture/process-effective-behavior
- Delivery order: 1 of 6
- Execution type: AFK
- Review gate: visual-review
- Review mode: grouped visual review after issues 013–018 are implemented

## Parent Artifacts

- docs/architecture/process-effective-behavior/prd.md
- docs/architecture/process-effective-behavior/domain-glossary.md
- docs/architecture/process-effective-behavior/canonical-domain-model.md
- docs/architecture/process-effective-behavior/canonical-use-cases.md
- docs/architecture/process-effective-behavior/canonical-api-cli-contract.md
- docs/architecture/process-effective-behavior/acceptance-scenarios.md
- docs/architecture/process-effective-behavior/readiness-review.md
- .okf/capabilities/shared/trust-and-provenance.md

## What to build

Create the versioned frontend-only boundary that evaluates effective behavior
from an exact normalized Formula/Process revision pair and an intrinsic metric
snapshot. This is the shared foundation for the process-specific rules in
issues 014–017.

The boundary must:

- produce the canonical `EffectiveAnalysisResult` shape with an explicit
  outcome (`completed`, `partial`, `rejected`, or `conflict`), Formula and
  Process revisions, model version, metrics, feature contributions, and
  diagnostics;
- keep intrinsic metrics immutable and separate from process-adjusted metrics;
- preserve the distinction between an empty AdditionStep list (order not
  recorded), missing process evidence, explicit absence, and numeric zero;
- return a usable intrinsic/composition-only result with reduced process
  coverage when process evidence is incomplete or all process values are
  Unknown;
- reject stale Formula/Process revision pairs and AdditionStep line references
  as conflicts with recovery guidance, never as silent empty input;
- reuse the existing Process normalization and Formula/Process handoff
  diagnostics rather than introducing a second normalization vocabulary; and
- expose a reachable, bilingual status/summary surface so later rules can add
  effective metrics without inventing a new workspace boundary.

Do not add calibrated coefficients, exact kinetics, guaranteed rise/volume, or
an API/backend surface. This issue establishes the analysis contract and
partial-result behavior; domain-specific behavior rules belong to issues
014–017.

## Acceptance criteria

- [x] A valid normalized Formula/Process revision pair produces an
  `EffectiveAnalysisResult` with explicit revisions, model version, outcome,
  coverage, and diagnostics.
- [x] Intrinsic metrics are unchanged when only the Process revision changes;
  process-sensitive values are represented separately.
- [x] An all-Unknown or incomplete Process preserves available intrinsic
  metrics and reports a partial result with reduced coverage and limitations.
- [x] A stale Formula/Process pair or cross-Formula AdditionStep reference
  produces a conflict/rejected result with recovery guidance.
- [x] An empty AdditionStep list is valid and means that addition order was not
  recorded; it does not mean that no ingredients exist.
- [x] The boundary and summary surface are available from the existing Formula
  Analysis Workspace without a backend or API.
- [x] Automated tests cover SC-PR-006, SC-PR-007, SC-PR-008, and SC-PR-009.

## Artifact sync required

- Application PRD: none; this implements already-specified capability scope.
- Application architecture summary: none; the frontend-only boundary remains
  valid.
- Owning capability node and artifacts: required; synchronize the node,
  orchestration status, and any contract/scenario clarification at acceptance.
- Shared Trust/Provenance: none; reuse the existing coverage, confidence,
  limitations, and Unknown-is-not-zero vocabulary without changing the shared
  policy.
- Issue registry: required.
- Node issue references: required.

Reason: capability-local implementation. No product-level requirement,
cross-capability architecture, or repository-topology change is expected.

## Blocked by

None.

## Functional requirements addressed

This issue establishes the Process PRD functional requirements for exact
revision pairing, partial effective analysis, intrinsic/process separation,
and versioned results. It is the boundary consumed by functional requirements
1–7.

## Artifact anchors

- Process requirements: docs/architecture/process-effective-behavior/prd.md
- Process aggregate and invariants:
  docs/architecture/process-effective-behavior/canonical-domain-model.md
- Effective result contract:
  docs/architecture/process-effective-behavior/canonical-api-cli-contract.md
- Orchestration and failure behavior:
  docs/architecture/process-effective-behavior/canonical-use-cases.md
- Process acceptance scenarios:
  docs/architecture/process-effective-behavior/acceptance-scenarios.md

## Verification obligations

- Policy source: .okf/project.md
- Backend boundary: not applicable.
- Frontend integration: planned when supported by the existing test setup.
- End-to-end: deferred: catalog-only; no E2E harness is required for this
  issue.
- Regression: existing lint, typecheck, build, and test commands must remain
  green.

## Scenario traceability

| Source rule or use case | Acceptance scenario | Issue criterion | Planned verification |
| --- | --- | --- | --- |
| Formula/Process revision pairing and process independence | SC-PR-006 | Exact pairing and immutable intrinsic metrics | Domain tests plus existing verify command |
| Missing process evidence is partial, not zero | SC-PR-007 | Intrinsic fallback, coverage, and limitations | Domain tests plus workspace integration check |
| Stale or foreign references are conflicts | SC-PR-008 | Conflict outcome and recovery diagnostics | Domain tests plus handoff-state check |
| Explainable versioned effective result | SC-PR-009 | Model version, contributors, and diagnostics are exposed | Domain tests plus summary-panel check |

## Human review gate

This issue is AFK with a grouped visual review after the complete Process batch
013–018. Review must include the bilingual summary, partial/conflict states,
keyboard access, focus visibility, and contrast at supported desktop and mobile
 widths.

## Implementation Record

- Added the versioned `EffectiveAnalysisResult` domain boundary with exact
  Formula/Process pairing, intrinsic/effective separation, partial results,
  and conflict diagnostics for stale or foreign references.
- Added the application adapter and workspace surface consumed by the later
  process-rule issues; domain coverage includes the empty-order and all-Unknown
  process cases.
- Verification: `npm run verify` passed, including the effective-behavior
  domain tests, lint, typecheck, build, and static route checks.
- Artifact impact: capability-local implementation only; application PRD and
  application architecture remain unchanged.

## Human review status

Implementation and the grouped visual review for issues 013–018 were approved
by the user on 2026-09-09.
