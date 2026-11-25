import { spotScrubAdapter } from './adapters/spot-scrub.js';
import { hassDysonAdapter } from './adapters/hass-dyson.js';
import { haRoomsAdapter } from './adapters/ha-rooms.js';

export const integrationAdapters = [spotScrubAdapter, hassDysonAdapter, haRoomsAdapter];

export function getIntegrationAdapter(config = {}, registry = [], hass) {
  const explicit = integrationAdapters.find(a => a.id === config?.integration);
  if (explicit) return explicit;
  // The configured robot wins over priority, even when its live state is offline.
  const entry = registry.find(e => e.entity_id === config?.entity)
    ?? Object.values(hass?.entities ?? {}).find(e => e.entity_id === config?.entity);
  const specialized = integrationAdapters.find(a => a.id === entry?.platform);
  if (specialized) return specialized;
  // Keep a configured foreign robot on the generic adapter even while offline
  // or after losing a capability; never reinterpret it as a Dyson.
  return entry || haRoomsAdapter.supports(hass, config?.entity) ? haRoomsAdapter : spotScrubAdapter;
}

export function integrationVacuumEntries(config = {}, registry = [], hass) {
  const adapters = config.integration && config.integration !== 'auto'
    ? integrationAdapters.filter(a => a.id === config.integration) : integrationAdapters;
  const seen = new Set();
  return adapters.flatMap(a => a.vacuumEntries(registry, hass)).filter(entry => {
    if (seen.has(entry.entity_id)) return false;
    seen.add(entry.entity_id); return true;
  });
}

export function defaultIntegrationEntity(hass, config = {}, registry, registryLoaded = true) {
  const metadata = Object.values(hass?.entities ?? {});
  const choose = entries => entries.find(entry => entry.entity_id === config.entity)?.entity_id ?? entries[0]?.entity_id;
  const match = choose(integrationVacuumEntries(config, registry ?? metadata, hass));
  if (match) return match;
  if (!registryLoaded) return choose(integrationVacuumEntries(config, metadata, hass)) ?? '';
  // Explicit completed registries, including empty ones, are authoritative.
  // Only stub generation without a registry retains the legacy state fallback.
  return registry === undefined && (!config.integration || config.integration === 'auto' || config.integration === spotScrubAdapter.id)
    ? spotScrubAdapter.defaultEntity(hass) : '';
}
