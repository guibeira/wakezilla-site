import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

// Keep this temporary bundle inside the project so Node can resolve React.
// It is never copied into the public site artifact.
const temporaryDirectory = await mkdtemp(path.resolve('.prerender-'));

try {
  await build({
    publicDir: false,
    build: {
      ssr: 'src/entry-server.tsx',
      outDir: temporaryDirectory,
      rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
    },
  });
  const { render } = await import(
    pathToFileURL(path.join(temporaryDirectory, 'entry-server.mjs')).href
  );
  const template = await readFile('dist/index.html', 'utf8');
  const placeholder = '<div id="root"></div>';
  assert.equal(
    template.split(placeholder).length,
    2,
    'The homepage must have one empty React root before pre-rendering.',
  );
  const markup = render();
  assert.ok(
    markup.includes('<h1'),
    'Pre-rendering must produce the actual homepage content.',
  );
  await writeFile(
    'dist/index.html',
    template.replace(placeholder, () => `<div id="root">${markup}</div>`),
  );
  console.log('Pre-rendered the homepage: readable HTML with React hydration.');
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
