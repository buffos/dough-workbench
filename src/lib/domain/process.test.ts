import { describe, expect, it } from 'vitest';
import { knownDraftValue } from './normalization';
import {
  PROCESS_ADDITION_ACTIONS,
  PROCESS_FIELD_DESCRIPTORS,
  PROCESS_MODEL_VERSION,
  createInitialProcessDraft,
  getProcessDraftField,
  normalizeProcess,
  validateProcess,
} from './process';

const catalogProvenance = { kind: 'user-entered' as const, sourceId: 'process-test' };

describe('process capture and normalization', () => {
  it('reads the current editable value for a Process field', () => {
    const draft = createInitialProcessDraft('formula-process-field');
    draft.mixing.method = knownDraftValue('hand_knead', catalogProvenance);

    expect(getProcessDraftField(draft, 'mixing.method')).toMatchObject({
      state: 'known',
      value: 'hand_knead',
    });
  });

  it('preserves tri-state values and ordered AdditionSteps in an incomplete process', () => {
    const draft = createInitialProcessDraft('formula-process');
    draft.mixing.method = knownDraftValue('machine_knead', catalogProvenance);
    draft.fermentation.bulkTimeSeconds = { state: 'unknown', reasonCode: 'not-supplied' };
    draft.lamination.enabled = { state: 'none' };
    draft.ingredientAddition.steps = [
      { id: 'step-2', sequence: '2', lineIds: ['line-water'], action: 'add', durationSeconds: '30' },
      { id: 'step-1', sequence: '1', lineIds: [], action: 'mix', durationSeconds: '60' },
    ];

    const result = normalizeProcess(draft, ['line-water']);

    expect(result.outcome).toBe('partial');
    expect(result.readiness).toBe('incomplete');
    expect(result.data?.mixing.method).toMatchObject({ state: 'known', value: 'machine_knead' });
    expect(result.data?.fermentation.bulkTimeSeconds).toEqual({ state: 'unknown', reasonCode: 'not-supplied' });
    expect(result.data?.lamination.enabled).toEqual({ state: 'none' });
    expect(result.data?.ingredientAddition.steps.map((step) => step.sequence)).toEqual([1, 2]);
    expect(result.data?.ingredientAddition.steps[1].lineIds).toEqual(['line-water']);
    expect(result.data?.policy).toBe('process-normalization-v1');
  });

  it('rejects invalid ranges, duplicate order, and stale Formula line references', () => {
    const draft = createInitialProcessDraft('formula-invalid-process');
    draft.mixing.intensity = knownDraftValue('1.2', catalogProvenance);
    draft.ingredientAddition.steps = [
      { id: 'step-a', sequence: '1', lineIds: ['line-missing'], action: 'mix', durationSeconds: '10' },
      { id: 'step-b', sequence: '1', lineIds: [], action: 'rest', durationSeconds: '20' },
    ];

    const diagnostics = validateProcess(draft, ['line-water']);
    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual(expect.arrayContaining([
      'INVALID_PROCESS_VALUE',
      'DUPLICATE_PROCESS_SEQUENCE',
      'REFERENCE_MISMATCH',
    ]));
    expect(normalizeProcess(draft, ['line-water']).outcome).toBe('rejected');
  });

  it('keeps Process revision and serialization independent from Formula data', () => {
    const first = createInitialProcessDraft('formula-independent');
    const serialized = JSON.parse(JSON.stringify(first));
    const restored = createInitialProcessDraft('formula-independent');
    Object.assign(restored, serialized);
    restored.revision += 1;

    expect(restored.formulaId).toBe(first.formulaId);
    expect(restored.revision).toBe(2);
    expect(restored.mixing).toEqual(first.mixing);
    expect(restored.ingredientAddition.steps).toEqual([]);
  });

  it('uses typed Process vocabulary instead of free-form algorithm inputs', () => {
    const draft = createInitialProcessDraft('formula-vocabulary');
    draft.fermentation.prefermentType = knownDraftValue('poolish', catalogProvenance);
    draft.fermentation.bulkExpansionTarget = knownDraftValue('fifty_percent_increase', catalogProvenance);
    draft.lamination.laminationFat = knownDraftValue('line-butter', catalogProvenance);
    draft.ingredientAddition.steps = [
      { id: 'step-1', sequence: '1', lineIds: ['line-butter'], action: 'incorporate_fat', durationSeconds: '30' },
    ];

    expect(PROCESS_FIELD_DESCRIPTORS.some((descriptor) => String(descriptor.kind) === 'text')).toBe(false);
    expect(PROCESS_ADDITION_ACTIONS).toContain('incorporate_fat');

    const result = normalizeProcess(draft, ['line-butter']);
    expect(result.diagnostics).toEqual([]);
    expect(result.data?.modelVersion).toBe(PROCESS_MODEL_VERSION);
    expect(result.data?.fermentation.prefermentType).toMatchObject({ state: 'known', value: 'poolish' });
    expect(result.data?.lamination.laminationFat).toMatchObject({ state: 'known', value: 'line-butter' });
  });

  it('rejects an unresolvable Formula-line reference and unrecognized addition action', () => {
    const draft = createInitialProcessDraft('formula-reference');
    draft.lamination.laminationFat = knownDraftValue('butter', catalogProvenance);
    draft.ingredientAddition.steps = [
      { id: 'step-1', sequence: '1', lineIds: [], action: 'Add butter', durationSeconds: '30' },
    ];

    const diagnostics = validateProcess(draft, ['line-butter']);
    expect(diagnostics.map((diagnostic) => diagnostic.code)).toEqual(expect.arrayContaining([
      'INVALID_PROCESS_VALUE',
      'REFERENCE_MISMATCH',
    ]));
  });

  it('enforces ratio bounds and normalizes process confidence', () => {
    const draft = createInitialProcessDraft('formula-ratio-bounds');
    const invalidPreferment = knownDraftValue('1.1', catalogProvenance);
    invalidPreferment.confidence = 2;
    const invalidLayerFat = knownDraftValue('1.1', catalogProvenance);
    invalidLayerFat.confidence = -1;
    draft.fermentation.prefermentPercentage = invalidPreferment;
    draft.lamination.layerFatPercentage = invalidLayerFat;

    const rejected = normalizeProcess(draft);
    expect(rejected.outcome).toBe('rejected');
    expect(rejected.diagnostics.filter((diagnostic) => diagnostic.code === 'INVALID_PROCESS_VALUE')).toHaveLength(2);

    const validPreferment = knownDraftValue('0.4', catalogProvenance);
    validPreferment.confidence = 2;
    const validLayerFat = knownDraftValue('0.6', catalogProvenance);
    validLayerFat.confidence = -1;
    draft.fermentation.prefermentPercentage = validPreferment;
    draft.lamination.layerFatPercentage = validLayerFat;
    const normalized = normalizeProcess(draft);

    expect(normalized.outcome).toBe('partial');
    expect(normalized.data?.fermentation.prefermentPercentage).toMatchObject({ state: 'known', value: 0.4, confidence: 1 });
    expect(normalized.data?.lamination.layerFatPercentage).toMatchObject({ state: 'known', value: 0.6, confidence: 0 });
  });
});
