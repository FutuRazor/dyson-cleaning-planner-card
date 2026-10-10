import test from 'node:test';
import assert from 'node:assert/strict';
import { discover, sendRoomDraft } from '../src/core.js';
import { batchFixture } from './fixture.mjs';

const model = f => discover(f.hass, f.registry, f.config);
const send = (f, rest) => sendRoomDraft({ hass: f.hass, model: model(f), config: f.config, ...rest });

test('save combines changed options from several rooms into one targeted action', async () => {
  const f = batchFixture();
  await send(f, { draft: { 10: { cleaning_mode: 'Mop', water_level: 'High' }, 11: { mop_repetitions: 'Two Passes', cleaning_strategy: 'Auto' } } });
  assert.deepEqual(f.calls, [{ domain: 'dyson_spot_scrub', service: 'save_room_settings', data: {
    entity_id: f.entity, room_settings: { 10: { cleaning_mode: 'Mop', water_level: 'High' }, 11: { mop_repetitions: 'Two Passes' } }
  } }]);
  assert.equal(f.hass.states[f.entity].state, 'docked');
  assert.ok(f.ids.every(id => f.hass.states[id].state === 'off'));
});

test('start sends room IDs in local order and settings together, independent of global entities', async () => {
  const f = batchFixture(); delete f.hass.states[f.mode]; delete f.hass.states[f.start];
  f.hass.states[f.ids[4]].state = 'unavailable';
  await send(f, { start: true, selected: [f.ids[1], f.ids[0]], draft: { 11: { cleaning_mode: 'Vacuum then Mop' } } });
  assert.deepEqual(f.calls, [{ domain: 'dyson_spot_scrub', service: 'start_rooms_with_settings', data: {
    entity_id: f.entity, room_ids: ['11', '10'], room_settings: { 11: { cleaning_mode: 'Vacuum then Mop' } }
  } }]);
});

test('discovery uses registry identities despite obfuscated entity IDs and refreshed room names', async () => {
  const f = batchFixture();
  f.hass.states[f.entity].attributes.rooms[4] = 'WC';
  for (const row of f.registry) if (row.unique_id.includes('_badezimmer')) row.unique_id = row.unique_id.replace('_badezimmer', '_wc');
  const room = model(f).rooms.find(r => r.name === 'WC');
  assert.equal(room.roomId, '14');
  assert.equal(room.settings.cleaning_mode.entity, f.fields[14].cleaning_mode);
  await send(f, { draft: { 14: { cleaning_mode: 'Mop' } } });
  assert.equal(f.calls[0].data.room_settings[14].cleaning_mode, 'Mop');
});

test('missing batch service never falls back to select, switch or button calls', async () => {
  const f = batchFixture(); delete f.hass.services.dyson_spot_scrub;
  await assert.rejects(send(f, { start: true, selected: [f.ids[0]] }), /integration/);
  assert.equal(f.calls.length, 0);
});

test('invalid drafts and mismatched native IDs are rejected before sending', async () => {
  const f = batchFixture();
  await assert.rejects(send(f, { draft: { 10: { water_level: 'Invented' } } }), /no longer available/);
  await assert.rejects(send(f, { draft: { 99: { cleaning_mode: 'Mop' } } }), /unavailable or ambiguous/);
  f.hass.states[f.fields[10].water_level].attributes.room_id = '99';
  await assert.rejects(send(f, { start: true, selected: [f.ids[0]] }), /stable room ID/);
  assert.equal(f.calls.length, 0);
});

test('unavailable edited setting blocks draft but unrelated unavailable setting does not', async () => {
  const f = batchFixture(); f.hass.states[f.fields[10].water_level].state = 'unavailable';
  await assert.rejects(send(f, { draft: { 10: { water_level: 'High' } } }), /no longer available/);
  await send(f, { start: true, selected: [f.ids[1]] });
  assert.equal(f.calls.length, 1);
});

test('empty save is a no-op; a rejected service is never retried', async () => {
  const f = batchFixture();
  await send(f, { draft: {} }); assert.equal(f.calls.length, 0);
  f.hass.callService = async (...args) => { f.calls.push(args); throw new Error('Rejected'); };
  await assert.rejects(send(f, { start: true, selected: [f.ids[0]] }), /Rejected/);
  assert.equal(f.calls.length, 1);
});

test('concurrent cards cannot submit overlapping batch actions for the same robot', async () => {
  const f = batchFixture(); let finish;
  f.hass.callService = () => new Promise(resolve => { finish = resolve; });
  const first = send(f, { draft: { 10: { cleaning_mode: 'Mop' } } });
  await assert.rejects(send(f, { start: true, selected: [f.ids[1]] }), /already running/);
  finish(); await first;
});
