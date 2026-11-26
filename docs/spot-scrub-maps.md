# Spot+Scrub maps and map switching

This document collects the map-lifecycle findings from maintainer tests on 25/26 November 2026, the captured commands, and the proposed Home Assistant map-selection interface. Spot+Scrub is the priority adapter for this work. A map selector or map-switch icon has not been implemented.

## Evidence and scope

| Reference | Supplied export | Coverage |
| --- | --- | --- |
| L1 | `home-assistant_dyson_spot_scrub_2026-11-25T23-11-32.051Z.log` | Mapping B, renaming, repeated A/B switches, cleaning, rejected inactive-map Kitchen requests, and the final Kitchen start on A |
| L2 | `home-assistant_dyson_spot_scrub_2026-11-26T00-01-47.187Z.log` | Selecting B and deleting it while selected, followed by automatic fallback to A |

All times in this document use the logs' explicit **UTC+01:00** offset. In L1, 23:xx is 25 November and 00:xx is 26 November. L2's relevant events occur at 01:xx on 26 November. The filenames use UTC.

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

These are **Dyson MQTT/JDM messages**, not registered Home Assistant action names. Topics in these RB05 captures have the form `RB05/<serial>/command/jdm` and `RB05/<serial>/status/jdm`. Legacy commands use `RB05/<serial>/command`, and robot state messages use `RB05/<serial>/status`.

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

The reply has `code:0` and `data.result:0`. In L2 this deletes **selected B**, with A remaining. The automatic fallback is detailed below; deletion of an inactive map or the last map has not been tested.

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

## Existing integration and card interfaces

The reviewed integration already provides `get_map_metadata()` for `GET /v2/app/<serial>/persistent-map-metadata`. It returns saved-map entries including `id`, `name`, `isCurrentMap` and `zones`. The [API implementation](https://github.com/UNsync3D/ha-dyson-spot-scrub/blob/580ba28146fe315e5772277f5179a43aa85e15c0/custom_components/dyson_spot_scrub/dyson_api.py) and [coordinator](https://github.com/UNsync3D/ha-dyson-spot-scrub/blob/580ba28146fe315e5772277f5179a43aa85e15c0/custom_components/dyson_spot_scrub/coordinator.py) use it to refresh room inventories after active-map changes, including the first report after connecting.

That inventory path updates entries returned by the API. It does not explicitly discard an entire absent map's old room-store entry. This is separate from the verified fallback and active-room-list behavior, and separate from maintaining a selector's current options.

At the reviewed commit, [`services.yaml`](https://github.com/UNsync3D/ha-dyson-spot-scrub/blob/580ba28146fe315e5772277f5179a43aa85e15c0/custom_components/dyson_spot_scrub/services.yaml), [`vacuum.py`](https://github.com/UNsync3D/ha-dyson-spot-scrub/blob/580ba28146fe315e5772277f5179a43aa85e15c0/custom_components/dyson_spot_scrub/vacuum.py) and [`select.py`](https://github.com/UNsync3D/ha-dyson-spot-scrub/blob/580ba28146fe315e5772277f5179a43aa85e15c0/custom_components/dyson_spot_scrub/select.py) expose no map-switch HA action or map-selection entity. The vacuum also implements no generic `async_send_command` route. The captured JDM method therefore does not yet provide a card-callable HA interface.

The current [Spot+Scrub adapter](../src/adapters/spot-scrub.js) discovers rooms from the vacuum's active room-name list. An available retained switch alone does not establish active-map membership. The draft context includes `map_id`; [existing regressions](../tests/room-identity.test.mjs) reject an old-map draft even when native room IDs are reused. These checks are automated evidence, distinct from the live tests.

## Proposed map-selection interface

This is a proposal, not an implemented capability:

1. Expose the current saved-map list and selected map through a device-bound HA interface, for example a `select` entity. Map IDs identify options internally; labels show names and distinguish duplicate map names if needed.
2. Selecting an option asks the integration to send the existing map-switch command. The reported active map confirms the change. The card can expose this through a header icon and a small map menu.
3. Refresh the list on connection, after a confirmed switch, and after observed mapping, rename or delete activity. Add a periodic reconciliation so changes to an inactive map or changes made while HA was disconnected are also discovered.
4. Replace selector options from a successful current full-list query: add new IDs, update names for retained IDs and remove absent IDs. A failed fetch must not be interpreted as an empty map list. Old observed commands must not resurrect a deleted option.
5. Preserve the existing room-update path that passed the live switches. Removing an option from the map selector does not require deleting and recreating HA room entities.

Both the captured JDM `get_map_list` and existing REST metadata provide a list source. Their timing and any temporary disagreement still need validation when choosing the implementation path. In particular, the active ID changes when selected B is deleted, but need not change when an inactive map is removed; the latter cannot rely on an active-map-change trigger alone.

## Remaining live checks

- Delete an **inactive** map while A stays selected, and verify list refresh without an active-ID change.
- Delete the last saved map and inspect map identity, room list and selector behavior.
- Use the same room name on A and B, initially with different native room IDs: A/Küche `13` and B/Küche `10`.
- Switch maps with an unsaved local room selection/settings draft, and verify the existing stale-draft handling.
- Observe map creation/rename/deletion while HA is disconnected and verify reconciliation after reconnect.
- Capture HA `map_id`, `rooms`, per-room `room_id`/availability and registry entries across these transitions, including the fate of deleted-map entities.
- Verify schedule behavior across maps separately; these map tests do not establish it.

This reference is a documentation-only change. Card source, generated bundle and release version are unchanged. The chronological validation index is [TESTING.md](../TESTING.md).
