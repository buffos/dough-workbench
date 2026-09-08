# Classification, Similarity, and Explanation — Canonical API/CLI Contract

Status: Canonical transport-neutral contract
Date: 2026-09-08

## Request

    type ClassificationRequest = {
      featureSnapshot: ClassificationFeatureSet;
      prototypeModelVersion: string;
    };

## Result

    type ClassificationResult = {
      outcome: 'strong_match' | 'structural_match' | 'hybrid' |
        'no_strong_canonical_match' | 'partial';
      families: FamilyMembership[];
      candidates: PrototypeSimilarity[];
      confidence: number;
      coverage: number;
      explanation: ClassificationExplanation;
      modelVersion: string;
      diagnostics: Diagnostic[];
    };

    type PrototypeSimilarity = {
      prototypeId: string;
      compositionSimilarity?: number;
      processSimilarity?: number;
      overallIdentitySimilarity?: number;
      confidence: number;
      coverage: number;
      status: 'candidate' | 'supported' | 'conflicted' | 'unavailable';
    };

## Contract rules

- Similarity values are bounded scores, not probabilities.
- A score is omitted when its dimension lacks required evidence.
- Family and prototype IDs are language-neutral.
- Model parameters, weights, gates, and confidence tiers travel with the
  requested model version.
- A classification may be structurally useful with no named match.

Illustrative future mappings are POST /analysis/classification and
dough classify --analysis analysis.json --model prototypes-v1.
