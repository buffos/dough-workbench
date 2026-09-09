# Issue 025 — Classification outcomes and recovery diagnostics

## Issue Metadata

- ID: 025
- Title: Classification outcomes and recovery diagnostics
- Category: feature
- State: ready-for-agent
- Owning capability: Classification, Similarity, and Explanation
- Owning capability node: .okf/capabilities/formula-analysis-workspace/classification-similarity-explanation.md
- Artifact root: docs/architecture/classification-similarity-explanation
- Delivery order: 3 of 5
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

Aggregate family memberships and prototype similarity vectors into the
canonical classification outcome. The result must support `StrongMatch`,
`StructuralMatch`, `Hybrid`, `NoStrongCanonicalMatch`, and `Partial` without
forcing one named product when the evidence does not justify it.

Apply near-hard structural constraints before strong-match claims and keep
identity modifiers separate. Emit coverage and confidence independently, and
return explicit diagnostics for insufficient evidence, constraint conflicts,
unavailable models, invalid snapshots, and stale Formula/Process revisions.
Recovery must identify what can be refreshed or re-recorded; it must never
silently select another model or hide contradictory family evidence.

## Acceptance criteria

- [x] The aggregate returns all canonical outcome kinds and preserves multiple
  family memberships where evidence supports them.
- [x] A structural constraint conflict blocks a strong named match or marks it
  conflicted, while identity modifiers are reported separately and cannot
  repair the structural conflict.
- [x] Sparse or missing evidence produces `Partial` or
  `NoStrongCanonicalMatch` with lower coverage/confidence and nearby evidence,
  not a fabricated strong match.
- [x] Invalid input, unavailable model/catalog version, and stale analysis
  references produce explicit diagnostics with recovery guidance and no silent
  fallback.
- [x] Confidence and coverage are independently calculated and remain bounded
  in `[0,1]`.
- [x] Automated tests cover SC-CL-005, SC-CL-006, SC-CL-007, and SC-CL-008.

## Artifact sync required

- Application PRD: none; these are already-specified result and failure states
  within the existing analysis journey.
- Application architecture summary: none; no new boundary, persistence, or
  adapter is introduced.
- Owning capability node/artifacts: required; update the classification node
  and orchestration status with outcome and diagnostic evidence.
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: capability-local result-policy work. Trust and
  Provenance vocabulary is reused without changing its shared policy.

The application-synthesis gate is current and remains unchanged.

## Blocked by

None — issues 023 and 024 are implemented and archived.

## Functional requirements addressed

The parent PRD has no numbered user stories. This issue addresses functional
requirements 2, 5, and 6, and canonical scenarios SC-CL-002, SC-CL-005,
SC-CL-006, SC-CL-007, and SC-CL-008.

## Artifact anchors

- Domain model: `ClassificationOutcome`, `FamilyGatePolicy`, and
  `IdentityPolicy`
- Use cases: `ClassifyFormula` and `GetClassificationLimitations`
- Contract: `ClassificationResult.outcome`, `coverage`, `confidence`, and
  `diagnostics`
- Failure model: `insufficient_evidence`, `constraint_conflict`,
  `model_unavailable`, and `stale_analysis`

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-CL-002 | not-applicable | deferred: outcome rendering is owned by 027 | deferred: no E2E harness |
| SC-CL-005 | not-applicable | deferred: no-match surface is owned by 027 | deferred: no E2E harness |
| SC-CL-006 | not-applicable | deferred: hybrid surface is owned by 027 | deferred: no E2E harness |
| SC-CL-007 | not-applicable | deferred: limitation surface is owned by 027 | deferred: no E2E harness |
| SC-CL-008 | not-applicable | deferred: conflict/recovery surface is owned by 027 | deferred: no E2E harness |

## Scenario traceability

| Source rule or use case | Acceptance scenario | Issue criterion | Planned verification | Closure evidence |
| --- | --- | --- | --- | --- |
| No strong match is a valid result | SC-CL-005 | NoStrongCanonicalMatch includes nearby candidates and reasons | Outcome-policy unit tests | To be recorded at implementation |
| Conflicting families remain visible | SC-CL-006 | Hybrid preserves both memberships and evidence | Multi-family outcome test | To be recorded at implementation |
| Unknown is not zero | SC-CL-007 | Sparse input lowers coverage/confidence and avoids strong claim | Partial outcome test | To be recorded at implementation |
| Structural conflict is explicit | SC-CL-008 | Critical conflict produces conflicted/unavailable result and diagnostic | Constraint conflict test | To be recorded at implementation |

## Implementation record

- Added the canonical classification result/outcome policy and application
  adapter in `src/lib/domain/classification.ts` and
  `src/lib/application/formula-workspace.ts`.
- The policy preserves multi-label families, separates strong/structural,
  hybrid, no-strong-match, and partial outcomes, and emits explicit
  insufficient-evidence, constraint-conflict, model-unavailable, invalid-input,
  and stale-analysis diagnostics.
- Confidence and coverage remain independent bounded values; structural
  conflicts cannot be repaired by identity modifiers.
- Verification: `npx vitest run src/lib/domain/classification.test.ts` passed
  with 8 tests; `npm run typecheck` passed.

## Human review gate

None. This issue changes result policy and diagnostics only; the recovery
presentation is reviewed in the final UI issue 027.
