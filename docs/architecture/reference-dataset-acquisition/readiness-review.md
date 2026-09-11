# Reference Dataset Acquisition and Curation — Architecture Readiness Review

Status: ready for dependency-aware issue slicing
Date: 2026-09-10

## Review scope

Reviewed together:

- requirements-gap-analysis.md
- domain-glossary.md
- prd.md
- canonical-domain-model.md
- canonical-use-cases.md
- canonical-api-cli-contract.md
- acceptance-scenarios.md
- coverage-inventory.md
- .okf/capabilities/validation-calibration/reference-dataset-acquisition.md
- docs/prd.md
- docs/architecture/application-architecture-summary.md

## Findings

No unresolved High or Medium findings remain for the acquisition boundary.

The artifacts consistently distinguish:

- planned inventory from source-backed candidate data;
- navigation category from structural family;
- preparation identity from source record identity;
- source quality from acquisition permission and model confidence;
- offline acquisition from browser runtime behavior;
- raw source facts from normalized Formula/optional Process values;
- candidate readiness from parent release publication.

The source list and exact pilot contents are intentionally delivery-time
decisions. They are explicitly placed behind source/data approval gates and do
not require the architecture to invent URLs, licensing facts, or recipes.

## Architecture neutrality

The contract can be implemented with local TypeScript modules, scripts, a build
step, or a future CLI. It does not require a database, REST API, scraping
framework, or a particular parser. The only fixed boundary is that acquisition
is maintainer-controlled and offline for the static V1 frontend.

## Testability and traceability

Stable scenario IDs cover inventory identity, hierarchy, aliases, source
conditions, policy blocking, offline runs, normalization, Unknown handling,
ingredient resolution, review, pilot coverage, and immutability. The root
verification policy is satisfied by deterministic tests/manifests for the
offline path and catalogued end-to-end intent.

## Residual risks

- Source terms and reuse conditions must be checked per source before actual
  acquisition.
- Culinary source units may require conversions that cannot be justified; those
  values must remain Unknown or keep the candidate out of the release.
- The broad inventory is a coverage plan, not evidence that every preparation
  has one canonical formula.
- The pilot may reveal that current ingredient or structural-family catalog
  definitions need a separate refinement issue.

## Application synthesis and artifact impact

The root application PRD and architecture summary require updates because the
approved target now includes a maintainer-side offline acquisition pipeline and
a broad preparation inventory, while still preserving the frontend-only,
static, no-runtime-scraping boundary. Validation and Calibration remains the
owner of release/evidence semantics; Ingredient and Prototype Knowledge remains
the owner of reusable taxonomy and ingredient definitions.

The child delivery slice is now created and registered as Issues 041–044.
No implementation or human visual review is implied by this readiness result;
the explicit product/data gates are recorded on Issues 041, 042, and 044.
