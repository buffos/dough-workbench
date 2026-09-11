import { createInitialFormulaDraft } from './normalization';
import type {
  CompositionDraft,
  DraftValueState,
  FormulaDraft,
  ReferenceDraftProvenance,
  ValueState,
} from './types';
import { createInitialProcessDraft } from './process';
import type { NormalizedProcessSection, ProcessDraft, ProcessScalar } from './process';
import type { DatasetRecordSnapshot } from './dataset';

export type WorkspaceStartOutcome =
  | 'selected'
  | 'dirty_draft_confirmation_required'
  | 'reference_copy_invalid'
  | 'blank_selected';

export interface WorkspaceStartResult {
  outcome: WorkspaceStartOutcome;
  formula: FormulaDraft | null;
  process: ProcessDraft | null;
  provenance: ReferenceDraftProvenance | null;
}

function valueToDraft<T>(value: ValueState<T>): DraftValueState {
  if (value.state === 'none') return { state: 'none' };
  if (value.state === 'unknown') return { state: 'unknown', reasonCode: value.reasonCode };
  return {
    state: 'known',
    value: String(value.value),
    provenance: value.provenance,
    confidence: value.confidence,
  };
}

function compositionToDraft(composition: Record<string, ValueState<number>>): CompositionDraft {
  return Object.fromEntries(
    Object.entries(composition).map(([field, value]) => [field, valueToDraft(value)]),
  ) as CompositionDraft;
}

function optionalNumberToString<T>(value: ValueState<T>): string {
  return value.state === 'known' ? String(value.value) : '';
}

function normalizedSectionToDraft(section: NormalizedProcessSection): Record<string, DraftValueState> {
  return Object.fromEntries(
    Object.entries(section).map(([key, value]) => [key, valueToDraft(value)]),
  );
}

function referenceProvenance(record: DatasetRecordSnapshot): ReferenceDraftProvenance {
  return {
    kind: 'derived-from-reference',
    sourceReleaseId: record.releaseId,
    sourceRecordId: record.recordId,
    sourcePreparationKey: record.identity.preparationKey,
  };
}

export function formulaSnapshotToDraft(
  record: DatasetRecordSnapshot,
  formulaId = `formula_reference_${record.recordId}`,
): FormulaDraft {
  const formula = record.formula;
  const sourceReference = referenceProvenance(record);
  return {
    formulaId,
    revision: 1,
    sourceReference,
    flourComponents: formula.flourComponents.map((flour) => ({
      id: flour.id,
      ingredientId: flour.ingredientId,
      name: flour.name,
      massGrams: String(flour.mass.value),
      massUnit: 'g',
      flourBearing: flour.flourBearing,
      declaredBlendPercentage: String(flour.blendFraction.value),
      composition: compositionToDraft(flour.composition),
      absorptionPercentage: optionalNumberToString(flour.absorption),
      acidNeutralization: valueToDraft(flour.acidNeutralization),
    })),
    ingredientLines: formula.ingredientLines.map((line) => ({
      id: line.id,
      ingredientId: line.ingredientId,
      name: line.name,
      massGrams: String(line.mass.value),
      massUnit: 'g',
      role: line.role,
      composition: compositionToDraft(line.composition),
      definitionSource: line.definitionSource,
      catalogReference: line.catalogReference,
      definitionProvenance: line.compositionProvenance,
      definitionConfidence: line.compositionConfidence,
      availabilityOverride: line.availabilityOverride ? valueToDraft(line.availabilityOverride) : undefined,
      acidNeutralization: valueToDraft(line.acidNeutralization),
    })),
  };
}

export function processSnapshotToDraft(
  record: DatasetRecordSnapshot,
  formulaId: string,
): ProcessDraft {
  const base = createInitialProcessDraft(formulaId);
  const sourceReference = referenceProvenance(record);
  const normalized = record.process;
  if (!normalized) return { ...base, sourceReference };

  const steps = normalized.ingredientAddition.steps.map((step) => ({
    id: step.id,
    sequence: String(step.sequence),
    lineIds: [...step.lineIds],
    action: step.action,
    durationSeconds: String(step.durationSeconds),
  }));

  return {
    ...base,
    processId: `process_${formulaId}`,
    formulaId,
    revision: 1,
    sourceReference,
    mixing: normalizedSectionToDraft(normalized.mixing) as ProcessDraft['mixing'],
    ingredientAddition: {
      steps,
      fatIncorporationMode: valueToDraft(normalized.ingredientAddition.fatIncorporationMode),
    },
    aeration: normalizedSectionToDraft(normalized.aeration) as ProcessDraft['aeration'],
    fermentation: normalizedSectionToDraft(normalized.fermentation) as ProcessDraft['fermentation'],
    lamination: normalizedSectionToDraft(normalized.lamination) as ProcessDraft['lamination'],
    thermalProcess: normalizedSectionToDraft(normalized.thermalProcess) as ProcessDraft['thermalProcess'],
    geometry: normalizedSectionToDraft(normalized.geometry) as ProcessDraft['geometry'],
  };
}

export function isWorkspaceDraftDirty(formula: FormulaDraft, process: ProcessDraft): boolean {
  return formula.revision > 1 || process.revision > 1;
}

function invalidCopyResult(outcome: 'reference_copy_invalid' | 'dirty_draft_confirmation_required'): WorkspaceStartResult {
  return { outcome, formula: null, process: null, provenance: null };
}

export function createLocalDraftFromReference(
  record: DatasetRecordSnapshot,
  currentFormula?: FormulaDraft,
  currentProcess?: ProcessDraft,
  confirmReplacement = false,
): WorkspaceStartResult {
  if (currentFormula && currentProcess && isWorkspaceDraftDirty(currentFormula, currentProcess) && !confirmReplacement) {
    return invalidCopyResult('dirty_draft_confirmation_required');
  }

  try {
    const formula = formulaSnapshotToDraft(record);
    const process = processSnapshotToDraft(record, formula.formulaId);
    if (formula.flourComponents.length === 0 || !formula.flourComponents.some((flour) => flour.flourBearing)) {
      return invalidCopyResult('reference_copy_invalid');
    }
    return {
      outcome: 'selected',
      formula,
      process,
      provenance: formula.sourceReference ?? null,
    };
  } catch {
    return invalidCopyResult('reference_copy_invalid');
  }
}

export function createLocalDraftFromBlank(
  currentFormula?: FormulaDraft,
  currentProcess?: ProcessDraft,
  confirmReplacement = false,
): WorkspaceStartResult {
  if (currentFormula && currentProcess && isWorkspaceDraftDirty(currentFormula, currentProcess) && !confirmReplacement) {
    return invalidCopyResult('dirty_draft_confirmation_required');
  }
  const formula = createInitialFormulaDraft();
  return {
    outcome: 'blank_selected',
    formula,
    process: createInitialProcessDraft(formula.formulaId),
    provenance: null,
  };
}

export function processSnapshotHasIndependentCopy(
  record: DatasetRecordSnapshot,
  draft: ProcessDraft,
): boolean {
  return draft.sourceReference?.sourceReleaseId === record.releaseId
    && draft.sourceReference.sourceRecordId === record.recordId
    && (record.process === null || draft.processId !== record.process.processId);
}

export type ReferenceProcessScalar = ProcessScalar;
