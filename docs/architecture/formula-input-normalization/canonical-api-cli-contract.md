# Formula Input and Normalization — Canonical API/CLI Contract

Status: Canonical external contract for downstream acceptance work
Version: v0.2
Date: 2026-09-07

This document defines the externally observable contract for the Formula Input
and Normalization capability. It starts with transport-neutral semantics and
then gives canonical HTTP and CLI mappings for future adapters.

The V1 product is a browser-only static frontend, so the HTTP and CLI mappings
are not deployment requirements. They are parity references that keep future
interfaces aligned with the same application behavior.

Sources:

- [canonical use cases](canonical-use-cases.md)
- [canonical domain model](canonical-domain-model.md)
- [node PRD](prd.md)
- [domain glossary](domain-glossary.md)

## Contract goals

The contract must:

- preserve the intent names and outcomes of the canonical use-case model;
- expose stable identifiers, statuses, value states, diagnostic codes, and
  retry semantics;
- make derived values distinguishable from supplied values;
- preserve Formula/Process separation and the paired analysis handoff;
- support Greek and English presentation without changing canonical payloads;
- allow local frontend execution now and HTTP/CLI adapters later; and
- make client and acceptance tests possible without exposing implementation
  classes, storage schema, or framework details.

## Transport-neutral conventions

### Identifiers

External identifiers are opaque strings. Their internal format is not part of
the contract.

Stable identifier fields include:

- `formulaId`
- `processId`
- `lineId`
- `flourComponentId`
- `ingredientId`
- `ingredientVersion`
- `commandId`
- `revision`
- `modelVersion`
- `catalogVersion`

`revision` is an opaque or monotonically comparable version token. Clients
must not calculate a revision by parsing its text.

### Timestamps

Timestamps, when exposed, are RFC3339 UTC strings. They are metadata and never
replace a revision or command identity.

### Quantities

V1 accepts mass only in grams. A mass is explicit rather than a bare number:

```json
{
  "value": 500.0,
  "unit": "g"
}
```

Mass values must be finite and positive for active Formula lines and
FlourComponents. Eggs and countable ingredients use this same mass shape. A
count or volume field is not accepted in V1.

Derived percentages use a decimal numeric value and an explicit semantic
class:

```json
{
  "value": 75.0,
  "unit": "%",
  "semanticClass": "calculated"
}
```

The contract does not require a specific decimal library. Implementations must
preserve deterministic results for the same input, model version, and numeric
tolerance policy. V1 uses `formula-normalization-v1`: a complete flour blend is
accepted when its normalized member percentages sum to `100.00% ± 0.01`
percentage points, inclusive. The policy identifier is included in normalized
result metadata.

### Value states

Every optional functional or process value uses a discriminated value-state
shape. The state is not inferred from JSON nullability.

Known value:

```json
{
  "state": "known",
  "value": 62.5,
  "provenance": {
    "kind": "catalog",
    "sourceId": "ingredient-source-1",
    "sourceVersion": "2026-01"
  },
  "confidence": 0.92
}
```

Explicit absence or non-applicability:

```json
{
  "state": "none"
}
```

Potentially applicable but not established:

```json
{
  "state": "unknown",
  "reasonCode": "not-supplied"
}
```

`Unknown` is never serialized as numeric zero. A known numeric zero is a
normal `known` state with `value: 0` where the field permits it.

### Coverage and confidence

Canonical coverage and confidence values are numeric in the inclusive range
`[0,1]`. Coverage describes how much of a requested metric/path is supported
by applicable inputs. Confidence describes evidence strength and model/data
support. Presentation bands such as `low`, `medium`, and `high` may be derived
for a locale but are not canonical contract values.

### Roles

The canonical role enum is:

```text
structural
continuous_phase
inclusion
surface_treatment
filling
topping
other
```

Role is metadata for participation policies, not a product classification.

### Semantic classes

Derived or interpreted values expose one of:

```text
calculated
estimated
heuristic
```

`calculated` means known arithmetic, `estimated` means an explicit assumption
was used, and `heuristic` means a model/rule score. None of these is a
probability unless a separate contract explicitly says so.

## Stable status vocabulary

### Command outcomes

```text
completed
partial
rejected
conflict
```

- `completed`: requested business operation completed with no material
  limitation.
- `partial`: operation completed but incomplete knowledge limits requested
  outputs.
- `rejected`: operation did not change the target state because a command or
  business rule failed.
- `conflict`: operation did not change the target state because the caller's
  revision or paired snapshot is stale/incompatible.

### Formula readiness

```text
editing
invalid
structurally_valid
normalized
partial_ready
analysis_ready
```

Readiness is path-dependent: one Formula can be `partial_ready` for a
process-dependent request while being `analysis_ready` for a composition-only
request.

### Process readiness

```text
editing
incomplete
process_ready
```

Known, None, and Unknown are values inside a Process readiness status, not
substitutes for the status.

### Diagnostic severity

```text
error
warning
info
```

An `error` may block the requested command. A warning can describe reduced
coverage or an accepted partial outcome.

## Common response envelopes

### Command response

```json
{
  "operationId": "op_01J...",
  "outcome": "completed",
  "data": {},
  "diagnostics": [],
  "revision": "rev_07",
  "events": [
    {
      "type": "FormulaNormalized",
      "aggregateId": "formula_123",
      "revision": "rev_07"
    }
  ]
}
```

`data` is the business result or updated snapshot. `diagnostics` is present
even when empty. `events` are conceptual application-boundary events and do
not expose translated UI copy.

### Query response

```json
{
  "data": {},
  "asOf": {
    "formulaRevision": "rev_07",
    "processRevision": "proc_rev_03",
    "catalogVersion": "catalog_2026_01",
    "modelVersion": "model_0_1"
  },
  "diagnostics": []
}
```

Queries may include `partial: true` when the requested view is valid but
incomplete. They must not hide unavailable fields by converting them to zero.

### Diagnostic shape

```json
{
  "code": "MISSING_STRUCTURAL_FLOUR",
  "severity": "error",
  "objectType": "formula",
  "objectId": "formula_123",
  "path": "flourSystem.components",
  "messageKey": "formula.validation.missingStructuralFlour",
  "parameters": {},
  "resolutionKey": "formula.validation.addPositiveFlour"
}
```

`messageKey` and `resolutionKey` are locale-neutral content keys. An English
or Greek adapter supplies the presentation copy. `code`, `path`, and
`parameters` remain stable across locales.

## Resource and snapshot shapes

These shapes describe the externally meaningful parts of a snapshot. They are
not persistence schemas.

### Ingredient reference

```json
{
  "kind": "catalog",
  "ingredientId": "wheat-flour-strong",
  "ingredientVersion": "2026-01"
}
```

or:

```json
{
  "kind": "custom",
  "customId": "custom_123"
}
```

A custom definition is local to the Formula line unless a separate catalog
workflow promotes it.

### FlourSystem input and output

Input fields are authoritative masses and ingredient references:

```json
{
  "components": [
    {
      "flourComponentId": "flour_component_1",
      "ingredient": {
        "kind": "catalog",
        "ingredientId": "wheat-flour-strong",
        "ingredientVersion": "2026-01"
      },
      "mass": {
        "value": 800.0,
        "unit": "g"
      }
    }
  ]
}
```

Normalized output adds derived values:

```json
{
  "components": [
    {
      "flourComponentId": "flour_component_1",
      "mass": {
        "value": 800.0,
        "unit": "g"
      },
      "blendFraction": {
        "value": 100.0,
        "unit": "%",
        "semanticClass": "calculated"
      }
    }
  ],
  "structuralFlourDenominator": {
    "value": 800.0,
    "unit": "g",
    "semanticClass": "calculated"
  },
  "normalizationPolicy": "formula-normalization-v1"
}
```

The denominator includes only positive-mass flour-bearing structural
components. It is never accepted as a client-authoritative replacement for
component masses.

### IngredientLine snapshot

```json
{
  "lineId": "line_123",
  "ingredient": {
    "kind": "catalog",
    "ingredientId": "water",
    "ingredientVersion": "2026-01"
  },
  "mass": {
    "value": 560.0,
    "unit": "g"
  },
  "role": "continuous_phase",
  "compositionOverride": null,
  "availabilityOverride": null,
  "provenance": {
    "kind": "user-entered"
  },
  "confidence": 0.92,
  "bakersPercentage": {
    "value": 70.0,
    "unit": "%",
    "semanticClass": "calculated"
  }
}
```

`compositionOverride` and `availabilityOverride` are local to this line.
Optional functional fields use the ValueState shape and may remain unknown.

### Formula snapshot

```json
{
  "formulaId": "formula_123",
  "revision": "rev_07",
  "readiness": "normalized",
  "flourSystem": {},
  "ingredientLines": [],
  "processRef": {
    "processId": "process_123",
    "revision": "proc_rev_03"
  },
  "diagnostics": [],
  "catalogVersion": "catalog_2026_01",
  "modelVersion": "model_0_1"
}
```

### Process snapshot

```json
{
  "processId": "process_123",
  "formulaId": "formula_123",
  "revision": "proc_rev_03",
  "readiness": "incomplete",
  "mixing": {
    "method": {
      "state": "known",
      "value": "minimal_combine"
    },
    "intensity": {
      "state": "unknown",
      "reasonCode": "not-supplied"
    },
    "durationSeconds": {
      "state": "known",
      "value": 180
    }
  },
  "ingredientAddition": {
    "steps": [],
    "fatIncorporationMode": {
      "state": "none"
    }
  },
  "fermentation": {
    "agent": {
      "state": "none"
    },
    "bulkTimeSeconds": {
      "state": "unknown",
      "reasonCode": "not-supplied"
    }
  },
  "diagnostics": []
}
```

The V1 sections and field paths are `mixing`, `ingredientAddition`,
`aeration`, `fermentation`, `lamination`, `thermalProcess`, and `geometry`.
Durations use seconds, temperatures use degrees Celsius, normalized intensity/
level values use `[0,1]`, and enum IDs are the canonical lower-case values in
the `process-input-v0.2` vocabulary. Categorical fields do not accept
arbitrary text. `lamination.laminationFat` is a Formula-line reference and
AdditionStep `action` uses its controlled action vocabulary. Each section uses
the tri-state value shape for optional fields.

### Analysis input snapshot

```json
{
  "formula": {},
  "process": {},
  "readiness": "partial_ready",
  "coverage": {
    "composition": 0.92,
    "process": 0.35
  },
  "confidence": {
    "composition": 0.78,
    "process": 0.31
  },
  "limitations": [
    {
      "code": "PROCESS_DATA_INCOMPLETE",
      "path": "process.fermentation"
    }
  ],
  "catalogVersion": "catalog_2026_01",
  "modelVersion": "model_0_1"
}
```

Coverage and confidence are not similarity or probability. Their exact scoring
policy belongs to downstream analysis/trust artifacts.

## Error model

Errors are returned as structured diagnostics and, where the operation cannot
complete, as an error envelope:

```json
{
  "operationId": "op_01J...",
  "outcome": "rejected",
  "error": {
    "code": "INVALID_MASS",
    "category": "business_rule",
    "messageKey": "formula.validation.invalidMass",
    "objectType": "ingredient_line",
    "objectId": "line_123",
    "path": "ingredientLines[0].mass",
    "parameters": {
      "unit": "g"
    },
    "retryable": false
  },
  "diagnostics": []
}
```

### Canonical error codes

| Code | Category | Meaning | Retryable |
|---|---|---|---|
| `INVALID_COMMAND` | `invalid_command` | Command envelope or payload is malformed | No |
| `UNSUPPORTED_UNIT` | `business_rule` | V1 received count/volume instead of grams | No |
| `INVALID_MASS` | `business_rule` | Mass is missing, non-finite, zero, or negative | No |
| `INVALID_ROLE` | `business_rule` | Role is not canonical | No |
| `MISSING_STRUCTURAL_FLOUR` | `business_rule` | Formula has no positive-mass flour-bearing structural component | No |
| `INVALID_BLEND` | `business_rule` | Flour blend fractions are contradictory or outside the inclusive `formula-normalization-v1` range | No |
| `INVALID_VALUE_STATE` | `business_rule` | Known/None/Unknown shape is inconsistent | No |
| `RESOURCE_NOT_FOUND` | `not_found` | Formula, Process, line, component, or catalog version is absent | No; a recoverable source failure uses `CATALOG_UNAVAILABLE` |
| `STALE_REVISION` | `conflict` | Expected revision does not match current state | No; refresh and retry intentionally |
| `REFERENCE_MISMATCH` | `conflict` | Process/Formula line references cannot form a coherent pair | No until corrected |
| `CATALOG_VERSION_MISMATCH` | `conflict` | Requested catalog/model snapshot is not available for the Formula | No until version is selected |
| `NORMALIZATION_BLOCKED` | `business_rule` | Requested normalization is blocked by one or more diagnostics | No |
| `CATALOG_UNAVAILABLE` | `source_unavailable` | Required supporting catalog source cannot be read | Yes if source may recover |
| `INFRASTRUCTURE_FAILURE` | `infrastructure` | Adapter/runtime failure outside domain rules | Maybe; adapter decides |

Incomplete accepted knowledge is not an error code. It is represented by
`outcome: partial`, readiness, limitations, coverage, and confidence.

## Idempotency contract

All commands may carry `commandId`. For commands that create or append a
resource, the same command identity must not create a duplicate. Expected
revision can be supplied to prevent silent stale overwrites.

| Command | Canonical replay behavior |
|---|---|
| `StartFormulaDraft` | Same command identity/formula identity returns the existing draft outcome |
| `AddFlourComponentToFormula` | Stable component or command identity updates/replays the intended component, not an accidental duplicate |
| `AddIngredientLineToFormula` | Stable line or command identity prevents duplicate line creation |
| `AdjustIngredientLineInFormula` | Same target/payload/revision is safe to replay; stale revision returns `STALE_REVISION` |
| `ApplyLocalCompositionOverride` | Same target/payload/revision is safe to replay |
| `ApplyLocalAvailabilityOverride` | Same target/payload/revision is safe to replay |
| `RecordProcessForFormula` | Same Process revision/command does not duplicate AdditionSteps |
| `NormalizeFormula` | Same Formula/catalog/model revision yields the same normalized outcome |
| `PrepareAnalysisInput` | Same Formula/Process/model revision pair yields the same handoff |

V1 local execution may use command identities only within the active browser
session. A future HTTP adapter maps `commandId` to an idempotency mechanism;
the business semantics do not change.

## Canonical HTTP mapping (future adapter)

The following mapping is illustrative and transport-facing. It is subordinate
to the transport-neutral contract and does not require a backend in V1.

| Use case | Method and path | Notes |
|---|---|---|
| `StartFormulaDraft` | `POST /formulas` | `Idempotency-Key` maps to `commandId` |
| `AddFlourComponentToFormula` | `POST /formulas/{formulaId}/flour-components` | Stable component/command identity |
| `AddIngredientLineToFormula` | `POST /formulas/{formulaId}/ingredient-lines` | Grams-only input |
| `AdjustIngredientLineInFormula` | `PATCH /formulas/{formulaId}/ingredient-lines/{lineId}` | Expected revision required for shared adapters |
| `ApplyLocalCompositionOverride` | `POST /formulas/{formulaId}/ingredient-lines/{lineId}/composition-override` | Local only |
| `ApplyLocalAvailabilityOverride` | `POST /formulas/{formulaId}/ingredient-lines/{lineId}/availability-override` | Local only |
| `RecordProcessForFormula` | `PUT /formulas/{formulaId}/process` | Replaces/updates addressed Process revision |
| `ValidateFormulaForNormalization` | `POST /formulas/{formulaId}/validate` | Diagnostic command/read result |
| `NormalizeFormula` | `POST /formulas/{formulaId}/normalize` | Returns completed/partial/rejected outcome |
| `PrepareAnalysisInput` | `POST /formulas/{formulaId}/analysis-input` | Coordinated Formula/Process snapshot |
| `GetFormulaDraft` | `GET /formulas/{formulaId}` | Query |
| `GetFormulaReadiness` | `GET /formulas/{formulaId}/readiness` | Query; optional `analysisPath` |
| `GetNormalizationExplanation` | `GET /formulas/{formulaId}/normalization-explanation` | Query |
| `GetProcessTimeline` | `GET /formulas/{formulaId}/process` | Query |
| `GetAnalysisHandoffSummary` | `GET /formulas/{formulaId}/analysis-input` | Query |
| `GetIngredientDefinitions` | `GET /ingredients` | Versioned catalog query |
| `GetIngredientDefinitionDetails` | `GET /ingredients/{ingredientId}` | Version supplied as query or path metadata |
| `PreviewBakerPercentages` | `POST /formulas/{formulaId}/baker-percentages/preview` | Read-only calculation |

### HTTP status guidance

| Contract outcome/category | Suggested HTTP status |
|---|---:|
| Completed or partial synchronous result | `200` |
| New Formula created | `201` |
| Invalid command | `400` |
| Resource not found | `404` |
| Business rule violation | `422` |
| Revision/reference conflict | `409` |
| Source unavailable | `503` |
| Infrastructure failure | `500` |

The response body remains the canonical envelope; clients must not infer
business meaning from HTTP status alone.

## Canonical CLI mapping (future adapter)

The CLI uses the same business names and returns the same `data`/diagnostic
shapes. `--output json` is the machine-readable form; human output may be
localized.

```text
dough formula start
dough formula add-flour <formulaId>
dough formula add-line <formulaId>
dough formula adjust-line <formulaId> <lineId>
dough formula override-composition <formulaId> <lineId>
dough formula override-availability <formulaId> <lineId>
dough formula record-process <formulaId>
dough formula validate <formulaId>
dough formula normalize <formulaId>
dough formula prepare-analysis-input <formulaId>
dough formula show <formulaId>
dough formula readiness <formulaId>
dough formula explain-normalization <formulaId>
dough formula preview-baker-percentages <formulaId>
dough process show <processId>
dough ingredient list
dough ingredient show <ingredientId>
```

Retry-sensitive commands support:

```text
--command-id <opaque-id>
--expected-revision <opaque-revision>
--catalog-version <version>
--model-version <version>
--output json
--locale en|el
```

CLI exit guidance mirrors categories rather than inventing new business
semantics: `0` for completed/partial, `2` for invalid command, `3` for not
found, `4` for business rule, `5` for conflict, `6` for source unavailable,
and `10` for infrastructure failure.

## HTTP/CLI and locale parity rules

Every adapter must preserve:

1. the same use-case names and business meaning;
2. the same canonical IDs, revision behavior, statuses, value states, and
   diagnostic codes;
3. the same distinction between rejected invalid input and accepted partial
   input;
4. the same Formula/Process separation and paired snapshot requirements;
5. the same idempotency and stale-revision semantics; and
6. the same calculated/estimated/heuristic classification of derived values.

Adapters may vary in:

- route spelling, flag spelling, and envelope transport syntax;
- human-readable English/Greek copy;
- table/JSON formatting and visual layout; and
- whether an operation is presented synchronously when the underlying
  implementation can prove the same business outcome.

Changing locale must not change canonical IDs, values, diagnostics, or
readiness. `/en/` and `/el/` are presentation routes, not separate domains.

## Minimum first-slice contract

The first interactive frontend slice must support these local application
operations before any HTTP/CLI adapter is considered:

1. `StartFormulaDraft`;
2. `AddFlourComponentToFormula`;
3. `AddIngredientLineToFormula`;
4. `AdjustIngredientLineInFormula`;
5. `ValidateFormulaForNormalization`;
6. `NormalizeFormula`;
7. `GetFormulaDraft`;
8. `GetFormulaReadiness`;
9. `GetNormalizationExplanation`;
10. `RecordProcessForFormula` with ordered steps and tri-state values; and
11. `PrepareAnalysisInput` with complete/partial outcomes.

Local composition and availability overrides must be represented in the same
payload shapes even if the first UI exposes only the most common fields.

## Suggested contract tests

Implementations should be able to assert:

- two positive structural flours produce the sum denominator and deterministic
  BakerPercentages;
- no positive structural flour returns `MISSING_STRUCTURAL_FLOUR` and no
  normalized data;
- invalid masses return `INVALID_MASS` while valid sibling input remains;
- Unknown functional fields remain `unknown`, not zero;
- role metadata survives normalization and does not become classification;
- local overrides do not mutate catalog or sibling line snapshots;
- grams-only input rejects count/volume without conversion;
- Process Known/None/Unknown values survive the contract unchanged;
- incomplete Process returns a partial analysis-input outcome rather than
  blocking composition-only preparation;
- replayed command IDs do not duplicate lines, components, or steps;
- stale revisions return `STALE_REVISION` without silent overwrite; and
- English and Greek adapters produce equivalent canonical payloads and error
  codes.

## Quality gate assessment

- Semantic quality: passed; contract names and outcomes follow the canonical
  use cases and domain model.
- Transport quality: passed; neutral shapes precede illustrative HTTP/CLI
  mappings, with explicit IDs, statuses, quantities, and diagnostics.
- Retry/failure quality: passed; idempotency, conflicts, business errors, and
  accepted partial outcomes are distinct.
- Neutrality quality: passed; no framework, package, or persistence details are
  exposed.
- Downstream usefulness: passed; client, HTTP, CLI, bilingual, and acceptance
  tests can target the same stable surface.
