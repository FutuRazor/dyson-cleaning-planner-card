import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { previewServer } from '../scripts/preview.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=previewServer();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  const page=await browser.newPage({viewport:{width:375,height:1200}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(async()=>{
    const {spotSchedulesFixture}=await import('/tests/spot-schedules-fixture.mjs');
    window.sched=spotSchedulesFixture();
    const attrs=sched.hass.states[sched.sensor].attributes;
    attrs.schedules.push(...[201,202].map((id,i)=>({...structuredClone(attrs.schedules[0]),schedule_id:id,time:`1${6+i}:00`,enabled:false})));
    attrs.known=4;sched.hass.states[sched.sensor].state='4';
    document.querySelector('main').style.maxWidth='900px';
    demo.card.setConfig({...sched.config,language:'en',show_camera:false});demo.card.hass={...sched.hass};await demo.card.loadRegistry();
    window.reportCount=count=>{
      const attrs=sched.hass.states[sched.sensor].attributes;
      attrs.in_sync=false;attrs.on=count;demo.card.hass={...sched.hass};
    };
  });
  const card=page.locator('#card'),badge=card.locator('.schedule-count');
  await mkdir('artifacts/schedules-badge',{recursive:true});
  for(const theme of ['modern','classic'])for(const dark of [false,true])for(const language of ['en','de','fr','nl'])for(const width of [320,375,450,732]) {
    await page.setViewportSize({width,height:1200});
    await page.evaluate(({theme,dark,language})=>{
      document.body.classList.toggle('dark',dark);
      demo.card.setConfig({...demo.card.config,theme,language});demo.card.hass={...sched.hass};
    },{theme,dark,language});
    await card.locator('#planning-tab-schedules').click();
    let baseline;
    for(const count of [null,0,1,12,120]) {
      await page.evaluate(count=>reportCount(count),count);
      const geometry=await card.evaluate(el=>{
        const root=el.shadowRoot,nav=root.querySelector('.planning-tabs'),card=root.querySelector('ha-card').getBoundingClientRect();
        const box=node=>{const r=node.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
        const counter=root.querySelector('.schedule-count');
        return {nav:box(nav),tabs:[...nav.querySelectorAll('button')].map(button=>({box:box(button),label:box(button.querySelector('.planning-tab-label'))})),
          badge:counter?{...box(counter),zero:counter.classList.contains('is-zero'),font:getComputedStyle(counter).fontSize}:null,
          card,overflow:nav.scrollWidth>nav.clientWidth+1};
      });
      if(count===null) {baseline=geometry;assert.equal(await badge.count(),0);continue;}
      assert.equal(await badge.innerText(),count>99?'99+':String(count));
      assert.equal(geometry.badge.zero,count===0);
      assert.ok(geometry.badge.x>=geometry.card.x && geometry.badge.right<=geometry.card.right-1,'badge stays inside narrow cards');
      assert.ok(geometry.badge.y>=geometry.nav.y && geometry.badge.bottom<=geometry.nav.bottom,'raised count stays inside the tab bar');
      assert.equal(geometry.nav.height,baseline.nav.height,'count never adds a tab row');
      for(let i=0;i<geometry.tabs.length;i++) {
        assert.equal(geometry.tabs[i].box.width,baseline.tabs[i].box.width,'badge consumes no tab width');
        assert.equal(geometry.tabs[i].label.height,baseline.tabs[i].label.height,'label stays on one line');
      }
      assert.equal(geometry.overflow,false,'tab bar has no horizontal overflow');
      assert.match(await card.locator('#planning-tab-schedules').getAttribute('aria-label'),new RegExp(String(count)));
      if(theme==='modern' && language==='en' && [375,732].includes(width))await card.screenshot({path:`artifacts/schedules-badge/${dark?'dark':'light'}-${width}-${count}.png`});
    }
  }
  await page.evaluate(()=>{const attrs=sched.hass.states[sched.sensor].attributes;attrs.in_sync=true;attrs.schedules[0].enabled=true;attrs.schedules.slice(1).forEach(s=>{s.enabled=false;});demo.card.hass={...sched.hass};});
  assert.equal(await badge.innerText(),'1','complete schedule metadata supplies the confirmed count');
  await card.locator('#planning-tab-rooms').click();assert.equal(await badge.innerText(),'1');
  await card.locator('#planning-tab-zones').click();assert.equal(await badge.innerText(),'1','count is also visible outside the schedule overview');
  await card.locator('#planning-tab-schedules').focus();await page.keyboard.press('Home');
  assert.equal(await card.locator('#planning-tab-rooms').getAttribute('aria-selected'),'true');
  await page.setViewportSize({width:375,height:1200});
  await page.evaluate(()=>demo.card.setConfig({...demo.card.config,theme:'modern',language:'en'}));
  await card.locator('#planning-tab-schedules').click();
  await card.screenshot({path:'artifacts/schedules-badge/preview-dark-375.png'});
  await card.locator('.planning-tabs').screenshot({path:'artifacts/schedules-badge/preview-tabs.png'});
  assert.deepEqual(errors,[]);
  console.log('Schedule badge: zero/single/double/capped counts, unavailable data, unchanged tab geometry, one-line labels, both themes/light-dark/four languages at 320/375/450/732 px, and keyboard navigation passed.');
} finally {await browser?.close();server.close();}
