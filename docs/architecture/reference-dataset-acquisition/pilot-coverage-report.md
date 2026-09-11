# Pilot Coverage Report — `pilot-v1`

Candidate set: `pilot-v1`  
Coverage inventory: `coverage-v2`  
Policy: `candidate-curation-v1`  
Acquisition: `pilot-manual-capture-v1` / `manual-only`  
Status: assembled; pending product/data approval

## Coverage result

The deterministic pilot fixture in `src/data/reference/pilot.ts` contains 22
candidate records. Each candidate has a manual acquisition run, source facts,
normalized Formula data, an optional independent Process snapshot, bilingual
metadata, traces, and a candidate-level `accepted-for-release` review.

| Measure | Result |
| --- | ---: |
| Accepted candidate records in the pilot handoff | 22 |
| Broad navigation categories | 11 |
| Categories at the 2-record minimum | 11 / 11 |
| Blocked entries | 0 |
| Unresolved category gaps | 0 |
| Inventory entries not represented by this pilot | 132 / 154 |
| Published release records | 0 |

Every broad category has exactly two pilot candidates, so the 2–3 target is
met for the sample:

| Category | Accepted candidates |
| --- | ---: |
| Yeasted breads | 2 |
| Naturally leavened breads | 2 |
| Enriched and sweet yeast doughs | 2 |
| Laminated and viennoiserie doughs | 2 |
| Pizza and flatbreads | 2 |
| Pasta, noodle and wrapper doughs | 2 |
| Pastry, pie, tart and cracker doughs | 2 |
| Cakes and quick breads | 2 |
| Pancakes, crêpes and waffles | 2 |
| Fried doughs and batters | 2 |
| Gluten-free and alternative doughs | 2 |

## Source coverage

| Source ID | Pilot candidates |
| --- | ---: |
| `source.king-arthur-baking` | 11 |
| `source.the-perfect-loaf` | 3 |
| `source.serious-eats` | 2 |
| `source.giallozafferano` | 2 |
| `source.bbc-good-food` | 4 |

The pilot represents 19 structural families. The remaining family IDs are
retained in the machine-readable `unrepresentedFamilies` report field and are
planned gaps, not inferred equivalences. Category, preparation, source, and
structural-family identity remain separate.

## What the pilot proves

- The approved internal source boundary can produce reproducible manual
  acquisition runs without browser scraping or runtime network access.
- Kilograms, millilitres, and counted ingredients are converted to grams only
  when the capture records the conversion basis.
- Explicitly incomplete composition remains Unknown; no missing composition is
  silently converted to zero.
- Optional Process facts remain independent from Formula facts. Missing
  Process fields remain not recorded/Unknown rather than inferred.
- Candidate-level review and handoff identity are deterministic and immutable
  at the data-contract boundary.

## Limitations and approval boundary

This is a pipeline-validation sample, not complete inventory coverage, full
calibration evidence, or a claim that the model's estimates are accurate. The
five sources are approved only for the internal tool's maintainer-controlled
manual capture. The data path stores normalized facts, citations, and traces;
it does not copy source prose or images and does not grant public
republication rights.

The handoff `handoff-ffbc6efc` is ready for the project owner's product/data
approval. Until that approval is recorded in Issue 044, the handoff is not
consumed by `gold-formulas-v2`, the release registry remains empty, and no
candidate is selectable in the browser.
