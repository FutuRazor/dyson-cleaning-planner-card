import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = previewServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'msedge' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  // Reproduce HA's slotted card-content padding, which the plain preview lacks.
  await page.addInitScript(() => customElements.define('ha-card', class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).innerHTML = '<style>::slotted(.card-content){padding:16px}</style><slot></slot>';
    }
  }));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const card = page.locator('#card');
  await card.locator('.room').first().waitFor();
  assert.equal(await card.locator('.planner-content').evaluate(el => getComputedStyle(el).paddingLeft), '0px');
  await card.locator('input[data-room]').first().check();
  await card.locator('.consumables-info').click();
  assert.equal(await card.locator('.consumables-info.attention').count(), 1);
  assert.equal(await card.getByRole('dialog').isVisible(), true);
  assert.equal(await card.locator('[role="meter"]').count(), 5);
  assert.equal(await card.locator('.consumable-row').count(), 6);
  assert.match(await card.locator('.consumables-rows').innerText(), /96% remaining/);
  assert.equal(await card.locator('.planner-content').evaluate(el => el.inert), true);
  await page.keyboard.press('Tab');
  assert.equal(await card.locator('[data-info-tab=consumables]').evaluate(el => el === el.getRootNode().activeElement), true);
  await page.evaluate(() => {
    demo.hass.states['sensor.demo_consumable_4'].state = '0';
    demo.hass.states['sensor.demo_consumable_5'].state = 'refill_required';
    demo.card.hass = { ...demo.hass };
  });
  assert.equal(await card.locator('.consumables-info.attention').count(), 0);
  assert.match(await card.locator('.consumables-rows').innerText(), /Refill required/);
  await page.keyboard.press('Escape');
  assert.equal(await card.getByRole('dialog').isVisible(), false);
  assert.equal(await card.locator('.consumables-info').evaluate(el => el === el.getRootNode().activeElement), true);
  assert.equal(await card.locator('input[data-room]').first().isChecked(), true);
  assert.equal(await page.evaluate(() => demo.calls.length), 0);
  await page.locator('#external').click();
  assert.equal(await card.locator('.planner-content').evaluate(el => getComputedStyle(el).paddingLeft), '0px');
  await page.evaluate(() => { demo.savedMap = demo.card.shadowRoot.querySelector('dyson-planner-map'); });
  await card.locator('.consumables-info').click();
  assert.equal(await page.evaluate(() => demo.savedMap === demo.card.shadowRoot.querySelector('dyson-planner-map')), true);
  assert.equal(await card.locator('.consumables-panel').evaluate(el => el.getBoundingClientRect().right <= innerWidth), true);
  await mkdir('artifacts', { recursive: true });
  await page.screenshot({ path: 'artifacts/consumables-mobile.png', fullPage: true });
  await page.locator('body').evaluate(el => el.classList.add('dark'));
  await page.screenshot({ path: 'artifacts/consumables-dark.png', fullPage: true });
  assert.deepEqual(errors, []);
  console.log('Consumables browser checks passed: live values, warning, focus, draft, no commands, map persistence and mobile layout.');
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
