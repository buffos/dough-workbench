# Preparation Coverage Inventory v0.1

Status: approved planning baseline; pilot subset collected separately
Date: 2026-09-11

This is the planned universe of preparations we want the project to be able
to represent. It is deliberately broader than the first Gold release. Every
row has a stable preparation key, a primary navigation category, one canonical
primary structural-family ID, and a starting priority. The family ID answers
which mechanism primarily creates and stabilizes the structure; modifiers such
as enrichment or fat handling remain orthogonal metadata.

`planned` means “we want coverage”; it does not mean that a source, formula,
or Process record has been accepted. A preparation may later receive multiple
source records and variants without creating a second preparation key.

## 1. Yeasted breads — Ψωμιά με μαγιά

| Key | English preparation | Ελληνική ονομασία | Canonical structural family ID | Priority |
|---|---|---|---|---|
| `lean-white-loaf` | Lean white loaf | Απλό λευκό ψωμί | `family.fermented-gluten.lean-bread` | P0 |
| `country-loaf` | Country loaf | Χωριάτικο ψωμί | `family.fermented-gluten.lean-bread` | P0 |
| `baguette` | Baguette | Μπαγκέτα | `family.fermented-gluten.lean-bread` | P0 |
| `ciabatta` | Ciabatta | Τσιαπάτα | `family.fermented-gluten.high-hydration` | P0 |
| `focaccia` | Focaccia | Φοκάτσια | `family.fermented-gluten.flat` | P0 |
| `whole-wheat-loaf` | Whole-wheat loaf | Ψωμί ολικής άλεσης | `family.fermented-gluten.lean-bread` | P0 |
| `multigrain-loaf` | Multigrain loaf | Πολύσπορο ψωμί | `family.fermented-gluten.lean-bread` | P1 |
| `rye-wheat-loaf` | Rye-wheat loaf | Ψωμί σίκαλης και σιταριού | `family.fermented-gluten.lean-bread` | P1 |
| `potato-bread` | Potato bread | Πατατόψωμο | `family.fermented-gluten.soft-enriched` | P1 |
| `dinner-rolls` | Dinner rolls | Ψωμάκια φαγητού | `family.fermented-gluten.soft-enriched` | P0 |
| `hamburger-buns` | Hamburger buns | Ψωμάκια για burger | `family.fermented-gluten.soft-enriched` | P1 |
| `english-muffin` | English muffin | English muffin | `family.fermented-gluten.lean-bread` | P1 |
| `breadsticks` | Breadsticks / grissini | Κριτσίνια | `family.fermented-gluten.lean-bread` | P1 |
| `pretzel` | Soft pretzel | Μαλακό pretzel | `family.fermented-gluten.stiff` | P1 |

## 2. Naturally leavened breads — Ψωμιά με φυσικό προζύμι

| Key | English preparation | Ελληνική ονομασία | Canonical structural family ID | Priority |
|---|---|---|---|---|
| `sourdough-country-loaf` | Sourdough country loaf | Χωριάτικο ψωμί με φυσικό προζύμι | `family.fermented-gluten.lean-bread` | P0 |
| `sourdough-whole-wheat` | Whole-wheat sourdough | Ψωμί ολικής με φυσικό προζύμι | `family.fermented-gluten.lean-bread` | P0 |
| `sourdough-rye` | Rye sourdough | Ψωμί σίκαλης με φυσικό προζύμι | `family.fermented-gluten.lean-bread` | P1 |
| `sourdough-seeded` | Seeded sourdough | Ψωμί με σπόρους και φυσικό προζύμι | `family.fermented-gluten.lean-bread` | P1 |
| `sourdough-baguette` | Sourdough baguette | Μπαγκέτα με φυσικό προζύμι | `family.fermented-gluten.lean-bread` | P1 |
| `sourdough-ciabatta` | Sourdough ciabatta | Τσιαπάτα με φυσικό προζύμι | `family.fermented-gluten.high-hydration` | P1 |
| `sourdough-focaccia` | Sourdough focaccia | Φοκάτσια με φυσικό προζύμι | `family.fermented-gluten.flat` | P1 |
| `sourdough-pan-loaf` | Sourdough pan loaf | Ψωμί φόρμας με φυσικό προζύμι | `family.fermented-gluten.lean-bread` | P1 |

## 3. Enriched and sweet yeast doughs — Εμπλουτισμένες και γλυκές ζύμες

| Key | English preparation | Ελληνική ονομασία | Canonical structural family ID | Priority |
|---|---|---|---|---|
| `brioche` | Brioche | Μπριός | `family.fermented-gluten.rich-enriched` | P0 |
| `challah` | Challah | Χάλα | `family.fermented-gluten.rich-enriched` | P1 |
| `milk-bread` | Milk bread | Ψωμί γάλακτος | `family.fermented-gluten.soft-enriched` | P0 |
| `tangzhong-milk-bread` | Tangzhong milk bread | Ψωμί γάλακτος με tangzhong | `family.fermented-gluten.soft-enriched` | P1 |
| `cinnamon-roll` | Cinnamon roll | Ρολό κανέλας | `family.fermented-gluten.rich-enriched` | P0 |
| `sticky-bun` | Sticky bun | Sticky bun | `family.fermented-gluten.rich-enriched` | P1 |
| `babka` | Babka | Μπάμπκα | `family.fermented-gluten.rich-enriched` | P1 |
| `tsoureki` | Tsoureki | Τσουρέκι | `family.fermented-gluten.rich-enriched` | P0 |
| `cozonac` | Cozonac | Κοζονάκ | `family.fermented-gluten.rich-enriched` | P1 |
| `panettone` | Panettone | Πανετόνε | `family.fermented-gluten.rich-enriched` | P1 |
| `pandoro` | Pandoro | Παντόρο | `family.fermented-gluten.rich-enriched` | P1 |
| `stollen` | Stollen | Στόλεν | `family.fermented-gluten.rich-enriched` | P1 |
| `sweet-breakfast-bun` | Sweet breakfast bun | Γλυκό ψωμάκι πρωινού | `family.fermented-gluten.rich-enriched` | P1 |
| `yeast-doughnut` | Yeast doughnut | Ντόνατ με μαγιά | `family.fermented-gluten.rich-enriched` | P0 |

## 4. Laminated and viennoiserie doughs — Φυλλοποιημένες ζύμες

| Key | English preparation | Ελληνική ονομασία | Canonical structural family ID | Priority |
|---|---|---|---|---|
| `croissant` | Croissant | Κρουασάν | `family.laminated-gluten.fermented` | P0 |
| `sourdough-croissant` | Sourdough croissant | Κρουασάν με φυσικό προζύμι | `family.laminated-gluten.fermented` | P1 |
| `pain-au-chocolat` | Pain au chocolat | Pain au chocolat | `family.laminated-gluten.fermented` | P1 |
| `danish-pastry` | Danish pastry | Δανέζικο φύλλο | `family.laminated-gluten.fermented` | P1 |
| `kouign-amann` | Kouign-amann | Κουίν αμάν | `family.laminated-gluten.fermented` | P1 |
| `laminated-brioche` | Laminated brioche | Φυλλοποιημένο μπριός | `family.laminated-gluten.fermented` | P1 |
| `puff-pastry` | Puff pastry | Σφολιάτα | `family.laminated-gluten.unfermented` | P0 |
| `rough-puff-pastry` | Rough puff pastry | Γρήγορη σφολιάτα | `family.laminated-gluten.unfermented` | P1 |
| `inverse-puff-pastry` | Inverse puff pastry | Αντεστραμμένη σφολιάτα | `family.laminated-gluten.unfermented` | P1 |

## 5. Pizza and flatbreads — Pizza και επίπεδες ζύμες

| Key | English preparation | Ελληνική ονομασία | Canonical structural family ID | Priority |
|---|---|---|---|---|
| `neapolitan-pizza` | Neapolitan pizza | Ναπολιτάνικη pizza | `family.fermented-gluten.flat` | P0 |
| `new-york-pizza` | New York-style pizza | Pizza τύπου Νέας Υόρκης | `family.fermented-gluten.flat` | P0 |
| `roman-al-taglio` | Roman pizza al taglio | Ρωμαϊκή pizza al taglio | `family.fermented-gluten.flat` | P1 |
| `pinsa-romana` | Pinsa Romana | Pinsa Romana | `family.fermented-gluten.flat` | P1 |
| `pan-pizza` | Pan pizza | Pizza ταψιού | `family.fermented-gluten.flat` | P0 |
| `detroit-style-pizza` | Detroit-style pizza | Pizza τύπου Detroit | `family.fermented-gluten.flat` | P1 |
| `sicilian-pizza` | Sicilian pizza | Σικελική pizza | `family.fermented-gluten.flat` | P1 |
| `sourdough-pizza` | Sourdough pizza | Pizza με φυσικό προζύμι | `family.fermented-gluten.flat` | P1 |
| `pizza-bianca` | Pizza bianca | Pizza bianca | `family.fermented-gluten.flat` | P1 |
| `pita` | Pita bread | Πίτα | `family.fermented-gluten.flat` | P0 |
| `naan` | Naan | Naan | `family.fermented-gluten.flat` | P0 |
| `lavash` | Lavash | Λαβάς | `family.fermented-gluten.flat` | P1 |
| `manakish` | Manakish | Μανάκις | `family.fermented-gluten.flat` | P1 |
| `pide` | Pide | Πίδε | `family.fermented-gluten.flat` | P1 |
| `lahmacun` | Lahmacun dough | Ζύμη για λαχματζούν | `family.fermented-gluten.flat` | P1 |
| `flour-tortilla` | Flour tortilla | Τορτίγια αλευριού | `family.unleavened-gluten.flatbread` | P0 |
| `corn-tortilla` | Corn tortilla | Τορτίγια καλαμποκιού | `family.starch-dominant.rice-starch` | P1 |
| `paratha` | Paratha | Παράθα | `family.laminated-gluten.unfermented` | P1 |
| `roti-chapati` | Roti / chapati | Roti / chapati | `family.unleavened-gluten.flatbread` | P1 |

## 6. Pasta, noodle and wrapper doughs — Ζυμαρικά, noodles και φύλλα

| Key | English preparation | Ελληνική ονομασία | Canonical structural family ID | Priority |
|---|---|---|---|---|
| `fresh-egg-pasta` | Fresh egg pasta | Φρέσκα ζυμαρικά με αυγό | `family.unleavened-gluten.pasta-noodle` | P0 |
| `semolina-egg-pasta` | Semolina egg pasta | Ζυμαρικά σιμιγδαλιού με αυγό | `family.unleavened-gluten.pasta-noodle` | P1 |
| `water-flour-pasta` | Water-and-flour pasta | Ζυμαρικά με νερό και αλεύρι | `family.unleavened-gluten.pasta-noodle` | P1 |
| `lasagna-sheets` | Lasagna sheets | Φύλλα λαζάνια | `family.unleavened-gluten.pasta-noodle` | P0 |
| `tagliatelle` | Tagliatelle dough | Ζύμη για tagliatelle | `family.unleavened-gluten.pasta-noodle` | P1 |
| `ravioli-dough` | Ravioli dough | Ζύμη για ravioli | `family.unleavened-gluten.pasta-noodle` | P0 |
| `orecchiette` | Orecchiette dough | Ζύμη για orecchiette | `family.unleavened-gluten.pasta-noodle` | P1 |
| `cavatelli` | Cavatelli dough | Ζύμη για cavatelli | `family.unleavened-gluten.pasta-noodle` | P1 |
| `gnocchi-potato` | Potato gnocchi | Gnocchi πατάτας | `family.starch-dominant.potato` | P1 |
| `gnocchi-ricotta` | Ricotta gnocchi | Gnocchi ricotta | `family.starch-dominant.non-gluten-dumpling` | P1 |
| `spaetzle` | Spaetzle batter | Spaetzle | `family.unleavened-pourable.crepe` | P1 |
| `udon` | Udon dough | Ζύμη για udon | `family.unleavened-gluten.pasta-noodle` | P1 |
| `ramen` | Ramen dough | Ζύμη για ramen | `family.unleavened-gluten.pasta-noodle` | P1 |
| `soba` | Soba dough | Ζύμη για soba | `family.unleavened-gluten.pasta-noodle` | P1 |
| `dumpling-wrappers` | Dumpling wrappers | Φύλλα για dumplings | `family.unleavened-gluten.wrapper-dumpling` | P1 |
| `wonton-wrappers` | Wonton wrappers | Φύλλα για wonton | `family.unleavened-gluten.wrapper-dumpling` | P1 |

## 7. Pastry, pie, tart and cracker doughs — Ζύμες ζαχαροπλαστικής, πίτας και κράκερ

| Key | English preparation | Ελληνική ονομασία | Canonical structural family ID | Priority |
|---|---|---|---|---|
| `pate-brisee` | Pâte brisée | Pâte brisée | `family.short-fat-shortened.basic-shortcrust` | P0 |
| `pate-sucree` | Pâte sucrée | Pâte sucrée | `family.short-fat-shortened.sweet-shortcrust` | P0 |
| `pate-sablee` | Pâte sablée | Pâte sablée | `family.short-fat-shortened.sandy-sable` | P1 |
| `american-pie-dough` | American pie dough | Ζύμη για αμερικανική πίτα | `family.short-fat-shortened.basic-shortcrust` | P0 |
| `flaky-pie-dough` | Flaky pie dough | Φυλλώδης ζύμη πίτας | `family.short-fat-shortened.basic-shortcrust` | P1 |
| `hot-water-crust` | Hot-water crust | Ζύμη με καυτό νερό | `family.short-fat-shortened.basic-shortcrust` | P1 |
| `galette-dough` | Galette dough | Ζύμη για galette | `family.short-fat-shortened.basic-shortcrust` | P1 |
| `strudel-dough` | Strudel dough | Ζύμη για στρούντελ | `family.unleavened-gluten.wrapper-dumpling` | P1 |
| `phyllo-dough` | Phyllo dough | Φύλλο κρούστας | `family.laminated-gluten.unfermented` | P0 |
| `baklava-sheets` | Baklava sheets | Φύλλα για μπακλαβά | `family.laminated-gluten.unfermented` | P1 |
| `choux-pastry` | Choux pastry | Ζύμη choux | `family.steam-paste.choux` | P0 |
| `cracker-dough` | Cracker dough | Ζύμη για κράκερ | `family.short-fat-shortened.basic-shortcrust` | P1 |
| `shortbread` | Shortbread | Μπισκότο βουτύρου | `family.short-fat-shortened.shortbread` | P0 |
| `empanada-dough` | Empanada dough | Ζύμη για empanada | `family.short-fat-shortened.basic-shortcrust` | P1 |
| `savory-tart-dough` | Savory tart dough | Αλμυρή ζύμη τάρτας | `family.short-fat-shortened.basic-shortcrust` | P1 |

## 8. Cakes and quick breads — Κέικ και γρήγορα ψωμιά

| Key | English preparation | Ελληνική ονομασία | Canonical structural family ID | Priority |
|---|---|---|---|---|
| `butter-cake` | Butter cake | Κέικ βουτύρου | `family.chemical-cake.butter` | P0 |
| `pound-cake` | Pound cake | Pound cake | `family.chemical-cake.high-ratio` | P0 |
| `genoise` | Genoise sponge | Génoise | `family.foam-cake.whole-egg` | P1 |
| `sponge-cake` | Sponge cake | Αφράτο sponge cake | `family.foam-cake.whole-egg` | P0 |
| `chiffon-cake` | Chiffon cake | Chiffon cake | `family.foam-cake.hybrid` | P1 |
| `angel-food-cake` | Angel food cake | Angel food cake | `family.foam-cake.egg-white` | P1 |
| `carrot-cake` | Carrot cake | Κέικ καρότου | `family.chemical-cake.oil` | P1 |
| `banana-bread` | Banana bread | Banana bread | `family.quick-bread.quick-loaf` | P0 |
| `zucchini-bread` | Zucchini bread | Ψωμί κολοκυθιού | `family.quick-bread.quick-loaf` | P1 |
| `cornbread` | Cornbread | Ψωμί καλαμποκιού | `family.quick-bread.quick-loaf` | P1 |
| `muffin` | Muffin | Muffin | `family.quick-bread.muffin` | P0 |
| `cupcake` | Cupcake | Cupcake | `family.chemical-cake.butter` | P1 |
| `madeleine` | Madeleine | Madeleine | `family.chemical-cake.butter` | P1 |
| `financier` | Financier | Financier | `family.chemical-cake.butter` | P1 |
| `friand` | Friand | Friand | `family.chemical-cake.butter` | P1 |
| `bundt-cake` | Bundt cake | Bundt cake | `family.chemical-cake.butter` | P1 |
| `coffee-cake` | Coffee cake | Coffee cake | `family.chemical-cake.butter` | P1 |
| `brownie` | Brownie | Brownie | `family.chemical-cake.butter` | P0 |
| `blondie` | Blondie | Blondie | `family.chemical-cake.butter` | P1 |
| `tres-leches-cake` | Tres leches cake | Tres leches cake | `family.foam-cake.whole-egg` | P1 |
| `steamed-cake` | Steamed cake | Κέικ στον ατμό | `family.chemical-cake.butter` | P1 |

## 9. Pancakes, crêpes and waffles — Pancakes, κρέπες και waffles

| Key | English preparation | Ελληνική ονομασία | Canonical structural family ID | Priority |
|---|---|---|---|---|
| `crepe` | Crêpe | Κρέπα | `family.unleavened-pourable.crepe` | P0 |
| `buckwheat-galette` | Buckwheat galette | Γαλέτα φαγόπυρου | `family.unleavened-pourable.crepe` | P1 |
| `american-pancake` | American pancake | Αμερικανικό pancake | `family.chemical-pourable.pancake` | P0 |
| `buttermilk-pancake` | Buttermilk pancake | Pancake με buttermilk | `family.chemical-pourable.pancake` | P0 |
| `dutch-baby` | Dutch baby | Dutch baby | `family.chemical-pourable.pancake` | P1 |
| `blini` | Blini | Blini | `family.fermented-batter.lactic-mixed` | P1 |
| `belgian-waffle` | Belgian waffle | Βελγική βάφλα | `family.chemical-pourable.waffle` | P0 |
| `brussels-waffle` | Brussels waffle | Βάφλα Βρυξελλών | `family.fermented-batter.yeast` | P1 |
| `liege-waffle` | Liège waffle | Βάφλα Λιέγης | `family.fermented-gluten.rich-enriched` | P1 |
| `japanese-souffle-pancake` | Japanese soufflé pancake | Ιαπωνικό soufflé pancake | `family.chemical-pourable.pancake` | P1 |
| `yorkshire-pudding` | Yorkshire pudding | Yorkshire pudding | `family.unleavened-pourable.crepe` | P1 |
| `clafoutis` | Clafoutis | Clafoutis | `family.unleavened-pourable.crepe` | P1 |
| `okonomiyaki` | Okonomiyaki batter | Χυλός okonomiyaki | `family.chemical-pourable.pancake` | P1 |

## 10. Fried doughs and batters — Τηγανητές ζύμες και χυλοί

| Key | English preparation | Ελληνική ονομασία | Canonical structural family ID | Priority |
|---|---|---|---|---|
| `cake-doughnut` | Cake doughnut | Ντόνατ με διογκωτικά | `family.chemical-cake.butter` | P1 |
| `beignet` | Beignet | Beignet | `family.fermented-gluten.rich-enriched` | P1 |
| `churros` | Churros | Churros | `family.steam-paste.choux` | P0 |
| `loukoumades` | Loukoumades | Λουκουμάδες | `family.fermented-gluten.rich-enriched` | P0 |
| `zeppole` | Zeppole | Zeppole | `family.fermented-gluten.rich-enriched` | P1 |
| `funnel-cake` | Funnel cake | Funnel cake | `family.chemical-pourable.fritter-coating` | P1 |
| `fritter-batter` | Fritter batter | Χυλός για τηγανίτες/λουκουμάδες | `family.chemical-pourable.fritter-coating` | P1 |
| `tempura-batter` | Tempura batter | Χυλός tempura | `family.chemical-pourable.fritter-coating` | P1 |
| `pakora-batter` | Pakora batter | Χυλός pakora | `family.chemical-pourable.fritter-coating` | P1 |
| `onion-ring-batter` | Onion-ring batter | Χυλός για onion rings | `family.chemical-pourable.fritter-coating` | P1 |

## 11. Gluten-free and alternative doughs — Χωρίς γλουτένη και εναλλακτικές ζύμες

| Key | English preparation | Ελληνική ονομασία | Canonical structural family ID | Priority |
|---|---|---|---|---|
| `gluten-free-sandwich-loaf` | Gluten-free sandwich loaf | Ψωμί φόρμας χωρίς γλουτένη | `family.starch-dominant.rice-starch` | P0 |
| `gluten-free-focaccia` | Gluten-free focaccia | Focaccia χωρίς γλουτένη | `family.starch-dominant.rice-starch` | P1 |
| `gluten-free-pizza` | Gluten-free pizza | Pizza χωρίς γλουτένη | `family.starch-dominant.rice-starch` | P0 |
| `gluten-free-pasta` | Gluten-free pasta | Ζυμαρικά χωρίς γλουτένη | `family.starch-dominant.rice-starch` | P1 |
| `socca` | Socca | Socca | `family.starch-dominant.rice-starch` | P1 |
| `injera` | Injera | Injera | `family.fermented-batter.lactic-mixed` | P1 |
| `dosa` | Dosa | Dosa | `family.fermented-batter.lactic-mixed` | P1 |
| `idli` | Idli | Idli | `family.fermented-batter.lactic-mixed` | P1 |
| `appam` | Appam | Appam | `family.fermented-batter.lactic-mixed` | P1 |
| `arepa` | Arepa | Arepa | `family.starch-dominant.rice-starch` | P1 |
| `pupusa` | Pupusa | Pupusa | `family.starch-dominant.rice-starch` | P1 |
| `cassava-flatbread` | Cassava flatbread | Επίπεδη ζύμη από μανιόκα | `family.starch-dominant.rice-starch` | P1 |
| `almond-flour-cake` | Almond-flour cake | Κέικ με αλεύρι αμυγδάλου | `family.chemical-cake.butter` | P1 |
| `gluten-free-pancake` | Gluten-free pancake | Pancake χωρίς γλουτένη | `family.chemical-pourable.pancake` | P0 |
| `gluten-free-crepe` | Gluten-free crêpe | Κρέπα χωρίς γλουτένη | `family.unleavened-pourable.crepe` | P1 |

## Coverage rules for the next phase

- The inventory is a planning baseline, not a promise to publish one record
  for every row immediately.
- Every accepted record points to exactly one canonical preparation key and
  may carry one or more analytical family links only where the catalog contract
  supports that distinction.
- The pilot should sample 2–3 source-backed records per broad navigation
  category and must report which structural families remain unrepresented.
- Duplicates, aliases, regional names, and source-specific titles are resolved
  through preparation keys rather than by creating unbounded duplicate cards.
- Rows can be split or reclassified only through an explicit inventory revision;
  source records and published releases remain immutable.
