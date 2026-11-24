import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { previewServer } from '../scripts/preview.mjs';
const { chromium }=createRequire(import.meta.url)('playwright');
const server=previewServer();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  const page=await browser.newPage({viewport:{width:900,height:1200}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{
    customElements.define('ha-card',class extends HTMLElement {
      constructor(){super();this.attachShadow({mode:'open'});}
      connectedCallback(){queueMicrotask(()=>{if(this.isConnected)this.shadowRoot.innerHTML='<slot></slot>';});}
    });
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(()=>{document.querySelector('main').style.maxWidth='900px';document.body.classList.add('dark');});
  const card=page.locator('#card');
  const pick=async id=>card.locator(`[data-schedule-plan-room="${id}"] .pick`).click();
  const expand=async id=>card.locator(`[data-schedule-room="${id}"][data-schedule-room-action="expand"]`).click();
  const field=(id,key)=>card.locator(`select[data-schedule-room="${id}"][data-schedule-room-setting="${key}"]`);
  const choose=async(id,key,value)=>{
    if(await field(id,key).count())await field(id,key).selectOption(value);
    else await card.locator(`button[data-schedule-room="${id}"][data-schedule-room-setting="${key}"][data-option="${value}"]`).click();
  };
  await mkdir('artifacts/schedule-editor',{recursive:true});
  for(const theme of ['modern','classic'])for(const width of [375,512,540,560,600,900]) {
    await page.setViewportSize({width,height:1200});
    await page.evaluate(async theme=>{
      const {spotSchedulesFixture}=await import('/tests/spot-schedules-fixture.mjs');
      window.sched=spotSchedulesFixture();
      const sensor=sched.hass.states[sched.sensor];
      sensor.attributes.schedules.push(...[201,202].map((id,i)=>({...structuredClone(sensor.attributes.schedules[0]),schedule_id:id,time:`1${6+i}:00`})));
      sensor.attributes.known=4;sensor.state='4';
      demo.card.setConfig({...sched.config,language:'en',theme,show_camera:false});demo.card.hass={...sched.hass};await demo.card.loadRegistry();
      demo.card.selected=[sched.ids[1],sched.ids[0]];
      demo.card.settingDraft={'11':{cleaning_mode:'Mop'}};demo.card.expanded.clear();demo.card.updateDirty();demo.card.render();
    },theme);
    const plannerHeight=await card.locator('[data-action="start"]').evaluate(el=>el.getBoundingClientRect().height);
    let plannerSplit=false;
    if(theme==='modern') {
      await card.locator('[data-expand]').nth(1).click();
      plannerSplit=await card.locator('.modern-rooms .room.open').evaluate(room=>{
        const head=room.querySelector('.room-head').getBoundingClientRect(),fields=room.querySelector('.fields').getBoundingClientRect();
        return fields.left>=head.right;
      });
    }
    await card.locator('#planning-tab-schedules').click();
    await card.locator('[data-schedule-menu="101"]').click();await card.locator('[data-schedule-edit="101"]').click();
    assert.equal(await card.locator('[data-schedule-room-toggle]').count(),5,'all available rooms are shown');
    assert.equal(await card.locator('[data-schedule-plan-room="10"] .selection-circle').innerText(),'1');
    assert.equal(await card.locator('[data-schedule-plan-room="11"] .selection-circle').innerText(),'2');
    assert.equal(await card.locator('[data-schedule-room-add], [data-schedule-room-action="remove"], [data-schedule-room-action="up"], [data-schedule-room-action="down"]').count(),0);
    await expand('11');
    await choose('11','cleaning_mode','Vacuum then Mop');
    await choose('11','cleaning_strategy','Quiet');
    if(theme==='modern') {
      const slider=card.locator('input[type="range"][data-schedule-room="11"][data-schedule-room-setting="water_level"]');
      await slider.focus();await slider.press('End');
      assert.equal(await slider.getAttribute('aria-valuetext'),'High');
      await choose('11','mop_repetitions','Two Passes');
    } else await choose('11','water_level','High');
    await pick('10');await pick('12');await pick('10');
    assert.deepEqual(await page.evaluate(()=>demo.card.scheduleDialog.roomPlan.roomIds),['11','12','10']);
    assert.equal(await card.locator('[data-schedule-plan-room="10"] .selection-circle').innerText(),'3');
    assert.equal(await card.locator('[data-schedule-plan-room="11"] .selection-circle').innerText(),'1');
    assert.equal(await card.locator('[data-schedule-plan-room="12"] .selection-circle').innerText(),'2');
    await expand('13');await choose('13','cleaning_mode','Mop');
    assert.equal(await page.evaluate(()=>demo.card.scheduleRoomPlanPayload().settings['13']),undefined,'unselected room edits are never sent');
    await expand('11');
    await page.evaluate(()=>{demo.card.hass={...sched.hass};});
    assert.deepEqual(await page.evaluate(()=>demo.card.scheduleDialog.roomPlan.roomIds),['11','12','10'],'HA updates preserve ordered selection');
    if(theme==='modern') {
      const sideBySide=await card.evaluate(el=>{
        const head=el.shadowRoot.querySelector('[data-schedule-plan-room="11"] .room-head').getBoundingClientRect();
        const fields=el.shadowRoot.querySelector('#schedule-room-fields-11').getBoundingClientRect();
        return fields.left>=head.right;
      });
      assert.equal(sideBySide,plannerSplit,'editor and planner use the same column layout at the same card width');
    }
    const heights=await card.locator('.schedule-footer button').evaluateAll(buttons=>buttons.map(button=>button.getBoundingClientRect().height));
    assert.ok(heights.every(height=>Math.abs(height-plannerHeight)<1),'footer buttons match the planner height');
    assert.equal(await card.locator('.schedule-dialog').evaluate(el=>el.scrollWidth>el.clientWidth+1),false);
    const inset=await card.evaluate(el=>{
      const card=el.shadowRoot.querySelector('ha-card').getBoundingClientRect(),panel=el.shadowRoot.querySelector('.schedule-room-editor').getBoundingClientRect();
      return panel.left-card.left;
    });
    assert.ok(inset>=4 && inset<=6,'room editor fills the card with only a small outer inset');
    await card.screenshot({path:`artifacts/schedule-editor/${theme}-${width}.png`});
    await card.locator('[data-focus="schedule-cancel"]').click();
    assert.equal(await page.evaluate(()=>sched.calls.length),0,'discard sends no command');
    assert.deepEqual(await page.evaluate(()=>demo.card.selected),await page.evaluate(()=>[sched.ids[1],sched.ids[0]]));
    assert.deepEqual(await page.evaluate(()=>demo.card.settingDraft),{'11':{cleaning_mode:'Mop'}},'the planner draft stays isolated');
    // The creation dialog uses the same room picker and snapshots the planner draft.
    await card.locator('#planning-tab-rooms').click();await card.locator('[data-action="schedule-create"]').click();
    assert.deepEqual(await page.evaluate(()=>demo.card.scheduleDialog.roomPlan.roomIds),['11','10']);
    await pick('12');
    await card.locator('[data-schedule-day="mon"]').check();await card.locator('[data-schedule-time]').click();
    await card.locator('[data-schedule-action="time-apply"]').click();
    await card.locator('[data-schedule-action="confirm"]').click();await page.waitForFunction(()=>!demo.card.scheduleSending);
    assert.deepEqual(await page.evaluate(()=>sched.calls.at(-1).data.room_ids),['11','10','12']);
    assert.deepEqual(await page.evaluate(()=>sched.calls.at(-1).data.room_settings),{'11':{cleaning_mode:'Mop'}});
    assert.equal(await page.evaluate(()=>sched.hass.states[sched.fields['11'].cleaning_mode].state),'Vacuum');
  }
  assert.deepEqual(errors,[]);
  console.log('Schedule editor: planner room picker, numbered selection order, shared controls, responsive panel, matching footer heights, draft isolation, discard and creation passed.');
} finally {await browser?.close();server.close();}
