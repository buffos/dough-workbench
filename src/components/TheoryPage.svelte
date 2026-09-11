<script lang="ts">
  import { THEORY_CONTENT } from '../lib/i18n/theory-content';
  import { localeHref, t, type Locale } from '../lib/i18n/messages';

  export let locale: Locale;
  export let basePath = '/';

  $: content = THEORY_CONTENT[locale];
  $: workspaceHref = localeHref(basePath, locale);
  $: helpHref = `${workspaceHref}help/`;
  $: catalogHref = `${workspaceHref}catalog/`;
  $: languageHref = `${localeHref(basePath, locale === 'en' ? 'el' : 'en')}theory/`;
</script>

<svelte:head>
  <title>{locale === 'el' ? 'Dough Formula Intelligence — Θεωρία' : 'Dough Formula Intelligence — Theory'}</title>
  <meta
    name="description"
    content={locale === 'el'
      ? 'Επεξήγηση της λειτουργίας των υλικών, της δομής, της ενυδάτωσης και της διαδικασίας στις ζύμες και στους χυλούς.'
      : 'A practical guide to ingredient function, structure, hydration, and process in doughs and batters.'}
  />
</svelte:head>

<div class="theory-shell">
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
      <span class="nav-current">{t(locale, 'nav.theory')}</span>
      <span class="nav-divider" aria-hidden="true"></span>
      <a class="language-link" href={languageHref}>
        <span class="language-dot" aria-hidden="true"></span>
        {t(locale, 'nav.language')}
      </a>
    </nav>
  </header>

  <main>
    <section class="theory-hero">
      <div class="hero-kicker"><span class="kicker-line"></span>{content.eyebrow}</div>
      <div class="hero-copy">
        <div class="hero-badge">{content.sourceLabel} · 14</div>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
        <p class="source-note">{content.sourceNote}</p>
      </div>
      <div class="hero-index" aria-hidden="true">
        <span>THEORY</span>
        <span class="hero-index-rule"></span>
        <span>DFI</span>
      </div>
    </section>

    <div class="theory-layout">
      <aside class="theory-index">
        <p class="index-title">{content.contentsTitle}</p>
        <nav aria-label={content.contentsTitle}>
          {#each content.chapters as chapter (chapter.id)}
            <a href={`#${chapter.id}`}>
              <span>{String(chapter.number).padStart(2, '0')}</span>
              <span>{chapter.title}</span>
            </a>
          {/each}
        </nav>
      </aside>

      <article class="theory-content">
        {#each content.chapters as chapter (chapter.id)}
          <section class="theory-chapter" id={chapter.id} aria-labelledby={`${chapter.id}-title`}>
            <div class="chapter-heading">
              <div>
                <p class="section-kicker">{chapter.eyebrow}</p>
                <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
                <p class="chapter-intro">{chapter.intro}</p>
              </div>
              <span class="chapter-number" aria-label={`${content.chapterLabel} ${chapter.number}`}>
                {String(chapter.number).padStart(2, '0')}
              </span>
            </div>

            <div class="theory-blocks">
              {#each chapter.blocks as block (block.title)}
                <article class="theory-block">
                  <h3>{block.title}</h3>
                  {#each block.paragraphs as paragraph, paragraphIndex (paragraphIndex)}
                    <p>{paragraph}</p>
                  {/each}
                  {#if block.bullets}
                    <ul>
                      {#each block.bullets as bullet (bullet)}
                        <li>{bullet}</li>
                      {/each}
                    </ul>
                  {/if}
                </article>
              {/each}
            </div>

            {#if chapter.table}
              <div class="table-card">
                <p class="table-label">{content.tableLabel}</p>
                <div class="table-scroll">
                  <table>
                    <caption>{chapter.table.caption}</caption>
                    <thead>
                      <tr>
                        {#each chapter.table.columns as column (column)}
                          <th scope="col">{column}</th>
                        {/each}
                      </tr>
                    </thead>
                    <tbody>
                      {#each chapter.table.rows as row, rowIndex (rowIndex)}
                        <tr>
                          {#each row as cell, index (index)}
                            {#if index === 0}
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
                {#if chapter.table.note}
                  <p class="table-note"><strong>{content.noteLabel}:</strong> {chapter.table.note}</p>
                {/if}
              </div>
            {/if}

            {#if chapter.callout}
              <aside class="chapter-callout">
                <span class="callout-mark" aria-hidden="true">→</span>
                <div>
                  <p class="callout-label">{chapter.callout.label}</p>
                  <p>{chapter.callout.body}</p>
                </div>
              </aside>
            {/if}
          </section>
        {/each}
      </article>
    </div>
  </main>

  <footer class="site-footer">
    <span>© 2026 DFI</span>
    <span>{locale === 'el' ? 'Εσωτερική τεκμηρίωση • χωρίς λογαριασμό ή backend' : 'Internal documentation • no account or backend'}</span>
  </footer>
</div>

<style>
  :global(html) { background: #f5f1eb; scroll-behavior: smooth; }
  :global(body) { margin: 0; background: #f5f1eb; color: #28332e; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  :global(*) { box-sizing: border-box; }
  :global(a) { -webkit-tap-highlight-color: transparent; }
  .theory-shell { min-height: 100vh; background: radial-gradient(circle at 82% 9%, rgba(222, 161, 112, 0.16), transparent 26rem), #f5f1eb; }
  .topbar { height: 76px; padding: 0 clamp(1.25rem, 5vw, 5.6rem); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(42, 50, 45, 0.16); }
  .brand { display: inline-flex; align-items: center; gap: 0.7rem; color: inherit; text-decoration: none; }
  .brand-mark { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid #a65e43; border-radius: 50%; color: #7f422f; font-size: 0.58rem; font-weight: 800; letter-spacing: -0.05em; }
  .brand-copy { display: flex; flex-direction: column; gap: 0.15rem; }
  .brand-eyebrow, .section-kicker, .index-title, .site-footer, .table-label { font-size: 0.66rem; letter-spacing: 0.15em; text-transform: uppercase; }
  .brand-eyebrow { color: #724534; font-weight: 800; }
  .brand-name { font-size: 0.86rem; line-height: 0.92; font-weight: 740; letter-spacing: -0.03em; }
  .topnav { display: flex; gap: 0.9rem; align-items: center; font-size: 0.78rem; }
  .workspace-link, .help-link, .catalog-link, .language-link { color: #304b3d; font-weight: 750; text-decoration: none; }
  .workspace-link:hover, .help-link:hover, .catalog-link:hover, .language-link:hover { color: #944b35; }
  .nav-current { color: #5b675f; }
  .nav-divider { width: 1px; height: 16px; background: rgba(42, 50, 45, 0.22); }
  .language-link { display: inline-flex; gap: 0.45rem; align-items: center; }
  .language-dot { width: 6px; height: 6px; display: inline-block; background: #bd6848; border-radius: 50%; }
  main { width: min(1600px, calc(100% - 2rem)); margin: 0 auto; }
  .theory-hero { min-height: 360px; padding: clamp(3rem, 8vw, 7rem) 0 3.6rem; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; position: relative; }
  .hero-kicker { grid-column: 1 / -1; display: flex; gap: 0.7rem; align-items: center; color: #814833; font-size: 0.66rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
  .kicker-line { width: 36px; height: 1px; background: #b96647; }
  .hero-copy { max-width: 930px; grid-column: 1; }
  .hero-badge { display: inline-flex; margin-top: 1.35rem; padding: 0.38rem 0.55rem; background: #e9f0e8; color: #315344; font-size: 0.68rem; font-weight: 750; letter-spacing: 0.04em; }
  .hero-copy h1 { max-width: 900px; margin: 0.85rem 0 1rem; color: #263d34; font-family: Georgia, "Times New Roman", serif; font-size: clamp(3rem, 6vw, 6.7rem); font-weight: 400; line-height: 0.92; letter-spacing: -0.065em; }
  .hero-copy > p:not(.source-note) { max-width: 760px; margin: 0; color: #4d5d53; font-size: 0.98rem; line-height: 1.68; }
  .source-note { max-width: 760px; margin: 1rem 0 0; padding-left: 0.85rem; border-left: 2px solid #c98162; color: #59665d; font-size: 0.75rem; line-height: 1.6; }
  .hero-index { grid-column: 2; display: flex; align-items: center; gap: 0.65rem; padding-bottom: 0.35rem; color: #5f6c64; font-size: 0.68rem; letter-spacing: 0.12em; }
  .hero-index-rule { width: 52px; height: 1px; background: #aeb8ae; }
  .theory-layout { display: grid; grid-template-columns: minmax(190px, 0.28fr) minmax(0, 0.72fr); gap: clamp(2rem, 7vw, 7rem); padding: 2rem 0 4rem; border-top: 1px solid rgba(42, 50, 45, 0.18); }
  .theory-index { position: sticky; top: 1.5rem; align-self: start; }
  .index-title { margin: 0 0 1rem; color: #814833; font-weight: 800; }
  .theory-index nav { display: grid; gap: 0.65rem; }
  .theory-index a { display: grid; grid-template-columns: 1.8rem 1fr; gap: 0.55rem; color: #485c50; font-size: 0.74rem; line-height: 1.35; text-decoration: none; }
  .theory-index a span:first-child { color: #914b36; font-family: Georgia, "Times New Roman", serif; }
  .theory-index a:hover, .theory-index a:focus-visible { color: #8f4d38; }
  .theory-content { min-width: 0; }
  .theory-chapter { scroll-margin-top: 1.5rem; padding: 0 0 3.6rem; }
  .theory-chapter + .theory-chapter { padding-top: 3.6rem; border-top: 1px solid rgba(65, 75, 67, 0.17); }
  .chapter-heading { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 1.5rem; align-items: start; }
  .section-kicker, .table-label, .callout-label { margin: 0 0 0.55rem; color: #814833; font-weight: 800; }
  .chapter-heading h2 { max-width: 850px; margin: 0; color: #273f35; font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.9rem, 3.3vw, 3.25rem); font-weight: 400; line-height: 1.02; letter-spacing: -0.055em; }
  .chapter-intro { max-width: 790px; margin: 0.8rem 0 1.8rem; color: #4d5d53; font-size: 0.88rem; line-height: 1.7; }
  .chapter-number { color: #a15a40; font-family: Georgia, "Times New Roman", serif; font-size: clamp(2.4rem, 5vw, 4.5rem); line-height: 0.9; }
  .theory-blocks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.85rem; }
  .theory-block { padding: 1.15rem; border: 1px solid rgba(65, 75, 67, 0.17); background: rgba(255, 253, 249, 0.8); }
  .theory-block h3 { margin: 0; color: #2e4d3d; font-size: 0.94rem; line-height: 1.35; }
  .theory-block p { margin: 0.72rem 0 0; color: #4c5a51; font-size: 0.78rem; line-height: 1.66; }
  .theory-block ul { margin: 0.8rem 0 0; padding-left: 1.1rem; color: #4c5a51; font-size: 0.75rem; line-height: 1.6; }
  .theory-block li + li { margin-top: 0.3rem; }
  .table-card { margin-top: 1.15rem; padding: 1.15rem; border: 1px solid rgba(65, 75, 67, 0.17); background: rgba(250, 247, 241, 0.78); }
  .table-scroll { overflow-x: auto; }
  table { width: 100%; min-width: 510px; border-collapse: collapse; color: #3f5147; font-size: 0.73rem; line-height: 1.45; }
  caption { margin-bottom: 0.7rem; color: #30483b; font-family: Georgia, "Times New Roman", serif; font-size: 1.08rem; text-align: left; }
  th, td { padding: 0.62rem 0.55rem; border-top: 1px solid rgba(65, 75, 67, 0.14); text-align: left; vertical-align: top; }
  thead th { color: #6f4435; font-size: 0.64rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; }
  tbody th { min-width: 9rem; color: #304c3d; font-weight: 750; }
  .table-note { margin: 0.85rem 0 0; color: #59665d; font-size: 0.71rem; line-height: 1.55; }
  .table-note strong { color: #714635; }
  .chapter-callout { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 0.8rem; margin-top: 1.15rem; padding: 1rem 1.1rem; border: 1px solid #b8d0bc; background: #edf6ee; color: #365644; }
  .callout-mark { color: #b16043; font-size: 1.15rem; font-weight: 800; line-height: 1; }
  .chapter-callout .callout-label { color: #315442; font-size: 0.71rem; letter-spacing: 0.08em; }
  .chapter-callout p:last-child { margin: 0.2rem 0 0; color: #3e5d49; font-size: 0.77rem; line-height: 1.62; }
  .site-footer { width: min(1600px, calc(100% - 2rem)); margin: 0 auto; padding: 2.2rem 0 2.8rem; display: flex; justify-content: space-between; gap: 1rem; color: #56645b; }
  @media (max-width: 900px) {
    .theory-layout { grid-template-columns: 1fr; gap: 2rem; }
    .theory-index { position: static; }
    .theory-index nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 720px) {
    main, .site-footer { width: min(100% - 1.2rem, 1400px); }
    .topbar { height: 68px; padding: 0 0.8rem; }
    .brand-name { font-size: 0.72rem; }
    .brand-eyebrow { font-size: 0.52rem; }
    .topnav { gap: 0.55rem; font-size: 0.68rem; }
    .nav-current, .nav-divider { display: none; }
    .theory-hero { min-height: 340px; padding: 3.7rem 0 2.5rem; display: block; }
    .hero-copy h1 { font-size: clamp(2.8rem, 15vw, 5rem); }
    .hero-copy > p:not(.source-note) { font-size: 0.88rem; }
    .hero-index { margin-top: 2rem; justify-content: flex-end; }
    .theory-index nav, .theory-blocks { grid-template-columns: 1fr; }
    .theory-chapter { padding-bottom: 2.6rem; }
    .theory-chapter + .theory-chapter { padding-top: 2.6rem; }
    .chapter-heading { gap: 0.8rem; }
    .chapter-number { font-size: 2.3rem; }
    .table-card { padding: 0.85rem; }
    .site-footer { gap: 0.6rem; flex-wrap: wrap; }
  }
</style>
