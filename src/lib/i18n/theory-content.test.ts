import { describe, expect, it } from 'vitest';
import { THEORY_CONTENT } from './theory-content';

function contentShape(locale: 'en' | 'el') {
  return THEORY_CONTENT[locale].chapters.map((chapter) => ({
    id: chapter.id,
    number: chapter.number,
    blockShape: chapter.blocks.map((block) => ({
      paragraphCount: block.paragraphs.length,
      hasBullets: block.bullets !== undefined,
    })),
    tableShape: chapter.table
      ? { columnCount: chapter.table.columns.length, rowCount: chapter.table.rows.length, hasNote: chapter.table.note !== undefined }
      : null,
    hasCallout: chapter.callout !== undefined,
  }));
}

describe('bilingual theory content contract', () => {
  it('keeps the same chapter and content shape in both locales', () => {
    expect(contentShape('en')).toEqual(contentShape('el'));
  });

  it('covers the complete internal theory sequence', () => {
    expect(THEORY_CONTENT.en.chapters.map((chapter) => chapter.id)).toEqual([
      'introduction',
      'bakers-percentages',
      'flour-and-water',
      'flour',
      'salt',
      'yeast-and-fermentation',
      'sugar',
      'fat',
      'eggs',
      'dairy',
      'chemical-leavening',
      'mixing-techniques',
      'family-map',
      'master-ratio-map',
    ]);
    expect(THEORY_CONTENT.en.chapters).toHaveLength(14);
    expect(THEORY_CONTENT.el.chapters).toHaveLength(14);
  });

  it('does not leave any localized theory field empty', () => {
    for (const locale of ['en', 'el'] as const) {
      const content = THEORY_CONTENT[locale];
      expect(content.title.trim()).not.toBe('');
      expect(content.intro.trim()).not.toBe('');
      for (const chapter of content.chapters) {
        expect(chapter.title.trim()).not.toBe('');
        expect(chapter.intro.trim()).not.toBe('');
        for (const block of chapter.blocks) {
          expect(block.title.trim()).not.toBe('');
          expect(block.paragraphs.every((paragraph) => paragraph.trim() !== '')).toBe(true);
        }
      }
    }
  });
});
