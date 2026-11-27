import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { previewServer } from '../scripts/preview.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = previewServer();
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser = await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL ? {channel:process.env.BROWSER_CHANNEL} : {})});
  const page = await browser.newPage({viewport:{width:900,height:1200}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const card=page.locator('#card');await card.locator('.room').first().waitFor();
  await page.evaluate(async()=>{
    const {schedulesFixture}=await import('/tests/schedules-fixture.mjs');
    window.sched=schedulesFixture();
    window.setScheduleCount=count=>{
      const state=sched.hass.states[sched.sensor];
      state.state=String(count);state.attributes.robot_total=count;
      state.attributes.schedules=Array.from({length:count},(_,index)=>({schedule_id:201+index,enabled:index%2===0,
        days:index%2 ? ['mon','tue','wed','thu','fri','sat','sun'] : ['tue','thu','sat','sun'],
        time:`${String(6+index).padStart(2,'0')}:00`,repeat:true,rooms:['Kitchen','Hall']}));
      demo.card.hass={...sched.hass};
    };
    demo.card.setConfig({...sched.config,language:'en',show_camera:false});demo.card.hass={...sched.hass};
    await demo.card.loadRegistry();
  });
  const geometry=()=>card.evaluate(el=>{
    const root=el.shadowRoot,list=root.querySelector('.schedule-list'),rows=[...list.querySelectorAll('.schedule-row')];
    const box=node=>{const r=node.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
    return {card:box(root.querySelector('ha-card')),list:box(list),scrollHeight:list.scrollHeight,clientHeight:list.clientHeight,
      scrollTop:list.scrollTop,header:box(root.querySelector('.planning-tabs')),firstFour:rows.slice(0,4).reduce((height,row)=>height+row.getBoundingClientRect().height,0)+3*parseFloat(getComputedStyle(list).rowGap),
      controls:rows.map(row=>({row:box(row),menu:box(row.querySelector('[data-schedule-menu]')),
        target:box(row.querySelector('.schedule-toggle-target')),circle:box(row.querySelector('.selection-circle')),
        dots:box(row.querySelector('.schedule-menu-trigger svg'))})),
      overflow:rows.some(row=>row.scrollWidth>row.clientWidth+1),days:rows.map(row=>row.querySelectorAll('.schedule-day').length)};
  });
  for(const theme of ['modern','classic']) for(const width of [375,900]) {
    await page.setViewportSize({width,height:1200});
    await page.evaluate(theme=>demo.card.setConfig({...demo.card.config,theme}),theme);
    await card.locator('[data-action="schedules"]').click();
    await page.evaluate(()=>setScheduleCount(3));const three=await geometry();
    await page.evaluate(()=>setScheduleCount(4));const four=await geometry();
    assert.ok(four.card.h>three.card.h,'card grows naturally up to four schedules');
    assert.ok(four.scrollHeight<=four.clientHeight+1,'four schedules fit without scrolling');
    await page.evaluate(()=>setScheduleCount(5));const five=await geometry();
    await page.evaluate(()=>setScheduleCount(8));const eight=await geometry();
    for(const measured of [five,eight]) {
      assert.ok(Math.abs(measured.card.h-four.card.h)<=1,JSON.stringify({theme,width,four:four.card.h,current:measured.card.h}));
      assert.ok(Math.abs(measured.list.h-measured.firstFour)<=1,'viewport fits the first four schedules');
      assert.ok(measured.scrollHeight>measured.clientHeight,'only the schedule list overflows');
      assert.ok(measured.controls.every(({row,menu,target,circle,dots})=>target.right<=menu.x
        && target.w>=44 && Math.abs(target.h-row.h+2)<1
        && Math.abs(circle.y+circle.h/2-(row.y+row.h/2))<1
        && Math.abs(dots.y+dots.h/2-(row.y+row.h/2))<1
        && row.right-dots.right<=5.1),'circle and dots are centered, the toggle target fills the row height and dots sit at the right edge');
      assert.equal(measured.overflow,false,'schedule cards fit without horizontal overflow');
      assert.ok(measured.days.every(count=>count===7),'all seven weekday badges are shown');
    }
    await card.locator('.schedule-list').hover();
    // Hover may first bring the list into the browser viewport; measure after that.
    const beforeWheel=await geometry();await page.mouse.wheel(0,1800);
    await page.waitForFunction(()=>demo.card.shadowRoot.querySelector('.schedule-list').scrollTop>0);
    const scrolled=await geometry();assert.ok(Math.abs(scrolled.header.y-beforeWheel.header.y)<1,'tabs stay in place when scrolling schedules');
    const saved=await card.locator('.schedule-list').evaluate(el=>{el.scrollTop=el.scrollHeight;return el.scrollTop;});
    await page.evaluate(()=>{demo.card.hass={...sched.hass};});
    assert.ok(Math.abs((await geometry()).scrollTop-saved)<2,'HA updates retain scroll position');
    await card.locator('[data-schedule-menu="208"]').click();
    const menuBounds=await card.evaluate(el=>{
      const card=el.shadowRoot.querySelector('ha-card').getBoundingClientRect(),menu=el.shadowRoot.querySelector('.schedule-menu-panel').getBoundingClientRect();
      return menu.left>=card.left && menu.right<=card.right && menu.top>=card.top && menu.bottom<=card.bottom;
    });
    assert.equal(menuBounds,true,'last-row menu fits within the card and outside the scrolling list');
    await page.keyboard.press('End');
    assert.equal(await card.locator('[data-schedule-delete="208"]').evaluate(el=>el===el.getRootNode().activeElement),true);
    await page.keyboard.press('Escape');
    assert.equal(await card.locator('[data-schedule-menu="208"]').evaluate(el=>el===el.getRootNode().activeElement),true,'Escape returns focus to the menu button');
    await page.keyboard.press('ArrowDown');
    assert.equal(await card.locator('[data-schedule-edit="208"]').evaluate(el=>el===el.getRootNode().activeElement),true,'ArrowDown opens the menu at Edit');
    await page.evaluate(()=>{demo.card.hass={...sched.hass};});
    assert.equal(await card.locator('.schedule-menu-panel').isVisible(),true,'HA updates preserve an open menu');
    await card.locator('[data-schedule-edit="208"]').click();
    assert.equal(await card.locator('#schedule-time-value').innerText(),'13:00');
    await page.keyboard.press('Escape');
    assert.ok((await geometry()).scrollTop>0,'closing Edit retains list scroll position');
    await page.evaluate(()=>setScheduleCount(2));
    const reduced=await geometry();assert.ok(reduced.scrollHeight<=reduced.clientHeight+1,'short lists expand naturally after deletion');
  }
  // Resize a populated view without rebuilding card configuration.
  await page.evaluate(()=>setScheduleCount(8));
  await page.setViewportSize({width:375,height:1200});
  await page.waitForFunction(()=>{
    const list=demo.card.shadowRoot.querySelector('.schedule-list');
    const height=[...list.children].slice(0,4).reduce((n,row)=>n+row.getBoundingClientRect().height,0)+3*parseFloat(getComputedStyle(list).rowGap);
    return Math.abs(list.getBoundingClientRect().height-height)<=1;
  });
  await mkdir('artifacts/schedules',{recursive:true});
  await card.screenshot({path:'artifacts/schedules/scroll-mobile.png'});
  assert.deepEqual(errors,[]);
  console.log('Schedule layout: centered circles/dots, full-height toggle targets, weekday badges, bounded menus, keyboard, four-row limit, scroll preservation and resizing passed in both themes at mobile/desktop widths.');
} finally {await browser?.close();server.close();}
