# Trust, Provenance, and Uncertainty — Domain Glossary

Status: Canonical vocabulary
Date: 2026-09-08

## Core terms

### Semantic class

The epistemic kind of an output: Calculated, Estimated, or Heuristic.

### Unknown

A value that may apply but is not established. Unknown is not zero.

### None

An explicit statement that a concept is absent or not applicable.

### Provenance

The source, version, method, and ownership context supporting a value or
interpretation.

### Coverage

The fraction of applicable evidence or required features available for an
output.

### Confidence

A numeric [0,1] assessment of support strength from evidence quality,
completeness, and model maturity. It is not a probability and not similarity.

### Model maturity

The status of the model evidence: expert-seed, calibrated, or
validation-limited.

### Precision policy

The rule that limits displayed precision to what the evidence and model
support. It does not change canonical internal values.

### Explanation

A user-visible account of inputs, rules, contributions, limitations, and
provenance that can be reconciled with the result.

## Critical distinctions

| Distinction | Meaning |
|---|---|
| Unknown vs zero | Missing evidence is not numeric absence. |
| Coverage vs confidence | Coverage measures evidence availability; confidence interprets support. |
| Confidence vs similarity | A close similarity can be low-confidence when evidence is sparse. |
| Calculated vs Estimated | Direct arithmetic differs from model inference. |
| Estimated vs Heuristic | An estimate models a quantity; a heuristic scores or interprets a tendency. |
| Provenance vs label | A source statement explains where data came from; a badge explains how to read it. |
