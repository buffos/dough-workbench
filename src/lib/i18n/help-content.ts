import type { Locale } from './messages';

export interface HelpEntry {
  title: string;
  canonical?: string;
  body: string;
  examples?: string;
  note?: string;
}

export interface HelpSection {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  entries: HelpEntry[];
}

export interface HelpContent {
  eyebrow: string;
  title: string;
  intro: string;
  backToWorkspace: string;
  contentsTitle: string;
  exampleLabel: string;
  noteLabel: string;
  sections: HelpSection[];
}

export const HELP_CONTENT: Record<Locale, HelpContent> = {
  en: {
    eyebrow: 'TERMINOLOGY & CALCULATIONS',
    title: 'A shared language for reading a formula.',
    intro: 'This page explains the terms used by the workspace and why each distinction matters when a dough or batter is analyzed.',
    backToWorkspace: 'Back to workspace',
    contentsTitle: 'On this page',
    exampleLabel: 'Examples',
    noteLabel: 'Why it matters',
    sections: [
      {
        id: 'formula-and-process',
        eyebrow: '01 / SCOPE',
        title: 'Formula is not process',
        intro: 'The current workspace describes what goes into the mixture. It does not yet describe how the mixture is handled.',
        entries: [
          {
            title: 'Formula',
            canonical: 'Composition',
            body: 'The ingredients, their masses, flour basis, functional composition, and declared roles.',
            examples: '700 g flour, 700 g water, 10 g salt.',
          },
          {
            title: 'Process',
            canonical: 'Method',
            body: 'The actions and conditions that transform the formula: mixing, kneading, fermentation, resting, lamination, and baking.',
            examples: '10 minutes of kneading, 24 °C fermentation, overnight retard.',
            note: 'Two identical formulas can behave differently when their processes differ.',
          },
        ],
      },
      {
        id: 'formula-roles',
        eyebrow: '02 / PARTICIPATION',
        title: 'Roles inside the formula',
        intro: 'A role describes how an ingredient participates in the formula. It is not a category for the finished product.',
        entries: [
          {
            title: 'Main dough phase',
            canonical: 'Continuous phase',
            body: 'The ingredient blends into the continuous mass of the dough or batter and acts as part of the medium that carries the other components.',
            examples: 'Water, milk, yogurt, puree, or honey when blended into the mixture.',
          },
          {
            title: 'Structural component',
            canonical: 'Structural',
            body: 'The ingredient contributes to body, setting, or the physical structure of the baked result. A structural ingredient is not automatically part of the flour basis.',
            examples: 'Flour, starch, cocoa powder, milk powder, or structural proteins.',
            note: 'Only flour-bearing structural components contribute to the flour denominator used for baker’s percentages.',
          },
          {
            title: 'Mix-in / inclusion',
            canonical: 'Inclusion',
            body: 'The ingredient remains as a distinct piece or body inside the dough instead of becoming part of the continuous phase.',
            examples: 'Nuts, raisins, chocolate chips, olives, or cheese cubes.',
            note: 'The water or fat inside an inclusion is not assumed to be fully available to the dough during mixing.',
          },
          {
            title: 'Surface treatment',
            canonical: 'SurfaceTreatment',
            body: 'An ingredient applied to the outside before or after baking.',
            examples: 'Egg wash, glaze, or brushing fat.',
          },
          {
            title: 'Filling or topping',
            canonical: 'Filling / Topping',
            body: 'An ingredient that remains a distinct layer or component inside or on top of the baked product.',
            examples: 'A fruit filling, custard, seeds, or a finishing glaze.',
          },
        ],
      },
      {
        id: 'composition',
        eyebrow: '03 / FUNCTION',
        title: 'Functional composition',
        intro: 'The workspace records the functional parts of an ingredient, not a complete nutrition label.',
        entries: [
          {
            title: 'Water, fat, protein, sugar, and starch',
            canonical: 'Composition fields',
            body: 'These fields describe which functional components are known for an ingredient and can support later formula metrics.',
            examples: 'Water in milk, fat in butter, starch in flour.',
          },
          {
            title: 'Known, none, and unknown',
            canonical: 'Value state',
            body: 'Known means a value has been supplied. None / absent means the field does not apply or is absent. Unknown means the field may apply, but the information has not been established.',
            note: 'Unknown is deliberately not converted into numeric zero.',
          },
          {
            title: 'Named ingredient → functional composition',
            canonical: 'Catalog mapping',
            body: 'A named starter ingredient can provide a versioned functional composition. A custom ingredient can remain explicit about what is not yet known.',
            examples: 'Selecting water supplies a starter composition; selecting Custom lets you define the ingredient yourself.',
          },
        ],
      },
      {
        id: 'calculation-semantics',
        eyebrow: '04 / EVIDENCE',
        title: 'How the result is described',
        intro: 'The result separates direct calculations from assumptions and rules so that a useful output does not pretend to be more certain than its inputs.',
        entries: [
          {
            title: 'Calculated',
            canonical: 'Directly derived',
            body: 'The value follows directly from supplied masses or declared data using a defined formula.',
            examples: 'Flour basis, flour shares, and baker’s percentages.',
          },
          {
            title: 'Estimated',
            canonical: 'Inferred value',
            body: 'The value is inferred from incomplete or indirect information and should be read as an estimate.',
            examples: 'A composition value supplied by a catalog range or an experimentally supported approximation.',
          },
          {
            title: 'Heuristic',
            canonical: 'Rule or index',
            body: 'The value comes from a useful rule, score, or model rather than a direct physical measurement.',
            examples: 'A structural tendency or similarity index.',
          },
        ],
      },
      {
        id: 'flour-basis',
        eyebrow: '05 / DENOMINATOR',
        title: 'Flour basis and baker’s percentages',
        intro: 'Baker’s percentages need a clear denominator. In this workspace, that denominator is the mass of flour-bearing structural components.',
        entries: [
          {
            title: 'Flour basis',
            canonical: 'Structural flour denominator',
            body: 'The sum of the masses of the flour components that are marked as flour-bearing. It is calculated from the formula, not guessed from the ingredient names.',
            examples: '700 g strong wheat flour + 300 g whole wheat flour = 1,000 g flour basis.',
          },
          {
            title: 'Baker’s percentage',
            canonical: 'Ingredient mass ÷ flour basis',
            body: 'The mass of an ingredient expressed as a percentage of the flour basis. This keeps formulas comparable even when their batch sizes differ.',
            examples: '700 g water ÷ 1,000 g flour basis = 70%.',
          },
        ],
      },
      {
        id: 'similarity-boundary',
        eyebrow: '06 / FUTURE MODEL',
        title: 'Similarity has two dimensions',
        intro: 'A formula can resemble another formula while using a different process. The product should keep those two kinds of similarity separate.',
        entries: [
          {
            title: 'Composition similarity',
            canonical: 'FormulaSimilarity',
            body: 'How close the ingredients, masses, ratios, and functional composition are.',
            examples: 'Two doughs with similar flour, water, fat, and sugar ratios.',
          },
          {
            title: 'Process similarity',
            canonical: 'ProcessSimilarity',
            body: 'How close the methods and conditions are: mixing, fermentation, temperature, resting, shaping, and baking.',
            examples: 'Two formulas may be compositionally close but process-wise very different.',
          },
        ],
      },
    ],
  },
  el: {
    eyebrow: 'ΟΡΟΛΟΓΙΑ & ΥΠΟΛΟΓΙΣΜΟΙ',
    title: 'Μια κοινή γλώσσα για να διαβάζεις μια φόρμουλα.',
    intro: 'Αυτή η σελίδα εξηγεί τους όρους του χώρου εργασίας και γιατί κάθε διάκριση έχει σημασία όταν αναλύουμε μια ζύμη ή ένα batter.',
    backToWorkspace: 'Πίσω στον χώρο εργασίας',
    contentsTitle: 'Σε αυτή τη σελίδα',
    exampleLabel: 'Παραδείγματα',
    noteLabel: 'Γιατί έχει σημασία',
    sections: [
      {
        id: 'formula-and-process',
        eyebrow: '01 / ΠΕΔΙΟ',
        title: 'Η φόρμουλα δεν είναι η διαδικασία',
        intro: 'Ο τωρινός χώρος εργασίας περιγράφει τι μπαίνει στο μείγμα. Δεν περιγράφει ακόμη πώς δουλεύεται το μείγμα.',
        entries: [
          {
            title: 'Φόρμουλα',
            canonical: 'Composition',
            body: 'Τα υλικά, οι μάζες τους, η βάση αλεύρου, η λειτουργική σύσταση και οι δηλωμένοι ρόλοι τους.',
            examples: '700 g άλευρο, 700 g νερό, 10 g αλάτι.',
          },
          {
            title: 'Διαδικασία',
            canonical: 'Process / Method',
            body: 'Οι ενέργειες και οι συνθήκες που μετασχηματίζουν τη φόρμουλα: ανάμειξη, ζύμωμα, ωρίμαση, ξεκούραση, φυλλοποίηση και ψήσιμο.',
            examples: '10 λεπτά ζύμωμα, ωρίμαση στους 24 °C, ψυχρή παραμονή όλη τη νύχτα.',
            note: 'Δύο ίδιες φόρμουλες μπορούν να συμπεριφερθούν διαφορετικά όταν αλλάζει η διαδικασία.',
          },
        ],
      },
      {
        id: 'formula-roles',
        eyebrow: '02 / ΣΥΜΜΕΤΟΧΗ',
        title: 'Οι ρόλοι μέσα στη φόρμουλα',
        intro: 'Ο ρόλος περιγράφει πώς συμμετέχει ένα υλικό στη φόρμουλα. Δεν είναι κατηγορία του τελικού προϊόντος.',
        entries: [
          {
            title: 'Κύρια μάζα ζύμης',
            canonical: 'Continuous phase / Συνεχής φάση',
            body: 'Το υλικό ενσωματώνεται στη συνεχή μάζα της ζύμης ή του batter και λειτουργεί ως μέρος του μέσου που περιέχει τα υπόλοιπα συστατικά.',
            examples: 'Νερό, γάλα, γιαούρτι, πουρές ή μέλι όταν αναμειγνύονται μέσα στη φόρμουλα.',
          },
          {
            title: 'Συστατικό δομής',
            canonical: 'Structural',
            body: 'Το υλικό συμβάλλει στο σώμα, στο στήσιμο ή στη φυσική δομή του ψημένου αποτελέσματος. Ένα δομικό συστατικό δεν ανήκει αυτόματα στη βάση αλεύρου.',
            examples: 'Άλευρο, άμυλο, κακάο, γάλα σε σκόνη ή δομικές πρωτεΐνες.',
            note: 'Μόνο τα δομικά συστατικά που είναι αλευρούχα συμμετέχουν στον παρονομαστή της βάσης αλεύρου.',
          },
          {
            title: 'Ένθετο / ανακάτεμα',
            canonical: 'Inclusion',
            body: 'Το υλικό παραμένει ως ξεχωριστό κομμάτι ή σώμα μέσα στη ζύμη, αντί να γίνει μέρος της συνεχούς φάσης.',
            examples: 'Ξηροί καρποί, σταφίδες, κομμάτια σοκολάτας, ελιές ή κύβοι τυριού.',
            note: 'Το νερό ή το λίπος ενός ένθετου δεν θεωρείται αυτόματα πλήρως διαθέσιμο στη ζύμη κατά την ανάμειξη.',
          },
          {
            title: 'Επιφανειακή εφαρμογή',
            canonical: 'Surface treatment',
            body: 'Ένα υλικό που εφαρμόζεται εξωτερικά πριν ή μετά το ψήσιμο.',
            examples: 'Άλειμμα αυγού, γλάσο ή επάλειψη λίπους.',
          },
          {
            title: 'Γέμιση ή επικάλυψη',
            canonical: 'Filling / Topping',
            body: 'Ένα υλικό που παραμένει ξεχωριστό ως στρώση ή τμήμα στο εσωτερικό ή στην κορυφή του ψημένου προϊόντος.',
            examples: 'Γέμιση φρούτων, κρέμα, σπόροι ή τελικό γλάσο.',
          },
        ],
      },
      {
        id: 'composition',
        eyebrow: '03 / ΛΕΙΤΟΥΡΓΙΑ',
        title: 'Λειτουργική σύσταση',
        intro: 'Ο χώρος εργασίας καταγράφει τα λειτουργικά μέρη ενός υλικού, όχι έναν πλήρη διατροφικό πίνακα.',
        entries: [
          {
            title: 'Νερό, λίπος, πρωτεΐνη, ζάχαρη και άμυλο',
            canonical: 'Composition fields',
            body: 'Τα πεδία δείχνουν ποια λειτουργικά συστατικά είναι γνωστά για ένα υλικό και μπορούν να τροφοδοτήσουν μεταγενέστερους δείκτες της φόρμουλας.',
            examples: 'Νερό στο γάλα, λίπος στο βούτυρο, άμυλο στο άλευρο.',
          },
          {
            title: 'Γνωστό, δεν εφαρμόζεται και άγνωστο',
            canonical: 'Value state',
            body: 'Γνωστό σημαίνει ότι έχει δοθεί τιμή. Δεν εφαρμόζεται / απουσιάζει σημαίνει ότι το πεδίο δεν αφορά το υλικό ή απουσιάζει. Άγνωστο σημαίνει ότι μπορεί να αφορά το υλικό, αλλά δεν έχει τεκμηριωθεί.',
            note: 'Το Άγνωστο σκόπιμα δεν μετατρέπεται σε αριθμητικό μηδέν.',
          },
          {
            title: 'Named ingredient → functional composition',
            canonical: 'Catalog mapping',
            body: 'Ένα ονομασμένο βασικό υλικό μπορεί να φέρει μια εκδοχή λειτουργικής σύστασης από τον κατάλογο. Ένα προσαρμοσμένο υλικό μπορεί να κρατήσει ρητά όσα δεν γνωρίζουμε ακόμη.',
            examples: 'Η επιλογή «Νερό» φέρνει μια βασική σύσταση· η επιλογή «Προσαρμοσμένο» αφήνει τον ορισμό σε εσένα.',
          },
        ],
      },
      {
        id: 'calculation-semantics',
        eyebrow: '04 / ΤΕΚΜΗΡΙΩΣΗ',
        title: 'Πώς περιγράφεται το αποτέλεσμα',
        intro: 'Το αποτέλεσμα ξεχωρίζει τους άμεσους υπολογισμούς από τις παραδοχές και τους κανόνες, ώστε να μην παρουσιάζει μεγαλύτερη βεβαιότητα από αυτή που επιτρέπουν τα δεδομένα.',
        entries: [
          {
            title: 'Calculated',
            canonical: 'Υπολογισμένο',
            body: 'Η τιμή προκύπτει απευθείας από τις μάζες ή τα δηλωμένα δεδομένα, με έναν καθορισμένο τύπο.',
            examples: 'Βάση αλεύρου, ποσοστά αλεύρων και ποσοστά αρτοποιού.',
          },
          {
            title: 'Estimated',
            canonical: 'Εκτιμώμενο',
            body: 'Η τιμή συνάγεται από ελλιπή ή έμμεσα δεδομένα και πρέπει να διαβάζεται ως εκτίμηση.',
            examples: 'Μια τιμή σύστασης από εύρος καταλόγου ή μια προσέγγιση που στηρίζεται σε πειραματικά δεδομένα.',
          },
          {
            title: 'Heuristic',
            canonical: 'Ευρετικό',
            body: 'Η τιμή προκύπτει από χρήσιμο κανόνα, score ή μοντέλο και όχι από άμεση φυσική μέτρηση.',
            examples: 'Ένας δείκτης δομικής τάσης ή ομοιότητας.',
          },
        ],
      },
      {
        id: 'flour-basis',
        eyebrow: '05 / ΠΑΡΟΝΟΜΑΣΤΗΣ',
        title: 'Βάση αλεύρου και ποσοστά αρτοποιού',
        intro: 'Τα ποσοστά αρτοποιού χρειάζονται καθαρό παρονομαστή. Εδώ ο παρονομαστής είναι η μάζα των αλευρούχων δομικών συστατικών.',
        entries: [
          {
            title: 'Βάση αλεύρου',
            canonical: 'Structural flour denominator',
            body: 'Το άθροισμα των μαζών των συστατικών που είναι δηλωμένα ως αλευρούχα. Υπολογίζεται από τη φόρμουλα και δεν μαντεύεται από τα ονόματα των υλικών.',
            examples: '700 g δυνατό άλευρο σίτου + 300 g άλευρο ολικής = 1.000 g βάση αλεύρου.',
          },
          {
            title: 'Ποσοστό αρτοποιού',
            canonical: 'Μάζα υλικού ÷ βάση αλεύρου',
            body: 'Η μάζα ενός υλικού εκφρασμένη ως ποσοστό της βάσης αλεύρου. Έτσι συγκρίνουμε φόρμουλες διαφορετικού μεγέθους.',
            examples: '700 g νερό ÷ 1.000 g βάση αλεύρου = 70%.',
          },
        ],
      },
      {
        id: 'similarity-boundary',
        eyebrow: '06 / ΜΕΛΛΟΝΤΙΚΟ ΜΟΝΤΕΛΟ',
        title: 'Η ομοιότητα έχει δύο διαστάσεις',
        intro: 'Μια φόρμουλα μπορεί να μοιάζει με μια άλλη, ενώ η διαδικασία της να είναι διαφορετική. Το προϊόν πρέπει να κρατά αυτές τις δύο ομοιότητες ξεχωριστές.',
        entries: [
          {
            title: 'Ομοιότητα σύστασης',
            canonical: 'FormulaSimilarity',
            body: 'Πόσο κοντά είναι τα υλικά, οι μάζες, οι αναλογίες και η λειτουργική σύσταση.',
            examples: 'Δύο ζύμες με παρόμοια ποσοστά αλεύρου, νερού, λίπους και ζάχαρης.',
          },
          {
            title: 'Ομοιότητα διαδικασίας',
            canonical: 'ProcessSimilarity',
            body: 'Πόσο κοντά είναι οι μέθοδοι και οι συνθήκες: ανάμειξη, ωρίμαση, θερμοκρασία, ξεκούραση, shaping και ψήσιμο.',
            examples: 'Δύο φόρμουλες μπορεί να μοιάζουν στη σύσταση, αλλά να διαφέρουν πολύ στη διαδικασία.',
          },
        ],
      },
    ],
  },
};
