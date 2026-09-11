import { describe, expect, it } from 'vitest';
import { COVERAGE_INVENTORY } from '../../data/reference/coverage';
import {
  collectSourceFacts,
  createAcquisitionRun,
  normalizeCandidateRecord,
  type CandidateCapture,
  type SourceFact,
} from './acquisition';
import {
  preparePilotCoverage,
  preparePilotHandoff,
  reviewCandidateRecord,
  type CurationReview,
} from './curation';
import { assembleGoldDatasetRelease, publishIntoRegistry } from './publication';
import { GOLD_DATASET_RELEASE_ID } from './dataset';
import { SOURCE_REGISTRY_ID, SOURCE_REGISTRY_REVISION, type SourceRegistry } from './source-registry';

const source: SourceRegistry = {
  registryId: SOURCE_REGISTRY_ID,
  revision: SOURCE_REGISTRY_REVISION,
  coverageRevision: COVERAGE_INVENTORY.revision,
  createdAt: '2026-09-10T00:00:00Z',
  policy: { runtimeScraping: 'prohibited', unattendedCrawling: 'prohibited', accessBypass: 'prohibited', publicCopiedProse: 'prohibited' },
  sources: [{
    sourceId: 'source-approved-fixture',
    citation: { en: 'Approved fixture', el: 'Εγκεκριμένο fixture' },
    urlOrBibliography: 'test://approved',
    authorOrPublisher: 'Fixture publisher',
    accessedAt: '2026-09-10',
    quality: 'high',
    authorityAssessment: { en: 'Fixture.', el: 'Fixture.' },
    attribution: { en: 'Fixture.', el: 'Fixture.' },
    acquisitionStatus: 'manual-only',
    reuseStatus: 'normalized-facts-only',
    acquisitionMethod: { en: 'Manual fixture.', el: 'Χειροκίνητο fixture.' },
    limitations: { en: 'Fixture only.', el: 'Μόνο fixture.' },
    expectedCategories: ['yeasted-breads'],
    expectedPreparationKeys: ['lean-white-loaf'],
  }],
};

function makeFact(id: string, path: string, value: string | number, unit: SourceFact['unit'] = 'g'): SourceFact {
  return { factId: id, path, kind: 'formula', value, unit, sourceLocator: `fixture:${path}` };
}

function makeCapture(): CandidateCapture {
  return {
    formula: {
      flours: [{
        id: 'flour-1',
        name: { fact: makeFact('flour-name', 'flour.name', 'Strong wheat flour'), value: 'Strong wheat flour' },
        ingredientId: 'wheat-flour-strong',
        mass: { fact: makeFact('flour-mass', 'flour.mass', 1000), value: 1000, unit: 'g' },
        flourBearing: true,
      }],
      ingredients: [{
        id: 'water-1',
        name: { fact: makeFact('water-name', 'water.name', 'Water'), value: 'Water' },
        ingredientId: 'water',
        mass: { fact: makeFact('water-mass', 'water.mass', 700), value: 700, unit: 'g' },
        role: 'continuous_phase',
      }],
    },
  };
}

function candidate() {
  const capture = makeCapture();
  const runResult = createAcquisitionRun({
    registry: source,
    sourceId: 'source-approved-fixture',
    preparationKey: 'lean-white-loaf',
    method: 'manual-capture',
    toolVersion: 'fixture-capture-v1',
    scope: { categoryId: 'yeasted-breads', fields: ['formula'] },
    inputIdentity: 'fixture-loaf-v1',
    capturedAt: '2026-09-10T10:00:00Z',
    facts: collectSourceFacts(capture),
  });
  const result = normalizeCandidateRecord({
    registry: source,
    run: runResult.run!,
    facts: capture,
    candidateId: 'candidate-loaf-v1',
  });
  if (!result.candidate) throw new Error('fixture candidate should normalize');
  return result.candidate;
}

const acceptedReview: CurationReview = {
  reviewId: 'review-loaf-v1',
  candidateId: 'candidate-loaf-v1',
  reviewerRole: 'formula-reviewer',
  decision: 'accepted-for-release',
  reviewedAt: '2026-09-10T11:00:00Z',
  checks: {
    sourceAttribution: true,
    formulaTranscription: true,
    gramNormalization: true,
    ingredientResolution: true,
    unknownHandling: true,
    processEvidence: true,
  },
  reason: { en: 'Evidence reviewed.', el: 'Τα τεκμήρια ελέγχθηκαν.' },
  releasePlan: {
    roles: ['reference', 'calibration'],
    evaluationPartition: 'calibration',
    publicSelectable: true,
    primary: true,
    maturity: 'expert-seed',
  },
};

describe('candidate curation and pilot reporting', () => {
  it('supports an explicit acceptance lifecycle without publishing', () => {
    const reviewed = reviewCandidateRecord(candidate(), acceptedReview, source);
    expect(reviewed.outcome).toBe('reviewed');
    expect(reviewed.candidate?.status).toBe('ready-for-release');
    expect(reviewed.candidate?.review?.decision).toBe('accepted-for-release');

    const report = preparePilotCoverage(COVERAGE_INVENTORY, source, [reviewed.candidate!]);
    expect(report.outcome).toBe('reported');
    expect(report.isPilotSample).toBe(true);
    expect(report.acceptedCandidateIds).toEqual(['candidate-loaf-v1']);
    expect(report.categoryCounts['yeasted-breads'].acceptedCount).toBe(1);
    expect(report.categoryCounts['yeasted-breads'].targetMet).toBe(false);
    expect(report.missingInventoryEntries).toContain('baguette');
    expect(report.notes.en).toContain('not complete');

    const handoff = preparePilotHandoff(COVERAGE_INVENTORY, report, [reviewed.candidate!], '2026-09-10T12:00:00Z');
    expect(handoff.outcome).toBe('prepared');
    expect(handoff.handoff?.immutable).toBe(true);
    expect(handoff.handoff?.candidateIds).toEqual(['candidate-loaf-v1']);
    expect(handoff.handoff?.candidates[0]).not.toBe(reviewed.candidate);
  });

  it('keeps returned and rejected decisions explicit', () => {
    const base = candidate();
    const returned = reviewCandidateRecord(base, {
      ...acceptedReview,
      reviewId: 'review-returned',
      decision: 'returned-for-correction',
      reason: { en: 'Mass needs checking.', el: 'Χρειάζεται έλεγχος της μάζας.' },
    }, source);
    expect(returned.outcome).toBe('reviewed');
    expect(returned.candidate?.status).toBe('needs-review');
    const rejected = reviewCandidateRecord(base, {
      ...acceptedReview,
      reviewId: 'review-rejected',
      decision: 'rejected',
      reason: { en: 'Not suitable.', el: 'Δεν είναι κατάλληλο.' },
    }, source);
    expect(rejected.candidate?.status).toBe('rejected');
    const report = preparePilotCoverage(COVERAGE_INVENTORY, source, [rejected.candidate!]);
    expect(report.acceptedCandidateIds).toEqual([]);
  });

  it('publishes only an accepted handoff with an explicit release plan', () => {
    const reviewed = reviewCandidateRecord(candidate(), acceptedReview, source);
    const publication = assembleGoldDatasetRelease({
      handoff: preparePilotHandoff(
        COVERAGE_INVENTORY,
        preparePilotCoverage(COVERAGE_INVENTORY, source, [reviewed.candidate!]),
        [reviewed.candidate!],
        '2026-09-10T12:00:00Z',
      ).handoff!,
      registry: source,
      createdAt: '2026-09-10T13:00:00Z',
    });
    expect(publication.outcome).toBe('published');
    expect(publication.release?.descriptor.releaseId).toBe(GOLD_DATASET_RELEASE_ID);
    expect(publication.release?.records[0].normalization?.length).toBeGreaterThan(0);

    const registered = publishIntoRegistry({ currentReleaseId: 'none', releases: {} }, publication.release!);
    expect(registered.outcome).toBe('published');
    expect(registered.registry?.currentReleaseId).toBe(GOLD_DATASET_RELEASE_ID);
    const duplicate = publishIntoRegistry(registered.registry!, publication.release!);
    expect(duplicate.outcome).toBe('rejected');
    expect(duplicate.diagnostic?.code).toBe('release_id_conflict');
  });
});
