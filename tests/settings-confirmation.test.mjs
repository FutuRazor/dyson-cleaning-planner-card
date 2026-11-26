import test from 'node:test';
import assert from 'node:assert/strict';
import {switchSettingConfirmed} from '../src/shared.js';

const fixture=()=>({
  hass:{connected:true,states:{'switch.lock':{state:'on',attributes:{}}}},
  registry:[{entity_id:'switch.lock',unique_id:'ROBOT_setting_child_lock',device_id:'robot-device',platform:'dyson_spot_scrub',disabled_by:null}],
  field:{domain:'switch',entity:'switch.lock',supported:true},
  request:{entity:'switch.lock',value:'on',uniqueId:'ROBOT_setting_child_lock',deviceId:'robot-device',platform:'dyson_spot_scrub'},
});
const confirmed=f=>switchSettingConfirmed(f.hass,f.registry,f.field,f.request);

test('setting confirmation requires the requested live entity state, including off',()=>{
  const f=fixture();assert.equal(confirmed(f),true);
  f.hass.states['switch.lock'].state='off';assert.equal(confirmed(f),false);
  f.request.value='off';assert.equal(confirmed(f),true);
  for(const state of ['unknown','unavailable']){f.hass.states['switch.lock'].state=state;assert.equal(confirmed(f),false);}
  f.hass.states['switch.lock'].state='off';f.hass.states['switch.lock'].attributes.restored=true;assert.equal(confirmed(f),false);
});

test('setting confirmation does not borrow matching values from replaced or foreign registry identities',()=>{
  for(const change of [{unique_id:'OTHER_setting_child_lock'},{device_id:'other-device'},{platform:'other_integration'},{disabled_by:'user'}]) {
    const f=fixture();Object.assign(f.registry[0],change);assert.equal(confirmed(f),false,JSON.stringify(change));
  }
  const f=fixture();f.registry=[];assert.equal(confirmed(f),false);
});

test('unavailable connections and unsupported or different setting fields cannot confirm a switch',()=>{
  const f=fixture();f.hass.connected=false;assert.equal(confirmed(f),false);
  f.hass.connected=true;
  for(const field of [undefined,{...f.field,supported:false},{...f.field,entity:'switch.other'},{...f.field,domain:'select'}]) {
    f.field=field;assert.equal(confirmed(f),false);
  }
});
