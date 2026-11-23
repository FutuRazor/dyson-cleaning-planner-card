import { spotScrubAdapter } from './adapters/spot-scrub.js';
import { hassDysonAdapter } from './adapters/hass-dyson.js';

export const integrationAdapters = [spotScrubAdapter, hassDysonAdapter];

export function getIntegrationAdapter(config = {}, registry = [], hass) {
  const explicit = integrationAdapters.find(a => a.id === config?.integration);
  if (explicit) return explicit;
  // The configured robot wins over priority, even when its live state is offline.
  const entry = registry.find(e => e.entity_id === config?.entity)
    ?? Object.values(hass?.entities ?? {}).find(e => e.entity_id === config?.entity);
  return integrationAdapters.find(a => a.id === entry?.platform) ?? spotScrubAdapter;
}

export function integrationVacuumEntries(config = {}, registry = []) {
  const adapters = config.integration && config.integration !== 'auto'
    ? integrationAdapters.filter(a => a.id === config.integration) : integrationAdapters;
  return adapters.flatMap(a => a.vacuumEntries(registry));
}

export function defaultIntegrationEntity(hass, config = {}, registry = Object.values(hass?.entities ?? {})) {
  return integrationVacuumEntries(config, registry)[0]?.entity_id
    ?? (!config.integration || config.integration === 'auto' || config.integration === spotScrubAdapter.id ? spotScrubAdapter.defaultEntity(hass) : '');
}
