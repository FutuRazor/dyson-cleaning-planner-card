# Testing v0.4.1

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

1. Confirm the card header is v0.4.1 and both new Dyson actions exist.
2. Type a title without pressing Enter; confirm immediate preview updates and stable cursor position. Expand two rooms. Confirm unselected rooms have no Not selected suffix. Select Clean repetitions in every cleaning mode, including Vacuum. Check mode-dependent visibility and enable Always show all settings to inspect all four dropdowns.
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
