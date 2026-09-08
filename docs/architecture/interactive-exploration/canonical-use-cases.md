# Interactive Formula Exploration — Canonical Use Cases

Status: Canonical application model
Date: 2026-09-08

## Commands

### StartExploration

Input: baseline Formula/Process analysis snapshot. Output: ExplorationBaseline
and an empty scenario.

### ApplyCounterfactualPatch

Input: scenario revision and one typed patch. Output: new scenario revision
or a validation failure. It is local and retry-safe.

### EvaluateCounterfactual

Input: scenario revision and the selected analysis model versions. Output:
ComparisonResult or rejected hard-invalid outcome.

### ResetExploration

Input: scenario ID and expected revision. Output: empty scenario anchored to
the original baseline.

## Queries

- GetExplorationState(scenarioId)
- GetChangedMetrics(scenarioId)
- GetCounterfactualExplanation(scenarioId, metricKey)

## Failure model

- invalid_patch_path
- invalid_patch_value
- baseline_revision_conflict
- model_version_mismatch
- counterfactual_formula_invalid
- counterfactual_analysis_partial

Partial evaluation is visible and distinct from rejection.

## Canonical chains

1. Start -> patch water mass -> evaluate -> compare intrinsic and effective
   results.
2. Start -> patch Process temperature -> evaluate -> show unchanged intrinsic
   metrics and changed process-sensitive metrics.
3. Apply invalid flour patch -> reject -> baseline remains usable.
4. Reset after multiple patches -> exact baseline restored.
