# Dough Formula Intelligence — Application Architecture Summary

Status: Current application synthesis
Date: 2026-09-10

This summary consolidates the initial architecture direction and links back to
the durable planning graph. Capability-specific exact contracts are maintained
under their owning folders after bounded-node refinement.

## System constraints

- Frontend-only application.
- Static deployment to GitHub Pages.
- All formula analysis runs locally in the browser.
- Greek and English are first-class locales.
- No backend, account system, database, or server API is required for V1.
- The calculation core must be deterministic, explainable, versioned, and
  independent from the presentation framework.
- The public browser consumes static release data only; source acquisition and
  normalization run in a maintainer-controlled offline workflow.

## Platform decision

The baseline is Astro + TypeScript + Svelte:

- Astro provides static site generation, file-based routes, content-oriented
  pages, and bilingual route support.
- Svelte owns the stateful analysis workspace as a client-side island.
- TypeScript owns the domain model and engines without importing UI concerns.
- GitHub Actions builds and deploys the static output to GitHub Pages.

The deployment configuration must account for a repository base path, generated
static assets, and a public `404.html`. The platform decision is recorded in
[ADR-0006](../agents/adr/0006-static-frontend-platform.md).

## Logical layers

### Content and presentation

Astro layouts and content collections provide the public educational pages,
localized navigation, metadata, glossary, and prototype explanations. Content
is organized by locale and uses stable canonical IDs for concepts that appear
in both languages.

### Interactive analysis UI

Svelte components provide formula editing, process editing, result cards,
metric labels, explanations, language-aware presentation, and counterfactual
comparison. They consume domain results; they do not reimplement composition or
classification rules.

### Domain engine

Framework-independent TypeScript modules follow the boundaries established by
the formal domain specification:

```text
IngredientCatalog
FormulaNormalization
CompositionEngine
MetricEngine
ProcessEngine
PrototypeCatalog
SimilarityEngine
ExplanationEngine
Validation
ReferenceRelease
CalibrationEvaluation
```

The primary data flow is:

```text
Ingredients
  -> Composition
  -> IntrinsicMetrics
  -> Process
  -> EffectiveMetrics
  -> Classification
  -> OutcomeDescription
```

The classifier receives effective metrics and process features, not raw
ingredient names. Formula and Process remain independent input structures.

## Input contract decisions

- A formula with no positive-mass structural flour component is invalid and
  cannot be analyzed.
- Missing composition or Process data produces partial analysis with explicit
  unavailable metrics and reduced coverage/confidence.
- V1 accepts grams only, including eggs by mass.
- Catalog definitions are immutable from the UI. Custom functional ingredients
  and per-line composition/availability overrides are local to the line and
  carry provenance.
- Only structural flour components establish the flour denominator.
  `ContinuousPhase` participates in effective metrics; inclusion, surface,
  filling, topping, and other roles remain separate from the continuous phase.
- Process fields distinguish known values, explicit `None`, and `Unknown`.

### Versioned model and reference data

Ingredient definitions, prototype definitions, matcher metadata, model
parameters, Gold Dataset releases, and validation records are static, versioned
project data. They are not hidden inside UI components. A maintainer-controlled
offline acquisition workflow may build traceable candidate records from
approved sources, but the first Gold Dataset release contains only normalized,
reviewed, attributable candidates. Its accepted records may carry both
calibration/reference roles, while public selection is controlled by an
explicit `publicSelectable` flag; validation/test records are not silently
exposed. The browser never scrapes sources or fetches recipe content at runtime.

The Formula Workspace consumes a compact reference summary and, on selection,
receives an immutable Formula Snapshot plus an optional independent Process
Snapshot. It copies those values into a local draft. No browser edit mutates a
release, and an unavailable release produces a diagnostic instead of a silent
fallback. This boundary remains compatible with a future local curation or
calibration CLI without requiring a V1 backend.

## Proposed project boundaries

```text
src/
  components/              # framework-neutral visual/presentation pieces
  content/                  # bilingual educational/content sources
  islands/                  # stateful Svelte analysis UI
  lib/
    domain/                # Formula, Process, composition, metrics, models
    i18n/                  # locale helpers and translated UI labels
  data/
    ingredients/           # versioned functional ingredient definitions
    prototypes/            # versioned prototype definitions
    reference-formulas/    # versioned Gold Dataset/reference releases
  reference-data/          # maintainer-only inventory, source, and candidate inputs
scripts/
  reference-data/           # offline acquisition/normalization adapters
```

The exact folder names can change during implementation, but the dependency
direction must remain: UI -> application adapters -> domain engine/data. The
domain engine must not depend on Astro, Svelte, browser storage, or translated
display text.

## Bilingual architecture

The initial public route policy is explicit `/en/` and `/el/` paths. Both
locales receive stable route counterparts where content exists. The language
switcher uses route metadata rather than string replacement. Canonical IDs,
metric names, model versions, and dataset identifiers are language-neutral;
Greek and English labels/explanations are presentation data.

The site root is a static default entry to `/en/`; unsupported locale paths
resolve to the public 404 page, and V1 does not use browser-language guessing.
Required UI, help, metadata, accessibility, and explanation keys must exist in
both locale catalogs. Fallback behavior and parity verification are owned by
[Bilingual Content and Localization](../../.okf/capabilities/shared/bilingual-content.md).

## Trust and uncertainty boundary

Each result carries semantic class, confidence, coverage, provenance, and model
version where applicable. The UI must distinguish calculated facts from
estimates and heuristic scores, must preserve unknown values, and must never
render similarity as probability. These rules are owned by [Trust, Provenance,
and Uncertainty](../../.okf/capabilities/shared/trust-and-provenance.md).
The shared contract also fixes numeric confidence/coverage in `[0,1]`, explicit
model maturity, evidence references, and a precision policy.

## Cross-capability sequencing

```text
Coverage Inventory / Approved Source Registry
  -> Offline Acquisition / Normalization
  -> Gold Dataset / Reference Release
  -> Formula Workspace (local Formula + optional Process draft)
  -> Analysis and Counterfactual Exploration

Input/Normalization
  -> Composition/Intrinsic Metrics
  -> Process/Effective Behavior
  -> Classification/Similarity/Explanation
  -> Counterfactual Exploration
```

The Ingredient and Prototype Knowledge capability supplies the catalog and
prototype definitions across this path. Reference Dataset Acquisition and
Curation supplies the inventory, source registry, and traceable offline
candidate path. Validation and Calibration supplies reference releases, model
maturity, and regression evidence. The Formula Workspace owns applying
snapshots to a local draft; Interactive Formula Exploration owns subsequent
what-if changes. Application-level changes must refresh this summary when
boundaries, dependencies, verification, or sequencing change.

## Node specification sources

The exact capability contracts are maintained next to their owning nodes:

- [Formula Input and Normalization](formula-input-normalization/prd.md)
- [Composition and Intrinsic Metrics](composition-intrinsic-metrics/prd.md)
- [Process and Effective Behavior](process-effective-behavior/prd.md)
- [Classification, Similarity, and Explanation](classification-similarity-explanation/prd.md)
- [Interactive Formula Exploration](interactive-exploration/prd.md)
- [Ingredient and Prototype Knowledge](ingredient-prototype-knowledge/prd.md)
- [Bilingual Content and Localization](bilingual-content/prd.md)
- [Trust, Provenance, and Uncertainty](trust-and-provenance/prd.md)
- [Reference Dataset Acquisition and Curation](reference-dataset-acquisition/prd.md)

## Verification strategy

The architecture expects:

- unit tests for normalization, invariants, deterministic metrics, and pure
  model functions;
- scenario-linked integration tests for formula/process editing and result
  rendering;
- static build and route checks for GitHub Pages base paths, 404 behavior, and
  `/en/`/`/el/` parity;
- counterfactual regression tests for smooth changes and process independence;
- reference-release resolution, public eligibility, immutable snapshot copying,
  dirty-draft replacement, and no-fallback diagnostics;
- offline source acquisition manifests, normalization traceability, source
  policy enforcement, and pilot coverage reports;
- validation datasets and confusion/unknown-detection evidence once calibration
  begins.

The inherited root verification policy is `when-supported`: backend-boundary is
not applicable, frontend-integration coverage is required when supported, and
end-to-end coverage is catalogued without blocking until a suitable harness
exists.

## Architecture open decisions

- Approve the full preparation coverage inventory and navigation/family mapping.
- Populate the source registry and verify the acquisition/reuse status of each
  selected source, including attribution/licensing notes.
- Acquire and normalize the pilot candidate records before publishing
  `gold-formulas-v2`.
- Choose the concrete static release file layout and quality-weight values.
- Define the first calibrated parameter release after the Gold evidence passes
  its partition and regression checks.

These are now bounded delivery decisions rather than hidden planning fog.
Unattended runtime scraping remains outside the product; broader source
collection and controlled experiments remain later maturity stages.
