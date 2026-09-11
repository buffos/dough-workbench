/**
 * Canonical structural taxonomy for dough and batter systems.
 *
 * The primary family tree answers: "Which mechanism creates and stabilizes
 * the structure?"  The modifier axes describe orthogonal properties and must
 * not be promoted to competing product families.
 */

export interface StructuralLocalizedLabel {
  en: string;
  el: string;
}

export type StructuralFamilyId = string;

export interface StructuralFamilyNode {
  id: string;
  parentId: string | null;
  label: StructuralLocalizedLabel;
  description: StructuralLocalizedLabel;
}

export type StructuralModifierAxisId =
  | 'leavening'
  | 'structural-system'
  | 'enrichment'
  | 'consistency'
  | 'fat-handling'
  | 'special-process';

export interface StructuralModifierOption {
  id: string;
  label: StructuralLocalizedLabel;
}

export interface StructuralModifierAxis {
  id: StructuralModifierAxisId;
  label: StructuralLocalizedLabel;
  options: readonly StructuralModifierOption[];
}

const family = (
  id: string,
  parentId: string | null,
  en: string,
  el: string,
  descriptionEn = '',
  descriptionEl = '',
): StructuralFamilyNode => ({
  id,
  parentId,
  label: { en, el },
  description: { en: descriptionEn, el: descriptionEl },
});

export const STRUCTURAL_FAMILY_NODES: readonly StructuralFamilyNode[] = [
  family(
    'family.fermented-gluten',
    null,
    'Fermented gluten doughs',
    'Ζύμες γλουτένης με βιολογική ζύμωση',
    'Gluten network plus yeast, sourdough, or mixed fermentation creates and stabilizes the structure.',
    'Το δίκτυο γλουτένης μαζί με μαγιά, φυσικό προζύμι ή μικτή ζύμωση δημιουργεί και σταθεροποιεί τη δομή.',
  ),
  family('family.fermented-gluten.stiff', 'family.fermented-gluten', 'Stiff fermented doughs', 'Σφιχτές ζύμες με ζύμωση'),
  family('family.fermented-gluten.lean-bread', 'family.fermented-gluten', 'Lean bread doughs', 'Λιτές ζύμες ψωμιού'),
  family('family.fermented-gluten.high-hydration', 'family.fermented-gluten', 'High-hydration bread doughs', 'Ζύμες ψωμιού υψηλής ενυδάτωσης'),
  family('family.fermented-gluten.flat', 'family.fermented-gluten', 'Fermented flatbread doughs', 'Ζύμες επίπεδου ψωμιού με ζύμωση'),
  family('family.fermented-gluten.soft-enriched', 'family.fermented-gluten', 'Soft enriched doughs', 'Μαλακές εμπλουτισμένες ζύμες'),
  family('family.fermented-gluten.rich-enriched', 'family.fermented-gluten', 'Rich enriched doughs', 'Πλούσιες εμπλουτισμένες ζύμες'),

  family(
    'family.unleavened-gluten',
    null,
    'Unleavened gluten doughs',
    'Μη διογκούμενες ζύμες γλουτένης',
    'Gluten structure is important, without meaningful leavening.',
    'Η δομή της γλουτένης είναι σημαντική, χωρίς ουσιαστική διόγκωση.',
  ),
  family('family.unleavened-gluten.pasta-noodle', 'family.unleavened-gluten', 'Pasta and noodle doughs', 'Ζύμες για ζυμαρικά και noodles'),
  family('family.unleavened-gluten.wrapper-dumpling', 'family.unleavened-gluten', 'Wrapper and dumpling doughs', 'Ζύμες για φύλλα και dumplings'),
  family('family.unleavened-gluten.flatbread', 'family.unleavened-gluten', 'Unleavened flatbread doughs', 'Μη διογκούμενες επίπεδες ζύμες'),

  family(
    'family.laminated-gluten',
    null,
    'Laminated gluten doughs',
    'Φυλλωτές ζύμες γλουτένης',
    'Gluten network plus discrete fat layers; lamination is identity-defining.',
    'Δίκτυο γλουτένης μαζί με διακριτές στρώσεις λίπους· η φυλλοποίηση καθορίζει την ταυτότητα.',
  ),
  family('family.laminated-gluten.fermented', 'family.laminated-gluten', 'Fermented laminated doughs', 'Ζυμωμένες φυλλωτές ζύμες'),
  family('family.laminated-gluten.unfermented', 'family.laminated-gluten', 'Unfermented laminated doughs', 'Μη ζυμωμένες φυλλωτές ζύμες'),

  family(
    'family.short-fat-shortened',
    null,
    'Short / fat-shortened doughs',
    'Τριφτές ζύμες / ζύμες με περιορισμένη γλουτένη',
    'Fat and low effective hydration deliberately limit gluten development.',
    'Το λίπος και η χαμηλή αποτελεσματική ενυδάτωση περιορίζουν σκόπιμα την ανάπτυξη γλουτένης.',
  ),
  family('family.short-fat-shortened.basic-shortcrust', 'family.short-fat-shortened', 'Basic shortcrust', 'Βασική τριφτή ζύμη'),
  family('family.short-fat-shortened.sweet-shortcrust', 'family.short-fat-shortened', 'Sweet shortcrust', 'Γλυκιά τριφτή ζύμη'),
  family('family.short-fat-shortened.sandy-sable', 'family.short-fat-shortened', 'Sandy / sablé doughs', 'Αμμώδεις ζύμες τύπου sablé'),
  family('family.short-fat-shortened.shortbread', 'family.short-fat-shortened', 'Shortbread-type doughs', 'Ζύμες τύπου shortbread'),

  family(
    'family.cookie-biscuit',
    null,
    'Cookie and biscuit doughs',
    'Ζύμες για μπισκότα',
    'Low available water, sugar/fat load, limited gluten development, and spread/set matter most.',
    'Χαμηλό διαθέσιμο νερό, ζάχαρη/λίπος, περιορισμένη ανάπτυξη γλουτένης και η συμπεριφορά απλώματος ή πήξης είναι καθοριστικά.',
  ),
  family('family.cookie-biscuit.short', 'family.cookie-biscuit', 'Short cookies', 'Τριφτά μπισκότα'),
  family('family.cookie-biscuit.drop', 'family.cookie-biscuit', 'Drop cookies', 'Μπισκότα με κουτάλι'),
  family('family.cookie-biscuit.chewy', 'family.cookie-biscuit', 'Chewy cookies', 'Μαστιχωτά μπισκότα'),
  family('family.cookie-biscuit.crisp', 'family.cookie-biscuit', 'Crisp cookies', 'Τραγανά μπισκότα'),
  family('family.cookie-biscuit.cakey', 'family.cookie-biscuit', 'Cakey cookies', 'Μπισκότα με υφή κέικ'),
  family('family.cookie-biscuit.rolled-cut', 'family.cookie-biscuit', 'Rolled / cut cookies', 'Μπισκότα που ανοίγονται και κόβονται'),

  family(
    'family.chemical-cake',
    null,
    'Chemically leavened cake batters',
    'Μείγματα κέικ με χημική διόγκωση',
    'Starch gelatinization and egg/protein coagulation dominate rather than a gluten network.',
    'Η ζελατινοποίηση του αμύλου και η πήξη αυγών ή πρωτεϊνών κυριαρχούν αντί για το δίκτυο γλουτένης.',
  ),
  family('family.chemical-cake.butter', 'family.chemical-cake', 'Butter cakes', 'Κέικ με βούτυρο'),
  family('family.chemical-cake.oil', 'family.chemical-cake', 'Oil cakes', 'Κέικ με λάδι'),
  family('family.chemical-cake.high-ratio', 'family.chemical-cake', 'High-ratio cakes', 'Κέικ υψηλής αναλογίας'),

  family(
    'family.foam-cake',
    null,
    'Foam cake batters',
    'Μείγματα αφράτων κέικ',
    'Egg foam is a structural and leavening mechanism.',
    'Ο αφρός αυγού είναι μηχανισμός δομής και διόγκωσης.',
  ),
  family('family.foam-cake.whole-egg', 'family.foam-cake', 'Whole-egg foam cakes', 'Αφράτα κέικ με ολόκληρα αυγά'),
  family('family.foam-cake.egg-white', 'family.foam-cake', 'Egg-white foam cakes', 'Αφράτα κέικ με ασπράδια'),
  family('family.foam-cake.separated-egg', 'family.foam-cake', 'Separated-egg foam cakes', 'Αφράτα κέικ με χωριστά αυγά'),
  family('family.foam-cake.hybrid', 'family.foam-cake', 'Hybrid foam cakes', 'Υβριδικά αφρώδη κέικ'),

  family(
    'family.quick-bread',
    null,
    'Quick-bread systems',
    'Συστήματα γρήγορου ψωμιού',
    'Low-gluten-development chemically leavened systems with a minimal-mixing philosophy.',
    'Συστήματα με χημική διόγκωση και χαμηλή ανάπτυξη γλουτένης, όπου η ανάμειξη παραμένει περιορισμένη.',
  ),
  family('family.quick-bread.muffin', 'family.quick-bread', 'Muffin-type batters', 'Μείγματα τύπου muffin'),
  family('family.quick-bread.quick-loaf', 'family.quick-bread', 'Quick loaf batters', 'Μείγματα γρήγορου ψωμιού'),
  family('family.quick-bread.scone-biscuit', 'family.quick-bread', 'Scone / biscuit doughs', 'Ζύμες τύπου scone / biscuit'),

  family(
    'family.chemical-pourable',
    null,
    'Chemically leavened pourable batters',
    'Ρευστά μείγματα με χημική διόγκωση',
    'High fluidity and chemical leavening define the system.',
    'Η υψηλή ρευστότητα και η χημική διόγκωση καθορίζουν το σύστημα.',
  ),
  family('family.chemical-pourable.pancake', 'family.chemical-pourable', 'Pancake batters', 'Μείγματα pancake'),
  family('family.chemical-pourable.waffle', 'family.chemical-pourable', 'Waffle batters', 'Μείγματα waffle'),
  family('family.chemical-pourable.fritter-coating', 'family.chemical-pourable', 'Fritter / coating batters', 'Μείγματα για τηγανητές παρασκευές / επικάλυψη'),

  family(
    'family.unleavened-pourable',
    null,
    'Unleavened pourable batters',
    'Ρευστά μείγματα χωρίς ουσιαστική διόγκωση',
    'High fluidity with egg/starch setting and minimal gas generation.',
    'Υψηλή ρευστότητα, πήξη από αυγό ή άμυλο και ελάχιστη παραγωγή αερίου.',
  ),
  family('family.unleavened-pourable.crepe', 'family.unleavened-pourable', 'Crêpe-type batters', 'Μείγματα τύπου κρέπας'),

  family(
    'family.fermented-batter',
    null,
    'Fermented batters',
    'Μείγματα με ζύμωση',
    'Fermentation is important in a pourable or semi-liquid batter.',
    'Η ζύμωση είναι σημαντική σε ένα ρευστό ή ημίρρευστο μείγμα.',
  ),
  family('family.fermented-batter.yeast', 'family.fermented-batter', 'Yeast-fermented batters', 'Μείγματα με ζύμωση από μαγιά'),
  family('family.fermented-batter.lactic-mixed', 'family.fermented-batter', 'Lactic / mixed-fermented batters', 'Μείγματα με γαλακτική ή μικτή ζύμωση'),

  family(
    'family.steam-paste',
    null,
    'Steam-leavened pastes',
    'Πάστες που διογκώνονται με ατμό',
    'Pre-gelatinized starch, egg, and steam expansion create the structure.',
    'Προζελατινοποιημένο άμυλο, αυγό και διόγκωση με ατμό δημιουργούν τη δομή.',
  ),
  family('family.steam-paste.choux', 'family.steam-paste', 'Choux-type pastes', 'Πάστες τύπου choux'),

  family(
    'family.starch-dominant',
    null,
    'Starch-dominant doughs',
    'Ζύμες όπου κυριαρχεί το άμυλο',
    'Starch gelatinization, rather than gluten, supplies the main structural set.',
    'Η ζελατινοποίηση του αμύλου, και όχι η γλουτένη, παρέχει την κύρια δομή.',
  ),
  family('family.starch-dominant.potato', 'family.starch-dominant', 'Potato doughs', 'Ζύμες πατάτας'),
  family('family.starch-dominant.rice-starch', 'family.starch-dominant', 'Rice / starch doughs', 'Ζύμες ρυζιού / αμύλου'),
  family('family.starch-dominant.non-gluten-dumpling', 'family.starch-dominant', 'Non-gluten dumpling doughs', 'Dumplings χωρίς γλουτένη'),
];

export const STRUCTURAL_PRIMARY_FAMILY_IDS = STRUCTURAL_FAMILY_NODES
  .filter((node) => node.parentId === null)
  .map((node) => node.id);

export const STRUCTURAL_FAMILY_BY_ID: Readonly<Record<string, StructuralFamilyNode>> = Object.fromEntries(
  STRUCTURAL_FAMILY_NODES.map((node) => [node.id, node]),
);

export const STRUCTURAL_MODIFIER_AXES: readonly StructuralModifierAxis[] = [
  {
    id: 'leavening',
    label: { en: 'Leavening', el: 'Διόγκωση' },
    options: [
      { id: 'leavening.none', label: { en: 'None', el: 'Καμία' } },
      { id: 'leavening.yeast', label: { en: 'Yeast', el: 'Μαγιά' } },
      { id: 'leavening.sourdough-mixed', label: { en: 'Sourdough / mixed fermentation', el: 'Φυσικό προζύμι / μικτή ζύμωση' } },
      { id: 'leavening.chemical', label: { en: 'Chemical', el: 'Χημική' } },
      { id: 'leavening.mechanical-foam', label: { en: 'Mechanical foam', el: 'Μηχανικός αφρός' } },
      { id: 'leavening.steam', label: { en: 'Steam', el: 'Ατμός' } },
      { id: 'leavening.mixed', label: { en: 'Mixed', el: 'Μικτή' } },
    ],
  },
  {
    id: 'structural-system',
    label: { en: 'Structural system', el: 'Δομικό σύστημα' },
    options: [
      { id: 'structural-system.gluten-dominant', label: { en: 'Gluten-dominant', el: 'Κυριαρχεί η γλουτένη' } },
      { id: 'structural-system.starch-dominant', label: { en: 'Starch-dominant', el: 'Κυριαρχεί το άμυλο' } },
      { id: 'structural-system.egg-protein-dominant', label: { en: 'Egg-protein-dominant', el: 'Κυριαρχεί η πρωτεΐνη αυγού' } },
      { id: 'structural-system.fat-shortened', label: { en: 'Fat-shortened', el: 'Περιορισμένη δομή από λίπος' } },
      { id: 'structural-system.foam-structured', label: { en: 'Foam-structured', el: 'Δομή από αφρό' } },
      { id: 'structural-system.laminated', label: { en: 'Laminated', el: 'Φυλλοποιημένο' } },
      { id: 'structural-system.hydrocolloid-supported', label: { en: 'Hydrocolloid-supported', el: 'Υποστηριζόμενο από υδροκολλοειδή' } },
    ],
  },
  {
    id: 'enrichment',
    label: { en: 'Enrichment', el: 'Εμπλουτισμός' },
    options: [
      { id: 'enrichment.lean', label: { en: 'Lean', el: 'Λιτό' } },
      { id: 'enrichment.lightly-enriched', label: { en: 'Lightly enriched', el: 'Ελαφρά εμπλουτισμένο' } },
      { id: 'enrichment.enriched', label: { en: 'Enriched', el: 'Εμπλουτισμένο' } },
      { id: 'enrichment.highly-enriched', label: { en: 'Highly enriched', el: 'Πολύ εμπλουτισμένο' } },
    ],
  },
  {
    id: 'consistency',
    label: { en: 'Consistency', el: 'Συνεκτικότητα' },
    options: [
      { id: 'consistency.very-stiff', label: { en: 'Very stiff', el: 'Πολύ σφιχτή' } },
      { id: 'consistency.stiff-dough', label: { en: 'Stiff dough', el: 'Σφιχτή ζύμη' } },
      { id: 'consistency.soft-dough', label: { en: 'Soft dough', el: 'Μαλακή ζύμη' } },
      { id: 'consistency.wet-dough', label: { en: 'Wet dough', el: 'Υγρή ζύμη' } },
      { id: 'consistency.paste', label: { en: 'Paste', el: 'Πάστα' } },
      { id: 'consistency.thick-batter', label: { en: 'Thick batter', el: 'Παχύρρευστο μείγμα' } },
      { id: 'consistency.pourable-batter', label: { en: 'Pourable batter', el: 'Ρευστό μείγμα' } },
      { id: 'consistency.thin-batter', label: { en: 'Thin batter', el: 'Λεπτόρρευστο μείγμα' } },
    ],
  },
  {
    id: 'fat-handling',
    label: { en: 'Fat handling', el: 'Διαχείριση λίπους' },
    options: [
      { id: 'fat-handling.incorporated', label: { en: 'Incorporated', el: 'Ενσωματωμένο' } },
      { id: 'fat-handling.creamed', label: { en: 'Creamed', el: 'Χτυπημένο με ζάχαρη' } },
      { id: 'fat-handling.melted', label: { en: 'Melted', el: 'Λιωμένο' } },
      { id: 'fat-handling.cut-in', label: { en: 'Cut-in', el: 'Δουλεμένο σε κομμάτια' } },
      { id: 'fat-handling.late-incorporated', label: { en: 'Late incorporated', el: 'Ενσωματωμένο αργά' } },
      { id: 'fat-handling.laminated', label: { en: 'Laminated', el: 'Σε στρώσεις' } },
    ],
  },
  {
    id: 'special-process',
    label: { en: 'Special process', el: 'Ειδική διεργασία' },
    options: [
      { id: 'special-process.boiled-before-baking', label: { en: 'Boiled before baking', el: 'Βρασμένο πριν το ψήσιμο' } },
      { id: 'special-process.alkaline-treated', label: { en: 'Alkaline treated', el: 'Αλκαλικά επεξεργασμένο' } },
      { id: 'special-process.pre-gelatinized-flour', label: { en: 'Pre-gelatinized flour', el: 'Προζελατινοποιημένο άλευρο' } },
      { id: 'special-process.whipped-foam', label: { en: 'Whipped foam', el: 'Χτυπημένος αφρός' } },
      { id: 'special-process.fermented', label: { en: 'Fermented', el: 'Ζυμωμένο' } },
      { id: 'special-process.fried', label: { en: 'Fried', el: 'Τηγανητό' } },
      { id: 'special-process.griddled', label: { en: 'Griddled', el: 'Ψημένο σε πλάκα' } },
    ],
  },
];

export function isStructuralFamilyId(value: string): boolean {
  return Boolean(STRUCTURAL_FAMILY_BY_ID[value]);
}

export function structuralFamilyAncestry(familyId: string): string[] {
  const ancestry: string[] = [];
  let current: string | null = familyId;
  while (current) {
    ancestry.push(current);
    current = STRUCTURAL_FAMILY_BY_ID[current]?.parentId ?? null;
  }
  return ancestry;
}

export function structuralFamilyMatches(actualFamilyId: string, selectedFamilyId: string): boolean {
  return structuralFamilyAncestry(actualFamilyId).includes(selectedFamilyId);
}

export function structuralFamilyDepth(familyId: string): number {
  return Math.max(0, structuralFamilyAncestry(familyId).length - 1);
}

export function structuralFamilyDescendants(familyId: string): string[] {
  return STRUCTURAL_FAMILY_NODES
    .filter((node) => structuralFamilyMatches(node.id, familyId))
    .map((node) => node.id);
}
