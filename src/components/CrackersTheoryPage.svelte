<script lang="ts">
  import { CRACKER_CONTENT } from '../lib/i18n/cracker-content';
  import { localeHref, t, type Locale } from '../lib/i18n/messages';

  export let locale: Locale;
  export let basePath = '/';

  $: content = CRACKER_CONTENT[locale];
  $: workspaceHref = localeHref(basePath, locale);
  $: theoryHref = `${workspaceHref}theory/`;
  $: helpHref = `${workspaceHref}help/`;
  $: catalogHref = `${workspaceHref}catalog/`;
  $: referencesHref = `${workspaceHref}catalog/?family=family.short-fat-shortened&type=prototype.crackers`;
  $: languageHref = `${localeHref(basePath, locale === 'en' ? 'el' : 'en')}theory/crackers/`;
</script>

<svelte:head>
  <title>{locale === 'el' ? 'Dough Formula Intelligence - Κράκερ' : 'Dough Formula Intelligence - Crackers'}</title>
  <meta
    name="description"
    content={locale === 'el'
      ? 'Θεωρία, πίνακες και φόρμουλες αναφοράς για κράκερ, από λεπτά τραγανά φύλλα έως πλούσια savoury biscuits.'
      : 'Theory, tables, and reference formulas for crackers, from lean crisp sheets to rich savoury biscuits.'}
  />
</svelte:head>

<div class="crackers-shell">
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
      <a class="catalog-link" href={catalogHref}>{t(locale, 'nav.catalog')}</a>
      <a class="theory-link" href={theoryHref}>{content.backToTheory}</a>
      <span class="nav-current">{locale === 'el' ? 'Κράκερ' : 'Crackers'}</span>
      <span class="nav-divider" aria-hidden="true"></span>
      <a class="language-link" href={languageHref}>
        <span class="language-dot" aria-hidden="true"></span>
        {t(locale, 'nav.language')}
      </a>
    </nav>
  </header>

  <main>
    <section class="crackers-hero">
      <div class="hero-kicker"><span class="kicker-line"></span>{content.eyebrow}</div>
      <div class="hero-copy">
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
        <a class="reference-link" href={referencesHref}>
          <span>{content.linkToReferences}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>

    <div class="crackers-layout">
      <aside class="crackers-index">
        <p class="index-title">{content.contentsTitle}</p>
        <nav aria-label={content.contentsTitle}>
          {#each content.sections as section (section.id)}
            <a href={`#${section.id}`}>
              <span>{String(section.number).padStart(2, '0')}</span>
              <span>{section.title}</span>
            </a>
          {/each}
        </nav>
      </aside>

      <article class="crackers-content">
        {#each content.sections as section (section.id)}
          <section class="crackers-section" id={section.id} aria-labelledby={`${section.id}-title`}>
            <div class="section-heading">
              <div>
                <p class="section-kicker">{section.eyebrow}</p>
                <h2 id={`${section.id}-title`}>{section.title}</h2>
                <p class="section-intro">{section.intro}</p>
              </div>
              <span class="section-number" aria-label={`${content.sectionLabel} ${section.number}`}>
                {String(section.number).padStart(2, '0')}
              </span>
            </div>

            {#if section.paragraphs}
              <div class="paragraphs">
                {#each section.paragraphs as paragraph (paragraph)}
                  <p>{paragraph}</p>
                {/each}
              </div>
            {/if}

            {#if section.bullets}
              <ul class="section-bullets">
                {#each section.bullets as bullet (bullet)}
                  <li>{bullet}</li>
                {/each}
              </ul>
            {/if}

            {#if section.table}
              <div class="table-card">
                <p class="table-label">{content.tableLabel}</p>
                <div class="table-scroll">
                  <table>
                    <caption>{section.table.caption}</caption>
                    <thead>
                      <tr>
                        {#each section.table.columns as column, columnIndex (`${section.id}-column-${columnIndex}`)}
                          <th scope="col">{column}</th>
                        {/each}
                      </tr>
                    </thead>
                    <tbody>
                      {#each section.table.rows as row, rowIndex (`${section.id}-row-${rowIndex}`)}
                        <tr>
                          {#each row as cell, cellIndex (`${section.id}-row-${rowIndex}-cell-${cellIndex}`)}
                            {#if cellIndex === 0}
                              <th scope="row">{cell}</th>
                            {:else}
                              <td>{cell}</td>
                            {/if}
                          {/each}
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
                {#if section.table.note}
                  <p class="table-note"><strong>{content.noteLabel}:</strong> {section.table.note}</p>
                {/if}
              </div>
            {/if}
          </section>
        {/each}
      </article>
    </div>
  </main>
</div>

<style>
  :global(html) { background: #f5f1eb; scroll-behavior: smooth; }
  :global(body) { margin: 0; background: #f5f1eb; color: #28332e; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  :global(*) { box-sizing: border-box; }
  :global(a) { -webkit-tap-highlight-color: transparent; }
  .crackers-shell { min-height: 100vh; background: radial-gradient(circle at 82% 9%, rgba(222, 161, 112, 0.16), transparent 26rem), #f5f1eb; }
  .topbar { min-height: 76px; padding: 0 clamp(1.25rem, 5vw, 5.6rem); display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgba(42, 50, 45, 0.16); }
  .brand { display: inline-flex; align-items: center; gap: 0.7rem; color: inherit; text-decoration: none; }
  .brand-mark { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid #a65e43; border-radius: 50%; color: #7f422f; font-size: 0.58rem; font-weight: 800; letter-spacing: -0.05em; }
  .brand-copy { display: flex; flex-direction: column; gap: 0.15rem; }
  .brand-eyebrow, .section-kicker, .index-title, .table-label { font-size: 0.66rem; letter-spacing: 0.15em; text-transform: uppercase; }
  .brand-eyebrow { color: #724534; font-weight: 800; }
  .brand-name { font-size: 0.86rem; line-height: 0.92; font-weight: 740; letter-spacing: -0.03em; }
  .topnav { display: flex; gap: 0.8rem; align-items: center; font-size: 0.76rem; }
  .workspace-link, .help-link, .catalog-link, .theory-link, .language-link { color: #304b3d; font-weight: 750; text-decoration: none; }
  .workspace-link:hover, .help-link:hover, .catalog-link:hover, .theory-link:hover, .language-link:hover { color: #944b35; }
  .nav-current { color: #8f503a; }
  .nav-divider { width: 1px; height: 16px; background: rgba(42, 50, 45, 0.22); }
  .language-link { display: inline-flex; gap: 0.45rem; align-items: center; }
  .language-dot { width: 6px; height: 6px; display: inline-block; background: #bd6848; border-radius: 50%; }
  main { width: min(1600px, calc(100% - 2rem)); margin: 0 auto; }
  .crackers-hero { min-height: 390px; padding: clamp(3rem, 8vw, 7rem) 0 3.6rem; display: grid; grid-template-columns: minmax(0, 1fr); align-items: end; position: relative; }
  .hero-kicker { grid-column: 1 / -1; display: flex; gap: 0.7rem; align-items: center; color: #814833; font-size: 0.66rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
  .kicker-line { width: 36px; height: 1px; background: #b96647; }
  .hero-copy { max-width: 980px; grid-column: 1; }
  .hero-copy h1 { max-width: 980px; margin: 0.85rem 0 1rem; color: #263d34; font-family: Georgia, "Times New Roman", serif; font-size: clamp(3rem, 6vw, 6.7rem); font-weight: 400; line-height: 0.92; letter-spacing: -0.065em; }
  .hero-copy > p { max-width: 820px; margin: 0; color: #4d5d53; font-size: 0.98rem; line-height: 1.68; }
  .reference-link { display: inline-flex; justify-content: space-between; gap: 1.2rem; min-width: min(100%, 340px); margin-top: 1.2rem; padding: 0.65rem 0; border-top: 1px solid #c7a58f; border-bottom: 1px solid #c7a58f; color: #8f503a; font-size: 0.75rem; font-weight: 800; text-decoration: none; }
  .reference-link:hover, .reference-link:focus-visible { color: #2f5945; }
  .crackers-layout { display: grid; grid-template-columns: minmax(190px, 0.28fr) minmax(0, 0.72fr); gap: clamp(2rem, 7vw, 7rem); padding: 2rem 0 4rem; border-top: 1px solid rgba(42, 50, 45, 0.18); }
  .crackers-index { position: sticky; top: 1.5rem; align-self: start; }
  .index-title { margin: 0 0 1rem; color: #814833; font-weight: 800; }
  .crackers-index nav { display: grid; gap: 0.65rem; }
  .crackers-index a { display: grid; grid-template-columns: 1.8rem 1fr; gap: 0.55rem; color: #485c50; font-size: 0.74rem; line-height: 1.35; text-decoration: none; }
  .crackers-index a span:first-child { color: #914b36; font-family: Georgia, "Times New Roman", serif; }
  .crackers-index a:hover, .crackers-index a:focus-visible { color: #8f4d38; }
  .crackers-content { min-width: 0; }
  .crackers-section { scroll-margin-top: 1.5rem; padding: 0 0 3.6rem; }
  .crackers-section + .crackers-section { padding-top: 3.6rem; border-top: 1px solid rgba(65, 75, 67, 0.17); }
  .section-heading { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 1.5rem; align-items: start; }
  .section-kicker, .table-label { margin: 0 0 0.55rem; color: #814833; font-weight: 800; }
  .section-heading h2 { max-width: 900px; margin: 0; color: #273f35; font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.9rem, 3.3vw, 3.25rem); font-weight: 400; line-height: 1.02; letter-spacing: -0.055em; }
  .section-intro { max-width: 850px; margin: 0.8rem 0 1.8rem; color: #4d5d53; font-size: 0.88rem; line-height: 1.7; }
  .section-number { color: #a15a40; font-family: Georgia, "Times New Roman", serif; font-size: clamp(2.4rem, 5vw, 4.5rem); line-height: 0.9; }
  .paragraphs { max-width: 850px; margin-bottom: 1.1rem; }
  .paragraphs p { margin: 0.7rem 0 0; color: #4c5a51; font-size: 0.82rem; line-height: 1.68; }
  .section-bullets { max-width: 850px; margin: 0 0 1.1rem; padding-left: 1.15rem; color: #4c5a51; font-size: 0.78rem; line-height: 1.65; }
  .section-bullets li + li { margin-top: 0.35rem; }
  .table-card { margin-top: 1.15rem; padding: 1.15rem; border: 1px solid rgba(65, 75, 67, 0.17); background: rgba(250, 247, 241, 0.78); }
  .table-scroll { overflow-x: auto; }
  table { width: 100%; min-width: 680px; border-collapse: collapse; color: #3f5147; font-size: 0.73rem; line-height: 1.45; }
  caption { margin-bottom: 0.7rem; color: #30483b; font-family: Georgia, "Times New Roman", serif; font-size: 1.08rem; text-align: left; }
  th, td { padding: 0.62rem 0.55rem; border-top: 1px solid rgba(65, 75, 67, 0.14); text-align: left; vertical-align: top; }
  thead th { color: #6f4435; font-size: 0.64rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; }
  tbody th { min-width: 9rem; color: #304c3d; font-weight: 750; }
  .table-note { margin: 0.85rem 0 0; color: #59665d; font-size: 0.71rem; line-height: 1.55; }
  .table-note strong { color: #714635; }
  @media (max-width: 1050px) {
    .topnav { flex-wrap: wrap; justify-content: flex-end; }
  }
  @media (max-width: 900px) {
    .crackers-layout { grid-template-columns: 1fr; gap: 2rem; }
    .crackers-index { position: static; }
    .crackers-index nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 720px) {
    main { width: min(100% - 1.2rem, 1400px); }
    .topbar { min-height: 68px; padding: 0.75rem 0.8rem; align-items: flex-start; }
    .brand-name { font-size: 0.72rem; }
    .brand-eyebrow { font-size: 0.52rem; }
    .topnav { gap: 0.55rem; font-size: 0.68rem; }
    .nav-current, .nav-divider { display: none; }
    .crackers-hero { min-height: 360px; padding: 3.7rem 0 2.5rem; display: block; }
    .hero-copy h1 { font-size: clamp(2.8rem, 15vw, 5rem); }
    .hero-copy > p { font-size: 0.88rem; }
    .crackers-index nav { grid-template-columns: 1fr; }
    .crackers-section { padding-bottom: 2.6rem; }
    .crackers-section + .crackers-section { padding-top: 2.6rem; }
    .section-heading { gap: 0.8rem; }
    .section-number { font-size: 2.3rem; }
    .table-card { padding: 0.85rem; }
  }
</style>
