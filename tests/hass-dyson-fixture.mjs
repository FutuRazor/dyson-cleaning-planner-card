// Source-shaped upstream identities and option values; no robot connection.
export function hassDysonFixture() {
  const entity = 'vacuum.renamed_hass_robot', registry = [], states = {}, calls = [];
  const row = (entity_id, unique_id, original_name) => {
    registry.push({ entity_id, unique_id:`HD_${unique_id}`, original_name, platform:'hass_dyson', device_id:'hd-device', disabled_by:null });
    return entity_id;
  };
  row(entity, 'vacuum', 'Robot');
  states[entity] = { state:'docked', attributes:{ friendly_name:'Test hass-dyson', raw_state:'INACTIVE_CHARGING', supported_features:8212 } };
  const keys = {
    cleaning_mode:['vacuum_only','vacuum_and_mop','mop_only','vacuum_then_mop'],
    vacuum_power:['auto','boost','quiet','quick'], hydration:['very_low','low','medium','high'], wash_repetitions:['1x','2x'],
  };
  const labels = { cleaning_mode:'cleaning mode', vacuum_power:'vacuum power', hydration:'hydration', wash_repetitions:'wash repetitions' };
  const fields = {};
  for (const [id,name] of [['12','Kitchen'],['10','Hall']]) {
    fields[id] = {};
    for (const [key,options] of Object.entries(keys)) {
      const select = row(`select.renamed_${id}_${key}`, `room_${id}_${key}`, `${name} ${labels[key]}`);
      fields[id][key] = select;
      states[select] = { state:options[0], attributes:{ options, room_id:Number(id), friendly_name:`Robot ${name} ${labels[key]}` } };
    }
    const button = row(`button.renamed_${id}`, `clean_zone_123_${id}`, `Clean ${name}`);
    states[button] = { state:'unknown', attributes:{} };
  }
  const global = row('select.global_hass_mode','cleaning_mode','Cleaning mode');
  states[global] = { state:'vacuum_only', attributes:{ room_settings:{ '12':{}, '10':{} } } };
  const battery = row('sensor.hass_battery','robot_battery','Battery');
  const charging = row('binary_sensor.hass_charging','robot_battery_charging','Charging');
  const image = row('image.hass_combined_coverage','clean_coverage','Cleaning coverage');
  const life = row('sensor.hass_brush_life','brushBar_life','Brush bar life');
  const solution = row('binary_sensor.hass_solution','cleaning_solution','Refill needed');
  states[battery] = { state:'87', attributes:{} };
  states[charging] = { state:'on', attributes:{} };
  const dock = row('sensor.hass_dock', 'robot_dock_state', 'Dock state');
  states[dock] = { state:'IDLE', attributes:{} };
  const dockTimer = row('sensor.renamed_dock_timer', 'robot_dock_timer_end', 'Dock timer end');
  states[dockTimer] = { state:'unknown', attributes:{device_class:'timestamp'} };
  states[image] = { state:'2026-11-23T07:00:00Z', attributes:{ entity_picture:`/api/image_proxy/${image}?token=test` } };
  states[life] = { state:'94', attributes:{} };
  states[solution] = { state:'off', attributes:{} };
  const hass = {
    states, entities:Object.fromEntries(registry.map(e => [e.entity_id,e])), connected:true, connection:{},
    services:{ hass_dyson:{ set_room_cleaning_modes:{}, start_zone_clean:{} }, vacuum:{ start:{}, pause:{}, return_to_base:{} } },
    callWS:async ({type}) => type === 'config/device_registry/list' ? [{id:'hd-device',model:'804'}] : registry,
    callService:async (domain,service,data) => {
      calls.push({domain,service,data});
      if (service === 'set_room_cleaning_modes') for (const [id,settings] of Object.entries(data.room_modes)) {
        for (const [key,value] of Object.entries(settings)) states[fields[id][key]].state = key === 'wash_repetitions' ? `${value}x` : value;
      }
    },
  };
  return { entity, registry, hass, calls, fields, battery, charging, dock, dockTimer, image, life, solution, global,
    config:{ entity, integration:'hass_dyson', excluded_rooms:[], room_order:[] } };
}
