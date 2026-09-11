# Reference Dataset Acquisition and Curation — Canonical Use-Case Model

Status: canonical acquisition and curation intents
Date: 2026-09-10

## Purpose

Define the stable maintainer intents that turn a broad preparation inventory and
approved sources into traceable candidate records for the parent release
workflow.

## Application boundaries

### Coverage Planning service

Maintains the versioned preparation inventory, category hierarchy, aliases,
priorities, and structural-family mapping.

### Source Acquisition service

Maintains the source registry and runs approved offline/manual acquisition
against registered sources.

### Candidate Curation service

Normalizes source facts, resolves ingredients, preserves Unknown/Process
semantics, and prepares candidates for the parent release verifier.

These may be local scripts, build steps, or library functions in V1. They are
not browser endpoints and do not require a server.

## Canonical queries

### BrowseCoverageInventory

Input: inventory revision, locale, optional category, structural-family,
priority, or lifecycle-status filter.

Output: category hierarchy and preparation entries with aliases, candidate
family links, status, and coverage notes.

Rules: one primary category per preparation; no duplicate identity caused by a
localized alias; un sourced entries remain visible as planned gaps.

### InspectSourceRegistry

Input: registry revision and optional source/status/quality filter.

Output: source identity, attribution, quality assessment, acquisition status,
reuse note, access metadata, and limitations.

Rules: an unknown or blocked source cannot be selected for automatic
acquisition.

### InspectPilotCoverage

Input: inventory revision and candidate/release selection.

Output: counts by navigation category, structural family, preparation, source,
and lifecycle status, plus missing/blocked coverage.

Rules: the report does not alter inventory, candidate, or release data.

## Canonical commands

### DefineCoverageEntry

Input: preparation key, bilingual labels, primary category, aliases, candidate
family links, priority, and notes.

Output: a revised inventory entry or a specific duplicate/locale diagnostic.

Rules: stable keys are unique; changing a label does not change the key; moving
an entry between categories requires an explicit inventory revision.

### RegisterSource

Input: source identity, author/publisher, citation/URL, access metadata,
attribution, quality assessment, acquisition method, reuse status, and notes.

Output: a versioned SourceDefinition or a `source_review_required` diagnostic.

### AcquireCandidateFacts

Input: registered source, preparation key, approved acquisition method, scope,
and adapter/manual-capture version.

Output: AcquisitionRun with minimally captured SourceFacts and trace identity.

Failures: source not approved, method not permitted, source unavailable, or
extraction cannot preserve traceability.

### NormalizeCandidateRecord

Input: SourceFacts, preparation identity, catalog versions, optional Process
facts, and normalization policy.

Output: CandidateRecord in `normalized`, `needs-review`, or `rejected` state.

Rules: grams conversion and ingredient mapping are recorded; absent Process
remains Unknown; unresolved required ingredients do not become zero.

### ReviewCandidateRecord

Input: normalized CandidateRecord and reviewer decision.

Output: `accepted-for-release`, `returned-for-correction`, or `rejected` with
review evidence.

Rules: accepted-for-release means ready for the parent verifier only; it does
not publish a release or make the candidate public.

### PreparePilotCoverage

Input: accepted candidates, inventory revision, category selection, and target
sample size.

Output: PilotCoverageReport and a handoff set for parent release curation.

Rules: the pilot target is roughly 2–3 records per broad category, with
structural-family gaps reported explicitly.

## Consistency and replay

- Re-running an acquisition with the same source identity, input identity,
  method version, and scope produces the same facts or an explicit changed-input
  result.
- Normalizing the same facts with the same catalog versions produces equivalent
  canonical values and trace identity.
- Inventory revisions and candidate corrections are append-only from the point
  at which they are referenced by a published release.
- A source record may be re-reviewed without mutating a published parent
  release.

## Failure model

### Coverage failures

Duplicate preparation key, missing locale, invalid category parent, or family
mapping conflict blocks the inventory revision.

### Source failures

Unknown terms, blocked acquisition, unstable/unavailable source, missing
attribution, or untraceable extraction leaves the source/candidate in review or
rejected state.

### Normalization failures

Invalid mass, unjustified unit conversion, unresolved required ingredient,
missing Formula structure, or fabricated Process value blocks release
readiness.

### Review failures

An incomplete or contradictory candidate is returned or rejected with a reason;
it is not silently dropped or promoted.

## Canonical chains

### Coverage to pilot

```text
DefineCoverageEntry
  -> RegisterSource
  -> AcquireCandidateFacts
  -> NormalizeCandidateRecord
  -> ReviewCandidateRecord
  -> PreparePilotCoverage
  -> parent VerifyDatasetRelease / PublishDatasetRelease
```

### Incremental expansion

```text
planned inventory entry
  -> source identified
  -> candidate accepted or rejected
  -> next inventory/source record
  -> new parent release when published data changes
```

## Application events

The boundary may record `CoverageInventoryRevised`, `SourceRegistered`,
`CandidateFactsAcquired`, `CandidateNormalized`, `CandidateReviewed`, and
`PilotCoverageReported`. Payloads carry stable IDs, versions, and trace data,
not copied source prose.
