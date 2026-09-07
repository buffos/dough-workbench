import { normalizeFormula, validateFormula } from '../domain/normalization';
import type { Diagnostic, FormulaDraft, NormalizationOutcome } from '../domain/types';
import { normalizeProcess, validateProcess } from '../domain/process';
import type { ProcessDiagnostic, ProcessDraft, ProcessNormalizationOutcome } from '../domain/process';
import { prepareAnalysisInput } from '../domain/handoff';
import type { AnalysisInputOutcome, PrepareAnalysisInputOptions } from '../domain/handoff';

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
