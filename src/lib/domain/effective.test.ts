import { describe, expect, it } from 'vitest';
import { calculateIntrinsicMetrics } from './composition';
import { evaluateEffectiveBehavior } from './effective';
import { prepareAnalysisInput } from './handoff';
import { createInitialFormulaDraft, knownDraftValue } from './normalization';
import {
  PROCESS_FIELD_DESCRIPTORS,
  createInitialProcessDraft,
  type ProcessDraft,
  normalizeProcess,
} from './process';
import type { DraftValueState } from './types';

function resolveProcess(process: ProcessDraft): ProcessDraft {
  for (const descriptor of PROCESS_FIELD_DESCRIPTORS) {
    const [section, field] = descriptor.path.split('.') as [keyof ProcessDraft, string];
    const container = process[section] as unknown as Record<string, DraftValueState>;
    container[field] = { state: 'none' };
  }
  return process;
}

function analyze(process: ProcessDraft) {
  const formulaDraft = createInitialFormulaDraft(process.formulaId);
  const handoff = prepareAnalysisInput(formulaDraft, process);
  expect(handoff.data).not.toBeNull();
  const intrinsic = calculateIntrinsicMetrics(handoff.data!.formula);
  return {
    handoff,
    intrinsic,
    result: evaluateEffectiveBehavior({ reference: handoff.data!, intrinsic }),
  };
}

function metric(result: ReturnType<typeof evaluateEffectiveBehavior>, key: string) {
  return result.metrics.find((item) => item.key === key);
}

describe('effective process behavior analysis', () => {
  it('keeps an all-Unknown Process partial and does not invent effective metrics', () => {
    const process = createInitialProcessDraft('effective-missing');
    const { intrinsic, result } = analyze(process);

    expect(result.outcome).toBe('partial');
    expect(result.metrics).toEqual([]);
    expect(result.coverage).toBe(0);
    expect(result.diagnostics.map((item) => item.code)).toEqual(expect.arrayContaining([
      'MISSING_PROCESS_EVIDENCE',
      'ADDITION_ORDER_NOT_RECORDED',
      'NO_SUPPORTED_EFFECTIVE_METRICS',
    ]));
    expect(intrinsic.metrics.find((item) => item.key === 'gpi')?.value).toBeDefined();
  });

  it('derives mixing and aeration contributions without changing intrinsic values', () => {
    const process = resolveProcess(createInitialProcessDraft('effective-mixing'));
    process.mixing.method = knownDraftValue('spiral_mix');
    process.mixing.intensity = knownDraftValue('0.8');
    process.mixing.durationSeconds = knownDraftValue('420');
    process.aeration.method = knownDraftValue('egg_white_whip');
    process.aeration.intensity = knownDraftValue('0.9');
    process.aeration.foamStability = knownDraftValue('0.75');

    const first = analyze(process);
    const second = analyze({ ...process, revision: process.revision + 1, mixing: { ...process.mixing, intensity: knownDraftValue('0.4') } });

    expect(first.result.modelVersion).toBe('effective-behavior-seed-v2');
    expect(metric(first.result, 'effectiveGluten')?.value).toBeDefined();
    expect(metric(first.result, 'gasRetention')?.value).toBeDefined();
    expect(first.result.featureContributions.some((item) => item.featureKey === 'mixingWork')).toBe(true);
    expect(first.result.featureContributions.some((item) => item.featureKey === 'aerationEfficiency')).toBe(true);
    expect(first.intrinsic).toEqual(second.intrinsic);
    expect(metric(first.result, 'effectiveGluten')?.value).not.toBe(metric(second.result, 'effectiveGluten')?.value);
  });

  it('keeps Unknown distinct from explicit None and ignores unsupported addition order', () => {
    const process = createInitialProcessDraft('effective-states');
    process.aeration.method = knownDraftValue('none');
    const withExplicitNone = analyze(process);
    const gasWithNone = metric(withExplicitNone.result, 'gasRetention');

    expect(gasWithNone?.value).toBe(0);
    expect(gasWithNone?.status).toBe('partial');
    expect(gasWithNone?.explanation.missingPrerequisites).toContain('aeration.intensity');

    const genericAddition = resolveProcess(createInitialProcessDraft('effective-generic-addition'));
    genericAddition.ingredientAddition.steps = [{ id: 'water-step', sequence: '1', lineIds: ['line-water'], action: 'add', durationSeconds: '20' }];
    const genericResult = analyze(genericAddition).result;
    const noAdditionResult = analyze(resolveProcess(createInitialProcessDraft('effective-generic-addition'))).result;

    expect(genericResult.featureContributions.some((item) => item.featureKey === 'additionOrder')).toBe(false);
    expect(metric(genericResult, 'effectiveGluten')?.value).toBe(metric(noAdditionResult, 'effectiveGluten')?.value);
  });

  it('keeps bulk temperature and expansion targets distinct in fermentation features', () => {
    const process = resolveProcess(createInitialProcessDraft('effective-fermentation'));
    process.fermentation.agent = knownDraftValue('commercial_yeast');
    process.fermentation.bulkTimeSeconds = knownDraftValue('3600');
    process.fermentation.bulkTemperatureCelsius = knownDraftValue('24');
    process.fermentation.bulkExpansionTarget = knownDraftValue('fifty_percent_increase');
    process.fermentation.finalExpansionTarget = knownDraftValue('double');

    const { result } = analyze(process);

    expect(metric(result, 'fermentationSeverity')?.value).toBeDefined();
    expect(metric(result, 'proofTendency')?.value).toBeDefined();
    expect(result.featureContributions.some((item) => item.path === 'fermentation.bulkTemperatureCelsius')).toBe(true);
    expect(result.featureContributions.some((item) => item.path === 'fermentation.bulkExpansionTarget')).toBe(true);
  });

  it('records late-fat order without duplicating Formula mass and reports lamination', () => {
    const process = resolveProcess(createInitialProcessDraft('effective-lamination'));
    process.ingredientAddition.fatIncorporationMode = knownDraftValue('late_incorporation');
    process.ingredientAddition.steps = [{
      id: 'late-fat-step',
      sequence: '1',
      lineIds: ['line-water'],
      action: 'incorporate_fat',
      durationSeconds: '30',
    }];
    process.lamination.enabled = knownDraftValue('true');
    process.lamination.layerFatPercentage = knownDraftValue('0.5');
    process.lamination.foldSequence = knownDraftValue('double_fold');
    process.lamination.fatState = knownDraftValue('plastic');
    process.lamination.workingTemperatureCelsius = knownDraftValue('18');

    const { handoff, result } = analyze(process);
    const waterMass = handoff.data!.formula.ingredientLines.find((line) => line.id === 'line-water')?.mass.value;

    expect(waterMass).toBe(700);
    expect(metric(result, 'laminationIntegrity')?.value).toBeDefined();
    expect(result.featureContributions.some((item) => item.featureKey === 'additionOrder')).toBe(true);
    expect(result.featureContributions.some((item) => item.featureKey === 'laminationConditions')).toBe(true);
  });

  it('returns a conflict for a stale or foreign line reference', () => {
    const process = createInitialProcessDraft('effective-conflict');
    const { handoff, intrinsic } = analyze(process);
    const stale = evaluateEffectiveBehavior({
      reference: handoff.data!,
      intrinsic,
      expectedProcessRevision: handoff.data!.processRevision + 1,
    });
    expect(stale.outcome).toBe('conflict');
    expect(stale.diagnostics[0].code).toBe('STALE_PAIR');

    const foreign = {
      ...handoff.data!,
      process: {
        ...handoff.data!.process,
        ingredientAddition: {
          ...handoff.data!.process.ingredientAddition,
          steps: [{ id: 'step', sequence: 1, lineIds: ['line-from-other-formula'], action: 'add', durationSeconds: 10 }],
        },
      },
    };
    const conflict = evaluateEffectiveBehavior({ reference: foreign, intrinsic });
    expect(conflict.outcome).toBe('conflict');
    expect(conflict.diagnostics[0].code).toBe('REFERENCE_MISMATCH');
  });

  it('derives thermal and geometry tendencies with explicit partial coverage', () => {
    const process = createInitialProcessDraft('effective-thermal');
    process.thermalProcess.method = knownDraftValue('fan_oven');
    process.thermalProcess.temperatureCelsius = knownDraftValue('210');
    process.thermalProcess.durationSeconds = knownDraftValue('1800');
    process.thermalProcess.preheated = knownDraftValue('true');
    process.geometry.shapeClass = knownDraftValue('loaf');
    process.geometry.characteristicThicknessMillimeters = knownDraftValue('80');

    const { result } = analyze(process);
    const setting = metric(result, 'settingTendency');

    expect(setting?.value).toBeDefined();
    expect(setting?.status).toBe('partial');
    expect(metric(result, 'moistureLossTendency')?.value).toBeDefined();
    expect(metric(result, 'processRisk')?.value).toBeDefined();
  });

  it('preserves intrinsic metrics across Process revisions', () => {
    const firstProcess = resolveProcess(createInitialProcessDraft('effective-independent'));
    firstProcess.mixing.method = knownDraftValue('hand_knead');
    firstProcess.mixing.intensity = knownDraftValue('0.4');
    const secondProcess = { ...firstProcess, revision: 2, mixing: { ...firstProcess.mixing, method: knownDraftValue('machine_knead') } };

    const first = analyze(firstProcess);
    const second = analyze(secondProcess);

    expect(first.intrinsic).toEqual(second.intrinsic);
    expect(first.result.formulaRevision).toBe(second.result.formulaRevision);
    expect(first.result.processRevision).not.toBe(second.result.processRevision);
    expect(metric(first.result, 'effectiveGluten')?.value).not.toBe(metric(second.result, 'effectiveGluten')?.value);
  });

  it('normalizes a complete process before effective evaluation', () => {
    const process = resolveProcess(createInitialProcessDraft('effective-normalized'));
    const normalized = normalizeProcess(process, ['line-water']);

    expect(normalized.outcome).toBe('completed');
    expect(normalized.data?.ingredientAddition.steps).toEqual([]);
  });
});
