# Home Assistant area cleaning

The `ha_rooms` adapter provides basic room selection for vacuum entities that implement Home Assistant's **CLEAN_AREA** feature. It uses the existing card and both themes. This is a capability-based adapter, not a promise of support for every model from a particular manufacturer. The current implementation was checked against the HA Core **2026.11.3** service and registry contract and simulated HA fixtures. The maintainer subsequently confirmed multiple starts, Pause/Resume/Home, local session room chips and battery display live with a Dyson using this generic mode; foreign-robot hardware acceptance is still pending.

## Setup

1. Add the robot through its Home Assistant integration.
2. Open **Settings → Devices & services → Entities**, select the vacuum, open its settings and choose **Map vacuum segments to areas**. Assign the robot's rooms/segments to your Home Assistant areas and save. If this option is absent, that entity does not support this route to area cleaning.
3. In the card editor, choose **Integration → Home Assistant · Area cleaning**, then choose **Robot**. Automatic also selects this adapter for eligible entities without a specialized adapter. The existing Dyson adapters take priority in Automatic.
4. Select one small area and start a test clean. Confirm that the physical room matches the HA area you assigned.

```yaml
type: custom:dyson-cleaning-planner-card
integration: ha_rooms
entity: vacuum.alfred
```

The setup procedure is documented in [Home Assistant's vacuum guide](https://www.home-assistant.io/integrations/vacuum/#mapping-your-vacuum-areas-to-home-assistant-areas). The entity must report `CLEAN_AREA` (`supported_features & 16384`); the global presence of `vacuum.clean_area` alone is insufficient. An eligible robot without mapped areas remains in the editor and shows a setup notice. Changing the integration or robot resets display order and exclusions as for the existing adapters.

## Supported scope

- Only HA areas mapped to this vacuum are offered. One area can contain several robot segments. The card uses HA area names, including renamed areas, and does not require a room entity, camera or calibrated map.
- Room choices remain local until Start. One request calls `vacuum.clean_area` with the selected vacuum's `entity_id` and the selected `cleaning_area_id` list. Native segment IDs are resolved by HA rather than sent as area IDs.
- Session room chips describe the areas requested by this card instance. They are local request snapshots, not backend-confirmed room progress, and are not recovered after a reload or shared with other browser instances. External jobs have no inferred room chips.
- Modern uses checkmarks; Classic uses unnumbered checkboxes. Display order is configurable, but there is no execution-order promise. Number badges are reserved for adapters with confirmed room-sequence command support.
- Pause, Resume and Home use `vacuum.pause`, `vacuum.start` and `vacuum.return_to_base` when the selected entity's current state, feature bits and registered services allow them. Resume depends on the integration's standard `vacuum.start` behavior.
- Battery and charging readings are optional and require unambiguous same-device, same-platform entities with the standard `battery` and `battery_charging` device classes. Missing readings remain unknown.
- If the vacuum reports `FAN_SPEED` (`supported_features & 32`), provides a nonempty `fan_speed_list` of string options and exposes `vacuum.set_fan_speed`, a shared **Suction power · all selected rooms** slider appears below the area tiles. It reuses the room planner's stepped control in both themes, with the integration's actual options. The value remains local until Start; Discard clears it. An unknown current value is labeled unavailable instead of selecting a guessed level; the option buttons allow an explicit choice. Offline controls are disabled.

The adapter does not offer per-room settings, Save, rectangle cleaning, map display, manufacturer preferences, consumables or native schedules. The optional suction control changes a **global robot setting** which may persist after the clean. It is not a temporary per-room profile, and stored room profiles may override it on some integrations/models. Other cleaning settings and room execution order remain under the robot/integration's control. Its editor hides controls for unsupported features.

### Optional suction power and Start

Changing the slider sends no command. Start first validates the selected areas and current setting capability. If an explicitly selected suction value differs from HA's current value, it calls `vacuum.set_fan_speed`, rechecks the latest card lifecycle/robot readiness and persisted area mapping, then calls `vacuum.clean_area`. An untouched or already-current value sends only the area command. These are separate operations, not an atomic transaction.

A rejected fan command prevents the area command. If the fan command succeeds but later validation or area Start fails, the card reports that the fan command was sent and the clean was not confirmed, retains the draft and does not automatically retry or roll back. Transport errors may leave actual robot effects uncertain. An explicit user retry skips the fan command if HA already reports the desired value. Losing the fan capability/options with a pending draft blocks Start until that intent is reviewed or discarded rather than silently ignoring it.

See the [HA fan-speed action](https://www.home-assistant.io/actions/vacuum.set_fan_speed/) for the standard service. Model-specific interactions with stored room profiles still need live verification.

Dyson integration caveat: current [hass-dyson vacuum code](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/vacuum.py) does not advertise FAN_SPEED. Current [Spot+Scrub vacuum code](https://github.com/UNsync3D/ha-dyson-spot-scrub/blob/main/custom_components/dyson_spot_scrub/vacuum.py) uses that API for its **cleaning mode** (`Room settings`, `Vacuum`, mop combinations), not suction intensity. The generic adapter excludes these known Spot+Scrub mode options from the suction control and rejects any pending suction draft using them. It does not substitute per-room or global select entities for a missing standard suction API. Installed versions may differ; inspect the selected vacuum's feature flags and attributes when diagnosing a missing control.

## Validation and updates

The card reads `options.vacuum.area_mapping` from the selected entity's registry entry and area names from HA's frontend area registry. Display/exclusion keys use `area:<HA area ID>`. Existing Dyson configuration keys are unchanged. Registry refresh runs on the existing 30-second interval; **Refresh rooms** also reloads it explicitly.

Before sending Start, the adapter rereads `config/entity_registry/get` and `config/area_registry/list`. It rejects changed mappings, replaced/disabled entities, removed/excluded areas, old selection contexts, disconnects, non-ready robot states, unsupported settings, concurrent starts, and detached/reconfigured cards. Read failures do not fall back to manufacturer commands. Failed commands are not retried automatically. HA's native segment/map validation remains integration-dependent; this frontend does not independently verify the current robot map, and a backend change after the last read cannot be made atomic with the command.

If a mapping changes during selection, refresh rooms and reselect the areas. Recheck the HA mapping after remapping a floor. The adapter does not call the admin-only `vacuum/get_segments` API, change the stored mapping, or infer mappings from friendly names or the vacuum's own `area_id`.

Implementation references: [HA clean-area service](https://github.com/home-assistant/core/blob/2026.11.3/homeassistant/components/vacuum/services.py), [entity registry serialization](https://github.com/home-assistant/core/blob/2026.11.3/homeassistant/helpers/entity_registry.py), and [HA frontend registry types](https://github.com/home-assistant/frontend/blob/dev/src/types.ts).

## Live acceptance

Test one mapped area, then two areas, through the intended robot integration. Verify the physical rooms and the robot's settings, Pause/Resume/Home, editor exclusions/display order, mobile layout and offline behavior. Change a persisted area mapping while a local selection is open and confirm that Start retains the draft and rejects it until refreshed. Report the robot model, integration/version, HA version and observed actions/results. Keep this verification separate from the already-confirmed Dyson refactor tests and the known cross-integration Resume exception.

For a fan-capable entity, verify that the control appears once below the tiles, changing it remains local, Start sets it before cleaning, Discard restores the live value, and a normal untouched Start does not write the setting. Check the robot's actual suction and whether stored room preferences override it. Confirm whether the setting persists after the job. The maintainer's earlier generic Dyson live test predates this optional control and does not validate these fan-speed behaviors.
