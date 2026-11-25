import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { previewServer } from '../scripts/preview.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=previewServer(); await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
try {
 const page=await browser.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/`); await page.locator('#card .room').first().waitFor();
 for(const width of [390,900]) {
  await page.setViewportSize({width,height:1100});
  let baseline;
  for(const phase of ['IDLE','WASHING_MOP','DRYING_MOP','COLLECTING_DUST','IDLE']) {
   await page.evaluate(phase=>{demo.card.setConfig({...demo.card.config,theme:'modern'}); const v=demo.hass.states[demo.entity];v.state='docked';Object.assign(v.attributes,{dock_state:phase,drying_total_seconds:14400,drying_remaining_seconds:6000});demo.card.hass={...demo.hass};},phase);
   const box=await page.locator('#card .planning-tabs').boundingBox();
   baseline??=box.y; assert.equal(box.y,baseline,`${width}/${phase}: tabs must not move`);
   assert.equal((await page.locator('#card .activity-status').boundingBox()).height,44);
  }
 }
 await page.evaluate(()=>{demo.hass.states[demo.entity].attributes.dock_state='DRYING_MOP';demo.card.hass={...demo.hass};});
 assert.doesNotMatch(await page.locator('.activity-remaining').innerText(),/Remaining time/);
 await mkdir('artifacts',{recursive:true}); await page.locator('#card').screenshot({path:'artifacts/modern-status-drying.png'});
 // The track follows translated status + time, including resize without HA updates.
 const wideWidths={};
 for(const dark of [false,true]) for(const language of ['en','de','nl','fr']) {
  await page.evaluate(({dark,language})=>{
   document.body.classList.toggle('dark',dark);
   demo.card.setConfig({...demo.card.config,theme:'modern',language});
  },{dark,language});
  for(const width of [900,450,375,320]) {
   await page.setViewportSize({width,height:1100});
   const geometry=await page.locator('#card').evaluate(card=>{
    const root=card.shadowRoot, box=selector=>root.querySelector(selector).getBoundingClientRect();
    const track=box('.drying-progress'),time=box('.activity-remaining'),text=box('.activity-text'),cancel=box('.cancel-drying'),row=box('.activity-status');
    const timeEl=root.querySelector('.activity-remaining');
    return {left:track.left,textLeft:text.left,right:track.right,timeRight:time.right,width:track.width,
     cancelLeft:cancel.left,cancelRight:cancel.right,rowRight:row.right,rowHeight:row.height,
     timeWidth:time.width,timeScroll:timeEl.scrollWidth,timeClient:timeEl.clientWidth};
   });
   assert.ok(Math.abs(geometry.left-geometry.textLeft)<1,`${language}/${width}: track starts with status`);
   assert.ok(Math.abs(geometry.right-geometry.timeRight)<1,`${language}/${width}: track ends with time`);
   assert.ok(geometry.cancelLeft>=geometry.timeRight,`${language}/${width}: cancel follows time`);
   assert.ok(geometry.cancelRight<=geometry.rowRight+1,`${language}/${width}: controls fit`);
   assert.ok(geometry.timeWidth>0&&geometry.timeScroll<=geometry.timeClient+1,`${language}/${width}: time remains readable`);
   assert.equal(geometry.rowHeight,44);
   if(width===900) wideWidths[language]=geometry.width;
   if(language==='de'&&[450,900].includes(width)) await page.locator('#card').screenshot({path:`artifacts/drying-width-de-${dark?'dark':'light'}-${width}.png`});
  }
 }
 assert.ok(wideWidths.de>wideWidths.en,'track width follows the translated text');
 await page.setViewportSize({width:900,height:1100});
 await page.evaluate(()=>{document.body.classList.remove('dark');demo.card.setConfig({...demo.card.config,language:'en'});});
 for(const theme of ['modern','classic']) {
  await page.evaluate(theme=>{demo.card.setConfig({...demo.card.config,theme,show_camera:true}); const v=demo.hass.states[demo.entity];v.state='cleaning';v.attributes.dock_state='IDLE';demo.card.hass={...demo.hass};},theme);
  assert.equal(await page.locator('#card .map-title').count(),theme==='modern'?0:1);
  if(theme==='modern') {
   assert.equal((await page.locator('#card .session-toggle').boundingBox()).height,38);
   await page.locator('#card').screenshot({path:'artifacts/modern-status-session.png'});
  }
 }
 await page.evaluate(()=>{demo.hass.states[demo.entity].state='docked';demo.card.hass={...demo.hass};});
 assert.equal(await page.locator('#card .activity-status').isVisible(),false);
 await page.evaluate(()=>{demo.card.setConfig({...demo.card.config,theme:'modern'});const v=demo.hass.states[demo.entity];v.state='error';v.attributes.ready_to_start=true;v.attributes.fault='Test retained fault';demo.card.hass={...demo.hass};});
 assert.equal(await page.locator('#card .header-fault-detail').innerText(),'Test retained fault');
 assert.equal(await page.locator('#card .compact-status').count(),1);
 const top=(await page.locator('#card .planning-tabs').boundingBox()).y;
 assert.equal(await page.locator('#card .header-fault').isVisible(),true);
 await page.locator('#card [data-action="dismiss-fault"]').click();
 assert.equal(await page.locator('#card .header-fault').isVisible(),false);
 assert.equal(await page.locator('#card .robot-warning').isVisible(),true);
 await page.evaluate(()=>{demo.card.hass={...demo.hass};});
 assert.equal(await page.locator('#card .header-fault').isVisible(),false);
 await page.locator('#card .robot-warning').click();
 assert.equal(await page.locator('#card .header-fault').isVisible(),true);
 await page.setViewportSize({width:390,height:1100});
 await page.locator('#card').screenshot({path:'artifacts/modern-fault-overlay.png'});
 await page.locator('#card [data-action="dismiss-fault"]').click();
 await page.evaluate(()=>{demo.hass.states[demo.entity].attributes.fault='Different error';demo.card.hass={...demo.hass};});
 assert.equal(await page.locator('#card .header-fault').isVisible(),true);
 await page.evaluate(()=>{demo.hass.states[demo.entity].attributes.dock_state='DRYING_MOP';demo.card.hass={...demo.hass};});
 assert.equal(await page.locator('#card .activity-text').innerText(),'Drying mop roller');
 await page.evaluate(()=>{const v=demo.hass.states[demo.entity];v.state='docked';v.attributes.dock_state='IDLE';demo.card.hass={...demo.hass};});
 assert.equal(await page.locator('#card .header-fault').isVisible(),false);
 assert.equal(await page.locator('#card .robot-warning').isVisible(),false);
 assert.equal(await page.locator('#card .activity-text').innerText(),'Docked');
 assert.equal(await page.evaluate(()=>demo.calls.length),0);
 assert.deepEqual(errors,[]);
 console.log('Modern status checks passed: translated drying-track width, readable time at 320-900px, fixed height, session controls, Classic and retained faults.');
} finally {await browser.close();await new Promise(r=>server.close(r));}
