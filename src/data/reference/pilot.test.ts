import { describe, expect, it } from 'vitest';
import { PILOT_CAPTURE_VERSION, PILOT_DATASET } from './pilot';
import { COVERAGE_INVENTORY } from './coverage';
import { STARTER_CATALOG_VERSION } from '../ingredients/starter-catalog';

describe('reference acquisition pilot', () => {
  it('assembles a deterministic first-party breadstick and cracker set without publishing third-party recipes', () => {
    expect(PILOT_DATASET.definitions).toHaveLength(22);
    expect(PILOT_DATASET.captures).toHaveLength(22);
    expect(PILOT_DATASET.runs).toHaveLength(22);
    expect(PILOT_DATASET.normalizedCandidates).toHaveLength(22);
    expect(PILOT_DATASET.reviewedCandidates).toHaveLength(22);
    expect(PILOT_DATASET.reviews).toHaveLength(22);
    expect(PILOT_DATASET.runs.every((run) => run.method === 'manual-capture' && run.toolVersion === PILOT_CAPTURE_VERSION)).toBe(true);
    expect(PILOT_DATASET.report.acceptedCandidateIds).toHaveLength(22);
    expect(PILOT_DATASET.report.unresolvedGaps.length).toBeGreaterThan(0);
    expect(PILOT_DATASET.report.blockedEntries.length).toBeGreaterThan(0);
    expect(PILOT_DATASET.report.missingInventoryEntries).toHaveLength(COVERAGE_INVENTORY.entries.length - 22);
    expect(Object.values(PILOT_DATASET.report.categoryCounts)).toHaveLength(11);
    expect(PILOT_DATASET.report.categoryCounts['yeasted-breads']?.acceptedCount).toBe(9);
    expect(PILOT_DATASET.report.categoryCounts['pastry-pie-tart-cracker']?.acceptedCount).toBe(13);
    expect(PILOT_DATASET.report.categoryCounts['yeasted-breads']?.targetMet).toBe(true);
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
      expect(candidate.sourceId).toBe(run.sourceId);
      expect(['source.dfi-internal-breadsticks', 'source.dfi-internal-crackers']).toContain(candidate.sourceId);
    });
  });

  it('keeps unrecorded composition unknown while preserving explicit internal ingredients', () => {
    const classic = PILOT_DATASET.reviewedCandidates.find((candidate) => candidate.preparationKey === 'breadsticks');
    const salt = classic?.formula?.ingredientLines.find((line) => line.name === 'Salt');
    expect(salt?.composition.fat.state).toBe('none');
    const sourdough = PILOT_DATASET.reviewedCandidates.find((candidate) => candidate.preparationKey === 'breadsticks-sourdough');
    const starter = sourdough?.formula?.ingredientLines.find((line) => line.name.includes('starter'));
    expect(starter?.composition.fat.state).toBe('unknown');

    const breadstickCustomLines = PILOT_DATASET.reviewedCandidates
      .filter((candidate) => candidate.sourceId === 'source.dfi-internal-breadsticks')
      .flatMap((candidate) => (
      candidate.formula?.ingredientLines.filter((line) => line.definitionSource === 'custom') ?? []
      ));
    expect(breadstickCustomLines.length).toBeGreaterThan(0);
    expect(breadstickCustomLines.every((line) => Object.values(line.composition).some((value) => value.state === 'known'))).toBe(true);

    const crackerUnknownLine = PILOT_DATASET.reviewedCandidates
      .find((candidate) => candidate.preparationKey === 'cracker-flaky')
      ?.formula?.ingredientLines.find((line) => line.id === 'fat-lamination');
    expect(crackerUnknownLine?.definitionSource).toBe('custom');
    expect(crackerUnknownLine?.composition.fat.state).toBe('unknown');
  });
});
