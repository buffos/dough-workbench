# ADR-0006: Astro + Svelte for the Bilingual Static Frontend

- Status: Accepted
- Date: 2026-09-07
- Scope: Application platform and deployment

## Context

The product is frontend-only, must run on GitHub Pages, needs bilingual
content/SEO-friendly pages, and also contains a highly interactive formula
analysis workspace.

## Decision

Use Astro as the static site shell and content/router layer, TypeScript for the
domain engine, and Svelte for the interactive analysis island. Build and deploy
with GitHub Actions to GitHub Pages. Use explicit `/en/` and `/el/` routes.

## Consequences

Static pages remain lightweight and deployable without a server, while the
analysis workspace can have local reactive state. The domain engine remains
framework-independent. GitHub Pages repository-base-path configuration and a
static 404 page are part of deployment configuration.
