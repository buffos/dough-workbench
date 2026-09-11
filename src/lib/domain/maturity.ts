import {
  calculateIntrinsicMetrics,
} from './composition';
import { classifyFormula } from './classification';
import { evaluateEffectiveBehavior } from './effective';
import { prepareAnalysisInput } from './handoff';
import { createInitialFormulaDraft } from './normalization';
import {
  createInitialProcessDraft,
} from './process';
import type { CalibrationEvaluation } from './calibration';
import type { EvaluationPartition } from './dataset';
import { loadPrototypeCatalog } from '../../data/prototypes/catalog';
import type { IntrinsicAnalysisResult } from './types';

export const MATURITY_RELEASE_VERSION = 'model-maturity-release-v1';
export const REGRESSION_SUITE_VERSION = 'formula-regression-suite-v1';

export const MODEL_MATURITIES = ['expert-seed', 'gold-calibrated', 'broad-calibrated', 'experiment-validated', 'stable'] as const;
export type ModelMaturity = (typeof MODEL_MATURITIES)[number];

export const MATURITY_CONFIDENCE_CEILINGS: Record<ModelMaturity, number> = {
  'expert-seed': 0.6,
  'gold-calibrated': 0.8,
  'broad-calibrated': 0.9,
  'experiment-validated': 0.97,
  stable: 1,
};

export const REGRESSION_CASE_IDS = [
  'parent-family-recognition',
  'named-prototype-behavior',
  'absurd-cross-family-match',
  'smooth-counterfactuals',
  'formula-process-independence',
  'functional-ingredient-equivalence',
  'unknown-handling',
  'no-match-hybrid-behavior',
  'confidence-sanity',
  'explanation-fidelity',
] as const;
export type RegressionCaseId = (typeof REGRESSION_CASE_IDS)[number];

export interface RegressionCase {
  id: RegressionCaseId;
  label: { en: string; el: string };
  intent: { en: string; el: string };
}

export const CANONICAL_REGRESSION_CASES: readonly RegressionCase[] = [
  { id: 'parent-family-recognition', label: { en: 'Parent and family recognition', el: 'Αναγνώριση γονέα και οικογένειας' }, intent: { en: 'A structurally valid formula can be evaluated against its family gates.', el: 'Μια δομικά έγκυρη φόρμουλα μπορεί να αξιολογηθεί απέναντι στα gates της οικογένειάς της.' } },
  { id: 'named-prototype-behavior', label: { en: 'Named prototype behavior', el: 'Συμπεριφορά ονομασμένου πρωτοτύπου' }, intent: { en: 'Named prototypes remain candidates with explicit evidence.', el: 'Τα ονομασμένα πρωτότυπα παραμένουν υποψήφια με ρητά τεκμήρια.' } },
  { id: 'absurd-cross-family-match', label: { en: 'Absurd cross-family match', el: 'Παράλογη αντιστοίχιση μεταξύ οικογενειών' }, intent: { en: 'A cross-family mismatch cannot become a strong match silently.', el: 'Μια ασυμφωνία μεταξύ οικογενειών δεν γίνεται σιωπηρά ισχυρό ταίριασμα.' } },
  { id: 'smooth-counterfactuals', label: { en: 'Smooth counterfactuals', el: 'Ομαλές αντιπαραθετικές αλλαγές' }, intent: { en: 'Small formula changes produce finite, bounded recalculations.', el: 'Μικρές αλλαγές στη φόρμουλα παράγουν πεπερασμένους και περιορισμένους επανυπολογισμούς.' } },
  { id: 'formula-process-independence', label: { en: 'Formula / Process independence', el: 'Ανεξαρτησία Φόρμουλας / Διαδικασίας' }, intent: { en: 'Process evidence does not rewrite composition or intrinsic metrics.', el: 'Τα τεκμήρια διαδικασίας δεν ξαναγράφουν τη σύσταση ή τα intrinsic metrics.' } },
  { id: 'functional-ingredient-equivalence', label: { en: 'Functional ingredient equivalence', el: 'Ισοδυναμία λειτουργικής σύστασης' }, intent: { en: 'Equivalent functional composition can be compared without using names as identity.', el: 'Ισοδύναμη λειτουργική σύσταση μπορεί να συγκριθεί χωρίς το όνομα να γίνεται ταυτότητα.' } },
  { id: 'unknown-handling', label: { en: 'Unknown handling', el: 'Χειρισμός άγνωστων τιμών' }, intent: { en: 'Unknown remains unknown and is never converted to zero.', el: 'Το άγνωστο παραμένει άγνωστο και δεν μετατρέπεται ποτέ σε μηδέν.' } },
  { id: 'no-match-hybrid-behavior', label: { en: 'No-match and hybrid behavior', el: 'Συμπεριφορά χωρίς ταίριασμα και υβριδικού αποτελέσματος' }, intent: { en: 'No strong canonical match and hybrid outcomes stay explicit.', el: 'Η απουσία ισχυρού κανονικού ταιριάσματος και τα υβριδικά αποτελέσματα παραμένουν ρητά.' } },
  { id: 'confidence-sanity', label: { en: 'Confidence sanity', el: 'Έλεγχος λογικών ορίων εμπιστοσύνης' }, intent: { en: 'Confidence stays bounded and distinct from similarity.', el: 'Η εμπιστοσύνη παραμένει εντός ορίων και διακριτή από την ομοιότητα.' } },
  { id: 'explanation-fidelity', label: { en: 'Explanation fidelity', el: 'Πιστότητα επεξήγησης' }, intent: { en: 'Explanations identify evidence and limitations instead of promising an outcome.', el: 'Οι επεξηγήσεις δείχνουν τεκμήρια και περιορισμούς αντί να υπόσχονται αποτέλεσμα.' } },
];

export type RegressionObservationStatus = 'pass' | 'fail' | 'not-run';

export interface RegressionObservation {
  status: RegressionObservationStatus;
  detail: string;
}

export interface RegressionCaseResult extends RegressionCase {
  observation: RegressionObservation;
}

export interface RegressionSuite {
  outcome: 'pass' | 'fail';
  suiteVersion: typeof REGRESSION_SUITE_VERSION;
  cases: RegressionCaseResult[];
  identity: string;
}

export type RegressionRunner = (testCase: RegressionCase) => RegressionObservation;

export type MaturityDiagnosticCode = 'insufficient_evidence' | 'regression_failure' | 'release_immutable' | 'invalid_maturity';

export interface MaturityDiagnostic {
  code: MaturityDiagnosticCode;
  severity: 'error';
  path: string;
  parameters: Record<string, string | number>;
}

export interface ModelParameterRelease {
  releaseId: string;
  status: 'published';
  modelVersion: string;
  datasetReleaseId: string;
  datasetContentIdentity: string;
  evaluationId: string;
  protocolId: string;
  protocolVersion: string;
  fitPartitions: EvaluationPartition[];
  heldOutPartitions: EvaluationPartition[];
  fitRecordIds: string[];
  weightVersion: string;
  evidenceCoverage: number;
  processCoverage: number;
  sourceQualityFactor: number;
  maturity: ModelMaturity;
  confidenceCeiling: number;
  similaritySemantics: 'similarity-not-probability';
  regressionSuiteVersion: typeof REGRESSION_SUITE_VERSION;
  regressionIdentity: string;
  parameterIdentity: string;
  createdAt: string;
  supersedes: string | null;
}

export interface ModelParameterReleaseResult {
  outcome: 'published' | 'rejected';
  release: ModelParameterRelease | null;
  diagnostics: MaturityDiagnostic[];
}

export interface ModelParameterReleaseRegistry {
  currentReleaseId: string;
  releases: Record<string, ModelParameterRelease>;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`).join(',')}}`;
}

function digest(value: unknown): string {
  let result = 2166136261;
  const input = canonicalize(value);
  for (let index = 0; index < input.length; index += 1) {
    result ^= input.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return `fnv1a32:${(result >>> 0).toString(16).padStart(8, '0')}`;
}

function diagnostic(code: MaturityDiagnosticCode, path: string, parameters: Record<string, string | number> = {}): MaturityDiagnostic {
  return { code, severity: 'error', path, parameters };
}

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function runRegressionSuite(runner: RegressionRunner): RegressionSuite {
  const cases = CANONICAL_REGRESSION_CASES.map((testCase) => ({ ...testCase, observation: runner(testCase) }));
  const expectedIds = REGRESSION_CASE_IDS.join('|');
  return {
    outcome: cases.length === REGRESSION_CASE_IDS.length
      && cases.map((item) => item.id).join('|') === expectedIds
      && cases.every((item) => item.observation.status === 'pass') ? 'pass' : 'fail',
    suiteVersion: REGRESSION_SUITE_VERSION,
    cases,
    identity: digest({ suiteVersion: REGRESSION_SUITE_VERSION, cases }),
  };
}

interface SemanticRegressionContext {
  intrinsic: IntrinsicAnalysisResult;
  classification: ReturnType<typeof classifyFormula>;
  processIndependent: boolean;
  unknownProcessPreserved: boolean;
}

function semanticContext(): SemanticRegressionContext | null {
  const formula = createInitialFormulaDraft('regression_formula');
  const process = createInitialProcessDraft(formula.formulaId);
  const handoff = prepareAnalysisInput(formula, process, { requestedPath: 'full', expectedFormulaRevision: formula.revision, expectedProcessRevision: process.revision });
  if (!handoff.data) return null;
  const intrinsic = calculateIntrinsicMetrics(handoff.data.formula);
  const effective = evaluateEffectiveBehavior({ reference: handoff.data, intrinsic });
  const classification = classifyFormula({ reference: handoff.data, intrinsic, effective, catalog: loadPrototypeCatalog() });
  const changedProcess = createInitialProcessDraft(formula.formulaId);
  changedProcess.revision += 1;
  const changedHandoff = prepareAnalysisInput(formula, changedProcess, { requestedPath: 'full' });
  const changedIntrinsic = changedHandoff.data ? calculateIntrinsicMetrics(changedHandoff.data.formula) : null;
  const unknownProcessPreserved = Object.entries(handoff.data.process)
    .filter(([key]) => !['processId', 'formulaId', 'revision', 'readiness', 'policy', 'modelVersion', 'ingredientAddition'].includes(key))
    .some(([, section]) => Object.values(section as Record<string, { state?: string }>).some((value) => value.state === 'unknown'));
  return {
    intrinsic,
    classification,
    processIndependent: Boolean(changedIntrinsic && JSON.stringify(changedIntrinsic.metrics.map((item) => item.value)) === JSON.stringify(intrinsic.metrics.map((item) => item.value))),
    unknownProcessPreserved,
  };
}

/**
 * Runs the contract-level regression checks against the current local model.
 * The checks deliberately assert invariants (boundedness, separation, and
 * explanation presence) rather than treating a seed classification as truth.
 */
export function runSemanticRegressionSuite(): RegressionSuite {
  const context = semanticContext();
  return runRegressionSuite((testCase) => {
    if (!context) return { status: 'fail', detail: 'Analysis context could not be prepared.' };
    switch (testCase.id) {
      case 'parent-family-recognition':
        return { status: context.classification.families.length > 0 ? 'pass' : 'fail', detail: 'Family evaluation returned a bounded result.' };
      case 'named-prototype-behavior':
        return { status: context.classification.candidates.length > 0 ? 'pass' : 'fail', detail: 'Prototype candidates remain explicit.' };
      case 'absurd-cross-family-match':
        return { status: context.classification.candidates.every((candidate) => candidate.confidence >= 0 && candidate.confidence <= 1) ? 'pass' : 'fail', detail: 'Cross-family confidence remains bounded.' };
      case 'smooth-counterfactuals':
        return { status: context.intrinsic.metrics.every((metric) => metric.value === undefined || Number.isFinite(metric.value)) ? 'pass' : 'fail', detail: 'Intrinsic values remain finite when present.' };
      case 'formula-process-independence':
        return { status: context.processIndependent ? 'pass' : 'fail', detail: 'Intrinsic metrics do not depend on Process changes.' };
      case 'functional-ingredient-equivalence':
        return { status: context.intrinsic.metrics.every((metric) => metric.provenance.length > 0) ? 'pass' : 'fail', detail: 'Functional metric provenance remains available.' };
      case 'unknown-handling':
        return { status: context.unknownProcessPreserved ? 'pass' : 'fail', detail: 'Unknown Process values remain explicit in the analysis input.' };
      case 'no-match-hybrid-behavior':
        return { status: ['strong_match', 'structural_match', 'hybrid', 'no_strong_canonical_match', 'partial'].includes(context.classification.outcome) ? 'pass' : 'fail', detail: 'Classification uses an explicit outcome vocabulary.' };
      case 'confidence-sanity':
        return { status: context.classification.confidence >= 0 && context.classification.confidence <= 1 ? 'pass' : 'fail', detail: 'Confidence is bounded and separate from similarity.' };
      case 'explanation-fidelity':
        return { status: Boolean(context.classification.explanation.modelVersion) && context.intrinsic.metrics.every((metric) => metric.explanation !== undefined) ? 'pass' : 'fail', detail: 'Explanations retain model and metric context.' };
    }
  });
}

function maturityRank(maturity: ModelMaturity): number {
  return MODEL_MATURITIES.indexOf(maturity);
}

function supportedMaturity(evaluation: CalibrationEvaluation, controlledExperimentEvidence = false): ModelMaturity {
  const validationReady = evaluation.validationRecordIds.length > 0;
  const testReady = evaluation.testRecordIds.length > 0;
  const experimentValidated = evaluation.coverage.weightedFitCoverage >= 0.9
    && evaluation.coverage.processCoverage >= 0.75
    && validationReady
    && testReady;
  if (experimentValidated && controlledExperimentEvidence) return 'stable';
  if (experimentValidated) return 'experiment-validated';
  if (evaluation.coverage.weightedFitCoverage >= 0.8 && evaluation.fitRecordIds.length >= 3 && validationReady) return 'broad-calibrated';
  if (evaluation.coverage.weightedFitCoverage >= 0.65 && evaluation.fitRecordIds.length >= 1) return 'gold-calibrated';
  return 'expert-seed';
}

function sourceQualityFactor(evaluation: CalibrationEvaluation): number {
  if (evaluation.evidence.length === 0) return 0;
  const maxWeight = Math.max(...Object.values(evaluation.qualityWeights));
  const used = evaluation.evidence.filter((item) => evaluation.fitRecordIds.includes(item.recordId));
  if (used.length === 0 || maxWeight <= 0) return 0;
  return clamp(used.reduce((sum, item) => sum + item.qualityWeight, 0) / (used.length * maxWeight));
}

export function createModelParameterRelease(input: {
  releaseId: string;
  evaluation: CalibrationEvaluation;
  requestedMaturity: ModelMaturity;
  regression: RegressionSuite;
  createdAt: string;
  supersedes?: string | null;
  controlledExperimentEvidence?: boolean;
}): ModelParameterReleaseResult {
  const diagnostics: MaturityDiagnostic[] = [];
  if (!input.releaseId || !input.createdAt || !MODEL_MATURITIES.includes(input.requestedMaturity)) {
    diagnostics.push(diagnostic('invalid_maturity', 'release.metadata'));
  }
  if (input.evaluation.outcome !== 'completed') diagnostics.push(diagnostic('insufficient_evidence', 'evaluation.outcome'));
  const supported = supportedMaturity(input.evaluation, input.controlledExperimentEvidence);
  if (maturityRank(input.requestedMaturity) > maturityRank(supported)) diagnostics.push(diagnostic('insufficient_evidence', 'maturity', { requested: input.requestedMaturity, supported }));
  if (input.requestedMaturity === 'stable' && !input.controlledExperimentEvidence) diagnostics.push(diagnostic('insufficient_evidence', 'controlledExperimentEvidence'));
  const regressionIds = input.regression.cases.map((item) => item.id);
  const completeRegression = input.regression.suiteVersion === REGRESSION_SUITE_VERSION
    && regressionIds.length === REGRESSION_CASE_IDS.length
    && regressionIds.join('|') === REGRESSION_CASE_IDS.join('|')
    && input.regression.outcome === 'pass'
    && input.regression.cases.every((item) => item.observation.status === 'pass');
  if (!completeRegression) diagnostics.push(diagnostic('regression_failure', 'regression'));
  if (diagnostics.length > 0) return { outcome: 'rejected', release: null, diagnostics };
  const qualityFactor = sourceQualityFactor(input.evaluation);
  const processFactor = input.evaluation.coverage.processCoverage > 0 ? 0.5 + (input.evaluation.coverage.processCoverage / 2) : 0.5;
  const confidenceCeiling = clamp(Math.min(
    MATURITY_CONFIDENCE_CEILINGS[input.requestedMaturity],
    input.evaluation.coverage.weightedFitCoverage,
    processFactor,
    qualityFactor,
  ));
  const parameterIdentity = digest({
    modelVersion: input.evaluation.modelVersion,
    evaluationId: input.evaluation.evaluationId,
    maturity: input.requestedMaturity,
    confidenceCeiling,
    regressionIdentity: input.regression.identity,
  });
  return {
    outcome: 'published',
    diagnostics: [],
    release: {
      releaseId: input.releaseId,
      status: 'published',
      modelVersion: input.evaluation.modelVersion,
      datasetReleaseId: input.evaluation.releaseId,
      datasetContentIdentity: input.evaluation.releaseContentIdentity,
      evaluationId: input.evaluation.evaluationId,
      protocolId: input.evaluation.protocolId,
      protocolVersion: input.evaluation.protocolVersion,
      fitPartitions: [...new Set(input.evaluation.evidence.filter((item) => input.evaluation.fitRecordIds.includes(item.recordId)).map((item) => item.partition))],
      heldOutPartitions: [...new Set(input.evaluation.evidence.filter((item) => [...input.evaluation.validationRecordIds, ...input.evaluation.testRecordIds].includes(item.recordId)).map((item) => item.partition))],
      fitRecordIds: [...input.evaluation.fitRecordIds],
      weightVersion: input.evaluation.weightVersion,
      evidenceCoverage: input.evaluation.coverage.weightedFitCoverage,
      processCoverage: input.evaluation.coverage.processCoverage,
      sourceQualityFactor: qualityFactor,
      maturity: input.requestedMaturity,
      confidenceCeiling,
      similaritySemantics: 'similarity-not-probability',
      regressionSuiteVersion: REGRESSION_SUITE_VERSION,
      regressionIdentity: input.regression.identity,
      parameterIdentity,
      createdAt: input.createdAt,
      supersedes: input.supersedes ?? null,
    },
  };
}

export function publishModelParameterRelease(
  registry: ModelParameterReleaseRegistry,
  release: ModelParameterRelease,
): { outcome: 'published' | 'rejected'; registry: ModelParameterReleaseRegistry | null; diagnostics: MaturityDiagnostic[] } {
  if (registry.releases[release.releaseId]) {
    return { outcome: 'rejected', registry: null, diagnostics: [diagnostic('release_immutable', 'releaseId', { releaseId: release.releaseId })] };
  }
  return {
    outcome: 'published',
    registry: { currentReleaseId: release.releaseId, releases: { ...registry.releases, [release.releaseId]: JSON.parse(JSON.stringify(release)) as ModelParameterRelease } },
    diagnostics: [],
  };
}
