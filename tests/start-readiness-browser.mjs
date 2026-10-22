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
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const card = page.locator('#card');
  await card.locator('.room').first().waitFor();
  await card.locator('[data-room]').first().check();
  await card.locator('[data-expand]').first().click();
  await card.locator('[data-setting="cleaning_mode"]').first().selectOption('Mop');
  const draft = await page.evaluate(() => JSON.stringify(demo.card.settingDraft));
  for (const [ready, reason, dock, disabled, label] of [
    [false, 'returning_or_finishing', 'IDLE', true, 'Returning to dock'],
    [false, 'washing_mop', 'WASHING_MOP', true, 'Cleaning mop roller'],
    [false, 'emptying_bin', 'COLLECTING_DUST', true, 'Emptying dust bin'],
    [true, '', 'DRYING_MOP', false, 'Drying mop roller'],
    [true, '', 'IDLE', false, null],
    [false, 'mapping_or_navigation', 'IDLE', true, 'Mapping / navigation'],
    [false, 'future_reason', 'IDLE', true, 'The integration is not ready'],
    [null, '', 'WASHING_MOP', true, 'Cleaning mop roller'],
    [null, '', 'DRYING_MOP', false, 'Drying mop roller'],
    [null, '', 'IDLE', false, null]
  ]) {
    await page.evaluate(({ ready, reason, dock }) => {
      const vacuum = demo.hass.states[demo.entity];
      vacuum.state = 'docked';
      Object.assign(vacuum.attributes, { dock_state: dock, start_block_reason: reason });
      if (ready === null) delete vacuum.attributes.ready_to_start;
      else vacuum.attributes.ready_to_start = ready;
      demo.card.hass = { ...demo.hass };
    }, { ready, reason, dock });
    assert.equal(await card.locator('[data-action="start"]').isDisabled(), disabled, `${reason}/${dock}: Start`);
    if (label) assert.ok((await card.locator('.activity-text').innerText()).includes(label));
    else assert.equal(await card.locator('.activity-status').isVisible(), false);
    assert.equal(await page.evaluate(() => JSON.stringify(demo.card.settingDraft)), draft, 'Draft survives telemetry updates');
    assert.equal(await card.locator('[data-room]').first().isChecked(), true);
    assert.equal(await page.evaluate(() => demo.calls.length), 0, 'Telemetry and editing send no commands');
  }
  assert.deepEqual(errors, []);
  console.log('Start readiness browser checks passed: return, dock phases, unknown reasons, legacy fallback and draft retention.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
