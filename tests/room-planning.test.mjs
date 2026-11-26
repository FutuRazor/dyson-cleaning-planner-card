import test from 'node:test';
import assert from 'node:assert/strict';
import { spotScrubAdapter } from '../src/adapters/spot-scrub.js';
import { hassDysonAdapter } from '../src/adapters/hass-dyson.js';
import { roomKey } from '../src/shared.js';
import { batchFixture } from './fixture.mjs';
import { hassDysonFixture } from './hass-dyson-fixture.mjs';

test('Dyson planning capabilities separate missing actions, connectivity and execution order', () => {
  for (const [adapter, fixture, ordered, save, start] of [
    [spotScrubAdapter, batchFixture, true, 'save_room_settings', 'start_rooms_with_settings'],
    [hassDysonAdapter, hassDysonFixture, false, 'set_room_cleaning_modes', 'start_zone_clean'],
  ]) {
    const f = fixture(), model = adapter.discover(f.hass, f.registry, f.config);
    const state = draft => adapter.roomPlanningState(f.hass, f.registry, f.config, model, draft);
    assert.equal(state().ordered, ordered);
    assert.equal(state().canSave, true);
    assert.equal(state().canStart, true);
    assert.ok(model.rooms.every(room => roomKey(room) === room.entity), 'existing YAML keys stay compatible');
    delete f.hass.services[adapter.id][save];
    assert.equal(state().supportsSave, true, 'missing service does not erase a supported feature');
    assert.equal(state().canSave, false);
    assert.equal(state().canStart, true, 'room-only start is independent of Save');
    if (adapter === hassDysonAdapter) assert.equal(state({'12':{water_level:'High'}}).canStart, false);
    f.hass.services[adapter.id][save] = {};
    delete f.hass.services[adapter.id][start];
    assert.equal(state().canSave, true);
    assert.equal(state().canStart, false);
    f.hass.services[adapter.id][start] = {};
    f.hass.connected = false;
    assert.equal(state().canSave, false);
    assert.equal(state().canStart, false);
    assert.equal(state().notice, null, 'connectivity does not invent a missing-action warning');
    f.hass.connected = true;
    assert.equal(adapter.roomPlanningState(f.hass, [], f.config, model).canStart, false);
    f.hass.states[f.entity].attributes.ready_to_start = false;
    assert.equal(state().canStart, false);
    assert.equal(f.calls.length, 0);
  }
});

test('Dyson presentation uses registered fields and local mode without requiring unrelated controls', () => {
  for (const [adapter, fixture] of [[spotScrubAdapter,batchFixture],[hassDysonAdapter,hassDysonFixture]]) {
    const f = fixture(), room = adapter.discover(f.hass, f.registry, f.config).rooms[0];
    const view = (draft, config) => adapter.roomPresentation(room, draft, config);
    assert.equal(view({cleaning_mode:'Vacuum'}).fields.find(f => f.key === 'water_level').omitted, true);
    assert.equal(view({cleaning_mode:'Mop'}).fields.find(f => f.key === 'cleaning_strategy').omitted, true);
    assert.equal(view({cleaning_mode:'Mop'}, {always_show_all_settings:true}).fields.some(f => f.omitted), false);
    delete room.settings.water_level;
    assert.equal(view().fields.some(f => f.key === 'water_level'), false);
    assert.equal(view().fields.find(f => f.key === 'mop_repetitions').control, 'segments');
  }
});

globalThis.HTMLElement = class {};
globalThis.window = {};
const elements = new Map();
globalThis.customElements = { get:name => elements.get(name), define:(name, value) => elements.set(name,value) };
await import('../src/card.js');
const Card = elements.get('dyson-cleaning-planner-card');

function plainPlanner(theme) {
  const card = Object.create(Card.prototype), calls = [];
  const rooms = [{key:'area:kitchen',roomId:'kitchen',name:'Kitchen',available:true,settings:{}}];
  const planning = {supportsSave:false,supportsStart:true,canSave:false,canStart:true,ordered:false};
  const adapter = {
    roomPlanningState:() => planning, roomPresentation:() => ({fields:[]}),
    roomSelectionState:(_hass,_entity,room) => room.key === 'area:kitchen' ? 'on' : 'off',
    roomContext:() => 'map-a', discover:() => ({rooms,issues:[]}),
    cleaningView:() => ({active:false,live:false}), supportsZoneDevice:() => false,
    sendRoomDraft:async request => { calls.push(request); return {rooms:[{room_id:'kitchen',name:'Kitchen'}],sent:true}; },
  };
  Object.defineProperty(card, 'adapter', {value:adapter});
  Object.assign(card, {config:{entity:'vacuum.robot',theme},registry:[],_hass:{},model:{rooms,issues:[]},
    expanded:new Set(),settingDraft:{},selected:[],isConnected:true,
    getScheduleState:() => ({supported:false}),canOfferScheduleCreation:() => false,
    headerHtml:() => '',statusHtml:() => '',planningTabsHtml:() => '',consumablesHtml:() => '',scheduleOverlayHtml:() => '',
    updateBattery() {},updateConsumables() {},positionModernPointer() {},
    paint(html) { this.html = html; }, updateStatus(notice) { this.notice = notice; },
  });
  return {card,calls,planning};
}

test('room-only planner renders and selects entityless rooms in both themes without Dyson controls', () => {
  for (const theme of ['classic','modern']) {
    const {card} = plainPlanner(theme);
    card.resetDraft();
    assert.deepEqual(card.selected, ['area:kitchen']);
    card.render();
    assert.match(card.html, /data-room="area:kitchen"/);
    assert.doesNotMatch(card.html, /data-action="save"|data-expand=|Room settings unavailable|Dyson|\(1\)/);
    assert.equal(card.notice, '');
    if (theme === 'modern') assert.match(card.html, /aria-hidden="true">✓<\/span>/);
    card.onChange({target:{dataset:{room:'area:kitchen'},checked:false}});
    assert.deepEqual(card.selected, []);
    assert.equal(card.dirty, true);
  }
});

test('room dispatch passes opaque keys and rejects unsupported actions before calling the adapter', async () => {
  const {card,calls,planning} = plainPlanner('modern');
  card.resetDraft();
  card.render = () => {};
  try {
    await card.save();
    assert.equal(calls.length, 0);
    await card.start();
    assert.deepEqual(calls[0].selected, ['area:kitchen']);
    assert.equal(calls[0].start, true);
    card.clearPendingStart();
    planning.canStart = false;
    await card.start();
    assert.equal(calls.length, 1);
  } finally { card.clearPendingStart(); }
});
