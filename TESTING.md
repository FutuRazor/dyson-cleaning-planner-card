# Testing v1.6.0

## Local multi-adapter preparation — 25 November 2026

Branch: `experiment/multi_adapter`. Version remains **v1.6.0**. This is an internal room-planning refactor; no additional robot integration is enabled.

- `npm run check`: **130 unit tests**, syntax checks, regenerated bundle and standalone smoke check passed.
- Six Edge browser suites passed: `room-planning-browser`, `browser`, `hass-dyson-browser`, `room-identity-browser`, `schedule-editor-browser` and `zone-browser`.
- The new room-planning tests cover independent Save/Start availability, offline and foreign-device gating, mode-dependent field descriptors, retained Dyson YAML keys, entityless room selection, hidden unsupported controls, unordered checkmarks, blocked dispatch and opaque selection keys. The browser fixture tests both themes at 375/900 px with a test-only adapter and sends no integration commands.

The maintainer reports that live checks for this refactor **passed for both Dyson adapters**, with the cross-integration exception below. This is a maintainer-reported result, separate from the automated fixture checks and earlier release acceptance. The acceptance checklist is:

1. Existing YAML, Automatic/manual integration selection, room exclusions and display order retain the same device and rooms. Check both themes, desktop/mobile and the editor. Spot+Scrub keeps selection numbers; hass-dyson uses checkmarks in Modern and no order numbers in Classic.
2. Select rooms and edit settings without sending a command. Save updates only edited preferences and retains the local selection. Start one small room, then multiple rooms with edited preferences. Verify Spot+Scrub's combined action and hass-dyson's Save-then-Start behavior.
3. Check Pause/Resume/Home, blocked starts during washing, permitted starts during drying and displayed faults. Disconnect/reconnect and confirm a draft survives; change maps and confirm an old draft is rejected without commands or automatic retries.
4. Spot+Scrub: start a small rectangle and check rotation/draft retention. For both adapters, inspect existing schedules and confirm creation, edit/toggle/delete and draft isolation within their supported scope.
5. Report adapter/integration version, robot model, theme and the observed result for each failed step before adding a third adapter. Do not interpret fixture checks as hardware verification.

### Known cross-integration Resume exception

With the same physical robot exposed through both integrations, the maintainer started a rectangle clean through Spot+Scrub, paused it, then pressed Resume through the hass-dyson card. Instead of continuing the rectangle, the robot started a new vacuuming job covering the entire hall. Use of stored/global settings was suspected but not confirmed. The maintainer does not classify this as a category-A defect or a blocker for the current refactor.

Source inspection confirms that Resume calls `vacuum.start` on the selected adapter's vacuum entity without room, rectangle or settings parameters. It does not reconstruct the other integration's job. The precise integration/robot-side cause has not been established by a command trace. Cross-integration continuation of a job is not validated; the normal live acceptance applies to operation through each integration independently. No automatic retry, fallback or application-code workaround was added for this report.

## v1.6.0 release acceptance

This is a stable release without a beta suffix. Only the hass-dyson adapter remains labeled experimental.

### Compact Info tab labels

The third Info tab uses Supplies / Verbrauch / Conso. / Verbruik, with the full localized consumables name in its tooltip. `tests/languages-browser.mjs` checks all three tab labels fit on one line in both themes at 375/450/732 px; station and consumables browser checks retain the existing interactions.

Validation passed: `npm run check` with 126 unit tests and the language, station and consumables browser suites in Edge.

The Info overlay's outer inset now matches the schedule room editor at 4 px. The inset change passed `npm run check` and the layout, language and consumables browser suites, including narrow and manually sized cards.

### PR #39 review follow-up — 24 November 2026

- Validation passed: `npm run check` with **126 unit tests**, rebuilt bundle and standalone smoke checks, plus nine Edge browser suites: the new schedule review regressions, schedule editor, both adapters' schedule flows, shared feedback, asynchronous menus, general planner/session browser checks, prior review regressions and scrolling. The editor fixture now explicitly resets its draft after installing each fresh fixture.
- `tests/schedules-review-browser.mjs` covers all four reproduced CodeRabbit findings with asynchronous HA card rendering: preserve scroll/focus after room selection, settings and HA updates; start a fresh dialog at the top; allow Pause/Resume/Home during schedule transport and readback while retaining action/navigation locks; withhold deletion success for explicitly incomplete lists, including timeout and late confirmation; reject old-map creation drafts and map changes after opening while retaining drafts and allowing refreshed valid creation. Both adapters are covered; editor scroll checks run in Modern and Classic.
- `tests/schedule-confirmation.test.mjs` also checks incomplete-list deletion rejection, complete-list confirmation and compatibility when no sync status is reported. All review validation uses simulated Home Assistant and sends no real robot commands.

### Countdown follow-up — 24 November 2026

- Maintainer live verification confirmed that the countdown works in Home Assistant and immediately updates the next planned start when schedules are enabled or disabled.
- Validation passed: `npm run check` with **125 unit tests**, regenerated bundle and standalone smoke checks. Edge browser checks passed for the countdown, responsive schedule layout/design, shared feedback, asynchronous menus and hass-dyson's dock/session timer regression. Countdown screenshots were reviewed at narrow and wide widths; no real robot commands were sent.
- The overview now shows a compact countdown above its first row. `tests/schedule-countdown.test.mjs` covers HA-local dates, enabled weekdays, chronological selection, week/year rollover, fractional offsets, DST gaps/overlaps, unknown/one-time data and duration formatting.
- Run `node tests/schedules-countdown-browser.mjs` for both adapters with a browser in a different time zone: local ticking without HA events/actions, state changes, preserved menu nodes, missing metadata and compact one-line layouts in both themes/four languages at 320/375/732 px. Screenshots are saved under `artifacts/schedules-countdown/`.

### Initial release review — 24 November 2026

- `npm run check` passed all **120 unit tests**, source syntax checks, bundle generation and standalone registration/discovery checks for both adapters.
- All **30 browser scripts** passed in headless Edge against simulated Home Assistant. Coverage includes room drafts and actions, zones and map rotation, session controls, readiness, dock/robot settings, consumables, translations, keyboard interaction, scrolling, both adapters and the complete schedule UI. The scroll suite also passed separately with `CARD_THEME=modern`.
- Visually reviewed generated Modern schedule overview and editor screenshots at narrow and wide widths. Responsive layout, four-row scrolling, weekday states, room chips and the active-count badge passed the browser layout checks.
- Updated older Classic regression scripts to select Classic explicitly, scoped Info assertions to the current Station/Robot/Consumables tabs, and accounted for header notices covering titles during map loading. These were outdated test expectations, not application defects.
- A final edge-case check reproduced and fixed deletion being silently blocked when a Spot+Scrub schedule reported no selected rooms. The browser regression verifies the exact schedule ID is deleted and the dialog closes; creation/editing still require a room selection. After the fix, `npm run check`, both adapters' schedule browser flows and the shared confirmation/feedback suite passed again.
- Verified release-version consistency, local documentation links and reproducible bundle generation. Automated checks send no commands to a real robot; scheduled execution, actual room execution order and daylight-saving behavior remain separate live checks.

### Release acceptance checklist

- Run `npm run check`: 126 unit tests, syntax checks, generated bundle and standalone-bundle smoke checks for both adapters.
- Run `node tests/schedules-browser.mjs` with Playwright for the experimental hass-dyson schedule flow: create with the stored-room-selection warning, edit only days/time, toggle enabled state, retain room drafts and failed dialogs, preserve keyboard focus, survive HA updates, and check both themes at mobile/desktop widths. Assert that unfiltered room names from the integration are not presented as selected rooms. Legacy Spot+Scrub builds without schedule metadata stay unchanged. This uses simulated HA and creates no real schedules.
- Run `node tests/spot-schedules-browser.mjs` for the Spot+Scrub v2.2.0 schedule interface: all three planning tabs and their ARIA relationships, explicit selected IDs/order and schedule-only settings, accurate selected-room names, edit/toggle/delete, room reorder/add/remove, saved schedule settings distinct from live preferences, preselection/readback after reopening, explicit setting overrides, legacy/partial metadata without assumed values, empty-plan/map validation, dismissible header messages, read-only model behavior, sync warnings, four-row scrolling, offline states and backend rejection. Both themes run at 375/900 px. `tests/spot-schedules.test.mjs` covers map/identity isolation, exact payloads, missing capabilities, invalid drafts and locking. Maintainer live checks and remaining execution checks are recorded in [Spot+Scrub schedule validation](docs/spot-scrub-schedules.md#validation).
- The schedule browser check also selects and applies 21:15 using only mouse clicks, cancels a tentative time without losing the applied value, preserves an open time picker across HA updates, verifies its horizontal bounds at 375/900 px in both themes, and checks arrow/Home/End/Escape navigation.
- Spot+Scrub schedule checks cover mode-dependent water/power visibility, combined and unknown modes, the all-settings override, summary relevance, and retaining hidden choices without transmitting their overrides.
- Schedule deletion tests cover enabled/disabled entries, exact same-device ID targeting, unavailable/foreign targets, missing service capabilities, cancellation and Cancel focus, delayed authoritative removal, repeated-click protection, error retention, and locking against other room/schedule writes. The fixture deletes simulated schedules only.
- Run `node tests/schedules-layout-browser.mjs` to verify rounded schedule cards, seven weekday badges, switch/menu alignment, bounded Edit/Delete menus, keyboard navigation, natural growth for three/four entries, stable card height for five/eight entries, scrolling only the rows, retained scroll across HA updates/dialogs, and responsive resizing in both themes at 375/900 px.
- Run `node tests/schedules-design-browser.mjs` for light/dark visual acceptance of both themes at narrow, medium and wide widths. Verify weekdays stay beside the time with a vertical separator at 512/600/732 px viewport widths, plus selected weekday states, consistent room colors, four complete cards and outside-click menu dismissal. Screenshots are written to `artifacts/schedules-design/` using simulated HA only.
- The design check also resizes continuously through the weekday wrap: chips must narrow first, widen on their new line, and narrow again at smaller widths, with equal chip widths, unchanged label size and readable text. Check the closer control spacing and reduced right inset throughout.
- Run `node tests/schedules-badge-browser.mjs` for the active-count badge across both themes, light/dark appearance, all four languages and 320/375/450/732 px widths. Cover zero, one, two digits, capped large counts and unknown metadata; the tab bar and labels must keep their size and remain on one line. Feedback checks also verify that pending toggles leave the count unchanged until HA confirms the new state.
- Run `node tests/schedules-feedback-browser.mjs` for both adapters with delayed authoritative state: local toggle spinner without header chatter, confirmed create/save/delete notices that expire after three seconds, persistent failures and confirmation timeouts, late state updates, no automatic retries, timer ownership and cancellation after reconfiguration. `tests/schedule-confirmation.test.mjs` checks selected room order/map/settings and unique new schedule identity before success.
- Run `node tests/schedules-menu-browser.mjs` to reproduce HA's asynchronous `ha-card` slot rendering. Verify repeated three-dot menu opening with mouse and touch, survival across HA updates, and opening/cancelling Edit and Delete without sending actions. This regression failed before retaining the mounted HA card; the default preview's unregistered `ha-card` did not expose that timing issue.
- Run `node tests/schedule-editor-browser.mjs` for the planner-style schedule editor in both themes at 375/512/540/560/600/900 px: all rooms, numbered circle selection and reorder, shared sliders/repetition controls, a split or inline settings panel matching the planner at the same card width, a small outer inset, footer heights matching the planner, isolated drafts, discard without commands, and explicit room selection/settings during creation. Screenshots are written to `artifacts/schedule-editor/`; HA slot rendering is asynchronous in this fixture.
- Run `node tests/review-regressions-browser.mjs` to check finished-session handling, readiness warnings during drying, editor registry loading, transient detach during Save and session-control integration isolation. The preview icon stub supports reconnection so the detach check also rejects browser errors.
- Run `node tests/hass-dyson-browser.mjs`, `node tests/batch-browser.mjs` and `node tests/zone-browser.mjs` with Playwright and an installed browser to cover both adapters.
- Maintainer live checks confirmed hass-dyson Save/readback, room starts, Pause/Resume/Home, battery percentage, vacuum/mop coverage, dock status, drying remaining time, washing start interlock and starting during drying.
- Preserve existing Spot+Scrub configuration, action payloads and zone support. Keep unsupported hass-dyson controls hidden and reject ambiguous multi-map room starts.
- Verify the package, lockfile, README, integration contract and generated bundle identify v1.6.0. The UI intentionally has no version badge; do not reintroduce one for this release.

## Integration adapters

PR review validation on 23 November 2026: all 95 unit tests, syntax checks and both adapter bundle smoke checks passed. Edge browser checks passed for the review regressions, hass-dyson, Spot+Scrub batch drafts, zones and editor session previews. These runs used simulated Home Assistant entities and did not send commands to a real robot.

The card retains the tested Spot+Scrub adapter and adds an experimental hass-dyson adapter with automatic/explicit integration selection. See [adapter boundaries and live acceptance](docs/integration-adapter.md) and [hass-dyson setup and limitations](docs/hass-dyson.md). The validation notes below record the staged implementation under v1.4.0; current release acceptance is recorded above.

- Run `node tests/hass-dyson-browser.mjs` with Playwright to verify the new adapter's editor selection, both themes, Save/Start, combined two-panel image, consumables and standard session controls against simulated HA.
- `tests/hass-dyson.test.mjs` covers native identities/options, translated payloads, map ambiguity, readiness, partial failures, shared locking and replacement HA snapshots between Save and Start.

Validation on 23 November 2026: `npm run check` passed all 82 unit tests, rebuilt v1.4.0 and passed the standalone-bundle check. The new hass-dyson browser flow passed in Edge, together with Spot+Scrub batch, editor-session-preview and zone browser regressions. All new adapter commands were sent only to simulated HA; real hass-dyson/robot acceptance remains pending.

Subsequent maintainer live tests confirmed hass-dyson Save/readback, room start, Pause/Resume/Home and separate vacuum/mop coverage in the combined image. The dock-state interlock correction passes **84 unit tests**, build/smoke checks and the hass-dyson browser flow. New cases cover washing/collection/drying, unavailable/disabled/ambiguous dock sensors and washing beginning between Save and Start. Live recheck: select a room during roller washing, confirm Start is disabled with the dock activity shown, then verify it becomes available when the sensor returns to `IDLE`.

Dock display/timer follow-up: **87 unit tests** pass. The hass-dyson browser flow now also checks washing/drying in both themes while the vacuum reports `error`, local countdown refresh without an HA update, no invented percentage/cancellation control, and removal of the countdown at `IDLE`. Timestamp tests cover explicit offsets, zero remaining time, invalid/disabled/duplicate/foreign sensors and renamed entity IDs. The original Spot+Scrub sample-based drying behavior remains unchanged.

Start-during-drying follow-up: **89 unit tests** pass. Room Start is allowed during `DRYING_MOP` with and without edited preferences; only the usual Save/Start actions are sent. Washing/collection, missing dock telemetry, mapping, unavailable robots and explicit readiness vetoes remain blocked. The hass-dyson browser flow exercises the enabled Start button and two-step room start while drying. Drying status/timer remain until integration telemetry reports a change; the card does not optimistically cancel drying.

- `npm run check` includes adapter isolation, shared in-flight locking, normalized telemetry, exact zone dispatch and a standalone generated-bundle smoke check, in addition to existing regression tests.
- Run `node tests/batch-browser.mjs`, `node tests/zone-browser.mjs`, `node tests/robot-bumper-browser.mjs`, `node tests/start-readiness-browser.mjs`, `node tests/room-identity-browser.mjs` and `node tests/editor-session-preview-browser.mjs` with Playwright and an installed browser (`BROWSER_CHANNEL=msedge` on Windows where applicable).
- Maintainer Spot+Scrub live checks passed; the separate integration fix for zone Pause/Resume was also confirmed. Subsequent hass-dyson live confirmations are included in the current acceptance above.

Validation on 21 November 2026: all 69 unit tests, the generated-bundle smoke check and the six browser scripts listed above passed in Edge. At that point, `tests/ui-browser.mjs` still used select-only expectations against the Modern controls; the identical failure was reproduced with the unchanged HEAD bundle. The v1.6.0 release review corrected that test's explicit theme and verified the full script. The zone browser screenshot path uses `fileURLToPath` so workspace paths containing spaces work on Windows.

## v1.4.0 release acceptance

- Run `npm run check` and `node tests/zone-browser.mjs`; verify the compiled bundle is reproducible.
- Verify Rooms/Zone draft retention, rotated-map selection, edge-aware resize handles, touch input and fixed-height scrolling.
- Check all modes and their relevant settings, English/German repetition labels, and one service call only when Start is pressed.
- Reject missing/mismatched calibration, changed map IDs, a foreign camera and unavailable start readiness.
- Maintainer hardware tests confirmed vacuum zone cleaning, selection at 270° on iPhone and zones spanning two rooms. Further tests confirmed two vacuum passes with `mop_passes: 2`, and one vacuum pass followed by two mop passes in Vacuum then Mop.
- `dry_passes: 2` did not produce a second vacuum pass on the tested Spot+Scrub AI; the card keeps it at 1.
- Before release, confirm integration v2.1.0 includes the matching zone action and calibration. Do not infer support for untested models.

## v1.3.0 release acceptance

- Run `npm run check` and `node tests/languages-browser.mjs` with Playwright and Edge available.
- Verify Automatic follows the Home Assistant user language, explicit English/German overrides apply per card, and unsupported languages fall back to English.
- Check translated planner, session, Info overlay, visual editor and tooltips in Modern and Classic; room/device names and custom titles must remain unchanged.
- Switch languages with a local draft and confirm selection and settings are retained. Save and Start must still send the original integration values.
- Check narrow and wide layouts for clipping, wrapping and horizontal overflow. Recheck scroll retention and editor session previews.
- The maintainer confirmed the language feature in live Home Assistant: no clipped or incorrectly formatted text was observed.


## v1.2.0 release acceptance

- Run `npm run check`, `node tests/themes-browser.mjs` and `node tests/compact-theme-browser.mjs` with Playwright and Edge installed.
- Verify Modern is the default, explicitly selected Classic is retained, and both use the same draft and ordered start payload.
- Check separate circle/settings click targets, stepped sliders, mode-dependent fields and fixed-height scrolling.
- Verify split-view alignment at 482, 560, 700 and 1000 px with 1, 2, 4 and 5 rooms. The mobile view remains content-sized.
- The maintainer confirmed the final layout in live Home Assistant across different widths and room counts before release preparation.


## v0.3.5 acceptance

The user confirmed the fault subtitle and relocated controls in live Home Assistant with the v0.3.4a/b test builds. Check that the discard icon is visible only with a draft, preserves the summary row height and sends no robot command. Refresh rooms is below room ordering in the visual editor and refreshes the preview without changing room order, exclusions or draft settings. Fault subtitles disappear with the active fault; status logic is unchanged.

## v0.4.0 cleanup

Verify Save and Start with the global mode and original start-button entities absent. Old `mode_entity` and `start_entity` keys are ignored. Missing batch actions must produce an error without individual entity calls. Station switches, selects and buttons and vacuum Pause/Resume/Home remain supported.

## v0.4.1 visual improvements

Check the consumables tab in light and dark themes at narrow and desktop widths. Names and remaining values are stacked on the left; compact bars align on the right. Ready to use, Refill required and Unavailable are non-interactive chips. Low-life warning colors, Info attention, focus handling and local drafts remain unchanged.

## Automated checks

- Core regression tests cover discovery, session states, controls, camera sizing and battery status.
- Batch tests cover exact Save/Start payloads, multiple rooms, Unicode/renamed entities, missing actions, stale IDs, unavailable fields and concurrent requests.
- Browser checks use simulated HA entities to exercise independent room drafts, Save without Start, combined Start payloads, active views, editor, mobile layout, camera rotation/polling and request cleanup.

Run `node --test tests/*.test.mjs`, `node scripts/build.mjs` and `node tests/browser.mjs` , `node tests/batch-browser.mjs` and `node tests/ui-browser.mjs` with Playwright available. These checks do not contact a real robot.

## Start readiness

Run `node tests/start-readiness-browser.mjs` with Playwright and Edge available. It checks return, washing, dust collection, drying and ready transitions, start-button availability, draft retention, and the older-integration fallback.

The v0.3.3a test build was verified in live Home Assistant: return status appeared, Start stayed disabled through the return and station cleanup, and became available after dust collection or roller washing. Mapping has not been tested on the real robot; its reason label is supported when reported by the integration.

## Real Home Assistant checklist

- Regression coverage: run `node tests/scroll-browser.mjs` and `node tests/layout-browser.mjs` with Playwright and Edge available. These verify fixed-height scrolling, view transitions, loading during a clean, and the drying bar's spacing at several widths.
- Live acceptance for v0.3.3: the user confirmed dropdown dismissal, stable planner scrolling, visible cleaning sessions and the drying bar on multiple devices. Preview tests do not fully reproduce Home Assistant's layout.
- Recheck scroll retention after room selection, expanding/collapsing settings and changing modes. Verify each view transition starts at the top, including reloading during an active clean.
- During drying, verify the bar shrinks with remaining time, ends before Cancel and disappears without valid total/remaining values. Confirm 0 remaining yields an empty bar without inferring the dock is idle.

1. Confirm the Info overlay starts with both tabs and a right-aligned close button in one row, with no Info heading or version badge. Check narrow and desktop widths in both planner/session views. Confirm save_room_settings and start_rooms_with_settings are available with integration v1.5.0 or newer.
2. Type a title without pressing Enter; confirm immediate preview updates and stable cursor position. In Classic, expand two rooms; in Modern, opening another room replaces the open settings. Confirm unselected rooms have no Not selected suffix. Select Clean repetitions in every cleaning mode, including Vacuum. Check mode-dependent visibility and enable Always show all settings to inspect all four settings.
3. Change several options. HA entities and the robot must remain unchanged during editing. Only the edited room should change in the card.
4. Click Save settings. Confirm one `save_room_settings` action carries all changes, HA reflects the values, and cleaning does not start. The card's room selection must remain selected.
5. Change another setting, then use the trash icon beside Local draft. Confirm no service call occurs and current HA values return.
6. Select one room and use Start clean. Confirm a single `start_rooms_with_settings` action contains the room ID and unsaved changes, with no individual select/switch/button calls.
7. Check actual robot behavior and settings. Then try multiple rooms; do not assume transmitted list order guarantees execution order.
8. Check the active view, camera rotation/disable, battery and Pause/Resume/Home. Queue cancellation and pause behavior are determined by the integration.
9. Rename a room or entity and Refresh rooms. Confirm active room IDs remain correctly associated; ambiguous or missing edited rooms must give an error rather than targeting another room.
10. Check missing/unavailable settings with both editor options (disabled/hidden). Simulate an action error and ensure the draft remains without automatic retries.

HA value confirmation means the integration has updated its states. It is not proof that the robot acknowledged the settings. Cross-client editing and stale integration caches still need observation on the real device.

## Cleaning and dock activity

- Verify the session header reads **Cleaning session**, with the live status below it and room badges below the status.
- Compare Vacuuming/Mopping against the vacuum entity's `full_clean_action`; missing or unknown phases should show Cleaning, not the configured mode.
- After docking, check Washing, Drying and Dust collection messages above the planner rooms. Confirm they disappear at `dock_state: IDLE`.
- Start must be enabled during drying when a room is selected, and disabled during washing and dust collection. Locally edited settings must survive status changes.
- Verify Remaining time updates from drying_remaining_seconds, including 0 and missing values. Cancel drying must call dyson_spot_scrub.cancel_drying exactly once with the selected vacuum; it stays disabled without that service or during a request. The dock status must remain unchanged until new telemetry arrives.
- Confirm real faults and unavailable/disconnected states remain visible even when a dock attribute is present.

## Single-room session badges

Run `node tests/session-badges-browser.mjs` with Playwright available. It covers a one-room start, brief idle/docked updates, cancellation of pending cleanup, and removal of old badges after a stable ready state.

On the robot, start one room from this card and watch the badge through startup. If it disappears, record the vacuum state transitions and whether the dashboard was reloaded. Requested rooms are local to the card instance; external starts and page reloads do not provide a confirmed room list. The card retains the request for five seconds after returning to the planner to tolerate brief idle/docked transitions.

## Dashboard sizing

Run `node tests/layout-browser.mjs` with Playwright available. In a real Sections dashboard, verify the 9-column minimum, automatic height, manual height with reachable controls, and restoring Auto height. Check the planner, active session and consumables overlay.

## Station settings (v0.4.0)

Run `node tests/station-browser.mjs` with Playwright and Edge available. Verify exact service targeting, live state updates, draft preservation, missing entities and service errors. On real hardware, check all six settings against the Dyson app; settings should update immediately without Save or Start. Check both tabs, keyboard navigation, mobile scrolling, and the low-consumables Info indicator. Hardware validation of the new station UI remains pending.

Station switch browser checks use a preview-only `ha-switch` mock. Production uses the component supplied by Home Assistant; verify native appearance and toggling in a real HA dashboard.

## Station actions and drying sensor (v0.4.0)

- Verify native Press buttons in HA, including hover, keyboard focus and disabled appearance. Preview controls are mocks.
- Check one button.press call per press, unavailable actions, errors and unchanged room drafts.
- Check sensor discovery after renaming, remaining time and total-based progress, unavailable/unknown readings, and legacy fallback only without the sensor.
