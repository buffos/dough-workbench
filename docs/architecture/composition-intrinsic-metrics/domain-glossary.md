# Composition and Intrinsic Metrics — Domain Glossary

Status: Canonical vocabulary
Date: 2026-09-08

## Core terms

### Functional composition

The model-facing composition of an Ingredient or IngredientLine: water, fat,
protein subclasses, starch, sugars, fiber, salt, and optional chemistry or
physical properties. It is not a complete nutrition label.

### Composition snapshot

A versioned, immutable-at-analysis-time set of functional values plus
provenance, confidence, and value states.

### Intrinsic metric

A metric derived from Formula composition before Process modifiers are applied.

### Composition total

A mass total aggregated from known functional composition values and line
participation rules. A total with missing contributors is marked partial.

### Effective availability

A factor in [0,1] that describes how much of a known functional component is
treated as participating at the relevant stage. It is not ingredient stock
availability and does not fill an unknown composition value.

### Flour denominator

The sum of positive-mass, flour-bearing structural components used as the
100% reference for baker's percentages.

### Acid-neutralization capacity

An optional composition property expressed as `g NaHCO3 equivalent / 100 g
ingredient`. It is an input datum, not a universal pH shortcut.

## Metric classes

| Class | Meaning | Example |
|---|---|---|
| Calculated | Direct arithmetic from known declared values | total water |
| Estimated | Model inference from partial/indirect evidence | effective hydration |
| Heuristic | Versioned score or rule-based interpretation | GPI, enrichment |

## Value and evidence terms

- `Known`: a value is supplied by an accepted catalog or local source.
- `None`: the property is explicitly absent or not applicable.
- `Unknown`: the property could apply but no accepted value is available.
- `Provenance`: where a value came from and how it was obtained.
- `Coverage`: the fraction of required evidence present for a metric.
- `Confidence`: support strength combining evidence quality and model maturity.

## Critical distinctions

| Distinction | Rule |
|---|---|
| Data availability vs functional availability | Known composition can still have an availability factor below 1; unknown composition has no numeric value to scale. |
| Composition vs Process | Composition describes what is present; Process changes how it behaves. |
| Total vs prediction | A composition total is not a claim about baked output. |
| Estimate vs heuristic | An estimate fills a modeled quantity; a heuristic interprets a state or tendency. |
| Flour-bearing vs structural | A structural role alone does not make a line part of the flour denominator. |

## Canonical units

Masses and totals use `g`; baker's percentages use `%`; pH is dimensionless;
acid-neutralization capacity uses `g NaHCO3 equivalent / 100 g ingredient`;
availability, coverage, and confidence use [0,1].
