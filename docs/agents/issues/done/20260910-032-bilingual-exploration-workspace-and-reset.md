# Issue 032 — Bilingual exploration workspace and reset

## Issue Metadata

- ID: 032
- Title: Bilingual exploration workspace and reset
- Category: feature
- State: done
- Owning capability: Interactive Formula Exploration
- Owning capability node: .okf/capabilities/interactive-exploration.md
- Artifact root: docs/architecture/interactive-exploration
- Delivery order: 5 of 5
- Execution type: AFK
- Review gate: visual-review
- Review mode: grouped review after issues 028–032 are implemented

## Parent Artifacts

- docs/architecture/interactive-exploration/prd.md
- docs/architecture/interactive-exploration/domain-glossary.md
- docs/architecture/interactive-exploration/canonical-domain-model.md
- docs/architecture/interactive-exploration/canonical-use-cases.md
- docs/architecture/interactive-exploration/canonical-api-cli-contract.md
- docs/architecture/interactive-exploration/acceptance-scenarios.md
- docs/architecture/interactive-exploration/readiness-review.md
- .okf/capabilities/interactive-exploration.md
- .okf/capabilities/shared/bilingual-content.md
- .okf/capabilities/shared/trust-and-provenance.md
- .okf/project.md

## What to build

Integrate the counterfactual capability into the existing Formula Analysis
Workspace on both the English and Greek journeys. Give the user an explicit
what-if entry point, a patch editor for the supported Formula and Process
paths, evaluation controls, and a comparison view that keeps Formula effects
separate from Process effects.

Render the patch list, changed/unchanged/unavailable metrics, evidence,
limitations, partial results, rejected/conflict recovery, model-version
diagnostics, and reset/discard behavior with clear bilingual product wording.
The UI must stay local and deterministic, must not imply optimization or
recipe generation, and must preserve the existing responsive and accessible
workspace behavior.

## Acceptance criteria

- [x] The workspace exposes an understandable what-if flow in both /en/ and
  /el/: start from the current analysis, edit supported Formula or Process
  values, evaluate, and return to the baseline.
- [x] The UI makes the immutable baseline, current scenario status, patch list,
  patch owner (Formula or Process), revision, and model version visible without
  exposing developer-only jargon as ordinary product copy.
- [x] The comparison presents baseline and counterfactual results together,
  labels changed/unchanged/unavailable metrics correctly, and keeps
  composition/intrinsic effects distinct from Process-sensitive effects.
- [x] Partial, rejected, stale, foreign-reference, invalid, and
  model-version-conflict outcomes have localized explanations and actionable
  recovery; no silent fallback or Unknown-to-zero conversion is shown.
- [x] Reset/discard restores the exact baseline revision and model versions and
  removes all patches without mutating the original workspace draft.
- [x] English and Greek translation keys have parity and equivalent meaning;
  raw diagnostic codes, canonical IDs, and model identifiers remain technical
  metadata or accessible labels rather than unexplained user-facing copy.
- [x] Responsive layout, keyboard navigation, focus visibility, accessible
  names, and contrast remain acceptable at supported desktop and mobile widths.
- [x] Automated locale, typecheck, lint, and unit/application checks pass.
  Static-route verification follows the user-managed Astro build policy.
- [x] The grouped visual review of the complete 028–032 journey is completed
  and approved before this issue is closed.

## Artifact sync required

- Application PRD: none; this is the already-specified counterfactual user
  journey and does not add product scope, persistence, accounts, or recipe
  generation.
- Application architecture summary: none; the existing static Astro/Svelte,
  browser-only, in-memory application boundary remains unchanged.
- Owning capability node/artifacts: required; retain the issue reference on
  .okf/capabilities/interactive-exploration.md and update the capability
  orchestration status/state during closeout.
- Shared Bilingual Content and Localization: required verification of all
  public, diagnostic, explanation, and accessibility keys; no shared policy
  change is expected.
- Shared Trust, Provenance, and Uncertainty: required verification of
  semantic labels, confidence, coverage, model maturity, and Unknown policy;
  no shared policy change is expected.
- Issue registry: required; node issues reference: required when .okf exists.
- Reason/no-impact decision: capability-local UI integration using existing
  shared policies; no backend, persistence, topology, or new product boundary.

The application-synthesis gate is current and remains unchanged.

## Blocked by

- None — issues 028–031 are implemented and archived.

## Functional requirements addressed

The parent PRD has no numbered user stories. This issue completes functional
requirements 1–7 and canonical scenarios SC-EX-001 through SC-EX-008 at the
product surface.

## Artifact anchors

- Use cases: StartExploration, ApplyCounterfactualPatch,
  EvaluateCounterfactual, ResetExploration, and GetChangedMetrics
- Contract: ExplorationState and ComparisonResult
- Shared policies: bilingual parity, Formula/Process separation, confidence,
  coverage, provenance, model-version visibility, and Unknown-is-not-zero

## Verification obligations

- Policy source: .okf/project.md

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
| --- | --- | --- | --- |
| SC-EX-001 | not-applicable | implemented in `ExplorationPanel.svelte` and covered by `exploration.test.ts` | deferred: no E2E harness |
| SC-EX-002 | not-applicable | implemented in `ExplorationPanel.svelte` and covered by `exploration.test.ts` | deferred: no E2E harness |
| SC-EX-003 | not-applicable | implemented in `ExplorationPanel.svelte` and covered by `exploration.test.ts` | deferred: no E2E harness |
| SC-EX-004 | not-applicable | implemented in `ExplorationPanel.svelte` and covered by `exploration.test.ts` | deferred: no E2E harness |
| SC-EX-005 | not-applicable | implemented in `ExplorationPanel.svelte` and covered by `exploration.test.ts` | deferred: no E2E harness |
| SC-EX-006 | not-applicable | implemented in `ExplorationPanel.svelte` and covered by `exploration.test.ts` | deferred: no E2E harness |
| SC-EX-007 | not-applicable | implemented in `ExplorationPanel.svelte` and covered by `exploration.test.ts` | deferred: no E2E harness |
| SC-EX-008 | not-applicable | implemented in `ExplorationPanel.svelte` and covered by `exploration.test.ts` | deferred: no E2E harness |

## Delivery evidence

- Integrated a bilingual what-if workspace into the existing English and Greek
  Formula Analysis journeys. The panel starts from the current analysis,
  exposes localized Formula and Process targets, stages typed changes, and
  evaluates or resets an isolated scenario.
- Rendered baseline/scenario comparisons keep intrinsic and Process-sensitive
  metrics separate, show changed/unchanged/unavailable states, retain
  confidence and coverage context, and provide localized recovery for invalid,
  partial, rejected, stale, foreign-reference, and model-version outcomes.
- Added a bilingual help hint beside the target selector explaining the
  `Formula · ingredient · field` and `Process · section · field` formats with
  concrete examples, including that the final item is not a second ingredient.
- Verification: `npm test`, `npm run lint`, `npm run typecheck`, and
  `git diff --check` passed. Astro build/static-route verification remains
  deferred under the user-managed local preview policy.

## Human review gate

The grouped visual review of the complete 028–032 journey was completed and
approved by the user on 2026-09-10. The review covered the English and Greek
journeys, the explanatory target-selector hint, responsive layout, keyboard
navigation, focus visibility, accessible labels, and contrast.
