import type { CompositionField } from '../../lib/domain/types';

export const STARTER_CATALOG_VERSION = 'starter-catalog-v1';

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
}

export interface StarterFlour {
  id: string;
  name: string;
  label: LocalizedLabel;
}

export const STARTER_FLOUR_CATALOG: StarterFlour[] = [
  {
    id: 'wheat-flour-strong',
    name: 'Strong wheat flour',
    label: { en: 'Strong wheat flour', el: 'Δυνατό άλευρο σίτου' },
  },
  {
    id: 'wheat-flour-whole',
    name: 'Whole wheat flour',
    label: { en: 'Whole wheat flour', el: 'Άλευρο ολικής άλεσης' },
  },
  {
    id: 'wheat-flour-white',
    name: 'White wheat flour',
    label: { en: 'White wheat flour', el: 'Λευκό άλευρο σίτου' },
  },
  {
    id: 'rye-flour',
    name: 'Rye flour',
    label: { en: 'Rye flour', el: 'Άλευρο σίκαλης' },
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
};

export const STARTER_INGREDIENTS = Object.values(STARTER_CATALOG);

export function catalogLabel(label: LocalizedLabel, locale: CatalogLocale): string {
  return label[locale];
}
