import type { Locale } from './messages';

export interface BatterTable {
  caption: string;
  columns: string[];
  rows: string[][];
  note?: string;
}

export interface BatterDiagram {
  id: string;
  title: string;
  code: string;
  fallback: string;
}

export interface BatterSection {
  id: string;
  number: number;
  eyebrow: string;
  title: string;
  intro: string;
  paragraphs?: string[];
  bullets?: string[];
  tables?: BatterTable[];
  diagrams?: BatterDiagram[];
}

export interface BatterContent {
  eyebrow: string;
  title: string;
  intro: string;
  contentsTitle: string;
  sectionLabel: string;
  tableLabel: string;
  noteLabel: string;
  backToTheory: string;
  linkToReferences: string;
  diagramLabel: string;
  diagramFallbackLabel: string;
  sections: BatterSection[];
}

interface LocalizedText { en: string; el: string }
interface RawTable {
  caption: LocalizedText;
  columns: LocalizedText[];
  rows: LocalizedText[][];
  note?: LocalizedText;
}
interface RawDiagram {
  id: string;
  title: LocalizedText;
  code: LocalizedText;
  fallback: LocalizedText;
}
interface RawSection {
  id: string;
  number: number;
  eyebrow: LocalizedText;
  title: LocalizedText;
  intro: LocalizedText;
  paragraphs?: LocalizedText[];
  bullets?: LocalizedText[];
  tables?: RawTable[];
  diagrams?: RawDiagram[];
}

const tx = (en: string, el: string): LocalizedText => ({ en, el });
const row = (...cells: LocalizedText[]): LocalizedText[] => cells;
const table = (caption: LocalizedText, columns: LocalizedText[], rows: LocalizedText[][], note?: LocalizedText): RawTable => ({ caption, columns, rows, note });

const FAMILY_TREE_EN = `flowchart TD
  B[Mixtures]
  B --> TP[Thin pan]
  B --> G[Griddle-cooked]
  B --> W[Waffle]
  B --> S[Oven-puffed]
  B --> C[Creamy baked]
  B --> CO[Coating]
  B --> F[Fritter]
  B --> FE[Fermented]
  B --> FO[Foam-aerated]
  B --> CA[Near cake]`;

const FAMILY_TREE_EL = `flowchart TD
  B[Μείγματα]
  B --> TP[Λεπτό τηγάνι]
  B --> G[Πλάκα]
  B --> W[Βάφες]
  B --> S[Φούσκωμα στον φούρνο]
  B --> C[Κρεμώδη ψημένα]
  B --> CO[Επικάλυψη]
  B --> F[Fritter]
  B --> FE[Ζύμωση]
  B --> FO[Αφράτα]
  B --> CA[Κοντά στα κέικ]`;

const RAW_SECTIONS: RawSection[] = [
  {
    id: 'foundation', number: 1,
    eyebrow: tx('01 / FOUNDATION', '01 / ΒΑΣΗ'),
    title: tx('What a batter is', 'Τι είναι ένα ρευστό μείγμα'),
    intro: tx('A batter is a pourable or semi-liquid mixture whose structure is created during cooking. Ingredient ratios matter, but they never tell the whole story without the way it is cooked.', 'Το ρευστό μείγμα είναι ένα υγρό ή ημίρρευστο μείγμα του οποίου η δομή δημιουργείται κατά το μαγείρεμα. Οι αναλογίες έχουν σημασία, αλλά δεν αρκούν χωρίς τον τρόπο ψησίματος.'),
    paragraphs: [
      tx('All formula percentages on this map use flour or base solids as 100%. Whole egg is counted by mass. Liquid, egg, fat, sugar, flour/starch, and something that helps the mixture rise are the main ingredients; the pan, griddle, waffle iron, oven, or fryer finish the job.', 'Όλα τα ποσοστά σε αυτόν τον χάρτη χρησιμοποιούν το αλεύρι ή τα στερεά βάσης ως 100%. Το ολόκληρο αυγό υπολογίζεται κατά βάρος. Τα βασικά υλικά είναι το υγρό, το αυγό, το λίπος, η ζάχαρη, το αλεύρι/άμυλο και κάτι που βοηθά το μείγμα να φουσκώσει· το τηγάνι, η πλάκα, το waffle iron, ο φούρνος ή το τηγάνισμα ολοκληρώνουν το αποτέλεσμα.'),
      tx('The same 100 flour / 190 liquid / 100 egg can become a flexible crêpe in a pan or a dramatic Dutch baby in a hot oven. The ingredients are similar; the cooking method changes the result.', 'Τα ίδια 100 αλεύρι / 190 υγρό / 100 αυγό μπορούν να γίνουν εύκαμπτη κρέπα στο τηγάνι ή εντυπωσιακό Dutch baby σε καυτό φούρνο. Τα υλικά είναι παρόμοια· αυτό που αλλάζει το αποτέλεσμα είναι το ψήσιμο.'),
    ],
    tables: [table(
      tx('Eight useful starting points', 'Οκτώ χρήσιμα σημεία εκκίνησης'),
      [tx('Family', 'Οικογένεια'), tx('Liquid %', 'Υγρό %'), tx('Egg %', 'Αυγό %'), tx('Fat %', 'Λίπος %'), tx('Sugar %', 'Ζάχαρη %'), tx('Leavening', 'Διόγκωση'), tx('Cooking', 'Μαγείρεμα'), tx('Texture', 'Υφή')],
      [
        row(tx('Crêpe', 'Κρέπα'), tx('180–220', '180–220'), tx('80–110', '80–110'), tx('10–20', '10–20'), tx('0–10', '0–10'), tx('none', 'καμία'), tx('pan', 'τηγάνι'), tx('thin, flexible', 'λεπτή, εύκαμπτη')),
        row(tx('Pancake', 'Pancake'), tx('100–120', '100–120'), tx('40–60', '40–60'), tx('10–20', '10–20'), tx('10–20', '10–20'), tx('chemical', 'χημική'), tx('griddle', 'πλάκα'), tx('fluffy, tender', 'αφράτη, τρυφερή')),
        row(tx('Waffle', 'Waffle'), tx('100–120', '100–120'), tx('40–60', '40–60'), tx('25–40', '25–40'), tx('10–20', '10–20'), tx('chemical / foam', 'χημική / αφρός'), tx('waffle iron', 'waffle iron'), tx('crisp + tender', 'τραγανή + μαλακή')),
        row(tx('Buttermilk pancake', 'Pancake με buttermilk'), tx('100–120', '100–120'), tx('40–50', '40–50'), tx('15–20', '15–20'), tx('10–15', '10–15'), tx('acid + baking soda', 'οξύ + μαγειρική σόδα'), tx('griddle', 'πλάκα'), tx('fluffy, tangy', 'αφράτη, όξινη')),
        row(tx('Dutch baby / Yorkshire', 'Dutch baby / Yorkshire'), tx('180–200', '180–200'), tx('90–110', '90–110'), tx('20–30', '20–30'), tx('0', '0'), tx('steam', 'ατμός'), tx('oven', 'φούρνος'), tx('puffed, creamy', 'φουσκωμένη, κρεμώδης')),
        row(tx('Tempura', 'Tempura'), tx('140–170', '140–170'), tx('30–50', '30–50'), tx('0', '0'), tx('0', '0'), tx('steam', 'ατμός'), tx('deep fry', 'βαθύ τηγάνισμα'), tx('light brittle shell', 'ελαφριά εύθραυστη κρούστα')),
        row(tx('Beer batter', 'Μείγμα μπύρας'), tx('110–140', '110–140'), tx('0–30', '0–30'), tx('0–10', '0–10'), tx('0–5', '0–5'), tx('gas + steam', 'αέριο + ατμός'), tx('deep fry', 'βαθύ τηγάνισμα'), tx('thick crisp shell', 'παχιά τραγανή κρούστα')),
        row(tx('Pourable cake mixture', 'Ρευστό μείγμα για κέικ'), tx('60–90', '60–90'), tx('50–100', '50–100'), tx('50–100', '50–100'), tx('70–120', '70–120'), tx('chemical / foam', 'χημική / αφρός'), tx('oven', 'φούρνος'), tx('tender crumb', 'τρυφερή ψίχα')),
      ],
      tx('These ranges are practical guides, not strict limits.', 'Αυτά τα εύρη είναι πρακτικοί οδηγοί και όχι αυστηρά όρια.'),
    )],
  },
  {
    id: 'taxonomy', number: 2,
    eyebrow: tx('02 / BATTER FAMILIES', '02 / ΟΙΚΟΓΕΝΕΙΕΣ ΜΕΙΓΜΑΤΩΝ'),
    title: tx('Ten main types of mixture', 'Δέκα βασικά είδη μειγμάτων'),
    intro: tx('The family tells us what role the mixture plays and how it is cooked. Some mixtures sit between families because their ingredients, air, additions, or cooking method overlap.', 'Η οικογένεια δείχνει τι ρόλο έχει το μείγμα και πώς μαγειρεύεται. Ορισμένα μείγματα βρίσκονται ανάμεσα σε δύο οικογένειες, επειδή μοιάζουν στα υλικά, στον αέρα, στις προσθήκες ή στον τρόπο μαγειρέματος.'),
    paragraphs: [tx('Savoury baked mixtures sit between categories rather than forming an eleventh family. A cheese, vegetable, or cornbread-like mixture may belong near cake, fritter, or griddle depending on how it is cooked and what holds it together.', 'Τα αλμυρά ψημένα μείγματα βρίσκονται ανάμεσα στις κατηγορίες και δεν αποτελούν ενδέκατη οικογένεια. Ένα μείγμα με τυρί, λαχανικά ή καλαμπόκι μπορεί να βρίσκεται κοντά στα κέικ, στα fritters ή στα μείγματα για πλάκα, ανάλογα με το ψήσιμο και με αυτό που του δίνει τη δομή.')],
    tables: [table(
      tx('The ten families and how they differ', 'Οι δέκα οικογένειες και οι διαφορές τους'),
      [tx('Family', 'Οικογένεια'), tx('Typical examples', 'Συνηθισμένα παραδείγματα'), tx('What mainly makes it different', 'Τι την ξεχωρίζει κυρίως')],
      [
        row(tx('Thin pan batters', 'Λεπτά μείγματα τηγανιού'), tx('crêpe, galette', 'κρέπα, galette'), tx('fluid spread + setting', 'άπλωμα + πήξη')),
        row(tx('Griddle batters', 'Μείγματα για πλάκα'), tx('pancakes, blini', 'pancakes, blini'), tx('chemical / biological / foam lift', 'χημική / βιολογική / αφρώδης διόγκωση')),
        row(tx('Waffle batters', 'Μείγματα waffle'), tx('American, Brussels, Liège, starch-heavy', 'American, Brussels, Liège, πολύσπορα'), tx('lift + surface dehydration', 'διόγκωση + επιφανειακή αφυδάτωση')),
        row(tx('Steam-puffed baked', 'Ψημένα με διόγκωση ατμού'), tx('Dutch baby, Yorkshire, popover', 'Dutch baby, Yorkshire, popover'), tx('steam + rapid setting', 'ατμός + γρήγορη πήξη')),
        row(tx('Creamy baked mixtures', 'Κρεμώδη ψημένα μείγματα'), tx('clafoutis, Far Breton, flaugnarde', 'clafoutis, Far Breton, flaugnarde'), tx('egg coagulation + starch set', 'πήξη αυγού + άμυλο')),
        row(tx('Coating batters', 'Μείγματα επικάλυψης'), tx('tempura, beer, sparkling water, pakora', 'tempura, μπύρα, ανθρακούχο, pakora'), tx('rapid frying dehydration', 'γρήγορη αφυδάτωση στο λάδι')),
        row(tx('Fritter mixtures', 'Μείγματα για fritter'), tx('vegetable, corn, fruit, beignet', 'λαχανικών, καλαμποκιού, φρούτων και beignet'), tx('the mixture becomes the main body', 'το μείγμα γίνεται το κύριο σώμα')),
        row(tx('Fermented batters', 'Μείγματα με ζύμωση'), tx('dosa, injera, yeasted blini, sourdough pancake', 'dosa, injera, blini, sourdough pancake'), tx('biological leavening + pH change', 'βιολογική διόγκωση + αλλαγή pH')),
        row(tx('Foam-leavened', 'Μείγματα με αφρό'), tx('foam waffle, soufflé pancake, sponge-type', 'foam waffle, soufflé pancake, sponge-type'), tx('mechanical egg foam', 'μηχανικός αφρός αυγού')),
        row(tx('Near cake', 'Κοντά στα κέικ'), tx('pour cake, muffin, quick bread, oil/butter cake', 'pour cake, muffin, quick bread, oil/butter cake'), tx('fat/sugar + set crumb', 'λίπος/ζάχαρη + πήξη ψίχας')),
        row(tx('Savoury baked mixtures', 'Αλμυρά ψημένα μείγματα'), tx('cornbread, savoury muffin, cheese mixture, vegetable bake', 'cornbread, savoury muffin, μείγμα με τυρί, ψημένα λαχανικά'), tx('overlap between quick bread, cake, and fritter', 'κοινά στοιχεία με γρήγορα ψωμιά, κέικ και fritters')),
      ],
    )],
    diagrams: [{ id: 'family-tree', title: tx('Batter family tree', 'Οι βασικές κατηγορίες των μειγμάτων'), code: tx(FAMILY_TREE_EN, FAMILY_TREE_EL), fallback: tx('The batter family is organised into thin crêpes, thicker pan-cooked batters, waffles, batters that puff in the oven, creamy baked batters, frying coatings, fritters, fermented and foam-based batters, and batters that are close to cake.', 'Τα μείγματα χωρίζονται σε λεπτές κρέπες, πιο παχιά μείγματα για τηγάνι ή πλάκα, βάφλες, μείγματα που φουσκώνουν στον φούρνο, κρεμώδη ψημένα μείγματα, μείγματα για επικάλυψη και τηγάνισμα, τηγανίτες με υλικά μέσα τους, ζυμωμένα και αφράτα μείγματα, καθώς και μείγματα που πλησιάζουν τα κέικ.') }],
  },
  {
    id: 'composition', number: 3,
    eyebrow: tx('03 / KEY INGREDIENTS', '03 / ΒΑΣΙΚΑ ΥΛΙΚΑ'),
    title: tx('The ingredients that change the result', 'Τα υλικά που αλλάζουν το αποτέλεσμα'),
    intro: tx('The useful question is not only which ingredient is present, but what job it performs in the mixture.', 'Η χρήσιμη ερώτηση δεν είναι μόνο ποιο υλικό υπάρχει, αλλά ποια δουλειά κάνει μέσα στο μείγμα.'),
    tables: [
      table(tx('The main ingredients that change the result', 'Τα βασικά υλικά που αλλάζουν το αποτέλεσμα'), [tx('Ingredient', 'Υλικό'), tx('When it rises', 'Όταν αυξάνεται')], [
        row(tx('Liquid', 'Υγρό'), tx('More fluid batter and a thinner final product.', 'Πιο ρευστό μείγμα και λεπτότερο τελικό προϊόν.')),
        row(tx('Egg', 'Αυγό'), tx('More structure, elasticity, browning, and a creamy centre.', 'Περισσότερη δομή, ελαστικότητα, ρόδισμα και πιο κρεμώδες κέντρο.')),
        row(tx('Fat', 'Λίπος'), tx('More tenderness and richness; with enough drying, more crispness.', 'Περισσότερη τρυφερότητα και πλούσια γεύση· με αρκετό στέγνωμα, περισσότερη τραγανότητα.')),
        row(tx('Sugar', 'Ζάχαρη'), tx('More browning, softness, and sweetness.', 'Περισσότερο ρόδισμα, μαλάκωμα και γλυκύτητα.')),
        row(tx('Leavening', 'Διόγκωση'), tx('More height and gas until the structure can no longer retain it.', 'Περισσότερο ύψος και αέριο μέχρι να ξεπεραστεί η ικανότητα συγκράτησης.')),
        row(tx('Acidity', 'Οξύτητα'), tx('Changes the balance with baking soda, flavour, and tenderness.', 'Αλλάζει την ισορροπία με τη μαγειρική σόδα, τη γεύση και την τρυφερότητα.')),
        row(tx('Starch / low-gluten flour', 'Άμυλο / άλευρο χαμηλής γλουτένης'), tx('Suppresses gluten and can increase crispness.', 'Περιορίζει τη γλουτένη και μπορεί να αυξήσει την τραγανότητα.')),
      ]),
      table(tx('Additions and their physical role', 'Προσθήκες και φυσικός ρόλος'), [tx('Addition', 'Προσθήκη'), tx('Treatment', 'Χειρισμός'), tx('What it changes', 'Τι αλλάζει')], [
        row(tx('Vanilla, spice, pepper, herbs, zest', 'Βανίλια, μπαχαρικά, πιπέρι, βότανα, zest'), tx('Small amount', 'Μικρή ποσότητα'), tx('Mostly flavour; little structural change.', 'Κυρίως γεύση· μικρή αλλαγή στη δομή.')),
        row(tx('Cocoa', 'Cocoa'), tx('Replace flour: 90 flour + 10 cocoa.', 'Αντικατάσταση αλευριού: 90 αλεύρι + 10 cocoa.'), tx('Adds dry solids and absorbs liquid.', 'Προσθέτει ξηρά στερεά και απορροφά υγρό.')),
        row(tx('Cheese', 'Τυρί'), tx('10–30% direction', 'Κατεύθυνση 10–30%'), tx('Adds fat, protein, salt, and solids; may need more liquid.', 'Προσθέτει λίπος, πρωτεΐνη, αλάτι και στερεά· μπορεί να χρειαστεί περισσότερο υγρό.')),
        row(tx('Fruit purée', 'Πουρές φρούτου'), tx('Replace part of liquid.', 'Αντικατάσταση μέρους υγρού.'), tx('Adds water, sugars, fibre, and starch.', 'Προσθέτει νερό, σάκχαρα, ίνες και άμυλο.')),
         row(tx('Yogurt', 'Γιαούρτι'), tx('60 milk + 50 yogurt rather than 110 milk.', '60 γάλα + 50 γιαούρτι αντί για 110 γάλα.'), tx('Adds acidity and dairy solids without simply stacking liquid.', 'Προσθέτει οξύτητα και γαλακτικά στερεά χωρίς απλή πρόσθεση υγρού.')),
       ]),
      table(tx('Four things that control the result', 'Τέσσερα πράγματα που ελέγχουν το αποτέλεσμα'), [tx('Control', 'Παράγοντας'), tx('Movement', 'Μεταβολή'), tx('Primary effect', 'Κύρια επίδραση')], [
        row(tx('Viscosity', 'Ιξώδες'), tx('Flour ↔ liquid', 'Αλεύρι ↔ υγρό'), tx('Spread and thickness', 'Άπλωμα και πάχος')),
        row(tx('Structure', 'Δομή'), tx('Egg ↔ flour ↔ starch', 'Αυγό ↔ αλεύρι ↔ άμυλο'), tx('Elasticity, set, creamy character', 'Ελαστικότητα, πήξη, κρεμώδης χαρακτήρας')),
        row(tx('Tenderness / crispness', 'Τρυφερότητα / τραγανότητα'), tx('Fat ↔ starch ↔ sugar', 'Λίπος ↔ άμυλο ↔ ζάχαρη'), tx('Softness, richness, shell', 'Μαλακότητα, πλούσια γεύση, κέλυφος')),
        row(tx('Expansion', 'Διόγκωση'), tx('Baking powder / baking soda / foam / steam', 'Μπέικιν πάουντερ / μαγειρική σόδα / αφρός / ατμός'), tx('Height, cells, hollow structure', 'Ύψος, κυψέλες, κοίλη δομή')),
      ]),
    ],
  },
  {
    id: 'thermal', number: 4,
    eyebrow: tx('04 / COOKING METHOD', '04 / ΤΡΟΠΟΣ ΜΑΓΕΙΡΕΜΑΤΟΣ'),
    title: tx('The way you cook changes the result', 'Ο τρόπος ψησίματος αλλάζει το αποτέλεσμα'),
    intro: tx('The ingredients set the starting point; the cooking surface decides how water becomes steam, how fast the surface sets, and how much gas remains trapped.', 'Τα υλικά δίνουν την αρχική βάση· η επιφάνεια μαγειρέματος αποφασίζει πώς το νερό γίνεται ατμός, πόσο γρήγορα πήζει η επιφάνεια και πόσο αέριο παγιδεύεται.'),
    tables: [
      table(tx('How each cooking method changes the result', 'Πώς αλλάζει το αποτέλεσμα κάθε τρόπος μαγειρέματος'), [tx('Method', 'Μέθοδος'), tx('What it favours', 'Τι ευνοεί'), tx('Typical branches', 'Τυπικά είδη')], [
        row(tx('Pan', 'Τηγάνι'), tx('Spread and fast setting', 'Άπλωμα και γρήγορη πήξη'), tx('Crêpe, thin pan', 'Κρέπα, λεπτό τηγάνι')),
        row(tx('Griddle', 'Πλάκα'), tx('Controlled vertical rise', 'Ελεγχόμενη κατακόρυφη διόγκωση'), tx('Pancake, blini', 'Pancake, blini')),
        row(tx('Waffle iron', 'Waffle iron'), tx('Extreme contact heating and surface dehydration', 'Έντονη επαφή και επιφανειακή αφυδάτωση'), tx('Waffle', 'Waffle')),
        row(tx('Oven', 'Φούρνος'), tx('Steam expansion and deeper setting', 'Διόγκωση ατμού και βαθύτερη πήξη'), tx('Dutch baby, custard, cake', 'Dutch baby, custard, cake')),
        row(tx('Shallow fry', 'Ρηχό τηγάνισμα'), tx('A fritter with a crisp exterior', 'Fritter με τραγανή επιφάνεια'), tx('Vegetable fritter', 'Fritter λαχανικών')),
        row(tx('Deep fry', 'Βαθύ τηγάνισμα'), tx('Explosive surface dehydration', 'Εκρηκτική επιφανειακή αφυδάτωση'), tx('Tempura, beer, coating', 'Tempura, beer, coating')),
      ]),
      table(tx('Six useful zones', 'Έξι βασικές ζώνες'), [tx('Zone', 'Ζώνη'), tx('Composition', 'Σύσταση'), tx('How it behaves', 'Πώς συμπεριφέρεται')], [
        row(tx('A — Thin unleavened', 'A — Λεπτό χωρίς διόγκωση'), tx('High liquid, low fat, zero leavening', 'Υψηλό υγρό, χαμηλό λίπος, μηδενική διόγκωση'), tx('Crêpe / galette; thin and flexible', 'Crêpe / galette· λεπτό και εύκαμπτο')),
        row(tx('B — Soft chemical', 'B — Μαλακό χημικό'), tx('Medium liquid and egg, medium lift', 'Μέτριο υγρό και αυγό, μέτρια διόγκωση'), tx('Pancake; soft and fluffy', 'Pancake· μαλακό και αφράτο')),
        row(tx('C — Crisp chemical', 'C — Τραγανό χημικό'), tx('Medium liquid, higher fat, high drying', 'Μέτριο υγρό, περισσότερο λίπος, έντονο στέγνωμα'), tx('Waffle; crisp shell', 'Waffle· τραγανό κέλυφος')),
        row(tx('D — Steam-leavened', 'D — Με ατμό'), tx('Very high liquid and egg, high heat', 'Πολύ υψηλό υγρό και αυγό, υψηλή θερμότητα'), tx('Dutch baby / Yorkshire / popover', 'Dutch baby / Yorkshire / popover')),
        row(tx('E — Frying coatings', 'E — Επικαλύψεις τηγανίσματος'), tx('High liquid, low gluten development', 'Υψηλό υγρό, χαμηλή ανάπτυξη γλουτένης'), tx('Tempura / beer; rapid dehydration', 'Tempura / beer· γρήγορη αφυδάτωση')),
        row(tx('F — Moving towards cake', 'F — Προς τα κέικ'), tx('Lower relative liquid, high sugar and fat', 'Χαμηλότερο σχετικό υγρό, υψηλή ζάχαρη και λίπος'), tx('Cake mixture; tender crumb with structure', 'Μείγμα για κέικ· τρυφερή ψίχα με δομή')),
      ]),
      table(tx('Low, medium, and high ranges', 'Χαμηλά, μέτρια και υψηλά επίπεδα'), [tx('Axis', 'Παράγοντας'), tx('Low', 'Χαμηλό'), tx('Medium', 'Μέτριο'), tx('High', 'Υψηλό')], [
        row(tx('Liquid', 'Υγρό'), tx('70–100; thick mixture', '70–100· παχύ μείγμα'), tx('100–140; pourable but holds body', '100–140· ρευστό αλλά κρατά σώμα'), tx('140–220; very fluid', '140–220· πολύ ρευστό')),
        row(tx('Egg', 'Αυγό'), tx('0–30; little protein structure', '0–30· λίγη πρωτεϊνική δομή'), tx('30–70; visible structure and elasticity', '30–70· αισθητή δομή και ελαστικότητα'), tx('70–130; firm set and creamy centre', '70–130· έντονη πήξη και κρεμώδες κέντρο')),
        row(tx('Fat', 'Λίπος'), tx('0–10; lean and chewy', '0–10· λίγο λίπος και πιο μαστιχωτό'), tx('10–25; tender', '10–25· τρυφερό'), tx('25–50; rich, crisp/tender', '25–50· πλούσιο, τραγανό/τρυφερό')),
        row(tx('Leavening', 'Διόγκωση'), tx('0; flat or steam-driven', '0· επίπεδο ή με ατμό'), tx('about 2–4% baking powder equivalent', 'περίπου 2–4% ισοδύναμο μπέικιν πάουντερ'), tx('about 4–7%; fluffy/cake-like', 'περίπου 4–7%· αφράτο/σαν κέικ')),
      ]),
    ],
  },
  {
    id: 'canonical-formulas', number: 5,
    eyebrow: tx('05 / FORMULA EXAMPLES', '05 / ΠΑΡΑΔΕΙΓΜΑΤΑ ΦΟΡΜΟΥΛΩΝ'),
    title: tx('Basic formulas and how they are prepared', 'Βασικές φόρμουλες και τρόπος παρασκευής'),
     intro: tx('The formulas below are practical starting points based on 500 g of flour or other main dry ingredient. The ranges show how the texture changes; the example amounts make comparisons easier.', 'Οι παρακάτω φόρμουλες είναι πρακτικά σημεία εκκίνησης με βάση 500 g αλευριού ή άλλου βασικού στερεού υλικού. Τα εύρη δείχνουν πώς αλλάζει η υφή, ενώ τα παραδείγματα βοηθούν στη σύγκριση.'),
     paragraphs: [tx('The important difference is what we are trying to achieve: a smooth pourable mixture, very little mixing for a light coating, gentle folding for foam, fermentation, or creaming fat and sugar when moving towards cake. The goal matters more than an invented exact time.', 'Η σημαντική διαφορά είναι ο στόχος: ένα λείο ρευστό μείγμα, ελάχιστη ανάμειξη για ελαφριά επικάλυψη, ήπιο δίπλωμα για να κρατήσει ο αφρός, ζύμωση ή κρεμοποίηση λίπους και ζάχαρης όταν πλησιάζουμε τα κέικ. Ο στόχος έχει μεγαλύτερη σημασία από έναν αυθαίρετο ακριβή χρόνο.')],
    tables: [
      table(tx('Examples of basic formulas', 'Παραδείγματα βασικών φορμουλών'), [tx('Formula', 'Φόρμουλα'), tx('500 g base formula', 'Φόρμουλα βάσης 500 g'), tx('How it is prepared', 'Τρόπος παρασκευής')], [
        row(tx('Basic crêpe', 'Βασική κρέπα'), tx('500 flour / 950 milk / 500 egg / 90 butter / 40 sugar / 7.5 salt', '500 αλεύρι / 950 γάλα / 500 αυγό / 90 βούτυρο / 40 ζάχαρη / 7,5 αλάτι'), tx('Whisk; pan; thin sheet; no leavening', 'Χτύπημα· τηγάνι· λεπτό φύλλο· χωρίς διόγκωση')),
        row(tx('Basic pancake', 'Βασικό pancake'), tx('500 flour / 550 milk / 250 egg / 75 butter / 75 sugar / 25 baking powder / 7.5 salt', '500 αλεύρι / 550 γάλα / 250 αυγό / 75 βούτυρο / 75 ζάχαρη / 25 μπέικιν πάουντερ / 7,5 αλάτι'), tx('Whisk; griddle; chemical lift', 'Χτύπημα· πλάκα· χημική διόγκωση')),
        row(tx('Basic waffle', 'Βασική βάφλα'), tx('500 flour / 550 milk / 250 egg / 150 butter / 75 sugar / 20 baking powder / 7.5 salt', '500 αλεύρι / 550 γάλα / 250 αυγό / 150 βούτυρο / 75 ζάχαρη / 20 μπέικιν πάουντερ / 7,5 αλάτι'), tx('Whisk; waffle iron; surface drying', 'Χτύπημα· waffle iron· επιφανειακό στέγνωμα')),
        row(tx('Buttermilk pancake', 'Pancake με buttermilk'), tx('500 flour / 550 buttermilk / 225 egg / 90 butter / 60 sugar / 15 baking powder / 6 baking soda / 7.5 salt', '500 αλεύρι / 550 buttermilk / 225 αυγό / 90 βούτυρο / 60 ζάχαρη / 15 μπέικιν πάουντερ / 6 μαγειρική σόδα / 7,5 αλάτι'), tx('Whisk; acid–baking soda balance; griddle', 'Χτύπημα· ισορροπία οξέος–μαγειρικής σόδας· πλάκα')),
        row(tx('Dutch baby', 'Dutch baby'), tx('500 flour / 950 milk / 500 egg / 125 butter / 7.5 salt', '500 αλεύρι / 950 γάλα / 500 αυγό / 125 βούτυρο / 7,5 αλάτι'), tx('Whisk; very hot oven and vessel; steam', 'Χτύπημα· πολύ ζεστός φούρνος και σκεύος· ατμός')),
        row(tx('Tempura', 'Tempura'), tx('500 flour / 750 water / 200 egg / 5 salt', '500 αλεύρι / 750 νερό / 200 αυγό / 5 αλάτι'), tx('Cold minimal combine; deep fry; brittle coating', 'Κρύα ελάχιστη ανάμειξη· βαθύ τηγάνισμα· εύθραυστη επικάλυψη')),
        row(tx('Beer mixture', 'Μείγμα μπύρας'), tx('500 flour / 625 beer / 10 baking powder / 7.5 salt', '500 αλεύρι / 625 μπύρα / 10 μπέικιν πάουντερ / 7,5 αλάτι'), tx('Minimal combine; deep fry; thicker coating', 'Ελάχιστη ανάμειξη· βαθύ τηγάνισμα· παχύτερη επικάλυψη')),
         row(tx('Pourable cake mixture', 'Ρευστό μείγμα για κέικ'), tx('500 flour / 375 milk / 375 egg / 350 sugar / 450 butter / 20 baking powder', '500 αλεύρι / 375 γάλα / 375 αυγό / 350 ζάχαρη / 450 βούτυρο / 20 μπέικιν πάουντερ'), tx('Cream/emulsify; oven; set crumb', 'Κρεμοποίηση/γαλακτωματοποίηση· φούρνος· πήξη ψίχας')),
       ]),
      table(tx('Table of basic mixtures', 'Πίνακας βασικών μειγμάτων'), [tx('Family', 'Οικογένεια'), tx('Liquid %', 'Υγρό %'), tx('Egg %', 'Αυγό %'), tx('Fat %', 'Λίπος %'), tx('Sugar %', 'Ζάχαρη %'), tx('Leavening', 'Διόγκωση'), tx('Cooking', 'Μαγείρεμα'), tx('Typical texture', 'Τυπική υφή')], [
        row(tx('Crêpe', 'Crêpe'), tx('180–220', '180–220'), tx('80–110', '80–110'), tx('10–20', '10–20'), tx('0–10', '0–10'), tx('none', 'καμία'), tx('pan', 'τηγάνι'), tx('thin, flexible', 'λεπτή, εύκαμπτη')),
        row(tx('Galette-type', 'Τύπου galette'), tx('180–220', '180–220'), tx('0–40', '0–40'), tx('0–10', '0–10'), tx('0', '0'), tx('none', 'καμία'), tx('pan', 'τηγάνι'), tx('thin, rustic', 'λεπτή, χωριάτικη')),
        row(tx('Thin pancake', 'Thin pancake'), tx('120–140', '120–140'), tx('35–50', '35–50'), tx('5–15', '5–15'), tx('5–15', '5–15'), tx('low chemical', 'χαμηλή χημική'), tx('griddle', 'πλάκα'), tx('soft, thin', 'μαλακή, λεπτή')),
        row(tx('American pancake', 'American pancake'), tx('95–120', '95–120'), tx('40–60', '40–60'), tx('10–20', '10–20'), tx('10–20', '10–20'), tx('medium chemical', 'μέτρια χημική'), tx('griddle', 'πλάκα'), tx('fluffy, tender', 'αφράτη, τρυφερή')),
        row(tx('Buttermilk pancake', 'Pancake με buttermilk'), tx('100–120', '100–120'), tx('40–55', '40–55'), tx('10–20', '10–20'), tx('10–15', '10–15'), tx('baking soda + acid', 'μαγειρική σόδα + οξύ'), tx('griddle', 'πλάκα'), tx('fluffy, tender', 'αφράτη, τρυφερή')),
        row(tx('Scotch / drop scone', 'Scotch / drop scone'), tx('80–100', '80–100'), tx('40–60', '40–60'), tx('10–20', '10–20'), tx('15–25', '15–25'), tx('medium-high chemical', 'μέτρια-υψηλή χημική'), tx('griddle', 'πλάκα'), tx('thick, cake-like', 'παχύ, σαν κέικ')),
        row(tx('Waffle', 'Waffle'), tx('95–120', '95–120'), tx('40–60', '40–60'), tx('20–40', '20–40'), tx('10–25', '10–25'), tx('chemical', 'χημική'), tx('waffle iron', 'waffle iron'), tx('crisp outside, soft inside', 'τραγανή έξω, μαλακή μέσα')),
        row(tx('Foam waffle', 'Foam waffle'), tx('90–110', '90–110'), tx('60–90', '60–90'), tx('25–40', '25–40'), tx('15–25', '15–25'), tx('foam + chemical', 'αφρός + χημική'), tx('waffle iron', 'waffle iron'), tx('airy + crisp', 'αέρινη + τραγανή')),
        row(tx('Dutch baby', 'Dutch baby'), tx('170–210', '170–210'), tx('90–130', '90–130'), tx('15–30', '15–30'), tx('0–15', '0–15'), tx('steam', 'ατμός'), tx('oven', 'φούρνος'), tx('puffed, creamy', 'φουσκωμένη, κρεμώδης')),
        row(tx('Yorkshire pudding', 'Yorkshire pudding'), tx('170–220', '170–220'), tx('80–120', '80–120'), tx('low in mixture', 'χαμηλό στο μείγμα'), tx('0', '0'), tx('steam', 'ατμός'), tx('very hot oven', 'πολύ ζεστός φούρνος'), tx('hollow, crisp edges', 'κοίλη, τραγανές άκρες')),
        row(tx('Popover', 'Popover'), tx('170–220', '170–220'), tx('80–120', '80–120'), tx('10–20', '10–20'), tx('0–5', '0–5'), tx('steam', 'ατμός'), tx('oven / mould', 'φούρνος / καλούπι'), tx('hollow, crisp', 'κοίλη, τραγανή')),
        row(tx('Tempura', 'Tempura'), tx('140–180', '140–180'), tx('0–40', '0–40'), tx('0', '0'), tx('0', '0'), tx('steam', 'ατμός'), tx('deep fry', 'βαθύ τηγάνισμα'), tx('light, crisp crust', 'ελαφριά, τραγανή κρούστα')),
        row(tx('Beer batter', 'Beer batter'), tx('110–150', '110–150'), tx('0–30', '0–30'), tx('0–10', '0–10'), tx('0–5', '0–5'), tx('gas + steam', 'αέριο + ατμός'), tx('deep fry', 'βαθύ τηγάνισμα'), tx('airy crisp crust', 'αέρινη τραγανή κρούστα')),
        row(tx('Thick frying mixture', 'Παχύ μείγμα τηγανίσματος'), tx('90–120', '90–120'), tx('20–50', '20–50'), tx('0–15', '0–15'), tx('0–10', '0–10'), tx('chemical', 'χημική'), tx('deep fry', 'βαθύ τηγάνισμα'), tx('thick coating', 'παχιά επικάλυψη')),
        row(tx('Fritter mixture', 'Μείγμα για fritter'), tx('80–120', '80–120'), tx('30–60', '30–60'), tx('5–20', '5–20'), tx('0–20', '0–20'), tx('chemical / none', 'χημική / καμία'), tx('fry', 'τηγάνισμα'), tx('dense to fluffy', 'πυκνή έως αφράτη')),
        row(tx('Cake batter', 'Cake batter'), tx('60–100', '60–100'), tx('50–100', '50–100'), tx('50–100', '50–100'), tx('70–120', '70–120'), tx('chemical / foam', 'χημική / αφρός'), tx('oven', 'φούρνος'), tx('tender crumb', 'τρυφερή ψίχα')),
      ]),
      table(tx('Variant directions', 'Κατευθύνσεις παραλλαγών'), [tx('Direction', 'Κατεύθυνση'), tx('Formula percentages', 'Ποσοστά φόρμουλας'), tx('Physical result', 'Αποτέλεσμα')], [
        row(tx('Delicate crêpe', 'Λεπτή κρέπα'), tx('100 / 220 liquid / 90 egg / 15 fat', '100 / 220 υγρό / 90 αυγό / 15 λίπος'), tx('Thinner, fragile, less egg flavour', 'Λεπτότερη, εύθραυστη, με λιγότερη γεύση αυγού')),
        row(tx('Elastic crêpe', 'Ελαστική κρέπα'), tx('100 / 170 liquid / 120 egg / 15 fat', '100 / 170 υγρό / 120 αυγό / 15 λίπος'), tx('More flexible and filling-friendly', 'Πιο ελαστική και ανθεκτική στη γέμιση')),
        row(tx('Tender crêpe', 'Μαλακή κρέπα'), tx('100 / 190 liquid / 100 egg / 30 fat', '100 / 190 υγρό / 100 αυγό / 30 λίπος'), tx('Softer and richer', 'Μαλακότερη και πλουσιότερη')),
        row(tx('Fluffy pancake', 'Αφράτο pancake'), tx('100 / 100 / 50 / 15 / 15 / 6 baking powder', '100 / 100 / 50 / 15 / 15 / 6 μπέικιν πάουντερ'), tx('Thicker mixture and stronger lift', 'Παχύτερο μείγμα και μεγαλύτερη διόγκωση')),
        row(tx('Diner pancake', 'Pancake τύπου diner'), tx('100 / 130 / 45 / 10 / 10 / 4 baking powder', '100 / 130 / 45 / 10 / 10 / 4 μπέικιν πάουντερ'), tx('More spread, less height', 'Περισσότερο άπλωμα, μικρότερο ύψος')),
        row(tx('Tender pancake', 'Μαλακό pancake'), tx('100 / 110 / 50 / 25 / 15 / 5 baking powder', '100 / 110 / 50 / 25 / 15 / 5 μπέικιν πάουντερ'), tx('Fat softens the crumb', 'Το λίπος μαλακώνει την ψίχα')),
        row(tx('Cake-like / chewy pancake', 'Pancake σαν κέικ / μαστιχωτό'), tx('Cake-like: 100 / 95 / 60 / 20 / 20 / 6 baking powder; chewy: 100 / 115 / 35 / 7.5 / 7.5 / 3 baking powder', 'Σαν κέικ: 100 / 95 / 60 / 20 / 20 / 6 μπέικιν πάουντερ· μαστιχωτό: 100 / 115 / 35 / 7,5 / 7,5 / 3 μπέικιν πάουντερ'), tx('Opposite routes: more set versus more gluten chew', 'Αντίθετες κατευθύνσεις: περισσότερη πήξη έναντι περισσότερης μάσησης')),
        row(tx('Crisp / soft waffle', 'Τραγανή / μαλακή βάφλα'), tx('Crisp: 100 / 100 / 50 / 37.5 / 10 / 4 baking powder; soft: 100 / 120 / 55 / 20 / 20 / 5 baking powder', 'Τραγανή: 100 / 100 / 50 / 37,5 / 10 / 4 μπέικιν πάουντερ· μαλακή: 100 / 120 / 55 / 20 / 20 / 5 μπέικιν πάουντερ'), tx('Water, fat, and surface drying move together', 'Νερό, λίπος και επιφανειακό στέγνωμα κινούνται μαζί')),
        row(tx('Starch waffle / Belgian foam', 'Waffle με άμυλο / Belgian αφρό'), tx('70 flour + 30 starch; Belgian: 100 flour / 100 milk / 70 egg / 35 fat / 20 sugar', '70 αλεύρι + 30 άμυλο· Belgian: 100 αλεύρι / 100 γάλα / 70 αυγό / 35 λίπος / 20 ζάχαρη'), tx('Crisp shell or chemical + egg foam', 'Τραγανό κέλυφος ή χημική + αφρός αυγού')),
        row(tx('Dutch, tempura, beer directions', 'Κατευθύνσεις Dutch, tempura, beer'), tx('Egg-rich: 170 liquid / 130 egg; high-liquid: 220 / 100; tempura 70/30 starch at 165 liquid; beer 150 thin or 110 thick', 'Egg-rich: 170 υγρό / 130 αυγό· high-liquid: 220 / 100· tempura 70/30 άμυλο με 165 υγρό· beer 150 λεπτό ή 110 παχύ'), tx('Steam balance, brittle shell, or retained coating gas', 'Ισορροπία ατμού, εύθραυστο κέλυφος ή συγκρατημένο αέριο επικάλυψης')),
        row(tx('Flavour variants and four additional directions', 'Γευστικές παραλλαγές και τέσσερις πρόσθετες κατευθύνσεις'), tx('Cheese-herb waffle; chocolate 90/10 flour-cocoa; banana 70 milk + 50 banana; clafoutis, vegetable fritter, sourdough pancake, soufflé pancake', 'Waffle τυριού-βοτάνων· σοκολάτα 90/10 αλεύρι-cocoa· μπανάνα 70 γάλα + 50 μπανάνα· clafoutis, vegetable fritter, sourdough pancake, soufflé pancake'), tx('Additions alter solids, water, protein, and process—not only flavour', 'Οι προσθήκες αλλάζουν στερεά, νερό, πρωτεΐνη και διαδικασία· όχι μόνο γεύση')),
      ]),
    ],
  },
  {
    id: 'continuums', number: 6,
    eyebrow: tx('06 / HOW THE TYPES CHANGE', '06 / ΠΩΣ ΑΛΛΑΖΟΥΝ ΤΑ ΕΙΔΗ'),
    title: tx('From pan to waffle', 'Από το τηγάνι στη βάφλα'),
    intro: tx('Crêpe → thin pancake → pancake → thick pancake mainly changes through liquid and leavening. Pancake → waffle mainly changes through fat and the cooking equipment.', 'Από την κρέπα στο λεπτό και μετά στο παχύ pancake αλλάζουν κυρίως το υγρό και η διόγκωση. Από το pancake στη βάφλα αλλάζουν κυρίως το λίπος και ο εξοπλισμός.'),
    tables: [
      table(tx('The path from crêpe to thick pancake', 'Η διαδρομή από την κρέπα στο παχύ pancake'), [tx('Category', 'Κατηγορία'), tx('Liquid', 'Υγρό'), tx('Leavening', 'Διόγκωση'), tx('Result', 'Αποτέλεσμα')], [
        row(tx('Crêpe', 'Κρέπα'), tx('Very high', 'Πολύ υψηλό'), tx('0', '0'), tx('Thin and flexible', 'Λεπτή και εύκαμπτη')),
        row(tx('Thin pancake', 'Thin pancake'), tx('High', 'Υψηλό'), tx('Low', 'Χαμηλή'), tx('Soft, thin', 'Μαλακό, λεπτό')),
        row(tx('Pancake', 'Pancake'), tx('Medium', 'Μέτριο'), tx('Medium', 'Μέτρια'), tx('Fluffy', 'Αφράτο')),
        row(tx('Thick pancake', 'Παχύ pancake'), tx('Lower', 'Χαμηλότερο'), tx('Higher', 'Υψηλότερη'), tx('Cake-like, tall', 'Σαν κέικ, ψηλό')),
      ]),
      table(tx('What changes a pancake into a waffle', 'Τι αλλάζει ένα pancake σε βάφλα'), [tx('Control', 'Παράγοντας'), tx('Pancake region', 'Περιοχή pancake'), tx('Waffle direction', 'Κατεύθυνση βάφλας')], [
        row(tx('Fat', 'Λίπος'), tx('15%', '15%'), tx('25–40%', '25–40%')),
        row(tx('Sugar', 'Ζάχαρη'), tx('10–20%', '10–20%'), tx('10–25%', '10–25%')),
        row(tx('Starch substitution', 'Αντικατάσταση με άμυλο'), tx('Usually none', 'Συνήθως καμία'), tx('15–30% of flour', '15–30% του αλευριού')),
        row(tx('Equipment', 'Εξοπλισμός'), tx('Griddle', 'Πλάκα'), tx('Waffle iron and high surface dehydration', 'Waffle iron και έντονη επιφανειακή αφυδάτωση')),
      ], tx('The same formula is pancake-like on a griddle and waffle-like in a waffle iron.', 'Η ίδια φόρμουλα είναι pancake στην πλάκα και waffle στο waffle iron.')),
      table(tx('Four ways the mixture changes', 'Τέσσερις τρόποι με τους οποίους αλλάζει το μείγμα'), [tx('Control', 'Παράγοντας'), tx('Range of movement', 'Περιοχή μεταβολής'), tx('What it changes', 'Τι αλλάζει')], [
        row(tx('Viscosity', 'Ιξώδες'), tx('Flour ↔ liquid', 'Αλεύρι ↔ υγρό'), tx('Spread, thickness, gas retention', 'Άπλωμα, πάχος, συγκράτηση αερίου')),
        row(tx('Structure', 'Δομή'), tx('Egg ↔ flour ↔ starch', 'Αυγό ↔ αλεύρι ↔ άμυλο'), tx('Elasticity, set, creamy character', 'Ελαστικότητα, πήξη, κρεμώδης χαρακτήρας')),
        row(tx('Tenderness / crispness', 'Τρυφερότητα / τραγανότητα'), tx('Fat ↔ starch ↔ sugar', 'Λίπος ↔ άμυλο ↔ ζάχαρη'), tx('Softness, richness, shell', 'Μαλακότητα, πλούσια γεύση, κέλυφος')),
        row(tx('Expansion', 'Διόγκωση'), tx('Baking powder / baking soda / foam / steam', 'Μπέικιν πάουντερ / μαγειρική σόδα / αφρός / ατμός'), tx('Height, cells, hollow structure', 'Ύψος, κυψέλες, κοίλη δομή')),
      ]),
    ],
    diagrams: [{ id: 'continuums', title: tx('How one type becomes another', 'Πώς περνάμε από το ένα είδος στο άλλο'), code: tx(`flowchart LR
  CR[Crêpe] -->|liquid down + lift up| PA[Pancake]
  PA -->|fat up + drying up| WA[Waffle]
  CR -->|same composition, oven cooking| DU[Dutch baby]
  TE[Tempura] -->|viscosity + gas retention| BE[Beer batter]
  BE -->|liquid down + inclusions| FR[Fritter]`, `flowchart LR
  CR[Κρέπα] -->|υγρό κάτω + διόγκωση πάνω| PA[Pancake]
  PA -->|λίπος πάνω + στέγνωμα πάνω| WA[Waffle]
  CR -->|ίδια σύσταση, φούρνος| DU[Dutch baby]
  TE[Tempura] -->|ιξώδες + συγκράτηση αερίου| BE[Beer batter]
  BE -->|υγρό κάτω + προσθήκες| FR[Fritter]`), fallback: tx('The main changes are: less liquid and more lift turn a crêpe into a pancake; more fat and surface drying move a pancake towards a waffle; the oven turns a crêpe-like mixture into a Dutch baby; more thickness and trapped gas turn tempura towards beer batter; and when the food is held inside the mixture, the coating becomes a fritter.', 'Οι βασικές αλλαγές είναι: λιγότερο υγρό και περισσότερη διόγκωση μετατρέπουν την κρέπα σε pancake· περισσότερο λίπος και στέγνωμα στην επιφάνεια οδηγούν από το pancake στη βάφλα· ο φούρνος μετατρέπει ένα μείγμα σαν κρέπα σε Dutch baby· μεγαλύτερο πάχος και περισσότερο παγιδευμένο αέριο οδηγούν από την tempura στο μείγμα μπύρας· και όταν το τρόφιμο βρίσκεται μέσα στο μείγμα, η επικάλυψη γίνεται fritter.') }],
  },
  {
    id: 'steam-custard', number: 7,
    eyebrow: tx('07 / STEAM AND CREAMY CENTRES', '07 / ΑΤΜΟΣ ΚΑΙ ΚΡΕΜΩΔΗ ΚΕΝΤΡΑ'),
    title: tx('Similar ratios, different oven behaviour', 'Παρόμοιες αναλογίες, διαφορετική συμπεριφορά στον φούρνο'),
    intro: tx('Dutch baby, Yorkshire pudding, popover, and clafoutis show why egg, geometry, and heat cannot be separated.', 'Το Dutch baby, το Yorkshire pudding, το popover και το clafoutis δείχνουν γιατί αυγό, γεωμετρία και θερμότητα δεν μπορούν να χωριστούν.'),
    tables: [
      table(tx('Steam-puffed examples', 'Παραδείγματα με διόγκωση ατμού'), [tx('Type', 'Είδος'), tx('Shape', 'Σχήμα'), tx('Result', 'Αποτέλεσμα')], [
        row(tx('Dutch baby', 'Dutch baby'), tx('Wide shallow pool', 'Πλατιά ρηχή στρώση'), tx('Dramatic edge puff, creamy centre', 'Έντονο περιφερειακό φούσκωμα, κρεμώδες κέντρο')),
        row(tx('Yorkshire pudding', 'Yorkshire pudding'), tx('Hot fat-lined vessel', 'Καυτό σκεύος με λίπος'), tx('Hollow, crisp-edged body', 'Κοίλο σώμα με τραγανές άκρες')),
        row(tx('Popover', 'Popover'), tx('Deep narrow mould', 'Βαθύ στενό καλούπι'), tx('More trapped steam and hollow interior', 'Περισσότερος παγιδευμένος ατμός και κοίλο εσωτερικό')),
      ]),
      table(tx('The line between puffed and creamy mixtures', 'Το όριο ανάμεσα στα φουσκωμένα και τα κρεμώδη μείγματα'), [tx('Family', 'Οικογένεια'), tx('Liquid / egg direction', 'Κατεύθυνση υγρού / αυγού'), tx('Setting mechanism', 'Πώς πήζει')], [
        row(tx('Clafoutis', 'Clafoutis'), tx('High egg, medium-high liquid, fruit', 'Υψηλό αυγό, μέτριο-υψηλό υγρό, φρούτο'), tx('Egg coagulation + starch', 'Πήξη αυγού + άμυλο')),
        row(tx('Far Breton', 'Far Breton'), tx('Denser and richer', 'Πυκνότερο και πλουσιότερο'), tx('Dense, creamy set', 'Πυκνή, κρεμώδης πήξη')),
        row(tx('Flaugnarde', 'Flaugnarde'), tx('Clafoutis-like with other fruit', 'Τύπου clafoutis με άλλα φρούτα'), tx('Egg, starch, fruit water', 'Αυγό, άμυλο, νερό φρούτου')),
      ]),
    ],
    paragraphs: [tx('For steam-puffed mixtures, the chain is water → steam → expansion → setting of protein and starch. For creamy mixtures, more egg and liquid with little or no leavening creates a soft body set by the egg rather than a fluffy crumb.', 'Στα μείγματα που φουσκώνουν με ατμό, η αλυσίδα είναι νερό → ατμός → διόγκωση → πήξη πρωτεΐνης και αμύλου. Στα κρεμώδη μείγματα, περισσότερο αυγό και υγρό με λίγη ή καθόλου διόγκωση δημιουργούν ένα μαλακό σώμα που πήζει από το αυγό και όχι μια αφράτη ψίχα.')],
  },
  {
    id: 'coating-fritter', number: 8,
    eyebrow: tx('08 / FRYING', '08 / ΤΗΓΑΝΙΣΜΑ'),
    title: tx('Coating is not fritter', 'Η επικάλυψη δεν είναι fritter'),
    intro: tx('The difference is simple: in a coating, the food is outside and the mixture becomes the shell; in a fritter, the food is mixed in and the mixture becomes the body.', 'Η διαφορά είναι απλή: στην επικάλυψη το τρόφιμο βρίσκεται απ’ έξω και το μείγμα γίνεται κέλυφος· στο fritter το τρόφιμο ανακατεύεται μέσα και το μείγμα γίνεται το σώμα.'),
    tables: [
      table(tx('From a thin coating to a fritter', 'Από τη λεπτή επικάλυψη στο fritter'), [tx('System', 'Είδος'), tx('Liquid', 'Υγρό'), tx('Gas / leavening', 'Αέριο / διόγκωση'), tx('Shell', 'Κέλυφος')], [
        row(tx('Tempura', 'Tempura'), tx('140–180%', '140–180%'), tx('Low gas; steam dominant', 'Χαμηλό αέριο· κυρίως ατμός'), tx('Thin, brittle', 'Λεπτό, εύθραυστο')),
        row(tx('Beer batter', 'Μείγμα μπύρας'), tx('110–150%', '110–150%'), tx('Beer gas + steam + optional baking powder', 'Αέριο μπύρας + ατμός + προαιρετικό μπέικιν πάουντερ'), tx('Thicker, airy', 'Παχύτερο, αέρινο')),
        row(tx('Thick frying batter', 'Παχύ μείγμα τηγανίσματος'), tx('90–120%', '90–120%'), tx('Chemical lift', 'Χημική διόγκωση'), tx('Heavy crisp shell', 'Βαρύ τραγανό κέλυφος')),
      ]),
      table(tx('Fritter families', 'Οικογένειες fritter'), [tx('Subtype', 'Υποκατηγορία'), tx('Inclusion', 'Προσθήκη'), tx('Role', 'Ρόλος'), tx('Typical result', 'Τυπικό αποτέλεσμα')], [
        row(tx('Vegetable fritter', 'Vegetable fritter'), tx('High vegetable inclusion', 'Πολλά λαχανικά'), tx('Mixture forms the body', 'Το μείγμα σχηματίζει το σώμα'), tx('Soft inside, crisp outside', 'Μαλακό μέσα, τραγανό έξω')),
        row(tx('Corn fritter', 'Corn fritter'), tx('Chunky corn', 'Κομμάτια καλαμποκιού'), tx('Semi-structured body', 'Ημιδομημένο σώμα'), tx('Tender and chunky', 'Τρυφερό και chunky')),
        row(tx('Fruit fritter', 'Fruit fritter'), tx('Sweet fruit', 'Γλυκό φρούτο'), tx('Mixture and coating together', 'Το μείγμα λειτουργεί και ως σώμα και ως επικάλυψη'), tx('Soft-sweet, crisp', 'Μαλακό-γλυκό, τραγανό')),
        row(tx('Pakora', 'Pakora'), tx('Vegetable + chickpea flour', 'Λαχανικά + αλεύρι ρεβιθιού'), tx('Mixture and coating together', 'Το μείγμα λειτουργεί και ως σώμα και ως επικάλυψη'), tx('Dense-crisp, savoury', 'Πυκνό-τραγανό, αλμυρό')),
      ]),
    ],
  },
  {
    id: 'fermented-foam', number: 9,
    eyebrow: tx('09 / FERMENTATION AND FOAM', '09 / ΖΥΜΩΣΗ ΚΑΙ ΑΦΡΟΣ'),
    title: tx('The mixture can rise through fermentation or eggs', 'Το μείγμα μπορεί να φουσκώσει από ζύμωση ή αυγά'),
    intro: tx('Fermentation changes gas, pH, flavour, starch behaviour, and protein structure. Foam changes the gas-retention system without adding biological fermentation.', 'Η ζύμωση αλλάζει αέριο, pH, γεύση, συμπεριφορά αμύλου και δομή πρωτεΐνης. Ο αφρός αλλάζει το σύστημα συγκράτησης αερίου χωρίς βιολογική ζύμωση.'),
    tables: [
      table(tx('Fermented batters', 'Μείγματα με ζύμωση'), [tx('Subtype', 'Υποκατηγορία'), tx('Base', 'Βάση'), tx('Mechanism', 'Μηχανισμός'), tx('Process effect', 'Επίδραση διαδικασίας')], [
        row(tx('Dosa', 'Dosa'), tx('Rice + lentil', 'Ρύζι + φακή'), tx('Lactic fermentation', 'Γαλακτική ζύμωση'), tx('pH and starch change', 'Αλλαγή pH και αμύλου')),
        row(tx('Injera', 'Injera'), tx('Teff', 'Teff'), tx('Fermentation', 'Ζύμωση'), tx('Porous, elastic sheet', 'Πορώδες, ελαστικό φύλλο')),
        row(tx('Yeasted blini / waffle', 'Blini / waffle με μαγιά'), tx('Wheat or buckwheat', 'Σιτάρι ή φαγόπυρο'), tx('Biological gas', 'Βιολογικό αέριο'), tx('Rest becomes part of identity', 'Η ξεκούραση γίνεται μέρος της ταυτότητας')),
        row(tx('Sourdough pancake', 'Pancake με προζύμι'), tx('Starter + wheat', 'Προζύμι + σιτάρι'), tx('Mixed fermentation', 'Μικτή ζύμωση'), tx('Acidity and flavour alongside lift', 'Οξύτητα και γεύση μαζί με διόγκωση')),
      ]),
      table(tx('Foam-leavened systems', 'Συστήματα με αφρό'), [tx('Type', 'Τύπος'), tx('Aeration', 'Αερισμός'), tx('Setting behaviour', 'Συμπεριφορά πήξης')], [
        row(tx('Foam waffle', 'Foam waffle'), tx('Whipped egg whites', 'Χτυπημένα ασπράδια'), tx('Airy interior, crisp shell', 'Αέρινο εσωτερικό, τραγανό κέλυφος')),
        row(tx('Soufflé pancake', 'Soufflé pancake'), tx('Whipped whites + gentle fold', 'Χτυπημένα ασπράδια + ήπιο δίπλωμα'), tx('Delicate, slow setting', 'Λεπτή, αργή πήξη')),
         row(tx('Sponge-like mixture', 'Μείγμα σαν παντεσπάνι'), tx('Whole egg or whites foam', 'Αφρός ολόκληρου αυγού ή ασπραδιών'), tx('Foam becomes the structural network', 'Ο αφρός γίνεται το δομικό δίκτυο')),
       ]),
      table(tx('The five things that shape the result', 'Τα πέντε πράγματα που διαμορφώνουν το αποτέλεσμα'), [tx('Dimension', 'Παράγοντας'), tx('What it controls', 'Τι ελέγχει'), tx('Mechanisms / values', 'Πώς λειτουργεί')], [
        row(tx('Liquid ratio', 'Αναλογία υγρού'), tx('Viscosity and spread', 'Ιξώδες και άπλωμα'), tx('Low ↔ high liquid', 'Χαμηλό ↔ υψηλό υγρό')),
        row(tx('Egg ratio', 'Αναλογία αυγού'), tx('Protein structure, emulsification, flexibility, and creamy centre', 'Πρωτεϊνική δομή, γαλακτωματοποίηση, ελαστικότητα και κρεμώδες κέντρο'), tx('Low ↔ high egg', 'Χαμηλό ↔ υψηλό αυγό')),
        row(tx('Fat ratio', 'Αναλογία λίπους'), tx('Tenderness, richness, and sometimes crispness', 'Τρυφερότητα, πλούσια γεύση και μερικές φορές τραγανότητα'), tx('Low ↔ high fat', 'Χαμηλό ↔ υψηλό λίπος')),
        row(tx('Leavening mechanism', 'Μηχανισμός διόγκωσης'), tx('How gas or steam is produced and retained', 'Πώς παράγεται και συγκρατείται αέριο ή ατμός'), tx('None · chemical · acid + baking soda · biological · foam · steam', 'Καμία · χημική · οξύ + μαγειρική σόδα · βιολογική · αφρός · ατμός')),
        row(tx('Cooking method', 'Τρόπος μαγειρέματος'), tx('Surface setting, dehydration, and steam trapping', 'Πήξη επιφάνειας, αφυδάτωση και παγίδευση ατμού'), tx('Pan · griddle · waffle iron · oven · shallow fry · deep fry', 'Τηγάνι · πλάκα · waffle iron · φούρνος · ρηχό · βαθύ τηγάνισμα')),
      ]),
    ],
    diagrams: [{ id: 'five-dimensions', title: tx('Five things that shape a batter', 'Πέντε πράγματα που διαμορφώνουν ένα μείγμα'), code: tx(`flowchart TD
  C[Composition] --> L[Liquid]
  C --> E[Egg]
  C --> F[Fat]
  C --> V[Flour / starch]
  A[Aeration] --> Ch[Chemical]
  A --> Bi[Biological]
  A --> Fo[Foam]
  A --> St[Steam]
  C --> T[Cooking method]
  T --> P[Pan / griddle]
  T --> W[Waffle iron]
  T --> O[Oven]
  T --> R[Shallow / deep fry]`, `flowchart TD
  C[Σύσταση] --> L[Υγρό]
  C --> E[Αυγό]
  C --> F[Λίπος]
  C --> V[Αλεύρι / άμυλο]
  A[Αερισμός] --> Ch[Χημικός]
  A --> Bi[Βιολογικός]
  A --> Fo[Αφρός]
  A --> St[Ατμός]
  C --> T[Θερμική διαδικασία]
  T --> P[Τηγάνι / πλάκα]
  T --> W[Waffle iron]
  T --> O[Φούρνος]
  T --> R[Ρηχό / βαθύ τηγάνισμα]`), fallback: tx('The result depends on the liquid, egg, fat, flour or starch, the way the mixture gets air, and the way it is cooked. The same ingredients can give a different result when the cooking method changes.', 'Το αποτέλεσμα εξαρτάται από το υγρό, το αυγό, το λίπος, το αλεύρι ή το άμυλο, τον τρόπο με τον οποίο μπαίνει αέρας στο μείγμα και τον τρόπο ψησίματος. Τα ίδια υλικά μπορούν να δώσουν διαφορετικό αποτέλεσμα όταν αλλάξει το ψήσιμο.') }],
  },
  {
    id: 'cake-boundary', number: 10,
    eyebrow: tx('10 / NEAR CAKE', '10 / ΚΟΝΤΑ ΣΤΑ ΚΕΪΚ'),
    title: tx('When a batter starts to behave like cake', 'Πότε ένα μείγμα αρχίζει να μοιάζει με κέικ'),
    intro: tx('Some batters sit close to cake. At that point, fat, sugar, egg, and the cooked crumb help create the structure.', 'Ορισμένα μείγματα βρίσκονται κοντά στα κέικ. Σε αυτή την περιοχή, το λίπος, η ζάχαρη, το αυγό και η ψημένη ψίχα δημιουργούν τη δομή.'),
    paragraphs: [tx('The sign is practical rather than a strict percentage: fat and sugar stop acting only as flavour and start shaping the crumb. Savoury baked mixtures can sit in the same area when cheese, vegetables, or grains provide much of the solid structure.', 'Το σημάδι είναι πρακτικό και όχι ένα αυστηρό ποσοστό: το λίπος και η ζάχαρη δεν δίνουν μόνο γεύση, αλλά αρχίζουν να σχηματίζουν την ψίχα. Τα αλμυρά ψημένα μείγματα μπορεί να βρίσκονται στην ίδια περιοχή όταν το τυρί, τα λαχανικά ή τα δημητριακά δίνουν μεγάλο μέρος της στερεάς δομής.')],
    tables: [
      table(tx('Where cake and savoury mixtures meet', 'Όπου συναντιούνται τα κέικ και τα αλμυρά μείγματα'), [tx('Subtype', 'Είδος'), tx('Main signal', 'Κύριο χαρακτηριστικό'), tx('Primary home', 'Πού ανήκει κυρίως')], [
        row(tx('Pour cake', 'Ρευστό μείγμα για κέικ'), tx('High fat + sugar, chemical or foam lift', 'Υψηλό λίπος + ζάχαρη, χημική ή αφρώδης διόγκωση'), tx('Near cake', 'Κοντά στα κέικ')),
        row(tx('Muffin / quick bread', 'Muffin / γρήγορο ψωμί'), tx('Thick batter, chemical leavening, set crumb', 'Παχύ μείγμα, χημική διόγκωση, πήξη ψίχας'), tx('Near cake', 'Κοντά στα κέικ')),
        row(tx('Cornbread-style', 'Τύπου cornbread'), tx('Grain-heavy savoury crumb', 'Αλμυρή ψίχα με πολλά δημητριακά'), tx('Near cake', 'Κοντά στα κέικ')),
        row(tx('Cheese batter', 'Μείγμα με τυρί'), tx('Protein, fat, salt, and solids from cheese', 'Πρωτεΐνη, λίπος, αλάτι και στερεά από τυρί'), tx('Near cake / griddle', 'Κοντά στα κέικ / στην πλάκα')),
        row(tx('Vegetable baked mixture', 'Ψημένο μείγμα με λαχανικά'), tx('Inclusions release water and change set', 'Οι προσθήκες απελευθερώνουν νερό και αλλάζουν την πήξη'), tx('Fritter / near cake', 'Fritter / κοντά στα κέικ')),
      ]),
      table(tx('Full comparison table', 'Πλήρης πίνακας σύγκρισης'), [tx('Family', 'Οικογένεια'), tx('Liquid %', 'Υγρό %'), tx('Egg %', 'Αυγό %'), tx('Fat %', 'Λίπος %'), tx('Sugar %', 'Ζάχαρη %'), tx('Leavening', 'Διόγκωση'), tx('Base / cooking', 'Βάση / μαγείρεμα'), tx('Role / texture', 'Ρόλος / υφή')], [
        row(tx('Crêpe', 'Crêpe'), tx('180–220', '180–220'), tx('80–110', '80–110'), tx('10–20', '10–20'), tx('0–10', '0–10'), tx('none', 'καμία'), tx('wheat / pan', 'σιτάρι / τηγάνι'), tx('thin sheet; flexible', 'λεπτό φύλλο· εύκαμπτο')),
        row(tx('Galette', 'Galette'), tx('180–220', '180–220'), tx('0–40', '0–40'), tx('0–10', '0–10'), tx('0', '0'), tx('none', 'καμία'), tx('buckwheat / pan', 'φαγόπυρο / τηγάνι'), tx('rustic thin sheet', 'rustic λεπτό φύλλο')),
        row(tx('Thin pancake', 'Thin pancake'), tx('120–140', '120–140'), tx('35–50', '35–50'), tx('5–15', '5–15'), tx('5–15', '5–15'), tx('low chemical', 'χαμηλή χημική'), tx('wheat / griddle', 'σιτάρι / πλάκα'), tx('soft, thin', 'μαλακό, λεπτό')),
        row(tx('American pancake', 'American pancake'), tx('95–120', '95–120'), tx('40–60', '40–60'), tx('10–20', '10–20'), tx('10–20', '10–20'), tx('chemical', 'χημική'), tx('wheat / griddle', 'σιτάρι / πλάκα'), tx('fluffy, tender', 'αφράτο, τρυφερό')),
        row(tx('Buttermilk pancake', 'Pancake με buttermilk'), tx('100–120', '100–120'), tx('40–55', '40–55'), tx('10–20', '10–20'), tx('10–15', '10–15'), tx('acid + baking soda', 'οξύ + μαγειρική σόδα'), tx('wheat / griddle', 'σιτάρι / πλάκα'), tx('tangy, tender', 'όξινο, τρυφερό')),
        row(tx('Drop scone / thick pancake', 'Drop scone / παχύ pancake'), tx('80–100', '80–100'), tx('40–60', '40–60'), tx('10–20', '10–20'), tx('15–25', '15–25'), tx('medium-high chemical', 'μέτρια-υψηλή χημική'), tx('wheat / griddle', 'σιτάρι / πλάκα'), tx('thick, cake-like', 'παχύ, σαν κέικ')),
        row(tx('Soufflé pancake', 'Soufflé pancake'), tx('80–110', '80–110'), tx('70–120', '70–120'), tx('10–20', '10–20'), tx('15–25', '15–25'), tx('foam + chemical', 'αφρός + χημική'), tx('wheat / griddle', 'σιτάρι / πλάκα'), tx('airy, delicate', 'αέρινο, λεπτό')),
        row(tx('Yeasted pancake / blini', 'Yeasted pancake / blini'), tx('100–140', '100–140'), tx('20–60', '20–60'), tx('5–20', '5–20'), tx('0–15', '0–15'), tx('biological', 'βιολογική'), tx('wheat/buckwheat / griddle', 'σιτάρι/φαγόπυρο / πλάκα'), tx('airy, fermented', 'αέρινο, ζυμωμένο')),
        row(tx('American waffle', 'American waffle'), tx('95–120', '95–120'), tx('40–60', '40–60'), tx('20–40', '20–40'), tx('10–25', '10–25'), tx('chemical', 'χημική'), tx('wheat / waffle iron', 'σιτάρι / waffle iron'), tx('crisp outside, soft inside', 'τραγανό έξω, μαλακό μέσα')),
        row(tx('Foam waffle', 'Foam waffle'), tx('90–110', '90–110'), tx('60–90', '60–90'), tx('25–40', '25–40'), tx('15–25', '15–25'), tx('foam + chemical', 'αφρός + χημική'), tx('wheat / waffle iron', 'σιτάρι / waffle iron'), tx('airy + crisp', 'αέρινο + τραγανό')),
        row(tx('Yeasted waffle', 'Yeasted waffle'), tx('100–130', '100–130'), tx('30–60', '30–60'), tx('20–40', '20–40'), tx('5–20', '5–20'), tx('biological', 'βιολογική'), tx('wheat / waffle iron', 'σιτάρι / waffle iron'), tx('crisp, complex, airy', 'τραγανό, σύνθετο, αέρινο')),
        row(tx('Crisp starch waffle', 'Crisp starch waffle'), tx('95–115', '95–115'), tx('30–60', '30–60'), tx('25–40', '25–40'), tx('10–20', '10–20'), tx('chemical', 'χημική'), tx('flour + 15–30% starch / waffle iron', 'αλεύρι + 15–30% άμυλο / waffle iron'), tx('brittle crisp shell', 'brittle τραγανό κέλυφος')),
        row(tx('Dutch baby', 'Dutch baby'), tx('170–210', '170–210'), tx('90–130', '90–130'), tx('15–30', '15–30'), tx('0–15', '0–15'), tx('steam', 'ατμός'), tx('wheat / oven', 'σιτάρι / φούρνος'), tx('puffed, creamy', 'φουσκωμένο, κρεμώδες')),
        row(tx('Yorkshire pudding', 'Yorkshire pudding'), tx('170–220', '170–220'), tx('80–120', '80–120'), tx('0–15*', '0–15*'), tx('0', '0'), tx('steam', 'ατμός'), tx('wheat / hot oven', 'σιτάρι / καυτός φούρνος'), tx('hollow, crisp-edged', 'κοίλο, τραγανές άκρες')),
        row(tx('Popover', 'Popover'), tx('170–220', '170–220'), tx('80–120', '80–120'), tx('10–20', '10–20'), tx('0–5', '0–5'), tx('steam', 'ατμός'), tx('wheat / oven mould', 'σιτάρι / καλούπι φούρνου'), tx('very hollow, crisp', 'πολύ κοίλο, τραγανό')),
        row(tx('Clafoutis', 'Clafoutis'), tx('130–180', '130–180'), tx('100–160', '100–160'), tx('10–30', '10–30'), tx('30–70', '30–70'), tx('none / steam', 'καμία / ατμός'), tx('wheat + fruit / oven', 'σιτάρι + φρούτο / φούρνος'), tx('creamy, soft', 'κρεμώδες, μαλακό')),
        row(tx('Far Breton', 'Far Breton'), tx('100–150', '100–150'), tx('100–150', '100–150'), tx('15–30', '15–30'), tx('50–90', '50–90'), tx('none', 'καμία'), tx('wheat / oven', 'σιτάρι / φούρνος'), tx('dense, creamy', 'πυκνό, κρεμώδες')),
        row(tx('Tempura', 'Tempura'), tx('140–180', '140–180'), tx('0–40', '0–40'), tx('0', '0'), tx('0', '0'), tx('steam', 'ατμός'), tx('wheat + starch / deep fry', 'σιτάρι + άμυλο / βαθύ'), tx('very light, brittle crisp', 'πολύ ελαφρύ, brittle τραγανό')),
        row(tx('Sparkling-water batter', 'Sparkling-water batter'), tx('130–170', '130–170'), tx('0–30', '0–30'), tx('0–5', '0–5'), tx('0', '0'), tx('dissolved gas + steam', 'διαλυμένο αέριο + ατμός'), tx('wheat/starch / deep fry', 'σιτάρι/άμυλο / βαθύ'), tx('light, crisp', 'ελαφρύ, τραγανό')),
        row(tx('Beer batter', 'Beer batter'), tx('110–150', '110–150'), tx('0–30', '0–30'), tx('0–10', '0–10'), tx('0–5', '0–5'), tx('gas + steam + optional chemical', 'αέριο + ατμός + προαιρετική χημική'), tx('wheat / deep fry', 'σιτάρι / βαθύ'), tx('airy, crisp, thicker shell', 'αέρινο, τραγανό, παχύτερο κέλυφος')),
        row(tx('Thick frying batter', 'Thick frying batter'), tx('90–120', '90–120'), tx('20–50', '20–50'), tx('0–15', '0–15'), tx('0–10', '0–10'), tx('chemical', 'χημική'), tx('wheat / deep fry', 'σιτάρι / βαθύ'), tx('thick, crisp shell', 'παχύ, τραγανό κέλυφος')),
        row(tx('Pakora mixture', 'Μείγμα pakora'), tx('70–120', '70–120'), tx('0–20', '0–20'), tx('0–10', '0–10'), tx('0', '0'), tx('none / low chemical', 'καμία / χαμηλή χημική'), tx('chickpea flour / deep fry', 'αλεύρι ρεβιθιού / βαθύ'), tx('dense-crisp, savoury', 'πυκνό-τραγανό, αλμυρό')),
        row(tx('Vegetable fritter', 'Vegetable fritter'), tx('70–120**', '70–120**'), tx('30–60', '30–60'), tx('5–20', '5–20'), tx('0–10', '0–10'), tx('low-medium chemical', 'χαμηλή-μέτρια χημική'), tx('wheat/other flour / shallow or deep fry', 'σιτάρι/άλλο άλευρο / ρηχό ή βαθύ'), tx('soft interior, crisp outside', 'μαλακό μέσα, τραγανό έξω')),
        row(tx('Corn fritter', 'Corn fritter'), tx('70–120', '70–120'), tx('30–60', '30–60'), tx('5–20', '5–20'), tx('5–20', '5–20'), tx('chemical', 'χημική'), tx('wheat + corn / fry', 'σιτάρι + καλαμπόκι / τηγάνισμα'), tx('tender, chunky', 'τρυφερό, chunky')),
        row(tx('Fruit fritter', 'Fruit fritter'), tx('80–120', '80–120'), tx('30–60', '30–60'), tx('5–20', '5–20'), tx('10–30', '10–30'), tx('chemical', 'χημική'), tx('wheat / fry', 'σιτάρι / τηγάνισμα'), tx('soft-sweet, crisp', 'μαλακό-γλυκό, τραγανό')),
        row(tx('Dosa', 'Dosa'), tx('variable', 'μεταβλητό'), tx('0', '0'), tx('~0', '~0'), tx('0', '0'), tx('fermentation', 'ζύμωση'), tx('rice + lentil / griddle', 'ρύζι + φακή / πλάκα'), tx('crisp to soft, fermented', 'τραγανό έως μαλακό, ζυμωμένο')),
        row(tx('Injera', 'Injera'), tx('high', 'υψηλό'), tx('0', '0'), tx('~0', '~0'), tx('0', '0'), tx('fermentation', 'ζύμωση'), tx('teff / griddle', 'teff / πλάκα'), tx('soft, porous, elastic', 'μαλακό, πορώδες, ελαστικό')),
        row(tx('Sourdough pancake', 'Sourdough pancake'), tx('100–140', '100–140'), tx('20–60', '20–60'), tx('5–20', '5–20'), tx('5–15', '5–15'), tx('biological + optional chemical', 'βιολογική + προαιρετική χημική'), tx('wheat starter/flour / griddle', 'προζύμι/αλεύρι σιταριού / πλάκα'), tx('tender, fermented', 'τρυφερό, ζυμωμένο')),
        row(tx('Pour cake batter', 'Pour cake batter'), tx('60–100', '60–100'), tx('50–100', '50–100'), tx('50–100', '50–100'), tx('70–120', '70–120'), tx('chemical / foam', 'χημική / αφρός'), tx('wheat / oven', 'σιτάρι / φούρνος'), tx('tender crumb', 'τρυφερή ψίχα')),
        row(tx('Muffin batter', 'Muffin batter'), tx('50–90', '50–90'), tx('40–80', '40–80'), tx('30–80', '30–80'), tx('50–100', '50–100'), tx('chemical', 'χημική'), tx('wheat / oven', 'σιτάρι / φούρνος'), tx('dense-tender crumb', 'πυκνή-τρυφερή ψίχα')),
        row(tx('Quick-bread mixture', 'Μείγμα γρήγορου ψωμιού'), tx('50–100', '50–100'), tx('30–80', '30–80'), tx('20–60', '20–60'), tx('20–80', '20–80'), tx('chemical', 'χημική'), tx('wheat/whole grain / oven', 'σιτάρι/ολικής / φούρνος'), tx('moist, cake-like', 'υγρό, σαν κέικ')),
      ],
      tx('* Yorkshire fat is often mainly in the vessel. Fritter hydration also includes water released by inclusions.', '* Στο Yorkshire το λίπος συχνά βρίσκεται κυρίως στο σκεύος. Στα fritters η ενυδάτωση περιλαμβάνει και το νερό που απελευθερώνουν οι προσθήκες.'),
      ),
    ],
  },
  {
    id: 'boundaries', number: 11,
    eyebrow: tx('11 / WHERE TYPES MEET', '11 / ΟΠΟΥ ΣΥΝΑΝΤΙΟΥΝΤΑΙ ΤΑ ΕΙΔΗ'),
    title: tx('Where one type meets another', 'Πού συναντιέται το ένα είδος με το άλλο'),
    intro: tx('There are three different kinds of transition: ingredients, preparation, and function. Treating them as the same creates misleading classifications.', 'Υπάρχουν τρία διαφορετικά είδη μετάβασης: υλικά, διαδικασία και λειτουργία. Αν τα θεωρήσουμε ίδια, η ταξινόμηση γίνεται παραπλανητική.'),
    tables: [
      table(tx('How the categories change into one another', 'Πώς περνάμε από τη μία κατηγορία στην άλλη'), [tx('Transition', 'Μετάβαση'), tx('Main change', 'Κύρια αλλαγή'), tx('What to look for', 'Τι να προσέξουμε')], [
        row(tx('Crêpe ↔ pancake', 'Crêpe ↔ pancake'), tx('Liquid down, leavening up', 'Υγρό κάτω, διόγκωση πάνω'), tx('Fluidity gives way to retained gas', 'Η ρευστότητα δίνει τη θέση της σε συγκρατημένο αέριο')),
        row(tx('Pancake ↔ waffle', 'Pancake ↔ waffle'), tx('Fat and surface dehydration up', 'Λίπος και επιφανειακή αφυδάτωση πάνω'), tx('Composition × equipment', 'Σύσταση × εξοπλισμός')),
        row(tx('Pancake ↔ cake', 'Pancake ↔ cake'), tx('Fat, sugar, egg, and set solids up', 'Λίπος, ζάχαρη, αυγό και στερεά πάνω'), tx('Fat and sugar become structural', 'Λίπος και ζάχαρη γίνονται δομικά')),
        row(tx('Crêpe ↔ Dutch baby', 'Crêpe ↔ Dutch baby'), tx('Pan → oven; thin film → deeper pool', 'Τηγάνι → φούρνος· λεπτό → βαθύτερη στρώση'), tx('The process changes, not the ingredient list', 'Αλλάζει η διαδικασία, όχι η λίστα υλικών')),
        row(tx('Dutch baby ↔ popover', 'Dutch baby ↔ popover'), tx('Geometry and steam trapping', 'Γεωμετρία και παγίδευση ατμού'), tx('Shallow wide ↔ deep narrow', 'Ρηχό πλατύ ↔ βαθύ στενό')),
        row(tx('Tempura ↔ beer', 'Tempura ↔ beer'), tx('Viscosity and gas retention up', 'Ιξώδες και συγκράτηση αερίου πάνω'), tx('Thin brittle ↔ thick airy shell', 'Λεπτό εύθραυστο ↔ παχύ αέρινο κέλυφος')),
        row(tx('Beer ↔ thick frying', 'Beer ↔ παχύ μείγμα τηγανίσματος'), tx('Liquid down, solids up', 'Υγρό κάτω, στερεά πάνω'), tx('More mixture stays on the food', 'Περισσότερο μείγμα μένει πάνω στο τρόφιμο')),
        row(tx('Thick mixture ↔ fritter', 'Παχύ μείγμα ↔ fritter'), tx('The mixture becomes the body', 'Το μείγμα γίνεται το σώμα'), tx('Food outside ↔ food mixed in', 'Τρόφιμο έξω ↔ τρόφιμο μέσα στο μείγμα')),
        row(tx('Pancake ↔ fritter', 'Pancake ↔ fritter'), tx('Frying medium and inclusions', 'Μέσο τηγανίσματος και προσθήκες'), tx('Low inclusion ↔ high inclusion', 'Λίγη προσθήκη ↔ πολλή προσθήκη')),
      ]),
      table(tx('Four ingredients and the way of cooking', 'Τέσσερα υλικά και ο τρόπος μαγειρέματος'), [tx('Family', 'Οικογένεια'), tx('Liquid', 'Υγρό'), tx('Egg', 'Αυγό'), tx('Fat', 'Λίπος'), tx('Leavening', 'Διόγκωση'), tx('Cooking', 'Μαγείρεμα')], [
        row(tx('Crêpe', 'Κρέπα'), tx('3', '3'), tx('3', '3'), tx('1', '1'), tx('0', '0'), tx('Pan', 'Τηγάνι')),
        row(tx('Pancake', 'Pancake'), tx('2', '2'), tx('2', '2'), tx('2', '2'), tx('2', '2'), tx('Griddle', 'Πλάκα')),
        row(tx('Thick pancake', 'Thick pancake'), tx('1–2', '1–2'), tx('2', '2'), tx('2', '2'), tx('3', '3'), tx('Griddle', 'Πλάκα')),
        row(tx('Waffle', 'Waffle'), tx('2', '2'), tx('2', '2'), tx('3', '3'), tx('2', '2'), tx('Waffle iron', 'Waffle iron')),
        row(tx('Dutch baby', 'Dutch baby'), tx('3', '3'), tx('3', '3'), tx('2', '2'), tx('0', '0'), tx('Oven', 'Φούρνος')),
        row(tx('Yorkshire', 'Yorkshire'), tx('3', '3'), tx('3', '3'), tx('1', '1'), tx('0', '0'), tx('Very hot oven', 'Πολύ ζεστός φούρνος')),
        row(tx('Tempura', 'Tempura'), tx('3', '3'), tx('1', '1'), tx('1', '1'), tx('0', '0'), tx('Deep fry', 'Βαθύ τηγάνισμα')),
        row(tx('Beer batter', 'Beer batter'), tx('2–3', '2–3'), tx('1', '1'), tx('1', '1'), tx('1', '1'), tx('Deep fry', 'Βαθύ τηγάνισμα')),
        row(tx('Fritter', 'Fritter'), tx('1–2', '1–2'), tx('2', '2'), tx('1–2', '1–2'), tx('2', '2'), tx('Shallow / deep fry', 'Ρηχό / βαθύ')),
         row(tx('Cake', 'Cake'), tx('1–2', '1–2'), tx('2–3', '2–3'), tx('3', '3'), tx('2–3', '2–3'), tx('Oven', 'Φούρνος')),
       ], tx('Liquid, egg, and fat are coded low=1, medium=2, high=3; leavening uses none=0.', 'Υγρό, αυγό και λίπος κωδικοποιούνται low=1, medium=2, high=3· η διόγκωση χρησιμοποιεί none=0.')),
      table(tx('Useful ranges at the transitions', 'Χρήσιμα εύρη στις μεταβάσεις'), [tx('Transition', 'Μετάβαση'), tx('Left side', 'Αριστερή πλευρά'), tx('In-between range', 'Ενδιάμεσο εύρος'), tx('Right side', 'Δεξιά πλευρά')], [
        row(tx('Crêpe ↔ pancake — liquid', 'Crêpe ↔ pancake — υγρό'), tx('180–220', '180–220'), tx('140–160', '140–160'), tx('95–120', '95–120')),
        row(tx('Crêpe ↔ pancake — egg', 'Crêpe ↔ pancake — αυγό'), tx('80–110', '80–110'), tx('60–80', '60–80'), tx('40–60', '40–60')),
        row(tx('Pancake ↔ waffle — fat', 'Pancake ↔ waffle — λίπος'), tx('10–20', '10–20'), tx('20–25', '20–25'), tx('25–40', '25–40')),
        row(tx('Pancake ↔ cake — sugar', 'Pancake ↔ cake — ζάχαρη'), tx('10–20', '10–20'), tx('30–50', '30–50'), tx('70–120', '70–120')),
        row(tx('Crêpe ↔ Dutch baby — liquid', 'Crêpe ↔ Dutch baby — υγρό'), tx('180–220', '180–220'), tx('—', '—'), tx('170–210', '170–210')),
        row(tx('Dutch baby ↔ popover — geometry', 'Dutch baby ↔ popover — γεωμετρία'), tx('wide shallow', 'wide shallow'), tx('vessel + steam trap', 'σκεύος + παγίδευση ατμού'), tx('deep narrow', 'deep narrow')),
        row(tx('Tempura ↔ beer — liquid', 'Tempura ↔ beer — υγρό'), tx('140–180', '140–180'), tx('130–150', '130–150'), tx('110–150', '110–150')),
        row(tx('Beer ↔ thick batter — liquid', 'Beer ↔ thick batter — υγρό'), tx('120–150', '120–150'), tx('110–125', '110–125'), tx('90–115', '90–115')),
        row(tx('Thick batter ↔ fritter — function', 'Παχύ μείγμα ↔ fritter — λειτουργία'), tx('external coating', 'εξωτερική επικάλυψη'), tx('inclusions + more retained mass', 'προσθήκες + περισσότερη μάζα'), tx('internal body', 'εσωτερικό σώμα')),
        row(tx('Pancake ↔ fritter — process', 'Pancake ↔ fritter — διαδικασία'), tx('griddle + low inclusion', 'πλάκα + λίγες προσθήκες'), tx('moisture release + medium', 'απελευθέρωση υγρασίας + μέσο'), tx('frying + high inclusion', 'τηγάνισμα + πολλές προσθήκες')),
      ]),
    ],
  },
  {
    id: 'diagnostics', number: 12,
    eyebrow: tx('12 / QUICK ADJUSTMENTS', '12 / ΓΡΗΓΟΡΕΣ ΔΙΟΡΘΩΣΕΙΣ'),
    title: tx('How to adjust the mixture', 'Πώς να διορθώσεις το μείγμα'),
    intro: tx('Start from the texture or problem you want to change, then make only the smallest useful changes.', 'Ξεκίνα από την υφή ή το πρόβλημα που θέλεις να αλλάξεις και κάνε μόνο τις μικρότερες χρήσιμες αλλαγές.'),
    tables: [
      table(tx('What to change when you want a different result', 'Τι να αλλάξεις για διαφορετικό αποτέλεσμα'), [tx('Want more…', 'Θέλω περισσότερο…'), tx('Liquid', 'Υγρό'), tx('Egg', 'Αυγό'), tx('Fat', 'Λίπος'), tx('Leavening', 'Διόγκωση'), tx('Other', 'Άλλο')], [
        row(tx('Thin / spread', 'Thin / spread'), tx('↑', '↑'), tx('—', '—'), tx('—', '—'), tx('↓', '↓'), tx('Hotter surface', 'Θερμότερη επιφάνεια')),
        row(tx('Thick body', 'Thick body'), tx('↓', '↓'), tx('—', '—'), tx('—', '—'), tx('—', '—'), tx('More dry solids', 'Περισσότερα ξηρά στερεά')),
        row(tx('Fluffy', 'Fluffy'), tx('— / ↓', '— / ↓'), tx('↑ little', '↑ λίγο'), tx('—', '—'), tx('↑', '↑'), tx('Gas production + retention', 'Παραγωγή + συγκράτηση αερίου')),
        row(tx('Tender', 'Tender'), tx('—', '—'), tx('—', '—'), tx('↑', '↑'), tx('—', '—'), tx('Sugar ↑ a little', 'Ζάχαρη ↑ λίγο')),
        row(tx('Crisp', 'Crisp'), tx('↓', '↓'), tx('↓ little', '↓ λίγο'), tx('↑*', '↑*'), tx('—', '—'), tx('Starch ↑ and drying ↑', 'Άμυλο ↑ και στέγνωμα ↑')),
        row(tx('Chewy', 'Chewy'), tx('↓ little', '↓ λίγο'), tx('—', '—'), tx('↓', '↓'), tx('↓', '↓'), tx('Gluten development ↑', 'Ανάπτυξη γλουτένης ↑')),
        row(tx('Flexible', 'Flexible'), tx('↑', '↑'), tx('↑', '↑'), tx('↓–medium', '↓–μέτριο'), tx('↓', '↓'), tx('Thin cooking', 'Λεπτό ψήσιμο')),
        row(tx('Creamy centre', 'Κρεμώδες κέντρο'), tx('↑', '↑'), tx('↑↑', '↑↑'), tx('medium', 'μέτριο'), tx('0', '0'), tx('Gentle setting', 'Ήπια πήξη')),
        row(tx('Cakey', 'Cakey'), tx('↓', '↓'), tx('↑', '↑'), tx('↑', '↑'), tx('↑', '↑'), tx('Sugar ↑', 'Ζάχαρη ↑')),
        row(tx('Brittle', 'Brittle'), tx('↑', '↑'), tx('↓', '↓'), tx('low', 'χαμηλό'), tx('low', 'χαμηλή'), tx('Starch/rice flour ↑', 'Άμυλο/rice flour ↑')),
        row(tx('Hollow / puffed', 'Hollow / puffed'), tx('↑', '↑'), tx('↑', '↑'), tx('low–medium', 'χαμηλό–μέτριο'), tx('0', '0'), tx('Steam + hot oven', 'Ατμός + καυτός φούρνος')),
        row(tx('Dense', 'Dense'), tx('↓', '↓'), tx('↓', '↓'), tx('—', '—'), tx('↓', '↓'), tx('Overmix or low gas', 'Υπερβολική ανάμειξη ή λίγο αέριο')),
        row(tx('Rich', 'Rich'), tx('—', '—'), tx('↑', '↑'), tx('↑↑', '↑↑'), tx('—', '—'), tx('Sugar ↑', 'Ζάχαρη ↑')),
        row(tx('Lighter coating', 'Lighter coating'), tx('↑', '↑'), tx('↓', '↓'), tx('↓', '↓'), tx('low', 'χαμηλή'), tx('Suppress gluten', 'Περιορισμός γλουτένης')),
      ], tx('* Fat helps crispness only with sufficient dehydration; fat plus moisture can stay soft and rich.', '* Το λίπος βοηθά την τραγανότητα μόνο με επαρκή αφυδάτωση· λίπος μαζί με υγρασία μπορεί να παραμείνει μαλακό και πλούσιο.')),
      table(tx('Quick fixes for common problems', 'Γρήγορες διορθώσεις για συνηθισμένα προβλήματα'), [tx('Symptom', 'Πρόβλημα'), tx('First adjustment', 'Πρώτη διόρθωση')], [
        row(tx('Mixture spreads too much', 'Το μείγμα απλώνει υπερβολικά'), tx('Liquid ↓', 'Υγρό ↓')),
        row(tx('Mixture does not spread', 'Το μείγμα δεν απλώνει'), tx('Liquid ↑', 'Υγρό ↑')),
        row(tx('Pancake is flat', 'Το pancake βγαίνει χωρίς ύψος'), tx('Leavening ↑ or viscosity ↑', 'Διόγκωση ↑ ή ιξώδες ↑')),
        row(tx('Pancake is rubbery', 'Το pancake είναι λαστιχωτό'), tx('Fat ↑ or mixing ↓', 'Λίπος ↑ ή ανάμειξη ↓')),
        row(tx('Pancake is crumbly', 'Το pancake τρίβεται'), tx('Egg ↑ or liquid ↑', 'Αυγό ↑ ή υγρό ↑')),
        row(tx('Waffle softens', 'Το waffle μαλακώνει'), tx('Liquid ↓ / starch ↑ / drying ↑', 'Υγρό ↓ / άμυλο ↑ / στέγνωμα ↑')),
        row(tx('Waffle is dense', 'Το waffle είναι βαρύ'), tx('Leavening ↑', 'Διόγκωση ↑')),
        row(tx('Crêpe tears', 'Η κρέπα σκίζεται'), tx('Egg ↑ or liquid ↓ a little', 'Αυγό ↑ ή υγρό ↓ λίγο')),
        row(tx('Crêpe is rubbery', 'Η κρέπα είναι λαστιχωτή'), tx('Mixing ↓ / fat ↑', 'Ανάμειξη ↓ / λίπος ↑')),
        row(tx('Tempura is heavy', 'Η tempura είναι βαριά'), tx('Liquid ↑ / gluten ↓', 'Υγρό ↑ / γλουτένη ↓')),
        row(tx('Tempura is soggy', 'Η tempura είναι μαλακή'), tx('Starch ↑ / oil heat ↑ / thinner coating', 'Άμυλο ↑ / θερμοκρασία λαδιού ↑ / λεπτότερη επικάλυψη')),
        row(tx('Beer mixture is too thick', 'Το μείγμα μπύρας είναι πολύ παχύ'), tx('Liquid ↑', 'Υγρό ↑')),
        row(tx('Fritter falls apart', 'Το fritter διαλύεται'), tx('Egg ↑ / flour ↑', 'Αυγό ↑ / αλεύρι ↑')),
         row(tx('Dutch baby does not puff', 'Το Dutch baby δεν φουσκώνει'), tx('Heat ↑ / preheated vessel / egg–liquid balance', 'Θερμότητα ↑ / προθερμασμένο σκεύος / ισορροπία αυγού–υγρού')),
       ]),
      table(tx('A short summary of the map', 'Σύντομη σύνοψη του χάρτη'), [tx('Ingredient pattern', 'Μοτίβο υλικών'), tx('Main family', 'Κύρια οικογένεια'), tx('What decides the difference', 'Τι κάνει τη διαφορά')], [
        row(tx('High liquid + high egg + no leavening', 'Υψηλό υγρό + υψηλό αυγό + χωρίς διόγκωση'), tx('Crêpe / Dutch baby / Yorkshire', 'Crêpe / Dutch baby / Yorkshire'), tx('Cooking method', 'Μέθοδος μαγειρέματος')),
        row(tx('Medium liquid + medium egg + chemical leavening', 'Μέτριο υγρό + μέτριο αυγό + χημική διόγκωση'), tx('Pancake', 'Pancake'), tx('Griddle setting and retained gas', 'Πήξη στην πλάκα και συγκράτηση αερίου')),
        row(tx('Medium liquid + medium egg + high fat', 'Μέτριο υγρό + μέτριο αυγό + υψηλό λίπος'), tx('Waffle', 'Waffle'), tx('Waffle iron and surface dehydration', 'Waffle iron και επιφανειακή αφυδάτωση')),
        row(tx('High liquid + low egg + very low fat', 'Υψηλό υγρό + χαμηλό αυγό + πολύ χαμηλό λίπος'), tx('Tempura / coating', 'Tempura / coating'), tx('Low gluten and rapid frying dehydration', 'Χαμηλή γλουτένη και γρήγορη αφυδάτωση')),
        row(tx('Medium-low liquid + inclusions + frying', 'Μέτριο-χαμηλό υγρό + προσθήκες + τηγάνισμα'), tx('Fritter', 'Fritter'), tx('The mixture becomes the body', 'Το μείγμα γίνεται το σώμα')),
        row(tx('High egg + high liquid + oven setting', 'Υψηλό αυγό + υψηλό υγρό + πήξη στον φούρνο'), tx('Clafoutis / creamy mixture', 'Clafoutis / κρεμώδες μείγμα'), tx('Egg coagulation and starch setting', 'Πήξη αυγού και αμύλου')),
        row(tx('Lower liquid + high fat + high sugar + leavening', 'Χαμηλότερο υγρό + υψηλό λίπος + υψηλή ζάχαρη + διόγκωση'), tx('Near cake', 'Κοντά στα κέικ'), tx('Fat, sugar, and set crumb become structural', 'Λίπος, ζάχαρη και πήξη ψίχας γίνονται δομικά')),
      ]),
    ],
  },
];

function localize(locale: Locale): BatterContent {
  const pick = (value: LocalizedText): string => value[locale];
  return {
    eyebrow: locale === 'en' ? 'THEORY / BATTERS' : 'ΘΕΩΡΙΑ / ΜΕΙΓΜΑΤΑ',
    title: locale === 'en' ? 'How batters work.' : 'Πώς λειτουργούν τα ρευστά μείγματα.',
    intro: locale === 'en'
      ? 'From thin crêpe to waffle, Dutch baby, frying coating, fritter, fermented mixture, foam, and cake-like mixture: ingredients and cooking method work together.'
      : 'Από τη λεπτή κρέπα στη βάφλα, το Dutch baby, την επικάλυψη τηγανίσματος, το fritter, το ζυμωμένο μείγμα, τον αφρό και τα μείγματα που πλησιάζουν τα κέικ: τα υλικά και το ψήσιμο δουλεύουν μαζί.',
    contentsTitle: locale === 'en' ? 'On this page' : 'Σε αυτή τη σελίδα',
    sectionLabel: locale === 'en' ? 'Section' : 'Ενότητα',
    tableLabel: locale === 'en' ? 'Reference table' : 'Πίνακας αναφοράς',
    noteLabel: locale === 'en' ? 'Keep in mind' : 'Να θυμάσαι',
    backToTheory: locale === 'en' ? 'Theory' : 'Θεωρία',
    linkToReferences: locale === 'en' ? 'Browse the example formulas' : 'Δες τις ενδεικτικές φόρμουλες',
    diagramLabel: locale === 'en' ? 'Diagram' : 'Διάγραμμα',
    diagramFallbackLabel: locale === 'en' ? 'In simple terms' : 'Με απλά λόγια',
    sections: RAW_SECTIONS.map((section) => ({
      id: section.id,
      number: section.number,
      eyebrow: pick(section.eyebrow),
      title: pick(section.title),
      intro: pick(section.intro),
      paragraphs: section.paragraphs?.map(pick),
      bullets: section.bullets?.map(pick),
      tables: section.tables?.map((item) => ({
        caption: pick(item.caption),
        columns: item.columns.map(pick),
        rows: item.rows.map((cells) => cells.map(pick)),
        note: item.note ? pick(item.note) : undefined,
      })),
      diagrams: section.diagrams?.map((item) => ({ id: item.id, title: pick(item.title), code: pick(item.code), fallback: pick(item.fallback) })),
    })),
  };
}

export const BATTER_CONTENT: Record<Locale, BatterContent> = {
  en: localize('en'),
  el: localize('el'),
};
