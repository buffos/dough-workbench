---
type: capability
title: Reference Dataset Acquisition and Curation
description: Build the preparation coverage map and the traceable offline path from approved sources to normalized candidate formula records.
tags: [dataset, acquisition, curation, taxonomy, sources]
timestamp: 2026-09-10T20:43:54Z
state: implemented
state_changed: 2026-09-10T20:43:54Z
project: /project.md
parent: /capabilities/validation-calibration.md
shared_with:
  - /capabilities/ingredient-prototype-knowledge.md
  - /capabilities/shared/bilingual-content.md
  - /capabilities/shared/trust-and-provenance.md
artifact_root: docs/architecture/reference-dataset-acquisition
orchestration_status: docs/architecture/reference-dataset-acquisition/orchestration-status.md
gap_analysis: docs/architecture/reference-dataset-acquisition/requirements-gap-analysis.md
glossary: docs/architecture/reference-dataset-acquisition/domain-glossary.md
prd: docs/architecture/reference-dataset-acquisition/prd.md
domain_model: docs/architecture/reference-dataset-acquisition/canonical-domain-model.md
use_cases: docs/architecture/reference-dataset-acquisition/canonical-use-cases.md
contract: docs/architecture/reference-dataset-acquisition/canonical-api-cli-contract.md
scenarios: docs/architecture/reference-dataset-acquisition/acceptance-scenarios.md
readiness_review: docs/architecture/reference-dataset-acquisition/readiness-review.md
issues:
  - docs/agents/issues/done/20260910-041-coverage-inventory-and-taxonomy.md
  - docs/agents/issues/done/20260910-042-source-registry-and-acquisition-policy.md
  - docs/agents/issues/done/20260910-043-offline-acquisition-and-normalization-pipeline.md
  - docs/agents/issues/done/20260910-044-pilot-candidate-curation-and-coverage-report.md
adrs:
  - docs/agents/adr/0005-functional-composition-boundary.md
  - docs/agents/adr/0006-static-frontend-platform.md
  - docs/agents/adr/0007-staged-calibration-dataset.md
---

# Intent

Create a broad, navigable inventory of preparations and a trustworthy,
maintainer-controlled path for turning permitted source material into
normalized candidate Formula/optional Process records.

# Scope

Includes preparation coverage planning, user-facing category hierarchy,
structural-family mapping, aliases, source registry, acquisition permissions,
offline extraction, grams normalization, ingredient resolution, provenance,
candidate curation, and pilot coverage reporting.

It does not own published release identity, public reference loading, model
calibration, or the Formula/Process editor. It never performs runtime scraping
in the GitHub Pages browser and never publishes copied source prose.

# Relationships

- Parent: [Validation and Calibration](/capabilities/validation-calibration.md)
- Uses: [Ingredient and Prototype Knowledge](/capabilities/ingredient-prototype-knowledge.md)
- Shared concern: [Trust, Provenance, and Uncertainty](/capabilities/shared/trust-and-provenance.md)
- Shared concern: [Bilingual Content and Localization](/capabilities/shared/bilingual-content.md)
- Artifact plan: `docs/architecture/reference-dataset-acquisition/`

# Notes

The coverage inventory is a planned universe of preparations, not a promise
that every entry already has a source-backed formula. A source record is kept
separate from the canonical preparation and from the eventual immutable Gold
Dataset release. Source acquisition is offline and policy-controlled; every
candidate remains reviewable before it can enter a published release. Issues
041–044 are complete for this capability scope, including the owner-approved
22-record pilot handoff. The parent release workflow may now consume that
handoff; publication remains owned by Validation and Calibration. The
inventory's 154 preparation entries now point directly to the shared canonical
13-root/41-child structural taxonomy; obsolete family labels are not retained
as a runtime mapping layer.
