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

export const PILOT_CAPTURE_VERSION = 'pilot-manual-capture-v1';
export const PILOT_CAPTURED_AT = '2026-09-10T00:00:00Z';

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

const grams = (value: number): MassInput => ({ value, unit: 'g' });
const kilograms = (value: number): MassInput => ({ value, unit: 'kg' });
const milliliters = (value: number): MassInput => ({ value, unit: 'ml', gramsPerMilliliter: 1 });
const counted = (value: number, gramsPerCount: number): MassInput => ({ value, unit: 'count', gramsPerCount });

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

const PILOT_DEFINITIONS: readonly PilotCandidateDefinition[] = [
  {
    candidateId: 'pilot-kab-lean-white-loaf',
    sourceId: 'source.king-arthur-baking',
    preparationKey: 'lean-white-loaf',
    sourceUrl: 'https://www.kingarthurbaking.com/pro/formulas/slow-rise-baguettes',
    flours: [{ id: 'flour-1', name: 'King Arthur Sir Galahad flour', ingredientId: 'wheat-flour-strong', mass: kilograms(10) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: kilograms(7), role: 'continuous_phase' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: kilograms(0.2), role: 'inclusion' },
      { id: 'yeast', name: 'Fresh yeast', ingredientId: 'fresh-yeast', mass: kilograms(0.075), role: 'inclusion' },
    ],
    process: [
      { path: 'mixing.method', value: 'spiral_mix' },
      { path: 'mixing.foldCount', value: 3, unit: 'count' },
      { path: 'fermentation.agent', value: 'commercial_yeast' },
      { path: 'thermalProcess.method', value: 'static_oven' },
    ],
  },
  {
    candidateId: 'pilot-kab-country-loaf',
    sourceId: 'source.king-arthur-baking',
    preparationKey: 'country-loaf',
    sourceUrl: 'https://www.kingarthurbaking.com/recipes/no-knead-crusty-white-bread-recipe',
    flours: [{ id: 'flour-1', name: 'All-purpose flour', ingredientId: 'wheat-flour-white', mass: grams(900) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(680), role: 'continuous_phase' },
      { id: 'salt', name: 'Table salt', ingredientId: 'salt', mass: grams(18), role: 'inclusion' },
      { id: 'yeast', name: 'Instant yeast', ingredientId: 'instant-yeast', mass: grams(14), role: 'inclusion' },
    ],
    process: [
      { path: 'mixing.method', value: 'minimal_combine' },
      { path: 'fermentation.agent', value: 'commercial_yeast' },
    ],
  },
  {
    candidateId: 'pilot-tpl-sourdough-country-loaf',
    sourceId: 'source.the-perfect-loaf',
    preparationKey: 'sourdough-country-loaf',
    sourceUrl: 'https://www.theperfectloaf.com/best-sourdough-recipe/',
    flours: [
      { id: 'flour-white', name: 'Medium-protein white flour', ingredientId: 'wheat-flour-white', mass: grams(852) },
      { id: 'flour-whole', name: 'Whole wheat flour', ingredientId: 'wheat-flour-whole', mass: grams(94) },
    ],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(805), role: 'continuous_phase' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(17), role: 'inclusion' },
      { id: 'starter', name: '100% hydration sourdough starter', mass: grams(30), role: 'continuous_phase', composition: { water: 50 } },
    ],
    process: [
      { path: 'fermentation.agent', value: 'sourdough' },
      { path: 'fermentation.prefermentType', value: 'levain' },
    ],
  },
  {
    candidateId: 'pilot-tpl-sourdough-whole-wheat',
    sourceId: 'source.the-perfect-loaf',
    preparationKey: 'sourdough-whole-wheat',
    sourceUrl: 'https://www.theperfectloaf.com/100-whole-wheat-sourdough/',
    flours: [{ id: 'flour-1', name: 'Whole wheat flour', ingredientId: 'wheat-flour-whole', mass: grams(921) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(829), role: 'continuous_phase' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(18), role: 'inclusion' },
      { id: 'starter', name: '100% hydration sourdough starter', mass: grams(32), role: 'continuous_phase', composition: { water: 50 } },
    ],
    process: [
      { path: 'fermentation.agent', value: 'sourdough' },
      { path: 'fermentation.prefermentType', value: 'levain' },
    ],
  },
  {
    candidateId: 'pilot-kab-brioche',
    sourceId: 'source.king-arthur-baking',
    preparationKey: 'brioche',
    sourceUrl: 'https://www.kingarthurbaking.com/pro/formulas/brioche',
    flours: [{ id: 'flour-1', name: 'King Arthur Sir Galahad flour', ingredientId: 'wheat-flour-white', mass: kilograms(10) }],
    ingredients: [
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: kilograms(0.25), role: 'inclusion' },
      { id: 'sugar', name: 'Sugar', ingredientId: 'sugar', mass: kilograms(1.2), role: 'inclusion' },
      { id: 'butter', name: 'Pliable butter', ingredientId: 'butter', mass: kilograms(5), role: 'inclusion' },
      { id: 'yeast', name: 'Yeast', ingredientId: 'fresh-yeast', mass: kilograms(0.7), role: 'inclusion' },
      { id: 'water', name: 'Cold water', ingredientId: 'water', mass: kilograms(0.9), role: 'continuous_phase' },
      { id: 'eggs', name: 'Eggs', ingredientId: 'egg', mass: kilograms(5), role: 'continuous_phase' },
    ],
    process: [
      { path: 'mixing.method', value: 'machine_knead' },
      { path: 'ingredientAddition.fatIncorporationMode', value: 'late_incorporation' },
    ],
  },
  {
    candidateId: 'pilot-kab-challah',
    sourceId: 'source.king-arthur-baking',
    preparationKey: 'challah',
    sourceUrl: 'https://www.kingarthurbaking.com/recipes/classic-challah-recipe',
    flours: [{ id: 'flour-1', name: 'All-purpose flour', ingredientId: 'wheat-flour-white', mass: grams(480) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(170), role: 'continuous_phase' },
      { id: 'oil', name: 'Vegetable oil', ingredientId: 'neutral-oil', mass: grams(74), role: 'inclusion' },
      { id: 'honey', name: 'Honey', ingredientId: 'honey', mass: grams(63), role: 'inclusion' },
      { id: 'eggs', name: 'Large eggs', ingredientId: 'egg', mass: counted(2, 50), role: 'continuous_phase' },
      { id: 'yolk', name: 'Large egg yolk', ingredientId: 'egg-yolk', mass: counted(1, 17), role: 'continuous_phase' },
      { id: 'salt', name: 'Table salt', ingredientId: 'salt', mass: grams(9), role: 'inclusion' },
      { id: 'yeast', name: 'Instant yeast', ingredientId: 'instant-yeast', mass: grams(12), role: 'inclusion' },
    ],
    process: [{ path: 'mixing.method', value: 'hand_knead' }],
  },
  {
    candidateId: 'pilot-kab-kouign-amann',
    sourceId: 'source.king-arthur-baking',
    preparationKey: 'kouign-amann',
    sourceUrl: 'https://www.kingarthurbaking.com/recipes/classic-kouign-amann-breton-butter-cake-recipe',
    flours: [{ id: 'flour-1', name: 'All-purpose flour', ingredientId: 'wheat-flour-white', mass: grams(270) }],
    ingredients: [
      { id: 'salt', name: 'Table salt', ingredientId: 'salt', mass: grams(4), role: 'inclusion' },
      { id: 'yeast', name: 'Instant yeast', ingredientId: 'instant-yeast', mass: grams(2), role: 'inclusion' },
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(184), role: 'continuous_phase' },
      { id: 'butter', name: 'Salted butter', ingredientId: 'butter', mass: grams(170), role: 'inclusion' },
      { id: 'sugar', name: 'Granulated sugar', ingredientId: 'sugar', mass: grams(198), role: 'inclusion' },
    ],
    process: [
      { path: 'fermentation.agent', value: 'commercial_yeast' },
      { path: 'ingredientAddition.fatIncorporationMode', value: 'laminated' },
      { path: 'lamination.enabled', value: true },
      { path: 'lamination.laminationFat', value: 'butter' },
      { path: 'lamination.foldSequence', value: 'other' },
      { path: 'lamination.fatState', value: 'plastic' },
    ],
  },
  {
    candidateId: 'pilot-kab-puff-pastry',
    sourceId: 'source.king-arthur-baking',
    preparationKey: 'puff-pastry',
    sourceUrl: 'https://www.kingarthurbaking.com/recipes/classic-puff-pastry-pate-feuilletee-recipe',
    flours: [
      { id: 'flour-dough', name: 'All-purpose flour for dough', ingredientId: 'wheat-flour-white', mass: grams(510) },
      { id: 'flour-block', name: 'All-purpose flour for butter block', ingredientId: 'wheat-flour-white', mass: grams(60) },
    ],
    ingredients: [
      { id: 'water', name: 'Cold water', ingredientId: 'water', mass: grams(284), role: 'continuous_phase' },
      { id: 'butter-dough', name: 'Cold butter in dough', ingredientId: 'butter', mass: grams(57), role: 'inclusion' },
      { id: 'butter-block', name: 'Butter in block', ingredientId: 'butter', mass: grams(396), role: 'inclusion' },
    ],
    process: [
      { path: 'ingredientAddition.fatIncorporationMode', value: 'laminated' },
      { path: 'lamination.enabled', value: true },
      { path: 'lamination.laminationFat', value: 'butter-block' },
      { path: 'lamination.foldSequence', value: 'other' },
      { path: 'lamination.fatState', value: 'plastic' },
    ],
  },
  {
    candidateId: 'pilot-tpl-sourdough-pizza',
    sourceId: 'source.the-perfect-loaf',
    preparationKey: 'sourdough-pizza',
    sourceUrl: 'https://www.theperfectloaf.com/sourdough-pizza-dough-and-recipes/',
    flours: [
      { id: 'flour-white', name: 'Type 00 flour', ingredientId: 'wheat-flour-white', mass: grams(288) },
      { id: 'flour-whole', name: 'Whole wheat flour', ingredientId: 'wheat-flour-whole', mass: grams(32) },
    ],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: grams(215), role: 'continuous_phase' },
      { id: 'salt', name: 'Salt', ingredientId: 'salt', mass: grams(6), role: 'inclusion' },
      { id: 'starter', name: 'Sourdough starter', mass: grams(48), role: 'continuous_phase', composition: { water: 50 } },
    ],
    process: [
      { path: 'fermentation.agent', value: 'sourdough' },
      { path: 'fermentation.prefermentType', value: 'levain' },
    ],
  },
  {
    candidateId: 'pilot-giallo-neapolitan-pizza',
    sourceId: 'source.giallozafferano',
    preparationKey: 'neapolitan-pizza',
    sourceUrl: 'https://www.giallozafferano.com/recipes/Pizza-dough.html',
    flours: [
      { id: 'flour-manitoba', name: 'Manitoba flour', ingredientId: 'wheat-flour-strong', mass: grams(200) },
      { id: 'flour-type-00', name: 'Type 00 flour', ingredientId: 'wheat-flour-white', mass: grams(300) },
    ],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: milliliters(300), role: 'continuous_phase' },
      { id: 'salt', name: 'Fine salt', ingredientId: 'salt', mass: grams(10), role: 'inclusion' },
      { id: 'yeast', name: "Fresh brewer's yeast", ingredientId: 'fresh-yeast', mass: grams(4), role: 'inclusion' },
    ],
    process: [
      { path: 'mixing.method', value: 'hand_knead' },
      { path: 'fermentation.agent', value: 'commercial_yeast' },
    ],
  },
  {
    candidateId: 'pilot-serious-fresh-egg-pasta',
    sourceId: 'source.serious-eats',
    preparationKey: 'fresh-egg-pasta',
    sourceUrl: 'https://www.seriouseats.com/fresh-egg-pasta',
    flours: [{ id: 'flour-1', name: 'All-purpose flour', ingredientId: 'wheat-flour-white', mass: grams(255) }],
    ingredients: [
      { id: 'whole-eggs', name: 'Whole eggs', ingredientId: 'egg', mass: grams(110), role: 'continuous_phase' },
      { id: 'egg-yolks', name: 'Egg yolks', ingredientId: 'egg-yolk', mass: grams(70), role: 'continuous_phase' },
    ],
    process: [{ path: 'mixing.method', value: 'hand_knead' }],
  },
  {
    candidateId: 'pilot-giallo-tagliatelle',
    sourceId: 'source.giallozafferano',
    preparationKey: 'tagliatelle',
    sourceUrl: 'https://www.giallozafferano.com/recipes/homemade-pasta-sheets-and-shapes.html',
    flours: [{ id: 'flour-1', name: 'Type 00 flour', ingredientId: 'wheat-flour-white', mass: grams(400) }],
    ingredients: [{ id: 'eggs', name: 'Eggs', ingredientId: 'egg', mass: counted(4, 70), role: 'continuous_phase' }],
    process: [
      { path: 'mixing.method', value: 'hand_knead' },
      { path: 'mixing.restDurationSeconds', value: 1800, unit: 'seconds' },
    ],
  },
  {
    candidateId: 'pilot-bbc-shortbread',
    sourceId: 'source.bbc-good-food',
    preparationKey: 'shortbread',
    sourceUrl: 'https://www.bbcgoodfood.com/recipes/shortbread-biscuits',
    flours: [{ id: 'flour-1', name: 'Plain flour', ingredientId: 'wheat-flour-white', mass: grams(150) }],
    ingredients: [
      { id: 'butter', name: 'Butter', ingredientId: 'butter', mass: grams(100), role: 'inclusion' },
      { id: 'sugar', name: 'Caster sugar', ingredientId: 'sugar', mass: grams(50), role: 'inclusion' },
    ],
    process: [
      { path: 'mixing.method', value: 'minimal_combine' },
      { path: 'geometry.shapeClass', value: 'cookie' },
      { path: 'thermalProcess.method', value: 'static_oven' },
      { path: 'thermalProcess.temperatureCelsius', value: 170, unit: 'celsius' },
    ],
  },
  {
    candidateId: 'pilot-kab-american-pie-dough',
    sourceId: 'source.king-arthur-baking',
    preparationKey: 'american-pie-dough',
    sourceUrl: 'https://www.kingarthurbaking.com/recipes/all-purpose-flaky-pastry-dough-recipe',
    flours: [{ id: 'flour-1', name: 'All-purpose flour', ingredientId: 'wheat-flour-white', mass: grams(450) }],
    ingredients: [
      { id: 'water', name: 'Ice water', ingredientId: 'water', mass: grams(227), role: 'continuous_phase' },
      { id: 'butter', name: 'Unsalted butter', ingredientId: 'butter', mass: grams(283), role: 'inclusion' },
    ],
    process: [
      { path: 'ingredientAddition.fatIncorporationMode', value: 'cold_chunks' },
      { path: 'lamination.enabled', value: true },
      { path: 'lamination.foldSequence', value: 'double_fold' },
    ],
  },
  {
    candidateId: 'pilot-kab-butter-cake',
    sourceId: 'source.king-arthur-baking',
    preparationKey: 'butter-cake',
    sourceUrl: 'https://www.kingarthurbaking.com/blog/2015/03/16/building-better-butter-cake',
    flours: [{ id: 'flour-1', name: 'Cake flour blend', ingredientId: 'wheat-flour-white', mass: grams(270) }],
    ingredients: [
      { id: 'cream', name: 'Heavy cream', ingredientId: 'heavy-cream', mass: grams(240), role: 'continuous_phase' },
      { id: 'butter', name: 'Unsalted butter', ingredientId: 'butter', mass: grams(150), role: 'inclusion' },
      { id: 'sugar', name: 'Sugar', ingredientId: 'sugar', mass: grams(280), role: 'inclusion' },
      { id: 'salt', name: 'Fine sea salt', ingredientId: 'salt', mass: grams(4), role: 'inclusion' },
      { id: 'vanilla', name: 'Vanilla bean paste', ingredientId: 'vanilla-paste', mass: grams(12), role: 'inclusion' },
      { id: 'baking-powder', name: 'Baking powder', ingredientId: 'baking-powder', mass: grams(10), role: 'inclusion' },
      { id: 'eggs', name: 'Large eggs', ingredientId: 'egg', mass: grams(220), role: 'continuous_phase' },
    ],
    process: [
      { path: 'aeration.method', value: 'whipped_cream' },
      { path: 'aeration.targetFoam', value: 'high' },
      { path: 'aeration.postAerationHandling', value: 'gentle_fold' },
    ],
  },
  {
    candidateId: 'pilot-kab-pound-cake',
    sourceId: 'source.king-arthur-baking',
    preparationKey: 'pound-cake',
    sourceUrl: 'https://www.kingarthurbaking.com/recipes/king-arthurs-original-pound-cake-recipe',
    flours: [{ id: 'flour-1', name: 'All-purpose flour', ingredientId: 'wheat-flour-white', mass: grams(240) }],
    ingredients: [
      { id: 'butter', name: 'Salted butter', ingredientId: 'butter', mass: grams(227), role: 'inclusion' },
      { id: 'sugar', name: 'Granulated sugar', ingredientId: 'sugar', mass: grams(198), role: 'inclusion' },
      { id: 'eggs', name: 'Large eggs', ingredientId: 'egg', mass: counted(4, 50), role: 'continuous_phase' },
      { id: 'milk', name: 'Milk', ingredientId: 'milk', mass: grams(113), role: 'continuous_phase' },
    ],
    process: [{ path: 'aeration.method', value: 'creaming' }],
  },
  {
    candidateId: 'pilot-bbc-crepe',
    sourceId: 'source.bbc-good-food',
    preparationKey: 'crepe',
    sourceUrl: 'https://www.bbcgoodfood.com/recipes/classic-crepes',
    flours: [{ id: 'flour-1', name: 'Plain flour', ingredientId: 'wheat-flour-white', mass: grams(140) }],
    ingredients: [
      { id: 'milk', name: 'Whole milk', ingredientId: 'milk', mass: milliliters(200), role: 'continuous_phase' },
      { id: 'water', name: 'Water', ingredientId: 'water', mass: milliliters(100), role: 'continuous_phase' },
      { id: 'eggs', name: 'Eggs', ingredientId: 'egg', mass: counted(2, 50), role: 'continuous_phase' },
      { id: 'butter', name: 'Unsalted butter', ingredientId: 'butter', mass: grams(25), role: 'inclusion' },
    ],
    process: [
      { path: 'thermalProcess.method', value: 'pan' },
      { path: 'geometry.shapeClass', value: 'crepe' },
    ],
  },
  {
    candidateId: 'pilot-bbc-american-pancake',
    sourceId: 'source.bbc-good-food',
    preparationKey: 'american-pancake',
    sourceUrl: 'https://www.bbcgoodfood.com/recipes/perfect-pancakes-recipe',
    flours: [{ id: 'flour-1', name: 'Plain flour', ingredientId: 'wheat-flour-white', mass: grams(100) }],
    ingredients: [
      { id: 'eggs', name: 'Eggs', ingredientId: 'egg', mass: counted(2, 50), role: 'continuous_phase' },
      { id: 'milk', name: 'Semi-skimmed milk', ingredientId: 'milk', mass: milliliters(300), role: 'continuous_phase' },
    ],
    process: [
      { path: 'thermalProcess.method', value: 'pan' },
      { path: 'geometry.shapeClass', value: 'pancake' },
    ],
  },
  {
    candidateId: 'pilot-serious-churros',
    sourceId: 'source.serious-eats',
    preparationKey: 'churros',
    sourceUrl: 'https://www.seriouseats.com/churros-recipe-11680433',
    flours: [{ id: 'flour-1', name: 'All-purpose flour', ingredientId: 'wheat-flour-white', mass: grams(256) }],
    ingredients: [
      { id: 'water', name: 'Water', ingredientId: 'water', mass: milliliters(355), role: 'continuous_phase' },
      { id: 'butter', name: 'Unsalted butter', ingredientId: 'butter', mass: grams(168), role: 'inclusion' },
      { id: 'sugar', name: 'Sugar', ingredientId: 'sugar', mass: grams(16), role: 'inclusion' },
      { id: 'salt', name: 'Kosher salt', ingredientId: 'salt', mass: grams(4), role: 'inclusion' },
      { id: 'eggs', name: 'Large eggs', ingredientId: 'egg', mass: counted(2, 50), role: 'continuous_phase' },
    ],
    process: [
      { path: 'thermalProcess.method', value: 'deep_fry' },
      { path: 'thermalProcess.temperatureCelsius', value: 175, unit: 'celsius' },
      { path: 'thermalProcess.durationSeconds', value: 120, unit: 'seconds' },
      { path: 'geometry.shapeClass', value: 'choux_piece' },
    ],
  },
  {
    candidateId: 'pilot-bbc-beignet',
    sourceId: 'source.bbc-good-food',
    preparationKey: 'beignet',
    sourceUrl: 'https://www.bbcgoodfood.com/recipes/beignets',
    flours: [{ id: 'flour-1', name: 'Strong white bread flour', ingredientId: 'wheat-flour-strong', mass: grams(250) }],
    ingredients: [
      { id: 'yeast', name: 'Fast-action dried yeast', ingredientId: 'instant-yeast', mass: grams(4), role: 'inclusion' },
      { id: 'sugar', name: 'Caster sugar', ingredientId: 'sugar', mass: grams(25), role: 'inclusion' },
      { id: 'milk', name: 'Evaporated milk', ingredientId: 'evaporated-milk', mass: grams(125), role: 'continuous_phase', composition: {} },
      { id: 'egg', name: 'Medium egg', ingredientId: 'egg', mass: counted(1, 50), role: 'continuous_phase' },
      { id: 'butter', name: 'Unsalted butter', ingredientId: 'butter', mass: grams(25), role: 'inclusion' },
      { id: 'water', name: 'Boiling water', ingredientId: 'water', mass: milliliters(60), role: 'continuous_phase' },
    ],
    process: [
      { path: 'fermentation.agent', value: 'commercial_yeast' },
      { path: 'thermalProcess.method', value: 'deep_fry' },
      { path: 'thermalProcess.temperatureCelsius', value: 175, unit: 'celsius' },
      { path: 'thermalProcess.durationSeconds', value: 180, unit: 'seconds' },
    ],
  },
  {
    candidateId: 'pilot-kab-gluten-free-sandwich-loaf',
    sourceId: 'source.king-arthur-baking',
    preparationKey: 'gluten-free-sandwich-loaf',
    sourceUrl: 'https://www.kingarthurbaking.com/pro/formulas/gluten-free-bread',
    flours: [{ id: 'flour-1', name: 'Gluten-free bread and pizza mix', ingredientId: 'gluten-free-bread-mix', mass: grams(510), composition: {} }],
    ingredients: [
      { id: 'butter', name: 'Butter', ingredientId: 'butter', mass: grams(57), role: 'inclusion' },
      { id: 'milk', name: 'Lukewarm milk', ingredientId: 'milk', mass: grams(397), role: 'continuous_phase' },
      { id: 'eggs', name: 'Large eggs', ingredientId: 'egg', mass: grams(150), role: 'continuous_phase' },
      { id: 'yeast', name: 'Instant yeast', ingredientId: 'instant-yeast', mass: grams(7), role: 'inclusion' },
    ],
    process: [
      { path: 'mixing.method', value: 'machine_knead' },
      { path: 'fermentation.agent', value: 'commercial_yeast' },
    ],
  },
  {
    candidateId: 'pilot-kab-gluten-free-pancake',
    sourceId: 'source.king-arthur-baking',
    preparationKey: 'gluten-free-pancake',
    sourceUrl: 'https://www.kingarthurbaking.com/pro/formulas/gluten-free-pancakes',
    flours: [{ id: 'flour-1', name: 'Gluten-free pancake mix', ingredientId: 'gluten-free-pancake-mix', mass: grams(213), composition: {} }],
    ingredients: [
      { id: 'egg', name: 'Large egg', ingredientId: 'egg', mass: grams(50), role: 'continuous_phase' },
      { id: 'milk', name: 'Milk', ingredientId: 'milk', mass: grams(227), role: 'continuous_phase' },
      { id: 'butter', name: 'Melted butter', ingredientId: 'butter', mass: grams(43), role: 'inclusion' },
    ],
    process: [
      { path: 'thermalProcess.method', value: 'griddle' },
      { path: 'geometry.shapeClass', value: 'pancake' },
    ],
  },
];

function reviewedCandidate(candidate: CandidateRecord): { candidate: CandidateRecord; review: CurationReview } {
  const review: CurationReview = {
    reviewId: `review-${candidate.candidateId}`,
    candidateId: candidate.candidateId,
    reviewerRole: 'source-curator',
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
      en: 'Pilot facts and source identity are ready for the parent release review; unrecorded optional fields remain Unknown.',
      el: 'Τα στοιχεία του pilot και η ταυτότητα της πηγής είναι έτοιμα για τον έλεγχο της γονικής έκδοσης· τα προαιρετικά πεδία που δεν καταγράφηκαν παραμένουν Άγνωστα.',
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
    throw new Error(`Pilot candidate could not be reviewed: ${candidate.candidateId}`);
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
      scope: { categoryId: COVERAGE_INVENTORY.entries.find((entry) => entry.preparationKey === definition.preparationKey)?.primaryCategory ?? '', fields: definition.process ? ['formula', 'process'] : ['formula'] },
      inputIdentity: `${definition.sourceUrl}#${definition.preparationKey}`,
      capturedAt: PILOT_CAPTURED_AT,
      facts,
    });
    if (runResult.outcome !== 'captured' || !runResult.run) {
      throw new Error(`Pilot acquisition run failed: ${definition.candidateId}`);
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
      throw new Error(`Pilot candidate normalization failed: ${definition.candidateId}`);
    }
    normalizedCandidates.push(normalized.candidate);

    const reviewed = reviewedCandidate(normalized.candidate);
    reviewedCandidates.push(reviewed.candidate);
    reviews.push(reviewed.review);
  });

  const report = preparePilotCoverage(COVERAGE_INVENTORY, SOURCE_REGISTRY, reviewedCandidates);
  const handoffResult = preparePilotHandoff(COVERAGE_INVENTORY, report, reviewedCandidates, PILOT_CAPTURED_AT);
  if (handoffResult.outcome !== 'prepared' || !handoffResult.handoff) {
    throw new Error('Pilot handoff could not be prepared.');
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
