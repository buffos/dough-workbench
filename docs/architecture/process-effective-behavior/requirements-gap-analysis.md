# Process and Effective Behavior — Requirements Gap Analysis

Status: ready for exact specification
Date: 2026-09-08

## Scope and sources

This pass covers the separate Process aggregate and the transformation from
intrinsic composition metrics to process-sensitive effective behavior. It uses
the formal domain specification, calibration strategy, Formula Input artifacts,
ADR-0002, ADR-0004, and the current process-input-v0.2 implementation.

## Resolved decisions

1. Process is independent from Formula and is paired through a versioned
   Formula/Process reference for analysis.
2. Process fields are controlled enums, typed numbers, booleans, or
   Formula-line references. Free-form prose is not an algorithm input.
3. Every field preserves Known, None, or Unknown. Unknown is not zero.
4. Bulk temperature is the dough/environment temperature during the main
   bulk-fermentation phase. Bulk expansion target is a relative volume target,
   not a temperature or duration.
5. AdditionStep records order and action. It affects calculations only where a
   versioned process rule consumes that feature; an empty step list means order
   was not recorded, not that no additions occurred.
6. Effective metrics are derived from intrinsic metrics plus supported Process
   features. Missing Process data produces partial effective analysis.
7. Mechanical work, overmixing, aeration, fermentation, lamination, thermal,
   and geometry effects are model policies with explicit versions; they are
   not direct physical measurements.

## Deferred but non-blocking decisions

- Exact calibrated coefficients and nonlinear thresholds belong to Validation
  and Calibration.
- Advanced timing/thermal physics and sensory predictions remain outside V1.
- A future free-text process note may be stored as commentary, but it cannot
  influence analysis until it receives a versioned vocabulary.

## Readiness assessment

The implemented Process field vocabulary, units, ranges, state semantics,
reference rules, and effective-metric boundary are sufficient for exact
specification. No clarification is required.

## Artifact impact

- Topology: no impact.
- Capability truth: new exact artifact set.
- Product/architecture truth: current scope already promises this boundary;
  refresh links only.
- Delivery: no issue slicing in this pass.
