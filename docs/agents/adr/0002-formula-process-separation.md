# ADR-0002: Keep Formula and Process as Separate Domain Structures

- Status: Accepted
- Date: 2026-09-07
- Scope: Domain model and analysis pipeline

## Context

The same ingredient composition can produce different behavior depending on
mixing, addition order, fermentation, lamination, thermal history, and
geometry. A final ingredient set cannot represent those differences.

## Decision

`Formula` and `Process` are separate structures. The analysis pipeline keeps
composition/intrinsic metrics separate from process/effective metrics and
applies process through an explicit process engine.

## Consequences

Composition similarity can remain stable while process similarity changes.
Counterfactual process tests become possible, and process data cannot be
silently inferred from ingredient names.
