# Bilingual Content and Localization — Canonical Use Cases

Status: Canonical application model
Date: 2026-09-08

## Commands

### SelectLocale

Input: a supported locale and current route context. Output: counterpart route
descriptor or explicit unsupported-locale outcome.

### RenderLocalizedAnalysis

Input: locale, canonical analysis result, and translation catalog version.
Output: localized labels, explanations, metadata, and accessibility text with
unchanged canonical values.

### VerifyLocaleParity

Input: route manifest, required key manifest, and the two catalogs. Output:
pass or diagnostics listing missing/mismatched keys and routes.

## Queries

- GetRouteDescriptor(routeKey, locale)
- GetCounterpartRoute(routeKey, locale)
- GetTranslation(key, locale)
- GetTerminologyEntry(canonicalKey, locale)

## Failure model

- unsupported_locale
- route_counterpart_missing
- required_translation_missing
- terminology_conflict
- catalog_version_mismatch

The root default entry is a routing outcome, not a translation fallback.

## Canonical chains

1. / -> /en/ -> render English landing workspace.
2. /en/help -> /el/help -> render equivalent help content.
3. Switch locale while an analysis exists -> preserve canonical state -> render
   translated labels and explanations.
4. Missing required Greek key -> parity diagnostic/build failure, not English
   text inserted silently.
