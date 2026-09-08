# Ingredient and Prototype Knowledge — Canonical API/CLI Contract

Status: Canonical transport-neutral contract
Date: 2026-09-08

## Catalog metadata

    type CatalogReference = {
      catalogId: string;
      version: string;
      contentHash?: string;
    };

    type IngredientReference = {
      ingredientId: string;
      version: string;
    };

## Resolved definition

    type ResolvedIngredient = {
      reference: IngredientReference | { source: 'custom'; localId: string };
      labels: Record<string, string>;
      composition: Record<string, ValueState<number>>;
      provenance: ProvenanceRef[];
      confidence: number;
    };

## Prototype contract

    type PrototypeReference = {
      prototypeId: string;
      version: string;
      familyIds: string[];
      parentIds: string[];
      matcherPolicyId: string;
      confidenceTier: 'high' | 'medium' | 'calibration-limited';
    };

Catalog requests are read-only in V1. Future HTTP/CLI mappings may expose
GET /catalogs/{version} and dough catalog inspect, but cannot change the
browser-side semantics.
