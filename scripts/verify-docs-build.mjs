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

const generatedFiles = await walk(docsRoot);
const htmlFiles = generatedFiles.filter((file) => file.endsWith('.html'));

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8');
  const localReferences = html.matchAll(/(?:href|src)="(\/docs\/[^"#?]*)/g);

  for (const [, reference] of localReferences) {
    const relative = decodeURIComponent(reference.slice('/docs/'.length));
    const target = relative === ''
      ? path.join(docsRoot, 'index.html')
      : relative.endsWith('/')
        ? path.join(docsRoot, relative, 'index.html')
        : path.join(docsRoot, relative);

    await assertExists(
      target,
      `Broken local documentation reference in ${htmlFile}: ${reference}`,
    );
  }
}
