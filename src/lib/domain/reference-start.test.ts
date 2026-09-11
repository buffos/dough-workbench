import { describe, expect, it } from 'vitest';
import { createInitialFormulaDraft, knownDraftValue, normalizeFormula } from './normalization';
import { createInitialProcessDraft, normalizeProcess, PROCESS_FIELD_DESCRIPTORS } from './process';
import { GOLD_DATASET_RELEASE_ID, type DatasetRecordSnapshot } from './dataset';
import {
  createLocalDraftFromBlank,
  createLocalDraftFromReference,
  formulaSnapshotToDraft,
  isWorkspaceDraftDirty,
  processSnapshotHasIndependentCopy,
} from './reference-start';

function makeRecord(withProcess = false): DatasetRecordSnapshot {
  const sourceFormula = createInitialFormulaDraft('reference-source');
  const formula = normalizeFormula(sourceFormula).data;
  if (!formula) throw new Error('formula fixture should normalize');
  const sourceProcess = createInitialProcessDraft(sourceFormula.formulaId);
  for (const descriptor of PROCESS_FIELD_DESCRIPTORS) {
    const [section, field] = descriptor.path.split('.') as [keyof typeof sourceProcess, string];
    const container = sourceProcess[section] as unknown as Record<string, { state: 'none' }>;
    container[field] = { state: 'none' };
  }
  const process = normalizeProcess(sourceProcess, sourceFormula.ingredientLines.map((line) => line.id)).data;
  return {
    releaseId: GOLD_DATASET_RELEASE_ID,
    recordId: 'brioche-primary-01',
    identity: {
      preparationKey: 'brioche',
      label: { en: 'Brioche', el: 'Μπριός' },
      familyId: 'family.fermented-gluten.rich-enriched',
    },
    formula,
    process: withProcess ? process : null,
    provenance: {
      sourceId: 'source-1',
      quality: 'high',
      curationState: 'accepted',
      reviewNote: { en: 'Reviewed.', el: 'Ελεγμένο.' },
    },
    roles: ['reference'],
    evaluationPartition: 'calibration',
    publicSelectable: true,
    primary: true,
    maturity: 'expert-seed',
  };
}

describe('reference-start draft copying', () => {
  it('copies Formula values into a new editable draft with provenance', () => {
    const record = makeRecord();
    const draft = formulaSnapshotToDraft(record);

    expect(draft.formulaId).toBe('formula_reference_brioche-primary-01');
    expect(draft.sourceReference).toMatchObject({
      kind: 'derived-from-reference',
      sourceReleaseId: GOLD_DATASET_RELEASE_ID,
      sourceRecordId: record.recordId,
    });
    expect(draft.ingredientLines[0].massGrams).toBe('700');
    expect(draft.ingredientLines[0].composition.water).toMatchObject({ state: 'known', value: '100' });
  });

  it('leaves Process Unknown when the reference has no Process snapshot', () => {
    const record = makeRecord(false);
    const result = createLocalDraftFromReference(record);

    expect(result.outcome).toBe('selected');
    expect(result.process?.sourceReference?.sourceRecordId).toBe(record.recordId);
    expect(result.process?.fermentation.bulkTimeSeconds).toEqual({ state: 'unknown', reasonCode: 'not-supplied' });
  });

  it('copies an independent Process snapshot when one is present', () => {
    const record = makeRecord(true);
    const result = createLocalDraftFromReference(record);

    expect(result.outcome).toBe('selected');
    expect(result.process?.mixing.method).toEqual({ state: 'none' });
    expect(result.process && processSnapshotHasIndependentCopy(record, result.process)).toBe(true);
    expect(result.process?.processId).not.toBe(record.process?.processId);
  });

  it('keeps the published record unchanged when the local copy is edited', () => {
    const record = makeRecord(true);
    const result = createLocalDraftFromReference(record);

    if (!result.formula || !result.process) throw new Error('reference copy should be available');
    result.formula.ingredientLines[0].massGrams = '999';
    result.process.mixing.method = knownDraftValue('machine_knead');

    expect(record.formula.ingredientLines[0].mass.value).toBe(700);
    expect(record.process?.mixing.method).toEqual({ state: 'none' });
  });

  it('requires explicit confirmation before replacing a dirty Formula/Process draft', () => {
    const current = createInitialFormulaDraft('current');
    const process = createInitialProcessDraft(current.formulaId);
    current.revision = 2;

    expect(isWorkspaceDraftDirty(current, process)).toBe(true);
    expect(createLocalDraftFromReference(makeRecord(), current, process).outcome)
      .toBe('dirty_draft_confirmation_required');
    expect(createLocalDraftFromReference(makeRecord(), current, process, true).outcome)
      .toBe('selected');
  });

  it('creates a clean Blank draft after explicit replacement confirmation', () => {
    const current = createInitialFormulaDraft('current');
    const process = createInitialProcessDraft(current.formulaId);
    process.revision = 2;

    expect(createLocalDraftFromBlank(current, process).outcome).toBe('dirty_draft_confirmation_required');
    const blank = createLocalDraftFromBlank(current, process, true);
    expect(blank.outcome).toBe('blank_selected');
    expect(blank.formula?.sourceReference).toBeUndefined();
    expect(blank.process?.sourceReference).toBeUndefined();
  });

  it('preserves the current draft when a reference snapshot cannot be copied', () => {
    const invalid = makeRecord();
    invalid.formula.flourComponents = [];
    const current = createInitialFormulaDraft('current');
    const currentProcess = createInitialProcessDraft(current.formulaId);

    const result = createLocalDraftFromReference(invalid, current, currentProcess, true);

    expect(result.outcome).toBe('reference_copy_invalid');
    expect(result.formula).toBeNull();
    expect(current.formulaId).toBe('current');
    expect(currentProcess.formulaId).toBe('current');
  });
});
