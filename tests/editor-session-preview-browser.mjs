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
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const dashboard = page.locator('#card');
  await dashboard.locator('.rooms').waitFor();
  await page.evaluate(()=>{
    window.rotationPreviewLoading=import('/tests/map-selection-fixture.mjs').then(module=>{
      const f=module.mapSelectionFixture();
      demo.registry.push(f.registry.find(row=>row.entity_id===f.mapSelect));
      demo.hass.states[f.mapSelect]=f.hass.states[f.mapSelect];
      demo.hass.states[demo.entity].attributes.map_id=f.maps[0].map_id;
      demo.card.hass={...demo.hass};window.rotationPreviewReady=true;
    });
  });
  await page.waitForFunction(()=>window.rotationPreviewReady);
  for (const wrapper of ['hui-card', 'hui-section']) {
    await page.evaluate(wrapper => {
      const dialog = document.body.appendChild(document.createElement('hui-dialog-edit-card'));
      const scope = dialog.attachShadow({ mode: 'open' });
      const host = scope.appendChild(document.createElement(wrapper));
      host.setAttribute('preview', '');
      const preview = document.createElement('dyson-cleaning-planner-card');
      const editor = document.createElement('dyson-cleaning-planner-card-editor');
      for (const el of [preview, editor]) { el.setConfig(demo.card.config); el.hass = demo.hass; }
      host.attachShadow({ mode: 'open' }).append(preview);
      scope.append(editor);
      editor.addEventListener('config-changed', e => preview.setConfig(e.detail.config));
    }, wrapper);
    const dialog = page.locator('hui-dialog-edit-card');
    const card = dialog.locator('dyson-cleaning-planner-card');
    const editor = dialog.locator('dyson-cleaning-planner-card-editor');
    const camera = editor.locator('[data-key=show_camera]');
    await editor.locator('[data-key=zone_dimension_unit]').selectOption('inch');
    await card.locator('dyson-planner-zone').waitFor();
    assert.equal(await card.locator('dyson-planner-zone').evaluate(el=>el.dimensionUnit), 'inch');
    assert.equal(await dashboard.locator('dyson-planner-zone').count(), 0);
    await editor.locator('[data-key=always_show_all_settings]').dispatchEvent('pointerdown');
    await card.locator('.rooms').waitFor();

    await editor.locator('[data-key=camera_entity]').dispatchEvent('pointerdown');
    await card.locator('dyson-planner-map').waitFor();
    assert.equal(await card.locator('.session-title').textContent(), 'Cleaning session preview');
    assert.ok(await card.locator('.home').isDisabled());
    await camera.uncheck();
    assert.ok(await card.locator('.session-title').isVisible());
    assert.equal(await card.locator('dyson-planner-map').count(), 0);
    await camera.check();
    await editor.locator('[data-key=camera_rotation]').selectOption('90');
    assert.equal(await card.locator('dyson-planner-map').evaluate(el=>el.rotation),90);
    await editor.locator('[data-map-rotation="1784483068"]').selectOption('180');
    assert.equal(await card.locator('dyson-planner-map').evaluate(el=>el.rotation),180);
    await editor.locator('[data-map-rotation="1795646759"]').selectOption('270');
    assert.equal(await card.locator('dyson-planner-map').evaluate(el=>el.rotation),180,'editing another map does not switch the active preview');
    await editor.locator('[data-map-rotation="1784483068"]').selectOption('default');
    assert.equal(await card.locator('dyson-planner-map').evaluate(el=>el.rotation),90,'Default restores global rotation');
    await editor.locator('[data-key=always_show_all_settings]').dispatchEvent('pointerdown');
    await card.locator('.rooms').waitFor();
    for (const target of ['[data-key=always_show_all_settings]', '[data-include]', '[data-order]:enabled']) {
      await editor.locator('[data-key=camera_entity]').dispatchEvent('pointerdown');
      await card.locator('.session-title').waitFor({state:'attached'});
      await editor.locator(target).first().click();
      await card.locator('.rooms').waitFor();
    }
    await editor.locator('[data-key=camera_entity]').dispatchEvent('pointerdown');
    await card.locator('.session-title').waitFor({state:'attached'});
    assert.ok(await dashboard.locator('.rooms').isVisible());
    await editor.evaluate(el => el.remove());
    await card.locator('.rooms').waitFor();
    assert.equal(await page.evaluate(() => demo.calls.length), 0);
    await dialog.evaluate(el => el.remove());
  }
  console.log('Editor session preview checks passed.');
} finally { await browser?.close(); server.close(); }
