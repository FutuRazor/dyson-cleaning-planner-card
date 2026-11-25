import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {previewServer} from '../scripts/preview.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const server=previewServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  await mkdir('artifacts/settings-feedback',{recursive:true});
  for(const theme of ['modern','classic']) {
    const page=await browser.newPage({viewport:{width:390,height:1000}}),errors=[];
    page.setDefaultTimeout(15000);page.on('pageerror',error=>errors.push(error.message));await page.clock.install();
    page.setDefaultNavigationTimeout(30000);
    await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'domcontentloaded'});
    const card=page.locator('#card');await card.locator('.room').first().waitFor();
    await page.evaluate(async theme=>{
      const {ROBOT_FIELDS}=await import('/src/core.js');
      for(const [key,,domain]of ROBOT_FIELDS) {
        const entity=`${domain}.feedback_${key}`;
        demo.registry.push({entity_id:entity,unique_id:`DEMO_setting_${key}`,device_id:'demo-device',platform:'dyson_spot_scrub',disabled_by:null});
        demo.hass.states[entity]={state:domain==='switch'?(key==='voice_prompts'?'on':'off'):domain==='number'?'50':'22:00:00',attributes:{}};
      }
      demo.hass.services.number={set_value:{}};demo.hass.services.time={set_value:{}};
      await demo.card.loadRegistry();
      demo.card.setConfig({...demo.card.config,theme,language:'en'});demo.card.toggleConsumables(true);
      window.operations=[];window.transportMode='wait';
      demo.hass.callService=async(domain,service,data)=>{
        demo.calls.push({domain,service,data});
        const owner=demo.hass,previous=owner.states[data.entity_id];
        const operation={entity:data.entity_id,state:{...previous,state:service==='turn_on'?'on':'off'}};
        operations.push(operation);
        if(transportMode==='reject')throw new Error('Robot rejected setting');
        if(transportMode==='immediate') {owner.states[operation.entity]=operation.state;demo.card.hass={...owner};}
        if(transportMode==='hold')await new Promise(resolve=>operation.release=resolve);
      };
      window.applySetting=index=>{
        const operation=operations[index??operations.length-1];demo.hass.states[operation.entity]=operation.state;demo.card.hass={...demo.hass};
      };
    },theme);
    const target=(group,key)=>card.locator(`ha-switch[${group==='robot'?'data-robot-setting':'data-station'}="${key}"]`);
    const waiting=()=>page.waitForFunction(()=>!!demo.card._settingSwitchRequest?.confirm);
    const idle=()=>page.waitForFunction(()=>!demo.card.stationBusy);
    for(const [group,key]of [['robot','child_lock'],['station','hot_water_mopping']]) {
      console.log(`Checking ${theme} ${group} switch feedback`);
      await page.evaluate(()=>window.transportMode='wait');
      await card.locator(`[data-info-tab="${group}"]`).click();
      const message=card.locator(`.${group}-message`),control=target(group,key);
      const checked=await control.locator('input').isChecked();
      const rowBefore=await control.evaluate(el=>el.closest('.station-row').getBoundingClientRect().height);
      const before=await page.evaluate(()=>demo.calls.length);
      await control.locator('input').click();await waiting();
      const pending=card.locator('.setting-switch.pending');
      assert.equal(await pending.count(),1,'only the changed setting shows loading');
      assert.equal(await pending.getAttribute('aria-busy'),'true');
      assert.equal(await card.locator('.setting-switch-spinner').isVisible(),true);
      assert.equal(await control.isVisible(),false,'spinner replaces the switch');
      assert.equal(await control.locator('input').isChecked(),checked,'unconfirmed values are not displayed as applied');
      const rowPending=await pending.evaluate(el=>el.closest('.station-row').getBoundingClientRect().height);
      assert.ok(Math.abs(rowPending-rowBefore)<1,'loading does not change row height');
      assert.ok(await card.locator('ha-switch[disabled]').count()>1,'other preference writes remain locked');
      await page.evaluate(()=>demo.card.setRobotSetting('child_lock',true));
      assert.equal(await page.evaluate(()=>demo.calls.length),before+1,'repeated writes are blocked');
      await page.clock.runFor(1000);assert.equal(await pending.count(),1,'service completion alone does not stop loading');
      await card.screenshot({path:`artifacts/settings-feedback/${theme}-${group}.png`});
      await page.evaluate(()=>applySetting());await idle();
      assert.equal(await card.locator('.setting-switch-spinner').count(),0);
      assert.equal(await control.locator('input').isChecked(),!checked);
      assert.equal(await message.isHidden(),true,'success has no persistent message');

      // Readback can arrive before the transport promise resolves.
      await page.evaluate(()=>window.transportMode='hold');await control.locator('input').click();
      await page.waitForFunction(()=>!!operations.at(-1)?.release);
      await page.evaluate(()=>applySetting());
      assert.equal(await card.locator('.setting-switch-spinner').count(),1);
      await page.evaluate(()=>operations.at(-1).release());await idle();
      assert.equal(await control.locator('input').isChecked(),checked);

      // A missing confirmation releases the lock and later readback clears the warning.
      await page.evaluate(()=>window.transportMode='wait');await control.locator('input').click();await waiting();
      const calls=await page.evaluate(()=>demo.calls.length);
      await page.clock.runFor(10100);await idle();
      assert.equal(await card.locator('.setting-switch-spinner').count(),0);
      assert.match(await message.innerText(),/not been confirmed/);
      assert.equal(await control.locator('input').isChecked(),checked);
      assert.equal(await page.evaluate(()=>demo.calls.length),calls,'timeouts never retry writes');
      await page.evaluate(()=>applySetting());assert.equal(await message.isHidden(),true);

      await page.evaluate(()=>window.transportMode='reject');await control.locator('input').click();await idle();
      assert.match(await message.innerText(),/Robot rejected setting/);
      assert.equal(await card.locator('.setting-switch-spinner').count(),0);
      const rejected=await page.evaluate(()=>demo.calls.length);
      await page.clock.runFor(15000);assert.equal(await page.evaluate(()=>demo.calls.length),rejected,'failures never retry');
    }
    // Every exposed robot/station switch uses the same confirmed readback flow.
    await page.evaluate(async()=>{
      window.transportMode='immediate';
      for(const group of ['robot','station']) {
        demo.card.infoTab=group;demo.card.updateConsumables();
        const fields=group==='robot'?demo.card.adapter.robotSettings(demo.hass,demo.card.registry,demo.entity)
          :demo.card.adapter.stationSettings(demo.hass,demo.card.registry,demo.entity);
        for(const field of fields.filter(field=>field.domain==='switch'&&field.available&&field.enabled!==false)) {
          const change=group==='robot'?'setRobotSetting':'setStationSetting';await demo.card[change](field.key,field.value!=='on');
          if(demo.card.stationBusy||demo.card._settingSwitchRequest)throw new Error('Immediate readback did not finish');
        }
      }
    });
    assert.equal(await card.locator('.setting-switch-spinner').count(),0);

    // Old completion must not release a newer request after reconfiguration.
    await page.evaluate(()=>{window.transportMode='hold';demo.card.infoTab='robot';demo.card.updateConsumables();});
    await target('robot','child_lock').locator('input').click();await page.waitForFunction(()=>!!operations.at(-1)?.release);
    const old=await page.evaluate(()=>operations.length-1);
    await page.evaluate(()=>{
      demo.card.setConfig({...demo.card.config,title:'Reconfigured'});demo.card.toggleConsumables(true);
    });
    assert.equal(await page.evaluate(()=>demo.card.stationBusy),false);
    await target('station','hot_water_mopping').locator('input').click();await page.waitForFunction(()=>!!operations.at(-1)?.release);
    await page.evaluate(index=>operations[index].release(),old);await page.clock.runFor(50);
    assert.equal(await page.evaluate(()=>demo.card._settingSwitchRequest.group),'station');
    assert.equal(await page.evaluate(()=>demo.card.stationBusy),true,'old finally cannot clear a newer lock');
    await page.evaluate(()=>{applySetting();operations.at(-1).release();});await idle();

    // Detachment cancels the timer and does not introduce a delayed error on reconnect.
    await page.evaluate(()=>window.transportMode='wait');await target('station','hot_water_mopping').locator('input').click();await waiting();
    await page.evaluate(()=>{window.savedCard=demo.card;window.savedParent=demo.card.parentNode;demo.card.remove();});
    await page.clock.runFor(15000);
    assert.equal(await page.evaluate(()=>savedCard.stationBusy),false);
    assert.equal(await page.evaluate(()=>savedCard._settingSwitchRequest),null);
    await page.evaluate(()=>savedParent.append(savedCard));
    assert.equal(await card.locator('.setting-switch-spinner').count(),0);
    assert.equal(await card.locator('.station-message').isHidden(),true);

    // Switching adapters while transport is pending cannot affect the new device.
    await page.evaluate(()=>{demo.card.toggleConsumables(true);demo.card.infoTab='robot';demo.card.updateConsumables();window.transportMode='hold';});
    await target('robot','child_lock').locator('input').click();await page.waitForFunction(()=>!!operations.at(-1)?.release);
    await page.evaluate(async()=>{
      const {hassDysonFixture}=await import('/tests/hass-dyson-fixture.mjs');window.other=hassDysonFixture();
      demo.card.setConfig({...other.config,show_camera:false,theme:'modern'});demo.card.hass=other.hass;await demo.card.loadRegistry();
    });
    await page.evaluate(()=>operations.at(-1).release());await page.clock.runFor(15000);
    assert.equal(await page.evaluate(()=>demo.card.config.entity),'vacuum.renamed_hass_robot');
    assert.equal(await page.evaluate(()=>demo.card.stationBusy),false);
    assert.equal(await page.evaluate(()=>demo.card.robotMessage),'');
    assert.equal(await page.evaluate(()=>other.calls.length),0);
    assert.deepEqual(errors,[]);await page.close();
  }
  console.log('Settings switches: local loading, HA readback, all switches, timeouts/late state, failures, locks and lifecycle isolation passed in both themes.');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
