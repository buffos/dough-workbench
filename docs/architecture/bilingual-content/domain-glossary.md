# Bilingual Content and Localization — Domain Glossary

Status: Canonical vocabulary
Date: 2026-09-08

## Core terms

### Locale

A supported language context: en or el in V1.

### Localized route

A public path whose locale segment identifies the language of its rendered
content, such as /en/ or /el/.

### Route counterpart

The equivalent public route in the other supported locale.

### Canonical key

A language-neutral identifier used to retrieve a translated label, message,
help entry, or metadata value.

### Terminology entry

A canonical domain term with approved English and Greek display forms and
optional explanatory text.

### Parity

The condition that required routes, keys, fields, and public behavior exist in
both locales with equivalent semantic meaning.

### Default entry

The V1 English landing route reached from the site root.

## Critical distinctions

| Distinction | Meaning |
|---|---|
| Canonical ID vs display label | IDs remain stable; labels are translated. |
| Locale fallback vs default entry | Default entry handles /; fallback rules handle missing content and are not used to guess a locale. |
| Translation parity vs literal translation | Parity preserves behavior and meaning, not word-for-word syntax. |
| User data vs UI content | Formula/Process state stays locale-neutral; UI labels and explanations change locale. |
| Missing translation vs Unknown domain value | A translation defect is a build/content error; Unknown is a valid domain state. |

## Approved V1 terms

The canonical English term and Greek label are stored together for every
public concept. The glossary is the authority for domain-sensitive labels and
help copy; feature-local wording cannot introduce a competing synonym.
