import { describe, expect, it } from 'vitest';
import { GOLD_FORMULAS_RELEASE } from '../../data/reference/release';
import {
  analyzeFormulaWorkspaceDraft,
  browseReferenceFormulaDrafts,
  resolveReferenceFormulaDraft,
  startFormulaWorkspaceFromBlank,
  startFormulaWorkspaceFromReference,
} from './formula-workspace';

describe('reference-start application boundary', () => {
  it('keeps the published catalog bounded while preserving localized preparation data', () => {
    const result = browseReferenceFormulaDrafts({ locale: 'el', page: 1, pageSize: 8 });

    expect(result.outcome).toBe('completed');
    expect(result.items).toHaveLength(8);
    expect(result.totalItems).toBe(GOLD_FORMULAS_RELEASE?.records.length);
    expect(result.items.every((item) => item.publicSelectable)).toBe(true);
    expect(result.items.every((item) => item.label.el.length > 0)).toBe(true);
  });

  it('resolves one eligible record and creates a local Formula/Process pair', () => {
    const browse = browseReferenceFormulaDrafts({ locale: 'en', page: 1, pageSize: 8 });
    const summary = browse.items[0];
    if (!summary) throw new Error('published release should contain a reference record');

    const resolved = resolveReferenceFormulaDraft(summary.releaseId, summary.recordId);
    expect(resolved.outcome).toBe('selected');
    if (!resolved.record) throw new Error('eligible summary should resolve');

    const started = startFormulaWorkspaceFromReference(resolved.record);
    expect(started.outcome).toBe('selected');
    expect(started.formula?.sourceReference?.sourceRecordId).toBe(summary.recordId);
    expect(started.process?.sourceReference?.sourceRecordId).toBe(summary.recordId);

    if (!started.formula || !started.process) throw new Error('selected reference should produce both drafts');
    const analysis = analyzeFormulaWorkspaceDraft(started.formula, started.process);
    expect(analysis.handoff.data?.formula.formulaId).toBe(started.formula.formulaId);
    expect(analysis.handoff.data?.process.formulaId).toBe(started.formula.formulaId);
  });

  it('keeps record order and semantic snapshots identical across locales', () => {
    const english = browseReferenceFormulaDrafts({ locale: 'en', page: 1, pageSize: 8 });
    const greek = browseReferenceFormulaDrafts({ locale: 'el', page: 1, pageSize: 8 });

    expect(english.items.map((item) => item.recordId)).toEqual(greek.items.map((item) => item.recordId));
    expect(english.items.map((item) => item.preparationKey)).toEqual(greek.items.map((item) => item.preparationKey));
    expect(english.items.every((item) => item.label.en.length > 0)).toBe(true);
    expect(greek.items.every((item) => item.label.el.length > 0)).toBe(true);
  });

  it('keeps the Blank path independent from the release', () => {
    const blank = startFormulaWorkspaceFromBlank();

    expect(blank.outcome).toBe('blank_selected');
    expect(blank.formula?.sourceReference).toBeUndefined();
    expect(blank.process?.sourceReference).toBeUndefined();
  });
});
