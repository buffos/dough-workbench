import { normalizeFormula, validateFormula } from '../domain/normalization';
import type { Diagnostic, FormulaDraft, NormalizationOutcome } from '../domain/types';

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
