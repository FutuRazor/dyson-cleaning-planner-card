import test from 'node:test';
import assert from 'node:assert/strict';
import { discover, normalizeConfig, consumableStatus, stationSettings, stationActions, zoneDeviceOptions, supportsZoneDevice } from '../src/core.js';
import { batchFixture, addStationFixture } from './fixture.mjs';

test('registered room settings remain visible offline, missing and disabled settings do not', () => {
  const f=batchFixture(), model=()=>discover(f.hass,f.registry,normalizeConfig(f.config));
  const before=model();
  f.hass.states[f.fields[10].water_level].state='unavailable';
  assert.equal(model().rooms[0].settings.water_level.available,false);
  assert.equal(model().rooms[0].settings.water_level.options.length,4);
  delete f.hass.states[f.fields[10].water_level];
  const after=discover(f.hass,f.registry,normalizeConfig(f.config),before.rooms);
  assert.equal(after.rooms[0].settings.water_level.options.length,4);
  assert.equal(after.rooms[0].settings.water_level.available,false);
  f.registry=f.registry.filter(e=>e.entity_id!==f.fields[10].water_level);
  assert.equal(model().rooms[0].settings.water_level,undefined);
  f.registry.find(e=>e.entity_id===f.fields[10].cleaning_strategy).disabled_by='user';
  assert.equal(model().rooms[0].settings.cleaning_strategy,undefined);
});

test('R1 hides mop controls and R2 exposes only its water and drying options', () => {
  const f=addStationFixture(batchFixture());
  for (const fields of Object.values(f.fields)) {
    f.hass.states[fields.water_level].attributes.options=['Low','Medium','High'];
    f.hass.states[fields.water_level].state='Low';
  }
  let caps=zoneDeviceOptions(discover(f.hass,f.registry,normalizeConfig(f.config)).rooms);
  assert.deepEqual(caps.water.options.map(x=>x[1]),['low','medium','high']);
  f.hass.states['select.renamed_station_5'].attributes.options=['2 hours','3 hours','4 hours'];
  assert.deepEqual(stationSettings(f.hass,f.registry,f.entity).at(-1).options,['2 hours','3 hours','4 hours']);
  f.registry=f.registry.filter(e=>!e.unique_id.includes('_station_') && !e.unique_id.endsWith('_water_level') && !e.unique_id.endsWith('_wash_mop') && !e.unique_id.endsWith('_dry_mop'));
  for (const fields of Object.values(f.fields)) f.hass.states[fields.cleaning_mode].attributes.options=['Vacuum'];
  caps=zoneDeviceOptions(discover(f.hass,f.registry,normalizeConfig(f.config)).rooms);
  assert.deepEqual(caps.mode.options,[['Vacuum','vacuum']]);
  assert.equal(caps.water.supported,false);
  assert.equal(stationSettings(f.hass,f.registry,f.entity).filter(x=>x.supported).length,0);
  assert.deepEqual(stationActions(f.hass,f.registry,f.entity).filter(x=>x.supported).map(x=>x.key),['empty_bin']);
});

test('mop pad discovery survives missing states and never borrows another robot consumable', () => {
  const f=batchFixture();
  f.registry.push({entity_id:'sensor.custom_pad',device_id:'demo-device',platform:'dyson_spot_scrub',unique_id:'DEMO_consumable_mop_pad_usage'});
  f.hass.states['sensor.custom_pad']={state:'12',attributes:{consumable_type:'mopPad',value_kind:'usage_percent'}};
  const rows=()=>consumableStatus(f.hass,f.registry,f.entity).filter(x=>x.supported);
  assert.deepEqual(rows().map(x=>[x.type,x.remaining]),[['mopPad',88]]);
  delete f.hass.states['sensor.custom_pad'];
  assert.deepEqual(rows().map(x=>[x.type,x.remaining]),[['mopPad',null]]);
  f.registry.at(-1).device_id='other'; assert.deepEqual(rows(),[]);
});

test('station support is independent of busy and unreachable states; zone support is device-specific', () => {
  const f=addStationFixture(batchFixture());
  for (const row of f.registry.filter(e=>e.unique_id.includes('_station_') || e.entity_id.startsWith('button.'))) delete f.hass.states[row.entity_id];
  f.hass.connected=false;
  assert.equal(stationSettings(f.hass,f.registry,f.entity).filter(x=>x.supported).length,6);
  assert.equal(stationSettings(f.hass,f.registry,f.entity).some(x=>x.available),false);
  assert.equal(stationActions(f.hass,f.registry,f.entity).filter(x=>x.supported).length,3);
  assert.equal(stationActions(f.hass,f.registry,f.entity).some(x=>x.available),false);
  for (const model of ['804','804A','RB05']) assert.equal(supportsZoneDevice(f.registry,[{id:'demo-device',model}],f.entity),true);
  for (const model of ['914','RB07','unknown']) assert.equal(supportsZoneDevice(f.registry,[{id:'demo-device',model}],f.entity),false);
  assert.equal(supportsZoneDevice(f.registry,[{id:'other',model:'804'}],f.entity),false);
});
