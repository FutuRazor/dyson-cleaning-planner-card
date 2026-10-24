# Changelog

## v0.3.6b

- Add native Home Assistant Press buttons for Empty dust bin and Wash mop roller below the station settings.
- Discover dock actions and the drying sensor by device and stable unique ID, including renamed entities.
- Prefer the dedicated drying sensor for remaining time and progress; retain legacy vacuum attributes only when no matching sensor is registered.
- Preserve room drafts and respect entity availability; report action failures without retrying.

## v0.3.6a

- Use Home Assistant’s native `ha-switch` component for station switches, including its theme, keyboard focus and disabled states. The standalone preview uses a separate mock component.
- Align station dropdowns to the right of their labels on the same row, including narrow cards.
- Preserve immediate entity actions and all station-setting behavior.

## v0.3.6

- Add Consumables and Station settings tabs to the Info overlay.
- Detect four station switches and two selects by registry identity on the selected Dyson device; retain live option labels from Home Assistant.
- Send station changes directly through HA switch/select actions, independently of room drafts. Disable missing or unavailable settings and show service errors without retrying.
- Support keyboard navigation and focus containment in the tabbed overlay, retaining the consumables warning indicator.


## v0.3.5

- Show the integration's current fault explanation below Robot needs attention without changing fault handling, view transitions or start readiness.
- Move Refresh rooms into the visual editor below room ordering. Refresh the connected card preview without changing configuration or local drafts.
- Replace the planner's bottom button row with a compact discard icon before Local draft. Keep the summary row height unchanged; hide the icon without a draft and disable it during requests.
- Validated both changes in live Home Assistant using the v0.3.4a and v0.3.4b test builds.

## v0.3.4

- Honor the integration's `ready_to_start` veto before starting a clean and show its reason below the header.
- Keep Start disabled while returning or finishing cleanup, washing the mop roller, or emptying the dust bin. Allow planning and preserve local drafts throughout these phases.
- Allow starting during roller drying when the integration permits it. Retain dock-state checks for older integrations without readiness attributes.
- Validated return status and start availability after dust collection and roller washing in live Home Assistant tests using the v0.3.3a test build.

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
