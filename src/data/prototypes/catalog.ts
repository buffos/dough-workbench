import {
  PROTOTYPE_CATALOG_ID,
  PROTOTYPE_CATALOG_VERSION,
  PROTOTYPE_MODEL_VERSION,
  createPrototypeCatalogLoader,
  type PrototypeCatalogInput,
  type PrototypeDefinition,
  type PrototypeFeature,
  type PrototypeFeatureTarget,
  type PrototypeImportance,
  type PrototypeLocalizedLabel,
  type PrototypeMatcherPolicy,
  type PrototypeProvenance,
  type PrototypePresenceTarget,
  type PrototypeQualitativeBand,
} from '../../lib/domain/prototype-catalog';

const label = (en: string, el: string): PrototypeLocalizedLabel => ({ en, el });
const band = (value: PrototypeQualitativeBand): PrototypeFeatureTarget => ({ kind: 'band', value });
const bandRange = (min: PrototypeQualitativeBand, max: PrototypeQualitativeBand): PrototypeFeatureTarget => ({ kind: 'band-range', min, max });
const presence = (value: PrototypePresenceTarget): PrototypeFeatureTarget => ({ kind: 'presence', value });
const compatibility = (...values: string[]): PrototypeFeatureTarget => ({ kind: 'compatibility', values });

function feature(
  id: string,
  en: string,
  el: string,
  target: PrototypeFeatureTarget,
  importance: PrototypeImportance,
): PrototypeFeature {
  return { id, label: label(en, el), target, importance };
}

function policy(id: string): PrototypeMatcherPolicy {
  return {
    id,
    mode: 'qualitative',
    missingFeaturePolicy: 'limit-match',
    criticalMismatchPolicy: 'block-strong-match',
    identityModifierPolicy: 'report-separately',
  };
}

function provenance(en: string, el: string): PrototypeProvenance {
  return {
    sourceId: 'exploration/Initial prototype catalog.md',
    sourceVersion: 'v0.1',
    method: 'expert-seed',
    note: label(en, el),
  };
}

interface DefinitionOptions {
  id: string;
  kind: PrototypeDefinition['kind'];
  en: string;
  el: string;
  parentIds?: readonly string[];
  familyIds?: readonly string[];
  structuralFeatures?: readonly PrototypeFeature[];
  structuralConstraints?: readonly PrototypeFeature[];
  identityModifiers?: readonly PrototypeFeature[];
  matcherPolicyId?: string;
  noteEn?: string;
  noteEl?: string;
}

function definition(options: DefinitionOptions): PrototypeDefinition {
  return {
    id: options.id,
    kind: options.kind,
    label: label(options.en, options.el),
    parentIds: options.parentIds ?? [],
    familyIds: options.familyIds ?? [],
    structuralFeatures: options.structuralFeatures ?? [],
    structuralConstraints: options.structuralConstraints ?? [],
    identityModifiers: options.identityModifiers ?? [],
    matcherPolicy: policy(options.matcherPolicyId ?? `matcher.${options.kind}-qualitative-v1`),
    confidenceTier: 'high',
    maturity: 'expert-seed',
    provenance: provenance(
      options.noteEn ?? 'Initial expert estimate based on the initial dough-type catalog.',
      options.noteEl ?? 'Αρχική εκτίμηση ειδικών, βασισμένη στον αρχικό κατάλογο τύπων ζύμης.',
    ),
  };
}

const DEFINITIONS: readonly PrototypeDefinition[] = [
  definition({
    id: 'family.gluten-structured',
    kind: 'family',
    en: 'Gluten-structured dough',
    el: 'Ζύμη με δομή γλουτένης',
    structuralFeatures: [
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', band('high'), 'critical'),
      feature('fluidity', 'Fluidity', 'Ρευστότητα', bandRange('low', 'medium'), 'medium'),
    ],
    structuralConstraints: [
      feature('gluten_network', 'Gluten network', 'Δίκτυο γλουτένης', presence('required'), 'critical'),
    ],
  }),
  definition({
    id: 'family.lean-bread',
    kind: 'family',
    en: 'Lean bread',
    el: 'Λιτή ζύμη ψωμιού',
    parentIds: ['family.gluten-structured'],
    structuralFeatures: [
      feature('relative_hydration', 'Relative hydration', 'Σχετική ενυδάτωση', bandRange('medium', 'high'), 'high'),
      feature('enrichment', 'Enrichment', 'Εμπλουτισμός', band('very_low'), 'critical'),
    ],
    structuralConstraints: [
      feature('fermentation', 'Fermentation', 'Ζύμωση', presence('present'), 'critical'),
      feature('yeast_or_sourdough', 'Yeast or sourdough', 'Μαγιά ή προζύμι', presence('present'), 'critical'),
    ],
  }),
  definition({
    id: 'family.enriched-yeast-dough',
    kind: 'family',
    en: 'Enriched yeast dough',
    el: 'Εμπλουτισμένη ζύμη με μαγιά',
    parentIds: ['family.gluten-structured'],
    structuralFeatures: [
      feature('enrichment', 'Enrichment', 'Εμπλουτισμός', bandRange('medium', 'high'), 'critical'),
      feature('fluidity', 'Fluidity', 'Ρευστότητα', bandRange('low', 'medium'), 'medium'),
    ],
    structuralConstraints: [
      feature('yeast_fermentation', 'Yeast fermentation', 'Ζύμωση με μαγιά', presence('present'), 'critical'),
    ],
  }),
  definition({
    id: 'family.laminated-yeast-dough',
    kind: 'family',
    en: 'Laminated yeast dough',
    el: 'Φυλλοποιημένη ζύμη με μαγιά',
    parentIds: ['family.gluten-structured'],
    structuralFeatures: [
      feature('layer_integrity', 'Layer integrity', 'Ακεραιότητα στρώσεων', band('high'), 'high'),
      feature('steam_potential', 'Steam potential', 'Δυνατότητα ατμού', band('high'), 'high'),
    ],
    structuralConstraints: [
      feature('lamination', 'Lamination', 'Φυλλοποίηση', presence('required'), 'critical'),
      feature('layer_fat', 'Layer fat', 'Λίπος στρώσης', presence('required'), 'critical'),
    ],
  }),
  definition({
    id: 'family.fat-shortened',
    kind: 'family',
    en: 'Fat-shortened system',
    el: 'Σύστημα με υψηλό λίπος και περιορισμένη δομή',
    structuralFeatures: [
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('high', 'very_high'), 'critical'),
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', bandRange('very_low', 'low'), 'critical'),
      feature('fluidity', 'Fluidity', 'Ρευστότητα', band('very_low'), 'high'),
    ],
    structuralConstraints: [
      feature('suppressed_gluten', 'Suppressed gluten development', 'Περιορισμένη ανάπτυξη γλουτένης', presence('required'), 'critical'),
    ],
  }),
  definition({
    id: 'family.batter-systems',
    kind: 'family',
    en: 'Batter system',
    el: 'Σύστημα batter',
    structuralFeatures: [
      feature('fluidity', 'Fluidity', 'Ρευστότητα', bandRange('medium', 'very_high'), 'high'),
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', band('low'), 'critical'),
    ],
    structuralConstraints: [
      feature('starch_or_protein_set', 'Starch or protein setting', 'Στήσιμο από άμυλο ή πρωτεΐνη', presence('required'), 'critical'),
    ],
  }),
  definition({
    id: 'family.foam-structured-batters',
    kind: 'family',
    en: 'Foam-structured batter',
    el: 'Batter με δομή αφρού',
    parentIds: ['family.batter-systems'],
    structuralFeatures: [
      feature('egg_protein', 'Egg protein', 'Πρωτεΐνη αυγού', band('high'), 'high'),
    ],
    structuralConstraints: [
      feature('mechanical_aeration', 'Mechanical aeration', 'Μηχανικός αερισμός', presence('required'), 'critical'),
    ],
  }),
  definition({
    id: 'family.steam-dominant',
    kind: 'family',
    en: 'Steam-dominant system',
    el: 'Σύστημα όπου κυριαρχεί ο ατμός',
    structuralFeatures: [
      feature('available_water', 'Available water', 'Διαθέσιμο νερό', band('high'), 'critical'),
      feature('setting_capacity', 'Setting capacity', 'Ικανότητα στησίματος', band('high'), 'critical'),
    ],
    structuralConstraints: [
      feature('steam_leavening', 'Steam leavening', 'Διόγκωση με ατμό', presence('required'), 'critical'),
    ],
  }),
  definition({
    id: 'prototype.lean-bread',
    kind: 'prototype',
    en: 'Lean bread dough',
    el: 'Λιτή ζύμη ψωμιού',
    parentIds: ['family.lean-bread'],
    familyIds: ['family.lean-bread'],
    structuralFeatures: [
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', band('high'), 'critical'),
      feature('relative_hydration', 'Relative hydration', 'Σχετική ενυδάτωση', bandRange('medium', 'high'), 'high'),
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', band('very_low'), 'high'),
      feature('sugar_load', 'Sugar load', 'Φορτίο ζάχαρης', bandRange('very_low', 'low'), 'high'),
    ],
    structuralConstraints: [
      feature('fermentation', 'Fermentation', 'Ζύμωση', presence('present'), 'critical'),
      feature('yeast_or_sourdough', 'Yeast or sourdough', 'Μαγιά ή προζύμι', presence('present'), 'critical'),
    ],
  }),
  definition({
    id: 'prototype.brioche',
    kind: 'prototype',
    en: 'Brioche',
    el: 'Brioche',
    parentIds: ['family.enriched-yeast-dough'],
    familyIds: ['family.enriched-yeast-dough'],
    structuralFeatures: [
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', band('very_high'), 'critical'),
      feature('egg_solids', 'Egg solids', 'Στερεά αυγού', band('high'), 'high'),
      feature('enrichment', 'Enrichment', 'Εμπλουτισμός', band('very_high'), 'critical'),
      feature('relative_hydration', 'Relative hydration', 'Σχετική ενυδάτωση', band('medium'), 'medium'),
      feature('fat_incorporation', 'Fat incorporation', 'Ενσωμάτωση λίπους', compatibility('late_incorporation', 'direct_mix', 'emulsified'), 'high'),
    ],
    structuralConstraints: [
      feature('yeast_fermentation', 'Yeast fermentation', 'Ζύμωση με μαγιά', presence('present'), 'critical'),
      feature('strong_gluten_development', 'Strong gluten development', 'Ισχυρή ανάπτυξη γλουτένης', presence('required'), 'critical'),
    ],
  }),
  definition({
    id: 'prototype.shortbread',
    kind: 'prototype',
    en: 'Shortbread',
    el: 'Shortbread',
    parentIds: ['family.fat-shortened'],
    familyIds: ['family.fat-shortened'],
    structuralFeatures: [
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', band('very_high'), 'critical'),
      feature('water_load', 'Water load', 'Φορτίο νερού', band('very_low'), 'critical'),
      feature('sugar_load', 'Sugar load', 'Φορτίο ζάχαρης', band('medium'), 'high'),
      feature('fluidity', 'Fluidity', 'Ρευστότητα', band('very_low'), 'high'),
    ],
    structuralConstraints: [
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', band('very_low'), 'critical'),
      feature('yeast', 'Yeast', 'Μαγιά', presence('absent'), 'high'),
      feature('chemical_leavening', 'Chemical leavening', 'Χημικό διογκωτικό', presence('absent'), 'high'),
    ],
  }),
  definition({
    id: 'prototype.pancake',
    kind: 'prototype',
    en: 'Pancake',
    el: 'Pancake',
    parentIds: ['family.batter-systems'],
    familyIds: ['family.batter-systems'],
    structuralFeatures: [
      feature('fluidity', 'Fluidity', 'Ρευστότητα', band('high'), 'critical'),
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', band('low'), 'high'),
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('low', 'medium'), 'medium'),
      feature('sugar_load', 'Sugar load', 'Φορτίο ζάχαρης', bandRange('low', 'medium'), 'low'),
      feature('thermal_geometry', 'Pan or griddle geometry', 'Γεωμετρία τηγανιού ή πλάκας', compatibility('pan', 'griddle'), 'critical'),
    ],
    structuralConstraints: [
      feature('chemical_leavening', 'Chemical leavening', 'Χημικό διογκωτικό', presence('present'), 'critical'),
      feature('pourable_batter', 'Pourable batter', 'Ρευστό batter που χύνεται', presence('required'), 'critical'),
    ],
  }),
  definition({
    id: 'prototype.crepe',
    kind: 'prototype',
    en: 'Crêpe',
    el: 'Κρέπα',
    parentIds: ['family.batter-systems'],
    familyIds: ['family.batter-systems'],
    structuralFeatures: [
      feature('fluidity', 'Fluidity', 'Ρευστότητα', band('very_high'), 'critical'),
      feature('egg_solids', 'Egg solids', 'Στερεά αυγού', bandRange('medium', 'high'), 'high'),
      feature('thermal_geometry', 'Very thin geometry', 'Πολύ λεπτή γεωμετρία', compatibility('thin_sheet', 'pan'), 'critical'),
    ],
    structuralConstraints: [
      feature('chemical_leavening', 'Chemical leavening', 'Χημικό διογκωτικό', presence('none_or_low'), 'critical'),
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', band('low'), 'high'),
    ],
  }),
  definition({
    id: 'prototype.angel-food',
    kind: 'prototype',
    en: 'Angel food cake',
    el: 'Angel food cake',
    parentIds: ['family.foam-structured-batters'],
    familyIds: ['family.foam-structured-batters'],
    structuralFeatures: [
      feature('egg_protein', 'Egg-white protein', 'Πρωτεΐνη ασπραδιού', band('very_high'), 'critical'),
      feature('sugar_load', 'Sugar load', 'Φορτίο ζάχαρης', band('high'), 'high'),
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', band('low'), 'critical'),
    ],
    structuralConstraints: [
      feature('fat', 'Fat', 'Λίπος', presence('absent'), 'critical'),
      feature('egg_white_foam', 'Whipped egg-white foam', 'Αφρός χτυπημένου ασπραδιού', presence('required'), 'critical'),
    ],
  }),
  definition({
    id: 'prototype.choux',
    kind: 'prototype',
    en: 'Choux pastry',
    el: 'Ζύμη choux',
    parentIds: ['family.steam-dominant'],
    familyIds: ['family.steam-dominant'],
    structuralFeatures: [
      feature('available_water', 'Available water', 'Διαθέσιμο νερό', band('high'), 'critical'),
      feature('egg_solids', 'Egg solids', 'Στερεά αυγού', band('high'), 'critical'),
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('medium', 'high'), 'high'),
    ],
    structuralConstraints: [
      feature('pre_cooked_starch', 'Pre-cooked starch paste', 'Προμαγειρεμένη αμυλώδης πάστα', presence('required'), 'critical'),
      feature('steam_leavening', 'Steam leavening', 'Διόγκωση με ατμό', presence('required'), 'critical'),
      feature('yeast', 'Yeast', 'Μαγιά', presence('absent'), 'high'),
    ],
  }),
  definition({
    id: 'prototype.croissant',
    kind: 'prototype',
    en: 'Croissant',
    el: 'Κρουασάν',
    parentIds: ['family.laminated-yeast-dough'],
    familyIds: ['family.laminated-yeast-dough'],
    structuralFeatures: [
      feature('layer_integrity', 'Layer integrity', 'Ακεραιότητα στρώσεων', band('high'), 'high'),
      feature('steam_potential', 'Steam potential', 'Δυνατότητα ατμού', band('high'), 'high'),
      feature('enrichment', 'Enrichment', 'Εμπλουτισμός', bandRange('low', 'medium'), 'medium'),
      feature('sugar_load', 'Sugar load', 'Φορτίο ζάχαρης', band('low'), 'medium'),
    ],
    structuralConstraints: [
      feature('lamination', 'Lamination', 'Φυλλοποίηση', presence('required'), 'critical'),
      feature('layer_fat', 'Layer fat', 'Λίπος στρώσης', presence('required'), 'critical'),
      feature('yeast_fermentation', 'Yeast fermentation', 'Ζύμωση με μαγιά', presence('present'), 'critical'),
      feature('gluten_structure', 'Gluten structure', 'Δομή γλουτένης', presence('required'), 'critical'),
    ],
  }),
];

export const PROTOTYPE_CATALOG_INPUT: PrototypeCatalogInput = {
  catalogId: PROTOTYPE_CATALOG_ID,
  version: PROTOTYPE_CATALOG_VERSION,
  modelVersion: PROTOTYPE_MODEL_VERSION,
  supportedLocales: ['en', 'el'],
  definitions: DEFINITIONS,
};

export const loadPrototypeCatalog = createPrototypeCatalogLoader([PROTOTYPE_CATALOG_INPUT]);

export const PROTOTYPE_DEFINITIONS = DEFINITIONS;
