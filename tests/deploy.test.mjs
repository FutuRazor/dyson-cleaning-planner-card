import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('deployment skips unavailable destinations and copies to the configured resource directory', async t => {
  const root = await mkdtemp(join(tmpdir(), 'dyson-deploy-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'scripts'));
  await copyFile(new URL('../scripts/deploy.mjs', import.meta.url), join(root, 'scripts', 'deploy.mjs'));
  const script = join(root, 'scripts', 'deploy.mjs');
  const env = { ...process.env };
  delete env.HA_CONFIG_DIR;

  assert.match(execFileSync(process.execPath, [script], { env, encoding: 'utf8' }), /skipped.*not configured/i);
  const configDir = join(root, 'Home Assistant config');
  env.HA_CONFIG_DIR = configDir;
  assert.match(execFileSync(process.execPath, [script], { env, encoding: 'utf8' }), /skipped.*not available/i);

  const destinationDir = join(configDir, 'www', 'dyson-planner');
  await mkdir(destinationDir, { recursive: true });
  const destination = join(destinationDir, 'dyson-cleaning-planner-card.js');
  await writeFile(destination, 'old bundle');
  assert.notEqual(spawnSync(process.execPath, [script], { env }).status, 0, 'missing bundle must fail');

  await mkdir(join(root, 'dist'));
  await writeFile(join(root, 'dist', 'dyson-cleaning-planner-card.js'), 'new bundle');
  assert.match(execFileSync(process.execPath, [script], { env, encoding: 'utf8' }), /Deployed to/);
  assert.equal(await readFile(destination, 'utf8'), 'new bundle');
});
