import {
  COMPOSITION_FIELDS,
  FORMULA_NORMALIZATION_POLICY,
  MODEL_VERSION,
  type CompositionDraft,
  type CompositionField,
  type CompositionMetric,
  type CompositionOverrideSummary,
  type Diagnostic,
  type DraftValueState,
  type IngredientDefinitionSource,
  type FormulaDraft,
  type FunctionalComposition,
  type NormalizationExplanation,
  type NormalizationOutcome,
  type NormalizedFlourComponent,
  type NormalizedIngredientLine,
  type Provenance,
  type RoleParticipation,
  type ValueState,
} from './types';

import { STARTER_CATALOG, STARTER_CATALOG_VERSION } from '../../data/ingredients/starter-catalog';

export { COMPOSITION_FIELDS, INGREDIENT_ROLES } from './types';

const DERIVED_PROVENANCE: Provenance = {
  kind: 'derived',
  method: 'formula-normalization-v1',
  modelVersion: MODEL_VERSION,
};

const USER_PROVENANCE: Provenance = { kind: 'user-entered', sourceId: 'formula-workspace' };

export function knownDraftValue(value: number | string, provenance: Provenance = USER_PROVENANCE): DraftValueState {
  return { state: 'known', value: String(value), provenance, confidence: 1 };
}

export function unknownDraftValue(reasonCode = 'not-supplied'): DraftValueState {
  return { state: 'unknown', reasonCode };
}

export function noneDraftValue(): DraftValueState {
  return { state: 'none' };
}

export function emptyComposition(): CompositionDraft {
  return Object.fromEntries(COMPOSITION_FIELDS.map((field) => [field, unknownDraftValue()])) as CompositionDraft;
}

export function compositionFromCatalog(
  values: Partial<Record<CompositionField, number>>,
  sourceVersion = 'v1',
  sourceId = 'starter-catalog',
): CompositionDraft {
  const composition = emptyComposition();
  for (const field of COMPOSITION_FIELDS) {
    composition[field] = Object.hasOwn(values, field)
      ? knownDraftValue(values[field] as number, { kind: 'catalog', sourceId, sourceVersion })
      : noneDraftValue();
  }
  return composition;
}

export function createInitialFormulaDraft(formulaId = 'formula_local'): FormulaDraft {
  return {
    formulaId,
    revision: 1,
    flourComponents: [
      {
        id: 'flour-strong-wheat',
        ingredientId: 'wheat-flour-strong',
        name: 'Strong wheat flour',
        massGrams: '700',
        massUnit: 'g',
        flourBearing: true,
        declaredBlendPercentage: '',
      },
      {
        id: 'flour-whole-wheat',
        ingredientId: 'wheat-flour-whole',
        name: 'Whole wheat flour',
        massGrams: '300',
        massUnit: 'g',
        flourBearing: true,
        declaredBlendPercentage: '',
      },
    ],
    ingredientLines: [
      {
        id: 'line-water',
        ingredientId: STARTER_CATALOG.water.id,
        name: STARTER_CATALOG.water.name,
        massGrams: '700',
        massUnit: 'g',
        role: 'continuous_phase',
        composition: compositionFromCatalog(
          STARTER_CATALOG.water.composition,
          STARTER_CATALOG_VERSION,
          STARTER_CATALOG.water.id,
        ),
        definitionSource: 'catalog',
        catalogReference: { ingredientId: STARTER_CATALOG.water.id, version: STARTER_CATALOG_VERSION },
        definitionProvenance: {
          kind: 'catalog',
          sourceId: STARTER_CATALOG.water.id,
          sourceVersion: STARTER_CATALOG_VERSION,
        },
        definitionConfidence: 1,
      },
    ],
  };
}

export function parsePositiveMass(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.');
  if (!normalized) return null;
  const value = Number(normalized);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function parseOptionalNumber(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.');
  if (!normalized) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function makeDiagnostic(
  code: Diagnostic['code'],
  objectType: Diagnostic['objectType'],
  objectId: string,
  path: string,
  parameters: Record<string, string | number>,
): Diagnostic {
  const keys = {
    MISSING_STRUCTURAL_FLOUR: ['formula.validation.missingStructuralFlour', 'formula.validation.addPositiveFlour'],
    INVALID_MASS: ['formula.validation.invalidMass', 'formula.validation.correctMass'],
    INVALID_BLEND: ['formula.validation.invalidBlend', 'formula.validation.correctBlend'],
    UNSUPPORTED_UNIT: ['formula.validation.unsupportedUnit', 'formula.validation.useGrams'],
    INCOMPLETE_COMPOSITION: ['formula.partial.unknownComposition', 'formula.partial.completeComposition'],
  } as const;
  return {
    code,
    severity: code === 'INCOMPLETE_COMPOSITION' ? 'warning' : 'error',
    objectType,
    objectId,
    path,
    messageKey: keys[code][0],
    resolutionKey: keys[code][1],
    parameters,
  };
}

function declaredBlendDiagnostics(draft: FormulaDraft): Diagnostic[] {
  const declared = draft.flourComponents.map((component) => component.declaredBlendPercentage.trim());
  const suppliedCount = declared.filter(Boolean).length;
  if (suppliedCount === 0) return [];

  if (suppliedCount !== declared.length) {
    return [
      makeDiagnostic('INVALID_BLEND', 'formula', draft.formulaId, 'flourSystem.components.blendFraction', {
        expected: '[99.99%, 100.01%]',
        reason: 'incomplete',
      }),
    ];
  }

  const values = declared.map(parseOptionalNumber);
  if (values.some((value) => value === null || (value as number) < 0)) {
    return [
      makeDiagnostic('INVALID_BLEND', 'formula', draft.formulaId, 'flourSystem.components.blendFraction', {
        expected: '[99.99%, 100.01%]',
        reason: 'non-negative percentages required',
      }),
    ];
  }

  const total = values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  if (total < 99.99 || total > 100.01) {
    return [
      makeDiagnostic('INVALID_BLEND', 'formula', draft.formulaId, 'flourSystem.components.blendFraction', {
        expected: '[99.99%, 100.01%]',
        actual: Number(total.toFixed(4)),
      }),
    ];
  }

  return [];
}

export function validateFormula(draft: FormulaDraft): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const validStructuralFlour = draft.flourComponents.some(
    (component) => component.flourBearing && parsePositiveMass(component.massGrams) !== null,
  );

  if (!validStructuralFlour) {
    diagnostics.push(
      makeDiagnostic('MISSING_STRUCTURAL_FLOUR', 'formula', draft.formulaId, 'flourSystem.components', {}),
    );
  }

  for (const component of draft.flourComponents) {
    if (component.massUnit !== 'g') {
      diagnostics.push(
        makeDiagnostic('UNSUPPORTED_UNIT', 'flour-component', component.id, `flourSystem.components.${component.id}.mass`, {
          unit: component.massUnit,
        }),
      );
    }
    if (parsePositiveMass(component.massGrams) === null) {
      diagnostics.push(
        makeDiagnostic('INVALID_MASS', 'flour-component', component.id, `flourSystem.components.${component.id}.mass`, {
          label: component.name,
        }),
      );
    }
  }

  for (const line of draft.ingredientLines) {
    if (line.massUnit !== 'g') {
      diagnostics.push(
        makeDiagnostic('UNSUPPORTED_UNIT', 'ingredient-line', line.id, `ingredientLines.${line.id}.mass`, {
          unit: line.massUnit,
        }),
      );
    }
    if (parsePositiveMass(line.massGrams) === null) {
      diagnostics.push(
        makeDiagnostic('INVALID_MASS', 'ingredient-line', line.id, `ingredientLines.${line.id}.mass`, {
          label: line.name,
        }),
      );
    }
  }

  diagnostics.push(...declaredBlendDiagnostics(draft));
  return diagnostics;
}

function normalizeValueState(input: DraftValueState): ValueState<number> {
  if (input.state === 'none') return { state: 'none' };
  if (input.state === 'unknown') return { state: 'unknown', reasonCode: input.reasonCode };
  const parsed = parseOptionalNumber(input.value);
  if (parsed === null || parsed < 0) return { state: 'unknown', reasonCode: 'invalid-value' };
  return {
    state: 'known',
    value: parsed,
    provenance: input.provenance,
    confidence: Math.min(1, Math.max(0, input.confidence)),
  };
}

function normalizeComposition(composition: CompositionDraft): FunctionalComposition {
  return Object.fromEntries(
    COMPOSITION_FIELDS.map((field) => [field, normalizeValueState(composition[field])]),
  ) as FunctionalComposition;
}

function definitionSource(line: FormulaDraft['ingredientLines'][number]): IngredientDefinitionSource {
  if (line.definitionSource) return line.definitionSource;
  return line.ingredientId && STARTER_CATALOG[line.ingredientId] ? 'catalog' : 'custom';
}

function catalogReference(line: FormulaDraft['ingredientLines'][number]) {
  if (line.catalogReference) return line.catalogReference;
  const catalogIngredient = line.ingredientId ? STARTER_CATALOG[line.ingredientId] : undefined;
  return catalogIngredient
    ? { ingredientId: catalogIngredient.id, version: STARTER_CATALOG_VERSION }
    : undefined;
}

function compositionProvenance(line: FormulaDraft['ingredientLines'][number]): Provenance {
  if (line.definitionProvenance) return line.definitionProvenance;
  const knownValue = COMPOSITION_FIELDS
    .map((field) => line.composition[field])
    .find((value): value is Extract<DraftValueState, { state: 'known' }> => value.state === 'known');
  return knownValue?.provenance ?? (definitionSource(line) === 'catalog'
    ? { kind: 'catalog', sourceId: line.ingredientId, sourceVersion: STARTER_CATALOG_VERSION }
    : { kind: 'custom', sourceId: 'local-custom-ingredient' });
}

function compositionConfidence(line: FormulaDraft['ingredientLines'][number]): number {
  if (line.definitionConfidence !== undefined) {
    return Math.min(1, Math.max(0, line.definitionConfidence));
  }
  const knownValues = COMPOSITION_FIELDS
    .map((field) => line.composition[field])
    .filter((value): value is Extract<DraftValueState, { state: 'known' }> => value.state === 'known');
  if (knownValues.length === 0) return 0;
  return round(knownValues.reduce((total, value) => total + value.confidence, 0) / knownValues.length);
}

function overrideSummary(line: FormulaDraft['ingredientLines'][number]): CompositionOverrideSummary {
  return {
    fields: COMPOSITION_FIELDS.filter((field) => line.compositionOverride?.[field] !== undefined),
    availability: line.availabilityOverride !== undefined,
  };
}

function roleParticipation(role: FormulaDraft['ingredientLines'][number]['role']): RoleParticipation {
  return role === 'continuous_phase'
    ? { metricFamily: 'continuous_phase', participatesInContinuousPhase: true }
    : { metricFamily: 'separate_role', participatesInContinuousPhase: false };
}

function normalizeAvailabilityOverride(input: DraftValueState | undefined): ValueState<number> | undefined {
  if (!input) return undefined;
  if (input.state === 'none') return { state: 'none' };
  if (input.state === 'unknown') return { state: 'unknown', reasonCode: input.reasonCode };
  const parsed = parseOptionalNumber(input.value);
  if (parsed === null || parsed < 0 || parsed > 1) {
    return { state: 'unknown', reasonCode: 'invalid-availability' };
  }
  return {
    state: 'known',
    value: parsed,
    provenance: input.provenance,
    confidence: Math.min(1, Math.max(0, input.confidence)),
  };
}

function round(value: number, decimals = 3): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function calculated(value: number, unit: 'g' | '%'): { value: number; unit: 'g' | '%'; semanticClass: 'calculated'; provenance: Provenance } {
  return {
    value: round(value, 2),
    unit,
    semanticClass: 'calculated',
    provenance: DERIVED_PROVENANCE,
  };
}

function buildCompositionMetrics(
  lines: Array<{ mass: number; composition: FunctionalComposition }>,
): Record<CompositionField, CompositionMetric> {
  return Object.fromEntries(
    COMPOSITION_FIELDS.map((field) => {
      const states = lines.map((line) => line.composition[field]);
      const hasUnknown = states.some((state) => state.state === 'unknown');
      const knownMass = lines.reduce((sum, line) => {
        const state = line.composition[field];
        return state.state === 'known' ? sum + line.mass * (state.value / 100) : sum;
      }, 0);
      const metric: CompositionMetric = hasUnknown
        ? {
            key: field,
            available: false,
            unit: 'g',
            semanticClass: 'calculated',
            provenance: DERIVED_PROVENANCE,
            limitationCode: 'UNKNOWN_COMPOSITION',
          }
        : {
            key: field,
            available: true,
            value: round(knownMass, 2),
            unit: 'g',
            semanticClass: 'calculated',
            provenance: DERIVED_PROVENANCE,
          };
      return [field, metric];
    }),
  ) as Record<CompositionField, CompositionMetric>;
}

function calculateConfidence(
  lines: Array<{ composition: FunctionalComposition }>,
): number {
  const totalFields = lines.length * COMPOSITION_FIELDS.length;
  if (totalFields === 0) return 1;

  const confidenceScore = lines.reduce((total, line) => {
    return total + COMPOSITION_FIELDS.reduce((lineTotal, field) => {
      const state = line.composition[field];
      if (state.state === 'known') return lineTotal + state.confidence;
      if (state.state === 'none') return lineTotal + 1;
      return lineTotal;
    }, 0);
  }, 0);

  return round(confidenceScore / totalFields);
}

function buildExplanation(
  draft: FormulaDraft,
  unknownFields: NormalizationExplanation['unknownFields'],
  normalizedLines: NormalizedIngredientLine[] = [],
): NormalizationExplanation {
  const denominatorBasis = draft.flourComponents
    .filter((component) => component.flourBearing && parsePositiveMass(component.massGrams) !== null)
    .map((component) => `${component.name} · ${component.massGrams} g`);
  const excludedComponents = draft.ingredientLines
    .filter((line) => line.role === 'structural')
    .map((line) => `${line.name} · structural role, non-flour component`);
  const limitations = unknownFields.length > 0
    ? ['Unknown functional fields remain unavailable; no numeric zero was substituted.']
    : [];
  const roleLines = normalizedLines.length > 0
    ? normalizedLines
    : draft.ingredientLines.map((line) => ({
        id: line.id,
        name: line.name,
        role: line.role,
        participation: roleParticipation(line.role),
      } as Pick<NormalizedIngredientLine, 'id' | 'name' | 'role' | 'participation'>));
  const overrides = draft.ingredientLines
    .map((line) => ({
      lineId: line.id,
      lineName: line.name,
      source: definitionSource(line),
      ...overrideSummary(line),
    }))
    .filter((item) => item.fields.length > 0 || item.availability);
  return {
    denominatorBasis,
    excludedComponents,
    unknownFields,
    roleParticipation: roleLines.map((line) => ({
      lineId: line.id,
      lineName: line.name,
      role: line.role,
      participation: line.participation,
    })),
    overrides,
    provenance: DERIVED_PROVENANCE,
    limitations,
  };
}

export function normalizeFormula(draft: FormulaDraft): NormalizationOutcome {
  const diagnostics = validateFormula(draft);
  const base = {
    formulaId: draft.formulaId,
    revision: draft.revision,
    diagnostics,
    explanation: buildExplanation(draft, []),
  };

  if (diagnostics.length > 0) {
    return {
      ...base,
      outcome: 'rejected',
      readiness: 'invalid',
      data: null,
      coverage: 0,
      confidence: 0,
    };
  }

  const flourWithMass = draft.flourComponents.map((component) => ({
    component,
    mass: parsePositiveMass(component.massGrams) as number,
  }));
  const denominator = flourWithMass
    .filter(({ component }) => component.flourBearing)
    .reduce((sum, item) => sum + item.mass, 0);

  const flourComponents: NormalizedFlourComponent[] = flourWithMass.map(({ component, mass }) => ({
    id: component.id,
    ingredientId: component.ingredientId,
    name: component.name,
    mass: { value: mass, unit: 'g' },
    flourBearing: component.flourBearing,
    blendFraction: calculated((mass / denominator) * 100, '%'),
  }));

  const normalizedLines = draft.ingredientLines.map((line) => ({
    source: line,
    mass: parsePositiveMass(line.massGrams) as number,
    composition: normalizeComposition(line.composition),
    definitionSource: definitionSource(line),
    catalogReference: catalogReference(line),
    compositionProvenance: compositionProvenance(line),
    compositionConfidence: compositionConfidence(line),
    availabilityOverride: normalizeAvailabilityOverride(line.availabilityOverride),
    overrides: overrideSummary(line),
    participation: roleParticipation(line.role),
  }));

  const unknownFields = normalizedLines.flatMap(({ source, composition }) =>
    COMPOSITION_FIELDS.flatMap((field) => {
      const state = composition[field];
      return state.state === 'unknown'
        ? [{ path: `ingredientLines.${source.id}.composition.${field}`, label: `${source.name} · ${field}`, reasonCode: state.reasonCode }]
        : [];
    }),
  );
  const compositionMetrics = buildCompositionMetrics(
    normalizedLines.map(({ mass, composition }) => ({ mass, composition })),
  );
  const normalizedIngredientLines: NormalizedIngredientLine[] = normalizedLines.map(({ source, mass, composition, definitionSource: sourceType, catalogReference: reference, compositionProvenance: sourceProvenance, compositionConfidence: sourceConfidence, availabilityOverride, overrides, participation }) => ({
    id: source.id,
    ingredientId: source.ingredientId,
    name: source.name,
    mass: { value: mass, unit: 'g' as const },
    role: source.role,
    composition,
    bakersPercentage: calculated((mass / denominator) * 100, '%'),
    provenance: USER_PROVENANCE,
    definitionSource: sourceType,
    catalogReference: reference,
    compositionProvenance: sourceProvenance,
    compositionConfidence: sourceConfidence,
    availabilityOverride,
    overrides,
    participation,
  }));
  const totalFields = draft.ingredientLines.length * COMPOSITION_FIELDS.length;
  const supportedFields = totalFields - unknownFields.length;
  const coverage = totalFields === 0 ? 1 : round(supportedFields / totalFields);
  const confidence = calculateConfidence(normalizedLines.map(({ composition }) => ({ composition })));
  const partial = unknownFields.length > 0;
  const explanation = buildExplanation(draft, unknownFields, normalizedIngredientLines);

  return {
    ...base,
    outcome: partial ? 'partial' : 'completed',
    readiness: partial ? 'partial_ready' : 'normalized',
    data: {
      formulaId: draft.formulaId,
      revision: draft.revision,
      readiness: partial ? 'partial_ready' : 'normalized',
      structuralFlourDenominator: calculated(denominator, 'g'),
      flourComponents,
      ingredientLines: normalizedIngredientLines,
      compositionMetrics,
      normalizationPolicy: FORMULA_NORMALIZATION_POLICY,
      modelVersion: MODEL_VERSION,
    },
    diagnostics: partial
      ? [
          {
            code: 'INCOMPLETE_COMPOSITION',
            severity: 'warning',
            objectType: 'formula',
            objectId: draft.formulaId,
            path: 'ingredientLines.composition',
            messageKey: 'formula.partial.unknownComposition',
            resolutionKey: 'formula.partial.completeComposition',
            parameters: { count: unknownFields.length },
          },
        ]
      : [],
    coverage,
    confidence,
    explanation,
  };
}
