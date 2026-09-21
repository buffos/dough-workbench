import type { Locale } from './messages';

export interface CrackerTable {
  caption: string;
  columns: string[];
  rows: string[][];
  note?: string;
}

export interface CrackerSection {
  id: string;
  number: number;
  eyebrow: string;
  title: string;
  intro: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: CrackerTable;
}

export interface CrackerContent {
  eyebrow: string;
  title: string;
  intro: string;
  contentsTitle: string;
  sectionLabel: string;
  tableLabel: string;
  noteLabel: string;
  backToTheory: string;
  linkToReferences: string;
  sections: CrackerSection[];
}

export const CRACKER_CONTENT: Record<Locale, CrackerContent> = {
  en: {
    eyebrow: 'THEORY / CRACKERS',
    title: 'Crackers are a structural map, not one recipe.',
    intro: 'A cracker moves between hard crisp sheet, classic cracker, flaky layer, short dough, and savoury biscuit. Hydration, fat, leavening, gluten development, thickness, and drying decide where it lands.',
    contentsTitle: 'On this page',
    sectionLabel: 'Section',
    tableLabel: 'Reference table',
    noteLabel: 'Keep in mind',
    backToTheory: 'Theory',
    linkToReferences: 'Browse the cracker reference formulas',
    sections: [
      {
        id: 'reference-formula',
        number: 1,
        eyebrow: '01 / REFERENCE FORMULA',
        title: 'The classic plain cracker',
        intro: 'The baseline keeps the dough thin, low in water, moderately short, and only lightly aerated. Baker’s percentage uses total flour as 100%.',
        paragraphs: [
          'The target is not a bread crumb. It is a thin, low-moisture sheet with a clean snap, crisp or friable bite, and little elasticity. Medium-protein flour around 9–11% is a useful starting point.',
        ],
        table: {
          caption: 'Classic plain cracker — baker’s percentage',
          columns: ['Ingredient', 'Baker’s %'],
          rows: [
            ['Flour', '100%'],
            ['Water', '35%'],
            ['Olive or neutral oil', '12%'],
            ['Salt', '2%'],
            ['Baking powder', '1%'],
          ],
        },
      },
      {
        id: 'batch-example',
        number: 2,
        eyebrow: '02 / WORKING BATCH',
        title: 'A 500 g flour example',
        intro: 'The reference formulas in the catalog use a 500 g flour basis so that the variants can be compared directly.',
        table: {
          caption: 'Classic plain cracker — 500 g flour basis',
          columns: ['Ingredient', 'Amount'],
          rows: [
            ['Flour', '500 g'],
            ['Water', '175 g'],
            ['Oil', '60 g'],
            ['Salt', '10 g'],
            ['Baking powder', '5 g'],
          ],
        },
      },
      {
        id: 'process',
        number: 3,
        eyebrow: '03 / COMMON PROCESS',
        title: 'The procedure finishes the formula',
        intro: 'The common process deliberately limits gluten and removes water. Variant-specific steps change the texture without hiding the shared method.',
        bullets: [
          'Mix flour, salt, and baking powder dry; distribute the oil through the flour without fully rubbing it in.',
          'Add only enough water to form a homogeneous dough. Mix for about 1–2 minutes and do not chase a windowpane.',
          'Cover and rest for about 20–30 minutes. This is hydration and gluten relaxation, not fermentation.',
          'Roll to about 1–2 mm, dock with a fork or docker, and bake at approximately 180–190 °C for 10–15 minutes.',
          'Cool and dry sufficiently for the final sheet to become brittle and crisp. Puffy and flaky variants alter docking or lamination deliberately.',
        ],
        paragraphs: [
          'Low hydration + moderate fat + little gluten + a thin sheet + low final moisture is the central cracker logic. Changing one axis moves the result toward hard, crisp, flaky, short, or biscuit-like territory.',
        ],
      },
      {
        id: 'thickness',
        number: 4,
        eyebrow: '04 / THICKNESS',
        title: 'Thickness is a structural variable',
        intro: 'The same dough can read as a chip, a classic cracker, or a biscuit-like piece depending on how much material must dry through.',
        table: {
          caption: 'Thickness and expected result',
          columns: ['Thickness', 'Result'],
          rows: [
            ['~0.7–1 mm', 'Very thin, crisp, almost chip-like'],
            ['~1.5 mm', 'Classic cracker'],
            ['~2–3 mm', 'More substantial, biscuit-like'],
            ['>3 mm', 'A crumb begins to appear'],
          ],
        },
      },
      {
        id: 'variants',
        number: 5,
        eyebrow: '05 / FORMULA VARIANTS',
        title: 'Twelve starting formulas',
        intro: 'The rows below are the concrete reference set: one classic anchor and eleven controlled variants. Ranges remain visible even when the catalog stores a representative midpoint.',
        table: {
          caption: 'Cracker variant formulas',
          columns: ['Type', 'Flour', 'Water', 'Fat / additions', 'Salt', 'Baking powder', 'Expected character'],
          rows: [
            ['Classic plain', '100% white', '35%', '12% fat', '2%', '1%', 'Crisp and neutral'],
            ['Lean / hard', '100% white', '32%', '5% fat', '2%', '0.5%', 'Hard, dry, sharp snap'],
            ['Extra crisp', '100% white', '34%', '10% fat', '2%', '1%', 'Thin, dry, clean fracture'],
            ['Richer / short', '100% white', '28–30%', '20% fat', '2%', '1%', 'Friable and biscuit-like'],
            ['Flaky', '100% white', '38%', '8% dough fat + 10% layer fat', '2%', '1%', 'Layered, flaky, crisp'],
            ['Puffy / aerated', '100% white', '38%', '10% fat', '2%', '2–2.5%', 'Light and porous'],
            ['Cheese', '100% white', '25–30%', '15% fat + 30% hard cheese', '0.8–1.2%', '1%', 'Rich, savoury, crumbly'],
            ['Seed', '100% white', '38%', '10% fat + 15–25% seeds', '2%', '1%', 'Crisp and rustic'],
            ['Olive and herb', '100% white', '30–32%', '15% oil + 15% olives + 1–2% herbs', '1%', '1%', 'Mediterranean savoury'],
            ['Wholegrain', '60% white + 40% whole wheat', '42%', '12% fat', '2%', '1%', 'Earthy and coarse'],
            ['Rye', '60% wheat + 40% rye', '45%', '8% fat', '2%', '0–0.5%', 'Dense, brittle, rustic'],
            ['Spiced', '100% white', '35%', '12% fat + flavour spices', '2%', '1%', 'Same structure, different flavour'],
          ],
          note: 'The source provides ranges for several variants. The catalog uses midpoint values for a deterministic 500 g expert-seed formula; the original ranges remain the useful design space.',
        },
      },
      {
        id: 'canonical-matrix',
        number: 6,
        eyebrow: '06 / STRUCTURAL COMPARISON',
        title: 'The twelve structural zones',
        intro: 'A cracker is multidimensional. The same fat percentage means something different when hydration, leavening, thickness, or lamination changes.',
        table: {
          caption: 'Cracker comparison table',
          columns: ['Type', 'Hydration', 'Fat', 'Leavening', 'Technique', 'Final texture'],
          rows: [
            ['1. Lean hard cracker', '30–33%', '3–6%', '0–0.5%', 'Thin roll, docked', 'Hard, dry, strong snap'],
            ['2. Classic plain cracker', '34–37%', '8–12%', '0.5–1%', 'Thin roll, docked', 'Crisp, neutral'],
            ['3. Extra-thin crisp cracker', '32–35%', '8–12%', '0–0.5%', 'Very thin sheet', 'Brittle, chip-like'],
            ['4. Puffy cracker', '36–40%', '8–12%', '1.5–2.5%', 'Docked or partial docking', 'Light, porous'],
            ['5. Flaky / laminated cracker', '36–40%', '15–20% total', '0.5–1%', 'Folds / lamination', 'Layered, flaky, crisp'],
            ['6. Rich cracker', '30–34%', '15–20%', '0.5–1%', 'Low kneading', 'More friable'],
            ['7. Short cracker', '25–30%', '20–30%', '0.5–1.5%', 'Short mixing', 'Crumbly, fragile'],
            ['8. Cheese cracker', '25–32%', '15–25%*', '0.5–1.5%', 'Short mixing', 'Rich, crisp, crumbly'],
            ['9. Seed cracker', '36–45%', '8–15%', '0–1%', 'Seeds inside or on top', 'Crisp, rustic'],
            ['10. Wholegrain cracker', '38–45%', '8–15%', '0.5–1%', 'Rest matters', 'Coarse, dry-crisp'],
            ['11. Rye / low-gluten cracker', '40–50%', '5–12%', '0–0.5%', 'Minimal gluten development', 'Dense, brittle'],
            ['12. Savoury biscuit-border cracker', '20–28%', '30–40%', '1–3%', 'Short dough', 'Crumbly, biscuit-like'],
          ],
          note: '* Cheese contributes its own fat, so effective fat is higher than the added-oil column alone.',
        },
      },
      {
        id: 'cracker-map',
        number: 7,
        eyebrow: '07 / CRACKER MAP',
        title: 'Hydration, fat, and leavening',
        intro: 'With medium-protein white flour, about 2% salt, thin rolling, and no yeast fermentation held constant, these three axes describe the main movement.',
        table: {
          caption: 'Three-axis cracker map',
          columns: ['Hydration', 'Fat', 'Leavening', 'Region', 'Typical result'],
          rows: [
            ['28–32%', '0–5%', '0–0.5%', 'Lean hard cracker', 'Hard, dense, dry snap'],
            ['32–36%', '5–12%', '0–1%', 'Classic cracker', 'Crisp, clean fracture'],
            ['34–38%', '8–15%', '1–2%', 'Light / aerated cracker', 'Lighter, porous'],
            ['36–40%', '12–20%', '0.5–1.5%', 'Flaky-capable zone', 'Flaky when folded or laminated'],
            ['28–34%', '15–22%', '0.5–1.5%', 'Rich cracker', 'Tender, friable'],
            ['24–30%', '20–30%', '0.5–2%', 'Short cracker', 'Crumbly, sandy'],
            ['20–28%', '30–40%', '1–3%', 'Savoury biscuit', 'Short, tender, crumbly'],
            ['40–50%', '0–8%', '0–1%', 'Crispbread / lean sheet', 'Dry, very crisp, rustic'],
            ['40%+', '5–15%', '1–3%', 'Bread-like / puffed zone', 'More porous, less cracker-like'],
          ],
        },
      },
      {
        id: 'two-dimensional-slice',
        number: 8,
        eyebrow: '08 / TWO-DIMENSIONAL SLICE',
        title: 'Hold leavening at 1%',
        intro: 'A two-dimensional slice makes the movement between hard, classic, rich, short, and biscuit-like regions easier to see.',
        table: {
          caption: 'Fat × hydration, with leavening fixed at 1%',
          columns: ['Fat / Hydration', '25–30%', '30–35%', '35–40%', '40–45%'],
          rows: [
            ['0–5%', 'Hard biscuit-like slab', 'Lean cracker', 'Lean / puffy cracker', 'Crispbread / flatbread'],
            ['5–12%', 'Hard crisp', 'Classic cracker', 'Light cracker', 'Airy / crispbread'],
            ['12–20%', 'Rich dense cracker', 'Rich cracker', 'Flaky-capable', 'Soft / aerated edge'],
            ['20–30%', 'Short cracker', 'Short-rich cracker', 'Tender / puffy hybrid', 'Unusual / unstable'],
            ['30–40%', 'Savoury biscuit', 'Savoury biscuit', 'Rich biscuit', 'Not a typical cracker'],
          ],
        },
      },
      {
        id: 'five-zones',
        number: 9,
        eyebrow: '09 / FIVE-ZONE MAP',
        title: 'A compact working map',
        intro: 'These zones are practical starting regions. They are not rigid borders, because process and flour choice can move a formula across them.',
        table: {
          caption: 'Compact cracker zones',
          columns: ['Zone', 'Hydration', 'Fat', 'Leavening'],
          rows: [
            ['Hard / lean cracker', '28–34%', '0–6%', '0–0.5%'],
            ['Classic cracker', '32–38%', '6–15%', '0.5–1.5%'],
            ['Rich / flaky cracker', '32–40%', '15–22%', '0.5–1.5%'],
            ['Short cracker', '24–32%', '20–30%', '0.5–2%'],
            ['Savoury biscuit', '20–30%', '30–40%+', '1–3%'],
          ],
        },
        paragraphs: [
          'On the low-fat side, crackers approach hardtack, crispbread, or flatbread. On the high-fat side, they approach short crackers and savoury biscuits. Higher hydration and leavening move toward aerated or bread-like territory.',
          'The useful chain is: crispbread ← lean cracker ← classic cracker → rich cracker → short cracker → savoury biscuit.',
        ],
      },
    ],
  },
  el: {
    eyebrow: 'ΘΕΩΡΙΑ / ΚΡΑΚΕΡ',
    title: 'Τα κράκερ είναι χάρτης δομής, όχι μία συνταγή.',
    intro: 'Ένα κράκερ κινείται ανάμεσα σε σκληρό τραγανό φύλλο, κλασικό cracker, φυλλώδη στρώση, τριφτή ζύμη και αλμυρό biscuit. Η ενυδάτωση, το λίπος, η διόγκωση, η γλουτένη, το πάχος και η ξήρανση καθορίζουν τη θέση του.',
    contentsTitle: 'Σε αυτή τη σελίδα',
    sectionLabel: 'Ενότητα',
    tableLabel: 'Πίνακας αναφοράς',
    noteLabel: 'Να θυμάσαι',
    backToTheory: 'Θεωρία',
    linkToReferences: 'Δες τις φόρμουλες αναφοράς για κράκερ',
    sections: [
      {
        id: 'reference-formula',
        number: 1,
        eyebrow: '01 / REFERENCE FORMULA',
        title: 'Το κλασικό απλό κράκερ',
        intro: 'Η βάση κρατά τη ζύμη λεπτή, με λίγο νερό, μέτριο λίπος και ελάχιστη διόγκωση. Τα ποσοστά αρτοποιίας χρησιμοποιούν το συνολικό αλεύρι ως 100%.',
        paragraphs: [
          'Ο στόχος δεν είναι ψίχα ψωμιού. Είναι ένα λεπτό φύλλο χαμηλής τελικής υγρασίας, με καθαρό snap, τραγανή ή τριφτή υφή και μικρή ελαστικότητα. Ένα άλευρο μέτριας πρωτεΐνης, περίπου 9–11%, είναι χρήσιμο σημείο εκκίνησης.',
        ],
        table: {
          caption: 'Κλασικό απλό κράκερ — baker’s percentage',
          columns: ['Υλικό', 'Baker’s %'],
          rows: [
            ['Αλεύρι', '100%'],
            ['Νερό', '35%'],
            ['Ελαιόλαδο ή ουδέτερο λάδι', '12%'],
            ['Αλάτι', '2%'],
            ['Baking powder', '1%'],
          ],
        },
      },
      {
        id: 'batch-example',
        number: 2,
        eyebrow: '02 / WORKING BATCH',
        title: 'Παράδειγμα με 500 g αλεύρι',
        intro: 'Οι φόρμουλες αναφοράς στον κατάλογο χρησιμοποιούν βάση 500 g αλευριού, ώστε οι παραλλαγές να συγκρίνονται άμεσα.',
        table: {
          caption: 'Κλασικό απλό κράκερ — βάση 500 g αλευριού',
          columns: ['Υλικό', 'Ποσότητα'],
          rows: [
            ['Αλεύρι', '500 g'],
            ['Νερό', '175 g'],
            ['Λάδι', '60 g'],
            ['Αλάτι', '10 g'],
            ['Baking powder', '5 g'],
          ],
        },
      },
      {
        id: 'process',
        number: 3,
        eyebrow: '03 / COMMON PROCESS',
        title: 'Η διαδικασία ολοκληρώνει τη φόρμουλα',
        intro: 'Η κοινή διαδικασία περιορίζει τη γλουτένη και απομακρύνει νερό. Τα ειδικά βήματα των παραλλαγών αλλάζουν την υφή χωρίς να κρύβουν την κοινή μέθοδο.',
        bullets: [
          'Ανάμειξε στεγνά αλεύρι, αλάτι και baking powder· μοίρασε το λάδι στο αλεύρι χωρίς να το τρίψεις πλήρως.',
          'Πρόσθεσε μόνο όσο νερό χρειάζεται για ομοιογενή ζύμη. Ανάμειξε περίπου 1–2 λεπτά και μην επιδιώξεις windowpane.',
          'Σκέπασε και άφησε περίπου 20–30 λεπτά. Είναι ενυδάτωση και χαλάρωση γλουτένης, όχι ζύμωση.',
          'Άνοιξε στα 1–2 mm, τρύπησε με πιρούνι ή docker και ψήσε περίπου στους 180–190 °C για 10–15 λεπτά.',
          'Άφησε να κρυώσει και να στεγνώσει αρκετά ώστε το φύλλο να γίνει εύθραυστο και τραγανό. Οι puffy και flaky παραλλαγές αλλάζουν σκόπιμα το docking ή τη φυλλοποίηση.',
        ],
        paragraphs: [
          'Λίγο νερό + μέτριο λίπος + λίγη γλουτένη + λεπτό φύλλο + χαμηλή τελική υγρασία είναι η βασική λογική των κράκερ. Η αλλαγή ενός άξονα μετακινεί το αποτέλεσμα προς σκληρό, τραγανό, φυλλώδες, τριφτό ή biscuit-like.',
        ],
      },
      {
        id: 'thickness',
        number: 4,
        eyebrow: '04 / THICKNESS',
        title: 'Το πάχος είναι δομική μεταβλητή',
        intro: 'Η ίδια ζύμη μπορεί να διαβαστεί ως chip, κλασικό κράκερ ή biscuit-like κομμάτι, ανάλογα με το πόση μάζα πρέπει να στεγνώσει μέχρι το κέντρο.',
        table: {
          caption: 'Πάχος και αναμενόμενο αποτέλεσμα',
          columns: ['Πάχος', 'Αποτέλεσμα'],
          rows: [
            ['~0,7–1 mm', 'Πολύ λεπτό, τραγανό, σχεδόν chip-like'],
            ['~1,5 mm', 'Κλασικό cracker'],
            ['~2–3 mm', 'Πιο substantial, biscuit-like'],
            ['>3 mm', 'Αρχίζει να εμφανίζεται «ψίχα»'],
          ],
        },
      },
      {
        id: 'variants',
        number: 5,
        eyebrow: '05 / FORMULA VARIANTS',
        title: 'Δώδεκα φόρμουλες εκκίνησης',
        intro: 'Οι παρακάτω γραμμές είναι το συγκεκριμένο σύνολο αναφοράς: μία κλασική βάση και έντεκα ελεγχόμενες παραλλαγές. Τα εύρη παραμένουν ορατά, ακόμη κι όταν ο κατάλογος κρατά midpoint.',
        table: {
          caption: 'Παραλλαγές φόρμουλας για κράκερ',
          columns: ['Τύπος', 'Αλεύρι', 'Νερό', 'Λίπος / προσθήκες', 'Αλάτι', 'Baking powder', 'Αναμενόμενος χαρακτήρας'],
          rows: [
            ['Κλασικό απλό', '100% λευκό', '35%', '12% λίπος', '2%', '1%', 'Τραγανό και ουδέτερο'],
            ['Σκληρό / άλιπο', '100% λευκό', '32%', '5% λίπος', '2%', '0,5%', 'Σκληρό, ξηρό, έντονο snap'],
            ['Εξαιρετικά τραγανό', '100% λευκό', '34%', '10% λίπος', '2%', '1%', 'Λεπτό, ξηρό, καθαρό σπάσιμο'],
            ['Πλουσιότερο / τριφτό', '100% λευκό', '28–30%', '20% λίπος', '2%', '1%', 'Εύθρυπτο και biscuit-like'],
            ['Flaky', '100% λευκό', '38%', '8% λίπος στη ζύμη + 10% σε στρώση', '2%', '1%', 'Στρωτό, flaky, τραγανό'],
            ['Puffy / αεριζόμενο', '100% λευκό', '38%', '10% λίπος', '2%', '2–2,5%', 'Ελαφρύ και πορώδες'],
            ['Με τυρί', '100% λευκό', '25–30%', '15% λίπος + 30% σκληρό τυρί', '0,8–1,2%', '1%', 'Πλούσιο, αλμυρό, τριφτό'],
            ['Με σπόρους', '100% λευκό', '38%', '10% λίπος + 15–25% σπόροι', '2%', '1%', 'Τραγανό και rustic'],
            ['Με ελιές και βότανα', '100% λευκό', '30–32%', '15% λάδι + 15% ελιές + 1–2% βότανα', '1%', '1%', 'Μεσογειακό, αλμυρό'],
            ['Ολικής άλεσης', '60% λευκό + 40% ολικής', '42%', '12% λίπος', '2%', '1%', 'Earthy και coarse'],
            ['Σίκαλης', '60% σιτάρι + 40% σίκαλη', '45%', '8% λίπος', '2%', '0–0,5%', 'Πυκνό, brittle, rustic'],
            ['Καρυκευμένο', '100% λευκό', '35%', '12% λίπος + καρυκεύματα', '2%', '1%', 'Ίδια δομή, διαφορετική γεύση'],
          ],
          note: 'Η πηγή δίνει εύρη σε αρκετές παραλλαγές. Ο κατάλογος χρησιμοποιεί midpoint για deterministic φόρμουλα 500 g ως expert seed· τα αρχικά εύρη παραμένουν ο χρήσιμος χώρος σχεδιασμού.',
        },
      },
      {
        id: 'canonical-matrix',
        number: 6,
        eyebrow: '06 / ΣΥΓΚΡΙΣΗ ΔΟΜΗΣ',
        title: 'Οι δώδεκα δομικές ζώνες',
        intro: 'Το cracker είναι πολυδιάστατο. Το ίδιο ποσοστό λίπους σημαίνει κάτι διαφορετικό όταν αλλάζουν η ενυδάτωση, η διόγκωση, το πάχος ή η φυλλοποίηση.',
        table: {
          caption: 'Πίνακας σύγκρισης για κράκερ',
          columns: ['Τύπος', 'Ενυδάτωση', 'Λίπος', 'Διόγκωση', 'Τεχνική', 'Τελική υφή'],
          rows: [
            ['1. Lean hard cracker', '30–33%', '3–6%', '0–0,5%', 'Λεπτό άνοιγμα, docking', 'Σκληρό, ξηρό, έντονο snap'],
            ['2. Classic plain cracker', '34–37%', '8–12%', '0,5–1%', 'Λεπτό άνοιγμα, docking', 'Τραγανό, ουδέτερο'],
            ['3. Extra-thin crisp cracker', '32–35%', '8–12%', '0–0,5%', 'Πολύ λεπτό φύλλο', 'Brittle, chip-like'],
            ['4. Puffy cracker', '36–40%', '8–12%', '1,5–2,5%', 'Docked ή μερικό docking', 'Ελαφρύ, porous'],
            ['5. Flaky / laminated cracker', '36–40%', '15–20% συνολικά', '0,5–1%', 'Folds / lamination', 'Layered, flaky, crisp'],
            ['6. Rich cracker', '30–34%', '15–20%', '0,5–1%', 'Χαμηλό ζύμωμα', 'Πιο friable'],
            ['7. Short cracker', '25–30%', '20–30%', '0,5–1,5%', 'Short mixing', 'Τριφτό, εύθραυστο'],
            ['8. Cheese cracker', '25–32%', '15–25%*', '0,5–1,5%', 'Short mixing', 'Rich, crisp, crumbly'],
            ['9. Seed cracker', '36–45%', '8–15%', '0–1%', 'Σπόροι μέσα ή πάνω', 'Crisp, rustic'],
            ['10. Wholegrain cracker', '38–45%', '8–15%', '0,5–1%', 'Σημαντικό rest', 'Coarse, dry-crisp'],
            ['11. Rye / low-gluten cracker', '40–50%', '5–12%', '0–0,5%', 'Ελάχιστη ανάπτυξη γλουτένης', 'Dense, brittle'],
            ['12. Savoury biscuit-border cracker', '20–28%', '30–40%', '1–3%', 'Short dough', 'Crumbly, biscuit-like'],
          ],
          note: '* Το τυρί προσθέτει το δικό του λίπος, επομένως το effective fat είναι υψηλότερο από το λάδι μόνο.',
        },
      },
      {
        id: 'cracker-map',
        number: 7,
        eyebrow: '07 / CRACKER MAP',
        title: 'Ενυδάτωση, λίπος και διόγκωση',
        intro: 'Με μέτριας πρωτεΐνης λευκό αλεύρι, περίπου 2% αλάτι, λεπτό άνοιγμα και χωρίς ζύμωση με μαγιά, αυτοί οι τρεις άξονες περιγράφουν την κύρια μετακίνηση.',
        table: {
          caption: 'Τρισδιάστατος χάρτης κράκερ',
          columns: ['Ενυδάτωση', 'Λίπος', 'Διόγκωση', 'Περιοχή', 'Τυπικό αποτέλεσμα'],
          rows: [
            ['28–32%', '0–5%', '0–0,5%', 'Lean hard cracker', 'Σκληρό, dense, dry snap'],
            ['32–36%', '5–12%', '0–1%', 'Classic cracker', 'Crisp, καθαρό fracture'],
            ['34–38%', '8–15%', '1–2%', 'Light / aerated cracker', 'Πιο ελαφρύ, porous'],
            ['36–40%', '12–20%', '0,5–1,5%', 'Flaky-capable zone', 'Flaky με folding ή lamination'],
            ['28–34%', '15–22%', '0,5–1,5%', 'Rich cracker', 'Πιο tender, friable'],
            ['24–30%', '20–30%', '0,5–2%', 'Short cracker', 'Crumbly, sandy'],
            ['20–28%', '30–40%', '1–3%', 'Savoury biscuit', 'Short, tender, crumbly'],
            ['40–50%', '0–8%', '0–1%', 'Crispbread / lean sheet', 'Ξηρό, πολύ crisp, rustic'],
            ['40%+', '5–15%', '1–3%', 'Bread-like / puffed zone', 'Πιο porous, λιγότερο cracker-like'],
          ],
        },
      },
      {
        id: 'two-dimensional-slice',
        number: 8,
        eyebrow: '08 / TWO-DIMENSIONAL SLICE',
        title: 'Κράτησε τη διόγκωση στο 1%',
        intro: 'Μια δισδιάστατη τομή κάνει πιο καθαρή τη μετακίνηση ανάμεσα σε hard, classic, rich, short και biscuit-like περιοχές.',
        table: {
          caption: 'Λίπος × ενυδάτωση, με διόγκωση σταθερή στο 1%',
          columns: ['Λίπος / Ενυδάτωση', '25–30%', '30–35%', '35–40%', '40–45%'],
          rows: [
            ['0–5%', 'Hard biscuit-like slab', 'Lean cracker', 'Lean / puffy cracker', 'Crispbread / flatbread'],
            ['5–12%', 'Hard crisp', 'Classic cracker', 'Light cracker', 'Airy / crispbread'],
            ['12–20%', 'Rich dense cracker', 'Rich cracker', 'Flaky-capable', 'Soft / aerated edge'],
            ['20–30%', 'Short cracker', 'Short-rich cracker', 'Tender / puffy hybrid', 'Unusual / unstable'],
            ['30–40%', 'Savoury biscuit', 'Savoury biscuit', 'Rich biscuit', 'Όχι τυπικό cracker'],
          ],
        },
      },
      {
        id: 'five-zones',
        number: 9,
        eyebrow: '09 / FIVE-ZONE MAP',
        title: 'Ένας συμπαγής χάρτης εργασίας',
        intro: 'Οι ζώνες είναι πρακτικές περιοχές εκκίνησης. Δεν είναι άκαμπτα σύνορα, επειδή η διαδικασία και το άλευρο μπορούν να μετακινήσουν μια φόρμουλα.',
        table: {
          caption: 'Συμπαγείς ζώνες κράκερ',
          columns: ['Ζώνη', 'Ενυδάτωση', 'Λίπος', 'Διόγκωση'],
          rows: [
            ['Hard / lean cracker', '28–34%', '0–6%', '0–0,5%'],
            ['Classic cracker', '32–38%', '6–15%', '0,5–1,5%'],
            ['Rich / flaky cracker', '32–40%', '15–22%', '0,5–1,5%'],
            ['Short cracker', '24–32%', '20–30%', '0,5–2%'],
            ['Savoury biscuit', '20–30%', '30–40%+', '1–3%'],
          ],
        },
        paragraphs: [
          'Στην πλευρά με λίγο λίπος, τα κράκερ πλησιάζουν το hardtack, το crispbread ή την επίπεδη ζύμη. Με πολύ λίπος πλησιάζουν τα short crackers και τα savoury biscuits. Με περισσότερη ενυδάτωση και διόγκωση κινούνται προς αεριζόμενη ή ψωμένια περιοχή.',
          'Η χρήσιμη αλυσίδα είναι: crispbread ← lean cracker ← classic cracker → rich cracker → short cracker → savoury biscuit.',
        ],
      },
    ],
  },
};
