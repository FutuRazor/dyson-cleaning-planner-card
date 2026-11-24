import { UiError } from '../localize.js';
import { available } from '../shared.js';
import { spotScrubAdapter } from './spot-scrub.js';

// Experimental RB05 room adapter. No protocol commands or fabricated HA entities.
export const hassDysonAdapter = (() => {
const DOMAIN = 'hass_dyson';
const fields = {
  cleaning_mode: ['cleaning_mode', 'cleaning mode', { vacuum_only:'Vacuum', vacuum_and_mop:'Vacuum and Mop', mop_only:'Mop', vacuum_then_mop:'Vacuum then Mop' }],
  cleaning_strategy: ['vacuum_power', 'vacuum power', { auto:'Auto', boost:'Boost', quiet:'Quiet', quick:'Quick' }],
  water_level: ['hydration', 'hydration', { very_low:'Very Low', low:'Low', medium:'Medium', high:'High' }],
  mop_repetitions: ['wash_repetitions', 'wash repetitions', { '1x':'One Pass', '2x':'Two Passes' }],
};
const pending = new Set();
function vacuumEntries(registry) { return registry.filter(e => e.platform === DOMAIN && !e.disabled_by && e.entity_id.startsWith('vacuum.')); }
function deviceEntries(registry, entity) {
  const vacuum = vacuumEntries(registry).find(e => e.entity_id === entity);
  if (!vacuum?.device_id) return { entries:[], serial:'', deviceId:null };
  return { entries:registry.filter(e => e.platform === DOMAIN && e.device_id === vacuum.device_id), serial:String(vacuum.unique_id ?? '').replace(/_vacuum$/, ''), deviceId:vacuum.device_id };
}
function pick(entries, serial, domain, suffix) {
  const matches = entries.filter(e => !e.disabled_by && e.entity_id.startsWith(`${domain}.`) && e.unique_id === `${serial}_${suffix}`);
  return matches.length === 1 ? matches[0].entity_id : undefined;
}
function roomEntries(registry, entity) {
  const { entries, serial, deviceId } = deviceEntries(registry, entity), rooms = new Map();
  for (const e of entries) {
    if (e.disabled_by || !e.entity_id.startsWith('select.')) continue;
    for (const [key, [nativeKey]] of Object.entries(fields)) {
      const prefix = `${serial}_room_`, suffix = `_${nativeKey}`;
      if (!e.unique_id?.startsWith(prefix) || !e.unique_id.endsWith(suffix)) continue;
      const id = e.unique_id.slice(prefix.length, -suffix.length);
      if (!/^\d+$/.test(id)) continue;
      if (!rooms.has(id)) rooms.set(id, {});
      (rooms.get(id)[key] ??= []).push(e);
    }
  }
  return { entries, serial, deviceId, rooms };
}
function roomMap(registry, entity) {
  const { entries, serial, rooms } = roomEntries(registry, entity), maps = new Map();
  // Registry IDs are map-qualified upstream; never infer a map from display names.
  for (const e of entries) {
    const prefix = `${serial}_clean_zone_`;
    if (!e.entity_id.startsWith('button.') || !e.unique_id?.startsWith(prefix)) continue;
    const value = e.unique_id.slice(prefix.length), split = value.lastIndexOf('_');
    if (split < 1 || !/^\d+$/.test(value.slice(split + 1))) continue;
    const map = value.slice(0, split), id = value.slice(split + 1);
    if (!maps.has(map)) maps.set(map, new Set());
    maps.get(map).add(id);
  }
  const candidates = [...maps].filter(([, ids]) => rooms.size && [...rooms.keys()].every(id => ids.has(id)));
  // Upstream room selects do not expose their map. Until there is a verified
  // active-map contract, multiple stored maps cannot safely be joined to them.
  return maps.size === 1 && candidates.length === 1 ? candidates[0][0] : null;
}
function roomContext(hass, entity, registry = []) {
  // Include registry map topology and current-map preference membership. A change
  // during a two-step Start must not inherit the old draft's identity.
  const { entries, serial } = deviceEntries(registry, entity);
  const global = pick(entries, serial, 'select', 'cleaning_mode');
  const ids = Object.keys(hass?.states?.[global]?.attributes?.room_settings ?? {}).sort();
  return JSON.stringify([DOMAIN, entity, roomMap(registry, entity), ids]);
}
function cameraEntries(registry, entity) {
  return deviceEntries(registry, entity).entries.filter(e => !e.disabled_by && e.entity_id.startsWith('image.'));
}
function discover(hass, registry, config, previousRooms = []) {
  const { entries, serial, deviceId, rooms:groups } = roomEntries(registry, config.entity);
  const context = roomContext(hass, config.entity, registry), map = roomMap(registry, config.entity);
  const issues = [];
  if (!deviceId) issues.push('The Dyson device was not found in the entity registry.');
  if (!groups.size) issues.push('The Dyson room list is not currently available.');
  const rooms = [...groups].map(([id, group]) => {
    const settings = {}, ids = new Set(); let name;
    for (const [key, candidates] of Object.entries(group)) {
      if (candidates.length !== 1) continue;
      const entry = candidates[0], state = hass.states[entry.entity_id], [, label, values] = fields[key];
      const liveId = state?.attributes?.room_id;
      if (liveId != null) ids.add(String(liveId));
      const prior = previousRooms.find(r => r.roomId === id && r.context === context)?.settings?.[key];
      const options = Array.isArray(state?.attributes?.options) ? state.attributes.options.filter(v => Object.hasOwn(values, v)).map(v => values[v]) : !available(state) ? prior?.options ?? [] : [];
      settings[key] = { entity:entry.entity_id, value:values[state?.state], options, available:hass.connected !== false && available(state) && String(liveId) === id };
      const original = entry.original_name;
      if (!name && typeof original === 'string' && original.endsWith(` ${label}`)) name = original.slice(0, -(label.length + 1));
    }
    // An actual select ID acts as the card's stable room key; no room switches
    // exist in this integration. All writes still use native room IDs.
    const modeEntries = entries.filter(e => e.entity_id.startsWith('select.') && e.unique_id === `${serial}_room_${id}_cleaning_mode`);
    const entity = settings.cleaning_mode?.entity ?? (modeEntries.length === 1 ? modeEntries[0].entity_id : Object.values(settings)[0]?.entity) ?? '';
    const valid = ids.size === 1 && ids.has(id);
    return { name:name || `Room ${id}`, entity, roomId:valid ? id : undefined, context, mapId:map, settings,
      available:valid && !!entity && Object.values(settings).some(f => f.available), excluded:config.excluded_rooms?.includes(entity) ?? false };
  });
  const rank = id => { const i = config.room_order?.indexOf(id) ?? -1; return i < 0 ? Number.MAX_SAFE_INTEGER : i; };
  rooms.sort((a,b) => rank(a.entity) - rank(b.entity));
  const images = cameraEntries(registry, config.entity);
  const cameraEntity = config.camera_entity ? images.find(e => e.entity_id === config.camera_entity)?.entity_id
    : ['clean_coverage','floor_plan','dust_map'].map(s => pick(entries, serial, 'image', s)).find(Boolean);
  return { rooms, issues, cameraEntity, startBlockReason:groups.size && !map ? 'The room map is unavailable or ambiguous. Refresh rooms and check the integration.' : null,
    batteryEntity:pick(entries, serial, 'sensor', 'robot_battery'),
    chargingEntity:pick(entries, serial, 'binary_sensor', 'robot_battery_charging'), deviceId, mapId:map };
}
function dockState(hass, entity, registry = []) {
  const { entries, serial } = deviceEntries(registry, entity);
  const sensor = hass?.states?.[pick(entries, serial, 'sensor', 'robot_dock_state')];
  return available(sensor) ? sensor.state : null;
}
function dockActivity(hass, entity, registry = []) {
  if (hass?.connected === false || !available(hass?.states?.[entity])) return null;
  const phase = dockState(hass, entity, registry);
  const labels = { WASHING_MOP:['Cleaning mop roller','mdi:waves'], COLLECTING_DUST:['Emptying dust bin','mdi:delete-empty-outline'], DRYING_MOP:['Drying mop roller','mdi:weather-windy'] };
  if (!Object.hasOwn(labels, phase)) return null;
  return { text:labels[phase][0], icon:labels[phase][1], drying:phase === 'DRYING_MOP', remaining:phase === 'DRYING_MOP' || phase === 'WASHING_MOP' };
}
function dryingRemainingTime(hass, entity, registry = [], now = Date.now()) {
  if (!dockActivity(hass, entity, registry)?.remaining) return null;
  const { entries, serial } = deviceEntries(registry, entity);
  const timer = hass?.states?.[pick(entries, serial, 'sensor', 'robot_dock_timer_end')];
  const value = typeof timer?.state === 'string' ? timer.state.trim() : '';
  // Require an explicit timezone; never interpret a naive time in the browser's zone.
  if (!available(timer) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return null;
  const end = Date.parse(value);
  if (!Number.isFinite(end) || !Number.isFinite(now)) return null;
  const minutes = Math.ceil(Math.max(0, end - now) / 60000);
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}
function startBlockReason(hass, entity, registry = []) {
  const state = hass?.states?.[entity];
  if (hass?.connected === false || !available(state)) return 'Robot disconnected';
  if (state.attributes?.ready_to_start === false) return 'The integration is not ready to start a new clean';
  const dock = dockState(hass, entity, registry);
  if (dock === 'WASHING_MOP') return 'Cleaning mop roller';
  if (dock === 'COLLECTING_DUST') return 'Emptying dust bin';
  // A new room job may be started while the dock is drying. The integration
  // owns the transition; do not send an unverified cancel-drying command.
  if (!['IDLE','DRYING_MOP'].includes(dock)) return 'Waiting for the robot to be ready';
  const raw = state.attributes?.raw_state;
  if (!['INACTIVE_CHARGED','INACTIVE_CHARGING','FULL_CLEAN_FINISHED'].includes(raw)) return 'Waiting for the robot to be ready';
  return ['docked','idle','returning'].includes(state.state) ? null : 'Waiting for the robot to be ready';
}
function cleaningView(hass, entity, pendingStart = false, registry = []) {
  // FULL_CLEAN_FINISHED is mapped to returning upstream, but is explicitly a
  // writable/finished state. Other returning states remain active sessions.
  const state = hass?.states?.[entity];
  if (available(state) && hass?.connected !== false && (state.attributes?.raw_state === 'FULL_CLEAN_FINISHED' || !startBlockReason(hass, entity, registry))) return pendingStart
    ? { active:true, title:'Starting clean', detail:'Waiting for the robot to report its status.', live:false }
    : { active:false, live:false };
  if (available(state) && hass?.connected !== false && state.attributes?.raw_state === 'FULL_CLEAN_CHARGING') return { active:true, title:'Cleaning session active', detail:'', live:true };
  return spotScrubAdapter.cleaningView(hass, entity, pendingStart);
}
async function sendRoomDraft({ hass, model, config, selected = [], draft = {}, start = false, registry = [], context = roomContext(hass, config.entity, registry), getCurrent }) {
  const fail = () => { throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.'); };
  const current = () => {
    if (getCurrent) {
      const now = getCurrent();
      if (!now || now.active === false || now.config !== config) fail();
      hass = now.hass; registry = now.registry;
    }
    if (context !== roomContext(hass, config.entity, registry)) fail();
    if (hass?.connected === false || !available(hass.states[config.entity])) throw new UiError('The robot is unavailable.');
    const latest = discover(hass, registry, config);
    if (!latest.deviceId || latest.deviceId !== model.deviceId) fail();
    return latest;
  };
  const live = current();
  const resolve = id => {
    const matches = live.rooms.filter(r => r.roomId === id);
    if (matches.length !== 1 || !matches[0].available || matches[0].excluded) fail();
    return matches[0];
  };
  const settings = {}, native = {};
  for (const [id, values] of Object.entries(draft)) {
    const room = resolve(id);
    for (const [key, value] of Object.entries(values)) {
      const field = room.settings[key], mapping = fields[key];
      if (!field?.available || !field.options.includes(value) || !mapping) fail();
      if (field.value === value) continue;
      const option = Object.keys(mapping[2]).find(v => mapping[2][v] === value);
      if (option === undefined) fail();
      (settings[id] ??= {})[key] = value;
      (native[id] ??= {})[mapping[0]] = key === 'mop_repetitions' ? Number(option.slice(0,-1)) : option;
    }
  }
  const rooms = start ? selected.map(entity => {
    const room = live.rooms.find(r => r.entity === entity);
    if (!room?.roomId) fail();
    return resolve(room.roomId);
  }) : [];
  if (start && (!rooms.length || new Set(rooms.map(r => r.roomId)).size !== rooms.length)) throw new UiError('Select at least one room without duplicates.');
  if (start && !live.mapId) throw new UiError('The room map is unavailable or ambiguous. Refresh rooms and check the integration.');
  if (start && startBlockReason(hass, config.entity, registry)) throw new UiError(startBlockReason(hass, config.entity, registry));
  const hasSettings = Object.keys(native).length > 0;
  const requireAction = service => { if (!hass.services?.[DOMAIN]?.[service]) throw new UiError('Update the Dyson integration: {action} is unavailable.', { action:`${DOMAIN}.${service}` }); };
  if (start) requireAction('start_zone_clean');
  if (hasSettings) requireAction('set_room_cleaning_modes');
  const lockKey = live.deviceId;
  if (pending.has(lockKey)) throw new UiError('An action for this Dyson is already running in this browser.');
  if (!start && !hasSettings) return { rooms:[], settings, sent:false };
  pending.add(lockKey);
  let saved = false;
  try {
    if (hasSettings) {
      await hass.callService(DOMAIN, 'set_room_cleaning_modes', { device_id:live.deviceId, room_modes:native });
      saved = true;
    }
    if (start) {
      // Backend Save performs robot readback. HA select publication may lag, so
      // do not turn that into an arbitrary frontend delay or a duplicate write.
      const fresh = current();
      if (fresh.mapId !== live.mapId || rooms.some(r => !fresh.rooms.some(n => n.roomId === r.roomId && n.entity === r.entity && n.available && !n.excluded))) fail();
      const blocked = startBlockReason(hass, config.entity, registry);
      if (blocked) throw new UiError(blocked);
      requireAction('start_zone_clean');
      await hass.callService(DOMAIN, 'start_zone_clean', { device_id:live.deviceId, zones:rooms.map(r => r.roomId), map:live.mapId });
    }
  } catch (error) {
    if (start && saved) throw new UiError('Settings were saved, but cleaning did not start. Review the robot status before retrying. {error}', { error });
    throw error;
  } finally { pending.delete(lockKey); }
  return { rooms:rooms.map(r => ({ entity_id:r.entity, room_id:r.roomId, name:r.name })), settings, sent:true };
}
function canControl(hass, entity, action, registry = []) {
  if (!vacuumEntries(registry).some(entry => entry.entity_id === entity)) return false;
  if (action === 'cancel_drying') return false;
  if (['WASHING_MOP','COLLECTING_DUST','DRYING_MOP'].includes(dockState(hass, entity, registry))) return false;
  return spotScrubAdapter.canControl(hass, entity, action);
}
async function controlCleaning(hass, entity, action, registry = []) {
  if (!canControl(hass, entity, action, registry)) throw new UiError('This action is not available for the current robot state.');
  await hass.callService('vacuum', action, { entity_id:entity });
}
function consumableStatus(hass, registry, entity) {
  const { entries, serial } = deviceEntries(registry, entity);
  return spotScrubAdapter.CONSUMABLES.map(([type, name]) => {
    const refill = type === 'cleaningSolution';
    const id = pick(entries, serial, refill ? 'binary_sensor' : 'sensor', refill ? 'cleaning_solution' : `${type}_life`);
    const state = hass?.states?.[id], live = hass?.connected !== false && available(state);
    if (refill) {
      const refillStatus = live ? state.state === 'on' ? 'refill_required' : state.state === 'off' ? 'ok' : null : null;
      return { type, name, supported:!!id, remaining:null, level:'unknown', refillStatus, text:refillStatus === 'ok' ? 'Ready to use' : refillStatus === 'refill_required' ? 'Refill required' : 'Unavailable' };
    }
    const raw = state?.state, value = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : NaN;
    const remaining = live && Number.isFinite(value) && value >= 0 && value <= 100 ? Math.round(value * 10) / 10 : null;
    return { type, name, supported:!!id, remaining, level:remaining === null ? 'unknown' : remaining <= 10 ? 'low' : remaining <= 25 ? 'medium' : 'high', text:remaining === null ? 'Unavailable' : `${remaining}% remaining` };
  });
}
function robotTelemetry(hass, entity, camera, registry = []) {
  const state = hass?.states?.[entity];
  return { state:state?.state, available:available(state), name:state?.attributes?.friendly_name,
    cleaning:hass?.connected !== false && state?.state === 'cleaning' && dockState(hass, entity, registry) === 'IDLE', fault:undefined, faultCode:undefined, dockState:dockState(hass, entity, registry), bumperColor:undefined };
}
const unsupported = () => { throw new UiError('This action is not available for the current robot state.'); };
// Robot schedules are discovered by registry identity, never by translated names.
const scheduleDays = ['mon','tue','wed','thu','fri','sat','sun'];
function scheduleState(hass, registry, entity) {
  const { entries, serial, deviceId } = deviceEntries(registry, entity);
  const sensor = pick(entries, serial, 'sensor', 'jdm_schedules');
  const state = hass?.states?.[sensor];
  const supported = !!sensor && !!hass?.services?.[DOMAIN]?.set_robot_schedule;
  const raw = state?.attributes?.schedules;
  const valid = Array.isArray(raw) && raw.every(s => s && Number.isSafeInteger(s.schedule_id) && s.schedule_id >= 0
    && typeof s.enabled === 'boolean' && Array.isArray(s.days) && s.days.length > 0
    && s.days.every(d => scheduleDays.includes(d)) && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(s.time)
    && Array.isArray(s.rooms) && s.rooms.every(name => typeof name === 'string'))
    && new Set(raw.map(s => s.schedule_id)).size === raw.length;
  const readable = supported && hass?.connected !== false && available(state) && valid;
  return { supported, available:readable, writable:readable && !!deviceId && available(hass?.states?.[entity]),
    deleteSupported:supported && !!hass?.services?.[DOMAIN]?.delete_robot_schedule,
    schedules:readable ? raw.map(s => ({ id:s.schedule_id, enabled:s.enabled, days:[...s.days], time:s.time, rooms:[...s.rooms], repeat:s.repeat })) : [],
    inSync:state?.attributes?.in_sync, robotTotal:state?.attributes?.robot_total,
    enabledCount:readable && state.attributes.in_sync === true ? raw.filter(schedule => schedule.enabled).length : null,
    // beta.6's describe_order lists every preference row, including unselected
    // rooms. Its action preserves the robot's stored selection flags. Neither
    // the selected-room flags nor an input to change them reach this API.
    roomSelectionKnown:false, creationUsesStoredRooms:true, deviceId };
}
async function setSchedule({ hass, registry, config, id, days, time, enabled, draft = {}, context }) {
  const state = scheduleState(hass, registry, config.entity);
  if (!state.writable) throw new UiError('Schedules are unavailable. Check the robot connection and integration.');
  const data = { device_id:state.deviceId };
  if (id !== undefined) {
    if (!Number.isSafeInteger(id) || !state.schedules.some(s => s.id === id)) throw new UiError('This schedule is no longer available. Refresh the schedule list.');
    data.schedule_id = id;
  }
  if (days !== undefined || time !== undefined || id === undefined) {
    if (!Array.isArray(days) || !days.length || days.some(d => !scheduleDays.includes(d))
        || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new UiError('Choose at least one weekday and a valid time.');
    data.days = scheduleDays.filter(d => days.includes(d)); data.time = time;
  }
  if (enabled !== undefined) {
    if (typeof enabled !== 'boolean') throw new UiError('Invalid schedule state.');
    data.enabled = enabled;
  }
  if (id === undefined) {
    if (context !== roomContext(hass, config.entity, registry)) throw new UiError('The room plan changed. Close the dialog and review your room settings.');
    const model = discover(hass, registry, config);
    if (!model.mapId || !model.rooms.length) throw new UiError('The room map is unavailable or ambiguous. Refresh rooms and check the integration.');
    const native = {};
    for (const [roomId, values] of Object.entries(draft)) {
      const matches = model.rooms.filter(r => r.roomId === roomId);
      const room = matches.length === 1 && matches[0];
      if (!room?.available || room.excluded) throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
      for (const [key, value] of Object.entries(values)) {
        const field = room.settings[key], mapping = fields[key];
        if (!mapping || !field?.available || !field.options.includes(value)) throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
        const option = Object.keys(mapping[2]).find(v => mapping[2][v] === value);
        if (option === undefined) throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
        (native[roomId] ??= {})[mapping[0]] = key === 'mop_repetitions' ? Number(option.slice(0,-1)) : option;
      }
    }
    if (Object.keys(native).length) data.room_modes = native;
  }
  if (pending.has(state.deviceId)) throw new UiError('An action for this Dyson is already running in this browser.');
  pending.add(state.deviceId);
  try { await hass.callService(DOMAIN, 'set_robot_schedule', data); }
  finally { pending.delete(state.deviceId); }
}
async function deleteSchedule({ hass, registry, config, id }) {
  const state = scheduleState(hass, registry, config.entity);
  if (!state.writable) throw new UiError('Schedules are unavailable. Check the robot connection and integration.');
  if (!state.deleteSupported) throw new UiError('Update the Dyson integration: {action} is unavailable.', {action:`${DOMAIN}.delete_robot_schedule`});
  if (!Number.isSafeInteger(id) || !state.schedules.some(s => s.id === id)) throw new UiError('This schedule is no longer available. Refresh the schedule list.');
  if (pending.has(state.deviceId)) throw new UiError('An action for this Dyson is already running in this browser.');
  pending.add(state.deviceId);
  try { await hass.callService(DOMAIN, 'delete_robot_schedule', {device_id:state.deviceId, schedule_id:id}); }
  finally { pending.delete(state.deviceId); }
}
return Object.freeze({ id:DOMAIN, infoTabs:['consumables'], mapEntityLabel:'Map image',
  scheduleState, setSchedule, deleteSchedule,
  usesDockTimer:true, supportsDryingCancellation:false,
  planningHint:'Room order is controlled by hass-dyson. Changed settings are saved before cleaning starts.',
  vacuumEntries, cameraEntries, roomContext, discover, sendRoomDraft,
  defaultEntity:hass => vacuumEntries(Object.values(hass.entities ?? {}))[0]?.entity_id ?? '',
  roomSelectionState:() => 'off', hasRoomList:() => true,
  roomActionAvailable:(hass, start) => !!hass?.services?.[DOMAIN]?.[start ? 'start_zone_clean' : 'set_room_cleaning_modes'],
  startBlockReason, cleaningView, robotTelemetry, canControl, controlCleaning, consumableStatus,
  batteryStatus:spotScrubAdapter.batteryStatus,
  activityStatus:(hass, entity, pendingStart, registry = []) => {
    if (hass?.connected === false || !available(hass?.states?.[entity])) return { text:'Robot unavailable', icon:'mdi:alert-circle-outline', drying:false };
    const activity = dockActivity(hass, entity, registry);
    if (activity) return activity;
    const view = cleaningView(hass, entity, pendingStart, registry);
    return view.active ? { text:({cleaning:'Cleaning', paused:'Paused', returning:'Returning / mapping', error:'Robot needs attention'})[hass?.states?.[entity]?.state] ?? view.title, icon:'mdi:robot-vacuum', drying:false } : null;
  },
  dockBusy:(hass, entity, registry) => !!dockActivity(hass, entity, registry),
  dockBlocksStart:(hass, entity, registry) => ['WASHING_MOP','COLLECTING_DUST'].includes(dockState(hass, entity, registry)) && !!dockActivity(hass, entity, registry), dockActivity,
  dryingRemainingTime, dryingRemainingPercent:() => null,
  stationSettings:() => [], stationActions:() => [], robotSettings:() => [],
  changeStationSetting:unsupported, pressStationAction:unsupported, changeRobotSetting:unsupported,
  supportsZoneDevice:() => false, zoneReady:() => false, startZone:unsupported,
  zoneDeviceOptions:() => spotScrubAdapter.zoneDeviceOptions([]),
  trustedCamera:(registry, entity, image) => cameraEntries(registry, entity).some(e => e.entity_id === image),
  mapId:() => undefined, mapCalibration:() => undefined,
  mapPicture:(hass, entity) => hass?.states?.[entity]?.attributes?.entity_picture,
  mapPictureAllowed:picture => typeof picture === 'string' && picture.startsWith('/api/image_proxy/'),
});
})();
