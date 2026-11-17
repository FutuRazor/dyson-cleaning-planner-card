import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {previewServer} from '../scripts/preview.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=previewServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
try {
 const page=await browser.newPage();await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.locator('#card .room').first().waitFor();
 const result=await page.evaluate(()=>{
  const c=demo.card; c.setConfig({...c.config,theme:'modern',show_camera:false});
  const v=demo.hass.states[demo.entity], camera=demo.hass.states[c.model.cameraEntity];
  const read=(state,color,connected=true)=>{v.state=state;v.attributes.dock_state='IDLE';camera.attributes.robot_bumper_color=color;c.hass={...demo.hass,connected};const b=c.shadowRoot.querySelector('.robot-bumper');return {phase:b.dataset.state,color:getComputedStyle(b).stroke,animation:getComputedStyle(b).animationName,height:c.shadowRoot.querySelector('header').getBoundingClientRect().height};};
  const cleaning=read('cleaning','#123abc');const pauseColor=getComputedStyle(c.shadowRoot.querySelector('.session-toggle')).color;
  return {cleaning,pauseColor,paused:read('paused','#123abc'),fault:read('error','#123abc'),idle:read('docked','#123abc'),missing:read('cleaning',null),invalid:read('cleaning','url(https://example.com)'),offline:read('error','#123abc',false)};
 });
 assert.equal(result.cleaning.color,'rgb(18, 58, 188)');assert.equal(result.cleaning.animation,'none');
 assert.equal(result.paused.color,result.pauseColor);assert.equal(result.paused.animation,'bumper-pulse');
 assert.equal(result.fault.color,'rgb(225, 29, 42)');assert.equal(result.fault.animation,'bumper-pulse');
 assert.equal(result.idle.color,'rgb(100, 100, 109)');assert.equal(result.idle.animation,'none');
 for(const k of ['missing','invalid','offline']){assert.equal(result[k].color,'rgb(205, 205, 212)');assert.equal(result[k].animation,'none');}
 assert.equal(new Set(Object.values(result).filter(x=>x.height).map(x=>x.height)).size,1);
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.evaluate(()=>{demo.hass.states[demo.entity].state='paused';demo.card.hass={...demo.hass,connected:true};});
 assert.equal(await page.locator('#card .robot-bumper').evaluate(el=>getComputedStyle(el).animationName),'none');
 console.log('Bumper browser checks passed: live colour, pause/fault priority, fallback, stable header and reduced motion.');
}finally{await browser.close();server.close();}
