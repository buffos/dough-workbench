# Bilingual Content and Localization — Orchestration Status

State: `implemented`

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

Code-grounded verification on 2026-09-10 confirms that the current V1 scope is
implemented: `/`, `/en/`, `/el/`, help, and catalog routes exist; language
switching uses route-aware counterparts; workspace state remains locale-neutral;
localized labels, explanations, metadata, accessibility copy, and catalog
labels are present; and the English/Greek parity and diagnostic tests pass.

Artifact impact: capability truth changed through implementation verification.
Product truth and cross-capability architecture truth have no semantic change;
the root documents already describe the implemented bilingual route and parity
policy. No separate delivery issue is required and no active bilingual issue
remains.

Verification notes: `npm test -- --run`, `npm run lint`, and
`npm run typecheck` pass. The Astro static build was not run because the user
manages the local Astro preview; static build output remains a separate
user-run check under the project's `when-supported` verification policy.

Next action: preserve the parity gate when new content or route counterparts
are added. Future locales, browser-language detection, and expanded content
remain deferred by the V1 scope.

The catalog explorer keeps the same `/en/catalog/` and `/el/catalog/`
counterpart policy while adding search, hierarchy, result-count, and
pagination copy with required key parity.
