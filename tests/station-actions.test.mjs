import test from 'node:test';
import assert from 'node:assert/strict';
import { stationActions, pressStationAction, dryingRemainingTime, dryingRemainingPercent } from '../src/core.js';
import { batchFixture, addStationFixture } from './fixture.mjs';

test('dock buttons use renamed identities, accept unpressed buttons and reject unavailable or foreign entities', async () => {
  const f = addStationFixture(batchFixture());
  await pressStationAction(f.hass, f.registry, f.entity, 'empty_bin');
  await pressStationAction(f.hass, f.registry, f.entity, 'empty_bin'); // timestamp after first press
  assert.deepEqual(f.calls, Array(2).fill({ domain: 'button', service: 'press', data: { entity_id: 'button.renamed_empty_bin' } }));
  f.hass.states['button.renamed_empty_bin'].state = 'unavailable';
  await assert.rejects(pressStationAction(f.hass, f.registry, f.entity, 'empty_bin'));
  const row = f.registry.find(e => e.unique_id === 'DEMO_wash_mop');
  row.device_id = 'foreign';
  assert.equal(stationActions(f.hass, f.registry, f.entity)[1].available, false);
  row.device_id = 'demo-device'; row.disabled_by = 'user';
  assert.equal(stationActions(f.hass, f.registry, f.entity)[1].available, false);
  row.disabled_by = null; f.registry.push({ ...row, entity_id: 'button.duplicate' });
  assert.equal(stationActions(f.hass, f.registry, f.entity)[1].available, false);
  assert.equal(f.calls.length, 2);
});

test('dock action errors propagate once without retries', async () => {
  const f = addStationFixture(batchFixture()); let attempts = 0;
  f.hass.callService = async () => { attempts++; throw new Error('Dock busy'); };
  await assert.rejects(pressStationAction(f.hass, f.registry, f.entity, 'wash_mop'), /Dock busy/);
  assert.equal(attempts, 1);
  f.hass.connected = false;
  await assert.rejects(pressStationAction(f.hass, f.registry, f.entity, 'wash_mop'));
  assert.equal(attempts, 1);
});

test('dedicated drying sensor overrides legacy values, without stale fallback for invalid or unavailable readings', () => {
  const f = batchFixture();
  const attrs = f.hass.states[f.entity].attributes;
  Object.assign(attrs, { dock_state: 'DRYING_MOP', drying_remaining_seconds: 6000, drying_total_seconds: 14400 });
  const time = () => dryingRemainingTime(f.hass, f.entity, f.registry);
  const percent = () => dryingRemainingPercent(f.hass, f.entity, f.registry);
  assert.equal(time(), '01:40');
  const row = { entity_id: 'sensor.arbitrary_drying', unique_id: 'DEMO_drying_remaining', platform: 'dyson_spot_scrub', device_id: 'demo-device' };
  f.registry.push(row);
  const sensor = f.hass.states[row.entity_id] = { state: '10680', attributes: { total_seconds: 10800, updated_at: '2026-10-24T13:52:37Z' } };
  assert.equal(time(), '02:58'); assert.equal(percent(), 10680 / 10800 * 100);
  for (const value of ['unavailable', 'unknown', '', ' ', 'NaN', '-1', 'Infinity']) {
    sensor.state = value; assert.equal(time(), null); assert.equal(percent(), null);
  }
  sensor.state = '0'; assert.equal(time(), '00:00'); assert.equal(percent(), 0);
  sensor.state = '10680'; sensor.attributes.total_seconds = 0; assert.equal(percent(), null);
  row.disabled_by = 'user'; assert.equal(time(), null); row.disabled_by = null;
  f.registry.push({ ...row, entity_id: 'sensor.duplicate' }); assert.equal(time(), null); f.registry.pop();
  attrs.dock_state = 'IDLE'; assert.equal(time(), null);
  attrs.dock_state = 'DRYING_MOP'; f.hass.connected = false; assert.equal(time(), null);
  f.hass.connected = true; delete f.hass.states[row.entity_id]; assert.equal(time(), null);
  row.device_id = 'other-device'; assert.equal(time(), '01:40');
});
