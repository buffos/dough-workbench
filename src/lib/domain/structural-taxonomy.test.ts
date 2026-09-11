import { describe, expect, it } from 'vitest';
import {
  STRUCTURAL_FAMILY_BY_ID,
  STRUCTURAL_FAMILY_NODES,
  STRUCTURAL_MODIFIER_AXES,
  STRUCTURAL_PRIMARY_FAMILY_IDS,
  structuralFamilyAncestry,
  structuralFamilyDepth,
  structuralFamilyMatches,
} from './structural-taxonomy';

describe('canonical structural taxonomy', () => {
  it('contains the 13 primary families and their 41 child families', () => {
    expect(STRUCTURAL_PRIMARY_FAMILY_IDS).toHaveLength(13);
    expect(STRUCTURAL_FAMILY_NODES).toHaveLength(54);
    expect(STRUCTURAL_FAMILY_NODES.filter((node) => node.parentId !== null)).toHaveLength(41);
    expect(new Set(STRUCTURAL_FAMILY_NODES.map((node) => node.id)).size).toBe(54);
    expect(STRUCTURAL_FAMILY_NODES.every((node) => node.label.en.trim() && node.label.el.trim())).toBe(true);
    expect(STRUCTURAL_FAMILY_NODES
      .filter((node) => node.parentId !== null)
      .every((node) => node.parentId && STRUCTURAL_FAMILY_BY_ID[node.parentId]))
      .toBe(true);
  });

  it('uses the primary mechanism hierarchy for filtering and ancestry', () => {
    const brioche = 'family.fermented-gluten.rich-enriched';
    const fermentedGluten = 'family.fermented-gluten';
    const laminated = 'family.laminated-gluten';

    expect(structuralFamilyDepth(fermentedGluten)).toBe(0);
    expect(structuralFamilyDepth(brioche)).toBe(1);
    expect(structuralFamilyAncestry(brioche)).toEqual([brioche, fermentedGluten]);
    expect(structuralFamilyMatches(brioche, fermentedGluten)).toBe(true);
    expect(structuralFamilyMatches(brioche, laminated)).toBe(false);
  });

  it('keeps the orthogonal modifier vocabulary separate from family IDs', () => {
    expect(STRUCTURAL_MODIFIER_AXES.map((axis) => axis.id)).toEqual([
      'leavening',
      'structural-system',
      'enrichment',
      'consistency',
      'fat-handling',
      'special-process',
    ]);
    expect(STRUCTURAL_MODIFIER_AXES.every((axis) => axis.options.length > 0)).toBe(true);
  });
});
