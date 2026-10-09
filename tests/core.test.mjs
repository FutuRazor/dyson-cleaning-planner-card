import test from 'node:test';
import assert from 'node:assert/strict';
import { discover, createPlan, assertReady, startLegacy, normalizeConfig, waitForState } from '../src/core.js';
import { fixture } from './fixture.mjs';

const modelOf = f => discover(f.hass, f.registry, f.config);
const run = (f, selected = [f.ids[0]], mode = 'Mop', extra = {}) => startLegacy({ getHass: () => f.hass, getModel: () => modelOf(f), config: f.config, plan: createPlan(modelOf(f), selected, mode), ...extra });

test('discovery matches renamed entities, umlauts and only the selected device', () => {
  const f = fixture();
  const row = f.registry.find(e => e.entity_id === f.ids[1]);
  f.hass.states['switch.renamed'] = f.hass.states[f.ids[1]];
  row.entity_id = 'switch.renamed';
  f.registry.push({ ...row, entity_id: 'switch.other_robot', device_id: 'other' });
  const model = modelOf(f);
  assert.equal(model.rooms.find(r => r.name === 'Küche').entity, 'switch.renamed');
  assert.equal(model.rooms.length, 5);
  assert.equal(model.managed.includes('switch.other_robot'), false);
  assert.deepEqual(model.issues, []);
});

test('disabled rooms are excluded even if still on the map; card exclusions stay managed', () => {
  const f = fixture();
  f.hass.states[f.entity].attributes.rooms.push('Wc');
  f.config.excluded_rooms = [f.ids[0]];
  const model = modelOf(f);
  assert.equal(model.rooms.some(r => r.name === 'Wc'), false);
  assert.equal(model.rooms[0].excluded, true);
  assert.equal(model.managed.includes(f.ids[0]), true);
});

test('start writes the global mode and exact room set before pressing once', async () => {
  const f = fixture();
  f.config.excluded_rooms = [f.ids[4]];
  f.hass.states[f.ids[4]].state = 'on';
  await run(f, [f.ids[1], f.ids[0]]);
  assert.equal(f.calls[0].domain, 'select');
  assert.deepEqual(f.calls.at(-1), { domain: 'button', service: 'press', data: { entity_id: f.start } });
  assert.equal(f.calls.filter(c => c.domain === 'button').length, 1);
  assert.equal(f.hass.states[f.ids[4]].state, 'off');
  assert.equal(f.hass.states[f.ids[1]].state, 'on');
  assert.equal(f.hass.states[f.ids[0]].state, 'on');
  assert.equal(f.calls.some(c => c.domain === 'vacuum'), false);
});

test('plan preserves click order without pretending the legacy adapter sends it', () => {
  const f = fixture();
  assert.deepEqual(createPlan(modelOf(f), [f.ids[2], f.ids[0]], 'Vacuum').rooms.map(r => r.name), ['Schlafzimmer', 'Wohnzimmer']);
  assert.equal(f.calls.length, 0);
});

test('unrelated unavailable rooms do not block; selected unavailable rooms still do', async () => {
  const f = fixture();
  assert.throws(() => createPlan(modelOf(f), [], 'Vacuum'));
  await assert.rejects(run(f, [f.ids[0]], 'Invented'), /cleaning mode/i);
  f.hass.states[f.ids[3]].state = 'unavailable';
  await run(f);
  assert.equal(f.calls.filter(c => c.domain === 'button').length, 1);

  const selectedUnavailable = fixture();
  selectedUnavailable.hass.states[selectedUnavailable.ids[0]].state = 'unavailable';
  assert.throws(() => run(selectedUnavailable), /selected room/i);

  const active = fixture();
  active.hass.states[active.entity].state = 'cleaning';
  await assert.rejects(run(active), /Dyson is ready/i);
  assert.equal(active.calls.length, 0);
});

test('service failure never falls through to start', async () => {
  const f = fixture();
  const original = f.hass.callService;
  f.hass.callService = async (...args) => { if (args[0] === 'switch') throw new Error('Denied'); await original(...args); };
  await assert.rejects(run(f), /Denied/);
  assert.equal(f.calls.some(c => c.domain === 'button'), false);
});

test('missing state confirmation prevents start', async () => {
  const f = fixture();
  f.hass.callService = async (...args) => f.calls.push(args);
  await assert.rejects(run(f, [f.ids[0]], 'Mop', { wait: (get, pred) => waitForState(get, pred, { timeout: 5, interval: 2 }) }), /confirm the setting/i);
  assert.equal(f.calls.length, 1);
});

test('external robot activity during preparation prevents subsequent commands', async () => {
  const f = fixture();
  const original = f.hass.callService;
  f.hass.callService = async (...args) => { await original(...args); f.hass.states[f.entity].state = 'cleaning'; };
  await assert.rejects(run(f), /Dyson is ready/i);
  assert.equal(f.calls.length, 1);
});

test('external mode change after room updates prevents button press', async () => {
  const f = fixture();
  const original = f.hass.callService;
  f.hass.callService = async (...args) => { await original(...args); if (args[0] === 'switch') f.hass.states[f.mode].state = 'Vacuum'; };
  await assert.rejects(run(f), /settings changed/i);
  assert.equal(f.calls.some(c => c.domain === 'button'), false);
});

test('start entity state is never validated, including timestamps and absent state', () => {
  const f = fixture(), model = modelOf(f), plan = createPlan(model, [f.ids[0]], 'Vacuum');
  for (const state of ['2026-10-06T17:27:30.003139+00:00', 'unknown', 'unavailable']) {
    f.hass.states[f.start] = { state, attributes: { restored: true } };
    assert.doesNotThrow(() => assertReady(f.hass, model, f.config, plan));
  }
  delete f.hass.states[f.start];
  assert.doesNotThrow(() => assertReady(f.hass, model, f.config, plan));
});

test('configuration validates and retains unrelated dashboard settings', () => {
  assert.throws(() => normalizeConfig({ entity: 'switch.wrong' }));
  assert.throws(() => normalizeConfig({ entity: 'vacuum.robot', excluded_rooms: 'wrong' }));
  assert.equal(normalizeConfig({ entity: 'vacuum.robot', grid_options: { columns: 12 } }).grid_options.columns, 12);
});

test('two card instances cannot interleave start preparation', async () => {
  const f = fixture();
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const original = f.hass.callService;
  f.hass.callService = async (...args) => { await gate; await original(...args); };
  const first = run(f);
  await assert.rejects(run(f), /already running/i);
  release();
  await first;
  assert.equal(f.calls.filter(c => c.domain === 'button').length, 1);
});
