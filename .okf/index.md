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
Normalization capability has an implemented first vertical slice with its
delivery issues archived. All seven own-state bounded capabilities have now
completed their exact architecture artifact sets and moved to `specified`.
The Formula Analysis Workspace roll-up is also `specified` because its three
remaining structural children are specified and its first child is
implemented. Validation and Calibration remains the only foggy capability.

Current capability totals: `foggy: 1`, `bounded: 0`, `specified: 8`,
`implemented: 1`. The next planning frontier is Validation and Calibration;
delivery issue slicing is a separate explicit action after this planning pass.
