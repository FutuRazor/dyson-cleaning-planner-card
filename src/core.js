export const DOMAIN = 'dyson_spot_scrub';
export const ROOM_FIELDS = { cleaning_mode: 'Cleaning mode', cleaning_strategy: 'Vacuum Power', water_level: 'Water level', mop_repetitions: 'Mop repetitions' };
export const available = state => !!state && !['unavailable', 'unknown'].includes(state.state) && !state.attributes?.restored;
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function normalizeConfig(config) {
  if (!config || typeof config.entity !== 'string' || !config.entity.startsWith('vacuum.')) throw new Error('Select a vacuum entity.');
  if (config.unsupported_settings && !['disabled', 'hidden'].includes(config.unsupported_settings)) throw new Error('unsupported_settings must be disabled or hidden.');
  for (const key of ['excluded_rooms', 'room_order']) {
    if (config[key] !== undefined && (!Array.isArray(config[key]) || config[key].some(x => typeof x !== 'string'))) throw new Error(`${key} must be a list of entity IDs.`);
  }
  if (config.room_entities !== undefined && (!config.room_entities || typeof config.room_entities !== 'object' || Array.isArray(config.room_entities) || Object.values(config.room_entities).some(x => typeof x !== 'string' || !x.startsWith('switch.')))) throw new Error('room_entities must map room names to switch entities.');
  if (config.show_camera !== undefined && typeof config.show_camera !== 'boolean') throw new Error('show_camera must be true or false.');
  if (config.always_show_all_settings !== undefined && typeof config.always_show_all_settings !== 'boolean') throw new Error('always_show_all_settings must be true or false.');
  if (config.camera_rotation !== undefined && ![0, 90, 180, 270].includes(config.camera_rotation)) throw new Error('camera_rotation must be 0, 90, 180 or 270.');
  if (config.camera_entity && (typeof config.camera_entity !== 'string' || !config.camera_entity.startsWith('camera.'))) throw new Error('Select a camera entity.');
  return { ...config, title: config.title ?? 'Plan a clean', always_show_all_settings: config.always_show_all_settings ?? false, unsupported_settings: config.unsupported_settings ?? 'disabled', excluded_rooms: config.excluded_rooms ?? [], room_order: config.room_order ?? [], show_camera: config.show_camera ?? true, camera_rotation: config.camera_rotation ?? 0 };
}

// Entity IDs are user-editable. Match registry identity within ONE integration device.
export function discover(hass, registry, config) {
  const issues = [];
  const vacuum = registry.find(e => e.entity_id === config.entity && e.platform === DOMAIN && !e.disabled_by);
  if (!vacuum?.device_id) return { rooms: [], managed: [], issues: ['The Dyson device was not found in the entity registry.'] };
  const entries = registry.filter(e => e.device_id === vacuum.device_id && e.platform === DOMAIN && !e.disabled_by);
  const serial = String(vacuum.unique_id ?? '').replace(/_vacuum$/, '');
  const pick = (explicit, suffix, domain) => {
    const candidates = entries.filter(e => e.entity_id.startsWith(`${domain}.`) && (explicit ? e.entity_id === explicit : e.unique_id === `${serial}_${suffix}`));
    return candidates.length === 1 ? candidates[0].entity_id : undefined;
  };
  const modeEntity = pick(config.mode_entity, 'cleaning_mode', 'select');
  const startEntity = pick(config.start_entity, 'start_button', 'button');
  const cameraEntity = pick(config.camera_entity, 'floor_map', 'camera');
  const batteryEntity = pick(undefined, 'battery', 'sensor');
  const chargingEntity = pick(undefined, 'charging', 'binary_sensor');
  const managed = entries.filter(e => e.entity_id.startsWith('switch.') && String(e.unique_id).startsWith(`${serial}_room_`));
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
    if (!managed.some(e => e.entity_id === entry.entity_id)) managed.push(entry);
    const settings = {};
    const roomIds = new Set();
    for (const key of Object.keys(ROOM_FIELDS)) {
      const candidates = entries.filter(e => e.entity_id.startsWith('select.') && e.unique_id === `${entry.unique_id}_${key}` && available(hass.states[e.entity_id]));
      if (candidates.length !== 1) continue;
      const entity = candidates[0].entity_id, state = hass.states[entity];
      const nativeId = state.attributes?.room_id;
      if (nativeId === undefined || nativeId === null || String(nativeId) === '') continue;
      const options = state.attributes?.options;
      if (!Array.isArray(options) || !options.every(o => typeof o === 'string')) continue;
      roomIds.add(String(nativeId));
      settings[key] = { entity, value: state.state, options };
    }
    const roomId = roomIds.size === 1 ? [...roomIds][0] : undefined;
    return [{ name, entity: entry.entity_id, roomId, settings: roomId ? settings : {}, available: available(hass.states[entry.entity_id]), excluded: config.excluded_rooms.includes(entry.entity_id) }];
  });
  const ids = rooms.map(r => r.entity).filter(Boolean);
  if (new Set(ids).size !== ids.length) issues.push('Multiple rooms map to the same switch.');
  const rank = id => { const i = config.room_order.indexOf(id); return i < 0 ? Number.MAX_SAFE_INTEGER : i; };
  rooms.sort((a, b) => rank(a.entity) - rank(b.entity));
  return { rooms, managed: managed.map(e => e.entity_id), modeEntity, startEntity, cameraEntity, batteryEntity, chargingEntity, issues };
}

export function batteryStatus(hass, model) {
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
export async function sendRoomDraft({ hass, model, config, selected = [], draft = {}, start = false }) {
  const service = start ? 'start_rooms_with_settings' : 'save_room_settings';
  if (hass?.connected === false) throw new Error('Home Assistant is not connected.');
  if (!hass.services?.[DOMAIN]?.[service]) throw new Error(`Update the Dyson integration: ${DOMAIN}.${service} is unavailable.`);
  const vacuum = hass.states[config.entity];
  if (!available(vacuum)) throw new Error('The robot is unavailable.');
  if (start && !['docked', 'idle'].includes(vacuum.state)) throw new Error('Start is only available when the Dyson is ready (docked or idle).');
  const byId = new Map();
  for (const room of model.rooms) {
    if (!room.roomId) continue;
    const list = byId.get(room.roomId) ?? [];
    list.push(room); byId.set(room.roomId, list);
  }
  const resolve = id => {
    const rooms = byId.get(id);
    if (rooms?.length !== 1 || !rooms[0].available || rooms[0].excluded) throw new Error('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
    return rooms[0];
  };
  const settings = {};
  for (const [id, values] of Object.entries(draft)) {
    const room = resolve(id);
    for (const [key, value] of Object.entries(values)) {
      const field = room.settings?.[key];
      if (!field || !available(hass.states[field.entity]) || !field.options.includes(value)) throw new Error(`${ROOM_FIELDS[key] ?? key} is no longer available for ${room.name}.`);
      if (hass.states[field.entity].state !== value) (settings[id] ??= {})[key] = value;
    }
  }
  const rooms = start ? selected.map(entity => {
    const room = model.rooms.find(r => r.entity === entity);
    if (!room?.roomId) throw new Error('A selected room has no stable room ID. Refresh rooms and check the integration.');
    return resolve(room.roomId);
  }) : [];
  if (start && (!rooms.length || new Set(rooms.map(r => r.roomId)).size !== rooms.length)) throw new Error('Select at least one room without duplicates.');
  if (draftRequests.has(config.entity)) throw new Error('An action for this Dyson is already running in this browser.');
  if (!start && !Object.keys(settings).length) return { rooms: [], settings, sent: false };
  const data = { entity_id: config.entity, room_settings: settings };
  if (start) data.room_ids = rooms.map(r => r.roomId);
  draftRequests.add(config.entity);
  try { await hass.callService(DOMAIN, service, data); }
  finally { draftRequests.delete(config.entity); }
  return { rooms: rooms.map(r => ({ entity_id: r.entity, room_id: r.roomId, name: r.name })), settings, sent: true };
}

export function cleaningView(hass, entity, pendingStart = false) {
  const state = hass?.states?.[entity];
  if (!available(state) || hass?.connected === false) return { active: true, title: 'Robot unavailable', detail: 'Waiting for a connection to the robot.', live: false };
  const states = {
    cleaning: ['Cleaning session active', ''],
    paused: ['Cleaning session paused', ''],
    returning: ['Robot returning', 'The integration is reporting a return or mapping operation.'],
    error: ['Robot needs attention', 'Check the robot or the Dyson app for details.']
  };
  if (states[state.state]) return { active: true, title: states[state.state][0], detail: states[state.state][1], live: true };
  if (pendingStart) return { active: true, title: 'Starting clean', detail: 'Waiting for the robot to report its status.', live: false };
  if (['docked', 'idle'].includes(state.state)) return { active: false, live: false };
  return { active: true, title: 'Waiting for robot status', detail: 'The robot is not reporting a ready state.', live: false };
}

export function canControl(hass, entity, action) {
  const state = hass?.states?.[entity];
  const feature = { pause: 4, start: 8192, return_to_base: 16 }[action];
  const allowedStates = { pause: ['cleaning'], start: ['paused'], return_to_base: ['cleaning', 'paused', 'returning', 'error'] }[action] ?? [];
  return !!(feature && hass?.connected !== false && available(state) &&
    allowedStates.includes(state.state) &&
    (Number(state.attributes?.supported_features) & feature) && hass.services?.vacuum?.[action]);
}

export async function controlCleaning(hass, entity, action) {
  if (!canControl(hass, entity, action)) throw new Error('This action is not available for the current robot state.');
  // Queue cancellation belongs to the integration. Do not toggle room switches here.
  await hass.callService('vacuum', action, { entity_id: entity });
}

export function fitMap(width, height, boxWidth, rotation) {
  if (![width, height, boxWidth].every(n => Number.isFinite(n) && n > 0)) return { width: 0, height: 0, frameHeight: 0 };
  const sideways = rotation === 90 || rotation === 270;
  const scale = boxWidth / (sideways ? height : width);
  return { width: width * scale, height: height * scale, frameHeight: (sideways ? width : height) * scale };
}

export function createPlan(model, selected, mode) {
  if (!selected.length) throw new Error('Select at least one room.');
  if (new Set(selected).size !== selected.length) throw new Error('Duplicate room selection.');
  const rooms = selected.map(entity => {
    const room = model.rooms.find(r => r.entity === entity && !r.excluded);
    if (!room?.available) throw new Error('A selected room is no longer available. Check the selection.');
    return { entity_id: entity, name: room.name };
  });
  // Internal versioned contract, NOT a currently supported Dyson service payload.
  return { version: 1, rooms, mode };
}

export function assertReady(hass, model, config, plan) {
  if (!hass || hass.connected === false) throw new Error('Home Assistant is not connected.');
  const vacuum = hass.states[config.entity];
  if (!available(vacuum) || !['docked', 'idle'].includes(vacuum.state)) throw new Error('Start is only available when the Dyson is ready (docked or idle).');
  // button.* carries a last-press timestamp, not a readiness status.
  // Do not inspect the start entity's state; button.press reports action errors.
  const mode = hass.states[model.modeEntity];
  if (!available(mode) || !mode.attributes?.options?.includes(plan.mode)) throw new Error('The selected cleaning mode is not available.');
  // Only selected room switches are relevant to this run. Unrelated or obsolete
  // switches in the registry must never block a cleaning session.
  for (const { entity_id: id } of plan.rooms) {
    const state = hass.states[id];
    if (!available(state) || !['on', 'off'].includes(state.state)) throw new Error('A selected room switch is not available.');
  }
  createPlan(model, plan.rooms.map(r => r.entity_id), plan.mode);
  for (const [domain, service] of [['select', 'select_option'], ['switch', 'turn_on'], ['switch', 'turn_off'], ['button', 'press']]) {
    if (!hass.services?.[domain]?.[service]) throw new Error(`Home Assistant action ${domain}.${service} is unavailable.`);
  }
}

export async function waitForState(getHass, predicate, { timeout = 6000, interval = 100 } = {}) {
  const deadline = Date.now() + timeout;
  while (!predicate(getHass())) {
    if (Date.now() >= deadline) throw new Error('Home Assistant did not confirm the setting in time. No start command was sent.');
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

// Legacy adapter. Never infer order from switch toggling, never use vacuum.start.
const activeStarts = new Set();
export async function startLegacy(args) {
  const key = args.config.entity;
  if (activeStarts.has(key)) throw new Error('A start request for this Dyson is already running in this browser.');
  activeStarts.add(key);
  try { return await executeLegacy(args); }
  finally { activeStarts.delete(key); }
}

async function executeLegacy({ getHass, getModel, config, plan, wait = waitForState, onProgress = () => {} }) {
  const initial = getModel();
  const signature = JSON.stringify([initial.modeEntity, initial.startEntity]);
  const check = () => {
    const model = getModel();
    if (JSON.stringify([model.modeEntity, model.startEntity]) !== signature) throw new Error('The entity mapping changed. Please review it and try again.');
    assertReady(getHass(), model, config, plan);
    return model;
  };
  check();
  const call = async (domain, service, data) => {
    check();
    await getHass().callService(domain, service, data);
  };
  onProgress('Applying cleaning mode …');
  if (getHass().states[initial.modeEntity].state !== plan.mode) {
    await call('select', 'select_option', { entity_id: initial.modeEntity, option: plan.mode });
    await wait(getHass, h => h.states[initial.modeEntity]?.state === plan.mode);
  }
  const selected = new Set(plan.rooms.map(r => r.entity_id));
  onProgress('Applying room selection …');
  // Also clear ON switches for rooms excluded from this card or no longer on the map.
  for (const id of initial.managed) {
    const desired = selected.has(id) ? 'on' : 'off';
    const state = getHass().states[id];
    if (!state || !available(state) || !['on', 'off'].includes(state.state)) continue;
    if (state.state !== desired) {
      await call('switch', desired === 'on' ? 'turn_on' : 'turn_off', { entity_id: id });
      await wait(getHass, h => h.states[id]?.state === desired);
    }
  }
  check();
  if (getHass().states[initial.modeEntity].state !== plan.mode || [...selected].some(id => getHass().states[id]?.state !== 'on')) throw new Error('The settings changed during preparation. No start command was sent.');
  onProgress('Sending start command …');
  await call('button', 'press', { entity_id: initial.startEntity });
}
