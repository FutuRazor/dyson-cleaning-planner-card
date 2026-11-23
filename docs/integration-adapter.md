# Integration adapters

Integration behavior is isolated behind internal adapters. The existing `dyson_spot_scrub` adapter passed the initial offline and maintainer live checks. Stable release **v1.5.0** adds the [experimental hass-dyson adapter](hass-dyson.md) as a second backend with integration selection. Existing Spot+Scrub YAML and action payloads remain the compatibility baseline.

## Boundaries

- `src/integration.js` supplies the configured adapter. Automatic initial selection prefers Spot+Scrub; an explicit robot selects its own backend. It never switches robots because an entity becomes unavailable.
- `src/adapters/spot-scrub.js` owns platform/unique-ID matching, room identity and draft validation, telemetry, backend capability checks, preference writes, session actions, zone readiness and action payloads.
- `src/adapters/hass-dyson.js` implements native-ID room selects, normalized options, separate save/start actions, optional images/consumables and standard session controls. It does not borrow Spot+Scrub custom actions or station entities.
- `src/shared.js` contains configuration validation, display labels and generic helpers.
- `src/zone-geometry.js` contains image calibration validation, hashing and geometry/display helpers, without integration domains or service calls.
- Card and editor use `this.adapter`. Zone and session-map components receive that same adapter. The adapter is a stateless singleton apart from the existing per-vacuum in-flight room-action lock; each card retains its own model, drafts, registry, request badges and timers.
- `src/core.js` and `src/zone-core.js` retain compatibility exports so existing tests and module consumers exercise the moved implementation. They do not contain a second implementation of backend policy.

The adapter does not own DOM rendering, translations, editor previews, image decoding/fetch scheduling or pointer interaction. Home Assistant supplies registry transport and live states. Generic HA state/domain conventions remain usable in rendering; backend-specific identity, attributes and custom actions belong in the adapter.

## Current internal interface

All reads receive current HA/registry/model arguments rather than capturing a card or robot. Writes return the original action promise/result; failures propagate without automatic command retries.

| Group | Methods / data |
|---|---|
| Identity | `id`, `vacuumEntries(registry)`, `cameraEntries(registry, entity)`, `defaultEntity(hass)`, `trustedCamera(registry, entity, camera)` |
| Room model | `discover(hass, registry, config, previousRooms)`, `roomContext(hass, entity)`, `hasRoomList(hass, entity)`, `roomSelectionState(hass, roomEntity)` |
| Room writes | `roomActionAvailable(hass, start)`, `sendRoomDraft({hass, model, config, selected, draft, start, context})` |
| Status/readiness | `robotTelemetry(hass, entity, camera)`, `cleaningView(hass, entity, pendingStart)`, `activityStatus(hass, entity, pendingStart)`, `dockActivity(hass, entity)`, `dockBusy`, `dockBlocksStart`, `startBlockReason` (each receives `hass, entity`) |
| Session controls | `canControl(hass, entity, action)`, `controlCleaning(hass, entity, action)` |
| Optional reads | `batteryStatus(hass, model)`; `dryingRemainingTime`/`dryingRemainingPercent(hass, entity, registry)`; `consumableStatus`, `robotSettings`, `stationSettings`, `stationActions` (each receives `hass, registry, entity`) |
| Optional writes | `changeRobotSetting`/`changeStationSetting(hass, registry, entity, key, value)`, `pressStationAction(hass, registry, entity, key)` |
| Map | `mapId(hass, vacuum)`, `mapPicture(hass, camera)`, `mapCalibration(hass, camera)` |
| Zone | `supportsZoneDevice(registry, devices, entity)`, `zoneDeviceOptions(rooms)`, `zoneReady(hass, vacuum, camera, calibration, trusted, preview)`, `zoneSettingsPayload(mode, strategy, water, passes)`, `startZone(hass, request)` |
| Compatibility constants | `CONSUMABLES`, `ROBOT_FIELDS`, `STATION_FIELDS`, `STATION_ACTIONS`, `ZONE_CHOICES` |

`robotTelemetry` returns `{state, available, name, dockState, fault, faultCode, cleaning, bumperColor}`. `discover` retains the existing room model (`entity`, `name`, `context`, `roomId`, `settings`, `available`, `excluded`) and optional battery/charging/camera entity IDs. `startZone` accepts `{vacuum, camera, calibration, trusted, preview, rect, rotation, mode, strategy, water, passes}` and builds the wire payload inside the adapter. The existing UI verifies image bytes, minimum rectangle size and offered options before dispatch; the adapter rechecks zone readiness and validates geometry/settings when constructing the action.

See the [integration contract](integration-contract.md) for exact entities, values, payloads and timing. This interface is internal and may evolve when a second backend is implemented.

## Verification before the next phase

`npm run check` runs syntax checks, the existing regression suite, new adapter boundary tests, bundle generation and a standalone-bundle registration/discovery smoke check. Browser fixtures exercise the generated bundle with simulated HA, including room actions, editor behavior, optional controls and rectangle dispatch. None of these calls a real robot.

Before starting a second adapter, verify the experimental bundle in live Home Assistant:

1. Existing YAML loads unchanged; the same robot, rooms and optional entities appear in both themes.
2. Room selection/settings remain local until Save/Start; Save changes only edited fields, and Start sends the selected room IDs/settings once.
3. Pause, Resume, Home, readiness vetoes, dock phases, drying and retained-fault behavior match the previous card.
4. Station preferences/buttons, robot preferences, battery, consumables, map images and bumper appearance behave as before.
5. Zone rotation, image verification, settings, map changes, Start and room/zone draft retention work on desktop and mobile.
6. Reloading, renamed entities, unavailable entities and backend failures preserve the previous handling.

The maintainer reported successful Spot+Scrub live testing. The pre-existing zone Pause/Resume problem was corrected in the integration and both actions were subsequently confirmed live. hass-dyson Save/readback, room starts, Pause/Resume/Home, vacuum/mop coverage, dock status, drying countdown, the washing start interlock and starting during drying were also confirmed live. See the adapter guide for the current experimental supported scope.
