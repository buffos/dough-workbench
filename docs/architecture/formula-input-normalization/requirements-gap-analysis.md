# Formula Input and Normalization — Requirements Gap Analysis

Status: `specified`, Process vocabulary refinement resolved in v0.2
Date: 2026-09-07

## Resolution status

The user confirmed all five recommended decisions. The gaps are no longer
blocking for glossary and exact-artifact work; the decisions below are now
part of the capability truth.

## Scope and artifact inventory

This pass is scoped to the [Formula Input and Normalization](/capabilities/formula-analysis-workspace/formula-input-normalization.md) capability and its linked shared concerns.

Reviewed:

- the owning capability node and the Formula Analysis Workspace roll-up;
- the application PRD and application architecture summary;
- ADR-0002, ADR-0004, and ADR-0005;
- the formal domain specification, calibration strategy, and initial prototype
  catalog under `exploration/`.

The source material is strong on the Formula aggregate, flour denominator,
baker's percentages, ingredient roles, provenance, unknown values, process
separation, and downstream calculation boundaries. It is not yet precise
enough about the user-facing input workflow and partial-analysis outcomes.

## Resolved blocking gaps

### G1 — Validity and partial-analysis policy

- Category: underspecified workflow; missing failure path; missing policy.
- Impact: High. Different implementations could disagree on when analysis is
  blocked, which outputs are available, and how confidence changes.
- Evidence: The domain requires `F > 0` and at least one structural flour
  component, but does not define UI behavior for zero/negative mass, missing
  composition fields, or an absent Process.
- Required decision: distinguish hard-invalid input from incomplete-but-analyzable
  input. The recommended baseline is to reject only impossible formulas and
  allow partial results when data is missing, with unavailable metrics and
  lower coverage/confidence.
- Resolution: confirmed. No positive-mass structural flour or invalid mass
  blocks analysis; incomplete composition/process data yields partial analysis.

### G2 — Ingredient-role calculation semantics

- Category: missing policy or invariant; ambiguous boundary.
- Impact: High. The role changes composition, effective availability, and
  classification behavior, and therefore affects the domain model, contract,
  and acceptance scenarios.
- Evidence: The source correctly distinguishes raisins as `Inclusion` from
  banana puree integrated into a batter, but does not yet define which roles
  contribute to total composition, continuous-phase metrics, flour
  denominator, or process-sensitive estimates.
- Required decision: define the calculation participation of `Structural`,
  `ContinuousPhase`, `Inclusion`, `SurfaceTreatment`, `Filling`, `Topping`, and
  `Other`.
- Resolution: confirmed using the recommended participation policy. Only
  structural flour components contribute to the flour denominator;
  `ContinuousPhase` contributes to effective metrics; the remaining non-phase
  roles remain separate from the continuous phase.

### G3 — Catalog ingredients, custom functional ingredients, and overrides

- Category: missing boundary; missing policy.
- Impact: High. It determines whether the application can analyze an ingredient
  that is not in the catalog while preserving the `Named Ingredient ->
  Functional Composition` decision.
- Evidence: `IngredientLine` permits composition and availability overrides,
  while the product promise and central principle imply support for unknown or
  future ingredients. The ownership and confidence semantics of an override
  are not defined.
- Required decision: decide whether V1 accepts catalog references only, or also
  custom lines with explicit functional composition and per-line overrides.
  The safe recommendation is to allow custom functional composition without
  mutating the catalog, and to record provenance/confidence for every override.
- Resolution: confirmed. Custom functional ingredients and per-line overrides
  are allowed; catalog definitions remain immutable.

### G4 — Quantity and unit input policy

- Category: missing external behavior; missing boundary.
- Impact: High. It changes normalization, conversion rules, validation, UI
  controls, and deterministic test fixtures.
- Evidence: The canonical internal unit is grams, but the vertical slice
  includes eggs and other ingredients that users commonly enter by count or
  volume. The source does not say whether V1 accepts grams only or performs
  quantity conversion.
- Required decision: choose a V1 input contract. The lowest-risk baseline is
  grams only, with count/volume conversion deferred until a trusted conversion
  catalog exists.
- Resolution: confirmed. V1 accepts grams only.

### G5 — Process missingness versus explicit absence

- Category: ambiguous terminology; missing policy.
- Impact: High. It affects process modifiers, classification constraints,
  confidence, and the difference between “no fermentation” and “fermentation
  not supplied.”
- Evidence: The source permits unknown process values and defines `agent = None`
  as yeast potential zero, but the input workflow does not define how users
  express `None`, `Unknown`, or a partially described process.
- Required decision: preserve three states where applicable: known value,
  explicit absence, and unknown/not supplied. A missing Process should still
  allow composition/intrinsic analysis while reducing process coverage.
- Resolution: confirmed. `Known`, explicit `None`, and `Unknown` remain
  distinct, and incomplete Process does not block composition-only analysis.

### G6 — Algorithm-facing Process fields were still free-form

- Category: underspecified vocabulary and input control.
- Impact: High. A text field such as `prefermentType` or `foldSequence` can
  retain words that the normalization and future analysis layers cannot
  interpret consistently.
- Evidence: The first canonical field list named the paths and units but only
  froze enum values for the initial core fields. The exploratory Process model
  supplied examples for preferments, expansion targets, folds, fat state,
  geometry, and handling, but the UI exposed several of them as arbitrary
  text.
- Required decision: make every algorithm-facing Process value either a
  controlled enum, a typed number, or a stable Formula-line reference. Keep
  unknown values blank and make `Other` explicit rather than parsing prose.
- Resolution: confirmed and implemented as `process-input-v0.2`. The expanded
  vocabulary is recorded in the canonical domain model and glossary. The UI
  now uses dropdowns for categorical fields, a Formula-line selector for
  `laminationFat`, and numeric controls for measured quantities. Addition-step
  actions use a controlled vocabulary as well.

## Deferrable gaps

### D1 — Draft persistence and import/export

The current product is explicitly browser-only and has no server persistence.
For the first vertical slice, an in-memory draft is a safe assumption. Local
storage, shareable URLs, and import/export can be specified later without
changing the Formula aggregate.

### D2 — Formula metadata and naming

Formula name, notes, author, and source metadata are useful but do not block
normalization. They can be added as metadata fields after the validity and
provenance contract is stable.

### D3 — Display-unit conversion

The UI can initially render grams and percentages. Ounces, cups, spoons, and
ingredient-count helpers should remain outside the first exact contract unless
the user explicitly prioritizes them.

## Bounded assumptions that preserve progress

These assumptions are safe for the next artifact pass unless the user rejects
them:

1. The Formula cannot be analyzed when it has no positive-mass structural flour
   component; this is a hard validation error.
2. Missing composition or process data does not become zero. Partial analysis
   is returned with unavailable metrics, reduced coverage, and lower confidence.
3. `Formula` and `Process` remain independently editable and serializable.
4. Catalog definitions are immutable from the analysis UI. Any user override
   is local to the IngredientLine and carries explicit provenance.
5. V1 input is grams-first. Count/volume conversion is deferred until a
   conversion source and uncertainty policy exist.
6. Explicit `None` is distinct from `Unknown` for process agents and other
   applicable process fields.

## Confirmed decisions

1. Only impossible input blocks analysis; missing composition or Process data
   produces partial output with unavailable metrics and reduced confidence.
2. Only structural flour components contribute to the flour denominator.
   `ContinuousPhase` contributes to effective metrics; `Inclusion`,
   `SurfaceTreatment`, `Filling`, `Topping`, and `Other` remain separate from
   the continuous phase unless a later policy explicitly maps them.
3. V1 allows custom functional ingredients and per-line composition/availability
   overrides without mutating the catalog.
4. V1 accepts grams only, including eggs by mass.
5. Process fields distinguish `Known`, explicit `None`, and `Unknown`; an
   incomplete Process does not block composition-only analysis.

## Artifact impact assessment

- Topology: no impact; the node remains `bounded`.
- Capability truth: updated with this gap report and the next clarification
  boundary.
- Product truth: no impact; the application PRD already states partial,
  uncertainty-aware analysis and the same V1 boundary.
- Architecture truth: no impact; the current layer boundaries remain valid.
- Delivery truth: no impact; no issue or registry row is created during gap
  analysis.

The report is complete for this refinement round. The capability remains
specified; the next delivery gate is grouped bilingual visual review of the
updated Process controls.
