---
type: project
title: Dough Formula Intelligence
description: A bilingual browser-only application that analyzes dough and batter formulas through composition, process, structural behavior, and explainable prototype similarity.
tags: [dough, formula-analysis, frontend, bilingual, github-pages]
timestamp: 2026-09-10T16:45:41Z
children:
  - /capabilities/formula-analysis-workspace.md
  - /capabilities/interactive-exploration.md
  - /capabilities/ingredient-prototype-knowledge.md
  - /capabilities/validation-calibration.md
  - /capabilities/shared/bilingual-content.md
  - /capabilities/shared/trust-and-provenance.md
prd: docs/prd.md
architecture_summary: docs/architecture/application-architecture-summary.md
verification:
  mode: when-supported
  deferred_requires_reason: true
  surfaces:
    backend-boundary: not-applicable
    frontend-integration: when-supported
    end-to-end: catalog-only
adrs:
  - docs/agents/adr/0001-calculated-estimated-heuristic.md
  - docs/agents/adr/0002-formula-process-separation.md
  - docs/agents/adr/0003-composition-process-similarity.md
  - docs/agents/adr/0004-unknown-is-not-zero.md
  - docs/agents/adr/0005-functional-composition-boundary.md
  - docs/agents/adr/0006-static-frontend-platform.md
  - docs/agents/adr/0007-staged-calibration-dataset.md
---

# Intent

Help a baker or formula explorer understand what a dough or batter is doing,
which structural family it approaches, how process changes its behavior, and
which conclusions are calculated, estimated, heuristic, or uncertain.

# Scope

The product is a static, bilingual frontend hosted on GitHub Pages. Formula
analysis runs in the browser using versioned deterministic and explainable
models. It covers formula input, composition decomposition, process-aware
metrics, structural classification, prototype similarity, explanations,
confidence, and future counterfactual exploration.

It does not promise exact baked-product physics, automatic recipe scraping,
machine-learning classification, server persistence, or a backend API in V1.

# Relationships

- Formula analysis: [Formula Analysis Workspace](capabilities/formula-analysis-workspace.md)
- What-if analysis: [Interactive Formula Exploration](capabilities/interactive-exploration.md)
- Domain knowledge: [Ingredient and Prototype Knowledge](capabilities/ingredient-prototype-knowledge.md)
- Model governance: [Validation and Calibration](capabilities/validation-calibration.md)
- Shared localization: [Bilingual Content and Localization](capabilities/shared/bilingual-content.md)
- Shared trust policy: [Trust, Provenance, and Uncertainty](capabilities/shared/trust-and-provenance.md)
- Product truth: [Application PRD](../docs/prd.md)
- Architecture truth: [Application Architecture Summary](../docs/architecture/application-architecture-summary.md)

# Notes

The root verification policy is inherited by capability work. The project is
not ready for issue slicing until node-level artifacts and the application
synthesis remain synchronized.
