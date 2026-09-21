import { calculateIntrinsicMetrics } from './composition';
import {
  buildClassificationFeatureSet,
  evaluatePrototypeSimilarities,
} from './classification';
import { evaluateEffectiveBehavior } from './effective';
import { prepareAnalysisInput } from './handoff';
import {
  createLocalDraftFromReference,
} from './reference-start';
import {
  resolvePrototypeCatalog,
  type PrototypeCatalogSnapshot,
  type PrototypeCatalogDiagnostic,
  type ResolvedPrototypeCatalogSnapshot,
} from './prototype-catalog';
import type { DatasetRecordSnapshot } from './dataset';
import { structuralFamilyMatches } from './structural-taxonomy';

export const PROTOTYPE_ASSIGNMENT_MINIMUM_MATCH = 0.75;

export type PrototypeAssignmentDiagnosticCode =
  | 'PROTOTYPE_CATALOG_INVALID'
  | 'PROTOTYPE_NOT_FOUND'
  | 'PROTOTYPE_FAMILY_MISMATCH'
  | 'PROTOTYPE_ASSIGNMENT_UNAVAILABLE'
  | 'PROTOTYPE_ASSIGNMENT_CONFLICT'
  | 'PROTOTYPE_ASSIGNMENT_BELOW_THRESHOLD';

export interface PrototypeAssignmentDiagnostic {
  code: PrototypeAssignmentDiagnosticCode;
  path: string;
  parameters: Record<string, string | number>;
}

export interface PrototypeAssignmentValidationReport {
  outcome: 'pass' | 'fail';
  diagnostics: PrototypeAssignmentDiagnostic[];
}

function catalogDiagnosticParameters(diagnostic: PrototypeCatalogDiagnostic): Record<string, string | number> {
  return Object.fromEntries(Object.entries(diagnostic.parameters).map(([key, value]) => [key, value]));
}

function resolvedCatalog(
  catalog: PrototypeCatalogSnapshot,
): { snapshot: ResolvedPrototypeCatalogSnapshot; diagnostics: PrototypeAssignmentDiagnostic[] } {
  const result = resolvePrototypeCatalog(catalog);
  if (result.status === 'resolved') return { snapshot: result.snapshot, diagnostics: [] };
  return {
    snapshot: { reference: catalog.reference, definitions: [], byId: {}, integrity: catalog.integrity },
    diagnostics: result.diagnostics.map((item) => ({
      code: 'PROTOTYPE_CATALOG_INVALID',
      path: item.path,
      parameters: catalogDiagnosticParameters(item),
    })),
  };
}

function assignmentDiagnostic(
  code: PrototypeAssignmentDiagnosticCode,
  path: string,
  parameters: Record<string, string | number> = {},
): PrototypeAssignmentDiagnostic {
  return { code, path, parameters };
}

function validateRecordAssignment(
  record: DatasetRecordSnapshot,
  index: number,
  catalog: PrototypeCatalogSnapshot,
  resolved: ResolvedPrototypeCatalogSnapshot,
): PrototypeAssignmentDiagnostic[] {
  const prototypeId = record.identity.prototypeId;
  if (!prototypeId) return [];

  const path = `records.${index}`;
  const definition = resolved.byId[prototypeId];
  if (!definition) {
    return [assignmentDiagnostic('PROTOTYPE_NOT_FOUND', `${path}.identity.prototypeId`, { prototypeId })];
  }

  const diagnostics: PrototypeAssignmentDiagnostic[] = [];
  const familyMatches = definition.familyIds.some((familyId) => (
    structuralFamilyMatches(record.identity.familyId, familyId)
  ));
  if (!familyMatches) {
    diagnostics.push(assignmentDiagnostic('PROTOTYPE_FAMILY_MISMATCH', `${path}.identity.familyId`, {
      preparationKey: record.identity.preparationKey,
      familyId: record.identity.familyId,
      prototypeId,
    }));
  }

  if (!record.process) {
    diagnostics.push(assignmentDiagnostic('PROTOTYPE_ASSIGNMENT_UNAVAILABLE', `${path}.process`, {
      preparationKey: record.identity.preparationKey,
      prototypeId,
      reason: 'process-snapshot-required',
    }));
    return diagnostics;
  }

  const started = createLocalDraftFromReference(record);
  if (!started.formula || !started.process) {
    diagnostics.push(assignmentDiagnostic('PROTOTYPE_ASSIGNMENT_UNAVAILABLE', path, {
      preparationKey: record.identity.preparationKey,
      prototypeId,
      reason: 'reference-copy-invalid',
    }));
    return diagnostics;
  }

  const handoff = prepareAnalysisInput(started.formula, started.process, { requestedPath: 'full' });
  if (!handoff.data) {
    diagnostics.push(assignmentDiagnostic('PROTOTYPE_ASSIGNMENT_UNAVAILABLE', path, {
      preparationKey: record.identity.preparationKey,
      prototypeId,
      reason: 'analysis-input-unavailable',
    }));
    return diagnostics;
  }

  const intrinsic = calculateIntrinsicMetrics(handoff.data.formula);
  const effective = evaluateEffectiveBehavior({ reference: handoff.data, intrinsic });
  const featureSet = buildClassificationFeatureSet({
    reference: handoff.data,
    intrinsic,
    effective,
    catalog: { status: 'available', snapshot: catalog },
  });
  if (featureSet.status !== 'ready') {
    diagnostics.push(assignmentDiagnostic('PROTOTYPE_ASSIGNMENT_UNAVAILABLE', path, {
      preparationKey: record.identity.preparationKey,
      prototypeId,
      reason: 'classification-feature-set-unavailable',
    }));
    return diagnostics;
  }

  const candidate = evaluatePrototypeSimilarities(featureSet.data, catalog)
    .find((item) => item.prototypeId === prototypeId);
  if (!candidate) {
    diagnostics.push(assignmentDiagnostic('PROTOTYPE_NOT_FOUND', `${path}.identity.prototypeId`, { prototypeId }));
    return diagnostics;
  }
  if (candidate.status === 'conflicted') {
    diagnostics.push(assignmentDiagnostic('PROTOTYPE_ASSIGNMENT_CONFLICT', `${path}.identity.prototypeId`, {
      preparationKey: record.identity.preparationKey,
      prototypeId,
      status: candidate.status,
    }));
  }
  if ((candidate.overallIdentitySimilarity ?? 0) < PROTOTYPE_ASSIGNMENT_MINIMUM_MATCH) {
    diagnostics.push(assignmentDiagnostic('PROTOTYPE_ASSIGNMENT_BELOW_THRESHOLD', `${path}.identity.prototypeId`, {
      preparationKey: record.identity.preparationKey,
      prototypeId,
      score: candidate.overallIdentitySimilarity ?? 0,
      minimum: PROTOTYPE_ASSIGNMENT_MINIMUM_MATCH,
    }));
  }
  return diagnostics;
}

export function validatePrototypeAssignments(
  records: readonly DatasetRecordSnapshot[],
  catalog: PrototypeCatalogSnapshot,
): PrototypeAssignmentValidationReport {
  const resolvedResult = resolvedCatalog(catalog);
  if (resolvedResult.diagnostics.length > 0) {
    return { outcome: 'fail', diagnostics: resolvedResult.diagnostics };
  }

  const diagnostics = records.flatMap((record, index) => validateRecordAssignment(
    record,
    index,
    catalog,
    resolvedResult.snapshot,
  ));
  return {
    outcome: diagnostics.length === 0 ? 'pass' : 'fail',
    diagnostics,
  };
}
