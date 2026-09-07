import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [svelte()],
});
