// Offline demonstration: no HA connection and no service execution.
import {DREAME_REFERENCE,inspectDreameSnapshot,prepareDreameSave,createDreameSaveProbe,observeDreameSave} from '../src/adapters/dreame-contract.js';
import {dreameContractFixture,publishOptimisticDreameSave} from '../tests/dreame-contract-fixture.mjs';

const f=dreameContractFixture(), baseline=inspectDreameSnapshot(f), room=baseline.rooms[0];
const plan=prepareDreameSave({baseline,draft:{[room.key]:{suction_level:2}}});
let probe=createDreameSaveProbe(plan);
const trace=[{event:'prepared',...probe}];
publishOptimisticDreameSave(f,plan);
for(const event of ['ha_values_matched','service_resolved','backend_rejected']) {
  probe=observeDreameSave(probe,{type:event});trace.push({event,...probe});
}
console.log(JSON.stringify({reference:DREAME_REFERENCE,dispatchedCommands:0,
  room:{key:room.key,name:room.name},proposedSave:plan.call,
  haDisplayedSuction:inspectDreameSnapshot(f).rooms[0].native.suction_level,trace},null,2));
