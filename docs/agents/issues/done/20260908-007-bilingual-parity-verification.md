## Issue Metadata

- Issue number: `007`
- Owning capability node: `/.okf/capabilities/formula-analysis-workspace/formula-input-normalization.md`
- Artifact root: `docs/architecture/formula-input-normalization/`
- Issue file: `docs/agents/issues/pending/007-bilingual-parity-verification.md`
- Category: `feature`
- Execution type: `AFK`
- Review gate: `visual-review`
- Suggested state: `done`

## Parent Artifacts

- `docs/architecture/formula-input-normalization/prd.md`
- `docs/architecture/formula-input-normalization/domain-glossary.md`
- `docs/architecture/formula-input-normalization/canonical-domain-model.md`
- `docs/architecture/formula-input-normalization/canonical-use-cases.md`
- `docs/architecture/formula-input-normalization/canonical-api-cli-contract.md`
- `docs/architecture/formula-input-normalization/acceptance-scenarios.md`
- `docs/architecture/formula-input-normalization/readiness-review.md`
- `.okf/capabilities/shared/bilingual-content.md`

## What to build

Complete the bilingual parity and static-route verification pass for the
Formula Input workspace. Ensure every input control, role, tri-state value,
validation diagnostic, partial result, process state, readiness explanation,
and correction path has equivalent English and Greek presentation while the
canonical state remains identical.

Verify direct `/en/` and `/el/` route loading, locale switching without draft
loss, GitHub Pages base-path behavior, and the generated public `404.html`.
Add static/build and locale-parity checks that are suitable for the current
frontend-only repository and remain compatible with the root `catalog-only`
end-to-end policy.

## Acceptance criteria

- [x] Every Formula Input/Process control and visible state has an equivalent
  English and Greek label/message.
- [x] Switching locale preserves Formula/Process IDs, masses, roles,
  overrides, value states, derived values, diagnostics, and readiness.
- [x] Validation, partial-analysis, conflict, and explanation surfaces are
  reachable and understandable in both locales.
- [x] Direct `/en/` and `/el/` routes work with the configured GitHub Pages
  repository base path and the static output includes the public `404.html`.
- [x] Automated checks compare canonical payload/state parity across locales
  without comparing translated prose as domain data.
- [x] The user can reach and observe the complete Formula Input journey in
  both locales; no behavior is left only behind a domain/service test.
- [x] The user completes the visual review of the final bilingual workspace.

## Artifact sync required

- Application PRD: `none` — bilingual parity and route behavior are already
  product requirements.
- Application architecture summary: `none` — this verifies the existing
  explicit `/en/`/`/el/` route policy; fallback/default-entry remains a
  separate application-level frontier.
- Owning capability node/artifacts: `none` — no semantic change is expected;
  update only if a parity check reveals a canonical behavior mismatch.
- Issue registry: `required`; node `issues:` reference: `required when .okf
  exists` and is maintained by the batch.
- Reason/no-impact decision: final product-surface parity and static checks
  implement the accepted bilingual boundary without changing domain semantics.

## Human review gate

Completed on 2026-09-08: the user approved the bilingual visual review of the
complete Formula Input journey in both locales, including translated labels,
validation, partial-result, conflict, explanation, route switching, direct
route loading, and mobile layout behavior.

## Blocked by

- —

## Artifact anchors

- PRD: FR-10, bilingual journey, verification strategy; AS-10
- Domain model: language-neutral canonical IDs/value states and presentation
  boundary
- Use cases: bilingual presentation parity rules
- Contract: locale-neutral IDs/statuses/errors and HTTP/CLI parity rules

## Acceptance scenarios addressed

- SC-015 — Preserve bilingual parity and reachability

## Verification obligations

- Policy source: `/.okf/project.md`

| Scenario | Backend boundary | Frontend integration | End-to-end journey |
|---|---|---|---|
| `SC-015` | `not-applicable` | `deferred: no frontend integration harness; automated parity/static checks implemented; visual review accepted 2026-09-08` | `deferred: no E2E harness; catalog-only policy` |

## Implementation record

- Added exact English/Greek message-key parity checks and structural parity checks
  for the bilingual help content.
- Added coverage checks for every Process field, controlled option, unit, and
  ingredient-addition action used by the UI.
- Added locale-neutral canonical snapshots for Formula, Process, analysis
  readiness, diagnostics, and derived state; translated prose is not compared as
  domain data.
- Added session-storage round-trip tests proving a locale switch can preserve
  Formula/Process drafts, IDs, roles, overrides, and value states.
- Strengthened the static build check for `/en/`, `/el/`, help routes, cross-locale
  links, configured GitHub Pages base paths, and public `404.html`.
- `npm run verify` passes: 10 test files, 42 tests, lint, typecheck, static build,
  and default-route checks. A separate build/check with
  `BASE_PATH=/dough-formula-intelligence` also passes.
- Human review: the user accepted the bilingual visual review on 2026-09-08,
  including the complete journey, route switching, validation, partial-result,
  conflict, explanation, and mobile layout states.

## Final status

Automated verification and the required visual-review gate are complete.
