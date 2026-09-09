import { describe, expect, it } from 'vitest';
import {
  ACID_NEUTRALIZATION_UNIT,
  calculateIntrinsicMetrics,
} from './composition';
import {
  createInitialFormulaDraft,
  knownDraftValue,
  normalizeFormula,
  unknownDraftValue,
} from './normalization';

function normalizedInitial() {
  const result = normalizeFormula(createInitialFormulaDraft('composition-test'));
  expect(result.data).not.toBeNull();
  return result.data!;
}

function metric(result: ReturnType<typeof calculateIntrinsicMetrics>, key: string) {
  return result.metrics.find((item) => item.key === key);
}

describe('intrinsic composition analysis', () => {
  it('calculates deterministic composition totals and flour-relative percentages', () => {
    const result = calculateIntrinsicMetrics(normalizedInitial());
    const water = metric(result, 'water');

    expect(result.outcome).toBe('partial');
    expect(water?.semanticClass).toBe('calculated');
    expect(water?.value).toBe(840);
    expect(water?.relativeValue).toBe(84);
    expect(water?.status).toBe('complete');
  });

  it('keeps inclusion composition separate from effective continuous-phase water', () => {
    const draft = createInitialFormulaDraft('role-test');
    draft.ingredientLines.push({
      id: 'line-inclusion',
      ingredientId: 'raisin',
      name: 'Raisin',
      massGrams: '100',
      massUnit: 'g',
      role: 'inclusion',
      composition: {
        ...draft.ingredientLines[0].composition,
        water: knownDraftValue(20),
      },
    });

    const normalized = normalizeFormula(draft).data!;
    const result = calculateIntrinsicMetrics(normalized);
    const water = metric(result, 'water');
    const effectiveWater = metric(result, 'effectiveWater');

    expect(water?.value).toBe(860);
    expect(effectiveWater?.value).toBe(840);
    expect(effectiveWater?.explanation.exclusions.some((item) => item.sourceId === 'line-inclusion')).toBe(true);
  });

  it('preserves unknown as partial evidence instead of numeric zero', () => {
    const draft = createInitialFormulaDraft('unknown-test');
    draft.ingredientLines[0].composition.fat = unknownDraftValue('source-missing');

    const result = calculateIntrinsicMetrics(normalizeFormula(draft).data!);
    const fat = metric(result, 'fat');

    expect(fat?.status).toBe('unavailable');
    expect(fat?.value).toBeUndefined();
    expect(fat?.limitationCodes).toContain('UNKNOWN_COMPOSITION');
    expect(fat?.explanation.missingEvidence.join('|')).toContain('line-water.fat');
  });

  it('scales only effective water with a local availability override', () => {
    const draft = createInitialFormulaDraft('availability-test');
    draft.ingredientLines[0].availabilityOverride = knownDraftValue(0.5);

    const result = calculateIntrinsicMetrics(normalizeFormula(draft).data!);
    const water = metric(result, 'water');
    const effectiveWater = metric(result, 'effectiveWater');

    expect(water?.value).toBe(840);
    expect(effectiveWater?.value).toBe(490);
    expect(effectiveWater?.semanticClass).toBe('estimated');
    expect(effectiveWater?.contributors.find((item) => item.sourceId === 'line-water')?.availabilityFactor).toBe(0.5);
  });

  it('returns a partial absorption estimate when one flour lacks evidence', () => {
    const draft = createInitialFormulaDraft('absorption-test');
    draft.flourComponents[1].absorptionPercentage = '';

    const result = calculateIntrinsicMetrics(normalizeFormula(draft).data!);
    const absorption = metric(result, 'flourAbsorption');
    const hydration = metric(result, 'effectiveHydration');

    expect(absorption?.semanticClass).toBe('estimated');
    expect(absorption?.status).toBe('partial');
    expect(absorption?.value).toBe(75);
    expect(hydration?.value).toBe(84);
  });

  it('preserves the canonical acid-neutralization unit', () => {
    const draft = createInitialFormulaDraft('acid-test');
    draft.ingredientLines[0].acidNeutralization = knownDraftValue(0.25);

    const result = calculateIntrinsicMetrics(normalizeFormula(draft).data!);
    const acid = metric(result, 'acidNeutralization');

    expect(acid?.unit).toBe(ACID_NEUTRALIZATION_UNIT);
    expect(acid?.value).toBe(0.25);
    expect(acid?.explanation.parameters.acidUnit).toBe(ACID_NEUTRALIZATION_UNIT);
  });

  it('keeps heuristics distinct from calculated totals and independent from Process', () => {
    const formula = normalizedInitial();
    const first = calculateIntrinsicMetrics(formula);
    const second = calculateIntrinsicMetrics(formula);

    expect(first).toEqual(second);
    expect(metric(first, 'gpi')?.semanticClass).toBe('heuristic');
    expect(metric(first, 'egi')?.semanticClass).toBe('heuristic');
    expect(metric(first, 'enrichment')?.semanticClass).toBe('heuristic');
    expect(metric(first, 'tenderness')?.semanticClass).toBe('heuristic');
    expect(metric(first, 'fluidity')?.semanticClass).toBe('heuristic');
  });
});
