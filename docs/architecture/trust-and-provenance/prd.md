# Trust, Provenance, and Uncertainty — PRD

Status: Exact capability specification
Date: 2026-09-08

## Goal

Prevent the product from presenting assumptions, missing data, or heuristic
scores as scientific certainty.

## In scope

- semantic class labels and explanations;
- Known, None, Unknown, and omission rules;
- provenance and source-version references;
- coverage, confidence, model maturity, and precision;
- limitations and contribution explanations;
- confidence/similarity separation;
- no-match and hybrid trust presentation.

## Out of scope

Scientific validation itself, data collection, external audit storage,
probabilistic calibration, and visual branding beyond accessible semantic
presentation.

## Functional requirements

1. Every output carries semantic class and model/policy version.
2. Unknown values remain explicit through domain, application, and UI layers.
3. Numeric confidence/coverage stay in [0,1].
4. Presentation may derive localized bands but cannot replace canonical values.
5. Precision is reduced when evidence is incomplete or model maturity is low.
6. Every explanation can name what contributed and what was missing.
7. No-match and hybrid are rendered as valid analysis outcomes.
8. Provenance survives Formula-local overrides and counterfactuals.

## Success criteria

A user can tell what the system calculated, estimated, inferred heuristically,
does not know, and why it reached or withheld a named conclusion.
