import { COMPOSITION_FIELDS, INGREDIENT_ROLES } from '../domain/types';
import type { DraftValueState, FormulaDraft, MassUnit, Provenance } from '../domain/types';
import { PROCESS_FIELD_DESCRIPTORS } from '../domain/process';
import type { AdditionStepDraft, ProcessDraft } from '../domain/process';

export const DRAFT_STORAGE_KEY = 'dough-formula-intelligence:draft:v1';
export const PROCESS_STORAGE_KEY = 'dough-formula-intelligence:process:v2';

export function persistDraft(draft: FormulaDraft): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Session persistence is a convenience for locale switching, not a reason
    // to make formula editing fail in restricted/private browser contexts.
  }
}

export function persistProcess(process: ProcessDraft): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(PROCESS_STORAGE_KEY, JSON.stringify(process));
  } catch {
    // Process persistence is a convenience for locale switching.
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

function isReferenceDraftProvenance(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return value.kind === 'derived-from-reference'
    && typeof value.sourceReleaseId === 'string'
    && value.sourceReleaseId.length > 0
    && typeof value.sourceRecordId === 'string'
    && value.sourceRecordId.length > 0
    && typeof value.sourcePreparationKey === 'string'
    && value.sourcePreparationKey.length > 0;
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

function isAdditionStep(value: unknown): value is AdditionStepDraft {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.sequence === 'string' &&
    Array.isArray(value.lineIds) &&
    value.lineIds.every((lineId) => typeof lineId === 'string') &&
    typeof value.action === 'string' &&
    typeof value.durationSeconds === 'string'
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
  if (value.sourceReference !== undefined && !isReferenceDraftProvenance(value.sourceReference)) return false;
  if (!Array.isArray(value.flourComponents) || !Array.isArray(value.ingredientLines)) return false;

  const validFlours = value.flourComponents.every((component) => {
    if (!isRecord(component)) return false;
    const flourComposition = component.composition;
    const compositionValid = flourComposition === undefined
      || (
        isRecord(flourComposition)
        && COMPOSITION_FIELDS.every((field) => isDraftValueState((flourComposition as Record<string, unknown>)[field]))
      );
    const absorptionValid = component.absorptionPercentage === undefined || typeof component.absorptionPercentage === 'string';
    const acidValid = component.acidNeutralization === undefined || isDraftValueState(component.acidNeutralization);
    return (
      typeof component.id === 'string' &&
      (component.ingredientId === undefined || typeof component.ingredientId === 'string') &&
      typeof component.name === 'string' &&
      typeof component.massGrams === 'string' &&
      isMassUnit(component.massUnit) &&
      typeof component.flourBearing === 'boolean' &&
      typeof component.declaredBlendPercentage === 'string' &&
      compositionValid &&
      absorptionValid &&
      acidValid
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
    return COMPOSITION_FIELDS.every((field) => isDraftValueState(composition[field]))
      && (line.acidNeutralization === undefined || isDraftValueState(line.acidNeutralization));
  });
}

function isProcessDraft(value: unknown): value is ProcessDraft {
  if (!isRecord(value)) return false;
  if (
    typeof value.processId !== 'string' ||
    !value.processId ||
    typeof value.formulaId !== 'string' ||
    !value.formulaId ||
    typeof value.revision !== 'number' ||
    !Number.isInteger(value.revision) ||
    value.revision < 1
  ) return false;
  if (value.sourceReference !== undefined && !isReferenceDraftProvenance(value.sourceReference)) return false;

  const sectionValues = ['mixing', 'aeration', 'fermentation', 'lamination', 'thermalProcess', 'geometry'];
  if (!sectionValues.every((section) => isRecord(value[section]))) return false;
  if (!isRecord(value.ingredientAddition)) return false;
  if (!Array.isArray(value.ingredientAddition.steps) || !value.ingredientAddition.steps.every(isAdditionStep)) return false;

  return PROCESS_FIELD_DESCRIPTORS.every((descriptor) => {
    const [section, field] = descriptor.path.split('.');
    const container = section === 'ingredientAddition' ? value.ingredientAddition : value[section];
    return isRecord(container) && isDraftValueState(container[field]);
  });
}

function repairProcessDraft(draft: ProcessDraft): ProcessDraft {
  let repaired = draft;
  let changed = false;

  for (const descriptor of PROCESS_FIELD_DESCRIPTORS) {
    const [section, field] = descriptor.path.split('.') as [keyof ProcessDraft, string];
    const container = repaired[section] as unknown as Record<string, DraftValueState>;
    const current = container[field];
    if (!current || current.state !== 'known' || current.value.trim()) continue;

    const repairedValue: DraftValueState = { state: 'unknown', reasonCode: 'not-recorded' };
    repaired = {
      ...repaired,
      [section]: { ...container, [field]: repairedValue },
    } as ProcessDraft;
    changed = true;
  }

  return changed ? { ...repaired, revision: repaired.revision + 1 } : repaired;
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

export function loadProcess(): ProcessDraft | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(PROCESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isProcessDraft(parsed) ? repairProcessDraft(parsed) : null;
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

export function clearProcess(): void {
  if (typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.removeItem(PROCESS_STORAGE_KEY);
    } catch {
      // Nothing to clear when storage is unavailable.
    }
  }
}
