# Testing v1.7.1

## Current validation status - 26 November 2026

Current card version is **1.7.1**. Latest full card checks: **192 unit tests**, rebuilt bundle and smoke check. The unchanged companion integration's latest full suite passed **449 tests**. Browser coverage and maintainer observations are recorded separately below.

| Area | Current evidence/status |
| --- | --- |
| Map selection in HA/Lovelace and MyDyson | Maintainer live confirmation in both directions |
| Single-map button visibility | Deleting B hides the button; creating another map restores it, confirmed live |
| Schedules and availability per map | Confirmed live in both integration and card |
| Stationless camera bounds | Corrected camera looks good in maintainer live check; original raw dock value remains uncaptured |
| Map-switch notice in the header | Unit/browser checks passed; separate live confirmation was not reported |
| Zone tab and automatic floor-plan loading on map changes | Unit/browser checks passed; maintainer live acceptance confirmed |
| v1.7.1 map visibility, chips and editor | Unit/browser checks passed; maintainer live acceptance pending |
| Compact map chips without draft reminders | Maintainer confirmed appearance and operation in a live test |
| Saved-map display order and editor arrows | Unit/browser checks passed; maintainer live acceptance pending |
| Automatic old-map room-draft reset | Unit/browser checks passed; maintainer live acceptance pending |
| PR #40 review corrections | Unit/browser checks passed; initial maintainer live check reported no new errors |
| Robot fault-text localization | Integration descriptions are passed through; English texts for 2509/2510 remain a deferred follow-up |
| Fresh-room discovery before a first clean | Integration regressions passed; live creation check pending |
| Idle off-dock retry with retained placement faults 2509/2510 | Integration regressions passed; corrected HA/card retry still needs live acceptance |
| Stationless cleaning → Pause → Home search | Known Dyson behavior also observed in MyDyson; pause and manual docking recovery confirmed |

Additional integration/map checks are listed in [the map notes](docs/spot-scrub-maps.md#remaining-live-checks). Entries below are chronological records and retain their original versions/test counts; an old pending statement does not supersede a later confirmation.

## Saved-map display order - 26 November 2026

`map_order` stores stable map IDs and affects both chips and the header menu. Listed maps appear first; unlisted maps retain integration order at the end. Renames retain ordering, deleted/unknown IDs are ignored, duplicate IDs are normalized, and hidden-map handling remains unchanged. The editor orders the complete catalogue, offers up/down arrows, retains ordering on refresh and clears it for another robot. Labels and validation are translated in all four languages. Reordering sends no robot commands and does not mutate HA catalogue data.

Validation passed: `npm run check` with **192 unit tests**, rebuilt v1.7.1 bundle and smoke check. `map-preferences-browser` passed in Modern/Classic at 375/900 px, including YAML order, editor moves, disabled boundary arrows, hidden/new maps, identical menu order, refresh, robot/adapter changes and zero service calls from reordering. `editor-session-preview-browser` also passed. Browser actions use simulated HA only; live acceptance of map ordering is pending.

## Compact map chips - 26 November 2026

Map chips keep their 13 px label size, with vertical padding reduced from 7 to 5 px and minimum height from 36 to 32 px. Both states omit the checkmark slot. The target's pending spinner is centered over its retained label space to prevent layout shifts. Validation passed: `npm run check` with **190 unit tests**, rebuilt bundle and smoke check, plus `map-preferences-browser` in Modern/Classic at 375/900 px. Version remains **1.7.1**.

The draft-discard reminder was subsequently removed from both chips and the header menu, including its unused translations. Automatic draft reset still occurs only after confirmed switching. `npm run check` (**190 unit tests**, rebuilt bundle and smoke check), `map-selection-browser` and `map-preferences-browser` passed; the browser checks now assert that local edits show no reminder and retain coverage for hidden-map notices and switching behavior.

The maintainer subsequently confirmed that the flatter chips and layout without the reminder look good and work in a live test.

## Automatic room-draft reset on card map changes - 26 November 2026

The maintainer requested direct map selection without first discarding local room edits. Both menu and chips now keep that draft while a request is pending, then reset only the old map's local selection/settings after matching select/vacuum readback confirms the target. The reset uses a fresh room model and runs once per request. Rejection or a timeout on the original map retains the draft. Late confirmation respects newer target-map drafts and newer feedback. Existing request locks and backend/context validation remain; no preference Save or cleaning Start is sent.

Validation passed: `npm run check` with **190 unit tests**, rebuilt v1.7.1 bundle and smoke check. `map-draft.test.mjs` uses the real card model/reset methods to cover partial/unknown IDs, reused room ID 10, rejection, early readback during pending transport, immediate service-time telemetry, late/newer drafts and feedback, and obsolete lifecycles. Chromium browser suites `map-draft-browser`, `map-selection-browser`, `map-preferences-browser`, `zone-map-switching-browser` and `room-identity-browser` passed. The new flow runs menu/chips in Modern/Classic at 375/900 px with real room-control edits, both readbacks, rejection, timeout, late confirmation and new target-map drafts. Browser actions use simulated HA only. Unrelated external-map context guards remain covered; maintainer live acceptance of automatic discard is pending. Version remains **1.7.1**.

## v1.7.1 map visibility and chips - 26 November 2026

Implementation is on `fix/map-switching`, based on the pending v1.7.0 adapter branch. `map_selector_style` selects the existing header menu or optional wrapping chips. `excluded_maps` stores canonical string IDs and filters only display targets; the full catalogue remains authoritative for readiness and confirmation. A hidden active map retains a visible return path or an identifying notice if all maps are hidden. The editor uses the complete known list, handles rename/deletion/new IDs, allows every map to be re-enabled and resets exclusions for another robot. The controls, notes and validation are translated in all four languages. No companion integration changes are needed.

Validation passed: `npm run check` with **184 unit tests**, generated v1.7.1 bundle and smoke check. Chromium browser suites `map-preferences-browser`, `map-selection-browser`, `zone-map-switching-browser`, `map-schedules-browser` and `editor-session-preview-browser` passed. Map preferences cover Modern/Classic at 375/900 px, long wrapping labels, keyboard switching, target-only progress, both select/vacuum readbacks, draft locks, hidden-active return paths, all-hidden notices, rename/deletion/new maps, four editor languages, refresh without service calls, unsupported adapters, robot changes, timeout/rejection and late readback. Zone map-switch coverage now runs both menu and chips in both themes/widths, including delayed calibration and temporary session states. Narrow Modern/Classic chip layouts were visually checked. Browser actions use simulated HA only; maintainer live acceptance of the new display options is pending.

Package metadata, lockfile, README, current contract/adapter documentation, changelog/testing header and generated banner are aligned to **1.7.1**. Historical records below retain their original versions and test counts; the Dreame prototype remains outside the bundle.

## PR #40 review corrections - 26 November 2026

The [CodeRabbit review of PR #40](https://github.com/FutuRazor/dyson-cleaning-planner-card/pull/40) on `76d9892` contained four inline findings and one unverified offline-prototype finding. All five were verified against code, regressions and the prototype's pinned Dreame source. The original HA adapter also reproduces an obsolete command dispatch in each promise gap: before a fan write, before area-only cleaning and after the second validation following a fan write.

The HA area adapter now checks its current lifecycle synchronously immediately before both service calls. Closing the saved-map menu removes only its popup and updates ARIA/cache state, preserving checkbox/label activation. Schedule requests retain ownership of their progress message; cancellation clears that message immediately only if newer feedback has not replaced it. The offline Dreame fixture publishes water changes to the active humidity select using its native option tokens, and the prototype derives its water-check/self-repair veto from published detail state/status. These Dreame changes remain outside the runtime bundle.

Validation passed: `npm run check` with **178 unit tests**, rebuilt v1.7.0 bundle and smoke check; `npm run prototype:dreame` with zero dispatched commands; and six Chromium browser suites: `map-selection-browser`, `map-schedules-browser`, `ha-rooms-browser`, `ha-fan-speed-browser`, `schedules-feedback-browser` and `zone-map-switching-browser`. New coverage checks one-click checkbox/label activation in Modern/Classic at 375/900 px, immediate deletion-progress cancellation before transport completion, preservation of newer feedback, lifecycle changes queued after room validation, all water-control publication variants and published maintenance-state vetoes. The schedule-feedback browser fixture now retains its dynamic import and installs its fake clock after setup to avoid Chromium's collected-promise error. These checks use simulated HA and send no real robot commands. Version remains **1.7.0**.

After installing the review corrections, the maintainer performed an initial live check and reported no newly observed errors. This is an initial smoke-check observation; individual timing/cancellation cases were not separately described, and it does not establish Dreame hardware support.

## v1.7.0 release documentation - 26 November 2026

The maintainer requested stable-release documentation for **v1.7.0** after confirming the Zone map-switch correction live. Current release-candidate labels are removed from the README, changelog and testing header. Release notes explicitly retain the dependency on the map-switching integration development branch and the hidden optional controls when an integration lacks the matching map select. Fault descriptions continue to be passed through from the integration; localization of the new English 2509/2510 texts remains deferred. Historical candidate-stage records below retain their original context.

This preparation changes documentation only. Package/lockfile version and generated bundle remain at **1.7.0**. Documentation diffs and version consistency were checked; application tests were not repeated because application code and bundle are unchanged. This does not merge the branch or publish a release.

## Zone view across saved-map changes - 26 November 2026

The maintainer reported that changing maps retains Schedules but leaves Zone for Rooms. Session status now temporarily overrides the selected Zone tab as it does Schedules, retaining that choice for the next ready state. A map-ID change cancels obsolete image loading, drops the old rectangle and automatically verifies a new PNG/calibration pair. A late matching camera-calibration update can restart the bounded image reads after an earlier mismatch; identical telemetry does not cause a retry loop. Header/map-menu updates retain the mounted zone component and its frozen selection. Actual cleaning or a local zone start still opens the session view; a local zone start explicitly leaves the editor.

Validation passed: `npm run check` with **175 unit tests**, regenerated v1.7.0 bundle and smoke checks. The new `tests/zone-map-switching-browser.mjs` passed in Chromium for Modern/Classic at 375/900 px, covering card/app changes, the selected tab, old-rectangle removal, changed image dimensions, delayed calibration and session-state transitions. Existing `tests/zone-browser.mjs` and `tests/map-selection-browser.mjs` also passed. All browser actions use simulated HA. Integration code and versions are unchanged. The maintainer subsequently confirmed the correction live: Zone remains selected and the new floor plan loads after a map change. This acceptance does not separately confirm every delayed-readback or temporary-session case covered by the browser tests.

## Stationless Pause → Home troubleshooting - 26 November 2026

The maintainer clarified that the stationless **cleaning → Pause → Home** search is also present in the original MyDyson app and should be documented as a known Dyson operating edge case, not pursued as an integration/card defect. Their confirmed recovery is to pause the robot and place it manually on the charging station. Troubleshooting in both READMEs and the map notes now records that sequence. This documentation-only clarification does not change commands, application code or release versions; application tests were not repeated.

## Fresh rooms and stationless placement faults - 26 November 2026

The maintainer confirmed the single-map button rule live: deleting B leaves one integration option and hides the Lovelace button; creating a new map restores it. They supplied `home-assistant_dyson_spot_scrub_2026-11-26T04-19-58.659Z.log` for four stationless runs (1/4 app, 2/3 Lovelace), new-room discovery and faults 2509/2510. All four Home actions use ABORT followed by `service.start_recharge`. Only runs 3/4 were paused first; those report temporary map ID `0` and the maintainer observed localization/station searching. Runs 1/2 parked at the placement point. The command logic remains unchanged.

The log captures 2510 retained as USER_CONTINUE while INACTIVE_DISCHARGING and a subsequent successful MyDyson start. The integration previously allowed retained-continue retries only on the dock; it now allows the two known placement codes while confirmed idle off-dock, keeping their warning and normal active/fault/dock vetoes. Their messages and placement instructions are added to the integration dictionary. Existing card behavior opens the planner for an error with literal `ready_to_start: true`; no card-side code or readiness bypass is added.

Room discovery now refreshes preferences and metadata after map lifecycle/catalogue changes, retries missing preferences on catalogue polls, and can create room entities from that map's metadata without inventing settings. An unresolved active list is explicitly empty instead of borrowing A's cached rooms. The log includes B's Essbereich preference at 05:08:39.715 before the first START at 05:08:54.345, but not mapping itself or an entity-registry snapshot, so the reported initial entity delay needs a new live creation check.

Validation passed: all **449 integration tests**, including a sanitized four-run/fault fixture and nine new regressions for retained placement warnings, start readiness, normal backend room Start, metadata-only discovery, empty-map attributes and lifecycle refresh. The corrected readiness/discovery still need live acceptance. This changes the companion integration only; card source, bundle and v1.7.0 candidate version are unchanged.

## Saved-map button visibility - 26 November 2026

The header now offers map switching only when at least two validated map options are reported. A list reduced to one map closes an open menu and removes the button; adding another map restores the button without reopening that menu. The integration select and map/schedule handling remain available independently of this presentation rule. Release-candidate version 1.7.0 is unchanged.

Validation passed: `npm run check`, **174 unit tests**, rebuilt bundle and standalone smoke checks. The saved-map browser suite passed in Modern/Classic at 375/900 px, including shrinking an open menu to one map, hiding the button and restoring it after a second option appears.

## Map-switch header notice in Schedules - 26 November 2026

The maintainer reported the brief map-switch start interlock appearing in the drying/return activity row while viewing Schedules. The shared Spot+Scrub status fallback treated the new `map_switching` reason as unknown readiness text; the schedule view did not supply the room planner's header notice. This was a shared status-routing issue rather than a schedule-action message.

The adapter now recognizes `map_switching` and provides an optional header `notice` separately from actual activity text. All views use the existing dismissible header overlay for it. Drying and its remaining time stay in the activity row; idle Classic does not invent an activity row for the notice. Duplicate start-block text in that row is hidden, and actual readiness/start rejection remains unchanged. The notice is localized in English, German, Dutch and French. Other readiness fallbacks (waiting for ready state, a cleaning job still active, unknown integration reasons) keep their existing activity-row behavior. Schedule action feedback already uses the header; list availability/sync/empty-state notes and editor explanations remain within their schedule content/dialog.

Validation passed: `npm run check`, **174 unit tests**, rebuilt v1.7.0 bundle and standalone smoke checks. Four browser suites passed: map-scoped schedules in Modern/Classic at 375/900 px, header notices, start readiness and Modern status. The new browser assertions cover header-only map notices, simultaneous drying, dismissal across unchanged telemetry and clearing when readiness returns. This card-only change retains release-candidate version 1.7.0.

## Stationless camera bounds - 26 November 2026

The maintainer supplied two screenshots showing a tiny floor in the bottom-left corner and a zone badge around 112,433 x 112,378 cm, then confirmed the issue affects only B without a station. The integration renderer admitted arbitrary dock positions into canvas bounds. A synthetic 4 x 3 m room with a dock at (10,000, 10,000) reproduced the visual failure; the raw dock value on B has not been captured, so the exact live trigger remains unconfirmed.

The integration correction reuses its existing room-geometry/dock-reach check before including a dock in bounds or drawing. Invalid/remote points are omitted, valid static docks can survive invalid live reports, and valid zero/near-wall/translated-origin coordinates remain supported. The synthetic image changes from 4096 x 4096 at about 0.4 pixels/metre to 450 x 370 at 80 pixels/metre; the corrected output was visually checked. All **440 integration tests** passed, including six new synthetic bounds regressions. At that stage, live camera acceptance on B was still pending; the later maintainer confirmation is recorded below. This changes the companion integration only; card source, generated bundle and v1.7.0 version remain unchanged.

The maintainer subsequently confirmed that the corrected camera looks good. This is live visual acceptance of the rendering correction; the original raw dock value remains uncaptured.

## v1.7.0 release candidate alignment - 26 November 2026

The maintainer assigned the current development work to **v1.7.0**, with release-candidate status. The release combines saved-map switching and schedules per map with the adapter refactor, the generic Home Assistant area-cleaning adapter, preference-switch feedback and the fixes developed under the unpublished v1.6.1 baseline. The offline Dreame prototype remains outside the bundled release and under Unreleased in the changelog.

Package metadata, lockfile, README, current adapter/contract documentation and generated bundle now identify v1.7.0. Release-candidate status is documented in the README/changelog/testing header; the package version is `1.7.0`. The build derives its version banner from `package.json`; the UI intentionally has no version badge. Earlier test entries retain the version used at the time. The companion integration has its own version and remains unchanged by this card version alignment.

Validation passed: `npm run check` (via `npm.cmd` on Windows), **173 unit tests**, regenerated v1.7.0 bundle and standalone smoke checks. This preparation changes release metadata/documentation and the generated version banner only; earlier browser and maintainer live results remain recorded below.

## Map-scoped schedules - 26 November 2026

The maintainer confirmed clean bidirectional map switching between Lovelace and MyDyson, then reported A's schedules remaining visible on empty B with a misleading synchronization warning. The existing L3 capture records A reporting five schedules and B zero. The integration development branch now retains orders across maps but maintains each map's counts/checksum baseline independently. The active-map sensor/calendar, map-qualified switch availability/attributes and backend write checks share that scope. Old storage retains orders without assigning a global checksum to a map. Queries are correlated with the map revision, including late/reordered/expired replies, broker echoes and edits between request and response.

The card filters list rows, enabled badge and countdown by persistent map ID, uses matching sensor summaries, shows confirmed empty maps without a sync instruction, and closes obsolete editors/feedback on app-driven changes. A row disappearing because another map was selected cannot confirm deletion. Existing genuine same-map sync warnings remain visible.

Maintainer live acceptance passed on 26 November 2026 after installing the update: schedules and their availability follow map changes cleanly in both the integration and Lovelace card. The maintainer reports the observed behavior as fully correct. This confirms the map-switch display/availability flow; reconnect, further app edits and actual scheduled execution were not separately reported in this acceptance.

Validation passed: **434 integration tests**; `npm run check` with **173 card unit tests**, generated v1.6.1 bundle and standalone smoke checks; the existing Spot+Scrub schedule and saved-map browser suites; and `tests/map-schedules-browser.mjs` in Modern/Classic at 375/900 px. The new browser suite covers shared names, empty B, A/B readback, counts/countdown, genuine warnings and an in-flight deletion crossing a map change. The empty Modern mobile view was visually checked. These automated tests send no real robot commands. The later maintainer live result is recorded above. Release versions are unchanged. Recording that result changed documentation only, so application tests were not repeated.

## Saved-map live readback and camera correction - 26 November 2026

The maintainer supplied `home-assistant_dyson_spot_scrub_2026-11-26T01-46-41.347Z.log` after the first map-selection implementation. Select actions report errors at their 15-second deadline, although the robot has already reported the new map through JDM and later legacy telemetry changes the room list; the maintainer confirms successful cleaning afterward. The integration now normalizes actual RB05 `prop.post.current_map_id` and valid `prop.get` map reports into the shared confirmation and room-refresh path. It continues to require robot telemetry, not just transport/command acknowledgement.

During Home from stationless B, the log shows `ABORT` followed by `service.start_recharge`, then map ID `0` and a list with no current entry. It does not show a request to select A in that interval. The static-map helper's first-map fallback could display A; it now requires an unambiguous current map or the explicitly reported map ID. With map selection enabled, camera fetches pass the reported identity, including unknown `0`, so an unrelated floor cannot be used. Home and Stop commands are unchanged; comparison with MyDyson cancellation/normal stationless completion remains a separate live trace. Full timelines and the new shared-room-name evidence are in [the map notes](docs/spot-scrub-maps.md#live-readback-delay-and-return-without-a-station).

Validation passed: the complete integration offline suite with **419 tests**, including a sanitized L3 regression fixture and coverage for early JDM confirmation, partial/invalid properties, transient ID `0`, missing/ambiguous current-map metadata and camera ID binding. `npm run check` passed with **170 unit tests**, rebuilt bundle and standalone smoke checks. The saved-map browser suite passed in both themes at 375/900 px, including clearing a rejected-service notice after later matching readback. Versions remain unchanged. The corrected controls still need a live retest.

## Saved-map selection implementation - 26 November 2026

The Spot+Scrub adapter now detects the configured robot's integration select with unique ID `<serial>_active_map` and adds a header map menu. It resolves options by persistent ID, sends one `select.select_option` action, waits for matching select/vacuum readback and keeps the existing room-refresh behavior. Local room drafts must be discarded first. Pending switches lock planner writes without appearing as a pending cleaning start; timeout, late confirmation and configuration/detachment ownership are handled without automatic retries. Older integrations and the other adapters retain their existing layout.

The integration implementation targets [FutuRazor's `feat/map-switching` branch](https://github.com/FutuRazor/ha-dyson-spot-scrub/tree/feat/map-switching), based on upstream commit `580ba28146fe315e5772277f5179a43aa85e15c0`. It adds the RB05 Map select, correlated full-list refreshes at connection/reconnection, map/lifecycle changes and 60-second intervals, and one acknowledged `set_cur_map` followed by telemetry confirmation. Existing cleaning/start locks cover the transition. Creation, deletion and editing stay in MyDyson; removed map IDs leave the selector, while cleanup of their old room entities remains a follow-up requiring verified ownership.

Validation passed: `npm run check` (via `npm.cmd` on Windows), **170 unit tests**, regenerated v1.6.1 bundle and standalone smoke checks. The integration's complete offline suite passed with **411 tests** on Python 3.12 using `-X utf8`, including 11 new map tests and an identity snapshot changed only for the added Map select. Integration manifest version remains unchanged.

Three browser suites passed in matching Playwright Chromium Headless Shell: `map-selection-browser`, `browser` and `hass-dyson-browser`. The new suite covers both themes at 375/900 px, current-map marking and menu bounds, keyboard dismissal/focus, the exact targeted action, delayed select/vacuum readback, active-room updates with retained entities, removal of an app-deleted map, local-draft blocking, planner locks, timeout without retry, late confirmation and reconfiguration during transport. Mobile and desktop screenshots were visually reviewed. The test setup retains its asynchronous fixture import explicitly; an initial unretained setup promise was garbage-collected by Chromium. Edge could not be used reliably in this environment.

All new automated controls use simulated HA/MQTT and send no real robot commands. Install the integration development branch and updated card for live A/B switching, app rename/deletion, reconnect and subsequent room-cleaning checks. Full protocol evidence and scope are in [the map lifecycle notes](docs/spot-scrub-maps.md).

## Spot+Scrub active-map deletion live evidence - 26 November 2026

Deleting selected B in MyDyson automatically selected A. The log confirms the deletion, a map list containing only A and the coordinator's return to A's five rooms. The maintainer confirms the corresponding entity activation and Lovelace room-list change. A follow-up establishes that the tested MyDyson Delete control applies only to the selected map: B must be selected before it can be deleted through the app. See the [deletion timeline and command reference](docs/spot-scrub-maps.md#deleting-active-map-b) for both captures, exact payloads, evidence boundaries and remaining deletion tests.

## Spot+Scrub multi-map live evidence - 25/26 November 2026

Maintainer tests confirm repeated A/B switches with stable map IDs, smooth active-room-list updates and a successful card-originated Kitchen start after returning to A. Room ID 10 is reused across maps. The captured inactive-map Kitchen requests are rejected by the integration's legacy start path. See [Spot+Scrub maps and map switching](docs/spot-scrub-maps.md) for creation/discovery timing, names and IDs, captured commands and lifecycle messages, the source review, the proposed HA map selector and remaining checks.

These evidence updates change documentation only. Application code, generated bundle and release version are unchanged; automated application suites were not rerun.

The highest-priority next Spot+Scrub feature is [displaying and switching existing maps](docs/spot-scrub-maps.md#intended-feature-scope) in the integration and Lovelace card, supporting frequent floor changes. Preferred removal of HA entities belonging exclusively to map IDs deleted in MyDyson follows without delaying the primary map-switch feature. Map creation, deletion and editing remain app-only operations.

## Station and Robot switch feedback - 25 November 2026

Validation passed: `npm run check` with **166 unit tests**, rebuilt bundle and standalone smoke checks. Six Edge browser suites passed: the new settings feedback tests, station controls, keyboard navigation, translations/layout, consumables and the existing schedule feedback flow. Pending-state screenshots were reviewed in Modern and Classic. No real robot commands were sent.

`tests/settings-confirmation.test.mjs` checks exact switch state, disconnected/restored data and registry identity isolation. `tests/settings-feedback-browser.mjs` exercises both themes with delayed action completion and HA readback, a single local spinner without row-height changes, all supported switches, preference locking, timeouts and late updates, service failures, no retries and cancellation after configuration/device changes or detachment. Existing selects, volume and time settings retain their action behavior. These automated checks use simulated HA only.

The maintainer subsequently reported successful live testing of the new Station/Robot switch feedback on 25 November 2026.

## v1.6.1 version alignment - 25 November 2026

The maintainer assigned the latest Dyson fixes to **v1.6.1**: the hass-dyson return Start interlock and the translated Modern drying-track alignment. Both received maintainer live confirmation; the drying alignment was confirmed after the automated/visual checks below. Package metadata, README, current contract/adapter documentation and the generated bundle identify v1.6.1. The UI intentionally has no version badge.

`npm run check` passes with **163 unit tests**, bundle generation and standalone smoke checks. Earlier entries retain the v1.6.0 label used when those checks were performed before this version assignment. Other adapter experiments remain under Unreleased in the changelog; this local version update does not merge or publish the experiment branch.

## Modern drying track alignment - 25 November 2026

The Spot+Scrub drying progress track now follows the intrinsic width of the translated status and remaining-time line instead of filling the available row. Its right edge aligns with the time label, with the cancel control alongside the text. Narrow cards retain the full time and truncate the status label when required; the Modern status slot remains 44 px tall.

Validation: `npm run check` passed with **163 unit tests**, regenerated v1.6.0 bundle and standalone smoke checks. The `modern-status-browser`, `hass-dyson-browser` and `browser` Edge suites passed. Geometry checks cover English, German, Dutch and French in light/dark appearance at 320/375/450/900 px, including resize without HA updates, track/text edge alignment, readable time, bounded controls and unchanged status-slot height. German narrow/wide screenshots were visually reviewed in light/dark appearance. Existing Classic status and hass-dyson timer/no-progress behavior also passed.

## hass-dyson return Start interlock - 25 November 2026

The maintainer completed the mopping phase of a hass-dyson-started "Vacuum then Mop" job and could start a new Kitchen vacuuming request while the robot was returning to the station. After cancelling that new job, its return correctly blocked another request. This report applies to hass-dyson; it supersedes the earlier no-issue observation for the complete flow.

Source review and fixtures reproduce the asymmetry: the card treated `FULL_CLEAN_FINISHED` plus HA `returning` as ready, while upstream [maps both normal completion and abort to return travel](https://github.com/cmgrayb/hass-dyson/blob/28e38e9f13cf0eb13593b5255bf7516dfefbd774/custom_components/hass_dyson/const.py#L714). The exact live attribute trace and installed integration version were not supplied. The adapter now requires `INACTIVE_CHARGED`/`INACTIVE_CHARGING` together with `docked`/`idle` and the existing dock/readiness checks. Normal-completion return stays in the session but does not confirm a pending new Start. Start is checked before any associated Save and again after Save; starts during drying remain supported once the robot is ready.

`npm run check` passed with **163 unit tests**, a regenerated v1.6.0 bundle and standalone smoke checks. Regression assertions failed before the correction and now cover finished/aborted return, edited/unedited requests, explicit readiness, inconsistent state combinations, dock activity and return appearing after Save. Three headless Edge suites passed: `review-regressions-browser` (including both return paths in both themes and ready/drying recovery), `hass-dyson-browser` and `browser`.

After installing the updated bundle, the maintainer reports that the return-trip retest passed: the cleaning-session view remains active and a new Start is blocked while returning. An earlier repeat that still allowed Start used the previous installed bundle and is not a failure of the updated code. The report does not separately confirm post-return Start during drying or uninterrupted full-cycle drying; those remain separate from this passed return interlock check.

## Maintainer live follow-up - 25 November 2026

Following the Dyson compatibility review, the maintainer reports:

- Zone cleaning works with the map rotated.
- Robot and station commands work.
- Schedules can be displayed, edited, created, deleted and enabled/disabled.
- Room cleaning initially appears to follow the chosen settings. This is a preliminary observation, not an individually confirmed result for every room setting.
- In a subsequent check explicitly using hass-dyson, a "Vacuum then Mop" room clean was started and initially looked correct.
- During roller preparation in that hass-dyson-started job, both native adapter cards retain the cleaning-session view and display status information correctly.
- Mopping subsequently starts. The Spot+Scrub adapter's header icon also reflects the selected cleaning-path color. The subsequent report describes the return after mopping and the premature Start above; drying and uninterrupted full-cycle completion remain unconfirmed.

These initial observations were followed by the hass-dyson return Start issue above. Installed integration versions were not specified. The later reports identify hass-dyson as the job's start path and confirm the preparation display in both native adapter cards; the initial checks were not assigned individually to an adapter. These results are recorded within that scope rather than as blanket acceptance of both integrations. Earlier live reports, including Pause/Resume/Home and the known cross-integration Resume exception, remain documented below.

## Dyson compatibility review - 25 November 2026

Development now prioritizes existing Dyson users. Dreame remains an offline prototype pending a real-device tester. This review changes tests and documentation only; application behavior and version **v1.6.0** are unchanged.

- `npm run check` passed with **161 unit tests**, syntax validation, a rebuilt bundle and standalone smoke checks. The generated bundle is unchanged.
- Twelve headless Edge browser suites passed against simulated HA: `browser`, `hass-dyson-browser`, `review-regressions-browser`, `room-identity-browser`, `batch-browser`, `start-readiness-browser`, `zone-browser`, `schedules-review-browser`, `spot-schedules-browser`, `schedules-browser`, `station-browser` and `languages-browser`.
- The schedule review suite initially timed out while navigating to the local preview with a 15-second timeout, including an isolated retry. The complete suite passed with a 60-second navigation allowance; its 15-second interaction timeout remains unchanged. That allowance is now recorded in the test, without changing the application or its command timing.
- Two new compatibility regressions exercise both Dyson integrations with legacy YAML (no integration key), Automatic and explicit native selection. A generic robot is first in the registry and both Dyson vacuums advertise generic area/fan features. Assertions retain the chosen robot while offline, explicit camera and room mappings, display order/exclusions, native controls and exact native Start payloads. Missing native actions send no fallback commands.

No Dyson behavior regression was reproduced in this automated review. The subsequent maintainer live follow-up is recorded above, separately from the automated checks and earlier hardware reports. The known cross-integration Resume exception below remains separate evidence.

## Offline Dreame contract prototype - 25 November 2026

Version remains **v1.6.0** on `experiment/multi_adapter`. The [Dreame contract](docs/dreame-adapter-contract.md) is pinned to Tasshack/dreame-vacuum v2.0.3 and uses synthetic source-shaped fixtures. It is not registered, selectable or bundled as a runtime adapter, and no Dreame hardware support is claimed.

- `npm run check` passed with **159 unit tests**, syntax validation, a rebuilt bundle and standalone smoke checks. The generated runtime bundle remains unchanged because the prototype is deliberately outside its import graph.
- Eleven new contract tests cover map-qualified identities, native settings and companion-value preservation, water variants, readiness and stale contexts, native room starts, and optimistic HA publications followed by late backend rejection.
- `npm run prototype:dreame` prints the proposed profile write and an unconfirmed/failing observation trace with **zero dispatched commands**. Neither matching HA values nor a resolved service authorizes automatic Start.
- Browser suites were not rerun: there are no runtime UI or adapter-registration changes. Real model snapshots, robot acknowledgement/readback and live start behavior remain unverified; see the contract's live-evidence checklist before activation.

## Dyson fan API clarification — 25 November 2026

The maintainer reports no suction control on the selected Dyson entity and subsequently identified it as the **hass-dyson** vacuum: that entity offers HA area selection and is eligible for the generic card dropdown. The Spot+Scrub entity offers cleaning modes instead and is not offered by the generic filter in this installation. This matches current upstream source: no FAN_SPEED support in hass-dyson and a cleaning-mode selector exposed as fan speed in Spot+Scrub. A missing generic suction slider is therefore consistent with the reported setup. Exact installed versions and raw attributes were not supplied. The generic adapter now excludes Spot+Scrub's known mode options and rejects stale suction drafts containing them, while preserving area-only starts.

Validation: `npm run check` passed with **148 unit tests**, rebuilt bundle and standalone smoke checks. A new regression covers both Spot+Scrub mode lists (with/without mop), blocked mode writes and permitted area-only cleaning. The fan browser suite also checks that mode options hide the slider and preserve area-only Start. Source references and version caveats are in the [generic adapter guide](docs/home-assistant-rooms.md#optional-suction-power-and-start).

## Optional HA suction control — 25 November 2026

Version remains **v1.6.0** on `experiment/multi_adapter`.

- `npm run check`: **147 unit tests**, syntax checks, rebuilt bundle and standalone smoke validation passed.
- Seven Edge browser suites passed: `ha-fan-speed-browser`, `ha-rooms-browser`, `browser`, `hass-dyson-browser`, `room-planning-browser`, `languages-browser` and `schedule-editor-browser`. The fan suite additionally checks keyboard focus after rendering and consecutive arrow-key changes.
- Eight fan-specific unit tests cover exact feature/service/options detection, unknown/current values, untouched starts, changed native values, capability loss with retained intent, pre-write mapping validation, post-write lifecycle/readiness/map/option checks, locking, partial failures and no command retry or rollback.
- The real-adapter fan browser suite covers one shared control outside the room tiles, local edits and Discard, language preservation, offline/unknown states, native option values, exact set-fan-speed → clean-area ordering, failed setting/start calls and explicit user retry. Layouts were checked in both themes/four languages at 375/900 px; narrow light/dark screenshots were inspected.

Live verification of optional suction is **pending**. The previous successful generic Dyson test below predates this control. On a device exposing FAN_SPEED, a valid `fan_speed_list` and `vacuum.set_fan_speed`, verify: changing the slider sends nothing; Start uses the chosen global value; untouched starts retain the robot's setting; Discard restores the reported value. Check actual suction, persistence after the job and whether stored room profiles override the global setting. A failed set prevents Start; after a successful set and failed/withheld Start, review the robot before a manual retry.

## Generic HA area adapter — 25 November 2026

Branch: `experiment/multi_adapter`. Version remains **v1.6.0**. The new `ha_rooms` adapter follows HA Core **2026.11.3** registry options and area-cleaning action semantics. This stage adds generic area selection; it does not add manufacturer-specific settings or ordering guarantees.

- `npm run check`: **139 unit tests**, rebuilt bundle and standalone smoke validation, including automatic generic discovery, passed.
- Seven Edge browser suites passed: `ha-rooms-browser`, `browser`, `hass-dyson-browser`, `room-planning-browser`, `languages-browser`, `start-readiness-browser` and `schedule-editor-browser`.
- New unit coverage includes exact capability detection, specialized priority/deduplication, missing and malformed mappings, native-segment versus HA-area IDs, one exact targeted action, invalid selections/settings, unavailable services/devices, fresh mapping/identity/area checks, lifecycle races, concurrent requests, failure handling and standard session features.
- The real-adapter browser fixture covers the actual editor, area visibility/display order, two-area Start, Pause/Resume/Home, hidden unsupported UI, stale persisted mapping rejection with retained selection, and both themes at 375/900 px. Narrow screenshots were inspected. All requests target simulated HA fixtures.

The maintainer reports a successful first **live test of the generic path with a Dyson** after explicitly selecting Home Assistant area cleaning in the card editor: multiple area-cleaning starts, Pause, Resume and Home worked; session room chips appeared for requests initiated in that browser instance; battery percentage was visible. The supplied screenshot shows five area tiles, checkmarks and no per-room controls, matching the intended initial scope. The maintainer later identified the underlying integration as hass-dyson; its installed version was not supplied. This validates the generic path on that Dyson setup, separately from the earlier native-adapter tests.

Live acceptance with a **foreign robot is still pending**, as are generic-path checks not explicitly covered by this report. Follow the [setup and live checklist](docs/home-assistant-rooms.md). Do not infer additional model/integration support from this Dyson result.

## Local multi-adapter preparation — 25 November 2026

Branch: `experiment/multi_adapter`. Version remained **v1.6.0**. This preparation stage was an internal room-planning refactor; it did not yet enable an additional robot integration.

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
