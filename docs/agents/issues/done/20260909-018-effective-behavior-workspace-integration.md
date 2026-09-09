# Issue 018 — Effective behavior workspace integration

## Issue Metadata

- ID: 018
- Title: Effective behavior workspace integration
- Category: feature
- State: done
- Owning capability: Process and Effective Behavior
- Owning capability node: .okf/capabilities/formula-analysis-workspace/process-effective-behavior.md
- Artifact root: docs/architecture/process-effective-behavior
- Delivery order: 6 of 6
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
- .okf/capabilities/shared/bilingual-content.md

## What to build

Integrate the completed Process-effective analysis into the bilingual Formula
Analysis Workspace. The user should be able to understand what is intrinsic to
the composition, what changes under the selected Process, how much of the
analysis is covered, and why a value is unavailable or only heuristic.

The integration must:

- present effective behavior beside or below the existing composition summary
  without conflating the two;
- distinguish intrinsic metrics from process-adjusted metrics and distinguish
  Calculated, Estimated, and Heuristic semantics where applicable;
- show the analysis outcome, coverage, confidence/limitations, Formula and
  Process revisions, model/policy version, and feature contributors in a
  human-readable way;
- make partial, conflict, missing-process, empty-order, and unsupported-rule
  states understandable with recovery or next-step guidance;
- expose explanations for mixing, aeration, fermentation, addition order,
  lamination, thermal, and geometry contributions using the existing bilingual
  help/explanation pattern;
- keep debug-only implementation identifiers and raw internal revision strings
  out of normal product copy unless presented in an intentional diagnostic
  detail surface;
- preserve the existing Greek/English route parity, responsive layout,
  keyboard navigation, focus visibility, accessible names, and contrast; and
- avoid claiming classification, similarity, exact kinetics, guaranteed rise,
  or calibrated prediction before those capabilities are delivered.

This issue integrates issues 013–017; it does not introduce a backend/API or
change the application-level product architecture.

## Acceptance criteria

- [x] Effective behavior is reachable from the existing workspace and is
  clearly separated from composition/intrinsic results.
- [x] The workspace communicates completed, partial, conflict, and missing
  process states with coverage, limitations, and recovery guidance.
- [x] Every displayed effective value exposes its semantic class where
  applicable, model/policy version, and relevant feature contributors.
- [x] The bilingual Greek and English surfaces have equivalent meaning and
  required-key parity; no debug-only strings appear in ordinary product copy.
- [x] Mixing, aeration, fermentation, addition order, lamination, thermal, and
  geometry explanations are reachable without implying unsupported precision.
- [x] Responsive layout, keyboard navigation, focus visibility, accessible
  names, and contrast remain acceptable at supported desktop and mobile widths.
- [x] Automated tests cover SC-PR-006 through SC-PR-009 and the integration
  preserves the existing regression suite.

## Artifact sync required

- Application PRD: none; this implements already-specified capability scope.
- Application architecture summary: none; the existing frontend-only boundary
  remains valid.
- Owning capability node and artifacts: required; synchronize the node,
  orchestration status, and any contract/scenario clarification at acceptance.
- Shared Trust/Provenance: none; reuse existing result-state, coverage,
  confidence, limitation, and Unknown-is-not-zero vocabulary.
- Shared Bilingual Content: none; reuse the existing locale/parity policy and
  FieldHelp/explanation pattern without changing shared route rules.
- Issue registry: required.
- Node issue references: required.

Reason: capability-local workspace integration. No product-level requirement,
cross-capability architecture, or repository-topology change is expected.

## Blocked by

- Issue 014 — Mixing and aeration effects
- Issue 015 — Fermentation and proof behavior
- Issue 016 — Addition order and lamination effects
- Issue 017 — Thermal and geometry behavior

## Functional requirements addressed

This issue addresses the Process PRD requirements for effective behavior
presentation, coverage/limitations, versioned explanations, bilingual parity,
and the separation of Formula, Process, intrinsic, and effective results.

## Artifact anchors

- Workspace and process requirements:
  docs/architecture/process-effective-behavior/prd.md
- Effective result semantics:
  docs/architecture/process-effective-behavior/canonical-domain-model.md
- User-facing result contract:
  docs/architecture/process-effective-behavior/canonical-api-cli-contract.md
- Effective evaluation and explanation:
  docs/architecture/process-effective-behavior/canonical-use-cases.md
- Full process scenario catalog:
  docs/architecture/process-effective-behavior/acceptance-scenarios.md
- Shared bilingual policy: .okf/capabilities/shared/bilingual-content.md
- Shared trust vocabulary: .okf/capabilities/shared/trust-and-provenance.md

## Verification obligations

- Policy source: .okf/project.md
- Backend boundary: not applicable.
- Frontend integration: planned and required for the workspace surface.
- End-to-end: deferred: catalog-only; the grouped browser review is the
  supported visual check because no E2E harness exists.
- Accessibility: include keyboard, focus, accessible names, and contrast in
  the grouped review.
- Regression: existing lint, typecheck, build, and test commands must remain
  green.

## Scenario traceability

| Source rule or use case | Acceptance scenario | Issue criterion | Planned verification |
| --- | --- | --- | --- |
| Process revisions do not rewrite intrinsic metrics | SC-PR-006 | Intrinsic/effective separation is visible | Domain and workspace integration tests |
| Missing Process is partial | SC-PR-007 | Coverage, limitations, and fallback are visible | Domain and bilingual UI checks |
| Reference mismatch is recoverable | SC-PR-008 | Conflict state and recovery guidance render | Handoff/workspace integration check |
| Effective explanations show contributors and prerequisites | SC-PR-009 | Version, contributors, and missing inputs are reachable | Domain tests plus grouped visual review |

## Human review gate

This issue is AFK with one grouped visual review after the complete Process
batch 013–018. Review must cover Greek and English, desktop and mobile widths,
partial/conflict/empty-order states, help explanations, keyboard/focus behavior,
and contrast.

## Implementation Record

- Added the bilingual `EffectiveBehaviorPanel` to the existing Formula
  Analysis Workspace with outcome, coverage, confidence, metric cards,
  contributors, missing prerequisites, limitations, and conflict recovery.
- Kept effective metrics visibly separate from composition/intrinsic metrics,
  exposed Formula/Process revisions in an intentional analysis-basis detail
  surface, and synchronized English/Greek message keys.
- Verification: `npm run verify` passed, including locale parity, 59 tests,
  lint, typecheck, Astro build, and static route checks.
- Artifact impact: capability-local implementation only; no product-level
  contract or architecture change.

## Human review status

Implementation and the grouped visual review for issues 013–018 were approved
by the user on 2026-09-09.
