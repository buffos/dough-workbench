# Interactive Formula Exploration — PRD

Status: Exact capability specification
Date: 2026-09-08

## Goal

Allow a user to change selected formula or process values and understand which
analysis outputs move, without mutating the original analysis or generating a
recipe.

## In scope

- immutable baseline and typed counterfactual patches;
- Formula-only, Process-only, and paired patches;
- deterministic recomputation in the browser;
- changed/unchanged/unavailable metric comparison;
- explanation of changed paths, model versions, and limitations;
- reset and discard behavior.

## Out of scope

Optimization, automatic substitution, recipe generation, persistence,
accounts, collaboration, and claims that a change improves the baked result.

## Functional requirements

1. A patch targets a declared canonical path and value type.
2. Invalid patches fail without changing the baseline.
3. Formula-only patches do not change the baseline Process snapshot.
4. Process-only patches do not change intrinsic composition metrics.
5. A comparison includes both results, the patch list, and evidence.
6. Reset returns to the exact baseline revision and model versions.
7. If a changed value causes hard invalidity, the counterfactual is rejected
   with recovery guidance.

## Success criteria

The user can ask “what if I change this?” and see a reproducible, explainable
comparison with no hidden mutation of the original formula or process.
