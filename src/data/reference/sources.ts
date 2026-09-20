import {
  SOURCE_REGISTRY_ID,
  SOURCE_REGISTRY_REVISION,
  type SourceDefinition,
  type SourceRegistry,
} from '../../lib/domain/source-registry';
import { COVERAGE_INVENTORY_REVISION } from './coverage';

const text = (en: string, el: string) => ({ en, el });

/**
 * First-party source register for the current reference release. The formulas
 * are working drafts derived from the internal grissini and cracker exploration notes,
 * not transcriptions from third-party recipe websites.
 */
export const INTERNAL_RECIPE_SOURCES: SourceDefinition[] = [
  {
    sourceId: 'source.dfi-internal-breadsticks',
    citation: text('Breadstick formula study', 'Μελέτη φόρμουλων για κριτσίνια'),
    urlOrBibliography: 'exploration/recepies/kritsinia.txt',
    authorOrPublisher: 'Dough Formula Intelligence',
    accessedAt: '2026-09-19',
    quality: 'medium',
    authorityAssessment: text(
      "Project-owned canonical formula drafts used to map breadstick structure and baker's-percentage ranges.",
      "Εσωτερικές canonical φόρμουλες του project για τη χαρτογράφηση της δομής των κριτσινιών και των baker's percentages.",
    ),
    attribution: text(
      'Keep the local exploration note and the formula variant identity with every normalized record.',
      'Να διατηρούνται το εσωτερικό σημείωμα διερεύνησης και η ταυτότητα της παραλλαγής σε κάθε κανονικοποιημένη εγγραφή.',
    ),
    acquisitionStatus: 'manual-only',
    reuseStatus: 'normalized-facts-only',
    acquisitionMethod: text(
      'Manual capture of first-party working formulas from the internal exploration note; no third-party prose is copied.',
      'Χειροκίνητη καταγραφή εσωτερικών working formulas από το σημείωμα διερεύνησης· δεν αντιγράφεται κείμενο τρίτων.',
    ),
    limitations: text(
      'These are expert-seed hypotheses for comparison and exploration. Kitchen testing is still required before treating them as validated recipes.',
      'Είναι αρχικές εσωτερικές υποθέσεις για σύγκριση και εξερεύνηση. Χρειάζονται δοκιμές στην κουζίνα πριν θεωρηθούν επικυρωμένες συνταγές.',
    ),
    expectedCategories: ['yeasted-breads', 'pastry-pie-tart-cracker'],
    expectedPreparationKeys: [
      'breadsticks',
      'breadsticks-torinese',
      'breadsticks-greek-style',
      'breadsticks-biscuit-style',
      'breadsticks-airy',
      'breadsticks-semolina',
      'breadsticks-whole-wheat',
      'breadsticks-seeded',
      'breadsticks-cheese',
      'breadsticks-sourdough',
    ],
  },
  {
    sourceId: 'source.dfi-internal-crackers',
    citation: text('Cracker formula study', 'Μελέτη φόρμουλων για κράκερ'),
    urlOrBibliography: 'exploration/recepies/craker.txt',
    authorOrPublisher: 'Dough Formula Intelligence',
    accessedAt: '2026-09-20',
    quality: 'medium',
    authorityAssessment: text(
      "Project-owned canonical formula drafts used to map cracker structure, baker's-percentage ranges, and process variants.",
      "Εσωτερικές canonical φόρμουλες του project για τη χαρτογράφηση της δομής των κράκερ, των baker's percentages και των παραλλαγών διαδικασίας.",
    ),
    attribution: text(
      'Keep the local cracker exploration note and the formula variant identity with every normalized record.',
      'Να διατηρούνται το εσωτερικό σημείωμα διερεύνησης κράκερ και η ταυτότητα της παραλλαγής σε κάθε κανονικοποιημένη εγγραφή.',
    ),
    acquisitionStatus: 'manual-only',
    reuseStatus: 'normalized-facts-only',
    acquisitionMethod: text(
      'Manual capture of first-party working formulas from the internal cracker exploration note; no third-party prose is copied.',
      'Χειροκίνητη καταγραφή εσωτερικών working formulas από το σημείωμα διερεύνησης κράκερ· δεν αντιγράφεται κείμενο τρίτων.',
    ),
    limitations: text(
      'These are expert-seed hypotheses for comparison and exploration. Kitchen testing is still required before treating them as validated recipes.',
      'Είναι αρχικές εσωτερικές υποθέσεις για σύγκριση και εξερεύνηση. Χρειάζονται δοκιμές στην κουζίνα πριν θεωρηθούν επικυρωμένες συνταγές.',
    ),
    expectedCategories: ['pastry-pie-tart-cracker'],
    expectedPreparationKeys: [
      'cracker-dough',
      'cracker-lean-hard',
      'cracker-extra-crisp',
      'cracker-richer-short',
      'cracker-flaky',
      'cracker-puffy',
      'cracker-cheese',
      'cracker-seed',
      'cracker-olive-herb',
      'cracker-wholegrain',
      'cracker-rye',
      'cracker-spiced',
    ],
  },
];

export const SOURCE_REGISTRY: SourceRegistry = {
  registryId: SOURCE_REGISTRY_ID,
  revision: SOURCE_REGISTRY_REVISION,
  coverageRevision: COVERAGE_INVENTORY_REVISION,
  createdAt: '2026-09-19T00:00:00Z',
  policy: {
    runtimeScraping: 'prohibited',
    unattendedCrawling: 'prohibited',
    accessBypass: 'prohibited',
    publicCopiedProse: 'prohibited',
  },
  sources: INTERNAL_RECIPE_SOURCES,
};
