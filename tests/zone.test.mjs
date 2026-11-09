import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { validZoneCalibration, zoneRobotRectangle, zoneSha256, zoneCanStart } from '../src/zone-core.js';

const calibration = { version:1,units:'m',map_id:'123',image_width:800,image_height:400,pixels_per_metre:80,padding:40,min_x:-1,max_y:2,image_sha256:'a'.repeat(64) };
test('rotated image selections map to the same physical rectangle at all four rotations', () => {
  const expected = [.5,-1.5,4.5,1.5];
  for (const [rotation,rect] of [[0,[.2,.2,.6,.8]],[90,[.2,.2,.8,.6]],[180,[.4,.2,.8,.8]],[270,[.2,.4,.8,.8]]]) {
    zoneRobotRectangle(rect,calibration,rotation).forEach((v,i) => assert.ok(Math.abs(v-expected[i])<1e-9, `${rotation}: ${v}`));
  }
  assert.throws(() => zoneRobotRectangle([0,0,2,1],calibration));
  assert.throws(() => zoneRobotRectangle([0,0,0,1],calibration));
  assert.throws(() => zoneRobotRectangle([0,0,1,1],calibration,45));
  assert.equal(validZoneCalibration({...calibration,pixels_per_metre:0}),false);
  assert.equal(validZoneCalibration({...calibration,min_x:NaN}),false);
});
test('HTTP hash fallback matches standard SHA-256 across padding boundaries and binary data', () => {
  for (const n of [0,1,55,56,63,64,65,1000,100000]) {
    const bytes = randomBytes(n);
    assert.equal(zoneSha256(bytes),createHash('sha256').update(bytes).digest('hex'));
  }
});
test('zone start requires explicit readiness, a trusted camera, current map and service', () => {
  const hass = { services:{dyson_spot_scrub:{clean_zone:{}}},states:{vacuum:{state:'docked',attributes:{map_id:'123',ready_to_start:true}},camera:{state:'idle',attributes:{map_calibration:calibration}}}};
  const ready = () => zoneCanStart(hass,'vacuum','camera',calibration,true,false);
  assert.equal(ready(),true);
  assert.equal(zoneCanStart(hass,'vacuum','camera',calibration,false,false),false);
  assert.equal(zoneCanStart(hass,'vacuum','camera',calibration,true,true),false);
  hass.states.vacuum.attributes.ready_to_start=false; assert.equal(ready(),false);
  hass.states.vacuum.attributes.ready_to_start=true;
  hass.states.vacuum.attributes.map_id='456'; assert.equal(ready(),false);
  hass.states.vacuum.attributes.map_id='123';
  hass.states.camera.state='unavailable'; assert.equal(ready(),false);
  hass.states.camera.state='idle';
  delete hass.services.dyson_spot_scrub.clean_zone; assert.equal(ready(),false);
});
