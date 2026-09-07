# Formula Input and Normalization — Orchestration Status

State: `specified`

The boundary and exact specification are ready for implementation issue
slicing. The capability owns
canonical Formula input, flour denominator rules, baker's percentages,
ingredient roles, process input capture, and preservation of missing data.

## Artifact inventory

- Planning node: current and `specified`.
- Application PRD: current.
- Application architecture summary: current.
- Source domain specification: strong on invariants and conceptual boundaries.
- Gap report: [requirements-gap-analysis.md](requirements-gap-analysis.md).
- Glossary: [domain-glossary.md](domain-glossary.md), canonical vocabulary
  created and quality-checked.
- Node PRD: [prd.md](prd.md), draft for canonical modeling.
- Canonical domain model: [canonical-domain-model.md](canonical-domain-model.md),
  created and quality-gated for downstream exact artifacts.
- Canonical use cases: [canonical-use-cases.md](canonical-use-cases.md),
  created and quality-gated for downstream contract work.
- Canonical contract: [canonical-api-cli-contract.md](canonical-api-cli-contract.md),
  created and quality-gated for downstream acceptance work.
- Acceptance scenarios: [acceptance-scenarios.md](acceptance-scenarios.md),
  created and quality-gated with verification-surface coverage.
- Readiness review: [readiness-review.md](readiness-review.md), created with
  two high-severity and three medium-severity findings. R-001 through R-004
  were resolved during the review pass, and R-005 was resolved with the
  confirmed V1 tolerance policy. Implementation handoff is ready.
- Delivery issue batch: Issues 001–003 are archived as completed in
  `docs/agents/issues/done/`; Issues 004–007 remain active in
  `docs/agents/issues/pending/` and are registered in
  `docs/agents/issues/issues.md`.

## Current assessment

The user confirmed the validity, role, custom-override, unit, and process-state
policies. The inherited root verification policy is `when-supported`. The node
PRD and glossary support a canonical model with separate Formula and Process
boundaries, explicit invariants, and honest partial-data behavior.

Artifact impact assessment for the domain model:

- planning topology: no change; the node remains bounded;
- capability truth: updated with the canonical model reference;
- application PRD: no scope change; its product rules already cover the model;
- application architecture summary: no boundary or sequencing change;
- delivery issues: none created; exact contract and acceptance work remains.

The use-case model keeps the frontend's initial in-memory/static execution
explicit while preserving stable command/query, revision, idempotency, and
Formula/Process handoff semantics for later adapters.

The canonical contract preserves those semantics through transport-neutral
shapes and future HTTP/CLI mappings. It does not introduce a backend or change
the static GitHub Pages boundary.

The acceptance scenario set covers the happy path, hard failures, partial
analysis, Formula/Process separation, role participation, override isolation,
idempotency, read-side explanation, bilingual parity, and all relevant
stateful-matrix interactions. CompositionSimilarity versus ProcessSimilarity
is explicitly deferred to its downstream owning capability.

The readiness review initially found two material cross-document risks:
contradictory Formula/Process ownership wording and an under-specified Process
field vocabulary/units. It also found smaller contract mismatches for command
outcomes, confidence/coverage representation, and numeric tolerance. R-001
through R-004 are now harmonized across the glossary, PRD, domain model,
use-cases, contract, and scenarios. The user confirmed the V1
`formula-normalization-v1` policy with an inclusive `[99.99%, 100.01%]` range;
the readiness review is now clear and the node is `specified`.

## Next action

Process `004-roles-and-overrides.md` or `005-process-capture.md` next. Recompute
the dependency frontier after each issue closes; all seven issues carry the
mandatory `visual-review` gate because they change rendered frontend behavior.
