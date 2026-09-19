import type { Locale } from './messages';

export interface BreadsticksTable {
  caption: string;
  columns: string[];
  rows: string[][];
  note?: string;
}

export interface BreadsticksSection {
  id: string;
  number: number;
  eyebrow: string;
  title: string;
  intro: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: BreadsticksTable;
}

export interface BreadsticksContent {
  eyebrow: string;
  title: string;
  intro: string;
  contentsTitle: string;
  sectionLabel: string;
  tableLabel: string;
  noteLabel: string;
  backToTheory: string;
  backToWorkspace: string;
  linkToReferences: string;
  sections: BreadsticksSection[];
}

export const BREADSTICKS_CONTENT: Record<Locale, BreadsticksContent> = {
  en: {
    eyebrow: 'THEORY / BREADSTICKS',
    title: 'Breadsticks are a range, not one formula.',
    intro: 'Grissini sit between cracker, crisp bread, and breadstick. Water, fat, leavening, thickness, and drying decide where a formula lands on that map.',
    contentsTitle: 'On this page',
    sectionLabel: 'Section',
    tableLabel: 'Reference table',
    noteLabel: 'Keep in mind',
    backToTheory: 'Theory',
    backToWorkspace: 'Workspace',
    linkToReferences: 'Browse the breadstick reference formulas',
    sections: [
      {
        id: 'canonical-matrix',
        number: 1,
        eyebrow: '01 / CANONICAL MATRIX',
        title: 'Ten starting formulas',
        intro: 'All percentages use total flour as 100%. The rows are deliberately close enough to compare, but different enough to show how texture moves.',
        table: {
          caption: 'Breadstick formula families',
          columns: ['Type', 'Flour blend', 'Water', 'Fat', 'Sugar', 'Salt', 'Yeast', 'Additions', 'Expected character'],
          rows: [
            ['Torinese grissini', '100% white', '50-54%', '4-6% olive oil', '0-1%', '2%', '0.5-1%', 'None', 'Very thin, dry, sharp snap'],
            ['Classic olive-oil grissini', '100% white', '54-58%', '8-10% olive oil', '1-2%', '2%', '0.8-1%', 'None', 'Crisp with a little tenderness'],
            ['Greek-style olive-oil', '100% white', '48-53%', '15-20% olive oil', '2-4%', '2%', '0-0.8%', 'Optional sesame', 'Rich, short, less bready'],
            ['Biscuit-style', '100% white', '35-45%', '20-30% fat', '3-6%', '1.8-2%', 'None', 'Baking powder 1-2%', 'Short and crumbly'],
            ['Airy breadstick', '100% strong flour', '62-68%', '4-7% olive oil', '1-2%', '2%', '0.8-1%', 'None', 'More open and bread-like'],
            ['Semolina grissini', '70% white + 30% semolina', '57-61%', '7-10% olive oil', '1-2%', '2%', '0.8-1%', 'Rosemary', 'Firm grainy crunch'],
            ['Whole-wheat grissini', '60-75% white + 25-40% whole wheat', '60-67%', '8-12% olive oil', '2-3%', '2%', '0.8-1%', 'None', 'Dense, rustic, cereal-like'],
            ['Seeded grissini', 'White or partly whole wheat', '58-64%', '8-12% olive oil', '1-3%', '2%', '0.8-1%', '15-25% seeds', 'Crunchy and irregular'],
            ['Cheese grissini', '100% white', '50-55%', '6-10% olive oil', '0-1%', '1-1.5%', '0.5-1%', '15-25% hard cheese', 'Rich, savoury, crumbly'],
            ['Long-fermentation sourdough', '100% white', '58-65%', '6-10% olive oil', '0-2%', '2%', '0-0.3%', '15-25% starter', 'Complex flavour, lighter structure'],
          ],
          note: "The percentages are working targets, not fixed laws. A sourdough starter contributes both flour and water, so its components should be included in a full baker's-percentage calculation when the formula is tested.",
        },
      },
      {
        id: 'texture-map',
        number: 2,
        eyebrow: '02 / TEXTURE MAP',
        title: 'Four variables move the result',
        intro: 'The same name can hide very different bites. Read the formula through the variables that change structure most strongly.',
        table: {
          caption: 'Broad working regions',
          columns: ['Variable', 'Lower range', 'Middle range', 'Upper range'],
          rows: [
            ['Hydration', '45-52%: hard and very crisp', '53-58%: classic grissino', '60-68%: breadstick and more open'],
            ['Fat', '0-5%: hard snap', '6-12%: classic', '15-30%: tender to biscuit-like'],
            ['Sugar', '0-2%: savoury', '3-5%: more browning', 'Above 5%: another snack family becomes likely'],
            ['Thickness', '3-4 mm: brittle and dry', '5-10 mm: classic grissino', '12-15 mm: breadstick'],
          ],
          note: 'Thickness changes the surface-to-volume ratio. A thinner stick can dry out much more easily even when the formula stays unchanged.',
        },
        bullets: [
          'More gluten development makes the stick more elastic and bread-like.',
          'Less development and more fat push the texture toward short and crumbly.',
          'A lower final moisture level often matters as much as the initial formula.',
        ],
      },
      {
        id: 'leavening',
        number: 3,
        eyebrow: '03 / LEAVENING',
        title: 'Leavening changes the kind of bite',
        intro: 'Hydration and fat do not work alone. The gas system decides whether the dough expands through gluten, chemical lift, or not at all.',
        table: {
          caption: 'Leavening choices',
          columns: ['Leavening', 'What it tends to create'],
          rows: [
            ['None', 'Dense, hard, cracker-like structure'],
            ['Yeast 0.2-0.5%', 'Fine cells and a dry grissino profile'],
            ['Yeast 0.8-1.2%', 'More bread-like expansion'],
            ['Baking powder 1-2%', 'Friable, biscuit-like expansion'],
            ['Yeast plus baking powder', 'A lighter middle ground with less clean bread character'],
            ['Sourdough', 'A yeast-like structure with a different flavour profile'],
          ],
        },
        paragraphs: [
          'The structural split is useful: yeast expands a gluten-based network, while baking powder creates gas inside a shorter, more tender system. That is why a biscuit-style stick can share the same shape but not the same internal logic as a grissino.',
        ],
      },
      {
        id: 'process-and-drying',
        number: 4,
        eyebrow: '04 / PROCESS',
        title: 'Baking and drying finish the formula',
        intro: 'Two batches with the same ingredient percentages can finish differently when mixing, thickness, oven time, and drying change.',
        bullets: [
          'Mixing the flour with oil first creates more shortening and a shorter bite.',
          'Developing some gluten before adding the oil preserves more elasticity.',
          'A short bake at about 190-200°C sets colour and shape.',
          'A second stage around 130-150°C removes more water and sharpens the snap.',
          'A thick stick keeps more moisture in the centre and reads as breadstick rather than grissino.',
        ],
        paragraphs: [
          'This is why the reference list keeps Formula and Process separate. The formula describes potential. The process decides how much of that potential reaches the plate.',
        ],
      },
      {
        id: 'first-experiment',
        number: 5,
        eyebrow: '05 / FIRST EXPERIMENT',
        title: 'Start with four controlled batches',
        intro: 'Before testing seeds, cheese, or whole wheat, hold the flour, salt, sugar, yeast, thickness, and bake constant. Change only water and oil.',
        table: {
          caption: 'A simple first comparison',
          columns: ['Batch', 'Water', 'Olive oil', 'What it should show'],
          rows: [
            ['A', '52%', '5%', 'Hard and crisp'],
            ['B', '56%', '10%', 'Canonical grissino'],
            ['C', '52%', '18%', 'Tender and crumbly'],
            ['D', '65%', '6%', 'Airy breadstick'],
          ],
          note: 'Keep salt at 2%, sugar at 2%, and instant yeast at 1% for the comparison. Record thickness and final weight after drying so the result can be compared later.',
        },
      },
    ],
  },
  el: {
    eyebrow: 'ΘΕΩΡΙΑ / ΚΡΙΤΣΙΝΙΑ',
    title: 'Τα κριτσίνια είναι περιοχή, όχι μία συνταγή.',
    intro: 'Τα κριτσίνια κινούνται ανάμεσα σε cracker, τραγανό ψωμί και breadstick. Το νερό, το λίπος, η διόγκωση, το πάχος και η ξήρανση αποφασίζουν πού θα καταλήξει κάθε φόρμουλα.',
    contentsTitle: 'Σε αυτή τη σελίδα',
    sectionLabel: 'Ενότητα',
    tableLabel: 'Πίνακας αναφοράς',
    noteLabel: 'Να θυμάσαι',
    backToTheory: 'Θεωρία',
    backToWorkspace: 'Χώρος εργασίας',
    linkToReferences: 'Δες τις φόρμουλες αναφοράς για κριτσίνια',
    sections: [
      {
        id: 'canonical-matrix',
        number: 1,
        eyebrow: '01 / CANONICAL MATRIX',
        title: 'Δέκα φόρμουλες εκκίνησης',
        intro: 'Όλα τα ποσοστά χρησιμοποιούν το συνολικό αλεύρι ως 100%. Οι γραμμές είναι αρκετά κοντά ώστε να συγκρίνονται, αλλά αρκετά διαφορετικές ώστε να φαίνεται η μετακίνηση της υφής.',
        table: {
          caption: 'Οικογένειες φόρμουλας για κριτσίνια',
          columns: ['Τύπος', 'Μείγμα αλευριού', 'Νερό', 'Λίπος', 'Ζάχαρη', 'Αλάτι', 'Μαγιά', 'Προσθήκες', 'Αναμενόμενος χαρακτήρας'],
          rows: [
            ['Κριτσίνια Τορίνο', '100% λευκό', '50-54%', '4-6% ελαιόλαδο', '0-1%', '2%', '0.5-1%', 'Καμία', 'Πολύ λεπτά, ξηρά, έντονο snap'],
            ['Κλασικά με ελαιόλαδο', '100% λευκό', '54-58%', '8-10% ελαιόλαδο', '1-2%', '2%', '0.8-1%', 'Καμία', 'Τραγανά με λίγη τρυφερότητα'],
            ['Ελληνικού τύπου λαδιού', '100% λευκό', '48-53%', '15-20% ελαιόλαδο', '2-4%', '2%', '0-0.8%', 'Προαιρετικά σουσάμι', 'Πλούσια, τριφτά, λιγότερο ψωμένια'],
            ['Τύπου biscuit', '100% λευκό', '35-45%', '20-30% λίπος', '3-6%', '1.8-2%', 'Καμία', 'Baking powder 1-2%', 'Τριφτά και εύθρυπτα'],
            ['Αέρινα breadsticks', '100% δυνατό', '62-68%', '4-7% ελαιόλαδο', '1-2%', '2%', '0.8-1%', 'Καμία', 'Πιο ανοιχτά και ψωμένια'],
            ['Με σιμιγδάλι', '70% λευκό + 30% σιμιγδάλι', '57-61%', '7-10% ελαιόλαδο', '1-2%', '2%', '0.8-1%', 'Δενδρολίβανο', 'Σκληρό, grainy crunch'],
            ['Ολικής άλεσης', '60-75% λευκό + 25-40% ολικής', '60-67%', '8-12% ελαιόλαδο', '2-3%', '2%', '0.8-1%', 'Καμία', 'Πυκνά, rustic, δημητριακά'],
            ['Πολύσπορα', 'Λευκό ή μερικώς ολικής', '58-64%', '8-12% ελαιόλαδο', '1-3%', '2%', '0.8-1%', '15-25% σπόροι', 'Crunchy με ακανόνιστη δομή'],
            ['Με τυρί', '100% λευκό', '50-55%', '6-10% ελαιόλαδο', '0-1%', '1-1.5%', '0.5-1%', '15-25% σκληρό τυρί', 'Πλούσια, αλμυρά, τριφτά'],
            ['Μακράς ζύμωσης με προζύμι', '100% λευκό', '58-65%', '6-10% ελαιόλαδο', '0-2%', '2%', '0-0.3%', '15-25% προζύμι', 'Σύνθετη γεύση, πιο ανοιχτή δομή'],
          ],
          note: "Τα ποσοστά είναι working targets, όχι απαράβατοι νόμοι. Το προζύμι προσθέτει και αλεύρι και νερό, επομένως στη δοκιμή πρέπει να υπολογιστούν τα συστατικά του σε πλήρη baker's-percentage calculation.",
        },
      },
      {
        id: 'texture-map',
        number: 2,
        eyebrow: '02 / ΧΑΡΤΗΣ ΥΦΗΣ',
        title: 'Τέσσερις μεταβλητές αλλάζουν το αποτέλεσμα',
        intro: 'Το ίδιο όνομα μπορεί να κρύβει τελείως διαφορετικό δάγκωμα. Διάβασε τη φόρμουλα μέσα από τις μεταβλητές που αλλάζουν περισσότερο τη δομή.',
        table: {
          caption: 'Ευρείες πρακτικές περιοχές',
          columns: ['Μεταβλητή', 'Χαμηλή περιοχή', 'Μεσαία περιοχή', 'Υψηλή περιοχή'],
          rows: [
            ['Ενυδάτωση', '45-52%: σκληρά και πολύ τραγανά', '53-58%: κλασικό grissino', '60-68%: breadstick και πιο ανοιχτή δομή'],
            ['Λίπος', '0-5%: σκληρό snap', '6-12%: κλασικό', '15-30%: τρυφερό έως biscuit-like'],
            ['Ζάχαρη', '0-2%: αλμυρά', '3-5%: περισσότερο browning', 'Πάνω από 5%: πιθανή άλλη οικογένεια snack'],
            ['Πάχος', '3-4 mm: brittle και ξηρό', '5-10 mm: κλασικό grissino', '12-15 mm: breadstick'],
          ],
          note: 'Το πάχος αλλάζει την αναλογία επιφάνειας προς όγκο. Ένα λεπτό μπαστούνι χάνει πολύ πιο εύκολα νερό, ακόμη και όταν η φόρμουλα μένει ίδια.',
        },
        bullets: [
          'Περισσότερη ανάπτυξη γλουτένης κάνει το μπαστούνι πιο ελαστικό και ψωμένιο.',
          'Λιγότερη ανάπτυξη και περισσότερο λίπος οδηγούν σε πιο short και τριφτή υφή.',
          'Η τελική υγρασία συχνά επηρεάζει το αποτέλεσμα όσο και η αρχική φόρμουλα.',
        ],
      },
      {
        id: 'leavening',
        number: 3,
        eyebrow: '03 / ΔΙΟΓΚΩΣΗ',
        title: 'Η διόγκωση αλλάζει το είδος του δαγκώματος',
        intro: 'Η ενυδάτωση και το λίπος δεν δουλεύουν μόνα τους. Το σύστημα αερίου αποφασίζει αν η ζύμη θα ανοίξει μέσω γλουτένης, χημικής διόγκωσης ή καθόλου.',
        table: {
          caption: 'Επιλογές διόγκωσης',
          columns: ['Διόγκωση', 'Τι τείνει να δημιουργεί'],
          rows: [
            ['Καμία', 'Πυκνή, σκληρή, cracker-like δομή'],
            ['Μαγιά 0.2-0.5%', 'Μικρές κυψέλες και ξηρό προφίλ grissino'],
            ['Μαγιά 0.8-1.2%', 'Πιο ψωμένια διαστολή'],
            ['Baking powder 1-2%', 'Εύθρυπτη, biscuit-like διαστολή'],
            ['Μαγιά μαζί με baking powder', 'Ενδιάμεση, πιο ελαφριά περιοχή με λιγότερο καθαρό ψωμένιο χαρακτήρα'],
            ['Προζύμι', 'Δομή παρόμοια με μαγιά, αλλά διαφορετικό flavour profile'],
          ],
        },
        paragraphs: [
          "Ο βασικός διαχωρισμός είναι χρήσιμος: η μαγιά διογκώνει ένα δίκτυο που βασίζεται στη γλουτένη, ενώ το baking powder δημιουργεί αέριο μέσα σε ένα πιο short και τρυφερό σύστημα. Για αυτό ένα biscuit-style stick μπορεί να έχει ίδιο σχήμα, αλλά διαφορετική εσωτερική λογική από ένα grissino.",
        ],
      },
      {
        id: 'process-and-drying',
        number: 4,
        eyebrow: '04 / ΔΙΑΔΙΚΑΣΙΑ',
        title: 'Το ψήσιμο και η ξήρανση ολοκληρώνουν τη φόρμουλα',
        intro: 'Δύο παρτίδες με τα ίδια ποσοστά υλικών μπορούν να τελειώσουν διαφορετικά αν αλλάξουν το ζύμωμα, το πάχος, ο φούρνος και η ξήρανση.',
        bullets: [
          'Αν δουλέψεις πρώτα το αλεύρι με το λάδι, αυξάνεις το shortening και παίρνεις πιο τριφτή υφή.',
          'Αν αναπτύξεις πρώτα λίγη γλουτένη και μετά βάλεις το λάδι, κρατάς περισσότερη ελαστικότητα.',
          'Ένα σύντομο ψήσιμο περίπου στους 190-200°C σταθεροποιεί χρώμα και σχήμα.',
          'Ένα δεύτερο στάδιο στους 130-150°C απομακρύνει περισσότερο νερό και δυναμώνει το snap.',
          'Ένα χοντρό μπαστούνι κρατά περισσότερη υγρασία στο κέντρο και διαβάζεται ως breadstick αντί για grissino.',
        ],
        paragraphs: [
          'Για αυτό η λίστα αναφοράς κρατά χωριστά τη Formula και τη Process. Η φόρμουλα περιγράφει το δυναμικό. Η διαδικασία αποφασίζει πόσο από αυτό το δυναμικό φτάνει στο πιάτο.',
        ],
      },
      {
        id: 'first-experiment',
        number: 5,
        eyebrow: '05 / ΠΡΩΤΟ ΠΕΙΡΑΜΑ',
        title: 'Ξεκίνα με τέσσερις ελεγχόμενες παρτίδες',
        intro: 'Πριν δοκιμάσεις σπόρους, τυρί ή ολικής, κράτησε σταθερά το αλεύρι, το αλάτι, τη ζάχαρη, τη μαγιά, το πάχος και το ψήσιμο. Άλλαξε μόνο το νερό και το λάδι.',
        table: {
          caption: 'Μια απλή πρώτη σύγκριση',
          columns: ['Παρτίδα', 'Νερό', 'Ελαιόλαδο', 'Τι πρέπει να δείξει'],
          rows: [
            ['A', '52%', '5%', 'Σκληρό και τραγανό'],
            ['B', '56%', '10%', 'Canonical grissino'],
            ['C', '52%', '18%', 'Τρυφερό και τριφτό'],
            ['D', '65%', '6%', 'Αέρινο breadstick'],
          ],
          note: 'Κράτησε το αλάτι στο 2%, τη ζάχαρη στο 2% και την instant yeast στο 1% για τη σύγκριση. Κατέγραψε το πάχος και το τελικό βάρος μετά την ξήρανση, ώστε να συγκριθούν αργότερα.',
        },
      },
    ],
  },
};
