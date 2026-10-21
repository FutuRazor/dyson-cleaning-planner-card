import test from 'node:test';
import assert from 'node:assert/strict';
import { dryingRemainingPercent } from '../src/core.js';
import { batchFixture } from './fixture.mjs';

test('remaining drying bar uses valid telemetry and disappears outside drying', () => {
  const f = batchFixture(), attrs = f.hass.states[f.entity].attributes;
  attrs.dock_state = 'DRYING_MOP';
  for (const [total, remaining, expected] of [[14400,14400,100],[14400,7200,50],[14400,0,0],
    [0,0,null],[undefined,100,null],[14400,undefined,null],[14400,-1,null],
    [14400,15000,null],['14400',7200,null],[Infinity,100,null]]) {
    Object.assign(attrs, { drying_total_seconds: total, drying_remaining_seconds: remaining });
    assert.equal(dryingRemainingPercent(f.hass, f.entity), expected);
  }
  Object.assign(attrs, { drying_total_seconds:14400, drying_remaining_seconds:7200, dock_state:'IDLE' });
  assert.equal(dryingRemainingPercent(f.hass, f.entity), null);
  attrs.dock_state = 'DRYING_MOP'; f.hass.connected = false;
  assert.equal(dryingRemainingPercent(f.hass, f.entity), null);
});
