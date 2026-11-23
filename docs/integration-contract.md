# Integration contract — card v1.4.0

This contract describes the **Spot+Scrub adapter**. The experimental `hass_dyson` adapter has a separate [entity/action contract and setup guide](hass-dyson.md). `integration: auto` selects the configured vacuum's registry platform; initial discovery prefers Spot+Scrub. Explicit adapter choices are available in the visual editor.

This document describes what the **current card actually reads and sends**, based on the Spot+Scrub adapter and its card/editor/map/zone consumers. The adapter experiment preserves this contract; see [adapter architecture](integration-adapter.md). It is a frontend contract, not a specification of Dyson's MQTT protocol or a guarantee about the integration's internal implementation.

Both Modern and Classic use this same contract. The documented minimum integration version is **UNsync3D Dyson Spot+Scrub v2.1.0**; optional features require the corresponding entities/actions in the installed version.

Reviewed against the repository source on **21 November 2026**, without a release-version change. This describes every integration-facing feature in the current source; it does not certify another integration or replace hardware verification. For a migration assessment, see [hass-dyson compatibility](hass-dyson-compatibility.md).

## Minimum working setup

For room planning and starting a clean, provide:

1. A connected Home Assistant frontend with this card loaded as a JavaScript module, access to the entity registry, live entity states and permission to call the required actions.
2. One enabled `vacuum.*` registered on platform `dyson_spot_scrub`, with a `device_id`, unique ID `<serial>_vacuum`, an available state and `attributes.rooms`.
3. For each selectable room, one matching enabled room switch and at least one available per-room select exposing a stable `room_id`. Provide all four selects for complete room settings. All these registry entries belong to the vacuum's device and platform.
4. `dyson_spot_scrub.start_rooms_with_settings` for Start, and `dyson_spot_scrub.save_room_settings` for saving edited preferences independently. Start can send an empty settings object; Save is not a prerequisite action for Start.
5. A ready robot and integration-side validation of room identity, settings and start readiness.

Battery, charging, map, station, robot preferences, drying and consumable entities are optional for room cleaning. Rectangle cleaning additionally requires the device registry, supported model, calibrated PNG camera, active map ID, explicit readiness and `clean_zone`. A generic HA vacuum with standard actions alone cannot provide the room planner.

For `N` rooms, the complete room interface consists of **1 vacuum + N switches + 4N selects**. Full optional controls add 2 battery/charging entities, 1 camera, 1 drying sensor, 6 station preference entities, 3 station buttons, 6 robot preference entities and up to 7 consumable sensors. Expose only consumables and controls actually supported by the device.

## 1. Dependency overview

Language selection (`auto`, `en`, `de`, `nl`, `fr`) is display-only and adds no integration requirement. Automatic follows the current Home Assistant user's language, falling back to English. Known option labels and card-owned status messages are translated; entity IDs, room/device names, raw option values, action names and payloads are unchanged. Unknown options and external error messages remain in their original language. See [Translations](translations.md).

| Feature | Required input | If absent or invalid |
|---|---|---|
| Device discovery | Configured `vacuum.*`, entity registry entry, Dyson platform and device association | No usable room discovery |
| Room list | Vacuum `rooms` attribute plus matching room switches | Missing/ambiguous rooms cannot be selected reliably |
| Native room identity | Matching room selects with consistent `room_id` attributes | Room cannot be started or saved |
| Room options | Four per-room selects with live `options` | Missing fields hidden; registered unavailable fields disabled |
| Save settings | `dyson_spot_scrub.save_room_settings` | Saving unavailable; no legacy fallback |
| Start clean | `dyson_spot_scrub.start_rooms_with_settings` plus ready vacuum and valid selected rooms | Start unavailable/rejected |
| Start veto / reason | Vacuum `ready_to_start`, `start_block_reason` | Legacy state/dock checks remain; no reliable mapping/finishing veto from these attributes |
| Pause / Resume / Home | Standard vacuum actions, feature bits and compatible live state | Corresponding button disabled |
| Activity details | Vacuum `dock_state`, `full_clean_action`, `fault` | Generic status or no additional detail |
| Battery / charging | Dedicated battery sensor and charging binary sensor | Unknown/missing indicator |
| Live map | Camera entity with HA camera-proxy image URL | Map placeholder; planning still works |
| Drying remaining time | Dedicated drying sensor, or legacy vacuum attributes if no sensor is registered | Remaining time unavailable; invalid totals hide the bar |
| Cancel drying | `dyson_spot_scrub.cancel_drying` | Cancel disabled |
| Station settings | Four switches, two selects, standard switch/select actions | Missing controls hidden; unavailable controls disabled |
| Station actions | Three button entities plus `button.press` | Missing buttons hidden; unavailable buttons disabled |
| Robot preferences | Three switches, one number and two time entities | Missing controls hidden; unavailable controls disabled |
| Consumables | Up to seven sensors identified by registry identity, then attributes | Missing controls hidden; supported invalid values show Unavailable |
| Rectangle cleaning | Supported device model, calibrated camera, map ID, explicit readiness, room-option capabilities and `clean_zone` | Zone tab absent or Start disabled |

## 2. Entity registry and identity

The card requests `config/entity_registry/list` through the HA WebSocket connection and reads live values from `hass.states`. Actions are discovered through `hass.services` and invoked through `hass.callService`.

It also requests `config/device_registry/list`. Device entries need `id` and `model` for zone-model detection. Failure to read the device registry does not prevent ordinary room discovery. Registry reads are refreshed approximately every 30 seconds while the card is connected. Registry metadata alone is insufficient: entity values and attributes must also exist in `hass.states`.

Entity registry entries must expose:

| Field | Contract |
|---|---|
| `entity_id` | Actual HA entity ID; user-renamed IDs are allowed |
| `platform` | Exactly `dyson_spot_scrub` |
| `device_id` | Same device as the configured vacuum |
| `unique_id` | Matching identity described below |
| `disabled_by` | Falsy for enabled entities |

The vacuum is configured as `entity: vacuum.example_robot`. Its expected unique ID is `<serial>_vacuum`. The card derives `<serial>` by removing the trailing `_vacuum`.

**Entity IDs are not assembled from a fixed prefix such as `kuche`.** Registry identity and device association are used. Home Assistant Areas are not used to identify Dyson rooms.

### Room name to switch mapping

The vacuum must provide an array of strings:

```yaml
rooms:
  - Küche
  - Flur
```

Each room normally maps to a `switch.*` with unique ID:

```text
<serial>_room_<room name lowercased, spaces replaced by underscores>
```

For example, `Küche` becomes `<serial>_room_küche`, **not** `<serial>_room_kuche`. The code does not transliterate accents, normalize punctuation or use HA Area names. An optional card configuration override is supported:

```yaml
room_entities:
  Küche: switch.my_renamed_kitchen_room
```

This overrides only the room-switch lookup. Selects still use that switch's actual unique ID as their prefix. Multiple eligible matches are ambiguous. A uniquely matched disabled room switch is omitted from the room list; card-level `excluded_rooms` hides an otherwise known room.

This initial name mapping remains a compatibility constraint: discovery is not exclusively room-ID-based. Room/map renames must keep the integration's room list and registry identities consistent, or use the explicit mapping. The card has no map selector or cross-map identity namespace.

### General availability

For most reads, the entity must exist, its state must not be `unknown` or `unavailable`, and `attributes.restored` must not be truthy. Disconnected HA also disables actions. Individual domains add validation below.

**Exception:** button timestamps and `unknown` before the first press are valid; see station actions.

## 3. Room entities and settings

### Room switches

| Item | Format / use |
|---|---|
| Domain | `switch` |
| Unique ID | `<serial>_room_<normalized name>` |
| State | `on` / `off`; `on` initializes selection when no local draft is active |
| Purpose | Room discovery, availability and initial selection |
| Writes | The card does **not** toggle these switches for Save or Start |

Selecting circles/checkboxes and changing room settings edit local memory only. Click order determines the `room_ids` array sent on Start; configured display order is separate.

### Per-room selects

All selects must share the room-switch unique-ID prefix:

| Card label | Data key | Select unique ID |
|---|---|---|
| Cleaning mode | `cleaning_mode` | `<room-switch-unique-id>_cleaning_mode` |
| Vacuum Power | `cleaning_strategy` | `<room-switch-unique-id>_cleaning_strategy` |
| Water level | `water_level` | `<room-switch-unique-id>_water_level` |
| Clean repetitions | `mop_repetitions` | `<room-switch-unique-id>_mop_repetitions` |

Each live select supplies:

```yaml
state: Vacuum and Mop
attributes:
  room_id: 12
  options:
    - Vacuum
    - Vacuum and Mop
    - Mop
    - Vacuum then Mop
```

- `options` must be an array of strings. Values are sent **exactly as supplied**, with case and spaces intact.
- `room_id` comes from the **select attributes**, not the switch. It must be non-null and non-empty when converted to a string. Numeric IDs and string IDs are accepted; outgoing IDs are strings.
- Discovery collects IDs from registered selects, including attributes on unavailable selects; conflicting IDs invalidate the room. Previously known IDs/options may be retained temporarily for unavailable selects in the same robot/map context. Before sending, at least one available select must confirm the one current ID. All four selects are needed for the full settings UI.
- Duplicate room IDs are rejected for affected selected/edited rooms.
- Missing/unavailable selects are not usable fields. Unrelated unavailable room switches do not block a valid job.
- The UI labels do not change the wire keys: **Vacuum Power still sends `cleaning_strategy`; Clean repetitions still sends `mop_repetitions`.**

Typical option sets (examples, not a fixed schema):

| Key | Examples |
|---|---|
| `cleaning_mode` | `Vacuum`, `Vacuum and Mop`, `Mop`, `Vacuum then Mop` |
| `cleaning_strategy` | `Auto`, `Boost`, `Quiet`, `Quick` |
| `water_level` | `Very Low`, `Low`, `Medium`, `High` |
| `mop_repetitions` | `One Pass`, `Two Passes` |

The exact mode strings `Vacuum` and `Mop` control conditional field visibility. Vacuum hides Water level; Mop hides Vacuum Power. Repetitions remain visible in every mode. `always_show_all_settings` bypasses this hiding. Hiding a setting does not reset its value or discard an existing edit. Modern slider stops follow the live option order; One Pass/Two Passes are displayed as 1×/2× without changing outgoing values.

## 4. Save and Start actions

These are two separate custom actions registered under `dyson_spot_scrub`. Payloads below are the actual service-data shape; `entity_id` is included in the data object.

### Save settings

```yaml
action: dyson_spot_scrub.save_room_settings
data:
  entity_id: vacuum.example_robot
  room_settings:
    "12":
      cleaning_mode: Mop
      water_level: High
    "10":
      mop_repetitions: Two Passes
```

Only edited fields that still differ from live HA values are sent. An empty settings payload causes no Save call. Room selection is not sent and remains local. Save must apply preferences **without starting cleaning**.

After action completion, the card waits up to **6 seconds** for the edited select values to appear in HA. On timeout it retains the draft and reports the problem; it does not retry automatically. Seeing an HA value is not proof of a robot protocol acknowledgement.

### Start clean

```yaml
action: dyson_spot_scrub.start_rooms_with_settings
data:
  entity_id: vacuum.example_robot
  room_ids: ["12", "10"]
  room_settings:
    "12":
      cleaning_mode: Mop
```

- `room_ids`: non-empty ordered array of unique string IDs.
- `room_settings`: object keyed by string room IDs; may be `{}`. It contains the complete changed draft, which can include edits to rooms not selected for this run.
- Unedited preferences stay under integration control.
- The integration must apply the supplied settings before starting the supplied room selection. The card makes **one action call**, with no preliminary Save, room-switch writes or start-button press.
- The integration translates labels into Dyson protocol values. The frontend does not build MQTT arrays or prescribe how many protocol messages are required. It sends selection order; actual robot execution remains integration/robot behavior.

The card validates selected/edited rooms and options against current discovery. It prevents simultaneous draft actions for the same vacuum within this loaded frontend module; this is not a lock across browsers or automations.

On a successful Start call the settings draft is cleared and the request is retained locally for room badges. If no active session is observed, the pending-start wait is **30 seconds**. There is no automatic resend. Badges describe this card's request, not confirmed room progress, and do not survive a page reload. External starts do not supply a room list to these badges.

## 5. Vacuum states, attributes and start readiness

### Main state

| HA state | Card behavior |
|---|---|
| `docked`, `idle` | Planner; new Start may be allowed subject to readiness checks |
| `cleaning` | Session view; Pause may be available |
| `paused` | Session view; Resume may be available |
| `returning` | Session view, Returning / mapping; new Start rejected |
| `error` | Session view and new Start rejected, except literal `ready_to_start: true` permits the planner and a new room Start |
| `unknown`, `unavailable`, missing/restored entity or disconnected HA | Unavailable view; actions disabled |
| Any other state | Waiting-for-status view; new Start rejected |

A local pending start or editor-only preview can temporarily override the view. Dock attributes can show station activity while the main state is still `docked`/`idle`; they do not independently force the session view.

### Consumed vacuum attributes

| Attribute | Type / recognized values | Purpose |
|---|---|---|
| `rooms` | Array of room-name strings | Discovery |
| `map_id` | Converted to string for room context; positive decimal ID for zone calibration | Separates drafts between active maps and validates rectangle commands |
| `friendly_name` | String | Robot subtitle |
| `supported_features` | Numeric bitmask | Session action availability |
| `ready_to_start` | Boolean; only literal `false` is an explicit veto | Block new Start |
| `start_block_reason` | String from table below | Explain veto |
| `dock_state` | `WASHING_MOP`, `DRYING_MOP`, `COLLECTING_DUST`; `IDLE` for no dock activity | Station status and interlocks |
| `full_clean_action` | `VACUUMING`, `MOPPING`, `VACUUMING_AND_MOPPING` | Live cleaning activity label while state is `cleaning` |
| `fault` | Non-empty string | Plain-text subtitle when Robot needs attention is shown |
| `fault_code` | Value included in the current fault identity | Resets dismissal when the reported fault changes |
| `drying_remaining_seconds` | Nonnegative finite number | Legacy drying sample, seconds |
| `drying_total_seconds` | Positive finite number | Legacy drying total, seconds |

Unknown cleaning phases display Cleaning. Unknown dock phases are not interpreted as a known dock cycle. Main-state error/paused status takes precedence over dock activity. Fault codes are not decoded by the card, and cleared faults are not retained.

Recognized `start_block_reason` values:

| Value | Meaning shown by the card |
|---|---|
| `disconnected` | Robot disconnected |
| `robot_fault` | Robot needs attention |
| `washing_mop` | Cleaning mop roller |
| `emptying_bin` | Emptying dust bin |
| `mapping_or_navigation` | Mapping / navigation in progress |
| `returning_or_finishing` | Returning to dock / finishing cleanup |
| `cleaning_job_active` | A cleaning job is still active |
| `waiting_for_ready_state` | Waiting for the robot to be ready |

Other reasons with `ready_to_start: false` show a generic not-ready message. String `"false"` is **not** a boolean veto. A reason alone does not veto Start. Literal `true` allows a new room job from `error` (a retained fault), but does not override washing/dust-collection restrictions or permit starts from other non-ready states.

New room Start requires connected HA, an available vacuum in `docked`/`idle` (or `error` with literal `ready_to_start: true`), valid selected rooms and the custom Start action. Roller washing and dust collection block Start even without the optional readiness attributes. Drying alone does not block Start, but `ready_to_start: false` still does.

**The integration must enforce readiness again when executing the action.** UI checks cannot protect calls from other clients or changes between rendering and execution.

## 6. Pause, Resume, Home and Cancel drying

All these calls carry `data: {entity_id: vacuum.example_robot}`.

| Card button | Action | Required feature bit | Allowed vacuum state / additional checks |
|---|---|---|---|
| Pause | `vacuum.pause` | `4` | `cleaning` |
| Resume | `vacuum.start` | `8192` | `paused` |
| Home | `vacuum.return_to_base` | `16` | `cleaning`, `paused`, `returning`, `error` |
| Cancel drying | `dyson_spot_scrub.cancel_drying` | None | Available vacuum with `dock_state: DRYING_MOP` |

The action must be registered. Pause/Resume/Home additionally require no recognized dock cycle (including drying). Home is disabled when docked. These are individual mask bits, not required complete `supported_features` values.

Resume must continue the paused job; new room jobs use the custom Start action instead. Home/queue cancellation and cancel-drying behavior belong to the integration. The card waits for telemetry rather than changing the robot state optimistically. It does not call `vacuum.stop`.

## 7. Battery and map

| Entity | Unique ID | Live data |
|---|---|---|
| `sensor.*` | `<serial>_battery` | Numeric state in 0–100; rounded to integer percent |
| `binary_sensor.*` | `<serial>_charging` | `on` / `off`; enables charging bolt |
| `camera.*` | `<serial>_floor_map` | Available state, `attributes.entity_picture` |

Battery uses a dedicated sensor, not the vacuum's battery attribute. Low is below 20%, medium below 50%, otherwise high. Missing charging data does not imply charging.

The camera's optional `robot_bumper_color` attribute may provide a six-digit hexadecimal color (`#RRGGBB`) for the robot illustration during cleaning. Unavailable camera data or invalid colors use the existing neutral fallback.

`camera_entity` may explicitly select another camera on the same Dyson device/platform. The image path must start with `/api/camera_proxy/`; the card uses the HA-provided URL and token. Responses must have an `image/*` content type and decode as an image. The session map reads no raw map JSON, furniture, geometry or room-area attributes; rectangle selection separately reads `map_calibration` as specified below.

The camera is refreshed about every **5 seconds**, only when the session/preview is live and the map is visible. Fetch timeout is **10 seconds**. On failure, a last valid image may remain with an explanatory caption. Rotation (0/90/180/270°) is local rendering, not an integration action. Tokens must not be copied into card configuration or documentation.

## 8. Drying telemetry

Preferred entity: `sensor.*`, unique ID **`<serial>_drying_remaining`**. Its entity ID may be named `sensor.example_robot_mop_drying_time_remaining`; that name is not the discovery key.

```yaml
state: "10680"
attributes:
  unit_of_measurement: s
  device_class: duration
  state_class: measurement
  total_seconds: 10800
  updated_at: "2026-11-06T12:00:00Z"
```

The card consumes the numeric string state as remaining seconds and numeric `total_seconds` for the bar. Units/device class/state class are descriptive, not discovery criteria. `updated_at` and legacy `drying_updated_at` are **not currently used** for countdown or freshness checks.

- Display requires an available vacuum with `dock_state: DRYING_MOP`.
- Time is the last reported sample, rounded up to whole minutes and formatted `hh:mm`; no local countdown is extrapolated.
- Bar width = `remaining / total * 100`, representing **time remaining**. Total must be positive and finite, and remaining must be within 0–total. Invalid totals hide the bar without necessarily hiding a valid remaining-time value.
- Zero seconds does not infer that drying has ended; the dock status ends the display.
- Only if **no matching sensor is registered** does the card use numeric vacuum `drying_remaining_seconds` / `drying_total_seconds` attributes.
- A registered but disabled, ambiguous, unavailable, missing-live-state or malformed sensor prevents fallback to potentially stale vacuum data.

## 9. Station settings and dock buttons

### Immediate station preferences

| Domain | Key | Expected unique ID |
|---|---|---|
| `switch` | `hot_water_mopping` | `<serial>_station_hot_water_mopping` |
| `switch` | `cleaning_solution` | `<serial>_station_cleaning_solution` |
| `switch` | `extended_roller_preparation` | `<serial>_station_extended_roller_preparation` |
| `switch` | `hot_water_self_cleaning` | `<serial>_station_hot_water_self_cleaning` |
| `select` | `self_cleaning_frequency` | `<serial>_station_self_cleaning_frequency` |
| `select` | `roller_drying_duration` | `<serial>_station_roller_drying_duration` |

Switches require `on`/`off` and registered `switch.turn_on` and `switch.turn_off`. Selects require an `options` array of strings, a current state included in it and `select.select_option`.

Unlike room edits, changes are sent immediately:

```yaml
action: switch.turn_on
data:
  entity_id: switch.example_station_cleaning_solution
```

```yaml
action: select.select_option
data:
  entity_id: select.example_station_roller_drying_duration
  option: "3 hours"
```

Typical frequency options are `After each room`, `Every 15 minutes`, `Every 30 minutes`, `Only as needed`. Typical drying durations are `3 hours`, `4 hours`, `5 hours`. The editor uses live options rather than hardcoding these lists.

The compact status bar reuses these entities; it needs no additional sensors. Its frequency abbreviations recognize the four strings above. Drying-duration abbreviations recognize 3/4/5 followed by `h` or `hours` (case-insensitive, optional whitespace). Other valid select options remain usable but may have no compact indicator.

The cleaning-solution indicator also reads the consumable refill sensor below: refill warning takes priority; otherwise enabled uses the normal bottle and disabled the muted bottle.

### Dock action buttons

| Label | Domain | Unique ID |
|---|---|---|
| Empty dust bin | `button` | `<serial>_empty_bin` |
| Wash mop roller | `button` | `<serial>_wash_mop` |
| Dry mop roller | `button` | `<serial>_dry_mop` |

```yaml
action: button.press
data:
  entity_id: button.example_robot_dry_mop
```

Each press targets exactly one entity once. States are usually timestamp strings; `unknown` before the first press is also valid. Missing, disabled, ambiguous, restored or `unavailable` entities cannot be pressed. **There is no `idle`/`ready` button-state requirement.**

The integration supplies operational availability and must enforce dock-command safety. The card does not apply the vacuum-start readiness policy to these buttons. In-flight station requests disable station controls; completion is not treated as robot confirmation. No automatic retries are made.

## 10. Consumable sensors

Each must be an enabled `sensor.*` on the same Dyson device/platform. Exact unique IDs take precedence over attribute matching, including when the exact sensor is unavailable. Only when no enabled exact match exists does discovery fall back to `attributes.consumable_type`. Multiple candidates are ambiguous. The required `value_kind` is checked in either case; exact identity does not require `consumable_type`.

| `consumable_type` | Preferred unique ID |
|---|---|
| `brushBar` | `<serial>_consumable_brush_bar_usage` |
| `mopRoller` | `<serial>_consumable_mop_roller_usage` |
| `mopPad` | `<serial>_consumable_mop_pad_usage` |
| `sideBrushes` | `<serial>_consumable_side_brushes_usage` |
| `robotFilter` | `<serial>_consumable_robot_filter_usage` |
| `dockFilter` | `<serial>_consumable_dock_filter_usage` |
| `cleaningSolution` | `<serial>_consumable_cleaning_solution` |

| Label | `consumable_type` | `value_kind` | State |
|---|---|---|---|
| Brush bar | `brushBar` | `usage_percent` | Used percentage, 0–100 |
| Mop roller | `mopRoller` | `usage_percent` | Used percentage, 0–100 |
| Mop pad | `mopPad` | `usage_percent` | Used percentage, 0–100 |
| Side brushes | `sideBrushes` | `usage_percent` | Used percentage, 0–100 |
| Robot filter | `robotFilter` | `usage_percent` | Used percentage, 0–100 |
| Dock filter | `dockFilter` | `usage_percent` | Used percentage, 0–100 |
| Cleaning solution | `cleaningSolution` | `refill_status` | `ok` or `refill_required` |

```yaml
state: "9"
attributes:
  consumable_type: robotFilter
  value_kind: usage_percent
  unit_of_measurement: "%"
```

Usage is **consumed life**, not remaining life. The card displays `100 - usage`, rounded to one decimal place. Remaining life at or below 25% is a warning; at or below 10% it is low/red. A single discovered sensor defines support; invalid/unavailable values show Unavailable. Missing or ambiguous sensors are not supported and their controls are hidden.

Cleaning solution displays Ready to use / Refill required; its Enabled/Disabled subtitle comes separately from the station switch. Refill required and low-life consumables highlight Info. `ioniserCartridge` is not consumed by this card.

## 11. What this card does not require or implement

- No global cleaning-mode select or original Vacuum Start button; there is no legacy start adapter fallback.
- No separate docked/fault binary sensor, raw fault-code entity or room-area sensor is read by the current card.
- No direct Dyson login, token storage, MQTT subscription, raw preference array or robot API call.
- No scheduler/calendar, map switching, cross-map room selection or estimated cleaning duration.
- No confirmed per-room progress or integration-provided active-room list consumed for badges.
- No background automation from the editor simulation. It only changes the current preview and suppresses action calls.

## 12. Integration verification checklist

1. Verify all required registry identities belong to the selected robot; rename entity IDs and confirm discovery still works.
2. Verify the vacuum room names match switch identities and every room's selects report one consistent native ID.
3. Edit several room options: no service calls should occur before Save/Start. Confirm exact option labels and ordered string IDs in the batch payload.
4. Save without cleaning and reflect values in HA; Start with changed settings in one action. Test backend readiness vetoes independently of the UI.
5. Exercise cleaning, paused, returning, error, dock washing, collection, drying and ready transitions. Check features/actions against allowed session controls.
6. Verify missing optional entities degrade individually. In particular, unavailable registered drying sensors must not resurrect legacy values, and button `unknown` must remain valid.
7. Check camera proxy images, battery, consumable usage direction, station option updates and dock button availability.
8. Test concurrent external changes and map changes in the integration. The frontend cannot guarantee transactional updates across the Dyson app, automations or other browsers.


## Zone cleaning (v1.4.0)

Zone cleaning requires **UNsync3D Dyson Spot+Scrub integration v2.1.0 or newer**,
including the `dyson_spot_scrub.clean_zone` action and camera calibration described below.

- The configured vacuum must expose `map_id` and `ready_to_start: true`.
- The same-device camera must expose `map_calibration`: version 1, `map_id`,
  units `m`, positive `image_width`, `image_height`, `pixels_per_metre`,
  nonnegative `padding`, finite `min_x` and `max_y`, and `image_sha256`.
- The camera proxy must return the original PNG. The card removes width/height
  query parameters and verifies the dimensions and SHA-256 before use.
- `dyson_spot_scrub.clean_zone` receives one `entity_id`, the matching `map_id`,
  and `rectangle: [x_min, y_min, x_max, y_max]` in robot metres.
- Settings: `clean_type` is `vacuum`, `vacuumAndMop`, `mop` or `vacuumThenMop`;
  `cleaning_strategy` is `auto`, `boost`, `quiet` or `quick`; `water_level` is
  `veryLow`, `low`, `medium` or `high`. The card uses `auto` for Mop and `low`
  for Vacuum's unused water setting.
- `mop_passes` is 1 or 2 in every mode; `dry_passes` stays at 1. This mapping
  follows Spot+Scrub hardware tests. In Vacuum then Mop, repetitions affect
  only mopping. Other models require separate verification.
- All zone settings stay local until Start. No room preferences are written,
  and failed commands are not automatically retried.

See [zone cleaning details](zone-cleaning.md) for geometry and validation.


### Device-specific controls

Registered, enabled entities on the selected device define supported controls. Missing controls are hidden; unknown/unavailable states disable existing controls without removing them. Room and station select options come from the entity attributes. Consumables support both `mopRoller` and `mopPad`; UV/ioniser consumables are not assumed. The subtitle uses the vacuum entity's `friendly_name`. Zone UI is currently restricted to device registry model `804`/`804A`/`RB05`, matching the integration's RB05-only support; R1/R2 and unknown models do not get the Zone tab. Device-registry access is needed to identify this support. Zone options are restricted to known protocol values also offered by the device's room selects; this does not claim zone support for other models.

The exact model matcher is case-insensitive `^(804[A-Z]?|RB05)$`: it also accepts other single-letter suffixes after `804`. It does not infer support from a friendly model name containing those characters.

## 13. Robot preferences

All entries use the same platform/device association as the vacuum. Writes are immediate, independent of room Save/Start, and do not enter the room draft.

| Key | Domain | Unique ID | Live state / write |
|---|---|---|---|
| `voice_prompts` | `switch` | `<serial>_setting_voice_prompts` | `on`/`off`; switch action |
| `volume` | `number` | `<serial>_setting_volume` | Numeric 0–100; writes integer 0–100 in steps of 10 |
| `child_lock` | `switch` | `<serial>_setting_child_lock` | `on`/`off`; switch action |
| `do_not_disturb` | `switch` | `<serial>_setting_do_not_disturb` | `on`/`off`; switch action |
| `do_not_disturb_start` | `time` | `<serial>_setting_do_not_disturb_start` | `HH:mm` or `HH:mm:00` |
| `do_not_disturb_end` | `time` | `<serial>_setting_do_not_disturb_end` | `HH:mm` or `HH:mm:00` |

Volume requires an available voice-prompts switch set to `on`. DND times require an available DND switch set to `on`. Times use 24-hour hours 00–23 and minutes 00–59; the card sends `time: "HH:mm:00"` to `time.set_value`. Volume sends `value: 60`, for example, to `number.set_value`. Switches send `entity_id` to `switch.turn_on`/`switch.turn_off`; both switch actions must be registered for a switch control to be available. The card does not read number `min`, `max`, `step` attributes, timezone metadata or DND scheduling semantics; the integration must accept and interpret the documented values.

## 14. Complete outbound action index

The card calls only the following actions. All `entity_id` fields are in the service-data object, not a separate target object. Service registration is checked by name; the card does not negotiate the service schema.

| Action | Service data | Used for |
|---|---|---|
| `dyson_spot_scrub.save_room_settings` | `entity_id`, `room_settings` | Changed room preferences without starting |
| `dyson_spot_scrub.start_rooms_with_settings` | `entity_id`, `room_ids`, `room_settings` | One room-job request |
| `dyson_spot_scrub.clean_zone` | `entity_id`, `map_id`, `rectangle`, `clean_type`, `cleaning_strategy`, `water_level`, `mop_passes`, `dry_passes` | One rectangle-job request |
| `dyson_spot_scrub.cancel_drying` | `entity_id` | Cancel active mop drying |
| `vacuum.pause` | `entity_id` | Pause active job |
| `vacuum.start` | `entity_id` | Resume paused job |
| `vacuum.return_to_base` | `entity_id` | Home |
| `switch.turn_on` / `switch.turn_off` | `entity_id` | Station/robot preferences only |
| `select.select_option` | `entity_id`, `option` (exact string) | Station preferences only |
| `number.set_value` | `entity_id`, `value` (number) | Robot volume |
| `time.set_value` | `entity_id`, `time` (string) | Robot DND times |
| `button.press` | `entity_id` | Empty bin / wash mop / dry mop |

No response data is parsed from these actions. Rejections must reject the service call so the card can display the error. A resolved call is not proof of physical execution. State changes must be published through HA. The integration must enforce device support, availability and command interlocks for every caller. The card does not roll back already-applied backend changes if a later step fails, and has no cross-client transaction or command acknowledgement protocol.

## 15. Exact rectangle calibration and validation

Example camera attribute structure (the hash below is a placeholder and must be replaced with the SHA-256 of the actual returned PNG bytes):

```yaml
map_calibration:
  version: 1
  map_id: "123"
  units: m
  image_width: 1000
  image_height: 800
  pixels_per_metre: 100
  padding: 20
  min_x: -4.0
  max_y: 6.0
  image_sha256: "<64 lowercase hexadecimal characters>"
```

`version` must be numeric `1`. Dimensions and scale must be positive finite numbers; padding must be nonnegative and finite; origins must be finite numbers. Numeric strings are not accepted for these fields. The map ID must stringify to positive decimal digits (`/^\d+$/` and numeric value > 0). The image hash must match `/^[a-f0-9]{64}$/`. Both vacuum `map_id` and the camera's current calibration map ID must match the frozen calibration map ID.

For an unrotated original image pixel `(px, py)`, robot coordinates are:

```text
x = min_x + (px - padding) / pixels_per_metre
y = max_y - (py - padding) / pixels_per_metre
```

The card reverses display rotation before transforming all four rectangle corners, then sends their minima/maxima. The rectangle must remain inside normalized image coordinates 0–1 and have positive width/height. The UI enforces at least **0.55 m per side**, a trial UI limit, not a confirmed firmware constraint. No obstacle/reachability validation occurs.

Zone images require successful HTTP responses, PNG signature bytes, at most **20 MiB**, matching decoded dimensions and matching SHA-256. Unlike the session map, zone loading checks PNG bytes rather than requiring a PNG content-type header. Width/height URL parameters are removed. There is a 12-second load deadline, up to three image fetch attempts, and up to eight 150-ms calibration polls per image, to allow calibration to be published after an image request. These are read retries; cleaning actions are never automatically retried.

The Zone tab requires a supported device-registry model. Start also requires a trusted same-platform/same-device camera, connected HA, non-preview mode, a verified image, available vacuum/camera states, and literal `ready_to_start: true`. Room readiness's fallback to `docked`/`idle` does not apply here. The zone readiness helper relies on that boolean rather than independently applying room-state/dock interlocks, so the integration must report it accurately and revalidate it at execution.

Zone option capabilities use the intersection of known labels across the discovered room selects for each field (including discovered excluded rooms). A field is available only if all its discovered selects are available. Known choices and protocol values are in `ZONE_CHOICES` in `src/adapters/spot-scrub.js`; the mapping is the one listed above. Missing/unknown option sets cannot be treated as evidence for unsupported protocol values. Without a capability contract, the card does not infer rectangle support from room-cleaning support.

## 16. Frontend-only configuration and source audit

Only `entity`, `camera_entity` and `room_entities` choose integration entities. `room_entities` overrides room-switch lookup only; it cannot change platform, device, select identity or action names. `excluded_rooms` and `room_order` contain room-switch entity IDs. No YAML setting chooses an integration domain or remaps services/options.

Although `unsupported_settings` accepts legacy values `disabled` and `hidden` during validation, normalization currently forces `hidden`; it cannot enable controls for missing entities.

Title, theme, language, header illustration, status visibility, percentage visibility, hidden status items, setting visibility, camera visibility/rotation and dimension units affect presentation only. `zone_dimension_unit: auto` uses `hass.config.unit_system.length`; `cm`/`inch` affect labels, while outbound geometry always uses metres. No additional integration entity is needed for localization or display units. Hiding the session camera does not remove the zone camera requirement. Room/zone drafts, click order and request badges are frontend memory and are lost on reload.

| Source | Contract responsibility |
|---|---|
| `src/adapters/spot-scrub.js` | Platform, discovery, IDs, settings, readiness, features, action data, optional entity validation and zone options/model gate |
| `src/integration.js` | Supplies the existing Spot+Scrub adapter only |
| `src/shared.js` | Configuration validation and generic display helpers |
| `src/card.js` | Registry reads, room draft lifecycle, Save confirmation, pending-start timeout, UI capability gating |
| `src/editor.js` | Configuration UI, discovery and preview behavior |
| `src/map.js` | Session camera proxy fetch and refresh |
| `src/zone-geometry.js` | Calibration validation, image hashing and geometry |
| `src/core.js`, `src/zone-core.js` | Compatibility exports delegating to the shared helpers and adapter |
| `src/zone.js` | Verified PNG loading, selection, capabilities and `clean_zone` dispatch |

For backend acceptance, exercise every supported row of the action index and entity tables, including renamed entity IDs, missing/disabled/duplicate entries, conflicting IDs, unavailable controls, map changes, live option changes, backend rejections and asynchronous state publication. Run the repository's `npm run check` for frontend regression coverage. Live HA and robot tests are still required to establish compatibility; passing frontend fixtures alone cannot establish it.
