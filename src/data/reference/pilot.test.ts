import { describe, expect, it } from 'vitest';
import { PILOT_CAPTURE_VERSION, PILOT_DATASET } from './pilot';
import { COVERAGE_INVENTORY } from './coverage';
import { STARTER_CATALOG_VERSION } from '../ingredients/starter-catalog';

describe('reference acquisition pilot', () => {
  it('assembles a deterministic first-party breadstick and cracker set without publishing third-party recipes', () => {
    expect(PILOT_DATASET.definitions).toHaveLength(57);
    expect(PILOT_DATASET.captures).toHaveLength(57);
    expect(PILOT_DATASET.runs).toHaveLength(57);
    expect(PILOT_DATASET.normalizedCandidates).toHaveLength(57);
    expect(PILOT_DATASET.reviewedCandidates).toHaveLength(57);
    expect(PILOT_DATASET.reviews).toHaveLength(57);
    expect(PILOT_DATASET.runs.every((run) => run.method === 'manual-capture' && run.toolVersion === PILOT_CAPTURE_VERSION)).toBe(true);
    expect(PILOT_DATASET.report.acceptedCandidateIds).toHaveLength(57);
    expect(PILOT_DATASET.report.unresolvedGaps.length).toBeGreaterThan(0);
    expect(PILOT_DATASET.report.blockedEntries.length).toBeGreaterThan(0);
    expect(PILOT_DATASET.report.missingInventoryEntries).toHaveLength(COVERAGE_INVENTORY.entries.length - 57);
    expect(Object.values(PILOT_DATASET.report.categoryCounts)).toHaveLength(11);
    expect(PILOT_DATASET.report.categoryCounts['yeasted-breads']?.acceptedCount).toBe(9);
    expect(PILOT_DATASET.report.categoryCounts['pastry-pie-tart-cracker']?.acceptedCount).toBe(13);
    expect(PILOT_DATASET.report.categoryCounts['pancakes-crepes-waffles']?.acceptedCount).toBe(26);
    expect(PILOT_DATASET.report.categoryCounts['fried-doughs-batters']?.acceptedCount).toBe(8);
    expect(PILOT_DATASET.report.categoryCounts['cakes-quick-breads']?.acceptedCount).toBe(1);
    expect(PILOT_DATASET.report.categoryCounts['yeasted-breads']?.targetMet).toBe(true);
    expect(PILOT_DATASET.handoff.immutable).toBe(true);
    expect(PILOT_DATASET.handoff.candidateIds).toHaveLength(57);
  });

  it('keeps candidate identities, source facts, traces, and bilingual review evidence aligned', () => {
    const candidateIds = PILOT_DATASET.reviewedCandidates.map((candidate) => candidate.candidateId);
    expect(new Set(candidateIds).size).toBe(57);
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
      expect(['source.dfi-internal-breadsticks', 'source.dfi-internal-crackers', 'source.dfi-internal-batters']).toContain(candidate.sourceId);
    });
  });

  it('keeps first-party batter names readable on the public formula list', () => {
    const batterEntries = COVERAGE_INVENTORY.entries.filter((entry) => entry.preparationKey.startsWith('batter-'));
    expect(batterEntries).toHaveLength(35);
    expect(batterEntries.every((entry) => !/canonical|expert seed/i.test(`${entry.label.en} ${entry.label.el}`))).toBe(true);
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

    const batterCandidates = PILOT_DATASET.reviewedCandidates.filter((candidate) => candidate.sourceId === 'source.dfi-internal-batters');
    expect(batterCandidates).toHaveLength(35);
    expect(batterCandidates.every((candidate) => candidate.processPresent && candidate.process !== null)).toBe(true);
    expect(batterCandidates.every((candidate) => candidate.sourceFacts.some((fact) => /batters\.txt#L\d+-L\d+/.test(fact.sourceLocator)))).toBe(true);
    expect(batterCandidates.every((candidate) => candidate.formula?.ingredientLines.every((line) => line.mass.value > 0))).toBe(true);

    const beer = batterCandidates.find((candidate) => candidate.preparationKey === 'batter-beer-canonical');
    const beerLine = beer?.formula?.ingredientLines.find((line) => line.name === 'Beer');
    expect(beerLine?.definitionSource).toBe('custom');
    expect(beerLine?.composition.water.state).toBe('unknown');
  });
});
