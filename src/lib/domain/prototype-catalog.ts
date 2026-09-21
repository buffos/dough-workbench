export const PROTOTYPE_CATALOG_INTEGRITY_POLICY = 'prototype-catalog-integrity-v1';
export const PROTOTYPE_CATALOG_ID = 'prototype-catalog';
export const PROTOTYPE_CATALOG_VERSION = 'prototype-catalog-v4';
export const PROTOTYPE_MODEL_VERSION = 'prototype-model-v3';

export const PROTOTYPE_CONFIDENCE_TIERS = ['high', 'medium', 'calibration-limited'] as const;
export type PrototypeConfidenceTier = (typeof PROTOTYPE_CONFIDENCE_TIERS)[number];

export const PROTOTYPE_MATURITIES = ['expert-seed', 'calibration-limited'] as const;
export type PrototypeMaturity = (typeof PROTOTYPE_MATURITIES)[number];

export const PROTOTYPE_IMPORTANCE_LEVELS = ['critical', 'high', 'medium', 'low'] as const;
export type PrototypeImportance = (typeof PROTOTYPE_IMPORTANCE_LEVELS)[number];

export const PROTOTYPE_QUALITATIVE_BANDS = ['very_low', 'low', 'medium', 'high', 'very_high'] as const;
export type PrototypeQualitativeBand = (typeof PROTOTYPE_QUALITATIVE_BANDS)[number];

export const PROTOTYPE_PRESENCE_TARGETS = ['required', 'present', 'absent', 'optional', 'none_or_low'] as const;
export type PrototypePresenceTarget = (typeof PROTOTYPE_PRESENCE_TARGETS)[number];

export type PrototypeLocale = 'en' | 'el';

export interface PrototypeLocalizedLabel {
  en: string;
  el: string;
}

export type PrototypeFeatureTarget =
  | { kind: 'band'; value: PrototypeQualitativeBand }
  | { kind: 'band-range'; min: PrototypeQualitativeBand; max: PrototypeQualitativeBand }
  | { kind: 'presence'; value: PrototypePresenceTarget }
  | { kind: 'compatibility'; values: readonly string[] };

export interface PrototypeFeature {
  id: string;
  label: PrototypeLocalizedLabel;
  target: PrototypeFeatureTarget;
  importance: PrototypeImportance;
}

export interface PrototypeProcessProfileFact {
  id: string;
  label: PrototypeLocalizedLabel;
  value: PrototypeLocalizedLabel;
  note?: PrototypeLocalizedLabel;
}

export interface PrototypeProcessProfileSection {
  id: string;
  label: PrototypeLocalizedLabel;
  facts: readonly PrototypeProcessProfileFact[];
}

export interface PrototypeMatcherPolicy {
  id: string;
  mode: 'qualitative';
  missingFeaturePolicy: 'limit-match';
  criticalMismatchPolicy: 'block-strong-match';
  identityModifierPolicy: 'report-separately';
}

export interface PrototypeProvenance {
  sourceId: string;
  sourceVersion?: string;
  method: 'expert-seed' | 'catalog-author';
  note: PrototypeLocalizedLabel;
}

export interface PrototypeDefinition {
  id: string;
  kind: 'family' | 'prototype';
  label: PrototypeLocalizedLabel;
  parentIds: readonly string[];
  familyIds: readonly string[];
  structuralFeatures: readonly PrototypeFeature[];
  structuralConstraints: readonly PrototypeFeature[];
  identityModifiers: readonly PrototypeFeature[];
  processProfile?: readonly PrototypeProcessProfileSection[];
  matcherPolicy?: PrototypeMatcherPolicy;
  confidenceTier: PrototypeConfidenceTier;
  maturity: PrototypeMaturity;
  provenance: PrototypeProvenance;
}

export interface PrototypeCatalogInput {
  catalogId: string;
  version: string;
  modelVersion: string;
  supportedLocales: readonly PrototypeLocale[];
  definitions: readonly PrototypeDefinition[];
  contentHash?: string;
}

export interface PrototypeCatalogReference {
  catalogId: string;
  version: string;
  modelVersion: string;
  contentHash: string;
}

export interface PrototypeCatalogSnapshot {
  catalogId: string;
  version: string;
  modelVersion: string;
  contentHash: string;
  supportedLocales: readonly PrototypeLocale[];
  definitions: readonly PrototypeDefinition[];
  reference: PrototypeCatalogReference;
  integrity: {
    policy: typeof PROTOTYPE_CATALOG_INTEGRITY_POLICY;
    status: 'verified';
  };
}

export type PrototypeCatalogDiagnosticCode =
  | 'CATALOG_VERSION_UNAVAILABLE'
  | 'MODEL_VERSION_UNAVAILABLE'
  | 'DUPLICATE_ID'
  | 'DUPLICATE_FEATURE_DECLARATION'
  | 'MALFORMED_METADATA'
  | 'INVALID_REFERENCE'
  | 'INVALID_FAMILY_ASSIGNMENT'
  | 'CONFLICTING_PARENT_RULE'
  | 'CHILD_RULE_OUTSIDE_PARENT'
  | 'PROTOTYPE_REFERENCE_CYCLE'
  | 'MISSING_MATCHER_POLICY';

export interface PrototypeCatalogDiagnostic {
  code: PrototypeCatalogDiagnosticCode;
  severity: 'error' | 'warning';
  path: string;
  messageKey: string;
  parameters: Record<string, string | number>;
}

export type PrototypeCatalogBuildResult =
  | { status: 'available'; snapshot: PrototypeCatalogSnapshot }
  | { status: 'invalid'; diagnostics: readonly PrototypeCatalogDiagnostic[] };

export type PrototypeCatalogLoadResult =
  | PrototypeCatalogBuildResult
  | { status: 'unavailable'; diagnostic: PrototypeCatalogDiagnostic };

export type PrototypeCatalogValidationResult =
  | { valid: true; diagnostics: readonly [] }
  | { valid: false; diagnostics: readonly PrototypeCatalogDiagnostic[] };

export interface PrototypeCatalogRequest {
  version?: string;
  modelVersion?: string;
}

export type PrototypeCatalogLoader = (request?: string | PrototypeCatalogRequest) => PrototypeCatalogLoadResult;

export interface ResolvedPrototypeFeature extends PrototypeFeature {
  origin: 'own' | 'inherited';
  sourcePrototypeId: string;
  inheritedFrom: readonly string[];
}

export interface ResolvedPrototypeDefinition extends Omit<PrototypeDefinition, 'structuralFeatures' | 'structuralConstraints' | 'identityModifiers' | 'matcherPolicy' | 'familyIds'> {
  familyIds: readonly string[];
  structuralFeatures: readonly ResolvedPrototypeFeature[];
  structuralConstraints: readonly ResolvedPrototypeFeature[];
  identityModifiers: readonly ResolvedPrototypeFeature[];
  matcherPolicy: PrototypeMatcherPolicy;
  matcherPolicySourceId: string;
  ancestry: readonly string[];
}

export interface ResolvedPrototypeCatalogSnapshot {
  reference: PrototypeCatalogReference;
  definitions: readonly ResolvedPrototypeDefinition[];
  byId: Readonly<Record<string, ResolvedPrototypeDefinition>>;
  integrity: PrototypeCatalogSnapshot['integrity'];
}

export type PrototypeCatalogResolutionResult =
  | { status: 'resolved'; snapshot: ResolvedPrototypeCatalogSnapshot }
  | { status: 'invalid'; diagnostics: readonly PrototypeCatalogDiagnostic[] };

const ID_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function diagnostic(
  code: PrototypeCatalogDiagnosticCode,
  path: string,
  messageKey: string,
  parameters: Record<string, string | number> = {},
): PrototypeCatalogDiagnostic {
  return { code, severity: 'error', path, messageKey, parameters };
}

function validTarget(target: unknown): boolean {
  if (!isRecord(target) || typeof target.kind !== 'string') return false;
  if (target.kind === 'band') {
    return typeof target.value === 'string' && PROTOTYPE_QUALITATIVE_BANDS.includes(target.value as PrototypeQualitativeBand);
  }
  if (target.kind === 'band-range') {
    return typeof target.min === 'string'
      && typeof target.max === 'string'
      && PROTOTYPE_QUALITATIVE_BANDS.includes(target.min as PrototypeQualitativeBand)
      && PROTOTYPE_QUALITATIVE_BANDS.includes(target.max as PrototypeQualitativeBand)
      && PROTOTYPE_QUALITATIVE_BANDS.indexOf(target.min as PrototypeQualitativeBand)
        <= PROTOTYPE_QUALITATIVE_BANDS.indexOf(target.max as PrototypeQualitativeBand);
  }
  if (target.kind === 'presence') {
    return typeof target.value === 'string' && PROTOTYPE_PRESENCE_TARGETS.includes(target.value as PrototypePresenceTarget);
  }
  return target.kind === 'compatibility'
    && Array.isArray(target.values)
    && target.values.length > 0
    && target.values.every((value) => isNonEmptyString(value));
}

function validateLabels(label: unknown, path: string, diagnostics: PrototypeCatalogDiagnostic[]): void {
  if (!isRecord(label) || !isNonEmptyString(label.en) || !isNonEmptyString(label.el)) {
    diagnostics.push(diagnostic('MALFORMED_METADATA', path, 'catalog.diagnostic.malformedMetadata'));
  }
}

function validateFeatureCollection(
  features: readonly PrototypeFeature[],
  path: string,
  diagnostics: PrototypeCatalogDiagnostic[],
): void {
  const ids = new Set<string>();
  features.forEach((feature, index) => {
    const featurePath = `${path}[${index}]`;
    if (!isNonEmptyString(feature.id) || !ID_PATTERN.test(feature.id)) {
      diagnostics.push(diagnostic('MALFORMED_METADATA', `${featurePath}.id`, 'catalog.diagnostic.malformedMetadata'));
    }
    if (ids.has(feature.id)) {
      diagnostics.push(diagnostic('DUPLICATE_ID', `${featurePath}.id`, 'catalog.diagnostic.duplicateId', { id: feature.id }));
    }
    ids.add(feature.id);
    validateLabels(feature.label, `${featurePath}.label`, diagnostics);
    if (!validTarget(feature.target)) {
      diagnostics.push(diagnostic('MALFORMED_METADATA', `${featurePath}.target`, 'catalog.diagnostic.malformedMetadata'));
    }
    if (!PROTOTYPE_IMPORTANCE_LEVELS.includes(feature.importance)) {
      diagnostics.push(diagnostic('MALFORMED_METADATA', `${featurePath}.importance`, 'catalog.diagnostic.malformedMetadata'));
    }
  });
}

type PrototypeFeatureCollectionKey = 'structuralFeatures' | 'structuralConstraints' | 'identityModifiers';

const PROTOTYPE_FEATURE_COLLECTION_KEYS: readonly PrototypeFeatureCollectionKey[] = [
  'structuralFeatures',
  'structuralConstraints',
  'identityModifiers',
];

function validateFeatureDeclarations(
  definition: PrototypeDefinition,
  path: string,
  diagnostics: PrototypeCatalogDiagnostic[],
): void {
  const firstCollectionById = new Map<string, PrototypeFeatureCollectionKey>();
  PROTOTYPE_FEATURE_COLLECTION_KEYS.forEach((collection) => {
    definition[collection].forEach((feature, index) => {
      const firstCollection = firstCollectionById.get(feature.id);
      if (firstCollection && firstCollection !== collection) {
        diagnostics.push(diagnostic(
          'DUPLICATE_FEATURE_DECLARATION',
          `${path}.${collection}[${index}].id`,
          'catalog.diagnostic.duplicateFeatureDeclaration',
          { id: feature.id, firstCollection, secondCollection: collection },
        ));
      } else if (!firstCollection) {
        firstCollectionById.set(feature.id, collection);
      }
    });
  });
}

function targetBandRange(target: PrototypeFeatureTarget): [number, number] | null {
  if (target.kind === 'band') {
    const index = PROTOTYPE_QUALITATIVE_BANDS.indexOf(target.value);
    return index < 0 ? null : [index, index];
  }
  if (target.kind === 'band-range') {
    const min = PROTOTYPE_QUALITATIVE_BANDS.indexOf(target.min);
    const max = PROTOTYPE_QUALITATIVE_BANDS.indexOf(target.max);
    return min < 0 || max < 0 ? null : [min, max];
  }
  return null;
}

function targetPresenceSet(target: PrototypeFeatureTarget): ReadonlySet<'present' | 'absent'> | null {
  if (target.kind !== 'presence') return null;
  if (target.value === 'optional') return new Set(['present', 'absent']);
  if (target.value === 'absent' || target.value === 'none_or_low') return new Set(['absent']);
  return new Set(['present']);
}

function targetsOverlap(left: PrototypeFeatureTarget, right: PrototypeFeatureTarget): boolean {
  const leftBands = targetBandRange(left);
  const rightBands = targetBandRange(right);
  if (leftBands && rightBands) return leftBands[0] <= rightBands[1] && rightBands[0] <= leftBands[1];

  const leftPresence = targetPresenceSet(left);
  const rightPresence = targetPresenceSet(right);
  if (leftPresence && rightPresence) {
    return [...leftPresence].some((value) => rightPresence.has(value));
  }

  if (left.kind === 'compatibility' && right.kind === 'compatibility') {
    return left.values.some((value) => right.values.includes(value));
  }

  return false;
}

function familyDescendsFrom(
  familyId: string,
  ancestorId: string,
  definitionsById: ReadonlyMap<string, PrototypeDefinition>,
): boolean {
  let current: string | null = familyId;
  const seen = new Set<string>();
  while (current && !seen.has(current)) {
    if (current === ancestorId) return true;
    seen.add(current);
    const definition = definitionsById.get(current);
    if (!definition || definition.kind !== 'family') return false;
    current = definition.parentIds.find((parentId) => definitionsById.get(parentId)?.kind === 'family') ?? null;
  }
  return false;
}

function validatePrototypeFamilyAssignment(
  definition: PrototypeDefinition,
  parents: readonly ResolvedPrototypeDefinition[],
  definitionsById: ReadonlyMap<string, PrototypeDefinition>,
  path: string,
  addDiagnostic: (item: PrototypeCatalogDiagnostic) => void,
): void {
  if (definition.kind !== 'prototype') return;
  const parentFamilyIds = definition.parentIds.flatMap((parentId) => {
    const parent = definitionsById.get(parentId);
    return parent?.kind === 'family' ? [parent.id] : (parents.find((candidate) => candidate.id === parentId)?.familyIds ?? []);
  });
  if (parentFamilyIds.length === 0) return;
  const matchesParent = definition.familyIds.some((familyId) => parentFamilyIds.some((parentFamilyId) => (
    familyDescendsFrom(familyId, parentFamilyId, definitionsById)
  )));
  if (!matchesParent) {
    addDiagnostic(diagnostic(
      'INVALID_FAMILY_ASSIGNMENT',
      `${path}.familyIds`,
      'catalog.diagnostic.invalidFamilyAssignment',
      { id: definition.id, parent: parentFamilyIds.join(', ') },
    ));
  }
}

function validateMatcherPolicy(policy: PrototypeMatcherPolicy, path: string, diagnostics: PrototypeCatalogDiagnostic[]): void {
  if (!isNonEmptyString(policy.id) || !ID_PATTERN.test(policy.id)
    || policy.mode !== 'qualitative'
    || policy.missingFeaturePolicy !== 'limit-match'
    || policy.criticalMismatchPolicy !== 'block-strong-match'
    || policy.identityModifierPolicy !== 'report-separately') {
    diagnostics.push(diagnostic('MALFORMED_METADATA', path, 'catalog.diagnostic.malformedMetadata'));
  }
}

function validateProcessProfile(
  profile: readonly PrototypeProcessProfileSection[] | undefined,
  path: string,
  diagnostics: PrototypeCatalogDiagnostic[],
): void {
  if (profile === undefined) return;
  if (!Array.isArray(profile)) {
    diagnostics.push(diagnostic('MALFORMED_METADATA', path, 'catalog.diagnostic.malformedMetadata'));
    return;
  }
  const sections = profile as readonly PrototypeProcessProfileSection[];
  const sectionIds = new Set<string>();
  sections.forEach((section, sectionIndex) => {
    const sectionPath = `${path}[${sectionIndex}]`;
    if (!isNonEmptyString(section.id) || !ID_PATTERN.test(section.id) || sectionIds.has(section.id)) {
      diagnostics.push(diagnostic(
        sectionIds.has(section.id) ? 'DUPLICATE_ID' : 'MALFORMED_METADATA',
        `${sectionPath}.id`,
        sectionIds.has(section.id) ? 'catalog.diagnostic.duplicateId' : 'catalog.diagnostic.malformedMetadata',
        sectionIds.has(section.id) ? { id: section.id } : {},
      ));
    }
    sectionIds.add(section.id);
    validateLabels(section.label, `${sectionPath}.label`, diagnostics);
    if (!Array.isArray(section.facts)) {
      diagnostics.push(diagnostic('MALFORMED_METADATA', `${sectionPath}.facts`, 'catalog.diagnostic.malformedMetadata'));
      return;
    }
    const factIds = new Set<string>();
    section.facts.forEach((fact, factIndex) => {
      const factPath = `${sectionPath}.facts[${factIndex}]`;
      if (!isNonEmptyString(fact.id) || !ID_PATTERN.test(fact.id) || factIds.has(fact.id)) {
        diagnostics.push(diagnostic(
          factIds.has(fact.id) ? 'DUPLICATE_ID' : 'MALFORMED_METADATA',
          `${factPath}.id`,
          factIds.has(fact.id) ? 'catalog.diagnostic.duplicateId' : 'catalog.diagnostic.malformedMetadata',
          factIds.has(fact.id) ? { id: fact.id } : {},
        ));
      }
      factIds.add(fact.id);
      validateLabels(fact.label, `${factPath}.label`, diagnostics);
      validateLabels(fact.value, `${factPath}.value`, diagnostics);
      if (fact.note !== undefined) validateLabels(fact.note, `${factPath}.note`, diagnostics);
    });
  });
}

export function validatePrototypeCatalog(input: PrototypeCatalogInput): PrototypeCatalogValidationResult {
  const diagnostics: PrototypeCatalogDiagnostic[] = [];
  if (!isNonEmptyString(input.catalogId) || !isNonEmptyString(input.version) || !isNonEmptyString(input.modelVersion)) {
    diagnostics.push(diagnostic('MALFORMED_METADATA', 'catalog', 'catalog.diagnostic.malformedMetadata'));
  }
  if (!Array.isArray(input.supportedLocales) || !input.supportedLocales.includes('en') || !input.supportedLocales.includes('el')) {
    diagnostics.push(diagnostic('MALFORMED_METADATA', 'supportedLocales', 'catalog.diagnostic.malformedMetadata'));
  }
  if (!Array.isArray(input.definitions) || input.definitions.length === 0) {
    diagnostics.push(diagnostic('MALFORMED_METADATA', 'definitions', 'catalog.diagnostic.malformedMetadata'));
    return { valid: false, diagnostics };
  }

  const ids = new Set<string>();
  input.definitions.forEach((definition, index) => {
    const path = `definitions[${index}]`;
    if (!isNonEmptyString(definition.id) || !ID_PATTERN.test(definition.id)) {
      diagnostics.push(diagnostic('MALFORMED_METADATA', `${path}.id`, 'catalog.diagnostic.malformedMetadata'));
    }
    if (ids.has(definition.id)) {
      diagnostics.push(diagnostic('DUPLICATE_ID', `${path}.id`, 'catalog.diagnostic.duplicateId', { id: definition.id }));
    }
    ids.add(definition.id);
    if (definition.kind !== 'family' && definition.kind !== 'prototype') {
      diagnostics.push(diagnostic('MALFORMED_METADATA', `${path}.kind`, 'catalog.diagnostic.malformedMetadata'));
    }
    validateLabels(definition.label, `${path}.label`, diagnostics);
    if (!Array.isArray(definition.parentIds) || !Array.isArray(definition.familyIds)) {
      diagnostics.push(diagnostic('MALFORMED_METADATA', `${path}.references`, 'catalog.diagnostic.malformedMetadata'));
    }
    if (definition.parentIds.includes(definition.id)) {
      diagnostics.push(diagnostic('INVALID_REFERENCE', `${path}.parentIds`, 'catalog.diagnostic.invalidReference', { id: definition.id }));
    }
    validateFeatureCollection(definition.structuralFeatures, `${path}.structuralFeatures`, diagnostics);
    validateFeatureCollection(definition.structuralConstraints, `${path}.structuralConstraints`, diagnostics);
    validateFeatureCollection(definition.identityModifiers, `${path}.identityModifiers`, diagnostics);
    validateFeatureDeclarations(definition, path, diagnostics);
    validateProcessProfile(definition.processProfile, `${path}.processProfile`, diagnostics);
    if (definition.matcherPolicy) validateMatcherPolicy(definition.matcherPolicy, `${path}.matcherPolicy`, diagnostics);
    if (!PROTOTYPE_CONFIDENCE_TIERS.includes(definition.confidenceTier)
      || !PROTOTYPE_MATURITIES.includes(definition.maturity)
      || !isNonEmptyString(definition.provenance.sourceId)
      || (definition.provenance.method !== 'expert-seed' && definition.provenance.method !== 'catalog-author')) {
      diagnostics.push(diagnostic('MALFORMED_METADATA', `${path}.maturity`, 'catalog.diagnostic.malformedMetadata'));
    }
    validateLabels(definition.provenance.note, `${path}.provenance.note`, diagnostics);
  });

  const definitionsById = new Map(input.definitions.map((definition) => [definition.id, definition]));
  input.definitions.forEach((definition, index) => {
    definition.parentIds.forEach((parentId: string) => {
      if (!definitionsById.has(parentId)) {
        diagnostics.push(diagnostic('INVALID_REFERENCE', `definitions[${index}].parentIds`, 'catalog.diagnostic.invalidReference', { id: parentId }));
      }
    });
    definition.familyIds.forEach((familyId: string) => {
      const family = definitionsById.get(familyId);
      if (!family || family.kind !== 'family') {
        diagnostics.push(diagnostic('INVALID_REFERENCE', `definitions[${index}].familyIds`, 'catalog.diagnostic.invalidReference', { id: familyId }));
      }
    });
  });

  return diagnostics.length > 0 ? { valid: false, diagnostics } : { valid: true, diagnostics: [] };
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => canonicalize(item));
  if (isRecord(value)) {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function contentIdentity(input: PrototypeCatalogInput): string {
  const canonical = JSON.stringify(canonicalize({ ...input, contentHash: undefined }));
  let hash = 2166136261;
  for (let index = 0; index < canonical.length; index += 1) {
    hash ^= canonical.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function cloneTarget(target: PrototypeFeatureTarget): PrototypeFeatureTarget {
  return target.kind === 'compatibility' ? { ...target, values: [...target.values] } : { ...target };
}

function cloneProcessProfile(profile: readonly PrototypeProcessProfileSection[] | undefined): PrototypeProcessProfileSection[] | undefined {
  return profile?.map((section) => ({
    ...section,
    label: { ...section.label },
    facts: section.facts.map((fact) => ({
      ...fact,
      label: { ...fact.label },
      value: { ...fact.value },
      note: fact.note ? { ...fact.note } : undefined,
    })),
  }));
}

function freezeDeep<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== 'object' || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  Object.values(value as Record<string, unknown>).forEach((child) => freezeDeep(child, seen));
  return Object.freeze(value);
}

function cloneDefinition(definition: PrototypeDefinition): PrototypeDefinition {
  return {
    ...definition,
    parentIds: [...definition.parentIds],
    familyIds: [...definition.familyIds],
    structuralFeatures: definition.structuralFeatures.map((feature) => ({ ...feature, label: { ...feature.label }, target: cloneTarget(feature.target) })),
    structuralConstraints: definition.structuralConstraints.map((feature) => ({ ...feature, label: { ...feature.label }, target: cloneTarget(feature.target) })),
    identityModifiers: definition.identityModifiers.map((feature) => ({ ...feature, label: { ...feature.label }, target: cloneTarget(feature.target) })),
    processProfile: cloneProcessProfile(definition.processProfile),
    matcherPolicy: definition.matcherPolicy ? { ...definition.matcherPolicy } : undefined,
    provenance: { ...definition.provenance, note: { ...definition.provenance.note } },
  };
}

export function createPrototypeCatalogSnapshot(input: PrototypeCatalogInput): PrototypeCatalogBuildResult {
  const validation = validatePrototypeCatalog(input);
  if (!validation.valid) return { status: 'invalid', diagnostics: validation.diagnostics };
  const contentHash = input.contentHash ?? contentIdentity(input);
  const definitions = input.definitions.map((definition) => cloneDefinition(definition));
  const snapshot: PrototypeCatalogSnapshot = {
    catalogId: input.catalogId,
    version: input.version,
    modelVersion: input.modelVersion,
    contentHash,
    supportedLocales: [...input.supportedLocales],
    definitions,
    reference: {
      catalogId: input.catalogId,
      version: input.version,
      modelVersion: input.modelVersion,
      contentHash,
    },
    integrity: {
      policy: PROTOTYPE_CATALOG_INTEGRITY_POLICY,
      status: 'verified',
    },
  };
  const resolved = resolvePrototypeCatalog(snapshot);
  if (resolved.status === 'invalid') return { status: 'invalid', diagnostics: resolved.diagnostics };
  return { status: 'available', snapshot: freezeDeep(snapshot) };
}

function unavailableDiagnostic(
  code: 'CATALOG_VERSION_UNAVAILABLE' | 'MODEL_VERSION_UNAVAILABLE',
  request: string,
  available: readonly string[],
): PrototypeCatalogDiagnostic {
  return diagnostic(
    code,
    code === 'CATALOG_VERSION_UNAVAILABLE' ? 'version' : 'modelVersion',
    code === 'CATALOG_VERSION_UNAVAILABLE'
      ? 'catalog.diagnostic.unavailableVersion'
      : 'catalog.diagnostic.unavailableModel',
    { requested: request, available: available.join(', ') },
  );
}

export function createPrototypeCatalogLoader(inputs: readonly PrototypeCatalogInput[]): PrototypeCatalogLoader {
  const versions = inputs.map((input) => input.version);
  const built = new Map<string, PrototypeCatalogBuildResult>();
  inputs.forEach((input) => {
    const result = createPrototypeCatalogSnapshot(input);
    built.set(input.version, result);
  });

  return (request: string | PrototypeCatalogRequest = PROTOTYPE_CATALOG_VERSION): PrototypeCatalogLoadResult => {
    const normalized = typeof request === 'string' ? { version: request } : request;
    const requestedVersion = normalized.version ?? PROTOTYPE_CATALOG_VERSION;
    const result = built.get(requestedVersion);
    if (!result) return { status: 'unavailable', diagnostic: unavailableDiagnostic('CATALOG_VERSION_UNAVAILABLE', requestedVersion, versions) };
    if (result.status !== 'available') return result;
    if (normalized.modelVersion && normalized.modelVersion !== result.snapshot.modelVersion) {
      return {
        status: 'unavailable',
        diagnostic: unavailableDiagnostic('MODEL_VERSION_UNAVAILABLE', normalized.modelVersion, [result.snapshot.modelVersion]),
      };
    }
    return result;
  };
}

function withOrigin(feature: PrototypeFeature, origin: 'own' | 'inherited', sourcePrototypeId: string, inheritedFrom: readonly string[]): ResolvedPrototypeFeature {
  return {
    ...feature,
    label: { ...feature.label },
    target: cloneTarget(feature.target),
    origin,
    sourcePrototypeId,
    inheritedFrom: [...inheritedFrom],
  };
}

function mergeFeatures(
  parents: readonly ResolvedPrototypeDefinition[],
  key: 'structuralFeatures' | 'structuralConstraints' | 'identityModifiers',
  own: readonly PrototypeFeature[],
  childId: string,
): ResolvedPrototypeFeature[] {
  const merged = new Map<string, ResolvedPrototypeFeature>();
  parents.forEach((parent) => {
    parent[key].forEach((feature) => {
      if (!merged.has(feature.id)) {
        merged.set(feature.id, withOrigin(
          feature,
          'inherited',
          feature.sourcePrototypeId,
          unique([parent.id, ...feature.inheritedFrom]),
        ));
      }
    });
  });
  own.forEach((feature) => merged.set(feature.id, withOrigin(feature, 'own', childId, [])));
  return [...merged.values()];
}

export function resolvePrototypeCatalog(snapshot: PrototypeCatalogSnapshot): PrototypeCatalogResolutionResult {
  const definitionsById = new Map(snapshot.definitions.map((definition) => [definition.id, definition]));
  const resolved = new Map<string, ResolvedPrototypeDefinition>();
  const visiting = new Set<string>();
  const stack: string[] = [];
  const diagnostics: PrototypeCatalogDiagnostic[] = [];
  const diagnosticKeys = new Set<string>();

  function addDiagnostic(item: PrototypeCatalogDiagnostic): void {
    const key = `${item.code}:${item.path}:${JSON.stringify(item.parameters)}`;
    if (!diagnosticKeys.has(key)) {
      diagnosticKeys.add(key);
      diagnostics.push(item);
    }
  }

  function visit(id: string): ResolvedPrototypeDefinition | null {
    const cached = resolved.get(id);
    if (cached) return cached;
    const definition = definitionsById.get(id);
    if (!definition) {
      addDiagnostic(diagnostic('INVALID_REFERENCE', `definitions.${id}`, 'catalog.diagnostic.invalidReference', { id }));
      return null;
    }
    if (visiting.has(id)) {
      addDiagnostic(diagnostic(
        'PROTOTYPE_REFERENCE_CYCLE',
        `definitions.${id}.parentIds`,
        'catalog.diagnostic.referenceCycle',
        { path: [...stack, id].join(' → ') },
      ));
      return null;
    }

    visiting.add(id);
    stack.push(id);
    const parents: ResolvedPrototypeDefinition[] = [];
    let parentFailure = false;
    definition.parentIds.forEach((parentId) => {
      const parent = visit(parentId);
      if (parent) parents.push(parent);
      else parentFailure = true;
    });
    if (parentFailure) {
      stack.pop();
      visiting.delete(id);
      return null;
    }

    const matcherPolicy = definition.matcherPolicy ?? parents.find((parent) => parent.matcherPolicy)?.matcherPolicy;
    const matcherPolicySourceId = definition.matcherPolicy
      ? definition.id
      : parents.find((parent) => parent.matcherPolicy)?.matcherPolicySourceId;
    if (!matcherPolicy || !matcherPolicySourceId) {
      addDiagnostic(diagnostic('MISSING_MATCHER_POLICY', `definitions.${id}.matcherPolicy`, 'catalog.diagnostic.missingMatcherPolicy', { id }));
      stack.pop();
      visiting.delete(id);
      return null;
    }

    const familyIds = unique([
      ...(definition.kind === 'family' ? [definition.id] : []),
      ...definition.familyIds,
      ...parents.flatMap((parent) => parent.familyIds),
    ]);
    const resolvedDefinition: ResolvedPrototypeDefinition = {
      ...definition,
      parentIds: [...definition.parentIds],
      familyIds,
      structuralFeatures: mergeFeatures(parents, 'structuralFeatures', definition.structuralFeatures, definition.id),
      structuralConstraints: mergeFeatures(parents, 'structuralConstraints', definition.structuralConstraints, definition.id),
      identityModifiers: mergeFeatures(parents, 'identityModifiers', definition.identityModifiers, definition.id),
      matcherPolicy: { ...matcherPolicy },
      matcherPolicySourceId,
      ancestry: unique([definition.id, ...parents.flatMap((parent) => parent.ancestry)]),
    };

    validatePrototypeFamilyAssignment(
      definition,
      parents,
      definitionsById,
      `definitions.${id}`,
      addDiagnostic,
    );

    const inheritedAcrossCollections = new Map<string, Array<{ feature: ResolvedPrototypeFeature; parentId: string; collection: PrototypeFeatureCollectionKey }>>();
    parents.forEach((parent) => {
      PROTOTYPE_FEATURE_COLLECTION_KEYS.forEach((key) => {
        parent[key].forEach((feature) => {
          const entries = inheritedAcrossCollections.get(feature.id) ?? [];
          entries.push({ feature, parentId: parent.id, collection: key });
          inheritedAcrossCollections.set(feature.id, entries);
        });
      });
    });

    definition.structuralFeatures.concat(definition.structuralConstraints, definition.identityModifiers).forEach((feature) => {
      (inheritedAcrossCollections.get(feature.id) ?? []).forEach((parentRule) => {
        if (targetsOverlap(feature.target, parentRule.feature.target)) return;
        addDiagnostic(diagnostic(
          'CHILD_RULE_OUTSIDE_PARENT',
          `definitions.${id}.${parentRule.collection}.${feature.id}`,
          'catalog.diagnostic.childRuleOutsideParent',
          { child: id, parent: parentRule.parentId, feature: feature.id },
        ));
      });
    });

    PROTOTYPE_FEATURE_COLLECTION_KEYS.forEach((key) => {
      const inheritedById = new Map<string, Array<{ feature: ResolvedPrototypeFeature; parentId: string }>>();
      parents.forEach((parent) => {
        parent[key].forEach((feature) => {
          const entries = inheritedById.get(feature.id) ?? [];
          entries.push({ feature, parentId: parent.id });
          inheritedById.set(feature.id, entries);
        });
      });

      inheritedById.forEach((entries, featureId) => {
        for (let index = 0; index < entries.length; index += 1) {
          for (let otherIndex = index + 1; otherIndex < entries.length; otherIndex += 1) {
            if (targetsOverlap(entries[index].feature.target, entries[otherIndex].feature.target)) continue;
            addDiagnostic(diagnostic(
              'CONFLICTING_PARENT_RULE',
              `definitions.${id}.${key}.${featureId}`,
              'catalog.diagnostic.conflictingParentRule',
              {
                child: id,
                feature: featureId,
                firstParent: entries[index].parentId,
                secondParent: entries[otherIndex].parentId,
              },
            ));
          }
        }
      });

      definition[key].forEach((feature) => {
        const inherited = inheritedById.get(feature.id) ?? [];
        inherited.forEach((parentRule) => {
          if (targetsOverlap(feature.target, parentRule.feature.target)) return;
          addDiagnostic(diagnostic(
            'CHILD_RULE_OUTSIDE_PARENT',
            `definitions.${id}.${key}.${feature.id}`,
            'catalog.diagnostic.childRuleOutsideParent',
            { child: id, parent: parentRule.parentId, feature: feature.id },
          ));
        });
      });
    });

    const resolvedFeatureCollections = new Map<string, { collection: PrototypeFeatureCollectionKey; feature: ResolvedPrototypeFeature }>();
    PROTOTYPE_FEATURE_COLLECTION_KEYS.forEach((key) => {
      resolvedDefinition[key].forEach((feature) => {
        const first = resolvedFeatureCollections.get(feature.id);
        if (first && first.collection !== key && first.feature.origin === 'inherited' && feature.origin === 'inherited') {
          addDiagnostic(diagnostic(
            'DUPLICATE_FEATURE_DECLARATION',
            `definitions.${id}.${key}.${feature.id}`,
            'catalog.diagnostic.duplicateFeatureDeclaration',
            { id: feature.id, firstCollection: first.collection, secondCollection: key },
          ));
        } else if (!first || first.feature.origin !== 'own') {
          resolvedFeatureCollections.set(feature.id, { collection: key, feature });
        }
      });
    });

    resolved.set(id, resolvedDefinition);
    stack.pop();
    visiting.delete(id);
    return resolvedDefinition;
  }

  const definitions = snapshot.definitions.map((definition) => visit(definition.id)).filter((definition): definition is ResolvedPrototypeDefinition => definition !== null);
  if (diagnostics.length > 0 || definitions.length !== snapshot.definitions.length) {
    return { status: 'invalid', diagnostics };
  }
  const byId = Object.fromEntries(definitions.map((definition) => [definition.id, definition]));
  return {
    status: 'resolved',
    snapshot: freezeDeep({
      reference: snapshot.reference,
      definitions,
      byId,
      integrity: snapshot.integrity,
    }),
  };
}
