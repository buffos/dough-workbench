# Composition and Intrinsic Metrics — Canonical Domain Model

Status: Canonical
Date: 2026-09-08

## Context

This capability is the pre-process composition boundary. It consumes a
normalized Formula and emits immutable analysis snapshots. It does not own
Formula editing, Process behavior, or prototype classification.

## Aggregates and value objects

### FunctionalCompositionSnapshot

Value object containing canonical composition fields, optional chemistry and
physical properties, value states, provenance, source confidence, and catalog
version. It is immutable once attached to a FormulaAnalysis.

### IntrinsicMetricSet

Analysis value object containing deterministic totals, estimates, heuristics,
and per-metric evidence. It records the composition model version and
limitations.

### CompositionContribution

The contribution of one normalized line to one metric: line ID, source field,
raw mass, role participation, availability factor when applicable, resulting
mass, and evidence state.

### FlourDenominator

Derived value object containing the positive structural flour mass, included
component IDs, blend fractions, tolerance policy, and calculated provenance.

## Policies and domain services

- CompositionParticipationPolicy maps Formula roles to metric families.
- CompositionAggregationService sums supported known fields and records
  partial coverage.
- IntrinsicEstimationPolicy computes only estimates whose prerequisites are
  present and carries a model version.
- HeuristicMetricPolicy computes bounded scores without presenting them as
  measurements.
- CompositionExplanationService emits contribution and limitation evidence.

## Invariants

1. The flour denominator is positive before flour-relative metrics are emitted.
2. A missing value cannot be represented as numeric zero.
3. Availability factors are within [0,1] and cannot manufacture a known
   component.
4. Calculated totals are arithmetic only; calibration parameters cannot alter
   their formula.
5. An intrinsic result references one Formula revision and one model version.
6. A non-flour line cannot enter the flour denominator through a role label.
7. Acid-neutralization capacity uses the canonical unit or remains unknown.

## Lifecycle

`CompositionAttached -> IntrinsicCalculated -> EstimatesEvaluated ->
HeuristicsEvaluated -> Explained`. Any stage may return a partial result with
explicit unavailable metrics. An invalid Formula is rejected before this
aggregate is created.

## Domain events

- FunctionalCompositionResolved
- IntrinsicMetricsCalculated
- IntrinsicMetricBecameUnavailable
- IntrinsicAnalysisExplained

Events are business-significant observations, not a requirement for an
event-driven implementation.

## Cross-boundary references

The model keeps Formula line IDs and source IDs, not mutable object graphs.
Process and classifier consumers receive the resulting metric snapshot plus
evidence. They must not recalculate composition from display names.
