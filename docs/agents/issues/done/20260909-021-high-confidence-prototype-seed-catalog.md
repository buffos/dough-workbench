# Issue 021 — High-confidence prototype seed catalog

## Issue Metadata

- ID: 021
- Title: High-confidence prototype seed catalog
- Category: feature
- State: done
- Owning capability: Ingredient and Prototype Knowledge
- Owning capability node: .okf/capabilities/ingredient-prototype-knowledge.md
- Artifact root: docs/architecture/ingredient-prototype-knowledge
- Delivery order: 3 of 4
- Execution type: AFK
- Review gate: none

## Parent Artifacts

- docs/architecture/ingredient-prototype-knowledge/prd.md
- docs/architecture/ingredient-prototype-knowledge/domain-glossary.md
- docs/architecture/ingredient-prototype-knowledge/canonical-domain-model.md
- docs/architecture/ingredient-prototype-knowledge/canonical-use-cases.md
- docs/architecture/ingredient-prototype-knowledge/canonical-api-cli-contract.md
- docs/architecture/ingredient-prototype-knowledge/acceptance-scenarios.md
- docs/architecture/ingredient-prototype-knowledge/readiness-review.md
- .okf/capabilities/shared/trust-and-provenance.md
- exploration/Initial prototype catalog.md

## What to build

Populate the static prototype catalog with the first high-confidence expert
seed set from the Initial Prototype Catalog. Each family/prototype definition
must use the issue 019 snapshot boundary and issue 020 inheritance resolver, and
must retain family membership, structural feature requirements, identity
modifiers, matcher metadata, confidence tier, and model maturity.

The seed data must remain calibration-limited where the source does not justify
numeric boundaries. Do not invent a gold dataset, claim calibrated accuracy, or
turn qualitative targets into unexplained precise thresholds. The catalog must
be sufficient for the later classifier to resolve family/prototype candidates,
but this issue does not implement similarity scoring.

## Acceptance criteria

- [x] The agreed high-confidence seed families and named prototypes from the
  Initial Prototype Catalog are represented as static, versioned definitions.
- [x] Every definition has a stable ID, localized display labels, family and
  parent references, confidence tier, matcher policy metadata, and explicit
  structural versus identity feature groups.
- [x] All parent references resolve through issue 020; the catalog integrity
  check passes and no cycle or dangling reference is introduced.
- [x] The catalog reports its version/model identity and can be replaced by a
  later snapshot without mutating an existing resolved result.
- [x] The seed catalog does not claim calibrated numeric classification
  boundaries; calibration-limited maturity and provenance remain explicit.
- [x] Automated tests cover the loaded seed snapshot and reproducibility path
  for SC-IK-006 and SC-IK-007.

## Artifact sync required

- Application PRD: none; this supplies the already-specified static seed data
  and does not change product scope.
- Application architecture summary: none; static versioned model data remains
  within the existing domain/data boundary.
- Owning capability node/artifacts: required; update
  `.okf/capabilities/ingredient-prototype-knowledge.md` and its orchestration
  status with the implementation record and source/provenance note.
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: capability-local static knowledge; dataset
  collection and calibration remain owned by Validation and Calibration, so no
  product or cross-capability architecture change is expected.

## Blocked by

None — the versioned catalog and inheritance resolver are now available.

## Functional requirements addressed

This issue addresses Ingredient and Prototype Knowledge requirements 1, 4, 5,
and 7 for stable versioned definitions, inherited family structure, localized
labels separate from model keys, and replaceable static snapshots.

## Artifact anchors

- PRD: static seed catalog, family hierarchy, matcher metadata, and confidence
  tiers
- Domain model: `PrototypeCatalogSnapshot` and `PrototypeDefinition`
- Use cases: `ResolvePrototypeCatalog` and `GetCatalogMetadata`
- Contract: `PrototypeReference` and versioned catalog identity
- Supporting source: `exploration/Initial prototype catalog.md`
- Calibration boundary: expert seed data is not a calibrated gold dataset

## Acceptance scenarios addressed

- SC-IK-006 — Prototype inheritance
- SC-IK-007 — Version reproducibility

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-IK-006 | not-applicable | deferred: domain/data slice; catalog surface is issue 022 | deferred: no E2E harness |
| SC-IK-007 | not-applicable | deferred: domain/data slice; no rendered surface | deferred: no E2E harness |

## Human review gate

None. This slice adds static model data and domain tests only; it has no
rendered UI/UX change. Automated tests and artifact synchronization are the
closure requirements.

## Implementation record

- Added the first versioned high-confidence seed set from
  `exploration/Initial prototype catalog.md`: eight structural families and
  eight named prototypes covering lean bread, brioche, shortbread, pancake,
  crêpe, angel food, choux, and croissant.
- Each definition carries stable IDs, Greek/English labels, family/parent
  references, confidence tier, expert-seed maturity, matcher metadata,
  structural features/constraints, identity modifiers, and source provenance.
  The qualitative ranges intentionally do not claim calibrated numeric
  boundaries.
- Reference trace: SC-IK-006 is covered by the resolved family hierarchy and
  prototype-specific constraints; SC-IK-007 is covered by version metadata and
  replacement-isolation tests.
- Verification: `npm test -- --run src/lib/domain/prototype-catalog.test.ts`
  passed with 7 tests.
