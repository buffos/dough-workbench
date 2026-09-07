# Dough Formula Intelligence
## Formal Domain Specification v0.1

## 1. Purpose

Το σύστημα αναλύει φόρμουλες αρτοσκευασμάτων και ζαχαροπλαστικής με στόχο να μετατρέπει μία λίστα πραγματικών υλικών και μία διαδικασία παρασκευής σε λειτουργική περιγραφή της ζύμης ή του batter.

Το σύστημα πρέπει να μπορεί να απαντά:

1. Ποια είναι η πραγματική λειτουργική σύσταση της φόρμουλας;
2. Ποια είναι τα βασικά structural characteristics;
3. Σε ποια ευρεία οικογένεια ανήκει;
4. Με ποια γνωστά προϊόντα παρουσιάζει similarity;
5. Πώς επηρεάζει το process το αναμενόμενο αποτέλεσμα;
6. Ποια χαρακτηριστικά υποστηρίζουν ή απομακρύνουν τη φόρμουλα από μία συγκεκριμένη κατηγορία;
7. Πόσο αξιόπιστη είναι η εκτίμηση;

Το σύστημα **δεν πρέπει να θεωρεί ότι κάθε φόρμουλα ανήκει υποχρεωτικά σε γνωστό προϊόν**.

Πρέπει να μπορεί να επιστρέψει:

> No strong canonical match.

και να περιγράψει μόνο τα structural characteristics.

---

# 2. Core conceptual pipeline

Η βασική ροή είναι:

\[
Ingredients
\rightarrow
Composition
\rightarrow
IntrinsicMetrics
\rightarrow
Process
\rightarrow
EffectiveMetrics
\rightarrow
Classification
\rightarrow
OutcomeDescription
\]

Πιο αυστηρά:

\[
g(Ingredients) \rightarrow Composition
\]

\[
h(Composition,FlourProperties) \rightarrow IntrinsicMetrics
\]

\[
p(IntrinsicMetrics,Process) \rightarrow EffectiveMetrics
\]

\[
f(EffectiveMetrics,Prototypes) \rightarrow Classification
\]

---

# 3. Fundamental separation

Το σύστημα πρέπει να διακρίνει αυστηρά μεταξύ:

## 3.1 Raw facts

Παρατηρημένα ή δοσμένα στοιχεία:

- 100 g whole milk
- 82% butter fat
- flour protein 12.8%
- fermentation at 24°C for 3 h

## 3.2 Calculated physical quantities

Μαθηματικά παράγωγα από known composition:

- total water
- total fat
- sucrose load
- total salt

## 3.3 Estimated physical quantities

Μεγέθη που βασίζονται σε assumptions:

- effective hydration
- estimated flour absorption
- estimated acid neutralization

## 3.4 Heuristic model scores

Μη φυσικές μονάδες:

- gluten potential 82/100
- tenderness 67/100
- enrichment 73/100
- fluidity 41/100

Τα heuristic scores **δεν πρέπει ποτέ να εμφανίζονται σαν εργαστηριακά μετρημένες φυσικές ποσότητες**.

---

# 4. Aggregate Root: Formula

Η βασική aggregate root είναι:

`Formula`

Περιλαμβάνει:

- FlourSystem
- IngredientLines
- Process
- AnalysisSettings
- DerivedAnalysis

Conceptually:

```text
Formula
├── FlourSystem
├── IngredientLines[]
├── Process
├── Metadata
└── Analysis
```

---

# 5. Formula invariant

Κάθε Formula πρέπει να έχει τουλάχιστον ένα structural flour component.

Το συνολικό baker's flour denominator ορίζεται:

\[
F=\sum FlourMass_i
\]

και:

\[
F>0
\]

Όλα τα baker's percentages υπολογίζονται:

\[
BP_i=\frac{Mass_i}{F}\times100
\]

---

# 6. FlourSystem

Το FlourSystem είναι ξεχωριστό aggregate/value structure επειδή το αλεύρι καθορίζει μεγάλο μέρος της structural capacity.

```text
FlourSystem
├── FlourComponents[]
├── totalMass
├── blendProtein
├── estimatedGlutenPotential
├── estimatedAbsorption
└── confidence
```

---

# 7. FlourComponent

Κάθε component περιέχει:

- ingredient reference
- mass
- percentageWithinFlourBlend
- grain type
- refinement class
- protein
- gluten-forming protein estimate
- W, optional
- P/L, optional
- ash, optional
- fiber
- damaged starch, optional
- data confidence

---

# 8. Flour blend invariant

Για όλα τα flour components:

\[
\sum_i FlourBlendPercentage_i =100\%
\]

εντός αριθμητικής ανοχής.

---

# 9. GrainType

Initial enum:

```text
CommonWheat
DurumWheat
Rye
Oat
Barley
Corn
Rice
Buckwheat
Other
```

Δεν υποθέτουμε ότι όλα τα flour components παράγουν gluten.

---

# 10. RefinementClass

```text
HighlyRefined
Refined
SemiWhole
WholeGrain
Unknown
```

---

# 11. Ingredient

Το Ingredient είναι canonical composition definition.

```text
Ingredient
├── Identity
├── Composition
├── Chemistry
├── PhysicalProperties
├── FunctionalTags
├── AvailabilityProperties
└── DataQuality
```

---

# 12. Ingredient identity

Πεδία:

- canonicalId
- canonicalName
- displayName
- ingredientFamily
- source
- version
- brand/product reference optional

Παράδειγμα:

```text
canonicalId: dairy.whole_milk.generic
canonicalName: Whole Milk
```

---

# 13. IngredientComposition

Όλα εκφράζονται σε:

\[
g / 100g\ ingredient
\]

Core fields:

```text
water
fatTotal

proteinTotal
glutenProtein
eggProtein
dairyProtein
otherProtein

starch

sucrose
glucose
fructose
lactose
maltose
otherSugars

fiber
salt
ash
ethanol
otherSolids
```

---

# 14. Composition mass invariant

Όπου τα δεδομένα είναι αρκετά πλήρη:

\[
water+
fat+
protein+
carbohydrates+
fiber+
ash+
ethanol+
other
\approx100
\]

με configurable tolerance.

Δεν απαιτείται απόλυτα 100 λόγω:

- rounding,
- incomplete data,
- overlapping nutritional definitions.

---

# 15. Protein invariant

Όπου υπάρχουν subclasses:

\[
glutenProtein+
eggProtein+
dairyProtein+
otherProtein
\leq proteinTotal
\]

Το υπόλοιπο θεωρείται unclassified protein.

---

# 16. Sugar invariant

\[
Sucrose+Glucose+Fructose+Lactose+Maltose+OtherSugars
\leq TotalCarbohydrate
\]

εφόσον υπάρχει total carbohydrate field.

---

# 17. IngredientChemistry

```text
pH
titratableAcidity
acidNeutralizationCapacity
bicarbonateEquivalent
emulsifierContent
reducingSugarFactor
fermentabilityProfile
```

Τα περισσότερα μπορούν να είναι unknown.

---

# 18. pH rule

Το pH **δεν επιτρέπεται να αθροίζεται γραμμικά** μεταξύ ingredients.

Η τιμή Formula pH πρέπει να χαρακτηρίζεται:

- measured,
- experimentally estimated,
- unavailable.

Δεν επιτρέπεται:

\[
pH_{formula} = \sum pH_i
\]

ή weighted arithmetic average ως authoritative calculation.

---

# 19. AcidNeutralizationCapacity

Το σημαντικό baking field για soda.

Εκφράζει πόση ποσότητα sodium bicarbonate μπορεί να εξουδετερώσει συγκεκριμένη ποσότητα ingredient.

Η μονάδα πρέπει να οριστεί canonical και να χρησιμοποιείται σε όλη την εφαρμογή.

---

# 20. PhysicalProperties

```text
physicalState
fatState
particleClass
isContinuousPhaseParticipant
defaultInclusionBehavior
```

---

# 21. PhysicalState

```text
Liquid
SemiSolid
Solid
Powder
Granular
Flake
Unknown
```

---

# 22. FatState

```text
None
Liquid
Plastic
Firm
Hard
Variable
Unknown
```

Το fat state μπορεί να μεταβάλλεται από Process temperature.

---

# 23. Functional tags

Τα tags χρησιμοποιούνται για:

- UI
- search
- explanation

και όχι ως authoritative computational source.

Examples:

```text
Flour
Fat
Dairy
Egg
Sweetener
Leavener
Acid
Starch
FiberSource
Emulsifier
Inclusion
Flavoring
```

---

# 24. IngredientLine

Μία Formula δεν χρησιμοποιεί Ingredient απευθείας αλλά IngredientLine.

```text
IngredientLine
├── ingredientReference
├── mass
├── bakerPercentage
├── role
├── compositionOverride optional
├── availabilityOverride optional
└── confidence
```

---

# 25. IngredientRole

```text
Structural
ContinuousPhase
Inclusion
SurfaceTreatment
Filling
Topping
Other
```

Αυτό είναι απαραίτητο.

100 g raisins ως inclusion δεν πρέπει να αντιμετωπίζονται όπως 100 g banana puree ενσωματωμένο στο batter.

---

# 26. Availability coefficients

Το schema πρέπει να υποστηρίζει:

```text
waterAvailability
fatAvailability
sugarAvailability
proteinAvailability
```

όλα:

\[
0\le A\le1
\]

Αρχικά μπορούν να είναι unknown/default.

Δεν πρέπει να κατασκευαστούν αυθαίρετες ακριβείς τιμές χωρίς calibration.

---

# 27. Total Water

Authoritative calculated metric:

\[
W_T=
\frac{
\sum_i Mass_i \times WaterFraction_i
}{F}
\times100
\]

---

# 28. Effective Water

Estimated metric:

\[
W_E=
\frac{
\sum_i Mass_i
\times WaterFraction_i
\times Availability_i
}{F}
\times100
\]

Πρέπει να επιστρέφει και confidence.

---

# 29. Total Fat

\[
Fat_T=
\frac{
\sum_i Mass_iFatFraction_i
}{F}
\times100
\]

---

# 30. Fat subdivisions

Υπολογίζονται:

\[
Fat_{liquid}
\]

\[
Fat_{plastic}
\]

\[
Fat_{solid}
\]

σύμφωνα με ingredient composition + process physical state.

---

# 31. Total Sugar

\[
Sugar_T=
Sucrose+
Glucose+
Fructose+
Lactose+
Maltose+
OtherSugars
\]

όλα normalized ως flour percentage.

---

# 32. Sweetness Equivalent

Sucrose reference:

\[
R_{sucrose}=1
\]

και:

\[
SE=
\sum_j Sugar_j\times RelativeSweetness_j
\]

Το SE είναι model-derived sensory estimate.

---

# 33. Fermentable Sugar Load

\[
FS=
\sum_j Sugar_j\times Fermentability_{organism,j}
\]

Η fermentability πρέπει να εξαρτάται από FermentationAgent.

---

# 34. Reducing Sugar Load

\[
RS=
\sum_j Sugar_j\times ReducingFactor_j
\]

Χρησιμοποιείται ως input στο Browning model.

---

# 35. Gluten-forming protein

\[
GP=
\frac{
\sum_i Mass_iGlutenProteinFraction_i
}{F}
\times100
\]

Δεν ταυτίζεται με flour protein.

---

# 36. Structural non-gluten protein

Διατηρούμε ξεχωριστά:

\[
EggProtein
\]

\[
DairyProtein
\]

\[
OtherStructuralProtein
\]

Δεν επιτρέπεται να προστίθενται αδιακρίτως στο gluten potential.

---

# 37. Starch Load

\[
Starch_T=
\frac{
\sum_i Mass_iStarchFraction_i
}{F}
\times100
\]

Περιλαμβάνει starch από:

- flour
- corn starch
- potato starch
- cocoa etc.

---

# 38. Fiber Load

\[
Fiber_T=
\frac{
\sum_i Mass_iFiberFraction_i
}{F}
\times100
\]

---

# 39. Salt Load

\[
Salt_T=
\frac{
\sum_i Mass_iSaltFraction_i
}{F}
\times100
\]

Από όλες τις πηγές.

---

# 40. Emulsifier Load

\[
EM=
\frac{
\sum_i Mass_iEmulsifierFraction_i
}{F}
\times100
\]

Αρχικά χρησιμοποιείται κυρίως ως heuristic input.

---

# 41. Flour Absorption Demand

Heuristic:

\[
FAD=
f(
GlutenProtein,
FlourProteinQuality,
Fiber,
DamagedStarch,
WholegrainFraction,
GrainType
)
\]

Normalized score ή expected-water interval.

Το μοντέλο πρέπει να διατηρεί distinction μεταξύ:

- expected absorption estimate
- measured flour absorption.

---

# 42. Relative Hydration

\[
RH=
\frac{EffectiveWater}{ExpectedAbsorption}
\]

όπου διαθέσιμο.

Interpretation:

```text
RH << 1     comparatively stiff
RH ≈ 1      normal relative hydration
RH > 1      high relative hydration
```

Δεν πρέπει να έχει hard universal thresholds πριν το calibration.

---

# 43. Intrinsic Gluten Potential

`GlutenPotentialIndex` ή GPI.

Inputs:

- gluten-forming protein
- W
- P/L
- grain composition
- hydration adequacy
- flour quality

Output:

\[
0\ldots100
\]

Αφορά τη **δυνητική** δυνατότητα της Formula να δημιουργήσει gluten network πριν λάβουμε υπόψη process.

---

# 44. Effective Gluten Index

`EffectiveGlutenIndex` ή EGI.

\[
EGI=
f(
GPI,
Mixing,
Rest,
Hydration,
FatLoad,
FatMode,
SugarLoad,
Acidity,
Fermentation
)
\]

Είναι process-sensitive.

---

# 45. Enrichment Index

\[
EI=
f(
Fat,
Sugar,
EggSolids,
DairySolids
)
\]

Normalized:

\[
0\ldots100
\]

Interpretation labels μπορούν να είναι:

```text
Lean
LightlyEnriched
Enriched
HighlyEnriched
```

Τα numeric boundaries καθορίζονται από calibration dataset.

---

# 46. Tenderizing Load

Compositional metric:

\[
TL=
f(
Fat,
Sugar,
YolkComponents,
Emulsifiers
)
\]

---

# 47. Tenderness Index

Outcome-oriented heuristic:

\[
TI=
f(
TenderizingLoad,
EffectiveGluten,
StructuralProtein,
Water,
Process
)
\]

Normalized:

\[
0=\text{very chewy/rigid}
\]

\[
100=\text{very tender/short}
\]

---

# 48. Fluidity Index

\[
FI=
f(
EffectiveWater,
LiquidFat,
Sugar,
Egg,
Starch,
Protein,
Fiber,
Temperature
)
\]

Normalized:

```text
0      rigid mass
25     stiff dough
50     soft/wet dough
75     thick batter
100    thin pourable batter
```

Τα labels είναι descriptive, όχι rigid thresholds.

---

# 49. LeaveningProfile

Δεν χρησιμοποιούμε ένα μόνο leavening score.

```text
LeaveningProfile
├── yeastGasPotential
├── chemicalGasPotential
├── mechanicalGasPotential
└── steamPotential
```

Κάθε τιμή normalized.

---

# 50. Gas Retention Capacity

\[
GRC=
f(
EffectiveGluten,
EggProtein,
Viscosity,
Starch,
EmulsionStability
)
\]

---

# 51. Setting Capacity

\[
SC=
f(
Starch,
EffectiveGluten,
EggProtein,
DairyProtein
)
\]

---

# 52. Set Delay

\[
SD=
f(
Sugar,
Water,
Fat
)
\]

Το SC και SD πρέπει να παραμένουν ξεχωριστά.

Μία φόρμουλα μπορεί να έχει υψηλή τελική setting capacity αλλά μεγάλο setting delay.

---

# 53. Structural Risk

Δεν είναι binary.

Possible risk outputs:

```text
InsufficientGasRetention
ExcessGasRelativeToStructure
CollapseRisk
ExcessiveSpreadRisk
LowHydrationRisk
WeakGlutenRisk
OverEnrichmentRisk
AcidBaseImbalance
OverproofRisk
UnderproofRisk
LaminationFailureRisk
```

Κάθε risk έχει:

- severity
- confidence
- contributing factors.

---

# 54. Process aggregate

```text
Process
├── Mixing
├── IngredientAddition
├── Aeration
├── Fermentation
├── Lamination
├── ThermalProcess
└── Geometry
```

---

# 55. MixingProcess

```text
method
intensity
duration
foldCount
foldIntensity
restDuration
restType
targetDevelopment optional
```

---

# 56. MixingMethod

Initial enum:

```text
MinimalCombine
HandKnead
MachineKnead
SpiralMix
PlanetaryHook
Paddle
Whisk
StretchAndFold
CoilFold
GentleFold
Other
```

---

# 57. Mixing intensity invariant

Normalized:

\[
0\le intensity\le1
\]

Unknown permitted.

---

# 58. Effective Mechanical Work

\[
MW=f(Method,Intensity,Duration)
\]

Δεν θεωρείται physical joules.

Είναι normalized heuristic.

---

# 59. Overmixing

Gluten development response to mechanical work πρέπει να μπορεί να είναι non-monotonic.

Conceptually:

\[
MW \uparrow
\Rightarrow EGI \uparrow
\]

μέχρι optimum και μετά:

\[
MW \uparrow
\Rightarrow EGI \downarrow
\]

για έντονο overmixing.

---

# 60. RestType

```text
Autolyse
Fermentolyse
BenchRest
IntermediateRest
PostMixRest
Other
```

---

# 61. IngredientAdditionProcess

Το process πρέπει να διατηρεί τη σειρά προσθήκης υλικών.

Δεν αρκεί ένα final ingredients set.

Conceptually:

```text
AdditionStep
├── sequence
├── ingredients[]
├── action
└── duration
```

---

# 62. FatIncorporationMode

```text
EarlyCoating
Creamed
Melted
LateIncorporation
ColdChunks
Laminated
Emulsified
DirectMix
Unknown
```

---

# 63. AerationProcess

```text
method
intensity
targetFoam
foamStability
postAerationHandling
```

---

# 64. AerationMethod

```text
None
Creaming
WholeEggWhip
EggWhiteWhip
WhippedCream
MechanicalBeat
Other
```

---

# 65. FoamLossFactor

\[
0\le FLF\le1
\]

και:

\[
EffectiveMechanicalGas=
CreatedMechanicalGas(1-FLF)
\]

---

# 66. FermentationProcess

```text
agent
prefermentType
prefermentPercentage

bulkTime
bulkTemperature
bulkExpansionTarget

finalProofTime
finalProofTemperature
finalExpansionTarget

coldFermentation
```

---

# 67. FermentationAgent

```text
None
CommercialYeast
Sourdough
Mixed
Other
```

---

# 68. Fermentation invariant

Αν:

```text
agent = None
```

τότε yeast gas potential πρέπει να είναι 0.

---

# 69. Expansion targets

Προτιμώνται έναντι αποκλειστικής εξάρτησης από χρόνο.

Examples:

```text
30PercentIncrease
50PercentIncrease
Double
CustomPercent
Unknown
```

---

# 70. FermentationSeverity

\[
FSV=
f(
AgentAmount,
Time,
Temperature,
Hydration,
Sugar,
Salt
)
\]

Heuristic normalized score.

---

# 71. LaminationProcess

```text
enabled
laminationFat
layerFatPercentage
foldSequence[]
fatState
doughState
workingTemperature
```

---

# 72. Lamination invariant

Αν `enabled = false`:

- foldSequence may be empty,
- layerFatPercentage should not contribute to lamination score.

---

# 73. LayerIntegrity

\[
LI=
f(
FatState,
DoughState,
Temperature,
FoldSequence,
Handling
)
\]

Normalized heuristic.

---

# 74. ThermalProcess

```text
method
temperature
duration
preheated
steamLevel
surfaceTreatment
```

---

# 75. ThermalMethod

```text
StaticOven
FanOven
SteamOven
AirFryer
Griddle
Pan
DeepFry
BoilThenBake
Other
```

---

# 76. Geometry

```text
shapeClass
characteristicThickness
surfaceVolumeClass
containerType
```

---

# 77. ShapeClass

```text
Loaf
Roll
Flatbread
ThinSheet
Cookie
Cake
Muffin
Pancake
Crepe
Ring
LaminatedPiece
ChouxPiece
Other
```

---

# 78. Taxonomy

Η taxonomy είναι hierarchical αλλά multi-dimensional.

Δεν πρέπει να χρησιμοποιηθεί σαν ένα απλό enum.

Primary structural families:

```text
GlutenStructured
FatShortened
StarchProteinSet
FoamStructured
Laminated
SteamDominant
Hybrid
```

Μία formula μπορεί να έχει membership σε περισσότερα του ενός.

---

# 79. Leavening taxonomy

Ανεξάρτητος άξονας:

```text
YeastLeavened
ChemicalLeavened
MechanicalFoam
SteamLeavened
Unleavened
Mixed
```

---

# 80. Canonical product hierarchy

Initial V1:

```text
Formula

GlutenStructured
├── StiffLeanDough
│   ├── Bagel
│   └── Pretzel
│
├── LeanBread
│   ├── Baguette
│   ├── CountryBread
│   ├── PizzaDough
│   └── HighHydrationBread
│
├── EnrichedYeastDough
│   ├── SoftBread
│   ├── MilkBread
│   ├── Challah
│   ├── Tsoureki
│   └── Brioche
│
└── LaminatedYeastDough
    ├── Croissant
    └── Danish

FatShortened
├── Shortcrust
├── PateSablee
├── PateSucree
├── Shortbread
└── Cookie

Batter
├── ChemicalLeavened
│   ├── ButterCake
│   ├── OilCake
│   ├── Muffin
│   ├── Pancake
│   └── Waffle
│
├── FoamLeavened
│   ├── Sponge
│   ├── Genoise
│   ├── Chiffon
│   └── AngelFood
│
└── Unleavened
    └── Crepe

SteamDominant
└── Choux
```

---

# 81. FormulaFamily vs NamedProduct

Αυτά είναι διαφορετικά concepts.

Example:

```text
FormulaFamily:
HighlyEnrichedYeastedGlutenDough

NamedProductSimilarities:
Brioche 0.84
Tsoureki 0.71
Challah 0.58
```

Δεν επιτρέπεται το system να εξισώνει structural family με cultural product identity.

---

# 82. Prototype

Κάθε category έχει `Prototype`.

```text
Prototype
├── category
├── parent
├── featureMatchers[]
├── processMatchers[]
├── interactionMatchers[]
├── requiredCharacteristics[]
└── calibrationMetadata
```

---

# 83. FeatureMatcher

```text
metric
membershipFunction
weight
importance
missingDataPolicy
```

---

# 84. MembershipFunction types

V1:

```text
Trapezoidal
Triangular
Gaussian
Boolean
Categorical
RangePenalty
```

---

# 85. Membership output invariant

Για κάθε matcher:

\[
0\le \mu(x)\le1
\]

---

# 86. Trapezoidal matcher

Defined by:

\[
a<b\le c<d
\]

Membership:

- 0 outside \(a,d\)
- rising \(a\rightarrow b\)
- 1 between \(b,c\)
- falling \(c\rightarrow d\).

---

# 87. Weighted composition similarity

\[
S_C=
\frac{
\sum_j w_j\mu_j(x_j)
}{
\sum_jw_j
}
\]

μόνο στα available metrics.

---

# 88. Coverage

\[
Coverage=
\frac{
\sum_{available}w_j
}{
\sum_{all}w_j
}
\]

---

# 89. Process similarity

\[
S_P=
\frac{
\sum_jv_j\pi_j(p_j)
}{
\sum_jv_j
}
\]

---

# 90. Overall identity

Δεν χρησιμοποιείται απλό arithmetic average.

Default conceptual form:

\[
S_I=
S_C^{\alpha}
S_P^{\beta}
P
\]

όπου:

- \(P\) = constraint compatibility penalty
- \(\alpha,\beta\) calibration parameters.

---

# 91. Three scores requirement

Για NamedProduct πρέπει να επιστρέφονται ξεχωριστά:

```text
compositionSimilarity
processSimilarity
overallIdentitySimilarity
```

---

# 92. Similarity semantics

Similarity:

\[
0\ldots1
\]

δεν αποτελεί probability.

Το UI δεν πρέπει να γράφει:

> 84% probability of being brioche.

Πρέπει να γράφει:

> 84% similarity to the brioche prototype.

---

# 93. Similarities are not mutually exclusive

Επιτρέπεται:

```text
Brioche 84%
Tsoureki 77%
Challah 65%
```

Δεν απαιτείται το άθροισμα να είναι 100%.

---

# 94. Near-hard constraints

Ορισμένα product features είναι identity-critical.

Παραδείγματα:

```text
Brioche → yeast fermentation strongly expected
Croissant → lamination required
Genoise → egg whipping strongly expected
Crepe → very high fluidity and minimal leavening
```

Έλλειψη constraint δεν πρέπει πάντα να μηδενίζει composition similarity.

Πρέπει να μειώνει:

- process similarity
- canonical identity similarity.

---

# 95. Unknown classification

Αν:

\[
\max(S_I)<Threshold
\]

τότε το output είναι:

```text
NoStrongCanonicalMatch
```

και εμφανίζεται μόνο:

- structural family
- derived metrics
- closest weak matches.

Το threshold καθορίζεται μόνο μετά validation.

---

# 96. Hybrid classification

Αν δύο structural mechanisms έχουν υψηλό membership και κανένα named product δεν κυριαρχεί:

```text
HybridFormula
```

Example description:

> Highly enriched batter-like hybrid with moderate gluten structure.

---

# 97. InteractionMatcher

Για σημαντικές μη ανεξάρτητες μεταβλητές.

Initial interactions:

```text
Fat × Hydration
Sugar × Hydration
Fat × GlutenPotential
Egg × Hydration
GasGeneration × GasRetention
Sugar × Yeast
FatMode × GlutenPotential
```

---

# 98. Interaction rule

Interaction terms δεν πρέπει να δημιουργηθούν για όλους τους δυνατούς συνδυασμούς.

Πρέπει να υπάρχουν μόνο αν:

- υπάρχει culinary/food-science rationale,
- ή empirical dataset justification.

---

# 99. Data confidence

Κάθε data point πρέπει να έχει provenance:

```text
Measured
ExactProductData
NutritionLabel
PublishedReference
GenericDatabase
Inferred
Estimated
Unknown
```

και:

\[
confidence\in[0,1]
\]

---

# 100. Formula confidence

Overall confidence:

\[
C_F=
f(
IngredientConfidence,
FlourConfidence,
ProcessCoverage,
PrototypeCoverage
)
\]

Δεν πρέπει να συγχέεται με similarity.

Μπορεί να έχουμε:

> Brioche similarity 88%
> Confidence 54%

---

# 101. Explanation model

Κάθε classification πρέπει να είναι explainable.

Το αποτέλεσμα πρέπει να περιλαμβάνει:

```text
PositiveContributors[]
NegativeContributors[]
MissingCriticalData[]
ConstraintConflicts[]
```

---

# 102. Feature contribution

Για feature \(j\):

\[
Contribution_j=w_j\mu_j
\]

ή equivalent calibrated metric.

Το explanation generator πρέπει να βασίζεται στα πραγματικά model contributions.

---

# 103. Example explanation

```text
Closest family:
Highly Enriched Yeast Dough

Brioche similarity:
84%

Strong supporting factors:
- high butter load
- high egg solids
- strong gluten potential
- yeast fermentation

Differences from typical brioche:
- sugar somewhat low
- effective hydration somewhat high

Confidence:
Moderate
Reason:
flour W and P/L unavailable
```

---

# 104. ValidationRecipe

Dataset record:

```text
ValidationRecipe
├── source
├── sourceTier
├── rawIngredients
├── normalizedFormula
├── process
├── declaredLabel
├── curatedLabel
├── structuralFamily
├── labelConfidence
├── dataQuality
└── optionalOutcomeObservations
```

---

# 105. SourceTier

```text
A
B
C
D
```

Typical meaning:

A:
professional/academic/canonical.

B:
high-quality professional or test kitchen.

C:
reputable general recipe source.

D:
low-confidence/community/ambiguous.

---

# 106. Dataset weighting

Calibration observation weight:

\[
W_{obs}=
f(
SourceTier,
LabelConfidence,
MeasurementQuality,
ProcessCompleteness
)
\]

---

# 107. Gold dataset

Separate dataset subset:

- 10–20 highly trusted canonical formulas per major family where feasible.
- manually reviewed.
- versioned.
- never automatically relabeled.

Χρησιμοποιείται για:

- regression tests
- sanity checks
- canonical calibration.

---

# 108. Broad dataset

Hundreds or thousands of formulas.

Χρησιμοποιείται για:

- natural variation
- prototype spread
- boundary analysis
- cultural naming variation.

---

# 109. Controlled experiment dataset

Records όπου μεταβάλλεται μία ή λίγες μεταβλητές.

Example:

```text
Base:
100 flour
65 water
2 salt

Experiment:
fat = 0, 5, 10, 20, 40
```

Χρησιμοποιείται για causal calibration των heuristic metrics.

---

# 110. Dataset split

At minimum:

```text
Calibration
Validation
Test
```

Το Test set δεν χρησιμοποιείται για tuning.

---

# 111. Source-group split invariant

Recipes από την ίδια highly-related source family δεν πρέπει να διαχέονται άκριτα μεταξύ calibration και test.

Αποφεύγουμε leakage.

---

# 112. Deduplication

Near-identical formulas πρέπει να ανιχνεύονται.

Deduplication inputs:

- normalized ingredient vector
- process similarity
- source lineage.

30 copies της ίδιας φόρμουλας δεν θεωρούνται 30 ανεξάρτητα observations.

---

# 113. Prototype calibration

Initial prototype memberships μπορούν να δημιουργηθούν από robust percentiles.

Example:

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

για trapezoidal membership.

Τα percentiles είναι initial strategy και όχι immutable requirement.

---

# 114. Evaluation

Metrics πρέπει να περιλαμβάνουν:

- broad-family classification accuracy
- named-product top-1
- named-product top-3
- hierarchical accuracy
- confusion matrix
- unknown detection performance
- similarity smoothness
- confidence calibration

---

# 115. Hierarchical error

Το evaluation πρέπει να διακρίνει:

```text
Wrong named subtype
Wrong subfamily
Wrong structural family
```

Το τελευταίο είναι πολύ σοβαρότερο.

---

# 116. Counterfactual tests

Mandatory regression tests.

Παράδειγμα:

Start brioche prototype.

Μειώνουμε:

\[
Fat:50\rightarrow40\rightarrow30\rightarrow20
\]

Expected:

- brioche membership smooth decline
- soft/enriched bread membership smooth increase.

Δεν επιτρέπονται παράλογα discontinuities.

---

# 117. Process counterfactual tests

Composition παραμένει ίδια.

Αλλάζουμε:

```text
late butter incorporation
→ early flour coating
```

Expected:

- CompositionSimilarity almost unchanged
- ProcessSimilarity decreases
- EffectiveGluten decreases.

---

# 118. Extreme tests

Mandatory malformed/implausible formulas:

- extreme hydration
- extreme fat
- no structural material
- soda without acid
- huge gas generation with tiny retention
- impossible lamination fluidity

Expected result:

```text
NoStrongCanonicalMatch
```

και/or structural warnings.

---

# 119. Outcome model boundary

V1 classifier **δεν υπόσχεται** ακριβείς φυσικές προβλέψεις όπως:

- exact loaf volume
- exact crumb cell size
- exact spread diameter
- exact baking time

χωρίς empirical models.

V1 μπορεί να προβλέπει μόνο qualitative/relative tendencies.

---

# 120. V1 supported outcome descriptors

Recommended:

```text
Stiffness
Fluidity
GlutenStructure
Tenderness
Chewiness
Enrichment
ExpectedCrumbDensity
ExpectedAeration
BrowningPotential
SpreadTendency
GasRetention
SettingStrength
FermentationDifficulty
CanonicalFamilySimilarity
```

με confidence.

---

# 121. Diagnostic mode

Το σύστημα πρέπει αργότερα να μπορεί να συγκρίνει:

```text
Current Formula
vs
Target Prototype
```

και να παράγει διαφορές.

Example:

```text
Target: Brioche

Current fat:
22%
Typical target:
40–60%

Current egg:
20%
Typical target:
35–60%

Suggested direction:
increase fat and egg,
maintain strong gluten process.
```

Δεν αποτελεί recipe generation απαραίτητα.

Είναι formula-space guidance.

---

# 122. Counterfactual engine

Το domain model πρέπει να επιτρέπει:

\[
Formula'
=
Formula+\Delta x
\]

και επανυπολογισμό όλων των metrics.

Αυτό επιτρέπει interactive sliders:

```text
Butter 20 → 50
Sugar 10 → 20
Water 60 → 75
```

και real-time αλλαγή των similarity scores.

---

# 123. Target optimization — future boundary

Μελλοντικό module μπορεί να λύνει:

\[
\min_{\Delta X}
Distance(Formula+\Delta X,Target)
\]

υπό constraints.

Παράδειγμα:

> Closest modifications required to move this formula toward brioche.

Δεν είναι V1 requirement αλλά το domain model δεν πρέπει να το εμποδίζει.

---

# 124. Ingredient substitution — future boundary

Μελλοντικό module:

> Replace butter with olive oil.

Πρέπει να επανυπολογίζει:

- total fat
- water
- fat state
- creaming compatibility
- fluidity
- tenderness
- product similarity.

Άρα substitutions είναι αλλαγές composition + process compatibility, όχι απλό gram-for-gram replacement.

---

# 125. Versioning

Πρέπει να versioned:

```text
IngredientDatabaseVersion
MetricModelVersion
PrototypeVersion
DatasetVersion
ClassifierVersion
```

Classification result πρέπει να αποθηκεύει με ποιο model version δημιουργήθηκε.

---

# 126. Determinism

Με ίδια:

- formula
- ingredient definitions
- process
- model version

πρέπει το deterministic V1 classifier να επιστρέφει το ίδιο αποτέλεσμα.

---

# 127. Precision policy

Internal calculations μπορούν να χρησιμοποιούν υψηλή precision.

UI output δεν πρέπει να δημιουργεί false precision.

Π.χ.:

Calculated:

> Total fat 17.36%

είναι λογικό.

Heuristic:

> Tenderness 73.482%

δεν είναι.

UI:

> Tenderness 73/100

ή:

> High tenderness.

---

# 128. Unit policy

Internal canonical mass unit:

```text
gram
```

Internal canonical temperature:

```text
degrees Celsius
```

Internal canonical time:

```text
seconds
```

UI μπορεί να εμφανίζει άλλες μονάδες.

---

# 129. Null policy

Unknown ≠ zero.

Π.χ.:

```text
flour.W = unknown
```

δεν σημαίνει:

```text
flour.W = 0
```

Αυτό είναι hard invariant σε όλο το μοντέλο.

---

# 130. Data provenance invariant

Κάθε inferred/defaulted value πρέπει να είναι distinguishable από user-supplied exact value.

---

# 131. No hidden recipe labels in ingredient logic

Ingredient decomposition δεν πρέπει να περιέχει rules τύπου:

```text
if ingredient == butter and amount > 40:
    brioche += ...
```

Το Ingredient layer ξέρει μόνο composition και functionality.

Η canonical classification γίνεται αποκλειστικά στο Prototype layer.

---

# 132. Separation of concerns

Required module boundaries:

```text
IngredientCatalog
FormulaNormalization
CompositionEngine
MetricEngine
ProcessEngine
PrototypeCatalog
SimilarityEngine
ExplanationEngine
Validation
```

---

# 133. IngredientCatalog responsibility

Μόνο:

- canonical ingredients
- composition
- physical properties
- provenance
- confidence.

Δεν ταξινομεί formulas.

---

# 134. FormulaNormalization responsibility

Μόνο:

- grams
- baker's percentages
- flour denominator
- blend normalization.

---

# 135. CompositionEngine responsibility

Παράγει:

- water
- fat
- sugars
- protein subclasses
- starch
- fiber
- salt
- acidity inputs.

---

# 136. MetricEngine responsibility

Παράγει:

- hydration
- relative hydration
- enrichment
- gluten potential
- tenderness
- fluidity
- gas-related intrinsic metrics.

---

# 137. ProcessEngine responsibility

Μετατρέπει:

\[
IntrinsicMetrics
\rightarrow
EffectiveMetrics
\]

με βάση process.

---

# 138. PrototypeCatalog responsibility

Περιέχει:

- taxonomy
- category prototypes
- membership functions
- weights
- constraints
- versioning.

---

# 139. SimilarityEngine responsibility

Παράγει:

- family memberships
- named-product similarities
- process similarities
- overall identities
- unknown/hybrid decisions.

---

# 140. ExplanationEngine responsibility

Δεν κάνει νέα classification.

Μετατρέπει υπάρχον model evidence σε:

- supporting factors
- differences
- conflicts
- missing data.

---

# 141. Validation module responsibility

- datasets
- regression tests
- calibration
- confusion matrices
- counterfactual tests
- model comparisons.

---

# 142. V1 explicit non-goals

Δεν απαιτούνται για πρώτη έκδοση:

- machine learning
- neural networks
- LLM classification
- exact rheology simulation
- exact water activity calculation
- full fermentation kinetics
- exact Maillard kinetics
- oven heat-transfer simulation
- automatic recipe scraping
- exact sensory prediction.

---

# 143. V1 philosophy

Το V1 πρέπει να είναι:

```text
Deterministic
Explainable
Versioned
Calibratable
Extensible
Uncertainty-aware
```

και όχι:

```text
black-box
```

---

# 144. Canonical analysis result

```text
FormulaAnalysis
├── normalizedFormula
├── calculatedComposition
├── intrinsicMetrics
├── effectiveMetrics
├── structuralMemberships
├── canonicalSimilarities
├── confidence
├── diagnostics
├── explanations
└── modelVersion
```

---

# 145. Example final domain output

```text
Structural classification:
Highly Enriched Yeasted Gluten Dough

Calculated:
Total water: 59.8%
Total fat: 44.1%
Total sugars: 17.6%
Egg protein: 6.2%
Salt: 1.9%

Model:
Relative hydration: 0.94
Gluten potential: 86/100
Effective gluten: 78/100
Enrichment: 83/100
Tenderness: 74/100
Fluidity: 27/100

Leavening:
Yeast: high
Chemical: none
Mechanical: low
Steam: moderate

Closest canonical prototypes:
Brioche: 87%
Tsoureki: 72%
Challah: 59%

Brioche:
Composition similarity: 92%
Process similarity: 82%
Overall identity: 87%

Supporting factors:
- high butter load
- high egg content
- strong gluten structure
- yeast fermentation
- late butter incorporation

Differences:
- slightly lower sugar than central brioche range

Confidence:
82%

Missing data:
- flour W
- flour P/L
```

---

# 146. Central architectural principle

Η πιο σημαντική αρχιτεκτονική απόφαση όλου του συστήματος είναι:

\[
\boxed{
Named\ Ingredient
\not\rightarrow
Product
}
\]

Αλλά:

\[
\boxed{
Named\ Ingredient
\rightarrow
Functional\ Composition
}
\]

και:

\[
\boxed{
Functional\ Composition
+
Process
\rightarrow
Structural\ Behavior
}
\]

και μόνο μετά:

\[
\boxed{
Structural\ Behavior
\rightarrow
Prototype\ Similarity
}
\]

Αυτό επιτρέπει στο σύστημα να αναλύσει μελλοντικά ένα υλικό που σήμερα δεν γνωρίζουμε, αρκεί να ξέρουμε τη λειτουργική του σύνθεση.

---

# 147. Second central principle

\[
\boxed{
Formula \neq Product
}
\]

Το προϊόν προκύπτει από:

\[
\boxed{
Formula
+
Process
+
Thermal\ history
+
Geometry
}
\]

Γι' αυτό composition similarity και canonical identity παραμένουν ξεχωριστά.

---

# 148. Third central principle

Το σύστημα πρέπει να προτιμά:

> «Δεν έχω αρκετά δεδομένα.»

ή:

> «Δεν υπάρχει ισχυρό canonical match.»

αντί να δημιουργεί ψευδή βεβαιότητα.

---

# 149. Initial implementation milestone

Η πρώτη πλήρης vertical slice πρέπει να υποστηρίζει:

### Ingredients
- wheat flour
- water
- milk
- butter
- oil
- whole egg
- egg yolk
- egg white
- sugar
- salt
- yeast
- baking powder
- baking soda
- yogurt

### Families
- lean bread
- stiff bread
- enriched bread
- brioche
- shortbread
- cookie
- cake
- muffin
- pancake
- crêpe

### Process
- kneading
- minimal mixing
- creaming
- egg whipping
- late butter incorporation
- yeast fermentation

και να αποδεικνύει ότι ολόκληρο το architecture λειτουργεί end-to-end.

Μετά επεκτείνεται χωρίς αλλαγή του conceptual model.

---

# 150. Definition of Done for the domain model

Το domain model θεωρείται αρκετά σταθερό για implementation όταν:

1. Κάθε ingredient μπορεί να αναλυθεί σε functional composition χωρίς product-specific rules.
2. Flour base και baker's percentages είναι unambiguous.
3. Unknown values διαχωρίζονται από zero.
4. Calculated, estimated και heuristic values είναι ξεχωριστά.
5. Formula και Process είναι ανεξάρτητα μοντέλα.
6. Intrinsic και Effective metrics είναι ξεχωριστά.
7. Named products ορίζονται ως fuzzy prototypes.
8. Similarities δεν θεωρούνται probabilities.
9. Structural family και named-product identity είναι διαφορετικά.
10. Missing data μειώνουν confidence και όχι αυθαίρετα score.
11. Το σύστημα επιτρέπει Unknown και Hybrid output.
12. Όλες οι classification decisions είναι explainable.
13. Prototype definitions είναι versioned και calibratable.
14. Validation dataset είναι ανεξάρτητο από production formula logic.
15. Counterfactual tests μπορούν να εκτελεστούν χωρίς αλλαγή architecture.\n\n
