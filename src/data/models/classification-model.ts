import type { PrototypeImportance, PrototypeQualitativeBand } from '../../lib/domain/prototype-catalog';

/**
 * Expert-seed feature mapping. These bands are a deterministic qualitative
 * vocabulary for the initial matcher, not calibrated physical thresholds.
 */
export const CLASSIFICATION_FEATURE_SET_VERSION = 'classification-feature-set-v1';
export const CLASSIFICATION_SEED_MODEL_VERSION = 'classification-seed-v2';
export const CLASSIFICATION_BAND_POLICY_VERSION = 'classification-band-policy-v1';
export const CLASSIFICATION_SCORE_POLICY_VERSION = 'classification-score-policy-v1';

export const CLASSIFICATION_IMPORTANCE_WEIGHTS: Readonly<Record<PrototypeImportance, number>> = {
  critical: 1,
  high: 0.8,
  medium: 0.5,
  low: 0.25,
};

export type SimilarityDimension = 'composition' | 'process';

export const CLASSIFICATION_FEATURE_DIMENSIONS: Readonly<Record<string, SimilarityDimension>> = {
  effective_gluten: 'composition',
  relative_hydration: 'composition',
  fat_load: 'composition',
  sugar_load: 'composition',
  egg_solids: 'composition',
  egg_protein: 'composition',
  water_load: 'composition',
  available_water: 'composition',
  enrichment: 'composition',
  fluidity: 'composition',
  setting_capacity: 'composition',
  steam_potential: 'composition',
  layer_integrity: 'composition',
  gas_retention: 'composition',
  surface_dehydration: 'process',
  mixing_method: 'process',
  mixing_intensity: 'process',
  mixing_target: 'process',
  fat_incorporation: 'process',
  fermentation_agent: 'process',
  aeration_method: 'process',
  thermal_method: 'process',
  shape_class: 'process',
  container_type: 'process',
  steam_level: 'process',
  fermentation: 'process',
  yeast_or_sourdough: 'process',
  yeast_fermentation: 'process',
  lamination: 'process',
  layer_fat: 'process',
  mechanical_aeration: 'process',
  egg_white_foam: 'process',
  steam_leavening: 'process',
  pourable_batter: 'process',
  batter_consistency: 'process',
  strong_gluten_development: 'process',
  gluten_structure: 'process',
  suppressed_gluten: 'process',
  thermal_geometry: 'process',
};

interface BandScale {
  min: number;
  max: number;
}

export const CLASSIFICATION_BAND_SCALES: Readonly<Record<string, BandScale>> = {
  effective_gluten: { min: 0, max: 1 },
  relative_hydration: { min: 0, max: 150 },
  fat_load: { min: 0, max: 100 },
  sugar_load: { min: 0, max: 100 },
  egg_solids: { min: 0, max: 40 },
  egg_protein: { min: 0, max: 40 },
  water_load: { min: 0, max: 150 },
  available_water: { min: 0, max: 150 },
  enrichment: { min: 0, max: 100 },
  fluidity: { min: 0, max: 1 },
  setting_capacity: { min: 0, max: 1 },
  steam_potential: { min: 0, max: 1 },
  layer_integrity: { min: 0, max: 1 },
  gas_retention: { min: 0, max: 1 },
  surface_dehydration: { min: 0, max: 1 },
};

export function qualitativeBandFor(featureId: string, value: number): PrototypeQualitativeBand | undefined {
  const scale = CLASSIFICATION_BAND_SCALES[featureId];
  if (!scale || !Number.isFinite(value)) return undefined;
  const normalized = Math.min(1, Math.max(0, (value - scale.min) / (scale.max - scale.min)));
  if (normalized < 0.2) return 'very_low';
  if (normalized < 0.4) return 'low';
  if (normalized < 0.6) return 'medium';
  if (normalized < 0.8) return 'high';
  return 'very_high';
}
