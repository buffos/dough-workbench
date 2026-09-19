import {
  GOLD_DATASET_RELEASE_ID,
  type DatasetReleaseRegistry,
} from '../../lib/domain/dataset';
import { assembleGoldDatasetRelease, publishIntoRegistry } from '../../lib/domain/publication';
import { PILOT_DATASET } from './pilot';
import { REFERENCE_MODIFIER_ASSIGNMENTS } from './modifiers';
import { REFERENCE_PROTOTYPE_ASSIGNMENTS } from './prototype-assignments';
import { SOURCE_REGISTRY } from './sources';

export const GOLD_FORMULAS_RELEASE_CREATED_AT = '2026-09-19T00:00:00Z';

/**
 * The browser-safe registry is assembled only from the owner-approved pilot
 * handoff. The handoff contains normalized facts and traces, not copied source
 * prose; publication is deterministic and refuses candidates that do not
 * satisfy the release verifier.
 */
function publishApprovedPilot(): DatasetReleaseRegistry {
  const publication = assembleGoldDatasetRelease({
    handoff: PILOT_DATASET.handoff,
    registry: SOURCE_REGISTRY,
    modifierIdsByPreparationKey: REFERENCE_MODIFIER_ASSIGNMENTS,
    prototypeIdsByPreparationKey: REFERENCE_PROTOTYPE_ASSIGNMENTS,
    releaseId: GOLD_DATASET_RELEASE_ID,
    createdAt: GOLD_FORMULAS_RELEASE_CREATED_AT,
    supersedes: null,
  });
  if (publication.outcome !== 'published' || !publication.release) {
    throw new Error(`${GOLD_DATASET_RELEASE_ID} publication failed: ${publication.diagnostic?.code ?? 'unknown'}`);
  }

  const registered = publishIntoRegistry(
    { currentReleaseId: GOLD_DATASET_RELEASE_ID, releases: {} },
    publication.release,
  );
  if (registered.outcome !== 'published' || !registered.registry) {
    throw new Error(`${GOLD_DATASET_RELEASE_ID} registry publication failed: ${registered.diagnostic?.code ?? 'unknown'}`);
  }
  return registered.registry;
}

export const REFERENCE_DATASET_REGISTRY = publishApprovedPilot();
export const GOLD_FORMULAS_RELEASE = REFERENCE_DATASET_REGISTRY.releases[GOLD_DATASET_RELEASE_ID];
