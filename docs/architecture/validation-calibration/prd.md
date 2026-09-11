# Validation and Calibration — Product Requirements

Status: implementation-ready V1 capability specification
Date: 2026-09-10

## Purpose

Give Dough Formula Intelligence a trustworthy path from provisional expert
knowledge to evidence-backed model releases, while allowing a user to begin an
analysis from a curated reference formula instead of filling every field from
scratch.

## Product summary

The capability governs versioned Formula/optional Process records and the
evidence used to calibrate and evaluate formula-intelligence models. Its
structural child maintains a broad preparation inventory and an offline,
source-backed candidate path. The first release is an immutable Gold Dataset
stored as static project data and assembled only from normalized, reviewed
candidates. Accepted records may be marked as public references and selected
from the bilingual workspace.

Selecting a reference is a starting-point convenience, not recipe generation
and not a claim that the selected quantities are universally correct. The
selected snapshot is copied into a local editable draft. The user can then
change water, eggs, flour, fat, process fields, or other supported values and
use the existing analysis and counterfactual exploration behavior to inspect
the consequences.

## Actors

### Baker / Formula Explorer

Chooses Blank or a public Reference Formula, reviews source and maturity
information, edits the local draft, and examines calculated, estimated, and
heuristic results.

### Coverage, Source, and Dataset Curators

The Coverage Curator defines the preparation inventory and category/family
mapping. The Source Curator evaluates sources and permitted acquisition
methods. The Dataset Curator transcribes or reviews candidate formulas from
approved attributable sources, normalizes them to the domain contract, resolves
ingredient composition, records unknowns and provenance, and submits records
for release acceptance. Detailed acquisition behavior belongs to the
Reference Dataset Acquisition and Curation child.

### Calibration Evaluator

Evaluates model parameters and interpretation against separated Gold, broad,
validation, test, and controlled-experiment evidence. This actor may be a
maintainer or a repeatable local evaluation process; V1 does not require a
server or user-facing calibration console.

## Goals

1. Reduce formula-entry effort through curated reference starting points.
2. Keep reference data reproducible, attributable, and versioned.
3. Separate public reference use from calibration, validation, and test use.
4. Preserve the existing Formula/Process boundary and Unknown semantics.
5. Make model maturity, confidence ceilings, provenance, and evidence visible
   enough to prevent false precision.
6. Provide stable evidence and regression rules for future model calibration.
7. Keep the V1 implementation compatible with a static GitHub Pages frontend.
8. Make the intended preparation coverage visible before collecting source
   records.

## Non-goals

This capability does not provide:

- browser/runtime scraping, unattended crawling, or a finalized external data
  provider; approved offline acquisition is a maintainer workflow;
- user uploads, collaborative editing, or publishing of dataset records;
- a backend database, account system, or server-side calibration job;
- automatic recipe generation, optimization, or guaranteed substitution;
- a claim that a Reference Formula is the only correct formula for a
  preparation;
- exact baked-product prediction such as loaf volume, proof time, crumb-cell
  size, final texture, or sensory outcome;
- automatic browser-language selection or additional locales;
- a fixed maximum number of records per preparation;
- a requirement to expose validation/test records in the public selector.

## Domain scope

The capability includes:

- preparation coverage inventory, navigation categories, aliases, and
  structural-family mappings supplied by the acquisition child;
- source registry and offline acquisition/normalization evidence;
- manually curated candidate and accepted records;
- Formula snapshots in grams and optional independent Process snapshots;
- preparation identity, structural-family/prototype links, and localized
  display labels;
- source provenance, quality evidence, reviewer/acceptance status, and
  dataset roles;
- immutable release identity and release availability policy;
- public reference filtering, primary-reference selection, and scalable
  browsing metadata;
- calibration/validation/test partitioning and quality weighting;
- model maturity and parameter-release evidence;
- deterministic regression scenarios for recognition, confidence, unknowns,
  counterfactual smoothness, and explanation fidelity.

## User-facing workflows

### Start from Blank

The workspace offers Blank Formula as the default starting choice. The user
receives the existing empty Formula/Process draft and can enter values
manually.

### Start from a Reference Formula

The user chooses Reference Formula, searches by preparation/name, and filters
or browses by structural family. The list is bilingual, scalable, and not an
unbounded dropdown. A primary reference appears first when one exists.

The user can inspect the reference's preparation, source, dataset release,
maturity, and whether a Process snapshot is included. Selecting it creates a
local draft containing the Formula snapshot and, when present, its independent
Process snapshot.

### Replace a current draft

If the current Formula/Process draft has no edits, selecting Blank or a
reference replaces it directly. If it is dirty, the workspace asks for
explicit confirmation. Replacement discards the current local draft and loads
the selected complete snapshot; it never merges lines or retains an unrelated
Process snapshot when the selected record has no Process.

### Explore the selected draft

After loading, the user can change supported Formula or Process values. The
existing analysis workspace recalculates deterministic, estimated, and
heuristic outputs. The existing counterfactual flow can compare changes while
preserving the immutable baseline and Formula/Process separation.

### Acquire, curate, and publish a release

The Coverage and Source Curators first define the intended preparation coverage,
register approved sources, and acquire candidate facts offline. The Dataset
Curator normalizes and reviews the candidates outside the public browser UI. A
record then passes the parent acceptance checklist, receives roles and an
evaluation partition, and is included in an immutable release such as
`gold-formulas-v2`. A later correction or addition creates a new release rather
than changing an existing snapshot.

### Evaluate and calibrate a model release

The Calibration Evaluator selects a versioned model and evidence release,
calculates the agreed statistics and regression outcomes, and publishes a
versioned parameter/maturity result. Gold evidence carries stronger weight
than broad/noisy evidence; validation and test evidence are not used to fit the
same parameter release.

## Functional requirements

### Reference release and records

**FR-VC-001 — Immutable release identity**

Every dataset release has a stable ID, version, creation metadata, source
policy, and content identity. Consumers can request the current supported
release or an explicit version. An unavailable version produces a diagnostic;
the system does not silently substitute another release.

**FR-VC-002 — Record completeness**

Every accepted record contains a valid Formula snapshot. A Process snapshot is
optional. Every Formula line resolves to a versioned ingredient definition or
an explicit functional-composition snapshot with provenance. Unknown fields
remain Unknown.

**FR-VC-003 — Roles and partitions**

Each record declares permitted roles such as `reference` and `calibration`, an
explicit `publicSelectable` flag, and an evaluation partition when it is used
for model evaluation. `validation` and `test` partitions remain isolated from
parameter fitting. Public selection is allowed only for accepted records with
`publicSelectable: true` and the `reference` role.

**FR-VC-004 — Multiple references per preparation**

A preparation may have multiple accepted reference records. A release has at
most one `primary` reference per preparation; the selector may show other
accepted variants.

**FR-VC-005 — Provenance and maturity**

Every accepted record exposes source identity, quality/curation evidence,
release version, and maturity/status. `Gold Dataset` and `Expert Seed` wording
must not imply calibrated scientific accuracy.

### Loading and editing

**FR-VC-006 — Scalable discovery**

The workspace exposes Blank and Reference start modes. Reference discovery
supports localized name/preparation search and structural-family filtering. It
must remain usable as the release grows without rendering every record as a
single giant control.

**FR-VC-007 — Snapshot copy**

Selecting a reference creates an independent local Formula draft and, if
present, an independent Process draft. Editing the draft cannot mutate the
release or any other draft.

**FR-VC-008 — Safe replacement**

Selecting a new start point while the current draft is dirty requires explicit
confirmation. The replacement is atomic from the user's perspective and does
not merge Formula lines or carry over Process fields from the previous draft.

**FR-VC-009 — Blank remains available**

Blank remains a first-class start mode and remains the default-compatible path
for users who do not want a reference.

**FR-VC-010 — Formula/Process independence**

Formula-only records leave Process fields Unknown/not recorded according to the
existing Process contract. Process data never changes Formula composition
metrics merely because it was loaded, and Process-only changes remain owned by
the effective-behavior analysis.

### Calibration and evidence

**FR-VC-011 — Controlled source-backed first release**

The first Gold release is assembled from the acquisition child’s approved,
attributable source candidates. Offline extraction or manual capture may be
used, but every record preserves source, acquisition, normalization, and review
notes. Browser/runtime scraping is not an input path.

**FR-VC-012 — Release reproducibility**

A historical release can be resolved by ID and produces the same canonical
Formula/Process snapshot and record identity when the same model/data versions
are used.

**FR-VC-013 — Evidence separation**

Calibration, validation, and test evidence are distinguishable. A parameter
release records which data release, partition, weights, and model version were
used. Test evidence cannot be used silently as calibration input.

**FR-VC-014 — Staged maturity**

The capability supports the progression Expert Seed → Gold Calibrated → Broad
Calibrated → Experiment Validated → Stable. A model's maximum confidence is
bounded by maturity and evidence coverage.

**FR-VC-015 — Regression acceptance**

The evidence workflow can evaluate canonical parent-family recognition,
named-prototype behavior, absurd cross-family matches, smooth counterfactuals,
Formula/Process independence, functional ingredient equivalence, Unknown
handling, no-match/hybrid behavior, confidence sanity, and explanation
fidelity.

### Bilingual presentation

**FR-VC-016 — Locale parity**

Reference names, preparation labels, source/maturity/status explanations,
selection warnings, unavailable-release diagnostics, and accessibility copy
have equivalent English and Greek keys. Canonical IDs, masses, version IDs, and
model semantics remain language-neutral.

## Business rules and constraints

- A Reference Formula is a curated starting point, not a universal recipe
  recommendation.
- A Gold Dataset is evidence-bearing data; calibration produces a separate
  model-parameter release.
- Public reference visibility is explicit and cannot be inferred from a
  record's mere presence in the dataset.
- An accepted record must be traceable to a source and must pass normalization
  and ingredient-resolution checks.
- A missing value remains Unknown and is never substituted with numeric zero.
- A selected record is copied, not edited in place.
- A dirty draft must not be silently discarded.
- Formula and Process are loaded independently and remain independently
  analyzable.
- A new release is required for corrections; old release IDs remain stable.
- Gold calibration evidence receives stronger quality weight than broad/noisy
  evidence, while validation/test partitions remain held out.
- No heuristic score is presented as a probability or guaranteed physical
  outcome.
- Source acquisition does not bypass access controls or reuse restrictions and
  does not copy source prose into public project data.

## Success criteria

The capability is successful when:

1. The project has a broad preparation inventory with explicit category/family
   distinctions and a clear path for expanding it.
2. A user can start from Blank or find and select a curated reference without
   manually filling every Formula field.
3. The selected Formula and optional Process appear with clear provenance,
   release, and maturity context.
4. Editing water, eggs, flour, fat, or process values produces the existing
   explainable analysis without mutating the reference record.
5. A dirty-draft replacement is explicit and never merges two records.
6. A historical release is reproducible and an unavailable release does not
   silently fall back.
7. Calibration evidence can distinguish fitting from held-out validation/test
   and can report regression outcomes without false confidence.
8. English and Greek expose equivalent reference-selection and evidence
   semantics.

## Assumptions and deferred work

The first release assumes a repository maintainer/domain curator can approve
the inventory and source registry, run permitted offline/manual acquisition,
and review candidate records. The exact source inventory, record count,
licensing notes, static file layout, quality-weight values, and numerical
calibration algorithm are delivery details within this capability and its
acquisition child.

Broad datasets, controlled experiments, and serious calibration of outcome
diagnostics remain later phases. They do not block the first reference-release
and evidence contract.
