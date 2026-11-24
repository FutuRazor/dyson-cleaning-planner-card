import test from 'node:test';
import assert from 'node:assert/strict';
import { spotScrubAdapter as adapter } from '../src/adapters/spot-scrub.js';
import { batchFixture } from './fixture.mjs';
import { spotSchedulesFixture } from './spot-schedules-fixture.mjs';

const request=f=>({hass:f.hass,registry:f.registry,config:f.config,context:adapter.roomContext(f.hass,f.entity),
  selected:[f.ids[1],f.ids[0]],days:['tue','thu'],time:'11:15'});

test('Spot+Scrub enabled count follows confirmed schedules or the robot summary when the list is incomplete',()=>{
  const f=spotSchedulesFixture(), count=()=>adapter.scheduleState(f.hass,f.registry,f.entity).enabledCount;
  const attrs=f.hass.states[f.sensor].attributes;
  assert.equal(count(),1);
  attrs.schedules[1].enabled=true;
  assert.equal(count(),2,'confirmed entry state is not held back by an older summary count');
  attrs.in_sync=false;attrs.on=3;
  assert.equal(count(),3,'summary includes enabled schedules not yet known individually');
  attrs.on=null;assert.equal(count(),null);
  attrs.on=-1;assert.equal(count(),null);
  attrs.in_sync=true;attrs.schedules.forEach(s=>{s.enabled=false;});assert.equal(count(),0);
  f.hass.connected=false;assert.equal(count(),null,'unavailable data is not presented as zero');
});

test('Spot+Scrub normalizes saved schedule settings separately from live preferences and handles missing readback',()=>{
  const f=spotSchedulesFixture(), get=()=>adapter.scheduleState(f.hass,f.registry,f.entity).schedules[0];
  assert.equal(get().roomSettings['10'].cleaning_mode,'Vacuum and Mop');
  assert.equal(f.hass.states[f.fields['10'].cleaning_mode].state,'Vacuum');
  get().roomSettings['10'].cleaning_mode='Mop';
  assert.equal(get().roomSettings['10'].cleaning_mode,'Vacuum and Mop','normalized data is detached');
  const raw=f.hass.states[f.sensor].attributes.schedules[0];
  raw.room_settings={'10':{cleaning_mode:'Mop',water_level:99,other:'ignored'},'99':{cleaning_mode:'Vacuum'}};
  assert.deepEqual(get().roomSettings,{'10':{cleaning_mode:'Mop'},'11':{}});
  delete raw.room_settings;
  assert.deepEqual(get().roomSettings,{'10':{},'11':{}});
  assert.equal(adapter.scheduleState(f.hass,f.registry,f.entity).writable,true,'older feature builds remain writable');
});

test('Spot+Scrub discovers same-device schedules and selected rooms independently of global write actions',()=>{
  const f=spotSchedulesFixture(), state=adapter.scheduleState(f.hass,f.registry,f.entity);
  assert.equal(state.supported,true);assert.equal(state.writable,true);assert.equal(state.creationUsesSelectedRooms,true);
  assert.deepEqual(state.schedules[0].roomIds,['10','11']);assert.deepEqual(state.schedules[0].rooms,['Wohnzimmer','Küche']);
  assert.equal(state.roomSelectionKnown,true);assert.equal(state.robotTotal,2);
  const old=batchFixture();assert.equal(adapter.scheduleState(old.hass,old.registry,old.entity).supported,false);
  delete f.hass.services.dyson_spot_scrub.set_schedule;
  assert.equal(adapter.scheduleState(f.hass,f.registry,f.entity).available,true);
  assert.equal(adapter.scheduleState(f.hass,f.registry,f.entity).writable,false);
  assert.equal(adapter.scheduleState(f.hass,f.registry,f.entity).createSupported,false);
});

test('Spot+Scrub creation sends selected native IDs in order and local settings in one schedule-only action',async()=>{
  const f=spotSchedulesFixture(), before=structuredClone(f.hass.states[f.fields['11'].cleaning_mode]);
  await adapter.setSchedule({...request(f),draft:{'11':{cleaning_mode:'Mop',water_level:'High'},'10':{mop_repetitions:'Two Passes'}}});
  assert.deepEqual(f.calls,[{domain:'dyson_spot_scrub',service:'set_schedule',data:{entity_id:f.entity,days:['tue','thu'],time:'11:15',room_ids:['11','10'],room_settings:{'11':{cleaning_mode:'Mop',water_level:'High'},'10':{mop_repetitions:'Two Passes'}}}}]);
  assert.deepEqual(f.hass.states[f.fields['11'].cleaning_mode],before);
  assert.deepEqual(f.plans.get(103).rooms,['11','10']);
  assert.deepEqual(adapter.scheduleState(f.hass,f.registry,f.entity).schedules.find(s=>s.id===103).rooms,['Küche','Wohnzimmer']);
});

test('Spot+Scrub edit/toggle/delete never inherit the room planner draft or change another schedule',async()=>{
  const f=spotSchedulesFixture(), plan=structuredClone(f.plans.get(102));
  await adapter.setSchedule({...request(f),id:102,draft:{'11':{cleaning_mode:'Mop'}}});
  assert.deepEqual(f.calls[0].data,{entity_id:f.entity,schedule_id:102,days:['tue','thu'],time:'11:15'});
  await adapter.setSchedule({hass:f.hass,registry:f.registry,config:f.config,id:102,enabled:true});
  assert.deepEqual(f.calls[1].data,{entity_id:f.entity,schedule_id:102,enabled:true});
  assert.deepEqual(f.plans.get(102),plan);
  await adapter.deleteSchedule({...request(f),id:101});
  assert.deepEqual(f.calls[2].data,{entity_id:f.entity,schedule_id:101});
  assert.equal(f.hass.states[f.sensor].attributes.schedules.length,1);
  assert.equal(f.hass.states[f.sensor].attributes.schedules[0].schedule_id,102);
});

test('Spot+Scrub respects per-model read-only schedules, outages, missing services and sensor identity',async()=>{
  for(const kind of ['read-only','offline','robot-offline','sensor-disabled','sensor-foreign','sensor-duplicate','malformed','service','deleted']) {
    const f=spotSchedulesFixture(), args={...request(f),id:101};
    if(kind==='read-only')f.hass.states[f.sensor].attributes.can_change=false;
    if(kind==='offline')f.hass.connected=false;
    if(kind==='robot-offline')f.hass.states[f.entity].state='unavailable';
    if(kind==='sensor-disabled')f.registry.find(e=>e.entity_id===f.sensor).disabled_by='user';
    if(kind==='sensor-foreign')f.registry.find(e=>e.entity_id===f.sensor).device_id='other';
    if(kind==='sensor-duplicate')f.registry.push({...f.registry.find(e=>e.entity_id===f.sensor),entity_id:'sensor.duplicate'});
    if(kind==='malformed')f.hass.states[f.sensor].attributes.schedules[0].room_ids=['99'];
    if(kind==='service')delete f.hass.services.dyson_spot_scrub.set_schedule;
    if(kind==='deleted')args.id=999;
    await assert.rejects(adapter.setSchedule(args),undefined,kind);
    await assert.rejects(adapter.deleteSchedule(args),undefined,kind);
    assert.equal(f.calls.length,0,kind);
    if(['read-only','robot-offline','service'].includes(kind))assert.equal(adapter.scheduleState(f.hass,f.registry,f.entity).available,true,kind);
  }
});

test('Spot+Scrub rejects empty/duplicate selections, stale maps and invalid room drafts before creation',async()=>{
  for(const kind of ['empty','duplicate','map','unknown-room','id','excluded','unavailable','option','setting','days','time']) {
    const f=spotSchedulesFixture(), args=request(f);
    if(kind==='empty')args.selected=[];
    if(kind==='duplicate')args.selected=[f.ids[0],f.ids[0]];
    if(kind==='map')f.hass.states[f.entity].attributes.map_id='999';
    if(kind==='unknown-room')args.selected=['switch.foreign'];
    if(kind==='id')f.hass.states[f.fields['11'].water_level].attributes.room_id='999';
    if(kind==='excluded')f.config.excluded_rooms=[f.ids[1]];
    if(kind==='unavailable')f.hass.states[f.ids[1]].state='unavailable';
    if(kind==='option')args.draft={'11':{cleaning_mode:'future'}};
    if(kind==='setting')args.draft={'11':{bad:'Mop'}};
    if(kind==='days')args.days=[];
    if(kind==='time')args.time='24:00';
    await assert.rejects(adapter.setSchedule(args),undefined,kind);assert.equal(f.calls.length,0,kind);
  }
});

test('Spot+Scrub room and schedule writes share a lock and do not retry backend errors',async()=>{
  const f=spotSchedulesFixture();let reject;
  f.hass.callService=async(domain,service,data)=>{f.calls.push({domain,service,data});await new Promise((resolve,fail)=>{reject=fail;});};
  const first=adapter.setSchedule(request(f)), rejected=assert.rejects(first,/refused/);
  await assert.rejects(adapter.deleteSchedule({...request(f),id:101}),/already running/);
  await assert.rejects(adapter.sendRoomDraft({...request(f),model:adapter.discover(f.hass,f.registry,f.config),draft:{'11':{cleaning_mode:'Mop'}}}),/already running/);
  reject(new Error('refused'));await rejected;assert.equal(f.calls.length,1);
  f.hass.callService=async()=>{};await adapter.setSchedule({...request(f),id:101});
});

test('Spot+Scrub edits ordered schedule rooms and only explicit settings without importing live preferences',async()=>{
  const f=spotSchedulesFixture(), other=structuredClone(f.plans.get(102)), live=structuredClone(f.hass.states);
  // Saved schedule settings deliberately differ from the general room settings.
  f.plans.get(101).settings['10'].cleaning_mode='Mop';
  await adapter.setSchedule({...request(f),id:101,draft:{'10':{cleaning_mode:'Vacuum'}},
    roomPlan:{roomIds:['11','12','10'],settings:{'11':{cleaning_mode:'Vacuum then Mop',water_level:'High'}}}});
  assert.deepEqual(f.calls[0].data,{entity_id:f.entity,schedule_id:101,days:['tue','thu'],time:'11:15',room_ids:['11','12','10'],room_settings:{'11':{cleaning_mode:'Vacuum then Mop',water_level:'High'}}});
  assert.deepEqual(f.plans.get(101).rooms,['11','12','10']);
  assert.equal(f.plans.get(101).settings['10'].cleaning_mode,'Mop','untouched saved setting is retained');
  assert.equal(f.plans.get(101).settings['11'].cleaning_strategy,'Auto','untouched fields are retained');
  assert.deepEqual(f.plans.get(102),other);
  for(const fields of Object.values(f.fields))for(const entity of Object.values(fields))assert.deepEqual(f.hass.states[entity],live[entity]);
});

test('Spot+Scrub schedule room edits reject stale maps, invalid selection and unavailable settings',async()=>{
  for(const kind of ['empty','duplicate','foreign','map','schedule-map','option','removed-setting','unavailable','id']) {
    const f=spotSchedulesFixture(), args={...request(f),id:101,roomPlan:{roomIds:['11','10'],settings:{'11':{cleaning_mode:'Mop'}}}};
    if(kind==='empty')args.roomPlan.roomIds=[];
    if(kind==='duplicate')args.roomPlan.roomIds=['11','11'];
    if(kind==='foreign')args.roomPlan.roomIds=['999'];
    if(kind==='map')f.hass.states[f.entity].attributes.map_id='999';
    if(kind==='schedule-map')f.hass.states[f.sensor].attributes.schedules[0].map_id='999';
    if(kind==='option')args.roomPlan.settings['11'].cleaning_mode='future';
    if(kind==='removed-setting')args.roomPlan.roomIds=['10'];
    if(kind==='unavailable')f.hass.states[f.fields['11'].cleaning_mode].state='unavailable';
    if(kind==='id')f.hass.states[f.fields['11'].water_level].attributes.room_id='999';
    await assert.rejects(adapter.setSchedule(args),undefined,kind);assert.equal(f.calls.length,0,kind);
  }
  const f=spotSchedulesFixture(), schedule=adapter.scheduleState(f.hass,f.registry,f.entity).schedules[0];
  assert.equal(adapter.scheduleRoomOptions(f.hass,f.registry,f.config,schedule).length,5);
  f.hass.states[f.entity].attributes.map_id='999';
  assert.equal(adapter.scheduleRoomOptions(f.hass,f.registry,f.config,schedule),null);
  await adapter.setSchedule({...request(f),context:adapter.roomContext(f.hass,f.entity),id:101});
  assert.equal(f.calls.length,1,'time-only editing works on a different active map');
});
