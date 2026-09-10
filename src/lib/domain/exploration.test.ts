import { describe, expect, it } from 'vitest';
import {
  applyCounterfactualPatch,
  createCounterfactualPatch,
  createCounterfactualScenario,
  evaluateCounterfactual,
  resetExploration,
  type CounterfactualScenario,
  type ExplorationAnalysisSnapshot,
} from './exploration';
import {
  captureExplorationBaselineDraft,
  evaluateExplorationScenarioDraft,
} from '../application/formula-workspace';
import {
  createInitialFormulaDraft,
  knownDraftValue,
  unknownDraftValue,
} from './normalization';
import { createInitialProcessDraft } from './process';

function setup() {
  const formula = createInitialFormulaDraft('exploration-test');
  const process = createInitialProcessDraft(formula.formulaId);
  const capture = captureExplorationBaselineDraft(formula, process);
  if (!capture.baseline) throw new Error('test setup did not produce an exploration baseline');
  return {
    formula,
    process,
    baseline: capture.baseline,
    scenario: createCounterfactualScenario(capture.baseline, 'scenario-test'),
  };
}

function patch(
  scenario: CounterfactualScenario,
  owner: 'formula' | 'process',
  path: string,
  after: ReturnType<typeof knownDraftValue> | { state: 'unknown'; reasonCode: string } | { state: 'none' },
) {
  const built = createCounterfactualPatch(scenario, {
    patchId: `${scenario.revision}-${path}`,
    owner,
    path,
    after,
  });
  if (!built.patch) throw new Error(built.diagnostic?.code ?? 'test patch was rejected');
  const applied = applyCounterfactualPatch(scenario, built.patch);
  if (applied.diagnostic) throw new Error(applied.diagnostic.code);
  return applied.scenario;
}

function snapshotWith(
  source: ExplorationAnalysisSnapshot,
  mutate: (snapshot: ExplorationAnalysisSnapshot) => void,
): ExplorationAnalysisSnapshot {
  const copy = JSON.parse(JSON.stringify(source)) as ExplorationAnalysisSnapshot;
  mutate(copy);
  return copy;
}

describe('counterfactual baseline and patch contract', () => {
  it('captures an immutable baseline and starts an empty scenario', () => {
    const { formula, process, baseline, scenario } = setup();

    expect(baseline.formulaRevision).toBe(formula.revision);
    expect(baseline.processRevision).toBe(process.revision);
    expect(baseline.baselineId).toContain('exploration-baseline:exploration-test');
    expect(baseline.catalogVersion).toBeTruthy();
    expect(baseline.modelVersion).toBeTruthy();
    expect(scenario.status).toBe('editing');
    expect(scenario.patches).toEqual([]);
    expect(scenario.baseline).toBe(baseline);
    expect(scenario.baseline.formula).not.toBe(formula);
  });

  it('builds a Formula patch and rejects invalid or cross-owner patches without mutation', () => {
    const { scenario } = setup();
    const before = JSON.stringify(scenario);
    const valid = createCounterfactualPatch(scenario, {
      patchId: 'valid-water-mass',
      owner: 'formula',
      path: 'formula.ingredientLines.line-water.massGrams',
      after: knownDraftValue(840),
    });
    expect(valid.diagnostic).toBeNull();
    expect(valid.patch?.before).toMatchObject({ state: 'known', value: '700' });

    const invalid = createCounterfactualPatch(scenario, {
      patchId: 'invalid-water-mass',
      owner: 'formula',
      path: 'formula.ingredientLines.line-water.massGrams',
      after: knownDraftValue(-1),
    });
    expect(invalid.patch).toBeNull();
    expect(invalid.diagnostic?.code).toBe('invalid_patch_value');

    const wrongOwner = createCounterfactualPatch(scenario, {
      patchId: 'wrong-owner',
      owner: 'process',
      path: 'formula.ingredientLines.line-water.massGrams',
      after: knownDraftValue(840),
    });
    expect(wrongOwner.patch).toBeNull();
    expect(wrongOwner.diagnostic?.code).toBe('patch_owner_mismatch');
    expect(JSON.stringify(scenario)).toBe(before);
    expect(scenario.baseline.formula.ingredientLines[0].massGrams).toBe('700');
  });
});

describe('Formula and Process counterfactual evaluation', () => {
  it('recomputes a Formula mass on a copy and preserves the baseline Process', () => {
    const { scenario } = setup();
    const changed = patch(scenario, 'formula', 'formula.ingredientLines.line-water.massGrams', knownDraftValue(840));
    const comparison = evaluateExplorationScenarioDraft(changed);

    expect(comparison.counterfactual).toBeDefined();
    expect(comparison.outcome).toBe('partial');
    expect(comparison.changedPaths).toEqual(['formula.ingredientLines.line-water.massGrams']);
    expect(comparison.evidence.formulaRevision.after).toBe(changed.baseline.formulaRevision + 1);
    expect(comparison.evidence.processRevision.after).toBe(changed.baseline.processRevision);
    expect(comparison.baseline.handoff.data?.process).toEqual(comparison.counterfactual?.handoff.data?.process);
    expect(comparison.baseline.handoff.data?.formula.ingredientLines[0].mass.value).toBe(700);
    expect(comparison.counterfactual?.handoff.data?.formula.ingredientLines[0].mass.value).toBe(840);
    expect(comparison.metricChanges.some((metric) => metric.status === 'changed')).toBe(true);
    expect(comparison.metricChanges.some((metric) => metric.status === 'unchanged')).toBe(true);
    expect(comparison.metricChanges.some((metric) => metric.status === 'unavailable')).toBe(true);
  });

  it('supports composition state/value changes and keeps unrelated Unknown evidence intact', () => {
    const { formula, process } = setup();
    formula.ingredientLines[0].composition.protein = unknownDraftValue('source-missing');
    const capture = captureExplorationBaselineDraft(formula, process);
    if (!capture.baseline) throw new Error('test setup did not produce a partial baseline');
    let scenario = createCounterfactualScenario(capture.baseline, 'unknown-scenario');
    scenario = patch(scenario, 'formula', 'formula.ingredientLines.line-water.composition.water', knownDraftValue(95));
    const comparison = evaluateExplorationScenarioDraft(scenario);
    const baselineProtein = comparison.baseline.handoff.data?.formula.ingredientLines[0].composition.protein;
    const counterfactualProtein = comparison.counterfactual?.handoff.data?.formula.ingredientLines[0].composition.protein;

    expect(baselineProtein?.state).toBe('unknown');
    expect(counterfactualProtein?.state).toBe('unknown');
    expect(comparison.metricChanges.find((metric) => metric.key === 'intrinsic:protein')?.status).not.toBe('changed');
  });

  it('keeps intrinsic metrics invariant for a Process-only patch and supports paired owners', () => {
    const { scenario } = setup();
    const processOnly = patch(scenario, 'process', 'process.fermentation.bulkTemperatureCelsius', knownDraftValue(24));
    const processComparison = evaluateExplorationScenarioDraft(processOnly);
    const baselineIntrinsic = processComparison.baseline.intrinsic;
    const counterfactualIntrinsic = processComparison.counterfactual?.intrinsic;

    expect(counterfactualIntrinsic).toEqual(baselineIntrinsic);
    expect(processComparison.evidence.formulaRevision.after).toBe(processOnly.baseline.formulaRevision);
    expect(processComparison.evidence.processRevision.after).toBe(processOnly.baseline.processRevision + 1);

    const paired = patch(processOnly, 'formula', 'formula.ingredientLines.line-water.massGrams', knownDraftValue(840));
    const pairedComparison = evaluateExplorationScenarioDraft(paired);
    expect(pairedComparison.changedPaths).toEqual([
      'process.fermentation.bulkTemperatureCelsius',
      'formula.ingredientLines.line-water.massGrams',
    ]);
    expect(paired.patches.map((item) => item.owner)).toEqual(['process', 'formula']);
    expect(pairedComparison.evidence.formulaRevision.after).toBe(paired.baseline.formulaRevision + 1);
    expect(pairedComparison.evidence.processRevision.after).toBe(paired.baseline.processRevision + 1);
  });

  it('resets the exact baseline and leaves no patches', () => {
    const { scenario } = setup();
    const changed = patch(scenario, 'formula', 'formula.ingredientLines.line-water.massGrams', knownDraftValue(840));
    const reset = resetExploration(changed);

    expect(reset.patches).toEqual([]);
    expect(reset.status).toBe('editing');
    expect(reset.baseline).toBe(changed.baseline);
    expect(reset.baseline.formulaRevision).toBe(1);
    expect(reset.baseline.processRevision).toBe(1);
  });
});

describe('comparison and recovery contract', () => {
  it('does not present stale, foreign, or model-mismatched snapshots as normal deltas', () => {
    const { scenario } = setup();
    const changed = patch(scenario, 'formula', 'formula.ingredientLines.line-water.massGrams', knownDraftValue(840));
    const baselineSnapshot = changed.baseline.snapshot;

    const stale = evaluateCounterfactual(changed, () => snapshotWith(baselineSnapshot, (snapshot) => {
      snapshot.handoff.formulaRevision = 999;
      if (snapshot.handoff.data) snapshot.handoff.data.formulaRevision = 999;
    }));
    expect(stale.outcome).toBe('conflict');
    expect(stale.counterfactual).toBeUndefined();
    expect(stale.diagnostics.some((item) => item.code === 'baseline_revision_conflict')).toBe(true);

    const foreign = evaluateCounterfactual(changed, () => snapshotWith(baselineSnapshot, (snapshot) => {
      snapshot.handoff.formulaId = 'foreign-formula';
    }));
    expect(foreign.outcome).toBe('conflict');
    expect(foreign.diagnostics.some((item) => item.code === 'foreign_formula_reference')).toBe(true);

    const modelMismatch = evaluateCounterfactual(changed, () => snapshotWith(baselineSnapshot, (snapshot) => {
      if (snapshot.handoff.data) Object.assign(snapshot.handoff.data, { modelVersion: 'future-analysis-model' });
    }));
    expect(modelMismatch.outcome).toBe('conflict');
    expect(modelMismatch.diagnostics.some((item) => item.code === 'model_version_mismatch')).toBe(true);
    expect(modelMismatch.baseline).toBeDefined();
  });

  it('keeps rejected counterfactuals separate from partial results and preserves recovery data', () => {
    const { scenario } = setup();
    const changed = patch(scenario, 'formula', 'formula.ingredientLines.line-water.massGrams', knownDraftValue(840));
    const invalid = evaluateCounterfactual(changed, () => snapshotWith(changed.baseline.snapshot, (snapshot) => {
      snapshot.handoff.outcome = 'rejected';
      snapshot.handoff.data = null;
      snapshot.handoff.diagnostics = [{
        code: 'FORMULA_NORMALIZATION_BLOCKED',
        severity: 'error',
        path: 'formula.ingredientLines.line-water.mass',
        messageKey: 'analysis.handoff.validation.formulaBlocked',
        resolutionKey: 'analysis.handoff.validation.correctFormula',
        parameters: {},
      }];
    }));
    expect(invalid.outcome).toBe('rejected');
    expect(invalid.counterfactual).toBeUndefined();
    expect(invalid.metricChanges).toEqual([]);
    expect(invalid.baseline).toBe(changed.baseline.snapshot);
    expect(invalid.diagnostics[0].code).toBe('counterfactual_formula_invalid');
  });
});
