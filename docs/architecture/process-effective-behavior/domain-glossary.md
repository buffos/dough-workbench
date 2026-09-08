# Process and Effective Behavior — Domain Glossary

Status: Canonical vocabulary
Date: 2026-09-08

## Core terms

### Process

The ordered and typed description of handling, mixing, aeration, fermentation,
lamination, thermal treatment, and geometry applied to a Formula.

### Intrinsic metric

A composition-derived metric before Process effects.

### Effective metric

A metric after supported Process features modify or qualify an intrinsic
metric. It may be calculated, estimated, or heuristic depending on the rule.

### AdditionStep

An ordered Process entry with Formula-line references, a controlled action,
and an optional duration. It records sequence; it does not duplicate ingredient
mass.

### Bulk fermentation

The main fermentation while the dough is one mass. Bulk time and bulk
temperature describe that phase; bulk expansion target describes intended
relative volume increase.

### Final proof

The post-shaping fermentation phase. Its time, temperature, and expansion
target are separate from bulk values.

### Lamination

A process that creates layers by combining dough and a referenced fat line
under a fold sequence and working-temperature condition.

### Process coverage

The proportion of process features required by an effective metric that are
known or explicitly absent.

## Controlled value states

- Known: the selected enum, number, boolean, or reference is provided.
- None: the process concept explicitly does not apply or is absent.
- Unknown: it may apply, but no supported value was supplied.

## Critical distinctions

| Term pair | Meaning |
|---|---|
| Bulk temperature vs rise temperature | Bulk temperature is a condition during bulk fermentation; it is not a universal trigger temperature. |
| Expansion target vs time | Expansion target is a relative volume goal; time is a measured duration. |
| Addition order vs ingredient mass | A step references Formula lines and never adds their mass again. |
| Effective behavior vs baked prediction | Effective metrics describe modelled behavior, not guaranteed loaf volume or sensory output. |
| Process similarity vs composition similarity | Process features can differ while the Formula remains identical. |

## Canonical units

Durations use seconds; temperatures use degrees Celsius; normalized intensities
and percentages use ratios in [0,1]; thickness uses millimeters; references
use stable Formula-line IDs.
