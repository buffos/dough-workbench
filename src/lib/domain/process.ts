import type { DraftValueState, ReferenceDraftProvenance, ValueState } from './types';

export const PROCESS_NORMALIZATION_POLICY = 'process-normalization-v1';
export const PROCESS_MODEL_VERSION = 'process-input-v0.2';

export type ProcessReadiness = 'editing' | 'incomplete' | 'process_ready';
export type ProcessScalar = string | number | boolean;
export type ProcessFieldKind = 'enum' | 'number' | 'reference' | 'boolean';
export type ProcessUnit = 'seconds' | 'celsius' | 'ratio' | 'count' | 'millimeters';

export interface AdditionStepDraft {
  id: string;
  sequence: string;
  lineIds: string[];
  action: string;
  durationSeconds: string;
}

export const PROCESS_ADDITION_ACTIONS = ['add', 'mix', 'knead', 'fold', 'rest', 'incorporate_fat', 'other'] as const;

export interface ProcessDraft {
  processId: string;
  formulaId: string;
  revision: number;
  sourceReference?: ReferenceDraftProvenance;
  mixing: {
    method: DraftValueState;
    intensity: DraftValueState;
    durationSeconds: DraftValueState;
    foldCount: DraftValueState;
    foldIntensity: DraftValueState;
    restDurationSeconds: DraftValueState;
    restType: DraftValueState;
    targetDevelopment: DraftValueState;
  };
  ingredientAddition: {
    steps: AdditionStepDraft[];
    fatIncorporationMode: DraftValueState;
  };
  aeration: {
    method: DraftValueState;
    intensity: DraftValueState;
    targetFoam: DraftValueState;
    foamStability: DraftValueState;
    postAerationHandling: DraftValueState;
  };
  fermentation: {
    agent: DraftValueState;
    prefermentType: DraftValueState;
    prefermentPercentage: DraftValueState;
    bulkTimeSeconds: DraftValueState;
    bulkTemperatureCelsius: DraftValueState;
    bulkExpansionTarget: DraftValueState;
    finalProofTimeSeconds: DraftValueState;
    finalProofTemperatureCelsius: DraftValueState;
    finalExpansionTarget: DraftValueState;
    coldFermentation: DraftValueState;
  };
  lamination: {
    enabled: DraftValueState;
    laminationFat: DraftValueState;
    layerFatPercentage: DraftValueState;
    foldSequence: DraftValueState;
    fatState: DraftValueState;
    doughState: DraftValueState;
    workingTemperatureCelsius: DraftValueState;
  };
  thermalProcess: {
    method: DraftValueState;
    temperatureCelsius: DraftValueState;
    durationSeconds: DraftValueState;
    preheated: DraftValueState;
    steamLevel: DraftValueState;
    surfaceTreatment: DraftValueState;
  };
  geometry: {
    shapeClass: DraftValueState;
    characteristicThicknessMillimeters: DraftValueState;
    surfaceVolumeClass: DraftValueState;
    containerType: DraftValueState;
  };
}

export type ProcessValuePath =
  | 'mixing.method'
  | 'mixing.intensity'
  | 'mixing.durationSeconds'
  | 'mixing.foldCount'
  | 'mixing.foldIntensity'
  | 'mixing.restDurationSeconds'
  | 'mixing.restType'
  | 'mixing.targetDevelopment'
  | 'ingredientAddition.fatIncorporationMode'
  | 'aeration.method'
  | 'aeration.intensity'
  | 'aeration.targetFoam'
  | 'aeration.foamStability'
  | 'aeration.postAerationHandling'
  | 'fermentation.agent'
  | 'fermentation.prefermentType'
  | 'fermentation.prefermentPercentage'
  | 'fermentation.bulkTimeSeconds'
  | 'fermentation.bulkTemperatureCelsius'
  | 'fermentation.bulkExpansionTarget'
  | 'fermentation.finalProofTimeSeconds'
  | 'fermentation.finalProofTemperatureCelsius'
  | 'fermentation.finalExpansionTarget'
  | 'fermentation.coldFermentation'
  | 'lamination.enabled'
  | 'lamination.laminationFat'
  | 'lamination.layerFatPercentage'
  | 'lamination.foldSequence'
  | 'lamination.fatState'
  | 'lamination.doughState'
  | 'lamination.workingTemperatureCelsius'
  | 'thermalProcess.method'
  | 'thermalProcess.temperatureCelsius'
  | 'thermalProcess.durationSeconds'
  | 'thermalProcess.preheated'
  | 'thermalProcess.steamLevel'
  | 'thermalProcess.surfaceTreatment'
  | 'geometry.shapeClass'
  | 'geometry.characteristicThicknessMillimeters'
  | 'geometry.surfaceVolumeClass'
  | 'geometry.containerType';

export function getProcessDraftField(process: ProcessDraft, path: ProcessValuePath): DraftValueState {
  const [section, field] = path.split('.') as [keyof ProcessDraft, string];
  return (process[section] as Record<string, DraftValueState>)[field];
}

export interface ProcessFieldDescriptor {
  path: ProcessValuePath;
  key: string;
  kind: ProcessFieldKind;
  unit?: ProcessUnit;
  min?: number;
  max?: number;
  integer?: boolean;
  options?: readonly string[];
  reference?: 'formula-line';
}

const MIXING_METHODS = ['minimal_combine', 'hand_knead', 'machine_knead', 'spiral_mix', 'planetary_hook', 'paddle', 'whisk', 'stretch_and_fold', 'coil_fold', 'gentle_fold', 'other'] as const;
const REST_TYPES = ['autolyse', 'fermentolyse', 'bench_rest', 'intermediate_rest', 'post_mix_rest', 'other'] as const;
const FAT_MODES = ['early_coating', 'creamed', 'melted', 'late_incorporation', 'cold_chunks', 'laminated', 'emulsified', 'direct_mix', 'other'] as const;
const AERATION_METHODS = ['none', 'creaming', 'whole_egg_whip', 'egg_white_whip', 'whipped_cream', 'mechanical_beat', 'other'] as const;
const FERMENTATION_AGENTS = ['none', 'commercial_yeast', 'sourdough', 'mixed', 'other'] as const;
const THERMAL_METHODS = ['static_oven', 'fan_oven', 'steam_oven', 'air_fryer', 'griddle', 'pan', 'deep_fry', 'boil_then_bake', 'other'] as const;
const SHAPE_CLASSES = ['loaf', 'roll', 'breadstick', 'flatbread', 'thin_sheet', 'cookie', 'cake', 'muffin', 'pancake', 'crepe', 'ring', 'laminated_piece', 'choux_piece', 'other'] as const;
const DEVELOPMENT_TARGETS = ['minimal', 'partial', 'full'] as const;
const FOAM_TARGETS = ['low', 'medium', 'high'] as const;
const POST_AERATION_HANDLING = ['gentle_fold', 'moderate_fold', 'vigorous_mix'] as const;
const PREFERMENT_TYPES = ['direct', 'poolish', 'biga', 'levain', 'other'] as const;
const EXPANSION_TARGETS = ['thirty_percent_increase', 'fifty_percent_increase', 'double'] as const;
const FOLD_SEQUENCES = ['single_fold', 'double_fold', 'other'] as const;
const FAT_STATES = ['liquid', 'plastic', 'firm', 'hard', 'variable', 'other'] as const;
const DOUGH_STATES = ['rigid_mass', 'stiff_dough', 'soft_wet_dough', 'thick_batter', 'thin_pourable_batter'] as const;
const SURFACE_TREATMENTS = ['none', 'water', 'egg_wash', 'glaze', 'oil_or_fat', 'seeds_or_flour', 'alkaline', 'other'] as const;
const SURFACE_VOLUME_CLASSES = ['very_high', 'high', 'medium', 'low'] as const;
const CONTAINER_TYPES = ['freestanding', 'baking_sheet', 'loaf_tin', 'cake_pan', 'muffin_cup', 'cast_iron', 'baking_stone', 'other'] as const;

export const PROCESS_FIELD_DESCRIPTORS: readonly ProcessFieldDescriptor[] = [
  { path: 'mixing.method', key: 'method', kind: 'enum', options: MIXING_METHODS },
  { path: 'mixing.intensity', key: 'intensity', kind: 'number', unit: 'ratio', min: 0, max: 1 },
  { path: 'mixing.durationSeconds', key: 'durationSeconds', kind: 'number', unit: 'seconds', min: 0 },
  { path: 'mixing.foldCount', key: 'foldCount', kind: 'number', unit: 'count', min: 0, integer: true },
  { path: 'mixing.foldIntensity', key: 'foldIntensity', kind: 'number', unit: 'ratio', min: 0, max: 1 },
  { path: 'mixing.restDurationSeconds', key: 'restDurationSeconds', kind: 'number', unit: 'seconds', min: 0 },
  { path: 'mixing.restType', key: 'restType', kind: 'enum', options: REST_TYPES },
  { path: 'mixing.targetDevelopment', key: 'targetDevelopment', kind: 'enum', options: DEVELOPMENT_TARGETS },
  { path: 'ingredientAddition.fatIncorporationMode', key: 'fatIncorporationMode', kind: 'enum', options: FAT_MODES },
  { path: 'aeration.method', key: 'method', kind: 'enum', options: AERATION_METHODS },
  { path: 'aeration.intensity', key: 'intensity', kind: 'number', unit: 'ratio', min: 0, max: 1 },
  { path: 'aeration.targetFoam', key: 'targetFoam', kind: 'enum', options: FOAM_TARGETS },
  { path: 'aeration.foamStability', key: 'foamStability', kind: 'number', unit: 'ratio', min: 0, max: 1 },
  { path: 'aeration.postAerationHandling', key: 'postAerationHandling', kind: 'enum', options: POST_AERATION_HANDLING },
  { path: 'fermentation.agent', key: 'agent', kind: 'enum', options: FERMENTATION_AGENTS },
  { path: 'fermentation.prefermentType', key: 'prefermentType', kind: 'enum', options: PREFERMENT_TYPES },
  { path: 'fermentation.prefermentPercentage', key: 'prefermentPercentage', kind: 'number', unit: 'ratio', min: 0, max: 1 },
  { path: 'fermentation.bulkTimeSeconds', key: 'bulkTimeSeconds', kind: 'number', unit: 'seconds', min: 0 },
  { path: 'fermentation.bulkTemperatureCelsius', key: 'bulkTemperatureCelsius', kind: 'number', unit: 'celsius' },
  { path: 'fermentation.bulkExpansionTarget', key: 'bulkExpansionTarget', kind: 'enum', options: EXPANSION_TARGETS },
  { path: 'fermentation.finalProofTimeSeconds', key: 'finalProofTimeSeconds', kind: 'number', unit: 'seconds', min: 0 },
  { path: 'fermentation.finalProofTemperatureCelsius', key: 'finalProofTemperatureCelsius', kind: 'number', unit: 'celsius' },
  { path: 'fermentation.finalExpansionTarget', key: 'finalExpansionTarget', kind: 'enum', options: EXPANSION_TARGETS },
  { path: 'fermentation.coldFermentation', key: 'coldFermentation', kind: 'boolean', options: ['true', 'false'] },
  { path: 'lamination.enabled', key: 'enabled', kind: 'boolean', options: ['true', 'false'] },
  { path: 'lamination.laminationFat', key: 'laminationFat', kind: 'reference', reference: 'formula-line' },
  { path: 'lamination.layerFatPercentage', key: 'layerFatPercentage', kind: 'number', unit: 'ratio', min: 0, max: 1 },
  { path: 'lamination.foldSequence', key: 'foldSequence', kind: 'enum', options: FOLD_SEQUENCES },
  { path: 'lamination.fatState', key: 'fatState', kind: 'enum', options: FAT_STATES },
  { path: 'lamination.doughState', key: 'doughState', kind: 'enum', options: DOUGH_STATES },
  { path: 'lamination.workingTemperatureCelsius', key: 'workingTemperatureCelsius', kind: 'number', unit: 'celsius' },
  { path: 'thermalProcess.method', key: 'method', kind: 'enum', options: THERMAL_METHODS },
  { path: 'thermalProcess.temperatureCelsius', key: 'temperatureCelsius', kind: 'number', unit: 'celsius' },
  { path: 'thermalProcess.durationSeconds', key: 'durationSeconds', kind: 'number', unit: 'seconds', min: 0 },
  { path: 'thermalProcess.preheated', key: 'preheated', kind: 'boolean', options: ['true', 'false'] },
  { path: 'thermalProcess.steamLevel', key: 'steamLevel', kind: 'number', unit: 'ratio', min: 0, max: 1 },
  { path: 'thermalProcess.surfaceTreatment', key: 'surfaceTreatment', kind: 'enum', options: SURFACE_TREATMENTS },
  { path: 'geometry.shapeClass', key: 'shapeClass', kind: 'enum', options: SHAPE_CLASSES },
  { path: 'geometry.characteristicThicknessMillimeters', key: 'characteristicThicknessMillimeters', kind: 'number', unit: 'millimeters', min: 0, max: undefined },
  { path: 'geometry.surfaceVolumeClass', key: 'surfaceVolumeClass', kind: 'enum', options: SURFACE_VOLUME_CLASSES },
  { path: 'geometry.containerType', key: 'containerType', kind: 'enum', options: CONTAINER_TYPES },
];

function unknownProcessValue(reasonCode = 'not-supplied'): DraftValueState {
  return { state: 'unknown', reasonCode };
}

function createUnknownSection<T extends Record<string, DraftValueState>>(fields: readonly (keyof T)[]): T {
  return Object.fromEntries(fields.map((field) => [field, unknownProcessValue()])) as T;
}

export function createInitialProcessDraft(formulaId = 'formula_local'): ProcessDraft {
  return {
    processId: `process_${formulaId}`,
    formulaId,
    revision: 1,
    mixing: createUnknownSection(['method', 'intensity', 'durationSeconds', 'foldCount', 'foldIntensity', 'restDurationSeconds', 'restType', 'targetDevelopment']),
    ingredientAddition: {
      steps: [],
      fatIncorporationMode: unknownProcessValue(),
    },
    aeration: createUnknownSection(['method', 'intensity', 'targetFoam', 'foamStability', 'postAerationHandling']),
    fermentation: createUnknownSection(['agent', 'prefermentType', 'prefermentPercentage', 'bulkTimeSeconds', 'bulkTemperatureCelsius', 'bulkExpansionTarget', 'finalProofTimeSeconds', 'finalProofTemperatureCelsius', 'finalExpansionTarget', 'coldFermentation']),
    lamination: createUnknownSection(['enabled', 'laminationFat', 'layerFatPercentage', 'foldSequence', 'fatState', 'doughState', 'workingTemperatureCelsius']),
    thermalProcess: createUnknownSection(['method', 'temperatureCelsius', 'durationSeconds', 'preheated', 'steamLevel', 'surfaceTreatment']),
    geometry: createUnknownSection(['shapeClass', 'characteristicThicknessMillimeters', 'surfaceVolumeClass', 'containerType']),
  };
}

export interface NormalizedAdditionStep {
  id: string;
  sequence: number;
  lineIds: string[];
  action: string;
  durationSeconds: number;
}

export type NormalizedProcessSection = Record<string, ValueState<ProcessScalar>>;

export interface NormalizedProcess {
  processId: string;
  formulaId: string;
  revision: number;
  readiness: Exclude<ProcessReadiness, 'editing'>;
  mixing: NormalizedProcessSection;
  ingredientAddition: {
    steps: NormalizedAdditionStep[];
    fatIncorporationMode: ValueState<ProcessScalar>;
  };
  aeration: NormalizedProcessSection;
  fermentation: NormalizedProcessSection;
  lamination: NormalizedProcessSection;
  thermalProcess: NormalizedProcessSection;
  geometry: NormalizedProcessSection;
  policy: typeof PROCESS_NORMALIZATION_POLICY;
  modelVersion: typeof PROCESS_MODEL_VERSION;
}

export interface ProcessDiagnostic {
  code: 'INVALID_PROCESS_VALUE' | 'INVALID_PROCESS_SEQUENCE' | 'DUPLICATE_PROCESS_SEQUENCE' | 'REFERENCE_MISMATCH';
  severity: 'error' | 'warning';
  path: string;
  messageKey: string;
  resolutionKey: string;
  parameters: Record<string, string | number>;
}

export interface ProcessNormalizationOutcome {
  outcome: 'completed' | 'partial' | 'rejected';
  readiness: ProcessReadiness;
  processId: string;
  formulaId: string;
  revision: number;
  data: NormalizedProcess | null;
  diagnostics: ProcessDiagnostic[];
  coverage: number;
  confidence: number;
}

function parseNumber(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeValue(value: DraftValueState, descriptor: ProcessFieldDescriptor): ValueState<ProcessScalar> {
  if (value.state === 'none') return { state: 'none' };
  if (value.state === 'unknown') return { state: 'unknown', reasonCode: value.reasonCode };

  if (descriptor.kind === 'number') {
    const parsed = parseNumber(value.value);
    if (parsed === null || (descriptor.min !== undefined && parsed < descriptor.min) || (descriptor.max !== undefined && parsed > descriptor.max) || (descriptor.integer && !Number.isInteger(parsed))) {
      return { state: 'unknown', reasonCode: 'invalid-process-value' };
    }
    return { state: 'known', value: parsed, provenance: value.provenance, confidence: normalizedConfidence(value.confidence) };
  }

  if (!value.value.trim()) return { state: 'unknown', reasonCode: 'empty-process-value' };
  if (descriptor.kind === 'boolean') {
    if (value.value !== 'true' && value.value !== 'false') return { state: 'unknown', reasonCode: 'invalid-process-value' };
    return { state: 'known', value: value.value === 'true', provenance: value.provenance, confidence: normalizedConfidence(value.confidence) };
  }
  if (descriptor.kind === 'reference') {
    return { state: 'known', value: value.value, provenance: value.provenance, confidence: normalizedConfidence(value.confidence) };
  }
  if (descriptor.options && !descriptor.options.includes(value.value)) {
    return { state: 'unknown', reasonCode: 'invalid-process-option' };
  }
  return { state: 'known', value: value.value, provenance: value.provenance, confidence: normalizedConfidence(value.confidence) };
}

function normalizedConfidence(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

function getDraftValue(draft: ProcessDraft, path: ProcessValuePath): DraftValueState {
  const [section, field] = path.split('.') as [keyof ProcessDraft, string];
  return (draft[section] as Record<string, DraftValueState>)[field];
}

function processDiagnostic(code: ProcessDiagnostic['code'], path: string, parameters: Record<string, string | number>): ProcessDiagnostic {
  const keys: Record<ProcessDiagnostic['code'], [string, string]> = {
    INVALID_PROCESS_VALUE: ['process.validation.invalidValue', 'process.validation.correctValue'],
    INVALID_PROCESS_SEQUENCE: ['process.validation.invalidSequence', 'process.validation.correctSequence'],
    DUPLICATE_PROCESS_SEQUENCE: ['process.validation.duplicateSequence', 'process.validation.correctSequence'],
    REFERENCE_MISMATCH: ['process.validation.referenceMismatch', 'process.validation.correctReference'],
  };
  return {
    code,
    severity: 'error',
    path,
    messageKey: keys[code][0],
    resolutionKey: keys[code][1],
    parameters,
  };
}

export function validateProcess(draft: ProcessDraft, formulaLineIds: string[] = []): ProcessDiagnostic[] {
  const diagnostics: ProcessDiagnostic[] = [];
  for (const descriptor of PROCESS_FIELD_DESCRIPTORS) {
    const value = getDraftValue(draft, descriptor.path);
    if (value.state === 'known' && normalizeValue(value, descriptor).state === 'unknown') {
      diagnostics.push(processDiagnostic('INVALID_PROCESS_VALUE', descriptor.path, { field: descriptor.key }));
    }
    if (value.state === 'known' && descriptor.reference === 'formula-line' && !formulaLineIds.includes(value.value)) {
      diagnostics.push(processDiagnostic('REFERENCE_MISMATCH', descriptor.path, { lineId: value.value }));
    }
  }

  const sequences = new Set<number>();
  for (const step of draft.ingredientAddition.steps) {
    const sequence = parseNumber(step.sequence);
    if (sequence === null || !Number.isInteger(sequence) || sequence < 1) {
      diagnostics.push(processDiagnostic('INVALID_PROCESS_SEQUENCE', `ingredientAddition.steps.${step.id}.sequence`, { step: step.id }));
    } else if (sequences.has(sequence)) {
      diagnostics.push(processDiagnostic('DUPLICATE_PROCESS_SEQUENCE', `ingredientAddition.steps.${step.id}.sequence`, { sequence }));
    } else {
      sequences.add(sequence);
    }
    const duration = parseNumber(step.durationSeconds);
    if (duration === null || duration < 0) {
      diagnostics.push(processDiagnostic('INVALID_PROCESS_VALUE', `ingredientAddition.steps.${step.id}.durationSeconds`, { field: 'durationSeconds' }));
    }
    if (!PROCESS_ADDITION_ACTIONS.includes(step.action as (typeof PROCESS_ADDITION_ACTIONS)[number])) {
      diagnostics.push(processDiagnostic('INVALID_PROCESS_VALUE', `ingredientAddition.steps.${step.id}.action`, { field: 'action' }));
    }
    for (const lineId of step.lineIds) {
      if (!formulaLineIds.includes(lineId)) {
        diagnostics.push(processDiagnostic('REFERENCE_MISMATCH', `ingredientAddition.steps.${step.id}.lineIds`, { lineId }));
      }
    }
  }
  return diagnostics;
}

export function normalizeProcess(draft: ProcessDraft, formulaLineIds: string[] = []): ProcessNormalizationOutcome {
  const diagnostics = validateProcess(draft, formulaLineIds);
  const base = {
    processId: draft.processId,
    formulaId: draft.formulaId,
    revision: draft.revision,
    diagnostics,
  };
  if (diagnostics.length > 0) {
    return { ...base, outcome: 'rejected', readiness: 'editing', data: null, coverage: 0, confidence: 0 };
  }

  const normalizedSections = Object.fromEntries(
    PROCESS_FIELD_DESCRIPTORS.map((descriptor) => [descriptor.path, normalizeValue(getDraftValue(draft, descriptor.path), descriptor)]),
  );
  const section = (name: string): NormalizedProcessSection => Object.fromEntries(
    Object.entries(normalizedSections)
      .filter(([path]) => path.startsWith(`${name}.`))
      .map(([path, value]) => [path.slice(name.length + 1), value]),
  ) as NormalizedProcessSection;
  const steps = [...draft.ingredientAddition.steps]
    .sort((a, b) => Number(a.sequence) - Number(b.sequence))
    .map((step) => ({
      id: step.id,
      sequence: Number(step.sequence),
      lineIds: [...step.lineIds],
      action: step.action.trim(),
      durationSeconds: Number(step.durationSeconds.replace(',', '.')),
    }));
  const unknownCount = PROCESS_FIELD_DESCRIPTORS.filter((descriptor) => normalizeValue(getDraftValue(draft, descriptor.path), descriptor).state === 'unknown').length;
  const totalValues = PROCESS_FIELD_DESCRIPTORS.length;
  const coverage = totalValues === 0 ? 1 : (totalValues - unknownCount) / totalValues;
  const confidence = coverage;
  const readiness: Exclude<ProcessReadiness, 'editing'> = unknownCount > 0 ? 'incomplete' : 'process_ready';
  const data: NormalizedProcess = {
    processId: draft.processId,
    formulaId: draft.formulaId,
    revision: draft.revision,
    readiness,
    mixing: section('mixing'),
    ingredientAddition: {
      steps,
      fatIncorporationMode: normalizedSections['ingredientAddition.fatIncorporationMode'],
    },
    aeration: section('aeration'),
    fermentation: section('fermentation'),
    lamination: section('lamination'),
    thermalProcess: section('thermalProcess'),
    geometry: section('geometry'),
    policy: PROCESS_NORMALIZATION_POLICY,
    modelVersion: PROCESS_MODEL_VERSION,
  };
  return {
    ...base,
    outcome: unknownCount > 0 ? 'partial' : 'completed',
    readiness,
    data,
    diagnostics: [],
    coverage,
    confidence,
  };
}
