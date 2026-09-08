import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const origin = `https://${(await readFile('public/CNAME', 'utf8')).trim()}`;
const docsIndex = new JSDOM(
  await readFile('dist/docs/sitemap-index.xml', 'utf8'),
  {
    contentType: 'application/xml',
  },
).window.document;
const docsSitemaps = [...docsIndex.querySelectorAll('sitemap > loc')].map(
  (node) => node.textContent,
);
assert.ok(
  docsSitemaps.length,
  'The documentation build must generate at least one sitemap.',
);
const namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const declaration = '<?xml version="1.0" encoding="UTF-8"?>';
await writeFile(
  'dist/sitemap-home.xml',
  `${declaration}\n<urlset xmlns="${namespace}"><url><loc>${origin}/</loc></url></urlset>\n`,
);

const sitemaps = [`${origin}/sitemap-home.xml`, ...docsSitemaps];
for (const url of sitemaps) {
  assert.equal(
    new URL(url).origin,
    origin,
    'Sitemaps must use the production domain.',
  );
}
await writeFile(
  'dist/sitemap.xml',
  `${declaration}\n<sitemapindex xmlns="${namespace}">\n${sitemaps.map((url) => `  <sitemap><loc>${url}</loc></sitemap>`).join('\n')}\n</sitemapindex>\n`,
);
console.log(
  `Generated the root sitemap index with the homepage and ${docsSitemaps.length} documentation sitemap(s).`,
);
