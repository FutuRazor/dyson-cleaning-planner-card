# Integration adapters

Integration behavior is isolated behind internal adapters. The existing `dyson_spot_scrub` adapter passed the initial offline and maintainer live checks. Card **v1.6.0** supports the [experimental hass-dyson adapter](hass-dyson.md) as a second backend with integration selection, introduced in v1.5.0. Existing Spot+Scrub YAML and action payloads remain the compatibility baseline.

## Boundaries

- `src/integration.js` supplies the configured adapter. Automatic initial selection prefers Spot+Scrub; an explicit robot selects its own backend. It never switches robots because an entity becomes unavailable.
- `src/adapters/spot-scrub.js` owns platform/unique-ID matching, room identity and draft validation, telemetry, backend capability checks, preference writes, session actions, zone readiness and action payloads.
- `src/adapters/hass-dyson.js` implements native-ID room selects, normalized options, separate save/start actions, optional images/consumables and standard session controls. It does not borrow Spot+Scrub custom actions or station entities.
- `src/adapters/dyson-planning.js` supplies the shared Dyson room field descriptors, mode-dependent visibility and summaries. The card renders those descriptors rather than interpreting Dyson modes or assuming four controls.
- `src/shared.js` contains configuration validation, display labels and generic helpers.
- `src/zone-geometry.js` contains image calibration validation, hashing and geometry/display helpers, without integration domains or service calls.
- Card and editor use `this.adapter`. Zone and session-map components receive that same adapter. Each card retains its own model, drafts, registry, request badges and timers. The Spot+Scrub in-flight room-action lock uses the configured vacuum entity; hass-dyson uses the resolved HA device ID so an entity rename cannot bypass the lock.
- `src/core.js` and `src/zone-core.js` retain compatibility exports so existing tests and module consumers exercise the moved implementation. They do not contain a second implementation of backend policy.

The adapter does not own DOM rendering, translations, editor previews, image decoding/fetch scheduling or pointer interaction. Home Assistant supplies registry transport and live states. Generic HA state/domain conventions remain usable in rendering; backend-specific identity, attributes and custom actions belong in the adapter.

## Current internal interface

All reads receive current HA/registry/model arguments rather than capturing a card or robot. `sendRoomDraft` resolves to a plan `{rooms, settings, sent}`, not the original HA action result. `rooms` records the requested room identities, `settings` contains the changed canonical card values, and `sent: false` denotes an empty Save that made no action call. Other write helpers forward or await their action call. Failures propagate without automatic command retries.

For hass-dyson, Save and Start are separate steps. If Save succeeds and a subsequent validation or Start call fails, the adapter reports a partial failure; the saved settings remain applied. A failed action call does not establish whether a robot command took effect when transport confirmation is missing. There is no rollback or transaction binding Start to a preference revision across external clients.

| Group | Methods / data |
|---|---|
| Identity | `id`, `vacuumEntries(registry)`, `cameraEntries(registry, entity)`, `defaultEntity(hass)`, `trustedCamera(registry, entity, camera)` |
| Editor metadata | `label`, `shortLabel`, `deviceLabel`, `editorHint`; integration choices and device labels come from the adapter registry |
| Room model | `discover(hass, registry, config, previousRooms)`, `roomContext(hass, entity, registry)`, `hasRoomList(hass, entity)`, `roomSelectionState(hass, roomEntity, room)` |
| Room capabilities | `roomPlanningState(hass, registry, config, model, draft)` returns `supportsSave`, `supportsStart`, `canSave`, `canStart`, `ordered`, and optional `notice`; supported actions remain visible while temporarily unavailable |
| Room presentation | `roomPresentation(room, draftValues, config)` returns `fields`, optional `summary` and optional `issue`; each field descriptor has `key`, `label`, `control` (`select`, `slider`, `segments`), optional `wide`, `omitted` and `optionLabels` |
| Room writes | `sendRoomDraft({hass, model, config, selected, draft, start, context, registry, getCurrent})`; optional `roomStartMessage` supplies pending feedback; `roomActionAvailable(hass, start)` remains a legacy Dyson compatibility helper |
| Status/readiness | `robotTelemetry(hass, entity, camera, registry)`, `cleaningView(hass, entity, pendingStart, registry)`, `activityStatus(hass, entity, pendingStart, registry)`, `dockActivity(hass, entity, registry)`, `dockBusy(hass, entity, registry)`, `dockBlocksStart(hass, entity, registry)`, `startBlockReason(hass, entity, registry)` |
| Session controls | `canControl(hass, entity, action, registry)`, `controlCleaning(hass, entity, action, registry)` |
| Optional reads | `batteryStatus(hass, model)`; `dryingRemainingTime`/`dryingRemainingPercent(hass, entity, registry)`; `consumableStatus`, `robotSettings`, `stationSettings`, `stationActions` (each receives `hass, registry, entity`) |
| Optional writes | `changeRobotSetting`/`changeStationSetting(hass, registry, entity, key, value)`, `pressStationAction(hass, registry, entity, key)` |
| Map | `mapId(hass, vacuum)`, `mapPicture(hass, camera)`, `mapCalibration(hass, camera)` |
| Zone | `supportsZoneDevice(registry, devices, entity)`, `zoneDeviceOptions(rooms)`, `zoneReady(hass, vacuum, camera, calibration, trusted, preview)`, `zoneSettingsPayload(mode, strategy, water, passes)`, `startZone(hass, request)` |
| Optional schedules | `scheduleState(hass, registry, entity)` returns capabilities (`createSupported`, `createReady`, `deleteSupported`), availability, normalized schedules, nullable `enabledCount`, sync state, whether room selection is known, and whether creation uses selected or stored rooms; `setSchedule({hass, registry, config, id, days, time, enabled, selected, draft, context, roomPlan})` creates, edits or toggles; `deleteSchedule({hass, registry, config, id})` removes one known same-device schedule through the backend |
| Compatibility constants | `CONSUMABLES`, `ROBOT_FIELDS`, `STATION_FIELDS`, `STATION_ACTIONS`, `ZONE_CHOICES` |

`robotTelemetry` returns `{state, available, name, dockState, fault, faultCode, cleaning, bumperColor}`. `discover` retains the existing room model (`entity`, `name`, `context`, `roomId`, `settings`, `available`, `excluded`) and optional battery/charging/camera entity IDs, and may supply an explicit `key`. `roomKey(room)` uses that key or the legacy entity ID. Selection, display-order/exclusion configuration, rename reconciliation and schedule creation use these keys; a key must be a nonempty string unique within the robot/map context. `roomId` remains the native setting-draft identity. Entityless rooms may omit `entity`, and `roomSelectionState` receives the complete room as its third argument. Both Dyson adapters retain their actual entity IDs as keys, preserving existing YAML. They still resolve native room IDs and validate identity before dispatch.

Save and Start support are independent. A room-only adapter can return `supportsSave:false`, an empty field list, and no issue; the card then renders selectable room tiles without a Save button, settings expander or missing-Dyson-action warning. `ordered:false` uses checkmarks in Modern and unnumbered checkboxes in Classic. Spot+Scrub retains numbered selection; hass-dyson reports `ordered:false` because the integration determines execution order. The card rechecks capability/readiness state before dispatch. This UI gate supplements adapter-side validation, which remains authoritative for stale maps, room IDs, edited values and multi-step writes. In particular, hass-dyson requires its Save action before Start only when settings are edited.

`startZone` accepts `{vacuum, camera, calibration, trusted, preview, rect, rotation, mode, strategy, water, passes}` and builds the wire payload inside the adapter. The existing UI verifies image bytes, minimum rectangle size and offered options before dispatch; the adapter rechecks zone readiness and validates geometry/settings when constructing the action. Zone geometry and native schedule contracts are outside the room-capability refactor; schedule creation only adopts the shared room-key lookup.

The registry arguments above are required for hass-dyson to resolve device identity, map membership and dock sensors. The original Spot+Scrub implementation may ignore arguments it does not need. For a two-step room Start, the card supplies `getCurrent()`, returning `{hass, registry, config, active}` from the latest frontend state. The adapter calls it initially and again after Save. `active` remains false for that request after any card detachment, even when the same element is reattached before Save finishes. A changed configuration, inactive request, changed room/map identity or new readiness veto prevents the Start step while keeping already-saved settings.

Session buttons and dispatch also require the configured vacuum to belong to the selected adapter's enabled registry entries. Editor selection can use `hass.entities` while the full registry is loading; once loaded, even an empty registry is authoritative.

See the [integration contract](integration-contract.md) for exact entities, values, payloads and timing. This internal interface is already used by both adapters and may evolve as their supported capabilities grow.

Schedule rendering and dialog behavior live in `src/schedules.js`; each adapter owns its own sensor identities, capability detection, validation and action payloads. Spot+Scrub uses the [schedule contract](spot-scrub-schedules.md), including selected room IDs and `can_change`. Its optional `scheduleRoomOptions(hass, registry, config, schedule)` supplies same-map room choices; explicit `roomPlan` changes stay separate from planner drafts, normalized `roomSettings` supplies saved labels separately from write overrides, and missing saved settings remain unknown. The hass-dyson adapter retains its separate schedule sensor/actions and stored-selection warning. Missing sensors hide schedule UI, while read-only models can show their list without creation controls. Backend identities are not inferred from display names or borrowed from another integration.

## Regression acceptance

`npm run check` runs syntax checks, the existing regression suite, new adapter boundary tests, bundle generation and a standalone-bundle registration/discovery smoke check. Browser fixtures exercise the generated bundle with simulated HA, including room actions, editor behavior, optional controls and rectangle dispatch. None of these calls a real robot.

For release validation, check both adapters in live Home Assistant:

1. Existing YAML loads unchanged; the same robot, rooms and optional entities appear in both themes.
2. Room selection/settings remain local until Save/Start; Save changes only edited fields, and Start sends the selected room IDs/settings once.
3. Pause, Resume, Home, readiness vetoes, dock phases, drying and retained-fault behavior match the previous card.
4. Station preferences/buttons, robot preferences, battery, consumables, map images and bumper appearance behave as before.
5. Zone rotation, image verification, settings, map changes, Start and room/zone draft retention work on desktop and mobile.
6. Reloading, renamed entities, unavailable entities and backend failures preserve the previous handling.

The maintainer reported successful Spot+Scrub live testing. The pre-existing zone Pause/Resume problem was corrected in the integration and both actions were subsequently confirmed live. hass-dyson Save/readback, room starts, Pause/Resume/Home, vacuum/mop coverage, dock status, drying countdown, the washing start interlock and starting during drying were also confirmed live. See the adapter guide for the current experimental supported scope.
