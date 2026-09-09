# Issue 010 — Effective hydration and absorption

## Issue Metadata

- ID: 010
- Title: Effective hydration and absorption
- Category: feature
- State: done
- Owning capability: Composition and Intrinsic Metrics
- Artifact root: docs/architecture/composition-intrinsic-metrics
- Delivery order: 3 of 5
- Execution type: AFK
- Review gate: visual-review
- Review mode: grouped visual review completed 2026-09-08

## Parent Artifacts

- docs/architecture/composition-intrinsic-metrics/prd.md
- docs/architecture/composition-intrinsic-metrics/domain-glossary.md
- docs/architecture/composition-intrinsic-metrics/canonical-domain-model.md
- docs/architecture/composition-intrinsic-metrics/canonical-use-cases.md
- docs/architecture/composition-intrinsic-metrics/canonical-api-cli-contract.md
- docs/architecture/composition-intrinsic-metrics/acceptance-scenarios.md
- docs/architecture/composition-intrinsic-metrics/readiness-review.md
- .okf/capabilities/shared/trust-and-provenance.md

## What to build

Add composition-level estimates for effective hydration and flour absorption
using the evidence and partial-result model from issues 008 and 009.

The implementation must:

- apply a line-local effective availability factor only to the known
  contribution to which it applies;
- keep total water, effective water, hydration, and absorption as distinct
  concepts;
- calculate an estimated effective hydration or absorption value only when
  the available evidence and model prerequisites support it;
- preserve the canonical unit for acid-neutralization capacity:
  g NaHCO3 equivalent per 100 g ingredient;
- avoid treating pH as a linear substitute for the canonical acid measure;
- label every estimate as Estimated, version its model or policy parameters,
  and expose limitations, coverage, and missing evidence.

The feature remains independent of Process. Process temperature, time, and
fermentation stages must not be used as hidden inputs to these composition
estimates.

## Acceptance criteria

- [x] An availability factor scales only the applicable known component and does
  not invent evidence for an unknown component.
- [x] A formula can show total water separately from estimated effective water and
  derived hydration or absorption.
- [x] Missing prerequisites produce a partial or unavailable estimate with an
  explanation rather than a zero or fabricated value.
- [x] Acid-related outputs preserve the canonical unit and do not use a pH-linear
  shortcut.
- [x] Every estimated output includes the Estimated class, model or policy
  version, evidence coverage, and limitations.
- [x] The calculation is unchanged when Process data is added or removed.
- [x] Automated tests cover SC-CO-004, SC-CO-006, and SC-CO-007.

## Artifact sync required

- Application PRD: none; this is implementation of already-specified capability
  scope.
- Application architecture summary: none; the existing frontend-only boundary
  remains valid.
- Owning capability node and artifacts: required. Update the node only when the
  issue is accepted; synchronize orchestration-status.md and any contract or
  scenario clarification made during implementation.
- Shared Trust, Provenance, and Uncertainty artifact: required if reusable
  estimate or limitation vocabulary changes.
- Issue registry: required.
- Node issue references: required.

Reason: capability implementation only. No product-level requirement,
cross-capability architecture, or repository-topology change is expected.

## Blocked by

- Issue 008 — Deterministic composition baseline
- Issue 009 — Composition evidence and partial results

## User stories addressed

The capability PRD uses functional requirements rather than user-story IDs.
This issue addresses FR-CO-003, FR-CO-004, FR-CO-005, FR-CO-006, and FR-CO-007.

## Artifact anchors

- Effective availability and estimate requirements:
  docs/architecture/composition-intrinsic-metrics/prd.md
- Model and unit definitions:
  docs/architecture/composition-intrinsic-metrics/canonical-domain-model.md
- Estimate contract:
  docs/architecture/composition-intrinsic-metrics/canonical-api-cli-contract.md
- Hydration, absorption, and acid scenarios:
  docs/architecture/composition-intrinsic-metrics/acceptance-scenarios.md

## Verification obligations

- Backend: not applicable.
- Frontend integration: required when supported by the existing test setup.
- End-to-end: catalog-only or deferred according to the root verification
  policy; no browser collection is required for this issue.
- Regression: existing lint, typecheck, build, and test commands must remain
  green.

## Scenario traceability

| Source rule or use case | Acceptance scenario | Issue criterion | Executed verification |
| --- | --- | --- | --- |
| Line-local availability scales known evidence only | SC-CO-004 | Availability changes effective water without changing total water or catalog data | src/lib/domain/composition.test.ts — availability override test; passed in npm run verify |
| Missing absorption evidence keeps estimates partial | SC-CO-006 | Absorption is partial while deterministic hydration remains available | src/lib/domain/composition.test.ts — partial absorption test; passed in npm run verify |
| Canonical acid unit is preserved | SC-CO-007 | Acid output uses the fixed unit and no pH shortcut | src/lib/domain/composition.test.ts — acid unit test; passed in npm run verify |

## Implementation Record

- Added effective-water and effective-hydration estimates with role-aware
  availability factors.
- Added weighted flour absorption evidence and explicit partial estimate
  states.
- Added the canonical acid-neutralization unit as a transport-neutral domain
  constant and preserved it in metric explanations.
- Verification: npm run verify passed — 11 test files, 50 tests, lint,
  typecheck, static build, and route checks.
- Review status: implementation is complete and accepted in the grouped visual
  review for the complete Composition batch.

## Human review record

- Review disposition: approved
- Review date: 2026-09-08
- Review scope: grouped visual review of estimated metric cards, explanations,
  and limitation states in Greek and English.
- Result: accepted; no blocking findings remain for this issue.
