import test from 'node:test';
import assert from 'node:assert/strict';
import { haRoomsAdapter as adapter } from '../src/adapters/ha-rooms.js';
import { haRoomsFixture, enableFanSpeed } from './ha-rooms-fixture.mjs';

const request = f => ({...f,model:adapter.discover(f.hass,f.registry,f.config),context:adapter.roomContext(f.hass,f.entity,f.registry),
  start:true,selected:['area:kitchen'],planningDraft:{fan_speed:'Turbo'}});

test('fan control requires the exact feature, service and string options; outages disable without guessed levels', () => {
  const f=enableFanSpeed(haRoomsFixture());
  const field=()=>adapter.planningSettings(f.hass,f.registry,f.config);
  assert.deepEqual(field()[0].options,['Quiet','Balanced','Turbo','Max']);
  assert.equal(field()[0].value,'Balanced');
  assert.equal(field()[0].available,true);
  f.hass.connected=false;
  assert.equal(field()[0].available,false);
  f.hass.connected=true;
  f.hass.states[f.entity].attributes.fan_speed='unexpected';
  assert.equal(field()[0].value,'unexpected');
  for(const options of [[],null,[''],['Quiet',1]]) {
    f.hass.states[f.entity].attributes.fan_speed_list=options;
    assert.deepEqual(field(),[]);
  }
  f.hass.states[f.entity].attributes.fan_speed_list=['Quiet','Quiet'];
  assert.deepEqual(field()[0].options,['Quiet']);
  f.hass.states[f.entity].attributes.supported_features &= ~32;
  assert.deepEqual(field(),[]);
  f.hass.states[f.entity].attributes.supported_features |= 32;
  delete f.hass.services.vacuum.set_fan_speed;
  assert.deepEqual(field(),[]);
  assert.equal(f.calls.length,0);
});

test('explicit fan draft sets exact native value then starts once, rechecking mapping after the write', async () => {
  const f=enableFanSpeed(haRoomsFixture());
  await adapter.sendRoomDraft(request(f));
  assert.deepEqual(f.calls,[
    {domain:'vacuum',service:'set_fan_speed',data:{entity_id:f.entity,fan_speed:'Turbo'}},
    {domain:'vacuum',service:'clean_area',data:{entity_id:f.entity,cleaning_area_id:['kitchen']}},
  ]);
  assert.equal(f.reads.filter(read=>read.type==='config/entity_registry/get').length,2);
});

test('Spot+Scrub cleaning-mode fan API is never presented or written as suction power', async () => {
  for (const options of [['Room settings','Vacuum','Vacuum and Mop','Mop','Vacuum then Mop'],['Room settings','Vacuum']]) {
    const f=enableFanSpeed(haRoomsFixture('dyson_spot_scrub'));
    Object.assign(f.hass.states[f.entity].attributes,{fan_speed:'Room settings',fan_speed_list:options});
    assert.deepEqual(adapter.planningSettings(f.hass,f.registry,f.config),[]);
    await assert.rejects(adapter.sendRoomDraft({...request(f),planningDraft:{fan_speed:'Vacuum'}}),/suction power is no longer available/);
    assert.equal(f.calls.length,0);
    await adapter.sendRoomDraft({...request(f),planningDraft:{}});
    assert.deepEqual(f.calls.map(call=>call.service),['clean_area']);
  }
});

test('untouched or already-current fan speed sends only clean_area', async () => {
  for(const planningDraft of [{},{fan_speed:'Balanced'}]) {
    const f=enableFanSpeed(haRoomsFixture());
    await adapter.sendRoomDraft({...request(f),planningDraft});
    assert.deepEqual(f.calls.map(call=>call.service),['clean_area']);
  }
});

test('invalid fan draft blocks both commands and a stale optional capability cannot silently discard user intent', async () => {
  for(const kind of ['option','feature','service','key']) {
    const f=enableFanSpeed(haRoomsFixture()), r=request(f);
    if(kind==='option')r.planningDraft.fan_speed='not-a-native-option';
    if(kind==='feature')f.hass.states[f.entity].attributes.supported_features &= ~32;
    if(kind==='service')delete f.hass.services.vacuum.set_fan_speed;
    if(kind==='key')r.planningDraft={water_level:'High'};
    assert.equal(adapter.roomPlanningState(f.hass,f.registry,f.config,r.model,{},r.planningDraft).canStart,false);
    await assert.rejects(adapter.sendRoomDraft(r));
    assert.equal(f.calls.length,0,kind);
    assert.equal(adapter.roomPlanningState(f.hass,f.registry,f.config,r.model,{},{}).canStart,true);
  }
});

test('fan failure never starts; failed clean reports partial effect without retry or rollback', async () => {
  for(const fail of ['set_fan_speed','clean_area']) {
    const f=enableFanSpeed(haRoomsFixture());
    f.hass.callService=async(domain,service,data)=>{f.calls.push({domain,service,data});if(service===fail)throw new Error('Transport refused');};
    await assert.rejects(adapter.sendRoomDraft(request(f)),fail==='set_fan_speed' ? /Transport refused/ : /suction power command.*not confirmed/);
    assert.deepEqual(f.calls.map(call=>call.service),fail==='set_fan_speed' ? ['set_fan_speed'] : ['set_fan_speed','clean_area']);
  }
});

test('post-fan changes to lifecycle, readiness, mapping or option list prevent area start', async () => {
  for(const kind of ['detach','config','connection','busy','mapping','option']) {
    const f=enableFanSpeed(haRoomsFixture()), r=request(f);
    let active=true, config=f.config;
    r.getCurrent=()=>({hass:f.hass,registry:f.registry,config,active});
    f.hass.callService=async(domain,service,data)=>{
      f.calls.push({domain,service,data});
      if(kind==='detach')active=false;
      if(kind==='config')config={...config};
      if(kind==='connection')f.hass.connection={};
      if(kind==='busy')f.hass.states[f.entity].state='cleaning';
      if(kind==='mapping')f.registry[0].options.vacuum.area_mapping.kitchen=['99'];
      if(kind==='option')f.hass.states[f.entity].attributes.fan_speed_list=['Quiet'];
    };
    await assert.rejects(adapter.sendRoomDraft(r),/suction power command.*not confirmed/);
    assert.deepEqual(f.calls.map(call=>call.service),['set_fan_speed'],kind);
  }
});

test('a lifecycle change in the promise gap after room validation blocks the next robot command', async () => {
  for(const phase of ['area-only','before-fan','after-fan']) for(const kind of ['detach','config','connection','busy']) {
    const f=enableFanSpeed(haRoomsFixture()), r=request(f);
    if(phase==='area-only')r.planningDraft={};
    let active=true, config=f.config, validations=0;
    r.getCurrent=()=>({hass:f.hass,registry:f.registry,config,active});
    const room=r.model.rooms.find(room=>room.key===r.selected[0]), context=room.context;
    // Queue the transition from the last baseline read in validateRooms(). It
    // runs after validation returns, before sendRoomDraft resumes its await.
    Object.defineProperty(room,'context',{get(){
      if(++validations===(phase==='after-fan'?2:1))queueMicrotask(()=>{
        if(kind==='detach')active=false;
        if(kind==='config')config={...config};
        if(kind==='connection')f.hass.connection={};
        if(kind==='busy')f.hass.states[f.entity].state='cleaning';
      });
      return context;
    }});
    await assert.rejects(adapter.sendRoomDraft(r),phase==='after-fan' ? /suction power command.*not confirmed/ : /selection changed|only available/,`${phase}/${kind}`);
    assert.deepEqual(f.calls.map(call=>call.service),phase==='after-fan'?['set_fan_speed']:[],`${phase}/${kind}`);
  }
});

test('mapping revalidation before fan rejects stale selection without changing the robot setting', async () => {
  const f=enableFanSpeed(haRoomsFixture()), r=request(f), read=f.hass.callWS;
  f.hass.callWS=async message=>{
    const result=await read(message);
    if(message.type==='config/entity_registry/get')result.options.vacuum.area_mapping.kitchen=['99'];
    return result;
  };
  await assert.rejects(adapter.sendRoomDraft(r),/selection changed/);
  assert.equal(f.calls.length,0);
});

test('room-action lock covers the pending fan write and is released after rejection', async () => {
  const f=enableFanSpeed(haRoomsFixture());
  let rejectFan, reached;
  const writing=new Promise(resolve=>{reached=resolve;});
  f.hass.callService=async()=>{reached();await new Promise((_resolve,reject)=>{rejectFan=reject;});};
  const first=adapter.sendRoomDraft(request(f)), rejection=assert.rejects(first,/Fan refused/);
  await writing;
  await assert.rejects(adapter.sendRoomDraft(request(f)),/already running/);
  rejectFan(new Error('Fan refused'));
  await rejection;
  f.hass.callService=async(domain,service,data)=>{f.calls.push({domain,service,data});};
  await adapter.sendRoomDraft({...request(f),planningDraft:{}});
  assert.equal(f.calls.length,1);
});
