import { describe, expect, it } from 'vitest';
import { createInitialFormulaDraft, emptyComposition, knownDraftValue } from './normalization';
import { prepareAnalysisInput } from './handoff';
import { PROCESS_FIELD_DESCRIPTORS, createInitialProcessDraft } from './process';

describe('Formula/Process analysis handoff', () => {
  it('returns a complete handoff when every optional Process field is explicitly resolved', () => {
    const formula = createInitialFormulaDraft('handoff-complete');
    const process = createInitialProcessDraft(formula.formulaId);

    for (const descriptor of PROCESS_FIELD_DESCRIPTORS) {
      const [section, field] = descriptor.path.split('.') as [keyof typeof process, string];
      const container = process[section] as unknown as Record<string, { state: 'none' }>;
      container[field] = { state: 'none' };
    }

    const result = prepareAnalysisInput(formula, process);

    expect(result.outcome).toBe('completed');
    expect(result.data?.readiness).toBe('analysis_ready');
    expect(result.data?.process.readiness).toBe('process_ready');
    expect(result.limitations).toEqual([]);
  });

  it('keeps composition analysis available when Process is incomplete', () => {
    const formula = createInitialFormulaDraft('handoff-partial');
    const process = createInitialProcessDraft(formula.formulaId);

    const result = prepareAnalysisInput(formula, process);

    expect(result.outcome).toBe('partial');
    expect(result.data?.formula.structuralFlourDenominator.value).toBe(1000);
    expect(result.data?.process.readiness).toBe('incomplete');
    expect(result.data?.readiness).toBe('partial_ready');
    expect(result.coverage.composition).toBe(1);
    expect(result.coverage.process).toBeLessThan(1);
    expect(result.limitations.map((item) => item.code)).toEqual(['PROCESS_DATA_INCOMPLETE']);
    expect(result.data?.process.fermentation.bulkTimeSeconds).toEqual({ state: 'unknown', reasonCode: 'not-supplied' });
  });

  it('allows a composition-only handoff without pretending Process is complete', () => {
    const formula = createInitialFormulaDraft('handoff-composition-only');
    const process = createInitialProcessDraft(formula.formulaId);

    const result = prepareAnalysisInput(formula, process, { requestedPath: 'composition' });

    expect(result.outcome).toBe('completed');
    expect(result.data?.readiness).toBe('analysis_ready');
    expect(result.data?.process.readiness).toBe('incomplete');
    expect(result.data?.coverage.process).toBeLessThan(1);
  });

  it('keeps Formula and Process revisions and data independent', () => {
    const formula = createInitialFormulaDraft('handoff-independent');
    const process = createInitialProcessDraft(formula.formulaId);
    process.mixing.method = knownDraftValue('machine_knead');
    process.revision = 3;

    const result = prepareAnalysisInput(formula, process);

    expect(result.data?.formula.revision).toBe(1);
    expect(result.data?.process.revision).toBe(3);
    expect(result.data?.formula.ingredientLines[0].mass.value).toBe(700);
    expect(result.data?.process.mixing.method).toMatchObject({ state: 'known', value: 'machine_knead' });
  });

  it('returns a visible conflict for an unresolved Formula-line reference', () => {
    const formula = createInitialFormulaDraft('handoff-reference');
    const process = createInitialProcessDraft(formula.formulaId);
    process.ingredientAddition.steps = [{
      id: 'step-1',
      sequence: '1',
      lineIds: ['line-removed'],
      action: 'add',
      durationSeconds: '20',
    }];

    const result = prepareAnalysisInput(formula, process);

    expect(result.outcome).toBe('conflict');
    expect(result.diagnostics[0]).toMatchObject({ code: 'REFERENCE_MISMATCH', path: 'ingredientAddition.steps.step-1.lineIds' });
    expect(result.data).toBeNull();
  });

  it('rejects stale revisions without overwriting either draft', () => {
    const formula = createInitialFormulaDraft('handoff-stale');
    const process = createInitialProcessDraft(formula.formulaId);
    const formulaBefore = JSON.stringify(formula);
    const processBefore = JSON.stringify(process);

    const result = prepareAnalysisInput(formula, process, {
      expectedFormulaRevision: 0,
      expectedProcessRevision: process.revision,
    });

    expect(result.outcome).toBe('conflict');
    expect(result.diagnostics[0].code).toBe('STALE_REVISION');
    expect(JSON.stringify(formula)).toBe(formulaBefore);
    expect(JSON.stringify(process)).toBe(processBefore);
  });

  it('rejects invalid Formula structure while retaining a recoverable input shape', () => {
    const formula = createInitialFormulaDraft('handoff-rejected');
    formula.flourComponents = [];
    const process = createInitialProcessDraft(formula.formulaId);

    const result = prepareAnalysisInput(formula, process);

    expect(result.outcome).toBe('rejected');
    expect(result.diagnostics[0].code).toBe('FORMULA_NORMALIZATION_BLOCKED');
    expect(result.data).toBeNull();
  });

  it('preserves partial Formula limits without turning Unknown into zero', () => {
    const formula = createInitialFormulaDraft('handoff-unknown');
    formula.ingredientLines[0].composition = {
      ...emptyComposition(),
      water: { state: 'unknown', reasonCode: 'not-supplied' },
      fat: { state: 'none' },
      protein: knownDraftValue(0),
      sugar: { state: 'none' },
      starch: { state: 'none' },
    };
    const process = createInitialProcessDraft(formula.formulaId);

    const result = prepareAnalysisInput(formula, process);

    expect(result.outcome).toBe('partial');
    expect(result.limitations.map((item) => item.code)).toEqual(['FORMULA_DATA_INCOMPLETE', 'PROCESS_DATA_INCOMPLETE']);
    expect(result.data?.formula.ingredientLines[0].composition.water).toEqual({ state: 'unknown', reasonCode: 'not-supplied' });
  });
});
