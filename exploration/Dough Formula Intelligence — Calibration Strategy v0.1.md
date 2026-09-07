# Dough Formula Intelligence
## Calibration Strategy v0.1

## 1. Objective

Στόχος του calibration layer είναι να αποτρέψει δύο βασικά λάθη:

1. να παρουσιάσει heuristic εκτιμήσεις σαν ακριβή food-science μοντέλα,
2. να βάλει αυθαίρετα thresholds μόνο και μόνο για να «δουλεύει» ο classifier.

Η V1 πρέπει να είναι χρήσιμη αλλά να γνωρίζει σαφώς τα όριά της.

---

# 2. Τρεις κατηγορίες metrics

Κάθε metric πρέπει υποχρεωτικά να ανήκει σε μία από τις παρακάτω κατηγορίες.

## A. Deterministic / Calculated

Μπορεί να υπολογιστεί απευθείας από γνωστή σύνθεση.

## B. Model-estimated

Έχει φυσική σημασία, αλλά απαιτεί assumptions ή empirical coefficients.

## C. Heuristic / Classification score

Δεν είναι φυσική ποσότητα. Υπάρχει αποκλειστικά για prediction/classification.

---

# 3. V1 — Deterministic metrics

Αυτά μπορούν να υλοποιηθούν αμέσως.

### Baker's percentages

\[
BP_i=\frac{m_i}{F}\times100
\]

### Total ingredient water

\[
W_T=\frac{\sum_i m_iw_i}{F}\times100
\]

### Total fat

\[
Fat_T=\frac{\sum_i m_if_i}{F}\times100
\]

### Fat by source/state

- liquid fat
- plastic fat
- solid fat

όπου η φυσική κατάσταση είναι γνωστή.

### Sugar subclasses

- sucrose
- glucose
- fructose
- lactose
- maltose

### Total sugars

\[
Sugar_T=\sum Sugar_j
\]

### Protein subclasses

- gluten-forming estimate
- egg protein
- dairy protein
- other protein

### Starch

### Fiber

### Salt

### Egg mass / solids

### Dairy solids

### Flour blend fractions

### Flour protein

Όπου είναι γνωστό.

### Known W / P-L / ash

Αποθηκεύονται αυτούσια, όχι inferred σαν βεβαιότητες.

---

# 4. Deterministic metrics δεν χρειάζονται calibration

Δεν πρέπει το dataset να αλλάζει το ότι:

100 g butter 82% fat

συνεισφέρουν:

\[
82g\ fat
\]

εφόσον το composition profile είναι αυτό.

Το calibration επηρεάζει interpretation, όχι arithmetic.

---

# 5. V1 — Model-estimated metrics

Αυτά μπορούν να υπάρχουν, αλλά πρέπει να εμφανίζονται ως estimated.

### Effective hydration

Δεν θα θεωρείται απλώς total water.

\[
H_E=f(
TotalWater,
Sugar,
Protein,
Fiber,
Salt,
IngredientAvailability
)
\]

Αλλά V1 δεν πρέπει να ισχυρίζεται εργαστηριακή ακρίβεια.

---

# 6. Flour absorption estimate

Θα βασίζεται αρχικά σε:

- protein,
- fiber,
- wholegrain fraction,
- grain type,
- damaged starch μόνο αν είναι γνωστό.

Output:

όχι:

> absorption = 68.37%

αλλά καλύτερα:

> estimated absorption range: 63–69%

ή normalized score.

---

# 7. Relative hydration

\[
RH=
\frac{EffectiveHydration}
{EstimatedFlourAbsorption}
\]

θα είναι **estimated metric**.

Το UI πρέπει να μπορεί να δείξει:

> Relative hydration: High
> Confidence: Moderate

αν τα flour properties είναι ελλιπή.

---

# 8. Acid-neutralization balance

Μπορεί να είναι calculated μόνο όταν έχουμε πραγματικά acid-neutralization data.

Αν έχουμε μόνο:

- yogurt type,
- estimated pH,

δεν πρέπει να παράγεται ακριβής:

> χρειάζονται 2.73 g soda.

V1 μπορεί να δίνει:

- acid present
- likely adequate
- likely bicarbonate excess
- uncertain.

---

# 9. Sweetness equivalent

Μπορεί να υπολογίζεται από relative sweetness factors.

Αλλά επειδή η perceived sweetness επηρεάζεται και από matrix, temperature κ.λπ., πρέπει να θεωρείται:

\[
\text{sensory estimate}
\]

και όχι αντικειμενικό sweetness measurement.

---

# 10. Fermentable sugar load

Μπορεί να υπολογιστεί αρκετά καλά ως chemical substrate availability.

Αλλά δεν πρέπει να μεταφράζεται αυτόματα σε ακριβή fermentation speed.

\[
FermentableSugar
\neq
FermentationRate
\]

---

# 11. V1 heuristic metrics

Αυτά μπορούν να υπάρχουν από την πρώτη έκδοση, αλλά πρέπει να αναφέρονται ρητά ως model scores.

### Gluten Potential Index

\[
GPI\in[0,100]
\]

### Effective Gluten Index

\[
EGI\in[0,100]
\]

### Enrichment Index

\[
EI\in[0,100]
\]

### Tenderness Index

\[
TI\in[0,100]
\]

### Fluidity Index

\[
FI\in[0,100]
\]

### Gas Retention Capacity

\[
GRC\in[0,100]
\]

### Setting Capacity

\[
SC\in[0,100]
\]

### Fermentation Difficulty

### Spread Tendency

### Browning Potential

Τα τελευταία μπορούν να είναι lower-confidence V1 outputs.

---

# 12. Τι δεν πρέπει να υλοποιηθεί ως σοβαρό prediction πριν dataset

V1 δεν πρέπει να προσπαθήσει να προβλέψει αριθμητικά:

- loaf volume
- crumb-cell diameter
- exact oven spring
- exact spread diameter
- exact proof time
- exact fermentation rate
- exact dough viscosity
- exact water activity
- exact staling half-life
- precise final moisture
- precise crust color.

Μπορεί μόνο να δώσει τάσεις:

> higher / lower / risk / likely.

---

# 13. Initial heuristic design principle

Τα heuristic metrics πρέπει να είναι **monotonic όπου υπάρχει ισχυρή γνωστή σχέση**, εκτός αν ξέρουμε ότι η σχέση είναι non-monotonic.

Παράδειγμα:

μέσα σε λογικό εύρος:

\[
Fat \uparrow
\Rightarrow
TenderizingLoad \uparrow
\]

Αλλά:

\[
Mixing \uparrow
\]

δεν πρέπει να δίνει πάντα:

\[
EffectiveGluten \uparrow
\]

επειδή υπάρχει overmixing.

---

# 14. Initial GPI strategy

Για V1, το GPI πρέπει να βασίζεται κυρίως σε:

1. gluten-forming protein estimate
2. flour W if known
3. grain composition
4. hydration adequacy

Conceptually:

\[
GPI=
w_1ProteinScore+
w_2WScore+
w_3GrainScore+
w_4HydrationCompatibility
\]

με normalized weights.

Δεν θα χρησιμοποιηθεί ακόμη ML.

---

# 15. Missing W/P-L

Αν W και P/L λείπουν:

- χρησιμοποιούμε protein/grain-based estimate,
- μειώνουμε confidence.

Δεν πρέπει να προσπαθήσουμε να infer ακριβές W μόνο από protein %.

---

# 16. Effective Gluten Index strategy

Το EGI ξεκινά από GPI και εφαρμόζει modifiers:

\[
EGI=
f(
GPI,
Mixing,
Hydration,
Rest,
FatLoad,
FatMode,
SugarLoad,
Acidity
)
\]

V1 modifiers μπορούν να είναι expert-defined smooth curves.

Δεν πρέπει να είναι arbitrary step rules.

---

# 17. Enrichment Index strategy

Το EI είναι το πιο ασφαλές heuristic score.

Inputs:

- fat
- sugar
- egg solids
- dairy solids

Θα μπορούσε αρχικά να είναι weighted normalized combination.

Όμως πρέπει να έχει diminishing returns ώστε:

\[
EI(200\%\ fat)
\]

να μην είναι απλώς διπλάσιο από:

\[
EI(100\%\ fat)
\]

Το score έχει upper saturation.

---

# 18. Tenderness Index strategy

Δεν πρέπει να είναι:

\[
TI = Fat + Sugar
\]

Πρέπει να σχετίζεται με structural competition:

\[
TI=
f(
TenderizingLoad,
EffectiveGluten,
EggProtein,
Starch,
Water
)
\]

Δηλαδή tenderness είναι **relative αποτέλεσμα**, όχι απλή ποσότητα tenderizers.

---

# 19. Fluidity Index strategy

Από τα heuristics, αυτό είναι σημαντικό για classifier.

Initial dominant factors:

Positive:

- effective water
- liquid fat
- dissolved sugars

Negative:

- flour absorption
- starch
- fiber
- protein structure

Process modifier:

- temperature
- resting
- fat state.

---

# 20. Leavening V1

Τα τέσσερα leavening components πρέπει να υπολογίζονται ανεξάρτητα:

\[
G_y
\]

\[
G_c
\]

\[
G_m
\]

\[
G_s
\]

Δεν θα επιχειρήσουμε ακόμη να μετατρέψουμε:

\[
G_y+G_c+G_m+G_s
\]

σε ακριβή λίτρα CO₂.

Θα είναι normalized potentials.

---

# 21. Yeast potential calibration

V1 μπορεί να χρησιμοποιεί:

- yeast baker %
- fermentation time
- temperature band
- sugar osmotic load
- salt
- enrichment

για qualitative score.

Δεν πρέπει να προβλέπει:

> doubling time = 73 minutes

χωρίς πραγματικό kinetic model.

---

# 22. Chemical leavening calibration

Το chemical score είναι πιο υπολογίσιμο όταν:

- baking powder composition είναι γνωστή,
- soda + acid neutralization είναι γνωστά.

Αλλά generic supermarket baking powder έχει variability.

Άρα generic ingredients μειώνουν confidence.

---

# 23. Mechanical aeration calibration

Process-driven.

Inputs:

- creaming
- whole egg whipping
- egg white whipping
- whipped cream
- intensity
- foam handling.

Αρχικά categorical-to-score mapping.

Dataset αργότερα διορθώνει τα weights.

---

# 24. Steam potential

Initial approximation βασίζεται σε:

- available water
- geometry
- thermal process
- containment/structure.

Πρέπει να δίνεται κυρίως σαν:

- low
- medium
- high

και όχι pseudo-precise score αν δεν έχουμε αρκετά δεδομένα.

---

# 25. Prototype calibration — Phase 0

Πριν έχουμε dataset, χρησιμοποιούμε **expert seed prototypes**.

Για κάθε prototype ορίζουμε:

- qualitative target
- provisional center
- broad soft range
- feature importance
- identity-critical features.

Οι τιμές χαρακτηρίζονται:

```text
CalibrationStatus = ExpertSeed
```

---

# 26. Expert seed philosophy

Οι αρχικές numeric τιμές δεν πρέπει να μοιάζουν με επιστημονικές σταθερές.

Παράδειγμα:

όχι:

> brioche optimum fat = 48.3%

αλλά:

```text
fat:
  broad expected region: high–very high
  provisional core: ~40–60%
  confidence: provisional
```

---

# 27. Prototype calibration — Phase 1

Χρησιμοποιούμε Gold Dataset.

Για κάθε feature:

- median
- P10
- P25
- P75
- P90

και ελέγχουμε αν οι expert ranges είναι λογικοί.

---

# 28. Prototype calibration — Phase 2

Broad dataset.

Χρησιμοποιείται για:

- φυσική διακύμανση,
- overlap,
- noisy naming,
- edge cases.

Δεν επιτρέπεται το Broad dataset να καταστρέψει canonical definitions λόγω blog noise.

Άρα Gold data πρέπει να έχει μεγαλύτερο calibration weight.

---

# 29. Weighted distributions

Κάθε record έχει:

\[
Q_i
\]

quality weight.

Οι prototype distributions πρέπει να είναι weighted.

Π.χ. canonical professional formula μπορεί να έχει:

\[
Q=1
\]

ενώ low-confidence blog:

\[
Q=0.3
\]

---

# 30. Initial membership ranges

Μετά dataset calibration, default trapezoid μπορεί να είναι:

\[
a=P_{10}
\]

\[
b=P_{25}
\]

\[
c=P_{75}
\]

\[
d=P_{90}
\]

όμως μόνο αν η distribution είναι unimodal και λογική.

---

# 31. Multimodal categories

Αν μια κατηγορία έχει δύο distinct clusters, δεν πρέπει να βάλουμε τεράστιο trapezoid.

Παράδειγμα υποθετικά:

`Cookie`

μπορεί να χωρίζεται σε:

- high-fat short cookie
- high-sugar chewy cookie.

Τότε δημιουργούνται sub-prototypes.

---

# 32. Feature weights

Αρχικά:

- Critical
- High
- Medium
- Low

μετατρέπονται προσωρινά π.χ. σε ordinal weights.

Αργότερα calibration χρησιμοποιεί:

- effect size,
- mutual information,
- confusion reduction,
- ablation tests.

---

# 33. Weight calibration rule

Ένα feature δικαιούται υψηλό weight μόνο αν:

1. έχει domain rationale,
2. και βοηθά empirically classification.

Δεν αρκεί μόνο correlation.

---

# 34. Avoid double counting

Αν δύο metrics είναι έντονα συσχετισμένα:

π.χ.

\[
FatLoad
\]

και

\[
EnrichmentIndex
\]

δεν πρέπει και τα δύο να παίρνουν τεράστιο independent weight.

Αλλιώς το fat effect μετριέται διπλά.

---

# 35. Parent vs child weights

Family-level classifier πρέπει να χρησιμοποιεί πιο θεμελιώδεις dimensions:

- gluten
- fluidity
- fat
- leavening
- structural set.

Named-product classifier μπορεί να χρησιμοποιεί:

- fat source
- geometry
- surface process
- lamination
- cultural modifiers.

---

# 36. Calibration of interaction terms

Interaction term προστίθεται μόνο αν αποδειχθεί ότι το additive model αποτυγχάνει συστηματικά.

Παράδειγμα:

\[
Fat \times Hydration
\]

είναι πιθανό να χρειάζεται από νωρίς.

Αλλά δεν θα βάλουμε δεκάδες interactions προκαταβολικά.

---

# 37. Dataset-first metrics

Ορισμένα scores δεν θα τα βαθμονομήσουμε σοβαρά πριν δεδομένα.

### Gas Retention Capacity

Expert seed μόνο.

### Setting Capacity

Expert seed μόνο.

### Browning Potential

Qualitative only.

### Fermentation Difficulty

Qualitative only.

### Spread Tendency

Qualitative only.

Αυτά δεν πρέπει να χρησιμοποιούνται ως major V1 family classifiers.

---

# 38. V1 classification metrics

Για family classification τα high-confidence dimensions πρέπει να είναι κυρίως:

1. effective/relative hydration
2. fat
3. sugar
4. egg
5. gluten potential
6. effective gluten
7. enrichment
8. fluidity
9. yeast presence/process
10. chemical leavening
11. mechanical foam
12. lamination
13. steam-dominant process
14. geometry where identity-critical.

Αυτό κρατά τον V1 classifier ελεγχόμενο.

---

# 39. V1 diagnostic metrics

Μπορούν να υπάρχουν αλλά να μην επηρεάζουν πολύ classification:

- browning
- fermentation difficulty
- spread
- setting risk
- gas-retention risk
- staling tendency.

---

# 40. Confidence calibration

Confidence δεν πρέπει να προκύπτει μόνο από similarity.

Inputs:

\[
Confidence=
f(
DataQuality,
MetricCoverage,
PrototypeMaturity,
ProcessCoverage
)
\]

---

# 41. Prototype maturity

Κάθε prototype έχει:

```text
ExpertSeed
GoldCalibrated
BroadCalibrated
ExperimentValidated
Stable
```

Αυτό επηρεάζει maximum confidence.

Π.χ. ExpertSeed prototype δεν πρέπει να μπορεί να δώσει 99% confidence.

---

# 42. Suggested confidence ceilings

Conceptually:

```text
ExpertSeed          <= Moderate
GoldCalibrated      <= High
BroadCalibrated     <= High
ExperimentValidated <= Very High
```

Οι ακριβείς αριθμοί μπορούν να αποφασιστούν αργότερα.

---

# 43. V1 confidence components

Προτείνεται:

\[
C=
C_D
\times
C_P
\times
C_M
\]

ή geometric-style combination, όπου:

- \(C_D\) = data confidence
- \(C_P\) = process completeness
- \(C_M\) = model/prototype maturity.

---

# 44. Missing data policy

Missing data:

- δεν γίνεται zero,
- δεν penalizes similarity directly,
- μειώνει coverage/confidence.

Critical missing process data μπορεί να εμποδίζει named-product identity.

Παράδειγμα:

Croissant composition με άγνωστο lamination process:

> composition similarity high
> canonical identity confidence low.

---

# 45. Acceptance test category 1 — Canonical recognition

Gold formulas πρέπει τουλάχιστον να ταξινομούνται σωστά στη σωστή **parent family**.

Παράδειγμα:

- brioche → EnrichedYeastDough
- crêpe → Batter/Unleavened
- shortbread → FatShortened
- croissant → LaminatedYeastDough.

Αυτό είναι hard acceptance requirement.

---

# 46. Acceptance test category 2 — Named prototypes

Για mature prototypes, canonical formula πρέπει να έχει το σωστό named product:

- top-1 ή
- τουλάχιστον top-3 όταν categories naturally overlap.

---

# 47. Acceptance test category 3 — No absurd cross-family matches

Δεν είναι αποδεκτό:

- crêpe → brioche
- baguette → cake
- shortbread → high-hydration bread

με high similarity.

Αυτό είναι structural failure του classifier.

---

# 48. Acceptance test category 4 — Smooth counterfactuals

Αλλάζοντας μία μεταβλητή σταδιακά, scores πρέπει γενικά να μεταβάλλονται ομαλά.

Παράδειγμα:

\[
Butter:10\rightarrow20\rightarrow30\rightarrow40\rightarrow50
\]

σε enriched yeast dough.

Expected:

- enrichment rises smoothly,
- brioche similarity generally rises,
- lean bread similarity generally falls.

---

# 49. Acceptance test category 5 — Process independence

Αλλάζοντας μόνο process:

- CompositionSimilarity μένει σταθερό.
- ProcessSimilarity αλλάζει.
- OverallIdentity μεταβάλλεται.

Αυτό είναι core architecture test.

---

# 50. Acceptance test category 6 — Ingredient equivalence

Δύο formulas με διαφορετικά named ingredients αλλά πολύ κοντινή functional composition πρέπει να παράγουν παρόμοια composition metrics.

Παράδειγμα:

milk + cream blend

vs

different dairy combination

με σχεδόν ίδιο:

- water
- fat
- dairy solids.

Δεν πρέπει ο classifier να επηρεάζεται απλώς από τα ingredient names.

---

# 51. Acceptance test category 7 — Ingredient substitution effects

Αν αντικαταστήσουμε:

100 g butter

με ποσότητα oil που κρατά ίδιο total fat,

το σύστημα πρέπει να δείξει:

- total fat περίπου ίδιο,
- water διαφορετικό,
- plastic fat χαμηλότερο,
- creaming compatibility διαφορετική.

Άρα composition similarity μπορεί να είναι κοντινή, αλλά process compatibility να αλλάξει.

---

# 52. Acceptance test category 8 — Unknown handling

Αν λείπει W:

- αποτέλεσμα εξακολουθεί να βγαίνει,
- confidence πέφτει,
- explanation αναφέρει missing W.

Δεν πρέπει να crash ή να θεωρεί W=0.

---

# 53. Acceptance test category 9 — No forced classification

Παράξενη synthetic formula πρέπει να μπορεί να καταλήξει:

> No strong canonical match.

Αυτό είναι mandatory V1 behavior.

---

# 54. Acceptance test category 10 — Hybrid recognition

Chiffon-like system:

- foam high
- chemical leavening high
- oil
- high egg

δεν πρέπει να αναγκαστεί σε pure sponge ή pure butter cake.

Hybrid membership πρέπει να λειτουργεί.

---

# 55. Acceptance test category 11 — Confidence sanity

Δεν είναι αποδεκτό:

> 96% confidence

όταν:

- flour type unknown,
- egg quantity inferred from “2 eggs”,
- process absent,
- yogurt generic.

Similarity μπορεί να είναι υψηλό.

Confidence όχι.

---

# 56. Acceptance test category 12 — Explanation fidelity

Το explanation πρέπει να συμφωνεί με το model.

Αν το fat feature έχει χαμηλό contribution, δεν πρέπει να γράψει:

> “High fat is the main reason.”

Explanation engine δεν επιτρέπεται να εφευρίσκει rationale.

---

# 57. Suggested implementation phases

## Phase 1 — Arithmetic core

Υλοποίηση:

- ingredient catalog
- grams
- baker %
- composition decomposition
- deterministic metrics.

No classifier yet.

---

# 58. Phase 2 — Process representation

Υλοποίηση:

- process schema
- intrinsic/effective metric separation
- basic modifiers.

---

# 59. Phase 3 — Expert seed classifier

Μόνο high-confidence prototypes:

- lean bread
- stiff dough
- enriched dough
- brioche
- shortbread
- cake
- muffin
- pancake
- crêpe
- croissant
- choux.

---

# 60. Phase 4 — Counterfactual engine

Sliders / formula modifications.

Το engine πρέπει να επιτρέπει:

\[
Formula\rightarrow Formula'
\]

και deterministic recomputation.

---

# 61. Phase 5 — Gold dataset calibration

Εισαγωγή manually curated canonical formulas.

Recalibrate:

- membership ranges
- weights
- confidence.

---

# 62. Phase 6 — Broader taxonomy

Προσθήκη:

- challah
- tsoureki
- genoise
- chiffon
- angel food
- Danish
- pâte sablée
- pâte sucrée
- waffle
- pizza subfamilies.

---

# 63. Phase 7 — Broad dataset

Hundreds/thousands recipes.

Use for:

- variation
- overlaps
- outliers
- confusion analysis.

---

# 64. Phase 8 — Outcome diagnostics

Μόνο τότε γίνεται σοβαρότερο calibration για:

- tenderness
- spread
- gas retention
- setting
- browning
- staling.

---

# 65. Phase 9 — Controlled experiment data

Το πιο επιστημονικό επίπεδο.

Use controlled formulas to calibrate causal relationships:

\[
Fat\rightarrow Tenderness
\]

\[
Sugar\rightarrow Spread
\]

\[
Hydration\rightarrow Fluidity
\]

κ.λπ.

---

# 66. V1 stopping rule

Το V1 θεωρείται έτοιμο για public experimentation όταν:

1. deterministic metrics είναι unit-tested,
2. high-confidence family classification λειτουργεί,
3. no-match λειτουργεί,
4. confidence λειτουργεί,
5. explanations είναι faithful,
6. counterfactuals είναι smooth,
7. canonical Gold formulas περνούν acceptance tests,
8. known cross-family absurdities δεν εμφανίζονται.

Δεν απαιτείται perfect named-product accuracy.

---

# 67. Scientific labeling policy

Κάθε output πρέπει να χαρακτηρίζεται εσωτερικά ως:

```text
Calculated
Estimated
Heuristic
Experimental
```

UI μπορεί να το δείχνει πιο διακριτικά, αλλά το metadata πρέπει πάντα να υπάρχει.

---

# 68. Model maturity policy

Δεν πρέπει να παρουσιάσουμε το εργαλείο σαν:

> «επιστημονική πρόβλεψη του τελικού baked product»

στη V1.

Πιο σωστό:

> Formula analysis and structural similarity model.

Αργότερα, με experimental validation, μπορεί να γίνει predictive model.

---

# 69. Core V1 promise

Η V1 πρέπει να μπορεί αξιόπιστα να απαντά:

> Τι υπάρχει πραγματικά στη φόρμουλα;

> Ποια δομική λογική έχει;

> Προς ποια οικογένεια κινείται;

> Ποια γνωστά products μοιάζει να πλησιάζει;

> Ποιες μεταβλητές είναι υπεύθυνες;

> Πώς αλλάζει αν μεταβάλω ένα ingredient ή process parameter;

Αυτό από μόνο του είναι ήδη πολύ ισχυρό προϊόν.

---

# 70. Final calibration principle

Η σειρά πρέπει πάντα να είναι:

\[
\boxed{
Physics/Chemistry
\rightarrow
Expert\ Model
\rightarrow
Canonical\ Data
\rightarrow
Broad\ Data
\rightarrow
Controlled\ Experiments
}
\]

και όχι:

\[
\boxed{
Scrape\ Recipes
\rightarrow
Train\ Classifier
}
\]

Το δεύτερο θα μάθαινε κυρίως τις ασυνέπειες του internet.

Το πρώτο μπορεί να οδηγήσει σε πραγματικό formula-intelligence system.\n\n
