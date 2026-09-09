<script lang="ts">
  import type { EffectiveAnalysisResult, EffectiveMetricResult, FeatureContribution } from '../lib/domain/effective';
  import { t, type Locale } from '../lib/i18n/messages';
  import FieldHelp from './FieldHelp.svelte';

  export let locale: Locale;
  export let analysis: EffectiveAnalysisResult;

  function formatNumber(value: number): string {
    return new Intl.NumberFormat(locale === 'el' ? 'el-GR' : 'en-US', {
      maximumFractionDigits: 2,
    }).format(value);
  }

  function formatPercent(value: number): string {
    return `${formatNumber(value * 100)}%`;
  }

  function metricLabel(metric: EffectiveMetricResult): string {
    return t(locale, `effective.metric.${metric.key}`);
  }

  function metricHelp(metric: EffectiveMetricResult): string {
    return t(locale, `help.effective.metric.${metric.key}`);
  }

  function metricValue(metric: EffectiveMetricResult): string {
    return metric.value === undefined ? '—' : `${formatNumber(metric.value)} ${metric.unit}`;
  }

  function statusLabel(metric: EffectiveMetricResult): string {
    return t(locale, `effective.status.${metric.status}`);
  }

  function contributionFeatureLabel(contribution: FeatureContribution): string {
    return t(locale, `effective.feature.${contribution.featureKey}`);
  }

  function contributionPathLabel(contribution: FeatureContribution): string {
    if (contribution.path === 'ingredientAddition.steps') return t(locale, 'process.addition.step');
    const [section, field] = contribution.path.split('.');
    return `${t(locale, `process.section.${section}`)} · ${t(locale, `process.field.${field}`)}`;
  }

  function limitationLabel(code: string): string {
    return t(locale, `effective.limitation.${code}`);
  }
</script>

<section class="effective-panel" aria-labelledby="effective-panel-title">
  <div class="effective-heading">
    <div>
      <span class="effective-kicker">{t(locale, 'effective.kicker')}</span>
      <h4 id="effective-panel-title">{t(locale, 'effective.title')}</h4>
      <p>{t(locale, 'effective.intro')}</p>
    </div>
    <span class={'effective-outcome ' + analysis.outcome}>
      <span class="status-dot"></span>
      {t(locale, `effective.outcome.${analysis.outcome}`)}
    </span>
  </div>

  <div class="effective-summary">
    <div>
      <span>{t(locale, 'metric.coverage')}</span>
      <strong>{formatPercent(analysis.coverage)}</strong>
    </div>
    <div>
      <span>{t(locale, 'metric.confidence')}</span>
      <strong>{formatPercent(analysis.confidence)}</strong>
    </div>
    <div>
      <span>{t(locale, 'effective.modelMaturity')}</span>
      <strong>{t(locale, 'semantic.heuristic')}</strong>
    </div>
  </div>

  {#if analysis.outcome === 'partial'}
    <div class="effective-note partial"><span>◐</span><p>{t(locale, 'effective.partialBody')}</p></div>
  {:else if analysis.outcome === 'conflict' || analysis.outcome === 'rejected'}
    <div class="effective-note conflict"><span>!</span><p>{t(locale, 'effective.conflictBody')}</p></div>
  {/if}

  {#if analysis.diagnostics.length > 0}
    <div class="effective-diagnostics" aria-live="polite">
      {#each analysis.diagnostics as diagnostic (`${diagnostic.code}-${diagnostic.path}`)}
        <div class="effective-diagnostic">
          <strong>{t(locale, diagnostic.messageKey, diagnostic.parameters)}</strong>
          <p>{t(locale, diagnostic.resolutionKey, diagnostic.parameters)}</p>
        </div>
      {/each}
    </div>
  {/if}

  {#if analysis.metrics.length > 0}
    <div class="effective-grid">
      {#each analysis.metrics as metric (metric.key)}
        <article class={'effective-card ' + metric.status}>
          <div class="effective-card-topline">
            <FieldHelp
              label={metricLabel(metric)}
              help={metricHelp(metric)}
              helpId={`help-effective-metric-${metric.key}`}
            />
            <span class="semantic-tag heuristic">{t(locale, 'semantic.heuristic')}</span>
          </div>
          <strong class="effective-value">{metricValue(metric)}</strong>
          <span class="effective-status">{statusLabel(metric)}</span>
          <span class="effective-evidence">
            {t(locale, 'metric.coverage')}: {formatPercent(metric.coverage)} · {t(locale, 'metric.confidence')}: {formatPercent(metric.confidence)}
          </span>
          {#if metric.intrinsicValue !== undefined}
            <span class="effective-baseline">{t(locale, 'effective.intrinsicBaseline')}: {formatNumber(metric.intrinsicValue)} · {t(locale, 'effective.change')}: {metric.delta === undefined ? '—' : formatNumber(metric.delta)}</span>
          {/if}

          <details class="effective-explanation">
            <summary>{t(locale, 'effective.details')}</summary>
            <div class="effective-explanation-body">
              <div>
                <h5>{t(locale, 'effective.contributions')}</h5>
                {#if metric.featureContributions.length > 0}
                  <ul>
                    {#each metric.featureContributions as contribution (`${contribution.featureKey}-${contribution.path}`)}
                      <li>
                        <strong>{contributionFeatureLabel(contribution)}</strong>
                        <span>{contributionPathLabel(contribution)} · {formatNumber(contribution.value)} · {t(locale, `effective.effect.${contribution.effect}`)}</span>
                      </li>
                    {/each}
                  </ul>
                {:else}
                  <p>{t(locale, 'effective.noContributions')}</p>
                {/if}
              </div>
              <div>
                <h5>{t(locale, 'effective.missingPrerequisites')}</h5>
                {#if metric.explanation.missingPrerequisites.length > 0}
                  <p>{metric.explanation.missingPrerequisites.length} {t(locale, 'effective.missingPrerequisites').toLowerCase()}</p>
                {:else}
                  <p>{t(locale, 'effective.noContributions')}</p>
                {/if}
              </div>
            </div>
          </details>
        </article>
      {/each}
    </div>
  {:else}
    <div class="effective-empty">
      <strong>{t(locale, 'effective.noMetrics')}</strong>
    </div>
  {/if}

  {#if analysis.limitationCodes.length > 0}
    <div class="effective-limitations">
      <h5>{t(locale, 'effective.limitations')}</h5>
      <ul>
        {#each analysis.limitationCodes as code (code)}
          <li>{limitationLabel(code)}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <details class="effective-basis">
    <summary>{t(locale, 'effective.analysisBasis')}</summary>
    <div>
      <span>{t(locale, 'effective.formulaRevision')}</span><strong>{analysis.formulaRevision}</strong>
      <span>{t(locale, 'effective.processRevision')}</span><strong>{analysis.processRevision}</strong>
      <span>{t(locale, 'effective.modelVersion')}</span><strong>{analysis.modelVersion}</strong>
    </div>
  </details>
</section>

<style>
  .effective-panel { margin: 1.35rem 1.25rem 0; padding: 1rem; border: 1px solid #d8d0e1; background: #faf7fc; }
  .effective-heading { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-start; padding-bottom: 0.85rem; border-bottom: 1px solid rgba(99, 77, 112, 0.18); }
  .effective-kicker { color: #735b7f; font-size: 0.56rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
  .effective-heading h4 { margin: 0.28rem 0 0; color: #4f3e59; font-family: Georgia, "Times New Roman", serif; font-size: 1.18rem; font-weight: 400; letter-spacing: -0.03em; }
  .effective-heading p { max-width: 44rem; margin: 0.4rem 0 0; color: #665e69; font-size: 0.68rem; line-height: 1.5; }
  .effective-outcome { display: inline-flex; flex: 0 0 auto; gap: 0.35rem; align-items: center; color: #634d70; font-size: 0.62rem; font-weight: 750; text-align: right; }
  .effective-outcome.partial { color: #8d5e44; }
  .effective-outcome.conflict, .effective-outcome.rejected { color: #a04d3f; }
  .effective-outcome .status-dot { background: currentColor; }
  .effective-summary { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.55rem; margin-top: 0.85rem; }
  .effective-summary > div { min-width: 0; padding: 0.58rem 0.65rem; border: 1px solid #e2d9e6; background: #fffdfa; }
  .effective-summary span, .effective-summary strong { display: block; }
  .effective-summary span { color: #6a6170; font-size: 0.54rem; font-weight: 750; letter-spacing: 0.05em; text-transform: uppercase; }
  .effective-summary strong { margin-top: 0.25rem; overflow-wrap: anywhere; color: #5b4767; font-family: Georgia, "Times New Roman", serif; font-size: 1rem; font-weight: 400; }
  .effective-note { display: flex; gap: 0.6rem; margin-top: 0.8rem; padding: 0.65rem 0.75rem; border: 1px solid #e1cdb9; background: #fff7ee; color: #8d5e44; }
  .effective-note.conflict { border-color: #e7c5ba; background: #fff1ec; color: #a04d3f; }
  .effective-note span { flex: 0 0 auto; font-size: 1rem; }
  .effective-note p { margin: 0; font-size: 0.65rem; line-height: 1.45; }
  .effective-diagnostics { display: grid; gap: 0.45rem; margin-top: 0.75rem; }
  .effective-diagnostic { padding: 0.6rem 0.7rem; border-left: 2px solid #b87859; background: rgba(255, 253, 249, 0.72); color: #675c63; }
  .effective-diagnostic strong { display: block; color: #624d5f; font-size: 0.66rem; }
  .effective-diagnostic p { margin: 0.22rem 0 0; font-size: 0.61rem; line-height: 1.4; }
  .effective-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.55rem; margin-top: 0.85rem; }
  .effective-card { min-width: 0; padding: 0.72rem; border: 1px solid #e2d9e6; background: #fffdfa; }
  .effective-card.partial { border-color: #ead9cb; background: #fff8f1; }
  .effective-card.unavailable { border-color: #e7c5ba; background: #fff1ec; }
  .effective-card-topline { display: flex; justify-content: space-between; gap: 0.35rem; align-items: flex-start; }
  .effective-value { display: block; margin-top: 0.55rem; color: #5b4767; font-family: Georgia, "Times New Roman", serif; font-size: 1.18rem; font-weight: 400; letter-spacing: -0.04em; }
  .effective-card.partial .effective-value { color: #8f5b42; }
  .effective-card.unavailable .effective-value { color: #a04d3f; }
  .effective-status, .effective-evidence, .effective-baseline { display: block; color: #6e6571; font-size: 0.56rem; line-height: 1.4; }
  .effective-status { margin-top: 0.4rem; font-weight: 700; }
  .effective-evidence { margin-top: 0.2rem; }
  .effective-baseline { margin-top: 0.35rem; color: #6b5874; }
  .semantic-tag { display: inline-flex; padding: 0.17rem 0.28rem; border-radius: 2px; font-size: 0.5rem; font-weight: 750; }
  .semantic-tag.heuristic { background: #e9e1ef; color: #634d70; }
  .effective-explanation { margin-top: 0.65rem; padding-top: 0.45rem; border-top: 1px solid rgba(99, 77, 112, 0.13); }
  .effective-explanation summary, .effective-basis summary { color: #634d70; cursor: pointer; font-size: 0.59rem; font-weight: 750; }
  .effective-explanation-body { display: grid; grid-template-columns: 1.35fr 0.65fr; gap: 0.6rem; margin-top: 0.55rem; }
  .effective-explanation-body h5, .effective-limitations h5 { margin: 0 0 0.25rem; color: #735b7f; font-size: 0.56rem; }
  .effective-explanation-body p, .effective-explanation-body ul, .effective-limitations ul { margin: 0; color: #6b6570; font-size: 0.55rem; line-height: 1.42; }
  .effective-explanation-body ul, .effective-limitations ul { padding-left: 0.9rem; }
  .effective-explanation-body li { margin-bottom: 0.22rem; }
  .effective-explanation-body li strong, .effective-explanation-body li span { display: block; }
  .effective-explanation-body li strong { color: #604c6a; font-size: 0.56rem; }
  .effective-limitations { margin-top: 0.8rem; padding-top: 0.65rem; border-top: 1px solid rgba(99, 77, 112, 0.14); }
  .effective-empty { margin-top: 0.85rem; padding: 0.8rem; border: 1px dashed #d8cedd; color: #6b6570; font-size: 0.65rem; line-height: 1.45; }
  .effective-basis { margin-top: 0.8rem; padding-top: 0.65rem; border-top: 1px dashed rgba(99, 77, 112, 0.2); }
  .effective-basis > div { display: grid; grid-template-columns: 1fr auto; gap: 0.3rem 0.7rem; margin-top: 0.55rem; color: #6b6570; font-size: 0.58rem; }
  .effective-basis strong { color: #5b4767; font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.57rem; font-weight: 600; }
  @media (max-width: 720px) {
    .effective-panel { margin-left: 1rem; margin-right: 1rem; }
    .effective-heading { display: block; }
    .effective-outcome { margin-top: 0.65rem; }
    .effective-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 460px) {
    .effective-summary, .effective-grid { grid-template-columns: 1fr; }
    .effective-explanation-body { grid-template-columns: 1fr; }
  }
</style>
