# Recipe Source Registry v1

Status: approved for internal use; every source is `manual-only`
Revision: `sources-v1`
Coverage revision: `coverage-v2`
Access review date: 2026-09-10

This registry is a shortlist of possible source publishers for the reference
dataset. It is not an evidence dataset and it does not grant permission to
copy, scrape, or republish recipe material. The machine-readable version is
`src/data/reference/sources.ts`.

## Proposed sources

| Source ID | Publisher | Canonical entry point | Quality tier | Expected use | Acquisition/reuse status |
|---|---|---|---|---|---|
| `source.king-arthur-baking` | King Arthur Baking Company | [Recipe library](https://www.kingarthurbaking.com/recipes) | High | Bread, enriched dough, pizza, cakes, pancakes | `manual-only` / `normalized-facts-only` |
| `source.the-perfect-loaf` | The Perfect Loaf / Maurizio Leo | [Recipe archive](https://www.theperfectloaf.com/recipes/) | High | Naturally leavened bread, sourdough pizza, enriched sourdough | `manual-only` / `normalized-facts-only` |
| `source.serious-eats` | Serious Eats | [Recipe archive](https://www.seriouseats.com/) | Medium | Pizza, pasta, pastry, cakes, fried preparations | `manual-only` / `normalized-facts-only` |
| `source.giallozafferano` | GialloZafferano | [English recipe site](https://www.giallozafferano.com/) | Medium | Pasta, pizza, pastry, regional doughs | `manual-only` / `normalized-facts-only` |
| `source.bbc-good-food` | BBC Good Food | [Recipe archive](https://www.bbcgoodfood.com/recipes) | Medium | Cakes, pancakes, fried preparations, pastry | `manual-only` / `normalized-facts-only` |

## Terms/reuse checks

The following official publisher material was checked on 2026-09-10 as part of
the source review. These checks do not constitute public-reuse permission:

- [King Arthur Baking Terms of Use](https://www.kingarthurbaking.com/policies/terms-of-use)
  state that reproduction, modification, derivative works, publication,
  distribution, or other exploitation of site content requires permission.
  This source therefore remains restricted for any public dataset use, while
  the project owner's internal-use approval permits manual capture here.
- [The Perfect Loaf privacy policy](https://www.theperfectloaf.com/privacy-policy/)
  contains an explicit restriction concerning use of site content for AI or
  machine-learning purposes without written authorization. It remains
  restricted for public/AI reuse, while the project owner's internal-use
  approval permits manual capture here.
- No public-reuse permission is assumed for Serious Eats, GialloZafferano, or
  BBC Good Food. The project owner's internal-use approval permits the same
  manual-only capture boundary for this internal tool; their entries are not
  public publication permissions.

The quality tier is an authority/coverage assessment for selecting candidates;
it is not a claim that an individual formula is correct, reproducible, or
permitted for reuse. The exact preparation keys and expected categories are
recorded in the TypeScript registry and remain expectations until a source
record is captured and reviewed.

## What is recorded per source

Every entry records the source ID, publisher, citation/URL, access date,
authority assessment, attribution wording, expected category and preparation
coverage, limitations, acquisition method, acquisition status, and reuse
status. Source-level authority remains separate from formula correctness,
structural-family fit, model confidence, and public-release eligibility.

## Approval boundary

The project owner has approved internal consumption of this source set. The
registry therefore permits maintainer-controlled `manual-only` capture with
`normalized-facts-only` reuse. This approval is scoped to the internal tool and
does not grant public republication rights. The browser-safe reference release
must remain internal to the deployment boundary.

The registry deliberately contains no copied recipe prose, quantities, Process
values, or public-release records. Exact source-backed candidate facts are
captured in the private maintainer data path, not fetched by the browser.
