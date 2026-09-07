import { STARTER_CATALOG_VERSION } from '../../data/ingredients/starter-catalog';
import { normalizeFormula } from './normalization';
import type {
  FormulaDraft,
  NormalizedFormula,
  NormalizationOutcome,
} from './types';
import {
  PROCESS_FIELD_DESCRIPTORS,
  normalizeProcess,
} from './process';
import type {
  NormalizedProcess,
  ProcessDraft,
  ProcessNormalizationOutcome,
} from './process';

export const FORMULA_PROCESS_REFERENCE_VERSION = 'formula-process-reference-v0.1';
export const ANALYSIS_INPUT_MODEL_VERSION = 'analysis-input-v0.1';

export type AnalysisPath = 'composition' | 'process' | 'full';
export type AnalysisHandoffReadiness = 'analysis_ready' | 'partial_ready';
export type HandoffOutcome = 'completed' | 'partial' | 'rejected' | 'conflict';

export interface HandoffCoverage {
  composition: number;
  process: number;
}

export interface HandoffConfidence {
  composition: number;
  process: number;
}

export type HandoffLimitationCode = 'FORMULA_DATA_INCOMPLETE' | 'PROCESS_DATA_INCOMPLETE';

export interface HandoffLimitation {
  code: HandoffLimitationCode;
  path: string;
  messageKey: string;
  parameters: Record<string, string | number>;
}

export type HandoffDiagnosticCode =
  | 'STALE_REVISION'
  | 'REFERENCE_MISMATCH'
  | 'CATALOG_VERSION_MISMATCH'
  | 'FORMULA_NORMALIZATION_BLOCKED'
  | 'PROCESS_NORMALIZATION_BLOCKED';

export interface HandoffDiagnostic {
  code: HandoffDiagnosticCode;
  severity: 'error' | 'warning';
  path: string;
  messageKey: string;
  resolutionKey: string;
  parameters: Record<string, string | number>;
}

export interface FormulaProcessReference {
  referenceVersion: typeof FORMULA_PROCESS_REFERENCE_VERSION;
  formulaId: string;
  processId: string;
  formulaRevision: number;
  processRevision: number;
  formula: NormalizedFormula;
  process: NormalizedProcess;
  readiness: AnalysisHandoffReadiness;
  coverage: HandoffCoverage;
  confidence: HandoffConfidence;
  limitations: HandoffLimitation[];
  catalogVersion: string;
  modelVersion: typeof ANALYSIS_INPUT_MODEL_VERSION;
}

export interface PrepareAnalysisInputOptions {
  commandId?: string;
  expectedFormulaRevision?: number;
  expectedProcessRevision?: number;
  catalogVersion?: string;
  modelVersion?: string;
  requestedPath?: AnalysisPath;
}

export interface AnalysisInputOutcome {
  outcome: HandoffOutcome;
  formulaId: string;
  processId: string;
  formulaRevision: number;
  processRevision: number;
  commandId?: string;
  data: FormulaProcessReference | null;
  diagnostics: HandoffDiagnostic[];
  limitations: HandoffLimitation[];
  coverage: HandoffCoverage;
  confidence: HandoffConfidence;
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function emptyCoverage(): HandoffCoverage {
  return { composition: 0, process: 0 };
}

function emptyConfidence(): HandoffConfidence {
  return { composition: 0, process: 0 };
}

function diagnostic(
  code: HandoffDiagnosticCode,
  path: string,
  messageKey: string,
  resolutionKey: string,
  parameters: Record<string, string | number> = {},
): HandoffDiagnostic {
  return {
    code,
    severity: 'error',
    path,
    messageKey,
    resolutionKey,
    parameters,
  };
}

function limitation(
  code: HandoffLimitationCode,
  path: string,
  messageKey: string,
  parameters: Record<string, string | number>,
): HandoffLimitation {
  return { code, path, messageKey, parameters };
}

function formulaBlockedDiagnostic(outcome: NormalizationOutcome): HandoffDiagnostic {
  const first = outcome.diagnostics[0];
  return diagnostic(
    'FORMULA_NORMALIZATION_BLOCKED',
    first?.path ?? 'formula',
    'analysis.handoff.validation.formulaBlocked',
    'analysis.handoff.validation.correctFormula',
    { detailCode: first?.code ?? 'NORMALIZATION_BLOCKED' },
  );
}

function processBlockedDiagnostic(outcome: ProcessNormalizationOutcome): HandoffDiagnostic {
  const first = outcome.diagnostics[0];
  return diagnostic(
    first?.code === 'REFERENCE_MISMATCH' ? 'REFERENCE_MISMATCH' : 'PROCESS_NORMALIZATION_BLOCKED',
    first?.path ?? 'process',
    first?.code === 'REFERENCE_MISMATCH'
      ? 'analysis.handoff.validation.referenceMismatch'
      : 'analysis.handoff.validation.processBlocked',
    first?.code === 'REFERENCE_MISMATCH'
      ? 'analysis.handoff.validation.correctReference'
      : 'analysis.handoff.validation.correctProcess',
    { detailCode: first?.code ?? 'PROCESS_NORMALIZATION_BLOCKED' },
  );
}

function incompleteFormulaLimitation(outcome: NormalizationOutcome): HandoffLimitation[] {
  if (outcome.outcome !== 'partial') return [];
  return [limitation(
    'FORMULA_DATA_INCOMPLETE',
    'formula.ingredientLines.composition',
    'analysis.handoff.limitation.formula',
    { count: outcome.explanation.unknownFields.length },
  )];
}

function incompleteProcessLimitation(outcome: ProcessNormalizationOutcome): HandoffLimitation[] {
  if (outcome.outcome !== 'partial') return [];
  const unknownCount = PROCESS_FIELD_DESCRIPTORS.filter((descriptor) => {
    const [section, field] = descriptor.path.split('.');
    const container = outcome.data?.[section as keyof NormalizedProcess];
    if (!container || typeof container !== 'object' || !(field in container)) return false;
    return (container as Record<string, { state?: string }>)[field]?.state === 'unknown';
  }).length;
  return [limitation(
    'PROCESS_DATA_INCOMPLETE',
    'process',
    'analysis.handoff.limitation.process',
    { count: unknownCount },
  )];
}

function outcomeBase(
  formula: FormulaDraft,
  process: ProcessDraft,
  options: PrepareAnalysisInputOptions,
): Pick<AnalysisInputOutcome, 'formulaId' | 'processId' | 'formulaRevision' | 'processRevision' | 'commandId'> {
  return {
    formulaId: formula.formulaId,
    processId: process.processId,
    formulaRevision: formula.revision,
    processRevision: process.revision,
    commandId: options.commandId,
  };
}

function conflictOutcome(
  formula: FormulaDraft,
  process: ProcessDraft,
  options: PrepareAnalysisInputOptions,
  handoffDiagnostic: HandoffDiagnostic,
): AnalysisInputOutcome {
  return {
    ...outcomeBase(formula, process, options),
    outcome: 'conflict',
    data: null,
    diagnostics: [handoffDiagnostic],
    limitations: [],
    coverage: emptyCoverage(),
    confidence: emptyConfidence(),
  };
}

function rejectedOutcome(
  formula: FormulaDraft,
  process: ProcessDraft,
  options: PrepareAnalysisInputOptions,
  handoffDiagnostic: HandoffDiagnostic,
): AnalysisInputOutcome {
  return {
    ...outcomeBase(formula, process, options),
    outcome: 'rejected',
    data: null,
    diagnostics: [handoffDiagnostic],
    limitations: [],
    coverage: emptyCoverage(),
    confidence: emptyConfidence(),
  };
}

function compatibleVersions(options: PrepareAnalysisInputOptions): HandoffDiagnostic | null {
  if (options.catalogVersion && options.catalogVersion !== STARTER_CATALOG_VERSION) {
    return diagnostic(
      'CATALOG_VERSION_MISMATCH',
      'catalogVersion',
      'analysis.handoff.validation.catalogVersion',
      'analysis.handoff.validation.correctVersions',
      { requested: options.catalogVersion, available: STARTER_CATALOG_VERSION },
    );
  }
  if (options.modelVersion && options.modelVersion !== ANALYSIS_INPUT_MODEL_VERSION) {
    return diagnostic(
      'CATALOG_VERSION_MISMATCH',
      'modelVersion',
      'analysis.handoff.validation.modelVersion',
      'analysis.handoff.validation.correctVersions',
      { requested: options.modelVersion, available: ANALYSIS_INPUT_MODEL_VERSION },
    );
  }
  return null;
}

function applyPartialAnalysisPolicy(
  formulaOutcome: NormalizationOutcome,
  processOutcome: ProcessNormalizationOutcome,
  requestedPath: AnalysisPath,
): { outcome: Exclude<HandoffOutcome, 'rejected' | 'conflict'>; readiness: AnalysisHandoffReadiness; limitations: HandoffLimitation[] } {
  const limitations = [
    ...incompleteFormulaLimitation(formulaOutcome),
    ...(requestedPath === 'composition' ? [] : incompleteProcessLimitation(processOutcome)),
  ];
  const partial = limitations.length > 0;
  return {
    outcome: partial ? 'partial' : 'completed',
    readiness: partial ? 'partial_ready' : 'analysis_ready',
    limitations,
  };
}

export function prepareAnalysisInput(
  formula: FormulaDraft,
  process: ProcessDraft,
  options: PrepareAnalysisInputOptions = {},
): AnalysisInputOutcome {
  const base = outcomeBase(formula, process, options);
  const requestedPath = options.requestedPath ?? 'full';

  if (formula.formulaId !== process.formulaId) {
    return conflictOutcome(formula, process, options, diagnostic(
      'REFERENCE_MISMATCH',
      'process.formulaId',
      'analysis.handoff.validation.referenceMismatch',
      'analysis.handoff.validation.correctReference',
      { formulaId: formula.formulaId, processFormulaId: process.formulaId },
    ));
  }
  if (options.expectedFormulaRevision !== undefined && options.expectedFormulaRevision !== formula.revision) {
    return conflictOutcome(formula, process, options, diagnostic(
      'STALE_REVISION',
      'formula.revision',
      'analysis.handoff.validation.staleRevision',
      'analysis.handoff.validation.refreshRevision',
      { expected: options.expectedFormulaRevision, actual: formula.revision },
    ));
  }
  if (options.expectedProcessRevision !== undefined && options.expectedProcessRevision !== process.revision) {
    return conflictOutcome(formula, process, options, diagnostic(
      'STALE_REVISION',
      'process.revision',
      'analysis.handoff.validation.staleRevision',
      'analysis.handoff.validation.refreshRevision',
      { expected: options.expectedProcessRevision, actual: process.revision },
    ));
  }
  const versionDiagnostic = compatibleVersions(options);
  if (versionDiagnostic) return conflictOutcome(formula, process, options, versionDiagnostic);

  const formulaOutcome = normalizeFormula(formula);
  if (formulaOutcome.outcome === 'rejected' || !formulaOutcome.data) {
    return {
      ...base,
      outcome: 'rejected',
      data: null,
      diagnostics: [formulaBlockedDiagnostic(formulaOutcome)],
      limitations: [],
      coverage: emptyCoverage(),
      confidence: emptyConfidence(),
    };
  }

  const processOutcome = normalizeProcess(process, formula.ingredientLines.map((line) => line.id));
  if (processOutcome.outcome === 'rejected' || !processOutcome.data) {
    const rejected = processOutcome.diagnostics.some((item) => item.code !== 'REFERENCE_MISMATCH');
    const mapped = processBlockedDiagnostic(processOutcome);
    return rejected ? rejectedOutcome(formula, process, options, mapped) : conflictOutcome(formula, process, options, mapped);
  }

  const policy = applyPartialAnalysisPolicy(formulaOutcome, processOutcome, requestedPath);
  const coverage: HandoffCoverage = {
    composition: clamp(formulaOutcome.coverage),
    process: clamp(processOutcome.coverage),
  };
  const confidence: HandoffConfidence = {
    composition: clamp(formulaOutcome.confidence),
    process: clamp(processOutcome.confidence),
  };
  const data: FormulaProcessReference = {
    referenceVersion: FORMULA_PROCESS_REFERENCE_VERSION,
    formulaId: formula.formulaId,
    processId: process.processId,
    formulaRevision: formula.revision,
    processRevision: process.revision,
    formula: formulaOutcome.data,
    process: processOutcome.data,
    readiness: policy.readiness,
    coverage,
    confidence,
    limitations: policy.limitations,
    catalogVersion: STARTER_CATALOG_VERSION,
    modelVersion: ANALYSIS_INPUT_MODEL_VERSION,
  };

  return {
    ...base,
    outcome: policy.outcome,
    data,
    diagnostics: [],
    limitations: policy.limitations,
    coverage,
    confidence,
  };
}

export function handoffSnapshotKey(reference: Pick<FormulaProcessReference, 'formulaId' | 'processId' | 'formulaRevision' | 'processRevision' | 'catalogVersion' | 'modelVersion'>): string {
  return [
    reference.formulaId,
    reference.formulaRevision,
    reference.processId,
    reference.processRevision,
    reference.catalogVersion,
    reference.modelVersion,
  ].join('|');
}
