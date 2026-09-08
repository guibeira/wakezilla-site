import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const require = createRequire(new URL('../docs/package.json', import.meta.url));
const sharp = require('sharp');

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
    const attributes = [
      ...tag.matchAll(
        /(?:^|[\s<])([a-z][\w:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi,
      ),
    ].map(([, name, doubleQuoted, singleQuoted]) => [
      name.toLowerCase(),
      doubleQuoted ?? singleQuoted,
    ]);
    const rel = attributes.find(([name]) => name === 'rel')?.[1];

    if (
      /^<link\b/i.test(tag) &&
      rel?.toLowerCase().split(/\s+/).includes('canonical')
    ) {
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
  [
    ...referencesFromHtml(`
    <a data-href="/docs/ignored/" href = '../guide/?from=index'>Guide</a>
    <div data-src="/docs/ignored.js"></div>
    <link rel="stylesheet" href = "/docs/app.css?v=1">
    <link rel = 'canonical' href='https://wakezilla.dev/docs/guide/'>
    <iframe src = './example.html#preview'></iframe>
  `),
  ],
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
assert.match(
  new JSDOM(quickStart).window.document.body.textContent,
  /same-origin \/api requests/,
  'The quick start must describe the current same-origin dashboard API.',
);
assert.match(
  quickStart,
  /href="\/docs\/help\/known-limitations\/"/,
  'The quick start must link to server configuration caveats.',
);

const screenshotNames = [
  'dashboard-overview',
  'dashboard-add-machine',
  'machine-detail',
  'secure-shutdown-setup',
  'machine-history',
  'network-scanner',
];
const screenshots = new Map();
for (const name of screenshotNames) {
  const original = await sharp(
    path.join(docsRoot, `images/${name}.png`),
  ).metadata();
  const optimized = await sharp(
    path.join(docsRoot, `images/${name}.webp`),
  ).metadata();
  assert.equal(optimized.format, 'webp');
  assert.equal(
    optimized.width,
    original.width,
    `${name}: retain screenshot width.`,
  );
  assert.equal(
    optimized.height,
    original.height,
    `${name}: retain screenshot height.`,
  );
  screenshots.set(`/docs/images/${name}.webp`, optimized);
}

const currentGuideChecks = [
  [
    'guides/web-dashboard',
    [
      'Find on network',
      'Find devices',
      'Add service',
      'Client settings',
      'Inactivity (minutes)',
      'Set up client',
      'Access history',
      'Activity',
    ],
  ],
  [
    'getting-started/quick-start',
    [
      'Set up your machine',
      'Set up the client',
      'Client configured',
      'Inactivity (minutes)',
    ],
  ],
  [
    'guides/secure-shutdown',
    ['Set up client again', 'Generate new key', 'Shut down machine'],
  ],
  [
    'guides/network-scanner',
    ['Find on network', 'Automatic selection', 'Find devices'],
  ],
];
for (const [page, labels] of currentGuideChecks) {
  const html = await readFile(path.join(docsRoot, page, 'index.html'), 'utf8');
  const text = new JSDOM(html).window.document.body.textContent;
  for (const label of labels) {
    assert.ok(
      text.includes(label),
      `${page} must describe the current ${label} control.`,
    );
  }
}

const generatedFiles = await walk(docsRoot);
const htmlFiles = generatedFiles.filter((file) => file.endsWith('.html'));
const usedScreenshots = new Set();

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8');
  const document = new JSDOM(html).window.document;
  assert.doesNotMatch(
    document.body.textContent,
    /Finish setting up your client server|Reconfigure security|Inactivity Period \(minutes\)|Secure now|Scan network|Forward 1/,
    `Outdated dashboard instructions in ${htmlFile}.`,
  );
  for (const image of document.querySelectorAll('img')) {
    const source = image.getAttribute('src');
    const screenshot = screenshots.get(source);
    if (!screenshot) continue;
    usedScreenshots.add(source);
    assert.ok(
      image.getAttribute('alt')?.trim(),
      `${source} must have descriptive alt text.`,
    );
    assert.equal(
      Number(image.getAttribute('width')),
      screenshot.width,
      `${source}: incorrect layout width.`,
    );
    assert.equal(
      Number(image.getAttribute('height')),
      screenshot.height,
      `${source}: incorrect layout height.`,
    );
    assert.equal(image.getAttribute('loading'), 'lazy');
    assert.equal(image.getAttribute('decoding'), 'async');
  }
  const pagePath = `/${path.relative('dist', htmlFile).replace(/index\.html$/, '')}`;

  for (const reference of referencesFromHtml(html)) {
    const resolved = new URL(reference, `https://wakezilla.dev${pagePath}`);

    if (
      resolved.origin !== 'https://wakezilla.dev' ||
      !resolved.pathname.startsWith('/docs/')
    ) {
      continue;
    }

    const relative = decodeURIComponent(
      resolved.pathname.slice('/docs/'.length),
    );
    const target =
      relative === ''
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

assert.equal(
  usedScreenshots.size,
  screenshotNames.length,
  'Every current screenshot must be used in the documentation.',
);
console.log(
  `Documentation checks passed: current dashboard instructions, ${usedScreenshots.size} optimized screenshots, image dimensions, and local links.`,
);
