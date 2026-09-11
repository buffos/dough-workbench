import type { CoverageInventory, CoverageLocalizedText } from '../../data/reference/coverage';

export const SOURCE_REGISTRY_ID = 'recipe-source-registry';
export const SOURCE_REGISTRY_REVISION = 'sources-v1';

export const SOURCE_ACQUISITION_STATUSES = ['allowed-offline', 'manual-only', 'manual-review', 'blocked', 'unknown'] as const;
export type SourceAcquisitionStatus = (typeof SOURCE_ACQUISITION_STATUSES)[number];
export type SourceReuseStatus = 'normalized-facts-only' | 'review-required' | 'restricted' | 'unknown';
export type SourceQuality = 'high' | 'medium' | 'low';

export interface SourceDefinition {
  sourceId: string;
  citation: CoverageLocalizedText;
  urlOrBibliography: string;
  authorOrPublisher: string;
  accessedAt: string;
  quality: SourceQuality;
  authorityAssessment: CoverageLocalizedText;
  attribution: CoverageLocalizedText;
  acquisitionStatus: SourceAcquisitionStatus;
  reuseStatus: SourceReuseStatus;
  acquisitionMethod: CoverageLocalizedText;
  limitations: CoverageLocalizedText;
  expectedCategories: string[];
  expectedPreparationKeys: string[];
}

export interface SourceRegistry {
  registryId: typeof SOURCE_REGISTRY_ID;
  revision: typeof SOURCE_REGISTRY_REVISION;
  coverageRevision: string;
  createdAt: string;
  policy: {
    runtimeScraping: 'prohibited';
    unattendedCrawling: 'prohibited';
    accessBypass: 'prohibited';
    publicCopiedProse: 'prohibited';
  };
  sources: SourceDefinition[];
}

export type SourceRegistryDiagnosticCode =
  | 'source_review_required'
  | 'source_acquisition_not_allowed'
  | 'duplicate_source_id'
  | 'source_metadata_invalid'
  | 'source_category_link_invalid'
  | 'source_preparation_link_invalid';

export interface SourceRegistryDiagnostic {
  code: SourceRegistryDiagnosticCode;
  path: string;
  parameters: Record<string, string | number>;
}

export interface SourceAcquisitionCheck {
  outcome: 'allowed' | 'rejected';
  source: SourceDefinition | null;
  diagnostic: SourceRegistryDiagnostic | null;
}

function diagnostic(
  code: SourceRegistryDiagnosticCode,
  path: string,
  parameters: Record<string, string | number> = {},
): SourceRegistryDiagnostic {
  return { code, path, parameters };
}

function nonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function localized(value: unknown): value is CoverageLocalizedText {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return nonEmpty(item.en) && nonEmpty(item.el);
}

export function validateSourceRegistry(
  registry: SourceRegistry,
  inventory: CoverageInventory,
): SourceRegistryDiagnostic[] {
  const diagnostics: SourceRegistryDiagnostic[] = [];
  const categoryIds = new Set(inventory.categories.map((item) => item.id));
  const preparationKeys = new Set(inventory.entries.map((item) => item.preparationKey));
  const sourceIds = new Set<string>();

  if (registry.registryId !== SOURCE_REGISTRY_ID || registry.revision !== SOURCE_REGISTRY_REVISION || registry.coverageRevision !== inventory.revision) {
    diagnostics.push(diagnostic('source_metadata_invalid', 'registry', { expectedCoverageRevision: inventory.revision }));
  }
  if (registry.policy.runtimeScraping !== 'prohibited'
    || registry.policy.unattendedCrawling !== 'prohibited'
    || registry.policy.accessBypass !== 'prohibited'
    || registry.policy.publicCopiedProse !== 'prohibited') {
    diagnostics.push(diagnostic('source_metadata_invalid', 'policy'));
  }

  registry.sources.forEach((source, index) => {
    const path = `sources[${index}]`;
    if (!nonEmpty(source.sourceId)) {
      diagnostics.push(diagnostic('source_metadata_invalid', `${path}.sourceId`));
    } else if (sourceIds.has(source.sourceId)) {
      diagnostics.push(diagnostic('duplicate_source_id', `${path}.sourceId`, { sourceId: source.sourceId }));
    } else {
      sourceIds.add(source.sourceId);
    }
    if (!localized(source.citation) || !nonEmpty(source.urlOrBibliography) || !nonEmpty(source.authorOrPublisher)
      || !nonEmpty(source.accessedAt) || !localized(source.authorityAssessment) || !localized(source.attribution)
      || !localized(source.acquisitionMethod) || !localized(source.limitations)) {
      diagnostics.push(diagnostic('source_metadata_invalid', `${path}.metadata`));
    }
    if (!SOURCE_ACQUISITION_STATUSES.includes(source.acquisitionStatus)) {
      diagnostics.push(diagnostic('source_metadata_invalid', `${path}.acquisitionStatus`));
    }
    if (!['normalized-facts-only', 'review-required', 'restricted', 'unknown'].includes(source.reuseStatus)) {
      diagnostics.push(diagnostic('source_review_required', `${path}.reuseStatus`, { sourceId: source.sourceId }));
    }
    if (source.expectedCategories.length === 0) {
      diagnostics.push(diagnostic('source_metadata_invalid', `${path}.expectedCategories`));
    }
    source.expectedCategories.forEach((categoryId, categoryIndex) => {
      if (!categoryIds.has(categoryId)) {
        diagnostics.push(diagnostic('source_category_link_invalid', `${path}.expectedCategories[${categoryIndex}]`, { categoryId }));
      }
    });
    source.expectedPreparationKeys.forEach((preparationKey, preparationIndex) => {
      if (!preparationKeys.has(preparationKey)) {
        diagnostics.push(diagnostic('source_preparation_link_invalid', `${path}.expectedPreparationKeys[${preparationIndex}]`, { preparationKey }));
      }
    });
  });
  return diagnostics;
}

export function checkSourceAcquisition(
  registry: SourceRegistry,
  sourceId: string,
): SourceAcquisitionCheck {
  const source = registry.sources.find((candidate) => candidate.sourceId === sourceId);
  if (!source) {
    return {
      outcome: 'rejected',
      source: null,
      diagnostic: diagnostic('source_review_required', 'sourceId', { sourceId }),
    };
  }
  if (source.acquisitionStatus === 'blocked' || source.acquisitionStatus === 'unknown' || source.acquisitionStatus === 'manual-review' || source.reuseStatus !== 'normalized-facts-only') {
    return {
      outcome: 'rejected',
      source: null,
      diagnostic: diagnostic(
        source.acquisitionStatus === 'blocked'
          ? 'source_acquisition_not_allowed'
          : 'source_review_required',
        `sources.${sourceId}`,
        { sourceId, acquisitionStatus: source.acquisitionStatus, reuseStatus: source.reuseStatus },
      ),
    };
  }
  if (source.acquisitionStatus !== 'allowed-offline' && source.acquisitionStatus !== 'manual-only') {
    return {
      outcome: 'rejected',
      source: null,
      diagnostic: diagnostic('source_acquisition_not_allowed', `sources.${sourceId}`, { sourceId }),
    };
  }
  return { outcome: 'allowed', source, diagnostic: null };
}
