# Issue 043 — Offline acquisition and normalization pipeline

## Issue Metadata

- ID: 043
- Title: Offline acquisition and normalization pipeline
- Category: feature
- State: done
- Owning capability: Reference Dataset Acquisition and Curation
- Owning capability node: .okf/capabilities/validation-calibration/reference-dataset-acquisition.md
- Artifact root: docs/architecture/reference-dataset-acquisition
- Delivery order: 4 of 12
- Execution type: AFK
- Review gate: none
- Review mode: None; deterministic maintainer-side artifacts and tests are sufficient, with no rendered UI/UX change

## Parent Artifacts

- docs/architecture/reference-dataset-acquisition/prd.md
- docs/architecture/reference-dataset-acquisition/domain-glossary.md
- docs/architecture/reference-dataset-acquisition/canonical-domain-model.md
- docs/architecture/reference-dataset-acquisition/canonical-use-cases.md
- docs/architecture/reference-dataset-acquisition/canonical-api-cli-contract.md
- docs/architecture/reference-dataset-acquisition/acceptance-scenarios.md
- docs/architecture/reference-dataset-acquisition/coverage-inventory.md
- docs/architecture/reference-dataset-acquisition/readiness-review.md
- .okf/capabilities/validation-calibration/reference-dataset-acquisition.md
- .okf/capabilities/ingredient-prototype-knowledge.md
- .okf/capabilities/shared/trust-and-provenance.md
- .okf/project.md
- docs/agents/issues/done/20260910-033-gold-dataset-release-boundary-and-verifier.md
- docs/agents/issues/done/20260910-041-coverage-inventory-and-taxonomy.md
- docs/agents/issues/done/20260910-042-source-registry-and-acquisition-policy.md

## What to build

Implement the maintainer-side, offline path from an approved SourceDefinition
and CoverageEntry to a traceable normalized CandidateRecord. The implementation
may use local TypeScript data, scripts, manual import fixtures, or
source-specific adapters, but it must preserve the same transport-neutral
contract and remain usable by a static frontend build.

Record an immutable AcquisitionRun with source identity, preparation key,
method/manual or adapter version, scope, input identity, timestamp, captured
SourceFacts, and outcome. Normalize quantities to grams when a justified
conversion exists; resolve named ingredients through the existing versioned
catalog or functional-composition boundary; retain independent optional Process
facts only when supported; and attach a trace to every normalized field.

The pipeline must represent Unknown, unavailable, and not-applicable distinctly
and must be deterministic for the same source/input/method identity. It does
not publish a release, select sources on its own, scrape at browser runtime, or
copy source prose.

## Acceptance criteria

- [x] An approved offline/manual acquisition can produce an immutable
  AcquisitionRun and SourceFacts with source, preparation, method, tool/manual
  version, scope, input identity, timestamp, and deterministic fact IDs.
- [x] Disallowed, blocked, or unresolved sources fail with the canonical
  acquisition diagnostic and cannot be bypassed by the adapter or importer.
- [x] A normalized CandidateRecord preserves source/run identity, Formula
  snapshot, independent optional Process snapshot, normalization traces,
  catalog versions, and candidate lifecycle status.
- [x] Masses are normalized to grams only through recorded, reproducible
  conversions. Invalid or unjustified units remain unresolved or block the
  candidate rather than becoming a guessed value.
- [x] Named ingredients resolve to a versioned ingredient definition or
  explicit functional-composition snapshot; unresolved required ingredients
  block readiness and never become an arbitrary composition.
- [x] Missing Process information remains Unknown/not recorded and is never
  converted to zero, a default, or an inferred mixing/temperature/
  fermentation value.
- [x] Every required normalized Formula/Process field points to a captured
  SourceFact or an explicit derived/Unknown trace with conversion and review
  notes.
- [x] Replaying the same source identity, input identity, method version, and
  scope produces equivalent facts/traces; changed input identity is explicit.
- [x] Tests cover permitted acquisition, blocked acquisition, unit conversion,
  ingredient resolution, Unknown-is-not-zero, optional Process, traceability,
  and deterministic replay. No browser network call is introduced.

## Artifact sync required

- Application PRD: none; the offline-only acquisition and normalization
  contract is already captured in the current synthesis.
- Application architecture summary: none; this is a local maintainer pipeline
  and introduces no backend or runtime network dependency.
- Owning capability node/artifacts: required: child contract/domain artifacts,
  acquisition/normalization implementation artifacts, and
  `orchestration-status.md`.
- Ingredient and trust shared artifacts: required only if implementation
  exposes a contract mismatch; otherwise record catalog/version compatibility
  in the normalization manifest.
- Issue registry: required; the child node `issues:` reference is required.
- Reason/no-impact decision: this is the specified offline implementation
  boundary. It must not publish a Gold release or change frontend topology.

## Human review gate

None. Automated deterministic tests, manifests, and diagnostics are sufficient
for this maintainer-side pipeline. Candidate data approval belongs to Issue
044, and release publication belongs to Issue 034.

## Blocked by

None.

## Artifact anchors

- PRD: ACQ-FR-004 through ACQ-FR-008 and the acquisition/normalization rules
- Domain model: AcquisitionRun, SourceFact, CandidateRecord,
  NormalizationTrace, NormalizationPolicy, CandidateAcceptancePolicy, and
  invariants 4–8
- Use cases: AcquireCandidateFacts and NormalizeCandidateRecord
- Contract: AcquisitionRun, CandidateRecord, Run offline acquisition,
  Normalize candidate, and canonical diagnostics

## Acceptance scenarios addressed

- SC-ACQ-005 — Acquisition is offline and policy-controlled
- SC-ACQ-007 — Normalization preserves traceability
- SC-ACQ-008 — Unknown is not zero
- SC-ACQ-009 — Ingredient resolution uses the existing boundary

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-ACQ-005 | not-applicable | not-applicable | catalog-only: offline pipeline |
| SC-ACQ-007 | not-applicable | not-applicable | catalog-only: normalized artifact |
| SC-ACQ-008 | not-applicable | not-applicable | catalog-only: Unknown diagnostics |
| SC-ACQ-009 | not-applicable | not-applicable | catalog-only: catalog resolution |

## Implementation record

Implemented the maintainer-side manual/offline capture path in
`src/lib/domain/acquisition.ts` and the deterministic 22-record pilot fixture
in `src/data/reference/pilot.ts`. The pipeline records immutable run identity,
SourceFacts, explicit gram conversions, catalog/composition resolution,
independent optional Process facts, and captured/converted/catalog-mapped/
derived/Unknown traces. It does not scrape at runtime, copy source prose, or
publish a release.

## Verification

- `npm test` — passed after the pilot suite was added.
- `npm test -- --run src/data/reference/pilot.test.ts` — passed (3 tests).
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `git diff --check` — passed; only Git's LF/CRLF normalization warnings.
- Astro was not started; this issue has no rendered UI change.
