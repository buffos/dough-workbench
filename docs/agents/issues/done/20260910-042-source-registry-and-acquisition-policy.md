# Issue 042 — Source registry and acquisition policy

## Issue Metadata

- ID: 042
- Title: Source registry and acquisition policy
- Category: feature
- State: done
- Owning capability: Reference Dataset Acquisition and Curation
- Owning capability node: .okf/capabilities/validation-calibration/reference-dataset-acquisition.md
- Artifact root: docs/architecture/reference-dataset-acquisition
- Delivery order: 3 of 12
- Execution type: HITL
- Review gate: product-approval
- Review mode: product approval of the researched source set, attribution/reuse notes, and permitted acquisition methods; no visual review

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
- .okf/capabilities/shared/trust-and-provenance.md
- .okf/project.md
- docs/agents/issues/pending/20260910-041-coverage-inventory-and-taxonomy.md

## What to build

Research and register an initial set of authoritative recipe sources that can
cover the inventory without turning the GitHub Pages site into a scraper or
republication system. For each proposed source, record identity, author or
publisher, citation or URL, access date, authority/quality assessment,
attribution, reuse status, limitations, and the exact offline/manual
acquisition method that is permitted.

Define a source policy and an explicit review status using the canonical
vocabulary: `allowed-offline`, `manual-only`, `manual-review`, `blocked`, or
`unknown`. Keep source authority separate from recipe correctness, model
confidence, and public-release eligibility. Do not copy source prose into the
application and do not bypass access controls, terms, paywalls, or robots.

## Acceptance criteria

- [x] A versioned source registry is linked to the approved coverage revision
  and each source has a stable source ID, attribution, author/publisher,
  citation or URL, access date/bibliographic identity, quality assessment,
  limitations, reuse status, and acquisition method.
- [x] Each source has one explicit acquisition status from the canonical
  vocabulary, and unresolved attribution, terms, authority, or reuse
  conditions produce `source_review_required` rather than implicit approval.
- [x] The registry records which broad categories and preparation keys a source
  is expected to cover, without treating that expectation as acquired evidence.
- [x] The authority rubric distinguishes source quality from formula
  correctness, structural-family fit, model confidence, and permission to
  publish normalized data.
- [x] The policy permits only approved offline/manual capture or import and
  explicitly prohibits runtime browser scraping, unattended crawling, access
  bypass, and copied source prose in public static data.
- [x] A blocked or unclear source fails acquisition with a specific diagnostic
  and leaves the affected inventory entry visible as a gap.
- [x] Registry validation is deterministic and tests missing attribution,
  unclear terms, invalid statuses, duplicate source IDs, and category links.

## Artifact sync required

- Application PRD: none; the current synthesis already defines source
  attribution, offline-only acquisition, and the no-runtime-scraping boundary.
- Application architecture summary: none; the browser topology is unchanged.
- Owning capability node/artifacts: required: the child node, source registry
  artifact, source policy, and `orchestration-status.md`.
- Trust/provenance artifact: required only if the approved source vocabulary
  or attribution semantics exceed the existing shared contract; otherwise add
  an explicit compatibility note.
- Issue registry: required; the child node `issues:` reference is required.
- Reason/no-impact decision: this fills the specified source-governance
  boundary. It must not publish candidates or change runtime architecture.

## Human review gate

Product approval is required before any source is used for acquisition. Review
the actual source list, authority rationale, URLs/citations, author/publisher,
access dates, attribution and reuse conditions, category coverage, permitted
offline/manual method, and blocked/unknown decisions. This is a source-policy
approval, not a visual review.

The project owner approved internal consumption on 2026-09-10. The five
registered sources are approved for maintainer-controlled manual/offline
capture of normalized facts with attribution; this does not authorize runtime
browser scraping, unattended crawling, access bypass, copied source prose, or
public republication.

## Blocked by

None.

## Artifact anchors

- PRD: ACQ-FR-003, ACQ-FR-004, and the source-acquisition business rules
- Domain model: SourceDefinition, SourceRegistry, SourceAcquisitionPolicy,
  source status vocabulary, and invariants 4, 7, and 10
- Use cases: InspectSourceRegistry and RegisterSource
- Contract: SourceDefinition, Register source, source diagnostics, and static
  source-registry mapping

## Acceptance scenarios addressed

- SC-ACQ-004 — Source registry records acquisition conditions
- SC-ACQ-005 — Acquisition is offline and policy-controlled
- SC-ACQ-006 — Restricted or unclear acquisition is blocked

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-ACQ-004 | not-applicable | not-applicable | catalog-only: maintainer registry |
| SC-ACQ-005 | not-applicable | not-applicable | catalog-only: offline acquisition |
| SC-ACQ-006 | not-applicable | not-applicable | catalog-only: policy diagnostic |

## Scenario traceability

| Source rule or use case | Acceptance scenario | Issue criterion | Verification artifact | Result |
|---|---|---|---|---|
| Source identity and conditions remain attributable | SC-ACQ-004 | Versioned registry metadata and expected coverage | `src/data/reference/sources.ts`, `source-registry.ts` | Passed |
| Acquisition is offline and policy-controlled | SC-ACQ-005 | Explicit policy prohibitions and status gate | `src/lib/domain/reference-acquisition.test.ts` | Passed |
| Unclear/restricted sources cannot be acquired | SC-ACQ-006 | Diagnostic and validation criteria | `src/lib/domain/source-registry.ts` | Passed |

## Implementation record

- Added `src/lib/domain/source-registry.ts` with the canonical acquisition
  status vocabulary, reuse boundary, deterministic registry validation, and
  explicit acquisition rejection diagnostics.
- Added `src/data/reference/sources.ts` with five researched candidate
  publishers linked to the `coverage-v1` inventory. Each entry records
  publisher, citation/URL, access date, authority assessment, attribution,
  expected categories/preparations, method, reuse status, and limitations.
- Added `source-registry.md` and `source-policy.md`. Runtime scraping,
  unattended crawling, access bypass, and copied source prose are prohibited.
  The source quality tier remains separate from formula correctness, model
  confidence, and publication permission.
- All five sources are now explicitly `manual-only` /
  `normalized-facts-only` under the project owner's internal-use approval.
  The source registry still records source-specific limitations and retains
  attribution with every offline candidate.

## Verification evidence

- `npm test` passed: 20 files, 111 tests, including valid-registry,
  missing-attribution, duplicate/link validation, and blocked-acquisition
  cases.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `git diff --check` passed.
- Strict OKF validation passed with no issues.
- Product approval for the actual source set, terms, attribution/reuse
  conditions, and permitted manual/offline method was recorded on 2026-09-10.
  Acquisition remains maintainer-controlled and all source facts must retain
  the source citation and access metadata.
