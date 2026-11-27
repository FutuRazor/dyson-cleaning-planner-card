import {hassDysonFixture} from './hass-dyson-fixture.mjs';
export const hassMapA='1784483068',hassMapB='1795665600';
export function hassMapsFixture() {
  const f=hassDysonFixture();
  f.mapSensor='sensor.kuche_dyson_robo_current_map';
  f.registry.push({entity_id:f.mapSensor,unique_id:'HD_current_map',platform:'hass_dyson',device_id:'hd-device',disabled_by:null});
  for(const row of f.registry)if(row.unique_id.startsWith('HD_clean_zone_123_')) {
    row.unique_id=row.unique_id.replace('_123_',`_${hassMapA}_`);
    row.original_name=`Clean ${row.unique_id.endsWith('_12')?'Wohnzimmer':'Schlafzimmer'} (Main Floor)`;
  }
  // Shared, unqualified setting selects deliberately retain the other map's name.
  for(const row of f.registry)if(row.unique_id.startsWith('HD_room_10_'))row.original_name=row.original_name.replace('Hall','Essbereich');
  f.bButton='button.obfuscated_upper_room';
  f.registry.push({entity_id:f.bButton,unique_id:`HD_clean_zone_${hassMapB}_10`,original_name:'Clean Essbereich (Upper Floor)',
    platform:'hass_dyson',device_id:'hd-device',disabled_by:null});
  f.hass.states[f.bButton]={state:'unknown',attributes:{}};
  f.report=(id,source='robot')=>{
    f.hass.states[f.mapSensor]={state:id===hassMapA?'Main Floor':'Upper Floor',attributes:{map_id:id,source,
      zones:id===hassMapA?['Wohnzimmer','Schlafzimmer']:['Essbereich']}};
  };
  f.report(hassMapA);
  f.hass.entities=Object.fromEntries(f.registry.map(row=>[row.entity_id,row]));
  return f;
}
