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
        intro: 'The workspace records what goes into the mixture and, separately, how the mixture is handled.',
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
          {
            title: 'Ingredient addition timeline',
            canonical: 'AdditionStep',
            body: 'The Ingredient addition section records when each Formula line enters the process. A step is an ordered point in the method, not a new ingredient. Sequence records order, Action records what happens, Duration records optional time, and Formula lines link the existing ingredient lines handled at that step.',
            examples: 'Step 1: add water. Step 2: mix in salt. Step 3: incorporate butter.',
            note: 'Selecting a Formula line links it to the step; it does not add its mass a second time. An empty timeline means that no addition order has been recorded, not that nothing was added.',
          },
          {
            title: 'Process input controls',
            canonical: 'process-input-v0.2',
            body: 'A Process field is either a controlled option, a number with a unit, or a reference to a Formula line. The normalized Process receives a canonical ID, numeric value, or stable reference—not an arbitrary sentence.',
            examples: 'Preferment → Poolish. Bulk fermentation rise → 50% increase. Fat state → Plastic. Bulk fermentation temperature → 24 °C.',
            note: 'Other is retained as explicitly unclassified. Leave a field at Not recorded yet when no supported value is known.',
          },
          {
            title: 'Expansion targets',
            canonical: 'BulkExpansionTarget / FinalExpansionTarget',
            body: 'An expansion target describes how much the dough should increase relative to its starting volume. The bulk target refers to the first fermentation while the dough is still one mass; the final target refers to the final proof after shaping. The current controlled choices are 30% increase, 50% increase, and double (100% increase). It is a target rise, not a time or temperature value.',
            examples: 'Bulk fermentation rise target → 50% increase; final proof rise target → Double.',
          },
          {
            title: 'The remaining categorical values',
            canonical: 'Controlled Process vocabulary',
            body: 'Development target uses Minimal, Partial, or Full. Foam target uses Low, Medium, or High. Post-aeration handling uses Gentle folding, Moderate folding, or Vigorous mixing. Preferment uses Direct, Poolish, Biga, or Levain. Fat and dough state, surface/volume class, surface treatment, and container use the corresponding controlled options shown in the editor.',
            examples: 'Fat state → Plastic. Dough state → Stiff dough. Surface / volume → High. Container → Loaf tin.',
            note: 'If a technique is not represented, choose Other only when you want to record an explicit unclassified category; otherwise leave it Not recorded yet.',
          },
          {
            title: 'Fold pattern and lamination fat',
            canonical: 'FoldSequence / laminationFat',
            body: 'Fold pattern is selected as Single fold or Double fold (or Other). Lamination fat is not typed as a name: it points to one of the Formula ingredient lines, so the model can resolve the exact ingredient identity.',
            examples: 'Fold pattern → Double fold; lamination fat line → Butter · 250 g.',
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
            title: 'Known value, not applicable, and no known value',
            canonical: 'Value state',
            body: 'These states describe the field, not who typed it. Known value means an accepted source provides a value. Not applicable / absent means the field does not apply or is absent. No known value means the field may apply, but no accepted value is available.',
            note: 'No known value is deliberately not converted into numeric zero.',
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
        id: 'data-quality',
        eyebrow: '04 / DATA QUALITY',
        title: 'Source, confidence, and availability',
        intro: 'These labels describe the quality and interpretation of the data. They are not predictions and they do not change the shared catalog.',
        entries: [
          {
            title: 'Composition data source',
            canonical: 'Provenance',
            body: 'This tells you where the functional composition came from: the versioned starter catalog or a local custom definition. A catalog choice is read-only; a custom definition belongs only to this formula line.',
            examples: 'Starter catalog · starter-catalog-v1, or Local custom definition.',
          },
          {
            title: 'Composition data confidence',
            canonical: 'Confidence',
            body: 'A number from 0 to 1 describing how strongly the available evidence supports the composition data for this ingredient. It is not the percentage of water, fat, or protein, and it is not a similarity score.',
            examples: '1.00 means the current source is treated as fully supported for this input; 0.60 means the source is only partly trusted.',
          },
          {
            title: 'Effective contribution to the dough',
            canonical: 'AvailabilityOverride / Functional availability',
            body: 'A formula-line-local coefficient from 0 to 1 describing how much of an ingredient’s water, fat, or other functional component is treated as effectively participating in the dough at the relevant stage. It is not about whether you have the ingredient in the kitchen, and it is different from whether the underlying data is known.',
            examples: 'If an ingredient contains 20 g of water but the model treats only 50% as available during mixing, its effective water contribution is 10 g.',
            note: 'In the current input layer this records the assumption; effective-water and effective-fat calculations will use it when those model rules are enabled.',
          },
          {
            title: 'Recorded, not applicable, and not recorded',
            canonical: 'Known / None / Unknown',
            body: 'These are information statuses, not the field values themselves. Process fields expose the actual control directly: a selected option or entered number becomes Known. Leaving it blank means Not recorded. Not applicable / absent records an explicit absence. Not recorded is never silently changed into zero.',
            examples: 'Mixing method → Machine knead. Mixing intensity → 0.60. Bulk fermentation time → Not recorded.',
          },
        ],
      },
      {
        id: 'calculation-semantics',
        eyebrow: '05 / EVIDENCE',
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
        eyebrow: '06 / DENOMINATOR',
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
        eyebrow: '07 / FUTURE MODEL',
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
        intro: 'Ο χώρος εργασίας καταγράφει τι μπαίνει στο μείγμα και, ξεχωριστά, πώς δουλεύεται το μείγμα.',
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
          {
            title: 'Χρονολόγιο προσθήκης υλικών',
            canonical: 'AdditionStep / Βήμα προσθήκης',
            body: 'Η καρτέλα «Προσθήκη υλικών» καταγράφει πότε μπαίνει κάθε γραμμή της φόρμουλας στη διαδικασία. Το βήμα είναι ένα σημείο με σειρά μέσα στη μέθοδο, όχι νέο υλικό. Η σειρά καταγράφει τη διαδοχή, η ενέργεια τι γίνεται, η διάρκεια τον προαιρετικό χρόνο και οι γραμμές φόρμουλας συνδέουν τα ήδη υπάρχοντα υλικά που δουλεύονται σε αυτό το βήμα.',
            examples: 'Βήμα 1: προσθήκη νερού. Βήμα 2: ανάμειξη αλατιού. Βήμα 3: ενσωμάτωση βουτύρου.',
            note: 'Η επιλογή γραμμής φόρμουλας τη συνδέει με το βήμα· δεν προσθέτει τη μάζα της δεύτερη φορά. Άδειο χρονολόγιο σημαίνει ότι δεν καταγράφηκε σειρά προσθηκών, όχι ότι δεν προστέθηκε τίποτα.',
          },
          {
            title: 'Πεδία εισόδου διαδικασίας',
            canonical: 'process-input-v0.2',
            body: 'Κάθε πεδίο διαδικασίας είναι είτε ελεγχόμενη επιλογή, είτε αριθμός με μονάδα, είτε αναφορά σε γραμμή της φόρμουλας. Η κανονικοποιημένη διαδικασία παίρνει κωδικό, αριθμητική τιμή ή σταθερή αναφορά — όχι αυθαίρετη πρόταση.',
            examples: 'Τύπος προζυμιού → Poolish. Αύξηση κύριας ζύμωσης → 50%. Κατάσταση λίπους → Πλαστικό. Θερμοκρασία κύριας ζύμωσης → 24 °C.',
            note: 'Το «Άλλο» κρατιέται ως ρητά μη ταξινομημένο. Αν δεν γνωρίζεις υποστηριζόμενη τιμή, άφησε «Δεν έχει καταγραφεί ακόμη».',
          },
          {
            title: 'Στόχοι αύξησης',
            canonical: 'BulkExpansionTarget / FinalExpansionTarget',
            body: 'Ο στόχος αύξησης περιγράφει πόσο πρέπει να αυξηθεί ο όγκος σε σχέση με την αρχική κατάσταση. Ο στόχος της κύριας ζύμωσης αφορά την πρώτη ζύμωση, όταν η ζύμη είναι ακόμη μία μάζα· ο τελικός στόχος αφορά την τελική ωρίμαση μετά το σχημάτισμα. Οι τρέχουσες επιλογές είναι αύξηση 30%, αύξηση 50% και διπλασιασμός (αύξηση 100%). Είναι στόχος όγκου, όχι χρόνος ή θερμοκρασία.',
            examples: 'Στόχος αύξησης κύριας ζύμωσης → Αύξηση 50%· στόχος αύξησης τελικής ωρίμασης → Διπλασιασμός.',
          },
          {
            title: 'Οι υπόλοιπες κατηγορικές τιμές',
            canonical: 'Controlled Process vocabulary',
            body: 'Ο στόχος ανάπτυξης έχει Ελάχιστη, Μερική ή Πλήρη ανάπτυξη. Ο στόχος αφρισμού έχει Χαμηλό, Μεσαίο ή Υψηλό. Ο χειρισμός μετά τον αφρισμό έχει Απαλό δίπλωμα, Μέτριο δίπλωμα ή Έντονη ανάμειξη. Ο τύπος προζυμιού έχει Άμεση ζύμη, Poolish, Biga ή Levain. Η κατάσταση λίπους/ζύμης, η επιφάνεια/όγκος, η επιφανειακή εφαρμογή και το σκεύος χρησιμοποιούν τις αντίστοιχες ελεγχόμενες επιλογές του editor.',
            examples: 'Κατάσταση λίπους → Πλαστικό. Κατάσταση ζύμης → Σφιχτή ζύμη. Επιφάνεια / όγκος → Υψηλό. Σκεύος → Φόρμα ψωμιού.',
            note: 'Αν μια τεχνική δεν αναπαρίσταται, διάλεξε «Άλλο» μόνο για να κρατήσεις ρητά μια μη ταξινομημένη κατηγορία· διαφορετικά άφησέ την «Δεν έχει καταγραφεί ακόμη».',
          },
          {
            title: 'Μοτίβο διπλώματος και λίπος φυλλοποίησης',
            canonical: 'FoldSequence / laminationFat',
            body: 'Το μοτίβο διπλώματος επιλέγεται ως μονό ή διπλό δίπλωμα (ή Άλλο). Το λίπος φυλλοποίησης δεν πληκτρολογείται ως όνομα: συνδέεται με μία γραμμή υλικού της φόρμουλας, ώστε το μοντέλο να βρίσκει την ακριβή ταυτότητα του υλικού.',
            examples: 'Μοτίβο διπλώματος → Διπλό δίπλωμα· γραμμή λίπους φυλλοποίησης → Βούτυρο · 250 g.',
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
            title: 'Υπάρχει γνωστή τιμή, δεν εφαρμόζεται και δεν υπάρχει γνωστή τιμή',
            canonical: 'Value state',
            body: 'Αυτές είναι καταστάσεις της πληροφορίας, όχι το ποιος πληκτρολόγησε την τιμή. «Υπάρχει γνωστή τιμή» σημαίνει ότι αποδεκτή πηγή παρέχει τιμή. «Δεν εφαρμόζεται / Απουσιάζει» σημαίνει ότι το πεδίο δεν αφορά το υλικό ή απουσιάζει. «Δεν υπάρχει γνωστή τιμή» σημαίνει ότι μπορεί να αφορά το υλικό, αλλά δεν υπάρχει αποδεκτή τιμή.',
            note: 'Το «Δεν υπάρχει γνωστή τιμή» σκόπιμα δεν μετατρέπεται σε αριθμητικό μηδέν.',
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
        id: 'data-quality',
        eyebrow: '04 / ΠΟΙΟΤΗΤΑ ΔΕΔΟΜΕΝΩΝ',
        title: 'Πηγή, βεβαιότητα και διαθεσιμότητα',
        intro: 'Αυτές οι ενδείξεις περιγράφουν την ποιότητα και τον τρόπο ερμηνείας των δεδομένων. Δεν είναι προβλέψεις και δεν αλλάζουν τον κοινό κατάλογο.',
        entries: [
          {
            title: 'Πηγή δεδομένων σύστασης',
            canonical: 'Provenance / Προέλευση',
            body: 'Δείχνει από πού προήλθε η λειτουργική σύσταση: από τον εκδομένο αρχικό κατάλογο ή από έναν τοπικό προσαρμοσμένο ορισμό. Η επιλογή καταλόγου είναι μόνο για ανάγνωση· ο προσαρμοσμένος ορισμός ανήκει μόνο στη συγκεκριμένη γραμμή της φόρμουλας.',
            examples: 'Αρχικός κατάλογος · starter-catalog-v1 ή Τοπικός προσαρμοσμένος ορισμός.',
          },
          {
            title: 'Βεβαιότητα σύστασης',
            canonical: 'Confidence / Βεβαιότητα',
            body: 'Αριθμός από 0 έως 1 που δείχνει πόσο ισχυρά υποστηρίζουν τα διαθέσιμα στοιχεία τη σύσταση του συγκεκριμένου υλικού. Δεν είναι το ποσοστό νερού, λίπους ή πρωτεΐνης και δεν είναι score ομοιότητας.',
            examples: '1,00 σημαίνει ότι η τρέχουσα πηγή θεωρείται πλήρως υποστηριγμένη για αυτή την είσοδο· 0,60 σημαίνει μερική εμπιστοσύνη στην πηγή.',
          },
          {
            title: 'Αποτελεσματική συμμετοχή στη ζύμη',
            canonical: 'AvailabilityOverride / Λειτουργική διαθεσιμότητα',
            body: 'Συντελεστής από 0 έως 1, τοπικός στη γραμμή της φόρμουλας, που περιγράφει πόσο από το νερό, το λίπος ή άλλο λειτουργικό μέρος ενός υλικού θεωρείται ότι συμμετέχει αποτελεσματικά στη ζύμη στο σχετικό στάδιο. Δεν αφορά το αν έχεις το υλικό στην κουζίνα και είναι διαφορετικός από το αν γνωρίζουμε τα δεδομένα.',
            examples: 'Αν ένα υλικό περιέχει 20 g νερό αλλά το μοντέλο θεωρεί διαθέσιμο το 50% κατά την ανάμειξη, η αποτελεσματική συμβολή του σε νερό είναι 10 g.',
            note: 'Στην τωρινή είσοδο καταγράφουμε την παραδοχή· οι υπολογισμοί αποτελεσματικού νερού και λίπους θα τη χρησιμοποιήσουν όταν ενεργοποιηθούν οι αντίστοιχοι κανόνες του μοντέλου.',
          },
          {
            title: 'Καταγεγραμμένο, δεν εφαρμόζεται και δεν έχει καταγραφεί',
            canonical: 'Known / None / Unknown',
            body: 'Αυτές είναι καταστάσεις της πληροφορίας, όχι οι ίδιες οι τιμές των πεδίων. Στα πεδία της διαδικασίας εμφανίζεται απευθείας το πραγματικό control: μια επιλογή ή ένας αριθμός γίνεται Known. Αν μείνει κενό, σημαίνει «Δεν έχει καταγραφεί». «Δεν εφαρμόζεται / Απουσιάζει» καταγράφει ρητή απουσία. Το «Δεν έχει καταγραφεί» δεν μετατρέπεται ποτέ σιωπηρά σε μηδέν.',
            examples: 'Μέθοδος ανάμειξης → Μηχανικό ζύμωμα. Ένταση ανάμειξης → 0,60. Χρόνος κύριας ζύμωσης → Δεν έχει καταγραφεί.',
          },
        ],
      },
      {
        id: 'calculation-semantics',
        eyebrow: '05 / ΤΕΚΜΗΡΙΩΣΗ',
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
        eyebrow: '06 / ΠΑΡΟΝΟΜΑΣΤΗΣ',
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
        eyebrow: '07 / ΜΕΛΛΟΝΤΙΚΟ ΜΟΝΤΕΛΟ',
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
