import { afterEach, describe, expect, it } from 'vitest';
import { createInitialFormulaDraft, knownDraftValue } from '../domain/normalization';
import { createInitialProcessDraft } from '../domain/process';
import {
  DRAFT_STORAGE_KEY,
  PROCESS_STORAGE_KEY,
  clearDraft,
  clearProcess,
  loadDraft,
  loadProcess,
  persistDraft,
  persistProcess,
} from './workspace';

const originalSessionStorage = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');

function installSessionStorage() {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
  });
  return values;
}

afterEach(() => {
  if (originalSessionStorage) {
    Object.defineProperty(globalThis, 'sessionStorage', originalSessionStorage);
  } else {
    delete (globalThis as { sessionStorage?: unknown }).sessionStorage;
  }
});

describe('locale-switch draft persistence', () => {
  it('round-trips Formula and Process state without changing canonical values', () => {
    const storage = installSessionStorage();
    const formula = createInitialFormulaDraft('locale-switch-formula');
    formula.ingredientLines[0].role = 'inclusion';
    formula.ingredientLines[0].availabilityOverride = knownDraftValue(0.5);
    const process = createInitialProcessDraft(formula.formulaId);
    process.mixing.method = knownDraftValue('hand_knead');
    process.fermentation.bulkTimeSeconds = knownDraftValue(3600);

    persistDraft(formula);
    persistProcess(process);

    expect(storage.has(DRAFT_STORAGE_KEY)).toBe(true);
    expect(storage.has(PROCESS_STORAGE_KEY)).toBe(true);
    expect(loadDraft()).toEqual(formula);
    expect(loadProcess()).toEqual(process);
  });

  it('clears both locale-shared drafts only when the workspace asks to start over', () => {
    const storage = installSessionStorage();
    persistDraft(createInitialFormulaDraft('clear-formula'));
    persistProcess(createInitialProcessDraft('clear-formula'));

    clearDraft();
    clearProcess();

    expect(storage.size).toBe(0);
    expect(loadDraft()).toBeNull();
    expect(loadProcess()).toBeNull();
  });
});
