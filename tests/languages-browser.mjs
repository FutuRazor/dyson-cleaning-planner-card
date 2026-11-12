import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = previewServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ channel: 'msedge' });
try {
  const page = await browser.newPage({ viewport: { width: 1100, height: 1100 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const card = page.locator('#card');
  await card.locator('.rooms').waitFor();
  assert.equal(await card.locator('h2').textContent(), 'Plan a clean');
  await page.evaluate(() => {
    demo.hass.locale = { language: 'de-DE' }; demo.card.hass = { ...demo.hass };
  });
  assert.equal(await card.locator('h2').textContent(), 'Reinigung planen');
  await card.locator('[data-expand]').first().click();
  await card.locator('[data-room]').first().check({ force: true });
  const mode = card.locator('.fields:visible [data-setting=cleaning_mode]');
  await mode.selectOption({ label: 'Saugen und Wischen' });
  assert.equal(await mode.inputValue(), 'Vacuum and Mop');
  await card.locator('.fields:visible [data-option="Quiet"]').click();
  assert.equal(await page.evaluate(() => demo.calls.length), 0, 'editing remains local');
  const before = await page.evaluate(() => ({ selected: demo.card.selected, draft: demo.card.settingDraft }));
  await page.evaluate(() => demo.card.setConfig({ ...demo.card.config, language: 'en' }));
  assert.equal(await card.locator('h2').textContent(), 'Plan a clean');
  assert.deepEqual(await page.evaluate(() => ({ selected: demo.card.selected, draft: demo.card.settingDraft })), before);
  await page.evaluate(() => demo.card.setConfig({ ...demo.card.config, language: 'de' }));
  await card.locator('[data-action=save]').click();
  await page.waitForFunction(() => !demo.card.busy);
  const saved = await page.evaluate(() => demo.calls[0]);
  assert.equal(saved.service, 'save_room_settings');
  assert.deepEqual(saved.data.room_settings['10'], { cleaning_mode: 'Vacuum and Mop', cleaning_strategy: 'Quiet' });
  await card.locator('[data-action=consumables]').click();
  assert.equal(await card.locator('#tab-station').textContent(), 'Stationseinstellungen');
  const drying = card.locator('[data-station=roller_drying_duration]');
  await drying.selectOption({ label: '4 Stunden' });
  await page.waitForFunction(() => demo.calls.some(call => call.service === 'select_option'));
  assert.equal(await page.evaluate(() => demo.calls.find(call => call.service === 'select_option').data.option), '4 hours');
  await card.locator('[data-action=close-consumables]').click();

  // German labels must fit both layouts without widening the card.
  for (const width of [375, 482, 700]) {
    await page.evaluate(width => {
      document.querySelector('main').style.maxWidth = `${width}px`;
      document.body.classList.add('dark');
    }, width);
    await page.waitForTimeout(100);
    assert.ok(await card.evaluate(el => el.shadowRoot.querySelector('.planner-content').scrollWidth <= el.clientWidth), `${width}: no horizontal overflow`);
    await page.screenshot({ path: `languages-${width}.png`, fullPage: true });
  }
  await card.locator('[data-action=start]').click();
  await card.locator('.session').waitFor();
  assert.equal(await card.locator('h2').textContent(), 'Reinigung');
  assert.equal(await card.locator('.session-toggle span').textContent(), 'Pausieren');
  await card.locator('.session-toggle').click();
  await page.waitForFunction(() => demo.hass.states[demo.entity].state === 'paused');
  assert.equal(await card.locator('.session-toggle span').textContent(), 'Fortsetzen');
  assert.equal(await card.locator('dyson-planner-map').evaluate(el => el.img.alt), 'Live-Reinigungskarte');
  await page.locator('#docked').click();
  await page.locator('#settings').click();
  const editor = page.locator('dyson-cleaning-planner-card-editor');
  await editor.locator('[data-key=language]').selectOption('en');
  assert.equal(await card.locator('h2').textContent(), 'Plan a clean');
  await editor.locator('[data-key=title]').fill('My Dyson');
  await editor.locator('[data-key=language]').selectOption('de');
  assert.equal(await card.locator('h2').textContent(), 'My Dyson', 'custom title unchanged');
  assert.equal(await card.locator('.name').first().textContent(), 'Wohnzimmer');
  assert.deepEqual(errors, []);
  console.log('Languages verified: automatic/user selection, draft preservation, original service values, station controls, session/map/editor, and narrow/wide layouts.');
} finally { await browser.close(); server.close(); }
