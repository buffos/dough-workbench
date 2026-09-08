# Composition and Intrinsic Metrics — Canonical API/CLI Contract

Status: Canonical transport-neutral contract
Date: 2026-09-08

## V1 boundary

The public product is a static frontend. The canonical contract defines the
application boundary used by the browser; HTTP and CLI mappings below are
illustrative future adapters, not V1 deployment requirements.

## Request

    type IntrinsicAnalysisRequest = {
      formula: NormalizedFormulaSnapshot;
      modelVersion: string;
      availabilityOverrides?: Record<string, number | null>;
    };

## Result

    type MetricResult = {
      key: string;
      value?: number;
      unit: string;
      semanticClass: 'calculated' | 'estimated' | 'heuristic';
      coverage: number;
      confidence: number;
      provenance: ProvenanceRef[];
      contributors: ContributionRef[];
      limitationCodes: string[];
    };

    type IntrinsicAnalysisResult = {
      outcome: 'completed' | 'partial' | 'rejected';
      formulaRevision: number;
      modelVersion: string;
      metrics: MetricResult[];
      diagnostics: Diagnostic[];
    };

## Rules

- coverage and confidence are numbers in [0,1]; localized bands are derived
  presentation.
- value is omitted when the metric is unavailable, never replaced with zero.
- The same request and model version are deterministic.
- A local override includes source formula-line-override and cannot mutate
  catalog payloads.

## Error and diagnostic codes

INVALID_FORMULA, MISSING_FLOUR_DENOMINATOR, UNKNOWN_COMPOSITION,
UNAVAILABLE_ESTIMATE, UNSUPPORTED_MODEL, INTERNAL_METRIC_CONFLICT.

## Illustrative mappings

- Future HTTP: POST /analysis/intrinsic.
- Future CLI: dough analyze-intrinsic --input formula.json --model v1.

Both mappings must preserve the same request, result, error, and omission
semantics. No backend is required for the current product.
