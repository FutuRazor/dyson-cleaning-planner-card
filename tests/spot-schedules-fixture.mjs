import { batchFixture } from './fixture.mjs';

// UNsync3D v2.2.0 schedule contract, initially reviewed at d595d5f.
export function spotSchedulesFixture({reportedSettings=true}={}) {
  const f = batchFixture(), sensor='sensor.renamed_spot_schedules';
  f.hass.states[f.entity].attributes.map_id='123';
  f.hass.config={time_zone:'Europe/Berlin'};
  f.registry.push({entity_id:sensor,unique_id:'DEMO_schedules',platform:'dyson_spot_scrub',device_id:'demo-device',disabled_by:null});
  f.hass.entities=Object.fromEntries(f.registry.map(e=>[e.entity_id,e]));
  f.hass.services.dyson_spot_scrub.set_schedule={};
  f.hass.services.dyson_spot_scrub.delete_schedule={};
  const preferences = Object.fromEntries(Object.entries(f.fields).map(([id,fields])=>[id,Object.fromEntries(Object.entries(fields).map(([key,entity])=>[key,f.hass.states[entity].state]))]));
  const plans=new Map([[101,{rooms:['10','11'],settings:structuredClone(preferences)}],[102,{rooms:['13'],settings:structuredClone(preferences)}]]);
  plans.get(101).settings['10'].cleaning_mode='Vacuum and Mop';
  f.hass.states[sensor]={state:'2',attributes:{known:2,on:1,unknown:0,in_sync:true,can_change:true,schedules:[
    {schedule_id:101,enabled:true,days:['tue','thu','sat','sun'],time:'10:00',repeat:true,map_id:'123',room_ids:['10','11'],rooms:[f.names[0],f.names[1]]},
    {schedule_id:102,enabled:false,days:['mon','wed','fri'],time:'08:30',repeat:true,map_id:'123',room_ids:['13'],rooms:[f.names[3]]},
  ]}};
  const describeSettings=order=>{
    if(reportedSettings)order.room_settings=Object.fromEntries(order.room_ids.map(id=>[id,structuredClone(plans.get(order.schedule_id).settings[id])]));
  };
  f.hass.states[sensor].attributes.schedules.forEach(describeSettings);
  f.hass.callService=async(domain,service,data)=>{
    f.calls.push({domain,service,data:structuredClone(data)});
    if(domain!=='dyson_spot_scrub')return;
    const attrs=f.hass.states[sensor].attributes;
    if(service==='set_schedule') {
      const fresh=data.schedule_id===undefined;
      const order=fresh ? {schedule_id:103,enabled:true,repeat:true,map_id:'123'} : attrs.schedules.find(s=>s.schedule_id===data.schedule_id);
      if(!order)throw new Error('Unknown schedule');
      for(const key of ['days','time','enabled'])if(data[key]!==undefined)order[key]=structuredClone(data[key]);
      if(data.room_ids) {
        order.room_ids=[...data.room_ids];
        order.rooms=data.room_ids.map(id=>f.names[Number(id)-10]);
      }
      if(fresh) {
        const settings=structuredClone(preferences);
        for(const [id,values]of Object.entries(data.room_settings??{}))Object.assign(settings[id],values);
        plans.set(order.schedule_id,{rooms:[...data.room_ids],settings});
        attrs.schedules.push(order);
      } else {
        const plan=plans.get(order.schedule_id);
        if(data.room_ids)plan.rooms=[...data.room_ids];
        for(const [id,settings] of Object.entries(data.room_settings??{}))Object.assign(plan.settings[id],settings);
      }
      describeSettings(order);
    } else if(service==='delete_schedule') {
      const index=attrs.schedules.findIndex(s=>s.schedule_id===data.schedule_id);
      if(index<0)throw new Error('Unknown schedule');
      attrs.schedules.splice(index,1);plans.delete(data.schedule_id);
    } else if(['save_room_settings','start_rooms_with_settings'].includes(service)) {
      for(const [id,settings]of Object.entries(data.room_settings??{})) for(const [key,value]of Object.entries(settings))f.hass.states[f.fields[id][key]].state=value;
    }
    attrs.known=attrs.schedules.length;attrs.on=attrs.schedules.filter(s=>s.enabled).length;
    f.hass.states[sensor].state=String(attrs.known);
  };
  return {...f,sensor,plans,config:{...f.config,integration:'dyson_spot_scrub'}};
}
