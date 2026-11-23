import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = previewServer();
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser = await chromium.launch({ headless:true, ...(process.env.BROWSER_CHANNEL ? { channel:process.env.BROWSER_CHANNEL } : {}) });
  const page = await browser.newPage({viewport:{width:1000,height:1100}});
  const errors = [];page.on('pageerror',e=>errors.push(e.message));
  let images = 0;
  await page.route('**/api/image_proxy/**',route=>{
    images++;
    return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="400"><rect width="495" height="400" fill="cyan"/><rect x="505" width="495" height="400" fill="purple"/></svg>'});
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const card=page.locator('#card');await card.locator('.room').first().waitFor();
  await page.evaluate(async()=>{
    const {hassDysonFixture}=await import('/tests/hass-dyson-fixture.mjs');
    window.hd=hassDysonFixture();
    hd.registry.push(...demo.registry);
    Object.assign(hd.hass.states,demo.hass.states);
    Object.assign(hd.hass.services,demo.hass.services);
    // Keep the two services from the HD fixture as well as the legacy actions.
    hd.hass.entities=Object.fromEntries(hd.registry.map(e=>[e.entity_id,e]));
    demo.card.setConfig({...hd.config,language:'en',show_battery_percentage:true});demo.card.hass={...hd.hass};
    await demo.card.loadRegistry();
  });
  assert.equal(await card.locator('.room').count(),2);
  assert.equal(await card.locator('[data-action="zones"]').count(),0);
  assert.equal(await card.locator('.battery-value').textContent(),'87%');
  assert.match(await card.locator('.integration-hint').innerText(), /Room order is controlled by hass-dyson/);
  await card.locator('input[data-room]').first().check();
  await page.evaluate(()=>{hd.hass.states[hd.dock].state='WASHING_MOP';demo.card.hass={...hd.hass};});
  assert.equal(await card.locator('[data-action="start"]').isDisabled(),true);
  assert.match(await card.locator('.activity-text').innerText(),/Cleaning mop roller/);
  assert.equal(await page.evaluate(()=>hd.calls.length),0);
  await page.evaluate(()=>{hd.hass.states[hd.dock].state='IDLE';demo.card.hass={...hd.hass};});
  assert.equal(await card.locator('[data-action="start"]').isEnabled(),true);
  await card.locator('input[data-room]').first().uncheck();
  await card.locator('.consumables-info').click();
  assert.equal(await card.locator('[data-info-tab="station"]').isVisible(),false);
  assert.equal(await card.locator('[data-info-tab="robot"]').isVisible(),false);
  assert.match(await card.locator('#panel-consumables').innerText(),/94% remaining/);
  await card.locator('.consumables-close').click();
  await card.locator('[data-expand]').first().click();
  await card.locator('[data-setting="cleaning_mode"]').first().selectOption('Mop');
  assert.equal(await page.evaluate(()=>hd.calls.length),0);
  await card.locator('[data-action="save"]').click();
  await page.waitForFunction(()=>!demo.card.busy);
  assert.deepEqual(await page.evaluate(()=>hd.calls[0].data),{device_id:'hd-device',room_modes:{'12':{cleaning_mode:'mop_only'}}});
  assert.equal(await page.evaluate(()=>Object.keys(demo.card.settingDraft).length),0);
  await card.locator('input[data-room]').first().check();
  await card.locator('[data-setting="cleaning_mode"]').first().selectOption('Vacuum and Mop');
  await page.evaluate(()=>{hd.hass.states[hd.dock].state='DRYING_MOP';demo.card.hass={...hd.hass};});
  assert.equal(await card.locator('[data-action="start"]').isEnabled(),true);
  assert.match(await card.locator('.activity-text').innerText(),/Drying mop roller/);
  await card.locator('[data-action="start"]').click();
  await page.waitForFunction(()=>!demo.card.busy);
  assert.deepEqual(await page.evaluate(()=>hd.calls.slice(-2).map(c=>c.service)),['set_room_cleaning_modes','start_zone_clean']);
  assert.deepEqual(await page.evaluate(()=>hd.calls.at(-1).data),{device_id:'hd-device',zones:['12'],map:'123'});
  await page.evaluate(()=>{
    hd.hass.states[hd.dock].state='IDLE';hd.hass.states[hd.entity].state='cleaning';hd.hass.states[hd.entity].attributes.raw_state='FULL_CLEAN_RUNNING';demo.card.hass={...hd.hass};
  });
  const map=card.locator('dyson-planner-map');
  await page.waitForFunction(()=>{
    const map=demo.card.shadowRoot.querySelector('dyson-planner-map');return map?.img.naturalWidth===1000;
  });
  assert.equal(await map.evaluate(el=>el.img.naturalHeight),400,'both image panels retain full dimensions');
  assert.ok(images>0);
  await card.locator('[data-control="pause"]').click();
  await page.waitForFunction(()=>!demo.card.controlBusy);
  assert.equal(await page.evaluate(()=>hd.calls.at(-1).service),'pause');
  await page.evaluate(()=>{hd.hass.states[hd.entity].state='paused';demo.card.hass={...hd.hass};});
  await card.locator('[data-control="start"]').click();
  await page.waitForFunction(()=>!demo.card.controlBusy);
  assert.equal(await page.evaluate(()=>hd.calls.at(-1).service),'start');
  await page.evaluate(()=>{
    hd.hass.states[hd.entity].state='docked';hd.hass.states[hd.entity].attributes.raw_state='INACTIVE_CHARGING';demo.card.clearPendingStart();demo.card.hass={...hd.hass};
    const editor=document.createElement('dyson-cleaning-planner-card-editor');
    editor.id='hd-editor';editor.setConfig(demo.card.config);editor.hass=hd.hass;
    editor.addEventListener('config-changed',event=>demo.card.setConfig(event.detail.config));document.body.append(editor);
  });
  const editor=page.locator('#hd-editor');
  await editor.locator('[data-key="integration"]').waitFor();
  await editor.locator('[data-key="integration"]').selectOption('auto');
  assert.equal(await editor.locator('[data-key="entity"]').inputValue(),await page.evaluate(()=>hd.entity),'auto preserves explicit robot');
  assert.equal(await editor.locator('[data-key="entity"] option').count(),3);
  await editor.locator('[data-key="integration"]').selectOption('dyson_spot_scrub');
  assert.equal(await page.evaluate(()=>demo.card.adapter.id),'dyson_spot_scrub');
  assert.equal(await card.locator('.room').count(),5);
  await editor.locator('[data-key="integration"]').selectOption('hass_dyson');
  assert.equal(await page.evaluate(()=>demo.card.adapter.id),'hass_dyson');
  assert.equal(await card.locator('.room').count(),2);
  assert.equal(await editor.locator('[data-key="camera_entity"] option').count(),2);
  await editor.locator('[data-key="theme"]').selectOption('classic');
  assert.equal(await card.locator('.room').count(),2);
  await card.locator('[data-expand]').first().click();
  assert.equal(await card.locator('select[data-setting="water_level"]').first().inputValue(),'Very Low');
  const callsBeforeDock = await page.evaluate(()=>hd.calls.length);
  for (const theme of ['modern','classic']) {
    await page.evaluate(theme=>{
      window.originalDockNow=Date.now;window.dockNow=Date.now();Date.now=()=>window.dockNow;
      hd.hass.states[hd.dockTimer].state=new Date(dockNow+120000).toISOString();
      hd.hass.states[hd.entity].state='error';hd.hass.states[hd.dock].state='WASHING_MOP';
      demo.card.setConfig({...demo.card.config,theme});demo.card.hass={...hd.hass};
    },theme);
    assert.match(await card.locator('.activity-text').innerText(),/Cleaning mop roller/);
    assert.match(await card.locator('.activity-remaining').innerText(),/00:02/);
    await page.evaluate(()=>{hd.hass.states[hd.dockTimer].state='unknown';demo.card.hass={...hd.hass};});
    assert.match(await card.locator('.activity-text').innerText(),/Cleaning mop roller/);
    assert.equal(await card.locator('.activity-remaining').isVisible(),false);
    assert.doesNotMatch(await card.locator('.activity-copy').getAttribute('title'),/Unavailable|unavailable/);
    await page.evaluate(()=>{hd.hass.states[hd.dockTimer].state=new Date(dockNow+120000).toISOString();demo.card.hass={...hd.hass};});
    assert.match(await card.locator('.activity-remaining').innerText(),/00:02/);
    await page.evaluate(()=>{hd.hass.states[hd.dock].state='DRYING_MOP';demo.card.hass={...hd.hass};});
    assert.match(await card.locator('.activity-text').innerText(),/Drying mop roller/);
    assert.equal(await card.locator('.cancel-drying').isVisible(),false);
    assert.equal(await card.locator('.drying-progress').isVisible(),false);
    // Only advance browser time: no HA update should be needed for the countdown.
    await page.evaluate(()=>{window.dockNow+=61000;});
    await page.waitForFunction(()=>demo.card.shadowRoot.querySelector('.activity-remaining').textContent.includes('00:01'));
    await page.evaluate(()=>{
      Date.now=window.originalDockNow;hd.hass.states[hd.dock].state='IDLE';hd.hass.states[hd.entity].state='docked';demo.card.hass={...hd.hass};
    });
    assert.equal(await card.locator('.activity-remaining').isVisible(),false);
  }
  assert.equal(await page.evaluate(()=>hd.calls.length),callsBeforeDock);
  assert.deepEqual(errors,[]);
  console.log('hass-dyson browser checks passed: editor selection, both themes, save/start, combined image, consumables and session controls.');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
