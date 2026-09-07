# ADR-0001: Separate Calculated, Estimated, and Heuristic Values

- Status: Accepted
- Date: 2026-09-07
- Scope: All analysis outputs

## Context

The product combines arithmetic derived from known composition, physically
meaningful estimates that depend on assumptions, and model scores used for
classification. Presenting them as one kind of number would create false
precision and make calibration impossible to reason about.

## Decision

Every metric carries an explicit semantic class: `Calculated`, `Estimated`, or
`Heuristic`. The model and UI preserve the class, provenance, confidence, and
appropriate precision. Heuristic scores are never presented as laboratory
measurements.

## Consequences

Deterministic arithmetic can ship before calibration. Estimated and heuristic
outputs can be useful in V1, but their limits must remain visible and their
confidence must be independent from similarity.
