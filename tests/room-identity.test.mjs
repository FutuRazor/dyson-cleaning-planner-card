import test from 'node:test';
import assert from 'node:assert/strict';
import { discover, roomContext, sendRoomDraft } from '../src/core.js';
import { batchFixture } from './fixture.mjs';

test('cached rooms remain visible but cannot authorize a start without live identity', async () => {
  const f = batchFixture();
  const previous = discover(f.hass, f.registry, f.config);
  for (const entity of Object.values(f.fields[10])) delete f.hass.states[entity];
  const model = discover(f.hass, f.registry, f.config, previous.rooms);
  assert.equal(model.rooms.length, previous.rooms.length);
  assert.equal(model.rooms[0].roomId, '10');
  await assert.rejects(sendRoomDraft({ ...f, model, start: true, selected: [f.ids[0]] }), /stable room ID/);
  assert.equal(f.calls.length, 0);
  // One live identity suffices; unrelated unavailable controls need not block a start.
  const entity = f.fields[10].cleaning_mode;
  f.hass.states[entity] = { state: 'Vacuum', attributes: { room_id: '10', options: ['Vacuum'] } };
  await sendRoomDraft({ ...f, model: discover(f.hass, f.registry, f.config, model.rooms), start: true, selected: [f.ids[0]] });
  assert.equal(f.calls.length, 1);
});

test('map changes never inherit cached IDs and reject drafts even when IDs are reused', async () => {
  const f = batchFixture();
  f.hass.states[f.config.entity].attributes.map_id = 'A';
  const context = roomContext(f.hass, f.config.entity);
  const previous = discover(f.hass, f.registry, f.config);
  f.hass.states[f.config.entity].attributes.map_id = 'B';
  const model = discover(f.hass, f.registry, f.config, previous.rooms);
  for (const start of [false, true]) {
    await assert.rejects(sendRoomDraft({ ...f, model, context, start, selected: [f.ids[0]], draft: { 10: { cleaning_mode: 'Mop' } } }), /Review or discard/);
  }
  for (const entity of Object.values(f.fields[10])) delete f.hass.states[entity];
  const missing = discover(f.hass, f.registry, f.config, previous.rooms);
  assert.equal(missing.rooms[0].roomId, undefined);
  assert.equal(f.calls.length, 0);
});

test('identity is rechecked at send time and missing map telemetry cannot validate an old draft', async () => {
  const f = batchFixture();
  f.hass.states[f.config.entity].attributes.map_id = 'A';
  const context = roomContext(f.hass, f.config.entity);
  const model = discover(f.hass, f.registry, f.config);
  f.hass.states[f.fields[10].cleaning_mode].attributes.room_id = '99';
  await assert.rejects(sendRoomDraft({ ...f, model, context, start: true, selected: [f.ids[0]] }), /stable room ID/);
  delete f.hass.states[f.config.entity].attributes.map_id;
  await assert.rejects(sendRoomDraft({ ...f, model, context, draft: { 10: { water_level: 'High' } } }), /Review or discard/);
  assert.notEqual(context, roomContext(f.hass, 'vacuum.other_robot'));
  assert.equal(f.calls.length, 0);
});
