# Project workflow

- Use Node 24 in a container, matching `.github/workflows/deploy.yml`.
- Build the tooling image with `docker build -t wakezilla-site:local .`.
- Run checks with `docker run --rm wakezilla-site:local sh -c 'npm run lint && npm run typecheck && npm test && npm run build'`.
- For a local preview, run `docker run --rm -p 127.0.0.1:5173:5173 wakezilla-site:local npm run dev -- --host 0.0.0.0`.
- The user requested LAN access to the built review preview. Its nginx container publishes `0.0.0.0:4173:80`, with `dist/` mounted read-only at `/usr/share/nginx/html`. The LAN address is currently `http://192.168.1.19:4173`.
- Rebuild the image after source changes. A development bind mount may be used with container volumes for root and docs `node_modules`.
- Keep application text in English and preserve the actual dashboard screenshots and platform-specific installation commands.
- Make interactive illustrations work with keyboard input and `prefers-reduced-motion`.
- `npm run build` generates optimized images, pre-renders the React homepage, builds docs, generates the root sitemap index, and runs `verify:seo`. Keep this complete build in the deployment workflow.
- Server rendering uses React 18 `renderToString`; the browser uses `hydrateRoot`. Keep initial state deterministic and read browser-only preferences in effects.
- Original PNG files remain in `src/assets/`; `npm run images` regenerates the WebP files, favicon, and social card using Sharp from the docs workspace. The container includes DejaVu fonts for SVG text rendering; no host package installation is needed.
- Documentation screenshot originals are in `docs/public/images/`. The same image command generates their WebP copies. Preserve the alt text and exact dimensions in the guides; `verify:docs` checks these. Capture provenance and safety constraints are in `docs/SCREENSHOTS.md`.
- Production metadata uses `https://wakezilla.dev/`, consistent with `public/CNAME`. Do not use preview IP addresses in canonical URLs or sitemaps.
