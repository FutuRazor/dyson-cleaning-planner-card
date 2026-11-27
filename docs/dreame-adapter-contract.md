# Dreame room-planning contract prototype

Status: **offline prototype, not a selectable or bundled adapter**. The experiment originated on `experiment/multi_adapter`; current card version is **v1.7.2**. This work does not establish Dreame hardware support or satisfy the separate merge/release milestone for another major manufacturer.

Further Dreame implementation is on hold pending a real-device tester. The current development priority is compatibility and regression coverage for the existing Dyson adapters.

## Fixed reference and evidence

Repository: `Tasshack/dreame-vacuum`, manifest **v2.0.3**, commit [`fec086caf064f2681e8bcc7be20a0d0ef54f444d`](https://github.com/Tasshack/dreame-vacuum/tree/fec086caf064f2681e8bcc7be20a0d0ef54f444d).

- [HA services and vacuum attributes](https://github.com/Tasshack/dreame-vacuum/blob/fec086caf064f2681e8bcc7be20a0d0ef54f444d/custom_components/dreame_vacuum/vacuum.py): segment-cleaning arrays, profile writes, sequence action, localized room catalogues and map-qualified HA area segments.
- [Room select identities and availability](https://github.com/Tasshack/dreame-vacuum/blob/fec086caf064f2681e8bcc7be20a0d0ef54f444d/custom_components/dreame_vacuum/select.py): MAC/native room-ID identities, model-dependent controls, numeric `value` attributes and mode-dependent availability.
- [Room wetness numbers](https://github.com/Tasshack/dreame-vacuum/blob/fec086caf064f2681e8bcc7be20a0d0ef54f444d/custom_components/dreame_vacuum/number.py): 1–32 native wetness values.
- [Device implementation](https://github.com/Tasshack/dreame-vacuum/blob/fec086caf064f2681e8bcc7be20a0d0ef54f444d/custom_components/dreame_vacuum/dreame/device.py): profile precedence, validation, default-array behavior, asynchronous map writes and sequence persistence.
- [Map metadata publication](https://github.com/Tasshack/dreame-vacuum/blob/fec086caf064f2681e8bcc7be20a0d0ef54f444d/custom_components/dreame_vacuum/camera.py) and [serialized room/map data](https://github.com/Tasshack/dreame-vacuum/blob/fec086caf064f2681e8bcc7be20a0d0ef54f444d/custom_components/dreame_vacuum/dreame/types.py).

The fixtures reproduce these structures with synthetic names, IDs and values. They are **not** captures from a real robot, and no concrete model has been accepted yet.

## Capability assessment

| Function | Source finding | Prototype policy |
|---|---|---|
| Room discovery | Vacuum exposes selected map IDs/index and room catalogues; room controls are not map-qualified | Require matching selected saved-map metadata; key rooms by device + map + native room ID |
| Suction | Native values 0/1/2/3 correspond to quiet/standard/strong/turbo | Offer only values found in the matching room select's options |
| Repeats | Native profile values 1–3 | Keep separate from Dyson's two-pass labels |
| Water | Basic volume or self-wash humidity has 3 levels; other devices have native wetness 1–32 | Select one representation from capabilities; preserve exact wetness values rather than reducing them to low/medium/high |
| Cleaning mode | Per-room capability exists; bulk profile setter validates 0–2 although the enum also defines mode 3 | Do not offer mode 3 through this bulk-save path; preserve it by omitting untouched mode arrays, or reject a mixed batch that cannot preserve it |
| Save | Required paired arrays include suction and repeats; the map path serializes a cleanset | Copy only known current companion values; reject unknown values and external edits |
| Start | Native `vacuum_clean_segment` accepts integer IDs and optional arrays; saved profiles can override supplied settings | Generate a descriptor only for ready current-map rooms; no dirty or unconfirmed Save → Start chaining |
| Execution order | Dedicated action persists sequence; backend may prefer stored order and contains generation-specific handling | Always `ordered:false` in this phase; no sequence writes and no numbered room badges |
| Map/zone UI | Camera calibration exists but differs from the card's hash-bound zone contract | Deferred; camera attributes are used only as identity/profile metadata |
| Schedules/dock extras | Backend internals are not a verified normalized schedule CRUD contract for this card | Deferred, without inferring support from an internal method or service name |

## Conservative identity and readiness envelope

`inspectDreameSnapshot({hass, registry, entity})` in `src/adapters/dreame-contract.js` is a pure reader. It requires:

1. One enabled `dreame_vacuum` vacuum registry entry with a device ID and the pinned `<mac>_dreame_vacuum` unique-ID form. Related entities must belong to that same platform/device.
2. An unambiguous `selected_map_id` / `selected_map_index` pair matching the vacuum's `maps` metadata.
3. An enabled saved-map camera with unique ID `<mac>_map_<index>`, live metadata, `selected:true` and matching numeric `map_id` / `map_index`. This first prototype deliberately requires this metadata; it does not fetch image bytes, infer calibration, or fall back to a friendly name.
4. A unique join between `maps.name` and the vacuum's localized `rooms` catalogue. Duplicate map names are rejected in this conservative envelope rather than guessed. Each visible catalogue room must match a camera `rooms` entry and its numeric `room_id`.

Room keys are serialized `[deviceId, mapId, nativeRoomId]`; native IDs are positive safe integers. The native start ID `1` is different from the HA area-segment composite ID `1_1` and from an HA area ID. Room-select unique IDs may reuse the same native room ID after a map switch, so they cannot serve as map identity alone. Entity/name changes do not alter room keys; a configured entity/map/catalogue context change invalidates the previous request.

Writes additionally require connected, available, docked/idle state; an established saved map without a temporary map; `started:false`, `running:false`, `customized_cleaning:true`; the matching capability; and no CleanGenius, draining or self-repair veto. The prototype does not enable customized cleaning or switch maps automatically. These are conservative support policies, not assertions that upstream requires every condition in every command path.

The pinned backend maps water checking to HA `docked`, while publishing `vacuum_state: water_check` and/or `status: water_check`; self-repair also appears as `status: self_repair`. The prototype rejects these published details before preparing Save or Start descriptors. It does not rely solely on a `self_repairing` Boolean, which the pinned backend does not publish. Ordinary docked/charging snapshots remain eligible when the other requirements hold.

## Read values and edit options

Camera room metadata supplies map-qualified native baselines (`suction_level`, `cleaning_times`, `water_volume`, `wetness_level`, `cleaning_mode`). Matching select/number entities supply current availability and allowed edits. Their native numeric values must agree with the metadata before a field can be edited. Missing, duplicated, disabled or unavailable controls do not authorize guessed writes.

The prototype uses native numeric draft values. It does not yet provide the runtime card's canonical labels, translations or DOM rendering. A future adapter must add that boundary without reusing incompatible Dyson option semantics.

## Save descriptor

`prepareDreameSave({baseline, current, draft})` returns a proposed HA action but never sends it. `draft` is keyed by the stable room keys; unchanged values produce a no-op. It validates the latest context, readiness, service, native options and the edited rooms' complete baseline against external changes.

For each edited room, the bulk action needs aligned `segment_id`, `suction_level` and `repeats` arrays. Editing only water therefore copies known unchanged suction/repeat values for that room. Other rooms are not included in these argument lists. Optional arrays are included only when a changed field needs them; every included array must preserve valid values for all affected rooms. If that is impossible (for example, an untouched mode 3 in a mixed mode batch), the prototype rejects the batch instead of inventing a value or splitting writes automatically.

Example: change Kitchen water from 2 to 3, retaining known suction 1 and repeat 1:

```json
{
  "domain": "dreame_vacuum",
  "service": "vacuum_set_custom_cleaning",
  "data": {
    "entity_id": "vacuum.renamed_dreame",
    "segment_id": [1],
    "suction_level": [1],
    "repeats": [1],
    "water_volume": [3]
  }
}
```

The underlying map implementation serializes its cleanset; this is not an atomic compare-and-swap protecting unrelated external clients. This contract cannot guarantee protection from a robot/app change after the latest snapshot. No mapless or full-map fallback path is implemented.

## Why Save cannot currently authorize automatic Start

In the pinned backend, `set_custom_cleaning` edits the integration's map data and calls `set_cleanset`, which invokes `update_map_data_async`. The HA service can return while the robot action is still pending. A later negative response can be logged by a callback. Local map data can already contain the requested values, so a new HA publication or changed camera timestamp is not sufficient robot-side acknowledgement.

`createDreameSaveProbe` / `observeDreameSave` model this explicitly:

| Observation | What is established | Automatic Start |
|---|---|---|
| Matching HA values | Integration displays the intended values, possibly optimistically | Blocked |
| HA service resolved | Service handling returned, not necessarily robot acceptance | Blocked |
| Late backend rejection | A previously displayed/accepted request failed later | Blocked, possible partial effect retained |
| Timeout, context change or service rejection | Outcome is unconfirmed/failed | Blocked |

There is deliberately no invented successful robot-ACK event or fixed sleep that converts these observations into confirmation. Terminal failures cannot be erased by another matching HA publication. A real adapter needs a verified acknowledgement/readback strategy, potentially requiring upstream integration work, before enabling the automatic edited-profile → Start workflow. User-triggered Save and Start being separate buttons does not by itself solve this evidence problem.

## Start descriptor and remaining limitations

`prepareDreameStart` accepts only distinct current-map room keys and an empty local draft, with no pending Save probe. It proposes native integer `segments` and empty `repeats`, `suction_level` and `water_volume` arrays. In the pinned implementation, empty arrays fall back to each current room's saved values while customized cleaning is active; omitting `repeats` instead invokes the HA handler's default of 1. This behavior is source-verified, **not hardware-verified**, and the descriptor is explicitly marked as needing live verification.

Submitted list order never implies an execution-order guarantee. This prototype has no network transport, in-flight command locks, persistent pending-save tracking, current-request lifecycle dispatcher, optimistic-update reconciliation or user-facing error translations. Those remain runtime implementation work. Reloading a frontend must not become a substitute for clearing an unconfirmed write. These pure descriptors must not simply be wired to a live `callService` loop.

## Executable fixtures and preview

```text
node --test tests/dreame-contract.test.mjs
npm run prototype:dreame
```

The demonstration prints the proposed Save and a trace: matching HA values → successful service return → delayed backend rejection. It reports `dispatchedCommands:0`, keeps `robotConfirmed:false` and never permits automatic Start. The fixture's `callService` throws if invoked accidentally.

Coverage includes: two maps reusing room ID 1; entity/name changes; contradictory map evidence; missing/duplicate/hidden IDs; renamed registry entities; exact water representations; unknown compulsory companion settings; unsupported mode 3; external profile edits; missing services; unavailable robot modes; native/composite-ID separation; and optimistic versus late-failing saves. No fixture is presented as real device evidence.

## Live evidence needed before activation

Obtain a tester's concrete model, firmware, HA version and exact integration version/commit. Request relevant redacted vacuum/map/select/number states and registry entries, including one saved map and native room preferences. Tokens and account credentials are unnecessary.

Start with read-only comparison of names, IDs, map and controls against the app. Then verify one changed room profile while preserving another room and optional fields, actual persistence/readback, and the robot's handling of a delayed Save followed by a separate Start. Establish whether any observable event can distinguish optimistic publication from robot confirmation. Verify native fallback arrays, selected rooms, Pause/Resume/Home, map changes and stored-profile/sequence precedence. Keep number badges disabled until an explicit sequence path is independently confirmed. Do not merge or announce full Dreame support from the offline prototype alone.
