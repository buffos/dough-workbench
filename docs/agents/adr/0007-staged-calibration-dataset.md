# ADR-0007: Stage Calibration and Defer Dataset Collection Decisions

- Status: Accepted
- Date: 2026-09-07
- Scope: Model governance and future validation data

## Context

The model must avoid learning internet naming noise and must distinguish
expert-seed assumptions from validated behavior. The future dataset source and
collection workflow are not yet decided.

## Decision

Calibration proceeds in stages: expert seed, curated gold formulas, broader
variation, and controlled experiments. Each dataset is versioned, weighted by
source quality, deduplicated, and split into calibration/validation/test where
appropriate. V1 does not require automatic recipe scraping or an external data
provider.

## Consequences

The first vertical slice can ship with explicit provisional model maturity.
Dataset collection remains a foggy capability and must be clarified before it
becomes a delivery commitment.
