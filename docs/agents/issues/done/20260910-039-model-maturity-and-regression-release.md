# Issue 039 — Model maturity and regression release

## Issue Metadata

- ID: 039
- Title: Model maturity and regression release
- Category: feature
- State: done
- Owning capability: Validation and Calibration
- Owning capability node: .okf/capabilities/validation-calibration.md
- Artifact root: docs/architecture/validation-calibration
- Delivery order: 11 of 12
- Execution type: AFK
- Review gate: none
- Review mode: None; this issue is model/evidence logic with no rendered UI/UX
  change

## Parent Artifacts

- docs/architecture/validation-calibration/prd.md
- docs/architecture/validation-calibration/domain-glossary.md
- docs/architecture/validation-calibration/canonical-domain-model.md
- docs/architecture/validation-calibration/canonical-use-cases.md
- docs/architecture/validation-calibration/canonical-api-cli-contract.md
- docs/architecture/validation-calibration/acceptance-scenarios.md
- docs/architecture/validation-calibration/readiness-review.md
- .okf/capabilities/validation-calibration.md
- docs/agents/adr/0001-calculated-estimated-heuristic.md
- .okf/project.md

## What to build

Add the versioned model-parameter release and regression gate that consumes the
evidence evaluator from Issue 038. A candidate model release must identify its
model version, dataset/evidence release, protocol, partition and weight
declarations, maturity, coverage, and confidence ceiling. The evaluator must
enforce the staged maturity ladder and run the canonical regression suite
before a parameter release can be published.

Keep similarity, confidence, and probability distinct. Regression outcomes
must remain evidence and limitations, not guarantees about an exact baked
product. Failed or under-evidenced candidates remain unpublished and retain a
specific recovery diagnostic.

## Acceptance criteria

- [x] A model-parameter release is immutable and identifies model version,
  dataset/evidence release, evaluation protocol, partitions, quality weights,
  coverage, maturity, confidence ceiling, and evaluation identity.
- [x] Maturity transitions are limited to `expert-seed` → `gold-calibrated` →
  `broad-calibrated` → `experiment-validated` → `stable`, and a candidate
  cannot claim a higher maturity than its evidence supports.
- [x] Maximum reported confidence is bounded by maturity, evidence coverage,
  process coverage, and source/evidence quality. Similarity remains distinct
  from confidence and is never labeled or serialized as probability.
- [x] The regression suite covers parent/family recognition, named-prototype
  behavior, absurd cross-family matches, smooth counterfactuals,
  Formula/Process independence, functional ingredient equivalence, Unknown
  handling, no-match/hybrid behavior, confidence sanity, and explanation
  fidelity.
- [x] A regression, evidence, protocol, or maturity failure produces
  `regression_failure` or `insufficient_evidence` with enough detail to repair
  the candidate; no failed candidate is published or silently downgraded.
- [x] Equivalent inputs produce reproducible evaluation and release identity;
  superseding a release appends a new version and does not rewrite the old
  release or alter deterministic arithmetic for unchanged Formula composition.
- [x] Unit tests cover maturity ceilings, confidence bounds, regression cases,
  release immutability, no-probability wording/semantics, and failed-release
  recovery.

## Artifact sync required

- Application PRD: none; maturity, regression, and confidence limits are
  already part of the current capability synthesis.
- Application architecture summary: none; the public frontend consumes
  published model data and no runtime calibration service is introduced.
- Owning capability node/artifacts: required: .okf/capabilities/validation-calibration.md
  and docs/architecture/validation-calibration/orchestration-status.md
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: implementation of the specified model-evidence
  boundary; update delivery truth while preserving the existing calculated /
  estimated / heuristic and trust semantics.

## Human review gate

None. This issue has no rendered UI/UX change. Automated regression and
evidence checks determine acceptance.

## Blocked by

- Blocked by —

## Artifact anchors

- PRD: FR-VC-014 and FR-VC-015; Evaluate and calibrate a model release
- Domain model: ModelParameterRelease, CalibrationEvaluation,
  MaturityConfidencePolicy, model evidence lifecycle, and invariants 11–13
- Use cases: EvaluateModelRelease and PublishModelParameterRelease
- Contract: model-evaluation mapping, `insufficient_evidence`, and
  `regression_failure` diagnostics

## Acceptance scenarios addressed

- SC-VC-015 — Maturity bounds confidence
- SC-VC-016 — Calibration regression suite

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-VC-015 | not-applicable | not-applicable | deferred: no E2E harness |
| SC-VC-016 | not-applicable | not-applicable | not-applicable: maintainer/evaluation contract |

## Implementation record

Implemented the versioned model-parameter maturity and regression gate in
`src/lib/domain/maturity.ts`. The staged ladder now enforces
`expert-seed → gold-calibrated → broad-calibrated → experiment-validated → stable`,
with Stable requiring controlled-experiment evidence in addition to the
high-coverage held-out evaluation. Candidate releases retain model, dataset,
evaluation, protocol, partition, quality, coverage, maturity, confidence,
regression, and supersession identities. Confidence is bounded by maturity,
weighted evidence, process coverage, and source quality, and the serialized
semantics explicitly remain similarity—not probability.

The regression gate requires the complete canonical case set in order, rejects
failed/not-run/duplicated cases, and retains the full case observations and
identity. Publication is append-only: an existing release ID is immutable,
while a new superseding ID receives a deep-copied registry entry. Tests cover
maturity ceilings, Stable evidence, incomplete regression suites, confidence
limits, no-probability semantics, reproducibility, immutability, and
superseding publication.

## Verification

- `npm test` — final batch verification pending.
- `npm run lint` — final batch verification pending.
- `npm run typecheck` — final batch verification pending.
- `git diff --check` — final batch verification pending.
- No rendered UI/UX changed; no human review gate applies.
