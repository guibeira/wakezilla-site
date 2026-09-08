# SEO implementation

## Delivered

- The existing React homepage is rendered to HTML during the production build. All headings, product content, and documentation links are present without JavaScript. React hydrates the same page to retain the automatic demo, clipboard, and platform detection.
- The homepage has a descriptive title and meta description, a canonical URL, Open Graph and Twitter metadata, and `WebSite` structured data. The visible introduction now identifies Wakezilla as a free, open-source Wake-on-LAN proxy.
- A generated 1200 × 630 sharing image and a mascot favicon are included. Documentation pages share the image while keeping their own titles, descriptions, and canonical URLs.
- `robots.txt` identifies the root sitemap index. The build combines a homepage sitemap with the sitemap files produced by the documentation build. There are currently 24 canonical pages. There are no fabricated last-modified dates, priorities, ratings, or reviews.
- The original images are retained. The homepage uses smaller WebP copies and keeps the dashboard's dimensions and lazy loading.

| Homepage asset | Original PNG | Delivered WebP |
| --- | ---: | ---: |
| Mascot | 832,838 bytes | 34,114 bytes |
| Dashboard | 1,156,538 bytes | 65,596 bytes |
| Total | 1,989,376 bytes | 99,710 bytes |

This is approximately 95% less image data, not a claim of a 95% faster page or a measured ranking gain.

## Build and validation

```text
Image generation -> Vite build -> React HTML pre-render
                                      |
Docs build -> Root sitemap index -> SEO checks -> dist/
```

Run the standard checks inside the project container:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

The test suite has 35 passing tests, including server rendering without browser globals or network calls, deterministic HTML, and hydration on Windows with both motion preferences. `npm run build` runs `verify:docs` and `verify:seo` automatically. The latter checks content, unique metadata, canonical URLs, structured data, actual social-image dimensions, local assets, robots directives, and every sitemap entry.

The same checks passed in a clean image built from the project Dockerfile (`wakezilla-site:seo-check`), including social-card generation with container-provided Fontconfig and DejaVu fonts.

Browser verification on the built LAN preview covered:

- Readable homepage content and documentation navigation with JavaScript disabled.
- No hydration or browser errors, including Windows and reduced-motion preferences.
- A complete automatic cycle and the next request, Pause/Play, Next, keyboard selection, and clipboard copying.
- The optimized real dashboard screenshot and unclipped text at 320, 390, 768, 1024, and 1440 pixels.
- HTTP 200 for robots, sitemaps, social image, and favicon; HTTP 404 for an unknown route.

Evidence and browser script: `/tmp/wakezilla-seo-check-rfC7ya/`. Review URL: http://192.168.1.19:4173. Production metadata deliberately uses https://wakezilla.dev/, matching `public/CNAME` and the docs configuration.

## Remaining release work

No production deployment, Search Console submission, or ranking measurement was performed. After publication, verify the public canonical URLs and assets, inspect the homepage in the owner's Search Console, submit `https://wakezilla.dev/sitemap.xml`, and monitor indexing and real-user Core Web Vitals. This implementation does not guarantee indexing, rankings, or a rich result.

The existing dependency lockfile also reports 24 npm audit findings, including a critical [Vitest UI-server advisory](https://github.com/advisories/GHSA-5xrq-8626-4rwp). This workflow runs `vitest run`, not the UI server. Dependency versions were not changed as part of SEO; review upgrades separately.

## References

The pre-rendering and canonical implementation follows [Google's JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics). Sitemap discovery follows [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). The `WebSite` data describes the real site name as documented in [Google's site-name guidance](https://developers.google.com/search/docs/appearance/site-names); social metadata follows the [Open Graph protocol](https://ogp.me/).

React 18 and Vite 5.4 documentation was checked through Context7 for `renderToString`, `hydrateRoot`, matching initial state, and SSR build asset handling. Starlight's `head` configuration was checked before adding global sharing-image metadata.
