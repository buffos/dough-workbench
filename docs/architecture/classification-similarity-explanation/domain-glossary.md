# Classification, Similarity, and Explanation — Domain Glossary

Status: Canonical vocabulary
Date: 2026-09-08

## Core terms

### Structural family

A broad class describing how a formula is organized physically, such as
GlutenStructured, FatShortened, FoamStructured, Laminated, or SteamDominant.

### Prototype

A versioned representation of a family or named product with feature
requirements, weighted dimensions, inheritance, confidence tier, and optional
identity modifiers.

### Structural feature

A feature that materially constrains the physical system, such as gluten
potential, fat shortening, foam, lamination, steam, or setting mechanism.

### Identity modifier

A culturally or conventionally meaningful feature that can refine identity
without replacing structural evidence.

### Similarity

A bounded model score describing closeness to a prototype under a declared
feature set. It is not probability, frequency, or guarantee.

### Hybrid outcome

An outcome where two or more structural families or prototype identities
remain materially plausible and the system presents their evidence rather than
forcing one winner.

### NoStrongCanonicalMatch

A valid outcome when the available evidence does not support a strong named
prototype.

## Score dimensions

- Composition similarity: closeness of functional composition and intrinsic
  metrics.
- Process similarity: closeness of typed Process features.
- Overall identity similarity: declared combination of composition, process,
  structural constraints, and applicable identity modifiers.
- Confidence: evidence/model support for the result; independent from similarity.
- Coverage: proportion of required features available for evaluation.

## Critical distinctions

| Distinction | Rule |
|---|---|
| Similarity vs confidence | A close match with sparse evidence can have low confidence. |
| Family vs named prototype | A family can be supported while no named product is. |
| Structural constraint vs identity modifier | Structural mismatch can block a strong prototype result; a cultural modifier cannot repair it. |
| Unknown vs zero | Missing features lower coverage; they are not negative evidence. |
| Raw ingredient vs functional feature | Classification sees normalized functional features, never display names. |
