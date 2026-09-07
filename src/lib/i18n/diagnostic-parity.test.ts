import { describe, expect, it } from 'vitest';
import { prepareAnalysisInput } from '../domain/handoff';
import {
  createInitialFormulaDraft,
  knownDraftValue,
  normalizeFormula,
  unknownDraftValue,
} from '../domain/normalization';
import { createInitialProcessDraft, normalizeProcess } from '../domain/process';
import { messageKeys } from './messages';

function keyPairs(items: Array<{ messageKey: string; resolutionKey?: string }>): string[] {
  return items.flatMap((item) => [item.messageKey, ...(item.resolutionKey ? [item.resolutionKey] : [])]);
}

describe('bilingual diagnostic presentation contract', () => {
  it('keeps formula, Process, partial, conflict, and correction keys available in both locales', () => {
    const validFormula = createInitialFormulaDraft('diagnostic-parity-formula');
    const validProcess = createInitialProcessDraft(validFormula.formulaId);
    const lineIds = validFormula.ingredientLines.map((line) => line.id);

    const invalidFormula = createInitialFormulaDraft('diagnostic-parity-invalid-formula');
    invalidFormula.flourComponents[0].massGrams = '0';
    const partialFormula = createInitialFormulaDraft('diagnostic-parity-partial-formula');
    partialFormula.ingredientLines[0].composition.water = unknownDraftValue();

    const invalidProcess = createInitialProcessDraft(validFormula.formulaId);
    invalidProcess.mixing.method = knownDraftValue('not-a-process-option');

    const handoffOutcomes = [
      prepareAnalysisInput(validFormula, validProcess, { requestedPath: 'full' }),
      prepareAnalysisInput(partialFormula, validProcess, { requestedPath: 'full' }),
      prepareAnalysisInput(invalidFormula, validProcess, { requestedPath: 'full' }),
      prepareAnalysisInput(validFormula, invalidProcess, { requestedPath: 'full' }),
      prepareAnalysisInput(validFormula, validProcess, { expectedFormulaRevision: 999 }),
      prepareAnalysisInput(validFormula, validProcess, { catalogVersion: 'catalog-v0' }),
      prepareAnalysisInput(validFormula, validProcess, { modelVersion: 'analysis-input-v0' }),
    ];

    const keys = new Set([
      ...keyPairs(normalizeFormula(invalidFormula).diagnostics),
      ...keyPairs(normalizeFormula(partialFormula).diagnostics),
      ...keyPairs(normalizeProcess(invalidProcess, lineIds).diagnostics),
      ...handoffOutcomes.flatMap((outcome) => keyPairs([...outcome.diagnostics, ...outcome.limitations])),
    ]);

    for (const locale of ['en', 'el'] as const) {
      const available = new Set(messageKeys(locale));
      for (const key of keys) {
        expect(available.has(key), `${locale} is missing ${key}`).toBe(true);
      }
    }
  });
});
