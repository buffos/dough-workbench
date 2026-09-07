export const FORMULA_NORMALIZATION_POLICY = 'formula-normalization-v1';
export const MODEL_VERSION = 'formula-input-v0.1';

export const COMPOSITION_FIELDS = ['water', 'fat', 'protein', 'sugar', 'starch'] as const;
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

export type DraftValueState =
  | { state: 'known'; value: string; provenance: Provenance; confidence: number }
  | { state: 'none' }
  | { state: 'unknown'; reasonCode: string };

export type CompositionDraft = Record<CompositionField, DraftValueState>;
export type FunctionalComposition = Record<CompositionField, ValueState<number>>;

export interface FlourComponentDraft {
  id: string;
  ingredientId?: string;
  name: string;
  massGrams: string;
  massUnit: MassUnit;
  flourBearing: boolean;
  declaredBlendPercentage: string;
}

export interface IngredientLineDraft {
  id: string;
  ingredientId?: string;
  name: string;
  massGrams: string;
  massUnit: MassUnit;
  role: IngredientRole;
  composition: CompositionDraft;
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

export interface NormalizationExplanation {
  denominatorBasis: string[];
  excludedComponents: string[];
  unknownFields: UnknownFieldExplanation[];
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
