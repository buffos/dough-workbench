import { describe, expect, it } from 'vitest';
import { extraMessageKeys, localeHref, messageKeys, missingMessageKeys, t } from './messages';

describe('bilingual presentation contract', () => {
  it('keeps English and Greek message catalogs complete', () => {
    expect(missingMessageKeys('en')).toEqual([]);
    expect(missingMessageKeys('el')).toEqual([]);
    expect(extraMessageKeys('en')).toEqual([]);
    expect(extraMessageKeys('el')).toEqual([]);
    expect([...messageKeys('en')].sort()).toEqual([...messageKeys('el')].sort());
  });

  it('keeps locale switching route-based and base-path aware', () => {
    expect(localeHref('/', 'en')).toBe('/en/');
    expect(localeHref('/doughs/', 'el')).toBe('/doughs/el/');
    expect(t('el', 'state.unknown')).toBe('Δεν υπάρχει γνωστή τιμή');
    expect(t('en', 'state.unknown')).toBe('No known value');
    expect(t('el', 'missing.key')).toBe('[missing-translation:el:missing.key]');
  });
});
