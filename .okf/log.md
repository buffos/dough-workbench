# Planning Log

## 2026-09-07

**Initialization**: Created the initial planning graph and application
synthesis for the confirmed Dough Formula Intelligence topology.

- The user confirmed the initial capability topology and the Astro + Svelte
  frontend baseline for a GitHub Pages deployment.
- The project is browser-only and bilingual, with English and Greek routes and
  content.
- The graph is grounded in the three source documents under `exploration/`:
  the formal domain specification, calibration strategy, and initial prototype
  catalog.
- The five domain boundaries named by the user are recorded as accepted ADRs:
  calculated/estimated/heuristic values, Formula vs Process, separate
  composition/process similarity, Unknown != 0, and named ingredient to
  functional composition.
- The initial effective state totals are: `foggy: 1`, `bounded: 9`,
  `specified: 0`, `implemented: 0`.
- The `Validation and Calibration` capability remains foggy because dataset
  collection and sourcing are intentionally deferred.
- Application synthesis artifacts were created at `docs/prd.md` and
  `docs/architecture/application-architecture-summary.md`.
- No issue slicing or implementation issue creation occurred. The root
  verification policy must be confirmed before architecture-spec handoff or
  issue slicing.

## 2026-09-07

**Policy**: The user confirmed the inherited verification policy as
`when-supported`, with no backend boundary, frontend integration coverage when
supported, and catalog-only end-to-end verification. Product truth has no
impact; architecture truth was refreshed.

## 2026-09-07

**Gap analysis**: Ran the first focused gap pass for Formula Input and
Normalization. Product and application architecture truth have no impact; the
owning capability now links its gap report. The next clarification round is
limited to input validity, ingredient-role semantics, custom/override policy,
units, and process missingness.

## 2026-09-07

**Clarification**: The user confirmed all five gap decisions for Formula Input
and Normalization. Product and architecture truth were refreshed with the
partial-analysis, role-participation, custom-override, grams-only, and
Known/None/Unknown policies. The capability remains `bounded`; no state or
delivery transition occurred.

## 2026-09-07

**Specification preparation**: Created the canonical glossary and node PRD for
Formula Input and Normalization. The node remains `bounded` and is ready for
canonical domain modeling. No new topology or delivery work was created.
## 2026-09-07

- Created `docs/architecture/formula-input-normalization/canonical-domain-model.md`
  from the canonical glossary, node PRD, resolved gap decisions, and accepted
  architectural decisions.
- Kept Formula composition and Process handling as separate consistency
  boundaries while defining an explicit paired analysis handoff.
- Captured aggregate boundaries, invariants, lifecycle/readiness outcomes,
  domain services, failure behavior, and semantic value-state preservation.
- Updated the Formula Input node to reference the canonical domain model and
  recorded artifact impact: topology, application PRD, application architecture
  summary, and delivery issue inventory require no change.

## 2026-09-07

- Created `docs/architecture/formula-input-normalization/canonical-use-cases.md`
  from the node PRD and canonical domain model.
- Defined intent-based commands, read-only queries, service boundaries,
  Formula/Process transaction expectations, idempotency semantics, business
  failures, application events, and end-to-end chains.
- Kept the initial in-memory/static frontend explicit without leaking Astro,
  Svelte, HTTP, or storage decisions into the application contract.
- Updated the Formula Input node and orchestration status; application product
  and architecture synthesis require no change, and no delivery issue was
  created.

## 2026-09-07

- Created `docs/architecture/formula-input-normalization/canonical-api-cli-contract.md`
  from the canonical use cases, domain model, glossary, and node PRD.
- Defined transport-neutral identifiers, statuses, value-state and diagnostic
  shapes, resource snapshots, error codes, retry behavior, and Formula/Process
  handoff semantics.
- Added illustrative future HTTP and CLI mappings while preserving the
  frontend-only V1 boundary and bilingual payload parity.
- Updated the Formula Input node and orchestration status; product truth,
  application architecture, planning topology, and delivery inventory require
  no change.

## 2026-09-07

- Created `docs/architecture/formula-input-normalization/acceptance-scenarios.md`
  from the PRD, domain model, use cases, and contract.
- Added 15 stable behavior scenarios covering happy path, hard validation,
  partial analysis, architectural decisions, independent Formula/Process
  behavior, override isolation, retry semantics, read-side explanations, and
  bilingual reachability.
- Recorded the stateful-scenario matrix decisions, including explicit
  not-applicable/deferred ownership for timers, remote triggers, and
  multi-user collaboration.
- Updated the Formula Input node and orchestration status; no topology,
  application synthesis, or delivery issue changes were needed.

## 2026-09-07

- Created `docs/architecture/formula-input-normalization/readiness-review.md`
  as the findings-first gate over the complete Formula Input artifact set.
- Found two high-severity readiness findings: contradictory Formula/Process
  ownership wording and an under-specified Process vocabulary/units contract.
- Found three medium-severity contract/model findings: `accepted` outcome
  drift, confidence/coverage representation, and unfixed numeric tolerance.
- Kept the node `bounded`, recorded the application-synthesis gate as current,
  and deferred issue slicing until R-001 through R-005 are resolved or
  explicitly accepted.

## 2026-09-07

- Performed the first readiness remediation pass: harmonized Formula/Process
  ownership with ADR-0002, defined the V1 Process field vocabulary/units from
  the formal specification, aligned command outcome statuses, and made
  coverage/confidence numeric in `[0,1]` with presentation bands derived.
- Updated the glossary, node PRD, canonical domain model, use cases, contract,
  readiness review, and orchestration status. These changes are capability
  scoped; product truth, application architecture, topology, and delivery
  inventory remain unchanged.
- Left R-005 open: the V1 flour-blend numeric tolerance still needs an explicit
  baseline or an intentional deferral. The node remains `bounded`.

## 2026-09-07

- The user confirmed the recommended V1 flour-blend tolerance:
  `formula-normalization-v1` accepts an inclusive `[99.99%, 100.01%]` sum
  range.
- Updated the domain model, PRD, contract, acceptance scenarios (SC-016), and
  readiness review with the versioned policy and boundary test.
- R-001 through R-005 are resolved. The Formula Input and Normalization node
  moved from `bounded` to `specified`; the Formula Analysis Workspace roll-up
  remains `bounded` because its other structural children are not yet
  specified.
- Strict OKF validation remains required before delivery issue slicing; no
  delivery issue was created in this state transition.

## 2026-09-07

- User approved the seven-slice delivery breakdown for the specified Formula
  Input and Normalization capability.
- Created issues `001` through `007` in
  `docs/agents/issues/pending/`, covering the valid Formula slice, validation
  recovery, uncertainty/explanation, roles/overrides, Process capture,
  Formula/Process handoff, and bilingual parity/verification.
- Updated `docs/agents/issues/issues.md` to max issue ID `007` and added the
  issue references to the owning OKF node.
- The issue batch is AFK with mandatory `visual-review` gates, is grounded in
  the complete reference artifact set, and has no application PRD or
  architecture-summary impact. No unresolved readiness findings remain.

## 2026-09-07

- Closed Issues 001–003 after the user approved the grouped visual review of
  the bilingual Formula workspace, including the formula entry, validation and
  recovery, partial analysis, uncertainty labels, explanation surface,
  terminology, typography, and contrast adjustments.
- Archived the completed issue records under `docs/agents/issues/done/` and
  removed their active registry rows. Issues 004 and 005 are now unblocked;
  Issues 006 and 007 retain only their remaining active dependencies.
- Refreshed the Formula Input and Normalization node's issue references. The
  node remains `specified` and the Formula Analysis Workspace roll-up remains
  `bounded` because its other structural children are still active.

## 2026-09-07

- Implemented Issues 004–005 through the canonical reference workflow. Added
  versioned catalog references, local composition/availability overrides,
  custom functional ingredient provenance/confidence, role participation
  explanations, and the independent V1 Process editor with tri-state fields,
  ordered AdditionSteps, Formula line references, persistence, and timeline.
- Added domain/application tests for role resolution, override isolation,
  Process ordering, tri-state preservation, ranges, units, references, and
  independent Process revisions. `npm run verify` passes with 21 tests.
- Issues 004–005 are now `awaiting-human-review` because both change rendered
  UI and declare the mandatory visual-review gate. Issues 006–007 remain
  blocked; the Formula Input node remains `specified` and the Formula Analysis
  Workspace roll-up remains `bounded`.

## 2026-09-07

- During grouped visual review, the user identified a material Process
  vocabulary gap: several algorithm-facing fields were exposed as arbitrary
  text even though no downstream rule could interpret the prose.
- Versioned the Process contract as `process-input-v0.2`. Categorical fields
  now use controlled bilingual dropdowns, measured values remain numeric and
  unit-bound, lamination fat resolves to a Formula-line reference, and
  AdditionStep actions use controlled IDs. `Unknown` remains the honest state
  when no supported value is known; `Other` is explicit but unclassified.
- Synchronized the canonical domain model, glossary, PRD, contract, acceptance
  scenario, gap analysis, readiness review, and Issue 005. The node remains
  `specified`; Issues 004–005 remain `awaiting-human-review` pending the next
  grouped visual review.

## 2026-09-07

- The user approved the grouped bilingual visual review for Issues 004–005.
- Closed and archived Issues 004–005 after verifying all acceptance criteria,
  issue-specific artifact sync, `npm run verify`, `git diff --check`, and OKF
  validation.
- The Formula Input and Normalization capability remains `specified`; its
  remaining active frontier is Issue 006 followed by Issue 007. The Formula
  Analysis Workspace roll-up remains `bounded`.

## 2026-09-07

- Implemented Issue 006, Formula/Process handoff, with a versioned paired
  reference, partial-analysis policy, conflict/revision diagnostics, recovery
  guidance, and session-local idempotent command handling.
- Added 36 passing tests covering complete/partial handoff, Formula/Process isolation,
  reference and stale-revision conflicts, and replay-safe line/component/step
  commands. Static build, route checks, OKF validation, and lint/typecheck pass.
- Issue 006 is now `awaiting-human-review`; the capability remains `specified`
  and the Formula Analysis Workspace roll-up remains `bounded` because Issue
  007 and the other structural children are not complete.

## 2026-09-08

- The user accepted Issue 006 after bilingual visual review of complete,
  partial, and conflict analysis states, Formula/Process isolation, recovery
  guidance, and the plain-language readiness presentation.
- Closed and archived Issue 006 as `docs/agents/issues/done/20260908-006-formula-process-handoff.md`.
- Unblocked Issue 007, Bilingual parity and verification. The Formula Input and
  Normalization capability remains `specified`; the Formula Analysis Workspace
  roll-up remains `bounded` because Issue 007 and the other structural
  children are not complete.
- Implemented Issue 007 with exact English/Greek message parity, Process/help
  vocabulary coverage, locale-neutral canonical state and session persistence
  checks, plus static route/base-path/404 verification. `npm run verify` passes
  with 42 tests, and the configured GitHub Pages base-path check passes.
- Issue 007 is awaiting the user's final bilingual visual review; the Formula
  Input and Normalization capability remains `specified` and the Formula
  Analysis Workspace roll-up remains `bounded`.

## 2026-09-08

- The user accepted Issue 007 after bilingual visual review of the complete
  Formula Input journey, route switching, validation, partial-result, conflict,
  explanation, direct-route, and mobile layout states.
- Closed and archived Issue 007 as
  `docs/agents/issues/done/20260908-007-bilingual-parity-verification.md`.
- Exhausted the scoped delivery batch for Formula Input and Normalization;
  recomputed its state from `specified` to `implemented`. The parent Formula
  Analysis Workspace roll-up remains `bounded` from child states
  `implemented`, `bounded`, `bounded`, and `bounded`.
- Current capability totals are `foggy: 1`, `bounded: 8`, `specified: 0`,
  `implemented: 1`. No product or cross-capability architecture truth changed;
  the application PRD and architecture summary remain current.

## 2026-09-08

**Architecture specification**: Advanced all seven own-state bounded
capabilities through the bounded-capability exact-specification workflow:
Composition and Intrinsic Metrics, Process and Effective Behavior,
Classification, Similarity, and Explanation, Interactive Formula Exploration,
Ingredient and Prototype Knowledge, Bilingual Content and Localization, and
Trust, Provenance, and Uncertainty.

- State transitions: Composition and Intrinsic Metrics, Process and Effective
  Behavior, Classification, Similarity, and Explanation, Interactive Formula
  Exploration, Ingredient and Prototype Knowledge, Bilingual Content and
  Localization, and Trust, Provenance, and Uncertainty each moved from
  `bounded` to `specified`. The Formula Analysis Workspace roll-up moved from
  `bounded` to `specified` as the derived minimum of its children.
- Created the complete node-scoped artifact set for each capability:
  requirements gap analysis, glossary, PRD, canonical domain model, canonical
  use cases, canonical API/CLI contract, acceptance scenarios, and readiness
  review.
- Readiness reviews found no unresolved High or Medium blockers. Dataset
  ownership and calibration remain explicitly foggy rather than being
  fabricated.
- Resolved the bilingual default-entry policy as static `/` -> `/en/`, with
  explicit `/en/` and `/el/` counterparts, unsupported-locale 404, and
  required-key parity.
- Fixed the shared acid-neutralization canonical unit for interoperability
  while preserving unknown values when evidence is unavailable.
- Refreshed `docs/prd.md` and
  `docs/architecture/application-architecture-summary.md` with source links,
  the bilingual route policy, and the shared trust metadata contract.
- Recomputed the Formula Analysis Workspace roll-up from `bounded` to
  `specified` after its three remaining children advanced.
- Current capability totals are `foggy: 1`, `bounded: 0`, `specified: 8`,
  `implemented: 1`. No delivery issue was created.

## 2026-09-08

**Delivery slicing**: The user approved the next delivery frontier,
Composition and Intrinsic Metrics.

- Created pending issues 008–012 in dependency order: deterministic
  composition baseline, composition evidence and partial results, effective
  hydration and absorption, intrinsic heuristic metrics, and composition
  workspace integration.
- Grouped visual human review after issues 008–011 and before issue 012 closeout,
  as requested.
- Marked the issue batch ready for agent work, updated the issue registry to
  max ID 012, and linked all issue paths from the Composition capability node.
- Artifact impact is capability-local; no root PRD or application architecture
  update was required.
- Graph totals remain `foggy: 1`, `bounded: 0`, `specified: 8`,
  `implemented: 1`. The Validation and Calibration node remains the only foggy
  planning node.

## 2026-09-08

**Composition delivery**: Implemented issues 008–012 through the
process-reference-issue lifecycle.

- Added the framework-independent Composition and Intrinsic Metrics engine,
  catalog-backed flour profiles, custom flour composition editing, partial
  evidence states, effective hydration/absorption estimates, acid-unit
  preservation, and versioned heuristic model data.
- Added the bilingual composition summary panel with Calculated, Estimated, and
  Heuristic distinction, evidence explanations, responsive layout, and no
  Process dependency.
- npm run verify passed: 11 test files, 50 tests, lint, typecheck, static build,
  and route checks.
- Issues 008–012 remain in pending/ with state awaiting-human-review. One
  grouped visual review is intentionally deferred until all five are complete.
- No product or cross-capability architecture truth changed. The Composition
  node and Formula Analysis Workspace roll-up remain specified pending review
  and closeout.

## 2026-09-08

**Composition closeout**: The user approved the grouped human review for
issues 008–012 after reviewing the complete bilingual composition workspace,
including desktop/mobile layout, calculated/estimated/heuristic states,
partial evidence, provenance, and help tooltips.

- Archived issues 008–012 under `docs/agents/issues/done/` and removed their
  rows from the active issue registry; the maximum issue ID remains 012.
- Advanced Composition and Intrinsic Metrics from `specified` to
  `implemented`; its Formula Analysis Workspace roll-up remains `specified`
  because Process and Classification children are still specified.
- Updated capability issue references to the dated done paths and refreshed
  orchestration status, index totals, and delivery audit trail.
- No product or cross-capability architecture truth changed; the application
  PRD and architecture summary remain current.

## 2026-09-08

**Delivery slicing**: The user approved the next working frontier, Process and
Effective Behavior.

- Created pending issues 013–018 in dependency order: the effective-analysis
  boundary, mixing/aeration, fermentation/proof, addition order/lamination,
  thermal/geometry, and workspace integration.
- Grouped visual human review after the complete Process batch, as requested.
- Marked the issue batch ready for agent work, updated the issue registry to
  max ID 018, and linked all issue paths from the Process capability node.
- Existing Process input normalization and Formula/Process handoff are
  observed in the codebase; the new batch targets the missing effective engine
  and user-facing Process analysis.
- Artifact impact is capability-local; the root PRD and application
  architecture summary remain current.
- Graph totals remain `foggy: 1`, `bounded: 0`, `specified: 7`,
  `implemented: 2`. Validation and Calibration remains the only foggy
  planning node.

## 2026-09-08

**Process delivery implementation**: Implemented issues 013–018 through the
process-reference-issue lifecycle.

- Added the versioned effective-behavior engine, Formula/Process pairing and
  conflict handling, partial process coverage, and explainable seed rules for
  mixing, aeration, fermentation, proof, addition order, lamination, thermal
  process, and geometry.
- Added the bilingual Effective Behavior workspace panel with outcome states,
  coverage, confidence, intrinsic baselines, contributors, missing inputs,
  limitations, and intentional analysis-basis details.
- `npm run verify` passed: 12 test files, 59 tests, lint, typecheck, Astro
  build, and static route checks.
- Issues 013–018 remain in pending/ with state `awaiting-human-review`; one
  grouped visual review is intentionally gathered at the end of the batch.
- Artifact impact is capability-local. The root PRD and application
  architecture summary remain current; graph totals remain `foggy: 1`,
  `bounded: 0`, `specified: 7`, `implemented: 2` until review and closeout.

## 2026-09-09

**Process closeout**: The user approved the grouped human review for issues
013–018.

- Archived issues 013–018 under `docs/agents/issues/done/20260909-*` and
  removed their active registry rows; the maximum issue ID remains 018.
- Advanced Process and Effective Behavior from `specified` to `implemented`.
  The Formula Analysis Workspace roll-up remains `specified` because
  Classification, Similarity, and Explanation is still specified.
- Refreshed the process capability references, orchestration status, planning
  index, and delivery audit trail. No product PRD or application architecture
  update was required.
- Current capability totals are `foggy: 1`, `bounded: 0`, `specified: 6`,
  `implemented: 3`. Validation and Calibration remains the only foggy node.

## 2026-09-09

**Frontier planning**: After Process and Effective Behavior closeout, the
code-grounded next prerequisite was identified as the prototype side of
Ingredient and Prototype Knowledge.

- The graph has no foggy or bounded child inside the Formula Analysis Workspace;
  Process is implemented and Classification remains specified.
- Brownfield inspection found the functional ingredient catalog in
  `src/data/ingredients/starter-catalog.ts`, but no versioned
  `src/data/prototypes/` catalog. Classification therefore should not be
  sliced as a reachable vertical path before this provider exists.
- Updated the planning index and affected orchestration records. This is a
  capability-local frontier refinement with no product or application
  architecture change.
- Proposed prototype-knowledge issue breakdown is presented for approval; no
  new issue files or registry rows have been created yet.

## 2026-09-09

**Delivery slicing**: The user approved the next frontier, the prototype side
of Ingredient and Prototype Knowledge.

- Created active issues 019–022 in dependency order: versioned prototype
  catalog boundary, inheritance/family hierarchy, high-confidence seed data,
  and bilingual catalog inspection.
- Added the four issue references to the owning capability node, updated the
  active registry and max issue ID to 022, and recorded the application
  synthesis gate as current.
- Issue 022 carries the mandatory `visual-review` gate; issues 019–021 are
  domain/data-only AFK slices with no additional human gate.
- Artifact impact is capability-local. The application PRD and architecture
  summary remain current; Classification remains the downstream frontier and
  Validation and Calibration remains foggy.

**Issue 019 completion**: The versioned prototype catalog boundary was
implemented and verified without a human-review gate.

- Immutable versioned snapshots, deterministic content identity, integrity
  diagnostics, and explicit catalog/model availability failures are now in the
  domain/data boundary.
- The issue was archived after 7 focused domain tests passed; application PRD
  and architecture summary remain current because the change is capability-local.
- Issue 019 is removed from the active registry and no longer blocks 020 or 021.

**Issue 020 completion**: Deterministic prototype inheritance and family
hierarchy resolution was implemented and verified without a human-review gate.

- Resolved definitions preserve stable identity, inherited source paths,
  family ancestry, separate structural/identity groups, and matcher policy
  provenance; cycles and dangling references fail explicitly.
- The issue was archived after the focused prototype domain suite passed; the
  application PRD and architecture summary remain current because the change
  is capability-local.
- Issue 020 is removed from the active registry and no longer blocks 021.

**Issue 021 completion**: The high-confidence expert seed catalog was added
and verified without a human-review gate.

- The catalog now covers eight structural families and eight named prototypes
  with stable localized labels, inherited family references, qualitative
  matcher metadata, confidence/maturity, and explicit provenance.
- Numeric boundaries remain intentionally uncalibrated; dataset collection and
  calibration remain owned by Validation and Calibration.
- Issue 021 is removed from the active registry and no longer blocks 022.

**Prototype batch implementation**: Issues 019–022 are implemented in code in
dependency order. Issue 022 remains active as `awaiting-human-review` so the
grouped visual review is performed only after the complete batch is available.

- The catalog provider, inheritance resolver, expert seed data, bilingual
  routes, navigation, unavailable-version state, and static route checks are in
  place.
- The application PRD and architecture summary remain current; the shared
  bilingual artifact records the new equivalent catalog route surface without
  changing shared policy.

**Issue 022 completion and graph transition**: The user approved the grouped
visual review for the bilingual catalog explorer after the scalable family tree,
search/filter flow, compact paginated results, selected type detail view,
responsive layout, and bilingual presentation were reviewed.

- Issue 022 was moved to
  `docs/agents/issues/done/20260909-022-bilingual-prototype-catalog-inspection.md`
  and removed from the active registry.
- Ingredient and Prototype Knowledge moved from `specified` to `implemented`
  because its scoped delivery issues 019–022 are exhausted.
- Current capability totals are `foggy: 1`, `bounded: 0`, `specified: 5`,
  `implemented: 4`. Formula Analysis Workspace remains `specified` because
  Classification, Similarity, and Explanation is still specified.
- Product and application architecture documents require no semantic update:
  this remains capability-local frontend presentation with no new actor,
  backend, persistence, or cross-capability boundary.

**Planning maintenance**: The Formula Analysis Workspace orchestration note was
reconciled with the accepted Issue 022 closeout. No topology, capability
scope, product, architecture, or delivery-state change was introduced. The
next specified frontier remains Classification, Similarity, and Explanation;
Validation and Calibration remains the only foggy capability.

**Classification delivery slicing**: The user approved the proposed next
frontier and issues 023–027 were created in dependency order for the specified
Classification, Similarity, and Explanation capability.

- The batch covers the feature snapshot/family gates, prototype similarity
  vectors, classification outcomes/recovery diagnostics, explanation fidelity,
  and the bilingual workspace surface.
- Issues 023–026 have no human gate. Issue 027 carries one grouped visual
  review after the complete batch is implemented, as explicitly requested.
- The owning capability node and orchestration status now reference the five
  active issues; the registry max ID is 027.
- Artifact impact is capability and delivery only. The application PRD and
  architecture summary remain current; no topology, product-scope, backend,
  persistence, or cross-capability boundary change was introduced.
- Current capability totals remain `foggy: 1`, `bounded: 0`, `specified: 5`,
  `implemented: 4`.

**Issue 023 completion**: The classification feature snapshot and family-gate
boundary was implemented and verified.

- The domain/application boundary now assembles language-neutral effective and
  Process features, preserves known/none/unknown evidence, evaluates
  hierarchical multi-label family gates, and returns explicit unavailable
  model diagnostics.
- Issue 023 was archived at
  `docs/agents/issues/done/20260909-023-classification-feature-snapshot-and-family-gates.md`
  and removed from the active registry; issue 024 is now unblocked.
- The classification capability remains `specified` because issues 024–027
  still cover its remaining scoped delivery. Product and application
  architecture documents require no semantic update; this is capability-local
  work.

**Issue 024 completion**: Prototype similarity vectors were implemented and
verified.

- Resolved prototypes now produce deterministic composition, Process, and
  overall identity similarity fields with independent confidence and coverage.
- The expert-seed score policy is versioned and explicitly calibration-limited;
  unknown evidence is omitted/limited and similarity is never treated as
  probability.
- Issue 024 was archived at
  `docs/agents/issues/done/20260909-024-prototype-similarity-vectors.md` and
  removed from the active registry; issue 025 is now unblocked.
- The classification capability remains `specified` because issues 025–027
  still cover its remaining scoped delivery. Product and application
  architecture documents require no semantic update; this is capability-local
  work.

**Issue 025 completion**: Classification outcomes and recovery diagnostics were
implemented and verified.

- The result policy now preserves strong, structural, hybrid, no-strong-match,
  and partial outcomes, while independently reporting confidence and coverage.
- Structural conflicts, insufficient evidence, invalid snapshots, unavailable
  models, and stale analysis references produce explicit recovery diagnostics
  without silent fallback.
- Issue 025 was archived at
  `docs/agents/issues/done/20260909-025-classification-outcomes-and-recovery.md`
  and removed from the active registry; issue 026 is now unblocked.
- The classification capability remains `specified` because issues 026–027
  still cover its remaining scoped delivery. Product and application
  architecture documents require no semantic update; this is capability-local
  work.

**Issue 026 completion**: Classification explanation fidelity was implemented
and verified.

- The domain now emits deterministic explanation evidence from the same
  feature snapshot, resolved prototype, evaluated vector, and score policy as
  the classification result, including matched/limiting/conflicting/missing
  evidence, inheritance, identity modifiers, and provenance.
- A conflicted candidate remains explainable when no supported or partial
  candidate exists; no silent empty fallback hides the reason for the result.
- Issue 026 was archived at
  `docs/agents/issues/done/20260909-026-classification-explanation-fidelity.md`
  and removed from the active registry; issue 027 is now unblocked.
- Verification: the focused classification suite passed with 9 tests and
  `npm run typecheck` passed. The classification capability remains
  `specified` until the final bilingual workspace issue and grouped human
  review are complete.

**Issue 027 implementation**: The bilingual classification workspace was
implemented and is awaiting its one grouped human-review gate.

- The full analysis path now renders the classification result in both
  localized workspaces, with families first, candidate comparisons second,
  separate composition/process/overall similarity, confidence, coverage,
  maturity, diagnostics, recovery guidance, and expandable explanation
  evidence.
- Editing the Formula or Process clears the prior classification result, and
  composition-only analysis does not silently claim a process/type result.
- `npm test` (75 tests), `npm run lint`, and `npm run typecheck` passed. Astro
  build/static-route verification remains deferred because the user manages
  the local Astro preview; existing `dist/` output is intentionally stale.
- The active registry now marks issue 027 `awaiting-human-review`. No separate
  human reviews are requested for issues 023–026.

**2026-09-09 — Issue 027 closeout**: The user approved the grouped visual
review for the bilingual classification workspace. Issue 027 was archived at
`docs/agents/issues/done/20260910-027-bilingual-classification-workspace.md`
and removed from the active registry. The classification capability moved from
`specified` to `implemented`. Its presentation now limits family memberships
and prototype candidates to the eight most relevant entries while retaining
the full result for calculation and explanation. The user-managed Astro
static-route verification remains explicitly deferred against the stale
`dist/` output under the project's `when-supported` policy.

The Formula Analysis Workspace roll-up moved from `specified` to `implemented`
because all four structural children are now implemented. Current effective
capability totals are `foggy: 1`, `bounded: 0`, `specified: 3`, and
`implemented: 6`. Validation and Calibration is the only remaining foggy
frontier.

**2026-09-10 — Next implementation frontier**: Following the approved closeout
of issue 027 and the commit `ea242ed`, the existing OKF map was refreshed for
implementation-target selection. State-based routing keeps the foggy
Validation and Calibration capability on a separate clarification track; its
dataset scope, source tiers, collection ownership, storage, curation, and
acceptance evidence are not delivery-specified. The next implementation-ready
node is the specified Interactive Formula Exploration capability. Its exact
artifact set and readiness review are clean, and the application synthesis
gate passes with no product or application-architecture change. A proposed
issue breakdown is being presented for approval; no issue files or `issues:`
write-back are created before approval.

**2026-09-10 — Interactive Formula Exploration issue slicing**: The user
approved the five-issue delivery breakdown. Issues 028–032 were created in
dependency order under docs/agents/issues/pending/ and registered on the
Interactive Formula Exploration capability node. The batch keeps all human
visual review at the end: issue 032 carries the grouped review gate after the
complete English and Greek journey is implemented. The node remains
specified; capability totals are unchanged at foggy: 1, bounded: 0,
specified: 3, and implemented: 6. Application PRD and architecture summary
have no semantic impact because this is delivery within an existing
specified browser-only capability.

**2026-09-10 — Issue 028 completion**: The immutable exploration baseline,
copy-on-write scenario shell, typed Formula/Process patch contract, canonical
path validation, revision checks, and rejected-patch recovery were implemented
and verified by the exploration unit suite, lint, typecheck, and diff checks.
Issue 028 was archived at
`docs/agents/issues/done/20260910-028-counterfactual-baseline-and-patch-contract.md`
and removed from the active registry; issues 029 and 032 were unblocked. The
Interactive Formula Exploration capability remains `specified` with issues
029–032 active. No product or application-architecture synchronization was
required, and no individual human review was performed.

**2026-09-10 — Issue 029 completion**: Formula-owned counterfactual paths for
mass, role, composition state/value, and availability now recompute through
the existing deterministic analysis boundary on an isolated copy. Process
snapshots and Unknown evidence remain unchanged unless explicitly patched.
Issue 029 was archived at
`docs/agents/issues/done/20260910-029-formula-counterfactual-recomputation.md`
and removed from the active registry; issues 030–032 were unblocked. The
Interactive Formula Exploration capability remains `specified`. Verification
passed with `npm test`, `npm run lint`, `npm run typecheck`, and
`git diff --check`; no individual human review was performed.

**2026-09-10 — Issue 032 closeout**: The bilingual counterfactual workspace,
target-selector explanation hint, isolated Formula/Process scenario editing,
comparison, recovery, and reset flow completed the Interactive Formula
Exploration delivery slice. The grouped English/Greek visual review was
approved by the user, including responsive, keyboard, focus, accessible-label,
and contrast checks. Issue 032 was archived at
`docs/agents/issues/done/20260910-032-bilingual-exploration-workspace-and-reset.md`
and removed from the active registry. The capability moved from `specified` to
`implemented`; no product or application-architecture synchronization was
required. Verification passed with `npm test`, `npm run lint`,
`npm run typecheck`, `git diff --check`, and strict OKF validation.

**2026-09-10 — Issue 031 completion**: Counterfactual comparisons now expose
semantic changed/unchanged/unavailable metrics, availability changes, paired
Formula/Process evidence, limitations, and explicit rejected/conflict recovery
for stale, foreign, invalid, partial, and model-version-mismatch results.
Issue 031 was archived at
`docs/agents/issues/done/20260910-031-counterfactual-comparison-and-recovery.md`
and removed from the active registry; issue 032 was unblocked. The
Interactive Formula Exploration capability remains `specified` because issue
032 owns the final bilingual UI and grouped human review. Verification passed
with `npm test`, `npm run lint`, `npm run typecheck`, and `git diff --check`;
no individual human review was performed.

**2026-09-10 — Issue 030 completion**: Process-owned counterfactuals now cover
descriptor-backed mixing, aeration, addition, fermentation, lamination,
thermal, and geometry values, with Formula/Process owner preservation and
intrinsic invariance for Process-only comparisons. Issue 030 was archived at
`docs/agents/issues/done/20260910-030-process-and-paired-counterfactuals.md`
and removed from the active registry; issues 031–032 were unblocked. The
Interactive Formula Exploration capability remains `specified`. Verification
passed with `npm test`, `npm run lint`, `npm run typecheck`, and
`git diff --check`; no individual human review was performed.

**2026-09-10 — Bilingual Content and Localization verification**:
Code-grounded verification confirmed the current V1 scope: explicit `/en/`
and `/el/` workspace, help, and catalog routes; static `/` → `/en/` entry;
public unsupported-route 404; route-aware language counterparts; localized
navigation, content, explanatory labels, metadata, accessibility copy, and
catalog data; locale-neutral Formula/Process state; and required English/Greek
message and diagnostic parity. The node moved from `specified` to
`implemented`. `npm test -- --run` (85 tests), `npm run lint`, and
`npm run typecheck` passed. Astro static build was not run under the user's
local-preview policy. Product and application-architecture truth are
unchanged; no separate delivery issue or issue-registry change was required.

**2026-09-10 — Validation and Calibration fog clearing**: The user confirmed
the first product/data direction: one immutable versioned Gold Dataset; records
may serve both calibration evidence and public reference starting points; a
Formula Snapshot is required and an independent Process Snapshot is optional;
multiple references per preparation are allowed with one primary; public
eligibility is explicit; dirty draft replacement requires confirmation; and
the first release is manually curated from attributable reliable sources with
no automatic scraping. The node moved from `foggy` to `bounded` after its
purpose, sibling boundaries, child territories, actors, and outputs became
explicit. Totals at that transition were `foggy: 0`, `bounded: 1`,
`specified: 1`, `implemented: 8`.

**2026-09-10 — Validation and Calibration exact specification**: The complete
node-scoped reference set was created for the Gold/reference release boundary:
requirements gap analysis, glossary, PRD, canonical domain model, use cases,
API/CLI contract, acceptance scenarios, and readiness review. The application
PRD and architecture summary were refreshed for the new reference-start
journey and static release-data boundary; no backend or persistence boundary
was introduced. The node moved from `bounded` to `specified`; current totals
are `foggy: 0`, `bounded: 0`, `specified: 2`, `implemented: 8`. Issue slicing is
prepared but no issue files, registry rows, or node `issues:` references were
created before user approval.

**2026-09-10 — Validation and Calibration issue slicing**: The user approved
the dependency-aware eight-issue delivery slice. Issues 033–040 were created
under `docs/agents/issues/pending/` and registered on the Validation and
Calibration capability node. Issue 033 establishes the static release boundary
and verifier; Issue 034 is the HITL/product-approval curation of
`gold-formulas-v1`; Issues 035–037 expose and safely load/replace references;
Issues 038–039 govern partitioned evidence, maturity, and regression; and
Issue 040 completes the bilingual integration. All UI issues retain their
`visual-review` gate, but the visual reviews are grouped at the end in Issue
040 as requested. The node remains `specified`; totals remain `foggy: 0`,
`bounded: 0`, `specified: 2`, and `implemented: 8`. No code was changed and no
Astro command was run.

**2026-09-10 — Reference Dataset Acquisition and Curation expansion**: The
user approved replacing the small first-release assumption with a broad
preparation inventory, explicit navigation categories versus structural
families, approved source research, maintainer-controlled offline acquisition,
and a 2–3-record-per-category pilot before incremental expansion. A structural
child was added at
`.okf/capabilities/validation-calibration/reference-dataset-acquisition.md`.
Its exact artifact set and a 154-entry preparation coverage inventory were
created; its state advanced from `bounded` to `specified`. The parent remains
`specified` for release/evidence governance. Application PRD and architecture
summary were refreshed: offline acquisition is allowed as a maintainer path,
while browser/runtime scraping, unattended crawling, copied source prose, and
backend ingestion remain outside V1. Current totals are `foggy: 0`,
`bounded: 0`, `specified: 3`, and `implemented: 8`. The revised acquisition
issue slice is intentionally pending user approval before new issue files are
created.

**2026-09-10 — Reference Dataset Acquisition delivery slice approved**: The
user approved the revised dependency-aware plan. Issues 041–044 were created
and registered for coverage inventory/taxonomy, source registry and acquisition
policy, offline acquisition and normalization, and pilot candidate curation/
coverage reporting. Issue 034 was revised to publish only the approved pilot
handoff through the Issue 033 release verifier; it no longer performs source
research or data curation. Product/data approval remains explicit on Issues
041, 042, and 044, while the parent UI visual-review gates remain grouped at
Issue 040. The child and parent orchestration records now reflect the active
033–044 delivery slice. Totals remain `foggy: 0`, `bounded: 0`, `specified: 3`,
and `implemented: 8`; no code was changed and no Astro command was run.

**2026-09-10 — Issue 033 implementation and closeout**: The immutable Gold
Dataset contract, verifier, deterministic content identity, public-reference
eligibility, bounded summaries, and explicit no-fallback resolution were
implemented and verified. Optional Process snapshots, provenance, localized
metadata, role/partition separation, and Unknown-is-not-zero semantics remain
explicit. Issue 033 was archived to `docs/agents/issues/done/`; its blockers
were cleared from the active issue graph. `npm test` passed with 20 files and
111 tests, lint/typecheck passed, `git diff --check` passed, and strict OKF
validation passed. The capability remains `specified` because the remaining
release, source, pilot, and final grouped UI work is not exhausted.

**2026-09-10 — Issues 041–044 implementation artifacts**: The 154-entry
coverage inventory, five-source proposed registry, offline normalization
pipeline, curation lifecycle, pilot report, and immutable handoff boundary
were implemented with local fixtures and durable artifacts. All proposed
sources remain `manual-review` / `review-required`; the browser-safe
`gold-formulas-v1` registry remains empty so no unapproved recipe is exposed.
Issue 041 and the source/pilot decisions retain their product-approval gates;
the remaining parent UI review remains grouped at the end. No Astro command
was run.

**2026-09-10 — Issues 041–043 closeout and pilot assembly**: The owner-approved
internal source boundary is recorded as five `manual-only` sources with
`normalized-facts-only` reuse. The offline acquisition pipeline was verified
and archived at
`docs/agents/issues/done/20260910-043-offline-acquisition-and-normalization-pipeline.md`.
The deterministic `pilot-v1` fixture now contains 22 manually captured and
normalized candidates, exactly two in each of the 11 navigation categories,
with 0 blocked entries and 132 planned entries intentionally outside the
pilot. The immutable handoff is `handoff-ffbc6efc`; Issue 044 remains
`awaiting-human-review` for product/data approval. The browser release registry
remains empty and no Astro command was run.

**2026-09-10 — Issue 044 product/data approval and closeout**: The project
owner approved the `pilot-v1` candidate batch and coverage report. Issue 044
was archived to
`docs/agents/issues/done/20260910-044-pilot-candidate-curation-and-coverage-report.md`;
its immutable handoff `handoff-ffbc6efc` is now the approved input for the
parent release workflow. The Reference Dataset Acquisition and Curation child
has exhausted its scoped delivery and advanced from `specified` to
`implemented`. Issue 034 is unblocked and is the next implementation frontier;
the browser release registry remains empty until its publication step.

**2026-09-10 — Issue 034 publication and closeout**: The approved immutable
pilot handoff was consumed by the Issue 033 verifier and published as the
static `gold-formulas-v1` release. The release contains 22 records with
deterministic content identity, Formula snapshots, optional independent
Process snapshots, bilingual provenance, calibration/reference roles, and
normalization traces. The browser-safe registry now resolves the release with
no fallback; Issue 034 was archived to
`docs/agents/issues/done/20260910-034-curate-and-publish-gold-formulas-v1.md`.
Issue 035 is the next frontier. The grouped visual review remains deferred as
planned and no Astro command was run.

**2026-09-11 — Issues 035–038 implementation**: The reference-start journey
now provides bounded localized browsing with preparation/family filters,
friendly provenance/release wording, independent Formula/Process copying,
safe dirty-draft replacement, Blank reset, and explicit stale-selection
recovery. The calibration evaluator now enforces verified releases, disjoint
partitions, complete quality weights, held-out validation/test evidence, and
explicit Unknown handling. Issues 035–037 await the already-planned grouped
visual review; Issue 038 has no human gate and is closed. Issue 039 is now
unblocked. No Astro command was run.

**2026-09-11 — Issue 039 implementation**: The model maturity and regression
gate now enforces the staged evidence ladder, bounds confidence by maturity and
coverage, requires the complete canonical regression suite, supports Stable
only with controlled-experiment evidence, and publishes immutable append-only
parameter releases. Issue 039 has no human gate and is closed; Issue 040 is
the final reference-start integration step. No Astro command was run.

**2026-09-11 — Issue 040 implementation**: The bilingual reference-start
journey is integrated across `/en/` and `/el/`, including bounded catalog
browsing, local Formula/Process copying, analysis, edit invalidation, safe
replacement, Blank reset, and stale/invalid recovery. Locale parity tests,
release data checks, lint, typecheck, and the full unit/application suite pass.
Issues 035–037 and 040 now await one grouped visual review; the Validation and
Calibration node remains `specified` until that gate is approved. No Astro
command was run.
