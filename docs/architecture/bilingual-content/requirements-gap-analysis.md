# Bilingual Content and Localization — Requirements Gap Analysis

Status: ready for exact specification
Date: 2026-09-08

## Scope and sources

This pass covers public Greek and English routes, localized UI/content,
terminology, metadata, and parity verification. It uses the application PRD,
architecture summary, current /en/ and /el/ routes and message catalogs, Issue
007 evidence, ADR-0006, and the shared capability links.

## Resolved decisions

1. English and Greek are first-class locales with explicit /en/ and /el/
   routes.
2. The site root / is a static default-entry page with a primary link to /en/;
   it is not a third locale.
3. Unknown locale paths resolve to the public 404 page. There is no browser
   language guessing in V1.
4. Every public route with bilingual content has a declared counterpart and
   the language switcher uses route metadata, not string replacement.
5. Canonical IDs, model versions, metric keys, and stored state are
   language-neutral.
6. Required UI and explanation keys must exist in both locales. Missing parity
   is a build/check failure, not silent language mixing.
7. Locale labels, help prose, metadata, and accessibility text are owned by
   localized content sources. Domain logic owns no translated strings.
8. Greek terminology follows the canonical glossary, including Άλευρα,
   Κύρια μάζα ζύμης, Συντελεστής αποτελεσματικής συμμετοχής, and the
   Known/None/Unknown explanations.

## Deferred but non-blocking decisions

- Additional locales and pluralization rules are future scope.
- SEO translations beyond the current public pages can be added through the
  same route/content contract.
- Browser language detection can be considered only with an explicit product
  decision; it is not inferred from the user's browser.

## Readiness assessment

Route ownership, default entry, 404 behavior, key parity, terminology
ownership, and model-state neutrality are stable for exact artifacts. No
clarification is required.
