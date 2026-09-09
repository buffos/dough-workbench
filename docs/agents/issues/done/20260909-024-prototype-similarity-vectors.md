# Issue 024 — Prototype similarity vectors

## Issue Metadata

- ID: 024
- Title: Prototype similarity vectors
- Category: feature
- State: ready-for-agent
- Owning capability: Classification, Similarity, and Explanation
- Owning capability node: .okf/capabilities/formula-analysis-workspace/classification-similarity-explanation.md
- Artifact root: docs/architecture/classification-similarity-explanation
- Delivery order: 2 of 5
- Execution type: AFK
- Review gate: none

## Parent Artifacts

- docs/architecture/classification-similarity-explanation/prd.md
- docs/architecture/classification-similarity-explanation/domain-glossary.md
- docs/architecture/classification-similarity-explanation/canonical-domain-model.md
- docs/architecture/classification-similarity-explanation/canonical-use-cases.md
- docs/architecture/classification-similarity-explanation/canonical-api-cli-contract.md
- docs/architecture/classification-similarity-explanation/acceptance-scenarios.md
- docs/architecture/classification-similarity-explanation/readiness-review.md
- .okf/capabilities/formula-analysis-workspace/classification-similarity-explanation.md
- .okf/capabilities/shared/trust-and-provenance.md
- .okf/project.md

## What to build

Evaluate the resolved prototype definitions against the feature snapshot and
return deterministic `SimilarityVector` values for the declared dimensions:
composition similarity, Process similarity, and overall identity similarity.
Each dimension must use only its declared feature group and preserve whether
the evidence was available, missing, or structurally incompatible.

The first model is the versioned expert-seed/calibration-limited matcher. Any
numeric mapping must live in versioned model data and be exposed as a bounded
similarity score, never as probability or calibrated sensory certainty. Where
the seed model has no numeric policy for a dimension, the score is omitted and
the limitation is explicit. Confidence remains a separate evidence value.

## Acceptance criteria

- [x] A resolved prototype and feature snapshot produce a deterministic
  similarity vector with separate composition, Process, and overall identity
  fields.
- [x] Holding composition constant while changing Process leaves composition
  similarity unchanged, while Process and overall identity may change.
- [x] Similarity scores, when present, are bounded and labelled as similarity;
  the implementation never labels or derives them as probability.
- [x] Missing features reduce coverage and omit/limit the affected dimension;
  unknown values are not treated as zero evidence and confidence is not copied
  from similarity.
- [x] All scoring parameters and any qualitative-to-numeric mapping are tied to
  a declared model version rather than embedded in UI code.
- [x] Automated tests cover SC-CL-003, SC-CL-004, and the similarity portion of
  SC-CL-007.

## Artifact sync required

- Application PRD: none; this implements the specified similarity contract and
  does not change the product journey or calibration scope.
- Application architecture summary: none; the existing framework-independent
  domain boundary remains valid.
- Owning capability node/artifacts: required; update the classification node
  and orchestration status with the matcher implementation and model reference.
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: capability-local model/domain work. Validation
  and Calibration remains the owner of future calibrated weights and dataset
  evidence; this issue does not promote or define that foggy capability.

The application-synthesis gate is current: `docs/prd.md` and
`docs/architecture/application-architecture-summary.md` remain aligned with
the capability artifacts.

## Blocked by

None — issue 023 is implemented and archived.

## Functional requirements addressed

The parent PRD has no numbered user stories. This issue addresses functional
requirements 1, 3, 4, 5, and 7, and canonical scenarios SC-CL-003,
SC-CL-004, and the similarity portion of SC-CL-007.

## Artifact anchors

- Domain model: `SimilarityVector` and `SimilarityPolicy`
- Use cases: `ClassifyFormula` and `RecalculateSimilarity`
- Contract: `PrototypeSimilarity`
- Shared policy: similarity is not probability; confidence is independent

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-CL-003 | not-applicable | deferred: domain/application vector slice; rendered comparison is owned by 027 | deferred: no E2E harness |
| SC-CL-004 | not-applicable | deferred: score labels are rendered by 027 | deferred: no E2E harness |
| SC-CL-007 | not-applicable | deferred: limitation rendering is owned by 027 | deferred: no E2E harness |

## Scenario traceability

| Source rule or use case | Acceptance scenario | Issue criterion | Planned verification | Closure evidence |
| --- | --- | --- | --- | --- |
| Composition and Process similarity are separate | SC-CL-003 | Composition score is invariant to Process-only changes | Deterministic paired-input domain test | To be recorded at implementation |
| Similarity is not probability | SC-CL-004 | Result semantics and model metadata use similarity vocabulary | Contract/domain assertion and diagnostic test | To be recorded at implementation |
| Missing features limit evidence | SC-CL-007 | Affected score is omitted/limited and coverage decreases | Unknown-feature domain test | To be recorded at implementation |

## Implementation record

- Added deterministic prototype-vector evaluation in
  `src/lib/domain/classification.ts` for composition, Process, and overall
  identity dimensions.
- Added versioned expert-seed band/scoring policy data in
  `src/data/models/classification-model.ts`; numeric values remain bounded
  similarity scores and are not presented as probability or calibrated sensory
  prediction.
- Similarity evaluation preserves unknown evidence, independent confidence,
  inherited feature evaluation, and candidate/support/conflict/unavailable
  statuses.
- Verification: `npx vitest run src/lib/domain/classification.test.ts` passed
  with 5 tests; `npm run typecheck` passed.

## Human review gate

None. This issue changes the versioned matcher/domain boundary only; its
user-facing labels are implemented and reviewed in 027.
