import { describe, expect, it } from 'vitest';
import { createInitialFormulaDraft, normalizeFormula } from './normalization';
import {
  GOLD_DATASET_KIND,
  GOLD_DATASET_MODEL_VERSION,
  computeReleaseContentIdentity,
  browseReferenceFormulas,
  listReferenceFamilyOptions,
  listReferenceModifierFilterGroups,
  listReferencePreparationOptions,
  resolveDatasetRelease,
  resolveReferenceFormula,
  verifyDatasetRelease,
  type DatasetRecordSnapshot,
  type DatasetRelease,
} from './dataset';
import { STRUCTURAL_FAMILY_NODES } from './structural-taxonomy';

const releaseId = 'gold-formulas-v2';

function makeRecord(overrides: Partial<DatasetRecordSnapshot> = {}): DatasetRecordSnapshot {
  const recordId = overrides.recordId ?? 'brioche-primary-01';
  const preparationKey = overrides.identity?.preparationKey ?? 'brioche';
  const formula = normalizeFormula(createInitialFormulaDraft(`dataset-${recordId}`)).data;
  if (!formula) throw new Error('test formula should normalize');
  return {
    releaseId,
    recordId,
    identity: {
      preparationKey,
      label: { en: 'Brioche', el: 'Μπριός' },
      familyId: 'family.fermented-gluten.rich-enriched',
      prototypeId: 'brioche',
      ...overrides.identity,
    },
    formula: overrides.formula ?? formula,
    process: overrides.process ?? null,
    provenance: overrides.provenance ?? {
      sourceId: 'source-brioche-01',
      quality: 'high',
      curationState: 'accepted',
      reviewNote: { en: 'Reviewed normalized facts.', el: 'Ελέγχθηκαν τα κανονικοποιημένα δεδομένα.' },
    },
    roles: overrides.roles ?? ['reference', 'calibration'],
    evaluationPartition: overrides.evaluationPartition ?? 'calibration',
    publicSelectable: overrides.publicSelectable ?? true,
    primary: overrides.primary ?? true,
    maturity: overrides.maturity ?? 'expert-seed',
  };
}

function makeRelease(records: DatasetRecordSnapshot[]): DatasetRelease {
  const release: DatasetRelease = {
    descriptor: {
      releaseId,
      kind: GOLD_DATASET_KIND,
      status: 'published',
      contentIdentity: '',
      createdAt: '2026-09-10T00:00:00Z',
      supersedes: null,
      recordCount: records.length,
      defaultModelVersion: GOLD_DATASET_MODEL_VERSION,
    },
    records,
  };
  return {
    ...release,
    descriptor: {
      ...release.descriptor,
      contentIdentity: computeReleaseContentIdentity(release),
    },
  };
}

describe('dataset release contract', () => {
  it('verifies a reproducible release with optional Process absent', () => {
    const release = makeRelease([makeRecord()]);
    const report = verifyDatasetRelease(release);

    expect(report.outcome).toBe('pass');
    expect(report.contentIdentity).toBe(release.descriptor.contentIdentity);
    expect(release.records[0].process).toBeNull();
  });

  it('rejects duplicate records and multiple primary references', () => {
    const first = makeRecord();
    const duplicate = makeRecord({ recordId: first.recordId, primary: true });
    const report = verifyDatasetRelease(makeRelease([first, duplicate]));

    expect(report.outcome).toBe('fail');
    expect(report.recordErrors.some((item) => item.code === 'duplicate_record_id')).toBe(true);
    expect(report.roleErrors.some((item) => item.code === 'multiple_primary_references')).toBe(true);
  });

  it('rejects public validation/test records and preserves role separation', () => {
    const record = makeRecord({ evaluationPartition: 'test', publicSelectable: true, primary: false });
    const report = verifyDatasetRelease(makeRelease([record]));

    expect(report.outcome).toBe('fail');
    expect(report.partitionErrors[0].code).toBe('partition_violation');
  });

  it('does not silently fall back when an explicit release is unavailable', () => {
    const release = makeRelease([makeRecord()]);
    const registry = { currentReleaseId: releaseId, releases: { [releaseId]: release } };

    const resolved = resolveDatasetRelease(registry, 'gold-formulas-v0');
    expect(resolved.outcome).toBe('rejected');
    expect(resolved.diagnostic?.code).toBe('release_unavailable');
    expect(resolved.release).toBeNull();
  });

  it('returns only eligible references in a bounded, primary-first read model', () => {
    const release = makeRelease([
      makeRecord(),
      makeRecord({ recordId: 'brioche-variant-02', primary: false }),
      makeRecord({ recordId: 'brioche-test-03', primary: false, publicSelectable: false, evaluationPartition: 'test' }),
    ]);
    const registry = { currentReleaseId: releaseId, releases: { [releaseId]: release } };
    const result = browseReferenceFormulas(registry, { locale: 'en', page: 1, pageSize: 1 });

    expect(result.outcome).toBe('completed');
    expect(result.totalItems).toBe(2);
    expect(result.totalPages).toBe(2);
    expect(result.items[0].primary).toBe(true);
    expect(result.items).toHaveLength(1);

    const selected = resolveReferenceFormula(registry, releaseId, 'brioche-variant-02');
    expect(selected.outcome).toBe('selected');
    const rejected = resolveReferenceFormula(registry, releaseId, 'brioche-test-03');
    expect(rejected.outcome).toBe('rejected');
    expect(rejected.diagnostic?.code).toBe('record_not_selectable');
  });

  it('exposes complete filter options and filters by preparation without unbounded rendering', () => {
    const release = makeRelease([
      makeRecord({ recordId: 'brioche-primary-01', identity: { preparationKey: 'brioche', label: { en: 'Brioche', el: 'Μπριός' }, familyId: 'family.fermented-gluten.rich-enriched' } }),
      makeRecord({ recordId: 'pizza-primary-01', identity: { preparationKey: 'pizza', label: { en: 'Pizza', el: 'Pizza' }, familyId: 'family.fermented-gluten.flat' } }),
    ]);
    const registry = { currentReleaseId: releaseId, releases: { [releaseId]: release } };

    const familyOptions = listReferenceFamilyOptions(registry);
    expect(familyOptions.map((option) => option.id)).toEqual(STRUCTURAL_FAMILY_NODES.map((node) => node.id));
    expect(familyOptions.find((option) => option.id === 'family.fermented-gluten')?.count).toBe(2);
    expect(familyOptions.find((option) => option.id === 'family.fermented-gluten.rich-enriched')?.count).toBe(1);
    expect(familyOptions.find((option) => option.id === 'family.cookie-biscuit')?.count).toBe(0);
    expect(familyOptions.find((option) => option.id === 'family.cookie-biscuit')?.selectable).toBe(false);
    expect(listReferencePreparationOptions(registry).map((option) => option.id)).toEqual(['brioche', 'pizza']);

    const result = browseReferenceFormulas(registry, {
      locale: 'en',
      preparationKey: 'pizza',
      pageSize: 1,
    });
    expect(result.totalItems).toBe(1);
    expect(result.items[0].label.en).toBe('Pizza');
  });

  it('filters reference formulas by structured modifier facets and reports their counts', () => {
    const release = makeRelease([
      makeRecord({
        recordId: 'brioche-primary-01',
        identity: {
          preparationKey: 'brioche',
          label: { en: 'Brioche', el: 'Μπριός' },
          familyId: 'family.fermented-gluten.rich-enriched',
          modifierIds: ['leavening.yeast', 'structural-system.gluten-dominant'],
        },
      }),
      makeRecord({
        recordId: 'pasta-primary-01',
        identity: {
          preparationKey: 'pasta',
          label: { en: 'Fresh pasta', el: 'Φρέσκα ζυμαρικά' },
          familyId: 'family.unleavened-gluten.pasta-noodle',
          modifierIds: ['leavening.none', 'structural-system.gluten-dominant'],
        },
      }),
    ]);
    const registry = { currentReleaseId: releaseId, releases: { [releaseId]: release } };

    const groups = listReferenceModifierFilterGroups(registry);
    expect(groups.map((group) => group.axisId)).toEqual([
      'leavening',
      'structural-system',
      'enrichment',
      'consistency',
      'fat-handling',
      'special-process',
    ]);
    expect(groups.find((group) => group.axisId === 'leavening')?.options.find((option) => option.id === 'leavening.yeast')?.count).toBe(1);
    expect(groups.find((group) => group.axisId === 'leavening')?.options.find((option) => option.id === 'leavening.none')?.count).toBe(1);

    const result = browseReferenceFormulas(registry, {
      locale: 'en',
      modifierIds: ['leavening.yeast'],
    });
    expect(result.totalItems).toBe(1);
    expect(result.items[0].preparationKey).toBe('brioche');
  });
});
