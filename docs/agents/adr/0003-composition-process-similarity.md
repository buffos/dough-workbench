# ADR-0003: Keep Composition Similarity and Process Similarity Separate

- Status: Accepted
- Date: 2026-09-07
- Scope: Prototype classification and explanations

## Context

Named products often share composition while differing in identity-critical
process features. Croissant-like composition without lamination is the clearest
example.

## Decision

Named-product results expose `compositionSimilarity`, `processSimilarity`, and
`overallIdentitySimilarity` separately. Similarity is not probability, scores
are not required to sum to 1, and missing process constraints lower identity
confidence without erasing composition similarity.

## Consequences

The UI can explain whether a match is compositional, procedural, or both. The
classifier must consume normalized/effective metrics and process features
instead of raw ingredient-name rules.
