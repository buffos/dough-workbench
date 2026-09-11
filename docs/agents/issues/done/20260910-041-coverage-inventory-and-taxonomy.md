# Issue 041 — Coverage inventory and taxonomy

## Issue Metadata

- ID: 041
- Title: Coverage inventory and taxonomy
- Category: feature
- State: done
- Owning capability: Reference Dataset Acquisition and Curation
- Owning capability node: .okf/capabilities/validation-calibration/reference-dataset-acquisition.md
- Artifact root: docs/architecture/reference-dataset-acquisition
- Delivery order: 2 of 12
- Execution type: AFK
- Review gate: product-approval
- Review mode: product approval of the inventory, category names, aliases, priorities, and candidate family mappings after implementation; no visual review

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
- .okf/project.md

## What to build

Turn the broad preparation list into a versioned, machine-readable coverage
inventory that can support future browsing, acquisition, and pilot reporting.
Use the current 154-entry planning baseline as the starting set, preserving
the distinction between a user-facing navigation category, an analytical
structural family, and a preparation identity.

Give every entry a stable ASCII preparation key, English and Greek labels, one
primary navigation category, aliases, priority, lifecycle status, candidate
structural-family mapping or an explicit gap, and maintainer notes. Keep the
inventory separate from source records, Formula snapshots, Process snapshots,
and published releases. This issue defines coverage; it does not collect
recipes or claim that a planned entry already has evidence.

## Acceptance criteria

- [x] A versioned inventory revision contains all 154 baseline preparation
  entries, with a deterministic manifest and no duplicate preparation keys.
- [x] Every entry has a stable key, bilingual labels, exactly one primary
  navigation category, priority, lifecycle status, aliases where needed, and
  a candidate structural-family link or an explicit unmapped-family gap.
- [x] The inventory covers the agreed broad categories: yeasted breads,
  naturally leavened breads, enriched/sweet yeast doughs, laminated/
  viennoiserie, pizza/flatbreads, pasta/noodles/wrappers, pastry/pie/tart/
  cracker, cakes/quick breads, pancakes/crepes/waffles, fried doughs/batters,
  and gluten-free/alternative preparations.
- [x] Category hierarchy, aliases, and structural-family links are represented
  as separate fields; changing a category or family mapping cannot create a
  second preparation identity.
- [x] Greek and English labels are present for every entry, and localized
  aliases or transliterations resolve to the same stable key rather than
  creating duplicate coverage.
- [x] Inventory validation reports invalid locale/category/family mappings,
  duplicate keys, and missing required metadata with actionable diagnostics.
- [x] No source URL, recipe quantity, Process value, calibration claim, or
  public-release eligibility is invented as part of this inventory slice.

## Artifact sync required

- Application PRD: none; the current synthesis already defines broad coverage,
  category-versus-family separation, and a static frontend boundary.
- Application architecture summary: none; this is a maintainer-side static
  planning/data artifact and introduces no runtime service or browser fetch.
- Owning capability node/artifacts: required: the child OKF node,
  `coverage-inventory.md`, and `orchestration-status.md`.
- Shared taxonomy artifact: required when a family mapping exposes a semantic
  mismatch with the Ingredient and Prototype Knowledge catalog; otherwise
  record the mapping assumption and gap in the inventory.
- Issue registry: required; the child node `issues:` reference is required.
- Reason/no-impact decision: this implements the already-specified coverage
  boundary. It must update delivery truth and inventory provenance, but must
  not move the child to `implemented` or publish a dataset.

## Human review gate

Product approval is required after the inventory is generated. Review the
154-entry baseline, broad category labels and hierarchy, Greek terminology,
duplicate/alias decisions, P0/P1 priorities, and candidate structural-family
mappings or explicit gaps. This is a data/taxonomy approval, not a UI review.

Product approval was recorded from the project owner on 2026-09-10. The
154-entry inventory, category vocabulary, aliases, priorities, and candidate
family mappings were accepted for the source-backed pilot workflow.

## Blocked by

None - can start immediately.

## Artifact anchors

- PRD: ACQ-FR-001, ACQ-FR-002, ACQ-FR-009, and the coverage business rules
- Domain model: CoverageInventory, CoverageEntry, NavigationCategory,
  PreparationIdentity, CoverageTaxonomyPolicy, and invariants 1–3
- Use cases: BrowseCoverageInventory and DefineCoverageEntry
- Contract: CoverageEntry, Browse coverage, and coverage diagnostics
- Inventory: `coverage-inventory.md` revision `coverage-v1`

## Acceptance scenarios addressed

- SC-ACQ-001 — Inventory has stable preparation coverage
- SC-ACQ-002 — Category and structural family stay separate
- SC-ACQ-003 — Aliases resolve to one preparation

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-ACQ-001 | not-applicable | planned | catalog-only: inventory read model |
| SC-ACQ-002 | not-applicable | planned | catalog-only: inventory read model |
| SC-ACQ-003 | not-applicable | planned | catalog-only: inventory read model |

## Scenario traceability

| Source rule or use case | Acceptance scenario | Issue criterion | Verification artifact | Result |
|---|---|---|---|---|
| Planned preparations have stable bilingual identities | SC-ACQ-001 | 154-entry manifest and metadata criteria | `src/lib/domain/reference-acquisition.test.ts` | Passed |
| Navigation category and analytical family are separate | SC-ACQ-002 | Separate category/family fields | `src/data/reference/coverage.ts` | Passed |
| Aliases resolve to one preparation key | SC-ACQ-003 | Stable key and alias fields | `src/data/reference/coverage.ts` and validation test | Passed |

## Implementation record

- Added `src/data/reference/coverage.ts` with the 154-entry `coverage-v1`
  inventory, 11 root navigation categories, bilingual labels, aliases,
  priorities, lifecycle status, candidate structural-family mappings, and
  deterministic manifest identity.
- Added validation for manifest identity, duplicate/stable keys, root
  category metadata, category references, bilingual labels, aliases, and
  explicit family-gap handling.
- Kept the inventory separate from sources, Formula/Process snapshots,
  calibration evidence, and public-release eligibility. No source URL,
  quantity, Process value, or calibration claim is present in the inventory.

## Verification evidence

- `npm test` passed: 20 files, 111 tests.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `git diff --check` passed.
- Strict OKF validation passed with no issues.
- Product approval accepted the exact 154-entry taxonomy, Greek labels,
  aliases, priorities, and candidate family mappings on 2026-09-10. The
  inventory remains a planning boundary; it does not itself create source
  evidence or publish a release.
