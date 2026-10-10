import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = previewServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
  const page = await browser.newPage({ viewport: { width: 900, height: 1100 } });
  const errors = [];
  let imageRequests = 0;
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (request.url().includes('/api/camera_proxy/')) imageRequests++; });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const card = page.locator('#card');
  const state = value => page.evaluate(value => { demo.hass.states[demo.entity].state = value; demo.card.hass = { ...demo.hass }; }, value);
  const shot = name => page.screenshot({ path: fileURLToPath(new URL(`../artifacts/${name}.png`, import.meta.url)), fullPage: true });
  await card.locator('.room').first().waitFor();
  assert.equal(await card.locator('.room').count(), 5);
  assert.equal(await card.locator('.tag').innerText(), 'v0.2.1');
  assert.equal(await card.locator('.battery-value').innerText(), '100%');
  assert.equal(await card.locator('.battery-bolt').isVisible(), true);
  assert.equal(await card.locator('.battery').getAttribute('data-level'), 'high');
  assert.equal(await card.locator('.start').isDisabled(), true);
  await page.evaluate(() => {
    demo.hass.states[demo.start].state = '2026-10-06T17:27:30.003139+00:00';
    demo.hass.states[demo.ids[0]].state = 'on'; demo.card.hass = { ...demo.hass };
  });
  assert.equal(await card.locator('.start').isEnabled(), true);
  await card.locator('[data-action="reset"]').click();
  assert.equal(await card.locator('.start').isEnabled(), true);
  await page.evaluate(() => { demo.hass.states[demo.ids[0]].state = 'off'; demo.card.hass = { ...demo.hass }; });
  assert.equal(await card.locator('.start').isDisabled(), true);
  await card.locator('input[data-room]').nth(1).check();
  assert.equal(await card.locator('.start').isEnabled(), true);
  assert.equal(await page.evaluate(() => demo.hass.states[demo.ids[1]].state), 'off');
  for (const value of ['2026-10-06T17:27:30.003139+00:00', 'unknown', 'unavailable']) {
    await page.evaluate(value => { demo.hass.states[demo.start].state = value; demo.card.hass = { ...demo.hass }; }, value);
    assert.equal(await card.locator('.start').isEnabled(), true, 'button timestamps never gate the planner');
  }
  await card.locator('input[data-room]').nth(0).check();
  await card.locator('[data-expand]').nth(0).click();
  await card.locator('[data-expand]').nth(1).click();
  await card.locator('[data-mode]').nth(0).selectOption('Mop');
  assert.equal(await card.locator('[data-mode]').nth(1).inputValue(), 'Mop');
  assert.equal(await page.evaluate(() => demo.calls.length), 0);
  assert.equal(await card.getByRole('button', { name: 'Save settings', exact: true }).isDisabled(), true);
  assert.equal(imageRequests, 0, 'planner does not fetch the camera');
  await mkdir(new URL('../artifacts/', import.meta.url), { recursive: true });
  await shot('planner-v0.2.1');
  await page.evaluate(() => { demo.hass.states[demo.ids[4]].state = 'unavailable'; demo.card.hass = { ...demo.hass }; });
  await card.locator('.start').click();
  await page.waitForFunction(() => !demo.card.busy && demo.card.requestedPlan?.rooms.length === 2);
  assert.equal(await card.locator('.room').count(), 0);
  assert.equal(await card.locator('.start').count(), 0);
  assert.deepEqual(await card.locator('.requested li').allTextContents(), ['Küche', 'Wohnzimmer']);
  assert.equal(await card.locator('.session-title').innerText(), 'Cleaning session active');
  assert.equal(await page.evaluate(() => demo.calls.filter(c => c.domain === 'button').length), 1);
  const map = card.locator('dyson-planner-map');
  await map.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => !!demo.card.shadowRoot.querySelector('dyson-planner-map')?.objectUrl);
  await page.evaluate(() => { demo.map = demo.card.shadowRoot.querySelector('dyson-planner-map'); });
  // Battery updates must not recreate the camera or discard the local request.
  for (const [percent, charging, level] of [['42', 'off', 'medium'], ['10', 'on', 'low'], ['0', 'unknown', 'low'], ['unavailable', 'unavailable', 'unknown']]) {
    await page.evaluate(({ percent, charging }) => { demo.hass.states[demo.battery].state = percent; demo.hass.states[demo.charging].state = charging; demo.card.hass = { ...demo.hass }; }, { percent, charging });
    assert.equal(await card.locator('.battery-value').innerText(), percent === 'unavailable' ? '—' : `${percent}%`);
    assert.equal(await card.locator('.battery').getAttribute('data-level'), level);
    assert.equal(await card.locator('.battery-bolt').isVisible(), charging === 'on');
    assert.equal(await page.evaluate(() => demo.map === demo.card.shadowRoot.querySelector('dyson-planner-map')), true);
    assert.equal(await card.locator('.requested li').count(), 2);
  }
  await page.evaluate(() => { demo.hass.states[demo.battery].state = '78'; demo.hass.states[demo.charging].state = 'off'; demo.card.hass = { ...demo.hass }; });
  await shot('cleaning-desktop-v0.2.1');
  const beforeControl = await page.evaluate(() => demo.calls.length);
  await card.locator('[data-control="stop"]').click();
  await page.waitForFunction(() => !demo.card.controlBusy);
  await card.locator('[data-control="return_to_base"]').click();
  await page.waitForFunction(() => !demo.card.controlBusy);
  assert.deepEqual(await page.evaluate(n => demo.calls.slice(n), beforeControl), [
    { domain: 'vacuum', service: 'stop', data: { entity_id: 'vacuum.kuche_dyson_spot_scrub' } },
    { domain: 'vacuum', service: 'return_to_base', data: { entity_id: 'vacuum.kuche_dyson_spot_scrub' } }
  ]);
  assert.equal(await page.evaluate(() => demo.hass.states[demo.ids[0]].state), 'on');
  assert.equal(await card.locator('.session-title').innerText(), 'Robot returning');
  assert.match(await card.locator('.action-message').innerText(), /may still resume/);
  assert.equal(await page.evaluate(() => demo.map === demo.card.shadowRoot.querySelector('dyson-planner-map')), true);
  await page.evaluate(() => demo.card.start());
  assert.equal(await page.evaluate(() => demo.calls.length), beforeControl + 2);
  await page.locator('#settings').click();
  const editor = page.locator('dyson-cleaning-planner-card-editor');
  await editor.locator('[data-key="camera_rotation"]').waitFor();
  await page.locator('#theme').click();
  for (const width of [900, 390, 320]) {
    await page.setViewportSize({ width, height: 1100 });
    for (const rotation of [0, 90, 180, 270]) {
    await editor.locator('[data-key="camera_rotation"]').selectOption(String(rotation));
    await map.scrollIntoViewIfNeeded();
    const bounds = await map.evaluate((el, rotation) => {
      const frame = el.shadowRoot.querySelector('.viewport').getBoundingClientRect();
      const image = el.shadowRoot.querySelector('img').getBoundingClientRect();
      const panel = demo.card.shadowRoot.querySelector('ha-card');
      const outer = panel.getBoundingClientRect();
      return { fills: Math.abs(image.left - frame.left) < 1 && Math.abs(image.top - frame.top) < 1 && Math.abs(image.right - frame.right) < 1 && Math.abs(image.bottom - frame.bottom) < 1, fullWidth: Math.abs(frame.width - panel.clientWidth) < 1 && Math.abs(frame.left - outer.left - panel.clientLeft) < 1, ratio: frame.width / frame.height, rotation: el.rotation === rotation };
    }, rotation);
    assert.equal(bounds.fills, true, `${rotation} degrees fills the frame at ${width}px`);
    assert.equal(bounds.fullWidth, true, 'image extends to both card edges');
    assert.ok(Math.abs(bounds.ratio - (rotation % 180 ? 600 / 900 : 900 / 600)) < 0.01);
    assert.equal(bounds.rotation, true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    }
    const headerFits = await card.locator('header').evaluate(header => {
      const title = header.querySelector('.header-title').getBoundingClientRect();
      const battery = header.querySelector('.battery').getBoundingClientRect();
      return title.right <= battery.left && battery.right <= header.getBoundingClientRect().right;
    });
    assert.equal(headerFits, true, `battery and title fit at ${width}px`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await card.locator('.requested li').count(), 2);
  await page.locator('#settings').click();
  await shot('cleaning-mobile-rotated-v0.2.1');
  await map.scrollIntoViewIfNeeded();
  await page.route('**/api/camera_proxy/**', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.waitForFunction(() => demo.map.caption.textContent.includes('Showing the last received image.'), null, { timeout: 10000 });
  assert.equal(await card.locator('[data-control="stop"]').isEnabled(), true);
  await page.unroute('**/api/camera_proxy/**');
  await page.locator('#settings').click();
  await editor.locator('[data-key="show_camera"]').uncheck();
  assert.equal(await map.count(), 0);
  const beforeDisabled = imageRequests;
  await page.waitForTimeout(5500);
  assert.equal(imageRequests, beforeDisabled, 'camera disabled: no polling');
  await editor.locator('[data-key="show_camera"]').check();
  await map.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => !!demo.card.shadowRoot.querySelector('dyson-planner-map')?.objectUrl);
  await page.locator('#settings').click();
  await state('docked');
  assert.equal(await card.locator('.room').count(), 5);
  const beforeDocked = imageRequests;
  await page.waitForTimeout(5500);
  assert.equal(imageRequests, beforeDocked);
  await state('cleaning');
  assert.equal(await card.locator('.requested li').count(), 0);
  assert.match(await card.locator('.requested-note').innerText(), /not reported/);
  await state('paused');
  assert.equal(await card.locator('.session-title').innerText(), 'Cleaning paused');
  assert.equal(await card.getByRole('button', { name: /Resume|Start clean/ }).count(), 0);
  await state('unavailable');
  assert.equal(await card.locator('.session-title').innerText(), 'Robot unavailable');
  assert.equal(await card.locator('[data-control="stop"]').isDisabled(), true);
  assert.equal(await card.locator('[data-control="return_to_base"]').isDisabled(), true);
  assert.equal(await card.locator('.start').count(), 0);
  await state('error');
  assert.equal(await card.locator('.session-title').innerText(), 'Robot needs attention');
  await page.evaluate(() => { demo.original = demo.hass.callService; demo.hass.callService = async () => { throw new Error('Action denied'); }; demo.card.hass = { ...demo.hass }; });
  await card.locator('[data-control="stop"]').click();
  await page.waitForFunction(() => !demo.card.controlBusy);
  assert.equal(await card.locator('.action-message').innerText(), 'Action denied');
  await page.evaluate(() => { demo.hass.callService = demo.original; demo.hass.states[demo.entity].attributes.supported_features = 0; demo.card.hass = { ...demo.hass }; });
  assert.equal(await card.locator('[data-control="stop"]').isDisabled(), true);
  assert.equal(await card.locator('[data-control="return_to_base"]').isDisabled(), true);
  await state('docked');
  await page.locator('#settings').click();
  await editor.locator('[data-key="unsupported_settings"]').selectOption('hidden');
  await card.locator('[data-expand]').first().click();
  assert.equal(await card.locator('.field').filter({ hasText: 'Water level' }).count(), 0);
  await editor.locator('[data-include]').first().uncheck();
  assert.equal(await card.locator('.room').count(), 4);
  await page.evaluate(() => {
    demo.hass.callService = async (domain, service, data) => { demo.calls.push({ domain, service, data }); };
    demo.hass.states[demo.ids[0]].state = 'off'; demo.card.hass = { ...demo.hass };
  });
  await card.locator('.start').click();
  await page.waitForFunction(() => !demo.card.busy && demo.card.pendingStart);
  assert.equal(await card.locator('.session-title').innerText(), 'Starting clean');
  assert.equal(await card.locator('.start').count(), 0);
  await state('cleaning');
  assert.equal(await card.locator('.requested li').count(), 1);
  await page.evaluate(() => {
    const second = document.createElement('dyson-cleaning-planner-card'); second.id = 'second';
    second.setConfig({ ...demo.card.config, show_camera: false }); second.hass = demo.hass; document.querySelector('main').append(second);
  });
  assert.equal(await page.locator('#second').locator('.requested li').count(), 0);
  await page.evaluate(() => { document.querySelector('#second').remove(); demo.card.remove(); });
  const beforeDetached = imageRequests;
  await page.waitForTimeout(5500);
  assert.equal(imageRequests, beforeDetached, 'detached cards stop polling');
  assert.deepEqual(errors, []);
  console.log('Browser checks passed: planner regression, active status, exact Stop/Home calls, camera refresh/errors/disable/rotation/cleanup, editor, mobile, request snapshots and pending starts.');
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
