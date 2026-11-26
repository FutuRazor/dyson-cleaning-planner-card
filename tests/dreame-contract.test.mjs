import test from 'node:test';
import assert from 'node:assert/strict';
import {DREAME_REFERENCE,inspectDreameSnapshot,prepareDreameSave,prepareDreameStart,
  createDreameSaveProbe,observeDreameSave} from '../src/adapters/dreame-contract.js';
import {dreameContractFixture,dreameWaterVariant,publishOptimisticDreameSave} from './dreame-contract-fixture.mjs';
import {integrationAdapters,getIntegrationAdapter} from '../src/integration.js';

const inspect=f=>inspectDreameSnapshot(f);
const hasCode=code=>error=>error.code===code;

test('prototype is pinned, offline and absent from runtime adapter selection',()=>{
  const f=dreameContractFixture(), snapshot=inspect(f);
  assert.equal(DREAME_REFERENCE.commit,'fec086caf064f2681e8bcc7be20a0d0ef54f444d');
  assert.equal(snapshot.ready,true);assert.equal(snapshot.ordered,false);
  assert.deepEqual(snapshot.rooms.map(room=>room.name),['Kitchen','Hall']);
  assert.equal(integrationAdapters.some(adapter=>adapter.id==='dreame_vacuum'),false);
  assert.equal(getIntegrationAdapter({entity:f.entity},f.registry,f.hass).id,'ha_rooms');
});

test('room keys survive entity/name edits and remain distinct across maps reusing native room IDs',()=>{
  const f=dreameContractFixture(), before=inspect(f);
  f.hass.states[f.entity].attributes.rooms['Ground floor'][0].name='Renamed Kitchen';
  f.registry.find(row=>row.entity_id===f.fields['1'].suction_level).entity_id='select.renamed_again';
  f.hass.states['select.renamed_again']=f.hass.states[f.fields['1'].suction_level];
  assert.equal(inspect(f).rooms[0].key,before.rooms[0].key);
  const attrs=f.hass.states[f.entity].attributes;
  attrs.selected_map_id=202;attrs.selected_map_index=2;
  f.hass.states[f.camera].attributes.selected=false;f.hass.states[f.upperCamera].attributes.selected=true;
  const upper=inspect(f);
  assert.equal(upper.rooms[0].roomId,1);
  assert.notEqual(upper.rooms[0].key,before.rooms[0].key);
  assert.throws(()=>prepareDreameStart({baseline:before,current:upper,selected:[before.rooms[0].key]}),hasCode('stale_context'));
});

test('missing or contradictory map evidence and duplicate room IDs are rejected without name guessing',()=>{
  for(const kind of ['name','camera','id','catalogue','duplicate','hidden','composite']) {
    const f=dreameContractFixture(), attrs=f.hass.states[f.entity].attributes, camera=f.hass.states[f.camera].attributes;
    if(kind==='name')attrs.maps[1].name=attrs.maps[0].name;
    if(kind==='camera')f.registry=f.registry.filter(row=>row.entity_id!==f.camera);
    if(kind==='id')camera.map_id=202;
    if(kind==='catalogue')delete camera.rooms['1'];
    if(kind==='duplicate')attrs.rooms['Ground floor'].push({...attrs.rooms['Ground floor'][0]});
    if(kind==='hidden')camera.rooms['1'].visibility='Hidden';
    if(kind==='composite')camera.rooms['1'].room_id='1_1';
    assert.throws(()=>inspect(f),undefined,kind);
  }
});

test('native save preserves required companion values and affects only edited rooms',()=>{
  const f=dreameContractFixture(), baseline=inspect(f), key=baseline.rooms[0].key;
  const plan=prepareDreameSave({baseline,draft:{[key]:{water_volume:3}}});
  assert.deepEqual(plan.call,{domain:'dreame_vacuum',service:'vacuum_set_custom_cleaning',data:{entity_id:f.entity,
    segment_id:[1],suction_level:[1],repeats:[1],water_volume:[3]}});
  assert.equal(plan.autoStartAllowed,false);
  assert.equal(prepareDreameSave({baseline,draft:{[key]:{suction_level:1}}}).kind,'noop');
  assert.equal(f.hass.states[f.camera].attributes.rooms['1'].water_volume,2,'building a plan has no effects');
});

test('water controls retain exact native variants, including 32-step wetness without coarse conversion',()=>{
  for(const variant of ['humidity','wetness']) {
    const f=dreameWaterVariant(dreameContractFixture(),variant), baseline=inspect(f), room=baseline.rooms[0];
    const key=variant==='wetness' ? 'wetness_level' : 'water_volume';
    assert.equal(room.controls[key].available,true);
    assert.equal(room.controls[key].options.length,variant==='wetness' ? 32 : 3);
    const plan=prepareDreameSave({baseline,draft:{[room.key]:{[key]:variant==='wetness' ? 17 : 3}}});
    assert.deepEqual(plan.call.data[key],[variant==='wetness' ? 17 : 3]);
    if(variant==='wetness')assert.equal(Object.hasOwn(plan.call.data,'water_volume'),false);
  }
});

test('optimistic water publication updates the active volume, humidity or wetness control',()=>{
  for(const variant of ['volume','humidity','wetness']) {
    const f=variant==='volume'?dreameContractFixture():dreameWaterVariant(dreameContractFixture(),variant);
    const key=variant==='wetness'?'wetness_level':'water_volume';
    const field=variant==='humidity'?'mop_pad_humidity':key;
    const values=variant==='wetness'?[17,32,1]:[3,2,1];
    for(const value of values) {
      const baseline=inspect(f), room=baseline.rooms[0];
      const plan=prepareDreameSave({baseline,draft:{[room.key]:{[key]:value}}});
      publishOptimisticDreameSave(f,plan);
      const control=f.hass.states[f.fields['1'][field]];
      const expected=variant==='humidity'?['','slightly_dry','moist','wet'][value]
        :variant==='volume'?['','low','medium','high'][value]:String(value);
      assert.equal(control.state,expected,`${variant}/${value}`);
      if(variant!=='wetness')assert.equal(control.attributes.value,value);
      assert.equal(inspect(f).rooms[0].native[key],value);
      assert.equal(inspect(f).rooms[0].controls[key].available,true);
    }
  }
});

test('published water-check and self-repair states veto offline plans even when HA reports docked',()=>{
  for(const detail of [{vacuum_state:'water_check'},{status:'water_check'},{status:'self_repair'}]) {
    const f=dreameContractFixture(), baseline=inspect(f);
    Object.assign(f.hass.states[f.entity].attributes,detail);
    assert.equal(f.hass.states[f.entity].state,'docked');
    assert.equal(f.hass.states[f.entity].attributes.started,false);
    assert.equal(f.hass.states[f.entity].attributes.running,false);
    const current=inspect(f), key=baseline.rooms[0].key;
    assert.equal(current.ready,false);
    assert.throws(()=>prepareDreameStart({baseline,current,selected:[key]}),hasCode('not_ready'));
    assert.throws(()=>prepareDreameSave({baseline,current,draft:{[key]:{suction_level:2}}}),hasCode('not_ready'));
  }
  assert.equal(inspect(dreameContractFixture()).ready,true);
});

test('unknown companion baselines, uneditable fields and unsupported fourth cleaning mode block writes',()=>{
  for(const kind of ['missing','unavailable','mode3','unknownfield','range']) {
    const f=dreameContractFixture(), raw=f.hass.states[f.camera].attributes.rooms['1'];
    if(kind==='missing')delete raw.cleaning_times;
    if(kind==='unavailable')f.hass.states[f.fields['1'].suction_level].state='unavailable';
    const baseline=inspect(f), key=baseline.rooms[0].key;
    const values=kind==='missing' ? {water_volume:3} : kind==='mode3' ? {cleaning_mode:3}
      : kind==='unknownfield' ? {room_order:2} : {suction_level:kind==='range' ? 9 : 2};
    assert.throws(()=>prepareDreameSave({baseline,draft:{[key]:values}}),undefined,kind);
  }
});

test('saving a mode in a batch cannot overwrite another room unsupported mode with an invented value',()=>{
  const f=dreameContractFixture();
  f.hass.states[f.camera].attributes.rooms['2'].cleaning_mode=3;
  Object.assign(f.hass.states[f.fields['2'].cleaning_mode],{state:'mopping_after_sweeping',attributes:{value:3,options:['mopping_after_sweeping']}});
  const baseline=inspect(f), [kitchen,hall]=baseline.rooms;
  assert.throws(()=>prepareDreameSave({baseline,draft:{[kitchen.key]:{cleaning_mode:1},[hall.key]:{suction_level:2}}}),hasCode('baseline'));
  const separate=prepareDreameSave({baseline,draft:{[hall.key]:{suction_level:2}}});
  assert.equal(Object.hasOwn(separate.call.data,'cleaning_mode'),false);
});

test('external preference changes, missing services and unsafe robot modes veto plans',()=>{
  for(const kind of ['changed','service','running','temporary','cleangenius','profiles-off','offline']) {
    const f=dreameContractFixture(), baseline=inspect(f), attrs=f.hass.states[f.entity].attributes;
    if(kind==='changed')f.hass.states[f.camera].attributes.rooms['1'].water_volume=1;
    if(kind==='service')delete f.hass.services.dreame_vacuum.vacuum_set_custom_cleaning;
    if(kind==='running')attrs.started=true;
    if(kind==='temporary')attrs.has_temporary_map=true;
    if(kind==='cleangenius')attrs.cleangenius_cleaning=true;
    if(kind==='profiles-off')attrs.customized_cleaning=false;
    if(kind==='offline')f.hass.connected=false;
    const current=inspect(f);
    assert.throws(()=>prepareDreameSave({baseline,current,draft:{[baseline.rooms[0].key]:{suction_level:2}}}),undefined,kind);
  }
});

test('native start accepts current-map room keys only and does not imply submitted cleaning order',()=>{
  const f=dreameContractFixture(), baseline=inspect(f);
  const plan=prepareDreameStart({baseline,selected:baseline.rooms.map(room=>room.key).reverse()});
  assert.deepEqual(plan.call.data,{entity_id:f.entity,segments:[2,1],repeats:[],suction_level:[],water_volume:[]});
  assert.equal(plan.ordered,false);assert.equal(plan.liveVerificationRequired,true);
  for(const selected of [[],['1_1'],[baseline.rooms[0].key,baseline.rooms[0].key]]) {
    assert.throws(()=>prepareDreameStart({baseline,selected}));
  }
  assert.throws(()=>prepareDreameStart({baseline,selected:[baseline.rooms[0].key],draft:{[baseline.rooms[0].key]:{suction_level:2}}}),hasCode('unconfirmed_save'));
});

test('optimistic HA values and service success never confirm a save or authorize automatic Start',()=>{
  const f=dreameContractFixture(), baseline=inspect(f);
  const plan=prepareDreameSave({baseline,draft:{[baseline.rooms[0].key]:{suction_level:2}}});
  let probe=createDreameSaveProbe(plan);
  publishOptimisticDreameSave(f,plan);
  assert.equal(inspect(f).rooms[0].native.suction_level,2);
  for(const event of ['ha_values_matched','service_resolved']) {
    probe=observeDreameSave(probe,{type:event});
    assert.equal(probe.robotConfirmed,false);assert.equal(probe.autoStartAllowed,false);
  }
  assert.equal(probe.serviceAccepted,true);assert.equal(probe.observedInHa,true);
  const current=inspect(f);
  assert.throws(()=>prepareDreameStart({baseline:current,selected:[current.rooms[0].key],pendingSave:probe}),hasCode('unconfirmed_save'));
  assert.throws(()=>observeDreameSave(probe,{type:'invented_robot_ack'}),hasCode('evidence'));
});

test('late background rejection and terminal failures cannot be cleared by more optimistic publications',()=>{
  const f=dreameContractFixture(), baseline=inspect(f);
  const plan=prepareDreameSave({baseline,draft:{[baseline.rooms[0].key]:{suction_level:2}}});
  for(const failure of ['backend_rejected','service_rejected','expired','context_changed']) {
    let probe=observeDreameSave(createDreameSaveProbe(plan),{type:'service_resolved'});
    probe=observeDreameSave(probe,{type:failure});
    probe=observeDreameSave(probe,{type:'ha_values_matched'});
    assert.equal(probe.phase,'unconfirmed_failure');assert.equal(probe.error,failure);
    assert.equal(probe.possibleSideEffect,true);assert.equal(probe.autoStartAllowed,false);
  }
});
