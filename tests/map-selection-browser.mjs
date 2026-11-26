import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {previewServer} from '../scripts/preview.mjs';
const {chromium,webkit}=createRequire(import.meta.url)('playwright');
const server=previewServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  const engine=process.env.BROWSER_ENGINE==='webkit'?webkit:chromium;
  browser=await engine.launch({headless:true,...(engine===chromium&&process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  await mkdir('artifacts/map-selection',{recursive:true});
  for(const theme of ['modern','classic']) for(const width of [375,900]) {
    const page=await browser.newPage({viewport:{width,height:1100}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(15000);page.setDefaultNavigationTimeout(60000);
    await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'domcontentloaded'});
    const card=page.locator('#card');await card.locator('.room').first().waitFor();
    await page.evaluate(()=>{
      window.mapFixtureLoading=import('/tests/map-selection-fixture.mjs').then(module=>{window.mapFixtureFactory=module.mapSelectionFixture;});
    });
    await page.waitForFunction(()=>typeof window.mapFixtureFactory==='function');
    await page.evaluate(theme=>{
      const f=window.mapFixtureFactory();window.mapsDemo=f;
      f.card=demo.card;f.hass.hassUrl=demo.hass.hassUrl;
      f.card.setConfig({...demo.card.config,theme,language:'en',show_camera:false});
      f.card.hass=f.hass;
      window.mapTransport='wait';
      f.hass.callService=async(domain,service,data)=>{
        f.calls.push({domain,service,data});
        if(mapTransport==='reject')throw new Error('Map switch rejected');
        if(mapTransport==='hold')await new Promise(resolve=>window.releaseMapTransport=resolve);
        if(mapTransport==='immediate'){f.applyMap('1795646759');f.card.hass={...f.hass};}
      };
      return true;
    },theme);
    await card.locator('.map-toggle').waitFor();
    await page.clock.install();
    await card.locator('.map-toggle').click();
    assert.deepEqual(await card.locator('.map-menu button span').allTextContents(),['Wohnung','Dachboden']);
    assert.equal(await card.locator('[data-map-id="1784483068"]').getAttribute('aria-checked'),'true');
    const geometry=await card.locator('.map-menu').boundingBox();
    assert.ok(geometry.x>=0&&geometry.x+geometry.width<=width);
    await page.screenshot({path:`artifacts/map-selection/${theme}-${width}.png`,fullPage:true});
    await page.locator('.demo').click();assert.equal(await card.locator('.map-menu').count(),0);
    await card.locator('.map-toggle').click();
    await page.keyboard.press('Escape');assert.equal(await card.locator('.map-menu').count(),0);
    assert.equal(await card.locator('.map-toggle').evaluate(el=>el===el.getRootNode().activeElement),true);
    // Dismissing the menu must preserve native checkbox/label activation.
    await card.locator('.map-toggle').click();
    const roomInput=card.locator('input[data-room]').first(),roomId=await roomInput.getAttribute('data-room');
    await roomInput.click({force:true});
    assert.deepEqual(await page.evaluate(()=>mapsDemo.card.selected),[roomId],'one checkbox click selects the room');
    assert.equal(await card.locator('.map-menu').count(),0);
    await card.locator('.map-toggle').click();
    // The open popup can overlap the middle of a Classic room label.
    await card.locator('.room .pick').first().click({position:{x:5,y:20}});
    assert.deepEqual(await page.evaluate(()=>mapsDemo.card.selected),[],'one label click deselects the room');
    assert.equal(await card.locator('.map-menu').count(),0);
    await card.locator('.map-toggle').click();await card.locator('[data-map-id="1795646759"]').click();
    await card.locator('.map-toggle.pending').waitFor();
    assert.equal(await card.locator('.rooms').getAttribute('inert'),'');
    assert.equal(await page.evaluate(()=>mapsDemo.card.view.active),false,'map switching is not a pending clean');
    await page.evaluate(async()=>{await mapsDemo.card.start();await mapsDemo.card.save();});
    assert.equal(await page.evaluate(()=>mapsDemo.calls.length),1);
    await page.evaluate(()=>{
      const f=mapsDemo;f.hass.states[f.mapSelect].state='Dachboden';f.hass.states[f.mapSelect].attributes.map_id='1795646759';f.card.hass={...f.hass};
    });
    assert.equal(await card.locator('.map-toggle.pending').count(),1,'vacuum readback is also required');
    await page.evaluate(()=>{mapsDemo.applyMap('1795646759');mapsDemo.card.hass={...mapsDemo.hass};});
    await page.waitForFunction(()=>!mapsDemo.card._mapRequest);
    assert.deepEqual((await card.locator('.name').allTextContents()).map(text=>text.trim()),['Büro']);
    assert.equal(await card.locator('.map-toggle').getAttribute('aria-label'),'Switch map: Dachboden');
    assert.deepEqual(await page.evaluate(()=>mapsDemo.calls),[{domain:'select',service:'select_option',data:{entity_id:'select.renamed_saved_map',option:'Dachboden'}}]);

    // App deletion returns to A, removes B from the menu and retains A's room entities.
    await card.locator('.map-toggle').click();
    await page.evaluate(()=>{
      const f=mapsDemo;f.applyMap('1784483068');f.maps.splice(1,1);
      f.hass.states[f.mapSelect].attributes.options=['Wohnung'];f.card.hass={...f.hass};
    });
    assert.equal(await card.locator('.map-toggle').count(),0,'one saved map needs no switch button');
    assert.equal(await card.locator('.map-menu').count(),0,'removing the second map closes an open menu');
    assert.equal(await page.evaluate(()=>mapsDemo.card.mapMenuOpen),false);
    await page.evaluate(()=>{
      const f=mapsDemo;f.maps.push({map_id:'1795646759',name:'Dachboden',option:'Dachboden'});
      f.hass.states[f.mapSelect].attributes.options.push('Dachboden');
      f.card.selected=[f.ids[0]];f.card.updateDirty();f.card.render();
    });
    assert.equal(await card.locator('.map-toggle').count(),1,'adding a second map restores the button');
    assert.equal(await card.locator('.map-menu').count(),0,'a previously open menu is not reopened');
    await card.locator('.map-toggle').click();
    assert.match(await card.locator('.map-menu-note').textContent(),/Discard local room changes/);
    assert.equal(await card.locator('[data-map-id="1795646759"]').isDisabled(),true);
    await page.keyboard.press('Escape');
    await page.evaluate(()=>{mapsDemo.card.resetDraft();mapsDemo.card.render();});

    // Timeout keeps the observed map, sends no retry and accepts later readback.
    await card.locator('.map-toggle').click();await card.locator('[data-map-id="1795646759"]').click();
    await card.locator('.map-toggle.pending').waitFor();
    await page.clock.runFor(10001);await page.waitForFunction(()=>!mapsDemo.card._mapRequest);
    assert.match(await card.locator('.header-notice-copy').textContent(),/has not been confirmed/);
    assert.equal(await page.evaluate(()=>mapsDemo.calls.length),2);
    await page.evaluate(()=>{mapsDemo.applyMap('1795646759');mapsDemo.card.hass={...mapsDemo.hass};});
    assert.equal(await card.locator('.header-notice').getAttribute('hidden'),'');

    // Backend rejection preserves the reported map and sends no retry.
    await page.evaluate(()=>{
      mapsDemo.applyMap('1784483068');mapsDemo.card.hass={...mapsDemo.hass};window.mapTransport='reject';
    });
    await card.locator('.map-toggle').click();await card.locator('[data-map-id="1795646759"]').click();
    await page.waitForFunction(()=>!mapsDemo.card._mapRequest);
    assert.match(await card.locator('.header-notice-copy').textContent(),/Map switch rejected/);
    assert.equal(await page.evaluate(()=>mapsDemo.calls.length),3);
    assert.equal(await page.evaluate(()=>mapsDemo.hass.states[mapsDemo.entity].attributes.map_id),'1784483068');
    await page.evaluate(()=>{mapsDemo.applyMap('1795646759');mapsDemo.card.hass={...mapsDemo.hass};});
    assert.equal(await card.locator('.header-notice').getAttribute('hidden'),'','late telemetry clears the rejected-service notice');

    // Old request completion cannot change a reconfigured card.
    await page.evaluate(()=>{
      mapsDemo.applyMap('1784483068');mapsDemo.card.hass={...mapsDemo.hass};window.mapTransport='hold';
    });
    await card.locator('.map-toggle').click();await card.locator('[data-map-id="1795646759"]').click();
    await page.waitForFunction(()=>!!window.releaseMapTransport);
    await page.evaluate(()=>{
      const f=mapsDemo;f.card.setConfig({...f.card.config,title:'New configuration'});window.releaseMapTransport();
    });
    assert.equal(await page.evaluate(()=>mapsDemo.card._mapRequest),null);
    assert.equal(await card.locator('.map-toggle.pending').count(),0);
    await page.evaluate(()=>{window.releaseMapTransport=null;});
    await card.locator('.map-toggle').click();await card.locator('[data-map-id="1795646759"]').click();
    await page.waitForFunction(()=>!!window.releaseMapTransport);
    await page.evaluate(()=>{
      const element=mapsDemo.card,parent=element.parentElement;element.remove();parent.append(element);window.releaseMapTransport();
    });
    assert.equal(await page.evaluate(()=>mapsDemo.card._mapRequest),null);
    assert.equal(await card.locator('.map-toggle.pending').count(),0);
    assert.deepEqual(errors,[]);
    await page.close();
  }
  console.log('Saved-map browser checks passed: both themes, 375/900 px, readback, deletion, drafts, locks, timeout, late state and lifecycle.');
} finally {await browser?.close();server.close();}
