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
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const card = page.locator('#card');
  await card.locator('.room').first().waitFor();
  await card.locator('[data-expand]').first().click();
  await card.locator('[data-setting="cleaning_mode"]').first().selectOption('Mop');
  assert.equal(await page.evaluate(() => demo.calls.length), 0);
  // Editing an unselected room is allowed, and discarding never sends a command.
  await card.locator('[data-action="reset"]').click();
  assert.equal(await card.locator('[data-setting="cleaning_mode"]').first().inputValue(), 'Vacuum');
  assert.equal(await page.evaluate(() => demo.calls.length), 0);
  await card.locator('input[data-room]').first().check();
  await card.locator('[data-setting="cleaning_mode"]').first().selectOption('Mop');
  await page.evaluate(() => {
    demo.hass.states[demo.fields[10].cleaning_mode].state = 'Vacuum and Mop';
    demo.card.hass = { ...demo.hass };
    demo.originalService = demo.hass.callService;
    demo.hass.callService = async () => { throw new Error('Save denied'); };
    demo.card.hass = { ...demo.hass };
  });
  assert.equal(await card.locator('[data-setting="cleaning_mode"]').first().inputValue(), 'Mop');
  await card.locator('[data-action="save"]').click();
  await page.waitForFunction(() => !demo.card.busy);
  assert.match(await card.locator('[role="status"]').innerText(), /Save denied/);
  assert.equal(await card.locator('[data-setting="cleaning_mode"]').first().inputValue(), 'Mop');
  assert.equal(await card.locator('input[data-room]').first().isChecked(), true);
  // Rename both room and entity while the same native room ID retains the draft.
  await page.evaluate(async () => {
    demo.hass.callService = demo.originalService;
    demo.hass.states[demo.entity].attributes.rooms[0] = 'New room';
    const row = demo.registry.find(r => r.entity_id === demo.ids[0]);
    demo.hass.states['switch.new_room'] = demo.hass.states[row.entity_id];
    delete demo.hass.states[row.entity_id]; row.entity_id = 'switch.new_room';
    for (const e of demo.registry) e.unique_id = e.unique_id.replace('_wohnzimmer', '_new_room');
    demo.card.hass = { ...demo.hass };
    await demo.card.loadRegistry();
  });
  assert.deepEqual(await page.evaluate(() => demo.card.selected), ['switch.new_room']);
  await card.locator('[data-expand]').first().click();
  assert.equal(await card.locator('[data-setting="cleaning_mode"]').first().inputValue(), 'Mop');
  await card.locator('[data-action="save"]').click();
  await page.waitForFunction(() => !demo.card.busy);
  assert.equal(await page.evaluate(() => demo.calls.at(-1).data.room_settings[10].cleaning_mode), 'Mop');
  assert.equal(await page.evaluate(() => Object.keys(demo.card.settingDraft).length), 0);
  assert.equal(await card.locator('input[data-room]').first().isChecked(), true);
  // A successful action with missing state confirmation must retain its draft.
  await card.locator('[data-setting="cleaning_mode"]').first().selectOption('Vacuum then Mop');
  await page.evaluate(() => { demo.hass.callService = async (...args) => { demo.unconfirmed = args; }; demo.card.hass = { ...demo.hass }; });
  await card.locator('[data-action="save"]').click();
  await page.waitForFunction(() => !demo.card.busy, null, { timeout: 10000 });
  assert.match(await card.locator('[role="status"]').innerText(), /not reflected/);
  assert.equal(await page.evaluate(() => demo.card.settingDraft[10].cleaning_mode), 'Vacuum then Mop');
  assert.deepEqual(errors, []);
  console.log('Draft browser checks passed: discard, external edits, save rejection, rename migration, selection retention and confirmation timeout.');
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
