# Spot+Scrub robot schedules

The card supports the schedule interface in [UNsync3D's `feature/schedules` branch](https://github.com/UNsync3D/ha-dyson-spot-scrub/tree/feature/schedules), reviewed at commit `d595d5fd34b372e2fbeb0fcaf4bd8d979f8c9e9f` on 24 November 2026. Its manifest identifies version 2.2.0; install a build containing the schedule interface. The card detects entities and capabilities at runtime instead of relying on that version label. The card's own version remains 1.5.0.

## Interface and capability detection

- Sensor: enabled `sensor.*` on the configured vacuum's device and `dyson_spot_scrub` platform, unique ID `<serial>_schedules`.
- Attributes: `schedules`, `known`, `on`, `in_sync`, `unknown` and `can_change`.
- Each schedule provides `schedule_id`, `enabled`, `days`, `time`, `repeat`, `map_id`, ordered `room_ids`, corresponding `rooms`, and optional `room_settings` keyed by selected room ID. Saved settings use the labels accepted by `set_schedule`; unknown values are omitted by the integration.
- The integration filters schedule room rows by selection flag `[8]` and orders them by `[10]`. The card displays these selected room names, not every room's stored preferences.
- `can_change: true` is required for writes. In the reviewed branch, writes are confirmed only for RB05; other models can expose a read-only list. Missing/disabled/ambiguous sensors do not expose schedule controls. Older integration builds without the sensor retain their previous UI.
- `set_schedule` and `delete_schedule` are the only schedule actions used. Each call explicitly targets one vacuum with `entity_id`; no entities or actions are borrowed from hass-dyson.

The sensor can retain known schedules while the robot is offline. Those rows remain readable but cannot authorize a write. An incomplete list (`in_sync: false`) displays the existing explanation to save or toggle schedules in MyDyson while HA is connected. No unknown schedule entries are invented.

## Creating a schedule from room planning

1. Select at least one room in the room planner and set the desired room options locally.
2. Click the calendar-plus button beside Save.
3. Review the selected room names, choose weekdays and a local start time, and confirm.

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

The shared Schedules tab follows Rooms and Zone when both are available. Existing layout, four-row scroll limit, contained time picker and deletion confirmation are reused.

- Toggle: `set_schedule` with only `entity_id`, `schedule_id` and `enabled`.
- Edit days/time: `set_schedule` with only `entity_id`, `schedule_id`, `days` and `time`.
- Edit rooms: the same action additionally carries ordered `room_ids` and only explicitly changed `room_settings`.
- Delete: `delete_schedule` with only `entity_id` and `schedule_id`, after confirmation.

Editing days/time and toggling do not inherit the room planner's selection or draft. The backend preserves the existing schedule's map, selected rooms and own settings when those fields are omitted. The schedule editor has its own room list: expand a room to change settings, use the arrow buttons to reorder, remove individual rooms, or add available rooms at the bottom. At least one room is required. Room editing requires the schedule's map to match the active map; days/time editing remains available on other maps. It never imports the room planner's selection or setting draft.

Since upstream commit `d595d5f`, the editor displays each schedule's own saved cleaning mode, vacuum power, water level and repetitions in the room summary and preselects them in its controls. It snapshots this readback separately from explicit changes: simply opening or saving weekdays/time never resends the saved settings. Restoring a field to its saved value removes that override. General room preferences are never used as a substitute for schedule settings.

Older feature builds and partially decoded settings remain supported. Missing fields show "Keep stored setting" with an explanatory note; missing rooms show "Stored settings not reported". A reported label absent from the live select's options is displayed but never implicitly sent. Added rooms have no settings readback until Home Assistant reports their saved schedule plan. Only explicitly changed, currently valid labels are submitted.

Schedule action progress, success and failure use the existing dismissible header notice for both adapters. Failed dialogs also keep their error inside the modal so it remains accessible.

The schedule editor and room summaries follow the selected cleaning mode: Vacuum hides water level, Mop hides vacuum power, and combined modes show both. Repetitions remain available in either mode. `always_show_all_settings: true` shows all supported settings, as in room planning. Hidden settings are retained; hidden local overrides are omitted from schedule writes and reappear if the user switches back before saving. If the mode is unreported, all supported fields remain available.

All mutations share the adapter's room-action lock. State changes wait for HA; errors, including backend time conflicts, are shown without automatic retries. Editor previews send no schedule actions. Time is interpreted in HA's time zone; execution across daylight-saving changes remains unverified.

## Validation

`tests/spot-schedules.test.mjs` checks source-shaped metadata, selected IDs/order, exact action payloads, draft isolation, identity/map validation, read-only models, missing services and shared locking. `node tests/spot-schedules-browser.mjs` checks both themes at 375/900 px, all three planning tabs, selected-room display, creation, edit/toggle/delete, room reorder/add/remove, explicit setting overrides, saved-value display and preselection, readback after reopening, legacy/partial metadata and unknown-setting placeholders, map mismatch, empty-plan prevention, header dismissal, sync warnings, scroll limits, errors and offline/read-only states. These use simulated HA and send no real commands.

Live acceptance with the installed feature build: create a schedule for two selected rooms with different settings, check its exact selected rooms/settings and weekdays/time in MyDyson, then toggle, edit and delete it. Confirm general room preferences and the card's draft are unchanged. Edit room order, remove a room, add another and change one setting. Check in MyDyson that untouched settings and another schedule remain unchanged. Reopen the card editor and confirm the saved values match MyDyson. Verify missing readback on older feature builds is still labeled as unreported. Repeat after reload and while another app-created schedule is present. Verify actual scheduled execution and room execution order separately.
