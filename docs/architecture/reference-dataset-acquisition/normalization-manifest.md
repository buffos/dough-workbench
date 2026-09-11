# Offline Normalization Manifest v1

Pipeline: `offline-acquisition-v1`
Manifest contract: `normalization-manifest-v1`
Ingredient catalog: `starter-catalog-v2`
Coverage inventory: `coverage-v2`

This document describes the implemented maintainer-side transformation
boundary. It is not a batch of acquired recipes. The machine-readable
implementation is `src/lib/domain/acquisition.ts`.

## Run identity

An `AcquisitionRun` records the source ID, canonical preparation key, capture
method, tool/manual version, field scope, source/input identity, timestamp,
pipeline version, fact IDs, and a deterministic run identity. Replaying the
same source/input/method/scope identity produces the same run identity and
fact ordering; changing the input identity creates a distinct run.

## Normalization rules

- grams are retained as captured;
- kilograms convert to grams with the recorded `kg→g ×1000` conversion;
- millilitres convert only when an explicit positive density is supplied;
- counted items convert only when an explicit positive per-item mass is
  supplied;
- any other or unjustified unit blocks the candidate;
- a named ingredient must resolve through the versioned local catalog or carry
  an explicit functional-composition snapshot;
- missing Process information remains `null`/not recorded and is not replaced
  with zero, a default, or an inferred temperature, mixing, or fermentation
  value;
- each Formula and, when present, Process field receives a captured,
  converted, catalog-mapped, derived, or Unknown trace.

The candidate remains `needs-review` after normalization. Normalization never
means acceptance, publication, calibration, or public selectability.

## Rejection conditions

The pipeline rejects an invalid coverage link, an invalid or unapproved source
registry, blocked/unclear acquisition status, missing run traceability,
invalid mass, unjustified conversion, unresolved required ingredient,
invalid Formula/Process normalization, or any candidate diagnostic. These are
explicit diagnostics rather than silent repairs.

## Current content

The source-policy approval for internal consumption is recorded. The first
manual pilot is materialized in `src/data/reference/pilot.ts` with capture
version `pilot-manual-capture-v1`: 22 candidates across 11 navigation
categories. It deliberately exercises kilogram-to-gram, millilitre-to-gram
with explicit density, and count-to-gram with explicit per-item mass
conversions. It also includes candidates with explicit incomplete composition
snapshots so the resulting fields remain Unknown rather than becoming zero.

Production candidate captures remain maintainer-controlled and are added only
as normalized facts with their source/run identities; the browser never
performs the capture. The pilot's candidate-level reviews and immutable
handoff are still awaiting product/data approval, so the release registry
remains empty.
