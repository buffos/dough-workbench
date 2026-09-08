# Bilingual Content and Localization — Canonical Domain Model

Status: Canonical
Date: 2026-09-08

## Value objects

### Locale

One of en or el in V1. Unknown locale values are invalid for public rendering.

### RouteDescriptor

Locale, route key, localized path, counterpart path, page kind, and required
content-key set.

### TranslationCatalog

Locale, catalog version, canonical keys, localized values, and parity metadata.

### TerminologyEntry

Canonical domain key, English label, Greek label, definition, examples, and
deprecated synonyms.

## Policies and services

- LocaleRoutingPolicy maps root, supported, and unknown paths.
- RouteParityPolicy verifies counterpart routes and content keys.
- TranslationLookupPolicy resolves a required key for the selected locale.
- TerminologyPolicy rejects conflicting display synonyms in domain-sensitive
  UI.
- LocaleStatePolicy serializes Formula/Process/model state without translated
  labels.

## Invariants

1. Locale is presentation context, never a domain identifier.
2. Required keys exist in both V1 catalogs.
3. A route counterpart preserves public content identity.
4. Missing required translations fail parity verification.
5. Unknown locale paths do not silently render a different locale.
6. Canonical terminology terms have one approved meaning per locale.

## Lifecycle and events

Route requested -> locale validated -> catalog loaded -> parity-checked content
rendered. A missing required key is a content diagnostic.

Events:

- LocaleSelected
- RouteCounterpartOpened
- TranslationParityVerified
- TranslationKeyMissing

## Cross-boundary references

Analysis results carry canonical keys and IDs. Bilingual content translates
them at the presentation boundary; it does not alter calculations or stored
Formula/Process state.
