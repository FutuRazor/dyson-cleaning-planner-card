# Experimental hass-dyson adapter

Card **v1.5.0** includes an experimental adapter for **Spot+Scrub / RB05 through [cmgrayb/hass-dyson](https://github.com/cmgrayb/hass-dyson)** alongside the original Spot+Scrub adapter. Source review and offline HA fixtures cover the implemented interface. Maintainer live tests confirmed Save with entity readback, room starts, Pause/Resume/Home, battery percentage, separate vacuum/mop coverage, dock activity, drying remaining time, the washing start interlock and starting during drying. The card is a stable release; hass-dyson support remains experimental, particularly for other robot models and installations.

## Setup and integration selection

Choose **Integration → hass-dyson (experimental)** in the visual editor, then choose the robot. Alternatively:

```yaml
type: custom:dyson-cleaning-planner-card
integration: hass_dyson
entity: vacuum.your_hass_dyson_robot
```

`integration` accepts `auto` (also the behavior when omitted), `dyson_spot_scrub`, or `hass_dyson`. Initial automatic discovery prefers Spot+Scrub when both have eligible vacuums. An explicitly configured robot determines the adapter in Automatic mode, including while offline. Choosing an explicit integration filters the editor's robot list; changing integrations resets room visibility/order and image overrides. While the registry loads, the editor preserves eligible selections from `hass.entities`; a completed empty registry overrides this metadata fallback. A mismatched YAML integration/entity pair cannot discover or operate another integration's entities, including Pause/Resume/Home. No runtime fallback switches robots after an error.

## Implemented functions

| Feature | Upstream interface |
|---|---|
| Robot and state | `vacuum.*`, unique ID `<serial>_vacuum`, platform `hass_dyson`, device association |
| Rooms | Per-room selects with native `room_id`; registry original names supply room labels |
| Cleaning mode | `<serial>_room_<id>_cleaning_mode` |
| Vacuum power | `<serial>_room_<id>_vacuum_power` |
| Water | `<serial>_room_<id>_hydration` |
| Repetitions | `<serial>_room_<id>_wash_repetitions` |
| Save preferences | `hass_dyson.set_room_cleaning_modes` with `device_id` and `room_modes` |
| Start selected rooms | `hass_dyson.start_zone_clean` with `device_id`, explicit `map`, and `zones` |
| Pause / Resume / Home | `vacuum.pause`, `vacuum.start`, `vacuum.return_to_base`, according to state/features |
| Battery / charging | `<serial>_robot_battery`, `<serial>_robot_battery_charging` |
| Dock status / start interlock | Sensor `<serial>_robot_dock_state`; `IDLE` or `DRYING_MOP` permits a new Start when the robot is otherwise ready |
| Dock remaining time | Timestamp sensor `<serial>_robot_dock_timer_end`; displayed while washing/drying |
| Consumables | `<serial>_<consumableType>_life`, already **remaining** percent; no inversion |
| Refill status | Binary sensor `<serial>_cleaning_solution`: `on` means refill required, `off` means ready |
| Session image | Default `image.*` with unique ID `<serial>_clean_coverage`; falls back to `_floor_plan`, then `_dust_map` if not registered |

Room entity IDs used for display order/exclusions are actual **select IDs**, normally the cleaning-mode select, rather than switches. The adapter never writes those selects individually. The card shows the same canonical labels as the Spot+Scrub adapter; it translates them back to upstream slugs only when sending. See the [mapping table](hass-dyson-compatibility.md#spot-scrub-settings-translation). Unknown native values are not guessed.

The `clean_coverage` image already contains **two panels, one vacuumed and one mopped**. The card displays the complete returned image without selecting/cropping one panel. In the editor, **Map image** can choose another enabled same-device `image.*`; the YAML key remains `camera_entity` for compatibility. Images use the HA-provided `/api/image_proxy/` URL/token, the same refresh/timeout/rotation behavior as the session camera, and no saved credentials. An unavailable registered preferred image is not silently replaced with an older map.

## Experimental robot schedules

Tested against the hass-dyson `v0.40.0-beta.6` source contract. The card discovers the enabled same-device sensor with unique ID `<serial>_jdm_schedules` and requires `hass_dyson.set_robot_schedule`. Older versions and the original Spot+Scrub adapter keep schedule controls hidden. A registered but unavailable sensor keeps the view visible and disables writes.

The room footer groups a calendar-plus icon and Save into its left half; Start occupies the right half. The calendar icon opens a dialog requiring weekdays and a local start time in Home Assistant's time zone. Confirm sends one `set_robot_schedule` action with `device_id`, `days`, `time`, and optional `room_modes` translated from the local room-settings draft. It neither saves general preferences nor starts cleaning, and the draft remains available for a later Save or Start.

Time selection uses two scrollable hour/minute lists inside the dialog. Click a value in each list and choose Apply time; Cancel retains the previously applied time. The schedule cannot be submitted while time selection is open. Arrow keys and Home/End navigate a time list; Escape cancels time selection first, then closes the schedule dialog. No browser-native time popup extends beyond the card.

**Room-selection test limitation:** the integration includes every room's preferences in a new schedule but preserves each row's stored selection flag (index 8). Including a room's preferences does not select it for cleaning. The action does not accept an explicit selection, so a new schedule can select only Hall if that is the robot's stored selection. The card's room selection, exclusions and order are not passed to this action. A warning asks the user to check the selected rooms in MyDyson after creation. Edited room settings are passed directly; other settings are inherited. The card requires an unambiguous room map and checks the draft's identity before dispatch.

The Schedules tab reads `schedules` from the sensor attributes, including disabled schedules. Each row shows time, localized weekdays, a toggle, Edit and, when supported, Delete. In beta.6, `describe_order().rooms` includes names from all preference rows without checking selection flags, and the sensor does not expose those flags. The card marks room selection as unavailable instead of showing this list as the selected plan. Correct selected-room names and explicit room selection for new schedules require upstream integration changes. Toggles send only `device_id`, `schedule_id` and `enabled`. Editing sends only `device_id`, `schedule_id`, `days` and `time`, preserving the integration's existing room settings and enabled state. Room-plan editing and one-time/date-specific schedule creation are outside this UI.

Displayed state always follows Home Assistant; a completed action does not invent an updated schedule or automatically retry. An `in_sync: false` warning explains that the list may be incomplete and suggests switching existing schedules off and on in MyDyson while connected. A failed request retains the dialog and warns to check MyDyson before retrying. Writes share the device lock used by room Save/Start. Card-editor previews do not send schedule actions.

The per-entry trash icon appears only when `hass_dyson.delete_robot_schedule` is available. It opens a confirmation naming the schedule's time and weekdays, with Cancel initially focused. Confirmation sends exactly `device_id` and `schedule_id` through that action. It removes the schedule on the robot, not just its card row. The row stays until HA reports the deletion; pending requests cannot be repeated or dismissed, failures retain the dialog, and other room/schedule writes share the same lock. No real schedule is deleted by the automated tests.

Edit and Delete are stacked on the right, with the enable switch centered to their left. The card grows naturally for up to four schedules. From five schedules onward, only the schedule rows scroll in a viewport sized to the first four rows; tabs and notices stay outside that viewport. The limit adapts to card width and language, and HA updates and schedule dialogs retain list scroll position.

The integration currently writes a UTC offset when a schedule is changed. This card does not implement daylight-saving-time migration; verify actual execution across clock changes separately.

Run `node tests/schedules-browser.mjs` with Playwright for the simulated UI flow. Live acceptance: create one schedule with safe settings, verify its days/time and actual selected rooms in MyDyson, toggle it, edit its time, and confirm that general room preferences and the card's local draft remain unchanged. Repeat after reload; check the empty, disconnected and incomplete-list states. Fixtures deliberately model different selected rooms in MyDyson and unfiltered room names in the HA sensor. No real robot schedule was created during automated validation.

## Map and readiness requirements

Upstream room selects expose room IDs but no map ID. The adapter currently requires **one unambiguous known persistent map** to start rooms. It matches the registry's map-qualified button identities `<serial>_clean_zone_<map-id>_<room-id>` to the room selects; it does not press these buttons. Missing map-qualified entries, unmatched room IDs, or multiple known maps disable Start. Save-only preferences still use the integration's current-map action. Multi-map selection is outside this first implementation.

New room Start also requires connected HA, an available vacuum, and upstream `raw_state` equal to `INACTIVE_CHARGED`, `INACTIVE_CHARGING`, or `FULL_CLEAN_FINISHED`, with a compatible HA state. Mapping, mid-job charging, faults and missing raw telemetry do not authorize a new job. `FULL_CLEAN_FINISHED` can be mapped to HA `returning` upstream, so this one explicit finished state returns to the planner.

The enabled same-device dock-state sensor must report **`IDLE` or `DRYING_MOP`** for a new room Start. The maintainer confirmed that hass-dyson can start a new clean while drying; the card therefore permits the normal room-start action during drying without sending a separate cancellation command. `WASHING_MOP` and `COLLECTING_DUST` still display their activity and block Start. Missing, disabled, duplicate, unavailable or unknown dock readings also block a new job. Drying does not override the robot-state/readiness checks above. The interlock is checked before any Save-and-Start operation and again against the latest HA snapshot after Save. Standard session controls are disabled during recognized dock cycles; missing dock data alone does not prevent Pause/Home for an otherwise valid active session. Enable the integration's **Dock state** entity if it is disabled. The upstream backend must still enforce operational safety independently for other clients and changes after dispatch.

Washing/drying activity remains visible even when the vacuum also reports `error` or `paused`; a modern fault overlay does not replace the independently reported dock activity. The **Dock timer end** timestamp is interpreted with its explicit UTC/offset timezone. The card displays `max(0, end - now)` rounded up to minutes as `hh:mm` and updates the label locally once per second while visible. This refresh sends no robot commands or extra image requests. The timer is stopped when the card is disconnected. During washing, invalid/missing/ambiguous or unavailable timer entities hide the remaining-time suffix while retaining the known dock activity. During drying, the existing unavailable-time indication remains visible when timer data is missing. Reaching zero does not imply that the dock cycle ended: only the dock state controls that. There is no percentage bar without a reported total duration, and no unsupported cancel-drying button.

## Save and Start are separate operations

Edits remain local until Save or Start. Save translates only fields still different from current HA values and calls `set_room_cleaning_modes` once. The backend performs robot preference readback; the card's existing Save confirmation waits for the translated select values to appear in HA.

Start with edits calls Save first, including edited unselected rooms, then revalidates the **latest** HA snapshot, registry, map/room identity, card configuration and readiness before calling `start_zone_clean`. A card removed during Save cannot complete Start, even if it is reattached before Save finishes. No global cleaning-mode override is sent, preserving mixed per-room modes. Start without edits calls only `start_zone_clean`. Previously finished-job telemetry remains non-live during subsequent dock activity and cannot confirm a new Start.

This is **not an atomic transaction**. A successful Save remains applied if Start fails. The card reports that distinction, keeps the local draft for review, and never automatically retries either command. Another client can intervene between the actions; the frontend lock is per resolved HA device ID in this loaded module and survives vacuum entity renames. The backend's room-start handler uses unordered zones: click order is sent but execution order is not guaranteed. A planner note explains this behavior.

## Unsupported for now

- Rectangular zone selection and `clean_zone`; upstream `start_zone_clean` means named rooms, not a rectangle.
- Station buttons/preferences, voice/volume/child-lock/DND settings and drying cancellation. Their unavailable panels/controls are hidden for this adapter.
- Decoded fault prose and confirmed room progress. Unknown dock phases and omitted attributes are not fabricated.
- Other robot families and multi-map planning have not been validated for this first implementation.

## Verification

`npm run check` includes the existing Spot+Scrub suite, adapter-selection/configuration tests, native room/options discovery, exact Save/Start payloads, readiness, partial failures, current-snapshot changes, locking, consumable direction and standalone-bundle checks.

With Playwright available, run `node tests/hass-dyson-browser.mjs` (use `BROWSER_CHANNEL=msedge` where appropriate). It uses simulated actions and a synthetic two-panel image, covering editor switching, both themes, local edits, Save/Start, image loading, remaining-life display and session controls. It sends no real robot commands.

Live acceptance: explicitly select hass-dyson, confirm room names/options, Save without starting, start one small room, then test Pause/Resume/Home. Confirm the full two-panel image and battery/refill/consumable values. Test a backend error and reload. Verify the old Spot+Scrub card still uses its original adapter when both integrations are installed.

Maintainer reports on 23 November confirmed Save with entity readback, room start, Pause/Resume/Home, the combined image with separate vacuumed/mopped coverage, dock status and drying remaining time. The washing start interlock and starting a new clean during drying were also confirmed live after their corrections.

Source review updated 23 November 2026: [room selects](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/spot_scrub_room_select.py), [room buttons/map identities](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/button.py), [services](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/services.py), [vacuum telemetry](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/vacuum.py), [images](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/image.py), [sensors](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/sensor.py), [binary sensors](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/binary_sensor.py).
