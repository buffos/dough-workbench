# Issue 031 — Counterfactual comparison and recovery states

## Issue Metadata

- ID: 031
- Title: Counterfactual comparison and recovery states
- Category: feature
- State: done
- Owning capability: Interactive Formula Exploration
- Owning capability node: .okf/capabilities/interactive-exploration.md
- Artifact root: docs/architecture/interactive-exploration
- Delivery order: 4 of 5
- Execution type: AFK
- Review gate: none
- Review mode: no individual human review; grouped review belongs to issue 032

## Parent Artifacts

- docs/architecture/interactive-exploration/prd.md
- docs/architecture/interactive-exploration/domain-glossary.md
- docs/architecture/interactive-exploration/canonical-domain-model.md
- docs/architecture/interactive-exploration/canonical-use-cases.md
- docs/architecture/interactive-exploration/canonical-api-cli-contract.md
- docs/architecture/interactive-exploration/acceptance-scenarios.md
- docs/architecture/interactive-exploration/readiness-review.md
- .okf/capabilities/interactive-exploration.md
- .okf/capabilities/shared/trust-and-provenance.md
- .okf/project.md

## What to build

Implement the semantic ComparisonResult and its failure/recovery contract.
Compare the immutable baseline and counterfactual results without coercing
unavailable values to zero. Report changed paths, changed metrics, unchanged
metrics, availability changes, evidence, model versions, and limitations.

Make partial evaluation visibly distinct from rejection. Detect stale or
foreign references and model-version mismatches as conflicts, and keep the
baseline usable after invalid patches, rejected Formula/Process analysis, or
partial counterfactual output. The result must provide the recovery data that
the final bilingual workspace will render.

## Acceptance criteria

- [x] ComparisonResult contains baseline and counterfactual snapshots when
  evaluation completes, the ordered changed paths, semantic metric changes,
  availability changes, evidence, and diagnostics.
- [x] A metric is classified as changed only when comparable semantic values
  differ; unchanged means comparable values are equal; unavailable remains
  unavailable and is never treated as numeric zero.
- [x] A counterfactual that loses evidence returns a partial outcome with
  deterministic values still visible and explicit limitations for affected
  estimates or heuristics.
- [x] Invalid patch values, invalid Formula/Process results, stale revisions,
  foreign Formula/Process references, and model-version mismatches produce
  rejected or conflict outcomes with stable diagnostic and recovery codes.
- [x] A rejected or conflicted counterfactual has no successful result
  masquerading as a comparison, and the immutable baseline remains available
  for retry or reset.
- [x] Comparisons using different model versions are not presented as normal
  deltas; the mismatch is explicit and includes the available/requested
  version context.
- [x] Unit and application tests cover changed, unchanged, unavailable,
  partial, rejected, stale, foreign-reference, and model-version-conflict
  outcomes.

## Artifact sync required

- Application PRD: none; these outcomes and recovery states are already
  specified in the capability contract and scenario catalog.
- Application architecture summary: none; the existing diagnostic/result
  boundary and local analysis architecture remain unchanged.
- Owning capability node/artifacts: required; retain the issue reference on
  .okf/capabilities/interactive-exploration.md and record implementation
  evidence in the orchestration status during closeout.
- Shared Trust, Provenance, and Uncertainty: no policy change; this issue
  enforces the existing Unknown-is-not-zero, confidence, coverage, and
  provenance rules.
- Issue registry: required; node issues reference: required when .okf exists.
- Reason/no-impact decision: capability-local comparison semantics and
  diagnostics; no new product boundary, backend, persistence, or topology
  change.

The application-synthesis gate is current and remains unchanged.

## Blocked by

- None — issues 029–030 are implemented and archived.

## Functional requirements addressed

The parent PRD has no numbered user stories. This issue addresses functional
requirements 2, 5, and 7 and canonical scenarios SC-EX-005, SC-EX-006, and
SC-EX-007.

## Artifact anchors

- Use cases: EvaluateCounterfactual and GetCounterfactualExplanation
- Contract: ComparisonResult outcomes completed, partial, rejected, conflict
- Failure model: invalid_patch_value, baseline_revision_conflict,
  model_version_mismatch, counterfactual_formula_invalid, and
  counterfactual_analysis_partial

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-EX-005 | not-applicable | verified by `src/lib/domain/exploration.test.ts` | deferred: no E2E harness |
| SC-EX-006 | not-applicable | verified by `src/lib/domain/exploration.test.ts` | deferred: no E2E harness |
| SC-EX-007 | not-applicable | verified by `src/lib/domain/exploration.test.ts` | deferred: no E2E harness |

## Delivery evidence

- Implemented semantic metric comparison with changed, unchanged, unavailable,
  and availability-change states, plus Formula/Process revisions, evidence,
  model versions, and limitations.
- Implemented partial, rejected, stale, foreign-reference, and model-version
  conflict recovery without presenting an invalid counterfactual as a normal
  comparison.
- Verification: `npm test`, `npm run lint`, `npm run typecheck`, and
  `git diff --check` passed. Astro build/static-route verification remains
  deferred under the user-managed local preview policy.
