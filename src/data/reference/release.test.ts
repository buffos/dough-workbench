import { describe, expect, it } from 'vitest';
import {
  GOLD_DATASET_RELEASE_ID,
  browseReferenceFormulas,
  computeReleaseContentIdentity,
  listReferencePrototypeOptions,
  listReferenceRecordsForPrototype,
  listReferenceModifierFilterGroups,
  resolveDatasetRelease,
  verifyDatasetRelease,
} from '../../lib/domain/dataset';
import { GOLD_FORMULAS_RELEASE, REFERENCE_DATASET_REGISTRY } from './release';
import { STRUCTURAL_FAMILY_BY_ID } from '../../lib/domain/structural-taxonomy';
import { loadPrototypeCatalog } from '../prototypes/catalog';

describe('published reference release', () => {
  it('publishes the approved pilot as a verified immutable release snapshot', () => {
    expect(REFERENCE_DATASET_REGISTRY.currentReleaseId).toBe(GOLD_DATASET_RELEASE_ID);
    expect(GOLD_FORMULAS_RELEASE).toBeDefined();
    expect(GOLD_FORMULAS_RELEASE?.descriptor.releaseId).toBe(GOLD_DATASET_RELEASE_ID);
    expect(GOLD_FORMULAS_RELEASE?.descriptor.recordCount).toBe(57);
    expect(GOLD_FORMULAS_RELEASE?.descriptor.contentIdentity).toBe(computeReleaseContentIdentity(GOLD_FORMULAS_RELEASE!));
    const catalog = loadPrototypeCatalog();
    expect(catalog.status).toBe('available');
    if (catalog.status !== 'available') return;
    expect(verifyDatasetRelease(GOLD_FORMULAS_RELEASE!, { prototypeCatalog: catalog.snapshot }).outcome).toBe('pass');
    expect(resolveDatasetRelease(REFERENCE_DATASET_REGISTRY).outcome).toBe('resolved');
    expect(Object.keys(REFERENCE_DATASET_REGISTRY.releases)).toEqual([GOLD_DATASET_RELEASE_ID]);
  });

  it('preserves Formula/Process separation and eligible reference roles', () => {
    const records = GOLD_FORMULAS_RELEASE!.records;
    expect(records.every((record) => record.releaseId === GOLD_DATASET_RELEASE_ID)).toBe(true);
    expect(records.every((record) => record.roles.includes('reference') && record.roles.includes('calibration'))).toBe(true);
    expect(records.every((record) => record.evaluationPartition === 'calibration' && record.publicSelectable)).toBe(true);
    expect(new Set(records.map((record) => record.identity.preparationKey)).size).toBe(57);
    expect(new Set(records.map((record) => record.provenance.sourceId))).toEqual(new Set([
      'source.dfi-internal-breadsticks',
      'source.dfi-internal-crackers',
      'source.dfi-internal-batters',
    ]));
    expect(records.filter((record) => record.identity.prototypeId === 'prototype.breadsticks')).toHaveLength(9);
    expect(records.filter((record) => record.identity.prototypeId === 'prototype.crackers')).toHaveLength(13);
    expect(records.some((record) => record.process !== null)).toBe(true);
    expect(records.every((record) => record.process === null || record.process.formulaId === record.formula.formulaId)).toBe(true);
    expect(records.every((record) => (record.normalization?.length ?? 0) > 0)).toBe(true);
    expect(records.every((record) => Boolean(STRUCTURAL_FAMILY_BY_ID[record.identity.familyId]))).toBe(true);
    expect(records.every((record) => (record.identity.modifierIds?.length ?? 0) > 0)).toBe(true);
    expect(listReferencePrototypeOptions(REFERENCE_DATASET_REGISTRY)).toEqual([
      { id: 'prototype.breadsticks', count: 9 },
      { id: 'prototype.cake-adjacent', count: 1 },
      { id: 'prototype.coating', count: 7 },
      { id: 'prototype.crackers', count: 13 },
      { id: 'prototype.crepe', count: 5 },
      { id: 'prototype.custard-like', count: 1 },
      { id: 'prototype.fermented-batter', count: 1 },
      { id: 'prototype.foam-leavened', count: 1 },
      { id: 'prototype.fritter', count: 1 },
      { id: 'prototype.pancake', count: 9 },
      { id: 'prototype.steam-puffed', count: 3 },
      { id: 'prototype.waffle', count: 6 },
    ]);
    expect(listReferenceRecordsForPrototype(REFERENCE_DATASET_REGISTRY, 'prototype.breadsticks')).toHaveLength(9);
    expect(listReferenceRecordsForPrototype(REFERENCE_DATASET_REGISTRY, 'prototype.crackers')).toHaveLength(13);
  });

  it('publishes the common breadstick process fields on every reference formula', () => {
    const records = GOLD_FORMULAS_RELEASE!.records;
    expect(records.every((record) => record.process !== null)).toBe(true);
    const breadAndCrackerRecords = records.filter((record) => record.identity.prototypeId !== undefined
      && ['prototype.breadsticks', 'prototype.crackers'].includes(record.identity.prototypeId));
    expect(breadAndCrackerRecords.every((record) => record.process?.aeration.method.state === 'known'
      && record.process.aeration.method.value === 'none')).toBe(true);
    const nonFlaky = breadAndCrackerRecords.filter((record) => record.identity.preparationKey !== 'cracker-flaky');
    expect(nonFlaky.every((record) => record.process?.lamination.enabled.state === 'known'
      && record.process.lamination.enabled.value === false)).toBe(true);
    const flaky = records.find((record) => record.identity.preparationKey === 'cracker-flaky');
    expect(flaky?.process?.lamination.enabled).toMatchObject({ state: 'known', value: true });
    expect(flaky?.process?.lamination.laminationFat).toMatchObject({ state: 'known' });
    expect(breadAndCrackerRecords.every((record) => record.process?.thermalProcess.method.state === 'known'
      && record.process.thermalProcess.method.value === 'static_oven')).toBe(true);
    expect(breadAndCrackerRecords.every((record) => record.process?.thermalProcess.preheated.state === 'known'
      && record.process.thermalProcess.preheated.value === true)).toBe(true);
    expect(breadAndCrackerRecords.every((record) => record.process?.thermalProcess.surfaceTreatment.state === 'known'
      && record.process.thermalProcess.surfaceTreatment.value === 'none')).toBe(true);
    expect(breadAndCrackerRecords.every((record) => record.process?.geometry.containerType.state === 'known'
      && record.process.geometry.containerType.value === 'baking_sheet')).toBe(true);
    const crackers = records.filter((record) => record.identity.prototypeId === 'prototype.crackers'
      && record.provenance.sourceId === 'source.dfi-internal-crackers');
    expect(crackers.every((record) => record.process?.geometry.docking.state === 'known')).toBe(true);
    expect(crackers.every((record) => (record.process?.ingredientAddition.steps.length ?? 0) >= 5)).toBe(true);
    const batters = records.filter((record) => record.provenance.sourceId === 'source.dfi-internal-batters');
    expect(batters).toHaveLength(35);
    expect(batters.every((record) => record.process?.thermalProcess.method.state === 'known')).toBe(true);
    expect(batters.some((record) => record.process?.thermalProcess.method.state === 'known'
      && record.process.thermalProcess.method.value === 'waffle_iron')).toBe(true);
    expect(batters.some((record) => record.process?.thermalProcess.method.state === 'known'
      && record.process.thermalProcess.method.value === 'shallow_fry')).toBe(true);
    expect(batters.some((record) => record.process?.aeration.method.state === 'known'
      && record.process.aeration.method.value === 'egg_white_whip')).toBe(true);
    expect(batters.some((record) => record.process?.fermentation.agent.state === 'known'
      && record.process.fermentation.agent.value === 'sourdough')).toBe(true);
    const coating = records.filter((record) => record.identity.prototypeId === 'prototype.coating');
    expect(coating).toHaveLength(7);
    expect(coating.every((record) => record.process?.thermalProcess.method.state === 'known'
      && record.process.thermalProcess.method.value === 'deep_fry'
      && record.process.geometry.shapeClass.state === 'known'
      && record.process.geometry.shapeClass.value === 'coating')).toBe(true);
    const fritter = records.filter((record) => record.identity.prototypeId === 'prototype.fritter');
    expect(fritter).toHaveLength(1);
    expect(fritter.every((record) => record.process?.thermalProcess.method.state === 'known'
      && record.process.thermalProcess.method.value === 'shallow_fry'
      && record.process.geometry.shapeClass.state === 'known'
      && record.process.geometry.shapeClass.value === 'fritter')).toBe(true);
    const waffles = records.filter((record) => record.identity.prototypeId === 'prototype.waffle');
    expect(waffles.every((record) => record.process?.thermalProcess.method.state === 'known'
      && record.process.thermalProcess.method.value === 'waffle_iron'
      && record.process.geometry.shapeClass.state === 'known'
      && record.process.geometry.shapeClass.value === 'waffle')).toBe(true);
  });

  it('exposes a bounded, searchable read model over the published release', () => {
    const firstPage = browseReferenceFormulas(REFERENCE_DATASET_REGISTRY, {
      locale: 'en',
      page: 1,
      pageSize: 8,
    });
    expect(firstPage.outcome).toBe('completed');
    expect(firstPage.totalItems).toBe(57);
    expect(firstPage.items).toHaveLength(8);
    expect(firstPage.totalPages).toBe(8);

    const prototypeFiltered = browseReferenceFormulas(REFERENCE_DATASET_REGISTRY, {
      locale: 'el',
      prototypeId: 'prototype.breadsticks',
      pageSize: 24,
    });
    expect(prototypeFiltered.totalItems).toBe(9);
    expect(prototypeFiltered.items.every((item) => item.prototypeId === 'prototype.breadsticks')).toBe(true);

    const crackerFiltered = browseReferenceFormulas(REFERENCE_DATASET_REGISTRY, {
      locale: 'el',
      prototypeId: 'prototype.crackers',
      pageSize: 24,
    });
    expect(crackerFiltered.totalItems).toBe(13);
    expect(crackerFiltered.items.every((item) => item.prototypeId === 'prototype.crackers')).toBe(true);

    const searched = browseReferenceFormulas(REFERENCE_DATASET_REGISTRY, {
      locale: 'el',
      query: 'grissini',
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
