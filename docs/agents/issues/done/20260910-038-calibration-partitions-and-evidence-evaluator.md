# Issue 038 — Calibration partitions and evidence evaluator

## Issue Metadata

- ID: 038
- Title: Calibration partitions and evidence evaluator
- Category: feature
- State: done
- Owning capability: Validation and Calibration
- Owning capability node: .okf/capabilities/validation-calibration.md
- Artifact root: docs/architecture/validation-calibration
- Delivery order: 10 of 12
- Execution type: AFK
- Review gate: none
- Review mode: None; this issue is maintainer/evaluation logic with no rendered
  UI/UX change

## Parent Artifacts

- docs/architecture/validation-calibration/prd.md
- docs/architecture/validation-calibration/domain-glossary.md
- docs/architecture/validation-calibration/canonical-domain-model.md
- docs/architecture/validation-calibration/canonical-use-cases.md
- docs/architecture/validation-calibration/canonical-api-cli-contract.md
- docs/architecture/validation-calibration/acceptance-scenarios.md
- docs/architecture/validation-calibration/readiness-review.md
- .okf/capabilities/validation-calibration.md
- docs/agents/adr/0007-staged-calibration-dataset.md
- .okf/project.md

## What to build

Implement the deterministic evidence evaluator that prepares calibration
inputs from a verified release while keeping dataset roles and evaluation
partitions separate. It must record the exact data release, model/protocol
versions, partition membership, quality weights, and evidence coverage used by
an evaluation. Validation/test evidence is held out from fitting, and any
test leakage or invalid partition assignment fails explicitly.

This issue produces maintainer-readable evaluation data and diagnostics; it
does not add a public calibration console or imply that the current model is
scientifically calibrated.

## Acceptance criteria

- [x] The evaluator accepts only a verified release and an explicit evaluation
  protocol with declared fitting/evaluation partitions and quality weights.
- [x] Dataset roles (`reference`, `calibration`) remain separate from
  evaluation partitions (`calibration`, `validation`, `test`) in the result;
  dual-role records are represented without collapsing the concepts.
- [x] Calibration fitting input excludes validation and test records, and test
  leakage produces the canonical `test_leakage` failure with no candidate
  parameter release claiming the requested maturity.
- [x] Missing or invalid partition assignment, insufficient evidence, invalid
  weights, and release/version mismatch produce explicit diagnostics rather
  than silently dropping records or using another release.
- [x] Gold/high-quality evidence receives the declared stronger weight than
  broad/noisy evidence when both are used for the same calibration purpose;
  weights and included record IDs are retained in the report.
- [x] Repeating evaluation with identical release, model, protocol, partition,
  and weight versions produces equivalent evidence identity and outcomes.
- [x] Unit tests cover partition isolation, test leakage, role/partition
  distinction, quality weighting, missing evidence, reproducibility, and
  Unknown handling.

## Artifact sync required

- Application PRD: none; evaluator semantics and the no-public-console V1
  boundary are already specified.
- Application architecture summary: none; this remains a local/static
  maintainer evaluation path and does not add runtime infrastructure.
- Owning capability node/artifacts: required: .okf/capabilities/validation-calibration.md
  and docs/architecture/validation-calibration/orchestration-status.md
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: implementation of the specified evidence
  isolation policy; update delivery truth and keep the public frontend
  consumer-only for calibration results.

## Human review gate

None. This issue has no rendered UI/UX change. Its acceptance is based on
deterministic evaluation tests and explicit evidence reports.

## Blocked by

- Blocked by —

## Artifact anchors

- PRD: FR-VC-013 and FR-VC-014; Evaluate and calibrate a model release
- Domain model: ModelParameterRelease, CalibrationEvaluation,
  EvaluationIsolationPolicy, invariants 10–12, and evidence maturity lifecycle
- Use cases: InspectCalibrationEvidence and EvaluateModelRelease
- Contract: Verify a release, future model-evaluation mapping, and
  `partition_violation` / `test_leakage` diagnostics

## Acceptance scenarios addressed

- SC-VC-011 — Release reproducibility
- SC-VC-012 — Invalid records cannot be published
- SC-VC-013 — Roles and evaluation partitions remain separate
- SC-VC-014 — No test leakage

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-VC-011 | not-applicable | not-applicable | not-applicable: maintainer/evaluation contract |
| SC-VC-012 | not-applicable | not-applicable | not-applicable: maintainer/evaluation contract |
| SC-VC-013 | not-applicable | not-applicable | not-applicable: maintainer/evaluation contract |
| SC-VC-014 | not-applicable | not-applicable | not-applicable: maintainer/evaluation contract |

## Implementation record

Implemented the deterministic calibration evidence evaluator in
`src/lib/domain/calibration.ts`. It verifies the release before evaluation,
requires a complete positive quality-weight map, rejects duplicate or
overlapping partition declarations, and keeps dataset roles separate from
calibration/validation/test membership. Fitting records are restricted to
declared calibration evidence; validation and test records are retained as
held-out IDs, and test leakage, invalid partitions, invalid weights, version
mismatches, insufficient evidence, and Unknown fit evidence produce explicit
diagnostics.

The evaluator retains release/model/protocol/weight identities, record IDs,
quality weights, formula evidence counts, process coverage, and reproducible
evaluation identity. Tests cover isolation, leakage, role/partition
distinction, stronger high-quality weighting, invalid protocol/partition
handling, Unknown evidence, and reproducibility.

## Verification

- `npm test` — passed (23 test files, 126 tests).
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `git diff --check` — passed; only Git's LF/CRLF normalization warnings.
- No rendered UI/UX changed; no human review gate applies.
