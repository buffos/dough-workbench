# Reference Dataset Acquisition and Curation — Product Requirements

Status: implementation-ready V1 capability specification
Date: 2026-09-10

## Purpose

Give the project a deliberate coverage plan and a traceable way to collect
candidate dough and batter formulas without confusing a source recipe, a
canonical preparation, an analytical family, or a published reference record.

## Product summary

The capability maintains a broad preparation inventory covering breads, cakes,
batters, pancakes, crepes, waffles, pizza, flatbreads, pasta, noodles,
pastries, fried doughs, and alternative/gluten-free preparations. It organizes
that inventory into a user-facing category hierarchy while preserving separate
structural-family mappings for analysis.

It also maintains a source registry and an offline acquisition/normalization
path. Approved source facts become traceable candidate records; they do not
become public references until the parent Validation and Calibration release
verifier and acceptance process approve them.

## Actors

### Coverage Curator

Defines the preparation inventory, hierarchy, aliases, priorities, and
candidate structural-family mapping.

### Source Curator

Evaluates possible sources, attribution, measurement quality, acquisition
method, reuse conditions, stability, and whether a source may be read by an
automated adapter or only transcribed manually.

### Formula Curator

Normalizes candidate facts to grams and the existing Formula/Process contract,
resolves ingredients, records Unknown values and transformations, and submits
the candidate for release acceptance.

### Dataset Release Owner

Uses the parent capability's verifier and publication policy to accept records
into an immutable release.

## Goals

1. Make the intended recipe/preparation coverage explicit before collection.
2. Keep navigation categories, structural families, preparations, and source
   records distinct.
3. Make source attribution and acquisition conditions inspectable.
4. Support permitted offline extraction without runtime scraping or backend
   dependence.
5. Normalize candidate formulas consistently while preserving uncertainty.
6. Test the complete path with a small but structurally meaningful pilot before
   expanding the inventory one record at a time.

## Non-goals

This capability does not provide:

- scraping from the browser or unattended crawling of the open internet;
- bypassing robots rules, access controls, paywalls, or source terms;
- republishing source prose, images, or presentation as project content;
- a claim that a popular source is universally authoritative or correct;
- automatic publication of an acquired candidate;
- user uploads, browser-side dataset editing, or a backend ingestion service;
- full calibration from the pilot alone;
- a fixed promise that every planned inventory row has a source immediately;
- a second public recipe dataset separate from the immutable Gold release.

## Domain scope

The capability includes:

- preparation coverage inventory and hierarchy;
- preparation keys, aliases, priorities, and candidate family mappings;
- source registry and quality/acquisition/reuse metadata;
- offline source import or source-specific extraction manifests;
- raw-fact to normalized-candidate traceability;
- grams conversion and transformation notes;
- ingredient catalog/functional-composition resolution;
- Process capture only when the source documents it;
- candidate review, rejection, readiness, and pilot coverage reports.

## User-facing and maintainer workflows

### Define coverage

The curator reviews the inventory, places each preparation in one primary
navigation category, records aliases and candidate structural family links, and
assigns a priority/status. The inventory may be larger than the first release.

### Register a source

The source curator records identity, attribution, author/editorial context,
quality assessment, URL or bibliographic reference, access date, acquisition
method, reuse conditions, and known limitations. Unclear sources remain
`manual-review` or `blocked`.

### Acquire candidate facts

An approved offline adapter or manual transcription captures only the facts
needed for a Formula/optional Process candidate and records the source,
acquisition run, parser/manual method, and raw-to-normalized traceability.

### Normalize and resolve

The formula curator converts quantities to grams when justified, maps named
ingredients to the versioned ingredient catalog or an explicit functional
composition snapshot, records roles and Unknown values, and does not invent
silent Process values.

### Review candidate

The formula curator and release owner inspect provenance, transformations,
ingredient resolution, identity mapping, bilingual labels, and missing data.
The result is accepted for release handoff, returned for correction, or
rejected with a reason.

### Run the pilot

The team selects approximately 2–3 accepted candidates per broad navigation
category, checks structural-family coverage, and reports gaps. The pilot is a
pipeline validation sample, not proof that every category or model behavior is
calibrated.

### Expand incrementally

Additional preparations and source variants move through the same path. A
correction or accepted addition enters a new immutable parent release rather
than rewriting a published record.

## Functional requirements

### ACQ-FR-001 — Stable coverage inventory

Every planned preparation has a stable key, localized label, primary category,
candidate family mapping, priority, lifecycle status, and notes/aliases.

### ACQ-FR-002 — Separate classification axes

The system preserves the distinction between navigation category, structural
family, preparation identity, and source record. A change in one axis does not
silently rename or duplicate another.

### ACQ-FR-003 — Source registry

Every acquired candidate points to a registered source with attribution,
quality, access/acquisition method, reuse status, and access date or equivalent
bibliographic identity.

### ACQ-FR-004 — Controlled offline acquisition

Acquisition runs outside the browser and record the tool/manual method,
source-specific scope, timestamp, and input identity. No runtime network
fetching is required by the GitHub Pages application.

### ACQ-FR-005 — Raw-to-normalized traceability

Each normalized field can be traced to a source fact or is explicitly marked
Unknown/derived with its transformation method and reviewer note.

### ACQ-FR-006 — Canonical normalization

Formula quantities are normalized to grams where justified. Ingredient lines
resolve to catalog definitions or explicit functional-composition snapshots;
unresolved names and missing information remain visible and block acceptance
when required.

### ACQ-FR-007 — Process honesty

Process fields are captured only when supported by source evidence. Silence in a
source produces Unknown/not recorded, not a default mixing, temperature, or
fermentation value.

### ACQ-FR-008 — Candidate lifecycle

Candidates move through planned/source-identified/acquired/normalized/
needs-review/ready-for-release or rejected states with reasons and reviewer
identity/role.

### ACQ-FR-009 — Pilot coverage

The pilot can select 2–3 accepted candidates per broad category, detect missing
categories/families, and produce a gap report without changing the inventory or
source records.

### ACQ-FR-010 — Publication boundary

Only the parent release acceptance and publication workflow can expose a
candidate as a public Reference Formula or calibration record.

## Business rules and constraints

- One preparation has one primary navigation category in the inventory, with
  cross-tags or aliases recorded separately.
- A preparation may have many source records and accepted variants.
- A source's quality, acquisition permission, and reuse status are separate
  values.
- A source with unclear terms is not automatically acquired.
- Source facts are not copied as prose into the public application.
- Grams conversion must be reproducible; unjustified conversion leaves a value
  Unknown or blocks acceptance.
- Unknown is never zero.
- Named ingredients resolve through the existing functional-composition
  boundary; the acquisition layer does not create arbitrary compositions.
- The first pilot is deliberately small relative to the inventory and must
  expose its coverage limitations.
- Published releases remain immutable; candidate correction happens before
  publication or in a new release.

## Success criteria

1. The project has a stable, bilingual inventory large enough to guide future
   collection without flattening its hierarchy.
2. Each pilot candidate can be traced from source to normalized Formula/optional
   Process fields.
3. The pilot produces explicit category and structural-family coverage gaps.
4. No browser runtime scraping, copied source prose, silent fallback, invented
   Process values, or Unknown-to-zero conversion is needed.
5. The parent release verifier can consume the candidate handoff without
   reinterpreting the acquisition semantics.

## Assumptions and deferred work

The initial inventory in `coverage-inventory.md` is a proposed broad baseline;
the exact source list, source terms, and pilot record selection are delivery
decisions requiring review. The project may add source-specific adapters later,
but every adapter must preserve the same provenance and normalization contract.
Controlled experiments, broader datasets, and numerical calibration remain
parent-capability maturity work.
