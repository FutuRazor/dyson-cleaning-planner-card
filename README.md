# Dyson Cleaning Planner Card

A Home Assistant Lovelace card for the Dyson Spot+Scrub integration.

**v0.4.1 — per-room planning, live cleaning and dock status, and consumables monitoring.**

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

[Try the interactive preview](https://futurazor.github.io/dyson-cleaning-planner-card/preview/index.html) with simulated Home Assistant entities. No robot is connected.

## Editing and cleaning

Choose rooms and set each room's cleaning mode, Vacuum Power, water level, and Clean repetitions. The card keeps edits as a local draft until you save or start. **Save settings** sends changed options without starting a clean; **Start clean** sends the selected rooms and their changed options together. The integration currently does not guarantee the order in which rooms are cleaned. Drafts are lost if the card is reloaded before saving or starting.

Use the trash icon beside **Local draft** to discard unsaved settings and restore the room selection reported by Home Assistant. The icon only appears when a local draft exists.

Clean repetitions is available in every cleaning mode when the integration provides the setting. Water level is hidden in Vacuum mode, and Vacuum Power is hidden in Mop mode. **Always show all settings** keeps them visible; unavailable options can be shown disabled or hidden.

## Discovery

The card finds rooms and settings belonging to the selected Dyson vacuum, using the integration's room IDs rather than guessing from room names. It also finds that device's battery and charging sensors. Missing or ambiguous entities are skipped. If the robot's map changes, use **Refresh rooms** below the room order in the card editor and review any explicit room mappings or exclusions. Discovery also refreshes automatically every 30 seconds.

## During a clean

During a clean, the card shows the live robot state and optional camera instead of room selection. It can show the rooms started from this card, but the integration does not report confirmed room progress or a queue. **Pause/Resume** and **Home** are available when supported by the integration. The camera can be hidden or rotated in 90-degree steps.

The session header stays **Cleaning session**, with live activity below it and requested-room badges underneath. When provided by the integration, `full_clean_action` identifies vacuuming, mopping, or both. Otherwise the card shows **Cleaning**.

After docking, the planner shows **Cleaning mop roller**, **Drying mop roller**, or **Emptying dust bin** above the rooms, based on `dock_state`. The message disappears when the dock becomes idle. Start is available during roller drying: the integration ends drying when starting the new clean. Start follows the integration’s `ready_to_start` attribute and remains disabled during return/cleanup, roller washing and dust collection; local planning remains available. The reason appears below the header. Older integrations without readiness attributes retain dock-state checks but cannot reliably block the return/cleanup interval. During drying, a muted subtitle shows **Remaining time: 01:40 (hh:mm)** from the integration’s `drying_remaining_seconds` attribute. It updates with robot telemetry (roughly once per minute); missing data shows **Remaining time: unavailable**. The cancel icon calls `dyson_spot_scrub.cancel_drying` for the selected vacuum when that action is available. The card waits for the real dock status to change and does not assume cancellation succeeded. Robot errors remain visible. When the integration provides a fault description, it appears beneath **Robot needs attention**. The card follows the current reported fault and does not retain cleared errors.

During roller drying, a bar below the remaining-time subtitle shows the fraction of drying time still remaining. It uses the card's accent color and stops before the cancel button. The bar updates with robot telemetry and is hidden if total or remaining time is invalid or unavailable.

## Info and station settings

The **Info** overlay has two tabs: **Consumables** shows remaining supply life; **Station settings** contains Hot water mopping, Cleaning solution, Extended roller preparation, Hot water self-cleaning, Self-cleaning frequency and Roller drying duration, in that order.

Station settings are detected on the selected Dyson device, even after entity renames. Switches use Home Assistant’s native `ha-switch` component, and dropdowns sit to the right of their labels. Changes immediately call the corresponding switch or select action; they are independent of the room draft and Save settings. Displayed values follow Home Assistant. Dropdown options come from the integration. Missing, unavailable or ambiguous entities are disabled; this tab requires the integration version that provides the six station entities. The Info button still turns subtly red when consumables are low.

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

## Dashboard layout

In the card editor's **Layout** tab, the default height is automatic and the minimum width is 9 columns. Turn off **Auto height** to choose a fixed height. If the content exceeds that height, scroll inside the card to reach all settings and controls. Turn Auto height back on to restore the natural content height. The internal layout remains unchanged.

In a fixed-height card, selecting rooms, expanding settings and changing options preserve the planner's scroll position. Switching between planner and cleaning views starts at the top. Room-setting dropdowns close after a selection, including on iOS.

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

The obsolete global-mode/start-button adapter was removed in v0.4.0. Old `mode_entity` and `start_entity` configuration keys remain accepted but ignored; they can be removed from your YAML. Save and Start require the integration batch actions. Station controls and Pause/Resume/Home are unchanged.

## Development

Node.js 22 or newer, no build or runtime dependencies:

```sh
node --test tests/*.test.mjs
node scripts/build.mjs
node scripts/preview.mjs
```

The preview uses simulated HA data only. Optional browser checks use Playwright: `node tests/browser.mjs`, `node tests/batch-browser.mjs`, and `node tests/ui-browser.mjs`. Set `BROWSER_CHANNEL=msedge` for an installed Edge browser. See [TESTING.md](TESTING.md) for the device test checklist and [the integration contract](docs/integration-contract.md) for payloads and limitations.

## Consumables

The info button below the battery opens a consumables overlay in either card view. Compact, rounded bars sit to the right of each material name and remaining-life value (`100 - usage`). Normal bars use the Home Assistant theme accent. Cleaning solution uses a non-interactive Ready to use, Refill required or Unavailable status chip. Bars are orange at 25% or less and red at 10% or less. Any red bar also subtly highlights the info button in red.

Requires the integration's consumable sensors with `consumable_type` and `value_kind` attributes. Sensors are discovered on the selected Dyson device, including renamed entity IDs. Missing, ambiguous or unavailable values display Unavailable. The ioniser cartridge is omitted. Opening the overlay sends no service calls and preserves local drafts and the live map. Close it with the close button or Escape.

Cleaning solution shows Enabled or Disabled below its name, based on the same-device station switch; unavailable switch data shows Status unavailable. The vertically centered chip separately reports supply status: Ready to use in the theme accent, Refill required in red, or Unavailable in neutral colors. Disabling use does not hide a refill warning.

### Station actions and drying time

Station settings includes **Empty dust bin** and **Wash mop roller**, each with a native HA **Press** button. Actions execute immediately and leave room drafts untouched. Missing or unavailable actions are disabled. Wash mop roller also starts drying afterward, as controlled by the integration.

Remaining drying time and its bar use the dedicated drying sensor on the selected robot. Older integrations without this sensor use the vacuum attributes. A registered but unavailable sensor displays no time or progress; it never falls back to stale values. The dock status still determines when the drying display appears.
