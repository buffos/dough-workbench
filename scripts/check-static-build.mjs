import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve('dist');
const requiredFiles = ['en/index.html', 'el/index.html', 'en/help/index.html', 'el/help/index.html', '404.html'];
const missing = requiredFiles.filter((file) => !existsSync(resolve(dist, file)));

if (missing.length > 0) {
  console.error(`Missing static route artifacts: ${missing.join(', ')}`);
  process.exit(1);
}

const english = readFileSync(resolve(dist, 'en/index.html'), 'utf8');
const greek = readFileSync(resolve(dist, 'el/index.html'), 'utf8');
const englishHelp = readFileSync(resolve(dist, 'en/help/index.html'), 'utf8');
const greekHelp = readFileSync(resolve(dist, 'el/help/index.html'), 'utf8');

const requiredRouteContent = [
  ['en', english, 'lang="en"', 'Formula workspace'],
  ['el', greek, 'lang="el"', 'Χώρος εργασίας φόρμουλας'],
  ['en/help', englishHelp, 'lang="en"', 'A shared language for reading a formula.'],
  ['el/help', greekHelp, 'lang="el"', 'Μια κοινή γλώσσα για να διαβάζεις μια φόρμουλα.'],
];

for (const [locale, html, languageMarker, workspaceMarker] of requiredRouteContent) {
  if (!html.includes(languageMarker) || !html.includes(workspaceMarker)) {
    console.error(`The ${locale} route is missing its locale or workspace shell.`);
    process.exit(1);
  }
}

const expectedBase = process.env.BASE_PATH || '/';
if (expectedBase !== '/' && !english.includes(`${expectedBase}/_astro/`)) {
  console.error(`The generated assets do not use the configured base path: ${expectedBase}`);
  process.exit(1);
}

console.log('Static route check passed: /en/, /el/, /en/help/, /el/help/, and /404.html are present.');
