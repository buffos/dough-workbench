/**
 * Initial structured facet assignments for the published pilot references.
 *
 * These are catalog metadata used for browsing, not claims about calibrated
 * behavior. An axis omitted for a preparation is not recorded here; it is not
 * interpreted as the absence of that modifier.
 */
export const REFERENCE_MODIFIER_ASSIGNMENTS_VERSION = 'reference-modifier-seed-v1';

export const REFERENCE_MODIFIER_ASSIGNMENTS: Readonly<Record<string, readonly string[]>> = {
  'lean-white-loaf': [
    'leavening.yeast',
    'structural-system.gluten-dominant',
    'enrichment.lean',
    'consistency.soft-dough',
    'special-process.fermented',
  ],
  'country-loaf': [
    'leavening.yeast',
    'structural-system.gluten-dominant',
    'enrichment.lean',
    'consistency.soft-dough',
    'special-process.fermented',
  ],
  'sourdough-country-loaf': [
    'leavening.sourdough-mixed',
    'structural-system.gluten-dominant',
    'enrichment.lean',
    'consistency.wet-dough',
    'special-process.fermented',
  ],
  'sourdough-whole-wheat': [
    'leavening.sourdough-mixed',
    'structural-system.gluten-dominant',
    'enrichment.lean',
    'consistency.wet-dough',
    'special-process.fermented',
  ],
  brioche: [
    'leavening.yeast',
    'structural-system.gluten-dominant',
    'enrichment.highly-enriched',
    'consistency.soft-dough',
    'fat-handling.late-incorporated',
    'special-process.fermented',
  ],
  challah: [
    'leavening.yeast',
    'structural-system.gluten-dominant',
    'enrichment.enriched',
    'consistency.soft-dough',
    'fat-handling.incorporated',
    'special-process.fermented',
  ],
  'kouign-amann': [
    'leavening.yeast',
    'structural-system.laminated',
    'enrichment.highly-enriched',
    'consistency.stiff-dough',
    'fat-handling.laminated',
    'special-process.fermented',
  ],
  'puff-pastry': [
    'leavening.none',
    'structural-system.laminated',
    'enrichment.enriched',
    'consistency.stiff-dough',
    'fat-handling.laminated',
  ],
  'sourdough-pizza': [
    'leavening.sourdough-mixed',
    'structural-system.gluten-dominant',
    'enrichment.lean',
    'consistency.soft-dough',
    'special-process.fermented',
  ],
  'neapolitan-pizza': [
    'leavening.yeast',
    'structural-system.gluten-dominant',
    'enrichment.lean',
    'consistency.soft-dough',
    'special-process.fermented',
  ],
  'fresh-egg-pasta': [
    'leavening.none',
    'structural-system.gluten-dominant',
    'enrichment.lightly-enriched',
    'consistency.stiff-dough',
  ],
  tagliatelle: [
    'leavening.none',
    'structural-system.gluten-dominant',
    'enrichment.lightly-enriched',
    'consistency.stiff-dough',
  ],
  shortbread: [
    'leavening.none',
    'structural-system.fat-shortened',
    'enrichment.highly-enriched',
    'consistency.stiff-dough',
  ],
  'american-pie-dough': [
    'leavening.none',
    'structural-system.fat-shortened',
    'enrichment.enriched',
    'consistency.stiff-dough',
  ],
  'butter-cake': [
    'leavening.chemical',
    'enrichment.highly-enriched',
    'consistency.thick-batter',
    'special-process.whipped-foam',
  ],
  'pound-cake': [
    'leavening.mechanical-foam',
    'enrichment.highly-enriched',
    'consistency.thick-batter',
    'fat-handling.creamed',
    'special-process.whipped-foam',
  ],
  crepe: [
    'leavening.none',
    'enrichment.enriched',
    'consistency.thin-batter',
    'special-process.griddled',
  ],
  'american-pancake': [
    'leavening.chemical',
    'enrichment.lightly-enriched',
    'consistency.pourable-batter',
    'special-process.griddled',
  ],
  churros: [
    'leavening.steam',
    'structural-system.starch-dominant',
    'enrichment.enriched',
    'consistency.paste',
    'special-process.fried',
  ],
  beignet: [
    'leavening.yeast',
    'structural-system.gluten-dominant',
    'enrichment.enriched',
    'consistency.soft-dough',
    'special-process.fermented',
    'special-process.fried',
  ],
  'gluten-free-sandwich-loaf': [
    'leavening.yeast',
    'structural-system.starch-dominant',
    'enrichment.enriched',
    'consistency.wet-dough',
    'special-process.fermented',
  ],
  'gluten-free-pancake': [
    'leavening.chemical',
    'structural-system.starch-dominant',
    'enrichment.lightly-enriched',
    'consistency.thick-batter',
    'special-process.griddled',
  ],
};
