<script lang="ts">
  import {
    browseReferenceFormulaDrafts,
    resolveReferenceFormulaDraft,
  } from '../lib/application/formula-workspace';
  import {
    listReferenceFamilyOptions,
    listReferenceModifierFilterGroups,
    type DatasetRecordSnapshot,
  } from '../lib/domain/dataset';
  import { REFERENCE_DATASET_REGISTRY } from '../data/reference/release';
  import { SOURCE_REGISTRY } from '../data/reference/sources';
  import { t, type Locale } from '../lib/i18n/messages';

  export let locale: Locale;
  export let activeReference: DatasetRecordSnapshot | null = null;
  export let localEdit = false;
  export let onBlankSelect: () => void = () => {};
  export let onReferenceSelect: (record: DatasetRecordSnapshot) => void = () => {};

  type StartMode = 'blank' | 'reference';
  let mode: StartMode = 'blank';
  let query = '';
  let familyFilter = '';
  let modifierFilters: Record<string, string> = {};
  let page = 1;
  const pageSize = 8;

  const familyOptions = listReferenceFamilyOptions(REFERENCE_DATASET_REGISTRY);
  const modifierFilterGroups = listReferenceModifierFilterGroups(REFERENCE_DATASET_REGISTRY);
  $: selectedModifierIds = Object.values(modifierFilters).filter((modifierId) => modifierId.length > 0);
  $: browseResult = browseReferenceFormulaDrafts({
    locale,
    query,
    familyId: familyFilter || undefined,
    modifierIds: selectedModifierIds,
    page,
    pageSize,
  });
  let selectionError = false;

  function selectBlank(): void {
    mode = 'blank';
    onBlankSelect();
  }

  function selectReferenceMode(): void {
    mode = 'reference';
    page = 1;
    selectionError = false;
  }

  function updateQuery(value: string): void {
    query = value;
    page = 1;
  }

  function updateFamily(value: string): void {
    familyFilter = value;
    page = 1;
  }

  function updateModifier(axisId: string, value: string): void {
    const next = { ...modifierFilters };
    if (value) next[axisId] = value;
    else delete next[axisId];
    modifierFilters = next;
    page = 1;
  }

  function clearFilters(): void {
    query = '';
    familyFilter = '';
    modifierFilters = {};
    page = 1;
  }

  function choose(recordId: string, releaseId: string): void {
    const resolved = resolveReferenceFormulaDraft(releaseId, recordId);
    if (resolved.record) {
      selectionError = false;
      onReferenceSelect(resolved.record);
    } else {
      selectionError = true;
    }
  }

  function familyLabel(familyId: string, localized?: { en: string; el: string }): string {
    if (localized && (localized.en !== familyId || localized.el !== familyId)) return localized[locale];
    const translated = t(locale, `reference.family.${familyId}`);
    return translated.startsWith('[missing-translation:') ? t(locale, 'reference.family.unknown') : translated;
  }

  function familyOptionLabel(option: { id: string; label: { en: string; el: string }; depth?: number; count?: number }): string {
    const indentation = '· '.repeat(option.depth ?? 0);
    const count = option.count ?? 0;
    return `${indentation}${familyLabel(option.id, option.label)} (${count})`;
  }

  function maturityLabel(maturity: string): string {
    return t(locale, `reference.maturity.${maturity}`);
  }

  function qualityLabel(quality: string): string {
    return t(locale, `reference.quality.${quality}`);
  }

  function sourceLabel(sourceId: string): string {
    return SOURCE_REGISTRY.sources.find((source) => source.sourceId === sourceId)?.citation[locale] ?? t(locale, 'reference.source.unknown');
  }

  function releaseLabel(releaseId: string): string {
    const translated = t(locale, `reference.release.${releaseId}`);
    return translated.startsWith('[missing-translation:') ? t(locale, 'reference.release.unknown') : translated;
  }
</script>

<section class="reference-start-panel panel" aria-labelledby="reference-start-title">
  <div class="reference-start-heading">
    <div>
      <span class="section-kicker">{t(locale, 'workspace.start.kicker')}</span>
      <h3 id="reference-start-title">{t(locale, 'workspace.start.title')}</h3>
    </div>
    <span class="reference-start-marker" aria-hidden="true">↳</span>
  </div>
  <p class="reference-start-intro">{t(locale, 'workspace.start.intro')}</p>

  <div class="start-mode-switcher" role="group" aria-label={t(locale, 'workspace.start.title')}>
    <button
      type="button"
      aria-pressed={mode === 'blank'}
      class:active={mode === 'blank'}
      on:click={selectBlank}
    >
      <strong>{t(locale, 'workspace.start.blank')}</strong>
      <span>{t(locale, 'workspace.start.blankHint')}</span>
    </button>
    <button
      type="button"
      aria-pressed={mode === 'reference'}
      class:active={mode === 'reference'}
      on:click={selectReferenceMode}
    >
      <strong>{t(locale, 'workspace.start.reference')}</strong>
      <span>{t(locale, 'workspace.start.referenceHint')}</span>
    </button>
  </div>

  {#if activeReference}
    <div class="active-reference" aria-live="polite">
      <div>
        <span class="active-reference-label">{t(locale, 'reference.selected')}</span>
        <strong>{activeReference.identity.label[locale]}</strong>
        <small>{t(locale, 'reference.localCopy')} · {releaseLabel(activeReference.releaseId)}</small>
      </div>
      <div class="active-reference-meta">
        <span>{activeReference.primary ? t(locale, 'reference.primary') : t(locale, 'reference.variant')}</span>
        <span>{activeReference.process ? t(locale, 'reference.processIncluded') : t(locale, 'reference.formulaOnly')}</span>
        <span>{t(locale, 'reference.source')}: {sourceLabel(activeReference.provenance.sourceId)}</span>
        <span>{t(locale, 'reference.maturity')}: {maturityLabel(activeReference.maturity)}</span>
        <span>{t(locale, 'reference.release')}: {releaseLabel(activeReference.releaseId)}</span>
        <span>{localEdit ? t(locale, 'reference.localEdit') : t(locale, 'reference.noLocalEdit')}</span>
      </div>
      <details class="active-reference-details">
        <summary>{t(locale, 'reference.technical')}</summary>
        <span>{t(locale, 'reference.source')}: {activeReference.provenance.sourceId}</span>
        <span>{t(locale, 'reference.release')}: {activeReference.releaseId}</span>
        <span>{t(locale, 'reference.familyId')}: {activeReference.identity.familyId}</span>
        <span>{t(locale, 'reference.record')}: {activeReference.recordId}</span>
      </details>
    </div>
  {/if}

  {#if mode === 'reference'}
    <div class="reference-browser">
      <div class="reference-browser-heading">
        <div>
          <span class="section-kicker">{t(locale, 'reference.kicker')}</span>
          <h4>{t(locale, 'reference.title')}</h4>
        </div>
        {#if browseResult.release}
          <span class="release-pill">{t(locale, 'reference.release')}: {releaseLabel(browseResult.release.releaseId)}</span>
        {/if}
      </div>
      <p class="reference-browser-intro">{t(locale, 'reference.intro')}</p>

      {#if browseResult.outcome === 'rejected'}
        <div class="reference-unavailable" role="status">
          <strong>{t(locale, 'reference.releaseUnavailable')}</strong>
          <p>{t(locale, 'reference.releaseUnavailableHint')}</p>
          <button type="button" class="small-button" on:click={selectBlank}>{t(locale, 'workspace.start.blank')}</button>
        </div>
      {:else}
        {#if selectionError}
          <div class="reference-selection-error" role="alert">
            <strong>{t(locale, 'reference.selectionError')}</strong>
            <p>{t(locale, 'reference.selectionErrorHint')}</p>
          </div>
        {/if}
        <div class="reference-filters">
          <label>
            <span>{t(locale, 'reference.search')}</span>
            <input
              type="search"
              value={query}
              placeholder={t(locale, 'reference.searchPlaceholder')}
              on:input={(event) => updateQuery((event.currentTarget as HTMLInputElement).value)}
            />
          </label>
          <label>
            <span>{t(locale, 'reference.family')}</span>
            <select value={familyFilter} on:change={(event) => updateFamily((event.currentTarget as HTMLSelectElement).value)}>
              <option value="">{t(locale, 'reference.allFamilies')}</option>
              {#each familyOptions as option (option.id)}
                <option value={option.id} disabled={option.selectable === false}>{familyOptionLabel(option)}</option>
              {/each}
            </select>
          </label>
        </div>

        <section class="reference-modifier-panel" aria-labelledby="reference-modifier-title">
          <div class="reference-modifier-heading">
            <span id="reference-modifier-title">{t(locale, 'reference.modifiers')}</span>
            <button
              type="button"
              class="reference-filter-clear"
              disabled={!query && !familyFilter && selectedModifierIds.length === 0}
              on:click={clearFilters}
            >
              {t(locale, 'reference.clearFilters')}
            </button>
          </div>
          <p id="reference-modifier-hint">{t(locale, 'reference.modifiersHint')}</p>
          <div class="reference-modifier-grid">
            {#each modifierFilterGroups as group (group.axisId)}
              <label>
                <span>{group.label[locale]}</span>
                <select
                  value={modifierFilters[group.axisId] ?? ''}
                  aria-describedby="reference-modifier-hint"
                  on:change={(event) => updateModifier(group.axisId, (event.currentTarget as HTMLSelectElement).value)}
                >
                  <option value="">{t(locale, 'reference.allModifierValues')}</option>
                  {#each group.options as option (option.id)}
                    <option value={option.id} disabled={option.selectable === false}>
                      {option.label[locale]} ({option.count ?? 0})
                    </option>
                  {/each}
                </select>
              </label>
            {/each}
          </div>
        </section>

        <div class="reference-results-heading">
          <h4>{t(locale, 'reference.results')}</h4>
          <span>{t(locale, browseResult.totalItems === 1 ? 'reference.resultCount.one' : 'reference.resultCount.other', { count: browseResult.totalItems })}</span>
        </div>

        {#if browseResult.items.length === 0}
          <div class="reference-empty" role="status">
            <strong>{query || familyFilter || selectedModifierIds.length > 0 ? t(locale, 'reference.noResults') : t(locale, 'reference.empty')}</strong>
            <p>{query || familyFilter || selectedModifierIds.length > 0 ? t(locale, 'reference.noResultsHint') : t(locale, 'reference.recovery')}</p>
          </div>
        {:else}
          <div class="reference-result-list">
            {#each browseResult.items as item, index (item.recordId)}
              {#if index === 0 || browseResult.items[index - 1].structuralFamilyId !== item.structuralFamilyId}
                <h5>{familyLabel(item.structuralFamilyId, item.structuralFamilyLabel)}</h5>
              {/if}
              {#if index === 0 || browseResult.items[index - 1].preparationKey !== item.preparationKey}
                <div class="reference-preparation-heading">
                  <span>{t(locale, 'reference.preparation')}</span>
                  <strong>{item.label[locale]}</strong>
                </div>
              {/if}
              <article class="reference-result-card">
                <div class="reference-result-topline">
                  <div>
                    <span class="reference-badge" class:primary={item.primary}>{item.primary ? t(locale, 'reference.primary') : t(locale, 'reference.variant')}</span>
                    <h6>{item.label[locale]}</h6>
                  </div>
                  <span class="reference-process-state">{item.processIncluded ? t(locale, 'reference.processIncluded') : t(locale, 'reference.formulaOnly')}</span>
                </div>
                <div class="reference-result-meta">
                  <span><strong>{t(locale, 'reference.source')}:</strong> {sourceLabel(item.sourceSummary.sourceId)}</span>
                  <span><strong>{t(locale, 'reference.sourceQuality')}:</strong> {qualityLabel(item.sourceSummary.quality)}</span>
                  <span><strong>{t(locale, 'reference.maturity')}:</strong> {maturityLabel(item.maturity)}</span>
                </div>
                <button type="button" class="reference-select-button" on:click={() => choose(item.recordId, item.releaseId)}>
                  {t(locale, 'reference.select')} <span aria-hidden="true">→</span>
                </button>
              </article>
            {/each}
          </div>
          <nav class="reference-pagination" aria-label={t(locale, 'reference.results')}>
            <button type="button" class="small-button" disabled={browseResult.page <= 1} on:click={() => (page -= 1)}>{t(locale, 'reference.previous')}</button>
            <span>{t(locale, 'reference.pageOf', { current: browseResult.page, total: browseResult.totalPages })}</span>
            <button type="button" class="small-button" disabled={browseResult.page >= browseResult.totalPages} on:click={() => (page += 1)}>{t(locale, 'reference.next')}</button>
          </nav>
        {/if}
      {/if}
    </div>
  {/if}
</section>

<style>
  .reference-start-panel { grid-column: 1 / -1; padding: clamp(1rem, 2vw, 1.6rem); border: 1px solid rgba(143, 80, 58, 0.28); background: rgba(255, 252, 247, 0.8); }
  .reference-start-heading, .reference-browser-heading, .reference-results-heading, .reference-pagination, .reference-result-topline { display: flex; align-items: end; justify-content: space-between; gap: 1rem; }
  .reference-start-heading h3, .reference-browser-heading h4, .reference-results-heading h4 { margin: 0.25rem 0 0; color: #29463a; font-family: Georgia, "Times New Roman", serif; font-weight: 400; }
  .reference-start-heading h3 { font-size: clamp(1.35rem, 2vw, 1.85rem); }
  .reference-browser-heading h4, .reference-results-heading h4 { font-size: 1.2rem; }
  .reference-start-marker { color: #a95b3e; font-size: 1.8rem; }
  .reference-start-intro, .reference-browser-intro { max-width: 800px; margin: 0.65rem 0 1rem; color: #59685f; font-size: 0.82rem; line-height: 1.6; }
  .start-mode-switcher { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6rem; }
  .start-mode-switcher button { display: flex; flex-direction: column; align-items: flex-start; gap: 0.25rem; padding: 0.85rem 1rem; border: 1px solid #d9d1c7; background: #fbf8f3; color: #304e42; text-align: left; }
  .start-mode-switcher button:hover, .start-mode-switcher button:focus-visible, .start-mode-switcher button.active { border-color: #ad6547; background: #fff5ea; }
  .start-mode-switcher strong { font-size: 0.82rem; }
  .start-mode-switcher span { color: #68776e; font-size: 0.73rem; line-height: 1.4; }
  .active-reference { display: flex; justify-content: space-between; gap: 1rem; margin-top: 0.75rem; padding: 0.85rem 1rem; border-left: 3px solid #3d7258; background: #edf6ed; }
  .active-reference > div:first-child { display: flex; flex-direction: column; gap: 0.15rem; }
  .active-reference-label, .active-reference-meta, .release-pill { color: #4e6b5d; font-size: 0.66rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .active-reference strong { color: #29463a; font-size: 0.92rem; }
  .active-reference small { color: #64756a; font-size: 0.7rem; }
  .active-reference-meta { display: flex; flex-direction: column; align-items: end; gap: 0.25rem; text-align: right; }
  .active-reference-details { display: flex; flex-direction: column; align-items: end; gap: 0.2rem; color: #6b756e; font-size: 0.63rem; }
  .active-reference-details summary { cursor: pointer; color: #51675a; font-weight: 700; }
  .active-reference-details span { font-family: "SFMono-Regular", Consolas, monospace; }
  .reference-browser { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e1d9cf; }
  .release-pill { padding: 0.45rem 0.6rem; border: 1px solid #d9c1ad; color: #8f503a; }
  .reference-filters { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 0.65rem; margin: 1rem 0 0.65rem; }
  .reference-filters label { display: flex; flex-direction: column; gap: 0.35rem; }
  .reference-filters label > span, .reference-results-heading span { color: #627067; font-size: 0.66rem; font-weight: 750; letter-spacing: 0.09em; text-transform: uppercase; }
  .reference-filters input, .reference-filters select { min-height: 2.35rem; padding: 0.55rem 0.65rem; border: 1px solid #d5cdc3; background: #fffdfa; color: #2c4a3e; }
  .reference-modifier-panel { margin: 0.65rem 0 1rem; padding: 0.8rem; border: 1px solid #e1d9cf; background: rgba(251, 248, 243, 0.72); }
  .reference-modifier-heading { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .reference-modifier-heading > span { color: #405d50; font-size: 0.68rem; font-weight: 750; letter-spacing: 0.09em; text-transform: uppercase; }
  .reference-filter-clear { padding: 0.25rem 0; border: 0; background: transparent; color: #8f503a; font-size: 0.7rem; font-weight: 750; }
  .reference-filter-clear:disabled { color: #a9aaa2; cursor: not-allowed; }
  .reference-modifier-panel > p { margin: 0.4rem 0 0.7rem; color: #68776e; font-size: 0.72rem; line-height: 1.5; }
  .reference-modifier-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.65rem; }
  .reference-modifier-grid label { display: flex; flex-direction: column; gap: 0.35rem; }
  .reference-modifier-grid label > span { color: #627067; font-size: 0.64rem; font-weight: 750; letter-spacing: 0.08em; text-transform: uppercase; }
  .reference-modifier-grid select { min-height: 2.25rem; padding: 0.5rem 0.6rem; border: 1px solid #d5cdc3; background: #fffdfa; color: #2c4a3e; }
  .reference-results-heading { align-items: baseline; margin: 1rem 0 0.65rem; }
  .reference-result-list { display: grid; gap: 0.6rem; }
  .reference-result-list h5 { margin: 0.5rem 0 0; color: #405d50; font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .reference-preparation-heading { display: flex; align-items: baseline; gap: 0.55rem; padding: 0.35rem 0.1rem 0; color: #6b756e; font-size: 0.68rem; }
  .reference-preparation-heading span { font-size: 0.59rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .reference-preparation-heading strong { color: #355447; font-family: Georgia, "Times New Roman", serif; font-size: 0.98rem; font-weight: 400; }
  .reference-result-card { padding: 0.85rem; border: 1px solid #ded6cd; background: #fffdfa; }
  .reference-result-topline { align-items: flex-start; }
  .reference-result-topline > div:first-child { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; }
  .reference-result-topline h6 { flex-basis: 100%; margin: 0.2rem 0 0; color: #29463a; font-family: Georgia, "Times New Roman", serif; font-size: 1.1rem; font-weight: 400; }
  .reference-badge { padding: 0.25rem 0.4rem; background: #f7ecdf; color: #895139; font-size: 0.62rem; font-weight: 760; }
  .reference-badge.primary { background: #e8f2e8; color: #2e644a; }
  .reference-process-state { max-width: 45%; color: #59685f; font-size: 0.68rem; line-height: 1.35; text-align: right; }
  .reference-result-meta { display: flex; flex-wrap: wrap; gap: 0.35rem 0.9rem; margin: 0.65rem 0; color: #637169; font-size: 0.7rem; }
  .reference-result-meta strong { color: #405449; }
  .reference-select-button { display: flex; justify-content: space-between; width: 100%; padding: 0.55rem 0; border: 0; border-top: 1px solid #e7dfd5; background: transparent; color: #8f503a; font-size: 0.74rem; font-weight: 760; text-align: left; }
  .reference-select-button:hover, .reference-select-button:focus-visible { color: #29463a; }
  .reference-pagination { align-items: center; margin-top: 0.8rem; }
  .reference-pagination > span { color: #64736a; font-size: 0.72rem; }
  .reference-unavailable, .reference-empty, .reference-selection-error { margin-top: 0.8rem; padding: 1rem; border: 1px solid #dfc6b2; background: #fff5ea; color: #704535; }
  .reference-unavailable p, .reference-empty p, .reference-selection-error p { margin: 0.4rem 0 0.8rem; color: #6d665f; font-size: 0.78rem; line-height: 1.5; }
  :global(button:focus-visible), :global(input:focus-visible), :global(select:focus-visible), :global(summary:focus-visible) { outline: 2px solid #b15f43; outline-offset: 2px; }
  @media (max-width: 680px) { .start-mode-switcher, .reference-filters, .reference-modifier-grid { grid-template-columns: 1fr; } .active-reference { flex-direction: column; } .active-reference-meta, .active-reference-details { align-items: flex-start; text-align: left; } .reference-result-topline { display: block; } .reference-process-state { max-width: none; margin-top: 0.55rem; text-align: left; } .reference-pagination { flex-wrap: wrap; } }
</style>
