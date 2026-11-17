import test from 'node:test';
import assert from 'node:assert/strict';
import { consumableStatus } from '../src/core.js';

test('consumables use same-device registry identities and reject unknown or ambiguous readings', () => {
  const registry = [{ entity_id: 'vacuum.robot', device_id: 'one', platform: 'dyson_spot_scrub' }, { entity_id: 'sensor.renamed', device_id: 'one', platform: 'dyson_spot_scrub' }];
  const hass = { states: { 'sensor.renamed': { state: '4', attributes: { consumable_type: 'brushBar', value_kind: 'usage_percent' } } } };
  const row = () => consumableStatus(hass, registry, 'vacuum.robot')[0];
  assert.equal(row().remaining, 96);
  for (const [usage, remaining, level] of [['0', 100, 'high'], ['75', 25, 'medium'], ['90', 10, 'low'], ['100', 0, 'low']]) {
    hass.states['sensor.renamed'].state = usage;
    assert.equal(row().remaining, remaining);
    assert.equal(row().level, level);
  }
  for (const usage of ['unknown', 'unavailable', '', '-1', '101', true]) {
    hass.states['sensor.renamed'].state = usage;
    assert.equal(row().remaining, null);
  }
  hass.states['sensor.renamed'].state = '90';
  registry[1].device_id = 'other';
  assert.equal(row().remaining, null);
  registry[1].device_id = 'one'; registry[1].disabled_by = 'user';
  assert.equal(row().remaining, null);
  registry[1].disabled_by = null;
  registry.push({ ...registry[1] });
  assert.equal(row().remaining, null);
  registry.pop(); hass.connected = false;
  assert.equal(row().remaining, null);
});

test('exact consumable identity takes precedence over type fallback without masking outages or duplicates', () => {
  const vacuum = { entity_id: 'vacuum.robot', unique_id: 'SERIAL_vacuum', device_id: 'one', platform: 'dyson_spot_scrub' };
  const exact = { ...vacuum, entity_id: 'sensor.renamed_brush', unique_id: 'SERIAL_consumable_brush_bar_usage' };
  const fallback = { ...exact, entity_id: 'sensor.alternative', unique_id: 'alternative' };
  const registry = [vacuum, exact, fallback];
  const hass = { states: {
    [exact.entity_id]: { state: '10', attributes: { value_kind: 'usage_percent' } },
    [fallback.entity_id]: { state: '70', attributes: { value_kind: 'usage_percent', consumable_type: 'brushBar' } }
  } };
  const row = () => consumableStatus(hass, registry, vacuum.entity_id)[0];
  assert.equal(row().remaining, 90);
  hass.states[exact.entity_id].state = 'unavailable';
  assert.equal(row().supported, true);
  assert.equal(row().remaining, null, 'Unavailable exact sensor must not switch to fallback');
  delete hass.states[exact.entity_id];
  assert.equal(row().supported, true);
  assert.equal(row().remaining, null);
  registry.push({ ...exact, entity_id: 'sensor.duplicate_identity' });
  assert.equal(row().supported, false, 'Duplicate exact identities remain ambiguous');
  registry.splice(1, 1);
  registry.pop();
  assert.equal(row().remaining, 30, 'Type fallback works without an exact identity');
  registry.push({ ...fallback, entity_id: 'sensor.duplicate_type' });
  hass.states['sensor.duplicate_type'] = hass.states[fallback.entity_id];
  assert.equal(row().supported, false, 'Duplicate fallback types remain ambiguous');
});
