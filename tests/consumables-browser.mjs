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
  assert.equal(await card.locator('header .tag').count(), 0);
  assert.equal(await card.locator('.consumables-panel h3, .tag').count(), 0);
  await card.locator('[data-info-tab=consumables]').click();
  assert.equal(await card.locator('.info-toolbar .consumables-close').isVisible(), true);
  assert.equal(await card.locator('.consumables-info.attention').count(), 1);
  assert.equal(await card.getByRole('dialog').isVisible(), true);
  assert.equal(await card.locator('[role="meter"]').count(), 5);
  assert.equal(await card.locator('.consumable-row').count(), 6);
  assert.match(await card.locator('.consumables-rows').innerText(), /96% remaining/);
  assert.equal(await card.locator('.consumable-chip.ready').innerText(), 'Ready to use');
  assert.equal(await card.locator('.consumable-solution .consumable-value').innerText(), 'Disabled');
  for (const [state, label] of [['on', 'Enabled'], ['off', 'Disabled'], ['unavailable', 'Status unavailable']]) {
    await page.evaluate(state => {
      demo.hass.states['switch.renamed_station_1'].state = state;
      demo.card.hass = { ...demo.hass };
    }, state);
    assert.equal(await card.locator('.consumable-solution .consumable-value').innerText(), label);
    assert.equal(await card.locator('.consumable-chip.ready').innerText(), 'Ready to use');
  }
  assert.equal(await card.locator('.consumable-chip').evaluate(el => el.tabIndex), -1);
  assert.equal(await card.locator('.planner-content').evaluate(el => el.inert), true);
  await card.locator('.consumables-close').focus();
  await page.keyboard.press('Tab');
  assert.equal(await card.locator('[data-info-tab=consumables]').evaluate(el => el === el.getRootNode().activeElement), true);
  await page.evaluate(() => {
    demo.hass.states['sensor.demo_consumable_4'].state = '0';
    demo.hass.states['sensor.demo_consumable_5'].state = 'refill_required';
    demo.card.hass = { ...demo.hass };
  });
  assert.equal(await card.locator('.consumables-info.attention').count(), 0);
  assert.match(await card.locator('.consumables-rows').innerText(), /Refill required/);
  assert.equal(await card.locator('.consumable-chip.refill').evaluate(el => getComputedStyle(el).color), await card.locator('.consumables-info').evaluate(el => {
    const probe = document.createElement('span'); probe.style.color = 'var(--error-color,#b3261e)'; el.append(probe);
    const color = getComputedStyle(probe).color; probe.remove(); return color;
  }));
  await page.keyboard.press('Escape');
  assert.equal(await card.getByRole('dialog').isVisible(), false);
  assert.equal(await card.locator('.consumables-info').evaluate(el => el === el.getRootNode().activeElement), true);
  assert.equal(await card.locator('input[data-room]').first().isChecked(), true);
  assert.equal(await page.evaluate(() => demo.calls.length), 0);
  await page.locator('#external').click();
  assert.equal(await card.locator('.planner-content').evaluate(el => getComputedStyle(el).paddingLeft), '0px');
  await page.evaluate(() => { demo.savedMap = demo.card.shadowRoot.querySelector('dyson-planner-map'); });
  await card.locator('.consumables-info').click();
  assert.equal(await card.locator('header .tag').count(), 0);
  assert.equal(await card.locator('.consumables-panel h3, .tag').count(), 0);
  await card.locator('[data-info-tab=consumables]').click();
  assert.equal(await card.locator('.info-toolbar .consumables-close').isVisible(), true);
  assert.equal(await page.evaluate(() => demo.savedMap === demo.card.shadowRoot.querySelector('dyson-planner-map')), true);
  assert.equal(await card.locator('.consumables-panel').evaluate(el => el.getBoundingClientRect().right <= innerWidth), true);
  await mkdir('artifacts', { recursive: true });
  await page.screenshot({ path: 'artifacts/consumables-mobile.png', fullPage: true });
  await page.locator('body').evaluate(el => el.classList.add('dark'));
  await page.screenshot({ path: 'artifacts/consumables-dark.png', fullPage: true });
  await page.evaluate(() => {
    demo.hass.states['sensor.demo_consumable_5'].state = 'ok';
    demo.card.hass = { ...demo.hass };
  });
  for (const width of [320, 390, 760]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal(await card.locator('.consumables-panel').evaluate(el => el.scrollWidth <= el.clientWidth), true);
    assert.equal(await card.locator('.info-toolbar').evaluate(el => {
      const tabs = el.querySelector('.info-tabs').getBoundingClientRect();
      const close = el.querySelector('.consumables-close').getBoundingClientRect();
      return tabs.right <= close.left && Math.abs(tabs.top - close.top) < 1 && close.width >= 42 && close.height >= 42 && el.scrollWidth <= el.clientWidth;
    }), true, 'tabs and close button share one row without overlap');
    assert.equal(await card.locator('.consumable-row').first().evaluate(el => {
      const label = el.querySelector('.consumable-label').getBoundingClientRect();
      const bar = el.querySelector('.consumable-track').getBoundingClientRect();
      return bar.left > label.right && bar.height === 12 && Math.abs((bar.top + bar.bottom - label.top - label.bottom) / 2) < 1;
    }), true);
    await page.screenshot({ path: `artifacts/consumables-v1.0.0-${width}.png`, fullPage: true });
  }
  assert.deepEqual(errors, []);
  console.log('Consumables browser checks passed: live values, warning, focus, draft, no commands, map persistence and mobile layout.');
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
