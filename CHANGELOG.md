# Changelog

## v0.3.3

- Close room-setting dropdowns after selection on iOS by releasing focus before rendering.
- Preserve the planner's scroll position when selecting rooms, expanding settings or changing options in a fixed-height card.
- Keep the original session rendering path and start at the top when switching between planner and cleaning views.
- Show a theme-colored remaining drying time bar below the subtitle, ending before the cancel button. Use confirmed remaining/total seconds and hide the bar when timing data is missing or invalid.
- Validated the combined changes on multiple devices in a live Home Assistant installation.

## v0.3.2

- Enable the drying cancel button when the integration exposes `cancel_drying`.
- Show robot-reported remaining drying time as a small muted hh:mm subtitle.
- Preserve local drafts and wait for telemetry to confirm cancellation; missing timing data is shown as unavailable.

## v0.3.1

- Raise the default minimum dashboard width to 9 columns.
- Keep automatic height as the default and support manual height with scrollable content.
- Preserve the internal planner/session layout and keep the consumables overlay within the card.

## v0.3.0

- Remove the Not selected suffix from room summaries, retaining selection order badges.
- Rename Mop repetitions to Clean repetitions and make it available in every cleaning mode. Keep the integration key `mop_repetitions` unchanged.
- Show live cleaning and dock activity below the header, including roller washing, drying and dust collection.
- Preserve single-room session badges through brief idle/docked transitions.
- Add a consumables overlay with remaining-life bars and a subtle low-life indicator.
- Allow starting during roller drying and correct doubled planner padding in Home Assistant.
- Update documentation screenshots and link to the interactive preview.

## v0.2.3

- Update the title preview on every keystroke, preserving the editing cursor.
- Rename Cleaning strategy to Vacuum Power without changing entity or service payload keys.
- Show room settings according to the live or draft cleaning mode; add `always_show_all_settings` (default false). Hidden values remain in the local draft.
- Use live cleaning/paused states for the session header and orange Pause / green Resume controls; keep Home red.
- Remove verbose session explanations and move the refresh caption above the map.
- Preserve room chips, batch Save/Start, battery status, map rotation and mounted camera updates.

Repository maintenance: the published v0.2.3 bundle was already current, but
several source, test, metadata and workflow files had not been synchronized to
GitHub. Those files were restored from the matching v0.2.3 project source; this
does not introduce a new card version.

Validation: 30 core/batch tests and three isolated Edge browser suites passed with simulated HA entities. Real robot testing remains necessary for integration Pause/Resume support.

## v0.2.2

- Add independent per-room cleaning mode, strategy, water level and mop repetitions using live select options.
- Keep edits in a local draft and submit all changed settings through one save action, or together with selected room IDs through one start action.
- Replace the UI's legacy select/switch/button sequence with the integration batch actions; missing actions never trigger a fallback.
- Preserve selected rooms after saving, retain drafts on service/confirmation errors, and follow renamed rooms by native room ID.
- Show unsupported settings disabled or hidden. Retain battery, camera and active-session controls.
- Translate the README, testing checklist and integration contract into English.

Validation: 28 core tests and two isolated Edge browser suites with simulated HA entities. Real integration and robot verification remains a user test. The transmitted room list does not guarantee robot execution order.


## v0.2.1

- Add a colored battery icon and percentage in the upper-right card header in both planning and session views. Detect the battery and charging sensors through the selected Dyson device's registry identities, including renamed entity IDs.
- Show a lightning bolt only when the charging sensor reports `on`. Display an unavailable battery as a neutral dash; do not infer charging from docking or battery percentage.
- Scale the complete rotated camera image to the card's full inner width, with proportional height. Remove the fixed image frame and side gutters without cropping or distorting the image.
- Preserve the existing auto-detection, legacy start and Stop/Home behavior.

Validation: 20 unit tests and an isolated Edge browser test, including all four rotations at 900/390/320-pixel viewport widths, battery updates, charging states and unavailable values. The v0.2.1 changes still need testing in a real Home Assistant dashboard.

## v0.2.0

- Replace room selection with a status view while the vacuum reports cleaning, paused, returning, an error or an unavailable state.
- Show requested rooms for sessions started from this card. Do not infer an external session's room list from room switches.
- Add an optional floor-map camera, automatic device-based discovery, a camera selector and 0°/90°/180°/270° rotation in the visual editor.
- Fit the complete camera image into a fixed 4:3 frame within the card. Pause image requests when hidden; stop them when disabled or removed.
- Add feature-aware Stop and Home actions. Home delegates to the integration without clearing room switches or claiming to cancel the queue. Pause/resume remains pending integration support.
- Preserve the legacy start button and local-selection enablement. Unrelated unavailable room switches still do not block a start.

Validation: 17 unit tests and an isolated Edge browser test with simulated Home Assistant entities. Physical robot behavior and a real dashboard installation of these new functions remain to be verified.
