# Issue 033 — Gold Dataset release boundary and verifier

## Issue Metadata

- ID: 033
- Title: Gold Dataset release boundary and verifier
- Category: feature
- State: ready-for-agent
- Owning capability: Validation and Calibration
- Owning capability node: .okf/capabilities/validation-calibration.md
- Artifact root: docs/architecture/validation-calibration
- Delivery order: 1 of 12
- Execution type: AFK
- Review gate: none
- Review mode: None; this issue has no rendered UI/UX change

## Parent Artifacts

- docs/architecture/validation-calibration/prd.md
- docs/architecture/validation-calibration/domain-glossary.md
- docs/architecture/validation-calibration/canonical-domain-model.md
- docs/architecture/validation-calibration/canonical-use-cases.md
- docs/architecture/validation-calibration/canonical-api-cli-contract.md
- docs/architecture/validation-calibration/acceptance-scenarios.md
- docs/architecture/validation-calibration/readiness-review.md
- .okf/capabilities/validation-calibration.md
- .okf/project.md

## What to build

Create the static, versioned Gold Dataset contract and deterministic verifier
that all later reference-browsing, snapshot-loading, and calibration work will
consume. The boundary must distinguish an immutable published release from
editable workspace state, and must represent Formula, optional Process,
provenance, roles, evaluation partitions, localized metadata, and explicit
public-reference eligibility without inventing values for missing data.

Expose transport-neutral local helpers for resolving an explicit release or the
declared current release, filtering eligible public summaries, and verifying a
candidate release. Keep the implementation frontend-compatible and
maintainer-testable; do not add a backend, account, upload flow, or rendered
catalog in this issue.

## Acceptance criteria

- [x] A release descriptor has stable release identity, status, creation
  metadata, content identity, supersession metadata, record count, and the
  declared supported model/evidence reference.
- [x] A record requires a valid Formula Snapshot and stable preparation/record
  identity, may contain an independent optional Process Snapshot, carries
  source evidence and localized labels/notes, and preserves explicit Unknown
  values rather than converting missing data to zero.
- [x] Roles (`reference`, `calibration`), evaluation partitions
  (`calibration`, `validation`, `test`), `publicSelectable`, and `primary` are
  represented as separate concepts. Public eligibility requires accepted
  status, the `reference` role, and `publicSelectable: true`; validation/test
  records cannot become public by accident.
- [x] Published releases and their records are treated as immutable snapshots;
  corrections or additions require a new release identity and cannot mutate a
  previously resolved object through local edits.
- [x] Deterministic verification rejects malformed or unsafe releases with
  specific diagnostics for duplicate IDs, invalid masses or unresolved
  required ingredients, missing Formula snapshots, missing provenance,
  invalid role/partition combinations, multiple primary references, missing
  required locale values, and invalid content identity.
- [x] Release resolution distinguishes an unavailable/invalid explicit release
  from a valid release and never silently falls back to another version,
  record, or locale. Eligible summaries are scalable read-model data rather
  than an unbounded control.
- [x] Unit/application tests cover release reproducibility, publication
  rejection, role/partition separation, no-fallback behavior, immutability,
  optional Process, and Unknown-is-not-zero semantics.

## Artifact sync required

- Application PRD: none; the release and verification semantics are already
  captured in the current application synthesis.
- Application architecture summary: none; this implements the already-defined
  static-data boundary and introduces no backend, persistence, or topology.
- Owning capability node/artifacts: required: .okf/capabilities/validation-calibration.md
  and docs/architecture/validation-calibration/orchestration-status.md
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: delivery of a specified capability-local contract;
  update the node, orchestration status, and registry, but do not change
  product or cross-capability architecture truth unless implementation
  exposes a semantic mismatch.

## Human review gate

None. Automated contract and verifier checks are sufficient for this issue;
the later user-facing reference journey has the grouped visual review gate.

## Blocked by

None - can start immediately.

## Artifact anchors

- PRD: FR-VC-001 through FR-VC-005 and FR-VC-011 through FR-VC-013
- Domain model: DatasetRelease, DatasetRecord, FormulaSnapshot,
  ProcessSnapshot, SourceEvidence, RecordAcceptancePolicy,
  PublicReferencePolicy, ReleaseImmutabilityPolicy, and invariants 1–7
- Use cases: ResolveDatasetRelease, ResolveReferenceFormula,
  VerifyDatasetRelease
- Contract: DatasetReleaseDescriptor, DatasetRecordSummary,
  DatasetRecordSnapshot, canonical diagnostics, and static frontend mapping

## Acceptance scenarios addressed

- SC-VC-011 — Release reproducibility
- SC-VC-012 — Invalid records cannot be published
- SC-VC-013 — Roles and evaluation partitions remain separate

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-VC-011 | not-applicable | planned | not-applicable: maintainer/release contract |
| SC-VC-012 | not-applicable | planned | not-applicable: maintainer/release contract |
| SC-VC-013 | not-applicable | planned | not-applicable: maintainer/evaluation contract |

## Scenario traceability

| Source rule or use case | Acceptance scenario | Issue criterion | Verification artifact | Result |
|---|---|---|---|---|
| Release identity and content are deterministic | SC-VC-011 | Release descriptor and immutable snapshot criteria | `src/lib/domain/dataset.test.ts` | Passed |
| Invalid records cannot enter a release | SC-VC-012 | Verifier diagnostics and publication boundary | `src/lib/domain/dataset.test.ts`, `src/lib/domain/publication.ts` | Passed |
| Roles and partitions stay separate | SC-VC-013 | Role/partition/public eligibility criteria | `src/lib/domain/dataset.test.ts` | Passed |

## Implementation record

- Added `src/lib/domain/dataset.ts` with the versioned Gold Dataset contract,
  immutable snapshot cloning, deterministic content identity, release
  verification, explicit public-reference eligibility, bounded browse results,
  and no-fallback resolution diagnostics.
- Added `src/lib/domain/dataset.test.ts` covering reproducibility, malformed
  releases, duplicate IDs, primary-reference uniqueness, validation/test
  public-selection rejection, no-fallback resolution, bounded browsing, and
  selectable variants.
- Formula snapshots validate positive masses, required structure, provenance,
  localized metadata, and unresolved ingredient boundaries. Optional Process
  remains independent and may be `null`; Unknown value states are not converted
  to numeric zero.
- No application PRD or architecture topology change was required; the static
  release boundary was already specified. The capability orchestration record
  now points to the implementation and the parent/child delivery chain.

## Verification evidence

- `npm test` passed: 20 files, 111 tests.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `git diff --check` passed.
- OKF strict validation passed with no issues.
- Astro build/static-route verification remains under the user-managed local
  preview policy and was not run by the agent.
