import { describe, expect, it } from 'vitest';
import { HELP_CONTENT } from './help-content';

function contentShape(locale: 'en' | 'el') {
  return HELP_CONTENT[locale].sections.map((section) => ({
    id: section.id,
    entryShape: section.entries.map((entry) => ({
      hasCanonical: entry.canonical !== undefined,
      hasExamples: entry.examples !== undefined,
      hasNote: entry.note !== undefined,
    })),
  }));
}

describe('bilingual help content contract', () => {
  it('keeps the same canonical section and entry structure in both locales', () => {
    expect(contentShape('en')).toEqual(contentShape('el'));
  });
});
