# Interactive Formula Exploration — Orchestration Status

State: `specified`

The capability owns the browser-side counterfactual engine and UI that
recomputes deterministic analysis when Formula or Process values change.
Target optimization and automatic recipe generation remain future scope.

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

The exact artifact set freezes immutable baselines, typed patches, Formula and
Process isolation, partial comparisons, and reset/recovery behavior. No
unresolved High or Medium findings remain.

Artifact impact: capability truth changed; product and cross-capability
architecture truth have no semantic change, and the root source link is
refreshed. No delivery issue was created.

Next implementation frontier: this specified capability is ready for delivery
slicing. The application synthesis gate is current; the existing static
Astro/Svelte browser boundary, bilingual route policy, and in-memory state
policy remain unchanged. A proposed issue breakdown is being presented for
user approval before issue files and node `issues:` references are written.

Validation and Calibration remains foggy because its dataset scope, source
tiers, collection ownership, storage, curation, and acceptance evidence are
still open. That separate planning frontier does not block this deterministic
counterfactual UI slice.
