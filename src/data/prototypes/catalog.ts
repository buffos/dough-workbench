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
  type PrototypeProcessProfileFact,
  type PrototypeProcessProfileSection,
  type PrototypePresenceTarget,
  type PrototypeQualitativeBand,
} from '../../lib/domain/prototype-catalog';
import { STRUCTURAL_FAMILY_NODES } from '../../lib/domain/structural-taxonomy';

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

function processFact(
  id: string,
  labelEn: string,
  labelEl: string,
  valueEn: string,
  valueEl: string,
  noteEn?: string,
  noteEl?: string,
): PrototypeProcessProfileFact {
  return {
    id,
    label: label(labelEn, labelEl),
    value: label(valueEn, valueEl),
    ...(noteEn && noteEl ? { note: label(noteEn, noteEl) } : {}),
  };
}

function processSection(
  id: string,
  labelEn: string,
  labelEl: string,
  facts: readonly PrototypeProcessProfileFact[],
): PrototypeProcessProfileSection {
  return { id, label: label(labelEn, labelEl), facts };
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

function provenance(
  en: string,
  el: string,
  sourceId = 'exploration/Initial prototype catalog.md',
  sourceVersion = 'v0.1',
): PrototypeProvenance {
  return {
    sourceId,
    sourceVersion,
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
  processProfile?: readonly PrototypeProcessProfileSection[];
  matcherPolicyId?: string;
  noteEn?: string;
  noteEl?: string;
  provenanceSourceId?: string;
  provenanceSourceVersion?: string;
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
    processProfile: options.processProfile,
    matcherPolicy: policy(options.matcherPolicyId ?? `matcher.${options.kind}-qualitative-v1`),
    confidenceTier: 'high',
    maturity: 'expert-seed',
    provenance: provenance(
      options.noteEn ?? 'Initial expert estimate based on the initial dough-type catalog.',
      options.noteEl ?? 'Αρχική εκτίμηση ειδικών, βασισμένη στον αρχικό κατάλογο τύπων ζύμης.',
      options.provenanceSourceId,
      options.provenanceSourceVersion,
    ),
  };
}

interface FamilyRule {
  structuralFeatures?: readonly PrototypeFeature[];
  structuralConstraints?: readonly PrototypeFeature[];
}

const FAMILY_RULES: Readonly<Record<string, FamilyRule>> = {
  'family.fermented-gluten': {
    structuralFeatures: [
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', band('high'), 'critical'),
      feature('enrichment', 'Enrichment', 'Εμπλουτισμός', bandRange('very_low', 'high'), 'medium'),
    ],
    structuralConstraints: [
      feature('gluten_structure', 'Gluten structure', 'Δομή γλουτένης', presence('required'), 'critical'),
      feature('fermentation', 'Fermentation', 'Ζύμωση', presence('present'), 'critical'),
    ],
  },
  'family.fermented-gluten.stiff': {
    structuralFeatures: [feature('relative_hydration', 'Relative hydration', 'Σχετική ενυδάτωση', bandRange('very_low', 'low'), 'high')],
  },
  'family.fermented-gluten.lean-bread': {
    structuralFeatures: [
      feature('relative_hydration', 'Relative hydration', 'Σχετική ενυδάτωση', bandRange('medium', 'high'), 'high'),
      feature('enrichment', 'Enrichment', 'Εμπλουτισμός', band('very_low'), 'critical'),
    ],
  },
  'family.fermented-gluten.high-hydration': {
    structuralFeatures: [feature('relative_hydration', 'Relative hydration', 'Σχετική ενυδάτωση', bandRange('high', 'very_high'), 'critical')],
  },
  'family.fermented-gluten.flat': {
    structuralFeatures: [feature('thermal_geometry', 'Flat geometry', 'Επίπεδη γεωμετρία', compatibility('flatbread'), 'high')],
  },
  'family.fermented-gluten.soft-enriched': {
    structuralFeatures: [feature('enrichment', 'Enrichment', 'Εμπλουτισμός', bandRange('low', 'medium'), 'critical')],
  },
  'family.fermented-gluten.rich-enriched': {
    structuralFeatures: [feature('enrichment', 'Enrichment', 'Εμπλουτισμός', bandRange('high', 'very_high'), 'critical')],
  },
  'family.unleavened-gluten': {
    structuralFeatures: [feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', bandRange('medium', 'high'), 'critical')],
    structuralConstraints: [
      feature('gluten_structure', 'Gluten structure', 'Δομή γλουτένης', presence('required'), 'critical'),
      feature('fermentation', 'Fermentation', 'Ζύμωση', presence('absent'), 'critical'),
    ],
  },
  'family.unleavened-gluten.pasta-noodle': {
    structuralFeatures: [feature('relative_hydration', 'Relative hydration', 'Σχετική ενυδάτωση', bandRange('very_low', 'medium'), 'high')],
  },
  'family.unleavened-gluten.wrapper-dumpling': {
    structuralFeatures: [feature('relative_hydration', 'Relative hydration', 'Σχετική ενυδάτωση', bandRange('low', 'medium'), 'high')],
  },
  'family.unleavened-gluten.flatbread': {
    structuralFeatures: [feature('thermal_geometry', 'Flat geometry', 'Επίπεδη γεωμετρία', compatibility('flatbread'), 'high')],
  },
  'family.laminated-gluten': {
    structuralFeatures: [
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', band('high'), 'critical'),
      feature('layer_integrity', 'Layer integrity', 'Ακεραιότητα στρώσεων', band('high'), 'high'),
      feature('steam_potential', 'Steam potential', 'Δυνατότητα ατμού', band('high'), 'high'),
    ],
    structuralConstraints: [
      feature('gluten_structure', 'Gluten structure', 'Δομή γλουτένης', presence('required'), 'critical'),
      feature('lamination', 'Lamination', 'Φυλλοποίηση', presence('required'), 'critical'),
      feature('layer_fat', 'Layer fat', 'Λίπος στρώσης', presence('required'), 'critical'),
    ],
  },
  'family.laminated-gluten.fermented': {
    structuralConstraints: [feature('fermentation', 'Fermentation', 'Ζύμωση', presence('present'), 'critical')],
  },
  'family.laminated-gluten.unfermented': {
    structuralConstraints: [feature('fermentation', 'Fermentation', 'Ζύμωση', presence('absent'), 'critical')],
  },
  'family.short-fat-shortened': {
    structuralFeatures: [
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('high', 'very_high'), 'critical'),
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', bandRange('very_low', 'low'), 'critical'),
      feature('fluidity', 'Fluidity', 'Ρευστότητα', band('very_low'), 'high'),
    ],
    structuralConstraints: [feature('suppressed_gluten', 'Suppressed gluten development', 'Περιορισμένη ανάπτυξη γλουτένης', presence('required'), 'critical')],
  },
  'family.short-fat-shortened.basic-shortcrust': {
    structuralFeatures: [feature('sugar_load', 'Sugar load', 'Φορτίο ζάχαρης', bandRange('very_low', 'low'), 'medium')],
  },
  'family.short-fat-shortened.sweet-shortcrust': {
    structuralFeatures: [feature('sugar_load', 'Sugar load', 'Φορτίο ζάχαρης', bandRange('medium', 'high'), 'high')],
  },
  'family.short-fat-shortened.sandy-sable': {
    structuralFeatures: [feature('fat_load', 'Fat load', 'Φορτίο λίπους', band('high'), 'high')],
  },
  'family.short-fat-shortened.shortbread': {
    structuralFeatures: [
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', band('very_high'), 'critical'),
      feature('water_load', 'Water load', 'Φορτίο νερού', band('very_low'), 'critical'),
    ],
  },
  'family.cookie-biscuit': {
    structuralFeatures: [
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', bandRange('very_low', 'low'), 'critical'),
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('medium', 'very_high'), 'high'),
      feature('sugar_load', 'Sugar load', 'Φορτίο ζάχαρης', bandRange('medium', 'very_high'), 'high'),
    ],
    structuralConstraints: [feature('shape_class', 'Cookie shape', 'Σχήμα μπισκότου', compatibility('cookie'), 'high')],
  },
  'family.chemical-cake': {
    structuralFeatures: [
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', bandRange('very_low', 'low'), 'critical'),
      feature('setting_capacity', 'Setting capacity', 'Ικανότητα στησίματος', bandRange('medium', 'high'), 'critical'),
    ],
    structuralConstraints: [feature('shape_class', 'Cake shape', 'Σχήμα κέικ', compatibility('cake', 'muffin'), 'high')],
  },
  'family.chemical-cake.butter': {
    structuralFeatures: [feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('medium', 'high'), 'high')],
  },
  'family.chemical-cake.oil': {
    structuralFeatures: [feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('medium', 'high'), 'high')],
  },
  'family.chemical-cake.high-ratio': {
    structuralFeatures: [
      feature('sugar_load', 'Sugar load', 'Φορτίο ζάχαρης', band('high'), 'high'),
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('medium', 'high'), 'high'),
    ],
  },
  'family.foam-cake': {
    structuralFeatures: [
      feature('egg_protein', 'Egg protein', 'Πρωτεΐνη αυγού', bandRange('high', 'very_high'), 'critical'),
      feature('setting_capacity', 'Setting capacity', 'Ικανότητα στησίματος', bandRange('medium', 'high'), 'high'),
    ],
    structuralConstraints: [
      feature('shape_class', 'Cake shape', 'Σχήμα κέικ', compatibility('cake'), 'high'),
      feature('mechanical_aeration', 'Mechanical aeration', 'Μηχανικός αερισμός', presence('required'), 'critical'),
    ],
  },
  'family.foam-cake.whole-egg': {
    structuralFeatures: [feature('egg_solids', 'Egg solids', 'Στερεά αυγού', bandRange('medium', 'high'), 'high')],
  },
  'family.foam-cake.egg-white': {
    structuralFeatures: [feature('egg_protein', 'Egg-white protein', 'Πρωτεΐνη ασπραδιού', band('very_high'), 'critical')],
    structuralConstraints: [feature('egg_white_foam', 'Whipped egg-white foam', 'Αφρός χτυπημένου ασπραδιού', presence('required'), 'critical')],
  },
  'family.foam-cake.separated-egg': {
    structuralFeatures: [feature('egg_protein', 'Egg protein', 'Πρωτεΐνη αυγού', band('high'), 'high')],
  },
  'family.foam-cake.hybrid': {
    structuralFeatures: [feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('low', 'medium'), 'medium')],
  },
  'family.quick-bread': {
    structuralFeatures: [
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', bandRange('very_low', 'low'), 'critical'),
      feature('setting_capacity', 'Setting capacity', 'Ικανότητα στησίματος', bandRange('medium', 'high'), 'high'),
    ],
    structuralConstraints: [feature('shape_class', 'Quick-bread shape', 'Σχήμα γρήγορου ψωμιού', compatibility('muffin', 'cake', 'loaf'), 'high')],
  },
  'family.quick-bread.muffin': {
    structuralConstraints: [feature('shape_class', 'Muffin shape', 'Σχήμα muffin', compatibility('muffin'), 'critical')],
  },
  'family.quick-bread.quick-loaf': {
    structuralConstraints: [feature('shape_class', 'Loaf shape', 'Σχήμα καρβελιού', compatibility('loaf'), 'high')],
  },
  'family.batters': {
    structuralConstraints: [
      feature('batter_consistency', 'Batter consistency', 'Συνεκτικότητα μείγματος', compatibility('thick_batter', 'thin_pourable_batter'), 'critical'),
    ],
  },
  'family.batters.thin-pan': {
    structuralFeatures: [feature('fluidity', 'Fluidity', 'Ρευστότητα', band('very_high'), 'critical')],
    structuralConstraints: [
      feature('thermal_geometry', 'Thin pan geometry', 'Λεπτή γεωμετρία τηγανιού', compatibility('thin_sheet', 'pan'), 'critical'),
      feature('chemical_leavening', 'Chemical leavening', 'Χημική διόγκωση', presence('none_or_low'), 'high'),
    ],
  },
  'family.batters.griddle': {
    structuralFeatures: [
      feature('fluidity', 'Fluidity', 'Ρευστότητα', bandRange('medium', 'very_high'), 'critical'),
      feature('setting_capacity', 'Setting capacity', 'Ικανότητα στησίματος', bandRange('medium', 'high'), 'high'),
    ],
    structuralConstraints: [
      feature('thermal_method', 'Thermal method', 'Θερμική μέθοδος', compatibility('griddle', 'pan'), 'high'),
      feature('shape_class', 'Pancake shape', 'Σχήμα pancake', compatibility('pancake'), 'high'),
    ],
  },
  'family.batters.waffle': {
    structuralFeatures: [
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('low', 'very_high'), 'high'),
      feature('surface_dehydration', 'Surface dehydration', 'Επιφανειακή αφυδάτωση', band('high'), 'critical'),
    ],
    structuralConstraints: [
      feature('thermal_method', 'Thermal method', 'Θερμική μέθοδος', compatibility('waffle_iron'), 'critical'),
      feature('shape_class', 'Waffle shape', 'Σχήμα waffle', compatibility('waffle'), 'critical'),
    ],
  },
  'family.batters.steam-puffed': {
    structuralFeatures: [
      feature('egg_solids', 'Egg solids', 'Στερεά αυγού', bandRange('high', 'very_high'), 'critical'),
      feature('available_water', 'Available water', 'Διαθέσιμο νερό', bandRange('high', 'very_high'), 'high'),
    ],
    structuralConstraints: [
      feature('steam_leavening', 'Steam leavening', 'Διόγκωση με ατμό', presence('required'), 'critical'),
      feature('shape_class', 'Steam-puffed shape', 'Σχήμα διογκωμένο με ατμό', compatibility('dutch_baby', 'popover', 'yorkshire_pudding', 'steam_puffed'), 'high'),
    ],
  },
  'family.batters.custard-like': {
    structuralFeatures: [
      feature('egg_solids', 'Egg solids', 'Στερεά αυγού', bandRange('high', 'very_high'), 'critical'),
      feature('setting_capacity', 'Setting capacity', 'Ικανότητα στησίματος', bandRange('medium', 'high'), 'high'),
    ],
    structuralConstraints: [feature('shape_class', 'Custard shape', 'Σχήμα custard', compatibility('custard'), 'high')],
  },
  'family.batters.coating': {
    structuralFeatures: [
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', bandRange('very_low', 'low'), 'critical'),
      feature('fluidity', 'Fluidity', 'Ρευστότητα', bandRange('high', 'very_high'), 'high'),
    ],
    structuralConstraints: [
      feature('thermal_method', 'Deep frying', 'Βαθύ τηγάνισμα', compatibility('deep_fry'), 'critical'),
      feature('shape_class', 'Coating shape', 'Σχήμα επικάλυψης', compatibility('coating'), 'high'),
      feature('suppressed_gluten', 'Suppressed gluten', 'Περιορισμένη γλουτένη', presence('required'), 'high'),
    ],
  },
  'family.batters.fritter': {
    structuralFeatures: [
      feature('setting_capacity', 'Setting capacity', 'Ικανότητα στησίματος', bandRange('medium', 'high'), 'high'),
      feature('fluidity', 'Fluidity', 'Ρευστότητα', bandRange('low', 'very_high'), 'critical'),
    ],
    structuralConstraints: [
      feature('thermal_method', 'Frying method', 'Μέθοδος τηγανίσματος', compatibility('shallow_fry', 'deep_fry'), 'critical'),
      feature('shape_class', 'Fritter shape', 'Σχήμα fritter', compatibility('fritter'), 'critical'),
    ],
  },
  'family.batters.fermented': {
    structuralFeatures: [feature('fluidity', 'Fluidity', 'Ρευστότητα', bandRange('high', 'very_high'), 'high')],
    structuralConstraints: [
      feature('fermentation', 'Fermentation', 'Ζύμωση', presence('present'), 'critical'),
      feature('batter_consistency', 'Batter consistency', 'Συνεκτικότητα μείγματος', compatibility('thick_batter', 'thin_pourable_batter'), 'high'),
    ],
  },
  'family.batters.foam-leavened': {
    structuralFeatures: [
      feature('egg_protein', 'Egg protein', 'Πρωτεΐνη αυγού', bandRange('medium', 'very_high'), 'critical'),
      feature('gas_retention', 'Gas retention', 'Κατακράτηση αερίου', bandRange('medium', 'very_high'), 'high'),
    ],
    structuralConstraints: [feature('mechanical_aeration', 'Mechanical aeration', 'Μηχανικός αερισμός', presence('required'), 'critical')],
  },
  'family.batters.cake-adjacent': {
    structuralFeatures: [
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('high', 'very_high'), 'critical'),
      feature('sugar_load', 'Sugar load', 'Φορτίο ζάχαρης', bandRange('high', 'very_high'), 'critical'),
      feature('setting_capacity', 'Setting capacity', 'Ικανότητα στησίματος', bandRange('medium', 'high'), 'high'),
    ],
    structuralConstraints: [feature('shape_class', 'Cake-adjacent shape', 'Σχήμα στα όρια προς cake', compatibility('cake', 'muffin'), 'high')],
  },
  'family.chemical-pourable': {
    structuralFeatures: [
      feature('fluidity', 'Fluidity', 'Ρευστότητα', bandRange('high', 'very_high'), 'critical'),
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', band('low'), 'critical'),
    ],
    structuralConstraints: [feature('pourable_batter', 'Pourable batter', 'Ρευστό μείγμα που χύνεται', presence('required'), 'critical')],
  },
  'family.chemical-pourable.pancake': {
    structuralConstraints: [feature('shape_class', 'Pancake shape', 'Σχήμα pancake', compatibility('pancake'), 'high')],
  },
  'family.chemical-pourable.waffle': {
    structuralConstraints: [feature('shape_class', 'Waffle geometry', 'Γεωμετρία waffle', compatibility('pancake'), 'medium')],
  },
  'family.chemical-pourable.fritter-coating': {
    structuralConstraints: [feature('thermal_method', 'Frying or coating process', 'Τηγάνισμα ή διαδικασία επικάλυψης', compatibility('deep_fry'), 'high')],
  },
  'family.unleavened-pourable': {
    structuralFeatures: [
      feature('fluidity', 'Fluidity', 'Ρευστότητα', band('very_high'), 'critical'),
      feature('setting_capacity', 'Setting capacity', 'Ικανότητα στησίματος', bandRange('medium', 'high'), 'high'),
    ],
    structuralConstraints: [
      feature('pourable_batter', 'Pourable batter', 'Ρευστό μείγμα που χύνεται', presence('required'), 'critical'),
      feature('fermentation', 'Fermentation', 'Ζύμωση', presence('absent'), 'high'),
    ],
  },
  'family.unleavened-pourable.crepe': {
    structuralConstraints: [feature('thermal_geometry', 'Very thin geometry', 'Πολύ λεπτή γεωμετρία', compatibility('thin_sheet', 'crepe'), 'critical')],
  },
  'family.fermented-batter': {
    structuralFeatures: [feature('fluidity', 'Fluidity', 'Ρευστότητα', bandRange('high', 'very_high'), 'critical')],
    structuralConstraints: [
      feature('pourable_batter', 'Pourable batter', 'Ρευστό μείγμα που χύνεται', presence('required'), 'critical'),
      feature('fermentation', 'Fermentation', 'Ζύμωση', presence('present'), 'critical'),
    ],
  },
  'family.fermented-batter.yeast': {
    structuralConstraints: [feature('fermentation_agent', 'Fermentation agent', 'Παράγοντας ζύμωσης', compatibility('commercial_yeast'), 'high')],
  },
  'family.fermented-batter.lactic-mixed': {
    structuralConstraints: [feature('fermentation_agent', 'Fermentation agent', 'Παράγοντας ζύμωσης', compatibility('sourdough', 'mixed'), 'high')],
  },
  'family.steam-paste': {
    structuralFeatures: [
      feature('available_water', 'Available water', 'Διαθέσιμο νερό', band('high'), 'critical'),
      feature('setting_capacity', 'Setting capacity', 'Ικανότητα στησίματος', band('high'), 'critical'),
    ],
    structuralConstraints: [feature('steam_leavening', 'Steam leavening', 'Διόγκωση με ατμό', presence('required'), 'critical')],
  },
  'family.steam-paste.choux': {
    structuralFeatures: [feature('egg_solids', 'Egg solids', 'Στερεά αυγού', band('high'), 'critical')],
  },
  'family.starch-dominant': {
    structuralFeatures: [
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', bandRange('very_low', 'low'), 'critical'),
      feature('setting_capacity', 'Setting capacity', 'Ικανότητα στησίματος', bandRange('medium', 'high'), 'critical'),
    ],
  },
  'family.starch-dominant.potato': {
    structuralFeatures: [feature('water_load', 'Water load', 'Φορτίο νερού', bandRange('medium', 'high'), 'medium')],
  },
  'family.starch-dominant.rice-starch': {
    structuralFeatures: [feature('water_load', 'Water load', 'Φορτίο νερού', bandRange('medium', 'very_high'), 'high')],
  },
};

function taxonomyFamilyDefinition(node: typeof STRUCTURAL_FAMILY_NODES[number]): PrototypeDefinition {
  const rule = FAMILY_RULES[node.id] ?? {};
  return definition({
    id: node.id,
    kind: 'family',
    en: node.label.en,
    el: node.label.el,
    parentIds: node.parentId ? [node.parentId] : [],
    structuralFeatures: rule.structuralFeatures,
    structuralConstraints: rule.structuralConstraints,
    noteEn: `Canonical structural family: ${node.description.en || node.label.en}`,
    noteEl: `Canonical δομική οικογένεια: ${node.description.el || node.label.el}`,
    provenanceSourceId: 'user-provided canonical structural taxonomy',
    provenanceSourceVersion: 'v1',
  });
}

const BREADSTICK_PROCESS_PROFILE: readonly PrototypeProcessProfileSection[] = [
  processSection('mixing', 'Mixing and dough development', 'Ανάμειξη και ανάπτυξη ζύμης', [
    processFact(
      'method',
      'Method',
      'Μέθοδος',
      'Hand knead for fermented variants; minimal combine for the biscuit-style variant.',
      'Ζύμωμα στο χέρι για τις ζυμωμένες παραλλαγές· απλή ανάμειξη για την biscuit-style παραλλαγή.',
    ),
    processFact(
      'development',
      'Development target',
      'Στόχος ανάπτυξης',
      'Partial gluten development for fermented variants; minimal development for the biscuit-style variant.',
      'Μερική ανάπτυξη γλουτένης για τις ζυμωμένες παραλλαγές· ελάχιστη ανάπτυξη για την biscuit-style παραλλαγή.',
    ),
  ]),
  processSection('fermentation', 'Fermentation', 'Ζύμωση', [
    processFact(
      'agent',
      'Fermentation agent',
      'Παράγοντας ζύμωσης',
      'Commercial yeast in the main variants; mixed culture with levain in the sourdough variant; none in the biscuit-style variant.',
      'Εμπορική μαγιά στις βασικές παραλλαγές· μικτή καλλιέργεια με levain στην παραλλαγή με προζύμι· κανένας παράγοντας στην biscuit-style παραλλαγή.',
    ),
    processFact(
      'bulk-time',
      'Bulk fermentation',
      'Κύρια ζύμωση',
      'About 60–90 minutes for the fermented variants.',
      'Περίπου 60–90 λεπτά για τις ζυμωμένες παραλλαγές.',
    ),
    processFact(
      'cold-stage',
      'Cold stage',
      'Ψυχρό στάδιο',
      'Used by the sourdough variant; not used by the direct-yeast variants.',
      'Χρησιμοποιείται στην παραλλαγή με προζύμι· δεν χρησιμοποιείται στις παραλλαγές με άμεση μαγιά.',
    ),
  ]),
  processSection('geometry', 'Geometry and shaping', 'Γεωμετρία και σχηματισμός', [
    processFact(
      'shape',
      'Shape',
      'Σχήμα',
      'Long, thin sticks; the biscuit-style variant is handled as a short cookie-like piece.',
      'Μακριά, λεπτά μπαστούνια· η biscuit-style παραλλαγή δουλεύεται ως κοντό, μπισκοτοειδές τεμάχιο.',
    ),
    processFact(
      'thickness',
      'Characteristic thickness',
      'Χαρακτηριστικό πάχος',
      '5–12 mm across the linked formulas.',
      '5–12 mm στις συνδεδεμένες φόρμουλες.',
    ),
    processFact(
      'surface-volume',
      'Surface / volume',
      'Επιφάνεια / όγκος',
      'Medium to high; thinner sticks dry more quickly.',
      'Μεσαία έως υψηλή σχέση· τα λεπτότερα μπαστούνια στεγνώνουν γρηγορότερα.',
    ),
    processFact(
      'baking-surface',
      'Baking surface',
      'Επιφάνεια ψησίματος',
      'Baking sheet.',
      'Λαμαρίνα.',
    ),
  ]),
  processSection('thermal', 'Thermal process', 'Θερμική διαδικασία', [
    processFact(
      'method',
      'Method',
      'Μέθοδος',
      'Preheated static oven.',
      'Προθερμασμένος στατικός φούρνος.',
    ),
    processFact(
      'temperature',
      'Temperature',
      'Θερμοκρασία',
      '180–190 °C across the linked formulas.',
      '180–190 °C στις συνδεδεμένες φόρμουλες.',
    ),
    processFact(
      'duration',
      'Baking time',
      'Χρόνος ψησίματος',
      'About 18–22 minutes, depending on thickness and formula.',
      'Περίπου 18–22 λεπτά, ανάλογα με το πάχος και τη φόρμουλα.',
    ),
    processFact(
      'surface',
      'Surface treatment',
      'Επιφανειακή εφαρμογή',
      'None recorded as a common step in this set.',
      'Δεν έχει καταγραφεί κοινή επιφανειακή εφαρμογή σε αυτό το σύνολο.',
    ),
  ]),
];

const CRACKER_PROCESS_PROFILE: readonly PrototypeProcessProfileSection[] = [
  processSection('mixing', 'Mixing and dough development', 'Ανάμειξη και ανάπτυξη ζύμης', [
    processFact(
      'method',
      'Method',
      'Μέθοδος',
      'Minimal combine: dry ingredients, fat coating, then water.',
      'Απλή ανάμειξη: στεγνά υλικά, ενσωμάτωση λίπους και μετά νερό.',
    ),
    processFact(
      'development',
      'Development target',
      'Στόχος ανάπτυξης',
      'Minimal gluten development; combine only until homogeneous.',
      'Ελάχιστη ανάπτυξη γλουτένης· ανάμειξη μόνο μέχρι να ομογενοποιηθεί.',
    ),
    processFact(
      'rest',
      'Covered rest',
      'Σκεπαστή ξεκούραση',
      'About 20–30 minutes after mixing, for hydration and relaxation rather than fermentation.',
      'Περίπου 20–30 λεπτά μετά την ανάμειξη, για ενυδάτωση και χαλάρωση, όχι για ζύμωση.',
    ),
  ]),
  processSection('fermentation', 'Fermentation', 'Ζύμωση', [
    processFact(
      'agent',
      'Fermentation agent',
      'Παράγοντας ζύμωσης',
      'None; the reference set uses chemical leavening where lift is needed.',
      'Κανένας· το σύνολο αναφοράς χρησιμοποιεί χημικό διογκωτικό όπου χρειάζεται διόγκωση.',
    ),
  ]),
  processSection('addition', 'Addition order', 'Σειρά προσθήκης', [
    processFact(
      'timeline',
      'Common sequence',
      'Κοινή σειρά',
      'Dry mix → distribute fat → add water → minimal combine → covered rest. Inclusions and lamination fat are variant-specific.',
      'Στεγνή ανάμειξη → κατανομή λίπους → προσθήκη νερού → ελάχιστη ανάμειξη → σκεπαστή ξεκούραση. Οι προσθήκες και το λίπος φυλλοποίησης διαφέρουν ανά παραλλαγή.',
    ),
  ]),
  processSection('lamination', 'Lamination', 'Φυλλοποίηση', [
    processFact(
      'optional',
      'Variant-dependent lamination',
      'Φυλλοποίηση ανά παραλλαγή',
      'Absent in the plain set; the flaky variant uses about 10% additional layer fat and folding.',
      'Απούσα στις απλές παραλλαγές· η flaky παραλλαγή χρησιμοποιεί περίπου 10% επιπλέον λίπος σε στρώση και δίπλωμα.',
    ),
  ]),
  processSection('geometry', 'Geometry and shaping', 'Γεωμετρία και σχηματισμός', [
    processFact(
      'shape',
      'Shape',
      'Σχήμα',
      'Thin sheet, generally rolled to about 1–2 mm; the wider source range runs from 0.7 to 3 mm.',
      'Λεπτό φύλλο, συνήθως ανοιγμένο περίπου στα 1–2 mm· το ευρύτερο εύρος της πηγής είναι 0,7 έως 3 mm.',
    ),
    processFact(
      'docking',
      'Docking',
      'Docking / τρύπημα',
      'Fork or docker docking keeps the sheet flat; puffy variants may use partial docking.',
      'Τρύπημα με πιρούνι ή docker για επίπεδο φύλλο· οι puffy παραλλαγές μπορεί να έχουν μερικό docking.',
    ),
    processFact(
      'baking-surface',
      'Baking surface',
      'Επιφάνεια ψησίματος',
      'Baking sheet.',
      'Λαμαρίνα.',
    ),
  ]),
  processSection('thermal', 'Thermal process', 'Θερμική διαδικασία', [
    processFact(
      'method',
      'Method',
      'Μέθοδος',
      'Preheated static oven.',
      'Προθερμασμένος στατικός φούρνος.',
    ),
    processFact(
      'temperature',
      'Temperature',
      'Θερμοκρασία',
      'About 180–190 °C.',
      'Περίπου 180–190 °C.',
    ),
    processFact(
      'duration',
      'Baking time',
      'Χρόνος ψησίματος',
      'About 10–15 minutes, followed by sufficient drying and cooling for a brittle texture.',
      'Περίπου 10–15 λεπτά, με επαρκές στέγνωμα και κρύωμα για εύθραυστη υφή.',
    ),
  ]),
];

function batterProcessProfile(options: {
  method: string;
  methodEl: string;
  shape: string;
  shapeEl: string;
  leavening: string;
  leaveningEl: string;
  thermal: string;
  thermalEl: string;
  note?: string;
  noteEl?: string;
}): readonly PrototypeProcessProfileSection[] {
  return [
    processSection('mixing', 'Mixing and development', 'Ανάμειξη και ανάπτυξη', [
      processFact('method', 'Method', 'Μέθοδος', options.method, options.methodEl),
      processFact('development', 'Development target', 'Στόχος ανάπτυξης', 'Combine only as much as the target structure requires; avoid unnecessary gluten development.', 'Ανάμειξε μόνο όσο χρειάζεται η επιδιωκόμενη δομή· απόφυγε την περιττή ανάπτυξη γλουτένης.'),
      processFact('addition-order', 'Addition order', 'Σειρά προσθήκης', 'Dry/base components → liquid and egg → fat and inclusions according to the formula.', 'Στερεά/βάση → υγρά και αυγό → λίπος και προσθήκες σύμφωνα με τη φόρμουλα.'),
    ]),
    processSection('aeration', 'Aeration', 'Αερισμός', [
      processFact('leavening', 'Leavening mechanism', 'Μηχανισμός διόγκωσης', options.leavening, options.leaveningEl),
    ]),
    processSection('fermentation', 'Fermentation', 'Ζύμωση', [
      processFact('agent', 'Fermentation status', 'Κατάσταση ζύμωσης', options.leavening.includes('biological') ? 'Fermentation is part of the identity.' : 'No fermentation is required unless the reference variant says otherwise.', options.leavening.includes('biological') ? 'Η ζύμωση αποτελεί μέρος της ταυτότητας.' : 'Δεν απαιτείται ζύμωση εκτός αν το δηλώνει η παραλλαγή αναφοράς.'),
    ]),
    processSection('geometry', 'Geometry and shaping', 'Γεωμετρία και σχηματισμός', [
      processFact('shape', 'Characteristic shape', 'Χαρακτηριστικό σχήμα', options.shape, options.shapeEl),
      ...(options.note && options.noteEl ? [processFact('boundary', 'Process note', 'Σημείωση διαδικασίας', options.note, options.noteEl)] : []),
    ]),
    processSection('thermal', 'Thermal process', 'Θερμική διαδικασία', [
      processFact('method', 'Method', 'Μέθοδος', options.thermal, options.thermalEl),
      processFact('equipment', 'Equipment role', 'Ρόλος εξοπλισμού', 'The thermal regime is part of the family identity, not only a finishing step.', 'Η θερμική διαδικασία αποτελεί μέρος της ταυτότητας της οικογένειας και όχι απλώς τελικό βήμα.'),
    ]),
  ];
}

const DEFINITIONS: readonly PrototypeDefinition[] = [
  ...STRUCTURAL_FAMILY_NODES.map(taxonomyFamilyDefinition),
  definition({
    id: 'prototype.lean-bread',
    kind: 'prototype',
    en: 'Lean bread dough',
    el: 'Λιτή ζύμη ψωμιού',
    parentIds: ['family.fermented-gluten.lean-bread'],
    familyIds: ['family.fermented-gluten.lean-bread'],
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
    id: 'prototype.breadsticks',
    kind: 'prototype',
    en: 'Breadsticks / grissini',
    el: 'Κριτσίνια',
    parentIds: ['family.fermented-gluten'],
    familyIds: ['family.fermented-gluten'],
    structuralFeatures: [
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', bandRange('medium', 'very_high'), 'critical'),
      feature('relative_hydration', 'Relative hydration', 'Σχετική ενυδάτωση', bandRange('low', 'medium'), 'high'),
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('very_low', 'medium'), 'high'),
      feature('sugar_load', 'Sugar load', 'Φορτίο ζάχαρης', bandRange('very_low', 'low'), 'medium'),
      feature('shape_class', 'Stick geometry', 'Γεωμετρία μπαστουνιού', compatibility('breadstick'), 'high'),
    ],
    structuralConstraints: [
      feature('fermentation_agent', 'Fermentation agent', 'Παράγοντας ζύμωσης', compatibility('commercial_yeast', 'mixed'), 'high'),
      feature('mixing_method', 'Mixing method', 'Μέθοδος ανάμειξης', compatibility('hand_knead', 'minimal_combine'), 'high'),
      feature('mixing_target', 'Dough development target', 'Στόχος ανάπτυξης ζύμης', compatibility('partial', 'minimal'), 'high'),
      feature('aeration_method', 'Aeration method', 'Μέθοδος αερισμού', compatibility('none'), 'medium'),
      feature('lamination', 'Lamination', 'Φυλλοποίηση', presence('absent'), 'high'),
      feature('thermal_method', 'Thermal method', 'Θερμική μέθοδος', compatibility('static_oven'), 'high'),
      feature('surface_treatment', 'Surface treatment', 'Επιφανειακή εφαρμογή', compatibility('none'), 'medium'),
      feature('container_type', 'Baking surface', 'Επιφάνεια ψησίματος', compatibility('baking_sheet'), 'medium'),
    ],
    processProfile: BREADSTICK_PROCESS_PROFILE,
    noteEn: 'An initial breadstick prototype for thin, dried or crisp gluten doughs. The linked formulas are working reference variants, not a single universal recipe.',
    noteEl: 'Αρχικό prototype για λεπτές, ξηρές ή τραγανές ζύμες γλουτένης. Οι συνδεδεμένες φόρμουλες είναι παραλλαγές αναφοράς και όχι μία καθολική συνταγή.',
    provenanceSourceId: 'exploration/recepies/kritsinia.txt',
    provenanceSourceVersion: 'first-party-v1',
  }),
  definition({
    id: 'prototype.crackers',
    kind: 'prototype',
    en: 'Crackers',
    el: 'Κράκερ',
    parentIds: ['family.short-fat-shortened'],
    familyIds: ['family.short-fat-shortened'],
    structuralFeatures: [
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', bandRange('very_low', 'high'), 'critical'),
      feature('relative_hydration', 'Relative hydration', 'Σχετική ενυδάτωση', bandRange('low', 'medium'), 'high'),
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('very_low', 'very_high'), 'high'),
      feature('sugar_load', 'Sugar load', 'Φορτίο ζάχαρης', bandRange('very_low', 'low'), 'medium'),
      feature('fluidity', 'Fluidity', 'Ρευστότητα', bandRange('very_low', 'medium'), 'high'),
      feature('shape_class', 'Sheet geometry', 'Γεωμετρία φύλλου', compatibility('thin_sheet', 'cookie'), 'critical'),
    ],
    structuralConstraints: [
      feature('fermentation', 'Fermentation', 'Ζύμωση', presence('absent'), 'critical'),
      feature('mixing_method', 'Mixing method', 'Μέθοδος ανάμειξης', compatibility('minimal_combine'), 'high'),
      feature('mixing_target', 'Dough development target', 'Στόχος ανάπτυξης ζύμης', compatibility('minimal'), 'high'),
      feature('aeration_method', 'Aeration method', 'Μέθοδος αερισμού', compatibility('none'), 'medium'),
      feature('thermal_method', 'Thermal method', 'Θερμική μέθοδος', compatibility('static_oven'), 'high'),
      feature('container_type', 'Baking surface', 'Επιφάνεια ψησίματος', compatibility('baking_sheet'), 'medium'),
    ],
    processProfile: CRACKER_PROCESS_PROFILE,
    noteEn: 'A cracker prototype spanning lean, crisp, flaky, rich, seeded, wholegrain, rye, and savoury-biscuit-border reference variants. The linked formulas are working expert seeds, not a single universal recipe.',
    noteEl: 'Prototype για κράκερ που καλύπτει άλιπες, τραγανές, φυλλώδεις, πλούσιες, πολύσπορες, ολικής, σίκαλης και savoury-biscuit-border παραλλαγές. Οι συνδεδεμένες φόρμουλες είναι working expert seeds και όχι μία καθολική συνταγή.',
    provenanceSourceId: 'exploration/recepies/craker.txt',
    provenanceSourceVersion: 'first-party-v1',
  }),
  definition({
    id: 'prototype.brioche',
    kind: 'prototype',
    en: 'Brioche',
    el: 'Brioche',
    parentIds: ['family.fermented-gluten.rich-enriched'],
    familyIds: ['family.fermented-gluten.rich-enriched'],
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
    parentIds: ['family.short-fat-shortened.shortbread'],
    familyIds: ['family.short-fat-shortened.shortbread'],
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
    parentIds: ['family.batters.griddle'],
    familyIds: ['family.batters.griddle'],
    structuralFeatures: [
      feature('fluidity', 'Fluidity', 'Ρευστότητα', bandRange('medium', 'very_high'), 'critical'),
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', band('low'), 'high'),
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('low', 'medium'), 'medium'),
      feature('sugar_load', 'Sugar load', 'Φορτίο ζάχαρης', bandRange('low', 'medium'), 'low'),
      feature('thermal_geometry', 'Pan or griddle geometry', 'Γεωμετρία τηγανιού ή πλάκας', compatibility('pan', 'griddle'), 'critical'),
    ],
    structuralConstraints: [
      feature('chemical_leavening', 'Chemical leavening', 'Χημικό διογκωτικό', presence('present'), 'critical'),
      feature('batter_consistency', 'Batter consistency', 'Συνεκτικότητα μείγματος', compatibility('thick_batter', 'thin_pourable_batter'), 'critical'),
    ],
    processProfile: batterProcessProfile({
      method: 'Whisk dry and wet components separately, then combine briefly.',
      methodEl: 'Ανάμειξε χωριστά τα στερεά και τα υγρά και ένωσέ τα σύντομα.',
      shape: 'Round pour on a griddle or pan.',
      shapeEl: 'Στρογγυλή δόση που χύνεται σε πλάκα ή τηγάνι.',
      leavening: 'Chemical gas with starch and egg setting.',
      leaveningEl: 'Χημικό αέριο με πήξη από άμυλο και αυγό.',
      thermal: 'Griddle or pan with controlled surface setting.',
      thermalEl: 'Πλάκα ή τηγάνι με ελεγχόμενη πήξη της επιφάνειας.',
    }),
  }),
  definition({
    id: 'prototype.crepe',
    kind: 'prototype',
    en: 'Crêpe',
    el: 'Κρέπα',
    parentIds: ['family.batters.thin-pan'],
    familyIds: ['family.batters.thin-pan'],
    structuralFeatures: [
      feature('fluidity', 'Fluidity', 'Ρευστότητα', band('very_high'), 'critical'),
      feature('egg_solids', 'Egg solids', 'Στερεά αυγού', bandRange('medium', 'very_high'), 'high'),
      feature('thermal_geometry', 'Very thin geometry', 'Πολύ λεπτή γεωμετρία', compatibility('thin_sheet', 'pan'), 'critical'),
    ],
    structuralConstraints: [
      feature('chemical_leavening', 'Chemical leavening', 'Χημικό διογκωτικό', presence('none_or_low'), 'critical'),
      feature('effective_gluten', 'Effective gluten', 'Αποτελεσματική γλουτένη', band('low'), 'high'),
    ],
    processProfile: batterProcessProfile({
      method: 'Whisk to a smooth, very fluid batter; rest if needed for hydration.',
      methodEl: 'Χτύπησε μέχρι να γίνει λείο, πολύ ρευστό μείγμα· άφησέ το να ξεκουραστεί αν χρειάζεται για ενυδάτωση.',
      shape: 'Very thin flexible sheet.',
      shapeEl: 'Πολύ λεπτό, εύκαμπτο φύλλο.',
      leavening: 'No meaningful chemical leavening; egg and starch set the sheet.',
      leaveningEl: 'Χωρίς ουσιαστικό χημικό διογκωτικό· το αυγό και το άμυλο στερεώνουν το φύλλο.',
      thermal: 'Pan: fast spread and fast setting.',
      thermalEl: 'Τηγάνι: γρήγορο άπλωμα και γρήγορη πήξη.',
    }),
  }),
  definition({
    id: 'prototype.waffle',
    kind: 'prototype',
    en: 'Waffle',
    el: 'Waffle',
    parentIds: ['family.batters.waffle'],
    familyIds: ['family.batters.waffle'],
    structuralFeatures: [
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('low', 'very_high'), 'critical'),
      feature('thermal_geometry', 'Waffle iron geometry', 'Γεωμετρία waffle iron', compatibility('waffle'), 'critical'),
    ],
    structuralConstraints: [
      feature('thermal_method', 'Thermal method', 'Θερμική μέθοδος', compatibility('waffle_iron'), 'critical'),
      feature('shape_class', 'Shape', 'Σχήμα', compatibility('waffle'), 'critical'),
    ],
    processProfile: batterProcessProfile({
      method: 'Combine a pourable batter; split-egg foam is an optional variant.',
      methodEl: 'Ένωσε ένα ρευστό μείγμα· ο αφρός από χωρισμένα αυγά είναι προαιρετική παραλλαγή.',
      shape: 'Grid-formed waffle with a high surface-to-volume ratio.',
      shapeEl: 'Waffle με κυψελωτό σχήμα και υψηλή σχέση επιφάνειας προς όγκο.',
      leavening: 'Chemical lift; some variants add egg foam or biological fermentation.',
      leaveningEl: 'Χημική διόγκωση· ορισμένες παραλλαγές προσθέτουν αφρό αυγού ή βιολογική ζύμωση.',
      thermal: 'Waffle iron: intense contact heating and surface dehydration.',
      thermalEl: 'Waffle iron: έντονη επαφή με θερμό μέταλλο και επιφανειακή αφυδάτωση.',
      note: 'More fat and optional starch substitution move the texture toward a crisp shell.',
      noteEl: 'Περισσότερο λίπος και προαιρετική αντικατάσταση με άμυλο οδηγούν σε πιο τραγανό κέλυφος.',
    }),
  }),
  definition({
    id: 'prototype.steam-puffed',
    kind: 'prototype',
    en: 'Steam-puffed baked batter',
    el: 'Μείγμα φούρνου με διόγκωση ατμού',
    parentIds: ['family.batters.steam-puffed'],
    familyIds: ['family.batters.steam-puffed'],
    structuralFeatures: [
      feature('egg_solids', 'Egg solids', 'Στερεά αυγού', bandRange('high', 'very_high'), 'critical'),
      feature('available_water', 'Available water', 'Διαθέσιμο νερό', bandRange('high', 'very_high'), 'high'),
      feature('thermal_geometry', 'Steam geometry', 'Γεωμετρία ατμού', compatibility('oven'), 'critical'),
    ],
    structuralConstraints: [
      feature('steam_leavening', 'Steam leavening', 'Διόγκωση με ατμό', presence('required'), 'critical'),
      feature('chemical_leavening', 'Chemical leavening', 'Χημική διόγκωση', presence('none_or_low'), 'high'),
    ],
    processProfile: batterProcessProfile({
      method: 'Whisk a very fluid egg-rich batter without relying on chemical gas.',
      methodEl: 'Χτύπησε ένα πολύ ρευστό μείγμα πλούσιο σε αυγό χωρίς να βασιστείς σε χημικό αέριο.',
      shape: 'Dutch baby, Yorkshire pudding, or popover geometry.',
      shapeEl: 'Γεωμετρία Dutch baby, Yorkshire pudding ή popover.',
      leavening: 'Steam expansion followed by rapid egg and starch setting.',
      leaveningEl: 'Διόγκωση από ατμό και μετά γρήγορη πήξη αυγού και αμύλου.',
      thermal: 'Very hot preheated oven and vessel; depth controls steam retention.',
      thermalEl: 'Πολύ ζεστός προθερμασμένος φούρνος και σκεύος· το βάθος ελέγχει την παγίδευση ατμού.',
    }),
  }),
  definition({
    id: 'prototype.custard-like',
    kind: 'prototype',
    en: 'Custard-like baked batter',
    el: 'Μείγμα φούρνου τύπου custard',
    parentIds: ['family.batters.custard-like'],
    familyIds: ['family.batters.custard-like'],
    structuralFeatures: [
      feature('egg_solids', 'Egg solids', 'Στερεά αυγού', bandRange('high', 'very_high'), 'critical'),
      feature('thermal_geometry', 'Custard geometry', 'Γεωμετρία custard', compatibility('oven'), 'critical'),
    ],
    structuralConstraints: [
      feature('chemical_leavening', 'Chemical leavening', 'Χημική διόγκωση', presence('none_or_low'), 'high'),
      feature('thermal_method', 'Thermal method', 'Θερμική μέθοδος', compatibility('static_oven', 'fan_oven'), 'high'),
    ],
    processProfile: batterProcessProfile({
      method: 'Combine egg, liquid, flour/starch, and sugar without developing a strong gluten network.',
      methodEl: 'Ένωσε αυγό, υγρό, αλεύρι/άμυλο και ζάχαρη χωρίς να αναπτύξεις ισχυρό δίκτυο γλουτένης.',
      shape: 'Soft set baked custard-batter body, often with fruit.',
      shapeEl: 'Μαλακό, ψημένο σώμα τύπου custard, συχνά με φρούτο.',
      leavening: 'Egg coagulation and starch setting; steam may contribute.',
      leaveningEl: 'Πήξη αυγού και αμύλου· μπορεί να συμβάλλει και ο ατμός.',
      thermal: 'Oven setting with a controlled, gentle finish.',
      thermalEl: 'Πήξη στον φούρνο με ελεγχόμενο, ήπιο τελείωμα.',
    }),
  }),
  definition({
    id: 'prototype.coating',
    kind: 'prototype',
    en: 'Coating batter',
    el: 'Μείγμα επικάλυψης',
    parentIds: ['family.batters.coating'],
    familyIds: ['family.batters.coating'],
    structuralFeatures: [
      feature('fluidity', 'Fluidity', 'Ρευστότητα', bandRange('high', 'very_high'), 'critical'),
      feature('thermal_geometry', 'Coating geometry', 'Γεωμετρία επικάλυψης', compatibility('deep_fry'), 'critical'),
    ],
    structuralConstraints: [
      feature('thermal_method', 'Thermal method', 'Θερμική μέθοδος', compatibility('deep_fry'), 'critical'),
      feature('suppressed_gluten', 'Suppressed gluten', 'Περιορισμένη γλουτένη', presence('required'), 'critical'),
    ],
    processProfile: batterProcessProfile({
      method: 'Mix cold liquid with dry components briefly; keep gluten development low.',
      methodEl: 'Ένωσε κρύο υγρό με τα στερεά για λίγο· κράτησε χαμηλή την ανάπτυξη γλουτένης.',
      shape: 'Thin or thick shell around an external food item.',
      shapeEl: 'Λεπτό ή παχύ κέλυφος γύρω από εξωτερικό τρόφιμο.',
      leavening: 'Steam from the liquid; beer or chemical gas may add aeration.',
      leaveningEl: 'Ατμός από το υγρό· η μπύρα ή χημικό αέριο μπορεί να προσθέσει αερισμό.',
      thermal: 'Deep fry: rapid surface dehydration and crust setting.',
      thermalEl: 'Βαθύ τηγάνισμα: γρήγορη επιφανειακή αφυδάτωση και πήξη κρούστας.',
    }),
  }),
  definition({
    id: 'prototype.fritter',
    kind: 'prototype',
    en: 'Fritter batter',
    el: 'Μείγμα για fritter',
    parentIds: ['family.batters.fritter'],
    familyIds: ['family.batters.fritter'],
    structuralFeatures: [
      feature('fluidity', 'Fluidity', 'Ρευστότητα', bandRange('low', 'very_high'), 'critical'),
      feature('thermal_geometry', 'Fritter geometry', 'Γεωμετρία fritter', compatibility('shallow_fry', 'deep_fry'), 'critical'),
    ],
    structuralConstraints: [feature('thermal_method', 'Frying method', 'Μέθοδος τηγανίσματος', compatibility('shallow_fry', 'deep_fry'), 'critical')],
    processProfile: batterProcessProfile({
      method: 'Build a thicker matrix that suspends internal vegetable, corn, or fruit inclusions.',
      methodEl: 'Φτιάξε πιο παχύ matrix που συγκρατεί εσωτερικές προσθήκες λαχανικών, καλαμποκιού ή φρούτων.',
      shape: 'Portioned standalone body rather than an external coating.',
      shapeEl: 'Αυτοτελές portioned σώμα και όχι εξωτερική επικάλυψη.',
      leavening: 'Low to medium chemical lift or none, depending on the variant.',
      leaveningEl: 'Χαμηλή έως μέτρια χημική διόγκωση ή καθόλου, ανάλογα με την παραλλαγή.',
      thermal: 'Shallow or deep fry; the cooking medium sets the matrix and crisp exterior.',
      thermalEl: 'Ρηχό ή βαθύ τηγάνισμα· το μέσο μαγειρέματος στερεώνει το matrix και την τραγανή επιφάνεια.',
      note: 'The functional boundary is inclusion inside the batter, not merely coating the food.',
      noteEl: 'Το λειτουργικό όριο είναι η προσθήκη μέσα στο batter και όχι απλώς η επικάλυψη του τροφίμου.',
    }),
  }),
  definition({
    id: 'prototype.fermented-batter',
    kind: 'prototype',
    en: 'Fermented batter',
    el: 'Μείγμα με ζύμωση',
    parentIds: ['family.batters.fermented'],
    familyIds: ['family.batters.fermented'],
    structuralFeatures: [feature('thermal_geometry', 'Fermented griddle geometry', 'Γεωμετρία ζυμωμένης πλάκας', compatibility('griddle', 'pan', 'thin_sheet'), 'high')],
    structuralConstraints: [
      feature('fermentation', 'Fermentation', 'Ζύμωση', presence('present'), 'critical'),
      feature('fermentation_agent', 'Fermentation agent', 'Παράγοντας ζύμωσης', compatibility('commercial_yeast', 'sourdough', 'mixed'), 'critical'),
    ],
    processProfile: batterProcessProfile({
      method: 'Mix the batter, then allow the biological culture to acidify and aerate it before cooking.',
      methodEl: 'Ανάμειξε το batter και άφησε τη βιολογική καλλιέργεια να το οξινίσει και να το αερίσει πριν το μαγείρεμα.',
      shape: 'Pourable fermented pancake, blini, or flat sheet.',
      shapeEl: 'Ρευστό fermented pancake, blini ή επίπεδο φύλλο.',
      leavening: 'Biological leavening; sourdough may also alter pH and starch behaviour.',
      leaveningEl: 'Βιολογική διόγκωση· το προζύμι αλλάζει επίσης pH και τη συμπεριφορά του αμύλου.',
      thermal: 'Griddle or pan after fermentation.',
      thermalEl: 'Πλάκα ή τηγάνι μετά τη ζύμωση.',
    }),
  }),
  definition({
    id: 'prototype.foam-leavened',
    kind: 'prototype',
    en: 'Foam-leavened batter',
    el: 'Μείγμα με διόγκωση από αφρό',
    parentIds: ['family.batters.foam-leavened'],
    familyIds: ['family.batters.foam-leavened'],
    structuralFeatures: [
      feature('egg_protein', 'Egg protein', 'Πρωτεΐνη αυγού', bandRange('medium', 'very_high'), 'critical'),
      feature('thermal_geometry', 'Foam-set geometry', 'Γεωμετρία που στηρίζεται από αφρό', compatibility('griddle', 'waffle', 'oven'), 'critical'),
    ],
    structuralConstraints: [
      feature('mechanical_aeration', 'Mechanical aeration', 'Μηχανικός αερισμός', presence('required'), 'critical'),
      feature('egg_white_foam', 'Egg-white foam', 'Αφρός ασπραδιού', presence('required'), 'high'),
    ],
    processProfile: batterProcessProfile({
      method: 'Whip egg whites or whole eggs, then fold gently into the base batter.',
      methodEl: 'Χτύπησε ασπράδια ή ολόκληρα αυγά και δίπλωσέ τα απαλά στο βασικό batter.',
      shape: 'Airy soufflé pancake, foam waffle, or sponge-adjacent form.',
      shapeEl: 'Αέρινο soufflé pancake, foam waffle ή μορφή στα όρια προς sponge.',
      leavening: 'Mechanical egg foam, optionally combined with chemical leavening.',
      leaveningEl: 'Μηχανικός αφρός αυγού, προαιρετικά μαζί με χημικό διογκωτικό.',
      thermal: 'Gentle griddle/covered-pan or waffle-iron setting to preserve the foam.',
      thermalEl: 'Ήπια πήξη σε πλάκα/σκεπαστό τηγάνι ή waffle iron ώστε να διατηρηθεί ο αφρός.',
    }),
  }),
  definition({
    id: 'prototype.cake-adjacent',
    kind: 'prototype',
    en: 'Cake-adjacent batter',
    el: 'Μείγμα στα όρια προς cake',
    parentIds: ['family.batters.cake-adjacent'],
    familyIds: ['family.batters.cake-adjacent'],
    structuralFeatures: [
      feature('fat_load', 'Fat load', 'Φορτίο λίπους', bandRange('high', 'very_high'), 'critical'),
      feature('sugar_load', 'Sugar load', 'Φορτίο ζάχαρης', bandRange('high', 'very_high'), 'critical'),
      feature('thermal_geometry', 'Cake geometry', 'Γεωμετρία cake', compatibility('oven'), 'critical'),
    ],
    structuralConstraints: [
      feature('thermal_method', 'Thermal method', 'Θερμική μέθοδος', compatibility('static_oven', 'fan_oven'), 'critical'),
      feature('setting_capacity', 'Setting capacity', 'Ικανότητα στησίματος', bandRange('medium', 'high'), 'high'),
    ],
    processProfile: batterProcessProfile({
      method: 'Emulsify or cream the fat and sugar when the formulation calls for a cake-like crumb; avoid overmixing after flour.',
      methodEl: 'Γαλακτωματοποίησε ή κρεμοποίησε λίπος και ζάχαρη όταν ζητείται ψίχα τύπου cake· απόφυγε την υπερανάμειξη μετά το αλεύρι.',
      shape: 'Pour cake, muffin, or quick-bread boundary form.',
      shapeEl: 'Μορφή pour cake, muffin ή quick-bread boundary.',
      leavening: 'Chemical leavening and/or foam, with sugar and fat contributing to structure and tenderness.',
      leaveningEl: 'Χημική διόγκωση και/ή αφρός, με τη ζάχαρη και το λίπος να συμβάλλουν στη δομή και την τρυφερότητα.',
      thermal: 'Oven baking until starch and egg/protein structure set.',
      thermalEl: 'Ψήσιμο στον φούρνο μέχρι να σταθεροποιηθούν το άμυλο και οι πρωτεΐνες.',
    }),
  }),
  definition({
    id: 'prototype.angel-food',
    kind: 'prototype',
    en: 'Angel food cake',
    el: 'Angel food cake',
    parentIds: ['family.foam-cake.egg-white'],
    familyIds: ['family.foam-cake.egg-white'],
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
    parentIds: ['family.steam-paste.choux'],
    familyIds: ['family.steam-paste.choux'],
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
    parentIds: ['family.laminated-gluten.fermented'],
    familyIds: ['family.laminated-gluten.fermented'],
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
