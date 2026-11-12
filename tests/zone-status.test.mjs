import test from 'node:test';
import assert from 'node:assert/strict';

// Register the card without creating a browser element; exercise its real view getter.
globalThis.HTMLElement = class {};
globalThis.window = {};
const elements = new Map();
globalThis.customElements = { get: name => elements.get(name), define: (name, value) => elements.set(name, value) };
await import('../src/card.js');
const Card = elements.get('dyson-cleaning-planner-card');

function fixture(zoneView = true) {
  const card = Object.create(Card.prototype);
  Object.assign(card, {
    model: {}, config: { entity: 'vacuum.robot' }, zoneView,
    zoneDraft: { rectangle: [.2, .2, .6, .8], mode: 'mop' },
    _hass: { connected: true, states: { 'vacuum.robot': { state: 'docked' } } },
    renderZone() { this.rendered = 'zone'; },
    renderSession(view) { this.rendered = 'session'; this.sessionView = view; },
  });
  return card;
}

test('zone draft survives non-live statuses and clears on a reported live session', () => {
  const card = fixture(), draft = card.zoneDraft;
  for (const state of ['unavailable', 'unknown', 'waiting', 'docked', 'idle']) {
    card._hass.states['vacuum.robot'].state = state;
    card.render();
    assert.equal(card.rendered, 'zone', state);
    assert.equal(card.zoneView, true, state);
    assert.equal(card.zoneDraft, draft, state);
  }
  card._hass.connected = false;
  card.render();
  assert.equal(card.rendered, 'zone');
  assert.equal(card.zoneDraft, draft);
  card._hass.connected = true;
  card.pendingStart = true;
  card.render();
  assert.equal(card.rendered, 'zone');
  assert.equal(card.zoneDraft, draft);
  card._hass.states['vacuum.robot'].state = 'cleaning';
  card.render();
  assert.equal(card.rendered, 'session');
  assert.equal(card.zoneView, false);
  assert.equal(card.zoneDraft, null);
});

test('active statuses retain session rendering when the zone editor is closed', () => {
  for (const state of ['unavailable', 'unknown', 'waiting', 'cleaning', 'paused', 'returning', 'error']) {
    const card = fixture(false), draft = card.zoneDraft;
    card._hass.states['vacuum.robot'].state = state;
    card.render();
    assert.equal(card.rendered, 'session', state);
    assert.equal(card.zoneView, false, state);
    assert.equal(card.zoneDraft, card.sessionView.live ? null : draft, state);
  }
});
