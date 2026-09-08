# Trust, Provenance, and Uncertainty — Canonical Domain Model

Status: Canonical
Date: 2026-09-08

## Value objects

### SemanticValue

Value/state, unit, semantic class, provenance, coverage, confidence,
precision policy, model version, and limitations.

### ProvenanceRef

Source kind, source ID, source version, method, contributor, and optional
line/field reference.

### EvidenceSet

Contributions, exclusions, missing prerequisites, assumptions, and policy IDs
used for one output.

### ModelMaturity

One of expert-seed, calibrated, or validation-limited, with model version and
validation reference when available.

### TrustEnvelope

A result-wide wrapper containing coverage, confidence, maturity, provenance,
precision, and explanation references.

## Policies and services

- ValueStatePolicy preserves Known, None, Unknown, and zero.
- SemanticClassPolicy assigns exactly one output class.
- ConfidencePolicy aggregates evidence and maturity without copying similarity.
- PrecisionPolicy selects display precision and wording.
- ExplanationFidelityPolicy checks that every displayed claim maps to evidence.

## Invariants

1. Unknown is never numerically substituted with zero.
2. None is not treated as Unknown and neither is treated as zero.
3. Confidence and coverage are numbers in [0,1].
4. Similarity is never labelled probability.
5. A result without provenance is marked provenance-limited.
6. A displayed value cannot have more precision than its policy allows.
7. An explanation cannot claim a contributor absent from the result evidence.
8. A counterfactual retains its changed-source provenance.

## Lifecycle and events

Evidence collected -> semantic result classified -> trust envelope assembled ->
precision selected -> explanation published. Missing evidence produces a
limitation rather than hidden substitution.

Events:

- EvidenceAttached
- UnknownValuePreserved
- ConfidenceUpdated
- PrecisionReduced
- ExplanationPublished

## Cross-boundary references

This capability supplies metadata contracts to all analysis nodes. It does not
own their metric formulas, prototype rules, translation prose, or calibration
datasets.
