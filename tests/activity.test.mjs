import test from 'node:test';
import assert from 'node:assert/strict';
import { activityStatus, dockBusy, cleaningView, sendRoomDraft, discover, normalizeConfig } from '../src/core.js';
import { batchFixture } from './fixture.mjs';
import { spotScrubAdapter } from '../src/adapters/spot-scrub.js';

test('map switching is a header notice while actual activity and start rejection remain authoritative',async()=>{
  const f=batchFixture(),vacuum=f.hass.states[f.entity];
  Object.assign(vacuum.attributes,{ready_to_start:false,start_block_reason:'map_switching',dock_state:'IDLE'});
  const message='Wait for the map switch to finish before starting a clean.';
  assert.deepEqual(activityStatus(f.hass,f.entity),{notice:message});
  assert.equal(spotScrubAdapter.startBlockReason(f.hass,f.entity),message);
  vacuum.attributes.dock_state='DRYING_MOP';
  const drying=activityStatus(f.hass,f.entity);
  assert.equal(drying.text,'Drying mop roller');assert.equal(drying.drying,true);assert.equal(drying.notice,message);
  vacuum.attributes.dock_state='IDLE';
  const config=normalizeConfig(f.config),model=discover(f.hass,f.registry,config);
  await assert.rejects(sendRoomDraft({hass:f.hass,model,config,selected:[f.ids[0]],draft:{},start:true}),/map switch/);
  assert.deepEqual(f.calls,[]);
  vacuum.attributes.ready_to_start=true;
  assert.equal(activityStatus(f.hass,f.entity),null,'cleared readiness cannot retain a stale map notice');
  vacuum.attributes.ready_to_start=false;vacuum.state='unavailable';
  assert.equal(activityStatus(f.hass,f.entity).notice,undefined,'connection loss is not a map-change explanation');
});

test('live cleaning phase takes precedence over configured mode; missing telemetry stays generic', () => {
  const f = batchFixture(), vacuum = f.hass.states[f.entity];
  vacuum.state = 'cleaning';
  vacuum.attributes.fan_speed = 'Vacuum then Mop';
  for (const [phase, label] of [['VACUUMING', 'Vacuuming'], ['MOPPING', 'Mopping'], ['VACUUMING_AND_MOPPING', 'Vacuuming and mopping'], ['NONE', 'Cleaning']]) {
    vacuum.attributes.full_clean_action = phase;
    assert.equal(activityStatus(f.hass, f.entity).text, label);
  }
  vacuum.state = 'paused';
  assert.equal(activityStatus(f.hass, f.entity).text, 'Paused');
});

test('dock phases appear in the planner, disappear at idle, and cannot hide errors or disconnection', () => {
  const f = batchFixture(), vacuum = f.hass.states[f.entity];
  for (const phase of ['WASHING_MOP', 'DRYING_MOP', 'COLLECTING_DUST']) {
    vacuum.attributes.dock_state = phase;
    assert.equal(cleaningView(f.hass, f.entity).active, false);
    assert.equal(dockBusy(f.hass, f.entity), true);
    assert.equal(activityStatus(f.hass, f.entity).drying, phase === 'DRYING_MOP');
  }
  vacuum.state = 'error';
  assert.equal(activityStatus(f.hass, f.entity).text, 'Robot needs attention');
  assert.equal(cleaningView(f.hass, f.entity).active, true);
  f.hass.connected = false;
  assert.equal(activityStatus(f.hass, f.entity).text, 'Robot unavailable');
  f.hass.connected = true;
  vacuum.state = 'docked';
  vacuum.attributes.dock_state = 'IDLE';
  vacuum.attributes.full_clean_action = 'MOPPING';
  assert.equal(activityStatus(f.hass, f.entity), null, 'old cleaning telemetry cannot leave a stale status');
});

test('starting during roller washing is rejected before any service call', async () => {
  const f = batchFixture();
  f.hass.states[f.entity].attributes.dock_state = 'WASHING_MOP';
  const config = normalizeConfig(f.config), model = discover(f.hass, f.registry, config);
  await assert.rejects(sendRoomDraft({ hass: f.hass, model, config, selected: [f.ids[0]], draft: {}, start: true }), /dock cycle/);
  assert.equal(f.calls.length, 0);
});


test('start during drying sends the normal batch action and keeps the drying status', async () => {
  const f = batchFixture();
  f.hass.states[f.entity].attributes.dock_state = 'DRYING_MOP';
  const config = normalizeConfig(f.config), model = discover(f.hass, f.registry, config);
  await sendRoomDraft({ hass: f.hass, model, config, selected: [f.ids[0]], draft: {}, start: true });
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].service, 'start_rooms_with_settings');
  assert.equal(activityStatus(f.hass, f.entity).text, 'Drying mop roller');
});


test('a start-ready fault opens the planner without hiding the warning', () => {
  const f = batchFixture(), vacuum = f.hass.states[f.entity];
  vacuum.state = 'error';
  for (const ready of [false, undefined, 'true']) {
    vacuum.attributes.ready_to_start = ready;
    assert.equal(cleaningView(f.hass, f.entity).active, true);
  }
  vacuum.attributes.ready_to_start = true;
  assert.equal(cleaningView(f.hass, f.entity).active, false);
  assert.equal(activityStatus(f.hass, f.entity).text, 'Robot needs attention');
  assert.equal(cleaningView(f.hass, f.entity, true).title, 'Starting clean');
  for (const state of ['cleaning', 'paused', 'returning', 'unavailable']) {
    vacuum.state = state;
    assert.equal(cleaningView(f.hass, f.entity).active, true);
  }
  vacuum.state = 'error';
  f.hass.connected = false;
  assert.equal(cleaningView(f.hass, f.entity).title, 'Robot unavailable');
});


test('a fault allows a batch start only with explicit integration readiness', async () => {
  const f = batchFixture(), vacuum = f.hass.states[f.entity];
  vacuum.state = 'error';
  const config = normalizeConfig(f.config), model = discover(f.hass, f.registry, config);
  const start = () => sendRoomDraft({ hass: f.hass, model, config, selected: [f.ids[0]], draft: {}, start: true });
  for (const ready of [false, undefined, 'true']) {
    vacuum.attributes.ready_to_start = ready;
    await assert.rejects(start(), /ready/);
  }
  assert.equal(f.calls.length, 0);
  vacuum.attributes.ready_to_start = true;
  await start();
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].service, 'start_rooms_with_settings');
});
