import type { CoverageInventory } from '../../data/reference/coverage';
import { checkSourceAcquisition, type SourceRegistry } from './source-registry';
import {
  PROCESS_FIELD_DESCRIPTORS,
  type ProcessValuePath,
} from './process';
import type {
  CandidateRecord,
  NormalizationTrace,
} from './acquisition';

export const CURATION_POLICY_VERSION = 'candidate-curation-v1';
export const PILOT_CANDIDATE_SET_VERSION = 'pilot-v1';

export type CurationDecision = 'pending' | 'returned-for-correction' | 'accepted-for-release' | 'rejected';

export interface CandidateReleasePlan {
  roles: ('reference' | 'calibration')[];
  evaluationPartition: 'calibration' | 'validation' | 'test';
  publicSelectable: boolean;
  primary: boolean;
  maturity: 'expert-seed' | 'gold-calibrated' | 'broad-calibrated' | 'experiment-validated';
}

export interface CurationCheckSet {
  sourceAttribution: boolean;
  formulaTranscription: boolean;
  gramNormalization: boolean;
  ingredientResolution: boolean;
  unknownHandling: boolean;
  processEvidence: boolean;
}

export interface CurationReview {
  reviewId: string;
  candidateId: string;
  reviewerRole: 'source-curator' | 'formula-reviewer' | 'process-reviewer';
  decision: CurationDecision;
  reviewedAt: string;
  checks: CurationCheckSet;
  reason: { en: string; el: string };
  releasePlan?: CandidateReleasePlan;
}

export type CurationDiagnosticCode =
  | 'candidate_not_ready'
  | 'traceability_missing'
  | 'source_review_required'
  | 'normalization_invalid'
  | 'pilot_coverage_gap'
  | 'handoff_immutable';

export interface CurationDiagnostic {
  code: CurationDiagnosticCode;
  path: string;
  parameters: Record<string, string | number>;
}

export interface CandidateReviewResult {
  outcome: 'reviewed' | 'rejected';
  candidate: CandidateRecord | null;
  diagnostic: CurationDiagnostic | null;
}

export interface PilotCoveragePolicy {
  minimumPerCategory: 2;
  maximumPerCategory: 3;
}

export interface PilotCategoryCoverage {
  categoryId: string;
  plannedCount: number;
  acceptedCount: number;
  sourcePathAvailable: boolean;
  targetMet: boolean;
  gapCodes: string[];
}

export interface PilotCoverageReport {
  inventoryRevision: string;
  candidateSet: string;
  policyVersion: typeof CURATION_POLICY_VERSION;
  targetPerCategory: { minimum: number; maximum: number };
  categoryCounts: Record<string, PilotCategoryCoverage>;
  structuralFamilyCounts: Record<string, number>;
  sourceCoverage: Record<string, number>;
  unrepresentedFamilies: string[];
  missingInventoryEntries: string[];
  blockedEntries: string[];
  unresolvedGaps: CurationDiagnostic[];
  acceptedCandidateIds: string[];
  outcome: 'reported';
  isPilotSample: true;
  notes: { en: string; el: string };
  identity: string;
}

export interface PilotHandoff {
  handoffId: string;
  inventoryRevision: string;
  candidateSet: string;
  candidateIds: string[];
  candidates: CandidateRecord[];
  createdAt: string;
  identity: string;
  immutable: true;
}

export interface PilotHandoffResult {
  outcome: 'prepared' | 'rejected';
  handoff: PilotHandoff | null;
  diagnostic: CurationDiagnostic | null;
}

function diagnostic(
  code: CurationDiagnosticCode,
  path: string,
  parameters: Record<string, string | number> = {},
): CurationDiagnostic {
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

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function requiredTracePaths(candidate: CandidateRecord): string[] {
  const paths: string[] = [];
  candidate.formula?.flourComponents.forEach((_, index) => {
    paths.push(`formula.flourComponents[${index}].name`, `formula.flourComponents[${index}].mass`, `formula.flourComponents[${index}].absorption`);
    Object.keys(candidate.formula?.flourComponents[index].composition ?? {}).forEach((field) => paths.push(`formula.flourComponents[${index}].composition.${field}`));
  });
  candidate.formula?.ingredientLines.forEach((_, index) => {
    paths.push(`formula.ingredientLines[${index}].name`, `formula.ingredientLines[${index}].mass`, `formula.ingredientLines[${index}].role`);
    Object.keys(candidate.formula?.ingredientLines[index].composition ?? {}).forEach((field) => paths.push(`formula.ingredientLines[${index}].composition.${field}`));
  });
  if (candidate.processPresent) PROCESS_FIELD_DESCRIPTORS.forEach((field) => paths.push(`process.${field.path}`));
  return paths;
}

function hasTraceFor(path: string, traces: readonly NormalizationTrace[]): boolean {
  return traces.some((trace) => trace.path === path);
}

function candidateReadyForReview(
  candidate: CandidateRecord,
  registry: SourceRegistry,
): CurationDiagnostic | null {
  if (!candidate.formula || candidate.diagnostics.length > 0) return diagnostic('candidate_not_ready', 'candidate.formula', { candidateId: candidate.candidateId });
  if (checkSourceAcquisition(registry, candidate.sourceId).outcome !== 'allowed') return diagnostic('source_review_required', 'candidate.sourceId', { sourceId: candidate.sourceId });
  const missingTrace = requiredTracePaths(candidate).find((path) => !hasTraceFor(path, candidate.normalization));
  if (missingTrace) return diagnostic('traceability_missing', missingTrace, { candidateId: candidate.candidateId });
  return null;
}

export function reviewCandidateRecord(
  candidate: CandidateRecord,
  review: CurationReview,
  registry: SourceRegistry,
): CandidateReviewResult {
  const readinessDiagnostic = candidateReadyForReview(candidate, registry);
  if (readinessDiagnostic && review.decision === 'accepted-for-release') {
    return { outcome: 'rejected', candidate: null, diagnostic: readinessDiagnostic };
  }
  if (!review.reviewId || review.candidateId !== candidate.candidateId || !review.reviewedAt) {
    return { outcome: 'rejected', candidate: null, diagnostic: diagnostic('candidate_not_ready', 'review', { candidateId: candidate.candidateId }) };
  }
  const checksPass = review.checks.sourceAttribution
    && review.checks.formulaTranscription
    && review.checks.gramNormalization
    && review.checks.ingredientResolution
    && review.checks.unknownHandling
    && (!candidate.processPresent || review.checks.processEvidence);
  if (review.decision === 'accepted-for-release' && !checksPass) {
    return { outcome: 'rejected', candidate: null, diagnostic: diagnostic('candidate_not_ready', 'review.checks', { candidateId: candidate.candidateId }) };
  }
  if ((review.decision === 'returned-for-correction' || review.decision === 'rejected')
    && (!review.reason.en.trim() || !review.reason.el.trim())) {
    return { outcome: 'rejected', candidate: null, diagnostic: diagnostic('candidate_not_ready', 'review.reason', { candidateId: candidate.candidateId }) };
  }
  const status: CandidateRecord['status'] = review.decision === 'accepted-for-release'
    ? 'ready-for-release'
    : review.decision === 'rejected'
      ? 'rejected'
      : 'needs-review';
  return {
    outcome: 'reviewed',
    candidate: { ...clone(candidate), status, review: clone(review) },
    diagnostic: null,
  };
}

function sourcePathAvailable(
  registry: SourceRegistry,
  categoryId: string,
  preparationKeys: readonly string[],
): boolean {
  return registry.sources.some((source) => {
    const usable = source.acquisitionStatus === 'allowed-offline' || source.acquisitionStatus === 'manual-only';
    const reusable = source.reuseStatus === 'normalized-facts-only';
    return usable && reusable && (source.expectedCategories.includes(categoryId) || preparationKeys.some((key) => source.expectedPreparationKeys.includes(key)));
  });
}

export function preparePilotCoverage(
  inventory: CoverageInventory,
  registry: SourceRegistry,
  candidates: readonly CandidateRecord[],
  policy: PilotCoveragePolicy = { minimumPerCategory: 2, maximumPerCategory: 3 },
): PilotCoverageReport {
  const accepted = candidates.filter((candidate) => candidate.status === 'ready-for-release' && candidate.review?.decision === 'accepted-for-release');
  const acceptedByPreparation = new Map(accepted.map((candidate) => [candidate.preparationKey, candidate]));
  const categoryCounts: Record<string, PilotCategoryCoverage> = {};
  const structuralFamilyCounts: Record<string, number> = {};
  const sourceCoverage: Record<string, number> = {};
  const unresolvedGaps: CurationDiagnostic[] = [];
  const missingInventoryEntries: string[] = [];
  const blockedEntries: string[] = [];

  inventory.categories.forEach((category) => {
    const entries = inventory.entries.filter((entry) => entry.primaryCategory === category.id);
    const categoryCandidates = accepted.filter((candidate) => entries.some((entry) => entry.preparationKey === candidate.preparationKey));
    const pathAvailable = sourcePathAvailable(registry, category.id, entries.map((entry) => entry.preparationKey));
    const gapCodes: string[] = [];
    if (!pathAvailable) gapCodes.push('source_review_required');
    if (pathAvailable && categoryCandidates.length < policy.minimumPerCategory) gapCodes.push('pilot_coverage_gap');
    if (categoryCandidates.length > policy.maximumPerCategory) gapCodes.push('pilot_target_exceeded');
    categoryCounts[category.id] = {
      categoryId: category.id,
      plannedCount: entries.length,
      acceptedCount: categoryCandidates.length,
      sourcePathAvailable: pathAvailable,
      targetMet: pathAvailable ? categoryCandidates.length >= policy.minimumPerCategory : false,
      gapCodes,
    };
    if (gapCodes.length > 0) unresolvedGaps.push(diagnostic('pilot_coverage_gap', `categories.${category.id}`, { categoryId: category.id, acceptedCount: categoryCandidates.length }));
    if (!pathAvailable) entries.forEach((entry) => blockedEntries.push(entry.preparationKey));
  });

  inventory.entries.forEach((entry) => {
    const candidate = acceptedByPreparation.get(entry.preparationKey);
    if (!candidate) missingInventoryEntries.push(entry.preparationKey);
  });
  accepted.forEach((candidate) => {
    candidate.structuralFamilyIds.forEach((familyId) => { structuralFamilyCounts[familyId] = (structuralFamilyCounts[familyId] ?? 0) + 1; });
    sourceCoverage[candidate.sourceId] = (sourceCoverage[candidate.sourceId] ?? 0) + 1;
  });
  const plannedFamilies = new Set(inventory.entries.flatMap((entry) => entry.candidateStructuralFamilies));
  const unrepresentedFamilies = [...plannedFamilies].filter((familyId) => (structuralFamilyCounts[familyId] ?? 0) === 0).sort();
  const acceptedCandidateIds = accepted.map((candidate) => candidate.candidateId).sort();
  return {
    inventoryRevision: inventory.revision,
    candidateSet: PILOT_CANDIDATE_SET_VERSION,
    policyVersion: CURATION_POLICY_VERSION,
    targetPerCategory: { minimum: policy.minimumPerCategory, maximum: policy.maximumPerCategory },
    categoryCounts,
    structuralFamilyCounts,
    sourceCoverage,
    unrepresentedFamilies,
    missingInventoryEntries,
    blockedEntries: [...new Set(blockedEntries)].sort(),
    unresolvedGaps,
    acceptedCandidateIds,
    outcome: 'reported',
    isPilotSample: true,
    notes: {
      en: 'This is a pipeline-validation sample, not complete inventory coverage or a claim of calibrated accuracy.',
      el: 'Αυτό είναι δείγμα ελέγχου της pipeline, όχι πλήρης κάλυψη του καταλόγου ούτε ισχυρισμός βαθμονομημένης ακρίβειας.',
    },
    identity: digest({ inventoryRevision: inventory.revision, candidateSet: PILOT_CANDIDATE_SET_VERSION, acceptedCandidateIds, categoryCounts, structuralFamilyCounts, sourceCoverage }),
  };
}

export function preparePilotHandoff(
  inventory: CoverageInventory,
  report: PilotCoverageReport,
  candidates: readonly CandidateRecord[],
  createdAt: string,
): PilotHandoffResult {
  const selected = report.acceptedCandidateIds
    .map((candidateId) => candidates.find((candidate) => candidate.candidateId === candidateId))
    .filter((candidate): candidate is CandidateRecord => Boolean(candidate));
  if (selected.length !== report.acceptedCandidateIds.length || selected.some((candidate) => candidate.status !== 'ready-for-release' || candidate.review?.decision !== 'accepted-for-release')) {
    return { outcome: 'rejected', handoff: null, diagnostic: diagnostic('candidate_not_ready', 'handoff.candidates', { expected: report.acceptedCandidateIds.length, actual: selected.length }) };
  }
  const candidateIds = selected.map((candidate) => candidate.candidateId).sort();
  const identity = digest({ inventoryRevision: inventory.revision, candidateSet: report.candidateSet, candidateIds, candidateIdentities: selected.map((candidate) => candidate.identity).sort() });
  return {
    outcome: 'prepared',
    handoff: {
      handoffId: `handoff-${identity.slice(-8)}`,
      inventoryRevision: inventory.revision,
      candidateSet: report.candidateSet,
      candidateIds,
      candidates: clone(selected),
      createdAt,
      identity,
      immutable: true,
    },
    diagnostic: null,
  };
}

export function processPathsForTraceCheck(): ProcessValuePath[] {
  return PROCESS_FIELD_DESCRIPTORS.map((field) => field.path);
}
