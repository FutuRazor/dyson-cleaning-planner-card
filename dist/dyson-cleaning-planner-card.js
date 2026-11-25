/* Dyson Cleaning Planner Card v1.6.1 | MIT */
// English messages are also stable translation keys. Never use translated labels in action payloads.
const en = {
  "Updating setting …": "Updating setting …",
  "The setting change has not been confirmed by Home Assistant. Check the robot before trying again.": "The setting change has not been confirmed by Home Assistant. Check the robot before trying again.",
  "Suction power · all selected rooms": "Suction power · all selected rooms",
  "Robot setting; it may remain active after this clean.": "Robot setting; it may remain active after this clean.",
  "The selected suction power is no longer available. Review or discard the draft.": "The selected suction power is no longer available. Review or discard the draft.",
  "The suction power command was sent, but area cleaning was not confirmed. Check the robot before retrying. {error}": "The suction power command was sent, but area cleaning was not confirmed. Check the robot before retrying. {error}",
  "Select mapped Home Assistant areas. The robot controls room order.": "Select mapped Home Assistant areas. The robot controls room order.",
  "Home Assistant · Area cleaning": "Home Assistant · Area cleaning",
  "Select mapped Home Assistant areas. The robot controls cleaning settings and room order.": "Select mapped Home Assistant areas. The robot controls cleaning settings and room order.",
  "Sending area cleaning request …": "Sending area cleaning request …",
  "The robot was not found in the entity registry.": "The robot was not found in the entity registry.",
  "This robot does not report Home Assistant area cleaning support.": "This robot does not report Home Assistant area cleaning support.",
  "Map the robot segments to Home Assistant areas in the vacuum entity settings.": "Map the robot segments to Home Assistant areas in the vacuum entity settings.",
  "Home Assistant areas are unavailable. Reload the dashboard.": "Home Assistant areas are unavailable. Reload the dashboard.",
  "Home Assistant area cleaning is unavailable. Check your Home Assistant version and integration.": "Home Assistant area cleaning is unavailable. Check your Home Assistant version and integration.",
  "Start is only available when the robot is docked or idle.": "Start is only available when the robot is docked or idle.",
  "The room selection changed. Refresh rooms and select the areas again.": "The room selection changed. Refresh rooms and select the areas again.",
  "An action for this robot is already running in this browser.": "An action for this robot is already running in this browser.",
  "Next cleaning in {duration}": "Next cleaning in {duration}",
  "Next known cleaning in {duration}": "Next known cleaning in {duration}",
  "No active schedules": "No active schedules",
  "Next cleaning unknown": "Next cleaning unknown",
  "Next cleaning unavailable": "Next cleaning unavailable",
  "The Home Assistant time zone is unavailable.": "The Home Assistant time zone is unavailable.",
  "Calculated from reported weekly schedules; actual execution may differ.": "Calculated from reported weekly schedules; actual execution may differ.",
  "Schedules, active: {count}": "Schedules, active: {count}",
  "Active schedules: {count}": "Active schedules: {count}",
  "Schedule created.": "Schedule created.",
  "Schedule saved.": "Schedule saved.",
  "Schedule deleted.": "Schedule deleted.",
  "Saving schedule …": "Saving schedule …",
  "Updating schedule …": "Updating schedule …",
  "The change has not been confirmed by Home Assistant. Check the schedule in MyDyson before trying again.": "The change has not been confirmed by Home Assistant. Check the schedule in MyDyson before trying again.",
  "Discard": "Discard",
  "Schedule actions {time} ({days})": "Schedule actions {time} ({days})",
  "Stored settings not reported": "Stored settings not reported",
  "Move room up": "Move room up",
  "Move room down": "Move room down",
  "Remove room": "Remove room",
  "Keep stored setting": "Keep stored setting",
  "Rooms and cleaning settings": "Rooms and cleaning settings",
  "Some stored settings are not reported. Unchanged settings will be preserved.": "Some stored settings are not reported. Unchanged settings will be preserved.",
  "Room editing requires the schedule map to be active. You can still change weekdays and time.": "Room editing requires the schedule map to be active. You can still change weekdays and time.",
  "Add room": "Add room",
  "Choose room": "Choose room",

  "Selected rooms: {rooms}": "Selected rooms: {rooms}",
  "Delete schedule": "Delete schedule",
  "Delete schedule {time} ({days})": "Delete schedule {time} ({days})",
  "Delete schedule {time} ({days})?": "Delete schedule {time} ({days})?",
  "This removes the schedule from the robot and MyDyson.": "This removes the schedule from the robot and MyDyson.",
  "Deleting schedule …": "Deleting schedule …",
  "The integration reuses the robot's stored room selection. This card cannot change it. Check the selected rooms in MyDyson after creating the schedule.": "The integration reuses the robot's stored room selection. This card cannot change it. Check the selected rooms in MyDyson after creating the schedule.",
  "Selected rooms are not reported by this integration. Check them in MyDyson.": "Selected rooms are not reported by this integration. Check them in MyDyson.",
  "Choose time": "Choose time",
  "Apply time": "Apply time",
  "Hour": "Hour",
  "Minute": "Minute",
  "Schedules": "Schedules",
  "Create schedule": "Create schedule",
  "Edit schedule": "Edit schedule",
  "Save schedule": "Save schedule",
  "Weekdays": "Weekdays",
  "Cancel": "Cancel",
  "Sending schedule …": "Sending schedule …",
  "Times use the Home Assistant time zone: {zone}.": "Times use the Home Assistant time zone: {zone}.",
  "Schedules are unavailable. Check the robot connection and integration.": "Schedules are unavailable. Check the robot connection and integration.",
  "This schedule is no longer available. Refresh the schedule list.": "This schedule is no longer available. Refresh the schedule list.",
  "Choose at least one weekday and a valid time.": "Choose at least one weekday and a valid time.",
  "Invalid schedule state.": "Invalid schedule state.",
  "The room plan changed. Close the dialog and review your room settings.": "The room plan changed. Close the dialog and review your room settings.",
  "Schedule request sent. The list updates when Home Assistant reports the change.": "Schedule request sent. The list updates when Home Assistant reports the change.",
  "Schedule request failed. Check the schedule in MyDyson before trying again. {error}": "Schedule request failed. Check the schedule in MyDyson before trying again. {error}",
  "Enable schedule {time} ({days})": "Enable schedule {time} ({days})",
  "Edit schedule {time} ({days})": "Edit schedule {time} ({days})",
  "The schedule list may be incomplete. Turn each schedule off and on in MyDyson while the integration is connected.": "The schedule list may be incomplete. Turn each schedule off and on in MyDyson while the integration is connected.",
  "No known schedules. Create one from the room planner, or turn existing schedules off and on in MyDyson.": "No known schedules. Create one from the room planner, or turn existing schedules off and on in MyDyson.",
  "Map entity must use the {domain} domain for this integration.": "Map entity must use the {domain} domain for this integration.",
  "Map image": "Map image",
  "hass-dyson (experimental)": "hass-dyson (experimental)",
  "Invalid integration selection.": "Invalid integration selection.",
  "The room map is unavailable or ambiguous. Refresh rooms and check the integration.": "The room map is unavailable or ambiguous. Refresh rooms and check the integration.",
  "Settings were saved, but cleaning did not start. Review the robot status before retrying. {error}": "Settings were saved, but cleaning did not start. Review the robot status before retrying. {error}",
  "Room order is controlled by hass-dyson. Changed settings are saved before cleaning starts.": "Room order is controlled by hass-dyson. Changed settings are saved before cleaning starts.",
  "Integration": "Integration",
  "Invalid header icon style.": "Invalid header icon style.",
  "Header icon style": "Header icon style",
  "Invalid zone dimension unit.": "Invalid zone dimension unit.",
  "Off": "Off",
  "Inches": "Inches",
  "Centimeters": "Centimeters",
  "Dimension display": "Dimension display",
  "Voice prompts": "Voice prompts",
  "Volume": "Volume",
  "Child lock": "Child lock",
  "Do not disturb": "Do not disturb",
  "Start time": "Start time",
  "End time": "End time",
  "This robot setting is unavailable.": "This robot setting is unavailable.",
  "Invalid robot setting.": "Invalid robot setting.",
  "Mop pad": "Mop pad",
  "Cleaning selection": "Cleaning selection",
  "Rooms": "Rooms",
  "Close": "Close",
  "One pass": "One pass",
  "Drag the zone or resize its lower-right corner.": "Drag the zone or resize its lower-right corner.",
  "Settings are sent only when you start the zone clean.": "Settings are sent only when you start the zone clean.",
  "Two passes are not yet available.": "Two passes are not yet available.",
  "Not yet available": "Not yet available",
  "Other cleaning modes are not yet available.": "Other cleaning modes are not yet available.",
  "Plan a clean": "Plan a clean",
  "Cleaning session": "Cleaning session",
  "Cleaning session preview": "Cleaning session preview",
  "Info": "Info",
  "Settings": "Settings",
  "Station": "Station",
  "Robot": "Robot",
  "Station settings": "Station settings",
  "Consumables": "Consumables",
  "Supplies": "Supplies",
  "Robot information": "Robot information",
  "Close information": "Close information",
  "Consumables: replacement needed soon": "Consumables: replacement needed soon",
  "Cleaning mode": "Cleaning mode",
  "Vacuum Power": "Vacuum Power",
  "Water level": "Water level",
  "Clean repetitions": "Clean repetitions",
  "Vacuum": "Vacuum",
  "Mop": "Mop",
  "Vacuum and Mop": "Vacuum and Mop",
  "Vacuum then Mop": "Vacuum then Mop",
  "Auto": "Auto",
  "Boost": "Boost",
  "Quiet": "Quiet",
  "Quick": "Quick",
  "Very Low": "Very Low",
  "Low": "Low",
  "Medium": "Medium",
  "High": "High",
  "One Pass": "One Pass",
  "Two Passes": "Two Passes",
  "Hot water mopping": "Hot water mopping",
  "Hot water self-cleaning": "Hot water self-cleaning",
  "Extended roller preparation": "Extended roller preparation",
  "Cleaning solution": "Cleaning solution",
  "Self-cleaning frequency": "Self-cleaning frequency",
  "Roller drying duration": "Roller drying duration",
  "After each room": "After each room",
  "Every 15 minutes": "Every 15 minutes",
  "Every 30 minutes": "Every 30 minutes",
  "Only as needed": "Only as needed",
  "2 hours": "2 hours",
  "3 hours": "3 hours",
  "4 hours": "4 hours",
  "5 hours": "5 hours",
  "Empty dust bin": "Empty dust bin",
  "Wash mop roller": "Wash mop roller",
  "Dry mop roller": "Dry mop roller",
  "Press": "Press",
  "on": "on",
  "off": "off",
  "Brush bar": "Brush bar",
  "Mop roller": "Mop roller",
  "Side brushes": "Side brushes",
  "Robot filter": "Robot filter",
  "Dock filter": "Dock filter",
  "Ready to use": "Ready to use",
  "Refill required": "Refill required",
  "Enabled": "Enabled",
  "Disabled": "Disabled",
  "Status unavailable": "Status unavailable",
  "Show robot error": "Show robot error",
  "Dismiss error message": "Dismiss error message",
  "Docked": "Docked",
  "Idle": "Idle",
  "Unavailable": "Unavailable",
  "Not available": "Not available",
  "{percent}% remaining": "{percent}% remaining",
  "{name} remaining life": "{name} remaining life",
  "Save settings": "Save settings",
  "Start clean": "Start clean",
  "Saving …": "Saving …",
  "Discard draft": "Discard draft",
  "Local draft": "Local draft",
  "From Home Assistant": "From Home Assistant",
  "{selected} of {total} rooms selected": "{selected} of {total} rooms selected",
  "Select {name}": "Select {name}",
  "Settings for {name}": "Settings for {name}",
  "Room settings unavailable": "Room settings unavailable",
  "Room ID unavailable": "Room ID unavailable",
  "Room ID unavailable. Check the updated integration and refresh rooms.": "Room ID unavailable. Check the updated integration and refresh rooms.",
  "No enabled rooms found. Check the card configuration and room discovery.": "No enabled rooms found. Check the card configuration and room discovery.",
  "The updated Dyson integration actions are not available. Reload the integration and refresh this dashboard.": "The updated Dyson integration actions are not available. Reload the integration and refresh this dashboard.",
  "Settings changed outside this card. Your edited values remain in the local draft.": "Settings changed outside this card. Your edited values remain in the local draft.",
  "Pause": "Pause",
  "Resume": "Resume",
  "Home": "Home",
  "Cleaning map": "Cleaning map",
  "Refreshes about every 5 seconds": "Refreshes about every 5 seconds",
  "Drying time remaining": "Drying time remaining",
  "Cancel drying": "Cancel drying",
  "Remaining time: unavailable": "Remaining time: unavailable",
  "Remaining time: {time} (hh:mm)": "Remaining time: {time} (hh:mm)",
  "Drying cancellation requires a connected robot and the integration cancel_drying action.": "Drying cancellation requires a connected robot and the integration cancel_drying action.",
  "This action is not available in the current robot state.": "This action is not available in the current robot state.",
  "Robot unavailable": "Robot unavailable",
  "Robot needs attention": "Robot needs attention",
  "Paused": "Paused",
  "Cleaning mop roller": "Cleaning mop roller",
  "Drying mop roller": "Drying mop roller",
  "Emptying dust bin": "Emptying dust bin",
  "Vacuuming": "Vacuuming",
  "Mopping": "Mopping",
  "Vacuuming and mopping": "Vacuuming and mopping",
  "Cleaning": "Cleaning",
  "Returning / mapping": "Returning / mapping",
  "Robot disconnected": "Robot disconnected",
  "Mapping / navigation in progress": "Mapping / navigation in progress",
  "Returning to dock / finishing cleanup": "Returning to dock / finishing cleanup",
  "A cleaning job is still active": "A cleaning job is still active",
  "Waiting for the robot to be ready": "Waiting for the robot to be ready",
  "The integration is not ready to start a new clean": "The integration is not ready to start a new clean",
  "Wait for the dock cycle to finish before starting a clean": "Wait for the dock cycle to finish before starting a clean",
  "Waiting for a connection to the robot.": "Waiting for a connection to the robot.",
  "Cleaning session active": "Cleaning session active",
  "Cleaning session paused": "Cleaning session paused",
  "Robot returning": "Robot returning",
  "The integration is reporting a return or mapping operation.": "The integration is reporting a return or mapping operation.",
  "Check the robot or the Dyson app for details.": "Check the robot or the Dyson app for details.",
  "Starting clean": "Starting clean",
  "Waiting for the robot to report its status.": "Waiting for the robot to report its status.",
  "Waiting for robot status": "Waiting for robot status",
  "The robot is not reporting a ready state.": "The robot is not reporting a ready state.",
  "Battery and charging": "Battery and charging",
  "Battery level unavailable": "Battery level unavailable",
  "Battery: {percent}%": "Battery: {percent}%",
  "Charging": "Charging",
  "Not charging": "Not charging",
  "Charging status unavailable": "Charging status unavailable",
  "{battery}. {charging}.": "{battery}. {charging}.",
  "Live cleaning map": "Live cleaning map",
  "Loading cleaning map …": "Loading cleaning map …",
  "Waiting for an active robot status.": "Waiting for an active robot status.",
  "Camera unavailable.": "Camera unavailable.",
  "No map camera found. Select one in the card editor.": "No map camera found. Select one in the card editor.",
  "The camera image is not available yet.": "The camera image is not available yet.",
  "Map update unavailable.": "Map update unavailable.",
  "{message} Showing the last received image.": "{message} Showing the last received image.",
  "Language": "Language",
  "Automatic": "Automatic",
  "Dyson device": "Dyson device",
  "Select a device": "Select a device",
  "Title": "Title",
  "Theme": "Theme",
  "Classic": "Classic",
  "Modern": "Modern",
  "Unsupported settings": "Unsupported settings",
  "Show disabled": "Show disabled",
  "Hide": "Hide",
  "Always show all settings": "Always show all settings",
  "Per-room settings are detected automatically. Saving and starting use the Dyson integration batch actions.": "Per-room settings are detected automatically. Saving and starting use the Dyson integration batch actions.",
  "Status bar": "Status bar",
  "Show status bar": "Show status bar",
  "Visible status indicators": "Visible status indicators",
  "Show battery percentage": "Show battery percentage",
  "Show camera during a cleaning session": "Show camera during a cleaning session",
  "Turning this off removes the map and stops image requests from this card.": "Turning this off removes the map and stops image requests from this card.",
  "Map camera": "Map camera",
  "Auto-detect": "Auto-detect",
  "Map rotation": "Map rotation",
  "Rooms in this card": "Rooms in this card",
  "Choose which rooms to show. Arrows change the display order, not the robot cleaning order.": "Choose which rooms to show. Arrows change the display order, not the robot cleaning order.",
  "Move {name} up": "Move {name} up",
  "Move {name} down": "Move {name} down",
  "Refresh rooms": "Refresh rooms",
  "Rooms disabled in Home Assistant are not offered. New rooms appear automatically.": "Rooms disabled in Home Assistant are not offered. New rooms appear automatically.",
  "Could not read the entity registry. Check the connection and user permissions.": "Could not read the entity registry. Check the connection and user permissions.",
  "The Dyson device was not found in the entity registry.": "The Dyson device was not found in the entity registry.",
  "The Dyson room list is not currently available.": "The Dyson room list is not currently available.",
  "Room switch mapping is ambiguous": "Room switch mapping is ambiguous",
  "Multiple rooms map to the same switch.": "Multiple rooms map to the same switch.",
  "Select a vacuum entity.": "Select a vacuum entity.",
  "theme must be classic or modern.": "theme must be classic or modern.",
  "language must be auto, en, de, nl or fr.": "language must be auto, en, de, nl or fr.",
  "unsupported_settings must be disabled or hidden.": "unsupported_settings must be disabled or hidden.",
  "{key} must be a list of entity IDs.": "{key} must be a list of entity IDs.",
  "room_entities must map room names to switch entities.": "room_entities must map room names to switch entities.",
  "show_battery_percentage must be true or false.": "show_battery_percentage must be true or false.",
  "show_status_bar must be true or false.": "show_status_bar must be true or false.",
  "hidden_status_items must be a list of indicator keys.": "hidden_status_items must be a list of indicator keys.",
  "show_camera must be true or false.": "show_camera must be true or false.",
  "always_show_all_settings must be true or false.": "always_show_all_settings must be true or false.",
  "camera_rotation must be 0, 90, 180 or 270.": "camera_rotation must be 0, 90, 180 or 270.",
  "Select a camera entity.": "Select a camera entity.",
  "Home Assistant is not connected.": "Home Assistant is not connected.",
  "Update the Dyson integration: {action} is unavailable.": "Update the Dyson integration: {action} is unavailable.",
  "The robot is unavailable.": "The robot is unavailable.",
  "Start is only available when the Dyson is ready (docked or idle).": "Start is only available when the Dyson is ready (docked or idle).",
  "A room in your draft is unavailable or ambiguous. Review or discard the draft.": "A room in your draft is unavailable or ambiguous. Review or discard the draft.",
  "{setting} is no longer available for {room}.": "{setting} is no longer available for {room}.",
  "A selected room has no stable room ID. Refresh rooms and check the integration.": "A selected room has no stable room ID. Refresh rooms and check the integration.",
  "Select at least one room without duplicates.": "Select at least one room without duplicates.",
  "An action for this Dyson is already running in this browser.": "An action for this Dyson is already running in this browser.",
  "This action is not available for the current robot state.": "This action is not available for the current robot state.",
  "This station action is unavailable.": "This station action is unavailable.",
  "This station setting is unavailable.": "This station setting is unavailable.",
  "Invalid station switch value.": "Invalid station switch value.",
  "Invalid station option.": "Invalid station option.",
  "Sending room settings and start request …": "Sending room settings and start request …",
  "The start was sent, but the robot has not reported an active session. Check its status before trying again.": "The start was sent, but the robot has not reported an active session. Check its status before trying again.",
  "{error} No automatic retry will be made.": "{error} No automatic retry will be made.",
  "Saving room settings …": "Saving room settings …",
  "Save was sent, but Home Assistant has not reflected all values yet. The draft was kept; check the robot before retrying.": "Save was sent, but Home Assistant has not reflected all values yet. The draft was kept; check the robot before retrying.",
  "Settings sent. Home Assistant values updated. Room selection remains local.": "Settings sent. Home Assistant values updated. Room selection remains local.",
  "Zone": "Zone",
  "Zone cleaning": "Zone cleaning",
  "Zone selection": "Zone selection",
  "Vacuum · Auto · One pass. Drag the zone or resize its lower-right corner.": "Vacuum · Auto · One pass. Drag the zone or resize its lower-right corner.",
  "Reload map": "Reload map",
  "Back to rooms": "Back to rooms",
  "Move zone. Use the arrow keys.": "Move zone. Use the arrow keys.",
  "Resize zone. Use the arrow keys.": "Resize zone. Use the arrow keys.",
  "The active map changed. Reload the map and select a new zone.": "The active map changed. Reload the map and select a new zone.",
  "Loading calibrated map …": "Loading calibrated map …",
  "Camera must belong to the selected robot.": "Camera must belong to the selected robot.",
  "Camera image unavailable.": "Camera image unavailable.",
  "A calibrated PNG image is required.": "A calibrated PNG image is required.",
  "Image and calibration do not match. Reload the map.": "Image and calibration do not match. Reload the map.",
  "Map loading timed out. Reload the map.": "Map loading timed out. Reload the map.",
  "A calibrated map is required. Reload the map.": "A calibrated map is required. Reload the map.",
  "Zone start unavailable: check robot readiness, map and integration action.": "Zone start unavailable: check robot readiness, map and integration action.",
  "Map frozen for selection. Room settings remain unchanged.": "Map frozen for selection. Room settings remain unchanged.",
  "Sending zone start …": "Sending zone start …",
  "Zone start failed. Check the robot before retrying.": "Zone start failed. Check the robot before retrying.",
  "Mop repetitions": "Mop repetitions"
};

// German display text. Entity names and protocol values are never rewritten.
const de = {
  "Updating setting …": "Einstellung wird geändert …",
  "The setting change has not been confirmed by Home Assistant. Check the robot before trying again.": "Home Assistant hat die Einstellungsänderung noch nicht bestätigt. Prüfe den Roboter vor einem erneuten Versuch.",
  "Suction power · all selected rooms": "Saugkraft · alle ausgewählten Räume",
  "Robot setting; it may remain active after this clean.": "Robotereinstellung; sie kann nach dieser Reinigung bestehen bleiben.",
  "The selected suction power is no longer available. Review or discard the draft.": "Die gewählte Saugkraft ist nicht mehr verfügbar. Prüfe oder verwirf den Entwurf.",
  "The suction power command was sent, but area cleaning was not confirmed. Check the robot before retrying. {error}": "Der Saugkraftbefehl wurde gesendet, die Bereichsreinigung aber nicht bestätigt. Prüfe den Roboter vor einem erneuten Versuch. {error}",
  "Select mapped Home Assistant areas. The robot controls room order.": "Wähle zugeordnete Home-Assistant-Bereiche. Der Roboter bestimmt die Raumreihenfolge.",
  "Home Assistant · Area cleaning": "Home Assistant · Bereichsreinigung",
  "Select mapped Home Assistant areas. The robot controls cleaning settings and room order.": "Wähle zugeordnete Home-Assistant-Bereiche. Der Roboter bestimmt Reinigungseinstellungen und Raumreihenfolge.",
  "Sending area cleaning request …": "Bereichsreinigung wird angefordert …",
  "The robot was not found in the entity registry.": "Der Roboter wurde nicht in der Entitätsregistrierung gefunden.",
  "This robot does not report Home Assistant area cleaning support.": "Dieser Roboter meldet keine Unterstützung für die Home-Assistant-Bereichsreinigung.",
  "Map the robot segments to Home Assistant areas in the vacuum entity settings.": "Ordne die Robotersegmente in den Einstellungen der Sauger-Entität den Home-Assistant-Bereichen zu.",
  "Home Assistant areas are unavailable. Reload the dashboard.": "Die Home-Assistant-Bereiche sind nicht verfügbar. Lade das Dashboard neu.",
  "Home Assistant area cleaning is unavailable. Check your Home Assistant version and integration.": "Die Home-Assistant-Bereichsreinigung ist nicht verfügbar. Prüfe deine Home-Assistant-Version und die Integration.",
  "Start is only available when the robot is docked or idle.": "Ein Start ist nur möglich, wenn der Roboter angedockt oder im Leerlauf ist.",
  "The room selection changed. Refresh rooms and select the areas again.": "Die Raumzuordnung hat sich geändert. Aktualisiere die Räume und wähle die Bereiche erneut aus.",
  "An action for this robot is already running in this browser.": "Für diesen Roboter läuft in diesem Browser bereits eine Aktion.",
  "Next cleaning in {duration}": "Nächste Reinigung in {duration}",
  "Next known cleaning in {duration}": "Nächste bekannte Reinigung in {duration}",
  "No active schedules": "Keine aktiven Zeitpläne",
  "Next cleaning unknown": "Nächste Reinigung unbekannt",
  "Next cleaning unavailable": "Nächste Reinigung nicht verfügbar",
  "The Home Assistant time zone is unavailable.": "Die Home-Assistant-Zeitzone ist nicht verfügbar.",
  "Calculated from reported weekly schedules; actual execution may differ.": "Aus den gemeldeten Wochenzeitplänen berechnet; die tatsächliche Ausführung kann abweichen.",
  "Schedules, active: {count}": "Zeitpläne, aktiv: {count}",
  "Active schedules: {count}": "Aktive Zeitpläne: {count}",
  "Schedule created.": "Zeitplan erstellt.",
  "Schedule saved.": "Zeitplan gespeichert.",
  "Schedule deleted.": "Zeitplan gelöscht.",
  "Saving schedule …": "Zeitplan wird gespeichert …",
  "Updating schedule …": "Zeitplan wird aktualisiert …",
  "The change has not been confirmed by Home Assistant. Check the schedule in MyDyson before trying again.": "Home Assistant hat die Änderung noch nicht bestätigt. Prüfe den Zeitplan in MyDyson vor einem erneuten Versuch.",
  "Discard": "Verwerfen",
  "Schedule actions {time} ({days})": "Aktionen für Zeitplan {time} ({days})",
  "Stored settings not reported": "Gespeicherte Einstellungen nicht gemeldet",
  "Move room up": "Raum nach oben",
  "Move room down": "Raum nach unten",
  "Remove room": "Raum entfernen",
  "Keep stored setting": "Gespeicherte Einstellung beibehalten",
  "Rooms and cleaning settings": "Räume und Reinigungsoptionen",
  "Some stored settings are not reported. Unchanged settings will be preserved.": "Einige gespeicherte Einstellungen werden nicht gemeldet. Unveränderte Einstellungen bleiben erhalten.",
  "Room editing requires the schedule map to be active. You can still change weekdays and time.": "Zum Bearbeiten der Räume muss die Karte des Zeitplans aktiv sein. Wochentage und Uhrzeit können weiterhin geändert werden.",
  "Add room": "Raum hinzufügen",
  "Choose room": "Raum auswählen",

  "Selected rooms: {rooms}": "Ausgewählte Räume: {rooms}",
  "Delete schedule": "Zeitplan löschen",
  "Delete schedule {time} ({days})": "Zeitplan {time} ({days}) löschen",
  "Delete schedule {time} ({days})?": "Zeitplan {time} ({days}) löschen?",
  "This removes the schedule from the robot and MyDyson.": "Der Zeitplan wird vom Roboter und aus MyDyson gelöscht.",
  "Deleting schedule …": "Zeitplan wird gelöscht …",
  "The integration reuses the robot's stored room selection. This card cannot change it. Check the selected rooms in MyDyson after creating the schedule.": "Die Integration übernimmt die im Roboter gespeicherte Raumauswahl. Diese Karte kann sie nicht ändern. Prüfe die ausgewählten Räume nach dem Erstellen in MyDyson.",
  "Selected rooms are not reported by this integration. Check them in MyDyson.": "Die Integration meldet die ausgewählten Räume nicht. Prüfe sie in MyDyson.",
  "Choose time": "Uhrzeit wählen",
  "Apply time": "Uhrzeit übernehmen",
  "Hour": "Stunde",
  "Minute": "Minute",
  "Schedules": "Zeitpläne",
  "Create schedule": "Zeitplan erstellen",
  "Edit schedule": "Zeitplan bearbeiten",
  "Save schedule": "Zeitplan speichern",
  "Weekdays": "Wochentage",
  "Cancel": "Abbrechen",
  "Sending schedule …": "Zeitplan wird gesendet …",
  "Times use the Home Assistant time zone: {zone}.": "Die Uhrzeiten verwenden die Home-Assistant-Zeitzone: {zone}.",
  "Schedules are unavailable. Check the robot connection and integration.": "Zeitpläne sind nicht verfügbar. Prüfe die Roboterverbindung und Integration.",
  "This schedule is no longer available. Refresh the schedule list.": "Dieser Zeitplan ist nicht mehr verfügbar. Aktualisiere die Zeitplanliste.",
  "Choose at least one weekday and a valid time.": "Wähle mindestens einen Wochentag und eine gültige Uhrzeit.",
  "Invalid schedule state.": "Ungültiger Zeitplanstatus.",
  "The room plan changed. Close the dialog and review your room settings.": "Die Raumplanung hat sich geändert. Schließe den Dialog und prüfe deine Raumeinstellungen.",
  "Schedule request sent. The list updates when Home Assistant reports the change.": "Zeitplanauftrag gesendet. Die Liste wird aktualisiert, sobald Home Assistant die Änderung meldet.",
  "Schedule request failed. Check the schedule in MyDyson before trying again. {error}": "Zeitplanauftrag fehlgeschlagen. Prüfe den Zeitplan in MyDyson, bevor du es erneut versuchst. {error}",
  "Enable schedule {time} ({days})": "Zeitplan {time} ({days}) aktivieren",
  "Edit schedule {time} ({days})": "Zeitplan {time} ({days}) bearbeiten",
  "The schedule list may be incomplete. Turn each schedule off and on in MyDyson while the integration is connected.": "Die Zeitplanliste ist möglicherweise unvollständig. Schalte jeden Zeitplan in MyDyson aus und wieder ein, während die Integration verbunden ist.",
  "No known schedules. Create one from the room planner, or turn existing schedules off and on in MyDyson.": "Keine bekannten Zeitpläne. Erstelle einen über die Raumplanung oder schalte bestehende Zeitpläne in MyDyson aus und wieder ein.",
  "Map entity must use the {domain} domain for this integration.": "Die Kartenentität muss für diese Integration die Domain {domain} verwenden.",
  "Map image": "Kartenbild",
  "hass-dyson (experimental)": "hass-dyson (experimentell)",
  "Invalid integration selection.": "Ungültige Integrationsauswahl.",
  "The room map is unavailable or ambiguous. Refresh rooms and check the integration.": "Die Raumkarte ist nicht verfügbar oder nicht eindeutig. Räume aktualisieren und Integration prüfen.",
  "Settings were saved, but cleaning did not start. Review the robot status before retrying. {error}": "Einstellungen gespeichert, Reinigung aber nicht gestartet. Vor erneutem Versuch Roboterstatus prüfen. {error}",
  "Room order is controlled by hass-dyson. Changed settings are saved before cleaning starts.": "hass-dyson bestimmt die Raumreihenfolge. Geänderte Einstellungen werden vor dem Reinigungsstart gespeichert.",
  "Integration": "Integration",
  "Invalid header icon style.": "Ung\u00fcltiger Stil f\u00fcr das Header-Symbol.",
  "Header icon style": "Header-Symbol",
  "Invalid zone dimension unit.": "Ungültige Einheit für die Zonenabmessungen.",
  "Off": "Aus",
  "Inches": "Zoll",
  "Centimeters": "Zentimeter",
  "Dimension display": "Größenanzeige",
  "Voice prompts": "Sprachausgabe",
  "Volume": "Lautstärke",
  "Child lock": "Kindersicherung",
  "Do not disturb": "Nicht stören",
  "Start time": "Startzeit",
  "End time": "Endzeit",
  "This robot setting is unavailable.": "Diese Robotereinstellung ist nicht verfügbar.",
  "Invalid robot setting.": "Ungültige Robotereinstellung.",
  "Mop pad": "Wischpad",
  "Cleaning selection": "Reinigungsauswahl",
  "Rooms": "Räume",
  "Close": "Schließen",
  "One pass": "Ein Durchgang",
  "Drag the zone or resize its lower-right corner.": "Zone verschieben oder an der unteren rechten Ecke vergrößern.",
  "Settings are sent only when you start the zone clean.": "Die Einstellungen werden erst beim Start der Zonenreinigung gesendet.",
  "Two passes are not yet available.": "Zwei Durchgänge sind noch nicht verfügbar.",
  "Not yet available": "Noch nicht verfügbar",
  "Other cleaning modes are not yet available.": "Weitere Reinigungsmodi sind noch nicht verfügbar.",
  "Plan a clean": "Reinigung planen",
  "Cleaning session": "Reinigung",
  "Cleaning session preview": "Reinigungsvorschau",
  "Info": "Info",
  "Settings": "Einstellungen",
  "Station": "Station",
  "Robot": "Roboter",
  "Station settings": "Stationseinstellungen",
  "Consumables": "Verbrauchsmaterialien",
  "Supplies": "Verbrauch",
  "Robot information": "Roboterinformationen",
  "Close information": "Informationen schließen",
  "Consumables: replacement needed soon": "Verbrauchsmaterialien: baldiger Austausch erforderlich",
  "Cleaning mode": "Reinigungsmodus",
  "Vacuum Power": "Saugstufe",
  "Water level": "Wassermenge",
  "Clean repetitions": "Durchgänge",
  "Vacuum": "Saugen",
  "Mop": "Wischen",
  "Vacuum and Mop": "Saugen und Wischen",
  "Vacuum then Mop": "Saugen dann wischen",
  "Auto": "Auto",
  "Boost": "Boost",
  "Quiet": "Leise",
  "Quick": "Schnell",
  "Very Low": "Sehr niedrig",
  "Low": "Niedrig",
  "Medium": "Mittel",
  "High": "Hoch",
  "One Pass": "Ein Durchgang",
  "Two Passes": "Zwei Durchgänge",
  "Hot water mopping": "Heißwasser-Wischen",
  "Hot water self-cleaning": "Heißwasser-Selbstreinigung",
  "Extended roller preparation": "Erweiterte Walzenvorbereitung",
  "Cleaning solution": "Reinigungsmittel",
  "Self-cleaning frequency": "Selbstreinigungsintervall",
  "Roller drying duration": "Walzentrocknungsdauer",
  "After each room": "Nach jedem Raum",
  "Every 15 minutes": "Alle 15 Minuten",
  "Every 30 minutes": "Alle 30 Minuten",
  "Only as needed": "Nur bei Bedarf",
  "2 hours": "2 Stunden",
  "3 hours": "3 Stunden",
  "4 hours": "4 Stunden",
  "5 hours": "5 Stunden",
  "Empty dust bin": "Staubbehälter leeren",
  "Wash mop roller": "Wischwalze reinigen",
  "Dry mop roller": "Wischwalze trocknen",
  "Press": "Ausführen",
  "on": "Ein",
  "off": "Aus",
  "Brush bar": "Bürstenwalze",
  "Mop roller": "Wischwalze",
  "Side brushes": "Seitenbürsten",
  "Robot filter": "Roboterfilter",
  "Dock filter": "Stationsfilter",
  "Ready to use": "Einsatzbereit",
  "Refill required": "Nachfüllen erforderlich",
  "Enabled": "Aktiviert",
  "Disabled": "Deaktiviert",
  "Status unavailable": "Status nicht verfügbar",
  "Show robot error": "Roboterfehler anzeigen",
  "Dismiss error message": "Fehlermeldung ausblenden",
  "Docked": "An der Station",
  "Idle": "Bereit",
  "Unavailable": "Nicht verfügbar",
  "Not available": "Noch nicht verfügbar",
  "{percent}% remaining": "{percent}% verbleibend",
  "{name} remaining life": "Restlebensdauer: {name}",
  "Save settings": "Speichern",
  "Start clean": "Reinigung starten",
  "Saving …": "Speichern …",
  "Discard draft": "Entwurf verwerfen",
  "Local draft": "Lokaler Entwurf",
  "From Home Assistant": "Aus Home Assistant",
  "{selected} of {total} rooms selected": "{selected} von {total} Räumen ausgewählt",
  "Select {name}": "{name} auswählen",
  "Settings for {name}": "Einstellungen für {name}",
  "Room settings unavailable": "Raumeinstellungen nicht verfügbar",
  "Room ID unavailable": "Raum-ID nicht verfügbar",
  "Room ID unavailable. Check the updated integration and refresh rooms.": "Raum-ID nicht verfügbar. Integration prüfen und Räume aktualisieren.",
  "No enabled rooms found. Check the card configuration and room discovery.": "Keine aktivierten Räume gefunden. Kartenkonfiguration und Raumerkennung prüfen.",
  "The updated Dyson integration actions are not available. Reload the integration and refresh this dashboard.": "Die benötigten Dyson-Aktionen sind nicht verfügbar. Integration neu laden und Dashboard aktualisieren.",
  "Settings changed outside this card. Your edited values remain in the local draft.": "Einstellungen wurden außerhalb dieser Karte geändert. Deine Änderungen bleiben im lokalen Entwurf.",
  "Pause": "Pausieren",
  "Resume": "Fortsetzen",
  "Home": "Zur Station",
  "Cleaning map": "Reinigungskarte",
  "Refreshes about every 5 seconds": "Aktualisierung etwa alle 5 Sekunden",
  "Drying time remaining": "Verbleibende Trocknungszeit",
  "Cancel drying": "Trocknung abbrechen",
  "Remaining time: unavailable": "Restzeit: nicht verfügbar",
  "Remaining time: {time} (hh:mm)": "Restzeit: {time} (hh:mm)",
  "Drying cancellation requires a connected robot and the integration cancel_drying action.": "Zum Abbrechen der Trocknung werden ein verbundener Roboter und die Integrationsaktion cancel_drying benötigt.",
  "This action is not available in the current robot state.": "Diese Aktion ist im aktuellen Roboterzustand nicht verfügbar.",
  "Robot unavailable": "Roboter nicht verfügbar",
  "Robot needs attention": "Roboter benötigt Hilfe",
  "Paused": "Pausiert",
  "Cleaning mop roller": "Wischwalze wird gereinigt",
  "Drying mop roller": "Wischwalze wird getrocknet",
  "Emptying dust bin": "Staubbehälter wird geleert",
  "Vacuuming": "Saugen aktiv",
  "Mopping": "Wischen aktiv",
  "Vacuuming and mopping": "Saugen und Wischen aktiv",
  "Cleaning": "Reinigung aktiv",
  "Returning / mapping": "Rückfahrt / Kartierung",
  "Robot disconnected": "Roboter nicht verbunden",
  "Mapping / navigation in progress": "Kartierung / Navigation läuft",
  "Returning to dock / finishing cleanup": "Rückfahrt zur Station / Reinigung wird abgeschlossen",
  "A cleaning job is still active": "Ein Reinigungsauftrag ist noch aktiv",
  "Waiting for the robot to be ready": "Warten auf Bereitschaft des Roboters",
  "The integration is not ready to start a new clean": "Die Integration ist noch nicht für eine neue Reinigung bereit",
  "Wait for the dock cycle to finish before starting a clean": "Vor einer neuen Reinigung das Ende des Stationsvorgangs abwarten",
  "Waiting for a connection to the robot.": "Warten auf die Verbindung zum Roboter.",
  "Cleaning session active": "Reinigung aktiv",
  "Cleaning session paused": "Reinigung pausiert",
  "Robot returning": "Roboter kehrt zurück",
  "The integration is reporting a return or mapping operation.": "Die Integration meldet eine Rückfahrt oder Kartierung.",
  "Check the robot or the Dyson app for details.": "Details am Roboter oder in der Dyson-App prüfen.",
  "Starting clean": "Reinigung wird gestartet",
  "Waiting for the robot to report its status.": "Warten auf die Statusmeldung des Roboters.",
  "Waiting for robot status": "Warten auf Roboterstatus",
  "The robot is not reporting a ready state.": "Der Roboter meldet noch keine Bereitschaft.",
  "Battery and charging": "Akku und Ladestatus",
  "Battery level unavailable": "Akkustand nicht verfügbar",
  "Battery: {percent}%": "Akku: {percent}%",
  "Charging": "Wird geladen",
  "Not charging": "Wird nicht geladen",
  "Charging status unavailable": "Ladestatus nicht verfügbar",
  "{battery}. {charging}.": "{battery}. {charging}.",
  "Live cleaning map": "Live-Reinigungskarte",
  "Loading cleaning map …": "Reinigungskarte wird geladen …",
  "Waiting for an active robot status.": "Warten auf einen aktiven Roboterstatus.",
  "Camera unavailable.": "Kamera nicht verfügbar.",
  "No map camera found. Select one in the card editor.": "Keine Kartenkamera gefunden. Bitte im Karteneditor auswählen.",
  "The camera image is not available yet.": "Das Kamerabild ist noch nicht verfügbar.",
  "Map update unavailable.": "Kartenaktualisierung nicht verfügbar.",
  "{message} Showing the last received image.": "{message} Das zuletzt empfangene Bild wird angezeigt.",
  "Language": "Sprache",
  "Automatic": "Automatisch",
  "Dyson device": "Dyson-Gerät",
  "Select a device": "Gerät auswählen",
  "Title": "Titel",
  "Theme": "Design",
  "Classic": "Classic",
  "Modern": "Modern",
  "Unsupported settings": "Nicht unterstützte Einstellungen",
  "Show disabled": "Deaktiviert anzeigen",
  "Hide": "Ausblenden",
  "Always show all settings": "Immer alle Einstellungen anzeigen",
  "Per-room settings are detected automatically. Saving and starting use the Dyson integration batch actions.": "Raumeinstellungen werden automatisch erkannt. Speichern und Starten verwenden die Sammelaktionen der Dyson-Integration.",
  "Status bar": "Statusleiste",
  "Show status bar": "Statusleiste anzeigen",
  "Visible status indicators": "Sichtbare Statusanzeigen",
  "Show battery percentage": "Akkustand in Prozent anzeigen",
  "Show camera during a cleaning session": "Kamera während der Reinigung anzeigen",
  "Turning this off removes the map and stops image requests from this card.": "Ausgeschaltet wird die Karte ausgeblendet und es werden keine Bilder mehr abgerufen.",
  "Map camera": "Kartenkamera",
  "Auto-detect": "Automatisch erkennen",
  "Map rotation": "Kartendrehung",
  "Rooms in this card": "Räume auf dieser Karte",
  "Choose which rooms to show. Arrows change the display order, not the robot cleaning order.": "Anzuzeigende Räume auswählen. Die Pfeile ändern die Anzeigereihenfolge, nicht die Reinigungsreihenfolge.",
  "Move {name} up": "{name} nach oben verschieben",
  "Move {name} down": "{name} nach unten verschieben",
  "Refresh rooms": "Räume aktualisieren",
  "Rooms disabled in Home Assistant are not offered. New rooms appear automatically.": "In Home Assistant deaktivierte Räume werden nicht angeboten. Neue Räume erscheinen automatisch.",
  "Could not read the entity registry. Check the connection and user permissions.": "Die Entitätsregistrierung konnte nicht gelesen werden. Verbindung und Benutzerrechte prüfen.",
  "The Dyson device was not found in the entity registry.": "Das Dyson-Gerät wurde nicht in der Entitätsregistrierung gefunden.",
  "The Dyson room list is not currently available.": "Die Dyson-Raumliste ist derzeit nicht verfügbar.",
  "Room switch mapping is ambiguous": "Zuordnung des Raumschalters ist nicht eindeutig",
  "Multiple rooms map to the same switch.": "Mehrere Räume sind demselben Schalter zugeordnet.",
  "Select a vacuum entity.": "Bitte eine Staubsauger-Entität auswählen.",
  "theme must be classic or modern.": "theme muss classic oder modern sein.",
  "language must be auto, en, de, nl or fr.": "language muss auto, en, de, nl oder fr sein.",
  "unsupported_settings must be disabled or hidden.": "unsupported_settings muss disabled oder hidden sein.",
  "{key} must be a list of entity IDs.": "{key} muss eine Liste von Entitäts-IDs sein.",
  "room_entities must map room names to switch entities.": "room_entities muss Raumnamen Schalter-Entitäten zuordnen.",
  "show_battery_percentage must be true or false.": "show_battery_percentage muss true oder false sein.",
  "show_status_bar must be true or false.": "show_status_bar muss true oder false sein.",
  "hidden_status_items must be a list of indicator keys.": "hidden_status_items muss eine Liste von Anzeigeschlüsseln sein.",
  "show_camera must be true or false.": "show_camera muss true oder false sein.",
  "always_show_all_settings must be true or false.": "always_show_all_settings muss true oder false sein.",
  "camera_rotation must be 0, 90, 180 or 270.": "camera_rotation muss 0, 90, 180 oder 270 sein.",
  "Select a camera entity.": "Bitte eine Kamera-Entität auswählen.",
  "Home Assistant is not connected.": "Keine Verbindung zu Home Assistant.",
  "Update the Dyson integration: {action} is unavailable.": "Dyson-Integration aktualisieren: {action} ist nicht verfügbar.",
  "The robot is unavailable.": "Der Roboter ist nicht verfügbar.",
  "Start is only available when the Dyson is ready (docked or idle).": "Starten ist nur möglich, wenn der Dyson bereit ist (an der Station oder im Leerlauf).",
  "A room in your draft is unavailable or ambiguous. Review or discard the draft.": "Ein Raum im Entwurf ist nicht verfügbar oder nicht eindeutig. Entwurf prüfen oder verwerfen.",
  "{setting} is no longer available for {room}.": "{setting} ist für {room} nicht mehr verfügbar.",
  "A selected room has no stable room ID. Refresh rooms and check the integration.": "Ein ausgewählter Raum hat keine stabile Raum-ID. Räume aktualisieren und Integration prüfen.",
  "Select at least one room without duplicates.": "Mindestens einen Raum ohne Duplikate auswählen.",
  "An action for this Dyson is already running in this browser.": "In diesem Browser läuft bereits eine Aktion für diesen Dyson.",
  "This action is not available for the current robot state.": "Diese Aktion ist im aktuellen Roboterzustand nicht verfügbar.",
  "This station action is unavailable.": "Diese Stationsaktion ist nicht verfügbar.",
  "This station setting is unavailable.": "Diese Stationseinstellung ist nicht verfügbar.",
  "Invalid station switch value.": "Ungültiger Wert für den Stationsschalter.",
  "Invalid station option.": "Ungültige Stationsoption.",
  "Sending room settings and start request …": "Raumeinstellungen und Startanforderung werden gesendet …",
  "The start was sent, but the robot has not reported an active session. Check its status before trying again.": "Die Startanforderung wurde gesendet, aber der Roboter meldet keine aktive Reinigung. Vor einem erneuten Versuch seinen Status prüfen.",
  "{error} No automatic retry will be made.": "{error} Es erfolgt kein automatischer Wiederholungsversuch.",
  "Saving room settings …": "Raumeinstellungen werden gespeichert …",
  "Save was sent, but Home Assistant has not reflected all values yet. The draft was kept; check the robot before retrying.": "Speichern wurde gesendet, aber Home Assistant zeigt noch nicht alle Werte. Der Entwurf bleibt erhalten; vor einem erneuten Versuch den Roboter prüfen.",
  "Settings sent. Home Assistant values updated. Room selection remains local.": "Einstellungen gesendet und Werte in Home Assistant aktualisiert. Die Raumauswahl bleibt lokal.",
  "Zone": "Zone",
  "Zone cleaning": "Zonenreinigung",
  "Zone selection": "Zonenauswahl",
  "Vacuum · Auto · One pass. Drag the zone or resize its lower-right corner.": "Saugen · Auto · Ein Durchgang. Zone verschieben oder an der unteren rechten Ecke vergrößern.",
  "Reload map": "Karte neu laden",
  "Back to rooms": "Zurück zu den Räumen",
  "Move zone. Use the arrow keys.": "Zone mit den Pfeiltasten verschieben.",
  "Resize zone. Use the arrow keys.": "Zonengröße mit den Pfeiltasten ändern.",
  "The active map changed. Reload the map and select a new zone.": "Die aktive Karte hat sich geändert. Karte neu laden und eine neue Zone auswählen.",
  "Loading calibrated map …": "Kalibrierte Karte wird geladen …",
  "Camera must belong to the selected robot.": "Die Kamera muss zum ausgewählten Roboter gehören.",
  "Camera image unavailable.": "Kamerabild nicht verfügbar.",
  "A calibrated PNG image is required.": "Ein kalibriertes PNG-Bild wird benötigt.",
  "Image and calibration do not match. Reload the map.": "Bild und Kalibrierung passen nicht zusammen. Karte neu laden.",
  "Map loading timed out. Reload the map.": "Zeitüberschreitung beim Laden. Karte neu laden.",
  "A calibrated map is required. Reload the map.": "Eine kalibrierte Karte wird benötigt. Karte neu laden.",
  "Zone start unavailable: check robot readiness, map and integration action.": "Zonenstart nicht verfügbar: Startbereitschaft, Karte und Integrationsaktion prüfen.",
  "Map frozen for selection. Room settings remain unchanged.": "Kartenbild für die Auswahl fixiert. Raumeinstellungen bleiben unverändert.",
  "Sending zone start …": "Zonenstart wird gesendet …",
  "Zone start failed. Check the robot before retrying.": "Zonenstart fehlgeschlagen. Vor einem erneuten Versuch den Roboter prüfen.",
  "Mop repetitions": "Wischdurchgänge"
};

// Dutch UI text. Protocol values and entity names remain unchanged.
const nl = {
  "Updating setting …": "Instelling wijzigen …",
  "The setting change has not been confirmed by Home Assistant. Check the robot before trying again.": "Home Assistant heeft de gewijzigde instelling nog niet bevestigd. Controleer de robot voordat je het opnieuw probeert.",
  "Suction power · all selected rooms": "Zuigkracht · alle geselecteerde kamers",
  "Robot setting; it may remain active after this clean.": "Robotinstelling; deze kan na deze reiniging actief blijven.",
  "The selected suction power is no longer available. Review or discard the draft.": "De gekozen zuigkracht is niet meer beschikbaar. Controleer of verwerp het concept.",
  "The suction power command was sent, but area cleaning was not confirmed. Check the robot before retrying. {error}": "De opdracht voor de zuigkracht is verzonden, maar de ruimtereiniging is niet bevestigd. Controleer de robot voordat je het opnieuw probeert. {error}",
  "Select mapped Home Assistant areas. The robot controls room order.": "Selecteer gekoppelde Home Assistant-ruimtes. De robot bepaalt de kamervolgorde.",
  "Home Assistant · Area cleaning": "Home Assistant · Ruimtereiniging",
  "Select mapped Home Assistant areas. The robot controls cleaning settings and room order.": "Selecteer gekoppelde Home Assistant-ruimtes. De robot bepaalt de reinigingsinstellingen en kamervolgorde.",
  "Sending area cleaning request …": "Ruimtereiniging aanvragen …",
  "The robot was not found in the entity registry.": "De robot is niet gevonden in het entiteitenregister.",
  "This robot does not report Home Assistant area cleaning support.": "Deze robot meldt geen ondersteuning voor ruimtereiniging via Home Assistant.",
  "Map the robot segments to Home Assistant areas in the vacuum entity settings.": "Koppel de robotsegmenten aan Home Assistant-ruimtes in de instellingen van de stofzuigerentiteit.",
  "Home Assistant areas are unavailable. Reload the dashboard.": "De Home Assistant-ruimtes zijn niet beschikbaar. Herlaad het dashboard.",
  "Home Assistant area cleaning is unavailable. Check your Home Assistant version and integration.": "Home Assistant-ruimtereiniging is niet beschikbaar. Controleer je Home Assistant-versie en integratie.",
  "Start is only available when the robot is docked or idle.": "Starten is alleen mogelijk als de robot in het dock staat of inactief is.",
  "The room selection changed. Refresh rooms and select the areas again.": "De kamerkoppeling is gewijzigd. Vernieuw de kamers en selecteer de ruimtes opnieuw.",
  "An action for this robot is already running in this browser.": "Er loopt al een actie voor deze robot in deze browser.",
  "Next cleaning in {duration}": "Volgende reiniging over {duration}",
  "Next known cleaning in {duration}": "Volgende bekende reiniging over {duration}",
  "No active schedules": "Geen actieve schema's",
  "Next cleaning unknown": "Volgende reiniging onbekend",
  "Next cleaning unavailable": "Volgende reiniging niet beschikbaar",
  "The Home Assistant time zone is unavailable.": "De tijdzone van Home Assistant is niet beschikbaar.",
  "Calculated from reported weekly schedules; actual execution may differ.": "Berekend uit de gemelde weekschema's; de werkelijke uitvoering kan afwijken.",
  "Schedules, active: {count}": "Schema's, actief: {count}",
  "Active schedules: {count}": "Actieve schema's: {count}",
  "Schedule created.": "Schema aangemaakt.",
  "Schedule saved.": "Schema opgeslagen.",
  "Schedule deleted.": "Schema verwijderd.",
  "Saving schedule …": "Schema opslaan …",
  "Updating schedule …": "Schema bijwerken …",
  "The change has not been confirmed by Home Assistant. Check the schedule in MyDyson before trying again.": "Home Assistant heeft de wijziging nog niet bevestigd. Controleer het schema in MyDyson voordat je het opnieuw probeert.",
  "Discard": "Verwerpen",
  "Schedule actions {time} ({days})": "Acties voor schema {time} ({days})",
  "Stored settings not reported": "Opgeslagen instellingen niet gemeld",
  "Move room up": "Kamer omhoog",
  "Move room down": "Kamer omlaag",
  "Remove room": "Kamer verwijderen",
  "Keep stored setting": "Opgeslagen instelling behouden",
  "Rooms and cleaning settings": "Kamers en reinigingsinstellingen",
  "Some stored settings are not reported. Unchanged settings will be preserved.": "Sommige opgeslagen instellingen worden niet gemeld. Ongewijzigde instellingen blijven behouden.",
  "Room editing requires the schedule map to be active. You can still change weekdays and time.": "Om kamers te bewerken moet de kaart van het schema actief zijn. Weekdagen en tijd kun je nog wijzigen.",
  "Add room": "Kamer toevoegen",
  "Choose room": "Kamer kiezen",

  "Selected rooms: {rooms}": "Geselecteerde kamers: {rooms}",
  "Delete schedule": "Schema verwijderen",
  "Delete schedule {time} ({days})": "Schema {time} ({days}) verwijderen",
  "Delete schedule {time} ({days})?": "Schema {time} ({days}) verwijderen?",
  "This removes the schedule from the robot and MyDyson.": "Het schema wordt van de robot en uit MyDyson verwijderd.",
  "Deleting schedule …": "Schema verwijderen …",
  "The integration reuses the robot's stored room selection. This card cannot change it. Check the selected rooms in MyDyson after creating the schedule.": "De integratie neemt de in de robot opgeslagen kamerselectie over. Deze kaart kan die niet wijzigen. Controleer na het maken de geselecteerde kamers in MyDyson.",
  "Selected rooms are not reported by this integration. Check them in MyDyson.": "De integratie meldt de geselecteerde kamers niet. Controleer ze in MyDyson.",
  "Choose time": "Tijd kiezen",
  "Apply time": "Tijd toepassen",
  "Hour": "Uur",
  "Minute": "Minuut",
  "Schedules": "Schema's",
  "Create schedule": "Schema maken",
  "Edit schedule": "Schema bewerken",
  "Save schedule": "Schema opslaan",
  "Weekdays": "Weekdagen",
  "Cancel": "Annuleren",
  "Sending schedule …": "Schema verzenden …",
  "Times use the Home Assistant time zone: {zone}.": "Tijden gebruiken de tijdzone van Home Assistant: {zone}.",
  "Schedules are unavailable. Check the robot connection and integration.": "Schema's zijn niet beschikbaar. Controleer de robotverbinding en integratie.",
  "This schedule is no longer available. Refresh the schedule list.": "Dit schema is niet meer beschikbaar. Vernieuw de schemalijst.",
  "Choose at least one weekday and a valid time.": "Kies minstens één weekdag en een geldige tijd.",
  "Invalid schedule state.": "Ongeldige schemastatus.",
  "The room plan changed. Close the dialog and review your room settings.": "De kamerplanning is gewijzigd. Sluit het venster en controleer je kamerinstellingen.",
  "Schedule request sent. The list updates when Home Assistant reports the change.": "Schemaopdracht verzonden. De lijst wordt bijgewerkt zodra Home Assistant de wijziging meldt.",
  "Schedule request failed. Check the schedule in MyDyson before trying again. {error}": "Schemaopdracht mislukt. Controleer het schema in MyDyson voordat je het opnieuw probeert. {error}",
  "Enable schedule {time} ({days})": "Schema {time} ({days}) inschakelen",
  "Edit schedule {time} ({days})": "Schema {time} ({days}) bewerken",
  "The schedule list may be incomplete. Turn each schedule off and on in MyDyson while the integration is connected.": "De schemalijst is mogelijk onvolledig. Schakel elk schema in MyDyson uit en weer in terwijl de integratie verbonden is.",
  "No known schedules. Create one from the room planner, or turn existing schedules off and on in MyDyson.": "Geen bekende schema's. Maak er een via de kamerplanner of schakel bestaande schema's in MyDyson uit en weer in.",
  "Map entity must use the {domain} domain for this integration.": "De kaartentiteit moet voor deze integratie het domein {domain} gebruiken.",
  "Map image": "Kaartafbeelding",
  "hass-dyson (experimental)": "hass-dyson (experimenteel)",
  "Invalid integration selection.": "Ongeldige integratiekeuze.",
  "The room map is unavailable or ambiguous. Refresh rooms and check the integration.": "De kamerkaart is niet beschikbaar of niet eenduidig. Vernieuw de kamers en controleer de integratie.",
  "Settings were saved, but cleaning did not start. Review the robot status before retrying. {error}": "Instellingen opgeslagen, maar de reiniging is niet gestart. Controleer de robotstatus voordat u het opnieuw probeert. {error}",
  "Room order is controlled by hass-dyson. Changed settings are saved before cleaning starts.": "hass-dyson bepaalt de kamervolgorde. Gewijzigde instellingen worden vóór het reinigen opgeslagen.",
  "Integration": "Integratie",
  "Invalid header icon style.": "Ongeldige stijl voor het koptekstpictogram.",
  "Header icon style": "Koptekstpictogram",
  "Invalid zone dimension unit.": "Ongeldige eenheid voor zoneafmetingen.",
  "Off": "Uit",
  "Inches": "Inches",
  "Centimeters": "Centimeters",
  "Dimension display": "Afmetingen weergeven",
  "Voice prompts": "Spraakmeldingen",
  "Volume": "Volume",
  "Child lock": "Kinderslot",
  "Do not disturb": "Niet storen",
  "Start time": "Starttijd",
  "End time": "Eindtijd",
  "This robot setting is unavailable.": "Deze robotinstelling is niet beschikbaar.",
  "Invalid robot setting.": "Ongeldige robotinstelling.",
  "Mop pad": "Dweilpad",
  "Cleaning selection": "Reinigingsselectie",
  "Rooms": "Kamers",
  "Close": "Sluiten",
  "One pass": "Eén keer",
  "Drag the zone or resize its lower-right corner.": "Versleep de zone of pas het formaat aan via de rechteronderhoek.",
  "Settings are sent only when you start the zone clean.": "Instellingen worden pas verzonden wanneer je de zonereiniging start.",
  "Two passes are not yet available.": "Twee keer reinigen is nog niet beschikbaar.",
  "Not yet available": "Nog niet beschikbaar",
  "Other cleaning modes are not yet available.": "Andere reinigingsmodi zijn nog niet beschikbaar.",
  "Plan a clean": "Reiniging plannen",
  "Cleaning session": "Reinigingssessie",
  "Cleaning session preview": "Voorbeeld van reinigingssessie",
  "Info": "Info",
  "Settings": "Instellingen",
  "Station": "Station",
  "Robot": "Robot",
  "Station settings": "Stationinstellingen",
  "Consumables": "Verbruiksartikelen",
  "Supplies": "Verbruik",
  "Robot information": "Robotinformatie",
  "Close information": "Informatie sluiten",
  "Consumables: replacement needed soon": "Verbruiksartikelen: binnenkort vervangen",
  "Cleaning mode": "Reinigingsmodus",
  "Vacuum Power": "Zuigkracht",
  "Water level": "Waterniveau",
  "Clean repetitions": "Aantal reinigingen",
  "Vacuum": "Stofzuigen",
  "Mop": "Dweilen",
  "Vacuum and Mop": "Stofzuigen en dweilen",
  "Vacuum then Mop": "Stofzuigen, dan dweilen",
  "Auto": "Auto",
  "Boost": "Boost",
  "Quiet": "Stil",
  "Quick": "Snel",
  "Very Low": "Zeer laag",
  "Low": "Laag",
  "Medium": "Gemiddeld",
  "High": "Hoog",
  "One Pass": "Eén keer",
  "Two Passes": "Twee keer",
  "Hot water mopping": "Dweilen met warm water",
  "Hot water self-cleaning": "Zelfreiniging met warm water",
  "Extended roller preparation": "Uitgebreide rolvoorbereiding",
  "Cleaning solution": "Reinigingsmiddel",
  "Self-cleaning frequency": "Frequentie zelfreiniging",
  "Roller drying duration": "Droogtijd van de rol",
  "After each room": "Na elke kamer",
  "Every 15 minutes": "Elke 15 minuten",
  "Every 30 minutes": "Elke 30 minuten",
  "Only as needed": "Alleen indien nodig",
  "2 hours": "2 uur",
  "3 hours": "3 uur",
  "4 hours": "4 uur",
  "5 hours": "5 uur",
  "Empty dust bin": "Stofreservoir legen",
  "Wash mop roller": "Dweilrol wassen",
  "Dry mop roller": "Dweilrol drogen",
  "Press": "Drukken",
  "on": "aan",
  "off": "uit",
  "Brush bar": "Borstelrol",
  "Mop roller": "Dweilrol",
  "Side brushes": "Zijborstels",
  "Robot filter": "Robotfilter",
  "Dock filter": "Stationfilter",
  "Ready to use": "Klaar voor gebruik",
  "Refill required": "Bijvullen nodig",
  "Enabled": "Ingeschakeld",
  "Disabled": "Uitgeschakeld",
  "Status unavailable": "Status niet beschikbaar",
  "Show robot error": "Robotfout weergeven",
  "Dismiss error message": "Foutmelding verbergen",
  "Docked": "In het station",
  "Idle": "Inactief",
  "Unavailable": "Niet beschikbaar",
  "Not available": "Niet beschikbaar",
  "{percent}% remaining": "{percent}% resterend",
  "{name} remaining life": "Resterende levensduur van {name}",
  "Save settings": "Instellingen opslaan",
  "Start clean": "Reiniging starten",
  "Saving …": "Opslaan …",
  "Discard draft": "Concept verwerpen",
  "Local draft": "Lokaal concept",
  "From Home Assistant": "Uit Home Assistant",
  "{selected} of {total} rooms selected": "{selected} van {total} kamers geselecteerd",
  "Select {name}": "{name} selecteren",
  "Settings for {name}": "Instellingen voor {name}",
  "Room settings unavailable": "Kamerinstellingen niet beschikbaar",
  "Room ID unavailable": "Kamer-ID niet beschikbaar",
  "Room ID unavailable. Check the updated integration and refresh rooms.": "Kamer-ID niet beschikbaar. Controleer de bijgewerkte integratie en vernieuw de kamers.",
  "No enabled rooms found. Check the card configuration and room discovery.": "Geen ingeschakelde kamers gevonden. Controleer de kaartconfiguratie en kamerdetectie.",
  "The updated Dyson integration actions are not available. Reload the integration and refresh this dashboard.": "De bijgewerkte Dyson-integratieacties zijn niet beschikbaar. Herlaad de integratie en vernieuw dit dashboard.",
  "Settings changed outside this card. Your edited values remain in the local draft.": "Instellingen zijn buiten deze kaart gewijzigd. Je wijzigingen blijven in het lokale concept staan.",
  "Pause": "Pauzeren",
  "Resume": "Hervatten",
  "Home": "Naar station",
  "Cleaning map": "Reinigingskaart",
  "Refreshes about every 5 seconds": "Wordt ongeveer elke 5 seconden vernieuwd",
  "Drying time remaining": "Resterende droogtijd",
  "Cancel drying": "Drogen stoppen",
  "Remaining time: unavailable": "Resterende tijd: niet beschikbaar",
  "Remaining time: {time} (hh:mm)": "Resterende tijd: {time} (uu:mm)",
  "Drying cancellation requires a connected robot and the integration cancel_drying action.": "Om het drogen te stoppen zijn een verbonden robot en de integratieactie cancel_drying nodig.",
  "This action is not available in the current robot state.": "Deze actie is niet beschikbaar in de huidige robotstatus.",
  "Robot unavailable": "Robot niet beschikbaar",
  "Robot needs attention": "Robot heeft aandacht nodig",
  "Paused": "Gepauzeerd",
  "Cleaning mop roller": "Dweilrol wordt gereinigd",
  "Drying mop roller": "Dweilrol wordt gedroogd",
  "Emptying dust bin": "Stofreservoir wordt geleegd",
  "Vacuuming": "Bezig met stofzuigen",
  "Mopping": "Bezig met dweilen",
  "Vacuuming and mopping": "Bezig met stofzuigen en dweilen",
  "Cleaning": "Bezig met reinigen",
  "Returning / mapping": "Terugkeren / in kaart brengen",
  "Robot disconnected": "Verbinding met robot verbroken",
  "Mapping / navigation in progress": "Bezig met in kaart brengen / navigeren",
  "Returning to dock / finishing cleanup": "Terug naar station / reiniging afronden",
  "A cleaning job is still active": "Er is nog een reinigingsopdracht actief",
  "Waiting for the robot to be ready": "Wachten tot de robot klaar is",
  "The integration is not ready to start a new clean": "De integratie is niet klaar om een nieuwe reiniging te starten",
  "Wait for the dock cycle to finish before starting a clean": "Wacht tot de stationscyclus is voltooid voordat je een reiniging start",
  "Waiting for a connection to the robot.": "Wachten op verbinding met de robot.",
  "Cleaning session active": "Reinigingssessie actief",
  "Cleaning session paused": "Reinigingssessie gepauzeerd",
  "Robot returning": "Robot keert terug",
  "The integration is reporting a return or mapping operation.": "De integratie meldt een terugkeer of het in kaart brengen van de ruimte.",
  "Check the robot or the Dyson app for details.": "Controleer de robot of de Dyson-app voor meer informatie.",
  "Starting clean": "Reiniging wordt gestart",
  "Waiting for the robot to report its status.": "Wachten tot de robot zijn status meldt.",
  "Waiting for robot status": "Wachten op robotstatus",
  "The robot is not reporting a ready state.": "De robot meldt niet dat hij gereed is.",
  "Battery and charging": "Accu en opladen",
  "Battery level unavailable": "Accuniveau niet beschikbaar",
  "Battery: {percent}%": "Accu: {percent}%",
  "Charging": "Bezig met opladen",
  "Not charging": "Laadt niet op",
  "Charging status unavailable": "Laadstatus niet beschikbaar",
  "{battery}. {charging}.": "{battery}. {charging}.",
  "Live cleaning map": "Live reinigingskaart",
  "Loading cleaning map …": "Reinigingskaart laden …",
  "Waiting for an active robot status.": "Wachten op een actieve robotstatus.",
  "Camera unavailable.": "Camera niet beschikbaar.",
  "No map camera found. Select one in the card editor.": "Geen kaartcamera gevonden. Selecteer er een in de kaarteditor.",
  "The camera image is not available yet.": "Het camerabeeld is nog niet beschikbaar.",
  "Map update unavailable.": "Kaartupdate niet beschikbaar.",
  "{message} Showing the last received image.": "{message} Het laatst ontvangen beeld wordt weergegeven.",
  "Language": "Taal",
  "Automatic": "Automatisch",
  "Dyson device": "Dyson-apparaat",
  "Select a device": "Selecteer een apparaat",
  "Title": "Titel",
  "Theme": "Thema",
  "Classic": "Klassiek",
  "Modern": "Modern",
  "Unsupported settings": "Niet-ondersteunde instellingen",
  "Show disabled": "Uitgeschakeld tonen",
  "Hide": "Verbergen",
  "Always show all settings": "Altijd alle instellingen tonen",
  "Per-room settings are detected automatically. Saving and starting use the Dyson integration batch actions.": "Kamerinstellingen worden automatisch gedetecteerd. Opslaan en starten gebruiken de batchacties van de Dyson-integratie.",
  "Status bar": "Statusbalk",
  "Show status bar": "Statusbalk tonen",
  "Visible status indicators": "Zichtbare statusindicatoren",
  "Show battery percentage": "Accupercentage tonen",
  "Show camera during a cleaning session": "Camera tonen tijdens een reinigingssessie",
  "Turning this off removes the map and stops image requests from this card.": "Als je dit uitschakelt, verdwijnt de kaart en vraagt deze kaart geen beelden meer op.",
  "Map camera": "Kaartcamera",
  "Auto-detect": "Automatisch detecteren",
  "Map rotation": "Kaartrotatie",
  "Rooms in this card": "Kamers op deze kaart",
  "Choose which rooms to show. Arrows change the display order, not the robot cleaning order.": "Kies welke kamers worden getoond. De pijlen veranderen de weergavevolgorde, niet de reinigingsvolgorde.",
  "Move {name} up": "{name} omhoog verplaatsen",
  "Move {name} down": "{name} omlaag verplaatsen",
  "Refresh rooms": "Kamers vernieuwen",
  "Rooms disabled in Home Assistant are not offered. New rooms appear automatically.": "Kamers die in Home Assistant zijn uitgeschakeld, worden niet aangeboden. Nieuwe kamers verschijnen automatisch.",
  "Could not read the entity registry. Check the connection and user permissions.": "Het entiteitenregister kon niet worden gelezen. Controleer de verbinding en gebruikersrechten.",
  "The Dyson device was not found in the entity registry.": "Het Dyson-apparaat is niet gevonden in het entiteitenregister.",
  "The Dyson room list is not currently available.": "De Dyson-kamerlijst is momenteel niet beschikbaar.",
  "Room switch mapping is ambiguous": "De koppeling met de kamerschakelaar is niet eenduidig",
  "Multiple rooms map to the same switch.": "Meerdere kamers zijn aan dezelfde schakelaar gekoppeld.",
  "Select a vacuum entity.": "Selecteer een stofzuigerentiteit.",
  "theme must be classic or modern.": "theme moet classic of modern zijn.",
  "unsupported_settings must be disabled or hidden.": "unsupported_settings moet disabled of hidden zijn.",
  "{key} must be a list of entity IDs.": "{key} moet een lijst met entiteits-ID's zijn.",
  "room_entities must map room names to switch entities.": "room_entities moet kamernamen aan schakelaarentiteiten koppelen.",
  "show_battery_percentage must be true or false.": "show_battery_percentage moet true of false zijn.",
  "show_status_bar must be true or false.": "show_status_bar moet true of false zijn.",
  "hidden_status_items must be a list of indicator keys.": "hidden_status_items moet een lijst met indicatorsleutels zijn.",
  "show_camera must be true or false.": "show_camera moet true of false zijn.",
  "always_show_all_settings must be true or false.": "always_show_all_settings moet true of false zijn.",
  "camera_rotation must be 0, 90, 180 or 270.": "camera_rotation moet 0, 90, 180 of 270 zijn.",
  "Select a camera entity.": "Selecteer een camera-entiteit.",
  "Home Assistant is not connected.": "Home Assistant is niet verbonden.",
  "Update the Dyson integration: {action} is unavailable.": "Werk de Dyson-integratie bij: {action} is niet beschikbaar.",
  "The robot is unavailable.": "De robot is niet beschikbaar.",
  "Start is only available when the Dyson is ready (docked or idle).": "Starten kan alleen als de Dyson gereed is (in het station of inactief).",
  "A room in your draft is unavailable or ambiguous. Review or discard the draft.": "Een kamer in je concept is niet beschikbaar of niet eenduidig gekoppeld. Controleer of verwerp het concept.",
  "{setting} is no longer available for {room}.": "{setting} is niet meer beschikbaar voor {room}.",
  "A selected room has no stable room ID. Refresh rooms and check the integration.": "Een geselecteerde kamer heeft geen stabiele kamer-ID. Vernieuw de kamers en controleer de integratie.",
  "Select at least one room without duplicates.": "Selecteer minstens één kamer, zonder dubbele selecties.",
  "An action for this Dyson is already running in this browser.": "Er wordt in deze browser al een actie voor deze Dyson uitgevoerd.",
  "This action is not available for the current robot state.": "Deze actie is niet beschikbaar in de huidige robotstatus.",
  "This station action is unavailable.": "Deze stationsactie is niet beschikbaar.",
  "This station setting is unavailable.": "Deze stationsinstelling is niet beschikbaar.",
  "Invalid station switch value.": "Ongeldige waarde voor de stationsschakelaar.",
  "Invalid station option.": "Ongeldige stationsoptie.",
  "Sending room settings and start request …": "Kamerinstellingen en startverzoek verzenden …",
  "The start was sent, but the robot has not reported an active session. Check its status before trying again.": "Het startverzoek is verzonden, maar de robot heeft geen actieve sessie gemeld. Controleer zijn status voordat je het opnieuw probeert.",
  "{error} No automatic retry will be made.": "{error} Er wordt niet automatisch opnieuw geprobeerd.",
  "Saving room settings …": "Kamerinstellingen opslaan …",
  "Save was sent, but Home Assistant has not reflected all values yet. The draft was kept; check the robot before retrying.": "Het opslagverzoek is verzonden, maar Home Assistant toont nog niet alle waarden. Het concept is bewaard; controleer de robot voordat je het opnieuw probeert.",
  "Settings sent. Home Assistant values updated. Room selection remains local.": "Instellingen verzonden. Waarden in Home Assistant bijgewerkt. De kamerselectie blijft lokaal.",
  "Zone": "Zone",
  "Zone cleaning": "Zonereiniging",
  "Zone selection": "Zoneselectie",
  "Vacuum · Auto · One pass. Drag the zone or resize its lower-right corner.": "Stofzuigen · Auto · Eén keer. Versleep de zone of pas het formaat aan via de rechteronderhoek.",
  "Reload map": "Kaart herladen",
  "Back to rooms": "Terug naar kamers",
  "Move zone. Use the arrow keys.": "Zone verplaatsen. Gebruik de pijltjestoetsen.",
  "Resize zone. Use the arrow keys.": "Zoneformaat aanpassen. Gebruik de pijltjestoetsen.",
  "The active map changed. Reload the map and select a new zone.": "De actieve kaart is gewijzigd. Herlaad de kaart en selecteer een nieuwe zone.",
  "Loading calibrated map …": "Gekalibreerde kaart laden …",
  "Camera must belong to the selected robot.": "De camera moet bij de geselecteerde robot horen.",
  "Camera image unavailable.": "Camerabeeld niet beschikbaar.",
  "A calibrated PNG image is required.": "Een gekalibreerd PNG-beeld is vereist.",
  "Image and calibration do not match. Reload the map.": "Beeld en kalibratie komen niet overeen. Herlaad de kaart.",
  "Map loading timed out. Reload the map.": "Het laden van de kaart duurde te lang. Herlaad de kaart.",
  "A calibrated map is required. Reload the map.": "Een gekalibreerde kaart is vereist. Herlaad de kaart.",
  "Zone start unavailable: check robot readiness, map and integration action.": "Zonestart niet beschikbaar: controleer of de robot gereed is, de kaart en de integratieactie.",
  "Map frozen for selection. Room settings remain unchanged.": "Kaartbeeld vastgezet voor selectie. Kamerinstellingen blijven ongewijzigd.",
  "Sending zone start …": "Zonestart verzenden …",
  "Zone start failed. Check the robot before retrying.": "Zonestart mislukt. Controleer de robot voordat je het opnieuw probeert.",
  "Mop repetitions": "Aantal dweilbeurten",
  "language must be auto, en, de, nl or fr.": "language moet auto, en, de, nl of fr zijn.",
};

// French UI translations. Dyson terminology is referenced in docs/translations.md.
const fr = {
  "Updating setting …": "Modification du réglage …",
  "The setting change has not been confirmed by Home Assistant. Check the robot before trying again.": "Home Assistant n'a pas confirmé la modification du réglage. Vérifiez le robot avant de réessayer.",
  "Suction power · all selected rooms": "Aspiration · toutes les pièces sélectionnées",
  "Robot setting; it may remain active after this clean.": "Réglage du robot ; il peut rester actif après ce nettoyage.",
  "The selected suction power is no longer available. Review or discard the draft.": "La puissance d’aspiration choisie n’est plus disponible. Vérifiez ou abandonnez le brouillon.",
  "The suction power command was sent, but area cleaning was not confirmed. Check the robot before retrying. {error}": "La commande d’aspiration a été envoyée, mais le nettoyage des zones n’a pas été confirmé. Vérifiez le robot avant de réessayer. {error}",
  "Select mapped Home Assistant areas. The robot controls room order.": "Sélectionnez les zones Home Assistant associées. Le robot détermine l’ordre des pièces.",
  "Home Assistant · Area cleaning": "Home Assistant · Nettoyage par zone",
  "Select mapped Home Assistant areas. The robot controls cleaning settings and room order.": "Sélectionnez les zones Home Assistant associées. Le robot détermine les réglages de nettoyage et l’ordre des pièces.",
  "Sending area cleaning request …": "Demande de nettoyage des zones …",
  "The robot was not found in the entity registry.": "Le robot est introuvable dans le registre des entités.",
  "This robot does not report Home Assistant area cleaning support.": "Ce robot ne signale pas la prise en charge du nettoyage par zone de Home Assistant.",
  "Map the robot segments to Home Assistant areas in the vacuum entity settings.": "Associez les segments du robot aux zones Home Assistant dans les paramètres de l’entité aspirateur.",
  "Home Assistant areas are unavailable. Reload the dashboard.": "Les zones Home Assistant sont indisponibles. Rechargez le tableau de bord.",
  "Home Assistant area cleaning is unavailable. Check your Home Assistant version and integration.": "Le nettoyage par zone de Home Assistant est indisponible. Vérifiez votre version de Home Assistant et l’intégration.",
  "Start is only available when the robot is docked or idle.": "Le démarrage est possible uniquement lorsque le robot est à sa station ou inactif.",
  "The room selection changed. Refresh rooms and select the areas again.": "L’association des pièces a changé. Actualisez les pièces et sélectionnez à nouveau les zones.",
  "An action for this robot is already running in this browser.": "Une action pour ce robot est déjà en cours dans ce navigateur.",
  "Next cleaning in {duration}": "Prochain nettoyage dans {duration}",
  "Next known cleaning in {duration}": "Prochain nettoyage connu dans {duration}",
  "No active schedules": "Aucune programmation active",
  "Next cleaning unknown": "Prochain nettoyage inconnu",
  "Next cleaning unavailable": "Prochain nettoyage indisponible",
  "The Home Assistant time zone is unavailable.": "Le fuseau horaire de Home Assistant est indisponible.",
  "Calculated from reported weekly schedules; actual execution may differ.": "Calculé à partir des programmations hebdomadaires reçues ; l'exécution réelle peut différer.",
  "Schedules, active: {count}": "Plannings, actifs : {count}",
  "Active schedules: {count}": "Plannings actifs : {count}",
  "Schedule created.": "Programme créé.",
  "Schedule saved.": "Programme enregistré.",
  "Schedule deleted.": "Programme supprimé.",
  "Saving schedule …": "Enregistrement du programme …",
  "Updating schedule …": "Mise à jour du programme …",
  "The change has not been confirmed by Home Assistant. Check the schedule in MyDyson before trying again.": "Home Assistant n’a pas encore confirmé la modification. Vérifiez le programme dans MyDyson avant de réessayer.",
  "Discard": "Abandonner",
  "Schedule actions {time} ({days})": "Actions du programme {time} ({days})",
  "Stored settings not reported": "Réglages enregistrés non communiqués",
  "Move room up": "Monter la pièce",
  "Move room down": "Descendre la pièce",
  "Remove room": "Retirer la pièce",
  "Keep stored setting": "Conserver le réglage enregistré",
  "Rooms and cleaning settings": "Pièces et réglages de nettoyage",
  "Some stored settings are not reported. Unchanged settings will be preserved.": "Certains réglages enregistrés ne sont pas communiqués. Les réglages inchangés seront conservés.",
  "Room editing requires the schedule map to be active. You can still change weekdays and time.": "Le plan du programme doit être actif pour modifier les pièces. Les jours et l’heure restent modifiables.",
  "Add room": "Ajouter une pièce",
  "Choose room": "Choisir une pièce",

  "Selected rooms: {rooms}": "Pièces sélectionnées : {rooms}",
  "Delete schedule": "Supprimer le planning",
  "Delete schedule {time} ({days})": "Supprimer le planning {time} ({days})",
  "Delete schedule {time} ({days})?": "Supprimer le planning {time} ({days}) ?",
  "This removes the schedule from the robot and MyDyson.": "Le planning sera supprimé du robot et de MyDyson.",
  "Deleting schedule …": "Suppression du planning …",
  "The integration reuses the robot's stored room selection. This card cannot change it. Check the selected rooms in MyDyson after creating the schedule.": "L'intégration reprend la sélection de pièces enregistrée sur le robot. Cette carte ne peut pas la modifier. Vérifiez les pièces sélectionnées dans MyDyson après la création du planning.",
  "Selected rooms are not reported by this integration. Check them in MyDyson.": "L'intégration ne communique pas les pièces sélectionnées. Vérifiez-les dans MyDyson.",
  "Choose time": "Choisir l'heure",
  "Apply time": "Appliquer l'heure",
  "Hour": "Heure",
  "Minute": "Minute",
  "Schedules": "Plannings",
  "Create schedule": "Créer un planning",
  "Edit schedule": "Modifier le planning",
  "Save schedule": "Enregistrer le planning",
  "Weekdays": "Jours de la semaine",
  "Cancel": "Annuler",
  "Sending schedule …": "Envoi du planning …",
  "Times use the Home Assistant time zone: {zone}.": "Les heures utilisent le fuseau horaire de Home Assistant : {zone}.",
  "Schedules are unavailable. Check the robot connection and integration.": "Les plannings sont indisponibles. Vérifiez la connexion du robot et l'intégration.",
  "This schedule is no longer available. Refresh the schedule list.": "Ce planning n'est plus disponible. Actualisez la liste des plannings.",
  "Choose at least one weekday and a valid time.": "Choisissez au moins un jour et une heure valide.",
  "Invalid schedule state.": "État du planning invalide.",
  "The room plan changed. Close the dialog and review your room settings.": "Le plan des pièces a changé. Fermez la fenêtre et vérifiez les réglages des pièces.",
  "Schedule request sent. The list updates when Home Assistant reports the change.": "Demande de planning envoyée. La liste sera actualisée lorsque Home Assistant signalera le changement.",
  "Schedule request failed. Check the schedule in MyDyson before trying again. {error}": "La demande de planning a échoué. Vérifiez le planning dans MyDyson avant de réessayer. {error}",
  "Enable schedule {time} ({days})": "Activer le planning {time} ({days})",
  "Edit schedule {time} ({days})": "Modifier le planning {time} ({days})",
  "The schedule list may be incomplete. Turn each schedule off and on in MyDyson while the integration is connected.": "La liste des plannings peut être incomplète. Désactivez puis réactivez chaque planning dans MyDyson pendant que l'intégration est connectée.",
  "No known schedules. Create one from the room planner, or turn existing schedules off and on in MyDyson.": "Aucun planning connu. Créez-en un depuis le planificateur des pièces, ou désactivez puis réactivez les plannings existants dans MyDyson.",
  "Map entity must use the {domain} domain for this integration.": "L’entité du plan doit utiliser le domaine {domain} pour cette intégration.",
  "Map image": "Image du plan",
  "hass-dyson (experimental)": "hass-dyson (expérimental)",
  "Invalid integration selection.": "Sélection d’intégration non valide.",
  "The room map is unavailable or ambiguous. Refresh rooms and check the integration.": "Le plan des pièces est indisponible ou ambigu. Actualisez les pièces et vérifiez l’intégration.",
  "Settings were saved, but cleaning did not start. Review the robot status before retrying. {error}": "Les réglages ont été enregistrés, mais le nettoyage n’a pas démarré. Vérifiez l’état du robot avant de réessayer. {error}",
  "Room order is controlled by hass-dyson. Changed settings are saved before cleaning starts.": "hass-dyson détermine l’ordre des pièces. Les réglages modifiés sont enregistrés avant le démarrage.",
  "Integration": "Intégration",
  "Invalid header icon style.": "Style d’icône d’en-tête non valide.",
  "Header icon style": "Style d’icône d’en-tête",
  "Invalid zone dimension unit.": "Unité des dimensions de zone non valide.",
  "Off": "Désactivé",
  "Inches": "Pouces",
  "Centimeters": "Centimètres",
  "Dimension display": "Affichage des dimensions",
  "Voice prompts": "Annonces vocales",
  "Volume": "Volume",
  "Child lock": "Sécurité enfant",
  "Do not disturb": "Ne pas déranger",
  "Start time": "Heure de début",
  "End time": "Heure de fin",
  "This robot setting is unavailable.": "Ce réglage du robot est indisponible.",
  "Invalid robot setting.": "Réglage du robot non valide.",
  "Mop pad": "Patin de lavage",
  "Cleaning selection": "Sélection du nettoyage",
  "Rooms": "Pièces",
  "Close": "Fermer",
  "One pass": "Un passage",
  "Drag the zone or resize its lower-right corner.": "Déplacez la zone ou redimensionnez-la par son coin inférieur droit.",
  "Settings are sent only when you start the zone clean.": "Les réglages sont envoyés uniquement au démarrage du nettoyage de la zone.",
  "Two passes are not yet available.": "Deux passages ne sont pas encore disponibles.",
  "Not yet available": "Pas encore disponible",
  "Other cleaning modes are not yet available.": "Les autres modes de nettoyage ne sont pas encore disponibles.",
  "Plan a clean": "Planifier un nettoyage",
  "Cleaning session": "Nettoyage en cours",
  "Cleaning session preview": "Aperçu du nettoyage",
  "Info": "Info",
  "Settings": "Réglages",
  "Station": "Station",
  "Robot": "Robot",
  "Station settings": "Réglages de la station",
  "Consumables": "Consommables",
  "Supplies": "Conso.",
  "Robot information": "Informations du robot",
  "Close information": "Fermer les informations",
  "Consumables: replacement needed soon": "Consommables : remplacement bientôt nécessaire",
  "Cleaning mode": "Mode de nettoyage",
  "Vacuum Power": "Puissance d’aspiration",
  "Water level": "Niveau d’eau",
  "Clean repetitions": "Passages",
  "Vacuum": "Aspiration",
  "Mop": "Lavage",
  "Vacuum and Mop": "Aspiration et lavage",
  "Vacuum then Mop": "Aspiration puis lavage",
  "Auto": "Auto",
  "Boost": "Boost",
  "Quiet": "Silencieux",
  "Quick": "Rapide",
  "Very Low": "Très faible",
  "Low": "Faible",
  "Medium": "Moyen",
  "High": "Élevé",
  "One Pass": "Un passage",
  "Two Passes": "Deux passages",
  "Hot water mopping": "Lavage à l’eau chaude",
  "Hot water self-cleaning": "Autonettoyage à l’eau chaude",
  "Extended roller preparation": "Préparation prolongée du rouleau",
  "Cleaning solution": "Solution nettoyante",
  "Self-cleaning frequency": "Fréquence d’autonettoyage",
  "Roller drying duration": "Durée de séchage du rouleau",
  "After each room": "Après chaque pièce",
  "Every 15 minutes": "Toutes les 15 minutes",
  "Every 30 minutes": "Toutes les 30 minutes",
  "Only as needed": "Selon les besoins",
  "2 hours": "2 heures",
  "3 hours": "3 heures",
  "4 hours": "4 heures",
  "5 hours": "5 heures",
  "Empty dust bin": "Vider le collecteur",
  "Wash mop roller": "Laver le rouleau",
  "Dry mop roller": "Sécher le rouleau",
  "Press": "Appuyer",
  "on": "activé",
  "off": "désactivé",
  "Brush bar": "Brosse rotative",
  "Mop roller": "Rouleau de lavage",
  "Side brushes": "Brosses latérales",
  "Robot filter": "Filtre du robot",
  "Dock filter": "Filtre de la station",
  "Ready to use": "Prête à l’emploi",
  "Refill required": "Remplissage nécessaire",
  "Enabled": "Activée",
  "Disabled": "Désactivée",
  "Status unavailable": "État indisponible",
  "Show robot error": "Afficher l’erreur du robot",
  "Dismiss error message": "Masquer le message d’erreur",
  "Docked": "À la station",
  "Idle": "Au repos",
  "Unavailable": "Indisponible",
  "Not available": "Non disponible",
  "{percent}% remaining": "{percent} % restants",
  "{name} remaining life": "Durée de vie restante : {name}",
  "Save settings": "Enregistrer",
  "Start clean": "Démarrer",
  "Saving …": "Enregistrement …",
  "Discard draft": "Abandonner les modifications",
  "Local draft": "Brouillon local",
  "From Home Assistant": "Depuis Home Assistant",
  "{selected} of {total} rooms selected": "{selected} pièces sélectionnées sur {total}",
  "Select {name}": "Sélectionner {name}",
  "Settings for {name}": "Réglages de {name}",
  "Room settings unavailable": "Réglages de la pièce indisponibles",
  "Room ID unavailable": "Identifiant de pièce indisponible",
  "Room ID unavailable. Check the updated integration and refresh rooms.": "Identifiant de pièce indisponible. Vérifiez la mise à jour de l’intégration et actualisez les pièces.",
  "No enabled rooms found. Check the card configuration and room discovery.": "Aucune pièce activée trouvée. Vérifiez la configuration de la carte et la détection des pièces.",
  "The updated Dyson integration actions are not available. Reload the integration and refresh this dashboard.": "Les nouvelles actions de l’intégration Dyson sont indisponibles. Rechargez l’intégration et actualisez ce tableau de bord.",
  "Settings changed outside this card. Your edited values remain in the local draft.": "Des réglages ont été modifiés en dehors de cette carte. Vos modifications restent dans le brouillon local.",
  "Pause": "Pause",
  "Resume": "Reprendre",
  "Home": "Station",
  "Cleaning map": "Carte du nettoyage",
  "Refreshes about every 5 seconds": "Actualisation toutes les 5 secondes environ",
  "Drying time remaining": "Temps de séchage restant",
  "Cancel drying": "Arrêter le séchage",
  "Remaining time: unavailable": "Temps restant : indisponible",
  "Remaining time: {time} (hh:mm)": "Temps restant : {time} (hh:mm)",
  "Drying cancellation requires a connected robot and the integration cancel_drying action.": "L’arrêt du séchage nécessite un robot connecté et l’action cancel_drying de l’intégration.",
  "This action is not available in the current robot state.": "Cette action est indisponible dans l’état actuel du robot.",
  "Robot unavailable": "Robot indisponible",
  "Robot needs attention": "Le robot nécessite votre attention",
  "Paused": "En pause",
  "Cleaning mop roller": "Lavage du rouleau",
  "Drying mop roller": "Séchage du rouleau",
  "Emptying dust bin": "Vidage du collecteur",
  "Vacuuming": "Aspiration en cours",
  "Mopping": "Lavage en cours",
  "Vacuuming and mopping": "Aspiration et lavage en cours",
  "Cleaning": "Nettoyage en cours",
  "Returning / mapping": "Retour / cartographie",
  "Robot disconnected": "Robot déconnecté",
  "Mapping / navigation in progress": "Cartographie / navigation en cours",
  "Returning to dock / finishing cleanup": "Retour à la station / fin du nettoyage",
  "A cleaning job is still active": "Un nettoyage est toujours en cours",
  "Waiting for the robot to be ready": "En attente que le robot soit prêt",
  "The integration is not ready to start a new clean": "L’intégration n’est pas prête à démarrer un nouveau nettoyage",
  "Wait for the dock cycle to finish before starting a clean": "Attendez la fin du cycle de la station avant de démarrer un nettoyage",
  "Waiting for a connection to the robot.": "En attente de connexion au robot.",
  "Cleaning session active": "Nettoyage en cours",
  "Cleaning session paused": "Nettoyage en pause",
  "Robot returning": "Retour du robot",
  "The integration is reporting a return or mapping operation.": "L’intégration signale un retour ou une cartographie en cours.",
  "Check the robot or the Dyson app for details.": "Consultez le robot ou l’application Dyson pour plus de détails.",
  "Starting clean": "Démarrage du nettoyage",
  "Waiting for the robot to report its status.": "En attente de l’état du robot.",
  "Waiting for robot status": "En attente de l’état du robot",
  "The robot is not reporting a ready state.": "Le robot ne signale pas qu’il est prêt.",
  "Battery and charging": "Batterie et charge",
  "Battery level unavailable": "Niveau de batterie indisponible",
  "Battery: {percent}%": "Batterie : {percent} %",
  "Charging": "En charge",
  "Not charging": "Pas en charge",
  "Charging status unavailable": "État de charge indisponible",
  "{battery}. {charging}.": "{battery}. {charging}.",
  "Live cleaning map": "Carte du nettoyage en direct",
  "Loading cleaning map …": "Chargement de la carte …",
  "Waiting for an active robot status.": "En attente d’un état actif du robot.",
  "Camera unavailable.": "Caméra indisponible.",
  "No map camera found. Select one in the card editor.": "Aucune caméra de carte trouvée. Sélectionnez-en une dans l’éditeur de la carte.",
  "The camera image is not available yet.": "L’image de la caméra n’est pas encore disponible.",
  "Map update unavailable.": "Actualisation de la carte indisponible.",
  "{message} Showing the last received image.": "{message} Affichage de la dernière image reçue.",
  "Language": "Langue",
  "Automatic": "Automatique",
  "Dyson device": "Appareil Dyson",
  "Select a device": "Sélectionner un appareil",
  "Title": "Titre",
  "Theme": "Thème",
  "Classic": "Classique",
  "Modern": "Moderne",
  "Unsupported settings": "Réglages non pris en charge",
  "Show disabled": "Afficher en grisé",
  "Hide": "Masquer",
  "Always show all settings": "Toujours afficher tous les réglages",
  "Per-room settings are detected automatically. Saving and starting use the Dyson integration batch actions.": "Les réglages par pièce sont détectés automatiquement. L’enregistrement et le démarrage utilisent les actions groupées de l’intégration Dyson.",
  "Status bar": "Barre d’état",
  "Show status bar": "Afficher la barre d’état",
  "Visible status indicators": "Indicateurs d’état visibles",
  "Show battery percentage": "Afficher le pourcentage de batterie",
  "Show camera during a cleaning session": "Afficher la caméra pendant le nettoyage",
  "Turning this off removes the map and stops image requests from this card.": "Désactiver cette option masque la carte et arrête les demandes d’images de cette carte de tableau de bord.",
  "Map camera": "Caméra de la carte",
  "Auto-detect": "Détection automatique",
  "Map rotation": "Rotation de la carte",
  "Rooms in this card": "Pièces affichées",
  "Choose which rooms to show. Arrows change the display order, not the robot cleaning order.": "Choisissez les pièces à afficher. Les flèches modifient l’ordre d’affichage, pas l’ordre de nettoyage du robot.",
  "Move {name} up": "Monter {name}",
  "Move {name} down": "Descendre {name}",
  "Refresh rooms": "Actualiser les pièces",
  "Rooms disabled in Home Assistant are not offered. New rooms appear automatically.": "Les pièces désactivées dans Home Assistant ne sont pas proposées. Les nouvelles pièces apparaissent automatiquement.",
  "Could not read the entity registry. Check the connection and user permissions.": "Impossible de lire le registre des entités. Vérifiez la connexion et les autorisations de l’utilisateur.",
  "The Dyson device was not found in the entity registry.": "L’appareil Dyson est introuvable dans le registre des entités.",
  "The Dyson room list is not currently available.": "La liste des pièces Dyson est actuellement indisponible.",
  "Room switch mapping is ambiguous": "L’association des interrupteurs de pièce est ambiguë",
  "Multiple rooms map to the same switch.": "Plusieurs pièces sont associées au même interrupteur.",
  "Select a vacuum entity.": "Sélectionnez une entité d’aspirateur.",
  "theme must be classic or modern.": "theme doit être classic ou modern.",
  "language must be auto, en, de, nl or fr.": "language doit être auto, en, de, nl ou fr.",
  "unsupported_settings must be disabled or hidden.": "unsupported_settings doit être disabled ou hidden.",
  "{key} must be a list of entity IDs.": "{key} doit être une liste d’identifiants d’entités.",
  "room_entities must map room names to switch entities.": "room_entities doit associer les noms des pièces à des entités d’interrupteur.",
  "show_battery_percentage must be true or false.": "show_battery_percentage doit être true ou false.",
  "show_status_bar must be true or false.": "show_status_bar doit être true ou false.",
  "hidden_status_items must be a list of indicator keys.": "hidden_status_items doit être une liste de clés d’indicateurs.",
  "show_camera must be true or false.": "show_camera doit être true ou false.",
  "always_show_all_settings must be true or false.": "always_show_all_settings doit être true ou false.",
  "camera_rotation must be 0, 90, 180 or 270.": "camera_rotation doit être 0, 90, 180 ou 270.",
  "Select a camera entity.": "Sélectionnez une entité de caméra.",
  "Home Assistant is not connected.": "Home Assistant n’est pas connecté.",
  "Update the Dyson integration: {action} is unavailable.": "Mettez à jour l’intégration Dyson : {action} est indisponible.",
  "The robot is unavailable.": "Le robot est indisponible.",
  "Start is only available when the Dyson is ready (docked or idle).": "Le démarrage est possible uniquement lorsque le Dyson est prêt (à la station ou au repos).",
  "A room in your draft is unavailable or ambiguous. Review or discard the draft.": "Une pièce de votre brouillon est indisponible ou ambiguë. Vérifiez ou abandonnez le brouillon.",
  "{setting} is no longer available for {room}.": "{setting} n’est plus disponible pour {room}.",
  "A selected room has no stable room ID. Refresh rooms and check the integration.": "Une pièce sélectionnée n’a pas d’identifiant stable. Actualisez les pièces et vérifiez l’intégration.",
  "Select at least one room without duplicates.": "Sélectionnez au moins une pièce, sans doublons.",
  "An action for this Dyson is already running in this browser.": "Une action pour ce Dyson est déjà en cours dans ce navigateur.",
  "This action is not available for the current robot state.": "Cette action est indisponible dans l’état actuel du robot.",
  "This station action is unavailable.": "Cette action de la station est indisponible.",
  "This station setting is unavailable.": "Ce réglage de la station est indisponible.",
  "Invalid station switch value.": "Valeur d’interrupteur de station non valide.",
  "Invalid station option.": "Option de station non valide.",
  "Sending room settings and start request …": "Envoi des réglages des pièces et de la demande de démarrage …",
  "The start was sent, but the robot has not reported an active session. Check its status before trying again.": "La demande de démarrage a été envoyée, mais le robot n’a pas signalé de nettoyage actif. Vérifiez son état avant de réessayer.",
  "{error} No automatic retry will be made.": "{error} Aucune nouvelle tentative automatique ne sera effectuée.",
  "Saving room settings …": "Enregistrement des réglages des pièces …",
  "Save was sent, but Home Assistant has not reflected all values yet. The draft was kept; check the robot before retrying.": "La demande d’enregistrement a été envoyée, mais Home Assistant n’a pas encore actualisé toutes les valeurs. Le brouillon est conservé ; vérifiez le robot avant de réessayer.",
  "Settings sent. Home Assistant values updated. Room selection remains local.": "Réglages envoyés. Valeurs Home Assistant actualisées. La sélection des pièces reste locale.",
  "Zone": "Zone",
  "Zone cleaning": "Nettoyage ciblé",
  "Zone selection": "Sélection de zone",
  "Vacuum · Auto · One pass. Drag the zone or resize its lower-right corner.": "Aspiration · Auto · Un passage. Déplacez la zone ou redimensionnez-la par son coin inférieur droit.",
  "Reload map": "Actualiser la carte",
  "Back to rooms": "Retour aux pièces",
  "Move zone. Use the arrow keys.": "Déplacer la zone. Utilisez les touches fléchées.",
  "Resize zone. Use the arrow keys.": "Redimensionner la zone. Utilisez les touches fléchées.",
  "The active map changed. Reload the map and select a new zone.": "La carte active a changé. Actualisez la carte et sélectionnez une nouvelle zone.",
  "Loading calibrated map …": "Chargement de la carte calibrée …",
  "Camera must belong to the selected robot.": "La caméra doit appartenir au robot sélectionné.",
  "Camera image unavailable.": "Image de la caméra indisponible.",
  "A calibrated PNG image is required.": "Une image PNG calibrée est requise.",
  "Image and calibration do not match. Reload the map.": "L’image et la calibration ne correspondent pas. Actualisez la carte.",
  "Map loading timed out. Reload the map.": "Le chargement de la carte a expiré. Actualisez la carte.",
  "A calibrated map is required. Reload the map.": "Une carte calibrée est requise. Actualisez la carte.",
  "Zone start unavailable: check robot readiness, map and integration action.": "Démarrage de zone indisponible : vérifiez la disponibilité du robot, la carte et l’action de l’intégration.",
  "Map frozen for selection. Room settings remain unchanged.": "Image figée pour la sélection. Les réglages des pièces restent inchangés.",
  "Sending zone start …": "Envoi de la demande de nettoyage ciblé …",
  "Zone start failed. Check the robot before retrying.": "Échec du démarrage de zone. Vérifiez le robot avant de réessayer.",
  "Mop repetitions": "Passages de lavage"
};


const LANGUAGES = { en, de, nl, fr };
function resolveLanguage(config = {}, hass) {
  config ??= {};
  const requested = config.language && config.language !== 'auto' ? config.language : hass?.locale?.language ?? hass?.language ?? 'en';
  const base = String(requested).toLowerCase().split(/[-_]/)[0];
  return Object.hasOwn(LANGUAGES, base) ? base : 'en';
}
// Structured messages preserve parameters until rendering, including a language change.
function uiMessage(key, params = {}) { return { key, params }; }
class UiError extends Error {
  constructor(key, params = {}) { super(translate('en', key, params)); this.key = key; this.params = params; }
}
function translate(language, key, params = {}) {
  if (key instanceof UiError || (key && typeof key === 'object' && typeof key.key === 'string')) {
    return translate(language, key.key, key.params);
  }
  // Integration/backend errors are external prose, not translation keys.
  if (key instanceof Error) return key.message;
  if (key == null) return '';
  const dictionary = LANGUAGES[language] ?? en;
  const text = Object.hasOwn(dictionary, key) ? dictionary[key] : Object.hasOwn(en, key) ? en[key] : String(key);
  return text.replace(/\{(\w+)\}/g, (match, name) => Object.hasOwn(params, name) ? String(params[name] instanceof Error || typeof params[name] === 'object' ? translate(language, params[name]) : params[name]) : match);
}


const ROOM_FIELDS = { cleaning_mode: 'Cleaning mode', cleaning_strategy: 'Vacuum Power', water_level: 'Water level', mop_repetitions: 'Clean repetitions' };
const ROOM_COLORS = ['#18c5d9', '#e9b85b', '#b99ae4', '#79b9a5', '#e49baf'];
// Preserve existing entity-based Dyson configuration while allowing opaque
// selection keys for rooms which have no HA entity of their own.
const roomKey = room => room.key ?? room.entity ?? '';
const available = state => !!state && !['unavailable', 'unknown'].includes(state.state) && !state.attributes?.restored;

function switchSettingConfirmed(hass, registry, field, request) {
  const entry = registry.find(row => row.entity_id === request.entity);
  return hass?.connected !== false && field?.domain === 'switch' && field.supported && field.entity === request.entity
    && !!entry && !entry.disabled_by && !!request.uniqueId && !!request.deviceId
    && entry.unique_id === request.uniqueId && entry.device_id === request.deviceId && entry.platform === request.platform
    && available(hass?.states?.[request.entity]) && hass.states[request.entity].state === request.value;
}
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const STATUS_BAR_ITEMS = [
  ['hot_water_mopping', 'Hot water mopping'],
  ['hot_water_self_cleaning', 'Hot water self-cleaning'],
  ['extended_roller_preparation', 'Extended roller preparation'],
  ['cleaning_solution', 'Cleaning solution'],
  ['self_cleaning_frequency', 'Self-cleaning frequency'],
  ['roller_drying_duration', 'Roller drying duration'],
  ['battery', 'Battery and charging'],
];

function normalizeConfig(config) {
  if (!config || typeof config.entity !== 'string' || !config.entity.startsWith('vacuum.')) throw new UiError('Select a vacuum entity.');
  if (config.integration !== undefined && !['auto', 'dyson_spot_scrub', 'hass_dyson', 'ha_rooms'].includes(config.integration)) throw new UiError('Invalid integration selection.');
  if (config.language !== undefined && !['auto', 'en', 'de', 'nl', 'fr'].includes(config.language)) throw new UiError('language must be auto, en, de, nl or fr.');
  if (config.theme !== undefined && !['classic', 'modern'].includes(config.theme)) throw new UiError('theme must be classic or modern.');
  if (config.unsupported_settings && !['disabled', 'hidden'].includes(config.unsupported_settings)) throw new UiError('unsupported_settings must be disabled or hidden.');
  for (const key of ['excluded_rooms', 'room_order']) {
    if (config[key] !== undefined && (!Array.isArray(config[key]) || config[key].some(x => typeof x !== 'string'))) throw new UiError('{key} must be a list of entity IDs.', { key });
  }
  if (config.room_entities !== undefined && (!config.room_entities || typeof config.room_entities !== 'object' || Array.isArray(config.room_entities) || Object.values(config.room_entities).some(x => typeof x !== 'string' || !x.startsWith('switch.')))) throw new UiError('room_entities must map room names to switch entities.');
  if (config.show_battery_percentage !== undefined && typeof config.show_battery_percentage !== 'boolean') throw new UiError('show_battery_percentage must be true or false.');
  if (config.show_status_bar !== undefined && typeof config.show_status_bar !== 'boolean') throw new UiError('show_status_bar must be true or false.');
  if (config.hidden_status_items !== undefined && (!Array.isArray(config.hidden_status_items) || config.hidden_status_items.some(item => typeof item !== 'string'))) throw new UiError('hidden_status_items must be a list of indicator keys.');
  if (config.show_camera !== undefined && typeof config.show_camera !== 'boolean') throw new UiError('show_camera must be true or false.');
  if (config.always_show_all_settings !== undefined && typeof config.always_show_all_settings !== 'boolean') throw new UiError('always_show_all_settings must be true or false.');
  if (config.camera_rotation !== undefined && ![0, 90, 180, 270].includes(config.camera_rotation)) throw new UiError('camera_rotation must be 0, 90, 180 or 270.');
  if (config.camera_entity && (typeof config.camera_entity !== 'string' || !/^(camera|image)\./.test(config.camera_entity))) throw new UiError('Select a camera entity.');
  const mapDomain = { dyson_spot_scrub:'camera', hass_dyson:'image' }[config.integration];
  if (config.camera_entity && mapDomain && !config.camera_entity.startsWith(`${mapDomain}.`)) throw new UiError('Map entity must use the {domain} domain for this integration.', { domain:mapDomain });
  if (config.zone_dimension_unit !== undefined && !['off','auto','cm','inch'].includes(config.zone_dimension_unit)) throw new UiError('Invalid zone dimension unit.');
  if (config.header_icon_style !== undefined && !['home_assistant','integration'].includes(config.header_icon_style)) throw new UiError('Invalid header icon style.');
  return { ...config, header_icon_style: config.header_icon_style ?? 'integration', zone_dimension_unit: config.zone_dimension_unit ?? 'auto', language: config.language ?? 'auto', theme: config.theme ?? 'modern', show_battery_percentage: config.show_battery_percentage ?? false, show_status_bar: config.show_status_bar ?? true, hidden_status_items: config.hidden_status_items ?? [], title: config.title ?? '', always_show_all_settings: config.always_show_all_settings ?? false, unsupported_settings: 'hidden', excluded_rooms: config.excluded_rooms ?? [], room_order: config.room_order ?? [], show_camera: config.show_camera ?? true, camera_rotation: config.camera_rotation ?? 0 };
}

function fitMap(width, height, boxWidth, rotation) {
  if (![width, height, boxWidth].every(n => Number.isFinite(n) && n > 0)) return { width: 0, height: 0, frameHeight: 0 };
  const sideways = rotation === 90 || rotation === 270;
  const scale = boxWidth / (sideways ? height : width);
  return { width: width * scale, height: height * scale, frameHeight: (sideways ? width : height) * scale };
}


// Geometry is expressed in the displayed, rotated image's normalised coordinates.
function validZoneCalibration(c) {
  return c?.version === 1 && c.units === 'm' && /^\d+$/.test(String(c.map_id)) && Number(c.map_id) > 0
    && ['image_width', 'image_height', 'pixels_per_metre'].every(k => Number.isFinite(c[k]) && c[k] > 0)
    && ['padding', 'min_x', 'max_y'].every(k => Number.isFinite(c[k])) && c.padding >= 0
    && /^[a-f0-9]{64}$/.test(c.image_sha256);
}

function zoneRobotRectangle(rect, calibration, rotation = 0) {
  if (!validZoneCalibration(calibration) || ![0, 90, 180, 270].includes(rotation)
      || !Array.isArray(rect) || rect.length !== 4 || rect.some(v => !Number.isFinite(v) || v < 0 || v > 1)
      || rect[0] >= rect[2] || rect[1] >= rect[3]) throw new Error('Invalid zone geometry');
  const points = [[rect[0], rect[1]], [rect[2], rect[1]], [rect[2], rect[3]], [rect[0], rect[3]]].map(([u, v]) => {
    const [x, y] = rotation === 90 ? [v, 1-u] : rotation === 180 ? [1-u, 1-v] : rotation === 270 ? [1-v, u] : [u, v];
    return [calibration.min_x + (x * calibration.image_width - calibration.padding) / calibration.pixels_per_metre,
      calibration.max_y - (y * calibration.image_height - calibration.padding) / calibration.pixels_per_metre];
  });
  return [Math.min(...points.map(p => p[0])), Math.min(...points.map(p => p[1])),
    Math.max(...points.map(p => p[0])), Math.max(...points.map(p => p[1]))];
}

// SHA-256 fallback for HA served over plain HTTP, where crypto.subtle is absent.
// The hash binds a camera snapshot to its calibration; it is not authentication.
function zoneSha256(bytes) {
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  const primes = [];
  for (let n = 2; primes.length < 64; n++) if (!primes.some(p => n % p === 0)) primes.push(n);
  const h = primes.slice(0, 8).map(p => (Math.sqrt(p) % 1 * 2 ** 32) >>> 0);
  const k = primes.map(p => (Math.cbrt(p) % 1 * 2 ** 32) >>> 0);
  const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
  padded.set(bytes); padded[bytes.length] = 128;
  const data = new DataView(padded.buffer), bits = bytes.length * 8;
  data.setUint32(padded.length - 8, Math.floor(bits / 2 ** 32)); data.setUint32(padded.length - 4, bits >>> 0);
  const w = new Uint32Array(64);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i++) w[i] = data.getUint32(offset + i * 4);
    for (let i = 16; i < 64; i++) {
      const a = w[i-15], b = w[i-2];
      w[i] = w[i-16] + (rotr(a,7)^rotr(a,18)^(a>>>3)) + w[i-7] + (rotr(b,17)^rotr(b,19)^(b>>>10));
    }
    let [a,b,c,d,e,f,g,j] = h;
    for (let i = 0; i < 64; i++) {
      const t1 = (j + (rotr(e,6)^rotr(e,11)^rotr(e,25)) + ((e&f)^(~e&g)) + k[i] + w[i]) | 0;
      const t2 = ((rotr(a,2)^rotr(a,13)^rotr(a,22)) + ((a&b)^(a&c)^(b&c))) | 0;
      j=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
    }
    [a,b,c,d,e,f,g,j].forEach((v,i) => { h[i]=(h[i]+v)>>>0; });
  }
  return h.map(v => v.toString(16).padStart(8,'0')).join('');
}


// Trial UI minimum, not a confirmed firmware limit. Each side must meet it.
function zoneMinimumSize(c, rotation = 0) {
  const rotated = rotation === 90 || rotation === 270;
  return [.55 * c.pixels_per_metre / (rotated ? c.image_height : c.image_width),
    .55 * c.pixels_per_metre / (rotated ? c.image_width : c.image_height)];
}
function zoneHasMinimumSize(rect, c, rotation = 0) {
  if (!rect || !validZoneCalibration(c)) return false;
  const [w,h] = zoneMinimumSize(c, rotation);
  return rect[2]-rect[0]+1e-10 >= w && rect[3]-rect[1]+1e-10 >= h;
}
function fitZoneMinimum(rect, c, rotation = 0) {
  const [mw,mh] = zoneMinimumSize(c, rotation);
  const w=Math.min(1,Math.max(mw,rect[2]-rect[0])), h=Math.min(1,Math.max(mh,rect[3]-rect[1]));
  const x=Math.max(0,Math.min(rect[0],1-w)), y=Math.max(0,Math.min(rect[1],1-h));
  return [x,y,x+w,y+h];
}

// Display-space helpers keep movement separate from resizing.
function adjustZone(rect, dx, dy, resize, minimum) {
  const [x,y,x2,y2]=rect, [mw,mh]=minimum;
  if (resize) return [x,y,Math.min(1,Math.max(x+mw,x2+dx)),Math.min(1,Math.max(y+mh,y2+dy))];
  const w=x2-x,h=y2-y,nx=Math.max(0,Math.min(1-w,x+dx)),ny=Math.max(0,Math.min(1-h,y+dy));
  return [nx,ny,nx+w,ny+h];
}
function zonePillPosition(rect, width, height, pillWidth, pillHeight, gap=6, horizontalOverflow=14) {
  const [x,y,x2]=rect;
  // Use the map frame's free margin, keeping six screen pixels to the card
  // edge. The pill stays above the zone using the existing space above the map.
  const left=Math.max(-horizontalOverflow,Math.min(width+horizontalOverflow-pillWidth,(x+x2)*width/2-pillWidth/2));
  return [left,y*height-pillHeight-gap];
}

// Presentation only: robot geometry and minimum sizes remain metric.
function zoneDimensionText(widthCm, heightCm, lengthUnit) {
  const imperial = ['mi', 'ft', 'in', 'yd'].includes(lengthUnit);
  const divisor = imperial ? 2.54 : 1;
  return `${Math.round(widthCm/divisor)} \u00d7 ${Math.round(heightCm/divisor)} ${imperial ? 'in' : 'cm'}`;
}


// Shared Dyson presentation policy. Native modes and field identities belong
// here; the card only renders the resulting descriptors.
function dysonRoomPresentation(room, draft = {}, config = {}) {
  const mode = draft.cleaning_mode ?? room.settings?.cleaning_mode?.value;
  return {
    summary: mode ?? 'Room settings unavailable',
    issue: room.roomId ? null : 'Room ID unavailable. Check the updated integration and refresh rooms.',
    fields: Object.entries(ROOM_FIELDS).filter(([key]) => room.settings?.[key]).map(([key, label]) => ({
      key, label, wide: key === 'cleaning_mode',
      control: key === 'cleaning_mode' ? 'select' : key === 'mop_repetitions' ? 'segments' : 'slider',
      optionLabels: key === 'mop_repetitions' ? { 'One Pass':'1×', 'Two Passes':'2×' } : {},
      omitted: !config.always_show_all_settings &&
        ((mode === 'Vacuum' && key === 'water_level') || (mode === 'Mop' && key === 'cleaning_strategy')),
    })),
  };
}


// Keep backend identities, telemetry and action policy inside this adapter.
// The local scope also isolates implementation names in the dependency-free bundle.
const spotScrubAdapter = (() => {
const DOMAIN = 'dyson_spot_scrub';
// A missing map ID remains compatible with integrations that do not expose it.
const roomContext = (hass, entity) => JSON.stringify([entity, hass?.states?.[entity]?.attributes?.map_id == null ? null : String(hass.states[entity].attributes.map_id)]);

// Entity IDs are user-editable. Match registry identity within ONE integration device.
function discover(hass, registry, config, previousRooms = []) {
  const issues = [];
  const context = roomContext(hass, config.entity);
  const vacuum = registry.find(e => e.entity_id === config.entity && e.platform === DOMAIN && !e.disabled_by);
  if (!vacuum?.device_id) return { rooms: [], issues: ['The Dyson device was not found in the entity registry.'] };
  const entries = registry.filter(e => e.device_id === vacuum.device_id && e.platform === DOMAIN && !e.disabled_by);
  const serial = String(vacuum.unique_id ?? '').replace(/_vacuum$/, '');
  const pick = (explicit, suffix, domain) => {
    const candidates = entries.filter(e => e.entity_id.startsWith(`${domain}.`) && (explicit ? e.entity_id === explicit : e.unique_id === `${serial}_${suffix}`));
    return candidates.length === 1 ? candidates[0].entity_id : undefined;
  };
  const cameraEntity = pick(config.camera_entity, 'floor_map', 'camera');
  const batteryEntity = pick(undefined, 'battery', 'sensor');
  const chargingEntity = pick(undefined, 'charging', 'binary_sensor');
  const names = hass.states[config.entity]?.attributes?.rooms;
  if (!Array.isArray(names) || !names.length || names.some(n => typeof n !== 'string')) issues.push('The Dyson room list is not currently available.');
  const rooms = (Array.isArray(names) ? names.filter(n => typeof n === 'string') : []).flatMap(name => {
    const explicit = config.room_entities?.[name];
    const uid = `${serial}_room_${name.toLowerCase().replaceAll(' ', '_')}`;
    const allMatches = registry.filter(e => e.device_id === vacuum.device_id && e.platform === DOMAIN && e.entity_id.startsWith('switch.') && (explicit ? e.entity_id === explicit : e.unique_id === uid));
    if (allMatches.length === 1 && allMatches[0].disabled_by) return [];
    const matches = allMatches.filter(e => !e.disabled_by);
    if (matches.length !== 1) return [{ name, entity: '', available: false, error: 'Room switch mapping is ambiguous' }];
    const entry = matches[0];
    const settings = {};
    const roomIds = new Set();
    for (const key of Object.keys(ROOM_FIELDS)) {
      const candidates = entries.filter(e => e.entity_id.startsWith('select.') && e.unique_id === `${entry.unique_id}_${key}`);
      if (candidates.length !== 1) continue;
      const entity = candidates[0].entity_id, state = hass.states[entity];
      const previous = previousRooms.find(r => r.entity === entry.entity_id && r.context === context);
      const prior = previous?.settings?.[key]?.entity === entity ? previous.settings[key] : undefined;
      const nativeId = state?.attributes?.room_id ?? (!available(state) ? previous?.roomId : undefined);
      const options = state?.attributes?.options;
      if (nativeId !== undefined && nativeId !== null && String(nativeId) !== '') roomIds.add(String(nativeId));
      // Presence in the registry defines support; connectivity defines usability.
      settings[key] = { entity, value: state?.state,
        options: Array.isArray(options) ? options.filter(o => typeof o === 'string') : (!available(state) ? prior?.options ?? [] : []),
        available: hass.connected !== false && available(state) };
    }
    const roomId = roomIds.size === 1 ? [...roomIds][0] : undefined;
    return [{ name, key:entry.entity_id, entity: entry.entity_id, context, roomId, settings, available: available(hass.states[entry.entity_id]), excluded: config.excluded_rooms.includes(entry.entity_id) }];
  });
  const ids = rooms.map(r => r.entity).filter(Boolean);
  if (new Set(ids).size !== ids.length) issues.push('Multiple rooms map to the same switch.');
  const rank = id => { const i = config.room_order.indexOf(id); return i < 0 ? Number.MAX_SAFE_INTEGER : i; };
  rooms.sort((a, b) => rank(a.entity) - rank(b.entity));
  return { rooms, cameraEntity, batteryEntity, chargingEntity, issues };
}

function batteryStatus(hass, model) {
  const battery = hass?.states?.[model?.batteryEntity];
  const charging = hass?.states?.[model?.chargingEntity];
  const connected = hass?.connected !== false;
  const raw = battery?.state;
  const value = (typeof raw === 'string' && raw.trim() !== '') || typeof raw === 'number' ? Number(raw) : NaN;
  const percent = connected && available(battery) && Number.isFinite(value) && value >= 0 && value <= 100 ? Math.round(value) : null;
  const chargeState = connected && available(charging) && ['on', 'off'].includes(charging.state) ? charging.state : null;
  const level = percent === null ? 'unknown' : percent < 20 ? 'low' : percent < 50 ? 'medium' : 'high';
  const label = `${percent === null ? 'Battery level unavailable' : `Battery: ${percent}%`}. ${chargeState === 'on' ? 'Charging' : chargeState === 'off' ? 'Not charging' : 'Charging status unavailable'}.`;
  return { percent, charging: chargeState === 'on', level, label };
}

// Only the integration converts labels to Dyson protocol values. One HA action
// receives the complete draft; never fan out to select.select_option here.
const draftRequests = new Set();
async function sendRoomDraft({ hass, model, config, selected = [], draft = {}, start = false, context = roomContext(hass, config.entity) }) {
  if (context !== roomContext(hass, config.entity)) throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
  const service = start ? 'start_rooms_with_settings' : 'save_room_settings';
  if (hass?.connected === false) throw new UiError('Home Assistant is not connected.');
  if (!hass.services?.[DOMAIN]?.[service]) throw new UiError('Update the Dyson integration: {action} is unavailable.', { action: `${DOMAIN}.${service}` });
  const vacuum = hass.states[config.entity];
  if (!available(vacuum)) throw new UiError('The robot is unavailable.');
  if (start && !['docked', 'idle'].includes(vacuum.state) && !(vacuum.state === 'error' && vacuum.attributes?.ready_to_start === true)) throw new UiError('Start is only available when the Dyson is ready (docked or idle).');
  if (start && startBlockReason(hass, config.entity)) throw new UiError(startBlockReason(hass, config.entity));
  const byId = new Map();
  for (const room of model.rooms) {
    if (!room.roomId) continue;
    const list = byId.get(room.roomId) ?? [];
    list.push(room); byId.set(room.roomId, list);
  }
  const resolve = id => {
    const rooms = byId.get(id);
    if (rooms?.length !== 1 || !rooms[0].available || rooms[0].excluded) throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
    const room = rooms[0];
    const liveIds = new Set(Object.values(room.settings ?? {}).flatMap(field => {
      const state = hass.states[field.entity];
      const nativeId = state?.attributes?.room_id;
      return available(state) && nativeId != null && String(nativeId) !== '' ? [String(nativeId)] : [];
    }));
    if (room.context !== context || liveIds.size !== 1 || !liveIds.has(String(id)))
      throw new UiError('A selected room has no stable room ID. Refresh rooms and check the integration.');
    return room;
  };
  const settings = {};
  for (const [id, values] of Object.entries(draft)) {
    const room = resolve(id);
    for (const [key, value] of Object.entries(values)) {
      const field = room.settings?.[key];
      if (!field || !available(hass.states[field.entity]) || !field.options.includes(value)) throw new UiError('{setting} is no longer available for {room}.', { setting: { key: ROOM_FIELDS[key] ?? key }, room: room.name });
      if (hass.states[field.entity].state !== value) (settings[id] ??= {})[key] = value;
    }
  }
  const rooms = start ? selected.map(entity => {
    const room = model.rooms.find(r => roomKey(r) === entity);
    if (!room?.roomId) throw new UiError('A selected room has no stable room ID. Refresh rooms and check the integration.');
    return resolve(room.roomId);
  }) : [];
  if (start && (!rooms.length || new Set(rooms.map(r => r.roomId)).size !== rooms.length)) throw new UiError('Select at least one room without duplicates.');
  if (draftRequests.has(config.entity)) throw new UiError('An action for this Dyson is already running in this browser.');
  if (!start && !Object.keys(settings).length) return { rooms: [], settings, sent: false };
  const data = { entity_id: config.entity, room_settings: settings };
  if (start) data.room_ids = rooms.map(r => r.roomId);
  draftRequests.add(config.entity);
  try { await hass.callService(DOMAIN, service, data); }
  finally { draftRequests.delete(config.entity); }
  return { rooms: rooms.map(r => ({ entity_id: r.entity, room_id: r.roomId, name: r.name })), settings, sent: true };
}

const DOCK_PHASES = {
  WASHING_MOP: ['Cleaning mop roller', 'mdi:waves'],
  DRYING_MOP: ['Drying mop roller', 'mdi:weather-windy'],
  COLLECTING_DUST: ['Emptying dust bin', 'mdi:delete-empty-outline']
};

function dockBusy(hass, entity) {
  const state = hass?.states?.[entity];
  return hass?.connected !== false && available(state) && Object.hasOwn(DOCK_PHASES, state.attributes?.dock_state);
}

// A new cleaning request lets the integration cancel roller drying automatically.
function dockBlocksStart(hass, entity) {
  return dockBusy(hass, entity) && hass.states[entity].attributes.dock_state !== 'DRYING_MOP';
}

// Prefer the integration's explicit veto; keep legacy dock checks as fallback.
function startBlockReason(hass, entity) {
  const attrs = hass?.states?.[entity]?.attributes ?? {};
  if (attrs.ready_to_start === false) {
    return {
      disconnected: 'Robot disconnected',
      robot_fault: 'Robot needs attention',
      washing_mop: 'Cleaning mop roller',
      emptying_bin: 'Emptying dust bin',
      mapping_or_navigation: 'Mapping / navigation in progress',
      returning_or_finishing: 'Returning to dock / finishing cleanup',
      cleaning_job_active: 'A cleaning job is still active',
      waiting_for_ready_state: 'Waiting for the robot to be ready'
    }[attrs.start_block_reason] ?? 'The integration is not ready to start a new clean';
  }
  return dockBlocksStart(hass, entity) ? 'Wait for the dock cycle to finish before starting a clean' : null;
}

// Report live telemetry, never the selected mode or the colours of old map paths.
function activityStatus(hass, entity, pendingStart = false) {
  const state = hass?.states?.[entity];
  const view = cleaningView(hass, entity, pendingStart);
  const result = (text, icon = 'mdi:robot-vacuum', drying = false) => ({ text, icon, drying });
  if (!available(state) || hass?.connected === false) return result('Robot unavailable', 'mdi:alert-circle-outline');
  if (state.state === 'error') return result('Robot needs attention', 'mdi:alert-circle-outline');
  if (state.state === 'paused') return result('Paused', 'mdi:pause');
  if (dockBusy(hass, entity)) {
    const phase = state.attributes.dock_state;
    return result(...DOCK_PHASES[phase], phase === 'DRYING_MOP');
  }
  if (state.state === 'cleaning') {
    const modes = { VACUUMING: 'Vacuuming', MOPPING: 'Mopping', VACUUMING_AND_MOPPING: 'Vacuuming and mopping' };
    return result(modes[state.attributes?.full_clean_action] ?? 'Cleaning');
  }
  if (state.state === 'returning') return result('Returning / mapping', 'mdi:home-import-outline');
  const blocked = startBlockReason(hass, entity);
  if (blocked) return result(blocked, 'mdi:timer-sand');
  return view.active ? result(view.title) : null;
}

function cleaningView(hass, entity, pendingStart = false) {
  const state = hass?.states?.[entity];
  if (!available(state) || hass?.connected === false) return { active: true, title: 'Robot unavailable', detail: 'Waiting for a connection to the robot.', live: false };
  const states = {
    cleaning: ['Cleaning session active', ''],
    paused: ['Cleaning session paused', ''],
    returning: ['Robot returning', 'The integration is reporting a return or mapping operation.'],
    error: ['Robot needs attention', 'Check the robot or the Dyson app for details.']
  };
  // A retained fault does not imply an active job when the integration permits a new start.
  // Keep pending starts in the session view until fresh robot telemetry arrives.
  if (state.state === 'error' && state.attributes?.ready_to_start === true) {
    return pendingStart
      ? { active: true, title: 'Starting clean', detail: 'Waiting for the robot to report its status.', live: false }
      : { active: false, live: false };
  }
  if (states[state.state]) return { active: true, title: states[state.state][0], detail: states[state.state][1], live: true };
  if (pendingStart) return { active: true, title: 'Starting clean', detail: 'Waiting for the robot to report its status.', live: false };
  if (['docked', 'idle'].includes(state.state)) return { active: false, live: false };
  return { active: true, title: 'Waiting for robot status', detail: 'The robot is not reporting a ready state.', live: false };
}

// Display the integration's last confirmed sample; do not invent elapsed time.
function dryingTelemetry(hass, entity, registry = []) {
  const state = hass?.states?.[entity];
  if (hass?.connected === false || !available(state) || state.attributes?.dock_state !== 'DRYING_MOP') return null;
  // A registered but disabled, ambiguous or unavailable sensor must not revive stale legacy data.
  const matches = deviceEntities(registry, entity, 'sensor', 'drying_remaining');
  if (matches.length) {
    if (matches.length !== 1 || matches[0].disabled_by) return null;
    const sensor = hass.states[matches[0].entity_id];
    if (!available(sensor) || typeof sensor.state !== 'string' || !sensor.state.trim()) return null;
    return { remaining: Number(sensor.state), total: sensor.attributes?.total_seconds };
  }
  return { remaining: state.attributes.drying_remaining_seconds, total: state.attributes.drying_total_seconds };
}

function dryingRemainingTime(hass, entity, registry = []) {
  const seconds = dryingTelemetry(hass, entity, registry)?.remaining;
  if (!Number.isFinite(seconds) || seconds < 0) return null;
  const minutes = Math.ceil(seconds / 60);
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

// Fraction of the configured drying duration still remaining, from confirmed telemetry.
function dryingRemainingPercent(hass, entity, registry = []) {
  if (dryingRemainingTime(hass, entity, registry) === null) return null;
  const { total, remaining } = dryingTelemetry(hass, entity, registry);
  if (!Number.isFinite(total) || total <= 0 || remaining > total) return null;
  return remaining / total * 100;
}

function canControl(hass, entity, action) {
  const state = hass?.states?.[entity];
  if (action === 'cancel_drying') return !!(hass?.connected !== false && available(state) &&
    state.attributes?.dock_state === 'DRYING_MOP' && hass.services?.[DOMAIN]?.cancel_drying);
  const feature = { pause: 4, start: 8192, return_to_base: 16 }[action];
  const allowedStates = { pause: ['cleaning'], start: ['paused'], return_to_base: ['cleaning', 'paused', 'returning', 'error'] }[action] ?? [];
  return !!(feature && hass?.connected !== false && available(state) &&
    !dockBusy(hass, entity) &&
    allowedStates.includes(state.state) &&
    (Number(state.attributes?.supported_features) & feature) && hass.services?.vacuum?.[action]);
}

async function controlCleaning(hass, entity, action) {
  if (!canControl(hass, entity, action)) throw new UiError('This action is not available for the current robot state.');
  // Queue cancellation belongs to the integration. Do not toggle room switches here.
  await hass.callService(action === 'cancel_drying' ? DOMAIN : 'vacuum', action, { entity_id: entity });
}

const CONSUMABLES = [
  ['brushBar', 'Brush bar'], ['mopRoller', 'Mop roller'], ['mopPad', 'Mop pad'],
  ['sideBrushes', 'Side brushes'], ['robotFilter', 'Robot filter'],
  ['dockFilter', 'Dock filter'], ['cleaningSolution', 'Cleaning solution']
];

function consumableStatus(hass, registry, entity) {
  const vacuum = registry.find(e => e.entity_id === entity && e.platform === DOMAIN && !e.disabled_by);
  const serial = String(vacuum?.unique_id ?? '').replace(/_vacuum$/, '');
  const suffixes = { brushBar:'brush_bar_usage', mopRoller:'mop_roller_usage', mopPad:'mop_pad_usage', sideBrushes:'side_brushes_usage', robotFilter:'robot_filter_usage', dockFilter:'dock_filter_usage', cleaningSolution:'cleaning_solution' };
  return CONSUMABLES.map(([type, name]) => {
    const sensors = vacuum?.device_id ? registry.filter(e => e.platform === DOMAIN && e.device_id === vacuum.device_id && !e.disabled_by && e.entity_id.startsWith('sensor.')) : [];
    const exact = sensors.filter(e => e.unique_id === `${serial}_consumable_${suffixes[type]}`);
    // Identity takes precedence, including when its sensor is temporarily unavailable.
    const candidates = exact.length ? exact : sensors.filter(e => hass?.states?.[e.entity_id]?.attributes?.consumable_type === type);
    const state = candidates.length === 1 ? hass?.states?.[candidates[0].entity_id] : null;
    const live = hass?.connected !== false && available(state);
    if (type === 'cleaningSolution') {
      const value = live && state.attributes?.value_kind === 'refill_status' ? state.state : null;
      return { type, name, supported: candidates.length === 1, remaining: null, level: 'unknown', refillStatus: value, text: value === 'ok' ? 'Ready to use' : value === 'refill_required' ? 'Refill required' : 'Unavailable' };
    }
    const raw = state?.state;
    const usage = typeof raw === 'number' || (typeof raw === 'string' && raw.trim() !== '') ? Number(raw) : NaN;
    const remaining = live && state.attributes?.value_kind === 'usage_percent' && Number.isFinite(usage) && usage >= 0 && usage <= 100 ? Math.round((100 - usage) * 10) / 10 : null;
    return { type, name, supported: candidates.length === 1, remaining, level: remaining === null ? 'unknown' : remaining <= 10 ? 'low' : remaining <= 25 ? 'medium' : 'high', text: remaining === null ? 'Unavailable' : `${remaining}% remaining` };
  });
}


const ROBOT_FIELDS = [
  ['voice_prompts', 'Voice prompts', 'switch'],
  ['volume', 'Volume', 'number', 'voice_prompts'],
  ['child_lock', 'Child lock', 'switch'],
  ['do_not_disturb', 'Do not disturb', 'switch'],
  ['do_not_disturb_start', 'Start time', 'time', 'do_not_disturb'],
  ['do_not_disturb_end', 'End time', 'time', 'do_not_disturb'],
];
function robotSettings(hass, registry, entity) {
  const fields = ROBOT_FIELDS.map(([key, label, domain, parent]) => {
    const matches = deviceEntities(registry, entity, domain, `setting_${key}`).filter(e => !e.disabled_by);
    const id = matches.length === 1 ? matches[0].entity_id : undefined;
    const state = hass?.states?.[id], value = state?.state;
    const valid = domain === 'switch' ? ['on', 'off'].includes(value) : domain === 'number'
      ? value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 100
      : /^([01]\d|2[0-3]):[0-5]\d(:00)?$/.test(value || '');
    const service = domain === 'switch' ? hass?.services?.switch?.turn_on && hass?.services?.switch?.turn_off : hass?.services?.[domain]?.set_value;
    return { key, label, domain, parent, entity:id, supported:!!id, value, available:hass?.connected !== false && available(state) && valid && !!service };
  });
  return fields.map(field => ({ ...field, enabled:!field.parent || fields.some(p => p.key === field.parent && p.available && p.value === 'on') }));
}
async function changeRobotSetting(hass, registry, entity, key, value) {
  const field = robotSettings(hass, registry, entity).find(f => f.key === key);
  if (!field?.available || !field.enabled) throw new UiError('This robot setting is unavailable.');
  if (field.domain === 'switch') {
    if (typeof value !== 'boolean') throw new UiError('Invalid robot setting.');
    return hass.callService('switch', value ? 'turn_on' : 'turn_off', { entity_id:field.entity });
  }
  if (field.domain === 'number') {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 100 || value % 10) throw new UiError('Invalid robot setting.');
    return hass.callService('number', 'set_value', { entity_id:field.entity, value });
  }
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new UiError('Invalid robot setting.');
  return hass.callService('time', 'set_value', { entity_id:field.entity, time:`${value}:00` });
}

const STATION_FIELDS = [
  ['hot_water_mopping', 'Hot water mopping', 'switch'],
  ['cleaning_solution', 'Cleaning solution', 'switch'],
  ['extended_roller_preparation', 'Extended roller preparation', 'switch'],
  ['hot_water_self_cleaning', 'Hot water self-cleaning', 'switch'],
  ['self_cleaning_frequency', 'Self-cleaning frequency', 'select'],
  ['roller_drying_duration', 'Roller drying duration', 'select']
];

const STATION_ACTIONS = [
  ['empty_bin', 'Empty dust bin'],
  ['wash_mop', 'Wash mop roller'],
  ['dry_mop', 'Dry mop roller']
];

function deviceEntities(registry, entity, domain, suffix) {
  const vacuum = registry.find(e => e.entity_id === entity && e.platform === DOMAIN && !e.disabled_by);
  const serial = String(vacuum?.unique_id ?? '').replace(/_vacuum$/, '');
  return vacuum?.device_id ? registry.filter(e => e.platform === DOMAIN && e.device_id === vacuum.device_id && e.entity_id.startsWith(`${domain}.`) && e.unique_id === `${serial}_${suffix}`) : [];
}

function stationActions(hass, registry, entity) {
  return STATION_ACTIONS.map(([key, label]) => {
    const matches = deviceEntities(registry, entity, 'button', key);
    const id = matches.length === 1 && !matches[0].disabled_by ? matches[0].entity_id : undefined;
    const state = hass?.states?.[id];
    // Button states are timestamps, or unknown before the first press.
    return { key, label, entity: id, supported: !!id, available: hass?.connected !== false && !!state && state.state !== 'unavailable' && !state.attributes?.restored && !!hass?.services?.button?.press };
  });
}

async function pressStationAction(hass, registry, entity, key) {
  const action = stationActions(hass, registry, entity).find(item => item.key === key);
  if (!action?.available) throw new UiError('This station action is unavailable.');
  await hass.callService('button', 'press', { entity_id: action.entity });
}

function stationSettings(hass, registry, entity) {
  const vacuum = registry.find(e => e.entity_id === entity && e.platform === DOMAIN && !e.disabled_by);
  const serial = String(vacuum?.unique_id ?? '').replace(/_vacuum$/, '');
  return STATION_FIELDS.map(([key, label, domain]) => {
    const matches = vacuum?.device_id ? registry.filter(e => e.platform === DOMAIN && e.device_id === vacuum.device_id && !e.disabled_by && e.entity_id.startsWith(`${domain}.`) && e.unique_id === `${serial}_station_${key}`) : [];
    const id = matches.length === 1 ? matches[0].entity_id : undefined;
    const state = hass?.states?.[id];
    const options = Array.isArray(state?.attributes?.options) ? state.attributes.options.filter(v => typeof v === 'string') : [];
    const valid = domain === 'switch' ? ['on', 'off'].includes(state?.state) : options.includes(state?.state);
    const service = domain === 'switch' ? hass?.services?.switch?.turn_on && hass?.services?.switch?.turn_off : hass?.services?.select?.select_option;
    return { key, label, domain, entity: id, supported: !!id, value: state?.state, options, available: hass?.connected !== false && available(state) && valid && !!service };
  });
}

async function changeStationSetting(hass, registry, entity, key, value) {
  const field = stationSettings(hass, registry, entity).find(f => f.key === key);
  if (!field?.available) throw new UiError('This station setting is unavailable.');
  if (field.domain === 'switch') {
    if (typeof value !== 'boolean') throw new UiError('Invalid station switch value.');
    await hass.callService('switch', value ? 'turn_on' : 'turn_off', { entity_id: field.entity });
  } else {
    if (!field.options.includes(value)) throw new UiError('Invalid station option.');
    await hass.callService('select', 'select_option', { entity_id: field.entity, option: value });
  }
}

// Mirror the integration's current RB05-only zone support. Product 804 covers
// Spot+Scrub AI and R3. Other models need an integration capability contract first.
function supportsZoneDevice(registry, devices, entity) {
  const vacuum = registry.find(e => e.entity_id === entity && e.platform === DOMAIN && !e.disabled_by);
  const device = devices.find(d => d.id === vacuum?.device_id);
  return /^(804[A-Z]?|RB05)$/i.test(String(device?.model ?? ''));
}

// Only expose protocol values both understood by the zone adapter and offered
// by this device's room selects. This restricts options, not zone-model support.
const ZONE_CHOICES = {
  mode: [['Vacuum','vacuum'], ['Vacuum and Mop','vacuumAndMop'], ['Mop','mop'], ['Vacuum then Mop','vacuumThenMop']],
  strategy: [['Auto','auto'], ['Boost','boost'], ['Quiet','quiet'], ['Quick','quick']],
  water: [['Very Low','veryLow'], ['Low','low'], ['Medium','medium'], ['High','high']],
  passes: [['One Pass',1], ['Two Passes',2]],
};
function zoneDeviceOptions(rooms) {
  const keys = { mode:'cleaning_mode', strategy:'cleaning_strategy', water:'water_level', passes:'mop_repetitions' };
  return Object.fromEntries(Object.entries(keys).map(([key, field]) => {
    const fields = rooms.map(r => r.settings?.[field]).filter(Boolean);
    const options = ZONE_CHOICES[key].filter(([label]) => fields.length && fields.every(f => f.options.includes(label)));
    return [key, { supported: fields.length > 0, available: fields.length > 0 && fields.every(f => f.available), options }];
  }));
}

function vacuumEntries(registry) {
  return registry.filter(e => e.platform === DOMAIN && !e.disabled_by && e.entity_id.startsWith('vacuum.'));
}
function cameraEntries(registry, entity) {
  const device = registry.find(e => e.entity_id === entity)?.device_id;
  return registry.filter(e => e.platform === DOMAIN && !e.disabled_by && e.device_id === device && e.entity_id.startsWith('camera.'));
}
function defaultEntity(hass) {
  const entry = Object.values(hass.entities ?? {}).find(e => e.platform === DOMAIN && e.entity_id.startsWith('vacuum.'));
  return entry?.entity_id ?? Object.keys(hass.states).find(id => id.startsWith('vacuum.') && Array.isArray(hass.states[id].attributes.rooms)) ?? '';
}
function roomSelectionState(hass, entity) { return hass.states[entity]?.state; }
function hasRoomList(hass, entity) { return Array.isArray(hass.states[entity]?.attributes?.rooms); }
function roomActionAvailable(hass, start) { return !!hass?.services?.[DOMAIN]?.[start ? 'start_rooms_with_settings' : 'save_room_settings']; }
function roomPlanningState(hass, registry, config, model) {
  const saveAvailable = roomActionAvailable(hass, false), startAvailable = roomActionAvailable(hass, true);
  const ready = hass?.connected !== false && available(hass?.states?.[config.entity])
    && vacuumEntries(registry).some(entry => entry.entity_id === config.entity);
  const blocked = model.startBlockReason || startBlockReason(hass, config.entity);
  return { supportsSave:true, supportsStart:true, ordered:true,
    canSave:ready && saveAvailable, canStart:ready && startAvailable && !blocked,
    notice:model.startBlockReason || (!saveAvailable || !startAvailable
      ? 'The updated Dyson integration actions are not available. Reload the integration and refresh this dashboard.' : null) };
}
function mapId(hass, entity) { return hass?.states?.[entity]?.attributes?.map_id; }
function mapPicture(hass, entity) { return hass?.states?.[entity]?.attributes?.entity_picture; }
function mapCalibration(hass, entity) { return hass?.states?.[entity]?.attributes?.map_calibration; }
function trustedCamera(registry, entity, camera) {
  const robotEntry = registry.find(e => e.entity_id === entity);
  const cameraEntry = registry.find(e => e.entity_id === camera);
  return !!(robotEntry?.device_id && robotEntry.platform === DOMAIN && cameraEntry?.platform === DOMAIN && robotEntry.device_id === cameraEntry.device_id);
}
function robotTelemetry(hass, entity, camera) {
  const vacuum = hass?.states?.[entity], image = hass?.states?.[camera];
  const attrs = vacuum?.attributes ?? {};
  return { state: vacuum?.state, available: available(vacuum), name: attrs.friendly_name,
    dockState: attrs.dock_state, fault: attrs.fault, faultCode: attrs.fault_code,
    cleaning: hass?.connected !== false && vacuum?.state === 'cleaning' && !Object.hasOwn(DOCK_PHASES, attrs.dock_state),
    bumperColor: available(image) ? image.attributes?.robot_bumper_color : undefined };
}
function dockActivity(hass, entity) {
  const phase = hass?.states?.[entity]?.attributes?.dock_state;
  return DOCK_PHASES[phase] ? { text: DOCK_PHASES[phase][0], icon: DOCK_PHASES[phase][1], drying: phase === 'DRYING_MOP' } : null;
}
// Spot+Scrub zone tests confirm mopPasses controls repetitions even for vacuum.
// In vacuumThenMop it repeats only mopping; dryPasses stays at one.
function zoneSettingsPayload(mode, strategy, water, passes) {
  if (!['vacuum','vacuumAndMop','mop','vacuumThenMop'].includes(mode)
      || !['auto','boost','quiet','quick'].includes(strategy)
      || !['veryLow','low','medium','high'].includes(water)
      || ![1,2].includes(passes)) throw new Error('Invalid zone settings');
  return { clean_type:mode, cleaning_strategy:mode==='mop'?'auto':strategy,
    water_level:mode==='vacuum'?'low':water,
    mop_passes:passes, dry_passes:1 };
}


function zoneReady(hass, vacuum, camera, calibration, trusted, preview) {
  const state = hass?.states?.[vacuum], cameraState = hass?.states?.[camera];
  return !!(!preview && trusted && hass?.connected !== false && hass?.services?.[DOMAIN]?.clean_zone
    && state && !['unknown', 'unavailable'].includes(state.state) && state.attributes?.ready_to_start === true
    && cameraState && !['unknown', 'unavailable'].includes(cameraState.state) && validZoneCalibration(calibration)
    && String(mapId(hass, vacuum)) === String(calibration.map_id)
    && String(mapCalibration(hass, camera)?.map_id) === String(calibration.map_id));
}
function startZone(hass, { vacuum, camera, calibration, trusted, preview, rect, rotation, mode, strategy, water, passes }) {
  if (!zoneReady(hass, vacuum, camera, calibration, trusted, preview)) throw new UiError('This action is not available for the current robot state.');
  const data = { entity_id: vacuum, map_id: calibration.map_id,
    rectangle: zoneRobotRectangle(rect, calibration, rotation), ...zoneSettingsPayload(mode, strategy, water, passes) };
  return hass.callService(DOMAIN, 'clean_zone', data);
}

// Integration v2.2.0: sensor metadata is authoritative for selection and per-model
// write capability. Never infer support from globally registered services alone.
const scheduleDays = ['mon','tue','wed','thu','fri','sat','sun'];
function scheduleRoomSettings(raw, roomIds) {
  // Saved settings are optional metadata. Missing/unknown fields must never fall back to
  // general room preferences or become implicit writes on the next edit.
  return Object.fromEntries(roomIds.map(id => [id, Object.fromEntries(Object.keys(ROOM_FIELDS).flatMap(key => {
    const value = raw?.[id]?.[key];
    return typeof value === 'string' && value.trim() ? [[key,value]] : [];
  }))]));
}
function scheduleState(hass, registry, entity) {
  const vacuum = vacuumEntries(registry).find(entry => entry.entity_id === entity);
  const matches = vacuum ? deviceEntities(registry, entity, 'sensor', 'schedules') : [];
  const sensor = matches.length === 1 && !matches[0].disabled_by ? matches[0].entity_id : undefined;
  const state = hass?.states?.[sensor], attrs = state?.attributes ?? {};
  const raw = attrs.schedules;
  const valid = Array.isArray(raw) && raw.every(s => s && Number.isSafeInteger(s.schedule_id) && s.schedule_id > 0
    && typeof s.enabled === 'boolean' && Array.isArray(s.days) && s.days.length > 0 && s.days.every(day => scheduleDays.includes(day))
    && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(s.time) && Array.isArray(s.rooms) && s.rooms.every(name => typeof name === 'string')
    && Array.isArray(s.room_ids) && s.room_ids.length === s.rooms.length && s.room_ids.every(id => typeof id === 'string' && /^\d+$/.test(id))
    && new Set(s.room_ids).size === s.room_ids.length && (s.map_id === null || typeof s.map_id === 'string'))
    && new Set(raw.map(s => s.schedule_id)).size === raw.length;
  const readable = !!sensor && hass?.connected !== false && available(state) && valid;
  const canChange = attrs.can_change === true;
  const online = readable && available(hass?.states?.[entity]);
  const activeMap = mapId(hass, entity);
  return { supported:!!sensor, available:readable,
    writable:online && canChange && !!hass?.services?.[DOMAIN]?.set_schedule,
    createSupported:!!sensor && canChange && !!hass?.services?.[DOMAIN]?.set_schedule,
    createReady:activeMap != null && /^\d+$/.test(String(activeMap)),
    deleteSupported:!!sensor && canChange && !!hass?.services?.[DOMAIN]?.delete_schedule,
    schedules:readable ? raw.map(s => ({id:s.schedule_id, enabled:s.enabled, days:[...s.days], time:s.time,
      rooms:[...s.rooms], roomIds:[...s.room_ids], roomSettings:scheduleRoomSettings(s.room_settings,s.room_ids), mapId:s.map_id, repeat:s.repeat})) : [],
    inSync:attrs.in_sync, robotTotal:readable && /^\d+$/.test(String(state.state)) ? Number(state.state) : null,
    enabledCount:!readable ? null : attrs.in_sync === true ? raw.filter(schedule => schedule.enabled).length
      : Number.isSafeInteger(attrs.on) && attrs.on >= 0 ? attrs.on : null,
    roomSelectionKnown:true, creationUsesSelectedRooms:true };
}
function scheduleRoomOptions(hass, registry, config, schedule) {
  if (!schedule?.mapId || schedule.mapId !== String(mapId(hass, config.entity))) return null;
  const model = discover(hass, registry, config);
  return model.rooms.filter(room => room.available && !room.excluded && room.roomId
    && model.rooms.filter(other => other.roomId === room.roomId).length === 1);
}
async function setSchedule({ hass, registry, config, id, days, time, enabled, selected = [], draft = {}, context, roomPlan }) {
  const state = scheduleState(hass, registry, config.entity);
  if (!state.writable) throw new UiError('Schedules are unavailable. Check the robot connection and integration.');
  const data = {entity_id:config.entity};
  if (id !== undefined) {
    if (!Number.isSafeInteger(id) || !state.schedules.some(s => s.id === id)) throw new UiError('This schedule is no longer available. Refresh the schedule list.');
    data.schedule_id = id;
  }
  if (days !== undefined || time !== undefined || id === undefined) {
    if (!Array.isArray(days) || !days.length || days.some(day => !scheduleDays.includes(day))
        || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new UiError('Choose at least one weekday and a valid time.');
    data.days = scheduleDays.filter(day => days.includes(day)); data.time = time;
  }
  if (enabled !== undefined) {
    if (typeof enabled !== 'boolean') throw new UiError('Invalid schedule state.');
    data.enabled = enabled;
  }
  if (id === undefined || roomPlan !== undefined) {
    if (!state.createReady || context !== roomContext(hass, config.entity)) throw new UiError('The room plan changed. Close the dialog and review your room settings.');
    const schedule = state.schedules.find(s => s.id === id);
    if (id !== undefined && !scheduleRoomOptions(hass,registry,config,schedule)) throw new UiError('The room plan changed. Close the dialog and review your room settings.');
    const model = discover(hass, registry, config);
    const resolve = roomId => {
      const matches = model.rooms.filter(room => room.roomId === roomId);
      const room = matches.length === 1 ? matches[0] : null;
      if (!room?.available || room.excluded || room.context !== context) throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
      const liveIds = new Set(Object.values(room.settings).flatMap(field => {
        const source = hass.states[field.entity];
        return available(source) && source.attributes?.room_id != null ? [String(source.attributes.room_id)] : [];
      }));
      if (liveIds.size !== 1 || !liveIds.has(roomId)) throw new UiError('A selected room has no stable room ID. Refresh rooms and check the integration.');
      return room;
    };
    const roomIds = id !== undefined ? roomPlan?.roomIds : selected.map(entity => {
      const room = model.rooms.find(room => room.entity === entity);
      if (!room?.roomId) throw new UiError('A selected room has no stable room ID. Refresh rooms and check the integration.');
      return resolve(room.roomId).roomId;
    });
    if (!Array.isArray(roomIds) || !roomIds.length || roomIds.some(roomId => typeof roomId !== 'string') || new Set(roomIds).size !== roomIds.length) throw new UiError('Select at least one room without duplicates.');
    // Existing rooms can be retained/reordered even if their switch was disabled.
    // Added rooms and changed settings must resolve against this map's live entities.
    for (const roomId of roomIds) if (id === undefined || !schedule.roomIds.includes(roomId)) resolve(roomId);
    const settings = {};
    for (const [roomId, values] of Object.entries(id === undefined ? draft : roomPlan.settings ?? {})) {
      if (id !== undefined && !roomIds.includes(roomId)) throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
      const room = resolve(roomId);
      for (const [key, value] of Object.entries(values)) {
        const field = room.settings[key];
        if (!Object.hasOwn(ROOM_FIELDS,key) || !field?.available || !field.options.includes(value)) throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
        (settings[roomId] ??= {})[key] = value;
      }
    }
    data.room_ids = roomIds;
    if (Object.keys(settings).length) data.room_settings = settings;
  }
  if (draftRequests.has(config.entity)) throw new UiError('An action for this Dyson is already running in this browser.');
  draftRequests.add(config.entity);
  try { await hass.callService(DOMAIN, 'set_schedule', data); }
  finally { draftRequests.delete(config.entity); }
}
async function deleteSchedule({ hass, registry, config, id }) {
  const state = scheduleState(hass, registry, config.entity);
  if (!state.writable) throw new UiError('Schedules are unavailable. Check the robot connection and integration.');
  if (!state.deleteSupported) throw new UiError('Update the Dyson integration: {action} is unavailable.', {action:`${DOMAIN}.delete_schedule`});
  if (!Number.isSafeInteger(id) || !state.schedules.some(s => s.id === id)) throw new UiError('This schedule is no longer available. Refresh the schedule list.');
  if (draftRequests.has(config.entity)) throw new UiError('An action for this Dyson is already running in this browser.');
  draftRequests.add(config.entity);
  try { await hass.callService(DOMAIN, 'delete_schedule', {entity_id:config.entity, schedule_id:id}); }
  finally { draftRequests.delete(config.entity); }
}

return Object.freeze({ id: DOMAIN, label:'Dyson Spot+Scrub', shortLabel:'Spot+Scrub', deviceLabel:'Dyson device',
  editorHint:'Per-room settings are detected automatically. Saving and starting use the Dyson integration batch actions.',
  roomStartMessage:'Sending room settings and start request …',
  roomPlanningState, roomPresentation:dysonRoomPresentation, roomContext, discover, batteryStatus, sendRoomDraft, dockBusy, dockBlocksStart, startBlockReason, activityStatus, cleaningView, dryingRemainingTime, dryingRemainingPercent, canControl, controlCleaning, CONSUMABLES, consumableStatus, ROBOT_FIELDS, robotSettings, changeRobotSetting, STATION_FIELDS, STATION_ACTIONS, stationActions, pressStationAction, stationSettings, changeStationSetting, supportsZoneDevice, ZONE_CHOICES, zoneDeviceOptions, vacuumEntries, cameraEntries, defaultEntity, roomSelectionState, hasRoomList, roomActionAvailable, mapId, mapPicture, mapCalibration, trustedCamera, robotTelemetry, dockActivity, zoneReady, startZone, zoneSettingsPayload,
  scheduleState, scheduleRoomOptions, setSchedule, deleteSchedule,
  mapPictureAllowed:picture => typeof picture === 'string' && picture.startsWith('/api/camera_proxy/'),
});
})();


// Experimental RB05 room adapter. No protocol commands or fabricated HA entities.
const hassDysonAdapter = (() => {
const DOMAIN = 'hass_dyson';
const fields = {
  cleaning_mode: ['cleaning_mode', 'cleaning mode', { vacuum_only:'Vacuum', vacuum_and_mop:'Vacuum and Mop', mop_only:'Mop', vacuum_then_mop:'Vacuum then Mop' }],
  cleaning_strategy: ['vacuum_power', 'vacuum power', { auto:'Auto', boost:'Boost', quiet:'Quiet', quick:'Quick' }],
  water_level: ['hydration', 'hydration', { very_low:'Very Low', low:'Low', medium:'Medium', high:'High' }],
  mop_repetitions: ['wash_repetitions', 'wash repetitions', { '1x':'One Pass', '2x':'Two Passes' }],
};
const pending = new Set();
function vacuumEntries(registry) { return registry.filter(e => e.platform === DOMAIN && !e.disabled_by && e.entity_id.startsWith('vacuum.')); }
function deviceEntries(registry, entity) {
  const vacuum = vacuumEntries(registry).find(e => e.entity_id === entity);
  if (!vacuum?.device_id) return { entries:[], serial:'', deviceId:null };
  return { entries:registry.filter(e => e.platform === DOMAIN && e.device_id === vacuum.device_id), serial:String(vacuum.unique_id ?? '').replace(/_vacuum$/, ''), deviceId:vacuum.device_id };
}
function pick(entries, serial, domain, suffix) {
  const matches = entries.filter(e => !e.disabled_by && e.entity_id.startsWith(`${domain}.`) && e.unique_id === `${serial}_${suffix}`);
  return matches.length === 1 ? matches[0].entity_id : undefined;
}
function roomEntries(registry, entity) {
  const { entries, serial, deviceId } = deviceEntries(registry, entity), rooms = new Map();
  for (const e of entries) {
    if (e.disabled_by || !e.entity_id.startsWith('select.')) continue;
    for (const [key, [nativeKey]] of Object.entries(fields)) {
      const prefix = `${serial}_room_`, suffix = `_${nativeKey}`;
      if (!e.unique_id?.startsWith(prefix) || !e.unique_id.endsWith(suffix)) continue;
      const id = e.unique_id.slice(prefix.length, -suffix.length);
      if (!/^\d+$/.test(id)) continue;
      if (!rooms.has(id)) rooms.set(id, {});
      (rooms.get(id)[key] ??= []).push(e);
    }
  }
  return { entries, serial, deviceId, rooms };
}
function roomMap(registry, entity) {
  const { entries, serial, rooms } = roomEntries(registry, entity), maps = new Map();
  // Registry IDs are map-qualified upstream; never infer a map from display names.
  for (const e of entries) {
    const prefix = `${serial}_clean_zone_`;
    if (!e.entity_id.startsWith('button.') || !e.unique_id?.startsWith(prefix)) continue;
    const value = e.unique_id.slice(prefix.length), split = value.lastIndexOf('_');
    if (split < 1 || !/^\d+$/.test(value.slice(split + 1))) continue;
    const map = value.slice(0, split), id = value.slice(split + 1);
    if (!maps.has(map)) maps.set(map, new Set());
    maps.get(map).add(id);
  }
  const candidates = [...maps].filter(([, ids]) => rooms.size && [...rooms.keys()].every(id => ids.has(id)));
  // Upstream room selects do not expose their map. Until there is a verified
  // active-map contract, multiple stored maps cannot safely be joined to them.
  return maps.size === 1 && candidates.length === 1 ? candidates[0][0] : null;
}
function roomContext(hass, entity, registry = []) {
  // Include registry map topology and current-map preference membership. A change
  // during a two-step Start must not inherit the old draft's identity.
  const { entries, serial } = deviceEntries(registry, entity);
  const global = pick(entries, serial, 'select', 'cleaning_mode');
  const ids = Object.keys(hass?.states?.[global]?.attributes?.room_settings ?? {}).sort();
  return JSON.stringify([DOMAIN, entity, roomMap(registry, entity), ids]);
}
function cameraEntries(registry, entity) {
  return deviceEntries(registry, entity).entries.filter(e => !e.disabled_by && e.entity_id.startsWith('image.'));
}
function discover(hass, registry, config, previousRooms = []) {
  const { entries, serial, deviceId, rooms:groups } = roomEntries(registry, config.entity);
  const context = roomContext(hass, config.entity, registry), map = roomMap(registry, config.entity);
  const issues = [];
  if (!deviceId) issues.push('The Dyson device was not found in the entity registry.');
  if (!groups.size) issues.push('The Dyson room list is not currently available.');
  const rooms = [...groups].map(([id, group]) => {
    const settings = {}, ids = new Set(); let name;
    for (const [key, candidates] of Object.entries(group)) {
      if (candidates.length !== 1) continue;
      const entry = candidates[0], state = hass.states[entry.entity_id], [, label, values] = fields[key];
      const liveId = state?.attributes?.room_id;
      if (liveId != null) ids.add(String(liveId));
      const prior = previousRooms.find(r => r.roomId === id && r.context === context)?.settings?.[key];
      const options = Array.isArray(state?.attributes?.options) ? state.attributes.options.filter(v => Object.hasOwn(values, v)).map(v => values[v]) : !available(state) ? prior?.options ?? [] : [];
      settings[key] = { entity:entry.entity_id, value:values[state?.state], options, available:hass.connected !== false && available(state) && String(liveId) === id };
      const original = entry.original_name;
      if (!name && typeof original === 'string' && original.endsWith(` ${label}`)) name = original.slice(0, -(label.length + 1));
    }
    // An actual select ID acts as the card's stable room key; no room switches
    // exist in this integration. All writes still use native room IDs.
    const modeEntries = entries.filter(e => e.entity_id.startsWith('select.') && e.unique_id === `${serial}_room_${id}_cleaning_mode`);
    const entity = settings.cleaning_mode?.entity ?? (modeEntries.length === 1 ? modeEntries[0].entity_id : Object.values(settings)[0]?.entity) ?? '';
    const valid = ids.size === 1 && ids.has(id);
    return { name:name || `Room ${id}`, key:entity, entity, roomId:valid ? id : undefined, context, mapId:map, settings,
      available:valid && !!entity && Object.values(settings).some(f => f.available), excluded:config.excluded_rooms?.includes(entity) ?? false };
  });
  const rank = id => { const i = config.room_order?.indexOf(id) ?? -1; return i < 0 ? Number.MAX_SAFE_INTEGER : i; };
  rooms.sort((a,b) => rank(a.entity) - rank(b.entity));
  const images = cameraEntries(registry, config.entity);
  const cameraEntity = config.camera_entity ? images.find(e => e.entity_id === config.camera_entity)?.entity_id
    : ['clean_coverage','floor_plan','dust_map'].map(s => pick(entries, serial, 'image', s)).find(Boolean);
  return { rooms, issues, cameraEntity, startBlockReason:groups.size && !map ? 'The room map is unavailable or ambiguous. Refresh rooms and check the integration.' : null,
    batteryEntity:pick(entries, serial, 'sensor', 'robot_battery'),
    chargingEntity:pick(entries, serial, 'binary_sensor', 'robot_battery_charging'), deviceId, mapId:map };
}
function dockState(hass, entity, registry = []) {
  const { entries, serial } = deviceEntries(registry, entity);
  const sensor = hass?.states?.[pick(entries, serial, 'sensor', 'robot_dock_state')];
  return available(sensor) ? sensor.state : null;
}
function dockActivity(hass, entity, registry = []) {
  if (hass?.connected === false || !available(hass?.states?.[entity])) return null;
  const phase = dockState(hass, entity, registry);
  const labels = { WASHING_MOP:['Cleaning mop roller','mdi:waves'], COLLECTING_DUST:['Emptying dust bin','mdi:delete-empty-outline'], DRYING_MOP:['Drying mop roller','mdi:weather-windy'] };
  if (!Object.hasOwn(labels, phase)) return null;
  return { text:labels[phase][0], icon:labels[phase][1], drying:phase === 'DRYING_MOP', remaining:phase === 'DRYING_MOP' || phase === 'WASHING_MOP' };
}
function dryingRemainingTime(hass, entity, registry = [], now = Date.now()) {
  if (!dockActivity(hass, entity, registry)?.remaining) return null;
  const { entries, serial } = deviceEntries(registry, entity);
  const timer = hass?.states?.[pick(entries, serial, 'sensor', 'robot_dock_timer_end')];
  const value = typeof timer?.state === 'string' ? timer.state.trim() : '';
  // Require an explicit timezone; never interpret a naive time in the browser's zone.
  if (!available(timer) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return null;
  const end = Date.parse(value);
  if (!Number.isFinite(end) || !Number.isFinite(now)) return null;
  const minutes = Math.ceil(Math.max(0, end - now) / 60000);
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}
function startBlockReason(hass, entity, registry = []) {
  const state = hass?.states?.[entity];
  if (hass?.connected === false || !available(state)) return 'Robot disconnected';
  if (state.attributes?.ready_to_start === false) return 'The integration is not ready to start a new clean';
  const dock = dockState(hass, entity, registry);
  if (dock === 'WASHING_MOP') return 'Cleaning mop roller';
  if (dock === 'COLLECTING_DUST') return 'Emptying dust bin';
  // A new room job may be started while the dock is drying. The integration
  // owns the transition; do not send an unverified cancel-drying command.
  if (!['IDLE','DRYING_MOP'].includes(dock)) return 'Waiting for the robot to be ready';
  const raw = state.attributes?.raw_state;
  // FULL_CLEAN_FINISHED means the job ended, not that the return trip ended.
  // Require resting/charging telemetry and a compatible HA state together.
  if (!['INACTIVE_CHARGED','INACTIVE_CHARGING'].includes(raw)) return 'Waiting for the robot to be ready';
  return ['docked','idle'].includes(state.state) ? null : 'Waiting for the robot to be ready';
}
function cleaningView(hass, entity, pendingStart = false, registry = []) {
  // A finished job can still be returning to the dock. Keep that session
  // visible, but never use its old completion telemetry to confirm a new Start.
  const state = hass?.states?.[entity];
  if (available(state) && hass?.connected !== false && (state.attributes?.raw_state === 'FULL_CLEAN_FINISHED' || !startBlockReason(hass, entity, registry))) {
    if (pendingStart) return { active:true, title:'Starting clean', detail:'Waiting for the robot to report its status.', live:false };
    return state.state === 'returning'
      ? {...spotScrubAdapter.cleaningView(hass, entity), live:false}
      : { active:false, live:false };
  }
  if (available(state) && hass?.connected !== false && state.attributes?.raw_state === 'FULL_CLEAN_CHARGING') return { active:true, title:'Cleaning session active', detail:'', live:true };
  return spotScrubAdapter.cleaningView(hass, entity, pendingStart);
}
async function sendRoomDraft({ hass, model, config, selected = [], draft = {}, start = false, registry = [], context = roomContext(hass, config.entity, registry), getCurrent }) {
  const fail = () => { throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.'); };
  const current = () => {
    if (getCurrent) {
      const now = getCurrent();
      if (!now || now.active === false || now.config !== config) fail();
      hass = now.hass; registry = now.registry;
    }
    if (context !== roomContext(hass, config.entity, registry)) fail();
    if (hass?.connected === false || !available(hass.states[config.entity])) throw new UiError('The robot is unavailable.');
    const latest = discover(hass, registry, config);
    if (!latest.deviceId || latest.deviceId !== model.deviceId) fail();
    return latest;
  };
  const live = current();
  const resolve = id => {
    const matches = live.rooms.filter(r => r.roomId === id);
    if (matches.length !== 1 || !matches[0].available || matches[0].excluded) fail();
    return matches[0];
  };
  const settings = {}, native = {};
  for (const [id, values] of Object.entries(draft)) {
    const room = resolve(id);
    for (const [key, value] of Object.entries(values)) {
      const field = room.settings[key], mapping = fields[key];
      if (!field?.available || !field.options.includes(value) || !mapping) fail();
      if (field.value === value) continue;
      const option = Object.keys(mapping[2]).find(v => mapping[2][v] === value);
      if (option === undefined) fail();
      (settings[id] ??= {})[key] = value;
      (native[id] ??= {})[mapping[0]] = key === 'mop_repetitions' ? Number(option.slice(0,-1)) : option;
    }
  }
  const rooms = start ? selected.map(entity => {
    const room = live.rooms.find(r => roomKey(r) === entity);
    if (!room?.roomId) fail();
    return resolve(room.roomId);
  }) : [];
  if (start && (!rooms.length || new Set(rooms.map(r => r.roomId)).size !== rooms.length)) throw new UiError('Select at least one room without duplicates.');
  if (start && !live.mapId) throw new UiError('The room map is unavailable or ambiguous. Refresh rooms and check the integration.');
  if (start && startBlockReason(hass, config.entity, registry)) throw new UiError(startBlockReason(hass, config.entity, registry));
  const hasSettings = Object.keys(native).length > 0;
  const requireAction = service => { if (!hass.services?.[DOMAIN]?.[service]) throw new UiError('Update the Dyson integration: {action} is unavailable.', { action:`${DOMAIN}.${service}` }); };
  if (start) requireAction('start_zone_clean');
  if (hasSettings) requireAction('set_room_cleaning_modes');
  const lockKey = live.deviceId;
  if (pending.has(lockKey)) throw new UiError('An action for this Dyson is already running in this browser.');
  if (!start && !hasSettings) return { rooms:[], settings, sent:false };
  pending.add(lockKey);
  let saved = false;
  try {
    if (hasSettings) {
      await hass.callService(DOMAIN, 'set_room_cleaning_modes', { device_id:live.deviceId, room_modes:native });
      saved = true;
    }
    if (start) {
      // Backend Save performs robot readback. HA select publication may lag, so
      // do not turn that into an arbitrary frontend delay or a duplicate write.
      const fresh = current();
      if (fresh.mapId !== live.mapId || rooms.some(r => !fresh.rooms.some(n => n.roomId === r.roomId && n.entity === r.entity && n.available && !n.excluded))) fail();
      const blocked = startBlockReason(hass, config.entity, registry);
      if (blocked) throw new UiError(blocked);
      requireAction('start_zone_clean');
      await hass.callService(DOMAIN, 'start_zone_clean', { device_id:live.deviceId, zones:rooms.map(r => r.roomId), map:live.mapId });
    }
  } catch (error) {
    if (start && saved) throw new UiError('Settings were saved, but cleaning did not start. Review the robot status before retrying. {error}', { error });
    throw error;
  } finally { pending.delete(lockKey); }
  return { rooms:rooms.map(r => ({ entity_id:r.entity, room_id:r.roomId, name:r.name })), settings, sent:true };
}
function canControl(hass, entity, action, registry = []) {
  if (!vacuumEntries(registry).some(entry => entry.entity_id === entity)) return false;
  if (action === 'cancel_drying') return false;
  if (['WASHING_MOP','COLLECTING_DUST','DRYING_MOP'].includes(dockState(hass, entity, registry))) return false;
  return spotScrubAdapter.canControl(hass, entity, action);
}
async function controlCleaning(hass, entity, action, registry = []) {
  if (!canControl(hass, entity, action, registry)) throw new UiError('This action is not available for the current robot state.');
  await hass.callService('vacuum', action, { entity_id:entity });
}
function consumableStatus(hass, registry, entity) {
  const { entries, serial } = deviceEntries(registry, entity);
  return spotScrubAdapter.CONSUMABLES.map(([type, name]) => {
    const refill = type === 'cleaningSolution';
    const id = pick(entries, serial, refill ? 'binary_sensor' : 'sensor', refill ? 'cleaning_solution' : `${type}_life`);
    const state = hass?.states?.[id], live = hass?.connected !== false && available(state);
    if (refill) {
      const refillStatus = live ? state.state === 'on' ? 'refill_required' : state.state === 'off' ? 'ok' : null : null;
      return { type, name, supported:!!id, remaining:null, level:'unknown', refillStatus, text:refillStatus === 'ok' ? 'Ready to use' : refillStatus === 'refill_required' ? 'Refill required' : 'Unavailable' };
    }
    const raw = state?.state, value = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : NaN;
    const remaining = live && Number.isFinite(value) && value >= 0 && value <= 100 ? Math.round(value * 10) / 10 : null;
    return { type, name, supported:!!id, remaining, level:remaining === null ? 'unknown' : remaining <= 10 ? 'low' : remaining <= 25 ? 'medium' : 'high', text:remaining === null ? 'Unavailable' : `${remaining}% remaining` };
  });
}
function robotTelemetry(hass, entity, camera, registry = []) {
  const state = hass?.states?.[entity];
  return { state:state?.state, available:available(state), name:state?.attributes?.friendly_name,
    cleaning:hass?.connected !== false && state?.state === 'cleaning' && dockState(hass, entity, registry) === 'IDLE', fault:undefined, faultCode:undefined, dockState:dockState(hass, entity, registry), bumperColor:undefined };
}
const unsupported = () => { throw new UiError('This action is not available for the current robot state.'); };
// Robot schedules are discovered by registry identity, never by translated names.
const scheduleDays = ['mon','tue','wed','thu','fri','sat','sun'];
function scheduleState(hass, registry, entity) {
  const { entries, serial, deviceId } = deviceEntries(registry, entity);
  const sensor = pick(entries, serial, 'sensor', 'jdm_schedules');
  const state = hass?.states?.[sensor];
  const supported = !!sensor && !!hass?.services?.[DOMAIN]?.set_robot_schedule;
  const raw = state?.attributes?.schedules;
  const valid = Array.isArray(raw) && raw.every(s => s && Number.isSafeInteger(s.schedule_id) && s.schedule_id >= 0
    && typeof s.enabled === 'boolean' && Array.isArray(s.days) && s.days.length > 0
    && s.days.every(d => scheduleDays.includes(d)) && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(s.time)
    && Array.isArray(s.rooms) && s.rooms.every(name => typeof name === 'string'))
    && new Set(raw.map(s => s.schedule_id)).size === raw.length;
  const readable = supported && hass?.connected !== false && available(state) && valid;
  return { supported, available:readable, writable:readable && !!deviceId && available(hass?.states?.[entity]),
    deleteSupported:supported && !!hass?.services?.[DOMAIN]?.delete_robot_schedule,
    schedules:readable ? raw.map(s => ({ id:s.schedule_id, enabled:s.enabled, days:[...s.days], time:s.time, rooms:[...s.rooms], repeat:s.repeat })) : [],
    inSync:state?.attributes?.in_sync, robotTotal:state?.attributes?.robot_total,
    enabledCount:readable && state.attributes.in_sync === true ? raw.filter(schedule => schedule.enabled).length : null,
    // beta.6's describe_order lists every preference row, including unselected
    // rooms. Its action preserves the robot's stored selection flags. Neither
    // the selected-room flags nor an input to change them reach this API.
    roomSelectionKnown:false, creationUsesStoredRooms:true, deviceId };
}
async function setSchedule({ hass, registry, config, id, days, time, enabled, draft = {}, context }) {
  const state = scheduleState(hass, registry, config.entity);
  if (!state.writable) throw new UiError('Schedules are unavailable. Check the robot connection and integration.');
  const data = { device_id:state.deviceId };
  if (id !== undefined) {
    if (!Number.isSafeInteger(id) || !state.schedules.some(s => s.id === id)) throw new UiError('This schedule is no longer available. Refresh the schedule list.');
    data.schedule_id = id;
  }
  if (days !== undefined || time !== undefined || id === undefined) {
    if (!Array.isArray(days) || !days.length || days.some(d => !scheduleDays.includes(d))
        || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new UiError('Choose at least one weekday and a valid time.');
    data.days = scheduleDays.filter(d => days.includes(d)); data.time = time;
  }
  if (enabled !== undefined) {
    if (typeof enabled !== 'boolean') throw new UiError('Invalid schedule state.');
    data.enabled = enabled;
  }
  if (id === undefined) {
    if (context !== roomContext(hass, config.entity, registry)) throw new UiError('The room plan changed. Close the dialog and review your room settings.');
    const model = discover(hass, registry, config);
    if (!model.mapId || !model.rooms.length) throw new UiError('The room map is unavailable or ambiguous. Refresh rooms and check the integration.');
    const native = {};
    for (const [roomId, values] of Object.entries(draft)) {
      const matches = model.rooms.filter(r => r.roomId === roomId);
      const room = matches.length === 1 && matches[0];
      if (!room?.available || room.excluded) throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
      for (const [key, value] of Object.entries(values)) {
        const field = room.settings[key], mapping = fields[key];
        if (!mapping || !field?.available || !field.options.includes(value)) throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
        const option = Object.keys(mapping[2]).find(v => mapping[2][v] === value);
        if (option === undefined) throw new UiError('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
        (native[roomId] ??= {})[mapping[0]] = key === 'mop_repetitions' ? Number(option.slice(0,-1)) : option;
      }
    }
    if (Object.keys(native).length) data.room_modes = native;
  }
  if (pending.has(state.deviceId)) throw new UiError('An action for this Dyson is already running in this browser.');
  pending.add(state.deviceId);
  try { await hass.callService(DOMAIN, 'set_robot_schedule', data); }
  finally { pending.delete(state.deviceId); }
}
async function deleteSchedule({ hass, registry, config, id }) {
  const state = scheduleState(hass, registry, config.entity);
  if (!state.writable) throw new UiError('Schedules are unavailable. Check the robot connection and integration.');
  if (!state.deleteSupported) throw new UiError('Update the Dyson integration: {action} is unavailable.', {action:`${DOMAIN}.delete_robot_schedule`});
  if (!Number.isSafeInteger(id) || !state.schedules.some(s => s.id === id)) throw new UiError('This schedule is no longer available. Refresh the schedule list.');
  if (pending.has(state.deviceId)) throw new UiError('An action for this Dyson is already running in this browser.');
  pending.add(state.deviceId);
  try { await hass.callService(DOMAIN, 'delete_robot_schedule', {device_id:state.deviceId, schedule_id:id}); }
  finally { pending.delete(state.deviceId); }
}
function roomPlanningState(hass, registry, config, model, draft = {}) {
  const saveAvailable = !!hass?.services?.[DOMAIN]?.set_room_cleaning_modes;
  const startAvailable = !!hass?.services?.[DOMAIN]?.start_zone_clean;
  const ready = hass?.connected !== false && available(hass?.states?.[config.entity])
    && vacuumEntries(registry).some(entry => entry.entity_id === config.entity);
  const blocked = model.startBlockReason || startBlockReason(hass, config.entity, registry);
  return { supportsSave:true, supportsStart:true, ordered:false,
    canSave:ready && saveAvailable,
    canStart:ready && startAvailable && !blocked && (!Object.keys(draft).length || saveAvailable),
    notice:model.startBlockReason || (!saveAvailable || !startAvailable
      ? 'The updated Dyson integration actions are not available. Reload the integration and refresh this dashboard.' : null) };
}

return Object.freeze({ id:DOMAIN, infoTabs:['consumables'], mapEntityLabel:'Map image',
  label:'hass-dyson (experimental)', shortLabel:'hass-dyson', deviceLabel:'Dyson device',
  editorHint:'Room order is controlled by hass-dyson. Changed settings are saved before cleaning starts.',
  roomStartMessage:'Sending room settings and start request …',
  roomPlanningState, roomPresentation:dysonRoomPresentation,
  scheduleState, setSchedule, deleteSchedule,
  usesDockTimer:true, supportsDryingCancellation:false,
  planningHint:'Room order is controlled by hass-dyson. Changed settings are saved before cleaning starts.',
  vacuumEntries, cameraEntries, roomContext, discover, sendRoomDraft,
  defaultEntity:hass => vacuumEntries(Object.values(hass.entities ?? {}))[0]?.entity_id ?? '',
  roomSelectionState:() => 'off', hasRoomList:() => true,
  roomActionAvailable:(hass, start) => !!hass?.services?.[DOMAIN]?.[start ? 'start_zone_clean' : 'set_room_cleaning_modes'],
  startBlockReason, cleaningView, robotTelemetry, canControl, controlCleaning, consumableStatus,
  batteryStatus:spotScrubAdapter.batteryStatus,
  activityStatus:(hass, entity, pendingStart, registry = []) => {
    if (hass?.connected === false || !available(hass?.states?.[entity])) return { text:'Robot unavailable', icon:'mdi:alert-circle-outline', drying:false };
    const activity = dockActivity(hass, entity, registry);
    if (activity) return activity;
    const view = cleaningView(hass, entity, pendingStart, registry);
    return view.active ? { text:({cleaning:'Cleaning', paused:'Paused', returning:'Returning / mapping', error:'Robot needs attention'})[hass?.states?.[entity]?.state] ?? view.title, icon:'mdi:robot-vacuum', drying:false } : null;
  },
  dockBusy:(hass, entity, registry) => !!dockActivity(hass, entity, registry),
  dockBlocksStart:(hass, entity, registry) => ['WASHING_MOP','COLLECTING_DUST'].includes(dockState(hass, entity, registry)) && !!dockActivity(hass, entity, registry), dockActivity,
  dryingRemainingTime, dryingRemainingPercent:() => null,
  stationSettings:() => [], stationActions:() => [], robotSettings:() => [],
  changeStationSetting:unsupported, pressStationAction:unsupported, changeRobotSetting:unsupported,
  supportsZoneDevice:() => false, zoneReady:() => false, startZone:unsupported,
  zoneDeviceOptions:() => spotScrubAdapter.zoneDeviceOptions([]),
  trustedCamera:(registry, entity, image) => cameraEntries(registry, entity).some(e => e.entity_id === image),
  mapId:() => undefined, mapCalibration:() => undefined,
  mapPicture:(hass, entity) => hass?.states?.[entity]?.attributes?.entity_picture,
  mapPictureAllowed:picture => typeof picture === 'string' && picture.startsWith('/api/image_proxy/'),
});
})();


// Home Assistant's vacuum contract, not a manufacturer's command dialect.
const haRoomsAdapter = (() => {
const CLEAN_AREA = 16384;
const pending = new Set();
const unsupported = () => { throw new UiError('This action is not available for the current robot state.'); };
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const supports = (hass, entity) => !!(Number(hass?.states?.[entity]?.attributes?.supported_features) & CLEAN_AREA);
const vacuumEntries = (registry, hass) => registry.filter(entry => !entry.disabled_by && entry.entity_id.startsWith('vacuum.') && supports(hass, entry.entity_id));
const entryFor = (registry, entity) => registry.find(entry => entry.entity_id === entity && !entry.disabled_by && entry.entity_id.startsWith('vacuum.'));
function mapping(entry) {
  const raw = entry?.options?.vacuum?.area_mapping;
  if (!object(raw)) return [];
  return Object.entries(raw).filter(([id, segments]) => id && Array.isArray(segments) && segments.length
    && segments.every(id => typeof id === 'string' && id.length > 0))
    .map(([id, segments]) => [id, [...new Set(segments)].sort()]).sort(([a],[b]) => a.localeCompare(b));
}
function roomContext(hass, entity, registry = []) {
  const entry = entryFor(registry, entity);
  return JSON.stringify([entity, entry?.id ?? null, entry?.unique_id ?? null, entry?.platform ?? null,
    entry?.device_id ?? null, mapping(entry)]);
}
function discover(hass, registry, config) {
  const entry = entryFor(registry, config.entity), context = roomContext(hass, config.entity, registry);
  const issues = [];
  if (!entry) issues.push('The robot was not found in the entity registry.');
  else if (!supports(hass, config.entity)) issues.push('This robot does not report Home Assistant area cleaning support.');
  else if (!mapping(entry).length) issues.push('Map the robot segments to Home Assistant areas in the vacuum entity settings.');
  else if (!object(hass?.areas)) issues.push('Home Assistant areas are unavailable. Reload the dashboard.');
  const rooms = supports(hass, config.entity) ? mapping(entry).flatMap(([areaId, segmentIds]) => {
    const area = hass?.areas?.[areaId];
    if (!area || typeof area.name !== 'string') return [];
    const key = `area:${areaId}`;
    return [{key, roomId:areaId, areaId, segmentIds, name:area.name, context, settings:{},
      available:hass?.connected !== false && available(hass?.states?.[config.entity]),
      excluded:config.excluded_rooms?.includes(key) ?? false}];
  }) : [];
  if (!issues.length && !rooms.length) issues.push('Map the robot segments to Home Assistant areas in the vacuum entity settings.');
  const rank = key => { const index = config.room_order?.indexOf(key) ?? -1; return index < 0 ? Number.MAX_SAFE_INTEGER : index; };
  rooms.sort((a,b) => rank(a.key) - rank(b.key));
  const sameDevice = registry.filter(row => entry?.device_id && row.device_id === entry.device_id
    && row.platform === entry.platform && !row.disabled_by);
  const single = (domain, deviceClass) => {
    const matches = sameDevice.filter(row => row.entity_id.startsWith(`${domain}.`)
      && hass?.states?.[row.entity_id]?.attributes?.device_class === deviceClass);
    return matches.length === 1 ? matches[0].entity_id : undefined;
  };
  return {rooms, issues, startBlockReason:issues[0] ?? null,
    batteryEntity:single('sensor','battery'), chargingEntity:single('binary_sensor','battery_charging')};
}
function startBlockReason(hass, entity) {
  const state = hass?.states?.[entity];
  if (hass?.connected === false || !available(state)) return 'The robot is unavailable.';
  if (!supports(hass, entity)) return 'This robot does not report Home Assistant area cleaning support.';
  if (!hass.services?.vacuum?.clean_area) return 'Home Assistant area cleaning is unavailable. Check your Home Assistant version and integration.';
  return ['docked','idle'].includes(state.state) ? null : 'Start is only available when the robot is docked or idle.';
}
function planningSettings(hass, registry, config) {
  const state = hass?.states?.[config.entity], raw = state?.attributes?.fan_speed_list;
  const entry = entryFor(registry, config.entity);
  if (!entry || !(Number(state?.attributes?.supported_features) & 32)
      || !hass?.services?.vacuum?.set_fan_speed || !Array.isArray(raw)
      || !raw.length || raw.some(option => typeof option !== 'string' || !option.trim())) return [];
  // Spot+Scrub exposes its cleaning-mode selector through HA's fan API. These
  // values must not appear as suction levels or be written by a suction draft.
  if (entry.platform === 'dyson_spot_scrub' && raw.some(option =>
    ['Room settings','Vacuum','Vacuum and Mop','Mop','Vacuum then Mop'].includes(option))) return [];
  return [{key:'fan_speed',label:'Suction power · all selected rooms',
    value:state.attributes.fan_speed,options:[...new Set(raw)],
    available:hass?.connected !== false && available(state),
    hint:'Robot setting; it may remain active after this clean.'}];
}
function validatePlanningDraft(hass, registry, config, draft) {
  if (!object(draft) || Object.keys(draft).some(key => key !== 'fan_speed')) unsupported();
  if (!Object.hasOwn(draft, 'fan_speed')) return;
  const field = planningSettings(hass, registry, config)[0];
  if (!field?.available || !field.options.includes(draft.fan_speed)) throw new UiError('The selected suction power is no longer available. Review or discard the draft.');
}
function roomPlanningState(hass, registry, config, model, _roomDraft, planningDraft = {}) {
  let notice = model.startBlockReason || startBlockReason(hass, config.entity);
  try { validatePlanningDraft(hass, registry, config, planningDraft); }
  catch (error) { notice ||= error; }
  return {supportsSave:false, supportsStart:true, canSave:false, ordered:false,
    canStart:!!entryFor(registry, config.entity) && !notice, notice};
}
async function sendRoomDraft({hass, registry = [], config, model, selected = [], draft = {}, start = false,
  planningDraft = {}, context = roomContext(hass, config.entity, registry), getCurrent}) {
  if (!start || Object.keys(draft).length) unsupported();
  const connection = hass.connection;
  const current = () => {
    if (getCurrent) {
      const now = getCurrent();
      if (!now || now.active === false || now.config !== config || now.hass?.connection !== connection) throw new UiError('The room selection changed. Refresh rooms and select the areas again.');
      hass = now.hass; registry = now.registry;
    }
    if (context !== roomContext(hass, config.entity, registry)) throw new UiError('The room selection changed. Refresh rooms and select the areas again.');
    const blocked = startBlockReason(hass, config.entity);
    if (blocked) throw new UiError(blocked);
    validatePlanningDraft(hass, registry, config, planningDraft);
  };
  current();
  if (!selected.length || new Set(selected).size !== selected.length) throw new UiError('Select at least one room without duplicates.');
  const lockKey = config.entity;
  if (pending.has(lockKey)) throw new UiError('An action for this robot is already running in this browser.');
  pending.add(lockKey);
  let fanSent = false;
  const validateRooms = async () => {
    // Read current persisted mapping and areas immediately before the command.
    // No admin-only get_segments call or manufacturer action is needed.
    const [entry, areas] = await Promise.all([
      hass.callWS({type:'config/entity_registry/get', entity_id:config.entity}),
      hass.callWS({type:'config/area_registry/list'}),
    ]);
    current();
    if (!entry || entry.entity_id !== config.entity || !Array.isArray(areas)) throw new UiError('The room selection changed. Refresh rooms and select the areas again.');
    const freshRegistry = registry.filter(row => row.entity_id !== config.entity).concat(entry);
    if (context !== roomContext(hass, config.entity, freshRegistry)) throw new UiError('The room selection changed. Refresh rooms and select the areas again.');
    const fresh = discover({...hass, areas:Object.fromEntries(areas.map(area => [area.area_id, area]))}, freshRegistry, config);
    if (fresh.startBlockReason) throw new UiError(fresh.startBlockReason);
    return selected.map(key => {
      const previous = model.rooms.filter(room => roomKey(room) === key);
      const matches = fresh.rooms.filter(room => roomKey(room) === key && room.available && !room.excluded);
      if (previous.length !== 1 || previous[0].context !== context || matches.length !== 1) throw new UiError('The room selection changed. Refresh rooms and select the areas again.');
      return matches[0];
    });
  };
  try {
    let rooms = await validateRooms();
    if (Object.hasOwn(planningDraft, 'fan_speed') && planningDraft.fan_speed !== hass.states[config.entity].attributes.fan_speed) {
      await hass.callService('vacuum', 'set_fan_speed', {entity_id:config.entity, fan_speed:planningDraft.fan_speed});
      fanSent = true;
      // A setting write can publish new HA state or outlive this card. Recheck
      // the current lifecycle, readiness and persisted mapping before Start.
      current();
      rooms = await validateRooms();
    }
    await hass.callService('vacuum', 'clean_area', {entity_id:config.entity, cleaning_area_id:rooms.map(room => room.areaId)});
    return {rooms:rooms.map(room => ({room_id:room.areaId,name:room.name})),settings:{},sent:true};
  } catch (error) {
    if (fanSent) throw new UiError('The suction power command was sent, but area cleaning was not confirmed. Check the robot before retrying. {error}', {error});
    throw error;
  } finally { pending.delete(lockKey); }
}
function canControl(hass, entity, action, registry = []) {
  const state = hass?.states?.[entity];
  const feature = {pause:4, start:8192, return_to_base:16}[action];
  const states = {pause:['cleaning'], start:['paused'], return_to_base:['cleaning','paused','returning','error']}[action] ?? [];
  return !!(entryFor(registry, entity) && feature && hass?.connected !== false && available(state)
    && states.includes(state.state) && (Number(state.attributes?.supported_features) & feature) && hass.services?.vacuum?.[action]);
}
async function controlCleaning(hass, entity, action, registry) {
  if (!canControl(hass, entity, action, registry)) unsupported();
  await hass.callService('vacuum', action, {entity_id:entity});
}
function cleaningView(hass, entity, pendingStart) {
  const state = hass?.states?.[entity];
  const titles = {cleaning:'Cleaning session',paused:'Paused',returning:'Robot returning',error:'Robot needs attention'};
  if (hass?.connected !== false && available(state) && titles[state.state]) return {active:true,live:true,title:titles[state.state],detail:''};
  return pendingStart ? {active:true,live:false,title:'Starting clean',detail:'Waiting for the robot to report its status.'} : {active:false,live:false};
}
function batteryStatus(hass, model) {
  const state = hass?.states?.[model.batteryEntity], charge = hass?.states?.[model.chargingEntity];
  const raw = state?.state;
  const value = typeof raw === 'string' && raw.trim() ? Number(raw) : NaN;
  const percent = hass?.connected !== false && available(state) && Number.isFinite(value) && value >= 0 && value <= 100 ? Math.round(value) : null;
  return {percent,charging:hass?.connected !== false && available(charge) && charge.state === 'on',
    level:percent === null ? 'unknown' : percent < 20 ? 'low' : percent < 50 ? 'medium' : 'high'};
}
return Object.freeze({id:'ha_rooms', label:'Home Assistant · Area cleaning', shortLabel:'Home Assistant', deviceLabel:'Robot',
  editorHint:'Select mapped Home Assistant areas. The robot controls room order.',
  planningHint:'Select mapped Home Assistant areas. The robot controls room order.',
  roomStartMessage:'Sending area cleaning request …',
  infoTabs:[], supportsIntegrationIcon:false, supportsRoomSettings:false, supportsSessionMap:false, supportsZoneEditor:false,
  statusBarItems:[['battery','Battery and charging']],
  supports, vacuumEntries, discover, roomContext, roomPlanningState, planningSettings, sendRoomDraft,
  roomPresentation:() => ({fields:[]}), roomSelectionState:() => 'off', hasRoomList:() => true,
  defaultEntity:hass => vacuumEntries(Object.values(hass?.entities ?? {}),hass)[0]?.entity_id ?? '',
  startBlockReason, canControl, controlCleaning, cleaningView, batteryStatus,
  robotTelemetry:(hass,entity) => ({state:hass?.states?.[entity]?.state, available:hass?.connected !== false && available(hass?.states?.[entity]),
    name:hass?.states?.[entity]?.attributes?.friendly_name, cleaning:hass?.connected !== false && hass?.states?.[entity]?.state === 'cleaning'}),
  activityStatus:(hass,entity,pendingStart) => {
    if (hass?.connected === false || !available(hass?.states?.[entity])) return {text:'Robot unavailable',icon:'mdi:alert-circle-outline'};
    const view = cleaningView(hass,entity,pendingStart);
    return view.active ? {text:view.title,icon:'mdi:robot-vacuum'} : null;
  },
  dockBusy:() => false, dockBlocksStart:() => false, dockActivity:() => null,
  dryingRemainingTime:() => null, dryingRemainingPercent:() => null,
  consumableStatus:() => [], stationSettings:() => [], stationActions:() => [], robotSettings:() => [],
  changeStationSetting:unsupported, pressStationAction:unsupported, changeRobotSetting:unsupported,
  cameraEntries:() => [], trustedCamera:() => false, mapId:() => undefined, mapPicture:() => undefined, mapCalibration:() => undefined,
  supportsZoneDevice:() => false, zoneDeviceOptions:() => ({}), zoneReady:() => false, startZone:unsupported,
  scheduleState:() => ({supported:false}),
});
})();


const integrationAdapters = [spotScrubAdapter, hassDysonAdapter, haRoomsAdapter];

function getIntegrationAdapter(config = {}, registry = [], hass) {
  const explicit = integrationAdapters.find(a => a.id === config?.integration);
  if (explicit) return explicit;
  // The configured robot wins over priority, even when its live state is offline.
  const entry = registry.find(e => e.entity_id === config?.entity)
    ?? Object.values(hass?.entities ?? {}).find(e => e.entity_id === config?.entity);
  const specialized = integrationAdapters.find(a => a.id === entry?.platform);
  if (specialized) return specialized;
  // Keep a configured foreign robot on the generic adapter even while offline
  // or after losing a capability; never reinterpret it as a Dyson.
  return entry || haRoomsAdapter.supports(hass, config?.entity) ? haRoomsAdapter : spotScrubAdapter;
}

function integrationVacuumEntries(config = {}, registry = [], hass) {
  const adapters = config.integration && config.integration !== 'auto'
    ? integrationAdapters.filter(a => a.id === config.integration) : integrationAdapters;
  const seen = new Set();
  return adapters.flatMap(a => a.vacuumEntries(registry, hass)).filter(entry => {
    if (seen.has(entry.entity_id)) return false;
    seen.add(entry.entity_id); return true;
  });
}

function defaultIntegrationEntity(hass, config = {}, registry, registryLoaded = true) {
  const metadata = Object.values(hass?.entities ?? {});
  const choose = entries => entries.find(entry => entry.entity_id === config.entity)?.entity_id ?? entries[0]?.entity_id;
  const match = choose(integrationVacuumEntries(config, registry ?? metadata, hass));
  if (match) return match;
  if (!registryLoaded) return choose(integrationVacuumEntries(config, metadata, hass)) ?? '';
  // Explicit completed registries, including empty ones, are authoritative.
  // Only stub generation without a registry retains the legacy state fallback.
  return registry === undefined && (!config.integration || config.integration === 'auto' || config.integration === spotScrubAdapter.id)
    ? spotScrubAdapter.defaultEntity(hass) : '';
}



// Compatibility exports for existing consumers and regression tests.
// Card/editor/zone use the adapter directly; only Spot+Scrub is supported here.
const DOMAIN = spotScrubAdapter.id;
const roomContext = (...args) => spotScrubAdapter.roomContext(...args);
const discover = (...args) => spotScrubAdapter.discover(...args);
const batteryStatus = (...args) => spotScrubAdapter.batteryStatus(...args);
const sendRoomDraft = (...args) => spotScrubAdapter.sendRoomDraft(...args);
const dockBusy = (...args) => spotScrubAdapter.dockBusy(...args);
const dockBlocksStart = (...args) => spotScrubAdapter.dockBlocksStart(...args);
const startBlockReason = (...args) => spotScrubAdapter.startBlockReason(...args);
const activityStatus = (...args) => spotScrubAdapter.activityStatus(...args);
const cleaningView = (...args) => spotScrubAdapter.cleaningView(...args);
const dryingRemainingTime = (...args) => spotScrubAdapter.dryingRemainingTime(...args);
const dryingRemainingPercent = (...args) => spotScrubAdapter.dryingRemainingPercent(...args);
const canControl = (...args) => spotScrubAdapter.canControl(...args);
const controlCleaning = (...args) => spotScrubAdapter.controlCleaning(...args);
const CONSUMABLES = spotScrubAdapter.CONSUMABLES;
const consumableStatus = (...args) => spotScrubAdapter.consumableStatus(...args);
const ROBOT_FIELDS = spotScrubAdapter.ROBOT_FIELDS;
const robotSettings = (...args) => spotScrubAdapter.robotSettings(...args);
const changeRobotSetting = (...args) => spotScrubAdapter.changeRobotSetting(...args);
const STATION_FIELDS = spotScrubAdapter.STATION_FIELDS;
const STATION_ACTIONS = spotScrubAdapter.STATION_ACTIONS;
const stationActions = (...args) => spotScrubAdapter.stationActions(...args);
const pressStationAction = (...args) => spotScrubAdapter.pressStationAction(...args);
const stationSettings = (...args) => spotScrubAdapter.stationSettings(...args);
const changeStationSetting = (...args) => spotScrubAdapter.changeStationSetting(...args);
const supportsZoneDevice = (...args) => spotScrubAdapter.supportsZoneDevice(...args);
const ZONE_CHOICES = spotScrubAdapter.ZONE_CHOICES;
const zoneDeviceOptions = (...args) => spotScrubAdapter.zoneDeviceOptions(...args);


// Compatibility facade; backend policy lives in the Spot+Scrub adapter.
const zoneCanStart = (...args) => spotScrubAdapter.zoneReady(...args);
const zoneSettingsPayload = (...args) => spotScrubAdapter.zoneSettingsPayload(...args);


// Owns image refresh independently from card rendering. No direct Dyson calls.
class DysonPlannerMap extends HTMLElement {
  constructor() {
    super(); this.language = 'en'; this.messageKey = 'Loading cleaning map …'; this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>
      :host{display:block;min-width:0}.viewport{position:relative;width:100%;aspect-ratio:4/3;overflow:hidden;background:var(--secondary-background-color,#f5f7f9);isolation:isolate}
      img{position:absolute;left:50%;top:50%;max-width:none;max-height:none;transform-origin:center;visibility:hidden}.placeholder{position:absolute;inset:0;display:grid;place-items:center;padding:16px;text-align:center;color:var(--secondary-text-color,#52616e);font:13px/1.5 Arial,sans-serif}
      .caption{display:none;margin:8px 0 0;padding:0 var(--dp-padding,24px);color:var(--secondary-text-color,#52616e);font:12px/1.5 Arial,sans-serif}.caption:empty{display:none}[hidden]{display:none}
      </style><div class="viewport"><img alt="Live cleaning map"><div class="placeholder">Loading cleaning map …</div></div><p class="caption" role="status" aria-live="polite"></p>`;
    this.img = this.shadowRoot.querySelector('img');
    this.viewport = this.shadowRoot.querySelector('.viewport');
    this.placeholder = this.shadowRoot.querySelector('.placeholder');
    this.caption = this.shadowRoot.querySelector('.caption');
    this.inView = false;
    this.visibilityChanged = () => this.schedule();
  }
  connectedCallback() {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.viewport);
    this.intersectionObserver = new IntersectionObserver(entries => {
      this.inView = entries.some(e => e.isIntersecting);
      this.schedule();
    });
    this.intersectionObserver.observe(this);
    document.addEventListener('visibilitychange', this.visibilityChanged);
  }
  disconnectedCallback() {
    this.cancel(); this.resizeObserver?.disconnect(); this.intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.visibilityChanged);
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = undefined; this.img.removeAttribute('src'); this.img.style.visibility = 'hidden';
  }
  setOptions(hass, entity, rotation, live, language = 'en', adapter = getIntegrationAdapter()) {
    const adapterChanged = this.adapter && this.adapter !== adapter;
    this.adapter = adapter;
    this.language = language;
    this.img.alt = translate(language, 'Live cleaning map');
    if (this.messageKey) this.showMessage(this.messageKey);
    if (adapterChanged || this.entity !== entity || this.hass?.connection !== hass.connection) {
      this.cancel();
      if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined; this.img.removeAttribute('src'); this.img.style.visibility = 'hidden';
      this.imageWidth = undefined; this.imageHeight = undefined;
      this.lastAttempt = 0; this.placeholder.hidden = false;
    }
    this.hass = hass; this.entity = entity; this.rotation = rotation; this.live = live;
    this.resize(); this.schedule();
  }
  cancel() {
    clearTimeout(this.timer); this.timer = undefined;
    this.abortController?.abort(); this.abortController = undefined;
  }
  schedule() {
    clearTimeout(this.timer); this.timer = undefined;
    if (!this.isConnected || !this.inView || document.hidden) { this.cancel(); return; }
    if (!this.live) { this.cancel(); this.showMessage('Waiting for an active robot status.'); return; }
    if (!this.entity || !available(this.hass?.states?.[this.entity])) {
      this.cancel();
      this.showMessage(this.entity ? 'Camera unavailable.' : 'No map camera found. Select one in the card editor.');
      return;
    }
    if (this.abortController) return;
    const delay = Math.max(0, 5000 - (Date.now() - (this.lastAttempt ?? 0)));
    this.timer = setTimeout(() => this.refresh(), delay);
  }
  showMessage(key) {
    this.messageKey = key;
    const message = translate(this.language, key);
    this.placeholder.hidden = !!this.objectUrl;
    this.placeholder.textContent = message;
    this.caption.textContent = this.objectUrl ? translate(this.language, '{message} Showing the last received image.', { message }) : message;
    this.headerMessage = this.caption.textContent;
    this.dispatchEvent(new CustomEvent('planner-notice', { bubbles: true, composed: true }));
  }
  async refresh() {
    if (!this.isConnected || !this.inView || document.hidden || !this.live) return;
    const picture = this.adapter.mapPicture(this.hass, this.entity);
    this.lastAttempt = Date.now();
    // Use the HA-provided proxy path/token; never save or log tokens in config.
    if (!this.adapter.mapPictureAllowed(picture)) {
      this.showMessage('The camera image is not available yet.'); this.schedule(); return;
    }
    const url = new URL(this.hass.hassUrl ? this.hass.hassUrl(picture) : picture, location.href);
    url.searchParams.set('_planner', String(this.lastAttempt));
    const controller = new AbortController(); this.abortController = controller;
    const timeout = setTimeout(() => controller.abort(), 10000);
    let objectUrl;
    try {
      const response = await fetch(url, { signal: controller.signal, cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Image request failed');
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) throw new Error('Invalid camera image');
      objectUrl = URL.createObjectURL(blob);
      const image = new Image(); image.src = objectUrl; await image.decode();
      if (controller !== this.abortController || controller.signal.aborted || !this.isConnected) return;
      const previous = this.objectUrl;
      this.objectUrl = objectUrl; objectUrl = undefined;
      this.imageWidth = image.naturalWidth; this.imageHeight = image.naturalHeight;
      this.img.src = this.objectUrl; this.img.style.visibility = 'visible';
      this.placeholder.hidden = true; this.resize();
      this.caption.textContent = ''; this.messageKey = null; this.headerMessage = '';
      this.dispatchEvent(new CustomEvent('planner-notice', { bubbles: true, composed: true }));
      if (previous) URL.revokeObjectURL(previous);
    } catch {
      if (controller === this.abortController) this.showMessage('Map update unavailable.');
    } finally {
      clearTimeout(timeout);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (controller === this.abortController) { this.abortController = undefined; this.schedule(); }
    }
  }
  resize() {
    const size = fitMap(this.imageWidth, this.imageHeight, this.viewport.getBoundingClientRect().width, this.rotation);
    // The card sets the width; the complete rotated image determines the height.
    // The CSS aspect ratio is only a placeholder until the first image arrives.
    this.viewport.style.height = size.frameHeight > 0 ? `${size.frameHeight}px` : '';
    this.img.style.width = `${size.width}px`; this.img.style.height = `${size.height}px`;
    this.img.style.transform = `translate(-50%, -50%) rotate(${this.rotation ?? 0}deg)`;
  }
}
if (!customElements.get('dyson-planner-map')) customElements.define('dyson-planner-map', DysonPlannerMap);


// Owns the frozen image and pointer interaction. HA updates never replace its DOM.
class DysonPlannerZone extends HTMLElement {
  get adapter() { return this.integrationAdapter ?? getIntegrationAdapter(); }
  constructor() {
    super(); this.attachShadow({ mode: 'open' }); this.language = 'en'; this.strategy = 'auto'; this.mode = 'vacuum'; this.water = 'low'; this.passes = 1;
    this.shadowRoot.innerHTML = `<style>
      :host{display:block;color:var(--primary-text-color);font:inherit}*{box-sizing:border-box}
      .intro,.toolbar,.message,.actions{margin:12px var(--dp-padding,20px)}
      .intro,.message{font-size:13px;color:var(--dp-muted);line-height:1.5}.message{min-height:20px}
      .toolbar,.actions{display:flex;gap:8px;flex-wrap:wrap}.actions{padding-bottom:14px}
      button{font:inherit;color:inherit;border:1px solid var(--dp-line);border-radius:12px;padding:8px 12px;min-height:44px;background:var(--dp-modern-surface,var(--dp-bg));cursor:pointer}
      button:disabled{opacity:.45;cursor:default}button:focus-visible{outline:2px solid var(--dp-accent);outline-offset:2px}
      .start{background:var(--dp-accent);color:var(--text-primary-color,#fff);flex:1}.back{flex:1}
      .map-frame{padding:20px;overflow:visible}svg{display:block;width:100%;height:auto;background:var(--dp-bg);overflow:visible}
      .area{fill:color-mix(in srgb,var(--dp-accent) 22%,transparent);stroke:var(--dp-accent);stroke-width:2;vector-effect:non-scaling-stroke;cursor:move;touch-action:none}
      .handle-hit{fill:transparent;cursor:nwse-resize;touch-action:none}.handle{pointer-events:none;filter:drop-shadow(0 1px 2px #0006);fill:var(--dp-accent);stroke:white;stroke-width:2;vector-effect:non-scaling-stroke;cursor:nwse-resize;touch-action:none}
      [tabindex]:focus{outline:none;stroke:white;stroke-width:3}.hint{fill:none;pointer-events:none;font:22px sans-serif}
      .settings-overlay{position:absolute;inset:0;z-index:5;background:#0005;padding:12px;display:flex;align-items:flex-start}
      .settings-panel{width:100%;max-height:min(100%,75vh);overflow-y:auto;overscroll-behavior:contain;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:14px;padding:18px;box-shadow:0 8px 30px #0003}
      .settings-panel header{display:flex;align-items:stretch;gap:8px;margin-bottom:20px}.settings-panel h3{flex:1;margin:0;align-self:center;font-size:16px;font-weight:500}
      .settings-panel [data-do=close-settings]{display:flex;align-items:center;justify-content:center;flex:0 0 42px;min-width:42px;padding:8px;min-height:42px;border-radius:9px;background:var(--dp-bg)}ha-icon{width:24px;height:24px}.settings-panel [data-do=close-settings] ha-icon{width:20px;height:20px;--mdc-icon-size:20px;flex-shrink:0}
      .settings-fields{padding:10px 14px;border:1px solid var(--dp-line);border-radius:14px;background:var(--dp-modern-surface,var(--dp-bg))}
      .settings-panel label{display:block;font-size:13px;color:var(--primary-text-color);margin:12px 0 4px}.settings-panel label:first-child{margin-top:0}
      .settings-panel select{width:100%;font:inherit;font-size:14px;min-height:34px;padding:6px 10px;border:1px solid var(--dp-modern-control-border,var(--dp-line));border-radius:9px;background:var(--dp-modern-control,var(--dp-bg));color:var(--dp-accent)}
      .unavailable{opacity:.5}.settings-note{font-size:12px;color:var(--dp-muted);margin:6px 0 10px}
      .segments{background:var(--dp-modern-control,var(--dp-bg));border-color:var(--dp-modern-control-border,var(--dp-line))}
      .actions{margin:14px var(--dp-padding,20px) 0;padding:12px 0 14px;border-top:1px solid var(--dp-line);gap:10px;flex-wrap:nowrap}
      .actions{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.secondary-actions{display:flex;gap:8px;min-width:0}.actions .reload{flex:0 0 38px;padding:6px;display:flex;align-items:center;justify-content:center}.actions button{flex:1;min-width:0;min-height:38px;padding:6px 12px;border-radius:13px;font-size:13px}.back{background:var(--dp-modern-surface,var(--dp-bg))}
.stepped-slider{position:relative;height:24px}
.slider-ticks{position:absolute;inset:0 10px;pointer-events:none;color:var(--dp-muted)}
.slider-ticks::before{content:"";position:absolute;left:0;right:0;top:10.5px;height:3px;border-radius:2px;background:currentColor;opacity:.65}
.slider-tick{position:absolute;left:calc(var(--stop)*100%);top:12px;transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:currentColor}
.stepped-slider input[type=range]{position:relative;z-index:1;display:block;appearance:none;-webkit-appearance:none;width:100%;height:24px;margin:0;padding:0;border:0;background:transparent;cursor:pointer}
.stepped-slider input::-webkit-slider-runnable-track{height:3px;background:transparent;border:0}
.stepped-slider input::-moz-range-track{height:3px;background:transparent;border:0}
.stepped-slider input::-moz-range-progress{background:transparent}
.stepped-slider input::-webkit-slider-thumb{-webkit-appearance:none;box-sizing:border-box;width:20px;height:20px;margin-top:-8.5px;border:3px solid #f4fbfd;border-radius:50%;background:var(--dp-accent);box-shadow:0 1px 3px #0003}
.stepped-slider input::-moz-range-thumb{box-sizing:border-box;width:20px;height:20px;border:3px solid #f4fbfd;border-radius:50%;background:var(--dp-accent);box-shadow:0 1px 3px #0003}
.stepped-slider.disabled{opacity:.45}
.stepped-slider input:disabled{cursor:default}
.slider-options{position:relative;min-height:28px;margin:0 10px}.slider-options button{position:absolute;left:calc(var(--stop)*100%);transform:translateX(-50%);width:30%}.slider-options button:first-child{left:-10px;transform:none;text-align:left;padding-left:0}.slider-options button:last-child{left:calc(100% + 10px);transform:translateX(-100%);text-align:right;padding-right:0}
.slider-options button{border:0;background:transparent;padding:2px 2px;min-height:28px;font-size:12px;color:var(--dp-muted);overflow-wrap:anywhere}
.slider-options button[aria-pressed=true]{color:var(--dp-accent);font-weight:650}
.segments{display:flex;gap:3px;padding:3px;border:1px solid var(--dp-line);border-radius:12px}
.segments button{flex:1;min-width:0;min-height:32px;border:0;background:transparent;padding:3px 8px;position:relative}
.segments button::after{content:"";position:absolute;inset:-6px 0}
.segments button[aria-pressed=true]{background:var(--dp-accent);color:var(--text-primary-color,#fff)}
      .zone-settings-open{display:flex;align-items:center;justify-content:space-between;gap:6px;text-align:left}.zone-mode-label{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.zone-settings-open ha-icon{display:flex;align-items:center;justify-content:center;line-height:0;align-self:center;flex:0 0 15px;width:15px;height:15px;--mdc-icon-size:15px}
      [hidden]{display:none!important}
    </style>
    <div class="map-frame"><svg hidden aria-label="Zone selection"><image/><rect class="area" tabindex="0" role="button"/><g class="zone-size" pointer-events="none"><rect fill="#10252de6"/><text fill="white" dominant-baseline="central" text-anchor="middle"></text></g><circle class="handle-hit" tabindex="0" role="button"/><circle class="handle"/><path class="hint" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M-5 -5 L5 5 M0 5 H5 V0 M-5 0 V-5 H0"/></svg></div>
    <div class="actions"><div class="secondary-actions"><button class="reload" data-do="refresh"><ha-icon icon="mdi:reload" aria-hidden="true"></ha-icon></button><button class="zone-settings-open" data-do="settings" aria-haspopup="dialog"><span class="zone-mode-label"></span><ha-icon icon="mdi:cog" aria-hidden="true"></ha-icon></button></div><button class="start" data-do="start"></button></div>
    <div class="settings-overlay" hidden><section class="settings-panel" role="dialog" aria-modal="true" aria-labelledby="zone-settings-title"><header><h3 id="zone-settings-title" data-i18n="Settings"></h3><button data-do="close-settings" aria-label="Close"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></header><div class="settings-fields">
      <label for="zone-mode" data-i18n="Cleaning mode"></label><select id="zone-mode"><option value="vacuum" data-i18n="Vacuum"></option><option value="vacuumAndMop" data-i18n="Vacuum and Mop"></option><option value="mop" data-i18n="Mop"></option><option value="vacuumThenMop" data-i18n="Vacuum then Mop"></option></select>
      <div class="power-setting">
      <label for="zone-power" data-i18n="Vacuum Power"></label><div class="stepped-slider"><div class="slider-ticks" aria-hidden="true">${[0,1,2,3].map(i=>`<span class="slider-tick" style="--stop:${i/3}"></span>`).join('')}</div><input id="zone-power" class="zone-power" type="range" min="0" max="3" step="1" value="0"></div>
      <div class="slider-options">${['Auto','Boost','Quiet','Quick'].map((name,i)=>`<button type="button" data-power="${i}" style="--stop:${i/3}" data-i18n="${name}"></button>`).join('')}</div>
      </div><div class="water-setting"><label for="zone-water" data-i18n="Water level"></label>
      <div class="stepped-slider"><div class="slider-ticks" aria-hidden="true">${[0,1,2,3].map(i=>`<span class="slider-tick" style="--stop:${i/3}"></span>`).join('')}</div><input id="zone-water" type="range" min="0" max="3" step="1" value="1"></div>
      <div class="slider-options">${['Very Low','Low','Medium','High'].map((name,i)=>`<button type="button" data-water="${i}" style="--stop:${i/3}" data-i18n="${name}"></button>`).join('')}</div></div>
      <label class="repetitions-label"></label><div class="segments"><button type="button" data-passes="1" aria-pressed="true">1×</button><button type="button" data-passes="2" aria-pressed="false">2×</button></div>
      <p class="settings-note" data-i18n="Settings are sent only when you start the zone clean."></p>
    </div></section></div>`;
    this.dialog = this.shadowRoot.querySelector('.settings-overlay');
    this.dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); this.closeSettings(); }
      if (event.key === 'Tab') {
        const items=[...this.dialog.querySelectorAll('button:not(:disabled),select:not(:disabled),input:not(:disabled)')]
          .filter(el => el.tabIndex >= 0 && !el.closest('[hidden], [inert]') && el.getClientRects().length
            && getComputedStyle(el).visibility === 'visible');
        const first=items[0],last=items.at(-1),active=this.shadowRoot.activeElement;
        if (event.shiftKey && active===first) { event.preventDefault(); last?.focus({preventScroll:true}); }
        else if (!event.shiftKey && active===last) { event.preventDefault(); first?.focus({preventScroll:true}); }
      }
    });
    this.shadowRoot.querySelector('.zone-power').addEventListener('input', event => {
      if (this.sending) return;
      this.strategy = this.capabilities.strategy.options[Number(event.target.value)]?.[1]; this.labels(); this.draw();
    });
    this.shadowRoot.querySelector('#zone-mode').addEventListener('change', event => {
      if (this.sending) return;
      this.mode=event.target.value; event.target.blur(); this.labels(); this.draw();
    });
    this.shadowRoot.querySelector('#zone-water').addEventListener('input', event => {
      if (this.sending) return;
      this.water=this.capabilities.water.options[Number(event.target.value)]?.[1]; this.labels(); this.draw();
    });
    this.svg = this.shadowRoot.querySelector('svg');
    this.image = this.shadowRoot.querySelector('image');
    this.area = this.shadowRoot.querySelector('.area');
    this.handle = this.shadowRoot.querySelector('.handle-hit');
    this.handleVisual = this.shadowRoot.querySelector('.handle');
    this.hint = this.shadowRoot.querySelector('.hint');
    this.shadowRoot.addEventListener('click', event => {
      if (event.target === this.dialog) { this.closeSettings(); return; }
      const power = event.target.closest('[data-power]');
      if (power && !power.disabled && !this.sending) { this.shadowRoot.querySelector('.zone-power').value=power.dataset.power; this.strategy=this.capabilities.strategy.options[Number(power.dataset.power)]?.[1]; this.labels(); this.draw(); return; }
      const water=event.target.closest('[data-water]'), passes=event.target.closest('[data-passes]');
      if (water && !water.disabled && !this.sending) { this.water=this.capabilities.water.options[Number(water.dataset.water)]?.[1]; this.labels(); this.draw(); return; }
      if (passes && !passes.disabled && !this.sending) { this.passes=Number(passes.dataset.passes); this.labels(); this.draw(); return; }
      const action = event.target.closest('button')?.dataset.do;
      if (!action || event.target.closest('button').disabled) return;
      if (action === 'refresh') this.load();
      if (action === 'settings') { this.dialog.hidden=false; this.shadowRoot.querySelector('[data-do="close-settings"]').focus({preventScroll:true}); }
      if (action === 'close-settings') this.closeSettings();
      if (action === 'start') this.start();
    });
    this.svg.addEventListener('pointerdown', event => this.pointerDown(event));
    this.svg.addEventListener('pointermove', event => this.pointerMove(event));
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) this.svg.addEventListener(name, () => { this.drag = null; });
    this.svg.addEventListener('keydown', event => {
      if (!this.rect || this.sending || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const step = event.shiftKey ? .05 : .01;
      this.adjust(this.rect, event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0,
        event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0, event.target === this.handle);
    });
  }
  snapshot() {
    return { strategy:this.strategy, mode:this.mode, water:this.water, passes:this.passes, calibration:this.calibration, rect:this.rect ? [...this.rect] : null,
      vacuum:this.vacuum, camera:this.camera, rotation:this.rotation };
  }
  closeSettings() {
    this.dialog.hidden=true;
    this.shadowRoot.querySelector('[data-do="settings"]').focus({preventScroll:true});
  }
  connectedCallback() { this.observer = new ResizeObserver(() => this.draw()); this.observer.observe(this); }
  disconnectedCallback() {
    this.controller?.abort(); this.observer?.disconnect(); this.drag = null;
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = null; this.calibration = null;
  }
  setOptions(options) {
    const changed = this.vacuum !== options.vacuum || this.camera !== options.camera || this.rotation !== options.rotation
      || this.hass?.connection !== options.hass.connection;
    const { adapter, ...viewOptions } = options;
    this.integrationAdapter = adapter;
    Object.assign(this, viewOptions);
    if (changed) {
      this.controller?.abort(); this.attempted = false; this.clear();
      const saved=options.draft;
      this.restoreDraft=saved?.vacuum===this.vacuum && saved?.camera===this.camera && saved?.rotation===this.rotation ? saved : null;
      this.strategy=this.restoreDraft?.strategy || 'auto';
      this.mode=this.restoreDraft?.mode || 'vacuum'; this.water=this.restoreDraft?.water || 'low'; this.passes=this.restoreDraft?.passes || 1;
      this.shadowRoot.querySelector('.zone-power').value=['auto','boost','quiet','quick'].indexOf(this.strategy);
      this._labelsLanguage=null;
    }
    if (this.calibration && String(this.adapter.mapId(this.hass, this.vacuum)) !== this.calibration.map_id) {
      this.controller?.abort(); this.clear(); this.note = 'The active map changed. Reload the map and select a new zone.';
    }
    const capabilitiesKey = JSON.stringify(this.capabilities);
    if (this._labelsLanguage !== this.language || this._capabilitiesKey !== capabilitiesKey) {
      this.labels(); this._labelsLanguage = this.language; this._capabilitiesKey = capabilitiesKey;
    }
    this.draw();
    if (!this.attempted && this.trusted && this.camera) this.load();
  }
  t(key) { return translate(this.language, key); }
  labels() {

    for (const el of this.shadowRoot.querySelectorAll('[data-i18n]')) el.textContent = this.t(el.dataset.i18n);
    this.shadowRoot.querySelector('[data-do="close-settings"]').setAttribute('aria-label',this.t('Close'));
    const caps = this.capabilities;
    if (!caps) return;
    for (const key of ['mode','strategy','water','passes']) {
      const options = caps[key].options;
      if (options.length && !options.some(([,value]) => value === this[key])) this[key] = options[0][1];
    }
    const put = (element, html) => { if (element._optionsHtml !== html) { element.innerHTML=html; element._optionsHtml=html; } };
    const modeSelect = this.shadowRoot.querySelector('#zone-mode');
    put(modeSelect, caps.mode.options.map(([label,value]) => `<option value="${value}">${escapeHtml(this.t(label))}</option>`).join('') || `<option>${escapeHtml(this.t('Unavailable'))}</option>`);
    modeSelect.value=this.mode;
    modeSelect.disabled=!!this.sending || !caps.mode.available;
    modeSelect.hidden=!caps.mode.supported;
    this.shadowRoot.querySelector('[for=zone-mode]').hidden=!caps.mode.supported;
    for (const [key, selector, attr] of [['strategy','.power-setting','power'],['water','.water-setting','water']]) {
      const group=this.shadowRoot.querySelector(selector), cap=caps[key], options=cap.options;
      group.hidden=!cap.supported || (key==='strategy' ? this.mode==='mop' : this.mode==='vacuum');
      const stops=options.map((_,i)=>options.length>1?i/(options.length-1):0);
      put(group.querySelector('.slider-ticks'), stops.map(stop=>`<span class="slider-tick" style="--stop:${stop}"></span>`).join(''));
      put(group.querySelector('.slider-options'), options.map(([label],i)=>`<button type="button" data-${attr}="${i}" style="--stop:${stops[i]}">${escapeHtml(this.t(label))}</button>`).join(''));
      const index=options.findIndex(([,value])=>value===this[key]), slider=group.querySelector('input');
      slider.max=Math.max(0,options.length-1); slider.value=Math.max(0,index);
      slider.disabled=!!this.sending || !cap.available || options.length<2;
      slider.setAttribute('aria-valuetext',this.t(options[index]?.[0] ?? 'Unavailable'));
      group.querySelector('.stepped-slider').classList.toggle('disabled',slider.disabled);
      for (const button of group.querySelectorAll('button')) {
        button.disabled=!!this.sending || !cap.available;
        button.setAttribute('aria-pressed',String(Number(button.dataset[attr])===index));
      }
    }
    const label=this.shadowRoot.querySelector('.repetitions-label'), segments=this.shadowRoot.querySelector('.segments');
    label.hidden=segments.hidden=!caps.passes.supported;
    label.textContent=this.t(this.mode==='vacuumThenMop'?'Mop repetitions':'Clean repetitions');
    for (const button of segments.querySelectorAll('[data-passes]')) {
      button.hidden=!caps.passes.options.some(([,value])=>value===Number(button.dataset.passes));
      button.disabled=!!this.sending || !caps.passes.available;
      button.setAttribute('aria-pressed',String(Number(button.dataset.passes)===this.passes));
    }
    for (const [action, label] of Object.entries({start:'Start clean'})) {
      this.shadowRoot.querySelector(`[data-do="${action}"]`).textContent = this.t(label);
    }
    this.shadowRoot.querySelector('[data-do="refresh"]').setAttribute('aria-label',this.t('Reload map'));
    this.shadowRoot.querySelector('[data-do="refresh"]').title=this.t('Reload map');
    const modeLabel=this.t({vacuum:'Vacuum',vacuumAndMop:'Vacuum and Mop',mop:'Mop',vacuumThenMop:'Vacuum then Mop'}[this.mode]);
    this.shadowRoot.querySelector('.zone-mode-label').textContent=modeLabel;
    const settingsButton=this.shadowRoot.querySelector('[data-do="settings"]');
    settingsButton.setAttribute('aria-label',`${modeLabel} – ${this.t('Settings')}`);
    settingsButton.title=`${modeLabel} – ${this.t('Settings')}`;
    this.svg.setAttribute('aria-label', this.t('Zone selection'));
    this.area.setAttribute('aria-label', this.t('Move zone. Use the arrow keys.'));
    this.handle.setAttribute('aria-label', this.t('Resize zone. Use the arrow keys.'));
  }
  clear() {
    this.calibration = null; this.rect = null; this.drag = null;
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = null; this.image.removeAttribute('href');
  }
  async load() {
    if (this.sending) return;
    const previous = this.calibration && this.rect ? { calibration: this.calibration, rect: [...this.rect] } : this.restoreDraft;
    this.restoreDraft = null;
    this.controller?.abort(); this.clear(); this.attempted = true;
    const controller = new AbortController(); this.controller = controller;
    const timeout = setTimeout(() => controller.abort(), 12000);
    this.note = 'Loading calibrated map …'; this.draw();
    let objectUrl;
    try {
      if (!this.trusted) throw new Error('Camera must belong to the selected robot.');
      // A camera GET may publish its calibration after the image response arrives.
      // Retry reads only; a cleaning command is never retried automatically.
      for (let attempt = 0; attempt < 3; attempt++) {
        const picture = this.adapter.mapPicture(this.hass, this.camera);
        if (typeof picture !== 'string' || !picture.startsWith('/api/camera_proxy/')) throw new Error('Camera image unavailable.');
        const url = new URL(this.hass.hassUrl ? this.hass.hassUrl(picture) : picture, location.href);
        // Never request a resized proxy image: calibration hashes original bytes.
        url.searchParams.delete('width'); url.searchParams.delete('height');
        url.searchParams.set('_zone', String(Date.now()));
        const response = await fetch(url, { signal: controller.signal, cache: 'no-store', credentials: 'same-origin' });
        if (!response.ok) throw new Error('Camera image unavailable.');
        const blob = await response.blob();
        if (blob.size > 20 * 1024 * 1024) throw new Error('A calibrated PNG image is required.');
        const bytes = new Uint8Array(await blob.arrayBuffer());
        // HA cameras may retain their default JPEG content type for PNG bytes.
        if (![137,80,78,71,13,10,26,10].every((v,i) => bytes[i] === v)) throw new Error('A calibrated PNG image is required.');
        const hash = globalThis.crypto?.subtle
          ? [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(v => v.toString(16).padStart(2,'0')).join('')
          : zoneSha256(bytes);
        for (let poll = 0; poll < 8; poll++) {
          if (controller.signal.aborted || this.controller !== controller || !this.isConnected) return;
          const c = this.adapter.mapCalibration(this.hass, this.camera);
          if (validZoneCalibration(c) && c.image_sha256 === hash
              && String(this.adapter.mapId(this.hass, this.vacuum)) === String(c.map_id)) {
            objectUrl = URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
            const img = new Image(); img.src = objectUrl; await img.decode();
            if (controller.signal.aborted || this.controller !== controller || !this.isConnected) return;
            if (img.naturalWidth !== c.image_width || img.naturalHeight !== c.image_height) throw new Error('Image and calibration do not match. Reload the map.');
            this.calibration = structuredClone(c); this.calibration.map_id = String(c.map_id);
            this.objectUrl = objectUrl; objectUrl = null; this.image.setAttribute('href', this.objectUrl);
            const sameTransform = previous?.calibration && previous.rect && ['version','map_id','units','image_width','image_height','pixels_per_metre','padding','min_x','max_y']
              .every(key => String(previous.calibration[key]) === String(c[key]));
            this.rect = fitZoneMinimum(sameTransform ? previous.rect : [.3,.3,.7,.7], this.calibration, this.rotation);
            this.note = ''; return;
          }
          await new Promise(resolve => setTimeout(resolve, 150));
        }
      }
      throw new Error('Image and calibration do not match. Reload the map.');
    } catch (error) {
      if (this.controller === controller) this.note = controller.signal.aborted ? 'Map loading timed out. Reload the map.' : error.message;
    } finally {
      clearTimeout(timeout);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (this.controller === controller) { this.controller = null; this.draw(); }
    }
  }
  draw() {
    if (!this.svg) return;
    const c = this.calibration, rotated = this.rotation === 90 || this.rotation === 270;
    if (c && this.rect) this.rect = fitZoneMinimum(this.rect, c, this.rotation);
    // Safari can scroll a focused SVG back into view when its geometry is
    // rewritten. HA telemetry must not touch the frozen selection's DOM.
    const lengthUnit = this.dimensionUnit === 'inch' ? 'in' : this.dimensionUnit === 'cm' ? 'cm' : this.hass?.config?.unit_system?.length;
    const geometry = JSON.stringify([c, this.rotation, this.rect, this.svg.getBoundingClientRect().width, lengthUnit, this.dimensionUnit]);
    const geometryChanged = geometry !== this._geometry;
    this._geometry = geometry;
    if (geometryChanged) {
      this.svg.toggleAttribute('hidden', !c);
      if (c) {
        this.width = rotated ? c.image_height : c.image_width; this.height = rotated ? c.image_width : c.image_height;
        this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
        this.image.setAttribute('width', c.image_width); this.image.setAttribute('height', c.image_height);
        const transform = this.rotation === 90 ? `translate(${c.image_height} 0) rotate(90)`
          : this.rotation === 180 ? `translate(${c.image_width} ${c.image_height}) rotate(180)`
          : this.rotation === 270 ? `translate(0 ${c.image_width}) rotate(270)` : '';
        this.image.setAttribute('transform', transform);
      }
      for (const el of [this.area,this.handle,this.handleVisual,this.hint,this.shadowRoot.querySelector('.zone-size')]) el.toggleAttribute('hidden', !this.rect);
      if (c && this.rect) {
        const [x,y,x2,y2] = this.rect;
        const scale=this.width/(this.svg.getBoundingClientRect().width || this.width);
        for (const [key,value] of Object.entries({ x:x*this.width,y:y*this.height,width:(x2-x)*this.width,height:(y2-y)*this.height })) this.area.setAttribute(key,value);
        for (const [el,radius] of [[this.handle,20],[this.handleVisual,13]]) {
          el.setAttribute('cx',x2*this.width); el.setAttribute('cy',y2*this.height); el.setAttribute('r',radius*scale);
        }
        this.hint.setAttribute('transform',`translate(${x2*this.width} ${y2*this.height}) scale(${scale})`);
        const label=this.shadowRoot.querySelector('.zone-size'), text=label.querySelector('text'), bg=label.querySelector('rect');
        const cmWidth=(x2-x)*this.width/c.pixels_per_metre*100;
        const cmHeight=(y2-y)*this.height/c.pixels_per_metre*100;
        const caption=zoneDimensionText(cmWidth,cmHeight,lengthUnit);
        text.textContent=caption; text.style.fontSize=`${12*scale}px`;
        const pillWidth=text.getComputedTextLength()+16*scale,pillHeight=24*scale;
        const [left,top]=zonePillPosition(this.rect,this.width,this.height,pillWidth,pillHeight,6*scale,14*scale);
        label.toggleAttribute('hidden', this.dimensionUnit === 'off');
        label.setAttribute('transform',`translate(${left} ${top})`);
        text.setAttribute('x',pillWidth/2); text.setAttribute('y',pillHeight/2);
        bg.setAttribute('width',pillWidth); bg.setAttribute('height',pillHeight); bg.setAttribute('rx',12*scale);
        this.area.setAttribute('aria-label',`${this.t('Move zone. Use the arrow keys.')} ${caption}`);
      }
    }
    const ready = this.settingsReady() && this.adapter.zoneReady(this.hass,this.vacuum,this.camera,c,this.trusted,this.preview);
    for (const action of ['settings','refresh','start']) {
      const button = this.shadowRoot.querySelector(`[data-do="${action}"]`);
      const disabled = !!this.sending
        || (action === 'start' && (!ready || !zoneHasMinimumSize(this.rect,c,this.rotation) || !!this.controller))
        || (action === 'refresh' && !!this.controller);
      if (button.disabled !== disabled) button.disabled = disabled;
    }
    const message = this.t(this.note || (!this.trusted ? 'Camera must belong to the selected robot.'
      : !c ? 'A calibrated map is required. Reload the map.' : !ready ? 'Zone start unavailable: check robot readiness, map and integration action.'
      : ''));
    if (this.headerMessage !== message) {
      this.headerMessage = message;
      this.dispatchEvent(new CustomEvent('planner-notice', { bubbles: true, composed: true }));
    }
  }
  point(event) {
    const p = new DOMPoint(event.clientX,event.clientY).matrixTransform(this.svg.getScreenCTM().inverse());
    return [p.x/this.width,p.y/this.height];
  }
  pointerDown(event) {
    if (!this.rect || this.sending || (event.pointerType === 'mouse' && event.button !== 0)
      || ![this.area,this.handle].includes(event.target)) return;
    event.preventDefault(); event.stopPropagation(); this.drag = { id:event.pointerId,start:this.point(event),rect:[...this.rect],resize:event.target === this.handle };
    this.svg.setPointerCapture(event.pointerId);
  }
  pointerMove(event) {
    if (!this.drag || this.drag.id !== event.pointerId) return;
    event.preventDefault(); const p = this.point(event);
    this.adjust(this.drag.rect,p[0]-this.drag.start[0],p[1]-this.drag.start[1],this.drag.resize);
  }
  adjust(rect,dx,dy,resize) {
    this.rect=adjustZone(rect,dx,dy,resize,zoneMinimumSize(this.calibration,this.rotation));
    this.draw();
  }
  settingsReady() {
    if (!this.supported || !this.capabilities) return false;
    const keys=['mode','passes', ...(this.mode==='mop'?[]:['strategy']), ...(this.mode==='vacuum'?[]:['water'])];
    return keys.every(key=>this.capabilities[key].available && this.capabilities[key].options.some(([,value])=>value===this[key]));
  }
  async start() {
    if (this.sending || !this.settingsReady() || !zoneHasMinimumSize(this.rect,this.calibration,this.rotation) || !this.adapter.zoneReady(this.hass,this.vacuum,this.camera,this.calibration,this.trusted,this.preview)) return;
    const dimensions = { widthCm:(this.rect[2]-this.rect[0])*this.width/this.calibration.pixels_per_metre*100,
      heightCm:(this.rect[3]-this.rect[1])*this.height/this.calibration.pixels_per_metre*100 };
    this.sending = true; this.labels(); this.note = 'Sending zone start …'; this.draw();
    try {
      await this.adapter.startZone(this.hass, { vacuum:this.vacuum, camera:this.camera, calibration:this.calibration, trusted:this.trusted, preview:this.preview, rect:this.rect, rotation:this.rotation, mode:this.mode, strategy:this.strategy, water:this.water, passes:this.passes });
      if (this.isConnected) this.dispatchEvent(new CustomEvent('zone-started',{detail:dimensions,bubbles:true,composed:true}));
    } catch (error) {
      if (this.isConnected) this.note = error.message || 'Zone start failed. Check the robot before retrying.';
    } finally { this.sending = false; if (this.isConnected) { this.labels(); this.draw(); } }
  }
}
if (!customElements.get('dyson-planner-zone')) customElements.define('dyson-planner-zone', DysonPlannerZone);


const weekdays = ['mon','tue','wed','thu','fri','sat','sun'];

// Treat schedule times as HA-local wall times, independently of the browser zone.
// At clock changes use compatible disambiguation: earlier overlap, forward gap.
// This predicts the nominal weekly plan, not the robot's execution/UTC-offset policy.
function nextScheduledClean(state, timeZone, now = Date.now()) {
  const result = {timestamp:null, id:null, knownOnly:state.inSync !== true, reason:'unknown'};
  if (!state.available || !Number.isFinite(now)) return {...result, reason:'unavailable'};
  let format;
  try {
    if (!timeZone) return {...result, reason:'timezone'};
    format = new Intl.DateTimeFormat('en-GB', {timeZone, calendar:'gregory', numberingSystem:'latn',
      year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23'});
  } catch { return {...result, reason:'timezone'}; }
  const wall = timestamp => {
    const parts = Object.fromEntries(format.formatToParts(timestamp).filter(part => part.type !== 'literal').map(part => [part.type,Number(part.value)]));
    return Date.UTC(parts.year,parts.month-1,parts.day,parts.hour,parts.minute,parts.second);
  };
  const local = new Date(wall(now));
  const today = Date.UTC(local.getUTCFullYear(),local.getUTCMonth(),local.getUTCDate());
  const enabled = state.schedules.filter(schedule => schedule.enabled);
  if (!enabled.length && !result.knownOnly) return {...result, reason:'inactive'};
  if (enabled.some(schedule => schedule.repeat !== true)) result.knownOnly = true;
  for (const schedule of enabled) {
    // One-time schedules expose no execution date through the normalized interface.
    if (schedule.repeat !== true || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(schedule.time) || !Array.isArray(schedule.days)) continue;
    const [hour,minute] = schedule.time.split(':').map(Number);
    for (let day = 0; day <= 7; day++) {
      const date = today + day*86400000;
      if (!schedule.days.includes(weekdays[(new Date(date).getUTCDay()+6)%7])) continue;
      const target = date + hour*3600000 + minute*60000;
      const offsets = new Set([-86400000,0,86400000].map(delta => wall(target+delta)-(target+delta)));
      const candidates = [...offsets].map(offset => ({timestamp:target-offset, local:wall(target-offset)}));
      const exact = candidates.filter(candidate => candidate.local === target).sort((a,b) => a.timestamp-b.timestamp);
      const after = candidates.filter(candidate => candidate.local > target).sort((a,b) => a.local-b.local);
      const timestamp = (exact[0] ?? after[0])?.timestamp;
      if (timestamp > now && (result.timestamp === null || timestamp < result.timestamp)) {
        result.timestamp = timestamp; result.id = schedule.id; result.reason = 'next';
      }
    }
  }
  return result;
}

function scheduleCountdownDuration(timestamp, now, language) {
  const minutes = Math.max(0,Math.ceil((timestamp-now)/60000));
  const unit = (value,name) => new Intl.NumberFormat(language,{style:'unit',unit:name,unitDisplay:'narrow'}).format(value);
  if (minutes <= 1) return `${timestamp-now < 60000 ? '< ' : ''}${unit(1,'minute')}`;
  if (minutes >= 1440) return `${unit(Math.floor(minutes/1440),'day')} ${unit(Math.floor(minutes%1440/60),'hour')}`;
  if (minutes >= 60) return `${unit(Math.floor(minutes/60),'hour')} ${unit(minutes%60,'minute')}`;
  return unit(minutes,'minute');
}

// A resolved service call is not yet a reflected HA state. Confirm only fields
// the selected adapter exposes, and do not guess which of several new entries is ours.
function scheduleRequestConfirmed(state, request) {
  if (!state.available) return false;
  if (request.kind === 'delete') return state.inSync !== false && !state.schedules.some(schedule => schedule.id === request.id);
  const matches = schedule => {
    if (request.enabled !== undefined && schedule.enabled !== request.enabled) return false;
    if (request.time !== undefined && schedule.time !== request.time) return false;
    if (request.days && weekdays.some(day => schedule.days.includes(day) !== request.days.includes(day))) return false;
    if (request.roomIds && (JSON.stringify(schedule.roomIds) !== JSON.stringify(request.roomIds) || schedule.mapId !== request.mapId)) return false;
    return Object.entries(request.roomSettings ?? {}).every(([id,settings]) =>
      Object.entries(settings).every(([key,value]) => schedule.roomSettings?.[id]?.[key] === value));
  };
  if (request.kind === 'create') return state.schedules.filter(schedule => !request.previousIds.includes(schedule.id) && matches(schedule)).length === 1;
  const schedule = state.schedules.find(schedule => schedule.id === request.id);
  return !!schedule && matches(schedule);
}
const scheduleStyles = `
.actions.with-schedules{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);flex-direction:row}
.room-secondary-actions{display:flex;gap:8px;min-width:0}.actions .schedule-create{flex:0 0 38px;padding:6px;display:flex;align-items:center;justify-content:center}
.room-secondary-actions button{min-width:0}.schedule-create ha-icon{--mdc-icon-size:22px}
.schedules{padding:8px var(--dp-padding,24px) 18px;container:dyson-schedules / inline-size}
.schedule-countdown{margin:0 0 6px;font-size:12px;line-height:1.4;color:var(--dp-muted);font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.schedule-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:18px 14px 18px 20px;border:1px solid var(--dp-line);border-radius:18px;background:var(--dp-modern-surface,var(--dp-soft));flex-shrink:0;min-width:0;box-sizing:border-box;container:dyson-schedule-row / inline-size}
.schedule-copy{min-width:0;container:dyson-schedule-copy / inline-size}.schedule-main{display:flex;align-items:center;gap:16px;min-width:0}
.schedule-time-value{font-size:30px;font-weight:700;line-height:1.2;font-variant-numeric:tabular-nums;letter-spacing:-.6px;white-space:nowrap;padding-right:16px;border-right:1px solid var(--dp-line)}
.schedule-weekdays{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;flex:1;width:100%;max-width:316px;min-width:0}
.schedule-day{display:flex;align-items:center;justify-content:center;min-height:32px;min-width:0;padding:2px;border:1px solid var(--dp-line);border-radius:8px;font-size:13px;white-space:nowrap;color:var(--dp-muted);box-sizing:border-box}
.schedule-day.selected{background:color-mix(in srgb,var(--dp-muted) 38%,var(--dp-bg));color:var(--dp-text)}
.schedule-row.enabled .schedule-day.selected{background:var(--dp-accent);border-color:var(--dp-accent);color:var(--text-primary-color,#fff)}
.schedule-room-selection{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin:12px 0 0;padding:0;font-size:13px;color:var(--dp-muted);overflow-wrap:anywhere}
.schedule-room-chip{display:inline-flex;align-items:center;gap:7px;max-width:100%;padding:4px 9px;border:1px solid var(--dp-line);border-radius:9px;background:color-mix(in srgb,var(--dp-muted) 8%,transparent);color:var(--dp-text);box-sizing:border-box}
.schedule-room-chip::before{content:'';width:9px;height:9px;flex:none;border-radius:50%;background:var(--room-color)}
.schedule-room-chip span{min-width:0;overflow-wrap:anywhere}
.schedule-controls{display:flex;align-items:center;gap:1px;flex-shrink:0}.schedule-toggle-target{position:relative;display:flex;align-items:center;justify-content:center;min-width:48px;min-height:44px;cursor:pointer}
.schedule-row .schedule-toggle-target.pending input[type=checkbox]{opacity:0}.schedule-toggle-spinner{position:absolute;width:19px;height:19px;border:2px solid var(--dp-line);border-top-color:var(--dp-accent);border-radius:50%;animation:schedule-spin .7s linear infinite;pointer-events:none}
@keyframes schedule-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.schedule-toggle-spinner{animation:none;border-right-color:var(--dp-accent)}}
.schedule-row .schedule-menu-trigger{display:flex;align-items:center;justify-content:center;width:36px;min-height:44px;padding:6px;border:0;background:transparent}
.schedule-menu-trigger svg{display:block;width:24px;height:24px;fill:currentColor}
.schedule-list{display:flex;flex-direction:column;gap:12px;overflow-y:auto;overscroll-behavior:contain;scrollbar-gutter:stable}
.schedule-menu-overlay{position:absolute;inset:0;z-index:12;border-radius:inherit}
.schedule-menu-panel{position:absolute;min-width:160px;max-width:calc(100% - 16px);padding:5px;background:var(--dp-modern-surface,var(--dp-bg));border:1px solid var(--dp-line);border-radius:12px;box-shadow:0 5px 20px #0004;box-sizing:border-box}
.schedule-menu-panel button{display:flex;align-items:center;gap:10px;width:100%;min-height:44px;padding:8px 12px;border:0;border-radius:7px;background:transparent;text-align:left}
.schedule-menu-panel button:hover,.schedule-menu-panel button:focus-visible{background:var(--dp-soft)}
@container dyson-schedules (max-width:600px){.schedule-row{padding:14px 8px 14px 14px;gap:8px;border-radius:15px}.schedule-main{gap:10px}.schedule-time-value{font-size:25px;padding-right:12px}.schedule-room-selection{margin-top:10px;font-size:12px}.schedule-room-chip{padding:4px 7px}}
@container dyson-schedule-copy (max-width:296px){.schedule-main{display:grid}.schedule-time-value{padding:0;border:0}.schedule-weekdays{gap:4px}}
@container dyson-schedule-row (max-width:389px){.schedule-controls{align-self:start;margin-top:-5px}}
.schedule-delete{color:var(--error-color,#b3261e)}.schedule-dialog .schedule-delete-confirm{background:var(--error-color,#b3261e);border-color:transparent;color:var(--text-primary-color,#fff)}
.schedule-row input[type=checkbox]{appearance:none;width:42px;height:26px;margin:0;position:relative;border:1px solid var(--dp-line);border-radius:20px;background:var(--dp-soft);cursor:pointer}
.schedule-row input[type=checkbox]::before{content:'';position:absolute;left:3px;top:3px;width:18px;height:18px;border-radius:50%;background:var(--dp-muted)}
.schedule-row input[type=checkbox]:checked{background:var(--dp-accent);border-color:var(--dp-accent)}.schedule-row input[type=checkbox]:checked::before{transform:translateX(16px);background:var(--text-primary-color,#fff)}
.schedule-row input[type=checkbox]:disabled{opacity:.45;cursor:default}
.schedule-note{font-size:13px;line-height:1.5;overflow-wrap:anywhere}.schedule-warning{padding:10px;border:1px solid var(--warning-color,#b87900);border-radius:10px;background:var(--dp-soft)}
.schedule-overlay{position:absolute;inset:0;z-index:20;background:#0007;padding:12px;display:flex;align-items:flex-start;justify-content:center;overflow:auto;border-radius:var(--ha-card-border-radius,12px)}
.schedule-dialog{background:var(--dp-modern-surface,var(--dp-bg));border:1px solid var(--dp-line);border-radius:14px;padding:16px;width:100%;max-width:480px;box-sizing:border-box}
.schedule-dialog header{display:flex;align-items:center;justify-content:space-between;padding:0;gap:8px}.schedule-dialog h3{margin:0;font-size:17px}.schedule-dialog header button{padding:6px;display:flex}
.schedule-dialog fieldset{border:0;padding:0;margin:16px 0}.schedule-dialog legend{font-size:13px;margin-bottom:8px}.schedule-days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}
.schedule-days label{display:flex;flex-direction:column;align-items:center;gap:5px;font-size:12px;min-width:0}.schedule-time{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:13px}
.schedule-time button{display:flex;align-items:center;gap:8px;min-width:0;font-variant-numeric:tabular-nums}
.schedule-time-picker{box-sizing:border-box;max-width:100%;min-width:0;margin-top:12px;padding:12px;border:1px solid var(--dp-line);border-radius:10px;background:var(--dp-bg)}
.schedule-time-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.schedule-time-column{min-width:0;font-size:13px}.schedule-time-column>span{display:block;margin-bottom:6px}
.schedule-time-options{position:relative;max-height:160px;overflow-y:auto;overscroll-behavior:contain;scrollbar-gutter:stable;border:1px solid var(--dp-line);border-radius:8px;padding:4px}
.schedule-time-options button{display:block;width:100%;min-height:36px;padding:5px;border:0;border-radius:6px;background:transparent;font-variant-numeric:tabular-nums}
.schedule-time-options button[aria-pressed=true]{background:var(--dp-accent);color:var(--text-primary-color,#fff)}
.schedule-time-picker .actions{flex-direction:row;gap:8px}.schedule-time-picker .actions button{min-height:40px;padding:7px;font-size:13px}
.schedule-dialog .actions{display:flex;margin-top:16px}.schedule-dialog .actions button{min-width:0}.schedule-dialog [role=status]:empty{display:none}
.schedule-overlay:has(>.schedule-room-editor){padding:4px}
/* Use the same card container/breakpoint as the planner, not a narrower inner container. */
.schedule-dialog.schedule-room-editor{max-width:none}
.schedule-room-heading{font-size:14px;margin:16px 0 8px}
:host .schedule-dialog .schedule-room-list{padding:0;margin:10px 0 0;list-style:none}
:host([data-theme=modern]) .schedule-dialog .schedule-room-list{padding:0}
.schedule-room-list .pick{position:relative;flex:0 0 44px;min-width:44px;min-height:44px;justify-content:center;cursor:pointer}
.schedule-room-list .pick input{position:absolute;width:1px;height:1px;opacity:0}
.schedule-room-list .room-settings-toggle{flex:1;min-width:0;display:flex;align-items:center;justify-content:space-between;gap:8px;text-align:left;white-space:normal;padding:0 4px;border:0;background:transparent}
.schedule-room-summary strong,.schedule-room-summary small{display:block}.schedule-room-summary small{font-size:12px;font-weight:normal;color:var(--dp-muted);margin-top:4px}
.schedule-room-list .fields{min-width:0}.schedule-room-list .field{min-width:0}
:host([data-theme]) .schedule-dialog footer.schedule-footer{margin:16px 0 0;padding:12px 0 0}
.schedule-dialog .schedule-footer .actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:0}
`;

// Shared schedule UI. Only the selected integration adapter knows entity/service identities.
const scheduleCardMethods = {
  getScheduleState() {
    return this.adapter.scheduleState?.(this._hass, this.registry, this.config.entity) ?? { supported:false, schedules:[] };
  },
  updateScheduleCountdown() {
    const line = this.shadowRoot.querySelector('.schedule-countdown');
    if (!line) return;
    const state = this.getScheduleState(), timeZone = this._hass?.config?.time_zone, now = Date.now();
    const signature = JSON.stringify([timeZone,state.available,state.inSync,state.schedules.map(({id,enabled,days,time,repeat}) => [id,enabled,days,time,repeat])]);
    let cached = this._scheduleCountdown;
    if (!cached || cached.signature !== signature || now < cached.checkedAt || (cached.next.timestamp !== null && cached.next.timestamp <= now)) {
      cached = this._scheduleCountdown = {signature, checkedAt:now, next:nextScheduledClean(state,timeZone,now)};
    }
    const next = cached.next;
    let text, title;
    if (next.timestamp !== null) {
      text = this.t(next.knownOnly ? 'Next known cleaning in {duration}' : 'Next cleaning in {duration}',
        {duration:scheduleCountdownDuration(next.timestamp,now,this.language)});
      const date = new Intl.DateTimeFormat(this.language,{timeZone,weekday:'long',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZoneName:'short'}).format(next.timestamp);
      title = `${text}\n${date} (${timeZone})\n${this.t('Calculated from reported weekly schedules; actual execution may differ.')}`;
    } else {
      text = this.t(next.reason === 'inactive' ? 'No active schedules' : next.reason === 'unknown' ? 'Next cleaning unknown' : 'Next cleaning unavailable');
      title = next.reason === 'timezone' ? this.t('The Home Assistant time zone is unavailable.') : text;
    }
    if (line.textContent !== text) line.textContent = text;
    if (line.title !== title) { line.title = title; line.setAttribute('aria-label',title); }
  },
  canOfferScheduleCreation() {
    const state = this.getScheduleState();
    return state.supported && state.createSupported !== false;
  },
  scheduleCreationReady() {
    const state = this.getScheduleState();
    return state.writable && (state.creationUsesSelectedRooms ? state.createReady && this.selected.length > 0 : !!this.model?.mapId);
  },
  scheduleDaysText(days) {
    const format = new Intl.DateTimeFormat(this.language, { weekday:'short', timeZone:'UTC' });
    return weekdays.filter(d => days.includes(d)).map(d => format.format(new Date(Date.UTC(2024,0,1 + weekdays.indexOf(d))))).join(', ');
  },
  scheduleWeekdaysHtml(schedule) {
    const short = new Intl.DateTimeFormat(this.language,{weekday:'short',timeZone:'UTC'});
    const long = new Intl.DateTimeFormat(this.language,{weekday:'long',timeZone:'UTC'});
    return `<div class="schedule-weekdays" role="img" aria-label="${escapeHtml(this.scheduleDaysText(schedule.days))}">${weekdays.map((day,index) => {
      const date = new Date(Date.UTC(2024,0,1+index));
      return `<span class="schedule-day ${schedule.days.includes(day) ? 'selected' : ''}" aria-hidden="true" title="${escapeHtml(long.format(date))}">${escapeHtml(short.format(date).replace(/\.$/,'').slice(0,2))}</span>`;
    }).join('')}</div>`;
  },
  scheduleRoomChipsHtml(schedule, state) {
    if (!state.roomSelectionKnown) return `<p class="schedule-room-selection">${this.ht('Selected rooms are not reported by this integration. Check them in MyDyson.')}</p>`;
    const rooms = this.model.rooms.filter(room => !room.excluded);
    return `<ul class="schedule-room-selection">${schedule.rooms.map((name,index) => {
      const match = rooms.findIndex(room => schedule.roomIds?.[index] ? room.roomId === schedule.roomIds[index] : room.name === name);
      const rank = match >= 0 ? match : [...name].reduce((sum,char) => sum + char.codePointAt(0),0);
      return `<li class="schedule-room-chip" style="--room-color:${ROOM_COLORS[rank % ROOM_COLORS.length]}"><span>${escapeHtml(name)}</span></li>`;
    }).join('')}</ul>`;
  },
  scheduleMenuHtml(state) {
    if (this.scheduleMenu == null || this.scheduleDialog || this.consumablesOpen || !state.writable
        || !state.schedules.some(schedule => schedule.id === this.scheduleMenu)) { this.scheduleMenu = null; return ''; }
    const id = this.scheduleMenu;
    return `<div class="schedule-menu-overlay"><div class="schedule-menu-panel" id="schedule-actions-${id}" role="menu" aria-labelledby="schedule-menu-${id}">
      <button role="menuitem" data-schedule-edit="${id}" data-focus="schedule-edit-${id}"><ha-icon icon="mdi:pencil-outline" aria-hidden="true"></ha-icon>${this.ht('Edit schedule')}</button>
      ${state.deleteSupported ? `<button role="menuitem" class="schedule-delete" data-schedule-delete="${id}" data-focus="schedule-delete-${id}"><ha-icon icon="mdi:trash-can-outline" aria-hidden="true"></ha-icon>${this.ht('Delete schedule')}</button>` : ''}
    </div></div>`;
  },
  closeScheduleMenu(focus = false) {
    const id = this.scheduleMenu; this.scheduleMenu = null;
    const overlay = this.shadowRoot.querySelector('.schedule-menu-overlay');
    if (overlay) { overlay.remove(); this._html = null; }
    const trigger = this.shadowRoot.querySelector(`[data-schedule-menu="${id}"]`);
    trigger?.setAttribute('aria-expanded','false');
    if (focus) trigger?.focus({preventScroll:true});
  },
  updateScheduleMenu() {
    const panel = this.shadowRoot.querySelector('.schedule-menu-panel');
    if (!panel) return;
    const trigger = this.shadowRoot.querySelector(`[data-schedule-menu="${this.scheduleMenu}"]`);
    if (!trigger || trigger.disabled) { this.closeScheduleMenu(); return; }
    const card = this.shadowRoot.querySelector('ha-card').getBoundingClientRect(), anchor = trigger.getBoundingClientRect();
    const list = this.shadowRoot.querySelector('.schedule-list').getBoundingClientRect();
    if (anchor.bottom <= list.top || anchor.top >= list.bottom) { this.closeScheduleMenu(); return; }
    const width = panel.offsetWidth, height = panel.offsetHeight;
    panel.style.left = `${Math.max(8,Math.min(anchor.right-card.left-width,card.width-width-8))}px`;
    const below = anchor.bottom-card.top+4;
    panel.style.top = `${Math.max(8,Math.min(below+height <= card.height-8 ? below : anchor.top-card.top-height-4,card.height-height-8))}px`;
  },
  scheduleTimePickerHtml() {
    const picker = this.scheduleDialog?.timePicker;
    if (!picker) return '';
    return `<section class="schedule-time-picker" role="group" aria-label="${this.ht('Choose time')}"><div class="schedule-time-columns">${[['hour','Hour',24],['minute','Minute',60]].map(([part,label,count]) => `<div class="schedule-time-column"><span id="schedule-time-${part}-label">${this.ht(label)}</span><div class="schedule-time-options" role="group" aria-labelledby="schedule-time-${part}-label">${Array.from({length:count},(_,value) => `<button data-schedule-time-part="${part}" data-schedule-time-value="${value}" data-focus="schedule-time-${part}-${value}" aria-pressed="${picker[part] === value}" tabindex="${picker[part] === value ? 0 : -1}">${String(value).padStart(2,'0')}</button>`).join('')}</div></div>`).join('')}</div><div class="actions"><button data-schedule-action="time-cancel" data-focus="schedule-time-cancel">${this.ht('Cancel')}</button><button class="start" data-schedule-action="time-apply" data-focus="schedule-time-apply">${this.ht('Apply time')}</button></div></section>`;
  },
  updateScheduleTimePicker() {
    const picker = this.scheduleDialog?.timePicker;
    if (!picker) return;
    for (const list of this.shadowRoot.querySelectorAll('.schedule-time-options')) {
      for (const option of list.querySelectorAll('[data-schedule-time-part]')) {
        const selected = Number(option.dataset.scheduleTimeValue) === picker[option.dataset.scheduleTimePart];
        option.setAttribute('aria-pressed', String(selected)); option.tabIndex = selected ? 0 : -1;
        option.disabled = !!this.scheduleSending;
      }
      if (!list.dataset.positioned) {
        const selected = list.querySelector('[aria-pressed="true"]');
        list.scrollTop = selected.offsetTop - (list.clientHeight - selected.offsetHeight) / 2;
        list.dataset.positioned = 'true';
      }
    }
  },
  chooseScheduleTime(part, value) {
    const picker = this.scheduleDialog?.timePicker;
    if (!picker || this.scheduleSending || !['hour','minute'].includes(part)
        || !Number.isInteger(value) || value < 0 || value >= (part === 'hour' ? 24 : 60)) return;
    picker[part] = value; this.updateScheduleTimePicker();
  },
  scheduleTimeAction(action) {
    const dialog = this.scheduleDialog;
    if (!dialog || this.scheduleSending) return;
    if (action === 'time-open') {
      const [hour,minute] = (dialog.time || '09:00').split(':').map(Number);
      dialog.timePicker = {hour,minute}; this.render();
      this.shadowRoot.querySelector(`[data-schedule-time-part="hour"][aria-pressed="true"]`)?.focus({preventScroll:true});
      this.shadowRoot.querySelector('.schedule-time-picker')?.scrollIntoView({block:'nearest'});
      return;
    }
    if (!dialog.timePicker) return;
    if (action === 'time-apply') {
      dialog.time = [dialog.timePicker.hour,dialog.timePicker.minute].map(value => String(value).padStart(2,'0')).join(':');
      dialog.error = '';
    }
    dialog.timePicker = null; this.render();
    this.shadowRoot.querySelector('[data-schedule-time]')?.focus({preventScroll:true});
  },
  scheduleDeleteOverlayHtml(dialog) {
    return `<div class="schedule-overlay"><section class="schedule-dialog" role="dialog" aria-modal="true" aria-labelledby="schedule-dialog-title" aria-describedby="schedule-delete-description" tabindex="-1">
      <header><h3 id="schedule-dialog-title">${this.ht('Delete schedule')}</h3><button data-schedule-action="close" data-focus="schedule-close" aria-label="${this.ht('Close')}" ${this.scheduleSending ? 'disabled' : ''}><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></header>
      <p class="schedule-note">${this.ht('Delete schedule {time} ({days})?', {time:dialog.time, days:this.scheduleDaysText(dialog.days)})}</p>
      <p class="schedule-note" id="schedule-delete-description">${this.ht('This removes the schedule from the robot and MyDyson.')}</p>
      <p class="schedule-note error schedule-dialog-message" role="status" aria-live="polite">${this.ht(dialog.error ?? '')}</p>
      <div class="actions"><button data-schedule-action="close" data-focus="schedule-cancel" ${this.scheduleSending ? 'disabled' : ''}>${this.ht('Cancel')}</button><button class="schedule-delete-confirm" data-schedule-action="confirm" data-focus="schedule-confirm">${this.ht(this.scheduleSending ? 'Deleting schedule …' : 'Delete schedule')}</button></div>
    </section></div>`;
  },
  scheduleSettingVisible(key, mode) {
    return this.config.always_show_all_settings || !((mode === 'Vacuum' && key === 'water_level')
      || (mode === 'Mop' && key === 'cleaning_strategy'));
  },
  scheduleRoomPlanPayload() {
    const dialog = this.scheduleDialog, plan = structuredClone(dialog.roomPlan);
    plan.settings = Object.fromEntries(Object.entries(plan.settings).flatMap(([id,settings]) => {
      if (!plan.roomIds.includes(id)) return [];
      const mode = settings.cleaning_mode ?? dialog.schedule.roomSettings?.[id]?.cleaning_mode;
      const values = Object.fromEntries(Object.entries(settings).filter(([key]) => this.scheduleSettingVisible(key,mode)));
      return Object.keys(values).length ? [[id,values]] : [];
    }));
    return plan;
  },
  scheduleEditorRooms() {
    const dialog = this.scheduleDialog;
    const options = this.adapter.scheduleRoomOptions?.(this._hass,this.registry,this.config,dialog.schedule);
    const rooms = (options ?? []).filter(room => /^\d+$/.test(room.roomId)).map(room => ({...room,editable:true}));
    for (const id of dialog.schedule.roomIds) if (!rooms.some(room => room.roomId === id)) {
      rooms.push({roomId:id,name:dialog.roomNames[id] ?? id,settings:{},editable:false});
    }
    return {options,rooms};
  },
  scheduleRoomsHtml() {
    const dialog = this.scheduleDialog;
    if (!dialog.roomPlan) return '';
    const {options,rooms} = this.scheduleEditorRooms();
    const disabled = !!this.scheduleSending || !this.getScheduleState().writable || !options;
    const modern = this.config.theme === 'modern';
    const rows = rooms.map((room,index) => {
      const id = room.roomId, selected = dialog.roomPlan.roomIds.includes(id);
      const values = {...dialog.schedule.roomSettings?.[id],...dialog.roomPlan.settings[id]};
      const open = dialog.expandedRoom === id;
      const fields = Object.entries(ROOM_FIELDS).flatMap(([key,label]) => {
        const field = room.settings[key];
        const omitted = !this.scheduleSettingVisible(key,values.cleaning_mode);
        if (!field?.options?.length || (omitted && !modern)) return [];
        const current = values[key] ?? '';
        if (modern && key !== 'cleaning_mode') {
          const control = this.modernControl(key,this.t(label),room,field,current,disabled || !field.available,`schedule-${id}`,'schedule');
          return omitted ? `<div class="mode-spacer" inert aria-hidden="true">${control}</div>` : control;
        }
        return `<label class="field ${key === 'cleaning_mode' ? 'mode' : ''}"><span>${this.ht(label)}</span><select data-schedule-room-setting="${key}" data-schedule-room="${id}" data-focus="schedule-room-${id}-${key}" ${disabled || !field.available ? 'disabled' : ''}><option value="" ${!current ? 'selected' : ''}>${this.ht('Keep stored setting')}</option>${current && !field.options.includes(current) ? `<option value="${escapeHtml(current)}" selected disabled>${this.ht(current)}</option>` : ''}${field.options.map(value => `<option value="${escapeHtml(value)}" ${current === value ? 'selected' : ''}>${this.ht(value)}</option>`).join('')}</select></label>`;
      }).join('');
      const color = ROOM_COLORS[index % ROOM_COLORS.length];
      return `<section class="room ${selected ? 'selected' : ''} ${open ? 'open' : ''}" role="listitem" data-schedule-plan-room="${id}" style="--room-color:${color};--room-row:${index+1}"><div class="room-head">
        <label class="pick"><input type="checkbox" data-schedule-room-toggle="${id}" data-focus="schedule-room-select-${id}" aria-label="${this.ht('Select {name}',{name:room.name})}" ${selected ? 'checked' : ''} ${disabled || (!room.editable && !selected) ? 'disabled' : ''}><span class="selection-circle" aria-hidden="true">${selected ? dialog.roomPlan.roomIds.indexOf(id)+1 : ''}</span></label>
        <button class="room-settings-toggle schedule-room-summary" data-schedule-room="${id}" data-schedule-room-action="expand" data-focus="schedule-room-${id}" aria-expanded="${open}" aria-controls="schedule-room-fields-${id}" ${disabled || !room.editable ? 'disabled' : ''}><span class="room-settings-copy"><strong class="name">${escapeHtml(room.name)}</strong><small class="summary">${this.ht(values.cleaning_mode || 'Stored settings not reported')}</small></span><span aria-hidden="true">${open ? '&#8963;' : '&#8250;'}</span></button>
        </div><div class="fields schedule-room-fields" id="schedule-room-fields-${id}" ${open ? '' : 'hidden'}>${fields}</div></section>`;
    }).join('');
    const incomplete = dialog.roomPlan.roomIds.some(id => Object.keys(ROOM_FIELDS).some(key =>
      this.scheduleSettingVisible(key,dialog.roomPlan.settings[id]?.cleaning_mode ?? dialog.schedule.roomSettings?.[id]?.cleaning_mode)
        && !dialog.schedule.roomSettings?.[id]?.[key]));
    return `<div class="schedule-room-area"><h4 class="schedule-room-heading">${this.ht('Rooms and cleaning settings')}</h4>${incomplete ? `<p class="schedule-note">${this.ht('Some stored settings are not reported. Unchanged settings will be preserved.')}</p>` : ''}
      ${!options ? `<p class="schedule-note schedule-warning">${this.ht('Room editing requires the schedule map to be active. You can still change weekdays and time.')}</p>` : ''}
      <div class="rooms ${modern ? 'modern-rooms' : ''} schedule-room-list" role="list" style="--room-count:${rooms.length}">${rows}</div></div>`;
  },
  scheduleRoomAction(action, id) {
    const dialog = this.scheduleDialog;
    if (!dialog?.roomPlan || this.scheduleSending || !this.getScheduleState().writable || action !== 'expand') return;
    const room = this.adapter.scheduleRoomOptions?.(this._hass,this.registry,this.config,dialog.schedule)?.find(room => room.roomId === id);
    if (!room) return;
    dialog.expandedRoom = dialog.expandedRoom === id ? null : id;
    this.render();
    this.shadowRoot.querySelector(`[data-focus="schedule-room-${id}"]`)?.focus({preventScroll:true});
  },
  updateSchedulePlanChanged() {
    const dialog = this.scheduleDialog;
    dialog.roomsChanged = JSON.stringify(dialog.roomPlan.roomIds) !== JSON.stringify(dialog.schedule.roomIds)
      || Object.keys(this.scheduleRoomPlanPayload().settings).length > 0;
  },
  scheduleOverlayHtml() {
    const dialog = this.scheduleDialog;
    if (!dialog) return '';
    if (dialog.mode === 'delete') return this.scheduleDeleteOverlayHtml(dialog);
    const state = this.getScheduleState();
    return `<div class="schedule-overlay"><section class="schedule-dialog ${dialog.roomPlan ? 'schedule-room-editor' : ''}" role="dialog" aria-modal="true" aria-labelledby="schedule-dialog-title" tabindex="-1">
      <header><h3 id="schedule-dialog-title">${this.ht(dialog.id === undefined ? 'Create schedule' : 'Edit schedule')}</h3><button data-schedule-action="close" data-focus="schedule-close" aria-label="${this.ht('Close')}" ${this.scheduleSending ? 'disabled' : ''}><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></header>
      ${dialog.id === undefined && state.creationUsesStoredRooms ? `<p class="schedule-note schedule-warning">${this.ht("The integration reuses the robot's stored room selection. This card cannot change it. Check the selected rooms in MyDyson after creating the schedule.")}</p>` : ''}
      ${dialog.id === undefined && state.creationUsesSelectedRooms && !dialog.roomPlan ? `<p class="schedule-note">${this.ht('Selected rooms: {rooms}', {rooms:dialog.rooms.join(', ')})}</p>` : ''}
      <fieldset aria-label="${this.ht('Weekdays')}" ${this.scheduleSending ? 'disabled' : ''}><div class="schedule-days">${weekdays.map(day => `<label><span>${escapeHtml(this.scheduleDaysText([day]))}</span><input type="checkbox" data-schedule-day="${day}" data-focus="schedule-${day}" ${dialog.days.includes(day) ? 'checked' : ''}></label>`).join('')}</div></fieldset>
      <div class="schedule-time"><span id="schedule-start-time-label">${this.ht('Start time')}</span><button data-schedule-time data-schedule-action="time-open" data-focus="schedule-time" aria-labelledby="schedule-start-time-label schedule-time-value" aria-expanded="${!!dialog.timePicker}" aria-controls="schedule-time-selection" ${this.scheduleSending ? 'disabled' : ''}><span id="schedule-time-value">${dialog.time ? escapeHtml(dialog.time) : this.ht('Choose time')}</span><ha-icon icon="mdi:clock-outline" aria-hidden="true"></ha-icon></button></div>
      <div id="schedule-time-selection">${this.scheduleTimePickerHtml()}</div>
      <p class="schedule-note">${this.ht('Times use the Home Assistant time zone: {zone}.', {zone:this._hass.config?.time_zone ?? this.t('Unavailable')})}</p>
      ${this.scheduleRoomsHtml()}
      <p class="schedule-note error schedule-dialog-message" role="status" aria-live="polite">${this.ht(dialog.error ?? '')}</p>
      <footer class="schedule-footer"><div class="actions"><button data-schedule-action="close" data-focus="schedule-cancel" ${this.scheduleSending ? 'disabled' : ''}>${this.ht('Discard')}</button><button class="start" data-schedule-action="confirm" data-focus="schedule-confirm">${this.ht(this.scheduleSending ? 'Sending schedule …' : dialog.id === undefined ? 'Create schedule' : 'Save schedule')}</button></div></footer>
    </section></div>`;
  },
  updateScheduleDialog() {
    this.shadowRoot.querySelector('.planner-content')?.toggleAttribute('inert', !!this.scheduleDialog || !!this.consumablesOpen);
    const confirm = this.shadowRoot.querySelector('[data-schedule-action="confirm"]');
    if (confirm) confirm.disabled = !!this._previewDialog || !!this.scheduleSending || !this.getScheduleState().writable
      || (this.scheduleDialog.mode === 'delete' ? !this.getScheduleState().deleteSupported
        : !!this.scheduleDialog.timePicker || !this.scheduleDialog.days.length || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(this.scheduleDialog.time)
          || (this.scheduleDialog.roomPlan && !this.scheduleDialog.roomPlan.roomIds.length)
          || ((this.scheduleDialog.roomsChanged || this.scheduleDialog.id === undefined) && this.scheduleDialog.roomPlan && !this.adapter.scheduleRoomOptions?.(this._hass,this.registry,this.config,this.scheduleDialog.schedule)));
    this.updateScheduleTimePicker();
    if (this.scheduleDialog?.roomPlan) this.positionModernPointer();
    const panel = this.shadowRoot.querySelector('.schedule-dialog');
    if (panel && (this.scheduleSending || !panel.contains(this.shadowRoot.activeElement))) {
      (panel.querySelector('button:not(:disabled)') ?? panel).focus({preventScroll:true});
    }
  },
  scheduleInput(event) {
    const dialog = this.scheduleDialog, el = event.target;
    if (!dialog || this.scheduleSending) return;
    // Keep the native slider mounted until the drag is committed, as in the planner.
    if (event.type === 'input' && el.type === 'range') return;
    if (el.dataset.scheduleDay) dialog.days = weekdays.filter(d => d === el.dataset.scheduleDay ? el.checked : dialog.days.includes(d));
    else if (el.matches('[data-schedule-room-toggle], [data-schedule-room-setting]')) {
      const options = this.adapter.scheduleRoomOptions?.(this._hass,this.registry,this.config,dialog.schedule);
      const id = el.dataset.scheduleRoomToggle ?? el.dataset.scheduleRoom, room = options?.find(room => room.roomId === id);
      if (!this.getScheduleState().writable || !options || !dialog.roomPlan) return;
      if (el.hasAttribute('data-schedule-room-toggle')) {
        if (el.checked && (!room || dialog.roomPlan.roomIds.includes(id))) return;
        dialog.roomPlan.roomIds = dialog.roomPlan.roomIds.filter(roomId => roomId !== id);
        if (el.checked) { dialog.roomPlan.roomIds.push(id); dialog.roomNames[id] = room.name; }
      } else {
        const key = el.dataset.scheduleRoomSetting;
        const field = room?.settings[key];
        const value = el.dataset.option ?? (el.type === 'range' ? field?.options[Number(el.value)] : el.value);
        if (!field?.available || !this.scheduleSettingVisible(key,dialog.roomPlan.settings[id]?.cleaning_mode ?? dialog.schedule.roomSettings?.[id]?.cleaning_mode) || (value && !field.options.includes(value))) return;
        if (value && value !== dialog.schedule.roomSettings?.[id]?.[key]) (dialog.roomPlan.settings[id] ??= {})[key] = value;
        else { delete dialog.roomPlan.settings[id]?.[key]; if (!Object.keys(dialog.roomPlan.settings[id] ?? {}).length) delete dialog.roomPlan.settings[id]; }
      }
      this.updateSchedulePlanChanged(); dialog.error = ''; this.render(); return;
    } else return;
    dialog.error = '';
    const message = this.shadowRoot.querySelector('.schedule-dialog-message');
    if (message) message.textContent = '';
    this.updateScheduleDialog();
  },
  openSchedule(id, mode = 'edit') {
    if (this._previewDialog || this.busy || this.scheduleSending || this.view.active || !this.isConnected) return;
    const state = this.getScheduleState(), schedule = state.schedules.find(s => s.id === id);
    if (!state.writable || (id !== undefined && !schedule) || (mode === 'delete' && (!schedule || !state.deleteSupported))) return;
    if (id === undefined && !this.scheduleCreationReady()) return;
    const context = this.adapter.roomContext(this._hass,this.config.entity,this.registry);
    if (id === undefined && this.draftContext !== context) {
      this.message = uiMessage('A room in your draft is unavailable or ambiguous. Review or discard the draft.');
      this.error = true; this._dismissedNotice = ''; this.render(); return;
    }
    this.closeScheduleMenu();
    this.scheduleDialog = { id, mode, days:schedule ? [...schedule.days] : [], time:schedule?.time ?? '',
      selected:[...this.selected], rooms:this.selected.map(entity => this.model.rooms.find(room => roomKey(room) === entity)?.name ?? entity),
      draft:structuredClone(this.settingDraft), context:id === undefined ? this.draftContext : context, config:this.config };
    if (schedule?.roomIds && this.adapter.scheduleRoomOptions) {
      Object.assign(this.scheduleDialog, {schedule:structuredClone(schedule), roomPlan:{roomIds:[...schedule.roomIds],settings:{}},
        roomNames:Object.fromEntries(schedule.roomIds.map((roomId,index) => [roomId,schedule.rooms[index]])), roomsChanged:false});
    } else if (id === undefined && state.creationUsesSelectedRooms && this.adapter.scheduleRoomOptions) {
      const rooms = this.model.rooms.filter(room => room.roomId);
      const roomIds = this.selected.map(entity => rooms.find(room => roomKey(room) === entity)?.roomId).filter(Boolean);
      Object.assign(this.scheduleDialog, {schedule:{roomIds:[...roomIds],mapId:String(this.adapter.mapId(this._hass,this.config.entity)),
        roomSettings:Object.fromEntries(rooms.map(room => [room.roomId,Object.fromEntries(Object.entries(room.settings).flatMap(([key,field]) => field.options.includes(field.value) ? [[key,field.value]] : []))]))},
        roomPlan:{roomIds,settings:structuredClone(this.settingDraft)},roomNames:Object.fromEntries(rooms.map(room => [room.roomId,room.name])),
        roomEntities:Object.fromEntries(rooms.map(room => [room.roomId,roomKey(room)])),roomsChanged:false});
    }
    this.render();
    this.shadowRoot.querySelector(mode === 'delete' ? '[data-focus="schedule-cancel"]' : '[data-focus="schedule-mon"]')?.focus({preventScroll:true});
  },
  closeSchedule() {
    if (this.scheduleSending) return;
    const id = this.scheduleDialog?.id;
    this.scheduleDialog = null; this.render();
    this.shadowRoot.querySelector(id === undefined ? '[data-action="schedule-create"]' : `[data-schedule-menu="${id}"]`)?.focus({preventScroll:true});
  },
  scheduleKeydown(event) {
    const menuTrigger = event.target.closest('[data-schedule-menu]');
    if (menuTrigger && !menuTrigger.disabled && ['ArrowDown','ArrowUp'].includes(event.key)) {
      event.preventDefault();
      if (this.scheduleMenu == null) menuTrigger.click();
      const items = this.shadowRoot.querySelectorAll('.schedule-menu-panel button');
      (event.key === 'ArrowUp' ? items[items.length-1] : items[0])?.focus({preventScroll:true});
      return true;
    }
    if (this.scheduleMenu != null) {
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); }
        this.closeScheduleMenu(true); return true;
      }
      if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
        event.preventDefault();
        const items = [...this.shadowRoot.querySelectorAll('.schedule-menu-panel button')];
        const index = items.indexOf(this.shadowRoot.activeElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length-1
          : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[next]?.focus(); return true;
      }
    }
    if (!this.scheduleDialog) return false;
    const option = event.target.closest('[data-schedule-time-part]');
    if (option && ['ArrowUp','ArrowDown','Home','End'].includes(event.key)) {
      event.preventDefault();
      const part = option.dataset.scheduleTimePart, count = part === 'hour' ? 24 : 60;
      const value = event.key === 'Home' ? 0 : event.key === 'End' ? count-1
        : (Number(option.dataset.scheduleTimeValue) + (event.key === 'ArrowDown' ? 1 : -1) + count) % count;
      this.chooseScheduleTime(part,value);
      const next = this.shadowRoot.querySelector(`[data-schedule-time-part="${part}"][data-schedule-time-value="${value}"]`);
      next.focus({preventScroll:true}); next.scrollIntoView({block:'nearest'});
    }
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); this.scheduleDialog.timePicker ? this.scheduleTimeAction('time-cancel') : this.closeSchedule(); }
    if (event.key === 'Tab') {
      const items = [...this.shadowRoot.querySelectorAll('.schedule-dialog button:not(:disabled), .schedule-dialog input:not(:disabled), .schedule-dialog select:not(:disabled)')].filter(el => el.tabIndex >= 0 && !el.closest('fieldset:disabled') && el.getClientRects().length);
      const active = this.shadowRoot.activeElement;
      if (!items.length) { event.preventDefault(); this.shadowRoot.querySelector('.schedule-dialog')?.focus(); }
      else if (event.shiftKey && active === items[0]) { event.preventDefault(); items.at(-1)?.focus(); }
      else if (!event.shiftKey && active === items.at(-1)) { event.preventDefault(); items[0]?.focus(); }
    }
    return true;
  },
  scheduleClick(event) {
    if (event.target.classList?.contains('schedule-menu-overlay')) { this.closeScheduleMenu(true); return true; }
    if (event.target.classList?.contains('schedule-overlay')) { this.closeSchedule(); return true; }
    const el = event.target.closest('button');
    if (el?.dataset.scheduleMenu !== undefined) {
      if (!el.disabled) {
        const id = Number(el.dataset.scheduleMenu);
        if (this.scheduleMenu === id) this.closeScheduleMenu(true);
        else { this.scheduleMenu = id; this.render(); this.shadowRoot.querySelector('.schedule-menu-panel button')?.focus({preventScroll:true}); }
      }
      return true;
    }
    if (el?.dataset.scheduleRoomAction) { if (!el.disabled) this.scheduleRoomAction(el.dataset.scheduleRoomAction,el.dataset.scheduleRoom); return true; }
    if (el?.dataset.scheduleRoomSetting && el.dataset.option !== undefined) { if (!el.disabled) this.scheduleInput({target:el}); return true; }
    if (el?.dataset.scheduleTimePart) {
      if (!el.disabled) this.chooseScheduleTime(el.dataset.scheduleTimePart, Number(el.dataset.scheduleTimeValue));
      return true;
    }
    if (el?.dataset.scheduleAction) {
      if (!el.disabled) {
        if (el.dataset.scheduleAction.startsWith('time-')) this.scheduleTimeAction(el.dataset.scheduleAction);
        else el.dataset.scheduleAction === 'confirm' ? this.submitSchedule() : this.closeSchedule();
      }
      return true;
    }
    if (this.scheduleDialog) return true;
    if (el?.dataset.action === 'schedule-create') { if (!el.disabled) this.openSchedule(); return true; }
    if (el?.dataset.scheduleEdit !== undefined) { if (!el.disabled) this.openSchedule(Number(el.dataset.scheduleEdit)); return true; }
    if (el?.dataset.scheduleDelete !== undefined) { if (!el.disabled) this.openSchedule(Number(el.dataset.scheduleDelete),'delete'); return true; }
    return false;
  },
  clearScheduleNotice(clearMessage = false) {
    clearTimeout(this._scheduleNoticeTimer); this._scheduleNoticeTimer = null;
    if (clearMessage && this.message === this._scheduleNotice) this.message = '';
    this._scheduleNotice = null;
  },
  showScheduleSuccess(kind) {
    if (kind === 'toggle') return;
    this.clearScheduleNotice();
    const notice = uiMessage(kind === 'create' ? 'Schedule created.' : kind === 'delete' ? 'Schedule deleted.' : 'Schedule saved.');
    this._scheduleNotice = notice; this.message = notice; this.error = false; this._dismissedNotice = '';
    this._scheduleNoticeTimer = setTimeout(() => {
      if (this._scheduleNotice !== notice) return;
      this._scheduleNoticeTimer = null; this._scheduleNotice = null;
      if (this.message === notice) { this.message = ''; if (this.isConnected) this.updateHeaderNotice(); }
    },3000);
    this.updateHeaderNotice();
  },
  cancelScheduleFeedback() {
    this.clearScheduleNotice(true);
    const operation = this.scheduleSending;
    if (operation) { operation.cancelled = true; operation.confirm?.('cancelled'); }
    this._scheduleConfirmation = null; this._scheduleUnconfirmed = null;
  },
  reconcileScheduleConfirmation() {
    const operation = this._scheduleConfirmation;
    if (operation && !operation.cancelled && scheduleRequestConfirmed(this.getScheduleState(),operation.request)) operation.confirm?.('confirmed');
    const late = this._scheduleUnconfirmed;
    if (late && this.config === late.config && this._detachRevision === late.detach
        && this.message === late.notice && scheduleRequestConfirmed(this.getScheduleState(),late.request)) {
      this._scheduleUnconfirmed = null; this.message = ''; this.error = false;
      this.showScheduleSuccess(late.request.kind);
    }
  },
  waitForScheduleConfirmation(operation) {
    if (scheduleRequestConfirmed(this.getScheduleState(),operation.request)) return Promise.resolve('confirmed');
    return new Promise(resolve => {
      this._scheduleConfirmation = operation;
      operation.confirm = result => {
        clearTimeout(operation.confirmTimer); operation.confirm = null;
        if (this._scheduleConfirmation === operation) this._scheduleConfirmation = null;
        resolve(result);
      };
      operation.confirmTimer = setTimeout(() => operation.confirm?.('timeout'),10000);
    });
  },
  async submitSchedule(id, enabled) {
    if (this._previewDialog || this.busy || this.scheduleSending || this.view.active || !this.isConnected) return;
    const dialog = enabled === undefined ? this.scheduleDialog : null;
    if (!dialog && enabled === undefined) return;
    if (dialog?.mode !== 'delete' && (dialog?.timePicker || (dialog?.roomPlan && !dialog.roomPlan.roomIds.length))) return;
    if (dialog && dialog.config !== this.config) return;
    const config = this.config, detach = this._detachRevision, state = this.getScheduleState();
    const request = {kind:!dialog ? 'toggle' : dialog.mode === 'delete' ? 'delete' : dialog.id === undefined ? 'create' : 'edit',id:dialog?.id ?? id};
    if (!dialog) request.enabled = enabled;
    else if (request.kind !== 'delete') {
      request.days = [...dialog.days]; request.time = dialog.time;
      if (request.kind === 'create') { request.previousIds = state.schedules.map(schedule => schedule.id); request.enabled = true; }
      if (dialog.roomPlan && (dialog.roomsChanged || request.kind === 'create') && state.roomSelectionKnown) {
        const plan = this.scheduleRoomPlanPayload();
        request.roomIds = plan.roomIds; request.roomSettings = plan.settings; request.mapId = dialog.schedule.mapId;
      }
    }
    this.clearScheduleNotice(); this._scheduleUnconfirmed = null;
    const operation = {request,config,detach}; this.scheduleSending = operation;
    const current = () => this.config === config && this._detachRevision === detach && this.isConnected && !operation.cancelled;
    this.message = dialog ? uiMessage(request.kind === 'delete' ? 'Deleting schedule …' : 'Saving schedule …') : ''; this.error = false;
    this._dismissedNotice = '';
    if (dialog) dialog.error = '';
    this.render();
    try {
      if (dialog?.mode === 'delete') await this.adapter.deleteSchedule({hass:this._hass, registry:this.registry, config, id:dialog.id});
      else await this.adapter.setSchedule({hass:this._hass, registry:this.registry, config,
        ...(dialog ? {id:dialog.id, days:[...dialog.days], time:dialog.time,
          selected:dialog.id === undefined && dialog.roomPlan ? dialog.roomPlan.roomIds.map(roomId => dialog.roomEntities[roomId]) : dialog.selected,
          draft:dialog.id === undefined && dialog.roomPlan ? this.scheduleRoomPlanPayload().settings : dialog.draft, context:dialog.context,
          ...(dialog.roomsChanged ? {roomPlan:this.scheduleRoomPlanPayload()} : {})} : {id, enabled})});
      if (!current()) return;
      this.scheduleDialog = null;
      this.render();
      const result = await this.waitForScheduleConfirmation(operation);
      if (!current() || result === 'cancelled') return;
      if (result === 'confirmed') this.showScheduleSuccess(request.kind);
      else {
        const notice = uiMessage('The change has not been confirmed by Home Assistant. Check the schedule in MyDyson before trying again.');
        this._scheduleUnconfirmed = {request,config,detach,notice};
        this.message = notice; this.error = true;
      }
    } catch (error) {
      if (!current()) return;
      const message = uiMessage('Schedule request failed. Check the schedule in MyDyson before trying again. {error}', {error});
      if (dialog) dialog.error = message;
      this.message = message; this.error = true;
    } finally {
      if (this.scheduleSending === operation) {
        this.scheduleSending = null;
        if (this.isConnected && this.config === config && this._detachRevision === detach) {
          this.render();
          if (!this.scheduleDialog) {
            const target = dialog ? dialog.mode === 'delete' ? '.planning-tabs [aria-selected="true"]'
              : dialog.id === undefined ? '[data-action="schedule-create"]' : `[data-schedule-menu="${dialog.id}"]`
              : `[data-schedule-toggle="${id}"]`;
            this.shadowRoot.querySelector(target)?.focus({preventScroll:true});
          }
        }
      }
    }
  },
  updateScheduleListLayout() {
    const list = this.shadowRoot.querySelector('.schedule-list');
    if (!list) return;
    const rows = [...list.querySelectorAll('.schedule-row')];
    const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
    const height = rows.length > 4 ? `${Math.ceil(rows.slice(0,4).reduce((total,row) => total + row.getBoundingClientRect().height,0) + 3*gap)}px` : '';
    if (list.style.maxHeight !== height) list.style.maxHeight = height;
    this.updateScheduleMenu();
  },
  renderSchedules(styles) {
    const state = this.getScheduleState();
    const pendingToggle = this.scheduleSending?.request?.kind === 'toggle' ? this.scheduleSending.request.id : null;
    const disabled = this.scheduleSending || this._previewDialog || !state.writable;
    const previousList = this.shadowRoot.querySelector('.schedule-list');
    const scrollTop = previousList?.scrollTop ?? this.scheduleScrollTop ?? 0;
    const previousHeight = state.schedules.length > 4 ? previousList?.style.maxHeight ?? '' : '';
    const menu = this.scheduleMenuHtml(state);
    const rows = state.schedules.slice().sort((a,b) => a.time.localeCompare(b.time) || a.id-b.id).map(schedule => `<section class="schedule-row ${schedule.enabled ? 'enabled' : ''}" data-schedule-id="${schedule.id}">
      <div class="schedule-copy"><div class="schedule-main"><time class="schedule-time-value" datetime="${escapeHtml(schedule.time)}">${escapeHtml(schedule.time)}</time>${this.scheduleWeekdaysHtml(schedule)}</div>${this.scheduleRoomChipsHtml(schedule,state)}</div>
      <div class="schedule-controls"><label class="schedule-toggle-target ${pendingToggle === schedule.id ? 'pending' : ''}"><input type="checkbox" role="switch" data-schedule-toggle="${schedule.id}" data-focus="schedule-toggle-${schedule.id}" ${schedule.enabled ? 'checked' : ''} ${disabled ? 'disabled' : ''} aria-busy="${pendingToggle === schedule.id}" aria-label="${this.ht('Enable schedule {time} ({days})', {time:schedule.time, days:this.scheduleDaysText(schedule.days)})}">${pendingToggle === schedule.id ? `<span class="schedule-toggle-spinner" role="status" aria-label="${this.ht('Updating schedule …')}"></span>` : ''}</label>
      <button class="schedule-menu-trigger" id="schedule-menu-${schedule.id}" data-schedule-menu="${schedule.id}" data-focus="schedule-menu-${schedule.id}" aria-haspopup="menu" aria-expanded="${this.scheduleMenu === schedule.id}" aria-controls="schedule-actions-${schedule.id}" ${disabled ? 'disabled' : ''} aria-label="${this.ht('Schedule actions {time} ({days})', {time:schedule.time, days:this.scheduleDaysText(schedule.days)})}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg></button></div></section>`).join('');
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}${this.planningTabsHtml()}<div id="planning-panel-rooms" role="tabpanel" aria-labelledby="planning-tab-rooms" hidden></div>${this.supportsZone ? '<div id="planning-panel-zones" role="tabpanel" aria-labelledby="planning-tab-zones" hidden></div>' : ''}<section id="planning-panel-schedules" role="tabpanel" aria-labelledby="planning-tab-schedules" class="schedules">
      ${!state.available ? `<p class="schedule-note">${this.ht('Schedules are unavailable. Check the robot connection and integration.')}</p>` : ''}
      ${state.inSync === false ? `<p class="schedule-note schedule-warning">${this.ht('The schedule list may be incomplete. Turn each schedule off and on in MyDyson while the integration is connected.')}</p>` : ''}
      <p class="schedule-countdown"></p>
      <div class="schedule-list" role="region" aria-label="${this.ht('Schedules')}" ${state.schedules.length > 4 ? 'tabindex="0"' : ''} style="max-height:${previousHeight}">${rows}</div>
      ${!rows && state.available ? `<p class="schedule-note">${this.ht('No known schedules. Create one from the room planner, or turn existing schedules off and on in MyDyson.')}</p>` : ''}
    </section></div>${this.consumablesHtml()}${menu}${this.scheduleOverlayHtml()}</ha-card>`, 'schedules');
    this.updateBattery(); this.updateConsumables(); this.updateStatus(''); this.updateScheduleDialog();
    this.updateScheduleCountdown();
    const list = this.shadowRoot.querySelector('.schedule-list');
    list.scrollTop = scrollTop;
    this.updateScheduleListLayout();
    list.onscroll = () => { this.scheduleScrollTop = list.scrollTop; this.updateScheduleMenu(); };
  },
};


function stationIndicator(field, refillStatus, language = 'en') {
  const t = (key, params) => translate(language, key, params);
  const { key, label, value } = field;
  const refill = key === 'cleaning_solution' && refillStatus === 'refill_required';
  const unknown = !field.available;
  let icon = '', color = '', short = '', description = value;
  switch (key) {
    case 'hot_water_mopping':
    case 'hot_water_self_cleaning':
      icon = key === 'hot_water_mopping' ? 'mdi:waves' : 'mdi:water-boiler';
      color = value === 'on' ? 'active-red' : 'active-blue';
      break;
    case 'extended_roller_preparation':
      icon = 'mdi:roller-skate';
      color = value === 'on' ? 'active-blue with-plus' : 'inactive-muted';
      break;
    case 'cleaning_solution':

      icon = refill || value === 'on' ? 'mdi:bottle-tonic-plus' : 'mdi:bottle-tonic';
      color = refill ? 'alarm-red blink' : value === 'on' ? 'active-cyan' : 'inactive-muted';
      if (refill) description = 'Refill required';
      break;
    case 'self_cleaning_frequency':
      short = { 'After each room': '1R', 'Every 15 minutes': '15m', 'Every 30 minutes': '30m', 'Only as needed': 'Auto' }[value];
      if (!short) short = '\u2013';
      icon = short === '1R' ? 'mdi:door-open' : 'mdi:clock-outline';
      break;
    case 'roller_drying_duration': {
      const hours = /^([2345])\s*(?:h|hours)$/i.exec(value);
      short = hours ? hours[1] + 'h' : '\u2013';
      break;
    }
    default: return '';
  }
  if (unknown) { color = 'inactive-muted'; description = 'Unavailable'; }
  const text = escapeHtml(t(label) + ': ' + t(description));
  return `<span class="station-indicator ${color}" role="img" aria-label="${text}" title="${text}">${icon ? `<ha-icon icon="${icon}" class="status-icon" aria-hidden="true"></ha-icon>` : ''}${short ? `<span class="status-text-5g">${short}</span>` : ''}</span>`;
}

const styles = `
${scheduleStyles}
.planning-tabs{display:flex;margin:0 var(--dp-padding) 14px;border-bottom:1px solid var(--dp-line)}.planning-tabs button{flex:1;min-width:0;border:0;border-bottom:3px solid transparent;border-radius:0;background:transparent;color:var(--dp-muted);padding:9px 8px;min-height:42px;white-space:nowrap}.planning-tabs button[aria-selected=true]{color:var(--primary-text-color);border-bottom-color:var(--dp-accent)}
.planning-tab-label{position:relative;display:inline-block;white-space:nowrap}
#planning-tab-schedules .planning-tab-label:has(.schedule-count){transform:translateX(-8px)}
#planning-tab-schedules .planning-tab-label:has(.schedule-count.capped){transform:translateX(-13px)}
.schedule-count{position:absolute;inset-inline-start:calc(100% + 1px);top:-8px;display:flex;align-items:center;justify-content:center;min-width:15px;height:15px;padding:0 3px;border-radius:999px;background:var(--success-color,#2e7d32);color:#fff;font-size:10px;line-height:15px;font-weight:650;font-variant-numeric:tabular-nums;box-shadow:0 0 0 2px var(--dp-bg);pointer-events:none}
.schedule-count.is-zero{background:var(--dp-line);color:var(--dp-muted)}

.header-buttons{grid-area:1/3/3/4;display:flex;flex-direction:column;gap:5px;align-self:center}.header-buttons .zone-open{min-height:32px;padding:3px 10px;font-size:12px;background:var(--dp-modern-surface,var(--dp-bg));color:var(--dp-muted)}
/* Only constrain the content when the dashboard assigns an explicit row count. */
:host([fixed-height]){height:100%;min-height:0}
:host([fixed-height]) ha-card{height:100%;min-height:0}
:host([fixed-height]) .planner-content{height:100%;overflow-y:auto;overscroll-behavior:contain}

ha-card{position:relative}.consumables-info{min-height:32px;width:100%;padding:3px 10px;background:transparent;color:var(--dp-muted);display:flex;justify-content:center;align-items:center;font-size:12px}.consumables-info.attention{color:var(--error-color,#b3261e);background:color-mix(in srgb,var(--error-color,#b3261e) 10%,var(--dp-bg));border-color:color-mix(in srgb,var(--error-color,#b3261e) 30%,var(--dp-line))}
.robot-group+.robot-group{border-top:1px solid var(--dp-line);padding-top:18px;margin-top:18px}.robot-group .station-row:last-child{margin-bottom:0}.robot-disabled{opacity:.5}.robot-volume{display:flex;align-items:center;gap:10px;width:55%;min-width:0}.robot-volume input{width:100%;min-width:0;accent-color:var(--dp-accent)}.robot-volume output{min-width:38px;text-align:right}.robot-row input[type=time]{color:var(--primary-text-color);background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:8px;padding:8px;font:inherit;min-width:0}.setting-switch{position:relative;display:inline-flex;align-items:center;justify-content:center;flex:none;min-width:48px;min-height:40px}
.robot-disabled:has(.setting-switch.pending){opacity:1}.setting-switch.pending ha-switch{visibility:hidden}.setting-switch-spinner{position:absolute;width:19px;height:19px;border:2px solid var(--dp-line);border-top-color:var(--dp-accent);border-radius:50%;animation:schedule-spin .7s linear infinite;pointer-events:none}
@media(prefers-reduced-motion:reduce){.setting-switch-spinner{animation:none;border-right-color:var(--dp-accent)}}
.info-toolbar{display:flex;align-items:stretch;gap:8px;margin-bottom:20px}.info-tabs{display:flex;flex:1;min-width:0;gap:0;border-bottom:1px solid var(--dp-line)}.info-tabs button{flex:1;min-width:0;min-height:42px;padding:9px 8px;border:0;border-bottom:3px solid transparent;border-radius:0;background:transparent;color:var(--dp-muted);font-size:13px;overflow-wrap:anywhere}@media(max-width:350px){.info-tabs{gap:0}.info-tabs button{font-size:12px;padding:9px 4px}}.info-tabs [aria-selected=true]{color:var(--primary-text-color);border-bottom-color:var(--dp-accent);background:transparent}.info-tabs .attention{color:var(--error-color,#b3261e)}.info-tabs .attention[aria-selected=true]{border-bottom-color:var(--error-color,#b3261e)}.station-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:18px;font-size:13px}.station-row.station-action:not(:last-child){margin-bottom:8px}.station-row small{display:block;color:var(--dp-muted);margin-top:4px}.station-row>span{min-width:0;overflow-wrap:anywhere}.station-label{display:flex;align-items:center;gap:8px}.station-label>span:last-child{min-width:0}.station-row select{flex:0 1 190px;width:55%;min-width:140px;margin-left:auto;font-size:14px}.station-row ha-switch,.station-row ha-button{flex:0 0 auto;margin-left:auto}@media(max-width:400px){.station-row select{font-size:16px}}.consumables-overlay{position:absolute;inset:0;z-index:5;background:#0005;padding:4px;display:flex;align-items:flex-start}.consumables-panel{width:100%;max-height:min(100%,75vh);overflow-y:auto;overscroll-behavior:contain;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:14px;padding:18px;box-shadow:0 8px 30px #0003}.consumables-close{display:flex;align-items:center;justify-content:center;flex:0 0 42px;padding:8px;min-width:42px}.consumables-close ha-icon{width:20px;height:20px;--mdc-icon-size:20px;flex-shrink:0}.consumable-row{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,3fr);align-items:center;gap:20px;margin:0 0 24px;min-height:42px}.consumable-row:last-child{margin-bottom:0}.consumable-label{display:flex;flex-direction:column;align-items:flex-start;gap:5px;min-width:0;font-size:13px;line-height:1.4;overflow-wrap:anywhere}.consumable-value{color:var(--dp-muted);font-size:12px}.consumable-track{height:12px;border-radius:999px;background:color-mix(in srgb,var(--dp-accent) 14%,var(--dp-bg));overflow:hidden}.consumable-fill{display:block;height:100%;border-radius:inherit;background:var(--dp-accent)}.consumable-fill.medium{background:var(--warning-color,#ad6800)}.consumable-fill.low{background:var(--error-color,#b3261e)}.consumable-solution{padding-top:18px;border-top:1px solid var(--dp-line)}.consumable-chip{justify-self:end;display:inline-flex;align-items:center;gap:6px;max-width:100%;padding:7px 10px;border-radius:12px;font-size:12px;line-height:1.4;color:var(--dp-muted);background:var(--dp-line)}.consumable-chip.ready{color:var(--dp-accent);background:var(--dp-soft)}.consumable-chip.refill{color:var(--error-color,#b3261e);background:color-mix(in srgb,var(--error-color,#b3261e) 12%,var(--dp-bg))}.consumable-chip ha-icon{width:16px;height:16px;--mdc-icon-size:16px;flex-shrink:0}@media(max-width:400px){.consumable-row{gap:12px;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.consumable-chip{padding:6px 8px}}

:host{--dp-padding:24px}.header-title{flex:1;min-width:0}.header-title h2{overflow-wrap:anywhere}.robot{flex-shrink:0}.battery{display:flex;align-items:center;gap:4px;flex:none}.battery-value{font-size:12px;font-variant-numeric:tabular-nums}.battery svg{width:32px;height:20px;color:var(--dp-muted)}.battery[data-level=high] svg{color:var(--success-color,#2e7d32)}.battery[data-level=medium] svg{color:var(--warning-color,#ad6800)}.battery[data-level=low] svg{color:var(--error-color,#b3261e)}
:host{display:block;color:var(--primary-text-color,#20272d);font-family:var(--paper-font-body1_-_font-family,Arial,sans-serif);--dp-bg:var(--ha-card-background,var(--card-background-color,#fff));--dp-line:var(--divider-color,#dde3e8);--dp-muted:var(--secondary-text-color,#52616e);--dp-accent:var(--primary-color,#007da5);--dp-soft:color-mix(in srgb,var(--dp-accent) 10%,var(--dp-bg))}
*{box-sizing:border-box}ha-card{display:block;background:var(--dp-bg);border:1px solid var(--dp-line);border-radius:var(--ha-card-border-radius,22px);overflow:hidden;box-shadow:var(--ha-card-box-shadow,0 3px 18px #0000000a)}
.station-status-bar,.station-indicators{display:flex;align-items:center;justify-content:flex-end;gap:8px}
.station-status-bar{padding:6px 24px 0}.station-indicators:empty{display:none}
header,.station-rows{--hud-red:var(--error-color,#db4437);--hud-blue:var(--blue-color,#438bc7);--hud-cyan:var(--dp-accent)}
.station-indicator{display:inline-flex;align-items:center;gap:2px;position:relative;flex:none;color:var(--dp-muted);white-space:nowrap}
.station-indicator .status-icon{display:inline-flex;align-items:center;justify-content:center;line-height:0;width:16px;height:16px;--mdc-icon-size:16px}
.active-red,.alarm-red{color:var(--hud-red)}.active-blue{color:var(--hud-blue)}.active-cyan{color:var(--hud-cyan)}.inactive-muted{color:var(--dp-muted)}
.with-plus::after{content:"+";position:absolute;right:-3px;top:-5px;font:bold 11px/1 monospace;color:currentColor}
.status-text-5g{display:inline-flex;align-items:center;justify-content:center;height:16px;box-sizing:border-box;font:bold 11px/1 ui-monospace,monospace;padding:0 3px;border-radius:3px;background:var(--dp-soft)}
.robot-bumper[data-state=paused]{stroke:#ef8c00}:host([data-theme=modern]) .robot-bumper[data-state=paused]{stroke:var(--warning-color,#c47700)}
.robot-bumper[data-state=fault]{stroke:#e11d2a}.robot-bumper.pulsing{animation:bumper-pulse 2.4s ease-in-out infinite}
@keyframes bumper-pulse{0%,100%{opacity:1}50%{opacity:.45}}
@media(prefers-reduced-motion:reduce){.robot-bumper.pulsing{animation:none}}
@keyframes status-blink{50%{opacity:.4}}.blink{animation:status-blink 1.6s ease-in-out infinite}@media(prefers-reduced-motion:reduce){.blink{animation:none}}
.header-main{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-rows:auto auto;align-items:center;column-gap:13px;padding:4px var(--dp-padding) 10px}
.header-main .robot{grid-row:1/3}.header-title{display:contents}.header-title h2{grid-area:1/2;margin:0}.header-title p{grid-area:2/2}.header-main .header-buttons .consumables-info{align-self:stretch;width:100%}
.robot{background:var(--dp-soft);color:var(--dp-accent);padding:13px;border-radius:15px;display:flex}.robot.robot-integration{width:50px;height:50px;padding:0;background:transparent;border-radius:0;align-items:center;justify-content:center}.robot-illustration{display:block;width:48px;height:48px;flex:none;pointer-events:none;overflow:visible}ha-icon{width:24px;height:24px}h2{font-size:22px;font-weight:500;margin:0 0 5px}p{margin:0;font-size:13px;line-height:1.5;color:var(--dp-muted)}.hint{padding:0 24px 16px}.rooms{padding:0 16px;display:grid;gap:10px}.room{border:1px solid var(--dp-line);border-radius:13px;overflow:hidden}.selected{background:var(--dp-soft)}.room-head{display:flex;align-items:center;gap:8px;padding:10px 12px;min-height:74px}.pick{display:flex;align-items:center;gap:11px;flex:1;min-width:0;min-height:44px}.name{display:block;font-size:15px;font-weight:500;margin-bottom:5px;overflow-wrap:anywhere}.summary{display:block;font-size:12px;color:var(--dp-muted);line-height:1.5}.fields{border-top:1px solid var(--dp-line);padding:14px;background:var(--dp-bg);display:grid;grid-template-columns:1fr 1fr;gap:14px}.field{display:flex;flex-direction:column;gap:7px;font-size:12px;color:var(--dp-muted)}.mode{grid-column:1/-1}.fine{grid-column:1/-1;border-top:1px solid var(--dp-line);padding-top:12px;margin-top:2px}.badge{color:var(--warning-color,#995000);font-size:11px;line-height:1.5}button,select,input{font:inherit}button,select{color:inherit;border:1px solid var(--dp-line);background:var(--dp-bg);border-radius:9px;min-height:42px;padding:9px 12px;font-size:13px}button{cursor:pointer}button:disabled{cursor:default;opacity:.5}select{width:100%;min-width:0;background:var(--secondary-background-color,#f5f7f9);font-size:14px}select:disabled{color:var(--dp-muted);opacity:.65}.mode select{background:var(--dp-soft)}input[type=checkbox]{width:19px;height:19px;accent-color:var(--dp-accent);flex-shrink:0}.expand{border:0;background:transparent;white-space:nowrap}.order{display:flex;gap:5px;margin-top:10px}.order button{min-width:42px}footer{padding:20px 24px 24px}.draft-status{position:relative;padding-left:28px}.discard-draft{position:absolute;right:calc(100% - 24px);top:50%;transform:translateY(-50%);display:flex;align-items:center;justify-content:center;width:24px;height:24px;min-height:0;padding:0;border:0;background:transparent;color:var(--dp-muted)}.discard-draft ha-icon{width:20px;height:20px;--mdc-icon-size:20px;pointer-events:none}.summary-line{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:15px;font-size:13px}.actions{display:flex;gap:10px}.actions button{flex:1;min-height:46px}.start{background:var(--dp-accent);border-color:transparent;color:var(--text-primary-color,#fff)}.notice{margin-top:12px}.error{color:var(--error-color,#b3261e)}.reset{margin-top:12px;background:transparent}.empty{padding:16px 24px}.status{color:var(--dp-muted)}button:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid var(--dp-accent);outline-offset:3px}[hidden]{display:none!important}
.session{padding:4px 24px 0}.session h3{margin:0 0 8px;font-size:20px;font-weight:500}.session .detail{margin-bottom:18px}.requested-label{font-size:12px;color:var(--dp-muted);margin-bottom:8px}.requested{display:flex;flex-wrap:wrap;gap:7px;list-style:none;padding:0;margin:0 0 10px}.requested li{background:var(--dp-soft);border:1px solid var(--dp-line);border-radius:18px;padding:7px 11px;font-size:13px;overflow-wrap:anywhere}.requested-note{margin-bottom:18px}.map-section{margin-top:20px}.map-title{font-size:13px;font-weight:500;margin:0 0 10px}.session-actions button{display:flex;align-items:center;justify-content:center;gap:8px}.session-actions ha-icon{width:20px;height:20px}.session-footer{padding-top:20px}
.activity-status{display:flex;align-items:center;gap:10px;margin:0 var(--dp-padding) 16px;padding:12px;border-radius:10px;background:var(--dp-soft);font-size:14px}.activity-status ha-icon{flex-shrink:0}.activity-copy{flex:1;min-width:0}.activity-remaining,.activity-start-block,.activity-fault{display:block;margin-top:4px;font-size:12px;line-height:1.5;color:var(--dp-muted);font-variant-numeric:tabular-nums}.drying-progress{display:block;width:100%;height:7px;margin-top:8px;border-radius:999px;background:var(--dp-line);overflow:hidden}.drying-progress-fill{display:block;height:100%;width:0;border-radius:inherit;background:var(--dp-accent)}.drying-control{flex-shrink:0}.cancel-drying{display:flex;align-items:center;justify-content:center;padding:8px;min-width:42px}.map-title{padding:0 var(--dp-padding)}
.map-title{margin-bottom:4px}.map-caption{padding:0 var(--dp-padding);margin:0 0 10px;font-size:12px}.action-message:empty{display:none}.session-actions .pause{background:#ef8c00;color:#171717;border-color:transparent}.session-actions .resume{background:#2e7d32;color:#fff;border-color:transparent}.session-actions .home{background:#c62828;color:#fff;border-color:transparent}
@media(max-width:400px){:host{--dp-padding:15px}.hint{padding:0 15px 14px}.rooms{padding:0 10px}footer{padding:18px 15px}.session{padding:4px 15px 0}.expand span{display:none}.actions{flex-direction:column}.session-actions{flex-direction:row}select{font-size:16px}.fields{gap:12px}}


:host([data-theme=modern]) .header-main{position:relative}
:host([data-theme=modern]) .robot{position:relative}
.robot-warning{position:absolute;inset:0;width:100%;height:100%;padding:0;min-height:0;border:0;border-radius:inherit;background:transparent}
.robot-warning ha-icon{position:absolute;right:-3px;bottom:-3px;width:17px;height:17px;--mdc-icon-size:17px;color:var(--warning-color,#e6ac00);background:var(--dp-bg);border-radius:4px}
.header-notice{position:absolute;inset:2px var(--dp-padding) 6px;z-index:2;display:flex;align-items:center;gap:10px;padding:5px 10px;border-radius:10px;background:var(--dp-soft);border:1px solid var(--dp-line);color:var(--dp-text)}.header-notice-copy{flex:1;min-width:0;max-height:100%;overflow:auto;font-size:14px;overflow-wrap:anywhere}.header-notice.error{color:var(--error-color,#db4437)}
.header-fault{position:absolute;inset:2px var(--dp-padding) 6px;z-index:2;display:flex;align-items:center;gap:10px;padding:5px 10px;border-radius:10px;background:var(--dp-soft);border:1px solid var(--dp-line)}
.header-fault-copy{flex:1;min-width:0;max-height:100%;overflow-y:auto;overscroll-behavior:contain;font-size:14px;overflow-wrap:anywhere}
.header-fault-detail{margin-top:2px;font-size:12px;line-height:1.35}
.header-fault-close{display:flex;align-items:center;justify-content:center;flex:none;min-width:36px;min-height:36px;padding:6px;background:transparent}

/* Normal Modern statuses share one fixed slot; faults retain their existing presentation. */
:host([data-theme=modern]) header{margin-bottom:0}
:host([data-theme=modern]) .activity-status:not(.compact-status){margin-top:12px}
:host([data-theme=modern]) .compact-status{height:44px;margin:0 var(--dp-padding);padding:0;border-radius:0;background:transparent;gap:8px;position:relative;font-size:13px}
:host([data-theme=modern]) .compact-status .activity-icon{display:flex;align-items:center;justify-content:center;width:18px;height:18px;--mdc-icon-size:18px}
:host([data-theme=modern]) .compact-status .activity-copy{flex:0 1 auto;align-self:stretch;position:relative;display:flex;flex-direction:column;justify-content:center;white-space:nowrap;overflow:hidden;line-height:20px}
:host([data-theme=modern]) .compact-status .activity-heading{display:flex;align-items:baseline;min-width:0}
:host([data-theme=modern]) .compact-status .activity-text{min-width:0;overflow:hidden;text-overflow:ellipsis}
:host([data-theme=modern]) .compact-status .activity-remaining{display:inline;flex:none;white-space:pre;margin:0;font-size:12px}
:host([data-theme=modern]) .compact-status .activity-start-block{display:none}
:host([data-theme=modern]) .compact-status.has-drying .activity-start-block:not([hidden]){display:block}
:host([data-theme=modern]) .compact-status .drying-progress{position:absolute;left:0;right:0;bottom:2px;width:auto;height:3px;margin:0}
:host([data-theme=modern]) .compact-status .cancel-drying{min-width:36px;min-height:36px;width:36px;height:36px;padding:7px;background:transparent;border-color:transparent}
:host([data-theme=modern]) .compact-status .cancel-drying ha-icon{width:18px;height:18px;--mdc-icon-size:18px}
:host([data-theme=modern]) .session{height:43px;min-height:43px;margin:0 var(--dp-padding) 14px;padding:0;display:flex;align-items:center}
:host([data-theme=modern]) .requested{width:100%;margin:0;flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;align-items:center}
:host([data-theme=modern]) .requested li{flex:none;white-space:nowrap;padding:5px 10px}
:host([data-theme=modern]) .map-section{margin:0;padding:20px}
:host([data-theme=modern]) .session-footer{margin:14px var(--dp-padding) 0;padding:12px 0 14px;border-top:1px solid var(--dp-line)}
:host([data-theme=modern]) .session-actions button{min-height:38px;padding:6px 12px;border-radius:13px;border:1px solid color-mix(in srgb,var(--session-color) 45%,var(--dp-line));background:color-mix(in srgb,var(--session-color) 12%,var(--dp-modern-surface));color:var(--session-color)}
:host([data-theme=modern]) .session-actions .pause{--session-color:var(--warning-color,#c47700)}
:host([data-theme=modern]) .session-actions .resume{--session-color:var(--success-color,#2e7d32)}
:host([data-theme=modern]) .session-actions .home{--session-color:var(--error-color,#c62828)}

/* Cool neutral surfaces keep cyan reserved for active controls. */
:host([data-theme=modern]){--dp-modern-surface:color-mix(in srgb,#506773 14%,var(--dp-bg));--dp-modern-control:color-mix(in srgb,#8099a5 18%,var(--dp-modern-surface));--dp-modern-control-border:color-mix(in srgb,var(--primary-text-color,#20272d) 24%,var(--dp-modern-control))}
:host([data-theme=modern]) .mode select,:host([data-theme=modern]) .segments{background:var(--dp-modern-control);border-color:var(--dp-modern-control-border)}
:host([data-theme=modern]) ha-card{container-type:inline-size}
:host([data-theme=modern]) .rooms{padding:0 var(--dp-padding);gap:10px}
:host([data-theme=modern]) .room{border-radius:16px;border-color:var(--dp-line);background:var(--dp-modern-surface)}
:host([data-theme=modern]) .room.selected{background:color-mix(in srgb,var(--room-color) 10%,var(--dp-bg));border-color:color-mix(in srgb,var(--room-color) 55%,var(--dp-line))}
:host([data-theme=modern]) .room.open{border-color:#18c5d9;box-shadow:0 0 0 1px #18c5d9,0 0 12px #18c5d91a}
:host([data-theme=modern]) .room-head{padding:10px 12px;min-height:72px}
:host([data-theme=modern]) .pick{position:relative;flex:0 0 15%;min-width:44px;min-height:44px;justify-content:center;align-self:stretch;cursor:pointer}
:host([data-theme=modern]) .room-settings-toggle{flex:1;min-width:0;align-self:stretch;display:flex;align-items:center;justify-content:space-between;gap:8px;text-align:left;white-space:normal;padding:0 4px}
:host([data-theme=modern]) .room-settings-toggle span{display:block}
:host([data-theme=modern]) .room-plain .pick{flex:1;justify-content:flex-start;gap:12px}.room-settings-copy{min-width:0}
.planning-settings:empty{display:none}.planning-settings{margin:16px var(--dp-padding,24px) 0}.planning-setting{border:1px solid var(--dp-line);border-radius:13px;padding:14px 16px;background:var(--dp-bg)}.planning-setting-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;font-size:13px}.planning-setting-head>span{min-width:0;line-height:1.4}.planning-setting-head output{flex-shrink:0;border-radius:8px;padding:4px 8px;background:var(--dp-soft);color:var(--primary-text-color);font-size:12px;overflow-wrap:anywhere;max-width:40%}.planning-setting-hint{font-size:11px;line-height:1.4;margin-top:8px}.planning-setting .slider-options{display:flex;justify-content:space-between;gap:6px;margin:2px 0 0;min-height:28px}.planning-settings .planning-setting .slider-options button{position:static;left:auto;transform:none;width:auto;flex:1;font-size:12px;text-align:center;padding:2px;overflow-wrap:anywhere}.planning-setting .slider-options button:first-child{text-align:left}.planning-setting .slider-options button:last-child{text-align:right}

.mode-spacer{display:none}
:host([data-theme=modern]) .pick input{position:absolute;width:1px;height:1px;opacity:0}
.selection-circle{display:flex;align-items:center;justify-content:center;width:32px;height:32px;flex:none;border:2px solid var(--dp-muted);border-radius:50%;font-weight:650;color:var(--primary-text-color)}
.selected .selection-circle{background:var(--room-color);border-color:var(--room-color);color:#102026}
.pick input:focus-visible+.selection-circle{outline:2px solid var(--dp-accent);outline-offset:4px}
.pick input:disabled~span{opacity:.5}
:host([data-theme=modern]) .fields{display:flex;flex-direction:column;gap:8px;padding:10px 14px;background:var(--dp-modern-surface)}
.modern-control{min-width:0}
.field-label{display:block;font-size:13px;margin-bottom:2px;color:var(--primary-text-color)}
/* Tick centers share the native thumb's travel area (half its width at each end). */
.stepped-slider{position:relative;height:24px}
.slider-ticks{position:absolute;inset:0 10px;pointer-events:none;color:var(--dp-muted)}
.slider-ticks::before{content:"";position:absolute;left:0;right:0;top:10.5px;height:3px;border-radius:2px;background:currentColor;opacity:.65}
.slider-tick{position:absolute;left:calc(var(--stop)*100%);top:12px;transform:translate(-50%,-50%);width:10px;height:10px;border-radius:50%;background:currentColor}
.modern-control .stepped-slider input[type=range]{position:relative;z-index:1;display:block;appearance:none;-webkit-appearance:none;width:100%;height:24px;margin:0;padding:0;border:0;background:transparent;cursor:pointer}
.stepped-slider input::-webkit-slider-runnable-track{height:3px;background:transparent;border:0}
.stepped-slider input::-moz-range-track{height:3px;background:transparent;border:0}
.stepped-slider input::-moz-range-progress{background:transparent}
.stepped-slider input::-webkit-slider-thumb{-webkit-appearance:none;box-sizing:border-box;width:20px;height:20px;margin-top:-8.5px;border:3px solid #f4fbfd;border-radius:50%;background:var(--dp-accent);box-shadow:0 1px 3px #0003}
.stepped-slider input::-moz-range-thumb{box-sizing:border-box;width:20px;height:20px;border:3px solid #f4fbfd;border-radius:50%;background:var(--dp-accent);box-shadow:0 1px 3px #0003}
.stepped-slider.disabled{opacity:.45}
.modern-control .stepped-slider input:disabled{cursor:default}
.slider-options{position:relative;min-height:28px;margin:0 10px}.slider-options button{position:absolute;left:calc(var(--stop)*100%);transform:translateX(-50%);width:30%}.slider-options button:first-child{left:-10px;transform:none;text-align:left;padding-left:0}.slider-options button:last-child{left:calc(100% + 10px);transform:translateX(-100%);text-align:right;padding-right:0}
.slider-options button{border:0;background:transparent;padding:2px 2px;min-height:28px;font-size:12px;color:var(--dp-muted);overflow-wrap:anywhere}
.slider-options button[aria-pressed=true]{color:var(--dp-accent);font-weight:650}
.segments{display:flex;gap:3px;padding:3px;border:1px solid var(--dp-line);border-radius:12px}
.segments button{flex:1;min-width:0;min-height:32px;border:0;background:transparent;padding:3px 8px;position:relative}
.segments button::after{content:"";position:absolute;inset:-6px 0}
.segments button[aria-pressed=true]{background:var(--dp-accent);color:var(--text-primary-color,#fff)}
:host([data-theme=modern]) .actions button{border-radius:13px}
/* Compact Modern planner framing. */
:host([data-theme=modern]){--dp-padding:20px}
:host([data-theme=modern]) .station-status-bar{padding-inline:var(--dp-padding)}
:host([data-theme=modern]) header{border-bottom:1px solid var(--dp-line);margin-bottom:0}
:host([data-theme=modern]) .consumables-info:not(.attention),:host([data-theme=modern]) button[data-action=save]{background:var(--dp-modern-surface)}
:host([data-theme=modern]) footer:not(.session-footer){margin:14px var(--dp-padding) 0;padding:12px 0 14px;border-top:1px solid var(--dp-line)}
:host([data-theme=modern]) footer:not(.session-footer) .actions button{min-height:38px;padding-block:6px}
:host([data-theme=modern]) footer:not(.session-footer) .notice:empty{display:none}
:host([data-theme=modern]) .field.mode{font-size:13px;color:var(--primary-text-color,#20272d)}
:host([data-theme=modern]) .mode select:not(:disabled){color:var(--dp-accent)}
:host([data-theme=modern]) .mode select option{color:var(--primary-text-color,#20272d);background:var(--dp-modern-control)}
@media(max-width:400px){:host([data-theme=modern]){--dp-padding:12px}}
:host([data-theme=modern]) .fields .field{gap:4px}
:host([data-theme=modern]) .mode select{min-height:35px;padding:5px 10px;font-size:13px}
@media(max-width:400px){:host([data-theme=modern]) .mode select{font-size:16px}}
/* Keep room rows content-sized; the final flexible row absorbs panel height. */
@container (min-width:480px) and (max-width:620px){
  :host([data-theme=modern]) .room-head{padding:8px;gap:4px}
  :host([data-theme=modern]) .pick{gap:8px}
  :host([data-theme=modern]) .selection-circle{width:28px;height:28px}
  :host([data-theme=modern]) .room-settings-toggle{padding:0;min-height:44px}
}
@container(min-width:480px){
  :host([data-theme=modern]) .modern-rooms{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);column-gap:18px;row-gap:0;grid-template-rows:repeat(var(--room-count),max-content) minmax(0,1fr);align-items:start}
  :host([data-theme=modern]) .modern-rooms:not(:has(.room.open)){grid-template-columns:1fr}
  :host([data-theme=modern]) .modern-rooms .room{display:contents}
  :host([data-theme=modern]) .modern-rooms .room-head{grid-column:1;grid-row:var(--room-row);margin-bottom:10px;border:1px solid var(--dp-line);border-radius:16px;background:var(--dp-modern-surface)}
  :host([data-theme=modern]) .modern-rooms .room:last-child .room-head{margin-bottom:0}
  :host([data-theme=modern]) .modern-rooms .fields:not(:has(>.mode-spacer)){justify-content:space-between}
  :host([data-theme=modern]) .modern-rooms .selected .room-head{border-color:color-mix(in srgb,var(--room-color) 55%,var(--dp-line));background:color-mix(in srgb,var(--room-color) 10%,var(--dp-bg))}
  :host([data-theme=modern]) .modern-rooms .open .room-head{border-color:#18c5d9;box-shadow:0 0 0 1px #18c5d9,0 0 12px #18c5d91a}
  :host([data-theme=modern]) .modern-rooms .fields{grid-column:2;grid-row:1 / span calc(var(--room-count) + 1);align-self:stretch;position:relative;border:1px solid var(--dp-line);border-radius:16px;background:var(--dp-modern-surface);overflow:visible}
  /* Reserve the omitted control at the bottom, only in split view. */
  :host([data-theme=modern]) .mode-spacer{display:block;visibility:hidden;order:1}
  :host([data-theme=modern]) .fields:has(>.mode-spacer)>:not(.mode-spacer){translate:0 var(--field-shift,0px)}
  :host([data-theme=modern]) .modern-rooms .fields::before{content:"";position:absolute;left:-8px;top:calc(var(--pointer-y,38px) - 8px);width:14px;height:14px;background:var(--dp-modern-surface);border-left:1px solid var(--dp-line);border-bottom:1px solid var(--dp-line);transform:rotate(45deg)}
}

/* Compact only the tiles, not their 10px gaps, when five or more rooms are shown. */
:host([data-theme=modern]) .modern-rooms:has(>.room:nth-child(5)) .room-head{min-height:52px;padding-block:3px}
:host([data-theme=modern]) .modern-rooms:has(>.room:nth-child(5)) .name{margin-bottom:2px;line-height:1.2}
:host([data-theme=modern]) .modern-rooms:has(>.room:nth-child(5)) .summary{line-height:1.25}

@container(min-width:480px){
  /* With exactly five rooms, share the settings height equally between tiles. */
  :host([data-theme=modern]) .modern-rooms:has(>.room:nth-child(5)):not(:has(>.room:nth-child(6))):has(.room.open){grid-template-rows:repeat(5,minmax(52px,1fr));row-gap:10px}
  :host([data-theme=modern]) .modern-rooms:has(>.room:nth-child(5)):not(:has(>.room:nth-child(6))):has(.room.open) .room-head{margin-bottom:0;align-self:stretch}
  :host([data-theme=modern]) .modern-rooms:has(>.room:nth-child(5)):not(:has(>.room:nth-child(6))):has(.room.open) .fields{grid-row:1 / span 5}
}

`;

const registryRefreshEvents = new EventTarget();

// Each instance owns its draft. Registry refresh also catches disabled or renamed entities.
// HA mounts the visual editor and its preview in separate shadow trees in one dialog.
const sessionPreviewOwners = new WeakMap();
const zonePreviewOwners = new WeakMap();
const previewViewChanged = 'dyson-planner-preview-view';

function cardEditorDialog(element, previewOnly = false) {
  let preview = false;
  for (let node = element; node; node = node.assignedSlot || node.parentElement || node.getRootNode()?.host) {
    if (node.matches?.('hui-card[preview], hui-section[preview]')) preview = true;
    if (node.localName === 'hui-dialog-edit-card') return !previewOnly || preview ? node : null;
  }
  return null;
}

class DysonRegistryElement extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this.registry = []; this.devices = []; this.registryError = ''; }
  connectedCallback() {
    this._onRegistryRefresh = event => {
      if (event.detail.source === this || event.detail.connection !== this._hass?.connection) return;
      this.registry = event.detail.rows;
      this.devices = event.detail.devices ?? this.devices;
      this.registryError = '';
      this._registryLoaded = true;
      this.update?.();
    };
    registryRefreshEvents.addEventListener('refresh', this._onRegistryRefresh);
    this.loadRegistry();
    this._registryTimer = setInterval(() => this.loadRegistry(), 30000);
  }
  disconnectedCallback() { clearInterval(this._registryTimer); registryRefreshEvents.removeEventListener('refresh', this._onRegistryRefresh); }
  get adapter() { return getIntegrationAdapter(this.config, this.registry, this._hass); }
  get language() { return resolveLanguage(this.config, this._hass); }
  t(key, params) { return translate(this.language, key, params); }
  ht(key, params) { return escapeHtml(this.t(key, params)); }
  set hass(value) {
    const changed = this._hass?.connection !== value?.connection;
    this._hass = value;
    if (changed) { this.registry = []; this.devices = []; this._registryLoaded = false; }
    if (this.isConnected && !this._registryLoaded && !this._loadingRegistry) this.loadRegistry();
    this.update?.();
  }
  get hass() { return this._hass; }
  async loadRegistry(notifyPeers = false) {
    if (!this._hass || this._loadingRegistry) return;
    this._loadingRegistry = true;
    const connection = this._hass.connection;
    try {
      const [rows, devices] = await Promise.all([
        this._hass.callWS({ type: 'config/entity_registry/list' }),
        this._hass.callWS({ type: 'config/device_registry/list' }).catch(() => null),
      ]);
      if (this._hass.connection !== connection) return;
      this.registry = rows;
      if (devices) this.devices = devices;
      this.registryError = '';
      this._registryLoaded = true;
      if (notifyPeers) registryRefreshEvents.dispatchEvent(new CustomEvent('refresh', { detail: { source: this, connection, rows, devices: this.devices } }));
    } catch {
      this.registryError = 'Could not read the entity registry. Check the connection and user permissions.';
      this._registryLoaded = true;
    } finally { this._loadingRegistry = false; this.update?.(); }
  }
  paint(html, view = null) {
    if (html === this._html) return;
    cancelAnimationFrame(this._plannerScrollFrame);
    cancelAnimationFrame(this._scheduleScrollFrame);
    const dialog = this.scheduleDialog;
    const dialogScrollTop = dialog && this._paintedScheduleDialog === dialog
      ? this.shadowRoot.querySelector('.schedule-overlay')?.scrollTop : null;
    const previous = this.shadowRoot.querySelector('.planner-content');
    const keepPlanner = view === 'planner' && this._paintedView === 'planner' && previous;
    const keepSchedules = view === 'schedules' && this._paintedView === 'schedules' && previous;
    const scrollTop = keepPlanner ? previous.scrollTop : 0;
    const active = this.shadowRoot.activeElement;
    const focused = active?.dataset.focus;
    const selection = active?.tagName === 'INPUT' && active.type === 'text' ? [active.selectionStart, active.selectionEnd, active.selectionDirection] : null;
    this._html = html;
    this._paintedView = view;
    this._paintedScheduleDialog = dialog;
    if (keepPlanner || keepSchedules) {
      // Retain HA's mounted card/slot for local planner and schedule updates.
      // Recreating its asynchronous Lit slot briefly removes all measurable
      // content and makes schedule menu positioning close a just-opened menu.
      const template = document.createElement('template');
      template.innerHTML = html;
      const incoming = template.content.querySelector('.planner-content');
      previous.replaceChildren(...incoming.childNodes);
      const overlay = this.shadowRoot.querySelector('.consumables-overlay');
      const incomingOverlay = template.content.querySelector('.consumables-overlay');
      if (overlay && incomingOverlay) overlay.replaceWith(incomingOverlay);
      const scheduleOverlay = this.shadowRoot.querySelector('.schedule-overlay');
      const incomingSchedule = template.content.querySelector('.schedule-overlay');
      if (scheduleOverlay && incomingSchedule) scheduleOverlay.replaceWith(incomingSchedule);
      else if (incomingSchedule) this.shadowRoot.querySelector('ha-card').append(incomingSchedule);
      else scheduleOverlay?.remove();
      const menuOverlay = this.shadowRoot.querySelector('.schedule-menu-overlay');
      const incomingMenu = template.content.querySelector('.schedule-menu-overlay');
      if (menuOverlay && incomingMenu) menuOverlay.replaceWith(incomingMenu);
      else if (incomingMenu) this.shadowRoot.querySelector('ha-card').append(incomingMenu);
      else menuOverlay?.remove();
    } else {
      // Keep the original rendering path for the session, editor and view transitions.
      this.shadowRoot.innerHTML = html;
    }
    if (focused) {
      const next = Array.from(this.shadowRoot.querySelectorAll('[data-focus]')).find(e => e.dataset.focus === focused);
      if (keepPlanner || view === 'schedules') next?.focus({ preventScroll: true });
      else next?.focus();
      if (selection) next?.setSelectionRange(...selection);
    }
    if (keepPlanner) {
      previous.scrollTop = scrollTop;
      this._plannerScrollFrame = requestAnimationFrame(() => {
        if (previous.isConnected && this._paintedView === 'planner') previous.scrollTop = scrollTop;
      });
    }
    this.updateScheduleDialog?.();
    if (dialogScrollTop != null) {
      const overlay = this.shadowRoot.querySelector('.schedule-overlay');
      const restore = () => {
        if (overlay?.isConnected && this.scheduleDialog === dialog) overlay.scrollTop = dialogScrollTop;
      };
      restore();
      this._scheduleScrollFrame = requestAnimationFrame(restore);
    }
  }
}

class DysonCleaningPlannerCard extends DysonRegistryElement {
  constructor() {
    super(); this.selected = []; this.settingDraft = {}; this.planningDraft = {}; this.dirty = false; this.busy = false; this.expanded = new Set(); this.message = '';
    this._headerFaultKey = ''; this._headerFaultDismissed = false;
    this.controlBusy = false; this.pendingStart = false; this.requestedPlan = null; this.zoneView = false;

    this.shadowRoot.addEventListener('planner-notice', () => this.updateHeaderNotice());
    this.shadowRoot.addEventListener('zone-started', event => this.zoneStarted(event.detail));
    this.shadowRoot.addEventListener('change', event => this.onChange(event));
    this.shadowRoot.addEventListener('input', event => this.scheduleInput(event));
    this.shadowRoot.addEventListener('click', event => this.onClick(event));
    this.shadowRoot.addEventListener('keydown', event => {
      if (this.scheduleKeydown(event)) return;
      if (!this.consumablesOpen && event.target.matches('.planning-tabs [role="tab"]')
          && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const tabs = [...this.shadowRoot.querySelectorAll('.planning-tabs [role="tab"]')].map(tab => tab.dataset.action);
        const index = tabs.indexOf(event.target.dataset.action);
        const action = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1)
          : tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        this.shadowRoot.querySelector(`.planning-tabs [data-action="${action}"]`)?.click();
        this.shadowRoot.querySelector('.planning-tabs [aria-selected="true"]')?.focus({ preventScroll: true });
        return;
      }
      if (!this.consumablesOpen) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); this.toggleConsumables(false); }
      if (event.key === 'Tab') {
        const panel = this.shadowRoot.querySelector('.consumables-panel');
        const items = [...panel.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), ha-switch:not([disabled]), ha-button:not([disabled])')].filter(el => (['ha-switch', 'ha-button'].includes(el.localName) || el.tabIndex >= 0) && el.getClientRects().length);
        const first = items[0], last = items.at(-1), active = this.shadowRoot.activeElement;
        if (event.shiftKey && active === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && active === last) { event.preventDefault(); first?.focus(); }
      }
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) && event.target.dataset.infoTab) {
        event.preventDefault();
        const tabs = this.adapter.infoTabs ?? ['station', 'robot', 'consumables'];
        const index = tabs.indexOf(event.target.dataset.infoTab);
        this.infoTab = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1)
          : tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        this.updateConsumables(); this.shadowRoot.querySelector(`[data-info-tab="${this.infoTab}"]`).focus();
      }
    });
  }
  static getConfigElement() { return document.createElement('dyson-cleaning-planner-card-editor'); }
  static getStubConfig(hass) {
    return { type: 'custom:dyson-cleaning-planner-card', entity: defaultIntegrationEntity(hass) };
  }
  setConfig(config) {
    let normalized;
    try { normalized = normalizeConfig(config); }
    catch (error) { throw new Error(translate(resolveLanguage(config, this._hass), error)); }
    const withoutLanguage = value => JSON.stringify({ ...value, language: undefined });
    if (this.config && withoutLanguage(this.config) === withoutLanguage(normalized)) {
      // Keep the configuration identity used by in-flight save/start requests.
      this.config.language = normalized.language; this.update(); return;
    }
    if (this.config?.entity !== config.entity || (this.config?.integration ?? 'auto') !== (config.integration ?? 'auto')) {
      this.clearSessionEnd();
      this.clearPendingStart(); this.requestedPlan = null; this.sessionObserved = false;
    }
    this.consumablesOpen = false; this.stationMessage = ''; this.stationError = false;
    this.cancelSettingSwitch();
    this.robotMessage = ''; this._robotMessageContext = {};
    this.zoneView = false; this.zoneDraft = null;
    this.cancelScheduleFeedback();
    this._scheduleCountdown = null;
    this.schedulesView = false; this.scheduleDialog = null; this.scheduleMenu = null; this.scheduleSending = null;
    this.scheduleScrollTop = 0;
    this.config = normalized;
    this.setAttribute('data-theme', this.config.theme);
    const rows = config.grid_options?.rows ?? config.layout_options?.grid_rows;
    this.toggleAttribute('fixed-height', typeof rows === 'number' && Number.isFinite(rows) && rows > 0);
    this.initialized = false; this.dirty = false; this.selected = []; this.settingDraft = {}; this.planningDraft = {}; this.expanded.clear(); this.message = ''; this.lastRooms = [];
    this.update();
  }
  connectedCallback() {
    this._previewDialog = cardEditorDialog(this, true);
    this._previewChanged ??= () => this.update();
    this._previewDialog?.addEventListener(previewViewChanged, this._previewChanged);
    super.connectedCallback();
    this._modernObserver ??= new ResizeObserver(() => { this.positionModernPointer(); this.updateScheduleListLayout(); });
    this._modernObserver.observe(this);
    this.update();
    clearInterval(this._dockTimer);
    this._dockTimer = setInterval(() => {
      if (!this.isConnected || document.hidden) return;
      if (this.adapter.usesDockTimer && this.model
          && this.shadowRoot.querySelector('.activity-remaining:not([hidden])')) this.updateStatus();
      if (this.schedulesView) this.updateScheduleCountdown();
    }, 1000);
  }
  disconnectedCallback() {
    this._detachRevision = (this._detachRevision ?? 0) + 1;
    this.cancelSettingSwitch();
    this.cancelScheduleFeedback();
    this.scheduleDialog = null;
    this._previewDialog?.removeEventListener(previewViewChanged, this._previewChanged);
    this._previewDialog = null;
    this._modernObserver?.disconnect();
    clearInterval(this._dockTimer);
    super.disconnectedCallback(); this.clearPendingStart(); this.clearSessionEnd();
  }
  clearPendingStart() { clearTimeout(this._startTimer); this.pendingStart = false; }
  clearSessionEnd() { clearTimeout(this._sessionEndTimer); this._sessionEndTimer = null; }
  deferSessionEnd() {
    if (this._sessionEndTimer) return;
    const entity = this.config.entity;
    // Keep the request briefly across idle/docked telemetry between active states.
    // The planner still returns immediately; badges are only shown in session view.
    this._sessionEndTimer = setTimeout(() => {
      this._sessionEndTimer = null;
      if (!this.isConnected || this.config.entity !== entity || this.busy || this.pendingStart || this.view.active) return;
      this.requestedPlan = null; this.sessionObserved = false;
      this.render();
    }, 5000);
  }
  get view() {
    const view = this.adapter.cleaningView(this._hass, this.config?.entity, (this.busy && !this.saving) || this.pendingStart, this.registry);
    if (!view.active && this._previewDialog && sessionPreviewOwners.has(this._previewDialog)) {
      return { active: true, live: true, simulated: true };
    }
    return view;
  }
  get showSessionMap() { return this.config?.show_camera && this.adapter.supportsSessionMap !== false; }
  getCardSize() { return this.view.active ? (this.showSessionMap ? 9 : 5) : 3 + (this.model?.rooms.length ?? 3); }
  getGridOptions() { return { columns: 12, min_columns: 9, rows: 'auto', min_rows: 1 }; }
  getModel() { return this.adapter.discover(this._hass, this.registry, this.config, this.lastRooms); }
  getRoomPlanningState(model = this.model) {
    return this.adapter.roomPlanningState(this._hass, this.registry, this.config, model, this.settingDraft, this.planningDraft);
  }
  planningSettings() { return this.adapter.planningSettings?.(this._hass, this.registry, this.config) ?? []; }
  resetDraft(clearMessage = true) {
    this.draftContext = this.adapter.roomContext(this._hass, this.config.entity, this.registry);
    this.selected = this.model.rooms.filter(r => !r.excluded && r.available && roomKey(r) && this.adapter.roomSelectionState(this._hass, r.entity, r) === 'on').map(roomKey);
    this.settingDraft = {}; this.planningDraft = {};
    this.baseline = this.liveSignature(); this.dirty = false;
    if (clearMessage) { this.message = ''; this.error = false; }
  }
  liveSignature() {
    return JSON.stringify([...this.model.rooms.map(r => [r.roomId, roomKey(r), this.adapter.roomSelectionState(this._hass, r.entity, r), Object.entries(r.settings ?? {}).map(([key, field]) => [key, field.entity, field.value])]),
      ...this.planningSettings().map(field => ['planning',field.key,field.value,field.options])]);
  }
  updateDirty() {
    const live = this.model.rooms.filter(r => !r.excluded && r.available && roomKey(r) && this.adapter.roomSelectionState(this._hass, r.entity, r) === 'on').map(roomKey);
    this.dirty = Object.keys(this.settingDraft).length > 0 || Object.keys(this.planningDraft ?? {}).length > 0 || JSON.stringify(this.selected) !== JSON.stringify(live);
  }
  update() {
    if (!this.config || !this._hass) return;
    const previous = this.model;
    this.model = this.getModel();
    // Preserve a local selection across entity renames using the robot's room ID.
    if (this.dirty && previous && this.draftContext === this.adapter.roomContext(this._hass, this.config.entity, this.registry)) this.selected = this.selected.map(entity => {
      const id = previous.rooms.find(r => roomKey(r) === entity)?.roomId;
      const matches = this.model.rooms.filter(r => id && r.roomId === id);
      return matches.length === 1 ? roomKey(matches[0]) : entity;
    });
    const reported = this.adapter.cleaningView(this._hass, this.config.entity, false, this.registry);
    if (reported.active || this.busy || this.pendingStart) this.clearSessionEnd();
    if (reported.live) {
      this.clearPendingStart(); this.sessionObserved = true;
    } else if (!reported.active && !this.busy && !this.pendingStart && this.sessionObserved) {
      this.deferSessionEnd();
      this.message = ''; this.error = false;
    }
    if (this.model.rooms.length) this.lastRooms = this.model.rooms;
    else if (!this.adapter.hasRoomList(this._hass, this.config.entity)) this.model.rooms = (this.lastRooms ?? []).map(r => ({ ...r, available: false }));
    if ((!this.initialized || !this.dirty) && !this.view.active && !this.busy && this.model.rooms.length) {
      this.resetDraft(false); this.initialized = true;
    }
    this.reconcileScheduleConfirmation();
    this.reconcileSettingSwitch();
    this.render();
  }
  onChange(event) {
    if (event.target.dataset.scheduleToggle !== undefined) {
      this.submitSchedule(Number(event.target.dataset.scheduleToggle), event.target.checked); return;
    }
    if (this.scheduleDialog) { this.scheduleInput(event); return; }
    if (event.target.dataset.robotSetting) {
      const el = event.target;
      const value = el.localName === 'ha-switch' ? el.checked : el.type === 'range' ? Number(el.value) : el.value;
      el.blur(); this.setRobotSetting(el.dataset.robotSetting, value); return;
    }
    if (event.target.dataset.station) {
      const el = event.target;
      const value = el.localName === 'ha-switch' || el.type === 'checkbox' ? el.checked : el.value;
      el.blur(); this.setStationSetting(el.dataset.station, value); return;
    }
    if (this.busy || this.view.active) return;
    const el = event.target;
    if (el.dataset.planningSetting) {
      const field = this.planningSettings().find(field => field.key === el.dataset.planningSetting);
      const index = Number(el.value);
      const value = el.type === 'range' ? Number.isInteger(index) ? field?.options[index] : undefined : el.value;
      if (!field?.available || !field.options.includes(value)) return;
      this.planningDraft ??= {};
      if (value === field.value) delete this.planningDraft[field.key];
      else this.planningDraft[field.key] = value;
      if (el.type !== 'range') el.blur();
    } else if (el.dataset.room) {
      this.selected = this.selected.filter(id => id !== el.dataset.room);
      if (el.checked) this.selected.push(el.dataset.room);
    } else if (el.dataset.setting && el.dataset.roomId) {
      const room = this.model.rooms.find(r => r.roomId === el.dataset.roomId);
      const field = room?.settings?.[el.dataset.setting];
      const value = el.type === 'range' ? field?.options[Number(el.value)] : el.value;
      if (!field?.options.includes(value)) return;
      const values = this.settingDraft[room.roomId] ??= {};
      if (value === field.value) delete values[el.dataset.setting];
      else values[el.dataset.setting] = value;
      if (!Object.keys(values).length) delete this.settingDraft[room.roomId];
      // Release the native select before rendering to avoid restoring its picker focus.
      el.blur();
    }
    else return;
    this.updateDirty(); this.message = ''; this.error = false; this.render();
  }
  onClick(event) {
    if (this.scheduleClick(event)) return;
    if (event.target.classList?.contains("consumables-overlay")) { this.toggleConsumables(false); return; }
    const el = event.target.closest('button, ha-button');
    if (el?.dataset.action === 'dismiss-notice') {
      this._dismissedNotice = this._noticeText;
      this.updateHeaderNotice();
      const target = ['.robot-warning', '.consumables-info'].map(selector => this.shadowRoot.querySelector(selector))
        .find(control => control && !control.disabled && !control.closest('[hidden], [inert]')
          && control.getClientRects().length && getComputedStyle(control).visibility === 'visible');
      target?.focus({ preventScroll: true });
      return;
    }
    if (['dismiss-fault', 'open-fault'].includes(el?.dataset.action)) {
      this._headerFaultDismissed = el.dataset.action === 'dismiss-fault';
      this.updateStatus();
      const focusTarget = !this._headerFaultDismissed ? '.header-fault .header-fault-close'
        : this.shadowRoot.querySelector('.header-notice')?.hidden === false
          ? '[data-action="dismiss-notice"]' : '.robot-warning';
      this.shadowRoot.querySelector(focusTarget)?.focus({ preventScroll: true });
      return;
    }
    if (el?.dataset.stationAction) {
      if (!el.disabled && !el.hasAttribute('disabled')) this.setStationSetting(el.dataset.stationAction, undefined, true);
      return;
    }
    if (el?.dataset.action === 'consumables') { this.toggleConsumables(true); return; }
    if (el?.dataset.action === 'close-consumables') { this.toggleConsumables(false); return; }
    if (el?.dataset.infoTab) { this.infoTab = el.dataset.infoTab; this.updateConsumables(); return; }
    if (this.consumablesOpen) return;
    if (!el || el.disabled || this.busy || this.controlBusy) return;
    if (this.scheduleSending && !(this.view.active && ['pause','start','return_to_base'].includes(el.dataset.control))) return;
    if (el.dataset.option !== undefined) {
      this.onChange({ target: { dataset: el.dataset, value: el.dataset.option, blur() {} } });
      return;
    }
    if (['zones','rooms','schedules'].includes(el.dataset.action) && !this.view.active) {
      if (el.dataset.action === 'zones' && !this.supportsZone) return;
      if (el.dataset.action === 'schedules' && !this.getScheduleState().supported) return;
      const zone = this.shadowRoot.querySelector('dyson-planner-zone');
      if (zone?.sending) return;
      if (zone) this.zoneDraft = zone.snapshot();
      this.zoneView = el.dataset.action === 'zones'; this.schedulesView = el.dataset.action === 'schedules'; this.requestedPlan = null; this.render(); return;
    }
    if (el.dataset.control) { this.control(el.dataset.control); return; }
    if (this.view.active) return;
    if (el.dataset.expand !== undefined) {
      const id = el.dataset.expand;
      if (this.expanded.has(id)) this.expanded.delete(id);
      else {
        if (this.config.theme === 'modern') this.expanded.clear();
        this.expanded.add(id);
      }
    } else if (el.dataset.action === 'reset') this.resetDraft();
    else if (el.dataset.action === 'start') { this.start(); return; }
    else if (el.dataset.action === 'save') { this.save(); return; }
    this.render();
  }
  async start() {
    if (this._previewDialog || this.busy || this.view.active || !this.isConnected) return;
    this.clearSessionEnd();
    this.busy = true; this.error = false;
    const config = this.config, context = this.draftContext;
    const detachRevision = this._detachRevision ?? 0;
    try {
      if (this.registryError) throw new UiError(this.registryError);
      const model = this.getModel();
      const planning = this.getRoomPlanningState(model);
      if (!planning.supportsStart || !planning.canStart) throw new UiError(planning.notice || model.startBlockReason || this.adapter.startBlockReason(this._hass, config.entity, this.registry) || 'This action is not available for the current robot state.');
      // Keep this request visible while the integration call is pending; the
      // robot can report an active session before callService resolves.
      this.requestedPlan = { rooms: this.selected.map(entity => {
        const room = model.rooms.find(candidate => roomKey(candidate) === entity);
        return { entity_id: room?.entity, room_id: room?.roomId, name: room?.name ?? entity };
      }) };
      this.message = this.adapter.roomStartMessage ?? 'Start clean'; this.render();
      const plan = await this.adapter.sendRoomDraft({ hass: this._hass, model, config, selected: [...this.selected], draft: this.settingDraft,
        planningDraft:structuredClone(this.planningDraft ?? {}), start: true, context, registry:this.registry,
        getCurrent:() => ({ hass:this._hass, registry:this.registry, config:this.config,
          active:this.isConnected && !this._previewDialog && (this._detachRevision ?? 0) === detachRevision }) });
      if (this.config !== config || !this.isConnected) return;
      if (context !== this.adapter.roomContext(this._hass, config.entity, this.registry)) {
        // The command may already be accepted; clear only its stale presentation.
        this.message = '';
        this.clearPendingStart(); this.clearSessionEnd();
        this.requestedPlan = null; this.sessionObserved = false;
        return;
      }
      this.settingDraft = {}; this.planningDraft = {};
      this.requestedPlan = plan;
      this.sessionObserved = this.adapter.cleaningView(this._hass, config.entity, false, this.registry).live;
      if (!this.sessionObserved) {
        this.pendingStart = true;
        this._startTimer = setTimeout(() => {
          this.pendingStart = false;
          if (!this.adapter.cleaningView(this._hass, config.entity, false, this.registry).active) {
            this.requestedPlan = null; this.error = true;
            this.message = 'The start was sent, but the robot has not reported an active session. Check its status before trying again.';
          }
          this.update();
        }, 30000);
      }
      this.message = '';
      this.dirty = true;
      this.baseline = this.liveSignature();
    } catch (error) {
      if (!this.adapter.cleaningView(this._hass, config.entity, false, this.registry).active) this.requestedPlan = null;
      this.error = true;
      if (this.config === config) this.message = uiMessage('{error} No automatic retry will be made.', { error });
    } finally { this.busy = false; this.render(); }
  }
  async save() {
    if (this._previewDialog || this.busy || this.view.active || !this.isConnected) return;
    const config = this.config, context = this.draftContext, draft = structuredClone(this.settingDraft);
    this.busy = true; this.saving = true; this.error = false;
    this.message = 'Saving room settings …'; this.render();
    try {
      const model = this.getModel(), planning = this.getRoomPlanningState(model);
      if (!planning.supportsSave || !planning.canSave) throw new UiError(planning.notice || 'This action is not available for the current robot state.');
      await this.adapter.sendRoomDraft({ hass: this._hass, model, config, draft, context, registry:this.registry });
      const deadline = Date.now() + 6000;
      while (true) {
        if (this.config !== config || !this.isConnected) return;
        if (context !== this.adapter.roomContext(this._hass, config.entity, this.registry)) {
          this.message = '';
          return;
        }
        const model = this.getModel();
        if (Object.entries(draft).every(([id, fields]) => Object.entries(fields).every(([key, value]) => model.rooms.find(r => r.roomId === id)?.settings?.[key]?.value === value))) break;
        if (Date.now() >= deadline) throw new UiError('Save was sent, but Home Assistant has not reflected all values yet. The draft was kept; check the robot before retrying.');
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      this.settingDraft = {}; this.model = this.getModel(); this.updateDirty();
      this.baseline = this.liveSignature();
      this.message = 'Settings sent. Home Assistant values updated. Room selection remains local.';
    } catch (error) {
      if (this.config === config) { this.error = true; this.message = error; }
    } finally { this.busy = false; this.saving = false; this.render(); }
  }
  canControl(action) {
    return this.adapter.vacuumEntries(this.registry ?? [], this._hass).some(entry => entry.entity_id === this.config.entity)
      && this.adapter.canControl(this._hass, this.config.entity, action, this.registry);
  }
  async control(action) {
    if (this._previewDialog || this.busy || this.controlBusy || !this.isConnected || !this.canControl(action)) return;
    const entity = this.config.entity;
    this.controlBusy = true; this.message = ''; this.error = false; this.render();
    try {
      await this.adapter.controlCleaning(this._hass, entity, action, this.registry);
      if (this.config.entity !== entity) return;
      this.message = '';
    } catch (error) {
      if (this.config.entity === entity) { this.error = true; this.message = error; }
    } finally { this.controlBusy = false; this.render(); }
  }
  consumablesHtml() {
    return `<div class="consumables-overlay" hidden><section class="consumables-panel" role="dialog" aria-modal="true" aria-label="${this.ht("Robot information")}"><div class="info-toolbar"><div class="info-tabs" role="tablist" aria-label="${this.ht("Robot information")}"><button id="tab-station" role="tab" data-info-tab="station" aria-controls="panel-station">${this.ht("Station")}</button><button id="tab-robot" role="tab" data-info-tab="robot" aria-controls="panel-robot">${this.ht("Robot")}</button><button id="tab-consumables" role="tab" data-info-tab="consumables" aria-controls="panel-consumables" title="${this.ht("Consumables")}">${this.ht("Supplies")}</button></div><button class="consumables-close" data-action="close-consumables" data-focus="consumables-close" aria-label="${this.ht("Close information")}"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></div><div id="panel-station" role="tabpanel" aria-labelledby="tab-station"><div class="station-rows"></div><p class="station-message notice" role="status" aria-live="polite"></p></div><div id="panel-robot" role="tabpanel" aria-labelledby="tab-robot" hidden><div class="robot-settings"></div><p class="robot-message notice error" role="status" hidden></p></div><div id="panel-consumables" role="tabpanel" aria-labelledby="tab-consumables" hidden><div class="consumables-rows"></div></div></section></div>`;
  }
  toggleConsumables(open) {
    this.consumablesOpen = open;
    if (open) { this.infoTab = this.adapter.infoTabs?.[0] ?? 'station'; this.robotMessage = ''; this._robotMessageContext = {}; }
    this.updateConsumables();
    this.shadowRoot.querySelector(open ? '.consumables-close' : '.consumables-info')?.focus();
  }
  updateConsumables() {
    const root = this.shadowRoot;

    const rows = this.adapter.consumableStatus(this._hass, this.registry, this.config.entity).filter(row => row.supported);
    const settings = this.adapter.stationSettings(this._hass, this.registry, this.config.entity).filter(field => field.supported);
    const solution = rows.find(row => row.type === 'cleaningSolution');
    this.updateStationSettings(settings, solution?.refillStatus);
    this.updateRobotSettings();
    const warning = rows.some(row => row.level === 'low');
    const button = root.querySelector('.consumables-info');
    button.hidden = this.adapter.infoTabs?.length === 0;
    button.classList.toggle('attention', warning);
    root.querySelector('#tab-consumables').classList.toggle('attention', warning);
    button.setAttribute('aria-label', this.t(warning ? 'Consumables: replacement needed soon' : 'Robot information'));
    button.title = this.t(warning ? 'Consumables: replacement needed soon' : 'Robot information');
    button.setAttribute('aria-expanded', String(!!this.consumablesOpen));
    root.querySelector('.consumables-overlay').hidden = !this.consumablesOpen;
    root.querySelector('.planner-content').inert = !!this.consumablesOpen || !!this.scheduleDialog;
    const content = rows.map(row => {
      if (row.type === 'cleaningSolution') {
        const ready = row.text === 'Ready to use', refill = row.text === 'Refill required';
        const setting = settings.find(field => field.key === 'cleaning_solution');
        const usage = setting?.available ? (setting.value === 'on' ? 'Enabled' : 'Disabled') : 'Status unavailable';
        const icon = ready ? 'mdi:check' : refill ? 'mdi:water-alert-outline' : 'mdi:help-circle-outline';
        return `<div class="consumable-row consumable-solution"><div class="consumable-label"><span>${this.ht(row.name)}</span><span class="consumable-value">${this.ht(usage)}</span></div><span class="consumable-chip ${ready ? 'ready' : refill ? 'refill' : 'unknown'}"><ha-icon icon="${icon}" aria-hidden="true"></ha-icon><span>${row.remaining === null ? this.ht(row.text) : this.ht('{percent}% remaining', { percent: row.remaining })}</span></span></div>`;
      }
      return `<div class="consumable-row"><div class="consumable-label"><span>${this.ht(row.name)}</span><span class="consumable-value">${row.remaining === null ? this.ht(row.text) : this.ht('{percent}% remaining', { percent: row.remaining })}</span></div>${row.remaining === null ? '' : `<div class="consumable-track" role="meter" aria-label="${this.ht('{name} remaining life', { name: this.t(row.name) })}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${row.remaining}"><span class="consumable-fill ${row.level}" style="width:${row.remaining}%"></span></div>`}</div>`;
    }).join('');
    const host = root.querySelector('.consumables-rows');
    if (host.innerHTML !== content) host.innerHTML = content;
    if (this.consumablesOpen && !root.querySelector('.consumables-panel').contains(root.activeElement)) root.querySelector('.consumables-close').focus();
  }
  settingSwitchHtml(group, field, attrs) {
    const request = this._settingSwitchRequest;
    const pending = request?.group === group && request.key === field.key;
    return `<span class="setting-switch ${pending ? 'pending' : ''}" aria-busy="${pending}"><ha-switch ${attrs} ${field.value === 'on' ? 'checked' : ''}></ha-switch>${pending ? `<span class="setting-switch-spinner" role="status" aria-label="${this.ht('Updating setting …')}"></span>` : ''}</span>`;
  }
  settingSwitchCurrent(request) {
    return this.isConnected && !request.cancelled && this.config === request.config && this._detachRevision === request.detach;
  }
  settingSwitchConfirmed(request) {
    const fields = request.group === 'robot' ? this.adapter.robotSettings(this._hass,this.registry,this.config.entity)
      : this.adapter.stationSettings(this._hass,this.registry,this.config.entity);
    return switchSettingConfirmed(this._hass,this.registry,fields.find(field => field.key === request.key),request);
  }
  settingSwitchMessage(request, message, error = false) {
    if (request.group === 'robot') {
      if (request.messageContext !== this._robotMessageContext) return false;
      this.robotMessage = message;
    } else { this.stationMessage = message; this.stationError = error; }
    return true;
  }
  cancelSettingSwitch() {
    const request = this._settingSwitchRequest;
    if (request) {
      request.cancelled = true; request.confirm?.('cancelled'); clearTimeout(request.timer);
      this._settingSwitchRequest = null; this.stationBusy = false;
    }
    this._settingSwitchUnconfirmed = {};
  }
  reconcileSettingSwitch() {
    const request = this._settingSwitchRequest;
    if (request?.confirm && this.settingSwitchCurrent(request) && this.settingSwitchConfirmed(request)) request.confirm('confirmed');
    for (const [group,late] of Object.entries(this._settingSwitchUnconfirmed ?? {})) {
      const message = group === 'robot' ? this.robotMessage : this.stationMessage;
      if (!this.settingSwitchCurrent(late.request) || message !== late.notice) { delete this._settingSwitchUnconfirmed[group]; continue; }
      if (this.settingSwitchConfirmed(late.request)) {
        this.settingSwitchMessage(late.request,''); delete this._settingSwitchUnconfirmed[group];
      }
    }
  }
  waitForSettingSwitch(request) {
    if (this.settingSwitchConfirmed(request)) return Promise.resolve('confirmed');
    return new Promise(resolve => {
      request.confirm = result => { clearTimeout(request.timer); request.confirm = null; resolve(result); };
      request.timer = setTimeout(() => request.confirm?.('timeout'),10000);
    });
  }
  async sendSettingSwitch(group, field, value, send) {
    const entry = this.registry.find(row => row.entity_id === field.entity);
    const request = {group,key:field.key,entity:field.entity,value:value ? 'on' : 'off',
      uniqueId:entry?.unique_id,deviceId:entry?.device_id,platform:entry?.platform,
      config:this.config,detach:this._detachRevision,messageContext:this._robotMessageContext};
    this._settingSwitchRequest = request; this.stationBusy = true;
    this._settingSwitchUnconfirmed ??= {}; delete this._settingSwitchUnconfirmed[group];
    this.settingSwitchMessage(request,''); this.updateConsumables();
    try {
      await send();
      if (!this.settingSwitchCurrent(request)) return;
      const result = await this.waitForSettingSwitch(request);
      if (!this.settingSwitchCurrent(request) || result === 'cancelled') return;
      if (result === 'timeout' && !this.settingSwitchConfirmed(request)) {
        const notice = uiMessage('The setting change has not been confirmed by Home Assistant. Check the robot before trying again.');
        if (this.settingSwitchMessage(request,notice,true)) this._settingSwitchUnconfirmed[group] = {request,notice};
      }
    } catch (error) {
      if (this.settingSwitchCurrent(request)) this.settingSwitchMessage(request,error,true);
    } finally {
      if (this._settingSwitchRequest === request) {
        this._settingSwitchRequest = null; this.stationBusy = false;
        if (this.settingSwitchCurrent(request)) {
          this.updateConsumables();
          if (this.consumablesOpen && this.infoTab === group && this.shadowRoot.activeElement?.classList.contains('consumables-close')) {
            const attr = group === 'robot' ? 'data-robot-setting' : 'data-station';
            this.shadowRoot.querySelector(`ha-switch[${attr}="${request.key}"]:not([disabled])`)?.focus({preventScroll:true});
          }
        }
      }
    }
  }
  async setRobotSetting(key, value) {
    if (this._previewDialog || this.stationBusy || this.busy || this.controlBusy || !this.consumablesOpen) return;
    const field = this.adapter.robotSettings(this._hass, this.registry, this.config.entity).find(field => field.key === key);
    if (field?.domain === 'switch' && field.available && field.enabled !== false && typeof value === 'boolean') {
      return this.sendSettingSwitch('robot',field,value,() => this.adapter.changeRobotSetting(this._hass,this.registry,this.config.entity,key,value));
    }
    this.stationBusy = true; this.robotMessage = ''; this.updateConsumables();
    const context = this._robotMessageContext;
    try { await this.adapter.changeRobotSetting(this._hass, this.registry, this.config.entity, key, value); }
    catch (error) { if (context === this._robotMessageContext) this.robotMessage = error; }
    finally { this.stationBusy = false; this.updateConsumables(); }
  }
  updateRobotSettings() {
    const fields = this.adapter.robotSettings(this._hass, this.registry, this.config.entity);
    const html = [['voice_prompts','volume'], ['child_lock'], ['do_not_disturb','do_not_disturb_start','do_not_disturb_end']].map(keys => {
      const rows = fields.filter(f => keys.includes(f.key) && f.supported).map(f => {
        const disabled = this._previewDialog || this.stationBusy || this.busy || this.controlBusy || !f.available || !f.enabled;
        const attrs = `data-robot-setting="${f.key}" aria-label="${this.ht(f.label)}" ${disabled ? 'disabled' : ''}`;
        const control = f.domain === 'switch' ? this.settingSwitchHtml('robot',f,attrs)
          : f.domain === 'number' ? `<div class="robot-volume"><input type="range" min="0" max="100" step="10" value="${f.available ? Number(f.value) : 0}" ${attrs}><output>${f.available ? `${Number(f.value)}%` : '?'}</output></div>`
          : `<input type="time" step="60" value="${f.available ? escapeHtml(f.value.slice(0,5)) : ''}" ${attrs}>`;
        return `<label class="station-row robot-row ${disabled ? 'robot-disabled' : ''}"><span>${this.ht(f.label)}</span>${control}</label>`;
      }).join('');
      return rows ? `<div class="robot-group">${rows}</div>` : '';
    }).join('');
    const host = this.shadowRoot.querySelector('.robot-settings');
    if (host._html !== html) { host.innerHTML = html; host._html = html; }
    const message = this.shadowRoot.querySelector('.robot-message');
    message.textContent = this.t(this.robotMessage || ''); message.hidden = !this.robotMessage;
  }
  async setStationSetting(key, value, action = false) {
    if (this._previewDialog || this.stationBusy || this.busy || this.controlBusy || !this.consumablesOpen) return;
    const field = !action && this.adapter.stationSettings(this._hass, this.registry, this.config.entity).find(field => field.key === key);
    if (field?.domain === 'switch' && field.available && typeof value === 'boolean') {
      return this.sendSettingSwitch('station',field,value,() => this.adapter.changeStationSetting(this._hass,this.registry,this.config.entity,key,value));
    }
    const entity = this.config.entity;
    this.stationBusy = true; this.stationMessage = ''; this.stationError = false;
    this.updateConsumables();
    try {
      if (action) await this.adapter.pressStationAction(this._hass, this.registry, entity, key);
      else await this.adapter.changeStationSetting(this._hass, this.registry, entity, key, value);
    } catch (error) {
      if (this.config.entity === entity) { this.stationMessage = error; this.stationError = true; }
    } finally { this.stationBusy = false; this.updateConsumables(); }
  }
  updateStationSettings(settings, refillStatus) {
    const root = this.shadowRoot;
    const allowedTabs = this.adapter.infoTabs ?? ['station', 'robot', 'consumables'];
    const tab = allowedTabs.includes(this.infoTab) ? this.infoTab : allowedTabs[0];
    this.infoTab = tab;
    for (const name of ['station', 'robot', 'consumables']) {
      const button = root.querySelector(`[data-info-tab="${name}"]`);
      button.hidden = !allowedTabs.includes(name);
      button.setAttribute('aria-selected', String(tab === name));
      button.tabIndex = tab === name ? 0 : -1;
      root.querySelector(`#panel-${name}`).hidden = tab !== name;
    }
    const indicators = Object.fromEntries(settings.map(field => [field.key, stationIndicator(field, refillStatus, this.language)]));
    const bar = root.querySelector('.station-indicators');
    const hidden = this.config.hidden_status_items;
    const barHtml = STATUS_BAR_ITEMS.filter(([key]) => !hidden.includes(key)).map(([key]) => indicators[key] || '').join('');
    const batteryVisible = !hidden.includes('battery');
    root.querySelector('.battery').hidden = !batteryVisible;
    root.querySelector('.station-status-bar').hidden = !this.config.show_status_bar || (!barHtml && !batteryVisible);
    if (bar._html !== barHtml) { bar.innerHTML = barHtml; bar._html = barHtml; }
    const html = settings.map(field => {
      const disabled = !!this._previewDialog || !field.available || this.stationBusy || this.busy || this.controlBusy;
      const attrs = `data-station="${field.key}" aria-label="${this.ht(field.label)}" ${disabled ? 'disabled' : ''}`;
      const control = field.domain === 'switch'
        ? this.settingSwitchHtml('station',field,attrs)
        : `<select ${attrs}>${!field.options.includes(field.value) ? `<option value="">${this.ht("Unavailable")}</option>` : ''}${field.options.map(v => `<option value="${escapeHtml(v)}" ${v === field.value ? 'selected' : ''}>${this.ht(v)}</option>`).join('')}</select>`;
      return `<label class="station-row ${field.domain}"><span class="station-label">${indicators[field.key]}<span>${this.ht(field.label)}${!field.available ? `<small>${this.ht("Unavailable")}</small>` : ''}</span></span>${control}</label>`;
    }).join('');
    const actions = this.adapter.stationActions(this._hass, this.registry, this.config.entity).filter(action => action.supported).map(action => {
      const disabled = !!this._previewDialog || !action.available || this.stationBusy || this.busy || this.controlBusy;
      return `<div class="station-row station-action"><span>${this.ht(action.label)}${!action.available ? `<small>${this.ht("Unavailable")}</small>` : ''}</span><ha-button appearance="plain" size="s" data-station-action="${action.key}" aria-label="${this.ht(action.label)}" ${disabled ? 'disabled' : ''}>${this.ht("Press")}</ha-button></div>`;
    }).join('');
    const content = html + actions;
    const host = root.querySelector('.station-rows');
    if (host._stationHtml !== content) { host.innerHTML = content; host._stationHtml = content; }
    const message = root.querySelector('.station-message');
    message.textContent = this.t(this.stationMessage);
    message.hidden = !this.stationMessage;
    message.classList.toggle('error', !!this.stationError);
  }
  headerHtml() {
    const name = this.adapter.robotTelemetry(this._hass, this.config.entity, undefined, this.registry).name;
    const subtitle = typeof name === 'string' && name.trim() ? name : this.config.entity;
    const illustrated = this.config.header_icon_style === 'integration' && this.adapter.supportsIntegrationIcon !== false;
    return `<header><div class="station-status-bar"><div class="station-indicators"></div><div class="battery" role="img"><svg viewBox="0 0 32 20" aria-hidden="true"><rect x="1" y="3" width="26" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="29" y="7" width="3" height="6" rx="1" fill="currentColor"/><rect class="battery-fill" x="4" y="6" width="0" height="8" rx="1" fill="currentColor"/><path class="battery-bolt" d="M17 1 9 11h6l-2 8L23 8h-7Z" fill="var(--dp-bg)" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" hidden/></svg><span class="battery-value" aria-hidden="true" hidden></span></div></div><div class="header-main"><div class="robot ${illustrated ? 'robot-integration' : ''}">${illustrated ? `<svg class="robot-illustration" viewBox="0 0 50 50" aria-hidden="true"><defs><radialGradient id="robot-beam-gradient" gradientUnits="userSpaceOnUse" cx="25" cy="25" r="46"><stop offset=".40" stop-color="#39ff14" stop-opacity=".75"/><stop offset=".62" stop-color="#65ff39" stop-opacity=".42"/><stop offset=".85" stop-color="#65ff39" stop-opacity=".12"/><stop offset="1" stop-color="#65ff39" stop-opacity="0"/></radialGradient><filter id="robot-beam-soft" x="-35%" y="-20%" width="170%" height="150%"><feGaussianBlur stdDeviation="1.2"/></filter></defs><path class="robot-beam" d="M25 25 L2 -15 Q25 -27 48 -15 Z" fill="url(#robot-beam-gradient)" filter="url(#robot-beam-soft)" hidden/><circle cx="25" cy="26" r="22" fill="#000" opacity=".18"/><circle cx="25" cy="25" r="21" fill="#3a3a40" stroke="#e7e9ed" stroke-width="1.5"/><circle cx="25" cy="25" r="18" fill="#45454e"/><path class="robot-bumper" d="M6.8 14.5 A21 21 0 0 1 43.2 14.5" fill="none" stroke="#64646d" stroke-width="4"/><circle cx="25" cy="17" r="6" fill="#c8c8cd"/><circle cx="25" cy="17" r="2.6" fill="#39ff14"/><rect class="robot-dock" x="9" y="44" width="32" height="7" rx="2.5" fill="#3a3a40" stroke="#c8c8cd" stroke-width="1.2" hidden/></svg>` : '<ha-icon icon="mdi:robot-vacuum"></ha-icon>'}${this.config.theme === 'modern' ? `<button class="robot-warning" data-action="open-fault" aria-label="${this.ht('Show robot error')}" hidden><ha-icon icon="mdi:alert" aria-hidden="true"></ha-icon></button>` : ''}</div><div class="header-title"><h2>${escapeHtml(this.config.title || this.t('Plan a clean'))}</h2><p>${escapeHtml(subtitle)}</p></div><div class="header-buttons"><button class="consumables-info" data-action="consumables" data-focus="consumables-info" aria-label="${this.ht("Consumables")}" aria-haspopup="dialog" aria-expanded="false" title="${this.ht("Consumables")}">${this.ht("Info")}</button></div>${this.config.theme === 'modern' ? `<section class="header-fault" aria-label="${this.ht('Robot needs attention')}" hidden><div class="header-fault-copy" tabindex="0" role="status"><strong>${this.ht('Robot needs attention')}</strong><p class="header-fault-detail"></p></div><button class="header-fault-close" data-action="dismiss-fault" aria-label="${this.ht('Dismiss error message')}"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></section>` : ''}<section class="header-notice" hidden><div class="header-notice-copy" role="status" aria-live="polite"></div><button class="header-fault-close" data-action="dismiss-notice" aria-label="${this.ht('Close')}"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></section></div></header>`;
  }
  updateBattery() {
    const vacuum = this.adapter.robotTelemetry(this._hass, this.config.entity, this.model.cameraEntity, this.registry);
    const cleaning = vacuum.cleaning;
    const bumper = this.shadowRoot.querySelector('.robot-bumper');
    if (bumper) {
      const connected = this._hass?.connected !== false && vacuum.available;
      const color = vacuum.bumperColor;
      const validColor = typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color);
      // HA's error state already excludes informational robot fault codes.
      const phase = !connected ? 'unavailable' : vacuum.state === 'error' ? 'fault'
        : vacuum.state === 'paused' ? 'paused' : cleaning ? 'cleaning' : 'idle';
      bumper.dataset.state = phase;
      bumper.classList.toggle('pulsing', phase === 'fault' || phase === 'paused');
      bumper.setAttribute('stroke', phase === 'cleaning' && validColor ? color
        : phase === 'unavailable' || phase === 'cleaning' ? '#cdcdd4' : '#64646d');
    }
    this.shadowRoot.querySelector('.robot-beam')?.toggleAttribute('hidden', !cleaning);
    this.shadowRoot.querySelector('.robot-dock')?.toggleAttribute('hidden', this._hass?.states?.[this.config.entity]?.state !== 'docked');
    const state = this.adapter.batteryStatus(this._hass, this.model);
    const element = this.shadowRoot.querySelector('.battery');
    element.dataset.level = state.level;
    const battery = state.percent === null ? this.t('Battery level unavailable') : this.t('Battery: {percent}%', { percent: state.percent });
    const charge = this._hass?.states?.[this.model.chargingEntity];
    const charging = this._hass?.connected !== false && available(charge) && ['on', 'off'].includes(charge.state) ? this.t(charge.state === 'on' ? 'Charging' : 'Not charging') : this.t('Charging status unavailable');
    const label = this.t('{battery}. {charging}.', { battery, charging });
    element.title = label; element.setAttribute('aria-label', label);
    const percentage = element.querySelector('.battery-value');
    percentage.hidden = !this.config.show_battery_percentage || state.percent === null;
    percentage.textContent = percentage.hidden ? '' : `${state.percent}%`;
    element.querySelector('.battery-fill').setAttribute('width', String((state.percent ?? 0) / 5));
    element.querySelector('.battery-bolt').toggleAttribute('hidden', !state.charging);
  }
  statusHtml() {
    return `<div class="activity-status" role="status" aria-live="polite" hidden><ha-icon class="activity-icon" aria-hidden="true"></ha-icon><div class="activity-copy"><span class="activity-heading"><span class="activity-text"></span><span class="activity-remaining" hidden></span></span><span class="activity-fault" hidden></span><span class="activity-start-block" hidden></span><div class="drying-progress" role="progressbar" aria-label="${this.ht("Drying time remaining")}" aria-valuemin="0" aria-valuemax="100" hidden><span class="drying-progress-fill"></span></div></div><span class="drying-control" hidden><button class="cancel-drying" data-control="cancel_drying" data-focus="cancel-drying" disabled aria-label="${this.ht("Cancel drying")}"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon></button></span></div>`;
  }
  updateHeaderNotice() {
    const root = this.shadowRoot;
    const overlay = root.querySelector('.header-notice');
    if (!overlay) return;
    const child = root.querySelector('dyson-planner-zone, dyson-planner-map');
    const text = this.t(this.message) || child?.headerMessage || this._plannerNotice || '';
    if (text !== this._noticeText) { this._noticeText = text; this._dismissedNotice = ''; }
    const faultOpen = root.querySelector('.header-fault')?.hidden === false;
    const open = !!text && text !== this._dismissedNotice && !faultOpen;
    overlay.hidden = !open;
    overlay.classList.toggle('error', !!this.message && !!this.error);
    overlay.querySelector('.header-notice-copy').textContent = text;
    for (const selector of ['.robot', '.header-title h2', '.header-title p', '.header-buttons']) {
      const item = root.querySelector(selector);
      if (item) { item.inert = open || faultOpen; item.style.visibility = open || faultOpen ? 'hidden' : ''; }
    }
  }
  updateStatus(plannerNotice = this._plannerNotice ?? '') {
    this._plannerNotice = plannerNotice;
    let status = this.adapter.activityStatus(this._hass, this.config.entity, (this.busy && !this.saving) || this.pendingStart, this.registry);
    const modern = this.config.theme === 'modern';
    const state = this._hass?.states?.[this.config.entity]?.state;
    if (modern && !status) {
      if (state === 'docked') status = { text: 'Docked', icon: 'mdi:home-import-outline' };
      else if (state === 'idle') status = { text: 'Idle', icon: 'mdi:robot-vacuum' };
    }
    if (modern) {
      const vacuum = this.adapter.robotTelemetry(this._hass, this.config.entity, this.model.cameraEntity, this.registry);
      const activeFault = state === 'error' && this._hass?.connected !== false;
      const description = typeof vacuum.fault === 'string' ? vacuum.fault.trim() : '';
      const key = activeFault ? JSON.stringify([this.config.entity, vacuum.faultCode ?? null, description]) : '';
      if (key !== this._headerFaultKey) { this._headerFaultKey = key; this._headerFaultDismissed = false; }
      const overlay = this.shadowRoot.querySelector('.header-fault');
      const open = !!key && !this._headerFaultDismissed;
      overlay.hidden = !open;
      overlay.querySelector('.header-fault-detail').textContent = description || this.t('Check the robot or the Dyson app for details.');
      const warning = this.shadowRoot.querySelector('.robot-warning');
      warning.hidden = !key;
      warning.setAttribute('aria-expanded', String(open));
      // Leave the measured header layout intact, but prevent keyboard access behind the overlay.
      for (const selector of ['.robot', '.header-title h2', '.header-title p', '.header-buttons']) {
        const item = this.shadowRoot.querySelector(selector);
        item.inert = open;
        item.style.visibility = open ? 'hidden' : '';
      }
      if (activeFault) {
        // The generic error state does not prove docking or a live cleaning phase.
        status = this.adapter.dockActivity(this._hass, this.config.entity, this.registry)
          ?? { text: 'Status unavailable', icon: 'mdi:help-circle-outline' };
      }
    }
    const row = this.shadowRoot.querySelector('.activity-status');
    row.hidden = !status;
    const compact = modern;
    row.classList.toggle('compact-status', compact);
    row.classList.toggle('has-drying', !!status?.drying);
    row.querySelector('.activity-text').textContent = this.t(status?.text);
    // Display the integration's current explanation without retaining or inferring faults.
    const fault = this.adapter.robotTelemetry(this._hass, this.config.entity, undefined, this.registry).fault;
    const detail = status?.text === 'Robot needs attention' && typeof fault === 'string' ? fault.trim() : '';
    const faultText = row.querySelector('.activity-fault');
    faultText.textContent = detail;
    faultText.hidden = modern || !detail;

    const blockNote = row.querySelector('.activity-start-block');
    const block = this.adapter.startBlockReason(this._hass, this.config.entity, this.registry);
    blockNote.hidden = this.view.active || !block || block === status?.text || this.adapter.dockBlocksStart(this._hass, this.config.entity, this.registry);
    blockNote.textContent = this.t(block);
    row.querySelector('.activity-icon').setAttribute('icon', status?.icon ?? 'mdi:robot-vacuum');
    row.querySelector('.drying-control').hidden = !status?.drying || this.adapter.supportsDryingCancellation === false;
    const remaining = row.querySelector('.activity-remaining');
    const wantsRemaining = status?.remaining ?? status?.drying;
    const time = wantsRemaining ? this.adapter.dryingRemainingTime(this._hass, this.config.entity, this.registry) : null;
    const showRemaining = wantsRemaining && (status?.drying || time !== null);
    remaining.hidden = !showRemaining;
    remaining.textContent = compact ? ` · ${time ?? this.t('Unavailable')}` : time === null ? this.t('Remaining time: unavailable') : this.t('Remaining time: {time} (hh:mm)', { time });
    row.querySelector('.activity-copy').title = [this.t(status?.text), showRemaining ? remaining.textContent : '', blockNote.hidden ? '' : blockNote.textContent].filter(Boolean).join(' ');
    const progress = row.querySelector('.drying-progress');
    const percent = status?.drying ? this.adapter.dryingRemainingPercent(this._hass, this.config.entity, this.registry) : null;
    progress.hidden = percent === null;
    if (percent !== null) {
      progress.setAttribute('aria-valuenow', String(Math.round(percent)));
      progress.setAttribute('aria-valuetext', this.t('Remaining time: {time} (hh:mm)', { time }));
      progress.querySelector('.drying-progress-fill').style.width = `${percent}%`;
    } else {
      progress.removeAttribute('aria-valuenow');
      progress.removeAttribute('aria-valuetext');
    }
    const cancel = row.querySelector('.cancel-drying');
    const supported = this.canControl('cancel_drying');
    cancel.disabled = !!this._previewDialog || this.busy || this.controlBusy || !supported;
    this.updateHeaderNotice();
    cancel.title = this.t(supported ? 'Cancel drying' : 'Drying cancellation requires a connected robot and the integration cancel_drying action.');
  }
  renderSession(view) {
    const h = escapeHtml;
    // Keep the map element mounted across status and message updates so polling,
    // the last good image and in-flight requests are independent of card renders.
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}<section class="session"><ul class="requested"></ul></section>${this.showSessionMap ? `<div class="map-section">${this.config.theme !== 'modern' ? `<div class="map-title">${this.ht("Cleaning map")}</div><p class="map-caption">${this.ht("Refreshes about every 5 seconds")}</p>` : ''}<dyson-planner-map></dyson-planner-map></div>` : ''}<footer class="session-footer"><div class="actions session-actions"><button class="session-toggle" data-control="pause" data-focus="session-toggle"><ha-icon></ha-icon><span></span></button><button class="home" data-control="return_to_base" data-focus="home"><ha-icon icon="mdi:home-import-outline"></ha-icon>${this.ht("Home")}</button></div></footer></div>${this.consumablesHtml()}${this.scheduleOverlayHtml()}</ha-card>`, 'session');
    const root = this.shadowRoot;
    this.updateBattery();
    this.updateConsumables();
    this.updateStatus('');
    if (view.simulated && this.config.theme !== 'modern') root.querySelector('.activity-status').hidden = true;
    const title = root.querySelector('.header-title h2');
    title.classList.add('session-title');
    title.textContent = this.t(view.simulated ? 'Cleaning session preview' : 'Cleaning session');
    const zone = this.requestedPlan?.zone;
    const unit = this.config.zone_dimension_unit === 'inch' ? 'in' : this.config.zone_dimension_unit === 'cm' ? 'cm' : this._hass?.config?.unit_system?.length;
    const chips = zone ? `<li>${this.ht('Zone')}: ${h(zoneDimensionText(zone.widthCm,zone.heightCm,unit))}</li>`
      : (this.requestedPlan?.rooms ?? []).map(r => `<li>${h(r.name)}</li>`).join('');
    const list = root.querySelector('.requested');
    if (list.innerHTML !== chips) list.innerHTML = chips;
    root.querySelector('.session').hidden = this.config.theme !== 'modern' && !chips;
    const paused = this._hass.states[this.config.entity]?.state === 'paused';
    const toggle = root.querySelector('.session-toggle');
    toggle.dataset.control = paused ? 'start' : 'pause';
    toggle.classList.toggle('resume', paused); toggle.classList.toggle('pause', !paused);
    toggle.querySelector('span').textContent = this.t(paused ? 'Resume' : 'Pause');
    toggle.querySelector('ha-icon').setAttribute('icon', paused ? 'mdi:play' : 'mdi:pause');
    for (const button of root.querySelectorAll('[data-control]')) {
      const supported = this.canControl(button.dataset.control);
      button.disabled = !!this._previewDialog || this.busy || this.controlBusy || !supported;
      button.title = supported ? '' : this.t('This action is not available in the current robot state.');
    }
    root.querySelector('dyson-planner-map')?.setOptions(this._hass, this.model.cameraEntity, this.config.camera_rotation, view.live, this.language, this.adapter);
  }
  positionModernPointer() {
    if (this.config?.theme !== 'modern') return;
    const scope = this.scheduleDialog ? this.shadowRoot.querySelector('.schedule-room-list') : this.shadowRoot.querySelector('.modern-rooms');
    const panel = scope?.querySelector('.fields:not([hidden])');
    const head = scope?.querySelector('.room.open .room-head');
    if (!panel || !head) return;
    const target = head.getBoundingClientRect(), bounds = panel.getBoundingClientRect();
    panel.style.setProperty('--pointer-y', `${target.top + target.height / 2 - bounds.top}px`);
    const fields = [...panel.children].filter(el => !el.classList.contains('mode-spacer'));
    fields.forEach(el => el.style.removeProperty('--field-shift'));
    const spacer = panel.querySelector('.mode-spacer');
    if (!spacer || fields.length !== 3 || getComputedStyle(spacer).display === 'none') return;
    // Keep half the spare space below three controls; distribute the rest between them.
    const css = getComputedStyle(panel);
    const gap = parseFloat(css.rowGap) || 0;
    const available = panel.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom);
    const used = fields.reduce((sum, el) => sum + el.getBoundingClientRect().height, 0);
    const extra = Math.max(0, available - used - gap * 2);
    fields.forEach((el, i) => el.style.setProperty('--field-shift', `${extra * i / 4}px`));
  }
  planningSettingsHtml() {
    return this.planningSettings().map(field => {
      const value = this.planningDraft?.[field.key] ?? field.value;
      return `<section class="planning-setting" aria-label="${this.ht(field.label)}"><div class="planning-setting-head"><span>${this.ht(field.label)}</span><output>${this.ht(field.options.includes(value) ? value : 'Unavailable')}</output></div>${this.modernControl(field.key, this.t(field.label), {}, field, value, this.busy || !field.available, 'global', 'planning')}<p class="planning-setting-hint">${this.ht(field.hint)}</p></section>`;
    }).join('');
  }
  modernControl(key, label, room, field, value, disabled, n, scope = 'planner') {
    const h = escapeHtml, options = field.options;
    const attrs = scope === 'schedule' ? `data-schedule-room-setting="${key}" data-schedule-room="${h(room.roomId)}"`
      : scope === 'planning' ? `data-planning-setting="${h(key)}"` : `data-setting="${key}" data-room-id="${h(room.roomId)}"`;
    const focus = scope === 'schedule' ? `schedule-room-${room.roomId}-${key}` : `${key}-${n}`;
    const slider = scope === 'schedule' ? `schedule-slider-${key}-${room.roomId}` : `slider-${key}-${n}`;
    const unknown = scope === 'schedule' ? value || 'Stored settings not reported' : 'Unavailable';
    const name = scope === 'planning' ? label : `${label} ${room.name}`;
    const valid = options.includes(value);
    const blocked = disabled || !valid;
    const presentation = scope === 'planning' ? null : this.adapter.roomPresentation(room, {}, this.config).fields.find(field => field.key === key);
    if (presentation?.control === 'segments') {
      return `<div class="modern-control"><span class="field-label">${label}</span><div class="segments" role="group" aria-label="${h(name)}">${options.map((option, i) => `<button ${attrs} data-option="${h(option)}" style="--stop:${options.length > 1 ? i / (options.length - 1) : 0}" data-focus="${focus}-${i}" aria-pressed="${value === option}" ${disabled ? 'disabled' : ''}>${h(presentation.optionLabels?.[option] ?? this.t(option))}</button>`).join('')}</div></div>`;
    }
    const index = options.indexOf(value);
    return `<div class="modern-control">${scope === 'planning' ? '' : `<label class="field-label" for="${slider}">${label}</label>`}<div class="stepped-slider ${blocked ? 'disabled' : ''}"><div class="slider-ticks" aria-hidden="true">${options.map((_, i) => `<span class="slider-tick" style="--stop:${options.length > 1 ? i / (options.length - 1) : 0}"></span>`).join('')}</div><input id="${slider}" type="range" min="0" max="${options.length - 1}" step="1" value="${Math.max(0, index)}" aria-label="${h(name)}" aria-valuetext="${this.ht(valid ? value : unknown)}" ${attrs} data-focus="${focus}" ${blocked || options.length < 2 ? 'disabled' : ''}></div><div class="slider-options" style="--options:${options.length}">${options.map((option, i) => `<button ${attrs} data-option="${h(option)}" style="--stop:${options.length > 1 ? i / (options.length - 1) : 0}" data-focus="${focus}-${i}" aria-pressed="${value === option}" ${disabled ? 'disabled' : ''}>${this.ht(option)}</button>`).join('')}</div>${!valid ? `<span class="badge">${this.ht(unknown)}</span>` : ''}</div>`;
  }
  zoneStarted(dimensions) {
    const valid = dimensions && ['widthCm','heightCm'].every(key => Number.isFinite(dimensions[key]) && dimensions[key] > 0);
    this.zoneView = false; this.zoneDraft = null; this.requestedPlan = valid ? { zone: { ...dimensions } } : null; this.message = ''; this.error = false;
    this.clearPendingStart();
    if (!this.adapter.cleaningView(this._hass, this.config.entity, false, this.registry).live) {
      this.pendingStart = true;
      this._startTimer = setTimeout(() => {
        this.pendingStart = false;
        if (!this.adapter.cleaningView(this._hass, this.config.entity, false, this.registry).live) {
          this.error = true;
          this.message = 'The start was sent, but the robot has not reported an active session. Check its status before trying again.';
        }
        this.update();
      }, 30000);
    }
    this.update();
  }
  get supportsZone() { return this.adapter.supportsZoneDevice(this.registry, this.devices, this.config.entity); }
  planningTabsHtml() {
    const schedules = this.getScheduleState();
    const tabs = [['rooms','Rooms'], ...(this.supportsZone ? [['zones','Zone']] : []), ...(schedules.supported ? [['schedules','Schedules']] : [])];
    if (tabs.length === 1) return '';
    const current = this.schedulesView ? 'schedules' : this.zoneView ? 'zones' : 'rooms';
    return `<nav class="planning-tabs" role="tablist" aria-label="${this.ht('Cleaning selection')}">${tabs.map(([key,label]) => {
      const count = key === 'schedules' ? schedules.enabledCount : null;
      const counted = Number.isSafeInteger(count) && count >= 0;
      return `<button id="planning-tab-${key}" role="tab" data-action="${key}" aria-selected="${current === key}" aria-controls="planning-panel-${key}" tabindex="${current === key ? 0 : -1}" ${counted ? `aria-label="${this.ht('Schedules, active: {count}',{count})}" title="${this.ht('Active schedules: {count}',{count})}"` : ''}><span class="planning-tab-label">${this.ht(label)}${counted ? `<span class="schedule-count ${count === 0 ? 'is-zero' : ''} ${count > 99 ? 'capped' : ''}" aria-hidden="true">${count > 99 ? '99+' : count}</span>` : ''}</span></button>`;
    }).join('')}</nav>`;
  }
  renderZone() {
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}${this.planningTabsHtml()}${this.getScheduleState().supported ? '<div id="planning-panel-schedules" role="tabpanel" aria-labelledby="planning-tab-schedules" hidden></div>' : ''}<div id="planning-panel-rooms" role="tabpanel" aria-labelledby="planning-tab-rooms" hidden></div><dyson-planner-zone id="planning-panel-zones" role="tabpanel" aria-labelledby="planning-tab-zones"></dyson-planner-zone></div>${this.consumablesHtml()}${this.scheduleOverlayHtml()}</ha-card>`, 'zone');
    const title = this.shadowRoot.querySelector('.header-title h2');
    if (title.textContent !== this.t('Zone cleaning')) title.textContent = this.t('Zone cleaning');
    this.updateBattery(); this.updateConsumables(); this.updateStatus('');
    const camera = this.model.cameraEntity;
    const trusted = this.adapter.trustedCamera(this.registry, this.config.entity, camera);
    this.shadowRoot.querySelector('dyson-planner-zone').setOptions({ hass:this._hass, vacuum:this.config.entity,
      adapter:this.adapter, camera, trusted, dimensionUnit:this.config.zone_dimension_unit, supported:this.supportsZone, capabilities:this.adapter.zoneDeviceOptions(this.model.rooms), draft:this.zoneDraft, theme:this.config.theme, rotation:this.config.camera_rotation, language:this.language, preview:!!this._previewDialog });
  }
  render() {
    if (!this.model) return;
    const view = this.view;
    if (this._previewDialog && zonePreviewOwners.has(this._previewDialog) && this.supportsZone) { this.renderZone(); return; }
    if (view.active && ((!this.zoneView && !this.schedulesView) || view.live)) {
      if (view.live) { this.zoneView = false; this.zoneDraft = null; }
      this.renderSession(view); return;
    }
    if (this.zoneView) { this.renderZone(); return; }
    if (this.schedulesView && this.getScheduleState().supported) { this.renderSchedules(styles); return; }
    this.schedulesView = false;
    const h = escapeHtml, model = this.model;
    const rooms = model.rooms.filter(r => !r.excluded);
    const external = this.dirty && !this.busy && this.baseline !== this.liveSignature();
    const planning = this.getRoomPlanningState();
    const hasChanges = Object.keys(this.settingDraft).length > 0;
    const modern = this.config.theme === 'modern';
    const roomHtml = rooms.map((room, n) => {
      const key = roomKey(room);
      const selected = this.selected.includes(key), order = this.selected.indexOf(key) + 1;
      const open = this.expanded.has(key || room.name);
      const disabled = this.busy || !room.available || !key;
      const valueOf = key => this.settingDraft[room.roomId]?.[key] ?? room.settings?.[key]?.value;
      const presentation = this.adapter.roomPresentation(room, this.settingDraft[room.roomId] ?? {}, this.config);
      const fields = presentation.fields.map(({ key, label:originalLabel, wide, control, omitted }) => {
        const label = this.t(originalLabel);
        if (omitted && !modern) return '';
        const reserve = html => omitted ? `<div class="mode-spacer" inert aria-hidden="true">${html}</div>` : html;
        const field = room.settings?.[key];
        if (!field) return '';
        const fieldDisabled = disabled || !field.available;
        const value = valueOf(key), options = field?.options ?? [];
        if (modern && control !== 'select' && options.length) return reserve(this.modernControl(key, label, room, field, value, fieldDisabled, n));
        return reserve(`<label class="field ${wide ? 'mode' : ''}">${label}<select data-setting="${h(key)}" data-room-id="${h(room.roomId)}" data-focus="${h(key)}-${n}" aria-label="${label} ${h(room.name)}" ${fieldDisabled ? 'disabled' : ''}>${!options.includes(value) ? `<option value="">${this.ht("Unavailable")}</option>` : ''}${options.map(option => `<option value="${h(option)}" ${value === option ? 'selected' : ''}>${this.ht(option)}</option>`).join('')}</select></label>`);
      }).join('');
      const summary = !room.available ? this.ht(room.error || 'Unavailable') : presentation.summary ? this.ht(presentation.summary) : '';
      const issue = presentation.issue ? `<p class="badge mode">${this.ht(presentation.issue)}</p>` : '';
      const marker = selected ? planning.ordered ? order : '✓' : '';
      if (!fields && !issue) return `<section class="room room-plain ${selected ? 'selected' : ''}" style="--room-color:${ROOM_COLORS[n % ROOM_COLORS.length]}"><div class="room-head"><label class="pick"><input type="checkbox" data-focus="room-${n}" data-room="${h(key)}" aria-label="${this.ht('Select {name}', {name:room.name})}" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}>${modern ? `<span class="selection-circle" aria-hidden="true">${marker}</span>` : ''}<span class="room-settings-copy"><span class="name">${h(room.name)} ${!modern && selected && planning.ordered ? `<span class="status">(${order})</span>` : ''}</span>${summary ? `<span class="summary">${summary}</span>` : ''}</span></label></div></section>`;
      if (modern) {
        const colors = ROOM_COLORS;
        return `<section class="room ${selected ? 'selected' : ''} ${open ? 'open' : ''}" style="--room-color:${colors[n % colors.length]};--room-row:${n + 1}"><div class="room-head"><label class="pick"><input type="checkbox" data-focus="room-${n}" data-room="${h(key)}" aria-label="${this.ht('Select {name}', { name: room.name })}" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span class="selection-circle" aria-hidden="true">${marker}</span></label><button class="expand room-settings-toggle" data-focus="expand-${n}" data-expand="${h(key || room.name)}" aria-expanded="${open}" aria-controls="fields-${n}" aria-label="${this.ht('Settings for {name}', { name: room.name })}"><span class="room-settings-copy"><span class="name">${h(room.name)}</span><span class="summary">${summary}</span></span><span aria-hidden="true">${open ? '⌃' : '›'}</span></button></div><div class="fields" id="fields-${n}" ${open ? '' : 'hidden'}>${fields}${issue}</div></section>`;
      }
      return `<section class="room ${selected ? 'selected' : ''}"><div class="room-head"><label class="pick"><input type="checkbox" data-focus="room-${n}" data-room="${h(key)}" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span><span class="name">${h(room.name)} ${selected && planning.ordered ? `<span class="status">(${order})</span>` : ''}</span><span class="summary">${summary}</span></span></label><button class="expand" data-focus="expand-${n}" data-expand="${h(key || room.name)}" aria-expanded="${open}" aria-controls="fields-${n}" aria-label="${this.ht('Settings for {name}', { name: room.name })}"><span>${this.ht("Settings")}</span> ${open ? '⌃' : '⌄'}</button></div><div class="fields" id="fields-${n}" ${open ? '' : 'hidden'}>${fields}${issue}</div></section>`;
    }).join('');
    this.paint(`<style>${styles}</style><ha-card><div class="planner-content">${this.headerHtml()}${this.statusHtml()}${this.planningTabsHtml()}${this.supportsZone ? '<div id="planning-panel-zones" role="tabpanel" aria-labelledby="planning-tab-zones" hidden></div>' : ''}${this.getScheduleState().supported ? '<div id="planning-panel-schedules" role="tabpanel" aria-labelledby="planning-tab-schedules" hidden></div>' : ''}<div ${this.supportsZone || this.getScheduleState().supported ? 'id="planning-panel-rooms" role="tabpanel" aria-labelledby="planning-tab-rooms"' : ''} class="rooms ${modern ? 'modern-rooms' : ''}" style="--room-count:${rooms.length}">${roomHtml}</div><div class="planning-settings">${this.planningSettingsHtml()}</div>${!rooms.length ? `<p class="empty">${this.ht("No enabled rooms found. Check the card configuration and room discovery.")}</p>` : ''}<footer>${this.adapter.planningHint ? `<p class="integration-hint notice">${this.ht(this.adapter.planningHint)}</p>` : ''}<div class="summary-line"><span>${this.ht('{selected} of {total} rooms selected', { selected: this.selected.length, total: rooms.length })}</span><span class="status ${this.dirty ? 'draft-status' : ''}">${this.dirty ? `<button class="discard-draft" data-focus="reset" data-action="reset" ${this.busy ? 'disabled' : ''} title="${this.ht("Discard draft")}" aria-label="${this.ht("Discard draft")}"><ha-icon icon="mdi:trash-can-outline" aria-hidden="true"></ha-icon></button>${this.ht('Local draft')}` : this.ht('From Home Assistant')}</span></div><div class="actions ${this.canOfferScheduleCreation() ? 'with-schedules' : ''}">${this.canOfferScheduleCreation() ? `<div class="room-secondary-actions"><button class="schedule-create" data-action="schedule-create" data-focus="schedule-create" aria-label="${this.ht('Create schedule')}" title="${this.ht('Create schedule')}" ${this._previewDialog || this.busy || !this.scheduleCreationReady() ? 'disabled' : ''}><ha-icon icon="mdi:calendar-plus" aria-hidden="true"></ha-icon></button>` : ''}${planning.supportsSave ? `<button data-action="save" data-focus="save" ${this._previewDialog || !hasChanges || this.busy || !planning.canSave ? 'disabled' : ''}>${this.ht(this.saving ? 'Saving …' : 'Save settings')}</button>` : ''}${this.canOfferScheduleCreation() ? '</div>' : ''}${planning.supportsStart ? `<button class="start" data-focus="start" data-action="start" ${this._previewDialog || this.selected.length === 0 || this.busy || !planning.canStart ? 'disabled' : ''}>${this.ht("Start clean")}</button>` : ''}</div></footer></div>${this.consumablesHtml()}${this.scheduleOverlayHtml()}</ha-card>`, 'planner');
    this.updateBattery();
    this.updateConsumables();
    const plannerNotice = planning.notice ? this.t(planning.notice)
      : external ? this.t('Settings changed outside this card. Your edited values remain in the local draft.') : '';
    this.updateStatus(plannerNotice);
    this.positionModernPointer();
  }
}

Object.assign(DysonCleaningPlannerCard.prototype, scheduleCardMethods);

if (!customElements.get('dyson-cleaning-planner-card')) customElements.define('dyson-cleaning-planner-card', DysonCleaningPlannerCard);
window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === 'dyson-cleaning-planner-card')) window.customCards.push({ type: 'dyson-cleaning-planner-card', name: 'Dyson Cleaning Planner', description: 'Room selection and per-room cleaning settings for Dyson Spot+Scrub.', preview: true });

// Bundled after card.js; uses the same registry connection and identity matching.
class DysonCleaningPlannerEditor extends DysonRegistryElement {
  get selectableRegistry() {
    if (this._registryLoaded) return this.registry;
    const known = new Set(this.registry.map(entry => entry.entity_id));
    return [...this.registry, ...Object.values(this._hass?.entities ?? {}).filter(entry => !known.has(entry.entity_id))];
  }
  constructor() {
    super();
    const previewInteraction = event => {
      const el = event.target.closest('input, select, button');
      if (!el) return;
      if (el.dataset.key === 'zone_dimension_unit') { this.setSessionPreview(false, true); return; }
      if (['show_camera', 'camera_entity', 'camera_rotation'].includes(el.dataset.key)) this.setSessionPreview(true);
      else if (['unsupported_settings', 'always_show_all_settings'].includes(el.dataset.key)
        || el.dataset.include || el.dataset.order || el.dataset.action === 'refresh') this.setSessionPreview(false);
    };
    for (const type of ['pointerdown', 'click', 'change', 'keydown']) {
      this.shadowRoot.addEventListener(type, event => {
        if (type !== 'keydown' || ['Enter', ' ', 'ArrowDown', 'ArrowUp', 'F4'].includes(event.key)) previewInteraction(event);
      });
    }
    this.shadowRoot.addEventListener('input', event => {
      const el = event.target;
      if (this.config && el.dataset.key === 'title') this.commit({ ...this.config, title: el.value });
    });
    this.shadowRoot.addEventListener('change', event => {
      const el = event.target;
      if (!this.config || el.dataset.key === 'title') return;
      const next = { ...this.config };
      if (el.dataset.key) {
        next[el.dataset.key] = el.type === 'checkbox' ? el.checked : el.dataset.key === 'camera_rotation' ? Number(el.value) : el.value;
        if (el.dataset.key === 'integration' && !integrationVacuumEntries(next, this.selectableRegistry, this._hass).some(e => e.entity_id === next.entity)) {
          next.entity = defaultIntegrationEntity(this._hass, next, this.registry, !!this._registryLoaded);
        }
        if (el.dataset.key === 'entity' || el.dataset.key === 'integration') {
          delete next.mode_entity; delete next.start_entity; delete next.room_entities; delete next.camera_entity;
          next.excluded_rooms = []; next.room_order = [];
        }
      } else if (el.dataset.statusItem) {
        const hidden = new Set(next.hidden_status_items ?? []);
        if (el.checked) hidden.delete(el.dataset.statusItem);
        else hidden.add(el.dataset.statusItem);
        next.hidden_status_items = [...hidden];
      } else if (el.dataset.include) {
        next.excluded_rooms = (next.excluded_rooms ?? []).filter(id => id !== el.dataset.include);
        if (!el.checked) next.excluded_rooms.push(el.dataset.include);
      } else return;
      this.commit(next);
    });
    this.shadowRoot.addEventListener('click', event => {
      const el = event.target.closest('button');
      if (el?.dataset.action === 'refresh') { this.loadRegistry(true); return; }
      if (!el?.dataset.order) return;
      const ids = this.model.rooms.map(roomKey).filter(Boolean);
      const i = ids.indexOf(el.dataset.order), j = i + Number(el.dataset.direction);
      if (i >= 0 && j >= 0 && j < ids.length) {
        [ids[i], ids[j]] = [ids[j], ids[i]];
        this.commit({ ...this.config, room_order: ids });
      }
    });
  }
  connectedCallback() {
    this._previewDialog = cardEditorDialog(this);
    super.connectedCallback();
  }
  disconnectedCallback() {
    this.setSessionPreview(false);
    this._previewDialog = null;
    super.disconnectedCallback();
  }
  setSessionPreview(active, zone = false) {
    const dialog = this._previewDialog;
    if (!dialog) return;
    if (active) sessionPreviewOwners.set(dialog, this);
    else sessionPreviewOwners.delete(dialog);
    if (zone) zonePreviewOwners.set(dialog, this);
    else zonePreviewOwners.delete(dialog);
    dialog.dispatchEvent(new Event(previewViewChanged));
  }
  setConfig(config) { this.config = { ...config }; this.update(); }
  commit(config) {
    this.config = config;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
    this.update();
  }
  update() {
    if (!this.config || !this._hass) return;
    const h = escapeHtml;
    const vacuums = integrationVacuumEntries(this.config, this.selectableRegistry, this._hass);
    const adapterLabel = entity => getIntegrationAdapter({ ...this.config, entity }, this.selectableRegistry, this._hass).shortLabel;
    const config = { ...this.config, excluded_rooms: this.config.excluded_rooms ?? [], room_order: this.config.room_order ?? [] };
    this.model = config.entity ? this.adapter.discover(this._hass, this.registry, config) : { rooms: [], issues: [] };
    const field = (key, label) => {
      const entries = this.adapter.cameraEntries(this.registry, config.entity);
      return `<label>${label}<select data-focus="${key}" data-key="${key}"><option value="">${this.ht("Auto-detect")}</option>${entries.map(e => `<option value="${h(e.entity_id)}" ${config[key] === e.entity_id ? 'selected' : ''}>${h(e.name || e.original_name || e.entity_id)}</option>`).join('')}</select></label>`;
    };
    this.paint(`<style>${styles}:host{padding:8px}label{display:grid;gap:8px;margin:0 0 16px;font-size:14px}input[type=text]{padding:12px;border:1px solid var(--dp-line);border-radius:8px;background:var(--dp-bg);color:inherit;width:100%}.entry{display:flex;gap:8px;align-items:center;margin:8px 0}.entry label{display:flex;align-items:center;flex:1;margin:0}.entry button{min-width:42px}h3{font-size:15px;margin-top:24px}.status-options{margin:12px 0 0;padding:8px 0 0 12px;border:0;border-top:1px solid var(--dp-line);min-width:0}.status-options:disabled{opacity:.5}.battery-percentage-option{padding-left:24px}.battery-percentage-option:has(input[disabled]){opacity:.5}</style>
      <label>${this.ht('Integration')}<select data-key="integration" data-focus="integration">${[['auto',this.t('Automatic')],...integrationAdapters.map(adapter => [adapter.id,this.t(adapter.label)])].map(([id,label]) => `<option value="${id}" ${(config.integration ?? 'auto') === id ? 'selected' : ''}>${h(label)}</option>`).join('')}</select></label>
      <label>${this.ht("Robot")}<select data-key="entity" data-focus="entity"><option value="">${this.ht("Select a device")}</option>${vacuums.map(e => `<option value="${h(e.entity_id)}" ${config.entity === e.entity_id ? 'selected' : ''}>${h(this._hass.states[e.entity_id]?.attributes?.friendly_name || e.entity_id)} · ${h(adapterLabel(e.entity_id))}</option>`).join('')}</select></label>
      <label>${this.ht("Title")}<input type="text" data-key="title" data-focus="title" placeholder="${this.ht('Plan a clean')}" value="${h(config.title ?? '')}"></label>
      <label>${this.ht("Language")}<select data-key="language" data-focus="language"><option value="auto" ${!config.language || config.language === 'auto' ? 'selected' : ''}>${this.ht("Automatic")}</option><option value="en" ${config.language === 'en' ? 'selected' : ''}>English [en]</option><option value="de" ${config.language === 'de' ? 'selected' : ''}>Deutsch [de]</option><option value="nl" ${config.language === 'nl' ? 'selected' : ''}>Nederlands [nl]</option><option value="fr" ${config.language === 'fr' ? 'selected' : ''}>Français [fr]</option></select></label>
      <label>${this.ht("Theme")}<select data-key="theme" data-focus="theme"><option value="classic" ${config.theme === 'classic' ? 'selected' : ''}>${this.ht("Classic")}</option><option value="modern" ${config.theme !== 'classic' ? 'selected' : ''}>${this.ht("Modern")}</option></select></label>
      ${this.adapter.supportsIntegrationIcon !== false ? `<label>${this.ht("Header icon style")}<select data-key="header_icon_style" data-focus="header-icon-style"><option value="home_assistant" ${config.header_icon_style === 'home_assistant' ? 'selected' : ''}>Home Assistant</option><option value="integration" ${(config.header_icon_style ?? 'integration') === 'integration' ? 'selected' : ''}>${this.ht("Integration")}</option></select></label>` : ''}
      ${this.adapter.supportsRoomSettings !== false ? `<div class="entry"><label><input type="checkbox" data-key="always_show_all_settings" data-focus="all-settings" ${config.always_show_all_settings === true ? 'checked' : ''}>${this.ht("Always show all settings")}</label></div>` : ''}
      <p>${this.ht(this.adapter.editorHint)}</p>
      <h3>${this.ht("Status bar")}</h3>
      <div class="entry"><label><input type="checkbox" data-key="show_status_bar" data-focus="show-status-bar" ${config.show_status_bar !== false ? 'checked' : ''}>${this.ht("Show status bar")}</label></div>
      <fieldset class="status-options" aria-label="${this.ht("Visible status indicators")}" ${config.show_status_bar === false ? 'disabled' : ''}>
        ${(this.adapter.statusBarItems ?? STATUS_BAR_ITEMS).map(([key, label]) => `<div class="entry"><label><input type="checkbox" data-status-item="${key}" data-focus="status-${key}" ${!config.hidden_status_items?.includes(key) ? 'checked' : ''}>${this.ht(label)}</label></div>`).join('')}
        <div class="entry battery-percentage-option"><label><input type="checkbox" data-key="show_battery_percentage" data-focus="show-battery-percentage" ${config.show_battery_percentage === true ? 'checked' : ''} ${config.hidden_status_items?.includes('battery') ? 'disabled' : ''}>${this.ht("Show battery percentage")}</label></div>
      </fieldset>
      ${this.adapter.supportsSessionMap !== false ? `<h3>${this.ht("Cleaning map")}</h3><div class="entry"><label><input type="checkbox" data-key="show_camera" data-focus="show-camera" ${config.show_camera !== false ? 'checked' : ''}>${this.ht("Show camera during a cleaning session")}</label></div>
      <p class="notice">${this.ht("Turning this off removes the map and stops image requests from this card.")}</p>
      ${field('camera_entity', this.ht(this.adapter.mapEntityLabel ?? 'Map camera'), 'camera')}
      <label>${this.ht("Map rotation")}<select data-key="camera_rotation" data-focus="camera-rotation">${[0, 90, 180, 270].map(deg => `<option value="${deg}" ${(config.camera_rotation ?? 0) === deg ? 'selected' : ''}>${deg}°</option>`).join('')}</select></label>` : ''}
      ${this.adapter.supportsZoneEditor !== false ? `<h3>${this.ht("Zone cleaning")}</h3>
      <label>${this.ht("Dimension display")}<select data-key="zone_dimension_unit" data-focus="zone-dimension-unit">${[['auto','Automatic'],['cm','Centimeters'],['inch','Inches'],['off','Off']].map(([value,label]) => `<option value="${value}" ${(config.zone_dimension_unit ?? 'auto') === value ? 'selected' : ''}>${this.ht(label)}</option>`).join('')}</select></label>` : ''}
      <h3>${this.ht("Rooms in this card")}</h3><p>${this.ht("Choose which rooms to show. Arrows change the display order, not the robot cleaning order.")}</p>
      ${this.model.rooms.map((r, i) => `<div class="entry"><label><input type="checkbox" data-focus="include-${i}" data-include="${h(roomKey(r))}" ${!r.excluded ? 'checked' : ''} ${!roomKey(r) ? 'disabled' : ''}>${h(r.name)}</label><button data-order="${h(roomKey(r))}" data-direction="-1" ${i === 0 ? 'disabled' : ''} aria-label="${this.ht('Move {name} up', { name: r.name })}">↑</button><button data-order="${h(roomKey(r))}" data-direction="1" ${i === this.model.rooms.length - 1 ? 'disabled' : ''} aria-label="${this.ht('Move {name} down', { name: r.name })}">↓</button></div>`).join('')}
      <button data-action="refresh" data-focus="refresh-rooms">${this.ht("Refresh rooms")}</button>
      <p class="notice">${this.ht("Rooms disabled in Home Assistant are not offered. New rooms appear automatically.")}</p><p class="notice error">${this.registryError ? this.ht(this.registryError) : this.model.issues.map(issue => this.ht(issue)).join(' ')}</p>`);
  }
}
if (!customElements.get('dyson-cleaning-planner-card-editor')) customElements.define('dyson-cleaning-planner-card-editor', DysonCleaningPlannerEditor);

