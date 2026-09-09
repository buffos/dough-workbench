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
Behavior, and Classification, Similarity, and Explanation capabilities have
implemented vertical slices with their delivery issues archived. All seven
own-state bounded capabilities have completed their exact architecture artifact
sets and moved to `specified`; the Formula Analysis Workspace roll-up is now
`implemented` because all four structural children are implemented.
Validation and Calibration remains the only foggy capability.

Current capability totals: `foggy: 1`, `bounded: 0`, `specified: 3`,
`implemented: 6`. Validation and Calibration remains the only foggy planning
capability. The Composition and Intrinsic Metrics delivery frontier is
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
layer. Validation and Calibration remains foggy and requires a separate
planning pass before it can enter delivery slicing.

The next implementation-ready frontier is Interactive Formula Exploration. Its
exact artifact set is complete and clean, and it can extend the implemented
formula-analysis journey with browser-side counterfactual comparisons without
adding a backend or persistence boundary. A delivery slice is being presented
for user approval; no issue references are written until that approval.
