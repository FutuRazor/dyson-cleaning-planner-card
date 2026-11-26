// HA Core 2026.11.3 registry options and vacuum.clean_area service contract.
// Segment IDs are deliberately unrelated to area IDs and no room entities exist.
export function haRoomsFixture(platform = 'roborock') {
  const entity = 'vacuum.alfred';
  const areas = {kitchen:{area_id:'kitchen',name:'Kitchen'},hall:{area_id:'hall',name:'Hall'},bedroom:{area_id:'bedroom',name:'Bedroom'}};
  const registry = [{entity_id:entity,id:'entry-alfred',unique_id:'native-robot',device_id:'device-alfred',platform,disabled_by:null,
    options:{vacuum:{area_mapping:{kitchen:['16','17'],hall:['20']},last_seen_segments:[{id:'16',name:'Cooking',group:'floor-1'},{id:'17',name:'Dining',group:'floor-1'},{id:'20',name:'Hall',group:'floor-1'}]}}},
    {entity_id:'sensor.alfred_battery',device_id:'device-alfred',platform,disabled_by:null},
    {entity_id:'binary_sensor.alfred_charging',device_id:'device-alfred',platform,disabled_by:null}];
  const states = {[entity]:{state:'docked',attributes:{friendly_name:'Alfred',supported_features:16384|8192|4096|4|16}},
    'sensor.alfred_battery':{state:'81',attributes:{device_class:'battery',unit_of_measurement:'%'}},
    'binary_sensor.alfred_charging':{state:'on',attributes:{device_class:'battery_charging'}}};
  const calls = [], reads = [];
  const hass = {states,areas,connected:true,connection:{},entities:Object.fromEntries(registry.map(row => [row.entity_id,row])),
    services:{vacuum:{clean_area:{},pause:{},start:{},return_to_base:{}}},
    callService:async (domain,service,data) => { calls.push({domain,service,data}); },
    callWS:async request => {
      reads.push(request);
      if (request.type === 'config/entity_registry/list') return structuredClone(registry);
      if (request.type === 'config/device_registry/list') return [];
      if (request.type === 'config/entity_registry/get') return structuredClone(registry.find(row => row.entity_id === request.entity_id) ?? null);
      if (request.type === 'config/area_registry/list') return structuredClone(Object.values(areas));
      throw new Error(`Unexpected WS request ${request.type}`);
    }};
  return {entity,registry,hass,areas,calls,reads,config:{entity,integration:'ha_rooms',excluded_rooms:[],room_order:[]}};
}

export function enableFanSpeed(f) {
  Object.assign(f.hass.states[f.entity].attributes, {fan_speed:'Balanced',fan_speed_list:['Quiet','Balanced','Turbo','Max']});
  f.hass.states[f.entity].attributes.supported_features |= 32;
  f.hass.services.vacuum.set_fan_speed = {};
  return f;
}
