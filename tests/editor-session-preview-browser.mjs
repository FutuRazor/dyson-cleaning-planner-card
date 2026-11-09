import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = previewServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const dashboard = page.locator('#card');
  await dashboard.locator('.rooms').waitFor();
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
    await editor.locator('[data-key=camera_entity]').dispatchEvent('pointerdown');
    await card.locator('dyson-planner-map').waitFor();
    assert.equal(await card.locator('.session-title').innerText(), 'Cleaning session preview');
    assert.ok(await card.locator('.home').isDisabled());
    await camera.uncheck();
    assert.ok(await card.locator('.session-title').isVisible());
    assert.equal(await card.locator('dyson-planner-map').count(), 0);
    await camera.check();
    await editor.locator('[data-key=camera_rotation]').selectOption('90');
    await editor.locator('[data-key=unsupported_settings]').dispatchEvent('pointerdown');
    await card.locator('.rooms').waitFor();
    for (const target of ['[data-key=always_show_all_settings]', '[data-include]', '[data-order]:enabled']) {
      await editor.locator('[data-key=camera_entity]').dispatchEvent('pointerdown');
      await card.locator('.session-title').waitFor();
      await editor.locator(target).first().click();
      await card.locator('.rooms').waitFor();
    }
    await editor.locator('[data-key=camera_entity]').dispatchEvent('pointerdown');
    await card.locator('.session-title').waitFor();
    assert.ok(await dashboard.locator('.rooms').isVisible());
    await editor.evaluate(el => el.remove());
    await card.locator('.rooms').waitFor();
    assert.equal(await page.evaluate(() => demo.calls.length), 0);
    await dialog.evaluate(el => el.remove());
  }
  console.log('Editor session preview checks passed.');
} finally { await browser?.close(); server.close(); }
