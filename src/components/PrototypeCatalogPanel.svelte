<script lang="ts">
  import { onMount } from 'svelte';
  import {
    PROTOTYPE_CATALOG_VERSION,
    resolvePrototypeCatalog,
    type PrototypeConfidenceTier,
    type PrototypeFeatureTarget,
    type PrototypeImportance,
    type PrototypeMaturity,
    type ResolvedPrototypeDefinition,
    type ResolvedPrototypeFeature,
  } from '../lib/domain/prototype-catalog';
  import { loadPrototypeCatalog } from '../data/prototypes/catalog';
  import { localeHref, t, type Locale } from '../lib/i18n/messages';

  export let locale: Locale;
  export let basePath = '/';

  const UNAVAILABLE_VERSION = 'prototype-catalog-v0';
  const PAGE_SIZE = 24;

  type FamilyTreeEntry = {
    key: string;
    family: ResolvedPrototypeDefinition;
    depth: number;
    hasChildren: boolean;
  };

  let requestedVersion = PROTOTYPE_CATALOG_VERSION;
  let query = '';
  let selectedFamilyId = '';
  let selectedPrototypeId = '';
  let currentPage = 1;
  let expandedFamilyIds: string[] = [];
  let hydrated = false;

  $: workspaceHref = localeHref(basePath, locale);
  $: helpHref = `${workspaceHref}help/`;
  $: theoryHref = `${workspaceHref}theory/`;
  $: languageHref = `${localeHref(basePath, locale === 'en' ? 'el' : 'en')}catalog/`;
  $: loadResult = loadPrototypeCatalog(requestedVersion);
  $: resolutionResult = loadResult.status === 'available' ? resolvePrototypeCatalog(loadResult.snapshot) : null;
  $: catalog = resolutionResult?.status === 'resolved' ? resolutionResult.snapshot : null;
  $: families = catalog?.definitions.filter((definition) => definition.kind === 'family') ?? [];
  $: prototypes = catalog?.definitions.filter((definition) => definition.kind === 'prototype') ?? [];
  $: rootFamilies = families.filter((family) => family.parentIds.length === 0);
  $: selectedFamily = catalog && selectedFamilyId ? catalog.byId[selectedFamilyId] ?? null : null;
  $: selectedFamilyChildren = selectedFamily ? childFamilies(selectedFamily.id) : [];
  $: filteredPrototypes = prototypes
    .filter((prototype) => !selectedFamilyId || prototype.ancestry.includes(selectedFamilyId))
    .filter((prototype) => matchesQuery(prototype, query));
  $: totalPages = Math.max(1, Math.ceil(filteredPrototypes.length / PAGE_SIZE));
  $: if (currentPage > totalPages) currentPage = 1;
  $: pagedPrototypes = filteredPrototypes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  $: activePrototypeId = filteredPrototypes.find((prototype) => prototype.id === selectedPrototypeId)?.id ?? filteredPrototypes[0]?.id ?? '';
  $: selectedPrototype = catalog && activePrototypeId ? catalog.byId[activePrototypeId] ?? null : null;
  $: familyTree = buildFamilyTree(families, rootFamilies, expandedFamilyIds);

  function childFamilies(familyId: string): ResolvedPrototypeDefinition[] {
    return families
      .filter((family) => family.parentIds.includes(familyId))
      .sort((a, b) => a.label[locale].localeCompare(b.label[locale], locale));
  }

  function familyTypeCount(familyId: string): number {
    return prototypes.filter((prototype) => prototype.ancestry.includes(familyId)).length;
  }

  function familyPath(prototype: ResolvedPrototypeDefinition): string {
    return prototype.ancestry
      .slice(1)
      .reverse()
      .map((familyId) => catalog?.byId[familyId]?.label[locale])
      .filter((name): name is string => Boolean(name))
      .join(' → ');
  }

  function familyMemberLabel(count: number): string {
    const form = count === 1 ? 'one' : 'other';
    return t(locale, `catalog.family.members.${form}`, { count });
  }

  function matchesQuery(prototype: ResolvedPrototypeDefinition, value: string): boolean {
    const normalizedQuery = value.trim().toLocaleLowerCase(locale);
    if (!normalizedQuery) return true;
    const searchable = [
      prototype.label.en,
      prototype.label.el,
      familyPath(prototype),
      ...prototype.structuralFeatures.flatMap((feature) => [feature.label.en, feature.label.el]),
      ...prototype.structuralConstraints.flatMap((feature) => [feature.label.en, feature.label.el]),
      ...prototype.identityModifiers.flatMap((feature) => [feature.label.en, feature.label.el]),
    ].join(' ').toLocaleLowerCase(locale);
    return searchable.includes(normalizedQuery);
  }

  function buildFamilyTree(
    definitions: readonly ResolvedPrototypeDefinition[],
    roots: readonly ResolvedPrototypeDefinition[],
    expanded: readonly string[],
  ): FamilyTreeEntry[] {
    const entries: FamilyTreeEntry[] = [];
    const visit = (family: ResolvedPrototypeDefinition, depth: number, path: string[]): void => {
      const children = definitions
        .filter((candidate) => candidate.parentIds.includes(family.id))
        .sort((a, b) => a.label[locale].localeCompare(b.label[locale], locale));
      entries.push({
        key: [...path, family.id].join('/'),
        family,
        depth,
        hasChildren: children.length > 0,
      });
      if (expanded.includes(family.id)) {
        children.forEach((child) => visit(child, depth + 1, [...path, family.id]));
      }
    };
    roots.forEach((root) => visit(root, 0, []));
    return entries;
  }

  function isFamilyExpanded(familyId: string): boolean {
    return expandedFamilyIds.includes(familyId);
  }

  function toggleFamily(familyId: string): void {
    expandedFamilyIds = isFamilyExpanded(familyId)
      ? expandedFamilyIds.filter((id) => id !== familyId)
      : [...expandedFamilyIds, familyId];
  }

  function expandFamilyPath(familyId: string): void {
    const family = catalog?.byId[familyId];
    if (!family) return;
    expandedFamilyIds = [...new Set([...expandedFamilyIds, ...family.ancestry.slice(1)])];
  }

  function updateUrl(): void {
    if (!hydrated || typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    url.searchParams.delete('family');
    url.searchParams.delete('type');
    if (query.trim()) url.searchParams.set('q', query.trim());
    if (selectedFamilyId) url.searchParams.set('family', selectedFamilyId);
    if (selectedPrototypeId) url.searchParams.set('type', selectedPrototypeId);
    window.history.replaceState({}, '', url);
  }

  function selectFamily(familyId: string): void {
    selectedFamilyId = familyId;
    currentPage = 1;
    selectedPrototypeId = '';
    if (familyId) expandFamilyPath(familyId);
    updateUrl();
  }

  function selectPrototype(prototypeId: string): void {
    selectedPrototypeId = prototypeId;
    updateUrl();
  }

  function clearFilters(): void {
    query = '';
    selectedFamilyId = '';
    currentPage = 1;
    selectedPrototypeId = '';
    updateUrl();
  }

  function syncQuery(): void {
    currentPage = 1;
    selectedPrototypeId = '';
    updateUrl();
  }

  function changePage(page: number): void {
    currentPage = Math.min(Math.max(page, 1), totalPages);
    const results = document.getElementById('catalog-results');
    results?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function treeToggleLabel(family: ResolvedPrototypeDefinition): string {
    return t(locale, `catalog.explorer.${isFamilyExpanded(family.id) ? 'collapse' : 'expand'}`, { name: family.label[locale] });
  }

  function importanceLabel(importance: PrototypeImportance): string {
    return t(locale, `catalog.importance.${importance}`);
  }

  function confidenceLabel(tier: PrototypeConfidenceTier): string {
    return t(locale, `catalog.confidence.${tier}`);
  }

  function maturityLabel(maturity: PrototypeMaturity): string {
    return t(locale, `catalog.maturity.${maturity}`);
  }

  function valueLabel(value: string): string {
    const translated = t(locale, `catalog.value.${value}`);
    return translated.startsWith('[missing-translation:') ? value.replaceAll('_', ' ') : translated;
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
    return t(locale, 'catalog.target.compatibility', { values: target.values.map(valueLabel).join(', ') });
  }

  function diagnosticMessage(messageKey: string, parameters: Record<string, string | number>): string {
    return t(locale, messageKey, parameters);
  }

  function originLabel(feature: ResolvedPrototypeFeature): string {
    return t(locale, `catalog.feature.${feature.origin}`);
  }

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    expandedFamilyIds = rootFamilies.map((family) => family.id);
    query = params.get('q') ?? '';
    const requestedFamily = params.get('family') ?? '';
    const requestedType = params.get('type') ?? '';
    if (families.some((family) => family.id === requestedFamily)) selectedFamilyId = requestedFamily;
    if (prototypes.some((prototype) => prototype.id === requestedType)) selectedPrototypeId = requestedType;
    if (selectedFamilyId) expandFamilyPath(selectedFamilyId);
    hydrated = true;
  });
</script>

<svelte:head>
  <title>{locale === 'el' ? 'Dough Formula Intelligence — Κατάλογος πρωτοτύπων' : 'Dough Formula Intelligence — Prototype catalog'}</title>
  <meta
    name="description"
    content={locale === 'el'
      ? 'Εξερεύνησε τις δομικές οικογένειες και τα ονομασμένα πρωτότυπα του αναλυτή ζυμών.'
      : 'Explore the structural families and named prototypes available to the dough analyzer.'}
  />
</svelte:head>

<div class="catalog-shell">
  <header class="topbar">
    <a class="brand" href={workspaceHref} aria-label="Dough Formula Intelligence">
      <span class="brand-mark" aria-hidden="true">D/F</span>
      <span class="brand-copy">
        <span class="brand-eyebrow">DOUGH FORMULA INTELLIGENCE</span>
        <span class="brand-name">Dough Formula<br />Intelligence</span>
      </span>
    </a>
    <nav class="topnav" aria-label={locale === 'el' ? 'Πλοήγηση' : 'Site navigation'}>
      <a class="workspace-link" href={workspaceHref}>{t(locale, 'nav.workspace')}</a>
      <a class="help-link" href={helpHref}>{t(locale, 'nav.help')}</a>
      <a class="help-link" href={theoryHref}>{t(locale, 'nav.theory')}</a>
      <span class="nav-current">{t(locale, 'nav.catalog')}</span>
      <span class="nav-divider" aria-hidden="true"></span>
      <a class="language-link" href={languageHref}>
        <span class="language-dot" aria-hidden="true"></span>
        {t(locale, 'nav.language')}
      </a>
    </nav>
  </header>

  <main>
    <section class="catalog-hero">
      <div class="hero-kicker"><span class="kicker-line"></span>{t(locale, 'catalog.kicker')}</div>
      <div class="hero-copy">
        <h1>{t(locale, 'catalog.title')}</h1>
        <p>{t(locale, 'catalog.intro')}</p>
      </div>
      <div class="hero-index" aria-hidden="true">
        <span>CATALOG</span>
        <span class="hero-index-rule"></span>
        <span>DFI</span>
      </div>
    </section>

    <section class="catalog-control" aria-labelledby="catalog-control-title">
      <div class="control-copy">
        <p class="section-kicker">{t(locale, 'catalog.version.selector')}</p>
        <h2 id="catalog-control-title">{t(locale, 'catalog.version.current')}</h2>
        <p>{t(locale, 'catalog.version.seedNote')}</p>
      </div>
      <label class="version-select">
        <span>{t(locale, 'catalog.version.selector')}</span>
        <select bind:value={requestedVersion}>
          <option value={PROTOTYPE_CATALOG_VERSION}>{t(locale, 'catalog.version.current')} · {PROTOTYPE_CATALOG_VERSION}</option>
          <option value={UNAVAILABLE_VERSION}>{t(locale, 'catalog.version.unavailableOption')} · {UNAVAILABLE_VERSION}</option>
        </select>
      </label>
    </section>

    {#if loadResult.status === 'unavailable'}
      <section class="catalog-diagnostic" role="alert" aria-live="polite">
        <span class="diagnostic-icon" aria-hidden="true">!</span>
        <div>
          <h2>{t(locale, 'catalog.error.title')}</h2>
          <p>{diagnosticMessage(loadResult.diagnostic.messageKey, loadResult.diagnostic.parameters)}</p>
          <small>{t(locale, 'catalog.error.body')}</small>
        </div>
      </section>
    {:else if loadResult.status === 'invalid'}
      <section class="catalog-diagnostic" role="alert" aria-live="polite">
        <span class="diagnostic-icon" aria-hidden="true">!</span>
        <div>
          <h2>{t(locale, 'catalog.error.title')}</h2>
          <p>{t(locale, 'catalog.diagnostic.invalidSnapshot')}</p>
          {#each loadResult.diagnostics as diagnostic (diagnostic.path)}
            <small>{diagnosticMessage(diagnostic.messageKey, diagnostic.parameters)}</small>
          {/each}
        </div>
      </section>
    {:else if resolutionResult?.status === 'invalid'}
      <section class="catalog-diagnostic" role="alert" aria-live="polite">
        <span class="diagnostic-icon" aria-hidden="true">!</span>
        <div>
          <h2>{t(locale, 'catalog.error.title')}</h2>
          <p>{t(locale, 'catalog.diagnostic.invalidSnapshot')}</p>
          {#each resolutionResult.diagnostics as diagnostic (diagnostic.path)}
            <small>{diagnosticMessage(diagnostic.messageKey, diagnostic.parameters)}</small>
          {/each}
        </div>
      </section>
    {:else if catalog}
      <section class="catalog-metadata" aria-label={t(locale, 'catalog.version.selector')}>
        <div class="metadata-item">
          <span>{t(locale, 'catalog.version.catalog')}</span>
          <strong><code>{catalog.reference.version}</code></strong>
        </div>
        <div class="metadata-item">
          <span>{t(locale, 'catalog.version.model')}</span>
          <strong><code>{catalog.reference.modelVersion}</code></strong>
        </div>
        <div class="metadata-item">
          <span>{t(locale, 'catalog.version.content')}</span>
          <strong><code>{catalog.reference.contentHash}</code></strong>
        </div>
        <div class="metadata-item">
          <span>{t(locale, 'catalog.version.integrity')}</span>
          <strong class="verified">{t(locale, 'catalog.version.integrityVerified')}</strong>
        </div>
      </section>

      <section class="catalog-section explorer-section" aria-labelledby="explorer-title">
        <div class="section-heading">
          <div>
            <p class="section-kicker">01 / {t(locale, 'catalog.explorer.kicker')}</p>
            <h2 id="explorer-title">{t(locale, 'catalog.explorer.title')}</h2>
          </div>
          <span>{prototypes.length}</span>
        </div>

        <div class="explorer-toolbar">
          <label class="search-control">
            <span>{t(locale, 'catalog.explorer.search')}</span>
            <input
              type="search"
              bind:value={query}
              on:input={syncQuery}
              placeholder={t(locale, 'catalog.explorer.searchPlaceholder')}
              aria-controls="catalog-results"
            />
          </label>
          <button class="clear-control" type="button" on:click={clearFilters} disabled={!query && !selectedFamilyId}>
            {t(locale, 'catalog.explorer.clear')}
          </button>
        </div>

        <div class="explorer-layout">
          <aside class="family-browser" aria-labelledby="family-browser-title">
            <div class="browser-heading">
              <div>
                <p class="section-kicker">{t(locale, 'catalog.explorer.familyKicker')}</p>
                <h3 id="family-browser-title">{t(locale, 'catalog.explorer.families')}</h3>
              </div>
              <span>{families.length}</span>
            </div>

            <button class:selected={!selectedFamilyId} class="family-all" type="button" on:click={() => selectFamily('')}>
              <span>{t(locale, 'catalog.explorer.allTypes')}</span>
              <span>{prototypes.length}</span>
            </button>

            <ul class="family-tree" role="tree" aria-label={t(locale, 'catalog.explorer.families')}>
              {#each familyTree as entry (entry.key)}
                <li role="treeitem" aria-level={entry.depth + 1} aria-expanded={entry.hasChildren ? isFamilyExpanded(entry.family.id) : undefined}>
                  <div class="tree-row" style={`--depth: ${entry.depth}`}>
                    {#if entry.hasChildren}
                      <button
                        class="tree-toggle"
                        type="button"
                        aria-expanded={isFamilyExpanded(entry.family.id)}
                        aria-label={treeToggleLabel(entry.family)}
                        on:click={() => toggleFamily(entry.family.id)}
                      >{isFamilyExpanded(entry.family.id) ? '−' : '+'}</button>
                    {:else}
                      <span class="tree-spacer" aria-hidden="true">·</span>
                    {/if}
                    <button
                      class:selected={selectedFamilyId === entry.family.id}
                      class="tree-select"
                      type="button"
                      aria-current={selectedFamilyId === entry.family.id ? 'page' : undefined}
                      on:click={() => selectFamily(entry.family.id)}
                    >
                      <span class="tree-label">{entry.family.label[locale]}</span>
                      <span class="tree-count">{familyTypeCount(entry.family.id)}</span>
                    </button>
                  </div>
                </li>
              {/each}
            </ul>
            <p class="tree-help">{t(locale, 'catalog.explorer.treeHelp')}</p>
          </aside>

          <section class="results-browser" id="catalog-results" aria-labelledby="results-title">
            <header class="result-heading">
              <div>
                <p class="section-kicker">02 / {t(locale, 'catalog.explorer.resultsKicker')}</p>
                <h3 id="results-title">{selectedFamily?.label[locale] ?? t(locale, 'catalog.explorer.allTypes')}</h3>
                <p>{selectedFamily ? t(locale, 'catalog.explorer.familySummary') : t(locale, 'catalog.explorer.allSummary')}</p>
              </div>
              <span>{filteredPrototypes.length}</span>
            </header>

            {#if selectedFamilyChildren.length > 0}
              <div class="child-family-bar">
                <span>{t(locale, 'catalog.explorer.childFamilies')}</span>
                <div>
                  {#each selectedFamilyChildren as child (child.id)}
                    <button type="button" on:click={() => selectFamily(child.id)}>{child.label[locale]} <small>{familyTypeCount(child.id)}</small></button>
                  {/each}
                </div>
              </div>
            {/if}

            <div class="result-meta">
              <span>{familyMemberLabel(filteredPrototypes.length)}</span>
              {#if totalPages > 1}
                <span>{t(locale, 'catalog.explorer.pageOf', { current: currentPage, total: totalPages })}</span>
              {/if}
            </div>

            {#if pagedPrototypes.length > 0}
              <div class="type-list" role="list" aria-label={t(locale, 'catalog.explorer.results')}>
                {#each pagedPrototypes as prototype, index (prototype.id)}
                  <button
                    class:selected={activePrototypeId === prototype.id}
                    class="type-row"
                    type="button"
                    role="listitem"
                    aria-pressed={activePrototypeId === prototype.id}
                    on:click={() => selectPrototype(prototype.id)}
                  >
                    <span class="type-row-index">{String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, '0')}</span>
                    <span class="type-row-copy">
                      <strong>{prototype.label[locale]}</strong>
                      <small>{familyPath(prototype)}</small>
                    </span>
                    <span class="type-row-status">
                      <span>{confidenceLabel(prototype.confidenceTier)}</span>
                      <span>{maturityLabel(prototype.maturity)}</span>
                    </span>
                    <span class="type-row-arrow" aria-hidden="true">→</span>
                  </button>
                {/each}
              </div>

              {#if totalPages > 1}
                <nav class="pagination" aria-label={t(locale, 'catalog.explorer.pagination')}>
                  <button type="button" disabled={currentPage === 1} on:click={() => changePage(currentPage - 1)}>{t(locale, 'catalog.explorer.previous')}</button>
                  <span>{t(locale, 'catalog.explorer.pageOf', { current: currentPage, total: totalPages })}</span>
                  <button type="button" disabled={currentPage === totalPages} on:click={() => changePage(currentPage + 1)}>{t(locale, 'catalog.explorer.next')}</button>
                </nav>
              {/if}
            {:else}
              <div class="empty-results">
                <h4>{t(locale, 'catalog.explorer.noResults')}</h4>
                <p>{t(locale, 'catalog.explorer.noResultsHint')}</p>
              </div>
            {/if}

            {#if selectedPrototype}
              <article class="prototype-detail" id="catalog-type-detail" aria-labelledby="selected-type-title">
                <header class="prototype-heading">
                  <div>
                    <p class="card-type">{t(locale, 'catalog.type.prototype')}</p>
                    <h3 id="selected-type-title">{selectedPrototype.label[locale]}</h3>
                    <p class="family-line">{familyPath(selectedPrototype)}</p>
                  </div>
                  <div class="prototype-badges">
                    <span>{confidenceLabel(selectedPrototype.confidenceTier)}</span>
                    <span>{maturityLabel(selectedPrototype.maturity)}</span>
                  </div>
                </header>

                <p class="ancestry-line"><strong>{t(locale, 'catalog.section.ancestry')}:</strong> {familyPath(selectedPrototype)}</p>

                <div class="feature-columns">
                  <section class="feature-group">
                    <h4>{t(locale, 'catalog.section.structuralFeatures')}</h4>
                    <ul class="feature-list">
                      {#each selectedPrototype.structuralFeatures as item (item.id)}
                        <li>
                          <span class={`origin-badge ${item.origin}`}>{originLabel(item)}</span>
                          <span class="feature-copy"><strong>{item.label[locale]}</strong><small>{targetLabel(item.target)}</small></span>
                          <span class="importance-badge">{importanceLabel(item.importance)}</span>
                        </li>
                      {/each}
                    </ul>
                  </section>

                  <section class="feature-group">
                    <h4>{t(locale, 'catalog.section.structuralConstraints')}</h4>
                    <ul class="feature-list">
                      {#each selectedPrototype.structuralConstraints as item (item.id)}
                        <li>
                          <span class={`origin-badge ${item.origin}`}>{originLabel(item)}</span>
                          <span class="feature-copy"><strong>{item.label[locale]}</strong><small>{targetLabel(item.target)}</small></span>
                          <span class="importance-badge">{importanceLabel(item.importance)}</span>
                        </li>
                      {/each}
                    </ul>
                  </section>

                  <section class="feature-group identity-group">
                    <h4>{t(locale, 'catalog.section.identityModifiers')}</h4>
                    {#if selectedPrototype.identityModifiers.length > 0}
                      <ul class="feature-list">
                        {#each selectedPrototype.identityModifiers as item (item.id)}
                          <li>
                            <span class={`origin-badge ${item.origin}`}>{originLabel(item)}</span>
                            <span class="feature-copy"><strong>{item.label[locale]}</strong><small>{targetLabel(item.target)}</small></span>
                            <span class="importance-badge">{importanceLabel(item.importance)}</span>
                          </li>
                        {/each}
                      </ul>
                    {:else}
                      <p class="empty-group">{t(locale, 'catalog.identity.none')}</p>
                    {/if}
                  </section>
                </div>

                <aside class="matcher-policy">
                  <h4>{t(locale, 'catalog.section.matcherPolicy')}</h4>
                  <p><code>{selectedPrototype.matcherPolicy.id}</code></p>
                  <ul>
                    <li>{t(locale, 'catalog.matcher.missing')}</li>
                    <li>{t(locale, 'catalog.matcher.critical')}</li>
                    <li>{t(locale, 'catalog.matcher.identity')}</li>
                  </ul>
                </aside>

                <div class="provenance-block">
                  <h4>{t(locale, 'catalog.section.provenance')}</h4>
                  <p><strong>{t(locale, 'catalog.provenance.source')}:</strong> <code>{selectedPrototype.provenance.sourceId}</code>{#if selectedPrototype.provenance.sourceVersion} · <code>{selectedPrototype.provenance.sourceVersion}</code>{/if}</p>
                  <p><strong>{t(locale, 'catalog.provenance.method')}:</strong> {t(locale, 'catalog.provenance.expertSeed')} · {selectedPrototype.provenance.note[locale]}</p>
                </div>

                <details class="technical-details prototype-technical">
                  <summary>{t(locale, 'catalog.section.technicalIdentity')}</summary>
                  <dl>
                    <div><dt>{t(locale, 'catalog.technical.id')}</dt><dd><code>{selectedPrototype.id}</code></dd></div>
                    <div><dt>{t(locale, 'catalog.technical.matcher')}</dt><dd><code>{selectedPrototype.matcherPolicy.id}</code></dd></div>
                  </dl>
                </details>
              </article>
            {/if}
          </section>
        </div>
      </section>
    {/if}
  </main>

  <footer class="site-footer">
    <span>© 2026 DFI</span>
    <span>{t(locale, 'footer.note')}</span>
  </footer>
</div>

<style>
  :global(html) { background: #f5f1eb; scroll-behavior: smooth; }
  :global(body) { margin: 0; background: #f5f1eb; color: #242c29; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  :global(*) { box-sizing: border-box; }
  :global(a) { -webkit-tap-highlight-color: transparent; }
  .catalog-shell { min-height: 100vh; background: radial-gradient(circle at 82% 9%, rgba(222, 161, 112, 0.17), transparent 26rem), #f5f1eb; }
  .topbar { height: 76px; padding: 0 clamp(1.25rem, 5vw, 5.6rem); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(42, 50, 45, 0.13); }
  .brand { display: inline-flex; align-items: center; gap: 0.7rem; color: inherit; text-decoration: none; }
  .brand-mark { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid #b87957; border-radius: 50%; color: #914d38; font-size: 0.58rem; font-weight: 800; letter-spacing: -0.05em; }
  .brand-copy { display: flex; flex-direction: column; gap: 0.15rem; }
  .brand-eyebrow, .section-kicker, .site-footer { font-size: 0.66rem; letter-spacing: 0.15em; text-transform: uppercase; }
  .brand-eyebrow { color: #7b4f3f; font-weight: 760; }
  .brand-name { font-size: 0.86rem; line-height: 0.92; font-weight: 740; letter-spacing: -0.03em; }
  .topnav { display: flex; gap: 0.9rem; align-items: center; font-size: 0.78rem; }
  .workspace-link, .help-link, .language-link { color: #34483e; font-weight: 700; text-decoration: none; }
  .workspace-link:hover, .help-link:hover, .language-link:hover { color: #a24e37; }
  .nav-current { color: #5f6c64; }
  .nav-divider { width: 1px; height: 16px; background: rgba(42, 50, 45, 0.18); }
  .language-link { display: inline-flex; gap: 0.45rem; align-items: center; }
  .language-dot { width: 6px; height: 6px; display: inline-block; background: #cc7853; border-radius: 50%; }
  main { width: min(1600px, calc(100% - 2rem)); margin: 0 auto; }
  .catalog-hero { min-height: 320px; padding: clamp(3rem, 8vw, 7rem) 0 3.6rem; display: grid; grid-template-columns: 1fr auto; align-items: end; position: relative; }
  .hero-kicker { grid-column: 1 / -1; display: flex; gap: 0.7rem; align-items: center; color: #8b4f3b; font-size: 0.66rem; font-weight: 760; letter-spacing: 0.15em; text-transform: uppercase; }
  .kicker-line { width: 36px; height: 1px; background: #c77954; }
  .hero-copy { max-width: 800px; grid-column: 1; }
  .hero-copy h1 { max-width: 800px; margin: 1.1rem 0 1rem; color: #263d34; font-family: Georgia, "Times New Roman", serif; font-size: clamp(3rem, 6vw, 6.7rem); font-weight: 400; line-height: 0.92; letter-spacing: -0.065em; }
  .hero-copy p { max-width: 720px; margin: 0; color: #58665d; font-size: 0.97rem; line-height: 1.65; }
  .hero-index { grid-column: 2; display: flex; align-items: center; gap: 0.65rem; padding-bottom: 0.35rem; color: #68736b; font-size: 0.68rem; letter-spacing: 0.12em; }
  .hero-index-rule { width: 52px; height: 1px; background: #bdc1b9; }
  .catalog-control { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 380px); gap: 2rem; align-items: end; padding: 1.25rem; border: 1px solid #d8c5b4; background: rgba(255, 249, 241, 0.76); }
  .section-kicker { margin: 0 0 0.55rem; color: #8b4f3b; font-weight: 800; }
  .control-copy h2, .section-heading h2 { margin: 0; color: #2f493d; font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.6rem, 3vw, 2.8rem); font-weight: 400; letter-spacing: -0.05em; }
  .control-copy > p:last-child { max-width: 760px; margin: 0.7rem 0 0; color: #5f6c64; font-size: 0.78rem; line-height: 1.55; }
  .version-select { display: flex; flex-direction: column; gap: 0.35rem; }
  .version-select > span { color: #5d6a61; font-size: 0.58rem; font-weight: 750; letter-spacing: 0.1em; text-transform: uppercase; }
  .version-select select { width: 100%; height: 2.3rem; padding: 0 0.55rem; border: 1px solid #d0b49f; border-radius: 0; background: #fffdfa; color: #33463d; font-size: 0.72rem; }
  .version-select select:focus { border-color: #b87859; box-shadow: 0 0 0 2px rgba(184, 120, 89, 0.12); outline: 0; }
  .catalog-diagnostic { display: flex; gap: 0.9rem; align-items: flex-start; margin-top: 1rem; padding: 1rem 1.25rem; border: 1px solid #e2c2b4; background: #fff4ef; color: #89503e; }
  .diagnostic-icon { width: 1.4rem; height: 1.4rem; display: grid; flex: 0 0 auto; place-items: center; border: 1px solid currentColor; border-radius: 50%; font-weight: 800; }
  .catalog-diagnostic h2 { margin: 0; font-size: 0.9rem; }
  .catalog-diagnostic p { margin: 0.4rem 0 0; color: #5d665e; font-size: 0.75rem; line-height: 1.5; }
  .catalog-diagnostic small { display: block; margin-top: 0.45rem; color: #806f65; font-size: 0.65rem; line-height: 1.45; }
  .catalog-metadata { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.6rem; margin-top: 1rem; }
  .metadata-item { min-width: 0; padding: 0.8rem; border: 1px solid rgba(65, 75, 67, 0.14); background: rgba(255, 253, 249, 0.75); }
  .metadata-item span { display: block; color: #68746b; font-size: 0.57rem; font-weight: 750; letter-spacing: 0.09em; text-transform: uppercase; }
  .metadata-item strong { display: block; margin-top: 0.35rem; color: #3f5d4b; font-size: 0.72rem; }
  .metadata-item code, .technical-details code, .matcher-policy code, .provenance-block code { overflow-wrap: anywhere; font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.64rem; font-weight: 500; }
  .metadata-item .verified { color: #4d7457; }
  .catalog-section { padding: 3.5rem 0 0; }
  .explorer-section { padding-bottom: 3.5rem; }
  .section-heading { display: flex; justify-content: space-between; align-items: end; gap: 1rem; padding-bottom: 0.8rem; border-bottom: 1px solid rgba(65, 75, 67, 0.18); }
  .section-heading > span { color: #a15c44; font-family: Georgia, "Times New Roman", serif; font-size: 2rem; }
  .card-type { margin: 0 0 0.45rem; color: #9a5e45; font-size: 0.57rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
  .explorer-toolbar { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.8rem; align-items: end; margin-top: 1rem; padding: 0.8rem; border: 1px solid #d8c5b4; background: rgba(255, 249, 241, 0.76); }
  .search-control { display: flex; flex-direction: column; gap: 0.35rem; }
  .search-control > span, .browser-heading .section-kicker { color: #5d6a61; font-size: 0.58rem; font-weight: 750; letter-spacing: 0.1em; text-transform: uppercase; }
  .search-control input { width: 100%; height: 2.35rem; padding: 0 0.65rem; border: 1px solid #d0b49f; border-radius: 0; background: #fffdfa; color: #33463d; font: inherit; font-size: 0.75rem; }
  .search-control input:focus { border-color: #b87859; box-shadow: 0 0 0 2px rgba(184, 120, 89, 0.12); outline: 0; }
  .clear-control, .pagination button { min-height: 2.35rem; padding: 0.45rem 0.7rem; border: 1px solid #b9c9bb; border-radius: 0; background: #edf4ec; color: #3f6048; font: inherit; font-size: 0.68rem; font-weight: 750; cursor: pointer; }
  .clear-control:hover:not(:disabled), .pagination button:hover:not(:disabled) { border-color: #9bae9e; background: #e2eee1; }
  .clear-control:disabled, .pagination button:disabled { cursor: not-allowed; opacity: 0.45; }
  .explorer-layout { display: grid; grid-template-columns: minmax(220px, 280px) minmax(0, 1fr); gap: 0.8rem; margin-top: 0.8rem; align-items: start; }
  .family-browser { min-width: 0; position: sticky; top: 1rem; padding: 1rem; border: 1px solid rgba(65, 75, 67, 0.15); background: rgba(255, 253, 249, 0.84); }
  .browser-heading, .result-heading { display: flex; justify-content: space-between; align-items: end; gap: 0.8rem; }
  .browser-heading .section-kicker { margin: 0 0 0.45rem; color: #8b4f3b; }
  .browser-heading h3, .result-heading h3 { margin: 0; color: #304c3d; font-family: Georgia, "Times New Roman", serif; font-size: 1.35rem; font-weight: 400; letter-spacing: -0.035em; }
  .browser-heading > span, .result-heading > span { color: #a15c44; font-family: Georgia, "Times New Roman", serif; font-size: 1.7rem; }
  .family-all { width: 100%; display: flex; justify-content: space-between; gap: 0.5rem; margin-top: 0.9rem; padding: 0.55rem 0.65rem; border: 1px solid rgba(65, 75, 67, 0.15); border-radius: 0; background: #fbf8f3; color: #48654f; font: inherit; font-size: 0.7rem; font-weight: 750; text-align: left; cursor: pointer; }
  .family-all:hover, .family-all.selected { border-color: #b4c9b5; background: #edf4ec; color: #345d43; }
  .family-all > span:last-child, .tree-count { color: #718077; font-size: 0.64rem; font-weight: 650; }
  .family-tree { max-height: min(45rem, 65vh); overflow: auto; margin: 0.55rem 0 0; padding: 0; list-style: none; }
  .tree-row { display: grid; grid-template-columns: 1.3rem minmax(0, 1fr); gap: 0.2rem; padding-left: calc(var(--depth) * 0.95rem); }
  .tree-toggle, .tree-spacer { width: 1.25rem; min-height: 1.9rem; display: grid; place-items: center; border: 0; background: transparent; color: #a15c44; font-size: 0.9rem; }
  .tree-toggle { padding: 0; cursor: pointer; }
  .tree-toggle:hover { background: #f7e8dc; }
  .tree-select { min-width: 0; display: flex; justify-content: space-between; align-items: center; gap: 0.45rem; padding: 0.42rem 0.45rem; border: 1px solid transparent; border-radius: 0; background: transparent; color: #52645a; font: inherit; font-size: 0.68rem; text-align: left; cursor: pointer; }
  .tree-select:hover, .tree-select.selected { border-color: #d5e1d3; background: #edf4ec; color: #345d43; }
  .tree-label { min-width: 0; overflow-wrap: anywhere; }
  .tree-help { margin: 0.85rem 0 0; padding-top: 0.75rem; border-top: 1px solid rgba(65, 75, 67, 0.12); color: #6d756d; font-size: 0.62rem; line-height: 1.45; }
  .results-browser { min-width: 0; }
  .result-heading { padding: 0.95rem 1rem; border: 1px solid rgba(65, 75, 67, 0.15); background: rgba(255, 253, 249, 0.84); }
  .result-heading .section-kicker { margin: 0 0 0.45rem; }
  .result-heading p:last-child { max-width: 42rem; margin: 0.45rem 0 0; color: #68746b; font-size: 0.68rem; line-height: 1.45; }
  .child-family-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 0.55rem; margin-top: 0.65rem; padding: 0.65rem 0.75rem; border: 1px solid #dbe5da; background: #f4faf3; color: #50675a; font-size: 0.64rem; }
  .child-family-bar > span { font-weight: 750; }
  .child-family-bar > div { display: flex; flex-wrap: wrap; gap: 0.3rem; }
  .child-family-bar button { padding: 0.25rem 0.4rem; border: 1px solid #c9dbca; border-radius: 0; background: #fffdfa; color: #416149; font: inherit; font-size: 0.63rem; cursor: pointer; }
  .child-family-bar button:hover { border-color: #a9c0aa; background: #e7f1e6; }
  .child-family-bar small { color: #78857b; }
  .result-meta { display: flex; justify-content: space-between; gap: 0.8rem; margin: 0.7rem 0 0.45rem; color: #68746b; font-size: 0.63rem; }
  .result-meta span:first-child { color: #50675a; font-weight: 750; }
  .type-list { display: flex; flex-direction: column; gap: 0.35rem; }
  .type-row { width: 100%; display: grid; grid-template-columns: 2.3rem minmax(0, 1fr) auto 1rem; gap: 0.65rem; align-items: center; padding: 0.7rem 0.75rem; border: 1px solid rgba(65, 75, 67, 0.14); border-radius: 0; background: rgba(255, 253, 249, 0.84); color: #33463d; font: inherit; text-align: left; cursor: pointer; }
  .type-row:hover, .type-row.selected { border-color: #b4c9b5; background: #f0f6ef; }
  .type-row-index { color: #b26b4d; font-family: Georgia, "Times New Roman", serif; font-size: 1.25rem; }
  .type-row-copy { min-width: 0; }
  .type-row-copy strong, .type-row-copy small { display: block; }
  .type-row-copy strong { color: #365541; font-size: 0.82rem; line-height: 1.25; }
  .type-row-copy small { margin-top: 0.2rem; overflow-wrap: anywhere; color: #718077; font-size: 0.61rem; line-height: 1.35; }
  .type-row-status { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.25rem; }
  .type-row-status span { padding: 0.25rem 0.35rem; color: #735234; background: #f6e7d8; font-size: 0.55rem; font-weight: 750; line-height: 1.15; }
  .type-row-status span + span { color: #516855; background: #e8f0e6; }
  .type-row-arrow { color: #a15c44; font-size: 1rem; }
  .empty-results { margin-top: 0.45rem; padding: 1.3rem; border: 1px dashed #cdbbaa; background: rgba(255, 249, 241, 0.72); }
  .empty-results h4 { margin: 0; color: #48634e; font-size: 0.84rem; }
  .empty-results p { margin: 0.35rem 0 0; color: #68746b; font-size: 0.68rem; line-height: 1.45; }
  .pagination { display: flex; justify-content: space-between; align-items: center; gap: 0.6rem; margin-top: 0.7rem; }
  .pagination span { color: #68746b; font-size: 0.63rem; }
  .prototype-detail { min-width: 0; margin-top: 1rem; padding: 1.1rem; border: 1px solid #d0b49f; background: rgba(255, 253, 249, 0.9); scroll-margin-top: 1rem; }
  .prototype-detail h3 { margin: 0; color: #304c3d; font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.45rem, 2.5vw, 2.1rem); font-weight: 400; letter-spacing: -0.035em; }
  .technical-details { margin-top: 0.9rem; padding-top: 0.7rem; border-top: 1px solid rgba(65, 75, 67, 0.12); }
  .technical-details summary { color: #68746b; cursor: pointer; font-size: 0.61rem; font-weight: 700; }
  .technical-details dl { margin: 0.65rem 0 0; }
  .technical-details dl > div { display: grid; grid-template-columns: 5.5rem minmax(0, 1fr); gap: 0.4rem; margin-top: 0.3rem; }
  .technical-details dt { color: #758078; font-size: 0.58rem; }
  .technical-details dd { min-width: 0; margin: 0; color: #8f5b42; }
  .prototype-heading { display: flex; justify-content: space-between; gap: 1rem; align-items: start; }
  .family-line { margin: 0.35rem 0 0; color: #4f7057; }
  .prototype-badges { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.3rem; max-width: 11rem; }
  .prototype-badges span, .importance-badge, .origin-badge { display: inline-flex; align-items: center; padding: 0.24rem 0.35rem; font-size: 0.55rem; font-weight: 750; line-height: 1.15; }
  .prototype-badges span { color: #735234; background: #f6e7d8; }
  .prototype-badges span + span { color: #516855; background: #e8f0e6; }
  .ancestry-line { margin: 0.9rem 0 0; padding: 0.55rem 0.65rem; border-left: 2px solid #cf9a7b; background: #faf5ee; }
  .ancestry-line strong { color: #80533f; }
  .feature-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-top: 0.9rem; }
  .feature-group { min-width: 0; }
  .feature-group h4, .matcher-policy h4, .provenance-block h4 { margin: 0; color: #48634e; font-size: 0.68rem; letter-spacing: 0.04em; }
  .feature-list { display: flex; flex-direction: column; gap: 0.35rem; margin: 0.5rem 0 0; padding: 0; list-style: none; }
  .feature-list li { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "origin importance" "copy copy"; gap: 0.38rem 0.5rem; align-items: start; padding: 0.55rem; border: 1px solid rgba(65, 75, 67, 0.11); background: #fbf8f3; }
  .origin-badge.own { color: #416149; background: #e7f1e6; }
  .origin-badge.inherited { color: #785e43; background: #f7eadb; }
  .origin-badge { grid-area: origin; justify-self: start; }
  .feature-copy { min-width: 0; grid-area: copy; }
  .feature-copy strong, .feature-copy small { display: block; }
  .feature-copy strong { color: #3e5948; font-size: 0.72rem; line-height: 1.3; }
  .feature-copy small { margin-top: 0.18rem; color: #68746b; font-size: 0.59rem; line-height: 1.35; }
  .importance-badge { grid-area: importance; justify-self: end; color: #7f5945; background: #f5eee6; white-space: normal; text-align: right; }
  .identity-group { grid-column: 1 / -1; padding-top: 0.75rem; border-top: 1px dashed rgba(65, 75, 67, 0.16); }
  .empty-group { margin: 0.5rem 0 0; color: #6d756d; font-size: 0.65rem; line-height: 1.45; }
  .matcher-policy { margin-top: 0.9rem; padding: 0.75rem; border: 1px solid #dbe5da; background: #f4faf3; }
  .matcher-policy p { margin: 0.35rem 0 0; color: #8f5b42; }
  .matcher-policy ul { margin: 0.55rem 0 0; padding-left: 1rem; color: #5d6b61; font-size: 0.63rem; line-height: 1.5; }
  .provenance-block { margin-top: 0.9rem; padding-top: 0.75rem; border-top: 1px solid rgba(65, 75, 67, 0.13); }
  .provenance-block p { margin: 0.4rem 0 0; color: #626d65; font-size: 0.62rem; line-height: 1.45; }
  .provenance-block strong { color: #4f6955; }
  .prototype-technical { margin-top: 0.85rem; }
  .site-footer { width: min(1600px, calc(100% - 2rem)); margin: 0 auto; padding: 2.2rem 0 2.8rem; display: flex; justify-content: space-between; gap: 1rem; color: #5f6860; }
  @media (max-width: 900px) { .catalog-metadata { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 720px) { main, .site-footer { width: min(100% - 1.2rem, 1400px); } .topbar { height: 68px; padding: 0 0.8rem; } .brand-name { font-size: 0.72rem; } .brand-eyebrow { font-size: 0.52rem; } .topnav { gap: 0.55rem; font-size: 0.68rem; } .nav-current, .nav-divider { display: none; } .catalog-hero { min-height: 300px; padding: 3.7rem 0 2.5rem; display: block; } .hero-copy h1 { font-size: clamp(2.8rem, 15vw, 5rem); } .hero-copy p { font-size: 0.88rem; } .hero-index { margin-top: 2rem; justify-content: flex-end; } .catalog-control, .explorer-toolbar { grid-template-columns: 1fr; gap: 1rem; padding: 1rem; } .catalog-metadata { grid-template-columns: 1fr; } .catalog-section { padding-top: 2.5rem; } .explorer-layout { grid-template-columns: 1fr; } .family-browser { position: static; } .family-tree { max-height: 22rem; } .prototype-heading { display: block; } .prototype-badges { justify-content: flex-start; max-width: none; margin-top: 0.7rem; } .type-row { grid-template-columns: 2rem minmax(0, 1fr) auto; align-items: start; } .type-row-status { grid-column: 2 / -1; justify-content: flex-start; } .type-row-arrow { display: none; } .feature-columns { grid-template-columns: 1fr; } .identity-group { grid-column: auto; } .site-footer { gap: 0.6rem; flex-wrap: wrap; } }
</style>
