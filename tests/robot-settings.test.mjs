import assert from 'node:assert/strict';
import test from 'node:test';
import {robotSettings,changeRobotSetting,ROBOT_FIELDS} from '../src/core.js';
function fixture(){
 const entity='vacuum.robot',registry=[{entity_id:entity,device_id:'a',platform:'dyson_spot_scrub',unique_id:'serial_vacuum'}];
 const states={},calls=[];
 for(const [key,,domain] of ROBOT_FIELDS){const id=`${domain}.${key}`;registry.push({entity_id:id,device_id:'a',platform:'dyson_spot_scrub',unique_id:`serial_setting_${key}`});states[id]={state:domain==='switch'?'on':domain==='number'?'50':'22:00:00',attributes:{}};}
 const hass={states,services:{switch:{turn_on:{},turn_off:{}},number:{set_value:{}},time:{set_value:{}}},callService:async(...args)=>calls.push(args)};
 return {entity,registry,hass,calls};
}
test('robot controls target registry identities and send validated values only',async()=>{
 const {entity,registry,hass,calls}=fixture();
 await changeRobotSetting(hass,registry,entity,'volume',70);
 await changeRobotSetting(hass,registry,entity,'do_not_disturb_start','23:15');
 assert.deepEqual(calls,[['number','set_value',{entity_id:'number.volume',value:70}],['time','set_value',{entity_id:'time.do_not_disturb_start',time:'23:15:00'}]]);
 await assert.rejects(changeRobotSetting(hass,registry,entity,'volume',75));
 await assert.rejects(changeRobotSetting(hass,registry,entity,'do_not_disturb_end','24:00'));
 assert.equal(calls.length,2);
});
test('parent switches disable children without removing values or offline entities',async()=>{
 const {entity,registry,hass,calls}=fixture();
 hass.states['switch.voice_prompts'].state='off';hass.states['switch.do_not_disturb'].state='off';
 const fields=robotSettings(hass,registry,entity);
 assert.equal(fields.find(f=>f.key==='volume').value,'50');
 for(const key of ['volume','do_not_disturb_start','do_not_disturb_end']) assert.equal(fields.find(f=>f.key===key).enabled,false);
 await assert.rejects(changeRobotSetting(hass,registry,entity,'volume',80));
 assert.equal(calls.length,0);
 hass.states['switch.child_lock'].state='unavailable';
 const child=robotSettings(hass,registry,entity).find(f=>f.key==='child_lock');
 assert.equal(child.supported,true);assert.equal(child.available,false);
});
