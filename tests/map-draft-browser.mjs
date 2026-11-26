// Every command goes to the local HA fixture; no robot is contacted.
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {previewServer} from '../scripts/preview.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=previewServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true});
const a='1784483068',b='1795646759';
try {
  for(const style of ['menu','chips'])for(const theme of ['modern','classic'])for(const width of [375,900]) {
    const page=await browser.newPage({viewport:{width,height:1100}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    const card=page.locator('#card');await card.locator('.room').first().waitFor();
    await page.evaluate(()=>{
      window.mapDraftLoading=import('/tests/map-selection-fixture.mjs').then(module=>{window.mapDraftFactory=module.mapSelectionFixture;});
    });
    await page.waitForFunction(()=>typeof window.mapDraftFactory==='function');
    await page.evaluate(({style,theme})=>{
      const f=mapDraftFactory();window.mapDraftDemo=f;f.card=demo.card;f.transport='wait';
      f.hass.hassUrl=path=>location.origin+path;
      f.hass.callService=async(domain,service,data)=>{
        f.calls.push({domain,service,data});
        if(f.transport==='reject')throw new Error('Map switch rejected');
      };
      f.report=id=>{f.applyMap(id);f.card.hass={...f.hass};};
      f.snapshot=()=>JSON.stringify({selected:f.card.selected,settings:f.card.settingDraft,planning:f.card.planningDraft,
        context:f.card.draftContext,baseline:f.card.baseline,dirty:f.card.dirty,expanded:[...f.card.expanded]});
      f.card.setConfig({...f.config,theme,language:'en',show_camera:false,map_selector_style:style});f.card.hass=f.hass;
    },{style,theme});
    await card.locator('input[data-room]').first().waitFor();await page.clock.install();
    const editRoom=async()=>{
      await card.locator('input[data-room]').first().check();
      const expand=card.locator('[data-expand]').first();
      if(await expand.getAttribute('aria-expanded')!=='true')await expand.click();
      await card.locator('[data-setting="cleaning_mode"]').first().selectOption('Mop');
      assert.equal(await page.evaluate(()=>mapDraftDemo.card.dirty),true);
    };
    const choose=async id=>{
      if(style==='menu')await card.locator('.map-toggle').click();
      assert.equal(await card.locator(`[data-map-id="${id}"]`).isEnabled(),true,'a local draft does not block map selection');
      await card.locator(`[data-map-id="${id}"]`).click();
    };
    const idle=()=>page.waitForFunction(()=>!mapDraftDemo.card._mapRequest);
    const snapshot=()=>page.evaluate(()=>mapDraftDemo.snapshot());
    await editRoom();const before=await snapshot();
    await choose(b);
    assert.equal(await snapshot(),before,'sending the selection does not discard a draft');
    assert.equal(await card.locator('.rooms').getAttribute('inert'),'');
    await page.evaluate(async()=>{await mapDraftDemo.card.save();await mapDraftDemo.card.start();});
    assert.equal(await page.evaluate(()=>mapDraftDemo.calls.length),1);
    await page.evaluate(b=>{
      const f=mapDraftDemo;f.hass.states[f.mapSelect].state='Dachboden';f.hass.states[f.mapSelect].attributes.map_id=b;f.card.hass={...f.hass};
    },b);
    assert.equal(await snapshot(),before,'select-only readback retains the old draft');
    await page.evaluate(b=>mapDraftDemo.report(b),b);await idle();
    assert.equal(await page.evaluate(()=>mapDraftDemo.card.dirty),false);
    assert.deepEqual(await page.evaluate(()=>mapDraftDemo.card.settingDraft),{});
    assert.deepEqual(await page.evaluate(()=>mapDraftDemo.card.selected),[]);
    assert.equal(await card.locator('[data-setting="cleaning_mode"]').first().inputValue(),'Vacuum',
      'B reuses room ID 10 without inheriting A\'s Mop draft');
    assert.equal(await page.evaluate(()=>mapDraftDemo.hass.states[mapDraftDemo.fields['10'].cleaning_mode].state),'unavailable');
    assert.equal(await page.evaluate(()=>mapDraftDemo.hass.states[mapDraftDemo.bFields[0]].state),'Vacuum');

    await page.evaluate(a=>{mapDraftDemo.report(a);mapDraftDemo.transport='reject';},a);
    await editRoom();const rejected=await snapshot();
    await choose(b);await idle();
    assert.equal(await snapshot(),rejected,'rejection retains the entire original-map draft');
    assert.match(await card.locator('.header-notice-copy').textContent(),/Map switch rejected/);
    await card.locator('[data-action="dismiss-notice"]').click();
    await page.evaluate(()=>{mapDraftDemo.transport='wait';});
    await choose(b);await page.clock.runFor(10001);await idle();
    assert.equal(await snapshot(),rejected,'timeout is not evidence that a map changed');
    await page.evaluate(b=>{
      mapDraftDemo.card.message='Newer feedback';mapDraftDemo.card.error=true;mapDraftDemo.report(b);
    },b);
    assert.deepEqual(await page.evaluate(()=>mapDraftDemo.card.settingDraft),{});
    assert.equal(await page.evaluate(()=>mapDraftDemo.card.dirty),false);
    assert.equal(await card.locator('.header-notice-copy').textContent(),'Newer feedback');

    // After a timeout the vacuum may report B before the select does. A new
    // draft deliberately created on B must survive the remaining late readback.
    await card.locator('[data-action="dismiss-notice"]').click();
    await page.evaluate(a=>mapDraftDemo.report(a),a);await editRoom();
    await choose(b);await page.clock.runFor(10001);await idle();
    await page.evaluate(({a,b})=>{
      const f=mapDraftDemo;f.applyMap(b);f.hass.states[f.mapSelect].state='Wohnung';f.hass.states[f.mapSelect].attributes.map_id=a;f.card.hass={...f.hass};
    },{a,b});
    await card.locator('[data-action="reset"]').click();await editRoom();
    const newer=await snapshot();await page.evaluate(b=>mapDraftDemo.report(b),b);
    assert.equal(await snapshot(),newer,'a target-map draft survives late confirmation');
    assert.equal(await page.evaluate(()=>mapDraftDemo.card._unconfirmedMapSwitch),null);
    assert.deepEqual(await page.evaluate(()=>mapDraftDemo.calls.map(call=>[call.domain,call.service])),
      Array.from({length:4},()=>['select','select_option']),'no automatic save, cleaning start or retry');
    assert.deepEqual(errors,[]);await page.close();
  }
  console.log('Automatic map draft discard passed: menu/chips, both themes, 375/900 px, real local edits, partial/confirmed readback, rejection, timeout, late confirmation, newer target drafts and feedback, with selection-only commands.');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
