import {
  COVERAGE_INVENTORY,
  type CoverageEntry,
  type CoverageInventory,
} from '../../data/reference/coverage';
import {
  STARTER_CATALOG,
  STARTER_CATALOG_VERSION,
  STARTER_FLOUR_CATALOG,
} from '../../data/ingredients/starter-catalog';
import {
  checkSourceAcquisition,
  validateSourceRegistry,
  type SourceRegistry,
} from './source-registry';
import {
  COMPOSITION_FIELDS,
  compositionFromCatalog,
  emptyComposition,
  knownDraftValue,
  unknownDraftValue,
} from './normalization';
import type {
  CompositionField,
  CompositionDraft,
  FormulaDraft,
  IngredientRole,
  Provenance,
} from './types';
import {
  PROCESS_FIELD_DESCRIPTORS,
  createInitialProcessDraft,
  normalizeProcess,
  type ProcessDraft,
  type ProcessValuePath,
} from './process';
import type { ProcessNormalizationOutcome } from './process';
import { normalizeFormula } from './normalization';
import type { NormalizationOutcome } from './types';

export const ACQUISITION_PIPELINE_VERSION = 'offline-acquisition-v1';
export const NORMALIZATION_MANIFEST_VERSION = 'normalization-manifest-v1';

export type CapturedFactKind = 'formula' | 'process';
export type CapturedUnit = 'g' | 'kg' | 'ml' | 'count' | 'percent' | 'seconds' | 'celsius' | 'ratio';

export interface SourceFact {
  factId: string;
  path: string;
  kind: CapturedFactKind;
  value: string | number | boolean;
  unit?: CapturedUnit;
  sourceLocator: string;
}

export interface CapturedQuantity {
  fact: SourceFact;
  value: number;
  unit: 'g' | 'kg' | 'ml' | 'count';
  gramsPerMilliliter?: number;
  gramsPerCount?: number;
}

export interface CapturedPercentage {
  fact: SourceFact;
  value: number;
}

export interface CapturedText {
  fact: SourceFact;
  value: string;
}

export interface CapturedFlour {
  id: string;
  name: CapturedText;
  ingredientId?: string;
  mass: CapturedQuantity;
  flourBearing: boolean;
  composition?: Partial<Record<CompositionField, CapturedPercentage>>;
  /** The source names the flour but does not supply enough data to resolve its functional composition. */
  allowUnknownComposition?: boolean;
  absorptionPercentage?: CapturedPercentage;
}

export interface CapturedIngredient {
  id: string;
  name: CapturedText;
  ingredientId?: string;
  mass: CapturedQuantity;
  role: IngredientRole;
  composition?: Partial<Record<CompositionField, CapturedPercentage>>;
  /** The source names the ingredient but does not supply enough data to resolve its functional composition. */
  allowUnknownComposition?: boolean;
}

export interface CapturedAdditionStep {
  id: string;
  sequence: number;
  lineIds: string[];
  action: string;
  durationSeconds: number;
  factIds: string[];
}

export interface CapturedProcessField {
  path: ProcessValuePath;
  value: string | number | boolean;
  unit?: CapturedUnit;
  fact: SourceFact;
}

export interface CapturedProcess {
  fields: CapturedProcessField[];
  steps?: CapturedAdditionStep[];
}

export interface CapturedFormula {
  flours: CapturedFlour[];
  ingredients: CapturedIngredient[];
}

export interface CandidateCapture {
  formula: CapturedFormula;
  process?: CapturedProcess;
}

export interface AcquisitionScope {
  categoryId: string;
  fields: string[];
}

export interface AcquisitionRun {
  runId: string;
  sourceId: string;
  preparationKey: string;
  method: 'manual-capture' | 'approved-import';
  toolVersion: string;
  scope: AcquisitionScope;
  inputIdentity: string;
  capturedAt: string;
  pipelineVersion: typeof ACQUISITION_PIPELINE_VERSION;
  outcome: 'captured';
  factIds: string[];
  identity: string;
}

export interface AcquisitionResult {
  outcome: 'captured' | 'rejected';
  run: AcquisitionRun | null;
  diagnostic: AcquisitionDiagnostic | null;
}

export type AcquisitionDiagnosticCode =
  | 'coverage_entry_invalid'
  | 'source_review_required'
  | 'source_acquisition_not_allowed'
  | 'source_unavailable'
  | 'traceability_missing'
  | 'normalization_invalid';

export interface AcquisitionDiagnostic {
  code: AcquisitionDiagnosticCode;
  path: string;
  parameters: Record<string, string | number>;
}

export type NormalizationTraceKind = 'captured' | 'converted' | 'catalog-mapped' | 'derived' | 'unknown';

export interface NormalizationTrace {
  path: string;
  kind: NormalizationTraceKind;
  sourceFactId?: string;
  conversion?: string;
  catalogReference?: { ingredientId: string; version: string };
  note: string;
}

export type CandidateStatus = 'normalized' | 'needs-review' | 'ready-for-release' | 'rejected';

export interface CandidateRecord {
  candidateId: string;
  preparationKey: string;
  label: { en: string; el: string };
  structuralFamilyIds: string[];
  sourceId: string;
  acquisitionRunId: string;
  inputIdentity: string;
  formula: NormalizationOutcome['data'];
  process: ProcessNormalizationOutcome['data'];
  sourceFacts: SourceFact[];
  normalization: NormalizationTrace[];
  catalogVersion: string;
  processPresent: boolean;
  status: CandidateStatus;
  diagnostics: AcquisitionDiagnostic[];
  review?: import('./curation').CurationReview;
  identity: string;
}

export interface CandidateNormalizationResult {
  outcome: 'normalized' | 'rejected';
  candidate: CandidateRecord | null;
  formula: NormalizationOutcome;
  process: ProcessNormalizationOutcome | null;
  diagnostics: AcquisitionDiagnostic[];
}

function diagnostic(
  code: AcquisitionDiagnosticCode,
  path: string,
  parameters: Record<string, string | number> = {},
): AcquisitionDiagnostic {
  return { code, path, parameters };
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`).join(',')}}`;
}

function digest(value: unknown): string {
  let result = 2166136261;
  const input = canonicalize(value);
  for (let index = 0; index < input.length; index += 1) {
    result ^= input.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return `fnv1a32:${(result >>> 0).toString(16).padStart(8, '0')}`;
}

function coverageEntry(inventory: CoverageInventory, preparationKey: string): CoverageEntry | undefined {
  return inventory.entries.find((entry) => entry.preparationKey === preparationKey);
}

export function collectSourceFacts(capture: CandidateCapture): SourceFact[] {
  const facts: SourceFact[] = [];
  capture.formula.flours.forEach((flour) => {
    facts.push(flour.name.fact, flour.mass.fact);
    Object.values(flour.composition ?? {}).forEach((item) => facts.push(item.fact));
    if (flour.absorptionPercentage) facts.push(flour.absorptionPercentage.fact);
  });
  capture.formula.ingredients.forEach((line) => {
    facts.push(line.name.fact, line.mass.fact);
    Object.values(line.composition ?? {}).forEach((item) => facts.push(item.fact));
  });
  capture.process?.fields.forEach((field) => facts.push(field.fact));
  capture.process?.steps?.forEach((step) => {
    step.factIds.forEach((factId) => facts.push({
      factId,
      path: `process.ingredientAddition.steps.${step.id}`,
      kind: 'process',
      value: step.action,
      sourceLocator: `manual:${step.id}`,
    }));
  });
  return facts.filter((fact, index) => facts.findIndex((item) => item.factId === fact.factId) === index);
}

function validFacts(facts: readonly SourceFact[]): boolean {
  const ids = new Set<string>();
  return facts.every((fact) => {
    if (!fact.factId || ids.has(fact.factId) || !fact.path || !fact.sourceLocator) return false;
    ids.add(fact.factId);
    return true;
  });
}

export function createSourceFactId(input: Pick<SourceFact, 'path' | 'kind' | 'value' | 'unit' | 'sourceLocator'>): string {
  return `fact-${digest(input).slice(-8)}`;
}

function normalizeMass(quantity: CapturedQuantity, path: string): { value: number; trace: NormalizationTrace } | { diagnostic: AcquisitionDiagnostic } {
  if (!Number.isFinite(quantity.value) || quantity.value <= 0) {
    return { diagnostic: diagnostic('normalization_invalid', path, { reason: 'invalid-mass' }) };
  }
  if (quantity.unit === 'g') {
    return { value: quantity.value, trace: { path, kind: 'captured', sourceFactId: quantity.fact.factId, note: 'Mass was captured in grams.' } };
  }
  if (quantity.unit === 'kg') {
    return { value: quantity.value * 1000, trace: { path, kind: 'converted', sourceFactId: quantity.fact.factId, conversion: 'kg→g ×1000', note: 'Mass was converted using the declared kilogram-to-gram conversion.' } };
  }
  if (quantity.unit === 'ml' && Number.isFinite(quantity.gramsPerMilliliter) && (quantity.gramsPerMilliliter ?? 0) > 0) {
    return { value: quantity.value * (quantity.gramsPerMilliliter ?? 0), trace: { path, kind: 'converted', sourceFactId: quantity.fact.factId, conversion: `ml→g ×${quantity.gramsPerMilliliter}`, note: 'Volume was converted with an explicitly supplied density.' } };
  }
  if (quantity.unit === 'count' && Number.isFinite(quantity.gramsPerCount) && (quantity.gramsPerCount ?? 0) > 0) {
    return { value: quantity.value * (quantity.gramsPerCount ?? 0), trace: { path, kind: 'converted', sourceFactId: quantity.fact.factId, conversion: `count→g ×${quantity.gramsPerCount}`, note: 'Count was converted with an explicitly supplied per-item mass.' } };
  }
  return { diagnostic: diagnostic('normalization_invalid', path, { reason: 'unit-conversion-not-justified', unit: quantity.unit }) };
}

function customProvenance(sourceId: string, sourceVersion: string): Provenance {
  return { kind: 'custom', sourceId, sourceVersion, method: 'offline-source-capture', modelVersion: ACQUISITION_PIPELINE_VERSION };
}

function compositionDraft(
  composition: Partial<Record<CompositionField, CapturedPercentage>> | undefined,
  sourceId: string,
  sourceVersion: string,
  traces: NormalizationTrace[],
  pathPrefix: string,
  catalogIngredientId?: string,
): CompositionDraft {
  if (!composition && catalogIngredientId) {
    const fromCatalog = compositionFromCatalog(
      STARTER_CATALOG[catalogIngredientId]?.composition ?? STARTER_FLOUR_CATALOG.find((item) => item.id === catalogIngredientId)?.composition ?? {},
      STARTER_CATALOG_VERSION,
      catalogIngredientId,
    );
    COMPOSITION_FIELDS.forEach((field) => traces.push({
      path: `${pathPrefix}.${field}`,
      kind: 'catalog-mapped',
      catalogReference: { ingredientId: catalogIngredientId, version: STARTER_CATALOG_VERSION },
      note: 'Functional composition was resolved from the versioned local catalog.',
    }));
    return fromCatalog;
  }

  const result = emptyComposition();
  COMPOSITION_FIELDS.forEach((field) => {
    const captured = composition?.[field];
    if (!captured) {
      result[field] = unknownDraftValue('not-captured');
      traces.push({ path: `${pathPrefix}.${field}`, kind: 'unknown', note: 'The source did not provide this composition field.' });
      return;
    }
    result[field] = knownDraftValue(captured.value, customProvenance(sourceId, sourceVersion));
    traces.push({ path: `${pathPrefix}.${field}`, kind: 'captured', sourceFactId: captured.fact.factId, note: 'Functional composition was captured as an explicit percentage.' });
  });
  return result;
}

function setProcessField(process: ProcessDraft, path: ProcessValuePath, state: ReturnType<typeof knownDraftValue>): void {
  const [section, field] = path.split('.') as [keyof ProcessDraft, string];
  const target = process[section];
  if (section === 'ingredientAddition' && field === 'fatIncorporationMode') {
    process.ingredientAddition.fatIncorporationMode = state;
    return;
  }
  if (target && typeof target === 'object' && field in target) {
    (target as Record<string, ReturnType<typeof knownDraftValue>>)[field] = state;
  }
}

function processFactValue(field: CapturedProcessField, sourceId: string, sourceVersion: string): ReturnType<typeof knownDraftValue> {
  const value = typeof field.value === 'boolean' ? String(field.value) : field.value;
  return knownDraftValue(value, customProvenance(sourceId, sourceVersion));
}

export function createAcquisitionRun(input: {
  registry: SourceRegistry;
  inventory?: CoverageInventory;
  sourceId: string;
  preparationKey: string;
  method: AcquisitionRun['method'];
  toolVersion: string;
  scope: AcquisitionScope;
  inputIdentity: string;
  capturedAt: string;
  facts: readonly SourceFact[];
}): AcquisitionResult {
  const inventory = input.inventory ?? COVERAGE_INVENTORY;
  const entry = coverageEntry(inventory, input.preparationKey);
  if (!entry) return { outcome: 'rejected', run: null, diagnostic: diagnostic('coverage_entry_invalid', 'preparationKey', { preparationKey: input.preparationKey }) };
  if (validateSourceRegistry(input.registry, inventory).length > 0) {
    return { outcome: 'rejected', run: null, diagnostic: diagnostic('source_review_required', 'registry', { sourceId: input.sourceId }) };
  }
  const sourceCheck = checkSourceAcquisition(input.registry, input.sourceId);
  if (sourceCheck.outcome !== 'allowed') {
    const code = sourceCheck.diagnostic?.code === 'source_acquisition_not_allowed' ? 'source_acquisition_not_allowed' : 'source_review_required';
    return { outcome: 'rejected', run: null, diagnostic: diagnostic(code, sourceCheck.diagnostic?.path ?? 'sourceId', sourceCheck.diagnostic?.parameters) };
  }
  if (!input.toolVersion || !input.inputIdentity || !input.capturedAt || !validFacts(input.facts)) {
    return { outcome: 'rejected', run: null, diagnostic: diagnostic('traceability_missing', 'acquisitionRun', { sourceId: input.sourceId }) };
  }
  const identity = digest({
    sourceId: input.sourceId,
    preparationKey: input.preparationKey,
    method: input.method,
    toolVersion: input.toolVersion,
    scope: input.scope,
    inputIdentity: input.inputIdentity,
    factIds: input.facts.map((fact) => fact.factId).sort(),
  });
  const run: AcquisitionRun = {
    runId: `acq-${identity.slice(-8)}`,
    sourceId: input.sourceId,
    preparationKey: input.preparationKey,
    method: input.method,
    toolVersion: input.toolVersion,
    scope: { categoryId: input.scope.categoryId, fields: [...input.scope.fields] },
    inputIdentity: input.inputIdentity,
    capturedAt: input.capturedAt,
    pipelineVersion: ACQUISITION_PIPELINE_VERSION,
    outcome: 'captured',
    factIds: input.facts.map((fact) => fact.factId),
    identity,
  };
  return { outcome: 'captured', run, diagnostic: null };
}

export function normalizeCandidateRecord(input: {
  registry: SourceRegistry;
  inventory?: CoverageInventory;
  run: AcquisitionRun;
  facts: CandidateCapture;
  candidateId: string;
  catalogVersion?: string;
}): CandidateNormalizationResult {
  const inventory = input.inventory ?? COVERAGE_INVENTORY;
  const entry = coverageEntry(inventory, input.run.preparationKey);
  const sourceCheck = checkSourceAcquisition(input.registry, input.run.sourceId);
  const traces: NormalizationTrace[] = [];
  const diagnostics: AcquisitionDiagnostic[] = [];
  if (!entry) diagnostics.push(diagnostic('coverage_entry_invalid', 'preparationKey', { preparationKey: input.run.preparationKey }));
  if (validateSourceRegistry(input.registry, inventory).length > 0) diagnostics.push(diagnostic('source_review_required', 'registry', { sourceId: input.run.sourceId }));
  if (sourceCheck.outcome !== 'allowed') diagnostics.push(diagnostic(sourceCheck.diagnostic?.code === 'source_acquisition_not_allowed' ? 'source_acquisition_not_allowed' : 'source_review_required', sourceCheck.diagnostic?.path ?? 'sourceId', sourceCheck.diagnostic?.parameters));
  const sourceVersion = input.registry.revision;
  const sourceId = input.run.sourceId;
  const sourceFacts = collectSourceFacts(input.facts);
  const runFactIds = new Set(input.run.factIds);
  const unlistedFact = sourceFacts.find((fact) => !runFactIds.has(fact.factId));
  if (unlistedFact) {
    diagnostics.push(diagnostic('traceability_missing', `sourceFacts.${unlistedFact.factId}`, { factId: unlistedFact.factId }));
  }
  const formulaDraft: FormulaDraft = {
    formulaId: `formula_candidate_${input.candidateId}`,
    revision: 1,
    flourComponents: [],
    ingredientLines: [],
  };

  input.facts.formula.flours.forEach((flour, index) => {
    const mass = normalizeMass(flour.mass, `formula.flourComponents[${index}].mass`);
    if ('diagnostic' in mass) diagnostics.push(mass.diagnostic);
    const catalogKnown = flour.ingredientId && (STARTER_FLOUR_CATALOG.some((item) => item.id === flour.ingredientId) || Boolean(STARTER_CATALOG[flour.ingredientId]));
    const compositionKnown = flour.composition && Object.keys(flour.composition).length > 0;
    if (!catalogKnown && !compositionKnown && !flour.allowUnknownComposition) {
      diagnostics.push(diagnostic('normalization_invalid', `formula.flourComponents[${index}].composition`, { reason: 'unresolved-required-ingredient', ingredient: flour.name.value }));
    }
    const normalizedMass = 'value' in mass ? mass.value : 0;
    traces.push({ path: `formula.flourComponents[${index}].name`, kind: 'captured', sourceFactId: flour.name.fact.factId, note: 'Flour name was captured from the source.' });
    if ('value' in mass) traces.push(mass.trace);
    formulaDraft.flourComponents.push({
      id: flour.id,
      ingredientId: flour.ingredientId,
      name: flour.name.value,
      massGrams: String(normalizedMass),
      massUnit: 'g',
      flourBearing: flour.flourBearing,
      declaredBlendPercentage: '',
      composition: compositionDraft(flour.composition, sourceId, sourceVersion, traces, `formula.flourComponents[${index}].composition`, flour.ingredientId),
      absorptionPercentage: flour.absorptionPercentage ? String(flour.absorptionPercentage.value) : '',
      acidNeutralization: unknownDraftValue('not-captured'),
    });
    if (flour.absorptionPercentage) traces.push({ path: `formula.flourComponents[${index}].absorption`, kind: 'captured', sourceFactId: flour.absorptionPercentage.fact.factId, note: 'Absorption was captured from the source.' });
    else traces.push({ path: `formula.flourComponents[${index}].absorption`, kind: 'unknown', note: 'The source did not provide flour absorption.' });
  });

  input.facts.formula.ingredients.forEach((line, index) => {
    const mass = normalizeMass(line.mass, `formula.ingredientLines[${index}].mass`);
    if ('diagnostic' in mass) diagnostics.push(mass.diagnostic);
    const catalogKnown = line.ingredientId && Boolean(STARTER_CATALOG[line.ingredientId]);
    const compositionKnown = line.composition && Object.keys(line.composition).length > 0;
    if (!catalogKnown && !compositionKnown && !line.allowUnknownComposition) {
      diagnostics.push(diagnostic('normalization_invalid', `formula.ingredientLines[${index}].composition`, { reason: 'unresolved-required-ingredient', ingredient: line.name.value }));
    }
    const normalizedMass = 'value' in mass ? mass.value : 0;
    traces.push({ path: `formula.ingredientLines[${index}].name`, kind: 'captured', sourceFactId: line.name.fact.factId, note: 'Ingredient name was captured from the source.' });
    if ('value' in mass) traces.push(mass.trace);
    formulaDraft.ingredientLines.push({
      id: line.id,
      ingredientId: line.ingredientId,
      name: line.name.value,
      massGrams: String(normalizedMass),
      massUnit: 'g',
      role: line.role,
      composition: compositionDraft(line.composition, sourceId, sourceVersion, traces, `formula.ingredientLines[${index}].composition`, line.ingredientId),
      definitionSource: catalogKnown ? 'catalog' : 'custom',
      catalogReference: catalogKnown && line.ingredientId ? { ingredientId: line.ingredientId, version: STARTER_CATALOG_VERSION } : undefined,
      definitionProvenance: customProvenance(sourceId, sourceVersion),
      definitionConfidence: catalogKnown ? 1 : 0.7,
      acidNeutralization: unknownDraftValue('not-captured'),
    });
    traces.push({ path: `formula.ingredientLines[${index}].role`, kind: 'derived', note: 'Ingredient role was supplied as a curator mapping; it is not inferred as a mass.' });
  });

  const formula = normalizeFormula(formulaDraft);
  if (formula.diagnostics.length > 0 && !formula.data) diagnostics.push(diagnostic('normalization_invalid', 'formula', { reason: formula.diagnostics[0]?.code ?? 'formula-invalid' }));

  let process: ProcessNormalizationOutcome | null = null;
  if (input.facts.process) {
    const processDraft = createInitialProcessDraft(formulaDraft.formulaId);
    const capturedPaths = new Set<string>();
    input.facts.process.fields.forEach((field) => {
      capturedPaths.add(field.path);
      setProcessField(processDraft, field.path, processFactValue(field, sourceId, sourceVersion));
      traces.push({ path: `process.${field.path}`, kind: 'captured', sourceFactId: field.fact.factId, note: 'Process value was captured independently from Formula composition.' });
    });
    PROCESS_FIELD_DESCRIPTORS.forEach((descriptor) => {
      if (!capturedPaths.has(descriptor.path)) traces.push({ path: `process.${descriptor.path}`, kind: 'unknown', note: 'The source did not provide this Process field.' });
    });
    if (input.facts.process.steps) {
      processDraft.ingredientAddition.steps = input.facts.process.steps.map((step) => {
        step.factIds.forEach((factId) => traces.push({ path: `process.ingredientAddition.steps.${step.id}`, kind: 'captured', sourceFactId: factId, note: 'Addition step facts were captured independently.' }));
        return { id: step.id, sequence: String(step.sequence), lineIds: [...step.lineIds], action: step.action, durationSeconds: String(step.durationSeconds) };
      });
    }
    process = normalizeProcess(processDraft, formulaDraft.ingredientLines.map((line) => line.id));
    if (!process.data) diagnostics.push(diagnostic('normalization_invalid', 'process', { reason: process.diagnostics[0]?.code ?? 'process-invalid' }));
  }

  const candidateData: CandidateRecord | null = formula.data && diagnostics.length === 0 && entry && sourceCheck.outcome === 'allowed'
    ? {
        candidateId: input.candidateId,
        preparationKey: input.run.preparationKey,
        label: { ...entry.label },
        structuralFamilyIds: [...entry.candidateStructuralFamilies],
        sourceId,
        acquisitionRunId: input.run.runId,
        inputIdentity: input.run.inputIdentity,
        formula: formula.data,
        process: process?.data ?? null,
        sourceFacts,
        normalization: traces,
        catalogVersion: input.catalogVersion ?? STARTER_CATALOG_VERSION,
        processPresent: Boolean(input.facts.process),
        status: 'needs-review',
        diagnostics: [],
        identity: digest({ candidateId: input.candidateId, run: input.run.identity, traces }),
      }
    : null;
  return {
    outcome: candidateData ? 'normalized' : 'rejected',
    candidate: candidateData,
    formula,
    process,
    diagnostics,
  };
}

export function candidateRequiredTracePaths(candidate: CandidateRecord): string[] {
  return candidate.normalization
    .filter((trace) => trace.kind !== 'unknown')
    .map((trace) => trace.path);
}
