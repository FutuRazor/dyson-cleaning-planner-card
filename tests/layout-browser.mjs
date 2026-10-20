import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = previewServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'msedge' });
  const page = await browser.newPage();
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.route('**/', async route => {
    const response = await route.fetch();
    const html = (await response.text()).replace('<dyson-cleaning-planner-card id="card"></dyson-cleaning-planner-card>', '<div id="grid-slot"><dyson-cleaning-planner-card id="card"></dyson-cleaning-planner-card></div>');
    await route.fulfill({ response, body: html });
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.locator('#card .room').first().waitFor();
  assert.deepEqual(await page.evaluate(() => demo.card.getGridOptions()), { columns: 12, min_columns: 9, rows: 'auto', min_rows: 1 });
  const natural = await page.locator('#card ha-card').evaluate(el => el.getBoundingClientRect().height);
  await page.evaluate(() => {
    // Model the fixed grid area that Home Assistant assigns to a manually sized card.
    document.querySelector('#grid-slot').style.cssText = 'height:320px;width:420px';
    demo.card.setConfig({ ...demo.card.config, grid_options: { columns: 9, rows: 5 } });
  });
  const dimensions = () => page.locator('#card').evaluate(el => {
    const card = el.shadowRoot.querySelector('ha-card');
    const content = el.shadowRoot.querySelector('.planner-content');
    return { height: card.getBoundingClientRect().height, client: content.clientHeight, scroll: content.scrollHeight };
  });
  let size = await dimensions();
  assert.equal(size.height, 320);
  assert.ok(size.scroll > size.client);
  await page.locator('#card [data-action="refresh"]').scrollIntoViewIfNeeded();
  assert.ok(await page.locator('#card .planner-content').evaluate(el => el.scrollTop > 0));
  await page.locator('#card .consumables-info').click();
  assert.equal(await page.locator('#card .consumables-panel').isVisible(), true);
  await page.keyboard.press('Escape');
  await page.evaluate(() => { demo.hass.states[demo.entity].state = 'cleaning'; demo.card.hass = { ...demo.hass }; });
  size = await dimensions();
  assert.equal(size.height, 320);
  assert.ok(size.scroll > size.client);
  await page.locator('#card .home').scrollIntoViewIfNeeded();
  assert.ok(await page.locator('#card .planner-content').evaluate(el => el.scrollTop > 0));
  await page.evaluate(() => {
    demo.hass.states[demo.entity].state = 'docked';
    demo.card.setConfig({ ...demo.card.config, grid_options: { columns: 9, rows: 'auto' } });
    demo.card.hass = { ...demo.hass };
  });
  size = await dimensions();
  assert.ok(size.height > 320, 'auto height restores natural content size');
  assert.equal(await page.locator('#card').evaluate(el => el.hasAttribute('fixed-height')), false);
  assert.ok(natural > 320);
  assert.deepEqual(errors, []);
  console.log('Layout checks passed: auto/manual height, scrolling in both views, overlay and restored auto height.');
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
