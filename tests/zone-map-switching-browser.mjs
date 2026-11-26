// Map changes are simulated; no commands reach a real robot.
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {previewServer} from '../scripts/preview.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=previewServer();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true});
try {
  for(const theme of ['modern','classic']) for(const width of [375,900]) {
    const page=await browser.newPage({viewport:{width,height:1100}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const card=page.locator('#card'),zone=card.locator('dyson-planner-zone');
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await card.locator('.room').first().waitFor();
    const images=await page.evaluate(()=>Object.fromEntries([
      ['1784483068',800,400,'#257595'],['1795646759',600,600,'#95652c']
    ].map(([id,width,height,color])=>{
      const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
      const ctx=canvas.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,width,height);
      ctx.strokeStyle='white';ctx.strokeRect(40,40,width-80,height-80);
      return [id,{width,height,png:canvas.toDataURL('image/png').split(',')[1]}];
    })));
    const calibrations={};
    for(const [id,image] of Object.entries(images)) {
      image.bytes=Buffer.from(image.png,'base64');
      calibrations[id]={version:1,units:'m',map_id:id,image_width:image.width,image_height:image.height,
        pixels_per_metre:80,padding:40,min_x:-1,max_y:2,image_sha256:createHash('sha256').update(image.bytes).digest('hex')};
    }
    const [a,b]=Object.keys(images);
    let imageMap=a,requests=0;
    await page.route('**/api/camera_proxy/**',route=>{
      requests++;return route.fulfill({body:images[imageMap].bytes,contentType:'image/png'});
    });
    await page.evaluate(()=>{
      window.zoneFixtureLoading=import('/tests/map-selection-fixture.mjs').then(m=>{window.zoneFixtureFactory=m.mapSelectionFixture;});
    });
    await page.waitForFunction(()=>typeof zoneFixtureFactory==='function');
    await page.evaluate(({theme,calibrations,a})=>{
      const f=zoneFixtureFactory();window.zoneDemo=f;f.card=demo.card;f.calibrations=calibrations;
      f.hass.hassUrl=path=>location.origin+path;
      f.hass.services.dyson_spot_scrub.clean_zone={};
      f.hass.states[f.entity].attributes.ready_to_start=true;
      f.hass.states[f.camera].attributes.map_calibration=calibrations[a];
      f.card.setConfig({...demo.card.config,theme,language:'en',show_camera:false});f.card.hass=f.hass;
      f.hass.callService=async(domain,service,data)=>{f.calls.push({domain,service,data});};
    },{theme,calibrations,a});
    await card.locator('[data-action="zones"]').click();
    await zone.locator('.area').waitFor({state:'visible'});
    await page.waitForFunction(()=>!zoneDemo.card.shadowRoot.querySelector('dyson-planner-zone').controller);
    assert.equal(await zone.locator('[data-do="start"]').isEnabled(),true);
    const edited=[.12,.16,.56,.82];
    await zone.evaluate((el,rect)=>{el.rect=rect;el.draw();window.originalMapZone=el;},edited);
    const beforeMenu=requests;
    await card.locator('.map-toggle').click();
    assert.equal(await zone.evaluate(el=>el===originalMapZone),true,'opening the menu retains the loaded component');
    assert.deepEqual(await zone.evaluate(el=>el.rect),edited);
    assert.equal(requests,beforeMenu,'header updates do not fetch the same map again');
    await card.locator(`[data-map-id="${b}"]`).click();
    await card.locator('.map-toggle.pending').waitFor();
    assert.equal(await zone.getAttribute('inert'),'');
    imageMap=b;
    await page.evaluate(b=>{const f=zoneDemo;f.applyMap(b);f.card.hass={...f.hass};},b);
    await page.waitForFunction(()=>!zoneDemo.card._mapRequest);
    assert.equal(await card.locator('[data-action="zones"]').getAttribute('aria-selected'),'true');
    assert.equal(await zone.evaluate(el=>el.rect),null,'the previous map selection is cleared immediately');
    assert.equal(await zone.locator('[data-do="start"]').isDisabled(),true);
    // Let the bounded image reads expire while the camera still publishes A's
    // calibration. A later matching HA update must recover without Reload.
    await page.waitForFunction(()=>{
      const el=zoneDemo.card.shadowRoot.querySelector('dyson-planner-zone');return el.attempted&&!el.controller;
    });
    assert.equal(await zone.evaluate(el=>el.calibration),null);
    const failedRequests=requests;
    await page.evaluate(()=>{zoneDemo.card.hass={...zoneDemo.hass};});
    assert.equal(requests,failedRequests,'unchanged telemetry does not create an automatic retry loop');
    await page.evaluate(b=>{
      const f=zoneDemo;f.hass.states[f.camera].attributes.map_calibration=f.calibrations[b];f.card.hass={...f.hass};
    },b);
    await zone.locator('.area').waitFor({state:'visible'});
    await page.waitForFunction(()=>!zoneDemo.card.shadowRoot.querySelector('dyson-planner-zone').controller);
    assert.equal(await zone.evaluate(el=>el.calibration.map_id),b);
    assert.deepEqual(await zone.evaluate(el=>[el.width,el.height]),[600,600]);
    assert.deepEqual(await zone.evaluate(el=>el.rect),[.3,.3,.7,.7]);
    assert.equal(await zone.locator('[data-do="start"]').isEnabled(),true);
    assert.equal(await card.locator('.header-notice').isHidden(),true);
    assert.deepEqual(await page.evaluate(()=>zoneDemo.calls.map(({domain,service})=>({domain,service}))),[{domain:'select',service:'select_option'}]);

    // App-driven switches, including temporary unknown IDs and session
    // states, retain the selected tab once the robot is ready again.
    for(const state of ['cleaning','paused','returning','error']) {
      imageMap=a;
      await page.evaluate(({a,state})=>{
        const f=zoneDemo;f.hass.states[f.entity].state=state;f.hass.states[f.entity].attributes.ready_to_start=false;
        f.hass.states[f.entity].attributes.map_id='0';f.card.hass={...f.hass};
        f.applyMap(a);f.hass.states[f.camera].attributes.map_calibration=f.calibrations[a];f.card.hass={...f.hass};
        f.hass.states[f.entity].state='idle';f.hass.states[f.entity].attributes.ready_to_start=true;f.card.hass={...f.hass};
      },{a,state});
      await zone.locator('.area').waitFor({state:'visible'});
      await page.waitForFunction(()=>!zoneDemo.card.shadowRoot.querySelector('dyson-planner-zone').controller);
      assert.equal(await card.locator('[data-action="zones"]').getAttribute('aria-selected'),'true');
      assert.equal(await zone.evaluate(el=>el.calibration.map_id),a);
      assert.deepEqual(await zone.evaluate(el=>el.rect),[.3,.3,.7,.7]);
      imageMap=b;
      await page.evaluate(b=>{
        const f=zoneDemo;f.applyMap(b);f.hass.states[f.camera].attributes.map_calibration=f.calibrations[b];f.card.hass={...f.hass};
      },b);
      await page.waitForFunction(b=>{
        const el=zoneDemo.card.shadowRoot.querySelector('dyson-planner-zone');return el.calibration?.map_id===b&&!el.controller;
      },b);
    }
    assert.equal(await zone.locator('[data-do="start"]').isEnabled(),true);
    assert.deepEqual(errors,[]);await page.close();
  }
  console.log('Zone map-switch checks passed: both themes, 375/900 px, retained tab/component, fresh PNG/calibration, cleared geometry, late readback and app/session transitions.');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
