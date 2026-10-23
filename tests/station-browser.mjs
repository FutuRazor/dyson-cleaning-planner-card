import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = previewServer();
await new Promise(r => server.listen(0, '127.0.0.1', r));
let browser;
try {
  browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const card = page.locator('#card');
  await card.locator('.room').first().waitFor();
  await card.locator('[data-room]').first().check();
  await card.locator('[data-expand]').first().click();
  await card.locator('[data-setting="cleaning_mode"]').first().selectOption('Mop');
  const draft = await page.evaluate(() => JSON.stringify(demo.card.settingDraft));
  await card.locator('.consumables-info').click();
  assert.ok(await card.locator('#panel-consumables').isVisible());
  await card.locator('[data-info-tab="station"]').click();
  assert.equal(await card.locator('.station-row').count(), 6);
  assert.deepEqual(await card.locator('.station-row > span').allTextContents(), ['Hot water mopping', 'Cleaning solution', 'Extended roller preparation', 'Hot water self-cleaning', 'Self-cleaning frequency', 'Roller drying duration']);
  await card.locator('[data-station="hot_water_mopping"]').uncheck();
  await page.waitForFunction(() => !demo.card.stationBusy);
  await card.locator('[data-station="roller_drying_duration"]').selectOption('5 hours');
  await page.waitForFunction(() => !demo.card.stationBusy);
  assert.deepEqual(await page.evaluate(() => demo.calls), [
    { domain: 'switch', service: 'turn_off', data: { entity_id: 'switch.renamed_station_0' } },
    { domain: 'select', service: 'select_option', data: { entity_id: 'select.renamed_station_5', option: '5 hours' } }
  ]);
  assert.equal(await page.evaluate(() => JSON.stringify(demo.card.settingDraft)), draft);
  await page.evaluate(() => { demo.hass.states['switch.renamed_station_1'].state = 'unavailable'; demo.card.hass = { ...demo.hass }; });
  assert.ok(await card.locator('[data-station="cleaning_solution"]').isDisabled());
  await page.evaluate(() => { demo.hass.callService = async () => { throw new Error('Test rejection'); }; demo.card.hass = { ...demo.hass }; });
  await card.locator('[data-station="hot_water_mopping"]').evaluate(el => el.click());
  await page.waitForFunction(() => !demo.card.stationBusy);
  assert.match(await card.locator('.station-message').innerText(), /Test rejection/);
  await card.locator('[data-info-tab="station"]').focus();
  await page.keyboard.press('ArrowLeft');
  assert.ok(await card.locator('#panel-consumables').isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await card.locator('.consumables-overlay').isVisible(), false);
  assert.equal(await page.evaluate(() => demo.card.shadowRoot.activeElement.className.includes('consumables-info')), true);
  assert.deepEqual(errors, []);
  console.log('Station browser checks passed: tabs, ordered controls, exact writes, draft preservation, unavailable settings, errors and keyboard navigation.');
} finally { await browser?.close(); await new Promise(r => server.close(r)); }
