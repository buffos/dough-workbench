# Classification, Similarity, and Explanation — Canonical Domain Model

Status: Canonical
Date: 2026-09-08

## Value objects

### PrototypeDefinition

Versioned prototype with canonical ID, family membership, inherited feature
groups, structural constraints, identity modifiers, weights, confidence tier,
and matcher policy ID.

### ClassificationFeatureSet

Normalized composition and Process feature values with value states,
provenance, coverage, and model versions. It is the only classifier input.

### SimilarityVector

Separate composition, Process, and overall identity scores, each with
evaluated features, coverage, confidence, and model version.

### ClassificationOutcome

One or more family memberships, prototype candidates, result kind
StrongMatch, StructuralMatch, Hybrid, NoStrongCanonicalMatch, and an
explanation evidence set.

## Policies and services

- PrototypeInheritancePolicy resolves parent features before matching.
- FamilyGatePolicy eliminates structurally impossible candidate families.
- SimilarityPolicy computes only declared dimensions with available evidence.
- IdentityPolicy combines dimensions without converting the result to
  probability.
- ExplanationPolicy preserves feature-level contribution and conflict data.

## Invariants

1. Raw ingredient names never enter matcher logic.
2. Composition and Process similarity remain separate fields.
3. Confidence is not derived by copying similarity.
4. Unknown features reduce coverage and cannot be treated as zero.
5. A structural constraint conflict is visible in the outcome.
6. Missing model data is a diagnostic, not an implicit default version.
7. A prototype can inherit a family definition without losing its own ID.

## Lifecycle

Features are assembled -> family gates are evaluated -> candidate vectors are
computed -> constraints and identity modifiers are applied -> outcome and
explanation are emitted. A partial feature set may produce a partial
classification or NoStrongCanonicalMatch.

## Events

- ClassificationEvaluated
- StructuralFamilyDetected
- PrototypeCandidateAdded
- HybridClassificationEmitted
- NoStrongCanonicalMatchEmitted

## Cross-boundary references

The classifier stores feature IDs, prototype IDs, model IDs, and evidence
references. Localized labels are resolved by Bilingual Content, while data
quality metadata is governed by Trust and Provenance.
