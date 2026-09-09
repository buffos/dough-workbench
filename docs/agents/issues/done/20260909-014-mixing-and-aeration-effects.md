# Issue 014 — Mixing and aeration effects

## Issue Metadata

- ID: 014
- Title: Mixing and aeration effects
- Category: feature
- State: done
- Owning capability: Process and Effective Behavior
- Owning capability node: .okf/capabilities/formula-analysis-workspace/process-effective-behavior.md
- Artifact root: docs/architecture/process-effective-behavior
- Delivery order: 2 of 6
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

Add the seed, versioned process rules for mixing and aeration on top of the
boundary from issue 013. The rules should turn supported mixing, folding/rest,
aeration, and foam-related inputs into explainable process features and
effective behavior outputs, without pretending to be calibrated physics.

The implementation must:

- normalize method, intensity, duration, folding/rest, aeration method, and
  relevant foam-stability inputs through the existing typed Process contract;
- derive only supported seed features such as mechanical work, gluten
  development tendency, aeration efficiency, gas-retention tendency, and
  process-linked fluidity or risk indicators;
- retain `Unknown`, explicit absence, and zero as different states and reduce
  coverage when a rule prerequisite is missing;
- report each changed effective value with feature contributions, the model or
  policy version, and limitations;
- preserve the intrinsic snapshot exactly when a mixing/aeration-only Process
  change is evaluated; and
- provide the rule output through the effective-behavior result boundary and
  its explanation surface.

Do not introduce automatic timing advice, guaranteed volume, exact gluten
kinetics, or a calibrated coefficient table. A supported rule may be
non-monotonic or unavailable; the result must say which one it is.

## Acceptance criteria

- [x] Supported mixing and aeration inputs produce versioned effective feature
  contributions and only the effective metrics supported by the seed policy.
- [x] Missing or Unknown prerequisites remain explicit and reduce coverage;
  they are never silently converted to zero.
- [x] A Process-only change can alter effective outputs while the paired
  intrinsic metrics remain byte-for-byte/equivalent unchanged.
- [x] The explanation identifies the relevant process features, rule/model
  version, and unsupported or missing prerequisites.
- [x] Unsupported combinations produce a limitation or partial result rather
  than an unexplained metric change.
- [x] Automated tests cover SC-PR-005, SC-PR-006, and SC-PR-009.

## Artifact sync required

- Application PRD: none; this implements already-specified capability scope.
- Application architecture summary: none; the frontend-only boundary remains
  valid.
- Owning capability node and artifacts: required; synchronize the node,
  orchestration status, and any contract/scenario clarification at acceptance.
- Shared Trust/Provenance: none; reuse existing semantic classes, coverage,
  and limitation vocabulary without changing the shared policy.
- Issue registry: required.
- Node issue references: required.

Reason: capability-local implementation. No product-level requirement,
cross-capability architecture, or repository-topology change is expected.

## Blocked by

- Issue 013 — Process-effective analysis boundary

## Functional requirements addressed

This issue addresses the Process PRD requirements for mixing, aeration,
effective feature derivation, partial coverage, explainability, and versioned
model output.

## Artifact anchors

- Process requirements: docs/architecture/process-effective-behavior/prd.md
- Process behavior entities and policies:
  docs/architecture/process-effective-behavior/canonical-domain-model.md
- Effective metric contract:
  docs/architecture/process-effective-behavior/canonical-api-cli-contract.md
- Effective evaluation and explanation:
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
| Addition/process features affect only supported rules | SC-PR-005 | Supported mixing/aeration contributions are explained | Domain tests with supported and unsupported prerequisites |
| Process independence | SC-PR-006 | Intrinsic metrics remain unchanged | Paired Formula/Process domain test |
| Versioned explanation and missing prerequisites | SC-PR-009 | Feature, model version, and limitation details render | Domain and workspace integration checks |

## Human review gate

This issue is AFK with a grouped visual review after the complete Process batch
013–018. Review must confirm that effective values are visibly distinguished
from intrinsic values and that explanations are understandable in Greek and
English.

## Implementation Record

- Added versioned seed rules for supported mixing, folding/rest, aeration, and
  foam-related inputs, with feature contributions and explicit limitations.
- Preserved `Unknown`, explicit absence, and numeric zero as distinct states;
  unsupported generic addition steps do not fabricate an effective change.
- Verification: focused effective/process/handoff tests and the full
  `npm run verify` suite passed.
- Artifact impact: capability-local implementation only; no product-level
  contract or architecture change.

## Human review status

Implementation and the grouped visual review for issues 013–018 were approved
by the user on 2026-09-09.
