import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=previewServer();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  for(const backend of ['spot','hass']) {
    const page=await browser.newPage({viewport:{width:900,height:1200}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.locator('#card .room').first().waitFor();
    await page.evaluate(backend=>{
      window.scheduleFeedbackLoading=import(backend==='spot'?'/tests/spot-schedules-fixture.mjs':'/tests/schedules-fixture.mjs')
        .then(module=>{window.scheduleFeedbackFactory=backend==='spot'?module.spotSchedulesFixture:module.schedulesFixture;});
    },backend);
    await page.waitForFunction(()=>typeof window.scheduleFeedbackFactory==='function');
    await page.evaluate(()=>{
      window.sched=window.scheduleFeedbackFactory();
      const original=sched.hass.callService;
      window.delayedCall=async(...args)=>{
        const before=structuredClone(sched.hass.states[sched.sensor]);
        await original(...args);
        window.pendingState=structuredClone(sched.hass.states[sched.sensor]);
        sched.hass.states[sched.sensor]=before;
      };
      window.applyPending=()=>{sched.hass.states[sched.sensor]=pendingState;demo.card.hass={...sched.hass};};
      sched.hass.callService=delayedCall;
      demo.card.setConfig({...sched.config,language:'en',show_camera:false});demo.card.hass={...sched.hass};
      window.scheduleFeedbackRegistry=demo.card.loadRegistry();
    });
    await page.evaluate(()=>window.scheduleFeedbackRegistry);
    await page.clock.install();
    const card=page.locator('#card'),header=card.locator('.header-notice');
    const idle=()=>page.waitForFunction(()=>!demo.card.scheduleSending);
    const waiting=()=>page.waitForFunction(()=>!!demo.card._scheduleConfirmation);
    const action=async(id,mode)=>{await card.locator(`[data-schedule-menu="${id}"]`).click();await card.locator(`[data-schedule-${mode}="${id}"]`).click();};
    const toggle=()=>card.locator('[data-schedule-id="102"] .schedule-toggle-target').click({position:{x:4,y:4}});
    await card.locator('#planning-tab-schedules').click();
    await toggle();await waiting();
    assert.equal(await card.locator('.schedule-count').innerText(),'1','pending toggle does not change the active count');
    assert.equal(await card.locator('.schedule-toggle-spinner').isVisible(),true);
    assert.equal(await card.locator('.schedule-menu-panel').count(),0,'blank space around the circle only toggles the schedule');
    assert.equal(await card.locator('[data-schedule-id="102"] .selection-circle').innerText(),'','the spinner replaces the marker while awaiting HA');
    assert.equal(await card.locator('.schedule-toggle-spinner').evaluate(spinner=>{
      const s=spinner.getBoundingClientRect(),c=spinner.parentElement.querySelector('.selection-circle').getBoundingClientRect();
      return s.left>=c.left && s.right<=c.right && s.top>=c.top && s.bottom<=c.bottom;
    }),true,'the pending spinner fits inside the selection circle');
    assert.equal(await card.locator('[data-schedule-toggle="102"]').getAttribute('aria-busy'),'true');
    assert.equal(await card.locator('[data-schedule-toggle="102"]').isChecked(),false,'checkbox remains at the HA-reported state');
    assert.equal(await header.isHidden(),true,'toggle progress has no header message');
    await page.evaluate(()=>applyPending());await idle();
    assert.equal(await card.locator('[data-schedule-toggle="102"]').isChecked(),true);
    assert.equal(await card.locator('[data-schedule-id="102"] .selection-circle').innerText(),'✓');
    assert.equal(await card.locator('.schedule-count').innerText(),'2','confirmed state updates the tab count');
    assert.equal(await card.locator('.schedule-toggle-spinner').count(),0);
    assert.equal(await header.isHidden(),true,'toggle success finishes silently');

    await action(101,'edit');await card.locator('[data-schedule-time]').click();
    await card.locator('[data-schedule-time-part="hour"][data-schedule-time-value="21"]').click();
    await card.locator('[data-schedule-action="time-apply"]').click();
    await card.locator('[data-schedule-action="confirm"]').click();await waiting();
    assert.match(await card.locator('.header-notice-copy').innerText(),/Saving schedule/);
    assert.equal(await card.locator('[data-schedule-id="101"] .schedule-time-value').innerText(),'10:00','unconfirmed data is not shown as saved');
    await page.evaluate(()=>applyPending());await idle();
    assert.equal(await card.locator('.header-notice-copy').innerText(),'Schedule saved.');
    await page.clock.runFor(3100);
    assert.equal(await header.isHidden(),true,'success disappears automatically');

    await page.evaluate(()=>{sched.hass.callService=async()=>{throw new Error('Robot refused');};demo.card.hass={...sched.hass};});
    await toggle();await idle();
    await page.clock.runFor(15000);
    assert.match(await card.locator('.header-notice-copy').innerText(),/Robot refused/);
    assert.equal(await header.isVisible(),true,'errors remain visible');
    await card.locator('[data-action="dismiss-notice"]').click();
    await page.evaluate(()=>{sched.hass.callService=delayedCall;demo.card.hass={...sched.hass};});

    await toggle();await waiting();
    const calls=await page.evaluate(()=>sched.calls.length);
    await page.clock.runFor(10100);await idle();
    assert.match(await card.locator('.header-notice-copy').innerText(),/not been confirmed/);
    assert.equal(await card.locator('.schedule-toggle-spinner').count(),0);
    await page.clock.runFor(5000);
    assert.equal(await header.isVisible(),true,'missing confirmation stays visible');
    assert.equal(await page.evaluate(()=>sched.calls.length),calls,'timeouts do not retry writes');
    await page.evaluate(()=>applyPending());
    assert.equal(await header.isHidden(),true,'a late matching HA update clears its warning');

    await action(101,'delete');await card.locator('[data-schedule-action="confirm"]').click();await waiting();
    assert.equal(await card.locator('[data-schedule-id="101"]').count(),1,'delete waits for authoritative removal');
    await page.evaluate(()=>applyPending());await idle();
    assert.equal(await card.locator('.header-notice-copy').innerText(),'Schedule deleted.');
    await page.evaluate(()=>{demo.card.message='A newer important message';demo.card.error=true;demo.card.updateHeaderNotice();});
    await page.clock.runFor(3100);
    assert.equal(await card.locator('.header-notice-copy').innerText(),'A newer important message','an old success timer never erases a newer message');
    await card.locator('[data-action="dismiss-notice"]').click();

    await toggle();await waiting();
    await page.evaluate(()=>demo.card.setConfig({...demo.card.config,title:'Changed configuration'}));
    await page.clock.runFor(15000);
    assert.equal(await header.isHidden(),true,'reconfiguration cancels pending feedback timers');
    await page.evaluate(()=>applyPending());
    assert.equal(await header.isHidden(),true,'late data cannot show feedback from an obsolete request');
    await page.evaluate(()=>{
      demo.card.selected=[demo.card.model.rooms.find(room=>room.available && !room.excluded).entity];
      demo.card.updateDirty();demo.card.render();
    });
    await card.locator('[data-action="schedule-create"]').click();
    await card.locator('[data-schedule-day="mon"]').check();await card.locator('[data-schedule-time]').click();
    await card.locator('[data-schedule-action="time-apply"]').click();
    await card.locator('[data-schedule-action="confirm"]').click();await waiting();
    assert.match(await card.locator('.header-notice-copy').innerText(),/Saving schedule/);
    await page.evaluate(()=>applyPending());await idle();
    assert.equal(await card.locator('.header-notice-copy').innerText(),'Schedule created.');
    await page.clock.runFor(3100);assert.equal(await header.isHidden(),true);
    assert.deepEqual(errors,[]);
    await page.close();
  }
  console.log('Schedule feedback: local toggle progress, authoritative confirmation, auto-hidden success, durable failures/timeouts, late updates, timer ownership and lifecycle passed for both adapters.');
} finally {await browser?.close();server.close();}
