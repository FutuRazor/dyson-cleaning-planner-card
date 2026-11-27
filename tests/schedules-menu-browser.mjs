import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { previewServer } from '../scripts/preview.mjs';
const { chromium }=createRequire(import.meta.url)('playwright');
const server=previewServer();
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
  for(const theme of ['modern','classic']) for(const touch of [false,true]) {
    const context=await browser.newContext({viewport:{width:touch?390:900,height:1000},hasTouch:touch,isMobile:touch});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.addInitScript(()=>{
      // HA's Lit-based ha-card renders its slot asynchronously. The default
      // offline preview's unregistered element cannot reproduce that timing.
      customElements.define('ha-card',class extends HTMLElement {
        constructor(){super();this.attachShadow({mode:'open'});}
        connectedCallback(){queueMicrotask(()=>{if(this.isConnected)this.shadowRoot.innerHTML='<slot></slot>';});}
      });
    });
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.evaluate(async theme=>{
      const {spotSchedulesFixture}=await import('/tests/spot-schedules-fixture.mjs');
      window.sched=spotSchedulesFixture();
      demo.card.setConfig({...sched.config,theme,language:'en',show_camera:false});demo.card.hass={...sched.hass};await demo.card.loadRegistry();
    },theme);
    const card=page.locator('#card');
    const activate=async locator=>touch?locator.tap():locator.click();
    await activate(card.locator('#planning-tab-schedules'));
    for(const part of ['.schedule-time-value','.schedule-weekdays','.schedule-room-selection','svg']) {
      await activate(card.locator(`[data-schedule-menu="101"] ${part}`));
      assert.equal(await card.locator('.schedule-menu-panel').isVisible(),true,`${part} opens the existing menu`);
      await page.keyboard.press('Escape');
    }
    const trigger=card.locator('[data-schedule-menu="101"]');
    await (touch ? trigger.tap({position:{x:2,y:2}}) : trigger.click({position:{x:2,y:2}}));
    assert.equal(await card.locator('.schedule-menu-panel').isVisible(),true,'blank space inside the content button opens the menu');
    await page.keyboard.press('Escape');
    for(const id of [101,102,101]) {
      await activate(card.locator(`[data-schedule-menu="${id}"]`));
      await card.locator('.schedule-menu-panel').waitFor({state:'visible',timeout:3000});
      assert.equal(await card.locator(`[data-schedule-menu="${id}"]`).getAttribute('aria-expanded'),'true');
      await page.evaluate(()=>{demo.card.hass={...sched.hass};});
      assert.equal(await card.locator('.schedule-menu-panel').isVisible(),true,'HA updates keep the menu open');
      await activate(card.locator(`[data-schedule-edit="${id}"]`));
      assert.equal(await card.locator('.schedule-dialog').isVisible(),true);
      await activate(card.locator('[data-focus="schedule-cancel"]'));
    }
    await activate(card.locator('[data-schedule-menu="101"]'));
    await activate(card.locator('[data-schedule-delete="101"]'));
    assert.match(await card.locator('.schedule-dialog').innerText(),/Delete schedule/);
    await activate(card.locator('[data-focus="schedule-cancel"]'));
    assert.equal(await page.evaluate(()=>sched.calls.length),0,'opening menus and cancelling sends no actions');
    assert.deepEqual(errors,[]);
    await context.close();
  }
  console.log('Schedule content, room chips, blank space and three dots open the existing menu in both themes for mouse and touch, with asynchronous HA card rendering.');
} finally {await browser?.close();server.close();}
