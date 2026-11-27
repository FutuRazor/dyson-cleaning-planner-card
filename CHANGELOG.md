# Changelog

## Unreleased

- Add an offline Dreame v2.0.3 contract prototype, source-shaped fixtures and an executable delayed-save-rejection demonstration. Validate map-qualified room identity, exact native profile values and companion-value preservation; do not equate optimistic HA updates or service completion with robot confirmation. The prototype is not bundled or exposed as a supported adapter.
- Correct optimistic humidity-control publication in the offline Dreame fixture and derive its self-repair veto from published detailed state/status, including water checks reported as docked in HA. These corrections do not register or bundle the prototype.

## v1.7.2

- Follow hass-dyson's same-device `<serial>_current_map` sensor and map-qualified room buttons for multi-map room discovery. Keep rooms with reused native IDs separate and use the button metadata for names.
- Show read-only floor chips, with per-card map visibility/order and per-map rotation. Reset old room selections and drafts when the reported map context changes.
- Start selected rooms with one `hass_dyson.start_zone_clean` call carrying an explicit map ID. Multi-map fallback uses stored robot settings; unqualified setting writes and schedule creation are unavailable in this mode. Existing single-map Save/Start behavior remains supported.
- Accept the last map reported by hass-dyson, including its observed 5–10 second delay, without cross-adapter reads, artificial waiting, map-switch actions or automatic retries. Upstream schedule synchronization remains separate.

## v1.7.1

- Add optional wrapping map chips above Rooms, Zone and Schedules through `map_selector_style: chips`; keep the header menu as the default.
- Make map chips slightly flatter without changing label size. Remove checkmarks and their reserved space; center the pending spinner without changing chip dimensions.
- Remove draft-discard reminders from map chips and the header menu while retaining the automatic reset after confirmed switching.
- Add `excluded_maps` using stable string IDs. Ignore deleted IDs, preserve exclusions after renames and show new maps by default. Hide unnecessary selectors while retaining a return path from an app-selected hidden map, or a notice when all maps are hidden.
- Add `map_order` using stable string IDs and editor up/down arrows. Apply the same order to chips and the header menu, append unlisted maps in integration order, and reset the preference when selecting another robot.
- Add `map_rotations` and per-map editor controls, including explicit 0° and a Default option. Follow the active map's angle in session images and Zone selection, retaining the global rotation as fallback and the existing inverse transform for zone commands.
- Add visual-editor style and visibility controls using the complete map list, refresh support and map IDs. Reset exclusions when selecting another robot and translate controls, hints and validation in English, German, Dutch and French.
- Allow map switching directly with a local room draft. Retain it until matching select/vacuum readback confirms the target, then automatically reset the old map's selection and unsaved settings. Rejection/timeouts on the original map preserve the draft; late confirmation preserves newer target-map edits and newer feedback. No room settings are saved automatically.
- Reuse existing map confirmation, lifecycle/request locks and error handling for both presentations. Preserve Zone/Schedules selection and verified floor-plan loading. No companion integration changes are required for these display options.

## v1.7.0

**Saved-map switching for Spot+Scrub**

This release combines the adapter work developed under v1.6.1 with saved-map selection and schedules per map. Maintainer live tests confirmed map switching and schedule availability in the integration and Lovelace card, plus the Zone tab remaining selected and loading the new floor plan after a map change.

Saved-map controls currently require the [map-switching integration development branch](https://github.com/FutuRazor/ha-dyson-spot-scrub/tree/feat/map-switching). Integrations without the matching map select keep these optional controls hidden; upstream v2.2.0 alone does not expose them. Integration-provided fault descriptions, including the new English texts for 2509/2510, retain their current language behavior; localization is a follow-up.

- Revalidate the card lifecycle immediately before generic HA fan-speed and area-cleaning calls, closing the promise gap after asynchronous room validation.
- Preserve native room checkbox/label activation when dismissing the saved-map menu, including single-click selection and deselection.
- Clear a cancelled schedule request's own progress message immediately while preserving newer feedback, including app-driven map changes during deletion.

- Keep the Zone tab selected across saved-map changes and automatically load the new calibrated floor plan. Discard the old rectangle, handle delayed camera calibration without manual Reload, and preserve the loaded zone component when the header/map menu updates.

- Document the companion integration updates for stationless camera bounds, fresh-room discovery, explicit empty room lists and retained placement warnings 2509/2510. These require the updated integration branch; card readiness checks remain unchanged.
- Add troubleshooting for the known Dyson stationless cleaning -> Pause -> Home search, also observed in MyDyson, with confirmed recovery by pausing and manually placing the robot on its station.

- Hide the saved-map switch button when fewer than two valid map options are available. Close an open menu when the list shrinks to one map, and restore the button when another map is reported.

- Show the map-switch start interlock in the header across Rooms, Zone and Schedules. Keep actual dock/robot activity in the status row, including drying time, and avoid repeating the map notice there. Localize the notice in all four languages.

- Keep Spot+Scrub schedule rows, enabled counts and countdowns on the reported active map. Use matching map-scoped integration summaries, show confirmed empty maps without a sync instruction, and cancel obsolete editors/action feedback when the map changes. Integration changes on the map-switching branch retain schedules and checksum baselines per map and make other maps' schedule switches unavailable.

- Clear an earlier saved-map switch error once matching late HA telemetry confirms the requested map. Record the integration corrections for immediate JDM map reports and static-map images when the active map is unknown.

- Add an optional saved-map menu to the Spot+Scrub header, using the matching integration map select on the same robot. Confirm switches through HA readback, retain the existing room updates, and keep map creation, editing and deletion in MyDyson. The feature requires the map-switching integration development branch; upstream v2.2.0 alone does not expose this select.

- Show a local spinner on Station and Robot switches until the requested state is reflected by the same Home Assistant entity. Keep preference writes locked during confirmation, report missing readback after ten seconds without retries, clear warnings on late confirmation, and cancel obsolete feedback after reconfiguration or removal.
- Exclude Spot+Scrub's known cleaning-mode options from the generic suction slider: its fan-speed API selects vacuum/mop modes rather than suction intensity. Document hass-dyson's missing standard fan capability and retain area-only starts for these devices.
- Add an optional shared suction slider below HA area tiles when the exact vacuum exposes FAN_SPEED, native options and the set-fan-speed action. Keep edits local until Start, set only changed values, revalidate before area cleaning, and retain drafts with explicit partial-effect feedback instead of retrying or rolling back. Explain that suction is a global robot preference and may persist after the job.
- Add a generic Home Assistant area-cleaning adapter (`ha_rooms`) for entities reporting CLEAN_AREA. Discover only the robot's mapped HA areas, preserve selection locally, revalidate persisted mappings before one targeted `vacuum.clean_area` call, and support standard session controls without promising room order.
- Prefer specialized adapters in Automatic, deduplicate eligible robots and keep unknown platforms from falling back to Dyson. Localize setup/errors in four languages and hide unavailable room settings, map/zone, preference and info controls for the generic adapter. Foreign-robot live acceptance remains pending.
- Record a successful maintainer live test of the generic HA mode with a Dyson: multiple area starts, Pause/Resume/Home, battery display and browser-local requested-room chips. Clarify that these chips are local request snapshots rather than shared robot telemetry.
- Move room-planning capabilities, field presentation and editor metadata behind the existing Dyson adapters. Hide unsupported room actions/settings, gate dispatch with current adapter readiness, retain legacy entity-based YAML keys and allow room selection without a dedicated HA entity.
- Show hass-dyson selections without execution-order numbers, since its integration controls room order. Preserve Spot+Scrub's numbered selection and existing action payloads.
- Add room-capability regression tests and an entityless-room browser fixture. The maintainer reports successful live checks for both Dyson adapters; document a non-blocking cross-integration Resume exception when both integrations control the same robot.

- Block hass-dyson room starts while returning after normal cleaning completion, matching the existing aborted-return interlock. Keep the return session visible and require resting/charging telemetry before a new job, including revalidation after Save. Preserve starts during drying once the robot is ready. The maintainer confirmed the return interlock in a live retest with the updated bundle.
- Size the Modern drying progress track to the translated status and remaining-time text, ending at the time label with the cancel control alongside it. Keep the time readable on narrow cards by truncating the status label when necessary, and retain the fixed status-row height. The maintainer confirmed the resulting appearance.
- Add compatibility regressions for existing Dyson YAML, native action payloads and adapter selection in mixed households. Record the Dyson-focused review and allow slower local preview navigation in the schedule browser test without changing interaction timeouts or application behavior.

## v1.6.0

- Match the Info overlay's outer inset to the schedule room editor at 4 px.
- Shorten the Info supplies tab labels in all four languages to fit narrow cards, retaining the full localized consumables label as a tooltip.
- Preserve scrolling within an open schedule editor and keep supported session controls usable while schedule transport/readback is pending. Do not confirm deletion from an explicitly incomplete list, and reject schedule creation from stale room-map drafts without discarding them.
- Show a compact local countdown above the schedule list for the next enabled weekly plan in Home Assistant's time zone. Identify incomplete/unknown data, handle clock changes in the calculation and preserve menus and scrolling during refresh.
- Add weekly schedule management for the Spot+Scrub integration v2.2.0: create from room planning, enable/disable, edit days/time and delete individual schedules after confirmation. Detect model capabilities and keep unsupported models read-only.
- Create and edit Spot+Scrub schedules with explicit selected rooms, submitted room order and per-room cleaning settings. Display the schedule's own saved settings and preserve unchanged or unreported values independently of general room preferences.
- Reuse the room planner's tiles, numbered selection circles and cleaning controls in the schedule editor. Keep its draft isolated, match the planner's responsive two-column layout and footer heights, and hide mode-irrelevant water/power settings.
- Introduce a responsive schedule overview with prominent times, a vertical separator, seven weekday chips, matching room colors and an accessible three-dot Edit/Delete menu. Adapt chip spacing to card width and show four entries before scrolling.
- Show a compact active-count badge on the Schedules tab without increasing tab width or wrapping labels. Use confirmed counts, indicate zero in grey and omit unknown counts.
- Replace native time popups with a picker contained inside the card, with explicit Apply/Cancel controls and keyboard navigation.
- Confirm schedule changes from Home Assistant metadata. Keep toggle feedback local, automatically dismiss confirmed create/save/delete notices after three seconds, and retain errors or missing-confirmation warnings without retrying commands.
- Preserve Home Assistant's mounted card during schedule updates so asynchronous rendering does not close menus immediately. Retain list scrolling and open dialogs across state updates.
- Allow deletion of a known schedule even when its reported room plan is empty; room-selection validation applies to creation and editing.
- Add experimental hass-dyson schedule creation, toggling, days/time editing and deletion. Explain its stored-room-selection limitation and avoid presenting unfiltered room names as selected rooms.
- Localize schedule controls in English, German, Dutch and French, and extend adapter, confirmation, accessibility and responsive browser coverage.

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
