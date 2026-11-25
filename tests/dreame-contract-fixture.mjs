// Synthetic, source-shaped v2.0.3 data. No real model, robot or credentials.
export function dreameContractFixture() {
  const entity='vacuum.renamed_dreame', mac='aa:bb:cc:dd:ee:ff';
  const registry=[], states={};
  const row=(entity_id,suffix)=>{
    registry.push({entity_id,unique_id:`${mac}_${suffix}`,platform:'dreame_vacuum',
      device_id:'dreame-device',config_entry_id:'dreame-config',disabled_by:null});
    return entity_id;
  };
  row(entity,'dreame_vacuum');
  const attrs={selected_map_id:101,selected_map_index:1,
    maps:[{id:101,index:1,name:'Ground floor'},{id:202,index:2,name:'Upper floor'}],
    rooms:{'Ground floor':[{id:1,name:'Kitchen'},{id:2,name:'Hall'}],'Upper floor':[{id:1,name:'Bedroom'}]},
    capabilities:['map','customized_cleaning','custom_cleaning_mode'],
    has_saved_map:true,has_temporary_map:false,started:false,running:false,customized_cleaning:true,cleangenius_cleaning:false};
  states[entity]={state:'docked',attributes:attrs};
  const camera=row('camera.renamed_ground','map_1'), upperCamera=row('camera.renamed_upper','map_2');
  const native={
    '1':{room_id:1,name:'Kitchen',suction_level:1,cleaning_times:1,water_volume:2,cleaning_mode:2,visibility:'Visible'},
    '2':{room_id:2,name:'Hall',suction_level:0,cleaning_times:1,water_volume:1,cleaning_mode:0,visibility:'Visible'},
  };
  states[camera]={state:'2026-11-25T08:00:00Z',attributes:{map_id:101,map_index:1,selected:true,rooms:native}};
  states[upperCamera]={state:'2026-11-25T08:00:00Z',attributes:{map_id:202,map_index:2,selected:false,
    rooms:{'1':{...native['1'],name:'Bedroom',suction_level:3}}}};
  const definitions={
    suction_level:{options:['quiet','standard','strong','turbo'],values:['quiet','standard','strong','turbo'],raw:'suction_level'},
    cleaning_times:{options:['1x','2x','3x'],raw:'cleaning_times'},
    water_volume:{options:['low','medium','high'],values:['','low','medium','high'],raw:'water_volume'},
    cleaning_mode:{options:['sweeping','mopping','sweeping_and_mopping','mopping_after_sweeping'],
      values:['sweeping','mopping','sweeping_and_mopping','mopping_after_sweeping'],raw:'cleaning_mode'},
  };
  const fields={};
  for (const [roomId,room] of Object.entries(native)) {
    fields[roomId]={};
    for (const [key,definition] of Object.entries(definitions)) {
      const field=row(`select.obfuscated_${roomId}_${key}`,`room_${roomId}_${key}`);
      fields[roomId][key]=field;
      const value=room[definition.raw];
      states[field]={state:definition.values?.[value] ?? `${value}x`,attributes:{value,options:[...definition.options]}};
    }
  }
  states[fields['2'].water_volume]={state:'unavailable',attributes:{value:1,options:['unavailable']}};
  const hass={states,connected:true,services:{dreame_vacuum:{vacuum_set_custom_cleaning:{},vacuum_clean_segment:{}}},
    callService:()=>{throw new Error('This offline fixture must never dispatch HA commands.');}};
  return {entity,mac,registry,hass,camera,upperCamera,fields};
}

export function dreameWaterVariant(f,variant) {
  const caps=f.hass.states[f.entity].attributes.capabilities;
  caps.push('self_wash_base');
  if(variant==='wetness')caps.push('wetness_level');
  for(const roomId of ['1','2']) {
    const old=f.fields[roomId].water_volume;
    f.registry=f.registry.filter(row=>row.entity_id!==old);delete f.hass.states[old];
    const suffix=variant==='wetness' ? 'wetness_level' : 'mop_pad_humidity';
    const domain=variant==='wetness' ? 'number' : 'select';
    const entity_id=`${domain}.obfuscated_${roomId}_${suffix}`;
    f.registry.push({entity_id,unique_id:`${f.mac}_room_${roomId}_${suffix}`,platform:'dreame_vacuum',device_id:'dreame-device',disabled_by:null});
    const room=f.hass.states[f.camera].attributes.rooms[roomId];
    if(variant==='wetness') {
      room.wetness_level=roomId==='1' ? 16 : 8;
      f.hass.states[entity_id]={state:String(room.wetness_level),attributes:{min:1,max:32,step:1}};
    } else {
      f.hass.states[entity_id]={state:room.water_volume===2 ? 'moist' : 'slightly_dry',
        attributes:{value:room.water_volume,options:['slightly_dry','moist','wet']}};
    }
    f.fields[roomId][suffix]=entity_id;
  }
  return f;
}

export function publishOptimisticDreameSave(f,plan) {
  const data=plan.call.data;
  const names={suction_level:['quiet','standard','strong','turbo'],water_volume:['','low','medium','high'],
    cleaning_mode:['sweeping','mopping','sweeping_and_mopping','mopping_after_sweeping']};
  const rawKeys={repeats:'cleaning_times'};
  data.segment_id.forEach((roomId,index)=>{
    const room=f.hass.states[f.camera].attributes.rooms[String(roomId)];
    for(const key of ['suction_level','repeats','water_volume','wetness_level','cleaning_mode']) {
      if(!data[key])continue;
      const value=data[key][index], raw=rawKeys[key] ?? key;
      room[raw]=value;
      const entity=f.fields[roomId][raw];
      if(entity && f.hass.states[entity]) {
        f.hass.states[entity].state=names[key]?.[value] ?? (key==='repeats' ? `${value}x` : String(value));
        if(f.hass.states[entity].attributes.value!==undefined)f.hass.states[entity].attributes.value=value;
      }
    }
  });
  // This resembles a local HA publication; it is deliberately no robot ACK.
  f.hass.states[f.camera].state='2026-11-25T08:00:01Z';
}
