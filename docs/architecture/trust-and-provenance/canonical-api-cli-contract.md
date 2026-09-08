# Trust, Provenance, and Uncertainty — Canonical API/CLI Contract

Status: Canonical transport-neutral contract
Date: 2026-09-08

## Trust envelope

    type TrustEnvelope = {
      semanticClass: 'calculated' | 'estimated' | 'heuristic';
      coverage: number;
      confidence: number;
      maturity: 'expert-seed' | 'calibrated' | 'validation-limited';
      precision: { maxDecimals: number; wordingKey: string };
      provenance: ProvenanceRef[];
      evidence: EvidenceRef[];
      limitations: string[];
      modelVersion: string;
    };

## Value state

    type ValueState<T> =
      | { state: 'known'; value: T; trust: TrustEnvelope }
      | { state: 'none' }
      | { state: 'unknown'; reasonCode: string };

## Contract rules

- Confidence and coverage are finite numbers in [0,1].
- Unknown and None do not carry numeric values.
- Similarity and confidence are separate fields.
- An explanation references the same model version as its result.
- Locale adapters translate wording keys but do not alter trust values.

The current product uses this contract in browser memory. Future HTTP/CLI
adapters must preserve omission, provenance, and error semantics.
