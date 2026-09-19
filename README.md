# Dough Formula Intelligence

Dough Formula Intelligence is a bilingual Greek/English static web application
for exploring dough formulas, process data, and structural dough prototypes.
It is an early public prototype: the goal is to make formula assumptions
visible, comparable, and easy to refine as the reference dataset grows.

The application currently includes:

- A formula workspace for ingredient composition and process information.
- Greek and English routes with matching content and navigation.
- A prototype catalog for dough families and their defining characteristics.
- Reference formulas, including first-party breadstick formulas.
- Process fields for mixing, fermentation, aeration, thermal treatment, and
  geometry.
- Theory and terminology pages that explain the vocabulary used by the model.
- Static, browser-only behavior with no account, backend, or database.

## Technology

- Astro and TypeScript for the static site and routes.
- Svelte for the interactive formula workspace.
- Vitest, ESLint, and TypeScript for the quality gates.
- GitHub Actions and GitHub Pages for continuous deployment.

## Local development

Install the dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open the URL printed by Astro and choose either the `/en/` or `/el/` route.
The main application routes are:

- `/en/` and `/el/` — formula workspace.
- `/en/catalog/` and `/el/catalog/` — prototype catalog.
- `/en/help/` and `/el/help/` — terminology and field explanations.
- `/en/theory/` and `/el/theory/` — theory overview.
- `/en/theory/breadsticks/` and `/el/theory/breadsticks/` — breadstick theory.

The current draft is kept in browser `sessionStorage` while changing locale.
It is not persisted to a server or shared between users.

## Data and code layout

- `src/data/ingredients/` contains the starter ingredient catalog.
- `src/data/reference/` contains reference formulas, source metadata, and
  prototype assignments.
- `src/data/prototypes/` contains the prototype catalog.
- `src/lib/domain/` contains framework-independent normalization, validation,
  classification, and process logic.
- `src/components/` contains the interactive Svelte panels.
- `src/pages/` contains the localized Astro routes.
- `exploration/` contains working notes and source material for the evolving
  model.

## Verification

Run the full local quality gate before publishing changes:

```bash
npm run verify
```

This runs the test suite, ESLint, TypeScript checking, the Astro static build,
and static route/content checks. The equivalent PowerShell-compatible Make
target is:

```bash
make verify
```

To verify the repository as a GitHub Pages project site locally, set the base
path to the repository name:

```bash
BASE_PATH=/repository-name npm run verify
```

In PowerShell, use `$env:BASE_PATH = '/repository-name'` before running the
command.

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` runs the quality gate for pull
requests and deploys successful pushes to the default branch to GitHub Pages.
The build receives the repository name as `BASE_PATH`, so project-page assets
and links work below `https://<owner>.github.io/<repository-name>/`.

The site is fully static. Publishing a later change is simply a push to the
configured deployment branch; GitHub Actions rebuilds and redeploys it
automatically after the checks pass.

## Project documentation

Product notes, architecture decisions, and the evolving domain model live in
`docs/` and `.okf/`. They describe the intended behavior more fully than this
short public README.
