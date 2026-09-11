import {
  SOURCE_REGISTRY_ID,
  SOURCE_REGISTRY_REVISION,
  type SourceDefinition,
  type SourceRegistry,
} from '../../lib/domain/source-registry';
import { COVERAGE_INVENTORY_REVISION } from './coverage';

const text = (en: string, el: string) => ({ en, el });

/**
 * Internal-use source register. Every entry is restricted to maintainer-
 * controlled manual/offline capture under the permission recorded by the
 * project owner. No browser feature fetches these sources at runtime.
 */
export const PROPOSED_RECIPE_SOURCES: SourceDefinition[] = [
  {
    sourceId: 'source.king-arthur-baking',
    citation: text('King Arthur Baking recipe library', 'Βιβλιοθήκη συνταγών King Arthur Baking'),
    urlOrBibliography: 'https://www.kingarthurbaking.com/recipes',
    authorOrPublisher: 'King Arthur Baking Company',
    accessedAt: '2026-09-10',
    quality: 'high',
    authorityAssessment: text(
      'Professional baking publisher with a broad, structured recipe library; each formula still needs independent review.',
      'Εκδότης με επαγγελματική εστίαση στο ψήσιμο και ευρεία οργανωμένη βιβλιοθήκη· κάθε φόρμουλα χρειάζεται ανεξάρτητο έλεγχο.',
    ),
    attribution: text(
      'Keep publisher, recipe title, citation, and access date with any offline normalized facts.',
      'Να διατηρούνται ο εκδότης, ο τίτλος, η παραπομπή και η ημερομηνία πρόσβασης μαζί με τα offline κανονικοποιημένα δεδομένα.',
    ),
    acquisitionStatus: 'manual-only',
    reuseStatus: 'normalized-facts-only',
    acquisitionMethod: text(
      'Manual capture of permitted ingredient facts after terms review; never copy source prose.',
      'Χειροκίνητη καταγραφή επιτρεπόμενων στοιχείων υλικών μετά τον έλεγχο όρων· ποτέ αντιγραφή κειμένου.',
    ),
    limitations: text(
      'The official terms require permission for reproduction or publication of site content; publisher authority does not prove formula correctness.',
      'Οι επίσημοι όροι απαιτούν άδεια για αναπαραγωγή ή δημοσίευση περιεχομένου· η αξιοπιστία του εκδότη δεν αποδεικνύει την ορθότητα μιας φόρμουλας.',
    ),
    expectedCategories: ['yeasted-breads', 'enriched-sweet-yeast', 'laminated-viennoiserie', 'pastry-pie-tart-cracker', 'cakes-quick-breads', 'gluten-free-alternative'],
    expectedPreparationKeys: ['lean-white-loaf', 'country-loaf', 'brioche', 'challah', 'kouign-amann', 'puff-pastry', 'american-pie-dough', 'butter-cake', 'pound-cake', 'gluten-free-sandwich-loaf', 'gluten-free-pancake'],
  },
  {
    sourceId: 'source.the-perfect-loaf',
    citation: text('The Perfect Loaf recipe archive', 'Αρχείο συνταγών The Perfect Loaf'),
    urlOrBibliography: 'https://www.theperfectloaf.com/',
    authorOrPublisher: 'The Perfect Loaf / Maurizio Leo',
    accessedAt: '2026-09-10',
    quality: 'high',
    authorityAssessment: text(
      'Specialist sourdough publication with detailed process context; it is especially useful for naturally leavened preparations.',
      'Εξειδικευμένη έκδοση για φυσικό προζύμι με αναλυτικό πλαίσιο διαδικασίας· είναι ιδιαίτερα χρήσιμη για φυσικά προζυμωμένες παρασκευές.',
    ),
    attribution: text(
      'Retain publisher/author, recipe title, citation, and access date in the offline candidate record.',
      'Να διατηρούνται εκδότης/συγγραφέας, τίτλος, παραπομπή και ημερομηνία πρόσβασης στο offline candidate record.',
    ),
    acquisitionStatus: 'manual-only',
    reuseStatus: 'normalized-facts-only',
    acquisitionMethod: text(
      'Manual capture only after permission review; capture facts and references, not explanatory prose.',
      'Μόνο χειροκίνητη καταγραφή μετά από έλεγχο άδειας· καταγραφή στοιχείων και παραπομπών, όχι επεξηγηματικού κειμένου.',
    ),
    limitations: text(
      'The official policy restricts AI/ML use without written authorization; process detail does not guarantee comparable measurements or reuse permission.',
      'Η επίσημη πολιτική περιορίζει τη χρήση για AI/ML χωρίς γραπτή άδεια· η αναλυτική διαδικασία δεν εγγυάται συγκρίσιμες μετρήσεις ή άδεια επαναχρησιμοποίησης.',
    ),
    expectedCategories: ['naturally-leavened-breads', 'pizza-flatbreads'],
    expectedPreparationKeys: ['sourdough-country-loaf', 'sourdough-whole-wheat', 'sourdough-pizza'],
  },
  {
    sourceId: 'source.serious-eats',
    citation: text('Serious Eats recipe archive', 'Αρχείο συνταγών Serious Eats'),
    urlOrBibliography: 'https://www.seriouseats.com/',
    authorOrPublisher: 'Serious Eats',
    accessedAt: '2026-09-10',
    quality: 'medium',
    authorityAssessment: text(
      'Editorial food publication with tested-recipe features and broad coverage; source-specific authorship must be retained.',
      'Επιμελημένη έκδοση γαστρονομίας με δοκιμασμένες συνταγές και ευρεία κάλυψη· πρέπει να διατηρείται η ταυτότητα κάθε συγγραφέα.',
    ),
    attribution: text(
      'Retain the named author or publisher, exact citation, and access date; do not expose copied prose.',
      'Να διατηρούνται ονομασμένος συγγραφέας ή εκδότης, ακριβής παραπομπή και ημερομηνία πρόσβασης· όχι αντιγραφή κειμένου.',
    ),
    acquisitionStatus: 'manual-only',
    reuseStatus: 'normalized-facts-only',
    acquisitionMethod: text(
      'Manual fact capture or a specifically approved offline import, subject to source terms.',
      'Χειροκίνητη καταγραφή στοιχείων ή ειδικά εγκεκριμένο offline import, σύμφωνα με τους όρους της πηγής.',
    ),
    limitations: text(
      'Broad coverage varies in depth and authorship; terms and reuse conditions for the intended normalized-facts use remain unresolved.',
      'Η ευρεία κάλυψη διαφέρει ως προς το βάθος και την πατρότητα· οι όροι και η επαναχρησιμοποίηση κανονικοποιημένων στοιχείων παραμένουν αδιευκρίνιστα.',
    ),
    expectedCategories: ['pasta-noodles-wrappers', 'pastry-pie-tart-cracker', 'fried-doughs-batters'],
    expectedPreparationKeys: ['fresh-egg-pasta', 'pate-brisee', 'churros'],
  },
  {
    sourceId: 'source.giallozafferano',
    citation: text('GialloZafferano recipe archive', 'Αρχείο συνταγών GialloZafferano'),
    urlOrBibliography: 'https://www.giallozafferano.com/',
    authorOrPublisher: 'GialloZafferano',
    accessedAt: '2026-09-10',
    quality: 'medium',
    authorityAssessment: text(
      'Large Italian recipe publisher useful for pasta, pizza, pastry, and regional preparations; individual entries need verification.',
      'Μεγάλος ιταλικός εκδότης συνταγών, χρήσιμος για ζυμαρικά, pizza, ζύμες και τοπικές παρασκευές· κάθε καταχώριση χρειάζεται επαλήθευση.',
    ),
    attribution: text(
      'Retain publisher, named contributor when available, exact citation, and access date.',
      'Να διατηρούνται ο εκδότης, ο αναφερόμενος συντελεστής όταν υπάρχει, η ακριβής παραπομπή και η ημερομηνία πρόσβασης.',
    ),
    acquisitionStatus: 'manual-only',
    reuseStatus: 'normalized-facts-only',
    acquisitionMethod: text(
      'Manual capture after terms review; retain only normalized facts and citation in candidate artifacts.',
      'Χειροκίνητη καταγραφή μετά τον έλεγχο όρων· στα candidate artifacts να μένουν μόνο κανονικοποιημένα στοιχεία και παραπομπή.',
    ),
    limitations: text(
      'Regional variation and household measures may require justified conversions; terms and reuse conditions remain unresolved.',
      'Οι τοπικές παραλλαγές και οι οικιακές μονάδες μπορεί να απαιτούν τεκμηριωμένες μετατροπές· οι όροι και η επαναχρησιμοποίηση παραμένουν αδιευκρίνιστα.',
    ),
    expectedCategories: ['pizza-flatbreads', 'pasta-noodles-wrappers'],
    expectedPreparationKeys: ['neapolitan-pizza', 'tagliatelle'],
  },
  {
    sourceId: 'source.bbc-good-food',
    citation: text('BBC Good Food recipe archive', 'Αρχείο συνταγών BBC Good Food'),
    urlOrBibliography: 'https://www.bbcgoodfood.com/recipes',
    authorOrPublisher: 'BBC Good Food',
    accessedAt: '2026-09-10',
    quality: 'medium',
    authorityAssessment: text(
      'Established editorial recipe publication with broad consumer coverage; formula quality and authorship remain record-level questions.',
      'Καθιερωμένη επιμελημένη έκδοση συνταγών με ευρεία κάλυψη· η ποιότητα και η πατρότητα παραμένουν ζητήματα ανά καταχώριση.',
    ),
    attribution: text(
      'Retain publisher, recipe title, citation, and access date for every offline capture.',
      'Να διατηρούνται ο εκδότης, ο τίτλος, η παραπομπή και η ημερομηνία πρόσβασης για κάθε offline καταγραφή.',
    ),
    acquisitionStatus: 'manual-only',
    reuseStatus: 'normalized-facts-only',
    acquisitionMethod: text(
      'Manual capture only after terms and attribution review; no runtime requests from the GitHub Page.',
      'Μόνο χειροκίνητη καταγραφή μετά τον έλεγχο όρων και αναφοράς· καμία runtime αίτηση από το GitHub Page.',
    ),
    limitations: text(
      'Broad recipe coverage may include mixed measurement systems and less process detail; terms and reuse conditions remain unresolved.',
      'Η ευρεία κάλυψη μπορεί να περιλαμβάνει διαφορετικά συστήματα μέτρησης και λιγότερες λεπτομέρειες διαδικασίας· οι όροι και η επαναχρησιμοποίηση παραμένουν αδιευκρίνιστα.',
    ),
    expectedCategories: ['pancakes-crepes-waffles', 'fried-doughs-batters', 'pastry-pie-tart-cracker'],
    expectedPreparationKeys: ['crepe', 'american-pancake', 'beignet', 'shortbread'],
  },
];

export const SOURCE_REGISTRY: SourceRegistry = {
  registryId: SOURCE_REGISTRY_ID,
  revision: SOURCE_REGISTRY_REVISION,
  coverageRevision: COVERAGE_INVENTORY_REVISION,
  createdAt: '2026-09-10T00:00:00Z',
  policy: {
    runtimeScraping: 'prohibited',
    unattendedCrawling: 'prohibited',
    accessBypass: 'prohibited',
    publicCopiedProse: 'prohibited',
  },
  sources: PROPOSED_RECIPE_SOURCES,
};
