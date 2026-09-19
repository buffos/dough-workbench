<script lang="ts">
  import { HELP_CONTENT } from '../lib/i18n/help-content';
  import { localeHref, t, type Locale } from '../lib/i18n/messages';

  export let locale: Locale;
  export let basePath = '/';

  $: content = HELP_CONTENT[locale];
  $: workspaceHref = localeHref(basePath, locale);
  $: languageHref = localeHref(basePath, locale === 'en' ? 'el' : 'en') + 'help/';
</script>

<svelte:head>
  <title>{locale === 'el' ? 'Dough Formula Intelligence — Ορολογία' : 'Dough Formula Intelligence — Help'}</title>
  <meta
    name="description"
    content={locale === 'el'
      ? 'Ορολογία και επεξηγήσεις για τη φόρμουλα, τη σύσταση και τους υπολογισμούς του Dough Formula Intelligence.'
      : 'Terminology and explanations for formula structure, composition, and calculations in Dough Formula Intelligence.'}
  />
</svelte:head>

<div class="help-shell">
  <header class="topbar">
    <a class="brand" href={workspaceHref} aria-label="Dough Formula Intelligence">
      <span class="brand-mark" aria-hidden="true">D/F</span>
      <span class="brand-copy">
        <span class="brand-eyebrow">DOUGH FORMULA INTELLIGENCE</span>
        <span class="brand-name">Dough Formula<br />Intelligence</span>
      </span>
    </a>
    <nav class="topnav" aria-label={locale === 'el' ? 'Πλοήγηση' : 'Site navigation'}>
      <a class="workspace-link" href={workspaceHref}>{content.backToWorkspace}</a>
      <a class="catalog-link" href={`${workspaceHref}catalog/`}>{t(locale, 'nav.catalog')}</a>
      <a class="catalog-link" href={`${workspaceHref}theory/`}>{t(locale, 'nav.theory')}</a>
      <span class="nav-current">{content.eyebrow.split(' & ')[0]}</span>
      <span class="nav-divider" aria-hidden="true"></span>
      <a class="language-link" href={languageHref}>
        <span class="language-dot" aria-hidden="true"></span>
        {locale === 'el' ? 'English' : 'Ελληνικά'}
      </a>
    </nav>
  </header>

  <main>
    <section class="help-hero">
      <div class="hero-kicker"><span class="kicker-line"></span>{content.eyebrow}</div>
      <div class="hero-copy">
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
      </div>
    </section>

    <div class="help-layout">
      <aside class="help-index">
        <p class="index-title">{content.contentsTitle}</p>
        <nav aria-label={content.contentsTitle}>
          {#each content.sections as section, index (section.id)}
            <a href={`#${section.id}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {section.title}
            </a>
          {/each}
        </nav>
      </aside>

      <article class="help-content">
        {#each content.sections as section (section.id)}
          <section class="help-section" id={section.id}>
            <p class="section-kicker">{section.eyebrow}</p>
            <h2>{section.title}</h2>
            <p class="section-intro">{section.intro}</p>
            <div class="help-entries">
              {#each section.entries as entry (entry.title)}
                <article class="help-entry">
                  <h3>
                    {entry.title}
                    {#if entry.canonical}<span>{entry.canonical}</span>{/if}
                  </h3>
                  <p>{entry.body}</p>
                  {#if entry.examples}
                    <p class="entry-examples"><strong>{content.exampleLabel}:</strong> {entry.examples}</p>
                  {/if}
                  {#if entry.note}
                    <p class="entry-note"><strong>{content.noteLabel}:</strong> {entry.note}</p>
                  {/if}
                </article>
              {/each}
            </div>
          </section>
        {/each}
      </article>
    </div>
  </main>

</div>

<style>
  :global(html) { background: #f5f1eb; scroll-behavior: smooth; }
  :global(body) { margin: 0; background: #f5f1eb; color: #242c29; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  :global(*) { box-sizing: border-box; }
  :global(a) { -webkit-tap-highlight-color: transparent; }
  .help-shell { min-height: 100vh; background: radial-gradient(circle at 82% 9%, rgba(222, 161, 112, 0.17), transparent 26rem), #f5f1eb; }
  .topbar { height: 76px; padding: 0 clamp(1.25rem, 5vw, 5.6rem); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(42, 50, 45, 0.13); }
  .brand { display: inline-flex; align-items: center; gap: 0.7rem; color: inherit; text-decoration: none; }
  .brand-mark { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid #b87957; border-radius: 50%; color: #914d38; font-size: 0.58rem; font-weight: 800; letter-spacing: -0.05em; }
  .brand-copy { display: flex; flex-direction: column; gap: 0.15rem; }
  .brand-eyebrow, .section-kicker, .index-title { font-size: 0.66rem; letter-spacing: 0.15em; text-transform: uppercase; }
  .brand-eyebrow { color: #7b4f3f; font-weight: 760; }
  .brand-name { font-size: 0.86rem; line-height: 0.92; font-weight: 740; letter-spacing: -0.03em; }
  .topnav { display: flex; gap: 0.9rem; align-items: center; font-size: 0.78rem; }
  .workspace-link, .catalog-link, .language-link { color: #34483e; font-weight: 700; text-decoration: none; }
  .workspace-link:hover, .catalog-link:hover, .language-link:hover { color: #a24e37; }
  .nav-current { color: #5f6c64; }
  .nav-divider { width: 1px; height: 16px; background: rgba(42, 50, 45, 0.18); }
  .language-link { display: inline-flex; gap: 0.45rem; align-items: center; }
  .language-dot { width: 6px; height: 6px; display: inline-block; background: #cc7853; border-radius: 50%; }
  main { width: min(1600px, calc(100% - 2rem)); margin: 0 auto; }
  .help-hero { min-height: 320px; padding: clamp(3rem, 8vw, 7rem) 0 3.6rem; display: grid; grid-template-columns: 1fr; align-items: end; position: relative; }
  .hero-kicker { grid-column: 1 / -1; display: flex; gap: 0.7rem; align-items: center; color: #8b4f3b; font-size: 0.66rem; font-weight: 760; letter-spacing: 0.15em; text-transform: uppercase; }
  .kicker-line { width: 36px; height: 1px; background: #c77954; }
  .hero-copy { max-width: 780px; grid-column: 1; }
  .hero-copy h1 { max-width: 790px; margin: 1.1rem 0 1rem; color: #263d34; font-family: Georgia, "Times New Roman", serif; font-size: clamp(3rem, 6vw, 6.7rem); font-weight: 400; line-height: 0.92; letter-spacing: -0.065em; }
  .hero-copy p { max-width: 660px; margin: 0; color: #58665d; font-size: 0.97rem; line-height: 1.65; }
  .help-layout { display: grid; grid-template-columns: minmax(190px, 0.28fr) minmax(0, 0.72fr); gap: clamp(2rem, 7vw, 7rem); padding: 2rem 0 4rem; border-top: 1px solid rgba(42, 50, 45, 0.16); }
  .help-index { position: sticky; top: 1.5rem; align-self: start; }
  .index-title { margin: 0 0 1rem; color: #8b4f3b; font-weight: 800; }
  .help-index nav { display: grid; gap: 0.65rem; }
  .help-index a { display: grid; grid-template-columns: 1.8rem 1fr; gap: 0.55rem; color: #52665a; font-size: 0.74rem; line-height: 1.35; text-decoration: none; }
  .help-index a span { color: #9b5c42; font-family: Georgia, "Times New Roman", serif; }
  .help-index a:hover { color: #8f503a; }
  .help-content { min-width: 0; }
  .help-section { scroll-margin-top: 1.5rem; padding: 0 0 3.4rem; }
  .help-section + .help-section { padding-top: 3.4rem; border-top: 1px solid rgba(65, 75, 67, 0.14); }
  .section-kicker { margin: 0 0 0.55rem; color: #8b4f3b; font-weight: 800; }
  .help-section h2 { margin: 0; color: #273f35; font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.8rem, 3vw, 3rem); font-weight: 400; letter-spacing: -0.05em; }
  .section-intro { max-width: 730px; margin: 0.75rem 0 1.5rem; color: #5f6c64; font-size: 0.84rem; line-height: 1.65; }
  .help-entries { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.8rem; }
  .help-entry { padding: 1rem; border: 1px solid rgba(65, 75, 67, 0.14); background: rgba(255, 253, 249, 0.76); }
  .help-entry h3 { margin: 0; color: #304c3d; font-size: 0.9rem; line-height: 1.35; }
  .help-entry h3 span { display: block; margin-top: 0.22rem; color: #8f5b42; font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.59rem; font-weight: 500; }
  .help-entry p { margin: 0.7rem 0 0; color: #5d665e; font-size: 0.75rem; line-height: 1.58; }
  .help-entry .entry-examples { color: #526b59; }
  .help-entry .entry-note { padding-top: 0.65rem; border-top: 1px solid rgba(65, 75, 67, 0.12); color: #705441; font-size: 0.7rem; }
  .help-entry strong { font-weight: 750; }
  @media (max-width: 900px) { .help-layout { grid-template-columns: 1fr; gap: 2rem; } .help-index { position: static; } .help-index nav { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 720px) { main { width: min(100% - 1.2rem, 1400px); } .topbar { height: 68px; padding: 0 0.8rem; } .brand-name { font-size: 0.72rem; } .brand-eyebrow { font-size: 0.52rem; } .topnav { gap: 0.55rem; font-size: 0.68rem; } .nav-current, .nav-divider { display: none; } .help-hero { min-height: 300px; padding: 3.7rem 0 2.5rem; display: block; } .hero-copy h1 { font-size: clamp(2.8rem, 15vw, 5rem); } .hero-copy p { font-size: 0.88rem; } .help-index nav, .help-entries { grid-template-columns: 1fr; } .help-section { padding-bottom: 2.5rem; } .help-section + .help-section { padding-top: 2.5rem; } }
</style>
