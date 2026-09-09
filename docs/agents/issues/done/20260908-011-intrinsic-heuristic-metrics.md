# Issue 011 — Intrinsic heuristic metrics

## Issue Metadata

- ID: 011
- Title: Intrinsic heuristic metrics
- Category: feature
- State: done
- Owning capability: Composition and Intrinsic Metrics
- Artifact root: docs/architecture/composition-intrinsic-metrics
- Delivery order: 4 of 5
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

Add the pre-process heuristic metrics defined by the capability contract:
Gluten Potential Index (GPI), Enrichment Gradient Index (EGI), enrichment,
tenderness, and fluidity.

The implementation must:

- derive each metric only from composition inputs and the approved
  composition-level parameters;
- keep heuristic outputs separate from Calculated and Estimated results;
- version the heuristic model and parameters;
- expose evidence coverage, maturity, confidence, contributors, exclusions,
  and limitations for each metric;
- return partial or unavailable states when prerequisites are missing;
- avoid reading Process data or named-product classification;
- avoid presenting a heuristic score as a laboratory measurement or a direct
  prediction of finished product quality.

The metric names and their user-facing explanations must use the canonical
glossary. Any abbreviated label must have an accessible Greek and English
explanation.

## Acceptance criteria

- [x] Each supported heuristic metric has a stable output shape with its value or
  partial/unavailable state, semantic class Heuristic, model or policy version,
  and explanation metadata.
- [x] The heuristics are deterministic for the same Formula, evidence set, and
  parameter version.
- [x] Missing evidence is visible and never silently replaced with zero.
- [x] Process changes do not alter intrinsic heuristic results.
- [x] A user can distinguish heuristic indicators from calculated composition
  totals and estimated hydration or absorption.
- [x] Automated tests cover SC-CO-005, SC-CO-006, and SC-CO-009.

## Artifact sync required

- Application PRD: none; this is implementation of already-specified capability
  scope.
- Application architecture summary: none; the existing frontend-only boundary
  remains valid.
- Owning capability node and artifacts: required. Update the node only when the
  issue is accepted; synchronize orchestration-status.md and any contract or
  scenario clarification made during implementation.
- Shared Trust, Provenance, and Uncertainty artifact: required if reusable
  maturity, confidence, or limitation vocabulary changes.
- Issue registry: required.
- Node issue references: required.

Reason: capability implementation only. No product-level requirement,
cross-capability architecture, or repository-topology change is expected.

## Blocked by

- Issue 008 — Deterministic composition baseline
- Issue 009 — Composition evidence and partial results
- Issue 010 — Effective hydration and absorption

## User stories addressed

The capability PRD uses functional requirements rather than user-story IDs.
This issue addresses FR-CO-004, FR-CO-005, FR-CO-006, and FR-CO-007.

## Artifact anchors

- Heuristic metrics and boundaries:
  docs/architecture/composition-intrinsic-metrics/prd.md
- Heuristic result semantics:
  docs/architecture/composition-intrinsic-metrics/canonical-domain-model.md
- Metric output contract:
  docs/architecture/composition-intrinsic-metrics/canonical-api-cli-contract.md
- Heuristic scenarios:
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
| Heuristic results are separate from arithmetic and estimates | SC-CO-005 | Heuristic class and model metadata remain distinct | src/lib/domain/composition.test.ts — heuristic class test; passed in npm run verify |
| Missing prerequisites remain visible | SC-CO-006 | Heuristics inherit partial or unavailable evidence | IntrinsicMetric status/limitation model and panel; passed in npm run verify |
| Heuristic explanations retain evidence | SC-CO-009 | Contributors, exclusions, missing evidence, and parameters are exposed | IntrinsicMetricsPanel.svelte explanation details; passed in npm run verify |

## Implementation Record

- Added GPI, EGI, enrichment, tenderness, and fluidity outputs as versioned
  Heuristic metrics.
- Kept heuristic parameters in versioned data under
  src/data/models/intrinsic-model.ts rather than in presentation code.
- Added deterministic dependency propagation for coverage, confidence,
  limitations, and evidence explanations.
- Verification: npm run verify passed — 11 test files, 50 tests, lint,
  typecheck, static build, and route checks.
- Review status: implementation is complete and accepted in the grouped visual
  review for the complete Composition batch.

## Human review record

- Review disposition: approved
- Review date: 2026-09-08
- Review scope: grouped visual review of heuristic states and explanations in
  Greek and English.
- Result: accepted; no blocking findings remain for this issue.
