## Initial Prototype Catalog v0.1

Ο στόχος εδώ δεν είναι να ορίσουμε ακόμη τελικούς αριθμούς τύπου «brioche = 42–61% fat». Αυτοί πρέπει να βαθμονομηθούν με dataset. Θέλουμε όμως να ορίσουμε **ποια dimensions χαρακτηρίζουν κάθε κατηγορία, πόσο σημαντικά είναι και ποια είναι identity-critical**.

Θα χρησιμοποιήσω τέσσερα επίπεδα σημασίας:

* **C — Critical**: χωρίς αυτό δεν έχουμε ουσιαστικά canonical identity.
* **H — High**: πολύ ισχυρό χαρακτηριστικό.
* **M — Medium**: βοηθά σημαντικά.
* **L — Low**: χρήσιμο αλλά όχι καθοριστικό.

Και για τα quantitative dimensions προσωρινά qualitative ranges:

$$
VL < L < M < H < VH
$$

δηλαδή very low → very high.

---

# 1. Stiff Lean Yeast Dough

Parent:

$$
GlutenStructured \rightarrow StiffLeanDough
$$

Παραδείγματα:

* bagel
* pretzel
* κάποια stiff rolls.

### Prototype fingerprint

| Dimension          | Target         | Importance |
| ------------------ | -------------- | ---------- |
| Effective gluten   | High–Very High | C          |
| Relative hydration | Low            | H          |
| Fat                | Very Low       | M          |
| Sugar              | Very Low–Low   | M          |
| Enrichment         | Very Low       | H          |
| Fluidity           | Very Low       | H          |
| Yeast              | Present        | C          |
| Chemical leavening | None           | M          |
| Fermentation       | Present        | C          |

Structural identity:

$$
\boxed{
Strong\ gluten + low\ hydration + low\ enrichment + yeast
}
$$

---

# 2. Bagel

Child of Stiff Lean Dough.

### Identity-critical

* yeast fermentation
* strong gluten
* stiff dough
* characteristic shaping

### High-value features

* low hydration
* low fat
* low sugar
* high chew potential.

### Process-critical

Η χαρακτηριστική thermal treatment:

$$
\boxed{boil \rightarrow bake}
$$

είναι πολύ ισχυρό identity feature.

Άρα:

`BoilThenBake = true`

→ **C**

Χωρίς boiling:

* composition similarity μπορεί να είναι υψηλή,
* canonical bagel identity πρέπει να πέσει αισθητά.

---

# 3. Pretzel

Παρόμοιο compositionally με stiff bread.

Διαχωρίζεται περισσότερο από **surface process** παρά από ratios.

Critical/High:

* yeast → C
* stiff gluten dough → H
* alkaline surface treatment → C/H
* low enrichment → H

Άρα bagel και pretzel είναι καλό παράδειγμα όπου:

$$
CompositionSimilarity
$$

μόνο του **δεν αρκεί**.

---

# 4. Lean Bread Dough

Parent prototype:

| Dimension          | Target      | Importance |
| ------------------ | ----------- | ---------- |
| Effective gluten   | High        | C          |
| Relative hydration | Medium–High | H          |
| Fat                | Very Low    | H          |
| Sugar              | Very Low    | H          |
| Enrichment         | Very Low    | C          |
| Fluidity           | Low–Medium  | M          |
| Yeast/sourdough    | Present     | C          |
| Fermentation       | Present     | C          |

Fingerprint:

$$
\boxed{
Gluten + water + fermentation
}
$$

χωρίς σημαντική tenderization.

---

# 5. Baguette

Compositionally ανήκει καθαρά σε lean bread.

Key features:

| Feature                      | Importance |
| ---------------------------- | ---------- |
| Lean composition             | C          |
| Yeast/sourdough fermentation | C          |
| Medium-high hydration        | H          |
| Strong/extensible gluten     | H          |
| Long narrow geometry         | H          |
| Steam / crust process        | M-H        |
| High surface-to-volume ratio | H          |

Άρα δεν πρέπει να χαρακτηρίζεται baguette μόνο επειδή έχει:

100 flour / 70 water / 2 salt / yeast.

Αν ψηθεί ως μεγάλο καρβέλι:

> Lean bread similarity high
> Baguette canonical identity lower.

---

# 6. Country Bread

Broad prototype.

Χαρακτηρίζεται κυρίως από:

* lean composition,
* medium/high hydration,
* fermentation,
* loaf geometry.

Δεν χρειάζεται πολύ στενό named prototype.

Είναι χρήσιμο κυρίως σαν **fallback canonical class** μέσα στο LeanBread.

---

# 7. High-Hydration Bread

Εδώ το distinguishing feature είναι:

$$
RelativeHydration \gg normal
$$

με:

* high gluten potential,
* high fluidity για dough,
* fermentation.

Critical:

* high relative hydration → C
* gluten structure → C
* fermentation → C.

Examples μπορεί να περιλαμβάνουν ciabatta-like formulas, αλλά δεν θα τα εξισώσουμε ακόμη.

---

# 8. Pizza Dough

Εδώ χρειάζεται προσοχή γιατί υπάρχει τεράστια ποικιλία.

Parent:

`LeanBread`

Prototype dimensions:

| Feature               | Importance |
| --------------------- | ---------- |
| Gluten/extensibility  | C          |
| Yeast fermentation    | C          |
| Low enrichment        | H          |
| Medium hydration      | M-H        |
| High extensibility    | H          |
| Flat geometry         | C          |
| Very high baking heat | H          |

Το canonical identity εξαρτάται περισσότερο από:

$$
Dough + fermentation + geometry + thermal process
$$

παρά μόνο ratios.

Δεν θα επιχειρούσα στο V1 να ξεχωρίσω:

* Neapolitan,
* Roman,
* New York,
* Detroit κ.λπ.

---

# 9. Enriched Yeast Dough

Parent prototype:

| Dimension        | Target      | Importance |
| ---------------- | ----------- | ---------- |
| Effective gluten | Medium–High | C          |
| Enrichment       | Medium–High | C          |
| Fat              | Low–High    | H          |
| Sugar            | Low–Medium  | H          |
| Egg              | None–High   | M          |
| Yeast            | Present     | C          |
| Fermentation     | Present     | C          |
| Fluidity         | Low–Medium  | M          |

Το key distinction από cake:

$$
\boxed{
gluten\ network + fermentation
}
$$

παραμένει ο κύριος structural mechanism.

---

# 10. Soft Bread

Transition class μεταξύ lean και enriched.

Typical fingerprint:

* moderate gluten
* modest fat
* modest sugar
* yeast
* soft crumb
* low-to-medium enrichment.

Δεν θέλουμε υπερβολικά στενά boundaries.

Είναι σημαντική σαν **bridge class** ώστε το μοντέλο να μη μεταπηδά από lean bread κατευθείαν σε brioche.

---

# 11. Milk Bread

Soft Bread subtype.

Key distinguishing signals:

* dairy solids → H
* moderate enrichment → H
* soft fine crumb → H
* yeast → C
* strong enough gluten → H.

Named identity πρέπει να παραμένει broad, γιατί υπάρχουν πολλές τεχνικές.

Tangzhong/Yudane **δεν θα είναι required**.

Μπορούν αργότερα να είναι process modifiers.

---

# 12. Challah

Prototype:

| Dimension  | Target      | Importance |
| ---------- | ----------- | ---------- |
| Yeast      | Required    | C          |
| Gluten     | High        | C          |
| Egg        | Medium–High | H          |
| Fat        | Low–Medium  | H          |
| Sugar      | Low–Medium  | M-H        |
| Enrichment | Medium–High | H          |
| Lamination | No          | M          |

Σημαντικό:

Το fat source συχνά είναι oil rather than butter.

Άρα:

$$
LiquidFat
$$

έχει μεγαλύτερο compatibility από:

$$
PlasticButterDominance
$$

σε σχέση με brioche.

Named identity όμως δεν πρέπει να βασιστεί αποκλειστικά σε fat source.

---

# 13. Tsoureki

Εδώ πρέπει να είμαστε πιο προσεκτικοί.

Structural prototype:

$$
Highly\ Enriched\ Yeasted\ Gluten\ Dough
$$

Features:

* strong/extensible gluten → C
* yeast → C
* egg → H
* sugar → H
* fat → M-H
* characteristic fibrous/stringy structure → H
* aromatics → culturally important but **not structural**

Άρα θα έχουμε:

### Structural similarity

και ξεχωριστά:

### Cultural identity modifiers

όπως:

* mahlepi
* mastic
* characteristic braid/shape.

Δεν θέλω τα aromatics να μπουν στο structural classifier.

---

# 14. Brioche

Είναι από τα καλύτερα-defined prototypes.

### Composition

| Dimension          | Target         | Importance |
| ------------------ | -------------- | ---------- |
| Gluten potential   | High–Very High | C          |
| Effective gluten   | High           | C          |
| Fat                | Very High      | C          |
| Egg                | High           | H          |
| Sugar              | Low–Medium     | M-H        |
| Enrichment         | Very High      | C          |
| Relative hydration | Medium         | M          |
| Yeast              | Present        | C          |

### Process

| Feature                                                 | Importance |   |
| ------------------------------------------------------- | ---------- | - |
| Strong gluten development                               | C          |   |
| Yeast fermentation                                      | C          |   |
| Butter incorporation compatible with gluten development | H          |   |
| Lamination                                              | No         | M |

Brioche fingerprint:

$$
\boxed{
Strong\ gluten
+
very\ high\ butter
+
high\ egg
+
yeast
}
$$

---

# 15. Laminated Yeast Dough

Parent:

$$
GlutenStructured + Laminated
$$

Prototype:

* gluten → C
* lamination → C
* layer fat → C
* yeast → H/C depending subtype
* steam → H
* layer integrity → H.

---

# 16. Croissant

Identity-critical:

$$
\boxed{Lamination}
$$

και:

$$
YeastFermentation
$$

Features:

| Dimension           | Importance |   |
| ------------------- | ---------- | - |
| Gluten structure    | C          |   |
| Lamination          | C          |   |
| Layer fat           | C          |   |
| Yeast               | C          |   |
| Steam potential     | H          |   |
| Moderate enrichment | M          |   |
| Sugar               | Low        | M |
| Layer integrity     | H          |   |

Χωρίς lamination:

> croissant composition similarity ίσως μέτρια,
> process similarity σχεδόν μηδενική.

---

# 17. Danish

Παρόμοιο με croissant αλλά γενικά:

* περισσότερο enrichment,
* περισσότερο sugar/egg/fat,
* laminated + yeast.

Άρα differentiating dimensions:

$$
EI_{Danish}>EI_{Croissant}
$$

κατά μέσο όρο.

---

# 18. Fat-Shortened Systems

Parent prototype:

| Dimension                          | Target         | Importance |
| ---------------------------------- | -------------- | ---------- |
| Effective gluten                   | Very Low–Low   | C          |
| Fat                                | High–Very High | C          |
| Water                              | Low            | H          |
| Enrichment                         | Medium–High    | H          |
| Yeast                              | None           | H          |
| Fluidity                           | Very Low       | H          |
| Early fat coating / minimal mixing | Common         | H          |

Fingerprint:

$$
\boxed{
High\ fat
+
low\ water
+
suppressed\ gluten
}
$$

---

# 19. Shortcrust

* high fat → C
* low water → C
* low gluten → C
* low/moderate sugar → M
* minimal mixing → H.

Named identity relatively broad.

---

# 20. Pâte Sablée

Compared with generic shortcrust:

* more sugar
* often egg
* stronger tender/crumbly character.

Important dimensions:

* tenderness → H
* sugar → H
* fat → H
* gluten low → C.

---

# 21. Pâte Sucrée

Compared with sablée:

* sweet tart system,
* typically more structured,
* sugar high,
* fat high,
* egg often present.

Sablée ↔ sucrée distinction may not be robust enough for early V1 classification.

I would include both in taxonomy but initially mark:

$$
NamedProductConfidence = experimental
$$

until dataset calibration.

---

# 22. Shortbread

Excellent prototype:

| Dimension          | Target        | Importance |
| ------------------ | ------------- | ---------- |
| Fat                | Very High     | C          |
| Sugar              | Medium        | H          |
| Water              | Very Low      | C          |
| Egg                | None/Very Low | H          |
| Gluten development | Very Low      | C          |
| Leavening          | None          | H          |
| Fluidity           | Very Low      | H          |

Fingerprint:

$$
\boxed{
Flour + very\ high\ fat + sugar + almost\ no\ available\ water
}
$$

---

# 23. Cookie

Το cookie πρέπει να είναι **parent family**, όχι ένα prototype μόνο.

Για V1:

`CookieDough`

Broad features:

* fat high
* sugar high
* relatively low water
* gluten low/moderate
* chemical leavening optional
* spread possible.

Αργότερα subtypes:

* chewy
* crispy
* cakey
* short
* drop cookie.

Δεν θα τα βάλουμε τώρα.

---

# 24. Batter Systems

Parent:

* fluidity medium–very high
* gluten development low
* structural set primarily starch/protein,
* often chemical/mechanical leavening.

---

# 25. Cake — parent family

Key:

| Feature                      | Importance |   |
| ---------------------------- | ---------- | - |
| High sugar                   | H          |   |
| Medium-high fat              | H          |   |
| Egg proteins                 | H          |   |
| Starch/protein set           | C          |   |
| Low effective gluten         | C          |   |
| Batter fluidity              | Medium     | H |
| Chemical/mechanical aeration | H          |   |

Το cake πρέπει να είναι πρώτα broad structural family.

---

# 26. Butter Cake

Critical/high:

* plastic fat / butter → H
* creaming or related fat-based aeration → H
* high sugar → H
* egg → H
* chemical leavening often present → M-H
* low gluten → C.

Το creaming δεν πρέπει να είναι absolute requirement γιατί υπάρχουν reverse-creaming butter cakes.

Άρα:

$$
FatAerationProcess = compatible
$$

αντί `CreamingRequired=true`.

---

# 27. Oil Cake

Distinguishing signals:

* liquid fat dominance → H
* no plastic-fat creaming → H
* chemical leavening → H
* high moisture/tenderness → H
* low gluten → C.

Compositionally μπορεί να μοιάζει πολύ με butter cake.

Process + fat state βοηθούν στον διαχωρισμό.

---

# 28. Muffin

Prototype:

| Dimension          | Target      | Importance |
| ------------------ | ----------- | ---------- |
| Fluidity           | Medium-high | C          |
| Effective gluten   | Low         | C          |
| Chemical leavening | High        | C          |
| Fat                | Medium      | M          |
| Sugar              | Medium–High | M          |
| Egg                | Medium      | M          |
| Minimal mixing     | H           |            |
| Portion geometry   | M           |            |

Το **muffin method** είναι ισχυρό process feature αλλά όχι απόλυτο identity rule.

---

# 29. Pancake

Prototype:

* fluidity high → C
* chemical leavening → C/H
* low gluten → H
* fat low/moderate → M
* sugar low/moderate → L-M
* pan/griddle → C
* thin-to-medium geometry → H.

Fingerprint:

$$
\boxed{
Pourable\ chemically\ leavened\ batter
}
$$

---

# 30. Waffle

Composition overlaps strongly with pancake.

Distinguishing identity:

$$
\boxed{WaffleIronGeometry/ThermalProcess}
$$

→ C.

Often:

* somewhat higher fat,
* sometimes more sugar,
* crispness potential higher.

But appliance/geometry είναι πολύ πιο discriminative.

---

# 31. Crêpe

Very strong prototype:

| Dimension          | Target        | Importance |
| ------------------ | ------------- | ---------- |
| Fluidity           | Very High     | C          |
| Chemical leavening | None/Very Low | C          |
| Egg                | Medium–High   | H          |
| Fat                | Low           | M          |
| Sugar              | Very Low–Low  | L          |
| Gluten development | Low           | H          |
| Very thin geometry | C             |            |
| Pan/griddle        | H             |            |

Fingerprint:

$$
\boxed{
Very\ fluid
+
unleavened
+
thin
+
egg/starch\ set
}
$$

---

# 32. Foam-Structured Batters

Parent:

* mechanical aeration → C
* low effective gluten → C
* egg protein → H/C
* starch set → H
* chemical leavening variable.

---

# 33. Sponge Cake

Broad prototype:

* egg foam → C
* low fat → H
* low gluten → C
* sugar medium-high → H
* flour/starch structural support → H.

---

# 34. Genoise

Child of Sponge.

Identity-critical:

* whole egg whipping → C
* foam-based rise → C
* low/no chemical leavening → H
* some butter possible → M
* gentle folding → H.

Named distinction from sponge should remain relatively conservative.

---

# 35. Angel Food

Very strong prototype:

* egg white protein very high → C
* yolk/fat essentially absent → C
* whipped white foam → C
* sugar high → H
* low protein flour → H
* chemical leavening minimal/none → M-H.

---

# 36. Chiffon

Hybrid:

$$
FoamStructured + ChemicalLeavened
$$

Characteristics:

* oil → H
* egg yolk + whites → H
* whipped whites → C
* chemical leavener → H
* high hydration → M-H.

Άρα είναι καλό test για multi-label structural membership.

---

# 37. Steam-Dominant Systems

Parent prototype:

* high available water → C
* strong thermal steam generation → C
* sufficient setting capacity → C
* yeast/chemical leavening not necessary.

---

# 38. Choux

Excellent canonical prototype.

Features:

| Dimension               | Importance |   |
| ----------------------- | ---------- | - |
| High water              | C          |   |
| High egg                | C          |   |
| Fat medium-high         | H          |   |
| Pre-cooked starch paste | C          |   |
| Steam leavening         | C          |   |
| Yeast                   | None       | H |
| Chemical leavening      | None/low   | H |
| Egg/starch setting      | C          |   |

Το **pre-cooking stage** είναι identity-critical.

Χωρίς αυτό:

> composition may be choux-like, canonical identity low.

---

# 39. Ποια dimensions τελικά χρειάζεται ο V1 classifier;

Με βάση όλα τα prototypes, μπορούμε πλέον να μειώσουμε τα dimensions στα πραγματικά discriminative.

### Composition dimensions

1. Relative hydration
2. Total fat
3. Liquid-fat fraction
4. Plastic/solid-fat fraction
5. Total sugar
6. Egg solids / egg protein
7. Gluten potential
8. Effective gluten
9. Enrichment
10. Fluidity

### Leavening dimensions

11. Yeast
12. Chemical
13. Mechanical foam
14. Steam

### Process dimensions

15. Mixing/gluten development
16. Fat incorporation mode
17. Lamination
18. Foam method
19. Fermentation
20. Pre-cooked starch
21. Special surface process

### Thermal/geometry

22. Thin vs thick geometry
23. Pan/griddle vs oven
24. Boil-before-bake
25. Waffle iron / specific containment where relevant.

Αυτό είναι ένα πολύ λογικό initial feature space.

---

# 40. Τι ΔΕΝ πρέπει να έχει μεγάλο weight στο V1

Δεν θα έδινα ακόμη μεγάλο discriminative βάρος σε:

* exact sweetness equivalent,
* reducing sugar load,
* browning potential,
* staling resistance,
* exact acid balance,

για **product-family classification**.

Είναι πολύ χρήσιμα για outcome/diagnostics, αλλά όχι τόσο για να ξεχωρίσουμε bread από cake.

Αυτό είναι σημαντικό simplification.

---

# 41. Prototype inheritance

Τώρα μπορούμε να ορίσουμε καθαρά inheritance.

Παράδειγμα:

### EnrichedYeastDough

κληρονομεί:

* gluten structured
* fermented
* low/medium fluidity.

### Brioche

κληρονομεί όλα τα παραπάνω και προσθέτει:

* very high fat
* high egg
* very high enrichment.

### Challah

κληρονομεί:

* enriched yeast
* high egg

αλλά έχει:

* lower fat,
* more liquid-fat compatibility.

Αυτό κάνει το model πολύ πιο maintainable.

---

# 42. Structural constraints vs cultural modifiers

Θα εισήγαγα επίσημα δύο κατηγορίες prototype features:

### StructuralFeature

Επηρεάζει πραγματικά:

* dough physics
* leavening
* setting
* processing.

### IdentityModifier

Π.χ.:

* mahlepi στο tsoureki
* characteristic shape
* traditional surface treatment.

Έτσι μπορούμε να πούμε:

> Structural similarity to tsoureki-family: 84%
> Traditional identity compatibility: 52%.

Αυτό είναι πολύ καθαρότερο.

---

# 43. Prototype confidence levels

Δεν είναι όλες οι κατηγορίες εξίσου εύκολο να οριστούν.

Θα τις χαρακτήριζα αρχικά:

### High prototype confidence

* lean bread
* brioche
* shortbread
* pancake
* crêpe
* angel food
* choux
* croissant

### Medium

* challah
* muffin
* butter cake
* oil cake
* genoise
* milk bread

### Lower / calibration-heavy

* country bread
* tsoureki as named identity
* sablée vs sucrée
* generic cookie.

Αυτό μας λέει πού πρέπει να επενδύσουμε περισσότερο dataset work.

---

# 44. Initial family-level gating

Πριν named-product matching, μπορούμε να έχουμε broad gates.

Conceptually:

### Gluten dough candidate

High:

$$
EGI + fermentation
$$

Low:

$$
Fluidity
$$

### Batter candidate

High:

$$
Fluidity
$$

Low:

$$
EGI
$$

### Short-system candidate

High:

$$
Fat
$$

Low:

$$
Water + EGI
$$

### Foam candidate

High:

$$
MechanicalAeration + EggProtein
$$

### Laminated candidate

$$
Lamination=true
$$

### Steam-dominant candidate

$$
SteamPotential + SettingCapacity
$$

Αυτά δεν θα είναι hard `if` statements, αλλά broad memberships.

---

# 45. Ένα πολύ σημαντικό design decision

Το named-product classifier **δεν πρέπει να δέχεται raw ingredients**.

Θα δέχεται μόνο:

$$
EffectiveMetrics + ProcessFeatures
$$

Δηλαδή δεν θα υπάρχει:

```text id="rf6z0i"
if ingredient == egg:
   brioche += 10
```

αλλά:

```text id="ezy6jj"
eggStructuralLoad = 42
fatLoad = 48
effectiveGluten = 81
...
```

Αυτό διατηρεί καθαρή τη domain architecture.

---

# 46. Τι έχουμε πλέον κλειδώσει

Έχουμε πλέον:

* hierarchy,
* prototype inheritance,
* discriminative feature set,
* identity-critical features,
* process-critical features,
* structural vs cultural identity,
* relative feature importance,
* high/medium/low-confidence prototypes.

Δεν έχουμε ακόμη βάλει ψεύτικους numeric boundaries.

Αυτό είναι σκόπιμο.

\n\n
