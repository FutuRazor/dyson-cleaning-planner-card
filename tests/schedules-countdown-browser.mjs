import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server=previewServer();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  await mkdir('artifacts/schedules-countdown',{recursive:true});
  for(const backend of ['spot','hass']) {
    const page=await browser.newPage({viewport:{width:732,height:1200},timezoneId:'America/New_York'}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.clock.install({time:new Date('2026-11-24T08:00:00Z')});
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.evaluate(async backend=>{
      const module=await import(backend==='spot'?'/tests/spot-schedules-fixture.mjs':'/tests/schedules-fixture.mjs');
      window.sched=backend==='spot'?module.spotSchedulesFixture():module.schedulesFixture();
      sched.hass.config={...sched.hass.config,time_zone:'Europe/Berlin'};
      demo.card.setConfig({...sched.config,language:'en',show_camera:false});demo.card.hass={...sched.hass};await demo.card.loadRegistry();
    },backend);
    const card=page.locator('#card'),line=card.locator('.schedule-countdown');
    await card.locator('#planning-tab-schedules').click();
    assert.equal(await line.innerText(),'Next cleaning in 1h 0m','HA zone overrides browser zone');
    assert.match(await line.getAttribute('title'),/10:00.*Europe\/Berlin/);
    const initialCalls=await page.evaluate(()=>sched.calls.length);
    await page.clock.fastForward(60000);
    assert.equal(await line.innerText(),'Next cleaning in 59m','time updates without an HA event');
    await card.locator('[data-schedule-menu="101"]').click();
    await page.evaluate(()=>{window.menuNode=demo.card.shadowRoot.querySelector('.schedule-menu-panel');});
    await page.clock.fastForward(60000);
    assert.equal(await line.innerText(),'Next cleaning in 58m');
    assert.equal(await page.evaluate(()=>menuNode===demo.card.shadowRoot.querySelector('.schedule-menu-panel')),true,'timer never rerenders a menu');
    await page.keyboard.press('Escape');
    await page.evaluate(()=>{sched.hass.states[sched.sensor].attributes.schedules[0].enabled=false;demo.card.hass={...sched.hass};});
    assert.equal(await line.innerText(),'No active schedules');
    await page.evaluate(()=>{
      const attrs=sched.hass.states[sched.sensor].attributes;attrs.schedules[1].enabled=true;
      attrs.schedules[1].days=['tue'];attrs.schedules[1].time='09:01';attrs.in_sync=false;demo.card.hass={...sched.hass};
    });
    assert.match(await line.innerText(),/^Next known cleaning in 6d 23h$/);
    for(const theme of ['modern','classic'])for(const language of ['en','de','nl','fr'])for(const width of [320,375,732]) {
      await page.setViewportSize({width,height:1200});
      await page.evaluate(({theme,language})=>{
        demo.card.setConfig({...demo.card.config,theme,language});demo.card.hass={...sched.hass};
      },{theme,language});
      await card.locator('#planning-tab-schedules').click();
      const bounds=await line.evaluate(el=>({width:el.clientWidth,content:el.scrollWidth,height:el.getBoundingClientRect().height,gap:parseFloat(getComputedStyle(el).marginBottom),text:el.textContent}));
      assert.ok(bounds.content<=bounds.width+1,`${theme}/${language}/${width}: countdown fits: ${JSON.stringify(bounds)}`);
      assert.ok(bounds.height<20 && bounds.gap<=6,'compact one-line text and small gap');
      if(backend==='spot' && language==='de' && theme==='modern' && width!==375)await card.screenshot({path:`artifacts/schedules-countdown/${width}.png`});
    }
    if(backend==='spot') {
      await page.evaluate(()=>{
        const attrs=sched.hass.states[sched.sensor].attributes;attrs.in_sync=true;
        attrs.schedules[1].days=['tue','thu'];attrs.schedules[1].time='10:00';
        demo.card.setConfig({...demo.card.config,theme:'modern',language:'de'});demo.card.hass={...sched.hass};
      });
      await card.locator('#planning-tab-schedules').click();
      for(const width of [320,732]) {
        await page.setViewportSize({width,height:1200});
        await card.screenshot({path:`artifacts/schedules-countdown/normal-${width}.png`});
      }
      await page.evaluate(()=>demo.card.setConfig({...demo.card.config,language:'fr'}));
    }
    await page.evaluate(()=>{sched.hass.config.time_zone='invalid/zone';demo.card.hass={...sched.hass};});
    assert.equal(await line.innerText(),'Prochain nettoyage indisponible');
    await page.evaluate(()=>{
      sched.hass.config.time_zone='Europe/Berlin';
      const attrs=sched.hass.states[sched.sensor].attributes;attrs.in_sync=true;attrs.schedules[1].repeat=false;demo.card.hass={...sched.hass};
    });
    assert.equal(await line.innerText(),'Prochain nettoyage inconnu','one-time dates are not invented');
    await page.evaluate(()=>{sched.hass.connected=false;demo.card.hass={...sched.hass};});
    assert.equal(await line.innerText(),'Prochain nettoyage indisponible');
    assert.equal(await page.evaluate(()=>sched.calls.length),initialCalls,'countdown sends no service actions');
    await page.evaluate(()=>{window.detachedLine=demo.card.shadowRoot.querySelector('.schedule-countdown');demo.card.remove();});
    const before=await page.evaluate(()=>detachedLine.textContent);
    await page.clock.fastForward(120000);
    assert.equal(await page.evaluate(()=>detachedLine.textContent),before,'detachment stops local refresh');
    assert.deepEqual(errors,[]);
    await page.close();
  }
  console.log('Schedule countdown: HA timezone, local ticking, menu preservation, live state changes, incomplete/one-time/offline states and compact four-language layouts passed for both adapters.');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
