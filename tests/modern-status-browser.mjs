import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { previewServer } from '../scripts/preview.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=previewServer(); await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,channel:'msedge'});
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
 assert.equal(await page.locator('#card .activity-fault').innerText(),'Test retained fault');
 assert.equal(await page.locator('#card .compact-status').count(),0);
 assert.deepEqual(errors,[]);
 console.log('Modern status checks passed: fixed height, drying, session controls, Classic and retained faults.');
} finally {await browser.close();await new Promise(r=>server.close(r));}
