# Issue 023 — Classification feature snapshot and family gates

## Issue Metadata

- ID: 023
- Title: Classification feature snapshot and family gates
- Category: feature
- State: ready-for-agent
- Owning capability: Classification, Similarity, and Explanation
- Owning capability node: .okf/capabilities/formula-analysis-workspace/classification-similarity-explanation.md
- Artifact root: docs/architecture/classification-similarity-explanation
- Delivery order: 1 of 5
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
- .okf/capabilities/shared/bilingual-content.md
- .okf/project.md

## What to build

Create the framework-independent `ClassificationFeatureSet` boundary and its
application adapter. It must assemble the classifier input from normalized
formula data, intrinsic composition metrics, effective Process metrics, and
the resolved versioned prototype catalog. The snapshot must retain typed
known/none/unknown states, coverage, confidence, provenance, formula/Process
revisions, and catalog/model identity.

The slice also evaluates hierarchical structural family gates and returns
multi-label family memberships without reading raw ingredient display names.
Critical missing or conflicting evidence remains explicit for later outcome
resolution; it is not converted into a fabricated match. Invalid snapshots and
unavailable catalog/model versions must be explicit diagnostics. This is the
classifier input and family-membership foundation; named-prototype ranking and
the rendered workspace belong to later issues.

## Acceptance criteria

- [x] A normalized Formula/Process reference produces a versioned
  `ClassificationFeatureSet` containing only effective metrics and Process
  features, never raw ingredient names.
- [x] The snapshot preserves known, explicit-none, and unknown values together
  with feature provenance, coverage, confidence, and formula/Process/model
  revisions.
- [x] Family gates resolve hierarchical, multi-label memberships and retain
  the evidence needed to distinguish a supported family from an unavailable or
  structurally conflicted family.
- [x] An invalid feature snapshot or unavailable catalog/model version returns
  an explicit diagnostic and never selects a silent fallback.
- [x] Automated tests cover SC-CL-001, SC-CL-002, SC-CL-007, and the input side
  of SC-CL-008.

## Artifact sync required

- Application PRD: none; this implements the already-specified classification
  input boundary and does not change product scope or user journeys.
- Application architecture summary: none; the framework-independent domain and
  existing frontend-only dependency direction remain unchanged.
- Owning capability node/artifacts: required; update the classification node
  and its orchestration status with the implementation record.
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: capability-local domain/application work; no new
  actor, backend, persistence, topology, or cross-capability boundary.

The application-synthesis gate is current: `docs/prd.md` and
`docs/architecture/application-architecture-summary.md` link the exact
capability artifacts and have no unresolved High or Medium findings.

## Blocked by

None — the composition, effective-behavior, and prototype-catalog inputs are
already implemented.

## Functional requirements addressed

The parent PRD has no numbered user stories. This issue addresses functional
requirements 1, 2, 3, and 5, and canonical scenarios SC-CL-001, SC-CL-002,
SC-CL-007, and the feature-input portion of SC-CL-008.

## Artifact anchors

- Domain model: `ClassificationFeatureSet`, `PrototypeInheritancePolicy`, and
  `FamilyGatePolicy`
- Use cases: `ClassifyFormula` and `GetFamilyMemberships`
- Contract: `ClassificationRequest.featureSnapshot`
- Trust policy: unknown values, coverage, confidence, and provenance

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-CL-001 | not-applicable | deferred: domain/application input slice; rendered coverage is owned by 027 | deferred: no E2E harness |
| SC-CL-002 | not-applicable | deferred: family output is consumed by 027 | deferred: no E2E harness |
| SC-CL-007 | not-applicable | deferred: unknown-state rendering is consumed by 027 | deferred: no E2E harness |
| SC-CL-008 | not-applicable | deferred: conflict presentation is consumed by 025 and 027 | deferred: no E2E harness |

## Scenario traceability

| Source rule or use case | Acceptance scenario | Issue criterion | Planned verification | Closure evidence |
| --- | --- | --- | --- | --- |
| Classifier consumes effective metrics and Process features, not raw names | SC-CL-001 | Feature snapshot excludes raw ingredient names | Domain unit test with equivalent functional inputs and different names | To be recorded at implementation |
| Family membership is hierarchical and multi-label | SC-CL-002 | Family gates retain multiple supported memberships | Domain unit test with two supported family gates | To be recorded at implementation |
| Unknown is not zero | SC-CL-007 | Typed unknown state lowers available evidence without zero substitution | Domain unit test for missing Process/composition features | To be recorded at implementation |
| Structural conflicts remain visible | SC-CL-008 | Gate evidence retains missing/conflicting constraint state | Domain unit test for missing lamination evidence | To be recorded at implementation |

## Implementation record

- Added the framework-independent classification feature snapshot boundary and
  application adapter in `src/lib/domain/classification.ts` and
  `src/lib/application/formula-workspace.ts`.
- Added the explicit expert-seed qualitative band policy in
  `src/data/models/classification-model.ts`; it is versioned and marked as
  calibration-limited rather than presented as calibrated physical truth.
- Added family-gate evidence for hierarchical multi-label memberships,
  typed unknown/none states, provenance, coverage, and explicit unavailable
  model diagnostics.
- Verification: `npx vitest run src/lib/domain/classification.test.ts` passed
  with 4 tests; `npm run typecheck` passed.

## Human review gate

None. This issue changes the domain/application boundary only and introduces no
rendered UI or UX.
