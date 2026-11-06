# Integration contract — card v1.3.0

This document describes what the **current card actually reads and sends**, based on `src/core.js`, `src/card.js`, `src/editor.js` and `src/map.js`. It is a frontend contract, not a specification of Dyson's MQTT protocol or a guarantee about the integration's internal implementation.

Both Modern and Classic use this same contract. The documented minimum integration version is **UNsync3D Dyson Spot+Scrub v1.5.0**; optional features require the corresponding entities/actions in the installed version.

## 1. Dependency overview

Language selection (`auto`, `en`, `de`) is display-only and adds no integration requirement. Automatic follows the current Home Assistant user's language, falling back to English. Known option labels and card-owned status messages are translated; entity IDs, room/device names, raw option values, action names and payloads are unchanged. Unknown options and external error messages remain in their original language. See [Translations](translations.md).

| Feature | Required input | If absent or invalid |
|---|---|---|
| Device discovery | Configured `vacuum.*`, entity registry entry, Dyson platform and device association | No usable room discovery |
| Room list | Vacuum `rooms` attribute plus matching room switches | Missing/ambiguous rooms cannot be selected reliably |
| Native room identity | Matching room selects with consistent `room_id` attributes | Room cannot be started or saved |
| Room options | Four per-room selects with live `options` | Missing fields are disabled or hidden according to card configuration |
| Save settings | `dyson_spot_scrub.save_room_settings` | Saving unavailable; no legacy fallback |
| Start clean | `dyson_spot_scrub.start_rooms_with_settings` plus ready vacuum and valid selected rooms | Start unavailable/rejected |
| Start veto / reason | Vacuum `ready_to_start`, `start_block_reason` | Legacy state/dock checks remain; no reliable mapping/finishing veto from these attributes |
| Pause / Resume / Home | Standard vacuum actions, feature bits and compatible live state | Corresponding button disabled |
| Activity details | Vacuum `dock_state`, `full_clean_action`, `fault` | Generic status or no additional detail |
| Battery / charging | Dedicated battery sensor and charging binary sensor | Unknown/missing indicator |
| Live map | Camera entity with HA camera-proxy image URL | Map placeholder; planning still works |
| Drying remaining time | Dedicated drying sensor, or legacy vacuum attributes if no sensor is registered | Remaining time unavailable; invalid totals hide the bar |
| Cancel drying | `dyson_spot_scrub.cancel_drying` | Cancel disabled |
| Station settings | Four switches, two selects, standard switch/select actions | Unavailable controls disabled |
| Station actions | Three button entities plus `button.press` | Unavailable buttons disabled |
| Consumables | Six sensors identified by attributes | Individual values show Unavailable |

## 2. Entity registry and identity

The card requests `config/entity_registry/list` through the HA WebSocket connection and reads live values from `hass.states`. Actions are discovered through `hass.services` and invoked through `hass.callService`.

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
- All usable selects for a room must agree on one ID. Conflicting IDs invalidate that room's settings. At least one usable select is needed to discover an ID; all four are needed for the full settings UI.
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
| `error` | Session view, Robot needs attention; new Start rejected |
| `unknown`, `unavailable`, missing/restored entity or disconnected HA | Unavailable view; actions disabled |
| Any other state | Waiting-for-status view; new Start rejected |

A local pending start or editor-only preview can temporarily override the view. Dock attributes can show station activity while the main state is still `docked`/`idle`; they do not independently force the session view.

### Consumed vacuum attributes

| Attribute | Type / recognized values | Purpose |
|---|---|---|
| `rooms` | Array of room-name strings | Discovery |
| `supported_features` | Numeric bitmask | Session action availability |
| `ready_to_start` | Boolean; only literal `false` is an explicit veto | Block new Start |
| `start_block_reason` | String from table below | Explain veto |
| `dock_state` | `WASHING_MOP`, `DRYING_MOP`, `COLLECTING_DUST`; `IDLE` for no dock activity | Station status and interlocks |
| `full_clean_action` | `VACUUMING`, `MOPPING`, `VACUUMING_AND_MOPPING` | Live cleaning activity label while state is `cleaning` |
| `fault` | Non-empty string | Plain-text subtitle when Robot needs attention is shown |
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

Other reasons with `ready_to_start: false` show a generic not-ready message. String `"false"` is **not** a boolean veto. A reason alone does not veto Start. Literal `true` does not override state or dock restrictions.

New Start requires connected HA, an available vacuum in `docked`/`idle`, valid selected rooms and the custom Start action. Roller washing and dust collection block Start even without the optional readiness attributes. Drying alone does not block Start, but `ready_to_start: false` still does.

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

`camera_entity` may explicitly select another camera on the same Dyson device/platform. The image path must start with `/api/camera_proxy/`; the card uses the HA-provided URL and token. Responses must have an `image/*` content type and decode as an image. No raw map JSON, furniture, geometry or room-area attributes are read.

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

These are discovered by **attributes**, not fixed entity names or unique-ID suffixes. Each must be a single enabled `sensor.*` on the same Dyson device/platform.

| Label | `consumable_type` | `value_kind` | State |
|---|---|---|---|
| Brush bar | `brushBar` | `usage_percent` | Used percentage, 0–100 |
| Mop roller | `mopRoller` | `usage_percent` | Used percentage, 0–100 |
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

Usage is **consumed life**, not remaining life. The card displays `100 - usage`, rounded to one decimal place. Remaining life at or below 25% is a warning; at or below 10% it is low/red. Missing, invalid or ambiguous data shows Unavailable.

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
