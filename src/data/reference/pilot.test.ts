import { describe, expect, it } from 'vitest';
import { PILOT_CAPTURE_VERSION, PILOT_DATASET } from './pilot';
import { COVERAGE_INVENTORY } from './coverage';
import { STARTER_CATALOG_VERSION } from '../ingredients/starter-catalog';

describe('reference acquisition pilot', () => {
  it('assembles a deterministic, two-per-category pilot without publishing a release', () => {
    expect(PILOT_DATASET.definitions).toHaveLength(22);
    expect(PILOT_DATASET.captures).toHaveLength(22);
    expect(PILOT_DATASET.runs).toHaveLength(22);
    expect(PILOT_DATASET.normalizedCandidates).toHaveLength(22);
    expect(PILOT_DATASET.reviewedCandidates).toHaveLength(22);
    expect(PILOT_DATASET.reviews).toHaveLength(22);
    expect(PILOT_DATASET.runs.every((run) => run.method === 'manual-capture' && run.toolVersion === PILOT_CAPTURE_VERSION)).toBe(true);
    expect(PILOT_DATASET.report.acceptedCandidateIds).toHaveLength(22);
    expect(PILOT_DATASET.report.unresolvedGaps).toEqual([]);
    expect(PILOT_DATASET.report.blockedEntries).toEqual([]);
    expect(PILOT_DATASET.report.missingInventoryEntries).toHaveLength(COVERAGE_INVENTORY.entries.length - 22);
    expect(Object.values(PILOT_DATASET.report.categoryCounts)).toHaveLength(11);
    expect(Object.values(PILOT_DATASET.report.categoryCounts).every((item) => item.acceptedCount === 2 && item.targetMet)).toBe(true);
    expect(PILOT_DATASET.handoff.immutable).toBe(true);
    expect(PILOT_DATASET.handoff.candidateIds).toHaveLength(22);
  });

  it('keeps candidate identities, source facts, traces, and bilingual review evidence aligned', () => {
    const candidateIds = PILOT_DATASET.reviewedCandidates.map((candidate) => candidate.candidateId);
    expect(new Set(candidateIds).size).toBe(22);
    PILOT_DATASET.reviewedCandidates.forEach((candidate, index) => {
      const run = PILOT_DATASET.runs[index];
      expect(candidate.status).toBe('ready-for-release');
      expect(candidate.review?.decision).toBe('accepted-for-release');
      expect(candidate.review?.reason.en).toBeTruthy();
      expect(candidate.review?.reason.el).toBeTruthy();
      expect(candidate.catalogVersion).toBe(STARTER_CATALOG_VERSION);
      expect(candidate.sourceFacts.map((fact) => fact.factId).sort()).toEqual([...run.factIds].sort());
      expect(candidate.normalization.length).toBeGreaterThan(0);
      expect(candidate.sourceId).toBe(run.sourceId);
      expect(candidate.acquisitionRunId).toBe(run.runId);
      expect(candidate.inputIdentity).toBe(run.inputIdentity);
    });
  });

  it('preserves Unknown composition instead of inventing zero values for incomplete source facts', () => {
    const incomplete = PILOT_DATASET.reviewedCandidates.filter((candidate) => (
      candidate.preparationKey === 'gluten-free-sandwich-loaf'
      || candidate.preparationKey === 'gluten-free-pancake'
      || candidate.preparationKey === 'beignet'
    ));
    expect(incomplete).toHaveLength(3);
    incomplete.forEach((candidate) => {
      const compositionValues = [
        ...candidate.formula!.flourComponents.flatMap((flour) => Object.values(flour.composition ?? {})),
        ...candidate.formula!.ingredientLines.flatMap((line) => Object.values(line.composition)),
      ];
      expect(compositionValues.filter((value) => value.state === 'unknown')).not.toHaveLength(0);
    });
  });
});
