# Process and Effective Behavior — PRD

Status: Exact capability specification
Date: 2026-09-08

## Goal

Show how the same Formula may behave differently when handling, fermentation,
lamination, thermal conditions, or geometry change.

## In scope

- normalize the Process aggregate with process-input-v0.2;
- preserve independent Process revisions and Formula references;
- capture mixing, addition order, aeration, fermentation, lamination, thermal,
  and geometry inputs;
- derive effective gluten, gas retention, setting, fluidity, and process-risk
  features from intrinsic metrics and supported Process fields;
- report process coverage, confidence, evidence, and limitations;
- keep composition and process similarity separate for downstream consumers.

## Out of scope

Exact fermentation kinetics, guaranteed rise/volume, sensory prediction,
automatic timing advice, recipe generation, and arbitrary natural-language
process interpretation.

## Functional requirements

1. A Process field is accepted only as a controlled option, typed value,
   boolean, or valid Formula-line reference.
2. Numeric fields enforce canonical units and declared ranges.
3. An incomplete Process can produce partial effective analysis.
4. Explicit None differs from Unknown and from numeric zero.
5. AdditionStep sequence is validated and exposed to rules that consume
   addition order, fat timing, or fold behavior.
6. A Process-only change leaves intrinsic composition metrics unchanged.
7. Every process-sensitive result names the process model version and the
   features that contributed.

## Success criteria

Users can explain why two identical formulas differ in effective behavior,
while the system never presents a process heuristic as a direct measurement.
