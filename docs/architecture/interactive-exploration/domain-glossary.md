# Interactive Formula Exploration — Domain Glossary

Status: Canonical vocabulary
Date: 2026-09-08

## Core terms

### Baseline analysis

The immutable Formula/Process analysis against which a counterfactual is
compared.

### Counterfactual

A proposed typed change to selected Formula or Process paths, evaluated without
mutating the baseline.

### Patch

A stable path, previous value/state, and proposed value/state with provenance.

### Comparison

The baseline and counterfactual results plus a structured list of changed
metrics, unchanged metrics, and limitations.

### Formula patch

A change to composition, mass, role, or availability input.

### Process patch

A change to a typed handling, timing, temperature, addition, lamination,
thermal, or geometry input.

## Critical distinctions

| Distinction | Meaning |
|---|---|
| Counterfactual vs optimization | Exploration asks what changes; it does not search for the best recipe. |
| Baseline vs draft | Baseline is immutable for a comparison; a new committed draft is a separate application concern. |
| Formula effect vs Process effect | A comparison reports which boundary changed and does not merge their explanations. |
| Unchanged metric vs unavailable metric | Unchanged means both values are comparable; unavailable means evidence is insufficient. |
| Smoothness vs monotonicity | Small input changes should avoid arbitrary discontinuities where the model promises continuity; not every metric must move in one direction. |
