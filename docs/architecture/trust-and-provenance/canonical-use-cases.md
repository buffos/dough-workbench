# Trust, Provenance, and Uncertainty — Canonical Use Cases

Status: Canonical application model
Date: 2026-09-08

## Commands

### AttachEvidence

Input: a result contribution and provenance reference. Output: an updated
TrustEnvelope without changing the domain formula.

### AssessOutputTrust

Input: result class, evidence set, coverage, model maturity, and policy
version. Output: numeric confidence, precision policy, and limitations.

### ExplainOutput

Input: one output and its evidence. Output: faithful, locale-neutral
explanation tokens for Bilingual Content to render.

## Queries

- GetTrustEnvelope(resultId)
- GetEvidence(resultId)
- GetLimitations(resultId)
- GetDisplayPrecision(resultId)

## Failure model

- provenance_missing
- invalid_confidence_range
- semantic_class_missing
- evidence_result_mismatch
- model_maturity_unknown

These failures are trust diagnostics; they must not silently downgrade to a
different semantic class.

## Canonical chains

1. Calculate metric -> attach source evidence -> assess trust -> render label.
2. Missing field -> preserve Unknown -> reduce coverage/confidence -> explain.
3. Heuristic similarity -> retain score and confidence separately -> render
   similarity wording, never probability wording.
4. Hybrid/no-match -> expose valid outcome -> explain supporting and missing
   evidence.
