import { describe, expect, it } from 'vitest';
import {
  PROTOTYPE_CATALOG_VERSION,
  PROTOTYPE_MODEL_VERSION,
  createPrototypeCatalogLoader,
  createPrototypeCatalogSnapshot,
  resolvePrototypeCatalog,
  type PrototypeCatalogInput,
  type PrototypeDefinition,
  type PrototypeMatcherPolicy,
} from './prototype-catalog';
import {
  PROTOTYPE_CATALOG_INPUT,
  loadPrototypeCatalog,
} from '../../data/prototypes/catalog';

const testPolicy: PrototypeMatcherPolicy = {
  id: 'matcher.test-qualitative-v1',
  mode: 'qualitative',
  missingFeaturePolicy: 'limit-match',
  criticalMismatchPolicy: 'block-strong-match',
  identityModifierPolicy: 'report-separately',
};

function testDefinition(
  id: string,
  kind: PrototypeDefinition['kind'],
  parentIds: readonly string[] = [],
  matcherPolicy: PrototypeMatcherPolicy | undefined = testPolicy,
): PrototypeDefinition {
  return {
    id,
    kind,
    label: { en: id, el: id },
    parentIds,
    familyIds: [],
    structuralFeatures: [{
      id: `${id}.feature`,
      label: { en: 'Feature', el: 'Χαρακτηριστικό' },
      target: { kind: 'band', value: 'medium' },
      importance: 'high',
    }],
    structuralConstraints: [],
    identityModifiers: [],
    matcherPolicy,
    confidenceTier: 'high',
    maturity: 'expert-seed',
    provenance: {
      sourceId: 'test-fixture',
      sourceVersion: 'v1',
      method: 'expert-seed',
      note: { en: 'Test fixture', el: 'Test fixture' },
    },
  };
}

function testInput(definitions: readonly PrototypeDefinition[]): PrototypeCatalogInput {
  return {
    catalogId: 'test-catalog',
    version: 'test-v1',
    modelVersion: 'test-model-v1',
    supportedLocales: ['en', 'el'],
    definitions,
  };
}

describe('prototype catalog boundary', () => {
  it('loads a supported version with immutable reproducibility metadata', () => {
    const loaded = loadPrototypeCatalog();

    expect(loaded.status).toBe('available');
    if (loaded.status !== 'available') return;
    expect(loaded.snapshot.reference.version).toBe(PROTOTYPE_CATALOG_VERSION);
    expect(loaded.snapshot.reference.modelVersion).toBe(PROTOTYPE_MODEL_VERSION);
    expect(loaded.snapshot.reference.contentHash).toMatch(/^fnv1a-/);
    expect(Object.isFrozen(loaded.snapshot)).toBe(true);
    expect(Object.isFrozen(loaded.snapshot.definitions)).toBe(true);
    expect(Object.isFrozen(loaded.snapshot.definitions[0])).toBe(true);
  });

  it('rejects unavailable catalog and model versions without fallback', () => {
    const unavailableCatalog = loadPrototypeCatalog('prototype-catalog-v0');
    expect(unavailableCatalog.status).toBe('unavailable');
    if (unavailableCatalog.status === 'unavailable') {
      expect(unavailableCatalog.diagnostic.code).toBe('CATALOG_VERSION_UNAVAILABLE');
      expect(unavailableCatalog.diagnostic.parameters.requested).toBe('prototype-catalog-v0');
    }

    const unavailableModel = loadPrototypeCatalog({
      version: PROTOTYPE_CATALOG_VERSION,
      modelVersion: 'prototype-model-v0',
    });
    expect(unavailableModel.status).toBe('unavailable');
    if (unavailableModel.status === 'unavailable') {
      expect(unavailableModel.diagnostic.code).toBe('MODEL_VERSION_UNAVAILABLE');
      expect(unavailableModel.diagnostic.parameters.requested).toBe('prototype-model-v0');
    }
  });

  it('rejects duplicate IDs, malformed metadata, and invalid direct references', () => {
    const base = testDefinition('family.base', 'family');
    const duplicate = createPrototypeCatalogSnapshot(testInput([base, { ...base }]));
    expect(duplicate.status).toBe('invalid');
    if (duplicate.status === 'invalid') expect(duplicate.diagnostics.some((item) => item.code === 'DUPLICATE_ID')).toBe(true);

    const malformed = createPrototypeCatalogSnapshot(testInput([{ ...base, label: { en: '', el: 'Χωρίς τίτλο' } }]));
    expect(malformed.status).toBe('invalid');
    if (malformed.status === 'invalid') expect(malformed.diagnostics.some((item) => item.code === 'MALFORMED_METADATA')).toBe(true);

    const invalidReference = createPrototypeCatalogSnapshot(testInput([{ ...base, familyIds: ['family.missing'] }]));
    expect(invalidReference.status).toBe('invalid');
    if (invalidReference.status === 'invalid') expect(invalidReference.diagnostics.some((item) => item.code === 'INVALID_REFERENCE')).toBe(true);
  });

  it('rejects a feature declared in more than one rule collection', () => {
    const base = testDefinition('family.base', 'family');
    const duplicateDeclaration = {
      ...base,
      structuralConstraints: [...base.structuralFeatures],
    };
    const built = createPrototypeCatalogSnapshot(testInput([duplicateDeclaration]));

    expect(built.status).toBe('invalid');
    if (built.status === 'invalid') {
      expect(built.diagnostics.some((item) => item.code === 'DUPLICATE_FEATURE_DECLARATION')).toBe(true);
    }
  });

  it('rejects a child rule that has no overlap with its parent rule', () => {
    const parent = {
      ...testDefinition('family.parent', 'family'),
      structuralFeatures: [{
        id: 'shared.feature',
        label: { en: 'Shared', el: 'Κοινό' },
        target: { kind: 'band' as const, value: 'high' as const },
        importance: 'critical' as const,
      }],
    };
    const child = {
      ...testDefinition('prototype.child', 'prototype', ['family.parent'], undefined),
      familyIds: ['family.parent'],
      structuralFeatures: [{
        id: 'shared.feature',
        label: { en: 'Shared', el: 'Κοινό' },
        target: { kind: 'band' as const, value: 'very_low' as const },
        importance: 'critical' as const,
      }],
    };
    const built = createPrototypeCatalogSnapshot(testInput([parent, child]));

    expect(built.status).toBe('invalid');
    if (built.status === 'invalid') {
      expect(built.diagnostics.some((item) => item.code === 'CHILD_RULE_OUTSIDE_PARENT')).toBe(true);
    }
  });

  it('rejects incompatible rules inherited from two parents', () => {
    const firstParent = {
      ...testDefinition('family.first', 'family'),
      structuralFeatures: [{
        id: 'shared.feature',
        label: { en: 'Shared', el: 'Κοινό' },
        target: { kind: 'band' as const, value: 'high' as const },
        importance: 'critical' as const,
      }],
    };
    const secondParent = {
      ...testDefinition('family.second', 'family'),
      structuralFeatures: [{
        id: 'shared.feature',
        label: { en: 'Shared', el: 'Κοινό' },
        target: { kind: 'band' as const, value: 'very_low' as const },
        importance: 'critical' as const,
      }],
    };
    const child = {
      ...testDefinition('prototype.child', 'prototype', ['family.first', 'family.second'], undefined),
      familyIds: ['family.first', 'family.second'],
    };
    const built = createPrototypeCatalogSnapshot(testInput([firstParent, secondParent, child]));

    expect(built.status).toBe('invalid');
    if (built.status === 'invalid') {
      expect(built.diagnostics.some((item) => item.code === 'CONFLICTING_PARENT_RULE')).toBe(true);
    }
  });

  it('rejects a prototype whose declared family does not match its family parent', () => {
    const parent = testDefinition('family.parent', 'family');
    const child = testDefinition('prototype.child', 'prototype', ['family.parent'], undefined);
    const built = createPrototypeCatalogSnapshot(testInput([parent, child]));

    expect(built.status).toBe('invalid');
    if (built.status === 'invalid') {
      expect(built.diagnostics.some((item) => item.code === 'INVALID_FAMILY_ASSIGNMENT')).toBe(true);
    }
  });

  it('resolves family inheritance deterministically and keeps source metadata separate', () => {
    const parent = testDefinition('family.parent', 'family');
    const child = {
      ...testDefinition('prototype.child', 'prototype', ['family.parent']),
      familyIds: ['family.parent'],
      matcherPolicy: undefined,
    };
    const built = createPrototypeCatalogSnapshot(testInput([parent, child]));
    expect(built.status).toBe('available');
    if (built.status !== 'available') return;

    const resolved = resolvePrototypeCatalog(built.snapshot);
    expect(resolved.status).toBe('resolved');
    if (resolved.status !== 'resolved') return;
    const result = resolved.snapshot.byId['prototype.child'];
    expect(result.familyIds).toContain('family.parent');
    expect(result.structuralFeatures.some((item) => item.id === 'family.parent.feature' && item.origin === 'inherited')).toBe(true);
    expect(result.matcherPolicySourceId).toBe('family.parent');
    expect(result.ancestry).toEqual(['prototype.child', 'family.parent']);
    expect(Object.isFrozen(result)).toBe(true);
  });

  it('rejects cyclic parent references and never returns partial inheritance', () => {
    const first = testDefinition('family.first', 'family', ['family.second']);
    const second = testDefinition('family.second', 'family', ['family.first']);
    const built = createPrototypeCatalogSnapshot(testInput([first, second]));
    expect(built.status).toBe('invalid');
    if (built.status === 'invalid') {
      expect(built.diagnostics.some((item) => item.code === 'PROTOTYPE_REFERENCE_CYCLE')).toBe(true);
    }
  });
});

describe('high-confidence prototype seed catalog', () => {
  it('contains the agreed high-confidence families and named prototypes', () => {
    const loaded = loadPrototypeCatalog();
    expect(loaded.status).toBe('available');
    if (loaded.status !== 'available') return;
    const resolved = resolvePrototypeCatalog(loaded.snapshot);
    expect(resolved.status).toBe('resolved');
    if (resolved.status !== 'resolved') return;

    const familyIds = resolved.snapshot.definitions.filter((definition) => definition.kind === 'family').map((definition) => definition.id);
    const prototypeIds = resolved.snapshot.definitions.filter((definition) => definition.kind === 'prototype').map((definition) => definition.id);
    const batterFamilyIds = familyIds.filter((id) => id === 'family.batters' || id.startsWith('family.batters.'));
    const batterPrototypeIds = prototypeIds.filter((id) => [
      'prototype.pancake',
      'prototype.crepe',
      'prototype.waffle',
      'prototype.steam-puffed',
      'prototype.custard-like',
      'prototype.coating',
      'prototype.fritter',
      'prototype.fermented-batter',
      'prototype.foam-leavened',
      'prototype.cake-adjacent',
    ].includes(id));
    expect(batterFamilyIds).toHaveLength(11);
    expect(batterPrototypeIds).toHaveLength(10);
    expect(familyIds).toEqual(expect.arrayContaining([
      'family.fermented-gluten',
      'family.fermented-gluten.lean-bread',
      'family.unleavened-gluten',
      'family.laminated-gluten',
      'family.short-fat-shortened',
      'family.cookie-biscuit',
      'family.chemical-cake',
      'family.foam-cake',
      'family.quick-bread',
      'family.batters',
      'family.batters.thin-pan',
      'family.batters.griddle',
      'family.batters.waffle',
      'family.batters.steam-puffed',
      'family.batters.custard-like',
      'family.batters.coating',
      'family.batters.fritter',
      'family.batters.fermented',
      'family.batters.foam-leavened',
      'family.batters.cake-adjacent',
      'family.steam-paste',
      'family.starch-dominant',
    ]));
    expect(prototypeIds).toEqual(expect.arrayContaining([
      'prototype.lean-bread',
      'prototype.breadsticks',
      'prototype.crackers',
      'prototype.brioche',
      'prototype.shortbread',
      'prototype.pancake',
      'prototype.crepe',
      'prototype.waffle',
      'prototype.steam-puffed',
      'prototype.custard-like',
      'prototype.coating',
      'prototype.fritter',
      'prototype.fermented-batter',
      'prototype.foam-leavened',
      'prototype.cake-adjacent',
      'prototype.angel-food',
      'prototype.choux',
      'prototype.croissant',
    ]));
    expect(resolved.snapshot.definitions.every((definition) => definition.confidenceTier === 'high')).toBe(true);
    expect(resolved.snapshot.byId['family.fermented-gluten'].provenance.sourceId)
      .toBe('user-provided canonical structural taxonomy');
    expect(resolved.snapshot.byId['prototype.choux'].structuralConstraints.some((item) => item.id === 'pre_cooked_starch')).toBe(true);
    expect(resolved.snapshot.byId['prototype.croissant'].structuralConstraints.some((item) => item.id === 'lamination')).toBe(true);
    expect(resolved.snapshot.byId['prototype.breadsticks'].structuralFeatures.some((item) => item.id === 'relative_hydration')).toBe(true);
    expect(resolved.snapshot.byId['prototype.breadsticks'].structuralFeatures.some((item) => item.id === 'shape_class')).toBe(true);
    expect(resolved.snapshot.byId['prototype.crackers'].familyIds).toContain('family.short-fat-shortened');
    expect(resolved.snapshot.byId['prototype.crackers'].processProfile?.find((section) => section.id === 'geometry')?.facts.some((fact) => fact.id === 'docking')).toBe(true);
    expect(resolved.snapshot.byId['prototype.breadsticks'].structuralConstraints.map((item) => item.id)).toEqual(expect.arrayContaining([
      'fermentation_agent',
      'mixing_method',
      'mixing_target',
      'aeration_method',
      'lamination',
      'thermal_method',
      'container_type',
    ]));
    const processProfile = resolved.snapshot.byId['prototype.breadsticks'].processProfile;
    expect(processProfile?.map((section) => section.id)).toEqual([
      'mixing',
      'fermentation',
      'geometry',
      'thermal',
    ]);
    expect(processProfile?.find((section) => section.id === 'geometry')?.facts.some((fact) => fact.id === 'thickness')).toBe(true);
  });

  it('keeps later catalog loading independent from an existing resolved snapshot', () => {
    const loader = createPrototypeCatalogLoader([
      PROTOTYPE_CATALOG_INPUT,
      { ...PROTOTYPE_CATALOG_INPUT, version: 'prototype-catalog-v5' },
    ]);
    const first = loader(PROTOTYPE_CATALOG_VERSION);
    const second = loader('prototype-catalog-v5');
    expect(first.status).toBe('available');
    expect(second.status).toBe('available');
    if (first.status !== 'available' || second.status !== 'available') return;
    expect(first.snapshot.reference.version).toBe(PROTOTYPE_CATALOG_VERSION);
    expect(second.snapshot.reference.version).toBe('prototype-catalog-v5');
    expect(first.snapshot.definitions).toEqual(second.snapshot.definitions);
    expect(first.snapshot).not.toBe(second.snapshot);
  });
});
