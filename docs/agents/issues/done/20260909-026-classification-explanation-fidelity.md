# Issue 026 — Classification explanation fidelity

## Issue Metadata

- ID: 026
- Title: Classification explanation fidelity
- Category: feature
- State: ready-for-agent
- Owning capability: Classification, Similarity, and Explanation
- Owning capability node: .okf/capabilities/formula-analysis-workspace/classification-similarity-explanation.md
- Artifact root: docs/architecture/classification-similarity-explanation
- Delivery order: 4 of 5
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

Produce the `ClassificationExplanation` evidence set from the same feature
snapshot, resolved prototype, similarity vector, and outcome used for
classification. It must identify the strongest positive and limiting
features, structural conflicts, missing inputs, inherited rules, identity
modifiers, coverage/confidence limitations, and catalog/model/provenance
metadata.

The domain output should use stable feature/prototype/model identifiers and
evidence references; localized prose belongs to the existing bilingual
presentation layer. Re-running explanation for the same snapshots must give
the same evidence and must not introduce a stronger claim than the result
policy allows.

## Acceptance criteria

- [x] Every returned candidate can expose positive contributions, limiting or
  conflicting features, and the source of each contribution.
- [x] Missing inputs, reduced coverage/confidence, inherited rules, identity
  modifiers, and model/catalog provenance are represented explicitly.
- [x] Explanation evidence is generated from the same inputs and model version
  as the score/outcome, so it cannot contradict the displayed result.
- [x] Stable identifiers remain language-neutral and no translated fallback
  prose is embedded in the domain engine.
- [x] Automated tests cover SC-CL-009 and the explanation portions of
  SC-CL-007 and SC-CL-008.

## Artifact sync required

- Application PRD: none; explanation fidelity is already within the specified
  analysis journey.
- Application architecture summary: none; the existing domain-to-Svelte
  presentation boundary remains unchanged.
- Owning capability node/artifacts: required; update the classification node
  and orchestration status with explanation evidence and verification.
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: capability-local evidence work. Bilingual Content
  supplies localized presentation wording in 027; no shared policy change is
  proposed here.

The application-synthesis gate is current and remains unchanged.

## Blocked by

None — issues 023–025 are implemented and archived.

## Functional requirements addressed

The parent PRD has no numbered user stories. This issue addresses functional
requirements 5 and 7, and canonical scenarios SC-CL-007, SC-CL-008, and
SC-CL-009.

## Artifact anchors

- Domain model: `ExplanationPolicy` and the classification evidence set
- Use case: `ExplainClassification`
- Contract: `ClassificationResult.explanation`
- Shared policy: trust, provenance, confidence, coverage, and unknown handling

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-CL-007 | not-applicable | deferred: explanation rendering is owned by 027 | deferred: no E2E harness |
| SC-CL-008 | not-applicable | deferred: conflict explanation rendering is owned by 027 | deferred: no E2E harness |
| SC-CL-009 | not-applicable | deferred: explanation surface is owned by 027 | deferred: no E2E harness |

## Scenario traceability

| Source rule or use case | Acceptance scenario | Issue criterion | Planned verification | Closure evidence |
| --- | --- | --- | --- | --- |
| Explanation is faithful to calculation | SC-CL-009 | Evidence references and contributions match the calculation snapshot | Deterministic explanation/result consistency test | To be recorded at implementation |
| Missing evidence is explained | SC-CL-007 | Missing features and coverage limitations are retained | Missing-input explanation test | To be recorded at implementation |
| Structural conflict is explained | SC-CL-008 | Conflict and inherited/own rule evidence is retained | Constraint explanation test | To be recorded at implementation |

## Human review gate

None. This issue changes the evidence contract only; human inspection of its
localized presentation is collected with issue 027.

## Implementation record

- Added `ClassificationExplanation` generation in
  `src/lib/domain/classification.ts` from the same feature snapshot,
  resolved prototype definition, evaluated feature vector, and score policy
  used by `classifyFormula`.
- Explanations preserve matched, limiting, critical-conflict, unknown, and
  not-applicable evidence; inherited rule lineage, identity modifiers,
  provenance, and model version remain explicit and language-neutral.
- A conflicted candidate can still be selected as the diagnostic explanation
  when no supported or partial candidate exists, so conflict recovery never
  falls back to an empty explanation.
- Verification: `npm test -- --run src/lib/domain/classification.test.ts`
  passed with 9 tests; `npm run typecheck` passed.
