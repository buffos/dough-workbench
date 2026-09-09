# Issue 009 — Composition evidence and partial results

## Issue Metadata

- ID: 009
- Title: Composition evidence and partial results
- Category: feature
- State: done
- Owning capability: Composition and Intrinsic Metrics
- Artifact root: docs/architecture/composition-intrinsic-metrics
- Delivery order: 2 of 5
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

Extend the deterministic composition baseline with explicit evidence state and
honest partial results. The output must distinguish a value supported by
composition evidence, a value that cannot currently be established, and a
field that does not apply. These are domain states, not vague user-facing
input choices.

The implementation must:

- preserve Unknown as unknown and never coerce missing composition evidence to
  zero;
- distinguish an inapplicable component from an unavailable or missing one;
- calculate coverage and confidence from the contributing evidence without
  implying laboratory precision;
- retain contributor provenance, excluded contributors, missing evidence, and
  relevant parameters for every partial result;
- expose the semantic classes Calculated, Estimated, and Heuristic distinctly,
  even when the current result is partial;
- provide a concise explanation model that the workspace can render in Greek
  and English without exposing internal debug terminology as product copy.

This issue does not add effective availability, absorption models, or heuristic
metrics; it makes the evidence boundary usable by those dependent issues.

## Acceptance criteria

- [x] A Formula with one or more unsupported or missing composition contributors
  yields a partial result with explicit missing evidence and does not treat
  that evidence as zero.
- [x] An inapplicable component is represented separately from an unknown
  component.
- [x] Every displayed partial metric can identify its contributors, exclusions,
  evidence coverage, semantic class, and provenance.
- [x] The result explanation is deterministic for the same Formula and evidence
  set and is available to both language variants.
- [x] The UI can state that a result is partial or unavailable without suggesting
  false precision.
- [x] Automated tests cover SC-CO-002, SC-CO-005, and SC-CO-009.

## Artifact sync required

- Application PRD: none; this is implementation of already-specified capability
  scope.
- Application architecture summary: none; the existing frontend-only boundary
  remains valid.
- Owning capability node and artifacts: required. Update the node only when the
  issue is accepted; synchronize orchestration-status.md and any contract or
  scenario clarification made during implementation.
- Shared Trust, Provenance, and Uncertainty artifact: required if its reusable
  explanation or evidence vocabulary changes.
- Issue registry: required.
- Node issue references: required.

Reason: capability implementation only. No product-level requirement,
cross-capability architecture, or repository-topology change is expected.

## Blocked by

- Issue 008 — Deterministic composition baseline

## User stories addressed

The capability PRD uses functional requirements rather than user-story IDs.
This issue addresses FR-CO-002, FR-CO-004, FR-CO-005, FR-CO-006, and FR-CO-007.

## Artifact anchors

- Unknown and partial-result requirements:
  docs/architecture/composition-intrinsic-metrics/prd.md
- Evidence and provenance semantics:
  docs/architecture/composition-intrinsic-metrics/canonical-domain-model.md
- Explanation contract:
  docs/architecture/composition-intrinsic-metrics/canonical-api-cli-contract.md
- Partial-result scenarios:
  docs/architecture/composition-intrinsic-metrics/acceptance-scenarios.md
- Shared trust vocabulary: .okf/capabilities/shared/trust-and-provenance.md

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
| Unknown is not zero | SC-CO-002 | Missing evidence remains unavailable or partial | src/lib/domain/composition.test.ts — unknown composition test; passed in npm run verify |
| Semantic class is explicit | SC-CO-005 | Calculated, Estimated, and Heuristic remain distinct | src/lib/domain/composition.test.ts and IntrinsicMetricsPanel.svelte — semantic class rendering; passed in npm run verify |
| Explanation fidelity | SC-CO-009 | Contributors, exclusions, missing evidence, and provenance are retained | IntrinsicMetric explanation model plus panel details; passed in npm run verify |

## Implementation Record

- Added explicit metric status, coverage, confidence, provenance, contributor,
  exclusion, and missing-evidence data to the intrinsic result model.
- Kept Unknown separate from None and omitted unavailable values instead of
  substituting zero.
- Added bilingual explanation rendering in the intrinsic metric cards.
- Verification: npm run verify passed — 11 test files, 50 tests, lint,
  typecheck, static build, and route checks.
- Review status: implementation is complete and accepted in the grouped visual
  review for the complete Composition batch.

## Human review record

- Review disposition: approved
- Review date: 2026-09-08
- Review scope: grouped visual review of partial, unavailable, provenance, and
  explanation states in Greek and English.
- Result: accepted; no blocking findings remain for this issue.
