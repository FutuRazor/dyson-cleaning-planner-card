# Changelog

## Unreleased

- Stack schedule Delete below Edit with the enable switch to their left. Limit the schedule list to four visible rows once a fifth entry exists, preserving list scrolling across HA updates and dialogs.
- Add per-schedule deletion through hass-dyson's `delete_robot_schedule` action, with a time/day confirmation, Cancel focus, capability detection, pending-state protection and authoritative HA updates.
- Replace the browser-native schedule time popup with a contained hour/minute picker and explicit Apply/Cancel controls, including mouse and keyboard navigation.
- Add experimental hass-dyson robot schedules: create from room planning, list enabled/disabled schedules, toggle them, and edit weekdays/time. Keep original Spot+Scrub schedule controls hidden.
- Group calendar-plus and Save into the left half of the room footer, with Start in the right half. Explain in the creation dialog that the integration reuses the robot's stored room selection, which cannot be changed by this card.
- Correct the room-selection display: hass-dyson beta.6 lists all room-preference names, including unselected rooms. Show selection as unavailable rather than claiming that all listed rooms are selected. Model this distinction in schedule fixtures.
- Send schedule-specific room settings without saving general preferences or consuming the local draft. Show incomplete-list and action-failure messages, validate same-device schedule identities, and share room-action locking.
- Add localized schedule UI and simulated adapter/browser coverage without changing the release version.

## v1.5.0

- Introduce integration adapters while preserving existing Spot+Scrub configuration and action payloads.
- Add experimental hass-dyson support for Spot+Scrub room discovery, all four room settings, Save and room Start, standard Pause/Resume/Home controls, battery/charging, consumables and refill status.
- Add automatic integration selection with Spot+Scrub priority for initial discovery, plus explicit integration selection in the visual editor and YAML. Keep the configured robot authoritative when offline.
- Display hass-dyson's complete two-panel vacuum/mop coverage image and allow same-device image selection.
- Show dock activity and a local countdown from the dock timer's timezone-aware end timestamp, including during retained robot faults. Hide missing washing time instead of showing Unavailable.
- Block room starts during roller washing and dust collection while allowing a ready robot to start during drying. Revalidate current HA state between hass-dyson's separate Save and Start actions and report partial failures without automatic retries.
- Document the experimental adapter's single-map requirement, integration-controlled room order and unsupported station/robot settings, rectangular zones and drying cancellation.
- Extend adapter, dock, countdown and standalone-bundle regression coverage. Simplify Marketplace and HACS installation to direct catalog search.
- Harden hass-dyson starts against finished-job telemetry, device aliases and transient card removal; validate session-control ownership and explicit map domains. Preserve editor selections while the registry loads and show independent readiness warnings during drying.

- Add French (Français [fr]) for the card and editor, including automatic selection for French Home Assistant locales. Use Dyson France terminology where publicly documented.

## v1.4.0

- Follow the integration camera's bumper colour during cleaning; pulse the bumper in the Pause colour when paused or red on errors, with neutral idle/offline colours and reduced-motion support.

- Add Rooms and Zone planning tabs with independent local drafts.
- Select one movable, resizable rectangle on a verified camera snapshot, including rotated maps and touch controls.
- Add zone settings for all four cleaning modes, vacuum power, water level and repetitions. Vacuum then Mop exposes mop repetitions and keeps one vacuum pass.
- Use the Spot+Scrub hardware-verified repetition counter, including two-pass vacuum zone cleaning.
- Keep the resize handle reachable at image edges and preserve scrolling during map selection.
- Require matching map calibration and robot readiness before sending a single zone-start action.
- Normalize build line endings for reproducible Windows/Linux bundles.
- Refresh planner/session screenshots, add a zone screenshot, and require Dyson integration v2.1.0 or newer.

- Add Dutch translations and native language names with language codes in the editor.
- Hide unsupported room/zone settings, station controls and consumables by device capability, while keeping temporarily unavailable controls visible and disabled. Support mop-pad consumables when provided by the integration.
- Organize Info into Station, Robot and Consumables tabs. Add voice prompts, stepped volume, child lock and Do Not Disturb controls, with dependent controls disabled when their parent setting is off.
- Highlight the Consumables tab when supplies need attention and allow Info and zone-settings overlays to close when clicking outside them.
- Add a configurable header robot illustration, enabled by default, with a dock indicator and an active-cleaning beam without changing header dimensions.
- Keep a permanent compact status area in Modern, including idle/docked states and drying time/progress. Overlay robot faults and temporary notices on the header without resizing the card; allow dismissed robot faults to be reopened from the warning icon.
- Return to planning for an error state when the integration explicitly reports that a new clean is allowed.
- Align Modern cleaning-map spacing with zone planning and reserve space for room badges or the requested zone dimensions.
- Replace the zone resize button with a corner-centered circular handle and larger touch target. Move dimensions into a floating badge and enforce a card-side minimum of 55 cm on each side. Reachability still depends on the robot and obstacles.
- Add automatic cm/inch display and a zone_dimension_unit override. Off hides only the selection badge; session dimensions then follow Home Assistant's units.

- Improve keyboard navigation for planning and Info tabs, exclude hidden overlay controls from the focus order, and restore focus to a visible control after dismissing header messages.
- Preserve planner warnings and their dismissed state during status updates, and clear stale Robot-tab action errors when reopening the overlay or changing devices.
- Recheck zone-start availability as readiness changes and protect room starts and drafts against robot or map context changes without retrying accepted commands.
- Prefer device-specific unique IDs when discovering consumable entities.
- Update Dutch browser checks and make the browser channel configurable for local validation.

Zone cleaning has been hardware-tested on the Spot+Scrub AI. Other models still need hardware confirmation.

## v1.3.0

- Add English and German translations for the card, visual editor, station settings, consumables, status messages and tooltips.
- Follow the Home Assistant user language by default, with per-card language overrides and English fallback for unsupported languages.
- Preserve room/device names, custom titles, local drafts and original integration option values when changing language.
- Bundle translations into the distribution file and document how to add more languages.

Validation: 39 automated tests, language/layout/scroll/editor browser checks and GitHub validation passed. The maintainer confirmed the language feature in live Home Assistant without clipped or incorrectly formatted text.

## v1.2.0

- Default to Modern while preserving an explicitly selected Classic theme.
- Refine Modern surfaces, stepped sliders and label alignment; center Info beside the title and subtitle and remove the repeated settings heading.
- Keep split-view height stable across cleaning modes, distribute three controls with extra bottom space, and align exactly five compact room tiles with the settings panel without reducing tile gaps.

- Separate Modern room selection (number circle) from opening settings (room text), reduce repetition button height, and reserve omitted controls only in split view to prevent mode changes from resizing the card.

- Compact Modern room settings, keep room rows evenly spaced and enable the two-column layout from 480 px of available card width.

- Add Classic and Modern themes with shared room drafts and ordered cleaning actions. Modern provides responsive room settings, a cyan outline and pointer for the open room, discrete power/water sliders and repetition buttons.
- Compact the Info overlay by placing the close button beside the tabs and removing the heading and version badge.

## v1.0.0

- Prepare the first stable release, requiring Dyson Spot+Scrub integration v1.5.0 or newer.
- Move the version badge from the planner and cleaning headers to the shared Info overlay heading.
- Show the README as the repository description in HACS.
- Align package versions, generated bundle, test expectations and release documentation.

## v0.4.1

- Show Enabled/Disabled below Cleaning solution using the station switch, independently of refill status. Use a red Refill required chip and a neutral subtitle when the switch is unavailable.

- Refine consumables into two-column rows with stacked labels and compact, rounded remaining-life bars.
- Use the Home Assistant accent for normal life levels while preserving warning and low-life colors.
- Replace the cleaning-solution OK label with a non-interactive Ready to use status chip, with distinct refill and unavailable states.
- Preserve station actions, room drafts and integration interfaces.

## v0.4.0

- Remove the unused legacy start adapter, its global mode/start-button discovery, and obsolete preparation helpers.
- Keep room planning and execution exclusively on the existing batch actions; retain room-switch discovery and all station/session controls.
- Continue accepting old `mode_entity` and `start_entity` configuration keys as ignored values.
- Replace legacy-only tests with batch regression coverage and update documentation and the compiled bundle.

## v0.3.6b

- Open Info on Station settings, followed by Consumables. Keep station actions quiet on success and show only failures.

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
