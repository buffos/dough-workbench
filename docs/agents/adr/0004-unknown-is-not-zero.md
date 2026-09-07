# ADR-0004: Unknown Is Not Zero

- Status: Accepted
- Date: 2026-09-07
- Scope: Data model, calculation, confidence, and UI

## Context

Missing flour W, P/L, availability, acidity, or process data is common. Treating
missing values as zero changes the formula and creates fabricated certainty.

## Decision

Unknown values are represented explicitly and never coerced to zero. Missing
data reduces metric coverage and confidence, and appears in explanations when
it affects a conclusion. Defaults and inferred values remain distinguishable
from user-supplied values.

## Consequences

The application can still produce partial analysis while honestly describing
its limits. Every engine and UI layer must preserve null/unknown semantics.
