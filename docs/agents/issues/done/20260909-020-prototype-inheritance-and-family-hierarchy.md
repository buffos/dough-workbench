# Issue 020 — Prototype inheritance and family hierarchy

## Issue Metadata

- ID: 020
- Title: Prototype inheritance and family hierarchy
- Category: feature
- State: done
- Owning capability: Ingredient and Prototype Knowledge
- Owning capability node: .okf/capabilities/ingredient-prototype-knowledge.md
- Artifact root: docs/architecture/ingredient-prototype-knowledge
- Delivery order: 2 of 4
- Execution type: AFK
- Review gate: none

## Parent Artifacts

- docs/architecture/ingredient-prototype-knowledge/prd.md
- docs/architecture/ingredient-prototype-knowledge/domain-glossary.md
- docs/architecture/ingredient-prototype-knowledge/canonical-domain-model.md
- docs/architecture/ingredient-prototype-knowledge/canonical-use-cases.md
- docs/architecture/ingredient-prototype-knowledge/canonical-api-cli-contract.md
- docs/architecture/ingredient-prototype-knowledge/acceptance-scenarios.md
- docs/architecture/ingredient-prototype-knowledge/readiness-review.md
- .okf/capabilities/shared/trust-and-provenance.md

## What to build

Build deterministic prototype inheritance and family-tree resolution on top of
the versioned catalog boundary from issue 019. A prototype may inherit declared
features, constraints, and family membership from parent definitions without
losing its own identity. The resolver must expose whether a feature is owned or
inherited and reject parent cycles or dangling parent references with explicit
diagnostics.

Keep structural features, identity modifiers, matcher metadata, and confidence
tier as separate groups. Do not compute similarity scores or classify a
Formula in this issue; the output is the integrity-checked resolved snapshot
consumed by the later catalog and classifier slices.

## Acceptance criteria

- [x] A valid parent/child graph resolves inherited family membership,
  structural features, constraints, and matcher metadata deterministically.
- [x] A child retains its stable prototype ID and own metadata while inherited
  values carry an explicit parent/source reference.
- [x] Cyclic and dangling parent references are rejected with actionable
  integrity diagnostics; no partial inheritance is silently accepted.
- [x] Structural constraints, identity modifiers, confidence tiers, and matcher
  policies remain distinguishable in the resolved result.
- [x] Re-resolving the same catalog version is deterministic and does not
  mutate the source snapshot.
- [x] Automated tests cover SC-IK-006, including valid inheritance and cycle
  rejection.

## Artifact sync required

- Application PRD: none; this implements the already-specified prototype
  inheritance scope without changing the product journey.
- Application architecture summary: none; the static, framework-independent
  model boundary remains unchanged.
- Owning capability node/artifacts: required; update
  `.okf/capabilities/ingredient-prototype-knowledge.md` and its orchestration
  status with the implementation record.
- Issue registry: required; node `issues:` reference: required when `.okf`
  exists.
- Reason/no-impact decision: capability-local inheritance policy; no product,
  cross-capability boundary, or application-synthesis change is expected.

## Blocked by

None — the versioned catalog boundary is now available.

## Functional requirements addressed

This issue addresses Ingredient and Prototype Knowledge requirements 4 and 7
for deterministic prototype inheritance and version-preserving replacement.

## Artifact anchors

- PRD: family hierarchy and prototype inheritance
- Domain model: `PrototypeDefinition` and `PrototypeInheritancePolicy`
- Use cases: `ResolvePrototypeCatalog`
- Contract: `PrototypeReference` parent IDs and matcher metadata
- Invariants: no parent cycles; a prototype keeps its own ID; inherited
  features remain traceable

## Acceptance scenarios addressed

- SC-IK-006 — Prototype inheritance

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-IK-006 | not-applicable | deferred: domain-only slice; catalog surface is issue 022 | deferred: no E2E harness |

## Human review gate

None. This slice changes domain resolution only and has no rendered UI/UX
change. Automated tests and artifact synchronization are the closure
requirements.

## Implementation record

- Added deterministic family/prototype inheritance resolution on the catalog
  boundary. Resolved features retain own versus inherited origin, original
  source ID, and inheritance path; family membership and matcher policy source
  are materialized without changing the immutable input snapshot.
- Cycle, dangling-parent, and missing-policy paths return explicit diagnostics
  and never return a partial resolved catalog.
- Reference trace: SC-IK-006 is covered by valid inheritance, source tracking,
  deterministic ancestry, and cycle-rejection tests.
- Verification: `npm test -- --run src/lib/domain/prototype-catalog.test.ts`
  passed with 7 tests.
