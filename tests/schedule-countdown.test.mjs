import test from 'node:test';
import assert from 'node:assert/strict';
import { nextScheduledClean, scheduleCountdownDuration } from '../src/schedules.js';

const schedule = (changes={}) => ({id:1,enabled:true,repeat:true,days:['tue','thu'],time:'10:00',...changes});
const state = (schedules=[schedule()],changes={}) => ({available:true,inSync:true,schedules,...changes});
const at = value => Date.parse(value);

test('next cleaning uses enabled weekdays in the HA zone and rolls forward at the start',()=>{
  const s=state([schedule({id:2,time:'11:00'}),schedule(),schedule({id:3,time:'09:00',enabled:false})]);
  assert.equal(nextScheduledClean(s,'Europe/Berlin',at('2026-11-24T08:30:00Z')).timestamp,at('2026-11-24T09:00:00Z'));
  assert.equal(nextScheduledClean(s,'Europe/Berlin',at('2026-11-24T09:00:00Z')).id,2);
  assert.equal(nextScheduledClean(state(),'Europe/Berlin',at('2026-11-24T09:00:00Z')).timestamp,at('2026-11-26T09:00:00Z'));
  assert.equal(nextScheduledClean(state([schedule({days:['tue']})]),'Europe/Berlin',at('2026-11-24T09:00:00Z')).timestamp,at('2026-12-01T09:00:00Z'));
});

test('local dates cross year and UTC day boundaries and support fractional offsets',()=>{
  assert.equal(nextScheduledClean(state([schedule({days:['fri'],time:'00:15'})]),'Pacific/Auckland',at('2026-12-31T11:00:00Z')).timestamp,at('2026-12-31T11:15:00Z'));
  assert.equal(nextScheduledClean(state([schedule({days:['tue'],time:'10:00'})]),'Asia/Kathmandu',at('2026-11-24T04:00:00Z')).timestamp,at('2026-11-24T04:15:00Z'));
});

test('DST changes use the target local offset, forward gaps and the earlier overlap once',()=>{
  const s=state([schedule({days:['sun'],time:'10:00'})]);
  assert.equal(nextScheduledClean(s,'Europe/Berlin',at('2027-03-27T09:00:00Z')).timestamp,at('2027-03-28T08:00:00Z'));
  assert.equal(nextScheduledClean(s,'Europe/Berlin',at('2027-10-30T08:00:00Z')).timestamp,at('2027-10-31T09:00:00Z'));
  const early=state([schedule({days:['sun'],time:'02:30'})]);
  assert.equal(nextScheduledClean(early,'Europe/Berlin',at('2027-03-27T09:00:00Z')).timestamp,at('2027-03-28T01:30:00Z'));
  assert.equal(nextScheduledClean(early,'Europe/Berlin',at('2027-10-30T08:00:00Z')).timestamp,at('2027-10-31T00:30:00Z'));
  assert.equal(nextScheduledClean(early,'Europe/Berlin',at('2027-10-31T00:45:00Z')).timestamp,at('2027-11-07T01:30:00Z'));
});

test('unknown, unavailable and one-time schedules never invent a next weekly start',()=>{
  assert.equal(nextScheduledClean(state([]),'Europe/Berlin').reason,'inactive');
  assert.equal(nextScheduledClean(state([], {inSync:false}),'Europe/Berlin').reason,'unknown');
  assert.equal(nextScheduledClean(state(undefined,{available:false}),'Europe/Berlin').timestamp,null);
  for(const zone of [undefined,'invalid/timezone'])assert.equal(nextScheduledClean(state(),zone).reason,'timezone');
  const oneOff=schedule({repeat:false});
  assert.equal(nextScheduledClean(state([oneOff]),'Europe/Berlin').timestamp,null);
  const known=nextScheduledClean(state([oneOff,schedule({id:2})]),'Europe/Berlin');
  assert.equal(known.knownOnly,true);assert.equal(known.id,2);
  assert.equal(nextScheduledClean(state(undefined,{inSync:false}),'Europe/Berlin').knownOnly,true);
});

test('countdown duration stays compact and retains minute precision near the start',()=>{
  const now=at('2026-11-24T08:00:00Z');
  assert.equal(scheduleCountdownDuration(now+30000,now,'en'),'< 1m');
  assert.equal(scheduleCountdownDuration(now+60000,now,'en'),'1m');
  assert.equal(scheduleCountdownDuration(now+61*60000,now,'en'),'1h 1m');
  assert.equal(scheduleCountdownDuration(now+1500*60000,now,'en'),'1d 1h');
  assert.match(scheduleCountdownDuration(now+61*60000,now,'de'),/1.*1/);
});
