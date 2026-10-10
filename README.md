# Dyson Cleaning Planner Card

A Home Assistant Lovelace card for the Dyson Spot+Scrub integration.

**v0.2.3 — prototype with per-room settings and batched Save/Start actions.**

## Requirements

The [Dyson Spot+Scrub integration](https://github.com/UNsync3D/ha-dyson-spot-scrub) is required.

The updated Dyson integration must provide:

- `dyson_spot_scrub.save_room_settings`
- `dyson_spot_scrub.start_rooms_with_settings`
- Per-room selects for `cleaning_mode`, `cleaning_strategy`, `water_level`, and `mop_repetitions`, with a `room_id` attribute.

The card checks action availability. It does not fall back to individual select writes or the legacy start button.

## Screenshots

<table>
  <tr>
    <td align="center">
      <img src="docs/images/room-planner.png" alt="Room selection and cleaning settings" width="320">
      <br>Room selection and cleaning settings
    </td>
    <td align="center">
      <img src="docs/images/cleaning-session.png" alt="Active cleaning session and live map" width="320">
      <br>Active cleaning session and live map
    </td>
  </tr>
</table>

## Editing and cleaning

Each room uses the options reported by its own select entities. Editing only updates a local draft. Drafts are private to the card instance and are lost on reload.

**Save settings** submits all changed options in one targeted integration action, without starting a clean. It can save options for unselected rooms. Room selection and preferred sequence remain local because the save action accepts only room settings. The card retains the draft until HA reflects the submitted values, or reports a confirmation timeout. HA state confirmation is not a robot acknowledgement.

**Start clean** submits selected room IDs and changed room settings together in one integration action. It does not call Save first. Only the local room selection and an in-flight request disable the Start button; execution validates the current robot status, selected rooms and edited options. Unrelated unavailable switches do not block a run. Service failures are shown without automatic retries.

The room ID list preserves the preferred sequence, but the current integration uses `unorderedZones`; actual cleaning order is not guaranteed.

**Discard draft** restores current HA values and switch selection. External changes update unedited fields; locally edited fields retain their draft values. A notice identifies changes outside the card.

## Discovery

Discovery is limited to the selected Dyson device and integration. It matches registry unique IDs rather than generating entity IDs from room names, so Unicode names and manually renamed entity IDs work. Per-room select attributes provide native room IDs for action payloads. A local draft follows the same room ID when the registry receives renamed room entities. Missing, ambiguous or disabled entities are never guessed.

Room IDs are scoped to the robot's map. After replacing or remapping a floor, discard old drafts and refresh rooms. Explicit room mappings and exclusions use entity IDs and may need updating after entity renames.

Unavailable settings can be disabled or hidden in the editor. Battery and charging sensors are automatically discovered on the same device. The header shows percentage, color and a charging bolt only when charging is confirmed.

## During a clean

The active-session view replaces room selection and Start. It shows requested rooms only for a start submitted by this card instance; these are not confirmed progress or queue data. External sessions do not invent a room list. A pending start waits up to 30 seconds for an active robot state.

Stop and Home use the vacuum's supported actions. Pause/resume and queue cancellation semantics belong to the integration. The card does not toggle switches or clear a queue when returning home.

The optional camera fits the full card width without distortion. It rotates in 90-degree steps and can be disabled entirely. Visible active sessions request HA camera images about every five seconds; hidden/detached cards stop requests. Battery/status updates retain the mounted map and last successful image. Borders embedded in the camera source itself are preserved.

## Install or update for testing

1. Copy `dist/dyson-cleaning-planner-card.js` to `/config/www/dyson-cleaning-planner-card.js`.
2. Add or update the dashboard resource as a JavaScript module: `/local/dyson-cleaning-planner-card.js?v=0.2.3`.
3. Reload the dashboard/browser. The header must show **v0.2.3**.
4. Use the visual editor or this configuration:

```yaml
type: custom:dyson-cleaning-planner-card
entity: vacuum.your_dyson
show_camera: true
camera_rotation: 90
unsupported_settings: disabled
```

For HACS, add this repository as a custom dashboard repository and use its generated resource. Do not load both a manual resource and a HACS resource. Existing HACS packaging and release workflows are retained.

## Configuration

| Option | Description |
|---|---|
| `entity` | Required Dyson vacuum entity |
| `title` | Header text; defaults to `Plan a clean` |
| `unsupported_settings` | `disabled` (default) or `hidden` |
| `excluded_rooms` | Room switch entity IDs hidden in this card |
| `room_order` | Room switch IDs defining display order |
| `room_entities` | Optional map from current Dyson room names to switch entity IDs |
| `show_camera` | Show the camera during a session; defaults to `true` |
| `camera_entity` | Optional explicit camera on the same Dyson device |
| `camera_rotation` | `0`, `90`, `180`, or `270` degrees |

Old `mode_entity` and `start_entity` configuration keys are accepted for compatibility, but the v0.2.2 card does not use global mode or start-button entities to execute a run.

## Development

Node.js 22 or newer, no build or runtime dependencies:

```sh
node --test tests/*.test.mjs
node scripts/build.mjs
node scripts/preview.mjs
```

The preview uses simulated HA data only. Optional browser checks use Playwright: `node tests/browser.mjs`. Set `BROWSER_CHANNEL=msedge` for an installed Edge browser. See [TESTING.md](TESTING.md) for the device test checklist and [the integration contract](docs/integration-contract.md) for payloads and limitations.
