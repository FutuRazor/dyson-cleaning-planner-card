import { UiError } from '../localize.js';
import { ROOM_FIELDS, available } from '../shared.js';
import { validZoneCalibration, zoneRobotRectangle } from '../zone-geometry.js';

// Keep backend identities, telemetry and action policy inside this adapter.
// The local scope also isolates implementation names in the dependency-free bundle.
export const spotScrubAdapter = (() => {
const DOMAIN = 'dyson_spot_scrub';
// A missing map ID remains compatible with integrations that do not expose it.
const roomContext = (hass, entity) => JSON.stringify([entity, hass?.states?.[entity]?.attributes?.map_id == null ? null : String(hass.states[entity].attributes.map_id)]);

// Entity IDs are user-editable. Match registry identity within ONE integration device.
function discover(hass, registry, config, previousRooms = []) {
  const issues = [];
  const context = roomContext(hass, config.entity);
  const vacuum = registry.find(e => e.entity_id === config.entity && e.platform === DOMAIN && !e.disabled_by);
  if (!vacuum?.device_id) return { rooms: [], issues: ['The Dyson device was not found in the entity registry.'] };
  const entries = registry.filter(e => e.device_id === vacuum.device_id && e.platform === DOMAIN && !e.disabled_by);
  const serial = String(vacuum.unique_id ?? '').replace(/_vacuum$/, '');
  const pick = (explicit, suffix, domain) => {
    const candidates = entries.filter(e => e.entity_id.startsWith(`${domain}.`) && (explicit ? e.entity_id === explicit : e.unique_id === `${serial}_${suffix}`));
    return candidates.length === 1 ? candidates[0].entity_id : undefined;
  };
  const cameraEntity = pick(config.camera_entity, 'floor_map', 'camera');
  const batteryEntity = pick(undefined, 'battery', 'sensor');
  const chargingEntity = pick(undefined, 'charging', 'binary_sensor');
  const names = hass.states[config.entity]?.attributes?.rooms;
  if (!Array.isArray(names) || !names.length || names.some(n => typeof n !== 'string')) issues.push('The Dyson room list is not currently available.');
  const rooms = (Array.isArray(names) ? names.filter(n => typeof n === 'string') : []).flatMap(name => {
    const explicit = config.room_entities?.[name];
    const uid = `${serial}_room_${name.toLowerCase().replaceAll(' ', '_')}`;
    const allMatches = registry.filter(e => e.device_id === vacuum.device_id && e.platform === DOMAIN && e.entity_id.startsWith('switch.') && (explicit ? e.entity_id === explicit : e.unique_id === uid));
    if (allMatches.length === 1 && allMatches[0].disabled_by) return [];
    const matches = allMatches.filter(e => !e.disabled_by);
    if (matches.length !== 1) return [{ name, entity: '', available: false, error: 'Room switch mapping is ambiguous' }];
    const entry = matches[0];
    const settings = {};
    const roomIds = new Set();
    for (const key of Object.keys(ROOM_FIELDS)) {
      const candidates = entries.filter(e => e.entity_id.startsWith('select.') && e.unique_id === `${entry.unique_id}_${key}`);
      if (candidates.length !== 1) continue;
      const entity = candidates[0].entity_id, state = hass.states[entity];
      const previous = previousRooms.find(r => r.entity === entry.entity_id && r.context === context);
      const prior = previous?.settings?.[key]?.entity === entity ? previous.settings[key] : undefined;
      const nativeId = state?.attributes?.room_id ?? (!available(state) ? previous?.roomId : undefined);
      const options = state?.attributes?.options;
      if (nativeId !== undefined && nativeId !== null && String(nativeId) !== '') roomIds.add(String(nativeId));
      // Presence in the registry defines support; connectivity defines usability.
      settings[key] = { entity, value: state?.state,
        options: Array.isArray(options) ? options.filter(o => typeof o === 'string') : (!available(state) ? prior?.options ?? [] : []),
        available: hass.connected !== false && available(state) };
    }
    const roomId = roomIds.size === 1 ? [...roomIds][0] : undefined;
    return [{ name, entity: entry.entity_id, context, roomId, settings, available: available(hass.states[entry.entity_id]), excluded: config.excluded_rooms.includes(entry.entity_id) }];
  });
  const ids = rooms.map(r => r.entity).filter(Boolean);
  if (new Set(ids).size !== ids.length) issues.push('Multiple rooms map to the same switch.');
  const rank = id => { const i = config.room_order.indexOf(id); return i < 0 ? Number.MAX_SAFE_INTEGER : i; };
  rooms.sort((a, b) => rank(a.entity) - rank(b.entity));
  return { rooms, cameraEntity, batteryEntity, chargingEntity, issues };
}

function batteryStatus(hass, model) {
  const battery = hass?.states?.[model?.batteryEntity];
  const charging = hass?.states?.[model?.chargingEntity];
  const connected = hass?.connected !== false;
  const raw = battery?.state;
  const value = (typeof raw === 'string' && raw.trim() !== '') || typeof raw === 'number' ? Number(raw) : NaN;
  const percent = connected && available(battery) && Number.isFinite(value) && value >= 0 && value <= 100 ? Math.round(value) : null;
  const chargeState = connected && available(charging) && ['on', 'off'].includes(charging.state) ? charging.state : null;
  const level = percent === null ? 'unknown' : percent < 20 ? 'low' : percent < 50 ? 'medium' : 'high';
  const label = `${percent === null ? 'Battery level unavailable' : `Battery: ${percent}%`}. ${chargeState === 'on' ? 'Charging' : chargeState === 'off' ? 'Not charging' : 'Charging status unavailable'}.`;
  return { percent, charging: chargeState === 'on', level, label };
}

// Only the integration converts labels to Dyson protocol values. One HA action
// receives the complete draft; never fan out to select.select_option here.
const draftRequests = new Set();
async function sendRoomDraft({ hass, model, config, selected = [], draft = {}, start = false, context = roomContext(hass, config.entity) }) {
  if (context !== roomContext(hass, config.entity)) throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
  const service = start ? 'start_rooms_with_settings' : 'save_room_settings';
  if (hass?.connected === false) throw new UiError('Home Assistant is not connected.');
  if (!hass.services?.[DOMAIN]?.[service]) throw new UiError('Update the Dyson integration: {action} is unavailable.', { action: `${DOMAIN}.${service}` });
  const vacuum = hass.states[config.entity];
  if (!available(vacuum)) throw new UiError('The robot is unavailable.');
  if (start && !['docked', 'idle'].includes(vacuum.state) && !(vacuum.state === 'error' && vacuum.attributes?.ready_to_start === true)) throw new UiError('Start is only available when the Dyson is ready (docked or idle).');
  if (start && startBlockReason(hass, config.entity)) throw new UiError(startBlockReason(hass, config.entity));
  const byId = new Map();
  for (const room of model.rooms) {
    if (!room.roomId) continue;
    const list = byId.get(room.roomId) ?? [];
    list.push(room); byId.set(room.roomId, list);
  }
  const resolve = id => {
    const rooms = byId.get(id);
    if (rooms?.length !== 1 || !rooms[0].available || rooms[0].excluded) throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
    const room = rooms[0];
    const liveIds = new Set(Object.values(room.settings ?? {}).flatMap(field => {
      const state = hass.states[field.entity];
      const nativeId = state?.attributes?.room_id;
      return available(state) && nativeId != null && String(nativeId) !== '' ? [String(nativeId)] : [];
    }));
    if (room.context !== context || liveIds.size !== 1 || !liveIds.has(String(id)))
      throw new UiError('A selected room has no stable room ID. Refresh rooms and check the integration.');
    return room;
  };
  const settings = {};
  for (const [id, values] of Object.entries(draft)) {
    const room = resolve(id);
    for (const [key, value] of Object.entries(values)) {
      const field = room.settings?.[key];
      if (!field || !available(hass.states[field.entity]) || !field.options.includes(value)) throw new UiError('{setting} is no longer available for {room}.', { setting: { key: ROOM_FIELDS[key] ?? key }, room: room.name });
      if (hass.states[field.entity].state !== value) (settings[id] ??= {})[key] = value;
    }
  }
  const rooms = start ? selected.map(entity => {
    const room = model.rooms.find(r => r.entity === entity);
    if (!room?.roomId) throw new UiError('A selected room has no stable room ID. Refresh rooms and check the integration.');
    return resolve(room.roomId);
  }) : [];
  if (start && (!rooms.length || new Set(rooms.map(r => r.roomId)).size !== rooms.length)) throw new UiError('Select at least one room without duplicates.');
  if (draftRequests.has(config.entity)) throw new UiError('An action for this Dyson is already running in this browser.');
  if (!start && !Object.keys(settings).length) return { rooms: [], settings, sent: false };
  const data = { entity_id: config.entity, room_settings: settings };
  if (start) data.room_ids = rooms.map(r => r.roomId);
  draftRequests.add(config.entity);
  try { await hass.callService(DOMAIN, service, data); }
  finally { draftRequests.delete(config.entity); }
  return { rooms: rooms.map(r => ({ entity_id: r.entity, room_id: r.roomId, name: r.name })), settings, sent: true };
}

const DOCK_PHASES = {
  WASHING_MOP: ['Cleaning mop roller', 'mdi:waves'],
  DRYING_MOP: ['Drying mop roller', 'mdi:weather-windy'],
  COLLECTING_DUST: ['Emptying dust bin', 'mdi:delete-empty-outline']
};

function dockBusy(hass, entity) {
  const state = hass?.states?.[entity];
  return hass?.connected !== false && available(state) && Object.hasOwn(DOCK_PHASES, state.attributes?.dock_state);
}

// A new cleaning request lets the integration cancel roller drying automatically.
function dockBlocksStart(hass, entity) {
  return dockBusy(hass, entity) && hass.states[entity].attributes.dock_state !== 'DRYING_MOP';
}

// Prefer the integration's explicit veto; keep legacy dock checks as fallback.
function startBlockReason(hass, entity) {
  const attrs = hass?.states?.[entity]?.attributes ?? {};
  if (attrs.ready_to_start === false) {
    return {
      disconnected: 'Robot disconnected',
      robot_fault: 'Robot needs attention',
      washing_mop: 'Cleaning mop roller',
      emptying_bin: 'Emptying dust bin',
      mapping_or_navigation: 'Mapping / navigation in progress',
      returning_or_finishing: 'Returning to dock / finishing cleanup',
      cleaning_job_active: 'A cleaning job is still active',
      waiting_for_ready_state: 'Waiting for the robot to be ready'
    }[attrs.start_block_reason] ?? 'The integration is not ready to start a new clean';
  }
  return dockBlocksStart(hass, entity) ? 'Wait for the dock cycle to finish before starting a clean' : null;
}

// Report live telemetry, never the selected mode or the colours of old map paths.
function activityStatus(hass, entity, pendingStart = false) {
  const state = hass?.states?.[entity];
  const view = cleaningView(hass, entity, pendingStart);
  const result = (text, icon = 'mdi:robot-vacuum', drying = false) => ({ text, icon, drying });
  if (!available(state) || hass?.connected === false) return result('Robot unavailable', 'mdi:alert-circle-outline');
  if (state.state === 'error') return result('Robot needs attention', 'mdi:alert-circle-outline');
  if (state.state === 'paused') return result('Paused', 'mdi:pause');
  if (dockBusy(hass, entity)) {
    const phase = state.attributes.dock_state;
    return result(...DOCK_PHASES[phase], phase === 'DRYING_MOP');
  }
  if (state.state === 'cleaning') {
    const modes = { VACUUMING: 'Vacuuming', MOPPING: 'Mopping', VACUUMING_AND_MOPPING: 'Vacuuming and mopping' };
    return result(modes[state.attributes?.full_clean_action] ?? 'Cleaning');
  }
  if (state.state === 'returning') return result('Returning / mapping', 'mdi:home-import-outline');
  const blocked = startBlockReason(hass, entity);
  if (blocked) return result(blocked, 'mdi:timer-sand');
  return view.active ? result(view.title) : null;
}

function cleaningView(hass, entity, pendingStart = false) {
  const state = hass?.states?.[entity];
  if (!available(state) || hass?.connected === false) return { active: true, title: 'Robot unavailable', detail: 'Waiting for a connection to the robot.', live: false };
  const states = {
    cleaning: ['Cleaning session active', ''],
    paused: ['Cleaning session paused', ''],
    returning: ['Robot returning', 'The integration is reporting a return or mapping operation.'],
    error: ['Robot needs attention', 'Check the robot or the Dyson app for details.']
  };
  // A retained fault does not imply an active job when the integration permits a new start.
  // Keep pending starts in the session view until fresh robot telemetry arrives.
  if (state.state === 'error' && state.attributes?.ready_to_start === true) {
    return pendingStart
      ? { active: true, title: 'Starting clean', detail: 'Waiting for the robot to report its status.', live: false }
      : { active: false, live: false };
  }
  if (states[state.state]) return { active: true, title: states[state.state][0], detail: states[state.state][1], live: true };
  if (pendingStart) return { active: true, title: 'Starting clean', detail: 'Waiting for the robot to report its status.', live: false };
  if (['docked', 'idle'].includes(state.state)) return { active: false, live: false };
  return { active: true, title: 'Waiting for robot status', detail: 'The robot is not reporting a ready state.', live: false };
}

// Display the integration's last confirmed sample; do not invent elapsed time.
function dryingTelemetry(hass, entity, registry = []) {
  const state = hass?.states?.[entity];
  if (hass?.connected === false || !available(state) || state.attributes?.dock_state !== 'DRYING_MOP') return null;
  // A registered but disabled, ambiguous or unavailable sensor must not revive stale legacy data.
  const matches = deviceEntities(registry, entity, 'sensor', 'drying_remaining');
  if (matches.length) {
    if (matches.length !== 1 || matches[0].disabled_by) return null;
    const sensor = hass.states[matches[0].entity_id];
    if (!available(sensor) || typeof sensor.state !== 'string' || !sensor.state.trim()) return null;
    return { remaining: Number(sensor.state), total: sensor.attributes?.total_seconds };
  }
  return { remaining: state.attributes.drying_remaining_seconds, total: state.attributes.drying_total_seconds };
}

function dryingRemainingTime(hass, entity, registry = []) {
  const seconds = dryingTelemetry(hass, entity, registry)?.remaining;
  if (!Number.isFinite(seconds) || seconds < 0) return null;
  const minutes = Math.ceil(seconds / 60);
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

// Fraction of the configured drying duration still remaining, from confirmed telemetry.
function dryingRemainingPercent(hass, entity, registry = []) {
  if (dryingRemainingTime(hass, entity, registry) === null) return null;
  const { total, remaining } = dryingTelemetry(hass, entity, registry);
  if (!Number.isFinite(total) || total <= 0 || remaining > total) return null;
  return remaining / total * 100;
}

function canControl(hass, entity, action) {
  const state = hass?.states?.[entity];
  if (action === 'cancel_drying') return !!(hass?.connected !== false && available(state) &&
    state.attributes?.dock_state === 'DRYING_MOP' && hass.services?.[DOMAIN]?.cancel_drying);
  const feature = { pause: 4, start: 8192, return_to_base: 16 }[action];
  const allowedStates = { pause: ['cleaning'], start: ['paused'], return_to_base: ['cleaning', 'paused', 'returning', 'error'] }[action] ?? [];
  return !!(feature && hass?.connected !== false && available(state) &&
    !dockBusy(hass, entity) &&
    allowedStates.includes(state.state) &&
    (Number(state.attributes?.supported_features) & feature) && hass.services?.vacuum?.[action]);
}

async function controlCleaning(hass, entity, action) {
  if (!canControl(hass, entity, action)) throw new UiError('This action is not available for the current robot state.');
  // Queue cancellation belongs to the integration. Do not toggle room switches here.
  await hass.callService(action === 'cancel_drying' ? DOMAIN : 'vacuum', action, { entity_id: entity });
}

const CONSUMABLES = [
  ['brushBar', 'Brush bar'], ['mopRoller', 'Mop roller'], ['mopPad', 'Mop pad'],
  ['sideBrushes', 'Side brushes'], ['robotFilter', 'Robot filter'],
  ['dockFilter', 'Dock filter'], ['cleaningSolution', 'Cleaning solution']
];

function consumableStatus(hass, registry, entity) {
  const vacuum = registry.find(e => e.entity_id === entity && e.platform === DOMAIN && !e.disabled_by);
  const serial = String(vacuum?.unique_id ?? '').replace(/_vacuum$/, '');
  const suffixes = { brushBar:'brush_bar_usage', mopRoller:'mop_roller_usage', mopPad:'mop_pad_usage', sideBrushes:'side_brushes_usage', robotFilter:'robot_filter_usage', dockFilter:'dock_filter_usage', cleaningSolution:'cleaning_solution' };
  return CONSUMABLES.map(([type, name]) => {
    const sensors = vacuum?.device_id ? registry.filter(e => e.platform === DOMAIN && e.device_id === vacuum.device_id && !e.disabled_by && e.entity_id.startsWith('sensor.')) : [];
    const exact = sensors.filter(e => e.unique_id === `${serial}_consumable_${suffixes[type]}`);
    // Identity takes precedence, including when its sensor is temporarily unavailable.
    const candidates = exact.length ? exact : sensors.filter(e => hass?.states?.[e.entity_id]?.attributes?.consumable_type === type);
    const state = candidates.length === 1 ? hass?.states?.[candidates[0].entity_id] : null;
    const live = hass?.connected !== false && available(state);
    if (type === 'cleaningSolution') {
      const value = live && state.attributes?.value_kind === 'refill_status' ? state.state : null;
      return { type, name, supported: candidates.length === 1, remaining: null, level: 'unknown', refillStatus: value, text: value === 'ok' ? 'Ready to use' : value === 'refill_required' ? 'Refill required' : 'Unavailable' };
    }
    const raw = state?.state;
    const usage = typeof raw === 'number' || (typeof raw === 'string' && raw.trim() !== '') ? Number(raw) : NaN;
    const remaining = live && state.attributes?.value_kind === 'usage_percent' && Number.isFinite(usage) && usage >= 0 && usage <= 100 ? Math.round((100 - usage) * 10) / 10 : null;
    return { type, name, supported: candidates.length === 1, remaining, level: remaining === null ? 'unknown' : remaining <= 10 ? 'low' : remaining <= 25 ? 'medium' : 'high', text: remaining === null ? 'Unavailable' : `${remaining}% remaining` };
  });
}


const ROBOT_FIELDS = [
  ['voice_prompts', 'Voice prompts', 'switch'],
  ['volume', 'Volume', 'number', 'voice_prompts'],
  ['child_lock', 'Child lock', 'switch'],
  ['do_not_disturb', 'Do not disturb', 'switch'],
  ['do_not_disturb_start', 'Start time', 'time', 'do_not_disturb'],
  ['do_not_disturb_end', 'End time', 'time', 'do_not_disturb'],
];
function robotSettings(hass, registry, entity) {
  const fields = ROBOT_FIELDS.map(([key, label, domain, parent]) => {
    const matches = deviceEntities(registry, entity, domain, `setting_${key}`).filter(e => !e.disabled_by);
    const id = matches.length === 1 ? matches[0].entity_id : undefined;
    const state = hass?.states?.[id], value = state?.state;
    const valid = domain === 'switch' ? ['on', 'off'].includes(value) : domain === 'number'
      ? value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 100
      : /^([01]\d|2[0-3]):[0-5]\d(:00)?$/.test(value || '');
    const service = domain === 'switch' ? hass?.services?.switch?.turn_on && hass?.services?.switch?.turn_off : hass?.services?.[domain]?.set_value;
    return { key, label, domain, parent, entity:id, supported:!!id, value, available:hass?.connected !== false && available(state) && valid && !!service };
  });
  return fields.map(field => ({ ...field, enabled:!field.parent || fields.some(p => p.key === field.parent && p.available && p.value === 'on') }));
}
async function changeRobotSetting(hass, registry, entity, key, value) {
  const field = robotSettings(hass, registry, entity).find(f => f.key === key);
  if (!field?.available || !field.enabled) throw new UiError('This robot setting is unavailable.');
  if (field.domain === 'switch') {
    if (typeof value !== 'boolean') throw new UiError('Invalid robot setting.');
    return hass.callService('switch', value ? 'turn_on' : 'turn_off', { entity_id:field.entity });
  }
  if (field.domain === 'number') {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 100 || value % 10) throw new UiError('Invalid robot setting.');
    return hass.callService('number', 'set_value', { entity_id:field.entity, value });
  }
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new UiError('Invalid robot setting.');
  return hass.callService('time', 'set_value', { entity_id:field.entity, time:`${value}:00` });
}

const STATION_FIELDS = [
  ['hot_water_mopping', 'Hot water mopping', 'switch'],
  ['cleaning_solution', 'Cleaning solution', 'switch'],
  ['extended_roller_preparation', 'Extended roller preparation', 'switch'],
  ['hot_water_self_cleaning', 'Hot water self-cleaning', 'switch'],
  ['self_cleaning_frequency', 'Self-cleaning frequency', 'select'],
  ['roller_drying_duration', 'Roller drying duration', 'select']
];

const STATION_ACTIONS = [
  ['empty_bin', 'Empty dust bin'],
  ['wash_mop', 'Wash mop roller'],
  ['dry_mop', 'Dry mop roller']
];

function deviceEntities(registry, entity, domain, suffix) {
  const vacuum = registry.find(e => e.entity_id === entity && e.platform === DOMAIN && !e.disabled_by);
  const serial = String(vacuum?.unique_id ?? '').replace(/_vacuum$/, '');
  return vacuum?.device_id ? registry.filter(e => e.platform === DOMAIN && e.device_id === vacuum.device_id && e.entity_id.startsWith(`${domain}.`) && e.unique_id === `${serial}_${suffix}`) : [];
}

function stationActions(hass, registry, entity) {
  return STATION_ACTIONS.map(([key, label]) => {
    const matches = deviceEntities(registry, entity, 'button', key);
    const id = matches.length === 1 && !matches[0].disabled_by ? matches[0].entity_id : undefined;
    const state = hass?.states?.[id];
    // Button states are timestamps, or unknown before the first press.
    return { key, label, entity: id, supported: !!id, available: hass?.connected !== false && !!state && state.state !== 'unavailable' && !state.attributes?.restored && !!hass?.services?.button?.press };
  });
}

async function pressStationAction(hass, registry, entity, key) {
  const action = stationActions(hass, registry, entity).find(item => item.key === key);
  if (!action?.available) throw new UiError('This station action is unavailable.');
  await hass.callService('button', 'press', { entity_id: action.entity });
}

function stationSettings(hass, registry, entity) {
  const vacuum = registry.find(e => e.entity_id === entity && e.platform === DOMAIN && !e.disabled_by);
  const serial = String(vacuum?.unique_id ?? '').replace(/_vacuum$/, '');
  return STATION_FIELDS.map(([key, label, domain]) => {
    const matches = vacuum?.device_id ? registry.filter(e => e.platform === DOMAIN && e.device_id === vacuum.device_id && !e.disabled_by && e.entity_id.startsWith(`${domain}.`) && e.unique_id === `${serial}_station_${key}`) : [];
    const id = matches.length === 1 ? matches[0].entity_id : undefined;
    const state = hass?.states?.[id];
    const options = Array.isArray(state?.attributes?.options) ? state.attributes.options.filter(v => typeof v === 'string') : [];
    const valid = domain === 'switch' ? ['on', 'off'].includes(state?.state) : options.includes(state?.state);
    const service = domain === 'switch' ? hass?.services?.switch?.turn_on && hass?.services?.switch?.turn_off : hass?.services?.select?.select_option;
    return { key, label, domain, entity: id, supported: !!id, value: state?.state, options, available: hass?.connected !== false && available(state) && valid && !!service };
  });
}

async function changeStationSetting(hass, registry, entity, key, value) {
  const field = stationSettings(hass, registry, entity).find(f => f.key === key);
  if (!field?.available) throw new UiError('This station setting is unavailable.');
  if (field.domain === 'switch') {
    if (typeof value !== 'boolean') throw new UiError('Invalid station switch value.');
    await hass.callService('switch', value ? 'turn_on' : 'turn_off', { entity_id: field.entity });
  } else {
    if (!field.options.includes(value)) throw new UiError('Invalid station option.');
    await hass.callService('select', 'select_option', { entity_id: field.entity, option: value });
  }
}

// Mirror the integration's current RB05-only zone support. Product 804 covers
// Spot+Scrub AI and R3. Other models need an integration capability contract first.
function supportsZoneDevice(registry, devices, entity) {
  const vacuum = registry.find(e => e.entity_id === entity && e.platform === DOMAIN && !e.disabled_by);
  const device = devices.find(d => d.id === vacuum?.device_id);
  return /^(804[A-Z]?|RB05)$/i.test(String(device?.model ?? ''));
}

// Only expose protocol values both understood by the zone adapter and offered
// by this device's room selects. This restricts options, not zone-model support.
const ZONE_CHOICES = {
  mode: [['Vacuum','vacuum'], ['Vacuum and Mop','vacuumAndMop'], ['Mop','mop'], ['Vacuum then Mop','vacuumThenMop']],
  strategy: [['Auto','auto'], ['Boost','boost'], ['Quiet','quiet'], ['Quick','quick']],
  water: [['Very Low','veryLow'], ['Low','low'], ['Medium','medium'], ['High','high']],
  passes: [['One Pass',1], ['Two Passes',2]],
};
function zoneDeviceOptions(rooms) {
  const keys = { mode:'cleaning_mode', strategy:'cleaning_strategy', water:'water_level', passes:'mop_repetitions' };
  return Object.fromEntries(Object.entries(keys).map(([key, field]) => {
    const fields = rooms.map(r => r.settings?.[field]).filter(Boolean);
    const options = ZONE_CHOICES[key].filter(([label]) => fields.length && fields.every(f => f.options.includes(label)));
    return [key, { supported: fields.length > 0, available: fields.length > 0 && fields.every(f => f.available), options }];
  }));
}

function vacuumEntries(registry) {
  return registry.filter(e => e.platform === DOMAIN && !e.disabled_by && e.entity_id.startsWith('vacuum.'));
}
function cameraEntries(registry, entity) {
  const device = registry.find(e => e.entity_id === entity)?.device_id;
  return registry.filter(e => e.platform === DOMAIN && !e.disabled_by && e.device_id === device && e.entity_id.startsWith('camera.'));
}
function defaultEntity(hass) {
  const entry = Object.values(hass.entities ?? {}).find(e => e.platform === DOMAIN && e.entity_id.startsWith('vacuum.'));
  return entry?.entity_id ?? Object.keys(hass.states).find(id => id.startsWith('vacuum.') && Array.isArray(hass.states[id].attributes.rooms)) ?? '';
}
function roomSelectionState(hass, entity) { return hass.states[entity]?.state; }
function hasRoomList(hass, entity) { return Array.isArray(hass.states[entity]?.attributes?.rooms); }
function roomActionAvailable(hass, start) { return !!hass?.services?.[DOMAIN]?.[start ? 'start_rooms_with_settings' : 'save_room_settings']; }
function mapId(hass, entity) { return hass?.states?.[entity]?.attributes?.map_id; }
function mapPicture(hass, entity) { return hass?.states?.[entity]?.attributes?.entity_picture; }
function mapCalibration(hass, entity) { return hass?.states?.[entity]?.attributes?.map_calibration; }
function trustedCamera(registry, entity, camera) {
  const robotEntry = registry.find(e => e.entity_id === entity);
  const cameraEntry = registry.find(e => e.entity_id === camera);
  return !!(robotEntry?.device_id && robotEntry.platform === DOMAIN && cameraEntry?.platform === DOMAIN && robotEntry.device_id === cameraEntry.device_id);
}
function robotTelemetry(hass, entity, camera) {
  const vacuum = hass?.states?.[entity], image = hass?.states?.[camera];
  const attrs = vacuum?.attributes ?? {};
  return { state: vacuum?.state, available: available(vacuum), name: attrs.friendly_name,
    dockState: attrs.dock_state, fault: attrs.fault, faultCode: attrs.fault_code,
    cleaning: hass?.connected !== false && vacuum?.state === 'cleaning' && !Object.hasOwn(DOCK_PHASES, attrs.dock_state),
    bumperColor: available(image) ? image.attributes?.robot_bumper_color : undefined };
}
function dockActivity(hass, entity) {
  const phase = hass?.states?.[entity]?.attributes?.dock_state;
  return DOCK_PHASES[phase] ? { text: DOCK_PHASES[phase][0], icon: DOCK_PHASES[phase][1], drying: phase === 'DRYING_MOP' } : null;
}
// Spot+Scrub zone tests confirm mopPasses controls repetitions even for vacuum.
// In vacuumThenMop it repeats only mopping; dryPasses stays at one.
function zoneSettingsPayload(mode, strategy, water, passes) {
  if (!['vacuum','vacuumAndMop','mop','vacuumThenMop'].includes(mode)
      || !['auto','boost','quiet','quick'].includes(strategy)
      || !['veryLow','low','medium','high'].includes(water)
      || ![1,2].includes(passes)) throw new Error('Invalid zone settings');
  return { clean_type:mode, cleaning_strategy:mode==='mop'?'auto':strategy,
    water_level:mode==='vacuum'?'low':water,
    mop_passes:passes, dry_passes:1 };
}


function zoneReady(hass, vacuum, camera, calibration, trusted, preview) {
  const state = hass?.states?.[vacuum], cameraState = hass?.states?.[camera];
  return !!(!preview && trusted && hass?.connected !== false && hass?.services?.[DOMAIN]?.clean_zone
    && state && !['unknown', 'unavailable'].includes(state.state) && state.attributes?.ready_to_start === true
    && cameraState && !['unknown', 'unavailable'].includes(cameraState.state) && validZoneCalibration(calibration)
    && String(mapId(hass, vacuum)) === String(calibration.map_id)
    && String(mapCalibration(hass, camera)?.map_id) === String(calibration.map_id));
}
function startZone(hass, { vacuum, camera, calibration, trusted, preview, rect, rotation, mode, strategy, water, passes }) {
  if (!zoneReady(hass, vacuum, camera, calibration, trusted, preview)) throw new UiError('This action is not available for the current robot state.');
  const data = { entity_id: vacuum, map_id: calibration.map_id,
    rectangle: zoneRobotRectangle(rect, calibration, rotation), ...zoneSettingsPayload(mode, strategy, water, passes) };
  return hass.callService(DOMAIN, 'clean_zone', data);
}

return Object.freeze({ id: DOMAIN, roomContext, discover, batteryStatus, sendRoomDraft, dockBusy, dockBlocksStart, startBlockReason, activityStatus, cleaningView, dryingRemainingTime, dryingRemainingPercent, canControl, controlCleaning, CONSUMABLES, consumableStatus, ROBOT_FIELDS, robotSettings, changeRobotSetting, STATION_FIELDS, STATION_ACTIONS, stationActions, pressStationAction, stationSettings, changeStationSetting, supportsZoneDevice, ZONE_CHOICES, zoneDeviceOptions, vacuumEntries, cameraEntries, defaultEntity, roomSelectionState, hasRoomList, roomActionAvailable, mapId, mapPicture, mapCalibration, trustedCamera, robotTelemetry, dockActivity, zoneReady, startZone, zoneSettingsPayload,
  mapPictureAllowed:picture => typeof picture === 'string' && picture.startsWith('/api/camera_proxy/'),
});
})();
