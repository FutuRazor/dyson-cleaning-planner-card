/* Dyson Cleaning Planner Card v0.3.1 | MIT */
const DOMAIN = 'dyson_spot_scrub';
const ROOM_FIELDS = { cleaning_mode: 'Cleaning mode', cleaning_strategy: 'Vacuum Power', water_level: 'Water level', mop_repetitions: 'Clean repetitions' };
const available = state => !!state && !['unavailable', 'unknown'].includes(state.state) && !state.attributes?.restored;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function normalizeConfig(config) {
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
function discover(hass, registry, config) {
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
async function sendRoomDraft({ hass, model, config, selected = [], draft = {}, start = false }) {
  const service = start ? 'start_rooms_with_settings' : 'save_room_settings';
  if (hass?.connected === false) throw new Error('Home Assistant is not connected.');
  if (!hass.services?.[DOMAIN]?.[service]) throw new Error(`Update the Dyson integration: ${DOMAIN}.${service} is unavailable.`);
  const vacuum = hass.states[config.entity];
  if (!available(vacuum)) throw new Error('The robot is unavailable.');
  if (start && !['docked', 'idle'].includes(vacuum.state)) throw new Error('Start is only available when the Dyson is ready (docked or idle).');
  if (start && dockBlocksStart(hass, config.entity)) throw new Error('Wait for the dock cycle to finish before starting a clean.');
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
  if (states[state.state]) return { active: true, title: states[state.state][0], detail: states[state.state][1], live: true };
  if (pendingStart) return { active: true, title: 'Starting clean', detail: 'Waiting for the robot to report its status.', live: false };
  if (['docked', 'idle'].includes(state.state)) return { active: false, live: false };
  return { active: true, title: 'Waiting for robot status', detail: 'The robot is not reporting a ready state.', live: false };
}

function canControl(hass, entity, action) {
  const state = hass?.states?.[entity];
  const feature = { pause: 4, start: 8192, return_to_base: 16 }[action];
  const allowedStates = { pause: ['cleaning'], start: ['paused'], return_to_base: ['cleaning', 'paused', 'returning', 'error'] }[action] ?? [];
  return !!(feature && hass?.connected !== false && available(state) &&
    !dockBusy(hass, entity) &&
    allowedStates.includes(state.state) &&
    (Number(state.attributes?.supported_features) & feature) && hass.services?.vacuum?.[action]);
}

async function controlCleaning(hass, entity, action) {
  if (!canControl(hass, entity, action)) throw new Error('This action is not available for the current robot state.');
  // Queue cancellation belongs to the integration. Do not toggle room switches here.
  await hass.callService('vacuum', action, { entity_id: entity });
}

function fitMap(width, height, boxWidth, rotation) {
  if (![width, height, boxWidth].every(n => Number.isFinite(n) && n > 0)) return { width: 0, height: 0, frameHeight: 0 };
  const sideways = rotation === 90 || rotation === 270;
  const scale = boxWidth / (sideways ? height : width);
  return { width: width * scale, height: height * scale, frameHeight: (sideways ? width : height) * scale };
}

function createPlan(model, selected, mode) {
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

function assertReady(hass, model, config, plan) {
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

async function waitForState(getHass, predicate, { timeout = 6000, interval = 100 } = {}) {
  const deadline = Date.now() + timeout;
  while (!predicate(getHass())) {
    if (Date.now() >= deadline) throw new Error('Home Assistant did not confirm the setting in time. No start command was sent.');
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

// Legacy adapter. Never infer order from switch toggling, never use vacuum.start.
const activeStarts = new Set();
async function startLegacy(args) {
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


const CONSUMABLES = [
  ['brushBar', 'Brush bar'], ['mopRoller', 'Mop roller'],
  ['sideBrushes', 'Side brushes'], ['robotFilter', 'Robot filter'],
  ['dockFilter', 'Dock filter'], ['cleaningSolution', 'Cleaning solution']
];

function consumableStatus(hass, registry, entity) {
  const vacuum = registry.find(e => e.entity_id === entity && e.platform === DOMAIN && !e.disabled_by);
  return CONSUMABLES.map(([type, name]) => {
    const candidates = vacuum?.device_id ? registry.filter(e => e.platform === DOMAIN && e.device_id === vacuum.device_id && !e.disabled_by && e.entity_id.startsWith('sensor.') && hass?.states?.[e.entity_id]?.attributes?.consumable_type === type) : [];
    const state = candidates.length === 1 ? hass?.states?.[candidates[0].entity_id] : null;
    const live = hass?.connected !== false && available(state);
    if (type === 'cleaningSolution') {
      const value = live && state.attributes?.value_kind === 'refill_status' ? state.state : null;
      return { type, name, remaining: null, level: 'unknown', text: value === 'ok' ? 'OK' : value === 'refill_required' ? 'Refill required' : 'Unavailable' };
    }
    const raw = state?.state;
    const usage = typeof raw === 'number' || (typeof raw === 'string' && raw.trim() !== '') ? Number(raw) : NaN;
    const remaining = live && state.attributes?.value_kind === 'usage_percent' && Number.isFinite(usage) && usage >= 0 && usage <= 100 ? Math.round((100 - usage) * 10) / 10 : null;
    return { type, name, remaining, level: remaining === null ? 'unknown' : remaining <= 10 ? 'low' : remaining <= 25 ? 'medium' : 'high', text: remaining === null ? 'Unavailable' : `${remaining}% remaining` };
  });
}


// Owns image refresh independently from card rendering. No direct Dyson calls.
class DysonPlannerMap extends HTMLElement {
  constructor() {
    super(); this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>
      :host{display:block;min-width:0}.viewport{position:relative;width:100%;aspect-ratio:4/3;overflow:hidden;background:var(--secondary-background-color,#f5f7f9);isolation:isolate}
      img{position:absolute;left:50%;top:50%;max-width:none;max-height:none;transform-origin:center;visibility:hidden}.placeholder{position:absolute;inset:0;display:grid;place-items:center;padding:16px;text-align:center;color:var(--secondary-text-color,#52616e);font:13px/1.5 Arial,sans-serif}
      .caption{margin:8px 0 0;padding:0 var(--dp-padding,24px);color:var(--secondary-text-color,#52616e);font:12px/1.5 Arial,sans-serif}.caption:empty{display:none}[hidden]{display:none}
      </style><div class="viewport"><img alt="Live cleaning map"><div class="placeholder">Loading cleaning map …</div></div><p class="caption" role="status" aria-live="polite"></p>`;
    this.img = this.shadowRoot.querySelector('img');
    this.viewport = this.shadowRoot.querySelector('.viewport');
    this.placeholder = this.shadowRoot.querySelector('.placeholder');
    this.caption = this.shadowRoot.querySelector('.caption');
    this.inView = false;
    this.visibilityChanged = () => this.schedule();
  }
  connectedCallback() {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.viewport);
    this.intersectionObserver = new IntersectionObserver(entries => {
      this.inView = entries.some(e => e.isIntersecting);
      this.schedule();
    });
    this.intersectionObserver.observe(this);
    document.addEventListener('visibilitychange', this.visibilityChanged);
  }
  disconnectedCallback() {
    this.cancel(); this.resizeObserver?.disconnect(); this.intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.visibilityChanged);
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = undefined; this.img.removeAttribute('src'); this.img.style.visibility = 'hidden';
  }
  setOptions(hass, entity, rotation, live) {
    if (this.entity !== entity || this.hass?.connection !== hass.connection) {
      this.cancel();
      if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined; this.img.removeAttribute('src'); this.img.style.visibility = 'hidden';
      this.imageWidth = undefined; this.imageHeight = undefined;
      this.lastAttempt = 0; this.placeholder.hidden = false;
    }
    this.hass = hass; this.entity = entity; this.rotation = rotation; this.live = live;
    this.resize(); this.schedule();
  }
  cancel() {
    clearTimeout(this.timer); this.timer = undefined;
    this.abortController?.abort(); this.abortController = undefined;
  }
  schedule() {
    clearTimeout(this.timer); this.timer = undefined;
    if (!this.isConnected || !this.inView || document.hidden) { this.cancel(); return; }
    if (!this.live) { this.cancel(); this.showMessage('Waiting for an active robot status.'); return; }
    if (!this.entity || !available(this.hass?.states?.[this.entity])) {
      this.cancel();
      this.showMessage(this.entity ? 'Camera unavailable.' : 'No map camera found. Select one in the card editor.');
      return;
    }
    if (this.abortController) return;
    const delay = Math.max(0, 5000 - (Date.now() - (this.lastAttempt ?? 0)));
    this.timer = setTimeout(() => this.refresh(), delay);
  }
  showMessage(message) {
    this.placeholder.hidden = !!this.objectUrl;
    this.placeholder.textContent = message;
    this.caption.textContent = this.objectUrl ? `${message} Showing the last received image.` : message;
  }
  async refresh() {
    if (!this.isConnected || !this.inView || document.hidden || !this.live) return;
    const picture = this.hass.states[this.entity]?.attributes?.entity_picture;
    this.lastAttempt = Date.now();
    // Use the HA-provided proxy path/token; never save or log tokens in config.
    if (typeof picture !== 'string' || !picture.startsWith('/api/camera_proxy/')) {
      this.showMessage('The camera image is not available yet.'); this.schedule(); return;
    }
    const url = new URL(this.hass.hassUrl ? this.hass.hassUrl(picture) : picture, location.href);
    url.searchParams.set('_planner', String(this.lastAttempt));
    const controller = new AbortController(); this.abortController = controller;
    const timeout = setTimeout(() => controller.abort(), 10000);
    let objectUrl;
    try {
      const response = await fetch(url, { signal: controller.signal, cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Image request failed');
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) throw new Error('Invalid camera image');
      objectUrl = URL.createObjectURL(blob);
      const image = new Image(); image.src = objectUrl; await image.decode();
      if (controller !== this.abortController || controller.signal.aborted || !this.isConnected) return;
      const previous = this.objectUrl;
      this.objectUrl = objectUrl; objectUrl = undefined;
      this.imageWidth = image.naturalWidth; this.imageHeight = image.naturalHeight;
      this.img.src = this.objectUrl; this.img.style.visibility = 'visible';
      this.placeholder.hidden = true; this.resize();
      this.caption.textContent = '';
      if (previous) URL.revokeObjectURL(previous);
    } catch {
      if (controller === this.abortController) this.showMessage('Map update unavailable.');
    } finally {
      clearTimeout(timeout);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (controller === this.abortController) { this.abortController = undefined; this.schedule(); }
    }
  }
  resize() {
    const size = fitMap(this.imageWidth, this.imageHeight, this.viewport.getBoundingClientRect().width, this.rotation);
    // The card sets the width; the complete rotated image determines the height.
    // The CSS aspect ratio is only a placeholder until the first image arrives.
    this.viewport.style.height = size.frameHeight > 0 ? `${size.frameHeight}px` : '';
    this.img.style.width = `${size.width}px`; this.img.style.height = `${size.height}px`;
    this.img.style.transform = `translate(-50%, -50%) rotate(${this.rotation ?? 0}deg)`;
  }
}
if (!customElements.get('dyson-planner-map')) customElements.define('dyson-planner-map', DysonPlannerMap);


const styles = `
/* Only constrain the content when the dashboard assigns an explicit row count. */
:host([fixed-height]){height:100%;min-height:0}
:host([fixed-height]) ha-card{height:100%;min-height:0}
:host([fixed-height]) .planner-content{height:100%;overflow-y:auto;overscroll-behavior:contain}

ha-card{position:relative}.header-tools{display:flex;flex-direction:column;align-items:flex-end;gap:7px;flex-shrink:0}.consumables-info{min-height:32px;width:100%;padding:3px 10px;background:transparent;color:var(--dp-muted);display:flex;justify-content:center;align-items:center;font-size:12px}.consumables-info.attention{color:var(--error-color,#b3261e);background:color-mix(in srgb,var(--error-color,#b3261e) 10%,var(--dp-bg));border-color:color-mix(in srgb,var(--error-color,#b3261e) 30%,var(--dp-line))}
.consumables-overlay{position:absolute;inset:0;z-index:5;background:#0005;padding:12px;display:flex;align-items:flex-start}.consumables-panel{width:100%;max-height:min(100%,75vh);overflow-y:auto;overscroll-behavior:contain;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:14px;padding:18px;box-shadow:0 8px 30px #0003}.consumables-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:18px}.consumables-heading h3{margin:0;font-size:20px;font-weight:500}.consumables-close{display:flex;padding:8px;min-width:42px}.consumable-row{margin:0 0 20px}.consumable-row:last-child{margin-bottom:0}.consumable-label{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:13px;margin-bottom:8px}.consumable-value{color:var(--dp-muted)}.consumable-track{height:8px;border-radius:8px;background:var(--divider-color,#dde3e8);overflow:hidden}.consumable-fill{display:block;height:100%;background:var(--success-color,#2e7d32)}.consumable-fill.medium{background:var(--warning-color,#ad6800)}.consumable-fill.low{background:var(--error-color,#b3261e)}

:host{--dp-padding:24px}.header-title{flex:1;min-width:0}.header-title h2{overflow-wrap:anywhere}.robot{flex-shrink:0}.battery{display:flex;align-items:center;gap:7px;flex-shrink:0;align-self:flex-start;margin-top:4px;font-size:13px;font-variant-numeric:tabular-nums;white-space:nowrap}.battery svg{width:32px;height:20px;color:var(--dp-muted)}.battery[data-level=high] svg{color:var(--success-color,#2e7d32)}.battery[data-level=medium] svg{color:var(--warning-color,#ad6800)}.battery[data-level=low] svg{color:var(--error-color,#b3261e)}
:host{display:block;color:var(--primary-text-color,#20272d);font-family:var(--paper-font-body1_-_font-family,Arial,sans-serif);--dp-bg:var(--ha-card-background,var(--card-background-color,#fff));--dp-line:var(--divider-color,#dde3e8);--dp-muted:var(--secondary-text-color,#52616e);--dp-accent:var(--primary-color,#007da5);--dp-soft:color-mix(in srgb,var(--dp-accent) 10%,var(--dp-bg))}
*{box-sizing:border-box}ha-card{display:block;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:var(--ha-card-border-radius,22px);overflow:hidden;box-shadow:var(--ha-card-box-shadow,0 3px 18px #0000000a)}
header{display:flex;gap:13px;align-items:center;padding:24px 24px 16px}.robot{background:var(--dp-soft);color:var(--dp-accent);padding:13px;border-radius:15px;display:flex}ha-icon{width:24px;height:24px}h2{font-size:22px;font-weight:500;margin:0 0 5px}p{margin:0;font-size:13px;line-height:1.5;color:var(--dp-muted)}.tag{display:inline-block;margin-left:6px;font-size:10px;padding:3px 6px;border:1px solid var(--dp-line);border-radius:6px;vertical-align:middle}.hint{padding:0 24px 16px}.rooms{padding:0 16px;display:grid;gap:10px}.room{border:1px solid var(--dp-line);border-radius:13px;overflow:hidden}.selected{background:var(--dp-soft)}.room-head{display:flex;align-items:center;gap:8px;padding:10px 12px;min-height:74px}.pick{display:flex;align-items:center;gap:11px;flex:1;min-width:0;min-height:44px}.name{display:block;font-size:15px;font-weight:500;margin-bottom:5px;overflow-wrap:anywhere}.summary{display:block;font-size:12px;color:var(--dp-muted);line-height:1.5}.fields{border-top:1px solid var(--dp-line);padding:14px;background:var(--dp-bg);display:grid;grid-template-columns:1fr 1fr;gap:14px}.field{display:flex;flex-direction:column;gap:7px;font-size:12px;color:var(--dp-muted)}.mode{grid-column:1/-1}.fine{grid-column:1/-1;border-top:1px solid var(--dp-line);padding-top:12px;margin-top:2px}.badge{color:var(--warning-color,#995000);font-size:11px;line-height:1.5}button,select,input{font:inherit}button,select{color:inherit;border:1px solid var(--dp-line);background:var(--dp-bg);border-radius:9px;min-height:42px;padding:9px 12px;font-size:13px}button{cursor:pointer}button:disabled{cursor:default;opacity:.5}select{width:100%;min-width:0;background:var(--secondary-background-color,#f5f7f9);font-size:14px}select:disabled{color:var(--dp-muted);opacity:.65}.mode select{background:var(--dp-soft)}input[type=checkbox]{width:19px;height:19px;accent-color:var(--dp-accent);flex-shrink:0}.expand{border:0;background:transparent;white-space:nowrap}.order{display:flex;gap:5px;margin-top:10px}.order button{min-width:42px}footer{padding:20px 24px 24px}.summary-line{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:15px;font-size:13px}.actions{display:flex;gap:10px}.actions button{flex:1;min-height:46px}.start{background:var(--dp-accent);border-color:transparent;color:var(--text-primary-color,#fff)}.notice{margin-top:12px}.error{color:var(--error-color,#b3261e)}.reset{margin-top:12px;background:transparent}.empty{padding:16px 24px}.status{color:var(--dp-muted)}button:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid var(--dp-accent);outline-offset:3px}[hidden]{display:none!important}
.session{padding:4px 24px 0}.session h3{margin:0 0 8px;font-size:20px;font-weight:500}.session .detail{margin-bottom:18px}.requested-label{font-size:12px;color:var(--dp-muted);margin-bottom:8px}.requested{display:flex;flex-wrap:wrap;gap:7px;list-style:none;padding:0;margin:0 0 10px}.requested li{background:var(--dp-soft);border:1px solid var(--dp-line);border-radius:18px;padding:7px 11px;font-size:13px;overflow-wrap:anywhere}.requested-note{margin-bottom:18px}.map-section{margin-top:20px}.map-title{font-size:13px;font-weight:500;margin:0 0 10px}.session-actions button{display:flex;align-items:center;justify-content:center;gap:8px}.session-actions ha-icon{width:20px;height:20px}.session-footer{padding-top:20px}
.activity-status{display:flex;align-items:center;gap:10px;margin:0 var(--dp-padding) 16px;padding:12px;border-radius:10px;background:var(--dp-soft);font-size:14px}.activity-status ha-icon{flex-shrink:0}.activity-text{flex:1}.cancel-drying{display:flex;align-items:center;justify-content:center;padding:8px;min-width:42px}.map-title{padding:0 var(--dp-padding)}
.map-title{margin-bottom:4px}.map-caption{padding:0 var(--dp-padding);margin:0 0 10px;font-size:12px}.action-message:empty{display:none}.session-actions .pause{background:#ef8c00;color:#171717;border-color:transparent}.session-actions .resume{background:#2e7d32;color:#fff;border-color:transparent}.session-actions .home{background:#c62828;color:#fff;border-color:transparent}
@media(max-width:400px){:host{--dp-padding:15px}header{padding:18px 15px}.hint{padding:0 15px 14px}.rooms{padding:0 10px}footer{padding:18px 15px}.session{padding:4px 15px 0}.expand span{display:none}.actions{flex-direction:column}.session-actions{flex-direction:row}select{font-size:16px}.fields{gap:12px}.tag{margin-left:0}}
`;

// Each instance owns its draft. Registry refresh also catches disabled or renamed entities.
class DysonRegistryElement extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this.registry = []; this.registryError = ''; }
  connectedCallback() {
    this.loadRegistry();
    this._registryTimer = setInterval(() => this.loadRegistry(), 30000);
  }
  disconnectedCallback() { clearInterval(this._registryTimer); }
  set hass(value) {
    const changed = this._hass?.connection !== value?.connection;
    this._hass = value;
    if (changed) { this.registry = []; this._registryLoaded = false; }
    if (this.isConnected && !this._registryLoaded && !this._loadingRegistry) this.loadRegistry();
    this.update?.();
  }
  get hass() { return this._hass; }
  async loadRegistry() {
    if (!this._hass || this._loadingRegistry) return;
    this._loadingRegistry = true;
    const connection = this._hass.connection;
    try {
      const rows = await this._hass.callWS({ type: 'config/entity_registry/list' });
      if (this._hass.connection !== connection) return;
      this.registry = rows;
      this.registryError = '';
      this._registryLoaded = true;
    } catch {
      this.registryError = 'Could not read the entity registry. Check the connection and user permissions.';
      this._registryLoaded = true;
    } finally { this._loadingRegistry = false; this.update?.(); }
  }
  paint(html) {
    if (html === this._html) return;
    const active = this.shadowRoot.activeElement;
    const focused = active?.dataset.focus;
    const selection = active?.tagName === 'INPUT' && active.type === 'text' ? [active.selectionStart, active.selectionEnd, active.selectionDirection] : null;
    this._html = html;
    this.shadowRoot.innerHTML = html;
    if (focused) {
      const next = Array.from(this.shadowRoot.querySelectorAll('[data-focus]')).find(e => e.dataset.focus === focused);
      next?.focus();
      if (selection) next?.setSelectionRange(...selection);
    }
  }
}

class DysonCleaningPlannerCard extends DysonRegistryElement {
  constructor() {
    super(); this.selected = []; this.settingDraft = {}; this.dirty = false; this.busy = false; this.expanded = new Set(); this.message = '';
    this.controlBusy = false; this.pendingStart = false; this.requestedPlan = null;
    this.shadowRoot.addEventListener('change', event => this.onChange(event));
    this.shadowRoot.addEventListener('click', event => this.onClick(event));
    this.shadowRoot.addEventListener('keydown', event => {
      if (!this.consumablesOpen) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); this.toggleConsumables(false); }
      if (event.key === 'Tab') { event.preventDefault(); this.shadowRoot.querySelector('.consumables-close')?.focus(); }
    });
  }
  static getConfigElement() { return document.createElement('dyson-cleaning-planner-card-editor'); }
  static getStubConfig(hass) {
    const entry = Object.values(hass.entities ?? {}).find(e => e.platform === DOMAIN && e.entity_id.startsWith('vacuum.'));
    return { type: 'custom:dyson-cleaning-planner-card', entity: entry?.entity_id ?? Object.keys(hass.states).find(id => id.startsWith('vacuum.') && Array.isArray(hass.states[id].attributes.rooms)) ?? '' };
  }
  setConfig(config) {
    if (this.config?.entity !== config.entity) {
      this.clearSessionEnd();
      this.clearPendingStart(); this.requestedPlan = null; this.sessionObserved = false;
    }
    this.consumablesOpen = false;
    this.config = normalizeConfig(config);
    const rows = config.grid_options?.rows ?? config.layout_options?.grid_rows;
    this.toggleAttribute('fixed-height', typeof rows === 'number' && Number.isFinite(rows) && rows > 0);
    this.initialized = false; this.dirty = false; this.selected = []; this.settingDraft = {}; this.expanded.clear(); this.message = ''; this.lastRooms = [];
    this.update();
  }
  disconnectedCallback() { super.disconnectedCallback(); this.clearPendingStart(); this.clearSessionEnd(); }
  clearPendingStart() { clearTimeout(this._startTimer); this.pendingStart = false; }
  clearSessionEnd() { clearTimeout(this._sessionEndTimer); this._sessionEndTimer = null; }
  deferSessionEnd() {
    if (this._sessionEndTimer) return;
    const entity = this.config.entity;
    // Keep the request briefly across idle/docked telemetry between active states.
    // The planner still returns immediately; badges are only shown in session view.
    this._sessionEndTimer = setTimeout(() => {
      this._sessionEndTimer = null;
      if (!this.isConnected || this.config.entity !== entity || this.busy || this.pendingStart || this.view.active) return;
      this.requestedPlan = null; this.sessionObserved = false;
      this.render();
    }, 5000);
  }
  get view() { return cleaningView(this._hass, this.config?.entity, (this.busy && !this.saving) || this.pendingStart); }
  getCardSize() { return this.view.active ? (this.config?.show_camera ? 9 : 5) : 3 + (this.model?.rooms.length ?? 3); }
  getGridOptions() { return { columns: 12, min_columns: 9, rows: 'auto', min_rows: 1 }; }
  getModel() { return discover(this._hass, this.registry, this.config); }
  resetDraft(clearMessage = true) {
    this.selected = this.model.rooms.filter(r => !r.excluded && r.available && this._hass.states[r.entity]?.state === 'on').map(r => r.entity);
    this.settingDraft = {};
    this.baseline = this.liveSignature(); this.dirty = false;
    if (clearMessage) { this.message = ''; this.error = false; }
  }
  liveSignature() {
    return JSON.stringify(this.model.rooms.map(r => [r.roomId, r.entity, this._hass.states[r.entity]?.state, Object.entries(r.settings ?? {}).map(([key, field]) => [key, field.entity, field.value])]));
  }
  updateDirty() {
    const live = this.model.rooms.filter(r => !r.excluded && r.available && this._hass.states[r.entity]?.state === 'on').map(r => r.entity);
    this.dirty = Object.keys(this.settingDraft).length > 0 || JSON.stringify(this.selected) !== JSON.stringify(live);
  }
  update() {
    if (!this.config || !this._hass) return;
    const previous = this.model;
    this.model = this.getModel();
    // Preserve a local selection across entity renames using the robot's room ID.
    if (this.dirty && previous) this.selected = this.selected.map(entity => {
      const id = previous.rooms.find(r => r.entity === entity)?.roomId;
      const matches = this.model.rooms.filter(r => id && r.roomId === id);
      return matches.length === 1 ? matches[0].entity : entity;
    });
    const reported = cleaningView(this._hass, this.config.entity);
    if (reported.active || this.busy || this.pendingStart) this.clearSessionEnd();
    if (reported.live) {
      this.clearPendingStart(); this.sessionObserved = true;
    } else if (!reported.active && !this.busy && !this.pendingStart && this.sessionObserved) {
      this.deferSessionEnd();
      this.message = ''; this.error = false;
    }
    if (this.model.rooms.length) this.lastRooms = this.model.rooms;
    else if (!Array.isArray(this._hass.states[this.config.entity]?.attributes?.rooms)) this.model.rooms = (this.lastRooms ?? []).map(r => ({ ...r, available: false }));
    if ((!this.initialized || !this.dirty) && !this.view.active && !this.busy && this.model.rooms.length) {
      this.resetDraft(false); this.initialized = true;
    }
    this.render();
  }
  onChange(event) {
    if (this.busy || this.view.active) return;
    const el = event.target;
    if (el.dataset.room) {
      this.selected = this.selected.filter(id => id !== el.dataset.room);
      if (el.checked) this.selected.push(el.dataset.room);
    } else if (el.dataset.setting && el.dataset.roomId) {
      const room = this.model.rooms.find(r => r.roomId === el.dataset.roomId);
      const field = room?.settings?.[el.dataset.setting];
      if (!field?.options.includes(el.value)) return;
      const values = this.settingDraft[room.roomId] ??= {};
      if (el.value === field.value) delete values[el.dataset.setting];
      else values[el.dataset.setting] = el.value;
      if (!Object.keys(values).length) delete this.settingDraft[room.roomId];
    }
    else return;
    this.updateDirty(); this.message = ''; this.error = false; this.render();
  }
  onClick(event) {
    const el = event.target.closest('button');
    if (el?.dataset.action === 'consumables') { this.toggleConsumables(true); return; }
    if (el?.dataset.action === 'close-consumables') { this.toggleConsumables(false); return; }
    if (this.consumablesOpen) return;
    if (!el || el.disabled || this.busy || this.controlBusy) return;
    if (el.dataset.control) { this.control(el.dataset.control); return; }
    if (this.view.active) return;
    if (el.dataset.expand !== undefined) {
      const id = el.dataset.expand;
      this.expanded.has(id) ? this.expanded.delete(id) : this.expanded.add(id);
    } else if (el.dataset.action === 'reset') this.resetDraft();
    else if (el.dataset.action === 'refresh') { this.loadRegistry(); return; }
    else if (el.dataset.action === 'start') { this.start(); return; }
    else if (el.dataset.action === 'save') { this.save(); return; }
    this.render();
  }
  async start() {
    if (this.busy || this.view.active || !this.isConnected) return;
    this.clearSessionEnd();
    this.busy = true; this.error = false;
    const config = this.config;
    try {
      if (this.registryError) throw new Error(this.registryError);
      const model = this.getModel();
      // Keep this request visible while the integration call is pending; the
      // robot can report an active session before callService resolves.
      this.requestedPlan = { rooms: this.selected.map(entity => {
        const room = model.rooms.find(candidate => candidate.entity === entity);
        return { entity_id: entity, room_id: room?.roomId, name: room?.name ?? entity };
      }) };
      this.message = 'Sending room settings and start request …'; this.render();
      const plan = await sendRoomDraft({ hass: this._hass, model, config, selected: [...this.selected], draft: this.settingDraft, start: true });
      if (this.config !== config || !this.isConnected) return;
      this.settingDraft = {};
      this.requestedPlan = plan;
      this.sessionObserved = cleaningView(this._hass, config.entity).live;
      if (!this.sessionObserved) {
        this.pendingStart = true;
        this._startTimer = setTimeout(() => {
          this.pendingStart = false;
          if (!cleaningView(this._hass, config.entity).active) {
            this.requestedPlan = null; this.error = true;
            this.message = 'The start was sent, but the robot has not reported an active session. Check its status before trying again.';
          }
          this.update();
        }, 30000);
      }
      this.message = '';
      this.dirty = true;
      this.baseline = this.liveSignature();
    } catch (error) {
      if (!cleaningView(this._hass, config.entity).active) this.requestedPlan = null;
      this.error = true;
      if (this.config === config) this.message = `${error.message} No automatic retry will be made.`;
    } finally { this.busy = false; this.render(); }
  }
  async save() {
    if (this.busy || this.view.active || !this.isConnected) return;
    const config = this.config, draft = structuredClone(this.settingDraft);
    this.busy = true; this.saving = true; this.error = false;
    this.message = 'Saving room settings …'; this.render();
    try {
      await sendRoomDraft({ hass: this._hass, model: this.getModel(), config, draft });
      const deadline = Date.now() + 6000;
      while (true) {
        if (this.config !== config || !this.isConnected) return;
        const model = this.getModel();
        if (Object.entries(draft).every(([id, fields]) => Object.entries(fields).every(([key, value]) => model.rooms.find(r => r.roomId === id)?.settings?.[key]?.value === value))) break;
        if (Date.now() >= deadline) throw new Error('Save was sent, but Home Assistant has not reflected all values yet. The draft was kept; check the robot before retrying.');
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      this.settingDraft = {}; this.model = this.getModel(); this.updateDirty();
      this.baseline = this.liveSignature();
      this.message = 'Settings sent. Home Assistant values updated. Room selection remains local.';
    } catch (error) {
      if (this.config === config) { this.error = true; this.message = error.message; }
    } finally { this.busy = false; this.saving = false; this.render(); }
  }
  async control(action) {
    if (this.busy || this.controlBusy || !this.isConnected) return;
    const entity = this.config.entity;
    this.controlBusy = true; this.message = ''; this.error = false; this.render();
    try {
      await controlCleaning(this._hass, entity, action);
      if (this.config.entity !== entity) return;
      this.message = '';
    } catch (error) {
      if (this.config.entity === entity) { this.error = true; this.message = error.message; }
    } finally { this.controlBusy = false; this.render(); }
  }
  consumablesHtml() {
    return `<div class="consumables-overlay" hidden><section class="consumables-panel" role="dialog" aria-modal="true" aria-label="Consumables"><div class="consumables-heading"><h3>Consumables</h3><button class="consumables-close" data-action="close-consumables" data-focus="consumables-close" aria-label="Close consumables"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></div><div class="consumables-rows"></div></section></div>`;
  }
  toggleConsumables(open) {
    this.consumablesOpen = open;
    this.updateConsumables();
    this.shadowRoot.querySelector(open ? '.consumables-close' : '.consumables-info')?.focus();
  }
  updateConsumables() {
    const root = this.shadowRoot;
    const rows = consumableStatus(this._hass, this.registry, this.config.entity);
    const warning = rows.some(row => row.level === 'low');
    const button = root.querySelector('.consumables-info');
    button.classList.toggle('attention', warning);
    button.setAttribute('aria-label', warning ? 'Consumables: replacement needed soon' : 'Consumables');
    button.title = warning ? 'Consumables: replacement needed soon' : 'Consumables';
    button.setAttribute('aria-expanded', String(!!this.consumablesOpen));
    root.querySelector('.consumables-overlay').hidden = !this.consumablesOpen;
    root.querySelector('.planner-content').inert = !!this.consumablesOpen;
    const content = rows.map(row => `<div class="consumable-row"><div class="consumable-label"><span>${escapeHtml(row.name)}</span><span class="consumable-value">${escapeHtml(row.text)}</span></div>${row.remaining === null ? '' : `<div class="consumable-track" role="meter" aria-label="${escapeHtml(row.name)} remaining life" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${row.remaining}"><span class="consumable-fill ${row.level}" style="width:${row.remaining}%"></span></div>`}</div>`).join('');
    const host = root.querySelector('.consumables-rows');
    if (host.innerHTML !== content) host.innerHTML = content;
    if (this.consumablesOpen && !root.querySelector('.consumables-panel').contains(root.activeElement)) root.querySelector('.consumables-close').focus();
  }
  headerHtml() {
    return `<header><div class="robot"><ha-icon icon="mdi:robot-vacuum"></ha-icon></div><div class="header-title"><h2>${escapeHtml(this.config.title)}</h2><p>Dyson Spot+Scrub <span class="tag">v0.3.1</span></p></div><div class="header-tools"><div class="battery" role="img"><svg viewBox="0 0 32 20" aria-hidden="true"><rect x="1" y="3" width="26" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="29" y="7" width="3" height="6" rx="1" fill="currentColor"/><rect class="battery-fill" x="4" y="6" width="0" height="8" rx="1" fill="currentColor"/><path class="battery-bolt" d="M17 1 9 11h6l-2 8L23 8h-7Z" fill="var(--dp-bg)" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" hidden/></svg><span class="battery-value" aria-hidden="true">—</span></div><button class="consumables-info" data-action="consumables" data-focus="consumables-info" aria-label="Consumables" aria-haspopup="dialog" aria-expanded="false" title="Consumables">Info</button></div></header>`;
  }
  updateBattery() {
    const state = batteryStatus(this._hass, this.model);
    const element = this.shadowRoot.querySelector('.battery');
    element.dataset.level = state.level;
    element.title = state.label; element.setAttribute('aria-label', state.label);
    element.querySelector('.battery-value').textContent = state.percent === null ? '—' : `${state.percent}%`;
    element.querySelector('.battery-fill').setAttribute('width', String((state.percent ?? 0) / 5));
    element.querySelector('.battery-bolt').toggleAttribute('hidden', !state.charging);
  }
  statusHtml() {
    return `<div class="activity-status" role="status" aria-live="polite" hidden><ha-icon class="activity-icon" aria-hidden="true"></ha-icon><span class="activity-text"></span><span class="drying-control" title="Cancel drying is not available in the integration yet." hidden><button class="cancel-drying" disabled aria-label="Cancel drying (not available yet)"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></span></div>`;
  }
  updateStatus() {
    const status = activityStatus(this._hass, this.config.entity, (this.busy && !this.saving) || this.pendingStart);
    const row = this.shadowRoot.querySelector('.activity-status');
    row.hidden = !status;
    row.querySelector('.activity-text').textContent = status?.text ?? '';
    row.querySelector('.activity-icon').setAttribute('icon', status?.icon ?? 'mdi:robot-vacuum');
    row.querySelector('.drying-control').hidden = !status?.drying;
  }
  renderSession(view) {
    const h = escapeHtml;
    // Keep the map element mounted across status and message updates so polling,
    // the last good image and in-flight requests are independent of card renders.
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}<section class="session"><ul class="requested"></ul></section>${this.config.show_camera ? '<div class="map-section"><div class="map-title">Cleaning map</div><p class="map-caption">Refreshes about every 5 seconds</p><dyson-planner-map></dyson-planner-map></div>' : ''}<footer class="session-footer"><div class="actions session-actions"><button class="session-toggle" data-control="pause" data-focus="session-toggle"><ha-icon></ha-icon><span></span></button><button class="home" data-control="return_to_base" data-focus="home"><ha-icon icon="mdi:home-import-outline"></ha-icon>Home</button></div><p class="notice action-message" role="status" aria-live="polite"></p></footer></div>${this.consumablesHtml()}</ha-card>`);
    const root = this.shadowRoot;
    this.updateBattery();
    this.updateConsumables();
    this.updateStatus();
    const title = root.querySelector('.header-title h2');
    title.classList.add('session-title');
    title.textContent = 'Cleaning session';
    const chips = (this.requestedPlan?.rooms ?? []).map(r => `<li>${h(r.name)}</li>`).join('');
    const list = root.querySelector('.requested');
    if (list.innerHTML !== chips) list.innerHTML = chips;
    root.querySelector('.session').hidden = !chips;
    const paused = this._hass.states[this.config.entity]?.state === 'paused';
    const toggle = root.querySelector('.session-toggle');
    toggle.dataset.control = paused ? 'start' : 'pause';
    toggle.classList.toggle('resume', paused); toggle.classList.toggle('pause', !paused);
    toggle.querySelector('span').textContent = paused ? 'Resume' : 'Pause';
    toggle.querySelector('ha-icon').setAttribute('icon', paused ? 'mdi:play' : 'mdi:pause');
    for (const button of root.querySelectorAll('[data-control]')) {
      const supported = canControl(this._hass, this.config.entity, button.dataset.control);
      button.disabled = this.busy || this.controlBusy || !supported;
      button.title = supported ? '' : 'This action is not available in the current robot state.';
    }
    const message = root.querySelector('.action-message');
    message.textContent = this.message;
    message.classList.toggle('error', !!this.error);
    root.querySelector('dyson-planner-map')?.setOptions(this._hass, this.model.cameraEntity, this.config.camera_rotation, view.live);
  }
  render() {
    if (!this.model) return;
    if (this.view.active) { this.renderSession(this.view); return; }
    const h = escapeHtml, model = this.model;
    const rooms = model.rooms.filter(r => !r.excluded);
    const external = this.dirty && !this.busy && this.baseline !== this.liveSignature();
    const canSave = !!this._hass.services?.[DOMAIN]?.save_room_settings;
    const canStart = !!this._hass.services?.[DOMAIN]?.start_rooms_with_settings;
    const hasChanges = Object.keys(this.settingDraft).length > 0;
    const roomHtml = rooms.map((room, n) => {
      const selected = this.selected.includes(room.entity), order = this.selected.indexOf(room.entity) + 1;
      const open = this.expanded.has(room.entity || room.name);
      const disabled = this.busy || !room.available;
      const valueOf = key => this.settingDraft[room.roomId]?.[key] ?? room.settings?.[key]?.value;
      const fields = Object.entries(ROOM_FIELDS).map(([key, label]) => {
        if (!this.config.always_show_all_settings) {
          const mode = valueOf('cleaning_mode');
          if (mode === 'Vacuum' && key === 'water_level') return '';
          if (mode === 'Mop' && key === 'cleaning_strategy') return '';
        }
        const field = room.settings?.[key];
        if (!field && this.config.unsupported_settings === 'hidden' && !this.config.always_show_all_settings) return '';
        const value = valueOf(key), options = field?.options ?? [];
        return `<label class="field ${key === 'cleaning_mode' ? 'mode' : ''}">${label}<select data-setting="${key}" data-room-id="${h(room.roomId)}" data-focus="${key}-${n}" aria-label="${label} ${h(room.name)}" ${disabled || !field ? 'disabled' : ''}>${!options.includes(value) ? '<option value="">Unavailable</option>' : ''}${options.map(option => `<option value="${h(option)}" ${value === option ? 'selected' : ''}>${h(option)}</option>`).join('')}</select>${!field ? '<span class="badge">Not available</span>' : ''}</label>`;
      }).join('');
      return `<section class="room ${selected ? 'selected' : ''}"><div class="room-head"><label class="pick"><input type="checkbox" data-focus="room-${n}" data-room="${h(room.entity)}" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span><span class="name">${h(room.name)} ${selected ? `<span class="status">(${order})</span>` : ''}</span><span class="summary">${!room.available ? h(room.error || 'Unavailable') : h(valueOf('cleaning_mode') ?? 'Room settings unavailable')}</span></span></label><button class="expand" data-focus="expand-${n}" data-expand="${h(room.entity || room.name)}" aria-expanded="${open}" aria-controls="fields-${n}" aria-label="Settings for ${h(room.name)}"><span>Settings</span> ${open ? '⌃' : '⌄'}</button></div><div class="fields" id="fields-${n}" ${open ? '' : 'hidden'}>${fields}${!room.roomId ? '<p class="badge mode">Room ID unavailable. Check the updated integration and refresh rooms.</p>' : ''}</div></section>`;
    }).join('');
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}<div class="rooms">${roomHtml}</div>${!rooms.length ? '<p class="empty">No enabled rooms found. Check the card configuration and room discovery.</p>' : ''}<footer><div class="summary-line"><span>${this.selected.length} of ${rooms.length} rooms selected</span><span class="status">${this.dirty ? 'Local draft' : 'From Home Assistant'}</span></div><div class="actions"><button data-action="save" data-focus="save" ${!hasChanges || this.busy || !canSave ? 'disabled' : ''}>${this.saving ? 'Saving …' : 'Save settings'}</button><button class="start" data-focus="start" data-action="start" ${this.selected.length === 0 || this.busy || dockBlocksStart(this._hass, this.config.entity) ? 'disabled' : ''}>Start clean</button></div>${!canSave || !canStart ? '<p class="notice badge">The updated Dyson integration actions are not available. Reload the integration and refresh this dashboard.</p>' : ''}${external ? '<p class="notice badge">Settings changed outside this card. Your edited values remain in the local draft.</p>' : ''}<p class="notice ${this.error ? 'error' : ''}" role="status" aria-live="polite">${h(this.message)}</p><button class="reset" data-focus="reset" data-action="reset" ${this.busy ? 'disabled' : ''}>Discard draft</button> <button class="reset" data-action="refresh" ${this.busy ? 'disabled' : ''}>Refresh rooms</button></footer></div>${this.consumablesHtml()}</ha-card>`);
    this.updateBattery();
    this.updateConsumables();
    this.updateStatus();
  }
}

if (!customElements.get('dyson-cleaning-planner-card')) customElements.define('dyson-cleaning-planner-card', DysonCleaningPlannerCard);
window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === 'dyson-cleaning-planner-card')) window.customCards.push({ type: 'dyson-cleaning-planner-card', name: 'Dyson Cleaning Planner', description: 'Room selection and per-room cleaning settings for Dyson Spot+Scrub.', preview: true });

// Bundled after card.js; uses the same registry connection and identity matching.
class DysonCleaningPlannerEditor extends DysonRegistryElement {
  constructor() {
    super();
    this.shadowRoot.addEventListener('input', event => {
      const el = event.target;
      if (this.config && el.dataset.key === 'title') this.commit({ ...this.config, title: el.value });
    });
    this.shadowRoot.addEventListener('change', event => {
      const el = event.target;
      if (!this.config || el.dataset.key === 'title') return;
      const next = { ...this.config };
      if (el.dataset.key) {
        next[el.dataset.key] = el.type === 'checkbox' ? el.checked : el.dataset.key === 'camera_rotation' ? Number(el.value) : el.value;
        if (el.dataset.key === 'entity') {
          delete next.mode_entity; delete next.start_entity; delete next.room_entities; delete next.camera_entity;
          next.excluded_rooms = []; next.room_order = [];
        }
      } else if (el.dataset.include) {
        next.excluded_rooms = (next.excluded_rooms ?? []).filter(id => id !== el.dataset.include);
        if (!el.checked) next.excluded_rooms.push(el.dataset.include);
      } else return;
      this.commit(next);
    });
    this.shadowRoot.addEventListener('click', event => {
      const el = event.target.closest('button');
      if (!el?.dataset.order) return;
      const ids = this.model.rooms.filter(r => r.entity).map(r => r.entity);
      const i = ids.indexOf(el.dataset.order), j = i + Number(el.dataset.direction);
      if (i >= 0 && j >= 0 && j < ids.length) {
        [ids[i], ids[j]] = [ids[j], ids[i]];
        this.commit({ ...this.config, room_order: ids });
      }
    });
  }
  setConfig(config) { this.config = { ...config }; this.update(); }
  commit(config) {
    this.config = config;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
    this.update();
  }
  update() {
    if (!this.config || !this._hass) return;
    const h = escapeHtml;
    const vacuums = this.registry.filter(e => e.platform === DOMAIN && !e.disabled_by && e.entity_id.startsWith('vacuum.'));
    const config = { ...this.config, excluded_rooms: this.config.excluded_rooms ?? [], room_order: this.config.room_order ?? [] };
    this.model = config.entity ? discover(this._hass, this.registry, config) : { rooms: [], issues: [], managed: [] };
    const device = this.registry.find(e => e.entity_id === config.entity)?.device_id;
    const field = (key, label, domain) => {
      const entries = this.registry.filter(e => e.platform === DOMAIN && !e.disabled_by && e.device_id === device && e.entity_id.startsWith(`${domain}.`));
      return `<label>${label}<select data-focus="${key}" data-key="${key}"><option value="">Auto-detect</option>${entries.map(e => `<option value="${h(e.entity_id)}" ${config[key] === e.entity_id ? 'selected' : ''}>${h(e.name || e.original_name || e.entity_id)}</option>`).join('')}</select></label>`;
    };
    this.paint(`<style>${styles}:host{padding:8px}label{display:grid;gap:8px;margin:0 0 16px;font-size:14px}input[type=text]{padding:12px;border:1px solid var(--dp-line);border-radius:8px;background:var(--dp-bg);color:inherit;width:100%}.entry{display:flex;gap:8px;align-items:center;margin:8px 0}.entry label{display:flex;align-items:center;flex:1;margin:0}.entry button{min-width:42px}h3{font-size:15px;margin-top:24px}</style>
      <label>Dyson device<select data-key="entity" data-focus="entity"><option value="">Select a device</option>${vacuums.map(e => `<option value="${h(e.entity_id)}" ${config.entity === e.entity_id ? 'selected' : ''}>${h(this._hass.states[e.entity_id]?.attributes?.friendly_name || e.entity_id)}</option>`).join('')}</select></label>
      <label>Title<input type="text" data-key="title" data-focus="title" value="${h(config.title ?? 'Plan a clean')}"></label>
      <label>Unsupported settings<select data-key="unsupported_settings" data-focus="unsupported"><option value="disabled" ${config.unsupported_settings !== 'hidden' ? 'selected' : ''}>Show disabled</option><option value="hidden" ${config.unsupported_settings === 'hidden' ? 'selected' : ''}>Hide</option></select></label>
      <div class="entry"><label><input type="checkbox" data-key="always_show_all_settings" data-focus="all-settings" ${config.always_show_all_settings === true ? 'checked' : ''}>Always show all settings</label></div>
      <p>Per-room settings are detected automatically. Saving and starting use the Dyson integration batch actions.</p>
      <h3>Cleaning map</h3><div class="entry"><label><input type="checkbox" data-key="show_camera" data-focus="show-camera" ${config.show_camera !== false ? 'checked' : ''}>Show camera during a cleaning session</label></div>
      <p class="notice">Turning this off removes the map and stops image requests from this card.</p>
      ${field('camera_entity', 'Map camera', 'camera')}
      <label>Map rotation<select data-key="camera_rotation" data-focus="camera-rotation">${[0, 90, 180, 270].map(deg => `<option value="${deg}" ${(config.camera_rotation ?? 0) === deg ? 'selected' : ''}>${deg}°</option>`).join('')}</select></label>
      <h3>Rooms in this card</h3><p>Choose which rooms to show. Arrows change the display order, not the robot cleaning order.</p>
      ${this.model.rooms.map((r, i) => `<div class="entry"><label><input type="checkbox" data-focus="include-${i}" data-include="${h(r.entity)}" ${!r.excluded ? 'checked' : ''} ${!r.entity ? 'disabled' : ''}>${h(r.name)}</label><button data-order="${h(r.entity)}" data-direction="-1" ${i === 0 ? 'disabled' : ''} aria-label="Move ${h(r.name)} up">↑</button><button data-order="${h(r.entity)}" data-direction="1" ${i === this.model.rooms.length - 1 ? 'disabled' : ''} aria-label="Move ${h(r.name)} down">↓</button></div>`).join('')}
      <p class="notice">Rooms disabled in Home Assistant are not offered. New rooms appear automatically.</p><p class="notice error">${h(this.registryError || this.model.issues.join(' '))}</p>`);
  }
}
if (!customElements.get('dyson-cleaning-planner-card-editor')) customElements.define('dyson-cleaning-planner-card-editor', DysonCleaningPlannerEditor);

