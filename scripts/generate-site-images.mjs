import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

// Sharp is already provided by the documentation workspace.
const require = createRequire(new URL('../docs/package.json', import.meta.url));
const sharp = require('sharp');

const documentationScreenshots = [
  'dashboard-overview',
  'dashboard-add-machine',
  'machine-detail',
  'secure-shutdown-setup',
  'machine-history',
  'network-scanner',
];

for (const name of documentationScreenshots) {
  await sharp(`docs/public/images/${name}.png`)
    .webp({ quality: 90, effort: 6 })
    .toFile(`docs/public/images/${name}.webp`);
}

await sharp('src/assets/wakezilla.png')
  .resize({ width: 512, withoutEnlargement: true })
  .webp({ quality: 90, effort: 6 })
  .toFile('src/assets/wakezilla.webp');
await sharp('src/assets/wakezilla-dashboard.png')
  .webp({ quality: 86, effort: 6 })
  .toFile('src/assets/wakezilla-dashboard.webp');
await sharp('src/assets/wakezilla.png')
  .resize(96, 96, { fit: 'contain', background: '#09090b' })
  .png()
  .toFile('public/favicon.png');

const logo = await sharp('src/assets/wakezilla.png')
  .resize(280, 280)
  .png()
  .toBuffer();
const template = await readFile('src/assets/social-card.svg', 'utf8');
const card = template.replace(
  '<!-- brand-logo -->',
  `<image href="data:image/png;base64,${logo.toString('base64')}" x="875" y="160" width="280" height="280"/>`,
);
await sharp(Buffer.from(card)).png().toFile('public/social-card.png');
console.log(
  'Generated WebP images, favicon and 1200 × 630 social card from the existing brand assets.',
);
