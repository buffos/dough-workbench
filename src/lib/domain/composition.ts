import {
  COMPOSITION_FIELDS,
  type CompositionField,
  type FunctionalComposition,
  type IntrinsicAnalysisResult,
  type IntrinsicContribution,
  type IntrinsicExclusion,
  type IntrinsicMetric,
  type IntrinsicMetricKey,
  type IntrinsicMetricStatus,
  type IngredientRole,
  type NormalizedFormula,
  type Provenance,
  type RoleParticipation,
  type ValueState,
} from './types';
import { INTRINSIC_HEURISTIC_MODEL } from '../../data/models/intrinsic-model';

export const COMPOSITION_MODEL_VERSION = 'composition-intrinsic-v1';
export const COMPOSITION_PARTICIPATION_POLICY = 'composition-participation-v1';
export const ACID_NEUTRALIZATION_UNIT = 'g NaHCO3 equivalent / 100 g ingredient';

export const INTRINSIC_METRIC_ORDER: readonly IntrinsicMetricKey[] = [
  'flourDenominator',
  ...COMPOSITION_FIELDS,
  'acidNeutralization',
  'effectiveWater',
  'effectiveHydration',
  'flourAbsorption',
  'gpi',
  'egi',
  'enrichment',
  'tenderness',
  'fluidity',
];

interface SourceEntry {
  id: string;
  name: string;
  sourceType: 'flour' | 'ingredient';
  mass: number;
  role: IngredientRole;
  participation: RoleParticipation;
  composition: FunctionalComposition;
  acidNeutralization: ValueState<number>;
  absorption?: ValueState<number>;
  provenance: Provenance;
  confidence: number;
  flourBearing: boolean;
  availabilityOverride?: ValueState<number>;
}

interface FieldAggregate {
  value: number;
  contributors: IntrinsicContribution[];
  exclusions: IntrinsicExclusion[];
  missingEvidence: string[];
  totalCount: number;
  knownCount: number;
  confidenceTotal: number;
  provenance: Provenance[];
}

interface AvailabilityOptions {
  overrides?: Record<string, number | null>;
}

const DERIVED_PROVENANCE: Provenance = {
  kind: 'derived',
  method: COMPOSITION_PARTICIPATION_POLICY,
  modelVersion: COMPOSITION_MODEL_VERSION,
};

function round(value: number, decimals = 3): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function uniqueProvenance(values: Provenance[]): Provenance[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const identity = [
      value.kind,
      value.sourceId ?? '',
      value.sourceVersion ?? '',
      value.method ?? '',
      value.modelVersion ?? '',
    ].join('|');
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

function participation(role: IngredientRole): RoleParticipation {
  return role === 'continuous_phase'
    ? { metricFamily: 'continuous_phase', participatesInContinuousPhase: true }
    : { metricFamily: 'separate_role', participatesInContinuousPhase: false };
}

function sourceEntries(formula: NormalizedFormula): SourceEntry[] {
  const flours: SourceEntry[] = formula.flourComponents.map((flour) => ({
    id: flour.id,
    name: flour.name,
    sourceType: 'flour',
    mass: flour.mass.value,
    role: 'structural',
    participation: participation('structural'),
    composition: flour.composition,
    acidNeutralization: flour.acidNeutralization,
    absorption: flour.absorption,
    provenance: flour.compositionProvenance,
    confidence: flour.compositionConfidence,
    flourBearing: flour.flourBearing,
  }));

  const ingredients: SourceEntry[] = formula.ingredientLines.map((line) => ({
    id: line.id,
    name: line.name,
    sourceType: 'ingredient',
    mass: line.mass.value,
    role: line.role,
    participation: line.participation,
    composition: line.composition,
    acidNeutralization: line.acidNeutralization,
    provenance: line.compositionProvenance,
    confidence: line.compositionConfidence,
    flourBearing: false,
    availabilityOverride: line.availabilityOverride,
  }));

  return [...flours, ...ingredients];
}

function contribution(
  source: SourceEntry,
  sourceField: string,
  evidenceState: 'known' | 'none' | 'unknown',
  value?: number,
  factor = 1,
): IntrinsicContribution {
  return {
    sourceId: source.id,
    sourceName: source.name,
    sourceType: source.sourceType,
    sourceField,
    rawMass: source.mass,
    role: source.role,
    participation: source.participation,
    ...(factor !== 1 ? { availabilityFactor: factor } : {}),
    evidenceState,
    ...(value === undefined ? {} : { contribution: value }),
    provenance: source.provenance,
  };
}

function statusFor(aggregate: FieldAggregate): IntrinsicMetricStatus {
  if (aggregate.totalCount === 0) return 'not_applicable';
  if (aggregate.missingEvidence.length > 0) {
    return aggregate.knownCount > 0 ? 'partial' : 'unavailable';
  }
  return 'complete';
}

function aggregateConfidence(aggregate: FieldAggregate): number {
  if (aggregate.totalCount === 0) return 0;
  return round(aggregate.confidenceTotal / aggregate.totalCount);
}

function aggregateField(
  sources: SourceEntry[],
  field: CompositionField,
  factorFor: (source: SourceEntry) => number = () => 1,
): FieldAggregate {
  const aggregate: FieldAggregate = {
    value: 0,
    contributors: [],
    exclusions: [],
    missingEvidence: [],
    totalCount: 0,
    knownCount: 0,
    confidenceTotal: 0,
    provenance: [],
  };

  for (const source of sources) {
    const factor = factorFor(source);
    if (factor === 0) {
      aggregate.exclusions.push({
        sourceId: source.id,
        sourceName: source.name,
        reasonCode: 'role_not_in_metric_family',
      });
      continue;
    }

    aggregate.totalCount += 1;
    const state = source.composition[field];
    if (state.state === 'known') {
      const amount = source.mass * (state.value / 100) * factor;
      aggregate.value += amount;
      aggregate.knownCount += 1;
      aggregate.confidenceTotal += state.confidence;
      aggregate.contributors.push(contribution(source, field, 'known', amount, factor));
      aggregate.provenance.push(state.provenance);
    } else if (state.state === 'none') {
      aggregate.confidenceTotal += 1;
      aggregate.exclusions.push({
        sourceId: source.id,
        sourceName: source.name,
        reasonCode: 'field_not_applicable',
      });
    } else {
      aggregate.missingEvidence.push(source.id + '.' + field + ':' + state.reasonCode);
    }
  }

  return aggregate;
}

function metricFromAggregate(
  key: IntrinsicMetricKey,
  aggregate: FieldAggregate,
  unit: string,
  semanticClass: 'calculated' | 'estimated',
  denominator?: number,
  parameters: Record<string, string | number> = {},
): IntrinsicMetric {
  const status = statusFor(aggregate);
  const coverage = aggregate.totalCount === 0
    ? 0
    : round((aggregate.knownCount + aggregate.totalCount - aggregate.knownCount - aggregate.missingEvidence.length) / aggregate.totalCount);
  const value = status === 'unavailable' || status === 'not_applicable'
    ? undefined
    : round(aggregate.value, 2);
  const missing = aggregate.missingEvidence.length > 0 ? aggregate.missingEvidence : [];
  const limitationCodes = missing.length > 0 ? ['UNKNOWN_COMPOSITION'] : [];

  return {
    key,
    ...(value === undefined ? {} : { value }),
    unit,
    semanticClass,
    status,
    coverage,
    confidence: aggregateConfidence(aggregate),
    provenance: uniqueProvenance([...aggregate.provenance, DERIVED_PROVENANCE]),
    contributors: aggregate.contributors,
    limitationCodes,
    explanation: {
      contributors: aggregate.contributors,
      exclusions: aggregate.exclusions,
      missingEvidence: missing,
      parameters: {
        ...parameters,
        modelVersion: COMPOSITION_MODEL_VERSION,
        participationPolicy: COMPOSITION_PARTICIPATION_POLICY,
      },
    },
    ...(denominator && value !== undefined
      ? { relativeValue: round((value / denominator) * 100, 2), relativeUnit: '%' as const }
      : {}),
  };
}

function availabilityFactor(source: SourceEntry, options: AvailabilityOptions): number | undefined {
  const explicitOverride = options.overrides && Object.hasOwn(options.overrides, source.id)
    ? options.overrides[source.id]
    : undefined;
  if (explicitOverride !== undefined) {
    return explicitOverride === null ? defaultAvailability(source) : clamp(explicitOverride);
  }

  const state = source.availabilityOverride;
  if (state?.state === 'known') return clamp(state.value);
  if (state?.state === 'unknown') return undefined;
  return defaultAvailability(source);
}

function defaultAvailability(source: SourceEntry): number {
  if (source.sourceType === 'flour' && source.flourBearing) return 1;
  return source.role === 'continuous_phase' ? 1 : 0;
}

function aggregateEffectiveWater(sources: SourceEntry[], options: AvailabilityOptions): FieldAggregate {
  const aggregate: FieldAggregate = {
    value: 0,
    contributors: [],
    exclusions: [],
    missingEvidence: [],
    totalCount: 0,
    knownCount: 0,
    confidenceTotal: 0,
    provenance: [],
  };

  for (const source of sources) {
    const factor = availabilityFactor(source, options);
    if (factor === 0) {
      aggregate.exclusions.push({
        sourceId: source.id,
        sourceName: source.name,
        reasonCode: 'role_not_in_continuous_phase',
      });
      continue;
    }

    aggregate.totalCount += 1;
    if (factor === undefined) {
      aggregate.missingEvidence.push(source.id + '.availability:not-supplied');
      continue;
    }

    const state = source.composition.water;
    if (state.state === 'known') {
      const amount = source.mass * (state.value / 100) * factor;
      aggregate.value += amount;
      aggregate.knownCount += 1;
      aggregate.confidenceTotal += state.confidence;
      aggregate.contributors.push(contribution(source, 'water', 'known', amount, factor));
      aggregate.provenance.push(state.provenance);
    } else if (state.state === 'none') {
      aggregate.confidenceTotal += 1;
      aggregate.exclusions.push({
        sourceId: source.id,
        sourceName: source.name,
        reasonCode: 'water_not_applicable',
      });
    } else {
      aggregate.missingEvidence.push(source.id + '.water:' + state.reasonCode);
    }
  }

  return aggregate;
}

function weightedPropertyMetric(
  key: 'acidNeutralization' | 'flourAbsorption',
  sources: SourceEntry[],
  unit: string,
): IntrinsicMetric {
  const eligible = key === 'flourAbsorption'
    ? sources.filter((source) => source.sourceType === 'flour' && source.flourBearing)
    : sources;
  const aggregate: FieldAggregate = {
    value: 0,
    contributors: [],
    exclusions: [],
    missingEvidence: [],
    totalCount: eligible.length,
    knownCount: 0,
    confidenceTotal: 0,
    provenance: [],
  };
  let totalMass = 0;

  for (const source of eligible) {
    const state = key === 'flourAbsorption' ? source.absorption : source.acidNeutralization;
    if (!state || state.state === 'unknown') {
      aggregate.missingEvidence.push(source.id + '.' + key + ':' + (state?.state === 'unknown' ? state.reasonCode : 'not-supplied'));
      continue;
    }
    if (state.state === 'none') {
      aggregate.confidenceTotal += 1;
      aggregate.exclusions.push({
        sourceId: source.id,
        sourceName: source.name,
        reasonCode: 'property_not_applicable',
      });
      continue;
    }
    totalMass += source.mass;
    aggregate.value += source.mass * state.value;
    aggregate.knownCount += 1;
    aggregate.confidenceTotal += state.confidence;
    aggregate.contributors.push(contribution(source, key, 'known', state.value));
    aggregate.provenance.push(state.provenance);
  }

  if (totalMass > 0) aggregate.value /= totalMass;
  return metricFromAggregate(
    key,
    aggregate,
    unit,
    'estimated',
    undefined,
    key === 'acidNeutralization'
      ? { acidUnit: ACID_NEUTRALIZATION_UNIT }
      : { property: 'weighted flour absorption capacity' },
  );
}

function mergeContributors(metrics: IntrinsicMetric[]): IntrinsicContribution[] {
  const seen = new Set<string>();
  return metrics.flatMap((metric) => metric.contributors).filter((item) => {
    const identity = item.sourceId + '|' + item.sourceField;
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

function mergeExclusions(metrics: IntrinsicMetric[]): IntrinsicExclusion[] {
  const seen = new Set<string>();
  return metrics.flatMap((metric) => metric.explanation.exclusions).filter((item) => {
    const identity = item.sourceId + '|' + item.reasonCode;
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

function heuristicMetric(
  key: 'gpi' | 'egi' | 'enrichment' | 'tenderness' | 'fluidity',
  unit: string,
  dependencies: IntrinsicMetric[],
  calculate: (values: number[]) => number,
): IntrinsicMetric {
  const status = dependencies.some((metric) => metric.status === 'unavailable' || metric.status === 'not_applicable')
    ? 'unavailable'
    : dependencies.some((metric) => metric.status === 'partial')
      ? 'partial'
      : 'complete';
  const values = dependencies.map((metric) => metric.value);
  const value = status === 'unavailable' || values.some((item) => item === undefined)
    ? undefined
    : round(calculate(values as number[]), 3);
  const missingEvidence = dependencies.flatMap((metric) => metric.explanation.missingEvidence);
  const limitations = missingEvidence.length > 0 ? ['UNKNOWN_COMPOSITION'] : [];
  return {
    key,
    ...(value === undefined ? {} : { value }),
    unit,
    semanticClass: 'heuristic',
    status,
    coverage: round(Math.min(...dependencies.map((metric) => metric.coverage))),
    confidence: round(Math.min(...dependencies.map((metric) => metric.confidence))),
      provenance: uniqueProvenance([
      ...dependencies.flatMap((metric) => metric.provenance),
      { ...DERIVED_PROVENANCE, method: INTRINSIC_HEURISTIC_MODEL.version },
    ]),
    contributors: mergeContributors(dependencies),
    limitationCodes: limitations,
    explanation: {
      contributors: mergeContributors(dependencies),
      exclusions: mergeExclusions(dependencies),
      missingEvidence,
      parameters: {
        modelVersion: COMPOSITION_MODEL_VERSION,
        heuristicPolicy: INTRINSIC_HEURISTIC_MODEL.version,
      },
    },
  };
}

function metricMap(metrics: IntrinsicMetric[]): Map<IntrinsicMetricKey, IntrinsicMetric> {
  return new Map(metrics.map((metric) => [metric.key, metric]));
}

export function calculateIntrinsicMetrics(
  formula: NormalizedFormula,
  options: AvailabilityOptions = {},
): IntrinsicAnalysisResult {
  const denominator = formula.structuralFlourDenominator.value;
  if (!Number.isFinite(denominator) || denominator <= 0) {
    return {
      outcome: 'rejected',
      formulaRevision: formula.revision,
      modelVersion: COMPOSITION_MODEL_VERSION,
      metrics: [],
      diagnostics: [{
        code: 'MISSING_FLOUR_DENOMINATOR',
        severity: 'warning',
        messageKey: 'intrinsic.diagnostic.missingDenominator',
        parameters: {},
      }],
    };
  }

  const sources = sourceEntries(formula);
  const flourSources = sources.filter((source) => source.sourceType === 'flour' && source.flourBearing);
  const metrics: IntrinsicMetric[] = [];
  metrics.push({
    key: 'flourDenominator',
    value: round(denominator, 2),
    unit: 'g',
    semanticClass: 'calculated',
    status: 'complete',
    coverage: 1,
    confidence: 1,
    provenance: [DERIVED_PROVENANCE],
    contributors: flourSources.map((source) => contribution(source, 'flourDenominator', 'known', source.mass)),
    limitationCodes: [],
    explanation: {
      contributors: flourSources.map((source) => contribution(source, 'flourDenominator', 'known', source.mass)),
      exclusions: sources
        .filter((source) => !(source.sourceType === 'flour' && source.flourBearing))
        .map((source) => ({ sourceId: source.id, sourceName: source.name, reasonCode: 'not_flour_bearing' })),
      missingEvidence: [],
      parameters: { modelVersion: COMPOSITION_MODEL_VERSION },
    },
  });

  for (const field of COMPOSITION_FIELDS) {
    metrics.push(metricFromAggregate(
      field,
      aggregateField(sources, field),
      'g',
      'calculated',
      denominator,
    ));
  }

  metrics.push(weightedPropertyMetric('acidNeutralization', sources, ACID_NEUTRALIZATION_UNIT));
  const effectiveWater = metricFromAggregate(
    'effectiveWater',
    aggregateEffectiveWater(sources, options),
    'g',
    'estimated',
  );
  metrics.push(effectiveWater);

  const effectiveHydration: IntrinsicMetric = {
    ...effectiveWater,
    key: 'effectiveHydration',
    value: effectiveWater.value === undefined ? undefined : round((effectiveWater.value / denominator) * 100, 2),
    unit: '%',
    semanticClass: 'estimated',
    relativeValue: undefined,
    relativeUnit: undefined,
    explanation: {
      ...effectiveWater.explanation,
      parameters: {
        ...effectiveWater.explanation.parameters,
        formula: 'effective water / structural flour denominator × 100',
      },
    },
  };
  metrics.push(effectiveHydration);
  metrics.push(weightedPropertyMetric('flourAbsorption', flourSources, '%'));

  const fields = metricMap(metrics);
  const fieldMetric = (field: CompositionField): IntrinsicMetric => fields.get(field) as IntrinsicMetric;
  const flourProtein = metricFromAggregate('protein', aggregateField(flourSources, 'protein'), 'g', 'calculated', denominator);
  const enrichmentParts = ['fat', 'sugar', 'eggSolids', 'dairySolids'].map((field) => fieldMetric(field as CompositionField));
  const enrichment = heuristicMetric('enrichment', '%', enrichmentParts, (values) => (values.reduce((sum, value) => sum + value, 0) / denominator) * 100);
  const gpi = heuristicMetric('gpi', 'score (0–1)', [flourProtein], (values) => clamp((values[0] / denominator) / INTRINSIC_HEURISTIC_MODEL.glutenProteinReferenceFraction));
  const egi = heuristicMetric('egi', 'score (0–1)', [enrichment], (values) => clamp(values[0] / INTRINSIC_HEURISTIC_MODEL.enrichmentReferencePercent));
  const tenderness = heuristicMetric('tenderness', 'score (0–1)', [
    fieldMetric('fat'),
    fieldMetric('sugar'),
    fieldMetric('dairySolids'),
  ], (values) => clamp(values.reduce((sum, value) => sum + value, 0) / sources.reduce((sum, source) => sum + source.mass, 0)));
  const fluidity = heuristicMetric('fluidity', 'score (0–1)', [
    effectiveHydration,
    fieldMetric('fat'),
  ], (values) => clamp(
    (values[0] / 100) * INTRINSIC_HEURISTIC_MODEL.fluidityHydrationWeight
      + (values[1] / denominator) * INTRINSIC_HEURISTIC_MODEL.fluidityFatWeight,
  ));
  metrics.push(gpi, egi, enrichment, tenderness, fluidity);

  const outcome = metrics.some((metric) => metric.status === 'partial' || metric.status === 'unavailable')
    ? 'partial'
    : 'completed';
  const diagnostics = metrics
    .filter((metric) => metric.status === 'partial' || metric.status === 'unavailable')
    .map((metric) => ({
      code: metric.status === 'unavailable' ? 'UNAVAILABLE_METRIC' : 'PARTIAL_METRIC',
      severity: 'info' as const,
      metricKey: metric.key,
      messageKey: 'intrinsic.diagnostic.metricUnavailable',
      parameters: { metric: metric.key },
    }));

  return {
    outcome,
    formulaRevision: formula.revision,
    modelVersion: COMPOSITION_MODEL_VERSION,
    metrics: INTRINSIC_METRIC_ORDER
      .map((key) => metrics.find((metric) => metric.key === key))
      .filter((metric): metric is IntrinsicMetric => Boolean(metric)),
    diagnostics,
  };
}
