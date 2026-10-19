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

The session header stays **Cleaning session**, with live activity below it and requested-room badges underneath. When provided by the integration, `full_clean_action` identifies vacuuming, mopping, or both. Otherwise the card shows **Cleaning**.

After docking, the planner shows **Cleaning mop roller**, **Drying mop roller**, or **Emptying dust bin** above the rooms, based on `dock_state`. The message disappears when the dock becomes idle. Start is disabled during these dock cycles; local planning remains available. The drying cancel icon is a disabled placeholder until the integration provides a supported action. No drying countdown is estimated, and robot errors remain visible.

## Install or update for testing

### Manual installation

Copy **only** `dist/dyson-cleaning-planner-card.js` into Home Assistant's `www` folder. For example, place the file at:

`/config/www/dyson-planner/dyson-cleaning-planner-card.js`

Create the `www` and `dyson-planner` folders if needed. Copy the JavaScript file itself, not the `dist` folder. Home Assistant paths use forward slashes (`/`); backslashes (`\`) are used in Windows file paths.

Register the file as a dashboard resource the first time you install it. Go to **Settings → Dashboards → ⋮ → Resources → Add resource**, then enter:

- URL: `/local/dyson-planner/dyson-cleaning-planner-card.js`
- Resource type: **JavaScript module**

If you have just created the `www` folder, restart Home Assistant once so it can serve files from that folder.

When updating a manual install, replace that same JavaScript file and hard-refresh the Home Assistant page with **Ctrl+F5**. Once the resource is registered, its URL does not need to change for updates. If a hard refresh is unavailable and the old version remains, clear the browser cache and reload Home Assistant.

### HACS installation

Install the card from HACS and use HACS to update it. HACS registers the dashboard resource automatically when resources are managed in the Home Assistant UI. If your resources are managed in YAML, add the installed card's resource URL to the `lovelace.resources` list instead. To add the card to a dashboard, open the dashboard, choose **Edit dashboard → Add card**, search for **Dyson Cleaning Planner**, then select your vacuum and options in the card editor. No YAML is needed for the usual card setup.

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
