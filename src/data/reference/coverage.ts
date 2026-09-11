import { isStructuralFamilyId } from '../../lib/domain/structural-taxonomy';

export type CoveragePriority = 'P0' | 'P1';
export type CoverageStatus = 'planned' | 'source-identified' | 'acquired' | 'normalized' | 'needs-review' | 'ready-for-release' | 'rejected';

export interface CoverageLocalizedText {
  en: string;
  el: string;
}

export interface NavigationCategory {
  id: string;
  label: CoverageLocalizedText;
  parentId: string | null;
  level: 0;
  order: number;
}

export interface CoverageEntry {
  preparationKey: string;
  label: CoverageLocalizedText;
  primaryCategory: string;
  aliases: string[];
  candidateStructuralFamilies: string[];
  priority: CoveragePriority;
  status: CoverageStatus;
  notes: CoverageLocalizedText;
}

export interface CoverageInventory {
  inventoryId: 'preparation-coverage';
  revision: string;
  manifestIdentity: string;
  categories: NavigationCategory[];
  entries: CoverageEntry[];
}

export const COVERAGE_INVENTORY_REVISION = 'coverage-v2';
export const EXPECTED_COVERAGE_ENTRY_COUNT = 154;

const category = (id: string, en: string, el: string, order: number): NavigationCategory => ({
  id,
  label: { en, el },
  parentId: null,
  level: 0,
  order,
});

const entry = (
  preparationKey: string,
  en: string,
  el: string,
  primaryCategory: string,
  structuralFamilyId: string,
  priority: CoveragePriority,
): CoverageEntry => ({
  preparationKey,
  label: { en, el },
  primaryCategory,
  aliases: [en],
  candidateStructuralFamilies: [structuralFamilyId],
  priority,
  status: 'planned',
  notes: { en: '', el: '' },
});

export const COVERAGE_CATEGORIES: NavigationCategory[] = [
  category('yeasted-breads', 'Yeasted breads', 'Ψωμιά με μαγιά', 1),
  category('naturally-leavened-breads', 'Naturally leavened breads', 'Ψωμιά με φυσικό προζύμι', 2),
  category('enriched-sweet-yeast', 'Enriched and sweet yeast doughs', 'Εμπλουτισμένες και γλυκές ζύμες', 3),
  category('laminated-viennoiserie', 'Laminated and viennoiserie doughs', 'Φυλλοποιημένες ζύμες', 4),
  category('pizza-flatbreads', 'Pizza and flatbreads', 'Pizza και επίπεδες ζύμες', 5),
  category('pasta-noodles-wrappers', 'Pasta, noodle and wrapper doughs', 'Ζυμαρικά, noodles και φύλλα', 6),
  category('pastry-pie-tart-cracker', 'Pastry, pie, tart and cracker doughs', 'Ζύμες ζαχαροπλαστικής, πίτας και κράκερ', 7),
  category('cakes-quick-breads', 'Cakes and quick breads', 'Κέικ και γρήγορα ψωμιά', 8),
  category('pancakes-crepes-waffles', 'Pancakes, crêpes and waffles', 'Pancakes, κρέπες και waffles', 9),
  category('fried-doughs-batters', 'Fried doughs and batters', 'Τηγανητές ζύμες και χυλοί', 10),
  category('gluten-free-alternative', 'Gluten-free and alternative doughs', 'Χωρίς γλουτένη και εναλλακτικές ζύμες', 11),
];

export const COVERAGE_ENTRIES: CoverageEntry[] = [
  // Yeasted breads
  entry('lean-white-loaf', 'Lean white loaf', 'Απλό λευκό ψωμί', 'yeasted-breads', 'family.fermented-gluten.lean-bread', 'P0'),
  entry('country-loaf', 'Country loaf', 'Χωριάτικο ψωμί', 'yeasted-breads', 'family.fermented-gluten.lean-bread', 'P0'),
  entry('baguette', 'Baguette', 'Μπαγκέτα', 'yeasted-breads', 'family.fermented-gluten.lean-bread', 'P0'),
  entry('ciabatta', 'Ciabatta', 'Τσιαπάτα', 'yeasted-breads', 'family.fermented-gluten.high-hydration', 'P0'),
  entry('focaccia', 'Focaccia', 'Φοκάτσια', 'yeasted-breads', 'family.fermented-gluten.flat', 'P0'),
  entry('whole-wheat-loaf', 'Whole-wheat loaf', 'Ψωμί ολικής άλεσης', 'yeasted-breads', 'family.fermented-gluten.lean-bread', 'P0'),
  entry('multigrain-loaf', 'Multigrain loaf', 'Πολύσπορο ψωμί', 'yeasted-breads', 'family.fermented-gluten.lean-bread', 'P1'),
  entry('rye-wheat-loaf', 'Rye-wheat loaf', 'Ψωμί σίκαλης και σιταριού', 'yeasted-breads', 'family.fermented-gluten.lean-bread', 'P1'),
  entry('potato-bread', 'Potato bread', 'Πατατόψωμο', 'yeasted-breads', 'family.fermented-gluten.soft-enriched', 'P1'),
  entry('dinner-rolls', 'Dinner rolls', 'Ψωμάκια φαγητού', 'yeasted-breads', 'family.fermented-gluten.soft-enriched', 'P0'),
  entry('hamburger-buns', 'Hamburger buns', 'Ψωμάκια για burger', 'yeasted-breads', 'family.fermented-gluten.soft-enriched', 'P1'),
  entry('english-muffin', 'English muffin', 'English muffin', 'yeasted-breads', 'family.fermented-gluten.lean-bread', 'P1'),
  entry('breadsticks', 'Breadsticks / grissini', 'Κριτσίνια', 'yeasted-breads', 'family.fermented-gluten.lean-bread', 'P1'),
  entry('pretzel', 'Soft pretzel', 'Μαλακό pretzel', 'yeasted-breads', 'family.fermented-gluten.stiff', 'P1'),

  // Naturally leavened breads
  entry('sourdough-country-loaf', 'Sourdough country loaf', 'Χωριάτικο ψωμί με φυσικό προζύμι', 'naturally-leavened-breads', 'family.fermented-gluten.lean-bread', 'P0'),
  entry('sourdough-whole-wheat', 'Whole-wheat sourdough', 'Ψωμί ολικής με φυσικό προζύμι', 'naturally-leavened-breads', 'family.fermented-gluten.lean-bread', 'P0'),
  entry('sourdough-rye', 'Rye sourdough', 'Ψωμί σίκαλης με φυσικό προζύμι', 'naturally-leavened-breads', 'family.fermented-gluten.lean-bread', 'P1'),
  entry('sourdough-seeded', 'Seeded sourdough', 'Ψωμί με σπόρους και φυσικό προζύμι', 'naturally-leavened-breads', 'family.fermented-gluten.lean-bread', 'P1'),
  entry('sourdough-baguette', 'Sourdough baguette', 'Μπαγκέτα με φυσικό προζύμι', 'naturally-leavened-breads', 'family.fermented-gluten.lean-bread', 'P1'),
  entry('sourdough-ciabatta', 'Sourdough ciabatta', 'Τσιαπάτα με φυσικό προζύμι', 'naturally-leavened-breads', 'family.fermented-gluten.high-hydration', 'P1'),
  entry('sourdough-focaccia', 'Sourdough focaccia', 'Φοκάτσια με φυσικό προζύμι', 'naturally-leavened-breads', 'family.fermented-gluten.flat', 'P1'),
  entry('sourdough-pan-loaf', 'Sourdough pan loaf', 'Ψωμί φόρμας με φυσικό προζύμι', 'naturally-leavened-breads', 'family.fermented-gluten.lean-bread', 'P1'),

  // Enriched and sweet yeast doughs
  entry('brioche', 'Brioche', 'Μπριός', 'enriched-sweet-yeast', 'family.fermented-gluten.rich-enriched', 'P0'),
  entry('challah', 'Challah', 'Χάλα', 'enriched-sweet-yeast', 'family.fermented-gluten.rich-enriched', 'P1'),
  entry('milk-bread', 'Milk bread', 'Ψωμί γάλακτος', 'enriched-sweet-yeast', 'family.fermented-gluten.soft-enriched', 'P0'),
  entry('tangzhong-milk-bread', 'Tangzhong milk bread', 'Ψωμί γάλακτος με tangzhong', 'enriched-sweet-yeast', 'family.fermented-gluten.soft-enriched', 'P1'),
  entry('cinnamon-roll', 'Cinnamon roll', 'Ρολό κανέλας', 'enriched-sweet-yeast', 'family.fermented-gluten.rich-enriched', 'P0'),
  entry('sticky-bun', 'Sticky bun', 'Sticky bun', 'enriched-sweet-yeast', 'family.fermented-gluten.rich-enriched', 'P1'),
  entry('babka', 'Babka', 'Μπάμπκα', 'enriched-sweet-yeast', 'family.fermented-gluten.rich-enriched', 'P1'),
  entry('tsoureki', 'Tsoureki', 'Τσουρέκι', 'enriched-sweet-yeast', 'family.fermented-gluten.rich-enriched', 'P0'),
  entry('cozonac', 'Cozonac', 'Κοζονάκ', 'enriched-sweet-yeast', 'family.fermented-gluten.rich-enriched', 'P1'),
  entry('panettone', 'Panettone', 'Πανετόνε', 'enriched-sweet-yeast', 'family.fermented-gluten.rich-enriched', 'P1'),
  entry('pandoro', 'Pandoro', 'Παντόρο', 'enriched-sweet-yeast', 'family.fermented-gluten.rich-enriched', 'P1'),
  entry('stollen', 'Stollen', 'Στόλεν', 'enriched-sweet-yeast', 'family.fermented-gluten.rich-enriched', 'P1'),
  entry('sweet-breakfast-bun', 'Sweet breakfast bun', 'Γλυκό ψωμάκι πρωινού', 'enriched-sweet-yeast', 'family.fermented-gluten.rich-enriched', 'P1'),
  entry('yeast-doughnut', 'Yeast doughnut', 'Ντόνατ με μαγιά', 'enriched-sweet-yeast', 'family.fermented-gluten.rich-enriched', 'P0'),

  // Laminated and viennoiserie
  entry('croissant', 'Croissant', 'Κρουασάν', 'laminated-viennoiserie', 'family.laminated-gluten.fermented', 'P0'),
  entry('sourdough-croissant', 'Sourdough croissant', 'Κρουασάν με φυσικό προζύμι', 'laminated-viennoiserie', 'family.laminated-gluten.fermented', 'P1'),
  entry('pain-au-chocolat', 'Pain au chocolat', 'Pain au chocolat', 'laminated-viennoiserie', 'family.laminated-gluten.fermented', 'P1'),
  entry('danish-pastry', 'Danish pastry', 'Δανέζικο φύλλο', 'laminated-viennoiserie', 'family.laminated-gluten.fermented', 'P1'),
  entry('kouign-amann', 'Kouign-amann', 'Κουίν αμάν', 'laminated-viennoiserie', 'family.laminated-gluten.fermented', 'P1'),
  entry('laminated-brioche', 'Laminated brioche', 'Φυλλοποιημένο μπριός', 'laminated-viennoiserie', 'family.laminated-gluten.fermented', 'P1'),
  entry('puff-pastry', 'Puff pastry', 'Σφολιάτα', 'laminated-viennoiserie', 'family.laminated-gluten.unfermented', 'P0'),
  entry('rough-puff-pastry', 'Rough puff pastry', 'Γρήγορη σφολιάτα', 'laminated-viennoiserie', 'family.laminated-gluten.unfermented', 'P1'),
  entry('inverse-puff-pastry', 'Inverse puff pastry', 'Αντεστραμμένη σφολιάτα', 'laminated-viennoiserie', 'family.laminated-gluten.unfermented', 'P1'),

  // Pizza and flatbreads
  entry('neapolitan-pizza', 'Neapolitan pizza', 'Ναπολιτάνικη pizza', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P0'),
  entry('new-york-pizza', 'New York-style pizza', 'Pizza τύπου Νέας Υόρκης', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P0'),
  entry('roman-al-taglio', 'Roman pizza al taglio', 'Ρωμαϊκή pizza al taglio', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P1'),
  entry('pinsa-romana', 'Pinsa Romana', 'Pinsa Romana', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P1'),
  entry('pan-pizza', 'Pan pizza', 'Pizza ταψιού', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P0'),
  entry('detroit-style-pizza', 'Detroit-style pizza', 'Pizza τύπου Detroit', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P1'),
  entry('sicilian-pizza', 'Sicilian pizza', 'Σικελική pizza', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P1'),
  entry('sourdough-pizza', 'Sourdough pizza', 'Pizza με φυσικό προζύμι', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P1'),
  entry('pizza-bianca', 'Pizza bianca', 'Pizza bianca', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P1'),
  entry('pita', 'Pita bread', 'Πίτα', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P0'),
  entry('naan', 'Naan', 'Naan', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P0'),
  entry('lavash', 'Lavash', 'Λαβάς', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P1'),
  entry('manakish', 'Manakish', 'Μανάκις', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P1'),
  entry('pide', 'Pide', 'Πίδε', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P1'),
  entry('lahmacun', 'Lahmacun dough', 'Ζύμη για λαχματζούν', 'pizza-flatbreads', 'family.fermented-gluten.flat', 'P1'),
  entry('flour-tortilla', 'Flour tortilla', 'Τορτίγια αλευριού', 'pizza-flatbreads', 'family.unleavened-gluten.flatbread', 'P0'),
  entry('corn-tortilla', 'Corn tortilla', 'Τορτίγια καλαμποκιού', 'pizza-flatbreads', 'family.starch-dominant.rice-starch', 'P1'),
  entry('paratha', 'Paratha', 'Παράθα', 'pizza-flatbreads', 'family.laminated-gluten.unfermented', 'P1'),
  entry('roti-chapati', 'Roti / chapati', 'Roti / chapati', 'pizza-flatbreads', 'family.unleavened-gluten.flatbread', 'P1'),

  // Pasta, noodles and wrappers
  entry('fresh-egg-pasta', 'Fresh egg pasta', 'Φρέσκα ζυμαρικά με αυγό', 'pasta-noodles-wrappers', 'family.unleavened-gluten.pasta-noodle', 'P0'),
  entry('semolina-egg-pasta', 'Semolina egg pasta', 'Ζυμαρικά σιμιγδαλιού με αυγό', 'pasta-noodles-wrappers', 'family.unleavened-gluten.pasta-noodle', 'P1'),
  entry('water-flour-pasta', 'Water-and-flour pasta', 'Ζυμαρικά με νερό και αλεύρι', 'pasta-noodles-wrappers', 'family.unleavened-gluten.pasta-noodle', 'P1'),
  entry('lasagna-sheets', 'Lasagna sheets', 'Φύλλα λαζάνια', 'pasta-noodles-wrappers', 'family.unleavened-gluten.pasta-noodle', 'P0'),
  entry('tagliatelle', 'Tagliatelle dough', 'Ζύμη για tagliatelle', 'pasta-noodles-wrappers', 'family.unleavened-gluten.pasta-noodle', 'P1'),
  entry('ravioli-dough', 'Ravioli dough', 'Ζύμη για ravioli', 'pasta-noodles-wrappers', 'family.unleavened-gluten.pasta-noodle', 'P0'),
  entry('orecchiette', 'Orecchiette dough', 'Ζύμη για orecchiette', 'pasta-noodles-wrappers', 'family.unleavened-gluten.pasta-noodle', 'P1'),
  entry('cavatelli', 'Cavatelli dough', 'Ζύμη για cavatelli', 'pasta-noodles-wrappers', 'family.unleavened-gluten.pasta-noodle', 'P1'),
  entry('gnocchi-potato', 'Potato gnocchi', 'Gnocchi πατάτας', 'pasta-noodles-wrappers', 'family.starch-dominant.potato', 'P1'),
  entry('gnocchi-ricotta', 'Ricotta gnocchi', 'Gnocchi ricotta', 'pasta-noodles-wrappers', 'family.starch-dominant.non-gluten-dumpling', 'P1'),
  entry('spaetzle', 'Spaetzle batter', 'Spaetzle', 'pasta-noodles-wrappers', 'family.unleavened-pourable.crepe', 'P1'),
  entry('udon', 'Udon dough', 'Ζύμη για udon', 'pasta-noodles-wrappers', 'family.unleavened-gluten.pasta-noodle', 'P1'),
  entry('ramen', 'Ramen dough', 'Ζύμη για ramen', 'pasta-noodles-wrappers', 'family.unleavened-gluten.pasta-noodle', 'P1'),
  entry('soba', 'Soba dough', 'Ζύμη για soba', 'pasta-noodles-wrappers', 'family.unleavened-gluten.pasta-noodle', 'P1'),
  entry('dumpling-wrappers', 'Dumpling wrappers', 'Φύλλα για dumplings', 'pasta-noodles-wrappers', 'family.unleavened-gluten.wrapper-dumpling', 'P1'),
  entry('wonton-wrappers', 'Wonton wrappers', 'Φύλλα για wonton', 'pasta-noodles-wrappers', 'family.unleavened-gluten.wrapper-dumpling', 'P1'),

  // Pastry, pie, tart and cracker
  entry('pate-brisee', 'Pâte brisée', 'Pâte brisée', 'pastry-pie-tart-cracker', 'family.short-fat-shortened.basic-shortcrust', 'P0'),
  entry('pate-sucree', 'Pâte sucrée', 'Pâte sucrée', 'pastry-pie-tart-cracker', 'family.short-fat-shortened.sweet-shortcrust', 'P0'),
  entry('pate-sablee', 'Pâte sablée', 'Pâte sablée', 'pastry-pie-tart-cracker', 'family.short-fat-shortened.sandy-sable', 'P1'),
  entry('american-pie-dough', 'American pie dough', 'Ζύμη για αμερικανική πίτα', 'pastry-pie-tart-cracker', 'family.short-fat-shortened.basic-shortcrust', 'P0'),
  entry('flaky-pie-dough', 'Flaky pie dough', 'Φυλλώδης ζύμη πίτας', 'pastry-pie-tart-cracker', 'family.short-fat-shortened.basic-shortcrust', 'P1'),
  entry('hot-water-crust', 'Hot-water crust', 'Ζύμη με καυτό νερό', 'pastry-pie-tart-cracker', 'family.short-fat-shortened.basic-shortcrust', 'P1'),
  entry('galette-dough', 'Galette dough', 'Ζύμη για galette', 'pastry-pie-tart-cracker', 'family.short-fat-shortened.basic-shortcrust', 'P1'),
  entry('strudel-dough', 'Strudel dough', 'Ζύμη για στρούντελ', 'pastry-pie-tart-cracker', 'family.unleavened-gluten.wrapper-dumpling', 'P1'),
  entry('phyllo-dough', 'Phyllo dough', 'Φύλλο κρούστας', 'pastry-pie-tart-cracker', 'family.laminated-gluten.unfermented', 'P0'),
  entry('baklava-sheets', 'Baklava sheets', 'Φύλλα για μπακλαβά', 'pastry-pie-tart-cracker', 'family.laminated-gluten.unfermented', 'P1'),
  entry('choux-pastry', 'Choux pastry', 'Ζύμη choux', 'pastry-pie-tart-cracker', 'family.steam-paste.choux', 'P0'),
  entry('cracker-dough', 'Cracker dough', 'Ζύμη για κράκερ', 'pastry-pie-tart-cracker', 'family.short-fat-shortened.basic-shortcrust', 'P1'),
  entry('shortbread', 'Shortbread', 'Μπισκότο βουτύρου', 'pastry-pie-tart-cracker', 'family.short-fat-shortened.shortbread', 'P0'),
  entry('empanada-dough', 'Empanada dough', 'Ζύμη για empanada', 'pastry-pie-tart-cracker', 'family.short-fat-shortened.basic-shortcrust', 'P1'),
  entry('savory-tart-dough', 'Savory tart dough', 'Αλμυρή ζύμη τάρτας', 'pastry-pie-tart-cracker', 'family.short-fat-shortened.basic-shortcrust', 'P1'),

  // Cakes and quick breads
  entry('butter-cake', 'Butter cake', 'Κέικ βουτύρου', 'cakes-quick-breads', 'family.chemical-cake.butter', 'P0'),
  entry('pound-cake', 'Pound cake', 'Pound cake', 'cakes-quick-breads', 'family.chemical-cake.high-ratio', 'P0'),
  entry('genoise', 'Genoise sponge', 'Génoise', 'cakes-quick-breads', 'family.foam-cake.whole-egg', 'P1'),
  entry('sponge-cake', 'Sponge cake', 'Αφράτο sponge cake', 'cakes-quick-breads', 'family.foam-cake.whole-egg', 'P0'),
  entry('chiffon-cake', 'Chiffon cake', 'Chiffon cake', 'cakes-quick-breads', 'family.foam-cake.hybrid', 'P1'),
  entry('angel-food-cake', 'Angel food cake', 'Angel food cake', 'cakes-quick-breads', 'family.foam-cake.egg-white', 'P1'),
  entry('carrot-cake', 'Carrot cake', 'Κέικ καρότου', 'cakes-quick-breads', 'family.chemical-cake.oil', 'P1'),
  entry('banana-bread', 'Banana bread', 'Banana bread', 'cakes-quick-breads', 'family.quick-bread.quick-loaf', 'P0'),
  entry('zucchini-bread', 'Zucchini bread', 'Ψωμί κολοκυθιού', 'cakes-quick-breads', 'family.quick-bread.quick-loaf', 'P1'),
  entry('cornbread', 'Cornbread', 'Ψωμί καλαμποκιού', 'cakes-quick-breads', 'family.quick-bread.quick-loaf', 'P1'),
  entry('muffin', 'Muffin', 'Muffin', 'cakes-quick-breads', 'family.quick-bread.muffin', 'P0'),
  entry('cupcake', 'Cupcake', 'Cupcake', 'cakes-quick-breads', 'family.chemical-cake.butter', 'P1'),
  entry('madeleine', 'Madeleine', 'Madeleine', 'cakes-quick-breads', 'family.chemical-cake.butter', 'P1'),
  entry('financier', 'Financier', 'Financier', 'cakes-quick-breads', 'family.chemical-cake.butter', 'P1'),
  entry('friand', 'Friand', 'Friand', 'cakes-quick-breads', 'family.chemical-cake.butter', 'P1'),
  entry('bundt-cake', 'Bundt cake', 'Bundt cake', 'cakes-quick-breads', 'family.chemical-cake.butter', 'P1'),
  entry('coffee-cake', 'Coffee cake', 'Coffee cake', 'cakes-quick-breads', 'family.chemical-cake.butter', 'P1'),
  entry('brownie', 'Brownie', 'Brownie', 'cakes-quick-breads', 'family.chemical-cake.butter', 'P0'),
  entry('blondie', 'Blondie', 'Blondie', 'cakes-quick-breads', 'family.chemical-cake.butter', 'P1'),
  entry('tres-leches-cake', 'Tres leches cake', 'Tres leches cake', 'cakes-quick-breads', 'family.foam-cake.whole-egg', 'P1'),
  entry('steamed-cake', 'Steamed cake', 'Κέικ στον ατμό', 'cakes-quick-breads', 'family.chemical-cake.butter', 'P1'),

  // Pancakes, crêpes and waffles
  entry('crepe', 'Crêpe', 'Κρέπα', 'pancakes-crepes-waffles', 'family.unleavened-pourable.crepe', 'P0'),
  entry('buckwheat-galette', 'Buckwheat galette', 'Γαλέτα φαγόπυρου', 'pancakes-crepes-waffles', 'family.unleavened-pourable.crepe', 'P1'),
  entry('american-pancake', 'American pancake', 'Αμερικανικό pancake', 'pancakes-crepes-waffles', 'family.chemical-pourable.pancake', 'P0'),
  entry('buttermilk-pancake', 'Buttermilk pancake', 'Pancake με buttermilk', 'pancakes-crepes-waffles', 'family.chemical-pourable.pancake', 'P0'),
  entry('dutch-baby', 'Dutch baby', 'Dutch baby', 'pancakes-crepes-waffles', 'family.chemical-pourable.pancake', 'P1'),
  entry('blini', 'Blini', 'Blini', 'pancakes-crepes-waffles', 'family.fermented-batter.lactic-mixed', 'P1'),
  entry('belgian-waffle', 'Belgian waffle', 'Βελγική βάφλα', 'pancakes-crepes-waffles', 'family.chemical-pourable.waffle', 'P0'),
  entry('brussels-waffle', 'Brussels waffle', 'Βάφλα Βρυξελλών', 'pancakes-crepes-waffles', 'family.fermented-batter.yeast', 'P1'),
  entry('liege-waffle', 'Liège waffle', 'Βάφλα Λιέγης', 'pancakes-crepes-waffles', 'family.fermented-gluten.rich-enriched', 'P1'),
  entry('japanese-souffle-pancake', 'Japanese soufflé pancake', 'Ιαπωνικό soufflé pancake', 'pancakes-crepes-waffles', 'family.chemical-pourable.pancake', 'P1'),
  entry('yorkshire-pudding', 'Yorkshire pudding', 'Yorkshire pudding', 'pancakes-crepes-waffles', 'family.unleavened-pourable.crepe', 'P1'),
  entry('clafoutis', 'Clafoutis', 'Clafoutis', 'pancakes-crepes-waffles', 'family.unleavened-pourable.crepe', 'P1'),
  entry('okonomiyaki', 'Okonomiyaki batter', 'Χυλός okonomiyaki', 'pancakes-crepes-waffles', 'family.chemical-pourable.pancake', 'P1'),

  // Fried doughs and batters
  entry('cake-doughnut', 'Cake doughnut', 'Ντόνατ με διογκωτικά', 'fried-doughs-batters', 'family.chemical-cake.butter', 'P1'),
  entry('beignet', 'Beignet', 'Beignet', 'fried-doughs-batters', 'family.fermented-gluten.rich-enriched', 'P1'),
  entry('churros', 'Churros', 'Churros', 'fried-doughs-batters', 'family.steam-paste.choux', 'P0'),
  entry('loukoumades', 'Loukoumades', 'Λουκουμάδες', 'fried-doughs-batters', 'family.fermented-gluten.rich-enriched', 'P0'),
  entry('zeppole', 'Zeppole', 'Zeppole', 'fried-doughs-batters', 'family.fermented-gluten.rich-enriched', 'P1'),
  entry('funnel-cake', 'Funnel cake', 'Funnel cake', 'fried-doughs-batters', 'family.chemical-pourable.fritter-coating', 'P1'),
  entry('fritter-batter', 'Fritter batter', 'Χυλός για τηγανίτες/λουκουμάδες', 'fried-doughs-batters', 'family.chemical-pourable.fritter-coating', 'P1'),
  entry('tempura-batter', 'Tempura batter', 'Χυλός tempura', 'fried-doughs-batters', 'family.chemical-pourable.fritter-coating', 'P1'),
  entry('pakora-batter', 'Pakora batter', 'Χυλός pakora', 'fried-doughs-batters', 'family.chemical-pourable.fritter-coating', 'P1'),
  entry('onion-ring-batter', 'Onion-ring batter', 'Χυλός για onion rings', 'fried-doughs-batters', 'family.chemical-pourable.fritter-coating', 'P1'),

  // Gluten-free and alternative
  entry('gluten-free-sandwich-loaf', 'Gluten-free sandwich loaf', 'Ψωμί φόρμας χωρίς γλουτένη', 'gluten-free-alternative', 'family.starch-dominant.rice-starch', 'P0'),
  entry('gluten-free-focaccia', 'Gluten-free focaccia', 'Focaccia χωρίς γλουτένη', 'gluten-free-alternative', 'family.starch-dominant.rice-starch', 'P1'),
  entry('gluten-free-pizza', 'Gluten-free pizza', 'Pizza χωρίς γλουτένη', 'gluten-free-alternative', 'family.starch-dominant.rice-starch', 'P0'),
  entry('gluten-free-pasta', 'Gluten-free pasta', 'Ζυμαρικά χωρίς γλουτένη', 'gluten-free-alternative', 'family.starch-dominant.rice-starch', 'P1'),
  entry('socca', 'Socca', 'Socca', 'gluten-free-alternative', 'family.starch-dominant.rice-starch', 'P1'),
  entry('injera', 'Injera', 'Injera', 'gluten-free-alternative', 'family.fermented-batter.lactic-mixed', 'P1'),
  entry('dosa', 'Dosa', 'Dosa', 'gluten-free-alternative', 'family.fermented-batter.lactic-mixed', 'P1'),
  entry('idli', 'Idli', 'Idli', 'gluten-free-alternative', 'family.fermented-batter.lactic-mixed', 'P1'),
  entry('appam', 'Appam', 'Appam', 'gluten-free-alternative', 'family.fermented-batter.lactic-mixed', 'P1'),
  entry('arepa', 'Arepa', 'Arepa', 'gluten-free-alternative', 'family.starch-dominant.rice-starch', 'P1'),
  entry('pupusa', 'Pupusa', 'Pupusa', 'gluten-free-alternative', 'family.starch-dominant.rice-starch', 'P1'),
  entry('cassava-flatbread', 'Cassava flatbread', 'Επίπεδη ζύμη από μανιόκα', 'gluten-free-alternative', 'family.starch-dominant.rice-starch', 'P1'),
  entry('almond-flour-cake', 'Almond-flour cake', 'Κέικ με αλεύρι αμυγδάλου', 'gluten-free-alternative', 'family.chemical-cake.butter', 'P1'),
  entry('gluten-free-pancake', 'Gluten-free pancake', 'Pancake χωρίς γλουτένη', 'gluten-free-alternative', 'family.chemical-pourable.pancake', 'P0'),
  entry('gluten-free-crepe', 'Gluten-free crêpe', 'Κρέπα χωρίς γλουτένη', 'gluten-free-alternative', 'family.unleavened-pourable.crepe', 'P1'),
];

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`).join(',')}}`;
}

function digest(value: unknown): string {
  let result = 2166136261;
  const input = canonicalize(value);
  for (let index = 0; index < input.length; index += 1) {
    result ^= input.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return `fnv1a32:${(result >>> 0).toString(16).padStart(8, '0')}`;
}

export function computeCoverageManifestIdentity(
  inventory: Omit<CoverageInventory, 'manifestIdentity'>,
): string {
  return digest(inventory);
}

const coverageManifest: Omit<CoverageInventory, 'manifestIdentity'> = {
  inventoryId: 'preparation-coverage',
  revision: COVERAGE_INVENTORY_REVISION,
  categories: COVERAGE_CATEGORIES,
  entries: COVERAGE_ENTRIES,
};

export const COVERAGE_INVENTORY: CoverageInventory = {
  ...coverageManifest,
  manifestIdentity: computeCoverageManifestIdentity(coverageManifest),
};

export interface CoverageValidationDiagnostic {
  code: 'coverage_entry_invalid' | 'duplicate_preparation_key' | 'locale_parity_failure' | 'category_reference_invalid' | 'family_mapping_invalid' | 'metadata_missing';
  path: string;
  parameters: Record<string, string | number>;
}

export function validateCoverageInventory(inventory: CoverageInventory): CoverageValidationDiagnostic[] {
  const diagnostics: CoverageValidationDiagnostic[] = [];
  const categoryIds = new Set(inventory.categories.map((item) => item.id));
  const categoryOrders = new Set<number>();
  const keys = new Set<string>();
  const manifest = {
    inventoryId: inventory.inventoryId,
    revision: inventory.revision,
    categories: inventory.categories,
    entries: inventory.entries,
  };
  if (inventory.manifestIdentity !== computeCoverageManifestIdentity(manifest)) {
    diagnostics.push({ code: 'coverage_entry_invalid', path: 'manifestIdentity', parameters: {} });
  }
  inventory.categories.forEach((item, index) => {
    const path = `categories[${index}]`;
    if (!item.id || !item.label.en.trim() || !item.label.el.trim() || item.parentId !== null || item.level !== 0) {
      diagnostics.push({ code: 'coverage_entry_invalid', path, parameters: { category: item.id } });
    }
    if (categoryOrders.has(item.order)) {
      diagnostics.push({ code: 'coverage_entry_invalid', path: `${path}.order`, parameters: { order: item.order } });
    }
    categoryOrders.add(item.order);
  });
  if (inventory.entries.length !== EXPECTED_COVERAGE_ENTRY_COUNT) {
    diagnostics.push({ code: 'coverage_entry_invalid', path: 'entries', parameters: { expected: EXPECTED_COVERAGE_ENTRY_COUNT, actual: inventory.entries.length } });
  }
  inventory.entries.forEach((item, index) => {
    const path = `entries[${index}]`;
    if (!item.preparationKey || keys.has(item.preparationKey) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.preparationKey)) {
      diagnostics.push({ code: keys.has(item.preparationKey) ? 'duplicate_preparation_key' : 'coverage_entry_invalid', path: `${path}.preparationKey`, parameters: { key: item.preparationKey } });
    }
    keys.add(item.preparationKey);
    if (!categoryIds.has(item.primaryCategory)) {
      diagnostics.push({ code: 'category_reference_invalid', path: `${path}.primaryCategory`, parameters: { category: item.primaryCategory } });
    }
    if (!item.label.en.trim() || !item.label.el.trim()) {
      diagnostics.push({ code: 'locale_parity_failure', path: `${path}.label`, parameters: {} });
    }
    if (!Array.isArray(item.aliases) || !Array.isArray(item.candidateStructuralFamilies) || !item.notes) {
      diagnostics.push({ code: 'metadata_missing', path, parameters: { key: item.preparationKey } });
    } else if (!item.candidateStructuralFamilies.length && (!item.notes.en.trim() || !item.notes.el.trim())) {
      diagnostics.push({ code: 'family_mapping_invalid', path: `${path}.candidateStructuralFamilies`, parameters: { key: item.preparationKey } });
    } else if (!item.candidateStructuralFamilies.every(isStructuralFamilyId)) {
      diagnostics.push({ code: 'family_mapping_invalid', path: `${path}.candidateStructuralFamilies`, parameters: { key: item.preparationKey } });
    }
  });
  return diagnostics;
}
