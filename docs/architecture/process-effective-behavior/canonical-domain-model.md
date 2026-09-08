# Process and Effective Behavior — Canonical Domain Model

Status: Canonical
Date: 2026-09-08

## Aggregate boundary

### Process

The Process aggregate owns its own ID, Formula ID reference, revision,
readiness, typed sections, ordered AdditionSteps, and normalization policy.
It can be edited and versioned without mutating Formula.

### ProcessFeatureSet

An immutable analysis value object containing normalized process features,
feature evidence, coverage, and model version. It is the only process-facing
input to effective behavior rules and classification.

### EffectiveMetricSet

An immutable result that pairs intrinsic metric IDs with process-adjusted
values, limitations, contribution features, and semantic classes.

## Policies and services

- ProcessVocabularyPolicy validates field kind, option IDs, ranges, units, and
  Formula-line references.
- AdditionOrderPolicy validates unique positive sequence values and stable
  referenced line IDs.
- EffectiveBehaviorPolicy maps supported Process features to intrinsic metrics.
- ProcessCoveragePolicy computes feature coverage without assigning Unknown a
  zero contribution.
- ProcessExplanationService lists the features and rules that changed or
  qualified a result.

## Invariants

1. Process references a Formula ID but does not own Formula lines.
2. A Formula/Process analysis pair uses explicit revisions; stale references
   are a conflict.
3. AdditionStep sequence values are unique positive integers.
4. A referenced Formula line must belong to the paired Formula revision.
5. Durations and temperatures retain canonical units.
6. Unknown process fields remain unknown through effective analysis.
7. An empty AdditionStep list means unrecorded order, not no additions.
8. Effective rules cannot rewrite intrinsic metrics.

## Process feature semantics

Mixing method/intensity/duration, folds/rests, aeration, fermentation agent
and targets, lamination state/fat/folds/temperature, thermal conditions, and
geometry are feature families. A rule may use one or more families and must
declare its prerequisites. Bulk temperature and expansion targets are distinct
features; neither is inferred from the other.

## Lifecycle and events

Editing -> Incomplete or ProcessReady -> PairedForAnalysis. Invalid values are
rejected with diagnostics; incomplete values remain representable.

Business events:

- ProcessRecorded
- ProcessRevisionCreated
- AdditionOrderRecorded
- EffectiveBehaviorEvaluated
- ProcessCoverageReduced

## Cross-boundary references

The Process aggregate references Formula-line IDs and model parameter IDs,
never translated labels or mutable Ingredient objects. Composition metrics are
read-only inputs to this capability.
