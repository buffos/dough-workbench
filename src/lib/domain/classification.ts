import {
  CLASSIFICATION_BAND_POLICY_VERSION,
  CLASSIFICATION_FEATURE_DIMENSIONS,
  CLASSIFICATION_FEATURE_SET_VERSION,
  CLASSIFICATION_IMPORTANCE_WEIGHTS,
  CLASSIFICATION_SCORE_POLICY_VERSION,
  CLASSIFICATION_SEED_MODEL_VERSION,
  qualitativeBandFor,
} from '../../data/models/classification-model';
import type {
  EffectiveAnalysisResult,
  EffectiveMetricResult,
} from './effective';
import type { FormulaProcessReference } from './handoff';
import type {
  NormalizedProcess,
  NormalizedProcessSection,
  ProcessScalar,
} from './process';
import {
  resolvePrototypeCatalog,
  type PrototypeCatalogDiagnostic,
  type PrototypeCatalogLoadResult,
  type PrototypeCatalogReference,
  type PrototypeCatalogSnapshot,
  type PrototypeFeature,
  type PrototypeFeatureTarget,
  type PrototypeImportance,
  type PrototypeQualitativeBand,
  type PrototypePresenceTarget,
  type ResolvedPrototypeCatalogSnapshot,
  type ResolvedPrototypeDefinition,
} from './prototype-catalog';
import type {
  IntrinsicAnalysisResult,
  IntrinsicMetric,
  Provenance,
  SemanticClass,
  ValueState,
} from './types';

export type ClassificationFeatureGroup = 'composition' | 'intrinsic' | 'effective' | 'process';
export type ClassificationScalar = number | string | boolean;

export interface ClassificationFeature {
  id: string;
  group: ClassificationFeatureGroup;
  unit: string;
  state: ValueState<ClassificationScalar>;
  coverage: number;
  confidence: number;
  provenance: readonly Provenance[];
  sourcePaths: readonly string[];
  semanticClass?: SemanticClass;
  qualitativeBand?: PrototypeQualitativeBand;
}

export interface ClassificationFeatureSet {
  featureSetVersion: typeof CLASSIFICATION_FEATURE_SET_VERSION;
  formulaId: string;
  processId: string;
  formulaRevision: number;
  processRevision: number;
  referenceVersion: FormulaProcessReference['referenceVersion'];
  prototypeCatalog: PrototypeCatalogReference;
  features: readonly ClassificationFeature[];
  coverage: number;
  confidence: number;
  provenance: readonly Provenance[];
  modelVersions: {
    featureSet: typeof CLASSIFICATION_FEATURE_SET_VERSION;
    seedMatcher: typeof CLASSIFICATION_SEED_MODEL_VERSION;
    bandPolicy: typeof CLASSIFICATION_BAND_POLICY_VERSION;
    composition: string;
    process: string;
    effective: string;
    prototype: string;
  };
}

export type ClassificationFeatureDiagnosticCode =
  | 'INVALID_FEATURE_SNAPSHOT'
  | 'MODEL_UNAVAILABLE'
  | 'INVALID_CATALOG'
  | 'STALE_FEATURE_INPUT';

export interface ClassificationFeatureDiagnostic {
  code: ClassificationFeatureDiagnosticCode;
  severity: 'error' | 'warning';
  path: string;
  messageKey: string;
  resolutionKey: string;
  parameters: Record<string, string | number>;
}

export type ClassificationFeatureSetResult =
  | { status: 'ready'; data: ClassificationFeatureSet; diagnostics: readonly [] }
  | { status: 'invalid'; diagnostics: readonly ClassificationFeatureDiagnostic[] }
  | { status: 'unavailable'; diagnostic: ClassificationFeatureDiagnostic };

export interface ClassificationFeatureSetInput {
  reference: FormulaProcessReference;
  intrinsic: IntrinsicAnalysisResult;
  effective: EffectiveAnalysisResult;
  catalog: PrototypeCatalogLoadResult;
}

export type FeatureEvaluationStatus = 'matched' | 'mismatched' | 'unknown' | 'not_applicable';

export interface ClassificationFeatureEvaluation {
  featureId: string;
  kind: 'feature' | 'constraint';
  importance: PrototypeImportance;
  target: PrototypeFeatureTarget;
  status: FeatureEvaluationStatus;
  observedValue?: ClassificationScalar;
  observedBand?: PrototypeQualitativeBand;
  sourcePaths: readonly string[];
  origin?: 'own' | 'inherited';
  sourcePrototypeId?: string;
  inheritedFrom?: readonly string[];
}

export interface ClassificationInheritedRule {
  featureId: string;
  sourcePrototypeId: string;
  inheritedFrom: readonly string[];
}

export interface FamilyMembership {
  familyId: string;
  status: 'supported' | 'partial' | 'conflicted' | 'unavailable';
  coverage: number;
  confidence: number;
  evidence: readonly ClassificationFeatureEvaluation[];
}

export type PrototypeSimilarityStatus = 'candidate' | 'supported' | 'conflicted' | 'unavailable';

export interface PrototypeSimilarity {
  prototypeId: string;
  compositionSimilarity?: number;
  processSimilarity?: number;
  overallIdentitySimilarity?: number;
  confidence: number;
  coverage: number;
  status: PrototypeSimilarityStatus;
  modelVersion: typeof CLASSIFICATION_SCORE_POLICY_VERSION;
  evaluatedFeatures: readonly ClassificationFeatureEvaluation[];
}

export const CLASSIFICATION_DISPLAY_LIMIT = 8;

const FAMILY_STATUS_PRIORITY: Record<FamilyMembership['status'], number> = {
  supported: 4,
  partial: 3,
  conflicted: 2,
  unavailable: 1,
};

const PROTOTYPE_STATUS_PRIORITY: Record<PrototypeSimilarityStatus, number> = {
  supported: 4,
  candidate: 3,
  conflicted: 2,
  unavailable: 1,
};

export function topFamilyMemberships(
  families: readonly FamilyMembership[],
  limit = CLASSIFICATION_DISPLAY_LIMIT,
): FamilyMembership[] {
  return families
    .map((family, index) => ({ family, index }))
    .sort((left, right) => {
      const statusDifference = FAMILY_STATUS_PRIORITY[right.family.status] - FAMILY_STATUS_PRIORITY[left.family.status];
      if (statusDifference !== 0) return statusDifference;
      const coverageDifference = right.family.coverage - left.family.coverage;
      if (coverageDifference !== 0) return coverageDifference;
      const confidenceDifference = right.family.confidence - left.family.confidence;
      if (confidenceDifference !== 0) return confidenceDifference;
      return left.index - right.index;
    })
    .slice(0, Math.max(0, limit))
    .map(({ family }) => family);
}

function prototypeRelevance(candidate: PrototypeSimilarity): number {
  return candidate.overallIdentitySimilarity
    ?? Math.max(candidate.compositionSimilarity ?? -1, candidate.processSimilarity ?? -1);
}

export function topPrototypeSimilarities(
  candidates: readonly PrototypeSimilarity[],
  limit = CLASSIFICATION_DISPLAY_LIMIT,
): PrototypeSimilarity[] {
  return candidates
    .map((candidate, index) => ({ candidate, index }))
    .sort((left, right) => {
      const relevanceDifference = prototypeRelevance(right.candidate) - prototypeRelevance(left.candidate);
      if (relevanceDifference !== 0) return relevanceDifference;
      const statusDifference = PROTOTYPE_STATUS_PRIORITY[right.candidate.status] - PROTOTYPE_STATUS_PRIORITY[left.candidate.status];
      if (statusDifference !== 0) return statusDifference;
      const coverageDifference = right.candidate.coverage - left.candidate.coverage;
      if (coverageDifference !== 0) return coverageDifference;
      const confidenceDifference = right.candidate.confidence - left.candidate.confidence;
      if (confidenceDifference !== 0) return confidenceDifference;
      return left.index - right.index;
    })
    .slice(0, Math.max(0, limit))
    .map(({ candidate }) => candidate);
}

export type ClassificationOutcomeKind = 'strong_match' | 'structural_match' | 'hybrid' | 'no_strong_canonical_match' | 'partial';

export type ClassificationDiagnosticCode =
  | 'INVALID_FEATURE_SNAPSHOT'
  | 'MODEL_UNAVAILABLE'
  | 'INSUFFICIENT_EVIDENCE'
  | 'CONSTRAINT_CONFLICT'
  | 'STALE_ANALYSIS';

export interface ClassificationDiagnostic {
  code: ClassificationDiagnosticCode;
  severity: 'error' | 'warning' | 'info';
  path: string;
  messageKey: string;
  resolutionKey: string;
  parameters: Record<string, string | number>;
}

export interface ClassificationExplanation {
  primaryPrototypeId?: string;
  positiveFeatures: readonly ClassificationFeatureEvaluation[];
  limitingFeatures: readonly ClassificationFeatureEvaluation[];
  missingFeatures: readonly string[];
  conflicts: readonly ClassificationFeatureEvaluation[];
  inheritedRules: readonly ClassificationInheritedRule[];
  identityModifiers: readonly ClassificationFeatureEvaluation[];
  provenance: readonly Provenance[];
  modelVersion: string;
}

export interface ClassificationResult {
  outcome: ClassificationOutcomeKind;
  families: readonly FamilyMembership[];
  candidates: readonly PrototypeSimilarity[];
  confidence: number;
  coverage: number;
  explanation: ClassificationExplanation;
  modelVersion: string;
  diagnostics: readonly ClassificationDiagnostic[];
}

export interface ClassificationOutcomeInput {
  featureSet: ClassificationFeatureSet;
  families: readonly FamilyMembership[];
  candidates: readonly PrototypeSimilarity[];
  diagnostics: readonly ClassificationDiagnostic[];
}

export interface ClassifyFormulaInput {
  reference: FormulaProcessReference;
  intrinsic: IntrinsicAnalysisResult;
  effective: EffectiveAnalysisResult;
  catalog: PrototypeCatalogLoadResult;
}

const DERIVED_PROVENANCE: Provenance = {
  kind: 'derived',
  method: CLASSIFICATION_FEATURE_SET_VERSION,
  modelVersion: CLASSIFICATION_SEED_MODEL_VERSION,
};

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function round(value: number, decimals = 3): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function uniqueProvenance(values: readonly Provenance[]): Provenance[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = [value.kind, value.sourceId ?? '', value.sourceVersion ?? '', value.method ?? '', value.modelVersion ?? ''].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function featureDiagnostic(
  code: ClassificationFeatureDiagnosticCode,
  path: string,
  messageKey: string,
  resolutionKey: string,
  parameters: Record<string, string | number> = {},
  severity: 'error' | 'warning' = 'error',
): ClassificationFeatureDiagnostic {
  return { code, severity, path, messageKey, resolutionKey, parameters };
}

function catalogDiagnostic(item: PrototypeCatalogDiagnostic): ClassificationFeatureDiagnostic {
  return featureDiagnostic(
    item.code === 'CATALOG_VERSION_UNAVAILABLE' || item.code === 'MODEL_VERSION_UNAVAILABLE'
      ? 'MODEL_UNAVAILABLE'
      : 'INVALID_CATALOG',
    item.path,
    item.messageKey,
    'classification.diagnostic.refreshCatalog',
    item.parameters,
  );
}

function intrinsicMetric(metrics: IntrinsicAnalysisResult, key: IntrinsicMetric['key']): IntrinsicMetric | undefined {
  return metrics.metrics.find((metric) => metric.key === key);
}

function effectiveMetric(metrics: EffectiveAnalysisResult, key: EffectiveMetricResult['key']): EffectiveMetricResult | undefined {
  return metrics.metrics.find((metric) => metric.key === key);
}

function stateFromMetric(
  metric: IntrinsicMetric | EffectiveMetricResult | undefined,
  value: number | undefined = metric?.value,
  allowPartial = false,
): ValueState<number> {
  if (!metric || metric.status === 'not_applicable') return { state: 'none' };
  if (value === undefined || metric.status === 'unavailable' || (!allowPartial && metric.status === 'partial')) {
    return { state: 'unknown', reasonCode: metric.status === 'unavailable' ? 'metric-unavailable' : 'value-not-supplied' };
  }
  return {
    state: 'known',
    value,
    provenance: metric.provenance[0] ?? DERIVED_PROVENANCE,
    confidence: clamp(metric.confidence),
  };
}

function metricFeature(
  id: string,
  group: ClassificationFeatureGroup,
  metric: IntrinsicMetric | EffectiveMetricResult | undefined,
  sourcePath: string,
  options: { value?: number; useRelative?: boolean; allowPartial?: boolean } = {},
): ClassificationFeature {
  const value = options.useRelative && metric && 'relativeValue' in metric
    ? metric.relativeValue
    : options.value ?? metric?.value;
  const state = stateFromMetric(metric, value, options.allowPartial ?? false);
  const provenance = metric ? uniqueProvenance(metric.provenance) : [DERIVED_PROVENANCE];
  return {
    id,
    group,
    unit: metric?.unit ?? 'unknown',
    state,
    coverage: metric?.coverage ?? 0,
    confidence: metric?.confidence ?? 0,
    provenance,
    sourcePaths: [sourcePath],
    semanticClass: metric?.semanticClass,
    ...(state.state === 'known' && typeof state.value === 'number'
      ? { qualitativeBand: qualitativeBandFor(id, state.value) }
      : {}),
  };
}

function metricRatioFeature(
  id: string,
  group: ClassificationFeatureGroup,
  numerator: IntrinsicMetric | EffectiveMetricResult | undefined,
  denominator: IntrinsicMetric | EffectiveMetricResult | undefined,
  sourcePaths: readonly string[],
): ClassificationFeature {
  const numeratorState = stateFromMetric(numerator);
  const denominatorState = stateFromMetric(denominator);
  const state: ValueState<number> = numeratorState.state === 'known' && denominatorState.state === 'known' && denominatorState.value > 0
    ? {
        state: 'known',
        value: round((numeratorState.value / denominatorState.value) * 100, 2),
        provenance: numeratorState.provenance,
        confidence: Math.min(numeratorState.confidence, denominatorState.confidence),
      }
    : numeratorState.state === 'none' || denominatorState.state === 'none'
      ? { state: 'none' }
      : { state: 'unknown', reasonCode: 'ratio-prerequisite-missing' };
  const coverage = Math.min(numerator?.coverage ?? 0, denominator?.coverage ?? 0);
  const confidence = Math.min(numerator?.confidence ?? 0, denominator?.confidence ?? 0);
  return {
    id,
    group,
    unit: '%',
    state,
    coverage,
    confidence,
    provenance: uniqueProvenance([
      ...(numerator?.provenance ?? []),
      ...(denominator?.provenance ?? []),
      DERIVED_PROVENANCE,
    ]),
    sourcePaths,
    semanticClass: 'estimated',
    ...(state.state === 'known' ? { qualitativeBand: qualitativeBandFor(id, state.value) } : {}),
  };
}

function processState(process: NormalizedProcess, path: string): ValueState<ProcessScalar> {
  if (path === 'ingredientAddition.fatIncorporationMode') return process.ingredientAddition.fatIncorporationMode;
  const [section, field] = path.split('.') as [keyof NormalizedProcess, string];
  const value = (process[section] as NormalizedProcessSection | undefined)?.[field];
  return value ?? { state: 'unknown', reasonCode: 'process-field-not-supplied' };
}

function processFeature(
  id: string,
  path: string,
  process: NormalizedProcess,
  unit = 'categorical',
): ClassificationFeature {
  const state = processState(process, path);
  const confidence = state.state === 'known' ? clamp(state.confidence) : state.state === 'none' ? 1 : 0;
  const provenance = state.state === 'known' ? [state.provenance] : [DERIVED_PROVENANCE];
  return {
    id,
    group: 'process',
    unit,
    state,
    coverage: state.state === 'unknown' ? 0 : 1,
    confidence,
    provenance: uniqueProvenance(provenance),
    sourcePaths: [path],
  };
}

function presenceFeature(
  id: string,
  path: string,
  process: NormalizedProcess,
  isPresent: (value: ProcessScalar) => boolean,
): ClassificationFeature {
  const source = processState(process, path);
  const state: ValueState<'present' | 'absent'> = source.state === 'known'
    ? {
        state: 'known',
        value: isPresent(source.value) ? 'present' : 'absent',
        provenance: source.provenance,
        confidence: clamp(source.confidence),
      }
    : source.state === 'none'
      ? { state: 'none' }
      : { state: 'unknown', reasonCode: source.reasonCode };
  return {
    id,
    group: 'process',
    unit: 'presence',
    state,
    coverage: state.state === 'unknown' ? 0 : 1,
    confidence: state.state === 'known' ? state.confidence : state.state === 'none' ? 1 : 0,
    provenance: state.state === 'known' ? [state.provenance] : [DERIVED_PROVENANCE],
    sourcePaths: [path],
  };
}

function presenceFromStates(
  id: string,
  paths: readonly string[],
  states: readonly ValueState<ProcessScalar>[],
  isPresent: (value: ProcessScalar) => boolean,
): ClassificationFeature {
  const known = states.filter((state): state is Extract<ValueState<ProcessScalar>, { state: 'known' }> => state.state === 'known');
  const unknown = states.some((state) => state.state === 'unknown');
  const state: ValueState<'present' | 'absent'> = known.some((item) => isPresent(item.value))
    ? {
        state: 'known',
        value: 'present',
        provenance: known[0].provenance,
        confidence: Math.min(...known.map((item) => clamp(item.confidence))),
      }
    : unknown
      ? { state: 'unknown', reasonCode: 'presence-prerequisite-missing' }
      : states.every((item) => item.state === 'none')
        ? { state: 'none' }
        : {
            state: 'known',
            value: 'absent',
            provenance: known[0]?.provenance ?? DERIVED_PROVENANCE,
            confidence: known.length > 0 ? Math.min(...known.map((item) => clamp(item.confidence))) : 1,
          };
  return {
    id,
    group: 'process',
    unit: 'presence',
    state,
    coverage: state.state === 'unknown' ? 0 : 1,
    confidence: state.state === 'known' ? state.confidence : state.state === 'none' ? 1 : 0,
    provenance: state.state === 'known' ? [state.provenance] : [DERIVED_PROVENANCE],
    sourcePaths: paths,
  };
}

function derivedThermalGeometry(process: NormalizedProcess): ClassificationFeature {
  const shape = processState(process, 'geometry.shapeClass');
  const method = processState(process, 'thermalProcess.method');
  const knownShape = shape.state === 'known' ? String(shape.value) : undefined;
  const knownMethod = method.state === 'known' ? String(method.value) : undefined;
  const value = knownShape === 'crepe' || knownShape === 'thin_sheet'
    ? 'thin_sheet'
    : knownShape === 'waffle' || knownMethod === 'waffle_iron'
      ? 'waffle'
      : knownMethod === 'deep_fry'
        ? 'deep_fry'
        : knownMethod === 'shallow_fry'
          ? 'shallow_fry'
          : knownMethod === 'static_oven' || knownMethod === 'fan_oven' || knownMethod === 'steam_oven'
            || knownShape === 'custard' || knownShape === 'popover' || knownShape === 'dutch_baby'
            || knownShape === 'yorkshire_pudding' || knownShape === 'steam_puffed'
            || knownShape === 'cake' || knownShape === 'muffin'
            ? 'oven'
            : knownMethod === 'griddle'
              ? 'griddle'
              : knownMethod === 'pan' || knownShape === 'pancake' || knownShape === 'souffle_pancake'
                ? 'pan'
                : undefined;
  const state: ValueState<string> = value
    ? {
        state: 'known',
        value,
        provenance: (shape.state === 'known' ? shape.provenance : method.state === 'known' ? method.provenance : DERIVED_PROVENANCE),
        confidence: Math.min(
          shape.state === 'known' ? shape.confidence : 1,
          method.state === 'known' ? method.confidence : 1,
        ),
      }
    : shape.state === 'none' && method.state === 'none'
      ? { state: 'none' }
      : { state: 'unknown', reasonCode: 'thermal-geometry-not-resolved' };
  return {
    id: 'thermal_geometry',
    group: 'process',
    unit: 'compatibility',
    state,
    coverage: state.state === 'unknown' ? 0 : 1,
    confidence: state.state === 'known' ? state.confidence : state.state === 'none' ? 1 : 0,
    provenance: state.state === 'known' ? [state.provenance] : [DERIVED_PROVENANCE],
    sourcePaths: ['geometry.shapeClass', 'thermalProcess.method'],
  };
}

function buildFeatures(
  reference: FormulaProcessReference,
  intrinsic: IntrinsicAnalysisResult,
  effective: EffectiveAnalysisResult,
): ClassificationFeature[] {
  const features: ClassificationFeature[] = [];
  const add = (feature: ClassificationFeature): void => {
    if (!features.some((item) => item.id === feature.id)) features.push(feature);
  };
  add(metricFeature('effective_gluten', 'effective', effectiveMetric(effective, 'effectiveGluten'), 'effective.effectiveGluten', { allowPartial: true }));
  add(metricFeature('layer_integrity', 'effective', effectiveMetric(effective, 'laminationIntegrity'), 'effective.laminationIntegrity', { allowPartial: true }));
  add(metricFeature('setting_capacity', 'effective', effectiveMetric(effective, 'settingTendency'), 'effective.settingTendency', { allowPartial: true }));
  add(metricFeature('gas_retention', 'effective', effectiveMetric(effective, 'gasRetention'), 'effective.gasRetention', { allowPartial: true }));
  add(metricFeature('surface_dehydration', 'effective', effectiveMetric(effective, 'moistureLossTendency'), 'effective.moistureLossTendency', { allowPartial: true }));
  add(metricFeature('relative_hydration', 'intrinsic', intrinsicMetric(intrinsic, 'effectiveHydration'), 'intrinsic.effectiveHydration'));
  add(metricFeature('enrichment', 'intrinsic', intrinsicMetric(intrinsic, 'enrichment'), 'intrinsic.enrichment'));
  add(metricFeature('fluidity', 'intrinsic', intrinsicMetric(intrinsic, 'fluidity'), 'intrinsic.fluidity'));
  add(metricFeature('fat_load', 'composition', intrinsicMetric(intrinsic, 'fat'), 'intrinsic.fat', { useRelative: true }));
  add(metricFeature('sugar_load', 'composition', intrinsicMetric(intrinsic, 'sugar'), 'intrinsic.sugar', { useRelative: true }));
  add(metricFeature('egg_solids', 'composition', intrinsicMetric(intrinsic, 'eggSolids'), 'intrinsic.eggSolids', { useRelative: true }));
  add(metricFeature('egg_protein', 'composition', intrinsicMetric(intrinsic, 'eggSolids'), 'intrinsic.eggSolids', { useRelative: true }));
  add(metricFeature('water_load', 'composition', intrinsicMetric(intrinsic, 'water'), 'intrinsic.water', { useRelative: true }));
  add(metricRatioFeature(
    'available_water',
    'composition',
    intrinsicMetric(intrinsic, 'effectiveWater'),
    intrinsicMetric(intrinsic, 'flourDenominator'),
    ['intrinsic.effectiveWater', 'intrinsic.flourDenominator'],
  ));
  add(processFeature('mixing_method', 'mixing.method', reference.process));
  add(processFeature('mixing_intensity', 'mixing.intensity', reference.process, 'ratio'));
  add(processFeature('mixing_target', 'mixing.targetDevelopment', reference.process));
  add(processFeature('fat_incorporation', 'ingredientAddition.fatIncorporationMode', reference.process));
  add(processFeature('fermentation_agent', 'fermentation.agent', reference.process));
  add(processFeature('aeration_method', 'aeration.method', reference.process));
  add(processFeature('thermal_method', 'thermalProcess.method', reference.process));
  add(processFeature('surface_treatment', 'thermalProcess.surfaceTreatment', reference.process));
  add(processFeature('shape_class', 'geometry.shapeClass', reference.process));
  add(processFeature('container_type', 'geometry.containerType', reference.process));
  add(processFeature('steam_level', 'thermalProcess.steamLevel', reference.process, 'ratio'));
  add(presenceFeature('fermentation', 'fermentation.agent', reference.process, (value) => value !== 'none'));
  add(presenceFeature('yeast_or_sourdough', 'fermentation.agent', reference.process, (value) => value === 'commercial_yeast' || value === 'sourdough' || value === 'mixed'));
  add(presenceFeature('yeast_fermentation', 'fermentation.agent', reference.process, (value) => value === 'commercial_yeast' || value === 'mixed'));
  add(presenceFeature('lamination', 'lamination.enabled', reference.process, (value) => value === true || value === 'true'));
  add(presenceFromStates(
    'layer_fat',
    ['lamination.laminationFat', 'lamination.layerFatPercentage'],
    [processState(reference.process, 'lamination.laminationFat'), processState(reference.process, 'lamination.layerFatPercentage')],
    (value) => typeof value === 'number' ? value > 0 : value !== '',
  ));
  add(presenceFeature('mechanical_aeration', 'aeration.method', reference.process, (value) => value !== 'none'));
  add(presenceFeature('egg_white_foam', 'aeration.method', reference.process, (value) => value === 'egg_white_whip'));
  add(presenceFromStates(
    'steam_leavening',
    ['thermalProcess.method', 'geometry.shapeClass'],
    [processState(reference.process, 'thermalProcess.method'), processState(reference.process, 'geometry.shapeClass')],
    (value) => value === 'steam_oven' || value === 'boil_then_bake' || value === 'dutch_baby'
      || value === 'yorkshire_pudding' || value === 'popover' || value === 'steam_puffed',
  ));
  add(processFeature('batter_consistency', 'lamination.doughState', reference.process));
  add(presenceFeature('pourable_batter', 'lamination.doughState', reference.process, (value) => value === 'thin_pourable_batter' || value === 'thick_batter'));
  add(presenceFeature('strong_gluten_development', 'mixing.targetDevelopment', reference.process, (value) => value === 'full'));
  add(presenceFeature('gluten_structure', 'mixing.targetDevelopment', reference.process, (value) => value === 'partial' || value === 'full'));
  add(presenceFeature('suppressed_gluten', 'mixing.targetDevelopment', reference.process, (value) => value === 'minimal'));
  add(derivedThermalGeometry(reference.process));
  return features;
}

function validReference(
  reference: FormulaProcessReference,
  intrinsic: IntrinsicAnalysisResult,
  effective: EffectiveAnalysisResult,
): ClassificationFeatureDiagnostic[] {
  const diagnostics: ClassificationFeatureDiagnostic[] = [];
  if (reference.formulaId !== effective.formulaId || reference.processId !== effective.processId) {
    diagnostics.push(featureDiagnostic(
      'INVALID_FEATURE_SNAPSHOT',
      'reference',
      'classification.diagnostic.invalidSnapshot',
      'classification.diagnostic.refreshAnalysis',
    ));
  }
  if (
    intrinsic.formulaRevision !== reference.formulaRevision
    || effective.formulaRevision !== reference.formulaRevision
    || effective.processRevision !== reference.processRevision
  ) {
    diagnostics.push(featureDiagnostic(
      'STALE_FEATURE_INPUT',
      'revision',
      'classification.diagnostic.staleInput',
      'classification.diagnostic.refreshAnalysis',
      {
        formulaRevision: reference.formulaRevision,
        processRevision: reference.processRevision,
      },
    ));
  }
  return diagnostics;
}

export function buildClassificationFeatureSet(input: ClassificationFeatureSetInput): ClassificationFeatureSetResult {
  const { reference, intrinsic, effective, catalog } = input;
  if (catalog.status === 'unavailable') {
    return { status: 'unavailable', diagnostic: catalogDiagnostic(catalog.diagnostic) };
  }
  if (catalog.status === 'invalid') {
    return { status: 'invalid', diagnostics: catalog.diagnostics.map(catalogDiagnostic) };
  }
  const resolved = resolvePrototypeCatalog(catalog.snapshot);
  if (resolved.status !== 'resolved') {
    return { status: 'invalid', diagnostics: resolved.diagnostics.map(catalogDiagnostic) };
  }
  const referenceDiagnostics = validReference(reference, intrinsic, effective);
  if (referenceDiagnostics.length > 0) return { status: 'invalid', diagnostics: referenceDiagnostics };

  const features = buildFeatures(reference, intrinsic, effective);
  const featureCoverage = features.length > 0 ? Math.min(...features.map((feature) => feature.coverage)) : 0;
  const featureConfidence = features.length > 0 ? Math.min(...features.map((feature) => feature.confidence)) : 0;
  const data: ClassificationFeatureSet = {
    featureSetVersion: CLASSIFICATION_FEATURE_SET_VERSION,
    formulaId: reference.formulaId,
    processId: reference.processId,
    formulaRevision: reference.formulaRevision,
    processRevision: reference.processRevision,
    referenceVersion: reference.referenceVersion,
    prototypeCatalog: resolved.snapshot.reference,
    features,
    coverage: round(Math.min(reference.coverage.composition, reference.coverage.process, featureCoverage)),
    confidence: round(Math.min(reference.confidence.composition, reference.confidence.process, featureConfidence)),
    provenance: uniqueProvenance([
      ...features.flatMap((feature) => feature.provenance),
      { kind: 'derived', method: reference.modelVersion, modelVersion: reference.modelVersion },
    ]),
    modelVersions: {
      featureSet: CLASSIFICATION_FEATURE_SET_VERSION,
      seedMatcher: CLASSIFICATION_SEED_MODEL_VERSION,
      bandPolicy: CLASSIFICATION_BAND_POLICY_VERSION,
      composition: intrinsic.modelVersion,
      process: reference.process.modelVersion,
      effective: effective.modelVersion,
      prototype: resolved.snapshot.reference.modelVersion,
    },
  };
  return { status: 'ready', data, diagnostics: [] };
}

function featureById(set: ClassificationFeatureSet, id: string): ClassificationFeature | undefined {
  return set.features.find((feature) => feature.id === id);
}

export function getClassificationFeature(set: ClassificationFeatureSet, id: string): ClassificationFeature | undefined {
  return featureById(set, id);
}

function expectedPresence(target: PrototypePresenceTarget): 'present' | 'absent' | 'optional' {
  if (target === 'absent' || target === 'none_or_low') return 'absent';
  if (target === 'optional') return 'optional';
  return 'present';
}

function evaluateTarget(
  feature: ClassificationFeature | undefined,
  target: PrototypeFeatureTarget,
): Pick<ClassificationFeatureEvaluation, 'status' | 'observedValue' | 'observedBand' | 'sourcePaths'> {
  if (!feature) return { status: 'unknown', sourcePaths: [] };
  if (feature.state.state === 'none') return { status: 'not_applicable', sourcePaths: feature.sourcePaths };
  if (feature.state.state === 'unknown') return { status: 'unknown', sourcePaths: feature.sourcePaths };
  const observedValue = feature.state.value;
  if (target.kind === 'presence') {
    const observed = observedValue === true || observedValue === 'present' ? 'present' : observedValue === false || observedValue === 'absent' ? 'absent' : undefined;
    const expected = expectedPresence(target.value);
    return {
      status: observed === undefined || expected === 'optional' || observed === expected ? 'matched' : 'mismatched',
      observedValue,
      sourcePaths: feature.sourcePaths,
    };
  }
  if (target.kind === 'compatibility') {
    return {
      status: typeof observedValue === 'string' && target.values.includes(observedValue) ? 'matched' : 'mismatched',
      observedValue,
      sourcePaths: feature.sourcePaths,
    };
  }
  const observedBand = feature.qualitativeBand;
  if (!observedBand) return { status: 'unknown', observedValue, sourcePaths: feature.sourcePaths };
  if (target.kind === 'band') {
    return { status: observedBand === target.value ? 'matched' : 'mismatched', observedValue, observedBand, sourcePaths: feature.sourcePaths };
  }
  const order: PrototypeQualitativeBand[] = ['very_low', 'low', 'medium', 'high', 'very_high'];
  const observedIndex = order.indexOf(observedBand);
  return {
    status: observedIndex >= order.indexOf(target.min) && observedIndex <= order.indexOf(target.max) ? 'matched' : 'mismatched',
    observedValue,
    observedBand,
    sourcePaths: feature.sourcePaths,
  };
}

function resolvedCatalog(catalog: PrototypeCatalogSnapshot | ResolvedPrototypeCatalogSnapshot): ResolvedPrototypeCatalogSnapshot | null {
  if ('byId' in catalog) return catalog;
  const result = resolvePrototypeCatalog(catalog);
  return result.status === 'resolved' ? result.snapshot : null;
}

function featureOrigin(feature: PrototypeFeature): Pick<ClassificationFeatureEvaluation, 'origin' | 'sourcePrototypeId' | 'inheritedFrom'> {
  const resolved = feature as PrototypeFeature & {
    origin?: 'own' | 'inherited';
    sourcePrototypeId?: string;
    inheritedFrom?: readonly string[];
  };
  return resolved.origin
    ? {
        origin: resolved.origin,
        sourcePrototypeId: resolved.sourcePrototypeId,
        inheritedFrom: resolved.inheritedFrom,
      }
    : {};
}

function declaredPrototypeEvidence(
  definition: ResolvedPrototypeDefinition,
): Array<{ feature: PrototypeFeature; kind: 'feature' | 'constraint' }> {
  const byId = new Map<string, { feature: PrototypeFeature; kind: 'feature' | 'constraint' }>();
  const add = (feature: PrototypeFeature, kind: 'feature' | 'constraint'): void => {
    const existing = byId.get(feature.id);
    if (!existing) {
      byId.set(feature.id, { feature, kind });
      return;
    }
    const existingOwn = featureOrigin(existing.feature).origin === 'own';
    const candidateOwn = featureOrigin(feature).origin === 'own';
    if (candidateOwn && !existingOwn) {
      byId.set(feature.id, { feature, kind });
      return;
    }
    if (candidateOwn === existingOwn && kind === 'constraint' && existing.kind === 'feature') {
      byId.set(feature.id, { feature, kind });
    }
  };
  definition.structuralFeatures.forEach((feature) => add(feature, 'feature'));
  definition.structuralConstraints.forEach((feature) => add(feature, 'constraint'));
  return [...byId.values()];
}

function evaluateDefinition(set: ClassificationFeatureSet, definition: ResolvedPrototypeDefinition): FamilyMembership {
  const declared = declaredPrototypeEvidence(definition);
  const evidence = declared.map(({ feature, kind }) => ({
    featureId: feature.id,
    kind,
    importance: feature.importance,
    target: feature.target,
    ...featureOrigin(feature),
    ...evaluateTarget(featureById(set, feature.id), feature.target),
  }));
  const known = evidence.filter((item) => item.status === 'matched' || item.status === 'mismatched');
  const conflicts = evidence.filter((item) => item.status === 'mismatched' && item.importance === 'critical');
  const mismatches = evidence.filter((item) => item.status === 'mismatched');
  const unknown = evidence.some((item) => item.status === 'unknown');
  const coverage = evidence.length === 0 ? 0 : round(known.length / evidence.length);
  const knownConfidences = evidence
    .map((item) => featureById(set, item.featureId))
    .filter((feature): feature is ClassificationFeature => feature?.state.state === 'known')
    .map((feature) => feature.confidence);
  const confidence = round(knownConfidences.length > 0 ? Math.min(set.confidence, ...knownConfidences) : 0);
  const status = conflicts.length > 0
    ? 'conflicted'
    : known.length === 0
      ? 'unavailable'
      : unknown || mismatches.length > 0
        ? 'partial'
        : 'supported';
  return { familyId: definition.id, status, coverage, confidence, evidence };
}

export function evaluateFamilyGates(
  set: ClassificationFeatureSet,
  catalog: PrototypeCatalogSnapshot | ResolvedPrototypeCatalogSnapshot,
): FamilyMembership[] {
  const resolved = resolvedCatalog(catalog);
  if (!resolved) return [];
  return resolved.definitions
    .filter((definition) => definition.kind === 'family')
    .map((definition) => evaluateDefinition(set, definition));
}

function similarityDimension(set: ClassificationFeatureSet, featureId: string): 'composition' | 'process' {
  const declared = CLASSIFICATION_FEATURE_DIMENSIONS[featureId];
  if (declared) return declared;
  return featureById(set, featureId)?.group === 'process' ? 'process' : 'composition';
}

function scoreEvidence(
  set: ClassificationFeatureSet,
  evidence: readonly ClassificationFeatureEvaluation[],
  dimension?: 'composition' | 'process',
): { score?: number; coverage: number; confidence: number } {
  const selected = dimension
    ? evidence.filter((item) => similarityDimension(set, item.featureId) === dimension)
    : evidence;
  if (selected.length === 0) return { coverage: 0, confidence: 0 };
  const evaluated = selected.filter((item) => item.status === 'matched' || item.status === 'mismatched');
  const totalWeight = evaluated.reduce((total, item) => total + CLASSIFICATION_IMPORTANCE_WEIGHTS[item.importance], 0);
  const matchWeight = evaluated.reduce(
    (total, item) => total + (item.status === 'matched' ? CLASSIFICATION_IMPORTANCE_WEIGHTS[item.importance] : 0),
    0,
  );
  const knownFeatures = evaluated
    .map((item) => featureById(set, item.featureId))
    .filter((feature): feature is ClassificationFeature => Boolean(feature));
  const confidence = round(knownFeatures.length > 0 ? Math.min(set.confidence, ...knownFeatures.map((feature) => feature.confidence)) : 0);
  return {
    ...(totalWeight > 0 ? { score: round(matchWeight / totalWeight) } : {}),
    coverage: round(evaluated.length / selected.length),
    confidence,
  };
}

function evaluatePrototype(
  set: ClassificationFeatureSet,
  definition: ResolvedPrototypeDefinition,
): PrototypeSimilarity {
  const declared = declaredPrototypeEvidence(definition);
  const evaluatedFeatures = declared.map(({ feature, kind }) => ({
    featureId: feature.id,
    kind,
    importance: feature.importance,
    target: feature.target,
    ...featureOrigin(feature),
    ...evaluateTarget(featureById(set, feature.id), feature.target),
  }));
  const composition = scoreEvidence(set, evaluatedFeatures, 'composition');
  const process = scoreEvidence(set, evaluatedFeatures, 'process');
  const overall = scoreEvidence(set, evaluatedFeatures);
  const criticalConflict = evaluatedFeatures.some((item) => item.status === 'mismatched' && item.importance === 'critical');
  const known = evaluatedFeatures.filter((item) => item.status === 'matched' || item.status === 'mismatched');
  const hasUnknown = evaluatedFeatures.some((item) => item.status === 'unknown' || item.status === 'not_applicable');
  const status: PrototypeSimilarityStatus = criticalConflict
    ? 'conflicted'
    : known.length === 0
      ? 'unavailable'
      : !hasUnknown && evaluatedFeatures.every((item) => item.status === 'matched')
        ? 'supported'
        : 'candidate';
  return {
    prototypeId: definition.id,
    ...(composition.score === undefined ? {} : { compositionSimilarity: composition.score }),
    ...(process.score === undefined ? {} : { processSimilarity: process.score }),
    ...(overall.score === undefined ? {} : { overallIdentitySimilarity: overall.score }),
    confidence: overall.confidence,
    coverage: overall.coverage,
    status,
    modelVersion: CLASSIFICATION_SCORE_POLICY_VERSION,
    evaluatedFeatures,
  };
}

export function evaluatePrototypeSimilarities(
  set: ClassificationFeatureSet,
  catalog: PrototypeCatalogSnapshot | ResolvedPrototypeCatalogSnapshot,
): PrototypeSimilarity[] {
  const resolved = resolvedCatalog(catalog);
  if (!resolved) return [];
  return resolved.definitions
    .filter((definition) => definition.kind === 'prototype')
    .map((definition) => evaluatePrototype(set, definition));
}

function emptyClassificationExplanation(modelVersion: string): ClassificationExplanation {
  return {
    positiveFeatures: [],
    limitingFeatures: [],
    missingFeatures: [],
    conflicts: [],
    inheritedRules: [],
    identityModifiers: [],
    provenance: [],
    modelVersion,
  };
}

export interface ExplainClassificationInput {
  featureSet: ClassificationFeatureSet;
  definition: ResolvedPrototypeDefinition;
  similarity: PrototypeSimilarity;
}

export function explainClassification(input: ExplainClassificationInput): ClassificationExplanation {
  const { featureSet, definition, similarity } = input;
  const positiveFeatures = similarity.evaluatedFeatures.filter((item) => item.status === 'matched');
  const limitingFeatures = similarity.evaluatedFeatures.filter((item) => item.status === 'mismatched');
  const missingFeatures = [...new Set(
    similarity.evaluatedFeatures
      .filter((item) => item.status === 'unknown' || item.status === 'not_applicable')
      .map((item) => item.featureId),
  )];
  const conflicts = limitingFeatures.filter((item) => item.importance === 'critical');
  const identityModifiers = definition.identityModifiers.map((feature) => ({
    featureId: feature.id,
    kind: 'feature' as const,
    importance: feature.importance,
    target: feature.target,
    ...featureOrigin(feature),
    ...evaluateTarget(featureById(featureSet, feature.id), feature.target),
  }));
  const inheritedRules = similarity.evaluatedFeatures
    .filter((item): item is ClassificationFeatureEvaluation & {
      origin: 'inherited';
      sourcePrototypeId: string;
      inheritedFrom: readonly string[];
    } => item.origin === 'inherited' && Boolean(item.sourcePrototypeId))
    .map((item) => ({
      featureId: item.featureId,
      sourcePrototypeId: item.sourcePrototypeId,
      inheritedFrom: item.inheritedFrom ?? [],
    }));
  const provenance = uniqueProvenance([
    ...featureSet.provenance,
    {
      kind: 'catalog',
      sourceId: definition.provenance.sourceId,
      sourceVersion: definition.provenance.sourceVersion,
      method: definition.provenance.method,
      modelVersion: similarity.modelVersion,
    },
  ]);
  return {
    primaryPrototypeId: definition.id,
    positiveFeatures,
    limitingFeatures,
    missingFeatures,
    conflicts,
    inheritedRules,
    identityModifiers,
    provenance,
    modelVersion: similarity.modelVersion,
  };
}

function classificationDiagnosticFromFeature(item: ClassificationFeatureDiagnostic): ClassificationDiagnostic {
  const code: ClassificationDiagnosticCode = item.code === 'MODEL_UNAVAILABLE'
    ? 'MODEL_UNAVAILABLE'
    : item.code === 'STALE_FEATURE_INPUT'
      ? 'STALE_ANALYSIS'
      : 'INVALID_FEATURE_SNAPSHOT';
  return {
    code,
    severity: item.severity,
    path: item.path,
    messageKey: item.messageKey,
    resolutionKey: item.resolutionKey,
    parameters: item.parameters,
  };
}

function addDiagnostic(
  diagnostics: ClassificationDiagnostic[],
  item: ClassificationDiagnostic,
): void {
  if (!diagnostics.some((existing) => existing.code === item.code && existing.path === item.path)) diagnostics.push(item);
}

function resultCoverage(input: ClassificationOutcomeInput): number {
  const available = [
    input.featureSet.coverage,
    ...input.families.filter((family) => family.status !== 'unavailable').map((family) => family.coverage),
    ...input.candidates.filter((candidate) => candidate.status !== 'unavailable').map((candidate) => candidate.coverage),
  ];
  return round(available.length > 0 ? Math.min(...available) : 0);
}

function resultConfidence(input: ClassificationOutcomeInput): number {
  const available = [
    input.featureSet.confidence,
    ...input.families.filter((family) => family.status !== 'unavailable').map((family) => family.confidence),
    ...input.candidates.filter((candidate) => candidate.status !== 'unavailable').map((candidate) => candidate.confidence),
  ];
  return round(available.length > 0 ? Math.min(...available) : 0);
}

export function resolveClassificationOutcome(input: ClassificationOutcomeInput): ClassificationResult {
  const diagnostics = [...input.diagnostics];
  const supportedCandidates = input.candidates.filter((candidate) => candidate.status === 'supported');
  const supportedFamilies = input.families.filter((family) => family.status === 'supported');
  const plausibleFamilies = input.families.filter((family) => family.status === 'supported' || family.status === 'partial');
  const hasConflict = input.families.some((family) => family.status === 'conflicted')
    || input.candidates.some((candidate) => candidate.status === 'conflicted');
  const hasUnknown = input.featureSet.features.some((feature) => feature.state.state === 'unknown');
  if (hasConflict) {
    addDiagnostic(diagnostics, {
      code: 'CONSTRAINT_CONFLICT',
      severity: 'warning',
      path: 'classification.constraints',
      messageKey: 'classification.diagnostic.constraintConflict',
      resolutionKey: 'classification.diagnostic.reviewConstraints',
      parameters: {},
    });
  }
  if (hasUnknown) {
    addDiagnostic(diagnostics, {
      code: 'INSUFFICIENT_EVIDENCE',
      severity: 'info',
      path: 'classification.features',
      messageKey: 'classification.diagnostic.insufficientEvidence',
      resolutionKey: 'classification.diagnostic.addEvidence',
      parameters: {},
    });
  }

  const outcome: ClassificationOutcomeKind = supportedCandidates.length > 1 || supportedFamilies.length > 1
    ? 'hybrid'
    : supportedCandidates.length === 1
      ? 'strong_match'
      : supportedFamilies.length > 0
        ? 'structural_match'
        : plausibleFamilies.length > 0 && !hasUnknown && !hasConflict
          ? 'structural_match'
          : hasUnknown || input.candidates.some((candidate) => candidate.status === 'candidate')
            ? 'partial'
            : 'no_strong_canonical_match';
  return {
    outcome,
    families: input.families,
    candidates: input.candidates,
    confidence: resultConfidence(input),
    coverage: resultCoverage(input),
    explanation: emptyClassificationExplanation(CLASSIFICATION_SCORE_POLICY_VERSION),
    modelVersion: CLASSIFICATION_SCORE_POLICY_VERSION,
    diagnostics,
  };
}

export function classifyFormula(input: ClassifyFormulaInput): ClassificationResult {
  const featureSet = buildClassificationFeatureSet(input);
  if (featureSet.status !== 'ready') {
    const diagnostics = featureSet.status === 'unavailable'
      ? [classificationDiagnosticFromFeature(featureSet.diagnostic)]
      : featureSet.diagnostics.map(classificationDiagnosticFromFeature);
    return {
      outcome: 'partial',
      families: [],
      candidates: [],
      confidence: 0,
      coverage: 0,
      explanation: emptyClassificationExplanation(CLASSIFICATION_SCORE_POLICY_VERSION),
      modelVersion: CLASSIFICATION_SCORE_POLICY_VERSION,
      diagnostics,
    };
  }
  if (input.catalog.status !== 'available') {
    return {
      outcome: 'partial',
      families: [],
      candidates: [],
      confidence: 0,
      coverage: 0,
      explanation: emptyClassificationExplanation(CLASSIFICATION_SCORE_POLICY_VERSION),
      modelVersion: CLASSIFICATION_SCORE_POLICY_VERSION,
      diagnostics: [],
    };
  }
  const families = evaluateFamilyGates(featureSet.data, input.catalog.snapshot);
  const candidates = evaluatePrototypeSimilarities(featureSet.data, input.catalog.snapshot);
  const result = resolveClassificationOutcome({
    featureSet: featureSet.data,
    families,
    candidates,
    diagnostics: [],
  });
  const primary = candidates.find((candidate) => candidate.status === 'supported')
    ?? candidates.find((candidate) => candidate.status === 'candidate')
    ?? candidates.find((candidate) => candidate.status === 'conflicted');
  if (!primary) return result;
  const resolved = resolvedCatalog(input.catalog.snapshot);
  const definition = resolved?.byId[primary.prototypeId];
  return definition
    ? { ...result, explanation: explainClassification({ featureSet: featureSet.data, definition, similarity: primary }) }
    : result;
}
