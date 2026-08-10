import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ulkar-aghayeva.github.io',
  output: 'static',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/home/') })],
  build: { format: 'directory' },
});
