# Dough Formula Intelligence — Application PRD

Status: Initial application synthesis
Date: 2026-09-07

This document is the product-level synthesis for the initial confirmed OKF
topology. Detailed capability truth is maintained under the linked
`docs/architecture/<capability>/` folders as bounded capabilities are tightened.

## Product goal

Dough Formula Intelligence is a bilingual Greek/English frontend that helps a
baker or formula explorer understand what a dough or batter contains, how its
process changes its behavior, which structural family it approaches, and which
named prototypes it resembles.

The product must be useful without pretending that heuristic scores are
laboratory measurements or that every formula has a canonical product label.
It must be able to return structural analysis, a hybrid result, or
`NoStrongCanonicalMatch`.

## Product scope

The product is browser-only and deployed as a static site to GitHub Pages. The
first vertical slice covers:

- Formula entry in grams with a structural flour denominator and baker's
  percentages.
- Hard validation for impossible input, including missing positive-mass
  structural flour; incomplete composition or Process data produces partial
  analysis rather than fabricated zeroes.
- Ingredient roles, functional composition, known/unknown fields, and
  provenance.
- Custom functional ingredients and per-line composition/availability
  overrides are allowed without mutating the shared ingredient catalog.
- A process representation covering the initial mixing, aeration, fermentation,
  late-fat, and related process subset from the domain specification.
- Deterministic composition metrics such as water, fat, sugars, protein
  subclasses, starch, fiber, salt, flour blend, and egg/dairy solids.
- Estimated metrics such as effective hydration and absorption, with explicit
  confidence.
- Heuristic metrics such as gluten potential, effective gluten, enrichment,
  tenderness, fluidity, gas retention, and setting, clearly labeled as model
  scores.
- Structural family membership and named-prototype similarity using separate
  composition, process, and overall identity scores.
- Confidence, missing-data, constraint-conflict, and model-contribution
  explanations.
- Greek and English localized navigation, content, labels, and explanations.
- A browser-side counterfactual flow that can recompute the analysis when
  selected formula or process values change.

## MVP non-goals

The MVP does not promise:

- exact loaf volume, crumb-cell size, spread diameter, baking time, proof time,
  fermentation rate, water activity, or sensory prediction;
- machine learning, neural-network classification, or LLM classification;
- automatic recipe scraping or a finalized external dataset provider;
- server persistence, accounts, an API, or backend services;
- automatic recipe generation or guaranteed substitution equivalence;
- a complete named-product taxonomy or calibrated numeric boundaries for every
  prototype;
- a claim that similarity is probability.

## Primary user journeys

### Analyze a formula

The user enters flour and ingredient lines, identifies roles and known values,
adds available process information, and receives normalized formula data,
calculated composition, estimated/heuristic metrics, structural families,
prototype similarities, confidence, and explanations.

### Understand process effects

The user changes process information while holding composition constant and
can see which effective metrics, risks, and process similarity values change.

### Explore a counterfactual

The user changes a selected ingredient or process parameter and compares the
new analysis with the current one. Changes must remain deterministic and
explainable; composition and process effects must remain distinguishable.

### Learn and compare

The user browses ingredient composition concepts and prototype definitions,
including the distinction between structural features and cultural identity
modifiers, in Greek or English.

### Switch language

The user can move between equivalent `/en/` and `/el/` routes without losing
the current public content context. Canonical model identifiers remain stable;
display labels and explanatory prose are localized.

The site root has a static default entry to `/en/`. Unsupported locale paths
resolve to the public 404 page; V1 does not guess a locale from browser
settings. Required public translation keys must exist in both locales.

## Capability map

The durable planning owners are:

- [Formula Analysis Workspace](../.okf/capabilities/formula-analysis-workspace.md)
- [Interactive Formula Exploration](../.okf/capabilities/interactive-exploration.md)
- [Ingredient and Prototype Knowledge](../.okf/capabilities/ingredient-prototype-knowledge.md)
- [Validation and Calibration](../.okf/capabilities/validation-calibration.md)
- [Bilingual Content and Localization](../.okf/capabilities/shared/bilingual-content.md)
- [Trust, Provenance, and Uncertainty](../.okf/capabilities/shared/trust-and-provenance.md)

The Formula Analysis Workspace is a roll-up. Its detailed planning frontiers
are Formula Input and Normalization, Composition and Intrinsic Metrics, Process
and Effective Behavior, and Classification, Similarity, and Explanation.
The current node-level source for the first frontier is the [Formula Input and
Normalization PRD](architecture/formula-input-normalization/prd.md), supported
by its [domain glossary](architecture/formula-input-normalization/domain-glossary.md).

The exact node-level reference set now also includes:

- [Composition and Intrinsic Metrics](architecture/composition-intrinsic-metrics/prd.md)
- [Process and Effective Behavior](architecture/process-effective-behavior/prd.md)
- [Classification, Similarity, and Explanation](architecture/classification-similarity-explanation/prd.md)
- [Interactive Formula Exploration](architecture/interactive-exploration/prd.md)
- [Ingredient and Prototype Knowledge](architecture/ingredient-prototype-knowledge/prd.md)
- [Bilingual Content and Localization](architecture/bilingual-content/prd.md)
- [Trust, Provenance, and Uncertainty](architecture/trust-and-provenance/prd.md)

## Cross-capability dependencies

```text
Formula Input and Normalization
  -> Composition and Intrinsic Metrics
  -> Process and Effective Behavior
  -> Classification, Similarity, and Explanation
  -> Interactive Formula Exploration
```

Ingredient and Prototype Knowledge supplies versioned definitions to the
analysis capabilities. Trust, Provenance, and Uncertainty applies to every
metric and explanation. Bilingual Content and Localization applies to all
public journeys. Validation and Calibration governs model maturity and
regression evidence but does not block the first deterministic vertical slice.

## Shared product policies

- `Calculated`, `Estimated`, and `Heuristic` are distinct semantic classes.
- `Unknown` is not zero; missing values reduce coverage/confidence rather than
  silently changing the formula.
- `Formula` and `Process` remain separate structures.
- Named ingredients resolve to functional composition before classification.
- Composition similarity and process similarity remain separate and are not
  probabilities.
- Confidence is independent from similarity.
- No-match and hybrid outputs are valid first-class outcomes.
- Required bilingual keys are checked for Greek/English parity; missing
  translations are diagnostics rather than silent fallback text.
- Internal canonical units are grams, degrees Celsius, and seconds.
- V1 input is grams-only, including eggs entered by mass.
- Process fields distinguish `Known`, explicit `None`, and `Unknown`.
- Only structural flour components establish the flour denominator;
  `ContinuousPhase` contributes to effective metrics, while inclusion and
  presentation roles remain separate from the continuous phase.
- Internal model data is versioned and deterministic for identical inputs and
  model versions.

These policies are recorded in [ADR-0001](agents/adr/0001-calculated-estimated-heuristic.md), [ADR-0002](agents/adr/0002-formula-process-separation.md), [ADR-0003](agents/adr/0003-composition-process-similarity.md), [ADR-0004](agents/adr/0004-unknown-is-not-zero.md), [ADR-0005](agents/adr/0005-functional-composition-boundary.md), [ADR-0006](agents/adr/0006-static-frontend-platform.md), and [ADR-0007](agents/adr/0007-staged-calibration-dataset.md).

## Implementation sequence

1. Establish the Astro/Svelte bilingual shell and GitHub Pages build.
2. Implement the arithmetic core: ingredient catalog, grams, flour denominator,
   baker's percentages, and deterministic composition metrics.
3. Add the process schema and intrinsic/effective metric separation.
4. Add an expert-seed classifier for the high-confidence V1 families.
5. Build the explainable analysis workspace and no-match/confidence states.
6. Add counterfactual recomputation and comparison UI.
7. Curate and version the first gold dataset.
8. Calibrate and expand the taxonomy only when validation evidence supports it.

No issue slicing begins until the application synthesis remains aligned with the
graph and the inherited root verification policy is satisfied.

## Verification strategy

The project will verify the domain engine with unit tests and deterministic
regression scenarios, the analyzer with frontend integration scenarios, and
the public site with static build, route, language-parity, accessibility, and
GitHub Pages preview checks when those harnesses exist.

Required scenario families include canonical recognition, no-match behavior,
cross-family sanity, smooth counterfactuals, process independence, functional
ingredient equivalence, unknown handling, hybrid recognition, confidence
sanity, and explanation fidelity.

The inherited root policy is `when-supported`: backend-boundary verification is
not applicable, frontend-integration verification is required when a harness
exists, and end-to-end scenarios are catalogued without blocking until an
appropriate harness exists.
