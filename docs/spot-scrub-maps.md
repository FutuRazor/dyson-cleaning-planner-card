# Spot+Scrub maps and map switching

This document collects the map-lifecycle findings from maintainer tests on 25/26 November 2026, the captured commands, and the Home Assistant map-selection implementation. Spot+Scrub is the priority adapter for this work. The implementation targets the maintainer's [integration development branch](https://github.com/FutuRazor/ha-dyson-spot-scrub/tree/feat/map-switching). Map selection, schedule availability and the single-map button rule passed maintainer live checks; later corrections and remaining checks are identified below.

## Intended feature scope

**Highest-priority next feature: display and switch existing maps from both the integration and the Lovelace card.** In a two-floor home, changing the selected map is a frequent everyday action; mapping and editing are occasional tasks handled in MyDyson. This priority applies to the Spot+Scrub adapter.

The maintainer defines the initial scope as:

- **Integration and Lovelace card:** display all existing saved maps, show the selected map, and allow switching between those maps.
- **MyDyson only:** create/map, delete, rename and otherwise edit maps or rooms. Captured lifecycle commands below document the app's behavior; they are not a plan to expose those operations in HA or the card.
- **On a normal map switch:** retain room entities and their identities, preserving the smooth room-list transition observed in the live tests.
- **After a map is actually deleted in MyDyson:** preferably remove HA entities belonging exclusively to that deleted map ID, including their registry entries, and reconcile the associated cached map/room data. This is HA cleanup following an app deletion, not a request to delete a map on the robot.

Cleanup must distinguish robot, map ID and room identity. In particular, deleting B/room `10` must not remove A/room `10` or shared robot entities. Reliable attribution of existing room entities to maps remains an implementation question; cleanup is a desired behavior, not a confirmed capability.

Implementation order:

1. Provide a current list of saved maps, the selected map and a callable map-switch interface in the integration.
2. Expose that interface in the Lovelace card, preserving the already verified smooth room-list updates when the selected map changes.
3. Add the preferred cleanup of entities belonging exclusively to deleted maps once their ownership is established. Resolving cleanup must not hold up the primary map-switch feature.

## Evidence and scope

| Reference | Supplied export | Coverage |
| --- | --- | --- |
| L1 | `home-assistant_dyson_spot_scrub_2026-11-25T23-11-32.051Z.log` | Mapping B, renaming, repeated A/B switches, cleaning, rejected inactive-map Kitchen requests, and the final Kitchen start on A |
| L2 | `home-assistant_dyson_spot_scrub_2026-11-26T00-01-47.187Z.log` | Selecting B and deleting it while selected, followed by automatic fallback to A |
| L3 | `home-assistant_dyson_spot_scrub_2026-11-26T01-46-41.347Z.log` | Live map-select errors followed by successful switches/room starts, and Home from B without a station |
| L4 | `home-assistant_dyson_spot_scrub_2026-11-26T04-19-58.659Z.log` | Four stationless runs with direct versus paused Home, placement faults 2509/2510 and room discovery on a newly created B |

All times in this document use the logs' explicit **UTC+01:00** offset. In L1, 23:xx is 25 November and 00:xx is 26 November. L2's relevant events occur at 01:xx, L3's at 02:xx and L4's at 05:xx on 26 November. The filenames use UTC.

The installed integration version and HA state/registry snapshots were not supplied. Protocol messages are log evidence; frontend behavior and entity availability are identified separately as maintainer observations. Raw exports remain outside the repository.

The integration source review below is pinned to [UNsync3D/ha-dyson-spot-scrub commit `580ba28146fe315e5772277f5179a43aa85e15c0`](https://github.com/UNsync3D/ha-dyson-spot-scrub/commit/580ba28146fe315e5772277f5179a43aa85e15c0), reviewed on 26 November 2026. This does not establish which integration build produced the captures.

## Map and room identity

| Map | Persistent map ID | Observed room membership |
| --- | --- | --- |
| A: `Wohnung` | `1784483068` | Flur `12`, Küche `13`, Wohnzimmer `11`, Schlafzimmer `10`, Badezimmer `14` |
| B: initially `Karte1`, renamed `Dachboden` | `1795646759` | Büro `10`, once room preferences became populated |

Both map IDs remain stable across the captured switches. Renaming B does not change its ID. Room ID `10` belongs to Schlafzimmer on A and Büro on B: room identity must include the robot and map, not just a room ID or display name.

The same active-map identity appears in several forms:

| Message | Field | Captured representation |
| --- | --- | --- |
| `CURRENT-STATE` | `persistentMapId` | String, e.g. `"1784483068"` |
| JDM `prop.post` / `prop.get` reply | `current_map_id` | Number, e.g. `1784483068` |
| `service.get_map_list` reply | `data.map_list[].id` and `cur` | Numeric ID and Boolean active flag |
| Legacy `START` | `cleaningProgramme.persistentMapId` | String identifying the requested cleaning map |

During mapping, the robot temporarily reports map ID `0` and the saved-map list can have no entry marked current. That is not an established saved-map identity. A charging state also does not identify the selected map: L1 reports `INACTIVE_CHARGING` while B is still selected.

## Captured map commands

These are **Dyson MQTT/JDM messages**, not registered Home Assistant action names. Only listing and switching existing maps are in the requested HA/card feature scope; the other map-management commands remain reference material for observing MyDyson changes. Topics in these RB05 captures have the form `RB05/<serial>/command/jdm` and `RB05/<serial>/status/jdm`. Legacy commands use `RB05/<serial>/command`, and robot state messages use `RB05/<serial>/status`.

JDM requests contain `msgId`, `version:"1.0.1"`, `method` and `params`; some also contain an ISO UTC `time`. Replies correlate through `msgId`. The examples below retain the observed method and parameter bodies while omitting that transport envelope, message IDs and timestamps. IDs are the actual test map/room IDs.

| Purpose | JDM method | Parameters | Evidence |
| --- | --- | --- | --- |
| Read saved maps | `service.get_map_list` | `{}` | L1 lines 71-73; L2 lines 133-134 |
| Select a saved map | `service.set_cur_map` | `map_id` | L1 lines 2013-2014; L2 lines 84-85 |
| Begin mapping | `service.start_explore` | `mode:0` | L1 lines 125-127 |
| Rename a map | `service.rename_map` | `map_id`, `map_name` | L1 lines 2331-2332 |
| Rename a room on a map | `service.rename_room` | `map_id`, `room_id`, `room_name` | L1 lines 412-413 |
| Delete a map | `service.del_map` | `map_id` | L2 lines 128-129 |

### Read the map list

```json
{"method":"service.get_map_list","params":{}}
```

Before deletion, L2 returns:

```json
{
  "method": "service.get_map_list",
  "code": 0,
  "data": {
    "map_list": [
      {"name":"Wohnung","id":1784483068,"cur":true},
      {"name":"Dachboden","id":1795646759,"cur":false}
    ]
  }
}
```

After deletion, the same query returns only `Wohnung` with `cur:true`. The current list, rather than accumulated past commands, is the basis for selector options.

### Select a map

```json
{"method":"service.set_cur_map","params":{"map_id":1784483068}}
```

Selecting B uses the same method with `map_id:1795646759`. The captured reply has `code:0` and `data.result:0`. At 00:06:11.514 in L1, A is requested; at 00:06:12.710 the robot reports A in `CURRENT-STATE`. A command acknowledgement and the resulting active-map state are separate observations.

### Start mapping

```json
{"method":"service.start_explore","params":{"mode":0}}
```

The observed reply has `code:0` and `data.result:0`. The surrounding legacy traffic is `STATE-SET` with `mapLanguage:"de-DE"`, followed by `START-MAPPING` with `mode-reason:"RAPP"`. JDM `prop.set` with `language:4` also appears immediately before `start_explore` (L1 lines 122-127). This records the captured sequence; it does not establish other language codes, mapping modes, or a requirement for a client to send both protocol forms.

### Rename a map

```json
{"method":"service.rename_map","params":{"map_id":1795646759,"map_name":"Dachboden"}}
```

The reply has `code:0` and `data.result:0`. The subsequent map list changes B's name while preserving `1795646759`.

### Rename a room

```json
{
  "method": "service.rename_room",
  "params": {
    "map_id": 1795646759,
    "room_id": 10,
    "room_name": "{\"type\":\"office\",\"name\":\"Büro\"}"
  }
}
```

Here `room_name` is a JSON-encoded **string**, containing the observed `type` and `name`. The reply has `code:0` and `data` containing `map_id:1795646759`, `map_type:3` and a timestamp. It does not use the `data.result` shape shown by the other captured mutation replies.

### Delete a map

```json
{"method":"service.del_map","params":{"map_id":1795646759}}
```

The reply has `code:0` and `data.result:0`. In L2 this deletes **selected B**, with A remaining. The automatic fallback is detailed below; deletion of the last map has not been tested.

In a maintainer follow-up, the tested MyDyson UI only offers deletion of the **currently selected map**. B cannot be deleted through that UI while A is selected; B must first be selected. This is an app-interface observation. Whether a direct `service.del_map` request could target an inactive map remains untested; the captured `map_id` parameter alone does not establish that capability.

## Related room and cleaning commands

These messages help explain when room entities appear and which map a cleaning request targets. Station settings and schedule commands are outside this map reference; see the [integration contract](integration-contract.md) and [schedule guide](spot-scrub-schedules.md).

### Read room preferences for a map

```json
{"method":"service.get_preference","params":{"map_id":1795646759}}
```

The reply contains `data.room`, `material`, `uv_switch` and `prefer_on`. It does **not** repeat the requested map ID. Requests and replies must therefore be correlated by `msgId`; a room ID alone cannot establish which map the reply describes. The reviewed integration already tracks that correlation in its [preference handling](https://github.com/UNsync3D/ha-dyson-spot-scrub/blob/580ba28146fe315e5772277f5179a43aa85e15c0/custom_components/dyson_spot_scrub/dyson_mqtt.py).

### Save room preferences

The app sends this body for B immediately before starting its clean:

```json
{
  "method": "service.set_preference",
  "params": {
    "map_id": 1795646759,
    "prefer_type": 1,
    "room_preference": [[10,"Büro",0,0,0,0,0,0,1,0,1]],
    "uv_switch": [[10,1]]
  }
}
```

This is the captured row, not a general settings template. B's earlier `get_preference` replies are empty despite its completed map and renamed room. Only after this write and the cleaning start does the reply populate and entity creation follow.

### Start the selected room clean

The legacy `START` body for B is:

```json
{
  "msg": "START",
  "mode-reason": "RAPP",
  "cleaningMode": "zoneConfigured",
  "cleaningProgramme": {
    "persistentMapId": "1795646759",
    "unorderedZones": ["10"]
  }
}
```

The final card-originated Kitchen start uses `persistentMapId:"1784483068"` and `unorderedZones:["13"]`. Source attribution comes from the maintainer's timeline; `mode-reason:"RAPP"` alone does not distinguish MyDyson from integration-originated traffic.

| Other captured traffic | Observed body or parameters | Evidence |
| --- | --- | --- |
| Legacy state request | `msg:"REQUEST-CURRENT-STATE"` | L1/L2 polling |
| Legacy pause | `msg:"PAUSE"` | L1 line 1281 |
| JDM room start | `service.set_room_clean` with `ctrl_value:1`, `clean_type:0`, `room_ids:[10]` | L1 line 654 |
| JDM pause | `service.set_room_clean` with `ctrl_value:2`, `clean_type:0`, `room_ids:[]` | L1 line 1282 |
| JDM resume | `service.set_room_clean` with `ctrl_value:1`, `clean_type:0`, `room_ids:[]` | L1 line 1289 |
| Legacy return/abort | `msg:"ABORT"`, `mode-reason:"RAPP"` | L1 line 2618 |
| JDM return | `service.start_recharge` with `params:{}` | L1 lines 2619-2622 |
| Property read | `prop.get`, requesting `current_map_id` among other properties | L1/L2 polling |

For room starts, the reviewed [integration code](https://github.com/UNsync3D/ha-dyson-spot-scrub/blob/580ba28146fe315e5772277f5179a43aa85e15c0/custom_components/dyson_spot_scrub/dyson_mqtt.py) sends preferences and then legacy `START`; Dyson's cloud adds `set_cur_map` and `set_room_clean`. The extra JDM traffic following `START` is not an instruction for the card to dispatch all three commands. The captures also contain standalone app map switches without a cleaning start. Requested room order does not establish actual execution order.

## State and lifecycle messages

| Message | Captured meaning | Scope |
| --- | --- | --- |
| `CURRENT-STATE` | Reports `persistentMapId` and robot state | Active map changes and cleaning states |
| JDM `prop.post` | Reports changed properties, including `params.current_map_id` | Immediately follows B's deletion in L2 |
| JDM `prop.get` reply | Reports `data.current_map_id` among other properties | Additional active-map readback |
| `event.startBuildMap.post` | Empty `params:{}` | Follows mapping start in L1 |
| `event.BuildMapFinish.post` | Empty `params:{}` | Follows creation of B in L1; preserve the captured capitalization |
| `event.map_change.post` | `params.result:3` | Observed after the room rename; not established as a universal creation/deletion event |
| `event.shortcut_instruction_task_change.post` | `params.result:3` | Observed around switches and deletion; not a dedicated deletion notification |
| `MAP-UPLOAD-STATUS` | `status:"COMPLETE"` with `persistentMapId` | Seen after mapping and switches; does not itself mean a new map was created |

These messages can prompt a fresh list query. Their presence in a capture does not prove that every lifecycle change always emits the same event.

## Confirmed live behavior

### Creation, switching and room discovery

| Local time | Observation | Evidence |
| --- | --- | --- |
| 23:45:00-01 | Mapping starts; reported map ID becomes `0` | L1 lines 122-143 |
| 23:45:59-23:46:00 | B receives `1795646759` and appears as current `Karte1` | L1 lines 271-281 |
| 23:48:00 | Room `10` on B is renamed Büro | L1 lines 412-416 |
| 23:50:30-23:51:01 | App switches A, then B, with corresponding active-map state | L1 lines 507-584 |
| 23:51:57-23:52:01 | App writes B's preferences and starts; populated room reply is followed immediately by Büro selects and switch creation | L1 lines 650-674 |
| 00:02:04-17 | B reports `FULL_CLEAN_FINISHED`, then `INACTIVE_DISCHARGING` | L1 lines 1787-1830 |
| 00:03:21 | Robot reports charging while B remains selected | L1 line 1872 |
| 00:04:34-00:05:04 | Integration start-button callbacks request Küche; B's room list contains only Büro, so requests are rejected as missing or ambiguous | L1 lines 1906-1945 |
| 00:06:11-12 | A is selected and its five-room list is cached again | L1 lines 2013-2024 |
| 00:08:45-47 | B is renamed Dachboden; its ID is unchanged | L1 lines 2331-2340 |
| 00:09:44-46 | Final card-originated Kitchen request targets A/`13`; robot reports `FULL_CLEAN_RUNNING` on A | L1 lines 2506-2520 |

The rejected Kitchen callbacks send no `START`, `set_cur_map` or `set_room_clean` in that test window. Their number does not establish how many user interactions occurred. They exercise the integration's legacy start-button path, not the card's native `start_rooms_with_settings` rejection path. The final Kitchen start is confirmed; the later return request aborts it, so this is not evidence of that clean's completion.

The maintainer reports that per-room selects become active/inactive with map selection, while room switches remain available. Old room entities are retained across switches, and the Lovelace room list and selection follow the selected map smoothly. In the first test, mapping, successful app cleaning and map switches originate in MyDyson; the failed Kitchen test is through HA, and the final successful Kitchen start is from the room card.

The delayed first appearance of Büro is explained by the initially empty preferences in this run. It does not establish a general requirement to clean every newly mapped area before discovery.

### Deleting active map B

| Local time | Observation | L2 line |
| --- | --- | --- |
| 01:01:06.768 | App selects B | 84 |
| 01:01:08.868-893 | Robot reports B; integration caches Büro and creates its room entities | 96-100 |
| 01:01:21.569 | `service.del_map` requests deletion of B | 128 |
| 01:01:21.793 | Reply confirms `code:0`, `result:0` | 129 |
| 01:01:21.850 | `prop.post` reports A as `current_map_id` | 130 |
| 01:01:22.386 | Map list contains only A, marked current | 134 |
| 01:01:22.650 | A's room preferences are returned | 139 |
| 01:01:22.819 | `CURRENT-STATE` reports A; coordinator caches A's five rooms | 144-145 |

All five captured post-deletion map-list replies contain only A. No separate request to select A is recorded after deletion. The cached room list follows the delete request by about 1.25 seconds; frontend rendering time was not measured.

The maintainer confirms that MyDyson automatically displays A, A's room entities become active, and the Lovelace planner replaces Büro with A's rooms. The export does not establish whether B's old HA registry entries are removed, retained or unavailable after deletion.

### Additional maintainer observation

In a separate follow-up without a supplied trace, starting with B selected while the robot was physically at A's station led to location searching and then an extended station search after Return. Pausing and manually placing the robot on the dock restored normal app, integration and card behavior while B remained selected. This distinguishes selected-map identity from physical location; changing Dyson navigation behavior is outside this work.

### Live readback delay and return without a station

In L3, A is still `1784483068`, while B is a different saved map, `1795654677`, named `Karte1`. Its room is Wohnzimmer `10`; A also contains Wohnzimmer, with native ID `11`. The maintainer reports successful room cleaning after the selected map eventually updates. The capture shows starts targeting A/Küche `13` and B/Wohnzimmer `10` and subsequent running states. This provides live evidence for a shared room name across maps, while exact HA entity/registry identities and unsaved-setting isolation still need separate snapshots.

| Local time | Observation | L3 line |
| --- | --- | --- |
| 02:37:49.458 | Select A request | 119 |
| 02:37:49.659 | Successful acknowledgement/result | 120 |
| 02:37:49.980 | Immediate legacy state reply still reports B | 125 |
| 02:37:50.204 | `prop.post.current_map_id` reports A | 126 |
| 02:38:04.665 | HA select action reports confirmation timeout | 142 |
| 02:38:09.660 | Legacy `CURRENT-STATE` finally reports A | 148 |
| 02:41:04.040 / .721 | Select B request / actual JDM map report | 439 / 446 |
| 02:41:19.239 / 27.704 | Confirmation timeout / delayed legacy map report | 451 / 458 |

The first implementation only completed map-change handling on legacy state messages. The fresh JDM property arrived within a second, but the legacy map report followed roughly 20-24 seconds after the request, exceeding the 15-second telemetry deadline. The correction normalizes valid RB05 `current_map_id` reports from `prop.post` and successful/partial `prop.get` replies into the same canonical map field and refresh/confirmation path as legacy telemetry. It does not infer a map change from acknowledgement alone or retry the command. The card also clears an earlier service-error notice if later matching select/vacuum readback confirms the requested map.

For the stationless B return, the sequence is:

- At 02:42:44.729 the integration logs `RETURN_TO_BASE`; the card's Home path is `vacuum.return_to_base`.
- Legacy `ABORT` at 02:42:44.771 is followed by `service.start_recharge` at 02:42:44.847 (lines 596-598).
- At 02:42:55.428, `prop.post` reports map ID `0`. The map list later marks **both maps `cur:false`**, and legacy state also reports `"0"` (lines 611, 621, 642).
- No request to select A is recorded in that return interval. The next explicit A selection is at 02:45:05.416 (line 843).

The maintainer saw A's floor plan during that interval. The previous API helper selected the first saved map whenever no entry was marked current; that code provides a fallback explanation, although REST metadata response bodies are not included in this export. The correction removes arbitrary first-map fallback and binds static camera fetches to the robot's reported map ID when map selection is enabled. Unknown ID `0` cannot load A, and a known B ID cannot load A even if REST current-map flags lag.

Home/return commands and robot navigation are unchanged. The integration's separate Stop path sends `STOP`; no MyDyson cancellation `STOP` or normal stationless completion is captured in L3. The maintainer reports that those app/completion flows return to the placement point. A separate app-abort/completion trace is needed before equating that behavior with the card's Home action.

## Baseline integration and card interfaces

The reviewed integration already provides `get_map_metadata()` for `GET /v2/app/<serial>/persistent-map-metadata`. It returns saved-map entries including `id`, `name`, `isCurrentMap` and `zones`. The [API implementation](https://github.com/UNsync3D/ha-dyson-spot-scrub/blob/580ba28146fe315e5772277f5179a43aa85e15c0/custom_components/dyson_spot_scrub/dyson_api.py) and [coordinator](https://github.com/UNsync3D/ha-dyson-spot-scrub/blob/580ba28146fe315e5772277f5179a43aa85e15c0/custom_components/dyson_spot_scrub/coordinator.py) use it to refresh room inventories after active-map changes, including the first report after connecting.

That inventory path updates entries returned by the API. It does not explicitly discard an entire absent map's old room-store entry. This is separate from the verified fallback and active-room-list behavior, and separate from maintaining a selector's current options.

At the reviewed commit, [`services.yaml`](https://github.com/UNsync3D/ha-dyson-spot-scrub/blob/580ba28146fe315e5772277f5179a43aa85e15c0/custom_components/dyson_spot_scrub/services.yaml), [`vacuum.py`](https://github.com/UNsync3D/ha-dyson-spot-scrub/blob/580ba28146fe315e5772277f5179a43aa85e15c0/custom_components/dyson_spot_scrub/vacuum.py) and [`select.py`](https://github.com/UNsync3D/ha-dyson-spot-scrub/blob/580ba28146fe315e5772277f5179a43aa85e15c0/custom_components/dyson_spot_scrub/select.py) expose no map-switch HA action or map-selection entity. The vacuum also implements no generic `async_send_command` route. The captured JDM method therefore does not yet provide a card-callable HA interface.

The current [Spot+Scrub adapter](../src/adapters/spot-scrub.js) discovers rooms from the vacuum's active room-name list. An available retained switch alone does not establish active-map membership. The draft context includes `map_id`; [existing regressions](../tests/room-identity.test.mjs) reject an old-map draft even when native room IDs are reused. These checks are automated evidence, distinct from the live tests.

## Implemented map-selection interface

The initial implementation adds these interfaces without changing either release version:

1. The RB05 integration exposes a `select` with unique ID `<serial>_active_map`. Its `maps` attribute contains objects with string `map_id`, `name` and `option`; `map_id` identifies the currently reported map. `can_change` and `switching` describe action readiness. Duplicate names receive distinct ID-based options.
2. The card detects that select on the configured robot and adds a header map icon with a menu when at least two valid map options are available. With fewer options the button is hidden and any open menu closes; a newly reported second map restores the button. It sends one standard `select.select_option` request using the current option for the chosen map ID. A switch is confirmed only when both select state and vacuum `map_id` agree; no cleaning start is sent. Without the select, existing installations keep their previous layout.
3. The integration queries `service.get_map_list` at setup/reconnect, after reported map changes or observed MyDyson mapping/rename/delete activity, and every 60 seconds.
4. A valid current full-list reply replaces selector options. Failed/malformed replies preserve the last list, a valid empty list clears it, and older correlated replies cannot replace a newer applied list.
5. Normal switches retain existing room entities and use the tested active-room update path. Deleted IDs disappear from the selector; deleting their old room entities/registry entries remains a separate follow-up requiring verified ownership across reused room IDs and shared names.
6. Expose map display/selection only. Mapping, deletion, renaming and editing remain in MyDyson, with their results reflected back into HA and the card.

The implementation uses the captured JDM list for the selector and leaves the existing REST room-inventory path intact. Selecting a map waits for an acknowledgement/result and matching robot telemetry, each with a 15-second deadline. Both valid JDM map-property reports and legacy map reports complete the same confirmation path. No optimistic map state or automatic retry is used. Existing readiness and start locks prevent a new clean from racing the switch. The card also locks its planner during a pending switch and requires local room drafts to be discarded first.

Deleting selected B changes the active ID in the capture. Deleting an inactive map while keeping A selected is not an available test through the observed MyDyson UI. Periodic reconciliation covers changes missed while HA was disconnected and inventory changes that do not otherwise trigger an active-map update.

## Direct versus paused Home, placement faults and fresh rooms (L4)

The maintainer confirmed that deleting B leaves one integration option and hides the card's map button, and creating another map restores the button. New B in L4 is ID `1795665600`, with room Essbereich (`10`). L4 already contains that room's preference at 05:08:39.715, before the first START at 05:08:54.345; mapping and registry creation are not captured, so the reported delay until a first clean cannot be timed precisely from this export.

The integration now refreshes room preferences/inventory after mapping completion, rename/map-change events and changed map catalogues. Catalogue polls also retry when preferences are missing. Metadata can establish room names/entities while cleaning settings remain unavailable until actually reported. Active-map discovery does not fall back to another map's globally cached names, and the vacuum publishes `rooms: []` while unresolved so Lovelace does not retain A's list.

| Run | Start origin (maintainer report) | Start | Pause | Home | Maintainer observation |
| --- | --- | --- | --- | --- | --- |
| 1 | MyDyson | 05:08:54 | None | 05:09:57 | Parked at placement point |
| 2 | Lovelace | 05:10:40 | None | 05:11:18 | Parked at placement point |
| 3 | Lovelace | 05:11:38 | 05:12:17 | 05:12:26 | Searched/localized without a station |
| 4 | MyDyson | 05:17:15 | 05:18:19 | 05:18:29 | Searched/localized without a station |

All four use ABORT followed by `service.start_recharge`. App ABORT includes additional state/mode fields; HA uses its existing minimal payload. Runs 1/2 become inactive discharging at 05:10:08 / 05:11:26 without a map-ID loss. Runs 3/4 report map ID `0` at 05:12:36.229 / 05:18:36.865 and later restore B. The different outcome correlates with a prior pause in these runs, not the start origin; it does not establish Dyson's internal navigation rule. No Home/Pause/Stop command changes are made.

Fault 2510 remains USER_CONTINUE while inactive off-dock, followed by a successful app start at 05:17:15.898. Fault 2509 appears at 05:19:04.717 while inactive charging. The app meanings supplied by the maintainer are lifted / not level. The integration now supplies descriptions and permits these retained placement warnings to coexist with a new Start request in confirmed idle off-dock states. It preserves fault visibility and other state/severity checks. The card's existing `error` plus `ready_to_start: true` behavior opens the room planner. A sanitized integration fixture and all 449 offline tests pass; live acceptance of these new discovery/readiness changes remains pending.

## Stationless Home troubleshooting

**Known Dyson operating edge case:** cleaning on a map without a station, followed by **Pause → Home**, can leave the robot repeatedly searching for its location or a charging station. The same behavior was observed in MyDyson. The maintainer classifies this as an operating edge case to document, rather than an integration/card defect requiring different navigation commands.

To end the continuing search:

1. Pause the robot.
2. Place it manually on the charging station.

The maintainer confirmed that manual docking after pausing ends the search and restores normal operation. Pause/Home/Stop commands remain unchanged.

## Remaining live checks

Map selection in both directions, schedule lists/availability, the camera-bounds correction and the single-map button rule have passed maintainer live checks. The exact raw dock value behind the original oversized camera image remains uncaptured; this does not undo the confirmed visual correction. The known stationless Pause -> Home search and manual recovery are documented under [troubleshooting](#stationless-home-troubleshooting), rather than tracked as an integration/card navigation defect.

The remaining checks are:

- Create a new map and room in MyDyson without starting a clean. Check early entity discovery, an empty current-map list instead of A's old rooms while data is missing, and settings becoming usable only after reported readback.
- After correcting placement and putting the robot down, verify retained USER_CONTINUE placement faults 2509/2510 allow the planner and a new HA/card start in the confirmed idle state while their warning remains visible.
- Confirm the map-switch header notice live, including when drying is shown in the activity row.
- Delete the last saved map in MyDyson and inspect map identity, room list and selector behavior.
- Extend the shared-name observation in L3 (Wohnzimmer 11 on A / 10 on B) with HA entity/registry snapshots and settings-isolation checks.
- Switch maps with an unsaved local room draft and verify stale-draft handling; observe app creation/rename/deletion while HA is disconnected and verify reconciliation after reconnect.
- Establish verified map ownership for cleanup of entities exclusive to deleted maps while preserving reused room IDs/shared names. Cleanup remains a separate follow-up.
- Extend schedule coverage with app edits, reconnect and actual scheduled execution.

Automated checks use simulated HA/MQTT; maintainer live observations above are recorded separately. The maintainer also confirmed the card's Zone tab remains selected and automatically loads the new floor plan after switching maps; browser coverage and live acceptance are recorded in [TESTING.md](../TESTING.md#zone-view-across-saved-map-changes---26-november-2026). Historical evidence sections retain their original context and test counts. Card source and generated bundle stay together, and the current card version remains v1.7.0. The chronological validation index is [TESTING.md](../TESTING.md).
