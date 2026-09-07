# Formula Input and Normalization — Product Requirements

Status: Draft for canonical modeling
Date: 2026-09-07

## Purpose

Define the product behavior for turning a Formula Explorer's ingredient and
process input into a valid, canonical Formula and Process that downstream
analysis can consume. This document is scoped to input, validation, and
normalization; it does not define classification or final interpretation.

## Product summary

The capability lets a Formula Explorer create a Formula using ingredient lines,
flour components, roles, and masses, record a separate Process, and hand a
normalized Formula/Process pair to analysis. It validates hard invariants,
resolves the structural flour denominator, derives baker's percentages, and
preserves unknown values and provenance.

Structurally valid but incomplete input is allowed to continue as a partial
analysis. Impossible input is rejected with a useful correction path.

## Product goals

- Make the flour denominator and baker's percentages unambiguous.
- Preserve the difference between an Ingredient definition and its use in an
  IngredientLine.
- Preserve role, provenance, confidence, unknown values, explicit absence, and
  local overrides.
- Allow analysis to proceed when missing data is honest and structurally valid.
- Keep Formula and Process independently editable and serializable.
- Give downstream capabilities a stable, language-neutral normalized object.

## Non-goals

- Product classification, prototype similarity, or outcome explanation.
- Full recipe authoring, shopping lists, serving scaling, or nutritional
  labeling.
- Count/volume conversion in V1; input is grams-only.
- Server persistence, accounts, or shared formula storage.
- Mutating the canonical ingredient catalog from the input workflow.
- Deciding the future dataset collection or calibration source.

## Actors

### Formula Explorer

Creates or edits a formula, assigns roles, supplies masses and known data, and
records whatever process information is available.

### Model Maintainer

Maintains catalog definitions and provenance outside the Formula Explorer's
local input workflow. This actor does not receive permission to change a
catalog definition through a Formula line override.

## Domain scope

The capability uses these canonical objects:

- `Formula`
- `FlourSystem`
- `FlourComponent`
- `Ingredient`
- `IngredientLine`
- `CompositionOverride`
- `AvailabilityOverride`
- `Process`
- `AdditionStep`
- provenance/confidence metadata

See the [domain glossary](domain-glossary.md) for canonical definitions and
critical distinctions.

## Core business capabilities

### Build the Formula

The Formula Explorer can add, remove, and edit flour components and ingredient
lines, select catalog Ingredients, add custom functional Ingredients, assign a
role, and enter mass in grams.

### Record the Process

The Formula Explorer can capture the separate Process aggregate, including
ordered AdditionSteps and the available mixing, rest, aeration, fermentation,
lamination, thermal, and geometry fields. Missing fields remain unknown rather
than becoming defaults.

### Validate and normalize

The capability checks hard invariants, computes the flour denominator and
baker's percentages, normalizes flour blend fractions, and produces a stable
Formula/Process representation for analysis.

### Preserve incomplete knowledge

The capability allows structurally valid input with missing composition or
Process data. It marks the affected values as unavailable/unknown so downstream
analysis can return partial results with reduced coverage and confidence.

## Required business rules

1. A Formula must contain at least one positive-mass structural flour
   component. Otherwise normalization is blocked.
2. Ingredient-line mass is entered in grams and must be a valid positive mass.
3. The flour denominator is the sum of positive-mass structural flour
   components only.
4. Baker's percentage is derived from mass divided by the flour denominator;
   it is not an independently authoritative user value.
5. Flour blend percentages must satisfy the V1 `formula-normalization-v1`
   policy: their complete sum must be within `100.00% ± 0.01` percentage
   points, inclusive.
6. A non-flour Ingredient does not enter the flour denominator merely because
   its role is `Structural`.
7. `ContinuousPhase` participates in effective continuous-phase metrics.
   `Inclusion`, `SurfaceTreatment`, `Filling`, `Topping`, and `Other` remain
   separate from that phase unless a later explicit policy maps them.
8. Catalog definitions are immutable from the Formula workflow.
9. Custom functional Ingredients and per-line composition/availability
   overrides are allowed and remain local to the IngredientLine.
10. Every supplied, inferred, estimated, or overridden value preserves
    provenance and confidence.
11. `Known`, explicit `None`, `Unknown`, and numeric zero are distinct states.
12. Missing composition or Process data does not become zero and does not by
    itself block partial analysis.
13. V1 accepts grams only, including eggs entered by mass.
14. Formula and Process are separate objects even when edited in one screen.

## Required workflows

### Create a structurally valid formula

1. The Formula Explorer starts a Formula.
2. They add at least one structural flour component with positive mass.
3. They add IngredientLines, assign roles, and enter masses in grams.
4. The system derives the flour denominator and baker's percentages.
5. The system returns a normalized Formula ready for analysis.

### Correct invalid input

If a line has missing/invalid mass, or the Formula has no positive-mass
structural flour, the system blocks normalization, identifies the offending
condition, and preserves the user's other valid input for correction.

### Continue with incomplete composition data

If structural flour exists but W, P/L, availability, acidity, or another
composition field is unknown, the system preserves the unknown and returns a
normalized Formula. Downstream analysis can produce partial results and must
report reduced coverage/confidence.

### Add a custom functional ingredient

The Formula Explorer adds a custom Ingredient by supplying the functional
composition that is known. The system records its provenance/confidence and
does not add it to the shared catalog. A per-line override affects only that
Formula occurrence.

### Record incomplete Process

The Formula Explorer records known Process fields, explicitly marks absent
process elements as `None`, and leaves unavailable information as `Unknown`.
Composition/intrinsic preparation can continue when Process is incomplete;
process-dependent analysis reports its reduced coverage.

### Edit without cross-object leakage

Changing a Process value must not rewrite the normalized ingredient composition.
Changing an IngredientLine override must not mutate the catalog definition or
another Formula line that references the same Ingredient.

## Functional requirements

### FR-01 — Formula construction

The system must create and edit a Formula containing a FlourSystem,
IngredientLines, metadata, and analysis settings references. Process is a
separate object associated for analysis handoff, not a nested Formula mutation
boundary.

### FR-02 — Flour system

The system must manage multiple FlourComponents, their masses, blend
percentages, grain/refinement information, optional flour properties, and data
confidence.

### FR-03 — Ingredient lines

The system must manage an Ingredient reference or custom functional Ingredient,
mass, role, optional local overrides, provenance, and confidence.

### FR-04 — Role capture

The system must expose the canonical roles `Structural`, `ContinuousPhase`,
`Inclusion`, `SurfaceTreatment`, `Filling`, `Topping`, and `Other` without
using them as product labels.

### FR-05 — Unit and normalization

The system must accept grams in V1, calculate the positive structural flour
denominator, and derive baker's percentages deterministically.

### FR-06 — Process capture

The system must preserve process order and distinguish `Known`, `None`, and
`Unknown` for applicable Process fields. The V1 field vocabulary uses the
formal process sections `Mixing`, `IngredientAddition`, `Aeration`,
`Fermentation`, `Lamination`, `ThermalProcess`, and `Geometry`; durations are
seconds, temperatures are degrees Celsius, normalized intensities/levels are
in `[0,1]`, and enum values are the canonical lower-case IDs listed in the
domain model. Process controls must not accept arbitrary text as an
algorithm-facing value: categorical fields use controlled options, numeric
fields use their declared units/ranges, lamination fat selects a Formula line,
and AdditionStep actions use the controlled action vocabulary.

### FR-07 — Validation

The system must identify hard-invalid input, prevent normalization when a hard
invariant fails, and preserve correctable input state.

### FR-08 — Partial input

The system must allow structurally valid incomplete input to proceed, preserving
unknowns and exposing the fields that limit downstream analysis.

### FR-09 — Override isolation

The system must keep custom definitions and composition/availability overrides
local to the Formula line and must not mutate shared catalog data.

### FR-10 — Bilingual presentation

The input workflow must expose equivalent Greek and English labels while
keeping canonical domain identifiers stable across locales.

## Non-functional requirements

- Deterministic normalization: identical valid inputs and model versions produce
  identical normalized output.
- Explainable validation: every rejection identifies the violated invariant in
  user language and canonical terms.
- Lossless uncertainty: unknown, none, zero, inferred, and overridden values
  remain distinguishable in serialized state.
- Local safety: no input operation requires a backend or mutates shared remote
  state.
- Testability: invariants, role participation, override isolation, and partial
  analysis handoff are independently testable.
- Accessibility and bilingual parity: every input control and validation state
  has a usable label and equivalent Greek/English presentation.

## Acceptance scenarios

### AS-01 — Flour denominator

Given two positive-mass structural flour components, when the Formula is
normalized, then the denominator equals their combined mass and every baker's
percentage uses that denominator.

### AS-02 — Missing structural flour

Given a Formula with no positive-mass structural flour component, when the user
tries to normalize it, then normalization is blocked and the missing invariant
is explained.

### AS-03 — Invalid mass

Given an IngredientLine with a missing, non-finite, zero, or negative mass,
when normalization is attempted, then the line is rejected with a correction
message and valid sibling lines remain available.

### AS-04 — Unknown is preserved

Given a flour component with unknown W and P/L, when the Formula is normalized,
then W and P/L remain unknown, are not treated as zero, and downstream coverage
can report the missing data.

### AS-05 — Role separation

Given raisins marked `Inclusion` and banana puree marked `ContinuousPhase`, when
the Formula is normalized, then their role metadata remains distinct and
downstream effective-phase calculations can treat them differently.

### AS-06 — Custom ingredient isolation

Given a custom Ingredient with explicit functional composition, when it is used
in one FormulaLine and overridden, then the shared catalog and another line
referencing the same catalog Ingredient remain unchanged.

### AS-07 — Grams-only input

Given an egg line, when the user enters its mass in grams, then the normalized
line stores grams and no count/volume conversion is required for V1.

### AS-08 — Process tri-state

Given a Process with fermentation explicitly `None`, another field `Unknown`,
and a known mixing method, when it is normalized, then all three states remain
distinct and yeast potential is not inferred from the unknown field.

### AS-09 — Partial analysis handoff

Given a structurally valid Formula with incomplete Process data, when it is
handed to analysis, then composition/intrinsic preparation remains available
and process-dependent outputs identify reduced coverage/confidence.

### AS-10 — Bilingual parity

Given the same input workflow in `/en/` and `/el/`, when the user switches
locale, then the canonical values and state remain unchanged while labels and
validation messages are translated.

## Explicit assumptions and deferred refinements

- The first vertical slice uses in-memory editing; persistence, import/export,
  and shareable formula links are deferred.
- Count/volume conversion is deferred until a trusted conversion source and
  uncertainty policy exist.
- The V1 flour-blend tolerance is fixed by the canonical
  `formula-normalization-v1` policy. Composition mass-total tolerance remains
  outside this capability and is owned by the downstream composition model.
- The initial input workflow supports the ingredient and process subset named
  in the formal domain specification; catalog breadth is a separate
  capability.
