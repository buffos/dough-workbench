import { emptyComposition } from './normalization';
import {
  COMPOSITION_FIELDS,
  INGREDIENT_ROLES,
  type CompositionField,
  type DraftValueState,
  type FormulaDraft,
  type IngredientRole,
  type IntrinsicAnalysisResult,
  type ValueState,
} from './types';
import {
  PROCESS_ADDITION_ACTIONS,
  PROCESS_FIELD_DESCRIPTORS,
  type ProcessDraft,
  type ProcessValuePath,
} from './process';
import type { AnalysisInputOutcome } from './handoff';
import type { EffectiveAnalysisResult } from './effective';
import type { ClassificationResult } from './classification';

/**
 * Counterfactual exploration is deliberately transport-neutral.  The browser
 * application supplies the analysis callback; this module owns isolation,
 * typed paths, patch ordering, comparison, and recovery semantics.
 */

export type ExplorationOwner = 'formula' | 'process';
export type ExplorationStatus = 'editing' | 'ready' | 'evaluated' | 'rejected';
export type ComparisonOutcome = 'completed' | 'partial' | 'rejected' | 'conflict';
export type ComparisonMetricFamily = 'intrinsic' | 'effective';

export interface ExplorationAnalysisSnapshot {
  handoff: AnalysisInputOutcome;
  intrinsic: IntrinsicAnalysisResult | null;
  effective: EffectiveAnalysisResult | null;
  classification: ClassificationResult | null;
}

export interface ExplorationModelVersions {
  catalogVersion: string;
  handoffModelVersion: string;
  intrinsicModelVersion?: string;
  effectiveModelVersion?: string;
  classificationModelVersion?: string;
}

export interface ExplorationBaseline {
  baselineId: string;
  formula: FormulaDraft;
  process: ProcessDraft;
  snapshot: ExplorationAnalysisSnapshot;
  formulaRevision: number;
  processRevision: number;
  catalogVersion: string;
  modelVersion: string;
  modelVersions: ExplorationModelVersions;
  capturedAt: string;
}

export type ExplorationPatchValue = ValueState<unknown>;

export interface CounterfactualPatch {
  patchId: string;
  owner: ExplorationOwner;
  path: string;
  before: ExplorationPatchValue;
  after: ExplorationPatchValue;
  expectedFormulaRevision?: number;
  expectedProcessRevision?: number;
  source?: 'workspace' | 'imported';
}

export interface CounterfactualScenario {
  scenarioId: string;
  revision: number;
  baseline: ExplorationBaseline;
  patches: CounterfactualPatch[];
  status: ExplorationStatus;
}

export type ExplorationState = CounterfactualScenario;

export type ExplorationDiagnosticCode =
  | 'invalid_patch_value'
  | 'patch_owner_mismatch'
  | 'unknown_patch_path'
  | 'baseline_revision_conflict'
  | 'foreign_formula_reference'
  | 'foreign_process_reference'
  | 'model_version_mismatch'
  | 'counterfactual_formula_invalid'
  | 'counterfactual_process_invalid'
  | 'counterfactual_reference_conflict'
  | 'counterfactual_analysis_partial'
  | 'baseline_unavailable';

export interface ExplorationDiagnostic {
  code: ExplorationDiagnosticCode;
  severity: 'error' | 'warning' | 'info';
  path: string;
  messageKey: string;
  resolutionKey: string;
  parameters: Record<string, string | number>;
  sourceCode?: string;
}

export interface PatchInput {
  patchId: string;
  owner: ExplorationOwner;
  path: string;
  after: ExplorationPatchValue;
  expectedFormulaRevision?: number;
  expectedProcessRevision?: number;
  source?: CounterfactualPatch['source'];
}

export interface PatchBuildResult {
  patch: CounterfactualPatch | null;
  diagnostic: ExplorationDiagnostic | null;
}

export interface PatchApplicationResult {
  scenario: CounterfactualScenario;
  diagnostic: ExplorationDiagnostic | null;
}

export interface MaterializedScenario {
  formula: FormulaDraft;
  process: ProcessDraft;
}

export interface MetricChange {
  key: string;
  family: ComparisonMetricFamily;
  metricKey: string;
  status: 'changed' | 'unchanged' | 'unavailable';
  before?: number;
  after?: number;
  delta?: number;
  unit: string;
  beforeStatus: string;
  afterStatus: string;
  availabilityChanged: boolean;
  beforeCoverage: number;
  afterCoverage: number;
  beforeConfidence: number;
  afterConfidence: number;
}

export interface ComparisonEvidence {
  formulaRevision: { before: number; after?: number };
  processRevision: { before: number; after?: number };
  catalogVersion: { before: string; after?: string };
  modelVersions: { before: ExplorationModelVersions; after?: ExplorationModelVersions };
}

export interface ComparisonResult {
  baseline: ExplorationAnalysisSnapshot;
  counterfactual?: ExplorationAnalysisSnapshot;
  baselineId: string;
  changedPaths: string[];
  metricChanges: MetricChange[];
  evidence: ComparisonEvidence;
  limitations: string[];
  outcome: ComparisonOutcome;
  diagnostics: ExplorationDiagnostic[];
}

export interface CreateBaselineInput {
  formula: FormulaDraft;
  process: ProcessDraft;
  snapshot: ExplorationAnalysisSnapshot;
  baselineId?: string;
  capturedAt?: string;
}

export type ExplorationEvaluator = (
  formula: FormulaDraft,
  process: ProcessDraft,
) => ExplorationAnalysisSnapshot;

type TargetKind =
  | 'mass'
  | 'role'
  | 'composition'
  | 'composition-override'
  | 'availability'
  | 'process-field'
  | 'step-sequence'
  | 'step-action'
  | 'step-duration'
  | 'step-line-ids';

interface ResolvedTarget {
  owner: ExplorationOwner;
  kind: TargetKind;
  currentState: ExplorationPatchValue;
  descriptorPath?: ProcessValuePath;
  apply: (formula: FormulaDraft, process: ProcessDraft, value: ExplorationPatchValue) => void;
}

interface MaterializationResult {
  data: MaterializedScenario | null;
  diagnostic: ExplorationDiagnostic | null;
}

const USER_PATCH_PROVENANCE = { kind: 'user-entered' as const, sourceId: 'counterfactual-exploration' };

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function freezeDeep<T>(value: T): T {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value as Record<string, unknown>).forEach((child) => freezeDeep(child));
    Object.freeze(value);
  }
  return value;
}

function cloneFrozen<T>(value: T): T {
  return freezeDeep(clone(value));
}

function clamp(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

function parseNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = Number(value.trim().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function knownValue(value: unknown, provenance = USER_PATCH_PROVENANCE): ExplorationPatchValue {
  return {
    state: 'known',
    value,
    provenance,
    confidence: 1,
  };
}

function unknownValue(reasonCode = 'not-supplied'): ExplorationPatchValue {
  return { state: 'unknown', reasonCode };
}

function isValueState(value: unknown): value is ExplorationPatchValue {
  if (!value || typeof value !== 'object' || !('state' in value)) return false;
  const state = (value as { state: unknown }).state;
  return state === 'known' || state === 'none' || state === 'unknown';
}

function valueState(raw: unknown): ExplorationPatchValue {
  return isValueState(raw) ? clone(raw) : raw === undefined ? unknownValue() : knownValue(raw);
}

function semanticEqualIgnoringReason(left: ExplorationPatchValue, right: ExplorationPatchValue): boolean {
  if (left.state !== right.state) return false;
  if (left.state === 'known' && right.state === 'known') {
    return JSON.stringify(left.value) === JSON.stringify(right.value);
  }
  return true;
}

function draftState(value: ExplorationPatchValue, kind: TargetKind): DraftValueState | null {
  if (value.state === 'none') return { state: 'none' };
  if (value.state === 'unknown') return { state: 'unknown', reasonCode: value.reasonCode };
  if (kind === 'step-line-ids') return null;
  if (typeof value.value !== 'string' && typeof value.value !== 'number' && typeof value.value !== 'boolean') return null;
  return {
    state: 'known',
    value: String(value.value),
    provenance: clone(value.provenance),
    confidence: clamp(value.confidence),
  };
}

function canonicalScalarValue(value: ExplorationPatchValue, kind: TargetKind): ExplorationPatchValue {
  if (value.state !== 'known') return clone(value);
  if (kind === 'step-line-ids') return clone(value);
  return { ...clone(value), value: String(value.value) };
}

function pathOwner(path: string): ExplorationOwner | null {
  if (path.startsWith('formula.')) return 'formula';
  if (path.startsWith('process.')) return 'process';
  return null;
}

function diagnostic(
  code: ExplorationDiagnosticCode,
  path: string,
  parameters: Record<string, string | number> = {},
  sourceCode?: string,
): ExplorationDiagnostic {
  const keys: Record<ExplorationDiagnosticCode, [string, string]> = {
    invalid_patch_value: ['exploration.diagnostic.invalidPatch', 'exploration.recovery.invalidPatch'],
    patch_owner_mismatch: ['exploration.diagnostic.ownerMismatch', 'exploration.recovery.ownerMismatch'],
    unknown_patch_path: ['exploration.diagnostic.unknownPath', 'exploration.recovery.unknownPath'],
    baseline_revision_conflict: ['exploration.diagnostic.revisionConflict', 'exploration.recovery.revisionConflict'],
    foreign_formula_reference: ['exploration.diagnostic.foreignFormula', 'exploration.recovery.foreignFormula'],
    foreign_process_reference: ['exploration.diagnostic.foreignProcess', 'exploration.recovery.foreignProcess'],
    model_version_mismatch: ['exploration.diagnostic.modelMismatch', 'exploration.recovery.modelMismatch'],
    counterfactual_formula_invalid: ['exploration.diagnostic.formulaInvalid', 'exploration.recovery.formulaInvalid'],
    counterfactual_process_invalid: ['exploration.diagnostic.processInvalid', 'exploration.recovery.processInvalid'],
    counterfactual_reference_conflict: ['exploration.diagnostic.referenceConflict', 'exploration.recovery.referenceConflict'],
    counterfactual_analysis_partial: ['exploration.diagnostic.partial', 'exploration.recovery.partial'],
    baseline_unavailable: ['exploration.diagnostic.baselineUnavailable', 'exploration.recovery.baselineUnavailable'],
  };
  return {
    code,
    severity: code === 'counterfactual_analysis_partial' ? 'warning' : 'error',
    path,
    messageKey: keys[code][0],
    resolutionKey: keys[code][1],
    parameters,
    sourceCode,
  };
}

function formulaLineIds(formula: FormulaDraft): string[] {
  return formula.ingredientLines.map((line) => line.id);
}

function resolveTarget(formula: FormulaDraft, process: ProcessDraft, path: string): ResolvedTarget | ExplorationDiagnostic {
  const parts = path.split('.');
  if (parts[0] === 'formula' && parts[1] === 'flourComponents' && parts.length >= 4) {
    const id = parts[2];
    const field = parts[3];
    const component = formula.flourComponents.find((candidate) => candidate.id === id);
    if (!component) return diagnostic('foreign_formula_reference', path, { id });
    if (field === 'massGrams') {
      return {
        owner: 'formula',
        kind: 'mass',
        currentState: valueState(component.massGrams),
        apply: (nextFormula, _nextProcess, value) => {
          const next = nextFormula.flourComponents.find((candidate) => candidate.id === id);
          if (next) next.massGrams = value.state === 'known' ? String(value.value) : next.massGrams;
        },
      };
    }
    if (parts.length === 5 && field === 'composition' && COMPOSITION_FIELDS.includes(parts[4] as CompositionField)) {
      const compositionField = parts[4] as CompositionField;
      return {
        owner: 'formula',
        kind: 'composition',
        currentState: valueState(component.composition?.[compositionField]),
        apply: (nextFormula, _nextProcess, value) => {
          const next = nextFormula.flourComponents.find((candidate) => candidate.id === id);
          if (next) next.composition = { ...(next.composition ?? emptyComposition()), [compositionField]: draftState(value, 'composition') as DraftValueState };
        },
      };
    }
    return diagnostic('unknown_patch_path', path, { path });
  }

  if (parts[0] === 'formula' && parts[1] === 'ingredientLines' && parts.length >= 4) {
    const id = parts[2];
    const line = formula.ingredientLines.find((candidate) => candidate.id === id);
    if (!line) return diagnostic('foreign_formula_reference', path, { id });
    if (parts.length === 4 && parts[3] === 'massGrams') {
      return {
        owner: 'formula',
        kind: 'mass',
        currentState: valueState(line.massGrams),
        apply: (nextFormula, _nextProcess, value) => {
          const next = nextFormula.ingredientLines.find((candidate) => candidate.id === id);
          if (next) next.massGrams = value.state === 'known' ? String(value.value) : next.massGrams;
        },
      };
    }
    if (parts.length === 4 && parts[3] === 'role') {
      return {
        owner: 'formula',
        kind: 'role',
        currentState: valueState(line.role),
        apply: (nextFormula, _nextProcess, value) => {
          const next = nextFormula.ingredientLines.find((candidate) => candidate.id === id);
          if (next && value.state === 'known') next.role = value.value as IngredientRole;
        },
      };
    }
    if (parts.length === 5 && parts[3] === 'composition' && COMPOSITION_FIELDS.includes(parts[4] as CompositionField)) {
      const field = parts[4] as CompositionField;
      return {
        owner: 'formula',
        kind: 'composition',
        currentState: valueState(line.composition[field]),
        apply: (nextFormula, _nextProcess, value) => {
          const next = nextFormula.ingredientLines.find((candidate) => candidate.id === id);
          if (next) next.composition = { ...next.composition, [field]: draftState(value, 'composition') as DraftValueState };
        },
      };
    }
    if (parts.length === 5 && parts[3] === 'compositionOverride' && COMPOSITION_FIELDS.includes(parts[4] as CompositionField)) {
      const field = parts[4] as CompositionField;
      return {
        owner: 'formula',
        kind: 'composition-override',
        currentState: valueState(line.compositionOverride?.[field]),
        apply: (nextFormula, _nextProcess, value) => {
          const next = nextFormula.ingredientLines.find((candidate) => candidate.id === id);
          if (next) next.compositionOverride = { ...next.compositionOverride, [field]: draftState(value, 'composition-override') as DraftValueState };
        },
      };
    }
    if (parts.length === 4 && parts[3] === 'availabilityOverride') {
      return {
        owner: 'formula',
        kind: 'availability',
        currentState: valueState(line.availabilityOverride),
        apply: (nextFormula, _nextProcess, value) => {
          const next = nextFormula.ingredientLines.find((candidate) => candidate.id === id);
          if (next) next.availabilityOverride = draftState(value, 'availability') as DraftValueState;
        },
      };
    }
    return diagnostic('unknown_patch_path', path, { path });
  }

  if (parts[0] === 'process') {
    const descriptorPath = parts.slice(1).join('.') as ProcessValuePath;
    const descriptor = PROCESS_FIELD_DESCRIPTORS.find((candidate) => candidate.path === descriptorPath);
    if (descriptor && parts.length === 3) {
      const [section, field] = descriptor.path.split('.') as [keyof ProcessDraft, string];
      const sectionValue = process[section] as Record<string, unknown>;
      return {
        owner: 'process',
        kind: 'process-field',
        descriptorPath: descriptor.path,
        currentState: valueState(sectionValue[field]),
        apply: (_nextFormula, nextProcess, value) => {
          const nextSection = { ...(nextProcess[section] as Record<string, unknown>), [field]: draftState(value, 'process-field') as DraftValueState };
          nextProcess[section] = nextSection as never;
        },
      };
    }
    if (parts[1] === 'ingredientAddition' && parts[2] === 'steps' && parts.length === 5) {
      const stepId = parts[3];
      const field = parts[4];
      const step = process.ingredientAddition.steps.find((candidate) => candidate.id === stepId);
      if (!step) return diagnostic('foreign_process_reference', path, { id: stepId });
      if (field === 'sequence' || field === 'action' || field === 'durationSeconds') {
        const kind = field === 'sequence' ? 'step-sequence' : field === 'action' ? 'step-action' : 'step-duration';
        return {
          owner: 'process',
          kind,
          currentState: valueState(step[field]),
          apply: (_nextFormula, nextProcess, value) => {
            const next = nextProcess.ingredientAddition.steps.find((candidate) => candidate.id === stepId);
            if (next && value.state === 'known') next[field] = String(value.value) as never;
          },
        };
      }
      if (field === 'lineIds') {
        return {
          owner: 'process',
          kind: 'step-line-ids',
          currentState: valueState(step.lineIds),
          apply: (_nextFormula, nextProcess, value) => {
            const next = nextProcess.ingredientAddition.steps.find((candidate) => candidate.id === stepId);
            if (next && value.state === 'known' && Array.isArray(value.value)) next.lineIds = [...value.value] as string[];
          },
        };
      }
    }
    return diagnostic('unknown_patch_path', path, { path });
  }

  return diagnostic('unknown_patch_path', path, { path });
}

function validateExpectedRevisions(
  patch: CounterfactualPatch,
  formula: FormulaDraft,
  process: ProcessDraft,
): ExplorationDiagnostic | null {
  if (patch.expectedFormulaRevision !== undefined && patch.expectedFormulaRevision !== formula.revision) {
    return diagnostic('baseline_revision_conflict', 'formula.revision', {
      expected: patch.expectedFormulaRevision,
      actual: formula.revision,
    });
  }
  if (patch.expectedProcessRevision !== undefined && patch.expectedProcessRevision !== process.revision) {
    return diagnostic('baseline_revision_conflict', 'process.revision', {
      expected: patch.expectedProcessRevision,
      actual: process.revision,
    });
  }
  return null;
}

function validateAfter(target: ResolvedTarget, after: ExplorationPatchValue, formula: FormulaDraft): ExplorationDiagnostic | null {
  if (!isValueState(after)) return diagnostic('invalid_patch_value', '', { reason: 'invalid state' });
  if (target.kind === 'mass' || target.kind === 'role' || target.kind === 'step-sequence' || target.kind === 'step-action' || target.kind === 'step-duration' || target.kind === 'step-line-ids') {
    if (after.state !== 'known') return diagnostic('invalid_patch_value', '', { reason: 'a concrete value is required' });
  }
  if (after.state !== 'known') return null;

  if (target.kind === 'mass') {
    const value = parseNumber(after.value);
    return value === null || value <= 0 ? diagnostic('invalid_patch_value', 'massGrams', { reason: 'mass must be greater than zero' }) : null;
  }
  if (target.kind === 'role') {
    return typeof after.value !== 'string' || !INGREDIENT_ROLES.includes(after.value as IngredientRole)
      ? diagnostic('invalid_patch_value', 'role', { reason: 'unsupported formula role' })
      : null;
  }
  if (target.kind === 'composition' || target.kind === 'composition-override') {
    const value = parseNumber(after.value);
    return value === null || value < 0 ? diagnostic('invalid_patch_value', 'composition', { reason: 'composition must be a non-negative percentage' }) : null;
  }
  if (target.kind === 'availability') {
    const value = parseNumber(after.value);
    return value === null || value < 0 || value > 1 ? diagnostic('invalid_patch_value', 'availabilityOverride', { reason: 'coefficient must be between 0 and 1' }) : null;
  }
  if (target.kind === 'process-field') {
    const descriptor = PROCESS_FIELD_DESCRIPTORS.find((candidate) => candidate.path === target.descriptorPath);
    if (!descriptor) return diagnostic('unknown_patch_path', target.descriptorPath ?? '', {});
    if (descriptor.kind === 'number') {
      const value = parseNumber(after.value);
      if (value === null || (descriptor.min !== undefined && value < descriptor.min) || (descriptor.max !== undefined && value > descriptor.max) || (descriptor.integer && !Number.isInteger(value))) {
        return diagnostic('invalid_patch_value', descriptor.path, { reason: 'value is outside the supported range' });
      }
    } else if (typeof after.value !== 'string') {
      return diagnostic('invalid_patch_value', descriptor.path, { reason: 'a text option is required' });
    } else if (descriptor.kind === 'boolean' && after.value !== 'true' && after.value !== 'false') {
      return diagnostic('invalid_patch_value', descriptor.path, { reason: 'choose yes or no' });
    } else if (descriptor.kind === 'enum' && descriptor.options && !descriptor.options.includes(after.value)) {
      return diagnostic('invalid_patch_value', descriptor.path, { reason: 'option is not supported' });
    } else if (descriptor.reference === 'formula-line' && !formulaLineIds(formula).includes(after.value)) {
      return diagnostic('foreign_process_reference', descriptor.path, { id: after.value });
    }
    return null;
  }
  if (target.kind === 'step-sequence') {
    const value = parseNumber(after.value);
    return value === null || value < 1 || !Number.isInteger(value)
      ? diagnostic('invalid_patch_value', 'ingredientAddition.steps.sequence', { reason: 'sequence must be a positive integer' })
      : null;
  }
  if (target.kind === 'step-action') {
    return typeof after.value !== 'string' || !PROCESS_ADDITION_ACTIONS.includes(after.value as (typeof PROCESS_ADDITION_ACTIONS)[number])
      ? diagnostic('invalid_patch_value', 'ingredientAddition.steps.action', { reason: 'action is not supported' })
      : null;
  }
  if (target.kind === 'step-duration') {
    const value = parseNumber(after.value);
    return value === null || value < 0 ? diagnostic('invalid_patch_value', 'ingredientAddition.steps.durationSeconds', { reason: 'duration cannot be negative' }) : null;
  }
  if (target.kind === 'step-line-ids') {
    return !Array.isArray(after.value) || after.value.some((id) => typeof id !== 'string' || !formulaLineIds(formula).includes(id))
      ? diagnostic('foreign_process_reference', 'ingredientAddition.steps.lineIds', { reason: 'a selected formula line is not available' })
      : null;
  }
  return null;
}

function validatePatchAgainstDrafts(
  patch: CounterfactualPatch,
  formula: FormulaDraft,
  process: ProcessDraft,
): { target: ResolvedTarget | null; diagnostic: ExplorationDiagnostic | null } {
  const owner = pathOwner(patch.path);
  if (!owner) return { target: null, diagnostic: diagnostic('unknown_patch_path', patch.path, { path: patch.path }) };
  if (owner !== patch.owner) {
    return { target: null, diagnostic: diagnostic('patch_owner_mismatch', patch.path, { owner: patch.owner, expected: owner }) };
  }
  const revisionDiagnostic = validateExpectedRevisions(patch, formula, process);
  if (revisionDiagnostic) return { target: null, diagnostic: revisionDiagnostic };
  const targetOrDiagnostic = resolveTarget(formula, process, patch.path);
  if ('code' in targetOrDiagnostic) return { target: null, diagnostic: targetOrDiagnostic };
  if (!semanticEqualIgnoringReason(targetOrDiagnostic.currentState, patch.before)) {
    return {
      target: null,
      diagnostic: diagnostic('baseline_revision_conflict', patch.path, { reason: 'the value changed before this patch was applied' }),
    };
  }
  const afterDiagnostic = validateAfter(targetOrDiagnostic, patch.after, formula);
  return { target: afterDiagnostic ? null : targetOrDiagnostic, diagnostic: afterDiagnostic };
}

function applyPatchToDrafts(
  pair: MaterializedScenario,
  patch: CounterfactualPatch,
): ExplorationDiagnostic | null {
  const validation = validatePatchAgainstDrafts(patch, pair.formula, pair.process);
  if (validation.diagnostic || !validation.target) return validation.diagnostic ?? diagnostic('invalid_patch_value', patch.path, {});
  validation.target.apply(pair.formula, pair.process, canonicalScalarValue(patch.after, validation.target.kind));
  if (patch.owner === 'formula') pair.formula.revision += 1;
  else pair.process.revision += 1;
  return null;
}

function materializeScenario(scenario: CounterfactualScenario): MaterializationResult {
  const pair: MaterializedScenario = {
    formula: clone(scenario.baseline.formula),
    process: clone(scenario.baseline.process),
  };
  for (const patch of scenario.patches) {
    const patchDiagnostic = applyPatchToDrafts(pair, patch);
    if (patchDiagnostic) return { data: null, diagnostic: patchDiagnostic };
  }
  return { data: pair, diagnostic: null };
}

function versionSet(snapshot: ExplorationAnalysisSnapshot): ExplorationModelVersions {
  return {
    catalogVersion: snapshot.handoff.data?.catalogVersion ?? '',
    handoffModelVersion: snapshot.handoff.data?.modelVersion ?? '',
    intrinsicModelVersion: snapshot.intrinsic?.modelVersion,
    effectiveModelVersion: snapshot.effective?.modelVersion,
    classificationModelVersion: snapshot.classification?.modelVersion,
  };
}

function versionMismatches(before: ExplorationModelVersions, after: ExplorationModelVersions): string[] {
  return (Object.keys(before) as Array<keyof ExplorationModelVersions>).filter((key) => {
    const left = before[key] ?? '';
    const right = after[key] ?? '';
    return left !== right;
  });
}

function numericMetric(
  family: ComparisonMetricFamily,
  metric: { key: string; value?: number; unit: string; status: string; coverage: number; confidence: number },
) {
  return {
    key: `${family}:${metric.key}`,
    family,
    metricKey: metric.key,
    value: metric.value,
    unit: metric.unit,
    status: metric.status,
    coverage: metric.coverage,
    confidence: metric.confidence,
  };
}

function metricChanges(baseline: ExplorationAnalysisSnapshot, counterfactual: ExplorationAnalysisSnapshot): MetricChange[] {
  const before = [
    ...(baseline.intrinsic?.metrics ?? []).map((metric) => numericMetric('intrinsic', metric)),
    ...(baseline.effective?.metrics ?? []).map((metric) => numericMetric('effective', metric)),
  ];
  const after = [
    ...(counterfactual.intrinsic?.metrics ?? []).map((metric) => numericMetric('intrinsic', metric)),
    ...(counterfactual.effective?.metrics ?? []).map((metric) => numericMetric('effective', metric)),
  ];
  const byKey = new Map(after.map((metric) => [metric.key, metric]));
  const keys = [...new Set([...before.map((metric) => metric.key), ...after.map((metric) => metric.key)])];
  return keys.map((key) => {
    const left = before.find((metric) => metric.key === key);
    const right = byKey.get(key);
    const leftComparable = left?.value !== undefined && Number.isFinite(left.value) && left.status !== 'unavailable' && left.status !== 'not_applicable';
    const rightComparable = right?.value !== undefined && Number.isFinite(right.value) && right.status !== 'unavailable' && right.status !== 'not_applicable';
    const bothComparable = leftComparable && rightComparable;
    const delta = bothComparable ? (right?.value as number) - (left?.value as number) : undefined;
    return {
      key,
      family: right?.family ?? left?.family ?? 'intrinsic',
      metricKey: right?.metricKey ?? left?.metricKey ?? key,
      status: !bothComparable ? 'unavailable' : delta === 0 ? 'unchanged' : 'changed',
      before: leftComparable ? left?.value : undefined,
      after: rightComparable ? right?.value : undefined,
      delta,
      unit: right?.unit ?? left?.unit ?? '',
      beforeStatus: left?.status ?? 'unavailable',
      afterStatus: right?.status ?? 'unavailable',
      availabilityChanged: leftComparable !== rightComparable,
      beforeCoverage: left?.coverage ?? 0,
      afterCoverage: right?.coverage ?? 0,
      beforeConfidence: left?.confidence ?? 0,
      afterConfidence: right?.confidence ?? 0,
    } satisfies MetricChange;
  });
}

function baseEvidence(baseline: ExplorationBaseline): ComparisonEvidence {
  return {
    formulaRevision: { before: baseline.formulaRevision },
    processRevision: { before: baseline.processRevision },
    catalogVersion: { before: baseline.catalogVersion },
    modelVersions: { before: baseline.modelVersions },
  };
}

function invalidComparison(
  scenario: CounterfactualScenario,
  outcome: Exclude<ComparisonOutcome, 'completed' | 'partial'>,
  errors: ExplorationDiagnostic[],
  evidence = baseEvidence(scenario.baseline),
): ComparisonResult {
  return {
    baseline: scenario.baseline.snapshot,
    baselineId: scenario.baseline.baselineId,
    changedPaths: [...new Set(scenario.patches.map((patch) => patch.path))],
    metricChanges: [],
    evidence,
    limitations: [],
    outcome,
    diagnostics: errors,
  };
}

function snapshotConflict(
  scenario: CounterfactualScenario,
  pair: MaterializedScenario,
  snapshot: ExplorationAnalysisSnapshot,
): ExplorationDiagnostic[] {
  const diagnostics: ExplorationDiagnostic[] = [];
  const baselineData = scenario.baseline.snapshot.handoff.data;
  const counterfactualData = snapshot.handoff.data;
  if (snapshot.handoff.formulaId !== scenario.baseline.snapshot.handoff.formulaId || counterfactualData?.formulaId !== baselineData?.formulaId) {
    diagnostics.push(diagnostic('foreign_formula_reference', 'formula.formulaId', { expected: pair.formula.formulaId, actual: snapshot.handoff.formulaId }));
  }
  if (snapshot.handoff.processId !== scenario.baseline.snapshot.handoff.processId || counterfactualData?.processId !== baselineData?.processId) {
    diagnostics.push(diagnostic('foreign_process_reference', 'process.processId', { expected: pair.process.processId, actual: snapshot.handoff.processId }));
  }
  if (snapshot.handoff.formulaRevision !== pair.formula.revision || counterfactualData?.formulaRevision !== pair.formula.revision) {
    diagnostics.push(diagnostic('baseline_revision_conflict', 'formula.revision', { expected: pair.formula.revision, actual: snapshot.handoff.formulaRevision }));
  }
  if (snapshot.handoff.processRevision !== pair.process.revision || counterfactualData?.processRevision !== pair.process.revision) {
    diagnostics.push(diagnostic('baseline_revision_conflict', 'process.revision', { expected: pair.process.revision, actual: snapshot.handoff.processRevision }));
  }
  const mismatches = versionMismatches(versionSet(scenario.baseline.snapshot), versionSet(snapshot));
  if (mismatches.length > 0) diagnostics.push(diagnostic('model_version_mismatch', 'modelVersions', { versions: mismatches.join(', ') }));
  return diagnostics;
}

export function createExplorationBaseline(input: CreateBaselineInput): ExplorationBaseline {
  const catalogVersion = input.snapshot.handoff.data?.catalogVersion ?? '';
  const modelVersion = input.snapshot.handoff.data?.modelVersion ?? '';
  const modelVersions = versionSet(input.snapshot);
  const baselineId = input.baselineId ?? [
    'exploration-baseline',
    input.formula.formulaId,
    input.formula.revision,
    input.process.processId,
    input.process.revision,
    catalogVersion,
    modelVersion,
  ].join(':');
  return {
    baselineId,
    formula: cloneFrozen(input.formula),
    process: cloneFrozen(input.process),
    snapshot: cloneFrozen(input.snapshot),
    formulaRevision: input.formula.revision,
    processRevision: input.process.revision,
    catalogVersion,
    modelVersion,
    modelVersions: cloneFrozen(modelVersions),
    capturedAt: input.capturedAt ?? new Date().toISOString(),
  };
}

export function createCounterfactualScenario(
  baseline: ExplorationBaseline,
  scenarioId = `${baseline.baselineId}:scenario:1`,
): CounterfactualScenario {
  return {
    scenarioId,
    revision: 1,
    baseline,
    patches: [],
    status: 'editing',
  };
}

export function readExplorationPath(scenario: CounterfactualScenario, path: string): ExplorationPatchValue | null {
  const materialized = materializeScenario(scenario);
  if (!materialized.data) return null;
  const target = resolveTarget(materialized.data.formula, materialized.data.process, path);
  return 'code' in target ? null : clone(target.currentState);
}

export function createCounterfactualPatch(scenario: CounterfactualScenario, input: PatchInput): PatchBuildResult {
  const materialized = materializeScenario(scenario);
  if (materialized.diagnostic || !materialized.data) return { patch: null, diagnostic: materialized.diagnostic };
  const target = resolveTarget(materialized.data.formula, materialized.data.process, input.path);
  if ('code' in target) return { patch: null, diagnostic: target };
  const patch: CounterfactualPatch = {
    patchId: input.patchId,
    owner: input.owner,
    path: input.path,
    before: clone(target.currentState),
    after: clone(input.after),
    expectedFormulaRevision: input.expectedFormulaRevision,
    expectedProcessRevision: input.expectedProcessRevision,
    source: input.source ?? 'workspace',
  };
  const validation = validatePatchAgainstDrafts(patch, materialized.data.formula, materialized.data.process);
  return validation.diagnostic
    ? { patch: null, diagnostic: validation.diagnostic }
    : { patch, diagnostic: null };
}

export function validateCounterfactualPatch(
  scenario: CounterfactualScenario,
  patch: CounterfactualPatch,
): ExplorationDiagnostic | null {
  const materialized = materializeScenario(scenario);
  if (materialized.diagnostic || !materialized.data) return materialized.diagnostic;
  return validatePatchAgainstDrafts(patch, materialized.data.formula, materialized.data.process).diagnostic;
}

export function applyCounterfactualPatch(
  scenario: CounterfactualScenario,
  patch: CounterfactualPatch,
): PatchApplicationResult {
  const materialized = materializeScenario(scenario);
  if (materialized.diagnostic || !materialized.data) return { scenario, diagnostic: materialized.diagnostic };
  const validation = validatePatchAgainstDrafts(patch, materialized.data.formula, materialized.data.process);
  if (validation.diagnostic || !validation.target) return { scenario, diagnostic: validation.diagnostic };
  return {
    scenario: {
      ...scenario,
      revision: scenario.revision + 1,
      patches: [...scenario.patches, clone({ ...patch, before: validation.target.currentState, after: canonicalScalarValue(patch.after, validation.target.kind) })],
      status: 'ready',
    },
    diagnostic: null,
  };
}

export function resetExploration(scenario: CounterfactualScenario): CounterfactualScenario {
  return {
    ...scenario,
    revision: scenario.revision + 1,
    patches: [],
    status: 'editing',
  };
}

function counterfactualFailure(
  scenario: CounterfactualScenario,
  snapshot: ExplorationAnalysisSnapshot,
): ComparisonResult {
  const outcome = snapshot.handoff.outcome === 'conflict' ? 'conflict' : 'rejected';
  const first = snapshot.handoff.diagnostics[0];
  const code: ExplorationDiagnosticCode = outcome === 'conflict'
    ? first?.code === 'STALE_REVISION'
      ? 'baseline_revision_conflict'
      : first?.code === 'CATALOG_VERSION_MISMATCH'
        ? 'model_version_mismatch'
        : first?.code === 'REFERENCE_MISMATCH'
          ? 'counterfactual_reference_conflict'
          : 'counterfactual_reference_conflict'
    : first?.code === 'PROCESS_NORMALIZATION_BLOCKED'
      ? 'counterfactual_process_invalid'
      : 'counterfactual_formula_invalid';
  const failure = diagnostic(code, first?.path ?? 'counterfactual', { detail: first?.code ?? outcome }, first?.code);
  return invalidComparison(scenario, outcome, [failure], baseEvidence(scenario.baseline));
}

export function evaluateCounterfactual(
  scenario: CounterfactualScenario,
  evaluate: ExplorationEvaluator,
): ComparisonResult {
  const materialized = materializeScenario(scenario);
  if (materialized.diagnostic || !materialized.data) {
    return invalidComparison(scenario, 'rejected', [materialized.diagnostic ?? diagnostic('invalid_patch_value', 'counterfactual', {})]);
  }
  const snapshot = evaluate(materialized.data.formula, materialized.data.process);
  if (snapshot.handoff.outcome === 'rejected' || snapshot.handoff.outcome === 'conflict' || !snapshot.handoff.data) {
    return counterfactualFailure(scenario, snapshot);
  }
  const consistencyDiagnostics = snapshotConflict(scenario, materialized.data, snapshot);
  if (consistencyDiagnostics.length > 0) {
    return invalidComparison(scenario, 'conflict', consistencyDiagnostics, {
      ...baseEvidence(scenario.baseline),
      formulaRevision: { before: scenario.baseline.formulaRevision, after: materialized.data.formula.revision },
      processRevision: { before: scenario.baseline.processRevision, after: materialized.data.process.revision },
      catalogVersion: { before: scenario.baseline.catalogVersion, after: snapshot.handoff.data.catalogVersion },
      modelVersions: { before: scenario.baseline.modelVersions, after: versionSet(snapshot) },
    });
  }
  const partial = snapshot.handoff.outcome === 'partial'
    || snapshot.intrinsic?.outcome === 'partial'
    || snapshot.effective?.outcome === 'partial';
  const diagnostics = partial
    ? [diagnostic('counterfactual_analysis_partial', 'counterfactual', { limitations: snapshot.handoff.limitations.length })]
    : [];
  return {
    baseline: scenario.baseline.snapshot,
    counterfactual: snapshot,
    baselineId: scenario.baseline.baselineId,
    changedPaths: [...new Set(scenario.patches.map((patch) => patch.path))],
    metricChanges: metricChanges(scenario.baseline.snapshot, snapshot),
    evidence: {
      formulaRevision: { before: scenario.baseline.formulaRevision, after: materialized.data.formula.revision },
      processRevision: { before: scenario.baseline.processRevision, after: materialized.data.process.revision },
      catalogVersion: { before: scenario.baseline.catalogVersion, after: snapshot.handoff.data.catalogVersion },
      modelVersions: { before: scenario.baseline.modelVersions, after: versionSet(snapshot) },
    },
    limitations: snapshot.handoff.limitations.map((item) => item.path),
    outcome: partial ? 'partial' : 'completed',
    diagnostics,
  };
}
