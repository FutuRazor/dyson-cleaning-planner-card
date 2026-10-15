export function fixture() {
  const entity = 'vacuum.kuche_dyson_spot_scrub';
  const mode = 'select.kuche_dyson_spot_scrub_vacuum_mode';
  const start = 'button.kuche_dyson_spot_scrub_vacuum_start';
  const camera = 'camera.kuche_dyson_spot_scrub_floor_map';
  const battery = 'sensor.kuche_dyson_spot_scrub_battery';
  const charging = 'binary_sensor.kuche_dyson_spot_scrub_charging';
  const names = ['Wohnzimmer', 'Küche', 'Schlafzimmer', 'Flur', 'Badezimmer'];
  const suffixes = ['wohnzimmer', 'kuche', 'schlafzimmer', 'flur', 'badezimmer'];
  const ids = suffixes.map(s => `switch.kuche_dyson_spot_scrub_room_${s}`);
  const row = (entity_id, unique_id, original_name) => ({ entity_id, unique_id, original_name, platform: 'dyson_spot_scrub', device_id: 'demo-device', config_entry_id: 'demo-entry', disabled_by: null });
  const registry = [row(entity, 'DEMO_vacuum', 'Dyson'), row(mode, 'DEMO_cleaning_mode', 'Vacuum Mode'), row(start, 'DEMO_start_button', 'Vacuum Start'), ...names.map((name, i) => row(ids[i], `DEMO_room_${name.toLowerCase()}`, `Room ${name}`)), { ...row('switch.disabled_wc', 'DEMO_room_wc', 'Room Wc'), disabled_by: 'user' }];
  const state = (state, attributes = {}) => ({ state, attributes });
  const states = { [entity]: state('docked', { rooms: names, friendly_name: 'Dyson Spot+Scrub' }), [mode]: state('Vacuum', { options: ['Vacuum', 'Vacuum and Mop', 'Mop', 'Vacuum then Mop'] }), [start]: state('unknown'), ...Object.fromEntries(ids.map(id => [id, state('off')])) };
  // A button may have state "unknown" until its first press: it is still usable.
  registry.push(row(camera, 'DEMO_floor_map', 'Floor Map'));
  registry.push(row(battery, 'DEMO_battery', 'Battery'), row(charging, 'DEMO_charging', 'Charging'));
  states[entity].attributes.supported_features = 12348;
  states[camera] = state('idle', { entity_picture: `/api/camera_proxy/${camera}` });
  states[battery] = state('100', { device_class: 'battery', unit_of_measurement: '%' });
  states[charging] = state('on', { device_class: 'battery_charging' });
  const calls = [];
  const hass = {
    states, connected: true, connection: {},
    services: { select: { select_option: {} }, switch: { turn_on: {}, turn_off: {} }, button: { press: {} }, vacuum: { pause: {}, start: {}, stop: {}, return_to_base: {} } },
    callWS: async () => registry,
    callService: async (domain, service, data) => {
      calls.push({ domain, service, data });
      if (domain === 'select') states[data.entity_id] = state(data.option, states[data.entity_id].attributes);
      if (domain === 'switch') states[data.entity_id] = state(service === 'turn_on' ? 'on' : 'off');
      if (domain === 'button') states[data.entity_id] = state(new Date().toISOString());
    }
  };
  return { entity, mode, start, camera, battery, charging, names, ids, registry, hass, calls, config: { entity, excluded_rooms: [], room_order: [] } };
}

export function batchFixture() {
  const f = fixture();
  const options = {
    cleaning_mode: ['Vacuum', 'Vacuum and Mop', 'Mop', 'Vacuum then Mop'],
    cleaning_strategy: ['Auto', 'Boost', 'Quiet', 'Quick'],
    water_level: ['Very Low', 'Low', 'Medium', 'High'],
    mop_repetitions: ['One Pass', 'Two Passes']
  };
  f.fields = {};
  f.names.forEach((name, i) => {
    const id = String(i + 10); f.fields[id] = {};
    for (const [key, values] of Object.entries(options)) {
      const entity = `select.arbitrary_${i}_${key}`;
      f.fields[id][key] = entity;
      f.registry.push({ entity_id: entity, unique_id: `DEMO_room_${name.toLowerCase()}_${key}`, platform: 'dyson_spot_scrub', device_id: 'demo-device', disabled_by: null });
      f.hass.states[entity] = { state: values[0], attributes: { options: values, room_id: id } };
    }
  });
  f.hass.services.dyson_spot_scrub = { save_room_settings: {}, start_rooms_with_settings: {} };
  const original = f.hass.callService;
  f.hass.callService = async (domain, service, data) => {
    await original(domain, service, data);
    if (domain !== 'dyson_spot_scrub') return;
    for (const [id, settings] of Object.entries(data.room_settings)) {
      for (const [key, value] of Object.entries(settings)) f.hass.states[f.fields[id][key]].state = value;
    }
  };
  return f;
}
