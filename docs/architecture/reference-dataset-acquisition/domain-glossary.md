# Reference Dataset Acquisition and Curation — Domain Glossary

Status: canonical vocabulary
Date: 2026-09-10

## Actors

| Canonical term | Category | Definition | Discouraged wording |
|---|---|---|---|
| Coverage Curator | actor | Maintainer who defines the preparation inventory, hierarchy, aliases, and analytical family candidates. | Taxonomy scraper |
| Source Curator | actor | Maintainer who evaluates sources, acquisition conditions, attribution, and source quality. | Website copier |
| Formula Curator | actor | Reviewer who normalizes a candidate source record and decides whether it is ready for release acceptance. | Data uploader |
| Acquisition Tool | external/process actor | An offline, repeatable tool that extracts or imports candidate facts under the source policy. | Runtime scraper |

## Core objects

| Canonical term | Category | Definition | Important distinction |
|---|---|---|---|
| Coverage Inventory | business object | The planned universe of preparations the project intends to represent. | It can contain entries with no source or formula yet. |
| Navigation Category | business object | A user-facing grouping such as breads, cakes, pizza, or pasta. | It is not an analytical structural family. |
| Structural Family | analytical object | A reusable analytical grouping such as lean yeasted dough, batter, laminated dough, or pasta dough. | It is not a browsing category or a recipe title. |
| Preparation | business object | A canonical named preparation to which variants and source records belong. | It is not one particular source's formula. |
| Preparation Alias | identity data | A language- or culture-specific name that points to the same preparation key. | Alias matching must not create duplicate preparations. |
| Source Registry | business object | The approved list of sources plus attribution, quality, acquisition, and reuse metadata. | It is not the dataset itself. |
| Source Record | business object | One source's representation of a preparation before or after normalization. | Multiple source records may belong to one preparation. |
| Candidate Record | lifecycle object | A source record normalized enough to enter human curation, but not yet accepted into a release. | Candidate is not public. |
| Normalization | workflow | Conversion of source facts into the canonical grams, ingredient, role, and Process contract. | It must retain transformation notes. |
| Offline acquisition | policy/workflow | Source reading or extraction performed by a maintainer/build tool before static data is committed. | Never a browser runtime operation. |
| Source authority | evidence term | A structured assessment of attribution, expertise/editorial control, reproducibility, detail, and stability. | Not a guarantee that the formula is universally correct. |
| Acquisition status | status | Whether a source may be used automatically, manually, or not at all under project policy. | It is separate from source quality. |
| Pilot coverage | report | The initial accepted-record sample used to test the complete data path and reveal category/family gaps. | It is not complete calibration evidence. |

## Lifecycle vocabulary

| Term | Definition |
|---|---|
| `planned` | Coverage entry exists in the inventory but has not been sourced. |
| `source-identified` | At least one candidate source is recorded for the preparation. |
| `acquired` | Source facts were captured under the approved acquisition method. |
| `normalized` | Formula/optional Process facts were converted to the canonical contract. |
| `needs-review` | A human decision or unresolved evidence gap remains. |
| `ready-for-release` | Candidate passes child-level curation and can be submitted to the parent release verifier. |
| `rejected` | Candidate cannot enter the planned release under current evidence. |

## Critical distinctions

### Source quality is not model confidence

Source quality describes evidence about the origin and transcription of a
record. Model confidence describes the support for an analysis result. Neither
turns a recipe into a guarantee.

### Acquisition is not publication

Acquisition creates traceable candidate facts. Validation and Calibration
acceptance and release publication are separate gates.

### Category is not structural family

“Pizza” may be a navigation category while its structural family may be lean
yeasted, sourdough, or enriched. The UI hierarchy and analytical mapping serve
different questions.

### Candidate is not Reference Formula

A candidate becomes a user-selectable Reference Formula only after acceptance,
release verification, explicit role/public selection, and publication.

## Canonical English/Greek presentation terms

| English | Greek |
|---|---|
| Coverage inventory | Κατάλογος κάλυψης |
| Navigation category | Κατηγορία περιήγησης |
| Structural family | Δομική οικογένεια |
| Preparation | Παρασκευή |
| Source record | Εγγραφή πηγής |
| Candidate formula | Υποψήφια φόρμουλα |
| Source and attribution | Πηγή και απόδοση |
| Offline acquisition | Offline συλλογή δεδομένων |
| Needs review | Χρειάζεται έλεγχο |
| Ready for release | Έτοιμο για έκδοση |

