import { normalizeFormula, validateFormula } from '../domain/normalization';
import type { Diagnostic, FormulaDraft, NormalizationOutcome } from '../domain/types';
import { normalizeProcess, validateProcess } from '../domain/process';
import type { ProcessDiagnostic, ProcessDraft, ProcessNormalizationOutcome } from '../domain/process';
import { prepareAnalysisInput } from '../domain/handoff';
import type { AnalysisInputOutcome, PrepareAnalysisInputOptions } from '../domain/handoff';
import { calculateIntrinsicMetrics } from '../domain/composition';
import type { IntrinsicAnalysisResult } from '../domain/types';
import { evaluateEffectiveBehavior } from '../domain/effective';
import type { EffectiveAnalysisResult } from '../domain/effective';
import type { FormulaProcessReference } from '../domain/handoff';
import { buildClassificationFeatureSet, classifyFormula } from '../domain/classification';
import type { ClassificationFeatureSetResult, ClassificationResult } from '../domain/classification';
import { loadPrototypeCatalog } from '../../data/prototypes/catalog';
import type { PrototypeCatalogLoadResult } from '../domain/prototype-catalog';
import {
  applyCounterfactualPatch,
  createCounterfactualPatch,
  createCounterfactualScenario,
  createExplorationBaseline,
  evaluateCounterfactual,
  resetExploration,
  type ComparisonResult,
  type CounterfactualPatch,
  type CounterfactualScenario,
  type ExplorationAnalysisSnapshot,
  type ExplorationBaseline,
  type ExplorationDiagnostic,
  type PatchApplicationResult,
  type PatchBuildResult,
  type PatchInput,
} from '../domain/exploration';

/**
 * Application boundary for the local Formula Explorer.
 * UI code calls intent-shaped operations; domain rules stay in the domain module.
 */
export function normalizeFormulaDraft(draft: FormulaDraft): NormalizationOutcome {
  return normalizeFormula(draft);
}

export function validateFormulaDraft(draft: FormulaDraft): Diagnostic[] {
  return validateFormula(draft);
}

export function calculateIntrinsicMetricsDraft(draft: FormulaDraft): IntrinsicAnalysisResult | null {
  const normalized = normalizeFormula(draft);
  return normalized.data ? calculateIntrinsicMetrics(normalized.data) : null;
}

export function normalizeProcessDraft(process: ProcessDraft, formulaLineIds: string[] = []): ProcessNormalizationOutcome {
  return normalizeProcess(process, formulaLineIds);
}

export function validateProcessDraft(process: ProcessDraft, formulaLineIds: string[] = []): ProcessDiagnostic[] {
  return validateProcess(process, formulaLineIds);
}

export function prepareAnalysisInputDraft(
  formula: FormulaDraft,
  process: ProcessDraft,
  options: PrepareAnalysisInputOptions = {},
): AnalysisInputOutcome {
  return prepareAnalysisInput(formula, process, options);
}

export function evaluateEffectiveBehaviorDraft(reference: FormulaProcessReference): EffectiveAnalysisResult {
  return evaluateEffectiveBehavior({
    reference,
    intrinsic: calculateIntrinsicMetrics(reference.formula),
  });
}

export function buildClassificationFeatureSetDraft(
  reference: FormulaProcessReference,
  intrinsic: IntrinsicAnalysisResult,
  effective: EffectiveAnalysisResult,
  catalog: PrototypeCatalogLoadResult = loadPrototypeCatalog(),
): ClassificationFeatureSetResult {
  return buildClassificationFeatureSet({ reference, intrinsic, effective, catalog });
}

export function classifyFormulaDraft(
  reference: FormulaProcessReference,
  intrinsic: IntrinsicAnalysisResult,
  effective: EffectiveAnalysisResult,
  catalog: PrototypeCatalogLoadResult = loadPrototypeCatalog(),
): ClassificationResult {
  return classifyFormula({ reference, intrinsic, effective, catalog });
}

export interface ExplorationBaselineCapture {
  analysis: ExplorationAnalysisSnapshot;
  baseline: ExplorationBaseline | null;
}

/**
 * Runs the same local analysis used by the visible workspace. Keeping this
 * operation here gives counterfactual evaluation one application boundary and
 * prevents the exploration engine from depending on Svelte state.
 */
export function analyzeFormulaWorkspaceDraft(
  formula: FormulaDraft,
  process: ProcessDraft,
  options: PrepareAnalysisInputOptions = {},
): ExplorationAnalysisSnapshot {
  const requestedPath = options.requestedPath ?? 'full';
  const handoff = prepareAnalysisInputDraft(formula, process, options);
  if (!handoff.data) {
    return { handoff, intrinsic: null, effective: null, classification: null };
  }

  const intrinsic = calculateIntrinsicMetrics(handoff.data.formula);
  const effective = requestedPath === 'composition'
    ? null
    : evaluateEffectiveBehavior({ reference: handoff.data, intrinsic });
  const classification = requestedPath === 'full' && effective
    ? classifyFormula({
        reference: handoff.data,
        intrinsic,
        effective,
        catalog: loadPrototypeCatalog(),
      })
    : null;
  return { handoff, intrinsic, effective, classification };
}

export function captureExplorationBaselineDraft(
  formula: FormulaDraft,
  process: ProcessDraft,
  options: PrepareAnalysisInputOptions = {},
): ExplorationBaselineCapture {
  const analysis = analyzeFormulaWorkspaceDraft(formula, process, { ...options, requestedPath: 'full' });
  const baseline = analysis.handoff.data && (analysis.handoff.outcome === 'completed' || analysis.handoff.outcome === 'partial')
    ? createExplorationBaseline({ formula, process, snapshot: analysis })
    : null;
  return { analysis, baseline };
}

export function createExplorationScenarioDraft(baseline: ExplorationBaseline): CounterfactualScenario {
  return createCounterfactualScenario(baseline);
}

export function createExplorationPatchDraft(
  scenario: CounterfactualScenario,
  input: PatchInput,
): PatchBuildResult {
  return createCounterfactualPatch(scenario, input);
}

export function applyExplorationPatchDraft(
  scenario: CounterfactualScenario,
  patch: CounterfactualPatch,
): PatchApplicationResult {
  return applyCounterfactualPatch(scenario, patch);
}

export function evaluateExplorationScenarioDraft(scenario: CounterfactualScenario): ComparisonResult {
  return evaluateCounterfactual(scenario, (formula, process) => analyzeFormulaWorkspaceDraft(formula, process, {
    requestedPath: 'full',
    expectedFormulaRevision: formula.revision,
    expectedProcessRevision: process.revision,
  }));
}

export function resetExplorationDraft(scenario: CounterfactualScenario): CounterfactualScenario {
  return resetExploration(scenario);
}

export type { ExplorationAnalysisSnapshot, ExplorationBaseline, ExplorationDiagnostic };
