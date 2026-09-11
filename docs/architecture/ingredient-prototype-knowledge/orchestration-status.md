# Ingredient and Prototype Knowledge — Orchestration Status

State: `implemented`

The capability owns versioned functional ingredient definitions, prototype
inheritance, taxonomy, matcher metadata, and language-neutral canonical IDs.

## Artifact set

- Gap analysis: [requirements-gap-analysis.md](requirements-gap-analysis.md)
- Glossary: [domain-glossary.md](domain-glossary.md)
- PRD: [prd.md](prd.md)
- Domain model: [canonical-domain-model.md](canonical-domain-model.md)
- Use cases: [canonical-use-cases.md](canonical-use-cases.md)
- Contract: [canonical-api-cli-contract.md](canonical-api-cli-contract.md)
- Scenarios: [acceptance-scenarios.md](acceptance-scenarios.md)
- Readiness review: [readiness-review.md](readiness-review.md)

## Orchestration result

The exact artifact set freezes catalog/version identity, named-to-functional
composition mapping, custom override isolation, prototype inheritance, and
static seed ownership. No unresolved High or Medium findings remain.

Artifact impact: capability truth changed; product and cross-capability
architecture truth have no semantic change, and the root source link is
refreshed. No delivery issue was created.

Code-grounded status: the functional ingredient catalog is implemented in
`src/data/ingredients/starter-catalog.ts`; the prototype side now has a
versioned static catalog in `src/data/prototypes/catalog.ts`, a deterministic
resolver in `src/lib/domain/prototype-catalog.ts`, and a reachable bilingual
inspection surface. This is the prerequisite for a reachable Classification,
Similarity, and Explanation vertical slice.

The user approved the prototype-knowledge delivery breakdown. Issues 019–022
are complete in dependency order: the versioned boundary, inheritance and
family hierarchy, high-confidence seed catalog, and scalable bilingual catalog
explorer. The grouped visual-review gate for issue 022 was approved.

Issue 019 is implemented: the catalog boundary now provides immutable,
version-identified snapshots, deterministic content identity, integrity
diagnostics, and explicit unavailable catalog/model-version failures. The
application synthesis remains current; this is a capability-local change.

Issue 020 is implemented: parent graphs now resolve deterministically with
inherited-versus-own feature provenance, family ancestry, inherited matcher
policy metadata, and explicit cycle/dangling-reference diagnostics. The
immutable source snapshot remains unchanged.

Issue 021 is implemented: the static catalog now contains the initial
high-confidence expert seed of eight named prototypes plus the canonical
structural taxonomy of 13 roots and 41 child families. Qualitative targets,
confidence tiers, maturity, matcher metadata, orthogonal modifier vocabulary,
and provenance remain explicit; calibrated numeric classification boundaries
remain outside this capability.

Issue 022 is implemented and accepted. The English and Greek catalog routes
expose a scalable catalog explorer with a collapsible family tree, search,
URL-persisted selection, compact paginated type results, and one selected type
detail view. The surface also exposes the resolved hierarchy, family-sourced
versus type-specific features, structural requirements, type-defining details,
version metadata, provenance, and explicit unavailable-version recovery.

Artifact impact: delivery truth changed only. The application PRD and
application architecture summary remain current; dataset collection and
calibration remain outside this slice under Validation and Calibration.

The reference dataset now consumes the same canonical family IDs through its
154-entry coverage inventory. Preparation-to-family assignment is explicit in
that inventory, and the former family labels are not part of runtime data.

Next action: Classification, Similarity, and Explanation is the next
downstream frontier after this catalog prerequisite. Dataset collection and
calibration remain owned by Validation and Calibration.
