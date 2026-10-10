import test from 'node:test';
import assert from 'node:assert/strict';
import { discover, createPlan, assertReady, startLegacy, normalizeConfig, waitForState, cleaningView, canControl, controlCleaning, fitMap, batteryStatus } from '../src/core.js';
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

test('status view replaces the planner unless the connected robot reports docked or idle', () => {
  const f = fixture();
  for (const state of ['cleaning', 'paused', 'returning', 'error', 'unavailable', 'unknown', 'unexpected']) {
    f.hass.states[f.entity].state = state;
    assert.equal(cleaningView(f.hass, f.entity).active, true, state);
  }
  for (const state of ['docked', 'idle']) {
    f.hass.states[f.entity].state = state;
    assert.equal(cleaningView(f.hass, f.entity).active, false);
    assert.equal(cleaningView(f.hass, f.entity, true).title, 'Starting clean');
  }
  f.hass.connected = false;
  assert.equal(cleaningView(f.hass, f.entity).title, 'Robot unavailable');
  assert.equal(cleaningView(f.hass, f.entity).live, false);
});

test('Stop and Home target the vacuum without clearing room switches or issuing start', async () => {
  const f = fixture();
  f.hass.states[f.entity].state = 'cleaning';
  f.hass.states[f.ids[0]].state = 'on';
  const before = structuredClone(f.hass.states);
  await controlCleaning(f.hass, f.entity, 'stop');
  await controlCleaning(f.hass, f.entity, 'return_to_base');
  assert.deepEqual(f.calls, [
    { domain: 'vacuum', service: 'stop', data: { entity_id: f.entity } },
    { domain: 'vacuum', service: 'return_to_base', data: { entity_id: f.entity } }
  ]);
  assert.deepEqual(f.hass.states, before, 'card must not pretend commands changed robot state');
  await assert.rejects(controlCleaning(f.hass, f.entity, 'start'));
  await assert.rejects(controlCleaning(f.hass, f.entity, 'pause'));
});

test('control availability requires entity features, a registered action and live connection', async () => {
  const f = fixture();
  f.hass.states[f.entity].state = 'paused';
  assert.equal(canControl(f.hass, f.entity, 'stop'), true);
  delete f.hass.services.vacuum.stop;
  assert.equal(canControl(f.hass, f.entity, 'stop'), false);
  f.hass.states[f.entity].attributes.supported_features = 0;
  await assert.rejects(controlCleaning(f.hass, f.entity, 'return_to_base'));
  f.hass.states[f.entity].attributes.supported_features = 12344;
  f.hass.connected = false;
  await assert.rejects(controlCleaning(f.hass, f.entity, 'return_to_base'));
  f.hass.connected = true;
  f.hass.states[f.entity].state = 'docked';
  await assert.rejects(controlCleaning(f.hass, f.entity, 'return_to_base'));
  assert.equal(f.calls.length, 0);
});

test('camera matches registry identity on the same device and remains optional', () => {
  const f = fixture();
  assert.equal(modelOf(f).cameraEntity, f.camera);
  const camera = f.registry.find(row => row.entity_id === f.camera);
  camera.entity_id = 'camera.renamed_map';
  assert.equal(modelOf(f).cameraEntity, 'camera.renamed_map');
  f.registry.push({ ...camera, entity_id: 'camera.other_device', device_id: 'other' });
  f.config.camera_entity = 'camera.other_device';
  assert.equal(modelOf(f).cameraEntity, undefined);
  assert.deepEqual(modelOf(f).issues, []);
  f.config.camera_entity = 'camera.renamed_map';
  camera.disabled_by = 'user';
  assert.equal(modelOf(f).cameraEntity, undefined);
});

test('camera fills the width and preserves the complete image at every rotation', () => {
  assert.equal(normalizeConfig({ entity: 'vacuum.test' }).show_camera, true);
  assert.equal(normalizeConfig({ entity: 'vacuum.test', show_camera: false }).show_camera, false);
  for (const config of [{ camera_rotation: 45 }, { camera_rotation: '90' }, { show_camera: 'false' }, { camera_entity: 'sensor.map' }]) {
    assert.throws(() => normalizeConfig({ entity: 'vacuum.test', ...config }));
  }
  for (const rotation of [0, 90, 180, 270]) {
    for (const [w, h] of [[1200, 600], [300, 1200], [600, 600]]) {
      const size = fitMap(w, h, 340, rotation);
      assert.ok(Math.abs(size.width / size.height - w / h) < 1e-9);
      assert.ok(Math.abs((rotation % 180 ? size.height : size.width) - 340) < 1e-9);
      assert.equal(rotation % 180 ? size.width : size.height, size.frameHeight);
      assert.ok(Math.abs(size.frameHeight - 340 * (rotation % 180 ? w / h : h / w)) < 1e-9);
    }
  }
  assert.deepEqual(fitMap(undefined, 0, 100, 90), { width: 0, height: 0, frameHeight: 0 });
});

test('battery discovery tolerates entity renames and never uses another device or disabled sensors', () => {
  const f = fixture();
  assert.equal(modelOf(f).batteryEntity, f.battery);
  assert.equal(modelOf(f).chargingEntity, f.charging);
  for (const [id, key, renamed] of [[f.battery, 'batteryEntity', 'sensor.renamed'], [f.charging, 'chargingEntity', 'binary_sensor.renamed']]) {
    const entry = f.registry.find(e => e.entity_id === id);
    entry.entity_id = renamed;
    f.registry.unshift({ ...entry, entity_id: `${renamed}_other`, device_id: 'other' });
    assert.equal(modelOf(f)[key], renamed);
    entry.disabled_by = 'user';
    assert.equal(modelOf(f)[key], undefined);
  }
  assert.deepEqual(modelOf(f).issues, [], 'battery sensors are optional');
  const model = modelOf(f);
  assert.doesNotThrow(() => assertReady(f.hass, model, f.config, createPlan(model, [f.ids[0]], 'Vacuum')));
});

test('battery display handles zero, percentages and invalid values without inventing a level', () => {
  const f = fixture(), model = modelOf(f);
  for (const [raw, percent, level] of [['0', 0, 'low'], ['19', 19, 'low'], ['20', 20, 'medium'], ['49', 49, 'medium'], ['50', 50, 'high'], ['100', 100, 'high'], ['67.4', 67, 'high']]) {
    f.hass.states[f.battery].state = raw;
    assert.equal(batteryStatus(f.hass, model).percent, percent);
    assert.equal(batteryStatus(f.hass, model).level, level);
  }
  for (const raw of ['unknown', 'unavailable', '', ' ', 'invalid', '-1', '101', 'Infinity', null]) {
    f.hass.states[f.battery].state = raw;
    assert.equal(batteryStatus(f.hass, model).percent, null);
    assert.equal(batteryStatus(f.hass, model).level, 'unknown');
  }
  f.hass.states[f.battery] = { state: '80', attributes: { restored: true } };
  assert.equal(batteryStatus(f.hass, model).percent, null);
  delete f.hass.states[f.battery];
  assert.equal(batteryStatus(f.hass, model).percent, null);
});

test('charging bolt requires a confirmed on state and a live connection', () => {
  const f = fixture(), model = modelOf(f);
  assert.equal(batteryStatus(f.hass, model).charging, true);
  for (const state of ['off', 'unknown', 'unavailable']) {
    f.hass.states[f.charging].state = state;
    assert.equal(batteryStatus(f.hass, model).charging, false);
  }
  f.hass.states[f.charging].state = 'on';
  f.hass.states[f.charging].attributes.restored = true;
  assert.equal(batteryStatus(f.hass, model).charging, false);
  delete f.hass.states[f.charging].attributes.restored;
  f.hass.connected = false;
  assert.equal(batteryStatus(f.hass, model).charging, false);
  assert.equal(batteryStatus(f.hass, model).percent, null);
  f.hass.connected = true;
  delete f.hass.states[f.charging];
  assert.equal(batteryStatus(f.hass, model).charging, false);
  assert.equal(batteryStatus(f.hass, model).percent, 100);
});
