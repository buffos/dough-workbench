# Formula Input and Normalization — Canonical Use-Case Model

Status: Canonical application-layer model for downstream contract work
Version: v0.1
Date: 2026-09-07

This document defines the stable application-layer intents between the Formula
Input domain model and future interfaces. It does not define HTTP endpoints,
CLI flags, Svelte actions, Astro routes, storage tables, or package layout.

The source of domain behavior is the
[canonical domain model](canonical-domain-model.md). Product scope and
acceptance scenarios are in the [node PRD](prd.md).

## Purpose

Provide business-capable operations that let a Formula Explorer create and
correct a Formula, record an independent Process, normalize valid input, and
prepare an honest analysis handoff without moving domain rules into UI or
transport code.

The initial frontend implementation may keep the working state in memory. The
use-case surface still names the application responsibilities explicitly so a
later adapter or persistence choice cannot change the product behavior.

## Application-layer goals

The application layer must:

- expose intent-based commands and queries rather than screen or CRUD
  concepts;
- coordinate Formula, Process, and Ingredient catalog references;
- preserve the Formula/Process consistency boundary;
- return business-meaningful readiness, validation, partial-analysis, and
  normalization outcomes;
- keep domain invariants in the domain model and policies;
- provide stable read views for bilingual presentation and downstream
  analysis; and
- make retry, revision, and snapshot expectations explicit even though V1 is
  browser-only.

## Design principles

### Intent-based naming

Names describe what the Formula Explorer or system is trying to accomplish:
`AddIngredientLineToFormula`, `NormalizeFormula`, and
`PrepareAnalysisInput`, not `UpdateFormulaEntity` or `ProcessEntity`.

### Command/query separation

Commands may change a draft or create a derived snapshot. Queries return a
view, explanation, or readiness result and must not mutate Formula, Process,
or catalog state.

### Domain behavior stays in the domain

The application layer loads state, invokes Formula/Process behavior and domain
policies, commits a coherent state change, and maps the outcome. It does not
calculate a denominator, decide role participation, turn unknown into zero,
or translate catalog data itself.

### Architecture neutrality

The same use cases can be implemented as local store operations, application
services behind a clean input port, transaction scripts, or a modular
monolith. No use case assumes a network, account, backend, or database.

### Honest incomplete outcomes

Incomplete but structurally valid data is a successful business outcome with
limitations, not an application exception. Hard invalidity remains a visible
failure outcome.

### Stable canonical identity

Formula IDs, Process IDs, Ingredient IDs, line IDs, role identifiers, value
states, model versions, and diagnostic codes remain language-neutral. English
and Greek labels are mapped later by presentation/content adapters.

## Application boundaries

### Formula authoring service

Coordinates Formula aggregate changes: starting a draft, defining the flour
system, adding or adjusting ingredient lines, and applying line-local
overrides. All composition edits share the Formula aggregate consistency
boundary.

### Process capture service

Coordinates creation and editing of the separate Process aggregate and its
ordered AdditionSteps. It never rewrites Formula composition.

### Normalization and analysis-preparation service

Coordinates validation, normalization, catalog snapshot resolution, partial
readiness, and the paired Formula/Process handoff. It invokes domain services;
it does not reimplement them.

### Ingredient knowledge query service

Reads versioned Ingredient definitions and source metadata for selection and
inspection. It does not expose a mutation that changes the shared catalog from
the Formula workflow.

## Canonical commands

Commands are listed by business intent. Their names are stable application
concepts, not transport operation names.

### `StartFormulaDraft`

**Intent:** Begin an editable Formula for exploration.

**Inputs:** optional client-supplied Formula identity, locale-independent
metadata, and command identity.

**Preconditions:** none beyond a valid command identity.

**Application responsibilities:**

1. establish a new Formula draft without inventing ingredient masses or
   composition values;
2. initialize a FlourSystem that is allowed to be empty while editing;
3. record the draft revision and origin metadata; and
4. return the draft summary and next readiness state.

**Outcomes:** `FormulaDraftStarted`, or an invalid-command failure. An empty
draft is editable but not normalizable.

### `AddFlourComponentToFormula`

**Intent:** Add a flour-bearing member to the Formula's FlourSystem.

**Inputs:** Formula identity, component identity, ingredient/catalog reference
or custom flour definition, mass in grams, optional flour properties, and
command/revision metadata.

**Preconditions:** Formula exists and the mass/unit shape is acceptable to the
command boundary. Positive-mass enforcement is a domain rule.

**Application responsibilities:** load the Formula, invoke the FlourSystem
behavior, commit one Formula revision, and return denominator/readiness
diagnostics.

**Outcomes:** updated Formula draft; invalid mass or rule-violation outcome;
stale-draft outcome if an expected revision is supplied and no longer matches.

### `AddIngredientLineToFormula`

**Intent:** Add one Formula-specific use of an Ingredient.

**Inputs:** Formula identity, line identity, Ingredient catalog identifier and
version or custom functional definition, positive mass in grams, role, local
provenance, optional composition/availability overrides, and command/revision
metadata.

**Preconditions:** Formula exists; role is canonical; unit is grams in V1.

**Application responsibilities:** resolve/read the requested catalog snapshot
when applicable, invoke Formula line behavior, keep the local override scoped
to the line, commit one Formula revision, and return the updated line view.

**Outcomes:** line added; invalid mass/unit/role; missing catalog definition;
or stale-draft outcome. Incomplete composition is accepted as a partial-data
state when structural Formula rules remain satisfiable.

### `AdjustIngredientLineInFormula`

**Intent:** Change the mass, role, source, or editable metadata of an existing
Formula line without changing the shared Ingredient catalog.

**Inputs:** Formula identity, line identity, changed fields, and command/revision
metadata.

**Preconditions:** Formula and line exist; changed values satisfy command
shape; the domain validates the resulting aggregate.

**Application responsibilities:** load the Formula, apply the domain change as
one aggregate operation, recalculate readiness preview, and commit the new
revision.

**Outcomes:** updated line and Formula summary; resource-not-found,
validation, business-rule, or stale-draft outcome.

### `ApplyLocalCompositionOverride`

**Intent:** Supply or replace functional composition for one Formula line.

**Inputs:** Formula identity, line identity, override values/value states,
provenance, confidence, and command/revision metadata.

**Preconditions:** Formula and line exist; override fields are valid functional
composition fields; provenance/confidence shape is present.

**Application responsibilities:** invoke the local override policy, retain the
catalog definition as read-only, record the override provenance, and commit
one Formula revision.

**Outcomes:** local override applied; invalid override; missing line; or stale
revision. The result may still be incomplete if some fields remain unknown.

### `ApplyLocalAvailabilityOverride`

**Intent:** Set a line-local availability value without confusing it with data
availability or mutating the catalog.

**Inputs:** Formula identity, line identity, availability field/value state,
provenance, confidence, and command/revision metadata.

**Preconditions:** Formula and line exist; coefficient/range and ValueState
rules are valid.

**Application responsibilities:** invoke the availability override policy,
preserve the distinction between `Unknown`, `None`, zero, and an availability
coefficient, and commit one Formula revision.

**Outcomes:** override applied; invalid range/state; missing line; or stale
revision.

### `RecordProcessForFormula`

**Intent:** Create or change the independent Process associated with a Formula
exploration.

**Inputs:** Process identity, Formula pairing identity, ordered process fields,
AdditionSteps, ValueStates, and command/revision metadata.

**Preconditions:** Process identity is valid; any named Formula line reference
must resolve when the pair is assembled. Incomplete fields are allowed.

**Application responsibilities:** load the Process, preserve order and
tri-state values, validate process-local structure, commit one Process
revision, and return process readiness without modifying Formula composition.

**Outcomes:** Process recorded as complete or incomplete; process validation
diagnostics; unresolvable line reference; or stale-process outcome.

### `ValidateFormulaForNormalization`

**Intent:** Determine whether the current Formula can be normalized and explain
what must be corrected.

**Inputs:** Formula identity, optional requested analysis path, and optional
catalog snapshot/version context.

**Preconditions:** Formula exists.

**Application responsibilities:** load a coherent Formula snapshot, invoke
`FormulaValidator`, resolve only the catalog data needed to validate the
requested path, and return structured ValidationIssues plus readiness.

**Outcomes:** valid, incomplete-but-normalizable, invalid, or unavailable
catalog-source outcome. This command is logically diagnostic; it may update a
derived validation view but must not invent or mutate domain values.

### `NormalizeFormula`

**Intent:** Produce a deterministic normalized Formula outcome from the current
Formula composition.

**Inputs:** Formula identity, requested model/version policy, and expected
Formula revision.

**Preconditions:** Formula exists and the expected revision, when supplied,
matches. A hard-invalid Formula cannot be normalized.

**Application responsibilities:**

1. load one coherent Formula snapshot;
2. read the versioned Ingredient definitions needed for that snapshot;
3. invoke FormulaNormalizer and its domain policies;
4. retain all unknown/none/zero distinctions and provenance;
5. commit or cache the derived NormalizationOutcome against the Formula
   revision; and
6. return the result plus partial-analysis limits.

**Outcomes:** normalized complete outcome; normalized partial outcome;
blocking ValidationIssues; catalog/version mismatch; or stale-draft outcome.

### `PrepareAnalysisInput`

**Intent:** Assemble the normalized Formula and independent Process into the
   versioned input expected by downstream analysis.

**Inputs:** Formula identity/revision, Process identity/revision, requested
analysis path, catalog/model versions, and optional operation identity.

**Preconditions:** Formula is structurally normalizable; Process may be
incomplete but must be represented by a coherent snapshot. Any required
Formula-to-Process line references must resolve.

**Application responsibilities:**

1. load Formula and Process snapshots without merging ownership;
2. confirm revisions and catalog/model versions are compatible;
3. invoke Formula and Process normalization if a current result is absent;
4. invoke the PartialAnalysisPolicy for the requested path;
5. invoke AnalysisInputAssembler; and
6. return a paired handoff with diagnostics, coverage, confidence limits, and
   provenance.

**Outcomes:** analysis-ready input; partial analysis input; blocked structural
input; process/reference mismatch; or version conflict. An incomplete Process
does not block composition-only preparation.

## Canonical queries

Queries return views or snapshots and do not change Formula, Process, or
catalog state.

### `GetFormulaDraft`

Returns the current Formula editing view: flour components, ingredient lines,
roles, masses, local overrides, provenance summaries, revision, and current
readiness.

### `GetFormulaReadiness`

Returns structural validity, missing required corrections, incomplete-but-valid
fields, and readiness by requested analysis path. It distinguishes blocking
validation failures from limitations.

### `GetNormalizationExplanation`

Returns how the structural flour denominator was selected, which lines count or
do not count, how baker's percentages were derived, which values are unknown,
and which local overrides contributed.

### `GetProcessTimeline`

Returns ordered AdditionSteps and process fields with Known/None/Unknown
markers, references, diagnostics, and process readiness.

### `GetAnalysisHandoffSummary`

Returns the latest Formula/Process paired snapshot summary, model/catalog
versions, coverage, confidence limits, unavailable outputs, and provenance.
It does not run a new mutation.

### `GetIngredientDefinitions`

Returns versioned catalog definitions, functional composition summaries,
provenance, and confidence for selection or inspection. It never returns a
mutation capability for the shared catalog in this workflow.

### `GetIngredientDefinitionDetails`

Returns the explainable composition and source view for one Ingredient catalog
definition, including fields that are Unknown rather than presenting them as
zero.

### `PreviewBakerPercentages`

Calculates a read-only preview from a coherent Formula draft using the domain
calculator. It returns the same denominator rule and diagnostics as
normalization but does not commit a normalized outcome.

## Command and query shape

The conceptual command envelope contains:

- `commandId`: stable operation identity for retry handling;
- target aggregate identity (`formulaId`, `processId`, and where relevant
  `lineId`/`componentId`);
- intent-specific payload in canonical units and identifiers;
- optional expected aggregate revision;
- source/provenance metadata where user or catalog data is supplied; and
- model/catalog policy version where normalization is requested.

The conceptual command result contains:

- operation outcome (`completed`, `partial`, `rejected`, or `conflict`);
- updated aggregate/read-model snapshot when state changed;
- canonical diagnostics and correction guidance;
- new revision/version identifiers; and
- conceptual domain/application events when relevant.

The conceptual query shape contains:

- target identity and requested view/options;
- an optional coherent revision or model version;
- a read result with canonical IDs and semantic value states;
- coverage/confidence/provenance where the view includes derived knowledge;
- diagnostics that explain limitations; and
- localized presentation mapping deferred to the caller/adapter.

## Transaction and consistency expectations

The initial frontend has no server transaction. These boundaries still define
what must change together in any implementation.

| Use-case group | Consistency boundary | Transaction expectation |
|---|---|---|
| Start or edit Formula composition | Formula aggregate | One atomic draft-state transition |
| Apply a line-local override | Formula aggregate | Atomic with the target line; catalog remains read-only |
| Record Process | Process aggregate | One atomic Process transition |
| Validate Formula | Formula snapshot plus catalog reads | Read-consistent snapshot; no shared mutation |
| Normalize Formula | Formula snapshot plus versioned catalog reads | Derived outcome tied to one Formula revision/model version |
| Prepare Analysis Input | Formula + Process + catalog/model snapshots | Coordinated read snapshot; no distributed write transaction |
| Formula/Process/Ingredient queries | Read models or coherent snapshots | No mutation; consistency appropriate to the requested view |

`PrepareAnalysisInput` is the only coordinated use case in this capability. It
must not solve coordination by merging Formula and Process ownership. A future
persistent implementation may use a snapshot, revision fence, or equivalent
read-consistency mechanism.

## Idempotency and retry expectations

V1 has no remote command retry path, but duplicate local events or a future
adapter must not produce surprising duplicates.

| Operation | Retry expectation |
|---|---|
| `StartFormulaDraft` | If a client supplies the same `commandId`/Formula identity, return the same draft outcome rather than create a second draft. |
| `AddFlourComponentToFormula` | Use a stable component identity or command identity; replay updates the same intended component rather than appending an accidental duplicate. |
| `AddIngredientLineToFormula` | Use a stable line identity/command identity; replay must not create a second line. |
| `AdjustIngredientLineInFormula` and override commands | Set-style operations are idempotent for the same target, payload, and revision; stale revisions return conflict rather than silently overwrite. |
| `RecordProcessForFormula` | Replace/update the addressed Process revision; replay must not duplicate AdditionSteps. |
| `NormalizeFormula` | Deterministic for the same Formula/catalog/model revision; replays may reuse the same outcome. |
| `PrepareAnalysisInput` | Deterministic for the same paired revisions and model policy; replay may reuse the same handoff. |
| Queries | Naturally repeatable for the same coherent revision; no mutation is permitted. |

## Application-level failure model

Failures are business outcomes and should remain distinguishable in any
transport or UI adapter.

| Failure class | Meaning | Examples |
|---|---|---|
| Invalid command | The operation envelope cannot be understood | Missing target identity, unsupported unit, malformed value state |
| Resource not found | Referenced local or catalog object does not exist | Unknown Formula, line, Process, or Ingredient version |
| Business rule violation | The requested result would break a domain invariant | No positive structural flour, invalid mass, contradictory blend |
| Incomplete accepted outcome | Work is valid but knowledge is limited | Unknown composition or incomplete Process |
| Stale revision/conflict | The caller acted on an older aggregate snapshot | Concurrent/future adapter edit or replay against a changed draft |
| Reference/version mismatch | The Formula/Process/catalog/model set is not a coherent handoff | AdditionStep points to a missing line; catalog version changed |
| Source unavailable | Required supporting knowledge cannot be read | Future external catalog/provider unavailable |
| Infrastructure failure | The adapter cannot complete a technically required operation | Storage or runtime failure in a future deployment |

The UI may translate these into Greek or English messages, but the canonical
failure code and affected object remain language-neutral.

## Application-boundary events

The application layer may publish or hand off these stable moments for read
models, audit, or future integrations:

- `FormulaDraftStarted`
- `FormulaCompositionChanged`
- `FormulaOverrideChanged`
- `ProcessRecorded`
- `FormulaNormalizationRejected`
- `FormulaNormalized`
- `PartialAnalysisInputPrepared`
- `AnalysisInputPrepared`

An event is emitted only after the corresponding state transition or derived
outcome is coherent. It carries aggregate identity, revision, model/catalog
versions where relevant, semantic value-state metadata, and diagnostic summary.
No event should expose translated display text as the canonical payload.

## End-to-end use-case chains

### Valid Formula with optional Process

```text
StartFormulaDraft
  -> AddFlourComponentToFormula
  -> AddIngredientLineToFormula (repeat)
  -> RecordProcessForFormula (optional/incomplete allowed)
  -> ValidateFormulaForNormalization
  -> NormalizeFormula
  -> PrepareAnalysisInput
  -> downstream composition/process/classification analysis
```

The success condition is a normalized handoff with denominator, baker's
percentages, roles, provenance, and explicit readiness limits.

### Invalid input correction

```text
AddIngredientLineToFormula or AddFlourComponentToFormula
  -> ValidateFormulaForNormalization
  -> BusinessRuleViolation with affected object and correction guidance
  -> AdjustIngredientLineInFormula / AddFlourComponentToFormula
  -> ValidateFormulaForNormalization
  -> NormalizeFormula
```

The application preserves valid sibling input and does not discard the draft
just because one command outcome is rejected.

### Incomplete but structurally valid Formula

```text
Build Formula with unknown composition
  -> ValidateFormulaForNormalization
  -> NormalizeFormula
  -> PartialAnalysisInputPrepared
  -> downstream results with unavailable metrics and reduced coverage/confidence
```

Unknown fields remain unknown; no query or command inserts zero as a fallback.

### Local override isolation

```text
GetIngredientDefinitions
  -> AddIngredientLineToFormula
  -> ApplyLocalCompositionOverride
  -> NormalizeFormula
  -> GetIngredientDefinitionDetails (unchanged catalog)
```

The Formula line receives the local value while the catalog definition and any
other Formula line remain unchanged.

### Independent Process editing

```text
RecordProcessForFormula
  -> GetProcessTimeline
  -> Adjust Formula composition independently
  -> PrepareAnalysisInput using coherent Formula and Process revisions
```

Process edits never rewrite composition. If Process is incomplete, composition
and intrinsic analysis can still be prepared while process-dependent outputs
report their limits.

### Bilingual presentation

The same commands, queries, IDs, value states, diagnostics, and outcomes are
used for English and Greek presentation. Only the adapter maps canonical labels
and explanation copy to `/en/` or `/el/`; changing locale does not create a new
Formula or rerun a semantically different use case.

## Traceability to acceptance scenarios

| Use-case surface | PRD scenarios |
|---|---|
| Flour denominator and normalization | AS-01, AS-02, AS-03 |
| Unknown preservation and partial outcome | AS-04, AS-09 |
| Role participation | AS-05 |
| Local custom/override isolation | AS-06 |
| Grams-only command shape | AS-07 |
| Process tri-state | AS-08 |
| Bilingual adapter parity | AS-10 |

## Mapping guidance for implementations

### Static frontend / local reactive state

Application services can operate over an in-memory Formula/Process draft store,
use pure domain functions for validation and normalization, and read static
versioned catalog files through a catalog adapter. Command results update local
state; query views feed Astro/Svelte presentation. No browser storage is
required by this model.

### Layered or hexagonal implementation

Commands become input ports, application services coordinate repositories and
catalog adapters, and the domain model remains framework-independent. A
repository may persist Formula/Process snapshots later without changing the
intent names or failure categories.

### Future remote or collaborative implementation

The existing command identity, expected revisions, idempotency, and paired
snapshot rules provide a starting point for concurrency control. This is a
future extension, not a V1 requirement.

## Quality gate assessment

- Intent quality: passed; commands are named after Formula Explorer and
  analysis intents.
- Structural quality: passed; commands, queries, service boundaries, and
  orchestration-heavy handoff are separated.
- Behavioral quality: passed; preconditions, outcomes, failures, transaction
  expectations, and retry semantics are visible.
- Neutrality quality: passed; no HTTP, CLI, framework, or package assumptions.
- Downstream usefulness: passed; a later contract model can map the command and
  query shapes, and acceptance tests can target each use-case outcome.
\n\n
