# Issue 044 — Pilot candidate curation and coverage report

## Issue Metadata

- ID: 044
- Title: Pilot candidate curation and coverage report
- Category: feature
- State: done
- Owning capability: Reference Dataset Acquisition and Curation
- Owning capability node: .okf/capabilities/validation-calibration/reference-dataset-acquisition.md
- Artifact root: docs/architecture/reference-dataset-acquisition
- Delivery order: 5 of 12
- Execution type: HITL
- Review gate: product-approval
- Review mode: product approval of the pilot candidate batch and explicit coverage/gap report; no visual review

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
- .okf/capabilities/validation-calibration.md
- .okf/capabilities/ingredient-prototype-knowledge.md
- .okf/capabilities/shared/trust-and-provenance.md
- .okf/project.md
- docs/agents/issues/done/20260910-033-gold-dataset-release-boundary-and-verifier.md
- docs/agents/issues/done/20260910-043-offline-acquisition-and-normalization-pipeline.md

## What to build

Use the approved inventory, source registry, and offline normalization pipeline
to prepare a small but structurally meaningful pilot. Target approximately
2–3 accepted candidate records per broad navigation category, using approved
sources and retaining any optional Process snapshot independently from the
Formula. Curators must be able to inspect the candidate evidence, return a
candidate for correction, reject it with a reason, or accept it for the parent
release workflow.

Produce a deterministic PilotCoverageReport with counts by navigation category
and structural family, source coverage, missing inventory entries, blocked
entries, unresolved ingredient or Process gaps, and the exact candidate handoff
IDs. The pilot is a pipeline-validation sample, not a claim of complete
calibration coverage. Acceptance here does not publish a release or make a
candidate selectable in the browser.

## Acceptance criteria

- [x] The pilot contains approximately 2–3 accepted candidates for each broad
  navigation category that has an approved, usable source path, with any
  category that cannot meet the target recorded as a gap rather than silently
  omitted.
- [x] Each candidate has a stable candidate/preparation/source/acquisition
  identity, normalized Formula data, optional independent Process data when
  supported, provenance, normalization traces, bilingual metadata, and a
  review decision.
- [x] Candidate review supports `accepted-for-release`,
  `returned-for-correction`, and `rejected` outcomes with reviewer evidence and
  reasons; none of these outcomes alone publishes or exposes a candidate.
- [x] A deterministic pilot report includes category counts, structural-family
  counts, source coverage, unrepresented families, missing inventory entries,
  blocked entries, and the handoff IDs for accepted candidates.
- [x] The report explicitly distinguishes a pilot sample from complete
  inventory coverage and full model calibration; it reports source and
  normalization limitations honestly.
- [x] Any candidate with an unresolved required ingredient, missing required
  Formula structure, fabricated Process value, missing trace, or unapproved
  source is returned/rejected and excluded from the handoff.
- [x] The handoff is immutable after it is referenced by the parent release;
  corrections create a new candidate identity or revision and do not mutate
  historical data.
- [x] Tests/manifests prove the pilot target, review lifecycle, gap reporting,
  exclusion rules, and deterministic report generation without browser
  scraping or runtime network access.

## Artifact sync required

- Application PRD: none; the current synthesis already defines the pilot as a
  maintainer-side, offline, pre-publication step.
- Application architecture summary: none; no browser route, backend, or
  runtime source access is introduced.
- Owning capability node/artifacts: required: child pilot report/handoff,
  curation manifest, and `orchestration-status.md`; update the parent delivery
  handoff note consumed by Issue 034.
- Trust/provenance and Ingredient/Prototype artifacts: required only when a
  candidate exposes a contract mismatch; otherwise preserve the versioned
  references in each candidate trace.
- Issue registry: required; the child node `issues:` reference is required.
- Reason/no-impact decision: this creates the reviewed pilot handoff that the
  parent publication issue consumes. It does not publish or alter the
  application topology.

## Human review gate

Product approval is required after the pilot is assembled. Review the actual
candidate records, source attribution, formula transcription and gram
normalization, optional Process inclusion, Unknown values, ingredient
resolution, category/family coverage, returned/rejected records, and the gap
report. Approval means “ready for the parent release verifier”; it is not
approval of a public UI and it does not make the records selectable by itself.

## Blocked by

- —

## Artifact anchors

- PRD: ACQ-FR-005 through ACQ-FR-010 and the pilot coverage rules
- Domain model: CandidateRecord, CurationReview, PilotCoverageReport,
  CandidateAcceptancePolicy, PilotCoveragePolicy, lifecycle, and invariants
  8–10
- Use cases: NormalizeCandidateRecord, ReviewCandidateRecord,
  PreparePilotCoverage
- Contract: CandidateRecord, PilotCoverageReport, Review candidate,
  Prepare pilot report, and `pilot_coverage_gap`

## Acceptance scenarios addressed

- SC-ACQ-007 — Normalization preserves traceability
- SC-ACQ-008 — Unknown is not zero
- SC-ACQ-009 — Ingredient resolution uses the existing boundary
- SC-ACQ-010 — Candidate review does not publish
- SC-ACQ-011 — Pilot reports coverage honestly
- SC-ACQ-012 — Published data remains immutable

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-ACQ-007 | not-applicable | not-applicable | catalog-only: candidate handoff |
| SC-ACQ-008 | not-applicable | not-applicable | catalog-only: Unknown handling |
| SC-ACQ-009 | not-applicable | not-applicable | catalog-only: ingredient trace |
| SC-ACQ-010 | not-applicable | not-applicable | catalog-only: curation lifecycle |
| SC-ACQ-011 | not-applicable | planned | catalog-only: pilot report |
| SC-ACQ-012 | not-applicable | not-applicable | catalog-only: immutable handoff |

## Implementation record

Implemented the deterministic pilot assembly in `src/data/reference/pilot.ts`.
It captures 22 candidate preparations across all 11 navigation categories,
normalizes them through Issue 043, records candidate-level curation decisions,
and prepares the immutable handoff `handoff-ffbc6efc`. The pilot is still
provisional: the candidate-level fixture review is not a substitute for the
project owner's product/data approval required by this issue.

## Verification

- `npm test` — passed after the pilot suite was added.
- `npm test -- --run src/data/reference/pilot.test.ts` — passed (3 tests).
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `git diff --check` — passed; only Git's LF/CRLF normalization warnings.
- No browser scraping, runtime network access, release publication, or UI
  change was introduced.

## Approval record

The project owner approved `pilot-v1` in the current delivery task after
reviewing the pilot coverage result and its internal-use source boundary.
Approval covers the 22 candidate records, source attribution, normalization
and Unknown handling, category/family mapping, and the explicit gap report.
It authorizes the parent release workflow to consume handoff
`handoff-ffbc6efc`; it is not public-republication permission and is not the
grouped visual approval for the browser journey.
