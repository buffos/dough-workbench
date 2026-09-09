# Issue 022 — Bilingual prototype catalog inspection

## Issue Metadata

- ID: 022
- Title: Bilingual prototype catalog inspection
- Category: feature
- State: done
- Owning capability: Ingredient and Prototype Knowledge
- Owning capability node: .okf/capabilities/ingredient-prototype-knowledge.md
- Artifact root: docs/architecture/ingredient-prototype-knowledge
- Delivery order: 4 of 4
- Execution type: AFK
- Review gate: visual-review

## Parent Artifacts

- docs/architecture/ingredient-prototype-knowledge/prd.md
- docs/architecture/ingredient-prototype-knowledge/domain-glossary.md
- docs/architecture/ingredient-prototype-knowledge/canonical-domain-model.md
- docs/architecture/ingredient-prototype-knowledge/canonical-use-cases.md
- docs/architecture/ingredient-prototype-knowledge/canonical-api-cli-contract.md
- docs/architecture/ingredient-prototype-knowledge/acceptance-scenarios.md
- docs/architecture/ingredient-prototype-knowledge/readiness-review.md
- .okf/capabilities/shared/bilingual-content.md
- .okf/capabilities/shared/trust-and-provenance.md

## What to build

Expose the resolved prototype catalog through a reachable bilingual frontend
surface, using the existing Astro/Svelte static architecture. The user should
be able to inspect family hierarchy and prototype definitions, including
localized labels, inherited versus own structural features, identity-critical
features, confidence tier, catalog/model version, and provenance or maturity
limits.

Use a dedicated localized catalog route or an equivalently discoverable section
linked from the existing navigation. Keep stable IDs and internal matcher keys
out of ordinary product copy unless they are intentionally shown as metadata.
An unavailable version or invalid catalog must render a clear localized
diagnostic rather than silently showing another snapshot. This is an inspection
surface; classification scoring is a later capability.

## Acceptance criteria

- [x] The prototype catalog is reachable from both the English and Greek
  journeys through equivalent localized routes/navigation.
- [x] Family and prototype labels, hierarchy, inherited/own features,
  confidence tier, and catalog/model maturity are understandable without
  exposing raw matcher keys as ordinary copy.
- [x] The surface distinguishes structural constraints from identity modifiers
  and explains that expert-seed or calibration-limited data is not a guarantee.
- [x] The displayed catalog version remains tied to the resolved snapshot, and
  unavailable-version diagnostics do not silently fall back.
- [x] English and Greek required keys have parity and equivalent meaning;
  accessible names, keyboard navigation, focus visibility, and contrast are
  acceptable at supported desktop and mobile widths.
- [x] Automated locale/static checks remain green and the catalog route is
  present in the static build.

## Artifact sync required

- Application PRD: none; this exposes the already-specified learn-and-compare
  journey without changing MVP scope.
- Application architecture summary: none; the existing static bilingual
  content/presentation boundary remains valid.
- Owning capability node/artifacts: required; update
  `.okf/capabilities/ingredient-prototype-knowledge.md` and its orchestration
  status with the implementation record.
- Shared Bilingual Content: required to verify key parity and route
  counterparts; no shared policy change is expected.
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: capability-local presentation of existing static
  knowledge; no new product actor, backend, persistence, or cross-capability
  boundary is introduced.

## Blocked by

None — the versioned seed catalog and resolver are now available.

## Functional requirements addressed

This issue addresses Ingredient and Prototype Knowledge requirements 1, 5,
and 7 plus the inspectable catalog success criterion for localized labels,
stable model identity, and version reproducibility.

## Artifact anchors

- PRD: user-inspectable definitions, locale-separated labels, and catalog
  version reporting
- Domain model: `IngredientCatalogSnapshot`, `PrototypeCatalogSnapshot`, and
  `PrototypeDefinition`
- Use cases: `GetFamilyTree`, `GetPrototype`, and `GetCatalogMetadata`
- Contract: versioned `CatalogReference` and `PrototypeReference`
- Shared policy: `.okf/capabilities/shared/bilingual-content.md`
- Trust policy: `.okf/capabilities/shared/trust-and-provenance.md`

## Acceptance scenarios addressed

- SC-IK-002 — Stable language-neutral identity
- SC-IK-006 — Prototype inheritance
- SC-IK-007 — Version reproducibility
- SC-IK-008 — Missing version recovery

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-IK-002 | not-applicable | planned: locale/static route and parity checks | deferred: no E2E harness |
| SC-IK-006 | not-applicable | planned: catalog surface inspection | deferred: no E2E harness |
| SC-IK-007 | not-applicable | planned: version metadata inspection | deferred: no E2E harness |
| SC-IK-008 | not-applicable | planned: localized unavailable-version diagnostic | deferred: no E2E harness |

## Human review gate

This AFK issue requires `visual-review` before closeout. Review the complete
English and Greek catalog journeys, family/prototype hierarchy, inherited versus
own feature presentation, version/maturity wording, unavailable-version state,
responsive layout, keyboard/focus behavior, accessible names, and contrast.

## Implementation record

- Added the versioned, immutable prototype-catalog boundary and deterministic
  resolver in `src/lib/domain/prototype-catalog.ts`.
- Added the high-confidence family and named-prototype seed catalog in
  `src/data/prototypes/catalog.ts`.
- Added bilingual `/en/catalog/` and `/el/catalog/` inspection routes with
  navigation links, version metadata, unavailable-version recovery state,
  hierarchy, family-sourced versus type-specific features, requirements,
  type-defining details, maturity, and provenance presentation.
- Replaced the flat family/type card grids with a scalable explorer: explicit
  collapsible hierarchy, search, family filtering, URL-persisted selection,
  compact paginated results, and one selected type detail view.
- Added locale parity/static-build coverage and focused domain tests.
- Verification: the prior full `npm run verify` passed (Vitest 66 tests,
  ESLint, typecheck, Astro build, and static route checks); after the explorer
  update, `npm test`, `npm run lint`, `npm run typecheck`, and `git diff
  --check` passed. Astro build was not rerun because local preview is managed
  by the user.

## Human review status

The grouped visual review was approved by the user on 2026-09-09. The English
and Greek journeys, scalable catalog explorer, hierarchy navigation, selected
type detail view, responsive presentation, keyboard/focus behavior, accessible
names, contrast, and unavailable-version recovery were accepted for closeout.
