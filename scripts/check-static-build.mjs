import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve('dist');
const requiredFiles = ['index.html', 'en/index.html', 'el/index.html', 'en/help/index.html', 'el/help/index.html', '404.html'];
const missing = requiredFiles.filter((file) => !existsSync(resolve(dist, file)));

if (missing.length > 0) {
  console.error(`Missing static route artifacts: ${missing.join(', ')}`);
  process.exit(1);
}

const english = readFileSync(resolve(dist, 'en/index.html'), 'utf8');
const greek = readFileSync(resolve(dist, 'el/index.html'), 'utf8');
const englishHelp = readFileSync(resolve(dist, 'en/help/index.html'), 'utf8');
const greekHelp = readFileSync(resolve(dist, 'el/help/index.html'), 'utf8');
const notFound = readFileSync(resolve(dist, '404.html'), 'utf8');
const root = readFileSync(resolve(dist, 'index.html'), 'utf8');

const configuredBase = process.env.BASE_PATH || '/';
const basePrefix = configuredBase === '/' ? '' : configuredBase.replace(/\/$/, '');
/** @param {string} locale @param {string} [suffix] */
const routeHref = (locale, suffix = '') => `${basePrefix}/${locale}/${suffix}/`.replace(/\/$/, '/')
  .replace(/\/\//g, '/');

/** @type {Array<{route: string, html: string, languageMarker: string, workspaceMarker: string, routeMarkers: string[]}>} */
const requiredRouteContent = [
  { route: 'en', html: english, languageMarker: 'lang="en"', workspaceMarker: 'Formula workspace', routeMarkers: [`href="${routeHref('el')}"`, `href="${routeHref('en', 'help')}"`] },
  { route: 'el', html: greek, languageMarker: 'lang="el"', workspaceMarker: 'Χώρος εργασίας φόρμουλας', routeMarkers: [`href="${routeHref('en')}"`, `href="${routeHref('el', 'help')}"`] },
  { route: 'en/help', html: englishHelp, languageMarker: 'lang="en"', workspaceMarker: 'A shared language for reading a formula.', routeMarkers: [`href="${routeHref('el', 'help')}"`, `href="${routeHref('en')}"`] },
  { route: 'el/help', html: greekHelp, languageMarker: 'lang="el"', workspaceMarker: 'Μια κοινή γλώσσα για να διαβάζεις μια φόρμουλα.', routeMarkers: [`href="${routeHref('en', 'help')}"`, `href="${routeHref('el')}"`] },
];

for (const { route, html, languageMarker, workspaceMarker, routeMarkers } of requiredRouteContent) {
  if (!html.includes(languageMarker) || !html.includes(workspaceMarker) || routeMarkers.some((marker) => !html.includes(marker))) {
    console.error(`The ${route} route is missing its locale or workspace shell.`);
    process.exit(1);
  }
}

if (configuredBase !== '/') {
  const assetMarker = `${basePrefix}/_astro/`;
  const pages = [english, greek, englishHelp, greekHelp];
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

console.log('Static route check passed: /, /en/, /el/, /en/help/, /el/help/, and /404.html are present.');
