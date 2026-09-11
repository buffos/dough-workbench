import { describe, expect, it } from 'vitest';
import { COVERAGE_INVENTORY, validateCoverageInventory } from '../../data/reference/coverage';
import { SOURCE_REGISTRY, PROPOSED_RECIPE_SOURCES } from '../../data/reference/sources';
import { STARTER_CATALOG_VERSION } from '../../data/ingredients/starter-catalog';
import {
  ACQUISITION_PIPELINE_VERSION,
  collectSourceFacts,
  createAcquisitionRun,
  normalizeCandidateRecord,
  type CandidateCapture,
  type SourceFact,
} from './acquisition';
import { preparePilotCoverage } from './curation';
import {
  SOURCE_REGISTRY_ID,
  SOURCE_REGISTRY_REVISION,
  validateSourceRegistry,
  type SourceRegistry,
} from './source-registry';
import { STRUCTURAL_FAMILY_BY_ID } from './structural-taxonomy';

const fact = (factId: string, path: string, value: string | number, unit: SourceFact['unit'] = 'g'): SourceFact => ({
  factId,
  path,
  kind: 'formula',
  value,
  unit,
  sourceLocator: `manual:${path}`,
});

const sourceRegistry = (status: 'manual-only' | 'manual-review' = 'manual-only'): SourceRegistry => ({
  registryId: SOURCE_REGISTRY_ID,
  revision: SOURCE_REGISTRY_REVISION,
  coverageRevision: COVERAGE_INVENTORY.revision,
  createdAt: '2026-09-10T00:00:00Z',
  policy: {
    runtimeScraping: 'prohibited',
    unattendedCrawling: 'prohibited',
    accessBypass: 'prohibited',
    publicCopiedProse: 'prohibited',
  },
  sources: [{
    sourceId: 'source-test',
    citation: { en: 'Test source', el: 'Πηγή δοκιμής' },
    urlOrBibliography: 'test://source',
    authorOrPublisher: 'Test publisher',
    accessedAt: '2026-09-10',
    quality: 'high',
    authorityAssessment: { en: 'Fixture only.', el: 'Μόνο fixture.' },
    attribution: { en: 'Fixture attribution.', el: 'Αναφορά fixture.' },
    acquisitionStatus: status,
    reuseStatus: status === 'manual-only' ? 'normalized-facts-only' : 'review-required',
    acquisitionMethod: { en: 'Manual fixture.', el: 'Χειροκίνητο fixture.' },
    limitations: { en: 'Not source evidence.', el: 'Δεν είναι τεκμήριο πηγής.' },
    expectedCategories: ['yeasted-breads'],
    expectedPreparationKeys: ['lean-white-loaf'],
  }],
});

function capture(overrides: Partial<CandidateCapture> = {}): CandidateCapture {
  const flourName = fact('flour-name', 'formula.flour.name', 'Strong wheat flour');
  const flourMass = fact('flour-mass', 'formula.flour.mass', 1, 'kg');
  const waterName = fact('water-name', 'formula.water.name', 'Water');
  const waterMass = fact('water-mass', 'formula.water.mass', 700);
  return {
    formula: {
      flours: [{
        id: 'flour-1',
        name: { fact: flourName, value: 'Strong wheat flour' },
        ingredientId: 'wheat-flour-strong',
        mass: { fact: flourMass, value: 1, unit: 'kg' },
        flourBearing: true,
      }],
      ingredients: [{
        id: 'water-1',
        name: { fact: waterName, value: 'Water' },
        ingredientId: 'water',
        mass: { fact: waterMass, value: 700, unit: 'g' },
        role: 'continuous_phase',
      }],
    },
    ...overrides,
  };
}

describe('coverage inventory and source policy', () => {
  it('keeps the approved planning baseline machine-readable', () => {
    expect(COVERAGE_INVENTORY.entries).toHaveLength(154);
    expect(validateCoverageInventory(COVERAGE_INVENTORY)).toEqual([]);
    expect(new Set(COVERAGE_INVENTORY.categories.map((item) => item.id)).size).toBe(11);
    expect(COVERAGE_INVENTORY.entries.every((entry) => entry.candidateStructuralFamilies.length === 1
      && entry.candidateStructuralFamilies.every((familyId) => Boolean(STRUCTURAL_FAMILY_BY_ID[familyId])))).toBe(true);
  });

  it('validates the proposed source registry without treating proposals as approved evidence', () => {
    expect(PROPOSED_RECIPE_SOURCES).toHaveLength(5);
    expect(validateSourceRegistry(SOURCE_REGISTRY, COVERAGE_INVENTORY)).toEqual([]);
    expect(SOURCE_REGISTRY.sources.every((source) => source.acquisitionStatus === 'manual-only')).toBe(true);
  });

  it('reports an empty pilot as explicit coverage gaps even when source paths are usable', () => {
    const report = preparePilotCoverage(COVERAGE_INVENTORY, SOURCE_REGISTRY, []);
    expect(report.acceptedCandidateIds).toEqual([]);
    expect(report.missingInventoryEntries).toHaveLength(154);
    expect(report.blockedEntries).toHaveLength(0);
    expect(Object.values(report.categoryCounts)).toHaveLength(11);
    expect(Object.values(report.categoryCounts).every((item) => item.sourcePathAvailable && !item.targetMet)).toBe(true);
  });

  it('reports missing source attribution and rejects unclear acquisition', () => {
    const invalid = sourceRegistry();
    invalid.sources[0].attribution = { en: '', el: '' };
    expect(validateSourceRegistry(invalid, COVERAGE_INVENTORY).some((item) => item.code === 'source_metadata_invalid')).toBe(true);
    const rejected = createAcquisitionRun({
      registry: invalid,
      sourceId: 'source-test',
      preparationKey: 'lean-white-loaf',
      method: 'manual-capture',
      toolVersion: 'capture-test-v1',
      scope: { categoryId: 'yeasted-breads', fields: ['formula'] },
      inputIdentity: 'fixture-input-invalid-source',
      capturedAt: '2026-09-10T10:00:00Z',
      facts: [],
    });
    expect(rejected.outcome).toBe('rejected');
    expect(rejected.diagnostic?.code).toBe('source_review_required');
    expect(rejected.run).toBeNull();
  });

  it('reports duplicate source IDs and invalid source coverage links', () => {
    const duplicate = sourceRegistry();
    duplicate.sources.push({ ...duplicate.sources[0] });
    expect(validateSourceRegistry(duplicate, COVERAGE_INVENTORY).some((item) => item.code === 'duplicate_source_id')).toBe(true);

    const invalidLinks = sourceRegistry();
    invalidLinks.sources[0].expectedCategories = ['category-does-not-exist'];
    invalidLinks.sources[0].expectedPreparationKeys = ['preparation-does-not-exist'];
    const diagnostics = validateSourceRegistry(invalidLinks, COVERAGE_INVENTORY);
    expect(diagnostics.some((item) => item.code === 'source_category_link_invalid')).toBe(true);
    expect(diagnostics.some((item) => item.code === 'source_preparation_link_invalid')).toBe(true);
  });

  it('does not acquire from a source awaiting product approval', () => {
    const result = createAcquisitionRun({
      registry: sourceRegistry('manual-review'),
      sourceId: 'source-test',
      preparationKey: 'lean-white-loaf',
      method: 'manual-capture',
      toolVersion: 'capture-test-v1',
      scope: { categoryId: 'yeasted-breads', fields: ['formula'] },
      inputIdentity: 'fixture-input-v1',
      capturedAt: '2026-09-10T10:00:00Z',
      facts: [],
    });
    expect(result.outcome).toBe('rejected');
    expect(result.diagnostic?.code).toBe('source_review_required');
  });
});

describe('offline acquisition and normalization', () => {
  it('creates a deterministic run and normalizes justified kg-to-g conversion', () => {
    const registry = sourceRegistry();
    const facts = collectSourceFacts(capture());
    const input = {
      registry,
      sourceId: 'source-test',
      preparationKey: 'lean-white-loaf',
      method: 'manual-capture' as const,
      toolVersion: 'capture-test-v1',
      scope: { categoryId: 'yeasted-breads', fields: ['formula'] },
      inputIdentity: 'fixture-input-v1',
      capturedAt: '2026-09-10T10:00:00Z',
      facts,
    };
    const first = createAcquisitionRun(input);
    const second = createAcquisitionRun(input);
    expect(first.outcome).toBe('captured');
    expect(first.run?.pipelineVersion).toBe(ACQUISITION_PIPELINE_VERSION);
    expect(first.run?.identity).toBe(second.run?.identity);

    const normalized = normalizeCandidateRecord({
      registry,
      run: first.run!,
      facts: capture(),
      candidateId: 'candidate-lean-white-v1',
      catalogVersion: STARTER_CATALOG_VERSION,
    });
    expect(normalized.outcome).toBe('normalized');
    expect(normalized.candidate?.formula?.flourComponents[0].mass.value).toBe(1000);
    expect(normalized.candidate?.normalization.some((item) => item.conversion === 'kg→g ×1000')).toBe(true);
    expect(normalized.candidate?.process).toBeNull();
    expect(normalized.candidate?.processPresent).toBe(false);
    expect(normalized.candidate?.normalization.some((item) => item.kind === 'unknown' && item.path.startsWith('formula.flourComponents[0].composition'))).toBe(false);
  });

  it('keeps missing Process separate and traceable as unknown', () => {
    const registry = sourceRegistry();
    const run = createAcquisitionRun({
      registry,
      sourceId: 'source-test',
      preparationKey: 'lean-white-loaf',
      method: 'manual-capture',
      toolVersion: 'capture-test-v1',
      scope: { categoryId: 'yeasted-breads', fields: ['formula'] },
      inputIdentity: 'fixture-input-v2',
      capturedAt: '2026-09-10T10:00:00Z',
      facts: collectSourceFacts(capture()),
    });
    const normalized = normalizeCandidateRecord({ registry, run: run.run!, facts: capture(), candidateId: 'candidate-process-unknown' });
    expect(normalized.candidate?.process).toBeNull();
    expect(normalized.candidate?.normalization.some((item) => item.path === 'process.fermentation.bulkTemperatureCelsius' && item.kind === 'unknown')).toBe(false);
  });

  it('blocks a required named ingredient without catalog or functional composition', () => {
    const registry = sourceRegistry();
    const candidateCapture = capture({
      formula: {
        ...capture().formula,
        ingredients: [{
          id: 'unknown-1',
          name: { fact: fact('unknown-name', 'formula.unknown.name', 'Unmapped ingredient'), value: 'Unmapped ingredient' },
          mass: { fact: fact('unknown-mass', 'formula.unknown.mass', 10), value: 10, unit: 'g' },
          role: 'other',
        }],
      },
    });
    const run = createAcquisitionRun({
      registry,
      sourceId: 'source-test',
      preparationKey: 'lean-white-loaf',
      method: 'manual-capture',
      toolVersion: 'capture-test-v1',
      scope: { categoryId: 'yeasted-breads', fields: ['formula'] },
      inputIdentity: 'fixture-input-v3',
      capturedAt: '2026-09-10T10:00:00Z',
      facts: collectSourceFacts(candidateCapture),
    });
    const normalized = normalizeCandidateRecord({ registry, run: run.run!, facts: candidateCapture, candidateId: 'candidate-blocked' });
    expect(normalized.outcome).toBe('rejected');
    expect(normalized.diagnostics.some((item) => item.parameters.reason === 'unresolved-required-ingredient')).toBe(true);
  });
});
