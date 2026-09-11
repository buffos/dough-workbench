# Reference Dataset Acquisition and Curation — Acceptance Scenarios

Status: canonical scenario catalog
Date: 2026-09-10

These scenarios define the path from planned coverage to a candidate handoff.
They do not require a browser scraping surface or a backend in V1.

## SC-ACQ-001 — Inventory has stable preparation coverage

Given an inventory revision contains bread, cake, batter, pizza, pasta, pastry,
and alternative preparations, when it is inspected, then every entry has a
stable preparation key, bilingual labels, a primary navigation category,
priority, lifecycle status, and candidate family mapping or an explicit gap.

Surfaces: backend `not-applicable`; frontend integration `planned`;
end-to-end `catalog-only`.

## SC-ACQ-002 — Category and structural family stay separate

Given a preparation such as pizza may have multiple analytical forms, when its
inventory entry is read, then its user-facing category and structural-family
links remain separate and changing one does not create a duplicate preparation.

Surfaces: backend `not-applicable`; frontend integration `planned`;
end-to-end `catalog-only`.

## SC-ACQ-003 — Aliases resolve to one preparation

Given regional or localized names refer to the same preparation, when aliases
are added or searched, then they resolve to one stable preparation key and do
not create duplicate coverage entries.

Surfaces: backend `not-applicable`; frontend integration `planned`;
end-to-end `catalog-only`.

## SC-ACQ-004 — Source registry records acquisition conditions

Given a candidate source is proposed, when it is registered, then attribution,
author/publisher, reference, access date, quality, acquisition method, reuse
status, and limitations are recorded. Unclear conditions produce
`source_review_required` rather than automatic approval.

Surfaces: backend `not-applicable`; frontend integration `not-applicable`;
end-to-end `catalog-only`.

## SC-ACQ-005 — Acquisition is offline and policy-controlled

Given a registered source has `allowed-offline` or `manual-only` status, when a
maintainer acquires candidate facts, then an immutable AcquisitionRun records
the source, preparation, method, tool/manual version, scope, input identity,
and captured facts. A browser runtime never contacts the source.

Surfaces: backend `not-applicable`; frontend integration `not-applicable`;
end-to-end `catalog-only`.

## SC-ACQ-006 — Restricted or unclear acquisition is blocked

Given a source has unknown terms, a blocked status, or a method that is not
allowed, when acquisition is requested, then it fails with a specific
diagnostic, does not bypass controls, and leaves the inventory gap visible.

Surfaces: backend `not-applicable`; frontend integration `not-applicable`;
end-to-end `catalog-only`.

## SC-ACQ-007 — Normalization preserves traceability

Given captured source facts contain ingredient names and quantities, when a
candidate is normalized, then every required Formula/Process field points to a
source fact or an explicit derived/Unknown trace with the conversion method and
review note.

Surfaces: backend `not-applicable`; frontend integration `not-applicable`;
end-to-end `catalog-only`.

## SC-ACQ-008 — Unknown is not zero

Given a source omits a Process value or a conversion cannot be justified, when
the candidate is normalized, then the value remains Unknown/not recorded and
does not become zero, a default, or a guessed Process value.

Surfaces: backend `not-applicable`; frontend integration `not-applicable`;
end-to-end `catalog-only`.

## SC-ACQ-009 — Ingredient resolution uses the existing boundary

Given a source names an ingredient, when the candidate is normalized, then the
name resolves to a versioned catalog definition or an explicit functional
composition snapshot with provenance. An unresolved required ingredient blocks
release readiness.

Surfaces: backend `not-applicable`; frontend integration `not-applicable`;
end-to-end `catalog-only`.

## SC-ACQ-010 — Candidate review does not publish

Given a normalized candidate has complete or incomplete evidence, when a curator
reviews it, then it becomes accepted-for-release, returned, or rejected with a
reason. None of these outcomes alone exposes it as a public Reference Formula.

Surfaces: backend `not-applicable`; frontend integration `not-applicable`;
end-to-end `catalog-only`.

## SC-ACQ-011 — Pilot reports coverage honestly

Given accepted candidates are selected for a pilot, when the pilot report is
prepared, then it reports category and structural-family counts, source
coverage, missing entries, and blocked entries. Sampling roughly 2–3 records per
broad category does not claim complete calibration coverage.

Surfaces: backend `not-applicable`; frontend integration `planned`;
end-to-end `catalog-only`.

## SC-ACQ-012 — Published data remains immutable

Given a candidate has been handed to or included in a published parent release,
when its source or normalization needs correction, then the correction creates
a new candidate/release revision and does not mutate the historical release.

Surfaces: backend `not-applicable`; frontend integration `not-applicable`;
end-to-end `catalog-only`.

## Coverage decision

The root policy is `when-supported` for frontend integration and `catalog-only`
for end-to-end coverage. This child is primarily a maintainer/offline workflow;
there is no backend boundary and no browser acquisition path in V1. Inventory
inspection and pilot reporting may receive frontend coverage later, while the
offline source and normalization scenarios are verified with deterministic
unit/application tests and manifests.
