import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = previewServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.locator('#card .rooms').waitFor();
  for (const width of [390, 900]) {
    await page.setViewportSize({ width, height: 1100 });
    for (const state of ['docked', 'cleaning']) {
      const result = await page.evaluate(state => {
        const card = demo.card;
        card.setConfig({ ...card.config, show_camera: false });
        demo.hass.states[demo.entity].state = state;
        card.message = ''; card.hass = { ...demo.hass };
        const before = card.getBoundingClientRect().height;
        card.message = 'Saving room settings'; card.render();
        const overlay = card.shadowRoot.querySelector('.header-notice');
        const active = !overlay.hidden;
        const neutral = !overlay.classList.contains('error');
        const after = card.getBoundingClientRect().height;
        card.message = ''; card.render();
        return { before, after, active, neutral, cleared: card.shadowRoot.querySelector('.header-notice').hidden };
      }, state);
      assert.equal(result.before, result.after, `${width}/${state}: notification must not resize the card`);
      assert.ok(result.active && result.neutral && result.cleared);
    }
  }
  await page.evaluate(() => {
    demo.hass.states[demo.entity].state = 'error';
    demo.card.message = 'Saving room settings'; demo.card.hass = { ...demo.hass };
  });
  assert.ok(await page.locator('#card .header-fault').isVisible());
  assert.ok(await page.locator('#card .header-notice').isHidden());
  assert.ok(await page.locator('#card .activity-status').isVisible());
  console.log('Header notices: stable planner/session heights, neutral style, clearing and fault priority passed.');
} finally { await browser.close(); server.close(); }
