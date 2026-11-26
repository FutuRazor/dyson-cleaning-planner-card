// Offline contract prototype. Deliberately not registered or bundled as an
// adapter: descriptors returned here never execute HA services.
export const DREAME_REFERENCE = Object.freeze({
  repository:'Tasshack/dreame-vacuum', version:'v2.0.3',
  commit:'fec086caf064f2681e8bcc7be20a0d0ef54f444d',
});

export class DreameContractError extends Error {
  constructor(code, message) { super(message); this.name='DreameContractError'; this.code=code; }
}
const fail = (code, message) => { throw new DreameContractError(code,message); };
const record = value => !!value && typeof value==='object' && !Array.isArray(value);
const live = state => !!state && !['unknown','unavailable'].includes(state.state) && !state.attributes?.restored;
const id = value => {
  const text=String(value);
  return /^[1-9]\d*$/.test(text) && Number.isSafeInteger(Number(text)) ? Number(text) : null;
};
const range = (value,min,max) => Number.isInteger(value) && value>=min && value<=max;
const specs = {
  suction_level:{suffix:'suction_level',raw:'suction_level',min:0,max:3,options:{quiet:0,standard:1,strong:2,turbo:3}},
  repeats:{suffix:'cleaning_times',raw:'cleaning_times',min:1,max:3,options:{'1x':1,'2x':2,'3x':3}},
  cleaning_mode:{suffix:'cleaning_mode',raw:'cleaning_mode',min:0,max:2,options:{sweeping:0,mopping:1,sweeping_and_mopping:2}},
  water_volume:{suffix:'water_volume',raw:'water_volume',min:1,max:3,options:{low:1,medium:2,high:3}},
  wetness_level:{suffix:'wetness_level',raw:'wetness_level',min:1,max:32},
};
const humidity={suffix:'mop_pad_humidity',raw:'water_volume',min:1,max:3,options:{slightly_dry:1,moist:2,wet:3}};

export function inspectDreameSnapshot({hass,registry,entity}) {
  if (!Array.isArray(registry)) fail('registry','An authoritative entity registry is required.');
  const vacuums=registry.filter(row=>row.entity_id===entity && row.platform==='dreame_vacuum' && !row.disabled_by);
  if (vacuums.length!==1 || !vacuums[0].device_id) fail('identity','Expected one enabled Dreame vacuum with a device identity.');
  const vacuum=vacuums[0], state=hass?.states?.[entity], attrs=state?.attributes ?? {};
  const mac=typeof vacuum.unique_id==='string' && vacuum.unique_id.endsWith('_dreame_vacuum')
    ? vacuum.unique_id.slice(0,-'_dreame_vacuum'.length) : '';
  if (!mac) fail('identity','The pinned Dreame vacuum unique-ID format is missing.');
  const mapId=id(attrs.selected_map_id), mapIndex=id(attrs.selected_map_index);
  const maps=Array.isArray(attrs.maps) ? attrs.maps : [];
  const matches=maps.filter(map=>id(map.id)===mapId && id(map.index)===mapIndex);
  if (!mapId || !mapIndex || matches.length!==1) fail('map_identity','The selected map ID/index cannot be resolved unambiguously.');
  const map=matches[0];
  // The vacuum's room catalogue is keyed by localized map names. Require a
  // unique catalogue join; never use a friendly name as the native identity.
  if (typeof map.name!=='string' || maps.filter(candidate=>candidate.name===map.name).length!==1
      || !Array.isArray(attrs.rooms?.[map.name])) fail('map_catalogue','The selected map room catalogue is missing or ambiguous.');
  const own=registry.filter(row=>row.platform==='dreame_vacuum' && row.device_id===vacuum.device_id && !row.disabled_by);
  const cameras=own.filter(row=>row.entity_id.startsWith('camera.') && row.unique_id===`${mac}_map_${mapIndex}`);
  if (cameras.length!==1) fail('map_metadata','This prototype requires the selected saved-map camera metadata.');
  const camera=hass?.states?.[cameras[0].entity_id], metadata=camera?.attributes;
  if (!live(camera) || metadata?.selected!==true || id(metadata.map_id)!==mapId || id(metadata.map_index)!==mapIndex
      || !record(metadata.rooms)) fail('map_metadata','Selected-map metadata does not match the vacuum.');
  const catalogue=attrs.rooms[map.name], nativeIds=catalogue.map(room=>id(room.id));
  if (nativeIds.some(value=>value===null) || new Set(nativeIds).size!==nativeIds.length) fail('room_identity','The selected map has invalid or duplicate native room IDs.');
  const capabilities=Array.isArray(attrs.capabilities) ? attrs.capabilities : [];
  // The pinned backend publishes detailed state/status, not self_repairing.
  const selfRepairing=attrs.vacuum_state==='water_check' || ['water_check','self_repair'].includes(attrs.status);
  const ready=hass?.connected!==false && live(state) && ['docked','idle'].includes(state.state)
    && attrs.has_saved_map===true && attrs.has_temporary_map===false
    && attrs.started===false && attrs.running===false && attrs.customized_cleaning===true
    && attrs.cleangenius_cleaning!==true && attrs.draining!==true && attrs.self_repairing!==true && !selfRepairing
    && capabilities.includes('customized_cleaning');
  const context=JSON.stringify([entity,vacuum.device_id,vacuum.unique_id,mapId,mapIndex,[...nativeIds].sort((a,b)=>a-b)]);
  const rooms=catalogue.map(item=>{
    const roomId=id(item.id), raw=metadata.rooms[String(roomId)];
    if (!record(raw) || id(raw.room_id)!==roomId || raw.visibility==='Hidden') fail('room_identity','Room catalogue and selected-map metadata disagree.');
    const native={suction_level:raw.suction_level,repeats:raw.cleaning_times,water_volume:raw.water_volume,
      wetness_level:raw.wetness_level,cleaning_mode:raw.cleaning_mode};
    const controls={};
    const fieldSpecs={suction_level:specs.suction_level,repeats:specs.repeats,cleaning_mode:specs.cleaning_mode};
    if (capabilities.includes('wetness_level')) fieldSpecs.wetness_level=specs.wetness_level;
    else fieldSpecs.water_volume=capabilities.includes('self_wash_base') ? humidity : specs.water_volume;
    for (const [key,spec] of Object.entries(fieldSpecs)) {
      const domain=key==='wetness_level' ? 'number' : 'select';
      const entries=own.filter(row=>row.entity_id.startsWith(`${domain}.`) && row.unique_id===`${mac}_room_${roomId}_${spec.suffix}`);
      if (entries.length!==1) continue;
      const field=hass?.states?.[entries[0].entity_id];
      let options=[];
      if (domain==='number') {
        const {min,max,step}=field?.attributes ?? {};
        if (range(min,1,32) && range(max,min,32) && step===1) options=Array.from({length:max-min+1},(_,i)=>min+i);
      } else if (Array.isArray(field?.attributes?.options)) {
        options=field.attributes.options.filter(option=>Object.hasOwn(spec.options,option)).map(option=>spec.options[option]);
      }
      // Camera values are map-qualified baselines. Select value attributes can
      // help reject a stale field but cannot prove a robot-side acknowledgement.
      const sameValue=domain==='number' ? Number(field?.state)===native[key] : field?.attributes?.value===native[key];
      controls[key]={entity:entries[0].entity_id,options:[...new Set(options)],available:ready && live(field) && sameValue && options.length>0};
    }
    return {key:JSON.stringify([vacuum.device_id,mapId,roomId]),roomId,name:item.name,context,native,controls};
  });
  return {entity,deviceId:vacuum.device_id,mapId,mapIndex,context,rooms,ready,ordered:false,
    services:{save:!!hass?.services?.dreame_vacuum?.vacuum_set_custom_cleaning,
      start:!!hass?.services?.dreame_vacuum?.vacuum_clean_segment},
    reference:DREAME_REFERENCE};
}

function sameContext(baseline,current) {
  if (!baseline || !current || baseline.context!==current.context) fail('stale_context','The robot, selected map or room identities changed.');
  if (!current.ready) fail('not_ready','The saved-map customized-cleaning profile is not currently ready.');
}
const findRoom=(snapshot,key)=>{
  const rooms=snapshot.rooms.filter(room=>room.key===key);
  if (rooms.length!==1) fail('room_identity','Expected exactly one current native room for this key.');
  return rooms[0];
};

export function prepareDreameSave({baseline,current=baseline,draft={}}) {
  sameContext(baseline,current);
  if (!current.services.save) fail('service','The native room-profile save service is unavailable.');
  if (!record(draft)) fail('draft','Expected a draft keyed by stable room keys.');
  const edited=[];
  for (const [key,values] of Object.entries(draft)) {
    const before=findRoom(baseline,key), room=findRoom(current,key);
    if (!record(values)) fail('draft','Room edits must be setting objects.');
    if (JSON.stringify(before.native)!==JSON.stringify(room.native)) fail('external_change','Room preferences changed outside this draft.');
    const changed={};
    for (const [field,value] of Object.entries(values)) {
      if (!Object.hasOwn(specs,field)) fail('setting','This field is outside the prototype contract.');
      if (value===room.native[field]) continue;
      if (!room.controls[field]?.available || !room.controls[field].options.includes(value)) fail('setting','The edited native value is unavailable or unsupported.');
      changed[field]=value;
    }
    if (Object.keys(changed).length) edited.push({room,changed});
  }
  if (!edited.length) return {kind:'noop',call:null,ordered:false};
  const data={entity_id:current.entity,segment_id:edited.map(({room})=>room.roomId)};
  const included=new Set(['suction_level','repeats',...edited.flatMap(({changed})=>Object.keys(changed))]);
  for (const key of included) {
    const spec=specs[key];
    data[key]=edited.map(({room,changed})=>{
      const value=changed[key] ?? room.native[key];
      if (!range(value,spec.min,spec.max)) fail('baseline','A required companion value is unknown or cannot be preserved by this action.');
      return value;
    });
  }
  return {kind:'save',context:current.context,ordered:false,
    call:{domain:'dreame_vacuum',service:'vacuum_set_custom_cleaning',data},
    confirmation:'unverified_background_write',autoStartAllowed:false};
}

export function prepareDreameStart({baseline,current=baseline,selected=[],draft={},pendingSave=null}) {
  sameContext(baseline,current);
  if (!current.services.start) fail('service','The native segment-cleaning service is unavailable.');
  if (!record(draft) || Object.keys(draft).length || pendingSave) fail('unconfirmed_save','This prototype cannot chain an edited or unconfirmed profile into Start.');
  if (!Array.isArray(selected) || !selected.length || new Set(selected).size!==selected.length) fail('selection','Select distinct current-map rooms.');
  const rooms=selected.map(key=>{findRoom(baseline,key);return findRoom(current,key);});
  return {kind:'start',ordered:false,liveVerificationRequired:true,
    call:{domain:'dreame_vacuum',service:'vacuum_clean_segment',data:{entity_id:current.entity,
      segments:rooms.map(room=>room.roomId),repeats:[],suction_level:[],water_volume:[]}},
    semantics:'empty_arrays_request_stored_room_fallback_in_pinned_backend'};
}

export function createDreameSaveProbe(plan) {
  if (plan?.kind!=='save') fail('probe','A native Save descriptor is required.');
  return {context:plan.context,phase:'prepared',serviceAccepted:false,observedInHa:false,
    robotConfirmed:false,autoStartAllowed:false,possibleSideEffect:false,error:null};
}

export function observeDreameSave(probe,event) {
  const types=['service_resolved','ha_values_matched','service_rejected','backend_rejected','expired','context_changed'];
  if (!types.includes(event?.type)) fail('evidence','No verified robot-acknowledgement event is defined by this prototype.');
  const result={...probe,robotConfirmed:false,autoStartAllowed:false};
  if (event.type==='service_resolved') { result.serviceAccepted=true; result.possibleSideEffect=true; }
  if (event.type==='ha_values_matched') { result.observedInHa=true; result.possibleSideEffect=true; }
  if (probe.error) return result;
  if (['service_rejected','backend_rejected','expired','context_changed'].includes(event.type)) {
    return {...result,phase:'unconfirmed_failure',possibleSideEffect:true,error:event.type};
  }
  return {...result,phase:'awaiting_robot_evidence'};
}
