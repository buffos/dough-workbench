# Bilingual Content and Localization — Canonical API/CLI Contract

Status: Canonical transport-neutral contract
Date: 2026-09-08

## Route contract

    type RouteDescriptor = {
      routeKey: string;
      locale: 'en' | 'el';
      path: string;
      counterpartPath: string;
      requiredKeys: string[];
    };

Root behavior is a static default entry with a primary link to /en/.
Unsupported locale paths map to 404. V1 does not infer locale from browser
headers.

## Render contract

    type LocalizedViewModel = {
      locale: 'en' | 'el';
      canonicalState: CanonicalAnalysisState;
      labels: Record<string, string>;
      explanations: Record<string, string>;
      terminologyVersion: string;
    };

The canonical state is identical across locales; labels and prose are the only
localized values.

## Parity contract

    type ParityReport = {
      routesMissing: string[];
      keysMissingByLocale: Record<string, string[]>;
      terminologyConflicts: string[];
      outcome: 'pass' | 'fail';
    };

No backend or CLI is required by the static product. A future build/HTTP
adapter must preserve the same route and key semantics.
