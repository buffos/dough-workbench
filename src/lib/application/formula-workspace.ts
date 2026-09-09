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
