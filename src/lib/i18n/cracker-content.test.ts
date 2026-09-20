import { describe, expect, it } from 'vitest';
import { CRACKER_CONTENT } from './cracker-content';

function contentShape(locale: 'en' | 'el') {
  return CRACKER_CONTENT[locale].sections.map((section) => ({
    id: section.id,
    number: section.number,
    hasParagraphs: section.paragraphs !== undefined,
    bulletCount: section.bullets?.length ?? 0,
    tableShape: section.table
      ? { columnCount: section.table.columns.length, rowCount: section.table.rows.length, hasNote: section.table.note !== undefined }
      : null,
  }));
}

describe('bilingual cracker theory content contract', () => {
  it('keeps the same section and table shape in both locales', () => {
    expect(contentShape('en')).toEqual(contentShape('el'));
  });

  it('contains the twelve canonical reference rows in both locales', () => {
    expect(CRACKER_CONTENT.en.sections.find((section) => section.id === 'variants')?.table?.rows).toHaveLength(12);
    expect(CRACKER_CONTENT.el.sections.find((section) => section.id === 'variants')?.table?.rows).toHaveLength(12);
  });

  it('contains the complete public cracker map', () => {
    expect(CRACKER_CONTENT.en.sections.map((section) => section.id)).toEqual([
      'reference-formula',
      'batch-example',
      'process',
      'thickness',
      'variants',
      'canonical-matrix',
      'cracker-map',
      'two-dimensional-slice',
      'five-zones',
    ]);
  });

  it('does not leave localized content fields empty', () => {
    for (const locale of ['en', 'el'] as const) {
      const content = CRACKER_CONTENT[locale];
      expect(content.title.trim()).not.toBe('');
      expect(content.intro.trim()).not.toBe('');
      for (const section of content.sections) {
        expect(section.title.trim()).not.toBe('');
        expect(section.intro.trim()).not.toBe('');
        expect(section.table?.columns.every((column) => column.trim() !== '') ?? true).toBe(true);
        expect(section.table?.rows.flat().every((cell) => cell.trim() !== '') ?? true).toBe(true);
      }
    }
  });
});
