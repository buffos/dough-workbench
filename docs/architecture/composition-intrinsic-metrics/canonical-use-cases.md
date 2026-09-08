# Composition and Intrinsic Metrics — Canonical Use Cases

Status: Canonical application model
Date: 2026-09-08

## Application boundary

The browser application invokes pure domain functions through an
IntrinsicAnalysisService. No network, storage, Astro, Svelte, or locale
dependency belongs in this boundary.

## Commands

### CalculateIntrinsicMetrics

Input: normalized Formula snapshot, composition model version, and optional
availability overrides. Output: completed or partial IntrinsicMetricSet. It is
deterministic and retry-safe because it does not mutate shared data.

### RefreshFunctionalComposition

Input: Formula line references and catalog/custom snapshots. Output: resolved
composition contributions or a partial result with source diagnostics. It
never mutates the catalog.

### ExplainIntrinsicMetric

Input: Formula revision, metric key, and the matching result snapshot. Output:
contribution list, exclusions, missing inputs, semantic class, and provenance.
This is read-only and must use the same model version as the metric.

## Queries

- GetCompositionSummary(formulaRevision) returns totals, percentages, and
  coverage.
- GetIntrinsicMetric(metricKey) returns one metric with evidence.
- GetCompositionLimitations() returns unknown fields and deferred estimates.

## Orchestration

The service validates the Formula handoff, resolves composition snapshots,
calculates deterministic totals, evaluates eligible estimates, then evaluates
heuristics. Each step passes immutable snapshots and never treats a missing
value as zero.

## Failure model

- invalid_formula: no valid normalized input or flour denominator;
- missing_composition: valid Formula but a required source field is unknown;
- unsupported_metric: the selected metric is outside the model version;
- model_conflict: the requested model version is unavailable or mismatched.

Missing evidence is normally a partial business outcome, not an exception.

## End-to-end chains

1. Resolve composition -> calculate totals -> display contributions.
2. Resolve partial composition -> display supported totals -> mark estimates
   unavailable and reduce coverage.
3. Apply line-local availability -> recalculate eligible effective totals ->
   prove the catalog snapshot did not change.
