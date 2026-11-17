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
  await page.evaluate(() => {
    demo.hass.states[demo.entity].state = 'docked';
    demo.card.message = '';
    demo.savedActions = { ...demo.hass.services.dyson_spot_scrub };
    delete demo.hass.services.dyson_spot_scrub.save_room_settings;
    demo.card.hass = { ...demo.hass };
  });
  const notice = page.locator('#card .header-notice');
  assert.ok(await notice.isVisible());
  await page.locator('#card [data-action="dismiss-notice"]').click();
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => { demo.card.hass = { ...demo.hass }; });
    assert.ok(await notice.isHidden(), 'Telemetry must not revive the dismissed planner notice');
  }
  // A genuinely different notice must still be shown.
  await page.evaluate(() => {
    demo.hass.services.dyson_spot_scrub = demo.savedActions;
    demo.card.selected = [demo.ids[0]];
    demo.card.dirty = true;
    demo.card.baseline = 'older room settings';
    demo.card.hass = { ...demo.hass };
  });
  assert.ok(await notice.isVisible());
  assert.match(await notice.innerText(), /Settings changed outside/);
  await page.locator('#card [data-action="dismiss-notice"]').click();
  await page.evaluate(() => { demo.card.hass = { ...demo.hass }; });
  assert.ok(await notice.isHidden());
  // Once a notice genuinely clears, its later recurrence is new.
  await page.evaluate(() => { demo.card.resetDraft(); demo.card.render(); });
  assert.ok(await notice.isHidden());
  await page.evaluate(() => {
    demo.card.dirty = true; demo.card.baseline = 'older room settings';
    demo.card.render();
  });
  assert.ok(await notice.isVisible());
  // Dismissing a start-ready fault is a status-only update, not a new planner calculation.
  await page.evaluate(() => {
    demo.hass.states[demo.entity].state = 'error';
    demo.hass.states[demo.entity].attributes.ready_to_start = true;
    demo.card.hass = { ...demo.hass };
  });
  assert.ok(await page.locator('#card .header-fault').isVisible());
  await page.locator('#card [data-action="dismiss-fault"]').click();
  assert.ok(await notice.isVisible(), 'The valid draft warning survives fault dismissal');
  assert.match(await notice.innerText(), /Settings changed outside/);
  await page.locator('#card [data-action="dismiss-notice"]').click();
  await page.locator('#card [data-action="open-fault"]').click();
  await page.locator('#card [data-action="dismiss-fault"]').click();
  assert.ok(await notice.isHidden(), 'Status-only updates preserve warning dismissal');
  await page.evaluate(() => {
    demo.hass.states[demo.entity].state = 'cleaning';
    demo.card.hass = { ...demo.hass };
  });
  assert.equal(await page.evaluate(() => demo.card._plannerNotice), '', 'Session explicitly clears planner warnings');
  await page.evaluate(() => {
    demo.hass.states[demo.entity].state = 'docked';
    demo.card.hass = { ...demo.hass };
  });
  // Use the normal view switch, leaving any header notice unrelated to navigation intact.
  await page.locator('#card [data-action="zones"]').click();
  assert.equal(await page.evaluate(() => demo.card._plannerNotice), '', 'Zone explicitly clears planner warnings');
  console.log('Header notices: stable planner/session heights, neutral style, clearing and fault priority passed.');
} finally { await browser.close(); server.close(); }
