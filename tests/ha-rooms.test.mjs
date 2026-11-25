import test from 'node:test';
import assert from 'node:assert/strict';
import { haRoomsAdapter as adapter } from '../src/adapters/ha-rooms.js';
import { spotScrubAdapter } from '../src/adapters/spot-scrub.js';
import { hassDysonAdapter } from '../src/adapters/hass-dyson.js';
import { getIntegrationAdapter, integrationVacuumEntries, defaultIntegrationEntity } from '../src/integration.js';
import { normalizeConfig } from '../src/shared.js';
import { haRoomsFixture } from './ha-rooms-fixture.mjs';
import { batchFixture } from './fixture.mjs';
import { hassDysonFixture } from './hass-dyson-fixture.mjs';

const request = f => ({...f,model:adapter.discover(f.hass,f.registry,f.config),context:adapter.roomContext(f.hass,f.entity,f.registry),start:true,selected:['area:kitchen','area:hall']});

test('generic discovery uses only that robot mapped HA areas, keeping display keys and no execution order', () => {
  const f = haRoomsFixture();
  f.registry.push({...f.registry[0],entity_id:'vacuum.other',options:{vacuum:{area_mapping:{bedroom:['99']}}}});
  f.config.room_order = ['area:hall','area:kitchen'];
  f.config.excluded_rooms = ['area:hall'];
  const model = adapter.discover(f.hass,f.registry,f.config);
  assert.deepEqual(model.rooms.map(r => [r.key,r.name,r.entity,r.excluded]), [['area:hall','Hall',undefined,true],['area:kitchen','Kitchen',undefined,false]]);
  assert.deepEqual(model.rooms[1].segmentIds,['16','17']);
  assert.deepEqual(adapter.roomPresentation(model.rooms[0]),{fields:[]});
  assert.deepEqual(adapter.roomPlanningState(f.hass,f.registry,f.config,model), {supportsSave:false,supportsStart:true,canSave:false,canStart:true,ordered:false,notice:null});
  assert.equal(model.batteryEntity,'sensor.alfred_battery');
  assert.equal(adapter.batteryStatus(f.hass,model).percent,81);
  assert.equal(f.calls.length,0);
});

test('automatic selection prefers specialized Dyson adapters, deduplicates and filters exact CLEAN_AREA support', () => {
  const f=haRoomsFixture(), spot=batchFixture(), hd=hassDysonFixture();
  const hass={...f.hass,states:{...f.hass.states,...spot.hass.states,...hd.hass.states}};
  const registry=[...spot.registry,...hd.registry,...f.registry];
  hass.states[spot.entity].attributes.supported_features |= 16384;
  hass.states[hd.entity].attributes.supported_features |= 16384;
  assert.equal(getIntegrationAdapter({entity:spot.entity},registry,hass),spotScrubAdapter);
  assert.equal(getIntegrationAdapter({entity:hd.entity},registry,hass),hassDysonAdapter);
  assert.equal(getIntegrationAdapter({entity:f.entity},registry,hass),adapter);
  assert.equal(getIntegrationAdapter({entity:spot.entity,integration:'ha_rooms'},registry,hass),adapter);
  assert.deepEqual(integrationVacuumEntries({},registry,hass).map(row=>row.entity_id),[spot.entity,hd.entity,f.entity]);
  assert.equal(defaultIntegrationEntity(hass,{},registry),spot.entity);
  assert.equal(defaultIntegrationEntity(hass,f.config,registry),f.entity);
  assert.equal(defaultIntegrationEntity(hass,f.config,[],true),'');
  assert.equal(defaultIntegrationEntity(hass,f.config,[],false),f.entity);
  assert.equal(normalizeConfig(f.config).integration,'ha_rooms');
  delete hass.states[f.entity].attributes.supported_features;
  assert.equal(getIntegrationAdapter({entity:f.entity},registry,hass),adapter,'unknown platform never falls back to Dyson');
  assert.deepEqual(integrationVacuumEntries({integration:'ha_rooms'},f.registry,hass),[]);
});

test('missing mapping, deleted areas and unsupported devices show specific setup notices without Dyson assumptions', () => {
  const f=haRoomsFixture();
  for (const value of [undefined,{}, {kitchen:[]}, {kitchen:'16'}, {kitchen:[16]}]) {
    f.registry[0].options.vacuum.area_mapping=value;
    const model=adapter.discover(f.hass,f.registry,f.config);
    assert.equal(model.rooms.length,0);
    assert.match(model.startBlockReason,/Map the robot/);
  }
  f.registry[0].options.vacuum.area_mapping={deleted:['16']};
  assert.equal(adapter.discover(f.hass,f.registry,f.config).rooms.length,0);
  f.hass.states[f.entity].attributes.supported_features=8192;
  assert.match(adapter.discover(f.hass,f.registry,f.config).startBlockReason,/does not report/);
  assert.match(adapter.discover(f.hass,[],f.config).startBlockReason,/not found/);
});

test('area start sends one exact HA action, without native segment IDs, setting writes or command retries', async () => {
  for (const platform of ['roborock','dreame_vacuum','ecovacs','some_future_integration']) {
    const f=haRoomsFixture(platform);
    const result=await adapter.sendRoomDraft(request(f));
    assert.deepEqual(f.calls,[{domain:'vacuum',service:'clean_area',data:{entity_id:f.entity,cleaning_area_id:['kitchen','hall']}}]);
    assert.deepEqual(result.rooms,[{room_id:'kitchen',name:'Kitchen'},{room_id:'hall',name:'Hall'}]);
    assert.deepEqual(f.reads.map(r=>r.type),['config/entity_registry/get','config/area_registry/list']);
    f.hass.callService=async()=>{f.calls.push('refused');throw new Error('Backend refused');};
    await assert.rejects(adapter.sendRoomDraft(request(f)),/Backend refused/);
    assert.equal(f.calls.length,2);
  }
});

test('area writes reject invalid selections, Save, edited settings, outages, feature loss and busy states', async () => {
  for (const kind of ['empty','duplicate','foreign','excluded','draft','save','offline','feature','service','busy','disabled']) {
    const f=haRoomsFixture(), r=request(f);
    if(kind==='empty')r.selected=[];
    if(kind==='duplicate')r.selected=['area:kitchen','area:kitchen'];
    if(kind==='foreign')r.selected=['area:bedroom'];
    if(kind==='excluded')f.config.excluded_rooms=['area:kitchen'];
    if(kind==='draft')r.draft={kitchen:{water_level:'High'}};
    if(kind==='save')r.start=false;
    if(kind==='offline')f.hass.connected=false;
    if(kind==='feature')f.hass.states[f.entity].attributes.supported_features=8192;
    if(kind==='service')delete f.hass.services.vacuum.clean_area;
    if(kind==='busy')f.hass.states[f.entity].state='cleaning';
    if(kind==='disabled')f.registry[0].disabled_by='user';
    await assert.rejects(adapter.sendRoomDraft(r),undefined,kind);
    assert.equal(f.calls.length,0,kind);
  }
});

test('fresh HA registry revalidation rejects changed mappings, identities and removed areas', async () => {
  for(const kind of ['segments','removed-area','replaced-robot','disabled','old-model']) {
    const f=haRoomsFixture(), r=request(f), read=f.hass.callWS;
    f.hass.callWS=async message=>{
      const result=await read(message);
      if(message.type==='config/entity_registry/get') {
        if(kind==='segments')result.options.vacuum.area_mapping.kitchen=['99'];
        if(kind==='replaced-robot')result.unique_id='another-robot';
        if(kind==='disabled')result.disabled_by='user';
      }
      return message.type==='config/area_registry/list' && kind==='removed-area' ? result.filter(area=>area.area_id!=='kitchen') : result;
    };
    if(kind==='old-model')r.model.rooms[0].context='old-map';
    await assert.rejects(adapter.sendRoomDraft(r),/selection changed/);
    assert.equal(f.calls.length,0,kind);
  }
});

test('pending reads cannot start after detachment, config/connection change or a new robot state', async () => {
  for(const kind of ['detach','config','connection','busy']) {
    const f=haRoomsFixture(), r=request(f), read=f.hass.callWS;
    let release, active=true, config=f.config;
    const gate=new Promise(resolve=>{release=resolve;});
    f.hass.callWS=async message=>{await gate;return read(message);};
    r.getCurrent=()=>({hass:f.hass,registry:f.registry,config,active});
    const pending=adapter.sendRoomDraft(r);
    if(kind==='detach')active=false;
    if(kind==='config')config={...config};
    if(kind==='connection')f.hass.connection={};
    if(kind==='busy')f.hass.states[f.entity].state='cleaning';
    release();
    await assert.rejects(pending);
    assert.equal(f.calls.length,0);
  }
});

test('same-entity area starts lock across cards and release the lock after read failure', async () => {
  const f=haRoomsFixture(), read=f.hass.callWS;
  let reject;
  const gate=new Promise((_resolve,no)=>{reject=no;});
  f.hass.callWS=()=>gate;
  const first=adapter.sendRoomDraft(request(f));
  const rejection=assert.rejects(first,/read failed/);
  await assert.rejects(adapter.sendRoomDraft(request(f)),/already running/);
  reject(new Error('read failed'));
  f.hass.callWS=read;
  await rejection;
  await adapter.sendRoomDraft(request(f));
  assert.equal(f.calls.length,1);
});

test('generic session controls use standard features only and never borrow Dyson dock logic', async () => {
  const f=haRoomsFixture();
  for(const [state,action] of [['cleaning','pause'],['paused','start'],['paused','return_to_base']]) {
    f.hass.states[f.entity].state=state;
    f.hass.states[f.entity].attributes.dock_state='DRYING_MOP';
    assert.equal(adapter.canControl(f.hass,f.entity,action,f.registry),true);
    await adapter.controlCleaning(f.hass,f.entity,action,f.registry);
  }
  assert.deepEqual(f.calls.map(c=>[c.domain,c.service]),[['vacuum','pause'],['vacuum','start'],['vacuum','return_to_base']]);
  assert.equal(adapter.canControl(f.hass,f.entity,'cancel_drying',f.registry),false);
  assert.equal(adapter.canControl(f.hass,f.entity,'start',[]),false);
  f.hass.states[f.entity].attributes.supported_features=0;
  await assert.rejects(adapter.controlCleaning(f.hass,f.entity,'start',f.registry));
});
