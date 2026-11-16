import test from 'node:test';
import assert from 'node:assert/strict';
import {zoneDimensionText,adjustZone,zonePillPosition} from '../src/zone-core.js';
test('minimum zones move away from corners without resizing and resize independently',()=>{
 const min=[.055,.11],r=[.945,.89,1,1];
 const moved=adjustZone(r,-.2,-.2,false,min);
 assert.ok(Math.abs(moved[2]-moved[0]-.055)<1e-10);
 assert.ok(Math.abs(moved[3]-moved[1]-.11)<1e-10);
 assert.deepEqual(adjustZone(r,1,1,false,min),r);
 assert.deepEqual(adjustZone([.2,.3,.5,.6],2,2,true,min),[.2,.3,1,1]);
 const tiny=adjustZone([.2,.3,.5,.6],-2,-2,true,min);
 assert.equal(tiny[0],.2);assert.equal(tiny[1],.3);
 assert.ok(Math.abs(tiny[2]-.255)<1e-10);
});
test('dimension pill flips below at top and stays inside horizontal and vertical edges',()=>{
 assert.deepEqual(zonePillPosition([.4,.4,.6,.6],400,300,100,24),[150,90]);
 assert.deepEqual(zonePillPosition([0,0,.1,.1],400,300,100,24),[0,36]);
 assert.deepEqual(zonePillPosition([.9,0,1,.1],400,300,100,24),[300,36]);
 assert.deepEqual(zonePillPosition([0,0,1,1],400,300,100,24),[150,276]);
});

test('dimension text follows HA length units without rounding before conversion',()=>{
 for(const unit of ['mi','ft']) assert.equal(zoneDimensionText(183,123,unit),'72 \u00d7 48 in');
 for(const unit of ['km','m',undefined,'unknown']) assert.equal(zoneDimensionText(183,123,unit),'183 \u00d7 123 cm');
 assert.equal(zoneDimensionText(55,55,'mi'),'22 \u00d7 22 in');
 assert.equal(zoneDimensionText(52.1,52.1,'mi'),'21 \u00d7 21 in');
});
