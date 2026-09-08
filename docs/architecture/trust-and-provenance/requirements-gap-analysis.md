# Trust, Provenance, and Uncertainty — Requirements Gap Analysis

Status: ready for exact specification
Date: 2026-09-08

## Scope and sources

This pass covers shared result semantics for calculated, estimated, and
heuristic values; missing data; provenance; confidence; coverage; model
maturity; precision; and explanation fidelity. It uses the formal domain
specification, calibration strategy, application PRD, existing Formula Input
artifacts, and ADR-0001, ADR-0003, ADR-0004, and ADR-0007.

## Resolved decisions

1. Every displayed metric or classification result carries a semantic class:
   Calculated, Estimated, or Heuristic.
2. Unknown, None, and numeric zero remain different states.
3. Provenance identifies source kind, source ID/version, method, and model
   version when available.
4. Coverage describes available/applicable evidence; confidence describes
   support strength after evidence and model maturity; similarity is separate.
5. Confidence and coverage are canonical numbers in [0,1]; localized bands are
   presentation labels.
6. Model maturity is explicit: expert-seed, calibrated, or validation-limited.
7. Precision follows evidence and model maturity; the UI must not display
   unsupported decimals or measurement-like certainty.
8. Explanations must cite feature contributions, missing inputs, exclusions,
   assumptions, and the model/policy version.
9. No-match and hybrid are valid honest outcomes, not errors.

## Deferred but non-blocking decisions

- Exact confidence aggregation and calibration evidence are owned by
  Validation and Calibration.
- A future audit/export format can add durable provenance storage.
- Visual styling of badges remains a presentation decision, provided semantic
  classes remain explicit and accessible.

## Readiness assessment

The shared metadata vocabulary and invariants are stable and can be applied by
Composition, Process, Classification, Ingredient, and Exploration without
changing their ownership. No clarification is required.
