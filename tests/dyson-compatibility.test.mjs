import test from 'node:test';
import assert from 'node:assert/strict';
import {getIntegrationAdapter, defaultIntegrationEntity, integrationVacuumEntries} from '../src/integration.js';
import {normalizeConfig, roomKey} from '../src/shared.js';
import {batchFixture} from './fixture.mjs';
import {hassDysonFixture} from './hass-dyson-fixture.mjs';
import {haRoomsFixture, enableFanSpeed} from './ha-rooms-fixture.mjs';

// A generic robot comes first in HA's registry, and both Dyson vacuums also
// advertise generic area/fan features. Existing cards must keep native behavior.
function household() {
  const spot=batchFixture(), hd=hassDysonFixture(), generic=enableFanSpeed(haRoomsFixture());
  const registry=[...generic.registry,...hd.registry,...spot.registry];
  const states={...generic.hass.states,...hd.hass.states,...spot.hass.states};
  const services={...spot.hass.services,...hd.hass.services,
    vacuum:{...spot.hass.services.vacuum,...hd.hass.services.vacuum,...generic.hass.services.vacuum}};
  for (const f of [spot,hd]) {
    states[f.entity].attributes.supported_features |= 16384|32;
    Object.assign(states[f.entity].attributes,{fan_speed:'Balanced',fan_speed_list:['Quiet','Balanced','Turbo']});
    Object.assign(f.hass,{states,services,entities:Object.fromEntries(registry.map(row=>[row.entity_id,row])),areas:generic.areas});
  }
  return {spot,hd,registry};
}

test('existing Dyson YAML keeps its robot, camera, room mappings, display order and exclusions in a mixed household',()=>{
  for (const backend of ['spot','hd']) for (const integration of [undefined,'auto',backend==='spot'?'dyson_spot_scrub':'hass_dyson']) {
    const {spot,hd,registry}=household(), f=backend==='spot'?spot:hd;
    const keys=backend==='spot'?[spot.ids[0],spot.ids[1]]:[hd.fields['12'].cleaning_mode,hd.fields['10'].cleaning_mode];
    const camera=backend==='spot'?spot.camera:hd.image;
    const yaml={entity:f.entity,camera_entity:camera,room_order:[keys[1],keys[0]],excluded_rooms:[keys[0]],
      show_camera:false,camera_rotation:270,always_show_all_settings:true,language:'de'};
    if (integration!==undefined) yaml.integration=integration;
    if (backend==='spot') Object.assign(yaml,{room_entities:{[spot.names[0]]:keys[0]},mode_entity:spot.mode,start_entity:spot.start});
    const config=normalizeConfig(yaml), adapter=getIntegrationAdapter(config,registry,f.hass);
    assert.equal(adapter.id,backend==='spot'?'dyson_spot_scrub':'hass_dyson');
    assert.equal(defaultIntegrationEntity(f.hass,config,registry),f.entity);
    assert.equal(integrationVacuumEntries(config,registry,f.hass).filter(row=>row.entity_id===f.entity).length,1);
    const model=adapter.discover(f.hass,registry,config);
    assert.deepEqual(model.rooms.slice(0,2).map(roomKey),[keys[1],keys[0]]);
    assert.equal(model.rooms.find(room=>roomKey(room)===keys[0]).excluded,true);
    assert.equal(model.cameraEntity,camera);
    assert.equal(config.show_camera,false);assert.equal(config.camera_rotation,270);
    assert.equal(config.always_show_all_settings,true);assert.equal(config.language,'de');
    assert.deepEqual(adapter.planningSettings?.(f.hass,registry,config)??[],[],'native room controls do not acquire the generic fan slider');
    f.hass.states[f.entity].state='unavailable';
    assert.equal(getIntegrationAdapter(config,registry,f.hass),adapter);
    assert.equal(defaultIntegrationEntity(f.hass,config,registry),f.entity,'an offline Dyson is never replaced with the generic robot');
    assert.equal(f.calls.length,0);
  }
});

test('existing Dyson cards retain exact native start payloads and never fall back to generic services',async()=>{
  for (const backend of ['spot','hd']) for (const integration of [undefined,'auto',backend==='spot'?'dyson_spot_scrub':'hass_dyson']) {
    const {spot,hd,registry}=household(), f=backend==='spot'?spot:hd;
    const config=normalizeConfig({entity:f.entity,...(integration===undefined?{}:{integration})});
    const adapter=getIntegrationAdapter(config,registry,f.hass);
    const selected=backend==='spot'?[spot.ids[2],spot.ids[0]]:[hd.fields['10'].cleaning_mode,hd.fields['12'].cleaning_mode];
    const draft=backend==='spot'?{'10':{cleaning_mode:'Mop',mop_repetitions:'Two Passes'}}:{'12':{cleaning_mode:'Mop',mop_repetitions:'Two Passes'}};
    const request=()=>({hass:f.hass,registry,config,model:adapter.discover(f.hass,registry,config),
      context:adapter.roomContext(f.hass,f.entity,registry),start:true,selected,draft});
    await adapter.sendRoomDraft(request());
    assert.deepEqual(f.calls,backend==='spot'?[{
      domain:'dyson_spot_scrub',service:'start_rooms_with_settings',data:{entity_id:f.entity,
        room_ids:['12','10'],room_settings:{'10':{cleaning_mode:'Mop',mop_repetitions:'Two Passes'}}},
    }]:[
      {domain:'hass_dyson',service:'set_room_cleaning_modes',data:{device_id:'hd-device',room_modes:{'12':{cleaning_mode:'mop_only',wash_repetitions:2}}}},
      {domain:'hass_dyson',service:'start_zone_clean',data:{device_id:'hd-device',zones:['10','12'],map:'123'}},
    ]);
    f.calls.length=0;
    delete f.hass.services[adapter.id][backend==='spot'?'start_rooms_with_settings':'start_zone_clean'];
    await assert.rejects(adapter.sendRoomDraft(request()),/unavailable/);
    assert.equal(f.calls.length,0,'missing native actions never trigger clean_area, set_fan_speed or another integration');
  }
});
