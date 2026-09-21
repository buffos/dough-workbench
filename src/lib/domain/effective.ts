import type { FormulaProcessReference } from './handoff';
import type {
  IntrinsicAnalysisResult,
  IntrinsicMetric,
  IntrinsicMetricKey,
  Provenance,
  ValueState,
} from './types';
import type { NormalizedProcess, NormalizedProcessSection, ProcessScalar } from './process';

export const EFFECTIVE_BEHAVIOR_MODEL_VERSION = 'effective-behavior-seed-v2';

export type EffectiveOutcome = 'completed' | 'partial' | 'rejected' | 'conflict';
export type EffectiveMetricStatus = 'complete' | 'partial' | 'unavailable' | 'not_applicable';
export type EffectiveMetricKey =
  | 'effectiveGluten'
  | 'gasRetention'
  | 'fermentationSeverity'
  | 'proofTendency'
  | 'laminationIntegrity'
  | 'settingTendency'
  | 'moistureLossTendency'
  | 'processRisk'
  | 'effectiveFluidity';
export type EffectiveFeatureFamily =
  | 'mixing'
  | 'aeration'
  | 'fermentation'
  | 'addition_order'
  | 'lamination'
  | 'thermal'
  | 'geometry';
export type EffectiveContributionEffect = 'supports' | 'limits' | 'qualifies';

export interface FeatureContribution {
  featureKey: string;
  family: EffectiveFeatureFamily;
  path: string;
  state: 'known' | 'none';
  value: number;
  unit: 'score (0–1)';
  effect: EffectiveContributionEffect;
}

export interface EffectiveMetricExplanation {
  intrinsicBaseline?: number;
  featureContributions: FeatureContribution[];
  missingPrerequisites: string[];
  limitations: string[];
  parameters: Record<string, string | number>;
}

export interface EffectiveMetricResult {
  key: EffectiveMetricKey;
  value?: number;
  unit: string;
  semanticClass: 'calculated' | 'estimated' | 'heuristic';
  status: EffectiveMetricStatus;
  coverage: number;
  confidence: number;
  intrinsicMetricKey?: IntrinsicMetricKey;
  intrinsicValue?: number;
  delta?: number;
  provenance: Provenance[];
  limitationCodes: string[];
  featureContributions: FeatureContribution[];
  explanation: EffectiveMetricExplanation;
}

export type EffectiveDiagnosticCode =
  | 'STALE_PAIR'
  | 'REFERENCE_MISMATCH'
  | 'MISSING_PROCESS_EVIDENCE'
  | 'ADDITION_ORDER_NOT_RECORDED'
  | 'NO_SUPPORTED_EFFECTIVE_METRICS';

export interface EffectiveDiagnostic {
  code: EffectiveDiagnosticCode;
  severity: 'warning' | 'info';
  path: string;
  messageKey: string;
  resolutionKey: string;
  parameters: Record<string, string | number>;
}

export interface EffectiveAnalysisResult {
  outcome: EffectiveOutcome;
  formulaId: string;
  processId: string;
  formulaRevision: number;
  processRevision: number;
  modelVersion: typeof EFFECTIVE_BEHAVIOR_MODEL_VERSION;
  metrics: EffectiveMetricResult[];
  featureContributions: FeatureContribution[];
  diagnostics: EffectiveDiagnostic[];
  coverage: number;
  confidence: number;
  limitationCodes: string[];
}

export interface EffectiveAnalysisInput {
  reference: FormulaProcessReference;
  intrinsic: IntrinsicAnalysisResult;
  expectedFormulaRevision?: number;
  expectedProcessRevision?: number;
}

interface EvidenceItem {
  path: string;
  state: 'known' | 'none' | 'unknown';
  score?: number;
  confidence: number;
  weight: number;
}

interface FeatureScore {
  key: string;
  family: EffectiveFeatureFamily;
  score: number;
  coverage: number;
  confidence: number;
  missingPaths: string[];
  contributions: FeatureContribution[];
}

interface CombinedFeatureScore {
  score: number;
  coverage: number;
  confidence: number;
  missingPaths: string[];
  contributions: FeatureContribution[];
}

const DERIVED_PROVENANCE: Provenance = {
  kind: 'derived',
  method: EFFECTIVE_BEHAVIOR_MODEL_VERSION,
  modelVersion: EFFECTIVE_BEHAVIOR_MODEL_VERSION,
};

const MIXING_METHOD_SCORE: Record<string, number> = {
  minimal_combine: 0.15,
  hand_knead: 0.55,
  machine_knead: 0.78,
  spiral_mix: 0.86,
  planetary_hook: 0.74,
  paddle: 0.48,
  whisk: 0.24,
  stretch_and_fold: 0.52,
  coil_fold: 0.46,
  gentle_fold: 0.32,
  other: 0.4,
};

const AERATION_METHOD_SCORE: Record<string, number> = {
  none: 0,
  creaming: 0.72,
  whole_egg_whip: 0.78,
  egg_white_whip: 0.94,
  whipped_cream: 0.86,
  mechanical_beat: 0.58,
  other: 0.4,
};

const FERMENTATION_AGENT_SCORE: Record<string, number> = {
  none: 0,
  commercial_yeast: 0.68,
  sourdough: 0.74,
  mixed: 0.82,
  other: 0.55,
};

const DEVELOPMENT_TARGET_SCORE: Record<string, number> = {
  minimal: 0.2,
  partial: 0.55,
  full: 0.9,
};

const FOAM_TARGET_SCORE: Record<string, number> = {
  low: 0.3,
  medium: 0.6,
  high: 0.9,
};

const EXPANSION_TARGET_SCORE: Record<string, number> = {
  thirty_percent_increase: 0.3,
  fifty_percent_increase: 0.6,
  double: 0.95,
};

const POST_AERATION_HANDLING_SCORE: Record<string, number> = {
  gentle_fold: 0.82,
  moderate_fold: 0.58,
  vigorous_mix: 0.32,
};

const FAT_MODE_SCORE: Record<string, number> = {
  early_coating: 0.22,
  creamed: 0.44,
  melted: 0.28,
  late_incorporation: 0.82,
  cold_chunks: 0.76,
  laminated: 0.9,
  emulsified: 0.5,
  direct_mix: 0.34,
  other: 0.42,
};

const FOLD_SEQUENCE_SCORE: Record<string, number> = {
  single_fold: 0.55,
  double_fold: 0.84,
  other: 0.62,
};

const FAT_STATE_SCORE: Record<string, number> = {
  liquid: 0.3,
  plastic: 0.9,
  firm: 0.78,
  hard: 0.56,
  variable: 0.52,
  other: 0.6,
};

const DOUGH_STATE_SCORE: Record<string, number> = {
  rigid_mass: 0.5,
  stiff_dough: 0.62,
  soft_wet_dough: 0.7,
  thick_batter: 0.58,
  thin_pourable_batter: 0.36,
};

/**
 * A flour's gluten potential is not the same thing as the gluten structure
 * that a batter can actually develop. Batter states therefore attenuate the
 * intrinsic baseline before process work is applied. Unknown states retain
 * the previous baseline so missing process evidence never invents a state.
 */
const DOUGH_STATE_GLUTEN_RETENTION: Record<string, number> = {
  rigid_mass: 0.9,
  stiff_dough: 0.8,
  soft_wet_dough: 0.7,
  thick_batter: 0.5,
  thin_pourable_batter: 0.4,
};

const THERMAL_METHOD_SCORE: Record<string, number> = {
  static_oven: 0.72,
  fan_oven: 0.82,
  steam_oven: 0.78,
  air_fryer: 0.86,
  griddle: 0.58,
  pan: 0.52,
  waffle_iron: 0.9,
  deep_fry: 0.92,
  shallow_fry: 0.88,
  boil_then_bake: 0.68,
  other: 0.55,
};

const SURFACE_TREATMENT_SCORE: Record<string, number> = {
  none: 0.45,
  water: 0.54,
  egg_wash: 0.72,
  glaze: 0.68,
  oil_or_fat: 0.62,
  seeds_or_flour: 0.5,
  alkaline: 0.78,
  other: 0.5,
};

const SHAPE_SCORE: Record<string, number> = {
  loaf: 0.58,
  roll: 0.74,
  breadstick: 0.8,
  flatbread: 0.84,
  thin_sheet: 0.92,
  cookie: 0.86,
  cake: 0.46,
  muffin: 0.62,
  pancake: 0.88,
  crepe: 0.95,
  waffle: 0.9,
  fritter: 0.82,
  coating: 0.8,
  custard: 0.58,
  popover: 0.72,
  dutch_baby: 0.7,
  yorkshire_pudding: 0.7,
  steam_puffed: 0.7,
  souffle_pancake: 0.76,
  ring: 0.68,
  laminated_piece: 0.72,
  choux_piece: 0.62,
  other: 0.55,
};

const CONTAINER_SCORE: Record<string, number> = {
  freestanding: 0.56,
  baking_sheet: 0.78,
  loaf_tin: 0.46,
  cake_pan: 0.52,
  muffin_cup: 0.68,
  cast_iron: 0.62,
  baking_stone: 0.84,
  other: 0.55,
};

function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function round(value: number, decimals = 3): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function scoreTemperature(value: ProcessScalar, centre: number, tolerance: number): number {
  if (typeof value !== 'number') return 0.5;
  return clamp(1 - Math.abs(value - centre) / tolerance);
}

function scoreDuration(value: ProcessScalar, referenceSeconds: number): number {
  if (typeof value !== 'number') return 0.5;
  return clamp(value / referenceSeconds);
}

function scoreNumber(value: ProcessScalar, maximum: number): number {
  return typeof value === 'number' ? clamp(value / maximum) : 0.5;
}

function scoreBoolean(value: ProcessScalar, whenTrue: number, whenFalse: number): number {
  return typeof value === 'boolean' ? (value ? whenTrue : whenFalse) : 0.5;
}

function processValue(process: NormalizedProcess, path: string): ValueState<ProcessScalar> | undefined {
  const [section, field] = path.split('.') as [string, string];
  if (section === 'ingredientAddition') {
    if (field === 'fatIncorporationMode') return process.ingredientAddition.fatIncorporationMode;
    return undefined;
  }
  const container = process[section as keyof NormalizedProcess];
  if (!container || typeof container !== 'object' || Array.isArray(container)) return undefined;
  return (container as NormalizedProcessSection)[field];
}

function doughStateGlutenRetention(process: NormalizedProcess): number {
  const state = processValue(process, 'lamination.doughState');
  return state?.state === 'known' && typeof state.value === 'string'
    ? DOUGH_STATE_GLUTEN_RETENTION[state.value] ?? 1
    : 1;
}

function evidence(
  path: string,
  state: ValueState<ProcessScalar> | undefined,
  map: (value: ProcessScalar) => number,
  weight = 1,
  noneScore = 0,
): EvidenceItem {
  if (!state || state.state === 'unknown') {
    return { path, state: 'unknown', confidence: 0, weight };
  }
  if (state.state === 'none') {
    return { path, state: 'none', score: noneScore, confidence: 1, weight };
  }
  return {
    path,
    state: 'known',
    score: clamp(map(state.value)),
    confidence: state.confidence,
    weight,
  };
}

function feature(
  key: string,
  family: EffectiveFeatureFamily,
  items: EvidenceItem[],
): FeatureScore | null {
  const supported = items.filter((item) => item.score !== undefined);
  if (supported.length === 0) return null;
  const supportedWeight = supported.reduce((sum, item) => sum + item.weight, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const score = supported.reduce((sum, item) => sum + (item.score as number) * item.weight, 0) / supportedWeight;
  const confidence = supported.reduce((sum, item) => sum + item.confidence * item.weight, 0) / supportedWeight;
  const missingPaths = items.filter((item) => item.state === 'unknown').map((item) => item.path);
  const contributions: FeatureContribution[] = supported.map((item) => ({
    featureKey: key,
    family,
    path: item.path,
    state: item.state === 'none' ? 'none' : 'known',
    value: round(item.score as number),
    unit: 'score (0–1)',
    effect: (item.score as number) >= 0.65 ? 'supports' : (item.score as number) <= 0.35 ? 'limits' : 'qualifies',
  }));
  return {
    key,
    family,
    score: round(score),
    coverage: round(supportedWeight / totalWeight),
    confidence: round(confidence),
    missingPaths,
    contributions,
  };
}

function combine(features: Array<{ feature: FeatureScore; weight: number }>): CombinedFeatureScore | null {
  if (features.length === 0) return null;
  const totalWeight = features.reduce((sum, item) => sum + item.weight, 0);
  return {
    score: round(features.reduce((sum, item) => sum + item.feature.score * item.weight, 0) / totalWeight),
    coverage: round(features.reduce((sum, item) => sum + item.feature.coverage * item.weight, 0) / totalWeight),
    confidence: round(features.reduce((sum, item) => sum + item.feature.confidence * item.weight, 0) / totalWeight),
    missingPaths: unique(features.flatMap((item) => item.feature.missingPaths)),
    contributions: features.flatMap((item) => item.feature.contributions),
  };
}

function metricFromScore(
  key: EffectiveMetricKey,
  score: CombinedFeatureScore,
  unit: string,
  extraLimitations: string[] = [],
): EffectiveMetricResult {
  const missingPrerequisites = unique(score.missingPaths);
  const limitationCodes = unique([
    ...(missingPrerequisites.length > 0 ? ['MISSING_PROCESS_PREREQUISITE'] : []),
    ...extraLimitations,
  ]);
  return {
    key,
    value: round(score.score),
    unit,
    semanticClass: 'heuristic',
    status: missingPrerequisites.length > 0 ? 'partial' : 'complete',
    coverage: score.coverage,
    confidence: score.confidence,
    provenance: [DERIVED_PROVENANCE],
    limitationCodes,
    featureContributions: score.contributions,
    explanation: {
      featureContributions: score.contributions,
      missingPrerequisites,
      limitations: limitationCodes,
      parameters: { modelVersion: EFFECTIVE_BEHAVIOR_MODEL_VERSION },
    },
  };
}

function metricFromBaseline(
  key: EffectiveMetricKey,
  score: CombinedFeatureScore,
  baseline: IntrinsicMetric,
  value: number | undefined,
  unit: string,
  extraLimitations: string[] = [],
): EffectiveMetricResult {
  const missingPrerequisites = unique([
    ...score.missingPaths,
    ...baseline.explanation.missingEvidence.map((item) => `intrinsic.${item}`),
  ]);
  const limitationCodes = unique([
    ...(missingPrerequisites.length > 0 ? ['MISSING_PROCESS_PREREQUISITE'] : []),
    ...(baseline.value === undefined ? ['INTRINSIC_BASELINE_UNAVAILABLE'] : []),
    ...extraLimitations,
  ]);
  const status: EffectiveMetricStatus = value === undefined
    ? 'unavailable'
    : missingPrerequisites.length > 0 || baseline.status === 'partial'
      ? 'partial'
      : 'complete';
  return {
    key,
    ...(value === undefined ? {} : { value: round(value) }),
    unit,
    semanticClass: 'heuristic',
    status,
    coverage: round(Math.min(score.coverage, baseline.coverage)),
    confidence: round(Math.min(score.confidence, baseline.confidence)),
    intrinsicMetricKey: baseline.key,
    ...(baseline.value === undefined ? {} : { intrinsicValue: round(baseline.value) }),
    ...(value === undefined || baseline.value === undefined ? {} : { delta: round(value - baseline.value) }),
    provenance: [DERIVED_PROVENANCE, ...baseline.provenance],
    limitationCodes,
    featureContributions: score.contributions,
    explanation: {
      ...(baseline.value === undefined ? {} : { intrinsicBaseline: round(baseline.value) }),
      featureContributions: score.contributions,
      missingPrerequisites,
      limitations: limitationCodes,
      parameters: { modelVersion: EFFECTIVE_BEHAVIOR_MODEL_VERSION, intrinsicMetric: baseline.key },
    },
  };
}

function intrinsicMetric(result: IntrinsicAnalysisResult, key: IntrinsicMetricKey): IntrinsicMetric {
  return result.metrics.find((metric) => metric.key === key) ?? {
    key,
    unit: 'score (0–1)',
    semanticClass: 'heuristic',
    status: 'unavailable',
    coverage: 0,
    confidence: 0,
    provenance: [],
    contributors: [],
    limitationCodes: ['INTRINSIC_BASELINE_UNAVAILABLE'],
    explanation: { contributors: [], exclusions: [], missingEvidence: [`${key}:not-supplied`], parameters: {} },
  };
}

function conflictResult(input: EffectiveAnalysisInput, diagnostic: EffectiveDiagnostic): EffectiveAnalysisResult {
  const { reference, intrinsic } = input;
  return {
    outcome: 'conflict',
    formulaId: reference.formulaId,
    processId: reference.processId,
    formulaRevision: reference.formulaRevision,
    processRevision: reference.processRevision,
    modelVersion: EFFECTIVE_BEHAVIOR_MODEL_VERSION,
    metrics: [],
    featureContributions: [],
    diagnostics: [diagnostic],
    coverage: 0,
    confidence: Math.min(reference.confidence.composition, intrinsic.metrics.length > 0 ? 1 : 0),
    limitationCodes: ['STALE_PAIR'],
  };
}

function conflictDiagnostic(
  code: 'STALE_PAIR' | 'REFERENCE_MISMATCH',
  path: string,
  parameters: Record<string, string | number>,
): EffectiveDiagnostic {
  return {
    code,
    severity: 'warning',
    path,
    messageKey: code === 'STALE_PAIR' ? 'effective.diagnostic.stalePair' : 'effective.diagnostic.referenceMismatch',
    resolutionKey: code === 'STALE_PAIR' ? 'effective.diagnostic.refreshPair' : 'effective.diagnostic.correctReference',
    parameters,
  };
}

function mixingFeature(process: NormalizedProcess): FeatureScore | null {
  return feature('mixingWork', 'mixing', [
    evidence('mixing.method', processValue(process, 'mixing.method'), (value) => typeof value === 'string' ? MIXING_METHOD_SCORE[value] ?? 0.4 : 0.4),
    evidence('mixing.intensity', processValue(process, 'mixing.intensity'), (value) => scoreNumber(value, 1), 1.2),
    evidence('mixing.durationSeconds', processValue(process, 'mixing.durationSeconds'), (value) => scoreDuration(value, 600), 0.8),
    evidence('mixing.foldCount', processValue(process, 'mixing.foldCount'), (value) => scoreNumber(value, 4), 0.5),
    evidence('mixing.foldIntensity', processValue(process, 'mixing.foldIntensity'), (value) => scoreNumber(value, 1), 0.7),
    evidence('mixing.restDurationSeconds', processValue(process, 'mixing.restDurationSeconds'), (value) => scoreDuration(value, 1800), 0.35, 0.45),
    evidence('mixing.restType', processValue(process, 'mixing.restType'), () => 0.55, 0.25, 0.45),
    evidence('mixing.targetDevelopment', processValue(process, 'mixing.targetDevelopment'), (value) => typeof value === 'string' ? DEVELOPMENT_TARGET_SCORE[value] ?? 0.5 : 0.5, 0.65),
  ]);
}

function aerationFeature(process: NormalizedProcess): FeatureScore | null {
  return feature('aerationEfficiency', 'aeration', [
    evidence('aeration.method', processValue(process, 'aeration.method'), (value) => typeof value === 'string' ? AERATION_METHOD_SCORE[value] ?? 0.4 : 0.4),
    evidence('aeration.intensity', processValue(process, 'aeration.intensity'), (value) => scoreNumber(value, 1), 1.2),
    evidence('aeration.targetFoam', processValue(process, 'aeration.targetFoam'), (value) => typeof value === 'string' ? FOAM_TARGET_SCORE[value] ?? 0.5 : 0.5, 0.7),
    evidence('aeration.foamStability', processValue(process, 'aeration.foamStability'), (value) => scoreNumber(value, 1), 1.2),
    evidence('aeration.postAerationHandling', processValue(process, 'aeration.postAerationHandling'), (value) => typeof value === 'string' ? POST_AERATION_HANDLING_SCORE[value] ?? 0.5 : 0.5, 0.7),
  ]);
}

function fermentationFeature(process: NormalizedProcess): FeatureScore | null {
  return feature('fermentationConditions', 'fermentation', [
    evidence('fermentation.agent', processValue(process, 'fermentation.agent'), (value) => typeof value === 'string' ? FERMENTATION_AGENT_SCORE[value] ?? 0.55 : 0.55),
    evidence('fermentation.prefermentType', processValue(process, 'fermentation.prefermentType'), () => 0.6, 0.35, 0.45),
    evidence('fermentation.prefermentPercentage', processValue(process, 'fermentation.prefermentPercentage'), (value) => scoreNumber(value, 1), 0.8),
    evidence('fermentation.bulkTimeSeconds', processValue(process, 'fermentation.bulkTimeSeconds'), (value) => scoreDuration(value, 7200), 1.1),
    evidence('fermentation.bulkTemperatureCelsius', processValue(process, 'fermentation.bulkTemperatureCelsius'), (value) => scoreTemperature(value, 24, 18), 1.1),
    evidence('fermentation.bulkExpansionTarget', processValue(process, 'fermentation.bulkExpansionTarget'), (value) => typeof value === 'string' ? EXPANSION_TARGET_SCORE[value] ?? 0.5 : 0.5, 0.8),
    evidence('fermentation.finalProofTimeSeconds', processValue(process, 'fermentation.finalProofTimeSeconds'), (value) => scoreDuration(value, 5400), 0.9),
    evidence('fermentation.finalProofTemperatureCelsius', processValue(process, 'fermentation.finalProofTemperatureCelsius'), (value) => scoreTemperature(value, 27, 18), 0.9),
    evidence('fermentation.finalExpansionTarget', processValue(process, 'fermentation.finalExpansionTarget'), (value) => typeof value === 'string' ? EXPANSION_TARGET_SCORE[value] ?? 0.5 : 0.5, 0.8),
    evidence('fermentation.coldFermentation', processValue(process, 'fermentation.coldFermentation'), (value) => scoreBoolean(value, 0.72, 0.35), 0.7, 0.35),
  ]);
}

function expansionFeature(process: NormalizedProcess): FeatureScore | null {
  return feature('expansionTarget', 'fermentation', [
    evidence('fermentation.bulkExpansionTarget', processValue(process, 'fermentation.bulkExpansionTarget'), (value) => typeof value === 'string' ? EXPANSION_TARGET_SCORE[value] ?? 0.5 : 0.5),
    evidence('fermentation.finalExpansionTarget', processValue(process, 'fermentation.finalExpansionTarget'), (value) => typeof value === 'string' ? EXPANSION_TARGET_SCORE[value] ?? 0.5 : 0.5),
  ]);
}

function additionOrderFeature(process: NormalizedProcess): FeatureScore | null {
  const modeState = processValue(process, 'ingredientAddition.fatIncorporationMode');
  const fatSteps = process.ingredientAddition.steps.filter((step) => step.action === 'incorporate_fat');
  const modeIsSupported = modeState?.state === 'known' && typeof modeState.value === 'string';
  if (!modeIsSupported && fatSteps.length === 0) return null;
  const mode = evidence('ingredientAddition.fatIncorporationMode', modeState, (value) => typeof value === 'string' ? FAT_MODE_SCORE[value] ?? 0.42 : 0.42);
  const items = fatSteps.length > 0
    ? [mode, { path: 'ingredientAddition.steps', state: 'known' as const, score: 0.86, confidence: 1, weight: 1 }]
    : [mode];
  return feature('additionOrder', 'addition_order', items);
}

function laminationFeature(process: NormalizedProcess): FeatureScore | null {
  const enabled = processValue(process, 'lamination.enabled');
  if (enabled?.state === 'known' && enabled.value === false) return null;
  if (enabled?.state === 'none') return null;
  return feature('laminationConditions', 'lamination', [
    evidence('lamination.enabled', enabled, (value) => scoreBoolean(value, 1, 0)),
    evidence('lamination.layerFatPercentage', processValue(process, 'lamination.layerFatPercentage'), (value) => scoreNumber(value, 1), 1.1),
    evidence('lamination.foldSequence', processValue(process, 'lamination.foldSequence'), (value) => typeof value === 'string' ? FOLD_SEQUENCE_SCORE[value] ?? 0.6 : 0.6, 0.9),
    evidence('lamination.fatState', processValue(process, 'lamination.fatState'), (value) => typeof value === 'string' ? FAT_STATE_SCORE[value] ?? 0.6 : 0.6, 0.8),
    evidence('lamination.doughState', processValue(process, 'lamination.doughState'), (value) => typeof value === 'string' ? DOUGH_STATE_SCORE[value] ?? 0.55 : 0.55, 0.6),
    evidence('lamination.workingTemperatureCelsius', processValue(process, 'lamination.workingTemperatureCelsius'), (value) => scoreTemperature(value, 18, 12), 0.8),
  ]);
}

function thermalFeature(process: NormalizedProcess): FeatureScore | null {
  return feature('thermalConditions', 'thermal', [
    evidence('thermalProcess.method', processValue(process, 'thermalProcess.method'), (value) => typeof value === 'string' ? THERMAL_METHOD_SCORE[value] ?? 0.55 : 0.55),
    evidence('thermalProcess.temperatureCelsius', processValue(process, 'thermalProcess.temperatureCelsius'), (value) => scoreTemperature(value, 205, 80), 1.1),
    evidence('thermalProcess.durationSeconds', processValue(process, 'thermalProcess.durationSeconds'), (value) => scoreDuration(value, 3600), 0.8),
    evidence('thermalProcess.preheated', processValue(process, 'thermalProcess.preheated'), (value) => scoreBoolean(value, 0.78, 0.42), 0.6),
    evidence('thermalProcess.steamLevel', processValue(process, 'thermalProcess.steamLevel'), (value) => scoreNumber(value, 1), 0.45, 0.35),
    evidence('thermalProcess.surfaceTreatment', processValue(process, 'thermalProcess.surfaceTreatment'), (value) => typeof value === 'string' ? SURFACE_TREATMENT_SCORE[value] ?? 0.5 : 0.5, 0.35, 0.45),
  ]);
}

function geometryFeature(process: NormalizedProcess): FeatureScore | null {
  return feature('geometryConditions', 'geometry', [
    evidence('geometry.shapeClass', processValue(process, 'geometry.shapeClass'), (value) => typeof value === 'string' ? SHAPE_SCORE[value] ?? 0.55 : 0.55),
    evidence('geometry.characteristicThicknessMillimeters', processValue(process, 'geometry.characteristicThicknessMillimeters'), (value) => typeof value === 'number' ? clamp(1 - value / 60) : 0.5, 1.1),
    evidence('geometry.surfaceVolumeClass', processValue(process, 'geometry.surfaceVolumeClass'), (value) => typeof value === 'string' ? ({ very_high: 0.8, high: 0.68, medium: 0.52, low: 0.38 }[value] ?? 0.5) : 0.5, 0.7),
    evidence('geometry.containerType', processValue(process, 'geometry.containerType'), (value) => typeof value === 'string' ? CONTAINER_SCORE[value] ?? 0.55 : 0.55, 0.55, 0.45),
  ]);
}

function processPathSet(process: NormalizedProcess): string[] {
  return process.ingredientAddition.steps.flatMap((step) => step.lineIds);
}

function referenceConflict(input: EffectiveAnalysisInput): EffectiveDiagnostic | null {
  const { reference, intrinsic } = input;
  if (input.expectedFormulaRevision !== undefined && input.expectedFormulaRevision !== reference.formulaRevision) {
    return conflictDiagnostic('STALE_PAIR', 'formula.revision', { expected: input.expectedFormulaRevision, actual: reference.formulaRevision });
  }
  if (input.expectedProcessRevision !== undefined && input.expectedProcessRevision !== reference.processRevision) {
    return conflictDiagnostic('STALE_PAIR', 'process.revision', { expected: input.expectedProcessRevision, actual: reference.processRevision });
  }
  if (
    reference.formulaId !== reference.formula.formulaId
    || reference.formulaId !== reference.process.formulaId
    || reference.formulaRevision !== reference.formula.revision
    || reference.processRevision !== reference.process.revision
    || intrinsic.formulaRevision !== reference.formulaRevision
  ) {
    return conflictDiagnostic('STALE_PAIR', 'formulaProcessReference', {
      formulaRevision: reference.formulaRevision,
      processRevision: reference.processRevision,
    });
  }
  const formulaLineIds = new Set(reference.formula.ingredientLines.map((line) => line.id));
  const invalidLineId = processPathSet(reference.process).find((lineId) => !formulaLineIds.has(lineId));
  const laminationFat = processValue(reference.process, 'lamination.laminationFat');
  const invalidLaminationFat = laminationFat?.state === 'known' && !formulaLineIds.has(String(laminationFat.value));
  if (invalidLineId || invalidLaminationFat) {
    return conflictDiagnostic('REFERENCE_MISMATCH', invalidLineId ? 'ingredientAddition.steps.lineIds' : 'lamination.laminationFat', {
      lineId: invalidLineId ?? String(laminationFat?.state === 'known' ? laminationFat.value : 'unknown'),
    });
  }
  const sequences = reference.process.ingredientAddition.steps.map((step) => step.sequence);
  if (new Set(sequences).size !== sequences.length) {
    return conflictDiagnostic('REFERENCE_MISMATCH', 'ingredientAddition.steps.sequence', { reason: 'duplicate-sequence' });
  }
  return null;
}

function diagnostic(
  code: EffectiveDiagnosticCode,
  path: string,
  messageKey: string,
  resolutionKey: string,
  parameters: Record<string, string | number> = {},
): EffectiveDiagnostic {
  return { code, severity: code === 'MISSING_PROCESS_EVIDENCE' ? 'warning' : 'info', path, messageKey, resolutionKey, parameters };
}

export function evaluateEffectiveBehavior(input: EffectiveAnalysisInput): EffectiveAnalysisResult {
  const { reference, intrinsic } = input;
  const conflict = referenceConflict(input);
  if (conflict) return conflictResult(input, conflict);

  const process = reference.process;
  const mixing = mixingFeature(process);
  const aeration = aerationFeature(process);
  const fermentation = fermentationFeature(process);
  const expansion = expansionFeature(process);
  const additionOrder = additionOrderFeature(process);
  const lamination = laminationFeature(process);
  const thermal = thermalFeature(process);
  const geometry = geometryFeature(process);
  const features = [mixing, aeration, fermentation, expansion, additionOrder, lamination, thermal, geometry]
    .filter((item): item is FeatureScore => item !== null);
  const metrics: EffectiveMetricResult[] = [];

  const gpi = intrinsicMetric(intrinsic, 'gpi');
  const effectiveGlutenFeatures = combine([
    ...(mixing ? [{ feature: mixing, weight: 1 }] : []),
    ...(additionOrder ? [{ feature: additionOrder, weight: 0.35 }] : []),
  ]);
  if (effectiveGlutenFeatures) {
    const adjustment = (mixing ? (mixing.score - 0.5) * 0.34 : 0)
      + (additionOrder ? (additionOrder.score - 0.5) * -0.12 : 0);
    const retention = doughStateGlutenRetention(process);
    metrics.push(metricFromBaseline(
      'effectiveGluten',
      effectiveGlutenFeatures,
      gpi,
      gpi.value === undefined ? undefined : clamp(gpi.value * retention + adjustment),
      'score (0–1)',
    ));
  }

  const gasFeatures = combine([
    ...(aeration ? [{ feature: aeration, weight: 1 }] : []),
    ...(fermentation ? [{ feature: fermentation, weight: 0.8 }] : []),
  ]);
  if (gasFeatures) metrics.push(metricFromScore('gasRetention', gasFeatures, 'score (0–1)'));
  if (fermentation) metrics.push(metricFromScore('fermentationSeverity', fermentation, 'score (0–1)'));
  const proofFeatures = combine([
    ...(fermentation ? [{ feature: fermentation, weight: 1 }] : []),
    ...(expansion ? [{ feature: expansion, weight: 0.8 }] : []),
  ]);
  if (proofFeatures) metrics.push(metricFromScore('proofTendency', proofFeatures, 'score (0–1)'));
  if (lamination) metrics.push(metricFromScore('laminationIntegrity', lamination, 'score (0–1)'));

  const thermalGeometry = combine([
    ...(thermal ? [{ feature: thermal, weight: 1 }] : []),
    ...(geometry ? [{ feature: geometry, weight: 0.8 }] : []),
  ]);
  if (thermalGeometry) {
    metrics.push(metricFromScore('settingTendency', thermalGeometry, 'score (0–1)'));
    const moistureLoss = combine([
      ...(thermal ? [{ feature: thermal, weight: 1.1 }] : []),
      ...(geometry ? [{ feature: geometry, weight: 0.65 }] : []),
    ]);
    if (moistureLoss) metrics.push(metricFromScore('moistureLossTendency', moistureLoss, 'score (0–1)'));
  }

  const riskFeatures = combine([
    ...(fermentation ? [{ feature: fermentation, weight: 0.9 }] : []),
    ...(thermal ? [{ feature: thermal, weight: 1 }] : []),
    ...(geometry ? [{ feature: geometry, weight: 0.8 }] : []),
    ...(lamination ? [{ feature: lamination, weight: 0.65 }] : []),
  ]);
  if (riskFeatures) {
    const riskScore = clamp(
      riskFeatures.score < 0.5 ? 1 - riskFeatures.score : (1 - riskFeatures.score) * 0.7,
    );
    metrics.push(metricFromScore('processRisk', {
      ...riskFeatures,
      score: round(riskScore),
      contributions: riskFeatures.contributions.map((item) => ({
        ...item,
        effect: item.effect === 'supports' ? 'qualifies' : item.effect,
      })),
    }, 'score (0–1)'));
  }

  const fluidity = intrinsicMetric(intrinsic, 'fluidity');
  const fluidityFeatures = combine([
    ...(mixing ? [{ feature: mixing, weight: 0.8 }] : []),
    ...(fermentation ? [{ feature: fermentation, weight: 0.45 }] : []),
    ...(thermal ? [{ feature: thermal, weight: 0.35 }] : []),
  ]);
  if (fluidityFeatures) {
    const adjustment = (mixing ? (0.5 - mixing.score) * 0.12 : 0)
      + (fermentation ? (fermentation.score - 0.5) * 0.05 : 0);
    metrics.push(metricFromBaseline('effectiveFluidity', fluidityFeatures, fluidity, fluidity.value === undefined ? undefined : clamp(fluidity.value + adjustment), 'score (0–1)'));
  }

  const diagnostics: EffectiveDiagnostic[] = [];
  const limitationCodes: string[] = [];
  if (process.readiness === 'incomplete') {
    diagnostics.push(diagnostic(
      'MISSING_PROCESS_EVIDENCE',
      'process',
      'effective.diagnostic.missingProcess',
      'effective.diagnostic.recordProcess',
      { coverage: round(reference.coverage.process) },
    ));
    limitationCodes.push('PROCESS_DATA_INCOMPLETE');
  }
  if (process.ingredientAddition.steps.length === 0) {
    diagnostics.push(diagnostic(
      'ADDITION_ORDER_NOT_RECORDED',
      'ingredientAddition.steps',
      'effective.diagnostic.orderNotRecorded',
      'effective.diagnostic.recordOrder',
    ));
    limitationCodes.push('ORDER_NOT_RECORDED');
  }
  if (metrics.length === 0) {
    diagnostics.push(diagnostic(
      'NO_SUPPORTED_EFFECTIVE_METRICS',
      'process',
      'effective.diagnostic.noMetrics',
      'effective.diagnostic.addProcessEvidence',
    ));
    limitationCodes.push('NO_SUPPORTED_PROCESS_RULE');
  }
  const featureContributions = features.flatMap((item) => item.contributions);
  const metricCoverage = metrics.length > 0 ? Math.min(...metrics.map((metric) => metric.coverage)) : 0;
  const coverage = round(Math.min(reference.coverage.composition, reference.coverage.process, metricCoverage || reference.coverage.process));
  const confidence = round(Math.min(reference.confidence.composition, reference.confidence.process, metrics.length > 0 ? Math.min(...metrics.map((metric) => metric.confidence)) : reference.confidence.process));
  const outcome: EffectiveOutcome = metrics.some((metric) => metric.status === 'partial' || metric.status === 'unavailable')
    || process.readiness === 'incomplete'
    || intrinsic.outcome === 'partial'
    || metrics.length === 0
    ? 'partial'
    : 'completed';

  return {
    outcome,
    formulaId: reference.formulaId,
    processId: reference.processId,
    formulaRevision: reference.formulaRevision,
    processRevision: reference.processRevision,
    modelVersion: EFFECTIVE_BEHAVIOR_MODEL_VERSION,
    metrics,
    featureContributions,
    diagnostics,
    coverage,
    confidence,
    limitationCodes: unique([
      ...limitationCodes,
      ...metrics.flatMap((metric) => metric.limitationCodes),
    ]),
  };
}
