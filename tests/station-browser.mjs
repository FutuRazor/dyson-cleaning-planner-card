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
  assert.ok(await card.locator('#panel-station').isVisible());
  assert.deepEqual(await card.locator('[role=tab]').allTextContents(), ['Station settings', 'Consumables']);
  await card.locator('[data-info-tab="station"]').click();
  assert.equal(await card.locator('.station-row').count(), 8);
  assert.equal(await card.locator('.station-row ha-switch').count(), 4);
  assert.deepEqual(await card.locator('.station-row > span').allTextContents(), ['Hot water mopping', 'Cleaning solution', 'Extended roller preparation', 'Hot water self-cleaning', 'Self-cleaning frequency', 'Roller drying duration', 'Empty dust bin', 'Wash mop roller']);
  await card.locator('ha-switch[data-station="hot_water_mopping"] input').uncheck();
  await page.waitForFunction(() => !demo.card.stationBusy);
  assert.equal(await card.locator('.station-message').isVisible(), false);
  await card.locator('[data-station="roller_drying_duration"]').selectOption('5 hours');
  await page.waitForFunction(() => !demo.card.stationBusy);
  assert.equal(await card.locator('.station-message').isVisible(), false);
  assert.deepEqual(await page.evaluate(() => demo.calls), [
    { domain: 'switch', service: 'turn_off', data: { entity_id: 'switch.renamed_station_0' } },
    { domain: 'select', service: 'select_option', data: { entity_id: 'select.renamed_station_5', option: '5 hours' } }
  ]);
  await card.locator('[data-station-action="empty_bin"]').click();
  await page.waitForFunction(() => !demo.card.stationBusy);
  assert.equal(await card.locator('.station-message').isVisible(), false);
  await card.locator('[data-station-action="wash_mop"]').click();
  await page.waitForFunction(() => !demo.card.stationBusy);
  assert.equal(await card.locator('.station-message').isVisible(), false);
  assert.deepEqual(await page.evaluate(() => demo.calls.slice(-2)), [
    { domain: 'button', service: 'press', data: { entity_id: 'button.renamed_empty_bin' } },
    { domain: 'button', service: 'press', data: { entity_id: 'button.renamed_wash_mop' } }
  ]);
  await page.evaluate(() => { demo.hass.states['button.renamed_empty_bin'].state = 'unavailable'; demo.card.hass = { ...demo.hass }; });
  assert.ok(await card.locator('[data-station-action="empty_bin"] button').isDisabled());
  assert.equal(await page.evaluate(() => JSON.stringify(demo.card.settingDraft)), draft);
  await page.evaluate(() => { demo.hass.states['switch.renamed_station_1'].state = 'unavailable'; demo.card.hass = { ...demo.hass }; });
  assert.ok(await card.locator('ha-switch[data-station="cleaning_solution"] input').isDisabled());
  await page.evaluate(() => { demo.hass.callService = async () => { throw new Error('Test rejection'); }; demo.card.hass = { ...demo.hass }; });
  await card.locator('ha-switch[data-station="hot_water_mopping"] input').evaluate(el => el.click());
  await page.waitForFunction(() => !demo.card.stationBusy);
  assert.match(await card.locator('.station-message').innerText(), /Test rejection/);
  await card.locator('[data-info-tab="station"]').focus();
  await page.keyboard.press('ArrowLeft');
  assert.ok(await card.locator('#panel-consumables').isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await card.locator('.consumables-overlay').isVisible(), false);
  assert.equal(await page.evaluate(() => demo.card.shadowRoot.activeElement.className.includes('consumables-info')), true);
  await page.evaluate(() => {
    demo.registry.push({ entity_id: 'sensor.renamed_drying', unique_id: 'DEMO_drying_remaining', platform: 'dyson_spot_scrub', device_id: 'demo-device' });
    demo.hass.states['sensor.renamed_drying'] = { state: '10680', attributes: { total_seconds: 10800 } };
    Object.assign(demo.hass.states[demo.entity].attributes, { dock_state: 'DRYING_MOP', drying_remaining_seconds: 60 });
    demo.card.hass = { ...demo.hass };
  });
  assert.match(await card.locator('.activity-remaining').innerText(), /02:58/);
  assert.equal(await card.locator('.drying-progress').getAttribute('aria-valuenow'), '99');
  await page.evaluate(() => { demo.hass.states['sensor.renamed_drying'].state = 'unavailable'; demo.card.hass = { ...demo.hass }; });
  assert.match(await card.locator('.activity-remaining').innerText(), /unavailable/);
  assert.equal(await card.locator('.drying-progress').isVisible(), false);
  assert.deepEqual(errors, []);
  console.log('Station browser checks passed: tabs, ordered controls, exact writes, draft preservation, unavailable settings, errors and keyboard navigation.');
} finally { await browser?.close(); await new Promise(r => server.close(r)); }
