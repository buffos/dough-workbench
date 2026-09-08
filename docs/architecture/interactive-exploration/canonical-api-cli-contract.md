# Interactive Formula Exploration — Canonical API/CLI Contract

Status: Canonical transport-neutral contract
Date: 2026-09-08

## State

    type CounterfactualPatch = {
      patchId: string;
      owner: 'formula' | 'process';
      path: string;
      before: ValueState<unknown>;
      after: ValueState<unknown>;
    };

    type ExplorationState = {
      scenarioId: string;
      revision: number;
      baseline: AnalysisReference;
      patches: CounterfactualPatch[];
      status: 'editing' | 'ready' | 'evaluated' | 'rejected';
    };

## Result

    type ComparisonResult = {
      baseline: AnalysisSnapshot;
      counterfactual?: AnalysisSnapshot;
      changedPaths: string[];
      metricChanges: MetricChange[];
      outcome: 'completed' | 'partial' | 'rejected' | 'conflict';
      diagnostics: Diagnostic[];
    };

## Rules

- Patches are applied in order to a copy.
- Formula and Process ownership remains visible.
- Unavailable values are omitted with a limitation, never coerced to zero.
- A model-version mismatch is a conflict.
- The current product uses in-memory browser state; no server API is required.

Illustrative future mappings are POST /explorations/{id}/patches and
dough explore --patch patch.json.
