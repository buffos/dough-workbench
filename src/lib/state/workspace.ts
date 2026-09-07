import { COMPOSITION_FIELDS, INGREDIENT_ROLES } from '../domain/types';
import type { DraftValueState, FormulaDraft, MassUnit, Provenance } from '../domain/types';

export const DRAFT_STORAGE_KEY = 'dough-formula-intelligence:draft:v1';

export function persistDraft(draft: FormulaDraft): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Session persistence is a convenience for locale switching, not a reason
    // to make formula editing fail in restricted/private browser contexts.
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isMassUnit(value: unknown): value is MassUnit {
  return value === 'g' || value === 'kg' || value === 'ml' || value === 'count';
}

function isProvenance(value: unknown): value is Provenance {
  if (!isRecord(value)) return false;
  const validKinds = ['catalog', 'user-entered', 'custom', 'derived'];
  return (
    typeof value.kind === 'string' &&
    validKinds.includes(value.kind) &&
    (value.sourceId === undefined || typeof value.sourceId === 'string') &&
    (value.sourceVersion === undefined || typeof value.sourceVersion === 'string') &&
    (value.method === undefined || typeof value.method === 'string') &&
    (value.modelVersion === undefined || typeof value.modelVersion === 'string')
  );
}

function isDraftValueState(value: unknown): value is DraftValueState {
  if (!isRecord(value) || typeof value.state !== 'string') return false;
  if (value.state === 'none') return true;
  if (value.state === 'unknown') return typeof value.reasonCode === 'string';
  return (
    value.state === 'known' &&
    typeof value.value === 'string' &&
    isProvenance(value.provenance) &&
    typeof value.confidence === 'number' &&
    Number.isFinite(value.confidence) &&
    value.confidence >= 0 &&
    value.confidence <= 1
  );
}

function isFormulaDraft(value: unknown): value is FormulaDraft {
  if (!isRecord(value)) return false;
  if (
    typeof value.formulaId !== 'string' ||
    !value.formulaId ||
    typeof value.revision !== 'number' ||
    !Number.isInteger(value.revision) ||
    value.revision < 1
  ) return false;
  if (!Array.isArray(value.flourComponents) || !Array.isArray(value.ingredientLines)) return false;

  const validFlours = value.flourComponents.every((component) => {
    if (!isRecord(component)) return false;
    return (
      typeof component.id === 'string' &&
      (component.ingredientId === undefined || typeof component.ingredientId === 'string') &&
      typeof component.name === 'string' &&
      typeof component.massGrams === 'string' &&
      isMassUnit(component.massUnit) &&
      typeof component.flourBearing === 'boolean' &&
      typeof component.declaredBlendPercentage === 'string'
    );
  });
  if (!validFlours) return false;

  return value.ingredientLines.every((line) => {
    if (!isRecord(line) || typeof line.composition !== 'object' || line.composition === null) return false;
    if (
      typeof line.id !== 'string' ||
      (line.ingredientId !== undefined && typeof line.ingredientId !== 'string') ||
      typeof line.name !== 'string' ||
      typeof line.massGrams !== 'string' ||
      !isMassUnit(line.massUnit) ||
      typeof line.role !== 'string' ||
      !INGREDIENT_ROLES.includes(line.role as (typeof INGREDIENT_ROLES)[number])
    ) return false;
    const composition = line.composition as Record<string, unknown>;
    return COMPOSITION_FIELDS.every((field) => isDraftValueState(composition[field]));
  });
}

export function loadDraft(): FormulaDraft | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isFormulaDraft(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Nothing to clear when storage is unavailable.
    }
  }
}
