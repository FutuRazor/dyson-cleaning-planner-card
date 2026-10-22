import test from 'node:test';
import assert from 'node:assert/strict';
import { startBlockReason, sendRoomDraft, discover, normalizeConfig } from '../src/core.js';
import { batchFixture } from './fixture.mjs';

test('integration veto rejects start before any service call; legacy fallback remains', async () => {
  const f = batchFixture(), attrs = f.hass.states[f.entity].attributes;
  const config = normalizeConfig({ entity: f.entity });
  attrs.ready_to_start = false;
  attrs.start_block_reason = 'returning_or_finishing';
  assert.match(startBlockReason(f.hass, f.entity), /Returning to dock/);
  await assert.rejects(sendRoomDraft({ hass:f.hass, model:discover(f.hass,f.registry,config), config, start:true }), /Returning to dock/);
  assert.equal(f.calls.length, 0);
  attrs.start_block_reason = 'future_reason';
  assert.match(startBlockReason(f.hass, f.entity), /integration/);
  attrs.ready_to_start = true;
  attrs.dock_state = 'DRYING_MOP';
  assert.equal(startBlockReason(f.hass, f.entity), null);
  delete attrs.ready_to_start;
  assert.equal(startBlockReason(f.hass, f.entity), null);
  attrs.dock_state = 'WASHING_MOP';
  assert.ok(startBlockReason(f.hass, f.entity));
});
