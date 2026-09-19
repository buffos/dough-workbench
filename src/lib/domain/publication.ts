import {
  GOLD_DATASET_KIND,
  GOLD_DATASET_MODEL_VERSION,
  GOLD_DATASET_RELEASE_ID,
  computeReleaseContentIdentity,
  verifyDatasetRelease,
  type DatasetRelease,
  type DatasetReleaseRegistry,
  type DatasetRecordSnapshot,
  type DatasetDiagnostic,
} from './dataset';
import type { PilotHandoff } from './curation';
import type { SourceRegistry } from './source-registry';

export interface PublicationResult {
  outcome: 'published' | 'rejected';
  release: DatasetRelease | null;
  diagnostic: DatasetDiagnostic | null;
}

function diagnostic(code: DatasetDiagnostic['code'], path: string, parameters: Record<string, string | number> = {}): DatasetDiagnostic {
  return { code, path, parameters };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function assembleGoldDatasetRelease(input: {
  handoff: PilotHandoff;
  registry: SourceRegistry;
  modifierIdsByPreparationKey?: Readonly<Record<string, readonly string[]>>;
  prototypeIdsByPreparationKey?: Readonly<Record<string, string>>;
  releaseId?: string;
  createdAt: string;
  supersedes?: string | null;
  defaultModelVersion?: string;
}): PublicationResult {
  const releaseId = input.releaseId ?? GOLD_DATASET_RELEASE_ID;
  const records: DatasetRecordSnapshot[] = [];
  for (const candidate of input.handoff.candidates) {
    const review = candidate.review;
    const releasePlan = review?.releasePlan;
    const source = input.registry.sources.find((item) => item.sourceId === candidate.sourceId);
    if (!candidate.formula || !review || review.decision !== 'accepted-for-release' || !releasePlan || !source) {
      return {
        outcome: 'rejected',
        release: null,
        diagnostic: diagnostic('record_invalid', `candidates.${candidate.candidateId}`, { reason: 'accepted-release-plan-required' }),
      };
    }
    if (candidate.diagnostics.length > 0 || candidate.status !== 'ready-for-release') {
      return {
        outcome: 'rejected',
        release: null,
        diagnostic: diagnostic('record_invalid', `candidates.${candidate.candidateId}`, { reason: 'candidate-not-ready' }),
      };
    }
    records.push({
      releaseId,
      recordId: candidate.candidateId,
      identity: {
        preparationKey: candidate.preparationKey,
        label: { ...candidate.label },
        familyId: candidate.structuralFamilyIds[0] ?? 'unmapped-family',
        ...(input.prototypeIdsByPreparationKey?.[candidate.preparationKey]
          ? { prototypeId: input.prototypeIdsByPreparationKey[candidate.preparationKey] }
          : {}),
        modifierIds: [...(input.modifierIdsByPreparationKey?.[candidate.preparationKey] ?? [])],
      },
      formula: clone(candidate.formula),
      process: candidate.process ? clone(candidate.process) : null,
      provenance: {
        sourceId: candidate.sourceId,
        quality: source.quality,
        curationState: 'accepted',
        reviewNote: { ...review.reason },
        citation: { ...source.citation },
      },
      roles: [...releasePlan.roles],
      evaluationPartition: releasePlan.evaluationPartition,
      publicSelectable: releasePlan.publicSelectable,
      primary: releasePlan.primary,
      maturity: releasePlan.maturity,
      normalization: candidate.normalization.map((trace) => ({ ...trace })),
    });
  }
  const descriptor: DatasetRelease['descriptor'] = {
    releaseId,
    kind: GOLD_DATASET_KIND,
    status: 'published' as const,
    contentIdentity: '',
    createdAt: input.createdAt,
    supersedes: input.supersedes ?? null,
    recordCount: records.length,
    defaultModelVersion: input.defaultModelVersion ?? GOLD_DATASET_MODEL_VERSION,
  };
  const release: DatasetRelease = {
    descriptor: { ...descriptor, contentIdentity: computeReleaseContentIdentity({ descriptor, records }) },
    records,
  };
  const verification = verifyDatasetRelease(release);
  if (verification.outcome !== 'pass') {
    return {
      outcome: 'rejected',
      release: null,
      diagnostic: verification.recordErrors[0] ?? verification.roleErrors[0] ?? verification.partitionErrors[0] ?? verification.localeErrors[0] ?? diagnostic('release_invalid', 'release'),
    };
  }
  return { outcome: 'published', release, diagnostic: null };
}

export function publishIntoRegistry(
  registry: DatasetReleaseRegistry,
  release: DatasetRelease,
): { outcome: 'published' | 'rejected'; registry: DatasetReleaseRegistry | null; diagnostic: DatasetDiagnostic | null } {
  if (registry.releases[release.descriptor.releaseId]) {
    return {
      outcome: 'rejected',
      registry: null,
      diagnostic: diagnostic('release_id_conflict', 'release.descriptor.releaseId', { releaseId: release.descriptor.releaseId }),
    };
  }
  return {
    outcome: 'published',
    registry: {
      currentReleaseId: release.descriptor.releaseId,
      releases: { ...registry.releases, [release.descriptor.releaseId]: clone(release) },
    },
    diagnostic: null,
  };
}
