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
  browser = await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL ? {channel:process.env.BROWSER_CHANNEL} : {})});
  const page = await browser.newPage({viewport:{width:900,height:1000}});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const card = page.locator('#card');
  await card.locator('.room').first().waitFor();
  await page.evaluate(() => {
    const base = demo.card.adapter;
    window.roomRequests = [];
    window.planning = {supportsSave:false,supportsStart:true,canSave:false,canStart:true,ordered:false};
    const rooms = ['Kitchen','Hall'].map(name => ({key:`area:${name.toLowerCase()}`,roomId:name.toLowerCase(),name,available:true,settings:{}}));
    const adapter = {...base,
      roomContext:() => 'map-a', discover:() => ({rooms,issues:[]}),
      roomSelectionState:() => 'off', roomPresentation:() => ({fields:[]}),
      roomPlanningState:() => planning, supportsZoneDevice:() => false,
      scheduleState:() => ({supported:false}),
      sendRoomDraft:async request => {
        roomRequests.push({selected:[...request.selected],draft:request.draft,start:request.start});
        demo.hass.states[demo.entity].state = 'cleaning';
        demo.card.hass = {...demo.hass};
        return {rooms:request.selected.map(key => ({room_id:key,name:rooms.find(room => room.key === key).name})),sent:true};
      },
    };
    Object.defineProperty(demo.card,'adapter',{value:adapter,configurable:true});
  });
  await mkdir(new URL('../artifacts/', import.meta.url), {recursive:true});
  for (const theme of ['modern','classic']) {
    await page.evaluate(theme => {
      demo.hass.states[demo.entity].state = 'docked';
      demo.card.setConfig({...demo.card.config,theme,show_camera:false});
    }, theme);
    assert.equal(await card.locator('.room-plain').count(), 2);
    assert.equal(await card.locator('[data-action="save"], [data-expand], [data-setting]').count(), 0);
    assert.equal(await card.locator('[data-action="start"]').isDisabled(), true);
    await card.locator('[data-room="area:kitchen"]').check();
    await card.locator('[data-room="area:hall"]').check();
    assert.equal(await card.locator('[data-action="start"]').isEnabled(), true);
    assert.doesNotMatch(await card.locator('.rooms').innerText(), /Room settings unavailable|\([12]\)/);
    if (theme === 'modern') assert.deepEqual(await card.locator('.selection-circle').allTextContents(), ['✓','✓']);
    await page.evaluate(() => { planning.canStart = false; demo.card.hass = {...demo.hass}; });
    assert.equal(await card.locator('[data-action="start"]').isDisabled(), true);
    await page.evaluate(() => { planning.canStart = true; demo.card.hass = {...demo.hass}; });
    for (const width of [375,900]) {
      await page.setViewportSize({width,height:1000});
      await page.screenshot({path:fileURLToPath(new URL(`../artifacts/room-only-${theme}-${width}.png`,import.meta.url)),fullPage:true});
    }
    await card.locator('[data-action="start"]').click();
    await page.waitForFunction(() => !demo.card.busy);
    assert.deepEqual(await card.locator('.requested li').allTextContents(), ['Kitchen','Hall']);
    assert.deepEqual(await page.evaluate(() => roomRequests.at(-1)), {selected:['area:kitchen','area:hall'],draft:{},start:true});
    assert.equal(await page.evaluate(() => demo.calls.length), 0, 'test adapter never calls a real integration');
  }
  assert.deepEqual(errors, []);
  console.log('Room planning browser checks passed: entityless rooms, capability gates, both themes, narrow layouts and start dispatch.');
} finally { await browser?.close(); server.close(); }
