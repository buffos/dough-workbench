# Issue 012 — Composition workspace integration

## Issue Metadata

- ID: 012
- Title: Composition workspace integration
- Category: feature
- State: done
- Owning capability: Composition and Intrinsic Metrics
- Artifact root: docs/architecture/composition-intrinsic-metrics
- Delivery order: 5 of 5
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
- .okf/capabilities/shared/bilingual-content.md

## What to build

Integrate the completed composition calculations and explanations into the
Formula Analysis Workspace. The workspace must present deterministic totals,
partial results, estimated hydration or absorption, and intrinsic heuristics
as one coherent composition view without implying that Process or
classification has been analyzed.

The integration must:

- provide a clear bilingual Greek and English summary of the composition
  outputs;
- keep Calculated, Estimated, and Heuristic visibly distinct;
- show partial, unavailable, provenance, confidence, coverage, maturity, and
  limitation information at the point where it matters;
- explain contributors, exclusions, and missing evidence through the existing
  help or explanation pattern;
- keep internal formula/process versions, implementation identifiers, and
  other debug-only metadata out of normal product copy;
- remain usable at the supported mobile and desktop widths and preserve
  keyboard and accessible-name requirements.

This issue integrates the outputs from issues 008–011. It must not add Process
effects, named-product classification, or a new backend surface.

## Acceptance criteria

- [x] The workspace exposes the complete composition result set from issues
  008–011 in a coherent summary reachable from the existing Formula Analysis
  Workspace.
- [x] Every metric is labeled in both languages and identifies whether it is
  Calculated, Estimated, or Heuristic.
- [x] Partial or unavailable outputs explain what is missing and do not display an
  unknown contribution as zero.
- [x] Provenance, coverage, confidence, maturity, and limitations are available
  without overwhelming the primary summary.
- [x] The view does not claim to include Process analysis or product
  classification.
- [x] Responsive behavior, keyboard navigation, focus visibility, and contrast
  remain acceptable at the supported widths.
- [x] Automated tests cover SC-CO-001 through SC-CO-009, with scenario coverage
  mapped to the delivered UI.

## Artifact sync required

- Application PRD: none; this is implementation of already-specified capability
  scope.
- Application architecture summary: none; the existing frontend-only boundary
  remains valid.
- Owning capability node and artifacts: required. On acceptance, update the
  node state only if all required child work is complete; synchronize
  orchestration-status.md and any contract or scenario clarification made
  during implementation.
- Shared bilingual support and shared trust artifacts: required if reusable
  wording or rendering vocabulary changes.
- Issue registry: required.
- Node issue references: required.

Reason: capability implementation only. No product-level requirement,
cross-capability architecture, or repository-topology change is expected.

## Blocked by

- Issue 008 — Deterministic composition baseline
- Issue 009 — Composition evidence and partial results
- Issue 010 — Effective hydration and absorption
- Issue 011 — Intrinsic heuristic metrics

## User stories addressed

The capability PRD uses functional requirements rather than user-story IDs.
This issue addresses FR-CO-001 through FR-CO-007.

## Artifact anchors

- Workspace integration requirements:
  docs/architecture/composition-intrinsic-metrics/prd.md
- User-facing result semantics:
  docs/architecture/composition-intrinsic-metrics/canonical-use-cases.md
- Output contract:
  docs/architecture/composition-intrinsic-metrics/canonical-api-cli-contract.md
- Full acceptance scenario set:
  docs/architecture/composition-intrinsic-metrics/acceptance-scenarios.md
- Shared bilingual support: .okf/capabilities/shared/bilingual-content.md
- Shared trust vocabulary: .okf/capabilities/shared/trust-and-provenance.md

## Verification obligations

- Backend: not applicable.
- Frontend integration: required.
- End-to-end: catalog-only or deferred according to the root verification
  policy; browser collection is appropriate for the final grouped review.
- Regression: existing lint, typecheck, build, and test commands must remain
  green.
- Accessibility: include keyboard, focus, accessible names, and contrast in
  the grouped review.

## Scenario traceability

| Source rule or use case | Acceptance scenario | Issue criterion | Executed verification |
| --- | --- | --- | --- |
| Composition summary presents deterministic totals | SC-CO-001 | Complete composition result is reachable in the workspace | Astro build and static route checks passed in npm run verify |
| Unknown and semantic classes remain visible | SC-CO-002, SC-CO-005 | Partial states and Calculated/Estimated/Heuristic labels render distinctly | IntrinsicMetricsPanel.svelte plus composition tests; passed in npm run verify |
| Availability and estimate explanation | SC-CO-004, SC-CO-006, SC-CO-007 | Effective metrics show estimate status, limitations, and canonical units | IntrinsicMetricsPanel.svelte and composition tests; passed in npm run verify |
| Formula/Process boundary and evidence explanation | SC-CO-008, SC-CO-009 | Summary does not claim Process effects and exposes explanation details | Domain API boundary and panel explanation details; passed in npm run verify |

## Implementation Record

- Added the bilingual IntrinsicMetricsPanel to the Formula Analysis Workspace.
- Rendered deterministic, estimated, and heuristic metrics with separate visual
  classes, partial/unavailable states, evidence coverage, confidence, and
  expandable explanations.
- Added responsive metric layout and keyboard-accessible native details,
  selects, and inputs; no backend or Process dependency was introduced.
- Added concise metric labels with bilingual help tooltips and removed the
  browser-native title tooltip so the custom help surface remains unobstructed.
- Verification: npm run verify passed — 11 test files, 50 tests, lint,
  typecheck, static build, and route checks.
- Artifact sync: metric-specific help copy reuses the existing bilingual
  `FieldHelp` pattern; shared bilingual and trust contracts required no change.
- Review status: implementation is complete and accepted in the grouped visual
  review for the complete Composition batch.

## Human review record

- Review disposition: approved
- Review date: 2026-09-08
- Review scope: grouped visual review of the complete composition summary in
  Greek and English at desktop and mobile widths, including deterministic,
  partial, estimated, heuristic, unavailable, provenance, and help states.
- Result: accepted; no blocking findings remain for this issue.
