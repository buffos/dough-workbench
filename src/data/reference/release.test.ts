import { describe, expect, it } from 'vitest';
import {
  GOLD_DATASET_RELEASE_ID,
  browseReferenceFormulas,
  computeReleaseContentIdentity,
  listReferenceModifierFilterGroups,
  resolveDatasetRelease,
  verifyDatasetRelease,
} from '../../lib/domain/dataset';
import { GOLD_FORMULAS_RELEASE, REFERENCE_DATASET_REGISTRY } from './release';
import { STRUCTURAL_FAMILY_BY_ID } from '../../lib/domain/structural-taxonomy';

describe('published reference release', () => {
  it('publishes the approved pilot as a verified immutable release snapshot', () => {
    expect(REFERENCE_DATASET_REGISTRY.currentReleaseId).toBe(GOLD_DATASET_RELEASE_ID);
    expect(GOLD_FORMULAS_RELEASE).toBeDefined();
    expect(GOLD_FORMULAS_RELEASE?.descriptor.releaseId).toBe(GOLD_DATASET_RELEASE_ID);
    expect(GOLD_FORMULAS_RELEASE?.descriptor.recordCount).toBe(22);
    expect(GOLD_FORMULAS_RELEASE?.descriptor.contentIdentity).toBe(computeReleaseContentIdentity(GOLD_FORMULAS_RELEASE!));
    expect(verifyDatasetRelease(GOLD_FORMULAS_RELEASE!).outcome).toBe('pass');
    expect(resolveDatasetRelease(REFERENCE_DATASET_REGISTRY).outcome).toBe('resolved');
    expect(Object.keys(REFERENCE_DATASET_REGISTRY.releases)).toEqual([GOLD_DATASET_RELEASE_ID]);
  });

  it('preserves Formula/Process separation and eligible reference roles', () => {
    const records = GOLD_FORMULAS_RELEASE!.records;
    expect(records.every((record) => record.releaseId === GOLD_DATASET_RELEASE_ID)).toBe(true);
    expect(records.every((record) => record.roles.includes('reference') && record.roles.includes('calibration'))).toBe(true);
    expect(records.every((record) => record.evaluationPartition === 'calibration' && record.publicSelectable)).toBe(true);
    expect(new Set(records.map((record) => record.identity.preparationKey)).size).toBe(22);
    expect(records.some((record) => record.process !== null)).toBe(true);
    expect(records.every((record) => record.process === null || record.process.formulaId === record.formula.formulaId)).toBe(true);
    expect(records.every((record) => (record.normalization?.length ?? 0) > 0)).toBe(true);
    expect(records.every((record) => Boolean(STRUCTURAL_FAMILY_BY_ID[record.identity.familyId]))).toBe(true);
    expect(records.every((record) => (record.identity.modifierIds?.length ?? 0) > 0)).toBe(true);
  });

  it('exposes a bounded, searchable read model over the published release', () => {
    const firstPage = browseReferenceFormulas(REFERENCE_DATASET_REGISTRY, {
      locale: 'en',
      page: 1,
      pageSize: 8,
    });
    expect(firstPage.outcome).toBe('completed');
    expect(firstPage.totalItems).toBe(22);
    expect(firstPage.items).toHaveLength(8);
    expect(firstPage.totalPages).toBe(3);

    const searched = browseReferenceFormulas(REFERENCE_DATASET_REGISTRY, {
      locale: 'el',
      query: 'pizza',
      pageSize: 8,
    });
    expect(searched.outcome).toBe('completed');
    expect(searched.items.length).toBeGreaterThan(0);
    expect(searched.items.every((item) => item.publicSelectable)).toBe(true);

    const modifierGroups = listReferenceModifierFilterGroups(REFERENCE_DATASET_REGISTRY);
    expect(modifierGroups.every((group) => group.options.some((option) => option.selectable))).toBe(true);
    const yeastOnly = browseReferenceFormulas(REFERENCE_DATASET_REGISTRY, {
      locale: 'en',
      modifierIds: ['leavening.yeast'],
      pageSize: 24,
    });
    expect(yeastOnly.totalItems).toBeGreaterThan(0);
    expect(yeastOnly.items.every((item) => item.modifierIds.includes('leavening.yeast'))).toBe(true);
  });
});
