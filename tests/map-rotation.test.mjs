import test from 'node:test';
import assert from 'node:assert/strict';
import {mapRotation,normalizeConfig} from '../src/shared.js';
import {spotScrubAdapter} from '../src/adapters/spot-scrub.js';
import {hassDysonAdapter} from '../src/adapters/hass-dyson.js';
import {haRoomsAdapter} from '../src/adapters/ha-rooms.js';
import {mapSelectionFixture} from './map-selection-fixture.mjs';

test('per-map rotation overrides the default, including zero, without adding angles',()=>{
  const config=normalizeConfig({entity:'vacuum.robot',camera_rotation:90,map_rotations:{'123':0,'456':270}});
  assert.equal(mapRotation(config,'123'),0);
  assert.equal(mapRotation(config,123),0);
  assert.equal(mapRotation(config,'456'),270);
  for(const id of [undefined,null,'0','unknown','999','01'])assert.equal(mapRotation(config,id),90);
  assert.equal(mapRotation({},'123'),0);
  assert.deepEqual(normalizeConfig({entity:'vacuum.robot'}).map_rotations,{});
});

test('map rotations accept only records with canonical IDs and numeric quarter turns',()=>{
  const base={entity:'vacuum.robot'};
  for(const value of [null,[],90,'90',new Date(),{'0':90},{'01':90},{'-1':90},{'name':90},{'9007199254740992':90},
    {'123':'90'},{'123':null},{'123':false},{'123':45},{'123':360},{'123':NaN}]) {
    assert.throws(()=>normalizeConfig({...base,map_rotations:value}),/map_rotations/);
  }
  for(const angle of [0,90,180,270])assert.equal(normalizeConfig({...base,map_rotations:{'123':angle}}).map_rotations['123'],angle);
});

test('rotations follow adapter map identity across switches without renaming or mutating configuration',()=>{
  const f=mapSelectionFixture(),a=f.maps[0].map_id,b=f.maps[1].map_id;
  const rotations={[a]:90,[b]:0,'999999999':180},config=normalizeConfig({...f.config,camera_rotation:270,map_rotations:rotations});
  const rotation=adapter=>mapRotation(config,adapter.mapId(f.hass,f.entity));
  assert.notEqual(config.map_rotations,rotations,'normalization copies the dictionary');
  assert.equal(rotation(spotScrubAdapter),90);
  f.applyMap(b);assert.equal(rotation(spotScrubAdapter),0);
  f.maps[1].name=f.maps[1].option='Renamed';assert.equal(rotation(spotScrubAdapter),0);
  f.applyMap(a);assert.equal(rotation(spotScrubAdapter),90);
  assert.equal(rotation(hassDysonAdapter),270,'an adapter without saved-map identity retains the global rotation');
  assert.equal(rotation(haRoomsAdapter),270);
  assert.deepEqual(config.map_rotations,rotations,'switching and unknown IDs never rewrite configuration');
  assert.deepEqual(f.calls,[]);
});
