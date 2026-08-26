// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The canonical production URL. This is a PLACEHOLDER — change it to the
// real domain before deploying. It is used for canonical URLs, the sitemap,
// Open Graph tags and structured data.
const SITE_URL = 'https://www.arcfinity.in';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  // The CMS admin lives at /public/admin/index.html. With clean URLs, a bare
  // /admin doesn't auto-resolve to that file, so redirect it explicitly.
  redirects: {
    '/admin': '/admin/index.html',
    '/admin/': '/admin/index.html',
  },
  build: {
    // Clean, extension-less URLs: /about instead of /about/index.html
    format: 'file',
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        // Keep legal/utility pages out of primary discovery weighting but still
        // indexable; exclude nothing that should be found. 404 is never emitted.
        !page.includes('/thank-you'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  image: {
    // Allow the responsive image service; formats chosen per-image in components.
    responsiveStyles: true,
  },
  compressHTML: true,
});
