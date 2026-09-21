import { describe, expect, it } from 'vitest';
import { BATTER_CONTENT } from './batter-content';

function contentShape(locale: 'en' | 'el') {
  return BATTER_CONTENT[locale].sections.map((section) => ({
    id: section.id,
    number: section.number,
    paragraphCount: section.paragraphs?.length ?? 0,
    bulletCount: section.bullets?.length ?? 0,
    tableShape: section.tables?.map((table) => ({
      columnCount: table.columns.length,
      rowCount: table.rows.length,
      hasNote: table.note !== undefined,
    })) ?? [],
    diagramIds: section.diagrams?.map((diagram) => diagram.id) ?? [],
  }));
}

describe('bilingual batter theory content contract', () => {
  it('keeps the same section, table, and diagram shape in both locales', () => {
    expect(contentShape('en')).toEqual(contentShape('el'));
  });

  it('contains the planned twelve sections and three diagrams', () => {
    expect(BATTER_CONTENT.en.sections.map((section) => section.id)).toEqual([
      'foundation',
      'taxonomy',
      'composition',
      'thermal',
      'canonical-formulas',
      'continuums',
      'steam-custard',
      'coating-fritter',
      'fermented-foam',
      'cake-boundary',
      'boundaries',
      'diagnostics',
    ]);
    expect(BATTER_CONTENT.en.sections.flatMap((section) => section.diagrams ?? [])).toHaveLength(3);
  });

  it('keeps every table and diagram readable in both locales', () => {
    for (const locale of ['en', 'el'] as const) {
      const content = BATTER_CONTENT[locale];
      expect(content.title.trim()).not.toBe('');
      expect(content.intro.trim()).not.toBe('');
      for (const section of content.sections) {
        expect(section.title.trim()).not.toBe('');
        expect(section.intro.trim()).not.toBe('');
        for (const table of section.tables ?? []) {
          expect(table.caption.trim()).not.toBe('');
          expect(table.columns.every((column) => column.trim() !== '')).toBe(true);
          expect(table.rows.length).toBeGreaterThan(0);
          expect(table.rows.every((row) => row.length === table.columns.length)).toBe(true);
          expect(table.rows.flat().every((cell) => cell.trim() !== '')).toBe(true);
        }
        for (const diagram of section.diagrams ?? []) {
          expect(diagram.code.trim()).not.toBe('');
          expect(diagram.fallback.trim()).not.toBe('');
        }
      }
    }
  });
});
