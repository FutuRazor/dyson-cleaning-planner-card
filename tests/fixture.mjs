export function fixture() {
  const entity = 'vacuum.kuche_dyson_spot_scrub';
  const mode = 'select.kuche_dyson_spot_scrub_vacuum_mode';
  const start = 'button.kuche_dyson_spot_scrub_vacuum_start';
  const names = ['Wohnzimmer', 'Küche', 'Schlafzimmer', 'Flur', 'Badezimmer'];
  const suffixes = ['wohnzimmer', 'kuche', 'schlafzimmer', 'flur', 'badezimmer'];
  const ids = suffixes.map(s => `switch.kuche_dyson_spot_scrub_room_${s}`);
  const row = (entity_id, unique_id, original_name) => ({ entity_id, unique_id, original_name, platform: 'dyson_spot_scrub', device_id: 'demo-device', config_entry_id: 'demo-entry', disabled_by: null });
  const registry = [row(entity, 'DEMO_vacuum', 'Dyson'), row(mode, 'DEMO_cleaning_mode', 'Vacuum Mode'), row(start, 'DEMO_start_button', 'Vacuum Start'), ...names.map((name, i) => row(ids[i], `DEMO_room_${name.toLowerCase()}`, `Room ${name}`)), { ...row('switch.disabled_wc', 'DEMO_room_wc', 'Room Wc'), disabled_by: 'user' }];
  const state = (state, attributes = {}) => ({ state, attributes });
  const states = { [entity]: state('docked', { rooms: names, friendly_name: 'Dyson Spot+Scrub' }), [mode]: state('Vacuum', { options: ['Vacuum', 'Vacuum and Mop', 'Mop', 'Vacuum then Mop'] }), [start]: state('unknown'), ...Object.fromEntries(ids.map(id => [id, state('off')])) };
  // A button may have state "unknown" until its first press: it is still usable.
  const calls = [];
  const hass = {
    states, connected: true, connection: {},
    services: { select: { select_option: {} }, switch: { turn_on: {}, turn_off: {} }, button: { press: {} } },
    callWS: async () => registry,
    callService: async (domain, service, data) => {
      calls.push({ domain, service, data });
      if (domain === 'select') states[data.entity_id] = state(data.option, states[data.entity_id].attributes);
      if (domain === 'switch') states[data.entity_id] = state(service === 'turn_on' ? 'on' : 'off');
      if (domain === 'button') states[data.entity_id] = state(new Date().toISOString());
    }
  };
  return { entity, mode, start, names, ids, registry, hass, calls, config: { entity, excluded_rooms: [], room_order: [] } };
}
