import { describe, expect, it } from 'vitest';
import { PROCESS_ADDITION_ACTIONS, PROCESS_FIELD_DESCRIPTORS } from '../domain/process';
import { messageKeys } from './messages';

describe('bilingual Process presentation contract', () => {
  it('translates every field, unit, controlled option, and addition action', () => {
    for (const locale of ['en', 'el'] as const) {
      const keys = new Set(messageKeys(locale));

      for (const field of PROCESS_FIELD_DESCRIPTORS) {
        expect(keys.has(`process.field.${field.key}`)).toBe(true);
        expect(keys.has(`help.process.${field.path}`)).toBe(true);
        for (const option of field.options ?? []) {
          expect(keys.has(`process.enum.${option}`)).toBe(true);
        }
      }

      for (const action of PROCESS_ADDITION_ACTIONS) {
        expect(keys.has(`process.enum.${action}`)).toBe(true);
      }
    }
  });
});
