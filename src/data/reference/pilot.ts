import { COVERAGE_INVENTORY } from './coverage';
import { SOURCE_REGISTRY } from './sources';
import { STARTER_CATALOG_VERSION } from '../ingredients/starter-catalog';
import {
  collectSourceFacts,
  createAcquisitionRun,
  createSourceFactId,
  normalizeCandidateRecord,
  type AcquisitionRun,
  type CandidateCapture,
  type CapturedIngredient,
  type CapturedPercentage,
  type CapturedProcess,
  type CapturedProcessField,
  type CapturedQuantity,
  type CapturedFlour,
  type CapturedUnit,
  type SourceFact,
  type CandidateRecord,
} from '../../lib/domain/acquisition';
import {
  preparePilotCoverage,
  preparePilotHandoff,
  reviewCandidateRecord,
  type CurationReview,
  type PilotCoverageReport,
  type PilotHandoff,
} from '../../lib/domain/curation';
import type { CompositionField, IngredientRole } from '../../lib/domain/types';
import type { ProcessValuePath } from '../../lib/domain/process';

export const PILOT_CAPTURE_VERSION = 'first-party-breadsticks-manual-v1';
export const PILOT_CAPTURED_AT = '2026-09-19T00:00:00Z';

type MassInput = {
  value: number;
  unit: CapturedQuantity['unit'];
  gramsPerMilliliter?: number;
  gramsPerCount?: number;
};

type CompositionInput = Partial<Record<CompositionField, number>>;

interface FlourInput {
  id: string;
  name: string;
  ingredientId: string;
  mass: MassInput;
  composition?: CompositionInput;
}

interface IngredientInput {
  id: string;
  name: string;
  ingredientId?: string;
  mass: MassInput;
  role: IngredientRole;
  composition?: CompositionInput;
}

interface ProcessInput {
  path: ProcessValuePath;
  value: string | number | boolean;
  unit?: CapturedUnit;
}

export interface PilotCandidateDefinition {
  candidateId: string;
  sourceId: string;
  preparationKey: string;
  sourceUrl: string;
  flours: FlourInput[];
  ingredients: IngredientInput[];
  process?: ProcessInput[];
}

export interface PilotDataset {
  definitions: readonly PilotCandidateDefinition[];
  captures: readonly CandidateCapture[];
  runs: readonly AcquisitionRun[];
  normalizedCandidates: readonly CandidateRecord[];
  reviewedCandidates: readonly CandidateRecord[];
  reviews: readonly CurationReview[];
  report: PilotCoverageReport;
  handoff: PilotHandoff;
}

const INTERNAL_BREADSTICK_SOURCE_ID = 'source.dfi-internal-breadsticks';
const INTERNAL_BREADSTICK_SOURCE = 'exploration/recepies/kritsinia.txt';

const grams = (value: number): MassInput => ({ value, unit: 'g' });

function processForBreadstick(options: {
  mixingMethod?: string;
  targetDevelopment?: string;
  fermentationAgent?: string;
  prefermentType?: string;
  bulkTimeSeconds?: number;
  bulkTemperatureCelsius?: number;
  coldFermentation?: boolean;
  ovenTemperatureCelsius?: number;
  ovenDurationSeconds?: number;
  shapeClass?: string;
  thicknessMillimeters?: number;
  surfaceVolumeClass?: string;
} = {}): ProcessInput[] {
  const fields: ProcessInput[] = [
    { path: 'mixing.method', value: options.mixingMethod ?? 'hand_knead' },
    { path: 'mixing.targetDevelopment', value: options.targetDevelopment ?? 'partial' },
    { path: 'fermentation.agent', value: options.fermentationAgent ?? 'commercial_yeast' },
    { path: 'fermentation.coldFermentation', value: options.coldFermentation ?? false },
    { path: 'aeration.method', value: 'none' },
    { path: 'lamination.enabled', value: false },
    { path: 'thermalProcess.method', value: 'static_oven' },
    { path: 'thermalProcess.temperatureCelsius', value: options.ovenTemperatureCelsius ?? 190, unit: 'celsius' },
    { path: 'thermalProcess.durationSeconds', value: options.ovenDurationSeconds ?? 1200, unit: 'seconds' },
    { path: 'thermalProcess.preheated', value: true },
    { path: 'thermalProcess.surfaceTreatment', value: 'none' },
    { path: 'geometry.shapeClass', value: options.shapeClass ?? 'breadstick' },
    { path: 'geometry.characteristicThicknessMillimeters', value: options.thicknessMillimeters ?? 7 },
    { path: 'geometry.surfaceVolumeClass', value: options.surfaceVolumeClass ?? 'high' },
    { path: 'geometry.containerType', value: 'baking_sheet' },
  ];
  if (options.prefermentType) fields.push({ path: 'fermentation.prefermentType', value: options.prefermentType });
  if (options.bulkTimeSeconds !== undefined) fields.push({ path: 'fermentation.bulkTimeSeconds', value: options.bulkTimeSeconds, unit: 'seconds' });
  if (options.bulkTemperatureCelsius !== undefined) fields.push({ path: 'fermentation.bulkTemperatureCelsius', value: options.bulkTemperatureCelsius, unit: 'celsius' });
  if (options.coldFermentation !== undefined) fields.push({ path: 'fermentation.coldFermentation', value: options.coldFermentation });
  return fields;
}

const PILOT_DEFINITIONS: readonly PilotCandidateDefinition[] = [
  {
    candidateId: 'internal-breadsticks-classic-olive-oil-v1',
    sourceId: INTERNAL_BREADSTICK_SOURCE_ID,
    preparationKey: 'breadsticks',
    sourceUrl: INTERNAL_BREADSTICK_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(275), role: 'continuous_phase' },
      { id: 'olive-oil', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(40), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'sugar', name: 'Sugar', ingredientId: 'sugar', mass: grams(10), role: 'inclusion' },
      { id: 'yeast', name: 'Instant yeast', ingredientId: 'instant-yeast', mass: grams(5), role: 'inclusion' },
    ],
    process: processForBreadstick({ bulkTimeSeconds: 5400, thicknessMillimeters: 7 }),
  },
  {
    candidateId: 'internal-breadsticks-torinese-v1',
    sourceId: INTERNAL_BREADSTICK_SOURCE_ID,
    preparationKey: 'breadsticks-torinese',
    sourceUrl: INTERNAL_BREADSTICK_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(260), role: 'continuous_phase' },
      { id: 'olive-oil', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(25), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'sugar', name: 'Sugar', ingredientId: 'sugar', mass: grams(2.5), role: 'inclusion' },
      { id: 'yeast', name: 'Instant yeast', ingredientId: 'instant-yeast', mass: grams(3.5), role: 'inclusion' },
    ],
    process: processForBreadstick({ bulkTimeSeconds: 4500, thicknessMillimeters: 5, ovenDurationSeconds: 1080 }),
  },
  {
    candidateId: 'internal-breadsticks-greek-style-v1',
    sourceId: INTERNAL_BREADSTICK_SOURCE_ID,
    preparationKey: 'breadsticks-greek-style',
    sourceUrl: INTERNAL_BREADSTICK_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(250), role: 'continuous_phase' },
      { id: 'olive-oil', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(90), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'sugar', name: 'Sugar', ingredientId: 'sugar', mass: grams(15), role: 'inclusion' },
      { id: 'yeast', name: 'Instant yeast', ingredientId: 'instant-yeast', mass: grams(2.5), role: 'inclusion' },
    ],
    process: processForBreadstick({ bulkTimeSeconds: 3600, thicknessMillimeters: 8, ovenTemperatureCelsius: 185 }),
  },
  {
    candidateId: 'internal-breadsticks-biscuit-style-v1',
    sourceId: INTERNAL_BREADSTICK_SOURCE_ID,
    preparationKey: 'breadsticks-biscuit-style',
    sourceUrl: INTERNAL_BREADSTICK_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(200), role: 'continuous_phase' },
      { id: 'olive-oil', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(125), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(9.5), role: 'inclusion' },
      { id: 'sugar', name: 'Sugar', ingredientId: 'sugar', mass: grams(22.5), role: 'inclusion' },
      { id: 'baking-powder', name: 'Baking powder', ingredientId: 'baking-powder', mass: grams(7.5), role: 'inclusion' },
    ],
    process: processForBreadstick({
      mixingMethod: 'minimal_combine',
      targetDevelopment: 'minimal',
      fermentationAgent: 'none',
      shapeClass: 'cookie',
      thicknessMillimeters: 8,
      surfaceVolumeClass: 'medium',
      ovenTemperatureCelsius: 180,
    }),
  },
  {
    candidateId: 'internal-breadsticks-airy-v1',
    sourceId: INTERNAL_BREADSTICK_SOURCE_ID,
    preparationKey: 'breadsticks-airy',
    sourceUrl: INTERNAL_BREADSTICK_SOURCE,
    flours: [{ id: 'flour-strong', name: 'Strong wheat flour', ingredientId: 'wheat-flour-strong', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(325), role: 'continuous_phase' },
      { id: 'olive-oil', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(30), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'sugar', name: 'Sugar', ingredientId: 'sugar', mass: grams(7.5), role: 'inclusion' },
      { id: 'yeast', name: 'Instant yeast', ingredientId: 'instant-yeast', mass: grams(4.5), role: 'inclusion' },
    ],
    process: processForBreadstick({ bulkTimeSeconds: 5400, thicknessMillimeters: 12, surfaceVolumeClass: 'medium' }),
  },
  {
    candidateId: 'internal-breadsticks-semolina-v1',
    sourceId: INTERNAL_BREADSTICK_SOURCE_ID,
    preparationKey: 'breadsticks-semolina',
    sourceUrl: INTERNAL_BREADSTICK_SOURCE,
    flours: [
      { id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(350) },
      { id: 'flour-semolina', name: 'Durum semolina', ingredientId: 'durum-semolina', mass: grams(150) },
    ],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(295), role: 'continuous_phase' },
      { id: 'olive-oil', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(42.5), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'sugar', name: 'Sugar', ingredientId: 'sugar', mass: grams(7.5), role: 'inclusion' },
      { id: 'yeast', name: 'Instant yeast', ingredientId: 'instant-yeast', mass: grams(4.5), role: 'inclusion' },
      { id: 'rosemary', name: 'Rosemary', mass: grams(5), role: 'inclusion', composition: { fiber: 20 } },
    ],
    process: processForBreadstick({ bulkTimeSeconds: 5400, thicknessMillimeters: 7 }),
  },
  {
    candidateId: 'internal-breadsticks-whole-wheat-v1',
    sourceId: INTERNAL_BREADSTICK_SOURCE_ID,
    preparationKey: 'breadsticks-whole-wheat',
    sourceUrl: INTERNAL_BREADSTICK_SOURCE,
    flours: [
      { id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(350) },
      { id: 'flour-whole', name: 'Whole wheat flour', ingredientId: 'wheat-flour-whole', mass: grams(150) },
    ],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(315), role: 'continuous_phase' },
      { id: 'olive-oil', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(50), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'sugar', name: 'Sugar', ingredientId: 'sugar', mass: grams(12.5), role: 'inclusion' },
      { id: 'yeast', name: 'Instant yeast', ingredientId: 'instant-yeast', mass: grams(4.5), role: 'inclusion' },
    ],
    process: processForBreadstick({ bulkTimeSeconds: 5400, thicknessMillimeters: 8 }),
  },
  {
    candidateId: 'internal-breadsticks-seeded-v1',
    sourceId: INTERNAL_BREADSTICK_SOURCE_ID,
    preparationKey: 'breadsticks-seeded',
    sourceUrl: INTERNAL_BREADSTICK_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(305), role: 'continuous_phase' },
      { id: 'olive-oil', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(50), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'sugar', name: 'Sugar', ingredientId: 'sugar', mass: grams(10), role: 'inclusion' },
      { id: 'yeast', name: 'Instant yeast', ingredientId: 'instant-yeast', mass: grams(4.5), role: 'inclusion' },
      { id: 'seeds', name: 'Mixed seeds', mass: grams(100), role: 'inclusion', composition: { water: 6, fat: 40, protein: 20, fiber: 15 } },
    ],
    process: processForBreadstick({ bulkTimeSeconds: 5400, thicknessMillimeters: 8 }),
  },
  {
    candidateId: 'internal-breadsticks-cheese-v1',
    sourceId: INTERNAL_BREADSTICK_SOURCE_ID,
    preparationKey: 'breadsticks-cheese',
    sourceUrl: INTERNAL_BREADSTICK_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(262.5), role: 'continuous_phase' },
      { id: 'olive-oil', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(40), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(6.75), role: 'inclusion' },
      { id: 'sugar', name: 'Sugar', ingredientId: 'sugar', mass: grams(2.5), role: 'inclusion' },
      { id: 'yeast', name: 'Instant yeast', ingredientId: 'instant-yeast', mass: grams(3.75), role: 'inclusion' },
      { id: 'hard-cheese', name: 'Parmesan-style hard cheese', mass: grams(100), role: 'inclusion', composition: { water: 30, fat: 29, protein: 37, salt: 1.5 } },
      { id: 'black-pepper', name: 'Black pepper', mass: grams(3.75), role: 'inclusion', composition: { fiber: 25 } },
    ],
    process: processForBreadstick({ bulkTimeSeconds: 4500, thicknessMillimeters: 7, ovenTemperatureCelsius: 185 }),
  },
  {
    candidateId: 'internal-breadsticks-sourdough-v1',
    sourceId: INTERNAL_BREADSTICK_SOURCE_ID,
    preparationKey: 'breadsticks-sourdough',
    sourceUrl: INTERNAL_BREADSTICK_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(255), role: 'continuous_phase' },
      { id: 'olive-oil', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(40), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'sugar', name: 'Sugar', ingredientId: 'sugar', mass: grams(5), role: 'inclusion' },
      { id: 'yeast', name: 'Instant yeast', ingredientId: 'instant-yeast', mass: grams(1), role: 'inclusion' },
      { id: 'starter', name: '100% hydration sourdough starter', mass: grams(100), role: 'continuous_phase', composition: { water: 50 } },
    ],
    process: processForBreadstick({
      bulkTimeSeconds: 3600,
      bulkTemperatureCelsius: 24,
      fermentationAgent: 'mixed',
      prefermentType: 'levain',
      coldFermentation: true,
      thicknessMillimeters: 7,
      ovenDurationSeconds: 1320,
    }),
  },
];

function sourceFact(
  definition: PilotCandidateDefinition,
  path: string,
  kind: SourceFact['kind'],
  value: SourceFact['value'],
  unit?: CapturedUnit,
): SourceFact {
  const sourceLocator = `${definition.sourceUrl}#${definition.preparationKey}/${path}`;
  return {
    factId: createSourceFactId({ path, kind, value, unit, sourceLocator }),
    path,
    kind,
    value,
    unit,
    sourceLocator,
  };
}

function capturedName(definition: PilotCandidateDefinition, path: string, value: string) {
  return { fact: sourceFact(definition, path, 'formula', value), value };
}

function capturedMass(definition: PilotCandidateDefinition, path: string, input: MassInput): CapturedQuantity {
  return {
    fact: sourceFact(definition, path, 'formula', input.value, input.unit),
    value: input.value,
    unit: input.unit,
    gramsPerMilliliter: input.gramsPerMilliliter,
    gramsPerCount: input.gramsPerCount,
  };
}

function capturedComposition(
  definition: PilotCandidateDefinition,
  pathPrefix: string,
  input: CompositionInput,
): Partial<Record<CompositionField, CapturedPercentage>> {
  return Object.fromEntries(
    Object.entries(input).map(([field, value]) => {
      const path = `${pathPrefix}.${field}`;
      return [field, {
        fact: sourceFact(definition, path, 'formula', value, 'percent'),
        value,
      } satisfies CapturedPercentage];
    }),
  ) as Partial<Record<CompositionField, CapturedPercentage>>;
}

function capturedFlour(definition: PilotCandidateDefinition, input: FlourInput): CapturedFlour {
  const pathPrefix = `formula.flourComponents.${input.id}`;
  return {
    id: input.id,
    name: capturedName(definition, `${pathPrefix}.name`, input.name),
    ingredientId: input.ingredientId,
    mass: capturedMass(definition, `${pathPrefix}.mass`, input.mass),
    flourBearing: true,
    ...(input.composition === undefined
      ? {}
      : { composition: capturedComposition(definition, `${pathPrefix}.composition`, input.composition) }),
  };
}

function capturedIngredient(definition: PilotCandidateDefinition, input: IngredientInput): CapturedIngredient {
  const pathPrefix = `formula.ingredientLines.${input.id}`;
  return {
    id: input.id,
    name: capturedName(definition, `${pathPrefix}.name`, input.name),
    ingredientId: input.ingredientId,
    mass: capturedMass(definition, `${pathPrefix}.mass`, input.mass),
    role: input.role,
    ...(input.composition === undefined
      ? {}
      : { composition: capturedComposition(definition, `${pathPrefix}.composition`, input.composition) }),
  };
}

function capturedProcess(definition: PilotCandidateDefinition, fields: ProcessInput[]): CapturedProcess {
  const capturedFields: CapturedProcessField[] = fields.map((field) => ({
    path: field.path,
    value: field.value,
    unit: field.unit,
    fact: sourceFact(definition, `process.${field.path}`, 'process', field.value, field.unit),
  }));
  return { fields: capturedFields };
}

function toCapture(definition: PilotCandidateDefinition): CandidateCapture {
  return {
    formula: {
      flours: definition.flours.map((flour) => capturedFlour(definition, flour)),
      ingredients: definition.ingredients.map((ingredient) => capturedIngredient(definition, ingredient)),
    },
    ...(definition.process ? { process: capturedProcess(definition, definition.process) } : {}),
  };
}

function reviewedCandidate(candidate: CandidateRecord): { candidate: CandidateRecord; review: CurationReview } {
  const review: CurationReview = {
    reviewId: `review-${candidate.candidateId}`,
    candidateId: candidate.candidateId,
    reviewerRole: 'formula-reviewer',
    decision: 'accepted-for-release',
    reviewedAt: PILOT_CAPTURED_AT,
    checks: {
      sourceAttribution: true,
      formulaTranscription: true,
      gramNormalization: true,
      ingredientResolution: true,
      unknownHandling: true,
      processEvidence: true,
    },
    reason: {
      en: 'This first-party canonical formula draft is traceable to the internal grissini exploration note. It is published as an expert seed, not as a kitchen-validated universal recipe.',
      el: 'Αυτή η first-party canonical φόρμουλα είναι traceable στο εσωτερικό σημείωμα διερεύνησης κριτσινιών. Δημοσιεύεται ως expert seed και όχι ως καθολική συνταγή επικυρωμένη στην κουζίνα.',
    },
    releasePlan: {
      roles: ['reference', 'calibration'],
      evaluationPartition: 'calibration',
      publicSelectable: true,
      primary: true,
      maturity: 'expert-seed',
    },
  };
  const result = reviewCandidateRecord(candidate, review, SOURCE_REGISTRY);
  if (result.outcome !== 'reviewed' || !result.candidate) {
    throw new Error(`First-party candidate could not be reviewed: ${candidate.candidateId}`);
  }
  return { candidate: result.candidate, review };
}

function buildPilotDataset(): PilotDataset {
  const captures = PILOT_DEFINITIONS.map(toCapture);
  const runs: AcquisitionRun[] = [];
  const normalizedCandidates: CandidateRecord[] = [];
  const reviewedCandidates: CandidateRecord[] = [];
  const reviews: CurationReview[] = [];

  PILOT_DEFINITIONS.forEach((definition, index) => {
    const capture = captures[index];
    const facts = collectSourceFacts(capture);
    const runResult = createAcquisitionRun({
      registry: SOURCE_REGISTRY,
      inventory: COVERAGE_INVENTORY,
      sourceId: definition.sourceId,
      preparationKey: definition.preparationKey,
      method: 'manual-capture',
      toolVersion: PILOT_CAPTURE_VERSION,
      scope: {
        categoryId: COVERAGE_INVENTORY.entries.find((entry) => entry.preparationKey === definition.preparationKey)?.primaryCategory ?? '',
        fields: definition.process ? ['formula', 'process'] : ['formula'],
      },
      inputIdentity: `${definition.sourceUrl}#${definition.preparationKey}`,
      capturedAt: PILOT_CAPTURED_AT,
      facts,
    });
    if (runResult.outcome !== 'captured' || !runResult.run) {
      throw new Error(`First-party acquisition run failed: ${definition.candidateId}`);
    }
    runs.push(runResult.run);

    const normalized = normalizeCandidateRecord({
      registry: SOURCE_REGISTRY,
      inventory: COVERAGE_INVENTORY,
      run: runResult.run,
      facts: capture,
      candidateId: definition.candidateId,
      catalogVersion: STARTER_CATALOG_VERSION,
    });
    if (normalized.outcome !== 'normalized' || !normalized.candidate) {
      throw new Error(`First-party candidate normalization failed: ${definition.candidateId} ${JSON.stringify(normalized.diagnostics)}`);
    }
    normalizedCandidates.push(normalized.candidate);

    const reviewed = reviewedCandidate(normalized.candidate);
    reviewedCandidates.push(reviewed.candidate);
    reviews.push(reviewed.review);
  });

  const report = preparePilotCoverage(COVERAGE_INVENTORY, SOURCE_REGISTRY, reviewedCandidates);
  const handoffResult = preparePilotHandoff(COVERAGE_INVENTORY, report, reviewedCandidates, PILOT_CAPTURED_AT);
  if (handoffResult.outcome !== 'prepared' || !handoffResult.handoff) {
    throw new Error('First-party handoff could not be prepared.');
  }

  return {
    definitions: PILOT_DEFINITIONS,
    captures,
    runs,
    normalizedCandidates,
    reviewedCandidates,
    reviews,
    report,
    handoff: handoffResult.handoff,
  };
}

export const PILOT_DATASET = buildPilotDataset();
