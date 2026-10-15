# Dyson Cleaning Planner Card

A Home Assistant Lovelace card for the Dyson Spot+Scrub integration.

**v0.2.3 — mode-aware room settings and live Pause/Resume controls.**

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

Choose rooms and set each room's cleaning mode, Vacuum Power, water level, and mop repetitions. The card keeps edits as a local draft until you save or start. **Save settings** sends changed options without starting a clean; **Start clean** sends the selected rooms and their changed options together. The integration currently does not guarantee the order in which rooms are cleaned. Drafts are lost if the card is reloaded before saving or starting.

Settings that do not apply to the selected cleaning mode are hidden. **Always show all settings** keeps them visible; unavailable options can be shown disabled or hidden.

## Discovery

The card finds rooms and settings belonging to the selected Dyson vacuum, using the integration's room IDs rather than guessing from room names. It also finds that device's battery and charging sensors. Missing or ambiguous entities are skipped. If the robot's map changes, refresh the rooms and review any explicit room mappings or exclusions.

## During a clean

During a clean, the card shows the live robot state and optional camera instead of room selection. It can show the rooms started from this card, but the integration does not report confirmed room progress or a queue. **Pause/Resume** and **Home** are available when supported by the integration. The camera can be hidden or rotated in 90-degree steps.

## Install or update for testing

For a manual install, copy **only** `dist/dyson-cleaning-planner-card.js` into Home Assistant's `www` folder. For example, the file can be placed at:

`/config/www/dyson-planner/dyson-cleaning-planner-card.js`

Create the `dyson-planner` folder if needed. Copy the JavaScript file itself, not the `dist` folder. Home Assistant paths use forward slashes (`/`); backslashes (`\`) are used in Windows file paths.

When updating a manual install, replace that same JavaScript file and hard-refresh the Home Assistant page with **Ctrl+F5**. You normally do not need to change the dashboard resource or the card's settings for an update. If a hard refresh is unavailable and the old version remains, clear the browser cache and reload Home Assistant.

For HACS, install the card from HACS and use HACS to update it. To add the card to a dashboard, open the dashboard, choose **Edit dashboard → Add card**, search for **Dyson Cleaning Planner**, then select your vacuum and options in the card editor. No YAML is needed for the usual setup.

## Card options

The usual setup can be done in the visual editor: open the dashboard, choose **Edit dashboard**, then edit the Dyson Cleaning Planner card. The options below are also available in that card's YAML editor; they do not belong in Home Assistant's `configuration.yaml`.

| Option | Description |
|---|---|
| `entity` | Required Dyson vacuum entity |
| `title` | Planner header text; defaults to `Plan a clean`; edits update the preview as you type |
| `always_show_all_settings` | Show all dropdowns regardless of mode or unavailable-setting visibility; defaults to `false` |
| `unsupported_settings` | `disabled` (default) or `hidden` |
| `excluded_rooms` | Room switch entity IDs hidden in this card |
| `room_order` | Room switch IDs defining display order |
| `room_entities` | Optional map from current Dyson room names to switch entity IDs |
| `show_camera` | Show the camera during a session; defaults to `true` |
| `camera_entity` | Optional explicit camera on the same Dyson device |
| `camera_rotation` | `0`, `90`, `180`, or `270` degrees |

Old `mode_entity` and `start_entity` configuration keys are accepted for compatibility, but the v0.2.3 card does not use global mode or start-button entities to execute a run.

## Development

Node.js 22 or newer, no build or runtime dependencies:

```sh
node --test tests/*.test.mjs
node scripts/build.mjs
node scripts/preview.mjs
```

The preview uses simulated HA data only. Optional browser checks use Playwright: `node tests/browser.mjs`, `node tests/batch-browser.mjs`, and `node tests/ui-browser.mjs`. Set `BROWSER_CHANNEL=msedge` for an installed Edge browser. See [TESTING.md](TESTING.md) for the device test checklist and [the integration contract](docs/integration-contract.md) for payloads and limitations.
