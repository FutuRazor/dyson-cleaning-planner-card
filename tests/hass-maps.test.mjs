import test from 'node:test';
import assert from 'node:assert/strict';
import {hassDysonAdapter as adapter} from '../src/adapters/hass-dyson.js';
import {hassMapsFixture,hassMapA as a,hassMapB as b} from './hass-maps-fixture.mjs';
const discover=f=>adapter.discover(f.hass,f.registry,f.config);
const request=f=>({hass:f.hass,registry:f.registry,config:f.config,model:discover(f),context:adapter.roomContext(f.hass,f.entity,f.registry)});

test('reported map selects map-qualified buttons and correct names despite stale setting-select names',()=>{
  const f=hassMapsFixture(),model=discover(f),state=adapter.mapSelectionState(f.hass,f.registry,f.entity);
  assert.equal(model.mapId,a);assert.equal(model.storedSettingsOnly,true);assert.equal(model.startBlockReason,null);
  assert.deepEqual(model.rooms.map(room=>room.name),['Wohnzimmer','Schlafzimmer']);
  assert.ok(model.rooms.every(room=>room.available&&room.settings&&Object.keys(room.settings).length===0));
  assert.equal(state.currentId,a);assert.equal(state.readOnly,true);assert.equal(state.canChange,false);
  assert.deepEqual(state.maps.map(map=>[map.map_id,map.name]),[[a,'Main Floor'],[b,'Upper Floor']]);
  assert.equal(adapter.roomPlanningState(f.hass,f.registry,f.config,model).supportsSave,false);
  assert.equal(adapter.roomPlanningState(f.hass,f.registry,f.config,model).canStart,true);
});

test('same room IDs on two maps have separate keys and starts send one explicit map with selected rooms',async()=>{
  const f=hassMapsFixture(),first=discover(f);
  await adapter.sendRoomDraft({...request(f),start:true,selected:first.rooms.map(room=>room.key)});
  assert.deepEqual(f.calls,[{domain:'hass_dyson',service:'start_zone_clean',data:{device_id:'hd-device',zones:['12','10'],map:a}}]);
  f.report(b);const second=discover(f);
  assert.deepEqual(second.rooms.map(room=>room.name),['Essbereich']);
  assert.notEqual(first.rooms.find(room=>room.roomId==='10').key,second.rooms[0].key);
  assert.notEqual(first.rooms[0].context,second.rooms[0].context);
  await adapter.sendRoomDraft({...request(f),start:true,selected:[second.rooms[0].key]});
  assert.deepEqual(f.calls[1],{domain:'hass_dyson',service:'start_zone_clean',data:{device_id:'hd-device',zones:['10'],map:b}});
});

test('fallback starts do not require current-map setting selects or the Save service',async()=>{
  const f=hassMapsFixture();
  for(const row of f.registry.filter(row=>row.entity_id.startsWith('select.')))delete f.hass.states[row.entity_id];
  delete f.hass.services.hass_dyson.set_room_cleaning_modes;
  const model=discover(f);
  assert.equal(adapter.roomPlanningState(f.hass,f.registry,f.config,model).canStart,true);
  await adapter.sendRoomDraft({...request(f),start:true,selected:[model.rooms[0].key]});
  assert.deepEqual(f.calls.map(call=>call.service),['start_zone_clean']);
});

test('unqualified preference writes are rejected in multi-map mode',async()=>{
  for(const start of [false,true]) {
    const f=hassMapsFixture(),r=request(f);
    await assert.rejects(adapter.sendRoomDraft({...r,start,selected:[r.model.rooms[0].key],draft:{'12':{cleaning_mode:'Mop'}}}),/saved room settings/);
    assert.deepEqual(f.calls,[]);
  }
});

test('unknown, unavailable and ambiguous reported maps never infer a target from room names',async()=>{
  for(const mutate of [f=>f.report('0'),f=>f.report('999999999'),f=>{f.hass.states[f.mapSensor].state='unavailable';},
    f=>{delete f.hass.states[f.mapSensor];},f=>f.registry.push({...f.registry.find(row=>row.entity_id===f.mapSensor),entity_id:'sensor.duplicate_map'})]) {
    const f=hassMapsFixture(),oldKey=discover(f).rooms[0].key;mutate(f);
    assert.equal(discover(f).mapId,null);assert.equal(discover(f).rooms.length,0);
    await assert.rejects(adapter.sendRoomDraft({...request(f),start:true,selected:[oldKey]}));
    assert.deepEqual(f.calls,[]);
  }
});

test('same-device registry identity ignores foreign sensors and buttons and tolerates renamed entities',()=>{
  const f=hassMapsFixture();
  f.registry.push({...f.registry.find(row=>row.entity_id===f.mapSensor),entity_id:'sensor.foreign',device_id:'other-device'});
  f.registry.push({...f.registry.find(row=>row.entity_id===f.bButton),entity_id:'button.foreign',platform:'dyson_spot_scrub'});
  assert.equal(discover(f).mapId,a);assert.equal(discover(f).rooms.length,2);
  const entry=f.registry.find(row=>row.entity_id===f.mapSensor),old=entry.entity_id;
  entry.entity_id='sensor.manually_renamed';f.hass.states[entry.entity_id]=f.hass.states[old];delete f.hass.states[old];
  assert.equal(discover(f).mapId,a);
});

test('duplicate, disabled and unavailable room buttons cannot authorize their room',async()=>{
  for(const mutate of [f=>{f.hass.states['button.renamed_12'].state='unavailable';},
    f=>{f.registry.find(row=>row.entity_id==='button.renamed_12').disabled_by='user';},
    f=>f.registry.push({...f.registry.find(row=>row.entity_id==='button.renamed_12'),entity_id:'button.duplicate_room'})]) {
    const f=hassMapsFixture(),key=discover(f).rooms[0].key;mutate(f);
    await assert.rejects(adapter.sendRoomDraft({...request(f),start:true,selected:[key]}));assert.deepEqual(f.calls,[]);
  }
});

test('last reported map is accepted until its own sensor changes, with no source-age gate',()=>{
  const f=hassMapsFixture();
  for(const source of ['robot','cloud','restored','last_visited','clean_history']) {
    f.report(a,source);assert.equal(discover(f).mapId,a);
    assert.equal(adapter.roomPlanningState(f.hass,f.registry,f.config,discover(f)).canStart,true);
  }
  f.report(b);assert.equal(discover(f).mapId,b);assert.deepEqual(f.calls,[]);
});

test('reported map and lifecycle changes before dispatch reject the obsolete selection without retry',async()=>{
  for(const change of ['map','removed','config']) {
    const f=hassMapsFixture(),r=request(f);let reads=0;
    await assert.rejects(adapter.sendRoomDraft({...r,start:true,selected:[r.model.rooms[0].key],getCurrent:()=>{
      if(++reads===2&&change==='map')f.report(b);
      return {hass:f.hass,registry:f.registry,config:reads===2&&change==='config'?{...f.config}:f.config,active:!(reads===2&&change==='removed')};
    }}));
    assert.deepEqual(f.calls,[]);
  }
});

test('fallback retains readiness interlocks and rejected starts never retry',async()=>{
  const f=hassMapsFixture(),key=discover(f).rooms[0].key;
  f.hass.states[f.dock].state='WASHING_MOP';
  await assert.rejects(adapter.sendRoomDraft({...request(f),start:true,selected:[key]}));assert.deepEqual(f.calls,[]);
  f.hass.states[f.dock].state='IDLE';f.hass.callService=async(...args)=>{f.calls.push(args);throw new Error('Start rejected');};
  await assert.rejects(adapter.sendRoomDraft({...request(f),start:true,selected:[key]}),/Start rejected/);
  assert.equal(f.calls.length,1);
});

test('display names with parentheses or shared floor names do not affect map identity',async()=>{
  const f=hassMapsFixture();
  f.registry.find(row=>row.entity_id==='button.renamed_10').original_name='Clean Schlafzimmer (Kind) (Etage (Nord))';
  f.registry.find(row=>row.entity_id===f.bButton).original_name='Clean Essbereich (Etage (Nord))';
  assert.equal(discover(f).rooms.find(room=>room.roomId==='10').name,'Schlafzimmer (Kind)');
  f.report(b);f.hass.states[f.mapSensor].state='Etage (Nord)';
  const model=discover(f);assert.equal(model.mapId,b);assert.equal(model.rooms[0].name,'Essbereich');
  await adapter.sendRoomDraft({...request(f),start:true,selected:[model.rooms[0].key]});
  assert.equal(f.calls[0].data.map,b);
});

test('schedule creation stays unavailable while fallback room settings have no verified map context',async()=>{
  const f=hassMapsFixture(),sensor='sensor.schedules';
  f.registry.push({entity_id:sensor,unique_id:'HD_jdm_schedules',platform:'hass_dyson',device_id:'hd-device'});
  f.hass.states[sensor]={state:'0',attributes:{schedules:[],in_sync:true}};
  f.hass.services.hass_dyson.set_robot_schedule={};
  assert.equal(adapter.scheduleState(f.hass,f.registry,f.entity).createSupported,false);
  await assert.rejects(adapter.setSchedule({hass:f.hass,registry:f.registry,config:f.config,days:['mon'],time:'08:30',
    context:adapter.roomContext(f.hass,f.entity,f.registry)}),/saved room settings/);
  assert.deepEqual(f.calls,[]);
});
