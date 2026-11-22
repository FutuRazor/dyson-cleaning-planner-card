import { validZoneCalibration, zoneRobotRectangle, zoneSha256, zoneMinimumSize, zoneHasMinimumSize, fitZoneMinimum, adjustZone, zonePillPosition, zoneDimensionText } from './zone-geometry.js';
import { spotScrubAdapter } from './adapters/spot-scrub.js';

// Compatibility facade; backend policy lives in the Spot+Scrub adapter.
export { validZoneCalibration, zoneRobotRectangle, zoneSha256, zoneMinimumSize, zoneHasMinimumSize, fitZoneMinimum, adjustZone, zonePillPosition, zoneDimensionText };
export const zoneCanStart = (...args) => spotScrubAdapter.zoneReady(...args);
export const zoneSettingsPayload = (...args) => spotScrubAdapter.zoneSettingsPayload(...args);
