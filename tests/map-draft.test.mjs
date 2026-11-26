import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeConfig} from '../src/shared.js';
import {mapSelectionFixture} from './map-selection-fixture.mjs';

globalThis.HTMLElement=class {};
globalThis.window={};
const elements=new Map();
globalThis.customElements={get:name=>elements.get(name),define:(name,value)=>elements.set(name,value)};
await import('../src/card.js');
const Card=elements.get('dyson-cleaning-planner-card'),a='1784483068',b='1795646759';

function fixture() {
  const f=mapSelectionFixture(),card=Object.create(Card.prototype);
  Object.assign(card,{_hass:f.hass,registry:f.registry,config:normalizeConfig(f.config),lastRooms:[],
    isConnected:true,_detachRevision:0,initialized:true,expanded:new Set([f.ids[0]]),
    shadowRoot:{querySelector:()=>null,querySelectorAll:()=>[]},render(){},
    selected:[f.ids[0]],settingDraft:{10:{cleaning_mode:'Mop'}},planningDraft:{},dirty:true,
    zoneDraft:{calibration:{map_id:a},rect:[.2,.2,.6,.6]}});
  card.model=card.getModel();card.baseline=card.liveSignature();
  card.draftContext=card.adapter.roomContext(f.hass,f.entity,f.registry);
  f.card=card;return f;
}
const request=f=>({...f.card.getMapSelection(),mapId:b,config:f.card.config,detach:0});
const snapshot=card=>JSON.stringify({selected:card.selected,settings:card.settingDraft,planning:card.planningDraft,
  context:card.draftContext,baseline:card.baseline,dirty:card.dirty,expanded:[...card.expanded]});

test('only matching select and vacuum readbacks discard the old map draft, including reused room IDs',()=>{
  const f=fixture(),card=f.card,operation=request(f),before=snapshot(card);
  f.hass.states[f.entity].attributes.map_id='0';
  assert.equal(card.applyConfirmedMapSwitch(operation),false);assert.equal(snapshot(card),before);
  f.hass.states[f.entity].attributes.map_id=a;
  f.hass.states[f.mapSelect].state='Dachboden';f.hass.states[f.mapSelect].attributes.map_id=b;
  assert.equal(card.applyConfirmedMapSwitch(operation),false);assert.equal(snapshot(card),before);
  f.applyMap(b);
  assert.equal(card.applyConfirmedMapSwitch(operation),true);
  assert.equal(card.dirty,false);assert.deepEqual(card.selected,[]);assert.deepEqual(card.settingDraft,{});
  assert.deepEqual(card.planningDraft,{});assert.equal(card.expanded.size,0);assert.equal(card.zoneDraft,null);
  assert.equal(card.model.rooms[0].name,'Büro');assert.equal(card.model.rooms[0].roomId,'10');
  assert.equal(card.model.rooms[0].settings.cleaning_mode.value,'Vacuum');
  assert.equal(card.draftContext,card.adapter.roomContext(f.hass,f.entity,f.registry));
  assert.equal(f.calls.length,0,'discarding a local draft sends no settings commands');
  const clean=fixture(),cleanRequest=request(clean);
  clean.card.settingDraft={};clean.card.dirty=false;clean.card._mapRequest=cleanRequest;
  clean.applyMap(b);clean.card.update();
  assert.equal(clean.card.expanded.size,0,'confirmation also closes old panels after a clean draft adopted the new context');
});

test('rejected selection keeps every local room draft field on the original map',async()=>{
  const f=fixture(),before=snapshot(f.card);
  f.hass.callService=async(domain,service,data)=>{f.calls.push({domain,service,data});throw new Error('Rejected');};
  await f.card.switchSavedMap(b);
  assert.equal(snapshot(f.card),before);assert.equal(f.card._mapRequest,null);
  assert.match(f.card.message.message,/Rejected/);
  assert.deepEqual(f.calls.map(call=>call.service),['select_option']);
});

test('confirmed telemetry discards once while transport is pending, preserving later target-map edits',async()=>{
  const f=fixture();let release;
  f.hass.callService=async(domain,service,data)=>{f.calls.push({domain,service,data});await new Promise(resolve=>{release=resolve;});};
  const pending=f.card.switchSavedMap(b),before=snapshot(f.card);
  assert.equal(f.card.dirty,true);
  f.applyMap(b);f.card.update();
  assert.equal(f.card.dirty,false);assert.notEqual(snapshot(f.card),before);assert.ok(f.card._mapRequest);
  f.card.settingDraft={10:{cleaning_mode:'Mop'}};f.card.selected=['switch.saved_office'];f.card.dirty=true;
  f.card.expanded.add('switch.saved_office');const newer=snapshot(f.card);
  release();await pending;
  assert.equal(snapshot(f.card),newer,'service completion does not discard the same request twice');
  assert.equal(f.calls.length,1);
});

test('synchronous robot readback during the service call refreshes the model before draft reset',async()=>{
  const f=fixture();
  f.hass.callService=async(domain,service,data)=>{f.calls.push({domain,service,data});f.applyMap(b);};
  await f.card.switchSavedMap(b);
  assert.equal(f.card.dirty,false);assert.deepEqual(f.card.settingDraft,{});
  assert.equal(f.card.model.rooms[0].name,'Büro');assert.deepEqual(f.card.selected,[]);
  assert.deepEqual(f.calls.map(call=>call.service),['select_option']);
});

test('late confirmation clears old-map drafts and owned feedback, preserving new-map drafts and newer feedback',()=>{
  for(const newerDraft of [false,true])for(const newerFeedback of [false,true]) {
    const f=fixture(),operation=request(f),notice={key:'Old progress',params:{}};
    f.card._unconfirmedMapSwitch={request:operation,notice};
    f.card.message=newerFeedback?'Newer feedback':notice;f.card.error=true;f.applyMap(b);
    if(newerDraft) {
      f.card.model=f.card.getModel();f.card.resetDraft(false);
      f.card.settingDraft={10:{cleaning_mode:'Mop'}};f.card.selected=['switch.saved_office'];f.card.dirty=true;
      f.card.expanded=new Set(['switch.saved_office']);f.card.zoneDraft={calibration:{map_id:b},rect:[.1,.1,.8,.8]};
    }
    const before=snapshot(f.card);f.card.reconcileMapSwitch();
    assert.equal(f.card._unconfirmedMapSwitch,null);assert.equal(f.card.message,newerFeedback?'Newer feedback':'');assert.equal(f.card.error,newerFeedback);
    if(newerDraft) {assert.equal(snapshot(f.card),before);assert.equal(f.card.zoneDraft.calibration.map_id,b);}
    else {assert.equal(f.card.dirty,false);assert.deepEqual(f.card.settingDraft,{});}
  }
});

test('obsolete config, detachment or a disconnected card cannot discard a draft',()=>{
  for(const kind of ['config','detach','disconnected']) {
    const f=fixture(),operation=request(f),before=snapshot(f.card);f.applyMap(b);
    if(kind==='config')f.card.config={...f.card.config};
    if(kind==='detach')f.card._detachRevision++;
    if(kind==='disconnected')f.card.isConnected=false;
    assert.equal(f.card.applyConfirmedMapSwitch(operation),false);assert.equal(snapshot(f.card),before);
  }
});
