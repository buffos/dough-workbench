import type { CompositionField } from '../../lib/domain/types';

export const STARTER_CATALOG_VERSION = 'starter-catalog-v2';

export type CatalogLocale = 'en' | 'el';

export interface LocalizedLabel {
  en: string;
  el: string;
}

export interface StarterIngredient {
  id: string;
  name: string;
  label: LocalizedLabel;
  composition: Partial<Record<CompositionField, number>>;
  acidNeutralization?: number;
}

export interface StarterFlour {
  id: string;
  name: string;
  label: LocalizedLabel;
  composition: Partial<Record<CompositionField, number>>;
  absorptionPercentage?: number;
}

export const STARTER_FLOUR_CATALOG: StarterFlour[] = [
  {
    id: 'wheat-flour-strong',
    name: 'Strong wheat flour',
    label: { en: 'Strong wheat flour', el: 'Δυνατό άλευρο σίτου' },
    composition: { water: 14, protein: 13, starch: 70, fiber: 2 },
    absorptionPercentage: 75,
  },
  {
    id: 'wheat-flour-whole',
    name: 'Whole wheat flour',
    label: { en: 'Whole wheat flour', el: 'Άλευρο ολικής άλεσης' },
    composition: { water: 14, protein: 14, starch: 60, fiber: 10 },
    absorptionPercentage: 80,
  },
  {
    id: 'wheat-flour-white',
    name: 'White wheat flour',
    label: { en: 'White wheat flour', el: 'Λευκό άλευρο σίτου' },
    composition: { water: 14, protein: 11, starch: 72, fiber: 1 },
    absorptionPercentage: 70,
  },
  {
    id: 'rye-flour',
    name: 'Rye flour',
    label: { en: 'Rye flour', el: 'Άλευρο σίκαλης' },
    composition: { water: 14, protein: 9, starch: 65, fiber: 12 },
    absorptionPercentage: 75,
  },
  {
    id: 'durum-semolina',
    name: 'Durum semolina',
    label: { en: 'Durum semolina', el: 'Σιμιγδάλι σκληρού σίτου' },
    composition: {},
  },
  {
    id: 'gluten-free-bread-mix',
    name: 'Gluten-free bread mix',
    label: { en: 'Gluten-free bread mix', el: 'Μείγμα ψωμιού χωρίς γλουτένη' },
    composition: {},
  },
  {
    id: 'gluten-free-pancake-mix',
    name: 'Gluten-free pancake mix',
    label: { en: 'Gluten-free pancake mix', el: 'Μείγμα pancake χωρίς γλουτένη' },
    composition: {},
  },
];

export const STARTER_CATALOG: Record<string, StarterIngredient> = {
  water: {
    id: 'water',
    name: 'Water',
    label: { en: 'Water', el: 'Νερό' },
    composition: { water: 100 },
  },
  salt: {
    id: 'salt',
    name: 'Salt',
    label: { en: 'Salt', el: 'Αλάτι' },
    composition: {},
  },
  butter: {
    id: 'butter',
    name: 'Butter',
    label: { en: 'Butter', el: 'Βούτυρο' },
    composition: { water: 16, fat: 82, protein: 1, sugar: 0 },
  },
  sugar: {
    id: 'sugar',
    name: 'Sugar',
    label: { en: 'Sugar', el: 'Ζάχαρη' },
    composition: { sugar: 100 },
  },
  egg: {
    id: 'egg',
    name: 'Whole egg',
    label: { en: 'Whole egg', el: 'Ολόκληρο αυγό' },
    composition: { water: 75, fat: 10.5, protein: 12.5, sugar: 1, eggSolids: 25 },
  },
  milk: {
    id: 'milk',
    name: 'Milk',
    label: { en: 'Milk', el: 'Γάλα' },
    composition: { water: 87, fat: 3.5, protein: 3.3, sugar: 5, dairySolids: 13 },
  },
  oliveOil: {
    id: 'olive-oil',
    name: 'Olive oil',
    label: { en: 'Olive oil', el: 'Ελαιόλαδο' },
    composition: { fat: 100 },
  },
  honey: {
    id: 'honey',
    name: 'Honey',
    label: { en: 'Honey', el: 'Μέλι' },
    composition: { water: 17, sugar: 82 },
  },
  raisin: {
    id: 'raisin',
    name: 'Raisin',
    label: { en: 'Raisin', el: 'Σταφίδα' },
    composition: { water: 16, sugar: 59, fiber: 4 },
  },
  'instant-yeast': {
    id: 'instant-yeast',
    name: 'Instant yeast',
    label: { en: 'Instant yeast', el: 'Ξηρή στιγμιαία μαγιά' },
    composition: {},
  },
  'fresh-yeast': {
    id: 'fresh-yeast',
    name: 'Fresh yeast',
    label: { en: 'Fresh yeast', el: 'Νωπή μαγιά' },
    composition: {},
  },
  'neutral-oil': {
    id: 'neutral-oil',
    name: 'Neutral vegetable oil',
    label: { en: 'Neutral vegetable oil', el: 'Ουδέτερο φυτικό λάδι' },
    composition: { fat: 100 },
  },
  'heavy-cream': {
    id: 'heavy-cream',
    name: 'Heavy cream',
    label: { en: 'Heavy cream', el: 'Κρέμα γάλακτος' },
    composition: { water: 60, fat: 35, protein: 2, sugar: 3, dairySolids: 40 },
  },
  'baking-powder': {
    id: 'baking-powder',
    name: 'Baking powder',
    label: { en: 'Baking powder', el: 'Μπέικιν πάουντερ' },
    composition: {},
  },
  'vanilla-paste': {
    id: 'vanilla-paste',
    name: 'Vanilla paste',
    label: { en: 'Vanilla paste', el: 'Πάστα βανίλιας' },
    composition: {},
  },
  'egg-yolk': {
    id: 'egg-yolk',
    name: 'Egg yolk',
    label: { en: 'Egg yolk', el: 'Κρόκος αυγού' },
    composition: { water: 48, fat: 33, protein: 17, eggSolids: 52 },
  },
  'evaporated-milk': {
    id: 'evaporated-milk',
    name: 'Evaporated milk',
    label: { en: 'Evaporated milk', el: 'Εβαπορέ γάλα' },
    composition: {},
  },
};

export const STARTER_INGREDIENTS = Object.values(STARTER_CATALOG);

export function catalogLabel(label: LocalizedLabel, locale: CatalogLocale): string {
  return label[locale];
}
