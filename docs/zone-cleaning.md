# Zone cleaning prototype

This feature is experimental on `test/zone-cleaning`. It requires the matching
[integration test branch](https://github.com/FutuRazor/ha-dyson-spot-scrub/tree/test/zone-cleaning),
which provides `dyson_spot_scrub.clean_zone`, the vacuum's `map_id` and
`ready_to_start`, and the camera's `map_calibration` attributes.

## Use

1. Open **Zone** in the planner header. The existing room draft is kept.
2. Wait for the verified camera snapshot. A blue zone appears automatically.
3. Drag the rectangle to move it. Drag its bottom-right handle to resize it.
   Mouse, touch and keyboard arrow controls are supported; Shift increases the
   keyboard step. One rectangle is supported in this prototype.
4. Press **Start clean**. This requests **Vacuum, Auto, one pass**, without saving
   or changing room settings. The normal cleaning-session view follows.

**Back to rooms** returns to the room planner. **Reload map** clears the rectangle
and fetches a new snapshot. The camera selected in the card editor is used even
if the session camera display is hidden. Its configured 0/90/180/270° rotation
also applies to zone selection. The camera must belong to the selected robot.

## Image and action contract

The card freezes the image and its calibration for the duration of selection.
It verifies the actual PNG signature, original image dimensions and SHA-256
against the camera attributes. Plain-HTTP HA installations use a local SHA-256
fallback when Web Crypto is unavailable. Camera tokens are used only in the
in-memory proxy request and are not saved in configuration or logged.

Image and calibration mismatches prevent selection/start. A change to the
robot's active map clears the selection. Missing services, an unavailable robot
or camera, unconfirmed start readiness, a foreign camera and editor previews
also block sending. No fallback to room commands is used.

The displayed rectangle is converted through the inverse image rotation and
the integration's scale, origin and padding into:

```yaml
action: dyson_spot_scrub.clean_zone
data:
  entity_id: vacuum.your_robot
  map_id: "<active map ID>"
  rectangle: [x_min, y_min, x_max, y_max]
```

Coordinates are in robot metres, not pixels. This is a geometry transform, not
an obstacle or floor-boundary check. Select a known reachable area for the first
hardware test. The card sends the action once and does not retry on errors;
successful transport still requires robot telemetry to confirm the start.

## Validation

- `npm run check`: syntax, unit tests and regenerated distribution bundle.
- With Playwright installed: `node tests/zone-browser.mjs` uses an offline
  synthetic PNG and simulated HA actions. Covers all four rotations, mouse drag,
  touch move/resize, keyboard resize, narrow layout, room-draft retention,
  readiness, map changes, checksum mismatch and the service payload.
- `node tests/scroll-browser.mjs`: existing planner/session scroll regression.

The offline preview's usual SVG map is not calibrated and cannot start a zone.
The browser test supplies its own calibrated PNG. Real robot testing remains
necessary; no release version is changed for this test branch.

Reloading preserves the selection only when the map ID and image transform are unchanged. Camera requests remove width/height parameters and verify the original PNG fingerprint and dimensions before enabling Start.

Open Settings to choose Auto, Boost, Quiet or Quick vacuum power. Settings stay local until Start clean. Other cleaning modes, water level and two-pass cleaning remain disabled pending protocol captures. Update the integration test branch before using power selection.
