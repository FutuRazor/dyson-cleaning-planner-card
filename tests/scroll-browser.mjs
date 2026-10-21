import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = previewServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.locator('#card .room').first().waitFor();
  await page.evaluate(() => {
    demo.card.style.height = '320px';
    demo.card.setConfig({ ...demo.card.config, grid_options: { columns: 9, rows: 5 } });
  });
  for (const action of ['select', 'expand', 'mode']) {
    const result = await page.evaluate(async action => {
      const root = demo.card.shadowRoot;
      const content = root.querySelector('.planner-content');
      const frame = root.querySelector('ha-card');
      content.scrollTop = 100;
      const before = content.scrollTop;
      const room = root.querySelectorAll('.room')[1];
      if (action === 'select') room.querySelector('input').click();
      if (action === 'expand') room.querySelector('[data-expand]').click();
      if (action === 'mode') {
        const select = room.querySelector('[data-setting="cleaning_mode"]');
        select.focus({ preventScroll: true });
        select.value = 'Mop';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return { before, after: root.querySelector('.planner-content').scrollTop,
        sameContent: content === root.querySelector('.planner-content'), sameFrame: frame === root.querySelector('ha-card') };
    }, action);
    assert.ok(result.before > 0);
    assert.equal(result.after, result.before, `${action}: scroll position`);
    assert.ok(result.sameContent && result.sameFrame, `${action}: mounted frame retained`);
  }
  for (const state of ['cleaning', 'docked']) {
    const position = await page.evaluate(async state => {
      demo.card.shadowRoot.querySelector('.planner-content').scrollTop = 150;
      demo.hass.states[demo.entity].state = state;
      demo.card.hass = { ...demo.hass };
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return demo.card.shadowRoot.querySelector('.planner-content').scrollTop;
    }, state);
    assert.equal(position, 0, `${state}: new view starts at top`);
    assert.ok(await page.locator('#card ha-card').isVisible(), `${state}: frame visible`);
    if (state === 'cleaning') {
      assert.equal(await page.locator('#card h2').innerText(), 'Cleaning session');
      assert.equal(await page.locator('#card dyson-planner-map').evaluate(el => typeof el.setOptions), 'function');
    }
  }
  // Loading a dashboard during an existing clean must also render the session immediately.
  await page.evaluate(() => {
    demo.hass.states[demo.entity].state = 'cleaning';
    const card = document.createElement('dyson-cleaning-planner-card');
    card.id = 'active-on-load';
    card.style.height = '320px';
    card.setConfig({ ...demo.card.config });
    card.hass = demo.hass;
    document.body.append(card);
  });
  await page.locator('#active-on-load .home').waitFor();
  assert.ok(await page.locator('#active-on-load ha-card').isVisible());
  assert.equal(await page.locator('#active-on-load h2').innerText(), 'Cleaning session');
  await page.evaluate(() => {
    demo.hass.states[demo.entity].state = 'docked';
    Object.assign(demo.hass.states[demo.entity].attributes, { dock_state: 'DRYING_MOP', drying_total_seconds:14400, drying_remaining_seconds:7200 });
    demo.card.hass = { ...demo.hass };
  });
  for (const width of [320, 420, 580]) {
    await page.locator('#card').evaluate((el, width) => { el.style.width = `${width}px`; }, width);
    const bar = page.locator('#card .drying-progress');
    assert.ok(await bar.isVisible());
    assert.equal(await bar.getAttribute('aria-valuenow'), '50');
    const bounds = await bar.boundingBox();
    const button = await page.locator('#card .cancel-drying').boundingBox();
    assert.ok(bounds.x + bounds.width < button.x, 'bar ends before cancel button');
  }
  await page.evaluate(() => {
    delete demo.hass.states[demo.entity].attributes.drying_total_seconds;
    demo.card.hass = { ...demo.hass };
  });
  assert.equal(await page.locator('#card .drying-progress').isVisible(), false);
  assert.deepEqual(errors, []);
  console.log('Scroll checks passed: selection, expansion, mode changes, mounted containers, and both view transitions.');
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
