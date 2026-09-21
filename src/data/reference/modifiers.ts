/**
 * Structured facets for the first-party grissini reference set.
 *
 * These are browsing metadata, not claims about a finished bake. An omitted
 * facet remains unrecorded rather than being interpreted as absent.
 */
export const REFERENCE_MODIFIER_ASSIGNMENTS_VERSION = 'first-party-breadsticks-crackers-batters-v3';

const batterModifiers = (options: {
  leavening: string;
  structure: string;
  enrichment: string;
  consistency: string;
  fat: string;
  special?: string;
}): readonly string[] => [
  `leavening.${options.leavening}`,
  `structural-system.${options.structure}`,
  `enrichment.${options.enrichment}`,
  `consistency.${options.consistency}`,
  `fat-handling.${options.fat}`,
  ...(options.special ? [`special-process.${options.special}`] : []),
];

const BATTER_MODIFIER_ASSIGNMENTS: Readonly<Record<string, readonly string[]>> = Object.fromEntries([
  ...['batter-crepe-canonical', 'batter-crepe-delicate', 'batter-crepe-elastic', 'batter-crepe-tender', 'batter-crepe-savoury']
    .map((key) => [key, batterModifiers({ leavening: 'none', structure: 'egg-protein-dominant', enrichment: 'lightly-enriched', consistency: 'thin-batter', fat: 'melted' })]),
  ...['batter-pancake-canonical', 'batter-pancake-fluffy', 'batter-pancake-diner', 'batter-pancake-tender', 'batter-pancake-cakey', 'batter-pancake-chewy']
    .map((key) => [key, batterModifiers({ leavening: 'chemical', structure: 'starch-dominant', enrichment: 'enriched', consistency: 'thick-batter', fat: 'melted', special: 'griddled' })]),
  ['batter-buttermilk-canonical', batterModifiers({ leavening: 'chemical', structure: 'starch-dominant', enrichment: 'enriched', consistency: 'thick-batter', fat: 'melted', special: 'griddled' })],
  ['batter-pancake-chocolate', batterModifiers({ leavening: 'chemical', structure: 'starch-dominant', enrichment: 'enriched', consistency: 'thick-batter', fat: 'melted', special: 'griddled' })],
  ['batter-pancake-banana', batterModifiers({ leavening: 'chemical', structure: 'starch-dominant', enrichment: 'enriched', consistency: 'thick-batter', fat: 'melted', special: 'griddled' })],
  ...['batter-waffle-canonical', 'batter-waffle-crisp', 'batter-waffle-starch-heavy', 'batter-waffle-softer', 'batter-waffle-cheese-herb']
    .map((key) => [key, batterModifiers({ leavening: 'chemical', structure: 'starch-dominant', enrichment: 'enriched', consistency: 'thick-batter', fat: 'melted' })]),
  ['batter-waffle-belgian', batterModifiers({ leavening: 'mechanical-foam', structure: 'foam-structured', enrichment: 'enriched', consistency: 'thick-batter', fat: 'melted', special: 'whipped-foam' })],
  ...['batter-dutch-baby-canonical', 'batter-dutch-baby-more-egg', 'batter-dutch-baby-more-liquid']
    .map((key) => [key, batterModifiers({ leavening: 'none', structure: 'egg-protein-dominant', enrichment: 'lightly-enriched', consistency: 'thin-batter', fat: 'melted' })]),
  ...['batter-tempura-canonical', 'batter-tempura-light-brittle', 'batter-tempura-thick', 'batter-tempura-extra-crisp']
    .map((key) => [key, batterModifiers({ leavening: 'none', structure: 'starch-dominant', enrichment: 'lean', consistency: 'thin-batter', fat: 'incorporated', special: 'fried' })]),
  ['batter-beer-canonical', batterModifiers({ leavening: 'chemical', structure: 'starch-dominant', enrichment: 'lean', consistency: 'thick-batter', fat: 'incorporated', special: 'fried' })],
  ['batter-beer-thin', batterModifiers({ leavening: 'chemical', structure: 'starch-dominant', enrichment: 'lean', consistency: 'thin-batter', fat: 'incorporated', special: 'fried' })],
  ['batter-beer-thick', batterModifiers({ leavening: 'chemical', structure: 'starch-dominant', enrichment: 'lean', consistency: 'thick-batter', fat: 'incorporated', special: 'fried' })],
  ['batter-cake-pour-canonical', batterModifiers({ leavening: 'chemical', structure: 'starch-dominant', enrichment: 'highly-enriched', consistency: 'thick-batter', fat: 'creamed' })],
  ['batter-clafoutis-seed', batterModifiers({ leavening: 'none', structure: 'egg-protein-dominant', enrichment: 'enriched', consistency: 'pourable-batter', fat: 'melted' })],
  ['batter-vegetable-fritter-seed', batterModifiers({ leavening: 'chemical', structure: 'starch-dominant', enrichment: 'lightly-enriched', consistency: 'thick-batter', fat: 'incorporated', special: 'fried' })],
  ['batter-sourdough-pancake-seed', batterModifiers({ leavening: 'sourdough-mixed', structure: 'starch-dominant', enrichment: 'lightly-enriched', consistency: 'thick-batter', fat: 'incorporated', special: 'fermented' })],
  ['batter-souffle-pancake-seed', batterModifiers({ leavening: 'mechanical-foam', structure: 'foam-structured', enrichment: 'enriched', consistency: 'thick-batter', fat: 'melted', special: 'whipped-foam' })],
]);

export const REFERENCE_MODIFIER_ASSIGNMENTS: Readonly<Record<string, readonly string[]>> = {
  breadsticks: [
    'leavening.yeast',
    'structural-system.gluten-dominant',
    'enrichment.lightly-enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
    'special-process.fermented',
  ],
  'breadsticks-torinese': [
    'leavening.yeast',
    'structural-system.gluten-dominant',
    'enrichment.lean',
    'consistency.very-stiff',
    'fat-handling.incorporated',
    'special-process.fermented',
  ],
  'breadsticks-greek-style': [
    'leavening.yeast',
    'structural-system.gluten-dominant',
    'enrichment.enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
    'special-process.fermented',
  ],
  'breadsticks-biscuit-style': [
    'leavening.chemical',
    'structural-system.fat-shortened',
    'enrichment.enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
  ],
  'breadsticks-airy': [
    'leavening.yeast',
    'structural-system.gluten-dominant',
    'enrichment.lightly-enriched',
    'consistency.soft-dough',
    'fat-handling.incorporated',
    'special-process.fermented',
  ],
  'breadsticks-semolina': [
    'leavening.yeast',
    'structural-system.gluten-dominant',
    'enrichment.lightly-enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
    'special-process.fermented',
  ],
  'breadsticks-whole-wheat': [
    'leavening.yeast',
    'structural-system.gluten-dominant',
    'enrichment.lightly-enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
    'special-process.fermented',
  ],
  'breadsticks-seeded': [
    'leavening.yeast',
    'structural-system.gluten-dominant',
    'enrichment.enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
    'special-process.fermented',
  ],
  'breadsticks-cheese': [
    'leavening.yeast',
    'structural-system.gluten-dominant',
    'enrichment.enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
    'special-process.fermented',
  ],
  'breadsticks-sourdough': [
    'leavening.sourdough-mixed',
    'structural-system.gluten-dominant',
    'enrichment.lightly-enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
    'special-process.fermented',
  ],
  'cracker-dough': [
    'leavening.chemical',
    'structural-system.fat-shortened',
    'enrichment.lightly-enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
  ],
  'cracker-lean-hard': [
    'leavening.chemical',
    'structural-system.fat-shortened',
    'enrichment.lean',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
  ],
  'cracker-extra-crisp': [
    'leavening.chemical',
    'structural-system.fat-shortened',
    'enrichment.lightly-enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
  ],
  'cracker-richer-short': [
    'leavening.chemical',
    'structural-system.fat-shortened',
    'enrichment.enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
  ],
  'cracker-flaky': [
    'leavening.chemical',
    'structural-system.fat-shortened',
    'structural-system.laminated',
    'enrichment.enriched',
    'consistency.stiff-dough',
    'fat-handling.laminated',
  ],
  'cracker-puffy': [
    'leavening.chemical',
    'structural-system.fat-shortened',
    'enrichment.enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
  ],
  'cracker-cheese': [
    'leavening.chemical',
    'structural-system.fat-shortened',
    'enrichment.enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
  ],
  'cracker-seed': [
    'leavening.chemical',
    'structural-system.fat-shortened',
    'enrichment.enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
  ],
  'cracker-olive-herb': [
    'leavening.chemical',
    'structural-system.fat-shortened',
    'enrichment.enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
  ],
  'cracker-wholegrain': [
    'leavening.chemical',
    'structural-system.fat-shortened',
    'enrichment.lightly-enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
  ],
  'cracker-rye': [
    'leavening.chemical',
    'structural-system.fat-shortened',
    'enrichment.lightly-enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
  ],
  'cracker-spiced': [
    'leavening.chemical',
    'structural-system.fat-shortened',
    'enrichment.lightly-enriched',
    'consistency.stiff-dough',
    'fat-handling.incorporated',
  ],
  ...BATTER_MODIFIER_ASSIGNMENTS,
};
