# Compatibility assessment: cmgrayb/hass-dyson

Reviewed **21 November 2026** against the public `main` branch of [cmgrayb/hass-dyson](https://github.com/cmgrayb/hass-dyson). This is a source-based assessment and implementation proposal, not an implemented hass-dyson adapter or a hardware-tested compatibility claim. Upstream may change. The exact current card contract is in [integration-contract.md](integration-contract.md).

## Result

The current card is **not directly compatible**. It hardcodes registry platform and custom actions to `dyson_spot_scrub`; upstream uses `hass_dyson`. Renaming entity IDs or setting `room_entities` cannot bridge that difference. There is useful overlap for Spot+Scrub room settings, but discovery, telemetry, option translation and action orchestration need an adapter.

## Observed differences

| Interface | Current card | Reviewed hass-dyson source | Consequence |
|---|---|---|---|
| Registry platform | `dyson_spot_scrub` | `hass_dyson` | Card rejects upstream entities during discovery |
| Vacuum unique ID | `<serial>_vacuum` | Same pattern in `vacuum.py` | Serial extraction could be reused |
| Room discovery | Vacuum `rooms`, name-derived room switches | Per-room Spot+Scrub selects use native numeric room IDs; global mode select publishes `room_settings`/`room_modes` | Build a room model from upstream data rather than requiring synthetic switches |
| Per-room unique IDs | `<serial>_room_<normalized-name>_<card-key>` | `<serial>_room_<room-id>_<upstream-setting>` | Existing lookup cannot find these selects |
| Save | `save_room_settings(entity_id, room_settings)` | `set_room_cleaning_modes(device_id, room_modes)` | Translate target, keys and values |
| Start named rooms | One `start_rooms_with_settings` call with ordered IDs and full draft | `start_zone_clean(device_id, zones, map?, cleaning_mode?)` | No equivalent combined all-settings payload in reviewed schema |
| Ordering | Card sends click order | Handler constructs `orderedZones: []`, `unorderedZones: resolved_ids` | Do not promise ordered execution |
| Rectangle clean | `clean_zone` with metric rectangle and calibration | `start_zone_clean` resolves named persistent-map zones | These are different capabilities; disable rectangles until a real equivalent exists |
| Main vacuum telemetry | `rooms`, readiness, dock/action/fault attributes, active map | `vacuum.py` publishes `raw_state`, `global_position`, `full_clean_type`, `clean_id`, plus `clean_*` details | No equivalent readiness/dock/map contract established by this vacuum attribute implementation |
| Map | `camera.*`, `_floor_map`, `/api/camera_proxy/`, optional calibration | `image.py` exposes `_dust_map`, `_floor_plan`, `_clean_coverage` image entities | Existing camera selector/proxy loader cannot consume these directly; no equivalent calibration established |
| Session actions | Standard pause/start/return actions and feature bits | Standard vacuum methods exist | Reusable after correct discovery, feature and state verification |
| Station, robot settings, battery, consumables and drying | Exact identities/data in the contract | No complete mapping verified in this assessment | Audit each entity class per model before enabling; avoid inventing aliases |

The absence of an equivalent in a reviewed file is not proof that the robot cannot supply that information. This assessment does not claim every upstream model or entity has been exhaustively tested.

## Spot+Scrub settings translation

Upstream room selects expose `room_id`. Their keys come from `ROOM_SETTINGS`; repetitions are rendered as `1x`/`2x` in the per-room selects, but the save action accepts numeric `1`/`2`. The global select's `room_settings` uses decoded native values.

| Card key | Card option | Upstream save key | Upstream save value |
|---|---|---|---|
| `cleaning_mode` | `Vacuum` | `cleaning_mode` | `vacuum_only` |
| `cleaning_mode` | `Vacuum and Mop` | `cleaning_mode` | `vacuum_and_mop` |
| `cleaning_mode` | `Mop` | `cleaning_mode` | `mop_only` |
| `cleaning_mode` | `Vacuum then Mop` | `cleaning_mode` | `vacuum_then_mop` |
| `cleaning_strategy` | `Auto`, `Boost`, `Quiet`, `Quick` | `vacuum_power` | `auto`, `boost`, `quiet`, `quick` respectively |
| `water_level` | `Very Low`, `Low`, `Medium`, `High` | `hydration` | `very_low`, `low`, `medium`, `high` respectively |
| `mop_repetitions` | `One Pass`, `Two Passes` | `wash_repetitions` | Numeric `1`, `2` respectively |

Example upstream save, for comparison only (the current card does not send this):

```yaml
action: hass_dyson.set_room_cleaning_modes
data:
  device_id: "<HA device registry ID>"
  room_modes:
    "12":
      cleaning_mode: mop_only
      hydration: high
      wash_repetitions: 2
```

Example upstream named-room start:

```yaml
action: hass_dyson.start_zone_clean
data:
  device_id: "<HA device registry ID>"
  zones: ["12", "10"]
  map: "<persistent map ID or name>"
```

The `map` field is optional upstream, but an adapter must resolve the correct map and reject ambiguous IDs. It must not assume that IDs from current-map room preferences and persistent-map zones are interchangeable without verifying that relationship on the device. Upstream supports multiple persistent maps; the current card has no map selector. Omit `cleaning_mode` after saving mixed per-room modes, because supplying one value applies that mode to all targeted rooms.

## Proposed implementation path

1. Validate the [experimental adapter boundary](integration-adapter.md) for platform discovery, room identity/options, readiness/telemetry, action construction and image retrieval. This branch implements only the existing `dyson_spot_scrub` adapter; live acceptance is required before continuing.
2. Implement room discovery for Spot+Scrub using upstream native-ID selects and verified names/current-map identity. Keep native option values separate from card display labels; do not rely on translated names or fabricate `dyson_spot_scrub` registry entries.
3. Implement Save through `hass_dyson.set_room_cleaning_modes` and verify that refreshed selects confirm all changed fields. Its reviewed backend uses a shared room store/lock and preference readback, and permits writes only in its defined idle states. Those states differ from the card's current room-start policy.
4. For Start, prefer a backend combined save-and-start action with validation and locking. A frontend two-call fallback would save the entire changed draft first (including edited unselected rooms), then start only selected rooms. It must stop on failed save/readback and revalidate readiness/map before starting. Save may succeed while Start fails; changes persist, and concurrent clients may intervene between calls. This is weaker than a combined backend action and must be reflected in UX and tests.
5. Audit battery/charging, faults, dock phases, drying, station buttons/preferences, robot preferences and consumables per model. Use explicit capabilities and report unsupported controls through the existing UI behavior. Do not treat HA `idle`/`docked` alone as safe readiness: mapping and mid-job charging may use those states upstream.
6. Add separate support for upstream image entities if desired. Keep rectangle cleaning disabled until a verified metric transform, image fingerprint, readiness and rectangle action are available; a floor-plan image or named-room service alone is insufficient.
7. Verify on a real HA installation and robot: renamed rooms/entities, map changes, option readback, save-only behavior, mixed-mode jobs, selection behavior, external app changes, partial failures, concurrency, pause/resume/home and unavailable devices. Check each model separately before advertising support.

## Primary sources reviewed

- [const.py](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/const.py): domain and service names.
- [vacuum.py](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/vacuum.py): vacuum identity, attributes, session methods and segment handling.
- [services.yaml](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/services.yaml): public action fields.
- [services.py](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/services.py): named-zone resolution, map targeting, unordered start and RB05 mode application.
- [spot_scrub.py](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/spot_scrub.py): room setting keys/values, preference validation and idle policy.
- [spot_scrub_room_select.py](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/spot_scrub_room_select.py): native-ID per-room selects, option formatting, shared store/lock and readback.
- [spot_scrub_select.py](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/spot_scrub_select.py): global cleaning-mode select and decoded room attributes.
- [image.py](https://github.com/cmgrayb/hass-dyson/blob/main/custom_components/hass_dyson/image.py): image entities and map rendering.
