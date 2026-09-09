<script lang="ts">
  import { loadPrototypeCatalog } from '../data/prototypes/catalog';
  import {
    topFamilyMemberships,
    topPrototypeSimilarities,
    type ClassificationFeatureEvaluation,
    type ClassificationInheritedRule,
    type ClassificationResult,
  } from '../lib/domain/classification';
  import {
    resolvePrototypeCatalog,
    type PrototypeFeature,
    type PrototypeFeatureTarget,
    type ResolvedPrototypeDefinition,
  } from '../lib/domain/prototype-catalog';
  import type { Provenance } from '../lib/domain/types';
  import { t, type Locale } from '../lib/i18n/messages';

  export let locale: Locale;
  export let classification: ClassificationResult;

  $: displayFamilies = topFamilyMemberships(classification.families);
  $: displayCandidates = topPrototypeSimilarities(classification.candidates);
  $: hiddenFamilyCount = classification.families.length - displayFamilies.length;
  $: hiddenCandidateCount = classification.candidates.length - displayCandidates.length;

  const loadedCatalog = loadPrototypeCatalog();
  const resolvedCatalogResult = loadedCatalog.status === 'available'
    ? resolvePrototypeCatalog(loadedCatalog.snapshot)
    : null;
  const catalog = resolvedCatalogResult?.status === 'resolved' ? resolvedCatalogResult.snapshot : null;

  function definitionFor(id: string | undefined): ResolvedPrototypeDefinition | undefined {
    return id ? catalog?.byId[id] : undefined;
  }

  function featureFor(definition: ResolvedPrototypeDefinition | undefined, id: string): PrototypeFeature | undefined {
    if (!definition) return undefined;
    return [
      ...definition.structuralFeatures,
      ...definition.structuralConstraints,
      ...definition.identityModifiers,
    ].find((feature) => feature.id === id);
  }

  function definitionLabel(id: string | undefined): string {
    return definitionFor(id)?.label[locale] ?? t(locale, 'classification.explanation.sourceUnavailable');
  }

  function featureLabel(definition: ResolvedPrototypeDefinition | undefined, id: string): string {
    return featureFor(definition, id)?.label[locale] ?? t(locale, 'classification.explanation.unknownFeature');
  }

  function formatNumber(value: number): string {
    return new Intl.NumberFormat(locale === 'el' ? 'el-GR' : 'en-US', {
      maximumFractionDigits: 2,
    }).format(value);
  }

  function formatPercent(value: number | undefined): string {
    return value === undefined ? '—' : `${formatNumber(value * 100)}%`;
  }

  function translatedOrFallback(key: string, fallbackKey: string): string {
    const value = t(locale, key);
    return value.startsWith('[missing-translation:') ? t(locale, fallbackKey) : value;
  }

  function targetLabel(target: PrototypeFeatureTarget): string {
    if (target.kind === 'band') return t(locale, `catalog.target.band.${target.value}`);
    if (target.kind === 'band-range') {
      return t(locale, 'catalog.target.range', {
        min: t(locale, `catalog.target.band.${target.min}`),
        max: t(locale, `catalog.target.band.${target.max}`),
      });
    }
    if (target.kind === 'presence') return t(locale, `catalog.target.presence.${target.value}`);
    return t(locale, 'catalog.target.compatibility', {
      values: target.values
        .map((value) => translatedOrFallback(`catalog.value.${value}`, 'classification.value.recordedCategory'))
        .join(', '),
    });
  }

  function observedValueLabel(value: number | string | boolean): string {
    if (typeof value === 'number') return formatNumber(value);
    if (typeof value === 'boolean') return value ? t(locale, 'classification.value.present') : t(locale, 'classification.value.absent');
    if (value === 'present' || value === 'absent') return t(locale, `classification.value.${value}`);
    return translatedOrFallback(`catalog.value.${value}`, 'classification.value.recordedCategory');
  }

  function evidenceStatusLabel(status: ClassificationFeatureEvaluation['status']): string {
    return t(locale, `classification.explanation.status.${status}`);
  }

  function evidenceKindLabel(kind: ClassificationFeatureEvaluation['kind']): string {
    return t(locale, `classification.explanation.kind.${kind}`);
  }

  function evidenceSourceLabel(item: ClassificationFeatureEvaluation): string {
    if (item.origin === 'inherited') {
      return t(locale, 'classification.explanation.origin.inherited', {
        source: definitionLabel(item.sourcePrototypeId ?? item.inheritedFrom?.[0]),
      });
    }
    if (item.origin === 'own') return t(locale, 'classification.explanation.origin.own');
    return t(locale, 'classification.explanation.sourceUnavailable');
  }

  function evidenceDetail(item: ClassificationFeatureEvaluation, definition: ResolvedPrototypeDefinition | undefined): string {
    const details = [
      `${evidenceKindLabel(item.kind)} · ${t(locale, 'classification.explanation.target', { value: targetLabel(item.target) })}`,
    ];
    if (item.observedBand) details.push(`${t(locale, 'classification.explanation.observed', { value: t(locale, `catalog.target.band.${item.observedBand}`) })}`);
    else if (item.observedValue !== undefined) details.push(`${t(locale, 'classification.explanation.observed', { value: observedValueLabel(item.observedValue) })}`);
    if (item.origin) details.push(evidenceSourceLabel(item));
    if (!featureFor(definition, item.featureId)) details.push(t(locale, 'classification.explanation.sourceUnavailable'));
    return details.join(' · ');
  }

  function provenanceLabel(item: Provenance): string {
    const label = item.kind === 'catalog'
      ? t(locale, 'classification.source.catalog')
      : item.kind === 'derived'
        ? t(locale, 'classification.source.derived')
        : t(locale, `provenance.${item.kind}`);
    return item.sourceVersion ? `${label} · ${item.sourceVersion}` : label;
  }

  function diagnosticHas(code: string): boolean {
    return classification.diagnostics.some((diagnostic) => diagnostic.code === code);
  }

  function maturityLabel(): string {
    return diagnosticHas('MODEL_UNAVAILABLE')
      ? t(locale, 'classification.value.unavailable')
      : t(locale, 'classification.maturity.expertSeed');
  }

  function inheritedPathLabel(rule: ClassificationInheritedRule): string {
    const path = rule.inheritedFrom.map((id) => definitionLabel(id)).join(' → ');
    return t(locale, 'classification.explanation.inheritedPath', {
      path: path || definitionLabel(rule.sourcePrototypeId),
    });
  }
</script>

<section class="classification-panel" aria-labelledby="classification-panel-title">
  <div class="classification-heading">
    <div>
      <span class="classification-kicker">{t(locale, 'classification.kicker')}</span>
      <h4 id="classification-panel-title">{t(locale, 'classification.title')}</h4>
      <p>{t(locale, 'classification.intro')}</p>
    </div>
    <span class={'classification-outcome ' + classification.outcome}>
      <span class="status-dot"></span>
      {t(locale, `classification.outcome.${classification.outcome}`)}
    </span>
  </div>

  <div class="classification-summary">
    <div>
      <span>{t(locale, 'metric.coverage')}</span>
      <strong>{formatPercent(classification.coverage)}</strong>
    </div>
    <div>
      <span>{t(locale, 'metric.confidence')}</span>
      <strong>{formatPercent(classification.confidence)}</strong>
    </div>
    <div>
      <span>{t(locale, 'classification.maturity')}</span>
      <strong>{maturityLabel()}</strong>
    </div>
  </div>

  <p class="classification-outcome-note">{t(locale, `classification.outcomeBody.${classification.outcome}`)}</p>

  {#if classification.diagnostics.length > 0}
    <div class="classification-diagnostics" role="alert" aria-live="polite">
      {#each classification.diagnostics as diagnostic (`${diagnostic.code}-${diagnostic.path}`)}
        <div class={'classification-diagnostic ' + diagnostic.severity}>
          <strong>{t(locale, diagnostic.messageKey, diagnostic.parameters)}</strong>
          <p>{t(locale, diagnostic.resolutionKey, diagnostic.parameters)}</p>
        </div>
      {/each}
      {#if diagnosticHas('MODEL_UNAVAILABLE') || diagnosticHas('STALE_ANALYSIS') || diagnosticHas('CONSTRAINT_CONFLICT')}
        <div class="classification-recovery">
          <strong>{t(locale, 'classification.diagnostic.recoveryTitle')}</strong>
          <p>{t(locale, 'classification.diagnostic.recoveryBody')}</p>
        </div>
      {/if}
    </div>
  {/if}

  <section class="classification-section" aria-labelledby="classification-families-title">
    <div class="classification-section-heading">
      <div>
        <span class="classification-section-kicker">01</span>
        <h5 id="classification-families-title">{t(locale, 'classification.families')}</h5>
      </div>
      <p>{t(locale, 'classification.familyIntro')}</p>
    </div>

    {#if displayFamilies.length > 0}
      <div class="family-list">
        {#each displayFamilies as family (`${family.familyId}-${family.status}`)}
          <article class={'family-card ' + family.status}>
            <div class="family-card-heading">
              <strong>{definitionLabel(family.familyId)}</strong>
              <span>{t(locale, `classification.status.${family.status}`)}</span>
            </div>
            <div class="family-card-meta">
              <span>{t(locale, 'metric.coverage')}: {formatPercent(family.coverage)}</span>
              <span>{t(locale, 'metric.confidence')}: {formatPercent(family.confidence)}</span>
            </div>
            <details class="evidence-details">
              <summary>{t(locale, 'classification.explanation.evidenceCount', { count: family.evidence.length })}</summary>
              {#if family.evidence.length > 0}
                <ul class="evidence-list">
                  {#each family.evidence as item (`${item.featureId}-${item.kind}-${item.status}`)}
                    <li class={'evidence-row ' + item.status}>
                      <div>
                        <strong>{featureLabel(definitionFor(family.familyId), item.featureId)}</strong>
                        <span>{evidenceStatusLabel(item.status)} · {evidenceDetail(item, definitionFor(family.familyId))}</span>
                      </div>
                    </li>
                  {/each}
                </ul>
              {:else}
                <p class="evidence-empty">{t(locale, 'classification.explanation.noItems')}</p>
              {/if}
            </details>
          </article>
        {/each}
      </div>
      {#if hiddenFamilyCount > 0}
        <p class="classification-limit-note">{t(locale, 'classification.familyLimit', { count: displayFamilies.length, total: classification.families.length })}</p>
      {/if}
    {:else}
      <p class="classification-empty">{t(locale, 'classification.explanation.noPrimary')}</p>
    {/if}
  </section>

  <section class="classification-section" aria-labelledby="classification-candidates-title">
    <div class="classification-section-heading">
      <div>
        <span class="classification-section-kicker">02</span>
        <h5 id="classification-candidates-title">{t(locale, 'classification.candidates')}</h5>
      </div>
      <p>{t(locale, 'classification.candidateIntro')}</p>
    </div>

    {#if displayCandidates.length > 0}
      <div class="candidate-list">
        {#each displayCandidates as candidate (`${candidate.prototypeId}-${candidate.status}`)}
          <article class={'candidate-card ' + candidate.status} class:selected={candidate.prototypeId === classification.explanation.primaryPrototypeId}>
            <div class="candidate-card-heading">
              <div>
                <strong>{definitionLabel(candidate.prototypeId)}</strong>
                {#if candidate.prototypeId === classification.explanation.primaryPrototypeId}
                  <span class="primary-marker">{t(locale, 'classification.primary')}</span>
                {/if}
              </div>
              <span>{t(locale, `classification.status.${candidate.status}`)}</span>
            </div>
            <div class="similarity-grid">
              {#if candidate.compositionSimilarity !== undefined}
                <div><span>{t(locale, 'classification.metric.composition')}</span><strong>{formatPercent(candidate.compositionSimilarity)}</strong></div>
              {/if}
              {#if candidate.processSimilarity !== undefined}
                <div><span>{t(locale, 'classification.metric.process')}</span><strong>{formatPercent(candidate.processSimilarity)}</strong></div>
              {/if}
              {#if candidate.overallIdentitySimilarity !== undefined}
                <div><span>{t(locale, 'classification.metric.overall')}</span><strong>{formatPercent(candidate.overallIdentitySimilarity)}</strong></div>
              {/if}
            </div>
            <div class="candidate-card-meta">
              <span>{t(locale, 'metric.coverage')}: {formatPercent(candidate.coverage)}</span>
              <span>{t(locale, 'metric.confidence')}: {formatPercent(candidate.confidence)}</span>
            </div>
            <details class="evidence-details">
              <summary>{t(locale, 'classification.explanation.evidenceCount', { count: candidate.evaluatedFeatures.length })}</summary>
              {#if candidate.evaluatedFeatures.length > 0}
                <ul class="evidence-list">
                  {#each candidate.evaluatedFeatures as item (`${item.featureId}-${item.kind}-${item.status}`)}
                    <li class={'evidence-row ' + item.status}>
                      <div>
                        <strong>{featureLabel(definitionFor(candidate.prototypeId), item.featureId)}</strong>
                        <span>{evidenceStatusLabel(item.status)} · {evidenceDetail(item, definitionFor(candidate.prototypeId))}</span>
                      </div>
                    </li>
                  {/each}
                </ul>
              {:else}
                <p class="evidence-empty">{t(locale, 'classification.explanation.noItems')}</p>
              {/if}
            </details>
          </article>
        {/each}
      </div>
      {#if hiddenCandidateCount > 0}
        <p class="classification-limit-note">{t(locale, 'classification.candidateLimit', { count: displayCandidates.length, total: classification.candidates.length })}</p>
      {/if}
    {:else}
      <p class="classification-empty">{t(locale, 'classification.explanation.noPrimary')}</p>
    {/if}
  </section>

  <section class="classification-explanation" aria-labelledby="classification-explanation-title">
    <div class="classification-explanation-heading">
      <div>
        <span class="classification-section-kicker">03</span>
        <h5 id="classification-explanation-title">{t(locale, 'classification.explanation.title')}</h5>
      </div>
      {#if classification.explanation.primaryPrototypeId}
        <strong>{definitionLabel(classification.explanation.primaryPrototypeId)}</strong>
      {/if}
    </div>
    <p class="classification-explanation-intro">{t(locale, 'classification.explanation.intro')}</p>

    {#if definitionFor(classification.explanation.primaryPrototypeId)}
      {@const primaryDefinition = definitionFor(classification.explanation.primaryPrototypeId)}
      <div class="explanation-grid">
        <div class="explanation-group positive">
          <h6>{t(locale, 'classification.explanation.positive')}</h6>
          {#if classification.explanation.positiveFeatures.length > 0}
            <ul class="evidence-list">
              {#each classification.explanation.positiveFeatures as item (`positive-${item.featureId}-${item.kind}`)}
                <li class="evidence-row matched"><div><strong>{featureLabel(primaryDefinition, item.featureId)}</strong><span>{evidenceDetail(item, primaryDefinition)}</span></div></li>
              {/each}
            </ul>
          {:else}
            <p class="evidence-empty">{t(locale, 'classification.explanation.noItems')}</p>
          {/if}
        </div>
        <div class="explanation-group limiting">
          <h6>{t(locale, 'classification.explanation.limiting')}</h6>
          {#if classification.explanation.limitingFeatures.length > 0}
            <ul class="evidence-list">
              {#each classification.explanation.limitingFeatures as item (`limiting-${item.featureId}-${item.kind}`)}
                <li class="evidence-row mismatched"><div><strong>{featureLabel(primaryDefinition, item.featureId)}</strong><span>{evidenceDetail(item, primaryDefinition)}</span></div></li>
              {/each}
            </ul>
          {:else}
            <p class="evidence-empty">{t(locale, 'classification.explanation.noItems')}</p>
          {/if}
        </div>
        <div class="explanation-group conflicts">
          <h6>{t(locale, 'classification.explanation.conflicts')}</h6>
          {#if classification.explanation.conflicts.length > 0}
            <ul class="evidence-list">
              {#each classification.explanation.conflicts as item (`conflict-${item.featureId}-${item.kind}`)}
                <li class="evidence-row mismatched"><div><strong>{featureLabel(primaryDefinition, item.featureId)}</strong><span>{evidenceDetail(item, primaryDefinition)}</span></div></li>
              {/each}
            </ul>
          {:else}
            <p class="evidence-empty">{t(locale, 'classification.explanation.noItems')}</p>
          {/if}
        </div>
        <div class="explanation-group missing">
          <h6>{t(locale, 'classification.explanation.missing')}</h6>
          {#if classification.explanation.missingFeatures.length > 0}
            <ul class="evidence-list">
              {#each classification.explanation.missingFeatures as featureId (featureId)}
                <li class="evidence-row unknown"><div><strong>{featureLabel(primaryDefinition, featureId)}</strong><span>{t(locale, 'classification.explanation.status.unknown')}</span></div></li>
              {/each}
            </ul>
          {:else}
            <p class="evidence-empty">{t(locale, 'classification.explanation.noItems')}</p>
          {/if}
        </div>
        <div class="explanation-group inherited">
          <h6>{t(locale, 'classification.explanation.inherited')}</h6>
          {#if classification.explanation.inheritedRules.length > 0}
            <ul class="evidence-list">
              {#each classification.explanation.inheritedRules as rule (`${rule.featureId}-${rule.sourcePrototypeId}`)}
                <li class="evidence-row"><div><strong>{featureLabel(primaryDefinition, rule.featureId)}</strong><span>{inheritedPathLabel(rule)}</span></div></li>
              {/each}
            </ul>
          {:else}
            <p class="evidence-empty">{t(locale, 'classification.explanation.noItems')}</p>
          {/if}
        </div>
        <div class="explanation-group identity">
          <h6>{t(locale, 'classification.explanation.identity')}</h6>
          {#if classification.explanation.identityModifiers.length > 0}
            <ul class="evidence-list">
              {#each classification.explanation.identityModifiers as item (`identity-${item.featureId}`)}
                <li class={'evidence-row ' + item.status}><div><strong>{featureLabel(primaryDefinition, item.featureId)}</strong><span>{evidenceStatusLabel(item.status)} · {evidenceDetail(item, primaryDefinition)}</span></div></li>
              {/each}
            </ul>
          {:else}
            <p class="evidence-empty">{t(locale, 'classification.explanation.noItems')}</p>
          {/if}
        </div>
      </div>
    {:else}
      <p class="classification-empty">{t(locale, 'classification.explanation.noPrimary')}</p>
    {/if}

    {#if classification.explanation.provenance.length > 0}
      <div class="classification-provenance">
        <h6>{t(locale, 'classification.explanation.provenance')}</h6>
        <ul>
          {#each classification.explanation.provenance as item, provenanceIndex (`${item.kind}-${item.sourceVersion ?? ''}-${item.modelVersion ?? ''}-${provenanceIndex}`)}
            <li>{provenanceLabel(item)}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </section>

  <details class="classification-technical">
    <summary>{t(locale, 'classification.technical')}</summary>
    <dl>
      <div><dt>{t(locale, 'classification.technical.modelVersion')}</dt><dd><code>{classification.modelVersion}</code></dd></div>
      {#if catalog && !diagnosticHas('MODEL_UNAVAILABLE')}
        <div><dt>{t(locale, 'classification.technical.catalogVersion')}</dt><dd><code>{catalog.reference.version}</code></dd></div>
      {/if}
    </dl>
  </details>
</section>

<style>
  .classification-panel { margin: 1.35rem 1.25rem 0; padding: 1rem; border: 1px solid #d7e2d5; background: #f5faf4; }
  .classification-heading { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-start; padding-bottom: 0.85rem; border-bottom: 1px solid rgba(78, 110, 83, 0.16); }
  .classification-kicker, .classification-section-kicker { color: #607866; font-size: 0.56rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
  .classification-heading h4 { margin: 0.28rem 0 0; color: #345040; font-family: Georgia, "Times New Roman", serif; font-size: 1.18rem; font-weight: 400; letter-spacing: -0.03em; }
  .classification-heading p { max-width: 44rem; margin: 0.4rem 0 0; color: #5c6d60; font-size: 0.68rem; line-height: 1.5; }
  .classification-outcome { display: inline-flex; flex: 0 0 auto; gap: 0.35rem; align-items: center; color: #45634d; font-size: 0.62rem; font-weight: 750; text-align: right; }
  .classification-outcome.partial, .classification-outcome.no_strong_canonical_match { color: #8d5e44; }
  .classification-outcome.hybrid { color: #634d70; }
  .classification-outcome .status-dot { background: currentColor; }
  .classification-summary { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.55rem; margin-top: 0.85rem; }
  .classification-summary > div { min-width: 0; padding: 0.58rem 0.65rem; border: 1px solid #dce7da; background: #fffdfa; }
  .classification-summary span, .classification-summary strong { display: block; }
  .classification-summary span { color: #647267; font-size: 0.54rem; font-weight: 750; letter-spacing: 0.05em; text-transform: uppercase; }
  .classification-summary strong { margin-top: 0.25rem; overflow-wrap: anywhere; color: #345443; font-family: Georgia, "Times New Roman", serif; font-size: 0.95rem; font-weight: 400; }
  .classification-outcome-note { margin: 0.8rem 0 0; color: #5c6d60; font-size: 0.67rem; line-height: 1.5; }
  .classification-diagnostics { display: grid; gap: 0.45rem; margin-top: 0.75rem; }
  .classification-diagnostic, .classification-recovery { padding: 0.6rem 0.7rem; border-left: 2px solid #b87859; background: rgba(255, 253, 249, 0.72); color: #675c63; }
  .classification-diagnostic.warning, .classification-diagnostic.info { border-left-color: #b87859; }
  .classification-diagnostic strong, .classification-recovery strong { display: block; color: #624d5f; font-size: 0.66rem; }
  .classification-diagnostic p, .classification-recovery p { margin: 0.22rem 0 0; font-size: 0.61rem; line-height: 1.4; }
  .classification-recovery { border-left-color: #a04d3f; background: #fff4ef; color: #7b5847; }
  .classification-recovery strong { color: #8d4f41; }
  .classification-section, .classification-explanation { margin-top: 1rem; padding-top: 0.85rem; border-top: 1px solid rgba(78, 110, 83, 0.15); }
  .classification-section-heading, .classification-explanation-heading { display: flex; justify-content: space-between; gap: 0.8rem; align-items: baseline; }
  .classification-section-heading > div, .classification-explanation-heading > div { display: flex; gap: 0.45rem; align-items: baseline; }
  .classification-section-heading h5, .classification-explanation-heading h5 { margin: 0; color: #345040; font-family: Georgia, "Times New Roman", serif; font-size: 1rem; font-weight: 400; }
  .classification-section-heading p { max-width: 20rem; margin: 0; color: #657167; font-size: 0.6rem; line-height: 1.4; text-align: right; }
  .family-list, .candidate-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.55rem; margin-top: 0.7rem; }
  .family-card, .candidate-card { min-width: 0; padding: 0.7rem; border: 1px solid #dce7da; background: #fffdfa; }
  .family-card.partial, .candidate-card.candidate { border-color: #ead9cb; background: #fff8f1; }
  .family-card.conflicted, .candidate-card.conflicted { border-color: #e7c5ba; background: #fff1ec; }
  .family-card.unavailable, .candidate-card.unavailable { border-color: #ddd8d1; background: #faf8f4; }
  .candidate-card.selected { box-shadow: inset 0 0 0 1px #6c9874; }
  .family-card-heading, .candidate-card-heading { display: flex; justify-content: space-between; gap: 0.45rem; align-items: flex-start; }
  .family-card-heading strong, .candidate-card-heading strong { min-width: 0; color: #3f5f4a; font-size: 0.71rem; line-height: 1.3; overflow-wrap: anywhere; }
  .family-card-heading > span, .candidate-card-heading > span { flex: 0 0 auto; color: #637367; font-size: 0.55rem; font-weight: 750; text-align: right; }
  .family-card.conflicted .family-card-heading > span, .candidate-card.conflicted .candidate-card-heading > span { color: #9a5443; }
  .candidate-card-heading > div { min-width: 0; display: flex; gap: 0.35rem; align-items: baseline; flex-wrap: wrap; }
  .primary-marker { padding: 0.14rem 0.25rem; color: #45634d; background: #e1eee1; font-size: 0.5rem; font-weight: 750; }
  .family-card-meta, .candidate-card-meta { display: flex; flex-wrap: wrap; gap: 0.4rem 0.7rem; margin-top: 0.4rem; color: #69766c; font-size: 0.56rem; line-height: 1.35; }
  .classification-limit-note { margin: 0.55rem 0 0; color: #69766c; font-size: 0.58rem; line-height: 1.4; }
  .similarity-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.35rem; margin-top: 0.6rem; }
  .similarity-grid > div { min-width: 0; padding: 0.38rem; border: 1px solid #e2e9e0; background: rgba(245, 250, 244, 0.8); }
  .similarity-grid span, .similarity-grid strong { display: block; }
  .similarity-grid span { color: #657167; font-size: 0.5rem; line-height: 1.2; }
  .similarity-grid strong { margin-top: 0.2rem; color: #345443; font-family: Georgia, "Times New Roman", serif; font-size: 0.9rem; font-weight: 400; }
  .evidence-details { margin-top: 0.6rem; padding-top: 0.45rem; border-top: 1px solid rgba(78, 110, 83, 0.13); }
  .evidence-details summary, .classification-technical summary { color: #45634d; cursor: pointer; font-size: 0.59rem; font-weight: 750; }
  .evidence-list { display: grid; gap: 0.32rem; margin: 0.5rem 0 0; padding: 0; list-style: none; }
  .evidence-row { min-width: 0; padding: 0.38rem 0.45rem; border-left: 2px solid #c2d5c1; background: rgba(245, 250, 244, 0.74); }
  .evidence-row.mismatched { border-left-color: #cc8568; background: #fff6ef; }
  .evidence-row.unknown, .evidence-row.not_applicable { border-left-color: #b9afa4; background: #faf7f3; }
  .evidence-row > div { min-width: 0; }
  .evidence-row strong, .evidence-row span { display: block; overflow-wrap: anywhere; }
  .evidence-row strong { color: #46604e; font-size: 0.59rem; line-height: 1.3; }
  .evidence-row span { margin-top: 0.12rem; color: #69746b; font-size: 0.54rem; line-height: 1.35; }
  .evidence-empty, .classification-empty { margin: 0.5rem 0 0; color: #69746b; font-size: 0.6rem; line-height: 1.45; }
  .classification-explanation-heading > strong { color: #3f5f4a; font-size: 0.65rem; text-align: right; }
  .classification-explanation-intro { margin: 0.45rem 0 0; color: #5f6c63; font-size: 0.63rem; line-height: 1.45; }
  .explanation-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; margin-top: 0.75rem; }
  .explanation-group { min-width: 0; }
  .explanation-group h6, .classification-provenance h6 { margin: 0; color: #5b745f; font-size: 0.57rem; line-height: 1.25; }
  .explanation-group.limiting h6, .explanation-group.conflicts h6 { color: #925943; }
  .classification-provenance { margin-top: 0.8rem; padding-top: 0.65rem; border-top: 1px dashed rgba(78, 110, 83, 0.18); }
  .classification-provenance ul { margin: 0.35rem 0 0; padding-left: 1rem; color: #69746b; font-size: 0.56rem; line-height: 1.45; }
  .classification-technical { margin-top: 0.8rem; padding-top: 0.65rem; border-top: 1px dashed rgba(78, 110, 83, 0.2); }
  .classification-technical dl { display: grid; grid-template-columns: 1fr auto; gap: 0.3rem 0.7rem; margin: 0.55rem 0 0; color: #69746b; font-size: 0.57rem; }
  .classification-technical dt, .classification-technical dd { margin: 0; }
  .classification-technical dd { color: #45634d; font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.56rem; }
  @media (max-width: 720px) {
    .classification-panel { margin-left: 1rem; margin-right: 1rem; }
    .classification-heading, .classification-section-heading, .classification-explanation-heading { display: block; }
    .classification-outcome { margin-top: 0.65rem; }
    .classification-section-heading p { max-width: none; margin-top: 0.35rem; text-align: left; }
    .family-list, .candidate-list { grid-template-columns: 1fr; }
  }
  @media (max-width: 460px) {
    .classification-summary, .similarity-grid, .explanation-grid { grid-template-columns: 1fr; }
  }
</style>
