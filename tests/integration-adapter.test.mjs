import test from 'node:test';
import assert from 'node:assert/strict';
import { getIntegrationAdapter } from '../src/integration.js';
import { spotScrubAdapter } from '../src/adapters/spot-scrub.js';
import { sendRoomDraft } from '../src/core.js';
import { batchFixture } from './fixture.mjs';

test('Spot+Scrub adapter lists only its own entities and never discovers another platform', () => {
  const f = batchFixture(), adapter = getIntegrationAdapter();
  assert.equal(adapter, spotScrubAdapter);
  const foreign = f.registry.map(e => ({ ...e, entity_id: e.entity_id + '_other', platform: 'hass_dyson' }));
  const registry = [...foreign, ...f.registry];
  assert.deepEqual(adapter.vacuumEntries(registry).map(e => e.entity_id), [f.entity]);
  assert.deepEqual(adapter.cameraEntries(registry, f.entity).map(e => e.entity_id), [f.camera]);
  assert.equal(adapter.discover(f.hass, registry, f.config).rooms.length, 5);
  assert.equal(adapter.discover(f.hass, registry, { ...f.config, entity: f.entity + '_other' }).rooms.length, 0);
  assert.equal(adapter.trustedCamera(registry, f.entity, f.camera + '_other'), false);
  assert.equal(adapter.trustedCamera(registry, f.entity, f.camera), true);
  assert.equal(adapter.defaultEntity({ ...f.hass, entities: registry }), f.entity);
  f.hass.states[f.entity].state = 'unavailable';
  assert.equal(getIntegrationAdapter(), adapter);
  assert.equal(adapter.discover(f.hass, registry, f.config).cameraEntity, f.camera);
});

test('adapter and compatibility facade share the same in-flight room action lock', async () => {
  const f = batchFixture(), adapter = getIntegrationAdapter();
  let release;
  f.hass.callService = () => new Promise(resolve => { release = resolve; });
  const request = { hass:f.hass, model:adapter.discover(f.hass, f.registry, f.config), config:f.config, draft:{ '10':{ cleaning_mode:'Mop' } } };
  const pending = adapter.sendRoomDraft(request);
  try {
    await assert.rejects(sendRoomDraft(request), /already running/);
  } finally { release(); }
  await pending;
  assert.equal((await sendRoomDraft({ ...request, draft:{} })).sent, false);
});

test('telemetry keeps fault, dock activity and map metadata behind the adapter', () => {
  const f = batchFixture(), adapter = getIntegrationAdapter();
  Object.assign(f.hass.states[f.entity], { state:'cleaning', attributes:{ map_id:7, fault:'Check roller', fault_code:'roller', dock_state:'DRYING_MOP' } });
  f.hass.states[f.camera].attributes.robot_bumper_color = '#112233';
  const calibration = { version:1 };
  f.hass.states[f.camera].attributes.map_calibration = calibration;
  assert.deepEqual(adapter.robotTelemetry(f.hass, f.entity, f.camera), {
    state:'cleaning', available:true, name:undefined, dockState:'DRYING_MOP', fault:'Check roller', faultCode:'roller', cleaning:false, bumperColor:'#112233',
  });
  assert.equal(adapter.dockActivity(f.hass, f.entity).drying, true);
  assert.equal(adapter.mapCalibration(f.hass, f.camera), calibration);
  assert.equal(adapter.mapId(f.hass, f.entity), 7);
  assert.equal(adapter.mapPicture(f.hass, f.camera), `/api/camera_proxy/${f.camera}`);
  f.hass.states[f.camera].state = 'unavailable';
  assert.equal(adapter.robotTelemetry(f.hass, f.entity, f.camera).bumperColor, undefined);
});

test('zone dispatch preserves geometry, setting values and one service call through the adapter', async () => {
  const f = batchFixture(), adapter = getIntegrationAdapter();
  const calibration = { version:1, map_id:'7', units:'m', image_width:1000, image_height:800, pixels_per_metre:100, padding:0, min_x:0, max_y:8, image_sha256:'a'.repeat(64) };
  Object.assign(f.hass.states[f.entity].attributes, { map_id:7, ready_to_start:true });
  f.hass.states[f.camera].attributes.map_calibration = calibration;
  f.hass.services.dyson_spot_scrub.clean_zone = {};
  const request = { vacuum:f.entity, camera:f.camera, calibration, trusted:true, preview:false, rect:[.2,.25,.6,.75], rotation:0, mode:'vacuum', strategy:'boost', water:'high', passes:2 };
  await adapter.startZone(f.hass, request);
  assert.deepEqual(f.calls, [{ domain:'dyson_spot_scrub', service:'clean_zone', data:{ entity_id:f.entity, map_id:'7', rectangle:[2,2,6,6], clean_type:'vacuum', cleaning_strategy:'boost', water_level:'low', mop_passes:2, dry_passes:1 } }]);
  f.hass.states[f.entity].attributes.map_id = 8;
  assert.throws(() => adapter.startZone(f.hass, request), /not available/);
  assert.equal(f.calls.length, 1);
  f.hass.states[f.entity].attributes.map_id = 7;
  const rejection = new Error('Backend refused');
  let calls = 0;
  f.hass.callService = async () => { calls++; throw rejection; };
  await assert.rejects(adapter.startZone(f.hass, request), error => error === rejection);
  assert.equal(calls, 1);
});

