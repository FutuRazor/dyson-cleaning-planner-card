import test from 'node:test';
import assert from 'node:assert/strict';
import { hassDysonAdapter as adapter } from '../src/adapters/hass-dyson.js';
import { spotScrubAdapter } from '../src/adapters/spot-scrub.js';
import { hassDysonFixture } from './hass-dyson-fixture.mjs';
import { schedulesFixture } from './schedules-fixture.mjs';
import { batchFixture } from './fixture.mjs';

const request = f => ({hass:f.hass,registry:f.registry,config:f.config,
  context:adapter.roomContext(f.hass,f.entity,f.registry), days:['tue','thu'],time:'10:00'});

test('hass-dyson enabled schedule count distinguishes a complete list from unknown or unavailable data',()=>{
  const f=schedulesFixture(), count=()=>adapter.scheduleState(f.hass,f.registry,f.entity).enabledCount;
  const attrs=f.hass.states[f.sensor].attributes;
  assert.equal(count(),1);
  attrs.schedules[1].enabled=true;assert.equal(count(),2);
  attrs.in_sync=false;assert.equal(count(),null);
  attrs.in_sync=null;assert.equal(count(),null);
  attrs.in_sync=true;attrs.schedules.forEach(s=>{s.enabled=false;});assert.equal(count(),0);
  f.hass.connected=false;assert.equal(count(),null);
});

test('schedules require the same-device registry identity and the integration action', () => {
  const f=schedulesFixture();
  assert.equal(adapter.scheduleState(f.hass,f.registry,f.entity).schedules.length,2);
  assert.equal(adapter.scheduleState(f.hass,f.registry,f.entity).roomSelectionKnown,false);
  assert.equal(adapter.scheduleState(f.hass,f.registry,f.entity).creationUsesStoredRooms,true);
  assert.deepEqual(f.appScheduleRooms.get(101),['Kitchen']);
  const legacy=batchFixture();
  assert.equal(spotScrubAdapter.scheduleState(legacy.hass,legacy.registry,legacy.entity).supported,false);
  const old=hassDysonFixture();
  assert.equal(adapter.scheduleState(old.hass,old.registry,old.entity).supported,false);
  f.registry.find(e=>e.entity_id===f.sensor).device_id='other';
  assert.equal(adapter.scheduleState(f.hass,f.registry,f.entity).supported,false);
  f.registry.find(e=>e.entity_id===f.sensor).device_id='hd-device';
  f.registry.push({...f.registry.find(e=>e.entity_id===f.sensor),entity_id:'sensor.duplicate'});
  assert.equal(adapter.scheduleState(f.hass,f.registry,f.entity).supported,false);
});

test('creating a schedule sends one action with draft settings, without selecting rooms or saving live preferences', async () => {
  const f=schedulesFixture(), before=structuredClone(f.hass.states[f.fields['12'].cleaning_mode]);
  await adapter.setSchedule({...request(f), draft:{'12':{cleaning_mode:'Mop',cleaning_strategy:'Boost',water_level:'High',mop_repetitions:'Two Passes'}}});
  assert.deepEqual(f.calls,[{domain:'hass_dyson',service:'set_robot_schedule',data:{device_id:'hd-device',days:['tue','thu'],time:'10:00',room_modes:{'12':{cleaning_mode:'mop_only',vacuum_power:'boost',hydration:'high',wash_repetitions:2}}}}]);
  assert.deepEqual(f.hass.states[f.fields['12'].cleaning_mode],before);
  assert.deepEqual(adapter.scheduleState(f.hass,f.registry,f.entity).schedules.find(s=>s.id===103).rooms,['Kitchen','Hall']);
  assert.deepEqual(f.appScheduleRooms.get(103),['Hall'],'all names in sensor metadata do not mean all rooms are selected');
});

test('editing time and days preserves activation and rooms; toggling sends only id and state', async () => {
  const f=schedulesFixture();
  await adapter.setSchedule({...request(f),id:102,days:['sun','mon','mon'],time:'09:15',draft:{'12':{cleaning_mode:'Mop'}}});
  assert.deepEqual(f.calls[0].data,{device_id:'hd-device',schedule_id:102,days:['mon','sun'],time:'09:15'});
  assert.equal(adapter.scheduleState(f.hass,f.registry,f.entity).schedules.find(s=>s.id===102).enabled,false);
  await adapter.setSchedule({hass:f.hass,registry:f.registry,config:f.config,id:102,enabled:true});
  assert.deepEqual(f.calls[1].data,{device_id:'hd-device',schedule_id:102,enabled:true});
  assert.equal(adapter.scheduleState(f.hass,f.registry,f.entity).schedules.find(s=>s.id===102).enabled,true);
});

test('offline, malformed or obsolete schedules cannot send actions', async () => {
  for(const kind of ['offline','restored','invalid-list','duplicate-id','old-id','bad-days','bad-time','bad-state']) {
    const f=schedulesFixture(), r={...request(f),id:101};
    if(kind==='offline')f.hass.connected=false;
    if(kind==='restored')f.hass.states[f.sensor].attributes.restored=true;
    if(kind==='invalid-list')f.hass.states[f.sensor].attributes.schedules[0].days=['bad'];
    if(kind==='duplicate-id')f.hass.states[f.sensor].attributes.schedules[1].schedule_id=101;
    if(kind==='old-id')r.id=999;
    if(kind==='bad-days')r.days=[];
    if(kind==='bad-time')r.time='25:00';
    if(kind==='bad-state')r.enabled='on';
    await assert.rejects(adapter.setSchedule(r),undefined,kind);
    assert.equal(f.calls.length,0,kind);
  }
});

test('creation rejects changed maps, unknown fields and missing rooms; editing needs no room draft', async () => {
  for(const kind of ['context','map','room','option','field']) {
    const f=schedulesFixture(), r={...request(f),draft:{'12':{cleaning_mode:'Mop'}}};
    if(kind==='context')r.context='stale';
    if(kind==='map')f.registry.find(e=>e.unique_id==='HD_clean_zone_123_12').unique_id='HD_clean_zone_999_12';
    if(kind==='room')f.hass.states[f.fields['12'].hydration].attributes.room_id=999;
    if(kind==='option')r.draft['12'].cleaning_mode='unknown';
    if(kind==='field')r.draft['12']={unknown:'x'};
    await assert.rejects(adapter.setSchedule(r),undefined,kind);
    assert.equal(f.calls.length,0,kind);
    await adapter.setSchedule({...request(f),id:101});
    assert.equal(f.calls.length,1);
  }
});

test('schedule and room writes share the device lock and failures never retry', async () => {
  const f=schedulesFixture();let release;
  f.hass.callService=async(domain,service,data)=>{f.calls.push({domain,service,data});await new Promise((resolve,reject)=>{release=reject;});};
  const first=adapter.setSchedule(request(f));
  const rejected=assert.rejects(first,/refused/);
  await assert.rejects(adapter.setSchedule({...request(f),id:101}),/already running/);
  await assert.rejects(adapter.sendRoomDraft({...request(f),model:adapter.discover(f.hass,f.registry,f.config),draft:{'12':{cleaning_mode:'Mop'}}}),/already running/);
  release(new Error('refused'));await rejected;
  assert.equal(f.calls.length,1);
  f.hass.callService=async()=>{};
  await adapter.setSchedule({...request(f),id:101});
});

test('deleting one enabled or disabled schedule targets its exact device and id without changing other schedules', async () => {
  for (const id of [101,102]) {
    const f=schedulesFixture(), otherId=id===101?102:101;
    const other=structuredClone(f.hass.states[f.sensor].attributes.schedules.find(s=>s.schedule_id===otherId));
    await adapter.deleteSchedule({...request(f),id});
    assert.deepEqual(f.calls,[{domain:'hass_dyson',service:'delete_robot_schedule',data:{device_id:'hd-device',schedule_id:id}}]);
    assert.deepEqual(f.hass.states[f.sensor].attributes.schedules,[other]);
    assert.equal(f.appScheduleRooms.has(id),false);
    assert.equal(f.appScheduleRooms.has(otherId),true);
  }
});

test('delete rejects unsupported, unavailable, unknown and foreign targets before sending', async () => {
  for (const kind of ['service','offline','sensor','id','unsafe-id','device']) {
    const f=schedulesFixture(), r={...request(f),id:101};
    if(kind==='service')delete f.hass.services.hass_dyson.delete_robot_schedule;
    if(kind==='offline')f.hass.connected=false;
    if(kind==='sensor')f.hass.states[f.sensor].state='unavailable';
    if(kind==='id')r.id=999;
    if(kind==='unsafe-id')r.id=Number.MAX_SAFE_INTEGER+1;
    if(kind==='device')f.registry.find(e=>e.entity_id===f.sensor).device_id='other-device';
    await assert.rejects(adapter.deleteSchedule(r),undefined,kind);
    assert.equal(f.calls.length,0,kind);
    assert.equal(f.hass.states[f.sensor].attributes.schedules.length,2,kind);
  }
  assert.equal(typeof spotScrubAdapter.deleteSchedule,'function');
});

test('pending delete locks other schedule and room writes; errors preserve state and release the lock without retries', async () => {
  const f=schedulesFixture(), originalCall=f.hass.callService;let rejectDelete;
  f.hass.callService=async(domain,service,data)=>{
    f.calls.push({domain,service,data});await new Promise((resolve,reject)=>{rejectDelete=reject;});
  };
  const first=adapter.deleteSchedule({...request(f),id:101});
  const rejected=assert.rejects(first,/delete refused/);
  await assert.rejects(adapter.deleteSchedule({...request(f),id:101}),/already running/);
  await assert.rejects(adapter.setSchedule({...request(f),id:102}),/already running/);
  await assert.rejects(adapter.sendRoomDraft({...request(f),model:adapter.discover(f.hass,f.registry,f.config),draft:{'12':{cleaning_mode:'Mop'}}}),/already running/);
  rejectDelete(new Error('delete refused'));await rejected;
  assert.equal(f.calls.length,1);
  assert.equal(f.hass.states[f.sensor].attributes.schedules.length,2);
  f.hass.callService=originalCall;
  await adapter.deleteSchedule({...request(f),id:101});
  assert.equal(f.calls.length,2);
});
