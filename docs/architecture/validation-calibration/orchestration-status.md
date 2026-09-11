# Validation and Calibration — Orchestration Status

State: `specified`

The capability advanced from `foggy` to `bounded` after the user confirmed the
first Gold/reference dataset direction, then through the exact architecture
pipeline to `specified`. The first implementation target is an immutable,
versioned Gold Dataset assembled from reviewed candidates produced by the
Reference Dataset Acquisition and Curation child.

## Confirmed boundary

- One versioned Gold Dataset supplies both calibration evidence and the
  user-facing public-reference subset; no duplicated recipe dataset.
- Formula Snapshot is required; Process Snapshot is optional and independent.
- Multiple accepted references may belong to one preparation; one may be
  marked primary.
- Public selection creates a local editable copy and never mutates the source.
- Dirty draft replacement requires explicit confirmation and never merges data.
- The selector is searchable/filterable and grouped by family/preparation, with
  Blank remaining available as the default-compatible path.
- A broad preparation inventory is defined before source collection, with
  navigation categories kept separate from structural families and source
  records.
- Approved sources may be captured or imported through a maintainer-controlled
  offline path; runtime scraping and unattended crawling are outside V1.
- Published releases are immutable snapshots such as `gold-formulas-v2`.
- Structural family IDs are supplied by the shared canonical taxonomy: each
  preparation has one primary family placement, while modifiers remain
  orthogonal metadata.

## Artifact inventory

The exact reference set is complete:

- [Requirements gap analysis](requirements-gap-analysis.md)
- [Domain glossary](domain-glossary.md)
- [PRD](prd.md)
- [Canonical domain model](canonical-domain-model.md)
- [Canonical use cases](canonical-use-cases.md)
- [Canonical API/CLI contract](canonical-api-cli-contract.md)
- [Acceptance scenarios](acceptance-scenarios.md)
- [Architecture readiness review](readiness-review.md)

No unresolved High or Medium readiness findings remain.

The acquisition child has its own exact artifact set and readiness review. Its
five-source internal manual-only policy is resolved, and its deterministic
22-candidate pilot is assembled and approved; the parent publication issue may
now consume the immutable handoff.

## Implementation status

The release boundary/verifier is implemented in
`src/lib/domain/dataset.ts`, and publication is isolated in
`src/lib/domain/publication.ts`. Issue 034 now materializes the approved
`gold-formulas-v2` release in `src/data/reference/release.ts` with 22 records;
the registry resolves that release without fallback. Calibration evidence and
maturity/regression gates are implemented in `src/lib/domain/calibration.ts`
and `src/lib/domain/maturity.ts`. The Formula Workspace exposes the
Blank/Reference start boundary through `src/components/ReferenceStartPanel.svelte`
and keeps reference snapshots independent from local Formula/Process edits.

The browser-safe registry now declares and contains the verified
`gold-formulas-v2` release with 22 records. Blank start remains available, and
reference selection remains a local-copy boundary. Issues 035–037 now cover the
bounded browse, copy, and safe replacement behavior; their implementation is
complete and their shared visual gate remains open for the final review.
The calibration evidence evaluator is implemented in
`src/lib/domain/calibration.ts` with explicit partition, quality-weight, and
Unknown handling. The model-parameter maturity/regression gate is now also
implemented in `src/lib/domain/maturity.ts`; it enforces the staged maturity
ladder, confidence ceilings, complete regression cases, Stable experiment
evidence, and append-only release publication. Issues 035–040 now have their
implementation and automated verification complete; 035–037 and 040 share
one final grouped visual review gate.

## Artifact impact

Capability truth, product truth, and cross-capability architecture truth were
updated. The application PRD and architecture summary now describe the
reference-start journey and the static release-data boundary. No backend,
account, persistence, or runtime-scraping boundary was introduced. Delivery
truth covers Issues 033–044 in dependency order. Issues 041–044 own the
inventory, source policy, offline normalization, and pilot handoff; Issue 034
mechanically publishes that approved handoff through Issue 033. Product/data
approval remains explicit in Issue 044; Issues 035–037 and 040 carry
visual-review gates that are intentionally grouped into the final review on
Issue 040.

## Verification and next action

The root application synthesis gate is current. Acceptance scenarios cover the
maintainer release path, public reference browsing/selection, optional Process,
dirty replacement, immutable copying, bilingual parity, calibration evidence,
partition isolation, maturity, and regression outcomes. Issues 033–040 cover
the release/evidence path and reachable workspace exposure path, while Issues
041–044 cover inventory and acquisition. Issues 034 and 041–044 are
implemented; Issues 035–040 are implemented in code and awaiting the one
grouped visual review. The Validation and Calibration node remains `specified`
until that delivery gate is approved and the issue records are closed.
