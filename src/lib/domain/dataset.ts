import type {
  NormalizedFlourComponent,
  NormalizedFormula,
  NormalizedIngredientLine,
  Provenance,
  ValueState,
} from './types';
import type { NormalizedProcess, ProcessScalar } from './process';
import {
  STRUCTURAL_MODIFIER_AXES,
  STRUCTURAL_FAMILY_BY_ID,
  STRUCTURAL_FAMILY_NODES,
  type StructuralModifierAxisId,
  structuralFamilyAncestry,
  structuralFamilyDepth,
  structuralFamilyMatches,
} from './structural-taxonomy';

const STRUCTURAL_MODIFIER_OPTIONS_BY_ID = new Map(
  STRUCTURAL_MODIFIER_AXES.flatMap((axis) => axis.options.map((option) => [option.id, axis.id] as const)),
);

export const GOLD_DATASET_RELEASE_ID = 'gold-formulas-v2';
export const GOLD_DATASET_KIND = 'gold-formulas';
export const GOLD_DATASET_MODEL_VERSION = 'classification-seed-v2';
export const DATASET_CONTRACT_VERSION = 'dataset-release-v2';

export type DatasetReleaseStatus = 'published' | 'superseded';
export type DatasetRole = 'reference' | 'calibration';
export type EvaluationPartition = 'calibration' | 'validation' | 'test';
export type DatasetMaturity = 'expert-seed' | 'gold-calibrated' | 'broad-calibrated' | 'experiment-validated';
export type DatasetQuality = 'high' | 'medium' | 'low';

export interface DatasetLocalizedText {
  en: string;
  el: string;
}

export interface DatasetSourceSummary {
  sourceId: string;
  quality: DatasetQuality;
}

export interface DatasetRecordIdentity {
  preparationKey: string;
  label: DatasetLocalizedText;
  familyId: string;
  familyLabel?: DatasetLocalizedText;
  prototypeId?: string;
  /** Explicitly cataloged facets; an omitted facet remains unrecorded. */
  modifierIds?: string[];
}

export interface DatasetRecordProvenance {
  sourceId: string;
  quality: DatasetQuality;
  curationState: 'accepted';
  reviewNote: DatasetLocalizedText;
  citation?: DatasetLocalizedText;
}

export interface DatasetReleaseDescriptor {
  releaseId: string;
  kind: typeof GOLD_DATASET_KIND;
  status: DatasetReleaseStatus;
  contentIdentity: string;
  createdAt: string;
  supersedes: string | null;
  recordCount: number;
  defaultModelVersion: string;
}

export interface DatasetRecordSnapshot {
  releaseId: string;
  recordId: string;
  identity: DatasetRecordIdentity;
  formula: NormalizedFormula;
  process: NormalizedProcess | null;
  provenance: DatasetRecordProvenance;
  roles: DatasetRole[];
  evaluationPartition: EvaluationPartition;
  publicSelectable: boolean;
  primary: boolean;
  maturity: DatasetMaturity;
  normalization?: DatasetNormalizationTrace[];
}

export interface DatasetNormalizationTrace {
  path: string;
  kind: 'captured' | 'converted' | 'catalog-mapped' | 'derived' | 'unknown';
  sourceFactId?: string;
  conversion?: string;
  note: string;
}

export interface DatasetRecordSummary {
  releaseId: string;
  recordId: string;
  preparationKey: string;
  structuralFamilyId: string;
  structuralFamilyLabel?: DatasetLocalizedText;
  prototypeId?: string;
  modifierIds: string[];
  label: DatasetLocalizedText;
  roles: DatasetRole[];
  evaluationPartition: EvaluationPartition;
  publicSelectable: boolean;
  primary: boolean;
  processIncluded: boolean;
  maturity: DatasetMaturity;
  sourceSummary: DatasetSourceSummary;
}

export interface DatasetFilterOption {
  id: string;
  label: DatasetLocalizedText;
  familyId?: string;
  depth?: number;
  count?: number;
  selectable?: boolean;
}

export interface DatasetModifierFilterGroup {
  axisId: StructuralModifierAxisId;
  label: DatasetLocalizedText;
  options: DatasetFilterOption[];
}

export interface DatasetRelease {
  descriptor: DatasetReleaseDescriptor;
  records: DatasetRecordSnapshot[];
}

export interface DatasetReleaseRegistry {
  currentReleaseId: string;
  releases: Record<string, DatasetRelease>;
}

export type DatasetDiagnosticCode =
  | 'release_unavailable'
  | 'release_invalid'
  | 'record_not_found'
  | 'record_not_selectable'
  | 'record_invalid'
  | 'duplicate_record_id'
  | 'multiple_primary_references'
  | 'missing_provenance'
  | 'partition_violation'
  | 'locale_parity_failure'
  | 'invalid_content_identity'
  | 'release_id_conflict'
  | 'missing_formula_snapshot'
  | 'invalid_mass'
  | 'unresolved_required_ingredient'
  | 'normalization_trace_missing'
  | 'invalid_structural_family'
  | 'invalid_structural_modifier';


export interface DatasetDiagnostic {
  code: DatasetDiagnosticCode;
  path: string;
  parameters: Record<string, string | number>;
}

export interface DatasetVerificationReport {
  outcome: 'pass' | 'fail';
  releaseId: string;
  recordErrors: DatasetDiagnostic[];
  roleErrors: DatasetDiagnostic[];
  partitionErrors: DatasetDiagnostic[];
  localeErrors: DatasetDiagnostic[];
  contentIdentity: string;
}

export interface DatasetReleaseResolution {
  outcome: 'resolved' | 'rejected';
  release: DatasetRelease | null;
  diagnostic: DatasetDiagnostic | null;
}

export interface ReferenceBrowseQuery {
  locale: 'en' | 'el';
  releaseId?: string;
  query?: string;
  familyId?: string;
  preparationKey?: string;
  modifierIds?: string[];
  page?: number;
  pageSize?: number;
}

export interface ReferenceBrowseResult {
  outcome: 'completed' | 'rejected';
  release: DatasetReleaseDescriptor | null;
  items: DatasetRecordSummary[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  diagnostic: DatasetDiagnostic | null;
}

export interface ReferenceResolutionResult {
  outcome: 'selected' | 'rejected';
  record: DatasetRecordSnapshot | null;
  diagnostic: DatasetDiagnostic | null;
}

function diagnostic(
  code: DatasetDiagnosticCode,
  path: string,
  parameters: Record<string, string | number> = {},
): DatasetDiagnostic {
  return { code, path, parameters };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isFinitePositive(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function isLocalizedText(value: unknown): value is DatasetLocalizedText {
  if (!value || typeof value !== 'object') return false;
  const text = value as Record<string, unknown>;
  return isNonEmptyString(text.en) && isNonEmptyString(text.el);
}

function isDatasetRole(value: unknown): value is DatasetRole {
  return value === 'reference' || value === 'calibration';
}

function isEvaluationPartition(value: unknown): value is EvaluationPartition {
  return value === 'calibration' || value === 'validation' || value === 'test';
}

function isDatasetMaturity(value: unknown): value is DatasetMaturity {
  return value === 'expert-seed'
    || value === 'gold-calibrated'
    || value === 'broad-calibrated'
    || value === 'experiment-validated';
}

function isDatasetQuality(value: unknown): value is DatasetQuality {
  return value === 'high' || value === 'medium' || value === 'low';
}

function isStructuralModifierId(value: unknown): value is string {
  return typeof value === 'string' && STRUCTURAL_MODIFIER_OPTIONS_BY_ID.has(value);
}

function isValueState(value: unknown): value is ValueState<unknown> {
  if (!value || typeof value !== 'object') return false;
  const state = value as Record<string, unknown>;
  if (state.state === 'none') return true;
  if (state.state === 'unknown') return isNonEmptyString(state.reasonCode);
  return state.state === 'known'
    && 'value' in state
    && typeof state.provenance === 'object'
    && state.provenance !== null
    && typeof state.confidence === 'number'
    && Number.isFinite(state.confidence)
    && state.confidence >= 0
    && state.confidence <= 1;
}

function isProvenance(value: unknown): value is Provenance {
  if (!value || typeof value !== 'object') return false;
  const provenance = value as Record<string, unknown>;
  return isNonEmptyString(provenance.kind);
}

function isNormalizedFormula(value: unknown): value is NormalizedFormula {
  if (!value || typeof value !== 'object') return false;
  const formula = value as Partial<NormalizedFormula>;
  if (
    !isNonEmptyString(formula.formulaId)
    || typeof formula.revision !== 'number'
    || !Number.isInteger(formula.revision)
    || formula.revision < 1
  ) return false;
  if (!formula.structuralFlourDenominator || !isFinitePositive(formula.structuralFlourDenominator.value)) return false;
  if (!Array.isArray(formula.flourComponents) || !Array.isArray(formula.ingredientLines)) return false;
  if (formula.flourComponents.length === 0 || !formula.flourComponents.some((item) => item.flourBearing)) return false;
  if (!formula.normalizationPolicy || !formula.modelVersion) return false;
  const normalizedFormula = formula as NormalizedFormula;

  const floursValid = normalizedFormula.flourComponents.every((flour: NormalizedFlourComponent) => (
    isNonEmptyString(flour.id)
    && isNonEmptyString(flour.name)
    && isFinitePositive(flour.mass?.value)
    && isValueState(flour.absorption)
    && isValueState(flour.acidNeutralization)
    && isProvenance(flour.compositionProvenance)
    && Number.isFinite(flour.compositionConfidence)
    && flour.compositionConfidence >= 0
    && flour.compositionConfidence <= 1
    && Object.values(flour.composition).every(isValueState)
  ));
  if (!floursValid) return false;

  return normalizedFormula.ingredientLines.every((line: NormalizedIngredientLine) => (
    isNonEmptyString(line.id)
    && isNonEmptyString(line.name)
    && isFinitePositive(line.mass?.value)
    && isValueState(line.acidNeutralization)
    && isProvenance(line.provenance)
    && isProvenance(line.compositionProvenance)
    && Number.isFinite(line.compositionConfidence)
    && line.compositionConfidence >= 0
    && line.compositionConfidence <= 1
    && Object.values(line.composition).every(isValueState)
  ));
}

function isNormalizedProcess(value: unknown): value is NormalizedProcess {
  if (!value || typeof value !== 'object') return false;
  const process = value as Partial<NormalizedProcess>;
  return isNonEmptyString(process.processId)
    && isNonEmptyString(process.formulaId)
    && typeof process.revision === 'number'
    && Number.isInteger(process.revision)
    && process.revision >= 1
    && process.ingredientAddition !== undefined
    && Array.isArray(process.ingredientAddition.steps)
    && process.ingredientAddition.steps.every((step) => (
      isNonEmptyString(step.id)
      && Number.isInteger(step.sequence)
      && step.sequence >= 1
      && Array.isArray(step.lineIds)
      && step.lineIds.every(isNonEmptyString)
      && isNonEmptyString(step.action)
      && Number.isFinite(step.durationSeconds)
      && step.durationSeconds >= 0
    ))
    && Object.entries(process)
      .filter(([key]) => ['mixing', 'aeration', 'fermentation', 'lamination', 'thermalProcess', 'geometry'].includes(key))
      .every(([, section]) => Object.values(section as Record<string, unknown>).every(isValueState));
}

function recordFormulaValid(record: DatasetRecordSnapshot): boolean {
  return isNormalizedFormula(record.formula)
    && (record.process === null || isNormalizedProcess(record.process))
    && (record.process === null || record.process.formulaId === record.formula.formulaId);
}

function recordHasUnresolvedIngredient(record: DatasetRecordSnapshot): boolean {
  if (!record.formula || !Array.isArray(record.formula.ingredientLines)) return false;
  return record.formula.ingredientLines.some((line) => !line.ingredientId
    && !Object.values(line.composition).some((value) => value.state === 'known'));
}

function recordHasInvalidMass(record: DatasetRecordSnapshot): boolean {
  if (!record.formula || !Array.isArray(record.formula.flourComponents) || !Array.isArray(record.formula.ingredientLines)) return false;
  return [...record.formula.flourComponents, ...record.formula.ingredientLines]
    .some((line) => !isFinitePositive(line.mass?.value));
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    const serialized = JSON.stringify(value);
    return serialized ?? 'null';
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`).join(',')}}`;
}

function hash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return `fnv1a32:${(result >>> 0).toString(16).padStart(8, '0')}`;
}

export function computeReleaseContentIdentity(release: Pick<DatasetRelease, 'descriptor' | 'records'>): string {
  const descriptor = Object.fromEntries(
    Object.entries(release.descriptor).filter(([key]) => key !== 'contentIdentity'),
  );
  return hash(canonicalize({ descriptor, records: release.records }));
}

export function isPublicReferenceEligible(record: DatasetRecordSnapshot): boolean {
  return record.provenance.curationState === 'accepted'
    && record.roles.includes('reference')
    && record.publicSelectable
    && record.evaluationPartition !== 'validation'
    && record.evaluationPartition !== 'test';
}

export function summarizeDatasetRecord(record: DatasetRecordSnapshot): DatasetRecordSummary {
  const familyNode = STRUCTURAL_FAMILY_BY_ID[record.identity.familyId];
  return {
    releaseId: record.releaseId,
    recordId: record.recordId,
    preparationKey: record.identity.preparationKey,
    structuralFamilyId: record.identity.familyId,
    structuralFamilyLabel: record.identity.familyLabel
      ? { ...record.identity.familyLabel }
      : familyNode
        ? { ...familyNode.label }
        : undefined,
    prototypeId: record.identity.prototypeId,
    modifierIds: Array.isArray(record.identity.modifierIds) ? [...new Set(record.identity.modifierIds)] : [],
    label: { ...record.identity.label },
    roles: [...record.roles],
    evaluationPartition: record.evaluationPartition,
    publicSelectable: record.publicSelectable,
    primary: record.primary,
    processIncluded: record.process !== null,
    maturity: record.maturity,
    sourceSummary: {
      sourceId: record.provenance.sourceId,
      quality: record.provenance.quality,
    },
  };
}

export function verifyDatasetRelease(release: DatasetRelease): DatasetVerificationReport {
  const recordErrors: DatasetDiagnostic[] = [];
  const roleErrors: DatasetDiagnostic[] = [];
  const partitionErrors: DatasetDiagnostic[] = [];
  const localeErrors: DatasetDiagnostic[] = [];
  const seenRecordIds = new Set<string>();
  const primaryByPreparation = new Map<string, string>();

  if (!isNonEmptyString(release.descriptor.releaseId) || release.descriptor.kind !== GOLD_DATASET_KIND) {
    recordErrors.push(diagnostic('release_invalid', 'descriptor.releaseId'));
  }
  if (!isNonEmptyString(release.descriptor.createdAt) || !isNonEmptyString(release.descriptor.defaultModelVersion)) {
    recordErrors.push(diagnostic('release_invalid', 'descriptor.metadata'));
  }
  if (!Number.isInteger(release.descriptor.recordCount) || release.descriptor.recordCount !== release.records.length) {
    recordErrors.push(diagnostic('release_invalid', 'descriptor.recordCount', {
      expected: release.records.length,
      actual: release.descriptor.recordCount,
    }));
  }

  const contentIdentity = computeReleaseContentIdentity(release);
  if (!isNonEmptyString(release.descriptor.contentIdentity) || release.descriptor.contentIdentity !== contentIdentity) {
    recordErrors.push(diagnostic('invalid_content_identity', 'descriptor.contentIdentity', { expected: contentIdentity }));
  }

  release.records.forEach((record, index) => {
    const path = `records.${index}`;
    if (!isNonEmptyString(record.recordId)) {
      recordErrors.push(diagnostic('record_invalid', `${path}.recordId`));
    } else if (seenRecordIds.has(record.recordId)) {
      recordErrors.push(diagnostic('duplicate_record_id', `${path}.recordId`, { recordId: record.recordId }));
    } else {
      seenRecordIds.add(record.recordId);
    }
    if (record.releaseId !== release.descriptor.releaseId) {
      recordErrors.push(diagnostic('record_invalid', `${path}.releaseId`, { releaseId: record.releaseId }));
    }
    if (!isNonEmptyString(record.identity?.preparationKey) || !isNonEmptyString(record.identity?.familyId)) {
      recordErrors.push(diagnostic('record_invalid', `${path}.identity`));
    } else if (!STRUCTURAL_FAMILY_BY_ID[record.identity.familyId]) {
      recordErrors.push(diagnostic('invalid_structural_family', `${path}.identity.familyId`, {
        familyId: record.identity.familyId,
      }));
    }
    if (record.identity?.modifierIds !== undefined
      && (!Array.isArray(record.identity.modifierIds) || !record.identity.modifierIds.every(isStructuralModifierId))) {
      recordErrors.push(diagnostic('invalid_structural_modifier', `${path}.identity.modifierIds`));
    }
    if (!isLocalizedText(record.identity?.label)) {
      localeErrors.push(diagnostic('locale_parity_failure', `${path}.identity.label`));
    }
    if (!record.formula || typeof record.formula !== 'object') recordErrors.push(diagnostic('missing_formula_snapshot', `${path}.formula`));
    if (recordHasInvalidMass(record)) recordErrors.push(diagnostic('invalid_mass', `${path}.formula.mass`, { recordId: record.recordId }));
    if (recordHasUnresolvedIngredient(record)) recordErrors.push(diagnostic('unresolved_required_ingredient', `${path}.formula.ingredientLines`, { recordId: record.recordId }));
    if (!recordFormulaValid(record)) recordErrors.push(diagnostic('record_invalid', `${path}.formula`));
    if (!isNonEmptyString(record.provenance?.sourceId) || !isDatasetQuality(record.provenance?.quality) || record.provenance?.curationState !== 'accepted') {
      recordErrors.push(diagnostic('missing_provenance', `${path}.provenance`));
    }
    if (!isLocalizedText(record.provenance?.reviewNote)) {
      localeErrors.push(diagnostic('locale_parity_failure', `${path}.provenance.reviewNote`));
    }
    if (!Array.isArray(record.roles) || record.roles.length === 0 || !record.roles.every(isDatasetRole)) {
      roleErrors.push(diagnostic('record_invalid', `${path}.roles`));
    }
    if (!isEvaluationPartition(record.evaluationPartition)) {
      partitionErrors.push(diagnostic('partition_violation', `${path}.evaluationPartition`));
    }
    if (!isDatasetMaturity(record.maturity)) {
      recordErrors.push(diagnostic('record_invalid', `${path}.maturity`));
    }
    if (record.publicSelectable && (!record.roles.includes('reference') || record.provenance?.curationState !== 'accepted')) {
      roleErrors.push(diagnostic('partition_violation', `${path}.publicSelectable`, { recordId: record.recordId }));
    }
    if (record.publicSelectable && (record.evaluationPartition === 'validation' || record.evaluationPartition === 'test')) {
      partitionErrors.push(diagnostic('partition_violation', `${path}.evaluationPartition`, { recordId: record.recordId }));
    }
    if (record.primary && !isPublicReferenceEligible(record)) {
      roleErrors.push(diagnostic('record_not_selectable', `${path}.primary`, { recordId: record.recordId }));
    }
    if (record.primary) {
      const previous = primaryByPreparation.get(record.identity.preparationKey);
      if (previous) {
        roleErrors.push(diagnostic('multiple_primary_references', `${path}.primary`, {
          preparationKey: record.identity.preparationKey,
          firstRecordId: previous,
          secondRecordId: record.recordId,
        }));
      } else {
        primaryByPreparation.set(record.identity.preparationKey, record.recordId);
      }
    }
  });

  return {
    outcome: recordErrors.length + roleErrors.length + partitionErrors.length + localeErrors.length === 0 ? 'pass' : 'fail',
    releaseId: release.descriptor.releaseId,
    recordErrors,
    roleErrors,
    partitionErrors,
    localeErrors,
    contentIdentity,
  };
}

export function resolveDatasetRelease(
  registry: DatasetReleaseRegistry,
  requestedReleaseId?: string,
): DatasetReleaseResolution {
  const releaseId = requestedReleaseId ?? registry.currentReleaseId;
  const release = registry.releases[releaseId];
  if (!release) {
    return {
      outcome: 'rejected',
      release: null,
      diagnostic: diagnostic('release_unavailable', 'releaseId', { releaseId }),
    };
  }
  const verification = verifyDatasetRelease(release);
  if (verification.outcome !== 'pass' || release.descriptor.status !== 'published') {
    return {
      outcome: 'rejected',
      release: null,
      diagnostic: diagnostic('release_invalid', 'releaseId', { releaseId }),
    };
  }
  return { outcome: 'resolved', release, diagnostic: null };
}

function localizedSearchText(summary: DatasetRecordSummary): string {
  const modifierSearchText = summary.modifierIds.flatMap((modifierId) => {
    const axis = STRUCTURAL_MODIFIER_AXES.find((candidate) => candidate.id === STRUCTURAL_MODIFIER_OPTIONS_BY_ID.get(modifierId));
    const option = axis?.options.find((candidate) => candidate.id === modifierId);
    return option ? [modifierId, option.label.en, option.label.el] : [modifierId];
  });
  return [
    summary.recordId,
    summary.preparationKey,
    summary.structuralFamilyId,
    summary.prototypeId ?? '',
    summary.label.en,
    summary.label.el,
    summary.sourceSummary.sourceId,
    ...modifierSearchText,
  ].join(' ').toLocaleLowerCase();
}

function eligibleRecordSummaries(
  registry: DatasetReleaseRegistry,
  releaseId?: string,
): { release: DatasetRelease | null; summaries: DatasetRecordSummary[]; diagnostic: DatasetDiagnostic | null } {
  const resolution = resolveDatasetRelease(registry, releaseId);
  if (!resolution.release) return { release: null, summaries: [], diagnostic: resolution.diagnostic };
  return {
    release: resolution.release,
    summaries: resolution.release.records.filter(isPublicReferenceEligible).map(summarizeDatasetRecord),
    diagnostic: null,
  };
}

export function browseReferenceFormulas(
  registry: DatasetReleaseRegistry,
  query: ReferenceBrowseQuery,
): ReferenceBrowseResult {
  const pageSize = Math.min(24, Math.max(1, Math.trunc(query.pageSize ?? 8)));
  const page = Math.max(1, Math.trunc(query.page ?? 1));
  const resolution = resolveDatasetRelease(registry, query.releaseId);
  if (!resolution.release) {
    return {
      outcome: 'rejected',
      release: null,
      items: [],
      totalItems: 0,
      page,
      pageSize,
      totalPages: 0,
      diagnostic: resolution.diagnostic,
    };
  }

  const search = query.query?.trim().toLocaleLowerCase() ?? '';
  const summaries = resolution.release.records
    .filter(isPublicReferenceEligible)
    .map(summarizeDatasetRecord)
    .filter((summary) => !query.familyId || structuralFamilyMatches(summary.structuralFamilyId, query.familyId))
    .filter((summary) => !query.preparationKey || summary.preparationKey === query.preparationKey)
    .filter((summary) => !query.modifierIds?.length || query.modifierIds.every((modifierId) => summary.modifierIds.includes(modifierId)))
    .filter((summary) => !search || localizedSearchText(summary).includes(search))
    .sort((left, right) => {
      if (left.structuralFamilyId !== right.structuralFamilyId) return left.structuralFamilyId.localeCompare(right.structuralFamilyId);
      if (left.preparationKey !== right.preparationKey) return left.preparationKey.localeCompare(right.preparationKey);
      if (left.primary !== right.primary) return left.primary ? -1 : 1;
      return left.recordId.localeCompare(right.recordId);
    });
  const totalPages = Math.max(1, Math.ceil(summaries.length / pageSize));
  const safePage = Math.min(page, totalPages);
  return {
    outcome: 'completed',
    release: resolution.release.descriptor,
    items: summaries.slice((safePage - 1) * pageSize, safePage * pageSize),
    totalItems: summaries.length,
    page: safePage,
    pageSize,
    totalPages,
    diagnostic: null,
  };
}

export function listReferenceFamilyIds(
  registry: DatasetReleaseRegistry,
  releaseId?: string,
): string[] {
  const resolution = resolveDatasetRelease(registry, releaseId);
  if (!resolution.release) return [];
  return [...new Set(resolution.release.records
    .filter(isPublicReferenceEligible)
    .map((record) => record.identity.familyId))].sort();
}

export function listReferenceFamilyOptions(
  registry: DatasetReleaseRegistry,
  releaseId?: string,
): DatasetFilterOption[] {
  const { summaries } = eligibleRecordSummaries(registry, releaseId);
  const counts = new Map<string, number>();
  summaries.forEach((summary) => {
    structuralFamilyAncestry(summary.structuralFamilyId).forEach((familyId) => {
      counts.set(familyId, (counts.get(familyId) ?? 0) + 1);
    });
  });
  return STRUCTURAL_FAMILY_NODES.map((node) => ({
    id: node.id,
    label: { ...node.label },
    depth: structuralFamilyDepth(node.id),
    count: counts.get(node.id) ?? 0,
    selectable: (counts.get(node.id) ?? 0) > 0,
  }));
}

export function listReferenceModifierFilterGroups(
  registry: DatasetReleaseRegistry,
  releaseId?: string,
): DatasetModifierFilterGroup[] {
  const { summaries } = eligibleRecordSummaries(registry, releaseId);
  const counts = new Map<string, number>();
  summaries.forEach((summary) => {
    summary.modifierIds.forEach((modifierId) => counts.set(modifierId, (counts.get(modifierId) ?? 0) + 1));
  });
  return STRUCTURAL_MODIFIER_AXES.map((axis) => ({
    axisId: axis.id,
    label: { ...axis.label },
    options: axis.options.map((option) => ({
      id: option.id,
      label: { ...option.label },
      count: counts.get(option.id) ?? 0,
      selectable: (counts.get(option.id) ?? 0) > 0,
    })),
  }));
}

export function listReferencePreparationOptions(
  registry: DatasetReleaseRegistry,
  releaseId?: string,
): DatasetFilterOption[] {
  const { summaries } = eligibleRecordSummaries(registry, releaseId);
  return [...new Map(summaries.map((summary) => [summary.preparationKey, {
    id: summary.preparationKey,
    label: { ...summary.label },
    familyId: summary.structuralFamilyId,
  }])).values()].sort((left, right) => left.label.en.localeCompare(right.label.en));
}

export function resolveReferenceFormula(
  registry: DatasetReleaseRegistry,
  releaseId: string,
  recordId: string,
): ReferenceResolutionResult {
  const resolution = resolveDatasetRelease(registry, releaseId);
  if (!resolution.release) return { outcome: 'rejected', record: null, diagnostic: resolution.diagnostic };
  const record = resolution.release.records.find((candidate) => candidate.recordId === recordId);
  if (!record) {
    return {
      outcome: 'rejected',
      record: null,
      diagnostic: diagnostic('record_not_found', 'recordId', { releaseId, recordId }),
    };
  }
  if (!isPublicReferenceEligible(record)) {
    return {
      outcome: 'rejected',
      record: null,
      diagnostic: diagnostic('record_not_selectable', 'recordId', { releaseId, recordId }),
    };
  }
  return { outcome: 'selected', record, diagnostic: null };
}

export function cloneDatasetRecord(record: DatasetRecordSnapshot): DatasetRecordSnapshot {
  return JSON.parse(JSON.stringify(record)) as DatasetRecordSnapshot;
}

export type DatasetProcessValue = ValueState<ProcessScalar>;
