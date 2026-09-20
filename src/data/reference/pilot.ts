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
  type CapturedAdditionStep,
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

export const PILOT_CAPTURE_VERSION = 'first-party-breadsticks-crackers-manual-v2';
export const PILOT_CAPTURED_AT = '2026-09-20T00:00:00Z';

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
  allowUnknownComposition?: boolean;
}

interface IngredientInput {
  id: string;
  name: string;
  ingredientId?: string;
  mass: MassInput;
  role: IngredientRole;
  composition?: CompositionInput;
  allowUnknownComposition?: boolean;
}

interface ProcessInput {
  path: ProcessValuePath;
  value: string | number | boolean;
  unit?: CapturedUnit;
}

interface AdditionStepInput {
  id: string;
  sequence: number;
  lineIds: string[];
  action: string;
  durationSeconds: number;
}

export interface PilotCandidateDefinition {
  candidateId: string;
  sourceId: string;
  preparationKey: string;
  sourceUrl: string;
  flours: FlourInput[];
  ingredients: IngredientInput[];
  process?: ProcessInput[];
  processSteps?: AdditionStepInput[];
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
const INTERNAL_CRACKER_SOURCE_ID = 'source.dfi-internal-crackers';
const INTERNAL_CRACKER_SOURCE = 'exploration/recepies/craker.txt';

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

function crackerSteps(options: {
  fatLineIds: string[];
  inclusionLineIds?: string[];
  laminationFatLineId?: string;
}): AdditionStepInput[] {
  const steps: AdditionStepInput[] = [
    { id: 'dry-mix', sequence: 1, lineIds: ['salt', 'baking-powder'], action: 'mix', durationSeconds: 30 },
    { id: 'fat-coating', sequence: 2, lineIds: options.fatLineIds, action: 'incorporate_fat', durationSeconds: 30 },
    { id: 'water-addition', sequence: 3, lineIds: ['water'], action: 'add', durationSeconds: 15 },
  ];
  if (options.inclusionLineIds?.length) {
    steps.push({ id: 'inclusions', sequence: 4, lineIds: options.inclusionLineIds, action: 'add', durationSeconds: 15 });
  }
  steps.push({
    id: 'minimal-combine',
    sequence: steps.length + 1,
    lineIds: ['water', ...options.fatLineIds, ...(options.inclusionLineIds ?? [])],
    action: 'mix',
    durationSeconds: 90,
  });
  steps.push({ id: 'covered-rest', sequence: steps.length + 1, lineIds: [], action: 'rest', durationSeconds: 1500 });
  if (options.laminationFatLineId) {
    steps.push({ id: 'lamination-fold', sequence: steps.length + 1, lineIds: [options.laminationFatLineId], action: 'fold', durationSeconds: 300 });
  }
  return steps;
}

function processForCracker(options: {
  thicknessMillimeters?: number;
  ovenTemperatureCelsius?: number;
  ovenDurationSeconds?: number;
  docking?: string;
  laminationFatLineId?: string;
  layerFatPercentage?: number;
  fatMode?: string;
}): ProcessInput[] {
  const fields: ProcessInput[] = [
    { path: 'mixing.method', value: 'minimal_combine' },
    { path: 'mixing.durationSeconds', value: 90, unit: 'seconds' },
    { path: 'mixing.restDurationSeconds', value: 1500, unit: 'seconds' },
    { path: 'mixing.restType', value: 'post_mix_rest' },
    { path: 'mixing.targetDevelopment', value: 'minimal' },
    { path: 'ingredientAddition.fatIncorporationMode', value: options.fatMode ?? 'early_coating' },
    { path: 'fermentation.agent', value: 'none' },
    { path: 'fermentation.coldFermentation', value: false },
    { path: 'aeration.method', value: 'none' },
    { path: 'lamination.enabled', value: Boolean(options.laminationFatLineId) },
    { path: 'thermalProcess.method', value: 'static_oven' },
    { path: 'thermalProcess.temperatureCelsius', value: options.ovenTemperatureCelsius ?? 185, unit: 'celsius' },
    { path: 'thermalProcess.durationSeconds', value: options.ovenDurationSeconds ?? 750, unit: 'seconds' },
    { path: 'thermalProcess.preheated', value: true },
    { path: 'thermalProcess.surfaceTreatment', value: 'none' },
    { path: 'geometry.shapeClass', value: 'thin_sheet' },
    { path: 'geometry.characteristicThicknessMillimeters', value: options.thicknessMillimeters ?? 1.5 },
    { path: 'geometry.surfaceVolumeClass', value: 'very_high' },
    { path: 'geometry.containerType', value: 'baking_sheet' },
    { path: 'geometry.docking', value: options.docking ?? 'fork_or_docker' },
  ];
  if (options.laminationFatLineId) {
    fields.push(
      { path: 'lamination.laminationFat', value: options.laminationFatLineId },
      { path: 'lamination.layerFatPercentage', value: options.layerFatPercentage ?? 0.1, unit: 'ratio' },
      { path: 'lamination.foldSequence', value: 'single_fold' },
      { path: 'lamination.doughState', value: 'stiff_dough' },
    );
  }
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
  {
    candidateId: 'internal-crackers-classic-plain-v1',
    sourceId: INTERNAL_CRACKER_SOURCE_ID,
    preparationKey: 'cracker-dough',
    sourceUrl: INTERNAL_CRACKER_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(175), role: 'continuous_phase' },
      { id: 'fat', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(60), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'baking-powder', name: 'Baking powder', ingredientId: 'baking-powder', mass: grams(5), role: 'inclusion' },
    ],
    process: processForCracker({}),
    processSteps: crackerSteps({ fatLineIds: ['fat'] }),
  },
  {
    candidateId: 'internal-crackers-lean-hard-v1',
    sourceId: INTERNAL_CRACKER_SOURCE_ID,
    preparationKey: 'cracker-lean-hard',
    sourceUrl: INTERNAL_CRACKER_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(160), role: 'continuous_phase' },
      { id: 'fat', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(25), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'baking-powder', name: 'Baking powder', ingredientId: 'baking-powder', mass: grams(2.5), role: 'inclusion' },
    ],
    process: processForCracker({}),
    processSteps: crackerSteps({ fatLineIds: ['fat'] }),
  },
  {
    candidateId: 'internal-crackers-extra-crisp-v1',
    sourceId: INTERNAL_CRACKER_SOURCE_ID,
    preparationKey: 'cracker-extra-crisp',
    sourceUrl: INTERNAL_CRACKER_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(170), role: 'continuous_phase' },
      { id: 'fat', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(50), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'baking-powder', name: 'Baking powder', ingredientId: 'baking-powder', mass: grams(5), role: 'inclusion' },
    ],
    process: processForCracker({ thicknessMillimeters: 0.85 }),
    processSteps: crackerSteps({ fatLineIds: ['fat'] }),
  },
  {
    candidateId: 'internal-crackers-richer-short-v1',
    sourceId: INTERNAL_CRACKER_SOURCE_ID,
    preparationKey: 'cracker-richer-short',
    sourceUrl: INTERNAL_CRACKER_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(145), role: 'continuous_phase' },
      { id: 'fat', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(100), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'baking-powder', name: 'Baking powder', ingredientId: 'baking-powder', mass: grams(5), role: 'inclusion' },
    ],
    process: processForCracker({}),
    processSteps: crackerSteps({ fatLineIds: ['fat'] }),
  },
  {
    candidateId: 'internal-crackers-flaky-v1',
    sourceId: INTERNAL_CRACKER_SOURCE_ID,
    preparationKey: 'cracker-flaky',
    sourceUrl: INTERNAL_CRACKER_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(190), role: 'continuous_phase' },
      { id: 'fat-dough', name: 'Olive oil in dough', ingredientId: 'olive-oil', mass: grams(40), role: 'inclusion' },
      { id: 'fat-lamination', name: 'Fat for laminating and folding', ingredientId: 'custom-lamination-fat', mass: grams(50), role: 'inclusion', composition: {}, allowUnknownComposition: true },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'baking-powder', name: 'Baking powder', ingredientId: 'baking-powder', mass: grams(5), role: 'inclusion' },
    ],
    process: processForCracker({ fatMode: 'laminated', laminationFatLineId: 'fat-lamination', layerFatPercentage: 0.1 }),
    processSteps: crackerSteps({ fatLineIds: ['fat-dough'], laminationFatLineId: 'fat-lamination' }),
  },
  {
    candidateId: 'internal-crackers-puffy-v1',
    sourceId: INTERNAL_CRACKER_SOURCE_ID,
    preparationKey: 'cracker-puffy',
    sourceUrl: INTERNAL_CRACKER_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(190), role: 'continuous_phase' },
      { id: 'fat', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(50), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'baking-powder', name: 'Baking powder', ingredientId: 'baking-powder', mass: grams(11.25), role: 'inclusion' },
    ],
    process: processForCracker({ docking: 'partial' }),
    processSteps: crackerSteps({ fatLineIds: ['fat'] }),
  },
  {
    candidateId: 'internal-crackers-cheese-v1',
    sourceId: INTERNAL_CRACKER_SOURCE_ID,
    preparationKey: 'cracker-cheese',
    sourceUrl: INTERNAL_CRACKER_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(137.5), role: 'continuous_phase' },
      { id: 'fat', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(75), role: 'inclusion' },
      { id: 'hard-cheese', name: 'Hard cheese', ingredientId: 'custom-hard-cheese', mass: grams(150), role: 'inclusion', composition: {}, allowUnknownComposition: true },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(5), role: 'inclusion' },
      { id: 'baking-powder', name: 'Baking powder', ingredientId: 'baking-powder', mass: grams(5), role: 'inclusion' },
    ],
    process: processForCracker({}),
    processSteps: crackerSteps({ fatLineIds: ['fat'], inclusionLineIds: ['hard-cheese'] }),
  },
  {
    candidateId: 'internal-crackers-seed-v1',
    sourceId: INTERNAL_CRACKER_SOURCE_ID,
    preparationKey: 'cracker-seed',
    sourceUrl: INTERNAL_CRACKER_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(190), role: 'continuous_phase' },
      { id: 'fat', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(50), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'baking-powder', name: 'Baking powder', ingredientId: 'baking-powder', mass: grams(5), role: 'inclusion' },
      { id: 'seeds', name: 'Mixed seeds', ingredientId: 'custom-mixed-seeds', mass: grams(100), role: 'inclusion', composition: {}, allowUnknownComposition: true },
    ],
    process: processForCracker({}),
    processSteps: crackerSteps({ fatLineIds: ['fat'], inclusionLineIds: ['seeds'] }),
  },
  {
    candidateId: 'internal-crackers-olive-herb-v1',
    sourceId: INTERNAL_CRACKER_SOURCE_ID,
    preparationKey: 'cracker-olive-herb',
    sourceUrl: INTERNAL_CRACKER_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(155), role: 'continuous_phase' },
      { id: 'olive-oil', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(75), role: 'inclusion' },
      { id: 'olives', name: 'Chopped olives', ingredientId: 'custom-chopped-olives', mass: grams(75), role: 'inclusion', composition: {}, allowUnknownComposition: true },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(5), role: 'inclusion' },
      { id: 'baking-powder', name: 'Baking powder', ingredientId: 'baking-powder', mass: grams(5), role: 'inclusion' },
      { id: 'herbs', name: 'Oregano and thyme', ingredientId: 'custom-herb-blend', mass: grams(7.5), role: 'inclusion', composition: {}, allowUnknownComposition: true },
    ],
    process: processForCracker({}),
    processSteps: crackerSteps({ fatLineIds: ['olive-oil'], inclusionLineIds: ['olives', 'herbs'] }),
  },
  {
    candidateId: 'internal-crackers-wholegrain-v1',
    sourceId: INTERNAL_CRACKER_SOURCE_ID,
    preparationKey: 'cracker-wholegrain',
    sourceUrl: INTERNAL_CRACKER_SOURCE,
    flours: [
      { id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(300) },
      { id: 'flour-whole', name: 'Whole wheat flour', ingredientId: 'wheat-flour-whole', mass: grams(200) },
    ],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(210), role: 'continuous_phase' },
      { id: 'fat', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(60), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'baking-powder', name: 'Baking powder', ingredientId: 'baking-powder', mass: grams(5), role: 'inclusion' },
    ],
    process: processForCracker({}),
    processSteps: crackerSteps({ fatLineIds: ['fat'] }),
  },
  {
    candidateId: 'internal-crackers-rye-v1',
    sourceId: INTERNAL_CRACKER_SOURCE_ID,
    preparationKey: 'cracker-rye',
    sourceUrl: INTERNAL_CRACKER_SOURCE,
    flours: [
      { id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(300) },
      { id: 'flour-rye', name: 'Rye flour', ingredientId: 'custom-rye-flour', mass: grams(200), composition: {}, allowUnknownComposition: true },
    ],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(225), role: 'continuous_phase' },
      { id: 'fat', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(40), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'baking-powder', name: 'Baking powder', ingredientId: 'baking-powder', mass: grams(1.25), role: 'inclusion' },
    ],
    process: processForCracker({}),
    processSteps: crackerSteps({ fatLineIds: ['fat'] }),
  },
  {
    candidateId: 'internal-crackers-spiced-v1',
    sourceId: INTERNAL_CRACKER_SOURCE_ID,
    preparationKey: 'cracker-spiced',
    sourceUrl: INTERNAL_CRACKER_SOURCE,
    flours: [{ id: 'flour-white', name: 'White wheat flour', ingredientId: 'wheat-flour-white', mass: grams(500) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(175), role: 'continuous_phase' },
      { id: 'fat', name: 'Olive oil', ingredientId: 'olive-oil', mass: grams(60), role: 'inclusion' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'baking-powder', name: 'Baking powder', ingredientId: 'baking-powder', mass: grams(5), role: 'inclusion' },
      { id: 'paprika', name: 'Paprika', ingredientId: 'custom-paprika', mass: grams(7.5), role: 'inclusion', composition: {}, allowUnknownComposition: true },
      { id: 'black-pepper', name: 'Black pepper', ingredientId: 'custom-black-pepper', mass: grams(2.5), role: 'inclusion', composition: {}, allowUnknownComposition: true },
      { id: 'oregano', name: 'Oregano', ingredientId: 'custom-oregano', mass: grams(3.75), role: 'inclusion', composition: {}, allowUnknownComposition: true },
    ],
    process: processForCracker({}),
    processSteps: crackerSteps({ fatLineIds: ['fat'], inclusionLineIds: ['paprika', 'black-pepper', 'oregano'] }),
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
    ...(input.allowUnknownComposition ? { allowUnknownComposition: true } : {}),
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
    ...(input.allowUnknownComposition ? { allowUnknownComposition: true } : {}),
    ...(input.composition === undefined
      ? {}
      : { composition: capturedComposition(definition, `${pathPrefix}.composition`, input.composition) }),
  };
}

function capturedProcess(definition: PilotCandidateDefinition, fields: ProcessInput[], steps: AdditionStepInput[] = []): CapturedProcess {
  const capturedFields: CapturedProcessField[] = fields.map((field) => ({
    path: field.path,
    value: field.value,
    unit: field.unit,
    fact: sourceFact(definition, `process.${field.path}`, 'process', field.value, field.unit),
  }));
  const capturedSteps: CapturedAdditionStep[] = steps.map((step) => ({
    ...step,
    factIds: [createSourceFactId({
      path: `process.ingredientAddition.steps.${step.id}`,
      kind: 'process',
      value: step.action,
      sourceLocator: `${definition.sourceUrl}#${definition.preparationKey}/process/${step.id}`,
    })],
  }));
  return { fields: capturedFields, ...(capturedSteps.length > 0 ? { steps: capturedSteps } : {}) };
}

function toCapture(definition: PilotCandidateDefinition): CandidateCapture {
  return {
    formula: {
      flours: definition.flours.map((flour) => capturedFlour(definition, flour)),
      ingredients: definition.ingredients.map((ingredient) => capturedIngredient(definition, ingredient)),
    },
    ...(definition.process ? { process: capturedProcess(definition, definition.process, definition.processSteps) } : {}),
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
    reason: candidate.sourceId === INTERNAL_CRACKER_SOURCE_ID
      ? {
          en: 'This first-party canonical cracker formula draft is traceable to the internal cracker exploration note. It is released as an expert seed, not as a kitchen-validated universal recipe.',
          el: 'Αυτή η first-party canonical φόρμουλα κράκερ είναι traceable στο εσωτερικό σημείωμα διερεύνησης κράκερ. Δημοσιεύεται ως expert seed και όχι ως καθολική συνταγή επικυρωμένη στην κουζίνα.',
        }
      : {
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
