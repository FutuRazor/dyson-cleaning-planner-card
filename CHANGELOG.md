# Changelog

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
