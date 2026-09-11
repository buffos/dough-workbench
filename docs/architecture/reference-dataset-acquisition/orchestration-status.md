# Reference Dataset Acquisition and Curation — Orchestration Status

State: `implemented`

## Current result

The approved expansion of the Validation and Calibration plan was modeled as a
structural child. Its purpose, boundary, vocabulary, workflows, contracts,
scenarios, and readiness gate are now explicit.

The child owns:

- the broad preparation coverage inventory;
- navigation category hierarchy and aliases;
- candidate structural-family mappings in collaboration with Ingredient and
  Prototype Knowledge;
- source registry and acquisition/reuse status;
- permitted offline/manual acquisition;
- raw-fact to normalized-candidate traceability;
- grams normalization, ingredient resolution, Unknown handling, and candidate
  review;
- pilot category/family coverage reporting.

The parent Validation and Calibration capability owns release verification,
publication, public-reference eligibility, evaluation partitions, model
maturity, and regression evidence. The Formula Workspace owns applying a
published snapshot; the browser never performs source scraping.

## Artifact inventory

- requirements-gap-analysis.md
- domain-glossary.md
- prd.md
- canonical-domain-model.md
- canonical-use-cases.md
- canonical-api-cli-contract.md
- acceptance-scenarios.md
- coverage-inventory.md
- source-registry.md
- source-policy.md
- normalization-manifest.md
- curation-manifest.md
- pilot-coverage-report.md
- readiness-review.md

No material High or Medium readiness finding remains. The source URLs, source
terms, extraction methods, and pilot record contents are delivery-time inputs,
not hidden specification gaps. The project owner has resolved the source
decision for internal use: the five registered sources are `manual-only` with
`normalized-facts-only` reuse. This does not grant public republication rights
and does not permit runtime scraping.

## Implementation status

Issue 041's machine-readable inventory is implemented at
`src/data/reference/coverage.ts`. It contains 154 stable preparation keys, 11
root navigation categories, bilingual labels, aliases, priorities, lifecycle
status, and canonical primary family assignments, plus deterministic manifest
validation. Every assignment points into the shared 13-root/41-child
structural taxonomy; the former family labels were removed after migration.

Issue 042's source registry and policy are implemented at
`src/data/reference/sources.ts` and `src/lib/domain/source-registry.ts`. Five
candidate publishers are recorded with attribution, access date, expected
coverage, limitations, and source-specific policy fields. The owner-approved
internal boundary is represented as `manual-only` /
`normalized-facts-only`; no source is promoted to a public-reuse permission.

Issue 043's offline acquisition and normalization boundary is implemented at
`src/lib/domain/acquisition.ts` and closed in
`docs/agents/issues/done/20260910-043-offline-acquisition-and-normalization-pipeline.md`.
It provides deterministic runs, SourceFacts, justified gram conversions,
catalog/composition resolution, independent optional Process handling, and
per-field traces. The 22-record pilot fixture exercises the path; no browser
network path exists.

Issue 044's review lifecycle, pilot report, and immutable handoff are
implemented at `src/lib/domain/curation.ts` and materialized by
`src/data/reference/pilot.ts`. The report contains 22 candidate records,
two accepted candidates per each of the 11 broad categories, zero blocked
entries, zero unresolved category gaps, and 132 inventory entries still
missing from this pilot. The project owner approved the batch, and the
immutable handoff is now available to the parent release workflow; the
release registry has not consumed it yet.

The parent release registry now consumes the approved handoff as the immutable
`gold-formulas-v2` release. Its records carry the canonical family IDs emitted
by the inventory; no legacy family translation is performed in the browser.

## Next delivery frontier

The approved delivery slice is active in dependency order:

1. Issues 041–043 — completed coverage, source policy, and offline
   normalization foundations;
2. Issue 044 — completed after product/data approval of the assembled pilot;
3. Issue 034 — completed: publish the immutable release through the Issue 033
   verifier.

The parent Issue 034 depends on the pilot handoff and must not independently
invent or scrape records.

All user-facing reference UI review remains grouped at the end of the parent
reference-start journey. The child itself has no visual review gate unless a
future inventory browser is explicitly added.

## Artifact impact status

The parent Validation and Calibration exact set, application PRD, and
application architecture summary reflect this child, the larger inventory,
and the offline-only acquisition boundary. Delivery truth is registered in
Issues 041–044; all four child issues are complete and Issue 034 consumes the
approved pilot handoff rather than performing curation itself. The grouped UI
review remains intentionally deferred until the parent reference-start
journey is complete.
