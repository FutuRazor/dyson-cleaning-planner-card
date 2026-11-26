import test from 'node:test';
import assert from 'node:assert/strict';
import { scheduleRequestConfirmed } from '../src/schedules.js';

const schedule={id:101,enabled:false,days:['mon','thu'],time:'11:30',roomIds:['13','11'],mapId:'123',
  roomSettings:{'13':{cleaning_mode:'Mop',water_level:'High'},'11':{cleaning_mode:'Vacuum'}}};
const state=()=>({available:true,schedules:[structuredClone(schedule)]});

test('a different map cannot confirm a schedule action, including disappearance after filtering',()=>{
  const request={kind:'delete',id:101,context:'map-a'};
  assert.equal(scheduleRequestConfirmed({available:true,schedules:[],inSync:true,context:'map-b'},request),false);
  assert.equal(scheduleRequestConfirmed({available:true,schedules:[],inSync:true,context:'map-a'},request),true);
});

test('schedule toggle/delete confirmation requires readable authoritative metadata',()=>{
  const s=state();
  assert.equal(scheduleRequestConfirmed(s,{kind:'toggle',id:101,enabled:false}),true);
  assert.equal(scheduleRequestConfirmed(s,{kind:'toggle',id:101,enabled:true}),false);
  assert.equal(scheduleRequestConfirmed(s,{kind:'delete',id:101}),false);
  assert.equal(scheduleRequestConfirmed({...s,schedules:[]},{kind:'delete',id:101}),true);
  assert.equal(scheduleRequestConfirmed({available:false,schedules:[]},{kind:'delete',id:101}),false);
});

test('schedule edits check days/time and the exact selected room order/map',()=>{
  const s=state(),request={kind:'edit',id:101,days:['thu','mon'],time:'11:30',roomIds:['13','11'],mapId:'123'};
  assert.equal(scheduleRequestConfirmed(s,request),true);
  for(const patch of [{id:999},{days:['mon']},{time:'11:31'},{roomIds:['11','13']},{mapId:'999'}])assert.equal(scheduleRequestConfirmed(s,{...request,...patch}),false);
  // Fields omitted by a days/time-only action are deliberately not compared.
  assert.equal(scheduleRequestConfirmed(s,{kind:'edit',id:101,days:['mon','thu'],time:'11:30'}),true);
});

test('schedule deletion cannot be confirmed by a known incomplete list',()=>{
  const absent={available:true,schedules:[]},request={kind:'delete',id:101};
  assert.equal(scheduleRequestConfirmed({...absent,inSync:false},request),false);
  assert.equal(scheduleRequestConfirmed({...absent,inSync:true},request),true);
  assert.equal(scheduleRequestConfirmed(absent,request),true,'older metadata without sync status remains supported');
  assert.equal(scheduleRequestConfirmed({...state(),inSync:true},request),false,'a present target is never confirmed deleted');
});

test('saved room settings must reflect the requested values before success is reported',()=>{
  const s=state(),request={kind:'edit',id:101,roomSettings:{'13':{water_level:'High'}}};
  assert.equal(scheduleRequestConfirmed(s,request),true);
  assert.equal(scheduleRequestConfirmed(s,{...request,roomSettings:{'13':{water_level:'Low'}}}),false);
  delete s.schedules[0].roomSettings['13'].water_level;
  assert.equal(scheduleRequestConfirmed(s,request),false,'missing readback is not guessed from general preferences');
});

test('schedule creation needs one matching new ID rather than an existing or ambiguous entry',()=>{
  const s=state(),request={kind:'create',previousIds:[101],days:['mon','thu'],time:'11:30',enabled:false};
  assert.equal(scheduleRequestConfirmed(s,request),false);
  s.schedules.push({...structuredClone(schedule),id:102});
  assert.equal(scheduleRequestConfirmed(s,request),true);
  s.schedules.push({...structuredClone(schedule),id:103});
  assert.equal(scheduleRequestConfirmed(s,request),false);
});
