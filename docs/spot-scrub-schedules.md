# Spot+Scrub robot schedules

Card **v1.7.0** supports the schedule interface released in [UNsync3D Dyson Spot+Scrub v2.2.0](https://github.com/UNsync3D/ha-dyson-spot-scrub/releases/tag/v2.2.0) on 24 November 2026. Schedule writes are supported for Spot+Scrub AI / RB05; R1/R2 currently expose a read-only list. The card detects entities, services and model capabilities at runtime instead of relying on the version label alone.

## Interface and capability detection

- Sensor: enabled `sensor.*` on the configured vacuum's device and `dyson_spot_scrub` platform, unique ID `<serial>_schedules`.
- Attributes: `schedules`, `known`, `on`, `in_sync`, `unknown` and `can_change`.
- Each schedule provides `schedule_id`, `enabled`, `days`, `time`, `repeat`, `map_id`, ordered `room_ids`, corresponding `rooms`, and optional `room_settings` keyed by selected room ID. Saved settings use the labels accepted by `set_schedule`; unknown values are omitted by the integration.
- The integration filters schedule room rows by selection flag `[8]` and orders them by `[10]`. The card displays these selected room names, not every room's stored preferences.
- `can_change: true` is required for writes. Integration v2.2.0 enables writes for RB05; other models can expose a read-only list. Missing/disabled/ambiguous sensors do not expose schedule controls. Older integration builds without the sensor retain their previous UI.
- `set_schedule` and `delete_schedule` are the only schedule actions used. Each call explicitly targets one vacuum with `entity_id`; no entities or actions are borrowed from hass-dyson.

The sensor can retain known schedules while the robot is offline. Those rows remain readable but cannot authorize a write. An incomplete list (`in_sync: false`) displays the existing explanation to save or toggle schedules in MyDyson while HA is connected. No unknown schedule entries are invented.

## Saved-map schedule behavior

The [map-switching integration development branch](https://github.com/FutuRazor/ha-dyson-spot-scrub/tree/feat/map-switching) now retains orders for all maps while exposing the selected map through the Schedules sensor and calendar. `map_id`, `known`, `on`, `unknown` and `in_sync` are scoped to that map; `known_all_maps` counts retained orders across maps. Individual schedule switches retain their identities and on/off values but become unavailable on another map or while no saved map is reported. Actions also reject changes to another map's schedules. An old global checksum is discarded on upgrade without deleting orders; per-map counts/checksums and post-edit baselines are persisted independently.

The card filters rows, enabled badge and next-clean countdown by each schedule's persistent `map_id`, never by room name. A scoped sensor summary must match the vacuum's map before it is used. Confirmed empty B shows "No schedules for this map." without an instruction to synchronize A's schedules. Genuine same-map discrepancies still show the sync warning. With older unscoped metadata, known rows can be filtered but a global mismatch involving other maps cannot be attributed to the selected map.

An app-initiated map change closes an obsolete schedule editor and cancels its local confirmation feedback. Disappearance from the filtered list cannot confirm deletion. Card-originated map changes also lock schedule controls. Returning to A restores A's retained schedules. Other adapters keep their existing schedule behavior.

Offline regressions cover A with five schedules / empty B, plans on both maps, equal counts with different checksums, missed changes, upgrade/restart, delayed and reordered replies, transient map ID `0`, schedule switch availability and backend action locks. `tests/map-schedules-browser.mjs` checks both themes at 375/900 px, list/count/countdown changes, empty-map text, real warnings and an in-flight deletion across a map change. On 26 November 2026, the maintainer confirmed successful live switching: schedules and availability follow the selected map cleanly in both the integration and Lovelace card. Further app edits, reconnect and actual scheduled execution remain separate checks.

## Creating a schedule from room planning

1. Select at least one room in the room planner and set the desired room options locally.
2. Click the calendar-plus button beside Save.
3. Review or adjust the numbered room selection and cleaning settings, choose weekdays and a local start time, and confirm.

Creation sends a single `dyson_spot_scrub.set_schedule` call:

```yaml
entity_id: vacuum.your_dyson
days: [tue, thu]
time: '10:00'
room_ids: ['13', '11']
room_settings:
  '13':
    cleaning_mode: Mop
    water_level: High
```

`room_ids` contains the selected native IDs in the card's order. `room_settings` contains the local draft's validated labels and is omitted if empty. The integration stores settings in the schedule's own room plan. The card does not call Save or Start, modify live room preferences, or consume the local draft. Creation validates current map context, live room identities, exclusions, duplicate selection and offered setting values immediately before dispatch. No map switch or raw MQTT write is performed.

The new schedule defaults to enabled as defined by the integration. The frontend submits room order; actual robot execution order still needs live verification.

## Managing existing schedules

A compact text line immediately above the rows shows the time until the next enabled weekly schedule. It uses Home Assistant's configured time zone independently of the browser's zone and updates locally without commands or full list rerenders. The tooltip includes the planned date/time and zone. Incomplete lists or enabled one-time plans without an execution date qualify the result as the next known cleaning; with no calculable start, the line distinguishes no active schedules from unknown/unavailable data. Missing/invalid HA time zones never fall back to the browser zone. Local-time conversion accounts for the target date's offset, choosing the earlier occurrence of an overlapping clock time and moving a nonexistent clock time forward by the gap. This is a nominal frontend prediction; the robot's actual clock-change policy remains unverified.

The shared Schedules tab follows Rooms and Zone when both are available. Each entry is a rounded card with a prominent time, seven weekday badges and selected room chips using the room planner's color palette. Enabled days use the accent color; scheduled days in disabled entries remain marked in grey. Weekday badges are informational; editing remains in the dialog. The switch is directly accessible beside a three-dot menu for Edit/Delete. The menu supports keyboard navigation and stays within card bounds outside the scrolling list. Narrow cards wrap the weekdays beneath the time. Four entries remain visible before scrolling starts; the contained time picker and deletion confirmation are retained. Both adapters share this overview, while hass-dyson keeps its explicit missing-room-selection notice. A raised green count badge on the Schedules tab shows enabled schedules, with a grey zero, without taking up layout width. Counts above 99 display as 99+ with the exact count in the tooltip and accessible name. Complete confirmed lists supply the count directly; Spot+Scrub can also supply its robot-reported summary count when the list is incomplete. If no reliable count is available, the badge is omitted rather than showing a false zero.

- Toggle: `set_schedule` with only `entity_id`, `schedule_id` and `enabled`.
- Edit days/time: `set_schedule` with only `entity_id`, `schedule_id`, `days` and `time`.
- Edit rooms: the same action additionally carries ordered `room_ids` and only explicitly changed `room_settings`.
- Delete: `delete_schedule` with only `entity_id` and `schedule_id`, after confirmation.

Editing days/time and toggling do not inherit the room planner's selection or draft. The backend preserves the existing schedule's map, selected rooms and own settings when those fields are omitted. The schedule editor reuses the room planner layout and cleaning controls with its own isolated draft. All available rooms are shown. Selection circles display the cleaning order: selecting appends a room, deselecting removes it, and deselecting/reselecting moves it to the end. Room settings open from the name/mode tile. The Modern theme uses the same power/water sliders and repetition buttons as room planning; Classic keeps its select controls. Settings appear beside the list on wide overlays and below the open room on narrow overlays. Separate move/remove buttons and the add-room dropdown are no longer needed. The Discard/Save footer matches the planner button heights. At least one room is required. Editing requires the schedule's map to match the active map. Existing schedule editing never imports the room planner's selection or setting draft. Creation starts from a snapshot of the planner selection/settings that can be changed independently in the dialog. Unselected room overrides are kept locally for reselection but omitted from the submitted payload.

Integration v2.2.0 exposes each schedule's own saved cleaning mode, vacuum power, water level and repetitions. The editor displays them in the room summary and preselects them in its controls. It snapshots this readback separately from explicit changes: simply opening or saving weekdays/time never resends the saved settings. Restoring a field to its saved value removes that override. General room preferences are never used as a substitute for schedule settings.

Older feature builds and partially decoded settings remain supported. Missing fields show "Keep stored setting" with an explanatory note; missing rooms show "Stored settings not reported". A reported label absent from the live select's options is displayed but never implicitly sent. Added rooms have no settings readback until Home Assistant reports their saved schedule plan. Only explicitly changed, currently valid labels are submitted.

Schedule feedback is shared by both adapters. Toggle requests show a local loading indicator at that switch until HA reports the requested state, then finish silently. Create/save/delete progress uses the header; after the authoritative schedule metadata matches the requested fields, a short success notice disappears automatically after three seconds. Service completion alone is not treated as readback confirmation. Missing confirmation after ten seconds produces a persistent warning without retrying the write; a later matching HA update clears that warning. Errors remain dismissible and failed dialogs also retain their error inside the modal. Feedback timers are cancelled on configuration changes or removal, and an expired success timer cannot erase a newer message.

The schedule editor and room summaries follow the selected cleaning mode: Vacuum hides water level, Mop hides vacuum power, and combined modes show both. Repetitions remain available in either mode. `always_show_all_settings: true` shows all supported settings, as in room planning. Hidden settings are retained; hidden local overrides are omitted from schedule writes and reappear if the user switches back before saving. If the mode is unreported, all supported fields remain available.

All mutations share the adapter's room-action lock. State changes wait for HA; errors, including backend time conflicts, are shown without automatic retries. Editor previews send no schedule actions. Time is interpreted in HA's time zone; execution across daylight-saving changes remains unverified.

## Validation

`tests/spot-schedules.test.mjs` checks source-shaped metadata, selected IDs/order, exact action payloads, draft isolation, identity/map validation, read-only models, missing services and shared locking. `node tests/spot-schedules-browser.mjs` checks both themes at 375/900 px, all three planning tabs, selected-room display, creation, edit/toggle/delete, numbered selection/reselection, explicit setting overrides, saved-value display and preselection, readback after reopening, legacy/partial metadata and unknown-setting placeholders, map mismatch, empty-plan prevention, header dismissal, sync warnings, scroll limits, errors and offline/read-only states. These use simulated HA and send no real commands.

Maintainer live tests during development confirmed creation with selected rooms and cleaning settings, toggling, deletion, days/time editing and room/settings editing. The subsequent planner-style editor and responsive overview were also reviewed in live Home Assistant. These checks do not establish actual scheduled execution, robot room execution order or behavior across daylight-saving changes.

For a final live regression with integration v2.2.0: create a schedule for two selected rooms with different settings and check its selected rooms/settings and weekdays/time in MyDyson, then toggle, edit and delete it. Confirm general room preferences and the card's draft are unchanged. Change room order, deselect a room, select another and change one setting. Check that untouched settings and another schedule remain unchanged. Reopen the editor and compare saved values with MyDyson. Repeat after reload and with another app-created schedule present. Verify actual scheduled execution and room execution order separately.
