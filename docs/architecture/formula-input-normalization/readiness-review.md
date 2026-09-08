# Formula Input and Normalization — Architecture Readiness Review

Review date: 2026-09-07
Review scope: own-state capability node `Formula Input and Normalization`
Review status: `ready-for-implementation-handoff`; R-001 through R-006
resolved

This is a findings-first review of the complete node artifact set:

- [node PRD](prd.md)
- [domain glossary](domain-glossary.md)
- [canonical domain model](canonical-domain-model.md)
- [canonical use-case model](canonical-use-cases.md)
- [canonical API/CLI contract](canonical-api-cli-contract.md)
- [acceptance scenarios](acceptance-scenarios.md)
- linked ADRs and shared concerns
- application synthesis at `docs/prd.md` and
  `docs/architecture/application-architecture-summary.md`

The node has no explicit `state_policy`, so it is reviewed as an own-state
bounded capability. The root verification policy is present and resolved:
backend boundary `not-applicable`, frontend integration `when-supported`, and
end-to-end `catalog-only`.

## Findings

R-001 through R-004 below were found during the first cross-document pass and
resolved in the first remediation pass using already accepted ADRs and the
formal domain specification. R-005 was resolved after the user confirmed the
recommended V1 policy. R-006 was resolved during the Process visual-review
refinement by versioning the typed Process vocabulary.

### R-001 — RESOLVED — Formula/Process ownership is still contradictory

- **Severity:** High
- **Affected artifacts:** `domain-glossary.md` (Formula definition),
  `prd.md` (FR-01 and product summary), `canonical-domain-model.md`, ADR-0002,
  `canonical-use-cases.md`, `canonical-api-cli-contract.md`
- **Issue:** The glossary and node PRD still use wording such as “Formula
  containing ... Process”, while ADR-0002 and the canonical domain model make
  Process a separate aggregate/structure with an analysis-time pairing. The
  contract uses `processRef`, and the use-case model correctly coordinates two
  independent roots, but the earlier wording remains an alternative reading.
- **Impact:** One implementation could nest Process mutation inside Formula,
  while another could keep independent revisions. That changes lifecycle,
  mutation isolation, stale-pair behavior, and the meaning of SC-011/SC-012.
- **Recommendation:** Harmonize the glossary and node PRD to say that a
  Formula is the composition aggregate; a Formula/Process pair is assembled
  for analysis; and a Formula may hold only a Process association/reference.
  Keep ADR-0002 and the canonical domain model as the governing decision.
- **Artifact impact:** capability truth only; no topology, application PRD,
  application architecture, or delivery issue change is required.
- **Resolution:** The glossary and node PRD now define Formula as the
  composition aggregate and Process as a separate aggregate paired through a
  versioned reference. This matches ADR-0002, the domain model, use cases, and
  contract.

### R-002 — RESOLVED — Process input vocabulary and units are not contract-stable

- **Severity:** High
- **Affected artifacts:** `prd.md` FR-06, `canonical-domain-model.md`
  Process section, `canonical-use-cases.md` `RecordProcessForFormula`,
  `canonical-api-cli-contract.md` Process snapshot, SC-009–SC-012
- **Issue:** The documents promise an initial Process subset and name broad
  categories, but the external Process shape still uses a generic `fields`
  object. It does not define which V1 field identifiers, enum values, units,
  ranges, or structural rules are in scope for mixing, addition order,
  aeration, fermentation, lamination, thermal treatment, and geometry.
- **Impact:** Two implementations can both satisfy “Process capture” while
  accepting different fields, interpreting durations/temperatures differently,
  or exposing different partial-analysis behavior. The Formula/Process
  boundary would be stable, but the Process contract would not be comparable.
- **Recommendation:** Choose and publish the first vertical-slice Process
  vocabulary before implementation: at minimum field identifiers, canonical
  units (`seconds`, `degrees Celsius`), bounded normalized values, enum values,
  and the `Known`/`None`/`Unknown` behavior for each field. Keep advanced
  fields explicitly deferred if they are not part of V1.
- **Artifact impact:** capability truth and possibly application architecture
  sequencing if the first slice changes. No topology change is implied.
- **Resolution:** The node PRD, domain model, and contract now define the V1
  Process sections, field paths, units, ranges, tri-state behavior, and initial
  enum IDs from the formal specification. Advanced additions require a
  versioned vocabulary change.

### R-003 — RESOLVED — Command outcome vocabulary differs across application and contract

- **Severity:** Medium
- **Affected artifacts:** `canonical-use-cases.md` command result shape and
  `canonical-api-cli-contract.md` command outcome enum
- **Issue:** The use-case model lists `accepted` alongside `completed`,
  `partial`, `rejected`, and `conflict`; the contract defines only
  `completed`, `partial`, `rejected`, and `conflict`. V1 is synchronous/static,
  so it has no stated asynchronous `accepted` behavior.
- **Impact:** Clients and contract tests could implement incompatible result
  enums even though the operation is the same.
- **Recommendation:** Remove `accepted` for the synchronous V1 contract, or
  define it explicitly as a future asynchronous outcome with polling/terminal
  semantics. The simpler V1 recommendation is to remove it and add it only
  when an async owner exists.
- **Artifact impact:** capability truth only; no application synthesis change.
- **Resolution:** The synchronous V1 outcome vocabulary is now
  `completed`, `partial`, `rejected`, and `conflict` in both documents. A
  future asynchronous adapter may add an explicitly modeled accepted state.

### R-004 — RESOLVED — Confidence and coverage representation is underspecified

- **Severity:** Medium
- **Affected artifacts:** `domain-glossary.md`,
  `canonical-domain-model.md`, `canonical-api-cli-contract.md`, SC-004,
  SC-005, SC-010, SC-014, linked Trust/Validation concerns
- **Issue:** The source formal specification defines confidence numerically in
  `[0,1]` with provenance, while contract examples use string bands such as
  `"high"`, `"medium"`, and `"low"`. Coverage has decimal examples but no
  explicit range/precision rule. No document says whether bands are canonical
  or merely presentation groupings.
- **Impact:** Implementations can expose incompatible confidence payloads or
  report a “high” value with different numeric meaning. This weakens comparison
  tests and can confuse confidence with similarity.
- **Recommendation:** Make the transport-neutral representation explicit:
  numeric coverage/confidence in `[0,1]` with model/version context; any
  `low|medium|high` band must be a locale-independent presentation grouping,
  not the canonical value. Keep exact confidence aggregation in the shared
  Trust/Validation owner.
- **Artifact impact:** capability contract and shared concern clarification;
  no topology change.
- **Resolution:** Contract examples and the domain model now use numeric
  coverage/confidence in `[0,1]`; presentation bands are explicitly derived.
  Exact aggregation remains owned by the shared Trust/Validation concerns.

### R-005 — RESOLVED — Numeric tolerance is named but not fixed

- **Severity:** Medium
- **Affected artifacts:** node PRD deferred refinements, canonical domain
  model FlourSystem invariants, canonical contract blend shape, SC-001 and
  SC-002
- **Issue:** Flour blend validation depends on a “configured numerical
  tolerance”, but the node PRD says the exact tolerance will be fixed in the
  canonical domain model and the model does not provide the baseline value or
  model-policy identifier.
- **Impact:** Boundary inputs can be accepted by one implementation and
  rejected by another. This is small in scope but directly affects a visible
  validation outcome and deterministic comparison.
- **Recommendation:** Publish one V1 baseline tolerance and its unit (for
  example, a percentage-point tolerance), version it with the normalization
  policy, and keep the value out of UI-specific code. If the product owner
  intentionally defers the value, mark blend validation as a named deferred
  policy rather than implementation-ready behavior.
- **Artifact impact:** capability truth; no topology change.
- **Resolution:** The V1 `formula-normalization-v1` policy now accepts an
  inclusive `[99.99%, 100.01%]` flour-blend sum range. The policy ID travels
  with normalized results, and SC-016 covers the boundary.

### R-006 — RESOLVED — Advanced Process fields were exposed as free text

- **Severity:** High
- **Affected artifacts:** `canonical-domain-model.md`, `domain-glossary.md`,
  node PRD FR-06, Process editor, and Issue 005
- **Issue:** Several canonical Process paths were named but had no stable
  option vocabulary, so the editor exposed arbitrary text that a downstream
  algorithm could not interpret consistently.
- **Impact:** Users could enter plausible prose while the normalized Process
  carried no reliable categorical meaning. This was especially misleading for
  preferment type, expansion targets, fold pattern, lamination fat, and
  geometry.
- **Resolution:** `process-input-v0.2` defines the controlled options and
  Formula-line reference. The editor uses dropdowns for categorical values,
  numeric inputs for measured fields, and an explicit Unknown state when the
  user cannot choose a supported value. `Other` is retained as unclassified,
  not parsed as a hidden free-text instruction.

## Cross-document checks

### Vocabulary

Most terms are stable and match across the glossary, PRD, model, use cases,
contract, and scenarios. R-001, R-003, and R-006 were the material
vocabulary/status exceptions and are now resolved. Status spelling is consistent semantically
(`StructurallyValid`/`structurally_valid`, etc.).

### Rules and invariants

The following rules survive all layers and have scenario coverage:

- positive structural flour and denominator `F > 0`;
- positive grams-only masses;
- role participation without role-as-classification;
- custom/local override isolation;
- `Known`/`None`/`Unknown` and `Unknown != 0`;
- partial analysis for incomplete but structurally valid data; and
- deterministic calculated values with provenance/semantic class.

Blend tolerance and Process field validation are stable at the V1
vocabulary/units/policy boundary.

### Workflow and failure semantics

Build Formula, Record Process, Validate Formula, Normalize Formula, and
Prepare Analysis Input map through domain behavior, application intents,
contract outcomes, and scenarios. Hard invalidity, partial success, stale
revisions, reference mismatch, and catalog/source failures are visible.

### Application synthesis gate

`docs/prd.md` and
`docs/architecture/application-architecture-summary.md` are current. The
review findings were capability-scoped and did not change product scope,
platform, dependency sequencing, or root verification policy. The
application-synthesis gate is clear for this node.

## Architecture neutrality

No material neutrality problem was found. Aggregate and bounded-context terms
are used to preserve the user's explicit architectural decisions and are
accompanied by implementation-neutral mapping guidance. Domain events are
described as business moments, not a required event-driven architecture. HTTP
and CLI are explicitly future mappings, not V1 deployment requirements.

## Verification and traceability assessment

- Acceptance scenarios have stable IDs and cover user-visible product-surface
  behavior.
- Every scenario records backend, frontend-integration, and end-to-end
  verification applicability.
- The lack of an automated frontend harness is not a readiness finding under
  the confirmed `catalog-only` policy.
- Contract, application-service, domain-rule, tolerance-boundary, and
  bilingual parity tests can be derived from the synchronized artifacts.
- CompositionSimilarity versus ProcessSimilarity is explicitly deferred to
  its owning downstream capability rather than silently omitted.

## Residual risks and open assumptions

- Dataset ownership, source collection, curation, and calibration remain a
  separate foggy capability and are intentionally outside this node.
- Locale fallback/default-entry behavior is now specified by the Bilingual
  Content and Localization capability: the root has a static primary link to
  `/en/`, supported counterparts are explicit, and unsupported locale paths
  use the public 404 page. SC-015 remains covered by the bilingual parity
  artifact set.
- Persistence/import/export are intentionally deferred; V1 command semantics
  operate on an in-memory/static frontend draft.

## Readiness decision

The capability is well-bounded and its domain behavior, application surface,
external contract, and acceptance scenarios are synchronized. It is **ready
for architecture-specific implementation and issue slicing** under the root
verification policy. R-001–R-006 are resolved and should be retained as part
of the synchronized artifact set.

The node is implemented for its scoped first vertical slice. Dataset
ownership, source collection, curation, and calibration remain separate
planning frontiers; the locale route policy is no longer open.
