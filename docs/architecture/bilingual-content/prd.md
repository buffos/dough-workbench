# Bilingual Content and Localization — PRD

Status: Exact capability specification
Date: 2026-09-08

## Goal

Make Greek and English equivalent product experiences while keeping analysis
state, model identifiers, and domain rules independent from language.

## In scope

- /en/ and /el/ public routes and route counterparts;
- static root default entry with a primary link to /en/ and explicit 404
  behavior;
- localized navigation, workspace labels, help content, explanations,
  metadata, and accessibility text;
- canonical terminology keys and locale-neutral state persistence;
- parity checks for routes and required translation keys.

## Out of scope

Automatic browser-language selection, partial language mixing, machine
translation at runtime, additional locales, and translation of canonical model
IDs.

## Functional requirements

1. The root entry makes /en/ discoverable without creating a third locale.
2. Each supported public page declares its route counterpart.
3. The language switcher preserves the public content context.
4. Required keys exist in both locale catalogs and are checked before build.
5. The same Formula/Process state can be rendered in either locale.
6. Translated explanations preserve semantic class, confidence, limitation,
   and Unknown/None distinctions.
7. Missing required translation is surfaced as a diagnostic rather than
   silently mixing languages.

## Success criteria

A user can enter or review the same analysis in Greek or English, switch route
without changing canonical state, and receive equivalent behavior and
terminology.
