import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = previewServer();
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL ? {channel:process.env.BROWSER_CHANNEL} : {})});
  const page=await browser.newPage({viewport:{width:900,height:1100}}), errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const card=page.locator('#card');
  await card.locator('.room').first().waitFor();
  await page.evaluate(async()=>{
    const {haRoomsFixture}=await import('/tests/ha-rooms-fixture.mjs');
    window.hr=haRoomsFixture();
    hr.registry.push(...demo.registry);
    Object.assign(hr.hass.states,demo.hass.states);
    hr.hass.entities=Object.fromEntries(hr.registry.map(row=>[row.entity_id,row]));
    hr.originalService=hr.hass.callService;
    hr.hass.callService=async(domain,service,data)=>{
      await hr.originalService(domain,service,data);
      hr.hass.states[hr.entity].state=service==='pause' ? 'paused' : service==='return_to_base' ? 'returning' : 'cleaning';
      demo.card.hass={...hr.hass};
    };
    demo.card.setConfig({...hr.config,integration:'auto',language:'en',show_battery_percentage:true});
    demo.card.hass={...hr.hass};
    await demo.card.loadRegistry();
  });
  assert.equal(await page.evaluate(()=>demo.card.adapter.id),'ha_rooms');
  assert.equal(await card.locator('.room').count(),2);
  assert.equal(await card.locator('[data-action="save"], [data-expand], [data-setting], .planning-tabs, .robot-illustration').count(),0);
  assert.equal(await card.locator('.consumables-info').isVisible(),false);
  assert.equal(await card.locator('.battery-value').innerText(),'81%');

  // Exercise the real editor against the same HA object, without the preview's
  // own fixture-bound settings button replacing our robot.
  await page.evaluate(()=>{
    window.areaEditor=document.createElement('dyson-cleaning-planner-card-editor');
    areaEditor.id='area-editor';
    areaEditor.setConfig(demo.card.config);areaEditor.hass=hr.hass;
    areaEditor.addEventListener('config-changed',event=>demo.card.setConfig(event.detail.config));
    document.querySelector('main').append(areaEditor);
  });
  const editor=page.locator('#area-editor');
  await editor.locator('[data-include]').first().waitFor();
  assert.equal(await editor.locator('[data-key="integration"] option[value="ha_rooms"]').count(),1);
  assert.equal(await editor.locator('[data-key="entity"] option[value="vacuum.alfred"]').count(),1);
  assert.equal(await editor.locator('[data-key="always_show_all_settings"], [data-key="camera_entity"], [data-key="show_camera"], [data-key="zone_dimension_unit"], [data-key="header_icon_style"]').count(),0);
  assert.equal(await editor.locator('[data-status-item]').count(),1);
  await editor.locator('[data-key="integration"]').selectOption('ha_rooms');
  assert.equal(await editor.locator('[data-key="entity"] option').count(),2,'generic filter excludes Dyson entities without CLEAN_AREA');
  await editor.locator('[data-include="area:hall"]').uncheck();
  assert.equal(await card.locator('.room').count(),1);
  await editor.locator('[data-include="area:hall"]').check();
  await editor.locator('[data-order="area:kitchen"][data-direction="-1"]').click();
  assert.deepEqual(await card.locator('[data-room]').evaluateAll(nodes=>nodes.map(node=>node.dataset.room)),['area:kitchen','area:hall']);
  await page.evaluate(()=>areaEditor.remove());

  await mkdir(new URL('../artifacts/ha-rooms/',import.meta.url),{recursive:true});
  for(const theme of ['modern','classic']) {
    await page.evaluate(theme=>{
      hr.hass.states[hr.entity].state='docked';
      demo.card.setConfig({...demo.card.config,theme});demo.card.hass={...hr.hass};
    },theme);
    await card.locator('[data-room="area:kitchen"]').check();
    await card.locator('[data-room="area:hall"]').check();
    if(theme==='modern')assert.deepEqual(await card.locator('.selection-circle').allTextContents(),['✓','✓']);
    assert.doesNotMatch(await card.locator('.rooms').innerText(),/\([12]\)|Room settings unavailable/);
    for(const width of [375,900]) {
      await page.setViewportSize({width,height:1100});
      await page.screenshot({path:fileURLToPath(new URL(`../artifacts/ha-rooms/${theme}-${width}.png`,import.meta.url)),fullPage:true});
    }
    await card.locator('[data-action="start"]').click();
    await page.waitForFunction(()=>!demo.card.busy);
    assert.deepEqual(await page.evaluate(()=>hr.calls.at(-1)),{domain:'vacuum',service:'clean_area',data:{entity_id:'vacuum.alfred',cleaning_area_id:['kitchen','hall']}});
    assert.deepEqual(await card.locator('.requested li').allTextContents(),['Kitchen','Hall']);
    assert.equal(await card.locator('dyson-planner-map').count(),0,'room-only adapter never mounts or fetches a map');
    await card.locator('[data-control="pause"]').click();
    await page.waitForFunction(()=>!demo.card.controlBusy);
    await card.locator('[data-control="start"]').click();
    await page.waitForFunction(()=>!demo.card.controlBusy);
    await card.locator('[data-control="return_to_base"]').click();
    await page.waitForFunction(()=>!demo.card.controlBusy);
    assert.deepEqual(await page.evaluate(()=>hr.calls.slice(-3).map(call=>call.service)),['pause','start','return_to_base']);
  }

  // A changed persisted mapping is checked again at Start, retaining selection
  // and surfacing a useful error rather than sending a different room job.
  await page.evaluate(()=>{
    hr.hass.states[hr.entity].state='docked';demo.card.setConfig({...demo.card.config});demo.card.hass={...hr.hass};
  });
  await card.locator('[data-room="area:kitchen"]').check();
  const before=await page.evaluate(()=>hr.calls.length);
  await page.evaluate(()=>{hr.registry[0].options.vacuum.area_mapping.kitchen=['99'];});
  await card.locator('[data-action="start"]').click();
  await page.waitForFunction(()=>!demo.card.busy);
  assert.equal(await page.evaluate(()=>hr.calls.length),before);
  assert.equal(await card.locator('[data-room="area:kitchen"]').isChecked(),true);
  assert.match(await card.locator('.header-notice-copy').innerText(),/room selection changed/i);
  await page.evaluate(async()=>{
    hr.registry[0].options.vacuum.area_mapping={};
    await demo.card.loadRegistry();
  });
  assert.equal(await card.locator('.room').count(),0);
  assert.match(await card.locator('.header-notice-copy').innerText(),/room selection changed|Map the robot/);
  assert.deepEqual(errors,[]);
  console.log('HA rooms browser checks passed: real adapter/editor, exact area start and session calls, stale mapping rejection, both themes and mobile.');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
