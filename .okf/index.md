# Dough Formula Intelligence Planning Map

This bundle is the durable planning map for the bilingual, browser-only Dough
Formula Intelligence product.

## Root

- [Dough Formula Intelligence](project.md)

## Structural capabilities

- [Formula Analysis Workspace](capabilities/formula-analysis-workspace.md)
- [Interactive Formula Exploration](capabilities/interactive-exploration.md)
- [Ingredient and Prototype Knowledge](capabilities/ingredient-prototype-knowledge.md)
- [Validation and Calibration](capabilities/validation-calibration.md)

## Shared concerns

- [Bilingual Content and Localization](capabilities/shared/bilingual-content.md)
- [Trust, Provenance, and Uncertainty](capabilities/shared/trust-and-provenance.md)

## Planning status

The initial topology is confirmed by the user. The Formula Input and
Normalization, Composition and Intrinsic Metrics, Process and Effective
Behavior, Classification, Similarity, and Explanation, and Bilingual Content
and Localization capabilities have implemented vertical slices with their
delivery work archived or covered by the existing integration issues. The
Formula Analysis Workspace roll-up is `implemented` because all four
structural children are implemented. Validation and Calibration is now
specified after the first Gold/reference release boundary was clarified.

Current capability totals: `foggy: 0`, `bounded: 0`, `specified: 3`,
`implemented: 8`. Validation and Calibration, its Reference Dataset
Acquisition and Curation child, and Trust, Provenance, and Uncertainty are the
remaining specified planning capabilities. The Composition
and Intrinsic Metrics delivery frontier is
implemented; issues 008–012 are archived after grouped human review and no
active delivery issue remains under that capability.

Process and Effective Behavior is implemented inside the Formula Analysis
Workspace roll-up; issues 013–018 are archived after the grouped human review.
Ingredient and Prototype Knowledge is implemented: the versioned catalog
boundary, inheritance resolver, high-confidence seed catalog, and scalable
bilingual catalog explorer are present. Issues 019–022 are archived after the
grouped visual review. Classification, Similarity, and Explanation is now
implemented; issues 023–027 are archived after the grouped visual review. The
eight-item presentation limit for classification lists is implemented as a UI
policy while the full classifier result remains available to the calculation
layer. Validation and Calibration now has its exact artifact set and approved
delivery slice in Issues 033–044, with the data/evidence path separated from
the reachable workspace exposure path. Its specified child Reference Dataset
Acquisition and Curation owns the larger coverage inventory, source registry,
and offline acquisition/normalization path. Issues 041–044 cover that child;
Issue 034 now only publishes the approved pilot handoff through the parent
release verifier.

Interactive Formula Exploration is implemented. Its exact artifact set extends
the formula-analysis journey with browser-side counterfactual comparisons
without adding a backend or persistence boundary. Issues 028–032 are archived
in dependency order after the grouped bilingual visual review was approved on
2026-09-10. Its next dependent input is the specified Validation and
Calibration release/reference path.

Bilingual Content and Localization is implemented for the current V1 scope:
explicit English/Greek routes, route-aware switching, localized workspace,
help, catalog, metadata, accessibility copy, terminology, and required-key
parity are covered by the code and automated checks. Its remaining future
items are intentionally outside V1 and do not block the map.
