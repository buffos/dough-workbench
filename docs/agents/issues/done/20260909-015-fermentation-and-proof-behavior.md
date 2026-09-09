# Issue 015 — Fermentation and proof behavior

## Issue Metadata

- ID: 015
- Title: Fermentation and proof behavior
- Category: feature
- State: done
- Owning capability: Process and Effective Behavior
- Owning capability node: .okf/capabilities/formula-analysis-workspace/process-effective-behavior.md
- Artifact root: docs/architecture/process-effective-behavior
- Delivery order: 3 of 6
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

Add the seed, versioned fermentation and proof behavior rules on top of the
boundary from issue 013. The feature must explain how recorded fermentation
conditions affect process coverage and supported tendencies while keeping the
meaning of each field explicit.

The implementation must:

- use the typed fermentation agent, bulk/final duration, bulk/final
  temperature, relative expansion targets, and cold-fermentation fields from
  the canonical Process contract;
- distinguish bulk temperature as a phase condition from a bulk expansion
  target as a relative volume goal, including in the user-facing explanation;
- derive only supported seed features such as fermentation severity/coverage,
  gas-retention or proof tendency, and process-linked setting risk;
- preserve explicit absence, Unknown, and zero and report reduced coverage when
  prerequisites are missing;
- keep intrinsic metrics unchanged for process-only revisions; and
- expose the feature contributions, model/policy version, and limitations in
  the effective analysis explanation.

Do not claim exact fermentation kinetics, guaranteed rise, final volume,
automatic timing, or calibrated prediction. The implementation should make
clear when a value is only a supported heuristic or when no effective value can
be derived.

## Acceptance criteria

- [x] Bulk temperature and bulk expansion target are represented and explained
  as different concepts with their canonical units/semantics.
- [x] Supported fermentation/proof inputs produce versioned effective features
  and only the effective outputs supported by the seed policy.
- [x] Unknown, explicit absence, and zero remain distinct; missing prerequisites
  produce partial coverage or limitations instead of invented values.
- [x] Process-only changes alter only effective behavior and leave intrinsic
  metrics unchanged.
- [x] The explanation identifies fermentation inputs, feature contributions,
  model/policy version, and missing prerequisites.
- [x] Automated tests cover SC-PR-003, SC-PR-007, and SC-PR-009.

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

This issue addresses the Process PRD requirements for fermentation, proof
conditions, bulk semantics, partial coverage, explainability, and versioned
model output.

## Artifact anchors

- Process requirements: docs/architecture/process-effective-behavior/prd.md
- Fermentation and effective behavior model:
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
| Bulk temperature and expansion target have different meanings | SC-PR-003 | Distinct normalized fields and explanation | Domain normalization/evaluation test plus UI check |
| Missing process evidence is partial | SC-PR-007 | Reduced coverage and intrinsic fallback | Domain test with all-Unknown fermentation |
| Versioned explanation and missing prerequisites | SC-PR-009 | Feature, model version, and limitation details render | Domain and workspace integration checks |

## Human review gate

This issue is AFK with a grouped visual review after the complete Process batch
013–018. Review must confirm that bulk terminology and proof behavior are clear
in Greek and English, with no implied guarantee of rise or volume.

## Implementation Record

- Added versioned seed rules for fermentation, bulk temperature, expansion, and
  proof behavior while keeping temperature and expansion target semantics
  separate.
- Partial coverage and limitations are surfaced when fermentation prerequisites
  are missing; intrinsic metrics remain independent from process revisions.
- Verification: effective-behavior domain tests and the full `npm run verify`
  suite passed.
- Artifact impact: capability-local implementation only; application PRD and
  application architecture remain unchanged.

## Human review status

Implementation and the grouped visual review for issues 013–018 were approved
by the user on 2026-09-09.
