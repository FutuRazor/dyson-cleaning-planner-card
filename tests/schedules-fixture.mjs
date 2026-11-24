import { hassDysonFixture } from './hass-dyson-fixture.mjs';

export function schedulesFixture() {
  const f = hassDysonFixture(), sensor = 'sensor.renamed_schedule_list';
  // The HA sensor exposes every room with stored settings, even when the app's
  // actual schedule selects a subset. New schedules inherit stored selection.
  const storedRoomSelection = ['Hall'];
  const appScheduleRooms = new Map([[101,['Kitchen']],[102,['Kitchen','Hall']]]);
  f.registry.push({entity_id:sensor, unique_id:'HD_jdm_schedules', platform:'hass_dyson', device_id:'hd-device', disabled_by:null});
  f.hass.entities = Object.fromEntries(f.registry.map(e => [e.entity_id,e]));
  f.hass.config = {time_zone:'Europe/Berlin'};
  f.hass.services.hass_dyson.set_robot_schedule = {};
  f.hass.services.hass_dyson.delete_robot_schedule = {};
  f.hass.states[sensor] = {state:'2', attributes:{in_sync:true, robot_total:2, schedules:[
    {schedule_id:101, enabled:true, days:['tue','thu','sat','sun'], time:'10:00', repeat:true, rooms:['Kitchen','Hall']},
    {schedule_id:102, enabled:false, days:['mon','wed','fri'], time:'08:30', repeat:true, rooms:['Kitchen','Hall']},
  ]}};
  const baseCall = f.hass.callService;
  f.hass.callService = async (domain,service,data) => {
    if (service === 'delete_robot_schedule') {
      f.calls.push({domain,service,data:structuredClone(data)});
      const list = f.hass.states[sensor].attributes.schedules;
      const index = list.findIndex(s => s.schedule_id === data.schedule_id);
      if (index < 0) throw new Error('Unknown schedule');
      list.splice(index,1); appScheduleRooms.delete(data.schedule_id);
      f.hass.states[sensor].state = String(list.length);
      return;
    }
    if (service !== 'set_robot_schedule') return baseCall(domain,service,data);
    f.calls.push({domain,service,data:structuredClone(data)});
    const list = f.hass.states[sensor].attributes.schedules;
    const order = data.schedule_id === undefined ? {schedule_id:103, enabled:true, repeat:true, rooms:['Kitchen','Hall']} : list.find(s => s.schedule_id === data.schedule_id);
    if (!order) throw new Error('Unknown schedule');
    for (const key of ['days','time','enabled']) if (data[key] !== undefined) order[key] = structuredClone(data[key]);
    if (data.schedule_id === undefined) {
      list.push(order);
      appScheduleRooms.set(order.schedule_id,[...storedRoomSelection]);
    }
    f.hass.states[sensor].state = String(list.length);
  };
  return {...f,sensor,storedRoomSelection,appScheduleRooms};
}
