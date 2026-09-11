# Reference Dataset Acquisition and Curation — Requirements Gap Analysis

Status: ready for exact specification
Date: 2026-09-10

## Scope and sources

This pass refines the approved expansion of Validation and Calibration. It
uses the current Validation and Calibration reference set, the Ingredient and
Prototype Knowledge boundary, ADR-0006, ADR-0007, the existing static frontend,
and the user's five-step data strategy.

## Confirmed direction

1. Build a large preparation inventory before collecting formulas.
2. Separate the user-facing preparation hierarchy from analytical structural
   families and from individual source records.
3. Use approved, attributable sources and maintainer-controlled offline
   acquisition. The browser never fetches or scrapes recipe sites at runtime.
4. Start with a pilot of roughly 2–3 accepted records per broad navigation
   category, while reporting structural-family gaps rather than claiming full
   representation.
5. Expand one preparation/source record at a time through the same acceptance
   path and immutable release process.

## Boundary clarification

The child owns the path from planned coverage to normalized candidate records.
The parent Validation and Calibration capability still owns acceptance into an
immutable release, role/partition semantics, release verification, model
evidence, maturity, and regression. Ingredient and Prototype Knowledge owns
the reusable ingredient definitions, structural taxonomy vocabulary, and
prototype identity semantics consumed by this child.

## Important distinctions

- A **navigation category** answers “where should a person look?”
- A **structural family** answers “what analytical kind of dough or batter is
  this?”
- A **preparation** is the canonical named preparation, such as brioche or
  fresh egg pasta.
- A **source record** is one source's version of that preparation.
- A **published dataset record** is an accepted, immutable source record with
  normalized snapshots and evidence.

These must not be flattened into one list or one identifier.

## Deferrable delivery details

The exact URLs, source inventory, source terms, extraction adapters, number of
pilot records, static file layout, and normalization notes are delivery
artifacts. They are governed by the policy below and require human approval at
the source/data gates; they do not block the architecture boundary.

## Acquisition policy assumptions

- Source authority is assessed using attribution, editorial/author expertise,
  reproducibility, measurement detail, stability, and provenance—not popularity
  alone.
- No access control, paywall, robots policy, or site terms are bypassed.
- Only the facts required by the Formula/Process contract are normalized into
  project data; source prose and presentation are not republished.
- A source with unclear acquisition or reuse conditions is `manual-review`
  until approved; it is not scraped automatically.
- Non-gram measurements are converted only with a recorded method. If a
  conversion cannot be justified, the value remains Unknown or the candidate
  remains unaccepted.
- No Process field is invented because a source is silent.

## Readiness conclusion

The child has one coherent outcome, clear boundaries, stable vocabulary,
testable workflows, and explicit source/data safeguards. The remaining
uncertainty belongs to the delivery-time source list and candidate records, so
it is no longer planning fog. It can advance through the exact specification
pipeline and then into a dependency-aware issue slice.
