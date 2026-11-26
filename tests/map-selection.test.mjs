import test from 'node:test';
import assert from 'node:assert/strict';
import {mapSelectionState,selectMap,mapSelectionConfirmed} from '../src/map-selection.js';
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
