# Purpose / Big Picture

Implement the approved Raycast-inspired centered opening and Railway-inspired interactive network flow. Preserve Wakezilla's coral color, mascot, actual dashboard, installers, and documentation links.

The user has now authorized SEO work. Deliver crawlable homepage HTML, accurate metadata, a discoverable sitemap covering the homepage and docs, a working social preview, and lighter homepage images without changing the approved design.

On 2026-09-08 the user requested the preview again and a documentation refresh, including screenshots of the current dashboard.

## Progress

- [x] 2026-09-07: Inspected the current site, references, lifecycle behavior, tests, and container workflow.
- [x] 2026-09-07: Consulted React 18 documentation through Context7 for effect and subscription cleanup.
- [x] 2026-09-07: Implemented the centered opening, coral light, selectable demo scenarios, connected story, and larger dashboard presentation.
- [x] 2026-09-07: Verified lint, types, 28 tests, site/docs build, desktop/mobile layout, keyboard interaction, and reduced motion.
- [x] 2026-09-07: Started the complete built preview at http://localhost:4173 and checked the homepage, documentation, dashboard guide, and both installer URLs.
- [x] 2026-09-07: At the user's request, changed the review preview binding to `0.0.0.0:4173` for access from another machine at http://192.168.1.19:4173.
- [x] 2026-09-07: Changed the demo to repeat automatically, with only Pause/Play and Next controls. Next and scenario selection retain the user's playback setting.
- [x] 2026-09-07: Captured the updated dashboard at http://192.168.1.200:3000 after machine statuses loaded; replaced the screenshot and its dimensions and description.
- [x] 2026-09-07: Passed lint, types, 31 tests, and the complete site/docs build after these changes; refreshed the LAN preview.
- [x] 2026-09-07: Verified two automatic cycles without clicks, Pause/Play, Next, scenario changes, reduced motion, the new dashboard image, and layouts at 320, 390, 768, and 1440 pixels in the built LAN preview. No browser errors.
- [x] 2026-09-07: Audited SEO. The homepage is a client-only empty shell, has no canonical URL or social image, and has no root sitemap/robots.txt. Docs already have descriptions, canonical URLs, and an automatically generated sitemap.
- [x] SEO: Pre-render the existing React page at build time and hydrate it without browser-dependent initial-state differences.
- [x] SEO: Add accurate homepage/social metadata, WebSite structured data, robots.txt, and a sitemap index linking the homepage and documentation sitemaps.
- [x] SEO: Generate optimized images and a branded social card with the existing container tooling.
- [x] SEO: Passed 35 tests, lint, types, and the complete build. Added automated SEO checks covering all 24 canonical sitemap pages.
- [x] SEO: Verified content and docs navigation with JavaScript disabled. Confirmed hydration, automatic looping, controls, keyboard, clipboard, Windows detection, reduced motion, responsive layouts, and HTTP responses on the LAN preview.
- [x] SEO: Confirmed lint, types, all 35 tests, the complete build, SEO checks, and readable social-card text in the clean Dockerfile image (`wakezilla-site:seo-check`).
- [x] 2026-09-08: Restored the built LAN preview at http://192.168.1.19:4173 with nginx and a read-only `dist/` mount.
- [x] 2026-09-08: Inspected the running product and matching design worktree. Captured six current UI states without mutating API calls, scans, power actions, or exposed credentials.
- [x] 2026-09-08: Updated dashboard, quick start, setup, scanner, settings, and related help/reference text to use the current controls. Replaced obsolete screenshots and added WebP generation and layout dimensions.
- [x] 2026-09-08: Passed lint, types, 35 tests, the complete build, docs checks for all six screenshots, and SEO checks for 24 pages.
- [x] 2026-09-08: Verified all six current images across four guides at 1440, 390, and 320 pixels. No browser errors or page/image overflow. Homepage-to-docs navigation and LAN access passed.
- [x] 2026-09-08: Reviewed the combined design, SEO, and documentation changes for a pull request. Repeated lint, types, 35 tests, and the complete build in a clean Node 24 container; all passed.

## Surprises & Discoveries

- The current demo already has request, probe, wake, forwarding, response, inactivity, and shutdown phases.
- Inactivity is refreshed by accepted connections; continuous traffic alone is not the documented trigger.
- Node 24 matches CI and the documentation workspace. A container supplies all project tooling.
- Homepage PNGs totaled 1,989,376 bytes. Generated WebP files total 99,710 bytes, about 95% less image data. Source PNGs are retained.
- The slim Node image has no fonts. The Dockerfile supplies DejaVu inside the container so SVG social-card text renders during a clean build.
- The existing lockfile reports 24 npm audit findings (3 low, 7 moderate, 13 high, 1 critical). The critical finding concerns the Vitest UI server, which this workflow does not start. Dependency updates are a separate task; no dependency versions were changed.
- The previous temporary preview/development containers were gone after the environment restart. Current preview: `wakezilla-site-preview-20260908`; build tooling: `wakezilla-site-work-20260908`.
- The live dashboard uses modal windows, empty initial services, editable Client settings during creation, and relative `/api` URLs. The product main worktree still has the old interface; the `design-improvements` worktree matches the redesign.
- Existing machines are already paired. A truthful setup screenshot shows Client configured; producing a pending setup screenshot would require a new record or key rotation, which was not needed for this task.

## Decision Log

- 2026-09-07: Use existing React, SVG, and CSS. No new runtime dependencies or generated raster artwork are needed.
- 2026-09-07: The demo must show its accelerated time, expose manual controls, and support reduced motion.
- 2026-09-07: SEO is explicitly deferred until after the design is completed and reviewed.
- 2026-09-07: Keep automatic phase changes with reduced motion, but disable visual animations. Pause/Play remains available. Suspend the timer while the demo is outside the viewport or the page is hidden.
- 2026-09-07: SEO is now in scope. Keep React 18/Vite 5 and static GitHub Pages hosting. Generate HTML at build time; no server, migration, new runtime dependency, or publishing action is required.
- 2026-09-07: Use the existing configured production domain, https://wakezilla.dev. Do not fabricate ratings or submit anything to external webmaster accounts.
- 2026-09-08: Keep the existing terminal/tray captures; this refresh targets the changed web interface. Use actual configured/empty-history states, not fabricated commands or traffic. See `docs/SCREENSHOTS.md`.

## Outcomes & Retrospective

The new design is ready for user review. The demo preserves bidirectional traffic through Wakezilla, distinguishes HTTP examples from Minecraft TCP, and repeats the complete request/response/rest cycle automatically. Pause/Play controls playback; Next advances one phase without changing that setting. It pauses outside the viewport or when the page is hidden. Reduced motion disables animations without requiring manual steps.

Browser checks passed for all three scenarios, pause/resume, keyboard selection, clipboard copying, Windows platform detection, actual dashboard loading, and widths from 320 to 1440 pixels. Text bounds were also checked to detect clipping hidden by page overflow rules.

Preview container: `wakezilla-site-preview-20260908`, serving `dist/` on port 4173. Build container: `wakezilla-site-work-20260908`, with source and dependency-volume mounts. The site, documentation refresh, and SEO implementation are available in the LAN preview. The user requested a pull request on 2026-09-08. No production deployment or Search Console submission was made.

The homepage now provides content and links without JavaScript while preserving React interactions after hydration. Metadata and social previews cover the homepage and docs, and the generated root sitemap lists the homepage plus the existing docs sitemaps. Build-time checks prevent empty HTML, duplicate metadata, broken assets, and canonical/sitemap mismatches. See `SEO.md` for evidence, sources, and remaining release steps.

## Validation and Acceptance

- Centered opening with coral lighting and visible installation and demo actions.
- Jellyfin, local AI, and game-server examples with request and return paths through Wakezilla.
- Clear states, continuous automatic cycles, Pause/Play and Next controls, and no visual animations with reduced motion.
- Connected explanation, real dashboard, and functioning installation and documentation links.
- No horizontal page overflow at mobile widths; keyboard controls and visible focus.
- `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` pass inside the container.
- The built homepage has one H1, visible product copy, and crawlable documentation links without running JavaScript.
- `npm run verify:seo` passes for the production domain, metadata, social card, robots.txt, optimized images, and every canonical sitemap page.
- No production ranking, indexing, Core Web Vitals, or Search Console results are claimed from local tests.
