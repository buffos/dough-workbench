# Issue 017 — Thermal and geometry behavior

## Issue Metadata

- ID: 017
- Title: Thermal and geometry behavior
- Category: feature
- State: done
- Owning capability: Process and Effective Behavior
- Owning capability node: .okf/capabilities/formula-analysis-workspace/process-effective-behavior.md
- Artifact root: docs/architecture/process-effective-behavior
- Delivery order: 5 of 6
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

Implement the seed thermal and geometry behavior rules on top of the common
effective-analysis boundary. These rules should describe supported tendencies
around setting, moisture loss, and process risk while remaining explicit about
their limits.

The implementation must:

- use the typed thermal inputs (method, temperature, duration, preheat, steam,
  surface/container where present) and geometry inputs (shape, thickness,
  dimensions/size where present) from the Process contract;
- derive only supported, versioned features such as setting tendency, moisture
  loss tendency, and thermal/geometry risk indicators;
- preserve Unknown, explicit absence, and zero and report partial coverage when
  required fields are missing;
- keep thermal and geometry effects separate from intrinsic composition and
  explain the process features that led to each supported output; and
- avoid exact bake-time/temperature prediction, guaranteed doneness, or
  unsupported sensory claims.

This issue does not add a new scenario ID: its acceptance is covered by the
canonical thermal/geometry requirements and the shared process explanation
scenario SC-PR-009.

## Acceptance criteria

- [x] Supported thermal and geometry inputs produce only the versioned effective
  features supported by the seed policy.
- [x] Missing or Unknown thermal/geometry prerequisites produce partial
  coverage or limitations, never invented values or implicit zeros.
- [x] Process-only thermal/geometry changes leave intrinsic metrics unchanged.
- [x] Every surfaced value identifies its contributing process features,
  model/policy version, and relevant limitations.
- [x] The implementation does not claim exact bake prediction, guaranteed
  setting, or sensory outcomes outside the canonical scope.
- [x] Automated tests and integration checks cover the thermal/geometry path
  through SC-PR-009 and the Process PRD requirements.

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
- Issue 015 — Fermentation and proof behavior

## Functional requirements addressed

This issue addresses the Process PRD requirements for thermal process,
geometry, setting, moisture-loss, process-risk features, partial coverage, and
explainability.

## Artifact anchors

- Process requirements: docs/architecture/process-effective-behavior/prd.md
- Thermal and geometry entities:
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
| Thermal/geometry process features are explained and versioned | SC-PR-009 | Setting, moisture-loss, and risk outputs show contributors and limits | Domain tests plus workspace integration checks |
| Process effects remain separate from intrinsic metrics | Process PRD functional requirement 6 | Thermal/geometry-only revision does not rewrite intrinsic results | Paired Formula/Process regression test |

## Human review gate

This issue is AFK with a grouped visual review after the complete Process batch
013–018. Review must confirm readable thermal/geometry explanations and clear
limits on what the tool can infer in both languages.

## Implementation Record

- Added versioned thermal and geometry seed rules for setting, moisture loss,
  and process-risk tendencies with partial coverage when prerequisites are
  missing.
- Intrinsic metrics remain unchanged by thermal or geometry-only process
  changes, and unsupported precision is not presented as a guarantee.
- Verification: effective-behavior domain tests and the full `npm run verify`
  suite passed.
- Artifact impact: capability-local implementation only; application PRD and
  application architecture remain unchanged.

## Human review status

Implementation and the grouped visual review for issues 013–018 were approved
by the user on 2026-09-09.
