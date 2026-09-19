import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve('dist');
const requiredFiles = ['index.html', 'en/index.html', 'el/index.html', 'en/help/index.html', 'el/help/index.html', 'en/catalog/index.html', 'el/catalog/index.html', 'en/theory/index.html', 'el/theory/index.html', 'en/theory/breadsticks/index.html', 'el/theory/breadsticks/index.html', '404.html'];
const missing = requiredFiles.filter((file) => !existsSync(resolve(dist, file)));

if (missing.length > 0) {
  console.error(`Missing static route artifacts: ${missing.join(', ')}`);
  process.exit(1);
}

const english = readFileSync(resolve(dist, 'en/index.html'), 'utf8');
const greek = readFileSync(resolve(dist, 'el/index.html'), 'utf8');
const englishHelp = readFileSync(resolve(dist, 'en/help/index.html'), 'utf8');
const greekHelp = readFileSync(resolve(dist, 'el/help/index.html'), 'utf8');
const englishCatalog = readFileSync(resolve(dist, 'en/catalog/index.html'), 'utf8');
const greekCatalog = readFileSync(resolve(dist, 'el/catalog/index.html'), 'utf8');
const englishTheory = readFileSync(resolve(dist, 'en/theory/index.html'), 'utf8');
const greekTheory = readFileSync(resolve(dist, 'el/theory/index.html'), 'utf8');
const englishBreadsticks = readFileSync(resolve(dist, 'en/theory/breadsticks/index.html'), 'utf8');
const greekBreadsticks = readFileSync(resolve(dist, 'el/theory/breadsticks/index.html'), 'utf8');
const notFound = readFileSync(resolve(dist, '404.html'), 'utf8');
const root = readFileSync(resolve(dist, 'index.html'), 'utf8');

const configuredBase = process.env.BASE_PATH || '/';
const basePrefix = configuredBase === '/' ? '' : configuredBase.replace(/\/$/, '');
/** @param {string} locale @param  {...string} suffixes */
const routeHref = (locale, ...suffixes) => `${basePrefix}/${locale}/${suffixes.filter(Boolean).join('/')}/`.replace(/\/$/, '/')
  .replace(/\/\//g, '/');

/** @type {Array<{route: string, html: string, languageMarker: string, workspaceMarker: string, routeMarkers: string[]}>} */
const requiredRouteContent = [
  { route: 'en', html: english, languageMarker: 'lang="en"', workspaceMarker: 'Formula workspace', routeMarkers: [`href="${routeHref('el')}"`, `href="${routeHref('en', 'help')}"`, `href="${routeHref('en', 'catalog')}"`] },
  { route: 'el', html: greek, languageMarker: 'lang="el"', workspaceMarker: 'Χώρος εργασίας φόρμουλας', routeMarkers: [`href="${routeHref('en')}"`, `href="${routeHref('el', 'help')}"`, `href="${routeHref('el', 'catalog')}"`] },
  { route: 'en/help', html: englishHelp, languageMarker: 'lang="en"', workspaceMarker: 'A shared language for reading a formula.', routeMarkers: [`href="${routeHref('el', 'help')}"`, `href="${routeHref('en')}"`, `href="${routeHref('en', 'catalog')}"`] },
  { route: 'el/help', html: greekHelp, languageMarker: 'lang="el"', workspaceMarker: 'Μια κοινή γλώσσα για να διαβάζεις μια φόρμουλα.', routeMarkers: [`href="${routeHref('en', 'help')}"`, `href="${routeHref('el')}"`, `href="${routeHref('el', 'catalog')}"`] },
  { route: 'en/catalog', html: englishCatalog, languageMarker: 'lang="en"', workspaceMarker: 'See what defines each dough type.', routeMarkers: [`href="${routeHref('en')}"`, `href="${routeHref('en', 'help')}"`, `href="${routeHref('el', 'catalog')}"`] },
  { route: 'el/catalog', html: greekCatalog, languageMarker: 'lang="el"', workspaceMarker: 'Δες τι χαρακτηρίζει κάθε τύπο ζύμης.', routeMarkers: [`href="${routeHref('el')}"`, `href="${routeHref('el', 'help')}"`, `href="${routeHref('en', 'catalog')}"`] },
  { route: 'en/theory', html: englishTheory, languageMarker: 'lang="en"', workspaceMarker: 'What each ingredient does to the dough.', routeMarkers: [`href="${routeHref('en')}"`, `href="${routeHref('en', 'help')}"`, `href="${routeHref('en', 'theory', 'breadsticks')}"`] },
  { route: 'el/theory', html: greekTheory, languageMarker: 'lang="el"', workspaceMarker: 'Τι κάνει κάθε υλικό στη ζύμη.', routeMarkers: [`href="${routeHref('el')}"`, `href="${routeHref('el', 'help')}"`, `href="${routeHref('el', 'theory', 'breadsticks')}"`] },
  { route: 'en/theory/breadsticks', html: englishBreadsticks, languageMarker: 'lang="en"', workspaceMarker: 'Breadsticks are a range, not one formula.', routeMarkers: [`href="${routeHref('en')}"`, `href="${routeHref('en', 'theory')}"`, `href="${routeHref('el', 'theory', 'breadsticks')}"`] },
  { route: 'el/theory/breadsticks', html: greekBreadsticks, languageMarker: 'lang="el"', workspaceMarker: 'Τα κριτσίνια είναι περιοχή, όχι μία συνταγή.', routeMarkers: [`href="${routeHref('el')}"`, `href="${routeHref('el', 'theory')}"`, `href="${routeHref('en', 'theory', 'breadsticks')}"`] },
];

for (const { route, html, languageMarker, workspaceMarker, routeMarkers } of requiredRouteContent) {
  if (!html.includes(languageMarker) || !html.includes(workspaceMarker) || routeMarkers.some((marker) => !html.includes(marker))) {
    console.error(`The ${route} route is missing its locale or workspace shell.`);
    process.exit(1);
  }
}

if ([englishCatalog, greekCatalog, englishTheory, greekTheory, englishBreadsticks, greekBreadsticks].some((html) => html.includes('[missing-translation:'))) {
  console.error('The generated catalog routes contain missing translation markers.');
  process.exit(1);
}

if (configuredBase !== '/') {
  const assetMarker = `${basePrefix}/_astro/`;
  const pages = [english, greek, englishHelp, greekHelp, englishCatalog, greekCatalog, englishTheory, greekTheory, englishBreadsticks, greekBreadsticks];
  if (pages.some((html) => !html.includes(assetMarker))) {
    console.error(`The generated assets do not use the configured base path: ${configuredBase}`);
    process.exit(1);
  }
}

if (!root.includes('http-equiv="refresh"') || !root.includes(`href="${routeHref('en')}"`)) {
  console.error('The generated root entry is missing its English workspace redirect.');
  process.exit(1);
}

if (!notFound.includes('lang="en"') || !notFound.includes(`href="${routeHref('en')}"`)) {
  console.error('The generated public 404.html is missing its locale or workspace route.');
  process.exit(1);
}

console.log('Static route check passed: workspace, help, catalog, theory, breadstick theory, and 404 routes are present.');
