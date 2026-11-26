import test from 'node:test';
import assert from 'node:assert/strict';
import {mapSelectionState,selectMap,mapSelectionConfirmed,mapSelectionPresentation,mapSelectionCardMethods} from '../src/map-selection.js';
import {normalizeConfig} from '../src/shared.js';
import {mapSelectionFixture} from './map-selection-fixture.mjs';

test('saved maps use registry identity on one robot and send the current option for its map ID',async()=>{
  const f=mapSelectionFixture(),current=()=>mapSelectionState(f.hass,f.registry,f.entity);
  assert.equal(current().canChange,true);
  f.maps[1].option='Renamed floor';f.hass.states[f.mapSelect].attributes.options[1]='Renamed floor';
  await selectMap(f.hass,f.registry,f.entity,'1795646759');
  assert.deepEqual(f.calls,[{domain:'select',service:'select_option',data:{entity_id:f.mapSelect,option:'Renamed floor'}}]);
});

test('transport or select state alone cannot confirm; vacuum map and same entity identity must agree',()=>{
  const f=mapSelectionFixture(),state=mapSelectionState(f.hass,f.registry,f.entity),request={...state,mapId:'1795646759'};
  f.hass.states[f.mapSelect].state='Dachboden';f.hass.states[f.mapSelect].attributes.map_id=request.mapId;
  assert.equal(mapSelectionConfirmed(f.hass,f.registry,f.entity,request),false);
  f.applyMap(request.mapId);
  assert.equal(mapSelectionConfirmed(f.hass,f.registry,f.entity,request),true);
  f.registry.find(row=>row.entity_id===f.mapSelect).device_id='foreign';
  assert.equal(mapSelectionConfirmed(f.hass,f.registry,f.entity,request),false);
});

test('offline, restored, malformed, ambiguous and mismatched catalogues cannot authorize a switch',()=>{
  const mutations=[
    f=>f.hass.connected=false,
    f=>f.hass.states[f.mapSelect].attributes.restored=true,
    f=>f.hass.states[f.entity].state='unavailable',
    f=>f.hass.states[f.mapSelect].attributes.can_change=false,
    f=>f.hass.states[f.mapSelect].attributes.switching=true,
    f=>f.hass.states[f.entity].attributes.map_id='0',
    f=>f.hass.states[f.mapSelect].attributes.options=['foreign'],
    f=>f.maps[1].map_id=f.maps[0].map_id,
    f=>f.maps[1].map_id='0',
    f=>f.maps[1].option=f.maps[0].option,
    f=>f.registry.push({...f.registry.at(-1),entity_id:'select.duplicate'}),
    f=>f.registry.at(-1).disabled_by='user',
    f=>delete f.hass.services.select
  ];
  for(const mutate of mutations){
    const f=mapSelectionFixture();mutate(f);
    assert.equal(mapSelectionState(f.hass,f.registry,f.entity).canChange,false);
    assert.throws(()=>selectMap(f.hass,f.registry,f.entity,'1795646759'));
    assert.equal(f.calls.length,0);
  }
});

test('deleted options and old integrations expose no callable target',()=>{
  const f=mapSelectionFixture();
  f.maps.splice(1,1);f.hass.states[f.mapSelect].attributes.options=['Wohnung'];
  assert.throws(()=>selectMap(f.hass,f.registry,f.entity,'1795646759'));
  f.registry.pop();
  assert.equal(mapSelectionState(f.hass,f.registry,f.entity).supported,false);
  assert.equal(f.calls.length,0);
});

test('map configuration defaults preserve the header menu and use stable string IDs',()=>{
  const f=mapSelectionFixture(), config=normalizeConfig(f.config);
  assert.equal(config.map_selector_style,'menu');assert.deepEqual(config.excluded_maps,[]);
  const ids=['1795646759','999999999','1795646759'];
  const next=normalizeConfig({...f.config,map_selector_style:'chips',excluded_maps:ids});
  assert.equal(next.map_selector_style,'chips');assert.deepEqual(next.excluded_maps,['1795646759','999999999']);
  assert.deepEqual(ids,['1795646759','999999999','1795646759'],'normalization does not mutate the input');
});

test('invalid map styles and noncanonical/nonstring exclusion IDs are rejected',()=>{
  const config={entity:'vacuum.robot'};
  for(const style of ['tabs',true,null,42])assert.throws(()=>normalizeConfig({...config,map_selector_style:style}),/map_selector_style/);
  for(const value of [null,{},'123',[123],['0'],['01'],['-1'],['1.5'],[''],['Dachboden'],['9007199254740992'],[true]]) {
    assert.throws(()=>normalizeConfig({...config,excluded_maps:value}),/excluded_maps/);
  }
});

test('filtering hides a single visible current map and retains a hidden current map as a return path',()=>{
  const f=mapSelectionFixture(), state=mapSelectionState(f.hass,f.registry,f.entity);
  const full=mapSelectionPresentation(state);
  assert.equal(full.showSelector,true);assert.equal(full.displayMaps.length,2);
  const one=mapSelectionPresentation(state,{excluded_maps:['1795646759']});
  assert.equal(one.showSelector,false);assert.equal(one.hiddenCurrent,null);
  const hidden=mapSelectionPresentation(state,{excluded_maps:['1784483068']});
  assert.equal(hidden.showSelector,true);assert.equal(hidden.hiddenCurrent.map_id,'1784483068');
  assert.deepEqual(hidden.displayMaps.map(map=>map.map_id),['1784483068','1795646759']);
  const none=mapSelectionPresentation(state,{excluded_maps:f.maps.map(map=>map.map_id)});
  assert.equal(none.showSelector,false);assert.equal(none.visibleMaps.length,0);
  assert.equal(none.hiddenCurrent.map_id,'1784483068');
  assert.equal(state.maps.length,2);assert.equal(state.currentId,'1784483068');assert.equal(state.canChange,true);
});

test('renames, deletion and new maps keep visibility bound to IDs without changing the catalogue',()=>{
  const f=mapSelectionFixture(), config={excluded_maps:['1795646759','999999999']};
  f.maps[1].name='Renamed';f.maps[1].option='Renamed';f.hass.states[f.mapSelect].attributes.options[1]='Renamed';
  const present=()=>mapSelectionPresentation(mapSelectionState(f.hass,f.registry,f.entity),config);
  assert.deepEqual(present().visibleMaps.map(map=>map.map_id),['1784483068']);
  f.maps.splice(1,1);f.hass.states[f.mapSelect].attributes.options.splice(1,1);
  assert.equal(present().showSelector,false);
  f.maps.push({map_id:'2222222222',name:'New floor',option:'New floor'});
  f.hass.states[f.mapSelect].attributes.options.push('New floor');
  const before=JSON.stringify(f.hass.states[f.mapSelect]);
  assert.equal(present().showSelector,true);assert.equal(present().visibleMaps.length,2);
  assert.equal(JSON.stringify(f.hass.states[f.mapSelect]),before);
  assert.deepEqual(config.excluded_maps,['1795646759','999999999']);
});

test('unsupported adapters expose no map presentation regardless of stored preferences',()=>{
  const f=mapSelectionFixture(), state=mapSelectionState(f.hass,f.registry,f.entity);
  const shown=mapSelectionPresentation({...state,supported:false},{map_selector_style:'chips',excluded_maps:['1784483068']});
  assert.equal(shown.showSelector,false);assert.equal(shown.hiddenCurrent,null);assert.deepEqual(shown.displayMaps,[]);
});

test('card exclusions prevent hidden targets while protocol confirmation still sees the full map list',async()=>{
  const f=mapSelectionFixture(), state=mapSelectionState(f.hass,f.registry,f.entity);
  const card={config:{...f.config,excluded_maps:['1795646759']},isConnected:true,dirty:false,view:{active:false},
    shadowRoot:{querySelector:()=>null},getMapSelection:()=>state,render(){throw new Error('An excluded target must not start an operation');}};
  await mapSelectionCardMethods.switchSavedMap.call(card,'1795646759');
  assert.equal(f.calls.length,0);
  f.applyMap('1795646759');
  assert.equal(mapSelectionConfirmed(f.hass,f.registry,f.entity,{...state,mapId:'1795646759'}),true);
  const hidden=mapSelectionPresentation(mapSelectionState(f.hass,f.registry,f.entity),card.config);
  assert.equal(hidden.hiddenCurrent.map_id,'1795646759');
});
