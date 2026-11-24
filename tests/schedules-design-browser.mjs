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
  const page=await browser.newPage({viewport:{width:732,height:1200}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.evaluate(async()=>{
    const {spotSchedulesFixture}=await import('/tests/spot-schedules-fixture.mjs');
    window.design=spotSchedulesFixture();
    const attrs=design.hass.states[design.sensor].attributes;
    attrs.schedules=[['04:00',['tue'],['13','12'],false],['10:00',['tue','thu','sat','sun'],['13'],true],
      ['11:00',['mon'],['11'],false],['14:00',['wed'],['13'],false]].map(([time,days,room_ids,enabled],i)=>({
        ...attrs.schedules[0],schedule_id:201+i,time,days,room_ids,enabled,rooms:room_ids.map(id=>design.names[Number(id)-10])}));
    attrs.known=4;design.hass.states[design.sensor].state='4';
    document.querySelector('main').style.maxWidth='900px';
    demo.card.setConfig({...design.config,language:'en',show_camera:false});demo.card.hass={...design.hass};await demo.card.loadRegistry();
  });
  const card=page.locator('#card');
  await card.locator('#planning-tab-schedules').click();
  await mkdir('artifacts/schedules-design',{recursive:true});
  for(const theme of ['modern','classic'])for(const dark of [false,true])for(const width of [375,500,512,600,732]) {
    await page.setViewportSize({width,height:1200});
    await page.evaluate(({theme,dark})=>{
      document.body.classList.toggle('dark',dark);
      // Match the HA accent in the supplied reference, independently of the demo theme.
      document.body.style.setProperty('--primary-color','#00acc1');
      document.body.style.setProperty('--text-primary-color','#fff');
      demo.card.setConfig({...demo.card.config,theme});demo.card.hass={...design.hass};
    },{theme,dark});
    await card.locator('#planning-tab-schedules').click();
    assert.equal(await card.locator('.schedule-row').count(),4);
    assert.equal(await card.locator('[data-schedule-id="202"] .schedule-day.selected').count(),4);
    assert.equal(await card.locator('[data-schedule-id="201"] .schedule-day.selected').count(),1);
    const colors=await card.evaluate(el=>{
      const root=el.shadowRoot;
      const chipColor=id=>root.querySelector(`[data-schedule-id="${id}"] .schedule-room-chip`).style.getPropertyValue('--room-color');
      return [chipColor(201),chipColor(202),chipColor(204)];
    });
    assert.equal(new Set(colors).size,1,'the same room keeps its color across schedules');
    assert.equal(await card.locator('.schedule-list').evaluate(el=>el.scrollHeight<=el.clientHeight+1),true);
    assert.equal(await card.evaluate(el=>el.shadowRoot.querySelector('ha-card').scrollWidth>el.shadowRoot.querySelector('ha-card').clientWidth+1),false);
    const alignment=await card.locator('.schedule-row').first().evaluate(row=>{
      const time=row.querySelector('.schedule-time-value'),days=row.querySelector('.schedule-weekdays');
      const t=time.getBoundingClientRect(),d=days.getBoundingClientRect();
      return {sameLine:Math.abs(t.y+t.height/2-d.y-d.height/2)<1,after:d.left>=t.right,
        separator:getComputedStyle(time).borderRightWidth,overflow:row.scrollWidth>row.clientWidth+1};
    });
    if(width>=512) {
      assert.ok(alignment.sameLine && alignment.after,`weekdays follow the time at ${width}px: ${JSON.stringify(alignment)}`);
      assert.equal(alignment.separator,'1px','inline time keeps its vertical separator');
    }
    assert.equal(alignment.overflow,false,'the schedule row has no clipped weekdays');
    await card.screenshot({path:`artifacts/schedules-design/${theme}-${dark?'dark':'light'}-${width}.png`});
    await card.locator('[data-schedule-menu="204"]').click();
    assert.equal(await card.locator('.schedule-menu-panel').isVisible(),true);
    await card.locator('.schedule-menu-overlay').click({position:{x:30,y:30}});
    assert.equal(await card.locator('.schedule-menu-panel').count(),0,'outside click closes the menu');
    assert.equal(await page.evaluate(()=>design.calls.length),0,'visual navigation sends no actions');
  }
  // Follow continuous resizing through the wrap, rather than testing only fixed breakpoints.
  for(const theme of ['modern','classic']) {
    await page.evaluate(theme=>demo.card.setConfig({...demo.card.config,theme}),theme);
    await card.locator('#planning-tab-schedules').click();
    const sizes=[];
    for(let width=732;width>=372;width-=8) {
      await page.setViewportSize({width,height:1200});
      sizes.push(await card.locator('.schedule-row').first().evaluate(row=>{
        const time=row.querySelector('.schedule-time-value').getBoundingClientRect();
        const days=row.querySelector('.schedule-weekdays').getBoundingClientRect();
        const chips=[...row.querySelectorAll('.schedule-day')];
        const widths=chips.map(chip=>chip.getBoundingClientRect().width);
        const clipped=chips.some(chip=>{
          const range=document.createRange();range.selectNodeContents(chip);
          return range.getBoundingClientRect().width>chip.clientWidth+.5;
        });
        const menu=row.querySelector('[data-schedule-menu]').getBoundingClientRect();
        return {inline:Math.abs(time.y+time.height/2-days.y-days.height/2)<1,chip:widths[0],
          uniform:Math.max(...widths)-Math.min(...widths)<1,clipped,font:getComputedStyle(chips[0]).fontSize,
          menuInset:row.getBoundingClientRect().right-menu.right,gap:getComputedStyle(row.querySelector('.schedule-controls')).gap};
      }));
    }
    const wrap=sizes.findIndex(size=>!size.inline);
    assert.ok(wrap>0 && wrap<sizes.length-1,'resizing crosses one inline-to-stacked transition');
    assert.ok(sizes.slice(wrap).every(size=>!size.inline),'weekdays remain stacked after the transition');
    assert.ok(sizes[0].chip>sizes[wrap-1].chip+5,'side space shrinks before wrapping');
    assert.ok(sizes[wrap].chip>sizes[wrap-1].chip+5,'the new line gives the chips room to expand again');
    assert.ok(sizes[wrap].chip>sizes.at(-1).chip+5,'side space shrinks again as the stacked layout narrows');
    assert.ok(sizes.every(size=>size.uniform && !size.clipped),'all seven equally wide chips keep readable labels');
    assert.equal(new Set(sizes.map(size=>size.font)).size,1,'resizing adjusts space rather than label font size');
    assert.ok(sizes.every(size=>size.menuInset<=15.1 && size.menuInset>=8 && size.gap==='1px'),'controls sit farther right and closer together');
  }
  assert.deepEqual(errors,[]);
  console.log('Schedule design: reference-shaped cards, selected weekday states, stable room colors, responsive light/dark themes and outside menu dismissal passed.');
} finally {await browser?.close();server.close();}
