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
  await page.goto('http://127.0.0.1:' + server.address().port + '/');
  await page.locator('#card .rooms').waitFor();
  await page.locator('#card [data-action="consumables"]').click();
  const tabs = page.locator('#card [role="tab"]');
  await page.locator('#tab-station').focus();
  for (const [key, expected] of [
    ['ArrowRight', 'robot'], ['ArrowRight', 'consumables'], ['ArrowRight', 'station'],
    ['ArrowLeft', 'consumables'], ['ArrowLeft', 'robot'], ['ArrowLeft', 'station'],
    ['End', 'consumables'], ['Home', 'station']
  ]) {
    await page.keyboard.press(key);
    assert.equal(await tabs.evaluateAll(items => items.find(el => el === el.getRootNode().activeElement)?.dataset.infoTab), expected);
    assert.equal(await page.locator('#tab-' + expected).getAttribute('aria-selected'), 'true');
  }
  assert.equal(await page.evaluate(async () => {
    const card = demo.card;
    await card.setRobotSetting('invalid_test_setting', true);
    if (!card.robotMessage) throw new Error('Expected an action error');
    card.toggleConsumables(false);
    card.toggleConsumables(true);
    if (card.robotMessage) throw new Error('Reopening kept the action error');
    card.robotMessage = 'Old device error';
    const config = { ...card.config };
    card.setConfig({ ...config, entity: 'vacuum.other_robot' });
    const cleared = !card.robotMessage;
    card.setConfig(config);
    card.toggleConsumables(true);
    return cleared;
  }), true, 'Device change clears robot action errors');
  await page.keyboard.press('Escape');
  // Exercise the real zone overlay without making camera or robot requests.
  await page.evaluate(() => {
    window.keyboardZone = document.createElement('dyson-planner-zone');
    document.body.append(keyboardZone);
    keyboardZone.dialog.hidden = false;
    const root = keyboardZone.shadowRoot;
    root.querySelector('.power-setting').hidden = true;
    root.querySelector('.water-setting').hidden = true;
    root.querySelector('.segments').hidden = true;
    root.querySelector('[data-do="close-settings"]').focus();
  });
  const zone = page.locator('dyson-planner-zone');
  const focused = () => zone.evaluate(el => el.shadowRoot.activeElement?.id || el.shadowRoot.activeElement?.dataset.do);
  await page.keyboard.press('Shift+Tab');
  assert.equal(await focused(), 'zone-mode', 'Reverse wrap skips hidden groups');
  await page.keyboard.press('Tab');
  assert.equal(await focused(), 'close-settings', 'Forward wrap skips hidden groups');
  await zone.evaluate(el => {
    const root = el.shadowRoot;
    root.querySelector('.segments').hidden = false;
    root.querySelector('[data-passes="2"]').hidden = true;
    root.querySelector('#zone-mode').disabled = true;
  });
  await page.keyboard.press('Tab');
  assert.equal(await zone.evaluate(el => el.shadowRoot.activeElement?.dataset.passes), '1', 'Disabled selects are skipped');
  await page.keyboard.press('Tab');
  assert.equal(await focused(), 'close-settings', 'Individually hidden button is skipped');
  console.log('Keyboard navigation: all info tabs, wraparound, Home/End, hidden groups and disabled controls passed.');
} finally {
  await browser?.close();
  server.close();
}
