# Classification, Similarity, and Explanation — PRD

Status: Exact capability specification
Date: 2026-09-08

## Goal

Describe what a Formula structurally resembles without pretending that every
formula has one canonical product name.

## In scope

- hierarchical, multi-label structural family membership;
- versioned prototype inheritance and matcher metadata;
- separate composition, Process, and overall identity similarity;
- near-hard structural constraints;
- Hybrid and NoStrongCanonicalMatch outcomes;
- coverage, confidence, evidence, and model maturity;
- explanations that list feature contributions, conflicts, and missing inputs.

## Out of scope

Probability, neural or LLM classification, complete product taxonomy,
automatic recipe naming, raw ingredient-name rules, and calibrated sensory
prediction.

## Functional requirements

1. Classification starts from effective metrics and Process features.
2. Family membership may contain more than one family.
3. Each prototype declares its feature groups, inheritance, confidence tier,
   matcher version, and structural constraints.
4. Similarity scores are labelled as similarity and never as probability.
5. Missing features reduce coverage/confidence and produce limitations.
6. Structural conflict may yield a Hybrid or NoStrongCanonicalMatch result.
7. Explanations are reproducible from the same feature and model snapshots.

## Success criteria

A user can see both the closest structural interpretation and why a named
match was weak, hybrid, or unavailable.
