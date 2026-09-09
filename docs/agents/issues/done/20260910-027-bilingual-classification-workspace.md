# Issue 027 — Bilingual classification workspace

## Issue Metadata

- ID: 027
- Title: Bilingual classification workspace
- Category: feature
- State: done
- Owning capability: Classification, Similarity, and Explanation
- Owning capability node: .okf/capabilities/formula-analysis-workspace/classification-similarity-explanation.md
- Artifact root: docs/architecture/classification-similarity-explanation
- Delivery order: 5 of 5
- Execution type: AFK
- Review gate: visual-review
- Review mode: grouped review after issues 023–027 are implemented

## Parent Artifacts

- docs/architecture/classification-similarity-explanation/prd.md
- docs/architecture/classification-similarity-explanation/domain-glossary.md
- docs/architecture/classification-similarity-explanation/canonical-domain-model.md
- docs/architecture/classification-similarity-explanation/canonical-use-cases.md
- docs/architecture/classification-similarity-explanation/canonical-api-cli-contract.md
- docs/architecture/classification-similarity-explanation/acceptance-scenarios.md
- docs/architecture/classification-similarity-explanation/readiness-review.md
- .okf/capabilities/formula-analysis-workspace/classification-similarity-explanation.md
- .okf/capabilities/shared/bilingual-content.md
- .okf/capabilities/shared/trust-and-provenance.md
- .okf/project.md

## What to build

Integrate the classification result into the existing bilingual formula
analysis workspace on the English and Greek journeys. Present the structural
family interpretation first, then nearby prototype candidates, with separate
composition, Process, and overall identity similarity labels whenever those
values are available. Show confidence, coverage, model maturity/provenance,
limitations, and the canonical outcome without calling similarity probability.

Provide expandable explanation evidence for contributions, conflicts, missing
inputs, inherited rules, and identity modifiers. Render clear localized states
for partial evidence, no strong match, hybrid evidence, stale references, and
unavailable model versions, with recovery guidance and no silent fallback. The
surface must use the existing static Astro/Svelte architecture, remain
responsive, and preserve accessible keyboard/focus/contrast behavior.

## Acceptance criteria

- [x] The formula workspace exposes the classification result in both `/en/`
  and `/el/` journeys without a backend or persistence requirement.
- [x] Multi-label family memberships, candidate statuses, separate similarity
  dimensions, confidence, coverage, and model maturity are visible with clear
  non-probabilistic wording.
- [x] Strong, structural, hybrid, no-strong-match, partial, conflicted, stale,
  and unavailable-model states render with localized explanations and recovery
  guidance.
- [x] The expandable explanation surface faithfully presents contributions,
  missing inputs, conflicts, inherited rules, identity modifiers, and
  provenance from issue 026.
- [x] English and Greek keys have parity and equivalent meaning; raw matcher
  IDs are not ordinary product copy.
- [x] Responsive layout, keyboard navigation, focus visibility, accessible
  names, and contrast remain acceptable at supported desktop and mobile widths.
- [x] Automated locale, typecheck, lint, and test checks pass. Static-route
  artifact verification is explicitly deferred to the user-managed Astro build
  under the project's `when-supported` verification policy.

## Artifact sync required

- Application PRD: none; this exposes the already-specified analysis journey
  and does not add actors, workflows, or MVP scope.
- Application architecture summary: none; the existing Svelte island,
  framework-independent domain boundary, and static deployment architecture
  remain unchanged.
- Owning capability node/artifacts: required; update the classification node
  and orchestration status with the integration and review record.
- Shared Bilingual Content and Localization: required to verify new UI,
  diagnostic, accessibility, and explanation keys; no shared policy change is
  expected.
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: capability-local presentation integration using
  existing shared policies; no backend, persistence, topology, or new product
  boundary.

The application-synthesis gate is current and remains unchanged.

## Blocked by

None — issues 023–026 are implemented and archived.

## Functional requirements addressed

The parent PRD has no numbered user stories. This issue completes the rendered
surface for functional requirements 1–7 and canonical scenarios SC-CL-001
through SC-CL-009.

## Artifact anchors

- Use cases: `ClassifyFormula`, `RecalculateSimilarity`, and
  `ExplainClassification`
- Contract: `ClassificationResult` and `PrototypeSimilarity`
- Shared policies: bilingual parity, similarity-vs-probability wording,
  unknown handling, confidence, coverage, and provenance

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-CL-001 | not-applicable | planned: formula-workspace integration and locale parity tests | deferred: no E2E harness |
| SC-CL-002 | not-applicable | planned: multi-label family result surface | deferred: no E2E harness |
| SC-CL-003 | not-applicable | planned: separate score-dimension rendering | deferred: no E2E harness |
| SC-CL-004 | not-applicable | planned: similarity wording/accessibility checks | deferred: no E2E harness |
| SC-CL-005 | not-applicable | planned: no-strong-match surface | deferred: no E2E harness |
| SC-CL-006 | not-applicable | planned: hybrid surface | deferred: no E2E harness |
| SC-CL-007 | not-applicable | planned: unknown/coverage explanation surface | deferred: no E2E harness |
| SC-CL-008 | not-applicable | planned: conflict and recovery surface | deferred: no E2E harness |
| SC-CL-009 | not-applicable | planned: expandable explanation fidelity surface | deferred: no E2E harness |

## Verification deferral

Static-route verification was explicitly deferred by the user because the
local Astro build and preview are user-managed. The existing `dist/` directory
is stale, and running `npm run check:static` against it reports that the
generated `/en/catalog/` shell is missing. The source routes and the local
development journey were reviewed in both locales. The deferred check can be
completed after the user runs the current Astro build and static-route check.

## Scenario traceability

| Source rule or use case | Acceptance scenario | Issue criterion | Planned verification | Closure evidence |
| --- | --- | --- | --- | --- |
| Family result remains multi-label | SC-CL-002 | All supported memberships remain visible | Component/integration test and grouped visual review | Implemented; user-approved grouped visual review on 2026-09-10 |
| Similarity dimensions remain separate and non-probabilistic | SC-CL-003, SC-CL-004 | Separate labels and wording are rendered | Locale/component tests and grouped visual review | Implemented; user-approved grouped visual review on 2026-09-10 |
| No-match and hybrid outcomes are valid | SC-CL-005, SC-CL-006 | Distinct localized outcome states are reachable | Component tests and grouped visual review | Implemented; user-approved grouped visual review on 2026-09-10 |
| Unknown/conflict evidence remains visible | SC-CL-007, SC-CL-008 | Limitations, conflicts, and recovery guidance are shown | Component tests and grouped visual review | Implemented; user-approved grouped visual review on 2026-09-10 |
| Explanation matches the calculation | SC-CL-009 | Expanded evidence uses the returned explanation object | Component test plus grouped visual review | Implemented; user-approved grouped visual review on 2026-09-10 |

## Human review gate

The required grouped visual review was completed and approved by the user on
2026-09-10. The complete English and Greek formula-analysis journeys were
accepted, including the responsive layout, family memberships, candidate
cards, separate similarity labels, partial, hybrid, no-match, conflict,
unavailable-model, stale-reference, and expanded explanation states. No
separate human reviews were performed for issues 023–026.

## Implementation record

- Added `src/components/ClassificationPanel.svelte` to present the result in
  the existing formula workspace. It shows family memberships first, then
  candidate comparisons, separate Composition/Process/overall similarity,
  coverage, confidence, model maturity, and expandable evidence.
- Integrated classification into the full analysis path in
  `src/components/FormulaWorkspace.svelte`. Composition-only analysis remains
  separate; the full check now also runs the type comparison. Editing either
  Formula or Process clears the previous classification result.
- Added bilingual classification, diagnostic, recovery, evidence, and
  analysis-path copy in `src/lib/i18n/messages.ts`. Stable matcher IDs remain
  internal or inside collapsed technical metadata, never ordinary copy.
- Added an explicit display limit of eight ranked family memberships and eight
  ranked prototype candidates. The full classifier result remains available to
  the calculation layer; the UI renders only the most relevant eight and
  reports when additional results are hidden.
- Verification: `npm test` passed with 77 tests, `npm run lint` passed, and
  `npm run typecheck` passed. The Astro build/static-route check was not rerun
  because the user manages the local Astro preview; `dist/` therefore still
  reflects the previous local build.

## Human review status

Accepted by the user on 2026-09-10 after the single grouped visual review for
the batch. No separate human review is required for issues 023–026.
