# Formula Input and Normalization — Acceptance Scenarios

Status: Canonical behavior scenarios for implementation and verification
Version: v0.2
Date: 2026-09-07

These scenarios define externally observable behavior for the Formula Input and
Normalization capability. They are derived from the
[node PRD](prd.md), [canonical domain model](canonical-domain-model.md),
[canonical use cases](canonical-use-cases.md), and
[canonical contract](canonical-api-cli-contract.md).

They are not UI test scripts, HTTP tests, or implementation checklists. A
frontend, local application service, future API, or future CLI must preserve
the same business outcome.

## Verification surface policy

The root verification policy applies to every scenario:

- backend boundary: `not-applicable` for V1 because the product is
  frontend-only;
- frontend integration: `when-supported`, using the actual formula-analysis
  workspace action and visible result;
- end-to-end journey: `catalog-only` until a suitable browser harness exists.

Each scenario records these surfaces explicitly. “Frontend integration” means
the behavior must be reachable through the product surface, not only through a
domain function or hidden state.

## Scenario index

| ID | Title | Main behavior |
|---|---|---|
| SC-001 | Normalize a valid multi-flour Formula | Happy path, denominator, baker's percentages |
| SC-002 | Block Formula without structural flour | Hard validation failure |
| SC-003 | Reject invalid mass and preserve valid siblings | Failure isolation |
| SC-004 | Preserve Unknown and return partial analysis | Unknown is not zero |
| SC-005 | Preserve calculated semantics and provenance | Calculated vs estimated/heuristic |
| SC-006 | Apply role participation without product classification | Role policy branch |
| SC-007 | Isolate custom functional data and local overrides | Named ingredient to composition, override isolation |
| SC-008 | Enforce grams-only input | Unit policy |
| SC-009 | Record Process with ordered tri-state fields | Process capture |
| SC-010 | Continue composition analysis with incomplete Process | Partial handoff |
| SC-011 | Keep Formula and Process changes independent | Separate consistency boundaries |
| SC-012 | Reject an incoherent paired handoff | Revision/reference conflict |
| SC-013 | Replay a retry-sensitive command safely | Idempotency |
| SC-014 | Explain normalization and limitations | Read-side visibility |
| SC-015 | Preserve bilingual parity and reachability | Greek/English product surface |
| SC-016 | Enforce the versioned flour-blend tolerance | Deterministic boundary validation |

## SC-001 — Normalize a valid multi-flour Formula

**Purpose:** Prove the primary Formula construction and normalization path.

**Given**

- a Formula Explorer starts a Formula in the formula-analysis workspace;
- the Formula contains two positive-mass flour-bearing structural components;
- the Formula contains ingredient lines with valid positive masses in grams; and
- the flour blend is complete and satisfies the inclusive
  `formula-normalization-v1` tolerance.

**When**

The Formula Explorer validates and normalizes the Formula.

**Then**

- normalization completes;
- the structural flour denominator equals the sum of the two flour masses;
- every baker's percentage is derived from that denominator;
- blend fractions are normalized/validated against 100%;
- the Formula is visibly shown as normalized/ready for the requested analysis;
  and
- the result identifies these derived values as `Calculated` and retains
  provenance/model version metadata.

**Rule/coverage:** Structural Flour Denominator Rule; Baker's Percentage;
Formula lifecycle `Editing -> StructurallyValid -> Normalized`.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-002 — Block Formula without structural flour

**Purpose:** Prove the hard validity boundary rather than allowing a zero or
missing denominator.

**Given**

- a Formula contains ingredient lines but no positive-mass flour-bearing
  structural component; and
- the Formula Explorer requests validation or normalization.

**When**

The Formula is checked for normalization.

**Then**

- normalization is rejected;
- the visible result identifies `MISSING_STRUCTURAL_FLOUR`;
- the correction guidance says that at least one positive-mass structural flour
  component is required;
- no denominator or baker's percentages are fabricated; and
- valid entered lines remain available for correction.

**Rule/coverage:** Formula invariant F > 0; invalid input must not become
partial analysis.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-003 — Reject invalid mass and preserve valid siblings

**Purpose:** Prove that one invalid work item does not erase unrelated valid
input.

**Given**

- a Formula has a valid structural flour component and one valid ingredient
  line;
- a second ingredient line has a missing, non-finite, zero, or negative mass.

**When**

The Formula Explorer attempts to normalize the Formula.

**Then**

- the operation is rejected with `INVALID_MASS` on the affected line;
- the invalid line is identified with correction guidance;
- the valid flour and sibling line remain visible and unchanged; and
- after the affected line is corrected, normalization can be attempted again
  without reconstructing the Formula.

**Rule/coverage:** Positive Mass invariant; failure × independent work.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-004 — Preserve Unknown and return partial analysis

**Purpose:** Prove `Unknown ≠ 0` and the partial-analysis policy.

**Given**

- the Formula has valid structural flour and valid masses;
- one ingredient's water, protein, or process-relevant composition field is
  not established; and
- the missing field is represented as `Unknown`, not numeric zero.

**When**

The Formula Explorer normalizes the Formula and requests the supported
analysis path.

**Then**

- normalization succeeds with a partial outcome;
- the unknown field remains visibly `Unknown` in the formula/analysis result;
- no zero contribution is silently inserted;
- supported calculations remain available;
- affected metrics are marked unavailable or limited; and
- coverage/confidence visibly reflects the missing knowledge.

**Rule/coverage:** Unknown is not zero; Partial Analysis Policy; lossless
uncertainty.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-005 — Preserve calculated semantics and provenance

**Purpose:** Prove that the product distinguishes arithmetic facts from
assumptions and heuristics.

**Given**

- a Formula can calculate its flour denominator and baker's percentages from
  known masses;
- another functional field is estimated or unknown; and
- no downstream heuristic classification has been requested yet.

**When**

The Formula Explorer opens the normalized explanation.

**Then**

- denominator and baker's percentages are labeled `Calculated`;
- any estimate is labeled `Estimated` and carries its assumption/provenance;
- no unavailable field is presented as `Heuristic` or as a probability; and
- the visible explanation distinguishes the source and confidence of each
  result.

**Rule/coverage:** Calculated vs Estimated vs Heuristic architectural
decision; Trust, Provenance, and Uncertainty shared concern.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-006 — Apply role participation without product classification

**Purpose:** Prove that roles control metric participation and are not treated
as product labels.

**Given**

- a banana puree line is assigned `ContinuousPhase`;
- a raisin line is assigned `Inclusion`; and
- both lines have valid masses and are part of the same Formula.

**When**

The Formula is normalized and the role/participation explanation is viewed.

**Then**

- both roles remain distinct in the visible normalized Formula;
- the puree is eligible for effective continuous-phase metrics;
- the raisin remains separate from that phase unless a later explicit policy
  maps it;
- neither role is presented as a product classification; and
- downstream consumers receive role participation metadata.

**Rule/coverage:** Role Participation Policy; named Ingredient is not a
classification result.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-007 — Isolate custom functional data and local overrides

**Purpose:** Prove the boundary between a shared Ingredient definition and a
Formula-specific IngredientLine.

**Given**

- two Formula lines reference the same catalog Ingredient;
- one line receives a custom functional composition or availability override;
  and
- a different line uses the catalog value without an override.

**When**

The Formula is normalized and the catalog/line details are viewed.

**Then**

- the overridden line uses its local value with provenance/confidence;
- the other line remains based on the catalog value;
- the shared catalog definition is visibly unchanged;
- the override does not leak into another Formula or line; and
- a custom functional Ingredient remains local unless a separate curation
  workflow promotes it.

**Rule/coverage:** Named Ingredient -> Functional Composition;
Override Isolation Policy; catalog immutability.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-008 — Enforce grams-only input

**Purpose:** Prove that V1 does not create false precision through implicit
count/volume conversion.

**Given**

- the Formula Explorer adds an egg or another countable ingredient; and
- the input is supplied as a count or volume rather than mass.

**When**

The Formula Explorer attempts to accept or normalize the line.

**Then**

- the input is rejected or clearly requires a mass in grams;
- `UNSUPPORTED_UNIT` is visible with correction guidance;
- no implicit conversion is performed; and
- when the same ingredient is entered by positive grams, the line can be
  normalized normally.

**Rule/coverage:** Unit Policy; grams-only V1.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-009 — Record Process with ordered tri-state fields

**Purpose:** Prove Process capture as a separate object and preserve
Known/None/Unknown semantics.

**Given**

- a Formula has valid composition;
- the Formula Explorer records a known mixing method;
- the Formula Explorer selects a controlled preferment/expansion/fold value
  rather than entering a free-form instruction;
- a lamination-fat field, when used, points to an existing Formula line; and
- fermentation is not supplied and is marked `Unknown`; and
- lamination is explicitly absent and is marked `None`.

**When**

The Process is saved/normalized and its timeline is viewed.

**Then**

- the known mixing method is visible;
- fermentation remains `Unknown` rather than zero or `None`;
- lamination remains `None` rather than `Unknown`;
- categorical Process values remain canonical IDs and an unresolved
  Formula-line reference produces a referential diagnostic;
- ordered AdditionSteps remain in their recorded order; and
- the Process revision changes independently from Formula composition.

**Rule/coverage:** Formula vs Process; Value-State Policy; Process lifecycle.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-010 — Continue composition analysis with incomplete Process

**Purpose:** Prove that incomplete Process data limits only the affected
analysis paths.

**Given**

- the Formula is structurally valid and normalized;
- the Process contains some known values and some unknown fields; and
- the requested analysis includes composition/intrinsic metrics plus optional
  process-dependent metrics.

**When**

The Formula and Process are prepared as an analysis input pair.

**Then**

- the paired input is accepted as partial;
- composition/intrinsic outputs remain available;
- process-dependent outputs identify their reduced coverage/confidence or
  unavailable status;
- the unknown Process fields remain unknown; and
- the visible workspace explains why the result is partial.

**Rule/coverage:** Partial Analysis Policy; Process/Effective Behavior
boundary.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-011 — Keep Formula and Process changes independent

**Purpose:** Prove the architectural separation between what is present and
how it is handled.

**Given**

- a Formula and Process have both been normalized;
- the Formula has a stable denominator and baker's percentages; and
- a Process field or AdditionStep is changed without changing any ingredient
  line.

**When**

The Formula/Process pair is prepared again.

**Then**

- the Formula composition, denominator, baker's percentages, and line-local
  overrides remain unchanged;
- the Process revision and affected process outputs change;
- the new pair is traceable to the new Process revision; and
- no composition value is inferred from the Process change.

**Rule/coverage:** Formula vs Process separation; mutation × execution.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-012 — Reject an incoherent paired handoff

**Purpose:** Prove that analysis does not silently combine incompatible
Formula/Process snapshots.

**Given**

- a Process AdditionStep references a Formula line that no longer exists, or
  the requested Formula/Process revisions cannot form one coherent snapshot.

**When**

The Formula Explorer prepares the analysis input pair.

**Then**

- the handoff is rejected with a visible `REFERENCE_MISMATCH` or
  `STALE_REVISION` outcome;
- no silently mixed Formula/Process result is presented;
- the last valid Formula and Process drafts remain recoverable; and
- the correction identifies the stale reference or revision conflict.

**Rule/coverage:** Coordinated read snapshot; revision/reference conflict.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-013 — Replay a retry-sensitive command safely

**Purpose:** Prove that command identity prevents duplicate work where an
adapter or local event is replayed.

**Given**

- a Formula Explorer adds an IngredientLine with a stable line identity or
  command identity; and
- the same command is replayed without a newer intended change.

**When**

The application handles the replay.

**Then**

- the Formula contains one intended line, not two duplicates;
- the response is the same completed outcome or an equivalent idempotent
  result;
- a replay against a stale revision does not silently overwrite newer input;
  and
- a deliberate new line uses a different identity.

**Rule/coverage:** Idempotency and retry semantics; scope × concurrency.

**Surfaces:** backend boundary `not-applicable` for V1; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-014 — Explain normalization and limitations

**Purpose:** Prove the read-side product value: the user can understand what
was calculated, what was excluded, and what remains unknown.

**Given**

- a Formula has multiple roles, at least one local override, and one unknown
  functional field; and
- normalization has completed with a partial outcome.

**When**

The Formula Explorer opens the normalization explanation/readiness view.

**Then**

- the structural flour denominator is explained with included/excluded
  components;
- baker's percentages show their calculated basis;
- roles and local overrides are visible;
- unknown fields and their effect on coverage/confidence are visible; and
- the explanation is available in the selected locale without changing the
  canonical values or diagnostics.

**Rule/coverage:** Read-side visibility; Trust, Provenance, and Uncertainty;
product-surface reachability.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-015 — Preserve bilingual parity and reachability

**Purpose:** Prove that Greek and English are equivalent product surfaces,
not separate domain implementations.

**Given**

- the same Formula input is available in the English and Greek routes; and
- the Formula Explorer performs the same normalization action in each locale.

**When**

The user switches locale and reviews the Formula, diagnostics, and readiness.

**Then**

- the same Formula IDs, masses, roles, value states, derived values,
  diagnostics, and readiness outcomes are preserved;
- labels, validation copy, and explanations are presented in the selected
  language;
- the user can reach the formula workspace and observe success/partial/failure
  in both locales; and
- no locale change creates a second Formula or changes calculation semantics.

**Rule/coverage:** Bilingual Content and Localization; canonical IDs are
language-neutral; frontend reachability.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## SC-016 — Enforce the versioned flour-blend tolerance

**Purpose:** Prove that the deterministic blend boundary is shared by all
implementations and is not a UI-specific rounding choice.

**Given**

- a Formula has a complete FlourSystem; and
- one candidate normalized blend sums to `100.01%`, while another sums beyond
  `100.01%` under the same `formula-normalization-v1` policy.

**When**

The Formula Explorer validates and normalizes each candidate.

**Then**

- the `100.01%` candidate is accepted at the inclusive upper boundary;
- the candidate outside `[99.99%, 100.01%]` is rejected with `INVALID_BLEND`;
- the visible diagnostic identifies the policy and expected range; and
- both implementations expose the same acceptance/rejection outcome.

**Rule/coverage:** Versioned numeric tolerance; deterministic validation and
architecture-comparison fairness.

**Surfaces:** backend boundary `not-applicable`; frontend integration
`when-supported`; end-to-end journey `catalog-only`.

## Architectural-decision coverage

| Decision | Scenario coverage | Owner note |
|---|---|---|
| Calculated vs Estimated vs Heuristic | SC-001, SC-004, SC-005, SC-014 | Input/normalization preserves semantic class; downstream scoring owns heuristic behavior |
| Formula vs Process | SC-009, SC-010, SC-011, SC-012 | Directly owned by this capability |
| CompositionSimilarity vs ProcessSimilarity | `not-applicable` here | Owned by Classification/Similarity/Explanation; this capability only preserves the handoff dimensions |
| Unknown ≠ 0 | SC-004, SC-005, SC-009, SC-010, SC-014 | Directly owned by this capability and Trust shared concern |
| Named Ingredient -> Functional Composition | SC-006, SC-007, SC-014 | Catalog resolution and line-local override boundary |

## Stateful scenario coverage decisions

The capability has lifecycle state, independent Formula/Process work, and
retry-sensitive mutation. The relevant matrix interactions are covered as
follows:

| Interaction | Decision | Scenario(s) or reason |
|---|---|---|
| State × action | Canonical scenarios | SC-001, SC-002, SC-003, SC-004, SC-010, SC-011 |
| State × trigger | Canonical scenarios plus deferred owner | User commands and locale switch are covered by SC-001–016. Backend/webhook/automation triggers are not applicable to the frontend-only V1; future remote trigger policy belongs to the application/contract owner. |
| Time × lifecycle | `not-applicable` | No timers, expiry, scheduled transitions, or time-based Formula behavior in this capability; timestamps are provenance metadata only. |
| Failure × independent work | Canonical scenarios | SC-003 preserves sibling lines; SC-007 isolates sibling/catalog values. |
| Mutation × execution | Canonical scenarios | SC-011 preserves Formula/Process independence; SC-012 protects paired snapshots. |
| Scope × concurrency | Canonical scenario plus deferred breadth | SC-013 covers replay and stale revision semantics. Multi-user collaboration is deferred outside V1. |

No requirements gap was opened by this matrix: deferred behaviors have named
owners and are outside the current frontend-only scope.

## Quality gate assessment

- Behavioral quality: passed; every scenario states an externally observable
  business outcome and visible correction/limitation where relevant.
- Coverage quality: passed; happy, invalid, partial, isolation, read-side,
  bilingual, retry, and paired-boundary paths are included.
- Neutrality quality: passed; scenarios avoid HTTP, CLI, storage, and package
  assumptions.
- Efficiency quality: passed; scenarios are distinct and each protects a
  comparison-critical rule or product behavior.
