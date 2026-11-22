import { spotScrubAdapter } from './adapters/spot-scrub.js';

// Phase one deliberately has one backend. Do not infer another integration
// from an unavailable entity or silently switch the configured robot.
export function getIntegrationAdapter() { return spotScrubAdapter; }
