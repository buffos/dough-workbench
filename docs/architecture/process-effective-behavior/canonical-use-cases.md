# Process and Effective Behavior — Canonical Use Cases

Status: Canonical application model
Date: 2026-09-08

## Commands

### RecordProcess

Input: a Process draft, Formula ID, and expected Process revision. Output:
completed, partial, rejected, or conflict. It validates the typed vocabulary,
ordering, units, ranges, and references without changing Formula.

### EvaluateEffectiveBehavior

Input: normalized Formula/Process reference, intrinsic metric snapshot, and a
versioned effective-behavior model. Output: effective metrics, feature
contributions, coverage, and limitations.

### ExplainProcessEffect

Input: one effective metric and its paired snapshots. Output: the intrinsic
value, process features used, rule/model version, changed interpretation, and
unknown prerequisites.

## Queries

- GetProcessSnapshot(processId, revision)
- GetProcessCoverage(processId, revision)
- GetEffectiveMetric(metricKey, formulaRevision, processRevision)
- GetAdditionTimeline(processId, revision)

## Orchestration

The application validates and normalizes Process, resolves the exact Formula
revision, obtains intrinsic metrics, evaluates only rules whose prerequisites
are supported, then returns a partial result when coverage is incomplete.
Process-only edits can reuse the Formula snapshot.

## Failure model

- invalid_process_value: wrong enum, unit, range, or state;
- invalid_step_reference: step references another Formula or missing line;
- duplicate_sequence: AdditionStep sequence is not unique;
- stale_pair: Formula or Process revision no longer matches;
- missing_process_evidence: valid but incomplete input, normally partial.

## Canonical chains

1. Record Process -> pair with Formula revision -> evaluate effective metrics.
2. Change bulk temperature -> recompute effective metrics -> keep intrinsic
   metrics identical.
3. Add an ordered late-fat step -> apply the late-incorporation rule when its
   prerequisites exist -> explain the change.
4. Leave process unknown -> show composition-only/intrinsic result and reduced
   process coverage.
