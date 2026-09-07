# Dough Formula Intelligence

Bilingual Greek/English frontend for transparent dough and batter formula
normalization. The current vertical slice runs entirely in the browser and is
deployed as a static Astro site to GitHub Pages.

## Stack

- Astro + TypeScript for static routes and content shell
- Svelte for the interactive Formula workspace
- Framework-independent domain normalization and validation under `src/lib/domain`
- Versioned starter ingredient fixture under `src/data/ingredients`

## Development

```bash
npm install
npm run dev
```

Open `/en/` or `/el/` for the workspace, and `/en/help/` or `/el/help/` for the
terminology and calculation guide. The transient draft is kept in
`sessionStorage` only to preserve the active formula while switching locale;
there is no backend or account persistence.

The repository also includes a PowerShell-compatible `Makefile`:

```bash
make help
make dev
```

## Verification

```bash
npm run verify
```

The equivalent Make target is `make verify`. For a GitHub Pages-style check
with the default repository base path, use `make pages-verify`; override it
with `make pages-verify BASE_PATH=/another-repository` when needed.

This runs domain tests, ESLint, TypeScript, the static Astro build, and route
checks. GitHub Pages builds set `BASE_PATH` to the repository name. In a POSIX
shell:

```bash
BASE_PATH=/website-doughs npm run build
BASE_PATH=/website-doughs npm run check:static
```

In PowerShell, set `$env:BASE_PATH = '/website-doughs'` before each command.

The canonical product and architecture decisions live in `docs/` and `.okf/`.
