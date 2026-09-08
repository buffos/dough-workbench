# Classification, Similarity, and Explanation — Canonical Use Cases

Status: Canonical application model
Date: 2026-09-08

## Commands

### ClassifyFormula

Input: Formula/Process feature snapshot and a prototype model version. Output:
family memberships, candidate similarities, outcome kind, confidence, and
explanation.

### RecalculateSimilarity

Input: an existing feature snapshot plus selected prototype IDs or changed
composition/Process features. Output: separate score vectors and coverage.
This operation is pure and retry-safe.

### ExplainClassification

Input: one classification result. Output: strongest positive features,
structural conflicts, missing features, inherited prototype rules, and model
metadata.

## Queries

- GetFamilyMemberships(analysisRevision)
- GetPrototypeCandidates(analysisRevision)
- GetSimilarityVector(prototypeId, analysisRevision)
- GetClassificationLimitations(analysisRevision)

## Orchestration

The application obtains the effective feature snapshot, resolves the declared
prototype catalog version, applies family gates, computes dimension-specific
scores, evaluates constraints, and emits the least misleading valid outcome.

## Failure model

- invalid_feature_snapshot: classifier input is not normalized;
- model_unavailable: requested prototype/model version is missing;
- insufficient_evidence: result is partial or NoStrongCanonicalMatch;
- constraint_conflict: candidate is rejected with an explanation;
- stale_analysis: result refers to another Formula/Process revision.

## Canonical chains

1. Feature snapshot -> family gate -> prototype vectors -> structural result.
2. Same composition with changed Process -> same composition similarity but
   potentially different Process/overall similarity.
3. Sparse evidence -> lower coverage/confidence -> no fabricated strong match.
4. Conflicting families -> Hybrid outcome with evidence for both.
