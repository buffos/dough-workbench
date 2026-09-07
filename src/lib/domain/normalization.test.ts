import { describe, expect, it } from 'vitest';
import {
  COMPOSITION_FIELDS,
  compositionFromCatalog,
  createInitialFormulaDraft,
  emptyComposition,
  knownDraftValue,
  normalizeFormula,
  parsePositiveMass,
  validateFormula,
} from './normalization';

describe('formula normalization', () => {
  it('normalizes the starter multi-flour formula deterministically', () => {
    const result = normalizeFormula(createInitialFormulaDraft('formula-test'));

    expect(result.outcome).toBe('completed');
    expect(result.readiness).toBe('normalized');
    expect(result.data?.structuralFlourDenominator.value).toBe(1000);
    expect(result.data?.flourComponents.map((component) => component.blendFraction.value)).toEqual([70, 30]);
    expect(result.data?.ingredientLines[0].bakersPercentage.value).toBe(70);
    expect(result.data?.normalizationPolicy).toBe('formula-normalization-v1');
    expect(result.data?.structuralFlourDenominator.semanticClass).toBe('calculated');
  });

  it('accepts the inclusive 100.01% blend boundary and rejects values beyond it', () => {
    const boundary = createInitialFormulaDraft('blend-boundary');
    boundary.flourComponents[0].declaredBlendPercentage = '60';
    boundary.flourComponents[1].declaredBlendPercentage = '40.01';
    expect(normalizeFormula(boundary).outcome).toBe('completed');

    const outside = createInitialFormulaDraft('blend-outside');
    outside.flourComponents[0].declaredBlendPercentage = '60';
    outside.flourComponents[1].declaredBlendPercentage = '40.02';
    const result = normalizeFormula(outside);
    expect(result.outcome).toBe('rejected');
    expect(result.diagnostics.some((diagnostic) => diagnostic.code === 'INVALID_BLEND')).toBe(true);
  });

  it('blocks a formula without positive structural flour', () => {
    const draft = createInitialFormulaDraft('missing-flour');
    draft.flourComponents = [];
    const result = normalizeFormula(draft);

    expect(result.outcome).toBe('rejected');
    expect(result.data).toBeNull();
    expect(result.diagnostics[0].code).toBe('MISSING_STRUCTURAL_FLOUR');
    expect(result.data?.structuralFlourDenominator).toBeUndefined();
  });

  it('rejects invalid mass without mutating valid siblings, then accepts correction', () => {
    const draft = createInitialFormulaDraft('mass-recovery');
    draft.ingredientLines.push({
      id: 'line-invalid',
      name: 'Salt',
      massGrams: '0',
      massUnit: 'g',
      role: 'other',
      composition: compositionFromCatalog({}),
    });
    const siblingBefore = { ...draft.ingredientLines[0] };

    const rejected = normalizeFormula(draft);
    expect(rejected.outcome).toBe('rejected');
    expect(rejected.diagnostics.some((diagnostic) => diagnostic.code === 'INVALID_MASS' && diagnostic.objectId === 'line-invalid')).toBe(true);
    expect(draft.ingredientLines[0]).toEqual(siblingBefore);

    draft.ingredientLines[1].massGrams = '10';
    const corrected = normalizeFormula(draft);
    expect(corrected.outcome).toBe('completed');
    expect(corrected.data?.ingredientLines).toHaveLength(2);
  });

  it.each(['', 'Infinity', '0', '-1'])('rejects invalid active mass %j with INVALID_MASS', (mass) => {
    const draft = createInitialFormulaDraft(`invalid-${mass || 'blank'}`);
    draft.ingredientLines[0].massGrams = mass;
    const result = normalizeFormula(draft);
    expect(result.outcome).toBe('rejected');
    expect(result.diagnostics.some((diagnostic) => diagnostic.code === 'INVALID_MASS')).toBe(true);
  });

  it('keeps Unknown, None, and known numeric zero distinct and returns a partial outcome', () => {
    const draft = createInitialFormulaDraft('unknowns');
    const composition = emptyComposition();
    composition.water = { state: 'unknown', reasonCode: 'not-supplied' };
    composition.fat = { state: 'none' };
    composition.protein = knownDraftValue(0);
    composition.sugar = { state: 'none' };
    composition.starch = { state: 'none' };
    draft.ingredientLines[0].composition = composition;

    const result = normalizeFormula(draft);
    const line = result.data?.ingredientLines[0];
    expect(result.outcome).toBe('partial');
    expect(result.readiness).toBe('partial_ready');
    expect(line?.composition.water).toEqual({ state: 'unknown', reasonCode: 'not-supplied' });
    expect(line?.composition.fat).toEqual({ state: 'none' });
    expect(line?.composition.protein.state).toBe('known');
    expect(line?.composition.protein.state === 'known' && line.composition.protein.value).toBe(0);
    expect(result.data?.compositionMetrics.water.available).toBe(false);
    expect(result.data?.compositionMetrics.fat.value).toBe(0);
    expect(result.coverage).toBeLessThan(1);
    expect(result.confidence).toBeLessThan(1);
    expect(result.explanation.unknownFields[0].path).toContain('composition.water');
  });

  it('preserves calculated semantics and provenance in the explanation', () => {
    const result = normalizeFormula(createInitialFormulaDraft('explanation'));
    expect(result.explanation.provenance.kind).toBe('derived');
    expect(result.explanation.denominatorBasis).toHaveLength(2);
    expect(result.data?.ingredientLines[0].bakersPercentage.provenance.modelVersion).toBe('formula-input-v0.1');
    expect(result.data?.compositionMetrics.water.semanticClass).toBe('calculated');
  });

  it('keeps a non-flour structural ingredient out of the flour denominator', () => {
    const draft = createInitialFormulaDraft('role-boundary');
    draft.ingredientLines.push({
      id: 'line-cocoa',
      name: 'Cocoa powder',
      massGrams: '50',
      massUnit: 'g',
      role: 'structural',
      composition: compositionFromCatalog({}),
    });

    const result = normalizeFormula(draft);
    expect(result.data?.structuralFlourDenominator.value).toBe(1000);
    expect(result.data?.ingredientLines[1].bakersPercentage.value).toBe(5);
    expect(result.explanation.excludedComponents).toContain('Cocoa powder · structural role, non-flour component');
  });

  it('keeps evidence confidence distinct from input coverage', () => {
    const draft = createInitialFormulaDraft('confidence');
    draft.ingredientLines[0].composition.water = {
      state: 'known',
      value: '100',
      provenance: { kind: 'catalog', sourceId: 'low-confidence-source' },
      confidence: 0.4,
    };

    const result = normalizeFormula(draft);
    expect(result.coverage).toBe(1);
    expect(result.confidence).toBe(0.88);
  });

  it('enforces grams-only input and rejects non-finite or blank masses', () => {
    expect(parsePositiveMass('  ')).toBeNull();
    expect(parsePositiveMass('Infinity')).toBeNull();
    expect(parsePositiveMass('-2')).toBeNull();
    expect(parsePositiveMass('250,5')).toBe(250.5);

    const draft = createInitialFormulaDraft('units');
    const line = draft.ingredientLines[0] as typeof draft.ingredientLines[0] & { massUnit: string };
    line.massUnit = 'ml';
    const diagnostics = validateFormula(draft);
    expect(diagnostics.some((diagnostic) => diagnostic.code === 'UNSUPPORTED_UNIT')).toBe(true);
  });

  it('keeps the canonical composition field set stable', () => {
    expect(COMPOSITION_FIELDS).toEqual(['water', 'fat', 'protein', 'sugar', 'starch']);
  });
});
