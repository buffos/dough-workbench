<script lang="ts">
  import { onMount } from 'svelte';
  import {
    COMPOSITION_FIELDS,
    INGREDIENT_ROLES,
    compositionFromCatalog,
    createInitialFormulaDraft,
    emptyComposition,
    knownDraftValue,
    noneDraftValue,
    unknownDraftValue,
  } from '../lib/domain/normalization';
  import { normalizeFormulaDraft } from '../lib/application/formula-workspace';
  import {
    STARTER_CATALOG,
    STARTER_CATALOG_VERSION,
    STARTER_FLOUR_CATALOG,
    STARTER_INGREDIENTS,
    catalogLabel,
  } from '../data/ingredients/starter-catalog';
  import type {
    CompositionField,
    DraftValueState,
    FormulaDraft,
    IngredientLineDraft,
    IngredientRole,
    NormalizationOutcome,
  } from '../lib/domain/types';
  import { localeHref, t, type Locale } from '../lib/i18n/messages';
  import { clearDraft, loadDraft, persistDraft } from '../lib/state/workspace';

  export let locale: Locale;
  export let basePath = '/';

  let draft: FormulaDraft = createInitialFormulaDraft();
  let result: NormalizationOutcome | null = null;
  let hydrated = false;
  let explanationOpen = false;

  $: if (hydrated) persistDraft(draft);

  onMount(() => {
    const savedDraft = loadDraft();
    if (savedDraft) {
      draft = savedDraft;
      result = normalizeFormulaDraft(savedDraft);
    }
    hydrated = true;
  });

  function touch(next: FormulaDraft): void {
    draft = { ...next, revision: next.revision + 1 };
    result = null;
    explanationOpen = false;
  }

  function createId(prefix: string): string {
    return `${prefix}-${Date.now()}-${draft.revision}`;
  }

  function updateFlour(id: string, patch: Partial<FormulaDraft['flourComponents'][number]>): void {
    touch({
      ...draft,
      flourComponents: draft.flourComponents.map((component) =>
        component.id === id ? { ...component, ...patch } : component,
      ),
    });
  }

  function updateLine(id: string, patch: Partial<IngredientLineDraft>): void {
    touch({
      ...draft,
      ingredientLines: draft.ingredientLines.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    });
  }

  function selectedFlourId(flour: FormulaDraft['flourComponents'][number]): string {
    if (flour.ingredientId) return flour.ingredientId;
    return STARTER_FLOUR_CATALOG.find((candidate) =>
      candidate.name === flour.name || candidate.label.en === flour.name || candidate.label.el === flour.name,
    )?.id ?? 'custom';
  }

  function selectedIngredientId(line: IngredientLineDraft): string {
    if (line.ingredientId) return line.ingredientId;
    return STARTER_INGREDIENTS.find((candidate) =>
      candidate.name === line.name || candidate.label.en === line.name || candidate.label.el === line.name,
    )?.id ?? 'custom';
  }

  function flourDisplayName(flour: FormulaDraft['flourComponents'][number]): string {
    const selected = STARTER_FLOUR_CATALOG.find((candidate) => candidate.id === selectedFlourId(flour));
    return selected ? catalogLabel(selected.label, locale) : flour.name;
  }

  function ingredientDisplayName(line: IngredientLineDraft): string {
    const selected = STARTER_CATALOG[selectedIngredientId(line)];
    return selected ? catalogLabel(selected.label, locale) : line.name;
  }

  function resultFlourDisplayName(id: string, fallback: string): string {
    const source = draft.flourComponents.find((candidate) => candidate.id === id);
    return source ? flourDisplayName(source) : fallback;
  }

  function resultIngredientDisplayName(id: string, fallback: string): string {
    const source = draft.ingredientLines.find((candidate) => candidate.id === id);
    return source ? ingredientDisplayName(source) : fallback;
  }

  function selectFlour(id: string, ingredientId: string): void {
    const flour = draft.flourComponents.find((candidate) => candidate.id === id);
    if (!flour) return;
    const selected = STARTER_FLOUR_CATALOG.find((candidate) => candidate.id === ingredientId);
    const wasCustom = selectedFlourId(flour) === 'custom';
    updateFlour(id, {
      ingredientId,
      name: selected
        ? selected.name
        : wasCustom
          ? flour.name
          : locale === 'el' ? 'Προσαρμοσμένο άλευρο' : 'Custom flour',
    });
  }

  function selectIngredient(id: string, ingredientId: string): void {
    const line = draft.ingredientLines.find((candidate) => candidate.id === id);
    if (!line) return;
    const selected = STARTER_CATALOG[ingredientId];
    const wasCustom = selectedIngredientId(line) === 'custom';
    updateLine(id, {
      ingredientId,
      name: selected
        ? selected.name
        : wasCustom
          ? line.name
          : locale === 'el' ? 'Προσαρμοσμένο υλικό' : 'Custom ingredient',
      composition: selected
        ? compositionFromCatalog(selected.composition, STARTER_CATALOG_VERSION, selected.id)
        : emptyComposition(),
    });
  }

  function updateCompositionState(lineId: string, field: CompositionField, nextState: string): void {
    const line = draft.ingredientLines.find((candidate) => candidate.id === lineId);
    if (!line) return;
    let nextValue: DraftValueState;
    if (nextState === 'known') {
      const current = line.composition[field];
      nextValue = current.state === 'known'
        ? current
        : knownDraftValue(0);
    } else if (nextState === 'none') {
      nextValue = noneDraftValue();
    } else {
      nextValue = unknownDraftValue();
    }
    updateLine(lineId, { composition: { ...line.composition, [field]: nextValue } });
  }

  function updateCompositionValue(lineId: string, field: CompositionField, value: string): void {
    const line = draft.ingredientLines.find((candidate) => candidate.id === lineId);
    if (!line || line.composition[field].state !== 'known') return;
    updateLine(lineId, {
      composition: {
        ...line.composition,
        [field]: { ...line.composition[field], value },
      },
    });
  }

  function addFlour(): void {
    touch({
      ...draft,
      flourComponents: [
        ...draft.flourComponents,
        {
          id: createId('flour'),
          ingredientId: 'custom',
          name: locale === 'el' ? 'Νέο άλευρο' : 'New flour',
          massGrams: '100',
          massUnit: 'g',
          flourBearing: true,
          declaredBlendPercentage: '',
        },
      ],
    });
  }

  function removeFlour(id: string): void {
    touch({ ...draft, flourComponents: draft.flourComponents.filter((component) => component.id !== id) });
  }

  function addIngredient(): void {
    touch({
      ...draft,
      ingredientLines: [
        ...draft.ingredientLines,
        {
          id: createId('line'),
          ingredientId: 'custom',
          name: locale === 'el' ? 'Νέο υλικό' : 'New ingredient',
          massGrams: '10',
          massUnit: 'g',
          role: 'other',
          composition: emptyComposition(),
        },
      ],
    });
  }

  function removeIngredient(id: string): void {
    touch({ ...draft, ingredientLines: draft.ingredientLines.filter((line) => line.id !== id) });
  }

  function runNormalization(): void {
    result = normalizeFormulaDraft(draft);
    explanationOpen = result.outcome !== 'rejected';
  }

  function resetDraft(): void {
    clearDraft();
    draft = createInitialFormulaDraft();
    result = null;
    explanationOpen = false;
    hydrated = true;
  }

  function formatNumber(value: number): string {
    return new Intl.NumberFormat(locale === 'el' ? 'el-GR' : 'en-US', {
      maximumFractionDigits: 2,
    }).format(value);
  }

  function formatPercent(value: number): string {
    return `${formatNumber(value * 100)}%`;
  }

  function stateLabel(state: DraftValueState | { state: string }): string {
    return t(locale, `state.${state.state}`);
  }

  function resultStatus(outcome: NormalizationOutcome['outcome']): string {
    return t(locale, `status.${outcome}`);
  }

  function readinessLabel(readiness: NormalizationOutcome['readiness']): string {
    return t(locale, `status.${readiness}`);
  }

  function provenanceLabel(kind: string): string {
    return t(locale, `provenance.${kind}`);
  }

  function diagnosticMessage(key: string, parameters: Record<string, string | number>): string {
    return t(locale, key, parameters);
  }
</script>

<svelte:head>
  <title>{locale === 'el' ? 'Dough Formula Intelligence — Φόρμουλα' : 'Dough Formula Intelligence — Formula'}</title>
  <meta
    name="description"
    content={locale === 'el'
      ? 'Δίγλωσσο εργαλείο για να εξερευνήσεις τη δομή και τις αναλογίες μιας ζύμης ή ενός batter.'
      : 'Explore the structure and ratios behind a dough or batter formula.'}
  />
</svelte:head>

<div class="app-shell">
  <header class="topbar">
    <a class="brand" href={localeHref(basePath, locale)} aria-label="Dough Formula Intelligence">
      <span class="brand-mark" aria-hidden="true">D/F</span>
      <span class="brand-copy">
        <span class="brand-eyebrow">{t(locale, 'brand.eyebrow')}</span>
        <span class="brand-name">Dough Formula<br />Intelligence</span>
      </span>
    </a>
    <nav class="topnav" aria-label={t(locale, 'nav.languageLabel')}>
      <span class="nav-current">{t(locale, 'nav.workspace')}</span>
      <a class="help-link" href={`${localeHref(basePath, locale)}help/`}>{t(locale, 'nav.help')}</a>
      <span class="nav-divider" aria-hidden="true"></span>
      <a class="language-link" href={localeHref(basePath, locale === 'en' ? 'el' : 'en')}>
        <span class="language-dot" aria-hidden="true"></span>
        {t(locale, 'nav.language')}
      </a>
    </nav>
  </header>

  <main>
    <section class="hero-section">
      <div class="hero-kicker"><span class="kicker-line"></span>{t(locale, 'workspace.kicker')}</div>
      <div class="hero-copy">
        <h1>{t(locale, 'brand.title')}</h1>
        <p>{t(locale, 'brand.subtitle')}</p>
      </div>
      <div class="hero-index" aria-hidden="true">
        <span>01</span>
        <span class="hero-index-rule"></span>
        <span>DFI</span>
      </div>
    </section>

    <section class="workspace-heading">
      <div>
        <p class="section-kicker">{t(locale, 'nav.workspace')}</p>
        <h2>{t(locale, 'workspace.title')}</h2>
        <p class="workspace-description">{t(locale, 'workspace.description')}</p>
      </div>
      <div class="draft-meta">
        <button type="button" class="text-button" on:click={resetDraft}>{t(locale, 'action.startOver')}</button>
      </div>
    </section>

    <div class="workspace-grid">
      <section class="editor-panel panel">
        <div class="panel-heading">
          <div>
            <span class="panel-number">01</span>
            <h3>{t(locale, 'workspace.title')}</h3>
          </div>
          <span class="draft-status"><span class="status-dot"></span>{t(locale, 'status.editing')}</span>
        </div>

        <div class="editor-section">
          <div class="subheading-row">
            <div>
              <span class="section-index">A</span>
              <h4>{t(locale, 'section.flours')}</h4>
            </div>
            <button type="button" class="small-button" on:click={addFlour}>+ {t(locale, 'action.addFlour')}</button>
          </div>
          <p class="section-help">{t(locale, 'section.flourHelp')}</p>

          <div class="line-list">
            {#each draft.flourComponents as flour, index (flour.id)}
              <div class="input-row flour-row">
                <span class="row-index">{String(index + 1).padStart(2, '0')}</span>
                <label class="field field-name">
                  <span>{t(locale, 'field.flour')}</span>
                  <select
                    aria-label={`${t(locale, 'field.flour')} ${index + 1}`}
                    value={selectedFlourId(flour)}
                    on:change={(event) => selectFlour(flour.id, (event.currentTarget as HTMLSelectElement).value)}
                  >
                    <option value="custom">{t(locale, 'catalog.customFlour')}</option>
                    {#each STARTER_FLOUR_CATALOG as option (option.id)}
                      <option value={option.id}>{catalogLabel(option.label, locale)}</option>
                    {/each}
                  </select>
                  {#if selectedFlourId(flour) === 'custom'}
                    <input
                      class="custom-name-input"
                      aria-label={`${t(locale, 'catalog.customFlour')} ${index + 1}`}
                      value={flour.name}
                      on:input={(event) => updateFlour(flour.id, { name: (event.currentTarget as HTMLInputElement).value })}
                    />
                  {/if}
                </label>
                <label class="field field-mass">
                  <span>{t(locale, 'field.mass')} <em>({t(locale, 'unit.grams')})</em></span>
                  <input
                    class="mass-input"
                    aria-label={`${t(locale, 'field.mass')} ${flourDisplayName(flour)}`}
                    inputmode="decimal"
                    value={flour.massGrams}
                    on:input={(event) => updateFlour(flour.id, { massGrams: (event.currentTarget as HTMLInputElement).value })}
                  />
                </label>
                <label class="field field-blend">
                  <span>{t(locale, 'field.blend')}</span>
                  <input
                    aria-label={`${t(locale, 'field.blend')} ${flourDisplayName(flour)}`}
                    inputmode="decimal"
                    placeholder="—"
                    value={flour.declaredBlendPercentage}
                    on:input={(event) => updateFlour(flour.id, { declaredBlendPercentage: (event.currentTarget as HTMLInputElement).value })}
                  />
                </label>
                <button
                  type="button"
                  class="remove-button"
                  aria-label={`${t(locale, 'action.remove')} ${flourDisplayName(flour)}`}
                  on:click={() => removeFlour(flour.id)}
                >×</button>
              </div>
            {/each}
          </div>
          <p class="micro-note"><span class="micro-icon">i</span>{t(locale, 'result.policyBody')}</p>
        </div>

        <div class="editor-section ingredient-section">
          <div class="subheading-row">
            <div>
              <span class="section-index">B</span>
              <h4>{t(locale, 'section.ingredients')}</h4>
            </div>
            <button type="button" class="small-button" on:click={addIngredient}>+ {t(locale, 'action.addIngredient')}</button>
          </div>
          <p class="section-help">{t(locale, 'section.ingredientHelp')}</p>

          <details class="role-guide">
            <summary>{t(locale, 'role.guideTitle')}</summary>
            <p>{t(locale, 'role.guideIntro')}</p>
            <ul>
              {#each INGREDIENT_ROLES as role (role)}
                <li><strong>{t(locale, `role.${role}`)}</strong><span>{t(locale, `role.description.${role}`)}</span></li>
              {/each}
            </ul>
          </details>

          <div class="ingredient-list">
            {#each draft.ingredientLines as line, index (line.id)}
              <article class="ingredient-card">
                <div class="ingredient-card-head">
                  <span class="row-index">{String(index + 1).padStart(2, '0')}</span>
                  <label class="field field-name">
                    <span>{t(locale, 'field.ingredient')}</span>
                    <select
                      aria-label={`${t(locale, 'field.ingredient')} ${index + 1}`}
                      value={selectedIngredientId(line)}
                      on:change={(event) => selectIngredient(line.id, (event.currentTarget as HTMLSelectElement).value)}
                    >
                      <option value="custom">{t(locale, 'catalog.customIngredient')}</option>
                      {#each STARTER_INGREDIENTS as option (option.id)}
                        <option value={option.id}>{catalogLabel(option.label, locale)}</option>
                      {/each}
                    </select>
                    {#if selectedIngredientId(line) === 'custom'}
                      <input
                        class="custom-name-input"
                        aria-label={`${t(locale, 'catalog.customIngredient')} ${index + 1}`}
                        value={line.name}
                        on:input={(event) => updateLine(line.id, { name: (event.currentTarget as HTMLInputElement).value })}
                      />
                    {/if}
                  </label>
                  <label class="field field-mass">
                    <span>{t(locale, 'field.mass')} <em>({t(locale, 'unit.grams')})</em></span>
                    <input
                      class="mass-input"
                      aria-label={`${t(locale, 'field.mass')} ${ingredientDisplayName(line)}`}
                      inputmode="decimal"
                      value={line.massGrams}
                      on:input={(event) => updateLine(line.id, { massGrams: (event.currentTarget as HTMLInputElement).value })}
                    />
                  </label>
                  <label class="field field-role">
                    <span>{t(locale, 'field.role')}</span>
                    <select
                      aria-label={`${t(locale, 'field.role')} ${ingredientDisplayName(line)}`}
                      value={line.role}
                      on:change={(event) => updateLine(line.id, { role: (event.currentTarget as HTMLSelectElement).value as IngredientRole })}
                    >
                      {#each INGREDIENT_ROLES as role (role)}
                        <option value={role}>{t(locale, `role.${role}`)}</option>
                      {/each}
                    </select>
                  </label>
                  <button
                    type="button"
                    class="remove-button"
                    aria-label={`${t(locale, 'action.remove')} ${ingredientDisplayName(line)}`}
                    on:click={() => removeIngredient(line.id)}
                  >×</button>
                </div>

                <div class="composition-block">
                  <div class="composition-heading">
                    <span>{t(locale, 'section.composition')}</span>
                    <span class="composition-note">{t(locale, 'state.zeroHint')}</span>
                  </div>
                  <div class="composition-grid">
                    {#each COMPOSITION_FIELDS as field (field)}
                      <div class="composition-field">
                        <span class="composition-label">{t(locale, `field.${field}`)}</span>
                        <select
                          aria-label={`${t(locale, `field.${field}`)} ${t(locale, 'field.state')}`}
                          value={line.composition[field].state}
                          on:change={(event) => updateCompositionState(line.id, field, (event.currentTarget as HTMLSelectElement).value)}
                        >
                          <option value="unknown">{t(locale, 'state.unknown')}</option>
                          <option value="none">{t(locale, 'state.none')}</option>
                          <option value="known">{t(locale, 'state.known')}</option>
                        </select>
                        {#if line.composition[field].state === 'known'}
                          <label class="composition-value">
                            <span class="sr-only">{t(locale, 'field.value')}</span>
                            <input
                              aria-label={`${t(locale, `field.${field}`)} ${t(locale, 'field.value')}`}
                              inputmode="decimal"
                              value={line.composition[field].state === 'known' ? line.composition[field].value : ''}
                              on:input={(event) => updateCompositionValue(line.id, field, (event.currentTarget as HTMLInputElement).value)}
                            />
                            <span>%</span>
                          </label>
                        {/if}
                      </div>
                    {/each}
                  </div>
                </div>
              </article>
            {/each}
          </div>
        </div>

        <div class="editor-footer">
          <div class="unit-lock"><span class="lock-mark">↳</span><span>{t(locale, 'formula.validation.useGrams')}</span></div>
          <button type="button" class="primary-button" on:click={runNormalization}>
            <span>{t(locale, 'action.normalize')}</span><span class="button-arrow">→</span>
          </button>
        </div>
      </section>

      <section class="result-panel panel">
        <div class="panel-heading result-heading">
          <div>
            <span class="panel-number">02</span>
            <h3>{t(locale, 'section.results')}</h3>
          </div>
          {#if result}
            <span class={`result-status ${result.outcome}`}><span class="status-dot"></span>{resultStatus(result.outcome)}</span>
          {:else}
            <span class="result-status idle"><span class="status-dot"></span>{t(locale, 'status.editing')}</span>
          {/if}
        </div>

        {#if !result}
          <div class="empty-result">
            <div class="empty-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
            <h4>{t(locale, 'result.emptyTitle')}</h4>
            <p>{t(locale, 'result.emptyBody')}</p>
          </div>
        {:else}
          <div class={`outcome-banner ${result.outcome}`}>
            <div class="outcome-icon">{result.outcome === 'rejected' ? '!' : result.outcome === 'partial' ? '◐' : '✓'}</div>
            <div>
              <strong>{resultStatus(result.outcome)}</strong>
              <span>{readinessLabel(result.readiness)}</span>
            </div>
          </div>

          {#if result.diagnostics.length > 0}
            <div class="diagnostic-list" aria-live="polite">
              {#each result.diagnostics as diagnostic (`${diagnostic.code}-${diagnostic.path}`)}
                <div class={`diagnostic ${diagnostic.severity}`}>
                  <div class="diagnostic-topline">
                    <strong>{diagnosticMessage(diagnostic.messageKey, diagnostic.parameters)}</strong>
                    <code>{diagnostic.code}</code>
                  </div>
                  <p>{diagnosticMessage(diagnostic.resolutionKey, diagnostic.parameters)}</p>
                  <span class="diagnostic-path">{diagnostic.path}</span>
                </div>
              {/each}
            </div>
          {/if}

          {#if result.data}
            {#if result.outcome === 'partial'}
              <div class="partial-note"><span>◐</span><p>{t(locale, 'result.partialBody')}</p></div>
            {/if}

            <div class="metric-grid">
              <div class="metric-card metric-featured">
                <span class="metric-label">{t(locale, 'metric.denominator')}</span>
                <strong>{formatNumber(result.data.structuralFlourDenominator.value)}<small> g</small></strong>
                <span class="metric-foot"><span class="semantic-tag calculated">{t(locale, 'semantic.calculated')}</span></span>
              </div>
              <div class="metric-card">
                <span class="metric-label">{t(locale, 'metric.coverage')}</span>
                <strong>{formatPercent(result.coverage)}</strong>
                <span class="metric-foot">{t(locale, 'metric.available')}</span>
              </div>
              <div class="metric-card">
                <span class="metric-label">{t(locale, 'metric.confidence')}</span>
                <strong>{formatPercent(result.confidence)}</strong>
                <span class="metric-foot">{t(locale, 'result.provenance')}</span>
              </div>
            </div>

            <div class="result-block">
              <div class="result-block-heading"><h4>{t(locale, 'section.flours')}</h4><span>{t(locale, 'metric.blend')}</span></div>
              <div class="data-table">
                <div class="table-row table-head"><span>{t(locale, 'field.name')}</span><span>{t(locale, 'field.mass')}</span><span>{t(locale, 'metric.blend')}</span><span>{t(locale, 'metric.semantic')}</span></div>
                {#each result.data.flourComponents as flour (flour.id)}
                  <div class="table-row"><span class="table-name">{resultFlourDisplayName(flour.id, flour.name)}</span><span>{formatNumber(flour.mass.value)} g</span><span>{formatNumber(flour.blendFraction.value)}%</span><span><span class="semantic-tag calculated">{t(locale, 'semantic.calculated')}</span></span></div>
                {/each}
              </div>
            </div>

            <div class="result-block">
              <div class="result-block-heading"><h4>{t(locale, 'section.ingredients')}</h4><span>{t(locale, 'metric.bakers')}</span></div>
              <div class="data-table">
                <div class="table-row table-head"><span>{t(locale, 'field.name')}</span><span>{t(locale, 'field.role')}</span><span>{t(locale, 'field.mass')}</span><span>{t(locale, 'metric.bakers')}</span></div>
                {#each result.data.ingredientLines as line (line.id)}
                  <div class="table-row ingredient-result-row">
                    <span class="table-name">{resultIngredientDisplayName(line.id, line.name)}<small>{#each COMPOSITION_FIELDS as field (field)}<span class={`state-mini ${line.composition[field].state}`}>{t(locale, `field.${field}`)} · {stateLabel(line.composition[field])}</span>{/each}</small></span>
                    <span>{t(locale, `role.${line.role}`)}</span><span>{formatNumber(line.mass.value)} g</span><span>{formatNumber(line.bakersPercentage.value)}%</span>
                  </div>
                {/each}
              </div>
            </div>

            <div class="result-block metrics-block">
              <div class="result-block-heading"><h4>{t(locale, 'section.composition')}</h4><span>{t(locale, 'metric.semantic')}</span></div>
              <div class="composition-metrics">
                {#each COMPOSITION_FIELDS as field (field)}
                  {@const metric = result.data.compositionMetrics[field]}
                  <div class="composition-metric-card" class:unavailable={!metric.available}>
                    <span>{t(locale, `field.${field}`)}</span>
                    {#if metric.available}<strong>{formatNumber(metric.value ?? 0)} g</strong>{:else}<strong>—</strong>{/if}
                    <small>{metric.available ? t(locale, 'semantic.calculated') : t(locale, 'result.metricUnavailable')}</small>
                  </div>
                {/each}
              </div>
            </div>

            <div class="policy-strip"><span>{t(locale, 'result.policy')}</span><strong>{t(locale, 'result.policyBody')}</strong></div>

            <button type="button" class="explanation-toggle" on:click={() => (explanationOpen = !explanationOpen)}>
              <span>{explanationOpen ? t(locale, 'action.hideExplanation') : t(locale, 'action.explain')}</span><span>{explanationOpen ? '−' : '+'}</span>
            </button>

            {#if explanationOpen}
              <div class="explanation-card">
                <p class="explanation-intro">{t(locale, 'explanation.calculatedBody')}</p>
                <div class="explanation-columns">
                   <div><h5>{t(locale, 'explanation.denominator')}</h5>{#if result.explanation.denominatorBasis.length > 0}<ul>{#each result.explanation.denominatorBasis as item (item)}<li>{item}</li>{/each}</ul>{:else}<p>{t(locale, 'explanation.none')}</p>{/if}</div>
                   <div><h5>{t(locale, 'explanation.excluded')}</h5>{#if result.explanation.excludedComponents.length > 0}<ul>{#each result.explanation.excludedComponents as item (item)}<li>{item}</li>{/each}</ul>{:else}<p>{t(locale, 'explanation.none')}</p>{/if}</div>
                </div>
                <div class="explanation-columns">
                   <div><h5>{t(locale, 'explanation.unknown')}</h5>{#if result.explanation.unknownFields.length > 0}<ul>{#each result.explanation.unknownFields as item (item.path)}<li><strong>{item.label}</strong><span>{item.reasonCode}</span></li>{/each}</ul>{:else}<p>{t(locale, 'explanation.none')}</p>{/if}</div>
                   <div><h5>{t(locale, 'explanation.limitations')}</h5>{#if result.explanation.limitations.length > 0}<ul>{#each result.explanation.limitations as item (item)}<li>{item}</li>{/each}</ul>{:else}<p>{t(locale, 'explanation.none')}</p>{/if}</div>
                </div>
                <div class="provenance-line"><span>{t(locale, 'result.provenance')}</span><strong>{provenanceLabel(result.explanation.provenance.kind)}</strong><span>{t(locale, 'result.sourceDerived')}</span></div>
              </div>
            {/if}
          {:else}
            <div class="correction-callout"><strong>{t(locale, 'action.tryAgain')}</strong><p>{t(locale, 'formula.validation.correctMass')}</p></div>
          {/if}
        {/if}
      </section>
    </div>
  </main>

  <footer class="site-footer"><span>© 2026 DFI</span><span>{t(locale, 'footer.note')}</span></footer>
</div>

<style>
  :global(html) { background: #f5f1eb; }
  :global(body) { margin: 0; background: #f5f1eb; color: #242c29; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  :global(*) { box-sizing: border-box; }
  :global(button), :global(input), :global(select) { font: inherit; }
  :global(button), :global(a) { -webkit-tap-highlight-color: transparent; }
  :global(button) { cursor: pointer; }
  .app-shell { min-height: 100vh; background: radial-gradient(circle at 82% 9%, rgba(222, 161, 112, 0.17), transparent 26rem), #f5f1eb; }
  .topbar { height: 76px; padding: 0 clamp(1.25rem, 5vw, 5.6rem); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(42, 50, 45, 0.13); }
  .brand { display: inline-flex; align-items: center; gap: 0.7rem; color: inherit; text-decoration: none; }
  .brand-mark { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid #b87957; border-radius: 50%; color: #914d38; font-size: 0.58rem; font-weight: 800; letter-spacing: -0.05em; }
  .brand-copy { display: flex; flex-direction: column; gap: 0.15rem; }
  .brand-eyebrow, .section-kicker, .hero-kicker, .panel-number, .metric-label, .field span, .composition-label, .policy-strip, .site-footer, .draft-meta span, .result-block-heading span { font-size: 0.66rem; letter-spacing: 0.15em; text-transform: uppercase; }
  .brand-eyebrow { color: #7b4f3f; font-weight: 760; }
  .brand-name { font-size: 0.86rem; line-height: 0.92; font-weight: 740; letter-spacing: -0.03em; }
  .topnav { display: flex; gap: 0.9rem; align-items: center; font-size: 0.78rem; }
  .nav-current { color: #5f6c64; }
  .nav-divider { width: 1px; height: 16px; background: rgba(42, 50, 45, 0.18); }
  .help-link { color: #34483e; font-weight: 700; text-decoration: none; }
  .help-link:hover { color: #a24e37; }
  .language-link { display: inline-flex; gap: 0.45rem; align-items: center; color: #34483e; font-weight: 700; text-decoration: none; }
  .language-link:hover { color: #a24e37; }
  .language-dot, .status-dot { width: 6px; height: 6px; display: inline-block; background: #cc7853; border-radius: 50%; }
  main { width: min(1600px, calc(100% - 2rem)); margin: 0 auto; }
  .hero-section { min-height: 300px; padding: clamp(3rem, 8vw, 7rem) 0 3.6rem; display: grid; grid-template-columns: 1fr auto; align-items: end; position: relative; }
  .hero-kicker { display: flex; gap: 0.7rem; align-items: center; color: #8b4f3b; font-weight: 760; }
  .kicker-line { width: 36px; height: 1px; background: #c77954; }
  .hero-copy { max-width: 720px; grid-column: 1; }
  .hero-copy h1 { max-width: 690px; margin: 1.1rem 0 1rem; color: #263d34; font-family: Georgia, "Times New Roman", serif; font-size: clamp(3.2rem, 7vw, 7.8rem); font-weight: 400; line-height: 0.9; letter-spacing: -0.065em; }
  .hero-copy p { max-width: 560px; margin: 0; color: #58665d; font-size: 0.97rem; line-height: 1.65; }
  .hero-index { grid-column: 2; display: flex; align-items: center; gap: 0.65rem; padding-bottom: 0.35rem; color: #68736b; font-size: 0.68rem; letter-spacing: 0.12em; }
  .hero-index-rule { width: 52px; height: 1px; background: #bdc1b9; }
  .workspace-heading { padding: 1.5rem 0 1.25rem; display: flex; justify-content: space-between; gap: 2rem; align-items: end; border-top: 1px solid rgba(42, 50, 45, 0.16); }
  .section-kicker { margin: 0 0 0.55rem; color: #8b4f3b; font-weight: 800; }
  .workspace-heading h2 { margin: 0; color: #273f35; font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.8rem, 3.5vw, 3rem); font-weight: 400; letter-spacing: -0.05em; }
  .workspace-description { max-width: 600px; margin: 0.5rem 0 0; color: #5f6c64; font-size: 0.82rem; line-height: 1.6; }
  .draft-meta { display: flex; align-items: end; gap: 1.25rem; color: #7c827b; }
  .draft-meta div { display: flex; flex-direction: column; gap: 0.25rem; }
  .draft-meta strong { color: #334a40; font-size: 0.76rem; font-weight: 700; }
  .text-button { padding: 0 0 0.1rem; border: 0; border-bottom: 1px solid #b97558; background: transparent; color: #8f503a; font-size: 0.72rem; font-weight: 700; }
  .workspace-grid { display: grid; grid-template-columns: minmax(0, 1.03fr) minmax(0, 0.97fr); gap: 1rem; align-items: start; }
  .panel { background: rgba(255, 253, 249, 0.83); border: 1px solid rgba(65, 75, 67, 0.14); box-shadow: 0 18px 50px rgba(78, 65, 51, 0.045); }
  .panel-heading { min-height: 82px; padding: 1.25rem 1.35rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(65, 75, 67, 0.11); }
  .panel-heading > div { display: flex; align-items: center; gap: 0.8rem; }
  .panel-number { color: #9b5c42; font-weight: 800; }
  .panel-heading h3 { margin: 0; color: #2c453a; font-family: Georgia, "Times New Roman", serif; font-size: 1.25rem; font-weight: 400; letter-spacing: -0.03em; }
  .draft-status, .result-status { display: inline-flex; gap: 0.45rem; align-items: center; color: #5f6c64; font-size: 0.68rem; font-weight: 700; }
  .result-status.completed .status-dot, .result-status.partial .status-dot { background: #75936d; }
  .result-status.rejected .status-dot { background: #bc5e48; }
  .editor-section { padding: 1.35rem; border-bottom: 1px solid rgba(65, 75, 67, 0.11); }
  .subheading-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
  .subheading-row > div { display: flex; gap: 0.65rem; align-items: baseline; }
  .section-index { color: #9b5c42; font-family: Georgia, "Times New Roman", serif; font-size: 1rem; }
  .subheading-row h4, .result-block-heading h4 { margin: 0; color: #2f473c; font-family: Georgia, "Times New Roman", serif; font-size: 1.1rem; font-weight: 400; letter-spacing: -0.025em; }
  .small-button { padding: 0.4rem 0.65rem; border: 1px solid rgba(135, 81, 61, 0.48); background: transparent; color: #87513d; font-size: 0.7rem; font-weight: 750; }
  .small-button:hover { background: #fff7f0; border-color: #9b5c42; }
  .section-help { margin: 0.55rem 0 1.1rem 1.65rem; max-width: 550px; color: #58665d; font-size: 0.73rem; line-height: 1.5; }
  .line-list { display: flex; flex-direction: column; gap: 0.55rem; }
  .input-row { display: grid; grid-template-columns: 2rem minmax(0, 1fr) 6rem 6.7rem 1.25rem; gap: 0.6rem; align-items: end; padding: 0.65rem; background: #fbf8f3; border: 1px solid rgba(65, 75, 67, 0.16); }
  .row-index { align-self: center; color: #6d6d66; font-family: Georgia, "Times New Roman", serif; font-size: 0.9rem; }
  .field { min-width: 0; display: flex; flex-direction: column; gap: 0.3rem; }
  .field span { color: #5d6a61; font-size: 0.58rem; letter-spacing: 0.1em; font-weight: 700; }
  .field em { color: #5d6a61; font-style: normal; letter-spacing: 0; text-transform: none; }
  .field input, .field select, .composition-field select, .composition-value input { width: 100%; min-width: 0; height: 2.2rem; padding: 0 0.55rem; border: 1px solid #deddd6; border-radius: 0; outline: 0; background: #fffdfa; color: #33463d; font-size: 0.78rem; }
  .custom-name-input { margin-top: 0.05rem; }
  .field input:focus, .field select:focus, .composition-field select:focus, .composition-value input:focus { border-color: #b87859; box-shadow: 0 0 0 2px rgba(184, 120, 89, 0.12); }
  .mass-input { font-variant-numeric: tabular-nums; }
  .remove-button { width: 1.25rem; height: 2.2rem; padding: 0; border: 0; background: transparent; color: #647067; font-size: 1.2rem; line-height: 1; }
  .remove-button:hover { color: #b75f47; }
  .micro-note { margin: 0.85rem 0 0; color: #5f6a62; font-size: 0.67rem; line-height: 1.5; }
  .micro-icon { display: inline-grid; place-items: center; width: 14px; height: 14px; margin-right: 0.25rem; border: 1px solid #b38b75; border-radius: 50%; color: #8d573e; font-size: 0.57rem; font-weight: 800; }
  code { font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.9em; }
  .ingredient-section { padding-bottom: 1.5rem; }
  .role-guide { margin: 0 0 1rem 1.65rem; border: 1px solid rgba(65, 75, 67, 0.11); background: #fbf8f3; color: #58665d; font-size: 0.68rem; }
  .role-guide summary { padding: 0.65rem 0.75rem; color: #52695a; cursor: pointer; font-weight: 750; }
  .role-guide p { margin: 0; padding: 0 0.75rem 0.55rem; line-height: 1.5; }
  .role-guide ul { margin: 0; padding: 0 0.75rem 0.75rem 1.8rem; display: grid; gap: 0.45rem; }
  .role-guide li { padding-left: 0.15rem; line-height: 1.4; }
  .role-guide li strong, .role-guide li span { display: block; }
  .role-guide li strong { color: #536b5a; font-size: 0.64rem; }
  .role-guide li span { color: #5e6d62; }
  .ingredient-list { display: flex; flex-direction: column; gap: 0.7rem; }
  .ingredient-card { padding: 0.75rem; background: #fbf8f3; border: 1px solid rgba(65, 75, 67, 0.1); }
  .ingredient-card-head { display: grid; grid-template-columns: 2rem minmax(0, 1fr) 6rem minmax(9rem, 0.75fr) 1.25rem; gap: 0.6rem; align-items: end; }
  .composition-block { margin: 1rem 0 0 2.6rem; padding-top: 0.8rem; border-top: 1px dashed rgba(65, 75, 67, 0.15); }
  .composition-heading { display: flex; justify-content: space-between; gap: 1rem; align-items: baseline; margin-bottom: 0.55rem; color: #657168; font-size: 0.68rem; font-weight: 750; }
  .composition-note { color: #6f6258; font-size: 0.6rem; font-weight: 500; }
  .composition-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.45rem; }
  .composition-field { min-width: 0; display: flex; flex-direction: column; gap: 0.3rem; }
  .composition-label { color: #5d6a61; font-size: 0.55rem; letter-spacing: 0.08em; font-weight: 700; }
  .composition-field select { height: 1.9rem; padding: 0 0.35rem; font-size: 0.67rem; }
  .composition-value { display: flex; align-items: center; position: relative; }
  .composition-value input { height: 1.75rem; padding-right: 1.1rem; font-size: 0.68rem; }
  .composition-value span { position: absolute; right: 0.35rem; color: #647067; font-size: 0.62rem; }
  .editor-footer { padding: 1rem 1.35rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
  .unit-lock { display: flex; align-items: center; gap: 0.45rem; color: #5d6a61; font-size: 0.7rem; }
  .unit-lock strong { color: #a15c44; font-size: 0.63rem; letter-spacing: 0.1em; }
  .lock-mark { color: #8f5b42; transform: rotate(-45deg); }
  .primary-button { display: inline-flex; gap: 1.2rem; align-items: center; padding: 0.72rem 0.85rem 0.72rem 1rem; border: 0; background: #2f5144; color: #fffdf8; font-size: 0.72rem; font-weight: 750; }
  .primary-button:hover { background: #244338; }
  .button-arrow { color: #e3b397; font-size: 1rem; }
  .result-panel { min-height: 600px; }
  .result-heading { background: rgba(249, 245, 237, 0.68); }
  .result-status.idle { color: #6f756d; }
  .empty-result { min-height: 520px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2.5rem; text-align: center; }
  .empty-orbit { width: 94px; height: 94px; margin-bottom: 1.4rem; position: relative; border: 1px solid rgba(173, 116, 85, 0.35); border-radius: 50%; }
  .empty-orbit::before, .empty-orbit::after { content: ''; position: absolute; inset: 13px; border: 1px dashed rgba(94, 121, 102, 0.32); border-radius: 50%; }
  .empty-orbit::after { inset: 30px; border-style: solid; border-color: rgba(173, 116, 85, 0.45); }
  .empty-orbit span { position: absolute; width: 7px; height: 7px; background: #b86f50; border-radius: 50%; }
  .empty-orbit span:nth-child(1) { top: 7px; left: 44px; }
  .empty-orbit span:nth-child(2) { right: 12px; bottom: 25px; background: #6d8a72; }
  .empty-orbit span:nth-child(3) { bottom: 17px; left: 19px; background: #d7ae8d; }
  .empty-result h4 { max-width: 300px; margin: 0; color: #385243; font-family: Georgia, "Times New Roman", serif; font-size: 1.35rem; font-weight: 400; letter-spacing: -0.035em; }
  .empty-result p { max-width: 320px; margin: 0.7rem 0 0; color: #5f6a62; font-size: 0.76rem; line-height: 1.6; }
  .outcome-banner { display: flex; gap: 0.7rem; align-items: center; margin: 1rem 1.25rem 0; padding: 0.75rem 0.85rem; border: 1px solid #d2dfd1; background: #f0f6ef; color: #45634d; }
  .outcome-banner.partial { border-color: #e1cdb9; background: #fff7ee; color: #8d5e44; }
  .outcome-banner.rejected { border-color: #e7c5ba; background: #fff1ec; color: #a04d3f; }
  .outcome-icon { width: 24px; height: 24px; display: grid; place-items: center; border: 1px solid currentColor; border-radius: 50%; font-size: 0.72rem; font-weight: 800; }
  .outcome-banner strong, .outcome-banner span { display: block; }
  .outcome-banner strong { font-size: 0.79rem; }
  .outcome-banner span { margin-top: 0.15rem; opacity: 1; font-size: 0.66rem; }
  .diagnostic-list { display: flex; flex-direction: column; gap: 0.55rem; margin: 0.75rem 1.25rem 0; }
  .diagnostic { padding: 0.7rem 0.8rem; border-left: 2px solid #bd6750; background: #fff7f1; }
  .diagnostic.warning { border-left-color: #bf8659; background: #fff9f0; }
  .diagnostic-topline { display: flex; justify-content: space-between; gap: 0.8rem; align-items: start; color: #89503e; font-size: 0.72rem; }
  .diagnostic code { flex: 0 0 auto; color: #7b5847; font-size: 0.57rem; }
  .diagnostic p { margin: 0.35rem 0 0; color: #5d665e; font-size: 0.69rem; line-height: 1.45; }
  .diagnostic-path { display: block; margin-top: 0.45rem; color: #806f65; font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.58rem; }
  .partial-note { display: flex; gap: 0.6rem; margin: 0.9rem 1.25rem 0; padding: 0.7rem 0.8rem; border: 1px solid #ebd7c3; background: #fffaf4; color: #705441; }
  .partial-note > span { color: #8f5b42; }
  .partial-note p { margin: 0; font-size: 0.7rem; line-height: 1.5; }
  .metric-grid { display: grid; grid-template-columns: 1.35fr 1fr 1fr; gap: 0.55rem; margin: 1rem 1.25rem 0; }
  .metric-card { min-height: 105px; padding: 0.8rem; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(65, 75, 67, 0.12); background: #fbf8f3; }
  .metric-card.metric-featured { border-color: #bbd0c0; background: #eff6f0; }
  .metric-label { color: #5e6d62; font-size: 0.55rem; letter-spacing: 0.11em; font-weight: 750; }
  .metric-card strong { margin: 0.5rem 0; color: #304c3d; font-family: Georgia, "Times New Roman", serif; font-size: 1.65rem; font-weight: 400; letter-spacing: -0.05em; }
  .metric-card strong small { font-family: Inter, ui-sans-serif, sans-serif; font-size: 0.72rem; letter-spacing: 0; }
  .metric-foot { color: #5e6d62; font-size: 0.62rem; }
  .semantic-tag { display: inline-flex; padding: 0.18rem 0.32rem; border-radius: 2px; font-size: 0.56rem; font-weight: 750; }
  .semantic-tag.calculated { background: #dcebdd; color: #3f6048; }
  .semantic-tag.estimated { background: #f6e6d3; color: #765333; }
  .semantic-tag.heuristic { background: #e9e1ef; color: #634d70; }
  .result-block { margin: 1.2rem 1.25rem 0; }
  .result-block-heading { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 0.55rem; border-bottom: 1px solid rgba(65, 75, 67, 0.15); }
  .result-block-heading span { color: #626a63; font-size: 0.56rem; letter-spacing: 0.08em; }
  .data-table { font-size: 0.7rem; }
  .table-row { display: grid; grid-template-columns: 1.35fr 0.75fr 0.8fr 0.95fr; gap: 0.5rem; align-items: center; min-height: 39px; border-bottom: 1px solid rgba(65, 75, 67, 0.13); color: #5d6a61; }
  .table-row > span:not(:first-child) { font-variant-numeric: tabular-nums; }
  .table-head { min-height: 30px; color: #626a63; font-size: 0.55rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .table-name { color: #3c5748; font-weight: 700; }
  .ingredient-result-row { grid-template-columns: 1.25fr 0.95fr 0.65fr 0.65fr; }
  .table-name small { display: flex; flex-wrap: wrap; gap: 0.2rem; margin-top: 0.25rem; font-weight: 400; }
  .state-mini { padding: 0.14rem 0.22rem; color: #50675a; background: #edf1eb; font-size: 0.5rem; }
  .state-mini.unknown { color: #8a553c; background: #fff0e5; }
  .state-mini.none { color: #5f6761; background: #f0f0ed; }
  .composition-metrics { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.45rem; margin-top: 0.6rem; }
  .composition-metric-card { padding: 0.6rem; border: 1px solid #dce7da; background: #f3f8f2; }
  .composition-metric-card.unavailable { border-color: #ead9cb; background: #fff8f1; }
  .composition-metric-card > span { display: block; color: #5b6b60; font-size: 0.59rem; font-weight: 700; }
  .composition-metric-card strong { display: block; margin: 0.3rem 0; color: #46604b; font-family: Georgia, "Times New Roman", serif; font-size: 1rem; font-weight: 400; }
  .composition-metric-card small { display: block; color: #5f6e63; font-size: 0.55rem; line-height: 1.3; }
  .composition-metric-card.unavailable strong, .composition-metric-card.unavailable small { color: #8f5b42; }
  .policy-strip { display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center; margin: 1rem 1.25rem 0; padding: 0.7rem 0.8rem; color: #5e6a61; background: #f5f1ea; font-size: 0.56rem; letter-spacing: 0.07em; }
  .policy-strip strong { color: #526b59; font-size: 0.62rem; font-weight: 600; letter-spacing: 0; line-height: 1.45; text-transform: none; }
  .policy-strip code { color: #526b59; font-size: 0.62rem; letter-spacing: 0; }
  .policy-separator { color: #8f6f59; }
  .explanation-toggle { width: calc(100% - 2.5rem); margin: 1rem 1.25rem 0; padding: 0.8rem 0; display: flex; justify-content: space-between; border: 0; border-top: 1px solid rgba(65, 75, 67, 0.15); background: transparent; color: #3e5e4c; font-size: 0.7rem; font-weight: 750; text-align: left; }
  .explanation-card { margin: 0 1.25rem 1.25rem; padding: 1rem; border: 1px solid #dbe5da; background: #f5faf4; }
  .explanation-intro { margin: 0 0 0.9rem; color: #58665d; font-size: 0.69rem; line-height: 1.55; }
  .explanation-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 0.8rem 0; border-top: 1px solid rgba(78, 110, 83, 0.13); }
  .explanation-columns h5 { margin: 0 0 0.45rem; color: #59715e; font-size: 0.64rem; }
  .explanation-columns ul { margin: 0; padding-left: 1rem; color: #5f6b62; font-size: 0.65rem; line-height: 1.5; }
  .explanation-columns p { margin: 0; color: #5d665e; font-size: 0.65rem; }
  .explanation-columns li span { display: block; color: #7b5847; font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.55rem; }
  .provenance-line { display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: baseline; padding-top: 0.75rem; border-top: 1px solid rgba(78, 110, 83, 0.13); color: #5f6b62; font-size: 0.63rem; }
  .provenance-line strong { color: #42604a; }
  .correction-callout { margin: 1rem 1.25rem; padding: 1.2rem; border: 1px dashed #d9a08c; background: #fff8f3; }
  .correction-callout strong { color: #985341; font-family: Georgia, "Times New Roman", serif; font-size: 1.05rem; font-weight: 400; }
  .correction-callout p { margin: 0.4rem 0 0; color: #6f6258; font-size: 0.72rem; line-height: 1.5; }
  .site-footer { width: min(1600px, calc(100% - 2rem)); margin: 0 auto; padding: 2.2rem 0 2.8rem; display: flex; justify-content: space-between; color: #5f6860; font-size: 0.57rem; letter-spacing: 0.08em; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
  @media (max-width: 1080px) { .workspace-grid { grid-template-columns: 1fr; } .result-panel { min-height: auto; } .empty-result { min-height: 360px; } }
  @media (max-width: 720px) { main, .site-footer { width: min(100% - 1.2rem, 1400px); } .topbar { height: 68px; padding: 0 0.8rem; } .brand-name { font-size: 0.72rem; } .brand-eyebrow { font-size: 0.52rem; } .nav-current { display: none; } .hero-section { min-height: 300px; padding: 3.7rem 0 2.5rem; display: block; } .hero-copy h1 { font-size: clamp(3rem, 16vw, 5.6rem); } .hero-copy p { font-size: 0.88rem; } .hero-index { margin-top: 2rem; justify-content: flex-end; } .workspace-heading { display: block; } .draft-meta { margin-top: 1.3rem; justify-content: space-between; } .panel-heading { padding: 1rem; } .editor-section { padding: 1rem; } .input-row { grid-template-columns: 1.5rem minmax(0, 1fr) 5.5rem 1.25rem; } .field-blend { grid-column: 2 / 4; } .ingredient-card-head { grid-template-columns: 1.5rem minmax(0, 1fr) 5.5rem 1.25rem; } .field-role { grid-column: 2 / 4; } .role-guide { margin-left: 0; } .composition-block { margin-left: 0; } .composition-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .composition-heading { display: block; } .composition-note { display: block; margin-top: 0.25rem; } .editor-footer { padding: 1rem; align-items: stretch; flex-direction: column; } .primary-button { justify-content: space-between; } .outcome-banner, .diagnostic-list, .partial-note, .metric-grid, .result-block, .policy-strip, .explanation-card { margin-left: 1rem; margin-right: 1rem; } .metric-grid { grid-template-columns: 1fr 1fr; } .metric-featured { grid-column: 1 / -1; } .table-row { grid-template-columns: 1.15fr 0.75fr 0.65fr 0.7fr; font-size: 0.64rem; } .composition-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } .explanation-toggle { width: calc(100% - 2rem); margin-left: 1rem; margin-right: 1rem; } .site-footer { gap: 0.6rem; flex-wrap: wrap; } }
</style>
