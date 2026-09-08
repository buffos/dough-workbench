# Classification, Similarity, and Explanation — Requirements Gap Analysis

Status: ready for exact specification
Date: 2026-09-08

## Scope and sources

This pass covers structural family membership, named-prototype similarity, and
explanations after composition and Process features have been normalized. It
uses the formal domain specification, calibration strategy, initial prototype
catalog, Formula Input artifacts, and ADR-0001, ADR-0003, ADR-0004, and
ADR-0005.

## Resolved decisions

1. The classifier consumes effective metrics and Process features, never raw
   ingredient names.
2. Structural family membership is multi-label and hierarchical. It is not a
   single forced product label.
3. Composition similarity, Process similarity, and overall identity similarity
   are separate scores and are not probabilities.
4. Structural constraints and cultural identity modifiers are separate feature
   groups. A cultural name cannot override a structural contradiction.
5. NoStrongCanonicalMatch and Hybrid are valid outcomes.
6. Missing features reduce coverage/confidence and do not become zero evidence.
7. Prototype confidence tiers and matcher parameters are versioned catalog/model
   data. No uncalibrated numeric boundary is invented in UI code.
8. A missing or incompatible classifier model is an explicit diagnostic, not a
   silent fallback to a different model version.

## Deferred but non-blocking decisions

- Dataset-backed weights and broad taxonomy expansion belong to Validation and
  Calibration.
- The seed catalog may return qualitative or calibration-limited similarity
  explanations until a numeric matcher is available.
- Exact natural-language explanation phrasing belongs to Bilingual Content.

## Readiness assessment

The input boundary, outcome vocabulary, separate score semantics, prototype
inheritance, missing-data policy, and explanation evidence contract are stable.
No clarification is required.

## Artifact impact

- Topology: no impact.
- Capability truth: new exact artifact set.
- Application scope and architecture sequencing remain unchanged; links refresh.
- No delivery issue is created by specification work.
