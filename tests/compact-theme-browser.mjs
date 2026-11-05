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
   const fullHeight=await card.evaluate(el=>el.getBoundingClientRect().height);
   for(const mode of ['Vacuum','Mop','Vacuum then Mop']) {
    await card.locator('.fields:visible [data-setting=cleaning_mode]').selectOption(mode);
    const next=await card.locator('.fields:visible').boundingBox();
    assert.ok(Math.abs(next.height-panel.height)<1,`${width}/${count}/${mode}: stable settings height`);
    if(mode !== 'Vacuum then Mop') {
     const layout=await card.locator('.fields:visible').evaluate(el=>{
      const fields=[...el.children].filter(e=>!e.classList.contains('mode-spacer'));
      const boxes=fields.map(e=>e.getBoundingClientRect());
      return {gaps:[boxes[1].top-boxes[0].bottom,boxes[2].top-boxes[1].bottom],bottom:el.getBoundingClientRect().bottom-boxes[2].bottom};
     });
     assert.ok(Math.abs(layout.gaps[0]-layout.gaps[1])<1,'three controls have equal spacing');
     assert.ok(layout.bottom>11,'three controls retain extra bottom space');
    }
    assert.ok(Math.abs(await card.evaluate(el=>el.getBoundingClientRect().height)-fullHeight)<1,`${width}/${count}/${mode}: stable card height`);
   }
   const head=card.locator('.room-head').first();
   await head.locator('.name').click();
   assert.equal(await head.locator('[data-room]').isChecked(),false,'name opens settings without selection');
   await head.locator('.summary').click();
   const circle=await head.locator('.selection-circle').boundingBox();
   await page.mouse.click(circle.x+circle.width/2,circle.y+circle.height/2);
   assert.equal(await head.locator('[data-room]').isChecked(),true,'circle selects room');
   assert.equal(await head.locator('[data-expand]').getAttribute('aria-expanded'),'true','circle preserves expansion');
   const touch=await head.locator('.pick').boundingBox();
   assert.ok(touch.width>=44 && touch.height>=44,'selection touch target');
   assert.equal(await card.locator('.fields:visible .segments button').first().evaluate(el=>el.getBoundingClientRect().height),32);
   const rows=await card.locator('.room-head').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}}));
   assert.ok(panel.x>=rows[0].x+rows[0].width,`${width}: side panel`);
   for(let i=1;i<rows.length;i++) assert.ok(Math.abs(rows[i].y-rows[i-1].y-rows[i-1].height-10)<1,`${width}/${count}: constant room gap`);
   if(count<=4) assert.ok(panel.height<420,`${width}/${count}: compact panel ${panel.height}`);
   if(count===4) assert.ok(Math.abs(panel.y+panel.height-(rows[3].y+rows[3].height))<1,'settings align with four room rows');
   if(count===5) {
    assert.ok(rows.every(r=>r.height>=52),'five room tiles retain their minimum height');
    assert.ok(Math.abs(panel.y+panel.height-(rows[4].y+rows[4].height))<1,'five rooms align with settings bottom');
    assert.ok(Math.max(...rows.map(r=>r.height))-Math.min(...rows.map(r=>r.height))<1,'five tiles have equal heights');
    assert.ok(rows[4].y+rows[4].height-rows[0].y<420,'five rooms remain compact');
   }
   assert.ok(await card.evaluate(el=>el.shadowRoot.querySelector('.planner-content').scrollWidth<=el.clientWidth),`${width}: no horizontal overflow`);
   if(count===4 && (width===482 || width===1000)) await page.screenshot({path:`compact-${width}.png`,fullPage:true});
  }
 }
 await page.evaluate(()=>document.querySelector('main').style.maxWidth='460px');
 const panel=await page.locator('#card .fields:visible').boundingBox();
 const row=await page.locator('#card .room-head').first().boundingBox();
 assert.ok(panel.y>=row.y+row.height-1,'narrow cards keep inline settings');
 const fullMobile=panel.height;
 await page.locator('#card .fields:visible [data-setting=cleaning_mode]').selectOption('Vacuum');
 assert.ok((await page.locator('#card .fields:visible').boundingBox()).height<fullMobile,'mobile remains content-sized');
 assert.deepEqual(errors,[]);
 console.log('Compact layout verified at 482/560/700/1000 px with 1/2/4/5 rooms; inline layout below breakpoint.');
} finally {await browser.close();server.close();}
