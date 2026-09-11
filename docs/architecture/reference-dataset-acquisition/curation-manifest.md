# Pilot Curation Manifest v1

Candidate set: `pilot-v1`
Curation policy: `candidate-curation-v1`
Coverage inventory: `coverage-v2`

This manifest defines the handoff boundary from normalized candidates to the
parent Gold Dataset release. It does not approve or publish any candidate.

## Review lifecycle

Each candidate must retain its preparation, source, acquisition-run, Formula,
optional independent Process, bilingual metadata, SourceFacts, normalization
traces, and catalog versions. A curator can mark it:

- `accepted-for-release` when all evidence and Unknown checks pass;
- `returned-for-correction` with a bilingual reason;
- `rejected` with a bilingual reason.

Only accepted candidates with an explicit release plan enter the immutable
pilot handoff. Candidate review alone never makes a record public.

## Pilot target

The report targets 2–3 accepted candidates per broad navigation category when
an approved usable source path exists. It also reports categories without a
usable source path, missing inventory entries, blocked entries, unresolved
ingredient/Process gaps, structural-family representation, source coverage,
and exact accepted handoff IDs.

The pilot is a pipeline-validation sample, not complete inventory coverage and
not a calibrated-accuracy claim.

## Current status

The curation machinery and deterministic handoff tests are implemented. The
project owner has approved internal consumption of the registered sources, and
the offline/manual pilot is assembled with 22 candidate records: two per each
of the 11 broad navigation categories. Candidate-level
`accepted-for-release` reviews, bilingual reasons, and handoff identity
`handoff-ffbc6efc` are recorded for the pilot fixture.

This is not yet product/data approval and does not publish or expose a
candidate. The owner must approve the actual candidate batch, source
attribution, conversions, Unknown handling, category/family mapping, and gap
report before the parent release issue may consume the handoff.
