import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = previewServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const card = page.locator('#card');
  await card.locator('.room').first().waitFor();
  const state = value => page.evaluate(value => {
    demo.hass.states[demo.entity].state = value;
    demo.card.hass = { ...demo.hass };
  }, value);
  await card.locator('input[data-room]').first().check();
  const name = await page.evaluate(() => demo.card.model.rooms[0].name);
  await card.locator('[data-action="start"]').click();
  await page.waitForFunction(() => !demo.card.busy);
  assert.deepEqual(await card.locator('.requested li').allTextContents(), [name], 'a normal single-room start has a badge');
  await state('idle');
  assert.equal(await card.locator('.room').count() > 0, true, 'planner returns immediately');
  await state('cleaning');
  assert.deepEqual(await card.locator('.requested li').allTextContents(), [name], 'brief idle telemetry must not erase the requested room');
  await state('docked');
  await page.waitForTimeout(1000);
  await state('cleaning');
  await page.waitForTimeout(4500);
  assert.deepEqual(await card.locator('.requested li').allTextContents(), [name], 'resuming cancels pending cleanup');
  await state('docked');
  await page.waitForFunction(() => demo.card.requestedPlan === null, null, { timeout: 7000 });
  await state('cleaning');
  assert.equal(await card.locator('.requested li').count(), 0, 'a later external clean must not inherit old room badges');
  assert.equal(await page.evaluate(() => demo.calls.filter(c => c.service === 'start_rooms_with_settings').length), 1);
  console.log('Single-room badge checks passed: normal start, transient idle/docked, cancelled cleanup, stable completion and external clean.');
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
