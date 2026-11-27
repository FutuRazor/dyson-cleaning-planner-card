// Only local HA fixtures are used; no real robot is contacted.
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {previewServer} from '../scripts/preview.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=previewServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true});
const a='1784483068',b='1795665600';
try {
  await mkdir('artifacts/hass-maps',{recursive:true});
  for(const theme of ['modern','classic'])for(const width of [375,900])for(const style of ['menu','chips']) {
    const page=await browser.newPage({viewport:{width,height:1100}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    const card=page.locator('#card');await card.locator('.room').first().waitFor();
    await page.evaluate(()=>{
      window.hassMapsLoading=import('/tests/hass-maps-fixture.mjs').then(module=>{window.hassMapsFactory=module.hassMapsFixture;});
    });
    await page.waitForFunction(()=>!!window.hassMapsFactory);
    await page.evaluate(async({theme,style,a,b})=>{
      const f=window.hassMaps=hassMapsFactory();f.card=demo.card;
      f.transport='normal';
      f.hass.callService=async(domain,service,data)=>{
        f.calls.push({domain,service,data});
        if(service==='set_room_cleaning_modes'&&f.transport==='defer')await new Promise(resolve=>{f.finishSave=resolve;});
        if(f.transport==='reject')throw new Error('Settings rejected');
      };
      f.card.setConfig({...f.config,theme,map_selector_style:style,show_camera:false,language:'en',map_rotations:{[a]:90,[b]:0}});
      document.body.classList.toggle('dark',style==='chips');
      f.card.hass=f.hass;await f.card.loadRegistry();
    },{theme,style,a,b});
    const chips=card.locator('[data-reported-map]');await chips.first().waitFor();
    assert.deepEqual((await card.locator('.name').allTextContents()).map(name=>name.trim()),['Wohnzimmer','Schlafzimmer']);
    assert.equal(await chips.count(),2);assert.equal(await card.locator('.map-toggle,button.map-chip,[data-map-id]').count(),0);
    assert.equal(await card.locator(`[data-reported-map="${a}"]`).getAttribute('aria-current'),'true');
    assert.equal(await card.locator('[data-action="save"]').isDisabled(),true);
    const openRoom=async id=>{
      const key=await page.evaluate(id=>hassMaps.card.model.rooms.find(room=>room.roomId===id).key,id);
      const expand=card.locator(`[data-expand="${key}"]`);
      if(await expand.getAttribute('aria-expanded')!=='true')await expand.click();
    };
    const setSetting=async(id,key,value)=>{
      const selector=`[data-setting="${key}"][data-room-id="${id}"]`,select=card.locator('select'+selector);
      if(await select.count())await select.selectOption(value);
      else await card.locator(`button${selector}[data-option="${value}"]`).click();
    };
    assert.equal(await page.evaluate(()=>hassMaps.card.mapRotation),90);
    await chips.nth(1).click();assert.equal(await page.evaluate(()=>hassMaps.calls.length),0);
    for(const item of await card.locator('input[data-room]').all())await item.check();
    await card.locator('[data-action="start"]').click();await page.waitForFunction(()=>!hassMaps.card.busy);
    assert.deepEqual(await page.evaluate(()=>hassMaps.calls),[{domain:'hass_dyson',service:'start_zone_clean',data:{device_id:'hd-device',zones:['12','10'],map:a}}]);
    await page.evaluate(()=>{const f=hassMaps;f.card.clearPendingStart();f.card.resetDraft();f.card.update();});
    await card.locator('input[data-room]').nth(1).check();
    await page.clock.install();await page.clock.runFor(10000);
    assert.equal(await card.locator(`[data-reported-map="${a}"]`).getAttribute('aria-current'),'true','the own sensor remains authoritative during its reporting delay');
    assert.equal(await card.locator('[data-action="start"]').isEnabled(),true,'no source-age or cross-adapter gate is added');
    await page.evaluate(b=>{const f=hassMaps;f.report(b);f.card.hass={...f.hass};},b);
    assert.deepEqual((await card.locator('.name').allTextContents()).map(name=>name.trim()),['Essbereich']);
    assert.equal(await card.locator(`[data-reported-map="${b}"]`).getAttribute('aria-current'),'true');
    assert.equal(await page.evaluate(()=>hassMaps.card.mapRotation),0);
    assert.deepEqual(await page.evaluate(()=>hassMaps.card.selected),[]);
    assert.deepEqual(await page.evaluate(()=>hassMaps.card.settingDraft),{});
    assert.equal(await card.locator('[data-action="start"]').isDisabled(),true);
    await card.locator('input[data-room]').check();
    await card.screenshot({path:`artifacts/hass-maps/${theme}-${width}-${style}.png`});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await card.locator('[data-action="start"]').click();await page.waitForFunction(()=>!hassMaps.card.busy);
    assert.deepEqual(await page.evaluate(()=>hassMaps.calls[1]),{domain:'hass_dyson',service:'start_zone_clean',data:{device_id:'hd-device',zones:['10'],map:b}});
    await page.evaluate(a=>{const f=hassMaps;f.card.clearPendingStart();f.report(a);f.card.hass={...f.hass};},a);
    assert.deepEqual((await card.locator('.name').allTextContents()).map(name=>name.trim()),['Wohnzimmer','Schlafzimmer']);
    assert.deepEqual(await page.evaluate(()=>hassMaps.card.selected),[]);
    await openRoom('12');
    assert.equal(await card.locator('select[data-setting="cleaning_mode"][data-room-id="12"]').inputValue(),'','unqualified HA values are not a map baseline');
    if(width===375&&style==='menu') {
      await card.screenshot({path:`artifacts/hass-maps/keep-settings-${theme}.png`});
      if(theme==='modern') {
        const range=card.locator('input[type="range"][data-setting="cleaning_strategy"][data-room-id="12"]');
        assert.equal(await range.isEnabled(),true);
        await range.click({position:{x:1,y:12}});
        assert.deepEqual(await page.evaluate(()=>hassMaps.card.settingDraft),{'12':{cleaning_strategy:'Auto'}},'choosing the first value works even before the range value changes');
        await card.locator('[data-action="reset"]').click();await openRoom('12');
      }
    }
    await setSetting('12','cleaning_mode','Vacuum');
    assert.deepEqual(await page.evaluate(()=>hassMaps.card.settingDraft),{'12':{cleaning_mode:'Vacuum'}},'an explicit choice matching old HA state remains in the draft');
    await page.evaluate(()=>{hassMaps.card.hass={...hassMaps.hass};});
    assert.deepEqual(await page.evaluate(()=>hassMaps.card.settingDraft),{'12':{cleaning_mode:'Vacuum'}});
    await setSetting('12','cleaning_mode','');
    assert.deepEqual(await page.evaluate(()=>hassMaps.card.settingDraft),{});
    await setSetting('12','cleaning_mode','Mop');
    await card.locator('[data-action="save"]').click();await page.waitForFunction(()=>!hassMaps.card.busy);
    assert.deepEqual(await page.evaluate(()=>hassMaps.calls[2]),{domain:'hass_dyson',service:'set_room_cleaning_modes',data:{device_id:'hd-device',room_modes:{'12':{cleaning_mode:'mop_only'}}}});
    assert.deepEqual(await page.evaluate(()=>hassMaps.card.settingDraft),{});
    assert.equal(await page.evaluate(()=>hassMaps.hass.states[hassMaps.fields['12'].cleaning_mode].state),'vacuum_only','Save does not invent an HA update');
    assert.equal(await card.locator('select[data-setting="cleaning_mode"][data-room-id="12"]').inputValue(),'Mop','backend confirmation is displayed while HA lags');
    await setSetting('12','cleaning_mode','Vacuum then Mop');
    await setSetting('12','cleaning_strategy','Boost');
    await setSetting('12','water_level','High');
    await setSetting('12','mop_repetitions','Two Passes');
    await card.locator('input[data-room]').first().check();
    await card.screenshot({path:`artifacts/hass-maps/settings-${theme}-${width}-${style}.png`});
    await card.locator('[data-action="start"]').click();await page.waitForFunction(()=>!hassMaps.card.busy);
    assert.deepEqual(await page.evaluate(()=>hassMaps.calls.slice(-2)),[
      {domain:'hass_dyson',service:'set_room_cleaning_modes',data:{device_id:'hd-device',room_modes:{'12':{cleaning_mode:'vacuum_then_mop',vacuum_power:'boost',hydration:'high',wash_repetitions:2}}}},
      {domain:'hass_dyson',service:'start_zone_clean',data:{device_id:'hd-device',zones:['12'],map:a}}
    ]);
    await page.evaluate(()=>{const f=hassMaps;f.card.clearPendingStart();f.card.resetDraft();f.card.update();});
    if(width===375&&style==='menu') {
      await openRoom('10');await setSetting('10','cleaning_mode','Mop');
      await page.evaluate(()=>{hassMaps.transport='defer';});
      await card.locator('[data-action="save"]').click();await page.waitForFunction(()=>!!hassMaps.finishSave);
      await page.evaluate(b=>{const f=hassMaps;f.report(b);f.card.hass={...f.hass};f.card.message='Newer feedback';f.card.render();},b);
      assert.deepEqual(await page.evaluate(()=>hassMaps.card.settingDraft),{});
      await page.evaluate(()=>{hassMaps.transport='normal';hassMaps.finishSave();});await page.waitForFunction(()=>!hassMaps.card.busy);
      assert.equal(await page.evaluate(()=>hassMaps.card.message),'Newer feedback');
      await openRoom('10');
      assert.equal(await card.locator('select[data-setting="cleaning_mode"]').inputValue(),'','a late Save never seeds the new map');
      await page.evaluate(a=>{const f=hassMaps;f.report(a);f.card.hass={...f.hass};f.card.message='';f.card.render();},a);
      await openRoom('12');await setSetting('12','cleaning_mode','Mop');await card.locator('input[data-room]').first().check();
      const beforeReject=await page.evaluate(()=>hassMaps.calls.length);
      await page.evaluate(()=>{hassMaps.transport='reject';});
      await card.locator('[data-action="start"]').click();await page.waitForFunction(()=>!hassMaps.card.busy);
      assert.equal(await page.evaluate(()=>hassMaps.calls.length),beforeReject+1,'rejected Save sends no Start or retry');
      assert.deepEqual(await page.evaluate(()=>hassMaps.card.settingDraft),{'12':{cleaning_mode:'Mop'}});
      await page.evaluate(()=>{hassMaps.transport='normal';hassMaps.card.resetDraft();hassMaps.card.update();});
    }
    await page.evaluate(()=>{const f=hassMaps;f.report('0');f.card.hass={...f.hass};});
    assert.equal(await card.locator('.room').count(),0);assert.equal(await card.locator('[data-action="start"]').isDisabled(),true);
    const callsBeforeDisplay=await page.evaluate(()=>hassMaps.calls.length);
    await page.evaluate(a=>{const f=hassMaps;f.report(a);f.card.hass={...f.hass};
      f.editor=document.createElement('dyson-cleaning-planner-card-editor');f.editor.style.display='block';
      f.editor.setConfig(f.card.config);f.editor.hass=f.hass;
      f.editor.addEventListener('config-changed',event=>f.card.setConfig(event.detail.config));document.body.append(f.editor);
    },a);
    const editor=page.locator('dyson-cleaning-planner-card-editor');await editor.locator('.map-options').waitFor();
    assert.equal(await editor.locator('[data-key="map_selector_style"]').count(),0);
    assert.equal(await editor.locator('[data-include-map]').count(),2);
    assert.equal(await editor.locator('[data-map-rotation]').count(),2);
    await editor.locator(`[data-order-map="${b}"][data-direction="-1"]`).click();
    assert.deepEqual(await chips.evaluateAll(items=>items.map(item=>item.dataset.reportedMap)),[b,a]);
    await editor.locator(`[data-include-map="${b}"]`).uncheck();assert.equal(await chips.count(),0);
    await page.evaluate(b=>{const f=hassMaps;f.report(b);f.card.hass={...f.hass};},b);
    assert.equal(await chips.count(),2,'a hidden reported map remains identified');
    assert.match(await card.locator(`[data-reported-map="${b}"]`).textContent(),/Hidden in this card/);
    await editor.locator(`[data-include-map="${b}"]`).check();
    await editor.locator(`[data-map-rotation="${b}"]`).selectOption('270');
    assert.equal(await page.evaluate(()=>hassMaps.card.mapRotation),270);
    await editor.locator('[data-action="refresh-maps"]').click();
    await page.waitForFunction(()=>!hassMaps.editor._loadingRegistry);
    if(theme==='modern'&&width===375&&style==='menu') {
      for(const [language,label] of [['de','Gemeldete Karte'],['nl','Gemelde kaart'],['fr','Carte signalée'],['en','Reported map']]) {
        await page.evaluate(language=>{const f=hassMaps;f.card.setConfig({...f.card.config,language});},language);
        assert.equal(await card.locator('.map-chips').getAttribute('aria-label'),label);
      }
    }
    assert.equal(await page.evaluate(()=>hassMaps.calls.length),callsBeforeDisplay,'display controls and registry refresh send no robot commands');
    assert.deepEqual(errors,[]);await page.close();
  }
  console.log('hass-dyson multi-map browser checks passed: passive maps, scoped rooms, explicit overrides, confirmed Save with delayed HA values, Save-then-Start, late Save/map changes, rejection, draft reset, visibility/order/rotation and both themes at 375/900px.');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
