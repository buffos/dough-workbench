# Issue 008 — Deterministic composition baseline

## Issue Metadata

- ID: 008
- Title: Deterministic composition baseline
- Category: feature
- State: done
- Owning capability: Composition and Intrinsic Metrics
- Artifact root: docs/architecture/composition-intrinsic-metrics
- Delivery order: 1 of 5
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

Implement the first frontend-only composition slice from a normalized Formula.
For formulas whose supported functional composition evidence is complete, the
slice must deterministically calculate the composition totals and
flour-relative percentages defined by the canonical contract.

The implementation must:

- resolve the functional composition of catalog and custom ingredient lines
  without changing the normalized Formula contract;
- apply the canonical role-participation policy for composition contributors;
- calculate the supported baseline components, including flour, water, fat,
  sugar, protein, starch, fiber, salt, egg, and dairy where the evidence exists;
- preserve the flour denominator and the contract units used for each output;
- return the semantic result class Calculated together with the model or policy
  version and provenance needed by later issues;
- remain independent of Process and named-product classification.

This issue establishes the deterministic foundation only. Partial evidence,
effective availability, estimated absorption, and heuristic metrics belong to
the dependent issues in this batch.

## Acceptance criteria

- [x] A normalized Formula with complete supported composition evidence produces
  deterministic totals and flour-relative percentages for every supported
  baseline component.
- [x] Formula line roles affect participation exactly as specified by the
  canonical domain model; excluded roles do not silently become contributors.
- [x] Re-running the same Formula produces the same values, units, semantic class,
  and policy version.
- [x] The composition calculation does not read or depend on Process data or
  classification data.
- [x] The result is exposed through the existing frontend composition/summary
  boundary without requiring a backend or API.
- [x] Automated tests cover SC-CO-001, SC-CO-003, and SC-CO-008.

## Artifact sync required

- Application PRD: none; this is implementation of already-specified capability
  scope.
- Application architecture summary: none; the existing frontend-only boundary
  remains valid.
- Owning capability node and artifacts: required. Update the node only when the
  issue is accepted; synchronize orchestration-status.md and any contract or
  scenario clarification made during implementation.
- Issue registry: required.
- Node issue references: required.

Reason: capability implementation only. No product-level requirement,
cross-capability architecture, or repository-topology change is expected.

## Blocked by

None.

## User stories addressed

The capability PRD uses functional requirements rather than user-story IDs.
This issue addresses FR-CO-001, FR-CO-003, FR-CO-004, FR-CO-005, and FR-CO-007.

## Artifact anchors

- Functional requirements: docs/architecture/composition-intrinsic-metrics/prd.md
- Composition entities and result semantics:
  docs/architecture/composition-intrinsic-metrics/canonical-domain-model.md
- Composition boundary and units:
  docs/architecture/composition-intrinsic-metrics/canonical-api-cli-contract.md
- Deterministic scenarios:
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
| Deterministic totals and flour denominator | SC-CO-001 | Supported composition totals and flour-relative values | src/lib/domain/composition.test.ts — deterministic totals test; passed in npm run verify |
| Role participation distinguishes inclusion from the continuous phase | SC-CO-003 | Role policy controls metric participation and explanation | src/lib/domain/composition.test.ts — inclusion/effective-water test; passed in npm run verify |
| Formula and Process are independent | SC-CO-008 | Composition calculation has no Process input or dependency | src/lib/domain/composition.test.ts — deterministic repeat/isolation test; passed in npm run verify |

## Implementation Record

- Added the framework-independent intrinsic composition engine and versioned
  heuristic model data boundary.
- Added catalog-backed functional profiles for flour and ingredient lines,
  including custom flour composition editing and absorption evidence.
- Integrated the deterministic result into the existing Formula summary without
  adding a backend surface.
- Verification: npm run verify passed — 11 test files, 50 tests, lint,
  typecheck, static build, and route checks.
- Review status: implementation is complete and accepted in the grouped visual
  review for the complete Composition batch.

## Human review record

- Review disposition: approved
- Review date: 2026-09-08
- Review scope: grouped visual review of the composition summary in Greek and
  English at the supported desktop and mobile widths.
- Result: accepted; no blocking findings remain for this issue.
