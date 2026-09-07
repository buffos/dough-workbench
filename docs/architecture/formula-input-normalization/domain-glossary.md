# Formula Input and Normalization — Domain Glossary

Status: Canonical vocabulary for the bounded capability
Date: 2026-09-07

This glossary is the language source for the node PRD, canonical domain model,
use cases, external contract, and acceptance scenarios. Canonical terms are
language-neutral; Greek labels are presentation translations, not alternate
domain names.

## Actors

### Formula Explorer

The person who enters, reviews, or experiments with a dough or batter formula.
This includes a baker, recipe developer, or curious user.

Discouraged terms: `end user` when the formula activity is what matters;
`customer` unless a future product workflow introduces accounts.

### Model Maintainer

The person who updates ingredient definitions, prototype definitions, model
versions, or validation evidence. This actor is relevant to future calibration,
not required for the first public input workflow.

## Business objects

### Formula

The canonical composition aggregate containing the flour system, ingredient
lines, metadata, settings, and references needed to pair with a Process for
analysis. Process is a separate aggregate and is not a nested Formula
mutation boundary. A Formula is normalized input, not necessarily a named
food product.

### Ingredient

A canonical or custom functional composition definition with identity, physical
properties, provenance, confidence, and optional chemistry data. An Ingredient
does not classify a Formula.

### IngredientLine

A Formula-specific occurrence of an Ingredient with mass, role, and optional
local composition or availability overrides. Two lines may reference the same
Ingredient while having different roles or overrides.

### FlourSystem

The structural flour aggregate used to establish the baker's flour denominator
and hold flour-blend properties and confidence.

### FlourComponent

A flour-bearing component inside a FlourSystem. Its mass contributes to the
flour denominator when it is a positive-mass structural flour component.

### Process

The separate aggregate describing how a Formula is mixed, rested, aerated,
fermented, laminated, thermally processed, and shaped.

### FormulaProcessReference

The versioned analysis-time reference that pairs one Formula snapshot with one
Process snapshot without merging their ownership or edit lifecycles.

### AdditionStep

An ordered Process entry describing which ingredients are added, what action is
taken, and for how long. Addition order is part of Process, not an implicit
property of the final ingredient set.

### CompositionOverride

A Formula-line-local replacement or completion of composition data for an
Ingredient. It does not mutate the shared catalog definition.

### AvailabilityOverride

A Formula-line-local value for how available a component is to the model, such
as water or fat availability. It is distinct from whether the data itself is
known.

### FormulaAnalysis

The structured result produced from a normalized Formula and Process. It may
contain calculated composition, intrinsic metrics, effective metrics,
classification, similarities, diagnostics, confidence, explanations, and
model version.

## Workflows and actions

### Build Formula

Create or edit the Formula's flour system and IngredientLines using canonical
mass and role data.

### Record Process

Create or edit the separate Process aggregate, preserving ordered additions and
distinguishing known values, explicit absence, and unknown values.

### Validate Formula

Check hard input invariants before analysis. A Formula without a positive-mass
structural flour component is invalid.

### Normalize Formula

Resolve the flour denominator, calculate baker's percentages, normalize flour
blend fractions, and preserve provenance/unknown values without classifying the
Formula.

### Produce Partial Analysis

Return the analysis that can be supported by incomplete but structurally valid
input, marking unavailable outputs and reducing coverage/confidence rather than
inventing zero values.

## Policies and rules

### Structural Flour Denominator Rule

The baker's flour denominator is the sum of positive-mass structural flour
components. Non-flour starches, inclusions, and surface materials do not become
flour merely because they are present in the Formula.

### Role Participation Policy

`ContinuousPhase` lines may contribute to effective continuous-phase metrics.
`Inclusion`, `SurfaceTreatment`, `Filling`, `Topping`, and `Other` remain
separate from that phase unless a later explicit policy maps them. Ingredient
role is not a product label.

### Partial Analysis Policy

Impossible input blocks analysis. Missing composition or Process data does not;
it produces partial results, unavailable metrics, reduced coverage, and lower
confidence.

### Unit Policy

V1 accepts mass in grams. Eggs and other countable ingredients are entered by
mass; count/volume conversion is deferred until a trusted conversion source
and uncertainty policy exist.

### Override Isolation Policy

Custom functional definitions and per-line overrides are allowed, but catalog
definitions are immutable from the analysis workflow. Every override carries
provenance and confidence.

### Value-State Policy

`Known` means a value is supplied or supported by an accepted source. `None`
means the concept explicitly does not apply or is absent. `Unknown` means the
value could apply but was not supplied or cannot be established. `Unknown` is
not zero.

## States and status vocabulary

### Invalid Input

Input that violates a hard invariant, such as missing positive-mass structural
flour or an invalid mass. It cannot be normalized for analysis.

### Incomplete Input

Structurally valid input with unknown composition or Process fields. It may
produce a partial analysis.

### Partial Analysis

An analysis result with valid supported outputs and explicit unavailable or
lower-confidence areas caused by incomplete input.

### Known, None, Unknown

The three value states defined by the Value-State Policy. They are not
interchangeable UI labels.

## Metrics and reporting terms

### Baker's Percentage

An ingredient mass divided by the structural flour denominator, expressed as a
percentage. Flour is the 100% reference.

### Coverage

The proportion of a metric or prototype evaluation supported by available
inputs and applicable weighted features. Coverage is not confidence.

### Confidence

An estimate in the canonical numeric range `[0,1]` of how strongly the
available data, process coverage, and model maturity support an output.
Confidence is not similarity. Presentation bands such as low/medium/high are
derived labels, not the canonical value.

### Calculated, Estimated, Heuristic

The three semantic classes of output. Calculated values follow known arithmetic;
estimated values depend on assumptions; heuristic values are model scores.

### Functional Composition

The composition and properties that matter to the model, such as water, fat,
protein subclasses, starch, sugar, physical state, and availability. It is the
classifier-facing representation of an Ingredient after normalization.

## Critical distinctions

| Canonical distinction | Meaning |
|---|---|
| Formula vs recipe | A Formula is the normalized analytical object. A recipe is an informal source or preparation description and is not the canonical aggregate name. |
| Ingredient vs IngredientLine | Ingredient is reusable definition; IngredientLine is Formula-specific use. |
| FlourSystem vs FlourComponent | FlourSystem is the aggregate; FlourComponent is one blend member. |
| Structural flour component vs Structural role | A structural flour component must be flour-bearing and positive-mass. The broader `Structural` role alone does not make a non-flour ingredient part of the flour denominator. |
| Unknown vs None vs zero | Unknown is missing knowledge, None is explicit absence/non-applicability, and zero is a known numeric quantity. |
| Data availability vs water availability | Data availability describes whether a value is known; water availability is a model coefficient describing functional availability. |
| Override vs catalog definition | An override is local to one Formula line; the catalog remains unchanged. |
| Formula vs Process | Formula describes what is present; Process describes how it is handled. A FormulaProcessReference pairs snapshots for analysis without nesting ownership. |

## Recommended bilingual display labels

| Canonical term | English label | Greek label |
|---|---|---|
| Formula | Formula | Φόρμουλα |
| IngredientLine | Ingredient line | Γραμμή υλικού |
| FlourSystem | Flour system | Σύστημα αλεύρων |
| Baker's Percentage | Baker's percentage | Ποσοστό αρτοποιού |
| Functional Composition | Functional composition | Λειτουργική σύσταση |
| Partial Analysis | Partial analysis | Μερική ανάλυση |
| Known | Known | Γνωστό |
| None | None | Δεν εφαρμόζεται / Απουσιάζει |
| Unknown | Unknown | Άγνωστο |
| Confidence | Confidence | Βαθμός εμπιστοσύνης |

## Open terminology issues

No high-impact vocabulary conflict remains for this capability. The terms
`dough`, `batter`, and `formula` may require contextual display wording, but
they do not change the canonical domain boundaries above.
