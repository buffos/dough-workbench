# Issue 019 — Versioned prototype catalog boundary

## Issue Metadata

- ID: 019
- Title: Versioned prototype catalog boundary
- Category: feature
- State: done
- Owning capability: Ingredient and Prototype Knowledge
- Owning capability node: .okf/capabilities/ingredient-prototype-knowledge.md
- Artifact root: docs/architecture/ingredient-prototype-knowledge
- Delivery order: 1 of 4
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

## What to build

Create the framework-independent, versioned boundary for loading a static
PrototypeCatalogSnapshot. A requested snapshot must carry a stable catalog and
model identity, immutable prototype definitions, and integrity diagnostics. A
missing or unsupported version must be an explicit failure; the loader must not
silently fall back to another model. This issue establishes the provider
contract consumed by inheritance and Classification, Similarity, and
Explanation, without adding classifier scoring or a UI.

The boundary must preserve language-neutral IDs, separate localized labels from
model keys, and keep catalog/model metadata available for reproducible later
analysis. A small test fixture is allowed, but the complete seed catalog belongs
to issue 021.

## Acceptance criteria

- [x] A supported prototype catalog request returns an immutable,
  version-identified `PrototypeCatalogSnapshot`.
- [x] Prototype and family IDs remain stable language-neutral keys, while
  labels and explanatory text remain outside matcher identity.
- [x] Catalog integrity checks reject duplicate IDs, malformed required
  metadata, and invalid direct references with explicit diagnostics.
- [x] An unavailable catalog/model version returns a model-availability
  diagnostic and never silently selects another version.
- [x] The boundary exposes catalog metadata required for reproducibility,
  including catalog version, prototype model version, and content identity
  when available.
- [x] Automated tests cover the supported, unavailable-version, and immutable
  snapshot paths for SC-IK-007 and SC-IK-008.

## Artifact sync required

- Application PRD: none; this implements the already-specified static catalog
  scope and does not change the product journey.
- Application architecture summary: none; the framework-independent domain
  boundary and static frontend architecture remain unchanged.
- Owning capability node/artifacts: required; update
  `.okf/capabilities/ingredient-prototype-knowledge.md` and its orchestration
  status with the implementation record.
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: capability-local provider work; no product,
  cross-capability boundary, or application-synthesis change is expected.

The application-synthesis gate is already current: `docs/prd.md` and
`docs/architecture/application-architecture-summary.md` exist, link the
capability artifacts, and have no unresolved High or Medium findings.

## Blocked by

None — can start immediately.

## Functional requirements addressed

This issue addresses Ingredient and Prototype Knowledge requirements 1, 2, 5,
and 7 for stable identity, immutable static snapshots, language-neutral model
keys, and version replacement without changing Formula semantics.

## Artifact anchors

- PRD: versioned catalog, immutable static seed loading, and replacement policy
- Domain model: `PrototypeCatalogSnapshot`, `PrototypeDefinition`, and
  `CatalogIntegrityPolicy`
- Use cases: `SelectCatalogSnapshot` and `ResolvePrototypeCatalog`
- Contract: `CatalogReference` and `PrototypeReference`
- Failure model: `catalog_version_unavailable`

## Acceptance scenarios addressed

- SC-IK-007 — Version reproducibility
- SC-IK-008 — Missing version recovery

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-IK-007 | not-applicable | deferred: domain-only slice; no rendered surface | deferred: no E2E harness |
| SC-IK-008 | not-applicable | deferred: domain-only slice; no rendered surface | deferred: no E2E harness |

## Human review gate

None. This slice changes static domain/data loading only and has no rendered
UI/UX change. Automated tests and artifact synchronization are the closure
requirements.

## Implementation record

- Added the framework-independent prototype catalog contract, immutable snapshot
  builder, deterministic content identity, loader, and explicit catalog/model
  availability diagnostics in `src/lib/domain/prototype-catalog.ts`.
- Added the static provider boundary in `src/data/prototypes/catalog.ts`.
- Reference trace: SC-IK-007 is covered by the supported-version, content
  identity, and replacement-isolation tests; SC-IK-008 is covered by the
  unavailable catalog/model version tests. Domain-only frontend obligations
  remain deferred under the inherited `when-supported` policy.
- Verification: `npm test -- --run src/lib/domain/prototype-catalog.test.ts`
  passed with 7 tests.
