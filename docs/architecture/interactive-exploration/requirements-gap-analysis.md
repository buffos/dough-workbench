# Interactive Formula Exploration — Requirements Gap Analysis

Status: ready for exact specification
Date: 2026-09-08

## Scope and sources

This pass covers browser-side counterfactual exploration over Formula and
Process inputs. It uses the application PRD, Formula/Process and metric
artifacts, ADR-0001, ADR-0002, and ADR-0003.

## Resolved decisions

1. Exploration starts from an immutable baseline analysis snapshot.
2. A counterfactual is a typed patch against Formula, Process, or both; it is
   not a free-form recipe-generation instruction.
3. Formula and Process patches remain distinguishable in the comparison.
4. The same model versions are used for baseline and counterfactual unless the
   user explicitly starts a new model-version comparison.
5. Recalculation is deterministic, local, and browser-only.
6. One or more patches may be composed, but every changed path is listed.
7. Optimization, automatic substitutions, and guaranteed improvement are out
   of scope.
8. Unknown values stay unknown in the baseline and counterfactual; a patch
   must explicitly set a supported value to make it known.

## Deferred but non-blocking decisions

- Slider/control selection is a presentation concern; the canonical engine
  accepts typed patches.
- Multi-step history, sharing, and persistent saved experiments are future
  features.
- Smoothness thresholds are regression policies owned by Validation and
  Calibration, while monotonicity is not assumed for nonlinear heuristics.

## Readiness assessment

The state model, patch boundary, comparison result, isolation rules, and
failure cases are stable for exact artifacts. No clarification is required.
