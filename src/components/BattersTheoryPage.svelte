<script lang="ts">
  import { onMount } from 'svelte';
  import { BATTER_CONTENT } from '../lib/i18n/batter-content';
  import { localeHref, t, type Locale } from '../lib/i18n/messages';

  export let locale: Locale;
  export let basePath = '/';

  $: content = BATTER_CONTENT[locale];
  $: workspaceHref = localeHref(basePath, locale);
  $: theoryHref = `${workspaceHref}theory/`;
  $: helpHref = `${workspaceHref}help/`;
  $: catalogHref = `${workspaceHref}catalog/`;
  $: referencesHref = `${workspaceHref}catalog/?family=family.batters`;
  $: languageHref = `${localeHref(basePath, locale === 'en' ? 'el' : 'en')}theory/batters/`;

  onMount(async () => {
    const mermaidModule = await import('mermaid');
    const mermaid = mermaidModule.default;
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'base', themeVariables: { primaryColor: '#e8efe7', lineColor: '#7c4a37', primaryTextColor: '#263d34' } });
    await mermaid.run({ querySelector: '.batter-mermaid' });
  });
</script>

<svelte:head>
  <title>{locale === 'el' ? 'Dough Formula Intelligence - Batters' : 'Dough Formula Intelligence - Batters'}</title>
  <meta
    name="description"
    content={locale === 'el'
      ? 'Οδηγός για τα βασικά είδη μειγμάτων, τις αναλογίες τους, το ψήσιμο και τον τρόπο παρασκευής τους.'
      : 'A practical guide to batter types, ingredient ratios, cooking methods, and preparation.'}
  />
</svelte:head>

<div class="batter-shell">
  <header class="topbar">
    <a class="brand" href={workspaceHref} aria-label="Dough Formula Intelligence">
      <span class="brand-mark" aria-hidden="true">D/F</span>
      <span class="brand-copy">
        <span class="brand-eyebrow">DOUGH FORMULA INTELLIGENCE</span>
        <span class="brand-name">Dough Formula<br />Intelligence</span>
      </span>
    </a>
    <nav class="topnav" aria-label={locale === 'el' ? 'Πλοήγηση' : 'Site navigation'}>
      <a href={workspaceHref}>{t(locale, 'nav.workspace')}</a>
      <a href={helpHref}>{t(locale, 'nav.help')}</a>
      <a href={catalogHref}>{t(locale, 'nav.catalog')}</a>
      <a href={theoryHref}>{content.backToTheory}</a>
      <span class="nav-current">Batters</span>
      <span class="nav-divider" aria-hidden="true"></span>
      <a class="language-link" href={languageHref}><span class="language-dot" aria-hidden="true"></span>{t(locale, 'nav.language')}</a>
    </nav>
  </header>

  <main>
    <section class="batter-hero">
      <div class="hero-kicker"><span class="kicker-line"></span>{content.eyebrow}</div>
      <div class="hero-copy">
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
        <a class="reference-link" href={referencesHref}><span>{content.linkToReferences}</span><span aria-hidden="true">→</span></a>
      </div>
    </section>

    <div class="batter-layout">
      <aside class="batter-index">
        <p class="index-title">{content.contentsTitle}</p>
        <nav aria-label={content.contentsTitle}>
          {#each content.sections as section (section.id)}
            <a href={`#${section.id}`}><span>{String(section.number).padStart(2, '0')}</span><span>{section.title}</span></a>
          {/each}
        </nav>
      </aside>

      <article class="batter-content">
        {#each content.sections as section (section.id)}
          <section class="batter-section" id={section.id} aria-labelledby={`${section.id}-title`}>
            <div class="section-heading">
              <div>
                <p class="section-kicker">{section.eyebrow}</p>
                <h2 id={`${section.id}-title`}>{section.title}</h2>
                <p class="section-intro">{section.intro}</p>
              </div>
              <span class="section-number" aria-label={`${content.sectionLabel} ${section.number}`}>{String(section.number).padStart(2, '0')}</span>
            </div>

            {#if section.paragraphs}
              <div class="paragraphs">
                {#each section.paragraphs as paragraph, paragraphIndex (`${section.id}-paragraph-${paragraphIndex}`)}<p>{paragraph}</p>{/each}
              </div>
            {/if}
            {#if section.bullets}
              <ul class="section-bullets">
                {#each section.bullets as bullet, bulletIndex (`${section.id}-bullet-${bulletIndex}`)}<li>{bullet}</li>{/each}
              </ul>
            {/if}

            {#if section.diagrams}
              {#each section.diagrams as diagram (diagram.id)}
                <figure class="diagram-card">
                  <figcaption>{content.diagramLabel}: {diagram.title}</figcaption>
                  <pre class="batter-mermaid" aria-label={diagram.title}>{diagram.code}</pre>
                  <p class="diagram-fallback"><strong>{content.diagramFallbackLabel}:</strong> {diagram.fallback}</p>
                </figure>
              {/each}
            {/if}

            {#if section.tables}
              {#each section.tables as item, tableIndex (`${section.id}-table-${tableIndex}`)}
                <div class="table-card">
                  <p class="table-label">{content.tableLabel}</p>
                  <div class="table-scroll">
                    <table>
                      <caption>{item.caption}</caption>
                      <thead><tr>{#each item.columns as column, columnIndex (`${section.id}-table-${tableIndex}-column-${columnIndex}`)}<th scope="col">{column}</th>{/each}</tr></thead>
                      <tbody>
                        {#each item.rows as cells, rowIndex (`${section.id}-table-${tableIndex}-row-${rowIndex}`)}
                          <tr>{#each cells as cell, cellIndex (`${section.id}-table-${tableIndex}-row-${rowIndex}-cell-${cellIndex}`)}{#if cellIndex === 0}<th scope="row">{cell}</th>{:else}<td>{cell}</td>{/if}{/each}</tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                  {#if item.note}<p class="table-note"><strong>{content.noteLabel}:</strong> {item.note}</p>{/if}
                </div>
              {/each}
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
  .batter-shell { min-height: 100vh; background: radial-gradient(circle at 82% 9%, rgba(222, 161, 112, 0.16), transparent 26rem), #f5f1eb; }
  .topbar { min-height: 76px; padding: 0 clamp(1.25rem, 5vw, 5.6rem); display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgba(42, 50, 45, 0.16); }
  .brand { display: inline-flex; align-items: center; gap: 0.7rem; color: inherit; text-decoration: none; }
  .brand-mark { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid #a65e43; border-radius: 50%; color: #7f422f; font-size: 0.58rem; font-weight: 800; letter-spacing: -0.05em; }
  .brand-copy { display: flex; flex-direction: column; gap: 0.15rem; }
  .brand-eyebrow, .section-kicker, .index-title, .table-label { font-size: 0.66rem; letter-spacing: 0.15em; text-transform: uppercase; }
  .brand-eyebrow { color: #724534; font-weight: 800; }
  .brand-name { font-size: 0.86rem; line-height: 0.92; font-weight: 740; letter-spacing: -0.03em; }
  .topnav { display: flex; gap: 0.8rem; align-items: center; font-size: 0.76rem; flex-wrap: wrap; justify-content: flex-end; }
  .topnav a { color: #304b3d; font-weight: 750; text-decoration: none; }
  .topnav a:hover, .topnav a:focus-visible { color: #944b35; }
  .nav-current { color: #8f503a; }
  .nav-divider { width: 1px; height: 16px; background: rgba(42, 50, 45, 0.22); }
  .language-link { display: inline-flex; gap: 0.45rem; align-items: center; }
  .language-dot { width: 6px; height: 6px; display: inline-block; background: #bd6848; border-radius: 50%; }
  main { width: min(1600px, calc(100% - 2rem)); margin: 0 auto; }
  .batter-hero { min-height: 390px; padding: clamp(3rem, 8vw, 7rem) 0 3.6rem; display: grid; align-items: end; }
  .hero-kicker { display: flex; gap: 0.7rem; align-items: center; color: #814833; font-size: 0.66rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
  .kicker-line { width: 36px; height: 1px; background: #b96647; }
  .hero-copy { max-width: 1040px; }
  .hero-copy h1 { margin: 0.85rem 0 1rem; color: #263d34; font-family: Georgia, "Times New Roman", serif; font-size: clamp(3rem, 6vw, 6.7rem); font-weight: 400; line-height: 0.92; letter-spacing: -0.065em; }
  .hero-copy > p { max-width: 900px; margin: 0; color: #4d5d53; font-size: 0.98rem; line-height: 1.68; }
  .reference-link { display: inline-flex; justify-content: space-between; gap: 1.2rem; min-width: min(100%, 360px); margin-top: 1.2rem; padding: 0.65rem 0; border-top: 1px solid #c7a58f; border-bottom: 1px solid #c7a58f; color: #8f503a; font-size: 0.75rem; font-weight: 800; text-decoration: none; }
  .batter-layout { display: grid; grid-template-columns: minmax(190px, 0.25fr) minmax(0, 0.75fr); gap: clamp(2rem, 6vw, 6rem); padding: 2rem 0 4rem; border-top: 1px solid rgba(42, 50, 45, 0.18); }
  .batter-index { position: sticky; top: 1.5rem; align-self: start; }
  .index-title { margin: 0 0 1rem; color: #814833; font-weight: 800; }
  .batter-index nav { display: grid; gap: 0.65rem; }
  .batter-index a { display: grid; grid-template-columns: 1.8rem 1fr; gap: 0.55rem; color: #485c50; font-size: 0.74rem; line-height: 1.35; text-decoration: none; }
  .batter-index a span:first-child { color: #914b36; font-family: Georgia, "Times New Roman", serif; }
  .batter-index a:hover, .batter-index a:focus-visible { color: #8f4d38; }
  .batter-content { min-width: 0; }
  .batter-section { scroll-margin-top: 1.5rem; padding: 0 0 3.6rem; }
  .batter-section + .batter-section { padding-top: 3.6rem; border-top: 1px solid rgba(65, 75, 67, 0.17); }
  .section-heading { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 1.5rem; align-items: start; }
  .section-kicker, .table-label { margin: 0 0 0.55rem; color: #814833; font-weight: 800; }
  .section-heading h2 { max-width: 980px; margin: 0; color: #273f35; font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.9rem, 3.3vw, 3.25rem); font-weight: 400; line-height: 1.02; letter-spacing: -0.055em; }
  .section-intro { max-width: 900px; margin: 0.8rem 0 1.8rem; color: #4d5d53; font-size: 0.88rem; line-height: 1.7; }
  .section-number { color: #a15a40; font-family: Georgia, "Times New Roman", serif; font-size: clamp(2.4rem, 5vw, 4.5rem); line-height: 0.9; }
  .paragraphs { max-width: 900px; margin-bottom: 1.1rem; }
  .paragraphs p { margin: 0.7rem 0 0; color: #4c5a51; font-size: 0.82rem; line-height: 1.68; }
  .section-bullets { max-width: 900px; margin: 0 0 1.1rem; padding-left: 1.15rem; color: #4c5a51; font-size: 0.78rem; line-height: 1.65; }
  .table-card, .diagram-card { width: 100%; margin: 1.15rem 0 0; padding: 1.15rem; border: 1px solid rgba(65, 75, 67, 0.17); background: rgba(250, 247, 241, 0.78); }
  .table-scroll { overflow-x: auto; }
  table { width: 100%; min-width: 720px; border-collapse: collapse; color: #3f5147; font-size: 0.73rem; line-height: 1.45; }
  caption { margin-bottom: 0.7rem; color: #30483b; font-family: Georgia, "Times New Roman", serif; font-size: 1.08rem; text-align: left; }
  th, td { padding: 0.62rem 0.55rem; border-top: 1px solid rgba(65, 75, 67, 0.14); text-align: left; vertical-align: top; }
  thead th { color: #6f4435; font-size: 0.64rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; }
  tbody th { min-width: 9rem; color: #304c3d; font-weight: 750; }
  .table-note, .diagram-fallback { margin: 0.85rem 0 0; color: #59665d; font-size: 0.71rem; line-height: 1.55; }
  .table-note strong, .diagram-fallback strong { color: #714635; }
  .diagram-card figcaption { margin-bottom: 0.8rem; color: #30483b; font-family: Georgia, "Times New Roman", serif; font-size: 1.08rem; }
  .batter-mermaid { min-height: 120px; margin: 0; padding: 0.75rem; overflow-x: auto; background: #edf2eb; color: #385345; font: 0.68rem/1.45 ui-monospace, SFMono-Regular, Consolas, monospace; white-space: pre; }
  .batter-mermaid svg { max-width: 100%; height: auto; }
  @media (max-width: 900px) { .batter-layout { grid-template-columns: 1fr; gap: 2rem; } .batter-index { position: static; } .batter-index nav { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 720px) { main { width: min(100% - 1.2rem, 1400px); } .topbar { min-height: 68px; padding: 0.75rem 0.8rem; align-items: flex-start; } .brand-name { font-size: 0.72rem; } .brand-eyebrow { font-size: 0.52rem; } .topnav { gap: 0.55rem; font-size: 0.68rem; } .nav-current, .nav-divider { display: none; } .batter-hero { min-height: 360px; padding: 3.7rem 0 2.5rem; } .hero-copy h1 { font-size: clamp(2.8rem, 15vw, 5rem); } .hero-copy > p { font-size: 0.88rem; } .batter-index nav { grid-template-columns: 1fr; } .batter-section { padding-bottom: 2.6rem; } .batter-section + .batter-section { padding-top: 2.6rem; } .section-heading { gap: 0.8rem; } .section-number { font-size: 2.3rem; } .table-card, .diagram-card { padding: 0.85rem; } }
</style>
