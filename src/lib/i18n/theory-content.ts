import type { Locale } from './messages';

export interface TheoryBlock {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface TheoryTable {
  caption: string;
  columns: string[];
  rows: string[][];
  note?: string;
}

export interface TheoryCallout {
  label: string;
  body: string;
}

export interface TheoryChapter {
  id: string;
  number: number;
  eyebrow: string;
  title: string;
  intro: string;
  blocks: TheoryBlock[];
  table?: TheoryTable;
  callout?: TheoryCallout;
}

export interface TheoryContent {
  eyebrow: string;
  title: string;
  intro: string;
  backToWorkspace: string;
  contentsTitle: string;
  sourceNote: string;
  sourceLabel: string;
  chapterLabel: string;
  tableLabel: string;
  noteLabel: string;
  chapters: TheoryChapter[];
}

export const THEORY_CONTENT: Record<Locale, TheoryContent> = {
  en: {
    eyebrow: 'THEORY / INGREDIENTS & STRUCTURE',
    title: 'What each ingredient does to the dough.',
    intro: 'Read a dough from the inside out: structure, water, gas, texture, and the process that brings them together. These chapters turn a recipe into a model you can reason about.',
    backToWorkspace: 'Back to workspace',
    contentsTitle: 'On this page',
    sourceNote: 'Rewritten from the 14 internal theory notes in exploration/theory. The ranges are practical guides, not hard boundaries or calibrated predictions.',
    sourceLabel: 'Internal theory notes',
    chapterLabel: 'Chapter',
    tableLabel: 'Reference table',
    noteLabel: 'Keep in mind',
    chapters: [
      {
        id: 'introduction',
        number: 1,
        eyebrow: '01 / THE BIG PICTURE',
        title: 'A dough is a system, not a list of ingredients',
        intro: 'The same ingredient can play a different role in a bread, a brioche, a cookie, or a pancake. The useful question is not only what is present, but what job each part is doing.',
        blocks: [
          {
            title: 'Start with the structure',
            paragraphs: ['Classify the result by how it behaves: does it stretch, hold gas, spread, form layers, or set into a crumb? Names such as bread, cake, or cookie are useful labels, but the underlying structure explains more.'],
            bullets: ['Stiff and elastic doughs', 'Lean and enriched yeast doughs', 'Short doughs and cookies', 'Thick or pourable batters', 'Foams built around whipped eggs'],
          },
          {
            title: 'Give every ingredient a function',
            paragraphs: ['Ingredients can build structure, provide or bind water, soften the bite, create or retain gas, or help the mixture set during baking. One ingredient can appear in several of these groups at once.'],
            bullets: ['Structure builders: gluten, egg proteins, starch', 'Liquids and hydration: water, milk, egg, yogurt', 'Tenderizers: fat, sugar, yolk', 'Aeration: yeast, chemical leaveners, whipped egg, creaming', 'Setting: starch gelatinization, protein coagulation, crust formation'],
          },
          {
            title: 'The question behind the model',
            paragraphs: ['A useful reading asks how much gas can be created, how far the mass can expand, and whether the structure will set before it collapses. That is why formula and process are kept as separate but connected parts of the workspace.'],
          },
        ],
        callout: {
          label: 'Working model',
          body: 'Final product = Formula + Mixing method + Temperature + Time. The formula creates potential; the process decides how much of that potential becomes visible.',
        },
      },
      {
        id: 'bakers-percentages',
        number: 2,
        eyebrow: '02 / THE COMMON LANGUAGE',
        title: 'Baker’s percentages and available water',
        intro: 'Baker’s percentages let us compare formulas at different batch sizes. Looking at available water goes one step further: it asks how much water the ingredients actually bring into the mixture.',
        blocks: [
          {
            title: 'Flour is the 100% reference',
            paragraphs: ['Add all flour masses and call that total 100%. Every other ingredient is expressed relative to it. With 500 g flour, 325 g water is 65%, 10 g salt is 2%, and 5 g yeast is 1%. The same relationships remain true if the batch is doubled or halved.'],
          },
          {
            title: 'Nominal hydration is not the whole picture',
            paragraphs: ['Nominal hydration counts only the water that was poured in as water. Available-water hydration also estimates the water contained in milk, egg, yogurt, butter, honey, or fruit purée. It is an estimate of composition, not a promise that two formulas will feel identical.'],
            bullets: ['Total water: water from all relevant ingredients', 'Estimated available water: the portion expected to be usable by the mixture', 'Available-water hydration: estimated available water divided by total flour'],
          },
          {
            title: 'A formula can hide its water',
            paragraphs: ['For example, 200 g milk contributes about 174 g water, 100 g whole egg about 75 g, and 50 g butter about 8 g. Together with 400 g flour, that is roughly 257 g water, or about 64% hydration based on estimated available water. With sugar and fat also present, the result reads as an enriched dough, not as lean bread.'],
          },
        ],
        table: {
          caption: 'Approximate water content of common ingredients',
          columns: ['Ingredient', 'Water estimate'],
          rows: [
            ['Water', '100%'],
            ['Whole milk', 'about 87%'],
            ['Whole egg', 'about 74–76%'],
            ['Egg white', 'about 88–90%'],
            ['Yolk', 'about 48–50%'],
            ['Butter', 'about 15–18%'],
            ['Honey', 'about 17–20%'],
            ['35% cream', 'about 58–60%'],
          ],
          note: 'The values are composition estimates. The analyzer keeps unknown composition separate instead of silently treating it as zero.',
        },
      },
      {
        id: 'flour-and-water',
        number: 3,
        eyebrow: '03 / MOBILITY & GLUTEN',
        title: 'Flour and water: what hydration changes',
        intro: 'Water does more than make flour wet. It gives proteins and starch enough mobility to create the structure that later holds shape and gas.',
        blocks: [
          {
            title: 'Two kinds of movement in gluten',
            paragraphs: ['Gliadin contributes extensibility: the ability to stretch. Glutenin contributes elasticity: the tendency to resist and return. A dough that is too elastic keeps shrinking; one that is too extensible may spread and lose its shape.'],
            bullets: ['Elasticity: resistance and spring-back', 'Extensibility: stretch without immediate tearing', 'Good handling depends on the balance, not on maximizing either one'],
          },
          {
            title: 'Hydration changes the handling window',
            paragraphs: ['At roughly 40–50% hydration, a dough is firm and shape-holding. Around 55–65%, it becomes easier to develop and usually keeps a useful balance. Around 70–80%, it is softer, stickier, and capable of a more open crumb when the flour and process can support it. Above that, handling becomes increasingly dependent on folds, time, and flour strength.'],
          },
          {
            title: 'Water needs time and movement',
            paragraphs: ['Resting allows the flour to hydrate. Kneading aligns proteins and develops the network. Folds strengthen a wet dough with gentler handling. Temperature also changes mobility: a warmer dough feels softer and ferments faster. Too much mechanical work can heat and weaken the dough instead of improving it.'],
          },
        ],
        callout: {
          label: 'A simple experiment',
          body: 'Make five small samples with the same flour and 45%, 55%, 65%, 75%, and 85% water. After mixing and again after a 30-minute rest, compare resistance, stickiness, spread, and stretch. Hydration becomes much easier to understand when you can feel the change.',
        },
      },
      {
        id: 'flour',
        number: 4,
        eyebrow: '04 / THE STRUCTURAL BASE',
        title: 'Flour: protein, strength, and type',
        intro: 'There is no universally good flour. There is flour that is suitable for the structure, hydration, fermentation time, and tenderness you want.',
        blocks: [
          {
            title: 'Protein is only the beginning',
            paragraphs: ['A label such as 12.5% protein tells us how much protein is present, not exactly how that protein behaves. Variety, milling, starch damage, enzyme activity, and the balance between gliadin and glutenin all affect the final dough.'],
          },
          {
            title: 'Strength is a wider idea',
            paragraphs: ['In baking data, W is commonly used as a rough indicator of the energy a flour can absorb before breaking, while P/L describes the balance between resistance and extensibility. A stronger flour can usually tolerate more water, longer fermentation, gas, and the load of sugar or fat.'],
            bullets: ['Lower protein and strength: cakes, biscuits, tender cookies', 'Medium strength: general-purpose formulas and some batters', 'Higher strength: bread, pizza, long fermentation, brioche', 'Very high strength: formulas with long maturation or heavy enrichment'],
          },
          {
            title: 'Type and whole grain change the picture',
            paragraphs: ['Labels such as 00, 0, 1, or 2 describe extraction and milling conventions, not a single strength level. Bran and germ add fiber and minerals, absorb water, and can interrupt the gluten network. Damaged starch can also increase water demand. So the same nominal hydration may need adjustment from flour to flour.'],
          },
        ],
        table: {
          caption: 'A practical starting map',
          columns: ['Goal', 'Typical flour direction'],
          rows: [
            ['Sponge or tender cake', 'Low strength'],
            ['Cookie', 'Low to medium strength'],
            ['Crêpe or pancake', 'Medium; less critical'],
            ['Bread', 'Medium to strong'],
            ['Pizza with long fermentation', 'Strong and fermentation-tolerant'],
            ['Brioche or panettone-style dough', 'Strong to very strong'],
          ],
        },
        callout: {
          label: 'Read the pair',
          body: 'Hydration without flour strength is incomplete information. A useful expectation always combines the two: flour strength × hydration.',
        },
      },
      {
        id: 'salt',
        number: 5,
        eyebrow: '05 / CONTROL & FLAVOR',
        title: 'Salt: a small amount with a large effect',
        intro: 'Salt seasons the dough, but it also changes gluten strength, water movement, and fermentation speed. In bread formulas it is often around 1.8–2.2% of flour.',
        blocks: [
          {
            title: 'It tightens the network',
            paragraphs: ['Salt makes a dough more cohesive, slightly firmer, and more elastic. Without it, the same dough tends to feel slack and sticky. This is a structural effect, not just a flavor adjustment.'],
          },
          {
            title: 'It slows fermentation',
            paragraphs: ['Salt reduces the speed at which yeast activity proceeds. That restraint is useful: a slower, more controlled fermentation gives more time for flavor development and makes the dough easier to manage.'],
            bullets: ['Around 1%: mild seasoning and faster activity', 'Around 1.5–2%: common balanced range for bread', 'Around 2.5%: firmer, slower, and noticeably saltier', 'Too much: tight handling, weak extensibility, and excessive saltiness'],
          },
          {
            title: 'Timing matters, but the myth is too simple',
            paragraphs: ['Salt can be kept apart from concentrated fresh yeast for a while, especially during a pre-hydration or autolyse. A brief contact does not magically kill the yeast; the practical concern is prolonged direct contact in a concentrated mixture.'],
          },
        ],
        callout: {
          label: 'The behavior equation grows',
          body: 'Dough behavior depends on flour strength, hydration, salt, mixing, time, and temperature. No single percentage explains the result on its own.',
        },
      },
      {
        id: 'yeast-and-fermentation',
        number: 6,
        eyebrow: '06 / GAS & TIME',
        title: 'Yeast and fermentation',
        intro: 'Yeast creates carbon dioxide, alcohol, and aroma compounds. The gas expands inside a structure that the flour has built; yeast does not create that structure by itself.',
        blocks: [
          {
            title: 'Amount controls speed more than final height',
            paragraphs: ['Flour contains enzymes that make some sugars available even when no table sugar is added. More yeast usually means faster activity; less yeast can produce the same broad expansion when time and temperature are adjusted. The flavor and handling will not be the same.'],
            bullets: ['Instant and active dry yeast are used in different ways', 'Fresh yeast is commonly used at roughly three times the mass of instant yeast', 'Very small yeast percentages suit long or cold fermentation', 'Higher amounts suit faster schedules, but do not guarantee more volume'],
          },
          {
            title: 'Temperature and time are one system',
            paragraphs: ['Cold conditions slow fermentation; a moderate room temperature accelerates it; excessive heat stresses the yeast. The useful target is not simply a clock time but a desired state of the dough, influenced by yeast, sugar, salt, hydration, flour strength, and temperature.'],
          },
          {
            title: 'Bulk, proof, and oven spring',
            paragraphs: ['Bulk fermentation is the first rise while the dough is still one mass. Proofing is the final rise after dividing or shaping. Underproofed dough has not built enough gas and may split; overproofed dough can lose strength and spread. In the oven, existing gas expands, steam forms, and fermentation continues briefly until heat sets the structure.'],
          },
        ],
        callout: {
          label: 'Same formula, different fermentation',
          body: 'A pizza dough with 1% yeast for 2–3 warm hours and the same dough with 0.1% yeast for 24–48 cold hours can differ in aroma, extensibility, opening behavior, and finished character.',
        },
      },
      {
        id: 'sugar',
        number: 7,
        eyebrow: '07 / WATER, TEXTURE & COLOR',
        title: 'Sugar: more than sweetness',
        intro: 'Sugar binds water, softens the bite, changes yeast activity, delays setting, and promotes browning. As its percentage rises, a bread formula can move toward enriched dough, cake, or cookie behavior.',
        blocks: [
          {
            title: 'It competes for water',
            paragraphs: ['Sugar attracts water that could otherwise hydrate flour proteins. That can reduce gluten development and make a dough feel softer or more tender, even when the water percentage on paper has not changed.'],
            bullets: ['0–5%: lean bread territory', '5–20%: lightly to moderately enriched doughs', '20–40%: clearly sweet enriched doughs', '50% and above: cake or cookie behavior becomes more likely'],
          },
          {
            title: 'It changes softness and shelf life',
            paragraphs: ['Because sugar holds moisture, sweet baked goods often stay soft longer and stale more slowly. It also slows yeast when present in larger amounts, so the formula may need more time, a different yeast, or a different process.'],
          },
          {
            title: 'It changes the bake',
            paragraphs: ['Sugar contributes to caramelization and Maillard browning. In cookies it melts and delays setting, allowing more spread. Different sugars are not interchangeable: fructose, glucose, honey, syrups, and brown sugar differ in water binding, sweetness, browning, and crystallization.'],
          },
        ],
        callout: {
          label: 'Read sugar as a modifier',
          body: 'In a formula, sugar is simultaneously a sweetener, tenderizer, water-binding ingredient, browning agent, and fermentation modifier.',
        },
      },
      {
        id: 'fat',
        number: 8,
        eyebrow: '08 / TENDERNESS & LAYERS',
        title: 'Fat: why it tenderizes and changes structure',
        intro: 'Fat limits the contact between flour proteins, so it can shorten gluten development, soften the bite, and change how air and layers are formed. Its physical state and timing matter as much as its mass.',
        blocks: [
          {
            title: 'Oil and butter are not equivalent',
            paragraphs: ['Oil is almost entirely fat. Butter contains roughly 80–82% fat, 15–18% water, and milk solids. Replacing one with the other changes both the fat amount and the water balance, as well as whether the formula can cream or laminate the fat.'],
          },
          {
            title: 'Three useful states of butter',
            paragraphs: ['Soft plastic butter can hold air during creaming. Melted butter mainly lubricates and tenderizes, often giving a denser or moister result. Cold solid butter creates discontinuities and layers; its water turns to steam while the fat keeps layers from bonding completely.'],
            bullets: ['Creamed butter: aeration in cakes and cookies', 'Melted butter: richness and tenderness', 'Cold butter: flakes, layers, and lamination'],
          },
          {
            title: 'Brioche shows the timing effect',
            paragraphs: ['In brioche, flour, liquid, and yeast are often mixed enough to develop gluten before butter is added gradually. A strong flour and controlled temperature help the network carry the enrichment. If the butter melts into the dough too early, the dough can become greasy, slack, and difficult to strengthen.'],
          },
        ],
        callout: {
          label: 'The four roles of fat',
          body: 'Tenderization + gluten inhibition + aeration or layering + moisture and mouthfeel. The same butter can create a different product when its temperature or technique changes.',
        },
      },
      {
        id: 'eggs',
        number: 9,
        eyebrow: '09 / WATER, PROTEIN & FOAM',
        title: 'Eggs: several ingredients in one',
        intro: 'An egg brings water, protein, fat, emulsifiers, foaming ability, color, and flavor. That is why replacing an egg with an equal mass of water rarely preserves the behavior of the formula.',
        blocks: [
          {
            title: 'White and yolk do different work',
            paragraphs: ['A whole egg is roughly 74–76% water, 12–13% protein, and 10–11% fat. The white is mostly water and protein; the yolk contains more fat, emulsifying phospholipids, and a richer color. They are not interchangeable halves of the same ingredient.'],
            bullets: ['More white: water plus a firmer protein set', 'More yolk: fat, emulsification, tenderness, and richness', 'Whole egg: a balance of structure, water, fat, and color'],
          },
          {
            title: 'Eggs can build or stabilize a structure',
            paragraphs: ['Egg proteins coagulate during baking and help set a crumb. Lecithin helps water and fat stay dispersed. Whipped egg traps air before baking; that air expands, then egg proteins and starch set around it. In a crêpe, the egg mainly binds and sets a thin sheet rather than acting as a leavener.'],
          },
          {
            title: 'Technique decides which role dominates',
            paragraphs: ['A clean bowl matters when whipping whites because fat interferes with foam. Sugar can slow foam formation but stabilize the finished foam. Warm eggs often whip more easily. For reliable formulas, weigh eggs in grams rather than counting “two eggs”, because size and white-to-yolk ratio vary.'],
          },
        ],
        table: {
          caption: 'Approximate composition by part',
          columns: ['Part', 'Water', 'Protein', 'Fat'],
          rows: [
            ['Whole egg', '74–76%', '12–13%', '10–11%'],
            ['White', '88–90%', '10–11%', 'Almost none'],
            ['Yolk', '48–50%', '16–17%', '32–34%'],
          ],
        },
        callout: {
          label: 'One egg, different dominant role',
          body: 'In brioche it enriches and emulsifies; in a sponge it helps create foam; in a crêpe it helps bind and set. Function depends on the whole formula and process.',
        },
      },
      {
        id: 'dairy',
        number: 10,
        eyebrow: '10 / LIQUIDS WITH SOLIDS',
        title: 'Milk, yogurt, buttermilk, cream, and other dairy',
        intro: 'Dairy is not simply water with flavor. It can add water, protein, fat, lactose, minerals, and acidity at the same time.',
        blocks: [
          {
            title: 'The liquid brings a package of functions',
            paragraphs: ['Milk proteins contribute to structure and water retention. Lactose supports browning but is not fermented by ordinary baker’s yeast in the same way as simple sugars. Fat tenderizes. Acidity changes protein behavior, flavor, and the balance of chemical leavening.'],
          },
          {
            title: 'Yogurt and buttermilk behave differently',
            paragraphs: ['Buttermilk is relatively fluid and mostly water with acidity. Yogurt contains more solids and is usually thicker, with less freely available water. Strained yogurt concentrates solids further. So equal masses can give different viscosity and different hydration estimates even when the nominal liquid amount is identical.'],
            bullets: ['Milk: hydration plus protein, lactose, and some fat', 'Buttermilk: fluid hydration plus lactic acidity', 'Yogurt: thicker body, solids, protein, and acidity', 'Cream: much more fat and less water', 'Milk powder: milk solids without much extra water'],
          },
          {
            title: 'Acidity can be functional',
            paragraphs: ['Yogurt, buttermilk, sour cream, citrus, vinegar, and natural cocoa can react with baking soda. Too much soda leaves a soapy or metallic taste and can over-darken the bake. Sometimes baking powder provides the main lift while a smaller soda amount balances acidity.'],
          },
        ],
        table: {
          caption: 'A practical comparison',
          columns: ['Ingredient', 'Dominant contribution'],
          rows: [
            ['Water', 'Clean hydration'],
            ['Milk', 'Hydration, tenderness, and browning'],
            ['Buttermilk', 'Hydration and acidity'],
            ['Yogurt', 'Solids, protein, acidity, and less free water'],
            ['Cream', 'High fat with relatively less water'],
            ['Milk powder', 'Milk solids without much extra liquid'],
          ],
        },
      },
      {
        id: 'chemical-leavening',
        number: 11,
        eyebrow: '11 / CHEMICAL LEAVENING',
        title: 'Baking soda, baking powder, and chemical lift',
        intro: 'Chemical leavening produces carbon dioxide through an acid–base reaction. It is a different mechanism from yeast fermentation and it must be balanced with the structure that will hold the gas.',
        blocks: [
          {
            title: 'Soda needs an acid partner',
            paragraphs: ['Baking soda is a base. It reacts with an acid such as yogurt, buttermilk, sour cream, lemon juice, vinegar, molasses, or natural cocoa. The amount cannot be chosen reliably from flour mass alone because the available acidity varies.'],
          },
          {
            title: 'Baking powder carries its own system',
            paragraphs: ['Baking powder contains a base, one or more dry acids, and a carrier such as starch. Single-acting powder reacts mainly when moistened; double-acting powder reacts in stages, including during heating. That makes it a common main leavener for cakes, muffins, and pancakes.'],
            bullets: ['Too little: low volume and dense crumb', 'Too much: oversized bubbles, off-flavor, and collapse', 'Soda plus powder: acidity correction plus additional lift', 'Soda can also increase cookie spread and browning'],
          },
          {
            title: 'Gas is only half the problem',
            paragraphs: ['A batter needs enough time for bubbles to expand but enough strength to set around them. Egg proteins, flour proteins, and gelatinized starch provide that setting. Other lift mechanisms include yeast, whipped egg or creaming, and steam. More leavener does not automatically mean more final volume.'],
          },
        ],
        callout: {
          label: 'The useful distinction',
          body: 'Soda = base + available acid. Baking powder = a prepared acid–base system. Both still need the right moisture, heat, and setting structure.',
        },
      },
      {
        id: 'mixing-techniques',
        number: 12,
        eyebrow: '12 / PROCESS CHANGES FUNCTION',
        title: 'Mixing techniques: the method is part of the formula',
        intro: 'Two formulas with the same masses can produce different products because mixing controls gluten development, trapped air, fat distribution, and layers.',
        blocks: [
          {
            title: 'Choose the structure you need',
            paragraphs: ['Kneading develops a continuous gluten network for bread, pizza, bagels, and brioche. Folding strengthens a wet dough over time with less heating. Muffin mixing combines wet and dry ingredients quickly to limit gluten.'],
            bullets: ['Kneading: strength and gas retention', 'Stretch and fold: structure with gentle handling', 'Muffin method: tender crumb with limited gluten', 'Reverse creaming: fine, even cake crumb'],
          },
          {
            title: 'Air can come from several techniques',
            paragraphs: ['Creaming traps air in solid fat. Whipping builds an egg or cream foam. Gentle folding preserves that foam. The same egg or butter therefore has a different role depending on whether it is whipped, creamed, melted, or added cold.'],
          },
          {
            title: 'Layers need separation',
            paragraphs: ['Cutting cold fat into flour creates small discontinuities. Lamination creates larger repeated layers; water becomes steam during baking and fat limits the layers from bonding. Melted fat does not create the same geometry because it cannot preserve solid layers.'],
          },
        ],
        table: {
          caption: 'Technique and dominant outcome',
          columns: ['Technique', 'Primary aim'],
          rows: [
            ['Kneading', 'Gluten development'],
            ['Stretch and fold', 'Strength with gentle handling'],
            ['Creaming', 'Air in solid fat'],
            ['Whipping', 'Foam'],
            ['Muffin method', 'Minimal gluten'],
            ['Cutting-in', 'Flaky texture'],
            ['Lamination', 'Distinct layers'],
            ['Gentle folding', 'Preserve foam'],
          ],
        },
        callout: {
          label: 'Process is not decoration',
          body: 'Final product = Formula + Mixing method + Temperature + Time. The process can move the same ingredient list from chewy to tender, compact to airy, or homogeneous to laminated.',
        },
      },
      {
        id: 'family-map',
        number: 13,
        eyebrow: '13 / STRUCTURAL FAMILIES',
        title: 'One map for doughs and batters',
        intro: 'Families are easier to understand when they are described by structure: gluten demand, fat, sugar, liquid, leavening, and the way the mixture sets.',
        blocks: [
          {
            title: 'The main axes',
            paragraphs: ['A lean bread dough and a cake batter may both contain flour and water, but their structural goals are opposite. The first develops a network that holds fermentation gas; the second limits gluten and relies on fat, eggs, starch, and chemical or mechanical lift.'],
            bullets: ['How much gluten development is wanted?', 'How much fat and sugar compete with the network?', 'How fluid is the mixture?', 'Where does the gas come from?', 'How does the structure set?'],
          },
          {
            title: 'Families are regions, not boxes',
            paragraphs: ['Lean dough, stiff dough, enriched dough, brioche, short dough, laminated dough, cake batter, foam batter, muffin batter, pancake batter, and crêpe batter overlap at their edges. A named product is a useful example inside a region, not a rigid scientific boundary.'],
          },
          {
            title: 'Classify an unknown formula',
            paragraphs: ['A formula with 100% flour, 65% water, 2% salt, 0.5% yeast, and 3% oil points toward lean bread. Add 50% egg, 15% sugar, and 50% butter and it moves toward rich enriched yeast dough. Add 80% sugar, 70% butter, 70% egg, milk, and baking powder and it behaves like a cake system.'],
          },
        ],
        table: {
          caption: 'Structural family overview',
          columns: ['Family', 'Typical examples', 'Dominant structure'],
          rows: [
            ['Lean dough', 'Bread, baguette', 'Gluten + yeast gas'],
            ['Stiff dough', 'Bagel, pretzel', 'Strong gluten + low liquid'],
            ['Enriched dough', 'Soft rolls, challah', 'Gluten with sugar, fat, egg, or dairy'],
            ['Rich enriched', 'Brioche', 'Strong gluten carrying heavy enrichment'],
            ['Short dough', 'Tart, shortbread', 'Fat-limited gluten'],
            ['Laminated dough', 'Croissant, puff pastry', 'Gluten dough + fat layers + steam'],
            ['Cake or foam batter', 'Cake, sponge, chiffon', 'Egg, starch, fat, and controlled gluten'],
            ['Quick batters', 'Muffin, pancake, crêpe', 'Fluidity + chemical lift or egg set'],
          ],
        },
        callout: {
          label: 'The goal of the map',
          body: 'You should be able to inspect an unfamiliar formula and form a useful structural expectation before relying on its name.',
        },
      },
      {
        id: 'master-ratio-map',
        number: 14,
        eyebrow: '14 / RATIO REFERENCE',
        title: 'The master ratio map',
        intro: 'The final map treats familiar products as areas of baker’s percentages. It helps compare formulas, but it is not a recipe and its ranges are intentionally broad.',
        blocks: [
          {
            title: 'Read combinations, not isolated columns',
            paragraphs: ['A high liquid percentage means something different in a lean bread, a pancake, or a crêpe. Fat, sugar, egg, flour strength, and leavening change what the same number can do. The map is most useful when several columns are read together.'],
          },
          {
            title: 'Follow the transitions',
            paragraphs: ['Along one path, bread becomes soft bread, enriched dough, and brioche as egg, sugar, and fat rise. Along another, bread moves toward cake, cookie, and shortbread as gluten development falls while fat and sugar rise. A third path moves from dough to batter as liquid increases.'],
          },
          {
            title: 'Use the map as a starting hypothesis',
            paragraphs: ['The numbers describe typical territory, not a guarantee about a finished product. “Liquids” may include milk or egg and are not always the same as hydration based on estimated available water. Flour, process, temperature, and time still decide how the formula behaves.'],
          },
        ],
        table: {
          caption: 'Indicative baker’s percentage ranges',
          columns: ['Family', 'Liquid / water', 'Egg', 'Sugar', 'Fat', 'Main lift'],
          rows: [
            ['Crackers', '25–45%', '0–10%', '0–15%', '0–20%', 'None or chemical'],
            ['Bagel / stiff bread', '45–55%', '0%', '0–5%', '0–3%', 'Yeast'],
            ['Pretzel', '50–60%', '0–10%', '0–8%', '0–8%', 'Yeast'],
            ['Lean bread', '58–75%', '0%', '0–5%', '0–5%', 'Yeast'],
            ['High hydration bread', '75–100%+', '0%', '0–5%', '0–5%', 'Yeast'],
            ['Soft or milk bread', '55–75%', '0–20%', '5–15%', '5–15%', 'Yeast'],
            ['Challah or tsoureki-style', '45–65%', '20–50%', '10–25%', '5–20%', 'Yeast'],
            ['Brioche', '35–60%', '30–70%', '10–30%', '30–80%', 'Yeast'],
            ['Pasta dough', '20–40%', '20–60%', '0%', '0–5%', 'None'],
            ['Shortcrust', '5–25%', '0–20%', '10–40%', '40–70%', 'None'],
            ['Shortbread', '0–10%', '0%', '25–50%', '60–80%', 'None'],
            ['Cookie', '5–30%', '0–30%', '40–100%', '40–100%', 'Soda, powder, or none'],
            ['Muffin', '70–120%', '20–60%', '40–100%', '20–60%', 'Powder or soda'],
            ['Butter cake', '40–100%', '40–100%', '70–120%', '50–100%', 'Creaming + powder'],
            ['Oil cake', '50–120%', '30–80%', '70–130%', '30–80%', 'Powder'],
            ['Sponge or genoise', '0–30% extra', '100–200%', '70–120%', '0–30%', 'Egg foam'],
            ['Chiffon', '60–100%', '80–140%', '80–120%', '30–60%', 'Foam + powder'],
            ['Pancake', '100–170%', '20–60%', '5–25%', '5–25%', 'Powder or soda'],
            ['Waffle', '90–150%', '20–60%', '5–30%', '15–50%', 'Powder or soda'],
            ['Crêpe', '150–250%', '40–100%', '0–20%', '5–20%', 'None'],
            ['Choux', 'About 125–150% water', '100–150%', '0–5%', '40–60%', 'Steam'],
          ],
          note: 'These are broad reference regions. They should guide exploration, not replace the source formula or a calibrated result.',
        },
        callout: {
          label: 'How to use it in the workspace',
          body: 'Start from a reference formula or a blank formula, inspect the composition, then change one meaningful variable at a time. The analyzer can show calculated values and estimates; the theory explains why the direction of change makes sense.',
        },
      },
    ],
  },
  el: {
    eyebrow: 'ΘΕΩΡΙΑ / ΥΛΙΚΑ & ΔΟΜΗ',
    title: 'Τι κάνει κάθε υλικό στη ζύμη.',
    intro: 'Διάβασε μια ζύμη από μέσα προς τα έξω: δομή, νερό, αέριο, υφή και η διαδικασία που τα ενώνει. Αυτά τα κεφάλαια μετατρέπουν μια συνταγή σε ένα μοντέλο που μπορείς να κατανοήσεις και να εξερευνήσεις.',
    backToWorkspace: 'Πίσω στον χώρο εργασίας',
    contentsTitle: 'Σελίδα περιεχομένων',
    sourceNote: 'Ξαναγραμμένο από τα 14 εσωτερικά κείμενα θεωρίας του exploration/theory. Τα εύρη είναι πρακτικοί οδηγοί, όχι αυστηρά όρια ή βαθμονομημένες προβλέψεις.',
    sourceLabel: 'Εσωτερικά κείμενα θεωρίας',
    chapterLabel: 'Κεφάλαιο',
    tableLabel: 'Πίνακας αναφοράς',
    noteLabel: 'Να θυμάσαι',
    chapters: [
      {
        id: 'introduction',
        number: 1,
        eyebrow: '01 / Η ΜΕΓΑΛΗ ΕΙΚΟΝΑ',
        title: 'Η ζύμη είναι σύστημα, όχι απλώς λίστα υλικών',
        intro: 'Το ίδιο υλικό μπορεί να έχει διαφορετικό ρόλο σε ένα ψωμί, ένα μπριός, ένα μπισκότο ή μια τηγανίτα. Το χρήσιμο ερώτημα δεν είναι μόνο τι υπάρχει, αλλά ποια δουλειά κάνει κάθε μέρος.',
        blocks: [
          {
            title: 'Ξεκίνα από τη δομή',
            paragraphs: ['Ταξινόμησε το αποτέλεσμα με βάση τη συμπεριφορά του: τεντώνεται, κρατά αέριο, απλώνει, δημιουργεί στρώσεις ή σταθεροποιείται σε ψίχα; Ονόματα όπως ψωμί, κέικ ή μπισκότο είναι χρήσιμες ετικέτες, αλλά η υποκείμενη δομή εξηγεί περισσότερα.'],
            bullets: ['Σφιχτές και ελαστικές ζύμες', 'Άλιπες και εμπλουτισμένες ζύμες με μαγιά', 'Τριφτές ζύμες και μπισκότα', 'Παχύρρευστοι ή ρευστοί χυλοί', 'Αφρώδεις μάζες με βάση τα χτυπημένα αυγά'],
          },
          {
            title: 'Δώσε σε κάθε υλικό μια λειτουργία',
            paragraphs: ['Τα υλικά μπορούν να χτίζουν δομή, να προσφέρουν ή να δεσμεύουν νερό, να μαλακώνουν την υφή, να δημιουργούν ή να συγκρατούν αέριο ή να βοηθούν το μείγμα να σταθεροποιηθεί στο ψήσιμο. Ένα υλικό μπορεί να ανήκει ταυτόχρονα σε περισσότερες από μία ομάδες.'],
            bullets: ['Δομικά υλικά: γλουτένη, πρωτεΐνες αυγού, άμυλο', 'Υγρά και ενυδάτωση: νερό, γάλα, αυγό, γιαούρτι', 'Υλικά τρυφερότητας: λίπος, ζάχαρη, κρόκος', 'Διόγκωση και αερισμός: μαγιά, διογκωτικά, χτυπημένο αυγό, αφρατοποίηση βουτύρου', 'Σταθεροποίηση: ζελατινοποίηση αμύλου, πήξη πρωτεϊνών, δημιουργία κρούστας'],
          },
          {
            title: 'Η ερώτηση πίσω από το μοντέλο',
            paragraphs: ['Μια χρήσιμη ανάγνωση ρωτά πόσο αέριο μπορεί να δημιουργηθεί, πόσο μπορεί να διασταλεί η μάζα και αν η δομή θα προλάβει να σταθεροποιηθεί πριν καταρρεύσει. Γι’ αυτό η φόρμουλα και η διαδικασία παραμένουν ξεχωριστά αλλά συνδεδεμένα μέρη του χώρου εργασίας.'],
          },
        ],
        callout: {
          label: 'Μοντέλο εργασίας',
          body: 'Τελικό προϊόν = Φόρμουλα + Μέθοδος ανάμειξης + Θερμοκρασία + Χρόνος. Η φόρμουλα δημιουργεί δυνατότητες· η διαδικασία καθορίζει πόσο από αυτό το δυναμικό θα φανεί.',
        },
      },
      {
        id: 'bakers-percentages',
        number: 2,
        eyebrow: '02 / Η ΚΟΙΝΗ ΓΛΩΣΣΑ',
        title: 'Ποσοστά αρτοποιίας και διαθέσιμο νερό',
        intro: 'Τα ποσοστά αρτοποιίας επιτρέπουν να συγκρίνουμε φόρμουλες διαφορετικού μεγέθους. Η εξέταση του διαθέσιμου νερού κάνει ένα βήμα ακόμη: ρωτά πόσο νερό φέρνουν πράγματι όλα τα υλικά στο μείγμα.',
        blocks: [
          {
            title: 'Τα άλευρα είναι η βάση του 100%',
            paragraphs: ['Άθροισε τις μάζες όλων των αλεύρων και όρισε αυτό το σύνολο ως 100%. Κάθε άλλο υλικό εκφράζεται σε σχέση με αυτό. Με 500 g άλευρα, 325 g νερό είναι 65%, 10 g αλάτι είναι 2% και 5 g μαγιά είναι 1%. Οι ίδιες σχέσεις ισχύουν αν διπλασιάσεις ή μειώσεις τη δόση.'],
          },
          {
            title: 'Η ονομαστική ενυδάτωση δεν δείχνει όλη την εικόνα',
            paragraphs: ['Η ονομαστική ενυδάτωση μετρά μόνο το νερό που προστέθηκε ως νερό. Η ενυδάτωση με βάση το διαθέσιμο νερό εκτιμά και το νερό που περιέχεται στο γάλα, το αυγό, το γιαούρτι, το βούτυρο, το μέλι ή έναν πουρέ φρούτου. Είναι εκτίμηση της σύστασης, όχι υπόσχεση ότι δύο φόρμουλες θα έχουν ίδια αίσθηση.'],
            bullets: ['Συνολικό νερό: το νερό από όλα τα σχετικά υλικά', 'Εκτιμώμενο διαθέσιμο νερό: το μέρος που αναμένεται να μπορεί να χρησιμοποιηθεί από το μείγμα', 'Ενυδάτωση με βάση το διαθέσιμο νερό: εκτιμώμενο διαθέσιμο νερό προς συνολικά άλευρα'],
          },
          {
            title: 'Μια φόρμουλα μπορεί να κρύβει το νερό της',
            paragraphs: ['Για παράδειγμα, 200 g γάλα δίνουν περίπου 174 g νερό, 100 g ολόκληρο αυγό περίπου 75 g και 50 g βούτυρο περίπου 8 g. Μαζί με 400 g άλευρα, αυτό είναι περίπου 257 g νερό ή περίπου 64% ενυδάτωση με βάση το εκτιμώμενο διαθέσιμο νερό. Με τη ζάχαρη και το λίπος παρόντα, το αποτέλεσμα διαβάζεται ως εμπλουτισμένη ζύμη και όχι ως άλιπο ψωμί.'],
          },
        ],
        table: {
          caption: 'Ενδεικτική περιεκτικότητα νερού σε συνηθισμένα υλικά',
          columns: ['Υλικό', 'Εκτίμηση νερού'],
          rows: [
            ['Νερό', '100%'],
            ['Πλήρες γάλα', 'περίπου 87%'],
            ['Ολόκληρο αυγό', 'περίπου 74–76%'],
            ['Ασπράδι', 'περίπου 88–90%'],
            ['Κρόκος', 'περίπου 48–50%'],
            ['Βούτυρο', 'περίπου 15–18%'],
            ['Μέλι', 'περίπου 17–20%'],
            ['Κρέμα 35%', 'περίπου 58–60%'],
          ],
          note: 'Οι τιμές είναι εκτιμήσεις σύστασης. Ο αναλυτής κρατά την άγνωστη σύσταση ξεχωριστά και δεν την αντιμετωπίζει σιωπηρά ως μηδενική.',
        },
      },
      {
        id: 'flour-and-water',
        number: 3,
        eyebrow: '03 / ΚΙΝΗΤΙΚΟΤΗΤΑ & ΓΛΟΥΤΕΝΗ',
        title: 'Άλευρα και νερό: τι αλλάζει η ενυδάτωση',
        intro: 'Το νερό δεν κάνει απλώς τα άλευρα υγρά. Δίνει στις πρωτεΐνες και στο άμυλο την κινητικότητα που χρειάζονται για να δημιουργήσουν τη δομή η οποία αργότερα θα κρατήσει σχήμα και αέριο.',
        blocks: [
          {
            title: 'Δύο μορφές κίνησης στη γλουτένη',
            paragraphs: ['Η γλιαδίνη συμβάλλει στην εκτατότητα: στην ικανότητα να τεντώνεται η ζύμη. Η γλουτενίνη συμβάλλει στην ελαστικότητα: στην τάση να αντιστέκεται και να επανέρχεται. Μια υπερβολικά ελαστική ζύμη μαζεύει, ενώ μια υπερβολικά εκτατή μπορεί να απλώσει και να χάσει το σχήμα της.'],
            bullets: ['Ελαστικότητα: αντίσταση και επαναφορά', 'Εκτατότητα: τέντωμα χωρίς άμεσο σκίσιμο', 'Η σωστή συμπεριφορά είναι ισορροπία, όχι μεγιστοποίηση του ενός'],
          },
          {
            title: 'Η ενυδάτωση αλλάζει το παράθυρο χειρισμού',
            paragraphs: ['Γύρω στο 40–50% η ζύμη είναι σφιχτή και κρατά εύκολα σχήμα. Γύρω στο 55–65% γίνεται πιο εύκολη στην ανάπτυξη και συνήθως διατηρεί καλή ισορροπία. Γύρω στο 70–80% είναι πιο μαλακή και κολλώδης και μπορεί να δώσει πιο ανοιχτή ψίχα, αν τα άλευρα και η διαδικασία το υποστηρίζουν. Πάνω από εκεί, ο χειρισμός εξαρτάται περισσότερο από διπλώματα, χρόνο και δύναμη αλεύρων.'],
          },
          {
            title: 'Το νερό χρειάζεται χρόνο και κίνηση',
            paragraphs: ['Η ξεκούραση επιτρέπει στα άλευρα να ενυδατωθούν. Το ζύμωμα ευθυγραμμίζει τις πρωτεΐνες και αναπτύσσει το δίκτυο. Τα διπλώματα ενισχύουν μια υγρή ζύμη με πιο ήπιο χειρισμό. Η θερμοκρασία αλλάζει επίσης την κινητικότητα: μια πιο ζεστή ζύμη είναι πιο μαλακή και ζυμώνεται γρηγορότερα. Η υπερβολική μηχανική εργασία μπορεί να τη θερμάνει και να την αποδυναμώσει.'],
          },
        ],
        callout: {
          label: 'Ένα απλό πείραμα',
          body: 'Φτιάξε πέντε μικρά δείγματα με τα ίδια άλευρα και 45%, 55%, 65%, 75% και 85% νερό. Μετά την ανάμειξη και ξανά μετά από 30 λεπτά, σύγκρινε αντίσταση, κολλητικότητα, άπλωμα και τέντωμα. Η ενυδάτωση γίνεται πολύ πιο κατανοητή όταν την αισθάνεσαι.',
        },
      },
      {
        id: 'flour',
        number: 4,
        eyebrow: '04 / Η ΔΟΜΙΚΗ ΒΑΣΗ',
        title: 'Άλευρα: πρωτεΐνη, δύναμη και τύπος',
        intro: 'Δεν υπάρχει ένα αλεύρι που να είναι ιδανικό για όλα. Υπάρχει αλεύρι κατάλληλο για τη δομή, την ενυδάτωση, τον χρόνο ζύμωσης και την τρυφερότητα που θέλεις.',
        blocks: [
          {
            title: 'Η πρωτεΐνη είναι μόνο η αρχή',
            paragraphs: ['Μια ένδειξη όπως 12,5% πρωτεΐνη μάς λέει πόση πρωτεΐνη υπάρχει, όχι ακριβώς πώς θα συμπεριφερθεί. Η ποικιλία του σιταριού, η άλεση, η ζημιά του αμύλου, η ενζυμική δραστηριότητα και η ισορροπία γλιαδίνης–γλουτενίνης επηρεάζουν την τελική ζύμη.'],
          },
          {
            title: 'Η δύναμη είναι ευρύτερη έννοια',
            paragraphs: ['Στα δεδομένα αρτοποιίας, το W χρησιμοποιείται συχνά ως ενδεικτικός δείκτης της ενέργειας που μπορεί να απορροφήσει ένα αλεύρι πριν σπάσει, ενώ το P/L περιγράφει την ισορροπία αντίστασης και εκτατότητας. Ένα δυνατότερο αλεύρι συνήθως αντέχει περισσότερο νερό, μακρύτερη ζύμωση, αέριο, ζάχαρη και λίπος.'],
            bullets: ['Χαμηλότερη πρωτεΐνη και δύναμη: κέικ, μπισκότα, τρυφερά cookies', 'Μέτρια δύναμη: γενικής χρήσης φόρμουλες και ορισμένοι χυλοί', 'Μεγαλύτερη δύναμη: ψωμί, πίτσα, μακρά ωρίμανση, μπριός', 'Πολύ μεγάλη δύναμη: μακρά ωρίμανση ή έντονα εμπλουτισμένες ζύμες'],
          },
          {
            title: 'Ο τύπος και η ολική άλεση αλλάζουν την εικόνα',
            paragraphs: ['Οι ενδείξεις 00, 0, 1 ή 2 περιγράφουν συμβάσεις άλεσης και βαθμό εκχύλισης, όχι ένα μοναδικό επίπεδο δύναμης. Το πίτουρο και το φύτρο προσθέτουν ίνες και ανόργανα στοιχεία, απορροφούν νερό και μπορούν να διακόψουν το δίκτυο γλουτένης. Το κατεστραμμένο άμυλο μπορεί επίσης να αυξήσει την ανάγκη σε νερό. Έτσι, η ίδια ονομαστική ενυδάτωση μπορεί να χρειάζεται προσαρμογή από αλεύρι σε αλεύρι.'],
          },
        ],
        table: {
          caption: 'Ένας πρακτικός χάρτης εκκίνησης',
          columns: ['Στόχος', 'Συνήθης κατεύθυνση αλεύρων'],
          rows: [
            ['Παντεσπάνι ή τρυφερό κέικ', 'Χαμηλή δύναμη'],
            ['Cookie', 'Χαμηλή έως μέτρια δύναμη'],
            ['Κρέπα ή pancake', 'Μέτρια· λιγότερο κρίσιμη'],
            ['Ψωμί', 'Μέτρια έως δυνατή'],
            ['Πίτσα με μακρά ζύμωση', 'Δυνατή και ανθεκτική στη ζύμωση'],
            ['Μπριός ή ζύμη τύπου panettone', 'Δυνατή έως πολύ δυνατή'],
          ],
        },
        callout: {
          label: 'Διάβαζε το ζευγάρι',
          body: 'Η ενυδάτωση χωρίς τη δύναμη των αλεύρων είναι ελλιπής πληροφορία. Μια χρήσιμη πρόβλεψη συνδυάζει πάντα τα δύο: δύναμη αλεύρων × ενυδάτωση.',
        },
      },
      {
        id: 'salt',
        number: 5,
        eyebrow: '05 / ΕΛΕΓΧΟΣ & ΓΕΥΣΗ',
        title: 'Αλάτι: μικρή ποσότητα, μεγάλη επίδραση',
        intro: 'Το αλάτι νοστιμίζει τη ζύμη, αλλά αλλάζει και τη δύναμη της γλουτένης, την κίνηση του νερού και την ταχύτητα της ζύμωσης. Στις ζύμες ψωμιού είναι συχνά περίπου 1,8–2,2% των αλεύρων.',
        blocks: [
          {
            title: 'Σφίγγει το δίκτυο',
            paragraphs: ['Το αλάτι κάνει τη ζύμη πιο συνεκτική, λίγο πιο σφιχτή και πιο ελαστική. Χωρίς αυτό, η ίδια ζύμη τείνει να είναι χαλαρή και κολλώδης. Αυτή είναι δομική επίδραση και όχι απλώς ρύθμιση γεύσης.'],
          },
          {
            title: 'Επιβραδύνει τη ζύμωση',
            paragraphs: ['Το αλάτι μειώνει τον ρυθμό δράσης της μαγιάς. Αυτό είναι χρήσιμο: μια πιο αργή και ελεγχόμενη ζύμωση δίνει περισσότερο χρόνο για ανάπτυξη γεύσης και κάνει τη ζύμη ευκολότερη στον χειρισμό.'],
            bullets: ['Γύρω στο 1%: ήπια γεύση και γρηγορότερη δράση', 'Γύρω στο 1,5–2%: συνηθισμένο ισορροπημένο εύρος για ψωμί', 'Γύρω στο 2,5%: πιο σφιχτό, πιο αργό και αισθητά αλμυρό', 'Πολύ περισσότερο: δύσκολος χειρισμός και υπερβολική αλμύρα'],
          },
          {
            title: 'Ο χρόνος προσθήκης έχει σημασία, αλλά ο μύθος είναι υπερβολικός',
            paragraphs: ['Το αλάτι μπορεί να μείνει προσωρινά χωριστά από συμπυκνωμένη νωπή μαγιά, ειδικά σε μια προενυδάτωση ή autolyse. Η σύντομη επαφή δεν «σκοτώνει» μαγικά τη μαγιά· το πρακτικό ζήτημα είναι η παρατεταμένη άμεση επαφή σε συμπυκνωμένο μείγμα.'],
          },
        ],
        callout: {
          label: 'Η εξίσωση συμπεριφοράς μεγαλώνει',
          body: 'Η συμπεριφορά της ζύμης εξαρτάται από τη δύναμη των αλεύρων, την ενυδάτωση, το αλάτι, την ανάμειξη, τον χρόνο και τη θερμοκρασία. Κανένα ποσοστό δεν εξηγεί μόνο του το αποτέλεσμα.',
        },
      },
      {
        id: 'yeast-and-fermentation',
        number: 6,
        eyebrow: '06 / ΑΕΡΙΟ & ΧΡΟΝΟΣ',
        title: 'Μαγιά και ζύμωση',
        intro: 'Η μαγιά δημιουργεί διοξείδιο του άνθρακα, αλκοόλη και αρωματικές ενώσεις. Το αέριο διαστέλλεται μέσα σε μια δομή που έχουν χτίσει τα άλευρα· η μαγιά δεν δημιουργεί μόνη της αυτή τη δομή.',
        blocks: [
          {
            title: 'Η ποσότητα ελέγχει κυρίως την ταχύτητα',
            paragraphs: ['Τα άλευρα περιέχουν ένζυμα που κάνουν διαθέσιμα κάποια σάκχαρα ακόμη κι όταν δεν έχει προστεθεί κρυσταλλική ζάχαρη. Περισσότερη μαγιά συνήθως σημαίνει γρηγορότερη δράση· λιγότερη μπορεί να δώσει παρόμοια συνολική διόγκωση αν προσαρμοστούν ο χρόνος και η θερμοκρασία. Η γεύση και ο χειρισμός όμως δεν θα είναι ίδιοι.'],
            bullets: ['Η instant και η active dry μαγιά χρησιμοποιούνται με διαφορετικό τρόπο', 'Η νωπή μαγιά χρησιμοποιείται συχνά σε περίπου τριπλάσια μάζα από την instant', 'Πολύ μικρά ποσοστά ταιριάζουν σε μακρά ή ψυχρή ζύμωση', 'Μεγαλύτερα ποσοστά ταιριάζουν σε γρήγορα προγράμματα, αλλά δεν εγγυώνται μεγαλύτερο όγκο'],
          },
          {
            title: 'Η θερμοκρασία και ο χρόνος είναι ένα σύστημα',
            paragraphs: ['Το κρύο επιβραδύνει τη ζύμωση, μια μέτρια θερμοκρασία περιβάλλοντος την επιταχύνει και η υπερβολική ζέστη καταπονεί τη μαγιά. Ο χρήσιμος στόχος δεν είναι απλώς ένας χρόνος στο ρολόι, αλλά η επιθυμητή κατάσταση της ζύμης, επηρεασμένη από μαγιά, ζάχαρη, αλάτι, ενυδάτωση, δύναμη αλεύρων και θερμοκρασία.'],
          },
          {
            title: 'Bulk, στόφα και oven spring',
            paragraphs: ['Η bulk ζύμωση είναι η πρώτη άνοδος όσο η ζύμη παραμένει ενιαία μάζα. Η στόφα είναι η τελική άνοδος μετά το κόψιμο ή το πλάσιμο. Μια ανεπαρκώς ωριμασμένη ζύμη δεν έχει δημιουργήσει αρκετό αέριο και μπορεί να σκιστεί· μια υπερωριμασμένη μπορεί να χάσει δύναμη και να απλώσει. Στον φούρνο διαστέλλεται το υπάρχον αέριο, δημιουργείται ατμός και η ζύμωση συνεχίζεται για λίγο, μέχρι η θερμότητα να σταθεροποιήσει τη δομή.'],
          },
        ],
        callout: {
          label: 'Ίδια φόρμουλα, διαφορετική ζύμωση',
          body: 'Μια ζύμη πίτσας με 1% μαγιά για 2–3 ζεστές ώρες και η ίδια ζύμη με 0,1% μαγιά για 24–48 ώρες στο κρύο μπορεί να διαφέρουν σε άρωμα, εκτατότητα, άνοιγμα και τελικό χαρακτήρα.',
        },
      },
      {
        id: 'sugar',
        number: 7,
        eyebrow: '07 / ΝΕΡΟ, ΥΦΗ & ΧΡΩΜΑ',
        title: 'Ζάχαρη: κάτι περισσότερο από γλυκύτητα',
        intro: 'Η ζάχαρη δεσμεύει νερό, μαλακώνει την υφή, αλλάζει τη δράση της μαγιάς, καθυστερεί τη σταθεροποίηση και ενισχύει το ρόδισμα. Όσο αυξάνεται, μια φόρμουλα ψωμιού μπορεί να περάσει προς εμπλουτισμένη ζύμη, κέικ ή cookie.',
        blocks: [
          {
            title: 'Ανταγωνίζεται για το νερό',
            paragraphs: ['Η ζάχαρη έλκει νερό που διαφορετικά θα ενυδάτωνε τις πρωτεΐνες των αλεύρων. Αυτό μπορεί να περιορίσει την ανάπτυξη της γλουτένης και να κάνει τη ζύμη πιο μαλακή ή τρυφερή, ακόμη κι όταν το ποσοστό νερού στο χαρτί δεν έχει αλλάξει.'],
            bullets: ['0–5%: περιοχή άλιπου ψωμιού', '5–20%: ελαφρά έως μέτρια εμπλουτισμένες ζύμες', '20–40%: σαφώς γλυκές εμπλουτισμένες ζύμες', '50% και πάνω: πιθανότερη συμπεριφορά κέικ ή cookie'],
          },
          {
            title: 'Αλλάζει τη μαλακότητα και τη διατήρηση',
            paragraphs: ['Επειδή κρατά υγρασία, τα γλυκά ψημένα προϊόντα συχνά μένουν μαλακά περισσότερο και μπαγιατεύουν πιο αργά. Σε μεγαλύτερες ποσότητες επιβραδύνει τη μαγιά, οπότε μπορεί να χρειαστούν περισσότερος χρόνος, άλλη μαγιά ή διαφορετική διαδικασία.'],
          },
          {
            title: 'Αλλάζει και το ψήσιμο',
            paragraphs: ['Η ζάχαρη συμβάλλει στην καραμελοποίηση και στην αντίδραση Maillard. Στα cookies λιώνει και καθυστερεί τη σταθεροποίηση, επιτρέποντας περισσότερο άπλωμα. Τα διαφορετικά σάκχαρα δεν είναι ισοδύναμα: φρουκτόζη, γλυκόζη, μέλι, σιρόπια και καστανή ζάχαρη διαφέρουν στη δέσμευση νερού, τη γλυκύτητα, το ρόδισμα και την κρυστάλλωση.'],
          },
        ],
        callout: {
          label: 'Διάβαζε τη ζάχαρη ως τροποποιητή',
          body: 'Στη φόρμουλα η ζάχαρη είναι ταυτόχρονα γλυκαντικό, υλικό τρυφερότητας, υλικό που δεσμεύει νερό, παράγοντας ροδίσματος και τροποποιητής της ζύμωσης.',
        },
      },
      {
        id: 'fat',
        number: 8,
        eyebrow: '08 / ΤΡΥΦΕΡΟΤΗΤΑ & ΣΤΡΩΣΕΙΣ',
        title: 'Λίπος: γιατί μαλακώνει και αλλάζει τη δομή',
        intro: 'Το λίπος περιορίζει την επαφή ανάμεσα στις πρωτεΐνες των αλεύρων. Έτσι μπορεί να περιορίσει την ανάπτυξη της γλουτένης, να μαλακώσει τη μπουκιά και να αλλάξει τον τρόπο με τον οποίο σχηματίζονται ο αέρας και οι στρώσεις. Η φυσική του κατάσταση και ο χρόνος προσθήκης είναι τόσο σημαντικά όσο και η μάζα του.',
        blocks: [
          {
            title: 'Το λάδι και το βούτυρο δεν είναι ισοδύναμα',
            paragraphs: ['Το λάδι είναι σχεδόν αποκλειστικά λίπος. Το βούτυρο περιέχει περίπου 80–82% λίπος, 15–18% νερό και στερεά γάλακτος. Η αντικατάσταση του ενός από το άλλο αλλάζει και την ποσότητα λίπους και το ισοζύγιο νερού, καθώς και το αν η φόρμουλα μπορεί να δουλευτεί με αφρατοποίηση ή φυλλοποίηση.'],
          },
          {
            title: 'Τρεις χρήσιμες καταστάσεις βουτύρου',
            paragraphs: ['Το μαλακό πλαστικό βούτυρο κρατά αέρα στην αφρατοποίηση. Το λιωμένο βούτυρο κυρίως λιπαίνει και μαλακώνει, συχνά δίνοντας πιο πυκνό ή πιο υγρό αποτέλεσμα. Το κρύο στερεό βούτυρο δημιουργεί ασυνέχειες και στρώσεις· το νερό του γίνεται ατμός ενώ το λίπος εμποδίζει τις στρώσεις να κολλήσουν πλήρως.'],
            bullets: ['Βούτυρο σε κρέμα: αερισμός σε κέικ και cookies', 'Λιωμένο βούτυρο: πλούτος και τρυφερότητα', 'Κρύο βούτυρο: φύλλωση, στρώσεις και φυλλοποιημένη ζύμη'],
          },
          {
            title: 'Το μπριός δείχνει τη σημασία του χρόνου',
            paragraphs: ['Στο μπριός, τα άλευρα, τα υγρά και η μαγιά συχνά αναμειγνύονται αρκετά ώστε να αναπτυχθεί η γλουτένη πριν προστεθεί σταδιακά το βούτυρο. Δυνατά άλευρα και ελεγχόμενη θερμοκρασία βοηθούν το δίκτυο να σηκώσει τον εμπλουτισμό. Αν το βούτυρο λιώσει πολύ νωρίς μέσα στη ζύμη, η ζύμη μπορεί να γίνει λιπαρή, χαλαρή και δύσκολη να δυναμώσει.'],
          },
        ],
        callout: {
          label: 'Οι τέσσερις ρόλοι του λίπους',
          body: 'Τρυφερότητα + περιορισμός γλουτένης + αερισμός ή φυλλοποίηση + υγρασία και αίσθηση στο στόμα. Το ίδιο βούτυρο μπορεί να δημιουργήσει διαφορετικό προϊόν όταν αλλάξει η θερμοκρασία ή η τεχνική.',
        },
      },
      {
        id: 'eggs',
        number: 9,
        eyebrow: '09 / ΝΕΡΟ, ΠΡΩΤΕΪΝΗ & ΑΦΡΟΣ',
        title: 'Αυγά: πολλά συστατικά σε ένα',
        intro: 'Το αυγό φέρνει νερό, πρωτεΐνη, λίπος, γαλακτωματοποιητές, ικανότητα αφρισμού, χρώμα και γεύση. Γι’ αυτό η αντικατάσταση ενός αυγού με ίση μάζα νερού σπάνια διατηρεί τη συμπεριφορά της φόρμουλας.',
        blocks: [
          {
            title: 'Το ασπράδι και ο κρόκος κάνουν διαφορετική δουλειά',
            paragraphs: ['Ένα ολόκληρο αυγό είναι περίπου 74–76% νερό, 12–13% πρωτεΐνη και 10–11% λίπος. Το ασπράδι είναι κυρίως νερό και πρωτεΐνη· ο κρόκος περιέχει περισσότερο λίπος, φωσφολιπίδια που γαλακτωματοποιούν και πιο πλούσιο χρώμα. Δεν είναι ισοδύναμα μισά του ίδιου υλικού.'],
            bullets: ['Περισσότερο ασπράδι: νερό και πιο σφιχτή πρωτεϊνική πήξη', 'Περισσότερος κρόκος: λίπος, γαλακτωματοποίηση, τρυφερότητα και πλούτος', 'Ολόκληρο αυγό: ισορροπία δομής, νερού, λίπους και χρώματος'],
          },
          {
            title: 'Τα αυγά μπορούν να χτίσουν ή να σταθεροποιήσουν',
            paragraphs: ['Οι πρωτεΐνες του αυγού πήζουν στο ψήσιμο και βοηθούν να σταθεροποιηθεί η ψίχα. Η λεκιθίνη βοηθά να παραμείνουν διασκορπισμένα νερό και λίπος. Το χτυπημένο αυγό παγιδεύει αέρα πριν από το ψήσιμο· ο αέρας διαστέλλεται και έπειτα οι πρωτεΐνες και το άμυλο σταθεροποιούνται γύρω του. Σε μια κρέπα, το αυγό κυρίως δένει και σταθεροποιεί ένα λεπτό φύλλο, δεν λειτουργεί ως διογκωτικό.'],
          },
          {
            title: 'Η τεχνική αποφασίζει ποιος ρόλος κυριαρχεί',
            paragraphs: ['Ένα καθαρό μπολ είναι σημαντικό στο χτύπημα των ασπραδιών, επειδή το λίπος παρεμβαίνει στον αφρό. Η ζάχαρη μπορεί να καθυστερεί τον σχηματισμό του αφρού, αλλά να σταθεροποιεί τον τελικό αφρό. Τα αυγά σε θερμοκρασία περιβάλλοντος συνήθως χτυπιούνται ευκολότερα. Για αξιόπιστες φόρμουλες, ζύγιζε τα αυγά σε γραμμάρια αντί να μετράς «δύο αυγά», επειδή αλλάζει το μέγεθος και η αναλογία ασπραδιού–κρόκου.'],
          },
        ],
        table: {
          caption: 'Ενδεικτική σύσταση ανά μέρος',
          columns: ['Μέρος', 'Νερό', 'Πρωτεΐνη', 'Λίπος'],
          rows: [
            ['Ολόκληρο αυγό', '74–76%', '12–13%', '10–11%'],
            ['Ασπράδι', '88–90%', '10–11%', 'Σχεδόν καθόλου'],
            ['Κρόκος', '48–50%', '16–17%', '32–34%'],
          ],
        },
        callout: {
          label: 'Ένα αυγό, διαφορετικός κυρίαρχος ρόλος',
          body: 'Στο μπριός εμπλουτίζει και γαλακτωματοποιεί· στο παντεσπάνι βοηθά να δημιουργηθεί αφρός· στην κρέπα δένει και σταθεροποιεί. Η λειτουργία εξαρτάται από ολόκληρη τη φόρμουλα και τη διαδικασία.',
        },
      },
      {
        id: 'dairy',
        number: 10,
        eyebrow: '10 / ΥΓΡΑ ΜΕ ΣΤΕΡΕΑ',
        title: 'Γάλα, γιαούρτι, buttermilk, κρέμα και άλλα γαλακτοκομικά',
        intro: 'Τα γαλακτοκομικά δεν είναι απλώς νερό με γεύση. Μπορούν να προσθέσουν ταυτόχρονα νερό, πρωτεΐνη, λίπος, λακτόζη, άλατα και οξύτητα.',
        blocks: [
          {
            title: 'Το υγρό φέρνει ένα πακέτο λειτουργιών',
            paragraphs: ['Οι πρωτεΐνες του γάλακτος συμβάλλουν στη δομή και στη συγκράτηση νερού. Η λακτόζη βοηθά στο ρόδισμα, αλλά δεν ζυμώνεται από τη συνηθισμένη μαγιά όπως τα απλά σάκχαρα. Το λίπος μαλακώνει. Η οξύτητα αλλάζει τη συμπεριφορά των πρωτεϊνών, τη γεύση και την ισορροπία των χημικών διογκωτικών.'],
          },
          {
            title: 'Το γιαούρτι και το buttermilk συμπεριφέρονται διαφορετικά',
            paragraphs: ['Το buttermilk είναι σχετικά ρευστό και αποτελεί κυρίως νερό με οξύτητα. Το γιαούρτι περιέχει περισσότερα στερεά και είναι συνήθως πιο παχύρρευστο, με λιγότερο ελεύθερο νερό. Το στραγγιστό γιαούρτι συμπυκνώνει ακόμη περισσότερο τα στερεά. Άρα ίσες μάζες μπορούν να δώσουν διαφορετικό ιξώδες και διαφορετική εκτίμηση ενυδάτωσης, ακόμη κι αν η ονομαστική ποσότητα υγρού είναι ίδια.'],
            bullets: ['Γάλα: ενυδάτωση, πρωτεΐνη, λακτόζη και λίγο λίπος', 'Buttermilk: ρευστή ενυδάτωση και γαλακτική οξύτητα', 'Γιαούρτι: πιο πυκνή υφή, στερεά, πρωτεΐνη και οξύτητα', 'Κρέμα: πολύ περισσότερο λίπος και λιγότερο νερό', 'Σκόνη γάλακτος: στερεά γάλακτος χωρίς πολύ επιπλέον υγρό'],
          },
          {
            title: 'Η οξύτητα μπορεί να έχει λειτουργικό ρόλο',
            paragraphs: ['Γιαούρτι, buttermilk, sour cream, εσπεριδοειδή, ξίδι και φυσικό κακάο μπορούν να αντιδράσουν με τη μαγειρική σόδα. Υπερβολική σόδα αφήνει σαπωνώδη ή μεταλλική γεύση και μπορεί να σκουρύνει υπερβολικά το ψήσιμο. Μερικές φορές το baking powder δίνει την κύρια διόγκωση και μια μικρότερη ποσότητα σόδας ισορροπεί την οξύτητα.'],
          },
        ],
        table: {
          caption: 'Ένας πρακτικός χάρτης',
          columns: ['Υλικό', 'Κυρίαρχη συνεισφορά'],
          rows: [
            ['Νερό', 'Καθαρή ενυδάτωση'],
            ['Γάλα', 'Ενυδάτωση, τρυφερότητα και ρόδισμα'],
            ['Buttermilk', 'Ενυδάτωση και οξύτητα'],
            ['Γιαούρτι', 'Στερεά, πρωτεΐνη, οξύτητα και λιγότερο ελεύθερο νερό'],
            ['Κρέμα', 'Υψηλό λίπος με σχετικά λιγότερο νερό'],
            ['Σκόνη γάλακτος', 'Στερεά γάλακτος χωρίς πολύ επιπλέον υγρό'],
          ],
        },
      },
      {
        id: 'chemical-leavening',
        number: 11,
        eyebrow: '11 / ΧΗΜΙΚΗ ΔΙΟΓΚΩΣΗ',
        title: 'Baking soda, baking powder και χημική διόγκωση',
        intro: 'Τα χημικά διογκωτικά παράγουν διοξείδιο του άνθρακα μέσω αντίδρασης οξέος–βάσης. Είναι διαφορετικός μηχανισμός από τη ζύμωση με μαγιά και χρειάζεται ισορροπία με τη δομή που θα κρατήσει το αέριο.',
        blocks: [
          {
            title: 'Η σόδα χρειάζεται οξύ',
            paragraphs: ['Η baking soda είναι βάση. Αντιδρά με οξύ όπως γιαούρτι, buttermilk, sour cream, χυμός λεμονιού, ξίδι, μελάσα ή φυσικό κακάο. Η ποσότητα δεν μπορεί να επιλεγεί αξιόπιστα μόνο από τη μάζα των αλεύρων, επειδή η διαθέσιμη οξύτητα διαφέρει.'],
          },
          {
            title: 'Το baking powder φέρνει έτοιμο σύστημα',
            paragraphs: ['Το baking powder περιέχει βάση, ένα ή περισσότερα ξηρά οξέα και έναν φορέα, όπως άμυλο. Το single-acting αντιδρά κυρίως όταν βραχεί· το double-acting αντιδρά σε στάδια, μεταξύ άλλων και κατά τη θέρμανση. Γι’ αυτό είναι συνηθισμένο κύριο διογκωτικό σε κέικ, muffins και pancakes.'],
            bullets: ['Πολύ λίγο: μικρός όγκος και πυκνή ψίχα', 'Πολύ: υπερβολικά μεγάλες κυψελίδες, ανεπιθύμητη γεύση και κατάρρευση', 'Σόδα μαζί με baking powder: ρύθμιση οξύτητας και επιπλέον διόγκωση', 'Η σόδα μπορεί επίσης να αυξήσει το άπλωμα και το ρόδισμα των cookies'],
          },
          {
            title: 'Το αέριο είναι μόνο η μισή ιστορία',
            paragraphs: ['Ένας χυλός χρειάζεται χρόνο για να διασταλούν οι φυσαλίδες, αλλά και αρκετή δύναμη για να σταθεροποιηθεί γύρω τους. Οι πρωτεΐνες των αυγών, οι πρωτεΐνες των αλεύρων και το ζελατινοποιημένο άμυλο παρέχουν αυτή τη σταθεροποίηση. Άλλοι μηχανισμοί είναι η μαγιά, το χτυπημένο αυγό ή η αφρατοποίηση και ο ατμός. Περισσότερο διογκωτικό δεν σημαίνει αυτόματα μεγαλύτερο τελικό όγκο.'],
          },
        ],
        callout: {
          label: 'Η χρήσιμη διάκριση',
          body: 'Soda = βάση + διαθέσιμο οξύ. Baking powder = έτοιμο σύστημα οξέος–βάσης. Και τα δύο χρειάζονται σωστή υγρασία, θερμότητα και δομή που σταθεροποιείται.',
        },
      },
      {
        id: 'mixing-techniques',
        number: 12,
        eyebrow: '12 / Η ΔΙΑΔΙΚΑΣΙΑ ΑΛΛΑΖΕΙ ΤΗ ΛΕΙΤΟΥΡΓΙΑ',
        title: 'Τεχνικές ανάμειξης: η μέθοδος είναι μέρος της φόρμουλας',
        intro: 'Δύο φόρμουλες με τις ίδιες μάζες μπορούν να δώσουν διαφορετικό προϊόν, επειδή η ανάμειξη ελέγχει την ανάπτυξη της γλουτένης, τον παγιδευμένο αέρα, την κατανομή του λίπους και τις στρώσεις.',
        blocks: [
          {
            title: 'Διάλεξε τη δομή που χρειάζεσαι',
            paragraphs: ['Το ζύμωμα αναπτύσσει συνεχές δίκτυο γλουτένης για ψωμί, πίτσα, bagel και μπριός. Τα διπλώματα δυναμώνουν μια υγρή ζύμη με τον χρόνο και λιγότερη θέρμανση. Η μέθοδος muffin ενώνει γρήγορα υγρά και στερεά για να περιορίσει τη γλουτένη.'],
            bullets: ['Ζύμωμα: δύναμη και συγκράτηση αερίου', 'Stretch and fold: δομή με ήπιο χειρισμό', 'Μέθοδος muffin: τρυφερή ψίχα με λίγη γλουτένη', 'Reverse creaming: λεπτή και ομοιόμορφη ψίχα κέικ'],
          },
          {
            title: 'Ο αέρας μπορεί να έρθει από διαφορετικές τεχνικές',
            paragraphs: ['Η αφρατοποίηση παγιδεύει αέρα σε στερεό λίπος. Το χτύπημα δημιουργεί αφρό αυγού ή κρέμας. Το απαλό δίπλωμα διατηρεί αυτόν τον αφρό. Έτσι το ίδιο αυγό ή βούτυρο αποκτά διαφορετικό ρόλο ανάλογα με το αν χτυπιέται, αφρατοποιείται, λιώνει ή προστίθεται κρύο.'],
          },
          {
            title: 'Οι στρώσεις χρειάζονται διαχωρισμό',
            paragraphs: ['Το κόψιμο κρύου λίπους μέσα στα άλευρα δημιουργεί μικρές ασυνέχειες. Η φυλλοποίηση δημιουργεί μεγαλύτερες επαναλαμβανόμενες στρώσεις· το νερό γίνεται ατμός στο ψήσιμο και το λίπος εμποδίζει τις στρώσεις να ενωθούν. Το λιωμένο λίπος δεν δημιουργεί την ίδια γεωμετρία, επειδή δεν διατηρεί στερεές στρώσεις.'],
          },
        ],
        table: {
          caption: 'Τεχνική και κυρίαρχο αποτέλεσμα',
          columns: ['Τεχνική', 'Κύριος στόχος'],
          rows: [
            ['Ζύμωμα', 'Ανάπτυξη γλουτένης'],
            ['Stretch and fold', 'Δύναμη με ήπιο χειρισμό'],
            ['Κρέμασμα', 'Αέρας σε στερεό λίπος'],
            ['Χτύπημα', 'Αφρός'],
            ['Μέθοδος muffin', 'Ελάχιστη γλουτένη'],
            ['Cutting-in', 'Τριφτή, flaky υφή'],
            ['Φυλλοποίηση', 'Διακριτές στρώσεις'],
            ['Απαλό δίπλωμα', 'Διατήρηση αφρού'],
          ],
        },
        callout: {
          label: 'Η διαδικασία δεν είναι διακοσμητική',
          body: 'Τελικό προϊόν = Φόρμουλα + Μέθοδος ανάμειξης + Θερμοκρασία + Χρόνος. Η διαδικασία μπορεί να μετακινήσει την ίδια λίστα υλικών από chewy σε τρυφερή, από συμπαγή σε αέρινη ή από ομοιογενή σε φυλλοποιημένη.',
        },
      },
      {
        id: 'family-map',
        number: 13,
        eyebrow: '13 / ΔΟΜΙΚΕΣ ΟΙΚΟΓΕΝΕΙΕΣ',
        title: 'Ένας χάρτης για ζύμες και χυλούς',
        intro: 'Οι οικογένειες γίνονται πιο κατανοητές όταν περιγράφονται με βάση τη δομή: απαίτηση σε γλουτένη, λίπος, ζάχαρη, υγρό, διόγκωση και τον τρόπο που σταθεροποιείται το μείγμα.',
        blocks: [
          {
            title: 'Οι βασικοί άξονες',
            paragraphs: ['Μια άλιπη ζύμη ψωμιού και ένας χυλός κέικ μπορεί να έχουν και οι δύο άλευρα και νερό, αλλά έχουν αντίθετους δομικούς στόχους. Η πρώτη αναπτύσσει δίκτυο που κρατά αέριο ζύμωσης· ο δεύτερος περιορίζει τη γλουτένη και βασίζεται σε λίπος, αυγά, άμυλο και χημική ή μηχανική διόγκωση.'],
            bullets: ['Πόση ανάπτυξη γλουτένης θέλουμε;', 'Πόσο λίπος και ζάχαρη ανταγωνίζονται το δίκτυο;', 'Πόσο ρευστό είναι το μείγμα;', 'Από πού προέρχεται το αέριο;', 'Πώς σταθεροποιείται η δομή;'],
          },
          {
            title: 'Οι οικογένειες είναι περιοχές, όχι κουτιά',
            paragraphs: ['Άλιπη ζύμη, σφιχτή ζύμη, εμπλουτισμένη ζύμη, μπριός, τριφτή ζύμη, φυλλοποιημένη ζύμη, χυλός κέικ, αφρώδης χυλός, muffin, pancake και κρέπα αλληλεπικαλύπτονται στα όριά τους. Ένα ονομασμένο προϊόν είναι χρήσιμο παράδειγμα μέσα σε μια περιοχή και όχι αυστηρό επιστημονικό όριο.'],
          },
          {
            title: 'Ταξινόμησε μια άγνωστη φόρμουλα',
            paragraphs: ['Μια φόρμουλα με 100% άλευρα, 65% νερό, 2% αλάτι, 0,5% μαγιά και 3% λάδι δείχνει προς άλιπο ψωμί. Αν προσθέσεις 50% αυγό, 15% ζάχαρη και 50% βούτυρο, μετακινείται προς πλούσια εμπλουτισμένη ζύμη με μαγιά. Αν προσθέσεις 80% ζάχαρη, 70% βούτυρο, 70% αυγό, γάλα και baking powder, συμπεριφέρεται σαν σύστημα κέικ.'],
          },
        ],
        table: {
          caption: 'Επισκόπηση δομικών οικογενειών',
          columns: ['Οικογένεια', 'Συνήθη παραδείγματα', 'Κυρίαρχη δομή'],
          rows: [
            ['Άλιπη ζύμη', 'Ψωμί, baguette', 'Γλουτένη + αέριο μαγιάς'],
            ['Σφιχτή ζύμη', 'Bagel, pretzel', 'Δυνατή γλουτένη + λίγο υγρό'],
            ['Εμπλουτισμένη ζύμη', 'Μαλακά ψωμάκια, τσουρέκι', 'Γλουτένη με ζάχαρη, λίπος, αυγό ή γαλακτοκομικά'],
            ['Πλούσια εμπλουτισμένη', 'Μπριός', 'Δυνατή γλουτένη που σηκώνει έντονο εμπλουτισμό'],
            ['Τριφτή ζύμη', 'Tart, shortbread', 'Γλουτένη περιορισμένη από το λίπος'],
            ['Φυλλοποιημένη ζύμη', 'Croissant, puff pastry', 'Ζύμη γλουτένης + στρώσεις λίπους + ατμός'],
            ['Κέικ ή αφρώδης χυλός', 'Κέικ, παντεσπάνι, chiffon', 'Αυγό, άμυλο, λίπος και ελεγχόμενη γλουτένη'],
            ['Γρήγοροι χυλοί', 'Muffin, pancake, κρέπα', 'Ρευστότητα + διογκωτικό ή πήξη αυγού'],
          ],
        },
        callout: {
          label: 'Ο στόχος του χάρτη',
          body: 'Να μπορείς να κοιτάξεις μια άγνωστη φόρμουλα και να σχηματίσεις μια χρήσιμη δομική προσδοκία πριν βασιστείς στο όνομά της.',
        },
      },
      {
        id: 'master-ratio-map',
        number: 14,
        eyebrow: '14 / ΧΑΡΤΗΣ ΑΝΑΛΟΓΙΩΝ',
        title: 'Ο κύριος χάρτης αναλογιών',
        intro: 'Ο τελικός χάρτης αντιμετωπίζει τα γνωστά προϊόντα ως περιοχές ποσοστών αρτοποιίας. Βοηθά στη σύγκριση φόρμουλων, αλλά δεν είναι συνταγή και τα εύρη του είναι σκόπιμα πλατιά.',
        blocks: [
          {
            title: 'Διάβαζε συνδυασμούς, όχι μεμονωμένες στήλες',
            paragraphs: ['Ένα υψηλό ποσοστό υγρών σημαίνει κάτι διαφορετικό σε ένα άλιπο ψωμί, ένα pancake ή μια κρέπα. Το λίπος, η ζάχαρη, το αυγό, η δύναμη των αλεύρων και η διόγκωση αλλάζουν αυτό που μπορεί να κάνει ο ίδιος αριθμός. Ο χάρτης είναι χρήσιμος όταν διαβάζεις πολλές στήλες μαζί.'],
          },
          {
            title: 'Ακολούθησε τις μεταβάσεις',
            paragraphs: ['Σε μία διαδρομή, το ψωμί γίνεται μαλακό ψωμί, εμπλουτισμένη ζύμη και μπριός καθώς αυξάνονται αυγό, ζάχαρη και λίπος. Σε άλλη, το ψωμί κινείται προς κέικ, cookie και shortbread καθώς μειώνεται η ανάπτυξη γλουτένης και αυξάνονται λίπος και ζάχαρη. Μια τρίτη διαδρομή περνά από τη ζύμη στον χυλό αυξάνοντας τα υγρά.'],
          },
          {
            title: 'Χρησιμοποίησέ τον ως αρχική υπόθεση',
            paragraphs: ['Οι αριθμοί περιγράφουν τυπικές περιοχές και όχι εγγύηση για το τελικό προϊόν. Τα «υγρά» μπορεί να περιλαμβάνουν γάλα ή αυγό και δεν είναι πάντα το ίδιο με την ενυδάτωση που υπολογίζεται από το εκτιμώμενο διαθέσιμο νερό. Τα άλευρα, η διαδικασία, η θερμοκρασία και ο χρόνος συνεχίζουν να καθορίζουν τη συμπεριφορά.'],
          },
        ],
        table: {
          caption: 'Ενδεικτικά εύρη ποσοστών αρτοποιίας',
          columns: ['Οικογένεια', 'Υγρά / νερό', 'Αυγό', 'Ζάχαρη', 'Λίπος', 'Κύρια διόγκωση'],
          rows: [
            ['Crackers', '25–45%', '0–10%', '0–15%', '0–20%', 'Καμία ή χημική'],
            ['Bagel / σφιχτό ψωμί', '45–55%', '0%', '0–5%', '0–3%', 'Μαγιά'],
            ['Pretzel', '50–60%', '0–10%', '0–8%', '0–8%', 'Μαγιά'],
            ['Άλιπο ψωμί', '58–75%', '0%', '0–5%', '0–5%', 'Μαγιά'],
            ['Ψωμί υψηλής ενυδάτωσης', '75–100%+', '0%', '0–5%', '0–5%', 'Μαγιά'],
            ['Μαλακό ή milk bread', '55–75%', '0–20%', '5–15%', '5–15%', 'Μαγιά'],
            ['Challah ή τύπου τσουρέκι', '45–65%', '20–50%', '10–25%', '5–20%', 'Μαγιά'],
            ['Μπριός', '35–60%', '30–70%', '10–30%', '30–80%', 'Μαγιά'],
            ['Ζύμη pasta', '20–40%', '20–60%', '0%', '0–5%', 'Καμία'],
            ['Shortcrust', '5–25%', '0–20%', '10–40%', '40–70%', 'Καμία'],
            ['Shortbread', '0–10%', '0%', '25–50%', '60–80%', 'Καμία'],
            ['Cookie', '5–30%', '0–30%', '40–100%', '40–100%', 'Σόδα, powder ή καμία'],
            ['Muffin', '70–120%', '20–60%', '40–100%', '20–60%', 'Powder ή σόδα'],
            ['Butter cake', '40–100%', '40–100%', '70–120%', '50–100%', 'Κρέμασμα + powder'],
            ['Oil cake', '50–120%', '30–80%', '70–130%', '30–80%', 'Powder'],
            ['Sponge ή genoise', '0–30% επιπλέον', '100–200%', '70–120%', '0–30%', 'Αφρός αυγού'],
            ['Chiffon', '60–100%', '80–140%', '80–120%', '30–60%', 'Αφρός + powder'],
            ['Pancake', '100–170%', '20–60%', '5–25%', '5–25%', 'Powder ή σόδα'],
            ['Waffle', '90–150%', '20–60%', '5–30%', '15–50%', 'Powder ή σόδα'],
            ['Κρέπα', '150–250%', '40–100%', '0–20%', '5–20%', 'Καμία'],
            ['Choux', 'Περίπου 125–150% νερό', '100–150%', '0–5%', '40–60%', 'Ατμός'],
          ],
          note: 'Αυτές είναι πλατιές περιοχές αναφοράς. Καθοδηγούν την εξερεύνηση, δεν αντικαθιστούν την αρχική φόρμουλα ή ένα βαθμονομημένο αποτέλεσμα.',
        },
        callout: {
          label: 'Πώς χρησιμοποιείται στον χώρο εργασίας',
          body: 'Ξεκίνα από μια φόρμουλα αναφοράς ή από κενή φόρμουλα, έλεγξε τη σύσταση και μετά άλλαζε μία ουσιαστική μεταβλητή κάθε φορά. Ο αναλυτής μπορεί να δείξει υπολογισμένες τιμές και εκτιμήσεις· η θεωρία εξηγεί γιατί έχει νόημα η κατεύθυνση της αλλαγής.',
        },
      },
    ],
  },
};
