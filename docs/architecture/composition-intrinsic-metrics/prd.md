# Composition and Intrinsic Metrics — PRD

Status: Exact capability specification
Date: 2026-09-08

## Goal

Let the Formula Explorer see what a valid formula contains before Process
effects are applied, with honest treatment of missing information and a clear
separation between arithmetic, estimates, and heuristic interpretation.

## In scope

- resolve catalog or custom Ingredient definitions to functional composition;
- aggregate water, fat, sugar subclasses, proteins, starch, fiber, salt,
  flour blend, egg, and dairy solids where evidence exists;
- calculate flour-relative percentages;
- estimate effective hydration and flour absorption when model inputs support
  them;
- expose intrinsic heuristic metrics such as GPI, EGI, enrichment,
  tenderness, and fluidity;
- attach semantic class, coverage, confidence, provenance, model version, and
  limitations to every result.

## Out of scope

Process modifiers, named-product classification, probability claims, exact
baked-product predictions, automatic nutritional labeling, and dataset
calibration ownership.

## Functional requirements

1. A normalized Formula with a positive flour denominator produces deterministic
   composition totals for supported known fields.
2. Unknown contributors remain unknown or partial; they do not contribute zero
   merely because they are missing.
3. A line-local availability factor can scale a known component only for the
   metric families that declare the factor applicable.
4. Every metric identifies its semantic class and model/policy version.
5. Intrinsic metrics remain independent from Process so the same Formula can be
   analyzed under multiple Process snapshots.
6. A metric explanation lists the contributing lines, exclusions, missing
   evidence, and applied parameters.
7. The presentation can show a partial metric without implying laboratory
   precision.

## Success criteria

The same normalized input and model version yield the same result; changing
only an unknown field changes coverage/confidence without inventing a value;
and an audit reader can reconstruct why each displayed metric is calculated,
estimated, or heuristic.
