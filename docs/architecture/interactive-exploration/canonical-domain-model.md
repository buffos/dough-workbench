# Interactive Formula Exploration — Canonical Domain Model

Status: Canonical
Date: 2026-09-08

## Value objects

### ExplorationBaseline

Immutable Formula revision, Process revision, analysis result, model versions,
and captured timestamp/identity used for a comparison.

### CounterfactualPatch

Stable patch ID, target boundary Formula or Process, canonical path, previous
value/state, proposed value/state, and source interaction metadata.

### CounterfactualScenario

Baseline plus ordered patches, scenario revision, and status Editing, Ready,
Rejected, or Evaluated.

### ComparisonResult

Baseline result, counterfactual result, changed paths, metric deltas or
availability changes, and explanations.

## Policies

- PatchValidationPolicy checks path, type, range, revision, and ownership.
- IsolationPolicy applies patches to a copy and preserves baseline identity.
- ComparisonPolicy compares semantic values, states, evidence, and model
  versions without treating unavailable as zero.
- ResetPolicy discards patches and restores the baseline snapshot.

## Invariants

1. Baseline is never mutated by exploration.
2. Every patch has one owner boundary: Formula or Process.
3. A Formula-only patch preserves Process revision; a Process-only patch
   preserves Formula revision.
4. Results from different model versions are not compared as a normal delta.
5. A rejected counterfactual has no result masquerading as a successful one.
6. Unknown values remain unknown unless a patch explicitly provides a value.

## Lifecycle and events

Created -> Editing -> Ready -> Evaluated or Rejected; Reset returns to Editing
with no patches.

Events:

- ExplorationStarted
- CounterfactualPatchApplied
- CounterfactualRejected
- CounterfactualEvaluated
- ExplorationReset

## Extension points

Future saved scenarios and optimization may consume the scenario/value objects,
but they require separate policies and must not silently expand this capability.
