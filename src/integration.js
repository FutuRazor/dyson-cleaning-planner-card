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

export function defaultIntegrationEntity(hass, config = {}, registry, registryLoaded = true) {
  const metadata = Object.values(hass?.entities ?? {});
  const choose = entries => entries.find(entry => entry.entity_id === config.entity)?.entity_id ?? entries[0]?.entity_id;
  const match = choose(integrationVacuumEntries(config, registry ?? metadata));
  if (match) return match;
  if (!registryLoaded) return choose(integrationVacuumEntries(config, metadata)) ?? '';
  // Explicit completed registries, including empty ones, are authoritative.
  // Only stub generation without a registry retains the legacy state fallback.
  return registry === undefined && (!config.integration || config.integration === 'auto' || config.integration === spotScrubAdapter.id)
    ? spotScrubAdapter.defaultEntity(hass) : '';
}
