# Composition and Intrinsic Metrics — Requirements Gap Analysis

Status: `ready for exact specification`
Date: 2026-09-08

## Scope and sources

This pass covers the capability that turns normalized Formula lines into
functional composition, deterministic composition totals, intrinsic estimates,
and pre-process heuristic metrics. It uses:

- the owning OKF node and the Formula Input and Normalization artifacts;
- the formal domain specification and calibration strategy;
- the initial prototype catalog;
- ADR-0001, ADR-0004, and ADR-0005.

## Resolved capability decisions

1. A named Ingredient resolves to a functional composition snapshot before
   aggregation. The classifier never consumes a raw display name.
2. `Calculated`, `Estimated`, and `Heuristic` are distinct output classes.
3. `Unknown` is preserved as unavailable evidence; it is never converted to
   numeric zero.
4. Structural flour components alone establish the flour denominator.
   Continuous-phase lines contribute to relevant effective estimates; inclusion
   and presentation roles remain separate.
5. Deterministic totals use grams and stable composition fields. Percentages
   are derived from the normalized flour denominator.
6. Effective availability is a local model factor, not kitchen inventory and
   not evidence that a composition field is known.
7. Acid-neutralization capacity, when supplied, uses the canonical unit
   `g NaHCO3 equivalent / 100 g ingredient`. Missing values remain unknown.
8. Calibration may change parameter values and interpretation, but cannot
   change deterministic arithmetic or the semantic class of a metric.

## Deferred but non-blocking decisions

- Dataset ownership, collection, curation, and calibration evidence belong to
  the Validation and Calibration frontier.
- Broad chemistry fields and product-level physical predictions remain
  optional; the contract supports them as unknown until a versioned source
  exists.
- Exact heuristic weights are versioned model data, not hard-coded UI rules.

## Readiness assessment

The boundary, inputs, outputs, missing-data behavior, units, and ownership are
stable enough for the glossary, PRD, canonical model, use cases, contract,
scenarios, and readiness review. No user clarification is required for this
node.

## Artifact impact

- Topology: no impact.
- Capability truth: this exact reference set is new.
- Application PRD and architecture summary: product scope and layer boundaries
  already describe these metrics; link refresh only.
- Delivery: no issue slicing in this pass.
