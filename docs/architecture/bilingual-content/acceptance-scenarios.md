# Bilingual Content and Localization — Acceptance Scenarios

Status: Canonical scenario catalog
Date: 2026-09-08

## SC-BI-001 — Default entry

Given a user opens the site root, when the static site resolves the entry, then
the user reaches the English /en/ route without a third locale.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-BI-002 — Supported routes

Given /en/ and /el/ routes, when either route is opened directly, then the
corresponding language renders with the same public content identity.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-BI-003 — Route counterpart

Given the English help page, when the language switcher is used, then the Greek
help counterpart opens rather than a guessed string-replaced path.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-BI-004 — State-neutral switch

Given an in-progress Formula/Process analysis, when locale changes, then
canonical values, IDs, revisions, and model versions remain identical.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-BI-005 — Terminology parity

Given a domain-sensitive label such as structural flour or effective
availability, when rendered in Greek and English, then the approved glossary
terms and matching meaning are used.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-BI-006 — Required key verification

Given a required key missing from one catalog, when parity verification runs,
then it fails with the locale and key instead of silently borrowing the other
language.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-BI-007 — Unknown locale

Given an unsupported locale path, when it is opened, then the public 404 page
appears and no unrelated locale is silently selected.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-BI-008 — Explanation semantics

Given a partial result with Unknown, confidence, and semantic class labels,
when rendered in both locales, then the same distinctions remain visible.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.
