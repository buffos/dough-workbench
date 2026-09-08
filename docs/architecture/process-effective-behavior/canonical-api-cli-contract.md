# Process and Effective Behavior — Canonical API/CLI Contract

Status: Canonical transport-neutral contract
Date: 2026-09-08

## Process input

    type ProcessSnapshot = {
      processId: string;
      formulaId: string;
      revision: number;
      sections: Record<string, ProcessValue>;
      additionSteps: AdditionStep[];
      policy: 'process-normalization-v1';
      modelVersion: 'process-input-v0.2';
    };

    type AdditionStep = {
      id: string;
      sequence: number;
      lineIds: string[];
      action: 'add' | 'mix' | 'knead' | 'fold' | 'rest' |
        'incorporate_fat' | 'other';
      durationSeconds?: number;
    };

ProcessValue is a Known typed value, explicit None, or Unknown with a reason.
Categorical values are stable IDs; numerical values carry units and range
validation.

## Effective result

    type EffectiveAnalysisResult = {
      outcome: 'completed' | 'partial' | 'rejected' | 'conflict';
      formulaRevision: number;
      processRevision: number;
      modelVersion: string;
      metrics: EffectiveMetricResult[];
      featureContributions: FeatureContribution[];
      diagnostics: Diagnostic[];
    };

## Contract rules

- A process-only request never changes intrinsic metric values.
- Missing process evidence omits unsupported effective values and reports
  coverage/limitations.
- A step reference mismatch is a conflict, not a silent empty step.
- Empty steps are valid and mean order was not recorded.
- No endpoint or CLI is required by the static frontend.

Illustrative future mappings are POST /analysis/effective and
dough analyze-effective --formula formula.json --process process.json.
