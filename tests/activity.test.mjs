import test from 'node:test';
import assert from 'node:assert/strict';
import { activityStatus, dockBusy, cleaningView, sendRoomDraft, discover, normalizeConfig } from '../src/core.js';
import { batchFixture } from './fixture.mjs';

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
