import test from 'node:test';
import assert from 'node:assert/strict';
import { stationSettings, changeStationSetting } from '../src/core.js';
import { batchFixture, addStationFixture } from './fixture.mjs';

test('station discovery uses registry identity and rejects disabled, foreign and ambiguous entities', () => {
  const f = addStationFixture(batchFixture());
  assert.equal(stationSettings(f.hass, f.registry, f.entity).filter(r => r.available).length, 6);
  const row = f.registry.find(e => e.unique_id === 'DEMO_station_hot_water_mopping');
  row.device_id = 'another-device';
  assert.equal(stationSettings(f.hass, f.registry, f.entity)[0].available, false);
  row.device_id = 'demo-device'; row.disabled_by = 'user';
  assert.equal(stationSettings(f.hass, f.registry, f.entity)[0].available, false);
  row.disabled_by = null; f.registry.push({ ...row, entity_id: 'switch.duplicate' });
  assert.equal(stationSettings(f.hass, f.registry, f.entity)[0].available, false);
});

test('station writes target one entity and validate options and availability without retries', async () => {
  const f = addStationFixture(batchFixture());
  await changeStationSetting(f.hass, f.registry, f.entity, 'hot_water_mopping', false);
  await changeStationSetting(f.hass, f.registry, f.entity, 'roller_drying_duration', '5 hours');
  assert.deepEqual(f.calls, [
    { domain: 'switch', service: 'turn_off', data: { entity_id: 'switch.renamed_station_0' } },
    { domain: 'select', service: 'select_option', data: { entity_id: 'select.renamed_station_5', option: '5 hours' } }
  ]);
  await assert.rejects(changeStationSetting(f.hass, f.registry, f.entity, 'roller_drying_duration', '6 hours'));
  f.hass.connected = false;
  await assert.rejects(changeStationSetting(f.hass, f.registry, f.entity, 'hot_water_mopping', true));
  assert.equal(f.calls.length, 2);
  f.hass.connected = true;
  let calls = 0;
  f.hass.callService = async () => { calls++; throw new Error('Rejected'); };
  await assert.rejects(changeStationSetting(f.hass, f.registry, f.entity, 'hot_water_mopping', true), /Rejected/);
  assert.equal(calls, 1);
});
