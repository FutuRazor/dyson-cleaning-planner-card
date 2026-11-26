import {batchFixture} from './fixture.mjs';

export function mapSelectionFixture() {
  const f = batchFixture();
  const originalFields = Object.values(f.fields).flatMap(fields => Object.values(fields));
  const originalStates = Object.fromEntries(originalFields.map(entity => [entity,structuredClone(f.hass.states[entity])]));
  f.bFields = [];
  const bSwitch = 'switch.saved_office';
  f.registry.push({entity_id:bSwitch,unique_id:'DEMO_room_büro',device_id:'demo-device',platform:'dyson_spot_scrub'});
  f.hass.states[bSwitch] = {state:'off',attributes:{}};
  for (const [field,sourceEntity] of Object.entries(f.fields['10'])) {
    const entity = `select.saved_office_${field}`;
    f.bFields.push(entity);
    f.registry.push({entity_id:entity,unique_id:`DEMO_room_büro_${field}`,device_id:'demo-device',platform:'dyson_spot_scrub'});
    f.hass.states[entity] = {...structuredClone(f.hass.states[sourceEntity]),state:'unavailable'};
  }
  f.mapSelect = 'select.renamed_saved_map';
  f.registry.push({entity_id:f.mapSelect,unique_id:'DEMO_active_map',device_id:'demo-device',platform:'dyson_spot_scrub'});
  f.maps = [{map_id:'1784483068',name:'Wohnung',option:'Wohnung'},{map_id:'1795646759',name:'Dachboden',option:'Dachboden'}];
  f.hass.states[f.entity].attributes.map_id = f.maps[0].map_id;
  f.hass.states[f.mapSelect] = {state:'Wohnung',attributes:{maps:f.maps,options:f.maps.map(map => map.option),map_id:f.maps[0].map_id,can_change:true,switching:false}};
  f.applyMap = identity => {
    const map = f.maps.find(item => item.map_id === identity);
    const onB = identity === '1795646759';
    const source = f.hass.states[f.mapSelect];
    source.state = map.option; source.attributes.map_id = identity;
    f.hass.states[f.entity].attributes.map_id = identity;
    f.hass.states[f.entity].attributes.rooms = onB ? ['Büro'] : f.names;
    for (const entity of originalFields) f.hass.states[entity] = {...originalStates[entity],state:onB?'unavailable':originalStates[entity].state};
    for (const [index,entity] of f.bFields.entries()) f.hass.states[entity].state = onB ? originalStates[Object.values(f.fields['10'])[index]].state : 'unavailable';
  };
  return f;
}
