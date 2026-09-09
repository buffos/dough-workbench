# Bilingual Content and Localization — Orchestration Status

State: `specified`

Greek and English are first-class locales. The exact route policy uses
explicit /en/ and /el/ paths, a static root default entry to /en/, and a
public 404 for unsupported locale paths. Translated UI/content labels remain
separate from language-neutral model identifiers.

## Artifact set

- Gap analysis: [requirements-gap-analysis.md](requirements-gap-analysis.md)
- Glossary: [domain-glossary.md](domain-glossary.md)
- PRD: [prd.md](prd.md)
- Domain model: [canonical-domain-model.md](canonical-domain-model.md)
- Use cases: [canonical-use-cases.md](canonical-use-cases.md)
- Contract: [canonical-api-cli-contract.md](canonical-api-cli-contract.md)
- Scenarios: [acceptance-scenarios.md](acceptance-scenarios.md)
- Readiness review: [readiness-review.md](readiness-review.md)

## Orchestration result

The exact artifact set freezes locale ownership, route counterparts, default
entry, unsupported-locale behavior, required key parity, and terminology
governance. No unresolved High or Medium findings remain.

Artifact impact: product truth changed only by resolving the existing default
entry/fallback decision; the matching route-policy refresh is recorded in the
root documents. No delivery issue was created.

Next action: keep the synchronized root application documents linked when this
capability changes; no delivery issue is inferred from the architecture pass.

The catalog explorer keeps the same `/en/catalog/` and `/el/catalog/`
counterpart policy while adding search, hierarchy, result-count, and
pagination copy with required key parity.
