export const FORMULA_NORMALIZATION_POLICY = 'formula-normalization-v1';
export const MODEL_VERSION = 'formula-input-v0.1';

export const COMPOSITION_FIELDS = [
  'water',
  'fat',
  'protein',
  'sugar',
  'starch',
  'fiber',
  'salt',
  'eggSolids',
  'dairySolids',
] as const;
export type CompositionField = (typeof COMPOSITION_FIELDS)[number];

export const INGREDIENT_ROLES = [
  'structural',
  'continuous_phase',
  'inclusion',
  'surface_treatment',
  'filling',
  'topping',
  'other',
] as const;
export type IngredientRole = (typeof INGREDIENT_ROLES)[number];

export type SemanticClass = 'calculated' | 'estimated' | 'heuristic';
export type Outcome = 'completed' | 'partial' | 'rejected' | 'conflict';
export type Readiness = 'editing' | 'invalid' | 'structurally_valid' | 'normalized' | 'partial_ready';
export type MassUnit = 'g' | 'kg' | 'ml' | 'count';

export interface Provenance {
  kind: 'catalog' | 'user-entered' | 'custom' | 'derived';
  sourceId?: string;
  sourceVersion?: string;
  method?: string;
  modelVersion?: string;
}

export type ValueState<T> =
  | { state: 'known'; value: T; provenance: Provenance; confidence: number }
  | { state: 'none' }
  | { state: 'unknown'; reasonCode: string };

export type IntrinsicMetricStatus = 'complete' | 'partial' | 'unavailable' | 'not_applicable';
export type IntrinsicMetricKey =
  | CompositionField
  | 'flourDenominator'
  | 'acidNeutralization'
  | 'effectiveWater'
  | 'effectiveHydration'
  | 'flourAbsorption'
  | 'gpi'
  | 'egi'
  | 'enrichment'
  | 'tenderness'
  | 'fluidity';

export interface IntrinsicContribution {
  sourceId: string;
  sourceName: string;
  sourceType: 'flour' | 'ingredient';
  sourceField: string;
  rawMass: number;
  role: IngredientRole;
  participation: RoleParticipation;
  availabilityFactor?: number;
  evidenceState: 'known' | 'none' | 'unknown';
  contribution?: number;
  provenance?: Provenance;
}

export interface IntrinsicExclusion {
  sourceId: string;
  sourceName: string;
  reasonCode: string;
}

export interface IntrinsicMetricExplanation {
  contributors: IntrinsicContribution[];
  exclusions: IntrinsicExclusion[];
  missingEvidence: string[];
  parameters: Record<string, string | number>;
}

export interface IntrinsicMetric {
  key: IntrinsicMetricKey;
  value?: number;
  unit: string;
  semanticClass: SemanticClass;
  status: IntrinsicMetricStatus;
  coverage: number;
  confidence: number;
  provenance: Provenance[];
  contributors: IntrinsicContribution[];
  limitationCodes: string[];
  explanation: IntrinsicMetricExplanation;
  relativeValue?: number;
  relativeUnit?: '%';
}

export interface IntrinsicDiagnostic {
  code: string;
  severity: 'warning' | 'info';
  metricKey?: IntrinsicMetricKey;
  messageKey: string;
  parameters: Record<string, string | number>;
}

export interface IntrinsicAnalysisResult {
  outcome: 'completed' | 'partial' | 'rejected';
  formulaRevision: number;
  modelVersion: string;
  metrics: IntrinsicMetric[];
  diagnostics: IntrinsicDiagnostic[];
}

export type DraftValueState =
  | { state: 'known'; value: string; provenance: Provenance; confidence: number }
  | { state: 'none' }
  | { state: 'unknown'; reasonCode: string };

export type CompositionDraft = Record<CompositionField, DraftValueState>;
export type FunctionalComposition = Record<CompositionField, ValueState<number>>;

export type IngredientDefinitionSource = 'catalog' | 'custom';

export interface CatalogIngredientReference {
  ingredientId: string;
  version: string;
}

export interface RoleParticipation {
  metricFamily: 'continuous_phase' | 'separate_role';
  participatesInContinuousPhase: boolean;
}

export interface CompositionOverrideSummary {
  fields: CompositionField[];
  availability: boolean;
}

export interface FlourComponentDraft {
  id: string;
  ingredientId?: string;
  name: string;
  massGrams: string;
  massUnit: MassUnit;
  flourBearing: boolean;
  declaredBlendPercentage: string;
  composition?: CompositionDraft;
  absorptionPercentage?: string;
  acidNeutralization?: DraftValueState;
}

export interface IngredientLineDraft {
  id: string;
  ingredientId?: string;
  name: string;
  massGrams: string;
  massUnit: MassUnit;
  role: IngredientRole;
  composition: CompositionDraft;
  definitionSource?: IngredientDefinitionSource;
  catalogReference?: CatalogIngredientReference;
  definitionProvenance?: Provenance;
  definitionConfidence?: number;
  compositionOverride?: Partial<Record<CompositionField, DraftValueState>>;
  availabilityOverride?: DraftValueState;
  acidNeutralization?: DraftValueState;
}

export interface FormulaDraft {
  formulaId: string;
  revision: number;
  flourComponents: FlourComponentDraft[];
  ingredientLines: IngredientLineDraft[];
}

export interface Diagnostic {
  code: 'MISSING_STRUCTURAL_FLOUR' | 'INVALID_MASS' | 'INVALID_BLEND' | 'UNSUPPORTED_UNIT' | 'INCOMPLETE_COMPOSITION';
  severity: 'error' | 'warning' | 'info';
  objectType: 'formula' | 'flour-component' | 'ingredient-line';
  objectId: string;
  path: string;
  messageKey: string;
  resolutionKey: string;
  parameters: Record<string, string | number>;
}

export interface DerivedValue {
  value: number;
  unit: 'g' | '%';
  semanticClass: 'calculated';
  provenance: Provenance;
}

export interface NormalizedFlourComponent {
  id: string;
  ingredientId?: string;
  name: string;
  mass: { value: number; unit: 'g' };
  blendFraction: DerivedValue;
  flourBearing: boolean;
  composition: FunctionalComposition;
  compositionProvenance: Provenance;
  compositionConfidence: number;
  absorption: ValueState<number>;
  acidNeutralization: ValueState<number>;
}

export interface NormalizedIngredientLine {
  id: string;
  ingredientId?: string;
  name: string;
  mass: { value: number; unit: 'g' };
  role: IngredientRole;
  composition: FunctionalComposition;
  bakersPercentage: DerivedValue;
  provenance: Provenance;
  definitionSource: IngredientDefinitionSource;
  catalogReference?: CatalogIngredientReference;
  compositionProvenance: Provenance;
  compositionConfidence: number;
  availabilityOverride?: ValueState<number>;
  acidNeutralization: ValueState<number>;
  overrides: CompositionOverrideSummary;
  participation: RoleParticipation;
}

export interface CompositionMetric {
  key: CompositionField;
  available: boolean;
  value?: number;
  unit: 'g';
  semanticClass: 'calculated';
  provenance: Provenance;
  limitationCode?: 'UNKNOWN_COMPOSITION';
}

export interface UnknownFieldExplanation {
  path: string;
  label: string;
  reasonCode: string;
}

export interface RoleParticipationExplanation {
  lineId: string;
  lineName: string;
  role: IngredientRole;
  participation: RoleParticipation;
}

export interface OverrideExplanation {
  lineId: string;
  lineName: string;
  source: IngredientDefinitionSource;
  fields: CompositionField[];
  availability: boolean;
}

export interface NormalizationExplanation {
  denominatorBasis: string[];
  excludedComponents: string[];
  unknownFields: UnknownFieldExplanation[];
  roleParticipation: RoleParticipationExplanation[];
  overrides: OverrideExplanation[];
  provenance: Provenance;
  limitations: string[];
}

export interface NormalizedFormula {
  formulaId: string;
  revision: number;
  readiness: 'normalized' | 'partial_ready';
  structuralFlourDenominator: DerivedValue;
  flourComponents: NormalizedFlourComponent[];
  ingredientLines: NormalizedIngredientLine[];
  compositionMetrics: Record<CompositionField, CompositionMetric>;
  normalizationPolicy: typeof FORMULA_NORMALIZATION_POLICY;
  modelVersion: typeof MODEL_VERSION;
}

export interface NormalizationOutcome {
  outcome: Exclude<Outcome, 'conflict'>;
  readiness: Readiness;
  formulaId: string;
  revision: number;
  data: NormalizedFormula | null;
  diagnostics: Diagnostic[];
  coverage: number;
  confidence: number;
  explanation: NormalizationExplanation;
}
