import { describe, expect, it } from 'vitest';
import { prepareAnalysisInputDraft, normalizeFormulaDraft, normalizeProcessDraft } from './formula-workspace';
import { createInitialFormulaDraft, knownDraftValue } from '../domain/normalization';
import { createInitialProcessDraft } from '../domain/process';
import type { Locale } from '../i18n/messages';

function canonicalWorkspaceSnapshot(locale: Locale) {
  const formula = createInitialFormulaDraft('locale-parity-formula');
  formula.ingredientLines[0].role = 'continuous_phase';
  formula.ingredientLines[0].compositionOverride = {
    ...formula.ingredientLines[0].compositionOverride,
    water: knownDraftValue(0.92),
  };
  formula.ingredientLines[0].availabilityOverride = knownDraftValue(0.8);

  const process = createInitialProcessDraft(formula.formulaId);
  process.mixing.method = knownDraftValue('machine_knead');
  process.fermentation.bulkTemperatureCelsius = knownDraftValue(24);

  return {
    locale,
    canonical: {
      formula: normalizeFormulaDraft(formula),
      process: normalizeProcessDraft(process, formula.ingredientLines.map((line) => line.id)),
      analysis: prepareAnalysisInputDraft(formula, process, { requestedPath: 'full' }),
    },
  };
}

describe('locale-neutral workspace contract', () => {
  it('produces the same canonical Formula, Process, diagnostics, and readiness for both routes', () => {
    const englishSurface = canonicalWorkspaceSnapshot('en');
    const greekSurface = canonicalWorkspaceSnapshot('el');

    expect(englishSurface.locale).toBe('en');
    expect(greekSurface.locale).toBe('el');
    expect(englishSurface.canonical).toEqual(greekSurface.canonical);
  });
});
