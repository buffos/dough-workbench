/**
 * Explicit links between published reference formulas and the prototype they
 * help describe. A reference formula remains its own editable starting point.
 */
export const REFERENCE_PROTOTYPE_ASSIGNMENTS_VERSION = 'breadsticks-crackers-batters-prototypes-v4';

const BATTER_PROTOTYPE_ASSIGNMENTS: Readonly<Record<string, string>> = Object.fromEntries([
  ...['batter-crepe-canonical', 'batter-crepe-delicate', 'batter-crepe-elastic', 'batter-crepe-tender', 'batter-crepe-savoury']
    .map((key) => [key, 'prototype.crepe']),
  ...['batter-pancake-canonical', 'batter-buttermilk-canonical', 'batter-pancake-fluffy', 'batter-pancake-diner', 'batter-pancake-tender', 'batter-pancake-cakey', 'batter-pancake-chewy', 'batter-pancake-chocolate', 'batter-pancake-banana']
    .map((key) => [key, 'prototype.pancake']),
  ...['batter-waffle-canonical', 'batter-waffle-crisp', 'batter-waffle-starch-heavy', 'batter-waffle-softer', 'batter-waffle-belgian', 'batter-waffle-cheese-herb']
    .map((key) => [key, 'prototype.waffle']),
  ...['batter-dutch-baby-canonical', 'batter-dutch-baby-more-egg', 'batter-dutch-baby-more-liquid']
    .map((key) => [key, 'prototype.steam-puffed']),
  ...['batter-tempura-canonical', 'batter-tempura-light-brittle', 'batter-tempura-thick', 'batter-tempura-extra-crisp', 'batter-beer-canonical', 'batter-beer-thin', 'batter-beer-thick']
    .map((key) => [key, 'prototype.coating']),
  ['batter-cake-pour-canonical', 'prototype.cake-adjacent'],
  ['batter-clafoutis-seed', 'prototype.custard-like'],
  ['batter-vegetable-fritter-seed', 'prototype.fritter'],
  ['batter-sourdough-pancake-seed', 'prototype.fermented-batter'],
  ['batter-souffle-pancake-seed', 'prototype.foam-leavened'],
]);

export const REFERENCE_PROTOTYPE_ASSIGNMENTS: Readonly<Record<string, string>> = {
  breadsticks: 'prototype.breadsticks',
  'breadsticks-torinese': 'prototype.breadsticks',
  'breadsticks-greek-style': 'prototype.breadsticks',
  // This variant is structurally a short, cracker-like dough rather than a
  // fermented breadstick. The validator intentionally keeps that boundary
  // visible instead of forcing it into the breadsticks prototype.
  'breadsticks-biscuit-style': 'prototype.crackers',
  'breadsticks-airy': 'prototype.breadsticks',
  'breadsticks-semolina': 'prototype.breadsticks',
  'breadsticks-whole-wheat': 'prototype.breadsticks',
  'breadsticks-seeded': 'prototype.breadsticks',
  'breadsticks-cheese': 'prototype.breadsticks',
  'breadsticks-sourdough': 'prototype.breadsticks',
  'cracker-dough': 'prototype.crackers',
  'cracker-lean-hard': 'prototype.crackers',
  'cracker-extra-crisp': 'prototype.crackers',
  'cracker-richer-short': 'prototype.crackers',
  'cracker-flaky': 'prototype.crackers',
  'cracker-puffy': 'prototype.crackers',
  'cracker-cheese': 'prototype.crackers',
  'cracker-seed': 'prototype.crackers',
  'cracker-olive-herb': 'prototype.crackers',
  'cracker-wholegrain': 'prototype.crackers',
  'cracker-rye': 'prototype.crackers',
  'cracker-spiced': 'prototype.crackers',
  ...BATTER_PROTOTYPE_ASSIGNMENTS,
};
