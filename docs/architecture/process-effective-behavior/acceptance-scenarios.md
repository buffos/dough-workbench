# Process and Effective Behavior — Acceptance Scenarios

Status: Canonical scenario catalog
Date: 2026-09-08

## SC-PR-001 — Process vocabulary is typed

Given a Process editor, when a categorical field is entered, then the value is
one of the controlled options and an unsupported phrase cannot become an
algorithm-facing value.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-PR-002 — Known, None, Unknown

Given a fermentation field, when the user selects a value, explicit absence,
or not-recorded state, then the normalized Process preserves those three
different meanings.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-PR-003 — Bulk semantics

Given bulk temperature 24 degrees Celsius and a 50% bulk expansion target,
when the Process is explained, then temperature is described as a phase
condition and expansion as a relative volume goal.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-PR-004 — Addition order is not duplicate mass

Given a step referencing the butter Formula line, when the timeline is
normalized, then it records the reference and action without adding butter
mass a second time.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-PR-005 — Addition order affects only supported rules

Given identical Formula and two Process snapshots that differ only in late-fat
order, when an effective model with a late-fat rule runs, then the feature
contribution explains the difference; with no such rule, no unexplained metric
change is fabricated.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-PR-006 — Process independence

Given one Formula and two valid Process revisions, when intrinsic metrics are
compared, then they remain identical while effective metrics may differ.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-PR-007 — Missing Process is partial

Given a valid Formula and an all-Unknown Process, when analysis runs, then
intrinsic results remain available and process-sensitive results are partial
with reduced coverage.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-PR-008 — Reference conflict

Given a step referencing a line from another Formula revision, when Process is
paired, then the result is rejected or conflict with recovery guidance.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.

## SC-PR-009 — Process explanation

Given an effective metric changed by mixing and fermentation features, when the
user opens the explanation, then the intrinsic baseline, features, rule
version, and missing prerequisites are visible.

Surfaces: backend not-applicable; frontend when-supported; E2E catalog-only.
