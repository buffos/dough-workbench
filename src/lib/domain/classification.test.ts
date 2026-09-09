import { describe, expect, it } from 'vitest';
import { loadPrototypeCatalog } from '../../data/prototypes/catalog';
import {
  calculateIntrinsicMetricsDraft,
  evaluateEffectiveBehaviorDraft,
  prepareAnalysisInputDraft,
} from '../application/formula-workspace';
import {
  createInitialFormulaDraft,
  knownDraftValue,
} from './normalization';
import { createInitialProcessDraft } from './process';
import { resolvePrototypeCatalog } from './prototype-catalog';
import {
  buildClassificationFeatureSet,
  classifyFormula,
  explainClassification,
  evaluateFamilyGates,
  evaluatePrototypeSimilarities,
  getClassificationFeature,
  resolveClassificationOutcome,
  topFamilyMemberships,
  topPrototypeSimilarities,
} from './classification';
import type { FamilyMembership, PrototypeSimilarity } from './classification';

function prepareReference(targetDevelopment = 'full') {
  const formula = createInitialFormulaDraft();
  const process = createInitialProcessDraft(formula.formulaId);
  process.mixing.targetDevelopment = knownDraftValue(targetDevelopment);
  process.fermentation.agent = knownDraftValue('commercial_yeast');
  process.fermentation.bulkTimeSeconds = knownDraftValue(3600);
  process.lamination.enabled = knownDraftValue('false');
  process.aeration.method = knownDraftValue('none');
  const handoff = prepareAnalysisInputDraft(formula, process);
  expect(handoff.data).not.toBeNull();
  const reference = handoff.data!;
  const intrinsic = calculateIntrinsicMetricsDraft(formula);
  expect(intrinsic).not.toBeNull();
  const effective = evaluateEffectiveBehaviorDraft(reference);
  const catalog = loadPrototypeCatalog();
  if (catalog.status !== 'available') throw new Error('Expected the prototype catalog fixture to be available');
  return {
    reference,
    intrinsic: intrinsic!,
    effective,
    catalog,
  };
}

describe('classification feature snapshot', () => {
  it('uses effective and functional feature IDs instead of raw ingredient names', () => {
    const prepared = prepareReference();
    const result = buildClassificationFeatureSet({
      reference: prepared.reference,
      intrinsic: prepared.intrinsic,
      effective: prepared.effective,
      catalog: prepared.catalog,
    });

    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;
    expect(result.data.features.some((feature) => feature.id === 'relative_hydration')).toBe(true);
    expect(result.data.features.every((feature) => !('sourceName' in feature))).toBe(true);
    expect(JSON.stringify(result.data)).not.toContain('Strong wheat flour');
    expect(JSON.stringify(result.data)).not.toContain('Νερό');
  });

  it('keeps an unrecorded process feature unknown instead of converting it to zero', () => {
    const prepared = prepareReference();
    const result = buildClassificationFeatureSet({
      reference: prepared.reference,
      intrinsic: prepared.intrinsic,
      effective: prepared.effective,
      catalog: prepared.catalog,
    });

    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;
    const aeration = getClassificationFeature(result.data, 'mechanical_aeration');
    const thermal = getClassificationFeature(result.data, 'steam_leavening');
    expect(aeration?.state).toMatchObject({ state: 'known', value: 'absent' });
    expect(thermal?.state.state).toBe('unknown');
    expect(thermal?.state).not.toEqual(expect.objectContaining({ value: 0 }));
  });

  it('retains multiple family memberships instead of forcing one family', () => {
    const prepared = prepareReference();
    const result = buildClassificationFeatureSet({
      reference: prepared.reference,
      intrinsic: prepared.intrinsic,
      effective: prepared.effective,
      catalog: prepared.catalog,
    });

    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;
    const memberships = evaluateFamilyGates(result.data, prepared.catalog.snapshot!);
    const ids = memberships.map((membership) => membership.familyId);
    expect(ids).toContain('family.gluten-structured');
    expect(ids).toContain('family.lean-bread');
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('returns an explicit diagnostic for an unavailable prototype model', () => {
    const prepared = prepareReference();
    const unavailable = loadPrototypeCatalog({ version: 'prototype-catalog-missing', modelVersion: 'prototype-model-missing' });
    const result = buildClassificationFeatureSet({
      reference: prepared.reference,
      intrinsic: prepared.intrinsic,
      effective: prepared.effective,
      catalog: unavailable,
    });

    expect(result.status).toBe('unavailable');
    if (result.status !== 'unavailable') return;
    expect(result.diagnostic.code).toBe('MODEL_UNAVAILABLE');
  });

  it('keeps composition similarity stable when only Process changes', () => {
    const base = prepareReference('full');
    const changed = prepareReference('minimal');
    const baseFeatures = buildClassificationFeatureSet({
      reference: base.reference,
      intrinsic: base.intrinsic,
      effective: base.effective,
      catalog: base.catalog,
    });
    const changedFeatures = buildClassificationFeatureSet({
      reference: changed.reference,
      intrinsic: changed.intrinsic,
      effective: changed.effective,
      catalog: changed.catalog,
    });
    expect(baseFeatures.status).toBe('ready');
    expect(changedFeatures.status).toBe('ready');
    if (baseFeatures.status !== 'ready' || changedFeatures.status !== 'ready') return;
    const baseCandidate = evaluatePrototypeSimilarities(baseFeatures.data, base.catalog.snapshot)
      .find((candidate) => candidate.prototypeId === 'prototype.lean-bread');
    const changedCandidate = evaluatePrototypeSimilarities(changedFeatures.data, changed.catalog.snapshot)
      .find((candidate) => candidate.prototypeId === 'prototype.lean-bread');
    expect(baseCandidate?.compositionSimilarity).toBe(changedCandidate?.compositionSimilarity);
    expect(baseCandidate?.modelVersion).toBe('classification-score-policy-v1');
    expect(baseCandidate?.compositionSimilarity).toBeGreaterThanOrEqual(0);
    expect(baseCandidate?.compositionSimilarity).toBeLessThanOrEqual(1);
  });

  it('preserves a hybrid outcome when two structural families remain supported', () => {
    const prepared = prepareReference();
    const featureSet = buildClassificationFeatureSet({
      reference: prepared.reference,
      intrinsic: prepared.intrinsic,
      effective: prepared.effective,
      catalog: prepared.catalog,
    });
    expect(featureSet.status).toBe('ready');
    if (featureSet.status !== 'ready') return;
    const result = resolveClassificationOutcome({
      featureSet: featureSet.data,
      families: [
        { familyId: 'family.one', status: 'supported', coverage: 1, confidence: 0.9, evidence: [] },
        { familyId: 'family.two', status: 'supported', coverage: 1, confidence: 0.8, evidence: [] },
      ],
      candidates: [],
      diagnostics: [],
    });

    expect(result.outcome).toBe('hybrid');
    expect(result.families).toHaveLength(2);
  });

  it('returns an explicit partial result for stale analysis input', () => {
    const prepared = prepareReference();
    const result = classifyFormula({
      reference: { ...prepared.reference, formulaRevision: prepared.reference.formulaRevision + 1 },
      intrinsic: prepared.intrinsic,
      effective: prepared.effective,
      catalog: prepared.catalog,
    });

    expect(result.outcome).toBe('partial');
    expect(result.diagnostics.some((diagnostic) => diagnostic.code === 'STALE_ANALYSIS')).toBe(true);
  });

  it('keeps no-strong-match as a valid outcome when no family or prototype is supported', () => {
    const prepared = prepareReference();
    const featureSet = buildClassificationFeatureSet({
      reference: prepared.reference,
      intrinsic: prepared.intrinsic,
      effective: prepared.effective,
      catalog: prepared.catalog,
    });
    expect(featureSet.status).toBe('ready');
    if (featureSet.status !== 'ready') return;
    const result = resolveClassificationOutcome({
      featureSet: { ...featureSet.data, features: [], coverage: 1, confidence: 1 },
      families: [],
      candidates: [],
      diagnostics: [],
    });

    expect(result.outcome).toBe('no_strong_canonical_match');
    expect(result.diagnostics).toHaveLength(0);
  });

  it('keeps classification explanation evidence faithful to the selected vector', () => {
    const prepared = prepareReference();
    const featureSet = buildClassificationFeatureSet({
      reference: prepared.reference,
      intrinsic: prepared.intrinsic,
      effective: prepared.effective,
      catalog: prepared.catalog,
    });
    expect(featureSet.status).toBe('ready');
    if (featureSet.status !== 'ready') return;
    const candidates = evaluatePrototypeSimilarities(featureSet.data, prepared.catalog.snapshot);
    const candidate = candidates.find((item) => item.prototypeId === 'prototype.lean-bread');
    expect(candidate).toBeDefined();
    if (!candidate) return;
    const resolvedCatalog = resolvePrototypeCatalog(prepared.catalog.snapshot);
    expect(resolvedCatalog.status).toBe('resolved');
    if (resolvedCatalog.status !== 'resolved') return;
    const definition = resolvedCatalog.snapshot.byId[candidate.prototypeId];
    expect(definition).toBeDefined();
    if (!definition) return;
    const resolved = classifyFormula({
      reference: prepared.reference,
      intrinsic: prepared.intrinsic,
      effective: prepared.effective,
      catalog: prepared.catalog,
    });
    const explanation = explainClassification({
      featureSet: featureSet.data,
      definition,
      similarity: candidate,
    });

    expect(explanation.modelVersion).toBe(candidate.modelVersion);
    expect(explanation.missingFeatures.length).toBeGreaterThan(0);
    expect(explanation.inheritedRules.length).toBeGreaterThan(0);
    expect(resolved.explanation.modelVersion).toBe(candidate.modelVersion);
    expect(resolved.explanation.primaryPrototypeId).toBe(candidate.prototypeId);
  });

  it('limits family display candidates while prioritizing supported memberships', () => {
    const families: FamilyMembership[] = Array.from({ length: 10 }, (_, index) => ({
      familyId: `family.${index}`,
      status: index === 9 ? 'supported' : 'partial',
      coverage: index / 10,
      confidence: index / 10,
      evidence: [],
    }));

    const top = topFamilyMemberships(families);

    expect(top).toHaveLength(8);
    expect(top[0]?.familyId).toBe('family.9');
    expect(top.some((family) => family.familyId === 'family.0')).toBe(false);
  });

  it('limits prototype display candidates by overall similarity', () => {
    const candidates: PrototypeSimilarity[] = Array.from({ length: 10 }, (_, index) => ({
      prototypeId: `prototype.${index}`,
      compositionSimilarity: index / 10,
      overallIdentitySimilarity: index / 10,
      confidence: 1,
      coverage: 1,
      status: 'candidate',
      modelVersion: 'classification-score-policy-v1',
      evaluatedFeatures: [],
    }));

    const top = topPrototypeSimilarities(candidates);

    expect(top).toHaveLength(8);
    expect(top[0]?.prototypeId).toBe('prototype.9');
    expect(top[7]?.prototypeId).toBe('prototype.2');
    expect(top.some((candidate) => candidate.prototypeId === 'prototype.1')).toBe(false);
  });
});
