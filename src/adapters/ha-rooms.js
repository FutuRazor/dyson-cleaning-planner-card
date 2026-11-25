import { UiError } from '../localize.js';
import { available, roomKey } from '../shared.js';

// Home Assistant's vacuum contract, not a manufacturer's command dialect.
export const haRoomsAdapter = (() => {
const CLEAN_AREA = 16384;
const pending = new Set();
const unsupported = () => { throw new UiError('This action is not available for the current robot state.'); };
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const supports = (hass, entity) => !!(Number(hass?.states?.[entity]?.attributes?.supported_features) & CLEAN_AREA);
const vacuumEntries = (registry, hass) => registry.filter(entry => !entry.disabled_by && entry.entity_id.startsWith('vacuum.') && supports(hass, entry.entity_id));
const entryFor = (registry, entity) => registry.find(entry => entry.entity_id === entity && !entry.disabled_by && entry.entity_id.startsWith('vacuum.'));
function mapping(entry) {
  const raw = entry?.options?.vacuum?.area_mapping;
  if (!object(raw)) return [];
  return Object.entries(raw).filter(([id, segments]) => id && Array.isArray(segments) && segments.length
    && segments.every(id => typeof id === 'string' && id.length > 0))
    .map(([id, segments]) => [id, [...new Set(segments)].sort()]).sort(([a],[b]) => a.localeCompare(b));
}
function roomContext(hass, entity, registry = []) {
  const entry = entryFor(registry, entity);
  return JSON.stringify([entity, entry?.id ?? null, entry?.unique_id ?? null, entry?.platform ?? null,
    entry?.device_id ?? null, mapping(entry)]);
}
function discover(hass, registry, config) {
  const entry = entryFor(registry, config.entity), context = roomContext(hass, config.entity, registry);
  const issues = [];
  if (!entry) issues.push('The robot was not found in the entity registry.');
  else if (!supports(hass, config.entity)) issues.push('This robot does not report Home Assistant area cleaning support.');
  else if (!mapping(entry).length) issues.push('Map the robot segments to Home Assistant areas in the vacuum entity settings.');
  else if (!object(hass?.areas)) issues.push('Home Assistant areas are unavailable. Reload the dashboard.');
  const rooms = supports(hass, config.entity) ? mapping(entry).flatMap(([areaId, segmentIds]) => {
    const area = hass?.areas?.[areaId];
    if (!area || typeof area.name !== 'string') return [];
    const key = `area:${areaId}`;
    return [{key, roomId:areaId, areaId, segmentIds, name:area.name, context, settings:{},
      available:hass?.connected !== false && available(hass?.states?.[config.entity]),
      excluded:config.excluded_rooms?.includes(key) ?? false}];
  }) : [];
  if (!issues.length && !rooms.length) issues.push('Map the robot segments to Home Assistant areas in the vacuum entity settings.');
  const rank = key => { const index = config.room_order?.indexOf(key) ?? -1; return index < 0 ? Number.MAX_SAFE_INTEGER : index; };
  rooms.sort((a,b) => rank(a.key) - rank(b.key));
  const sameDevice = registry.filter(row => entry?.device_id && row.device_id === entry.device_id
    && row.platform === entry.platform && !row.disabled_by);
  const single = (domain, deviceClass) => {
    const matches = sameDevice.filter(row => row.entity_id.startsWith(`${domain}.`)
      && hass?.states?.[row.entity_id]?.attributes?.device_class === deviceClass);
    return matches.length === 1 ? matches[0].entity_id : undefined;
  };
  return {rooms, issues, startBlockReason:issues[0] ?? null,
    batteryEntity:single('sensor','battery'), chargingEntity:single('binary_sensor','battery_charging')};
}
function startBlockReason(hass, entity) {
  const state = hass?.states?.[entity];
  if (hass?.connected === false || !available(state)) return 'The robot is unavailable.';
  if (!supports(hass, entity)) return 'This robot does not report Home Assistant area cleaning support.';
  if (!hass.services?.vacuum?.clean_area) return 'Home Assistant area cleaning is unavailable. Check your Home Assistant version and integration.';
  return ['docked','idle'].includes(state.state) ? null : 'Start is only available when the robot is docked or idle.';
}
function planningSettings(hass, registry, config) {
  const state = hass?.states?.[config.entity], raw = state?.attributes?.fan_speed_list;
  const entry = entryFor(registry, config.entity);
  if (!entry || !(Number(state?.attributes?.supported_features) & 32)
      || !hass?.services?.vacuum?.set_fan_speed || !Array.isArray(raw)
      || !raw.length || raw.some(option => typeof option !== 'string' || !option.trim())) return [];
  // Spot+Scrub exposes its cleaning-mode selector through HA's fan API. These
  // values must not appear as suction levels or be written by a suction draft.
  if (entry.platform === 'dyson_spot_scrub' && raw.some(option =>
    ['Room settings','Vacuum','Vacuum and Mop','Mop','Vacuum then Mop'].includes(option))) return [];
  return [{key:'fan_speed',label:'Suction power · all selected rooms',
    value:state.attributes.fan_speed,options:[...new Set(raw)],
    available:hass?.connected !== false && available(state),
    hint:'Robot setting; it may remain active after this clean.'}];
}
function validatePlanningDraft(hass, registry, config, draft) {
  if (!object(draft) || Object.keys(draft).some(key => key !== 'fan_speed')) unsupported();
  if (!Object.hasOwn(draft, 'fan_speed')) return;
  const field = planningSettings(hass, registry, config)[0];
  if (!field?.available || !field.options.includes(draft.fan_speed)) throw new UiError('The selected suction power is no longer available. Review or discard the draft.');
}
function roomPlanningState(hass, registry, config, model, _roomDraft, planningDraft = {}) {
  let notice = model.startBlockReason || startBlockReason(hass, config.entity);
  try { validatePlanningDraft(hass, registry, config, planningDraft); }
  catch (error) { notice ||= error; }
  return {supportsSave:false, supportsStart:true, canSave:false, ordered:false,
    canStart:!!entryFor(registry, config.entity) && !notice, notice};
}
async function sendRoomDraft({hass, registry = [], config, model, selected = [], draft = {}, start = false,
  planningDraft = {}, context = roomContext(hass, config.entity, registry), getCurrent}) {
  if (!start || Object.keys(draft).length) unsupported();
  const connection = hass.connection;
  const current = () => {
    if (getCurrent) {
      const now = getCurrent();
      if (!now || now.active === false || now.config !== config || now.hass?.connection !== connection) throw new UiError('The room selection changed. Refresh rooms and select the areas again.');
      hass = now.hass; registry = now.registry;
    }
    if (context !== roomContext(hass, config.entity, registry)) throw new UiError('The room selection changed. Refresh rooms and select the areas again.');
    const blocked = startBlockReason(hass, config.entity);
    if (blocked) throw new UiError(blocked);
    validatePlanningDraft(hass, registry, config, planningDraft);
  };
  current();
  if (!selected.length || new Set(selected).size !== selected.length) throw new UiError('Select at least one room without duplicates.');
  const lockKey = config.entity;
  if (pending.has(lockKey)) throw new UiError('An action for this robot is already running in this browser.');
  pending.add(lockKey);
  let fanSent = false;
  const validateRooms = async () => {
    // Read current persisted mapping and areas immediately before the command.
    // No admin-only get_segments call or manufacturer action is needed.
    const [entry, areas] = await Promise.all([
      hass.callWS({type:'config/entity_registry/get', entity_id:config.entity}),
      hass.callWS({type:'config/area_registry/list'}),
    ]);
    current();
    if (!entry || entry.entity_id !== config.entity || !Array.isArray(areas)) throw new UiError('The room selection changed. Refresh rooms and select the areas again.');
    const freshRegistry = registry.filter(row => row.entity_id !== config.entity).concat(entry);
    if (context !== roomContext(hass, config.entity, freshRegistry)) throw new UiError('The room selection changed. Refresh rooms and select the areas again.');
    const fresh = discover({...hass, areas:Object.fromEntries(areas.map(area => [area.area_id, area]))}, freshRegistry, config);
    if (fresh.startBlockReason) throw new UiError(fresh.startBlockReason);
    return selected.map(key => {
      const previous = model.rooms.filter(room => roomKey(room) === key);
      const matches = fresh.rooms.filter(room => roomKey(room) === key && room.available && !room.excluded);
      if (previous.length !== 1 || previous[0].context !== context || matches.length !== 1) throw new UiError('The room selection changed. Refresh rooms and select the areas again.');
      return matches[0];
    });
  };
  try {
    let rooms = await validateRooms();
    if (Object.hasOwn(planningDraft, 'fan_speed') && planningDraft.fan_speed !== hass.states[config.entity].attributes.fan_speed) {
      await hass.callService('vacuum', 'set_fan_speed', {entity_id:config.entity, fan_speed:planningDraft.fan_speed});
      fanSent = true;
      // A setting write can publish new HA state or outlive this card. Recheck
      // the current lifecycle, readiness and persisted mapping before Start.
      current();
      rooms = await validateRooms();
    }
    await hass.callService('vacuum', 'clean_area', {entity_id:config.entity, cleaning_area_id:rooms.map(room => room.areaId)});
    return {rooms:rooms.map(room => ({room_id:room.areaId,name:room.name})),settings:{},sent:true};
  } catch (error) {
    if (fanSent) throw new UiError('The suction power command was sent, but area cleaning was not confirmed. Check the robot before retrying. {error}', {error});
    throw error;
  } finally { pending.delete(lockKey); }
}
function canControl(hass, entity, action, registry = []) {
  const state = hass?.states?.[entity];
  const feature = {pause:4, start:8192, return_to_base:16}[action];
  const states = {pause:['cleaning'], start:['paused'], return_to_base:['cleaning','paused','returning','error']}[action] ?? [];
  return !!(entryFor(registry, entity) && feature && hass?.connected !== false && available(state)
    && states.includes(state.state) && (Number(state.attributes?.supported_features) & feature) && hass.services?.vacuum?.[action]);
}
async function controlCleaning(hass, entity, action, registry) {
  if (!canControl(hass, entity, action, registry)) unsupported();
  await hass.callService('vacuum', action, {entity_id:entity});
}
function cleaningView(hass, entity, pendingStart) {
  const state = hass?.states?.[entity];
  const titles = {cleaning:'Cleaning session',paused:'Paused',returning:'Robot returning',error:'Robot needs attention'};
  if (hass?.connected !== false && available(state) && titles[state.state]) return {active:true,live:true,title:titles[state.state],detail:''};
  return pendingStart ? {active:true,live:false,title:'Starting clean',detail:'Waiting for the robot to report its status.'} : {active:false,live:false};
}
function batteryStatus(hass, model) {
  const state = hass?.states?.[model.batteryEntity], charge = hass?.states?.[model.chargingEntity];
  const raw = state?.state;
  const value = typeof raw === 'string' && raw.trim() ? Number(raw) : NaN;
  const percent = hass?.connected !== false && available(state) && Number.isFinite(value) && value >= 0 && value <= 100 ? Math.round(value) : null;
  return {percent,charging:hass?.connected !== false && available(charge) && charge.state === 'on',
    level:percent === null ? 'unknown' : percent < 20 ? 'low' : percent < 50 ? 'medium' : 'high'};
}
return Object.freeze({id:'ha_rooms', label:'Home Assistant · Area cleaning', shortLabel:'Home Assistant', deviceLabel:'Robot',
  editorHint:'Select mapped Home Assistant areas. The robot controls room order.',
  planningHint:'Select mapped Home Assistant areas. The robot controls room order.',
  roomStartMessage:'Sending area cleaning request …',
  infoTabs:[], supportsIntegrationIcon:false, supportsRoomSettings:false, supportsSessionMap:false, supportsZoneEditor:false,
  statusBarItems:[['battery','Battery and charging']],
  supports, vacuumEntries, discover, roomContext, roomPlanningState, planningSettings, sendRoomDraft,
  roomPresentation:() => ({fields:[]}), roomSelectionState:() => 'off', hasRoomList:() => true,
  defaultEntity:hass => vacuumEntries(Object.values(hass?.entities ?? {}),hass)[0]?.entity_id ?? '',
  startBlockReason, canControl, controlCleaning, cleaningView, batteryStatus,
  robotTelemetry:(hass,entity) => ({state:hass?.states?.[entity]?.state, available:hass?.connected !== false && available(hass?.states?.[entity]),
    name:hass?.states?.[entity]?.attributes?.friendly_name, cleaning:hass?.connected !== false && hass?.states?.[entity]?.state === 'cleaning'}),
  activityStatus:(hass,entity,pendingStart) => {
    if (hass?.connected === false || !available(hass?.states?.[entity])) return {text:'Robot unavailable',icon:'mdi:alert-circle-outline'};
    const view = cleaningView(hass,entity,pendingStart);
    return view.active ? {text:view.title,icon:'mdi:robot-vacuum'} : null;
  },
  dockBusy:() => false, dockBlocksStart:() => false, dockActivity:() => null,
  dryingRemainingTime:() => null, dryingRemainingPercent:() => null,
  consumableStatus:() => [], stationSettings:() => [], stationActions:() => [], robotSettings:() => [],
  changeStationSetting:unsupported, pressStationAction:unsupported, changeRobotSetting:unsupported,
  cameraEntries:() => [], trustedCamera:() => false, mapId:() => undefined, mapPicture:() => undefined, mapCalibration:() => undefined,
  supportsZoneDevice:() => false, zoneDeviceOptions:() => ({}), zoneReady:() => false, startZone:unsupported,
  scheduleState:() => ({supported:false}),
});
})();
