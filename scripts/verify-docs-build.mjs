import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

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
