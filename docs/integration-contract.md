# v0.3.6a integration contract

The frontend holds only a local draft. The integration translates option labels into Dyson array values.

## Save

Action: `dyson_spot_scrub.save_room_settings`

```json
{
  "entity_id": "vacuum.your_dyson",
  "room_settings": {
    "12": {"cleaning_mode": "Mop", "water_level": "High"},
    "10": {"mop_repetitions": "Two Passes"}
  }
}
```

Only changed fields are included. No room switches, selection or start command are sent by the card. An empty settings draft results in no call. HA must reflect the values before the card clears the settings draft; after six seconds without confirmation it keeps the draft and reports the timeout. The selected room list remains local after saving.

## Start

Action: `dyson_spot_scrub.start_rooms_with_settings`

```json
{
  "entity_id": "vacuum.your_dyson",
  "room_ids": ["12", "10"],
  "room_settings": {"12": {"cleaning_mode": "Mop"}}
}
```

One call contains the complete changed-settings draft and room selection. The settings object can be empty. Values for unedited fields remain under integration control. The card never calls a preliminary save or `button.press`.

The integration writes preferences once, then issues its existing protocol start sequence. One HA call is not one MQTT packet, a transactional robot update or a confirmed robot acknowledgement. Execution order remains unconfirmed because the robot receives `unorderedZones`.

## Optional start readiness

The vacuum may expose boolean `ready_to_start` and string `start_block_reason` attributes. An explicit `false` disables Start and rejects the batch start before any service call. Known reasons receive English status labels; unknown reasons use a generic integration-not-ready message.

Supported reasons: `disconnected`, `robot_fault`, `washing_mop`, `emptying_bin`, `mapping_or_navigation`, `returning_or_finishing`, `cleaning_job_active`, and `waiting_for_ready_state`.

The card retains its existing dock-state checks, including on older integrations without these attributes. Drying alone does not block Start. Save settings and local drafts are independent of the start veto. The integration must also validate readiness when executing the action, since telemetry can change after the frontend check.

## Identity and capabilities

Entities must belong to the same Dyson device and platform. Room switch registry unique IDs identify per-room select registry prefixes; their `room_id` attributes supply the native map ID. The card uses option labels exactly as reported by HA. Native IDs are map-scoped, so remapping requires fresh drafts.

Missing actions produce a clear message and never trigger a legacy fallback. Missing options are disabled or hidden. Duplicate/ambiguous room IDs and invalid edited options are rejected before the action. The original legacy adapter remains in the source for regression coverage but is not called by the v0.3.6a UI.

## Known integration limits

The supplied save implementation merges with cached robot preferences. Concurrent external changes, remapping and acknowledgement handling require integration-level coordination. The frontend cannot guarantee a transaction across other browsers, automations or the Dyson app. It retains failed drafts and never retries robot commands automatically.


## Optional drying controls

When `dock_state` is `DRYING_MOP`, the card displays the vacuum attribute
`drying_remaining_seconds` as hours and minutes, rounded up to the next minute.
It shows the last reported sample and does not run a speculative countdown.
Missing or invalid values display Unavailable. The remaining-time bar uses
`100 * drying_remaining_seconds / drying_total_seconds`. Both must be finite
numbers, total must be positive, and remaining must be between zero and total.
Otherwise the bar is hidden. `drying_updated_at` remains reserved for a future
countdown; this version displays confirmed samples only.

The cancel button requires a connected, available vacuum and the registered
`dyson_spot_scrub.cancel_drying` action. It sends `{entity_id: <configured vacuum>}`
and waits for telemetry to change the dock status. It does not call vacuum.stop,
start a cleaning run, or modify room drafts. Older integrations keep the button
disabled. Errors remain visible and requests are not automatically retried.

## Fault descriptions

When the displayed activity is Robot needs attention, the card shows a non-empty string from the vacuum attribute `fault` as a subtitle. It inserts this as plain text. Missing descriptions keep the generic message. The card neither interprets fault codes nor retains cleared faults; readiness and session selection continue to use existing state handling.

## Station controls

Station entities use unique IDs `<serial>_station_<key>` on the same Dyson integration device as the configured vacuum. The first four keys (`hot_water_mopping`, `cleaning_solution`, `extended_roller_preparation`, `hot_water_self_cleaning`) are switches. `self_cleaning_frequency` and `roller_drying_duration` are selects with live `options` attributes. The card uses `switch.turn_on`, `switch.turn_off` and `select.select_option`, targeting exactly one entity. It does not write room drafts, infer robot confirmation from service completion, or retry failed calls.
