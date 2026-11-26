import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=previewServer();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL ? {channel:process.env.BROWSER_CHANNEL} : {})});
  const page=await browser.newPage({viewport:{width:900,height:1100}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const card=page.locator('#card');
  await card.locator('.room').first().waitFor();
  await page.evaluate(async()=>{
    const {haRoomsFixture,enableFanSpeed}=await import('/tests/ha-rooms-fixture.mjs');
    window.fan=enableFanSpeed(haRoomsFixture());
    fan.hass.callService=async(domain,service,data)=>{
      fan.calls.push({domain,service,data});
      if(service==='set_fan_speed') {
        if(fan.failFan)throw new Error('Fan refused');
        fan.hass.states[fan.entity].attributes.fan_speed=data.fan_speed;
      } else if(service==='clean_area') {
        if(fan.failStart)throw new Error('Clean refused');
        fan.hass.states[fan.entity].state='cleaning';
      }
      demo.card.hass={...fan.hass};
    };
    demo.card.setConfig({...fan.config,language:'en'});demo.card.hass=fan.hass;
    await demo.card.loadRegistry();
  });
  const panel=card.locator('.planning-setting'), slider=panel.locator('input[type="range"]');
  const choose=async value=>panel.locator(`[data-option="${value}"]`).click();
  const reset=async(theme='modern',language='en')=>page.evaluate(({theme,language})=>{
    fan.hass.states[fan.entity].state='docked';
    Object.assign(fan.hass.states[fan.entity].attributes,{fan_speed:'Balanced',fan_speed_list:['Quiet','Balanced','Turbo','Max']});
    fan.hass.states[fan.entity].attributes.supported_features |= 32;
    fan.failFan=false;fan.failStart=false;
    demo.card.setConfig({...demo.card.config,theme,language});demo.card.hass={...fan.hass};
    demo.card.resetDraft();demo.card.clearSessionEnd();demo.card.update();
    fan.calls.length=0;
  },{theme,language});
  await mkdir(new URL('../artifacts/ha-fan-speed/',import.meta.url),{recursive:true});

  for(const theme of ['modern','classic']) {
    await reset(theme);
    assert.equal(await panel.count(),1);
    assert.equal(await panel.locator('output').innerText(),'Balanced');
    assert.equal(await card.locator('.rooms .planning-setting').count(),0);
    assert.equal(await card.locator('[data-action="save"]').count(),0);
    await slider.press('End');
    assert.equal(await panel.locator('output').innerText(),'Max');
    assert.equal(await slider.evaluate(node=>node.getRootNode().activeElement===node),true,'keyboard focus survives rendering');
    await slider.press('ArrowLeft');
    assert.equal(await panel.locator('output').innerText(),'Turbo');
    await choose('Turbo');
    assert.equal(await panel.locator('output').innerText(),'Turbo');
    assert.equal(await page.evaluate(()=>fan.calls.length),0);
    assert.equal(await page.evaluate(()=>fan.hass.states[fan.entity].attributes.fan_speed),'Balanced');
    await choose('Balanced');
    assert.deepEqual(await page.evaluate(()=>demo.card.planningDraft),{});
    await choose('Turbo');
    await card.locator('[data-room="area:kitchen"]').check();
    await card.locator('[data-room="area:hall"]').check();
    for(const language of ['en','de','nl','fr']) {
      await page.evaluate(language=>demo.card.setConfig({...demo.card.config,language}),language);
      assert.equal(await panel.locator('output').innerText(),'Turbo','language changes preserve the native draft');
      for(const width of [375,900]) {
        await page.setViewportSize({width,height:1100});
        assert.equal(await panel.evaluate(node=>node.scrollWidth<=node.clientWidth),true,`${theme}/${language}/${width}`);
        assert.equal(await panel.locator('output').evaluate(node=>node.getBoundingClientRect().height<=32),true,'short values stay on one line');
        await page.screenshot({path:fileURLToPath(new URL(`../artifacts/ha-fan-speed/${theme}-${language}-${width}.png`,import.meta.url)),fullPage:true});
        if(language==='de' && width===375) {
          await page.evaluate(()=>document.body.classList.add('dark'));
          await page.screenshot({path:fileURLToPath(new URL(`../artifacts/ha-fan-speed/${theme}-de-dark-375.png`,import.meta.url)),fullPage:true});
          await page.evaluate(()=>document.body.classList.remove('dark'));
        }
      }
    }
    await card.locator('[data-action="start"]').click();
    await page.waitForFunction(()=>!demo.card.busy);
    assert.deepEqual(await page.evaluate(()=>fan.calls.map(call=>[call.service,call.data])),[
      ['set_fan_speed',{entity_id:'vacuum.alfred',fan_speed:'Turbo'}],
      ['clean_area',{entity_id:'vacuum.alfred',cleaning_area_id:['kitchen','hall']}],
    ]);
    assert.deepEqual(await page.evaluate(()=>demo.card.planningDraft),{});
  }

  await reset();
  await choose('Turbo');
  await page.evaluate(()=>{fan.hass.connected=false;demo.card.hass={...fan.hass};});
  assert.equal(await slider.isDisabled(),true);
  await page.evaluate(()=>{fan.hass.connected=true;demo.card.hass={...fan.hass};});
  assert.equal(await panel.locator('output').innerText(),'Turbo');
  await card.locator('[data-action="reset"]').click();
  assert.equal(await panel.locator('output').innerText(),'Balanced');
  assert.equal(await page.evaluate(()=>fan.calls.length),0);
  await page.evaluate(()=>{fan.hass.states[fan.entity].attributes.fan_speed='unreported';demo.card.hass={...fan.hass};});
  assert.equal(await panel.locator('output').innerText(),'Unavailable');
  assert.equal(await slider.isDisabled(),true);
  await choose('Turbo');
  assert.equal(await slider.isEnabled(),true,'an explicit option can recover an unknown current value');

  // Losing support must preserve user intent and block Start until discarded.
  await card.locator('[data-room="area:kitchen"]').check();
  await page.evaluate(()=>{fan.hass.states[fan.entity].attributes.supported_features &= ~32;demo.card.hass={...fan.hass};});
  assert.equal(await panel.count(),0);
  assert.equal(await card.locator('[data-action="start"]').isDisabled(),true);
  assert.deepEqual(await page.evaluate(()=>demo.card.planningDraft),{fan_speed:'Turbo'});
  await card.locator('[data-action="reset"]').click();
  await card.locator('[data-room="area:kitchen"]').check();
  assert.equal(await card.locator('[data-action="start"]').isEnabled(),true);

  for(const fail of ['fan','start']) {
    await reset();
    await choose('Turbo');
    await card.locator('[data-room="area:kitchen"]').check();
    await page.evaluate(fail=>{fan.failFan=fail==='fan';fan.failStart=fail==='start';},fail);
    await card.locator('[data-action="start"]').click();
    await page.waitForFunction(()=>!demo.card.busy);
    assert.deepEqual(await page.evaluate(()=>fan.calls.map(call=>call.service)),fail==='fan' ? ['set_fan_speed'] : ['set_fan_speed','clean_area']);
    assert.deepEqual(await page.evaluate(()=>demo.card.planningDraft),{fan_speed:'Turbo'});
    assert.match(await card.locator('.header-notice-copy').innerText(),fail==='fan' ? /Fan refused/ : /suction power command.*not confirmed/);
    await page.evaluate(()=>demo.card.update());
    assert.equal(await page.evaluate(()=>fan.calls.length),fail==='fan' ? 1 : 2,'rendering does not retry');
  }
  // A user retry skips a fan value already reported by HA.
  await page.evaluate(()=>{fan.failStart=false;});
  await card.locator('[data-action="start"]').click();
  await page.waitForFunction(()=>!demo.card.busy);
  assert.deepEqual(await page.evaluate(()=>fan.calls.map(call=>call.service)),['set_fan_speed','clean_area','clean_area']);
  await reset();
  await page.evaluate(async()=>{
    fan.registry[0].platform='dyson_spot_scrub';
    Object.assign(fan.hass.states[fan.entity].attributes,{fan_speed:'Room settings',fan_speed_list:['Room settings','Vacuum','Vacuum and Mop','Mop','Vacuum then Mop']});
    await demo.card.loadRegistry();
    demo.card.hass={...fan.hass};
  });
  assert.equal(await panel.count(),0,'known cleaning modes cannot masquerade as suction levels');
  await card.locator('[data-room="area:kitchen"]').check();
  await card.locator('[data-action="start"]').click();
  await page.waitForFunction(()=>!demo.card.busy);
  assert.deepEqual(await page.evaluate(()=>fan.calls.map(call=>call.service)),['clean_area']);
  assert.deepEqual(errors,[]);
  console.log('HA fan speed browser checks passed: shared slider, local drafts, four languages/two themes, exact two-step calls, capability loss, partial failure and explicit retry.');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
