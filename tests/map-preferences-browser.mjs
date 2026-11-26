// Local map visibility, ordering and chips, using simulated HA only.
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {previewServer} from '../scripts/preview.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=previewServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true});
const a='1784483068',b='1795646759',c='2222222222',d='3333333333';
try {
  await mkdir('artifacts/map-preferences',{recursive:true});
  for(const theme of ['modern','classic'])for(const width of [375,900]) {
    const page=await browser.newPage({viewport:{width,height:1100}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    const card=page.locator('#card');await card.locator('.room').first().waitFor();
    await page.evaluate(()=>{
      window.mapPreferencesLoading=Promise.all([import('/tests/map-selection-fixture.mjs'),import('/tests/spot-schedules-fixture.mjs')])
        .then(([maps,schedules])=>{window.mapPreferencesFactories={maps:maps.mapSelectionFixture,schedules:schedules.spotSchedulesFixture};});
    });
    await page.waitForFunction(()=>!!window.mapPreferencesFactories);
    await page.evaluate(({theme,a,b,c})=>{
      const f=mapPreferencesFactories.maps(),s=mapPreferencesFactories.schedules();window.mapPrefs=f;
      f.card=demo.card;f.sensor=s.sensor;f.hass.config=s.hass.config;
      f.registry.push(s.registry.find(row=>row.entity_id===s.sensor));
      f.hass.states[f.sensor]=s.hass.states[s.sensor];
      f.hass.services.dyson_spot_scrub.set_schedule={};f.hass.services.dyson_spot_scrub.delete_schedule={};
      f.orders=f.hass.states[f.sensor].attributes.schedules;
      f.orders.forEach(order=>{order.map_id=a;});
      f.maps[0].name=f.maps[0].option='Erdgeschoss mit Küche und Wohnbereich';
      f.maps[1].name=f.maps[1].option='Obergeschoss mit außergewöhnlich langem Etagennamen';
      f.maps.push({map_id:c,name:'Keller',option:'Keller'});
      f.hass.states[f.mapSelect].attributes.options=f.maps.map(map=>map.option);
      f.hass.hassUrl=path=>location.origin+path;
      const read=f.hass.callWS;f.registryReads=0;
      f.hass.callWS=message=>{if(message.type==='config/entity_registry/list')f.registryReads++;return read(message);};
      f.hass.callService=async(domain,service,data)=>{f.calls.push({domain,service,data});};
      f.report=id=>{
        f.applyMap(id);
        const source=f.hass.states[f.sensor],orders=id===a?f.orders:[];
        Object.assign(source.attributes,{map_id:id,schedules:orders,known:orders.length,on:orders.filter(order=>order.enabled).length,unknown:0,in_sync:true});
        source.state=String(orders.length);f.card.hass={...f.hass};
        if(f.editor?.isConnected)f.editor.hass={...f.hass};
      };
      f.card.setConfig({...f.config,theme,language:'en',show_camera:false,map_selector_style:'chips',excluded_maps:[c],map_order:[b,a,'999999999']});
      f.report(a);
    },{theme,a,b,c});
    const chips=card.locator('.map-chip');await chips.first().waitFor();
    assert.equal(await chips.count(),2);assert.equal(await card.locator('.map-toggle').count(),0);
    assert.deepEqual(await chips.evaluateAll(items=>items.map(el=>el.dataset.mapId)),[b,a],'YAML order applies to the chips');
    assert.equal(await card.locator(`[data-map-id="${a}"]`).getAttribute('aria-pressed'),'true');
    const bar=await card.locator('.map-chips').boundingBox(),tabs=await card.locator('.planning-tabs').boundingBox();
    assert.ok(bar.y+bar.height<=tabs.y+1,'map chips are above the mode tabs');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'long map names do not overflow');
    for(const chip of await chips.all())assert.ok(await chip.evaluate(el=>el.scrollWidth<=el.clientWidth),'chip labels remain readable');
    await card.screenshot({path:`artifacts/map-preferences/${theme}-${width}.png`});

    // Keyboard activation uses the same lock and confirmation as the menu.
    await card.locator(`[data-map-id="${b}"]`).focus();await page.keyboard.press('Enter');
    await card.locator(`[data-map-id="${b}"][aria-busy="true"]`).waitFor();
    assert.equal(await card.locator('.map-chip:disabled').count(),2);
    assert.equal(await card.locator('.map-chip-spinner').count(),1);
    await page.evaluate(b=>{mapPrefs.card.switchSavedMap(b);mapPrefs.card.switchSavedMap(b);},b);
    assert.equal(await page.evaluate(()=>mapPrefs.calls.length),1);
    await page.evaluate(b=>{
      const f=mapPrefs,source=f.hass.states[f.mapSelect];source.state=f.maps[1].option;source.attributes.map_id=b;f.card.hass={...f.hass};
    },b);
    assert.equal(await card.locator(`[data-map-id="${a}"]`).getAttribute('aria-pressed'),'true','select readback alone does not activate the target');
    await page.evaluate(b=>mapPrefs.report(b),b);await page.waitForFunction(()=>!mapPrefs.card._mapRequest);
    assert.equal(await card.locator(`[data-map-id="${b}"]`).getAttribute('aria-pressed'),'true');
    assert.equal(await page.evaluate(()=>mapPrefs.card.shadowRoot.activeElement?.dataset.mapId),b);
    assert.deepEqual((await card.locator('.name').allTextContents()).map(s=>s.trim()),['Büro']);
    assert.deepEqual(await page.evaluate(()=>mapPrefs.calls),[{domain:'select',service:'select_option',data:{entity_id:'select.renamed_saved_map',option:'Obergeschoss mit außergewöhnlich langem Etagennamen'}}]);

    await page.evaluate(a=>mapPrefs.report(a),a);
    await card.locator('input[data-room]').first().check();
    assert.equal(await page.evaluate(()=>mapPrefs.card.dirty),true);
    assert.equal(await card.locator('.map-chip:disabled').count(),0);
    assert.equal(await card.locator('.map-visibility-note').count(),0,'local edits do not add a draft-discard reminder');
    assert.equal(await page.evaluate(()=>mapPrefs.calls.length),1);
    await card.locator('[data-action="reset"]').click();
    assert.equal(await card.locator('.map-chip:disabled').count(),0);

    await card.locator('[data-action="schedules"]').click();
    assert.equal(await card.locator('.schedule-row').count(),2);
    await card.locator(`[data-map-id="${b}"]`).click();
    await page.evaluate(b=>mapPrefs.report(b),b);await page.waitForFunction(()=>!mapPrefs.card._mapRequest);
    assert.equal(await card.locator('[data-action="schedules"]').getAttribute('aria-selected'),'true');
    assert.equal(await card.locator('.schedule-row').count(),0);
    await card.locator('[data-action="rooms"]').click();
    await page.evaluate(({a,b,c})=>{const f=mapPrefs;f.report(a);f.card.setConfig({...f.card.config,excluded_maps:[b,c]});},{a,b,c});
    assert.equal(await chips.count(),0,'one visible active map hides both selectors');
    assert.equal(await card.locator('.map-toggle').count(),0);
    await page.evaluate(b=>mapPrefs.report(b),b);
    assert.equal(await chips.count(),2,'a hidden active map retains a visible return target');
    assert.match(await card.locator(`[data-map-id="${b}"] .map-hidden-label`).textContent(),/Hidden/);
    await card.locator(`[data-map-id="${b}"]`).click();
    assert.equal(await page.evaluate(()=>mapPrefs.calls.length),2,'clicking the active hidden map is a no-op');
    await card.locator(`[data-map-id="${a}"]`).click();
    await page.evaluate(a=>mapPrefs.report(a),a);await page.waitForFunction(()=>!mapPrefs.card._mapRequest);
    assert.equal(await chips.count(),0);
    assert.ok(await page.evaluate(()=>!!mapPrefs.card.shadowRoot.activeElement),'auto-hide restores focus to a remaining control');
    await page.evaluate(()=>{const f=mapPrefs;f.card.setConfig({...f.card.config,excluded_maps:f.maps.map(map=>map.map_id)});});
    assert.equal(await chips.count(),0);assert.equal(await card.locator('.map-toggle').count(),0);
    assert.match(await card.locator('.map-visibility-note').textContent(),/Erdgeschoss.*hidden in this card/);
    assert.equal(await page.evaluate(()=>mapPrefs.calls.length),3,'visibility preferences never select a map');

    await page.evaluate(({a,b,c,d})=>{
      const f=mapPrefs;f.maps.splice(2,1);f.maps[1].name=f.maps[1].option='Renamed upper floor';
      f.maps.push({map_id:d,name:'New floor',option:'New floor'});
      f.hass.states[f.mapSelect].attributes.options=f.maps.map(map=>map.option);
      f.card.setConfig({...f.card.config,excluded_maps:[b,c]});f.report(a);
    },{a,b,c,d});
    assert.deepEqual(await chips.evaluateAll(items=>items.map(el=>el.dataset.mapId)),[a,d],'rename/deletion keep exclusions by ID; a new map is visible');

    // The editor always uses the complete catalogue, including hidden maps.
    await page.evaluate(()=>{
      const f=mapPrefs;f.editor=document.createElement('dyson-cleaning-planner-card-editor');
      f.editor.setConfig(f.card.config);f.editor.hass=f.hass;f.editor.style.display='block';f.editor.style.boxSizing='border-box';
      f.editor.addEventListener('config-changed',event=>{f.card.setConfig(event.detail.config);});
      document.body.append(f.editor);
    });
    const editor=page.locator('dyson-cleaning-planner-card-editor');
    await editor.locator('.map-options').waitFor();
    assert.equal(await editor.locator('[data-include-map]').count(),3);
    assert.equal(await editor.locator(`[data-include-map="${b}"]`).isChecked(),false);
    assert.equal(await editor.locator('[data-key="map_selector_style"]').inputValue(),'chips');
    assert.deepEqual(await editor.locator('[data-include-map]').evaluateAll(items=>items.map(el=>el.dataset.includeMap)),[b,a,d],
      'the editor orders the complete catalogue, including hidden maps and new IDs');
    assert.equal(await editor.locator(`[data-order-map="${b}"][data-direction="-1"]`).isDisabled(),true);
    assert.equal(await editor.locator(`[data-order-map="${d}"][data-direction="1"]`).isDisabled(),true);
    await editor.locator(`[data-order-map="${a}"][data-direction="-1"]`).click();
    await editor.locator(`[data-order-map="${d}"][data-direction="-1"]`).click();
    await editor.locator(`[data-order-map="${d}"][data-direction="-1"]`).click();
    assert.deepEqual(await page.evaluate(()=>mapPrefs.editor.config.map_order),[d,a,b]);
    assert.deepEqual(await chips.evaluateAll(items=>items.map(el=>el.dataset.mapId)),[d,a]);
    assert.deepEqual(await page.evaluate(()=>mapPrefs.maps.map(map=>map.map_id)),[a,b,d],'editor sorting never reorders HA data');
    await editor.locator('[data-key="map_selector_style"]').selectOption('menu');
    await card.locator('.map-toggle').click();
    assert.deepEqual(await card.locator('.map-menu button').evaluateAll(items=>items.map(el=>el.dataset.mapId)),[d,a],
      'the header menu uses the same configured order');
    await page.keyboard.press('Escape');
    await editor.locator('[data-key="map_selector_style"]').selectOption('chips');
    assert.equal(await page.evaluate(()=>mapPrefs.calls.length),3,'reordering never selects a map or starts a clean');
    assert.ok(await editor.locator('.map-options').evaluate(el=>el.scrollWidth<=el.clientWidth),'map labels and arrows fit the editor');
    await editor.screenshot({path:`artifacts/map-preferences/editor-order-${theme}-${width}.png`});
    for(const id of [a,b,d])await editor.locator(`[data-include-map="${id}"]`).uncheck();
    assert.equal(await editor.locator('[data-include-map]').count(),3,'all maps can still be enabled after excluding every map');
    assert.equal(await chips.count(),0);assert.match(await card.locator('.map-visibility-note').textContent(),/hidden in this card/);
    await editor.locator(`[data-include-map="${d}"]`).check();
    await editor.locator('[data-key="map_selector_style"]').selectOption('menu');
    assert.equal(await chips.count(),0);assert.equal(await card.locator('.map-toggle').count(),1);
    await card.locator('.map-toggle').click();
    assert.deepEqual(await card.locator('.map-menu button').evaluateAll(items=>items.map(el=>el.dataset.mapId)),[a,d]);
    await page.keyboard.press('Escape');
    await editor.locator('[data-key="map_selector_style"]').selectOption('chips');
    const reads=await page.evaluate(()=>mapPrefs.registryReads);
    await editor.locator('[data-action="refresh-maps"]').click();
    await page.waitForFunction(reads=>mapPrefs.registryReads>reads&&!mapPrefs.editor._loadingRegistry,reads);
    assert.deepEqual(await page.evaluate(()=>mapPrefs.editor.config.map_order),[d,a,b],'refresh retains display order');
    assert.equal(await page.evaluate(()=>mapPrefs.calls.length),3,'editor refresh has no robot service side effects');

    for(const [language,title] of [['de','Gespeicherte Karten in dieser Ansicht'],['nl','Kaarten in deze weergave'],['fr','Cartes dans cette vue'],['en','Maps in this card']]) {
      await page.evaluate(language=>{const f=mapPrefs;f.editor.setConfig({...f.editor.config,language});},language);
      assert.equal(await editor.locator('.map-options h3').textContent(),title);
    }
    await page.evaluate(a=>{
      const f=mapPrefs;f.maps.splice(1);f.hass.states[f.mapSelect].attributes.options=f.maps.map(map=>map.option);f.report(a);
    },a);
    assert.equal(await editor.locator('.map-options').count(),0,'editor settings hide with only one known map');
    assert.equal(await chips.count(),0);
    await page.evaluate(({b,d})=>{
      const f=mapPrefs;f.maps.push({map_id:b,name:'Renamed upper floor',option:'Renamed upper floor'},{map_id:d,name:'New floor',option:'New floor'});
      f.hass.states[f.mapSelect].attributes.options=f.maps.map(map=>map.option);f.editor.hass={...f.hass};
      f.editor.setConfig({...f.editor.config,integration:'ha_rooms'});
    },{b,d});
    assert.equal(await editor.locator('.map-options').count(),0,'unsupported adapters ignore map preferences');
    assert.deepEqual(await page.evaluate(()=>mapPrefs.editor.config.map_order),[d,a,b]);
    await page.evaluate(()=>{
      const f=mapPrefs,other='vacuum.second_dyson';
      f.registry.push({...f.registry.find(row=>row.entity_id===f.entity),entity_id:other,unique_id:'OTHER_vacuum',device_id:'other-device'});
      f.hass.states[other]=structuredClone(f.hass.states[f.entity]);
      f.editor.setConfig({...f.editor.config,integration:'auto'});window.mapPreferencesEditorRefresh=f.editor.loadRegistry(true);
    });
    await page.evaluate(()=>window.mapPreferencesEditorRefresh);
    await editor.locator('[data-key="entity"]').selectOption('vacuum.second_dyson');
    assert.deepEqual(await page.evaluate(()=>mapPrefs.editor.config.excluded_maps),[]);
    assert.deepEqual(await page.evaluate(()=>mapPrefs.editor.config.map_order),[],'another robot starts with its own default order');
    assert.equal(await page.evaluate(()=>mapPrefs.editor.config.map_selector_style),'chips');
    assert.equal(await editor.locator('.map-options').count(),0);
    assert.equal(await page.evaluate(()=>mapPrefs.calls.length),3);
    // Chips also recover from timeouts/rejections and matching late telemetry.
    await page.evaluate(({a,theme})=>{
      const f=mapPrefs;f.card.setConfig({...f.config,theme,language:'en',show_camera:false,map_selector_style:'chips'});f.report(a);
    },{a,theme});
    await page.clock.install();
    const callsBefore=await page.evaluate(()=>mapPrefs.calls.length);
    await card.locator(`[data-map-id="${b}"]`).click();
    await card.locator('.map-chip-spinner').waitFor();
    await page.clock.runFor(10001);await page.waitForFunction(()=>!mapPrefs.card._mapRequest);
    assert.match(await card.locator('.header-notice-copy').textContent(),/has not been confirmed/);
    assert.equal(await card.locator('.map-chip-spinner').count(),0);
    assert.equal(await card.locator('.map-chip:disabled').count(),0);
    assert.equal(await card.locator(`[data-map-id="${a}"]`).getAttribute('aria-pressed'),'true');
    await page.evaluate(b=>mapPrefs.report(b),b);
    assert.equal(await card.locator('.header-notice').isVisible(),false);
    await page.evaluate(()=>{
      const f=mapPrefs;f.hass.callService=async(domain,service,data)=>{f.calls.push({domain,service,data});throw new Error('Map switch rejected');};
      f.card.hass={...f.hass};
    });
    await card.locator(`[data-map-id="${a}"]`).click();await page.waitForFunction(()=>!mapPrefs.card._mapRequest);
    assert.match(await card.locator('.header-notice-copy').textContent(),/Map switch rejected/);
    assert.equal(await card.locator(`[data-map-id="${b}"]`).getAttribute('aria-pressed'),'true');
    await page.evaluate(a=>mapPrefs.report(a),a);
    assert.equal(await card.locator('.header-notice').isVisible(),false);
    assert.equal(await page.evaluate(()=>mapPrefs.calls.length),callsBefore+2,'timeout and rejection do not retry');
    assert.deepEqual(errors,[]);await page.close();
  }
  console.log('Map preferences passed: chips/menu order, editor arrows, confirmation, locks, filtering, hidden active return path, rename/deletion/new maps, schedules, refresh, robot/adapter changes, timeout/rejection/late readback, four languages and both themes at 375/900 px.');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
