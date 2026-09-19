/**
 * Structured facets for the first-party grissini reference set.
 *
 * These are browsing metadata, not claims about a finished bake. An omitted
 * facet remains unrecorded rather than being interpreted as absent.
 */
export const REFERENCE_MODIFIER_ASSIGNMENTS_VERSION = 'first-party-breadsticks-v1';

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
};
