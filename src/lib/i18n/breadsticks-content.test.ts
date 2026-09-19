import { describe, expect, it } from 'vitest';
import { BREADSTICKS_CONTENT } from './breadsticks-content';

function contentShape(locale: 'en' | 'el') {
  return BREADSTICKS_CONTENT[locale].sections.map((section) => ({
    id: section.id,
    number: section.number,
    hasParagraphs: section.paragraphs !== undefined,
    bulletCount: section.bullets?.length ?? 0,
    tableShape: section.table
      ? { columnCount: section.table.columns.length, rowCount: section.table.rows.length, hasNote: section.table.note !== undefined }
      : null,
  }));
}

describe('bilingual breadstick theory content contract', () => {
  it('keeps the same section and table shape in both locales', () => {
    expect(contentShape('en')).toEqual(contentShape('el'));
  });

  it('contains ten canonical reference rows in both locales', () => {
    expect(BREADSTICKS_CONTENT.en.sections[0]?.table?.rows).toHaveLength(10);
    expect(BREADSTICKS_CONTENT.el.sections[0]?.table?.rows).toHaveLength(10);
  });

  it('does not leave localized content fields empty', () => {
    for (const locale of ['en', 'el'] as const) {
      const content = BREADSTICKS_CONTENT[locale];
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
