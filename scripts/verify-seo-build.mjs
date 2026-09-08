import assert from 'node:assert/strict';
import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const origin = `https://${(await readFile('public/CNAME', 'utf8')).trim()}`;
const html = await readFile('dist/index.html', 'utf8');
const document = new JSDOM(html).window.document;
const one = (doc, selector) => {
  const elements = doc.querySelectorAll(selector);
  assert.equal(elements.length, 1, `Expected exactly one ${selector}.`);
  return elements[0];
};
const meta = (doc, key, attribute = 'name') =>
  one(doc, `meta[${attribute}="${key}"]`).getAttribute('content');
const readXml = async (file) =>
  new JSDOM(await readFile(file, 'utf8'), {
    contentType: 'application/xml',
  }).window.document;
const localFile = (url) => {
  assert.equal(url.origin, origin, 'SEO URLs must use the production origin.');
  assert.equal(url.search, '', 'Sitemaps must not contain query strings.');
  assert.equal(url.hash, '', 'Sitemaps must not contain fragments.');
  return path.join(
    'dist',
    decodeURIComponent(url.pathname),
    url.pathname.endsWith('/') ? 'index.html' : '',
  );
};

assert.equal(document.documentElement.lang, 'en');
assert.match(one(document, 'title').textContent, /Wakezilla.*Wake-on-LAN/);
assert.match(meta(document, 'description'), /Wake-on-LAN proxy/);
assert.match(meta(document, 'robots'), /max-image-preview:large/);
assert.doesNotMatch(meta(document, 'robots'), /noindex|nofollow/);
assert.equal(one(document, 'link[rel="canonical"]').href, `${origin}/`);
assert.match(
  one(document, '#root h1').textContent,
  /Let your servers.*sleep\./,
);
assert.match(
  one(document, 'main').textContent,
  /free, open-source Wake-on-LAN proxy/,
);
assert.ok(
  document.querySelectorAll('main h2').length >= 6,
  'All content sections must be in the initial HTML.',
);
assert.ok(
  document.querySelector('a[href="/docs/guides/web-dashboard/"]'),
  'Documentation links must be crawlable without JavaScript.',
);
assert.ok(
  document
    .querySelector('#install code')
    ?.textContent.includes('https://wakezilla.dev/install.sh'),
);
assert.ok(
  document.querySelector('script[type="module"][src]'),
  'The static page must retain its interactive entry point.',
);

assert.equal(meta(document, 'og:title', 'property'), document.title);
assert.equal(
  meta(document, 'og:description', 'property'),
  meta(document, 'description'),
);
assert.equal(meta(document, 'og:url', 'property'), `${origin}/`);
assert.equal(meta(document, 'og:site_name', 'property'), 'Wakezilla');
assert.equal(meta(document, 'og:type', 'property'), 'website');
assert.equal(meta(document, 'twitter:card'), 'summary_large_image');
assert.equal(meta(document, 'twitter:title'), document.title);
assert.equal(
  meta(document, 'twitter:description'),
  meta(document, 'description'),
);
for (const attribute of ['og:image', 'twitter:image']) {
  assert.equal(
    meta(
      document,
      attribute,
      attribute.startsWith('og:') ? 'property' : 'name',
    ),
    `${origin}/social-card.png`,
  );
}
assert.ok(meta(document, 'og:image:alt', 'property'));
assert.ok(meta(document, 'twitter:image:alt'));
const card = await readFile('dist/social-card.png');
assert.equal(card.subarray(1, 4).toString(), 'PNG');
assert.equal(
  card.readUInt32BE(16),
  Number(meta(document, 'og:image:width', 'property')),
);
assert.equal(
  card.readUInt32BE(20),
  Number(meta(document, 'og:image:height', 'property')),
);
assert.equal(card.readUInt32BE(16), 1200);
assert.equal(card.readUInt32BE(20), 630);
assert.ok(card.length < 500_000, 'The sharing image must stay below 500 kB.');
const schema = JSON.parse(
  one(document, 'script[type="application/ld+json"]').textContent,
);
assert.equal(schema['@context'], 'https://schema.org');
assert.equal(schema['@type'], 'WebSite');
assert.equal(schema.name, 'Wakezilla');
assert.equal(schema.url, `${origin}/`);

for (const element of document.querySelectorAll(
  'img[src], script[src], link[rel="stylesheet"], link[rel="icon"]',
)) {
  const reference = element.getAttribute('src') ?? element.getAttribute('href');
  const url = new URL(reference, origin);
  if (url.origin !== origin) continue;
  await access(localFile(url));
  if (element.tagName === 'IMG') {
    assert.ok(
      element.hasAttribute('alt'),
      'Every image must have an alt attribute.',
    );
    assert.ok(
      url.pathname.endsWith('.webp'),
      'Homepage images must use the optimized assets.',
    );
  }
}
const dashboard = one(document, '.dashboard-preview img');
assert.equal(dashboard.getAttribute('width'), '1440');
assert.equal(dashboard.getAttribute('height'), '1000');
assert.equal(dashboard.getAttribute('loading'), 'lazy');
assert.ok(
  (await stat(localFile(new URL(dashboard.src, origin)))).size < 200_000,
);

const robots = await readFile('dist/robots.txt', 'utf8');
assert.match(robots, /User-agent: \*/);
assert.match(robots, /^Allow: \/$/m);
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m);

const index = await readXml('dist/sitemap.xml');
assert.equal(index.documentElement.localName, 'sitemapindex');
const sitemapUrls = [...index.querySelectorAll('sitemap > loc')].map(
  (node) => node.textContent,
);
const docsIndex = await readXml('dist/docs/sitemap-index.xml');
const docsSitemaps = [...docsIndex.querySelectorAll('sitemap > loc')].map(
  (node) => node.textContent,
);
assert.deepEqual(sitemapUrls, [`${origin}/sitemap-home.xml`, ...docsSitemaps]);
const pages = new Set();
const titles = new Set();
const descriptions = new Set();
for (const sitemapUrl of sitemapUrls) {
  const sitemap = await readXml(localFile(new URL(sitemapUrl)));
  assert.equal(
    sitemap.documentElement.localName,
    'urlset',
    'The root index must link to URL sitemaps, not nested indexes.',
  );
  for (const entry of sitemap.querySelectorAll('url > loc')) {
    const url = new URL(entry.textContent);
    assert.ok(!pages.has(url.href), `Duplicate sitemap URL: ${url.href}`);
    assert.ok(
      !url.pathname.includes('404'),
      'Error pages must not be included in sitemaps.',
    );
    pages.add(url.href);
    const page = new JSDOM(await readFile(localFile(url), 'utf8')).window
      .document;
    assert.equal(
      one(page, 'link[rel="canonical"]').href,
      url.href,
      `Canonical mismatch for ${url.href}`,
    );
    one(page, 'h1');
    const title = one(page, 'title').textContent;
    const description = meta(page, 'description');
    assert.ok(
      title && !titles.has(title),
      `Missing or duplicate title at ${url.href}`,
    );
    assert.ok(
      description && !descriptions.has(description),
      `Missing or duplicate description at ${url.href}`,
    );
    titles.add(title);
    descriptions.add(description);
    assert.equal(
      meta(page, 'og:image', 'property'),
      `${origin}/social-card.png`,
    );
    assert.equal(meta(page, 'twitter:image'), `${origin}/social-card.png`);
    for (const robot of page.querySelectorAll('meta[name="robots"]')) {
      assert.doesNotMatch(robot.getAttribute('content'), /noindex|nofollow/);
    }
  }
}
assert.ok(pages.has(`${origin}/`));
assert.ok(pages.has(`${origin}/docs/`));
assert.ok(pages.has(`${origin}/docs/getting-started/installation/`));
console.log(
  `SEO checks passed: pre-rendered homepage, metadata, social image, assets, robots.txt and ${pages.size} canonical sitemap pages.`,
);
