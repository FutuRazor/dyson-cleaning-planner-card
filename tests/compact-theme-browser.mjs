import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server=previewServer();
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({channel:'msedge'});
try {
 const page=await browser.newPage({viewport:{width:1100,height:1100}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/`);
 await page.locator('#card .rooms').waitFor();
 for(const width of [482,560,700,1000]) {
  for(const count of [1,2,4,5]) {
   await page.evaluate(({width,count})=>{
    document.querySelector('main').style.maxWidth=`${width}px`;
    document.body.classList.add('dark');
    demo.card.setConfig({...demo.card.config,theme:'modern',excluded_rooms:demo.ids.slice(count)});
   },{width,count});
   const card=page.locator('#card');
   await card.locator('[data-expand]').first().click();
   await card.locator('.fields:visible [data-setting=cleaning_mode]').selectOption('Vacuum and Mop');
   const panel=await card.locator('.fields:visible').boundingBox();
   const rows=await card.locator('.room-head').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}}));
   assert.ok(panel.x>=rows[0].x+rows[0].width,`${width}: side panel`);
   for(let i=1;i<rows.length;i++) assert.ok(Math.abs(rows[i].y-rows[i-1].y-rows[i-1].height-10)<1,`${width}/${count}: constant room gap`);
   if(count<=4) assert.ok(panel.height<420,`${width}/${count}: compact panel ${panel.height}`);
   assert.ok(await card.evaluate(el=>el.shadowRoot.querySelector('.planner-content').scrollWidth<=el.clientWidth),`${width}: no horizontal overflow`);
   if(count===4 && (width===482 || width===1000)) await page.screenshot({path:`compact-${width}.png`,fullPage:true});
  }
 }
 await page.evaluate(()=>document.querySelector('main').style.maxWidth='460px');
 const panel=await page.locator('#card .fields:visible').boundingBox();
 const row=await page.locator('#card .room-head').first().boundingBox();
 assert.ok(panel.y>=row.y+row.height-1,'narrow cards keep inline settings');
 assert.deepEqual(errors,[]);
 console.log('Compact layout verified at 482/560/700/1000 px with 1/2/4/5 rooms; inline layout below breakpoint.');
} finally {await browser.close();server.close();}
