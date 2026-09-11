# Offline Source Acquisition Policy v1

Policy revision: `sources-v1`
Applies to coverage revision: `coverage-v2`

## Boundary

Source material is used only to create attributable, normalized candidate
facts in a maintainer-controlled offline workflow. The GitHub Pages browser is
a consumer of published static snapshots; it is never a source collector.

The following are prohibited:

- runtime HTTP scraping from the frontend;
- unattended crawling or bulk extraction;
- bypassing access controls, paywalls, terms, or robots restrictions;
- copying source prose, instructions, images, or page layout into public
  static data;
- treating a publisher's authority as proof of formula correctness or release
  eligibility.

## Status vocabulary

| Status | Meaning | Can acquisition run? |
|---|---|---|
| `allowed-offline` | The permitted offline method and reuse boundary are approved. | Yes, with `normalized-facts-only`. |
| `manual-only` | A maintainer may capture facts manually under the recorded conditions. | Yes, manually, with `normalized-facts-only`. |
| `manual-review` | Attribution, terms, authority, or reuse still needs an explicit decision. | No. |
| `blocked` | The source or method must not be used. | No. |
| `unknown` | The conditions are not known well enough to proceed. | No. |

Acquisition also requires `reuseStatus: normalized-facts-only`. Values such as
`review-required`, `restricted`, or `unknown` are rejected even when a source
has a high quality tier.

## Permitted candidate boundary after approval

An approved capture may retain:

- ingredient names and masses as source facts;
- justified conversions to grams;
- explicitly captured functional-composition facts or a versioned catalog
  mapping;
- independently captured Process facts, including an explicit absence of
  Process information;
- source locator, source ID, access date, acquisition run identity, and
  attribution/citation metadata;
- normalization and Unknown traces.

An approved capture may not retain copied explanatory prose. Every normalized
field must point to a SourceFact or an explicit derived/Unknown trace. An
unjustified unit or unresolved required ingredient blocks the candidate.

## Current decision record

The project owner has approved internal consumption of the five entries in
`src/data/reference/sources.ts`. They are therefore `manual-only` /
`normalized-facts-only`. This approval is scoped to the internal tool and does
not mean that the source content may be republished publicly.

The review found at least two explicit restrictions: King Arthur Baking's
official terms require permission for reproduction or publication of its
content, and The Perfect Loaf's official policy restricts AI/ML use without
written authorization. The owner has separately confirmed permission for this
project's internal consumption. The implementation still keeps the capture
manual/offline, stores only normalized facts and citations, and does not expose
source prose or claim public reuse permission.
