# Issue 016 — Addition order and lamination effects

## Issue Metadata

- ID: 016
- Title: Addition order and lamination effects
- Category: feature
- State: done
- Owning capability: Process and Effective Behavior
- Owning capability node: .okf/capabilities/formula-analysis-workspace/process-effective-behavior.md
- Artifact root: docs/architecture/process-effective-behavior
- Delivery order: 4 of 6
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

Implement the supported effects of ordered AdditionSteps and lamination on
effective behavior. Addition order is process metadata and must not become a
second ingredient-mass input.

The implementation must:

- validate and preserve the ordered AdditionStep sequence and its Formula-line
  references from the canonical contract;
- ensure a referenced ingredient line contributes its Formula mass exactly once;
- support the specified late-fat/incorporation behavior only when the seed
  rule has the required prerequisites, with a visible feature contribution;
- represent lamination enablement, folds, fat state, and temperature as
  process features and derive only supported layer-integrity or related
  effective tendencies;
- treat an empty AdditionStep list as “order not recorded”, not “no additions”;
- surface stale or foreign line references as a conflict with recovery guidance;
- preserve Unknown, explicit absence, and zero; and
- keep all changes process-local, versioned, and explainable without altering
  intrinsic metrics.

Do not duplicate Formula masses, infer unsupported order semantics, or claim
guaranteed layers, flakiness, or sensory outcomes.

## Acceptance criteria

- [x] AdditionStep sequence and Formula-line references are normalized and
  visible without adding referenced mass to composition totals.
- [x] A supported late-fat change can alter the corresponding effective feature
  contribution; an unsupported rule does not fabricate a metric change.
- [x] Lamination inputs produce only supported, versioned effective features and
  explain their prerequisites and limitations.
- [x] Empty order, Unknown, explicit absence, and numeric zero retain distinct
  meanings.
- [x] A stale or foreign line reference produces a conflict/rejected result with
  recovery guidance.
- [x] Intrinsic metrics remain unchanged for AdditionStep/lamination-only
  changes.
- [x] Automated tests cover SC-PR-004, SC-PR-005, SC-PR-008, and SC-PR-009.

## Artifact sync required

- Application PRD: none; this implements already-specified capability scope.
- Application architecture summary: none; the frontend-only boundary remains
  valid.
- Owning capability node and artifacts: required; synchronize the node,
  orchestration status, and any contract/scenario clarification at acceptance.
- Shared Trust/Provenance: none; reuse existing conflict, coverage, and
  limitation vocabulary without changing the shared policy.
- Issue registry: required.
- Node issue references: required.

Reason: capability-local implementation. No product-level requirement,
cross-capability architecture, or repository-topology change is expected.

## Blocked by

- Issue 013 — Process-effective analysis boundary
- Issue 014 — Mixing and aeration effects

## Functional requirements addressed

This issue addresses the Process PRD requirements for ordered additions,
lamination, Formula-line references, partial effective analysis, and
explainable process contributions.

## Artifact anchors

- Process requirements: docs/architecture/process-effective-behavior/prd.md
- AdditionStep and lamination invariants:
  docs/architecture/process-effective-behavior/canonical-domain-model.md
- Effective metric and conflict contract:
  docs/architecture/process-effective-behavior/canonical-api-cli-contract.md
- Addition-order orchestration:
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
| Addition order is metadata, not duplicate mass | SC-PR-004 | Timeline/reference normalization keeps composition totals stable | Domain test with a referenced fat line |
| Late-fat rule is conditional and explainable | SC-PR-005 | Supported contribution appears; unsupported rule stays unchanged | Domain tests with supported/unsupported policy |
| Foreign references are conflicts | SC-PR-008 | Conflict and recovery state are visible | Domain and handoff-state checks |
| Effective changes expose contributors and limits | SC-PR-009 | Lamination/order explanation renders version and prerequisites | Domain and workspace integration checks |

## Human review gate

This issue is AFK with a grouped visual review after the complete Process batch
013–018. Review must confirm that the addition timeline and lamination
explanations are understandable and do not suggest duplicate ingredient mass.

## Implementation Record

- Added normalized AdditionStep/order handling and supported late-fat and
  lamination features without adding referenced mass to composition totals.
- Empty order, Unknown, explicit absence, and numeric zero remain distinct;
  stale and foreign line references return recoverable conflicts.
- Verification: effective-behavior domain tests and the full `npm run verify`
  suite passed.
- Artifact impact: capability-local implementation only; no product-level
  contract or architecture change.

## Human review status

Implementation and the grouped visual review for issues 013–018 were approved
by the user on 2026-09-09.
