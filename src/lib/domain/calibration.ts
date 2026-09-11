import {
  verifyDatasetRelease,
  type DatasetQuality,
  type DatasetRecordSnapshot,
  type DatasetRelease,
  type EvaluationPartition,
} from './dataset';

export const CALIBRATION_EVALUATOR_VERSION = 'calibration-evaluator-v1';
export const DEFAULT_CALIBRATION_PROTOCOL_ID = 'formula-calibration-protocol-v1';

export interface CalibrationProtocol {
  protocolId: string;
  version: string;
  modelVersion: string;
  fitPartitions: EvaluationPartition[];
  heldOutPartitions: EvaluationPartition[];
  qualityWeights: Record<DatasetQuality, number>;
  weightVersion: string;
  minimumFitRecords: number;
}

export const DEFAULT_CALIBRATION_PROTOCOL: CalibrationProtocol = {
  protocolId: DEFAULT_CALIBRATION_PROTOCOL_ID,
  version: '1.0.0',
  modelVersion: 'classification-seed-v2',
  fitPartitions: ['calibration'],
  heldOutPartitions: ['validation', 'test'],
  qualityWeights: { high: 1, medium: 0.7, low: 0.4 },
  weightVersion: 'quality-weight-v1',
  minimumFitRecords: 1,
};

export type CalibrationDiagnosticCode =
  | 'invalid_protocol'
  | 'invalid_release'
  | 'missing_partition'
  | 'partition_violation'
  | 'test_leakage'
  | 'insufficient_evidence'
  | 'release_version_mismatch'
  | 'unknown_evidence';

export interface CalibrationDiagnostic {
  code: CalibrationDiagnosticCode;
  path: string;
  parameters: Record<string, string | number>;
}

export interface CalibrationEvidenceRecord {
  recordId: string;
  roles: DatasetRecordSnapshot['roles'];
  partition: EvaluationPartition;
  quality: DatasetQuality;
  qualityWeight: number;
  formulaKnownFieldCount: number;
  formulaFieldCount: number;
  processIncluded: boolean;
  unknownFieldCount: number;
}

export interface CalibrationEvaluation {
  outcome: 'completed' | 'rejected';
  evaluationId: string;
  evaluatorVersion: typeof CALIBRATION_EVALUATOR_VERSION;
  releaseId: string;
  releaseContentIdentity: string;
  modelVersion: string;
  protocolId: string;
  protocolVersion: string;
  weightVersion: string;
  fitRecordIds: string[];
  validationRecordIds: string[];
  testRecordIds: string[];
  evidence: CalibrationEvidenceRecord[];
  qualityWeights: Record<DatasetQuality, number>;
  coverage: { fitRecords: number; weightedFitCoverage: number; processCoverage: number };
  diagnostics: CalibrationDiagnostic[];
}

export interface CalibrationEvaluationResult {
  outcome: 'completed' | 'rejected';
  evaluation: CalibrationEvaluation;
}

function diagnostic(
  code: CalibrationDiagnosticCode,
  path: string,
  parameters: Record<string, string | number> = {},
): CalibrationDiagnostic {
  return { code, path, parameters };
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

function countFormulaEvidence(record: DatasetRecordSnapshot): { known: number; total: number; unknown: number } {
  const states = [
    ...record.formula.flourComponents.flatMap((flour) => Object.values(flour.composition)),
    ...record.formula.ingredientLines.flatMap((line) => Object.values(line.composition)),
  ];
  return {
    known: states.filter((state) => state.state === 'known').length,
    total: states.length,
    unknown: states.filter((state) => state.state === 'unknown').length,
  };
}

function validProtocol(protocol: CalibrationProtocol): boolean {
  if (!protocol || !Array.isArray(protocol.fitPartitions) || !Array.isArray(protocol.heldOutPartitions)) return false;
  const partitions = new Set(['calibration', 'validation', 'test']);
  const qualities: DatasetQuality[] = ['high', 'medium', 'low'];
  const weightKeys = Object.keys(protocol.qualityWeights ?? {}).sort();
  return Boolean(protocol.protocolId && protocol.version && protocol.modelVersion && protocol.weightVersion)
    && protocol.fitPartitions.length > 0
    && protocol.heldOutPartitions.length > 0
    && protocol.fitPartitions.every((partition) => partitions.has(partition))
    && protocol.heldOutPartitions.every((partition) => partitions.has(partition))
    && protocol.fitPartitions.every((partition, index) => protocol.fitPartitions.indexOf(partition) === index)
    && protocol.heldOutPartitions.every((partition, index) => protocol.heldOutPartitions.indexOf(partition) === index)
    && protocol.fitPartitions.every((partition) => !protocol.heldOutPartitions.includes(partition))
    && weightKeys.join('|') === qualities.slice().sort().join('|')
    && qualities.every((quality) => Number.isFinite((protocol.qualityWeights ?? {})[quality]) && (protocol.qualityWeights ?? {})[quality] > 0)
    && Number.isInteger(protocol.minimumFitRecords)
    && protocol.minimumFitRecords > 0;
}

function emptyEvaluation(
  release: DatasetRelease,
  protocol: CalibrationProtocol,
  diagnostics: CalibrationDiagnostic[],
): CalibrationEvaluation {
  const testRecordIds = release.records.filter((record) => record.evaluationPartition === 'test').map((record) => record.recordId).sort();
  return {
    outcome: 'rejected',
    evaluationId: digest({ release: release.descriptor.contentIdentity, protocol }),
    evaluatorVersion: CALIBRATION_EVALUATOR_VERSION,
    releaseId: release.descriptor.releaseId,
    releaseContentIdentity: release.descriptor.contentIdentity,
    modelVersion: protocol.modelVersion,
    protocolId: protocol.protocolId,
    protocolVersion: protocol.version,
    weightVersion: protocol.weightVersion,
    fitRecordIds: [],
    validationRecordIds: [],
    testRecordIds,
    evidence: [],
    qualityWeights: { ...protocol.qualityWeights },
    coverage: { fitRecords: 0, weightedFitCoverage: 0, processCoverage: 0 },
    diagnostics,
  };
}

export function evaluateCalibrationEvidence(input: {
  release: DatasetRelease;
  protocol: CalibrationProtocol;
  expectedReleaseId?: string;
  expectedModelVersion?: string;
}): CalibrationEvaluationResult {
  const diagnostics: CalibrationDiagnostic[] = [];
  const { release, protocol } = input;
  if (input.expectedReleaseId && input.expectedReleaseId !== release.descriptor.releaseId) diagnostics.push(diagnostic('release_version_mismatch', 'release.releaseId', { expected: input.expectedReleaseId, actual: release.descriptor.releaseId }));
  if (input.expectedModelVersion && input.expectedModelVersion !== protocol.modelVersion) diagnostics.push(diagnostic('release_version_mismatch', 'protocol.modelVersion', { expected: input.expectedModelVersion, actual: protocol.modelVersion }));
  const verification = verifyDatasetRelease(release);
  if (verification.outcome !== 'pass') {
    verification.partitionErrors.forEach((error) => diagnostics.push(diagnostic('partition_violation', error.path, error.parameters)));
    if (verification.recordErrors.length > 0 || verification.roleErrors.length > 0 || verification.localeErrors.length > 0) {
      diagnostics.push(diagnostic('invalid_release', 'release', { releaseId: release.descriptor.releaseId }));
    }
  }
  if (!validProtocol(protocol)) diagnostics.push(diagnostic('invalid_protocol', 'protocol'));
  if (protocol.fitPartitions.includes('test')) diagnostics.push(diagnostic('test_leakage', 'protocol.fitPartitions'));
  if (protocol.fitPartitions.includes('validation')) diagnostics.push(diagnostic('partition_violation', 'protocol.fitPartitions', { partition: 'validation' }));
  if (protocol.fitPartitions.some((partition) => protocol.heldOutPartitions.includes(partition))) diagnostics.push(diagnostic('partition_violation', 'protocol.partitions'));
  const validPartitions = new Set<EvaluationPartition>(['calibration', 'validation', 'test']);
  release.records.forEach((record, index) => {
    if (!validPartitions.has(record.evaluationPartition)) diagnostics.push(diagnostic('missing_partition', `release.records[${index}].evaluationPartition`, { recordId: record.recordId }));
  });
  if (diagnostics.length > 0) {
    const evaluation = emptyEvaluation(release, protocol, diagnostics);
    return { outcome: 'rejected', evaluation };
  }

  const evidence = release.records.map((record) => {
    const formulaEvidence = countFormulaEvidence(record);
    return {
      recordId: record.recordId,
      roles: [...record.roles],
      partition: record.evaluationPartition,
      quality: record.provenance.quality,
      qualityWeight: protocol.qualityWeights[record.provenance.quality],
      formulaKnownFieldCount: formulaEvidence.known,
      formulaFieldCount: formulaEvidence.total,
      processIncluded: record.process !== null,
      unknownFieldCount: formulaEvidence.unknown,
    };
  });
  const fittingEvidence = evidence.filter((item) => item.roles.includes('calibration') && protocol.fitPartitions.includes(item.partition));
  const validationRecordIds = evidence.filter((item) => item.partition === 'validation').map((item) => item.recordId).sort();
  const testRecordIds = evidence.filter((item) => item.partition === 'test').map((item) => item.recordId).sort();
  const fitRecordIds = fittingEvidence.map((item) => item.recordId).sort();
  if (fitRecordIds.length < protocol.minimumFitRecords) diagnostics.push(diagnostic('insufficient_evidence', 'fitRecordIds', { minimum: protocol.minimumFitRecords, actual: fitRecordIds.length }));
  if (fittingEvidence.some((item) => item.unknownFieldCount > 0)) diagnostics.push(diagnostic('unknown_evidence', 'fitRecordIds', { count: fittingEvidence.filter((item) => item.unknownFieldCount > 0).length }));
  const totalWeight = fittingEvidence.reduce((sum, item) => sum + item.qualityWeight, 0);
  const weightedFitCoverage = fittingEvidence.length > 0
    ? fittingEvidence.reduce((sum, item) => sum + (item.formulaFieldCount > 0 ? item.formulaKnownFieldCount / item.formulaFieldCount : 0) * item.qualityWeight, 0) / totalWeight
    : 0;
  const processCoverage = fittingEvidence.length > 0 ? fittingEvidence.filter((item) => item.processIncluded).length / fittingEvidence.length : 0;
  const evaluation: CalibrationEvaluation = {
    outcome: diagnostics.length === 0 ? 'completed' : 'rejected',
    evaluationId: digest({ release: release.descriptor.contentIdentity, protocol, fitRecordIds, validationRecordIds, testRecordIds }),
    evaluatorVersion: CALIBRATION_EVALUATOR_VERSION,
    releaseId: release.descriptor.releaseId,
    releaseContentIdentity: release.descriptor.contentIdentity,
    modelVersion: protocol.modelVersion,
    protocolId: protocol.protocolId,
    protocolVersion: protocol.version,
    weightVersion: protocol.weightVersion,
    fitRecordIds,
    validationRecordIds,
    testRecordIds,
    evidence,
    qualityWeights: { ...protocol.qualityWeights },
    coverage: { fitRecords: fitRecordIds.length, weightedFitCoverage, processCoverage },
    diagnostics,
  };
  return { outcome: evaluation.outcome, evaluation };
}
