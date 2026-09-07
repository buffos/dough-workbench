# Formula Input and Normalization — Canonical Domain Model

Status: Canonical model for downstream exact artifacts
Version: v0.1
Date: 2026-09-07

This model defines the business concepts and behavior owned by the Formula
Input and Normalization capability. It is architecture-neutral: it is not a
database schema, UI component tree, TypeScript class diagram, or event-sourcing
plan. Multiple implementation styles may realize it as long as the language,
invariants, and behavior remain stable.

The canonical vocabulary is defined in the
[domain glossary](domain-glossary.md), and product intent is defined in the
[node PRD](prd.md).

## Modeling readiness

The capability is ready for canonical domain modeling because:

- the main workflows are known: Build Formula, Record Process, Validate
  Formula, Normalize Formula, and Produce Partial Analysis;
- the important actors and business nouns are stable;
- Formula, Process, Ingredient, IngredientLine, FlourSystem, and
  FlourComponent have distinct meanings;
- the main lifecycles are visible for formula input, process input, and
  analysis readiness;
- the hard rules and partial-data policy are explicit; and
- failure paths include invalid masses, missing structural flour, incomplete
  composition, unknown process fields, and isolated local overrides.

## Domain intent and boundary

The domain operation is not “calculate a recipe screen.” It is:

> Turn an entered Formula and its separately recorded Process into a
> deterministic, provenance-preserving, analysis-ready input while keeping
> structural invalidity distinct from incomplete knowledge.

The capability owns:

- Formula composition input and editing semantics;
- FlourSystem and FlourComponent ownership;
- IngredientLine roles, mass, and local overrides;
- the structural flour denominator and baker's percentages;
- grams-only validation for V1;
- Process input capture and tri-state values;
- normalization, validation diagnostics, provenance, and confidence handoff.

It does not own:

- the shared Ingredient catalog's editorial lifecycle;
- composition or process behavior metrics after normalization;
- product classification or prototype similarity;
- dataset collection, calibration governance, or model training;
- Greek/English presentation labels or route policy.

## Ubiquitous language

The following distinctions are part of the model, not implementation detail:

| Term | Canonical meaning | Must not be conflated with |
|---|---|---|
| Formula | The normalized analytical object describing what is present | an informal recipe description |
| Process | The independently editable description of how the formula is handled | ingredient composition |
| Ingredient | A reusable catalog or custom functional definition | a use of that definition in a formula |
| IngredientLine | One formula-specific use of an Ingredient, with mass, role, and local state | the shared catalog entry |
| FlourSystem | The formula-owned system that establishes the denominator | every ingredient with a `Structural` role |
| FlourComponent | A flour-bearing member of a FlourSystem | a non-flour structural ingredient |
| Unknown | A value that may apply but is not established | numeric zero or explicit absence |
| None | An explicit absence or non-applicability | missing knowledge |
| Functional Composition | Model-facing composition and properties after resolution | an ingredient name or product label |
| Calculated | A value obtained by known arithmetic | an estimate or heuristic score |
| Estimated | A value dependent on an explicit assumption | a directly calculated fact |
| Heuristic | A model score or rule-based interpretation | probability or certainty |

## Subdomains and context candidates

### Core domain: Formula Input and Normalization

This is the core complexity. It protects the structural flour denominator,
role participation, deterministic baker's percentages, local override scope,
and honest handling of incomplete data.

### Supporting domain: Functional Ingredient Knowledge

This supplies reusable Ingredient definitions, functional composition,
physical properties, provenance, and confidence. It is referenced by Formula
input but is not mutated by it. Custom functional ingredients are allowed as
local input values and may later be curated into the supporting catalog by a
separate workflow.

### Supporting domain: Process Input Capture

This owns the ordered Process and AdditionStep concepts. It participates in
the same analysis workflow but remains a separate consistency boundary from
Formula composition because process changes must not rewrite composition.

### Cross-cutting policy areas

Trust/provenance/uncertainty, bilingual presentation, and future validation and
calibration influence this capability without becoming Formula aggregates.
They provide policies and metadata that the capability carries forward.

### Bounded-context candidates

The first implementation can remain a single frontend application while
preserving these conceptual seams:

1. Formula Input and Normalization context — the owner of this model.
2. Functional Ingredient Knowledge context — catalog definitions and source
   evidence.
3. Process/Effective Behavior context — process-dependent metrics after the
   normalized handoff.
4. Classification and Explanation context — prototype matching and
   user-facing interpretation after metrics exist.

These are language and rule boundaries, not a demand for separate deployables
or packages.

## Aggregate map

### Formula aggregate

`Formula` is the primary aggregate root for composition input. It owns:

- one `FlourSystem`;
- zero or more `IngredientLine` entities;
- formula metadata and analysis settings references; and
- an association to the separately held `Process` for analysis handoff.

The Formula root is the command target for composition edits and the owner of
the invariants that must hold together when flour components or ingredient
lines change.

The Process association does not make Process children part of the Formula
consistency boundary. Formula and Process are paired for analysis but remain
independently editable and serializable, as required by ADR-0002.

### FlourSystem entity within Formula

`FlourSystem` is owned by Formula and controls its `FlourComponent` members.
It is the only source of the structural flour denominator. A FlourComponent
has a local identity within the system and carries mass plus optional grain,
refinement, composition, and provenance data.

The boundary is justified by the invariant that denominator membership,
component masses, and flour blend normalization must be evaluated together.

### IngredientLine entity within Formula

`IngredientLine` is a Formula-owned entity representing one occurrence of an
Ingredient. It owns:

- its positive mass in grams;
- its role;
- a catalog Ingredient reference or a custom functional definition;
- optional CompositionOverride and AvailabilityOverride values; and
- line-local provenance and confidence.

The line is not the Ingredient. Two lines may refer to the same catalog
definition while retaining different roles or overrides.

### Process aggregate

`Process` is a separate aggregate root for handling behavior. It owns ordered
`AdditionStep` entities and process fields such as mixing, rest, aeration,
fermentation, lamination, thermal treatment, and geometry where supplied by
the source domain specification.

The Process root protects ordering and process-state semantics. It may refer to
Formula-owned IngredientLine identities for additions, but it does not own or
rewrite those lines. A Formula/Process pair is assembled at the analysis
handoff boundary.

### V1 Process field vocabulary

The initial Process input contract is compact but field-stable. Every listed
field uses `ValueState<T>` unless the section itself is absent; an absent or
unavailable value remains `Unknown` rather than receiving a default.

| Section | Canonical field paths | Value/unit rules |
|---|---|---|
| `mixing` | `method`, `intensity`, `durationSeconds`, `foldCount`, `foldIntensity`, `restDurationSeconds`, `restType`, `targetDevelopment` | `intensity` and `foldIntensity` are `[0,1]`; durations are non-negative seconds; `foldCount` is a non-negative integer |
| `ingredientAddition` | `steps[]`, `fatIncorporationMode` | each step has unique positive `sequence`, Formula `lineIds`, `action`, and non-negative `durationSeconds`; order is authoritative |
| `aeration` | `method`, `intensity`, `targetFoam`, `foamStability`, `postAerationHandling` | intensity and stability are `[0,1]` |
| `fermentation` | `agent`, `prefermentType`, `prefermentPercentage`, `bulkTimeSeconds`, `bulkTemperatureCelsius`, `bulkExpansionTarget`, `finalProofTimeSeconds`, `finalProofTemperatureCelsius`, `finalExpansionTarget`, `coldFermentation` | times are non-negative seconds; temperatures are degrees Celsius; percentages are non-negative; `agent = None` is explicit absence |
| `lamination` | `enabled`, `laminationFat`, `layerFatPercentage`, `foldSequence`, `fatState`, `doughState`, `workingTemperatureCelsius` | `enabled = false` means fold sequence is empty and lamination-specific contribution is absent; temperatures are degrees Celsius |
| `thermalProcess` | `method`, `temperatureCelsius`, `durationSeconds`, `preheated`, `steamLevel`, `surfaceTreatment` | duration is non-negative seconds; temperature is degrees Celsius; `steamLevel` is `[0,1]` |
| `geometry` | `shapeClass`, `characteristicThicknessMillimeters`, `surfaceVolumeClass`, `containerType` | thickness is positive millimeters when known |

Initial enum identifiers are the lower-case forms of the formal specification:
`mixing.method` (`minimal_combine`, `hand_knead`, `machine_knead`,
`spiral_mix`, `planetary_hook`, `paddle`, `whisk`, `stretch_and_fold`,
`coil_fold`, `gentle_fold`, `other`), `restType` (`autolyse`,
`fermentolyse`, `bench_rest`, `intermediate_rest`, `post_mix_rest`, `other`),
`fatIncorporationMode` (`early_coating`, `creamed`, `melted`,
`late_incorporation`, `cold_chunks`, `laminated`, `emulsified`, `direct_mix`,
`other`), `aeration.method` (`none`, `creaming`, `whole_egg_whip`,
`egg_white_whip`, `whipped_cream`, `mechanical_beat`, `other`),
`fermentation.agent` (`none`, `commercial_yeast`, `sourdough`, `mixed`,
`other`), `thermalProcess.method` (`static_oven`, `fan_oven`, `steam_oven`,
`air_fryer`, `griddle`, `pan`, `deep_fry`, `boil_then_bake`, `other`), and
`geometry.shapeClass` (`loaf`, `roll`, `flatbread`, `thin_sheet`, `cookie`,
`cake`, `muffin`, `pancake`, `crepe`, `ring`, `laminated_piece`,
`choux_piece`, `other`).

More advanced process fields may be added only by versioning this vocabulary;
they must not change the meaning of existing fields.

### Ingredient catalog reference

An `Ingredient` catalog definition is a supporting-domain entity identified by
a stable identifier and definition version. Formula input may read it, attach
its snapshot/provenance, and apply a Formula-line-local override. The input
workflow cannot mutate the shared definition.

### Downstream analysis result

`FormulaAnalysis` is a downstream result object, not an aggregate owned by this
capability. The normalization boundary supplies the Formula/Process input and
diagnostics needed for composition, process, classification, similarity, and
explanation capabilities.

## Entities and value objects

### Entities

| Entity | Identity | Ownership | Behavioral responsibility |
|---|---|---|---|
| Formula | Stable Formula identity | Aggregate root | Accept composition commands, protect formula-level invariants, expose normalization readiness |
| FlourSystem | Identity within Formula | Formula | Maintain flour members and denominator eligibility |
| FlourComponent | Identity within FlourSystem | FlourSystem | Represent one flour-bearing component and its mass/properties |
| IngredientLine | Identity within Formula | Formula | Represent one use of an Ingredient with role, mass, and local overrides |
| Process | Stable Process identity | Aggregate root | Accept process commands and protect ordered process input |
| AdditionStep | Sequence/identity within Process | Process | Represent one ordered addition/action and its process fields |
| Ingredient | Stable catalog identifier plus version | Supporting catalog | Provide reusable functional composition and source metadata without local mutation |

### Value objects

| Value object | Meaning and constraints |
|---|---|
| Mass | Finite V1 mass expressed in grams; an active Formula line or FlourComponent requires positive mass |
| BakerPercentage | Derived mass divided by the positive structural flour denominator; never the authoritative input quantity |
| FlourBlendFraction | Normalized FlourSystem member fraction; derived/validated against the V1 normalization tolerance |
| IngredientRole | One of `Structural`, `ContinuousPhase`, `Inclusion`, `SurfaceTreatment`, `Filling`, `Topping`, or `Other` |
| ValueState<T> | `Known`, explicit `None`, or `Unknown`; numeric zero remains a known numeric value |
| FunctionalComposition | Model-facing water, fat, protein subclasses, starch, sugar, physical state, and related fields with value states |
| CompositionOverride | Formula-line-local replacement/completion of catalog composition, with provenance and confidence |
| AvailabilityOverride | Formula-line-local availability coefficient or state, distinct from data availability |
| Provenance | Source, method, timestamp/version, and attribution for a supplied or derived value |
| Confidence | Numeric evidence-strength metadata in `[0,1]`; not a similarity or probability value |
| Coverage | Numeric proportion in `[0,1]` of a requested metric/path supported by available applicable inputs |
| ValidationIssue | Canonical code, severity, affected object, violated rule, and correction guidance |
| NormalizationOutcome | Deterministic result containing validity/readiness, denominator, derived percentages, preserved unknowns, diagnostics, coverage inputs, and provenance |
| FormulaProcessReference | Versioned pairing reference used when a Formula and Process are assembled for analysis |

## Aggregate invariants

### V1 normalization tolerance policy

The V1 policy identifier is `formula-normalization-v1`. A complete FlourSystem
passes the flour-blend sum check when the normalized member percentages sum to
`100.00% ± 0.01` percentage points, inclusive; equivalently, the accepted
range is `[99.99%, 100.01%]`. The policy identifier travels with normalized
results and is versioned independently from UI formatting.

### Formula and FlourSystem invariants

1. A Formula must contain at least one positive-mass, flour-bearing
   `FlourComponent` eligible for the structural denominator.
2. Each active Formula line and FlourComponent has a finite, positive mass in
   grams in V1. Missing, non-finite, zero, and negative masses are invalid for
   normalization.
3. The structural flour denominator is:

   `F = sum(mass of positive-mass structural FlourComponents)`

   A non-flour IngredientLine with role `Structural` does not enter `F`.
4. Every BakerPercentage is derived from `mass / F * 100` after `F` is
   established. A user-entered percentage cannot silently override mass.
5. Flour blend fractions are derived or validated so that the complete set
   satisfies `formula-normalization-v1`. An incomplete or contradictory set
   produces a diagnostic rather than an invented value.
6. `ContinuousPhase` lines may participate in effective continuous-phase
   metrics. `Inclusion`, `SurfaceTreatment`, `Filling`, `Topping`, and `Other`
   remain outside that phase unless a later explicit policy says otherwise.
7. A Formula-line-local CompositionOverride or AvailabilityOverride cannot
   mutate the referenced Ingredient catalog definition or another line.
8. A custom functional Ingredient remains local to its Formula line unless a
   separate catalog-curation workflow promotes it.
9. Missing functional composition is represented as `Unknown`; it is not
   converted to zero, `None`, or an unsupported estimate.

### Process invariants

1. AdditionSteps have a deterministic order within Process.
2. Process fields preserve `Known`, explicit `None`, and `Unknown` states.
3. A known process value is not inferred from an unknown value, and an
   explicit `None` does not mean that the data is merely missing.
4. If an AdditionStep names a Formula line, the reference must resolve within
   the Formula/Process pair or produce a referential diagnostic.
5. Process edits cannot alter Formula composition, denominator membership,
   baker's percentages, or line-local overrides.

### Handoff invariants

1. A structurally invalid Formula cannot produce a normalized analysis input.
2. A structurally valid but incomplete Formula can produce a partial input;
   unsupported downstream metrics are marked unavailable and coverage or
   confidence is reduced.
3. Incomplete or unavailable Process data does not block composition-only or
   intrinsic analysis, but process-dependent outputs carry the appropriate
   limitation.
4. Every derived or preserved value retains semantic class, provenance,
   confidence, and model/version context where applicable.
5. Coverage and confidence are numeric proportions/estimates in `[0,1]`;
   presentation bands are derived and cannot replace the canonical values.

## Lifecycle and readiness

These are derived business states, not required persistence columns.

### Formula lifecycle

```text
Editing
  -> Invalid
  -> StructurallyValid
  -> Normalized
  -> PartialReady | AnalysisReady
```

- `Editing`: the Formula may be incomplete while the user is entering it.
- `Invalid`: at least one hard invariant fails; normalization is blocked.
- `StructurallyValid`: hard invariants pass; composition knowledge may still be
  incomplete.
- `Normalized`: denominator, blend fractions, baker's percentages, roles, and
  value states have been resolved without losing provenance.
- `PartialReady`: normalized input has honest gaps that limit downstream
  outputs.
- `AnalysisReady`: the required inputs for a requested analysis path are
  available; this does not mean every field in the domain is known.

`PartialReady` and `AnalysisReady` are path-dependent outcomes. The same
Formula may be ready for composition metrics and partial for process-dependent
classification.

### Process lifecycle

```text
Editing -> Incomplete | ProcessReady
```

`Incomplete` means the Process can be retained with explicit unknowns but does
not support every process-dependent analysis. `ProcessReady` means the fields
required by a requested process analysis path are known or explicitly not
applicable. `None` and `Unknown` remain values inside either state.

### IngredientLine lifecycle

An IngredientLine may be catalog-backed, custom, or locally overridden. These
are mutually understandable source states, not quality scores. A line can be
valid with incomplete composition and can be normalized without a complete
catalog definition when the missing values are preserved as unknown.

## Commands and domain behavior

The following commands describe business behavior. They do not prescribe UI
events or a particular application-service framework.

| Command | Aggregate target | Result |
|---|---|---|
| Create Formula | Formula | New editable Formula with empty/initial FlourSystem and no fabricated defaults |
| Add or Change FlourComponent | Formula | FlourSystem updated; denominator readiness recalculated |
| Add or Change IngredientLine | Formula | Line mass, role, source, and local state validated |
| Apply CompositionOverride | Formula / IngredientLine | Local functional composition changed with provenance; catalog unchanged |
| Apply AvailabilityOverride | Formula / IngredientLine | Local availability changed without changing data-availability state |
| Record Process | Process | Process fields and ordered additions retained with tri-state values |
| Validate Formula | Formula | ValidationIssue set and structural readiness outcome |
| Normalize Formula | Formula | Deterministic denominator, blend fractions, baker's percentages, and retained unknowns |
| Normalize Process | Process | Ordered process representation and process diagnostics |
| Prepare Analysis Input | Formula + Process reference | Versioned pair/snapshot with readiness, provenance, coverage limits, and diagnostics |

## Domain services and policies

These services exist because the behavior spans owned values or must remain
pure and deterministic. They are domain responsibilities, not mandatory class
names.

### FormulaValidator

Checks hard invariants, including positive masses, positive structural flour,
role eligibility, blend consistency, supported units, and resolvable process
references where relevant. It returns structured ValidationIssues and does not
silently repair contradictory values.

### FlourDenominatorCalculator

Selects only positive-mass flour-bearing structural components and calculates
`F`. It is the sole domain rule for the baker's flour denominator.

### BakerPercentageCalculator

Derives baker's percentages from authoritative masses and `F`. The output is
marked `Calculated` and carries the Formula/model version context.

### FunctionalCompositionResolver

Resolves catalog Ingredient data, custom functional definitions, and
line-local overrides into a model-facing FunctionalComposition while
preserving value states, provenance, and confidence. It never writes to the
catalog.

### FormulaNormalizer

Coordinates validation, flour-system normalization, baker's percentages,
role metadata, override resolution, and the NormalizationOutcome. It may
return a blocked outcome for invalid structure or a partial outcome for
honest incompleteness.

### ProcessNormalizer

Preserves AdditionStep order and process ValueState values, validates
references, and reports process readiness without changing Formula data.

### RoleParticipationPolicy

Defines which roles contribute to which downstream metric family. It prevents
role labels from being mistaken for product classification.

### PartialAnalysisPolicy

Determines whether a requested analysis path can continue, which outputs are
unavailable, and how coverage/confidence limitations must be carried forward.
It does not fabricate missing numeric values.

### AnalysisInputAssembler

Pairs a normalized Formula with a normalized Process reference/snapshot and
produces the downstream handoff. It checks cross-aggregate version and
reference consistency without merging their ownership boundaries.

## Meaningful domain events

These are conceptual business moments for tracing, diagnostics, or future
integration. They do not imply event sourcing.

- `FormulaCreated`
- `FlourSystemChanged`
- `IngredientLineAdded`
- `IngredientLineChanged`
- `LocalCompositionOverrideApplied`
- `FormulaValidationFailed`
- `FormulaNormalized`
- `ProcessRecorded`
- `ProcessNormalizationCompleted`
- `PartialAnalysisInputPrepared`
- `AnalysisInputPrepared`

The events must carry stable domain identifiers, affected object references,
semantic value states, provenance/version information, and the resulting
readiness/diagnostic summary when applicable.

## Failure and exception behavior

| Condition | Domain response | Downstream effect |
|---|---|---|
| No positive-mass structural flour | Invalid Formula and blocking ValidationIssue | No normalized analysis input |
| Missing/non-finite/zero/negative mass | Invalid affected line/component | Preserve other valid input; request correction |
| Non-flour line marked Structural | Keep role; exclude from denominator; diagnostic if ambiguity matters | No silent denominator inflation |
| Incomplete flour composition | Preserve `Unknown` fields | Partial metrics, reduced coverage/confidence |
| Contradictory blend fractions | ValidationIssue; do not invent a correction | Normalization blocked or blend-specific output unavailable |
| Missing Process field | Preserve `Unknown` | Process-dependent output becomes partial; composition path may continue |
| Explicitly absent Process element | Preserve `None` | No inference from absence |
| Catalog data overridden locally | Resolve local value only | Catalog and sibling lines unchanged |
| Unsupported count/volume input in V1 | Reject or require mass entry | No implicit conversion or false precision |
| Unresolvable Process-to-line reference | Process diagnostic | Affected process path limited; Formula composition remains isolated |

## Normalization and handoff contract

The conceptual output of Formula normalization contains:

1. Formula and line identities;
2. structural FlourSystem and denominator `F`;
3. derived FlourBlendFractions and BakerPercentages;
4. resolved FunctionalComposition values and explicit ValueStates;
5. IngredientRole participation metadata;
6. local override and catalog provenance;
7. validation/readiness diagnostics;
8. semantic output class (`Calculated`, `Estimated`, or `Heuristic`) where a
   value has been derived or interpreted; and
9. coverage/confidence limits for downstream analysis.

The Process handoff separately contains:

1. Process identity/version;
2. ordered AdditionSteps;
3. process field ValueStates;
4. process diagnostics and readiness; and
5. references to Formula line identities where additions are named.

The analysis boundary consumes the pair. It must not need to rediscover which
ingredients counted as flour, whether a missing value was unknown, or whether a
composition value came from a local override.

## Downstream read expectations

The model should make the following read views derivable without changing
domain ownership:

- formula structural summary and denominator explanation;
- ingredient-line table with roles, masses, baker's percentages, and source
  states;
- validation diagnostics with correction guidance;
- functional-composition coverage and unknown fields;
- process timeline with known/none/unknown markers;
- analysis readiness and partial-output explanation;
- provenance/confidence details for calculated and non-calculated values.

These are read/use-case projections, not persistence requirements.

## Extension points and deferred decisions

- Count/volume conversion can be added behind a future trusted conversion and
  uncertainty policy without changing the grams-first model.
- Additional ingredient catalog sources can implement the Ingredient reference
  boundary while preserving stable IDs, versions, provenance, and override
  isolation.
- Future catalog curation can promote a custom functional Ingredient without
  changing the FormulaLine-local semantics.
- Dataset ownership, collection, curation, and calibration remain outside this
  capability and must not be smuggled into normalization defaults.
- Locale labels, fallback behavior, and translated explanations remain
  presentation/content concerns; canonical identifiers and ValueStates remain
  language-neutral.
- Future numerical tolerance changes require a new versioned normalization
  policy; tolerance is never a UI convention.

## Traceability

| Model area | Source of truth |
|---|---|
| Vocabulary and distinctions | [Domain glossary](domain-glossary.md) |
| Product behavior and acceptance scenarios | [Node PRD](prd.md) |
| Gap decisions | [Requirements gap analysis](requirements-gap-analysis.md) |
| Formula/Process separation | [ADR-0002](../../agents/adr/0002-formula-process-separation.md) |
| Unknown is not zero | [ADR-0004](../../agents/adr/0004-unknown-is-not-zero.md) |
| Functional composition boundary | [ADR-0005](../../agents/adr/0005-functional-composition-boundary.md) |
| Calculated/Estimated/Heuristic semantics | [ADR-0001](../../agents/adr/0001-calculated-estimated-heuristic.md) |
| Cross-capability architecture | [Application architecture summary](../application-architecture-summary.md) |

## Quality gate assessment

- Language quality: passed; canonical distinctions are explicit and aligned
  with the glossary.
- Structural quality: passed; aggregate boundaries are justified by
  consistency, lifecycle ownership, and policy enforcement.
- Behavioral quality: passed; invariants, lifecycles, failures, and meaningful
  business events are represented.
- Neutrality quality: passed; no storage schema, framework, or package layout
  is required.
- Downstream usefulness: passed; the model supports use cases, contracts, and
  acceptance scenarios while preserving stable business behavior.
\n\n
