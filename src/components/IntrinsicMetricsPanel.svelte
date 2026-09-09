<script lang="ts">
  import type { IntrinsicAnalysisResult, IntrinsicContribution, IntrinsicExclusion, IntrinsicMetric } from '../lib/domain/types';
  import { t, type Locale } from '../lib/i18n/messages';
  import FieldHelp from './FieldHelp.svelte';

  export let locale: Locale;
  export let analysis: IntrinsicAnalysisResult;

  function formatNumber(value: number): string {
    return new Intl.NumberFormat(locale === 'el' ? 'el-GR' : 'en-US', {
      maximumFractionDigits: 2,
    }).format(value);
  }

  function formatPercent(value: number): string {
    return formatNumber(value * 100) + '%';
  }

  function metricLabel(metric: IntrinsicMetric): string {
    return t(locale, 'intrinsic.metric.' + metric.key);
  }

  function metricHelp(metric: IntrinsicMetric): string {
    return t(locale, 'help.intrinsic.metric.' + metric.key);
  }

  function semanticLabel(metric: IntrinsicMetric): string {
    return t(locale, 'semantic.' + metric.semanticClass);
  }

  function statusLabel(metric: IntrinsicMetric): string {
    return t(locale, 'intrinsic.status.' + metric.status);
  }

  function metricValue(metric: IntrinsicMetric): string {
    if (metric.value === undefined) return '—';
    return formatNumber(metric.value) + ' ' + metric.unit;
  }

  function exclusionReason(item: IntrinsicExclusion): string {
    if (item.reasonCode === 'role_not_in_continuous_phase') return t(locale, 'intrinsic.reason.role');
    if (item.reasonCode === 'role_not_in_metric_family') return t(locale, 'intrinsic.reason.metricRole');
    if (item.reasonCode === 'not_flour_bearing') return t(locale, 'intrinsic.reason.notFlour');
    if (item.reasonCode === 'field_not_applicable') return t(locale, 'intrinsic.reason.notApplicable');
    return t(locale, 'intrinsic.reason.notUsed');
  }

  function contributionText(item: IntrinsicContribution): string {
    if (item.contribution === undefined) return item.sourceName;
    return item.sourceName + ' · ' + formatNumber(item.contribution) + ' g';
  }
</script>

<section class="intrinsic-panel" aria-labelledby="intrinsic-panel-title">
  <div class="intrinsic-heading">
    <div>
      <span class="intrinsic-kicker">{t(locale, 'section.composition')}</span>
      <h4 id="intrinsic-panel-title">{t(locale, 'intrinsic.title')}</h4>
      <p>{t(locale, 'intrinsic.intro')}</p>
    </div>
    <span class={'intrinsic-outcome ' + analysis.outcome}>
      <span class="status-dot"></span>
      {t(locale, 'intrinsic.outcome.' + analysis.outcome)}
    </span>
  </div>

  <div class="intrinsic-grid">
    {#each analysis.metrics as metric (metric.key)}
      <article class={'intrinsic-card ' + metric.semanticClass + ' ' + metric.status}>
        <div class="intrinsic-card-topline">
          <FieldHelp
            label={metricLabel(metric)}
            help={metricHelp(metric)}
            helpId={'help-intrinsic-metric-' + metric.key}
          />
          <span class={'semantic-tag ' + metric.semanticClass}>{semanticLabel(metric)}</span>
        </div>
        <strong class="intrinsic-value">{metricValue(metric)}</strong>
        {#if metric.relativeValue !== undefined}
          <span class="intrinsic-relative">{formatNumber(metric.relativeValue)}% {t(locale, 'intrinsic.metric.relativeToFlour')}</span>
        {/if}
        <span class="intrinsic-status">{statusLabel(metric)}</span>
        <span class="intrinsic-evidence">
          {t(locale, 'metric.coverage')}: {formatPercent(metric.coverage)} · {t(locale, 'metric.confidence')}: {formatPercent(metric.confidence)}
        </span>

        <details class="intrinsic-explanation">
          <summary>{t(locale, 'intrinsic.explain')}</summary>
          <div class="intrinsic-explanation-body">
            <div>
              <h5>{t(locale, 'intrinsic.contributors')}</h5>
              {#if metric.explanation.contributors.length > 0}
                <ul>
                  {#each metric.explanation.contributors as item (item.sourceId + '-' + item.sourceField)}
                    <li>{contributionText(item)}</li>
                  {/each}
                </ul>
              {:else}
                <p>{t(locale, 'intrinsic.noItems')}</p>
              {/if}
            </div>
            <div>
              <h5>{t(locale, 'intrinsic.exclusions')}</h5>
              {#if metric.explanation.exclusions.length > 0}
                <ul>
                  {#each metric.explanation.exclusions as item (item.sourceId + '-' + item.reasonCode)}
                    <li>{item.sourceName} · {exclusionReason(item)}</li>
                  {/each}
                </ul>
              {:else}
                <p>{t(locale, 'intrinsic.noItems')}</p>
              {/if}
            </div>
            <div>
              <h5>{t(locale, 'intrinsic.missing')}</h5>
              {#if metric.explanation.missingEvidence.length > 0}
                <p>{metric.explanation.missingEvidence.length} {t(locale, 'intrinsic.missing').toLowerCase()}</p>
              {:else}
                <p>{t(locale, 'intrinsic.noEvidence')}</p>
              {/if}
            </div>
            <div>
              <h5>{t(locale, 'intrinsic.parameters')}</h5>
              <p>{t(locale, 'intrinsic.versionedModel')}</p>
            </div>
          </div>
        </details>
      </article>
    {/each}
  </div>
</section>

<style>
  .intrinsic-panel { margin: 1.35rem 1.25rem 0; padding: 1rem; border: 1px solid #d7e2d5; background: #f5faf4; }
  .intrinsic-heading { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-start; padding-bottom: 0.85rem; border-bottom: 1px solid rgba(78, 110, 83, 0.16); }
  .intrinsic-kicker { color: #607866; font-size: 0.56rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
  .intrinsic-heading h4 { margin: 0.28rem 0 0; color: #345040; font-family: Georgia, "Times New Roman", serif; font-size: 1.18rem; font-weight: 400; letter-spacing: -0.03em; }
  .intrinsic-heading p { max-width: 42rem; margin: 0.4rem 0 0; color: #5c6d60; font-size: 0.68rem; line-height: 1.5; }
  .intrinsic-outcome { display: inline-flex; flex: 0 0 auto; gap: 0.35rem; align-items: center; color: #45634d; font-size: 0.62rem; font-weight: 750; text-align: right; }
  .intrinsic-outcome.partial { color: #8d5e44; }
  .intrinsic-outcome.rejected { color: #a04d3f; }
  .intrinsic-outcome .status-dot { background: currentColor; }
  .intrinsic-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.55rem; margin-top: 0.85rem; }
  .intrinsic-card { min-width: 0; padding: 0.72rem; border: 1px solid #dce7da; background: #fffdfa; }
  .intrinsic-card.partial, .intrinsic-card.unavailable { border-color: #ead9cb; background: #fff8f1; }
  .intrinsic-card.heuristic { border-color: #ddd2e4; background: #fbf8fc; }
  .intrinsic-card-topline { display: flex; justify-content: space-between; gap: 0.35rem; align-items: flex-start; }
  .intrinsic-card-label { color: #4f6555; font-size: 0.62rem; font-weight: 750; line-height: 1.3; }
  .intrinsic-value { display: block; margin-top: 0.55rem; color: #345443; font-family: Georgia, "Times New Roman", serif; font-size: 1.24rem; font-weight: 400; letter-spacing: -0.04em; }
  .intrinsic-card.partial .intrinsic-value, .intrinsic-card.unavailable .intrinsic-value { color: #8f5b42; }
  .intrinsic-card.heuristic .intrinsic-value { color: #634d70; }
  .intrinsic-relative, .intrinsic-status, .intrinsic-evidence { display: block; color: #647267; font-size: 0.56rem; line-height: 1.4; }
  .intrinsic-relative { margin-top: 0.15rem; color: #4e6a55; font-weight: 700; }
  .intrinsic-status { margin-top: 0.45rem; font-weight: 700; }
  .intrinsic-evidence { margin-top: 0.2rem; }
  .semantic-tag { display: inline-flex; padding: 0.17rem 0.28rem; border-radius: 2px; font-size: 0.5rem; font-weight: 750; }
  .semantic-tag.calculated { background: #dcebdd; color: #3f6048; }
  .semantic-tag.estimated { background: #f6e6d3; color: #765333; }
  .semantic-tag.heuristic { background: #e9e1ef; color: #634d70; }
  .intrinsic-explanation { margin-top: 0.65rem; padding-top: 0.45rem; border-top: 1px solid rgba(78, 110, 83, 0.13); }
  .intrinsic-explanation summary { color: #45634d; cursor: pointer; font-size: 0.59rem; font-weight: 750; }
  .intrinsic-explanation-body { display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem; margin-top: 0.55rem; }
  .intrinsic-explanation-body h5 { margin: 0 0 0.25rem; color: #5a725f; font-size: 0.56rem; }
  .intrinsic-explanation-body p, .intrinsic-explanation-body ul { margin: 0; color: #657167; font-size: 0.55rem; line-height: 1.4; }
  .intrinsic-explanation-body ul { padding-left: 0.9rem; }
  @media (max-width: 720px) {
    .intrinsic-panel { margin-left: 1rem; margin-right: 1rem; }
    .intrinsic-heading { display: block; }
    .intrinsic-outcome { margin-top: 0.65rem; }
    .intrinsic-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 460px) {
    .intrinsic-grid { grid-template-columns: 1fr; }
  }
</style>
