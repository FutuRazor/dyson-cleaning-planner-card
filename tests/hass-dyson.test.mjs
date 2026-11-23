import test from 'node:test';
import assert from 'node:assert/strict';
import { hassDysonAdapter as adapter } from '../src/adapters/hass-dyson.js';
import { spotScrubAdapter } from '../src/adapters/spot-scrub.js';
import { getIntegrationAdapter, defaultIntegrationEntity, integrationVacuumEntries } from '../src/integration.js';
import { normalizeConfig } from '../src/shared.js';
import { hassDysonFixture } from './hass-dyson-fixture.mjs';
import { batchFixture } from './fixture.mjs';

const request = f => ({ hass:f.hass, registry:f.registry, config:f.config, model:adapter.discover(f.hass,f.registry,f.config), context:adapter.roomContext(f.hass,f.entity,f.registry) });

test('automatic initial choice prefers Spot+Scrub; configured offline robot and explicit choice remain authoritative', () => {
  const f = hassDysonFixture(), spot = batchFixture(), registry = [...f.registry,...spot.registry];
  const hass = {...f.hass,entities:Object.fromEntries(registry.map(e=>[e.entity_id,e]))};
  assert.equal(defaultIntegrationEntity(hass), spot.entity);
  assert.equal(defaultIntegrationEntity(hass,{integration:'hass_dyson'}), f.entity);
  f.hass.states[f.entity].state='unavailable';
  assert.equal(getIntegrationAdapter({entity:f.entity},registry,hass),adapter);
  assert.equal(getIntegrationAdapter({entity:f.entity,integration:'dyson_spot_scrub'},registry,hass),spotScrubAdapter);
  assert.deepEqual(integrationVacuumEntries({integration:'hass_dyson'},registry).map(e=>e.entity_id),[f.entity]);
  assert.equal(normalizeConfig({entity:f.entity,camera_entity:f.image}).camera_entity,f.image);
  assert.throws(()=>normalizeConfig({entity:f.entity,integration:'other'}), /integration/);
});

test('native-ID selects discover renamed rooms, map, options and optional entities without switches', () => {
  const f=hassDysonFixture(), model=adapter.discover(f.hass,f.registry,f.config);
  assert.deepEqual(model.rooms.map(r=>r.name),['Kitchen','Hall']);
  assert.equal(model.rooms[0].entity,f.fields['12'].cleaning_mode);
  assert.equal(model.mapId,'123');
  assert.equal(model.cameraEntity,f.image);
  assert.equal(model.batteryEntity,f.battery);
  assert.equal(model.chargingEntity,f.charging);
  assert.deepEqual(model.rooms[0].settings.mop_repetitions.options,['One Pass','Two Passes']);
  assert.equal(model.rooms[0].settings.cleaning_strategy.value,'Auto');
  assert.equal(adapter.batteryStatus(f.hass,model).percent,87);
  assert.equal(adapter.supportsZoneDevice(f.registry,[{id:'hd-device',model:'804'}],f.entity),false);
});

test('save translates all fields, includes edited unselected rooms and never starts', async () => {
  const f=hassDysonFixture();
  const draft={'12':{cleaning_mode:'Mop',cleaning_strategy:'Boost',water_level:'High',mop_repetitions:'Two Passes'},'10':{water_level:'Low'}};
  await adapter.sendRoomDraft({...request(f),draft});
  assert.deepEqual(f.calls,[{domain:'hass_dyson',service:'set_room_cleaning_modes',data:{device_id:'hd-device',room_modes:{'12':{cleaning_mode:'mop_only',vacuum_power:'boost',hydration:'high',wash_repetitions:2},'10':{hydration:'low'}}}}]);
  assert.equal(adapter.discover(f.hass,f.registry,f.config).rooms[0].settings.cleaning_mode.value,'Mop');
  assert.equal((await adapter.sendRoomDraft({...request(f),draft})).sent,false);
  assert.equal(f.calls.length,1);
});

test('start saves first then targets explicit map and selected IDs without a global mode override', async () => {
  const f=hassDysonFixture(), r=request(f);
  await adapter.sendRoomDraft({...r,start:true,selected:[f.fields['10'].cleaning_mode,f.fields['12'].cleaning_mode],draft:{'12':{cleaning_mode:'Mop'}}});
  assert.deepEqual(f.calls.map(c=>c.service),['set_room_cleaning_modes','start_zone_clean']);
  assert.deepEqual(f.calls[1].data,{device_id:'hd-device',zones:['10','12'],map:'123'});
  assert.equal(Object.hasOwn(f.calls[1].data,'cleaning_mode'),false);
});

test('start without edits needs only start action; absent Save is rejected before writes when edits exist', async () => {
  const f=hassDysonFixture();delete f.hass.services.hass_dyson.set_room_cleaning_modes;
  await assert.rejects(adapter.sendRoomDraft({...request(f),start:true,selected:[f.fields['12'].cleaning_mode],draft:{'12':{cleaning_mode:'Mop'}}}), /set_room_cleaning_modes/);
  assert.equal(f.calls.length,0);
  await adapter.sendRoomDraft({...request(f),start:true,selected:[f.fields['12'].cleaning_mode]});
  assert.equal(f.calls.length,1);
});

test('save rejection prevents start; start failure reports settings already persisted and never retries', async () => {
  const f=hassDysonFixture(), r=request(f), selected=[f.fields['12'].cleaning_mode], draft={'12':{cleaning_mode:'Mop'}};
  f.hass.callService=async (domain,service)=>{f.calls.push(service);throw new Error('refused');};
  await assert.rejects(adapter.sendRoomDraft({...r,start:true,selected,draft}),/refused/);
  assert.deepEqual(f.calls,['set_room_cleaning_modes']);
  f.calls.length=0;
  f.hass.callService=async (domain,service)=>{f.calls.push(service);if(service==='start_zone_clean')throw new Error('start refused');};
  await assert.rejects(adapter.sendRoomDraft({...r,start:true,selected,draft}),/Settings were saved.*start refused/);
  assert.deepEqual(f.calls,['set_room_cleaning_modes','start_zone_clean']);
});

test('map changes during save, invalid room IDs, unavailable fields and unknown options never authorize a start', async () => {
  for(const kind of ['map','identity','unavailable','option']) {
    const f=hassDysonFixture(), r=request(f), draft={'12':{cleaning_mode:'Mop'}};
    if(kind==='map')f.hass.callService=async(domain,service)=>{f.calls.push(service);f.registry.find(e=>e.unique_id==='HD_clean_zone_123_12').unique_id='HD_clean_zone_456_12';};
    if(kind==='identity')f.hass.states[f.fields['12'].hydration].attributes.room_id=99;
    if(kind==='unavailable')f.hass.states[f.fields['12'].cleaning_mode].state='unavailable';
    if(kind==='option')f.hass.states[f.fields['12'].cleaning_mode].attributes.options=['vacuum_only'];
    await assert.rejects(adapter.sendRoomDraft({...r,start:true,selected:[f.fields['12'].cleaning_mode],draft}));
    assert.equal(f.calls.length,kind==='map'?1:0,kind);
  }
});

test('ambiguous multi-map IDs block Start and raw mapping/mid-job charging states cannot pass readiness', async () => {
  const f=hassDysonFixture();
  for(const id of ['12','10'])f.registry.push({entity_id:`button.other_${id}`,unique_id:`HD_clean_zone_999_${id}`,platform:'hass_dyson',device_id:'hd-device'});
  const model=adapter.discover(f.hass,f.registry,f.config);
  assert.equal(model.mapId,null);assert.ok(model.startBlockReason);
  await assert.rejects(adapter.sendRoomDraft({...request(f),start:true,selected:[f.fields['12'].cleaning_mode]}), /map/);
  assert.equal(f.calls.length,0);
  for(const raw of ['MAPPING_RUNNING','FULL_CLEAN_CHARGING','FAULT_ON_DOCK_CHARGING',undefined]) {
    f.hass.states[f.entity].attributes.raw_state=raw;assert.ok(adapter.startBlockReason(f.hass,f.entity,f.registry));
  }
});

test('room action lock spans both save/start steps and is released on rejection', async () => {
  const f=hassDysonFixture(), r=request(f), draft={'12':{cleaning_mode:'Mop'}};
  let releaseSave, rejectStart, markStart;
  const reachedStart=new Promise(resolve=>{markStart=resolve;});
  f.hass.callService=async(domain,service)=>{
    f.calls.push(service);
    if(service==='set_room_cleaning_modes')await new Promise(resolve=>{releaseSave=resolve;});
    if(service==='start_zone_clean') {
      markStart();
      await new Promise((resolve,reject)=>{rejectStart=reject;});
    }
  };
  const first=adapter.sendRoomDraft({...r,draft,start:true,selected:[f.fields['12'].cleaning_mode]});
  const rejected=assert.rejects(first,/Settings were saved.*Start refused/);
  await assert.rejects(adapter.sendRoomDraft({...r,draft}),/already running/);
  releaseSave();await reachedStart;
  await assert.rejects(adapter.sendRoomDraft({...r,draft}),/already running/);
  rejectStart(new Error('Start refused'));await rejected;
  f.hass.callService=async(domain,service)=>{f.calls.push(service);};
  await adapter.sendRoomDraft({...r,draft});
  assert.deepEqual(f.calls,['set_room_cleaning_modes','start_zone_clean','set_room_cleaning_modes']);
});

test('renamed vacuum entities for the same device share the room action lock', async () => {
  const f=hassDysonFixture(), draft={'12':{cleaning_mode:'Mop'}};let release;
  f.hass.callService=()=>new Promise(resolve=>{release=resolve;});
  const first=adapter.sendRoomDraft({...request(f),draft});
  try {
    const renamed=hassDysonFixture(), old=renamed.entity;
    renamed.entity='vacuum.new_hass_name';renamed.config.entity=renamed.entity;
    renamed.hass.states[renamed.entity]=renamed.hass.states[old];delete renamed.hass.states[old];
    renamed.registry.find(e=>e.entity_id===old).entity_id=renamed.entity;
    await assert.rejects(adapter.sendRoomDraft({...request(renamed),draft}),/already running/);
    assert.equal(renamed.calls.length,0);
  } finally {release();await first;}
});

test('finished-job telemetry stays non-live across dock interlocks without clearing a pending start', () => {
  const f=hassDysonFixture();f.hass.states[f.entity]={state:'returning',attributes:{raw_state:'FULL_CLEAN_FINISHED'}};
  for(const phase of ['IDLE','WASHING_MOP','COLLECTING_DUST','DRYING_MOP','unknown']) {
    f.hass.states[f.dock].state=phase;
    assert.equal(adapter.cleaningView(f.hass,f.entity,false,f.registry).active,false,phase);
    const pending=adapter.cleaningView(f.hass,f.entity,true,f.registry);
    assert.equal(pending.live,false,phase);assert.equal(pending.title,'Starting clean',phase);
    if(['WASHING_MOP','COLLECTING_DUST','unknown'].includes(phase))assert.ok(adapter.startBlockReason(f.hass,f.entity,f.registry));
  }
  f.hass.states[f.entity].attributes.raw_state='FULL_CLEAN_NEEDS_CHARGE';
  assert.equal(adapter.cleaningView(f.hass,f.entity,false,f.registry).live,true);
});

test('drying does not hide an independent readiness veto or become a start blocker', () => {
  const f=hassDysonFixture();f.hass.states[f.dock].state='DRYING_MOP';f.hass.states[f.entity].attributes.ready_to_start=false;
  assert.ok(adapter.startBlockReason(f.hass,f.entity,f.registry));
  assert.equal(adapter.dockBusy(f.hass,f.entity,f.registry),true);
  assert.equal(adapter.dockBlocksStart(f.hass,f.entity,f.registry),false);
  for(const phase of ['WASHING_MOP','COLLECTING_DUST']) {
    f.hass.states[f.dock].state=phase;assert.equal(adapter.dockBlocksStart(f.hass,f.entity,f.registry),true);
  }
});

test('explicit integration selection uses metadata while loading but respects a completed empty registry', () => {
  const f=hassDysonFixture();
  assert.equal(defaultIntegrationEntity(f.hass,f.config,[],false),f.entity);
  assert.equal(defaultIntegrationEntity(f.hass,f.config,[],true),'');
  assert.equal(defaultIntegrationEntity(f.hass,f.config,f.registry,true),f.entity);
  assert.equal(defaultIntegrationEntity(f.hass,{integration:'auto'},[],false),f.entity);
  assert.equal(defaultIntegrationEntity(f.hass,{integration:'auto'},[],true),'');
  assert.equal(defaultIntegrationEntity(f.hass,{integration:'dyson_spot_scrub'},[],false),'');
});

test('map domain validation matches explicit adapters and accepts either in Automatic', () => {
  for(const [integration,valid,invalid] of [['dyson_spot_scrub','camera.map','image.map'],['hass_dyson','image.map','camera.map']]) {
    assert.equal(normalizeConfig({entity:'vacuum.robot',integration,camera_entity:valid}).camera_entity,valid);
    assert.throws(()=>normalizeConfig({entity:'vacuum.robot',integration,camera_entity:invalid}),/Map entity must use/);
  }
  for(const camera_entity of ['camera.map','image.map'])assert.equal(normalizeConfig({entity:'vacuum.robot',integration:'auto',camera_entity}).camera_entity,camera_entity);
});

test('hass-dyson session controls reject foreign or disabled registry entries', async () => {
  const f=batchFixture();f.hass.states[f.entity].state='cleaning';
  assert.equal(adapter.canControl(f.hass,f.entity,'pause',f.registry),false);
  await assert.rejects(adapter.controlCleaning(f.hass,f.entity,'pause',f.registry),/not available/);
  assert.equal(f.calls.length,0);
  const hd=hassDysonFixture();hd.hass.states[hd.entity].state='cleaning';
  hd.registry.find(e=>e.entity_id===hd.entity).disabled_by='user';
  assert.equal(adapter.canControl(hd.hass,hd.entity,'pause',hd.registry),false);
});

test('two-step start revalidates replacement HA snapshots, registry, card configuration and removal after Save', async () => {
  for (const change of ['state','registry','config','removed']) {
    const f=hassDysonFixture(), r=request(f);
    let now={hass:f.hass,registry:f.registry,config:f.config,active:true};
    f.hass.callService=async(domain,service)=>{
      f.calls.push(service);
      if(change==='state')now={...now,hass:{...f.hass,states:{...f.hass.states,[f.entity]:{state:'idle',attributes:{raw_state:'MAPPING_RUNNING'}}}}};
      if(change==='registry')now={...now,registry:f.registry.map(e=>e.unique_id==='HD_clean_zone_123_12'?{...e,unique_id:'HD_clean_zone_456_12'}:e)};
      if(change==='config')now={...now,config:{...f.config,integration:'dyson_spot_scrub'}};
      if(change==='removed')now={...now,active:false};
    };
    await assert.rejects(adapter.sendRoomDraft({...r,start:true,selected:[f.fields['12'].cleaning_mode],draft:{'12':{cleaning_mode:'Mop'}},getCurrent:()=>now}),/Settings were saved/);
    assert.deepEqual(f.calls,['set_room_cleaning_modes'],change);
  }
});

test('consumables use remaining life directly and cleaning solution uses binary refill semantics', () => {
  const f=hassDysonFixture();let rows=adapter.consumableStatus(f.hass,f.registry,f.entity);
  assert.equal(rows.find(r=>r.type==='brushBar').remaining,94);
  assert.equal(rows.find(r=>r.type==='cleaningSolution').refillStatus,'ok');
  f.hass.states[f.solution].state='on';f.hass.states[f.life].state='-1';
  rows=adapter.consumableStatus(f.hass,f.registry,f.entity);
  assert.equal(rows.find(r=>r.type==='brushBar').remaining,null);
  assert.equal(rows.find(r=>r.type==='cleaningSolution').refillStatus,'refill_required');
});

test('standard session actions target only configured vacuum; unsupported station and rectangle actions stay absent', async () => {
  const f=hassDysonFixture();f.hass.states[f.entity].state='cleaning';
  await adapter.controlCleaning(f.hass,f.entity,'pause',f.registry);
  f.hass.states[f.entity].state='paused';await adapter.controlCleaning(f.hass,f.entity,'start',f.registry);
  await adapter.controlCleaning(f.hass,f.entity,'return_to_base',f.registry);
  assert.deepEqual(f.calls.map(c=>[c.domain,c.service,c.data.entity_id]),[['vacuum','pause',f.entity],['vacuum','start',f.entity],['vacuum','return_to_base',f.entity]]);
  assert.equal(adapter.canControl(f.hass,f.entity,'cancel_drying'),false);
  assert.deepEqual(adapter.stationSettings(),[]);assert.deepEqual(adapter.robotSettings(),[]);
  assert.equal(adapter.mapPictureAllowed(adapter.mapPicture(f.hass,f.image)),true);
  assert.equal(adapter.mapPictureAllowed('https://example.com/map.png'),false);
  assert.equal(adapter.mapPictureAllowed('/api/camera_proxy/camera.other'),false);
});

test('finished telemetry does not confirm a pending start; mid-job charging remains a session and disconnection wins', () => {
  const f=hassDysonFixture();
  f.hass.states[f.entity]={state:'returning',attributes:{raw_state:'FULL_CLEAN_FINISHED'}};
  assert.equal(adapter.cleaningView(f.hass,f.entity,false,f.registry).active,false);
  assert.equal(adapter.cleaningView(f.hass,f.entity,true,f.registry).live,false);
  assert.equal(adapter.cleaningView(f.hass,f.entity,true,f.registry).title,'Starting clean');
  f.hass.states[f.entity]={state:'docked',attributes:{raw_state:'FULL_CLEAN_CHARGING'}};
  assert.equal(adapter.cleaningView(f.hass,f.entity,false,f.registry).active,true);
  assert.ok(adapter.startBlockReason(f.hass,f.entity,f.registry));
  f.hass.connected=false;f.hass.states[f.entity].state='cleaning';
  assert.equal(adapter.activityStatus(f.hass,f.entity).text,'Robot unavailable');
});

test('dock washing, collection and missing or ambiguous dock telemetry block new room starts', async () => {
  for (const phase of ['WASHING_MOP','COLLECTING_DUST','unknown','unavailable','OTHER','disabled','duplicate','foreign']) {
    const f=hassDysonFixture();
    f.hass.states[f.dock].state=phase;
    const entry=f.registry.find(e=>e.entity_id===f.dock);
    if(phase==='disabled')entry.disabled_by='user';
    if(phase==='duplicate')f.registry.push({...entry,entity_id:'sensor.duplicate_dock'});
    if(phase==='foreign')entry.device_id='other-device';
    assert.ok(adapter.startBlockReason(f.hass,f.entity,f.registry),phase);
    await assert.rejects(adapter.sendRoomDraft({...request(f),start:true,selected:[f.fields['12'].cleaning_mode]}));
    assert.equal(f.calls.length,0,phase);
  }
});

test('drying permits room starts with and without edits without a cancellation command', async () => {
  for (const withEdits of [false,true]) {
    const f=hassDysonFixture();f.hass.states[f.dock].state='DRYING_MOP';
    assert.equal(adapter.startBlockReason(f.hass,f.entity,f.registry),null);
    assert.equal(adapter.cleaningView(f.hass,f.entity,false,f.registry).active,false);
    assert.equal(adapter.activityStatus(f.hass,f.entity,false,f.registry).text,'Drying mop roller');
    await adapter.sendRoomDraft({...request(f),start:true,selected:[f.fields['12'].cleaning_mode],draft:withEdits?{'12':{cleaning_mode:'Mop'}}:{}});
    assert.deepEqual(f.calls.map(c=>c.service),withEdits?['set_room_cleaning_modes','start_zone_clean']:['start_zone_clean']);
    assert.equal(f.hass.states[f.dock].state,'DRYING_MOP','no optimistic dock-state changes');
  }
});

test('drying does not override unavailable, mapping or integration-vetoed robot states', async () => {
  for (const kind of ['mapping','unavailable','veto']) {
    const f=hassDysonFixture();f.hass.states[f.dock].state='DRYING_MOP';
    if(kind==='mapping')f.hass.states[f.entity].attributes.raw_state='MAPPING_RUNNING';
    if(kind==='unavailable')f.hass.states[f.entity].state='unavailable';
    if(kind==='veto')f.hass.states[f.entity].attributes.ready_to_start=false;
    await assert.rejects(adapter.sendRoomDraft({...request(f),start:true,selected:[f.fields['12'].cleaning_mode]}));
    assert.equal(f.calls.length,0);
  }
});

test('washing beginning after Save prevents the subsequent Start against the latest HA snapshot', async () => {
  const f=hassDysonFixture(), r=request(f);
  let now={hass:f.hass,registry:f.registry,config:f.config,active:true};
  f.hass.callService=async(domain,service)=>{
    f.calls.push(service);
    now={...now,hass:{...f.hass,states:{...f.hass.states,[f.dock]:{state:'WASHING_MOP',attributes:{}}}}};
  };
  await assert.rejects(adapter.sendRoomDraft({...r,start:true,selected:[f.fields['12'].cleaning_mode],draft:{'12':{cleaning_mode:'Mop'}},getCurrent:()=>now}),/Settings were saved.*Cleaning mop roller/);
  assert.deepEqual(f.calls,['set_room_cleaning_modes']);
});

test('dock activity remains visible across washing/drying with retained error or paused vacuum state', () => {
  const f=hassDysonFixture();
  for(const state of ['docked','error','paused']) {
    f.hass.states[f.entity].state=state;
    f.hass.states[f.dock].state='WASHING_MOP';
    const wash=adapter.activityStatus(f.hass,f.entity,false,f.registry);
    assert.equal(wash.text,'Cleaning mop roller');assert.equal(wash.remaining,true);
    f.hass.states[f.dock].state='DRYING_MOP';
    assert.equal(adapter.dockActivity(f.hass,f.entity,f.registry).drying,true);
    assert.equal(adapter.activityStatus(f.hass,f.entity,false,f.registry).text,'Drying mop roller');
  }
  f.hass.connected=false;
  assert.equal(adapter.dockActivity(f.hass,f.entity,f.registry),null);
  assert.equal(adapter.activityStatus(f.hass,f.entity,false,f.registry).text,'Robot unavailable');
});

test('dock timer end converts timezone timestamps to remaining hh:mm without inferring cycle completion', () => {
  const f=hassDysonFixture(), now=Date.parse('2026-11-23T06:18:16Z');
  f.hass.states[f.dock].state='DRYING_MOP';
  for(const value of ['2026-11-23T06:48:17+00:00','2026-11-23T07:48:17+01:00','2026-11-23T06:48:17Z']) {
    f.hass.states[f.dockTimer].state=value;
    assert.equal(adapter.dryingRemainingTime(f.hass,f.entity,f.registry,now),'00:31');
    assert.equal(adapter.dryingRemainingTime(f.hass,f.entity,f.registry,now+1000),'00:30');
  }
  assert.equal(adapter.dryingRemainingTime(f.hass,f.entity,f.registry,now+3600000),'00:00');
  assert.equal(adapter.dockActivity(f.hass,f.entity,f.registry).text,'Drying mop roller');
  f.hass.states[f.dock].state='WASHING_MOP';
  assert.equal(adapter.dryingRemainingTime(f.hass,f.entity,f.registry,now),'00:31');
  f.hass.states[f.dock].state='IDLE';
  assert.equal(adapter.dryingRemainingTime(f.hass,f.entity,f.registry,now),null);
  assert.equal(adapter.dryingRemainingPercent(f.hass,f.entity,f.registry),null);
});

test('invalid, unavailable, ambiguous, disabled and foreign dock timers never produce a remaining time', () => {
  for(const kind of ['unknown','unavailable','2026-11-23T06:48:17','invalid','disabled','duplicate','foreign','restored']) {
    const f=hassDysonFixture();f.hass.states[f.dock].state='DRYING_MOP';
    f.hass.states[f.dockTimer].state='2026-11-23T06:48:17Z';
    const entry=f.registry.find(e=>e.entity_id===f.dockTimer);
    if(kind==='disabled')entry.disabled_by='user';
    else if(kind==='duplicate')f.registry.push({...entry,entity_id:'sensor.duplicate_timer'});
    else if(kind==='foreign')entry.device_id='other';
    else if(kind==='restored')f.hass.states[f.dockTimer].attributes.restored=true;
    else f.hass.states[f.dockTimer].state=kind;
    assert.equal(adapter.dryingRemainingTime(f.hass,f.entity,f.registry,Date.parse('2026-11-23T06:00:00Z')),null,kind);
  }
});
