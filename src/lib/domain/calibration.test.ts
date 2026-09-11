import { describe, expect, it } from 'vitest';
import { computeReleaseContentIdentity, GOLD_DATASET_KIND, GOLD_DATASET_RELEASE_ID, type DatasetRecordSnapshot, type DatasetRelease } from './dataset';
import { createInitialFormulaDraft, normalizeFormula } from './normalization';
import { createInitialProcessDraft, normalizeProcess } from './process';
import { DEFAULT_CALIBRATION_PROTOCOL, evaluateCalibrationEvidence } from './calibration';
import {
  MATURITY_CONFIDENCE_CEILINGS,
  createModelParameterRelease,
  publishModelParameterRelease,
  runRegressionSuite,
  runSemanticRegressionSuite,
  type RegressionSuite,
} from './maturity';

function record(id: string, partition: DatasetRecordSnapshot['evaluationPartition'] = 'calibration', roles: DatasetRecordSnapshot['roles'] = ['reference', 'calibration']): DatasetRecordSnapshot {
  const formula = normalizeFormula(createInitialFormulaDraft(`formula-${id}`)).data;
  if (!formula) throw new Error('fixture formula should normalize');
  return {
    releaseId: GOLD_DATASET_RELEASE_ID,
    recordId: id,
    identity: { preparationKey: id, label: { en: id, el: id }, familyId: 'family.fermented-gluten.lean-bread' },
    formula,
    process: null,
    provenance: { sourceId: `source-${id}`, quality: 'high', curationState: 'accepted', reviewNote: { en: 'Reviewed.', el: 'Ελεγμένο.' } },
    roles,
    evaluationPartition: partition,
    publicSelectable: roles.includes('reference') && partition === 'calibration',
    primary: false,
    maturity: 'expert-seed',
  };
}

function recordWithProcess(id: string, partition: DatasetRecordSnapshot['evaluationPartition'], roles: DatasetRecordSnapshot['roles']): DatasetRecordSnapshot {
  const value = record(id, partition, roles);
  const processDraft = createInitialProcessDraft(value.formula.formulaId);
  value.process = normalizeProcess(processDraft, value.formula.ingredientLines.map((line) => line.id)).data;
  return value;
}

function release(records: DatasetRecordSnapshot[]): DatasetRelease {
  const base: DatasetRelease = {
    descriptor: {
      releaseId: GOLD_DATASET_RELEASE_ID,
      kind: GOLD_DATASET_KIND,
      status: 'published',
      contentIdentity: '',
      createdAt: '2026-09-10T00:00:00Z',
      supersedes: null,
      recordCount: records.length,
      defaultModelVersion: DEFAULT_CALIBRATION_PROTOCOL.modelVersion,
    },
    records,
  };
  return { ...base, descriptor: { ...base.descriptor, contentIdentity: computeReleaseContentIdentity(base) } };
}

const passingRegression: RegressionSuite = runRegressionSuite(() => ({ status: 'pass', detail: 'fixture passed' }));

describe('calibration evidence evaluator', () => {
  it('keeps calibration fitting separate from held-out partitions and roles', () => {
    const evaluation = evaluateCalibrationEvidence({
      release: release([record('fit-1'), record('validation-1', 'validation', ['reference']), record('test-1', 'test', ['reference'])]),
      protocol: DEFAULT_CALIBRATION_PROTOCOL,
    });
    expect(evaluation.outcome).toBe('completed');
    expect(evaluation.evaluation.fitRecordIds).toEqual(['fit-1']);
    expect(evaluation.evaluation.validationRecordIds).toEqual(['validation-1']);
    expect(evaluation.evaluation.testRecordIds).toEqual(['test-1']);
    expect(evaluation.evaluation.evidence.find((item) => item.recordId === 'validation-1')?.roles).toEqual(['reference']);
  });

  it('rejects test leakage explicitly', () => {
    const evaluation = evaluateCalibrationEvidence({
      release: release([record('test-fit', 'test')]),
      protocol: { ...DEFAULT_CALIBRATION_PROTOCOL, fitPartitions: ['test'] },
    });
    expect(evaluation.outcome).toBe('rejected');
    expect(evaluation.evaluation.diagnostics.some((item) => item.code === 'test_leakage')).toBe(true);
    expect(evaluation.evaluation.fitRecordIds).toEqual([]);
  });

  it('is reproducible and retains declared quality weights', () => {
    const input = { release: release([record('fit-1')]), protocol: DEFAULT_CALIBRATION_PROTOCOL };
    const first = evaluateCalibrationEvidence(input).evaluation;
    const second = evaluateCalibrationEvidence(input).evaluation;
    expect(first.evaluationId).toBe(second.evaluationId);
    expect(first.qualityWeights.high).toBeGreaterThan(first.qualityWeights.low);
  });

  it('retains stronger evidence weight and rejects invalid protocol weights', () => {
    const evaluation = evaluateCalibrationEvidence({
      release: release([record('high-1'), { ...record('low-1'), provenance: { ...record('low-1').provenance, quality: 'low' } }]),
      protocol: DEFAULT_CALIBRATION_PROTOCOL,
    });
    expect(evaluation.outcome).toBe('completed');
    expect(evaluation.evaluation.evidence.find((item) => item.recordId === 'high-1')?.qualityWeight)
      .toBeGreaterThan(evaluation.evaluation.evidence.find((item) => item.recordId === 'low-1')?.qualityWeight ?? 0);

    const invalid = evaluateCalibrationEvidence({
      release: release([record('fit-1')]),
      protocol: { ...DEFAULT_CALIBRATION_PROTOCOL, qualityWeights: { high: 1, medium: 0.7, low: 0 } },
    });
    expect(invalid.outcome).toBe('rejected');
    expect(invalid.evaluation.diagnostics.some((item) => item.code === 'invalid_protocol')).toBe(true);
  });

  it('reports invalid partition assignment and preserves Unknown as explicit evidence', () => {
    const invalidPartition = record('invalid-partition');
    (invalidPartition as unknown as { evaluationPartition: string }).evaluationPartition = 'unassigned';
    const invalidResult = evaluateCalibrationEvidence({
      release: release([invalidPartition]),
      protocol: DEFAULT_CALIBRATION_PROTOCOL,
    });
    expect(invalidResult.outcome).toBe('rejected');
    expect(invalidResult.evaluation.diagnostics.some((item) => item.code === 'partition_violation')).toBe(true);

    const unknown = record('unknown-fit');
    unknown.formula.flourComponents[0].composition.water = { state: 'unknown', reasonCode: 'not-supplied' };
    const unknownResult = evaluateCalibrationEvidence({
      release: release([unknown]),
      protocol: DEFAULT_CALIBRATION_PROTOCOL,
    });
    expect(unknownResult.outcome).toBe('rejected');
    expect(unknownResult.evaluation.diagnostics.some((item) => item.code === 'unknown_evidence')).toBe(true);
  });
});

describe('maturity and regression release gate', () => {
  it('runs the canonical semantic regression case set', () => {
    const suite = runSemanticRegressionSuite();
    expect(suite.cases.map((item) => item.id)).toHaveLength(10);
    expect(suite.outcome).toBe('pass');
  });

  it('requires the complete regression case set and bounds confidence by maturity', () => {
    const evaluation = evaluateCalibrationEvidence({ release: release([record('fit-1')]), protocol: DEFAULT_CALIBRATION_PROTOCOL }).evaluation;
    const modelRelease = createModelParameterRelease({
      releaseId: 'classification-seed-v2',
      evaluation,
      requestedMaturity: 'expert-seed',
      regression: passingRegression,
      createdAt: '2026-09-10T14:00:00Z',
    });
    expect(modelRelease.outcome).toBe('published');
    expect(modelRelease.release?.similaritySemantics).toBe('similarity-not-probability');
    expect(modelRelease.release?.confidenceCeiling).toBeLessThanOrEqual(MATURITY_CONFIDENCE_CEILINGS['expert-seed']);
    expect('probability' in (modelRelease.release ?? {})).toBe(false);
  });

  it('keeps under-evidenced higher maturity unpublished', () => {
    const evaluation = evaluateCalibrationEvidence({ release: release([record('fit-1')]), protocol: DEFAULT_CALIBRATION_PROTOCOL }).evaluation;
    const modelRelease = createModelParameterRelease({
      releaseId: 'classification-gold-v1',
      evaluation,
      requestedMaturity: 'gold-calibrated',
      regression: passingRegression,
      createdAt: '2026-09-10T14:00:00Z',
    });
    expect(modelRelease.outcome).toBe('rejected');
    expect(modelRelease.diagnostics[0].code).toBe('insufficient_evidence');
  });

  it('requires the complete canonical regression set', () => {
    const evaluation = evaluateCalibrationEvidence({ release: release([record('fit-1')]), protocol: DEFAULT_CALIBRATION_PROTOCOL }).evaluation;
    const incomplete = { ...passingRegression, cases: passingRegression.cases.slice(0, -1) };
    const modelRelease = createModelParameterRelease({
      releaseId: 'classification-incomplete-v1',
      evaluation,
      requestedMaturity: 'expert-seed',
      regression: incomplete,
      createdAt: '2026-09-10T14:00:00Z',
    });
    expect(modelRelease.outcome).toBe('rejected');
    expect(modelRelease.diagnostics.some((item) => item.code === 'regression_failure')).toBe(true);
  });

  it('allows stable only after experiment evidence and preserves older releases', () => {
    const evaluated = evaluateCalibrationEvidence({
      release: release([
        recordWithProcess('fit-1', 'calibration', ['reference', 'calibration']),
        recordWithProcess('validation-1', 'validation', ['reference']),
        recordWithProcess('test-1', 'test', ['reference']),
      ]),
      protocol: DEFAULT_CALIBRATION_PROTOCOL,
    }).evaluation;
    const evaluation = {
      ...evaluated,
      coverage: { ...evaluated.coverage, weightedFitCoverage: 1, processCoverage: 1 },
    };
    const stable = createModelParameterRelease({
      releaseId: 'classification-stable-v1',
      evaluation,
      requestedMaturity: 'stable',
      regression: passingRegression,
      createdAt: '2026-09-10T14:00:00Z',
      controlledExperimentEvidence: true,
    });
    expect(stable.outcome, JSON.stringify(stable.diagnostics)).toBe('published');
    expect(stable.release?.maturity).toBe('stable');

    const registry = { currentReleaseId: 'classification-stable-v1', releases: { 'classification-stable-v1': stable.release! } };
    const published = publishModelParameterRelease(registry, stable.release!);
    expect(published.outcome).toBe('rejected');
    expect(published.diagnostics[0].code).toBe('release_immutable');

    const candidate = { ...stable.release!, releaseId: 'classification-stable-v2', supersedes: stable.release!.releaseId };
    const next = publishModelParameterRelease(registry, candidate);
    expect(next.outcome).toBe('published');
    expect(next.registry?.releases['classification-stable-v1']).toEqual(stable.release);
    expect(next.registry?.releases['classification-stable-v2']).not.toBe(stable.release);
  });
});
