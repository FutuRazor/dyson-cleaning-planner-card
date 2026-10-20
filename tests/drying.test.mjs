import test from 'node:test';
import assert from 'node:assert/strict';
import { dryingRemainingTime, canControl, controlCleaning } from '../src/core.js';
import { batchFixture } from './fixture.mjs';

test('drying subtitle uses confirmed seconds, rounding up without inventing missing time', () => {
  const f = batchFixture(), attrs = f.hass.states[f.entity].attributes;
  attrs.dock_state = 'DRYING_MOP';
  for (const [value, text] of [[6660, '01:51'], [6000, '01:40'], [60, '00:01'], [1, '00:01'], [0, '00:00'], [undefined, null], [null, null], ['60', null], [-1, null], [NaN, null]]) {
    attrs.drying_remaining_seconds = value;
    assert.equal(dryingRemainingTime(f.hass, f.entity), text);
  }
  attrs.drying_remaining_seconds = 6000;
  attrs.dock_state = 'IDLE';
  assert.equal(dryingRemainingTime(f.hass, f.entity), null);
  attrs.dock_state = 'DRYING_MOP'; f.hass.connected = false;
  assert.equal(dryingRemainingTime(f.hass, f.entity), null);
});

test('cancel drying requires its service and targets exactly one vacuum without changing state', async () => {
  const f = batchFixture();
  f.hass.states[f.entity].attributes.dock_state = 'DRYING_MOP';
  assert.equal(canControl(f.hass, f.entity, 'cancel_drying'), false);
  f.hass.services.dyson_spot_scrub.cancel_drying = {};
  assert.equal(canControl(f.hass, f.entity, 'cancel_drying'), true);
  await controlCleaning(f.hass, f.entity, 'cancel_drying');
  assert.deepEqual(f.calls, [{ domain: 'dyson_spot_scrub', service: 'cancel_drying', data: { entity_id: f.entity } }]);
  assert.equal(f.hass.states[f.entity].attributes.dock_state, 'DRYING_MOP');
  f.hass.states[f.entity].attributes.dock_state = 'IDLE';
  await assert.rejects(controlCleaning(f.hass, f.entity, 'cancel_drying'));
  assert.equal(f.calls.length, 1);
});
