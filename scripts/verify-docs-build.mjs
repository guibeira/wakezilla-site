import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const docsRoot = 'dist/docs';

const requiredPages = [
  'guides/web-dashboard',
  'guides/network-scanner',
  'guides/system-services',
  'guides/terminal-ui',
  'guides/desktop-tray',
  'reference/cli',
  'reference/configuration',
  'reference/storage',
  'reference/http-api',
  'reference/platform-behavior',
  'reference/security',
  'help/logs',
  'help/updates-uninstall',
  'help/known-limitations',
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const file = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(file) : [file];
    }),
  );
  return nested.flat();
}

async function assertExists(file, message) {
  await assert.doesNotReject(access(file), message);
}

function* referencesFromHtml(html) {
  for (const [tag] of html.matchAll(/<[a-z][^>]*>/gi)) {
    const attributes = [...tag.matchAll(
      /(?:^|[\s<])([a-z][\w:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi,
    )].map(([, name, doubleQuoted, singleQuoted]) => [
      name.toLowerCase(),
      doubleQuoted ?? singleQuoted,
    ]);
    const rel = attributes.find(([name]) => name === 'rel')?.[1];

    if (/^<link\b/i.test(tag) && rel?.toLowerCase().split(/\s+/).includes('canonical')) {
      continue;
    }

    for (const [name, value] of attributes) {
      if (name !== 'href' && name !== 'src') {
        continue;
      }

      const [reference] = value.split(/[?#]/, 1);
      if (reference) {
        yield reference;
      }
    }
  }
}

assert.deepEqual(
  [...referencesFromHtml(`
    <a data-href="/docs/ignored/" href = '../guide/?from=index'>Guide</a>
    <div data-src="/docs/ignored.js"></div>
    <link rel="stylesheet" href = "/docs/app.css?v=1">
    <link rel = 'canonical' href='https://wakezilla.dev/docs/guide/'>
    <iframe src = './example.html#preview'></iframe>
  `)],
  ['../guide/', '/docs/app.css', './example.html'],
  'Local reference discovery must cover links, assets, and embedded content.',
);

for (const page of requiredPages) {
  await assertExists(
    path.join(docsRoot, page, 'index.html'),
    `Missing generated documentation page: ${page}`,
  );
}

await assertExists(
  path.join(docsRoot, 'images/dashboard-add-machine.png'),
  'The dashboard guide must include a real product screenshot.',
);
await assertExists(
  path.join(docsRoot, 'images/machine-detail.png'),
  'The dashboard guide must include the machine detail screenshot.',
);
await assertExists(
  path.join(docsRoot, 'images/setup-select-mode.png'),
  'The quick start must include the setup mode screenshot.',
);
await assertExists(
  path.join(docsRoot, 'images/setup-proxy-port.png'),
  'The quick start must include the setup port screenshot.',
);
await assertExists(
  path.join(docsRoot, 'images/setup-confirm.png'),
  'The quick start must include the setup confirmation screenshot.',
);
await assertExists(
  path.join(docsRoot, 'images/tray-icon.png'),
  'The quick start must include the tray icon.',
);

const docsHome = await readFile('dist/docs/index.html', 'utf8');
const quickStart = await readFile(
  'dist/docs/getting-started/quick-start/index.html',
  'utf8',
);

assert.match(
  docsHome,
  /<link rel="canonical" href="https:\/\/wakezilla\.dev\/docs\/"/,
  'The documentation homepage must publish under https://wakezilla.dev/docs/.',
);
assert.match(
  docsHome,
  /<a href="\/" class="site-title/,
  'The documentation title must link back to the main website.',
);
assert.match(
  quickStart,
  /bidirectional/,
  'The quick start must explain that proxy traffic is bidirectional.',
);
assert.match(
  quickStart,
  /60 minutes/,
  'The quick start must describe the 60-minute inactivity period.',
);
assert.match(
  quickStart,
  /wakezilla setup/,
  'The quick start must lead with the interactive setup wizard.',
);
assert.match(
  quickStart,
  /Headless servers do not show a tray icon/,
  'The quick start must explain when the tray icon is unavailable.',
);
assert.doesNotMatch(
  quickStart,
  /or enter another available TCP port|If you selected a different port/,
  'The quick start must not recommend a custom port for direct dashboard access.',
);
assert.match(
  quickStart,
  /dashboard client currently targets port\s*<code\b[^>]*>3000<\/code>/,
  'The quick start must explain why direct dashboard access uses port 3000.',
);
assert.match(
  quickStart,
  /href="\/docs\/help\/known-limitations\/"/,
  'The quick start custom-port warning must link to Known Limitations.',
);

const generatedFiles = await walk(docsRoot);
const htmlFiles = generatedFiles.filter((file) => file.endsWith('.html'));

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8');
  const pagePath = `/${path.relative('dist', htmlFile).replace(/index\.html$/, '')}`;

  for (const reference of referencesFromHtml(html)) {
    const resolved = new URL(reference, `https://wakezilla.dev${pagePath}`);

    if (resolved.origin !== 'https://wakezilla.dev' || !resolved.pathname.startsWith('/docs/')) {
      continue;
    }

    const relative = decodeURIComponent(resolved.pathname.slice('/docs/'.length));
    const target = relative === ''
      ? path.join(docsRoot, 'index.html')
      : relative.endsWith('/')
        ? path.join(docsRoot, relative, 'index.html')
        : path.join(docsRoot, relative);

    await assertExists(
      target,
      `Broken local documentation reference in ${htmlFile}: ${reference} resolves to ${resolved.pathname}`,
    );
  }
}
