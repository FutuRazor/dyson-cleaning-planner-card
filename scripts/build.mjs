import { readFile, mkdir, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const { version } = JSON.parse(await readFile(new URL('package.json', root)));
const parts = await Promise.all(['core', 'map', 'card', 'editor'].map(async name =>
  (await readFile(new URL(`src/${name}.js`, root), 'utf8'))
    .replace(/^import .* from '\.\/core\.js';\r?\n/gm, '')
    .replace(/^export /gm, '')));
await mkdir(new URL('dist/', root), { recursive: true });
await writeFile(new URL('dist/dyson-cleaning-planner-card.js', root),
  `/* Dyson Cleaning Planner Card v${version} | MIT */\n${parts.join('\n')}\n`);
console.log(`Built v${version}: dist/dyson-cleaning-planner-card.js (no runtime dependencies)`);
