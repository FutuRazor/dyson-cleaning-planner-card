# Testing v0.3.2

## Automated checks

- Core regression tests cover discovery, legacy behavior, session states, controls, camera sizing and battery status.
- Batch tests cover exact Save/Start payloads, multiple rooms, Unicode/renamed entities, missing actions, stale IDs, unavailable fields and concurrent requests.
- Browser checks use simulated HA entities to exercise independent room drafts, Save without Start, combined Start payloads, active views, editor, mobile layout, camera rotation/polling and request cleanup.

Run `node --test tests/*.test.mjs`, `node scripts/build.mjs` and `node tests/browser.mjs` , `node tests/batch-browser.mjs` and `node tests/ui-browser.mjs` with Playwright available. These checks do not contact a real robot.

## Real Home Assistant checklist

1. Confirm the card header is v0.3.2 and both new Dyson actions exist.
2. Type a title without pressing Enter; confirm immediate preview updates and stable cursor position. Expand two rooms. Confirm unselected rooms have no Not selected suffix. Select Clean repetitions in every cleaning mode, including Vacuum. Check mode-dependent visibility and enable Always show all settings to inspect all four dropdowns.
3. Change several options. HA entities and the robot must remain unchanged during editing. Only the edited room should change in the card.
4. Click Save settings. Confirm one `save_room_settings` action carries all changes, HA reflects the values, and cleaning does not start. The card's room selection must remain selected.
5. Change another setting, then Discard draft. Confirm no service call occurs and current HA values return.
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
