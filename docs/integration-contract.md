# v0.3.3 integration contract

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

## Identity and capabilities

Entities must belong to the same Dyson device and platform. Room switch registry unique IDs identify per-room select registry prefixes; their `room_id` attributes supply the native map ID. The card uses option labels exactly as reported by HA. Native IDs are map-scoped, so remapping requires fresh drafts.

Missing actions produce a clear message and never trigger a legacy fallback. Missing options are disabled or hidden. Duplicate/ambiguous room IDs and invalid edited options are rejected before the action. The original legacy adapter remains in the source for regression coverage but is not called by the v0.3.3 UI.

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
