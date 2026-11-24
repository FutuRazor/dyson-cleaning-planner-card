import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {previewServer} from '../scripts/preview.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=previewServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
async function setup(backend,theme='modern',width=900) {
  const page=await browser.newPage({viewport:{width,height:1000}}),errors=[];
  page.setDefaultTimeout(15000);
  page.on('pageerror',e=>errors.push(e.message));await page.clock.install();
  await page.addInitScript(()=>customElements.define('ha-card',class extends HTMLElement {
    constructor(){super();this.attachShadow({mode:'open'});}
    connectedCallback(){queueMicrotask(()=>{if(this.isConnected)this.shadowRoot.innerHTML='<slot></slot>';});}
  }));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.locator('#card .room').first().waitFor();
  await page.evaluate(async({backend,theme})=>{
    const module=await import(backend==='spot'?'/tests/spot-schedules-fixture.mjs':'/tests/schedules-fixture.mjs');
    window.audit=backend==='spot'?module.spotSchedulesFixture():module.schedulesFixture();
    demo.card.setConfig({...audit.config,theme,language:'en',show_camera:false});demo.card.hass={...audit.hass};await demo.card.loadRegistry();
  },{backend,theme});
  return {page,errors,card:page.locator('#card')};
}
try {
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  for(const theme of ['modern','classic']) {
    console.log(`Checking ${theme} editor scrolling`);
    const {page,errors,card}=await setup('spot',theme,375);
    await card.locator('#planning-tab-schedules').click();
    await card.locator('[data-schedule-menu="101"]').click();await card.locator('[data-schedule-edit="101"]').click();
    await card.locator('[data-schedule-room-action="expand"][data-schedule-room="10"]').click();
    const selectScroll=await card.locator('.schedule-overlay').evaluate(overlay=>{
      const input=overlay.querySelector('[data-schedule-room-toggle="12"]');
      input.focus({preventScroll:true});overlay.scrollTop=180;const before=overlay.scrollTop;input.click();return before;
    });
    assert.ok(selectScroll>0);await page.clock.runFor(50);
    assert.equal(await card.locator('.schedule-overlay').evaluate(el=>el.scrollTop),selectScroll,'selection preserves editor scroll');
    const fieldScroll=await card.locator('.schedule-overlay').evaluate(overlay=>{
      const field=overlay.querySelector('select[data-schedule-room="10"][data-schedule-room-setting="cleaning_mode"]');
      field.focus({preventScroll:true});overlay.scrollTop=180;const before=overlay.scrollTop;
      field.value='Vacuum then Mop';field.dispatchEvent(new Event('change',{bubbles:true}));return before;
    });
    await page.clock.runFor(50);
    assert.equal(await card.locator('.schedule-overlay').evaluate(el=>el.scrollTop),fieldScroll,'setting changes preserve editor scroll');
    assert.equal(await page.evaluate(()=>demo.card.shadowRoot.activeElement?.dataset.scheduleRoomSetting),'cleaning_mode','focused control survives replacement');
    await page.evaluate(()=>{audit.hass.states[audit.sensor].attributes.schedules[0].enabled=false;demo.card.hass={...audit.hass};});
    await page.clock.runFor(50);
    assert.equal(await card.locator('.schedule-overlay').evaluate(el=>el.scrollTop),fieldScroll,'HA updates preserve editor scroll');
    // Closing and reopening must not reuse the previous dialog's scroll.
    await page.evaluate(()=>{demo.card.closeSchedule();demo.card.openSchedule(102);});
    await page.clock.runFor(50);
    assert.equal(await card.locator('.schedule-overlay').evaluate(el=>el.scrollTop),0,'a fresh dialog opens at the top');
    assert.equal(await page.evaluate(()=>audit.calls.length),0);assert.deepEqual(errors,[]);await page.close();
  }
  for(const backend of ['spot','hass']) {
    // Supported session controls work during both transport and readback waits.
    {
      console.log(`Checking ${backend} session controls`);
      const {page,errors,card}=await setup(backend);
      await page.evaluate(()=>{
        const original=audit.hass.callService;
        audit.hass.callService=async(...args)=>{
          if(args[0]==='vacuum') {
            await original(...args);
            if(window.holdControl)await new Promise(resolve=>window.releaseControl=resolve);
            return;
          }
          const before=structuredClone(audit.hass.states[audit.sensor]);await original(...args);
          window.pendingState=structuredClone(audit.hass.states[audit.sensor]);audit.hass.states[audit.sensor]=before;
          await new Promise(resolve=>window.releaseSchedule=resolve);
        };
        demo.card.hass={...audit.hass};
      });
      await card.locator('#planning-tab-schedules').click();
      await card.locator('[data-schedule-id="102"] .schedule-toggle-target').click();
      await page.waitForFunction(()=>!!window.releaseSchedule);
      await page.evaluate(()=>{
        Object.assign(audit.hass.states[audit.entity],{state:'cleaning'});audit.hass.states[audit.entity].attributes.raw_state='FULL_CLEAN_RUNNING';
        window.holdControl=true;demo.card.hass={...audit.hass};
      });
      assert.equal(await card.locator('[data-control="pause"]').isEnabled(),true);
      await card.locator('[data-control="pause"]').click();
      await page.waitForFunction(()=>!!window.releaseControl);
      assert.equal(await card.locator('[data-control="return_to_base"]').isDisabled(),true,'existing control lock still prevents overlapping session actions');
      await page.evaluate(()=>{window.holdControl=false;releaseControl();});
      await page.waitForFunction(()=>!demo.card.controlBusy);
      await page.evaluate(()=>{audit.hass.states[audit.entity].state='paused';audit.hass.states[audit.entity].attributes.raw_state='FULL_CLEAN_PAUSED';demo.card.hass={...audit.hass};});
      await card.locator('[data-control="start"]').click();await page.waitForFunction(()=>!demo.card.controlBusy);
      await page.evaluate(()=>releaseSchedule());await page.waitForFunction(()=>!!demo.card._scheduleConfirmation);
      await card.locator('[data-control="return_to_base"]').click();await page.waitForFunction(()=>!demo.card.controlBusy);
      assert.deepEqual(await page.evaluate(()=>audit.calls.filter(call=>call.domain==='vacuum').map(call=>call.service)),['pause','start','return_to_base']);
      await page.evaluate(()=>{audit.hass.states[audit.entity].state='docked';audit.hass.states[audit.entity].attributes.raw_state='INACTIVE_CHARGING';demo.card.hass={...audit.hass};});
      await card.locator('#planning-tab-rooms').click();
      assert.equal(await page.evaluate(()=>demo.card.schedulesView),true,'navigation remains blocked during pending confirmation');
      assert.equal(await page.evaluate(()=>audit.calls.filter(call=>call.domain!=='vacuum').length),1,'no extra planner writes are dispatched');
      await page.evaluate(()=>{audit.hass.states[audit.sensor]=pendingState;demo.card.hass={...audit.hass};});
      await page.waitForFunction(()=>!demo.card.scheduleSending);
      assert.deepEqual(errors,[]);await page.close();
    }
    // Missing IDs in a partial list do not produce a deletion success notice.
    {
      console.log(`Checking ${backend} partial-list deletion`);
      const {page,errors,card}=await setup(backend);
      await page.evaluate(()=>{
        const original=audit.hass.callService;
        audit.hass.callService=async(...args)=>{await original(...args);audit.hass.states[audit.sensor].attributes.in_sync=false;};
        demo.card.hass={...audit.hass};
      });
      await card.locator('#planning-tab-schedules').click();await card.locator('[data-schedule-menu="101"]').click();
      await card.locator('[data-schedule-delete="101"]').click();await card.locator('[data-schedule-action="confirm"]').click();
      await page.waitForFunction(()=>!!demo.card._scheduleConfirmation);
      assert.equal(await card.locator('[data-schedule-id="101"]').count(),0);
      assert.match(await card.locator('.header-notice-copy').innerText(),/Deleting schedule/);
      await page.clock.runFor(10100);await page.waitForFunction(()=>!demo.card.scheduleSending);
      assert.match(await card.locator('.header-notice-copy').innerText(),/not been confirmed/);
      assert.equal(await page.evaluate(()=>audit.calls.length),1,'timeout never retries deletion');
      await page.evaluate(()=>{audit.hass.states[audit.sensor].attributes.in_sync=true;demo.card.hass={...audit.hass};});
      assert.equal(await card.locator('.header-notice-copy').innerText(),'Schedule deleted.');
      await page.clock.runFor(3100);assert.equal(await card.locator('.header-notice').isHidden(),true);
      assert.deepEqual(errors,[]);await page.close();
    }
    // Room IDs/options can remain valid across maps; draft provenance must not.
    {
      console.log(`Checking ${backend} draft context`);
      const {page,errors,card}=await setup(backend);
      await page.evaluate(backend=>{
        window.roomId=backend==='spot'?'10':'12';
        window.changeMap=map=>{
          if(backend==='spot')audit.hass.states[audit.entity].attributes.map_id=map;
          else for(const entry of audit.registry)entry.unique_id=entry.unique_id.replace(/_clean_zone_\d+_/,`_clean_zone_${map}_`);
          demo.card.hass={...audit.hass};
        };
        window.makeDraft=()=>{demo.card.selected=[demo.card.model.rooms.find(room=>room.roomId===roomId).entity];demo.card.settingDraft={[roomId]:{cleaning_mode:'Mop'}};demo.card.updateDirty();demo.card.render();};
        makeDraft();changeMap('456');
      },backend);
      await card.locator('[data-action="schedule-create"]').click();
      assert.equal(await card.locator('.schedule-dialog').count(),0,'an old-map draft cannot open creation');
      assert.match(await card.locator('.header-notice-copy').innerText(),/Review or discard/);
      assert.equal(await page.evaluate(()=>demo.card.settingDraft[roomId].cleaning_mode),'Mop','rejecting creation retains the draft');
      await page.evaluate(()=>demo.card.openSchedule(101));
      assert.equal(await page.evaluate(()=>demo.card.scheduleDialog.id),101,'existing schedule editing remains independent of the stale planner draft');
      await page.evaluate(()=>{demo.card.closeSchedule();demo.card.resetDraft();makeDraft();demo.card.openSchedule();demo.card.scheduleDialog.days=['fri'];demo.card.scheduleDialog.time='18:45';changeMap('789');});
      await page.evaluate(()=>demo.card.submitSchedule());await page.waitForFunction(()=>!demo.card.scheduleSending);
      assert.equal(await page.evaluate(()=>audit.calls.length),0,'a map change after opening is revalidated before dispatch');
      assert.match(await card.locator('.schedule-dialog-message').innerText(),/room plan changed/);
      await page.evaluate(async backend=>{
        demo.card.closeSchedule();demo.card.resetDraft();makeDraft();
        const original=audit.hass.callService;
        audit.hass.callService=async(...args)=>{
          await original(...args);
          if(backend==='spot'&&args[1]==='set_schedule')audit.hass.states[audit.sensor].attributes.schedules.at(-1).map_id='789';
        };
        demo.card.hass={...audit.hass};demo.card.openSchedule();demo.card.scheduleDialog.days=['fri'];demo.card.scheduleDialog.time='18:45';await demo.card.submitSchedule();
      },backend);
      assert.equal(await page.evaluate(()=>audit.calls.length),1,'a refreshed same-map draft creates exactly one schedule');
      assert.equal(await page.evaluate(()=>!!demo.card.scheduleDialog),false);
      const payload=await page.evaluate(()=>audit.calls[0].data);
      if(backend==='spot')assert.equal(payload.room_settings['10'].cleaning_mode,'Mop');
      else assert.equal(payload.room_modes['12'].cleaning_mode,'mop_only');
      assert.deepEqual(errors,[]);await page.close();
    }
  }
  console.log('Schedule review regressions passed: retained dialog scrolling, usable session controls, complete-list deletion confirmation and stale-map draft rejection for both adapters.');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
