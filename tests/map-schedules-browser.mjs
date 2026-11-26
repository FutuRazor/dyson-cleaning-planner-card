import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {previewServer} from '../scripts/preview.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=previewServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  await mkdir('artifacts/map-schedules',{recursive:true});
  for(const theme of ['modern','classic'])for(const width of [375,900]) {
    const page=await browser.newPage({viewport:{width,height:1100}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));page.setDefaultNavigationTimeout(60000);
    await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'domcontentloaded'});
    const card=page.locator('#card');await card.locator('.room').first().waitFor();
    await page.evaluate(()=>{window.scheduleFixtureLoading=import('/tests/spot-schedules-fixture.mjs')
      .then(module=>{window.scheduleFixtureFactory=module.spotSchedulesFixture;});});
    await page.waitForFunction(()=>typeof window.scheduleFixtureFactory==='function');
    await page.evaluate(theme=>{
      const f=window.scheduleFixtureFactory();window.mapSchedules=f;f.card=demo.card;
      f.hass.hassUrl=demo.hass.hassUrl;
      f.aSchedules=structuredClone(f.hass.states[f.sensor].attributes.schedules);
      f.bSchedule={...structuredClone(f.aSchedules[0]),schedule_id:201,map_id:'456',time:'07:00'};
      f.applyScheduleMap=(id,orders)=>{
        f.hass.states[f.entity].attributes.map_id=id;
        const sensor=f.hass.states[f.sensor],attrs=sensor.attributes;
        attrs.map_id=id;attrs.schedules=structuredClone(orders);attrs.in_sync=true;
        attrs.known=orders.length;attrs.on=orders.filter(s=>s.enabled).length;sensor.state=String(orders.length);
        f.card.hass={...f.hass};
      };
      f.card.setConfig({...f.config,theme,language:'en',show_camera:false});f.card.hass=f.hass;
    },theme);
    await card.locator('#planning-tab-schedules').click();
    assert.equal(await card.locator('.schedule-row').count(),2);
    assert.equal(await card.locator('.schedule-count').innerText(),'1');
    assert.equal(await page.evaluate(()=>mapSchedules.card._scheduleCountdown.next.id),101);
    // App/select map transitions use the header without replacing real activity.
    await page.evaluate(()=>{
      const f=mapSchedules;Object.assign(f.hass.states[f.entity].attributes,
        {ready_to_start:false,start_block_reason:'map_switching'});f.card.hass={...f.hass};
    });
    assert.match(await card.locator('.header-notice-copy').innerText(),/map switch to finish/);
    assert.equal(await card.locator('.header-notice').isVisible(),true);
    assert.equal(await card.locator('.activity-start-block').isVisible(),false);
    assert.equal(await card.locator('.activity-status').isVisible(),theme==='modern');
    if(theme==='modern')assert.equal(await card.locator('.activity-text').innerText(),'Docked');
    await page.evaluate(()=>{
      const f=mapSchedules;f.hass.states[f.entity].attributes.dock_state='DRYING_MOP';f.card.hass={...f.hass};
    });
    assert.equal(await card.locator('.activity-text').innerText(),'Drying mop roller');
    assert.match(await card.locator('.header-notice-copy').innerText(),/map switch to finish/);
    await card.locator('[data-action="dismiss-notice"]').click();
    await page.evaluate(()=>{mapSchedules.card.hass={...mapSchedules.hass};});
    assert.equal(await card.locator('.header-notice').isVisible(),false,'dismissal survives unchanged telemetry');
    await page.evaluate(()=>{
      const f=mapSchedules;Object.assign(f.hass.states[f.entity].attributes,
        {ready_to_start:true,start_block_reason:null,dock_state:'IDLE'});f.card.hass={...f.hass};
    });
    assert.equal(await card.locator('.header-notice').isVisible(),false,'the notice clears with readiness');
    await card.locator('[data-schedule-menu="101"]').click();await card.locator('[data-schedule-edit="101"]').click();
    await page.evaluate(()=>{const f=mapSchedules;f.hass.states[f.entity].attributes.map_id='456';f.card.hass={...f.hass};});
    assert.equal(await card.locator('.schedule-dialog').count(),0);
    assert.equal(await card.locator('.schedule-row').count(),0);
    assert.equal(await card.locator('.schedule-warning').count(),0,'A status cannot become a B sync warning');
    await page.evaluate(()=>mapSchedules.applyScheduleMap('456',[]));
    assert.equal(await card.locator('.schedule-count').innerText(),'0');
    assert.match(await card.locator('.schedules').innerText(),/No schedules for this map\./);
    assert.match(await card.locator('.schedule-countdown').innerText(),/No active schedules/);
    await card.screenshot({path:`artifacts/map-schedules/empty-${theme}-${width}.png`});
    await page.evaluate(()=>mapSchedules.applyScheduleMap('456',[mapSchedules.bSchedule]));
    assert.deepEqual(await card.locator('.schedule-row').evaluateAll(rows=>rows.map(row=>row.dataset.scheduleId)),['201']);
    assert.equal(await page.evaluate(()=>mapSchedules.card._scheduleCountdown.next.id),201);
    await page.evaluate(()=>mapSchedules.applyScheduleMap('123',mapSchedules.aSchedules));
    assert.deepEqual(await card.locator('.schedule-row').evaluateAll(rows=>rows.map(row=>row.dataset.scheduleId)),['102','101']);
    assert.equal(await card.locator('.schedule-warning').count(),0);
    await page.evaluate(()=>{const f=mapSchedules;f.hass.states[f.sensor].attributes.in_sync=false;f.card.hass={...f.hass};});
    assert.match(await card.locator('.schedule-warning').innerText(),/incomplete/,'genuine same-map warnings remain visible');
    await page.evaluate(()=>{
      const f=mapSchedules;f.applyScheduleMap('123',f.aSchedules);
      f.hass.callService=async(domain,service,data)=>{f.calls.push({domain,service,data});
        await new Promise(resolve=>{window.releaseScheduleTransport=resolve;});};
      f.card.hass={...f.hass};
    });
    await card.locator('[data-schedule-menu="101"]').click();await card.locator('[data-schedule-delete="101"]').click();
    await card.locator('[data-schedule-action="confirm"]').click();
    await page.waitForFunction(()=>typeof window.releaseScheduleTransport==='function');
    await page.evaluate(()=>mapSchedules.applyScheduleMap('456',[]));
    await page.evaluate(()=>window.releaseScheduleTransport());
    await page.waitForFunction(()=>!mapSchedules.card.scheduleSending);
    assert.doesNotMatch(await card.locator('.header-notice-copy').textContent(),/Schedule deleted/,
      'filtering A away must not confirm deletion of an A schedule');
    assert.equal(await page.evaluate(()=>mapSchedules.calls.length),1,'no retries on a map transition');
    assert.deepEqual(errors,[]);await page.close();
  }
  console.log('Map-scoped schedules: both themes at 375/900 px, empty B, shared names, A/B readback, counts/countdown, genuine warnings and in-flight context changes passed.');
} finally {await browser?.close();server.close();}
