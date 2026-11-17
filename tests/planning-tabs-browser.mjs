import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
  const measurements = [];
  for (const width of [375, 900]) {
    await page.setViewportSize({ width, height: 1200 });
    for (const view of ['rooms', 'zones']) {
      await page.locator('.planning-tabs [data-action="' + view + '"]').click();
      await page.evaluate(() => document.activeElement?.blur());
      measurements.push(await page.locator('.planning-tabs').evaluate(el => {
        const measure = node => {
          const r = node.getBoundingClientRect(), css = getComputedStyle(node);
          return { width:r.width, height:r.height, x:r.x, y:r.y, padding:css.padding, margin:css.margin,
            color:css.color, background:css.backgroundColor, border:css.border, font:css.font };
        };
        return [measure(el), ...[...el.children].map(measure)];
      }));
    }
  }
  const baseline = join(tmpdir(), 'dyson-planning-tabs-baseline.json');
  if (process.env.CAPTURE_TAB_BASELINE) {
    await writeFile(baseline, JSON.stringify(measurements));
    console.log('Captured tab layout baseline.');
  } else {
    if (process.env.COMPARE_TAB_BASELINE) assert.deepEqual(measurements, JSON.parse(await readFile(baseline, 'utf8')));
    await page.locator('.planning-tabs [data-action="rooms"]').click();
    await page.locator('#planning-tab-rooms').focus();
    for (const [key, expected] of [['ArrowRight','zones'], ['ArrowRight','rooms'], ['ArrowLeft','zones'], ['Home','rooms'], ['End','zones']]) {
      await page.keyboard.press(key);
      assert.equal(await page.locator('.planning-tabs [aria-selected="true"]').getAttribute('data-action'), expected);
      assert.equal(await page.locator('.planning-tabs').evaluate(el => el.getRootNode().activeElement?.dataset.action), expected);
      assert.ok(await page.locator('#planning-panel-' + expected).isVisible());
      assert.ok(await page.locator('#planning-panel-' + (expected === 'rooms' ? 'zones' : 'rooms')).isHidden());
      assert.equal(await page.locator('#planning-tab-' + expected).getAttribute('aria-controls'), 'planning-panel-' + expected);
      assert.equal(await page.locator('#planning-panel-' + expected).getAttribute('aria-labelledby'), 'planning-tab-' + expected);
    }
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.planning-tabs').evaluate(el => el.contains(el.getRootNode().activeElement)), false);
    console.log('Planning tabs: keyboard navigation, ARIA relationships and focus passed; layout baseline matched when requested.');
  }
} finally { await browser?.close(); server.close(); }
