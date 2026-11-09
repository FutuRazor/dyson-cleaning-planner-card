// Offline browser coverage; the only service calls go to the preview fixture.
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium, webkit } = createRequire(import.meta.url)('playwright');
const server = previewServer();
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const useWebkit = process.env.ZONE_BROWSER === 'webkit';
const browser = useWebkit ? await webkit.launch({headless:true}) : await chromium.launch({headless:true,channel:'msedge'});
try {
  const page = await browser.newPage({viewport:{width:900,height:1100},hasTouch:true});
  const errors = []; page.on('pageerror',e => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.locator('#card .room').first().waitFor();
  const png = Buffer.from(await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width=800; canvas.height=400;
    const ctx=canvas.getContext('2d'); ctx.fillStyle='#20252b'; ctx.fillRect(0,0,800,400);
    ctx.strokeStyle='#73d5f5'; ctx.strokeRect(80,60,640,280);
    ctx.beginPath(); ctx.moveTo(400,60); ctx.lineTo(400,340); ctx.stroke();
    return canvas.toDataURL('image/png').split(',')[1];
  }),'base64');
  const hash = createHash('sha256').update(png).digest('hex');
  // The integration currently inherits HA's JPEG content type for PNG data.
  await page.route('**/api/camera_proxy/**',route => route.fulfill({body:png,contentType:'image/jpeg'}));
  await page.evaluate(hash => {
    demo.hass.hassUrl = path => location.origin+path;
    demo.hass.services.dyson_spot_scrub.clean_zone = {};
    Object.assign(demo.hass.states[demo.entity].attributes,{map_id:'123',ready_to_start:true});
    demo.hass.states[demo.camera].attributes.map_calibration={version:1,units:'m',map_id:'123',image_width:800,image_height:400,pixels_per_metre:80,padding:40,min_x:-1,max_y:2,image_sha256:hash};
    demo.card.hass={...demo.hass};
  },hash);
  await page.locator('#card input[data-room]').first().check();
  const selection=await page.evaluate(() => [...demo.card.selected]);
  for (const rotation of [0,90,180,270]) {
    await page.evaluate(rotation => { demo.card.config.camera_rotation=rotation; demo.card.render(); },rotation);
    await page.locator('[data-action="zones"]').click();
    const zone=page.locator('dyson-planner-zone');
    await zone.locator('[data-do="add"]').click();
    assert.equal(await zone.locator('[data-do="start"]').isEnabled(),true);
    // Telemetry updates preserve both the component and the local rectangle.
    await page.evaluate(() => {
      const zone=demo.card.shadowRoot.querySelector('dyson-planner-zone'); window.originalZone=zone;
      demo.card.hass={...demo.hass};
      if (zone!==demo.card.shadowRoot.querySelector('dyson-planner-zone')) throw new Error('Zone remounted');
    });
    const box=await zone.locator('.area').boundingBox();
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2); await page.mouse.down();
    await page.mouse.move(box.x+box.width/2+20,box.y+box.height/2+15); await page.mouse.up();
    assert.notDeepEqual(await zone.evaluate(el=>el.rect),[.3,.3,.7,.7]);
    await zone.locator('.handle').focus(); await page.keyboard.press('ArrowRight');
    assert.equal(await zone.locator('[data-do="start"]').isEnabled(),true);
    await zone.locator('[data-do="back"]').click();
    assert.deepEqual(await page.evaluate(()=>demo.card.selected),selection);
  }
  await page.setViewportSize({width:390,height:1000});
  await page.locator('[data-action="zones"]').click();
  const zone=page.locator('dyson-planner-zone');
  await zone.locator('[data-do="add"]').click();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const client = useWebkit ? null : await page.context().newCDPSession(page);
  const touchEvent = async data => {
    if (client) return client.send('Input.dispatchTouchEvent', data);
    if (data.type === 'touchEnd') return page.mouse.up();
    await page.mouse.move(data.touchPoints[0].x, data.touchPoints[0].y);
    if (data.type === 'touchStart') await page.mouse.down();
  };
  const touchBox = await zone.locator('.area').boundingBox();
  const x=touchBox.x+touchBox.width/2, y=touchBox.y+touchBox.height/2;
  await touchEvent({type:'touchStart',touchPoints:[{x,y}]});
  await touchEvent({type:'touchMove',touchPoints:[{x:x+15,y:y+20}]});
  await touchEvent({type:'touchEnd',touchPoints:[]});
  assert.notDeepEqual(await zone.evaluate(el=>el.rect),[.3,.3,.7,.7]);
  const beforeResize = await zone.evaluate(el=>[...el.rect]);
  await zone.locator('.handle').scrollIntoViewIfNeeded();
  const handleBox = await zone.locator('.handle').boundingBox();
  const hx=handleBox.x+handleBox.width/2,hy=handleBox.y+handleBox.height/2;
  await touchEvent({type:'touchStart',touchPoints:[{x:hx,y:hy}]});
  await touchEvent({type:'touchMove',touchPoints:[{x:hx+20,y:hy+15}]});
  await touchEvent({type:'touchEnd',touchPoints:[]});
  const afterResize = await zone.evaluate(el=>el.rect);
  assert.equal(beforeResize[0],afterResize[0]); assert.ok(afterResize[2]>beforeResize[2]);
  await client?.detach();
  // Keep the last edited SVG handle focused, then scroll to Start. Repeated HA
  // updates must neither rewrite the SVG nor bring it back into view on Safari.
  await zone.locator('.handle').focus();
  await zone.locator('[data-do="start"]').scrollIntoViewIfNeeded();
  const scrollCheck = await zone.evaluate(async el => {
    let geometryMutations = 0;
    const observer = new MutationObserver(rows => { geometryMutations += rows.length; });
    observer.observe(el.svg,{attributes:true,childList:true,subtree:true,characterData:true});
    const before = window.scrollY;
    const rect = [...el.rect];
    for (let i=0;i<5;i++) {
      demo.card.hass={...demo.hass};
      await new Promise(resolve=>setTimeout(resolve,250));
    }
    observer.disconnect();
    return {before,after:window.scrollY,geometryMutations,sameRect:JSON.stringify(rect)===JSON.stringify(el.rect)};
  });
  assert.equal(scrollCheck.geometryMutations,0,'telemetry must not rewrite frozen SVG geometry');
  assert.equal(scrollCheck.after,scrollCheck.before,'telemetry must preserve page scroll');
  assert.ok(scrollCheck.sameRect);
  await mkdir(new URL('../artifacts/',import.meta.url),{recursive:true});
  await page.locator('#card').screenshot({path:new URL('../artifacts/zone-mobile.png',import.meta.url).pathname.replace(/^\/(.:)/,'$1')});
  await page.evaluate(()=>{ demo.hass.states[demo.entity].attributes.ready_to_start=false; demo.card.hass={...demo.hass}; });
  assert.equal(await zone.locator('[data-do="start"]').isDisabled(),true);
  await page.evaluate(()=>{ demo.hass.states[demo.entity].attributes.ready_to_start=true; demo.card.hass={...demo.hass}; });
  await zone.locator('[data-do="start"]').click();
  await page.locator('#card h2').filter({hasText:'Cleaning session'}).waitFor();
  const calls=await page.evaluate(()=>demo.calls.filter(c=>c.service==='clean_zone'));
  assert.equal(calls.length,1); assert.equal(calls[0].data.map_id,'123'); assert.equal(calls[0].data.rectangle.length,4);
  assert.equal(calls[0].data.entity_id,await page.evaluate(()=>demo.entity));
  // Simulate session completion, then reject a stale calibration and map switch.
  await page.evaluate(()=>{demo.card.clearPendingStart(); demo.card.update();});
  await page.locator('[data-action="zones"]').click(); await zone.locator('[data-do="add"]').click();
  await page.evaluate(()=>{demo.hass.states[demo.entity].attributes.map_id='456'; demo.card.hass={...demo.hass};});
  assert.equal(await zone.locator('[data-do="start"]').isDisabled(),true);
  assert.equal(await zone.evaluate(el=>el.rect),null);
  await page.evaluate(()=>{
    demo.hass.states[demo.entity].attributes.map_id='123';
    demo.hass.states[demo.camera].attributes.map_calibration.image_sha256='0'.repeat(64);
    demo.card.hass={...demo.hass};
  });
  await zone.locator('[data-do="refresh"]').click();
  await zone.locator('.message').filter({hasText:'Image and calibration do not match'}).waitFor();
  assert.equal(await zone.locator('[data-do="start"]').isDisabled(),true);
  assert.equal(await zone.locator('[data-do="add"]').isDisabled(),true);
  assert.deepEqual(errors,[]);
  console.log('Zone browser checks passed: rotation, dragging, keyboard resize, mobile, draft, guards, action.');
} finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
