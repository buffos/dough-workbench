import { describe, expect, it } from 'vitest';
import { GOLD_FORMULAS_RELEASE } from '../../data/reference/release';
import { loadPrototypeCatalog } from '../../data/prototypes/catalog';
import {
  validatePrototypeAssignments,
  type PrototypeAssignmentValidationReport,
} from './prototype-validation';

function catalogSnapshot() {
  const catalog = loadPrototypeCatalog();
  expect(catalog.status).toBe('available');
  if (catalog.status !== 'available') throw new Error('catalog fixture should be available');
  return catalog.snapshot;
}

describe('prototype assignment validator', () => {
  it('accepts every assigned first-party reference that fits its prototype', () => {
    const report = validatePrototypeAssignments(GOLD_FORMULAS_RELEASE.records, catalogSnapshot());

    expect(report.outcome).toBe('pass');
    expect(report.diagnostics).toEqual([]);
  });

  it('rejects a reference assigned to the wrong prototype', () => {
    const record = GOLD_FORMULAS_RELEASE.records.find((candidate) => candidate.identity.preparationKey === 'cracker-dough');
    expect(record).toBeDefined();
    if (!record) return;

    const report: PrototypeAssignmentValidationReport = validatePrototypeAssignments([
      { ...record, identity: { ...record.identity, prototypeId: 'prototype.breadsticks' } },
    ], catalogSnapshot());

    expect(report.outcome).toBe('fail');
    expect(report.diagnostics.some((item) => item.code === 'PROTOTYPE_FAMILY_MISMATCH')).toBe(true);
    expect(report.diagnostics.some((item) => item.code === 'PROTOTYPE_ASSIGNMENT_CONFLICT')).toBe(true);
  });
});
