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
  await page.goto('http://127.0.0.1:' + server.address().port + '/');
  await page.locator('#card .rooms').waitFor();
  const result = await page.evaluate(async () => {
    const card = demo.card;
    demo.hass.states[demo.entity].attributes.map_id = 'A';
    card.hass = { ...demo.hass };
    card.selected = [demo.ids[0]];
    card.settingDraft = { 10: { cleaning_mode: 'Mop' } };
    card.updateDirty();
    const before = card.draftContext;
    demo.hass.states[demo.entity].attributes.map_id = 'B';
    card.hass = { ...demo.hass };
    await card.save();
    await card.start();
    const blocked = demo.calls.length === 0 && card.error && card.draftContext === before;
    card.resetDraft();
    card.selected = [demo.ids[0]];
    card.settingDraft = { 10: { cleaning_mode: 'Mop' } };
    card.updateDirty();
    await card.save();
    const saved = demo.calls.at(-1)?.service;
    await card.start();
    return { blocked, saved, started: demo.calls.at(-1)?.service };
  });
  assert.equal(result.blocked, true);
  assert.equal(result.saved, 'save_room_settings');
  assert.equal(result.started, 'start_rooms_with_settings');
  console.log('Map context: stale draft blocked, discard/reselect restores save and start.');
} finally {
  await browser?.close();
  server.close();
}
