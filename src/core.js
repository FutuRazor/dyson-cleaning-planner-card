import { ROOM_FIELDS, available, escapeHtml, STATUS_BAR_ITEMS, normalizeConfig, fitMap } from './shared.js';
import { spotScrubAdapter } from './adapters/spot-scrub.js';

export { ROOM_FIELDS, available, escapeHtml, STATUS_BAR_ITEMS, normalizeConfig, fitMap };

// Compatibility exports for existing consumers and regression tests.
// Card/editor/zone use the adapter directly; only Spot+Scrub is supported here.
export const DOMAIN = spotScrubAdapter.id;
export const roomContext = (...args) => spotScrubAdapter.roomContext(...args);
export const discover = (...args) => spotScrubAdapter.discover(...args);
export const batteryStatus = (...args) => spotScrubAdapter.batteryStatus(...args);
export const sendRoomDraft = (...args) => spotScrubAdapter.sendRoomDraft(...args);
export const dockBusy = (...args) => spotScrubAdapter.dockBusy(...args);
export const dockBlocksStart = (...args) => spotScrubAdapter.dockBlocksStart(...args);
export const startBlockReason = (...args) => spotScrubAdapter.startBlockReason(...args);
export const activityStatus = (...args) => spotScrubAdapter.activityStatus(...args);
export const cleaningView = (...args) => spotScrubAdapter.cleaningView(...args);
export const dryingRemainingTime = (...args) => spotScrubAdapter.dryingRemainingTime(...args);
export const dryingRemainingPercent = (...args) => spotScrubAdapter.dryingRemainingPercent(...args);
export const canControl = (...args) => spotScrubAdapter.canControl(...args);
export const controlCleaning = (...args) => spotScrubAdapter.controlCleaning(...args);
export const CONSUMABLES = spotScrubAdapter.CONSUMABLES;
export const consumableStatus = (...args) => spotScrubAdapter.consumableStatus(...args);
export const ROBOT_FIELDS = spotScrubAdapter.ROBOT_FIELDS;
export const robotSettings = (...args) => spotScrubAdapter.robotSettings(...args);
export const changeRobotSetting = (...args) => spotScrubAdapter.changeRobotSetting(...args);
export const STATION_FIELDS = spotScrubAdapter.STATION_FIELDS;
export const STATION_ACTIONS = spotScrubAdapter.STATION_ACTIONS;
export const stationActions = (...args) => spotScrubAdapter.stationActions(...args);
export const pressStationAction = (...args) => spotScrubAdapter.pressStationAction(...args);
export const stationSettings = (...args) => spotScrubAdapter.stationSettings(...args);
export const changeStationSetting = (...args) => spotScrubAdapter.changeStationSetting(...args);
export const supportsZoneDevice = (...args) => spotScrubAdapter.supportsZoneDevice(...args);
export const ZONE_CHOICES = spotScrubAdapter.ZONE_CHOICES;
export const zoneDeviceOptions = (...args) => spotScrubAdapter.zoneDeviceOptions(...args);
