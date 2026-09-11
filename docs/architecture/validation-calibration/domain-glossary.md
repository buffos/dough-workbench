# Validation and Calibration — Domain Glossary

Status: canonical vocabulary for the first Gold Dataset release
Date: 2026-09-10

## Actors

| Canonical term | Category | Definition | Discouraged wording |
|---|---|---|---|
| Baker / Formula Explorer | actor | The person who analyzes a formula, starts from Blank or a reference, and explores changes. | End user, operator |
| Dataset Curator | actor | The maintainer or domain reviewer who prepares, checks, and accepts dataset records. | Data uploader |
| Coverage Curator | actor | The maintainer who defines the preparation inventory, hierarchy, aliases, and candidate structural-family mappings. | Taxonomy scraper |
| Source Curator | actor | The maintainer who evaluates source identity, attribution, quality, acquisition method, and reuse conditions. | Website copier |
| Calibration Evaluator | actor | The person or process that evaluates model parameters against separated evidence. | Trainer, classifier owner |

## Core business objects

| Canonical term | Category | Definition | Aliases / notes |
|---|---|---|---|
| Gold Dataset | business object | A versioned set of normalized, reviewed Formula records with source and quality evidence. Candidates may originate from approved offline acquisition. | `Gold Dataset`, όχι «τέλειες συνταγές» |
| Dataset Release | business object | An immutable named snapshot of a dataset, such as `gold-formulas-v2`. | Έκδοση dataset, έκδοση συνόλου δεδομένων |
| Reference Formula | business object | An accepted Formula snapshot that is approved as a user-selectable starting point. | UI Greek: **Φόρμουλα αναφοράς**. Explanatory alias: συνταγή αναφοράς. |
| Formula Snapshot | value object | The normalized Formula values captured at a point in a release. | It is copied into a local draft on selection. |
| Process Snapshot | value object | An optional normalized Process captured alongside a Formula Snapshot. | It remains separate from Formula. |
| Dataset Record | business object | A Formula Snapshot plus optional Process, preparation identity, roles, provenance, and acceptance metadata. | Record, not a live editable recipe. |
| Preparation | business object | The user-facing preparation/product concept to which one or more reference formulas belong. | Παρασκευή. It is not the same as structural family. |
| Primary Reference | status/role | The preferred quick-start record for a preparation in one release. | Κύρια φόρμουλα αναφοράς. It is not the only valid formula. |
| Local Draft | business object | The editable in-browser copy created from Blank or from a Reference Formula. | Τοπικό draft, never the dataset record. |

## Dataset roles and maturity

| Canonical term | Category | Definition |
|---|---|---|
| `reference` role | policy/role | The record may be offered as a user-facing starting point when `publicSelectable` is true. |
| `calibration` role | policy/role | The record may contribute to fitting or choosing model parameters. |
| `validation` partition | policy/role | Held-out evidence used to evaluate choices made during calibration. |
| `test` partition | policy/role | Final held-out evidence used to report performance without fitting against it. |
| Public reference subset | read model | The records from a release that are both accepted and explicitly selectable. | It is a filtered view of the same release, not a second dataset. |
| Expert seed | maturity | Initial domain-informed model or catalog knowledge before Gold evidence. | Not calibrated accuracy. |
| Gold calibrated | maturity | A model parameter release evaluated against the curated Gold Dataset. | Applies to the model release, not automatically to every recipe. |
| Broad calibrated | maturity | A model release that also accounts for broader variation after Gold calibration. | Still not a guarantee of baked outcome. |
| Experiment validated | maturity | A model release supported by controlled experiment evidence for the relevant behavior. | Higher evidence level, not universal certainty. |

## Workflow and policy terms

| Canonical term | Category | Definition | Important distinction |
|---|---|---|---|
| Curate | workflow | Inspect an approved source candidate, normalize it, resolve ingredients, and record evidence before release acceptance. | Not runtime scraping or automatic publication. |
| Coverage inventory | business object | The planned universe of preparations and categories to collect over time. | It may contain entries with no source-backed formula yet. |
| Navigation category | business object | A user-facing grouping such as breads, cakes, pizza, or pasta. | It is not a structural family. |
| Source record | business object | One source's version of a preparation before or after normalization. | Multiple source records may belong to one preparation. |
| Offline acquisition | workflow/policy | Maintainer-side source reading or extraction performed before static data is committed. | Never a browser runtime operation. |
| Accept | workflow/status | Mark a candidate as eligible for a release after the acceptance checklist passes. | Acceptance is not a claim of scientific perfection. |
| Publish release | workflow | Make an immutable dataset snapshot available to analysis consumers. | A new release replaces availability only by explicit version choice. |
| Select reference | workflow | Choose a public Reference Formula and create a local editable Formula/optional Process copy. | It does not merge or mutate the source. |
| Replace draft | workflow | Discard the current local Formula/Process draft and load a selected reference after confirmation when dirty. | Separate from counterfactual Reset. |
| Evaluation partition | policy | The mutually exclusive calibration/validation/test assignment used to prevent evidence leakage. | `reference` is a use role, not an evaluation partition. |
| Source provenance | reporting term | The source identity, quality, attribution, and transformation notes attached to a record. | Not a confidence score by itself. |
| Evidence | reporting term | The traceable reason a record or model parameter is accepted and how it was evaluated. | Stronger than an unqualified label. |

## Critical distinctions

### Reference Formula is not “the correct recipe”

A Reference Formula is a curated starting point and an evidence-bearing
snapshot. Multiple formulas can validly belong to the same preparation. Its
selection should save entry work, not imply that every baker must use its
quantities.

### Gold Dataset is not a calibrated model

The dataset contains formulas and evidence. Calibration produces a separate
versioned model-parameter release. A Gold record may be used as a reference and
as calibration evidence, but a user-facing label must not claim laboratory
accuracy.

### Dataset role is not evaluation partition

`reference` and `calibration` describe permitted use. `validation` and `test`
describe held-out evaluation. A record can be a public reference and a Gold
calibration example only when the release policy explicitly allows it; it must
never be reused as validation/test evidence for the same fitted parameters.

### Formula is not Process

Formula contains ingredients, masses, roles, and composition information.
Process contains mixing, fermentation, additions, lamination, thermal, and
geometry information. A reference may include either or both, but they are
loaded and analyzed as independent snapshots.

### Calibration is not prediction

Calibration adjusts or evaluates model interpretation against evidence. It
does not turn the frontend into a guaranteed predictor of loaf volume, proof
time, crumb, or final baked texture.

## Canonical English/Greek UI terms

| English | Greek |
|---|---|
| Reference formulas | Φόρμουλες αναφοράς |
| Start from | Ξεκίνα από |
| Blank formula | Κενή φόρμουλα |
| Select reference | Επιλογή φόρμουλας αναφοράς |
| Dataset release | Έκδοση συνόλου δεδομένων |
| Source and evidence | Πηγή και τεκμηρίωση |
| Primary reference | Κύρια φόρμουλα αναφοράς |
| Process included | Περιλαμβάνεται διαδικασία |
| Process not recorded | Η διαδικασία δεν έχει καταγραφεί |
| Replace current draft? | Να αντικατασταθεί το τρέχον draft; |
| This creates an editable copy | Δημιουργείται επεξεργάσιμο αντίγραφο |
| No silent fallback | Χωρίς σιωπηλή εναλλακτική |

## Open terminology decisions

No blocking terminology issue remains. The exact source names, dataset release
contents, and future maturity labels may expand without changing these core
distinctions.
