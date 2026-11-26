import { UiError } from './localize.js';
export const ROOM_FIELDS = { cleaning_mode: 'Cleaning mode', cleaning_strategy: 'Vacuum Power', water_level: 'Water level', mop_repetitions: 'Clean repetitions' };
export const ROOM_COLORS = ['#18c5d9', '#e9b85b', '#b99ae4', '#79b9a5', '#e49baf'];
// Preserve existing entity-based Dyson configuration while allowing opaque
// selection keys for rooms which have no HA entity of their own.
export const roomKey = room => room.key ?? room.entity ?? '';
export const available = state => !!state && !['unavailable', 'unknown'].includes(state.state) && !state.attributes?.restored;

export function switchSettingConfirmed(hass, registry, field, request) {
  const entry = registry.find(row => row.entity_id === request.entity);
  return hass?.connected !== false && field?.domain === 'switch' && field.supported && field.entity === request.entity
    && !!entry && !entry.disabled_by && !!request.uniqueId && !!request.deviceId
    && entry.unique_id === request.uniqueId && entry.device_id === request.deviceId && entry.platform === request.platform
    && available(hass?.states?.[request.entity]) && hass.states[request.entity].state === request.value;
}
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const STATUS_BAR_ITEMS = [
  ['hot_water_mopping', 'Hot water mopping'],
  ['hot_water_self_cleaning', 'Hot water self-cleaning'],
  ['extended_roller_preparation', 'Extended roller preparation'],
  ['cleaning_solution', 'Cleaning solution'],
  ['self_cleaning_frequency', 'Self-cleaning frequency'],
  ['roller_drying_duration', 'Roller drying duration'],
  ['battery', 'Battery and charging'],
];

export function normalizeConfig(config) {
  if (!config || typeof config.entity !== 'string' || !config.entity.startsWith('vacuum.')) throw new UiError('Select a vacuum entity.');
  if (config.integration !== undefined && !['auto', 'dyson_spot_scrub', 'hass_dyson', 'ha_rooms'].includes(config.integration)) throw new UiError('Invalid integration selection.');
  if (config.language !== undefined && !['auto', 'en', 'de', 'nl', 'fr'].includes(config.language)) throw new UiError('language must be auto, en, de, nl or fr.');
  if (config.theme !== undefined && !['classic', 'modern'].includes(config.theme)) throw new UiError('theme must be classic or modern.');
  if (config.unsupported_settings && !['disabled', 'hidden'].includes(config.unsupported_settings)) throw new UiError('unsupported_settings must be disabled or hidden.');
  for (const key of ['excluded_rooms', 'room_order']) {
    if (config[key] !== undefined && (!Array.isArray(config[key]) || config[key].some(x => typeof x !== 'string'))) throw new UiError('{key} must be a list of entity IDs.', { key });
  }
  if (config.room_entities !== undefined && (!config.room_entities || typeof config.room_entities !== 'object' || Array.isArray(config.room_entities) || Object.values(config.room_entities).some(x => typeof x !== 'string' || !x.startsWith('switch.')))) throw new UiError('room_entities must map room names to switch entities.');
  if (config.show_battery_percentage !== undefined && typeof config.show_battery_percentage !== 'boolean') throw new UiError('show_battery_percentage must be true or false.');
  if (config.show_status_bar !== undefined && typeof config.show_status_bar !== 'boolean') throw new UiError('show_status_bar must be true or false.');
  if (config.hidden_status_items !== undefined && (!Array.isArray(config.hidden_status_items) || config.hidden_status_items.some(item => typeof item !== 'string'))) throw new UiError('hidden_status_items must be a list of indicator keys.');
  if (config.show_camera !== undefined && typeof config.show_camera !== 'boolean') throw new UiError('show_camera must be true or false.');
  if (config.always_show_all_settings !== undefined && typeof config.always_show_all_settings !== 'boolean') throw new UiError('always_show_all_settings must be true or false.');
  if (config.camera_rotation !== undefined && ![0, 90, 180, 270].includes(config.camera_rotation)) throw new UiError('camera_rotation must be 0, 90, 180 or 270.');
  if (config.camera_entity && (typeof config.camera_entity !== 'string' || !/^(camera|image)\./.test(config.camera_entity))) throw new UiError('Select a camera entity.');
  const mapDomain = { dyson_spot_scrub:'camera', hass_dyson:'image' }[config.integration];
  if (config.camera_entity && mapDomain && !config.camera_entity.startsWith(`${mapDomain}.`)) throw new UiError('Map entity must use the {domain} domain for this integration.', { domain:mapDomain });
  if (config.zone_dimension_unit !== undefined && !['off','auto','cm','inch'].includes(config.zone_dimension_unit)) throw new UiError('Invalid zone dimension unit.');
  if (config.header_icon_style !== undefined && !['home_assistant','integration'].includes(config.header_icon_style)) throw new UiError('Invalid header icon style.');
  return { ...config, header_icon_style: config.header_icon_style ?? 'integration', zone_dimension_unit: config.zone_dimension_unit ?? 'auto', language: config.language ?? 'auto', theme: config.theme ?? 'modern', show_battery_percentage: config.show_battery_percentage ?? false, show_status_bar: config.show_status_bar ?? true, hidden_status_items: config.hidden_status_items ?? [], title: config.title ?? '', always_show_all_settings: config.always_show_all_settings ?? false, unsupported_settings: 'hidden', excluded_rooms: config.excluded_rooms ?? [], room_order: config.room_order ?? [], show_camera: config.show_camera ?? true, camera_rotation: config.camera_rotation ?? 0 };
}

export function fitMap(width, height, boxWidth, rotation) {
  if (![width, height, boxWidth].every(n => Number.isFinite(n) && n > 0)) return { width: 0, height: 0, frameHeight: 0 };
  const sideways = rotation === 90 || rotation === 270;
  const scale = boxWidth / (sideways ? height : width);
  return { width: width * scale, height: height * scale, frameHeight: (sideways ? width : height) * scale };
}

