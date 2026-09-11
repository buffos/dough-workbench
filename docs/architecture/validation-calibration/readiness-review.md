# Validation and Calibration — Architecture Readiness Review

Status: ready for architecture-specific implementation
Date: 2026-09-10

## Findings

No unresolved High or Medium findings remain in the current V1 reference set.
The Gold Dataset, public-reference subset, optional Process snapshot, release
immutability, dirty-draft replacement, role/partition separation, maturity,
and regression evidence boundaries remain coherent. The new Reference Dataset
Acquisition and Curation child now owns the preparation inventory, source
registry, offline acquisition, normalization, and pilot path without changing
the parent release/evidence boundary.

## Review checks

- A Reference Formula is clearly distinguished from a universal recipe claim.
- A Gold Dataset is clearly distinguished from a calibrated model release.
- Dataset roles (`reference`, `calibration`) are separate from evaluation
  partitions (`calibration`, `validation`, `test`).
- Public selection requires explicit eligibility and does not expose hidden
  validation/test records.
- Formula is required and Process is optional, while both remain independent.
- Selecting a reference creates a local copy; dirty replacement is explicit;
  source records are immutable.
- Release versions are reproducible and unavailable versions do not silently
  fall back.
- Unknown values remain Unknown and do not become zero.
- The selector is reachable, searchable, bilingual, and scalable for a large
  release rather than relying on one giant dropdown.
- Calibration evidence records data/model versions, partitions, weights,
  maturity, and regression outcomes.
- Acceptance scenarios prove both the user-facing path and the maintainer/data
  governance path.
- The contract remains architecture-neutral; static frontend, local tooling,
  HTTP, or CLI adapters can preserve the same semantics.

## Residual risks and explicit deferrals

The exact source URLs, acquisition/reuse notes, pilot record count, static file
layout, quality-weight values, and numerical fitting method still need to be
implemented and populated. Source and candidate work is now specified in the
child artifacts and remains subject to explicit data/product approval. Broader
dataset ingestion and controlled experiments remain later maturity stages.

The project has no dedicated frontend E2E harness. Under the root
`when-supported` / `catalog-only` policy, issue closure must keep the scenario
deferral explicit. It does not block the architecture specification, but the
reference-selection UI must still be made reachable and covered by available
unit/application checks.

## Application synthesis gate

The root application PRD and architecture summary were refreshed to include
the broad inventory, offline acquisition path, reference-start workflow, the
static versioned-data boundary, and the Validation → Formula Workspace →
Interactive Exploration dependency. No backend, account, persistence, or
runtime-scraping boundary was introduced.

## Artifact impact classification

- Topology: updated; the acquisition child was added under Validation and
  advanced from `bounded` to `specified` with its exact artifact references.
- Capability truth: updated; acquisition, release, and evidence contracts are
  separated and linked.
- Product truth: updated; a broad preparation inventory and a curated source
  path precede the reference-start journey.
- Architecture truth: updated; offline acquisition feeds static releases while
  the browser remains source-free and backend-free.
- Delivery truth: the approved 033–044 slice now covers both the child
  acquisition path and the parent release/reference journey. Issue 034 depends
  on the approved pilot handoff rather than performing curation itself.

## Decision

The capability is specified and its dependency-aware issue slice is active. The
slice includes both the maintainer/data release path and the reachable
user-facing reference-start path; a data-only implementation is not complete.
