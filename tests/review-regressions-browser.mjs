import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = previewServer();
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const card=page.locator('#card');await card.locator('.room').first().waitFor();
  await page.evaluate(async()=>{
    const {hassDysonFixture}=await import('/tests/hass-dyson-fixture.mjs');window.audit=hassDysonFixture();
    demo.card.setConfig({...audit.config,show_camera:false,language:'en'});demo.card.hass=audit.hass;
  });
  await page.waitForFunction(()=>demo.card.model?.rooms.length===2 && demo.card.initialized);
  await page.evaluate(()=>{
    audit.hass.states[audit.entity]={state:'returning',attributes:{raw_state:'FULL_CLEAN_FINISHED'}};
    demo.card.pendingStart=true;demo.card.hass={...audit.hass};
    audit.hass.states[audit.dock].state='WASHING_MOP';demo.card.hass={...audit.hass};
  });
  assert.equal(await page.evaluate(()=>demo.card.pendingStart),true,'washing must not confirm a new job');
  assert.equal(await page.evaluate(()=>demo.card.view.live),false);
  await page.evaluate(()=>{demo.card.clearPendingStart();demo.card.update();});
  assert.equal(await card.locator('.room').count(),2,'finished job stays in the planner during washing');
  await page.evaluate(()=>{
    audit.hass.states[audit.entity]={state:'docked',attributes:{raw_state:'INACTIVE_CHARGING',ready_to_start:false}};
    audit.hass.states[audit.dock].state='DRYING_MOP';demo.card.hass={...audit.hass};
  });
  assert.equal(await card.locator('.activity-start-block').isVisible(),true);
  assert.match(await card.locator('.activity-start-block').innerText(),/not ready/);

  // Metadata keeps the configured robot selectable until the real registry resolves.
  await page.evaluate(()=>{
    const editor=document.createElement('dyson-cleaning-planner-card-editor');editor.id='loading-editor';
    editor.setConfig({...audit.config,integration:'auto'});
    editor.hass={...audit.hass,callWS:({type})=>type==='config/device_registry/list'?Promise.resolve([]):new Promise(resolve=>{window.resolveAuditRegistry=resolve;})};
    document.body.append(editor);
  });
  const editor=page.locator('#loading-editor');
  await editor.locator('[data-key="integration"]').selectOption('hass_dyson');
  assert.equal(await editor.locator('[data-key="entity"]').inputValue(),await page.evaluate(()=>audit.entity));
  await page.evaluate(()=>resolveAuditRegistry([]));
  await page.waitForFunction(()=>document.querySelector('#loading-editor')._registryLoaded);
  assert.equal(await editor.locator('[data-key="entity"] option').count(),1,'loaded empty registry overrides metadata');
  await page.evaluate(()=>document.querySelector('#loading-editor').remove());

  // A transient detach must cancel only the Start step, keeping saved preferences.
  await page.evaluate(()=>{
    audit.hass.states[audit.entity]={state:'docked',attributes:{raw_state:'INACTIVE_CHARGING',supported_features:8212}};
    audit.hass.states[audit.dock].state='IDLE';
    const original=audit.hass.callService;
    audit.hass.callService=async(...args)=>{await original(...args);if(args[1]==='set_room_cleaning_modes')await new Promise(resolve=>{window.resolveAuditSave=resolve;});};
    demo.card.hass={...audit.hass};
    demo.card.selected=[audit.fields['12'].cleaning_mode];demo.card.settingDraft={'12':{cleaning_mode:'Mop'}};demo.card.updateDirty();
    window.auditStart=demo.card.start();
  });
  await page.waitForFunction(()=>typeof resolveAuditSave==='function');
  await page.evaluate(async()=>{const c=demo.card,parent=c.parentElement;c.remove();parent.append(c);resolveAuditSave();await auditStart;});
  assert.deepEqual(await page.evaluate(()=>audit.calls.map(c=>c.service)),['set_room_cleaning_modes']);
  assert.equal(await page.evaluate(()=>audit.hass.states[audit.fields['12'].cleaning_mode].state),'mop_only');
  assert.match(await card.locator('.header-notice').innerText(),/Settings were saved/);

  // Both mismatched adapter directions must fail closed at UI and dispatch.
  await page.evaluate(()=>{
    audit.registry.push(...demo.registry);
    Object.assign(audit.hass.states,demo.hass.states);
    audit.hass.states[demo.entity].state='cleaning';audit.hass.states[audit.entity].state='cleaning';
    audit.hass.entities=Object.fromEntries(audit.registry.map(e=>[e.entity_id,e]));
    demo.card.hass={...audit.hass};
  });
  await page.waitForFunction(()=>demo.card.registry.some(e=>e.entity_id===demo.entity));
  for(const integration of ['hass_dyson','dyson_spot_scrub']) {
    await page.evaluate(integration=>{
      demo.card.setConfig({...demo.card.config,integration,entity:integration==='hass_dyson'?demo.entity:audit.entity});
    },integration);
    assert.equal(await card.locator('.session-toggle').isDisabled(),true);
    assert.equal(await card.locator('.home').isDisabled(),true);
    await page.evaluate(async()=>{await demo.card.control('pause');await demo.card.control('return_to_base');});
  }
  assert.equal(await page.evaluate(()=>audit.calls.length),1,'mismatched session actions never reach HA');
  await page.evaluate(()=>demo.card.setConfig({...demo.card.config,integration:'hass_dyson',entity:audit.entity}));
  assert.equal(await card.locator('.session-toggle').isEnabled(),true);
  await card.locator('.session-toggle').click();await page.waitForFunction(()=>!demo.card.controlBusy);
  assert.equal(await page.evaluate(()=>audit.calls.at(-1).service),'pause');
  assert.deepEqual(errors,[]);
  console.log('Review regression browser checks passed: finished sessions, veto visibility, registry loading, transient detach and integration isolation.');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
