export const DOMAIN = 'dyson_spot_scrub';
export const available = state => !!state && !['unavailable', 'unknown'].includes(state.state) && !state.attributes?.restored;
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function normalizeConfig(config) {
  if (!config || typeof config.entity !== 'string' || !config.entity.startsWith('vacuum.')) throw new Error('Select a vacuum entity.');
  if (config.unsupported_settings && !['disabled', 'hidden'].includes(config.unsupported_settings)) throw new Error('unsupported_settings must be disabled or hidden.');
  for (const key of ['excluded_rooms', 'room_order']) {
    if (config[key] !== undefined && (!Array.isArray(config[key]) || config[key].some(x => typeof x !== 'string'))) throw new Error(`${key} must be a list of entity IDs.`);
  }
  if (config.room_entities !== undefined && (!config.room_entities || typeof config.room_entities !== 'object' || Array.isArray(config.room_entities) || Object.values(config.room_entities).some(x => typeof x !== 'string' || !x.startsWith('switch.')))) throw new Error('room_entities must map room names to switch entities.');
  return { ...config, title: config.title ?? 'Plan a clean', unsupported_settings: config.unsupported_settings ?? 'disabled', excluded_rooms: config.excluded_rooms ?? [], room_order: config.room_order ?? [] };
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
  if (!modeEntity) issues.push('The cleaning mode entity could not be identified. Check the editor mapping.');
  if (!startEntity) issues.push('The start button could not be identified. Check the editor mapping.');
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
    return [{ name, entity: entry.entity_id, available: available(hass.states[entry.entity_id]), excluded: config.excluded_rooms.includes(entry.entity_id) }];
  });
  const ids = rooms.map(r => r.entity).filter(Boolean);
  if (new Set(ids).size !== ids.length) issues.push('Multiple rooms map to the same switch.');
  const rank = id => { const i = config.room_order.indexOf(id); return i < 0 ? Number.MAX_SAFE_INTEGER : i; };
  rooms.sort((a, b) => rank(a.entity) - rank(b.entity));
  return { rooms, managed: managed.map(e => e.entity_id), modeEntity, startEntity, issues };
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
